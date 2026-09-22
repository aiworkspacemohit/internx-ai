import React, { useState, useEffect } from 'react';
import { analyticsService, internshipService, applicationService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import PostJobModal from '../../components/company/PostJobModal';
import { Briefcase, Users, Calendar, Award, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CompanyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [postings, setPostings] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, postingsRes, appsRes] = await Promise.all([
        analyticsService.getCompanyAnalytics(),
        internshipService.getMyPostings(),
        applicationService.getCompanyPipeline()
      ]);
      setStats(statsRes.data);
      setPostings(postingsRes.data);
      setApplicants(appsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = [
    { name: 'Total Applicants', count: stats?.total_applicants || 0 },
    { name: 'Shortlisted', count: stats?.shortlisted_applicants || 0 },
    { name: 'Interviews', count: stats?.scheduled_interviews || 0 },
    { name: 'Offers Issued', count: stats?.offers_issued || 0 },
  ];

  if (loading) {
    return <div className="text-center py-12 text-indigo-600 text-xs font-semibold">Loading recruiter analytics...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900 max-w-[1600px] mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Corporate Recruiter Portal</h1>
          <p className="text-xs text-slate-500 font-medium">Manage active internship opportunities, candidate pipelines & schedule rounds</p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 text-lime-300" />
          <span>Post Internship</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Postings" value={stats?.total_postings || 0} icon={Briefcase} subtext="Live job listings" />
        <StatCard title="Total Candidates" value={stats?.total_applicants || 0} icon={Users} subtext="Submitted candidate resumes" />
        <StatCard title="Scheduled Interviews" value={stats?.scheduled_interviews || 0} icon={Calendar} subtext="Active technical rounds" />
        <StatCard title="Offers Issued" value={stats?.offers_issued || 0} icon={Award} subtext={`${stats?.conversion_rate_percent || 0}% Conversion`} />
      </div>

      {/* Recruitment Funnel Chart & Recent Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recruitment Funnel Chart */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Recruitment Funnel Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Recent Applicants</h3>
          <div className="space-y-3">
            {applicants.slice(0, 4).map((app) => (
              <div key={app.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{app.student?.full_name}</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">{app.status}</span>
                </div>
                <p className="text-slate-700 font-medium">{app.internship?.title}</p>
                <p className="text-[11px] text-slate-400">{app.student?.department} • CGPA: {app.student?.cgpa || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Post Modal */}
      <PostJobModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onJobPosted={fetchData}
      />

    </div>
  );
};

export default CompanyDashboard;

import React, { useState, useEffect } from 'react';
import { analyticsService, internshipService, applicationService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import PostJobModal from '../../components/company/PostJobModal';
import { Briefcase, Users, Calendar, Award, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
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
    return <div className="text-center py-12 text-indigo-400">Loading recruiter analytics...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Company Recruiter Dashboard</h1>
          <p className="text-xs md:text-sm text-slate-400">Manage active internship opportunities, applicant funnels, and schedule candidate rounds</p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="gradient-bg-primary px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Post Internship Opportunity</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Postings" value={stats?.total_postings || 0} icon={Briefcase} color="indigo" subtext="Live job listings" />
        <StatCard title="Total Candidates" value={stats?.total_applicants || 0} icon={Users} color="emerald" subtext="Submitted candidate resumes" />
        <StatCard title="Scheduled Interviews" value={stats?.scheduled_interviews || 0} icon={Calendar} color="amber" subtext="Active technical rounds" />
        <StatCard title="Offers Issued" value={stats?.offers_issued || 0} icon={Award} color="blue" subtext={`${stats?.conversion_rate_percent || 0}% Offer conversion`} />
      </div>

      {/* Recruitment Funnel Chart & Recent Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recruitment Funnel Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white">Recruitment Funnel Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white">Recent Applicants</h3>
          <div className="space-y-3">
            {applicants.slice(0, 4).map((app) => (
              <div key={app.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{app.student?.full_name}</span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{app.status}</span>
                </div>
                <p className="text-slate-400">{app.internship?.title}</p>
                <p className="text-[10px] text-slate-500">{app.student?.department} • CGPA: {app.student?.cgpa || 'N/A'}</p>
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

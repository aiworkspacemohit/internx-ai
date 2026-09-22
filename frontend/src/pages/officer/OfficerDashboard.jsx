import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import { Users, CheckCircle2, Building2, Briefcase, FileBarChart } from 'lucide-react';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const OfficerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsService.getOfficerAnalytics();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-12 text-indigo-600 text-xs font-semibold">Loading placement officer statistics...</div>;

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Officer Command Center</h1>
        <p className="text-xs text-slate-500">Monitor department placement rates, verify recruiting partners, and broadcast university drives</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats?.total_students || 0} icon={Users} subtext="Enrolled batch candidates" />
        <StatCard title="Placed Students" value={stats?.placed_students || 0} icon={CheckCircle2} subtext={`${stats?.placement_rate_percent || 0}% Placement Rate`} />
        <StatCard title="Verified Companies" value={stats?.verified_companies || 0} icon={Building2} subtext="Approved hiring partners" />
        <StatCard title="Total Opportunities" value={stats?.total_opportunities || 0} icon={Briefcase} subtext="Active drive listings" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Placement Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <FileBarChart className="w-5 h-5 text-indigo-600" />
            <span>Department-Wise Placement Statistics</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.department_wise_placements || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }} />
                <Bar dataKey="rate" fill="#4f46e5" radius={[8, 8, 0, 0]} name="Placement %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Hiring Companies */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Top Recruiting Partners</span>
          </h3>
          <div className="space-y-3">
            {stats?.top_hiring_companies?.map((comp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{comp.name}</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Avg Stipend: {comp.avg_stipend}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-zinc-900 text-white font-semibold text-[10px]">
                  {comp.hires} Hires
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default OfficerDashboard;

import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import { Users, CheckCircle2, Building2, Briefcase, Megaphone, FileBarChart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

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

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

  if (loading) return <div className="text-center py-12 text-indigo-400">Loading placement officer statistics...</div>;

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Placement Officer Command Center</h1>
        <p className="text-xs md:text-sm text-slate-400">Monitor department placement rates, verify recruiting partners, and broadcast university drives</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats?.total_students || 0} icon={Users} color="indigo" subtext="Enrolled batch candidates" />
        <StatCard title="Placed Students" value={stats?.placed_students || 0} icon={CheckCircle2} color="emerald" subtext={`${stats?.placement_rate_percent || 0}% Placement Rate`} />
        <StatCard title="Verified Companies" value={stats?.verified_companies || 0} icon={Building2} color="amber" subtext="Approved hiring partners" />
        <StatCard title="Total Opportunities" value={stats?.total_opportunities || 0} icon={Briefcase} color="blue" subtext="Active drive listings" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Placement Bar Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <FileBarChart className="w-5 h-5 text-indigo-400" />
            <span>Department-Wise Placement Statistics</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.department_wise_placements || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="rate" fill="#10b981" radius={[8, 8, 0, 0]} name="Placement %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Hiring Companies */}
        <div className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Top Recruiting Companies</span>
          </h3>
          <div className="space-y-3">
            {stats?.top_hiring_companies?.map((comp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{comp.name}</h4>
                  <span className="text-[10px] text-slate-400">Avg Stipend: {comp.avg_stipend}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
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

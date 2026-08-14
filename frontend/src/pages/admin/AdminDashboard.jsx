import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import { Users, Building2, UserCheck, ShieldCheck, Activity, UserPlus, Settings, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsService.getAdminAnalytics();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-12 text-indigo-400">Loading system administration metrics...</div>;

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80 bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">System Administration Console</h1>
          <p className="text-xs md:text-sm text-slate-400">Platform user administration, company approvals, officer provisioning, and system audit logs</p>
        </div>
        <Link
          to="/admin/officers"
          className="gradient-bg-primary px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 hover:scale-105 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision Placement Officer</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Platform Users" value={stats?.total_users || 0} icon={Users} color="indigo" subtext={`${stats?.students_count || 0} Students enrolled`} />
        <StatCard title="Companies Registered" value={stats?.companies_count || 0} icon={Building2} color="emerald" subtext={`${stats?.pending_company_approvals || 0} Pending Approvals`} />
        <StatCard title="Placement Officers" value={stats?.officers_count || 0} icon={UserCheck} color="amber" subtext="Active officer accounts" />
        <StatCard title="System Health" value={stats?.system_health || 'Healthy'} icon={Activity} color="rose" subtext="All microservices operational" />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link to="/admin/users" className="glass-card p-6 rounded-2xl border border-slate-700/80 glass-card-hover space-y-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 w-fit">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">User Controls & Security</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Manage user accounts, view active roles, and toggle account activation status across all stakeholders.
          </p>
        </Link>

        <Link to="/admin/approvals" className="glass-card p-6 rounded-2xl border border-slate-700/80 glass-card-hover space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Company Approvals Queue</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Review pending company registration requests and authorize corporate accounts to list internships.
          </p>
        </Link>

        <Link to="/admin/officers" className="glass-card p-6 rounded-2xl border border-slate-700/80 glass-card-hover space-y-3">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 w-fit">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Create Placement Officers</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Provision official university placement cell officer credentials for department monitoring.
          </p>
        </Link>

      </div>

    </div>
  );
};

export default AdminDashboard;

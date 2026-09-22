import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import { Users, Building2, UserCheck, Activity, UserPlus, CheckCircle2 } from 'lucide-react';

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

  if (loading) return <div className="text-center py-12 text-indigo-600 text-xs font-semibold">Loading system administration metrics...</div>;

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900 max-w-[1600px] mx-auto">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Administration Console</h1>
          <p className="text-xs text-slate-500 font-medium">Platform user administration, company approvals, officer provisioning & audit logs</p>
        </div>
        <Link
          to="/admin/officers"
          className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs shrink-0"
        >
          <UserPlus className="w-4 h-4 text-lime-300" />
          <span>Provision Officer</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Platform Users" value={stats?.total_users || 0} icon={Users} subtext={`${stats?.students_count || 0} Students enrolled`} />
        <StatCard title="Companies Registered" value={stats?.companies_count || 0} icon={Building2} subtext={`${stats?.pending_company_approvals || 0} Pending Approvals`} />
        <StatCard title="Placement Officers" value={stats?.officers_count || 0} icon={UserCheck} subtext="Active officer accounts" />
        <StatCard title="System Health" value={stats?.system_health || 'Healthy'} icon={Activity} subtext="All microservices operational" />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link to="/admin/users" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition space-y-4 group">
          <div className="p-3 rounded-2xl bg-zinc-900 text-white w-fit shadow-xs group-hover:bg-indigo-600 transition">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">User Directory & Controls</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Manage user accounts, view active roles, and toggle account activation status across all stakeholders.
          </p>
        </Link>

        <Link to="/admin/approvals" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition space-y-4 group">
          <div className="p-3 rounded-2xl bg-zinc-900 text-white w-fit shadow-xs group-hover:bg-indigo-600 transition">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">Company Approvals Queue</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Review pending company registration requests and authorize corporate accounts to list internships.
          </p>
        </Link>

        <Link to="/admin/officers" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition space-y-4 group">
          <div className="p-3 rounded-2xl bg-zinc-900 text-white w-fit shadow-xs group-hover:bg-indigo-600 transition">
            <UserPlus className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">Create Placement Officers</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Provision official university placement cell officer credentials for department monitoring.
          </p>
        </Link>

      </div>

    </div>
  );
};

export default AdminDashboard;

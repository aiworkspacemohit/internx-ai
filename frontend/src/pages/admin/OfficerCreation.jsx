import React, { useState } from 'react';
import { userService } from '../../services/api';
import { UserPlus, CheckCircle2 } from 'lucide-react';

const OfficerCreation = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    department: 'Computer Science & Engineering',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');

    try {
      await userService.createOfficer(formData);
      setMsg(`Placement Officer '${formData.full_name}' provisioned successfully!`);
      setFormData({ email: '', password: '', full_name: '', phone: '', department: 'Computer Science & Engineering' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create placement officer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto text-slate-900">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Provision Placement Officer Account</h1>
        <p className="text-xs text-slate-500">As specified by platform policy, Placement Officer accounts are created exclusively by the Administrator</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
        {msg && <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">{msg}</div>}
        {error && <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Officer Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Eleanor Vance"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">University Email Address *</label>
            <input
              type="email"
              required
              placeholder="officer@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Temporary Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Assigned Department / Cell *</label>
            <input
              type="text"
              required
              placeholder="e.g. Computer Science & Engineering"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 transition shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-lime-300" />
            <span>{loading ? 'Creating Account...' : 'Provision Officer Account'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfficerCreation;

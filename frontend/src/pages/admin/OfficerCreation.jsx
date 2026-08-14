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
    <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-extrabold text-white">Provision Placement Officer Account</h1>
        <p className="text-xs text-slate-400">As specified by platform policy, Placement Officer accounts are created exclusively by the Administrator</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4 text-sm">
        {msg && <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold">{msg}</div>}
        {error && <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 text-xs">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Officer Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Eleanor Vance"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">University Email Address *</label>
            <input
              type="email"
              required
              placeholder="officer@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Temporary Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Department / Cell *</label>
            <input
              type="text"
              required
              placeholder="e.g. Computer Science & Engineering"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="gradient-bg-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Provision Officer Account'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfficerCreation;

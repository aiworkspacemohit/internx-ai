import React, { useState, useEffect } from 'react';
import { companyService } from '../../services/api';
import { Building2, Globe, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';

const CompanyProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await companyService.getMyProfile();
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await companyService.updateMyProfile(profile);
      setMsg('Company profile updated successfully!');
    } catch (err) {
      setMsg('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-indigo-400">Loading company profile...</div>;

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-white">{profile?.company_name}</h1>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            profile?.is_approved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
          }`}>
            Verification: {profile?.verification_status}
          </span>
        </div>
        <p className="text-xs text-slate-400">Manage corporate branding and recruiter contact information</p>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
            <input
              type="text"
              value={profile?.company_name || ''}
              onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Industry Sector</label>
            <input
              type="text"
              value={profile?.industry || ''}
              onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Website</label>
            <input
              type="url"
              value={profile?.website || ''}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Headquarters Location</label>
            <input
              type="text"
              value={profile?.location || ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Company Description</label>
          <textarea
            rows={4}
            value={profile?.description || ''}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="gradient-bg-primary px-6 py-2.5 rounded-xl font-bold text-xs"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfilePage;

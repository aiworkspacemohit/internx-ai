import React, { useState, useEffect } from 'react';
import { companyService } from '../../services/api';

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

  if (loading) return <div className="text-center py-12 text-indigo-600 text-xs font-semibold">Loading company profile...</div>;

  return (
    <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto text-slate-900">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{profile?.company_name}</h1>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            profile?.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            Verification: {profile?.verification_status}
          </span>
        </div>
        <p className="text-xs text-slate-500">Manage corporate branding and recruiter contact information</p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Name</label>
            <input
              type="text"
              value={profile?.company_name || ''}
              onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Industry Sector</label>
            <input
              type="text"
              value={profile?.industry || ''}
              onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Corporate Website</label>
            <input
              type="url"
              value={profile?.website || ''}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Headquarters Location</label>
            <input
              type="text"
              value={profile?.location || ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Description</label>
          <textarea
            rows={4}
            value={profile?.description || ''}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl p-3.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition shadow-xs"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfilePage;

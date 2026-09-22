import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services/api';
import { Megaphone } from 'lucide-react';

const OfficerAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_department: 'ALL',
    priority: 'HIGH'
  });
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementService.getAnnouncements();
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishing(true);
    setMsg('');
    try {
      await announcementService.create(formData);
      setMsg('Announcement broadcasted to students successfully!');
      setFormData({ title: '', content: '', target_department: 'ALL', priority: 'HIGH' });
      fetchAnnouncements();
    } catch (err) {
      setMsg('Failed to publish announcement');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900 max-w-[1600px] mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Broadcast Placement Announcements</h1>
        <p className="text-xs text-slate-500">Publish urgent notices and recruitment schedules to students</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
        {msg && <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">{msg}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Notice Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Google Placement Drive Schedule Update"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            >
              <option value="URGENT">URGENT</option>
              <option value="HIGH">HIGH</option>
              <option value="NORMAL">NORMAL</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Announcement Body Content *</label>
          <textarea
            rows={4}
            required
            placeholder="Type your notice text..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl p-3.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        <button
          type="submit"
          disabled={publishing}
          className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 transition shadow-xs"
        >
          <Megaphone className="w-4 h-4 text-lime-300" />
          <span>{publishing ? 'Broadcasting...' : 'Broadcast Notice'}</span>
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Active Notices</h3>
        {announcements.map((a) => (
          <div key={a.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{a.title}</span>
              <span className="text-[10px] text-slate-400 font-medium">{new Date(a.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficerAnnouncements;

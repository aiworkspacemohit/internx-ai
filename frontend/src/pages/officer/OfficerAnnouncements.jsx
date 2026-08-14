import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services/api';
import { Megaphone, Plus, Calendar } from 'lucide-react';

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
    <div className="space-y-6 animate-in fade-in">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-extrabold text-white">Broadcast Placement Announcements</h1>
        <p className="text-xs text-slate-400">Publish urgent notices and recruitment schedules to students</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4 text-sm">
        {msg && <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs">{msg}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Google Placement Drive Schedule Update"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="URGENT">URGENT</option>
              <option value="HIGH">HIGH</option>
              <option value="NORMAL">NORMAL</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement Body Content *</label>
          <textarea
            rows={4}
            required
            placeholder="Type your notice text..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={publishing}
          className="gradient-bg-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2"
        >
          <Megaphone className="w-4 h-4" />
          <span>{publishing ? 'Broadcasting...' : 'Broadcast Notice'}</span>
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Active Notices</h3>
        {announcements.map((a) => (
          <div key={a.id} className="glass-card p-5 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400">{a.title}</span>
              <span className="text-[10px] text-slate-500">{new Date(a.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-slate-300">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficerAnnouncements;

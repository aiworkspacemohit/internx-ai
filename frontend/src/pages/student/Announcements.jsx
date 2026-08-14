import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services/api';
import { Megaphone, Calendar, Tag, AlertTriangle } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await announcementService.getAnnouncements();
        setAnnouncements(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-extrabold text-white">Campus Placement Announcements</h1>
        <p className="text-xs text-slate-400">Official updates broadcasted by university placement officers</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-indigo-400">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center text-slate-400 text-xs">
          No active announcements.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  a.priority === 'URGENT'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  Priority: {a.priority}
                </span>
                <span className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString()}</span>
              </div>

              <h3 className="text-lg font-bold text-white">{a.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{a.content}</p>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Target Department: <strong className="text-indigo-400">{a.target_department}</strong></span>
                <span>Posted by Placement Cell</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;

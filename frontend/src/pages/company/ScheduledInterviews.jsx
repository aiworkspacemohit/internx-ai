import React, { useState, useEffect } from 'react';
import { interviewService } from '../../services/api';
import { Calendar, Clock, Video, UserCheck } from 'lucide-react';

const ScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await interviewService.getCompanyInterviews();
        setInterviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-extrabold text-white">Recruiter Interview Schedule</h1>
        <p className="text-xs text-slate-400">View all upcoming interview sessions across job postings</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-indigo-400">Loading scheduled rounds...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {interviews.map((item) => (
            <div key={item.id} className="glass-card p-5 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.round_name}
                </span>
                <span className="text-xs text-slate-400">{item.status}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{item.application?.student?.full_name}</h3>
                <p className="text-xs text-indigo-400 font-semibold">{item.application?.internship?.title}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{new Date(item.scheduled_at).toLocaleString()}</span>
                </div>
                {item.interviewer_name && (
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                    <span>Assigned Interviewer: {item.interviewer_name}</span>
                  </div>
                )}
              </div>

              {item.meeting_link && (
                <a
                  href={item.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full gradient-bg-primary py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch Recruiter Video Room</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledInterviews;

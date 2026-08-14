import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/api';
import ApplicationTimeline from '../../components/student/ApplicationTimeline';
import { Briefcase, Calendar, Award, ExternalLink, MessageSquare } from 'lucide-react';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await applicationService.getStudentApps();
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-extrabold text-white">Application Tracker</h1>
        <p className="text-xs text-slate-400">Monitor your recruitment progress across all stages in real-time</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-indigo-400">Loading application timeline...</div>
      ) : applications.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center text-slate-400 text-xs">
          No applications submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">{app.internship?.title}</h3>
                  <p className="text-xs text-indigo-400 font-semibold">{app.internship?.company?.company_name}</p>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Status: {app.status}
                  </span>
                </div>
              </div>

              {/* Stage-by-Stage Interactive Timeline */}
              <ApplicationTimeline currentStatus={app.status} />

              {app.feedback && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 flex items-start space-x-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indigo-300">Recruiter Feedback: </span>
                    {app.feedback}
                  </div>
                </div>
              )}

              {app.offer_letter_url && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                  <span className="font-bold flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Official Placement Offer Issued!</span>
                  </span>
                  <a
                    href={app.offer_letter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-emerald-400 font-bold flex items-center space-x-1"
                  >
                    <span>View Offer Letter</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;

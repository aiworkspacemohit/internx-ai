import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/api';
import InterviewSchedulerModal from '../../components/company/InterviewSchedulerModal';
import { Users, Filter, Calendar, Award, CheckCircle, XCircle, ArrowRight, ExternalLink } from 'lucide-react';

const ApplicantPipeline = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchPipeline = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getCompanyPipeline({ status: selectedStatus });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, [selectedStatus]);

  const handleStatusChange = async (appId, newStatus) => {
    setStatusUpdating(true);
    try {
      await applicationService.updateStatus(appId, { status: newStatus });
      fetchPipeline();
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Applicant Pipeline Kanban & List</h1>
          <p className="text-xs text-slate-400">Review candidate profiles, change status, and schedule interview rounds</p>
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="ONLINE_ASSESSMENT">Assessment</option>
          <option value="INTERVIEW_ROUND">Interview Round</option>
          <option value="HR_ROUND">HR Round</option>
          <option value="OFFER">Offer Issued</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-indigo-400">Loading candidate pipeline...</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="glass-card p-5 rounded-2xl border border-slate-700/80 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-sm border border-indigo-500/30">
                    {app.student?.full_name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{app.student?.full_name}</h3>
                    <p className="text-xs text-indigo-400 font-semibold">{app.internship?.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {app.student?.email} • {app.student?.department} • CGPA: {app.student?.cgpa || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Status Dropdown Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    disabled={statusUpdating}
                    className="bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="ONLINE_ASSESSMENT">Assessment</option>
                    <option value="INTERVIEW_ROUND">Tech Interview</option>
                    <option value="HR_ROUND">HR Round</option>
                    <option value="OFFER">Issue Offer</option>
                    <option value="REJECTED">Reject</option>
                  </select>

                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setShowInterviewModal(true);
                    }}
                    className="p-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold flex items-center space-x-1.5 border border-amber-500/30"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Interview</span>
                  </button>
                </div>

              </div>

              {app.cover_letter && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-slate-400 block mb-1">Cover Note:</span>
                  <p className="italic">{app.cover_letter}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Scheduler Modal */}
      <InterviewSchedulerModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        application={selectedApp}
        onInterviewScheduled={fetchPipeline}
      />
    </div>
  );
};

export default ApplicantPipeline;

import React, { useState } from 'react';
import { interviewService } from '../../services/api';
import { X, Calendar } from 'lucide-react';

const InterviewSchedulerModal = ({ isOpen, onClose, application, onInterviewScheduled }) => {
  const [formData, setFormData] = useState({
    round_name: 'Technical Round 1',
    scheduled_at: '',
    duration_minutes: 45,
    meeting_link: 'https://meet.google.com/internx-interview-demo',
    interviewer_name: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !application) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await interviewService.schedule({
        application_id: application.id,
        ...formData,
      });
      onInterviewScheduled();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-slate-900">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Schedule Candidate Interview</h3>
              <p className="text-xs text-slate-400">{application.student?.full_name} • {application.internship?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Interview Round Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Technical Round 1 - Coding"
              value={formData.round_name}
              onChange={(e) => setFormData({ ...formData, round_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.scheduled_at}
                onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Duration (Minutes)</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Meeting Link</label>
            <input
              type="url"
              placeholder="Google Meet or Zoom URL"
              value={formData.meeting_link}
              onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Interviewer Name(s)</label>
            <input
              type="text"
              placeholder="e.g. David Zhang (Senior Engineer)"
              value={formData.interviewer_name}
              onChange={(e) => setFormData({ ...formData, interviewer_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-zinc-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold transition shadow-xs"
            >
              {loading ? 'Scheduling...' : 'Schedule & Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewSchedulerModal;

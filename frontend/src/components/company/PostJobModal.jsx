import React, { useState } from 'react';
import { internshipService } from '../../services/api';
import { X, Briefcase, DollarSign, MapPin, Calendar, Layers, CheckCircle } from 'lucide-react';

const PostJobModal = ({ isOpen, onClose, onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '',
    role_category: 'Full Stack',
    stipend: '$3,000/month',
    location: 'Remote',
    duration: '12 Weeks',
    openings: 2,
    description: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await internshipService.create(formData);
      onJobPosted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to publish internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Post New Internship Opportunity</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Position Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Software Engineering Intern"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Category *</label>
              <select
                value={formData.role_category}
                onChange={(e) => setFormData({ ...formData, role_category: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Full Stack">Full Stack</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="AI/ML">AI / Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="DevOps">DevOps & Cloud</option>
                <option value="UI/UX">UI / UX Design</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stipend *</label>
              <input
                type="text"
                required
                placeholder="e.g. $3,000/mo or Unpaid"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Remote / New York"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration *</label>
              <input
                type="text"
                required
                placeholder="e.g. 12 Weeks / 6 Months"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe candidate responsibilities, team environment, and goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills & Qualifications</label>
            <textarea
              rows={2}
              placeholder="e.g. Python, React, FastAPI, SQL, Data Structures..."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="gradient-bg-primary px-5 py-2 rounded-xl font-semibold text-xs flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{loading ? 'Publishing...' : 'Publish Internship'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobModal;

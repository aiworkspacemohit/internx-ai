import React, { useState } from 'react';
import { internshipService } from '../../services/api';
import { X, Briefcase, CheckCircle } from 'lucide-react';

const PostJobModal = ({ isOpen, onClose, onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '',
    role_category: 'Full Stack',
    stipend: '₹35,000/month',
    location: 'Bangalore (Hybrid)',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col text-slate-900">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Post New Internship Opportunity</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Position Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Software Engineering Intern"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Role Category *</label>
              <select
                value={formData.role_category}
                onChange={(e) => setFormData({ ...formData, role_category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Stipend (₹ / Month) *</label>
              <input
                type="text"
                required
                placeholder="e.g. ₹35,000/mo or Unpaid"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bangalore / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Duration *</label>
              <input
                type="text"
                required
                placeholder="e.g. 12 Weeks / 6 Months"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe candidate responsibilities, team environment, and goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl p-3.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Required Skills & Qualifications</label>
            <textarea
              rows={2}
              placeholder="e.g. Python, React, FastAPI, SQL, Data Structures..."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl p-3.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
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
              className="bg-zinc-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold transition shadow-xs flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4 text-lime-300" />
              <span>{loading ? 'Publishing...' : 'Publish Internship'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobModal;

import React, { useState, useEffect } from 'react';
import { internshipService } from '../../services/api';
import PostJobModal from '../../components/company/PostJobModal';
import { Briefcase, Plus, MapPin, DollarSign, Clock, Trash2, Edit } from 'lucide-react';

const JobPostings = () => {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);

  const fetchPostings = async () => {
    try {
      setLoading(true);
      const res = await internshipService.getMyPostings();
      setPostings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await internshipService.delete(id);
      fetchPostings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Job Postings Manager</h1>
          <p className="text-xs text-slate-400">Publish and manage active company internship opportunities</p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="gradient-bg-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Post Internship</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-indigo-400">Loading postings...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {postings.map((job) => (
            <div key={job.id} className="glass-card p-5 rounded-2xl border border-slate-700/80 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {job.role_category}
                  </span>
                  <span className="text-xs text-slate-500">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base font-bold text-white">{job.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{job.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Stipend: <strong className="text-emerald-400">{job.stipend}</strong></span>
                  <span>Location: <strong>{job.location}</strong></span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-500 text-[11px]">Openings: {job.openings}</span>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PostJobModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onJobPosted={fetchPostings}
      />
    </div>
  );
};

export default JobPostings;

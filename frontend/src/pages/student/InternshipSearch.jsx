import React, { useState, useEffect } from 'react';
import { internshipService, applicationService } from '../../services/api';
import { Search, Filter, MapPin, DollarSign, Clock, Building2, CheckCircle2, ArrowRight, X } from 'lucide-react';

const InternshipSearch = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await internshipService.getInternships({ search, category });
      setInternships(res.data);
      
      const appsRes = await applicationService.getStudentApps();
      const ids = new Set(appsRes.data.map(a => a.internship_id));
      setAppliedJobIds(ids);
    } catch (err) {
      console.error("Failed to load internships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category]);

  const handleApply = async (internshipId) => {
    setApplying(true);
    setMessage('');
    try {
      await applicationService.apply({
        internship_id: internshipId,
        cover_letter: coverLetter || "Submitted via InternX AI One-Click Application System."
      });
      setAppliedJobIds(prev => new Set(prev).add(internshipId));
      setMessage('Application submitted successfully!');
      setTimeout(() => setSelectedJob(null), 1500);
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Application submission failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Search Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Explore Internships</h1>
          <p className="text-xs text-slate-400">Discover verified opportunities posted by top global companies</p>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by role title or skill (e.g. FastAPI, Python, React)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Backend">Backend</option>
              <option value="Frontend">Frontend</option>
              <option value="AI/ML">AI / Machine Learning</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>
        </div>
      </div>

      {/* Internship Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-indigo-400">Loading internships...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {internships.map((job) => {
            const isApplied = appliedJobIds.has(job.id);

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="glass-card p-5 rounded-2xl border border-slate-700/70 glass-card-hover cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 text-base">
                      {job.company?.company_name?.charAt(0) || 'C'}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {job.role_category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{job.title}</h3>
                    <p className="text-xs text-indigo-400 font-semibold mt-0.5">{job.company?.company_name}</p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{job.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300 font-medium">
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{job.stipend}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{job.location}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">{job.duration}</span>
                    {isApplied ? (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1 bg-emerald-500/10 px-2 py-1 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <span className="text-xs text-indigo-400 font-bold hover:underline flex items-center space-x-1">
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Details Modal Drawer */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card w-full max-w-xl rounded-3xl border border-slate-700/80 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedJob.title}</h2>
                <p className="text-sm text-indigo-400 font-semibold">{selectedJob.company?.company_name}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && (
              <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs">
                {message}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 text-xs p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-slate-500 block">Stipend</span>
                <span className="font-bold text-emerald-400">{selectedJob.stipend}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location</span>
                <span className="font-bold text-slate-200">{selectedJob.location}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Duration</span>
                <span className="font-bold text-slate-200">{selectedJob.duration}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider">Role Description</h4>
              <p className="text-slate-400 leading-relaxed">{selectedJob.description}</p>
            </div>

            {selectedJob.requirements && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider">Requirements & Skills</h4>
                <p className="text-slate-400 leading-relaxed">{selectedJob.requirements}</p>
              </div>
            )}

            {!appliedJobIds.has(selectedJob.id) && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-300">Cover Letter Note (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Tell the recruiter why you're a great fit for this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Close
              </button>
              {appliedJobIds.has(selectedJob.id) ? (
                <button disabled className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-xl text-xs font-bold border border-emerald-500/30">
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={applying}
                  className="gradient-bg-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  {applying ? 'Submitting Application...' : 'One-Click Apply'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InternshipSearch;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { GraduationCap, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    company_name: '',
    industry: 'Technology',
    website: '',
    location: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.registerCompany(formData);
      setSubmittedMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f9] text-slate-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* Left Side: Indigo Branding Hero */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white text-indigo-700 flex items-center justify-center font-bold shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                InternX<span className="text-lime-300">.ai</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-lime-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Corporate Recruiter Access</span>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="relative z-10 space-y-4 my-6">
            <h2 className="text-2xl font-bold leading-tight text-white">
              Hire Top University Talent Faster
            </h2>
            
            <ul className="space-y-2.5 text-xs text-indigo-100 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300 shrink-0" />
                <span>Automated Gemini Candidate AI Screening</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300 shrink-0" />
                <span>Direct Placement Officer Telemetry</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300 shrink-0" />
                <span>Instant Interview & Offer Management</span>
              </li>
            </ul>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-indigo-200">
            <span>Enterprise Partner Access</span>
            <ShieldCheck className="w-4 h-4 text-lime-300" />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 bg-white p-8 sm:p-10 flex flex-col justify-center space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-600 block">Corporate Signup</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Register organization</h2>
            <p className="text-xs text-slate-500">Provide details for placement officer verification.</p>
          </div>

          {submittedMessage ? (
            <div className="p-8 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-indigo-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Registration Submitted!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{submittedMessage}</p>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center space-x-2 bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-black transition shadow-sm"
              >
                <span>Return to Login</span>
                <ArrowRight className="w-4 h-4 text-lime-300" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Technologies"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recruiter Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sarah Jenkins"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Overview</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of company products & talent needs..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 text-white font-semibold text-xs py-3 rounded-xl hover:bg-black transition shadow-sm flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Submitting...' : 'Submit Verification Request'}</span>
                <ArrowRight className="w-4 h-4 text-lime-300" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;

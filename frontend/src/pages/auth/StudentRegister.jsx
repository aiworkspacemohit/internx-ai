import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { Sparkles, Mail, Lock, KeyRound, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const StudentRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Gmail & Request OTP, 2: Enter OTP & Profile
  
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    otp_code: '',
    password: '',
    phone: '',
    department: 'Computer Science',
    cgpa: '',
    skills: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  // Step 1: Send OTP to Gmail
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@gmail.com')) {
      setError('Student registration is strictly restricted to valid original @gmail.com addresses.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendOtp({
        email: cleanEmail,
        full_name: formData.full_name,
      });
      setSuccessMsg(res.data.message || '6-digit OTP code sent to your Gmail!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP code. Please check your Gmail address.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Complete Signup
  const handleVerifyAndSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.otp_code || formData.otp_code.trim().length !== 6) {
      setError('Please enter the valid 6-digit OTP code sent to your Gmail inbox.');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtpAndRegister({
        ...formData,
        email: formData.email.trim().toLowerCase(),
      });
      setSuccessMsg('Account verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login?registered=student');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.detail || 'OTP Verification failed. Please verify your code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none"></div>

      <div className="w-full max-w-lg glass-card p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles size={14} /> Student Placement Registration
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Your Student Account</h2>
          <p className="text-xs text-slate-400">Verified Gmail Signup with Instant OTP Authentication</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>1</span>
            Gmail & OTP
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-slate-800">
            <div className={`h-full transition-all duration-300 ${step === 2 ? 'bg-indigo-500 w-full' : 'w-0'}`}></div>
          </div>
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>2</span>
            Verify & Profile
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1 FORM: Send OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Alex Rivera"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Official Student Gmail Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="alex.rivera@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                />
                <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Must be an original <span className="text-indigo-400 font-mono">@gmail.com</span> address.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg-primary py-3 rounded-xl font-bold text-white text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:opacity-95"
            >
              {loading ? (
                <span>Sending OTP to Gmail...</span>
              ) : (
                <>
                  <span>Send Verification OTP</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2 FORM: Verify OTP & Profile Details */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndSubmit} className="space-y-4 text-sm">
            <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl text-xs text-indigo-300 flex items-center justify-between">
              <div>
                <span className="text-slate-400">Target Gmail: </span>
                <strong className="text-white font-mono">{formData.email}</strong>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-indigo-400 hover:underline font-semibold"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter 6-Digit Gmail OTP *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={formData.otp_code}
                  onChange={(e) => setFormData({ ...formData, otp_code: e.target.value })}
                  className="w-full bg-slate-900/80 border border-indigo-500/50 rounded-xl pl-9 pr-3.5 py-2.5 text-white font-mono text-base tracking-widest focus:outline-none focus:border-indigo-400 transition"
                />
                <KeyRound size={16} className="absolute left-3 top-3.5 text-indigo-400" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Check your Gmail inbox (and Spam folder) for your code.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Account Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                  <Lock size={15} className="absolute left-3 top-3 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">CGPA / GPA</label>
                <input
                  type="text"
                  placeholder="e.g. 3.8 / 4.0"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Technical Skills (Comma separated)</label>
              <input
                type="text"
                placeholder="Python, React, FastAPI, SQL, Git..."
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg-primary py-3 rounded-xl font-bold text-white text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:opacity-95"
            >
              {loading ? 'Verifying OTP & Registering...' : 'Verify OTP & Complete Registration'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default StudentRegister;

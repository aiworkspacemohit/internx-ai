import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { GraduationCap, Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#f0f2f9]">
      
      {/* Edu.ai Split Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        
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
              <span>Student Candidate Portal</span>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-4 my-6">
            <h2 className="text-2xl font-bold leading-tight text-white">
              Launch Your Career Trajectory
            </h2>
            
            <ul className="space-y-2.5 text-xs text-indigo-100 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300 shrink-0" />
                <span>Instant Gmail OTP Security Verification</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300 shrink-0" />
                <span>Automated AI Match with Verified Corporates</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300 shrink-0" />
                <span>Direct Placement Cell Application Tracker</span>
              </li>
            </ul>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-indigo-200">
            <span>Verified Candidate Signup</span>
            <ShieldCheck className="w-4 h-4 text-lime-300" />
          </div>

        </div>

        {/* Right Side: Form Container */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-indigo-600 block mb-1">Student Signup</span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Create student account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Verified Gmail registration with instant 6-digit OTP code verification.
              </p>
            </div>

            {/* Step Progress Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
                Gmail & OTP
              </div>
              <div className="h-0.5 flex-1 mx-3 bg-slate-200">
                <div className={`h-full transition-all duration-300 ${step === 2 ? 'bg-indigo-600 w-full' : 'w-0'}`}></div>
              </div>
              <div className={`flex items-center gap-2 ${step === 2 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
                Profile & Details
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
                {successMsg}
              </div>
            )}

            {/* STEP 1: Send OTP */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Student Gmail *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex.rivera@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Must be an original @gmail.com address.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-black text-white font-semibold text-xs py-3 px-5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm mt-2"
                >
                  <span>{loading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
                  <ArrowRight className="w-4 h-4 text-lime-300" />
                </button>
              </form>
            )}

            {/* STEP 2: Verify OTP & Details */}
            {step === 2 && (
              <form onSubmit={handleVerifyAndSubmit} className="space-y-3 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Target Gmail: </span>
                    <strong className="text-slate-900">{formData.email}</strong>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="text-indigo-600 font-semibold hover:underline">
                    Change
                  </button>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enter 6-Digit Gmail OTP *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={formData.otp_code}
                    onChange={(e) => setFormData({ ...formData, otp_code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 tracking-widest focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Python, React, FastAPI, SQL..."
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-black text-white font-semibold text-xs py-3 px-5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm mt-2"
                >
                  <span>{loading ? 'Verifying...' : 'Complete Registration'}</span>
                </button>
              </form>
            )}

          </div>

          {/* Footer Link */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Already registered?</span>
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Sign In</Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentRegister;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('STUDENT'); // STUDENT, COMPANY, OFFICER, ADMIN
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      
      switch (user.role) {
        case 'STUDENT': navigate('/student/dashboard'); break;
        case 'COMPANY': navigate('/company/dashboard'); break;
        case 'OFFICER': navigate('/officer/dashboard'); break;
        case 'ADMIN': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const getRolePlaceholder = () => {
    switch (selectedRole) {
      case 'STUDENT': return 'student@gmail.com';
      case 'COMPANY': return 'recruiter@company.com';
      case 'OFFICER': return 'officer@university.edu';
      case 'ADMIN': return 'admin@internx.ai';
      default: return 'name@domain.com';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#f0f2f9]">
      
      {/* Edu.ai Split Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        
        {/* Left Side: Indigo Company Branding & Hero Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
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
              <span>Placement Intelligence</span>
            </div>
          </div>

          {/* Hero Feature List */}
          <div className="relative z-10 space-y-4 my-6">
            <h2 className="text-2xl font-bold leading-tight text-white">
              AI-Powered Campus Recruitment Engine
            </h2>
            
            <ul className="space-y-2.5 text-xs text-indigo-100 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300 shrink-0" />
                <span>Automated Gemini ATS Resume Scoring</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300 shrink-0" />
                <span>Real-Time Placement Telemetry & Analytics</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-lime-300 shrink-0" />
                <span>One-Click Corporate Recruiter Pipeline</span>
              </li>
            </ul>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-indigo-200">
            <span>Enterprise Campus System</span>
            <ShieldCheck className="w-4 h-4 text-lime-300" />
          </div>

        </div>

        {/* Right Side: Clean White Form Container */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          
          <div className="space-y-5">
            
            {/* Form Headline */}
            <div>
              <span className="text-xs font-semibold text-indigo-600 block mb-1">Single Sign-On</span>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Select your role and enter your registered account credentials.
              </p>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
              {['STUDENT', 'COMPANY', 'OFFICER', 'ADMIN'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => { setSelectedRole(role); setError(''); }}
                  className={`py-2 px-1 rounded-lg transition text-xs font-semibold ${
                    selectedRole === role
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {role.charAt(0) + role.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder={getRolePlaceholder()}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-semibold py-3 px-5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-[0.99] mt-2"
              >
                <span>{loading ? 'Authenticating...' : `Sign in as ${selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}`}</span>
                <ArrowRight className="w-4 h-4 text-lime-300" />
              </button>
            </form>

          </div>

          {/* Bottom Links */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Don't have an account?</span>
            <div className="flex items-center space-x-3 font-semibold text-indigo-600">
              <Link to="/register/student" className="hover:underline">Student Signup</Link>
              <span className="text-slate-300">•</span>
              <Link to="/register/company" className="hover:underline">Company Portal</Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;

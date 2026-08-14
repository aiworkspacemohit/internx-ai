import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoFill = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
  };

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
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0b0f19]">
      {/* Background Decorative Glow Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300">Next-Gen Placement Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
            Welcome to <span className="gradient-text">InternX AI</span>
          </h1>
          <p className="text-xs text-slate-400">Sign in to access your role-based placement portal</p>
        </div>

        {/* Login Glass Card */}
        <div className="glass-card p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg-primary py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Presets */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Instant Demo One-Click Sign In
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <button
                onClick={() => handleDemoFill('alex.rivera@student.edu', 'Student@123')}
                className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/40 text-center transition"
              >
                🎓 Student Demo
              </button>
              <button
                onClick={() => handleDemoFill('recruiter@google.com', 'Company@123')}
                className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 text-center transition"
              >
                🏢 Company Demo
              </button>
              <button
                onClick={() => handleDemoFill('officer@university.edu', 'Officer@123')}
                className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40 text-center transition"
              >
                🏛️ Officer Demo
              </button>
              <button
                onClick={() => handleDemoFill('admin@internx.ai', 'Admin@123')}
                className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 text-center transition"
              >
                ⚡ Admin Demo
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-400 space-y-1">
            <p>Don't have an account?</p>
            <div className="flex justify-center space-x-4 font-semibold">
              <Link to="/register/student" className="text-indigo-400 hover:text-indigo-300">
                Register as Student
              </Link>
              <span>•</span>
              <Link to="/register/company" className="text-emerald-400 hover:text-emerald-300">
                Register as Company
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

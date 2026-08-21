import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, UserCheck, GraduationCap, Building2, ShieldCheck, UserCog } from 'lucide-react';

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
      
      // Optional role check validation
      if (selectedRole && user.role !== selectedRole) {
        // Redirect according to actual user role
      }

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0b0f19]">
      {/* Background Decorative Glow Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300">Next-Gen Placement Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
            Welcome to <span className="gradient-text">InternX AI</span>
          </h1>
          <p className="text-xs text-slate-400">Sign in to access your placement dashboard</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setSelectedRole('STUDENT'); setError(''); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              selectedRole === 'STUDENT'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap size={15} />
            <span className="truncate">Student</span>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole('COMPANY'); setError(''); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              selectedRole === 'COMPANY'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 size={15} />
            <span className="truncate">Company</span>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole('OFFICER'); setError(''); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              selectedRole === 'OFFICER'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck size={15} />
            <span className="truncate">Officer</span>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole('ADMIN'); setError(''); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              selectedRole === 'ADMIN'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={15} />
            <span className="truncate">Admin</span>
          </button>
        </div>

        {/* Login Glass Card */}
        <div className="glass-card p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          
          <div className="text-center pb-1">
            <h3 className="text-lg font-extrabold text-white">
              {selectedRole === 'STUDENT' && 'Student Login'}
              {selectedRole === 'COMPANY' && 'Recruiter / Corporate Login'}
              {selectedRole === 'OFFICER' && 'Placement Officer Login'}
              {selectedRole === 'ADMIN' && 'System Admin Portal'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Enter your registered credentials below</p>
          </div>

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
                  placeholder={getRolePlaceholder()}
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
              <span>{loading ? 'Authenticating...' : `Sign In as ${selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration Options */}
          <div className="text-center pt-4 border-t border-slate-800 space-y-3">
            <p className="text-xs text-slate-400">Need a new portal account?</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                to="/register/student"
                className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50 text-center transition flex items-center justify-center gap-1.5"
              >
                <GraduationCap size={15} />
                Register as Student
              </Link>

              <Link
                to="/register/company"
                className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 text-center transition flex items-center justify-center gap-1.5"
              >
                <Building2 size={15} />
                Register Company
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

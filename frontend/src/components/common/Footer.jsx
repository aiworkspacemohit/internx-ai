import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowUpRight, GraduationCap } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200/80 mt-16 pt-12 pb-8 text-slate-600">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header & Newsletter Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-100 pb-10">
          
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-zinc-900 text-white rounded-xl flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-lime-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                InternX<span className="text-indigo-600">.ai</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Next-generation AI-powered campus placement engine. Real-time candidate matching, resume intelligence, and placement telemetry.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">
              Subscribe to Placement AI Insights
            </span>

            <form onSubmit={handleSubscribe} className="flex items-center max-w-md relative">
              <input
                type="email"
                required
                placeholder="Enter work email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
              <button
                type="submit"
                className="absolute right-1 p-1.5 bg-zinc-900 text-white hover:bg-black rounded-full transition shadow-xs"
              >
                <Send size={13} />
              </button>
            </form>

            {subscribed && (
              <span className="text-xs text-emerald-600 font-medium block">Subscribed successfully!</span>
            )}
          </div>

        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Product</h4>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li><Link to="/student/internships" className="hover:text-indigo-600 transition">Explore Internships</Link></li>
              <li><Link to="/student/ai-hub" className="hover:text-indigo-600 transition">AI Career Hub</Link></li>
              <li><Link to="/student/applications" className="hover:text-indigo-600 transition">Application Tracker</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600 transition">Recruiter Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Company</h4>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Partner Universities</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Contact Us</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Resources</h4>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition">Placement Reports</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Support Center</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Connect</h4>
            <ul className="space-y-2 text-slate-500 font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition inline-flex items-center space-x-1"><span>LinkedIn</span><ArrowUpRight size={11} /></a></li>
              <li><a href="#" className="hover:text-indigo-600 transition inline-flex items-center space-x-1"><span>Twitter</span><ArrowUpRight size={11} /></a></li>
              <li><a href="#" className="hover:text-indigo-600 transition inline-flex items-center space-x-1"><span>GitHub</span><ArrowUpRight size={11} /></a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026 InternX.ai Placement Platform. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-slate-600">Privacy</a>
            <a href="#" className="hover:text-slate-600">Terms</a>
            <a href="#" className="hover:text-slate-600">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

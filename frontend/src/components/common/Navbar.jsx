import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPopover from './NotificationPopover';
import { Bell, Sparkles, LogOut, User as UserIcon, Shield, Menu, X } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'STUDENT': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'COMPANY': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'OFFICER': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'ADMIN': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
            </div>
            <span className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-1.5">
              InternX <span className="gradient-text text-sm px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 font-semibold">AI</span>
            </span>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        {user && (
          <div className="flex items-center space-x-4">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && <NotificationPopover onClose={() => setShowNotifs(false)} />}
            </div>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-1.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left pr-2">
                  <p className="text-sm font-semibold text-white leading-tight">{user.full_name}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block mt-0.5 ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-2xl py-2 z-50 border border-slate-700/60 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-700/50">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;

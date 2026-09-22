import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPopover from './NotificationPopover';
import { Bell, Search, LogOut, User as UserIcon, Menu, ArrowRight, Calendar, HelpCircle, GraduationCap } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'STUDENT': return 'bg-emerald-100 text-emerald-800';
      case 'COMPANY': return 'bg-indigo-100 text-indigo-800';
      case 'OFFICER': return 'bg-purple-100 text-purple-800';
      case 'ADMIN': return 'bg-zinc-900 text-white';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-2.5 bg-white/95 border-b border-slate-200/80 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Logo & Mobile Toggle */}
        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2.5 group">
            {/* Edu.ai style black logo emblem */}
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition">
              <GraduationCap className="w-5 h-5 text-lime-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                InternX<span className="text-indigo-600">.ai</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">Campus AI Portal</span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar & Date Chip (Edu.ai Style) */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search opportunities, skills, applications..."
              className="w-full bg-slate-50 border border-slate-200/80 rounded-full pl-10 pr-12 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-xs">
              ⌘K
            </kbd>
          </div>

          {/* Placement Drive Status Chip */}
          <div className="hidden lg:flex items-center space-x-2 bg-emerald-50 border border-emerald-200/80 rounded-full px-3.5 py-1.5 text-xs text-emerald-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Placement Drive 2026</span>
          </div>
        </div>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center space-x-3 shrink-0">
          
          <button className="hidden sm:flex p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition">
            <HelpCircle className="w-5 h-5" />
          </button>

          {!user ? (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2">
                Log In
              </Link>
              <Link to="/register/company" className="bg-zinc-900 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-black transition shadow-sm flex items-center space-x-1.5">
                <span>Book Demo</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
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
                  className="flex items-center space-x-2.5 p-1 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left pr-2">
                    <p className="text-xs font-bold text-slate-900 leading-none">{user.full_name}</p>
                    <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 brand-card py-2 z-50 border border-slate-200 bg-white shadow-lg rounded-2xl animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-800 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:text-indigo-600 hover:bg-slate-50 flex items-center space-x-2 transition font-medium"
                      >
                        <LogOut className="w-4 h-4 text-slate-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;

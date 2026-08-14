import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Search, Briefcase, Sparkles, Calendar,
  Users, CheckCircle2, Megaphone, FileBarChart, Settings,
  Building2, ShieldCheck, UserPlus, FileText
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case 'STUDENT':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Explore Internships', path: '/student/internships', icon: Search },
          { name: 'Application Tracker', path: '/student/applications', icon: Briefcase },
          { name: 'AI Career Hub', path: '/student/ai-hub', icon: Sparkles },
          { name: 'Interview Calendar', path: '/student/calendar', icon: Calendar },
          { name: 'Announcements', path: '/student/announcements', icon: Megaphone },
        ];
      case 'COMPANY':
        return [
          { name: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
          { name: 'Job Postings', path: '/company/jobs', icon: Briefcase },
          { name: 'Applicant Pipeline', path: '/company/applicants', icon: Users },
          { name: 'Interviews', path: '/company/interviews', icon: Calendar },
          { name: 'Company Profile', path: '/company/profile', icon: Building2 },
        ];
      case 'OFFICER':
        return [
          { name: 'Officer Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
          { name: 'Student Monitoring', path: '/officer/students', icon: Users },
          { name: 'Verify Companies', path: '/officer/companies', icon: ShieldCheck },
          { name: 'Announcements', path: '/officer/announcements', icon: Megaphone },
          { name: 'Department Reports', path: '/officer/reports', icon: FileBarChart },
        ];
      case 'ADMIN':
        return [
          { name: 'Admin Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'User Management', path: '/admin/users', icon: Users },
          { name: 'Company Approvals', path: '/admin/approvals', icon: CheckCircle2 },
          { name: 'Create Officers', path: '/admin/officers', icon: UserPlus },
          { name: 'Audit & System Logs', path: '/admin/system', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 glass-card border-r border-slate-800 z-30 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex flex-col h-full justify-between">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation ({user.role})
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Quick AI Tip Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-indigo-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>InternX AI Engine</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Automated AI resume scoring, interview prep generation & smart placement analytics active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

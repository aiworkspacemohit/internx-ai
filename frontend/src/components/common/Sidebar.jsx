import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Search, Briefcase, Sparkles, Calendar,
  Users, CheckCircle2, Megaphone, FileBarChart, Settings,
  Building2, ShieldCheck, UserPlus, Grid, Layers
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case 'STUDENT':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Opportunities', path: '/student/internships', icon: Search },
          { name: 'Applications', path: '/student/applications', icon: Briefcase, count: 36 },
          { name: 'AI Career Hub', path: '/student/ai-hub', icon: Sparkles, badge: 'AI' },
          { name: 'Calendar', path: '/student/calendar', icon: Calendar },
          { name: 'Announcements', path: '/student/announcements', icon: Megaphone },
        ];
      case 'COMPANY':
        return [
          { name: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
          { name: 'Job Postings', path: '/company/jobs', icon: Briefcase },
          { name: 'Applicants', path: '/company/applicants', icon: Users, count: 24 },
          { name: 'Interviews', path: '/company/interviews', icon: Calendar },
          { name: 'Company Profile', path: '/company/profile', icon: Building2 },
        ];
      case 'OFFICER':
        return [
          { name: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
          { name: 'Students', path: '/officer/students', icon: Users },
          { name: 'Companies', path: '/officer/companies', icon: ShieldCheck, count: 5 },
          { name: 'Announcements', path: '/officer/announcements', icon: Megaphone },
          { name: 'Placement Reports', path: '/officer/reports', icon: FileBarChart },
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'User Directory', path: '/admin/users', icon: Users },
          { name: 'Approvals', path: '/admin/approvals', icon: CheckCircle2, count: 8 },
          { name: 'Create Officer', path: '/admin/officers', icon: UserPlus },
          { name: 'System Logs', path: '/admin/system', icon: Settings },
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
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 p-3.5 z-30 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex flex-col h-full justify-between shadow-xs">
          
          <div className="space-y-4">
            {/* Header / Workspace label */}
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-xs font-semibold text-slate-400">Workspace</span>
              <button className="text-slate-400 hover:text-slate-600 transition">
                <Layers className="w-4 h-4" />
              </button>
            </div>

            {/* Nav links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
                              isActive
                                ? 'bg-[#bef264] text-zinc-900'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{link.name}</span>
                        </div>

                        {/* Counts or Badges */}
                        {link.count && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-zinc-800 text-slate-300'
                                : 'text-slate-400'
                            }`}
                          >
                            {link.count}
                          </span>
                        )}

                        {link.badge && (
                          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                            {link.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Bottom Settings Link */}
          <div className="pt-3 border-t border-slate-100">
            <button className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;

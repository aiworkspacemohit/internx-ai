import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { CheckCheck, Bell, Briefcase, Calendar, Award, Info } from 'lucide-react';

const NotificationPopover = ({ onClose }) => {
  const { notifications, markAsRead, markAllRead } = useNotifications();

  const getNotifIcon = (type) => {
    switch (type) {
      case 'INTERVIEW': return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'OFFER': return <Award className="w-4 h-4 text-emerald-400" />;
      case 'SUCCESS': return <Briefcase className="w-4 h-4 text-indigo-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl z-50 border border-slate-700/80 overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="p-3 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-white">Notifications</span>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-800/60 ${
                !n.is_read ? 'bg-indigo-950/20 border-l-2 border-indigo-500' : 'opacity-80'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 mt-0.5">
                  {getNotifIcon(n.type)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-200">{n.title}</p>
                  <p className="text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPopover;

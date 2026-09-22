import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { CheckCheck, Bell, Briefcase, Calendar, Award, Info } from 'lucide-react';

const NotificationPopover = ({ onClose }) => {
  const { notifications, markAsRead, markAllRead } = useNotifications();

  const getNotifIcon = (type) => {
    switch (type) {
      case 'INTERVIEW': return <Calendar className="w-4 h-4 text-black" />;
      case 'OFFER': return <Award className="w-4 h-4 text-black" />;
      case 'SUCCESS': return <Briefcase className="w-4 h-4 text-black" />;
      default: return <Info className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 kuro-card rounded-2xl shadow-2xl z-50 border border-zinc-200 overflow-hidden animate-in fade-in slide-in-from-top-2 bg-white">
      <div className="p-3.5 border-b border-zinc-200 flex items-center justify-between bg-[#f8f8fa]">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-black" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">Notifications</span>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-[11px] font-mono text-zinc-600 hover:text-black flex items-center space-x-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-zinc-400 font-mono text-xs">
            No active notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-3.5 text-xs transition-colors cursor-pointer hover:bg-zinc-50 ${
                !n.is_read ? 'bg-zinc-100/80 border-l-2 border-black font-medium' : 'opacity-70'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-zinc-100 border border-zinc-200 mt-0.5">
                  {getNotifIcon(n.type)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-black">{n.title}</p>
                  <p className="text-zinc-600 mt-0.5 leading-snug">{n.message}</p>
                  <p className="text-[10px] font-mono text-zinc-400 mt-1">
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

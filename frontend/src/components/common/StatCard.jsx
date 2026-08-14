import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtext }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'emerald':
        return 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30';
      case 'amber':
        return 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30';
      case 'rose':
        return 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30';
      case 'blue':
        return 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30';
      default:
        return 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className={`glass-card p-5 rounded-2xl border bg-gradient-to-br ${getColorClasses()} glass-card-hover`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-sans">{value}</h3>
          {subtext && <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

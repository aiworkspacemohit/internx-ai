import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, subtext, trend, isHighlighted, icon: Icon }) => {
  if (isHighlighted) {
    return (
      <div className="p-5 rounded-2xl bg-[#bef264]/20 border-2 border-dashed border-[#bef264] relative overflow-hidden transition hover:shadow-sm">
        <span className="text-[11px] font-semibold text-slate-700 block mb-1">
          {title}
        </span>
        <div className="flex items-baseline space-x-2">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
          {subtext && <span className="text-xs text-slate-500 font-medium">{subtext}</span>}
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="inline-flex items-center text-[10px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3 mr-0.5 text-lime-300" />
            {trend || '41% vs last week'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">{title}</span>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
            {subtext && <span className="text-xs text-slate-400 font-medium">{subtext}</span>}
          </div>
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className="inline-flex items-center text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            ✓ {trend}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

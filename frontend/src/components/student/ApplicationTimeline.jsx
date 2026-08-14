import React from 'react';
import { Check, Clock, AlertCircle, Award, FileText, UserCheck, Video, ShieldCheck } from 'lucide-react';

const ApplicationTimeline = ({ currentStatus }) => {
  const stages = [
    { key: 'APPLIED', label: 'Applied', icon: FileText },
    { key: 'SHORTLISTED', label: 'Shortlisted', icon: UserCheck },
    { key: 'ONLINE_ASSESSMENT', label: 'Assessment', icon: Clock },
    { key: 'INTERVIEW_ROUND', label: 'Tech Round', icon: Video },
    { key: 'HR_ROUND', label: 'HR Round', icon: ShieldCheck },
    { key: 'OFFER', label: 'Offer Issued', icon: Award },
  ];

  const getStageIndex = (statusKey) => {
    switch (statusKey) {
      case 'APPLIED': return 0;
      case 'SHORTLISTED': return 1;
      case 'ONLINE_ASSESSMENT': return 2;
      case 'INTERVIEW_ROUND': return 3;
      case 'HR_ROUND': return 4;
      case 'OFFER':
      case 'ACCEPTED': return 5;
      case 'REJECTED': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  return (
    <div className="py-4">
      {isRejected ? (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Application was not selected for this position. Keep applying for other opportunities!</span>
        </div>
      ) : (
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
          {stages.map((stage, idx) => {
            const isDone = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex-1 flex flex-col md:flex-col items-center relative w-full md:w-auto">
                {/* Connecting Line */}
                {idx < stages.length - 1 && (
                  <div
                    className={`hidden md:block absolute top-4 left-1/2 w-full h-0.5 -z-10 transition-colors ${
                      idx < currentIndex ? 'bg-indigo-500' : 'bg-slate-800'
                    }`}
                  />
                )}

                {/* Circle Badge */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/50 scale-110 ring-4 ring-indigo-500/20'
                      : isDone
                      ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {isDone && !isCurrent ? (
                    <Check className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Stage Label */}
                <span
                  className={`text-[11px] font-semibold mt-2 text-center ${
                    isCurrent ? 'text-indigo-400' : isDone ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationTimeline;

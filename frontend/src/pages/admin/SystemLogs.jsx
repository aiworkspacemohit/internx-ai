import React from 'react';
import { Terminal } from 'lucide-react';

const SystemLogs = () => {
  const logs = [
    { time: '2026-08-14 20:05:12', level: 'INFO', module: 'auth', message: 'User alex.rivera@gmail.com logged in successfully via JWT' },
    { time: '2026-08-14 20:04:45', level: 'INFO', module: 'applications', message: 'Application status changed for job #1 to INTERVIEW_ROUND' },
    { time: '2026-08-14 20:02:10', level: 'INFO', module: 'ai_service', message: 'Gemini AI Resume Review executed with match_score 88%' },
    { time: '2026-08-14 19:58:01', level: 'INFO', module: 'email', message: 'SMTP email notifications connected on smtp.gmail.com:587' },
    { time: '2026-08-14 19:55:00', level: 'INFO', module: 'system', message: 'FastAPI backend worker started on port 8000 (SQLite / PostgreSQL active)' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900 max-w-[1600px] mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Audit & System Logs</h1>
        <p className="text-xs text-slate-500">Security audit events, background task executions, and API transactions</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs font-mono text-xs space-y-3">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold border-b border-slate-100 pb-3">
          <Terminal className="w-4 h-4" />
          <span>Real-Time Log Stream</span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((l, i) => (
            <div key={i} className="flex items-start space-x-3 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 transition">
              <span className="text-slate-400">{l.time}</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${l.level === 'WARN' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {l.level}
              </span>
              <span className="text-indigo-600 font-semibold">[{l.module}]</span>
              <span className="flex-1 text-slate-800 font-medium">{l.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;

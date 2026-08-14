import React from 'react';
import { Settings, ShieldCheck, Terminal, Server } from 'lucide-react';

const SystemLogs = () => {
  const logs = [
    { time: '2026-08-14 20:05:12', level: 'INFO', module: 'auth', message: 'User alex.rivera@student.edu logged in successfully via JWT' },
    { time: '2026-08-14 20:04:45', level: 'INFO', module: 'applications', message: 'Application status changed for job #1 to INTERVIEW_ROUND' },
    { time: '2026-08-14 20:02:10', level: 'INFO', module: 'ai_service', message: 'Gemini AI Resume Review executed with match_score 88%' },
    { time: '2026-08-14 19:58:01', level: 'WARN', module: 'email', message: 'SMTP environment credentials missing; running in simulated email delivery mode' },
    { time: '2026-08-14 19:55:00', level: 'INFO', module: 'system', message: 'FastAPI backend worker started on port 8000 (SQLite / PostgreSQL active)' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-extrabold text-white">Platform Audit & System Logs</h1>
        <p className="text-xs text-slate-400">Security audit events, background task executions, and API transactions</p>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-slate-700/80 font-mono text-xs space-y-3 bg-slate-950/80">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold border-b border-slate-800 pb-2">
          <Terminal className="w-4 h-4" />
          <span>Real-Time Log Stream</span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((l, i) => (
            <div key={i} className="flex items-start space-x-3 text-slate-300 hover:bg-slate-900/60 p-1.5 rounded transition">
              <span className="text-slate-500">{l.time}</span>
              <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${l.level === 'WARN' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {l.level}
              </span>
              <span className="text-indigo-400 font-semibold">[{l.module}]</span>
              <span className="flex-1">{l.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;

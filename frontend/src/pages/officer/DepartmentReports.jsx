import React from 'react';
import { FileBarChart, Download, CheckCircle2, TrendingUp } from 'lucide-react';

const DepartmentReports = () => {
  const reports = [
    { name: 'Computer Science Placement Audit Report 2026', format: 'PDF', date: 'Aug 14, 2026', size: '2.4 MB' },
    { name: 'Information Technology Hiring Summary', format: 'XLSX', date: 'Aug 10, 2026', size: '1.1 MB' },
    { name: 'Company Recruiter Engagement Index', format: 'PDF', date: 'Aug 05, 2026', size: '3.8 MB' },
  ];

  const handleExport = (reportName) => {
    alert(`Generating & downloading ${reportName}...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Department Analytical Reports & Export</h1>
          <p className="text-xs text-slate-400">Generate placement summaries and export reports for college administration</p>
        </div>
        <button
          onClick={() => handleExport('Placement Report 2026')}
          className="gradient-bg-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
        >
          <Download className="w-4 h-4" />
          <span>Export Master CSV Report</span>
        </button>
      </div>

      <div className="space-y-4">
        {reports.map((r, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <FileBarChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{r.name}</h3>
                <p className="text-[11px] text-slate-400">Generated: {r.date} • Format: {r.format} ({r.size})</p>
              </div>
            </div>

            <button
              onClick={() => handleExport(r.name)}
              className="p-2.5 rounded-xl bg-slate-800 text-indigo-300 hover:bg-slate-700 text-xs font-bold flex items-center space-x-1.5 border border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentReports;

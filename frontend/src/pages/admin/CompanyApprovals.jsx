import React, { useState, useEffect } from 'react';
import { companyService } from '../../services/api';
import { Building2, CheckCircle2, XCircle } from 'lucide-react';

const CompanyApprovals = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await companyService.getCompanies('PENDING');
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleApprove = async (id) => {
    try {
      await companyService.approveCompany(id);
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await companyService.rejectCompany(id);
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80">
        <h1 className="text-2xl font-extrabold text-white">Pending Corporate Registration Requests</h1>
        <p className="text-xs text-slate-400">Admin approval queue for authorizing company accounts</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-indigo-400">Loading pending approval queue...</div>
      ) : companies.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center text-slate-400 text-xs">
          No pending company approval requests in queue.
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((c) => (
            <div key={c.id} className="glass-card p-6 rounded-2xl border border-slate-700/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-lg">
                    {c.company_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{c.company_name}</h3>
                    <p className="text-xs text-indigo-400 font-semibold">{c.industry || 'Technology'} • {c.location || 'Remote'}</p>
                    <p className="text-[11px] text-slate-400">{c.contact_person} ({c.contact_email})</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleReject(c.id)}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/20"
                  >
                    Reject Registration
                  </button>
                  <button
                    onClick={() => handleApprove(c.id)}
                    className="gradient-bg-primary px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
                  >
                    Approve Recruiter
                  </button>
                </div>
              </div>

              {c.description && (
                <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {c.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyApprovals;

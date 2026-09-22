import React, { useState, useEffect } from 'react';
import { companyService } from '../../services/api';

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
    <div className="space-y-6 animate-in fade-in text-slate-900 max-w-[1600px] mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pending Corporate Registrations</h1>
        <p className="text-xs text-slate-500">Admin approval queue for authorizing company accounts</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-indigo-600 text-xs font-semibold">Loading pending approval queue...</div>
      ) : companies.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 text-center text-slate-500 text-xs shadow-xs">
          No pending company approval requests in queue.
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((c) => (
            <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    {c.company_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{c.company_name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold">{c.industry || 'Technology'} • {c.location || 'Remote'}</p>
                    <p className="text-[11px] text-slate-400">{c.contact_person} ({c.contact_email})</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleReject(c.id)}
                    className="px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition"
                  >
                    Reject Registration
                  </button>
                  <button
                    onClick={() => handleApprove(c.id)}
                    className="bg-zinc-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold transition shadow-xs"
                  >
                    Approve Recruiter
                  </button>
                </div>
              </div>

              {c.description && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 leading-relaxed">
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

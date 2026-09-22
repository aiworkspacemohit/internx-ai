import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import { Search } from 'lucide-react';

const StudentMonitoring = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await userService.getUsers('STUDENT');
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.department && s.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900 max-w-[1600px] mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Monitoring Directory</h1>
          <p className="text-xs text-slate-500">Track student academic profiles, skills, and placement status</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-indigo-600 text-xs font-semibold">Loading student directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((st) => (
            <div key={st.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {st.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{st.full_name}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">{st.department || 'Computer Science'}</p>
                  <p className="text-[11px] text-slate-400">{st.email}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CGPA:</span>
                  <span className="font-bold text-emerald-600">{st.cgpa || '3.8 / 4.0'}</span>
                </div>
                {st.skills && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Skills:</span>
                    <p className="text-[11px] text-slate-700 font-mono truncate">{st.skills}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMonitoring;

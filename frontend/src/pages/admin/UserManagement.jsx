import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers(selectedRole || undefined);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleToggleActive = async (id) => {
    try {
      await userService.toggleActive(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in text-slate-900 max-w-[1600px] mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform User Control</h1>
          <p className="text-xs text-slate-500">View registered accounts, verify roles, and toggle user activation status</p>
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-slate-50 border border-slate-200/90 text-slate-900 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="COMPANY">Companies</option>
          <option value="OFFICER">Placement Officers</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-indigo-600 text-xs font-semibold">Loading user database...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department / Industry</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{u.full_name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full font-semibold text-[10px] bg-indigo-100 text-indigo-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{u.department || '—'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full font-semibold text-[10px] ${u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleActive(u.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

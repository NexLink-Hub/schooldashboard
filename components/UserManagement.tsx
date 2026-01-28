
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Download, MoreHorizontal, Mail, Phone, X, Loader2, Edit2, Trash2, Shield } from 'lucide-react';
import { UserRole, UserProfile } from '../types';

const INITIAL_USERS: UserProfile[] = [
  { id: '1', name: 'Themba Khumalo', email: 'themba.k@sandton.edu', role: UserRole.TEACHER, phone: '011 456 7890' },
  { id: '2', name: 'Sarah Jenkins', email: 'sarah.j@sandton.edu', role: UserRole.INSTITUTION_ADMIN, phone: '011 456 7891' },
  { id: '3', name: 'Bontle Modise', email: 'bontle.m@parent.com', role: UserRole.PARENT, phone: '072 123 4567' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('nexlink_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.STUDENT);

  useEffect(() => {
    localStorage.setItem('nexlink_users', JSON.stringify(users));
  }, [users]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) return;
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      phone: 'Pending Update'
    };
    setUsers([newUser, ...users]);
    setShowModal(false);
    setNewUserName('');
    setNewUserEmail('');
    
    window.dispatchEvent(new CustomEvent('nexlink-notification', {
      detail: {
        title: 'User Enrolled',
        message: `${newUser.name} has been added to the institution system.`,
        type: 'success'
      }
    }));
  };

  const handleExport = () => {
    window.dispatchEvent(new CustomEvent('nexlink-notification', {
      detail: {
        title: 'Exporting Directory',
        message: 'Preparing CSV export for all institutional users...',
        type: 'info'
      }
    }));
  };

  const handleUserAction = (userName: string, action: string) => {
    window.dispatchEvent(new CustomEvent('nexlink-notification', {
      detail: {
        title: `Member ${action}`,
        message: `Action processed for ${userName}.`,
        type: 'info'
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            value={searchTerm}
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleExport}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <UserPlus size={16} /> Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 shadow-sm border border-slate-200/50 transition-transform group-hover:scale-110">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight">{user.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user.id.substring(0,6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      user.role === UserRole.INSTITUTION_ADMIN ? 'bg-red-50 text-red-600 border-red-100' :
                      user.role === UserRole.TEACHER ? 'bg-green-50 text-green-600 border-green-100' :
                      user.role === UserRole.PARENT ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                        <Mail size={12} className="text-slate-400" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                        <Phone size={12} className="text-slate-400" /> {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleUserAction(user.name, 'Edit')} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => handleUserAction(user.name, 'Permissions')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Permissions"><Shield size={16} /></button>
                      <button onClick={() => handleUserAction(user.name, 'Delete')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Remove"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-slate-950 text-white flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black tracking-tight">Add New Member</h3>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Institution User</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Full Name</label>
                <input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} type="text" placeholder="e.g. Sipho Zulu" className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Email Address</label>
                <input value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} type="email" placeholder="sipho@student.com" className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Assigned Role</label>
                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as any)} className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-black uppercase tracking-widest">
                  {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role.replace('_', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 transition-all text-xs uppercase tracking-widest">Cancel</button>
                <button onClick={handleAddUser} className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all text-xs uppercase tracking-[0.2em] active:scale-95">Enroll User</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

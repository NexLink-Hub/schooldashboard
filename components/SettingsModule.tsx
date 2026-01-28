
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { User, Bell, Shield, Smartphone, Globe, Save, Loader2, Camera, CheckCircle } from 'lucide-react';

interface SettingsModuleProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ user, onUpdateUser }) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    notifications: true,
    mfa: false
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      const updatedUser = { ...user, ...formData };
      onUpdateUser(updatedUser);
      setLoading(false);
      setSaved(true);
      
      window.dispatchEvent(new CustomEvent('nexlink-notification', {
        detail: {
          title: 'Profile Updated',
          message: 'Your portal settings have been synced successfully.',
          type: 'success'
        }
      }));

      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          <SettingsTab active icon={<User size={18} />} label="General Account" />
          <SettingsTab icon={<Bell size={18} />} label="Notifications" />
          <SettingsTab icon={<Shield size={18} />} label="Security & Privacy" />
          <SettingsTab icon={<Smartphone size={18} />} label="Mobile App Sync" />
          <SettingsTab icon={<Globe size={18} />} label="Localization" />
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
              <div className="relative group">
                <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                  {user.name.charAt(0)}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {user.role.replace('_', ' ')} • {user.studentNumber || 'Faculty ID: NEX-402'}
                </p>
                {user.studentNumber && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    <CheckCircle size={12} /> Verified Academic Record
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Preferred Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Contact Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none" 
                />
              </div>

              {user.role === UserRole.STUDENT && (
                <div className="p-6 bg-slate-950 rounded-3xl text-white">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-indigo-400">Academic Synchronization</h4>
                  <div className="space-y-3">
                    <InfoRow label="Enrolled Course" value={user.course || 'BSc Information Technology'} />
                    <InfoRow label="Assigned Class" value={user.className || 'IT-301-A'} />
                    <InfoRow label="Lead Faculty" value={user.teachers?.join(', ') || 'Ms. Modise, Mr. Khumalo'} />
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : saved ? <CheckCircle size={18} /> : <Save size={18} />}
                  {saved ? 'Changes Saved' : 'Update Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ active, icon, label }: any) => (
  <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
    active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:bg-white hover:shadow-sm'
  }`}>
    {icon} {label}
  </button>
);

const InfoRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center text-[10px] font-bold">
    <span className="text-slate-500 uppercase tracking-widest">{label}</span>
    <span className="text-white truncate max-w-[150px]">{value}</span>
  </div>
);

export default SettingsModule;

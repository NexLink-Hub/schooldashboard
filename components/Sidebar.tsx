
import React from 'react';
import { NAV_ITEMS, ExtendedNavItem } from '../constants';
import { X, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose, user, onLogout }) => {
  // Filter navigation items based on the user's current role
  const roleNavItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside className={`fixed left-0 top-0 h-screen bg-slate-950 text-slate-300 flex flex-col z-[70] transition-transform duration-300 ease-in-out w-64 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">N</div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase">NexLink</h1>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg lg:hidden">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-6 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
            {user.role.replace('_', ' ')} Portal
          </div>
          <ul className="space-y-1.5 px-3">
            {roleNavItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                    activeTab === item.id 
                      ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 font-black' 
                      : 'hover:bg-slate-900 hover:text-white font-bold'
                  }`}
                >
                  <span className={activeTab === item.id ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span className="text-xs uppercase tracking-widest">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="bg-slate-900 rounded-[1.5rem] p-5 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 font-black">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-white truncate uppercase tracking-tighter">{user.name}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onLogout}
                className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;



import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import AnnouncementCreator from './components/AnnouncementCreator';
import PricingStrategyView from './components/PricingStrategyView';
import UserManagement from './components/UserManagement';
import AttendanceModule from './components/AttendanceModule';
import TimetableModule from './components/TimetableModule';
import MessagingModule from './components/MessagingModule';
import EventsModule from './components/EventsModule';
import SettingsModule from './components/SettingsModule';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { MOCK_INSTITUTIONS, NAV_ITEMS } from './constants';
import { UserProfile, UserRole, AppNotification } from './types';
import { Search, Bell, Menu, User, ChevronRight, X, Info, CheckCircle, AlertCircle } from 'lucide-react';


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showLanding, setShowLanding] = useState(() => {
    const saved = localStorage.getItem('nexlink_current_user');
    return !saved; // Show landing if no user is saved
  });
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nexlink_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Listener for live notifications dispatched from other components
  useEffect(() => {
    const handleNotify = (e: any) => {
      const newNotification: AppNotification = {
        id: Math.random().toString(36).substr(2, 9),
        ...e.detail,
        timestamp: new Date(),
      };
      setNotifications(prev => [newNotification, ...prev]);

      // Auto-remove after 6 seconds to give enough reading time
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 6000);
    };

    window.addEventListener('nexlink-notification', handleNotify);
    return () => window.removeEventListener('nexlink-notification', handleNotify);
  }, []);

  // REAL-TIME SIMULATION: Periodically simulate incoming notifications from other users
  useEffect(() => {
    if (!currentUser) return;

    const simulationInterval = setInterval(() => {
      // 30% chance to trigger a random notification from a "Teacher" or "Admin"
      if (Math.random() < 0.3) {
        const scenarios = [
          { title: "📢 New Announcement", message: "Mr. Khumalo posted a new study guide for Term 3.", type: "info" as const },
          { title: "🗓️ Schedule Update", message: "Mathematics class moved to Room 12 today.", type: "alert" as const },
          { title: "💬 New Message", message: "You have an unread message from Ms. Modise.", type: "success" as const },
          { title: "🏫 Admin Notice", message: "School will close early on Friday for staff development.", type: "info" as const }
        ];

        // Don't show some notifications if the user is an admin (simulate student POV)
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        window.dispatchEvent(new CustomEvent('nexlink-notification', {
          detail: randomScenario
        }));
      }
    }, 45000); // Check every 45 seconds

    return () => clearInterval(simulationInterval);
  }, [currentUser]);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('nexlink_current_user', JSON.stringify(user));
    setShowLanding(false);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexlink_current_user');
    setShowLanding(true);
  };

  const triggerNotification = (title: string, message: string, type: 'info' | 'success' | 'alert' = 'info') => {
    window.dispatchEvent(new CustomEvent('nexlink-notification', {
      detail: { title, message, type }
    }));
  };

  // Show landing page if user hasn't visited before
  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // Show login if no user is logged in
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview user={currentUser} setActiveTab={setActiveTab} />;
      case 'announcements':
        return [UserRole.INSTITUTION_ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN].includes(currentUser.role) ? <AnnouncementCreator /> : <Forbidden />;
      case 'pricing':
        return [UserRole.INSTITUTION_ADMIN, UserRole.SUPER_ADMIN].includes(currentUser.role) ? <PricingStrategyView /> : <Forbidden />;
      case 'institutions':
        return [UserRole.INSTITUTION_ADMIN, UserRole.SUPER_ADMIN].includes(currentUser.role) ? <InstitutionsList /> : <Forbidden />;
      case 'users':
        return [UserRole.INSTITUTION_ADMIN, UserRole.SUPER_ADMIN].includes(currentUser.role) ? <UserManagement /> : <Forbidden />;
      case 'attendance':
        return [UserRole.INSTITUTION_ADMIN, UserRole.TEACHER].includes(currentUser.role) ? <AttendanceModule /> : <Forbidden />;
      case 'timetable':
        return <TimetableModule />;
      case 'messaging':
        return <MessagingModule currentUser={currentUser} />;
      case 'events':
        return <EventsModule user={currentUser} />;
      case 'settings':
        return <SettingsModule user={currentUser} onUpdateUser={handleLogin} />;
      default:
        return <UnderConstruction setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-[200] space-y-3 w-80 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex gap-4 animate-in slide-in-from-right-10 duration-300">
            <div className={`mt-1 ${n.type === 'success' ? 'text-emerald-500' : n.type === 'alert' ? 'text-red-500' : 'text-indigo-500'}`}>
              {n.type === 'success' ? <CheckCircle size={20} /> : n.type === 'alert' ? <AlertCircle size={20} /> : <Info size={20} />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-slate-900 tracking-tight">{n.title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
            </div>
            <button onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))} className="text-slate-300 hover:text-slate-500 transition-colors">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="transition-all duration-300 lg:pl-64">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-xl lg:hidden text-slate-600"><Menu size={24} /></button>
            <div className="relative max-w-xs md:max-w-md w-full hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search Portal..." className="w-full bg-slate-100/50 border-none rounded-xl pl-12 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2 text-right">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{currentUser.role.replace('_', ' ')} Portal</span>
              <span className="text-xs font-black text-slate-900 uppercase truncate max-w-[120px]">
                {currentUser.studentNumber ? `${currentUser.studentNumber}` : 'Sandton Academy'}
              </span>
            </div>
            <div className="relative">
              <button onClick={() => setActiveTab('messaging')} className="p-2 text-slate-500 hover:text-indigo-600 transition-colors relative">
                <Bell size={20} />
                {notifications.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>}
              </button>
            </div>
            <button onClick={() => setActiveTab('settings')} className="h-8 w-8 md:h-10 md:w-10 bg-slate-950 rounded-xl flex items-center justify-center text-white font-black text-xs md:text-sm shadow-2xl shadow-indigo-600/10 hover:scale-105 transition-transform active:scale-95">
              {currentUser.name.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="mb-6 md:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-1 md:mb-2 capitalize tracking-tighter">
                {activeTab.replace('-', ' ')}
              </h1>
              <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest">
                <span>NexLink SA</span>
                <ChevronRight size={14} className="text-slate-300" />
                <span className="text-indigo-600 truncate max-w-[150px]">{currentUser.role.replace('_', ' ').toUpperCase()} VIEW</span>
              </div>
            </div>
            {activeTab === 'dashboard' && currentUser.role === UserRole.INSTITUTION_ADMIN && (
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => triggerNotification('Export Started', 'Generating monthly institutional report...', 'info')} className="flex-1 sm:flex-none px-4 md:px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-xs md:text-sm shadow-sm active:scale-95">Export Data</button>
                <button onClick={() => setActiveTab('announcements')} className="flex-1 sm:flex-none px-4 md:px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-xs md:text-sm shadow-lg shadow-indigo-100 active:scale-95">Send Blast</button>
              </div>
            )}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            {renderContent()}
          </div>
        </div>
      </main>

      <button onClick={() => triggerNotification('Support Chat', 'An agent will be with you shortly.')} className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-12 h-12 md:w-16 md:h-16 bg-slate-950 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-40 group">
        <User size={24} className="md:size-[28px]" />
        <span className="absolute right-16 md:right-20 bg-slate-950 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block shadow-2xl">
          Live Portal Support
        </span>
      </button>
    </div>
  );
};

const Forbidden = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-[3rem] p-12 shadow-sm border border-red-50 text-center">
    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6"><AlertCircle size={40} /></div>
    <h2 className="text-2xl font-black text-slate-900 mb-2">Access Restricted</h2>
    <p className="text-slate-500 max-w-md font-medium">Your current account role does not have administrative permission to view this module. Please contact your HOD.</p>
  </div>
);

const UnderConstruction = ({ setActiveTab }: any) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4 bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300"><Menu size={40} /></div>
    <h2 className="text-xl md:text-2xl font-black text-slate-800">New Module Pending</h2>
    <p className="text-slate-500 max-w-md text-sm md:text-base font-medium">We're finalizing the UI for this specialized module. Scheduled for NexLink SA v2.1.</p>
    <button onClick={() => setActiveTab('dashboard')} className="px-8 py-3 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-transform active:scale-95 shadow-xl shadow-slate-900/20">Return Home</button>
  </div>
);

const InstitutionsList: React.FC = () => (
  <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
    <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
      <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm md:text-base">Provincial Institutions</h3>
      <button onClick={() => window.dispatchEvent(new CustomEvent('nexlink-notification', { detail: { title: 'Billing Update', message: 'Consolidated invoices generated for all institutions.', type: 'info' } }))} className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-[0.2em]">Consolidate Billing</button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[600px]">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institution Name</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Province</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Tier</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Users</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
            <th className="px-8 py-6"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {MOCK_INSTITUTIONS.map((inst) => (
            <tr key={inst.id} className="hover:bg-slate-50/50 transition-all group">
              <td className="px-8 py-6 font-black text-slate-900 text-sm tracking-tight">{inst.name}</td>
              <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{inst.province}</td>
              <td className="px-8 py-6">
                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${inst.tier === 'Enterprise' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                  inst.tier === 'Professional' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                  {inst.tier}
                </span>
              </td>
              <td className="px-8 py-6 text-xs font-bold text-slate-700">{inst.studentsCount.toLocaleString()}</td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${inst.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{inst.status}</span>
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <button className="p-2 hover:bg-white rounded-xl transition-all text-slate-300 hover:text-indigo-600 group-hover:translate-x-1">
                  <ChevronRight size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default App;


import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, MapPin, Clock, Sparkles, Loader2, Info, X, CheckCircle } from 'lucide-react';
import { generateEventDescription } from '../services/geminiService';
import { SchoolEvent, UserProfile } from '../types';

interface EventsModuleProps {
  user: UserProfile;
}

const CATEGORY_COLORS: Record<string, string> = {
  Sports: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Academic: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Admin: 'bg-orange-50 text-orange-700 border-orange-100',
  Cultural: 'bg-purple-50 text-purple-700 border-purple-100',
};

const EventsModule: React.FC<EventsModuleProps> = ({ user }) => {
  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    const saved = localStorage.getItem('nexlink_events');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Grade 10 Parent Meeting', date: '2025-08-15', time: '18:00', location: 'School Hall', category: 'Admin', description: 'Termly academic progress meeting.', rsvps: [] },
      { id: '2', title: 'Inter-House Athletics', date: '2025-08-20', time: '08:30', location: 'Main Fields', category: 'Sports', description: 'House athletics competitions.', rsvps: [] }
    ];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Academic'|'Sports'|'Admin'|'Cultural'>('Academic');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('2025-08-01');
  const [newLocation, setNewLocation] = useState('Main Hall');
  const [newTime, setNewTime] = useState('08:00');

  useEffect(() => {
    localStorage.setItem('nexlink_events', JSON.stringify(events));
  }, [events]);

  const generateAIContent = async () => {
    if (!newTitle) return;
    setLoadingAI(true);
    const text = await generateEventDescription(newTitle, newCategory);
    setNewDescription(text);
    setLoadingAI(false);
  };

  const createEvent = () => {
    if (!newTitle) return;

    const event: SchoolEvent = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      description: newDescription,
      date: newDate,
      time: newTime,
      location: newLocation,
      rsvps: []
    };
    
    setEvents([...events, event]);
    
    // Dispatch live notification for all students/parents
    window.dispatchEvent(new CustomEvent('nexlink-notification', {
      detail: {
        title: '🗓️ New Event Scheduled',
        message: `${newTitle} at ${newLocation}`,
        type: 'success'
      }
    }));

    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const toggleRSVP = (eventId: string) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        const rsvps = e.rsvps || [];
        const isAttending = rsvps.includes(user.id);
        const newRsvps = isAttending 
          ? rsvps.filter(id => id !== user.id) 
          : [...rsvps, user.id];
        
        if (!isAttending) {
          window.dispatchEvent(new CustomEvent('nexlink-notification', {
            detail: {
              title: '✅ RSVP Confirmed',
              message: `You are now attending ${e.title}.`,
              type: 'success'
            }
          }));
        }

        return { ...e, rsvps: newRsvps };
      }
      return e;
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
      <div className="lg:col-span-8 bg-white rounded-[2rem] p-4 md:p-8 border border-slate-100 shadow-sm animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Institution Calendar</h3>
            <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-widest">Regional Node • August 2025</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-4">
            <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
              <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronLeft size={16} /></button>
              <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronRight size={16} /></button>
            </div>
            {['institution_admin', 'teacher'].includes(user.role) && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Plus size={16} />
                Host Event
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-slate-200/50 rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="bg-slate-50 py-3 md:py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{d}</div>
          ))}
          {Array.from({ length: 31 }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `2025-08-${dayNum.toString().padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);
            return (
              <div key={i} className="bg-white min-h-[70px] md:min-h-[110px] p-2 hover:bg-indigo-50/40 transition-all cursor-pointer group border-r border-b border-slate-50 last:border-r-0">
                <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors">{dayNum}</span>
                <div className="mt-2 space-y-1">
                  {dayEvents.map(e => (
                    <div key={e.id} className={`text-[8px] md:text-[9px] font-black px-1.5 py-1 rounded-lg border truncate uppercase tracking-tighter shadow-sm transition-transform hover:scale-105 ${CATEGORY_COLORS[e.category]}`}>
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-950 rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 tracking-widest uppercase">
            <CalendarIcon size={20} className="text-indigo-400" />
            RSVP Portal
          </h3>
          <div className="space-y-8 relative z-10 max-h-[550px] overflow-y-auto pr-3 custom-scrollbar">
            {events.length === 0 ? (
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest text-center py-10 italic">No events found for this cycle.</p>
            ) : events.map(event => (
              <div key={event.id} className="relative pl-8 border-l-2 border-indigo-500/20 pb-2">
                <div className="absolute left-[-6px] top-1 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_#6366f1]" />
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">{event.date}</p>
                <h4 className="font-black text-base mb-2 tracking-tight">{event.title}</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-2 opacity-60 mb-5">
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"><Clock size={12} /> {event.time}</span>
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"><MapPin size={12} /> {event.location}</span>
                </div>
                <button 
                  onClick={() => toggleRSVP(event.id)}
                  className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-2xl ${
                    event.rsvps?.includes(user.id) 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                  }`}
                >
                  {event.rsvps?.includes(user.id) ? (
                    <><CheckCircle size={14} /> Attending</>
                  ) : 'Confirm Attendance'}
                </button>
              </div>
            ))}
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-start sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-black tracking-tighter">Host New Event</h3>
                <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-80">Calendar Entry Node</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Event Name</label>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Spring Gala" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as any)} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-black uppercase tracking-widest">
                    <option>Academic</option>
                    <option>Sports</option>
                    <option>Admin</option>
                    <option>Cultural</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Date Selection</label>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Start Time</label>
                  <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Venue Location</label>
                <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="e.g., Main Quad" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Brief Narrative</label>
                  <button onClick={generateAIContent} disabled={loadingAI || !newTitle} className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 disabled:opacity-50 transition-colors">
                    {loadingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Magic Write
                  </button>
                </div>
                <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Detailed description for parents..." className="w-full h-28 px-5 py-4 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm leading-relaxed resize-none font-medium" />
              </div>
              <div className="flex gap-4 pt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 transition-all text-xs uppercase tracking-widest">Discard</button>
                <button onClick={createEvent} className="flex-1 py-4 bg-slate-950 text-white font-black rounded-2xl shadow-2xl shadow-slate-950/20 hover:bg-black transition-all text-xs uppercase tracking-[0.2em] active:scale-95">Broadcast Event</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsModule;

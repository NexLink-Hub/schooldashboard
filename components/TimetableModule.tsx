
import React from 'react';
import { Clock, MapPin, User, ChevronLeft, ChevronRight, Printer, Share2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

const SCHEDULE = [
  { day: 'Monday', time: '08:00', subject: 'Mathematics', room: 'Room 4B', teacher: 'Mr. Khumalo', color: 'bg-indigo-100 text-indigo-700' },
  { day: 'Monday', time: '09:00', subject: 'Life Sciences', room: 'Lab 1', teacher: 'Mrs. Jenkins', color: 'bg-emerald-100 text-emerald-700' },
  { day: 'Tuesday', time: '10:00', subject: 'History', room: 'Room 12', teacher: 'Ms. Modise', color: 'bg-orange-100 text-orange-700' },
  { day: 'Wednesday', time: '08:00', subject: 'English FAL', room: 'Room 2', teacher: 'Mr. Smith', color: 'bg-blue-100 text-blue-700' },
  { day: 'Thursday', time: '13:00', subject: 'Geography', room: 'Room 9', teacher: 'Ms. Dlamini', color: 'bg-purple-100 text-purple-700' },
];

const TimetableModule: React.FC = () => {
  const handleExport = (type: string) => {
    window.dispatchEvent(new CustomEvent('nexlink-notification', {
      detail: {
        title: 'Timetable Export',
        message: `Your schedule is being prepared for ${type}...`,
        type: 'info'
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">Academic Timetable</h3>
          <p className="text-sm text-slate-500 font-medium">Grade 10A • Term 3 Schedule</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
            <button className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-white rounded-lg shadow-sm">Weekly</button>
            <button className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-500">Daily</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleExport('Printing')} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Printer size={16} className="text-slate-500" /></button>
            <button onClick={() => handleExport('Sharing')} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Share2 size={16} className="text-slate-500" /></button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-2 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="w-24 px-4 py-6"></th>
                {DAYS.map(day => (
                  <th key={day} className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map(hour => (
                <tr key={hour}>
                  <td className="px-4 py-8 text-[10px] font-black text-slate-400 text-right align-top tracking-widest">
                    {hour}
                  </td>
                  {DAYS.map(day => {
                    const session = SCHEDULE.find(s => s.day === day && s.time === hour);
                    return (
                      <td key={`${day}-${hour}`} className="min-w-[160px] align-top">
                        {session ? (
                          <div 
                            onClick={() => window.dispatchEvent(new CustomEvent('nexlink-notification', { detail: { title: session.subject, message: `Class led by ${session.teacher} in ${session.room}`, type: 'info' }}))}
                            className={`p-5 rounded-[1.5rem] ${session.color} space-y-4 shadow-sm transition-all hover:scale-[1.03] hover:shadow-xl cursor-pointer border border-transparent hover:border-white/50 group`}
                          >
                            <h4 className="font-black text-xs uppercase tracking-tight group-hover:tracking-widest transition-all">{session.subject}</h4>
                            <div className="space-y-1.5 opacity-80">
                              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                <MapPin size={10} /> {session.room}
                              </div>
                              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                <User size={10} /> {session.teacher}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 border-2 border-dashed border-slate-50 rounded-[1.5rem] transition-colors hover:border-slate-100" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimetableModule;


import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Check, X, Clock, BrainCircuit, Loader2, Info, CheckCircle2, ChevronDown } from 'lucide-react';
import { analyzeAttendanceData } from '../services/geminiService';

const STUDENTS = [
  { id: '1', name: 'Zanele Dlamini', context: 'CS101 - Group A' },
  { id: '2', name: 'Lerato Mokoena', context: 'CS101 - Group A' },
  { id: '3', name: 'Tshepo Sithole', context: 'CS101 - Group A' },
  { id: '4', name: 'Naledi Gumede', context: 'CS101 - Group A' },
  { id: '5', name: 'Sibusiso Khumalo', context: 'CS101 - Group A' },
];

const AttendanceModule: React.FC = () => {
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const saved = localStorage.getItem('nexlink_temp_register');
    return saved ? JSON.parse(saved) : {};
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [insights, setInsights] = useState<{ insights: string[], recommendations: string[] } | null>(null);

  useEffect(() => {
    localStorage.setItem('nexlink_temp_register', JSON.stringify(attendance));
  }, [attendance]);

  const toggleStatus = (id: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      
      window.dispatchEvent(new CustomEvent('nexlink-notification', {
        detail: {
          title: 'Lecture Register Finalized',
          message: 'Participation data for CS101 has been synced with Faculty records.',
          type: 'success'
        }
      }));

      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    const summary = `Module CS101 Attendance: ${STUDENTS.length} total students. ${Object.values(attendance).filter(s => s === 'absent').length} absent, ${Object.values(attendance).filter(s => s === 'late').length} late. Note: Early morning lecture (08:00).`;
    const result = await analyzeAttendanceData(summary);
    setInsights(result);
    setAnalyzing(false);
    
    window.dispatchEvent(new CustomEvent('nexlink-notification', {
      detail: {
        title: 'Engagement Analysis Complete',
        message: 'Module participation patterns generated for Principal Investigator.',
        type: 'info'
      }
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] shadow-inner">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 tracking-tight">Module Register</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                CS101 Lecture <span className="w-1 h-1 bg-slate-300 rounded-full" /> {new Date().toLocaleDateString('en-ZA')}
              </p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving || Object.keys(attendance).length === 0}
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-[1.2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <CheckCircle2 size={18} /> : null}
            {saved ? 'Synced' : 'Finalize Register'}
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Participation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-900 text-sm tracking-tight">{student.name}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{student.context}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2 md:gap-3">
                      <StatusButton active={attendance[student.id] === 'present'} onClick={() => toggleStatus(student.id, 'present')} color="green" icon={<Check size={14} />} label="P" />
                      <StatusButton active={attendance[student.id] === 'absent'} onClick={() => toggleStatus(student.id, 'absent')} color="red" icon={<X size={14} />} label="A" />
                      <StatusButton active={attendance[student.id] === 'late'} onClick={() => toggleStatus(student.id, 'late')} color="orange" icon={<Clock size={14} />} label="L" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 bg-slate-50/50 text-center">
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 mx-auto">
              View Extended Enrollment <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-950 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-500/20 rounded-2xl">
                <BrainCircuit className="text-indigo-400" size={28} />
              </div>
              <h3 className="font-black text-xl tracking-tight uppercase tracking-widest">Varsity Intelligence</h3>
            </div>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
              Run predictive diagnostics on module attendance to identify students at risk of exclusion due to low participation.
            </p>
            <button 
              onClick={handleAIAnalysis}
              disabled={analyzing}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-indigo-600/30"
            >
              {analyzing ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
              Analyze Module Register
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>

        {insights && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl animate-in fade-in slide-in-from-right-10 duration-500 relative">
            <div className="absolute top-6 right-8 text-indigo-100"><Info size={40} /></div>
            <div className="mb-8 relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6 border-b border-indigo-50 pb-2">Academic Patterns</h4>
              <ul className="space-y-4">
                {insights.insights.map((item, i) => (
                  <li key={i} className="flex gap-4 text-xs md:text-sm text-slate-700 font-bold leading-relaxed">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0 shadow-[0_0_8px_#818cf8]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6 border-b border-emerald-50 pb-2">Faculty Recommendation</h4>
              <ul className="space-y-4">
                {insights.recommendations.map((item, i) => (
                  <li key={i} className="flex gap-4 text-xs md:text-sm text-slate-600 font-medium italic bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/30">
                    <Info size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusButton = ({ active, onClick, color, icon, label }: any) => {
  const colors: any = {
    green: active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600',
    red: active ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600',
    orange: active ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-slate-100 text-slate-400 hover:bg-orange-50 hover:text-orange-600',
  };

  return (
    <button onClick={onClick} className={`w-12 h-12 md:w-auto md:px-5 md:py-3 rounded-[1rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-90 ${colors[color]}`}>
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
};

export default AttendanceModule;


import React from 'react';
import { CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { Users, Megaphone, Calendar, TrendingUp, AlertCircle, GraduationCap, Clock, CheckCircle2, BookOpen, UserCheck, MapPin } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

const data = [
  { name: 'Mon', attendance: 92, engagement: 85 },
  { name: 'Tue', attendance: 95, engagement: 88 },
  { name: 'Wed', attendance: 98, engagement: 92 },
  { name: 'Thu', attendance: 94, engagement: 81 },
  { name: 'Fri', attendance: 89, engagement: 74 },
];

interface DashboardOverviewProps {
  user: UserProfile;
  setActiveTab: (tab: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user, setActiveTab }) => {
  const isAdmin = user.role === UserRole.INSTITUTION_ADMIN;
  const isTeacher = user.role === UserRole.TEACHER;
  const isStudent = user.role === UserRole.STUDENT;

  return (
    <div className="space-y-6">
      {/* Varsity Context Bar (Student & Lecturer) */}
      {(isStudent || isTeacher) && (
        <div className={`p-6 rounded-[2.5rem] animate-in fade-in slide-in-from-top-4 duration-500 border ${isStudent ? 'bg-emerald-50 border-emerald-100' : 'bg-indigo-50 border-indigo-100'}`}>
          <div className="flex flex-wrap items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm ${isStudent ? 'text-emerald-600' : 'text-indigo-600'}`}>
                <BookOpen size={24} />
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isStudent ? 'text-emerald-400' : 'text-indigo-400'}`}>
                  {isStudent ? 'Course Enrollment' : 'Faculty Assignment'}
                </p>
                <h3 className={`text-lg font-black leading-tight ${isStudent ? 'text-emerald-900' : 'text-indigo-900'}`}>
                  {isStudent ? (user.course || 'BSc Computer Science') : (user.faculty || 'Faculty of Science')}
                </h3>
                <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${isStudent ? 'text-emerald-600' : 'text-indigo-600'}`}>
                  {isStudent ? (user.className || 'Level 100-A') : 'Senior Academic Staff'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm ${isStudent ? 'text-emerald-600' : 'text-indigo-600'}`}>
                <MapPin size={18} />
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isStudent ? 'text-emerald-400' : 'text-indigo-400'}`}>Designated Campus</p>
                <p className={`text-xs font-bold ${isStudent ? 'text-emerald-900' : 'text-indigo-900'}`}>{user.campus || 'Main Campus'}</p>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg ${isStudent ? 'bg-emerald-600 shadow-emerald-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
              {isStudent ? `Student ID: ${user.studentNumber || 'TRIAL'}` : `Lecturer ID: ${user.lecturerId || 'TRIAL'}`}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isAdmin && (
          <>
            <StatCard onClick={() => setActiveTab('users')} title="Total Students" value="12,450" change="+8%" icon={<Users className="text-blue-600" />} />
            <StatCard onClick={() => setActiveTab('announcements')} title="Campus Blasts" value="42" change="+5" icon={<Megaphone className="text-indigo-600" />} />
            <StatCard onClick={() => setActiveTab('attendance')} title="Lecture Attendance" value="88.4%" change="-2.1%" icon={<TrendingUp className="text-green-600" />} />
            <StatCard onClick={() => setActiveTab('institutions')} title="Campus Status" value="Active" change="99.9%" icon={<CheckCircle2 className="text-emerald-600" />} />
          </>
        )}
        {isTeacher && (
          <>
            <StatCard onClick={() => setActiveTab('messaging')} title="Module Students" value="256" change="CS101 / CS202" icon={<GraduationCap className="text-blue-600" />} />
            <StatCard onClick={() => setActiveTab('attendance')} title="Registers Signed" value="100%" change="Today" icon={<CheckCircle2 className="text-indigo-600" />} />
            <StatCard onClick={() => setActiveTab('timetable')} title="Lectures Today" value="3" change="Next at 14:00" icon={<Clock className="text-orange-600" />} />
            <StatCard onClick={() => setActiveTab('events')} title="Exams Pending" value="2" change="Finalized" icon={<AlertCircle className="text-red-600" />} />
          </>
        )}
        {isStudent && (
          <>
            <StatCard onClick={() => setActiveTab('attendance')} title="Lecture Participation" value="95%" change="+3%" icon={<TrendingUp className="text-blue-600" />} />
            <StatCard onClick={() => setActiveTab('timetable')} title="Course Credits" value="120" change="Current" icon={<GraduationCap className="text-indigo-600" />} />
            <StatCard onClick={() => setActiveTab('timetable')} title="Today's Schedule" value="4" change="2 Done" icon={<Clock className="text-emerald-600" />} />
            <StatCard onClick={() => setActiveTab('events')} title="Exam Notices" value="1" change="Released" icon={<Calendar className="text-purple-600" />} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                Academic Engagement
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Telemetry</p>
            </div>
            <span className="text-[10px] font-black px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full uppercase tracking-widest border border-indigo-100">Real-time</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px' }} />
                <Area type="monotone" dataKey="attendance" stroke="#4f46e5" fillOpacity={1} fill="url(#colorAttendance)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950 p-6 md:p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-black uppercase tracking-tight mb-6 tracking-widest">NexLink Varsity Shortcuts</h3>
            <div className="space-y-4">
              {isAdmin && (
                <>
                  <ActionButton onClick={() => setActiveTab('users')} label="Batch Enrollment" color="bg-indigo-600" />
                  <ActionButton onClick={() => setActiveTab('pricing')} label="Funding & Invoices" color="bg-slate-800" />
                  <ActionButton onClick={() => setActiveTab('institutions')} label="Campus Configuration" color="bg-slate-800" />
                </>
              )}
              {isTeacher && (
                <>
                  <ActionButton onClick={() => setActiveTab('attendance')} label="Sign Lecture Register" color="bg-indigo-600" />
                  <ActionButton onClick={() => setActiveTab('timetable')} label="Module Schedule" color="bg-slate-800" />
                  <ActionButton onClick={() => setActiveTab('announcements')} label="Post Module Notice" color="bg-slate-800" />
                </>
              )}
              {isStudent && (
                <>
                  <ActionButton onClick={() => setActiveTab('events')} label="Campus Events" color="bg-emerald-600" />
                  <ActionButton onClick={() => setActiveTab('timetable')} label="Exam Timetable" color="bg-slate-800" />
                  <ActionButton onClick={() => setActiveTab('messaging')} label="Faculty Comms" color="bg-slate-800" />
                </>
              )}
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ label, color, onClick }: any) => (
  <button onClick={onClick} className={`w-full py-4 px-6 ${color} rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-left hover:scale-[1.02] transition-transform flex items-center justify-between group active:scale-95 shadow-xl shadow-black/20`}>
    {label}
    <TrendingUp size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);

const StatCard = ({ title, value, change, icon, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group active:scale-95">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
      <p className={`text-[9px] mt-2 font-black uppercase tracking-widest ${change.startsWith('+') ? 'text-green-600' : 'text-slate-400'}`}>
        {change} <span className="text-slate-300 font-bold ml-1">Trend</span>
      </p>
    </div>
    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors shadow-inner">
      {icon}
    </div>
  </div>
);

export default DashboardOverview;

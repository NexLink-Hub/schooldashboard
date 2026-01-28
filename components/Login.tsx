
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { MOCK_INSTITUTIONS } from '../constants';
import { Loader2, Mail, Lock, ShieldCheck, GraduationCap, Briefcase, Settings, Fingerprint, ArrowLeft, UserPlus, Hash, Search, School, BookOpen } from 'lucide-react';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

// Tertiary level verification registries
const MOCK_STUDENT_REGISTRY: Record<string, Partial<UserProfile>> = {
  "STU2025001": { name: "Thabo Mbeki", course: "BSc Computer Science", className: "Level 100-A", teachers: ["Mr. Khumalo"], campus: "Main Campus" },
  "STU2025002": { name: "Lerato Molefe", course: "National Diploma: Engineering", className: "Level 200-B", teachers: ["Ms. Modise"], campus: "West Campus" },
};

const MOCK_LECTURER_REGISTRY: Record<string, Partial<UserProfile>> = {
  "LEC-SCI-001": { name: "Dr. Khumalo", faculty: "Faculty of Science", campus: "Main Campus" },
  "LEC-ENG-002": { name: "Prof. Modise", faculty: "Faculty of Engineering", campus: "West Campus" },
};

const FACULTIES = [
  "Faculty of Science",
  "Faculty of Engineering",
  "Faculty of Commerce",
  "Faculty of Humanities",
  "Faculty of Health Sciences",
  "Faculty of Law"
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'category' | 'form'>('category');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  // Fields
  const [institutionId, setInstitutionId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [lecturerId, setLecturerId] = useState('');
  const [faculty, setFaculty] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectCategory = (role: UserRole) => {
    setSelectedRole(role);
    setStep('form');
    setError('');
  };

  const handleGoBack = () => {
    setStep('category');
    setMode('login');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      let finalUserData: Partial<UserProfile> = {
        name: mode === 'signup' ? name : (email.split('@')[0] || 'User'),
        email: email,
        role: selectedRole || UserRole.STUDENT,
        phone: '011 456 7890',
        institutionId: institutionId || 'Sandton Tech Academy'
      };

      // VERIFICATION LOGIC
      if (mode === 'signup') {
        if (!institutionId) {
          setError('Please select your institution.');
          setLoading(false);
          return;
        }

        // Student Signup Verification
        if (selectedRole === UserRole.STUDENT) {
          const studentInfo = MOCK_STUDENT_REGISTRY[studentNumber.toUpperCase()];
          if (!studentInfo) {
            setError('Student ID not recognized under this institution.');
            setLoading(false);
            return;
          }
          finalUserData = { ...finalUserData, ...studentInfo, studentNumber: studentNumber.toUpperCase() };
          
          window.dispatchEvent(new CustomEvent('nexlink-notification', {
            detail: {
              title: 'Student ID Verified',
              message: `ID ${studentNumber.toUpperCase()} recognized at ${institutionId}. Campus: ${studentInfo.campus}.`,
              type: 'success'
            }
          }));
        }

        // Lecturer Signup Verification
        if (selectedRole === UserRole.TEACHER) {
          const lecturerInfo = MOCK_LECTURER_REGISTRY[lecturerId.toUpperCase()];
          if (!lecturerInfo || lecturerInfo.faculty !== faculty) {
            setError('Lecturer ID or Faculty mismatch. Please check your staff portal credentials.');
            setLoading(false);
            return;
          }
          finalUserData = { ...finalUserData, ...lecturerInfo, lecturerId: lecturerId.toUpperCase() };

          window.dispatchEvent(new CustomEvent('nexlink-notification', {
            detail: {
              title: 'Staff Record Synced',
              message: `Welcome Dr./Prof. ${finalUserData.name}. You are assigned to the ${lecturerInfo.campus}.`,
              type: 'success'
            }
          }));
        }
      }

      const user: UserProfile = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        ...finalUserData as UserProfile
      };
      
      onLogin(user);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] bg-emerald-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-lg bg-white rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] p-8 md:p-14 relative z-10 border border-white/20">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center font-black text-white text-4xl mx-auto shadow-2xl shadow-indigo-600/40 mb-8 transform hover:scale-105 transition-transform cursor-pointer">N</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">NexLink <span className="text-indigo-600">Varsity</span></h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
            {step === 'category' ? 'Tertiary Portal Selection' : `${selectedRole?.replace('_', ' ')} Authentication`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
              <Lock size={16} />
            </div>
            <p className="text-xs font-bold uppercase tracking-tight leading-tight">{error}</p>
          </div>
        )}

        {step === 'category' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Select Your Access Tier</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CategoryCard onClick={() => handleSelectCategory(UserRole.INSTITUTION_ADMIN)} icon={<Settings size={28} />} label="Admin" color="bg-slate-900" />
              <CategoryCard onClick={() => handleSelectCategory(UserRole.TEACHER)} icon={<Briefcase size={28} />} label="Lecturer" color="bg-indigo-600" />
              <CategoryCard onClick={() => handleSelectCategory(UserRole.STUDENT)} icon={<GraduationCap size={28} />} label="Student" color="bg-emerald-600" />
            </div>
            <div className="pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-medium">
                New Enrollment? <button onClick={() => { setSelectedRole(UserRole.STUDENT); setStep('form'); setMode('signup'); }} className="text-indigo-600 font-bold hover:underline">Register Varsity ID</button>
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <button onClick={handleGoBack} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-8 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back to selection</span>
            </button>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Choice of Institution</label>
                  <div className="relative">
                    <School className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      required
                      value={institutionId}
                      onChange={(e) => setInstitutionId(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-14 pr-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none appearance-none font-bold text-slate-700"
                    >
                      <option value="">Select Institution...</option>
                      {MOCK_INSTITUTIONS.map(inst => <option key={inst.id} value={inst.name}>{inst.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {mode === 'signup' && selectedRole === UserRole.STUDENT && (
                <div className="space-y-1.5 p-4 bg-emerald-50 rounded-3xl border border-emerald-100">
                  <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest ml-1">Student Number</label>
                  <div className="relative">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-300" size={18} />
                    <input type="text" required value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} placeholder="e.g. STU2025001" className="w-full bg-white border-none rounded-2xl pl-14 pr-6 py-4 text-sm focus:ring-4 focus:ring-emerald-500/10 outline-none font-black" />
                  </div>
                </div>
              )}

              {mode === 'signup' && selectedRole === UserRole.TEACHER && (
                <div className="space-y-4 p-4 bg-indigo-50 rounded-3xl border border-indigo-100">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest ml-1">Lecturer ID</label>
                    <div className="relative">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                      <input type="text" required value={lecturerId} onChange={(e) => setLecturerId(e.target.value)} placeholder="e.g. LEC-SCI-001" className="w-full bg-white border-none rounded-2xl pl-14 pr-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none font-black" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest ml-1">Assigned Faculty</label>
                    <div className="relative">
                      <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                      <select required value={faculty} onChange={(e) => setFaculty(e.target.value)} className="w-full bg-white border-none rounded-2xl pl-14 pr-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none appearance-none font-bold text-slate-700">
                        <option value="">Select Faculty...</option>
                        {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Official Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium" />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Access</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@varsity.ac.za" className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={loading} className="w-full py-5 bg-slate-950 text-white rounded-[1.8rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-950/20 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? <ShieldCheck size={20} /> : <UserPlus size={20} />)}
                  {mode === 'login' ? 'Access Dashboard' : 'Verify & Enroll'}
                </button>
              </div>

              <div className="text-center pt-4">
                <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-xs font-bold text-indigo-600 hover:underline">
                  {mode === 'login' ? "Don't have an account? Enroll Now" : "Already verified? Access Portal"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">POPIA Varsity Node • RSA Academic Cloud</p>
        </div>
      </div>
    </div>
  );
};

const CategoryCard = ({ onClick, icon, label, color }: any) => (
  <button onClick={onClick} className={`w-full p-8 rounded-[2.5rem] ${color} text-white flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/5 group relative overflow-hidden`}>
    <div className="relative z-10 flex flex-col items-center gap-3">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
  </button>
);

export default Login;

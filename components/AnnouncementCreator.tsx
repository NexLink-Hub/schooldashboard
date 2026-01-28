
import React, { useState } from 'react';
import { Sparkles, Send, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { generateSchoolAnnouncement } from '../services/geminiService';

const AnnouncementCreator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'professional' | 'urgent' | 'friendly'>('professional');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    const result = await generateSchoolAnnouncement(topic, tone);
    setContent(result || '');
    setLoading(false);
  };

  const handlePost = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus('success');
      
      // Dispatch live notification
      window.dispatchEvent(new CustomEvent('nexlink-notification', {
        detail: {
          title: tone === 'urgent' ? '⚠️ Urgent Announcement' : '📢 New School Blast',
          message: topic.length > 50 ? topic.substring(0, 50) + '...' : topic,
          type: tone === 'urgent' ? 'alert' : 'success'
        }
      }));

      setTimeout(() => setStatus('idle'), 3000);
      setContent('');
      setTopic('');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">NexLink AI Assistant</h2>
            <p className="text-sm text-slate-500 font-medium tracking-tight">Draft professional school announcements in seconds</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Announcement Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Upcoming Inter-house Athletics Day"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Tone & Context</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-100 outline-none appearance-none transition-all font-bold"
            >
              <option value="professional">Professional & Formal</option>
              <option value="friendly">Friendly & Encouraging</option>
              <option value="urgent">Urgent & Critical</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="w-full md:w-auto px-10 py-4 bg-slate-950 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-xl shadow-slate-900/10"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          AI Draft
        </button>
      </div>

      {content && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Review AI Composition</h3>
            <span className="text-[10px] font-black px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full uppercase tracking-widest border border-indigo-100">NexLink Pro Engine</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-80 p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium text-sm leading-relaxed mb-6"
          />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-50 pt-6">
            <div className="flex items-center gap-3 text-slate-400">
              <AlertTriangle size={18} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Always verify AI-generated dates and times.</span>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => setContent('')}
                className="flex-1 md:flex-none px-6 py-4 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all active:scale-95"
              >
                Discard
              </button>
              <button 
                onClick={handlePost}
                disabled={loading}
                className="flex-1 md:flex-none px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {status === 'success' ? (
                  <>
                    <CheckCircle2 size={20} />
                    Blast Sent!
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Publish to Portal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementCreator;


import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, Phone, Video, CheckCheck, Sparkles, Loader2, User, Users } from 'lucide-react';
import { generateSmartReplies } from '../services/geminiService';
import { Conversation, Message, UserProfile } from '../types';

interface MessagingModuleProps {
  currentUser: UserProfile;
}

const MessagingModule: React.FC<MessagingModuleProps> = ({ currentUser }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('nexlink_conversations');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Grade 10A Parents',
        isGroup: true,
        lastMessage: 'Thank you for the update on the excursion.',
        unreadCount: 0,
        messages: [
          { id: 'm1', senderId: 'u2', text: 'Hi everyone, just a reminder about tomorrow\'s field trip.', timestamp: '09:00 AM', isRead: true },
          { id: 'm2', senderId: 'parent1', text: 'Thank you for the update on the excursion.', timestamp: '09:15 AM', isRead: true }
        ]
      }
    ];
  });

  const [activeChatId, setActiveChatId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  useEffect(() => {
    localStorage.setItem('nexlink_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeChatId) {
        return {
          ...conv,
          lastMessage: text,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setInputText('');
    setSuggestions([]);

    // Simulate Reply with typing indicator
    if (!activeChat.isGroup) {
      setTimeout(() => setIsTyping(true), 1000);
      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'other',
          text: `Got your message: "${text}". I'll look into it.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        };
        setConversations(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text } : c));
      }, 3500);
    }
  };

  const getAISuggestions = async () => {
    setLoadingAI(true);
    const context = activeChat.messages.slice(-3).map(m => m.text).join('\n');
    const replies = await generateSmartReplies(context);
    setSuggestions(replies);
    setLoadingAI(false);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="w-80 border-r border-slate-100 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Messages</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`w-full p-4 flex items-center gap-4 transition-colors ${activeChatId === chat.id ? 'bg-indigo-50/50 border-r-4 border-indigo-600' : 'hover:bg-slate-50'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${chat.isGroup ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                {chat.isGroup ? <Users size={20} /> : <User size={20} />}
              </div>
              <div className="text-left overflow-hidden flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-slate-900 truncate pr-2">{chat.name}</h4>
                  {chat.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50/30">
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeChat?.isGroup ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
              {activeChat?.isGroup ? <Users size={18} /> : <User size={18} />}
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{activeChat?.name}</h4>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active Now</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Phone size={20} /></button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Video size={20} /></button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeChat?.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                msg.senderId === currentUser.id 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${msg.senderId === currentUser.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                  <span className="text-[10px] font-medium">{msg.timestamp}</span>
                  {msg.senderId === currentUser.id && <CheckCheck size={12} className="text-white" />}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-6 bg-white border-t border-slate-100 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={getAISuggestions}
              disabled={loadingAI}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loadingAI ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Smart Replies
            </button>
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(s)}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100 hover:bg-indigo-100 transition-all"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              placeholder="Type your message..." 
              className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500/20"
            />
            <button 
              onClick={() => handleSend(inputText)}
              className="w-12 h-12 md:w-14 md:h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-90"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingModule;

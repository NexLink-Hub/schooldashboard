
import React from 'react';
import { PRICING_TIERS } from '../constants';
import { Check, ShieldCheck, Zap, Globe } from 'lucide-react';

const PricingStrategyView: React.FC = () => {
  const handleSelectPlan = (tier: string) => {
    window.dispatchEvent(new CustomEvent('nexlink-notification', {
      detail: {
        title: 'Subscription Update',
        message: `Processing your request for the ${tier} plan. A representative will contact you soon.`,
        type: 'success'
      }
    }));
  };

  const handleDemoRequest = (type: string) => {
    window.dispatchEvent(new CustomEvent('nexlink-notification', {
      detail: {
        title: 'Demo Requested',
        message: `Thank you! We've received your request for a ${type} demo.`,
        type: 'info'
      }
    }));
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">South African Market Strategy</h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          Affordable, POPIA-compliant communication infrastructure for public and private schools across the 9 provinces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRICING_TIERS.map((item) => (
          <div key={item.tier} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col hover:border-indigo-300 transition-all group">
            {item.tier === 'Professional' && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest rounded-bl-xl">
                Most Popular
              </div>
            )}
            <div className={`w-14 h-14 rounded-2xl ${item.color.split(' ')[0]} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
               {item.tier === 'Starter' ? <Zap size={28} /> : item.tier === 'Professional' ? <ShieldCheck size={28} /> : <Globe size={28} />}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.tier}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-slate-900">{item.price}</span>
              <span className="text-slate-400 font-medium">/month</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Annual Prepaid</p>
              <p className="text-sm font-bold text-indigo-600">{item.annual} <span className="text-slate-400 font-normal">(-17% off)</span></p>
            </div>
            <div className="space-y-4 mb-10 flex-1">
              <div className="flex items-center gap-3 text-sm text-slate-600 font-semibold">
                <Check size={18} className="text-indigo-500" />
                Max {item.users} Users
              </div>
              {item.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-sm text-slate-500">
                  <Check size={18} className="text-indigo-500" />
                  {f}
                </div>
              ))}
            </div>
            <button 
              onClick={() => handleSelectPlan(item.tier)}
              className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${
              item.tier === 'Professional' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}>
              Select Plan
            </button>
          </div>
        ))}
      </div>

      <div className="bg-indigo-900 rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-3xl font-bold mb-6">Enterprise & Government Solutions</h3>
          <p className="text-indigo-100 text-lg mb-8 leading-relaxed font-medium">
            Managing a cluster of schools or a district? We offer white-label solutions, specialized multi-institution analytics, and deep integrations with existing LMS platforms like Moodle and Canvas.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => handleDemoRequest('District')}
              className="px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
            >
              Request District Demo
            </button>
            <button 
              onClick={() => handleDemoRequest('Case Studies')}
              className="px-8 py-4 bg-indigo-800/50 border border-indigo-700 rounded-xl font-bold hover:bg-indigo-800 transition-all active:scale-95"
            >
              View Case Studies
            </button>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20" />
      </div>
    </div>
  );
};

export default PricingStrategyView;

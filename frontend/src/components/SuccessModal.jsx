import React from 'react';

const SuccessModal = ({ title, message, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm fade-in">
      <div className="glass p-12 rounded-[50px] border border-white/20 shadow-3xl bg-slate-900/40 text-center space-y-8 max-w-sm w-full zoom-in-95">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
          <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          </svg>
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{title}</h3>
          <p className="text-slate-400 font-medium">{message}</p>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full animate-[progress_3s_linear]"></div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;

import React from 'react';

const QuestModal = ({ activeQuest, onClose }) => {
  if (!activeQuest) return null;

  return (
    <div className="absolute inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] p-8 max-w-lg w-full shadow-2xl border-b-[12px] border-pokeBlue animate-bounceIn overflow-hidden relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img src={activeQuest.icon} className="w-16 h-16 drop-shadow-md" alt="Quest" />
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">{activeQuest.title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Missão Ativa</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors"
          >
            ✖
          </button>
        </div>

        <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 mb-6 italic text-slate-600 font-bold text-sm">
          <p>"{activeQuest.desc}"</p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-slate-400 uppercase">Recompensa:</span>
            <span className="text-sm font-black text-pokeGold uppercase tracking-tighter">{activeQuest.reward}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-pokeBlue text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
        >
          Entendido!
        </button>
      </div>
    </div>
  );
};

export default QuestModal;

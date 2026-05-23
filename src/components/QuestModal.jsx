import React from 'react';

const QuestModal = ({ activeQuest, quest, onClose, onAccept, onDecline }) => {
  const data = quest || activeQuest;
  if (!data) return null;

  const closeAction = onDecline || onClose;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
      <div className="modal-panel-mobile bg-white shadow-2xl overflow-hidden flex flex-col border-b-[8px] border-blue-900 animate-bounceIn">
        <div className="bg-blue-600 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <img src={data.icon} className="w-9 h-9 object-contain drop-shadow-md" alt="Missao" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest break-words">
                {onAccept ? 'Nova Missao' : 'Missao Ativa'}
              </p>
              <h3 className="text-white text-lg font-black uppercase italic leading-tight break-words">
                {data.title}
              </h3>
            </div>
          </div>
          <button
            onClick={closeAction}
            className="w-11 h-11 rounded-full bg-white/20 text-white font-black flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
            aria-label="Fechar"
          >
            x
          </button>
        </div>

        <div className="modal-scroll-content px-6 py-5 flex flex-col gap-4">
          <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 italic text-slate-600 font-bold text-sm leading-relaxed break-words">
            "{data.desc}"
          </div>

          <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4 flex items-center justify-between gap-3">
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Recompensa</span>
            <span className="text-sm font-black text-amber-600 uppercase text-right">{data.reward}</span>
          </div>
        </div>

        <div className="px-6 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-100 flex gap-3 shrink-0">
          {onAccept ? (
            <>
              <button
                onClick={onDecline}
                className="flex-1 min-h-[52px] rounded-2xl bg-slate-100 text-slate-500 font-black text-sm uppercase"
              >
                Agora Nao
              </button>
              <button
                onClick={onAccept}
                className="flex-1 min-h-[52px] rounded-2xl bg-blue-600 text-white font-black text-sm uppercase shadow-lg shadow-blue-200"
              >
                Aceitar
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full min-h-[52px] rounded-2xl bg-blue-600 text-white font-black text-sm uppercase shadow-lg shadow-blue-200"
            >
              Entendido
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestModal;

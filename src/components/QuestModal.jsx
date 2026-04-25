import React from 'react';

const QuestModal = ({ activeQuest, quest, onClose, onAccept, onDecline }) => {
  const data = quest || activeQuest;
  if (!data) return null;

  return (
    <div className="absolute inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[3rem] max-w-lg w-full shadow-2xl border-b-[12px] border-pokeBlue animate-bounceIn overflow-hidden relative">
        <div style={{padding: '32px 32px 0 32px'}}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <img src={data.icon} className="w-16 h-16 drop-shadow-md" alt="Quest" />
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">{data.title}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{onAccept ? 'Nova Missão!' : 'Missão Ativa'}</p>
              </div>
            </div>
            <button 
              onClick={onDecline || onClose} 
              className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors"
            >
              ✖
            </button>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 mb-6 italic text-slate-600 font-bold text-sm">
            <p>"{data.desc}"</p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black text-slate-400 uppercase">Recompensa:</span>
              <span className="text-sm font-black text-amber-500 uppercase tracking-tighter">{data.reward}</span>
            </div>
          </div>
        </div>

        {/* Botões — com margem das bordas */}
        <div style={{
          padding: '0 20px 28px 20px',
          display: 'flex',
          gap: '12px',
          justifyContent: onAccept ? 'stretch' : 'center'
        }}>
          {onAccept ? (
            <>
              <button 
                onClick={onDecline}
                style={{flex:1, padding:'16px 8px', borderRadius:'16px', fontWeight:900, fontSize:'14px', textTransform:'uppercase', background:'#f1f5f9', color:'#94a3b8', border:'none', cursor:'pointer'}}
              >
                Agora Não
              </button>
              <button 
                onClick={onAccept}
                style={{flex:1, padding:'16px 8px', borderRadius:'16px', fontWeight:900, fontSize:'14px', textTransform:'uppercase', background:'#3b82f6', color:'white', border:'none', cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}
              >
                Aceitar!
              </button>
            </>
          ) : (
            <button 
              onClick={onClose}
              style={{flex:1, padding:'16px 8px', borderRadius:'16px', fontWeight:900, fontSize:'14px', textTransform:'uppercase', background:'#3b82f6', color:'white', border:'none', cursor:'pointer', boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}
            >
              Entendido!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestModal;

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getGlobalRanking, getUserProfile } from '../services/ranking';
import { auth } from '../firebase';
import { TrainerCardModal } from './CommonUI';

const RankingModal = ({ onClose }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchRanking = async () => {
      const data = await getGlobalRanking();
      setRanking(data);
      setLoading(false);
    };
    fetchRanking();
  }, []);

  const handlePlayerClick = async (uid) => {
    // Busca dados completos do perfil para o modal
    const profile = await getUserProfile(uid);
    if (profile) {
      setSelectedProfile(profile);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div className="bg-[#1a1a1a] w-full max-w-2xl rounded-[2.5rem] border-4 border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-bounceIn" style={{ maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
        
        {/* Header RPG Style */}
        <div className="p-6 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border-b-4 border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center shadow-inner border border-amber-500/30">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Ranking Global</h2>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Os Maiores Treinadores do Mundo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all font-black border-2 border-slate-700"
          >X</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#141414]">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-amber-500 font-black uppercase italic animate-pulse">Sincronizando Dados...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ranking.map((player, index) => {
                const isTop3 = index < 3;
                const isMe = currentUser && player.id === currentUser.uid;
                const rank = index + 1;
                
                let borderColor = 'border-slate-800';
                if (rank === 1) borderColor = 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
                if (rank === 2) borderColor = 'border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.2)]';
                if (rank === 3) borderColor = 'border-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.2)]';

                return (
                  <div 
                    key={player.id}
                    onClick={() => handlePlayerClick(player.id)}
                    className={`flex items-center justify-between p-4 rounded-3xl border-2 bg-[#1e1e1e] transition-all cursor-pointer hover:scale-[1.01] hover:bg-[#252525] ${borderColor} ${isMe ? 'ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] z-10' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Posição */}
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        {rank === 1 && <span className="text-3xl">🥇</span>}
                        {rank === 2 && <span className="text-3xl">🥈</span>}
                        {rank === 3 && <span className="text-3xl">🥉</span>}
                        {rank > 3 && <span className="text-lg font-black text-slate-500">#{rank}</span>}
                      </div>

                      {/* Avatar & Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden">
                           <img 
                             src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/${player.avatar || 1}.png`} 
                             className="w-full h-full object-contain scale-125 translate-y-1" 
                             alt="" 
                           />
                        </div>
                        <div>
                          <h4 className={`font-black uppercase italic leading-none ${isMe ? 'text-blue-400' : 'text-white'}`}>
                            {player.name} {isMe && <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded ml-1 not-italic tracking-normal">VOCÊ</span>}
                          </h4>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Nível de Prestígio</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className="text-center">
                          <p className="text-[8px] font-black text-slate-500 uppercase">Insígnias</p>
                          <div className="flex items-center gap-1 justify-center mt-0.5">
                            <span className="text-sm font-black text-amber-500">{player.badges || 0}</span>
                            <span className="text-xs">🎖️</span>
                          </div>
                       </div>
                       <div className="bg-slate-800/50 px-4 py-2 rounded-2xl border border-white/5 min-w-[100px]">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter text-center">Power Score</p>
                          <p className={`text-sm font-black text-center mt-0.5 ${isTop3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {player.powerScore?.toLocaleString()}
                          </p>
                       </div>
                    </div>
                  </div>
                );
              })}
              
              {ranking.length === 0 && !loading && (
                <div className="p-12 text-center text-slate-500 font-bold italic">
                   Nenhum treinador registrado no ranking ainda.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1a1a1a] border-t-2 border-slate-800 text-center">
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">Clique em um treinador para inspecionar o card</p>
        </div>
      </div>

      {selectedProfile && (
        <TrainerCardModal 
          userData={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </div>,
    document.body
  );
};

export default RankingModal;

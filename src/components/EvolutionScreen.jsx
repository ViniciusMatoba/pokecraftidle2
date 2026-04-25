import React from 'react';

const EvolutionScreen = ({ evolutionPending, POKEDEX, setGameState, addLog, setEvolutionPending }) => {
  if (!evolutionPending) return null;

  return (
    <div className="absolute inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/98 backdrop-blur-3xl animate-fadeIn">
       <div className="max-w-2xl w-full text-center relative">
          {/* Efeitos de Luz de Fundo */}
          <div className="absolute inset-0 bg-blue-500/10 blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-slowSpin"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="flex items-center gap-6 md:gap-16 mb-16">
                <div className="relative">
                   <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionPending.id}.png`} className="w-32 h-32 md:w-44 md:h-44 grayscale brightness-150 animate-pulse" alt="Old" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                </div>

                <div className="flex flex-col items-center">
                   <span className="text-white text-4xl md:text-6xl font-black drop-shadow-lg animate-bounce">⚡</span>
                   <div className="w-20 h-1 bg-white/20 rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-white animate-loading"></div>
                   </div>
                </div>

                 <div className="relative group">
                    {/* Brilho de fundo para a silhueta */}
                    <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full animate-pulse group-hover:bg-white/40 transition-all"></div>
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${POKEDEX[evolutionPending.id].evolution.id}.png`} 
                      className="w-32 h-32 md:w-56 md:h-56 brightness-0 invert opacity-40 animate-evolution-glow drop-shadow-[0_0_50px_rgba(255,255,255,0.6)] relative z-10" 
                      alt="Silhueta da Evolução" 
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle,white_0%,transparent_70%)] opacity-30 animate-ping pointer-events-none"></div>
                 </div>
             </div>

             <div className="bg-white p-12 rounded-[4rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-b-[16px] border-slate-100 w-full max-w-lg transform hover:scale-[1.02] transition-transform">
                <h3 className="text-4xl font-black text-slate-800 uppercase italic mb-6 tracking-tighter bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">O QUE?!</h3>
                <p className="text-xl font-bold text-slate-600 mb-12 leading-relaxed">
                   Seu <span className="text-pokeBlue font-black uppercase underline decoration-4 decoration-blue-100 underline-offset-4">{evolutionPending.name}</span> está começando a evoluir!
                </p>
                
                <div style={{
                   display: 'flex',
                   flexDirection: 'column',
                   gap: '12px',
                   padding: '0'
                 }}>
                    <button 
                     onClick={() => {
                         const evoData = POKEDEX[evolutionPending.id].evolution;
                         const nextPoke = POKEDEX[evoData.id];
                         setGameState(prev => {
                            const newTeam = prev.team.map((p, i) => {
                               if (i === evolutionPending.teamIndex) {
                                  const shinyMult = p.isShiny ? 1.2 : 1.0;
                                  const calcStat = (b, lv) => Math.max(1, Math.ceil(Math.ceil(((2 * b * lv) / 100) + 5) * shinyMult));
                                  const calcHp   = (b, lv) => Math.max(1, Math.ceil(Math.ceil(((2 * b * lv) / 100) + lv + 10) * shinyMult));

                                  return {
                                     ...p,
                                     id: evoData.id,
                                     name: nextPoke.name,
                                     type: nextPoke.type,
                                     maxHp: calcHp(nextPoke.hp || nextPoke.maxHp || 40, p.level),
                                     hp: calcHp(nextPoke.hp || nextPoke.maxHp || 40, p.level),
                                     attack: calcStat(nextPoke.attack || 40, p.level),
                                     defense: calcStat(nextPoke.defense || 40, p.level),
                                     spAtk: calcStat(nextPoke.spAtk || 40, p.level),
                                     spDef: calcStat(nextPoke.spDef || 40, p.level),
                                     speed: calcStat(nextPoke.speed || 40, p.level)
                                  };
                               }
                               return p;
                            });
                            return { 
                              ...prev, 
                              team: newTeam,
                              caughtData: { ...prev.caughtData, [evoData.id]: true }
                            };
                         });
                         addLog(`✨ Parabéns! Seu ${evolutionPending.name} evoluiu para ${nextPoke.name}!`, 'system');
                         setEvolutionPending(null);
                       }}
                     style={{
                       width: '100%',
                       padding: '20px 8px',
                       borderRadius: '24px',
                       fontWeight: 900,
                       fontSize: '16px',
                       textTransform: 'uppercase',
                       background: '#1e293b',
                       color: 'white',
                       border: 'none',
                       cursor: 'pointer',
                       boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: '16px'
                     }}
                    >
                      <span>Completar Evolução</span>
                      <span>➜</span>
                    </button>
                    <button 
                      onClick={() => setEvolutionPending(null)}
                      style={{
                        width: '100%',
                        padding: '12px 8px',
                        borderRadius: '16px',
                        fontWeight: 900,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        background: 'transparent',
                        color: '#94a3b8',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >Parar Evolução (B)</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default EvolutionScreen;

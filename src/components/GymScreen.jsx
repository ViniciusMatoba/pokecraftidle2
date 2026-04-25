import React, { useState } from 'react';
import { GYMS, ELITE_FOUR, TYPE_COLOR_HEX } from '../data/gyms';
import { BadgeSVG } from './CommonUI';

const typeIconUrl = (t) =>
  t ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.toLowerCase()}.svg` : null;

const BadgeIcon = ({ badgeId, earned }) => (
  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${earned ? 'border-yellow-400 bg-white shadow-xl shadow-yellow-200/50 scale-110' : 'border-slate-300/30 bg-slate-100/10 grayscale opacity-40'}`}>
     <BadgeSVG badgeId={badgeId} earned={earned} size={32} />
  </div>
);

const GymCard = ({ gym, earned, locked, onClick }) => {
  const col = TYPE_COLOR_HEX[gym.type] || '#555';
  const c2 = col + 'bb';

  return (
    <div
      className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all mb-4 ${locked ? 'opacity-40 grayscale-[0.5]' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer group'}`}
      style={{ background: `linear-gradient(165deg, ${col} 0%, ${c2} 40%, #0a0a15 100%)`, minHeight: '180px' }}
      onClick={() => onClick(gym)}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="absolute top-5 left-6 z-20">
        <h4 className="text-white font-black text-lg uppercase italic leading-none tracking-tighter drop-shadow-lg">
          {gym.badgeOrder}° GYM - Líder {gym.name}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          {earned && <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">( CONQUISTADA</span>}
          {locked && <span className="bg-black/60 text-white/50 text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md">= BLOQUEADO</span>}
        </div>
      </div>

      <div className="absolute top-5 right-6 z-20 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/10">
        {gym.typeIcon && <img src={gym.typeIcon} className="w-4 h-4 invert" alt={gym.type} />}
        <span className="text-white text-[10px] font-black uppercase tracking-widest">{gym.type}</span>
      </div>

      <div className="flex justify-end pr-4 pt-12 relative z-10 pointer-events-none">
        <img
          src={gym.sprite}
          alt={gym.name}
          className="w-32 h-32 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] scale-110 translate-y-4 group-hover:scale-125 transition-transform duration-500"
          onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 z-20">
         <div className="flex items-center gap-4">
            <BadgeIcon badgeId={gym.badge} earned={earned} />
            <div className="flex-1">
               <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">{gym.city}</p>
               <p className="text-white text-xs font-bold uppercase italic">Ver Detalhes</p>
            </div>
            {!earned && !locked && (
               <div className="bg-white/20 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase backdrop-blur-md border border-white/10">
                  = INFO
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

const EliteCard = ({ member, index, earned, locked, onClick }) => {
  const col = TYPE_COLOR_HEX[member.type] || '#333';
  const c2 = col + 'bb';

  return (
    <div
      className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all mb-4 ${locked ? 'opacity-40 grayscale-[0.5]' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer group'}`}
      style={{ background: `linear-gradient(165deg, ${col} 0%, ${c2} 40%, #150a0a 100%)`, minHeight: '120px' }}
      onClick={() => !locked && onClick(member)}
    >
      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="absolute top-4 left-5 z-20">
        <h4 className="text-white font-black text-sm uppercase italic leading-none tracking-tighter drop-shadow-lg opacity-80">
          Elite 4 #{index + 1}
        </h4>
        <p className="text-white font-black text-xl uppercase italic leading-none tracking-tighter mt-1">{member.name}</p>
      </div>

      <div className="absolute top-4 right-5 z-20 flex items-center gap-2 bg-white/5 px-2 py-1 rounded-xl backdrop-blur-md border border-white/5">
        <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">{member.type}</span>
      </div>

      <div className="flex justify-end pr-2 pt-4 relative z-10 pointer-events-none overflow-hidden h-24">
        <img
          src={member.sprite}
          alt={member.name}
          className="w-32 h-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] translate-y-2 group-hover:scale-110 transition-transform"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
         <div className="flex items-center gap-3">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Nv. {member.team[0]?.level}+</p>
            {earned && <span className="bg-pokeGold text-yellow-950 text-[8px] font-black px-2 py-0.5 rounded-full"> VENCIDO</span>}
         </div>
      </div>
    </div>
  );
};

const GymAlertModal = ({ req, onGo, onClose }) => (
  <div className="absolute inset-0 z-[400] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
    <div className="bg-slate-900 w-full max-w-xs rounded-[2.5rem] p-8 border border-white/10 shadow-2xl animate-bounceIn text-center">
      <div className="text-4xl mb-4">=</div>
      <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-4">Caminho Bloqueado!</h3>
      <p className="text-white/60 text-sm font-bold mb-8 leading-relaxed">
        Para desafiar este Líder, você precisa primeiro:<br/>
        <span className="text-red-400 font-black">"{req}"</span>
      </p>
      <div className="flex flex-col gap-3">
        <button 
          onClick={onGo}
          className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 transition-all shadow-xl active:scale-95"
        >
          Ir para o Desafio!
        </button>
        <button 
          onClick={onClose}
          className="w-full bg-slate-800 text-white/40 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
);

const GymDetailModal = ({ gym, earned, locked, onChallenge, onClose, gameState, setCurrentView, setVsInitialTab, setVsInitialCategory }) => {
  const col = TYPE_COLOR_HEX[gym.type] || '#555';
  const [alertReq, setAlertReq] = useState(null);

  const isRequirementMet = (req) => {
    if (req === 'has_starter') return (gameState.team?.length || 0) > 0;
    if (req === 'viridian_forest_cleared') return gameState.worldFlags?.includes('viridian_forest_cleared');
    
    // Suporte para "X_badges"
    if (req.includes('_badges')) {
      const count = parseInt(req.split('_')[0]);
      return (gameState.badges?.length || 0) >= count;
    }

    // Suporte para badges específicas por string
    if (gameState.badges?.includes(req)) return true;

    return (gameState.worldFlags || []).includes(req);
  };

  const getRequirements = () => {
    const reqs = [];
    if (gym.id === 'brock') reqs.push('viridian_forest_cleared');
    if (gym.unlockAfterBadges > 0) reqs.push(`${gym.unlockAfterBadges}_badges`);
    if (gym.category === 'elite') reqs.push('8_badges');
    return reqs;
  };

  const formatReq = (req) => {
    if (req === 'viridian_forest_cleared') return 'Vencer o Recruta Rocket na Floresta';
    if (req === '8_badges') return 'Ter as 8 Insígnias de Kanto';
    if (req.includes('_badges')) return `Ter ${req.split('_')[0]} Insígnias`;
    return req;
  };

  const handleReqClick = (req) => {
    if (req === 'viridian_forest_cleared') {
      if (setVsInitialTab) setVsInitialTab('challenges');
      if (setVsInitialCategory) setVsInitialCategory('rocket');
      setCurrentView('vs');
      onClose();
    } else if (req.includes('badges')) {
       // Já está em Gyms, mas se for Elite 4, talvez precise voltar pros ginásios?
       // O usuário já está vendo os ginásios.
    }
  };
  
  return (
    <div className="absolute inset-0 z-[300] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fadeIn" onClick={onClose}>
      {alertReq && (
        <GymAlertModal 
          req={formatReq(alertReq)} 
          onClose={() => setAlertReq(null)} 
          onGo={() => { handleReqClick(alertReq); setAlertReq(null); }} 
        />
      )}
      <div 
        className="bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border-2 border-white/10 animate-bounceIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Colorido */}
        <div className="p-8 pb-4 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${col} 0%, #0f172a 100%)` }}>
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
             <img src={gym.badgeImg || gym.typeIcon} className="w-32 h-32" alt="" />
          </div>
          
          <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white text-2xl font-black transition-all"></button>
          
          <div className="relative z-10 text-left">
            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{gym.name}</h3>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
                 {gym.typeIcon && <img src={gym.typeIcon} className="w-3 h-3 invert" alt="" />}
                 <span className="text-white text-[10px] font-black uppercase tracking-widest">Especialista em {gym.type}</span>
              </div>
              <span className="text-white/40 text-[10px] font-black uppercase">{gym.city}</span>
            </div>
          </div>
        </div>

        <div style={{flex:1, overflowY:'auto'}}>

          {/* Citação */}
          <div style={{
            padding:'14px 20px',
            background:'rgba(0,0,0,0.2)',
            borderBottom:'1px solid rgba(255,255,255,0.05)',
          }}>
            <p style={{color:'rgba(255,255,255,0.7)', fontSize:'12px', fontWeight:700, fontStyle:'italic', margin:0, lineHeight:1.5}}>
              "{gym.quote}"
            </p>
          </div>

          <div style={{padding:'16px 20px'}}>

            {/* Equipe */}
            <p style={{color:'#475569', fontSize:'9px', fontWeight:900, textTransform:'uppercase', letterSpacing:'2px', margin:'0 0 12px 0'}}>
              Equipe de Batalha
            </p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'16px'}}>
              {gym.team.map((p, i) => (
                <div key={i} style={{
                  background:'rgba(255,255,255,0.05)',
                  borderRadius:'16px', padding:'10px 6px',
                  border:'1px solid rgba(255,255,255,0.08)',
                  display:'flex', flexDirection:'column', alignItems:'center',
                }}>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                    style={{width:'52px', height:'52px', objectFit:'contain'}}
                    alt=""
                  />
                  <span style={{color:'rgba(255,255,255,0.4)', fontSize:'8px', fontWeight:900, textTransform:'uppercase', marginTop:'4px'}}>
                    Nv. {p.level}
                  </span>
                </div>
              ))}
            </div>

            {/* Recompensa */}
            <div style={{
              background:'rgba(99,102,241,0.1)',
              border:'1px solid rgba(99,102,241,0.2)',
              borderRadius:'14px', padding:'12px 16px',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              marginBottom:'16px',
            }}>
              <div>
                <p style={{color:'#818cf8', fontSize:'8px', fontWeight:900, textTransform:'uppercase', letterSpacing:'1px', margin:'0 0 2px 0'}}>
                  Recompensa da Vitória
                </p>
                <p style={{color:'white', fontSize:'14px', fontWeight:900, margin:0}}>
                  💰 {gym.reward?.toLocaleString()} Coins
                </p>
              </div>
              {gym.badgeImg && (
                <img src={gym.badgeImg} style={{width:'36px', height:'36px', objectFit:'contain'}} alt="Badge" />
              )}
            </div>

            {/* Requisitos se bloqueado */}
            {locked && (
              <div style={{
                background:'rgba(239,68,68,0.1)',
                border:'1px solid rgba(239,68,68,0.2)',
                borderRadius:'14px', padding:'12px 16px',
                marginBottom:'16px',
              }}>
                <p style={{color:'#f87171', fontSize:'9px', fontWeight:900, textTransform:'uppercase', margin:'0 0 8px 0'}}>
                  🔒 Requisitos Necessários
                </p>
                {getRequirements().map(req => {
                  const met = isRequirementMet(req);
                  return (
                    <button key={req}
                      onClick={() => !met && handleReqClick(req)}
                      style={{
                        width:'100%', display:'flex', alignItems:'center', gap:'8px',
                        padding:'8px', borderRadius:'10px', border:'none',
                        background: met ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                        color: met ? '#4ade80' : '#f87171',
                        fontWeight:700, fontSize:'11px', cursor: met ? 'default' : 'pointer',
                        marginBottom:'4px', textAlign:'left',
                      }}
                    >
                      <span style={{
                        width:'20px', height:'20px', borderRadius:'50%', flexShrink:0,
                        background: met ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'10px',
                      }}>
                        {met ? '✓' : '!'}
                      </span>
                      <span style={{flex:1}}>{formatReq(req)}</span>
                      {!met && <span style={{fontSize:'9px', opacity:0.6}}>Ir →</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Botão ação */}
            {!locked && (
              <button
                onClick={() => { onChallenge(gym); onClose(); }}
                style={{
                  width:'100%', padding:'16px', borderRadius:'16px',
                  border:'none', fontWeight:900, fontSize:'15px',
                  textTransform:'uppercase', letterSpacing:'1px', cursor:'pointer',
                  background: earned ? '#059669' : col,
                  color:'white',
                  boxShadow:`0 4px 12px ${col}66`,
                }}
              >
                {earned ? '🔥 Desafiar Novamente' : '⚔️ Desafiar Agora!'}
              </button>
            )}
            {locked && (
              <button
                onClick={() => { const r = getRequirements().find(r => !isRequirementMet(r)); setAlertReq(r); }}
                style={{
                  width:'100%', padding:'16px', borderRadius:'16px',
                  background:'#1e293b', color:'#64748b', fontWeight:900,
                  fontSize:'14px', textTransform:'uppercase',
                  border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer',
                }}
              >
                🔒 Bloqueado — Ver Requisito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GymScreen = ({ gameState, onChallengeGym, onClose, initialSection, isEmbedded = false, setCurrentView, setVsInitialTab, setVsInitialCategory }) => {
  const [selectedGym, setSelectedGym] = React.useState(null);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (initialSection === 'elite4' && scrollRef.current) {
      const eliteHeader = scrollRef.current.querySelector('#elite4-section');
      if (eliteHeader) {
        eliteHeader.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialSection]);
  const badges = gameState.badges || [];
  const badgeCount = badges.length;
  const worldFlags = gameState.worldFlags || [];

  const hasBadge = (badgeId) => badges.includes(badgeId);

  const gymLocked = (gym) => {
    if (gym.id === 'brock' && !worldFlags.includes('viridian_forest_cleared')) return true;
    return badgeCount < gym.unlockAfterBadges;
  };

  const leagueLocked = badgeCount < 8;
  const eliteDefeated = (id) => worldFlags.includes(`defeated_elite_${id}`);
  const eliteLocked = (idx) => {
    if (leagueLocked) return true;
    if (idx === 0) return false;
    return !worldFlags.includes(`defeated_elite_${ELITE_FOUR[idx-1].id}`);
  };

  return (
    <div className={isEmbedded ? "h-full flex flex-col bg-slate-950" : "absolute inset-0 z-[110] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"} onClick={!isEmbedded ? onClose : undefined}>
      <div 
        className={isEmbedded ? "flex-1 flex flex-col overflow-hidden" : "w-full max-w-md bg-slate-950 rounded-t-[2rem] shadow-2xl flex flex-col animate-slideUp overflow-hidden"}
        style={!isEmbedded ? { height: '92dvh' } : {}}
        onClick={e => e.stopPropagation()}
      >

      {!isEmbedded && (
        /* Header */
        <div className="flex-shrink-0 px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/10">
          <div>
            <h2 className="text-white font-black text-xl uppercase italic tracking-tighter">🏆 Ginásios & Liga</h2>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">Kanto · {badgeCount}/8 insígnias</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white font-black text-lg w-8 h-8 flex items-center justify-center"></button>
        </div>
      )}

        {/* Badge Strip */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {GYMS.map(g => (
              <BadgeIcon key={g.id} src={g.badgeImg} earned={hasBadge(g.badge)} />
            ))}
          </div>
        </div>

        {/* Scroll content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 flex flex-col gap-6">

          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] px-2">Ginásios de Kanto</p>
          {GYMS.map((gym, i) => (
            <GymCard
              key={gym.id}
              gym={gym}
              earned={hasBadge(gym.badge)}
              locked={gymLocked(gym)}
              onClick={setSelectedGym}
            />
          ))}

          {selectedGym && (
            <GymDetailModal 
              gym={selectedGym}
              earned={hasBadge(selectedGym.badge)}
              locked={gymLocked(selectedGym)}
              onChallenge={onChallengeGym}
              onClose={() => setSelectedGym(null)}
              gameState={gameState}
              setCurrentView={setCurrentView}
              setVsInitialTab={setVsInitialTab}
              setVsInitialCategory={setVsInitialCategory}
            />
          )}

          <div className="mt-8">
            <div className="flex items-center gap-4 px-2 mb-6">
              <p id="elite4-section" className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] flex-1">Liga Pokémon</p>
              {leagueLocked && (
                <span className="bg-red-500/20 text-red-400 text-[9px] font-black px-4 py-1.5 rounded-full uppercase border border-red-500/30">
                  🔒 {badgeCount}/8 INSÍGNIAS
                </span>
              )}
            </div>

            {leagueLocked ? (
              <div className="rounded-2xl border-2 border-dashed border-white/10 p-6 text-center">
                <div className="text-4xl mb-2 opacity-30">🏛️</div>
                <p className="text-white/30 font-black uppercase text-xs italic">Derrote todos os 8 Líderes para acessar a Liga</p>
                <div className="flex justify-center gap-2 mt-3">
                  {Array.from({length: 8}, (_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < badgeCount ? 'bg-yellow-400' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {ELITE_FOUR.map((member, idx) => (
                  <EliteCard
                    key={member.id}
                    member={member}
                    index={idx}
                    earned={eliteDefeated(member.id)}
                    locked={eliteLocked(idx)}
                    onClick={setSelectedGym}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="h-4" />
        </div>
      </div>

      {selectedGym && (
        <GymDetailModal 
          gym={selectedGym}
          earned={hasBadge(selectedGym.badge) || eliteDefeated(selectedGym.id)}
          locked={gymLocked(selectedGym) || (ELITE_FOUR.some(e => e.id === selectedGym.id) && eliteLocked(ELITE_FOUR.findIndex(e => e.id === selectedGym.id)))}
          onChallenge={onChallengeGym}
          onClose={() => setSelectedGym(null)}
          gameState={gameState}
          setCurrentView={setCurrentView}
        />
      )}
    </div>
  );
};

export default GymScreen;

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { GYMS, ELITE_FOUR, TYPE_COLOR_HEX } from '../data/gyms';
import { BadgeSVG } from './CommonUI';
import { getBadgeCount, hasBadge as hasProgressBadge, hasProgressRequirement } from '../utils/progress';
import ChallengesScreen from './ChallengesScreen';

const JOHTO_BADGES = [
  { id: 'zephyr_badge', badge: 'zephyr_badge', badgeOrder: 1 },
  { id: 'hive_badge', badge: 'hive_badge', badgeOrder: 2 },
  { id: 'plain_badge', badge: 'plain_badge', badgeOrder: 3 },
  { id: 'fog_badge', badge: 'fog_badge', badgeOrder: 4 },
  { id: 'storm_badge', badge: 'storm_badge', badgeOrder: 5 },
  { id: 'mineral_badge', badge: 'mineral_badge', badgeOrder: 6 },
  { id: 'glacier_badge', badge: 'glacier_badge', badgeOrder: 7 },
  { id: 'rising_badge', badge: 'rising_badge', badgeOrder: 8 },
];

const typeIconUrl = (t) =>
  t ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.toLowerCase()}.svg` : null;

const BadgeIcon = ({ badgeId, earned, compact = false, order }) => (
  <div
    className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} rounded-full border-2 flex items-center justify-center transition-all relative ${
      earned
        ? 'border-yellow-400 bg-white shadow-xl shadow-yellow-200/50'
        : 'border-slate-300/30 bg-slate-100/10 grayscale opacity-45'
    }`}
    title={badgeId}
  >
     <BadgeSVG badgeId={badgeId} earned={earned} size={compact ? 24 : 32} />
     {compact && !earned && (
       <span className="absolute text-[9px] font-black text-white/40">{order}</span>
     )}
  </div>
);

const GymCard = ({ gym, earned, locked, onClick }) => {
  const col = TYPE_COLOR_HEX[gym.type] || '#555';
  const c2 = col + 'bb';

  return (
    <div
      className={`relative rounded-[2rem] overflow-hidden shadow-2xl transition-all ${locked ? 'opacity-40 grayscale-[0.5]' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer group'}`}
      style={{ background: `linear-gradient(165deg, ${col} 0%, ${c2} 40%, #0a0a15 100%)`, minHeight: '170px' }}
      onClick={() => onClick(gym)}
    >
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="absolute top-5 left-6 z-20">
        <h4 className="text-white font-black text-lg uppercase italic leading-none tracking-tighter drop-shadow-lg">
          GYM {gym.badgeOrder} - Lider {gym.name}
        </h4>
        <div className="mt-2 flex items-center gap-2 bg-black/20 w-fit px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/10">
          {gym.typeIcon && <img src={gym.typeIcon} className="w-4 h-4 invert" alt={gym.type} />}
          <span className="text-white text-[10px] font-black uppercase tracking-widest">{gym.type}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {earned && <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">CONQUISTADA</span>}
          {locked && <span className="bg-black/60 text-white/50 text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md">LOCK BLOQUEADO</span>}
        </div>
      </div>

      <div className="flex justify-end pr-4 pt-10 relative z-10 pointer-events-none">
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
               <div className="bg-white/20 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase backdrop-blur-md border border-white/10">INFO</div>
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
        <div className="mt-2 flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded-xl backdrop-blur-md border border-white/10 w-fit">
          {member.typeIcon && <img src={member.typeIcon} className="w-3.5 h-3.5 invert" alt="" />}
          <span className="text-white/70 text-[9px] font-black uppercase tracking-widest">{member.type}</span>
        </div>
      </div>

      <div className="flex justify-end pr-2 pt-4 relative z-10 pointer-events-none overflow-hidden h-24">
        <img
          src={member.sprite}
          alt={member.name}
          className="w-32 h-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] translate-y-2 group-hover:scale-110 transition-transform"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
         <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Nv. {member.team[0]?.level}+</p>
            {earned && <span className="bg-pokeGold text-yellow-950 text-[8px] font-black px-2 py-0.5 rounded-full">OK VENCIDO</span>}
         </div>
      </div>
    </div>
  );
};

const GymAlertModal = ({ req, onGo, onClose }) => (
  <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
    <div className="bg-slate-900 w-full max-w-xs rounded-[2.5rem] p-8 border border-white/10 shadow-2xl animate-bounceIn text-center">
      <div className="text-4xl mb-4">LOCK</div>
      <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-4">Caminho Bloqueado!</h3>
      <p className="text-white/60 text-sm font-bold mb-8 leading-relaxed">
        Para desafiar este Lider, você precisa primeiro:<br/>
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
    return hasProgressRequirement(gameState, req);
  };

  const getRequirements = () => {
    const reqs = [];
    if (gym.id === 'brock') reqs.push('viridian_forest_cleared');
    if (gym.unlockAfterBadges > 0) reqs.push(gym.unlockAfterBadges + '_badges');
    if (gym.category === 'elite') reqs.push('8_badges');
    return reqs;
  };

  const formatReq = (req) => {
    if (req === 'viridian_forest_cleared') return 'Vencer o Recruta Rocket na Floresta';
    if (req === '8_badges') return 'Ter as 8 Insignias de Kanto';
    if (req.includes('_badges')) return 'Ter ' + req.split('_')[0] + ' Insignias';
    return req;
  };

  const handleReqClick = (req) => {
    if (req === 'viridian_forest_cleared') {
      if (setVsInitialTab) setVsInitialTab('challenges');
      if (setVsInitialCategory) setVsInitialCategory('rocket');
      if (setCurrentView) setCurrentView('vs');
      onClose();
    }
  };

  const requirements = getRequirements();
  const leaderSprite = gym.sprite || 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png';
  const actionClass = 'w-full min-h-[56px] rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95 border-b-8 ' + (
    earned
      ? 'bg-emerald-600 text-white hover:bg-emerald-500 border-emerald-800'
      : 'bg-white text-slate-900 hover:bg-yellow-400 border-slate-200'
  );

  return createPortal((
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" onClick={onClose}>
      {alertReq && (
        <GymAlertModal
          req={formatReq(alertReq)}
          onClose={() => setAlertReq(null)}
          onGo={() => { handleReqClick(alertReq); setAlertReq(null); }}
        />
      )}

      <div
        className="modal-panel-mobile bg-slate-950 shadow-2xl overflow-hidden border-2 border-white/10 flex flex-col"
        style={{ backgroundColor: '#020617' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative overflow-hidden shrink-0" style={{ background: 'linear-gradient(135deg, ' + col + ' 0%, #0f172a 100%)' }}>
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-white/20 text-white font-black flex items-center justify-center hover:bg-white/30 transition-colors border border-white/20"
            aria-label="Fechar"
          >
            x
          </button>

          <div className="relative z-10 px-5 pt-5 pb-4 flex items-center gap-4 pr-12">
            <div className="w-20 h-20 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={leaderSprite}
                className="w-20 h-20 object-contain drop-shadow-2xl"
                alt={gym.name}
                onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest leading-none mb-1 pr-6">
                {gym.category === 'elite' ? 'Liga Pokemon' : 'Lider de Ginasio'}
              </p>
              <h3 className="text-white text-3xl font-black uppercase italic leading-none tracking-tighter truncate">{gym.name}</h3>
              <p className="mt-1 text-white/55 text-[10px] font-black uppercase tracking-widest truncate">{gym.city}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                  {gym.typeIcon && <img src={gym.typeIcon} className="w-3.5 h-3.5 invert" alt="" />}
                  {gym.type}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-scroll-content p-5 flex flex-col gap-5 bg-slate-950" style={{ backgroundColor: '#020617' }}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
            <p className="text-white/70 italic text-sm font-bold leading-relaxed">"{gym.quote}"</p>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.28em] mb-3 text-left">Equipe de Batalha</h4>
            <div className="grid grid-cols-3 gap-3">
              {gym.team.map((p, i) => (
                <div key={i} className="bg-slate-900 rounded-2xl p-3 border border-white/10 flex flex-col items-center min-h-[94px]">
                  <img
                    src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + p.id + '.png'}
                    className="w-14 h-14 object-contain"
                    alt="pokemon"
                  />
                  <span className="text-white/45 text-[9px] font-black mt-1">NV. {p.level}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="text-left min-w-0">
              <p className="text-indigo-300 text-[9px] font-black uppercase tracking-widest">Recompensa da Vitoria</p>
              <p className="text-white font-black text-base flex items-center gap-2">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-5 h-5 object-contain" alt="" />
                {gym.reward} Coins
              </p>
            </div>
            {gym.badgeImg && (
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                <img src={gym.badgeImg} className="w-8 h-8 object-contain drop-shadow-md" alt="Badge" />
              </div>
            )}
          </div>

          {locked && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
              <h4 className="text-[10px] font-black text-red-300 uppercase tracking-widest mb-3">Requisitos Necessarios</h4>
              <div className="space-y-2">
                {requirements.map(req => {
                  const met = isRequirementMet(req);
                  return (
                    <button
                      key={req}
                      onClick={() => !met && handleReqClick(req)}
                      className={'w-full text-left text-[10px] font-bold flex items-center gap-3 p-3 rounded-xl transition-all ' + (met ? 'text-green-300 bg-green-500/10' : 'text-red-300 bg-red-500/10 hover:bg-red-500/20')}
                    >
                      <span className={'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ' + (met ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300')}>
                        {met ? 'OK' : '!'}
                      </span>
                      <span className="flex-1">{formatReq(req)}</span>
                      <span className="text-[8px] uppercase opacity-60">{met ? 'OK' : 'Ir'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 pt-3 pb-6 border-t border-white/10 shrink-0 bg-slate-950">
          {!locked ? (
            <button onClick={() => { onChallenge(gym); onClose(); }} className={actionClass}>
              {earned ? 'Desafiar Novamente' : 'Desafiar Agora'}
            </button>
          ) : (
            <button
              onClick={() => {
                const firstUnmet = requirements.find(r => !isRequirementMet(r));
                setAlertReq(firstUnmet);
              }}
              className="w-full min-h-[56px] bg-slate-800 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-sm text-center border border-white/5 hover:bg-slate-700 transition-all active:scale-95"
            >
              Bloqueado - Ver Requisito
            </button>
          )}
        </div>
      </div>
    </div>
  ), document.body);
};

const GymScreen = ({ gameState, onChallengeGym, onChallenge, onClose, initialSection, isEmbedded = false, setCurrentView, setVsInitialTab, setVsInitialCategory }) => {
  const [selectedGym, setSelectedGym] = React.useState(null);
  const [leagueRegion, setLeagueRegion] = React.useState('kanto');
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
  const badgeCount = getBadgeCount(gameState);
  const worldFlags = gameState.worldFlags || [];
  const kantoChampion = worldFlags.includes('champion');

  React.useEffect(() => {
    if (initialSection === 'johto' && kantoChampion) {
      setLeagueRegion('johto');
    }
  }, [initialSection, kantoChampion]);

  React.useEffect(() => {
    if (!kantoChampion && leagueRegion === 'johto') setLeagueRegion('kanto');
  }, [kantoChampion, leagueRegion]);

  const hasBadge = (badgeId, order) => hasProgressBadge(gameState, badgeId, order);

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
          <button onClick={onClose} className="text-white/40 hover:text-white font-black text-lg w-8 h-8 flex items-center justify-center">x</button>
        </div>
      )}

        {/* Badge Strip */}
        <div className="flex-shrink-0 px-3 py-3 border-b border-white/10">
          {kantoChampion && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { id: 'kanto', label: 'Kanto' },
                { id: 'johto', label: 'Johto' },
              ].map(region => (
                <button
                  key={region.id}
                  onClick={() => setLeagueRegion(region.id)}
                  className={`min-h-[38px] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    leagueRegion === region.id
                      ? 'bg-pokeGold text-slate-950 shadow-lg'
                      : 'bg-white/5 text-white/40 hover:text-white/70'
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-8 gap-1.5 w-full">
            {(leagueRegion === 'johto' ? JOHTO_BADGES : GYMS).map(g => (
              <div key={g.id} className="flex justify-center">
                <BadgeIcon
                  badgeId={g.badge}
                  earned={hasBadge(g.badge, g.badgeOrder)}
                  compact
                  order={g.badgeOrder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-5 py-6 flex flex-col gap-7">
          {leagueRegion === 'johto' ? (
            <ChallengesScreen
              gameState={gameState}
              onChallenge={onChallenge}
              onClose={onClose}
              isEmbedded={true}
              filterCategories={['johto']}
              setCurrentView={setCurrentView}
              setVsInitialTab={setVsInitialTab}
              initialCategory="johto"
              setVsInitialCategory={setVsInitialCategory}
            />
          ) : (
            <>

          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] px-2">Ginásios de Kanto</p>
          {GYMS.map((gym, i) => (
            <GymCard
              key={gym.id}
              gym={gym}
              earned={hasBadge(gym.badge, gym.badgeOrder)}
              locked={gymLocked(gym)}
              onClick={setSelectedGym}
            />
          ))}

          <div className="mt-8">
            <div className="flex items-center gap-4 px-2 mb-6">
              <p id="elite4-section" className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] flex-1">Liga Pokemon</p>
              {leagueLocked && (
                <span className="bg-red-500/20 text-red-400 text-[9px] font-black px-4 py-1.5 rounded-full uppercase border border-red-500/30">
                  🔒 {badgeCount}/8 INSÍGNIAS
                </span>
              )}
            </div>

            {leagueLocked ? (
              <div className="rounded-2xl border-2 border-dashed border-white/10 p-6 text-center">
                <div className="text-4xl mb-2 opacity-30">🏛️</div>
                <p className="text-white/30 font-black uppercase text-xs italic">Derrote todos os 8 Lideres para acessar a Liga</p>
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
            </>
          )}
        </div>
      </div>

      {selectedGym && (
        <GymDetailModal 
          gym={selectedGym}
          earned={hasBadge(selectedGym.badge, selectedGym.badgeOrder) || eliteDefeated(selectedGym.id)}
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

import React, { useState } from 'react';
import { GYMS, ELITE_FOUR, TYPE_COLOR_HEX } from '../data/gyms';

const typeIconUrl = (t) =>
  t ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.toLowerCase()}.svg` : null;

const BadgeIcon = ({ src, earned }) => (
  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${earned ? 'border-yellow-400 bg-yellow-50 shadow-md shadow-yellow-200' : 'border-slate-200 bg-slate-100 grayscale opacity-40'}`}>
    <img src={src} className="w-7 h-7 object-contain" alt="badge" onError={e => e.target.style.display = 'none'} />
  </div>
);

const GymCard = ({ gym, earned, locked, onChallenge }) => {
  const col = TYPE_COLOR_HEX[gym.type] || '#555';
  const c2 = col + 'bb';

  return (
    <div
      className={`relative rounded-[1.5rem] overflow-hidden shadow-xl transition-all ${locked ? 'opacity-50' : 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer'}`}
      style={{ background: `linear-gradient(160deg, ${col} 0%, ${c2} 50%, #0d0d1a 100%)` }}
    >
      {/* Dots pattern */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />

      {/* Topo: número + status */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
        <span className="bg-black/40 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest backdrop-blur-sm">#{gym.badgeOrder}</span>
        {locked && <span className="bg-black/50 text-white/70 text-[9px] font-black px-2 py-0.5 rounded-full backdrop-blur-sm">🔒</span>}
        {earned && <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-0.5 rounded-full">✅ VENCIDO</span>}
      </div>

      {/* Tipos no canto superior direito */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 items-end">
        <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
          {gym.typeIcon && <img src={gym.typeIcon} className="w-3.5 h-3.5 invert" alt={gym.type} onError={e => e.target.style.display='none'} />}
          <span className="text-white text-[8px] font-black uppercase tracking-wide">{gym.type}</span>
        </div>
      </div>

      {/* Sprite do líder — centralizado e grande */}
      <div className="flex justify-center pt-10 pb-2 relative z-10">
        <img
          src={gym.sprite}
          alt={gym.name}
          className="w-28 h-28 object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }}
        />
      </div>

      {/* Footer com info + badge + botão */}
      <div className="bg-black/30 backdrop-blur-sm px-4 py-3 flex items-center gap-3 relative z-10">
        {/* Badge */}
        <BadgeIcon src={gym.badgeImg} earned={earned} />
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-base uppercase italic leading-none drop-shadow truncate">{gym.name}</p>
          <p className="text-white/60 text-[9px] font-bold uppercase mt-0.5 truncate">{gym.city} · Nv. {gym.team[0]?.level}–{gym.team[gym.team.length-1]?.level}</p>
        </div>
        {/* Botão */}
        <button
          disabled={locked || earned}
          onClick={() => !locked && !earned && onChallenge(gym)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all shadow-lg ${
            earned ? 'bg-green-500/30 text-green-200 cursor-default'
            : locked ? 'bg-white/10 text-white/30 cursor-not-allowed'
            : 'bg-white text-slate-900 hover:bg-yellow-300 active:scale-95'
          }`}
        >
          {earned ? '✅' : locked ? '🔒' : '⚔️ Desafiar'}
        </button>
      </div>
    </div>
  );
};

const EliteCard = ({ member, index, earned, locked, onChallenge }) => {
  const col = TYPE_COLOR_HEX[member.type] || '#333';
  return (
    <div className={`relative rounded-[1.5rem] overflow-hidden shadow-lg transition-all ${locked ? 'opacity-50' : 'hover:scale-[1.01]'}`}
      style={{ background: `linear-gradient(135deg, ${col} 0%, ${col}88 60%, #0a0a1a 100%)` }}>
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '14px 14px' }} />

      <div className="flex items-center gap-3 p-3 relative z-10">
        <div className="relative flex-shrink-0">
          <img src={member.sprite} alt={member.name} className="w-16 h-16 object-contain drop-shadow-xl" />
          {locked && <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-xl">🔒</div>}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            {member.typeIcon && <img src={member.typeIcon} className="w-4 h-4 invert" alt="" onError={e => e.target.style.display='none'} />}
            <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">{member.type}</span>
          </div>
          <p className="text-white font-black text-sm uppercase italic leading-none">{member.title}</p>
          <p className="text-white/60 text-[8px] font-bold italic mt-0.5 line-clamp-1">{member.quote}</p>
        </div>
        <button
          disabled={locked || earned}
          onClick={() => !locked && !earned && onChallenge(member)}
          className={`flex-shrink-0 px-3 py-2 rounded-xl font-black text-[9px] uppercase transition-all ${
            earned ? 'bg-green-500/30 text-green-200' 
            : locked ? 'bg-white/10 text-white/30'
            : 'bg-white text-slate-800 hover:bg-yellow-300 active:scale-95'
          }`}
        >
          {earned ? '✅' : locked ? '🔒' : '⚔️'}
        </button>
      </div>
    </div>
  );
};

const GymScreen = ({ gameState, onChallengeGym, onClose }) => {
  const badges = gameState.badges || [];
  const badgeCount = badges.length;
  const worldFlags = gameState.worldFlags || [];

  // Badgeds ganhos por ID
  const hasBadge = (badgeId) => badges.includes(badgeId);

  // Desbloqueio sequencial: gym N requer N-1 badges
  const gymLocked = (gym) => badgeCount < gym.unlockAfterBadges;

  // Liga: requer 8 badges
  const leagueLocked = badgeCount < 8;
  // Dentro da liga, desbloqueio sequencial pelos flags de vitória
  const eliteFlags = worldFlags.filter(f => f.startsWith('defeated_elite_'));
  const eliteDefeated = (id) => worldFlags.includes(`defeated_elite_${id}`);
  const eliteLocked = (idx) => {
    if (leagueLocked) return true;
    if (idx === 0) return false;
    return !worldFlags.includes(`defeated_elite_${ELITE_FOUR[idx-1].id}`);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-md bg-slate-950 rounded-t-[2rem] shadow-2xl flex flex-col animate-slideUp overflow-hidden" style={{ height: '92dvh' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/10">
          <div>
            <h2 className="text-white font-black text-xl uppercase italic tracking-tighter">🏆 Ginásios & Liga</h2>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">Kanto · {badgeCount}/8 insígnias</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white font-black text-lg w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        {/* Badge Strip */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {GYMS.map(g => (
              <BadgeIcon key={g.id} src={g.badgeImg} earned={hasBadge(g.badge)} />
            ))}
          </div>
        </div>

        {/* Scroll content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 flex flex-col gap-3">

          {/* Seção Ginásios */}
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest px-1">Ginásios de Kanto</p>
          {GYMS.map((gym, i) => (
            <GymCard
              key={gym.id}
              gym={gym}
              index={i}
              earned={hasBadge(gym.badge)}
              locked={gymLocked(gym)}
              onChallenge={onChallengeGym}
            />
          ))}

          {/* Seção Liga */}
          <div className="mt-4">
            <div className="flex items-center gap-3 px-1 mb-3">
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest flex-1">Liga Pokémon</p>
              {leagueLocked && (
                <span className="bg-red-900/50 text-red-300 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                  🔒 Requer 8 insígnias ({badgeCount}/8)
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
                    onChallenge={onChallengeGym}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default GymScreen;

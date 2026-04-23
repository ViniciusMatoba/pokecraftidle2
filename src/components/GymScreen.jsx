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
      className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all mb-4 ${locked ? 'opacity-40 grayscale-[0.5]' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}`}
      style={{ background: `linear-gradient(165deg, ${col} 0%, ${c2} 40%, #0a0a15 100%)`, minHeight: '220px' }}
      onClick={() => !locked && !earned && onChallenge(gym)}
    >
      {/* Dots pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Topo: Texto do Líder solicitado */}
      <div className="absolute top-5 left-6 z-20">
        <h4 className="text-white font-black text-lg uppercase italic leading-none tracking-tighter drop-shadow-lg">
          {gym.badgeOrder}° GYM - Líder {gym.name}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          {earned && <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">✨ INSÍGNIA CONQUISTADA</span>}
          {locked && <span className="bg-black/60 text-white/50 text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md">🔒 BLOQUEADO</span>}
        </div>
      </div>

      {/* Tipo em destaque */}
      <div className="absolute top-5 right-6 z-20 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/10">
        {gym.typeIcon && <img src={gym.typeIcon} className="w-4 h-4 invert" alt={gym.type} />}
        <span className="text-white text-[10px] font-black uppercase tracking-widest">{gym.type}</span>
      </div>

      {/* Sprite do líder — Muito maior e com sombra */}
      <div className="flex justify-end pr-4 pt-12 relative z-10 pointer-events-none">
        <img
          src={gym.sprite}
          alt={gym.name}
          className="w-44 h-44 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] scale-110 translate-y-4"
          onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }}
        />
      </div>

      {/* Footer minimalista mas elegante */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 z-20">
         <div className="flex items-center gap-4">
            <BadgeIcon src={gym.badgeImg} earned={earned} />
            <div className="flex-1">
               <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">{gym.city}</p>
               <p className="text-white text-xs font-bold uppercase italic">Time Nv. {gym.team[0]?.level}–{gym.team[gym.team.length-1]?.level}</p>
            </div>
            {!earned && !locked && (
               <div className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-xl group-hover:bg-yellow-400 transition-colors">
                  ⚔️ Desafiar
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

const EliteCard = ({ member, index, earned, locked, onChallenge }) => {
  const col = TYPE_COLOR_HEX[member.type] || '#333';
  const c2 = col + 'bb';

  return (
    <div
      className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all mb-4 ${locked ? 'opacity-40 grayscale-[0.5]' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}`}
      style={{ background: `linear-gradient(165deg, ${col} 0%, ${c2} 40%, #150a0a 100%)`, minHeight: '220px' }}
      onClick={() => !locked && !earned && onChallenge(member)}
    >
      {/* Dots pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Topo */}
      <div className="absolute top-5 left-6 z-20">
        <h4 className="text-white font-black text-lg uppercase italic leading-none tracking-tighter drop-shadow-lg">
          Elite 4 #{index + 1} - {member.name}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          {earned && <span className="bg-pokeGold text-yellow-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg">🏆 CAMPEÃO DA ELITE</span>}
          {locked && <span className="bg-black/60 text-white/50 text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md">🔒 DESAFIO BLOQUEADO</span>}
        </div>
      </div>

      {/* Tipo */}
      <div className="absolute top-5 right-6 z-20 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/10">
        {member.typeIcon && <img src={member.typeIcon} className="w-4 h-4 invert" alt={member.type} />}
        <span className="text-white text-[10px] font-black uppercase tracking-widest">{member.type}</span>
      </div>

      {/* Sprite do líder */}
      <div className="flex justify-end pr-4 pt-12 relative z-10 pointer-events-none">
        <img
          src={member.sprite}
          alt={member.name}
          className="w-44 h-44 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] scale-110 translate-y-4"
          onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }}
        />
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 z-20">
         <div className="flex items-center gap-4">
            <div className="flex-1">
               <p className="text-white/70 text-[11px] font-bold italic line-clamp-1 leading-tight pr-12">"{member.quote}"</p>
               <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-50">Membro da Elite 4</p>
            </div>
            {!earned && !locked && (
               <div className="bg-pokeGold text-yellow-950 px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-xl">
                  ⚔️ Desafiar
               </div>
            )}
         </div>
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
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 flex flex-col gap-6">

          {/* Seção Ginásios */}
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] px-2">Ginásios de Kanto</p>
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
          <div className="mt-8">
            <div className="flex items-center gap-4 px-2 mb-6">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] flex-1">Liga Pokémon</p>
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

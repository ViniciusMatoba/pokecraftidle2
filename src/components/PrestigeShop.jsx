import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  TROPHIES, SHOP_TITLES, POKEDEX_FRAMES, UI_THEMES,
  ALLIES, MINE_LEVELS, FISHING_RODS, GYM_BANNERS
} from '../data/prestige';
import {
  AVATAR_SPRITES, AVATAR_TINTS, CARD_FRAMES, CARD_BACKGROUNDS,
  isCosmeticUnlocked, canPurchaseCosmetic, hasProgressForPurchase, getTintFilter,
} from '../data/cosmetics';
import {
  GYM_SLOT_COSTS, ELITE_SLOT_COSTS, CHAMPION_SLOT_COST,
  GYM_SLOT_LEVELS, ELITE_SLOT_LEVELS, CHAMPION_LEVEL,
  REGION_GYM_TYPES,
} from '../data/myRegion';
const itemSprite = (name) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;
const trainerSprite = (name) => `https://play.pokemonshowdown.com/sprites/trainers/${name}.png`;
const FALLBACK_ITEM = itemSprite('poke-ball');
const BADGE_ICON = itemSprite('rainbow-badge');
const COIN_ICON = itemSprite('nugget');
const ACTIVE_ICON = itemSprite('premier-ball');
/* ─── Helpers visuais ─────────────────────────────────────────────────────── */
const ItemSprite = ({ src, size = 'w-12 h-12' }) => (
  <img src={src || FALLBACK_ITEM} alt="" className={`${size} object-contain drop-shadow-sm`}
    style={{ imageRendering: 'pixelated' }}
    onError={e => { if (e.currentTarget.src !== FALLBACK_ITEM) e.currentTarget.src = FALLBACK_ITEM; }} />
);
const SpriteBadge = ({ src, tone = 'red', size = 'w-10 h-10', children }) => {
  const tones = {
    red: 'from-red-500 to-orange-500 border-red-300',
    blue: 'from-sky-500 to-blue-700 border-sky-300',
    gold: 'from-amber-400 to-yellow-700 border-yellow-300',
    green: 'from-emerald-500 to-lime-700 border-emerald-300',
    violet: 'from-violet-500 to-fuchsia-700 border-violet-300',
    slate: 'from-slate-600 to-slate-950 border-slate-400',
  };
  return (
    <span className={`relative grid ${size} shrink-0 place-items-center rounded-2xl border-2 bg-gradient-to-br ${tones[tone] || tones.red} shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_10px_rgba(0,0,0,0.25)]`}>
      {src ? <ItemSprite src={src} size="w-8 h-8" /> : children}
    </span>
  );
};
const GBHPBar = ({ value, max }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor = pct > 50 ? '#78c030' : pct > 20 ? '#f8b800' : '#d82800';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[#1a1a1a] border border-[#555] overflow-hidden">
        <div className="h-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: barColor, boxShadow: `0 0 4px ${barColor}80` }} />
      </div>
      <span className="text-[9px] font-mono text-white/50">{pct}%</span>
    </div>
  );
};
const MenuCard = ({ children, owned, locked, onClick, className = '' }) => (
  <div onClick={onClick} className={`relative border-2 transition-all duration-150 cursor-pointer
    ${owned ? 'bg-[#e8f5e9] border-[#2e7d32] shadow-[inset_0_-3px_0_#1b5e20]'
    : locked ? 'bg-[#1a1a2e] border-[#333] opacity-50 cursor-not-allowed'
    : 'bg-[#f0f0f0] border-[#1a1a2e] shadow-[inset_0_-3px_0_#1a1a2e] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none'}
    ${className}`}>
    {children}
  </div>
);
const GBAButton = ({ children, onClick, disabled, variant = 'red', className = '' }) => {
  const variants = {
    red:   { bg: '#c0392b', shadow: '#7b241c' },
    blue:  { bg: '#2471a3', shadow: '#1a4f6e' },
    gold:  { bg: '#b7950b', shadow: '#7d6608' },
    green: { bg: '#1e8449', shadow: '#145a32' },
    grey:  { bg: '#626567', shadow: '#424949' },
  };
  const v = variants[variant] || variants.red;
  return (
    <button onClick={onClick} disabled={disabled}
      className={`relative px-5 py-2.5 font-mono font-bold text-[11px] uppercase tracking-widest
        border-2 border-black transition-all duration-100 text-white
        ${disabled ? 'bg-[#444] border-[#333] text-white/30 cursor-not-allowed'
          : 'hover:brightness-110 active:translate-y-[3px] active:shadow-none'}
        ${className}`}
      style={disabled ? {} : { backgroundColor: v.bg, boxShadow: `0 4px 0 ${v.shadow}, inset 0 1px 0 rgba(255,255,255,0.2)` }}>
      {children}
    </button>
  );
};
/* ─── Helpers de desbloqueio ──────────────────────────────────────────────── */
const REGION_FROM_FLAG = {
  kanto: 'Kanto', johto: 'Johto', hoenn: 'Hoenn', sinnoh: 'Sinnoh',
  unova: 'Unova', kalos: 'Kalos', alola: 'Alola', galar: 'Galar', paldea: 'Paldea', hisui: 'Hisui',
};
const getUnlockReason = (item, badges, worldFlags) => {
  const reasons = [];
  if (item.unlockFlag) {
    if (!(worldFlags || []).includes(item.unlockFlag)) {
      const parts = item.unlockFlag.split('_');
      const region = REGION_FROM_FLAG[parts[0]] || parts[0];
      reasons.push(parts[1] === 'champion' ? `Seja Campeão de ${region}` : `Inicie a região de ${region}`);
    }
  }
  if ((item.minBadges || 0) > (badges || 0)) {
    reasons.push(`Obtenha ${item.minBadges} insígnia${item.minBadges !== 1 ? 's' : ''} (possui ${badges || 0})`);
  }
  return reasons.length ? reasons.join(' e ') : 'Progresso insuficiente';
};

const BadgeTag = ({ required, current }) => {
  const ok = current >= required;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 border text-[9px] font-mono font-bold uppercase
      ${ok ? 'border-[#1e8449] bg-[#e8f5e9] text-[#1e8449]' : 'border-[#c0392b] bg-[#fde8e8] text-[#c0392b]'}`}>
      <ItemSprite src={BADGE_ICON} size="w-4 h-4" />
      {required} BADGE{required !== 1 ? 'S' : ''}
    </span>
  );
};
const StatusPill = ({ active, children }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[8px] font-mono font-black uppercase
    ${active ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'}`}>
    <ItemSprite src={active ? ACTIVE_ICON : itemSprite('friend-ball')} size="w-4 h-4" />
    {children}
  </span>
);
const PriceTag = ({ value }) => (
  <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black text-yellow-300">
    <ItemSprite src={COIN_ICON} size="w-4 h-4" />
    {Number(value || 0).toLocaleString()} C
  </span>
);
/* ─── AVATAR SUB-COMPONENTES ─────────────────────────────────────────────── */
/** Card de preview do treinador no topo da aba Avatar */
const AvatarPreviewCard = ({ sprite, tintId, frame, bg, name }) => {
  const tintFilter = getTintFilter(tintId);
  return (
    <div className={`relative rounded-none border-4 overflow-hidden bg-gradient-to-b ${bg.gradient}`}
      style={{ borderColor: frame.preview, boxShadow: `0 0 20px ${frame.preview}44, 0 0 40px ${frame.preview}22` }}>
      {/* Scanlines internas */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 3px)' }} />
      {/* Header com gradiente da moldura */}
      <div className={`relative px-4 py-3 bg-gradient-to-r ${frame.headerBg} flex items-center gap-3`}>
        {/* Brilho diagonal no header */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
        {/* Sprite do treinador */}
        <div className="relative w-16 h-16 shrink-0">
          <div className="absolute inset-0 rounded-full opacity-20"
            style={{ backgroundColor: frame.preview, filter: 'blur(8px)' }} />
          <img src={sprite.sprite} alt={sprite.name}
            className="relative w-16 h-16 object-contain z-10"
            style={{ imageRendering: 'pixelated', filter: tintFilter !== 'none' ? tintFilter : undefined }}
            onError={e => { if (e.target.src !== 'https://play.pokemonshowdown.com/sprites/trainers/red.png') e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'; }} />
        </div>
        {/* Info */}
        <div className="flex-1">
          <p className="text-[8px] text-white/40 font-mono uppercase tracking-[0.3em]">TREINADOR</p>
          <p className="text-base font-black text-white uppercase leading-tight drop-shadow">{sprite.name}</p>
          <p className="text-[9px] text-white/50 font-mono mt-0.5">{sprite.region?.toUpperCase()} · {frame.name}</p>
        </div>
        {/* Região badge */}
        <div className="shrink-0 px-2 py-1 border border-white/20 bg-black/30">
          <p className="text-[8px] font-mono text-white/60 uppercase">{bg.name}</p>
        </div>
      </div>
      {/* Footer decorativo */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex gap-1">
          {[frame.preview, frame.preview + '88', frame.preview + '44'].map((c, i) => (
            <div key={i} className="w-2 h-2 border border-white/10" style={{ backgroundColor: c }} />
          ))}
        </div>
        <p className="text-[7px] font-mono text-white/20 uppercase tracking-widest">CARTÃO DE TREINADOR</p>
        <div className="flex gap-1">
          {[frame.preview + '44', frame.preview + '88', frame.preview].map((c, i) => (
            <div key={i} className="w-2 h-2 border border-white/10" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
};
/** Grid de sprites com agrupamento por região */
const SpritesGrid = ({ appearance, worldFlags, pSprites, totalBadges, currency, onEquip, onBuySprite, onLockedClick }) => {
  const REGION_ORDER_LIST = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea', 'special'];
  const REGION_LABELS = {
    kanto: '🔴 Kanto', johto: '🥇 Johto', hoenn: '🌊 Hoenn', sinnoh: '⛰ Sinnoh',
    unova: '⚫ Unova', kalos: '🗼 Kalos', alola: '🌺 Alola', galar: '⚔️ Galar',
    paldea: '🍊 Paldea', special: '⭐ Especiais',
  };
  const grouped = {};
  Object.values(AVATAR_SPRITES).forEach(s => {
    if (!grouped[s.region]) grouped[s.region] = [];
    grouped[s.region].push(s);
  });

  return (
    <div className="flex flex-col gap-5">
      {REGION_ORDER_LIST.map(region => {
        const items = grouped[region];
        if (!items?.length) return null;
        return (
          <div key={region}>
            {/* Cabeçalho da região */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1 bg-[#333]" />
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest px-2">
                {REGION_LABELS[region]}
              </span>
              <div className="h-px flex-1 bg-[#333]" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {items.map(item => {
                const isOwned      = isCosmeticUnlocked(item, worldFlags, pSprites, totalBadges);
                const progressMet  = hasProgressForPurchase(item, worldFlags, totalBadges);
                const canAfford    = currency >= (item.cost || 0);
                const isPaid       = item.cost > 0;
                const isEquipped   = appearance.spriteId === item.id;
                const isLocked     = !isOwned && !progressMet;
                const canBuyNow    = !isOwned && progressMet && isPaid && canAfford;
                const progressOnly = !isOwned && progressMet && isPaid && !canAfford;

                // Estilos do card por estado
                let cardBorder, cardBg, cardOpacity, cardShadow, cardCursor;
                if (isEquipped)      { cardBorder = '#fbbf24'; cardBg = '#1c1500'; cardShadow = '0 0 16px #fbbf2455'; cardOpacity = 1; cardCursor = 'default'; }
                else if (isOwned)    { cardBorder = '#22c55e'; cardBg = '#071208'; cardShadow = '0 0 8px #22c55e22'; cardOpacity = 1; cardCursor = 'pointer'; }
                else if (canBuyNow)  { cardBorder = '#3b82f6'; cardBg = '#080f1c'; cardShadow = '0 0 10px #3b82f622'; cardOpacity = 1; cardCursor = 'pointer'; }
                else if (progressOnly){ cardBorder = '#1e3a5f'; cardBg = '#060c16'; cardShadow = 'none'; cardOpacity = 0.8; cardCursor = 'default'; }
                else                 { cardBorder = '#222'; cardBg = '#0d0d0d'; cardShadow = 'none'; cardOpacity = 0.45; cardCursor = 'not-allowed'; }

                const handleClick = () => {
                  if (isEquipped) return;
                  if (isLocked)  { onLockedClick && onLockedClick(item); return; }
                  if (isOwned)   { onEquip('sprite', item.id); return; }
                  if (canBuyNow) { onBuySprite(item); return; }
                };

                return (
                  <div key={item.id}
                    onClick={handleClick}
                    style={{ border: `2px solid ${cardBorder}`, background: cardBg, boxShadow: cardShadow, opacity: cardOpacity, cursor: cardCursor }}
                    className="relative flex flex-col items-center gap-1.5 p-2.5 transition-all duration-150 select-none active:scale-95">

                    {/* Badge de estado no canto */}
                    {isEquipped && <div className="absolute top-1 right-1 text-[9px] text-yellow-400 font-black">★</div>}
                    {isOwned && !isEquipped && <div className="absolute top-1 right-1 text-[8px] text-emerald-400 font-black">✓</div>}
                    {canBuyNow && <div className="absolute top-1 right-1 text-[8px] text-blue-400 font-black">🛒</div>}

                    {/* Sprite */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      {isLocked ? (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center text-lg opacity-40">🔒</div>
                          <img src={item.sprite} alt=""
                            className="w-14 h-14 object-contain opacity-15"
                            style={{ imageRendering: 'pixelated', filter: 'grayscale(1)' }}
                            onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'; }} />
                        </>
                      ) : (
                        <img src={item.sprite} alt={item.name}
                          className={`w-14 h-14 object-contain transition-all ${canBuyNow ? 'hover:scale-110' : ''} ${!isOwned && !isEquipped ? 'opacity-70' : ''}`}
                          style={{ imageRendering: 'pixelated' }}
                          onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'; }} />
                      )}
                    </div>

                    {/* Nome */}
                    <p className={`text-[9px] font-mono uppercase text-center leading-none font-bold
                      ${isEquipped ? 'text-yellow-300' : isOwned ? 'text-emerald-300' : canBuyNow ? 'text-blue-300' : isLocked ? 'text-white/20' : 'text-white/40'}`}>
                      {item.name}
                    </p>

                    {/* Status tag */}
                    {isEquipped && (
                      <span className="text-[7px] font-mono text-yellow-400 uppercase border border-yellow-600/50 px-1.5 py-0.5 bg-yellow-900/20">
                        ★ EQUIPADO
                      </span>
                    )}
                    {isOwned && !isEquipped && (
                      <span className="text-[7px] font-mono text-emerald-400 uppercase border border-emerald-700/50 px-1.5 py-0.5 bg-emerald-900/20">
                        Equipar →
                      </span>
                    )}
                    {canBuyNow && (
                      <span className="text-[8px] font-mono font-bold text-yellow-300 border border-blue-600/50 px-1.5 py-0.5 bg-blue-900/20">
                        {item.cost.toLocaleString()} C
                      </span>
                    )}
                    {progressOnly && (
                      <span className="text-[7px] font-mono text-red-400/80 border border-red-800/40 px-1.5 py-0.5">
                        {item.cost.toLocaleString()} C
                      </span>
                    )}
                    {isLocked && (
                      <span className="text-[7px] font-mono text-purple-400/60 text-center leading-tight px-1">
                        🏆 Progresso
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
/** Grid de tints com preview ao vivo */
const TintsGrid = ({ appearance, worldFlags, pTints, totalBadges, currency, currentSprite, onEquip, onBuy, onLockedClick }) => (
  <div className="grid grid-cols-3 gap-2">
    {Object.values(AVATAR_TINTS).map(item => {
      const unlocked = isCosmeticUnlocked(item, worldFlags, pTints, totalBadges);
      const canBuy = canPurchaseCosmetic(item, worldFlags, pTints, totalBadges, currency);
      const isEquipped = appearance.tintId === item.id;
      const isLocked = !unlocked;
      const tintFilter = getTintFilter(item.id);
      return (
        <div key={item.id}
          onClick={() => {
            if (isEquipped) return;
            if (isLocked)  { onLockedClick && onLockedClick(item); return; }
            if (unlocked) onEquip('tint', item.id);
            else if (canBuy) onBuy('tint', item);
          }}
          className={`relative flex flex-col items-center gap-2 p-3 border-2 cursor-pointer transition-all duration-150 select-none
            ${isEquipped
              ? 'border-[#fbbf24] bg-[#1c1500]'
              : isLocked
              ? 'border-[#2a2a2a] bg-[#0d0d0d] opacity-55'
              : 'border-[#2a2a2a] bg-[#111] hover:border-[#555] active:scale-95'
            }`}
          style={isEquipped ? { boxShadow: '0 0 10px #fbbf2433' } : {}}>
          {isEquipped && <div className="absolute top-1 right-1 text-[8px] text-yellow-400 font-black">★</div>}
          {/* Preview sprite com o tint */}
          <div className="relative">
            <img src={currentSprite?.sprite}
              className="w-12 h-12 object-contain"
              style={{ imageRendering: 'pixelated', filter: tintFilter !== 'none' ? tintFilter : undefined }}
              onError={e => { if (e.target.src !== 'https://play.pokemonshowdown.com/sprites/trainers/red.png') e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'; }}
              alt="" />
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center text-base bg-black/60">🔒</div>
            )}
          </div>
          {/* Barra de cor */}
          <div className="w-full h-1.5 border border-white/10"
            style={{ backgroundColor: item.preview }} />
          <p className={`text-[9px] font-mono uppercase text-center leading-none
            ${isEquipped ? 'text-yellow-300 font-black' : isLocked ? 'text-white/25' : 'text-white/60'}`}>
            {item.name}
          </p>
          {isEquipped && <span className="text-[7px] font-mono text-yellow-400 border border-yellow-600/40 px-1.5 py-0.5">ATIVO</span>}
          {!isEquipped && unlocked && <span className="text-[7px] font-mono text-emerald-400">Equipar</span>}
          {isLocked && <span className={`text-[8px] font-mono font-bold ${canBuy ? 'text-yellow-300' : 'text-white/25'}`}>{item.cost.toLocaleString()} C</span>}
        </div>
      );
    })}
  </div>
);
/** Grid de molduras */
const FramesGrid = ({ appearance, worldFlags, pFrames, totalBadges, currency, onEquip, onBuy, onLockedClick }) => (
  <div className="grid grid-cols-2 gap-3">
    {Object.values(CARD_FRAMES).map(item => {
      const unlocked = isCosmeticUnlocked(item, worldFlags, pFrames, totalBadges);
      const canBuy = canPurchaseCosmetic(item, worldFlags, pFrames, totalBadges, currency);
      const isEquipped = appearance.frameId === item.id;
      const isLocked = !unlocked;
      return (
        <div key={item.id}
          onClick={() => {
            if (isEquipped) return;
            if (isLocked)  { onLockedClick && onLockedClick(item); return; }
            if (unlocked) onEquip('frame', item.id);
            else if (canBuy) onBuy('frame', item);
          }}
          className={`relative flex flex-col gap-2 p-3 border-2 cursor-pointer transition-all select-none overflow-hidden
            ${isEquipped
              ? 'bg-[#0d0d1a]'
              : isLocked
              ? 'border-[#2a2a2a] bg-[#0a0a0a] opacity-55'
              : 'border-[#2a2a2a] bg-[#111] hover:border-[#555] active:scale-[0.98]'
            }`}
          style={{
            borderColor: isEquipped ? item.preview : undefined,
            boxShadow: isEquipped ? `0 0 16px ${item.preview}44, inset 0 0 30px ${item.preview}11` : undefined,
          }}>
          {/* Preview da moldura — mini card decorativo */}
          <div className={`relative w-full h-12 border-2 overflow-hidden bg-gradient-to-r ${item.headerBg}`}
            style={{ borderColor: item.preview }}>
            {/* Padrão de scanlines */}
            <div className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 3px)' }} />
            {/* Glow da cor */}
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: item.preview }} />
            {/* Pontinhos coloridos decorativos */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5">
              {[item.preview, item.preview + 'aa', item.preview + '55'].map((c, i) => (
                <div key={i} className="w-1.5 h-1.5" style={{ backgroundColor: c }} />
              ))}
            </div>
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl">🔒</div>
            )}
            {isEquipped && (
              <div className="absolute top-1 right-1 text-yellow-400 text-xs font-black">★</div>
            )}
          </div>
          <div>
            <p className={`text-[10px] font-mono uppercase font-bold
              ${isEquipped ? 'text-yellow-300' : isLocked ? 'text-white/25' : 'text-white/80'}`}>
              {item.name}
            </p>
            {item.description && (
              <p className="text-[8px] text-white/25 font-mono leading-tight mt-0.5">{item.description}</p>
            )}
          </div>
          <div>
            {isEquipped && <span className="text-[8px] font-mono text-yellow-400 border border-yellow-600/40 px-2 py-0.5">★ ATIVA</span>}
            {!isEquipped && unlocked && <span className="text-[8px] font-mono text-emerald-400">Equipar</span>}
            {isLocked && item.unlockFlag && <span className="text-[8px] font-mono text-purple-400">🏆 Vencer região</span>}
            {isLocked && !item.unlockFlag && <span className={`text-[9px] font-mono font-bold ${canBuy ? 'text-yellow-300' : 'text-white/25'}`}>{item.cost?.toLocaleString()} C</span>}
          </div>
        </div>
      );
    })}
  </div>
);
/** Grid de fundos */
const BgsGrid = ({ appearance, worldFlags, pBgs, totalBadges, currency, onEquip, onBuy, onLockedClick }) => (
  <div className="grid grid-cols-2 gap-3">
    {Object.values(CARD_BACKGROUNDS).map(item => {
      const unlocked = isCosmeticUnlocked(item, worldFlags, pBgs, totalBadges);
      const canBuy = canPurchaseCosmetic(item, worldFlags, pBgs, totalBadges, currency);
      const isEquipped = appearance.bgId === item.id;
      const isLocked = !unlocked;
      return (
        <div key={item.id}
          onClick={() => {
            if (isEquipped) return;
            if (isLocked)  { onLockedClick && onLockedClick(item); return; }
            if (unlocked) onEquip('bg', item.id);
            else if (canBuy) onBuy('bg', item);
          }}
          className={`relative flex flex-col gap-2 p-3 border-2 cursor-pointer transition-all select-none overflow-hidden
            ${isEquipped
              ? 'border-[#fbbf24]'
              : isLocked
              ? 'border-[#2a2a2a] opacity-55'
              : 'border-[#2a2a2a] hover:border-[#555] active:scale-[0.98]'
            }`}
          style={isEquipped ? { boxShadow: '0 0 14px #fbbf2433' } : {}}>
          {/* Preview do gradiente — altura maior para sentir o ambiente */}
          <div className={`relative w-full h-14 rounded-none bg-gradient-to-br overflow-hidden ${item.gradient}`}>
            {/* Estrelinhas aleatórias para dar vida */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '14px 14px' }} />
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl">🔒</div>
            )}
            {isEquipped && (
              <div className="absolute top-1 right-1 text-yellow-400 font-black text-xs">★</div>
            )}
          </div>
          <div>
            <p className={`text-[10px] font-mono uppercase font-bold
              ${isEquipped ? 'text-yellow-300' : isLocked ? 'text-white/25' : 'text-white/80'}`}>
              {item.name}
            </p>
            {item.description && (
              <p className="text-[8px] text-white/25 font-mono leading-tight mt-0.5">{item.description}</p>
            )}
          </div>
          <div>
            {isEquipped && <span className="text-[8px] font-mono text-yellow-400 border border-yellow-600/40 px-2 py-0.5">★ ATIVO</span>}
            {!isEquipped && unlocked && <span className="text-[8px] font-mono text-emerald-400">Equipar</span>}
            {isLocked && item.unlockFlag && <span className="text-[8px] font-mono text-purple-400">🏆 Vencer região</span>}
            {isLocked && !item.unlockFlag && <span className={`text-[9px] font-mono font-bold ${canBuy ? 'text-yellow-300' : 'text-white/25'}`}>{item.cost?.toLocaleString()} C</span>}
          </div>
        </div>
      );
    })}
  </div>
);
/* ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────── */
const PrestigeShop = ({ gameState, setGameState, addLog, getBadgeCount, onHireAlly, onBack, onOpenRegionBuilder }) => {
  // ── State — TODOS os hooks aqui no topo, fora de qualquer condicional ──────
  const [activeTab,       setActiveTab]       = useState('avatar');
  const [avatarSub,       setAvatarSub]       = useState('sprites');
  const [equipPrompt,     setEquipPrompt]     = useState(null); // sprite recém-comprado aguardando decisão de equipar
  const [confirmPurchase, setConfirmPurchase] = useState(null); // { label, cost, onConfirm }
  const [lockedInfo,      setLockedInfo]      = useState(null); // { name, reason }

  const requestPurchase = (label, cost, onConfirm) => setConfirmPurchase({ label, cost, onConfirm });
  const requestLockedInfo = (itemName, reason) => setLockedInfo({ name: itemName, reason });
  const badges   = getBadgeCount(gameState);
  const currency = gameState.currency || 0;
  const prestige = gameState.prestige || {};
  // Avatar
  const worldFlags = gameState.worldFlags || [];
  const appearance = gameState.appearance || {};
  const pSprites   = appearance.purchasedSprites || [];
  const pTints     = appearance.purchasedTints   || [];
  const pFrames    = appearance.purchasedFrames  || [];
  const pBgs       = appearance.purchasedBgs     || [];
  const currentSprite = AVATAR_SPRITES[appearance.spriteId] || AVATAR_SPRITES.red;
  const currentTint   = AVATAR_TINTS[appearance.tintId]     || AVATAR_TINTS.none;
  const currentFrame  = CARD_FRAMES[appearance.frameId]     || CARD_FRAMES.default;
  const currentBg     = CARD_BACKGROUNDS[appearance.bgId]   || CARD_BACKGROUNDS.slate;
  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleBuy = (type, item) => {
    if (currency < item.cost) return;
    if (badges < (item.minBadges || 0)) return;
    setGameState(prev => {
      const newState = { ...prev, currency: prev.currency - item.cost };
      if (type === 'trophy')  newState.prestige = { ...prev.prestige, trophies: [...(prev.prestige?.trophies || []), item.id] };
      if (type === 'title')   {
        const alreadyPurchased = (prev.prestige?.purchasedTitles || []).includes(item.id);
        newState.prestige = { 
          ...prev.prestige, 
          activeTitle: item.id,
          purchasedTitles: alreadyPurchased 
            ? (prev.prestige?.purchasedTitles || []) 
            : [...(prev.prestige?.purchasedTitles || []), item.id]
        };
        newState.trainer = {
          ...(prev.trainer || {}),
          titleId: item.id,
        };
        // If already purchased, don't subtract currency
        if (alreadyPurchased) newState.currency = prev.currency;
      }
      if (type === 'frame')   newState.prestige = { ...prev.prestige, pokedexFrame: item.id };
      if (type === 'theme')   newState.prestige = { ...prev.prestige, uiTheme: item.id };
      if (type === 'rod')     newState.fishing  = { ...prev.fishing,  rod: item.id };
      if (type === 'banner')  newState.gymCustom = { ...prev.gymCustom, bannerId: item.id };
      addLog(`✅ ${item.name} adquirido!`, 'system');
      return newState;
    });
  };
  const handleMineUpgrade = () => {
    const currentLevel = gameState.mine?.level || 0;
    const nextLevel = currentLevel + 1;
    const config = MINE_LEVELS[nextLevel];
    if (!config) return;
    const cost = currentLevel === 0 ? config.unlockCost : config.upgradeCost;
    if (currency < cost || badges < (config.minBadges || 0)) return;
    setGameState(prev => ({
      ...prev,
      currency: prev.currency - cost,
      mine: { ...prev.mine, unlocked: true, level: nextLevel, lastCollected: prev.mine?.lastCollected || Date.now() }
    }));
    addLog(`⛏️ Mina ${currentLevel === 0 ? 'desbloqueada' : 'aprimorada'} para Nível ${nextLevel}!`, 'system');
  };
  const handleBuyCosmetic = (category, item) => {
    if (currency < item.cost) return;
    if ((item.minBadges || 0) > badges) return;
    setGameState(prev => {
      const app = prev.appearance || {};
      let update = { currency: prev.currency - item.cost };
      if (category === 'sprite') update.appearance = { ...app, purchasedSprites: [...(app.purchasedSprites || []), item.id] };
      if (category === 'tint')   update.appearance = { ...app, purchasedTints:   [...(app.purchasedTints   || []), item.id] };
      if (category === 'frame')  update.appearance = { ...app, purchasedFrames:  [...(app.purchasedFrames  || []), item.id] };
      if (category === 'bg')     update.appearance = { ...app, purchasedBgs:     [...(app.purchasedBgs     || []), item.id] };
      addLog(`✅ ${item.name} desbloqueado!`, 'system');
      return { ...prev, ...update };
    });
  };
  const handleEquipCosmetic = (category, id) => {
    setGameState(prev => {
      const app = prev.appearance || {};
      const field = { sprite: 'spriteId', tint: 'tintId', frame: 'frameId', bg: 'bgId' }[category];
      return { ...prev, appearance: { ...app, [field]: id } };
    });
  };
  // Compra sprite (executa sem confirmação — confirmação é feita antes via requestPurchase)
  const handleBuySpriteWithPrompt = (item) => {
    if (currency < item.cost) return;
    setGameState(prev => {
      const app = prev.appearance || {};
      return {
        ...prev,
        currency: prev.currency - item.cost,
        appearance: { ...app, purchasedSprites: [...(app.purchasedSprites || []), item.id] },
      };
    });
    addLog(`✅ ${item.name} desbloqueado!`, 'system');
    setEquipPrompt(item);
  };
  // Versão com confirmação prévia
  const requestBuySpriteWithPrompt = (item) => requestPurchase(item.name, item.cost, () => handleBuySpriteWithPrompt(item));
  // ── Tabs ─────────────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'avatar',    label: 'Avatar',   caption: 'Treinador', icon: trainerSprite('red'), tone: 'red' },
    { id: 'trophies',  label: 'Trofeus',  caption: 'Conquistas', icon: itemSprite('star-piece'), tone: 'gold' },
    { id: 'titles',    label: 'Titulos',  caption: 'Identidade', icon: itemSprite('blue-card'), tone: 'blue' },
    { id: 'cosmetics', label: 'Visual',   caption: 'Cartao',     icon: itemSprite('prism-scale'), tone: 'violet' },
    { id: 'allies',    label: 'Aliados',  caption: 'Suporte',    icon: trainerSprite('youngster'), tone: 'green' },
    { id: 'mine',      label: 'Mina',     caption: 'Drops',      icon: itemSprite('hard-stone'), tone: 'slate' },
    { id: 'fishing',   label: 'Pesca',    caption: 'Rotas',      icon: itemSprite('super-rod'), tone: 'blue' },
    { id: 'gym',       label: 'Ginasio',  caption: 'Estandarte', icon: itemSprite('vs-seeker'), tone: 'red' },
    { id: 'liga',      label: 'Liga',     caption: 'Minha Regiao', icon: itemSprite('badge'), tone: 'gold' },
  ];
  const avatarSubTabs = [
    { id: 'sprites', label: 'Sprite',  icon: trainerSprite('red') },
    { id: 'tints',   label: 'Cores',   icon: itemSprite('fire-stone') },
    { id: 'frames',  label: 'Moldura', icon: itemSprite('trainer-card') },
    { id: 'bgs',     label: 'Fundo',   icon: itemSprite('town-map') },
  ];
  return (
    <div className="absolute inset-x-0 bottom-0 z-[2000] flex flex-col overflow-hidden font-mono"
      style={{ background: 'linear-gradient(160deg,#0d1117 0%,#161b22 50%,#0d1117 100%)', top: '56px' }}>
      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 4px)' }} />
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 shrink-0 border-b-4 border-[#c0392b]"
        style={{ background: 'linear-gradient(90deg,#c0392b 0%,#e74c3c 50%,#c0392b 100%)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack}
            className="flex items-center gap-2 bg-black/30 border border-white/20 px-3 py-2 text-white font-mono text-[11px] uppercase tracking-widest hover:bg-black/50 active:translate-y-[1px] transition-all">
            <ItemSprite src={itemSprite('escape-rope')} size="w-4 h-4" /> SAIR
          </button>
          <div className="text-center">
            <p className="text-[8px] text-white/60 uppercase tracking-[0.4em] font-mono">PRESTIGE SHOP</p>
            <h2 className="text-lg font-black uppercase tracking-tighter text-white leading-none drop-shadow-lg">
              LOJA DE PRESTIGIO
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-black/40 border border-white/20 px-3 py-2">
            <ItemSprite src={COIN_ICON} size="w-5 h-5" />
            <div className="text-right">
              <p className="text-[8px] text-white/50 uppercase">Coins</p>
              <p className="text-sm font-black text-yellow-300 tabular-nums">{currency.toLocaleString()}</p>
            </div>
          </div>
        </div>
        {/* Barra de badges */}
        <div className="flex items-center gap-3 px-4 pb-2">
          <span className="inline-flex items-center gap-1 text-[9px] text-white/50 uppercase tracking-widest"><ItemSprite src={BADGE_ICON} size="w-4 h-4" /> Badges:</span>
          <div className="flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}
                className={`w-4 h-4 border ${i < badges ? 'bg-yellow-400 border-yellow-600' : 'bg-black/40 border-white/20'}`}
                style={{ clipPath: 'polygon(50% 0%,100% 38%,82% 100%,18% 100%,0% 38%)' }}
              />
            ))}
          </div>
          <span className="text-[9px] text-white/40 font-mono">{badges}/8</span>
        </div>
      </div>
      {/* ── TABS ────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 shrink-0 flex overflow-x-auto scrollbar-hide border-b-2 border-black/40 shadow-lg"
        style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)' }}>
        {/* Indicador de rolagem (opcional, sombra sutil) */}
        <div className="grid min-w-full grid-cols-4 gap-2 px-3 py-3 sm:grid-cols-9">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative flex min-h-[76px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 px-2 py-2 transition-all duration-200
                  ${isActive 
                    ? 'border-white/30 bg-[#c0392b] text-white translate-y-[-2px] shadow-[0_4px_0_#7b241c]' 
                    : 'border-white/10 bg-black/40 text-white/45 hover:bg-black/60 hover:text-white/75 active:translate-y-[2px] active:shadow-none'}`}>
                <div className={`absolute inset-x-0 top-0 h-1 ${isActive ? 'bg-yellow-300' : 'bg-white/10'}`} />
                
                {/* Icone Pixel Art */}
                <SpriteBadge src={tab.icon} tone={tab.tone} size="w-10 h-10" />
                <span className="mt-1 text-[9px] font-black uppercase tracking-tighter text-center leading-none">
                  {tab.label}
                </span>
                <span className="mt-0.5 text-[7px] font-bold uppercase tracking-widest text-white/35">{tab.caption}</span>
                {isActive && (
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_8px_#facc15] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* ── CONTENT AREA ────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 pb-10">
        {/* ══════════════════════════════════════════════════════════════════
            AVATAR — sem IIFE, usa avatarSub do estado do componente
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'avatar' && (
          <div className="flex flex-col gap-4">
            {/* Preview card ao vivo */}
            <AvatarPreviewCard
              sprite={currentSprite}
              tintId={appearance.tintId || 'none'}
              frame={currentFrame}
              bg={currentBg}
            />
            {/* Sub-tabs */}
            <div className="flex gap-2 p-1 bg-black/40 border border-white/10 rounded-lg">
              {avatarSubTabs.map(st => {
                const isActive = avatarSub === st.id;
                return (
                  <button key={st.id} onClick={() => setAvatarSub(st.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-all
                      ${isActive
                        ? 'bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] border border-white/20'
                        : 'text-white/40 hover:bg-white/5 hover:text-white/60 border border-transparent'}`}>
                    <img src={st.icon} alt="" 
                      className={`w-6 h-6 object-contain ${isActive ? '' : 'grayscale opacity-50'}`} 
                      style={{ imageRendering: 'pixelated' }}
                      onError={e => { if (e.currentTarget.src !== FALLBACK_ITEM) e.currentTarget.src = FALLBACK_ITEM; }} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">{st.label}</span>
                  </button>
                );
              })}
            </div>
            {/* Conteúdo de cada sub-tab */}
            {avatarSub === 'sprites' && (
              <SpritesGrid
                appearance={appearance} worldFlags={worldFlags} pSprites={pSprites}
                totalBadges={badges} currency={currency}
                onEquip={handleEquipCosmetic}
                onBuySprite={requestBuySpriteWithPrompt}
                onLockedClick={item => requestLockedInfo(item.name, getUnlockReason(item, badges, worldFlags))}
              />
            )}
            {avatarSub === 'tints' && (
              <TintsGrid
                appearance={appearance} worldFlags={worldFlags} pTints={pTints}
                totalBadges={badges} currency={currency} currentSprite={currentSprite}
                onEquip={handleEquipCosmetic}
                onBuy={(cat, item) => requestPurchase(item.name, item.cost, () => handleBuyCosmetic(cat, item))}
                onLockedClick={item => requestLockedInfo(item.name, getUnlockReason(item, badges, worldFlags))}
              />
            )}
            {avatarSub === 'frames' && (
              <FramesGrid
                appearance={appearance} worldFlags={worldFlags} pFrames={pFrames}
                totalBadges={badges} currency={currency}
                onEquip={handleEquipCosmetic}
                onBuy={(cat, item) => requestPurchase(item.name, item.cost, () => handleBuyCosmetic(cat, item))}
                onLockedClick={item => requestLockedInfo(item.name, getUnlockReason(item, badges, worldFlags))}
              />
            )}
            {avatarSub === 'bgs' && (
              <BgsGrid
                appearance={appearance} worldFlags={worldFlags} pBgs={pBgs}
                totalBadges={badges} currency={currency}
                onEquip={handleEquipCosmetic}
                onBuy={(cat, item) => requestPurchase(item.name, item.cost, () => handleBuyCosmetic(cat, item))}
                onLockedClick={item => requestLockedInfo(item.name, getUnlockReason(item, badges, worldFlags))}
              />
            )}
          </div>
        )}
        {/* ── TROFÉUS ─────────────────────────────────────────────────────── */}
        {activeTab === 'trophies' && (
          <div className="flex flex-col gap-3">
            {Object.values(TROPHIES).map(item => {
              const isOwned   = prestige.trophies?.includes(item.id);
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);
              const isLocked  = !hasBadges && !isOwned;
              return (
                <MenuCard key={item.id} owned={isOwned} locked={isLocked}
                  onClick={isLocked ? () => requestLockedInfo(item.name, `Obtenha ${item.minBadges} insígnia${item.minBadges !== 1 ? 's' : ''} (possui ${badges})`) : undefined}>
                  <div className="flex items-center gap-4 p-4">
                    <div className={`w-16 h-16 flex items-center justify-center border-2 shrink-0
                      ${isOwned ? 'border-[#2e7d32] bg-[#e8f5e9]' : 'border-[#444] bg-[#111]'}`}>
                      <ItemSprite src={item.sprite} size="w-12 h-12" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-black uppercase leading-none ${isOwned ? 'text-[#1b5e20]' : 'text-white'}`}>
                          {item.name}
                        </h4>
                        {isOwned && <span className="text-[9px] bg-[#2e7d32] text-white px-2 py-0.5 font-mono uppercase">OBTIDO</span>}
                      </div>
                      <p className="text-[10px] text-white/40 mt-1 italic leading-tight">{item.description}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <BadgeTag required={item.minBadges || 0} current={badges} />
                        {!isOwned && <PriceTag value={item.cost} />}
                      </div>
                    </div>
                    {!isOwned && (
                      <GBAButton variant={canAfford && hasBadges ? 'red' : 'grey'}
                        disabled={!canAfford || !hasBadges}
                        onClick={e => { e.stopPropagation(); requestPurchase(item.name, item.cost, () => handleBuy('trophy', item)); }}>
                        COMPRAR
                      </GBAButton>
                    )}
                  </div>
                </MenuCard>
              );
            })}
          </div>
        )}
        {/* ── TÍTULOS ─────────────────────────────────────────────────────── */}
        {activeTab === 'titles' && (
          <div className="flex flex-col gap-2">
            <p className="text-[9px] text-white/30 uppercase font-mono tracking-widest mb-2 border-b border-[#333] pb-2">
              ▶ Selecione seu título de treinador
            </p>
            {Object.values(SHOP_TITLES).map(item => {
              const isActive  = prestige.activeTitle === item.id;
              const isOwned   = (prestige.purchasedTitles || []).includes(item.id);
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);
              const isLocked  = !isOwned && !hasBadges;
              const canInteract = isOwned || (canAfford && hasBadges);

              return (
                <div key={item.id}
                  onClick={() => {
                    if (isLocked) { requestLockedInfo(item.label || item.name, `Obtenha ${item.minBadges} insígnia${item.minBadges !== 1 ? 's' : ''} (possui ${badges})`); return; }
                    if (isOwned) { handleBuy('title', item); return; }
                    if (canInteract) requestPurchase(item.label || item.name, item.cost, () => handleBuy('title', item));
                  }}
                  className={`flex items-center gap-4 px-4 py-3 border-2 cursor-pointer transition-all
                    ${isActive
                      ? 'bg-[#1a237e] border-[#3949ab] text-white shadow-[0_0_12px_rgba(57,73,171,0.5)]'
                      : isOwned 
                      ? 'bg-[#0a0a0a] border-[#2e7d32] text-white/80 hover:border-[#2e7d32]/70'
                      : 'bg-[#111] border-[#333] text-white/60 hover:border-[#555] hover:text-white/80'}`}>
                  <div className={`w-4 h-4 border-2 shrink-0 flex items-center justify-center
                    ${isActive ? 'border-white bg-white' : isOwned ? 'border-[#2e7d32] bg-[#2e7d32]/20' : 'border-[#555]'}`}>
                    {isActive && <div className="w-2 h-2 bg-[#1a237e]" />}
                  </div>
                  <ItemSprite src={item.sprite} size="w-8 h-8" />
                  <span className={`flex-1 text-sm font-black uppercase ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  <div className="text-right shrink-0">
                    {!isOwned && <BadgeTag required={item.minBadges || 0} current={badges} />}
                    {!isOwned && !isActive && <p className="text-[10px] font-mono text-yellow-400 mt-1">{item.cost.toLocaleString()} C</p>}
                    {isActive  && <StatusPill active>ATIVO</StatusPill>}
                    {isOwned && !isActive && <span className="text-[9px] text-[#2e7d32] font-mono font-bold">ADQUIRIDO</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* ── VISUAL (Frames + Themes) ─────────────────────────────────────── */}
        {activeTab === 'cosmetics' && (
          <div className="flex flex-col gap-6">
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-0.5 w-4 bg-[#c0392b]" />
                <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest">Molduras da Pokédex</p>
                <div className="flex-1 h-0.5 bg-[#333]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(POKEDEX_FRAMES).map(item => {
                  const isActive  = prestige.pokedexFrame === item.id;
                  const canAfford = currency >= item.cost;
                  return (
                    <div key={item.id}
                      onClick={() => { if (!isActive) requestPurchase(item.name, item.cost, () => handleBuy('frame', item)); }}
                      className={`border-2 p-3 cursor-pointer transition-all
                        ${isActive ? 'border-[#fbbf24] bg-[#1a1500]' : 'border-[#333] bg-[#111] hover:border-[#555]'}`}
                      style={isActive ? { borderColor: item.borderColor } : {}}>
                      <div className="w-full aspect-square border-4 mb-2 flex items-center justify-center relative"
                        style={{ borderColor: item.borderColor, backgroundColor: item.headerColor + '33' }}>
                        <div className="w-1/2 h-1/2 rounded-full opacity-30" style={{ backgroundColor: item.headerColor }} />
                        <ItemSprite src={itemSprite('trainer-card')} size="w-10 h-10" />
                      {isActive && (
                          <div className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[8px]"
                            style={{ backgroundColor: item.borderColor }}>✓</div>
                        )}
                      </div>
                      <p className="text-[10px] font-mono uppercase text-center text-white/70">{item.name}</p>
                      <p className="text-[9px] font-mono text-center mt-0.5"
                        style={{ color: isActive ? item.borderColor : '#fbbf24' }}>
                        {isActive ? 'EQUIPADA' : `${item.cost.toLocaleString()} C`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-0.5 w-4 bg-[#2471a3]" />
                <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest">Esquemas de Cor</p>
                <div className="flex-1 h-0.5 bg-[#333]" />
              </div>
              <div className="flex flex-col gap-2">
                {Object.values(UI_THEMES).map(item => {
                  const isActive = prestige.uiTheme === item.id;
                  return (
                    <div key={item.id}
                      onClick={() => { if (!isActive) requestPurchase(item.name, item.cost, () => handleBuy('theme', item)); }}
                      className={`flex items-center gap-4 border-2 p-3 cursor-pointer transition-all
                        ${isActive ? 'border-[#3949ab] bg-[#0d1117]' : 'border-[#333] bg-[#111] hover:border-[#555]'}`}>
                      <div className="flex gap-0.5 shrink-0">
                        {[item.preview, item.preview + 'aa', item.preview + '55'].map((c, i) => (
                          <div key={i} className="w-3 h-8 border border-black/20" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-mono font-bold uppercase text-white">{item.name}</p>
                        <p className="text-[9px] text-white/30 uppercase">Interface Premium</p>
                      </div>
                      {isActive
                        ? <span className="text-[9px] font-mono text-blue-400 uppercase border border-blue-400/40 px-2 py-1">ATIVO</span>
                        : <span className="text-[10px] font-mono text-yellow-400">{item.cost.toLocaleString()} C</span>
                      }
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
        {/* ── ALIADOS ─────────────────────────────────────────────────────── */}
        {activeTab === 'allies' && (
          <div className="flex flex-col gap-3">
            {Object.values(ALLIES).map(item => {
              const isHired    = gameState.ally?.activeId === item.id;
              const timeLeft   = isHired ? Math.max(0, gameState.ally.expiresAt - Date.now()) : 0;
              const minutesLeft = Math.ceil(timeLeft / 60000);
              const canAfford  = currency >= item.cost;
              const hasBadges  = badges >= (item.minBadges || 0);
              const isLocked   = !hasBadges && !isHired;
              return (
                <div key={item.id} className={`border-2 overflow-hidden ${isHired ? 'border-[#2471a3]' : 'border-[#333]'}`}>
                  <div className={`h-1 w-full ${isHired ? 'bg-[#2471a3]' : 'bg-[#333]'}`} />
                  <div className="flex items-center gap-4 p-4 bg-[#111]">
                    <div className={`w-20 h-20 border-2 shrink-0 flex items-center justify-center
                      ${isHired ? 'border-[#2471a3] bg-[#0d2137]' : 'border-[#333] bg-[#0d0d0d]'}`}>
                      <img src={item.sprite} className="w-16 h-16 object-contain"
                        style={{ imageRendering: 'pixelated' }} alt={item.name}
                        onError={e => { if (e.target.src !== 'https://play.pokemonshowdown.com/sprites/trainers/red.png') e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-black uppercase ${isHired ? 'text-[#5dade2]' : 'text-white'}`}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-white/40 italic mt-1 leading-tight">"{item.description}"</p>
                      {isHired && (
                        <div className="mt-2">
                          <GBHPBar value={timeLeft} max={gameState.ally?.duration || 3600000} />
                          <p className="text-[9px] font-mono text-blue-400 mt-1">⏱ {minutesLeft}min restantes</p>
                        </div>
                      )}
                      {!isHired && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <BadgeTag required={item.minBadges || 0} current={badges} />
                          <PriceTag value={item.cost} />
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {isHired
                        ? <span className="text-[9px] font-mono text-blue-400 border border-blue-400/40 px-2 py-1 block text-center">EM CAMPO</span>
                        : isLocked
                        ? <GBAButton variant="grey"
                            onClick={() => requestLockedInfo(item.name, `Obtenha ${item.minBadges} insígnia${item.minBadges !== 1 ? 's' : ''} (possui ${badges})`)}>
                            🔒 BLOQ.
                          </GBAButton>
                        : <GBAButton variant={canAfford ? 'blue' : 'grey'}
                            disabled={!canAfford}
                            onClick={() => requestPurchase(item.name, item.cost, () => onHireAlly(item.id, item.cost))}>
                            CONTRATAR
                          </GBAButton>
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* ── MINA ─────────────────────────────────────────────────────────── */}
        {activeTab === 'mine' && (() => {
          const mineLevel  = gameState.mine?.level || 0;
          const nextConfig = MINE_LEVELS[mineLevel + 1];
          const cost       = mineLevel === 0 ? nextConfig?.unlockCost : nextConfig?.upgradeCost;
          const canAfford  = cost && currency >= cost;
          const hasBadges  = !nextConfig?.minBadges || badges >= nextConfig.minBadges;
          return (
            <div className="flex flex-col gap-4">
              <div className="border-2 border-[#555] bg-[#111] p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 border-2 border-[#555] flex items-center justify-center bg-[#0d0d0d]">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hard-stone.png"
                      className="w-12 h-12 object-contain" style={{ imageRendering: 'pixelated' }} alt="" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-white/40 uppercase">Status da Instalação</p>
                    <p className="text-2xl font-black text-white uppercase">
                      {mineLevel === 0 ? 'INATIVA' : `MINA Nv.${mineLevel}`}
                    </p>
                    {mineLevel > 0 && <p className="text-[10px] font-mono text-yellow-400">⛏ {mineLevel * 5} peças / hora</p>}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-[9px] font-mono text-white/30 mb-1">
                    <span>NÍVEL</span><span>{mineLevel}/3</span>
                  </div>
                  <GBHPBar value={mineLevel} max={3} />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[1, 2, 3].map(lv => {
                    const cfg      = MINE_LEVELS[lv];
                    const unlocked = mineLevel >= lv;
                    return (
                      <div key={lv} className={`border p-2 text-center ${unlocked ? 'border-[#fbbf24] bg-[#1a1300]' : 'border-[#333] bg-[#0d0d0d]'}`}>
                        <p className={`text-[9px] font-mono uppercase ${unlocked ? 'text-yellow-400' : 'text-white/30'}`}>
                          {unlocked ? '★' : '○'} NV.{lv}
                        </p>
                        <p className="text-[8px] text-white/30 mt-1">{cfg?.label || `${lv * 5}/h`}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {nextConfig && (
                <div className="border-2 border-[#333] bg-[#111] p-4">
                  <p className="text-[9px] font-mono text-white/30 uppercase mb-3">
                    {mineLevel === 0 ? '▶ Desbloquear Mina' : `▶ Upgrade → Nv.${mineLevel + 1}`}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <BadgeTag required={nextConfig.minBadges || 0} current={badges} />
                      <div className="mt-1"><PriceTag value={cost} /></div>
                    </div>
                    {!hasBadges
                      ? <GBAButton variant="grey"
                          onClick={() => requestLockedInfo('Mina', `Obtenha ${nextConfig.minBadges} insígnia${nextConfig.minBadges !== 1 ? 's' : ''} (possui ${badges})`)}>
                          🔒 BLOQ.
                        </GBAButton>
                      : <GBAButton variant={canAfford ? 'gold' : 'grey'}
                          disabled={!canAfford}
                          onClick={() => requestPurchase(mineLevel === 0 ? 'Desbloquear Mina' : `Mina Nv.${mineLevel + 1}`, cost, handleMineUpgrade)}>
                          {mineLevel === 0 ? 'DESBLOQUEAR' : 'UPGRADE'}
                        </GBAButton>
                    }
                  </div>
                </div>
              )}
              {mineLevel >= 3 && (
                <div className="border-2 border-[#2e7d32] bg-[#0a1f0a] p-4 text-center">
                  <p className="text-[#4caf50] font-mono font-bold uppercase text-sm">★ MINA NO NÍVEL MÁXIMO ★</p>
                </div>
              )}
            </div>
          );
        })()}
        {/* ── PESCA ────────────────────────────────────────────────────────── */}
        {activeTab === 'fishing' && (
          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest border-b border-[#333] pb-2 mb-1">
              ▶ Equipe sua vara de pesca
            </p>
            {Object.values(FISHING_RODS).map(item => {
              const isOwned   = gameState.fishing?.rod === item.id;
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);
              const isLocked  = !hasBadges && !isOwned;
              return (
                <div key={item.id} className={`border-2 flex items-center gap-4 p-4 transition-all
                  ${isOwned ? 'border-[#0288d1] bg-[#0a1929]' : 'border-[#333] bg-[#111] hover:border-[#555]'}`}>
                  <div className={`w-14 h-14 border-2 flex items-center justify-center shrink-0
                    ${isOwned ? 'border-[#0288d1] bg-[#0d2137]' : 'border-[#444] bg-[#0d0d0d]'}`}>
                    <ItemSprite src={item.sprite} size="w-10 h-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-black uppercase ${isOwned ? 'text-[#4fc3f7]' : 'text-white'}`}>{item.name}</p>
                    <p className="text-[10px] italic text-white/40 mt-0.5">"{item.description}"</p>
                    <div className="flex gap-2 mt-1">
                      <BadgeTag required={item.minBadges || 0} current={badges} />
                    </div>
                  </div>
                  <div className="shrink-0">
                    {isOwned
                      ? <span className="text-[9px] font-mono text-[#4fc3f7] border border-[#0288d1]/50 px-2 py-1">EQUIPADA</span>
                      : isLocked
                      ? <GBAButton variant="grey"
                          onClick={() => requestLockedInfo(item.name, `Obtenha ${item.minBadges} insígnia${item.minBadges !== 1 ? 's' : ''} (possui ${badges})`)}>
                          🔒 BLOQ.
                        </GBAButton>
                      : <GBAButton variant={canAfford ? 'blue' : 'grey'}
                          disabled={!canAfford}
                          onClick={() => requestPurchase(item.name, item.cost, () => handleBuy('rod', item))}>
                          {item.cost.toLocaleString()} C
                        </GBAButton>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* ── GINÁSIO ──────────────────────────────────────────────────────── */}
        {activeTab === 'gym' && (
          <div className="flex flex-col gap-4">
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest border-b border-[#333] pb-2 mb-1">
              Escolha o estandarte do seu ginasio
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(GYM_BANNERS).map(item => {
                const isActive  = gameState.gymCustom?.bannerId === item.id;
                const canAfford = currency >= item.cost;
                return (
                  <div key={item.id}
                    onClick={() => { if (!isActive) requestPurchase(item.name, item.cost, () => handleBuy('banner', item)); }}
                    className={`border-2 cursor-pointer transition-all overflow-hidden
                      ${isActive ? 'border-[#fbbf24]' : 'border-[#333] hover:border-[#555]'}`}>
                    <div className="h-20 relative overflow-hidden" style={{ backgroundColor: item.color }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg,#000 0,#000 2px,transparent 2px,transparent 8px)' }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-white/35 bg-black/25 shadow-lg backdrop-blur-sm">
                          <ItemSprite src={item.sprite} size="w-10 h-10" />
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-black/60 flex items-center justify-center">
                          <ItemSprite src={ACTIVE_ICON} size="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="bg-[#111] p-2 text-center">
                      <p className="text-[10px] font-mono uppercase text-white/70">{item.name}</p>
                      <p className="text-[9px] font-mono mt-0.5" style={{ color: isActive ? '#fbbf24' : '#9ca3af' }}>
                        {isActive ? 'ATIVO' : `${item.cost.toLocaleString()} C`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LIGA (Minha Região) ───────────────────────────────────────── */}
        {activeTab === 'liga' && (() => {
          const myRegion = gameState.myRegion || {};
          const gymSlots  = myRegion.gymSlots  || 0;
          const eliteSlots = myRegion.eliteSlots || 0;
          const champSlot  = myRegion.championSlot || false;
          const hasAny = gymSlots > 0 || eliteSlots > 0 || champSlot;

          const handleBuyGymSlot = () => {
            const idx = gymSlots; // próximo slot (0-based index)
            if (idx >= 8) return;
            const cost = GYM_SLOT_COSTS[idx];
            if (currency < cost) return;
            setGameState(prev => ({
              ...prev,
              currency: prev.currency - cost,
              myRegion: { ...(prev.myRegion || {}), gymSlots: (prev.myRegion?.gymSlots || 0) + 1 },
            }));
            addLog(`🏟️ Ginásio ${idx + 1} desbloqueado!`, 'system');
          };

          const handleBuyEliteSlot = () => {
            if (gymSlots < 8) return; // precisa de todos os ginásios
            const idx = eliteSlots;
            if (idx >= 4) return;
            const cost = ELITE_SLOT_COSTS[idx];
            if (currency < cost) return;
            setGameState(prev => ({
              ...prev,
              currency: prev.currency - cost,
              myRegion: { ...(prev.myRegion || {}), eliteSlots: (prev.myRegion?.eliteSlots || 0) + 1 },
            }));
            addLog(`👑 Elite Four ${idx + 1} desbloqueado!`, 'system');
          };

          const handleBuyChampSlot = () => {
            if (eliteSlots < 4) return; // precisa de toda a elite
            if (champSlot) return;
            if (currency < CHAMPION_SLOT_COST) return;
            setGameState(prev => ({
              ...prev,
              currency: prev.currency - CHAMPION_SLOT_COST,
              myRegion: { ...(prev.myRegion || {}), championSlot: true },
            }));
            addLog(`🏆 Slot de Campeão desbloqueado!`, 'system');
          };

          return (
            <div className="flex flex-col gap-5">
              {/* Intro */}
              <div className="border border-[#333] bg-black/30 p-3 text-center">
                <p className="text-[9px] font-mono text-yellow-300/80 uppercase tracking-widest">MINHA REGIÃO</p>
                <p className="text-[8px] font-mono text-white/40 mt-1 leading-relaxed">
                  Monte sua própria região com até 8 ginásios, Elite Four e Campeão.<br/>
                  Seus amigos poderão desafiá-la!
                </p>
              </div>

              {/* ── GINÁSIOS ─────────────────────────────────────────────── */}
              <div>
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest border-b border-[#333] pb-2 mb-3">
                  🏟️ Ginásios (0-8)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {GYM_SLOT_COSTS.map((cost, i) => {
                    const slotN     = i + 1;
                    const isPurchased = gymSlots >= slotN;
                    const isNext    = gymSlots === i;
                    const isLocked  = gymSlots < i;
                    const canAfford = currency >= cost;
                    return (
                      <div key={i}
                        onClick={() => {
                          if (isLocked) { requestLockedInfo(`Ginásio ${slotN}`, `Compre o Ginásio ${slotN - 1} primeiro`); return; }
                          if (isNext) requestPurchase(`Ginásio ${slotN}`, cost, handleBuyGymSlot);
                        }}
                        style={{
                          border: `2px solid ${isPurchased ? '#22c55e' : isNext && canAfford ? '#3b82f6' : '#222'}`,
                          background: isPurchased ? '#071208' : isNext ? '#080f1c' : '#0a0a0a',
                          opacity: isLocked ? 0.4 : 1,
                          cursor: isNext && canAfford ? 'pointer' : 'default',
                        }}
                        className="p-3 flex flex-col gap-1.5 transition-all active:scale-95">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-black text-white/60 uppercase">
                            Ginásio {slotN}
                          </span>
                          {isPurchased && <span className="text-[8px] text-emerald-400 font-black">✓</span>}
                          {isNext && !isPurchased && <span className="text-[8px] text-blue-400 font-black">🛒</span>}
                          {isLocked && <span className="text-[8px] text-white/20">🔒</span>}
                        </div>
                        <span className="text-[8px] font-mono text-white/35">Lv.{GYM_SLOT_LEVELS[i]}</span>
                        {isPurchased
                          ? <span className="text-[7px] font-mono text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5">COMPRADO</span>
                          : <span className={`text-[8px] font-mono font-bold ${isNext && canAfford ? 'text-yellow-300' : 'text-white/30'}`}>
                              {cost.toLocaleString()} C
                            </span>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── ELITE FOUR ───────────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-2 border-b border-[#333] pb-2 mb-3">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest flex-1">
                    👑 Elite Four (0-4)
                  </p>
                  {gymSlots < 8 && (
                    <span className="text-[7px] font-mono text-amber-500/70 border border-amber-900/40 px-1.5 py-0.5">
                      Requer 8 Ginásios
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ELITE_SLOT_COSTS.map((cost, i) => {
                    const slotN      = i + 1;
                    const isPurchased = eliteSlots >= slotN;
                    const isNext     = gymSlots >= 8 && eliteSlots === i;
                    const isLocked   = gymSlots < 8 || eliteSlots < i;
                    const canAfford  = currency >= cost;
                    return (
                      <div key={i}
                        onClick={() => {
                          if (isLocked) {
                            const reason = gymSlots < 8 ? 'Compre todos os 8 Ginásios primeiro' : `Compre a Elite ${slotN - 1} primeiro`;
                            requestLockedInfo(`Elite ${slotN}`, reason);
                            return;
                          }
                          if (isNext) requestPurchase(`Elite ${slotN}`, cost, handleBuyEliteSlot);
                        }}
                        style={{
                          border: `2px solid ${isPurchased ? '#22c55e' : isNext && canAfford ? '#a855f7' : '#222'}`,
                          background: isPurchased ? '#071208' : isNext ? '#12060f' : '#0a0a0a',
                          opacity: isLocked ? 0.35 : 1,
                          cursor: isNext && canAfford ? 'pointer' : 'default',
                        }}
                        className="p-3 flex flex-col gap-1.5 transition-all active:scale-95">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-black text-white/60 uppercase">
                            Elite {slotN}
                          </span>
                          {isPurchased && <span className="text-[8px] text-emerald-400 font-black">✓</span>}
                          {isNext && !isPurchased && <span className="text-[8px] text-purple-400 font-black">🛒</span>}
                          {isLocked && <span className="text-[8px] text-white/20">🔒</span>}
                        </div>
                        <span className="text-[8px] font-mono text-white/35">Lv.{ELITE_SLOT_LEVELS[i]}</span>
                        {isPurchased
                          ? <span className="text-[7px] font-mono text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5">COMPRADO</span>
                          : <span className={`text-[8px] font-mono font-bold ${isNext && canAfford ? 'text-yellow-300' : 'text-white/30'}`}>
                              {cost.toLocaleString()} C
                            </span>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── CAMPEÃO ──────────────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-2 border-b border-[#333] pb-2 mb-3">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest flex-1">
                    🏆 Campeão
                  </p>
                  {eliteSlots < 4 && (
                    <span className="text-[7px] font-mono text-amber-500/70 border border-amber-900/40 px-1.5 py-0.5">
                      Requer Elite Four completa
                    </span>
                  )}
                </div>
                {(() => {
                  const isAvail  = eliteSlots >= 4 && !champSlot;
                  const canAfford = currency >= CHAMPION_SLOT_COST;
                  return (
                    <div
                      onClick={() => {
                        if (eliteSlots < 4 && !champSlot) { requestLockedInfo('Campeão da Liga', 'Compre toda a Elite Four primeiro'); return; }
                        if (isAvail) requestPurchase('Campeão da Liga', CHAMPION_SLOT_COST, handleBuyChampSlot);
                      }}
                      style={{
                        border: `2px solid ${champSlot ? '#fbbf24' : isAvail && canAfford ? '#f59e0b' : '#222'}`,
                        background: champSlot ? '#1c1500' : isAvail ? '#150e00' : '#0a0a0a',
                        opacity: eliteSlots < 4 && !champSlot ? 0.35 : 1,
                        cursor: isAvail && canAfford ? 'pointer' : 'default',
                      }}
                      className="p-4 flex items-center gap-4 transition-all active:scale-95">
                      <div className="text-3xl">{champSlot ? '🏆' : '🔒'}</div>
                      <div className="flex-1">
                        <p className="text-[10px] font-mono font-black text-white/70 uppercase">Campeão da Liga</p>
                        <p className="text-[8px] font-mono text-white/35 mt-0.5">Lv.{CHAMPION_LEVEL} · Slot único</p>
                        {champSlot
                          ? <span className="text-[7px] font-mono text-yellow-400 border border-yellow-700/50 px-1.5 py-0.5 mt-1 inline-block">★ COMPRADO</span>
                          : <span className={`text-[9px] font-mono font-bold mt-1 inline-block ${isAvail && canAfford ? 'text-yellow-300' : 'text-white/30'}`}>
                              {CHAMPION_SLOT_COST.toLocaleString()} C
                            </span>
                        }
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* ── GERENCIAR REGIÃO ─────────────────────────────────────── */}
              {hasAny && (
                <GBAButton variant="gold" className="w-full justify-center"
                  onClick={() => onOpenRegionBuilder && onOpenRegionBuilder()}>
                  🗺️ GERENCIAR REGIÃO →
                </GBAButton>
              )}
            </div>
          );
        })()}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gbaBlink { 0%,100%{opacity:1}50%{opacity:0} }
        .gba-blink { animation: gbaBlink 1s step-end infinite; }
        @keyframes equipSlideIn { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}} />

      {/* ── MODAL: CONFIRMAÇÃO DE COMPRA ──────────────────────────────────── */}
      {confirmPurchase && createPortal(
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm font-mono"
            style={{ animation: 'equipSlideIn 0.22s ease-out both' }}>
            <div className="border-4 border-[#c0392b]"
              style={{ background: '#0d1117', boxShadow: '0 0 40px #c0392b44, 0 -8px 0 #7b241c' }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-[#c0392b]/30"
                style={{ background: 'linear-gradient(90deg,#1a0000,#2d0a0a,#1a0000)' }}>
                <ItemSprite src={COIN_ICON} size="w-8 h-8" />
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] text-red-400/60 uppercase tracking-[0.35em]">CONFIRMAR COMPRA</p>
                  <p className="text-sm font-black text-white uppercase leading-none truncate">{confirmPurchase.label}</p>
                </div>
              </div>
              {/* Body */}
              <div className="px-4 py-4">
                <div className="flex justify-between items-center mb-3 bg-black/40 border border-white/10 px-3 py-2.5">
                  <span className="text-[9px] font-mono text-white/50 uppercase">Custo</span>
                  <PriceTag value={confirmPurchase.cost} />
                </div>
                <div className="flex justify-between items-center mb-4 bg-black/40 border border-white/10 px-3 py-2.5">
                  <span className="text-[9px] font-mono text-white/50 uppercase">Saldo após compra</span>
                  <span className={`text-[11px] font-mono font-black ${currency >= confirmPurchase.cost ? 'text-yellow-300' : 'text-red-400'}`}>
                    {Math.max(0, currency - confirmPurchase.cost).toLocaleString()} C
                  </span>
                </div>
                {currency < confirmPurchase.cost && (
                  <p className="text-[9px] text-red-400 font-mono text-center mb-3 uppercase tracking-wider">⚠ Coins insuficientes!</p>
                )}
                <div className="flex gap-3">
                  <GBAButton variant="green" className="flex-1"
                    disabled={currency < confirmPurchase.cost}
                    onClick={() => { confirmPurchase.onConfirm(); setConfirmPurchase(null); }}>
                    ✓ CONFIRMAR
                  </GBAButton>
                  <GBAButton variant="grey" className="flex-1"
                    onClick={() => setConfirmPurchase(null)}>
                    CANCELAR
                  </GBAButton>
                </div>
              </div>
              {/* Footer decorativo */}
              <div className="flex justify-between px-4 py-1.5 border-t border-[#333]">
                {['#c0392b', '#c0392b88', '#c0392b44'].map((c, i) => <div key={i} className="w-2 h-2" style={{ background: c }} />)}
                <p className="text-[7px] font-mono text-white/15 uppercase tracking-widest">LOJA DE PRESTÍGIO</p>
                {['#c0392b44', '#c0392b88', '#c0392b'].map((c, i) => <div key={i} className="w-2 h-2" style={{ background: c }} />)}
              </div>
            </div>
          </div>
        </div>
      , document.body)}

      {/* ── MODAL: ITEM BLOQUEADO ──────────────────────────────────────────── */}
      {lockedInfo && createPortal(
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm font-mono"
            style={{ animation: 'equipSlideIn 0.22s ease-out both' }}>
            <div className="border-4 border-[#555]"
              style={{ background: '#0d1117', boxShadow: '0 0 30px #55555544, 0 -6px 0 #333' }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-white/10"
                style={{ background: 'linear-gradient(90deg,#111,#1a1a1a,#111)' }}>
                <span className="text-2xl shrink-0">🔒</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] text-white/40 uppercase tracking-[0.35em]">ITEM BLOQUEADO</p>
                  <p className="text-sm font-black text-white uppercase leading-none truncate">{lockedInfo.name}</p>
                </div>
              </div>
              {/* Body */}
              <div className="px-4 py-5">
                <p className="text-[9px] font-mono text-white/50 uppercase text-center mb-2 tracking-wider">Para desbloquear este item:</p>
                <div className="bg-black/40 border border-yellow-600/30 px-4 py-3 mb-5 text-center">
                  <p className="text-[12px] font-black text-yellow-300 uppercase leading-relaxed">{lockedInfo.reason}</p>
                </div>
                <GBAButton variant="grey" className="w-full justify-center"
                  onClick={() => setLockedInfo(null)}>
                  OK, ENTENDI
                </GBAButton>
              </div>
            </div>
          </div>
        </div>
      , document.body)}

      {/* ── MODAL: EQUIPAR APÓS COMPRA ─────────────────────────────────────── */}
      {equipPrompt && createPortal(
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm font-mono"
            style={{ animation: 'equipSlideIn 0.22s ease-out both' }}>
            {/* Card GBA-style */}
            <div className="border-4 border-[#fbbf24]" style={{ background: '#0d1117', boxShadow: '0 0 40px #fbbf2444, 0 -8px 0 #b7950b' }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-[#fbbf24]/30"
                style={{ background: 'linear-gradient(90deg,#1c1500,#2a1f00,#1c1500)' }}>
                <div className="text-yellow-400 text-lg font-black">★</div>
                <div>
                  <p className="text-[8px] text-yellow-400/60 uppercase tracking-[0.35em]">DESBLOQUEADO</p>
                  <p className="text-sm font-black text-yellow-300 uppercase leading-none">{equipPrompt.name}</p>
                </div>
                <div className="ml-auto w-px h-8 bg-yellow-600/30" />
                <img src={equipPrompt.sprite} alt={equipPrompt.name}
                  className="w-12 h-12 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                  onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'; }} />
              </div>
              {/* Body */}
              <div className="px-4 py-4">
                <p className="text-[11px] text-white/70 font-mono text-center mb-4 leading-relaxed">
                  Deseja equipar <span className="text-yellow-300 font-black">{equipPrompt.name}</span> como<br />
                  seu avatar no Trainer Card agora?
                </p>
                <div className="flex gap-3">
                  <GBAButton variant="green" className="flex-1"
                    onClick={() => {
                      handleEquipCosmetic('sprite', equipPrompt.id);
                      setEquipPrompt(null);
                    }}>
                    ✓ EQUIPAR
                  </GBAButton>
                  <GBAButton variant="grey" className="flex-1"
                    onClick={() => setEquipPrompt(null)}>
                    Agora não
                  </GBAButton>
                </div>
              </div>
              {/* Footer decorativo */}
              <div className="flex justify-between px-4 py-1.5 border-t border-[#333]">
                {['#fbbf24', '#fbbf2488', '#fbbf2444'].map((c, i) => (
                  <div key={i} className="w-2 h-2" style={{ background: c }} />
                ))}
                <p className="text-[7px] font-mono text-white/15 uppercase tracking-widest">TRAINER CARD</p>
                {['#fbbf2444', '#fbbf2488', '#fbbf24'].map((c, i) => (
                  <div key={i} className="w-2 h-2" style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
};
export default PrestigeShop;

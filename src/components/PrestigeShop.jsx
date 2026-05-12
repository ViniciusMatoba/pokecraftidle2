import React, { useState } from 'react';
import {
  TROPHIES, TRAINER_TITLES, POKEDEX_FRAMES, UI_THEMES,
  ALLIES, MINE_LEVELS, FISHING_RODS, GYM_BANNERS
} from '../data/prestige';
import {
  AVATAR_SPRITES, AVATAR_TINTS, CARD_FRAMES, CARD_BACKGROUNDS,
  isCosmeticUnlocked, canPurchaseCosmetic, getTintFilter,
} from '../data/cosmetics';

/* ─── Helpers visuais ─────────────────────────────────────────────────────── */
const ItemSprite = ({ src, size = 'w-12 h-12' }) => (
  <img src={src} alt="" className={`${size} object-contain`}
    style={{ imageRendering: 'pixelated' }}
    onError={e => { e.target.style.display = 'none'; }} />
);

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

const BadgeTag = ({ required, current }) => {
  const ok = current >= required;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[9px] font-mono font-bold uppercase
      ${ok ? 'border-[#1e8449] bg-[#e8f5e9] text-[#1e8449]' : 'border-[#c0392b] bg-[#fde8e8] text-[#c0392b]'}`}>
      🏅 {required} BADGE{required !== 1 ? 'S' : ''}
    </span>
  );
};

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
const SpritesGrid = ({ appearance, worldFlags, pSprites, totalBadges, currency, onEquip, onBuy }) => {
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
                const unlocked = isCosmeticUnlocked(item, worldFlags, pSprites, totalBadges);
                const canBuy = canPurchaseCosmetic(item, worldFlags, pSprites, totalBadges, currency);
                const isEquipped = appearance.spriteId === item.id;
                const isLocked = !unlocked;

                return (
                  <div key={item.id}
                    onClick={() => {
                      if (isEquipped) return;
                      if (unlocked) onEquip('sprite', item.id);
                      else if (canBuy) onBuy('sprite', item);
                    }}
                    className={`relative flex flex-col items-center gap-1.5 p-2.5 border-2 cursor-pointer transition-all duration-150 select-none
                      ${isEquipped
                        ? 'border-[#fbbf24] bg-[#1c1500]'
                        : isLocked
                        ? 'border-[#2a2a2a] bg-[#0d0d0d] opacity-55'
                        : 'border-[#2a2a2a] bg-[#111] hover:border-[#555] hover:bg-[#1a1a1a] active:scale-95'
                      }`}
                    style={isEquipped ? { boxShadow: '0 0 12px #fbbf2444' } : {}}>

                    {/* Brilho no equipped */}
                    {isEquipped && (
                      <div className="absolute top-1 right-1 text-[8px] text-yellow-400 font-black">★</div>
                    )}

                    {/* Sprite */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      {isLocked ? (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center text-xl opacity-50">🔒</div>
                          <img src={item.sprite} alt=""
                            className="w-14 h-14 object-contain opacity-20"
                            style={{ imageRendering: 'pixelated', filter: 'grayscale(1)' }}
                            onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'; }} />
                        </>
                      ) : (
                        <img src={item.sprite} alt={item.name}
                          className="w-14 h-14 object-contain"
                          style={{ imageRendering: 'pixelated' }}
                          onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'; }} />
                      )}
                    </div>

                    {/* Nome */}
                    <p className={`text-[9px] font-mono uppercase text-center leading-none
                      ${isEquipped ? 'text-yellow-300 font-black' : isLocked ? 'text-white/25' : 'text-white/60'}`}>
                      {item.name}
                    </p>

                    {/* Status / preço */}
                    {isEquipped && (
                      <span className="text-[7px] font-mono text-yellow-400 uppercase border border-yellow-600/40 px-1.5 py-0.5">
                        EQUIPADO
                      </span>
                    )}
                    {!isEquipped && unlocked && (
                      <span className="text-[7px] font-mono text-emerald-400 uppercase">Equipar</span>
                    )}
                    {isLocked && item.unlockFlag && (
                      <span className="text-[7px] font-mono text-purple-400 text-center leading-tight">🏆 Progresso</span>
                    )}
                    {isLocked && !item.unlockFlag && item.cost > 0 && (
                      <span className={`text-[8px] font-mono font-bold ${canBuy ? 'text-yellow-300' : 'text-white/25'}`}>
                        {item.cost.toLocaleString()} C
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
const TintsGrid = ({ appearance, worldFlags, pTints, totalBadges, currency, currentSprite, onEquip, onBuy }) => (
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
const FramesGrid = ({ appearance, worldFlags, pFrames, totalBadges, currency, onEquip, onBuy }) => (
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
const BgsGrid = ({ appearance, worldFlags, pBgs, totalBadges, currency, onEquip, onBuy }) => (
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
const PrestigeShop = ({ gameState, setGameState, addLog, getBadgeCount, onHireAlly, onBack }) => {
  // ── State — TODOS os hooks aqui no topo, fora de qualquer condicional ──────
  const [activeTab,  setActiveTab]  = useState('avatar');
  const [avatarSub,  setAvatarSub]  = useState('sprites');  // ← FIX: estava dentro de IIFE!

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
      if (type === 'title')   newState.prestige = { ...prev.prestige, activeTitle: item.id };
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

  // ── Tabs ─────────────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'avatar',    label: 'Avatar',   key: '▲' },
    { id: 'trophies',  label: 'Troféus',  key: 'A' },
    { id: 'titles',    label: 'Títulos',  key: 'B' },
    { id: 'cosmetics', label: 'Visual',   key: '↑' },
    { id: 'allies',    label: 'Aliados',  key: '↓' },
    { id: 'mine',      label: 'Mina',     key: 'L' },
    { id: 'fishing',   label: 'Pesca',    key: 'R' },
    { id: 'gym',       label: 'Ginásio',  key: 'St'},
  ];

  const avatarSubTabs = [
    { id: 'sprites', label: '🧑 Sprite'  },
    { id: 'tints',   label: '🎨 Cor'     },
    { id: 'frames',  label: '🖼 Moldura' },
    { id: 'bgs',     label: '🌄 Fundo'   },
  ];

  return (
    <div className="absolute inset-0 z-[2000] flex flex-col overflow-hidden font-mono"
      style={{ background: 'linear-gradient(160deg,#0d1117 0%,#161b22 50%,#0d1117 100%)' }}>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 4px)' }} />

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 shrink-0 border-b-4 border-[#c0392b]"
        style={{ background: 'linear-gradient(90deg,#c0392b 0%,#e74c3c 50%,#c0392b 100%)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack}
            className="flex items-center gap-2 bg-black/30 border border-white/20 px-3 py-2 text-white font-mono text-[11px] uppercase tracking-widest hover:bg-black/50 active:translate-y-[1px] transition-all">
            ← SAIR
          </button>
          <div className="text-center">
            <p className="text-[8px] text-white/60 uppercase tracking-[0.4em] font-mono">★ EXCLUSIVO ★</p>
            <h2 className="text-lg font-black uppercase tracking-tighter text-white leading-none drop-shadow-lg">
              LOJA DE PRESTÍGIO
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-black/40 border border-white/20 px-3 py-2">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png"
              className="w-5 h-5 object-contain" style={{ imageRendering: 'pixelated' }} alt="" />
            <div className="text-right">
              <p className="text-[8px] text-white/50 uppercase">Coins</p>
              <p className="text-sm font-black text-yellow-300 tabular-nums">{currency.toLocaleString()}</p>
            </div>
          </div>
        </div>
        {/* Barra de badges */}
        <div className="flex items-center gap-3 px-4 pb-2">
          <span className="text-[9px] text-white/50 uppercase tracking-widest">Badges:</span>
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
      <div className="relative z-10 shrink-0 flex overflow-x-auto border-b-2 border-[#333]"
        style={{ background: '#1a1a2e' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-[10px] font-mono uppercase tracking-widest whitespace-nowrap border-r border-[#333] transition-all shrink-0
                ${isActive ? 'bg-[#f0f0f0] text-[#1a1a2e] border-b-2 border-b-[#c0392b]' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
              <span className="text-[8px] opacity-40 block">[{tab.key}]</span>
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{ borderLeft:'5px solid transparent', borderRight:'5px solid transparent', borderBottom:'5px solid #c0392b' }} />
              )}
            </button>
          );
        })}
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
            <div className="flex border-b-2 border-[#333]">
              {avatarSubTabs.map(st => (
                <button key={st.id} onClick={() => setAvatarSub(st.id)}
                  className={`flex-1 py-2.5 text-[10px] font-mono uppercase tracking-wide transition-all
                    ${avatarSub === st.id
                      ? 'bg-[#f0f0f0] text-[#1a1a2e] font-black border-b-2 border-[#c0392b]'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
                  {st.label}
                </button>
              ))}
            </div>

            {/* Conteúdo de cada sub-tab */}
            {avatarSub === 'sprites' && (
              <SpritesGrid
                appearance={appearance} worldFlags={worldFlags} pSprites={pSprites}
                totalBadges={badges} currency={currency}
                onEquip={handleEquipCosmetic} onBuy={handleBuyCosmetic}
              />
            )}
            {avatarSub === 'tints' && (
              <TintsGrid
                appearance={appearance} worldFlags={worldFlags} pTints={pTints}
                totalBadges={badges} currency={currency} currentSprite={currentSprite}
                onEquip={handleEquipCosmetic} onBuy={handleBuyCosmetic}
              />
            )}
            {avatarSub === 'frames' && (
              <FramesGrid
                appearance={appearance} worldFlags={worldFlags} pFrames={pFrames}
                totalBadges={badges} currency={currency}
                onEquip={handleEquipCosmetic} onBuy={handleBuyCosmetic}
              />
            )}
            {avatarSub === 'bgs' && (
              <BgsGrid
                appearance={appearance} worldFlags={worldFlags} pBgs={pBgs}
                totalBadges={badges} currency={currency}
                onEquip={handleEquipCosmetic} onBuy={handleBuyCosmetic}
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
              return (
                <MenuCard key={item.id} owned={isOwned} locked={!hasBadges && !isOwned}>
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
                        {!isOwned && <span className="text-[9px] font-mono font-bold text-yellow-400">💰 {item.cost.toLocaleString()} C</span>}
                      </div>
                    </div>
                    {!isOwned && (
                      <GBAButton variant={canAfford && hasBadges ? 'red' : 'grey'}
                        disabled={!canAfford || !hasBadges}
                        onClick={() => handleBuy('trophy', item)}>
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
            {Object.values(TRAINER_TITLES).map(item => {
              const isActive  = prestige.activeTitle === item.id;
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);
              return (
                <div key={item.id}
                  onClick={() => canAfford && hasBadges && handleBuy('title', item)}
                  className={`flex items-center gap-4 px-4 py-3 border-2 cursor-pointer transition-all
                    ${isActive
                      ? 'bg-[#1a237e] border-[#3949ab] text-white shadow-[0_0_12px_rgba(57,73,171,0.5)]'
                      : 'bg-[#111] border-[#333] text-white/60 hover:border-[#555] hover:text-white/80'}`}>
                  <div className={`w-4 h-4 border-2 shrink-0 flex items-center justify-center
                    ${isActive ? 'border-white bg-white' : 'border-[#555]'}`}>
                    {isActive && <div className="w-2 h-2 bg-[#1a237e]" />}
                  </div>
                  <ItemSprite src={item.sprite} size="w-8 h-8" />
                  <span className={`flex-1 text-sm font-black uppercase ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  <div className="text-right shrink-0">
                    <BadgeTag required={item.minBadges || 0} current={badges} />
                    {!isActive && <p className="text-[10px] font-mono text-yellow-400 mt-1">{item.cost.toLocaleString()} C</p>}
                    {isActive  && <span className="text-[9px] font-mono text-blue-300 uppercase">★ ATIVO</span>}
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
                      onClick={() => canAfford && handleBuy('frame', item)}
                      className={`border-2 p-3 cursor-pointer transition-all
                        ${isActive ? 'border-[#fbbf24] bg-[#1a1500]' : 'border-[#333] bg-[#111] hover:border-[#555]'}`}
                      style={isActive ? { borderColor: item.borderColor } : {}}>
                      <div className="w-full aspect-square border-4 mb-2 flex items-center justify-center relative"
                        style={{ borderColor: item.borderColor, backgroundColor: item.headerColor + '33' }}>
                        <div className="w-1/2 h-1/2 rounded-full opacity-30" style={{ backgroundColor: item.headerColor }} />
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
                      onClick={() => handleBuy('theme', item)}
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
                          <span className="text-[9px] font-mono text-yellow-400">💰 {item.cost.toLocaleString()} C</span>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {isHired
                        ? <span className="text-[9px] font-mono text-blue-400 border border-blue-400/40 px-2 py-1 block text-center">EM CAMPO</span>
                        : <GBAButton variant={canAfford && hasBadges ? 'blue' : 'grey'}
                            disabled={!canAfford || !hasBadges}
                            onClick={() => onHireAlly(item.id, item.cost)}>
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
                      <p className="text-yellow-400 font-mono text-sm mt-1">💰 {cost?.toLocaleString()} C</p>
                    </div>
                    <GBAButton variant={canAfford && hasBadges ? 'gold' : 'grey'}
                      disabled={!canAfford || !hasBadges}
                      onClick={handleMineUpgrade}>
                      {mineLevel === 0 ? 'DESBLOQUEAR' : 'UPGRADE'}
                    </GBAButton>
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
                      : <GBAButton variant={canAfford && hasBadges ? 'blue' : 'grey'}
                          disabled={!canAfford || !hasBadges}
                          onClick={() => handleBuy('rod', item)}>
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
              ▶ Escolha o estandarte do seu ginásio
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(GYM_BANNERS).map(item => {
                const isActive  = gameState.gymCustom?.bannerId === item.id;
                const canAfford = currency >= item.cost;
                return (
                  <div key={item.id}
                    onClick={() => canAfford && handleBuy('banner', item)}
                    className={`border-2 cursor-pointer transition-all overflow-hidden
                      ${isActive ? 'border-[#fbbf24]' : 'border-[#333] hover:border-[#555]'}`}>
                    <div className="h-16 relative overflow-hidden" style={{ backgroundColor: item.color }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg,#000 0,#000 2px,transparent 2px,transparent 8px)' }} />
                      {isActive && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-black/60 flex items-center justify-center">
                          <span className="text-yellow-400 text-[10px] font-black">★</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-[#111] p-2 text-center">
                      <p className="text-[10px] font-mono uppercase text-white/70">{item.name}</p>
                      <p className="text-[9px] font-mono mt-0.5" style={{ color: isActive ? '#fbbf24' : '#9ca3af' }}>
                        {isActive ? '★ ATIVO' : `${item.cost.toLocaleString()} C`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gbaBlink { 0%,100%{opacity:1}50%{opacity:0} }
        .gba-blink { animation: gbaBlink 1s step-end infinite; }
      `}} />
    </div>
  );
};

export default PrestigeShop;

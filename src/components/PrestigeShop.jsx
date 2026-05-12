import React, { useState, useEffect } from 'react';
import { 
  TROPHIES, TRAINER_TITLES, POKEDEX_FRAMES, UI_THEMES, 
  ALLIES, MINE_LEVELS, FISHING_RODS, GYM_BANNERS 
} from '../data/prestige';

/* ─── Componente de Item Sprite ───────────────────────────────────────── */
const ItemSprite = ({ src, fallback, size = 'w-12 h-12' }) => (
  <img
    src={src}
    alt=""
    className={`${size} object-contain pixelated drop-shadow-md`}
    style={{ imageRendering: 'pixelated' }}
    onError={e => { e.target.style.display = 'none'; }}
  />
);

/* ─── Barra de HP estilo Game Boy ─────────────────────────────────────── */
const GBHPBar = ({ value, max, color = '#78c030' }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor = pct > 50 ? '#78c030' : pct > 20 ? '#f8b800' : '#d82800';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-[#1a1a1a] border border-[#555] rounded-none overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: barColor, boxShadow: `0 0 4px ${barColor}80` }}
        />
      </div>
      <span className="text-[9px] font-mono text-white/50">{pct}%</span>
    </div>
  );
};

/* ─── Card estilo Menu Pokémon ─────────────────────────────────────────── */
const MenuCard = ({ children, owned, locked, onClick, className = '' }) => (
  <div
    onClick={onClick}
    className={`
      relative border-2 rounded-none transition-all duration-150 cursor-pointer
      ${owned
        ? 'bg-[#e8f5e9] border-[#2e7d32] shadow-[inset_0_-3px_0_#1b5e20]'
        : locked
        ? 'bg-[#1a1a2e] border-[#333] opacity-50 cursor-not-allowed'
        : 'bg-[#f0f0f0] border-[#1a1a2e] shadow-[inset_0_-3px_0_#1a1a2e] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none'
      }
      ${className}
    `}
  >
    {children}
  </div>
);

/* ─── Botão estilo GBA ─────────────────────────────────────────────────── */
const GBAButton = ({ children, onClick, disabled, variant = 'red', className = '' }) => {
  const variants = {
    red:    { bg: '#c0392b', shadow: '#7b241c', text: 'text-white' },
    blue:   { bg: '#2471a3', shadow: '#1a4f6e', text: 'text-white' },
    gold:   { bg: '#b7950b', shadow: '#7d6608', text: 'text-white' },
    green:  { bg: '#1e8449', shadow: '#145a32', text: 'text-white' },
    grey:   { bg: '#626567', shadow: '#424949', text: 'text-white' },
  };
  const v = variants[variant] || variants.red;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-5 py-2.5 font-mono font-bold text-[11px] uppercase tracking-widest
        border-2 border-black rounded-none transition-all duration-100
        ${disabled
          ? 'bg-[#444] border-[#333] text-white/30 cursor-not-allowed shadow-none'
          : `${v.text} hover:brightness-110 active:translate-y-[3px] active:shadow-none`
        }
        ${className}
      `}
      style={disabled ? {} : {
        backgroundColor: v.bg,
        boxShadow: `0 4px 0 ${v.shadow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
      }}
    >
      {children}
    </button>
  );
};

/* ─── Tag de Badge Requisito ───────────────────────────────────────────── */
const BadgeTag = ({ required, current }) => {
  const ok = current >= required;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[9px] font-mono font-bold uppercase ${
      ok ? 'border-[#1e8449] bg-[#e8f5e9] text-[#1e8449]' : 'border-[#c0392b] bg-[#fde8e8] text-[#c0392b]'
    }`}>
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/badge-case.png"
        className="w-3 h-3 object-contain" alt=""
        onError={e => e.target.remove()}
      />
      {required} BADGE{required !== 1 ? 'S' : ''}
    </span>
  );
};

/* ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────── */
const PrestigeShop = ({ gameState, setGameState, addLog, getBadgeCount, onHireAlly, onBack }) => {
  const [activeTab, setActiveTab] = useState('trophies');

  const badges = getBadgeCount(gameState);
  const currency = gameState.currency || 0;
  const prestige = gameState.prestige || {};

  const handleBuy = (type, item) => {
    if (currency < item.cost) return;
    if (badges < (item.minBadges || 0)) return;
    setGameState(prev => {
      const newState = { ...prev, currency: prev.currency - item.cost };
      if (type === 'trophy')  newState.prestige = { ...prev.prestige, trophies: [...(prev.prestige?.trophies || []), item.id] };
      if (type === 'title')   newState.prestige = { ...prev.prestige, activeTitle: item.id };
      if (type === 'frame')   newState.prestige = { ...prev.prestige, pokedexFrame: item.id };
      if (type === 'theme')   newState.prestige = { ...prev.prestige, uiTheme: item.id };
      if (type === 'rod')     newState.fishing   = { ...prev.fishing,  rod: item.id };
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

  const tabs = [
    { id: 'trophies', label: 'Troféus',  key: 'A' },
    { id: 'titles',   label: 'Títulos',  key: 'B' },
    { id: 'cosmetics',label: 'Visual',   key: '↑' },
    { id: 'allies',   label: 'Aliados',  key: '↓' },
    { id: 'mine',     label: 'Mina',     key: 'L' },
    { id: 'fishing',  label: 'Pesca',    key: 'R' },
    { id: 'gym',      label: 'Ginásio',  key: 'St' },
  ];

  return (
    <div className="absolute inset-0 z-[2000] flex flex-col overflow-hidden font-mono"
      style={{ background: 'linear-gradient(160deg, #0d1117 0%, #161b22 50%, #0d1117 100%)' }}>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)' }}
      />

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 shrink-0 border-b-4 border-[#c0392b]"
        style={{ background: 'linear-gradient(90deg, #c0392b 0%, #e74c3c 50%, #c0392b 100%)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Botão Voltar estilo GBA */}
          <button onClick={onBack}
            className="flex items-center gap-2 bg-black/30 border border-white/20 px-3 py-2 text-white font-mono text-[11px] uppercase tracking-widest hover:bg-black/50 active:translate-y-[1px] transition-all">
            ← SAIR
          </button>

          {/* Título */}
          <div className="text-center">
            <p className="text-[8px] text-white/60 uppercase tracking-[0.4em] font-mono">★ EXCLUSIVO ★</p>
            <h2 className="text-lg font-black uppercase tracking-tighter text-white leading-none drop-shadow-lg font-pixel text-[10px]">
              LOJA DE PRESTÍGIO
            </h2>
          </div>

          {/* Saldo */}
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
                style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
              />
            ))}
          </div>
          <span className="text-[9px] text-white/40 font-mono">{badges}/8</span>
        </div>
      </div>

      {/* ── TABS estilo categoria de mochila ────────────────────────────── */}
      <div className="relative z-10 shrink-0 flex overflow-x-auto border-b-2 border-[#333]"
        style={{ background: '#1a1a2e' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-[10px] font-mono uppercase tracking-widest whitespace-nowrap border-r border-[#333] transition-all shrink-0 ${
                isActive
                  ? 'bg-[#f0f0f0] text-[#1a1a2e] border-b-2 border-b-[#c0392b]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}>
              <span className="text-[8px] opacity-40 block">[{tab.key}]</span>
              {tab.label}
              {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid #c0392b' }} />}
            </button>
          );
        })}
      </div>

      {/* ── CONTENT AREA ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 pb-10">

        {/* TROFÉUS */}
        {activeTab === 'trophies' && (
          <div className="flex flex-col gap-3">
            {Object.values(TROPHIES).map(item => {
              const isOwned = prestige.trophies?.includes(item.id);
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);
              return (
                <MenuCard key={item.id} owned={isOwned} locked={!hasBadges && !isOwned}>
                  <div className="flex items-center gap-4 p-4">
                    {/* Sprite */}
                    <div className={`w-16 h-16 flex items-center justify-center border-2 shrink-0 ${
                      isOwned ? 'border-[#2e7d32] bg-[#e8f5e9]' : 'border-[#444] bg-[#111]'
                    }`}>
                      <ItemSprite src={item.sprite} size="w-12 h-12" />
                    </div>
                    {/* Info */}
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
                        {!isOwned && (
                          <span className="text-[9px] font-mono font-bold text-yellow-400">
                            💰 {item.cost.toLocaleString()} C
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Ação */}
                    {!isOwned && (
                      <GBAButton
                        variant={canAfford && hasBadges ? 'red' : 'grey'}
                        disabled={!canAfford || !hasBadges}
                        onClick={() => handleBuy('trophy', item)}
                      >
                        COMPRAR
                      </GBAButton>
                    )}
                  </div>
                </MenuCard>
              );
            })}
          </div>
        )}

        {/* TÍTULOS */}
        {activeTab === 'titles' && (
          <div className="flex flex-col gap-2">
            <p className="text-[9px] text-white/30 uppercase font-mono tracking-widest mb-2 border-b border-[#333] pb-2">
              ▶ Selecione seu título de treinador
            </p>
            {Object.values(TRAINER_TITLES).map(item => {
              const isActive = prestige.activeTitle === item.id;
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);
              return (
                <div key={item.id}
                  onClick={() => canAfford && hasBadges && handleBuy('title', item)}
                  className={`flex items-center gap-4 px-4 py-3 border-2 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#1a237e] border-[#3949ab] text-white shadow-[0_0_12px_rgba(57,73,171,0.5)]'
                      : 'bg-[#111] border-[#333] text-white/60 hover:border-[#555] hover:text-white/80'
                  }`}>
                  {/* Indicador */}
                  <div className={`w-4 h-4 border-2 shrink-0 flex items-center justify-center ${
                    isActive ? 'border-white bg-white' : 'border-[#555]'
                  }`}>
                    {isActive && <div className="w-2 h-2 bg-[#1a237e]" />}
                  </div>
                  {/* Sprite */}
                  <ItemSprite src={item.sprite} size="w-8 h-8" />
                  {/* Label */}
                  <span className={`flex-1 text-sm font-black uppercase ${isActive ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                  {/* Requisito / preço */}
                  <div className="text-right shrink-0">
                    <BadgeTag required={item.minBadges || 0} current={badges} />
                    {!isActive && (
                      <p className="text-[10px] font-mono text-yellow-400 mt-1">{item.cost.toLocaleString()} C</p>
                    )}
                    {isActive && (
                      <span className="text-[9px] font-mono text-blue-300 uppercase">★ ATIVO</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VISUAL (Frames + Themes) */}
        {activeTab === 'cosmetics' && (
          <div className="flex flex-col gap-6">
            {/* Molduras */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-0.5 w-4 bg-[#c0392b]" />
                <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest">Molduras da Pokédex</p>
                <div className="flex-1 h-0.5 bg-[#333]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(POKEDEX_FRAMES).map(item => {
                  const isActive = prestige.pokedexFrame === item.id;
                  const canAfford = currency >= item.cost;
                  return (
                    <div key={item.id}
                      onClick={() => canAfford && handleBuy('frame', item)}
                      className={`border-2 p-3 cursor-pointer transition-all ${
                        isActive ? 'border-[#fbbf24] bg-[#1a1500]' : 'border-[#333] bg-[#111] hover:border-[#555]'
                      }`}
                      style={isActive ? { borderColor: item.borderColor } : {}}>
                      {/* Preview da moldura */}
                      <div className="w-full aspect-square border-4 mb-2 flex items-center justify-center relative"
                        style={{ borderColor: item.borderColor, backgroundColor: item.headerColor + '33' }}>
                        <div className="w-1/2 h-1/2 rounded-full opacity-30"
                          style={{ backgroundColor: item.headerColor }} />
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

            {/* Temas */}
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
                      className={`flex items-center gap-4 border-2 p-3 cursor-pointer transition-all ${
                        isActive ? 'border-[#3949ab] bg-[#0d1117]' : 'border-[#333] bg-[#111] hover:border-[#555]'
                      }`}>
                      {/* Paleta de cores */}
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

        {/* ALIADOS */}
        {activeTab === 'allies' && (
          <div className="flex flex-col gap-3">
            {Object.values(ALLIES).map(item => {
              const isHired = gameState.ally?.activeId === item.id;
              const timeLeft = isHired ? Math.max(0, gameState.ally.expiresAt - Date.now()) : 0;
              const minutesLeft = Math.ceil(timeLeft / 60000);
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);
              return (
                <div key={item.id}
                  className={`border-2 overflow-hidden ${isHired ? 'border-[#2471a3]' : 'border-[#333]'}`}>
                  {/* Faixa colorida no topo */}
                  <div className={`h-1 w-full ${isHired ? 'bg-[#2471a3]' : 'bg-[#333]'}`} />
                  <div className="flex items-center gap-4 p-4 bg-[#111]">
                    {/* Sprite do aliado */}
                    <div className={`w-20 h-20 border-2 shrink-0 flex items-center justify-center ${
                      isHired ? 'border-[#2471a3] bg-[#0d2137]' : 'border-[#333] bg-[#0d0d0d]'
                    }`}>
                      <img src={item.sprite} className="w-16 h-16 object-contain"
                        style={{ imageRendering: 'pixelated' }} alt={item.name}
                        onError={e => e.target.remove()} />
                    </div>
                    {/* Info */}
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
                    {/* Botão */}
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

        {/* MINA */}
        {activeTab === 'mine' && (() => {
          const mineLevel = gameState.mine?.level || 0;
          const nextConfig = MINE_LEVELS[mineLevel + 1];
          const cost = mineLevel === 0 ? nextConfig?.unlockCost : nextConfig?.upgradeCost;
          const canAfford = cost && currency >= cost;
          const hasBadges = !nextConfig?.minBadges || badges >= nextConfig.minBadges;
          return (
            <div className="flex flex-col gap-4">
              {/* Status da Mina */}
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
                    {mineLevel > 0 && (
                      <p className="text-[10px] font-mono text-yellow-400">
                        ⛏ {mineLevel * 5} peças / hora
                      </p>
                    )}
                  </div>
                </div>
                {/* Barra de nível */}
                <div className="mb-3">
                  <div className="flex justify-between text-[9px] font-mono text-white/30 mb-1">
                    <span>NÍVEL</span>
                    <span>{mineLevel}/3</span>
                  </div>
                  <GBHPBar value={mineLevel} max={3} />
                </div>
                {/* Grade de levels */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[1, 2, 3].map(lv => {
                    const cfg = MINE_LEVELS[lv];
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
              {/* Botão de upgrade */}
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

        {/* PESCA */}
        {activeTab === 'fishing' && (
          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest border-b border-[#333] pb-2 mb-1">
              ▶ Equipe sua vara de pesca
            </p>
            {Object.values(FISHING_RODS).map(item => {
              const isOwned = gameState.fishing?.rod === item.id;
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);
              return (
                <div key={item.id} className={`border-2 flex items-center gap-4 p-4 transition-all ${
                  isOwned ? 'border-[#0288d1] bg-[#0a1929]' : 'border-[#333] bg-[#111] hover:border-[#555]'
                }`}>
                  <div className={`w-14 h-14 border-2 flex items-center justify-center shrink-0 ${
                    isOwned ? 'border-[#0288d1] bg-[#0d2137]' : 'border-[#444] bg-[#0d0d0d]'
                  }`}>
                    <ItemSprite src={item.sprite} size="w-10 h-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-black uppercase ${isOwned ? 'text-[#4fc3f7]' : 'text-white'}`}>
                      {item.name}
                    </p>
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

        {/* GINÁSIO */}
        {activeTab === 'gym' && (
          <div className="flex flex-col gap-4">
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest border-b border-[#333] pb-2 mb-1">
              ▶ Escolha o estandarte do seu ginásio
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(GYM_BANNERS).map(item => {
                const isActive = gameState.gymCustom?.bannerId === item.id;
                const canAfford = currency >= item.cost;
                return (
                  <div key={item.id}
                    onClick={() => canAfford && handleBuy('banner', item)}
                    className={`border-2 cursor-pointer transition-all overflow-hidden ${
                      isActive ? 'border-[#fbbf24]' : 'border-[#333] hover:border-[#555]'
                    }`}>
                    {/* Preview do banner */}
                    <div className="h-16 relative overflow-hidden" style={{ backgroundColor: item.color }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                      {/* Pixel pattern */}
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 8px)' }} />
                      {isActive && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-black/60 flex items-center justify-center">
                          <span className="text-yellow-400 text-[10px] font-black">★</span>
                        </div>
                      )}
                    </div>
                    <div className="bg-[#111] p-2 text-center">
                      <p className="text-[10px] font-mono uppercase text-white/70">{item.name}</p>
                      <p className="text-[9px] font-mono mt-0.5"
                        style={{ color: isActive ? '#fbbf24' : '#9ca3af' }}>
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

      {/* CSS customizado */}
      <style dangerouslySetInnerHTML={{ __html: `
        .pixelated { image-rendering: pixelated; image-rendering: crisp-edges; }
        @keyframes gbaBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .gba-blink { animation: gbaBlink 1s step-end infinite; }
      `}} />
    </div>
  );
};

export default PrestigeShop;

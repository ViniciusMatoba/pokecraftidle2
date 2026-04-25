import React, { useState, useEffect } from 'react';
import { StatusBadges } from './CommonUI';
import { BATTLE_BACKGROUNDS } from '../data/battleBackgrounds';
import ActiveEffectsBar from './ActiveEffectsBar';
import { TIME_CONFIG } from '../utils/timeSystem';

const BattleScreen = ({ 
  currentEnemy, gameState, activeMemberIndex, moveIndex, weather,
  setActiveMemberIndex, addLog, battleLog, floatingTexts,
  onUseItem, setGameState, setShowAutoCaptureModal, ROUTES, fixPath, TYPE_COLORS, onGoToCity, onChallengeBoss,
  timeOfDay
}) => {
  const activePoke = gameState.team?.[activeMemberIndex];
  const autoConfig = gameState.autoConfig || { autoPokeball: true, autoPotion: false, autoPotionHpPct: 30, focusPokemonIndex: 0 };

  const [showTrainer, setShowTrainer] = useState(true);
  const [selectedMove, setSelectedMove] = useState(null);
  const [showAutoConfig, setShowAutoConfig] = useState(false);
  const [shinyFlash, setShinyFlash] = useState(false);
  const [itemCategory, setItemCategory] = useState('capture');

  // Componente de Estrelas para o Brilho Shiny
  const ShinySparkles = () => (
    <div className="absolute inset-0 pointer-events-none z-30">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounceIn"
          style={{
            left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
            top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z" fill="#EAB308" opacity="0.9"/>
          </svg>
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    const introDuration = currentEnemy?.isTrainer ? 1500 : 800;
    setShowTrainer(true);
    const t = setTimeout(() => setShowTrainer(false), introDuration);
    if (currentEnemy?.isShiny) {
      setShinyFlash(true);
      setTimeout(() => setShinyFlash(false), 2000);
    }
    return () => clearTimeout(t);
  }, [currentEnemy?.instanceId, currentEnemy?.id]);

  const [playerShinyFlash, setPlayerShinyFlash] = useState(false);
  useEffect(() => {
    if (activePoke?.isShiny) { setPlayerShinyFlash(true); const t = setTimeout(() => setPlayerShinyFlash(false), 1500); return () => clearTimeout(t); }
  }, [activePoke?.uniqueId, activePoke?.id]);

  if (!currentEnemy) return <div className="h-full flex items-center justify-center"><p className="font-black uppercase text-slate-400 animate-pulse text-sm">Procurando...</p></div>;

  const getMoveDesc = (move) => {
    if (!move) return '';
    if (move.power > 0) return `Causa dano ${move.category === 'Special' ? 'especial' : 'físico'} com poder ${move.power}.`;
    if (move.statChanges?.length > 0) {
      return move.statChanges.map(c => `${c.change > 0 ? 'Aumenta' : 'Diminui'} ${c.stat.toUpperCase()} do ${move.target === 'enemy' ? 'inimigo' : 'usuário'}.`).join(' ');
    }
    const descs = {
      'Rosnado': 'Diminui o Ataque do inimigo em 1 estágio.',
      'Chicote de Cauda': 'Diminui a Defesa do inimigo em 1 estágio.',
      'Encarar': 'Diminui a Defesa do inimigo em 1 estágio.',
      'Cantar': 'Faz o inimigo dormir (reduz eficiência).',
      'Crescimento': 'Aumenta Ataque Especial do usuário.',
    };
    return descs[move.name] || 'Golpe de status efeito especial.';
  };

  const hpPercent = ((currentEnemy.hp || 0) / (currentEnemy.maxHp || 1)) * 100;
  const route = ROUTES[gameState.currentRoute] || ROUTES.pallet_town;
  const bgTheme = BATTLE_BACKGROUNDS[gameState.currentRoute] || BATTLE_BACKGROUNDS.pallet_town;
  const customBg = currentEnemy.background || route.background;
  
  const formatBg = (bg) => {
    if (!bg) return null;
    if (bg.includes('gradient') || bg.includes('url(')) return bg;
    return `url('${bg}')`;
  };

  const mainBackground = formatBg(customBg) || bgTheme.sky || 'linear-gradient(180deg, #87ceeb 0%, #b0e0ff 55%, #d4f0a0 55%, #7cb850 100%)';

  return (
    <div className="flex flex-col h-full animate-fadeIn pb-4 gap-2 overflow-y-auto custom-scrollbar" style={{paddingTop: '8px'}}>
      <ActiveEffectsBar activeEffects={gameState.activeEffects} />

      <div className="relative overflow-hidden rounded-2xl shadow-xl flex-shrink-0" style={{ height: 220 }}>
        <div
          className="absolute inset-0"
          style={{ 
            background: mainBackground,
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: TIME_CONFIG[timeOfDay]?.skyFilter || 'none',
            transition: 'filter 2s ease',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{ background: TIME_CONFIG[timeOfDay]?.overlayColor || 'transparent', transition: 'background 2s ease' }}
        />

        {shinyFlash && !showTrainer && <ShinySparkles />}

        <button
          onClick={() => setShowAutoConfig(true)}
          className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest backdrop-blur-md transition-all ${gameState.autoCapture || autoConfig.autoPotion ? 'bg-pokeBlue/90 border-white text-white' : 'bg-white/60 border-slate-300 text-slate-600'}`}
        >
          <div className={`w-2 h-2 rounded-full ${gameState.autoCapture || autoConfig.autoPotion ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
          Auto {gameState.autoCapture || autoConfig.autoPotion ? 'ON' : 'OFF'}
        </button>

        {/* HUD INIMIGO - Canto Superior Esquerdo */}
        <div className={`absolute top-2 left-2 min-w-[150px] transition-all duration-700 z-10 ${currentEnemy.hp > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white/95 rounded-xl px-3 py-2 shadow-lg border-l-4 border-slate-200 relative overflow-hidden">
            {showTrainer && currentEnemy.isTrainer ? (
              <div className="animate-fadeIn">
                 <span className="text-[8px] font-black text-pokeGold uppercase tracking-widest block mb-0.5">Desafiante</span>
                 <h4 className="text-slate-800 font-black text-[11px] uppercase truncate italic">{currentEnemy.trainerName}</h4>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center gap-2 mb-1">
                   <span className="font-black text-[11px] uppercase text-slate-800 truncate max-w-[110px]">
                      {currentEnemy.isTrainer ? currentEnemy.trainerName : currentEnemy.name}
                      {currentEnemy.isShiny && ' ✨'}
                   </span>
                   <span className="text-[10px] font-bold text-slate-500 shrink-0">Nv.{currentEnemy.level || '??'}</span>
                </div>
                <div className="flex items-center gap-1">
                   <span className="text-[7px] font-black text-slate-400 w-4">HP</span>
                   <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                     <div className={`h-full transition-all duration-500 ${hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${hpPercent}%` }} />
                   </div>
                </div>
                <div className="mt-1">
                   <StatusBadges status={currentEnemy.status || []} stages={currentEnemy.stages || {}} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* SPRITE INIMIGO - Quadrante Superior Direito */}
        <div className="absolute top-12 right-10 z-10 w-24 h-24 flex items-center justify-center">
          <div className="relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap">
              {(floatingTexts || []).map(f => <span key={f.id} className="block text-center font-black text-lg animate-floatUp" style={{ color: f.color, textShadow: '2px 2px 0 #000' }}>{f.text}</span>)}
            </div>
            {shinyFlash && !showTrainer && <ShinySparkles />}
            <img
              src={
                currentEnemy.isTrainer && showTrainer 
                  ? (currentEnemy.trainerSprite || 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png') 
                  : (currentEnemy.sprite || (currentEnemy.id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentEnemy.isShiny ? 'shiny/' : ''}${currentEnemy.id}.png` : 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'))
              }
              alt={currentEnemy.name || "Pokémon"}
              className={`w-full h-full object-contain drop-shadow-xl transition-all duration-500 ${showTrainer && currentEnemy.isTrainer ? 'scale-110' : 'animate-float'} ${currentEnemy.isShiny && !showTrainer ? 'drop-shadow-[0_0_16px_rgba(234,179,8,1)]' : ''} ${currentEnemy.hp <= 0 ? 'opacity-0 scale-0' : 'opacity-100'}`}
            />
          </div>
        </div>

        {/* HUD JOGADOR - Canto Inferior Direito */}
        <div className="absolute bottom-2 right-2 z-10 min-w-[150px]">
          {activePoke ? (
            <div className="bg-white/95 rounded-xl px-3 py-2 shadow-lg border-r-4 border-pokeBlue w-full text-right">
              <div className="flex justify-between items-center mb-1 flex-row-reverse">
                <span className="font-black text-[11px] uppercase text-slate-800 truncate max-w-[100px]">
                  {activePoke.name}{activePoke.isShiny && ' ✨'}
                </span>
                <span className="text-[10px] font-bold text-slate-500">Nv.{activePoke.level || 5}</span>
              </div>
              <div className="flex items-center gap-1 flex-row-reverse">
                <span className="text-[7px] font-black text-slate-400 w-4">HP</span>
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${(activePoke.hp / activePoke.maxHp) * 100}%` }} />
                </div>
                <span className="text-[7px] font-black text-slate-500 shrink-0">{activePoke.hp}/{activePoke.maxHp}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 flex-row-reverse">
                <span className="text-[7px] font-black text-slate-400 w-4">XP</span>
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-pokeBlue h-full transition-all duration-300" style={{ width: `${Math.min(100, ((activePoke.xp || 0) / ((activePoke.level || 5) * 50)) * 100)}%` }} />
                </div>
              </div>
              {(() => {
                const stamina = gameState.stamina?.[activePoke?.instanceId]?.value ?? 100;
                const color  = stamina > 60 ? '#22c55e' : stamina > 30 ? '#f59e0b' : '#ef4444';
                const emoji  = stamina > 60 ? '🟢' : stamina > 30 ? '🟡' : stamina > 0 ? '🔴' : '💀';
                return (
                  <div className="mt-0.5">
                    <div className="flex items-center justify-between mb-0.5 flex-row-reverse text-right">
                      <span className="text-[7px] font-black text-slate-400 uppercase">ENERGIA {emoji}</span>
                      <span className="text-[7px] font-black" style={{ color }}>{Math.floor(stamina)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${stamina}%`, background: color }} />
                    </div>
                    {stamina <= 0 && (
                      <div className="mt-1 bg-red-500/20 border border-red-500/40 rounded-xl px-1.5 py-1">
                        <p className="text-red-400 text-[7px] font-black uppercase text-center animate-pulse">😵 Exausto</p>
                      </div>
                    )}
                  </div>
                );
              })()}
              <div className="flex justify-end mt-1">
                <StatusBadges status={activePoke.status || []} stages={activePoke.stages || {}} />
              </div>
            </div>
          ) : <div className="text-white bg-black/50 px-3 py-2 rounded-xl italic text-[10px]">Aguardando...</div>}
        </div>

        {/* SPRITE JOGADOR - Quadrante Inferior Esquerdo */}
        <div className="absolute bottom-2 left-6 z-10 w-24 h-24 flex items-center justify-center">
          {activePoke && (
            <div className="relative">
              {playerShinyFlash && <ShinySparkles />}
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${activePoke.isShiny ? 'shiny/' : ''}${activePoke.id}.gif`}
                className={`w-full h-full object-contain drop-shadow-xl ${activePoke.isShiny ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.9)]' : ''}`}
                alt="Player"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── ITENS CATEGORIAS ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0">
        <div className="flex gap-1.5 mb-2.5">
          {[
            { key: 'capture', label: 'Captura', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
            { key: 'heal', label: 'Cura', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png' },
            { key: 'food', label: 'Aliment.', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png' },
            { key: 'buff', label: 'Buffs', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png' },
          ].map(cat => (
            <button key={cat.key} onClick={() => setItemCategory(cat.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all ${itemCategory === cat.key ? 'border-pokeBlue bg-blue-50' : 'border-slate-100 bg-slate-50'}`}>
              <img src={cat.icon} className="w-7 h-7 object-contain" alt={cat.label} />
              <span className="text-[9px] font-black uppercase text-slate-600">{cat.label}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {[
            { key: 'capture', items: [
              { id: 'pokeballs',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',  label: 'Pokébola', src: 'items' },
              { id: 'great_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', label: 'Great',    src: 'items' },
              { id: 'ultra_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', label: 'Ultra',    src: 'items' },
            ]},
            { key: 'heal', items: [
              { id: 'potions',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',       label: 'Poção',  src: 'items' },
              { id: 'super_potion', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png', label: 'Super',  src: 'items' },
              { id: 'revive',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',       label: 'Reviver',src: 'items' },
            ]},
            { key: 'food', items: [
              { id: 'moomoo_milk',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png',  label: 'MooMoo', src: 'items' },
              { id: 'lemonade',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',     label: 'Limo.',  src: 'items' },
              { id: 'soda_pop',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',     label: 'Soda',   src: 'items' },
              { id: 'fresh_water',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',  label: 'Água',   src: 'items' },
              { id: 'oran_berry',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',   label: 'Oran',   src: 'materials' },
              { id: 'sitrus_berry', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png', label: 'Sitrus', src: 'materials' },
            ]},
            { key: 'buff', items: [
              { id: 'x_attack',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png', label: 'X-Atk', src: 'items' },
              { id: 'x_defense', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-defend.png', label: 'X-Def', src: 'items' },
              { id: 'x_speed',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-speed.png',  label: 'X-Spd', src: 'items' },
              { id: 'dire_hit',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dire-hit.png', label: 'Crítico',src: 'items' },
            ]},
          ].find(c => c.key === itemCategory)?.items.map(item => {
            const qty = (gameState.inventory?.[item.src] || {})[item.id] || 0;
            return (
              <button key={item.id} disabled={qty <= 0} onClick={() => onUseItem && onUseItem(item.id, item.src)}
                className={`flex flex-col items-center gap-1 flex-1 min-w-[64px] py-2 rounded-xl border-2 transition-all active:scale-95 ${qty <= 0 ? 'opacity-30 grayscale border-slate-100 bg-slate-50' : 'border-slate-200 bg-white hover:border-pokeBlue hover:bg-blue-50'}`}>
                <img src={item.img} alt={item.label} className="w-9 h-9 object-contain drop-shadow-sm" />
                <span className="text-[11px] font-black text-slate-700">{qty}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/*    GOLPES    */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Ataques <span className="normal-case font-normal">(toque para detalhes)</span></p>
        <div className="grid grid-cols-2 gap-3">
          {(activePoke?.moves || []).map((move, index) => {
            const isActive = index === (moveIndex % (activePoke?.moves?.length || 1));
            const isSelected = selectedMove?.name === move.name;
            return (
              <div key={index}>
                <div
                  onClick={() => setSelectedMove(isSelected ? null : move)}
                  className={`flex items-center gap-2 px-3 py-4 rounded-xl border-2 transition-all cursor-pointer min-h-[64px] ${isActive ? 'border-pokeYellow bg-yellow-50' : 'border-slate-100 bg-slate-50/50 opacity-60'} ${isSelected ? 'ring-2 ring-pokeBlue' : ''}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-pokeYellow' : 'bg-slate-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase text-slate-800 truncate leading-none">{move.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`${TYPE_COLORS[move.type] || 'bg-slate-400'} text-white text-[7px] font-black px-1.5 py-0.5 rounded-full`}>{move.type}</span>
                      {move.power > 0 && <span className="text-[8px] text-slate-400 font-bold">PWR {move.power}</span>}
                      {move.power === 0 && <span className="text-[8px] text-purple-400 font-bold">STATUS</span>}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-1 px-3 py-2 bg-blue-50 border-2 border-pokeBlue rounded-xl text-[9px] text-slate-700 font-bold leading-tight animate-fadeIn">
                    {getMoveDesc(move)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/*    TIME    */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Time</p>
        <div className="flex flex-col gap-1.5">
          {[0,1,2,3,4,5].map(i => {
            const p = gameState.team[i];
            if (!p) return <div key={i} className="flex items-center gap-3 px-2 py-1.5 rounded-xl border-2 border-dashed border-slate-150 opacity-30"><div className="w-10 h-10 bg-slate-100 rounded-lg" /><span className="text-[9px] text-slate-400 font-bold">Vazio</span></div>;
            const isActive = activeMemberIndex === i;
            const stamina   = gameState.stamina?.[p?.instanceId]?.value ?? 100;
            const exhausted = stamina <= 0;
            const fainted   = (p?.hp ?? 0) <= 0;
            const blocked   = exhausted || fainted;
            const hpPct = (p.hp / p.maxHp) * 100;
            return (
              <div 
                key={p?.instanceId || i} 
                onClick={() => { if (!blocked && !isActive) { setGameState(prev => ({ ...prev, team: prev.team.map((pk, idx) => idx === i || idx === activeMemberIndex ? { ...pk, stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } } : pk) })); setActiveMemberIndex(i); } }}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                  isActive ? 'border-pokeBlue bg-blue-50 shadow-sm' : blocked ? 'border-red-500/30 bg-red-500/10 opacity-60 cursor-not-allowed' : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`} className={`w-10 h-10 object-contain ${blocked ? 'grayscale' : ''} ${p.isShiny ? 'drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]' : ''}`} alt={p.name} />
                  {isActive && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-pokeBlue rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase text-slate-800 truncate">{p.name}{p.isShiny && ' ✨'}</span>
                    <span className={`text-[9px] font-bold ml-1 flex-shrink-0 ${isActive ? 'text-pokeBlue' : 'text-slate-400'}`}>Nv. {p.level || 5}</span>
                  </div>
                  {fainted ? (
                    <p className="text-red-400 text-[8px] font-black uppercase mt-1">💀 Desmaiado</p>
                  ) : exhausted ? (
                    <p className="text-orange-400 text-[8px] font-black uppercase mt-1">😵 Exausto</p>
                  ) : (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[7px] font-black text-slate-400 w-4 flex-shrink-0">HP</span>
                      <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${hpPct > 50 ? 'bg-green-500' : hpPct > 20 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${hpPct}%` }} />
                      </div>
                      <span className="text-[7px] font-bold text-slate-400 flex-shrink-0">{p.hp}/{p.maxHp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {route?.keyBattles?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0 animate-fadeIn">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Desafios Disponíveis</p>
          <div className="flex flex-col gap-2">
            {route.keyBattles.map(battle => (
              <button key={battle.id} onClick={() => onChallengeBoss && onChallengeBoss(battle)}
                className={`group flex items-center justify-between px-4 py-2.5 rounded-xl border-2 transition-all active:scale-[0.98] ${battle.type === 'rival' ? 'border-blue-200 bg-blue-50/50 hover:bg-blue-100' : battle.type === 'rocket' ? 'border-red-200 bg-red-50/50 hover:bg-red-100' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-lg ${battle.type === 'rival' ? 'bg-blue-500' : 'bg-red-600'}`}>
                    <img src={battle.sprite} alt={battle.name} className="w-8 h-8 object-contain brightness-110" />
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-tight ${battle.type === 'rival' ? 'text-blue-700' : 'text-red-700'}`}>{battle.name}</span>
                </div>
                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">⚔️</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showAutoConfig && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={() => setShowAutoConfig(false)}>
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl animate-bounceIn overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="flex-shrink-0 px-8 pt-8 pb-4 flex items-center justify-between">
              <h3 className="font-black text-slate-800 uppercase italic text-xl">⚙️ Painel Automático</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-2 flex flex-col gap-5">
              <div className="bg-blue-50 p-5 rounded-3xl border-2 border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-black text-slate-800 text-sm uppercase tracking-tighter">🎯 Auto-Captura</p>
                  </div>
                  <div className="relative cursor-pointer" onClick={() => setGameState(prev => ({ ...prev, autoCapture: !prev.autoCapture }))}>
                    <div className={`w-14 h-7 rounded-full transition-all duration-300 ${gameState.autoCapture ? 'bg-pokeBlue' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${gameState.autoCapture ? 'translate-x-8' : 'translate-x-1'}`} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-5 rounded-3xl border-2 border-green-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-black text-slate-800 text-sm uppercase tracking-tighter">💊 Auto-Poção</p>
                  </div>
                  <div className="relative cursor-pointer" onClick={() => setGameState(prev => ({ ...prev, autoConfig: { ...prev.autoConfig, autoPotion: !autoConfig.autoPotion } }))}>
                    <div className={`w-14 h-7 rounded-full transition-all duration-300 ${autoConfig.autoPotion ? 'bg-green-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${autoConfig.autoPotion ? 'translate-x-8' : 'translate-x-1'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 p-8 pt-4">
              <button onClick={() => setShowAutoConfig(false)}
                className="w-full bg-slate-800 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-700 transition-all">
                Salvar Ajustes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleScreen;

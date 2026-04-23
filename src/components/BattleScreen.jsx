import React, { useState, useEffect } from 'react';
import { StatusBadges } from './CommonUI';

const BattleScreen = ({ 
  currentEnemy, 
  gameState, 
  activeMemberIndex, 
  moveIndex, 
  weather, 
  setActiveMemberIndex, 
  addLog, 
  battleLog, 
  floatingTexts, 
  onUseItem, 
  setGameState,
  ROUTES,
  fixPath,
  TYPE_COLORS,
  onGoToCity,
  onChallengeBoss
}) => {
  const [showTrainer, setShowTrainer] = useState(true);

  useEffect(() => {
    if (currentEnemy?.isTrainer) {
      setShowTrainer(true);
      const timer = setTimeout(() => setShowTrainer(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowTrainer(false);
    }
  }, [currentEnemy?.isTrainer, currentEnemy?.id]);

  if (!currentEnemy) return (
    <div className="h-full flex items-center justify-center">
      <p className="font-black uppercase text-slate-400 animate-pulse text-sm">Procurando...</p>
    </div>
  );

  const hpPercent   = ((currentEnemy.hp || 0) / (currentEnemy.maxHp || 1)) * 100;
  const route       = ROUTES[gameState.currentRoute] || ROUTES.pallet_town;
  const bgUrl       = fixPath(currentEnemy.background || route.background || '');
  const activePoke  = gameState.team?.[activeMemberIndex];

  return (
    <div className="flex flex-col h-full animate-fadeIn pb-20 gap-2 overflow-y-auto custom-scrollbar">

      {/* ── 1. ARENA ─────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-xl flex-shrink-0"
        style={{ height: 220, backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/10" />

        {/* Auto Capture toggle */}
        <button
          onClick={() => setGameState(prev => ({ ...prev, autoCapture: !prev.autoCapture }))}
          className={`absolute top-2 left-2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest backdrop-blur-md transition-all ${gameState.autoCapture ? 'bg-pokeBlue/90 border-white text-white' : 'bg-white/60 border-slate-300 text-slate-600'}`}
        >
          <div className={`w-2 h-2 rounded-full ${gameState.autoCapture ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
          {gameState.autoCapture ? 'Auto ON' : 'Auto OFF'}
        </button>

        {/* Inimigo — topo direito */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-l-4 border-slate-800 min-w-[140px]">
            <div className="flex justify-between items-center">
              <span className="font-black text-[10px] uppercase text-slate-800 truncate max-w-[90px]">
                {currentEnemy.isTrainer ? `${currentEnemy.trainerName}'s ` : ''}{currentEnemy.name}
              </span>
              <span className="text-[9px] font-bold text-slate-500 ml-1">Nv.{currentEnemy.level}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className={`h-full transition-all duration-300 ${hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${hpPercent}%` }} />
            </div>
            <StatusBadges status={currentEnemy.status || []} stages={currentEnemy.stages || {}} />
          </div>
          <div className="relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap">
              {(floatingTexts || []).map(f => (
                <span key={f.id} className="block text-center font-black text-base animate-floatUp" style={{ color: f.color, textShadow: '1px 1px 0 #000' }}>{f.text}</span>
              ))}
            </div>
            <img
              src={currentEnemy.isTrainer && showTrainer
                ? currentEnemy.trainerSprite
                : (currentEnemy.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentEnemy.isShiny ? 'shiny/' : ''}${currentEnemy.id}.png`)}
              alt="Enemy"
              className={`w-24 h-24 object-contain drop-shadow-xl ${showTrainer && currentEnemy.isTrainer ? 'scale-110' : 'animate-float'} ${currentEnemy.isShiny ? 'drop-shadow-[0_0_12px_rgba(234,179,8,0.9)]' : ''}`}
            />
          </div>
        </div>

        {/* Jogador — base esquerda */}
        <div className="absolute bottom-2 left-2 z-10 flex items-end gap-2">
          {activePoke ? (
            <>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${activePoke.isShiny ? 'shiny/' : ''}${activePoke.id}.gif`}
                className="w-20 h-20 object-contain drop-shadow-xl"
                alt="Player"
              />
              <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-r-4 border-pokeBlue min-w-[140px] mb-1">
                <div className="flex justify-between items-center">
                  <span className="font-black text-[10px] uppercase text-slate-800 truncate max-w-[90px]">{activePoke.name}</span>
                  <span className="text-[9px] font-bold text-pokeBlue ml-1">Nv.{activePoke.level || 5}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[8px] font-black text-slate-400 w-4">HP</span>
                  <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${(activePoke.hp / activePoke.maxHp) * 100}%` }} />
                  </div>
                  <span className="text-[8px] font-black text-slate-400">{activePoke.hp}/{activePoke.maxHp}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[8px] font-black text-slate-400 w-4">XP</span>
                  <div className="flex-1 bg-slate-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-pokeBlue h-full transition-all duration-300" style={{ width: `${Math.min(100, ((activePoke.xp || 0) / ((activePoke.level || 5) * 50)) * 100)}%` }} />
                  </div>
                </div>
                <StatusBadges status={activePoke.status || []} stages={activePoke.stages || {}} />
              </div>
            </>
          ) : (
            <div className="text-white bg-black/50 px-3 py-2 rounded-xl italic text-[10px]">Aguardando...</div>
          )}
        </div>
      </div>

      {/* ── 2. ITENS CONSUMÍVEIS ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Itens</p>
        <div className="flex gap-2">
          {[
            { id: 'pokeballs',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',  label: 'Pokébolas' },
            { id: 'great_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', label: 'Great Ball' },
            { id: 'ultra_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', label: 'Ultra Ball' },
            { id: 'potions',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',     label: 'Poção'    },
            { id: 'revive',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',     label: 'Reviver'  },
          ].map(item => {
            const qty = (gameState.inventory?.items || {})[item.id] || 0;
            const disabled = qty <= 0;
            return (
              <button
                key={item.id}
                disabled={disabled}
                onClick={() => onUseItem && onUseItem(item.id)}
                className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl border-2 transition-all active:scale-95 ${disabled ? 'opacity-30 grayscale border-slate-100 bg-slate-50' : 'border-slate-200 bg-white hover:border-pokeBlue hover:bg-blue-50'}`}
              >
                <img src={item.img} alt={item.label} className="w-9 h-9 object-contain drop-shadow-sm" />
                <span className="text-[10px] font-black text-slate-700">{qty}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. MOVES ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Ataques</p>
        <div className="grid grid-cols-2 gap-2">
          {(activePoke?.moves || []).map((move, index) => {
            const isActive = index === (moveIndex % (activePoke?.moves?.length || 1));
            return (
              <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${isActive ? 'border-pokeYellow bg-yellow-50' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-pokeYellow' : 'bg-slate-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase text-slate-800 truncate leading-none">{move.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`${TYPE_COLORS[move.type] || 'bg-slate-400'} text-white text-[7px] font-black px-1.5 py-0.5 rounded-full`}>{move.type}</span>
                    {move.power > 0 && <span className="text-[8px] text-slate-400 font-bold">PWR {move.power}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. TIME (6 Pokémon — um por linha) ───────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Time</p>
        <div className="flex flex-col gap-1.5">
          {[0,1,2,3,4,5].map(i => {
            const p = gameState.team[i];
            if (!p) return (
              <div key={i} className="flex items-center gap-3 px-2 py-1.5 rounded-xl border-2 border-dashed border-slate-150 opacity-30">
                <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                <span className="text-[9px] text-slate-400 font-bold">Vazio</span>
              </div>
            );
            const isActive  = activeMemberIndex === i;
            const hpPct     = (p.hp / p.maxHp) * 100;
            const xpPct     = Math.min(100, ((p.xp || 0) / ((p.level || 5) * 50)) * 100);
            const fainted   = p.hp <= 0;
            return (
              <div
                key={i}
                onClick={() => {
                  if (!fainted && !isActive) {
                    setGameState(prev => ({
                      ...prev,
                      team: prev.team.map((pk, idx) =>
                        idx === i || idx === activeMemberIndex
                          ? { ...pk, stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } }
                          : pk
                      )
                    }));
                    setActiveMemberIndex(i);
                  }
                }}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] ${isActive ? 'border-pokeBlue bg-blue-50' : fainted ? 'border-red-100 bg-red-50/50 opacity-50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`}
                    className={`w-10 h-10 object-contain ${fainted ? 'grayscale' : ''}`}
                    alt={p.name}
                  />
                  {isActive && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-pokeBlue rounded-full border-2 border-white" />}
                  {p.isShiny && <span className="absolute -top-1 -left-1 text-[8px]">✨</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase text-slate-800 truncate">{p.name}</span>
                    <span className={`text-[9px] font-bold ml-1 flex-shrink-0 ${isActive ? 'text-pokeBlue' : 'text-slate-400'}`}>Nv. {p.level || 5}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[7px] font-black text-slate-400 w-4 flex-shrink-0">HP</span>
                    <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${hpPct > 50 ? 'bg-green-500' : hpPct > 20 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${hpPct}%` }} />
                    </div>
                    <span className="text-[7px] font-bold text-slate-400 flex-shrink-0">{p.hp}/{p.maxHp}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[7px] font-black text-slate-400 w-4 flex-shrink-0">XP</span>
                    <div className="flex-1 bg-slate-200 h-1 rounded-full overflow-hidden">
                      <div className="bg-pokeBlue h-full transition-all" style={{ width: `${xpPct}%` }} />
                    </div>
                    <span className="text-[7px] font-bold text-slate-400 flex-shrink-0">{p.xp || 0}/{(p.level || 5) * 50}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* ── 5. BATALHAS ESPECIAIS ────────────────────────────────────────── */}
      {route?.keyBattles?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0 animate-fadeIn">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Desafios Disponíveis</p>
          <div className="flex flex-col gap-2">
            {route.keyBattles.map(battle => (
              <button
                key={battle.id}
                onClick={() => onChallengeBoss && onChallengeBoss(battle)}
                className={`group flex items-center justify-between px-4 py-2.5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                  battle.type === 'rival' ? 'border-blue-200 bg-blue-50/50 hover:bg-blue-100' : 
                  battle.type === 'rocket' ? 'border-red-200 bg-red-50/50 hover:bg-red-100' :
                  'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-lg ${battle.type === 'rival' ? 'bg-blue-500' : 'bg-red-600'}`}>
                    <img src={battle.sprite} alt={battle.name} className="w-8 h-8 object-contain brightness-110" />
                  </div>
                  <span className={`text-[11px] font-black uppercase tracking-tight ${battle.type === 'rival' ? 'text-blue-700' : 'text-red-700'}`}>
                    {battle.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Lutar</span>
                  <span className="text-sm">⚔️</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default BattleScreen;

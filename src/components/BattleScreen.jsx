import React, { useState, useEffect } from 'react';
import { StatusBadges } from './CommonUI';
import { BATTLE_BACKGROUNDS } from '../data/battleBackgrounds';
import ActiveEffectsBar from './ActiveEffectsBar';

const BattleScreen = ({ 
  currentEnemy, gameState, activeMemberIndex, moveIndex, weather,
  setActiveMemberIndex, addLog, battleLog, floatingTexts,
  onUseItem, setGameState, ROUTES, fixPath, TYPE_COLORS, onGoToCity, onChallengeBoss
}) => {
  const activePoke = gameState.team?.[activeMemberIndex];
  const autoConfig = gameState.autoConfig || { autoPokeball: true, autoPotion: false, autoPotionHpPct: 30, focusPokemonIndex: 0 };

  const [showTrainer, setShowTrainer] = useState(true);
  const [selectedMove, setSelectedMove] = useState(null);
  const [showAutoConfig, setShowAutoConfig] = useState(false);
  const [shinyFlash, setShinyFlash] = useState(false);

  // Componente de Estrelas para o Brilho Shiny
  const ShinySparkles = () => (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
       {[...Array(6)].map((_, i) => (
         <div key={i} 
              className="absolute text-yellow-400 text-xl animate-bounceIn" 
              style={{ 
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`, 
                top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.8
              }}>
           ⭐
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

  // Sparkle ao aparecer shiny (Jogador)
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
    return descs[move.name] || 'Golpe de status — efeito especial.';
  };

  const hpPercent = ((currentEnemy.hp || 0) / (currentEnemy.maxHp || 1)) * 100;
  const route = ROUTES[gameState.currentRoute] || ROUTES.pallet_town;
  
  // Prioridade: Background do Inimigo (Gym/Boss) > Background da Rota > Default
  const bgTheme = BATTLE_BACKGROUNDS[gameState.currentRoute] || BATTLE_BACKGROUNDS.pallet_town;
  const customBg = currentEnemy.background || route.background;
  
  // Função para formatar o BG: se for apenas um path, envolve em url(). Se for gradient ou já tiver url(), mantém.
  const formatBg = (bg) => {
    if (!bg) return null;
    if (bg.includes('gradient') || bg.includes('url(')) return bg;
    return `url('${bg}')`;
  };

  const mainBackground = formatBg(customBg) || bgTheme.sky || 'linear-gradient(180deg, #87ceeb 0%, #b0e0ff 55%, #d4f0a0 55%, #7cb850 100%)';


  return (
    <div className="flex flex-col h-full animate-fadeIn pb-4 gap-2 overflow-y-auto custom-scrollbar">
      {/* ── BARRA DE EFEITOS ATIVOS ── */}
      <ActiveEffectsBar activeEffects={gameState.activeEffects} />

      {/* ── ARENA ── */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl flex-shrink-0"
        style={{ 
          height: 220, 
          background: mainBackground,
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}>


        {/* Shiny sparkles ao redor do Pokémon */}
        {shinyFlash && !showTrainer && <ShinySparkles />}

        {/* Auto Config button */}
        <button
          onClick={() => setShowAutoConfig(true)}
          className={`absolute top-2 left-2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest backdrop-blur-md transition-all ${gameState.autoCapture || autoConfig.autoPotion ? 'bg-pokeBlue/90 border-white text-white' : 'bg-white/60 border-slate-300 text-slate-600'}`}
        >
          <div className={`w-2 h-2 rounded-full ${gameState.autoCapture || autoConfig.autoPotion ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
          Auto {gameState.autoCapture || autoConfig.autoPotion ? 'ON' : 'OFF'}
        </button>

      {/* HUD do Inimigo: Nome, Nível e HP (Delay: Só aparece após o treinador sair) */}
      <div className={`absolute top-2 right-4 min-w-[140px] transition-all duration-700 ${currentEnemy.hp > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-2xl border-l-4 border-slate-200 relative overflow-hidden">
          {showTrainer && currentEnemy.isTrainer ? (
            <div className="animate-fadeIn">
               <span className="text-[8px] font-black text-pokeGold uppercase tracking-widest block mb-0.5">Desafiante</span>
               <h4 className="text-slate-800 font-black text-[11px] uppercase truncate italic">{currentEnemy.trainerName}</h4>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center gap-2 mb-1">
                 <span className="font-black text-[10px] uppercase text-slate-800 truncate max-w-[120px]">
                    {currentEnemy.isTrainer 
                      ? `${currentEnemy.trainerName || 'Treinador'}'s ${currentEnemy.name || 'Pokémon'}` 
                      : (currentEnemy.name || 'Pokémon Selvagem')}
                    {currentEnemy.isShiny && <span className="ml-1 text-yellow-500">⭐</span>}
                 </span>
                 <span className="text-[9px] font-black text-slate-400 shrink-0">Nv.{currentEnemy.level || '??'}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden shadow-inner">
                <div className={`h-full transition-all duration-500 ${hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${hpPercent}%` }} />
              </div>
              <div className="mt-1 flex justify-end">
                 <StatusBadges status={currentEnemy.status || []} stages={currentEnemy.stages || {}} />
              </div>
            </>
          )}
        </div>
      </div>

        {/* Inimigo/Treinador — Posicionado mais embaixo para não parecer no céu */}
        <div className="absolute top-24 right-10 z-10">
          <div className="relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap">
              {(floatingTexts || []).map(f => <span key={f.id} className="block text-center font-black text-lg animate-floatUp" style={{ color: f.color, textShadow: '2px 2px 0 #000' }}>{f.text}</span>)}
            </div>
            
            {/* Brilho Shiny Localizado */}
            {shinyFlash && !showTrainer && <ShinySparkles />}

            <img
              src={
                currentEnemy.isTrainer && showTrainer 
                  ? (currentEnemy.trainerSprite || 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png') 
                  : (currentEnemy.sprite || (currentEnemy.id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentEnemy.isShiny ? 'shiny/' : ''}${currentEnemy.id}.png` : 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'))
              }
              alt={currentEnemy.name || "Pokémon"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png';
              }}
              className={`w-20 h-20 object-contain drop-shadow-xl transition-all duration-500 ${showTrainer && currentEnemy.isTrainer ? 'scale-110' : 'animate-float'} ${currentEnemy.isShiny && !showTrainer ? 'drop-shadow-[0_0_16px_rgba(234,179,8,1)]' : ''} ${currentEnemy.hp <= 0 ? 'opacity-0 scale-0' : 'opacity-100'}`}
            />
          </div>
        </div>

        {/* Jogador — base esquerda */}
        <div className="absolute bottom-2 left-2 z-10 flex items-end gap-2">
          {activePoke ? (
            <>
              <div className="relative">
                {/* Brilho Shiny do Jogador */}
                {playerShinyFlash && <ShinySparkles />}
                
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${activePoke.isShiny ? 'shiny/' : ''}${activePoke.id}.gif`}
                  className={`w-20 h-20 object-contain drop-shadow-xl ${activePoke.isShiny ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.9)]' : ''}`}
                  alt="Player"
                />
              </div>
              <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-r-4 border-pokeBlue min-w-[140px] mb-1">
                <div className="flex justify-between items-center">
                  <span className="font-black text-[10px] uppercase text-slate-800 truncate max-w-[90px]">
                    {activePoke.name}{activePoke.isShiny && <span className="ml-1 text-yellow-500">⭐</span>}
                  </span>
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

                {/* Barra de Estamina — abaixo da barra de HP do jogador */}
                {(() => {
                  const stamina = gameState.stamina?.[activePoke?.instanceId]?.value ?? 100;
                  const color  = stamina > 60 ? '#22c55e' : stamina > 30 ? '#f59e0b' : '#ef4444';
                  const emoji  = stamina > 60 ? '😊' : stamina > 30 ? '😮' : stamina > 0 ? '😰' : '😵';
                  return (
                    <div className="mt-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Energia {emoji}</span>
                        <span className="text-[8px] font-bold" style={{ color }}>{Math.floor(stamina)}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${stamina}%`, background: color }}
                        />
                      </div>
                    </div>
                  );
                })()}

                <StatusBadges status={activePoke.status || []} stages={activePoke.stages || {}} />
              </div>
            </>
          ) : <div className="text-white bg-black/50 px-3 py-2 rounded-xl italic text-[10px]">Aguardando...</div>}
        </div>
      </div>

      {/* ── ITENS ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Itens</p>
        <div className="flex gap-2">
          {[
            { id: 'pokeballs', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', label: 'Pokébolas' },
            { id: 'great_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', label: 'Great Ball' },
            { id: 'ultra_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', label: 'Ultra Ball' },
            { id: 'potions', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png', label: 'Poção' },
            { id: 'revive', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png', label: 'Reviver' },
          ].map(item => {
            const qty = (gameState.inventory?.items || {})[item.id] || 0;
            return (
              <button key={item.id} disabled={qty <= 0} onClick={() => onUseItem && onUseItem(item.id)}
                className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl border-2 transition-all active:scale-95 ${qty <= 0 ? 'opacity-30 grayscale border-slate-100 bg-slate-50' : 'border-slate-200 bg-white hover:border-pokeBlue hover:bg-blue-50'}`}>
                <img src={item.img} alt={item.label} className="w-9 h-9 object-contain drop-shadow-sm" />
                <span className="text-[10px] font-black text-slate-700">{qty}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GOLPES ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Ataques <span className="normal-case font-normal">(toque para detalhes)</span></p>
        <div className="grid grid-cols-2 gap-2">
          {(activePoke?.moves || []).map((move, index) => {
            const isActive = index === (moveIndex % (activePoke?.moves?.length || 1));
            const isSelected = selectedMove?.name === move.name;
            return (
              <div key={index}>
                <div
                  onClick={() => setSelectedMove(isSelected ? null : move)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all cursor-pointer ${isActive ? 'border-pokeYellow bg-yellow-50' : 'border-slate-100 bg-slate-50/50 opacity-60'} ${isSelected ? 'ring-2 ring-pokeBlue' : ''}`}>
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

      {/* ── TIME ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Time</p>
        <div className="flex flex-col gap-1.5">
          {[0,1,2,3,4,5].map(i => {
            const p = gameState.team[i];
            if (!p) return <div key={i} className="flex items-center gap-3 px-2 py-1.5 rounded-xl border-2 border-dashed border-slate-150 opacity-30"><div className="w-10 h-10 bg-slate-100 rounded-lg" /><span className="text-[9px] text-slate-400 font-bold">Vazio</span></div>;
            const isActive = activeMemberIndex === i;
            const hpPct = (p.hp / p.maxHp) * 100;
            const xpPct = Math.min(100, ((p.xp || 0) / ((p.level || 5) * 50)) * 100);
            const fainted = p.hp <= 0;
            return (
              <div key={i} onClick={() => { if (!fainted && !isActive) { setGameState(prev => ({ ...prev, team: prev.team.map((pk, idx) => idx === i || idx === activeMemberIndex ? { ...pk, stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } } : pk) })); setActiveMemberIndex(i); } }}
                className={`flex items-center gap-3 px-2 py-1.5 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] ${isActive ? 'border-pokeBlue bg-blue-50' : fainted ? 'border-red-100 bg-red-50/50 opacity-50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}>
                <div className="relative flex-shrink-0">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`} className={`w-10 h-10 object-contain ${fainted ? 'grayscale' : ''} ${p.isShiny ? 'drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]' : ''}`} alt={p.name} />
                  {isActive && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-pokeBlue rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase text-slate-800 truncate">
                      {p.name}{p.isShiny && <span className="ml-1 text-yellow-500 text-[9px]">⭐</span>}
                    </span>
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

      {/* ── BATALHAS ESPECIAIS ── */}
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

      {/* ── MODAL AUTO-CONFIG ── */}
      {showAutoConfig && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={() => setShowAutoConfig(false)}>
          <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl animate-bounceIn overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            {/* Header Fixo */}
            <div className="flex-shrink-0 px-8 pt-8 pb-4 flex items-center justify-between">
              <h3 className="font-black text-slate-800 uppercase italic text-xl">⚙️ Auto-Itens</h3>
              <button onClick={() => setShowAutoConfig(false)} className="text-slate-300 hover:text-slate-500 font-black text-2xl transition-colors">✕</button>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-2 flex flex-col gap-5">
              {/* Auto Captura */}
              <div className="flex items-center justify-between bg-blue-50 p-5 rounded-3xl border-2 border-blue-100 shadow-sm">
                <div>
                  <p className="font-black text-slate-800 text-sm uppercase tracking-tighter">🎯 Auto-Captura</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-bold">Usa Pokébolas automaticamente</p>
                </div>
                <div className="relative cursor-pointer" onClick={() => setGameState(prev => ({ ...prev, autoCapture: !prev.autoCapture }))}>
                  <div className={`w-14 h-7 rounded-full transition-all duration-300 ${gameState.autoCapture ? 'bg-pokeBlue' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${gameState.autoCapture ? 'translate-x-8' : 'translate-x-1'}`} />
                  </div>
                </div>
              </div>

              {/* Auto Poção */}
              <div className="bg-green-50 p-5 rounded-3xl border-2 border-green-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-black text-slate-800 text-sm uppercase tracking-tighter">💊 Auto-Poção</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-bold">Usa poção quando HP baixo</p>
                  </div>
                  <div className="relative cursor-pointer" onClick={() => setGameState(prev => ({ ...prev, autoConfig: { ...prev.autoConfig, autoPotion: !autoConfig.autoPotion } }))}>
                    <div className={`w-14 h-7 rounded-full transition-all duration-300 ${autoConfig.autoPotion ? 'bg-green-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${autoConfig.autoPotion ? 'translate-x-8' : 'translate-x-1'}`} />
                    </div>
                  </div>
                </div>
                {autoConfig.autoPotion && (
                  <div className="mt-2 bg-white/50 p-3 rounded-2xl border border-green-200">
                    <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Usar quando HP ≤ {autoConfig.autoPotionHpPct}%</p>
                    <input type="range" min={10} max={80} step={5} value={autoConfig.autoPotionHpPct}
                      onChange={e => setGameState(prev => ({ ...prev, autoConfig: { ...prev.autoConfig, autoPotionHpPct: Number(e.target.value) } }))}
                      className="w-full accent-green-500 h-2 bg-green-100 rounded-lg appearance-none cursor-pointer" />
                    <div className="flex justify-between text-[9px] text-slate-400 font-black mt-2 uppercase tracking-tighter">
                      <span>Mínimo 10%</span><span>{autoConfig.autoPotionHpPct}%</span><span>Máximo 80%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pokémon-foco */}
              {autoConfig.autoPotion && gameState.team?.filter(Boolean).length > 0 && (
                <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-100 shadow-sm mb-2">
                  <p className="text-[11px] font-black text-slate-800 uppercase mb-4 tracking-tighter">💉 Focar Poção em:</p>
                  <div className="flex flex-col gap-2">
                    {gameState.team.map((p, i) => p ? (
                      <button key={i} onClick={() => setGameState(prev => ({ ...prev, autoConfig: { ...prev.autoConfig, focusPokemonIndex: i } }))}
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl border-2 transition-all text-left group ${autoConfig.focusPokemonIndex === i ? 'border-pokeBlue bg-blue-50 shadow-md scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${autoConfig.focusPokemonIndex === i ? 'bg-white' : 'bg-slate-50'}`}>
                          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} className="w-9 h-9 object-contain" alt={p.name} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black uppercase text-slate-800 tracking-tighter">{p.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Slot #{i+1} · Nv.{p.level || 5}</p>
                        </div>
                        {autoConfig.focusPokemonIndex === i && <div className="text-pokeBlue font-black text-xs">✓</div>}
                      </button>
                    ) : null)}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Fixo */}
            <div className="flex-shrink-0 p-8 pt-4">
              <button onClick={() => setShowAutoConfig(false)}
                className="w-full bg-slate-800 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-700 active:scale-95 transition-all">
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

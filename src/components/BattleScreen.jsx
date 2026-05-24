import React, { useState, useEffect, useRef } from 'react';
import MoveAnimationLayer from './MoveAnimationLayer';
import { StatusBadges } from './CommonUI';
import { BATTLE_BACKGROUNDS, getRouteBg } from '../data/battleBackgrounds';
import ActiveEffectsBar from './ActiveEffectsBar';
import { MOVES } from '../data/moves';
import { MOVE_TRANSLATIONS } from '../data/translations';
import { TIME_CONFIG } from '../utils/timeSystem';
import { WEATHER_TYPES } from '../data/weather';
import { getPokemonSpriteFallbackUrl, getPokemonSpriteUrl } from '../utils/pokemonSprites';
import CaptureAnimation from './CaptureAnimation';
import ShinyEncounterEffect from './effects/ShinyEncounterEffect';
import PokemonEntranceEffect from './effects/PokemonEntranceEffect';

const BattleScreen = ({
  currentEnemy, gameState, activeMemberIndex, moveIndex, weather,
  setActiveMemberIndex, addLog, battleLog, floatingTexts,
  onUseItem, setGameState, setShowAutoCaptureModal, ROUTES, fixPath, TYPE_COLORS, onGoToCity, onChallengeBoss,
  timeOfDay, showAutoConfigExternal = false, setShowAutoConfigExternal, bossTimer, currentLevelCap = 100,
  captureEvent, onCaptureDone,
  manualBattle = false, isManualActing = false, onManualAttack,
}) => {
  const activePoke = gameState.team?.[activeMemberIndex];
  const autoConfig = gameState.autoCaptureConfig || { autoCapture: false, autoPotion: false, hpThreshold: 30, staminaThreshold: 30, autoStamina: false };

  const [showTrainer, setShowTrainer] = useState(true);
  const [selectedMove, setSelectedMove] = useState(null);
  const [showAutoConfig, setShowAutoConfig] = useState(false);
  const [shinyFlash, setShinyFlash] = useState(false);
  const [itemCategory, setItemCategory] = useState('capture');
  const animLayerRef = useRef(null);
  const playerSpriteRef = useRef(null);
  const enemySpriteRef = useRef(null);
  const [screenShake, setScreenShake] = useState(false);
  const [statReactions, setStatReactions] = useState([]);
  const [ballAnim, setBallAnim] = useState(null);
  const [showVignette, setShowVignette] = useState(false);

  // Escuta eventos de golpe disparados pelo AppRoot
  useEffect(() => {
    const onMove = (e) => {
      const detail = e.detail || {};
      const { name, type, direction, moveKey } = detail;
      const moveData = moveKey ? MOVES[moveKey] : null;
      
      const triggerReaction = (target, type) => {
        const ref = target === 'player' ? playerSpriteRef : enemySpriteRef;
        if (!ref.current) return;
        ref.current.classList.remove('reaction-lunge-p', 'reaction-lunge-e', 'reaction-shake', 'reaction-flicker');
        void ref.current.offsetWidth; // trigger reflow
        ref.current.classList.add(type);
        setTimeout(() => ref.current?.classList.remove(type), 500);
      };

      const handleAttack = () => {
        const attacker = direction === 'player-to-enemy' ? 'player' : 'enemy';
        triggerReaction(attacker, attacker === 'player' ? 'reaction-lunge-p' : 'reaction-lunge-e');
      };

      const handleHit = () => {
        if (detail.missed) return;
        const target = direction === 'player-to-enemy' ? 'enemy' : 'player';
        triggerReaction(target, 'reaction-shake');
        if (!detail.noEffect && detail.effectiveness !== 0) triggerReaction(target, 'reaction-flicker');

        if (detail.critical || detail.effectiveness > 1 || (detail.damage || 0) >= 80) {
          setScreenShake(true);
          setTimeout(() => setScreenShake(false), detail.critical ? 420 : 260);
        }

        // Trigger stat arrows if any
        if (moveData?.statChanges) {
          const newReactions = moveData.statChanges.map(sc => ({
            id: Math.random(),
            target: moveData.target === 'enemy' ? (direction === 'player-to-enemy' ? 'enemy' : 'player') : (direction === 'player-to-enemy' ? 'player' : 'enemy'),
            stat: sc.stat,
            change: sc.change > 0 ? 'up' : 'down'
          }));
          setStatReactions(prev => [...prev, ...newReactions]);
          setTimeout(() => {
            setStatReactions(prev => prev.filter(r => !newReactions.find(nr => nr.id === r.id)));
          }, 1500);
        }

        // Elite Move Vignette
        const eliteKeywords = ['pump', 'thrower', 'blast', 'earthquake', 'storm', 'hyper', 'origin', 'meteor', 'v-create'];
        if (eliteKeywords.some(kw => String(name || '').toLowerCase().includes(kw)) || detail.critical) {
          setShowVignette(true);
          setTimeout(() => setShowVignette(false), 800);
        }
      };

      animLayerRef.current?.play(name, type, direction, moveKey, handleHit, handleAttack, detail);
    };
    window.addEventListener('pokemove', onMove);
    return () => window.removeEventListener('pokemove', onMove);
  }, []);

  const isAutoPanelOpen = showAutoConfig || showAutoConfigExternal;
  const closeAutoPanel = () => {
    setShowAutoConfig(false);
    setShowAutoConfigExternal && setShowAutoConfigExternal(false);
  };
  const updateAutoConfig = (patch) => {
    setGameState(prev => ({
      ...prev,
      autoCaptureConfig: { ...(prev.autoCaptureConfig || {}), ...patch },
    }));
  };

  const GearIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" aria-hidden="true">
      <path d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l2-1.35-2-3.46-2.36.98a8.04 8.04 0 0 0-2.6-1.5L14.1 2.6h-4l-.35 2.57a8.04 8.04 0 0 0-2.6 1.5l-2.36-.98-2 3.46 2 1.35a7.8 7.8 0 0 0 0 3l-2 1.35 2 3.46 2.36-.98a8.04 8.04 0 0 0 2.6 1.5l.35 2.57h4l.35-2.57a8.04 8.04 0 0 0 2.6-1.5l2.36.98 2-3.46-2-1.35Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
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

  // Ball entrance animation — triggered when active pokémon changes (e.g. switched in battle)
  useEffect(() => {
    if (!activePoke?.ball) return;
    setBallAnim(activePoke.ball);
    const t = setTimeout(() => setBallAnim(null), 1000);
    return () => clearTimeout(t);
  }, [activePoke?.instanceId]);

  if (!currentEnemy) return <div className="h-full flex items-center justify-center"><p className="font-black uppercase text-slate-400 animate-pulse text-sm">Procurando...</p></div>;

  const getMoveDesc = (move) => {
    if (!move) return '';
    if (move.power > 0 || move.category === 'Physical' || move.category === 'Special' || move.category === 'physical' || move.category === 'special') {
      return `Causa dano ${ (move.category === 'Special' || move.category === 'special') ? 'especial' : 'físico'} ${move.power > 0 ? `com poder ${move.power}` : 'com efeito de dano fixo'}.`;
    }
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
  const bgTheme = getRouteBg(gameState.currentRoute);
  const customBg = currentEnemy.background || route.background;
  
  const formatBg = (bg) => {
    if (!bg) return null;
    if (bg.includes('gradient')) return bg;
    
    // Se for uma chave de BATTLE_BACKGROUNDS (ex: villain_galactic), pega a imagem sky
    if (BATTLE_BACKGROUNDS[bg]) {
      const bData = BATTLE_BACKGROUNDS[bg];
      return bData.sky ? formatBg(bData.sky) : null;
    }

    // Extrai o caminho de dentro de url() se existir
    let path = bg;
    if (bg.includes('url(')) {
      const match = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (match) path = match[1];
    }
    
    // Aplica fixPath para garantir compatibilidade com subdiretórios (GH Pages)
    const fixedPath = fixPath(path);
    return `url('${fixedPath}')`;
  };

  const mainBackground = formatBg(customBg) || bgTheme.sky || 'linear-gradient(180deg, #87ceeb 0%, #b0e0ff 55%, #d4f0a0 55%, #7cb850 100%)';

  return (
    <div className={`flex flex-col h-full animate-fadeIn pb-4 gap-2 overflow-y-auto custom-scrollbar ${screenShake ? 'battle-screen-shake' : ''}`} style={{paddingTop: '8px'}}>
      {/* Nome da Rota e Botão Sair */}
      <div className="flex items-center justify-between px-2 mb-1 animate-fadeIn">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Localização:</span>
          <span className="text-[11px] font-black uppercase tracking-tighter text-slate-800">{currentEnemy.locationName || route.name}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-pokeBlue">Cap Nv.{currentLevelCap}</span>
        </div>
        <button 
          onClick={() => onGoToCity && onGoToCity()}
          className="bg-slate-100 hover:bg-slate-200 text-slate-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-slate-200"
        >
          Sair da Rota
        </button>
      </div>

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

        {/* Environmental Vignette */}
        {showVignette && <div className="screen-vignette" />}
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{ background: TIME_CONFIG[timeOfDay]?.overlayColor || 'transparent', transition: 'background 2s ease' }}
        />

        {/* ── Animação de captura ── */}
        {captureEvent && (
          <CaptureAnimation
            captureEvent={captureEvent}
            onDone={onCaptureDone}
          />
        )}

        {currentEnemy?.isShiny && !showTrainer && (
          <ShinyEncounterEffect active={shinyFlash} persistent />
        )}

        {/* ── Indicador de Clima ── */}
        {weather && weather !== 'none' && WEATHER_TYPES[weather] && (
          <div
            className="absolute top-2 left-2 z-[15] flex items-center gap-1.5 rounded-full px-2.5 py-1 pointer-events-none animate-fadeIn"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: `1px solid ${WEATHER_TYPES[weather].color}55` }}
          >
            <span style={{ fontSize: 14 }}>{WEATHER_TYPES[weather].icon}</span>
            <span style={{ color: WEATHER_TYPES[weather].color, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              {WEATHER_TYPES[weather].label}
            </span>
          </div>
        )}

        {/* WORLD BOSS HUD - GIGANTE NO TOPO */}
        {currentEnemy.isWorldBoss && (
          <div className="absolute top-4 left-4 right-4 z-[15] animate-fadeIn">
            <div className="flex justify-between items-end mb-1 px-2">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-400 drop-shadow-md animate-pulse">
                  DESAFIO WORLD BOSS: {currentEnemy.bossType}
                </span>
                <h2 className="text-lg font-black text-white uppercase italic leading-none drop-shadow-md">
                  {currentEnemy.trainerName || currentEnemy.pokemonName || currentEnemy.name}
                </h2>
                {activePoke?.heldItem !== 'penetration_pendant' ? (
                  <span className="text-[8px] font-black text-white bg-red-600/80 px-2 py-0.5 rounded border border-red-400 mt-1 uppercase tracking-widest inline-block self-start shadow-md animate-pulse">
                    🛡️ Escudo Mítico Ativo (-90% Dano)
                  </span>
                ) : (
                  <span className="text-[8px] font-black text-white bg-emerald-600/80 px-2 py-0.5 rounded border border-emerald-400 mt-1 uppercase tracking-widest inline-block self-start shadow-md">
                    ⚔️ Escudo Quebrado (Penetration Pendant)
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-amber-500 italic drop-shadow-md">LV ???</span>
              </div>
            </div>
            
            {/* Giant Segmented HP Bar */}
            <div className="h-6 bg-black/60 rounded-full p-1 border-2 border-amber-600/50 backdrop-blur-sm relative overflow-hidden shadow-2xl">
               <div 
                 className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
                 style={{ 
                   width: `${hpPercent}%`,
                   background: 'linear-gradient(90deg, #dc2626 0%, #f59e0b 50%, #dc2626 100%)',
                   backgroundSize: '200% 100%',
                 }}
               >
                 <div className="absolute inset-0 boss-bar-animation"></div>
                 {/* Segments */}
                 <div className="absolute inset-0 flex">
                   {[...Array(10)].map((_, i) => (
                     <div key={i} className="flex-1 border-r border-black/20" />
                   ))}
                 </div>
               </div>
            </div>
            <div className="flex justify-end mt-1 px-2">
               <span className="text-[10px] font-black text-white/60 tabular-nums">
                 {currentEnemy.hp.toLocaleString()} / {currentEnemy.maxHp.toLocaleString()}
               </span>
            </div>
          </div>
        )}

        {/* HUD INIMIGO - Canto Superior Esquerdo */}
        <div style={{
          position: 'absolute',
          top: currentEnemy.isWorldBoss ? '80px' : '12px',
          left: '12px',
          right: 'auto',
          background: 'rgba(255,255,255,0.92)',
          borderRadius: '12px',
          padding: '6px 10px',
          minWidth: '160px',
          maxWidth: '180px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          boxSizing: 'border-box',
          zIndex: 10,
          opacity: currentEnemy.hp > 0 ? 1 : 0,
          transition: 'opacity 0.7s',
        }}>
          <p style={{
            fontSize: '11px', fontWeight: 900,
            textTransform: 'uppercase', color: '#1e293b',
            overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', marginBottom: '2px',
          }}>
            {currentEnemy?.pokemonName || currentEnemy?.name} {currentEnemy?.isShiny && '✨'} <span style={{fontWeight:500, fontSize:'10px'}}>Nv.{currentEnemy?.level}{currentEnemy?.isWildBoss && ' 💀'}</span>
          </p>
          {/* Barra HP */}
          <div style={{marginBottom:'2px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2px'}}>
              <span style={{fontSize:'9px', fontWeight:700, color:'#64748b'}}>HP</span>
              <span style={{fontSize:'9px', fontWeight:700, color:'#64748b'}}>
                {currentEnemy?.hp}/{currentEnemy?.maxHp}
              </span>
            </div>
            <div style={{height:'4px', background:'#e2e8f0', borderRadius:'999px', overflow:'hidden'}}>
              <div style={{
                height:'100%', borderRadius:'999px', transition:'width 0.3s',
                background: (currentEnemy?.hp/currentEnemy?.maxHp) > 0.5 ? '#22c55e' :
                            (currentEnemy?.hp/currentEnemy?.maxHp) > 0.25 ? '#f59e0b' : '#ef4444',
                width: `${Math.max(0, Math.min(100, (currentEnemy?.hp / currentEnemy?.maxHp) * 100))}%`,
              }} />
            </div>
          </div>
          <div style={{marginTop: '4px', minHeight: '12px'}}>
            <StatusBadges status={currentEnemy.status || []} stages={currentEnemy.stages || {}} />
          </div>
        </div>

        {/* ENRAGE TIMER - Centro Topo */}
        {currentEnemy.isWorldBoss && bossTimer !== null && (
          <div className="absolute top-[100px] left-1/2 -translate-x-1/2 z-[20] flex flex-col items-center pointer-events-none">
            <div className={`px-4 py-1.5 rounded-full backdrop-blur-md border-2 ${bossTimer <= 30 ? 'border-red-500 bg-red-500/20 animate-pulse' : 'border-amber-500/50 bg-black/40'} flex items-center gap-2 transition-colors`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${bossTimer <= 30 ? 'text-red-400' : 'text-amber-500'}`}>Enrage in</span>
              <span className={`text-xl font-black tabular-nums ${bossTimer <= 30 ? 'text-white' : 'text-amber-400'} drop-shadow-md`}>
                {Math.floor(bossTimer / 60)}:{String(bossTimer % 60).padStart(2, '0')}
              </span>
            </div>
            {bossTimer <= 10 && bossTimer > 0 && (
               <div className="mt-2 text-red-500 font-black text-3xl animate-bounce tracking-tighter drop-shadow-lg">
                 {bossTimer}
               </div>
            )}
          </div>
        )}

        {/* SPRITE INIMIGO - Quadrante Superior Direito */}
        <div ref={enemySpriteRef} className="absolute top-12 right-10 z-10 w-24 h-24 flex items-center justify-center">
          {statReactions.filter(r => r.target === 'enemy').map(r => (
            <div key={r.id} className={`absolute z-30 stat-arrow-${r.change}`}>
              {r.change === 'up' ? '▲' : '▼'}
              <span className="text-[8px] ml-0.5">{r.stat.toUpperCase()}</span>
            </div>
          ))}
          <div className="relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap">
              {(floatingTexts || []).filter(f => !f.target || f.target === 'enemy').map(f => <span key={f.id} className="block text-center font-black text-lg animate-floatUp" style={{ color: f.color, textShadow: '2px 2px 0 #000' }}>{f.text}</span>)}
            </div>
            <img
              src={
                currentEnemy.isTrainer && showTrainer 
                  ? (currentEnemy.trainerSprite || 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png') 
                  : (currentEnemy.sprite || (currentEnemy.id ? getPokemonSpriteUrl(currentEnemy) : 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'))
              }
              alt={currentEnemy.name || "Pokémon"}
              onError={e => {
                const target = e.target;
                if (!target.dataset.triedFallback && currentEnemy.id) {
                  target.dataset.triedFallback = '1';
                  target.src = getPokemonSpriteFallbackUrl(currentEnemy);
                }
              }}
              className={`w-full h-full object-contain drop-shadow-xl transition-all duration-500 ${showTrainer && currentEnemy.isTrainer ? 'scale-110' : currentEnemy.isWildBoss ? 'scale-125 animate-float' : 'animate-float'} ${currentEnemy.isShiny && !showTrainer ? 'drop-shadow-[0_0_16px_rgba(234,179,8,1)]' : ''} ${currentEnemy.hp <= 0 ? 'opacity-0 scale-0' : 'opacity-100'}`}
            />
          </div>
        </div>

        {/* HUD JOGADOR - Canto Inferior Direito */}
        <div className="absolute bottom-3 right-3 z-10">
          {activePoke ? (
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              left: 'auto',
              background: 'rgba(255,255,255,0.92)',
              borderRadius: '8px',
              padding: '4px 7px',
              minWidth: '130px',
              maxWidth: '145px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
            }}>
              {/* Nome e Nível */}
              <p style={{
                fontSize: '9px', fontWeight: 900,
                textTransform: 'uppercase', color: '#1e293b',
                overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', marginBottom: '2px',
              }}>
                {activePoke?.name} {activePoke?.isShiny && '✨'} <span style={{fontWeight:500, fontSize:'8px'}}>Nv.{activePoke?.level}</span>
              </p>

              {/* HP — label + barra na mesma linha */}
              <div style={{display:'flex', alignItems:'center', gap:'4px', marginBottom:'1px'}}>
                <span style={{fontSize:'7px', fontWeight:700, color:'#64748b', width:'12px', flexShrink:0}}>HP</span>
                <div style={{flex:1, height:'3px', background:'#e2e8f0', borderRadius:'999px', overflow:'hidden'}}>
                  <div style={{
                    height:'100%', borderRadius:'999px', transition:'width 0.3s',
                    background: (activePoke?.hp/activePoke?.maxHp) > 0.5 ? '#22c55e' :
                                (activePoke?.hp/activePoke?.maxHp) > 0.25 ? '#f59e0b' : '#ef4444',
                    width: `${Math.max(0, Math.min(100, (activePoke?.hp/activePoke?.maxHp)*100))}%`,
                  }}/>
                </div>
                <span style={{fontSize:'7px', fontWeight:700, color:'#64748b', flexShrink:0}}>
                  {activePoke?.hp}/{activePoke?.maxHp}
                </span>
              </div>

              {/* XP — label + barra na mesma linha */}
              <div style={{display:'flex', alignItems:'center', gap:'4px', marginBottom:'1px'}}>
                <span style={{fontSize:'7px', fontWeight:700, color:'#64748b', width:'12px', flexShrink:0}}>XP</span>
                <div style={{flex:1, height:'2px', background:'#e2e8f0', borderRadius:'999px', overflow:'hidden'}}>
                  <div style={{
                    height:'100%', borderRadius:'999px', background:'#3b82f6', transition:'width 0.3s',
                    width: `${Math.max(0, Math.min(100, ((activePoke?.xp||0)/(Math.pow((activePoke?.level||1)+1,3)-Math.pow(activePoke?.level||1,3)))*100))}%`,
                  }}/>
                </div>
              </div>

              {/* Energia — label + barra na mesma linha */}
              {(() => {
                const stamina = gameState.stamina?.[activePoke?.instanceId]?.value ?? 100;
                const color = stamina > 60 ? '#22c55e' : stamina > 30 ? '#f59e0b' : '#ef4444';
                return (
                  <div style={{display:'flex', alignItems:'center', gap:'4px', marginBottom:'1px'}}>
                    <span style={{fontSize:'7px', fontWeight:700, color:'#64748b', width:'12px', flexShrink:0}}>EN</span>
                    <div style={{flex:1, height:'2px', background:'#e2e8f0', borderRadius:'999px', overflow:'hidden'}}>
                      <div style={{height:'100%', borderRadius:'999px', background:color, transition:'width 0.3s', width:`${stamina}%`}}/>
                    </div>
                    <span style={{fontSize:'7px', fontWeight:700, color, flexShrink:0}}>{Math.floor(stamina)}%</span>
                  </div>
                );
              })()}
              
              {/* Status e Exaustão */}
              <div style={{marginTop: '1px', minHeight: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <StatusBadges status={activePoke.status || []} stages={activePoke.stages || {}} />
                {gameState.stamina?.[activePoke?.instanceId]?.value <= 0 && (
                  <span style={{color:'#ef4444', fontSize:'6px', fontWeight:900, textTransform:'uppercase', animation:'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}>😵 Exausto</span>
                )}
              </div>
            </div>
          ) : <div style={{color:'white', background:'rgba(0,0,0,0.5)', padding:'8px 12px', borderRadius:'12px', fontStyle:'italic', fontSize:'10px'}}>Aguardando...</div>}
        </div>

        {/* SPRITE JOGADOR - Quadrante Inferior Esquerdo */}
        <div ref={playerSpriteRef} className="absolute bottom-2 left-6 z-10 w-24 h-24 flex items-center justify-center">
          {statReactions.filter(r => r.target === 'player').map(r => (
            <div key={r.id} className={`absolute z-30 stat-arrow-${r.change}`}>
              {r.change === 'up' ? '▲' : '▼'}
              <span className="text-[8px] ml-0.5">{r.stat.toUpperCase()}</span>
            </div>
          ))}
          {activePoke && (
            <div className="relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap">
                {(floatingTexts || []).filter(f => f.target === 'player').map(f => <span key={f.id} className="block text-center font-black text-lg animate-floatUp" style={{ color: f.color, textShadow: '2px 2px 0 #000' }}>{f.text}</span>)}
              </div>
              {activePoke?.isShiny && (
                <ShinyEncounterEffect active={playerShinyFlash} persistent compact />
              )}
              {ballAnim && (
                <PokemonEntranceEffect ballId={ballAnim} />
              )}
              <img
                src={
                  activePoke.isMega && activePoke.megaShowdownId
                    ? `https://play.pokemonshowdown.com/sprites/dex-back/${activePoke.megaShowdownId}.png`
                    : activePoke.formKey || activePoke.id >= 650
                      ? getPokemonSpriteUrl(activePoke, { back: true })
                      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${activePoke.isShiny ? 'shiny/' : ''}${activePoke.id}.gif`
                }
                onError={e => {
                  const target = e.target;
                  const isMega = activePoke.isMega && activePoke.megaShowdownId;

                  // Fallback mega back → sprite base
                  if (isMega && !target.dataset.triedStaticMega) {
                    target.dataset.triedStaticMega = '1';
                    target.src = getPokemonSpriteUrl(activePoke, { back: true });
                    return;
                  }

                  // Se tudo Mega falhou (ou não é mega), tenta o sprite base estático - BACK
                  if (!target.dataset.triedBase) {
                    target.dataset.triedBase = '1';
                    target.src = getPokemonSpriteUrl(activePoke, { back: true });
                    return;
                  }

                  // Gen 6+ não tem back sprite no PokeAPI — usa sprite frontal como último recurso
                  if (!target.dataset.triedFront) {
                    target.dataset.triedFront = '1';
                    target.src = getPokemonSpriteUrl(activePoke);
                  }
                }}
                className={`w-full h-full object-contain drop-shadow-xl ${activePoke.isShiny ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.9)]' : ''} ${activePoke.isMega ? 'drop-shadow-[0_0_14px_rgba(124,58,237,0.7)]' : ''}`}
                alt="Player"
              />
            </div>
          )}
        </div>
        
        {/* Camada de animações de golpe */}
        <MoveAnimationLayer ref={animLayerRef} />
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
              { id: 'x_defense', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-defense.png', label: 'X-Def', src: 'items' },
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
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
          {manualBattle ? '⚔️ Golpes' : 'Ataques'}{' '}
          <span className="normal-case font-normal">
            {manualBattle ? '(toque para atacar)' : '(toque para detalhes)'}
          </span>
        </p>

        {/* Indicador de turno — visível apenas no modo manual */}
        {manualBattle && (
          <div
            className="flex items-center justify-center gap-2 py-1.5 rounded-xl text-[10px] font-black mb-2 transition-all"
            style={{
              background: isManualActing
                ? 'rgba(239,68,68,0.12)'
                : 'rgba(34,197,94,0.12)',
              color: isManualActing ? '#ef4444' : '#16a34a',
            }}
          >
            {isManualActing ? '⏳ Inimigo respondendo...' : '🟢 Sua vez! Escolha um golpe'}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {(activePoke?.moves || []).map((moveRef, index) => {
            const moveName = typeof moveRef === 'string' ? moveRef : moveRef.name;
            const moveKey = moveName.toLowerCase().replace(/ /g, '-');
            const moveData = { ...MOVES[moveKey], ...(typeof moveRef === 'object' ? moveRef : {}) };
            const moveLabel = MOVE_TRANSLATIONS[moveKey] || moveData.name || moveName;

            const isActive = index === (moveIndex % (activePoke?.moves?.length || 1));
            const isSelected = selectedMove?.name === moveData.name;

            // No modo manual, clique ataca; fora do modo manual, clique mostra detalhes
            const handleClick = () => {
              if (manualBattle) {
                if (!isManualActing) onManualAttack?.(index);
              } else {
                setSelectedMove(isSelected ? null : moveData);
              }
            };

            // Estilo do botão de golpe varia conforme o modo
            const manualHighlight = manualBattle && !isManualActing;
            const manualDisabled  = manualBattle && isManualActing;

            return (
              <div key={index}>
                <div
                  onClick={handleClick}
                  className={`flex items-center gap-2 px-3 py-4 rounded-xl border-2 transition-all min-h-[64px]
                    ${manualHighlight
                      ? 'border-blue-400 bg-blue-50 cursor-pointer hover:brightness-95 active:scale-[0.97] ring-1 ring-blue-200'
                      : manualDisabled
                        ? 'border-slate-200 bg-slate-100 opacity-40 cursor-not-allowed'
                        : isActive
                          ? 'border-pokeYellow bg-yellow-50 cursor-pointer'
                          : 'border-slate-100 bg-slate-50/50 opacity-60 cursor-pointer'
                    }
                    ${!manualBattle && isSelected ? 'ring-2 ring-pokeBlue' : ''}
                  `}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    manualHighlight ? 'bg-blue-400' :
                    manualDisabled  ? 'bg-slate-300' :
                    isActive        ? 'bg-pokeYellow' : 'bg-slate-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase text-slate-800 truncate leading-none">{moveLabel}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`${TYPE_COLORS[moveData.type] || 'bg-slate-400'} text-white text-[7px] font-black px-1.5 py-0.5 rounded-full`}>{moveData.type}</span>
                      {(moveData.power > 0) && <span className="text-[8px] text-slate-400 font-bold uppercase">PWR {moveData.power}</span>}
                      {(moveData.power === 0 && (moveData.category === 'Physical' || moveData.category === 'Special' || moveData.category === 'physical' || moveData.category === 'special')) && <span className="text-[8px] text-red-400 font-bold uppercase">ESPECIAL</span>}
                      {(moveData.power === 0 && (moveData.category === 'Status' || moveData.category === 'status')) && <span className="text-[8px] text-purple-400 font-bold uppercase">STATUS</span>}
                    </div>
                  </div>
                </div>
                {!manualBattle && isSelected && (
                  <div className="mt-1 px-3 py-2 bg-blue-50 border-2 border-pokeBlue rounded-xl text-[9px] text-slate-700 font-bold leading-tight animate-fadeIn">
                    {getMoveDesc(moveData)}
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
                  <img src={getPokemonSpriteUrl(p)} className={`w-10 h-10 object-contain ${blocked ? 'grayscale' : ''} ${p.isShiny ? 'drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]' : ''}`} alt={p.name} />
                  {isActive && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-pokeBlue rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[11px] font-black uppercase text-slate-800 truncate leading-tight">{p.name}{p.isShiny && ' ✨'}</span>
                    <span className={`text-[9px] font-bold flex-shrink-0 ${isActive ? 'text-pokeBlue' : 'text-slate-400'}`}>Nv.{p.level || 5}</span>
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



    </div>
  );
};

export default BattleScreen;

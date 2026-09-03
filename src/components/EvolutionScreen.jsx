import React, { useState, useEffect, useRef } from 'react';
import { getEvolutionCandyInfo } from '../utils/evolutionRequirements';
import { getCandyIconUrl } from '../data/candies';

// Sprite estático (PokeAPI); shiny quando aplicável.
const EVO_SPRITE = (id, shiny) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shiny ? 'shiny/' : ''}${id}.png`;

// ── Cinemática de evolução (estilo dos jogos): silhuetas piscando acelerando →
//    flash → revelação em cores com estrelas. Conclui sozinha (chama onDone). ──
const EvolutionCinematic = ({ fromId, toId, toName, isShiny, onDone }) => {
  const [phase, setPhase] = useState('morph'); // morph → flash → reveal
  const [showEvo, setShowEvo] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Morph: alterna as silhuetas num ritmo que acelera (~3s).
  useEffect(() => {
    if (phase !== 'morph') return;
    let timer;
    let delay = 550;
    let elapsed = 0;
    let toggle = false;
    const tick = () => {
      toggle = !toggle;
      setShowEvo(toggle);
      elapsed += delay;
      delay = Math.max(90, delay * 0.8);
      if (elapsed >= 3000) { setPhase('flash'); return; }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [phase]);

  // Flash → reveal; reveal → conclui.
  useEffect(() => {
    if (phase === 'flash') {
      const t = setTimeout(() => setPhase('reveal'), 380);
      return () => clearTimeout(t);
    }
    if (phase === 'reveal') {
      const t = setTimeout(() => { if (onDoneRef.current) onDoneRef.current(); }, 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const silhouetteId = showEvo ? toId : fromId;

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center overflow-hidden"
      style={{
        background: phase === 'flash'
          ? '#ffffff'
          : 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 70%, #020617 100%)',
        transition: 'background 0.2s',
      }}
    >
      <style>{`
        @keyframes evoGlow { 0%,100%{box-shadow:0 0 40px 18px rgba(255,255,255,0.22);} 50%{box-shadow:0 0 90px 45px rgba(255,255,255,0.6);} }
        @keyframes evoStar { 0%{opacity:1;transform:translate(0,0) scale(1);} 100%{opacity:0;transform:translate(var(--sx),var(--sy)) scale(0.2);} }
        @keyframes evoReveal { 0%{opacity:0;transform:scale(0.4);} 60%{opacity:1;transform:scale(1.15);} 100%{opacity:1;transform:scale(1);} }
        @keyframes evoText { 0%{opacity:0;transform:translateY(14px);} 100%{opacity:1;transform:translateY(0);} }
      `}</style>

      {(phase === 'morph' || phase === 'flash') && (
        <div style={{ position: 'relative', width: 210, height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', animation: 'evoGlow 1.2s ease-in-out infinite' }}>
          <img
            src={EVO_SPRITE(silhouetteId, isShiny)}
            alt=""
            style={{
              width: showEvo ? 200 : 156, height: showEvo ? 200 : 156,
              objectFit: 'contain', imageRendering: 'pixelated',
              filter: 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(255,255,255,0.85))',
              transition: 'width 0.1s, height 0.1s',
            }}
          />
        </div>
      )}

      {phase === 'reveal' && (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'absolute', top: 100, left: '50%', width: 0, height: 0 }}>
            {[...Array(12)].map((_, i) => {
              const a = (i / 12) * 360;
              const d = 70 + Math.random() * 40;
              const sx = Math.cos((a * Math.PI) / 180) * d + 'px';
              const sy = Math.sin((a * Math.PI) / 180) * d + 'px';
              const size = 8 + (i % 3) * 5;
              const colors = ['#fbbf24', '#f59e0b', '#fde68a', '#ffffff', '#a3e635'];
              return (
                <div key={i} style={{
                  position: 'absolute', width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
                  background: colors[i % colors.length], borderRadius: i % 2 ? '2px' : '50%',
                  animation: `evoStar 0.9s ease-out ${0.04 * i}s forwards`, '--sx': sx, '--sy': sy,
                }} />
              );
            })}
          </div>
          <img
            src={EVO_SPRITE(toId, isShiny)}
            alt={toName}
            style={{
              width: 210, height: 210, objectFit: 'contain', imageRendering: 'pixelated',
              animation: 'evoReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
              filter: isShiny ? 'drop-shadow(0 0 18px gold)' : 'drop-shadow(0 0 18px rgba(255,255,255,0.5))',
            }}
          />
          <div style={{ marginTop: 24, textAlign: 'center', animation: 'evoText 0.5s ease-out 0.4s both' }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: '#fff', marginBottom: 8, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              {isShiny ? '✨ ' : ''}Parabéns!
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#fbbf24' }}>
              evoluiu para {toName}!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const STONE_NAMES = {
  thunder_stone: 'Thunder Stone', moon_stone: 'Moon Stone',
  fire_stone: 'Fire Stone', water_stone: 'Water Stone',
  leaf_stone: 'Leaf Stone', sun_stone: 'Sun Stone',
  shiny_stone: 'Shiny Stone', dusk_stone: 'Dusk Stone',
  dawn_stone: 'Dawn Stone', ice_stone: 'Ice Stone',
  link_cable: 'Link Cable',
};

const STONE_ICONS = {
  thunder_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png',
  moon_stone:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png',
  fire_stone:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png',
  water_stone:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png',
  leaf_stone:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png',
  sun_stone:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png',
  shiny_stone:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-stone.png',
  dusk_stone:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-stone.png',
  dawn_stone:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dawn-stone.png',
  ice_stone:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ice-stone.png',
  link_cable:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/up-grade.png',
};

const TYPE_COLORS = {
  Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
  Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
  Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
  Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
  Steel: '#5a8ea2', Fairy: '#fb89eb',
};

const isRequirementMet = (evo, pokemon, inventory, POKEDEX) => {
  if (evo.item && (inventory?.items?.[evo.item] || 0) <= 0) return false;
  if (evo.level && (pokemon?.level || 1) < evo.level) return false;
  if (!getEvolutionCandyInfo(pokemon, evo, inventory, POKEDEX).met) return false;
  return true;
};

// Chip visual do custo de candy (X/Y) usado nos cards de evolução.
const CandyReqChip = ({ candy }) => {
  if (!candy || !candy.candyId || candy.cost <= 0) return null;
  const ok = candy.met;
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
      padding: '2px 8px', borderRadius: 99,
      display: 'flex', alignItems: 'center', gap: 4,
      background: ok ? '#fce7f3' : '#1e293b',
      color: ok ? '#db2777' : '#475569',
      border: `1px solid ${ok ? '#f9a8d420' : '#334155'}`,
    }}>
      {candy.spriteId != null && (
        <img src={getCandyIconUrl({ spriteId: candy.spriteId })} style={{ width: 12, height: 12 }} alt="" />
      )}
      {candy.have}/{candy.cost}{!ok && ' ✗'}
    </span>
  );
};

const EvoChoiceCard = ({ evo, pokemon, POKEDEX, inventory, onChoose, isEvolutionAllowedForRegion, activeRegion }) => {
  const targetData = POKEDEX[evo.id];
  const hasItem      = evo.item  ? (inventory?.items?.[evo.item] || 0) > 0 : true;
  const levelMet     = evo.level ? (pokemon?.level || 1) >= evo.level      : true;
  const regionAllowed = isEvolutionAllowedForRegion ? isEvolutionAllowedForRegion(pokemon, evo.id, activeRegion) : true;
  const candy        = getEvolutionCandyInfo(pokemon, evo, inventory, POKEDEX);

  const canEvolve = hasItem && levelMet && regionAllowed && candy.met;
  const primaryType  = targetData?.types?.[0] || targetData?.type || 'Normal';
  const accentColor  = TYPE_COLORS[primaryType] || '#3b82f6';

  return (
    <button
      onClick={() => canEvolve && onChoose(evo)}
      disabled={!canEvolve}
      style={{
        border: canEvolve ? `2.5px solid ${accentColor}40` : '2.5px solid #334155',
        background: canEvolve ? '#ffffff' : '#1e293b',
        opacity: canEvolve ? 1 : 0.5,
        cursor: canEvolve ? 'pointer' : 'not-allowed',
        borderRadius: 20, padding: 16,
        display: 'flex', alignItems: 'center', gap: 14,
        textAlign: 'left', width: '100%', transition: 'all 0.2s',
        boxShadow: canEvolve ? `0 4px 20px ${accentColor}20` : 'none',
      }}
    >
      <div style={{
        width: 64, height: 64, flexShrink: 0, borderRadius: 14,
        background: canEvolve ? `${accentColor}15` : '#0f172a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
          style={{ width: 52, height: 52, objectFit: 'contain',
            filter: canEvolve ? 'none' : 'brightness(0) invert(0.3)' }}
          alt={targetData?.name || `#${evo.id}`}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontWeight: 900, fontSize: 14, textTransform: 'uppercase', fontStyle: 'italic',
          color: canEvolve ? '#0f172a' : '#64748b',
          margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {targetData?.name || `#${evo.id}`}
        </p>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
          {(targetData?.types || (targetData?.type ? [targetData.type] : [])).map(t => (
            <span key={t} style={{
              fontSize: 8, fontWeight: 700, textTransform: 'uppercase',
              padding: '2px 6px', borderRadius: 99,
              background: `${TYPE_COLORS[t] || '#94a3b8'}22`,
              color: TYPE_COLORS[t] || '#94a3b8',
            }}>{t}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {evo.item && (
            <span style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              padding: '2px 8px', borderRadius: 99,
              display: 'flex', alignItems: 'center', gap: 4,
              background: hasItem ? '#fef3c720' : '#1e293b',
              color: hasItem ? '#d97706' : '#475569',
              border: `1px solid ${hasItem ? '#fcd34d40' : '#334155'}`,
            }}>
              {STONE_ICONS[evo.item] && (
                <img src={STONE_ICONS[evo.item]} style={{ width: 12, height: 12 }} alt="" />
              )}
              {STONE_NAMES[evo.item] || evo.item}{!hasItem && ' ✗'}
            </span>
          )}
          {evo.level && (
            <span style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              padding: '2px 8px', borderRadius: 99,
              background: levelMet ? '#dbeafe' : '#1e293b',
              color: levelMet ? '#2563eb' : '#475569',
              border: `1px solid ${levelMet ? '#93c5fd40' : '#334155'}`,
            }}>
              Nível {evo.level}{!levelMet && ' ✗'}
            </span>
          )}
          <CandyReqChip candy={candy} />
          {evo.time && (
            <span style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              padding: '2px 8px', borderRadius: 99,
              background: '#e0e7ff', color: '#4338ca',
            }}>
              {Array.isArray(evo.time) ? evo.time.join('/') : evo.time}
            </span>
          )}
          {!regionAllowed && (
            <span style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              padding: '2px 8px', borderRadius: 99,
              background: '#fee2e2', color: '#dc2626',
              border: '1px solid #fecaca',
            }}>
              Fora de Região ✗
            </span>
          )}
          {regionAllowed && !evo.item && !evo.level && (
            <span style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              padding: '2px 8px', borderRadius: 99,
              background: '#dcfce7', color: '#16a34a',
            }}>✓ Disponível</span>
          )}
        </div>
      </div>

      {canEvolve && (
        <span style={{ color: accentColor, fontSize: 20, fontWeight: 900, flexShrink: 0 }}>→</span>
      )}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const EvolutionScreen = ({
  evolutionPending, POKEDEX, setGameState, addLog, setEvolutionPending,
  activeRegion = 'kanto', isEvolutionAllowedForRegion, getEvolutionRegionLockMessage,
  gameState,
}) => {
  const [cinematic, setCinematic] = useState(null); // { fromId, toId, toName, isShiny }
  if (!evolutionPending) return null;

  const moveKey = (move) => String(typeof move === 'string' ? move : move?.name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const dedupeMoves = (moves = []) => {
    const seen = new Set();
    return moves.filter(move => {
      const key = moveKey(move);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // Aplica de fato a evolução (valida região/candy → transforma a instância → fecha).
  const performEvolution = () => {
    const evoData = evolutionPending.targetEvolution || POKEDEX[evolutionPending.id]?.evolution;
    const nextPoke = POKEDEX[evoData.id];
    if (isEvolutionAllowedForRegion && !isEvolutionAllowedForRegion(evolutionPending, evoData.id, activeRegion)) {
      addLog(getEvolutionRegionLockMessage?.(evolutionPending.name, nextPoke?.name, activeRegion) || `${evolutionPending.name} nao pode evoluir nesta regiao.`, 'system');
      setEvolutionPending(null);
      return;
    }
    // Requisito de candy (aditivo). force_evolve já pagou → candyPaid pula a cobrança.
    const candyReq = getEvolutionCandyInfo(evolutionPending, evoData, gameState?.inventory || {}, POKEDEX);
    if (!evolutionPending.candyPaid && candyReq.candyId && candyReq.cost > 0 && !candyReq.met) {
      addLog(`🍬 Faltam candies! ${evolutionPending.name} precisa de ${candyReq.cost} ${candyReq.name} (você tem ${candyReq.have}).`, 'system');
      setEvolutionPending(null);
      return;
    }
    setGameState(prev => {
      const evolvedId = Number(evoData.id);
      const isTeamEvo = evolutionPending.teamIndex !== null && evolutionPending.teamIndex !== undefined;
      const isPcEvo   = evolutionPending.pcIndex   !== null && evolutionPending.pcIndex   !== undefined;
      // Consome as candies da família (uma vez), se ainda não pagas.
      let candyInventory = prev.inventory;
      // Só desconta candy quando a evolução de fato se aplica (time OU PC).
      const willApply = isTeamEvo || isPcEvo;
      if (willApply && !evolutionPending.candyPaid && candyReq.candyId && candyReq.cost > 0) {
        const owned = prev.inventory?.candies?.[candyReq.candyId] || 0;
        candyInventory = {
          ...prev.inventory,
          candies: { ...(prev.inventory?.candies || {}), [candyReq.candyId]: Math.max(0, owned - candyReq.cost) },
        };
      }

      // Transformação compartilhada: aplica a evolução a uma instância (time ou PC).
      const evolveInstance = (p) => {
        const shinyMult = p.isShiny ? 1.2 : 1.0;
        const calcStat = (b, lv) => Math.max(1, Math.ceil(Math.ceil(((2 * b * lv) / 100) + 5) * shinyMult));
        const calcHp   = (b, lv) => Math.max(1, Math.ceil(Math.ceil(((2 * b * lv) / 100) + lv + 10) * shinyMult));
        let newMoves = dedupeMoves(p.moves || []);
        let newLearnedMoves = dedupeMoves(p.learnedMoves || newMoves);
        if (nextPoke.learnset) {
          const movesAtLevel = nextPoke.learnset.filter(l => l.level <= p.level);
          movesAtLevel.forEach(learn => {
            const moveName = learn.move;
            if (!newLearnedMoves.some(m => moveKey(m) === moveKey(moveName))) {
              const moveObj = { name: moveName };
              newLearnedMoves.push(moveObj);
              if (newMoves.length < 4 && !newMoves.some(m => moveKey(m) === moveKey(moveObj))) newMoves.push(moveObj);
            }
          });
        }
        return {
          ...p,
          id: evoData.id,
          name: nextPoke.name,
          type: nextPoke.type,
          types: nextPoke.types || [nextPoke.type],
          maxHp:    calcHp(nextPoke.hp || nextPoke.maxHp || 40, p.level),
          hp:       calcHp(nextPoke.hp || nextPoke.maxHp || 40, p.level),
          attack:   calcStat(nextPoke.attack   || 40, p.level),
          defense:  calcStat(nextPoke.defense  || 40, p.level),
          spAtk:    calcStat(nextPoke.spAtk    || 40, p.level),
          spDef:    calcStat(nextPoke.spDef    || 40, p.level),
          speed:    calcStat(nextPoke.speed    || 40, p.level),
          moves: dedupeMoves(newMoves).slice(0, 4),
          learnedMoves: dedupeMoves(newLearnedMoves),
        };
      };

      const newTeam = prev.team.map((p, i) => (isTeamEvo && i === evolutionPending.teamIndex) ? evolveInstance(p) : p);
      const newPcEvolved = (prev.pc || []).map((p, i) => (isPcEvo && i === evolutionPending.pcIndex) ? evolveInstance(p) : p);

      // Deduplicação: remover cópias da forma evoluída em PC, cuidadores e time (outros slots)
      let duplicatesRemoved = 0;

      const newPc = newPcEvolved.filter((p, i) => {
        if (isPcEvo && i === evolutionPending.pcIndex) return true;
        if (Number(p.id) === evolvedId) { duplicatesRemoved++; return false; }
        return true;
      });

      const newCaretakers = (prev.house?.caretakers || []).filter(p => {
        if (Number(p.id) === evolvedId) { duplicatesRemoved++; return false; }
        return true;
      });

      const finalTeam = newTeam.filter((p, i) => {
        if (i !== evolutionPending.teamIndex && Number(p.id) === evolvedId) {
          duplicatesRemoved++;
          return false;
        }
        return true;
      });

      if (duplicatesRemoved > 0) {
        addLog(`🍬 ${duplicatesRemoved} ${nextPoke.name} duplicado(s) convertido(s) em EXP Candy S!`, 'system');
      }

      const prevCandyCount = candyInventory?.items?.exp_candy_s || 0;

      return {
        ...prev,
        team: finalTeam,
        pc: newPc,
        house: prev.house ? { ...prev.house, caretakers: newCaretakers } : prev.house,
        inventory: duplicatesRemoved > 0
          ? { ...candyInventory, items: { ...candyInventory?.items, exp_candy_s: prevCandyCount + duplicatesRemoved } }
          : candyInventory,
        caughtData: { ...prev.caughtData, [evoData.id]: true },
        playerStats: willApply
          ? { ...prev.playerStats, evolutionsDone: (Number(prev.playerStats?.evolutionsDone) || 0) + 1 }
          : prev.playerStats,
      };
    });
    addLog(`✨ Parabéns! Seu ${evolutionPending.name} evoluiu para ${nextPoke.name}!`, 'system');
    setEvolutionPending(null);
  };

  // Clique em "Completar Evolução": pré-valida e inicia a cinemática; se inválido,
  // performEvolution já loga e fecha (sem animar).
  const handleEvolveClick = () => {
    const evoData = evolutionPending.targetEvolution || POKEDEX[evolutionPending.id]?.evolution;
    const nextPoke = evoData ? POKEDEX[evoData.id] : null;
    if (!evoData || !nextPoke) { performEvolution(); return; }
    const regionOk = !isEvolutionAllowedForRegion || isEvolutionAllowedForRegion(evolutionPending, evoData.id, activeRegion);
    const candyReq = getEvolutionCandyInfo(evolutionPending, evoData, gameState?.inventory || {}, POKEDEX);
    const candyOk = evolutionPending.candyPaid || !candyReq.candyId || candyReq.cost <= 0 || candyReq.met;
    if (!regionOk || !candyOk) { performEvolution(); return; }
    setCinematic({ fromId: Number(evolutionPending.id), toId: Number(evoData.id), toName: nextPoke.name, isShiny: !!evolutionPending.isShiny });
  };

  // Cinemática ativa → substitui a tela de confirmação até concluir.
  if (cinematic) {
    return <EvolutionCinematic {...cinematic} onDone={performEvolution} />;
  }

  // ── MODO ESCOLHA ──────────────────────────────────────────────────────────
  const isChoiceMode =
    Array.isArray(evolutionPending.choices) &&
    evolutionPending.choices.length > 1 &&
    !evolutionPending.targetEvolution;

  if (isChoiceMode) {
    const choices   = evolutionPending.choices;
    const inventory = gameState?.inventory || {};
    const anyReady  = choices.some(e => isRequirementMet(e, evolutionPending, inventory, POKEDEX));

    const handleChoose = (evoData) => {
      if (!isRequirementMet(evoData, evolutionPending, inventory, POKEDEX)) return;
      if (evoData.item) {
        setGameState(prev => ({
          ...prev,
          inventory: {
            ...prev.inventory,
            items: {
              ...prev.inventory?.items,
              [evoData.item]: Math.max(0, (prev.inventory?.items?.[evoData.item] || 1) - 1),
            },
          },
        }));
      }
      setEvolutionPending(prev => ({ ...prev, targetEvolution: evoData, choices: null }));
    };

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-slate-900/98 backdrop-blur-3xl animate-fadeIn">
        <div style={{ maxWidth: 520, width: '100%', position: 'relative' }}>
          <div className="absolute inset-0 bg-blue-500/10 blur-[120px] animate-pulse pointer-events-none" />

          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Cabeçalho */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div className="absolute inset-0 bg-white/15 blur-2xl rounded-full animate-pulse" />
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionPending.id}.png`}
                  style={{ width: 112, height: 112, position: 'relative', zIndex: 1,
                    filter: 'drop-shadow(0 0 24px rgba(255,255,255,0.3))' }}
                  alt={evolutionPending.name}
                />
              </div>
              <h3 style={{
                color: '#fff', fontWeight: 900, fontSize: 22,
                textTransform: 'uppercase', fontStyle: 'italic',
                marginTop: 12, marginBottom: 4,
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
              }}>
                {evolutionPending.name} pode evoluir!
              </h3>
              <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: 13 }}>
                {anyReady ? 'Escolha a forma de evolução:' : 'Nenhuma evolução disponível agora.'}
              </p>
              {evolutionPending.isShiny && (
                <span style={{
                  display: 'inline-block', marginTop: 8, fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', padding: '3px 10px', borderRadius: 99,
                  background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', color: '#fff',
                }}>✨ Shiny</span>
              )}
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {choices.map((evo, idx) => (
                <EvoChoiceCard
                  key={`${evo.id}-${idx}`}
                  evo={evo}
                  pokemon={evolutionPending}
                  POKEDEX={POKEDEX}
                  inventory={inventory}
                  onChoose={handleChoose}
                  isEvolutionAllowedForRegion={isEvolutionAllowedForRegion}
                  activeRegion={activeRegion}
                />
              ))}
            </div>

            <button
              onClick={() => setEvolutionPending(null)}
              style={{
                width: '100%', padding: 12, background: 'transparent',
                border: 'none', cursor: 'pointer', color: '#475569',
                fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: 2,
              }}
            >
              Cancelar / Decidir depois
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MODO ANIMAÇÃO (comportamento original) ────────────────────────────────
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/98 backdrop-blur-3xl animate-fadeIn">
       <div className="max-w-2xl w-full text-center relative">
          <div className="absolute inset-0 bg-blue-500/10 blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-slowSpin"></div>

          <div className="relative z-10 flex flex-col items-center">
             <div className="flex items-center gap-6 md:gap-16 mb-16">
                <div className="relative">
                   <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionPending.id}.png`} className="w-32 h-32 md:w-44 md:h-44 grayscale brightness-150 animate-pulse" alt="Old" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                </div>
                <div className="flex flex-col items-center">
                   <span className="text-white text-4xl md:text-6xl font-black drop-shadow-lg animate-bounce">⚡</span>
                   <div className="w-20 h-1 bg-white/20 rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-white animate-loading"></div>
                   </div>
                </div>
                <div className="relative group">
                   <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full animate-pulse group-hover:bg-white/40 transition-all"></div>
                   <img
                     src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionPending.targetEvolution?.id || POKEDEX[evolutionPending.id]?.evolution?.id}.png`}
                     className="w-32 h-32 md:w-56 md:h-56 brightness-0 invert opacity-40 animate-evolution-glow drop-shadow-[0_0_50px_rgba(255,255,255,0.6)] relative z-10"
                     alt="Silhueta da Evolução"
                   />
                   <div className="absolute inset-0 bg-[radial-gradient(circle,white_0%,transparent_70%)] opacity-30 animate-ping pointer-events-none"></div>
                </div>
             </div>

             <div className="bg-white p-12 rounded-[4rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-b-[16px] border-slate-100 w-full max-w-lg transform hover:scale-[1.02] transition-transform">
                <h3 className="text-4xl font-black text-slate-800 uppercase italic mb-6 tracking-tighter bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent">O QUE?!</h3>
                <p className="text-xl font-bold text-slate-600 mb-12 leading-relaxed">
                   Seu <span className="text-pokeBlue font-black uppercase underline decoration-4 decoration-blue-100 underline-offset-4">{evolutionPending.name}</span> está começando a evoluir!
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0' }}>
                    <button
                     onClick={handleEvolveClick}
                     style={{
                       width: '100%', padding: '20px 8px', borderRadius: '24px',
                       fontWeight: 900, fontSize: '16px', textTransform: 'uppercase',
                       background: '#1e293b', color: 'white', border: 'none', cursor: 'pointer',
                       boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                       display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
                     }}
                    >
                      <span>Completar Evolução</span>
                      <span>➜</span>
                    </button>
                    <button
                      onClick={() => setEvolutionPending(null)}
                      style={{
                        width: '100%', padding: '12px 8px', borderRadius: '16px',
                        fontWeight: 900, fontSize: '11px', textTransform: 'uppercase',
                        background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer',
                      }}
                    >Parar Evolução (B)</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default EvolutionScreen;

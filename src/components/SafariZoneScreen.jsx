// ── Safari Zone Screen — PokéCraft Idle 2 ────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';

const SAFARI_POKEMON = [
  { id: 102, name: 'Exeggcute',  baseRate: 0.35 },
  { id: 108, name: 'Lickitung',  baseRate: 0.20 },
  { id: 113, name: 'Chansey',    baseRate: 0.08 },
  { id: 114, name: 'Tangela',    baseRate: 0.30 },
  { id: 115, name: 'Kangaskhan', baseRate: 0.15 },
  { id: 123, name: 'Scyther',    baseRate: 0.12 },
  { id: 127, name: 'Pinsir',     baseRate: 0.12 },
  { id: 128, name: 'Tauros',     baseRate: 0.18 },
];

const TYPE_COLORS = {
  Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
  Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
  Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
  Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
  Steel: '#5a8ea2', Fairy: '#fb89eb',
};

const POKEMON_TYPES = {
  102: ['Grass', 'Psychic'],
  108: ['Normal'],
  113: ['Normal'],
  114: ['Grass'],
  115: ['Normal'],
  123: ['Bug', 'Flying'],
  127: ['Bug'],
  128: ['Normal'],
};

const ENTRY_COST = 500;
const MAX_BALLS = 30;

// Sorteia um Pokémon aleatório da pool da Safari Zone
const rollWildPokemon = () => {
  const weights = SAFARI_POKEMON.map(p => p.baseRate);
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (const poke of SAFARI_POKEMON) {
    rand -= poke.baseRate;
    if (rand <= 0) return poke;
  }
  return SAFARI_POKEMON[SAFARI_POKEMON.length - 1];
};

// ─────────────────────────────────────────────────────────────────────────────

const SafariZoneScreen = ({
  gameState,
  setGameState,
  safariSession,
  setSafariSession,
  onExit,
  addLog,
  POKEDEX,
}) => {
  const [wildPokemon, setWildPokemon]   = useState(null);
  const [phase, setPhase]               = useState('idle'); // idle | encounter | result
  const [resultMsg, setResultMsg]       = useState('');
  const [resultType, setResultType]     = useState(''); // 'caught' | 'fled' | 'miss'
  const [baitActive, setBaitActive]     = useState(false);
  const [mudActive, setMudActive]       = useState(false);
  const [fleeChance, setFleeChance]     = useState(0.25);
  const [catchMult, setCatchMult]       = useState(1.0);
  const [ballsLeft, setBallsLeft]       = useState(safariSession?.ballsLeft ?? MAX_BALLS);
  const [isAnimating, setIsAnimating]   = useState(false);
  const [shakeCount, setShakeCount]     = useState(0);

  const inventory = gameState?.inventory?.items || {};
  const hasSafariBall = (inventory.safari_ball || 0) > 0;
  const hasBait       = (inventory.pokemon_bait || 0) > 0;
  const hasMud        = (inventory.mud_ball || 0) > 0;

  // Spawn novo encontro
  const spawnEncounter = useCallback(() => {
    const poke = rollWildPokemon();
    setWildPokemon(poke);
    setFleeChance(0.25);
    setCatchMult(1.0);
    setBaitActive(false);
    setMudActive(false);
    setPhase('encounter');
    setShakeCount(0);
  }, []);

  // Consome um item do inventário
  const consumeItem = useCallback((itemId) => {
    setGameState(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        items: {
          ...prev.inventory?.items,
          [itemId]: Math.max(0, (prev.inventory?.items?.[itemId] || 1) - 1),
        },
      },
    }));
  }, [setGameState]);

  // ── Ação: Arremessar Safari Ball ─────────────────────────────────────────────
  const handleThrowBall = useCallback(() => {
    if (!wildPokemon || phase !== 'encounter' || isAnimating) return;
    if (!hasSafariBall) {
      addLog?.('Você não tem Safari Balls!', 'system');
      return;
    }
    if (ballsLeft <= 0) {
      addLog?.('Sem mais Safari Balls disponíveis!', 'system');
      return;
    }

    consumeItem('safari_ball');
    setBallsLeft(prev => prev - 1);
    setIsAnimating(true);

    const newBallsLeft = ballsLeft - 1;

    // Calcula chance de captura
    const baseRate = wildPokemon.baseRate;
    const adjustedRate = Math.min(0.95, baseRate * catchMult * (baitActive ? 1.5 : 1.0));

    // Animação de balanço
    const shakes = Math.floor(adjustedRate * 3) + 1;
    setShakeCount(shakes);

    setTimeout(() => {
      const caught = Math.random() < adjustedRate;

      if (caught) {
        // Adiciona ao time/PC
        const pokeData = POKEDEX?.[wildPokemon.id] || {};
        const isShiny = Math.random() < 0.001;
        const level = 25 + Math.floor(Math.random() * 15);
        const shinyMult = isShiny ? 1.2 : 1.0;
        const calcStat = (b) => Math.max(1, Math.ceil(((2 * (b || 40) * level) / 100) + 5) * shinyMult);
        const calcHp   = (b) => Math.max(1, Math.ceil(((2 * (b || 45) * level) / 100) + level + 10) * shinyMult);

        const newPoke = {
          id:       wildPokemon.id,
          name:     pokeData.name || wildPokemon.name,
          type:     pokeData.type || 'Normal',
          types:    pokeData.types || POKEMON_TYPES[wildPokemon.id] || ['Normal'],
          level,
          isShiny,
          hp:       calcHp(pokeData.hp || pokeData.maxHp),
          maxHp:    calcHp(pokeData.hp || pokeData.maxHp),
          attack:   calcStat(pokeData.attack),
          defense:  calcStat(pokeData.defense),
          spAtk:    calcStat(pokeData.spAtk),
          spDef:    calcStat(pokeData.spDef),
          speed:    calcStat(pokeData.speed),
          moves:    pokeData.learnset?.filter(l => l.level <= level).slice(-4).map(l => ({ name: l.move })) || [{ name: 'Investida' }],
          learnedMoves: pokeData.learnset?.filter(l => l.level <= level).map(l => ({ name: l.move })) || [{ name: 'Investida' }],
          xp: 0, totalXp: 0,
          instanceId: `safari_${wildPokemon.id}_${Date.now()}`,
          caughtAt: 'Safari Zone',
        };

        setGameState(prev => {
          const teamFull = (prev.team || []).length >= 6;
          return {
            ...prev,
            team:       teamFull ? prev.team : [...(prev.team || []), newPoke],
            pc:         teamFull ? [...(prev.pc || []), newPoke] : prev.pc,
            caughtData: { ...prev.caughtData, [wildPokemon.id]: true },
          };
        });

        setResultMsg(`${isShiny ? '✨ ' : ''}${wildPokemon.name} foi capturado!`);
        setResultType('caught');
        addLog?.(`${isShiny ? '✨ ' : ''}Você capturou ${wildPokemon.name} na Safari Zone!`, 'success');
      } else {
        setResultMsg(`${wildPokemon.name} escapou da Safari Ball!`);
        setResultType('miss');
      }

      setIsAnimating(false);
      setPhase('result');

      // Após resultado, verifica se o Pokémon foge
      if (!caught) {
        const fled = Math.random() < (mudActive ? fleeChance * 1.5 : fleeChance);
        if (fled || newBallsLeft <= 0) {
          setTimeout(() => {
            if (newBallsLeft <= 0) {
              setPhase('out_of_balls');
            } else {
              setResultMsg(`${wildPokemon.name} fugiu!`);
              setResultType('fled');
              setTimeout(() => setPhase('idle'), 1500);
            }
          }, 800);
        } else {
          setTimeout(() => setPhase('encounter'), 1500);
        }
      } else {
        setTimeout(() => setPhase('idle'), 2000);
      }
    }, 1200);
  }, [wildPokemon, phase, isAnimating, hasSafariBall, ballsLeft, catchMult, baitActive, mudActive, fleeChance, consumeItem, setGameState, POKEDEX, addLog]);

  // ── Ação: Usar Isca ───────────────────────────────────────────────────────────
  const handleUseBait = useCallback(() => {
    if (!hasBait || phase !== 'encounter') return;
    consumeItem('pokemon_bait');
    setBaitActive(true);
    setFleeChance(prev => Math.max(0.05, prev * 0.6)); // -40% fuga
    setCatchMult(prev => prev * 1.3); // +30% captura
    addLog?.(`Você jogou uma Isca! ${wildPokemon?.name} ficou distraído.`, 'system');
  }, [hasBait, phase, consumeItem, wildPokemon, addLog]);

  // ── Ação: Jogar Lama ──────────────────────────────────────────────────────────
  const handleThrowMud = useCallback(() => {
    if (!hasMud || phase !== 'encounter') return;
    consumeItem('mud_ball');
    setMudActive(true);
    setFleeChance(prev => Math.min(0.9, prev * 1.5)); // +50% fuga
    setCatchMult(prev => prev * 1.5); // +50% captura
    addLog?.(`Você jogou Lama! ${wildPokemon?.name} ficou furioso!`, 'system');
  }, [hasMud, phase, consumeItem, wildPokemon, addLog]);

  // ── Ação: Fugir ───────────────────────────────────────────────────────────────
  const handleFlee = useCallback(() => {
    setPhase('idle');
    setWildPokemon(null);
  }, []);

  const handleExit = useCallback(() => {
    setSafariSession(null);
    onExit?.();
  }, [setSafariSession, onExit]);

  // ─────────────────────────────────────────────────────────────────────────────

  const bgGradient = 'linear-gradient(160deg, #1a2e1a 0%, #0d1f0d 40%, #0a1a0a 100%)';

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: bgGradient }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-green-900/40 shrink-0"
        style={{ background: 'rgba(0,0,0,0.4)' }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 22 }}>🌿</span>
          <div>
            <h2 style={{ color: '#4ade80', fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Safari Zone
            </h2>
            <p style={{ color: '#86efac', fontSize: 10, fontWeight: 700 }}>Zona de Captura Especial</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#fbbf24', fontSize: 18, fontWeight: 900 }}>{ballsLeft}</p>
            <p style={{ color: '#92400e', fontSize: 9, fontWeight: 700 }}>Safari Balls</p>
          </div>
          <button
            onClick={handleExit}
            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 10, padding: '6px 14px', fontSize: 11, fontWeight: 900, cursor: 'pointer' }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Área principal */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4">

        {/* ── IDLE: botão de procurar ─────────────────────────────────────────── */}
        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-6 animate-fadeIn">
            <div style={{ fontSize: 80, filter: 'drop-shadow(0 0 20px rgba(74,222,128,0.4))' }}>🌿</div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#4ade80', fontWeight: 900, fontSize: 20, textTransform: 'uppercase' }}>
                Procurar Pokémon
              </h3>
              <p style={{ color: '#86efac', fontSize: 13, marginTop: 6 }}>
                Explore a grama para encontrar Pokémon selvagens!
              </p>
            </div>

            {/* Pool de Pokémon */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 320 }}>
              {SAFARI_POKEMON.map(p => (
                <div key={p.id} style={{
                  background: 'rgba(255,255,255,0.05)', borderRadius: 12,
                  padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6,
                  border: gameState?.caughtData?.[p.id] ? '1px solid #4ade8050' : '1px solid #ffffff10',
                }}>
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                    style={{ width: 28, height: 28, filter: gameState?.caughtData?.[p.id] ? 'none' : 'brightness(0) invert(0.3)' }} alt={p.name} />
                  <span style={{ color: gameState?.caughtData?.[p.id] ? '#4ade80' : '#64748b', fontSize: 10, fontWeight: 700 }}>
                    {p.name}
                  </span>
                  {gameState?.caughtData?.[p.id] && <span style={{ fontSize: 8 }}>✓</span>}
                </div>
              ))}
            </div>

            <button
              onClick={spawnEncounter}
              disabled={ballsLeft <= 0 || !hasSafariBall}
              style={{
                background: ballsLeft > 0 && hasSafariBall ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#374151',
                color: '#fff', border: 'none', borderRadius: 20, padding: '16px 40px',
                fontSize: 16, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em',
                cursor: ballsLeft > 0 && hasSafariBall ? 'pointer' : 'not-allowed',
                boxShadow: ballsLeft > 0 && hasSafariBall ? '0 8px 24px rgba(22,163,74,0.4)' : 'none',
              }}
            >
              {!hasSafariBall ? '⚠️ Sem Safari Balls' : '🌿 Explorar Grama'}
            </button>

            {!hasSafariBall && (
              <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, textAlign: 'center' }}>
                Craft Safari Balls na Forja para continuar!
              </p>
            )}
          </div>
        )}

        {/* ── ENCOUNTER: encontro com Pokémon ─────────────────────────────────── */}
        {(phase === 'encounter' || (phase === 'result' && wildPokemon)) && wildPokemon && (
          <div className="w-full max-w-sm animate-fadeIn flex flex-col gap-4">

            {/* Pokémon selvagem */}
            <div style={{
              background: 'rgba(0,0,0,0.5)', borderRadius: 24, padding: 24,
              border: '1px solid rgba(74,222,128,0.2)', textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* bg decorativo */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 50% 60%, rgba(74,222,128,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Tipos */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12 }}>
                {(POKEMON_TYPES[wildPokemon.id] || ['Normal']).map(t => (
                  <span key={t} style={{
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    padding: '2px 8px', borderRadius: 99,
                    background: `${TYPE_COLORS[t] || '#94a3b8'}22`,
                    color: TYPE_COLORS[t] || '#94a3b8',
                  }}>{t}</span>
                ))}
              </div>

              {/* Sprite com animação de shake na captura */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {isAnimating && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle, rgba(255,200,0,0.4) 0%, transparent 70%)',
                    borderRadius: '50%', animation: 'ping 0.6s ease-out infinite',
                  }} />
                )}
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${wildPokemon.id}.png`}
                  style={{
                    width: 120, height: 120, objectFit: 'contain',
                    filter: 'drop-shadow(0 0 12px rgba(74,222,128,0.3))',
                    transform: isAnimating ? 'scale(0.9)' : 'scale(1)',
                    transition: 'transform 0.3s',
                  }}
                  alt={wildPokemon.name}
                />
              </div>

              <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 22, textTransform: 'uppercase', fontStyle: 'italic', marginTop: 8 }}>
                {wildPokemon.name} Selvagem!
              </h3>

              {/* Indicadores de status */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                {baitActive && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: '#fef3c7', color: '#92400e' }}>
                    🍯 Isca Ativa
                  </span>
                )}
                {mudActive && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: '#fef3c720', color: '#a3661a' }}>
                    💩 Lama Ativa
                  </span>
                )}
              </div>

              {/* Resultado após arremesso */}
              {phase === 'result' && resultMsg && (
                <div style={{
                  marginTop: 12, padding: '8px 16px', borderRadius: 12,
                  background: resultType === 'caught' ? 'rgba(22,163,74,0.2)' : 'rgba(239,68,68,0.15)',
                  border: `1px solid ${resultType === 'caught' ? '#4ade8050' : '#ef444450'}`,
                }}>
                  <p style={{ color: resultType === 'caught' ? '#4ade80' : '#f87171', fontWeight: 900, fontSize: 14 }}>
                    {resultMsg}
                  </p>
                </div>
              )}
            </div>

            {/* Barra de Inventário */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: '6px 12px', textAlign: 'center' }}>
                <p style={{ color: '#fbbf24', fontWeight: 900, fontSize: 14 }}>{inventory.safari_ball || 0}</p>
                <p style={{ color: '#92400e', fontSize: 9, fontWeight: 700 }}>Safari Balls</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: '6px 12px', textAlign: 'center' }}>
                <p style={{ color: '#fbbf24', fontWeight: 900, fontSize: 14 }}>{inventory.pokemon_bait || 0}</p>
                <p style={{ color: '#92400e', fontSize: 9, fontWeight: 700 }}>Iscas</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: '6px 12px', textAlign: 'center' }}>
                <p style={{ color: '#fbbf24', fontWeight: 900, fontSize: 14 }}>{inventory.mud_ball || 0}</p>
                <p style={{ color: '#92400e', fontSize: 9, fontWeight: 700 }}>Lamas</p>
              </div>
            </div>

            {/* Botões de ação */}
            {phase === 'encounter' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {/* Safari Ball */}
                <button
                  onClick={handleThrowBall}
                  disabled={!hasSafariBall || isAnimating}
                  style={{
                    gridColumn: '1 / -1',
                    background: hasSafariBall && !isAnimating ? 'linear-gradient(135deg, #16a34a, #15803d)' : '#374151',
                    color: '#fff', border: 'none', borderRadius: 16, padding: '14px 0',
                    fontSize: 14, fontWeight: 900, cursor: hasSafariBall && !isAnimating ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: hasSafariBall && !isAnimating ? '0 6px 16px rgba(22,163,74,0.35)' : 'none',
                  }}
                >
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/safari-ball.png"
                    style={{ width: 20, height: 20 }} alt="" />
                  {isAnimating ? 'Arremessando...' : 'Arremessar Safari Ball'}
                </button>

                {/* Isca */}
                <button
                  onClick={handleUseBait}
                  disabled={!hasBait || baitActive || isAnimating}
                  style={{
                    background: hasBait && !baitActive && !isAnimating ? 'rgba(217,119,6,0.3)' : 'rgba(55,65,81,0.5)',
                    color: hasBait && !baitActive && !isAnimating ? '#fbbf24' : '#64748b',
                    border: `1px solid ${hasBait && !baitActive && !isAnimating ? '#d9770650' : '#374151'}`,
                    borderRadius: 12, padding: '10px 0',
                    fontSize: 12, fontWeight: 900, cursor: hasBait && !baitActive && !isAnimating ? 'pointer' : 'not-allowed',
                  }}
                >
                  🍯 Jogar Isca {baitActive && '(Ativo)'}
                </button>

                {/* Lama */}
                <button
                  onClick={handleThrowMud}
                  disabled={!hasMud || mudActive || isAnimating}
                  style={{
                    background: hasMud && !mudActive && !isAnimating ? 'rgba(120,53,15,0.4)' : 'rgba(55,65,81,0.5)',
                    color: hasMud && !mudActive && !isAnimating ? '#d97706' : '#64748b',
                    border: `1px solid ${hasMud && !mudActive && !isAnimating ? '#92400e50' : '#374151'}`,
                    borderRadius: 12, padding: '10px 0',
                    fontSize: 12, fontWeight: 900, cursor: hasMud && !mudActive && !isAnimating ? 'pointer' : 'not-allowed',
                  }}
                >
                  💩 Jogar Lama {mudActive && '(Ativo)'}
                </button>

                {/* Fugir */}
                <button
                  onClick={handleFlee}
                  disabled={isAnimating}
                  style={{
                    gridColumn: '1 / -1',
                    background: 'transparent', color: '#ef4444',
                    border: '1px solid #ef444430', borderRadius: 12, padding: '8px 0',
                    fontSize: 11, fontWeight: 900, cursor: 'pointer',
                  }}
                >
                  ↩ Fugir do Encontro
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── SEM BALLS ────────────────────────────────────────────────────────── */}
        {phase === 'out_of_balls' && (
          <div className="flex flex-col items-center gap-4 animate-fadeIn text-center">
            <div style={{ fontSize: 64 }}>😔</div>
            <h3 style={{ color: '#f87171', fontWeight: 900, fontSize: 18, textTransform: 'uppercase' }}>
              Sem Safari Balls!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 13 }}>
              Você ficou sem Safari Balls. Volte à Forja para craftar mais!
            </p>
            <button
              onClick={handleExit}
              style={{
                background: '#dc2626', color: '#fff', border: 'none', borderRadius: 16,
                padding: '14px 32px', fontSize: 14, fontWeight: 900, cursor: 'pointer',
              }}
            >
              Sair da Safari Zone
            </button>
          </div>
        )}
      </div>

      {/* Dicas */}
      <div className="shrink-0 px-4 py-3 border-t border-green-900/30" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
          <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '6px 12px', fontSize: 10, color: '#86efac', fontWeight: 700 }}>
            🍯 Isca: +30% captura, -40% fuga
          </div>
          <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '6px 12px', fontSize: 10, color: '#fbbf24', fontWeight: 700 }}>
            💩 Lama: +50% captura, +50% fuga
          </div>
          <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '6px 12px', fontSize: 10, color: '#93c5fd', fontWeight: 700 }}>
            ✨ Chansey: 8% — Raro!
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafariZoneScreen;

import React, { useState, useEffect, useCallback, useRef } from 'react';

const STAR_COLOR = {
  1: '#94a3b8',
  2: '#22c55e',
  3: '#3b82f6',
  4: '#a855f7',
  5: '#f59e0b',
};

const PHASE_LABELS = {
  idle:     'Raid Disponível',
  fighting: 'Em Batalha!',
  capture:  'Captura',
  rewards:  'Recompensas',
  ended:    'Raid Encerrada',
};

const POKEAPI_ITEMS = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';

const REWARD_ICONS = {
  pokeballs:        `${POKEAPI_ITEMS}poke-ball.png`,
  great_ball:       `${POKEAPI_ITEMS}great-ball.png`,
  ultra_ball:       `${POKEAPI_ITEMS}ultra-ball.png`,
  fire_stone:       `${POKEAPI_ITEMS}fire-stone.png`,
  water_stone:      `${POKEAPI_ITEMS}water-stone.png`,
  thunder_stone:    `${POKEAPI_ITEMS}thunder-stone.png`,
  moon_stone:       `${POKEAPI_ITEMS}moon-stone.png`,
  sun_stone:        `${POKEAPI_ITEMS}sun-stone.png`,
  dawn_stone:       `${POKEAPI_ITEMS}dawn-stone.png`,
  link_cable:       `${POKEAPI_ITEMS}up-grade.png`,
  stardust:         `${POKEAPI_ITEMS}stardust.png`,
  dragon_scale:     `${POKEAPI_ITEMS}dragon-scale.png`,
  armor_fragment:   `${POKEAPI_ITEMS}hard-stone.png`,
  mega_stone_shard: `${POKEAPI_ITEMS}charizardite-x.png`,
  tm_flamethrower:  `${POKEAPI_ITEMS}tm-fire.png`,
  tm_thunderbolt:   `${POKEAPI_ITEMS}tm-electric.png`,
  tm_ice_beam:      `${POKEAPI_ITEMS}tm-ice.png`,
  rare_candy:       `${POKEAPI_ITEMS}rare-candy.png`,
  exp_candy_xs:     `${POKEAPI_ITEMS}rare-candy.png`,
  exp_candy_s:      `${POKEAPI_ITEMS}rare-candy.png`,
  exp_candy_m:      `${POKEAPI_ITEMS}rare-candy.png`,
  exp_candy_l:      `${POKEAPI_ITEMS}rare-candy.png`,
  exp_candy_xl:     `${POKEAPI_ITEMS}rare-candy.png`,
  currency:         `${POKEAPI_ITEMS}nugget.png`,
};

const formatTime = (ms) => {
  if (ms <= 0) return '0:00';
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const RaidScreen = ({
  raid, gameState, onStart, onDismiss, onContinueFight, onForfeitCapture, onCatchAttempt, onCatchRoll, onClaimRewards, POKEDEX,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Refs para calcular posição real do sprite
  // contentRef: div principal (sempre montado) — usado como origem das coordenadas
  const spriteRef   = useRef(null);
  const contentRef  = useRef(null);  // substitui overlayRef (sempre renderizado)

  // Posição absoluta da pokébola (em px dentro do overlay)
  const [ballX,    setBallX]    = useState(184);  // left
  const [ballY,    setBallY]    = useState(500);  // top (start = fundo)
  // Posição final (centro do sprite)
  const [targetX,  setTargetX]  = useState(184);
  const [targetY,  setTargetY]  = useState(200);
  // Ativa transição CSS apenas durante o lançamento
  const [useTransition, setUseTransition] = useState(false);

  const [catchAnim, setCatchAnim] = useState({
    active: false,
    phase: null,      // 'throwing' | 'absorbing' | 'shaking' | 'result'
    caught: false,
    ballImg: null,
    ballId: null,
    shakes: 0,
  });

  if (!raid) return null;

  const hpPct = Math.max(0, (raid.currentHp / raid.maxHp) * 100);
  const timeLeftExpire = raid.expiresAt - now;
  const timeLeftFight  = raid.fightEndsAt ? raid.fightEndsAt - now : 0;
  const starColor = STAR_COLOR[raid.stars] || '#94a3b8';
  const pokemonSprite = raid.isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${raid.pokemonId}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${raid.pokemonId}.png`;
  const isAlphaShiny = raid.isAlpha && raid.isShiny;

  const balls = [
    { id: 'ultra_ball', label: 'Ultra Ball', count: gameState.inventory?.items?.ultra_ball || 0,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' },
    { id: 'great_ball', label: 'Great Ball', count: gameState.inventory?.items?.great_ball || 0,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' },
    { id: 'pokeballs',  label: 'Pokébola',   count: gameState.inventory?.items?.pokeballs  || 0,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
  ];

  const handleBallClick = useCallback((ball) => {
    if (catchAnim.active) return;
    if (ball.count <= 0) return;
    if (raid.catchAttemptsLeft <= 0) return;

    // ── Mede posição real do sprite dentro do contentRef ─────────────────────
    let tx = 184, ty = 200, startY = 520;
    if (spriteRef.current && contentRef.current) {
      const or = contentRef.current.getBoundingClientRect();
      const sr = spriteRef.current.getBoundingClientRect();
      tx     = sr.left + sr.width  / 2 - or.left;   // centro horizontal do sprite
      ty     = sr.top  + sr.height / 2 - or.top;    // centro vertical do sprite
      startY = or.height - 70;                        // 70px acima do fundo do overlay
    }

    const bx = tx - 26;        // left da bola (centralizada no sprite)
    const by = ty - 26;        // top da bola quando no sprite

    // Armazena target para posicionar texto de resultado
    setTargetX(tx);
    setTargetY(ty);

    // 1) Posiciona a bola no ponto de partida (sem transição)
    setUseTransition(false);
    setBallX(bx);
    setBallY(startY);

    // Pré-computa resultado
    const caught = onCatchRoll(ball.id);

    setCatchAnim({ active: true, phase: 'throwing', caught, ballImg: ball.img, ballId: ball.id, shakes: 0 });

    // 2) No próximo frame, ativa transição e move para o sprite
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setUseTransition(true);
        setBallY(by);
      });
    });

    // Fase absorção (500ms)
    setTimeout(() => setCatchAnim(a => ({ ...a, phase: 'absorbing' })), 500);

    // Tremida 1 (900ms) — desativa transição antes de sacudir
    setTimeout(() => {
      setUseTransition(false);
      setCatchAnim(a => ({ ...a, phase: 'shaking', shakes: 1 }));
    }, 900);

    // Tremida 2 (1300ms)
    setTimeout(() => setCatchAnim(a => ({ ...a, phase: 'shaking', shakes: 2 })), 1300);

    // Tremida 3 — só se capturou (1700ms)
    if (caught) {
      setTimeout(() => setCatchAnim(a => ({ ...a, phase: 'shaking', shakes: 3 })), 1700);
    }

    // Resultado (2100ms capturou | 1700ms escapou)
    const resultDelay = caught ? 2100 : 1700;
    setTimeout(() => setCatchAnim(a => ({ ...a, phase: 'result' })), resultDelay);

    // Commit no gameState
    const commitDelay = resultDelay + 900;
    setTimeout(() => {
      onCatchAttempt(ball.id, caught);
      setCatchAnim({ active: false, phase: null, caught: false, ballImg: null, ballId: null, shakes: 0 });
      setUseTransition(false);
    }, commitDelay);
  }, [catchAnim.active, raid, onCatchRoll, onCatchAttempt]);

  // ── Estilos da pokébola ────────────────────────────────────────────────────
  const getBallAnimation = () => {
    const p = catchAnim.phase;
    const s = catchAnim.shakes;
    if (p === 'shaking' && s === 1) return 'rs-shake-1 0.4s ease-in-out';
    if (p === 'shaking' && s === 2) return 'rs-shake-2 0.4s ease-in-out';
    if (p === 'shaking' && s === 3) return 'rs-shake-3 0.4s ease-in-out';
    if (p === 'result' && catchAnim.caught)  return 'rs-caught-glow 0.6s ease-in-out infinite';
    if (p === 'result' && !catchAnim.caught) return 'rs-escape-pop 0.5s ease-in forwards';
    return 'none';
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9990,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, background: `rgba(2,6,23,0.85) url('${import.meta.env.BASE_URL}raid_bg.webp') center/cover no-repeat`,
      backdropFilter: 'blur(20px)',
    }}>
      <style>{`
        /* ── Bola: sacudidas (sem translateY — bola já está no alvo) ── */
        @keyframes rs-shake-1 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25%       { transform: rotate(-18deg) scale(1.05); }
          75%       { transform: rotate(18deg) scale(1.05); }
        }
        @keyframes rs-shake-2 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25%       { transform: rotate(-12deg) scale(1.04); }
          75%       { transform: rotate(12deg) scale(1.04); }
        }
        @keyframes rs-shake-3 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25%       { transform: rotate(-8deg) scale(1.02); }
          75%       { transform: rotate(8deg) scale(1.02); }
        }
        /* ── Bola: capturado ── */
        @keyframes rs-caught-glow {
          0%, 100% { filter: drop-shadow(0 0 6px #fbbf24); transform: scale(1); }
          50%       { filter: drop-shadow(0 0 28px #fbbf24) brightness(1.5); transform: scale(1.18); }
        }
        /* ── Bola: escapou ── */
        @keyframes rs-escape-pop {
          0%   { transform: scale(1) translateY(0);   opacity: 1; }
          35%  { transform: scale(1.4) translateY(-12px); opacity: 0.85; }
          100% { transform: scale(0.3) translateY(-30px); opacity: 0; }
        }
        /* ── Sprite Pokémon ── */
        @keyframes pokemon-absorb {
          0%   { opacity: 1; transform: scale(1);   filter: brightness(1); }
          30%  { opacity: 0.8; transform: scale(0.9); filter: brightness(3); }
          70%  { opacity: 0.2; transform: scale(0.4); filter: brightness(5); }
          100% { opacity: 0; transform: scale(0.1); filter: brightness(10); }
        }
        @keyframes pokemon-reappear {
          0%   { opacity: 0; transform: scale(0.1); filter: brightness(5); }
          60%  { opacity: 0.8; transform: scale(1.05); filter: brightness(1.5); }
          100% { opacity: 1; transform: scale(1);   filter: brightness(1); }
        }
        /* ── Textos de resultado ── */
        @keyframes result-text-in {
          0%   { opacity: 0; transform: scale(0.5) translateY(12px); }
          100% { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes stars-burst {
          0%   { opacity: 1; transform: scale(0); }
          60%  { opacity: 1; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(1.8); }
        }
        /* ── Float genérico ── */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50%       { transform: scale(1.1); opacity: 1; }
        }
      `}</style>

      {/* Brilho de fundo colorido pela estrela */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 30%, ${starColor}22, transparent 70%)`,
      }} />

      <div
        ref={contentRef}
        style={{
          maxWidth: 420, width: '100%', position: 'relative', zIndex: 10,
          maxHeight: '95vh', display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        {/* ── OVERLAY DE ANIMAÇÃO (sempre montado para refs funcionarem) ──────── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          pointerEvents: 'none',
        }}>
          {/* Pokébola */}
          {catchAnim.active && catchAnim.ballImg && (
            <img
              src={catchAnim.ballImg}
              alt=""
              style={{
                width: 52, height: 52,
                position: 'absolute',
                left: ballX,
                top:  ballY,
                imageRendering: 'pixelated',
                transition: useTransition
                  ? 'top 0.5s cubic-bezier(0.15, 0.85, 0.35, 1.1)'
                  : 'none',
                animation: getBallAnimation(),
                transformOrigin: 'center center',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
              }}
            />
          )}

          {/* Texto de resultado — logo abaixo do sprite */}
          {catchAnim.active && catchAnim.phase === 'result' && (
            <div style={{
              position: 'absolute',
              left: '50%',
              top: targetY + 58,   // 58px abaixo do centro do sprite
              transform: 'translateX(-50%)',
              animation: 'result-text-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}>
              {catchAnim.caught ? (
                <>
                  <p style={{
                    color: '#4ade80', fontWeight: 900, fontSize: 24,
                    textTransform: 'uppercase', margin: 0,
                    textShadow: '0 0 24px #4ade8088, 0 2px 4px rgba(0,0,0,0.8)',
                  }}>
                    ✨ Capturado!
                  </p>
                  <div style={{
                    animation: 'stars-burst 0.6s ease-out 0.2s forwards',
                    opacity: 0, fontSize: 28, marginTop: 6,
                  }}>⭐</div>
                </>
              ) : (
                <p style={{
                  color: '#f87171', fontWeight: 900, fontSize: 22,
                  textTransform: 'uppercase', margin: 0,
                  textShadow: '0 0 18px #f8717188, 0 2px 4px rgba(0,0,0,0.8)',
                }}>
                  💨 Escapou!
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── CABEÇALHO ── */}
        <div style={{
          textAlign: 'center', background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)', borderRadius: 20, padding: '16px 10px',
          border: `1px solid ${starColor}40`,
        }}>
          <p style={{ color: starColor, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 4px' }}>
            {PHASE_LABELS[raid.phase] || 'Raid'}
          </p>
          <h2 style={{
            color: '#fff', fontWeight: 900, fontSize: 24,
            textTransform: 'uppercase', fontStyle: 'italic', margin: 0,
            textShadow: `0 0 20px ${starColor}66`,
          }}>
            {raid.isShiny && <span style={{ marginRight: 8 }}>✨</span>}
            {raid.isAlpha && (
              <span style={{
                display: 'inline-block', background: 'linear-gradient(135deg,#dc2626,#ef4444)',
                color: '#fff', fontSize: 10, fontWeight: 900, borderRadius: 6,
                padding: '2px 7px', marginRight: 6, verticalAlign: 'middle',
                letterSpacing: 1, boxShadow: '0 0 8px #ef444488',
              }}>ALFA</span>
            )}
            {raid.name}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 14 }}>{'⭐'.repeat(raid.stars)}</span>
            <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              Nível {raid.level}
            </span>
            {raid.isAlpha && (
              <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 800 }}>+30% stats</span>
            )}
          </div>
        </div>

        {/* ── SPRITE ── */}
        <div style={{
          height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', margin: '10px 0',
        }}>
          {/* Brilho pulsante — vermelho para alfa, cor de estrela para padrão */}
          <div style={{
            position: 'absolute',
            width:  raid.isAlpha ? 170 : 140,
            height: raid.isAlpha ? 170 : 140,
            background: raid.isAlpha
              ? `radial-gradient(circle, ${isAlphaShiny ? '#b45309' : '#dc2626'}55 0%, transparent 70%)`
              : `radial-gradient(circle, ${starColor}44 0%, transparent 70%)`,
            borderRadius: '50%', animation: 'pulse 2s infinite ease-in-out',
          }} />

          {/* Aura vermelha extra para alfa */}
          {raid.isAlpha && (
            <div style={{
              position: 'absolute',
              width: 155, height: 155, borderRadius: '50%',
              border: `3px solid ${isAlphaShiny ? '#f59e0b' : '#ef4444'}88`,
              boxShadow: `0 0 20px ${isAlphaShiny ? '#f59e0b' : '#ef4444'}66, inset 0 0 20px ${isAlphaShiny ? '#f59e0b' : '#ef4444'}22`,
              animation: 'pulse 1.5s infinite ease-in-out',
              zIndex: 1,
            }} />
          )}

          <img
            ref={spriteRef}
            src={pokemonSprite}
            style={{
              width: raid.isAlpha ? 208 : 160,
              height: raid.isAlpha ? 208 : 160,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              position: 'relative', zIndex: 2,
              animation:
                catchAnim.phase === 'absorbing'                                      ? 'pokemon-absorb 0.4s ease-in forwards' :
                catchAnim.phase === 'result' && !catchAnim.caught                    ? 'pokemon-reappear 0.5s ease-out forwards' :
                (catchAnim.phase === 'shaking' || (catchAnim.phase === 'result' && catchAnim.caught)) ? 'none' :
                'float 3s infinite ease-in-out',
              opacity:
                (catchAnim.phase === 'shaking' || (catchAnim.phase === 'result' && catchAnim.caught)) ? 0 : 1,
              filter: isAlphaShiny
                ? 'drop-shadow(0 0 18px #fbbf24) drop-shadow(0 0 10px #ef4444)'
                : raid.isAlpha
                  ? 'drop-shadow(0 0 16px #ef4444) drop-shadow(0 0 6px #dc2626)'
                  : raid.isShiny
                    ? 'drop-shadow(0 0 15px #fbbf24)'
                    : `drop-shadow(0 0 10px ${starColor}66)`,
              transition: 'opacity 0.1s',
            }}
            alt={raid.name}
          />
        </div>

        {/* ── BARRA DE HP ── */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)', borderRadius: 20, padding: '16px 20px',
          border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>Energia da Raid</span>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>
              {raid.currentHp.toLocaleString()} / {raid.maxHp.toLocaleString()}
            </span>
          </div>
          <div style={{ background: '#1e293b', borderRadius: 99, height: 12, overflow: 'hidden', border: '1px solid #334155' }}>
            <div style={{
              height: '100%', borderRadius: 99, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              width: `${hpPct}%`,
              background: hpPct > 50
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : hpPct > 20
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
              boxShadow: `0 0 10px ${hpPct > 50 ? '#22c55e44' : hpPct > 20 ? '#f59e0b44' : '#ef444444'}`,
            }} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#475569', fontSize: 10, fontWeight: 700 }}>⏳ EXPIRA EM:</span>
            <span style={{ color: starColor, fontSize: 14, fontWeight: 900, fontFamily: 'monospace' }}>
              {formatTime(raid.phase === 'fighting' ? timeLeftFight : timeLeftExpire)}
            </span>
          </div>
        </div>

        {/* ── CONTEÚDO DINÂMICO ── */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>

          {/* IDLE */}
          {raid.phase === 'idle' && (
            <button
              onClick={onStart}
              style={{
                width: '100%', padding: 18, borderRadius: 20,
                background: `linear-gradient(135deg, ${starColor}, ${starColor}bb)`,
                color: '#fff', fontWeight: 900, fontSize: 15,
                textTransform: 'uppercase', letterSpacing: 2,
                border: 'none', cursor: 'pointer',
                boxShadow: `0 8px 25px ${starColor}44`,
                marginTop: 10,
              }}
            >
              ⚔️ Desafiar Raid
            </button>
          )}

          {/* FIGHTING */}
          {raid.phase === 'fighting' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: `1px solid ${starColor}40`,
                borderRadius: 20, padding: '16px 20px', textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
              }}>
                <p style={{ color: starColor, fontSize: 10, fontWeight: 800, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Seu Dano Contribuído
                </p>
                <p style={{ color: '#fff', fontSize: 32, fontWeight: 900, margin: 0, fontFamily: 'monospace', textShadow: `0 0 15px ${starColor}44` }}>
                  {raid.totalDamageDealt.toLocaleString()}
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '0 10px' }}>
                <p style={{ color: '#94a3b8', fontSize: 10, fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                  A Raid continua em segundo plano.<br />
                  <span style={{ color: '#64748b' }}>50% do seu dano em rotas é aplicado aqui!</span>
                </p>
              </div>
            </div>
          )}

          {/* CAPTURE */}
          {raid.phase === 'capture' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.82)',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                borderRadius: 18, padding: 14, textAlign: 'center',
              }}>
                <p style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 800, lineHeight: 1.35, margin: 0 }}>
                  Tente capturar agora, continue lutando para derrotar a raid ou saia sem capturar.
                </p>
              </div>
              <div style={{ textAlign: 'center', marginBottom: 5 }}>
                <p style={{ color: '#22c55e', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', margin: 0 }}>
                  Tentativas: {raid.catchAttemptsLeft}
                </p>
              </div>
              {balls.map(ball => (
                <button
                  key={ball.id}
                  disabled={ball.count === 0 || raid.catchAttemptsLeft === 0 || catchAnim.active}
                  onClick={() => handleBallClick(ball)}
                  style={{
                    padding: '12px 16px', borderRadius: 16,
                    background: ball.count > 0 ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.4)',
                    border: ball.count > 0 ? '1px solid #334155' : '1px solid #1e293b',
                    color: ball.count > 0 ? '#fff' : '#475569',
                    cursor: ball.count > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontWeight: 800, fontSize: 13,
                  }}
                >
                  <img src={ball.img} style={{ width: 24, height: 24 }} alt="" />
                  <span>{ball.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.7 }}>x{ball.count}</span>
                </button>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  disabled={catchAnim.active}
                  onClick={onContinueFight}
                  style={{
                    width: '100%', minHeight: 52, borderRadius: 18,
                    border: `2px solid ${starColor}66`,
                    background: `linear-gradient(135deg, ${starColor}33, rgba(15,23,42,0.92))`,
                    color: '#fff', fontWeight: 900, fontSize: 12,
                    textTransform: 'uppercase', letterSpacing: 1,
                    cursor: catchAnim.active ? 'not-allowed' : 'pointer',
                    opacity: catchAnim.active ? 0.45 : 1,
                  }}
                >
                  Continuar e tentar derrotar
                </button>
                <button
                  type="button"
                  disabled={catchAnim.active}
                  onClick={onForfeitCapture}
                  style={{
                    width: '100%', minHeight: 48, borderRadius: 18,
                    border: '1px solid rgba(248, 113, 113, 0.35)',
                    background: 'rgba(127, 29, 29, 0.72)',
                    color: '#fecaca', fontWeight: 900, fontSize: 11,
                    textTransform: 'uppercase', letterSpacing: 1,
                    cursor: catchAnim.active ? 'not-allowed' : 'pointer',
                    opacity: catchAnim.active ? 0.45 : 1,
                  }}
                >
                  Sair sem capturar
                </button>
              </div>
            </div>
          )}

          {/* REWARDS */}
          {raid.phase === 'rewards' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {raid.rewards.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    background: '#1e293b', borderRadius: 12, padding: '8px 12px', minWidth: 60,
                  }}>
                    <img src={REWARD_ICONS[r.id] || '💰'} style={{ width: 24, height: 24 }} alt="" />
                    <span style={{ color: '#fff', fontWeight: 900, fontSize: 12 }}>x{r.quantity}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={onClaimRewards}
                style={{
                  width: '100%', padding: 16, borderRadius: 18,
                  background: '#fff', color: '#0f172a',
                  fontWeight: 900, fontSize: 14, textTransform: 'uppercase',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.2)',
                }}
              >
                Coletar e Sair
              </button>
            </div>
          )}

          {/* ENDED */}
          {raid.phase === 'ended' && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <p style={{ color: '#ef4444', fontWeight: 900, fontSize: 16, textTransform: 'uppercase' }}>Raid Encerrada</p>
              <p style={{ color: '#64748b', fontSize: 12 }}>O Pokémon fugiu ou o tempo acabou.</p>
            </div>
          )}
        </div>

        {/* ── BOTÃO FECHAR ── */}
        {(raid.phase === 'idle' || raid.phase === 'fighting' || raid.phase === 'ended') && (
          <button
            onClick={onDismiss}
            style={{
              width: '100%', padding: 14, borderRadius: 18,
              background: '#fff', color: '#0f172a',
              fontWeight: 900, fontSize: 12, textTransform: 'uppercase',
              border: 'none', cursor: 'pointer',
              marginTop: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            {raid.phase === 'fighting' ? 'Voltar para Rotas' : 'Fechar'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RaidScreen;

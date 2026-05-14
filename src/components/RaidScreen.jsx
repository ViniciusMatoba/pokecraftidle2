import React, { useState, useEffect, useCallback } from 'react';

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
  // ── Pokébolas ──────────────────────────────────────────────────────────────
  pokeballs: `${POKEAPI_ITEMS}poke-ball.png`, // ✅ corrigido de 'pokeball'
  great_ball: `${POKEAPI_ITEMS}great-ball.png`,
  ultra_ball: `${POKEAPI_ITEMS}ultra-ball.png`,

  // ── Pedras de Evolução ────────────────────────────────────────────────────
  fire_stone: `${POKEAPI_ITEMS}fire-stone.png`, // ✅ corrigido
  water_stone: `${POKEAPI_ITEMS}water-stone.png`, // ✅ corrigido
  thunder_stone: `${POKEAPI_ITEMS}thunder-stone.png`,
  moon_stone: `${POKEAPI_ITEMS}moon-stone.png`,
  sun_stone: `${POKEAPI_ITEMS}sun-stone.png`,
  dawn_stone: `${POKEAPI_ITEMS}dawn-stone.png`,

  // ── Materiais especiais ───────────────────────────────────────────────────
  link_cable: `${POKEAPI_ITEMS}up-grade.png`, // ✅ substituto (link-cable não existe no PokeAPI)
  stardust: `${POKEAPI_ITEMS}stardust.png`,
  dragon_scale: `${POKEAPI_ITEMS}dragon-scale.png`,
  armor_fragment: `${POKEAPI_ITEMS}hard-stone.png`, // ✅ substituto visual mais próximo
  mega_stone_shard:`${POKEAPI_ITEMS}charizardite-x.png`, // ✅ substituto visual (mega stone)

  // ── TMs ──────────────────────────────────────────────────────────────────
  tm_flamethrower: `${POKEAPI_ITEMS}tm-fire.png`, // ✅ corrigido
  tm_thunderbolt: `${POKEAPI_ITEMS}tm-electric.png`, // ✅ corrigido
  tm_ice_beam: `${POKEAPI_ITEMS}tm-ice.png`, // ✅ corrigido

  // ── EXP Candies (sem sprite no PokeAPI — usar rare-candy como placeholder) ─
  rare_candy: `${POKEAPI_ITEMS}rare-candy.png`, // ✅ corrigido
  exp_candy_xs: `${POKEAPI_ITEMS}rare-candy.png`, // ✅ placeholder (PokeAPI não tem exp-candy-xs)
  exp_candy_s: `${POKEAPI_ITEMS}rare-candy.png`, // ✅ placeholder
  exp_candy_m: `${POKEAPI_ITEMS}rare-candy.png`, // ✅ placeholder
  exp_candy_l: `${POKEAPI_ITEMS}rare-candy.png`, // ✅ placeholder
  exp_candy_xl: `${POKEAPI_ITEMS}rare-candy.png`, // ✅ placeholder

  // ── Moeda ─────────────────────────────────────────────────────────────────
  currency: `${POKEAPI_ITEMS}nugget.png`,
};

const formatTime = (ms) => {
  if (ms <= 0) return '0:00';
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const RaidScreen = ({
  raid, gameState, onStart, onDismiss, onCatchAttempt, onCatchRoll, onClaimRewards, POKEDEX,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const [catchAnim, setCatchAnim] = useState({
    active: false,   // animação em progresso?
    phase: null,     // 'throwing' | 'absorbing' | 'shaking' | 'result'
    caught: false,   // resultado pré-computado
    ballImg: null,   // URL da sprite da bola usada
    ballId: null,    // 'pokeballs' | 'great_ball' | 'ultra_ball'
    shakes: 0,       // contador de tremidas (0-3)
  });

  if (!raid) return null;

  const hpPct = Math.max(0, (raid.currentHp / raid.maxHp) * 100);
  const timeLeftExpire = raid.expiresAt - now;
  const timeLeftFight  = raid.fightEndsAt ? raid.fightEndsAt - now : 0;
  const starColor = STAR_COLOR[raid.stars] || '#94a3b8';
  const pokemonSprite = raid.isShiny
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${raid.pokemonId}.png`
    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${raid.pokemonId}.png`;

  const balls = [
    { id: 'ultra_ball', label: 'Ultra Ball', count: gameState.inventory?.items?.ultra_ball || 0,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' },
    { id: 'great_ball', label: 'Great Ball', count: gameState.inventory?.items?.great_ball || 0,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' },
    { id: 'pokeballs',  label: 'Pokébola',   count: gameState.inventory?.items?.pokeballs  || 0,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
  ];

  const handleBallClick = useCallback((ball) => {
    if (catchAnim.active) return;           // bloqueia clique durante animação
    if (ball.count <= 0) return;
    if (raid.catchAttemptsLeft <= 0) return;

    // Pré-computa resultado ANTES da animação iniciar
    const caught = onCatchRoll(ball.id);

    setCatchAnim({ active: true, phase: 'throwing', caught, ballImg: ball.img, ballId: ball.id, shakes: 0 });

    // --- Timeline da animação ---
    // Fase 1: lançamento (0 → 500ms)
    // Fase 2: absorção (500 → 900ms)
    setTimeout(() => setCatchAnim(a => ({ ...a, phase: 'absorbing' })), 500);

    // Fase 3: tremida 1 (900ms)
    setTimeout(() => setCatchAnim(a => ({ ...a, phase: 'shaking', shakes: 1 })), 900);

    // Fase 4: tremida 2 (1300ms)
    setTimeout(() => setCatchAnim(a => ({ ...a, phase: 'shaking', shakes: 2 })), 1300);

    // Fase 5: tremida 3 — apenas se capturou (1700ms)
    if (caught) {
      setTimeout(() => setCatchAnim(a => ({ ...a, phase: 'shaking', shakes: 3 })), 1700);
    }

    // Fase 6: resultado (2100ms se capturou com 3 tremidas | 1700ms se falhou)
    const resultDelay = caught ? 2100 : 1700;
    setTimeout(() => setCatchAnim(a => ({ ...a, phase: 'result' })), resultDelay);

    // Fase 7: commit no gameState após mostrar resultado
    const commitDelay = resultDelay + 900;
    setTimeout(() => {
      onCatchAttempt(ball.id, caught);  // passa resultado pré-computado
      setCatchAnim({ active: false, phase: null, caught: false, ballImg: null, ballId: null, shakes: 0 });
    }, commitDelay);
  }, [catchAnim.active, raid, onCatchRoll, onCatchAttempt]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9990,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, background: `rgba(2,6,23,0.85) url('${import.meta.env.BASE_URL}raid_bg.png') center/cover no-repeat`,
      backdropFilter: 'blur(20px)',
    }}>
      <style>{`
        @keyframes ball-throw {
          0%   { transform: translateY(0px) scale(0.7); opacity: 0.6; }
          60%  { transform: translateY(-170px) scale(1.15); opacity: 1; }
          100% { transform: translateY(-160px) scale(1); opacity: 1; }
        }
        @keyframes ball-shake-1 {
          0%, 100% { transform: translateY(-160px) rotate(0deg); }
          25%       { transform: translateY(-160px) rotate(-18deg); }
          75%       { transform: translateY(-160px) rotate(18deg); }
        }
        @keyframes ball-shake-2 {
          0%, 100% { transform: translateY(-160px) rotate(0deg); }
          25%       { transform: translateY(-160px) rotate(-12deg); }
          75%       { transform: translateY(-160px) rotate(12deg); }
        }
        @keyframes ball-shake-3 {
          0%, 100% { transform: translateY(-160px) rotate(0deg); }
          25%       { transform: translateY(-160px) rotate(-8deg); }
          75%       { transform: translateY(-160px) rotate(8deg); }
        }
        @keyframes ball-caught-glow {
          0%, 100% { filter: drop-shadow(0 0 6px #fbbf24); transform: translateY(-160px) scale(1); }
          50%       { filter: drop-shadow(0 0 25px #fbbf24) brightness(1.4); transform: translateY(-160px) scale(1.15); }
        }
        @keyframes ball-escape-pop {
          0%   { transform: translateY(-160px) scale(1); opacity: 1; }
          40%  { transform: translateY(-160px) scale(1.4); opacity: 0.8; }
          100% { transform: translateY(-180px) scale(0.3); opacity: 0; }
        }
        @keyframes pokemon-absorb {
          0%   { opacity: 1; transform: scale(1); filter: brightness(1); }
          30%  { opacity: 0.8; transform: scale(0.9); filter: brightness(3); }
          70%  { opacity: 0.2; transform: scale(0.4); filter: brightness(5); }
          100% { opacity: 0; transform: scale(0.1); filter: brightness(10); }
        }
        @keyframes pokemon-reappear {
          0%   { opacity: 0; transform: scale(0.1); filter: brightness(5); }
          60%  { opacity: 0.8; transform: scale(1.05); filter: brightness(1.5); }
          100% { opacity: 1; transform: scale(1); filter: brightness(1); }
        }
        @keyframes result-text-in {
          0%   { opacity: 0; transform: scale(0.5) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0px); }
        }
        @keyframes stars-burst {
          0%   { opacity: 1; transform: scale(0); }
          60%  { opacity: 1; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(1.8); }
        }
      `}</style>
      {/* Brilho de fundo colorido pela estrela */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 30%, ${starColor}22, transparent 70%)`,
      }} />

      <div style={{ maxWidth: 420, width: '100%', position: 'relative', zIndex: 10, maxHeight: '95vh', display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* ── OVERLAY DE ANIMAÇÃO ── */}
        {catchAnim.active && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 50,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            {/* Pokébola animada */}
            {catchAnim.ballImg && (
              <img
                src={catchAnim.ballImg}
                alt=""
                style={{
                  width: 52, height: 52,
                  position: 'absolute',
                  bottom: '38%',
                  imageRendering: 'pixelated',
                  animation:
                    catchAnim.phase === 'throwing'  ? 'ball-throw 0.5s cubic-bezier(0.2,0.8,0.4,1) forwards' :
                    catchAnim.phase === 'absorbing' ? 'none' :
                    catchAnim.phase === 'shaking' && catchAnim.shakes === 1 ? 'ball-shake-1 0.4s ease-in-out' :
                    catchAnim.phase === 'shaking' && catchAnim.shakes === 2 ? 'ball-shake-2 0.4s ease-in-out' :
                    catchAnim.phase === 'shaking' && catchAnim.shakes === 3 ? 'ball-shake-3 0.4s ease-in-out' :
                    catchAnim.phase === 'result' && catchAnim.caught  ? 'ball-caught-glow 0.6s ease-in-out infinite' :
                    catchAnim.phase === 'result' && !catchAnim.caught ? 'ball-escape-pop 0.5s ease-in forwards' :
                    'none',
                  transform: (catchAnim.phase !== 'throwing') ? 'translateY(-160px)' : undefined,
                }}
              />
            )}

            {/* Texto de resultado */}
            {catchAnim.phase === 'result' && (
              <div style={{
                position: 'absolute', bottom: '18%',
                animation: 'result-text-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
                textAlign: 'center',
              }}>
                {catchAnim.caught ? (
                  <>
                    <p style={{ color: '#4ade80', fontWeight: 900, fontSize: 22, textTransform: 'uppercase',
                      textShadow: '0 0 20px #4ade8066', margin: 0 }}>
                      ✨ Capturado!
                    </p>
                    <div style={{ animation: 'stars-burst 0.6s ease-out 0.2s forwards', opacity: 0,
                      fontSize: 28, marginTop: 4 }}>⭐</div>
                  </>
                ) : (
                  <p style={{ color: '#f87171', fontWeight: 900, fontSize: 20, textTransform: 'uppercase',
                    textShadow: '0 0 15px #f8717166', margin: 0 }}>
                    💨 Escapou!
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* ── NOVO CABEÇALHO (TOPO) ── */}
        <div style={{
          textAlign: 'center', background: 'rgba(15, 23, 42, 0.6)', 
          backdropFilter: 'blur(10px)', borderRadius: 20, padding: '16px 10px',
          border: `1px solid ${starColor}40`
        }}>
          <p style={{ color: starColor, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 4px' }}>
            {PHASE_LABELS[raid.phase] || 'Raid'}
          </p>
          <h2 style={{ 
            color: '#fff', fontWeight: 900, fontSize: 24, 
            textTransform: 'uppercase', fontStyle: 'italic', margin: 0,
            textShadow: `0 0 20px ${starColor}66`
          }}>
            {raid.isShiny && <span style={{ marginRight: 8 }}>✨</span>}
            {raid.name}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 14 }}>{'⭐'.repeat(raid.stars)}</span>
            <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              Nível {raid.level}
            </span>
          </div>
        </div>

        {/* ── SPRITE CENTRALIZADO ── */}
        <div style={{ 
          height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', 
          position: 'relative', margin: '10px 0' 
        }}>
          {/* Brilho Pulsante Atrás */}
          <div style={{
            position: 'absolute', width: 140, height: 140,
            background: `radial-gradient(circle, ${starColor}44 0%, transparent 70%)`,
            borderRadius: '50%', animation: 'pulse 2s infinite ease-in-out'
          }} />
          
          <img
            src={pokemonSprite}
            style={{
              width: 160, height: 160, objectFit: 'contain',
              imageRendering: 'pixelated',
              position: 'relative', zIndex: 2,
              // Controle de animação por fase:
              animation:
                catchAnim.phase === 'absorbing' ? 'pokemon-absorb 0.4s ease-in forwards' :
                catchAnim.phase === 'result' && !catchAnim.caught ? 'pokemon-reappear 0.5s ease-out forwards' :
                (catchAnim.phase === 'shaking' || (catchAnim.phase === 'result' && catchAnim.caught)) ? 'none' :
                'float 3s infinite ease-in-out',
              opacity:
                (catchAnim.phase === 'shaking' || (catchAnim.phase === 'result' && catchAnim.caught)) ? 0 : 1,
              filter: raid.isShiny ? 'drop-shadow(0 0 15px #fbbf24)' : `drop-shadow(0 0 10px ${starColor}66)`,
              transition: 'opacity 0.1s',
            }}
            alt={raid.name}
          />
        </div>

        {/* ── BARRA DE HP (ABAIXO DO SPRITE) ── */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)', borderRadius: 20, padding: '16px 20px',
          border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
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
              boxShadow: `0 0 10px ${hpPct > 50 ? '#22c55e44' : hpPct > 20 ? '#f59e0b44' : '#ef444444'}`
            }} />
          </div>
          
          {/* Tempo Restante (Sempre visível abaixo do HP) */}
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#475569', fontSize: 10, fontWeight: 700 }}>⏳ EXPIRA EM:</span>
            <span style={{ color: starColor, fontSize: 14, fontWeight: 900, fontFamily: 'monospace' }}>
              {formatTime(raid.phase === 'fighting' ? timeLeftFight : timeLeftExpire)}
            </span>
          </div>
        </div>

        {/* ── SEÇÃO DE CONTEÚDO DINÂMICO ── */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          
          {/* ── IDLE / INÍCIO ── */}
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
                marginTop: 10
              }}
            >
              ⚔️ Desafiar Raid
            </button>
          )}

          {/* ── FIGHTING / EM COMBATE ── */}
          {raid.phase === 'fighting' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)', 
                border: `1px solid ${starColor}40`,
                borderRadius: 20, 
                padding: '16px 20px', 
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)'
              }}>
                <p style={{ color: starColor, fontSize: 10, fontWeight: 800, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Seu Dano Contribuído
                </p>
                <p style={{ 
                  color: '#fff', fontSize: 32, fontWeight: 900, margin: 0,
                  fontFamily: 'monospace', textShadow: `0 0 15px ${starColor}44`
                }}>
                  {raid.totalDamageDealt.toLocaleString()}
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '0 10px' }}>
                <p style={{ color: '#94a3b8', fontSize: 10, fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                  A Raid continua em segundo plano.<br/>
                  <span style={{ color: '#64748b' }}>50% do seu dano em rotas é aplicado aqui!</span>
                </p>
              </div>
            </div>
          )}

          {/* ── CAPTURE ── */}
          {raid.phase === 'capture' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            </div>
          )}

          {/* ── REWARDS ── */}
          {raid.phase === 'rewards' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {raid.rewards.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    background: '#1e293b', borderRadius: 12, padding: '8px 12px', minWidth: 60
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
                  boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
                }}
              >
                Coletar e Sair
              </button>
            </div>
          )}

          {/* ── ENDED ── */}
          {raid.phase === 'ended' && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <p style={{ color: '#ef4444', fontWeight: 900, fontSize: 16, textTransform: 'uppercase' }}>Raid Encerrada</p>
              <p style={{ color: '#64748b', fontSize: 12 }}>O Pokémon fugiu ou o tempo acabou.</p>
            </div>
          )}
        </div>

        {/* ── BOTÃO DE FECHAR (CONTRASTE ALTO) ── */}
        {(raid.phase === 'idle' || raid.phase === 'fighting' || raid.phase === 'ended') && (
          <button
            onClick={onDismiss}
            style={{
              width: '100%', padding: 14, borderRadius: 18,
              background: '#fff', color: '#0f172a',
              fontWeight: 900, fontSize: 12, textTransform: 'uppercase',
              border: 'none', cursor: 'pointer',
              marginTop: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'transform 0.1s active:scale-95'
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

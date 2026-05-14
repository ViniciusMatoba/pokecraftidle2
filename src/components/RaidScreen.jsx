import React, { useState, useEffect } from 'react';

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

const REWARD_ICONS = {
  rare_candy:      `${import.meta.env.BASE_URL}items/rare_candy.png`,
  ultra_ball:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
  great_ball:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
  fire_stone:      `${import.meta.env.BASE_URL}items/fire_stone.png`,
  water_stone:     `${import.meta.env.BASE_URL}items/water_stone.png`,
  thunder_stone:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png',
  moon_stone:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png',
  sun_stone:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png',
  dawn_stone:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dawn-stone.png',
  link_cable:      `${import.meta.env.BASE_URL}items/link_cable.png`,
  
  // Custom High-Quality Local Assets
  tm_flamethrower: `${import.meta.env.BASE_URL}items/tm_fire.png`,
  tm_thunderbolt:  `${import.meta.env.BASE_URL}items/tm_electric.png`,
  tm_ice_beam:     `${import.meta.env.BASE_URL}items/tm_ice.png`,
  stardust:        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/stardust.png',
  dragon_scale:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-scale.png',
  armor_fragment:  `${import.meta.env.BASE_URL}items/armor_fragment.png`,
  mega_stone_shard:`${import.meta.env.BASE_URL}items/mega_stone_shard.png`,
  
  // EXP Candies (Local Premium Assets)
  exp_candy_xs:    `${import.meta.env.BASE_URL}items/exp_candy_xs.png`,
  exp_candy_s:     `${import.meta.env.BASE_URL}items/exp_candy_s.png`,
  exp_candy_m:     `${import.meta.env.BASE_URL}items/exp_candy_m.png`,
  exp_candy_l:     `${import.meta.env.BASE_URL}items/exp_candy_l.png`,
  exp_candy_xl:    `${import.meta.env.BASE_URL}items/exp_candy_xl.png`,
  
  currency:        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/relic-gold-coin.png',
};

const formatTime = (ms) => {
  if (ms <= 0) return '0:00';
  const s = Math.ceil(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const RaidScreen = ({
  raid,
  gameState,
  onStart,
  onDismiss,
  onCatchAttempt,
  onClaimRewards,
  POKEDEX,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!raid) return null;

  const hpPct = Math.max(0, (raid.currentHp / raid.maxHp) * 100);
  const timeLeftExpire = raid.expiresAt - now;
  const timeLeftFight  = raid.fightEndsAt ? raid.fightEndsAt - now : 0;
  const starColor = STAR_COLOR[raid.stars] || '#94a3b8';
  const pokemonSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${raid.pokemonId}.png`;

  const balls = [
    { id: 'ultra_ball', label: 'Ultra Ball', count: gameState.inventory?.items?.ultra_ball || 0,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' },
    { id: 'great_ball', label: 'Great Ball', count: gameState.inventory?.items?.great_ball || 0,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' },
    { id: 'pokeballs',  label: 'Pokébola',   count: gameState.inventory?.items?.pokeballs  || 0,
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9990,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, background: `rgba(2,6,23,0.85) url('${import.meta.env.BASE_URL}raid_bg.png') center/cover no-repeat`,
      backdropFilter: 'blur(20px)',
    }}>
      {/* Brilho de fundo colorido pela estrela */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 30%, ${starColor}22, transparent 70%)`,
      }} />

      <div style={{ maxWidth: 420, width: '100%', position: 'relative', zIndex: 10, maxHeight: '95vh', display: 'flex', flexDirection: 'column', gap: 12 }}>
        
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
              filter: raid.isShiny ? 'drop-shadow(0 0 15px #fbbf24)' : `drop-shadow(0 0 10px ${starColor}66)`,
              imageRendering: 'pixelated',
              position: 'relative', zIndex: 2,
              animation: 'float 3s infinite ease-in-out'
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
                  disabled={ball.count === 0 || raid.catchAttemptsLeft === 0}
                  onClick={() => onCatchAttempt(ball.id)}
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

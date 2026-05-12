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
  rare_candy:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png',
  ultra_ball:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
  great_ball:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
  fire_stone:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png',
  water_stone:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png',
  thunder_stone:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png',
  moon_stone:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png',
  sun_stone:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png',
  dawn_stone:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dawn-stone.png',
  tm_flamethrower: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fire.png',
  tm_thunderbolt:  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-electric.png',
  tm_ice_beam:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-ice.png',
  stardust:        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/stardust.png',
  dragon_scale:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-scale.png',
  armor_fragment:  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hard-stone.png',
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
      padding: 16, background: 'rgba(2,6,23,0.97)',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Brilho de fundo colorido pela estrela */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 30%, ${starColor}22, transparent 70%)`,
      }} />

      <div style={{ maxWidth: 480, width: '100%', position: 'relative', zIndex: 10, maxHeight: '90vh', overflowY: 'auto' }}>

        {/* ── Header ── */}
        <div style={{
          background: '#0f172a', borderRadius: 24, padding: '20px 24px',
          marginBottom: 14, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', border: `2px solid ${starColor}40`,
        }}>
          <div>
            <p style={{ color: '#64748b', fontSize: 9, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 4px' }}>
              {PHASE_LABELS[raid.phase] || 'Raid'}
            </p>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20,
              textTransform: 'uppercase', fontStyle: 'italic', margin: 0 }}>
              {raid.isShiny && <span style={{ marginRight: 6 }}>✨</span>}
              {raid.name}
            </h2>
            <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
              <span style={{ color: starColor, fontSize: 14 }}>{'⭐'.repeat(raid.stars)}</span>
              <span style={{ color: '#475569', fontSize: 10, fontWeight: 700 }}>
                Nível {raid.level}
              </span>
            </div>
          </div>
          <img
            src={pokemonSprite}
            style={{
              width: 80, height: 80, objectFit: 'contain',
              filter: raid.isShiny ? 'drop-shadow(0 0 12px #fbbf24)' : `drop-shadow(0 0 8px ${starColor}44)`,
              imageRendering: 'pixelated',
            }}
            alt={raid.name}
          />
        </div>

        {/* ── HP Bar ── */}
        <div style={{
          background: '#0f172a', borderRadius: 20, padding: '16px 20px',
          marginBottom: 14, border: '1px solid #1e293b',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            marginBottom: 8, alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>HP da Raid</span>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>
              {raid.currentHp.toLocaleString()} / {raid.maxHp.toLocaleString()}
            </span>
          </div>
          <div style={{ background: '#1e293b', borderRadius: 99, height: 14, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99, transition: 'width 0.5s ease',
              width: `${hpPct}%`,
              background: hpPct > 50
                ? 'linear-gradient(90deg,#22c55e,#4ade80)'
                : hpPct > 20
                  ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                  : 'linear-gradient(90deg,#ef4444,#f87171)',
            }} />
          </div>
          {raid.totalDamageDealt > 0 && (
            <p style={{ color: '#475569', fontSize: 9, fontWeight: 700,
              marginTop: 8, textAlign: 'right', textTransform: 'uppercase' }}>
              Dano total acumulado: {raid.totalDamageDealt.toLocaleString()}
            </p>
          )}
        </div>

        {/* ── IDLE ── */}
        {raid.phase === 'idle' && (
          <div>
            <div style={{
              background: '#0f172a', borderRadius: 20, padding: 20,
              marginBottom: 14, border: '1px solid #1e293b', textAlign: 'center',
            }}>
              <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>
                ⏱️ Tempo para expirar:
              </p>
              <p style={{ color: starColor, fontSize: 30, fontWeight: 900, fontFamily: 'monospace', margin: 0 }}>
                {formatTime(timeLeftExpire)}
              </p>
              <p style={{ color: '#334155', fontSize: 10, fontWeight: 700, marginTop: 8 }}>
                {'⭐'.repeat(raid.stars)} Dificuldade {raid.stars}/5
              </p>
            </div>
            <button
              onClick={onStart}
              style={{
                width: '100%', padding: 18, borderRadius: 20,
                background: `linear-gradient(135deg, ${starColor}, ${starColor}bb)`,
                color: '#fff', fontWeight: 900, fontSize: 15,
                textTransform: 'uppercase', letterSpacing: 2,
                border: 'none', cursor: 'pointer',
                boxShadow: `0 8px 28px ${starColor}50`,
                marginBottom: 12,
              }}
            >
              ⚔️ Entrar na Raid
            </button>
            <button
              onClick={onDismiss}
              style={{
                width: '100%', padding: 12, borderRadius: 16,
                background: 'transparent', color: '#475569',
                fontWeight: 700, fontSize: 11, textTransform: 'uppercase',
                border: '1px solid #1e293b', cursor: 'pointer',
              }}
            >
              Ignorar Raid
            </button>
          </div>
        )}

        {/* ── FIGHTING ── */}
        {raid.phase === 'fighting' && (
          <div>
            <div style={{
              background: '#0f172a', borderRadius: 20, padding: 20,
              marginBottom: 14, border: `2px solid ${starColor}30`,
              display: 'flex', justifyContent: 'space-around', textAlign: 'center',
            }}>
              <div>
                <p style={{ color: '#64748b', fontSize: 9, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>Tempo</p>
                <p style={{ color: timeLeftFight < 30000 ? '#ef4444' : '#fff',
                  fontSize: 26, fontWeight: 900, fontFamily: 'monospace', margin: 0 }}>
                  {formatTime(timeLeftFight)}
                </p>
              </div>
              <div style={{ width: 1, background: '#1e293b' }} />
              <div>
                <p style={{ color: '#64748b', fontSize: 9, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 6px' }}>Seu Dano</p>
                <p style={{ color: starColor, fontSize: 26, fontWeight: 900, margin: 0 }}>
                  {raid.totalDamageDealt.toLocaleString()}
                </p>
              </div>
            </div>
            <div style={{
              background: `${starColor}12`, border: `1px solid ${starColor}30`,
              borderRadius: 16, padding: 16, textAlign: 'center',
            }}>
              <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, margin: 0 }}>
                ⚔️ Continue batalhando normalmente!
              </p>
              <p style={{ color: '#475569', fontSize: 10, fontWeight: 600, margin: '6px 0 0' }}>
                50% do dano causado é aplicado à raid automaticamente.
              </p>
            </div>
            <button
              onClick={onDismiss}
              style={{
                width: '100%', padding: 12, borderRadius: 16, marginTop: 12,
                background: 'transparent', color: '#475569',
                fontWeight: 700, fontSize: 11, textTransform: 'uppercase',
                border: '1px solid #1e293b', cursor: 'pointer',
              }}
            >
              Fechar (batalha continua)
            </button>
          </div>
        )}

        {/* ── CAPTURE ── */}
        {raid.phase === 'capture' && (
          <div>
            <div style={{
              background: '#0f172a', borderRadius: 20, padding: 20,
              marginBottom: 14, border: '1px solid #22c55e30', textAlign: 'center',
            }}>
              <p style={{ color: '#4ade80', fontWeight: 900, fontSize: 14,
                textTransform: 'uppercase', margin: '0 0 8px' }}>
                {raid.currentHp <= 0 ? '💥 Derrotado!' : '⚠️ HP Crítico!'} Tente capturar!
              </p>
              <p style={{ color: '#64748b', fontSize: 12, fontWeight: 700, margin: 0 }}>
                Tentativas restantes: <span style={{ color: '#fff' }}>{raid.catchAttemptsLeft}</span>
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {balls.map(ball => (
                <button
                  key={ball.id}
                  disabled={ball.count === 0 || raid.catchAttemptsLeft === 0}
                  onClick={() => onCatchAttempt(ball.id)}
                  style={{
                    padding: '14px 20px', borderRadius: 16,
                    background: ball.count > 0 ? '#1e293b' : '#0f172a',
                    border: ball.count > 0 ? '2px solid #334155' : '2px solid #1e293b',
                    color: ball.count > 0 ? '#fff' : '#334155',
                    cursor: ball.count > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: 12,
                    fontWeight: 900, fontSize: 13,
                  }}
                >
                  <img src={ball.img} style={{ width: 28, height: 28 }} alt="" />
                  <span>{ball.label}</span>
                  <span style={{ marginLeft: 'auto', color: '#475569', fontSize: 11 }}>
                    x{ball.count}
                  </span>
                </button>
              ))}
            </div>
            {raid.catchAttemptsLeft === 0 && (
              <button
                onClick={onClaimRewards}
                style={{
                  width: '100%', padding: 16, borderRadius: 20, marginTop: 14,
                  background: '#1e293b', color: '#94a3b8',
                  fontWeight: 900, fontSize: 13, textTransform: 'uppercase',
                  border: 'none', cursor: 'pointer',
                }}
              >
                Ir para Recompensas →
              </button>
            )}
          </div>
        )}

        {/* ── REWARDS ── */}
        {raid.phase === 'rewards' && (
          <div>
            {raid.captured && (
              <div style={{
                background: 'linear-gradient(135deg,#16a34a20,#15803d20)',
                borderRadius: 20, padding: 16, marginBottom: 14,
                border: '1px solid #16a34a40', textAlign: 'center',
              }}>
                <p style={{ color: '#4ade80', fontWeight: 900, fontSize: 15,
                  textTransform: 'uppercase', margin: 0 }}>
                  ✅ {raid.name} Capturado{raid.isShiny ? ' (✨ SHINY!)' : ''}!
                </p>
              </div>
            )}
            {!raid.captured && (
              <div style={{
                background: '#1e293b22', borderRadius: 20, padding: 12, marginBottom: 14,
                border: '1px solid #ef444430', textAlign: 'center',
              }}>
                <p style={{ color: '#ef4444', fontWeight: 700, fontSize: 12, margin: 0 }}>
                  😔 {raid.name} escapou... mas você ganhou recompensas!
                </p>
              </div>
            )}
            <div style={{
              background: '#0f172a', borderRadius: 20, padding: 20,
              marginBottom: 14, border: '1px solid #1e293b',
            }}>
              <p style={{ color: '#94a3b8', fontSize: 10, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>
                🎁 Recompensas obtidas:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {raid.rewards.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 4, background: '#1e293b', borderRadius: 14, padding: '10px 14px',
                    border: '1px solid #334155',
                  }}>
                    {REWARD_ICONS[r.id]
                      ? <img src={REWARD_ICONS[r.id]} style={{ width: 32, height: 32 }} alt="" />
                      : <span style={{ fontSize: 24 }}>💰</span>
                    }
                    <span style={{ color: starColor, fontWeight: 900, fontSize: 13 }}>
                      x{r.quantity}
                    </span>
                    <span style={{ color: '#475569', fontSize: 8, textTransform: 'uppercase', textAlign: 'center' }}>
                      {r.id.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={onClaimRewards}
              style={{
                width: '100%', padding: 18, borderRadius: 20,
                background: `linear-gradient(135deg,${starColor},${starColor}bb)`,
                color: '#fff', fontWeight: 900, fontSize: 15,
                textTransform: 'uppercase', letterSpacing: 2,
                border: 'none', cursor: 'pointer',
                boxShadow: `0 8px 28px ${starColor}50`,
              }}
            >
              🎁 Coletar Recompensas
            </button>
          </div>
        )}

        {/* ── ENDED / EXPIRADO ── */}
        {raid.phase === 'ended' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: '#0f172a', borderRadius: 20, padding: 24,
              marginBottom: 14, border: '1px solid #ef444430',
            }}>
              <p style={{ fontSize: 40, margin: '0 0 12px' }}>⏰</p>
              <p style={{ color: '#ef4444', fontWeight: 900, fontSize: 15,
                textTransform: 'uppercase', margin: '0 0 8px' }}>
                Raid Expirada!
              </p>
              <p style={{ color: '#475569', fontSize: 12, fontWeight: 700, margin: 0 }}>
                {raid.name} fugiu antes que você pudesse agir.
              </p>
            </div>
            <button
              onClick={onDismiss}
              style={{
                width: '100%', padding: 16, borderRadius: 20,
                background: '#1e293b', color: '#94a3b8',
                fontWeight: 900, fontSize: 13, textTransform: 'uppercase',
                border: 'none', cursor: 'pointer',
              }}
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaidScreen;

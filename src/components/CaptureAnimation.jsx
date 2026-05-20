import React, { useState, useEffect } from 'react';
import { getPokemonSpriteUrl } from '../utils/pokemonSprites';
import { getPokeballDef } from '../data/pokeballs';

/**
 * CaptureAnimation — overlay de captura com 5 fases:
 *  1. Arremesso (700ms)  — bola viaja do jogador até o inimigo
 *  2. Absorção  (500ms)  — sprite do inimigo desaparece
 *  3. Chacoalhar (2100ms) — bola balança 3× (420ms cada)
 *  4. Resultado  (1400ms) — sucesso ou fuga
 *  5. Saída      (400ms)  — fade-out
 *
 * Props:
 *  captureEvent: { ballType, result:'success'|'fail', pokemonId, pokemonName, isShiny }
 *  onDone: () => void
 */

const PHASES = ['throw', 'absorb', 'shake', 'result', 'exit'];
const PHASE_DURATIONS = { throw: 700, absorb: 500, shake: 2100, result: 1400, exit: 400 };

export default function CaptureAnimation({ captureEvent, onDone }) {
  const [phase, setPhase] = useState('throw');
  const [shakeCount, setShakeCount] = useState(0);

  const { ballType = 'pokeballs', result, pokemonId, pokemonName, isShiny } = captureEvent || {};
  const ballDef = getPokeballDef(ballType);
  const ballImg  = ballDef?.sprite  || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  const ballColor = ballDef?.color  || '#ee1515';
  const ballGlow  = ballDef?.glowColor || 'rgba(238,21,21,0.5)';

  const spriteUrl = pokemonId ? getPokemonSpriteUrl({ id: pokemonId, isShiny }) : null;

  // Sequenciador de fases
  useEffect(() => {
    let timer;
    const advance = (next, delay) => { timer = setTimeout(() => setPhase(next), delay); };

    if (phase === 'throw')   advance('absorb',  PHASE_DURATIONS.throw);
    if (phase === 'absorb')  advance('shake',   PHASE_DURATIONS.absorb);
    if (phase === 'shake')   advance('result',  PHASE_DURATIONS.shake);
    if (phase === 'result')  advance('exit',    PHASE_DURATIONS.result);
    if (phase === 'exit')    { timer = setTimeout(onDone, PHASE_DURATIONS.exit); }

    return () => clearTimeout(timer);
  }, [phase, onDone]);

  // Contador de chacoalhos para animação
  useEffect(() => {
    if (phase !== 'shake') { setShakeCount(0); return; }
    let count = 0;
    const iv = setInterval(() => {
      count += 1;
      setShakeCount(count);
      if (count >= 3) clearInterval(iv);
    }, 700);
    return () => clearInterval(iv);
  }, [phase]);

  const success = result === 'success';

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none overflow-hidden"
      style={{
        background: phase === 'result' || phase === 'exit'
          ? success
            ? 'radial-gradient(ellipse at center, rgba(250,245,200,0.92) 0%, rgba(250,245,200,0.65) 60%, transparent 100%)'
            : 'radial-gradient(ellipse at center, rgba(255,80,80,0.18) 0%, transparent 70%)'
          : 'transparent',
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.4s ease' : 'background 0.3s',
      }}
    >
      <style>{`
        /* ── Arremesso ── */
        @keyframes ballThrow {
          0%   { transform: translate(80px, 80px) scale(0.5) rotate(0deg);   opacity: 0.9; }
          40%  { transform: translate(0px, -30px) scale(1.1) rotate(-200deg); opacity: 1;   }
          100% { transform: translate(0px, 0px) scale(1) rotate(-360deg);     opacity: 1;   }
        }
        /* ── Absorção (inimigo desaparece) ── */
        @keyframes pokeAbsorb {
          0%   { opacity: 1; transform: scale(1);   filter: brightness(1); }
          40%  { opacity: 0.7; transform: scale(0.7); filter: brightness(3) saturate(0); }
          100% { opacity: 0; transform: scale(0.1);  filter: brightness(5); }
        }
        /* ── Chacoalhar ── */
        @keyframes ballShake {
          0%   { transform: rotate(0deg)   translateY(0); }
          15%  { transform: rotate(-22deg) translateY(-4px); }
          35%  { transform: rotate(22deg)  translateY(-2px); }
          55%  { transform: rotate(-14deg) translateY(-3px); }
          75%  { transform: rotate(14deg)  translateY(-1px); }
          90%  { transform: rotate(-6deg)  translateY(0); }
          100% { transform: rotate(0deg)   translateY(0); }
        }
        /* ── Tremor de impacto ── */
        @keyframes ballLand {
          0%   { transform: scale(1.4); }
          60%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        /* ── Lock / capturado ── */
        @keyframes lockPop {
          0%   { opacity: 0; transform: scale(0.2) rotate(-45deg); }
          60%  { opacity: 1; transform: scale(1.3) rotate(8deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        /* ── Partículas de estrela ── */
        @keyframes starBurst {
          0%   { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0.3); }
        }
        /* ── Fuga ── */
        @keyframes ballBreak {
          0%   { transform: scale(1) rotate(0deg); }
          30%  { transform: scale(1.2) rotate(-15deg); }
          60%  { transform: scale(0.8) rotate(20deg); }
          100% { transform: scale(1.5) rotate(0deg); opacity: 0; }
        }
        @keyframes pokemonEscape {
          0%   { opacity: 0; transform: scale(0.1); }
          50%  { opacity: 1; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        /* ── Pulso do glow ── */
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 12px 4px var(--glow); }
          50%      { box-shadow: 0 0 28px 12px var(--glow); }
        }
        /* ── Texto de resultado ── */
        @keyframes resultText {
          0%   { opacity: 0; transform: translateY(12px) scale(0.8); }
          25%  { opacity: 1; transform: translateY(0) scale(1.05); }
          85%  { opacity: 1; }
          100% { opacity: 0.6; transform: translateY(-4px); }
        }
      `}</style>

      {/* ─── Sprite do inimigo durante arremesso/absorção ─── */}
      {(phase === 'throw' || phase === 'absorb') && spriteUrl && (
        <img
          src={spriteUrl}
          alt={pokemonName}
          style={{
            width: 96, height: 96, objectFit: 'contain', imageRendering: 'pixelated',
            position: 'absolute', top: '30%',
            animation: phase === 'absorb' ? 'pokeAbsorb 0.5s ease-in forwards' : 'none',
            filter: isShiny ? 'drop-shadow(0 0 8px gold)' : 'none',
          }}
        />
      )}

      {/* ─── Pokébola ─── */}
      {(phase === 'throw' || phase === 'absorb' || phase === 'shake' || phase === 'result') && (
        <div style={{ position: 'relative', zIndex: 2 }}>
          <img
            src={ballImg}
            alt="pokébola"
            style={{
              width: 56, height: 56, imageRendering: 'pixelated',
              animation:
                phase === 'throw'  ? 'ballThrow 0.7s cubic-bezier(0.22,1,0.36,1) forwards' :
                phase === 'absorb' ? 'ballLand 0.4s ease-out forwards' :
                phase === 'shake'  ? `ballShake 0.65s ease-in-out ${shakeCount < 3 ? 'infinite' : '1'} forwards` :
                phase === 'result' && success ? 'glowPulse 0.8s ease-in-out infinite' :
                phase === 'result' && !success ? 'ballBreak 0.5s ease-out forwards' :
                'none',
              filter: `drop-shadow(0 0 6px ${ballColor})`,
              '--glow': ballGlow,
            }}
          />

          {/* ── Anel de absorção quando a bola fecha ── */}
          {phase === 'absorb' && (
            <div style={{
              position: 'absolute', inset: -10, borderRadius: '50%',
              border: `3px solid ${ballColor}`,
              animation: 'ballRingExpand 0.5s ease-out forwards',
              boxShadow: `0 0 12px 4px ${ballGlow}`,
            }} />
          )}

          {/* ── Check de captura bem-sucedida ── */}
          {phase === 'result' && success && (
            <div style={{
              position: 'absolute', top: -16, right: -16,
              width: 28, height: 28, borderRadius: '50%',
              background: '#22c55e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'lockPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
              boxShadow: '0 0 8px rgba(34,197,94,0.8)',
            }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* ─── Partículas de estrela (captura) ─── */}
      {phase === 'result' && success && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(10)].map((_, i) => {
            const angle = (i / 10) * 360;
            const dist  = 55 + Math.random() * 35;
            const sx    = Math.cos((angle * Math.PI) / 180) * dist + 'px';
            const sy    = Math.sin((angle * Math.PI) / 180) * dist + 'px';
            const size  = 8 + (i % 3) * 5;
            const colors = ['#fbbf24','#f59e0b','#fde68a','#fff','#a3e635'];
            return (
              <div key={i} style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: size, height: size,
                marginLeft: -size/2, marginTop: -size/2,
                background: colors[i % colors.length],
                borderRadius: i % 2 === 0 ? '50%' : '2px',
                animation: `starBurst 0.9s ease-out ${0.05 * i}s forwards`,
                '--sx': sx, '--sy': sy,
              }} />
            );
          })}
        </div>
      )}

      {/* ─── Sprite de fuga ─── */}
      {phase === 'result' && !success && spriteUrl && (
        <img
          src={spriteUrl}
          alt={pokemonName}
          style={{
            position: 'absolute', top: '22%',
            width: 96, height: 96, objectFit: 'contain', imageRendering: 'pixelated',
            animation: 'pokemonEscape 0.5s ease-out forwards',
          }}
        />
      )}

      {/* ─── Texto de resultado ─── */}
      {phase === 'result' && (
        <div style={{
          position: 'absolute', bottom: '22%',
          textAlign: 'center',
          animation: `resultText ${PHASE_DURATIONS.result}ms ease-in-out forwards`,
        }}>
          {success ? (
            <>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 14, color: '#166534',
                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                marginBottom: 6,
              }}>
                {isShiny ? '✨ SHINY ' : ''}Capturado!
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9, color: '#15803d',
                opacity: 0.85,
              }}>
                {pokemonName} agora é seu!
              </div>
            </>
          ) : (
            <>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 14, color: '#dc2626',
                textShadow: '0 2px 8px rgba(0,0,0,0.15)',
                marginBottom: 6,
              }}>
                Fugiu!
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9, color: '#991b1b',
                opacity: 0.8,
              }}>
                {pokemonName} escapou da Pokébola!
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

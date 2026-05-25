import React from 'react';

// Partículas de energia que orbitam o pokémon alfa
const EMBER_POINTS = [
  { x: 50, y: 6,  size: 5, delay: 0 },
  { x: 82, y: 22, size: 4, delay: 0.18 },
  { x: 94, y: 55, size: 6, delay: 0.36 },
  { x: 78, y: 84, size: 4, delay: 0.54 },
  { x: 50, y: 93, size: 5, delay: 0.72 },
  { x: 22, y: 82, size: 4, delay: 0.90 },
  { x: 6,  y: 52, size: 6, delay: 1.08 },
  { x: 20, y: 22, size: 4, delay: 1.26 },
];

export default function AlphaAuraEffect({ compact = false, isAlsoShiny = false }) {
  // Alfa+Shiny usa âmbar-avermelhado; alfa puro usa vermelho
  const primary   = isAlsoShiny ? '#ef4444' : '#dc2626';
  const secondary = isAlsoShiny ? '#f97316' : '#ef4444';
  const glow      = isAlsoShiny ? 'rgba(249,115,22,0.55)' : 'rgba(239,68,68,0.55)';
  const glowFaint = isAlsoShiny ? 'rgba(249,115,22,0.22)' : 'rgba(239,68,68,0.22)';

  return (
    <div className={`absolute inset-0 pointer-events-none ${compact ? 'z-[31]' : 'z-[41]'}`}>
      <style>{`
        @keyframes alpha-aura-breathe {
          0%, 100% { opacity: 0.30; transform: translate(-50%, -50%) scale(0.94); }
          50%       { opacity: 0.55; transform: translate(-50%, -50%) scale(1.06); }
        }
        @keyframes alpha-ring-spin {
          0%   { opacity: 0.45; transform: translate(-50%, -50%) scale(0.97) rotate(0deg); }
          50%  { opacity: 0.65; transform: translate(-50%, -50%) scale(1.03) rotate(180deg); }
          100% { opacity: 0.45; transform: translate(-50%, -50%) scale(0.97) rotate(360deg); }
        }
        @keyframes alpha-ember-float {
          0%   { opacity: 0;    transform: translate(-50%, -50%) scale(0.4) translateY(0px); }
          20%  { opacity: 0.90; }
          100% { opacity: 0;    transform: translate(-50%, -50%) scale(0.25) translateY(-22px); }
        }
      `}</style>

      {/* Aura de fundo — radial vermelho pulsante */}
      <div
        className="absolute rounded-full"
        style={{
          left: compact ? '50%' : '50%',
          top:  compact ? '50%' : '48%',
          width:  compact ? 80 : 110,
          height: compact ? 80 : 110,
          background: `radial-gradient(circle, ${glow}, ${glowFaint} 50%, transparent 72%)`,
          animation: 'alpha-aura-breathe 2.2s ease-in-out infinite',
        }}
      />

      {/* Borda circular rotativa */}
      <div
        className="absolute rounded-full"
        style={{
          left:   compact ? '50%' : '50%',
          top:    compact ? '50%' : '48%',
          width:  compact ? 72 : 100,
          height: compact ? 72 : 100,
          border: `2px solid ${primary}66`,
          boxShadow: `0 0 12px ${primary}55, inset 0 0 10px ${primary}22`,
          animation: 'alpha-ring-spin 4s linear infinite',
        }}
      />

      {/* Partículas de brasa orbitando */}
      {EMBER_POINTS.map((pt, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left:   `${pt.x}%`,
            top:    `${pt.y}%`,
            width:  pt.size,
            height: pt.size,
            background: i % 2 === 0 ? primary : secondary,
            boxShadow: `0 0 ${pt.size + 2}px ${primary}`,
            animation: `alpha-ember-float ${1.6 + pt.delay * 0.4}s ease-out ${pt.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

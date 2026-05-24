import React from 'react';
import { getPokeballDef } from '../../data/pokeballs';

const PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const distance = i % 3 === 0 ? 52 : i % 3 === 1 ? 38 : 28;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    delay: i * 0.035,
  };
});

const EFFECT_ICONS = {
  nature: ['+', '+', '+'],
  splash: ['~', '~', '~'],
  hearts: ['♥', '♥', '♥'],
  moonbeam: ['•', '•', '•'],
};

export default function PokemonEntranceEffect({ ballId = 'pokeballs' }) {
  const def = getPokeballDef(ballId);
  const color = def.color || '#ee1515';
  const glowColor = def.glowColor || 'rgba(238,21,21,0.6)';
  const effect = def.effect || 'flash';

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
      <style>{`
        @keyframes entrance-ball-open {
          0% { opacity: 0; transform: translateY(28px) scale(0.42) rotate(-90deg); }
          28% { opacity: 1; transform: translateY(0) scale(1.05) rotate(12deg); }
          46% { opacity: 1; transform: translateY(0) scale(0.92) rotate(0deg); }
          72% { opacity: 0.95; transform: translateY(-8px) scale(1.15) rotate(0deg); }
          100% { opacity: 0; transform: translateY(-10px) scale(1.32) rotate(0deg); }
        }
        @keyframes entrance-core-flash {
          0% { opacity: 0; transform: scale(0.22); }
          28% { opacity: 0.95; transform: scale(0.72); }
          100% { opacity: 0; transform: scale(2.4); }
        }
        @keyframes entrance-ring {
          0% { opacity: 0; transform: scale(0.24); }
          24% { opacity: 0.9; }
          100% { opacity: 0; transform: scale(2.05); }
        }
        @keyframes entrance-particle {
          0% { opacity: 0; transform: translate(0, 0) scale(0.35); }
          24% { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(0.16); }
        }
        @keyframes entrance-lightning {
          0% { opacity: 0; transform: rotate(var(--rot)) scaleY(0.3); }
          35% { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--rot)) scaleY(1.9) translateY(-16px); }
        }
        @keyframes entrance-beam {
          0% { opacity: 0; transform: translateX(-50%) scaleY(0); }
          35% { opacity: 0.85; }
          100% { opacity: 0; transform: translateX(-50%) scaleY(1.25); }
        }
        @keyframes entrance-speed {
          0% { opacity: 0; transform: translateX(-46px) scaleX(0.4); }
          35% { opacity: 0.9; }
          100% { opacity: 0; transform: translateX(46px) scaleX(1.6); }
        }
        @keyframes entrance-heavy {
          0% { opacity: 0; transform: scale(0.45); }
          30% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.2); }
        }
      `}</style>

      <div
        className="absolute h-24 w-24 rounded-full"
        style={{
          background: color,
          opacity: 0.45,
          filter: `blur(8px) drop-shadow(0 0 18px ${glowColor})`,
          animation: 'entrance-core-flash 780ms ease-out forwards',
        }}
      />

      <div
        className="absolute h-20 w-20 rounded-full border-4"
        style={{
          borderColor: color,
          boxShadow: `0 0 20px ${glowColor}, inset 0 0 18px ${glowColor}`,
          animation: 'entrance-ring 850ms ease-out forwards',
        }}
      />

      {effect === 'moonbeam' && (
        <div
          className="absolute left-1/2 top-[-30px] h-28 w-8 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${color}, transparent)`,
            boxShadow: `0 0 18px ${glowColor}`,
            animation: 'entrance-beam 900ms ease-out forwards',
          }}
        />
      )}

      {effect === 'lightning' && Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="absolute h-12 w-1 rounded-full"
          style={{
            background: `linear-gradient(to bottom, #fff, ${color}, transparent)`,
            boxShadow: `0 0 8px ${glowColor}`,
            '--rot': `${i * 32 - 80}deg`,
            animation: `entrance-lightning 650ms ease-out ${i * 0.04}s forwards`,
          }}
        />
      ))}

      {effect === 'speed' && Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="absolute h-1 rounded-full"
          style={{
            top: `${34 + i * 10}%`,
            width: 42 + i * 9,
            background: `linear-gradient(to right, transparent, ${color})`,
            boxShadow: `0 0 8px ${glowColor}`,
            animation: `entrance-speed 560ms ease-out ${i * 0.055}s forwards`,
          }}
        />
      ))}

      {effect === 'gravity' && (
        <div
          className="absolute h-28 w-28 rounded-full border-[6px]"
          style={{
            borderColor: color,
            boxShadow: `0 0 20px ${glowColor}`,
            animation: 'entrance-heavy 720ms ease-out forwards',
          }}
        />
      )}

      {PARTICLES.map((particle, i) => {
        const icons = EFFECT_ICONS[effect];
        return (
          <div
            key={i}
            className="absolute flex items-center justify-center rounded-full text-[11px] font-black"
            style={{
              width: icons ? 15 : 7,
              height: icons ? 15 : 7,
              color: icons ? color : 'transparent',
              background: icons ? 'rgba(255,255,255,0.65)' : color,
              boxShadow: `0 0 9px ${glowColor}`,
              '--px': `${particle.x}px`,
              '--py': `${particle.y}px`,
              animation: `entrance-particle 760ms ease-out ${particle.delay}s forwards`,
            }}
          >
            {icons?.[i % icons.length] || ''}
          </div>
        );
      })}

      <img
        src={def.sprite}
        alt=""
        className="absolute h-10 w-10 object-contain"
        style={{
          imageRendering: 'pixelated',
          filter: `drop-shadow(0 0 10px ${glowColor})`,
          animation: 'entrance-ball-open 760ms cubic-bezier(0.2, 1, 0.3, 1) forwards',
        }}
      />
    </div>
  );
}

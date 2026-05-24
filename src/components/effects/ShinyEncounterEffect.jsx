import React from 'react';

const STAR_POINTS = [
  { x: 50, y: 7, size: 16, delay: 0 },
  { x: 78, y: 18, size: 11, delay: 0.08 },
  { x: 93, y: 48, size: 14, delay: 0.16 },
  { x: 76, y: 78, size: 10, delay: 0.24 },
  { x: 50, y: 91, size: 18, delay: 0.32 },
  { x: 21, y: 80, size: 12, delay: 0.4 },
  { x: 7, y: 50, size: 15, delay: 0.48 },
  { x: 20, y: 20, size: 10, delay: 0.56 },
  { x: 37, y: 32, size: 8, delay: 0.18 },
  { x: 64, y: 65, size: 9, delay: 0.36 },
];

const SparkStar = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 0 L9.35 6.65 L16 8 L9.35 9.35 L8 16 L6.65 9.35 L0 8 L6.65 6.65 Z" fill="currentColor" />
  </svg>
);

export default function ShinyEncounterEffect({ active = false, compact = false, persistent = false }) {
  if (!active && !persistent) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none ${compact ? 'z-30' : 'z-40'}`}>
      <style>{`
        @keyframes shiny-screen-flash {
          0% { opacity: 0; transform: scale(0.96); }
          18% { opacity: 0.42; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.02); }
        }
        @keyframes shiny-ring-pop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.28) rotate(0deg); }
          22% { opacity: 0.72; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.78) rotate(28deg); }
        }
        @keyframes shiny-star-pop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.2) rotate(-20deg); }
          28% { opacity: 1; transform: translate(-50%, -50%) scale(1.35) rotate(8deg); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.45) rotate(34deg); }
        }
        @keyframes shiny-label-pop {
          0% { opacity: 0; transform: translate(-50%, 12px) scale(0.82); }
          24% { opacity: 1; transform: translate(-50%, 0) scale(1.05); }
          82% { opacity: 1; transform: translate(-50%, -2px) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -10px) scale(0.92); }
        }
        @keyframes shiny-aura-breathe {
          0%, 100% { opacity: 0.28; transform: translate(-50%, -50%) scale(0.95); }
          50% { opacity: 0.46; transform: translate(-50%, -50%) scale(1.03); }
        }
        @keyframes shiny-drift {
          0% { opacity: 0; transform: translateY(8px) scale(0.6) rotate(0deg); }
          25% { opacity: 0.95; }
          100% { opacity: 0; transform: translateY(-28px) scale(0.25) rotate(65deg); }
        }
      `}</style>

      {active && !compact && (
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 68% 40%, rgba(254,240,138,0.42), rgba(250,204,21,0.11) 34%, transparent 66%)',
            mixBlendMode: 'screen',
            animation: 'shiny-screen-flash 650ms ease-out forwards',
          }}
        />
      )}

      <div
        className="absolute rounded-full"
        style={{
          left: compact ? '50%' : '68%',
          top: compact ? '50%' : '42%',
          width: compact ? 88 : 116,
          height: compact ? 88 : 116,
          background: 'radial-gradient(circle, rgba(254,243,199,0.36), rgba(250,204,21,0.1) 48%, transparent 70%)',
          boxShadow: '0 0 18px rgba(250,204,21,0.48)',
          animation: persistent ? 'shiny-aura-breathe 2.8s ease-in-out infinite' : 'shiny-ring-pop 1050ms ease-out forwards',
        }}
      />

      {active && !compact && (
        <div
          className="absolute left-[68%] top-[15%] rounded-full border border-amber-200/80 bg-slate-950/45 px-3 py-1 text-[9px] font-black uppercase tracking-[0.24em] text-amber-200 shadow-lg"
          style={{
            transform: 'translateX(-50%)',
            textShadow: '0 0 10px rgba(250,204,21,0.9)',
            animation: 'shiny-label-pop 1450ms ease-out forwards',
          }}
        >
          Shiny
        </div>
      )}

      {active && STAR_POINTS.map((star, i) => (
        <div
          key={i}
          className="absolute text-amber-300"
          style={{
            left: compact ? `${star.x}%` : `calc(68% + ${(star.x - 50) * 1.15}px)`,
            top: compact ? `${star.y}%` : `calc(42% + ${(star.y - 50) * 1.05}px)`,
            filter: 'drop-shadow(0 0 5px rgba(250,204,21,0.75))',
            animation: `shiny-star-pop 1050ms ease-out ${star.delay}s forwards`,
          }}
        >
          <SparkStar size={star.size} />
        </div>
      ))}

      {persistent && !compact && STAR_POINTS.slice(0, 4).map((star, i) => (
        <div
          key={`drift-${i}`}
          className="absolute text-amber-200"
          style={{
            left: `calc(68% + ${(star.x - 50) * 0.9}px)`,
            top: `calc(42% + ${(star.y - 50) * 0.8}px)`,
            filter: 'drop-shadow(0 0 6px rgba(250,204,21,0.75))',
            animation: `shiny-drift 2.6s ease-in-out ${i * 0.45}s infinite`,
          }}
        >
          <SparkStar size={7 + i} />
        </div>
      ))}
    </div>
  );
}

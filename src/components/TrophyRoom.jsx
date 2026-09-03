import React from 'react';
import { createPortal } from 'react-dom';
import { getCompletionSummary } from '../data/completion';
import { MASTERY_TIERS } from '../data/masteryBorders';

// Sala de Troféus — painel de conclusão (só-leitura) aberto pela Cidade.
const TrophyRoom = ({ gameState, onClose }) => {
  const { overallPct, cards, mastery } = getCompletionSummary(gameState);

  const Ring = ({ pct }) => {
    const r = 34, c = 2 * Math.PI * r;
    const off = c - (pct / 100) * c;
    return (
      <svg width="86" height="86" viewBox="0 0 86 86" className="shrink-0">
        <circle cx="43" cy="43" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
        <circle cx="43" cy="43" r={r} fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 43 43)" style={{ transition: 'stroke-dashoffset 0.6s' }} />
        <text x="43" y="48" textAnchor="middle" fontSize="20" fontWeight="900" fill="#fff">{pct}%</text>
      </svg>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[88dvh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-5 shrink-0 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg,#b45309,#f59e0b)' }}>
          <Ring pct={overallPct} />
          <div className="flex-1">
            <p className="text-white/80 text-[9px] font-black uppercase tracking-widest">Conclusão Geral</p>
            <h2 className="text-white text-xl font-black uppercase leading-none">🏆 Sala de Troféus</h2>
            <p className="text-white/85 text-[10px] font-bold mt-1">Seu progresso rumo aos 100%.</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 text-white font-black flex items-center justify-center self-start">✕</button>
        </div>

        <div className="overflow-y-auto p-4 flex flex-col gap-2.5">
          {cards.map(c => (
            <div key={c.key} className="rounded-2xl p-3 border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[12px] font-black text-slate-700 uppercase italic flex items-center gap-2">
                  <span className="text-base not-italic">{c.icon}</span> {c.label}
                </p>
                <span className="text-[11px] font-black text-slate-400">
                  {c.have}{c.suffix ? ` ${c.suffix}` : `/${c.total}`} · {c.pct}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${c.pct}%`, background: c.pct >= 100 ? '#16a34a' : '#f59e0b' }} />
              </div>
            </div>
          ))}

          {/* Maestrias */}
          <div className="rounded-2xl p-3 border border-slate-100 bg-white shadow-sm">
            <p className="text-[12px] font-black text-slate-700 uppercase italic mb-2">🥇 Maestrias de Espécie</p>
            <div className="flex gap-2">
              {['gold', 'silver', 'bronze'].map(t => (
                <div key={t} className="flex-1 rounded-xl py-2 text-center border"
                  style={{ borderColor: `${MASTERY_TIERS[t].color}55`, background: `${MASTERY_TIERS[t].color}12` }}>
                  <div className="text-lg leading-none">{MASTERY_TIERS[t].badge}</div>
                  <div className="text-sm font-black text-slate-700 mt-0.5">{mastery[t] || 0}</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase">{MASTERY_TIERS[t].label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TrophyRoom;

import React, { useState } from 'react';
import { getJourneyGuide } from '../data/journeyGuide';

// Banner de "luta liberada" (QoL): quando há uma luta do MODO VS pendente que
// libera progresso/rota, mostra um aviso fixo e dispensável com um botão grande
// "IR PARA A LUTA" que leva o jogador direto à batalha certa.
const DISMISS_KEY = 'pokecraft_dismissed_fight_banner';
const getDismissed = () => { try { return localStorage.getItem(DISMISS_KEY) || ''; } catch { return ''; } };
const setDismissed = (v) => { try { localStorage.setItem(DISMISS_KEY, v); } catch {} };

export default function JourneyFightBanner({ gameState, onGoToFight }) {
  const [dismissedTick, setDismissedTick] = useState(0);

  const guide = getJourneyGuide(gameState);
  const step = guide.storyStep;
  const nv = guide.nextVsBattle;
  // Só aparece quando há um próximo passo de história mapeado para uma luta do VS.
  if (!step || !nv) return null;

  // Dispensa vale só para ESTA luta — reaparece quando uma nova é liberada.
  const key = step.flag;
  if (getDismissed() === key || dismissedTick === -1) return null;

  const label = step.label || nv.label || 'Luta disponível no Modo VS';

  return (
    <div
      className="mx-3 mb-2 rounded-2xl border-2 border-red-500/60 shadow-lg overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg,#7f1d1d 0%,#b91c1c 55%,#ef4444 100%)' }}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="shrink-0 w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-2xl">⚔️</div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">Luta liberada</p>
          <p className="text-sm font-black uppercase italic text-white leading-tight truncate">{label}</p>
        </div>
        <button
          onClick={() => { setDismissed(key); setDismissedTick(-1); }}
          className="shrink-0 text-white/50 hover:text-white/80 w-7 h-7 flex items-center justify-center text-sm font-black"
          title="Dispensar até a próxima luta"
        >
          ✕
        </button>
      </div>
      <button
        onClick={() => onGoToFight && onGoToFight()}
        className="w-full py-3.5 bg-white text-red-700 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
      >
        Ir para a luta
        <span className="text-lg">→</span>
      </button>
    </div>
  );
}

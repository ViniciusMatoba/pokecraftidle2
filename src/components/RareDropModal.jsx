import React from 'react';

const POKEAPI_ITEM = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';

const DISMISSED_KEY = 'pokecraft_dismissed_rare_drops';
const getDismissed = () => { try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'); } catch { return []; } };
const addDismissed = (type) => { try { const d = getDismissed(); if (!d.includes(type)) { d.push(type); localStorage.setItem(DISMISSED_KEY, JSON.stringify(d)); } } catch {} };
export const isRareDropDismissed = (type) => getDismissed().includes(type);

const TYPE_STYLES = {
  recipe: {
    eyebrow: 'Receita encontrada',
    title: 'Nova forja desbloqueada',
    // fallback usa URL completa do PokeAPI — item real que existe
    fallbackIcon: `${POKEAPI_ITEM}tm-case.png`,
    accent: '#f59e0b',
    bg: 'linear-gradient(160deg,#1c1410 0%,#2d1f0a 100%)',
  },
  shiny: {
    eyebrow: 'Encontro raro',
    title: 'Pokemon shiny',
    fallbackIcon: `${POKEAPI_ITEM}shiny-charm.png`,
    accent: '#facc15',
    bg: 'linear-gradient(160deg,#15120a 0%,#31240b 100%)',
  },
  mega: {
    eyebrow: 'Fragmento raro',
    title: 'Mega Evolucao',
    // usa asset local — mega-stone.png não existe no PokeAPI
    fallbackIcon: '/items/mega_stone_shard.webp',
    accent: '#a855f7',
    bg: 'linear-gradient(160deg,#171126 0%,#2d174d 100%)',
  },
  rare: {
    eyebrow: 'Drop raro',
    title: 'Item especial',
    fallbackIcon: `${POKEAPI_ITEM}star-piece.png`,
    accent: '#38bdf8',
    bg: 'linear-gradient(160deg,#081827 0%,#12304a 100%)',
  },
};

export default function RareDropModal({
  drop,
  onClose,
  onPrimary,
  primaryLabel = 'Continuar',
}) {
  if (!drop) return null;

  const handleDismissAndClose = (e) => {
    e.stopPropagation();
    addDismissed(drop.type);
    onClose?.();
  };

  const style = TYPE_STYLES[drop.type] || TYPE_STYLES.rare;
  const icon = drop.img || drop.icon || style.fallbackIcon;

  return (
    <div
      className="absolute inset-0 z-[100000] flex items-center justify-center p-4 cursor-default"
      style={{ background: 'rgba(2,6,23,0.88)', backdropFilter: 'blur(14px)' }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose?.();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div
        className="modal-readable-panel relative w-full max-w-sm overflow-hidden rounded-[2rem] border-2 shadow-2xl"
        style={{ background: style.bg, borderColor: `${style.accent}66` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute left-0 right-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg,transparent,${style.accent},transparent)` }}
        />

        <div className="px-6 pt-6 pb-4 text-center">
          <div
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border bg-white/10 shadow-inner"
            style={{ borderColor: `${style.accent}55` }}
          >
            <img
              src={icon}
              alt=""
              className="h-14 w-14 object-contain"
              style={{ imageRendering: 'pixelated', filter: `drop-shadow(0 0 12px ${style.accent}88)` }}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = style.fallbackIcon; }}
            />
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.28em]" style={{ color: style.accent }}>
            {drop.eyebrow || style.eyebrow}
          </p>
          <h3 className="mt-1 text-2xl font-black uppercase italic leading-tight text-white">
            {drop.title || style.title}
          </h3>
          <p className="mt-2 text-sm font-black uppercase leading-tight text-white/90">
            {drop.name}
          </p>
          {drop.description && (
            <p className="mx-auto mt-3 max-w-[280px] text-xs font-bold leading-relaxed text-slate-300">
              {drop.description}
            </p>
          )}
        </div>

        {drop.meta && (
          <div className="mx-5 mb-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-white/70">
              {drop.meta}
            </p>
          </div>
        )}

        <div className="grid gap-2 px-5 pb-5">
          {onPrimary && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrimary();
              }}
              className="h-14 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-950 shadow-lg active:scale-95"
              style={{ background: `linear-gradient(135deg,${style.accent},#f8fafc)` }}
            >
              {primaryLabel}
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="h-12 rounded-2xl bg-white/10 text-xs font-black uppercase tracking-widest text-white active:scale-95"
          >
            Continuar na rota
          </button>
          <button
            type="button"
            onClick={handleDismissAndClose}
            className="h-9 rounded-xl bg-white/5 text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white/60 active:scale-95 transition-all"
          >
            🔕 Não mostrar mais este tipo
          </button>
        </div>
      </div>
    </div>
  );
}

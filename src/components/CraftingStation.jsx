import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ITEM_LABELS } from '../data/constants';

const POKEAPI = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';
const assetPath = (path) => `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}${path}`;

// Ícone de material: usa ITEM_LABELS (emoji ou URL); fallback = 📦
const MaterialIcon = ({ mat, size = 'w-5 h-5' }) => {
  const meta = ITEM_LABELS[mat];
  const icon = meta?.icon;
  if (icon && (String(icon).startsWith('http') || String(icon).startsWith('/'))) {
    return (
      <img src={String(icon).startsWith('/') ? assetPath(icon) : icon} alt=""
        className={`${size} object-contain`} style={{ imageRendering: 'pixelated' }}
        onError={e => { e.target.style.display = 'none'; }} />
    );
  }
  return <span className="text-sm leading-none">{icon || '📦'}</span>;
};

const materialLabel = (mat) => ITEM_LABELS[mat]?.name || mat.replace(/_/g, ' ');

// Labels amigáveis para as categorias
const CATEGORY_LABELS = {
  consumables:    { label: 'Consumíveis',  img: `${POKEAPI}potion.png`,                    caption: 'Pokébolas/Pedras' },
  hold_items:     { label: 'Hold Items',   img: `${POKEAPI}charcoal.png`,                   caption: 'Equipamentos'     },
  elite_relics:   { label: 'Relíquias',    img: `${POKEAPI}dragon-fang.png`,                caption: 'Boss Drops'       },
  tms:            { label: 'TMs',          img: assetPath('/items/tm_fire.webp'),            caption: 'Golpes'           },
  mega_stones:    { label: 'Mega Stones',  img: assetPath('/items/mega_stone_shard.webp'),   caption: 'Mega Evol.'       },
  fishing_rods:   { label: 'Varas',        img: `${POKEAPI}old-rod.png`,                    caption: 'Pesca'            },
  repels:         { label: 'Repéis',       img: `${POKEAPI}repel.png`,                      caption: 'Afastadores'      },
  incenses:       { label: 'Iscas',        img: `${POKEAPI}honey.png`,                      caption: 'Atrativo'         },
  food:           { label: 'Ração',        img: `${POKEAPI}oran-berry.png`,                 caption: 'Energia'          },
  apricorn_balls: { label: 'Bolas Kurt',   img: `${POKEAPI}lure-ball.png`,                  caption: 'Apricorn'         },
  trainer_card:   { label: 'Cartão',       img: `${POKEAPI}master-ball.png`,                caption: 'Personalização'   },
};

const CraftingStation = ({
  recipes,
  inventory,
  currency,
  onCraft,
  hasRecipe   = () => true,   // (id) => bool — verifica se a receita foi encontrada
  recipeGuides = {},          // { [id]: { label, routeId } } — onde dropar
  initialCategory = null,
  initialItem = null,
  isAnyModalOpen = false,
  _isForgeConfirmOpen = false,
  setCurrentView,
  setGameState,
}) => {
  const categories = useMemo(() => Object.keys(recipes || {}), [recipes]);
  // null = mostra a grade de categorias; string = mostra as receitas da categoria
  const [activeCategory, setActiveCategory] = useState(initialCategory || null);
  const [showLocked, setShowLocked] = useState(true);
  const [highlightedItem, setHighlightedItem] = useState(initialItem);
  const [tmTypeFilter, setTmTypeFilter] = useState('All');
  const [pendingCraft, setPendingCraft] = useState(null); // { item, qty }

  // Quantidade selecionada por item (opcional, para persistir se o usuário trocar de aba)
  // Mas vamos simplificar e usar botões diretos x1, x10, Max
  
  React.useEffect(() => {
    if (initialItem) {
      setHighlightedItem(initialItem);
      if (!initialCategory) {
        for (const [cat, items] of Object.entries(recipes)) {
          if (items.some(it => it.id === initialItem)) {
            setActiveCategory(cat);
            break;
          }
        }
      }
      
      setTimeout(() => {
        const el = document.getElementById(`recipe-item-${initialItem}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      
      const timer = setTimeout(() => setHighlightedItem(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [initialItem, initialCategory, recipes]);

  const getMaterialCost = (item) =>
    Object.fromEntries(Object.entries(item.cost || {}).filter(([m]) => m !== 'currency'));

  const getAvail = (mat) =>
    (inventory?.materials?.[mat] || 0) + (inventory?.items?.[mat] || 0);

  const getOwnedQty = (itemId) => (inventory?.items?.[itemId] || 0);

  const calculateMaxCraft = (item) => {
    const materialCost = getMaterialCost(item);
    const currencyCost = item.cost?.currency || 0;
    
    let maxByMaterials = Infinity;
    Object.entries(materialCost).forEach(([mat, amount]) => {
      const avail = getAvail(mat);
      maxByMaterials = Math.min(maxByMaterials, Math.floor(avail / amount));
    });
    
    let maxByCurrency = Infinity;
    if (currencyCost > 0) {
      maxByCurrency = Math.floor(currency / currencyCost);
    }
    
    const possible = Math.min(maxByMaterials, maxByCurrency);
    return possible === Infinity ? 0 : possible;
  };

  const tmTypes = useMemo(() => {
    if (activeCategory !== 'tms') return [];
    const types = new Set(['All']);
    (recipes.tms || []).forEach(tm => {
      // Extrair tipo do efeito "Physical - Fire / Poder 75"
      const parts = tm.effect?.split(' - ')[1]?.split(' / ')[0];
      if (parts) types.add(parts);
    });
    return Array.from(types);
  }, [activeCategory, recipes.tms]);

  const filteredItems = useMemo(() => {
    let items = recipes[activeCategory] || [];
    if (activeCategory === 'tms' && tmTypeFilter !== 'All') {
      items = items.filter(tm => tm.effect?.includes(`- ${tmTypeFilter}`));
    }
    return items;
  }, [activeCategory, recipes, tmTypeFilter]);

  return (
    <div className="flex min-h-0 flex-1 flex-col text-left" style={{ pointerEvents: isAnyModalOpen ? 'none' : 'auto' }}>

      {/* ── Nível 1: grade de categorias (sem scroll horizontal) ───────────── */}
      {!activeCategory && (
        <div className="grid grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 content-start scrollbar-hide">
          {categories.map(cat => {
            const meta = CATEGORY_LABELS[cat] || { label: cat.replace(/_/g, ' '), img: null, caption: 'Itens' };
            const catItems = (recipes[cat] || []);
            const unlockedCount = catItems.filter(it => hasRecipe(it.id)).length;
            const hasUnlocked = unlockedCount > 0;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setTmTypeFilter('All');
                }}
                className={`rounded-2xl border-2 p-3 text-left transition-all active:scale-95 flex flex-col gap-2 ${
                  hasUnlocked
                    ? 'bg-white border-emerald-200 shadow-md hover:border-emerald-400'
                    : 'bg-white border-slate-200 shadow-sm hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hasUnlocked ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                    {meta.img ? (
                      <img src={meta.img} alt="" className="w-7 h-7 object-contain"
                        onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <span className="text-base">📦</span>
                    )}
                  </div>
                  <span className={`text-[9px] px-2 py-1 rounded-full font-black shrink-0 ${
                    hasUnlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {unlockedCount}/{catItems.length}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase leading-tight text-slate-800">{meta.label}</p>
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400 leading-tight">{meta.caption}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Nível 2: receitas da categoria escolhida ───────────────────────── */}
      {activeCategory && (
        <div className="flex items-center gap-2 mb-2 shrink-0">
          <button
            onClick={() => { setActiveCategory(null); setTmTypeFilter('All'); }}
            className="shrink-0 w-9 h-9 rounded-xl bg-slate-800 text-white font-black text-sm flex items-center justify-center transition-all active:scale-90 shadow-md"
            aria-label="Voltar para categorias"
          >
            ←
          </button>
          {(() => {
            const meta = CATEGORY_LABELS[activeCategory] || { label: activeCategory.replace(/_/g, ' '), img: null, caption: 'Itens' };
            const catItems = (recipes[activeCategory] || []);
            const unlockedCount = catItems.filter(it => hasRecipe(it.id)).length;
            return (
              <>
                {meta.img && (
                  <img src={meta.img} alt="" className="w-6 h-6 object-contain shrink-0"
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-black uppercase leading-none text-slate-800 truncate">{meta.label}</p>
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">{meta.caption}</p>
                </div>
                <span className="shrink-0 text-[9px] px-2 py-1 rounded-full font-black bg-slate-100 text-slate-500">
                  {unlockedCount}/{catItems.length}
                </span>
              </>
            );
          })()}
        </div>
      )}

      {/* Filtro de TMs */}
      {activeCategory === 'tms' && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 custom-scrollbar shrink-0">
          {tmTypes.map(type => (
            <button
              key={type}
              onClick={() => setTmTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                tmTypeFilter === type
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
              }`}
            >
              {type === 'All' ? 'Todos' : type}
            </button>
          ))}
        </div>
      )}

      {/* Toggle mostrar/ocultar bloqueados */}
      {activeCategory && (
      <div className="flex items-center justify-between gap-2 mb-2 px-1 shrink-0">
        <p className="text-[8px] text-slate-400 font-bold italic truncate min-w-0">
          Receitas dropam de Pokémon nas rotas
        </p>
        <button
          onClick={() => setShowLocked(v => !v)}
          className={`shrink-0 text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl transition-all ${
            showLocked
              ? 'bg-amber-100 text-amber-700 border border-amber-300'
              : 'bg-slate-100 text-slate-400 border border-transparent'
          }`}
        >
          🔒 {showLocked ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      )}

      {/* Lista de itens */}
      {activeCategory && (
      <div className="space-y-3 overflow-y-auto pr-1 scrollbar-hide flex-1">
        {filteredItems.map(item => {
          const unlocked = hasRecipe(item.id);
          const guide    = recipeGuides[item.id];
          const materialCost = getMaterialCost(item);
          const currencyCost = item.cost?.currency || 0;
          const maxCraft = calculateMaxCraft(item);
          const ownedQty = getOwnedQty(item.id);
          
          const canCraftX1 = unlocked && maxCraft >= 1;
          const canCraftX10 = unlocked && maxCraft >= 10;

          if (!unlocked && !showLocked) return null;

          return (
            <div
              key={item.id}
              id={`recipe-item-${item.id}`}
              className={`rounded-3xl border-2 p-4 transition-all ${
                highlightedItem === item.id
                  ? 'border-f59e0b ring-2 ring-f59e0b/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-amber-50/30'
                  : !unlocked
                  ? 'border-dashed border-slate-200 bg-slate-50 opacity-80'
                  : canCraftX1
                  ? 'border-emerald-200 bg-white shadow-md hover:border-emerald-400'
                  : 'border-slate-100 bg-white opacity-70'
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  {/* Ícone */}
                  <div className={`rounded-2xl p-3 shrink-0 ${
                    !unlocked ? 'bg-slate-100' : 'bg-slate-50'
                  }`}>
                    {unlocked ? (
                      <img src={item.img.startsWith('/') ? assetPath(item.img) : item.img} className="w-10 h-10 object-contain drop-shadow" alt={item.name}
                        onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center text-2xl">🔒</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-black uppercase italic tracking-tight text-sm leading-none ${
                        unlocked ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {item.name}
                      </h4>
                      {unlocked && (
                        <span className="text-[8px] bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded-full uppercase">
                          Mochila: {ownedQty.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Efeito se houver */}
                    {item.effect && typeof item.effect === 'string' && (
                      <p className="text-[9px] text-slate-400 mt-0.5 italic">{item.effect}</p>
                    )}

                    {unlocked ? (
                      /* Custo de materiais */
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {Object.entries(materialCost).map(([mat, amount]) => {
                          const avail = getAvail(mat);
                          const ok = avail >= amount;
                          return (
                            <span key={mat}
                              className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${
                                ok ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-500'
                              }`}>
                              {mat.replace(/_/g, ' ')}: {avail}/{amount}
                            </span>
                          );
                        })}
                        {currencyCost > 0 && (
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${
                            currency >= currencyCost ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-500'
                          }`}>
                            💰 {currency.toLocaleString()}/{currencyCost.toLocaleString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      /* Dica de onde dropar */
                      <div className="mt-2 flex flex-col gap-2">
                        <div className="flex items-start gap-1.5">
                          <span className="text-sm shrink-0">📍</span>
                          <p className="text-[9px] text-amber-700 font-bold leading-tight">
                            {guide?.label || 'Derrote Pokémon nas rotas para encontrar esta receita.'}
                          </p>
                        </div>
                        {guide?.routeId && (
                           <button 
                             onClick={() => {
                                if (setGameState) {
                                  setGameState(prev => ({ ...prev, currentRoute: guide.routeId }));
                                }
                                if (setCurrentView) {
                                  setCurrentView('battles');
                                }
                             }}
                             className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 text-center flex items-center justify-center gap-1.5 w-fit"
                           >
                             <span className="text-xs">🏃</span> Viajar para Rota
                           </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Controles de Forja */}
                {unlocked && (
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <button
                      disabled={!canCraftX1}
                      onClick={() => setPendingCraft({ item, qty: 1 })}
                      className={`py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        canCraftX1
                          ? 'bg-slate-800 text-white hover:bg-slate-700 active:scale-95'
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      x1
                    </button>
                    <button
                      disabled={!canCraftX10}
                      onClick={() => setPendingCraft({ item, qty: 10 })}
                      className={`py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        canCraftX10
                          ? 'bg-slate-800 text-white hover:bg-slate-700 active:scale-95'
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      x10
                    </button>
                    <button
                      disabled={maxCraft <= 0}
                      onClick={() => setPendingCraft({ item, qty: maxCraft })}
                      className={`py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        maxCraft > 0
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md active:scale-95'
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Max ({maxCraft})
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Vazio */}
        {filteredItems.filter(item => showLocked || hasRecipe(item.id)).length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <span className="text-4xl">📜</span>
            <p className="text-slate-400 text-xs font-bold text-center">
              {showLocked
                ? 'Nenhum item nesta categoria.'
                : 'Nenhuma receita encontrada ainda. Explore as rotas!'}
            </p>
          </div>
        )}
      </div>
      )}

      {/* ── MODAL: CONFIRMAR FORJA ─────────────────────────────────────────── */}
      {pendingCraft && (
        <ForgeConfirmModal
          pending={pendingCraft}
          maxCraft={calculateMaxCraft(pendingCraft.item)}
          getAvail={getAvail}
          getOwnedQty={getOwnedQty}
          currency={currency}
          onCancel={() => setPendingCraft(null)}
          onConfirm={(item, qty) => { onCraft(item, qty); setPendingCraft(null); }}
        />
      )}
    </div>
  );
};

// ── Modal de confirmação de forja — tema fornalha ────────────────────────────
const ForgeConfirmModal = ({ pending, maxCraft, getAvail, getOwnedQty, currency, onCancel, onConfirm }) => {
  const { item } = pending;
  const [qty, setQty] = useState(Math.max(1, Math.min(pending.qty || 1, Math.max(maxCraft, 1))));
  const [forging, setForging] = useState(false);

  // Sincroniza quando o jogador abre o modal para outro item/quantidade
  useEffect(() => {
    setQty(Math.max(1, Math.min(pending.qty || 1, Math.max(maxCraft, 1))));
    setForging(false);
  }, [pending, maxCraft]);

  const materialCost = Object.fromEntries(Object.entries(item.cost || {}).filter(([m]) => m !== 'currency'));
  const currencyCostUnit = item.cost?.currency || 0;
  const currencyCost = currencyCostUnit * qty;
  const canExecute = qty >= 1 &&
    Object.entries(materialCost).every(([mat, amount]) => getAvail(mat) >= amount * qty) &&
    (currencyCost === 0 || currency >= currencyCost);
  const ownedQty = getOwnedQty(item.id);

  const clampQty = (v) => Math.max(1, Math.min(v, Math.max(maxCraft, 1)));

  const handleForge = () => {
    if (!canExecute || forging) return;
    setForging(true);
    // Micro-animação de martelada antes de executar (feedback tátil da forja)
    setTimeout(() => onConfirm(item, qty), 650);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={forging ? undefined : onCancel}>
      <style>{`
        @keyframes forgeHammer {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-38deg) translateY(-4px); }
          38% { transform: rotate(14deg) translateY(2px); }
          50% { transform: rotate(0deg); }
        }
        @keyframes forgeSpark {
          0%   { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0.2); }
        }
        @keyframes forgeGlowPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @keyframes forgeItemShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px) rotate(-2deg); }
          75% { transform: translateX(3px) rotate(2deg); }
        }
      `}</style>
      <div
        className="w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border-2"
        style={{
          background: 'linear-gradient(165deg,#1c1410 0%,#2d1f0a 55%,#1c1410 100%)',
          borderColor: 'rgba(245,158,11,0.4)',
          animation: 'slideInUp 0.22s ease-out both',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Brasa no topo */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg,transparent,#f59e0b,#fbbf24,#f59e0b,transparent)',
          animation: 'forgeGlowPulse 2.2s ease-in-out infinite',
        }} />

        {/* Header: bigorna + item */}
        <div className="px-6 pt-6 pb-4 text-center relative">
          <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: '#f59e0b' }}>
            🔥 Forja Pokémon
          </p>
          <div className="relative mx-auto mt-3 mb-3 flex h-24 w-24 items-center justify-center rounded-[1.75rem] border"
            style={{ background: 'rgba(245,158,11,0.10)', borderColor: 'rgba(245,158,11,0.35)', boxShadow: 'inset 0 0 24px rgba(245,158,11,0.15)' }}>
            <img
              src={item.img?.startsWith('/') ? assetPath(item.img) : item.img}
              alt={item.name}
              className="h-16 w-16 object-contain"
              style={{
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 0 14px rgba(245,158,11,0.6))',
                animation: forging ? 'forgeItemShake 0.16s linear infinite' : undefined,
              }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            {/* Martelo forjando */}
            <span
              className="absolute -right-3 -top-3 text-3xl select-none"
              style={{
                transformOrigin: '80% 80%',
                animation: forging ? 'forgeHammer 0.32s ease-in-out infinite' : 'forgeHammer 2.4s ease-in-out infinite',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
              }}
            >⚒️</span>
            {/* Faíscas durante a forja */}
            {forging && [...Array(6)].map((_, i) => (
              <span key={i} className="absolute text-xs select-none" style={{
                left: '55%', top: '30%',
                '--sx': `${(i % 2 ? 1 : -1) * (14 + i * 7)}px`,
                '--sy': `${-12 - (i * 6)}px`,
                animation: `forgeSpark ${0.4 + (i % 3) * 0.15}s ease-out ${i * 0.08}s infinite`,
              }}>✨</span>
            ))}
          </div>
          <h3 className="text-xl font-black uppercase italic leading-tight text-white">{item.name}</h3>
          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-amber-200/70">
            Mochila: {ownedQty.toLocaleString()} <span className="text-amber-400">→ {(ownedQty + qty).toLocaleString()}</span>
          </p>
        </div>

        {/* Seletor de quantidade */}
        <div className="mx-5 mb-3 rounded-2xl border px-4 py-3"
          style={{ background: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="mb-2 text-center text-[8px] font-black uppercase tracking-[0.25em] text-white/40">Quantidade</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setQty(q => clampQty(q - 1))}
              disabled={forging || qty <= 1}
              className="h-10 w-10 rounded-xl bg-white/10 text-lg font-black text-white transition-all active:scale-90 disabled:opacity-25"
            >−</button>
            <span className="min-w-[72px] text-center text-3xl font-black italic text-amber-400 tabular-nums">×{qty}</span>
            <button
              onClick={() => setQty(q => clampQty(q + 1))}
              disabled={forging || qty >= maxCraft}
              className="h-10 w-10 rounded-xl bg-white/10 text-lg font-black text-white transition-all active:scale-90 disabled:opacity-25"
            >+</button>
          </div>
          <div className="mt-2.5 flex justify-center gap-2">
            {[1, 10].map(n => (
              <button key={n}
                onClick={() => setQty(clampQty(n))}
                disabled={forging || maxCraft < n}
                className={`rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-25 ${
                  qty === n ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-white/70'
                }`}
              >x{n}</button>
            ))}
            <button
              onClick={() => setQty(clampQty(maxCraft))}
              disabled={forging || maxCraft <= 0}
              className={`rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-25 ${
                qty === maxCraft && maxCraft > 0 ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-white/70'
              }`}
            >Max ({maxCraft})</button>
          </div>
        </div>

        {/* Custos */}
        <div className="mx-5 mb-4 flex flex-col gap-1.5">
          {Object.entries(materialCost).map(([mat, amount]) => {
            const total = amount * qty;
            const avail = getAvail(mat);
            const ok = avail >= total;
            const pct = Math.min(100, Math.round((avail / total) * 100));
            return (
              <div key={mat} className="rounded-xl border px-3 py-2"
                style={{
                  background: ok ? 'rgba(255,255,255,0.04)' : 'rgba(239,68,68,0.10)',
                  borderColor: ok ? 'rgba(255,255,255,0.08)' : 'rgba(239,68,68,0.35)',
                }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <MaterialIcon mat={mat} />
                    <span className={`truncate text-[10px] font-black uppercase ${ok ? 'text-white/80' : 'text-red-300'}`}>
                      {materialLabel(mat)}
                    </span>
                  </span>
                  <span className={`shrink-0 text-[11px] font-black tabular-nums ${ok ? 'text-amber-300' : 'text-red-400'}`}>
                    {avail.toLocaleString()}<span className="text-white/40">/{total.toLocaleString()}</span> {!ok && '⚠'}
                  </span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/40">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: ok ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : '#ef4444' }} />
                </div>
              </div>
            );
          })}
          {currencyCostUnit > 0 && (
            <div className="flex items-center justify-between rounded-xl border px-3 py-2"
              style={{
                background: currency >= currencyCost ? 'rgba(250,204,21,0.08)' : 'rgba(239,68,68,0.10)',
                borderColor: currency >= currencyCost ? 'rgba(250,204,21,0.25)' : 'rgba(239,68,68,0.35)',
              }}>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase text-yellow-200/90">
                <img src={`${POKEAPI}nugget.png`} alt="" className="w-5 h-5 object-contain" /> Coins
              </span>
              <span className={`text-[11px] font-black tabular-nums ${currency >= currencyCost ? 'text-yellow-300' : 'text-red-400'}`}>
                {currency >= currencyCost
                  ? <>{currency.toLocaleString()} <span className="text-white/40">→</span> {(currency - currencyCost).toLocaleString()}</>
                  : <>{currency.toLocaleString()}<span className="text-white/40">/{currencyCost.toLocaleString()}</span> ⚠</>}
              </span>
            </div>
          )}
          {!canExecute && (
            <p className="mt-1 text-center text-[10px] font-black uppercase tracking-widest text-red-400">
              Materiais insuficientes para ×{qty}
            </p>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button onClick={onCancel} disabled={forging}
            className="flex-1 min-h-[52px] rounded-2xl bg-white/10 text-sm font-black uppercase tracking-widest text-white/80 transition-all active:scale-95 disabled:opacity-40">
            Cancelar
          </button>
          <button disabled={!canExecute || forging} onClick={handleForge}
            className="flex-[1.4] min-h-[52px] rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-95 disabled:cursor-not-allowed"
            style={canExecute ? {
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              color: '#1c1410',
              boxShadow: '0 6px 24px rgba(245,158,11,0.45)',
            } : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' }}>
            {forging ? '🔥 Forjando...' : `⚒️ Forjar ×${qty}`}
          </button>
        </div>
      </div>
    </div>
  , document.body);
};

export default CraftingStation;

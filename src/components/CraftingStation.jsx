import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const POKEAPI = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';
const assetPath = (path) => `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}${path}`;

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
  isForgeConfirmOpen = false,
  setCurrentView,
  setGameState,
}) => {
  const categories = useMemo(() => Object.keys(recipes || {}), [recipes]);
  const [activeCategory, setActiveCategory] = useState(initialCategory || categories[0] || '');
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

      {/* Bolsos por categoria — estilo mochila */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3 shrink-0">
        {categories.map(cat => {
          const meta = CATEGORY_LABELS[cat] || { label: cat.replace(/_/g, ' '), img: null, caption: 'Itens' };
          const catItems = (recipes[cat] || []);
          const unlockedCount = catItems.filter(it => hasRecipe(it.id)).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setTmTypeFilter('All');
              }}
              className={`min-h-[68px] rounded-2xl border-2 p-2.5 text-left transition-all active:scale-95 ${
                isActive
                  ? 'bg-slate-800 border-slate-900 text-white shadow-lg'
                  : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                  {meta.img ? (
                    <img src={meta.img} alt={meta.label} className="w-7 h-7 object-contain"
                      onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span className="text-[10px] font-black text-slate-500 uppercase">?</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase leading-tight truncate">{meta.label}</p>
                  <p className={`text-[8px] font-bold uppercase tracking-wide ${isActive ? 'text-white/60' : 'text-slate-400'}`}>{meta.caption}</p>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black shrink-0 ${isActive ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-500'}`}>
                  {unlockedCount}/{catItems.length}
                </span>
              </div>
            </button>
          );
        })}
      </div>

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
      <div className="flex items-center gap-2 mb-3 px-1">
        <button
          onClick={() => setShowLocked(v => !v)}
          className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all ${
            showLocked
              ? 'bg-amber-100 text-amber-700 border border-amber-300'
              : 'bg-slate-100 text-slate-400'
          }`}
        >
          {showLocked ? '🔒 Mostrando bloqueados' : '🔒 Ocultar bloqueados'}
        </button>
        <p className="text-[8px] text-slate-400 font-bold italic">
          Encontre receitas derrotando Pokémon nas rotas
        </p>
      </div>

      {/* Lista de itens */}
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

      {/* ── MODAL: CONFIRMAR FORJA ─────────────────────────────────────────── */}
      {pendingCraft && (() => {
        const { item, qty } = pendingCraft;
        const materialCost = Object.fromEntries(Object.entries(item.cost || {}).filter(([m]) => m !== 'currency'));
        const currencyCost = (item.cost?.currency || 0) * qty;
        const canExecute = Object.entries(materialCost).every(([mat, amount]) => getAvail(mat) >= amount * qty)
          && (currencyCost === 0 || currency >= currencyCost);
        return createPortal(
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-b-8 border-slate-200"
              style={{ animation: 'slideInUp 0.2s ease-out both' }}>
              {/* Header */}
              <div className="bg-slate-800 px-5 py-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <img src={item.img?.startsWith('/') ? item.img : item.img} alt={item.name}
                    className="w-9 h-9 object-contain"
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">CONFIRMAR FORJA</p>
                  <h3 className="text-white text-base font-black uppercase leading-tight truncate">
                    {item.name} <span className="text-emerald-400">×{qty}</span>
                  </h3>
                </div>
              </div>
              {/* Custo resumido */}
              <div className="px-5 py-4 flex flex-col gap-2">
                {Object.entries(materialCost).map(([mat, amount]) => {
                  const total = amount * qty;
                  const avail = getAvail(mat);
                  const ok = avail >= total;
                  return (
                    <div key={mat} className={`flex justify-between items-center rounded-xl px-3 py-2 ${ok ? 'bg-slate-50' : 'bg-red-50'}`}>
                      <span className={`text-[11px] font-black uppercase ${ok ? 'text-slate-600' : 'text-red-600'}`}>
                        {mat.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-[11px] font-black ${ok ? 'text-slate-800' : 'text-red-600'}`}>
                        {avail}/{total} {!ok && '⚠'}
                      </span>
                    </div>
                  );
                })}
                {currencyCost > 0 && (
                  <div className={`flex justify-between items-center rounded-xl px-3 py-2 ${currency >= currencyCost ? 'bg-yellow-50' : 'bg-red-50'}`}>
                    <span className={`text-[11px] font-black uppercase ${currency >= currencyCost ? 'text-yellow-700' : 'text-red-600'}`}>
                      💰 Coins
                    </span>
                    <span className={`text-[11px] font-black ${currency >= currencyCost ? 'text-yellow-800' : 'text-red-600'}`}>
                      {currency.toLocaleString()} → {(currency - currencyCost).toLocaleString()} {currency < currencyCost && '⚠'}
                    </span>
                  </div>
                )}
                {!canExecute && (
                  <p className="text-red-500 text-[10px] font-black uppercase text-center mt-1">Materiais insuficientes!</p>
                )}
              </div>
              {/* Botões */}
              <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-100 pt-3 flex gap-3">
                <button onClick={() => setPendingCraft(null)}
                  className="flex-1 min-h-[52px] rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase">
                  Cancelar
                </button>
                <button disabled={!canExecute}
                  onClick={() => { onCraft(item, qty); setPendingCraft(null); }}
                  className={`flex-1 min-h-[52px] rounded-2xl text-white font-black text-sm uppercase shadow-lg transition-all active:scale-95 ${canExecute ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-500' : 'bg-slate-300 cursor-not-allowed'}`}>
                  ⚒ FORJAR
                </button>
              </div>
            </div>
          </div>
        , document.body);
      })()}
    </div>
  );
};

export default CraftingStation;

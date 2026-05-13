import React, { useMemo, useState } from 'react';

// Labels amigáveis para as categorias
const CATEGORY_LABELS = {
  consumables:  { label: 'Consumíveis', emoji: '🧪' },
  hold_items:   { label: 'Hold Items',  emoji: '💎' },
  elite_relics: { label: 'Relíquias',   emoji: '⚔️' },
  tms:          { label: 'TMs',         emoji: '💿' },
  mega_stones:  { label: 'Mega Stones', emoji: '💎' },
  fishing_rods: { label: 'Varas',       emoji: '🎣' },
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
}) => {
  const categories = useMemo(() => Object.keys(recipes || {}), [recipes]);
  const [activeCategory, setActiveCategory] = useState(initialCategory || categories[0] || '');
  const [showLocked, setShowLocked] = useState(true);
  const [highlightedItem, setHighlightedItem] = useState(initialItem);

  React.useEffect(() => {
    if (initialItem) {
      setHighlightedItem(initialItem);
      // Encontrar a categoria do item se não foi passada
      if (!initialCategory) {
        for (const [cat, items] of Object.entries(recipes)) {
          if (items.some(it => it.id === initialItem)) {
            setActiveCategory(cat);
            break;
          }
        }
      }
      
      // Pequeno delay para garantir que o DOM renderizou após a troca de categoria
      setTimeout(() => {
        const el = document.getElementById(`recipe-item-${initialItem}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      
      // Limpa o highlight após um tempo
      const timer = setTimeout(() => setHighlightedItem(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [initialItem, initialCategory, recipes]);

  const getMaterialCost = (item) =>
    Object.fromEntries(Object.entries(item.cost || {}).filter(([m]) => m !== 'currency'));

  const getAvail = (mat) =>
    (inventory?.materials?.[mat] || 0) + (inventory?.items?.[mat] || 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col text-left">

      {/* Tabs de categoria */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => {
          const meta = CATEGORY_LABELS[cat] || { label: cat.replace(/_/g, ' '), emoji: '📦' };
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-black uppercase transition-all ${
                activeCategory === cat
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <span>{meta.emoji}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

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
        {(recipes[activeCategory] || []).map(item => {
          const unlocked = hasRecipe(item.id);
          const guide    = recipeGuides[item.id];
          const materialCost = getMaterialCost(item);
          const canCraft = unlocked && Object.entries(materialCost).every(
            ([mat, amt]) => getAvail(mat) >= amt
          );

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
                  : canCraft
                  ? 'border-emerald-200 bg-white shadow-md hover:border-emerald-400'
                  : 'border-slate-100 bg-white opacity-70'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Ícone */}
                <div className={`rounded-2xl p-3 shrink-0 ${
                  !unlocked ? 'bg-slate-100' : 'bg-slate-50'
                }`}>
                  {unlocked ? (
                    <img src={item.img} className="w-10 h-10 object-contain drop-shadow" alt={item.name}
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
                      <span className="text-[8px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full uppercase">
                        📜 Receita encontrada
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
                      {item.cost?.currency > 0 && (
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${
                          currency >= item.cost.currency ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-500'
                        }`}>
                          💰 {currency.toLocaleString()}/{item.cost.currency.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    /* Dica de onde dropar */
                    <div className="mt-2 flex items-start gap-1.5">
                      <span className="text-sm shrink-0">📍</span>
                      <p className="text-[9px] text-amber-700 font-bold leading-tight">
                        {guide?.label || 'Derrote Pokémon nas rotas para encontrar esta receita.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botão */}
                {unlocked && (
                  <button
                    disabled={!canCraft}
                    onClick={() => onCraft(item)}
                    className={`shrink-0 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                      canCraft
                        ? 'bg-slate-800 text-white hover:bg-emerald-600 hover:shadow-lg active:scale-95'
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    Forjar
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Vazio */}
        {(recipes[activeCategory] || []).filter(item => showLocked || hasRecipe(item.id)).length === 0 && (
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
    </div>
  );
};

export default CraftingStation;

import React, { useMemo, useState } from 'react';

const CraftingStation = ({ recipes, inventory, currency, onCraft }) => {
  const categories = useMemo(() => Object.keys(recipes || {}), [recipes]);
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const visibleCategories = categories.filter(category => category === activeCategory);
  const hasSeenCost = (item) => Object.keys(item.cost || {}).some(mat => {
    if (mat === 'currency') return currency >= Math.max(1, Math.floor((item.cost.currency || 0) * 0.5));
    return (inventory.materials?.[mat] || inventory.items?.[mat] || 0) > 0;
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col text-left">
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`shrink-0 rounded-xl px-4 py-2 text-[10px] font-black uppercase transition-all ${
              activeCategory === category ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {category.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
      <div className="space-y-5 overflow-y-auto pr-2 scrollbar-hide">
      {Object.entries(recipes).filter(([category]) => visibleCategories.includes(category)).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-2">
             <div className="w-2 h-2 rounded-full bg-pokeBlue"></div>
             <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">{category.replace('_', ' ')}</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {items.filter(item => hasSeenCost(item)).map(item => {
              const canCraft = Object.entries(item.cost).every(([mat, amount]) => {
                if (mat === 'currency') return currency >= amount;
                const available = inventory.materials[mat] || inventory.items[mat] || 0;
                return available >= amount;
              });

              return (
                <div key={item.id} className={`bg-white p-4 rounded-3xl border-2 transition-all flex items-center justify-between group ${canCraft ? 'border-slate-100 shadow-md hover:border-pokeBlue' : 'border-slate-50 opacity-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                      <img src={item.img} className="w-10 h-10 object-contain drop-shadow" alt={item.name} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 uppercase italic tracking-tight">{item.name}</h4>
                      <div className="flex gap-2 mt-1">
                        {Object.entries(item.cost).map(([mat, amount]) => (
                          <span key={mat} className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${ (mat === 'currency' ? currency : (inventory.materials[mat] || inventory.items[mat] || 0)) >= amount ? 'bg-slate-100 text-slate-400' : 'bg-red-50 text-red-400'}`}>
                            {mat.replace('_', ' ')}: {mat === 'currency' ? currency : (inventory.materials[mat] || inventory.items[mat] || 0)}/{amount}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={!canCraft}
                    onClick={() => onCraft(item)}
                    className={`bg-slate-800 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${canCraft ? 'hover:bg-pokeBlue hover:shadow-lg active:scale-95' : 'bg-slate-200 cursor-not-allowed'}`}
                  >
                    Craft
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default CraftingStation;

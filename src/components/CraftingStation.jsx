import React from 'react';

const CraftingStation = ({ recipes, inventory, currency, onCraft }) => {
  return (
    <div className="space-y-8 overflow-y-auto max-h-[65vh] pr-2 scrollbar-hide text-left">
      {Object.entries(recipes).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-2">
             <div className="w-2 h-2 rounded-full bg-pokeBlue"></div>
             <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">{category.replace('_', ' ')}</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {items.map(item => {
              const canCraft = Object.entries(item.cost).every(([mat, amount]) => {
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
                          <span key={mat} className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${ (inventory.materials[mat] || inventory.items[mat] || 0) >= amount ? 'bg-slate-100 text-slate-400' : 'bg-red-50 text-red-400'}`}>
                            {mat.replace('_', ' ')}: {inventory.materials[mat] || inventory.items[mat] || 0}/{amount}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={!canCraft}
                    onClick={() => onCraft(item)}
                    className={`bg-slate-800 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${canCraft ? 'hover:bg-pokeBlue hover:shadow-lg active:scale-95' : 'bg-slate-200 cursor-not-allowed'}`}
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
  );
};

export default CraftingStation;

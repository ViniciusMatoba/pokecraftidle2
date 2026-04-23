import React from 'react';

export const MoveCategoryIcon = ({ category }) => {
  if (category === 'Physical') return <span className="bg-red-600 text-[8px] px-1.5 py-0.5 rounded-md font-black text-white shadow-sm" title="Physical">⚔️</span>;
  if (category === 'Special') return <span className="bg-indigo-600 text-[8px] px-1.5 py-0.5 rounded-md font-black text-white shadow-sm" title="Special">🔮</span>;
  return <span className="bg-slate-400 text-[8px] px-1.5 py-0.5 rounded-md font-black text-white shadow-sm" title="Status">🛡️</span>;
};

export const StatusBadges = ({ status = [], stages = {} }) => {
  const safeStatus = status || [];
  const safeStages = stages || {};
  const grouped = safeStatus.reduce((acc, s) => {
    acc[s.label] = { count: (acc[s.label]?.count || 0) + 1, color: s.color };
    return acc;
  }, {});
  const stageLabels = { attack: 'ATK', defense: 'DEF', spAtk: 'SATK', spDef: 'SDEF', speed: 'SPD' };

  return (
    <div className="flex flex-wrap gap-1 mt-1 justify-start items-center">
      {Object.entries(grouped).map(([label, data], i) => (
        <span key={i} className={`${data.color} text-white text-[7px] font-black px-1.5 py-0.5 rounded-md shadow-sm animate-bounce flex items-center gap-0.5 border border-white/20`}>
          {data.count > 1 && <span className="opacity-70">{data.count}x</span>}
          {label.toUpperCase()}
        </span>
      ))}
      {Object.entries(safeStages).map(([stat, val]) => {
        if (val === 0 || val === undefined) return null;
        const isPos = val > 0;
        const absVal = Math.abs(val);
        const bgColor = isPos ? (absVal >= 3 ? 'bg-blue-600' : 'bg-blue-500') : 'bg-slate-500';
        return (
          <span key={stat} className={`${bgColor} text-white text-[7px] font-black px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5 border border-white/10 ${isPos ? 'animate-pulse' : ''}`}>
            <span className="opacity-70">{stageLabels[stat] || stat.toUpperCase()}</span>
            <span className="font-bold">{isPos ? '+' : ''}{val}</span>
          </span>
        );
      })}
    </div>
  );
};

export const QuickInventory = ({ inventory, onUseItem }) => {
  const safeItems = inventory?.items || inventory || {};
  const items = [
    { id: 'pokeballs', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', label: 'Poké' },
    { id: 'potions', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png', label: 'Pot' },
    { id: 'nugget', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png', label: 'Coins' }
  ];

  return (
    <div className="flex gap-4 items-center bg-white/50 backdrop-blur-sm p-4 rounded-3xl border-2 border-white shadow-inner">
      {items.map(item => (
        <button 
          key={item.id} 
          disabled={!safeItems[item.id] || safeItems[item.id] <= 0}
          onClick={() => onUseItem && onUseItem(item.id)}
          className="flex flex-col items-center gap-1 group disabled:opacity-30 disabled:grayscale transition-all"
        >
           <div className="bg-white p-3 rounded-2xl shadow-sm border-2 border-slate-100 group-hover:border-pokeBlue transition-all">
             <img src={item.img} alt={item.label} className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
           </div>
           <span className="text-xs font-black text-slate-800 tracking-tighter">{safeItems[item.id] || 0}</span>
        </button>
      ))}
    </div>
  );
};

export const TrainerCard = ({ trainer, badges, caughtCount }) => {
  if (!trainer) return null;
  return (
    <div className="bg-white p-4 rounded-xl border-4 border-slate-300 shadow-lg flex items-center gap-4 transition-all hover:border-pokeBlue text-left">
      <div className="bg-slate-100 rounded-lg p-2 border-2 border-slate-200">
        <img src={trainer.avatarImg} onError={(e) => e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'} alt="Avatar" className="w-16 h-16 object-contain" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
           <h3 className="font-black text-xl text-slate-800 uppercase italic tracking-tighter leading-none">{trainer.name || 'Treinador'}</h3>
           <span className="bg-slate-800 text-white text-[9px] px-2 py-0.5 rounded-full font-black">Nv. {trainer.level || 1}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
           <div className="bg-pokeBlue h-full" style={{ width: `${Math.min(((trainer.xp || 0) / ((trainer.level || 1) * 200)) * 100, 100)}%` }}></div>
        </div>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${badges.includes(i + 1) ? 'bg-pokeYellow' : 'bg-slate-200 opacity-50'}`}></div>
          ))}
        </div>
        <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-1">
           <span className="text-pokeBlue">●</span> {caughtCount} Capturados
        </p>
      </div>
    </div>
  );
};

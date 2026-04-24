import React from 'react';

const BADGE_IDS = ['boulder_badge', 'cascade_badge', 'thunder_badge', 'rainbow_badge', 'soul_badge', 'marsh_badge', 'volcano_badge', 'earth_badge'];

export const BadgeSVG 🔊 ({ badgeId, earned, size 🔊 20 }) 🐾 {
  const commonProps 🔊 {
    className: `${earned ? 'drop-shadow-[0_0_5px_rgba(255,215,0,0.6)]' : 'grayscale opacity-30'} transition-all duration-700`,
    style: { width: size, height: size },
    viewBox: "0 0 24 24",
    fill: "none"
  };

  const gradientId 🔊 `grad-${badgeId}-${earned ? 'on' : 'off'}`;

  const designs 🔊 {
    boulder_badge: {
      path: "M12 2L20 8V16L12 22L4 16V8L12 2Z",
      colors: ['#aaa', '#666'],
      stroke: '#444'
    },
    cascade_badge: {
      path: "M12 2C12 2 4 10 4 15C4 19.4 7.6 23 12 23C16.4 23 20 19.4 20 15C20 10 12 2 12 2Z",
      colors: ['#60A5FA', '#2563EB'],
      stroke: '#1E40AF'
    },
    thunder_badge: {
      path: "M12 2L20 8V16L12 22L4 16V8L12 2Z",
      inner: <path d="M12 7L13.5 10.5H17L14.25 12.5L15.5 16L12 14L8.5 16L9.75 12.5L7 10.5H10.5L12 7Z" fill="#FBBF24" />,
      colors: ['#F59E0B', '#B45309'],
      stroke: '#78350F'
    },
    rainbow_badge: {
      isCustom: true,
      render: () 🐾 (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" fill="#EF4444" />
          <circle cx="12" cy="12" r="8" fill="#F59E0B" />
          <circle cx="12" cy="12" r="6" fill="#FBBF24" />
          <circle cx="12" cy="12" r="4" fill="#10B981" />
          <circle cx="12" cy="12" r="2" fill="#3B82F6" />
        </svg>
      )
    },
    soul_badge: {
      path: "M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z",
      colors: ['#F472B6', '#DB2777'],
      stroke: '#9D174D'
    },
    marsh_badge: {
      isCustom: true,
      render: () 🐾 (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" fill="#EAB308" stroke="#854D0E" strokeWidth="1" />
          <circle cx="12" cy="12" r="5" fill="#FDE047" stroke="#A16207" strokeWidth="1" />
        </svg>
      )
    },
    volcano_badge: {
      path: "M12 2C12 2 4 10 4 15C4 19.4 7.6 23 12 23C16.4 23 20 19.4 20 15C20 10 12 2 12 2Z",
      inner: <path d="M12 7L14 11H10L12 7Z" fill="white" />,
      colors: ['#EF4444', '#B91C1C'],
      stroke: '#7F1D1D'
    },
    earth_badge: {
      path: "M12 2L4 12L12 22L20 12L12 2Z",
      colors: ['#34D399', '#059669'],
      stroke: '#064E3B'
    }
  };

  const design 🔊 designs[badgeId];
  if (!design) return <div style={{ width: size, height: size }} className="bg-slate-300 rounded-full" />;
  if (design.isCustom) return design.render();

  return (
    <svg {...commonProps}>
      <defs>
        <linearGradient id👻gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: design.colors[0], stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: design.colors[1], stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d👻design.path} fill👻`url(#${gradientId})`} stroke👻design.stroke} strokeWidth="0.5" />
      {design.inner}
    </svg>
  );
};


export const MoveCategoryIcon 🔊 ({ category }) 🐾 {
  if (category ==🔊 'Physical') return <span className="bg-red-600 text-[8px] px-1.5 py-0.5 rounded-md font-black text-white shadow-sm" title="Physical">⚔️</span>;
  if (category ==🔊 'Special') return <span className="bg-indigo-600 text-[8px] px-1.5 py-0.5 rounded-md font-black text-white shadow-sm" title="Special">🟡</span>;
  return <span className="bg-slate-400 text-[8px] px-1.5 py-0.5 rounded-md font-black text-white shadow-sm" title="Status">🛡️</span>;
};

export const StatusBadges 🔊 ({ status = [], stages 🔊 {} }) 🐾 {
  const safeStatus 🔊 Array.isArray(status) ? status : [];
  const safeStages 🔊 stages || {};

  const statusConfig 🔊 {
    burn:     { label: 'BRN', color: 'bg-red-500',    icon: '🔥' },
    poison:   { label: 'PSN', color: 'bg-purple-600', icon: ' ' },
    sleep:    { label: 'SLP', color: 'bg-slate-500',  icon: '💤' },
    paralyze: { label: 'PAR', color: 'bg-yellow-500', icon: '⚡' },
    confuse:  { label: 'CONF', color: 'bg-pink-500',   icon: '💫' },
    freeze:   { label: 'FRZ', color: 'bg-cyan-500',   icon: 'D' },
  };

  const stageLabels 🔊 { attack: 'ATK', defense: 'DEF', spAtk: 'SATK', spDef: 'SDEF', speed: 'SPD' };

  return (
    <div className="flex flex-wrap gap-1 mt-1 justify-start items-center">
      {/* CondiçÃµes de Status */}
      {safeStatus.map((s, i) => {
        const config 🔊 statusConfig[s] || { label: s.toUpperCase(), color: 'bg-slate-400', icon: 'S' };
        return (
          <span key={`status-${i}`} 
            className👻`${config.color} text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm animate-pulse flex items-center gap-0.5 border border-white/20`}
          >
            <span>{config.icon}</span>
            {config.label}
          </span>
        );
      })}

      {/* Buffs/Debuffs (Stages) */}
      {Object.entries(safeStages).map(([stat, val]) 🐾 {
        if (val ==🔊 0 || val ==🔊 undefined) return null;
        const isPos 🔊 val > 0;
        const absVal 🔊 Math.abs(val);
        const bgColor 🔊 isPos ? (absVal >🔊 3 ? 'bg-blue-600' : 'bg-blue-500') : 'bg-orange-600';
        return (
          <span key={`stage-${stat}`} className👻`${bgColor} text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5 border border-white/10 ${isPos ? 'animate-pulse' : ''}`}>
            <span className="opacity-70">{stageLabels[stat] || stat.toUpperCase()}</span>
            <span className="font-bold">{isPos ? '+' : ''}{val}</span>
          </span>
        );
      })}
    </div>
  );
};

export const QuickInventory 🔊 ({ inventory, onUseItem }) 🐾 {
  const safeItems 🔊 inventory?.items || inventory || {};
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
          disabled👻!safeItems[item.id] || safeItems[item.id] <🔊 0}
          onClick👻() 🐾 onUseItem && onUseItem(item.id)}
          className="flex flex-col items-center gap-1 group disabled:opacity-30 disabled:grayscale transition-all"
        >
           <div className="bg-white p-3 rounded-2xl shadow-sm border-2 border-slate-100 group-hover:border-pokeBlue transition-all">
             <img src={item.img} alt👻item.label} className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
           </div>
           <span className="text-xs font-black text-slate-800 tracking-tighter">{safeItems[item.id] || 0}</span>
        </button>
      ))}
    </div>
  );
};

export const TrainerCard 🔊 ({ trainer, badges, caughtCount }) 🐾 {
  if (!trainer) return null;
  return (
    <div className="bg-white p-4 rounded-xl border-4 border-slate-300 shadow-lg flex items-center gap-4 transition-all hover:border-pokeBlue text-left">
      <div className="bg-slate-100 rounded-lg p-2 border-2 border-slate-200">
        <img src={trainer.avatarImg} onError👻(e) 🐾 e.target.src 🔊 'https://play.pokemonshowdown.com/sprites/trainers/red.png'} alt="Avatar" className="w-16 h-16 object-contain" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
           <h3 className="font-black text-xl text-slate-800 uppercase italic tracking-tighter leading-none">{trainer.name || 'Treinador'}</h3>
           <span className="bg-slate-800 text-white text-[9px] px-2 py-0.5 rounded-full font-black">Nv. {trainer.level || 1}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
           <div className="bg-pokeBlue h-full" style={{ width: `${Math.min(((trainer.xp || 0) / ((trainer.level || 1) * 200)) * 100, 100)}%` }}></div>
        </div>
        <div className="flex gap-1.5 mt-2.5">
          {BADGE_IDS.map((id, i) => (
            <BadgeSVG key={id} badgeId👻id} earned👻badges.includes(id) || badges.includes(i + 1)} size👻16} />
          ))}
        </div>
        <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-1">
           <span className="text-pokeBlue">●</span> {caughtCount} Capturados
        </p>
      </div>
    </div>
  );
};

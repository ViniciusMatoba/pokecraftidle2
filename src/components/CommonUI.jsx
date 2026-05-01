import React from 'react';

const BADGE_IDS = ['boulder_badge', 'cascade_badge', 'thunder_badge', 'rainbow_badge', 'soul_badge', 'marsh_badge', 'volcano_badge', 'earth_badge'];
const JOHTO_BADGE_IDS = ['zephyr_badge', 'hive_badge', 'plain_badge', 'fog_badge', 'storm_badge', 'mineral_badge', 'glacier_badge', 'rising_badge'];
const HOENN_BADGE_IDS = ['stone_badge', 'knuckle_badge', 'dynamo_badge', 'heat_badge', 'balance_badge', 'feather_badge', 'mind_badge', 'rain_badge'];

export const BadgeSVG = ({ badgeId, earned, size = 20 }) => {
  const commonProps = {
    className: `${earned ? 'drop-shadow-[0_0_5px_rgba(255,215,0,0.6)]' : 'grayscale opacity-30'} transition-all duration-700`,
    style: { width: size, height: size },
    viewBox: "0 0 24 24",
    fill: "none"
  };

  const gradientId = `grad-${badgeId}-${earned ? 'on' : 'off'}`;

  const designs = {
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
      render: () => (
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
      render: () => (
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
    },
    zephyr_badge: {
      path: "M12 2L20 8V16L12 22L4 16V8L12 2Z",
      colors: ['#93C5FD', '#3B82F6'],
      stroke: '#1D4ED8',
      inner: <path d="M12 6L14 12H10L12 6Z" fill="white" />
    },
    hive_badge: {
      path: "M12 2L20 7V17L12 22L4 17V7L12 2Z",
      colors: ['#A3E635', '#4D7C0F'],
      stroke: '#365314',
      inner: <circle cx="12" cy="12" r="4" fill="#FEF08A" />
    },
    plain_badge: {
       isCustom: true,
       render: () => (
         <svg {...commonProps}>
           <rect x="4" y="4" width="16" height="16" rx="4" fill="#F472B6" stroke="#9D174D" strokeWidth="1" />
           <circle cx="12" cy="12" r="4" fill="#FDF2F8" />
         </svg>
       )
    },
    fog_badge: {
      path: "M12 2C7 2 3 6 3 11C3 16 7 20 12 22C17 20 21 16 21 11C21 6 17 2 12 2Z",
      colors: ['#C084FC', '#7E22CE'],
      stroke: '#581C87',
      inner: <path d="M8 12C8 12 10 10 12 10C14 10 16 12 16 12" stroke="white" strokeWidth="2" />
    },
    storm_badge: {
      path: "M12 2L22 12L12 22L2 12L12 2Z",
      colors: ['#94A3B8', '#334155'],
      stroke: '#0F172A',
      inner: <path d="M10 8L14 16H6L10 8Z" fill="#FBBF24" />
    },
    mineral_badge: {
      path: "M4 4H20V20H4V4Z",
      colors: ['#CBD5E1', '#475569'],
      stroke: '#1E293B'
    },
    glacier_badge: {
      path: "M12 2L20 12L12 22L4 12L12 2Z",
      colors: ['#7DD3FC', '#0EA5E9'],
      stroke: '#0369A1',
      inner: <circle cx="12" cy="12" r="3" fill="white" />
    },
    rising_badge: {
      path: "M12 2C12 2 20 8 20 16C20 20 16 23 12 23C8 23 4 20 4 16C4 8 12 2 12 2Z",
      colors: ['#818CF8', '#4338CA'],
      stroke: '#312E81',
      inner: <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" />
    },
    stone_badge: { path: "M4 4H20V20H4V4Z", colors: ['#94a3b8', '#475569'], stroke: '#1e293b' },
    knuckle_badge: { path: "M12 2L22 12L12 22L2 12L12 2Z", colors: ['#fb923c', '#ea580c'], stroke: '#9a3412' },
    dynamo_badge: { path: "M12 2L15 10H22L16 15L18 22L12 17L6 22L8 15L2 10H9L12 2Z", colors: ['#facc15', '#ca8a04'], stroke: '#854d0e' },
    heat_badge: { path: "M12 2C12 2 4 10 4 15C4 19.4 7.6 23 12 23C16.4 23 20 19.4 20 15C20 10 12 2 12 2Z", colors: ['#f87171', '#dc2626'], stroke: '#991b1b' },
    balance_badge: { path: "M4 12H20M12 4V20", colors: ['#e2e8f0', '#94a3b8'], stroke: '#475569' },
    feather_badge: { path: "M12 2L20 22L12 18L4 22L12 2Z", colors: ['#38bdf8', '#0284c7'], stroke: '#075985' },
    mind_badge: { path: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z", colors: ['#f472b6', '#db2777'], stroke: '#9d174d' },
    rain_badge: { path: "M12 2L20 12L12 22L4 12L12 2Z", colors: ['#60a5fa', '#2563eb'], stroke: '#1e40af' }
  };

  const design = designs[badgeId];
  if (!design) return <div style={{ width: size, height: size }} className="bg-slate-300 rounded-full" />;
  if (design.isCustom) return design.render();

  return (
    <svg {...commonProps}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: design.colors[0], stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: design.colors[1], stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d={design.path} fill={`url(#${gradientId})`} stroke={design.stroke} strokeWidth="0.5" />
      {design.inner}
    </svg>
  );
};


export const MoveCategoryIcon = ({ category }) => {
  if (category === 'Physical') return <span className="bg-red-600 text-[8px] px-1.5 py-0.5 rounded-md font-black text-white shadow-sm" title="Physical">⚔️</span>;
  if (category === 'Special') return <span className="bg-indigo-600 text-[8px] px-1.5 py-0.5 rounded-md font-black text-white shadow-sm" title="Special">🟡</span>;
  return <span className="bg-slate-400 text-[8px] px-1.5 py-0.5 rounded-md font-black text-white shadow-sm" title="Status">🛡️</span>;
};

export const StatusBadges = ({ status = [], stages = {} }) => {
  const safeStatus = Array.isArray(status) ? status : [];
  const safeStages = stages || {};

  const statusConfig = {
    burn:     { label: 'BRN', color: 'bg-red-500',    icon: '🔥' },
    poison:   { label: 'PSN', color: 'bg-purple-600', icon: '☠️' },
    sleep:    { label: 'SLP', color: 'bg-slate-500',  icon: '💤' },
    paralyze: { label: 'PAR', color: 'bg-yellow-500', icon: '⚡' },
    confuse:  { label: 'CONF', color: 'bg-pink-500',   icon: '💫' },
    freeze:   { label: 'FRZ', color: 'bg-cyan-500',   icon: '❄️' },
  };

  const stageLabels = { attack: 'ATK', defense: 'DEF', spAtk: 'SATK', spDef: 'SDEF', speed: 'SPD' };

  return (
    <div className="flex flex-wrap gap-1 mt-1 justify-start items-center">
      {/* Condiçíµes de Status */}
      {safeStatus.map((s, i) => {
        const config = statusConfig[s] || { label: s.toUpperCase(), color: 'bg-slate-400', icon: 'S' };
        return (
          <span key={`status-${i}`} 
            className={`${config.color} text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm animate-pulse flex items-center gap-0.5 border border-white/20`}
          >
            <span>{config.icon}</span>
            {config.label}
          </span>
        );
      })}

      {/* Buffs/Debuffs (Stages) */}
      {Object.entries(safeStages).map(([stat, val]) => {
        if (val === 0 || val === undefined) return null;
        const isPos = val > 0;
        const absVal = Math.abs(val);
        const bgColor = isPos ? (absVal >= 3 ? 'bg-blue-600' : 'bg-blue-500') : 'bg-orange-600';
        return (
          <span key={`stage-${stat}`} className={`${bgColor} text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5 border border-white/10 ${isPos ? 'animate-pulse' : ''}`}>
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

export const TrainerCard = ({ 
  trainer, 
  badges = [], 
  caughtCount = 0, 
  worldFlags = [], 
  powerScore = 0,
  forgedItems = 0,
  bossDamage = 0
}) => {
  if (!trainer) return null;

  const isKantoChampion = worldFlags.includes('champion');
  const isJohtoChampion = worldFlags.includes('johto_champion');

  const achievements = [
    { id: 'pokedex', icon: '📖', label: 'Pokédex', active: caughtCount >= 50, title: '50+ Capturas' },
    { id: 'crafting', icon: '🔨', label: 'Crafting', active: forgedItems >= 1, title: 'Primeira Forja' },
    { id: 'slayer', icon: '💀', label: 'Boss Slayer', active: bossDamage >= 100000, title: '100k+ Dano Boss' }
  ];

  return (
    <div className="relative bg-[#1a1a2e] p-5 rounded-[2rem] border-4 border-slate-700 shadow-2xl flex flex-col gap-5 text-left overflow-hidden">
      <style>{`
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.8)); transform: scale(1.1); }
        }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
      `}</style>

      {/* Topo: Sprite + Nome/PS */}
      <div className="flex items-center gap-4">
        <div className="bg-slate-800 rounded-3xl p-3 border-2 border-slate-600 shadow-inner shrink-0">
          <img 
            src={trainer.avatarImg} 
            onError={(e) => e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'} 
            alt="Avatar" 
            className="w-20 h-20 object-contain drop-shadow-lg" 
          />
        </div>
        <div className="flex-1 min-w-0">
           <h3 className="font-black text-2xl text-white uppercase italic tracking-tighter leading-none truncate mb-1">
             {trainer.name || 'Treinador'}
           </h3>
           <div className="flex items-center gap-2">
             <span className="bg-emerald-600/20 text-emerald-400 text-[10px] px-3 py-1 rounded-full font-black border border-emerald-500/30">
               PS: {powerScore.toLocaleString()}
             </span>
             <span className="bg-slate-700 text-slate-300 text-[10px] px-3 py-1 rounded-full font-black border border-slate-600">
               Nv. {trainer.level || 1}
             </span>
           </div>
        </div>
      </div>

      {/* Seção de Regiões */}
      <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5 shadow-inner">
        {/* Kanto */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-12 shrink-0">Kanto</span>
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar py-1">
            {BADGE_IDS.map((id, i) => (
              <BadgeSVG key={id} badgeId={id} earned={badges.includes(id) || badges.includes(i + 1)} size={18} />
            ))}
          </div>
          <div className="w-8 flex justify-center shrink-0">
            {isKantoChampion && (
              <span className="text-xl animate-glow" title="Campeão de Kanto">👑</span>
            )}
          </div>
        </div>

        <div className="h-px bg-white/5 w-full"></div>

        {/* Johto */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-12 shrink-0">Johto</span>
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar py-1">
            {JOHTO_BADGE_IDS.map((id, i) => (
              <BadgeSVG key={id} badgeId={id} earned={badges.includes(id) || badges.includes(i + 9) || worldFlags.includes(id)} size={18} />
            ))}
          </div>
          <div className="w-8 flex justify-center shrink-0">
            {isJohtoChampion && (
              <span className="text-xl animate-glow" title="Campeão de Johto">👑</span>
            )}
          </div>
        </div>

        {worldFlags.includes('johto_champion') && (
          <>
            <div className="h-px bg-white/5 w-full"></div>
            {/* Hoenn */}
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-12 shrink-0">Hoenn</span>
              <div className="flex-1 flex items-center gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar py-1">
                {HOENN_BADGE_IDS.map((id, i) => (
                  <BadgeSVG key={id} badgeId={id} earned={badges.includes(id) || worldFlags.includes(id)} size={18} />
                ))}
              </div>
              <div className="w-8 flex justify-center shrink-0">
                {(worldFlags.includes('hoenn_champion')) && (
                  <span className="text-xl animate-glow" title="Campeão de Hoenn">👑</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sistema de Medalhas (Rodapé) */}
      <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 text-center">Conquistas de Elite</p>
        <div className="flex justify-around items-center">
          {achievements.map(ach => (
            <div 
              key={ach.id} 
              className={`flex flex-col items-center gap-1 transition-all duration-500 ${ach.active ? 'scale-110' : 'grayscale opacity-30'}`}
              title={ach.title}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-900 border-2 ${ach.active ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'border-slate-700'}`}>
                <span className={`text-2xl ${ach.active ? 'animate-glow' : ''}`}>{ach.icon}</span>
              </div>
              <span className="text-[8px] font-black text-white uppercase tracking-tighter">{ach.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TrainerCardModal = ({ userData, onClose }) => {
  if (!userData) return null;

  return (
    <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-sm relative animate-bounceIn">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-black border-2 border-red-400 shadow-lg active:scale-95 z-10"
        >X</button>
        
        <TrainerCard 
          trainer={{
            name: userData.name,
            avatarImg: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/${userData.avatar || 1}.png`,
            level: userData.level || 1
          }}
          badges={userData.badgesList || []}
          caughtCount={userData.caughtCount || 0}
          worldFlags={userData.worldFlags || []}
          powerScore={userData.powerScore || 0}
          forgedItems={userData.forgedItemsCount || 0}
          bossDamage={userData.bossTotalDamage || 0}
        />

        <div className="mt-6 text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Inspecionando Perfil Global</p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { createPortal } from 'react-dom';
import { getPrimaryTrainerTitle, getUnlockedTrainerTitles } from '../data/trainerTitles';

const BADGE_IDS = ['boulder_badge', 'cascade_badge', 'thunder_badge', 'rainbow_badge', 'soul_badge', 'marsh_badge', 'volcano_badge', 'earth_badge'];
const JOHTO_BADGE_IDS = ['zephyr_badge', 'hive_badge', 'plain_badge', 'fog_badge', 'storm_badge', 'mineral_badge', 'glacier_badge', 'rising_badge'];
const HOENN_BADGE_IDS = ['stone_badge', 'knuckle_badge', 'dynamo_badge', 'heat_badge', 'balance_badge', 'feather_badge', 'mind_badge', 'rain_badge'];
const SINNOH_BADGE_IDS = ['coal_badge', 'forest_badge', 'cobble_badge', 'fen_badge', 'relic_badge', 'mine_badge', 'icicle_badge', 'beacon_badge'];
const FUTURE_REGION_BADGES = [
  { id: 'unova', label: 'Unova', started: 'unova_started', champion: 'unova_champion', badges: ['trio_badge', 'basic_badge', 'insect_badge', 'bolt_badge', 'quake_badge', 'jet_badge', 'freeze_badge', 'legend_badge'] },
  { id: 'kalos', label: 'Kalos', started: 'kalos_started', champion: 'kalos_champion', badges: ['bug_badge', 'cliff_badge', 'rumble_badge', 'plant_badge', 'voltage_badge', 'fairy_badge', 'psychic_badge', 'iceberg_badge'] },
  { id: 'alola', label: 'Alola', started: 'alola_started', champion: 'alola_champion', badges: ['melemele_stamp', 'akala_stamp', 'ulaula_stamp', 'poni_stamp', 'alola_elite_stamp', 'alola_champion_stamp', 'ultra_stamp', 'battle_tree_stamp'] },
  { id: 'galar', label: 'Galar', started: 'galar_started', champion: 'galar_champion', badges: ['grass_badge_galar', 'water_badge_galar', 'fire_badge_galar', 'fighting_badge_galar', 'fairy_badge_galar', 'rock_badge_galar', 'dark_badge_galar', 'dragon_badge_galar'] },
  { id: 'paldea', label: 'Paldea', started: 'paldea_started', champion: 'paldea_champion', badges: ['bug_badge_paldea', 'grass_badge_paldea', 'electric_badge_paldea', 'water_badge_paldea', 'normal_badge_paldea', 'ghost_badge_paldea', 'psychic_badge_paldea', 'ice_badge_paldea'] },
];

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
      isCustom: true,
      render: () => (
        <svg {...commonProps}>
          <defs>
            <radialGradient id={`${gradientId}-soul`} cx="35%" cy="25%" r="70%">
              <stop offset="0%" stopColor={earned ? '#FBCFE8' : '#CBD5E1'} />
              <stop offset="55%" stopColor={earned ? '#EC4899' : '#94A3B8'} />
              <stop offset="100%" stopColor={earned ? '#831843' : '#475569'} />
            </radialGradient>
          </defs>
          <path d="M12 3.2C15.8 3.2 19 6.2 19 10C19 15.1 12 21.5 12 21.5C12 21.5 5 15.1 5 10C5 6.2 8.2 3.2 12 3.2Z" fill={`url(#${gradientId}-soul)`} stroke={earned ? '#F9A8D4' : '#64748B'} strokeWidth="1.4" />
          <path d="M8.1 10.6C9.7 8.6 14.3 8.6 15.9 10.6C14.8 12.4 13.5 13.7 12 15.1C10.5 13.7 9.2 12.4 8.1 10.6Z" fill={earned ? '#FFF1F2' : '#E2E8F0'} opacity="0.95" />
          <circle cx="12" cy="10.7" r="2" fill={earned ? '#BE185D' : '#64748B'} />
        </svg>
      )
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
    balance_badge: {
      isCustom: true,
      render: () => (
        <svg {...commonProps}>
          <defs>
            <linearGradient id={`${gradientId}-balance`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={earned ? '#F8FAFC' : '#CBD5E1'} />
              <stop offset="55%" stopColor={earned ? '#94A3B8' : '#64748B'} />
              <stop offset="100%" stopColor={earned ? '#334155' : '#334155'} />
            </linearGradient>
          </defs>
          <path d="M12 2L20 7V15L12 22L4 15V7L12 2Z" fill={`url(#${gradientId}-balance)`} stroke={earned ? '#F8FAFC' : '#475569'} strokeWidth="1.3" />
          <path d="M12 6V17M7.5 9.5H16.5" stroke={earned ? '#0F172A' : '#E2E8F0'} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 9.5L6 14H10L8 9.5ZM16 9.5L14 14H18L16 9.5Z" fill={earned ? '#FACC15' : '#94A3B8'} stroke={earned ? '#78350F' : '#64748B'} strokeWidth="0.7" />
          <path d="M9 18H15" stroke={earned ? '#F8FAFC' : '#CBD5E1'} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    },
    feather_badge: { path: "M12 2L20 22L12 18L4 22L12 2Z", colors: ['#38bdf8', '#0284c7'], stroke: '#075985' },
    mind_badge: { path: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z", colors: ['#f472b6', '#db2777'], stroke: '#9d174d' },
    rain_badge: { path: "M12 2L20 12L12 22L4 12L12 2Z", colors: ['#60a5fa', '#2563eb'], stroke: '#1e40af' },
    coal_badge: { path: "M12 2L20 8V16L12 22L4 16V8L12 2Z", colors: ['#64748b', '#1e293b'], stroke: '#020617', inner: <circle cx="12" cy="12" r="4" fill="#f97316" /> },
    forest_badge: { path: "M12 2C16 4 20 7 20 12C20 17 16 20 12 22C8 20 4 17 4 12C4 7 8 4 12 2Z", colors: ['#86efac', '#16a34a'], stroke: '#166534', inner: <path d="M12 6V18M8 11H16" stroke="white" strokeWidth="2" strokeLinecap="round" /> },
    cobble_badge: { path: "M12 2L22 12L12 22L2 12L12 2Z", colors: ['#fb7185', '#be123c'], stroke: '#881337', inner: <path d="M8 14L12 7L16 14H8Z" fill="white" /> },
    fen_badge: { path: "M12 2C12 2 4 10 4 15C4 19.4 7.6 23 12 23C16.4 23 20 19.4 20 15C20 10 12 2 12 2Z", colors: ['#38bdf8', '#0369a1'], stroke: '#075985', inner: <circle cx="12" cy="15" r="3" fill="#e0f2fe" /> },
    relic_badge: { path: "M12 2L19 6V14L12 22L5 14V6L12 2Z", colors: ['#c084fc', '#6d28d9'], stroke: '#4c1d95', inner: <circle cx="12" cy="11" r="4" fill="#f5d0fe" /> },
    mine_badge: { path: "M4 4H20V20H4V4Z", colors: ['#cbd5e1', '#334155'], stroke: '#0f172a', inner: <path d="M7 12H17" stroke="#facc15" strokeWidth="2" /> },
    icicle_badge: { path: "M12 2L18 10L12 22L6 10L12 2Z", colors: ['#bae6fd', '#0284c7'], stroke: '#075985', inner: <path d="M12 5V18" stroke="white" strokeWidth="2" /> },
    beacon_badge: { path: "M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z", colors: ['#fde047', '#f59e0b'], stroke: '#92400e', inner: <circle cx="12" cy="12" r="3" fill="white" /> }
  };

  const design = designs[badgeId];
  if (!design) {
    const palette = ['#22c55e', '#0ea5e9', '#f97316', '#a855f7', '#ef4444', '#eab308', '#14b8a6', '#f43f5e'];
    const color = palette[String(badgeId || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % palette.length];
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="9" fill={earned ? color : '#94A3B8'} stroke={earned ? '#FDE68A' : '#64748B'} strokeWidth="1.4" />
        <path d="M12 5L14.2 10H19L15.2 13.1L16.6 18L12 15.2L7.4 18L8.8 13.1L5 10H9.8L12 5Z" fill={earned ? '#fff7ed' : '#cbd5e1'} opacity="0.95" />
      </svg>
    );
  }
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
  caughtData = {},
  worldFlags = [], 
  powerScore = 0,
  forgedItems = 0,
  bossDamage = 0,
  shinyCount = 0,
  trainerBattleWins = 0,
  inventoryItems = {},
  compactExpandable = false,
  onSelectTitle = null
}) => {
  const [expanded, setExpanded] = React.useState(!compactExpandable);
  const [showPsInfo, setShowPsInfo] = React.useState(false);

  const [showTitlePicker, setShowTitlePicker] = React.useState(false);

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowTitlePicker(false);
        setShowPsInfo(false);
      }
    };
    if (showTitlePicker || showPsInfo) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showTitlePicker, showPsInfo]);
  if (!trainer) return null;
  const showDetails = !compactExpandable || expanded;
  const titleContext = { caughtData, caughtCount, worldFlags, forgedItems, bossDamage, shinyCount, trainerBattleWins };
  const unlockedTitles = getUnlockedTrainerTitles(titleContext);
  const activeTitle = unlockedTitles.find(title => title.id === trainer.titleId) || getPrimaryTrainerTitle(titleContext);
  const canEditTitle = typeof onSelectTitle === 'function';

  const isKantoChampion = worldFlags.includes('champion');
  const isJohtoChampion = worldFlags.includes('johto_champion');
  const isHoennChampion = worldFlags.includes('hoenn_champion');
  const isSinnohChampion = worldFlags.includes('sinnoh_champion');

  const achievements = [
    { id: 'pokedex', icon: '📖', label: 'Pokédex', active: caughtCount >= 50, title: '50+ Capturas' },
    { id: 'crafting', icon: '🔨', label: 'Crafting', active: forgedItems >= 1, title: 'Primeira Forja' },
    { id: 'slayer', icon: '💀', label: 'Boss Slayer', active: bossDamage >= 100000, title: '100k+ Dano Boss' }
  ];
  const psRanks = [
    { min: 0, label: 'Poké Ball', item: 'poke-ball', colors: ['#ef4444', '#ffffff', '#1f2937'] },
    { min: 150000, label: 'Great Ball', item: 'great-ball', colors: ['#2563eb', '#ef4444', '#f8fafc'] },
    { min: 350000, label: 'Ultra Ball', item: 'ultra-ball', colors: ['#facc15', '#111827', '#f97316'] },
    { min: 750000, label: 'Master Ball', item: 'master-ball', colors: ['#a855f7', '#ec4899', '#f8fafc'] },
  ];
  const psRankIndex = psRanks.reduce((current, rank, index) => (powerScore >= rank.min ? index : current), 0);
  const psRank = psRanks[psRankIndex];
  const nextPsRank = psRanks[psRankIndex + 1];
  const psRankProgress = nextPsRank
    ? Math.min(100, Math.max(8, ((powerScore - psRank.min) / (nextPsRank.min - psRank.min)) * 100))
    : 100;
  const badgeSources = new Set([...(badges || []).map(String), ...(worldFlags || []).map(String)]);
  const allBadgeIds = [
    ...BADGE_IDS,
    ...JOHTO_BADGE_IDS,
    ...HOENN_BADGE_IDS,
    ...SINNOH_BADGE_IDS,
    ...FUTURE_REGION_BADGES.flatMap(region => region.badges),
  ];
  (badges || []).forEach(badge => {
    if (typeof badge !== 'number') return;
    const legacyId = allBadgeIds[badge - 1];
    if (legacyId) badgeSources.add(legacyId);
  });
  const regionBadgeGroups = [
    { label: 'Kanto', ids: BADGE_IDS },
    { label: 'Johto', ids: JOHTO_BADGE_IDS },
    { label: 'Hoenn', ids: HOENN_BADGE_IDS },
    { label: 'Sinnoh', ids: SINNOH_BADGE_IDS },
    ...FUTURE_REGION_BADGES.map(region => ({ label: region.label, ids: region.badges })),
  ].map(region => ({
    ...region,
    count: region.ids.filter(id => badgeSources.has(id)).length,
  }));
  const badgeCount = regionBadgeGroups.reduce((sum, region) => sum + region.count, 0);

  return (
    <div
      className={`relative bg-[#1a1a2e] p-5 rounded-[2rem] border-4 border-slate-700 shadow-2xl flex flex-col gap-5 text-left overflow-hidden transition-all ${compactExpandable ? 'cursor-pointer active:scale-[0.99] hover:border-pokeGold/70' : ''}`}
      onClick={compactExpandable ? () => setExpanded(prev => !prev) : undefined}
      role={compactExpandable ? 'button' : undefined}
      tabIndex={compactExpandable ? 0 : undefined}
      onKeyDown={compactExpandable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setExpanded(prev => !prev);
        }
      } : undefined}
      aria-expanded={compactExpandable ? expanded : undefined}
    >
      <style>{`
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.8)); transform: scale(1.1); }
        }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        @keyframes psPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(239,68,68,.24), 0 0 18px rgba(239,68,68,.14); }
          50% { box-shadow: 0 0 0 1px rgba(250,204,21,.26), 0 0 22px rgba(250,204,21,.12); }
        }
        .trainer-ps-panel { animation: psPulse 2.4s ease-in-out infinite; }
        @keyframes neonSweep {
          0% { transform: translateX(-120%); opacity: .15; }
          45% { opacity: .75; }
          100% { transform: translateX(140%); opacity: .08; }
        }
      `}</style>

      {/* Topo: Sprite + Nome/PS */}
      <div className="flex items-center gap-3">
        <div className="bg-slate-800 rounded-3xl p-3 border-2 border-slate-600 shadow-inner shrink-0">
          <img 
            src={trainer.avatarImg} 
            onError={(e) => e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'} 
            alt="Avatar" 
            className="w-20 h-20 object-contain drop-shadow-lg" 
          />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0 flex-1">
           <div className="flex min-w-0 flex-wrap items-center gap-2">
             <h3 className="min-w-0 max-w-full truncate font-black text-2xl text-white uppercase italic tracking-tighter leading-none">
               {trainer.name || 'Treinador'}
             </h3>
             {(activeTitle || canEditTitle) && (
               <button
                 type="button"
                 onClick={(e) => {
                   e.stopPropagation();
                   setShowTitlePicker(true);
                 }}
                 className="inline-flex min-h-[30px] max-w-full items-center gap-2 rounded-xl border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-inner transition-transform active:scale-95"
                 style={{
                   borderColor: activeTitle ? `${activeTitle.color}88` : 'rgba(255,255,255,.18)',
                   background: activeTitle ? activeTitle.bg : 'linear-gradient(135deg, rgba(255,255,255,.08), rgba(15,23,42,.55))',
                   color: '#fff',
                 }}
                 title={activeTitle?.description || 'Escolher titulo do Trainer Card'}
               >
                 {activeTitle ? (
                   <img src={activeTitle.icon} className="h-5 w-5 shrink-0 object-contain" alt="" />
                 ) : (
                   <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs leading-none">+</span>
                 )}
                 <span className="truncate">{activeTitle?.label || 'Adicionar titulo'}</span>
               </button>
             )}
           </div>
           <div className="mt-2 flex flex-wrap items-center gap-2">
             {!compactExpandable && (
                <span className="bg-slate-700 text-slate-300 text-[10px] px-3 py-1 rounded-full font-black border border-slate-600">
                  Nv. {trainer.level || 1}
               </span>
             )}
            </div>
          </div>
        </div>
        {compactExpandable && (
          <div className="shrink-0 w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 font-black">
            {expanded ? 'x' : '+'}
          </div>
        )}
      </div>

      {showTitlePicker && createPortal(
        <div
          className="fixed inset-0 z-[60000] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            e.stopPropagation();
            setShowTitlePicker(false);
          }}
        >
          <div
            className="w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#171a2d] shadow-2xl animate-bounceIn"
            style={{ maxHeight: '88dvh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-amber-100/70">Trainer Card</p>
                <h3 className="text-xl font-black uppercase italic leading-none text-white">Titulos desbloqueados</h3>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTitlePicker(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-black text-white"
              >
                x
              </button>
            </div>
            <div className="custom-scrollbar grid gap-3 overflow-y-auto p-5" style={{ maxHeight: 'calc(88dvh - 82px)' }}>
              {unlockedTitles.map(title => {
                const selected = activeTitle?.id === title.id;
                return (
                <button
                  type="button"
                  key={title.id}
                  disabled={!canEditTitle}
                  onClick={() => {
                    if (!canEditTitle) return;
                    onSelectTitle(title.id);
                    setShowTitlePicker(false);
                  }}
                  className={`rounded-2xl border p-3 text-left shadow-inner transition-all ${canEditTitle ? 'active:scale-[0.99] hover:brightness-110' : ''} ${selected ? 'ring-2 ring-white/60' : ''}`}
                  style={{ borderColor: selected ? title.color : `${title.color}66`, background: title.bg }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black/20 ring-1 ring-white/10">
                      <img src={title.icon} className="h-9 w-9 object-contain" alt="" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black uppercase italic text-white">{title.label}</p>
                      <p className="mt-1 text-[10px] font-bold leading-snug text-white/55">{title.description}</p>
                    </div>
                    {selected && (
                      <span className="rounded-full bg-white/15 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white">
                        Ativo
                      </span>
                    )}
                  </div>
                </button>
              );
              })}
              {unlockedTitles.length === 0 && (
                <p className="rounded-2xl bg-white/[0.04] p-5 text-center text-xs font-bold italic text-white/40">
                  Capture Pokemon, vença ligas e evolua sua jornada para liberar titulos.
                </p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowPsInfo(true);
        }}
        className="trainer-ps-panel relative overflow-hidden rounded-2xl border border-slate-600/70 border-l-red-500 bg-gradient-to-br from-[#202033] via-[#171a2d] to-[#111827] text-left shadow-[0_10px_22px_rgba(0,0,0,0.22)] transition-transform active:scale-[0.99]"
        style={{ borderLeftWidth: 5, padding: '18px 16px 14px 28px' }}
        aria-label="Explicar Poder PS"
      >
        <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full bg-red-500/8 blur-2xl"></div>
        <div className="absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-amber-300/6 blur-2xl"></div>
        <div className="relative flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-200/80">Poder PS</span>
              <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white/65">
                {psRank.label}
              </span>
              <span className="rounded-md border border-amber-200/15 bg-white/[0.06] px-2 py-1 text-[8px] font-black uppercase tracking-widest text-amber-100/70">Info</span>
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-[2.2rem] font-black leading-none text-white tabular-nums tracking-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]">
                {powerScore.toLocaleString()}
              </span>
            </div>
          </div>
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] shadow-inner"
            title={`Rank ${psRank.label}`}
          >
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${psRank.item}.png`} className="h-12 w-12 object-contain drop-shadow-[0_5px_9px_rgba(0,0,0,0.55)]" alt={psRank.label} />
          </div>
        </div>
        <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-300" style={{ width: `${psRankProgress}%` }}></div>
        </div>
      </button>

      {showPsInfo && createPortal(
        <div
          className="fixed inset-0 z-[60000] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowPsInfo(false);
          }}
        >
          <div
            className="w-full max-w-[400px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#171a2d] shadow-2xl animate-bounceIn"
            style={{ maxHeight: '88dvh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-red-600 to-red-700 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${psRank.item}.png`} className="h-9 w-9 object-contain" alt="" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.24em] text-amber-100/85">Poder do Treinador</p>
                  <h3 className="text-xl font-black uppercase italic leading-none text-white">PODER PS</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPsInfo(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-black text-white"
              >
                x
              </button>
            </div>

            <div className="custom-scrollbar space-y-4 overflow-y-auto p-5" style={{ maxHeight: 'calc(88dvh - 80px)' }}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">PS atual</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-3xl font-black leading-none text-white tabular-nums">{powerScore.toLocaleString()}</span>
                  <span className="rounded-xl border border-amber-200/20 bg-black/20 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-amber-100">
                    {psRank.label}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950/45 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">Como é composto</p>
                <p className="mt-2 text-[11px] font-bold leading-relaxed text-slate-400">
                  O PS soma Pokémon de todas as regiões, PC, equipes regionais, expedições, casa e Pokédex capturada.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 text-xs font-bold text-slate-200">
                  <div className="flex min-h-[38px] items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                    <span>Atributos dos Pokémon de todas as regiões</span>
                    <span className="text-amber-100">base</span>
                  </div>
                  <div className="flex min-h-[38px] items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                    <span>Nível de cada Pokémon</span>
                    <span className="text-amber-100">nível x10</span>
                  </div>
                  <div className="flex min-h-[38px] items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                    <span>Insígnias por região</span>
                    <span className="text-amber-100">{badgeCount} x 1.000</span>
                  </div>
                  <div className="flex min-h-[38px] items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2">
                    <span>Bônus de Pokémon shiny</span>
                    <span className="text-amber-100">+35% ou 500</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950/45 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">Insígnias somadas</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {regionBadgeGroups.filter(region => region.count > 0 || ['Kanto', 'Johto', 'Hoenn', 'Sinnoh'].includes(region.label)).map(region => (
                    <div key={region.label} className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{region.label}</p>
                      <p className="mt-1 text-sm font-black text-white">{region.count}/8</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950/45 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">Régua de rank</p>
                <div className="mt-3 space-y-2">
                  {psRanks.map(rank => {
                    const active = psRank.label === rank.label;
                    return (
                      <div key={rank.label} className={`flex min-h-[48px] items-center gap-3 rounded-xl border px-3 py-2 ${active ? 'border-amber-300/45 bg-amber-300/10' : 'border-white/8 bg-white/[0.035]'}`}>
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${rank.item}.png`} className="h-7 w-7 object-contain" alt="" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black uppercase text-white">{rank.label}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {rank.min.toLocaleString()} PS+
                          </p>
                        </div>
                        {active && <span className="text-[9px] font-black uppercase text-amber-100">Atual</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Seção de Regiões */}
      {showDetails && (
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
                {isHoennChampion && (
                  <span className="text-xl animate-glow" title="Campeão de Hoenn">👑</span>
                )}
              </div>
            </div>
          </>
        )}
        {(worldFlags.includes('hoenn_champion') || worldFlags.includes('sinnoh_started')) && (
          <>
            <div className="h-px bg-white/5 w-full"></div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-12 shrink-0">Sinnoh</span>
              <div className="flex-1 flex items-center gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar py-1">
                {SINNOH_BADGE_IDS.map((id, i) => (
                  <BadgeSVG key={id} badgeId={id} earned={badges.includes(id) || worldFlags.includes(id)} size={18} />
                ))}
              </div>
              <div className="w-8 flex justify-center shrink-0">
                {isSinnohChampion && (
                  <span className="text-xl animate-glow" title="Campeao de Sinnoh">👑</span>
                )}
              </div>
            </div>
          </>
        )}
        {FUTURE_REGION_BADGES
          .filter(region => worldFlags.includes(region.started) || worldFlags.includes(region.champion) || worldFlags.includes(`region_champion_${region.id}`))
          .map(region => (
            <React.Fragment key={region.id}>
              <div className="h-px bg-white/5 w-full"></div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-12 shrink-0">{region.label}</span>
                <div className="flex-1 flex items-center gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar py-1">
                  {region.badges.map((id) => (
                    <BadgeSVG key={id} badgeId={id} earned={badges.includes(id) || worldFlags.includes(id)} size={18} />
                  ))}
                </div>
                <div className="w-8 flex justify-center shrink-0">
                  {(worldFlags.includes(region.champion) || worldFlags.includes(`region_champion_${region.id}`)) && (
                    <span className="text-xl animate-glow" title={`Campeao de ${region.label}`}>ðŸ‘‘</span>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
      </div>
      )}

      {/* Sistema de Medalhas (Rodapé) */}
      {!compactExpandable && (
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
      )}
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
            level: userData.level || 1,
            titleId: userData.titleId
          }}
          badges={userData.badgesList || []}
          caughtCount={userData.caughtCount || 0}
          caughtData={userData.caughtData || {}}
          worldFlags={userData.worldFlags || []}
          powerScore={userData.powerScore || 0}
          forgedItems={userData.forgedItemsCount || 0}
          bossDamage={userData.bossTotalDamage || 0}
          shinyCount={userData.shinyCapturedCount || 0}
          trainerBattleWins={userData.trainerBattleWins || 0}
          inventoryItems={userData.inventory?.items || {}}
        />

        <div className="mt-6 text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Inspecionando Perfil Global</p>
        </div>
      </div>
    </div>
  );
};

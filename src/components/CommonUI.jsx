import React from 'react';
import { getPrimaryTrainerTitle, getUnlockedTrainerTitles } from '../data/trainerTitles';
import { AVATAR_SPRITES, AVATAR_TINTS, CARD_FRAMES, CARD_BACKGROUNDS, getTintFilter } from '../data/cosmetics';

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
  appearance = {},
  compactExpandable = false,
  onSelectTitle = null,
  playerStats = {},
  prestige = {},
   setIsAnyModalOpen,
  isTitleModalOpen,
  setIsTitleModalOpen,
  isPowerRankModalOpen,
  setIsPowerRankModalOpen,
  selectedTitle, // v1.83.2
}) => {
  const [expanded, setExpanded] = React.useState(!compactExpandable);
  const [showPsInfo, setShowPsInfo] = React.useState(false);
  const [showTitlePicker, setShowTitlePicker] = React.useState(false);
  const [pendingTitle, setPendingTitle] = React.useState(null); // v1.83.3

  React.useEffect(() => {
    if (setIsAnyModalOpen) {
      setIsAnyModalOpen(showTitlePicker || showPsInfo || !!pendingTitle);
    }
    if (setIsTitleModalOpen) {
      setIsTitleModalOpen(showTitlePicker);
    }
    if (setIsPowerRankModalOpen) {
      setIsPowerRankModalOpen(showPsInfo);
    }
  }, [showTitlePicker, showPsInfo, pendingTitle, setIsAnyModalOpen, setIsTitleModalOpen, setIsPowerRankModalOpen]);
  if (!trainer) return null;

  const equippedSprite = AVATAR_SPRITES[appearance.spriteId] || AVATAR_SPRITES.red;
  const equippedFrame  = CARD_FRAMES[appearance.frameId]     || CARD_FRAMES.default;
  const equippedBg     = CARD_BACKGROUNDS[appearance.bgId]   || CARD_BACKGROUNDS.slate;
  const tintFilter     = getTintFilter(appearance.tintId || 'none');
  const avatarSrc      = equippedSprite.sprite || trainer.avatarImg || 'https://play.pokemonshowdown.com/sprites/trainers/red.png';
  const showDetails = !compactExpandable || expanded;
  
  const titleContext = { 
    caughtData, caughtCount, worldFlags, forgedItems, bossDamage, 
    shinyCount, trainerBattleWins, playerStats, badges, 
    purchasedTitles: prestige?.purchasedTitles || [] 
  };
   const unlockedTitles = getUnlockedTrainerTitles(titleContext);
  const activeTitleId = selectedTitle || trainer.titleId || prestige?.activeTitle || null;
  const activeTitle = unlockedTitles.find(title => title.id === activeTitleId) || getPrimaryTrainerTitle(titleContext);
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
    { min: 0, label: 'Poké Ball', item: 'poke-ball' },
    { min: 150000, label: 'Great Ball', item: 'great-ball' },
    { min: 350000, label: 'Ultra Ball', item: 'ultra-ball' },
    { min: 750000, label: 'Master Ball', item: 'master-ball' },
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

  const badgeCountTotal = regionBadgeGroups.reduce((sum, region) => sum + region.count, 0);

  return (
    <div
      className={`relative p-5 rounded-[2.5rem] border-4 shadow-2xl flex flex-col gap-5 text-left overflow-hidden transition-all bg-gradient-to-b ${equippedBg.gradient} ${compactExpandable ? 'cursor-pointer active:scale-[0.99]' : ''}`}
      style={{ borderColor: equippedFrame.preview }}
      onClick={compactExpandable && !showTitlePicker && !showPsInfo ? () => setExpanded(prev => !prev) : undefined}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-3xl p-3 border-2 shadow-inner shrink-0 bg-black/30" style={{ borderColor: equippedFrame.preview }}>
          <img src={avatarSrc} alt="Avatar" className="w-20 h-20 object-contain drop-shadow-lg" style={{ imageRendering: 'pixelated', filter: tintFilter !== 'none' ? tintFilter : undefined }} />
        </div>
        <div className="flex-1">
          <h3 className="font-black text-2xl text-white uppercase italic tracking-tighter">{trainer.name || 'Treinador'}</h3>
          <button
            type="button"
            key={activeTitleId}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (canEditTitle) {
                console.log('-> Abrindo Seletor de Títulos');
                setShowTitlePicker(true);
              }
            }}
            className={`mt-2 inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-[9px] font-black uppercase text-white ${canEditTitle ? 'active:scale-95' : ''}`}
            style={{ borderColor: activeTitle ? `${activeTitle.color}88` : 'rgba(255,255,255,.18)', background: activeTitle ? activeTitle.bg : 'rgba(0,0,0,0.2)' }}
          >
             {activeTitle?.label || 'Iniciante'}
          </button>
        </div>
        {compactExpandable && (
          <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50">
            {expanded ? '▲' : '▼'}
          </div>
        )}
      </div>

      {showDetails && (
        <div className="grid gap-4 animate-fadeIn">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowPsInfo(true); }}
            className="trainer-ps-panel relative overflow-hidden rounded-2xl border border-slate-600/70 border-l-red-500 bg-gradient-to-br from-[#202033] to-[#111827] p-4 text-left shadow-lg"
            style={{ borderLeftWidth: 5 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <span className="text-[8px] font-black uppercase text-amber-200/80">Poder PS</span>
                <p className="text-xl font-black text-white">{powerScore.toLocaleString()}</p>
              </div>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${psRank.item}.png`} className="h-10 w-10 object-contain" alt="" />
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-black/40 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-amber-300" style={{ width: `${psRankProgress}%` }} />
            </div>
          </button>

          <div className="grid grid-cols-4 gap-2">
            <StatSmall label="Dex" value={caughtCount} />
            <StatSmall label="Shiny" value={shinyCount} />
            <StatSmall label="Badges" value={badgeCountTotal} />
            <StatSmall label="Wins" value={trainerBattleWins} />
          </div>

          <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5 shadow-inner">
            <BadgeRow label="Kanto" ids={BADGE_IDS} earnedList={badges} champion={isKantoChampion} />
            <div className="h-px bg-white/5 w-full"></div>
            <BadgeRow label="Johto" ids={JOHTO_BADGE_IDS} earnedList={badges} champion={isJohtoChampion} offset={9} />
            {isJohtoChampion && (
              <>
                <div className="h-px bg-white/5 w-full"></div>
                <BadgeRow label="Hoenn" ids={HOENN_BADGE_IDS} earnedList={worldFlags} champion={isHoennChampion} />
              </>
            )}
          </div>
        </div>
      )}

      {showTitlePicker && (
        <>
          <div 
            className="fixed inset-0 w-screen h-screen z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn cursor-default" 
            onClick={() => setShowTitlePicker(false)}
          >
            <div 
              className="w-full max-w-[400px] bg-[#0f172a] rounded-[2.5rem] border-4 border-slate-800 shadow-2xl flex flex-col animate-bounceIn overflow-hidden" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-slate-800/50 px-6 py-5 flex items-center justify-between border-b border-white/5">
                <h3 className="text-white text-xl font-black uppercase italic">Seus Titulos</h3>
                <button type="button" onClick={() => setShowTitlePicker(false)} className="w-8 h-8 rounded-full bg-white/10 text-white font-black hover:bg-red-500 transition-colors">X</button>
              </div>
              <div 
                className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2" 
                style={{ maxHeight: '60vh' }}
                onClick={(e) => e.stopPropagation()}
              >
                {unlockedTitles.map(title => {
                  const isSelected = activeTitleId === title.id;
                  return (
                    <button
                      type="button"
                      key={title.id}
                      onClick={() => {
                        console.log('-> Clique detectado no título:', title.label);
                        if (canEditTitle) setPendingTitle(title);
                      }}
                      className={`w-full p-4 rounded-3xl border-2 transition-all flex items-center gap-4 text-left ${isSelected ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border" style={{ background: title.bg, borderColor: title.color }}>
                        {title.icon && <img src={title.icon} className="w-8 h-8 object-contain" alt="" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-black uppercase text-xs leading-none mb-1 ${isSelected ? 'text-blue-400' : 'text-white'}`}>{title.label}</p>
                        <p className="text-[9px] text-white/40 line-clamp-1">{title.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal de Confirmação (v1.83.5) */}
          {pendingTitle && (
            <div 
              className="fixed inset-0 w-screen h-screen z-[200000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn"
              onClick={() => setPendingTitle(null)}
            >
              <div 
                className="w-full max-w-[360px] bg-[#0f172a] rounded-[2.5rem] border-4 border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-bounceIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl mb-6 flex items-center justify-center border-2 shadow-lg" 
                       style={{ background: pendingTitle.bg, borderColor: pendingTitle.color }}>
                    {pendingTitle.icon && <img src={pendingTitle.icon} className="w-12 h-12 object-contain" alt="" />}
                  </div>
                  
                  <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Confirmar Título</h4>
                  <h3 className="text-white text-2xl font-black uppercase italic leading-none mb-4">{pendingTitle.label}</h3>
                  <p className="text-slate-400 text-sm font-bold mb-8 leading-relaxed">
                    Deseja aplicar este título ao seu perfil de treinador?
                  </p>

                  <div className="flex flex-col w-full gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        console.log("Título selecionado:", pendingTitle.id);
                        onSelectTitle(pendingTitle.id);
                        setPendingTitle(null);
                        setTimeout(() => setShowTitlePicker(false), 200);
                      }}
                      className="w-full h-14 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-900/20"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingTitle(null)}
                      className="w-full h-12 bg-slate-800 text-slate-400 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-700 active:scale-95 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showPsInfo && (
        <div 
          className="fixed inset-0 w-screen h-screen z-[100000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn cursor-default pointer-events-auto" 
          onClick={() => setShowPsInfo(false)}
        >
          <div 
            className="w-full max-w-sm bg-slate-900 rounded-[2.5rem] border-4 border-slate-700 overflow-hidden flex flex-col animate-bounceIn" 
            onClick={(e) => e.stopPropagation()}
          >
             <div className="bg-red-600 p-6 text-center">
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${psRank.item}.png`} className="w-16 h-16 mx-auto mb-2 drop-shadow-lg" alt="" />
                <h3 className="text-white text-2xl font-black uppercase italic leading-none">Poder PS</h3>
                <p className="text-white/70 text-[10px] font-black uppercase mt-1 tracking-widest">{psRank.label} Rank</p>
             </div>
             <div className="p-6 space-y-4">
                <p className="text-white/60 text-xs font-medium leading-relaxed text-center">
                  O Power Score representa sua força total somando Pokémon, Pokédex, Insígnias e feitos heroicos.
                </p>
                <div className="space-y-2">
                  {psRanks.map(rank => (
                    <div key={rank.label} className={`flex items-center justify-between p-3 rounded-xl border ${psRank.label === rank.label ? 'border-amber-400 bg-amber-400/10' : 'border-white/5 bg-white/5'}`}>
                      <div className="flex items-center gap-2">
                         <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${rank.item}.png`} className="w-6 h-6" alt="" />
                         <span className="text-xs font-black text-white uppercase">{rank.label}</span>
                      </div>
                      <span className="text-xs font-black text-slate-400">{rank.min.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowPsInfo(false)} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg">Entendido</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatSmall = ({ label, value }) => (
  <div className="bg-black/20 p-2 rounded-xl border border-white/5 text-center">
    <p className="text-[7px] text-white/30 uppercase font-black">{label}</p>
    <p className="text-white font-black text-xs">{value}</p>
  </div>
);

const BadgeRow = ({ label, ids, earnedList, champion, offset = 0 }) => (
  <div className="flex items-center gap-3">
    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest w-10 shrink-0">{label}</span>
    <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      {ids.map((id, i) => (
        <BadgeSVG key={id} badgeId={id} earned={earnedList.includes(id) || earnedList.includes(i + 1 + offset)} size={16} />
      ))}
    </div>
    {champion && <span className="text-lg">👑</span>}
  </div>
);

export const TrainerCardModal = ({ userData, onClose }) => {
  if (!userData) return null;
  return (
    <div 
      className="fixed inset-0 w-screen h-screen z-[100005] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn cursor-default"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose && onClose(); }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-sm relative animate-bounceIn">
        <button onClick={onClose} className="absolute -top-12 right-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-black border-2 border-red-400 shadow-lg active:scale-95 z-10">X</button>
        <TrainerCard
          trainer={{ name: userData.name, avatarImg: `https://play.pokemonshowdown.com/sprites/trainers/red.png`, titleId: userData.titleId }}
          badges={userData.badgesList || []}
          caughtCount={userData.caughtCount || 0}
          caughtData={userData.caughtData || {}}
          worldFlags={userData.worldFlags || []}
          powerScore={userData.powerScore || 0}
          forgedItems={userData.forgedItemsCount || 0}
          bossDamage={userData.bossTotalDamage || 0}
          shinyCount={userData.shinyCapturedCount || 0}
          trainerBattleWins={userData.trainerBattleWins || 0}
          appearance={userData.appearance || {}}
        />
        <p className="mt-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Perfil Global</p>
      </div>
    </div>
  );
};

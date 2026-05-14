const REGION_DEX_RANGES = {
  kanto: { label: 'Kanto', min: 1, max: 151, color: '#ef4444', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
  johto: { label: 'Johto', min: 152, max: 251, color: '#f59e0b', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png' },
  hoenn: { label: 'Hoenn', min: 252, max: 386, color: '#22c55e', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png' },
  sinnoh: { label: 'Sinnoh', min: 387, max: 493, color: '#38bdf8', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/explorer-kit.png' },
  unova: { label: 'Unova', min: 494, max: 649, color: '#64748b', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/liberty-pass.png' },
  kalos: { label: 'Kalos', min: 650, max: 721, color: '#ec4899', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fairy-gem.png' },
  alola: { label: 'Alola', min: 722, max: 809, color: '#f97316', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/791.png' },
  galar: { label: 'Galar', min: 810, max: 905, color: '#8b5cf6', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dynamax-band.png' },
  paldea: { label: 'Paldea', min: 906, max: 1025, color: '#14b8a6', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/994.png' },
};

const countCaughtInRange = (caughtIds, min, max) =>
  caughtIds.filter(id => id >= min && id <= max).length;

const hasCompleteRegion = (caughtIds, region) => {
  const info = REGION_DEX_RANGES[region];
  if (!info) return false;
  return countCaughtInRange(caughtIds, info.min, info.max) >= (info.max - info.min + 1);
};

const getCaughtIds = (caughtData = {}) =>
  Object.keys(caughtData || {})
    .map(Number)
    .filter(Boolean);

export const TRAINER_TITLES = [
  {
    id: 'rookie_collector',
    label: 'Primeiro Colecionador',
    shortLabel: 'Colecionador',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png',
    color: '#60a5fa',
    bg: 'linear-gradient(135deg, rgba(96,165,250,.18), rgba(15,23,42,.55))',
    description: 'Capture 25 Pokemon.',
    unlocked: ({ caughtCount }) => caughtCount >= 25,
  },
  {
    id: 'hundred_keeper',
    label: 'Guardiao dos 100',
    shortLabel: '100 Capturas',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',
    color: '#2563eb',
    bg: 'linear-gradient(135deg, rgba(37,99,235,.22), rgba(15,23,42,.55))',
    description: 'Capture 100 Pokemon.',
    unlocked: ({ caughtCount }) => caughtCount >= 100,
  },
  {
    id: 'dex_hunter_250',
    label: 'Cacador da Dex',
    shortLabel: 'Dex 250',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
    color: '#facc15',
    bg: 'linear-gradient(135deg, rgba(250,204,21,.22), rgba(15,23,42,.62))',
    description: 'Capture 250 Pokemon.',
    unlocked: ({ caughtCount }) => caughtCount >= 250,
  },
  {
    id: 'national_explorer',
    label: 'Explorador Nacional',
    shortLabel: 'Nacional',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png',
    color: '#22c55e',
    bg: 'linear-gradient(135deg, rgba(34,197,94,.18), rgba(15,23,42,.62))',
    description: 'Capture 500 Pokemon.',
    unlocked: ({ caughtCount }) => caughtCount >= 500,
  },
  {
    id: 'living_dex',
    label: 'Lenda da Pokédex',
    shortLabel: 'Dex 1025',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
    color: '#a855f7',
    bg: 'linear-gradient(135deg, rgba(168,85,247,.25), rgba(236,72,153,.16), rgba(15,23,42,.65))',
    description: 'Capture todos os 1025 Pokemon.',
    unlocked: ({ caughtCount }) => caughtCount >= 1025,
  },
  {
    id: 'first_shiny',
    label: 'Brilho Raro',
    shortLabel: 'Shiny',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/star-piece.png',
    color: '#facc15',
    bg: 'linear-gradient(135deg, rgba(250,204,21,.28), rgba(15,23,42,.64))',
    description: 'Capture seu primeiro Pokemon shiny.',
    unlocked: ({ shinyCount }) => shinyCount >= 1,
  },
  {
    id: 'shiny_tracker',
    label: 'Rastreador Shiny',
    shortLabel: '5 Shinies',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-stone.png',
    color: '#fde047',
    bg: 'linear-gradient(135deg, rgba(253,224,71,.24), rgba(14,165,233,.12), rgba(15,23,42,.64))',
    description: 'Capture 5 Pokemon shiny.',
    unlocked: ({ shinyCount }) => shinyCount >= 5,
  },
  {
    id: 'shiny_collector',
    label: 'Colecionador Shiny',
    shortLabel: '25 Shinies',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/comet-shard.png',
    color: '#38bdf8',
    bg: 'linear-gradient(135deg, rgba(56,189,248,.24), rgba(250,204,21,.16), rgba(15,23,42,.66))',
    description: 'Capture 25 Pokemon shiny.',
    unlocked: ({ shinyCount }) => shinyCount >= 25,
  },
  {
    id: 'shiny_legend',
    label: 'Lenda Brilhante',
    shortLabel: '100 Shinies',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-charm.png',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, rgba(245,158,11,.28), rgba(168,85,247,.18), rgba(15,23,42,.68))',
    description: 'Capture 100 Pokemon shiny.',
    unlocked: ({ shinyCount }) => shinyCount >= 100,
  },
  {
    id: 'trainer_rookie',
    label: 'Desafiante das Rotas',
    shortLabel: '10 Trainers',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png',
    color: '#60a5fa',
    bg: 'linear-gradient(135deg, rgba(96,165,250,.22), rgba(15,23,42,.62))',
    description: 'Venca 10 batalhas contra treinadores.',
    unlocked: ({ trainerBattleWins }) => trainerBattleWins >= 10,
  },
  {
    id: 'trainer_ace',
    label: 'Ace Trainer',
    shortLabel: '50 Trainers',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/battle-recorder.png',
    color: '#22c55e',
    bg: 'linear-gradient(135deg, rgba(34,197,94,.22), rgba(15,23,42,.64))',
    description: 'Venca 50 batalhas contra treinadores.',
    unlocked: ({ trainerBattleWins }) => trainerBattleWins >= 50,
  },
  {
    id: 'trainer_veteran',
    label: 'Veterano de Batalha',
    shortLabel: '100 Trainers',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-sash.png',
    color: '#ef4444',
    bg: 'linear-gradient(135deg, rgba(239,68,68,.24), rgba(15,23,42,.66))',
    description: 'Venca 100 batalhas contra treinadores.',
    unlocked: ({ trainerBattleWins }) => trainerBattleWins >= 100,
  },
  {
    id: 'trainer_master',
    label: 'Mestre do VS',
    shortLabel: '250 Trainers',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ability-capsule.png',
    color: '#a855f7',
    bg: 'linear-gradient(135deg, rgba(168,85,247,.26), rgba(37,99,235,.16), rgba(15,23,42,.68))',
    description: 'Venca 250 batalhas contra treinadores.',
    unlocked: ({ trainerBattleWins }) => trainerBattleWins >= 250,
  },
  {
    id: 'rival_breaker',
    label: 'Superou o Rival',
    shortLabel: 'Rival',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scope-lens.png',
    color: '#2563eb',
    bg: 'linear-gradient(135deg, rgba(37,99,235,.26), rgba(15,23,42,.66))',
    description: 'Venca uma batalha importante contra rival.',
    unlocked: ({ worldFlags }) => (worldFlags || []).some(flag => String(flag).includes('rival') && String(flag).includes('defeated')),
  },
  {
    id: 'villain_stop',
    label: 'Herói de Rota',
    shortLabel: 'Anti-Vila',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/black-glasses.png',
    color: '#475569',
    bg: 'linear-gradient(135deg, rgba(71,85,105,.34), rgba(239,68,68,.14), rgba(15,23,42,.68))',
    description: 'Derrote uma equipe vila em batalha de historia.',
    unlocked: ({ worldFlags }) => (worldFlags || []).some(flag => {
      const value = String(flag);
      return value.includes('rocket') || value.includes('galactic') || value.includes('magma') || value.includes('aqua') || value.includes('villain');
    }),
  },
  ...Object.entries(REGION_DEX_RANGES).map(([region, info]) => ({
    id: `master_${region}`,
    label: `Mestre de ${info.label}`,
    shortLabel: info.label,
    icon: info.icon,
    color: info.color,
    bg: `linear-gradient(135deg, ${info.color}33, rgba(15,23,42,.68))`,
    description: `Capture todos os Pokemon de ${info.label}.`,
    unlocked: ({ caughtIds }) => hasCompleteRegion(caughtIds, region),
  })),
  {
    id: 'league_champion',
    label: 'Campeao da Liga',
    shortLabel: 'Campeao',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-charm.png',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, rgba(245,158,11,.25), rgba(15,23,42,.66))',
    description: 'Vença uma Liga regional.',
    unlocked: ({ worldFlags }) => (worldFlags || []).some(flag => String(flag).includes('champion')),
  },
  {
    id: 'master_smith',
    label: 'Mestre da Forja',
    shortLabel: 'Forja',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png',
    color: '#94a3b8',
    bg: 'linear-gradient(135deg, rgba(148,163,184,.22), rgba(15,23,42,.66))',
    description: 'Forje 25 itens.',
    unlocked: ({ forgedItems }) => forgedItems >= 25,
  },
  {
    id: 'boss_slayer',
    label: 'Quebra Boss',
    shortLabel: 'Boss',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png',
    color: '#ef4444',
    bg: 'linear-gradient(135deg, rgba(239,68,68,.24), rgba(15,23,42,.66))',
    description: 'Cause 100.000 de dano em Boss.',
    unlocked: ({ bossDamage }) => bossDamage >= 100000,
  },
  {
    id: 'shiny_master',
    label: 'Mestre dos Shinies',
    shortLabel: '50 Shinies',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/comet-shard.png',
    color: '#facc15',
    bg: 'linear-gradient(135deg, rgba(250,204,21,.35), rgba(15,23,42,.70))',
    description: 'Capture 50 Pokemon shiny.',
    unlocked: ({ shinyCount }) => shinyCount >= 50,
  },
  {
    id: 'raid_conqueror',
    label: 'Conquistador de Raids',
    shortLabel: 'Raids',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png',
    color: '#ef4444',
    bg: 'linear-gradient(135deg, rgba(239,68,68,.30), rgba(15,23,42,.70))',
    description: 'Venca 25 Raids.',
    unlocked: ({ playerStats }) => (playerStats?.raidsWon || 0) >= 25,
  },
  {
    id: 'battle_expert',
    label: 'Especialista em Batalha',
    shortLabel: '5000 Kills',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-band.png',
    color: '#94a3b8',
    bg: 'linear-gradient(135deg, rgba(148,163,184,.30), rgba(15,23,42,.70))',
    description: 'Derrote 5.000 Pokemon selvagens.',
    unlocked: ({ playerStats }) => (playerStats?.pokemonDefeated || 0) >= 5000,
  },
  {
    id: 'legendary_collector',
    label: 'Colecionador Lendário',
    shortLabel: 'Lendários',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
    color: '#a855f7',
    bg: 'linear-gradient(135deg, rgba(168,85,247,.35), rgba(15,23,42,.75))',
    description: 'Capture 5 Pokemon lendários.',
    unlocked: ({ caughtIds }) => {
      const legends = [144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386];
      return caughtIds.filter(id => legends.includes(id)).length >= 5;
    },
  },
  {
    id: 'badge_collector',
    label: 'Colecionador de Insígnias',
    shortLabel: '40 Badges',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rainbow-badge.png',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, rgba(245,158,11,.35), rgba(15,23,42,.75))',
    description: 'Consiga 40 insignias totais.',
    unlocked: ({ badges }) => (badges || []).length >= 40,
  },
];

import { SHOP_TITLES } from './prestige';

export const getUnlockedTrainerTitles = ({
  caughtData = {},
  caughtCount = 0,
  worldFlags = [],
  forgedItems = 0,
  bossDamage = 0,
  shinyCount = 0,
  trainerBattleWins = 0,
  playerStats = {},
  badges = [],
  purchasedTitles = [],
} = {}) => {
  const caughtIds = getCaughtIds(caughtData);
  const safeCaughtCount = Math.max(caughtCount || 0, caughtIds.length);
  const context = { caughtIds, caughtCount: safeCaughtCount, worldFlags, forgedItems, bossDamage, shinyCount, trainerBattleWins, playerStats, badges };
  
  // Achievement titles
  const unlocked = TRAINER_TITLES.filter(title => title.unlocked(context));
  
  // Merge with purchased titles from Prestige Shop
  const shopTitles = (purchasedTitles || []).map(id => {
    const shopInfo = SHOP_TITLES[id];
    if (!shopInfo) return null;
    return {
      id: shopInfo.id,
      label: shopInfo.label,
      shortLabel: shopInfo.label,
      icon: shopInfo.sprite,
      color: '#3b82f6', // Default color for shop titles
      bg: 'linear-gradient(135deg, rgba(59,130,246,.25), rgba(15,23,42,.65))',
      description: 'Adquirido na Loja de Prestígio.',
      isShopTitle: true
    };
  }).filter(Boolean);

  return [...unlocked, ...shopTitles];
};

export const getPrimaryTrainerTitle = (context = {}) => {
  const unlocked = getUnlockedTrainerTitles(context);
  return unlocked.at(-1) || null;
};

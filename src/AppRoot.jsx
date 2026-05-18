import { useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { useAutoFarm } from './hooks/useAutoFarm';
import { useSound } from './hooks/useSound';
import { ROUTES, getRivalSprite, inferRouteRegion } from './data/routes';
import { INITIAL_POKEMONS } from './data/initialPokemons';
import {
  CRAFTING_RECIPES,
  FORGE_MATERIAL_DROP_GUIDE,
  FORGE_RECIPE_DROP_BY_POKEMON,
  FORGE_RECIPE_DROP_GUIDE,
  RECIPE_GATED_FORGE_IDS,
} from './data/recipes';
import { MOVES } from './data/moves';
import { MOVE_TRANSLATIONS } from './data/translations';
import { POKEDEX } from './data/pokedex';
import { VILLAIN_TEAMS } from './data/villains';
import { WEATHER_TYPE_MULT, WEATHER_PASSIVE_DAMAGE, WEATHER_IMMUNE_TYPES, generateWeatherForRoute, getWeatherFromMove } from './data/weather';
import { getCompatibleMegaStones } from './data/megaEvolutions';
import { assignRandomAbility } from './data/abilities';
import AuthScreen from './components/AuthScreen';
import MenuScreen from './components/MenuScreen';
import TravelScreen from './components/TravelScreen';
import PokemonManagement from './components/PokemonManagement';
import BattleScreen from './components/BattleScreen';
import CityScreen from './components/CityScreen';
import VsScreen from './components/VsScreen';
import RegionBuilderScreen from './components/RegionBuilderScreen';

const POKEAPI_ITEM_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';

// Lazy loaded components for better performance
const CraftingStation = lazy(() => import('./components/CraftingStation'));
const EvolutionScreen = lazy(() => import('./components/EvolutionScreen'));
const SafariZoneScreen = lazy(() => import('./components/SafariZoneScreen'));
const MegaEvolutionScreen = lazy(() => import('./components/MegaEvolutionScreen'));
const PokedexScreen = lazy(() => import('./components/PokedexScreen'));
const TutorialModal = lazy(() => import('./components/TutorialModal'));
const GymScreen = lazy(() => import('./components/GymScreen'));
const ChallengesScreen = lazy(() => import('./components/ChallengesScreen'));
const HouseScreen = lazy(() => import('./components/HouseScreen'));
const ExpeditionsScreen = lazy(() => import('./components/ExpeditionsScreen'));
import { MoveCategoryIcon, StatusBadges, QuickInventory, TrainerCard, BadgeSVG } from './components/CommonUI';
import OfflineProgressModal from './components/OfflineProgressModal';
import { calculateOfflineProgress, applyOfflineProgress } from './utils/offlineProgress';
import { GYMS, ELITE_FOUR } from './data/gyms';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteField, serverTimestamp, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import LZString from 'lz-string';
import { 
  APP_VERSION, APP_VERSION_DATE, DEFAULT_GAME_STATE, GYM_LEVEL_CAPS, 
  NATURE_LIST, NATURES, TYPE_COLORS, trainerAvatars, ITEM_LABELS,
  STAMINA_RESTORE_TABLE, POKE_MART_DRINKS,
  BADGE_IDS, JOHTO_BADGE_IDS, HOENN_BADGE_IDS, SINNOH_BADGE_IDS,
  UNOVA_BADGE_IDS, KALOS_BADGE_IDS, ALOLA_BADGE_IDS, GALAR_BADGE_IDS, PALDEA_BADGE_IDS
} from './data/constants';
import { REGION_ORDER, REGION_CHAMPION_FLAGS, REGION_BADGE_IDS, getPokemonRegion, getUnlockedDexLimit as getRegionalDexLimit, isPokemonAllowedInRegion, isPokemonLegal } from './data/regionStandards';
import { getMasteryPath, getEffectiveStat, getShinyMult } from './utils/gameHelpers';
import { getTrainerCurrencyReward } from './utils/economy';
import { getTypeEffectiveness } from './data/typeChart';
import { POKEMON_TO_CANDY, CANDY_FAMILIES, CANDY_USES } from './data/candies';
import { calcExpeditionDuration, calcExpeditionDrops, calcExpeditionXP, EXPEDITION_BIOMES } from './data/expeditions';
import { calcHarvestDrops, calcGrowthTime, calcCombinedCaretakerBonus, PLANTABLE_ITEMS, HOUSE_PURCHASE_COST } from './data/house';
import { getTimeOfDay, TIME_CONFIG, getTimeAdjustedEnemyPool } from './utils/timeSystem';
import AutoCaptureModal from './components/AutoCaptureModal';
import ConfirmModal from './components/ConfirmModal';
import RankingModal from './components/RankingModal';
import RareDropModal from './components/RareDropModal';

import { QUESTS, updateQuestProgress, getAvailableQuest } from './data/quests';
import NotificationSystem, { notify } from './components/NotificationSystem';
import { getCaptureRate, pickWeightedEncounter } from './utils/pokemonDifficulty';
import { preloadAssets } from './utils/preloader';
import { calculatePowerScore, getBadgeCount } from './utils/progress';
import { migrateGameState } from './utils/saveMigration';
import { ensureRetentionState } from './data/retention';
import { 
  TROPHIES, SHOP_TITLES, POKEDEX_FRAMES, UI_THEMES, 
  ALLIES, MINE_LEVELS, FISHING_RODS, POKECENTER_DONATIONS, GYM_BANNERS 
} from './data/prestige';
import {
  createRaid, RAID_FIGHT_SECONDS, RAID_BATTLE_TRIGGER,
  RAID_SPAWN_INTERVAL_MS, RAID_CATCH_RATE_MULT, EXP_CANDIES,
  RAID_BALANCE_VERSION, calculateRaidMaxHp
} from './data/raids';
import RaidScreen from './components/RaidScreen';
const PrestigeShop       = lazy(() => import('./components/PrestigeShop'));
const FriendsScreen      = lazy(() => import('./components/FriendsScreen'));
const RegionChallengeScreen = lazy(() => import('./components/RegionChallengeScreen'));
import { subscribeToFriendRequests } from './services/friends';

const RAID_SPAWN_STORAGE_KEY = 'pokecraftidle_next_raid_at';
const RAID_STAR_COLOR = { 1: '#94a3b8', 2: '#22c55e', 3: '#3b82f6', 4: '#a855f7', 5: '#f59e0b' };

const bumpPlayerStats = (stats = {}, increments = {}) => {
  const now = Date.now();
  const next = {
    startedAt: stats.startedAt || now,
    playTimeMs: stats.playTimeMs || 0,
    ...stats,
    lastSeenAt: now,
  };
  Object.entries(increments).forEach(([key, value]) => {
    next[key] = (Number(next[key]) || 0) + (Number(value) || 0);
  });
  return next;
};

const monitorAuthState = (callback) => onAuthStateChanged(auth, callback);

const fixPath = (path) => {
  if (typeof path !== 'string') return path;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '') || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

const LAB_BG_URL = fixPath('/bg_lab_1776866008842.webp');

const cleanBattleText = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/\uFFFD/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const MEGA_CAPABLE_SPECIES = [
  3, 6, 9, 15, 18, 65, 80, 94, 115, 127, 130, 142, 150, 181, 208, 212, 214, 229, 248,
  254, 257, 260, 282, 302, 303, 306, 308, 310, 319, 323, 334, 354, 359, 362, 373, 376,
  380, 381, 384, 428, 445, 448, 460, 475, 531, 719,
  26, 149, 154, 157, 160, 389, 392, 395, 497, 500, 503, 652, 655, 658, 724, 727, 730,
  812, 815, 818, 908, 911, 914, 330, 405, 612, 635, 706, 784, 887, 998, 768, 485, 491,
  807, 358, 71, 121, 689, 668, 36, 545, 12, 68
];

const removeUndefinedFields = (value) => {
  if (Array.isArray(value)) {
    return value.map(removeUndefinedFields).filter(item => item !== undefined);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, removeUndefinedFields(entryValue)])
    );
  }
  return value;
};

// Recalcula stats de um pokémon ao receber upgrade shiny (ou ao subir shinyCount)
const applyShinyUpgrade = (pokemon, pokedexData) => {
  const newCount = Math.min((pokemon.shinyCount || 0) + 1, 10);
  const base = pokedexData || {};
  const lv = pokemon.level || 1;
  const sm = 1.2 + Math.max(0, newCount - 1) * 0.05; // mesma fórmula de getShinyMult
  const calcStat = (b) => Math.max(1, Math.ceil(Math.ceil(((2 * b * lv) / 100) + 5) * sm));
  const calcHp   = (b) => Math.max(1, Math.ceil(Math.ceil(((2 * b * lv) / 100) + lv + 10) * sm));
  const newMaxHp = calcHp(base.hp || base.maxHp || 45);
  return {
    ...pokemon,
    isShiny: true,
    shinyCount: newCount,
    maxHp:   newMaxHp,
    hp:      newMaxHp,
    attack:  calcStat(base.attack  || 45),
    defense: calcStat(base.defense || 45),
    spAtk:   calcStat(base.spAtk   || 45),
    spDef:   calcStat(base.spDef   || 45),
    speed:   calcStat(base.speed   || 45),
  };
};

// Aplica bônus de status para Pokémon Alfa (multiplicador ×1.3, ou ×1.5 se também for shiny)
const applyAlphaUpgrade = (pokemon, pokedexData, isAlsoShiny = false) => {
  const base = pokedexData || {};
  const lv = pokemon.level || 1;
  const mult = isAlsoShiny ? 1.5 : 1.3;
  const calcStat = (b) => Math.max(1, Math.ceil(Math.ceil(((2 * b * lv) / 100) + 5) * mult));
  const calcHp   = (b) => Math.max(1, Math.ceil(Math.ceil(((2 * b * lv) / 100) + lv + 10) * mult));
  const newMaxHp = calcHp(base.hp || base.maxHp || 45);
  return {
    ...pokemon,
    isAlpha: true,
    maxHp:   newMaxHp,
    hp:      newMaxHp,
    attack:  calcStat(base.attack  || 45),
    defense: calcStat(base.defense || 45),
    spAtk:   calcStat(base.spAtk   || 45),
    spDef:   calcStat(base.spDef   || 45),
    speed:   calcStat(base.speed   || 45),
  };
};

const EVOLUTION_FRAGMENT_DROPS = {
  4: 'fire_stone_shard', 5: 'fire_stone_shard', 6: 'fire_stone_shard',
  37: 'fire_stone_shard', 58: 'fire_stone_shard', 77: 'fire_stone_shard', 126: 'fire_stone_shard',
  7: 'water_stone_shard', 8: 'water_stone_shard', 9: 'water_stone_shard',
  60: 'water_stone_shard', 61: 'water_stone_shard', 90: 'water_stone_shard', 120: 'water_stone_shard',
  1: 'leaf_stone_shard', 2: 'leaf_stone_shard', 3: 'leaf_stone_shard',
  43: 'leaf_stone_shard', 44: 'leaf_stone_shard', 69: 'leaf_stone_shard', 70: 'leaf_stone_shard', 102: 'leaf_stone_shard',
  25: 'thunder_stone_shard', 26: 'thunder_stone_shard', 81: 'thunder_stone_shard', 82: 'thunder_stone_shard',
  100: 'thunder_stone_shard', 101: 'thunder_stone_shard', 125: 'thunder_stone_shard',
  29: 'moon_stone_shard', 30: 'moon_stone_shard', 32: 'moon_stone_shard', 33: 'moon_stone_shard',
  35: 'moon_stone_shard', 36: 'moon_stone_shard', 39: 'moon_stone_shard', 40: 'moon_stone_shard',
  63: 'link_cable_part', 64: 'link_cable_part', 66: 'link_cable_part', 67: 'link_cable_part',
  74: 'link_cable_part', 75: 'link_cable_part', 92: 'link_cable_part', 93: 'link_cable_part',
};

const ownsSpecies = (gameState = {}, pokemonId) => {
  const id = Number(pokemonId);
  return (gameState.team || []).some(p => Number(p.id) === id)
    || (gameState.pc || []).some(p => Number(p.id) === id)
    || (gameState.house?.caretakers || []).some(p => Number(p.id) === id);
};

const canCaptureGhostPokemon = (gameState = {}) => {
  const flags = gameState.worldFlags || [];
  return flags.includes('rock_tunnel_cleared')
    || flags.includes('rival_pokemon_tower_defeated')
    || flags.includes('pokemon_tower_cleared');
};

const hasForgeRecipe = (gameState = {}, recipeId) => {
  if (!RECIPE_GATED_FORGE_IDS.has(recipeId)) return true;
  return !!gameState.inventory?.materials?.[`recipe_${recipeId}`];
};



const getJohtoBadgeCount = (gameState = {}) => {
  const badges = new Set(gameState.badges || []);
  return JOHTO_BADGE_IDS.filter(id => badges.has(id)).length;
};

const APP_REGION_BADGE_IDS = {
  kanto: BADGE_IDS,
  johto: JOHTO_BADGE_IDS,
  hoenn: HOENN_BADGE_IDS,
  sinnoh: SINNOH_BADGE_IDS,
  unova: UNOVA_BADGE_IDS,
  kalos: KALOS_BADGE_IDS,
  alola: ALOLA_BADGE_IDS,
  galar: GALAR_BADGE_IDS,
  paldea: PALDEA_BADGE_IDS,
  ...REGION_BADGE_IDS,
};

const getRegionBadgeIds = (region = 'kanto') => APP_REGION_BADGE_IDS[region] || BADGE_IDS;

const getRegionBadgeCount = (badges = [], region = 'kanto') => {
  const badgeSet = new Set(badges || []);
  return getRegionBadgeIds(region).filter(id => badgeSet.has(id)).length;
};

const getRegionExpShareRate = (badges = [], region = 'kanto') => getRegionBadgeCount(badges, region) * 0.10;

const getRegionLevelCap = (badges = [], region = 'kanto') => {
  const caps = GYM_LEVEL_CAPS[region] || {};
  return Object.values(caps)[getRegionBadgeCount(badges, region)] || 100;
};

const getLevelGapXpMultiplier = (pokemonLevel = 1, enemyLevel = 1) => {
  const levelGap = Math.max(0, (pokemonLevel || 1) - (enemyLevel || 1));
  const penaltySteps = Math.floor(levelGap / 5);
  return Math.pow(0.5, penaltySteps);
};

const getUnlockedDexLimit = (gameState = {}) => {
  return getRegionalDexLimit(gameState);
};

const isEvolutionAllowedForRegion = (pokemon, evolutionId, activeRegion = 'kanto') => {
  return isPokemonAllowedInRegion(evolutionId, activeRegion);
};

const getEvolutionRegionLockMessage = (pokemonName, evolutionName, activeRegion = 'kanto') => {
  const regionName = String(activeRegion || 'kanto').toUpperCase();
  return `${pokemonName || 'Este Pokemon'} nao pode evoluir para ${evolutionName || 'esta forma'} na regiao de ${regionName}.`;
};

const WORLD_BOSS_FIGHT_SECONDS = 120;

const isProgressUnlocked = (gameState = {}, requirement = {}) => {
  if (!requirement) return true;
  const worldFlags = gameState.worldFlags || [];
  if (requirement.flag && !worldFlags.includes(requirement.flag)) return false;
  if (requirement.kantoChampion && !worldFlags.includes('champion')) return false;
  if (requirement.johtoStarted && !worldFlags.includes('johto_started')) return false;
  if (requirement.minBadges && getBadgeCount(gameState) < requirement.minBadges) return false;
  if (requirement.minJohtoBadges && getJohtoBadgeCount(gameState) < requirement.minJohtoBadges) return false;
  return true;
};

const MART_UNLOCKS = {
  pokeballs: null,
  potions: null,
  fresh_water: null,
  berry_juice: { minBadges: 1 },
  great_ball: { minBadges: 2 },
  soda_pop: { minBadges: 2 },
  revive: { minBadges: 3 },
  lemonade: { minBadges: 3 },
  moomoo_milk: { minBadges: 4 },
  ultra_ball: { minBadges: 5 },
  link_cable: { minBadges: 6 },
};

const FORGE_UNLOCKS = {
  pokeballs: null,
  poke_food: null,
  repel: { minBadges: 1 },
  lure: { minBadges: 1 },
  old_rod: { minBadges: 2 },
  friend_ball: { minBadges: 2 },
  great_ball: { minBadges: 2 },
  poke_food_premium: { minBadges: 3 },
  super_repel: { minBadges: 3 },
  super_lure: { minBadges: 3 },
  moon_ball: { minBadges: 3 },
  heavy_ball: { minBadges: 4 },
  fast_ball: { minBadges: 4 },
  good_rod: { minBadges: 4 },
  revive: { minBadges: 4 },
  charcoal: { minBadges: 4 },
  mystic_water: { minBadges: 4 },
  magnet: { minBadges: 4 },
  fire_stone: { minBadges: 5 },
  water_stone: { minBadges: 5 },
  leaf_stone: { minBadges: 5 },
  thunder_stone: { minBadges: 5 },
  black_belt: { minBadges: 5 },
  max_repel: { minBadges: 5 },
  max_lure: { minBadges: 6 },
  quick_claw: { minBadges: 6 },
  level_ball: { minBadges: 6 },
  moon_stone: { minBadges: 6 },
  link_cable: { minBadges: 8 },
  tm_flamethrower: { minBadges: 7 },
  tm_thunderbolt: { minBadges: 7 },
  tm_ice_beam: { minBadges: 7 },
  ultra_ball: { minBadges: 8 },
  amulet_coin: { kantoChampion: true },
  cleanse_tag: { kantoChampion: true },
  soothing_bell: { kantoChampion: true },
  soothe_bell: { kantoChampion: true },
  scope_lens: { kantoChampion: true },
  incense_luck: { kantoChampion: true },
  lucky_egg: { johtoStarted: true },
  exp_share: { johtoStarted: true },
  super_rod: { johtoStarted: true, minJohtoBadges: 2 },
};

const isMartItemUnlocked = (gameState, itemId) => isProgressUnlocked(gameState, MART_UNLOCKS[itemId]);

const isForgeItemUnlocked = (gameState, itemId, powerScore = 0) => {
  const allRecipes = Object.values(CRAFTING_RECIPES).flat();
  const recipe = allRecipes.find(r => r.id === itemId);
  
  const MATERIAL_RANK_PS = {
    'Rank I': 0, 'Rank II': 50000, 'Rank III': 150000, 'Rank IV': 300000,
    'Rank V': 500000, 'Rank VI': 800000, 'Rank VII': 1200000, 'Rank VIII': 1700000, 'Rank IX': 2500000,
  };
  
  const requiredPS = MATERIAL_RANK_PS[recipe?.rank] || 0;
  return powerScore >= requiredPS && hasForgeRecipe(gameState, itemId) && isProgressUnlocked(gameState, FORGE_UNLOCKS[itemId]);
};

const FORGE_CATEGORY_LABELS = {
  consumables: 'Itens',
  hold_items: 'Hold',
  tms: 'TMs',
  fishing_rods: 'Varas',
  repels: 'Repel',
  incenses: 'Incenso',
  badges_items: 'Insignias',
  apricorn_balls: 'Balls',
  food: 'Racao',
  elite_relics: 'Reliquias de Elite',
  trainer_card: 'Card',
};

const getForgeCategoryLabel = (category) => FORGE_CATEGORY_LABELS[category] || category.replace(/_/g, ' ');

const MUSIC_LIST = [
  { id: 'all', name: 'Tocar Todas (Shuffle)' },
  { id: 'league_night', name: 'League Night', url: fixPath('/sounds/51383504-feora-lucas-cooper-pokemon-league-night-pokemon-diamond-410587.mp3') },
  { id: 'littleroot', name: 'Littleroot Town', url: fixPath('/sounds/51383504-feora-vgm-yume-littleroot-town-pokemon-ruby-amp-sapphire-lofi-410588.mp3') },
  { id: 'new_bark', name: 'New Bark Town', url: fixPath('/sounds/51383504-feora-vgm-yume-new-bark-town-pokemon-gold-amp-silver-lofi-410593.mp3') },
  { id: 'route_101', name: 'Route 101', url: fixPath('/sounds/51383504-feora-vgm-yume-route-101-pokeon-ruby-amp-sapphire-lofi-410589.mp3') },
  { id: 'surf', name: 'Surf Theme', url: fixPath('/sounds/51383504-feora-vgm-yume-surf-theme-pokemon-ruby-amp-sapphire-lofi-410586.mp3') },
  { id: 'pallet', name: 'Pallet Town', url: fixPath('/sounds/51383504-pallet-town-pokemon-red-amp-blue-lofi-410591.mp3') }
];

const GearIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" aria-hidden="true">
    <path d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z" stroke="currentColor" strokeWidth="2" />
    <path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l2-1.35-2-3.46-2.36.98a8.04 8.04 0 0 0-2.6-1.5L14.1 2.6h-4l-.35 2.57a8.04 8.04 0 0 0-2.6 1.5l-2.36-.98-2 3.46 2 1.35a7.8 7.8 0 0 0 0 3l-2 1.35 2 3.46 2.36-.98a8.04 8.04 0 0 0 2.6 1.5l.35 2.57h4l.35-2.57a8.04 8.04 0 0 0 2.6-1.5l2.36.98 2-3.46-2-1.35Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const processExpeditionPokemon = (pokemon, xpGained) => {
  const initialLevel = pokemon.level || 1;
  let p = { ...pokemon, xp: (pokemon.xp || 0) + xpGained };
  const moveEvents = [];
  let guard = 40; // máximo de 40 níveis por expedição

  while (guard-- > 0) {
    const n = p.level || 1;
    if (n >= 100) { p = { ...p, xp: 0 }; break; }
    const xpNeeded = Math.pow(n + 1, 3) - Math.pow(n, 3);
    if (p.xp < xpNeeded) break;

    const newLevel = n + 1;
    const pokeData = POKEDEX[Number(p.id)];
    const shinyMult = p.isShiny ? 1.2 : 1.0;
    const calcStat = (b, lv) => Math.max(1, Math.ceil(((2 * b * lv) / 100 + 5) * shinyMult));
    const calcHp   = (b, lv) => Math.max(1, Math.ceil(((2 * b * lv) / 100 + lv + 10) * shinyMult));
    const base = pokeData || {};

    let newMoves = [...(p.moves || [])];
    let newLearned = p.learnedMoves ? [...p.learnedMoves] : [...newMoves];
    const learnedNow = [];

    if (pokeData?.learnset) {
      pokeData.learnset.filter(l => l.level === newLevel).forEach(learn => {
        const key = (learn.move || '').toLowerCase();
        const mData = MOVES[key];
        if (!mData) return;
        const mName = MOVE_TRANSLATIONS[key] || mData.name || learn.move;
        if (newLearned.some(m => m.name === mName)) return;
        const mObj = { ...mData, name: mName };
        newLearned.push(mObj);
        learnedNow.push(mName);
        if (newMoves.length < 4) newMoves.push(mObj);
      });
    }

    if (learnedNow.length) moveEvents.push({ level: newLevel, moves: learnedNow });

    p = {
      ...p,
      level: newLevel,
      xp: p.xp - xpNeeded,
      moves: newMoves,
      learnedMoves: newLearned,
      maxHp: calcHp(base.hp || 45, newLevel),
      hp:    calcHp(base.hp || 45, newLevel),
      attack:  calcStat(base.attack  || 45, newLevel),
      defense: calcStat(base.defense || 45, newLevel),
      spAtk:   calcStat(base.spAtk   || 45, newLevel),
      spDef:   calcStat(base.spDef   || 45, newLevel),
      speed:   calcStat(base.speed   || 45, newLevel),
      stages: { attack:0, defense:0, spAtk:0, spDef:0, speed:0, accuracy:0, evasion:0 },
    };
  }

  return { pokemon: p, initialLevel, finalLevel: p.level || 1,
    levelsGained: (p.level || 1) - initialLevel, xpGained, moveEvents };
};
const TYPE_HEX = {
  Normal:'#9ea3b0', Fire:'#f97316', Water:'#3b82f6', Electric:'#eab308',
  Grass:'#22c55e', Poison:'#a855f7', Bug:'#84cc16', Flying:'#38bdf8',
  Rock:'#d97706', Ground:'#ca8a04', Fighting:'#dc2626', Psychic:'#ec4899',
  Dark:'#334155', Steel:'#64748b', Ghost:'#4f46e5', Dragon:'#6366f1',
  Fairy:'#f472b6', Ice:'#22d3ee',
};
const STAT_LABELS = { hp:'HP', attack:'ATK', defense:'DEF', spAtk:'SpA', spDef:'SpD', speed:'VEL' };

const StarterPreviewModal = ({ pokemon, accentColor, onConfirm, onCancel }) => {
  if (!pokemon) return null;
  const types = pokemon.types || [pokemon.type];
  const primaryColor = TYPE_HEX[types[0]] || accentColor;
  const stats = [
    { key:'hp',      val: pokemon.hp      || 45 },
    { key:'attack',  val: pokemon.attack   || 45 },
    { key:'defense', val: pokemon.defense  || 45 },
    { key:'spAtk',   val: pokemon.spAtk    || 45 },
    { key:'spDef',   val: pokemon.spDef    || 45 },
    { key:'speed',   val: pokemon.speed    || 45 },
  ];
  const initMoves = (pokemon.learnset || []).slice(0, 4).map(l => MOVES[l.move]).filter(Boolean);
  return (
    <div onClick={onCancel} style={{ position:'absolute', inset:0, zIndex:9999, background:'rgba(0,0,0,0.78)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:28, overflow:'hidden', width:'100%', maxWidth:380, boxShadow:'0 32px 64px rgba(0,0,0,0.5)', borderBottom:`8px solid ${primaryColor}` }}>
        {/* Header */}
        <div style={{ background:`linear-gradient(160deg, ${primaryColor}30, ${primaryColor}12)`, padding:'20px 20px 4px', textAlign:'center' }}>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            onError={e => { e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`; }}
            style={{ width:120, height:120, objectFit:'contain', filter:`drop-shadow(0 4px 12px ${primaryColor}55)` }} alt={pokemon.name} />
          <h3 style={{ fontSize:22, fontWeight:900, textTransform:'uppercase', color:'#1e293b', margin:'8px 0 6px', letterSpacing:'-0.02em' }}>{pokemon.name}</h3>
          <div style={{ display:'flex', gap:6, justifyContent:'center', paddingBottom:16 }}>
            {types.map(t => (
              <span key={t} style={{ background: TYPE_HEX[t]||'#9ea3b0', color:'#fff', fontSize:10, fontWeight:900, padding:'3px 12px', borderRadius:99, textTransform:'uppercase', letterSpacing:'0.08em' }}>{t}</span>
            ))}
          </div>
        </div>
        {/* Stats */}
        <div style={{ padding:'12px 20px 8px' }}>
          <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#94a3b8', marginBottom:8 }}>Stats Base</p>
          {stats.map(({ key, val }) => (
            <div key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
              <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', color:'#94a3b8', width:28 }}>{STAT_LABELS[key]}</span>
              <span style={{ fontSize:11, fontWeight:900, color:'#1e293b', width:26, textAlign:'right' }}>{val}</span>
              <div style={{ flex:1, height:6, background:'#e2e8f0', borderRadius:3, overflow:'hidden' }}>
                <div style={{ width:`${Math.min(100,(val/180)*100)}%`, height:'100%', background:primaryColor, borderRadius:3 }} />
              </div>
            </div>
          ))}
        </div>
        {/* Moves */}
        {initMoves.length > 0 && (
          <div style={{ padding:'4px 20px 12px' }}>
            <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#94a3b8', marginBottom:8 }}>Golpes Iniciais</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              {initMoves.map(m => (
                <div key={m.id} style={{ background:`${TYPE_HEX[m.type]||'#94a3b8'}18`, borderRadius:12, padding:'6px 10px', border:`1px solid ${TYPE_HEX[m.type]||'#94a3b8'}35` }}>
                  <span style={{ fontSize:8, fontWeight:900, textTransform:'uppercase', color: TYPE_HEX[m.type]||'#94a3b8', display:'block', marginBottom:1 }}>{m.type} · {m.category}</span>
                  <span style={{ fontSize:11, fontWeight:900, color:'#1e293b' }}>{m.name}</span>
                  {m.power ? <span style={{ fontSize:9, color:'#94a3b8', marginLeft:4 }}>· {m.power} POD</span> : <span style={{ fontSize:9, color:'#94a3b8', marginLeft:4 }}>· Status</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Buttons */}
        <div style={{ padding:'4px 20px 20px', display:'grid', gap:10 }}>
          <button onClick={onConfirm} style={{ background:primaryColor, color:'#fff', border:'none', borderRadius:16, padding:'16px 20px', fontWeight:900, fontSize:12, textTransform:'uppercase', letterSpacing:'0.1em', cursor:'pointer', boxShadow:`0 4px 16px ${primaryColor}55` }}>
            Escolher {pokemon.name}!
          </button>
          <button onClick={onCancel} style={{ background:'#f1f5f9', color:'#64748b', border:'none', borderRadius:16, padding:'14px 20px', fontWeight:900, fontSize:12, textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer' }}>
            Escolher outro
          </button>
        </div>
      </div>
    </div>
  );
};

const RegionIntroScreen = ({
  professorSprite, professorName, regionName, accentColor, bgColor,
  starters, onSelectStarter, onBack, ruleText, inviteText
}) => {
  const [preview, setPreview] = useState(null);
  return (
  <div className="h-full flex flex-col items-center animate-fadeIn relative overflow-hidden"
    style={{ backgroundImage: `url('${LAB_BG_URL}')`, backgroundSize: 'cover', backgroundPosition: 'center top' }}>
    <div className="absolute inset-0" style={{
      background: `linear-gradient(to bottom, ${accentColor}bb 0%, ${accentColor}66 35%, rgba(2,6,23,0.80) 70%, rgba(2,6,23,0.97) 100%)`
    }} />
    <div className="flex-1 flex items-center justify-center relative z-10 px-6 pt-8">
      <img src={professorSprite}
        onError={e => {
          const base = 'https://play.pokemonshowdown.com/sprites/trainers/';
          const oak = base + 'oak.png';
          if (e.currentTarget.src === oak) return;
          const filename = e.currentTarget.src.split('/').pop();
          e.currentTarget.src = filename.startsWith('professor') ? oak : base + 'professor' + filename;
        }}
        className="h-64 object-contain drop-shadow-2xl animate-float" alt={professorName} />
    </div>
    <div className="relative z-10 w-full p-4 pb-6">
      <div className="bg-white rounded-[2rem] shadow-2xl p-5 max-w-2xl mx-auto" style={{ borderBottom: `10px solid ${accentColor}` }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden border-2"
            style={{ backgroundColor: accentColor + '22', borderColor: accentColor + '55' }}>
            <img src={professorSprite}
              onError={e => {
                const base = 'https://play.pokemonshowdown.com/sprites/trainers/';
                const oak = base + 'oak.png';
                if (e.currentTarget.src === oak) return;
                const filename = e.currentTarget.src.split('/').pop();
                e.currentTarget.src = filename.startsWith('professor') ? oak : base + 'professor' + filename;
              }}
              className="w-9 h-9 object-contain" alt="" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: accentColor }}>{professorName}</p>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-800 leading-none">
              Bem-vindo a {regionName}
            </h2>
          </div>
        </div>
        <p className="text-sm font-bold text-slate-600 leading-relaxed mb-3 italic">"{inviteText}"</p>
        <div className="rounded-2xl p-3 mb-4 border-2" style={{ backgroundColor: accentColor + '11', borderColor: accentColor + '33' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: accentColor }}>Regra Regional</p>
          <p className="text-xs font-bold text-slate-800">{ruleText}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {starters.map(s => (
            <button key={s.id} onClick={() => setPreview(s)}
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-all"
              onMouseEnter={e => e.currentTarget.style.borderColor = accentColor}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#f1f5f9'}>
              <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${s.id}.png`}
                className="w-16 h-16 object-contain" alt={s.name} />
              <span className="text-[10px] font-black uppercase text-slate-800">{s.name}</span>
              <span className="text-[8px] font-black uppercase text-slate-400">{s.type}</span>
            </button>
          ))}
        </div>
        <button onClick={onBack}
          className="w-full min-h-[48px] rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">
          Continuar na região atual
        </button>
      </div>
    </div>
    {preview && (
      <StarterPreviewModal
        pokemon={preview}
        accentColor={accentColor}
        onConfirm={() => { onSelectStarter(preview.id); setPreview(null); }}
        onCancel={() => setPreview(null)}
      />
    )}
  </div>
  );
};

const handleSelectTitleInApp = (newTitleId, setGameState) => {
  setGameState(prev => {
    return {
      ...prev, 
      selectedTitle: newTitleId,
      trainer: {
        ...(prev.trainer || {}),
        titleId: newTitleId
      },
      prestige: {
        ...(prev.prestige || {}),
        activeTitle: newTitleId
      }
    };
  });
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarTab, setAvatarTab] = useState('male');
  const { 
    playBGM, stopBGM, sfxVictory, sfxDefeat, sfxLevelUp, sfxCapture, sfxHeal, sfxGym, stopSFX,
    toggleMute, isMuted, muted 
  } = useSound();
  
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isForgeConfirmOpen, setIsForgeConfirmOpen] = useState(false);
  const [isPowerRankModalOpen, setIsPowerRankModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [showRanking, setShowRanking] = useState(false);
  const showConfirm = (config) => setConfirmModal(config);
  const closeConfirm = () => setConfirmModal(null);

  // Sync isAnyModalOpen with individual states
  useEffect(() => {
    setIsAnyModalOpen(isTitleModalOpen || isForgeConfirmOpen || isPowerRankModalOpen || !!confirmModal);
  }, [isTitleModalOpen, isForgeConfirmOpen, isPowerRankModalOpen, confirmModal]);

  useEffect(() => {
    setIsPowerRankModalOpen(showRanking);
  }, [showRanking]);

  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem('poke_idle_save');
      if (saved) {
        // Tenta descomprimir (novo formato); cai no JSON.parse direto para saves antigos
        let parsed;
        try {
          const decompressed = LZString.decompress(saved);
          parsed = decompressed ? JSON.parse(decompressed) : JSON.parse(saved);
        } catch {
          parsed = JSON.parse(saved);
        }
        if (parsed && parsed.gameState) {
          const loaded = parsed.gameState;
          const merged = migrateGameState(loaded, { version: APP_VERSION });
          if (!merged.migrationAudit?.ok) {
            console.info('Local save migration audit:', merged.migrationAudit);
          }
          return merged;
        }
      }
    } catch (e) {
      console.error('Error parsing save', e);
    }
    return DEFAULT_GAME_STATE;
  });

  useEffect(() => {
    setGameState(prev => {
      const retention = ensureRetentionState(prev);
      if (JSON.stringify(prev.retention || {}) === JSON.stringify(retention)) return prev;
      return { ...prev, retention };
    });
  }, []);

  const loadGameState = async (uid) => {
    try {
      const docRef = doc(db, "saves", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // New compressed format
        if (data.compressedState) {
          const decompressed = LZString.decompress(data.compressedState);
          if (decompressed) return JSON.parse(decompressed);
        }
        // Legacy uncompressed format
        if (data.gameState) return data.gameState;
      }
    } catch (e) {
      console.error("Error loading cloud save:", e);
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = monitorAuthState(async (u) => {
      if (u) {
        setUser(u);
        setLoading(true);

        try {
          const savedData = await loadGameState(u.uid);

          if (savedData) {
            const migratedData = migrateGameState(savedData, { version: APP_VERSION });

            // Calcula progresso offline desde o último acesso.
            // Verifica também o localStorage, que pode ter um lastSeenAt mais recente
            // (salvo pelo handler beforeunload/visibilitychange).
            let lastActiveAt = migratedData.playerStats?.lastSeenAt || null;
            try {
              const localRaw = localStorage.getItem('poke_idle_save');
              if (localRaw) {
                const dec = LZString.decompress(localRaw);
                const localParsed = dec ? JSON.parse(dec) : JSON.parse(localRaw);
                const localTs = localParsed?.gameState?.playerStats?.lastSeenAt;
                if (localTs && (!lastActiveAt || localTs > lastActiveAt)) {
                  lastActiveAt = localTs; // localStorage tem timestamp mais recente
                }
              }
            } catch { /* ignora erros de leitura local */ }

            if (lastActiveAt) {
              const elapsedMs = Date.now() - lastActiveAt;
              const progress = calculateOfflineProgress(migratedData, ROUTES, elapsedMs);
              if (progress) {
                const stateWithProgress = applyOfflineProgress(migratedData, progress);
                setGameState(stateWithProgress);
                setOfflineProgress(progress);
              } else {
                setGameState(migratedData);
              }
            } else {
              setGameState(migratedData);
            }

            isFullyLoadedRef.current = true;

            const hasRealProgress = (migratedData.worldFlags || []).length > 0 || (migratedData.badges || []).length > 0;
            if (hasRealProgress) {
              setCurrentView('city');
            }
          } else {
            // Não encontrou save na nuvem — tenta recuperar do localStorage
            const localSaved = localStorage.getItem('poke_idle_save');
            let localData = null;
            if (localSaved) {
              try {
                const decompressed = LZString.decompress(localSaved);
                const parsed = decompressed ? JSON.parse(decompressed) : JSON.parse(localSaved);
                localData = parsed?.gameState || null;
              } catch { localData = null; }
            }
            if (localData) {
              const migratedLocal = migrateGameState(localData, { version: APP_VERSION });
              setGameState(migratedLocal);
              notify('Save local restaurado (não havia save na nuvem).', 'info');
            } else {
              setGameState(DEFAULT_GAME_STATE);
            }
            isFullyLoadedRef.current = true;
          }
        } catch (err) {
          console.error("❌ [Cloud] Error loading save:", err);
          // Em caso de erro de rede, tenta o localStorage antes de desistir
          const localSaved = localStorage.getItem('poke_idle_save');
          if (localSaved) {
            try {
              const decompressed = LZString.decompress(localSaved);
              const parsed = decompressed ? JSON.parse(decompressed) : JSON.parse(localSaved);
              const localData = parsed?.gameState || null;
              if (localData) {
                const migratedLocal = migrateGameState(localData, { version: APP_VERSION });
                setGameState(migratedLocal);
                isFullyLoadedRef.current = true;
                notify('Carregado do save local (erro na nuvem). Progresso preservado.', 'error');
                return;
              }
            } catch { /* ignora */ }
          }
          // Não marca isFullyLoaded para evitar sobrescrever save real com estado vazio
          notify("Erro ao carregar save. Reconectando...", "error");
        }
      } else {
        setUser(null);
        // Ao deslogar, voltamos para o save local (se existir) ou padrão
        const localSaved = localStorage.getItem('poke_idle_save');
        if (localSaved) {
           try {
             let parsed;
             try {
               const decompressed = LZString.decompress(localSaved);
               parsed = decompressed ? JSON.parse(decompressed) : JSON.parse(localSaved);
             } catch { parsed = JSON.parse(localSaved); }
             if (parsed?.gameState) {
               setGameState(migrateGameState(parsed.gameState, { version: APP_VERSION }));
             }
           } catch(e) { setGameState(DEFAULT_GAME_STATE); }
        } else {
           setGameState(DEFAULT_GAME_STATE);
        }
        setCurrentView('landing');
      }
      setLoading(false);
    });

    // Fallback de segurança: Se carregar demorar mais de 8s, libera a tela
    const loadTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    return () => {
      unsubscribe();
      clearTimeout(loadTimeout);
    };
  }, []);

  // Preloader Effect
  useEffect(() => {
    const assets = {
      images: [
        fixPath('/bg_grass_1776863779024.webp'),
        fixPath('/bg_forest_1776863795763.webp'),
        fixPath('/bg_cave_1776863810604.webp'),
        'https://play.pokemonshowdown.com/sprites/trainers/red.png',
        'https://play.pokemonshowdown.com/sprites/trainers/leaf-gen3.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png'
      ],
      sounds: [
        fixPath('/sounds/derrota.mp3'),
        fixPath('/sounds/nivel.mp3'),
        fixPath('/sounds/POKE CENTER.mp3'),
        fixPath('/sounds/gym.mp3')
      ]
    };

    const initPreload = async () => {
      try {
        await preloadAssets(assets.images, assets.sounds, (p) => setPreloadProgress(p));
        // Pequeno delay para o user ver o 100%
        setTimeout(() => setIsPreloaded(true), 500);
      } catch (err) {
        console.error("Preload error:", err);
        setIsPreloaded(true);
      }
    };

    initPreload();
  }, []);

  // ===== LISTENER DE FORCE-UPDATE (Firestore config/app) =====
  // Todos os dispositivos logados serão recarregados quando forceReloadAt mudar
  useEffect(() => {
    const configRef = doc(db, 'config', 'app');
    const unsub = onSnapshot(configRef, (snap) => {
      if (!snap.exists()) return;
      const { forceReloadAt } = snap.data();
      if (!forceReloadAt) return;
      const serverTs = forceReloadAt?.toMillis ? forceReloadAt.toMillis() : forceReloadAt;
      const localTs = parseInt(localStorage.getItem('pokecraft_last_reload') || '0', 10);
      if (serverTs > localTs) {
        localStorage.setItem('pokecraft_last_reload', String(serverTs));
        // Pequeno delay para garantir que o Firestore persiste antes de recarregar
        setTimeout(() => window.location.reload(true), 800);
      }
    }, (err) => console.warn('Config listener error:', err));
    return () => unsub();
  }, []);

  const [activeBuildingModal, setActiveBuildingModal] = useState(null);
  const [forgeCategory, setForgeCategory] = useState('food');
  const [pendingFriendRequests, setPendingFriendRequests] = useState([]);

  const [activeMaterialModal, setActiveMaterialModal] = useState(null);
  const [evolutionPending, setEvolutionPending] = useState(null);
  const [megaEvolutionPending, setMegaEvolutionPending] = useState(false); // abre tela de Mega Evolução
  const [safariSession, setSafariSession] = useState(null); // { ballsLeft } quando dentro da Safari Zone
  const [showTutorial, setShowTutorial] = useState(false); // tutorial de boas-vindas
  const [offlineProgress, setOfflineProgress] = useState(null); // progresso acumulado offline
  const [masteryNotification, setMasteryNotification] = useState(null);
  const [activePokemonDetails, setActivePokemonDetails] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [forgeTargetItem, setForgeTargetItem] = useState(null);
  const [travelTab, setTravelTab] = useState('routes');
  const [showAutoCaptureModal, setShowAutoCaptureModal] = useState(false);
  const [showBattleAutoPanel, setShowBattleAutoPanel] = useState(false);



  const [introStep, setIntroStep] = useState(0);
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);
  const [moveIndex, setMoveIndex] = useState(0);
  const [battleLog, setBattleLog] = useState([]);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [weather, setWeather] = useState('none');
  const [weatherTurns, setWeatherTurns] = useState(0);
  const [isHealing, setIsHealing] = useState(false);
  const [activeTab, setActiveTab] = useState('team');
  const [showExpeditions, setShowExpeditions] = useState(false);
  const [expeditionReport, setExpeditionReport] = useState(null);
  const expeditionReportRef = useRef(null);
  const [showHouse, setShowHouse] = useState(false);
  const [showOakHouseModal, setShowOakHouseModal] = useState(false);
  const [showOakStaminaModal, setShowOakStaminaModal] = useState(false);
  const [starterPreview, setStarterPreview] = useState(null); // { pokemon, accentColor, onConfirm }
  const [showKantoChampionModal,  setShowKantoChampionModal]  = useState(false);
  const [showSinnohIntroModal,    setShowSinnohIntroModal]    = useState(false); // Hoenn → Sinnoh (já existe)
  const [showJohtoChampionModal,  setShowJohtoChampionModal]  = useState(false); // Johto → Hoenn
  const [showSinnohChampionModal, setShowSinnohChampionModal] = useState(false); // Sinnoh → Unova
  const [showUnovaChampionModal,  setShowUnovaChampionModal]  = useState(false); // Unova → Kalos
  const [showKalosChampionModal,  setShowKalosChampionModal]  = useState(false); // Kalos → Alola
  const [showAlolaChampionModal,  setShowAlolaChampionModal]  = useState(false); // Alola → Galar
  const [showGalarChampionModal,  setShowGalarChampionModal]  = useState(false); // Galar → Paldea
  const [showArceusCallModal,     setShowArceusCallModal]     = useState(false); // Arceus convida para Hisui
  const [showHisuiChampionModal,  setShowHisuiChampionModal]  = useState(false); // Hisui → Paldea
  const [showPaldeaChampionModal, setShowPaldeaChampionModal] = useState(false); // Paldea = Final
  const [showHisuiInviteModal,    setShowHisuiInviteModal]    = useState(false); // Hisui (recovery para quem já tem galar)
  const [showMegaIntroModal, setShowMegaIntroModal] = useState(false); // Sycamore mega evolution intro
  const [showGymVictoryModal, setShowGymVictoryModal] = useState(null); // { leaderName, badge, badgeImg, reward }
  const [previewStarter, setPreviewStarter] = useState(null);
  const [activeQuestModal, setActiveQuestModal] = useState(null);
  const [pendingQuest, setPendingQuest] = useState(null);
  const [pendingAlphaCapture, setPendingAlphaCapture] = useState(null); // { newPoke, existingShinyId, raid, newItems }
  const [battleReady, setBattleReady] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [showTimeInfoModal, setShowTimeInfoModal] = useState(false);
  const [vsInitialTab, setVsInitialTab] = useState('challenges'); // 'challenges', 'gyms', 'legendary'
  const [vsInitialCategory, setVsInitialCategory] = useState(null); // 'rival', 'boss', 'rocket', 'legendary'
  const [vsInitialRegion, setVsInitialRegion] = useState('kanto'); // 'kanto', 'johto'

  const [sessionStats, setSessionStats] = useState(null);
  const sessionRef = useRef({ kills: 0, coins: 0, trainers: 0, shinyKills: 0, drops: {}, captures: [] });

  // ── Derrotas diárias (fantasmas acumulam, resetam no dia seguinte) ──────────
  const [dailyDefeats, setDailyDefeats] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pkcraft_daily_defeats') || '{}');
      const today = new Date().toDateString();
      return saved.date === today ? (saved.count || 0) : 0;
    } catch { return 0; }
  });

  const registerDefeat = () => {
    const today = new Date().toDateString();
    const newCount = dailyDefeats + 1;
    setDailyDefeats(newCount);
    try { localStorage.setItem('pkcraft_daily_defeats', JSON.stringify({ count: newCount, date: today })); } catch {}
    setCurrentView('defeat_screen');
  };



  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    setGameState(prev => ({ 
      ...prev, 
      trainer: { ...prev.trainer, level: 1, xp: 0, avatarImg: avatar.img } 
    })); 
    setTimeout(() => {
      setCurrentView('starter_selection');
      setSelectedAvatar(null);
    }, 400);
  };

  // Auto-dismiss de notificação de maestria
  useEffect(() => {
    if (masteryNotification) {
      const timer = setTimeout(() => setMasteryNotification(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [masteryNotification]);

  const isProcessingVictory = useRef(false);
  const isProcessingTurn = useRef(false);
  const currentViewRef = useRef('landing');
  const lastNonMenuView = useRef('city');
  const lastSyncRef = useRef(0);
  const saveTimeoutRef = useRef(null);
  const bossSaveTimeoutRef = useRef(null);
  // Guard: só permite save após o load do Firestore completar com sucesso
  const isFullyLoadedRef = useRef(false);
  // Ref para acessar gameState atual nos event listeners sem re-registrar
  const gameStateRef = useRef(null);

  const [bossDamage, setBossDamage] = useState(0);
  const [bossTimer, setBossTimer] = useState(null);
  const [bossLoot, setBossLoot] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [showRaidScreen, setShowRaidScreen] = useState(false);
  const [showRegionBuilder, setShowRegionBuilder] = useState(false);
  const [challengeRegion, setChallengeRegion] = useState(null); // { region, ownerProfile }
  const [checkingName, setCheckingName] = useState(false);
  const [raidRouteNotice, setRaidRouteNotice] = useState(null);
  const [recipeFoundModal, setRecipeFoundModal] = useState(null); // { name, img, effect }
  const [rareDropModal, setRareDropModal] = useState(null);

  const [installPrompt, setInstallPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);


  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // 1. Verifica se o index.html já capturou o prompt
    if (window.deferredPrompt) {
      setInstallPrompt(window.deferredPrompt);
    }

    const handlePwaReady = (e) => { setInstallPrompt(e.detail); };
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };

    window.addEventListener('pwa-prompt-ready', handlePwaReady);
    window.addEventListener('beforeinstallprompt', handler);
    
    return () => {
      window.removeEventListener('pwa-prompt-ready', handlePwaReady);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') setInstallPrompt(null);
    } else if (isIOS) {
      showConfirm({
        type: 'alert',
        title: 'Instalar no iOS',
        message: 'Para instalar: 1. Toque no ícone de "Compartilhar" (quadrado com seta) 2. Role para baixo e selecione "Adicionar à Tela de Início".',
        confirmLabel: 'Entendido',
        onConfirm: closeConfirm
      });
    } else {
      showConfirm({
        type: 'alert',
        title: 'PWA não pronto',
        message: 'O navegador ainda não disparou o evento de instalação. Certifique-se de estar usando Chrome/Edge no Android/Desktop e aguarde alguns segundos.',
        confirmLabel: 'Entendido',
        onConfirm: closeConfirm
      });
    }
  };

  const resetSession = () => {
    sessionRef.current = { kills: 0, coins: 0, trainers: 0, shinyKills: 0, drops: {}, captures: [] };
  };


  const powerScore = useMemo(() => calculatePowerScore(gameState, POKEDEX), [gameState]);

  const addLog = useCallback((msg, type = 'default') => {
    setBattleLog(prev => [{ msg: cleanBattleText(msg), type, id: Date.now() + Math.random() }, ...prev].slice(0, 8));
  }, []);

  const showRaidRouteNotice = useCallback((raid, status = 'ended') => {
    if (!raid) return;
    const messages = {
      rewards: {
        title: 'Raid concluida!',
        message: `${raid.name} foi derrotado. Colete as recompensas da raid.`,
        tone: '#22c55e',
      },
      captured: {
        title: 'Raid capturada!',
        message: `${raid.name} foi capturado. As recompensas estao prontas.`,
        tone: '#22c55e',
      },
      capture: {
        title: 'Raid enfraquecida!',
        message: `${raid.name} chegou na fase de captura. Abra a raid e tente capturar.`,
        tone: '#f59e0b',
      },
      failed: {
        title: 'Raid finalizada',
        message: `${raid.name} fugiu antes de ser derrotado ou capturado.`,
        tone: '#ef4444',
      },
      expired: {
        title: 'Raid expirada',
        message: `${raid.name} saiu da rota. Continue batalhando para encontrar outra raid.`,
        tone: '#ef4444',
      },
      claimed: {
        title: 'Recompensas coletadas',
        message: `A raid contra ${raid.name} foi encerrada com sucesso.`,
        tone: '#3b82f6',
      },
    };
    setRaidRouteNotice({
      id: `${raid.id || 'raid'}_${status}_${Date.now()}`,
      raidName: raid.name,
      stars: raid.stars,
      pokemonId: raid.pokemonId,
      ...(messages[status] || messages.failed),
    });
  }, []);

  const addFloat = useCallback((text, color = '#ef4444', target = 'enemy') => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text: cleanBattleText(text), color, target }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(f => f.id !== id)), 1200);
  }, []);

  const isStoryVsEnemy = useCallback((enemy) => {
    return enemy?.isTrainer && ['rival', 'rocket'].includes(enemy.challengeCategory);
  }, []);

  const openStoryBattleResult = useCallback((enemy, outcome) => {
    const isVictory = outcome === 'victory';
    const routeId = gameState.lastFarmingRoute || gameState.currentRoute || 'route_1';
    setBattleResult({
      outcome,
      title: isVictory ? 'Vitoria confirmada!' : 'Derrota na batalha!',
      enemyName: enemy?.trainerName || enemy?.name || 'Desafio',
      category: enemy?.challengeCategory || 'rival',
      message: isVictory
        ? 'O caminho esta livre. Volte para a rota, capture novos Pokemon e fortaleca o time para o proximo desafio.'
        : 'Seu time foi derrotado. Passe pelo Centro Pokemon antes de tentar novamente.',
      nextRoute: routeId,
      nextLabel: isVictory ? 'Ir para a rota' : 'Ir ao Centro Pokemon',
    });
    setCurrentEnemy(null);
    setCurrentView('battle_result');
  }, [gameState.currentRoute, gameState.lastFarmingRoute]);

  const validateTeamAccess = useCallback((pokemon, targetRegion) => {
    if (!pokemon) return false;
    
    const worldFlags = gameState.worldFlags || [];
    const isLegal = isPokemonLegal(pokemon, targetRegion, worldFlags);
    if (!isLegal) return false;

    // Ainda mantemos a trava de nivel (Level Cap) baseada nas insignias ganhas na regiao
    const badges = gameState.badges || [];
    const regionBadgeIds = REGION_BADGE_IDS[targetRegion] || [];
    const badgeCount = regionBadgeIds.filter(id => badges.includes(id)).length;
    
    const caps = GYM_LEVEL_CAPS[targetRegion] || {};
    const capValues = Object.values(caps);
    const currentCap = capValues[badgeCount] || 100;

    if (pokemon.level > currentCap) return false;

    return true;
  }, [gameState.worldFlags, gameState.badges]);

  const switchRegion = useCallback((newRegion) => {
    setGameState(prev => {
      const oldRegion = prev.activeRegion || 'kanto';
      if (oldRegion === newRegion) return prev;

      // Salva time atual na região antiga
      const updated_regional_teams = {
        ...(prev.regional_teams || {}),
        [oldRegion]: [...prev.team]
      };

      // Carrega time da nova região
      let newTeam = updated_regional_teams[newRegion] || [];
      const worldFlags = prev.worldFlags || [];

      // PROTEÇÃO DE SAVE: Remove automaticamente Pokemon ilegais para a nova regiao
      const illegalPokemon = newTeam.filter(p => !isPokemonLegal(p, newRegion, worldFlags));
      
      if (illegalPokemon.length > 0) {
        newTeam = newTeam.filter(p => isPokemonLegal(p, newRegion, worldFlags));
        const newPC = [...(prev.pc || []), ...illegalPokemon];
        
        addLog(`⚠️ ${illegalPokemon.length} Pokemon estrangeiros foram enviados ao PC (Trava Regional).`, 'warning');
        
        return {
          ...prev,
          activeRegion: newRegion,
          regional_teams: updated_regional_teams,
          team: newTeam,
          pc: newPC
        };
      }

      addLog(`🌍 Viajando para ${newRegion.toUpperCase()}... Equipe trocada!`, 'system');

      return {
        ...prev,
        activeRegion: newRegion,
        regional_teams: updated_regional_teams,
        team: newTeam
      };
    });

    setTimeout(() => {
      if (expeditionReportRef.current) {
        setExpeditionReport(expeditionReportRef.current);
        expeditionReportRef.current = null;
      }
    }, 50);
  }, [addLog]);

  const MATERIAL_RANK_MILESTONES = {
    'Rank I': 0,
    'Rank II': 50000,
    'Rank III': 150000,
    'Rank IV': 300000,
    'Rank V': 500000,
    'Rank VI': 800000,
    'Rank VII': 1200000,
    'Rank VIII': 1700000,
    'Rank IX': 2500000,
  };

  const currentRank = useMemo(() => {
    const entries = Object.entries(MATERIAL_RANK_MILESTONES).sort((a, b) => b[1] - a[1]);
    const found = entries.find(([_, ps]) => powerScore >= ps);
    return found ? found[0] : 'Rank I';
  }, [powerScore]);

  const processedRoutes = useMemo(() => {
    const newRoutes = JSON.parse(JSON.stringify(ROUTES)); 
    const addSafe = (routeId, id, lvl, drop, dropChance) => {
      const route = newRoutes[routeId];
      if (route && route.enemies) {
        if (!route.enemies.some(e => e.id === id)) {
          const entry = { id, level: lvl };
          if (drop) entry.drop = drop;
          if (dropChance) entry.dropChance = dropChance;
          route.enemies.unshift(entry);
        }
      }
    };

    if (gameState.worldFlags?.includes('starters_spotted') || gameState.worldFlags?.includes('rival_1_defeated')) {
      // Rota 1: Squirtle e Charmander
      addSafe('route_1', 7, 4, 'water_stone_shard', 0.08);
      addSafe('route_1', 4, 4, 'fire_stone_shard', 0.08);

      // Rota 22: Eevee
      addSafe('route_22', 133, 6);

      // Floresta de Viridian: Pikachu e Bulbasaur
      addSafe('viridian_forest', 25, 9, 'thunder_stone_shard', 0.08);
      addSafe('viridian_forest', 1, 8, 'leaf_stone_shard', 0.08);
    }

    if (gameState.worldFlags?.includes('unova_starters_spotted') || gameState.worldFlags?.includes('unova_rival_1_defeated')) {
      // Rota 1 de Unova: Snivy e Tepig
      addSafe('unova_route_1', 495, 8);  // Snivy
      addSafe('unova_route_1', 498, 8);  // Tepig
      // Rota 2 de Unova: Oshawott
      addSafe('unova_route_2', 501, 12); // Oshawott
    }

    // ── NOVO: mapa de ID máximo permitido por região ──
    const REGION_MAX_DEX_ID = {
      kanto: 151, johto: 251, hoenn: 386, sinnoh: 493,
      unova: 649, kalos: 721, alola: 809, galar: 905, paldea: 1025
    };

    const getLeveledSpeciesId = (pokemonId, level, maxId = 9999) => {
      let currentId = Number(pokemonId);
      let guard = 0;
      while (guard < 3) {
        const base = POKEDEX[currentId] || POKEDEX[String(currentId)];
        const evo = base?.evolution;
        const nextId = Number(evo?.id);
        if (!evo || !nextId || !evo.level || level < evo.level) break;
        if (nextId > maxId) break;  // ← NOVA LINHA: bloqueia gerações futuras
        currentId = nextId;
        guard += 1;
      }
      return currentId;
    };
    const TYPE_DOMAIN_DROPS = {
      Normal: 'normal_essence',
      Fire: 'fire_essence',
      Water: 'water_essence',
      Grass: 'grass_essence',
      Electric: 'electric_essence',
      Flying: 'flying_essence',
      Poison: 'poison_essence',
      Ground: 'ground_essence',
      Rock: 'rock_essence',
      Fighting: 'fury_essence',
      Psychic: 'psychic_essence',
      Bug: 'bug_essence',
      Ice: 'ice_essence',
      Ghost: 'ghost_essence',
      Dragon: 'dragon_essence',
      Dark: 'dark_essence',
      Steel: 'steel_essence',
      Fairy: 'fairy_essence',
    };

    const getPokedexTypes = (entry = {}) => {
      const types = Array.isArray(entry.types) && entry.types.length ? entry.types : [entry.type];
      return types.filter(Boolean);
    };

    const getPostGameLevel = (index, total) => {
      if (total <= 1) return 100;
      return Math.min(100, 70 + Math.floor((index / (total - 1)) * 30));
    };

    const buildTypeDomainEnemies = (type) => {
      const ids = Object.keys(POKEDEX)
        .map(Number)
        .filter(id => Number.isFinite(id) && id > 0 && id <= 1025)
        .filter(id => {
          const entry = POKEDEX[id] || POKEDEX[String(id)];
          return entry && getPokedexTypes(entry).includes(type);
        })
        .sort((a, b) => a - b);

      return ids.map((id, index) => {
        const level = getPostGameLevel(index, ids.length);
        return {
          id,
          level,
          drop: TYPE_DOMAIN_DROPS[type] || 'normal_essence',
          dropChance: level >= 95 ? 0.42 : level >= 85 ? 0.36 : 0.3,
          spawnWeight: level >= 95 ? 28 : level >= 85 ? 42 : 64,
        };
      });
    };

    const buildPrismDomainEnemies = () => {
      const ids = Object.keys(POKEDEX)
        .map(Number)
        .filter(id => Number.isFinite(id) && id > 0 && id <= 1025)
        .sort((a, b) => a - b);
      return ids.map(id => ({ id, level: 100, drop: 'stardust', dropChance: 0.32, spawnWeight: 30 }));
    };

    Object.values(newRoutes).forEach(route => {
      if (!route?.postGameDomain) return;
      const enemies = route.prismDomain ? buildPrismDomainEnemies() : buildTypeDomainEnemies(route.typeDomain);
      route.enemies = enemies;
      const trainerTeam = enemies
        .filter(enemy => enemy.level >= 90)
        .slice(-6)
        .map(enemy => ({ id: enemy.id, level: Math.min(100, enemy.level + 3) }));
      route.trainers = (route.trainers || []).map(trainer => ({
        ...trainer,
        team: trainerTeam.slice(0, route.prismDomain ? 6 : 4),
      }));
    });

    Object.values(newRoutes).forEach(route => {
      if (route.type !== 'farm') return;
      if (route.postGameDomain) return;

      // ── NOVO: detectar região da rota e seu limite de Dex ──
      const routeRegion = inferRouteRegion(route.id, route.group);
      const maxDexId = REGION_MAX_DEX_ID[routeRegion?.id] || 9999;

      const enemyLevels = (route.enemies || [])
        .map(enemy => Number(enemy.level || 1))
        .filter(level => Number.isFinite(level));
      const maxWildLevel = enemyLevels.length ? Math.max(...enemyLevels) : Number(route.unlockLevel || 1);
      const minTrainerLevel = maxWildLevel + 3;
      const shouldEvolveWild = maxWildLevel >= 18;

      if (shouldEvolveWild && Array.isArray(route.enemies)) {
        const uniqueEnemies = new Map();
        route.enemies.forEach(enemy => {
          const evolvedId = getLeveledSpeciesId(enemy.id, Number(enemy.level || maxWildLevel), maxDexId);
          if (!uniqueEnemies.has(evolvedId)) {
            uniqueEnemies.set(evolvedId, { ...enemy, id: evolvedId });
          }
        });
        route.enemies = Array.from(uniqueEnemies.values());
      }

      if (Array.isArray(route.trainers)) {
        route.trainers = route.trainers.map(trainer => ({
          ...trainer,
          team: (trainer.team || []).map(member => {
            const level = Math.max(Number(member.level || minTrainerLevel), minTrainerLevel);
            return {
              ...member,
              id: getLeveledSpeciesId(member.id, level, maxDexId), // ← passa maxDexId
              level,
            };
          }),
        }));
      }
    });

    return newRoutes;
  }, [gameState.worldFlags]);

  // IMAGE PRELOADER PARA OTIMIZACAO
  useEffect(() => {
    if (!gameState || !processedRoutes) return;
    const criticalImages = [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
      'https://play.pokemonshowdown.com/sprites/trainers/oak.png',
      'https://play.pokemonshowdown.com/sprites/trainers/nurse.png',
      ...(gameState.team || []).map(p => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`),
      fixPath(processedRoutes[gameState.currentRoute]?.background || '')
    ].flat().filter(src => src && src.length > 5);

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [gameState.currentRoute, gameState.team, processedRoutes]);


  // ── Gera clima ao mudar de rota ───────────────────────────────────────────
  useEffect(() => {
    const route = processedRoutes[gameState.currentRoute];
    const newWeather = generateWeatherForRoute(route);
    setWeather(newWeather);
    setWeatherTurns(0);
  }, [gameState.currentRoute, processedRoutes]);

  const activateWeatherFromMove = useCallback((move, userName = 'Pokemon') => {
    const nextWeather = getWeatherFromMove(move);
    if (!nextWeather) return false;

    const weatherText = {
      sun: 'Sol intenso',
      rain: 'Chuva',
      sandstorm: 'Tempestade de areia',
      hail: 'Granizo',
    }[nextWeather] || 'Clima';

    setWeather(nextWeather);
    setWeatherTurns(5);
    addLog(`${userName} mudou o clima: ${weatherText}!`, 'system');
    return true;
  }, [addLog]);

  // ── Exibe tutorial na primeira visita à Cidade ────────────────────────────
  useEffect(() => {
    const hasStarter = (gameState.worldFlags || []).includes('has_starter');
    if (hasStarter && !gameState.gameTutorialShown && currentView === 'city') {
      setShowTutorial(true);
    }
  }, [currentView, gameState.worldFlags, gameState.gameTutorialShown]);

  // ── Intercepta entrada na Safari Zone ────────────────────────────────────
  // Quando o jogador navega para 'battles' em uma rota do tipo 'safari',
  // redireciona para a tela interativa da Safari Zone.
  useEffect(() => {
    if (currentView === 'battles') {
      const route = processedRoutes[gameState.currentRoute];
      if (route?.type === 'safari') {
        const entryCost = route.safariEntryCost || 500;
        const coins = gameState.inventory?.currency || gameState.inventory?.coins || 0;
        if (coins < entryCost) {
          addLog(`❌ Você precisa de ${entryCost} Pokédollars para entrar na Safari Zone!`, 'system');
          setCurrentView('routes');
          return;
        }
        // Deduz moedas de entrada
        setGameState(prev => ({
          ...prev,
          inventory: {
            ...prev.inventory,
            currency: Math.max(0, (prev.inventory?.currency || 0) - entryCost),
            coins:    Math.max(0, (prev.inventory?.coins    || 0) - entryCost),
          },
        }));
        addLog(`🌿 Você pagou ${entryCost} Pokédollars e entrou na Safari Zone!`, 'success');
        setSafariSession({ ballsLeft: 30 });
        setCurrentView('safari');
      }
    }
  }, [currentView, gameState.currentRoute, processedRoutes]);

  // Tutorial de boas-vindas: dispara uma única vez na primeira entrada na cidade
  // 🛡️ PROTECTED: handleSafeNavigation — Gerenciamento centralizado de transições de tela
  const handleSafeNavigation = useCallback((targetView, extraAction = null) => {
    const isTraining = !currentEnemy?.isTrainer && !currentEnemy?.isWildBoss && !currentEnemy?.isLegendary;
    const isKeyBattle = currentEnemy && !isTraining;

    if (isKeyBattle) {
      // Acessar equipe é seguro — batalha continua em segundo plano, permite retorno
      if (targetView === 'pokemon_management') {
        setCurrentView(targetView);
        return;
      }

      // Tentar ir para cidade ou rotas durante luta chave → pede confirmação
      if (targetView === 'city' || targetView === 'routes') {
        const destLabel = targetView === 'city' ? 'Cidade' : 'Rotas';
        setConfirmModal({
          type: 'warning',
          title: '⚠️ Abandonar Batalha?',
          message: `Retornar à ${destLabel} irá cancelar a luta atual. Seu progresso nesta batalha será perdido. Deseja confirmar?`,
          confirmLabel: `Sair para a ${destLabel}`,
          onConfirm: () => {
            setConfirmModal(null);
            setCurrentEnemy(null);
            if (extraAction) extraAction();
            setCurrentView(targetView);
          },
          onCancel: () => setConfirmModal(null),
        });
        return;
      }

      // Outras navegações
      setCurrentEnemy(null);
      if (extraAction) extraAction();
      setCurrentView(targetView);
      return;
    }

    // Navegacao direta para rotas de treino ou menus
    if (extraAction) extraAction();
    setCurrentView(targetView);
  }, [currentEnemy, setCurrentView, setConfirmModal]);

  // PROTECTED: handleGoToCity - NAO EDITAR SEM AUTORIZACAO EXPLICITA
  const handleGoToCity = useCallback(() => {
    const currentR = ROUTES[gameState.currentRoute];
    const isTraining = !currentEnemy?.isTrainer && !currentEnemy?.isWildBoss && !currentEnemy?.isLegendary;
    const isKeyBattle = currentEnemy && !isTraining;
    const isRouteTrainingBattle = currentView === 'battles' && currentEnemy && isTraining && currentR?.type === 'farm';
    let targetCityId = null;

    if (currentR && currentR.group) {
      targetCityId = Object.keys(ROUTES).find(key => 
        ROUTES[key].group === currentR.group && 
        (ROUTES[key].type === 'city' || ROUTES[key].type === 'gym')
      );
    }

    const performExit = () => {
      if (isRouteTrainingBattle && (sessionRef.current.kills > 0 || sessionRef.current.captures.length > 0)) {
        setSessionStats({ ...sessionRef.current, targetRoute: targetCityId || gameState.currentRoute });
        return;
      }
      
      setGameState(prev => ({ 
        ...prev, 
        lastFarmingRoute: (ROUTES[prev.currentRoute]?.type === 'farm') ? prev.currentRoute : prev.lastFarmingRoute,
        currentRoute: targetCityId || prev.currentRoute 
      }));
      setCurrentEnemy(null);
      resetSession();
      setCurrentView('city'); // Retorna ao menu da cidade
    };

    if (isKeyBattle) {
      performExit();
      return;
    }

    performExit();
  }, [currentEnemy, gameState.currentRoute, currentView, ROUTES, setGameState, setCurrentView, resetSession]);



  // Gerenciamento de BGM Global
  useEffect(() => {
    const selectedId = gameState.settings?.selectedMusic || 'all';
    
    const playNext = () => {
      const available = MUSIC_LIST.filter(m => m.id !== 'all');
      const random = available[Math.floor(Math.random() * available.length)];
      if (random) playBGM(fixPath(random.url), 0.25, false, playNext);
    };

    if (selectedId === 'all') {
      playNext();
    } else {
      const track = MUSIC_LIST.find(m => m.id === selectedId);
      if (track) playBGM(fixPath(track.url), 0.25, true);
      else playBGM(null);
    }
  }, [gameState.settings?.selectedMusic, playBGM]);

  const goToCity = (fromBattle = false) => {
    handleGoToCity();
  };

  // SANEAMENTO DE COLECAO (Substitui Unificacao Agressiva)
  const sanitizeCollection = useCallback((prev) => {
    const sanitize = (p) => {
      const id = Number(p.id);
      const base = POKEDEX[id] || {};
      
      let processed = { ...p };
      const needsMoves = !processed.moves || processed.moves.length === 0;
      const needsStats = !processed.spAtk || !processed.spDef;
      const needsInstanceId = !processed.instanceId;

      if (needsMoves || needsStats || needsInstanceId) {
        if (needsMoves) {
          const learnset = base.learnset || [];
          let availableMoves = learnset
            .filter(m => m.level <= (p.level || 5))
            .map(m => {
              const moveKey = (m.move || '').toLowerCase();
              const moveData = MOVES[moveKey] || { name: m.move, power: 40, type: 'Normal' };
              return {
                name: MOVE_TRANSLATIONS[moveKey] || moveData.name || m.move,
                power: moveData.power || 0,
                type: moveData.type || 'Normal'
              };
            });
          if (availableMoves.length === 0) availableMoves = [{ name: 'Investida', power: 40, type: 'Normal' }];
          processed.moves = availableMoves.slice(-4);
        }

        if (needsStats) {
          const shinyMult = getShinyMult(p);
          const calcStat = (b) => Math.max(1, Math.ceil(Math.ceil(((2 * b * p.level) / 100) + 5) * shinyMult));
          const calcHp   = (b) => Math.max(1, Math.ceil(Math.ceil(((2 * b * p.level) / 100) + p.level + 10) * shinyMult));

          processed.spAtk = calcStat(base.spAtk || 10);
          processed.spDef = calcStat(base.spDef || 10);
          processed.attack = calcStat(base.attack || 10);
          processed.defense = calcStat(base.defense || 10);
          processed.speed = calcStat(base.speed || 10);
          processed.maxHp = calcHp(base.hp || base.maxHp || 30);
          processed.hp = Math.ceil(p.hp || processed.maxHp);
        }

        if (needsInstanceId) {
          processed.instanceId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
      }
      return processed;
    };

    return { 
      ...prev, 
      team: (prev.team || []).map(sanitize), 
      pc: (prev.pc || []).map(sanitize) 
    };
  }, []);

  useEffect(() => {
    setGameState(prev => {
      const all = [...(prev.team || []), ...(prev.pc || [])];
      const needsMoves = all.some(p => !p.moves || p.moves.length === 0);
      const needsInstanceId = all.some(p => !p.instanceId);
      
      // Sincroniza Pokedex (caughtData) com Pokémons que o jogador possui
      let caughtChanged = false;
      const newCaughtData = { ...(prev.caughtData || {}) };
      
      // ── AUDITORIA DE CAMPEÕES (v1.98.3) ───────────────────────────────────
      // Resolve o bug de "Ghost Champion" onde jogadores tinham o troféu sem vencer o boss.
      // Removemos o status de campeão se o jogador não tiver sequer a última insígnia da região.
      const regionAudit = [
        { id: 'johto',  flag: 'region_champion_johto',  champ: 'johto_champion',  lastBadge: 'rising_badge',  next: 'hoenn_started' },
        { id: 'hoenn',  flag: 'region_champion_hoenn',  champ: 'hoenn_champion',  lastBadge: 'rain_badge',    next: 'sinnoh_started' },
        { id: 'sinnoh', flag: 'region_champion_sinnoh', champ: 'sinnoh_champion', lastBadge: 'beacon_badge',  next: 'unova_started' },
        { id: 'unova',  flag: 'region_champion_unova',  champ: 'unova_champion',  lastBadge: 'legend_badge',  next: 'kalos_started' },
        { id: 'kalos',  flag: 'region_champion_kalos',  champ: 'kalos_champion',  lastBadge: 'iceberg_badge', next: 'alola_started' },
        { id: 'alola',  flag: 'region_champion_alola',  champ: 'alola_champion',  lastBadge: 'battle_tree_stamp', next: 'galar_started' },
      ];

      let auditChanged = false;
      let auditedFlags = [...(prev.worldFlags || [])];
      const playerBadges = prev.badges || [];

      regionAudit.forEach(reg => {
        const hasChamp = auditedFlags.includes(reg.champ) || auditedFlags.includes(reg.flag);
        const hasLastBadge = playerBadges.includes(reg.lastBadge);
        const hasNextRegion = reg.next && auditedFlags.includes(reg.next);

        // Se tem status de campeão mas NÃO tem a última insígnia, é um fantasma!
        if (hasChamp && !hasLastBadge && !hasNextRegion) {
          // Remove champion flags AND _modal_shown so the invite modal can re-trigger after re-winning
          auditedFlags = auditedFlags.filter(f => f !== reg.champ && f !== reg.flag && f !== `${reg.id}_champion_modal_shown`);
          auditChanged = true;
        }
        
        // Se começou a próxima região, garante a flag de campeão verificado
        if (hasNextRegion && !auditedFlags.includes(reg.flag)) {
          auditedFlags.push(reg.flag);
          auditChanged = true;
        }
      });

      all.forEach(p => {
        if (!newCaughtData[p.id]) {
          newCaughtData[p.id] = true;
          caughtChanged = true;
        }
      });

      if (needsMoves || needsInstanceId || caughtChanged || auditChanged) {
        const nextState = (needsMoves || needsInstanceId) ? sanitizeCollection({ ...prev, worldFlags: auditedFlags }) : { ...prev, worldFlags: auditedFlags };
        
        if (caughtChanged) {
          return { ...nextState, caughtData: newCaughtData };
        }
        return nextState;
      }
      return prev;
    });
  }, [gameState.team?.length, gameState.pc?.length, sanitizeCollection]);

  const processCaptureMastery = useCallback((pokemon, prevGameState) => {
    const currentCount = prevGameState.speciesMastery[pokemon.id] || 0;
    const newCount = currentCount + 1;
    const path = getMasteryPath(pokemon.id);
    
    let reward = null;
    if (newCount % 5 === 0 && newCount <= (NATURE_LIST.length * 5)) {
      const natureIndex = (newCount / 5) - 1;
      const natureName = NATURE_LIST[natureIndex];
      reward = { type: 'Naturezas', val: `Natureza ${natureName}` };
    }
    else if (path.hiddenAbility && newCount === path.hiddenAbility.level) reward = { type: 'Hab. Oculta', val: path.hiddenAbility.name };
    else {
      const ability = path.abilities.find(a => a.level === newCount);
      if (ability) reward = { type: 'Habilidade', val: ability.name };
      else {
        const rareMove = path.rareMoves.find(r => r.level === newCount);
        if (rareMove) reward = { type: 'Ataque Raro', val: rareMove.name };
      }
    }

    if (newCount === 100) { addLog(`✨ Domínio de ${pokemon.name}: Chance Shiny 2x!`, 'system'); reward = { type: 'Bônus Passivo', val: 'Chance Shiny 2x' }; }
    if (newCount === 200) { addLog(`✨ Domínio de ${pokemon.name}: Chance Shiny 5x!`, 'system'); reward = { type: 'Bônus Passivo', val: 'Chance Shiny 5x' }; }

    if (reward) {
      addLog(`🌟 Domínio de ${pokemon.name}: ${reward.val} liberado!`, 'system');
      setTimeout(() => setMasteryNotification({ pokemon, reward }), 0);
    }

    return { ...prevGameState.speciesMastery, [pokemon.id]: newCount };
  }, [addLog]);


  // FIREBASE CLOUD SYNC



  // Mantém gameStateRef atualizado para uso em event listeners
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // 1. Sincronização LocalStorage (Sempre que o estado mudar)
  useEffect(() => {
    // Não salva localmente enquanto o load não completou (evita sobrescrever save com estado padrão)
    if (!isFullyLoadedRef.current) return;
    try {
      const compressed = LZString.compress(JSON.stringify({ gameState }));
      localStorage.setItem('poke_idle_save', compressed);
    } catch (e) {
      if (e?.name === 'QuotaExceededError') {
        notify('Armazenamento local cheio. Salve na nuvem para não perder progresso!', 'error');
      }
    }
  }, [gameState]);

  useEffect(() => {
    setGameState(prev => {
      const stats = prev.playerStats || {};
      if (stats.startedAt) return prev;
      return {
        ...prev,
        playerStats: bumpPlayerStats(stats, {}),
      };
    });
  }, []);

  useEffect(() => {
    if (loading || ['landing', 'auth'].includes(currentView)) return undefined;
    const id = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        playerStats: bumpPlayerStats(prev.playerStats, { playTimeMs: 60000 }),
      }));
    }, 60000);
    return () => clearInterval(id);
  }, [loading, currentView]);

  // Efeito de Tema Visual
  useEffect(() => {
    const themeId = gameState.prestige?.uiTheme || 'default';
    const theme = UI_THEMES[themeId] || UI_THEMES.default;
    const root = document.documentElement;
    Object.entries(theme.css || {}).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }, [gameState.prestige?.uiTheme]);

  // Coleta passiva da mina
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev.mine?.unlocked) return prev;
        const now = Date.now();
        const lastCollected = prev.mine.lastCollected || now;
        const level = prev.mine.level || 1;
        const mineConfig = MINE_LEVELS[level];
        
        // Se ainda não deu o tempo de intervalo, não faz nada
        if (!mineConfig || now - lastCollected < mineConfig.intervalMs) return prev;

        const newMaterials = { ...prev.inventory.materials };
        Object.entries(mineConfig.drops).forEach(([mat, range]) => {
          const qty = Math.floor(range.min + Math.random() * (range.max - range.min + 1));
          newMaterials[mat] = (newMaterials[mat] || 0) + qty;
        });

        addLog(`⛏️ Sua mina produziu materiais!`, 'system');
        return {
          ...prev,
          mine: { ...prev.mine, lastCollected: now },
          inventory: { ...prev.inventory, materials: newMaterials },
        };
      });
    }, 60 * 1000); // checa a cada 1 minuto

    return () => clearInterval(interval);
  }, [addLog]);

  // 2. Gatilhos de Salvamento na Nuvem (Debounced 5s)
  // Baseado em: Fechamento de Modais ou Troca de Rota
  const saveToCloud = useCallback(async (dataToSave) => {
    const user = auth.currentUser;
    if (!user) return;

    // Nunca salvar se o load ainda não completou — evita sobrescrever save real com estado vazio
    if (!isFullyLoadedRef.current) {
      console.warn('[Save] Bloqueado: load ainda não completou.');
      return;
    }

    // Validação de estado: recusa salvar um estado completamente vazio (sem progresso)
    const _hasProgress = (dataToSave.team?.length > 0) ||
      (dataToSave.pc?.length > 0) ||
      Object.keys(dataToSave.caughtData || {}).length > 0 ||
      (dataToSave.badges?.length > 0) ||
      (dataToSave.worldFlags?.length > 0);
    if (!_hasProgress && !dataToSave._allowEmptySave) {
      console.warn('[Save] Bloqueado: estado sem progresso detectado, save ignorado.');
      return;
    }

    try {
      const badgeCount = getBadgeCount(dataToSave);
      const powerScore = calculatePowerScore(dataToSave, POKEDEX);

      lastSyncRef.current = Date.now();
      
      // 1. Salva o estado completo do jogo (comprimido para respeitar limite de 1MB do Firestore)
      const cleanState = removeUndefinedFields({ ...dataToSave, version: dataToSave.version || APP_VERSION });
      const compressedState = LZString.compress(JSON.stringify(cleanState));
      await setDoc(doc(db, "saves", user.uid), {
        compressedState,
        gameState: deleteField(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 2. Sincroniza dados públicos para o Ranking Global e sistema de amigos
      await setDoc(doc(db, "users", user.uid), {
        name: dataToSave.trainer?.name || "Treinador",
        nameLower: (dataToSave.trainer?.name || "Treinador").toLowerCase().trim(),
        avatar: dataToSave.trainer?.avatar || 1,
        level: dataToSave.trainer?.level || 1,
        titleId: dataToSave.trainer?.titleId || null,
        badges: badgeCount,
        powerScore: powerScore,
        caughtCount: Object.keys(dataToSave.caughtData || {}).length,
        caughtData: dataToSave.caughtData || {},
        worldFlags: dataToSave.worldFlags || [],
        badgesList: dataToSave.badges || [],
        forgedItemsCount: dataToSave.forgedItemsCount || 0,
        bossTotalDamage: dataToSave.bossTotalDamage || 0,
        bossLastDamage: dataToSave.bossLastDamage || 0,
        shinyCapturedCount: dataToSave.shinyCapturedCount || 0,
        trainerBattleWins: dataToSave.trainerBattleWins || 0,
        playerStats: dataToSave.playerStats || {},
        // Aparência — necessário para renderizar o Trainer Card nos amigos
        appearance: dataToSave.appearance || {},
        selectedTitle: dataToSave.selectedTitle || null,
        prestige: dataToSave.prestige || {},
        // Região — indica se o jogador tem região publicada para desafio
        hasRegion: !!(dataToSave.myRegion?.published),
        updatedAt: serverTimestamp()
      }, { merge: true });

      // 3. Sincroniza região publicada em coleção separada
      if (dataToSave.myRegion?.published) {
        await setDoc(doc(db, 'userRegions', user.uid), {
          ...(dataToSave.myRegion || {}),
          ownerName: dataToSave.trainer?.name || 'Treinador',
          ownerUid: user.uid,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

    } catch (e) {
      console.error("Cloud Save Fail:", e);
    }
  }, []);

  // ── Listener em tempo real: solicitações de amizade pendentes ─────────────
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const unsub = subscribeToFriendRequests(user.uid, (requests) => {
      setPendingFriendRequests(requests);
    });
    return () => unsub();
  }, []);

  const saveBossDamage = useCallback(async (damage) => {
    const user = auth.currentUser;
    if (!user || damage <= 0) return;
    
    try {
      // 1. Atualizar Mini-Ranking Global do Boss
      const userRef = doc(db, "bossRankings", user.uid);
      const userSnap = await getDoc(userRef);
      const currentData = userSnap.exists() ? userSnap.data() : {};
      const currentBest = currentData.totalDamage || currentData.bestDamage || 0;
      const bestDamage = Math.max(currentBest, damage);
      const currentAttempts = currentData.attempts || 0;
      const score = Math.floor(damage + Math.max(0, powerScore || 0) * 0.18);
      const bestScore = Math.max(currentData.bestScore || 0, score);
      
      await setDoc(userRef, {
        name: gameState.trainer?.name || "Treinador",
        avatar: gameState.trainer?.avatar || gameState.trainer?.sprite || null,
        totalDamage: bestDamage,
        bestDamage,
        lastDamage: damage,
        bestScore,
        lastScore: score,
        attempts: currentAttempts + 1,
        powerScore: powerScore || 0,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Atualiza localmente para exibição imediata no card do Boss.
      setGameState(prev => ({
        ...prev,
        bossTotalDamage: Math.max(prev.bossTotalDamage || 0, damage),
        bossLastDamage: damage
      }));
        
      if (damage > currentBest) {
        // 2. Registrar histórico na sub-coleção bossEvents
        const historyRef = doc(db, "users", user.uid, "bossEvents", Date.now().toString());
        await setDoc(historyRef, {
          damage,
          score,
          powerScore: powerScore || 0,
          timestamp: serverTimestamp()
        });
        
      }
    } catch (e) {
      console.error("Boss damage save fail:", e);
    }
  }, [gameState.trainer?.name, gameState.trainer?.avatar, gameState.trainer?.sprite, powerScore]);

  const debouncedSaveBossDamage = useCallback((damage) => {
    if (bossSaveTimeoutRef.current) clearTimeout(bossSaveTimeoutRef.current);
    bossSaveTimeoutRef.current = setTimeout(() => {
      saveBossDamage(damage).catch(e => console.error("Boss save fail:", e));
    }, 5000);
  }, [saveBossDamage]);

  const debouncedSave = useCallback((data) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveToCloud(data).catch(e => console.error("Auto save fail:", e));
    }, 5000);
  }, [saveToCloud]);

  // 3. beforeunload + visibilitychange — salva com lastSeenAt antes de fechar/minimizar
  // Usa gameStateRef para não precisar re-registrar listeners a cada mudança de estado
  useEffect(() => {
    const saveLocal = () => {
      if (!isFullyLoadedRef.current || !gameStateRef.current) return;
      try {
        const stateWithTimestamp = {
          ...gameStateRef.current,
          playerStats: { ...gameStateRef.current.playerStats, lastSeenAt: Date.now() }
        };
        const compressed = LZString.compress(JSON.stringify({ gameState: stateWithTimestamp }));
        localStorage.setItem('poke_idle_save', compressed);
      } catch (e) { /* sem-op se quota estourar */ }
    };

    const handleVisibility = () => {
      if (!document.hidden) return;
      saveLocal(); // salva sempre no localStorage
      // Também tenta salvar na nuvem com lastSeenAt atualizado (para offline progress funcionar)
      if (isFullyLoadedRef.current && gameStateRef.current) {
        const stateWithTimestamp = {
          ...gameStateRef.current,
          playerStats: { ...gameStateRef.current.playerStats, lastSeenAt: Date.now() }
        };
        saveToCloud(stateWithTimestamp).catch(() => { /* silencia erros de rede */ });
      }
    };

    window.addEventListener('beforeunload', saveLocal);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('beforeunload', saveLocal);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [saveToCloud]); // inclui saveToCloud nas deps

  // 4. Online/Offline — avisa o jogador e resync automático ao reconectar
  useEffect(() => {
    const handleOffline = () => notify('Sem conexão. Progresso sendo salvo localmente.', 'error');
    const handleOnline = () => {
      notify('Conexão restaurada. Sincronizando...', 'success');
      const user = auth.currentUser;
      if (user && gameStateRef.current) saveToCloud(gameStateRef.current).catch(e => console.error("Resync fail:", e));
    };
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [saveToCloud]);

  const prevView = useRef(currentView);
  const prevRoute = useRef(gameState.currentRoute);

  useEffect(() => {
    const modalViews = ['battles', 'gym', 'vs_screen', 'pokedex', 'evolution', 'challenges'];
    const viewChanged = prevView.current !== currentView;
    const routeChanged = prevRoute.current !== gameState.currentRoute;

    // Trigger save if route changed OR if a modal/important screen was closed
    if (routeChanged || (viewChanged && modalViews.includes(prevView.current))) {
       debouncedSave(gameState);
    }

    prevView.current = currentView;
    prevRoute.current = gameState.currentRoute;
  }, [currentView, gameState.currentRoute, debouncedSave, gameState]);

  
  const triggerSave = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      showConfirm({
        title: 'Acesso Restrito',
        message: 'Você precisa estar logado para salvar seu progresso na nuvem!',
        onConfirm: closeConfirm
      });
      return;
    }
    try {
      lastSyncRef.current = Date.now();
      const cleanState = removeUndefinedFields({ ...gameState, version: gameState.version || APP_VERSION });
      const compressedState = LZString.compress(JSON.stringify(cleanState));
      await setDoc(doc(db, "saves", user.uid), {
        compressedState,
        gameState: deleteField(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      showConfirm({ type: 'success', title: 'Salvo!', message: 'Jogo salvo na nuvem com sucesso!', onConfirm: closeConfirm });
    } catch (e) {
      console.error("Manual Save Fail:", e);
      showConfirm({ type: 'error', title: 'Erro ao salvar', message: 'Não foi possível salvar na nuvem: ' + e.message, onConfirm: closeConfirm });
    }
  }, [gameState]);

  // ──────────────────────────────────────────────────────────────────────────────
  // Lê o campo "effect" do moves.js e retorna o que o golpe deve fazer
  const interpretMoveEffect = (move) => {
    const e = (move.effect || '').toLowerCase();
    const name = (move.name || '').toLowerCase();
    const result = {
      statChanges: [],   // [{ stat, change, target: 'enemy'|'self' }]
      statusEffect: null, // 'burn'|'poison'|'sleep'|'paralyze'|'confuse'|'freeze'|'toxic'
      statusTarget: 'enemy',
      heal: false,       // se cura o próprio pokémon
      fixedDamage: null, // dano fixo (seismic-toss, dragon-rage, etc)
      ohko: false,       // one-hit KO
      leechSeed: false,  // Semente Sanguessuga
      accuracy_change: null, // { target, change }
      evasion_change: null,
      noEffect: false,   // teleport, roar, etc - sem efeito em batalha idle
    };

    // Semente Sanguessuga
    if (name === 'leech-seed' || name === 'leech seed') {
      result.leechSeed = true; return result;
    }

    // Efeitos especiais de dano
    if (e.includes('one-hit ko') || e.includes('causes a one-hit ko')) {
      result.ohko = true; return result;
    }
    if (e.includes('inflicts damage equal to the user') && e.includes('level')) {
      result.fixedDamage = 'level'; return result;
    }
    if (e.includes('inflicts damage between 50% and 150%')) {
      result.fixedDamage = 'psywave'; return result;
    }
    if (e.includes('half the target') && e.includes('hp')) {
      result.fixedDamage = 'half_hp'; return result;
    }
    if (e.includes('inflicts 40 points')) {
      result.fixedDamage = 40; return result;
    }
    if (e.includes('inflicts 20 points')) {
      result.fixedDamage = 20; return result;
    }

    // Heal
    if (e.includes('restores') || (e.includes('heals') && e.includes('user')) ||
        ['recover','soft-boiled','milk drink','morning sun','synthesis','moonlight',
         'rest','slack off','roost','shore up','heal order'].some(n => name.includes(n))) {
      result.heal = true; return result;
    }

    // Accuracy / Evasion
    if ((e.includes('accuracy') && e.includes('lower')) || e.includes("lowers the target's accuracy")) {
      result.accuracy_change = { target: 'enemy', change: -1 };
    }
    if (e.includes('evasion') && (e.includes('raise') || e.includes('increas'))) {
      result.evasion_change = { target: 'self', change: +1 };
    }

    // Debuffs no inimigo
    if ((e.includes('special defense') && e.includes('lower')) || name === 'metal sound' || name === 'fake tears') {
      const stages = e.includes('two') || e.includes('2') ? -2 : -1;
      result.statChanges.push({ stat: 'spDef', change: stages, target: 'enemy' });
    }
    if ((e.includes('special attack') && e.includes('lower')) || name === 'memento' || name === 'noble roar') {
      result.statChanges.push({ stat: 'spAtk', change: -1, target: 'enemy' });
    }
    if (e.includes("attack") && e.includes('lower') && !e.includes('special')) {
      const stages = (e.includes('two stage') || e.includes('two stages') || e.includes('by 2')) ? -2 : -1;
      result.statChanges.push({ stat: 'attack', change: stages, target: 'enemy' });
    }
    if (e.includes('defense') && e.includes('lower') && !e.includes('special')) {
      const stages = (e.includes('two') || e.includes('2')) ? -2 : -1;
      result.statChanges.push({ stat: 'defense', change: stages, target: 'enemy' });
    }
    if (e.includes('speed') && e.includes('lower')) {
      const stages = (e.includes('two') || e.includes('2')) ? -2 : -1;
      result.statChanges.push({ stat: 'speed', change: stages, target: 'enemy' });
    }

    // Buffs no usuario
    if (e.includes('attack') && e.includes('raise') && !e.includes('special')) {
      const stages = (e.includes('two') || e.includes('sharply') || e.includes('by 2')) ? +2 : +1;
      result.statChanges.push({ stat: 'attack', change: stages, target: 'self' });
    }
    if (e.includes('defense') && e.includes('raise') && !e.includes('special')) {
      const stages = (e.includes('two') || e.includes('sharply') || e.includes('by 2')) ? +2 : +1;
      result.statChanges.push({ stat: 'defense', change: stages, target: 'self' });
    }
    if ((e.includes('special attack') && e.includes('raise')) || name === 'growth' || name === 'nasty plot' || name === 'tail glow') {
      const stages = (name === 'nasty plot' || name === 'tail glow') ? +2 : +1;
      result.statChanges.push({ stat: 'spAtk', change: stages, target: 'self' });
    }
    if ((e.includes('special defense') && e.includes('raise')) || name === 'amnesia' || name === 'calm mind') {
      const stages = name === 'amnesia' ? +2 : +1;
      result.statChanges.push({ stat: 'spDef', change: stages, target: 'self' });
    }
    if (e.includes('speed') && e.includes('raise')) {
      const stages = (name === 'agility' || name === 'rock polish' || e.includes('two')) ? +2 : +1;
      result.statChanges.push({ stat: 'speed', change: stages, target: 'self' });
    }

    // Condicoes de status no inimigo
    if (e.includes('sleep') && !e.includes('user') && !name.includes('rest')) {
      result.statusEffect = 'sleep'; result.statusTarget = 'enemy';
    }
    if ((e.includes('poison') && !e.includes('user') && !name.includes('refresh')) ||
        name === 'toxic') {
      result.statusEffect = name === 'toxic' ? 'toxic' : 'poison';
      result.statusTarget = 'enemy';
    }
    if ((e.includes('paralyz') && !e.includes('user'))) {
      result.statusEffect = 'paralyze'; result.statusTarget = 'enemy';
    }
    if (name === 'will-o-wisp' || (e.includes('burn') && !e.includes('user'))) {
      result.statusEffect = 'burn'; result.statusTarget = 'enemy';
    }
    if (e.includes('confuse') && !e.includes('user')) {
      result.statusEffect = 'confuse'; result.statusTarget = 'enemy';
    }

    // Sem efeito em idle
    if (['teleport','roar','whirlwind','splash'].includes(name)) {
      result.noEffect = true;
    }

    return result;
  };

  const calcDamage = useCallback((attacker, move, defender) => {
    if (!attacker || !defender || !move) return 0;
    
    const moveName = move?.name || 'Investida';
    const moveKey = (moveName || '').toLowerCase();
    // Resolve full move data from dataset for accuracy/power reliability
    const moveData = MOVES[moveKey.replace(/ /g, '-')] || move || {};
    
    const power = move.power || moveData.power || 0;
    if (!power) return 0;

    const level = attacker.level || 5;
    const getStatMult = (stage = 0) => (2 + Math.max(0, stage)) / (2 - Math.min(0, stage));

    const isPhysical = (moveData.category || 'Physical') === 'Physical';
    
    const atkBase = isPhysical ? getEffectiveStat(attacker, 'attack') : getEffectiveStat(attacker, 'spAtk');
    const defBase = isPhysical ? getEffectiveStat(defender, 'defense') : getEffectiveStat(defender, 'spDef');
    
    const atkMult = isPhysical ? getStatMult(attacker.stages?.attack) : getStatMult(attacker.stages?.spAtk);
    const defMult = isPhysical ? getStatMult(defender.stages?.defense) : getStatMult(defender.stages?.spDef);

    let atk = atkBase * atkMult;
    // Queimadura: reduz Ataque físico à metade
    if (isPhysical && (attacker.status || []).includes('burn')) atk *= 0.5;
    const def = Math.max(1, defBase * defMult);

    // STAB: verifica tipos primário E secundário do atacante
    const attackerTypes = attacker.types || [attacker.type];
    const stab = attackerTypes.includes(move.type) ? 1.5 : 1.0;
    const effectiveness = getTypeEffectiveness(move.type, defender.type);
    
    if (effectiveness === 0) return 0;

    let base = ((((2 * level) / 5 + 2) * power * (atk / def)) / 50 + 2) * stab * effectiveness;
    if (isNaN(base)) base = 1;
    const roll = 0.85 + Math.random() * 0.15;

    // ── Multiplicador de Clima ────────────────────────────────────────────────
    const currentWeatherMults = WEATHER_TYPE_MULT[weather] || {};
    const weatherMult = currentWeatherMults[move.type] || 1.0;
    base *= weatherMult;
    // ─────────────────────────────────────────────────────────────────────────

    // Efeitos Passivos de Itens de Boss
    if (attacker.isWorldBoss || defender.isWorldBoss) {
      const playerPokemon = attacker.isWorldBoss ? defender : attacker;
      const playerIsAttacker = !attacker.isWorldBoss;
      const heldItem = playerPokemon.heldItem;
      
      // Busca dados extras da receita se disponível para verificar isBossItem
      const itemData = Object.values(CRAFTING_RECIPES).flat().find(r => r.id === heldItem);
      const isBossItem = itemData?.isBossItem || false;

      // Só ativa bônus se for item de boss
      if (isBossItem) {
        if (playerIsAttacker) {
          if (heldItem === 'adrenaline_potion') base *= 1.25;
          if (heldItem === 'penetration_pendant') base *= 1.30;
        } else {
          if (heldItem === 'titan_shield') base *= 0.80;
        }
      }

      if (playerIsAttacker) {
        const psBossBonus = Math.min(2.5, Math.max(0, powerScore || 0) / 200000);
        base *= (1 + psBossBonus);
      }
    }

    // Bônus de tipo por item segurado (apenas para o atacante do jogador)
    const heldItem = attacker.heldItem;
    const TYPE_BOOSTS = {
      charcoal:       ['Fire',     0.20],
      mystic_water:   ['Water',    0.20],
      black_belt:     ['Fighting', 0.20],
      magnet:         ['Electric', 0.20],
      miracle_seed:   ['Grass',    0.20],
      never_melt_ice: ['Ice',      0.20],
      poison_barb:    ['Poison',   0.20],
      soft_sand:      ['Ground',   0.20],
      sharp_beak:     ['Flying',   0.20],
      twisted_spoon:  ['Psychic',  0.20],
      silver_powder:  ['Bug',      0.20],
      hard_stone:     ['Rock',     0.20],
      spell_tag:      ['Ghost',    0.20],
      dragon_fang:    ['Dragon',   0.20],
      black_glasses:  ['Dark',     0.20],
      metal_coat:     ['Steel',    0.20],
      fairy_feather:  ['Fairy',    0.20],
      silk_scarf:     ['Normal',   0.20],
    };
    if (heldItem && TYPE_BOOSTS[heldItem]) {
      const [boostedType, mult] = TYPE_BOOSTS[heldItem];
      if (move.type === boostedType) base *= (1 + mult);
    }
    // Life Orb: +30% dano
    if (heldItem === 'life_orb') base *= 1.30;
    // Expert Belt: +20% se super efetivo
    if (heldItem === 'expert_belt' && effectiveness > 1) base *= 1.20;
    // Quick Claw: +15% dano flat (substitui o "speed priority" que não se aplica a idle)
    if (heldItem === 'quick_claw') base *= 1.15;
    
    // Accuracy System
    const baseAcc = move.accuracy || moveData.accuracy || 100;
    
    // Formula: (3 + stage) / 3 for positive, 3 / (3 + abs(stage)) for negative
    const accStage = attacker.stages?.accuracy || 0;
    const evaStage = defender.stages?.evasion || 0;
    const finalAccStage = Math.max(-6, Math.min(6, accStage - evaStage));
    const accStageMult = finalAccStage >= 0
      ? (3 + finalAccStage) / 3
      : 3 / (3 + Math.abs(finalAccStage));
    
    const hitChance = baseAcc * accStageMult;
    if (Math.random() * 100 > hitChance) return 0; // Miss

    return Math.max(1, Math.ceil(base * roll));
  }, [powerScore]);

  // PROCESSAMENTO DE DROPS
  const processDrops = useCallback((enemy) => {
    const drops = { materials: {}, items: {}, currency: 0 };
    const messages = [];
    const rareDrops = [];

    // Moedas base — reduzido drasticamente para tornar a economia mais desafiadora
    let coinAmount = Math.max(1, Math.floor((enemy.level || 5) * 0.15 * (enemy.isShiny ? 2 : 1)));
    
    // Efeitos especiais de dano
    const now = Date.now();
    const effects = gameState.activeEffects || {};

    // Multiplicador de coins (Amulet Coin + Incenso da Sorte empilham)
    let coinMult = 1.0;
    if (effects.activeAmuletCoin?.endsAt > now) coinMult *= (effects.activeAmuletCoin.coinMult || 2.0);
    if (effects.activeIncenseLuck?.endsAt > now) coinMult *= (effects.activeIncenseLuck.coinMult || 2.0);
    
    // Moeda Amuleto (Antiga Lógica Hold - Mantida para compatibilidade se necessário, mas priorizando timed)
    const activePoke = gameState.team[activeMemberIndex];
    if (activePoke?.heldItem === 'amulet_coin' && !(effects.activeAmuletCoin?.endsAt > now)) {
      coinMult *= 2;
    }

    drops.currency = Math.floor(coinAmount * coinMult);
    messages.push(`💰 +${drops.currency} coins`);

    // CANDY DROP
    const candyId = POKEMON_TO_CANDY[Number(enemy.id)];
    if (candyId) {
       const mastery = (gameState.speciesMastery || {})[Number(enemy.id)] || 0;
       const bonusChance = mastery > 50 ? 0.3 : 0.15;
       if (Math.random() < bonusChance) {
         const qty = 1;
         drops.candies = { [candyId]: qty }; 
         messages.push(`Candy 1x ${CANDY_FAMILIES[candyId].name}`);
       }
    }

    // NOVA LOGICA DE DROPS DO USUARIO
    // 1. Essência por Tipo (60% de chance)
    if (Math.random() < 0.6) {
      const essenceType = `${(enemy.type || 'normal').toLowerCase()}_essence`;
      const essenceData = ITEM_LABELS[essenceType] || { icon: '✨', name: `Essência ${enemy.type}` };
      drops.materials[essenceType] = (drops.materials[essenceType] || 0) + 1;
      messages.push(`${essenceData.icon} 1x ${essenceData.name}`);
    }

    // MATERIAL FÍSICO BASEADO NO TIPO — funciona em todas as regiões (20% de chance)
    const TYPE_MATERIAL_MAP = {
      Rock:     'iron_ore',
      Steel:    'iron_ore',
      Bug:      'silk',
      Flying:   'feather',
      Fairy:    'pink_dust',
      Ghost:    'mystic_dust',
      Psychic:  'mystic_dust',
      Dragon:   'dragon_scale',
      Normal:   'apricorn',
      Grass:    'apricorn',
      Ice:      'ice_crystal',
      Ground:   'iron_ore',
      Fighting: 'armor_fragment',
      Dark:     'mystic_dust',
      Poison:   'poison_barb',
      Fire:     'ember_shard',
      Electric: 'electric_chip',
      Water:    'wave_stone',
    };
    const physicalMaterial = TYPE_MATERIAL_MAP[enemy.type];
    if (physicalMaterial && Math.random() < 0.20) {
      drops.materials[physicalMaterial] = (drops.materials[physicalMaterial] || 0) + 1;
      const matLabel = ITEM_LABELS[physicalMaterial] || { icon: '📦', name: physicalMaterial.replace(/_/g, ' ') };
      messages.push(`${matLabel.icon} 1x ${matLabel.name}`);
    }

    // 2. Mystic Dust para Shinies (100% se for shiny)
    if (enemy.isShiny) {
      drops.materials.mystic_dust = (drops.materials.mystic_dust || 0) + 5;
      messages.push(`5x Po Mistico`);
    }

    // Drops antigos (suporte para itens específicos de rota/pokemon)
    const evolutionFragment = EVOLUTION_FRAGMENT_DROPS[Number(enemy.id)];
    if (evolutionFragment && Math.random() < (enemy.isShiny ? 0.30 : 0.12)) {
      const qty = enemy.isWildBoss ? 2 : 1;
      const fragmentData = ITEM_LABELS[evolutionFragment] || { icon: '*', name: evolutionFragment };
      drops.materials[evolutionFragment] = (drops.materials[evolutionFragment] || 0) + qty;
      messages.push(`${fragmentData.icon} ${qty}x ${fragmentData.name}`);
    }

    // Global Pokémon-specific material drops based on FORGE_MATERIAL_DROP_GUIDE
    Object.entries(FORGE_MATERIAL_DROP_GUIDE).forEach(([matId, guide]) => {
      if (guide.requiredRegion && gameState.activeRegion !== guide.requiredRegion) return;
      if (guide.requiredFlag && !(gameState.worldFlags || []).includes(guide.requiredFlag)) return;
      if (guide.pokemonIds && guide.pokemonIds.includes(Number(enemy.id))) {
        const dropChance = enemy.isShiny ? 0.35 : 0.12;
        if (Math.random() < dropChance) {
          const qty = enemy.isShiny ? 2 : 1;
          drops.materials[matId] = (drops.materials[matId] || 0) + qty;
          const dropData = ITEM_LABELS[matId] || { icon: '📦', name: matId.replace(/_/g, ' ') };
          messages.push(`Drop: ${qty}x ${dropData.name}`);
        }
      }
    });

    // MEGA STONE SHARDS - KALOS ONLY + MEGA SPECIES
    if (gameState.activeRegion === 'kalos' && (gameState.worldFlags || []).includes('mega_evolution_unlocked') && MEGA_CAPABLE_SPECIES.includes(Number(enemy.id))) {
      const megaChance = enemy.isShiny ? 0.40 : 0.15;
      if (Math.random() < megaChance) {
        const qty = enemy.isWildBoss ? 2 : 1;
        drops.materials.mega_stone_shard = (drops.materials.mega_stone_shard || 0) + qty;
        messages.push(`Mega: ${qty}x Fragmento de Mega Pedra`);
        rareDrops.push({
          type: 'mega',
          name: `${qty}x Fragmento de Mega Pedra`,
          icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png',
          description: 'Fragmento usado nas forjas de Mega Pedra liberadas em Kalos.',
          meta: `${enemy.name || POKEDEX[Number(enemy.id)]?.name || 'Pokemon'} - Nv.${enemy.level || '?'}`,
        });
      }
    }

    const recipeDrops = FORGE_RECIPE_DROP_BY_POKEMON[Number(enemy.id)];
    const recipeDropList = Array.isArray(recipeDrops) ? recipeDrops : (recipeDrops ? [recipeDrops] : []);
    const foundRecipes = [];
    if (recipeDropList.length) {
      // Taxa maior nas rotas iniciais (level baixo) para facilitar a progressão
      const isEarlyGame = (enemy.level || 1) <= 20;
      const baseRate = isEarlyGame ? 0.09 : 0.05;
      const dropRate = enemy.isShiny ? 0.25 : baseRate;
      if (Math.random() < dropRate) {
        // Filtra receitas já descobertas para não duplicar
        const undiscovered = recipeDropList.filter(r => {
          if (gameState.inventory?.materials?.[r] > 0) return false;
          const recipeId = String(r).replace('recipe_', '');
          const guide = FORGE_RECIPE_DROP_GUIDE[recipeId];
          if (guide?.requiredRegion && gameState.activeRegion !== guide.requiredRegion) return false;
          if (guide?.requiredFlag && !(gameState.worldFlags || []).includes(guide.requiredFlag)) return false;
          return true;
        });
        if (undiscovered.length > 0) {
          const recipeDrop = undiscovered[Math.floor(Math.random() * undiscovered.length)];
          drops.materials[recipeDrop] = (drops.materials[recipeDrop] || 0) + 1;
          const cleanName = recipeDrop.replace('recipe_', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          messages.push(`📜 Receita: ${cleanName}`);
          // Localiza dados completos da receita para o modal
          const recipeId = recipeDrop.replace('recipe_', '');
          const allRecipesList = Object.values(CRAFTING_RECIPES).flat();
          const recipeData = allRecipesList.find(r => r.id === recipeId);
          if (recipeData) foundRecipes.push({ ...recipeData, isNew: true, sourcePokemon: enemy.name || POKEDEX[Number(enemy.id)]?.name });
        }
      }
    }

    const trainerCardMaterialByPokemon = {
      10: 'trainer_card_thread', 11: 'trainer_card_thread', 12: 'trainer_card_thread',
      13: 'trainer_card_thread', 14: 'trainer_card_thread', 15: 'trainer_card_thread',
      25: 'yellow_shard', 26: 'yellow_shard', 81: 'yellow_shard', 82: 'yellow_shard',
      92: 'mystic_dust', 93: 'mystic_dust', 94: 'mystic_dust',
      133: 'trainer_card_thread', 196: 'trainer_card_thread', 197: 'trainer_card_thread',
      447: 'trainer_card_thread', 448: 'trainer_card_thread',
    };
    const cardMaterialDrop = trainerCardMaterialByPokemon[Number(enemy.id)];
    if (cardMaterialDrop && Math.random() < (enemy.isShiny ? 0.35 : 0.12)) {
      const qty = enemy.isShiny ? 2 : 1;
      drops.materials[cardMaterialDrop] = (drops.materials[cardMaterialDrop] || 0) + qty;
      messages.push(`Card: ${qty}x ${cardMaterialDrop.replace(/_/g, ' ')}`);
    }

    const baseDropChance = enemy.dropChance || 0.12;
    if (enemy.drop && Math.random() < (enemy.isShiny ? baseDropChance * 3 : baseDropChance)) {
      // Aqui determinamos se o drop antigo é material ou item (maioria é material)
      const materialList = [
        'iron_ore', 'apricorn', 'electric_chip', 'moon_stone_shard', 'pink_dust', 'gold_nugget', 'silk', 'feather',
        'fire_stone_shard', 'water_stone_shard', 'leaf_stone_shard', 'thunder_stone_shard', 'link_cable_part',
        'sun_stone_shard', 'shiny_stone_shard', 'dusk_stone_shard', 'dawn_stone_shard', 'ice_stone_shard',
        'trainer_card_thread', 'yellow_shard', 'mystic_dust', 'armor_fragment', 'fury_essence', 'stardust',
        'dragon_scale', 'rock_essence', 'ground_essence', 'dark_essence', 'steel_essence', 'fairy_essence',
        'sharp_claw', 'scale_dust', 'ember_shard', 'thunder_fang', 'ice_crystal', 'poison_barb', 'hard_shell',
        'spirit_dust', 'dragon_fang', 'aura_fragment', 'leaf_debris', 'wave_stone'
      ];
      const dropData = ITEM_LABELS[enemy.drop] || { icon: '📦', name: enemy.drop.toUpperCase() };
      if (materialList.includes(enemy.drop)) {
        drops.materials[enemy.drop] = (drops.materials[enemy.drop] || 0) + 1;
      } else {
        drops.items[enemy.drop] = (drops.items[enemy.drop] || 0) + 1;
      }
      messages.push(`${dropData.icon} 1x ${dropData.name}`);
      if (enemy.rarity === 'rare' || enemy.rarity === 'super_rare' || baseDropChance <= 0.08) {
        rareDrops.push({
          type: 'rare',
          name: `1x ${dropData.name}`,
          icon: typeof dropData.icon === 'string' && dropData.icon.startsWith('http') ? dropData.icon : undefined,
          description: 'Item raro de rota. Guarde para receitas de forja, evolucao ou personalizacao.',
          meta: `${enemy.name || POKEDEX[Number(enemy.id)]?.name || 'Pokemon'} - Nv.${enemy.level || '?'}`,
        });
      }
    }

    // 4. Rare Poké Ball Drop Chance. Mart prices push players toward the Forge.
    if (Math.random() < 0.025) {
      drops.items.pokeballs = (drops.items.pokeballs || 0) + 1;
      messages.push(`+1 Poke Bola`);
    }

    return { drops, messages, foundRecipes, rareDrops };
  }, [gameState, activeMemberIndex]);

  // SPAWN
  const handleAcceptQuest = useCallback((quest) => {
    setGameState(prev => ({
      ...prev,
      activeQuest: quest,
      lastQuestTime: Date.now()
    }));
    setPendingQuest(null);
    addLog(`Missao Aceita: ${quest.title}`, 'system');
  }, [addLog]);

  const handleDeclineQuest = useCallback(() => {
    setPendingQuest(null);
  }, []);

  // PROTECTED: spawnEnemy - NAO EDITAR SEM AUTORIZACAO EXPLICITA
  const spawnEnemy = useCallback(() => {
    isProcessingVictory.current = false; // Reset de segurança
    const route = processedRoutes[gameState.currentRoute] || processedRoutes.pallet_town;
    
    // Identificar IDs evoluídos (para filtrar rotas iniciais)
    const evolvedIds = new Set();
    Object.values(POKEDEX).forEach(p => {
      if (!p.evolution) return;
      const evos = Array.isArray(p.evolution) ? p.evolution : [p.evolution];
      evos.forEach(e => { if (e?.id) evolvedIds.add(Number(e.id)); });
    });

    // Chance de encontrar um treinador NPC (~3% por padrão, configurável por rota)
    const trainerChance = route.trainerChance || 0.03;
    const hasTrainers = route.trainers && route.trainers.length > 0;

    // EMBOSCADA VILA
    if (Math.random() < 0.01 && route.type === 'farm') {
      const teamKeys = Object.keys(VILLAIN_TEAMS);
      // Filtra por bioma se aplicável
      const possibleTeams = teamKeys.filter(k => !VILLAIN_TEAMS[k].biome || VILLAIN_TEAMS[k].biome === route.biome);
      const chosenKey = possibleTeams[Math.floor(Math.random() * possibleTeams.length)] || 'rocket';
      const teamData = VILLAIN_TEAMS[chosenKey];
      
      const pokeId = teamData.pokemonPool[Math.floor(Math.random() * teamData.pokemonPool.length)];
      const base = POKEDEX[pokeId] || POKEDEX[19];
      const level = Math.max(1, (route.enemies?.[0]?.level || 5) + 2);
      const reason = teamData.reasons[Math.floor(Math.random() * teamData.reasons.length)];

      const lvl = Math.max(1, (route.enemies?.[0]?.level || 5) + 2);
      const baseMult = 1.1; // Viloes sao um pouco mais perigosos
      
      const calcHP = (b, l) => Math.ceil((((2 * (b || 50) * l) / 100) + l + 10) * baseMult);
      const calcStat = (b, l) => Math.ceil((((2 * (b || 10) * l) / 100) + 5) * baseMult);

      const maxHp = calcHP(base.maxHp || base.hp, lvl);

      setCurrentEnemy({
        ...base, id: Number(base.id),
        level: lvl, 
        hp: maxHp, maxHp,
        attack: calcStat(base.attack, lvl),
        defense: calcStat(base.defense, lvl),
        spAtk: calcStat(base.spAtk, lvl),
        spDef: calcStat(base.spDef, lvl),
        speed: calcStat(base.speed, lvl),
        isShiny: false, status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
        isTrainer: true,
        trainerName: teamData.gruntName,
        trainerSprite: teamData.sprite,
        trainerReward: Math.floor(150 * teamData.rewardMult),
        isVillainAmbush: true,
        villainColor: teamData.color,
        instanceId: Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      });
      addLog(`⚠️ EMBOSCADA! ${teamData.name} ${reason}`, 'enemy');
      return;
    }

    // Chance de encontrar um treinador reduzida (favorecendo pokemons selvagens)
    const effectiveTrainerChance = Math.min(0.015, trainerChance); 
    if (hasTrainers && Math.random() < effectiveTrainerChance) {
      const trainer = route.trainers[Math.floor(Math.random() * route.trainers.length)];
      const trainerPokeRef = trainer.team[0] || { id: 19, level: 5 };
      const trainerPoke = trainerPokeRef.learnset
        ? trainerPokeRef
        : { 
            ...(POKEDEX[Number(trainerPokeRef.id)] || POKEDEX[String(trainerPokeRef.id)] || {}), 
            id: Number(trainerPokeRef.id),
            level: trainerPokeRef.level || 5 
          };
      
      const lvl = trainerPoke.level || 5;
      const baseMult = 1.05; // Treinadores comuns sao levemente mais fortes que selvagens
      
      const calcHP = (b, l) => Math.ceil((((2 * (b || 50) * l) / 100) + l + 10) * baseMult);
      const calcStat = (b, l) => Math.ceil((((2 * (b || 10) * l) / 100) + 5) * baseMult);

      const maxHp = calcHP(trainerPoke.maxHp || trainerPoke.hp, lvl);
      
      setCurrentEnemy({
        ...trainerPoke,
        name: trainerPoke.name || 'PokÒ©mon',
        pokemonName: trainerPoke.name,
        level: lvl,
        hp: maxHp, maxHp,
        attack: calcStat(trainerPoke.attack, lvl),
        defense: calcStat(trainerPoke.defense, lvl),
        spAtk: calcStat(trainerPoke.spAtk, lvl),
        spDef: calcStat(trainerPoke.spDef, lvl),
        speed: calcStat(trainerPoke.speed, lvl),
        isShiny: false, status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
        isTrainer: true,
        trainerName: trainer.name,
        trainerSprite: trainer.sprite,
        trainerReward: trainer.reward || 100,
        isRocket: trainer.isRocket || false,
        spawnTime: Date.now(),
        opponentTeam: trainer.team || [trainerPokeRef],
        opponentTeamIndex: 0,
        instanceId: Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      });
      setBattleLog([]);
      isProcessingVictory.current = false;
      addLog(`⚔️ ${trainer.name} quer batalhar!`, 'system');
      return;
    }

    if (!route.enemies || route.enemies.length === 0) {
      // Nao seta null - apenas sai sem fazer nada para evitar loop infinito em cidades
      isProcessingVictory.current = false;
      return;
    }
    
    let enemyPool = [...route.enemies];
    
    // ── 2. FILTRO DE LENDÁRIOS / MÍTICOS ──
    const LEGENDARY_IDS = new Set([
      144, 145, 146, 150, 151, // Gen 1
      243, 244, 245, 249, 250, 251, // Gen 2
      377, 378, 379, 380, 381, 382, 383, 384, 385, 386, // Gen 3
      480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, // Gen 4
      494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, // Gen 5
      716, 717, 718, 719, 720, 721, // Gen 6
      772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, // Gen 7
      888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905, // Gen 8
      1001, 1002, 1003, 1004, 1007, 1008, 1010, 1024 // Gen 9
    ]);
    // Lendários com boss real no modo VS — exigem flag _defeated para spawnar na rota
    const LEGENDARY_BOSS_IDS = new Set([
      144, 145, 146, 150,           // Kanto: Articuno, Zapdos, Moltres, Mewtwo
      243, 244, 245, 249, 250, 251, // Johto: Raikou, Entei, Suicune, Lugia, Ho-Oh, Celebi
      384,                          // Hoenn: Rayquaza
    ]);
    const todayStr = new Date().toISOString().split('T')[0];
    const currentFlagsForLegendary = gameState.worldFlags || [];

    enemyPool = enemyPool.filter(e => {
      const id = Number(e.id);
      if (LEGENDARY_IDS.has(id)) {
        // 1. Lendários com boss no VS exigem flag de derrota; sem boss são gatados apenas por raridade
        if (LEGENDARY_BOSS_IDS.has(id)) {
          const baseData = POKEDEX[id];
          const pokemonName = baseData?.name?.toLowerCase().replace(/ /g, '_').replace(/-/g, '_') || '';
          const defeatFlag = `${pokemonName}_defeated`;
          if (!currentFlagsForLegendary.includes(defeatFlag)) return false;
        }
        // 2. Raridade extrema (0.05%) — válido para todos os lendários
        if (Math.random() > 0.0005) return false;
        // 3. Limite diário (1 por dia por espécie)
        if (gameState.lastLegendarySpawns?.[id] === todayStr) return false;
      }
      return true;
    });

    // Fix: pool vazio após filtro de lendários — evita fallback Pidgey em rotas sem inimigos válidos
    if (enemyPool.length === 0) {
      const nonLegendaryFallback = route.enemies.filter(e => !LEGENDARY_IDS.has(Number(e.id)));
      if (nonLegendaryFallback.length > 0) {
        enemyPool = nonLegendaryFallback;
      } else {
        // Rota contém apenas lendários ainda bloqueados — aguarda desbloqueio via boss VS
        isProcessingVictory.current = false;
        return;
      }
    }

    // ── 2.3 FILTRO requiresFlag — Pokémon com gate por progresso (ex: iniciais pós-rival) ──
    const currentFlags = gameState.worldFlags || [];
    enemyPool = enemyPool.filter(e => !e.requiresFlag || currentFlags.includes(e.requiresFlag));

    // ── 2.5 FILTRO DE EVOLUÍDOS (Rotas Iniciais) ──
    // forceSpawn: true permite exceções canônicas (ex: Pikachu em Viridian Forest)
    const avgLevel = route.enemies?.[0]?.level || 5;
    if (avgLevel <= 15 && enemyPool.length > 1) {
      const filteredPool = enemyPool.filter(e => e.forceSpawn || !evolvedIds.has(Number(e.id)));
      if (filteredPool.length > 0) enemyPool = filteredPool;
    }
    
    // Bônus de Horário
    const currentTime = getTimeOfDay();
    const timeConfig = TIME_CONFIG[currentTime];
    
    enemyPool = getTimeAdjustedEnemyPool({ ...route, enemies: enemyPool }, currentTime, POKEDEX);
    
    // 3. VARAS DE PESCA (Fishing Rods)
    if (route.biome === 'water' || route.name.toLowerCase().includes('oceano') || route.name.toLowerCase().includes('praia')) {
      const rods = ['super_rod', 'good_rod', 'old_rod'];
      const ownedRod = rods.find(r => (gameState.inventory?.items?.[r] || 0) > 0);
      if (ownedRod) {
        const rodData = CRAFTING_RECIPES.fishing_rods.find(r => r.id === ownedRod);
        const waterBonus = rodData?.effect?.waterBonus || 0;
        const waterEnemies = enemyPool.filter(e => {
          const p = POKEDEX[e.id];
          return p?.type === 'Water' || p?.types?.includes('Water');
        });
        if (waterEnemies.length > 0) {
          const extraCount = Math.floor(enemyPool.length * waterBonus);
          for (let i = 0; i < extraCount; i++) {
            enemyPool.push(waterEnemies[Math.floor(Math.random() * waterEnemies.length)]);
          }
        }
      }
    }
    
    const baseRef = pickWeightedEncounter(enemyPool, POKEDEX) || { id: 16, level: 3 };

    // Se for um lendário, registra o spawn do dia
    if (LEGENDARY_IDS.has(Number(baseRef.id))) {
      setGameState(prev => ({
        ...prev,
        lastLegendarySpawns: {
          ...(prev.lastLegendarySpawns || {}),
          [Number(baseRef.id)]: todayStr
        }
      }));
    }

    // Resolve dados completos do Pokédex
    const base = baseRef.learnset
      ? baseRef
      : { 
          ...(POKEDEX[Number(baseRef.id)] || POKEDEX[String(baseRef.id)] || {}), 
          id: Number(baseRef.id || 16),
          level: baseRef.level || 5,
          name: (POKEDEX[Number(baseRef.id)] || POKEDEX[String(baseRef.id)])?.name || baseRef.name || 'Pokémon Selvagem'
        };
    
    // ⚔️ CHANCE ALEATÓRIA DE RAID (0.5% por encontro em rotas)
    const isRaidBusyNow = gameState.activeRaid && gameState.activeRaid.phase !== 'ended';
    if (!isRaidBusyNow && Math.random() < 0.005) {
      const region = gameState.activeRegion || 'kanto';
      const badgeCount = getRegionBadgeCount(gameState.badges || [], region);
      const raid = createRaid(region, POKEDEX, badgeCount);
      if (raid) {
        setGameState(prev => ({
          ...prev,
          activeRaid: raid,
          battlesSinceLastRaid: 0,
          playerStats: bumpPlayerStats(prev.playerStats, { raidEncounters: 1 }),
        }));
        localStorage.setItem(RAID_SPAWN_STORAGE_KEY, String(Date.now() + RAID_SPAWN_INTERVAL_MS));
        addLog(`⚔️ UMA RAID SURGIU NA ROTA! ${raid.name} (${raid.stars}⭐) apareceu!`, 'system');
      }
    }

    // Sistema de Maestria: Chance de Shiny
    const pokeId = Number(base.id);
    const masteryCount = (gameState.speciesMastery || {})[pokeId] || (gameState.speciesMastery || {})[base.id] || 0;
    
    // ⛏️ PROTECTED: Spawn Rates — base 1/4000, reduz com maestria
    const shinyRateDivisor = masteryCount >= 200 ? 1000 : masteryCount >= 100 ? 2000 : 4000;
    const isShiny = Math.floor(Math.random() * shinyRateDivisor) === 0;
    const isBossSpawn = !isShiny && Math.floor(Math.random() * 500) === 0; // Boss (não capturável)
    const isStarterSpawn = !isShiny && !isBossSpawn && Math.floor(Math.random() * 2048) === 0; // Starter raro

    let finalBase = { ...base };
    if (isStarterSpawn) {
      const starterIds = [1, 4, 7];
      const randomStarterId = starterIds[Math.floor(Math.random() * starterIds.length)];
      const starterBase = POKEDEX[randomStarterId];
      if (starterBase) {
        finalBase = { ...starterBase, id: randomStarterId, level: base.level || 5 };
        addLog(`✨ Um raro ${starterBase.name} apareceu!`, 'system');
      }
    }

    const levelVariance = Math.floor(Math.random() * 3) - 1;
    let level = Math.max(1, (finalBase.level || 5) + levelVariance);
    
    // Bônus Shiny: 20% mais forte
    let statMult = isShiny ? 1.2 : 1.0;

    // Bônus Boss: 50% mais forte e +5 níveis
    if (isBossSpawn) {
      level += 5;
      statMult *= 1.5;
    }

    // REPEL
    const effects = gameState.activeEffects || {};
    const now = Date.now();
    let repelMult = 1.0;
    if (effects.activeRepel?.endsAt > now) {
      repelMult = effects.activeRepel.hpMult || 0.8;
    }

    const maxHp = Math.ceil((((2 * (finalBase.maxHp || finalBase.hp || 30) * level) / 100) + level + 10) * statMult * repelMult);
    
    // Seleção de Golpes baseada no Learnset
    const learnset = finalBase.learnset || [];
    const availableMoves = learnset
      .filter(m => m.level <= level)
      .map(m => {
        const moveKey = (m.move || '').toLowerCase();
        const moveData = MOVES[moveKey] || { name: m.move || 'Investida', power: 40, type: 'Normal', category: 'Physical' };
        return {
          ...moveData,
          name: MOVE_TRANSLATIONS[moveKey] || moveData.name || m.move,
          power: moveData.power || 0,
          type: moveData.type || 'Normal',
          category: moveData.category || 'Physical'
        };
      });

    // Se não tiver golpes, dá pelo menos Investida (Tackle)
    const finalMoves = availableMoves.length > 0 ? availableMoves.slice(-4) : [{ name: 'Investida', power: 40, type: 'Normal', category: 'Physical' }];

    // Atk Mult do Repel
    const atkRepelMult = (effects.activeRepel?.endsAt > now) ? (effects.activeRepel.atkMult || 0.8) : 1.0;

    // Backgrounds para Lendários
    const legendaryBgs = {
      144: fixPath('/bg_seafoam.webp'),
      145: fixPath('/bg_power_plant.webp'),
      146: fixPath('/bg_gym_1776863824590.webp'),
      150: fixPath('/bg_cave_1776863810604.webp'),
      243: fixPath('/bg_burned_tower.webp'),
      244: fixPath('/bg_burned_tower.webp'),
      245: fixPath('/bg_lake_of_rage.webp'),
      249: fixPath('/bg_whirl_islands.webp'),
      250: fixPath('/bg_tin_tower.webp'),
      251: fixPath('/bg_ilex_forest.webp')
    };
    const specialBg = legendaryBgs[Number(finalBase.id)] || null;

    setCurrentEnemy({ 
      ...finalBase, 
      id: Number(finalBase.id),
      level, 
      maxHp, 
      hp: maxHp, 
      isShiny, 
      isWildBoss: isBossSpawn,
      spawnTime: Date.now(),
      status: [],
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
      attack: Math.ceil((((2 * (finalBase.attack || 10) * level) / 100) + 5) * statMult * atkRepelMult),
      defense: Math.ceil((((2 * (finalBase.defense || 10) * level) / 100) + 5) * statMult),
      spAtk: Math.ceil((((2 * (finalBase.spAtk || 10) * level) / 100) + 5) * statMult * atkRepelMult),
      spDef: Math.ceil((((2 * (finalBase.spDef || 10) * level) / 100) + 5) * statMult),
      speed: Math.ceil((((2 * (finalBase.speed || 10) * level) / 100) + 5) * statMult),
      instanceId: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      moves: finalMoves,
      background: specialBg,
      locationName: isBossSpawn ? `Chefe: ${route.name}` : null
    });
    setBattleLog([]);
    isProcessingVictory.current = false;
    if (isBossSpawn) {
      setGameState(prev => ({
        ...prev,
        playerStats: bumpPlayerStats(prev.playerStats, { wildBossEncounters: 1 }),
      }));
    }
    // BGM agora gerenciado pelas configuraçííµes
  }, [gameState.currentRoute, gameState.worldFlags, gameState.speciesMastery, playBGM, addLog, processedRoutes]);

  useEffect(() => {
    if (currentView !== 'battles') return;
    const route = processedRoutes[gameState.currentRoute];
    const hasEnemies = route?.enemies?.length > 0 || route?.trainers?.length > 0;
    
    // As batalhas agora continuam mesmo se estiver em outras telas (management),
    // mas param se estiver na Cidade (City) ou em algum modal de construção.
    const viewsAllowingBattle = ['battles', 'pokemon_management', 'pokedex', 'menu', 'vs'];
    const isPaused = activeBuildingModal !== null;

    if (viewsAllowingBattle.includes(currentView) && !isPaused && hasEnemies && (!currentEnemy || currentEnemy.hp <= 0)) {
      const delay = !currentEnemy ? 50 : 800;
      const timer = setTimeout(() => {
        const routeNow = processedRoutes[gameState.currentRoute];
        const hasEnemiesNow = routeNow?.enemies?.length > 0 || routeNow?.trainers?.length > 0;
        if (viewsAllowingBattle.includes(currentView) && !isPaused && hasEnemiesNow && (!currentEnemy || currentEnemy.hp <= 0)) {
          spawnEnemy();
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentView, currentEnemy?.id, currentEnemy?.hp, spawnEnemy, gameState.currentRoute, processedRoutes, activeBuildingModal]);

  // Ref para currentView - permite que handleBattleTick leia o valor atual
  // sem precisar estar nas deps do useCallback (o que recriaria o timer a cada mudança de view)
  useEffect(() => { 
    currentViewRef.current = currentView;
    if (currentView !== 'menu') lastNonMenuView.current = currentView;

    // Trigger de Missão Aleatória ao entrar em rota
    if (currentView === 'battles' && gameState.currentRoute) {
      const route = processedRoutes[gameState.currentRoute];
      if (route?.type === 'farm') {
        const quest = getAvailableQuest(gameState, gameState.currentRoute, gameState.lastQuestTime);
        if (quest) {
          notify({ type: 'quest', title: 'Nova missão!', message: quest.title });
          setTimeout(() => setPendingQuest(quest), 3000);
        }
      }
    }
  }, [currentView, gameState.currentRoute, gameState.lastQuestTime, processedRoutes]);

  // useEffect para notificaçíµes de plantação
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const slots = gameState.house?.slots || [];
      slots.forEach((slot, i) => {
        if (slot && now >= slot.plantedAt + slot.growthTime) {
          const plant = PLANTABLE_ITEMS[slot.plantId];
          if (plant && !slot.notified) {
            notify({ type: 'harvest', title: 'Plantação pronta!', message: `${plant.name} está pronta para colher!` });
            setGameState(prev => {
              const newSlots = [...(prev.house?.slots || [])];
              if (newSlots[i]) newSlots[i] = { ...newSlots[i], notified: true };
              return { ...prev, house: { ...prev.house, slots: newSlots } };
            });
          }
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [gameState.house?.slots]);

  useEffect(() => {
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Delay antes de iniciar golpes contra treinador
  useEffect(() => {
    if (!currentEnemy) {
      setBattleReady(false);
      return;
    }
    // Treinador: aguardar 2800ms (tempo da intro)
    // Inimigo normal: 0ms delay
    const delay = currentEnemy.isTrainer ? 2800 : 0;
    const t = setTimeout(() => setBattleReady(true), delay);
    return () => clearTimeout(t);
  }, [currentEnemy?.instanceId]);

  // Cronômetro do Boss (Enrage Timer)
  useEffect(() => {
    let timer;
    if (bossTimer !== null && bossTimer > 0 && currentView === 'battles' && currentEnemy?.isWorldBoss) {
      timer = setInterval(() => {
        setBossTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleBossTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [bossTimer, currentView, currentEnemy?.isWorldBoss]);

  // ── RAID: Spawn Timer ─────────────────────────────────────────────────────
  useEffect(() => {
    // Inicializa o timer na primeira execução
    const stored = localStorage.getItem(RAID_SPAWN_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(RAID_SPAWN_STORAGE_KEY, String(Date.now() + RAID_SPAWN_INTERVAL_MS));
    }

    const checkSpawn = () => {
      const region = gameState.activeRegion || 'kanto';
      const nextAt = parseInt(localStorage.getItem(RAID_SPAWN_STORAGE_KEY) || '0', 10);
      const isRaidBusy = gameState.activeRaid && gameState.activeRaid.phase !== 'ended';
      if (!isRaidBusy && Date.now() >= nextAt) {
        const badgeCount = getRegionBadgeCount(gameState.badges || [], region);
        const raid = createRaid(region, POKEDEX, badgeCount);
        if (raid) {
          setGameState(prev => ({
            ...prev,
            activeRaid: raid,
            battlesSinceLastRaid: 0,
            playerStats: bumpPlayerStats(prev.playerStats, { raidEncounters: 1 }),
          }));
          localStorage.setItem(RAID_SPAWN_STORAGE_KEY, String(Date.now() + RAID_SPAWN_INTERVAL_MS));
          addLog(`⚔️ RAID APARECEU! ${raid.name} (${raid.stars}⭐) está na área! [${region.toUpperCase()}]`, 'system');
        }
      }
    };
    checkSpawn();
    const id = setInterval(checkSpawn, 30_000);
    return () => clearInterval(id);
  }, [gameState.activeRaid, gameState.activeRegion]);

  // ── RAID: Expiration ──────────────────────────────────────────────────────
  useEffect(() => {
    const raid = gameState.activeRaid;
    if (!raid || raid.phase === 'ended' || raid.phase === 'rewards') return;
    const remaining = raid.expiresAt - Date.now();
    if (remaining <= 0) {
      showRaidRouteNotice(raid, 'expired');
      setGameState(prev => ({
        ...prev,
        activeRaid: prev.activeRaid ? { ...prev.activeRaid, phase: 'ended' } : null,
        raidStats: { ...(prev.raidStats || {}), fled: (prev.raidStats?.fled || 0) + 1 },
        playerStats: bumpPlayerStats(prev.playerStats, { raidsFled: 1 }),
      }));
      return;
    }
    const t = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        activeRaid: prev.activeRaid ? { ...prev.activeRaid, phase: 'ended' } : null,
        raidStats: { ...(prev.raidStats || {}), fled: (prev.raidStats?.fled || 0) + 1 },
        playerStats: bumpPlayerStats(prev.playerStats, { raidsFled: 1 }),
      }));
      addLog(`⌛ A raid expirou! ${raid.name} fugiu...`, 'system');
      showRaidRouteNotice(raid, 'expired');
    }, remaining);
    return () => clearTimeout(t);
  }, [gameState.activeRaid?.id, gameState.activeRaid?.phase, showRaidRouteNotice]);

  // ── RAID: Fight Timer ─────────────────────────────────────────────────────
  useEffect(() => {
    const raid = gameState.activeRaid;
    if (!raid || raid.phase !== 'fighting' || !raid.fightEndsAt) return;
    const remaining = raid.fightEndsAt - Date.now();
    
    const handleTimeout = () => {
      setGameState(prev => {
        const r = prev.activeRaid;
        if (!r || r.phase !== 'fighting') return prev;
        const hpPct = r.currentHp / r.maxHp;
        // Se o jogador optou por continuar lutando após a fase de captura,
        // o tempo esgotado encerra a raid sem oferecer captura novamente.
        let nextPhase;
        if (r.continuingFromCapture) {
          nextPhase = 'ended';
          addLog(`⌛ Tempo esgotado! ${r.name} resistiu e escapou — você não conseguiu derrotá-lo.`, 'enemy');
          showRaidRouteNotice(r, 'failed');
        } else if (hpPct <= 0.3) {
          nextPhase = 'capture';
          showRaidRouteNotice(r, 'capture');
        } else {
          nextPhase = 'ended';
          addLog(`⌛ Tempo esgotado! ${r.name} fugiu antes de ser enfraquecido o suficiente.`, 'enemy');
          showRaidRouteNotice(r, 'failed');
        }
        return {
          ...prev,
          activeRaid: { ...r, phase: nextPhase }
        };
      });
    };

    if (remaining <= 0) {
      handleTimeout();
      return;
    }
    const t = setTimeout(handleTimeout, remaining);
    return () => clearTimeout(t);
  }, [gameState.activeRaid?.phase, gameState.activeRaid?.fightEndsAt, addLog, showRaidRouteNotice]);

  const calculateBossLoot = useCallback((damage) => {
    const loot = { coins: Math.floor(damage / 5), materials: {} };
    if (damage >= 40000) {
      loot.materials.stardust = 1 + Math.floor(Math.random() * 2);
      loot.materials.dragon_scale = 1;
      if (Math.random() > 0.5) loot.materials.fury_essence = 2;
    } else if (damage >= 25000) {
      loot.materials.fury_essence = 1 + Math.floor(Math.random() * 2);
      if (Math.random() > 0.6) loot.materials.stardust = 1;
    } else if (damage >= 10000) {
      loot.materials.armor_fragment = 1 + Math.floor(Math.random() * 2);
      if (Math.random() > 0.7) loot.materials.fury_essence = 1;
    } else if (damage >= 2000) {
      if (Math.random() > 0.5) loot.materials.armor_fragment = 1;
    }
    return loot;
  }, []);

  const handleBossTimeOut = useCallback(() => {
    addLog(`🛑 TEMPO ESGOTADO! O Boss fugiu para outra dimensão!`, 'system');
    
    // Calcular e aplicar loot
    const loot = calculateBossLoot(bossDamage);
    setBossLoot(loot);

    setGameState(prev => {
      const newMaterials = { ...prev.inventory.materials };
      Object.entries(loot.materials).forEach(([mat, qty]) => {
        newMaterials[mat] = (newMaterials[mat] || 0) + qty;
      });
      return {
        ...prev,
        currency: prev.currency + loot.coins,
        inventory: {
          ...prev.inventory,
          materials: newMaterials
        }
      };
    });

    if (bossSaveTimeoutRef.current) clearTimeout(bossSaveTimeoutRef.current);
    saveBossDamage(bossDamage);
    
    // O modal de loot segurará a saída da batalha
  }, [bossDamage, saveBossDamage, calculateBossLoot]);

  // ── RAID Handlers ─────────────────────────────────────────────────────────
  const handleStartRaid = useCallback(() => {
    setGameState(prev => {
      if (!prev.activeRaid || prev.activeRaid.phase !== 'idle') return prev;
      const now = Date.now();
      const base = POKEDEX[prev.activeRaid.pokemonId] || {};
      const balancedMaxHp = calculateRaidMaxHp(base, prev.activeRaid.level, prev.activeRaid.stars);
      const shouldRebalance = prev.activeRaid.balanceVersion !== RAID_BALANCE_VERSION && balancedMaxHp > 0;
      const hpRatio = prev.activeRaid.maxHp > 0 ? prev.activeRaid.currentHp / prev.activeRaid.maxHp : 1;
      const currentHp = shouldRebalance
        ? Math.max(1, Math.ceil(balancedMaxHp * Math.min(1, hpRatio)))
        : prev.activeRaid.currentHp;
      return {
        ...prev,
        activeRaid: {
          ...prev.activeRaid,
          phase: 'fighting',
          maxHp: shouldRebalance ? balancedMaxHp : prev.activeRaid.maxHp,
          currentHp,
          balanceVersion: RAID_BALANCE_VERSION,
          fightStartedAt: now,
          fightEndsAt: now + RAID_FIGHT_SECONDS * 1000,
        }
      };
    });
  }, []);

  const handleContinueRaidFight = useCallback(() => {
    setGameState(prev => {
      const raid = prev.activeRaid;
      if (!raid || raid.phase !== 'capture') return prev;
      const now = Date.now();
      addLog(`⚔️ ${raid.name} voltou ao combate! Derrote-o antes do tempo acabar!`, 'system');
      return {
        ...prev,
        activeRaid: {
          ...raid,
          phase: 'fighting',
          fightStartedAt: now,
          fightEndsAt: now + RAID_FIGHT_SECONDS * 1000,
          continuingFromCapture: true,
        },
      };
    });
    setShowRaidScreen(false);
  }, [addLog]);

  const handleForfeitRaidCapture = useCallback(() => {
    setGameState(prev => {
      const raid = prev.activeRaid;
      if (!raid || raid.phase !== 'capture') return prev;
      addLog(`${raid.name} foi liberado sem captura. A raid foi encerrada.`, 'system');
      showRaidRouteNotice(raid, 'failed');
      localStorage.setItem(RAID_SPAWN_STORAGE_KEY, String(Date.now() + RAID_SPAWN_INTERVAL_MS));
      return {
        ...prev,
        activeRaid: { ...raid, phase: 'ended', catchAttemptsLeft: 0 },
      };
    });
    setShowRaidScreen(false);
  }, [addLog, showRaidRouteNotice]);

  const handleCatchRoll = useCallback((ballType) => {
    const raid = gameState.activeRaid;
    if (!raid || raid.phase !== 'capture') return false;
    const catchMult = RAID_CATCH_RATE_MULT[raid.stars] ?? 1.0;
    const baseRate = 0.1 * catchMult;
    const ballMult = ballType === 'ultra_ball' ? 2.0 : ballType === 'great_ball' ? 1.5 : 1.0;
    return Math.random() < (baseRate * ballMult);
  }, [gameState.activeRaid]);

  const handleRaidCatchAttempt = useCallback((ballType = 'poke_ball', forceCaught = null) => {
    // Usamos snapshot direto para poder bifurcar lógica Alpha fora do setGameState
    const prev = gameState;
    const raid = prev.activeRaid;
    if (!raid || raid.phase !== 'capture') return;

    const attemptsLeft = (raid.catchAttemptsLeft || 1) - 1;
    const catchMult = RAID_CATCH_RATE_MULT[raid.stars] ?? 1.0;
    const baseRate = 0.1 * catchMult;
    const ballMult = ballType === 'ultra_ball' ? 2.0 : ballType === 'great_ball' ? 1.5 : 1.0;
    const caught = (forceCaught !== null) ? forceCaught : Math.random() < (baseRate * ballMult);

    // Consome a pokebola usada
    const ballKey = ballType === 'ultra_ball' ? 'ultra_ball' : ballType === 'great_ball' ? 'great_ball' : 'pokeballs';
    const currentBalls = prev.inventory?.items?.[ballKey] || 0;
    const newItems = currentBalls > 0
      ? { ...prev.inventory.items, [ballKey]: currentBalls - 1 }
      : { ...prev.inventory.items };

    if (caught) {
      const pokedexEntry = POKEDEX[raid.pokemonId] || {};
      const allOwned = [...(prev.team || []), ...(prev.pc || []), ...(prev.house?.caretakers || [])];
      const ownedSameSpecies = allOwned.filter(p => Number(p.id) === Number(raid.pokemonId));

      // Cria o Pokémon base
      let newPoke = assignRandomAbility({
        instanceId: `raid_caught_${Date.now()}`,
        id: raid.pokemonId,
        name: raid.name,
        level: raid.level,
        isShiny: raid.isShiny,
        hp: pokedexEntry.hp || 60,
        maxHp: pokedexEntry.hp || 60,
        xp: 0,
        moves: (pokedexEntry.moves || []).slice(0, 4),
        type: pokedexEntry.type || 'Normal',
        types: pokedexEntry.types || [pokedexEntry.type || 'Normal'],
        attack: pokedexEntry.attack || 60,
        defense: pokedexEntry.defense || 60,
        spAtk: pokedexEntry.spAtk || 60,
        spDef: pokedexEntry.spDef || 60,
        speed: pokedexEntry.speed || 60,
        status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
        fromRaid: true,
      }, pokedexEntry);

      // Aplica bônus alfa se aplicável
      if (raid.isAlpha) {
        newPoke = applyAlphaUpgrade(newPoke, pokedexEntry, raid.isShiny);
      }

      // ── Lógica de Alpha ──
      if (raid.isAlpha) {
        // Já tem um alfa da mesma espécie → converte em candy
        const alreadyHasAlpha = ownedSameSpecies.some(p => p.isAlpha);
        if (alreadyHasAlpha) {
          const candyMap = { 1: 'exp_candy_xs', 2: 'exp_candy_s', 3: 'exp_candy_m', 4: 'exp_candy_l', 5: 'exp_candy_xl' };
          const candyId = candyMap[raid.stars] || 'exp_candy_s';
          const candyQty = raid.stars >= 4 ? 2 : 1;
          addLog(`📦 Você já possui um ${raid.name} Alfa! Recebeu ${candyQty}x EXP Candy no lugar.`, 'system');
          showRaidRouteNotice(raid, 'captured');
          setGameState(s => ({
            ...s,
            inventory: { ...s.inventory, items: { ...newItems, [candyId]: (newItems[candyId] || 0) + candyQty } },
            activeRaid: { ...raid, phase: 'rewards', captured: true, catchAttemptsLeft: 0 },
            raidStats: { ...(s.raidStats || {}), captured: (s.raidStats?.captured || 0) + 1 },
            playerStats: bumpPlayerStats(s.playerStats, { raidsCaptured: 1 }),
          }));
          return;
        }

        // Tem versão normal (não alfa, não shiny) → substitui automaticamente
        const normalIdx_team = prev.team.findIndex(p => Number(p.id) === Number(raid.pokemonId) && !p.isAlpha && !p.isShiny);
        const normalIdx_pc   = prev.pc.findIndex(p => Number(p.id) === Number(raid.pokemonId) && !p.isAlpha && !p.isShiny);
        if (normalIdx_team >= 0 || normalIdx_pc >= 0) {
          addLog(`🔴 ${raid.name} ALFA capturado! Substituiu a versão normal.`, 'system');
          showRaidRouteNotice(raid, 'captured');
          setGameState(s => {
            const newTeam = normalIdx_team >= 0
              ? s.team.map((p, i) => i === normalIdx_team ? newPoke : p)
              : s.team;
            const newPc = normalIdx_pc >= 0
              ? s.pc.map((p, i) => i === normalIdx_pc ? newPoke : p)
              : s.pc;
            return {
              ...s,
              team: newTeam,
              pc: newPc,
              inventory: { ...s.inventory, items: newItems },
              activeRaid: { ...raid, phase: 'rewards', captured: true, catchAttemptsLeft: 0 },
              raidStats: { ...(s.raidStats || {}), captured: (s.raidStats?.captured || 0) + 1 },
              playerStats: bumpPlayerStats(s.playerStats, { pokemonCaptured: 1, shinyCaptured: raid.isShiny ? 1 : 0, raidsCaptured: 1 }),
            };
          });
          return;
        }

        // Tem apenas versão shiny → perguntar ao jogador
        const existingShiny = ownedSameSpecies.find(p => p.isShiny && !p.isAlpha);
        if (existingShiny) {
          // Guarda em estado pendente; o diálogo de confirmação vai resolver
          setPendingAlphaCapture({ newPoke, existingShinyInstanceId: existingShiny.instanceId, raid, newItems });
          // Já consome a pokébola e pausa a raid
          setGameState(s => ({
            ...s,
            inventory: { ...s.inventory, items: newItems },
            activeRaid: { ...raid, catchAttemptsLeft: 0 },
          }));
          return;
        }

        // Nenhuma versão owned → adiciona normalmente
        addLog(`🔴 ${raid.name} ALFA${raid.isShiny ? ' ✨' : ''} capturado! Incrível!`, 'system');
        showRaidRouteNotice(raid, 'captured');
        setGameState(s => ({
          ...s,
          pc: [...(s.pc || []), newPoke],
          inventory: { ...s.inventory, items: newItems },
          activeRaid: { ...raid, phase: 'rewards', captured: true, catchAttemptsLeft: 0 },
          raidStats: { ...(s.raidStats || {}), captured: (s.raidStats?.captured || 0) + 1 },
          playerStats: bumpPlayerStats(s.playerStats, { pokemonCaptured: 1, shinyCaptured: raid.isShiny ? 1 : 0, raidsCaptured: 1 }),
        }));
        return;
      }

      // ── Lógica normal (não alfa) ──
      const alreadyOwns = ownedSameSpecies.length > 0;
      if (alreadyOwns && !raid.isShiny) {
        // Duplicata: converte em EXP Candy
        const candyMap = { 1: 'exp_candy_xs', 2: 'exp_candy_s', 3: 'exp_candy_m', 4: 'exp_candy_l', 5: 'exp_candy_xl' };
        const candyId = candyMap[raid.stars] || 'exp_candy_s';
        const candyQty = raid.stars >= 4 ? 2 : 1;
        addLog(`📦 ${raid.name} já está no seu PC! Recebeu ${candyQty}x ${EXP_CANDIES[candyId]?.name} no lugar.`, 'system');
        showRaidRouteNotice(raid, 'captured');
        setGameState(s => ({
          ...s,
          inventory: { ...s.inventory, items: { ...newItems, [candyId]: (newItems[candyId] || 0) + candyQty } },
          activeRaid: { ...raid, phase: 'rewards', captured: true, catchAttemptsLeft: 0 },
          raidStats: { ...(s.raidStats || {}), captured: (s.raidStats?.captured || 0) + 1 },
          playerStats: bumpPlayerStats(s.playerStats, { raidsCaptured: 1 }),
        }));
        return;
      }

      // Espécie nova ou shiny: vai para o PC
      addLog(`🎉 Você capturou ${raid.isShiny ? '✨ ' : ''}${raid.name}!`, 'system');
      showRaidRouteNotice(raid, 'captured');
      setGameState(s => ({
        ...s,
        pc: [...(s.pc || []), newPoke],
        inventory: { ...s.inventory, items: newItems },
        activeRaid: { ...raid, phase: 'rewards', captured: true, catchAttemptsLeft: 0 },
        raidStats: { ...(s.raidStats || {}), captured: (s.raidStats?.captured || 0) + 1 },
        playerStats: bumpPlayerStats(s.playerStats, { pokemonCaptured: 1, shinyCaptured: raid.isShiny ? 1 : 0, raidsCaptured: 1 }),
      }));
    } else if (attemptsLeft <= 0) {
      addLog(`💨 ${raid.name} não foi capturado. Tentativas esgotadas.`, 'system');
      const nextPhase = raid.currentHp === 0 ? 'rewards' : 'ended';
      if (nextPhase === 'ended') {
        addLog(`💨 ${raid.name} fugiu vitorioso! Você não conseguiu enfraquecê-lo o suficiente.`, 'enemy');
        showRaidRouteNotice(raid, 'failed');
      } else {
        showRaidRouteNotice(raid, 'rewards');
      }
      setGameState(s => ({
        ...s,
        inventory: { ...s.inventory, items: newItems },
        activeRaid: { ...raid, phase: nextPhase, catchAttemptsLeft: 0 },
      }));
    } else {
      addLog(`💨 ${raid.name} escapou! ${attemptsLeft} tentativa(s) restante(s).`, 'system');
      setGameState(s => ({
        ...s,
        inventory: { ...s.inventory, items: newItems },
        activeRaid: { ...raid, catchAttemptsLeft: attemptsLeft },
      }));
    }
  }, [gameState, showRaidRouteNotice, addLog, setPendingAlphaCapture]);

  const handleClaimRaidRewards = useCallback(() => {
    setGameState(prev => {
      const raid = prev.activeRaid;
      if (!raid || raid.phase !== 'rewards') return prev;
      const rewards = raid.rewards || [];
      let newCurrency = prev.currency || 0;
      const newInventory = {
        ...prev.inventory,
        items:     { ...prev.inventory.items },
        materials: { ...prev.inventory.materials },
        candies:   { ...(prev.inventory.candies || {}) },
      };
      rewards.forEach(r => {
        if (r.type === 'currency') {
          newCurrency += r.quantity || 0;
        } else if (r.type === 'item') {
          newInventory.items[r.id] = (newInventory.items[r.id] || 0) + (r.quantity || 1);
        } else if (r.type === 'material') {
          newInventory.materials[r.id] = (newInventory.materials[r.id] || 0) + (r.quantity || 1);
        } else if (r.type === 'candy') {
          newInventory.candies[r.id] = (newInventory.candies[r.id] || 0) + (r.quantity || 1);
        }
      });
      showRaidRouteNotice(raid, 'claimed');
      // Agenda próxima raid
      localStorage.setItem(RAID_SPAWN_STORAGE_KEY, String(Date.now() + RAID_SPAWN_INTERVAL_MS));
      return {
        ...prev,
        currency: newCurrency,
        inventory: newInventory,
        activeRaid: null,
        battlesSinceLastRaid: 0,
        raidStats: {
          ...(prev.raidStats || {}),
          total: (prev.raidStats?.total || 0) + 1,
        },
        playerStats: bumpPlayerStats(prev.playerStats, { raidsWon: 1 }),
      };
    });
    setShowRaidScreen(false);
  }, [showRaidRouteNotice]);

  // TICK DE BATALHA
  // ⛏️” PROTECTED: handleBattleTick — NíO EDITAR SEM AUTORIZAÇíO EXPLíCITA
  const handleBattleTick = useCallback(() => {
    const speedMultiplier = [1, 0.6, 0.3][(gameState.settings?.battleSpeed || 1) - 1] || 1;
    
    // Bônus de Aliado Ativo
    const allyBonus = (() => {
      const ally = gameState.ally;
      if (!ally?.activeId || !ally?.expiresAt || Date.now() > ally.expiresAt) return null;
      return ALLIES[ally.activeId]?.bonus || null;
    })();
    
    // REGRA DE EXAUSTAO - INICIO DO TICK
    const myPoke = gameState.team?.[activeMemberIndex];
    const myPokeStamina = gameState.stamina?.[myPoke?.instanceId]?.value ?? 100;

    if (myPokeStamina <= 0 && myPoke?.hp > 0) {
      // Buscar próximo Pokémon com HP > 0 E stamina > 0 (Sequencial)
      const nextViable = (() => {
        for (let i = activeMemberIndex + 1; i < (gameState.team?.length || 0); i++) {
          const p = gameState.team[i];
          if ((p?.hp ?? 0) > 0 && (gameState.stamina?.[p?.instanceId]?.value ?? 100) > 0) return i;
        }
        for (let i = 0; i < activeMemberIndex; i++) {
          const p = gameState.team[i];
          if ((p?.hp ?? 0) > 0 && (gameState.stamina?.[p?.instanceId]?.value ?? 100) > 0) return i;
        }
        return -1;
      })();

      if (nextViable !== -1) {
        // Trocar automaticamente para o próximo viável
        setActiveMemberIndex(nextViable);
        addLog(
          `${myPoke.name} esta exausto demais para combater! ` +
          `${gameState.team[nextViable].name} entrou em campo!`,
          'system'
        );
      } else {
        // Todos exaustos ou desmaiados - derrota por exaustao
        isProcessingVictory.current = true;
        setCurrentEnemy(null);
        stopBGM(300);
        sfxDefeat();
        addLog(
          'Todo o time esta exausto! Volte ao Centro Pokemon para recuperar seus Pokemon!',
          'system'
        );
        setTimeout(() => {
          isProcessingVictory.current = false;
          registerDefeat();
        }, 300);
      }
      return 1200 * speedMultiplier;
    }
    // FIM DA REGRA DE EXAUSTAO
    
    const viewsAllowingBattle = ['battles', 'pokemon_management', 'pokedex', 'menu', 'vs'];
    const isPaused = activeBuildingModal !== null;
    
    if (!currentEnemy || !viewsAllowingBattle.includes(currentViewRef.current) || isPaused || currentEnemy.hp <= 0) {
      return 1200 * speedMultiplier;
    }
    
    // Atraso Cinematográfico para Início de Batalha (Intro)
    const introTime = currentEnemy.isTrainer ? 2500 : 1200;
    if (currentEnemy.spawnTime && Date.now() - currentEnemy.spawnTime < introTime) {
       return 400 * speedMultiplier;
    }

    let nextDelay = Math.floor(1200 * speedMultiplier);
    
    // ISCA / LURE (Acelerar Spawn)
    const effects = gameState.activeEffects || {};
    const now = Date.now();
    if (effects.activeLure?.endsAt > now) {
      nextDelay = Math.floor(nextDelay * (effects.activeLure.spawnMult || 0.6));
    }

    setGameState(prev => {
      const myPoke = prev.team[activeMemberIndex];
      const updatedTeam = [...prev.team];
      const updatedEnemy = { ...currentEnemy };
      if (!myPoke || myPoke.hp <= 0) {
        const nextAlive = (() => {
          // Busca sequencial a partir do próximo
          for (let i = activeMemberIndex + 1; i < prev.team.length; i++) {
            if (prev.team[i]?.hp > 0) return i;
          }
          // Wrap para o início
          for (let i = 0; i < activeMemberIndex; i++) {
            if (prev.team[i]?.hp > 0) return i;
          }
          return -1;
        })();
        if (nextAlive !== -1) {
          setActiveMemberIndex(nextAlive);
          // Reseta stages do Pokémon que entra em campo
          const newTeam = prev.team.map((p, i) =>
            i === nextAlive
              ? { ...p, stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 } }
              : p
          );
          return { ...prev, team: newTeam };
        } else {
          if (isStoryVsEnemy(currentEnemy)) {
            stopBGM(300);
            sfxDefeat();
            openStoryBattleResult(currentEnemy, 'defeat');
          } else if (currentEnemy.isInitialRival || currentEnemy.unlocks === 'rival_1_defeated' || currentEnemy.unlockFlag === 'rival_1_defeated' || currentEnemy.unlockFlag === 'rival_lab_defeated') {
            setCurrentView('rival_post_battle');
          } else {
            stopBGM(300);
            sfxDefeat();
            registerDefeat();
          }
        }
        return prev;
      }

      // AUTO-POCAO
      const autoConfig = prev.autoCaptureConfig || { autoPotion: false, hpThreshold: 30, focusPokemonIndex: 0 };
      const autoPotionThreshold = autoConfig.autoPotionHpPct ?? autoConfig.hpThreshold ?? 30;
      if (autoConfig.autoPotion && (prev.inventory?.items?.potions || 0) > 0) {
        const focusIdx = autoConfig.focusPokemonIndex ?? activeMemberIndex;
        const focusPoke = prev.team[focusIdx];
        if (focusPoke && focusPoke.hp > 0) {
          const hpPct = (focusPoke.hp / focusPoke.maxHp) * 100;
          if (hpPct <= autoPotionThreshold) {
            const healed = Math.min(focusPoke.maxHp, focusPoke.hp + 20);
            const newTeam = [...prev.team];
            newTeam[focusIdx] = { ...focusPoke, hp: healed };
            addLog(`Auto-Pocao usada em ${focusPoke.name}! (${focusPoke.hp} -> ${healed} HP)`, 'system');
            return {
              ...prev,
              team: newTeam,
              inventory: { ...prev.inventory, items: { ...prev.inventory.items, potions: prev.inventory.items.potions - 1 } }
            };
          }
        }
      }

      // PROCESSAMENTO DE STATUS (DANO/SKIP)
      const myStatus = myPoke.status || [];
      const enemyStatus = updatedEnemy.status || [];

      // Confuse Skip (Jogador)
      if (myStatus.includes('confuse')) {
        addLog(`${myPoke.name} esta confuso...`, 'system');
        if (Math.random() < 0.3) {
           updatedTeam[activeMemberIndex].status = myStatus.filter(s => s !== 'confuse');
           addLog(`✨ ${myPoke.name} não está mais confuso!`, 'system');
        } else if (Math.random() < 0.5) {
           const selfDmg = Math.max(1, Math.floor(myPoke.maxHp / 10));
           updatedTeam[activeMemberIndex].hp = Math.max(0, myPoke.hp - selfDmg);
           addLog(`${myPoke.name} feriu-se em sua confusao!`, 'system');
           return { ...prev, team: updatedTeam };
        }
      }

      // Paralyze/Sleep Skip (Jogador)
      if (myStatus.includes('paralyze') && Math.random() < 0.25) {
        addLog(`⚡ ${myPoke.name} está paralisado e não conseguiu atacar!`, 'system');
        return prev; 
      }
      if (myStatus.includes('sleep')) {
        addLog(`${myPoke.name} esta dormindo profundamente...`, 'system');
        if (Math.random() < 0.3) {
          updatedTeam[activeMemberIndex].status = myStatus.filter(s => s !== 'sleep');
          addLog(`${myPoke.name} acordou!`, 'system');
        } else {
          return { ...prev, team: updatedTeam };
        }
      }
      if (myStatus.includes('freeze')) {
        addLog(`❄️ ${myPoke.name} está congelado e não pode atacar!`, 'system');
        if (Math.random() < 0.20) {
          updatedTeam[activeMemberIndex].status = myStatus.filter(s => s !== 'freeze');
          addLog(`🔥 ${myPoke.name} se descongelou!`, 'system');
        } else {
          return { ...prev, team: updatedTeam };
        }
      }

      // Turno do Jogador
      const moves = myPoke.moves || [];
      const move = (moves.length > 0 && moves[moveIndex % moves.length]) || { name: 'Investida', power: 40, type: 'Normal', category: 'Physical' };
      
      let updatedTeamFinal = [...updatedTeam];
      let updatedEnemyFinal = { ...updatedEnemy };
      let raidDmgToApply = 0;
      let playerDmg = 0;
      let weatherChangedThisTick = false;

      if (move.category === 'Status' || move.power === 0) {
        nextDelay = 600;
        const playerWeatherChanged = activateWeatherFromMove(move, myPoke.name);
        if (playerWeatherChanged) weatherChangedThisTick = true;
        const fx = interpretMoveEffect(move);
        window.dispatchEvent(new CustomEvent('pokemove', {
          detail: {
            name: move.name,
            type: move.type,
            category: move.category || 'Status',
            power: move.power || 0,
            direction: 'player-to-enemy',
            moveKey: move.moveId || move.key,
            isStatus: true,
            noEffect: fx.noEffect && !playerWeatherChanged,
            heal: !!fx.heal,
            ohko: !!fx.ohko,
            fixedDamage: fx.fixedDamage,
            statusEffect: fx.statusEffect,
            statChanges: fx.statChanges || [],
            weatherChanged: playerWeatherChanged,
          }
        }));

        if (fx.noEffect && !playerWeatherChanged) {
          addLog(`${myPoke.name} usou ${move.name}... sem efeito aqui.`, 'system');

        } else if (fx.ohko) {
          // Precisão real: base 30% + (level usuário - level alvo)
          const _ohkoAcc = 30 + (myPoke.level || 5) - (updatedEnemyFinal.level || 5);
          if (_ohkoAcc <= 0 || Math.random() * 100 > Math.max(1, _ohkoAcc)) {
            addLog(`${myPoke.name} usou ${move.name}... mas falhou!`, 'system');
            addFloat('Errou!', '#94a3b8');
          } else {
            updatedEnemyFinal.hp = 0;
            addLog(`💥 ${myPoke.name} usou ${move.name}! Golpe decisivo!`, 'system');
            addFloat('OHKO!', '#ef4444');
          }

        } else if (fx.fixedDamage !== null) {
          let dmg = 0;
          if (fx.fixedDamage === 'level') dmg = (myPoke.level || 5);
          else if (fx.fixedDamage === 'psywave') dmg = Math.floor((myPoke.level || 5) * (0.5 + Math.random()));
          else if (fx.fixedDamage === 'half_hp') dmg = Math.max(1, Math.floor(updatedEnemyFinal.hp / 2));
          else dmg = fx.fixedDamage;

          updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - dmg);
          addLog(`${myPoke.name} usou ${move.name}! ${dmg} de dano!`, 'system');
          addFloat(`-${dmg}`, '#ef4444');

        } else if (fx.heal) {
          const _moveLower = (move.name || '').toLowerCase();
          if (_moveLower === 'rest') {
            // Rest: cura total + remove status ruim + aplica sono
            const _healed = (myPoke.maxHp || 30) - (myPoke.hp || 0);
            updatedTeamFinal[activeMemberIndex] = {
              ...updatedTeamFinal[activeMemberIndex],
              hp: myPoke.maxHp,
              toxicTurns: 0,
              status: [...((myPoke.status || []).filter(s => !['burn','poison','toxic','paralyze','freeze'].includes(s))), 'sleep'],
            };
            addLog(`💤 ${myPoke.name} usou Descanso! Se curou completamente e dormiu! (+${_healed} HP)`, 'system');
            addFloat(`+${_healed} HP`, '#22c55e', 'player');
          } else {
            const healed = Math.floor((myPoke.maxHp || 30) * 0.5);
            updatedTeamFinal[activeMemberIndex] = {
              ...updatedTeamFinal[activeMemberIndex],
              hp: Math.min(myPoke.maxHp, myPoke.hp + healed)
            };
            addLog(`💚 ${myPoke.name} usou ${move.name}! Recuperou ${healed} HP!`, 'system');
            addFloat(`+${healed} HP`, '#22c55e', 'player');
          }

        } else if (fx.leechSeed) {
          if (!(updatedEnemyFinal.status || []).includes('leech-seed')) {
            updatedEnemyFinal.status = [...(updatedEnemyFinal.status || []), 'leech-seed'];
            addLog(`🌱 ${myPoke.name} usou Semente Sanguessuga! ${updatedEnemyFinal.name} foi semeado!`, 'system');
          } else {
            addLog(`${myPoke.name} usou ${move.name}... mas não surtiu efeito!`, 'system');
          }

        } else {
          // Stat changes
          fx.statChanges.forEach(c => {
            if (c.target === 'enemy') {
              const cur = updatedEnemyFinal.stages?.[c.stat] || 0;
              const newVal = Math.max(-6, Math.min(6, cur + c.change));
              updatedEnemyFinal.stages = { ...updatedEnemyFinal.stages, [c.stat]: newVal };
              const arrow = c.change < 0 ? '↓' : '↑';
              const statNames = { attack:'ATK', defense:'DEF', spAtk:'SATK', spDef:'SDEF', speed:'SPD' };
                addLog(`${myPoke.name} usou ${move.name}! ${statNames[c.stat]||c.stat} de ${updatedEnemyFinal.name} ${c.change < 0 ? 'caiu' : 'subiu'}!`, 'system');
                addFloat(`${arrow} ${statNames[c.stat]||c.stat}`, c.change < 0 ? '#64748b' : '#3b82f6');
              } else {
                const cur = updatedTeamFinal[activeMemberIndex].stages?.[c.stat] || 0;
                const newVal = Math.max(-6, Math.min(6, cur + c.change));
                updatedTeamFinal[activeMemberIndex] = { ...updatedTeamFinal[activeMemberIndex], stages: { ...updatedTeamFinal[activeMemberIndex].stages, [c.stat]: newVal } };
                const arrow = c.change > 0 ? '↑' : '↓';
                const statNames = { attack:'ATK', defense:'DEF', spAtk:'SATK', spDef:'SDEF', speed:'SPD' };
                addLog(`${myPoke.name} usou ${move.name}! ${statNames[c.stat]||c.stat} ${c.change > 0 ? 'subiu' : 'caiu'}!`, 'system');
                addFloat(`${arrow} ${statNames[c.stat]||c.stat}`, c.change > 0 ? '#3b82f6' : '#64748b', 'player');
              }
          });

          // Accuracy / Evasion
          if (fx.accuracy_change) {
            const target = fx.accuracy_change.target === 'enemy' ? updatedEnemyFinal : updatedTeamFinal[activeMemberIndex];
            const cur = target.stages?.accuracy || 0;
            const newVal = Math.max(-6, Math.min(6, cur + fx.accuracy_change.change));
            if (fx.accuracy_change.target === 'enemy') {
              updatedEnemyFinal.stages = { ...updatedEnemyFinal.stages, accuracy: newVal };
            } else {
              updatedTeamFinal[activeMemberIndex] = { ...updatedTeamFinal[activeMemberIndex], stages: { ...updatedTeamFinal[activeMemberIndex].stages, accuracy: newVal } };
            }
            addLog(`${myPoke.name} usou ${move.name}! Precisão de ${updatedEnemyFinal.name} caiu!`, 'system');
            addFloat('↓ ACC', '#64748b');
          }
          if (fx.evasion_change) {
            const target = fx.evasion_change.target === 'enemy' ? updatedEnemyFinal : updatedTeamFinal[activeMemberIndex];
            const cur = target.stages?.evasion || 0;
            const newVal = Math.max(-6, Math.min(6, cur + fx.evasion_change.change));
            if (fx.evasion_change.target === 'enemy') {
              updatedEnemyFinal.stages = { ...updatedEnemyFinal.stages, evasion: newVal };
            } else {
              updatedTeamFinal[activeMemberIndex] = { ...updatedTeamFinal[activeMemberIndex], stages: { ...updatedTeamFinal[activeMemberIndex].stages, evasion: newVal } };
            }
            addLog(`${myPoke.name} usou ${move.name}! Evasão subiu!`, 'system');
            addFloat('↑ EVA', '#3b82f6', 'player');
          }

          // Status condition
          if (fx.statusEffect) {
            const statusNames = { burn:'🔥 Queimadura', poison:'☠️ Veneno', toxic:'☠️ Veneno Grave', sleep:'💤 Sono', paralyze:'⚡ Paralisia', confuse:'💫 Confusão', freeze:'❄️ Congelamento' };
            const _checkStatus = fx.statusEffect === 'toxic' ? 'toxic' : fx.statusEffect;
            const _alreadyHas = (updatedEnemyFinal.status || []).some(s => s === 'poison' || s === 'toxic' || s === _checkStatus);
            if (!_alreadyHas) {
              updatedEnemyFinal.status = [...(updatedEnemyFinal.status || []), fx.statusEffect];
              if (fx.statusEffect === 'toxic') updatedEnemyFinal.toxicTurns = 1;
              addLog(`${statusNames[fx.statusEffect]||fx.statusEffect}: ${updatedEnemyFinal.name} foi afetado!`, 'enemy');
            } else {
              addLog(`${myPoke.name} usou ${move.name}... mas não surtiu efeito!`, 'system');
            }
          }

          if (!playerWeatherChanged && fx.statChanges.length === 0 && !fx.accuracy_change && !fx.statusEffect && !fx.evasion_change) {
            addLog(`${myPoke.name} usou ${move.name}!`, 'system');
          }
        }

        setCurrentEnemy(updatedEnemyFinal);
      } else {
        playerDmg = calcDamage(myPoke, move, updatedEnemyFinal);

        // Golpes múltiplos
        if (playerDmg > 0) {
          const _mhNm = (move.name || '').toLowerCase().replace(/ /g, '-');
          const MULTI2 = new Set(['double-kick','bonemerang','dual-chop','double-hit','gear-grind','twineedle','dual-wingbeat','surging-strikes']);
          const MULTI25 = new Set(['bullet-seed','rock-blast','icicle-spear','pin-missile','fury-attack',
            'fury-swipes','comet-punch','double-slap','spike-cannon','arm-thrust','tail-slap',
            'water-shuriken','bone-rush','population-bomb','scale-shot']);
          if (MULTI2.has(_mhNm)) {
            playerDmg += Math.max(1, calcDamage(myPoke, move, updatedEnemyFinal));
          } else if (MULTI25.has(_mhNm)) {
            const _r = Math.random();
            const _hc = _r < 0.333 ? 2 : _r < 0.666 ? 3 : _r < 0.833 ? 4 : 5;
            for (let _h = 1; _h < _hc; _h++) playerDmg += Math.max(1, calcDamage(myPoke, move, updatedEnemyFinal));
          }
        }

        // Dispara evento de animação do golpe para o BattleScreen
        if (allyBonus?.damageMult) playerDmg = Math.floor(playerDmg * allyBonus.damageMult);
        const eff = getTypeEffectiveness(move.type, updatedEnemyFinal.type);
        window.dispatchEvent(new CustomEvent('pokemove', {
          detail: {
            name: move.name,
            type: move.type,
            category: move.category || 'Physical',
            power: move.power || 0,
            direction: 'player-to-enemy',
            moveKey: move.moveId || move.key,
            damage: playerDmg,
            missed: playerDmg === 0 && eff > 0,
            effectiveness: eff,
            noEffect: eff === 0,
          }
        }));
        
        if (playerDmg === 0 && eff > 0) {
          addLog(`${myPoke.name} usou ${move.name}... mas errou!`, 'system');
          addFloat('Errou!', '#94a3b8');
        } else {
          updatedEnemyFinal.hp = updatedEnemyFinal.isWorldBoss
            ? Math.max(1, updatedEnemyFinal.hp - playerDmg)
            : Math.max(0, updatedEnemyFinal.hp - playerDmg);
          
          if (updatedEnemyFinal.isWorldBoss) {
            setBossDamage(prev => {
              const newVal = prev + playerDmg;
              setGameState(state => ({
                ...state,
                bossTotalDamage: Math.max(state.bossTotalDamage || 0, newVal),
                bossLastDamage: newVal
              }));
              debouncedSaveBossDamage(newVal);
              return newVal;
            });
          }

          // Raid: 80% do dano do jogador vai para o Raid Boss (se ativo)
          raidDmgToApply = Math.floor(playerDmg * 0.8);

          addFloat(`-${playerDmg}`, eff > 1 ? '#fbbf24' : eff < 1 ? '#94a3b8' : '#ef4444');
          if (eff > 1) addLog("💥 É super efetivo!", 'system');
          if (eff > 0 && eff < 1) addLog("💢 Não é muito efetivo!", 'system');
          if (eff === 0) addLog("🚫 Não afetou o inimigo!", 'system');
        }
      }

      // ── Efeitos Secundários de Golpes de Dano ─────────────────────────────
      if (playerDmg > 0) {
        const _nm = (move.name || '').toLowerCase().replace(/ /g, '-');
        const _fullMove = MOVES[_nm] || move;
        const _eff = (_fullMove.effect || move.effect || '').toLowerCase();

        // 1. DRAIN — absorve HP do inimigo
        const DRAIN_NAMES = new Set([
          'absorb','mega-drain','giga-drain','drain-punch','leech-life',
          'horn-leech','draining-kiss','oblivion-wing','dream-eater',
          'bitter-blade','matcha-gotcha','bouncy-bubble'
        ]);
        const DRAIN75 = new Set(['draining-kiss','oblivion-wing']); // 75% em vez de 50%
        if (DRAIN_NAMES.has(_nm) || _eff.includes('drains half the damage')) {
          // Dream Eater só funciona em alvo dormindo
          const _canDrain = _nm !== 'dream-eater' || (updatedEnemyFinal.status || []).includes('sleep');
          if (_canDrain) {
            const _frac = DRAIN75.has(_nm) ? 0.75 : 0.5;
            const healAmt = Math.max(1, Math.floor(playerDmg * _frac));
            updatedTeamFinal[activeMemberIndex].hp = Math.min(
              updatedTeamFinal[activeMemberIndex].maxHp,
              updatedTeamFinal[activeMemberIndex].hp + healAmt
            );
            addLog(`💚 ${myPoke.name} absorveu ${healAmt} HP!`, 'system');
            addFloat(`+${healAmt} HP`, '#22c55e', 'player');
          }
        }

        // 2. RECUO — dano ao próprio usuário
        const RECOIL_QUARTER = new Set(['take-down','submission','wild-charge','head-charge','struggle']);
        const RECOIL_THIRD   = new Set(['double-edge','brave-bird','flare-blitz','volt-tackle','wood-hammer','head-smash','light-of-ruin','chloroblast']);
        const RECOIL_HALF    = new Set(['shadow-end']);
        if (RECOIL_QUARTER.has(_nm) || RECOIL_THIRD.has(_nm) || RECOIL_HALF.has(_nm) ||
            (_eff.includes('recoil') && !_eff.includes('no recoil'))) {
          let _frac = 0.25;
          if (RECOIL_THIRD.has(_nm) || _eff.includes('1/3') || _eff.includes('one-third')) _frac = 1/3;
          if (RECOIL_HALF.has(_nm)) _frac = 0.5;
          const _recoil = Math.max(1, Math.floor(playerDmg * _frac));
          updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - _recoil);
          addLog(`💥 ${myPoke.name} sofreu ${_recoil} de recuo!`, 'system');
        }

        // 3. BUFF PRÓPRIO AO CAUSAR DANO
        const _stages = updatedTeamFinal[activeMemberIndex].stages || {};
        // +1 Ataque
        if (['power-up-punch','rage-fist'].includes(_nm)) {
          updatedTeamFinal[activeMemberIndex].stages = { ..._stages, attack: Math.min(6, (_stages.attack || 0) + 1) };
          addLog(`💪 ${myPoke.name}: Ataque subiu!`, 'system');
          addFloat('↑ ATK', '#3b82f6', 'player');
        }
        // +1 Velocidade
        if (['flame-charge','aqua-step','trailblaze','pounce'].includes(_nm)) {
          updatedTeamFinal[activeMemberIndex].stages = { ..._stages, speed: Math.min(6, (_stages.speed || 0) + 1) };
          addLog(`⚡ ${myPoke.name}: Velocidade subiu!`, 'system');
          addFloat('↑ SPD', '#3b82f6', 'player');
        }
        // +1 At. Especial
        if (['torch-song','make-it-rain','fiery-dance','charge-beam'].includes(_nm)) {
          updatedTeamFinal[activeMemberIndex].stages = { ..._stages, spAtk: Math.min(6, (_stages.spAtk || 0) + 1) };
          addLog(`✨ ${myPoke.name}: At. Especial subiu!`, 'system');
          addFloat('↑ SATK', '#3b82f6', 'player');
        }
        // Fell Stinger: +3 Ataque se der KO
        if (_nm === 'fell-stinger' && updatedEnemyFinal.hp <= 0) {
          updatedTeamFinal[activeMemberIndex].stages = { ..._stages, attack: Math.min(6, (_stages.attack || 0) + 3) };
          addLog(`🐝 ${myPoke.name}: Ataque subiu drasticamente!`, 'system');
          addFloat('↑↑↑ ATK', '#3b82f6', 'player');
        }
        // Lumina Crash: -2 Def. Especial inimigo (100%)
        if (_nm === 'lumina-crash') {
          const _es = updatedEnemyFinal.stages || {};
          updatedEnemyFinal.stages = { ..._es, spDef: Math.max(-6, (_es.spDef || 0) - 2) };
          addLog(`📉 Def. Especial de ${updatedEnemyFinal.name} caiu muito!`, 'enemy');
        }
        // Make It Rain: -1 At. Especial própria (100%)
        if (_nm === 'make-it-rain') {
          updatedTeamFinal[activeMemberIndex].stages = { ..._stages, spAtk: Math.max(-6, (_stages.spAtk || 0) - 1) };
          addLog(`💸 ${myPoke.name}: At. Especial caiu!`, 'system');
        }
        // Syrup Bomb: -1 Speed inimigo (100%)
        if (_nm === 'syrup-bomb') {
          const _es = updatedEnemyFinal.stages || {};
          updatedEnemyFinal.stages = { ..._es, speed: Math.max(-6, (_es.speed || 0) - 1) };
          addLog(`🍯 Velocidade de ${updatedEnemyFinal.name} caiu!`, 'enemy');
        }

        // 4. EFEITOS SECUNDÁRIOS DE STATUS (chance)
        const _enemySt = updatedEnemyFinal.status || [];

        // Queimar (30%)
        const BURN30 = new Set(['fire-punch','lava-plume','scald','sacred-fire','blue-flare','pyro-ball',
          'scorching-sands','burning-jealousy','mystical-fire','raging-bull','matcha-gotcha']);
        // Queimar (10%)
        const BURN10 = new Set(['ember','flamethrower','fire-blast','flame-wheel','heat-wave','blaze-kick',
          'fire-fang','searing-shot','steam-eruption','ice-burn','shadow-fire']);
        // Paralisia (30%)
        const PARA30 = new Set(['thunder-punch','body-slam','discharge','nuzzle','bounce','force-palm',
          'spark','thunder-fang','shadow-bolt']);
        // Paralisia (10%)
        const PARA10 = new Set(['thunder-shock','thunderbolt','thunder','lick','zap-cannon',
          'dragon-breath','volt-tackle','bolt-strike','freeze-shock','stoked-sparksurfer']);
        // Veneno (30%)
        const POIS30 = new Set(['poison-sting','sludge','sludge-bomb','poison-jab','cross-poison',
          'gunk-shot','sludge-wave','poison-fang','poison-tail','smog','twineedle',
          'barb-barrage','malignant-chain']);
        // Congelar (10%)
        const FRZE10 = new Set(['ice-punch','ice-beam','blizzard','powder-snow','ice-fang','shadow-chill']);
        // Confundir (10%)
        const CONF10 = new Set(['psybeam','confusion','dizzy-punch','dynamic-punch','signal-beam',
          'water-pulse','hurricane','strange-steam']);

        // Cada status verifica de forma independente (um por ataque)
        let _secStatusApplied = false;
        if (!_secStatusApplied && !_enemySt.includes('burn') &&
            ((BURN30.has(_nm) && Math.random() < 0.30) || (BURN10.has(_nm) && Math.random() < 0.10))) {
          updatedEnemyFinal.status = [..._enemySt, 'burn'];
          addLog(`🔥 ${updatedEnemyFinal.name} foi queimado!`, 'enemy');
          _secStatusApplied = true;
        }
        if (!_secStatusApplied && !_enemySt.includes('paralyze') && !_enemySt.includes('burn') &&
            ((PARA30.has(_nm) && Math.random() < 0.30) || (PARA10.has(_nm) && Math.random() < 0.10))) {
          updatedEnemyFinal.status = [..._enemySt, 'paralyze'];
          addLog(`⚡ ${updatedEnemyFinal.name} foi paralisado!`, 'enemy');
          _secStatusApplied = true;
        }
        if (!_secStatusApplied && !_enemySt.includes('poison') && !_enemySt.includes('toxic') &&
            (POIS30.has(_nm) && Math.random() < 0.30)) {
          updatedEnemyFinal.status = [..._enemySt, 'poison'];
          addLog(`☠️ ${updatedEnemyFinal.name} foi envenenado!`, 'enemy');
          _secStatusApplied = true;
        }
        if (!_secStatusApplied && FRZE10.has(_nm) && !_enemySt.includes('freeze') && Math.random() < 0.10) {
          updatedEnemyFinal.status = [..._enemySt, 'freeze'];
          addLog(`❄️ ${updatedEnemyFinal.name} foi congelado!`, 'enemy');
          _secStatusApplied = true;
        }
        if (!_secStatusApplied && CONF10.has(_nm) && !_enemySt.includes('confuse') && Math.random() < 0.10) {
          updatedEnemyFinal.status = [..._enemySt, 'confuse'];
          addLog(`💫 ${updatedEnemyFinal.name} ficou confuso!`, 'enemy');
        }

        // 5. DEBUFF INIMIGO AO CAUSAR DANO (chance)
        const _es = updatedEnemyFinal.stages || {};
        // Baixar Velocidade (100%)
        const SPD_DOWN_100 = new Set(['icy-wind','rock-tomb','mud-shot','low-sweep','bulldoze',
          'electroweb','glaciate','drum-beating']);
        // Baixar Velocidade (30%)
        const SPD_DOWN_30  = new Set(['bubble-beam','constrict','bubble','hammer-arm','scale-shot','ice-hammer']);
        if (SPD_DOWN_100.has(_nm)) {
          updatedEnemyFinal.stages = { ..._es, speed: Math.max(-6, (_es.speed || 0) - 1) };
          addLog(`📉 Velocidade de ${updatedEnemyFinal.name} caiu!`, 'enemy');
        } else if (SPD_DOWN_30.has(_nm) && Math.random() < 0.30) {
          updatedEnemyFinal.stages = { ..._es, speed: Math.max(-6, (_es.speed || 0) - 1) };
          addLog(`📉 Velocidade de ${updatedEnemyFinal.name} caiu!`, 'enemy');
        }
        // Baixar Def. Especial (30%)
        const SPDEF_DOWN = new Set(['acid','psychic','shadow-ball','bug-buzz','focus-blast','energy-ball',
          'earth-power','flash-cannon','acid-spray','seed-flare','lumina-crash']);
        if (SPDEF_DOWN.has(_nm) && Math.random() < 0.30 && _nm !== 'lumina-crash') {
          updatedEnemyFinal.stages = { ..._es, spDef: Math.max(-6, (_es.spDef || 0) - 1) };
          addLog(`📉 Def. Especial de ${updatedEnemyFinal.name} caiu!`, 'enemy');
        }
        // Baixar Defesa (30%)
        const DEF_DOWN = new Set(['crunch','crush-claw','shadow-ball','brick-break','rock-smash',
          'razor-shell','sacred-sword']);
        if (DEF_DOWN.has(_nm) && Math.random() < 0.30) {
          updatedEnemyFinal.stages = { ..._es, defense: Math.max(-6, (_es.defense || 0) - 1) };
          addLog(`📉 Defesa de ${updatedEnemyFinal.name} caiu!`, 'enemy');
        }
        // Nuzzle: sempre paralisa
        if (_nm === 'nuzzle' && !_enemySt.includes('paralyze')) {
          updatedEnemyFinal.status = [..._enemySt, 'paralyze'];
          addLog(`⚡ ${updatedEnemyFinal.name} foi paralisado!`, 'enemy');
        }
      }
      // ── Fim dos Efeitos Secundários ────────────────────────────────────────


      // Life Orb: -8% HP do atacante após dano
      const myHeldItem = updatedTeamFinal[activeMemberIndex]?.heldItem;
      if (myHeldItem === 'life_orb' && updatedEnemyFinal.hp !== (currentEnemy?.hp)) {
        const recoil = Math.max(1, Math.floor((updatedTeamFinal[activeMemberIndex].maxHp || 30) * 0.08));
        updatedTeamFinal[activeMemberIndex].hp = Math.max(1, updatedTeamFinal[activeMemberIndex].hp - recoil);
        addLog(`💥 ${updatedTeamFinal[activeMemberIndex].name} sofreu recuo do Life Orb! (-${recoil} HP)`, 'system');
      }

      // Dano de Status (Inimigo)
      if (enemyStatus.includes('poison') || enemyStatus.includes('burn') || enemyStatus.includes('toxic')) {
        let dot;
        if (enemyStatus.includes('toxic')) {
          const tTurns = updatedEnemyFinal.toxicTurns || 1;
          dot = Math.max(1, Math.floor((updatedEnemyFinal.maxHp / 16) * tTurns));
          updatedEnemyFinal.toxicTurns = tTurns + 1;
        } else {
          dot = Math.max(1, Math.floor(updatedEnemyFinal.maxHp / 16));
        }
        updatedEnemyFinal.hp = updatedEnemyFinal.isWorldBoss
          ? Math.max(1, updatedEnemyFinal.hp - dot)
          : Math.max(0, updatedEnemyFinal.hp - dot);

        if (updatedEnemyFinal.isWorldBoss) {
          setBossDamage(prev => {
            const newVal = prev + dot;
            setGameState(state => ({
              ...state,
              bossTotalDamage: Math.max(state.bossTotalDamage || 0, newVal),
              bossLastDamage: newVal
            }));
            debouncedSaveBossDamage(newVal);
            return newVal;
          });
        }

        const _statusDotLabel = enemyStatus.includes('toxic') ? '☠️ Veneno Grave' : enemyStatus.includes('burn') ? '🔥 Queimadura' : '☠️ Veneno';
        addLog(`${_statusDotLabel}: ${updatedEnemyFinal.name} sofreu ${dot} de dano!`, 'enemy');
      }

      // Semente Sanguessuga (Inimigo)
      if (enemyStatus.includes('leech-seed')) {
        const _lsDmg = Math.max(1, Math.floor((updatedEnemyFinal.maxHp || 30) / 8));
        updatedEnemyFinal.hp = updatedEnemyFinal.isWorldBoss
          ? Math.max(1, updatedEnemyFinal.hp - _lsDmg)
          : Math.max(0, updatedEnemyFinal.hp - _lsDmg);
        const _healTarget = updatedTeamFinal[activeMemberIndex];
        if (_healTarget && _healTarget.hp > 0) {
          updatedTeamFinal[activeMemberIndex].hp = Math.min(_healTarget.maxHp, _healTarget.hp + _lsDmg);
          addLog(`🌱 Semente Sanguessuga drenou ${_lsDmg} HP de ${updatedEnemyFinal.name}!`, 'system');
          addFloat(`+${_lsDmg} HP`, '#22c55e', 'player');
        }
      }

      // Turno do Inimigo (apenas se ainda estiver vivo)
      if (updatedEnemyFinal.hp > 0) {
        let canAct = true;

        if (enemyStatus.includes('confuse')) {
          addLog(`💫 ${updatedEnemyFinal.name} está confuso...`, 'enemy');
          if (Math.random() < 0.3) {
            updatedEnemyFinal.status = enemyStatus.filter(s => s !== 'confuse');
            addLog(`✨ ${updatedEnemyFinal.name} não está mais confuso!`, 'enemy');
          } else if (Math.random() < 0.5) {
            const selfDmg = Math.max(1, Math.floor(updatedEnemyFinal.maxHp / 10));
            updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - selfDmg);
            addLog(`💥 ${updatedEnemyFinal.name} feriu-se em sua confusão!`, 'enemy');
            canAct = false;
          }
        }

        if (canAct && enemyStatus.includes('freeze')) {
          addLog(`❄️ ${updatedEnemyFinal.name} está congelado!`, 'enemy');
          if (Math.random() < 0.20) {
            updatedEnemyFinal.status = (updatedEnemyFinal.status || []).filter(s => s !== 'freeze');
            addLog(`🔥 ${updatedEnemyFinal.name} se descongelou!`, 'enemy');
          } else {
            canAct = false;
          }
        }

        if (canAct) {
          if (enemyStatus.includes('paralyze') && Math.random() < 0.25) {
            addLog(`⚡ ${updatedEnemyFinal.name} está paralisado!`, 'enemy');
          } else if (enemyStatus.includes('sleep')) {
            addLog(`💤 ${updatedEnemyFinal.name} está dormindo...`, 'enemy');
            if (Math.random() < 0.35) {
              updatedEnemyFinal.status = enemyStatus.filter(s => s !== 'sleep');
              addLog(`☀️ ${updatedEnemyFinal.name} acordou!`, 'enemy');
            }
          } else {
            const enemyMoves = updatedEnemyFinal.moves || [];
            const enemyMove = enemyMoves[Math.floor(Math.random() * (enemyMoves.length || 1))];
            
            if (enemyMove) {
            if (enemyMove.category === 'Status' || enemyMove.power === 0) {
              const enemyWeatherChanged = activateWeatherFromMove(enemyMove, updatedEnemyFinal.name);
              if (enemyWeatherChanged) weatherChangedThisTick = true;
              const fxE = interpretMoveEffect(enemyMove);
              window.dispatchEvent(new CustomEvent('pokemove', {
                detail: {
                  name: enemyMove.name,
                  type: enemyMove.type,
                  category: enemyMove.category || 'Status',
                  power: enemyMove.power || 0,
                  direction: 'enemy-to-player',
                  moveKey: enemyMove.moveId || enemyMove.key,
                  isStatus: true,
                  noEffect: fxE.noEffect && !enemyWeatherChanged,
                  heal: !!fxE.heal,
                  ohko: !!fxE.ohko,
                  fixedDamage: fxE.fixedDamage,
                  statusEffect: fxE.statusEffect,
                  statChanges: fxE.statChanges || [],
                  weatherChanged: enemyWeatherChanged,
                }
              }));

              if (fxE.noEffect || fxE.heal) {
                if (fxE.heal) {
                  const healed = Math.floor((updatedEnemyFinal.maxHp || 30) * 0.5);
                  updatedEnemyFinal.hp = Math.min(updatedEnemyFinal.maxHp, updatedEnemyFinal.hp + healed);
                  addLog(`💚 ${updatedEnemyFinal.name} usou ${enemyMove.name}! Recuperou ${healed} HP!`, 'enemy');
                } else if (!enemyWeatherChanged) {
                  addLog(`${updatedEnemyFinal.name} usou ${enemyMove.name}... sem efeito aqui.`, 'enemy');
                }
              } else if (fxE.ohko) {
                updatedTeamFinal[activeMemberIndex].hp = 0;
                addLog(`💥 ${updatedEnemyFinal.name} usou ${enemyMove.name}! Golpe decisivo!`, 'enemy');
              } else if (fxE.fixedDamage !== null) {
                let dmgE = 0;
                if (fxE.fixedDamage === 'level') dmgE = (updatedEnemyFinal.level || 5);
                else if (fxE.fixedDamage === 'psywave') dmgE = Math.floor((updatedEnemyFinal.level || 5) * (0.5 + Math.random()));
                else if (fxE.fixedDamage === 'half_hp') dmgE = Math.max(1, Math.floor(updatedTeamFinal[activeMemberIndex].hp / 2));
                else dmgE = fxE.fixedDamage;

                updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - dmgE);
                addLog(`${updatedEnemyFinal.name} usou ${enemyMove.name}! ${dmgE} de dano!`, 'enemy');
                addFloat(`-${dmgE}`, '#ef4444', 'player');
              } else {
                fxE.statChanges.forEach(c => {
                  const statNames = { attack:'ATK', defense:'DEF', spAtk:'SATK', spDef:'SDEF', speed:'SPD' };
                  if (c.target === 'self') {
                    const cur = updatedEnemyFinal.stages?.[c.stat] || 0;
                    updatedEnemyFinal.stages = { ...updatedEnemyFinal.stages, [c.stat]: Math.max(-6, Math.min(6, cur + c.change)) };
                    addLog(`⚠️ ${updatedEnemyFinal.name} usou ${enemyMove.name}! ${statNames[c.stat]||c.stat} ${c.change > 0 ? 'subiu' : 'caiu'}!`, 'enemy');
                  } else {
                    const cur = updatedTeamFinal[activeMemberIndex].stages?.[c.stat] || 0;
                    updatedTeamFinal[activeMemberIndex] = { ...updatedTeamFinal[activeMemberIndex], stages: { ...updatedTeamFinal[activeMemberIndex].stages, [c.stat]: Math.max(-6, Math.min(6, cur + c.change)) } };
                    addLog(`⚠️ ${updatedEnemyFinal.name} usou ${enemyMove.name}! ${statNames[c.stat]||c.stat} de ${updatedTeamFinal[activeMemberIndex].name} ${c.change < 0 ? 'caiu' : 'subiu'}!`, 'enemy');
                  }
                });

                if (fxE.accuracy_change) {
                  const cur = updatedTeamFinal[activeMemberIndex].stages?.accuracy || 0;
                  updatedTeamFinal[activeMemberIndex] = { ...updatedTeamFinal[activeMemberIndex], stages: { ...updatedTeamFinal[activeMemberIndex].stages, accuracy: Math.max(-6, Math.min(6, cur + fxE.accuracy_change.change)) } };
                  addLog(`⚠️ ${updatedEnemyFinal.name} usou ${enemyMove.name}! Precisão de ${updatedTeamFinal[activeMemberIndex].name} caiu!`, 'enemy');
                }

                if (fxE.statusEffect) {
                  const statusNames = { burn:'🔥 Queimadura', poison:'☠️ Veneno', toxic:'☠️ Veneno Grave', sleep:'💤 Sono', paralyze:'⚡ Paralisia', confuse:'💫 Confusão', freeze:'❄️ Congelamento' };
                  const myStatusList = updatedTeamFinal[activeMemberIndex].status || [];
                  const _eAlreadyHas = myStatusList.some(s => s === 'poison' || s === 'toxic' || s === fxE.statusEffect);
                  if (!_eAlreadyHas) {
                    updatedTeamFinal[activeMemberIndex].status = [...myStatusList, fxE.statusEffect];
                    if (fxE.statusEffect === 'toxic') updatedTeamFinal[activeMemberIndex].toxicTurns = 1;
                    addLog(`${statusNames[fxE.statusEffect]||fxE.statusEffect}: ${updatedTeamFinal[activeMemberIndex].name} foi afetado!`, 'system');
                  }
                }

                if (fxE.leechSeed) {
                  const myStatusList = updatedTeamFinal[activeMemberIndex].status || [];
                  if (!myStatusList.includes('leech-seed')) {
                    updatedTeamFinal[activeMemberIndex].status = [...myStatusList, 'leech-seed'];
                    addLog(`🌱 ${updatedEnemyFinal.name} usou ${enemyMove.name}! ${updatedTeamFinal[activeMemberIndex].name} foi semeado!`, 'enemy');
                  } else {
                    addLog(`${updatedEnemyFinal.name} usou ${enemyMove.name}... mas não surtiu efeito!`, 'enemy');
                  }
                }
              }
            } else {
              const enemyDmgRaw = calcDamage(updatedEnemyFinal, enemyMove, updatedTeamFinal[activeMemberIndex]);

              // Dispara evento de animação do golpe inimigo
              const effE = getTypeEffectiveness(enemyMove.type, updatedTeamFinal[activeMemberIndex].type);
              window.dispatchEvent(new CustomEvent('pokemove', {
                detail: {
                  name: enemyMove.name,
                  type: enemyMove.type,
                  category: enemyMove.category || 'Physical',
                  power: enemyMove.power || 0,
                  direction: 'enemy-to-player',
                  moveKey: enemyMove.moveId || enemyMove.key,
                  damage: enemyDmgRaw,
                  missed: enemyDmgRaw === 0 && effE > 0,
                  effectiveness: effE,
                  noEffect: effE === 0,
                }
              }));
              
              if (enemyDmgRaw === 0 && effE > 0) {
                 addLog(`${updatedEnemyFinal.name} usou ${enemyMove.name}... mas errou!`, 'enemy');
              } else {
                let enemyDmg = Math.max(1, Math.floor(enemyDmgRaw * 0.75));
                if (allyBonus?.defenseMult) enemyDmg = Math.floor(enemyDmg * (2 - allyBonus.defenseMult));
                updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - enemyDmg);
                addFloat(`-${enemyDmg}`, '#ef4444', 'player');
                if (effE > 1) addLog("💥 É super efetivo!", 'enemy');
                if (effE > 0 && effE < 1) addLog("💢 Não é muito efetivo!", 'enemy');
                if (effE === 0) addLog("🚫 Não afetou seu Pokemon!", 'enemy');

                // Efeitos Secundários do Inimigo
                if (enemyDmg > 0 && effE > 0) {
                  const _eNm = (enemyMove.name || '').toLowerCase().replace(/ /g, '-');
                  const _eType = (enemyMove.type || '').toLowerCase();
                  const _pSt = updatedTeamFinal[activeMemberIndex].status || [];

                  // Queimadura (10% de golpes de Fogo)
                  if (!_pSt.includes('burn') && _eType === 'fire' && Math.random() < 0.10) {
                    updatedTeamFinal[activeMemberIndex].status = [..._pSt, 'burn'];
                    addLog(`🔥 ${updatedTeamFinal[activeMemberIndex].name} foi queimado!`, 'enemy');
                  }
                  // Paralisia (10% de golpes Elétricos)
                  else if (!_pSt.includes('paralyze') && _eType === 'electric' && Math.random() < 0.10) {
                    updatedTeamFinal[activeMemberIndex].status = [..._pSt, 'paralyze'];
                    addLog(`⚡ ${updatedTeamFinal[activeMemberIndex].name} foi paralisado!`, 'enemy');
                  }
                  // Congelamento (10% de golpes de Gelo)
                  else if (!_pSt.includes('freeze') && _eType === 'ice' && Math.random() < 0.10) {
                    updatedTeamFinal[activeMemberIndex].status = [..._pSt, 'freeze'];
                    addLog(`❄️ ${updatedTeamFinal[activeMemberIndex].name} foi congelado!`, 'enemy');
                  }
                  // Veneno (10% de golpes Venenosos)
                  else if (!_pSt.includes('poison') && !_pSt.includes('toxic') && _eType === 'poison' && Math.random() < 0.10) {
                    updatedTeamFinal[activeMemberIndex].status = [..._pSt, 'poison'];
                    addLog(`☠️ ${updatedTeamFinal[activeMemberIndex].name} foi envenenado!`, 'enemy');
                  }

                  // Dreno: inimigo cura 50% do dano causado
                  const ENEMY_DRAIN = new Set(['giga-drain','mega-drain','absorb','leech-life','drain-punch','draining-kiss','oblivion-wing','parabolic-charge']);
                  if (ENEMY_DRAIN.has(_eNm)) {
                    const _eDrainAmt = Math.max(1, Math.floor(enemyDmg * 0.5));
                    updatedEnemyFinal.hp = Math.min(updatedEnemyFinal.maxHp, updatedEnemyFinal.hp + _eDrainAmt);
                    addLog(`💚 ${updatedEnemyFinal.name} absorveu ${_eDrainAmt} HP!`, 'enemy');
                  }

                  // Recuo: inimigo perde HP por recuo
                  const ENEMY_RECOIL25 = new Set(['take-down','submission','double-edge','brave-bird','wood-hammer','head-smash','wild-charge','flare-blitz','head-charge','high-jump-kick','jump-kick']);
                  const ENEMY_RECOIL33 = new Set(['volt-tackle','struggle']);
                  if (ENEMY_RECOIL33.has(_eNm)) {
                    const _eRecoil = Math.max(1, Math.floor(enemyDmg / 3));
                    updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - _eRecoil);
                    addLog(`💥 ${updatedEnemyFinal.name} sofreu recuo! (-${_eRecoil} HP)`, 'enemy');
                  } else if (ENEMY_RECOIL25.has(_eNm)) {
                    const _eRecoil = Math.max(1, Math.floor(enemyDmg / 4));
                    updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - _eRecoil);
                    addLog(`💥 ${updatedEnemyFinal.name} sofreu recuo! (-${_eRecoil} HP)`, 'enemy');
                  }
                }
              }
            }
          }
        }
        }
      }

      // Focus Sash: sobrevive a um golpe fatal com 1 HP (uma vez por batalha se HP era > 1)
      const focusPoke = updatedTeamFinal[activeMemberIndex];
      if (focusPoke?.heldItem === 'focus_sash' && focusPoke.hp <= 0 && myPoke.hp > 1) {
        updatedTeamFinal[activeMemberIndex].hp = 1;
        addLog(`🔮 Focus Sash protegeu ${myPoke.name}! Sobreviveu com 1 HP!`, 'system');
        addFloat('Focus Sash!', '#a78bfa', 'player');
      }

      // Dano de Status (Jogador)
      if (myStatus.includes('poison') || myStatus.includes('burn') || myStatus.includes('toxic')) {
        let _myDot;
        if (myStatus.includes('toxic')) {
          const _myToxTurns = updatedTeamFinal[activeMemberIndex].toxicTurns || 1;
          _myDot = Math.max(1, Math.floor((updatedTeamFinal[activeMemberIndex].maxHp / 16) * _myToxTurns));
          updatedTeamFinal[activeMemberIndex].toxicTurns = _myToxTurns + 1;
        } else {
          _myDot = Math.max(1, Math.floor(updatedTeamFinal[activeMemberIndex].maxHp / 16));
        }
        updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - _myDot);
        const _myStatusLabel = myStatus.includes('toxic') ? '☠️ Veneno Grave' : myStatus.includes('burn') ? '🔥 Queimadura' : '☠️ Veneno';
        addLog(`${_myStatusLabel}: ${myPoke.name} sofreu ${_myDot} de dano!`, 'system');
      }

      // Semente Sanguessuga (Jogador)
      if (myStatus.includes('leech-seed')) {
        const _myLsDmg = Math.max(1, Math.floor((updatedTeamFinal[activeMemberIndex].maxHp || 30) / 8));
        updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - _myLsDmg);
        if (updatedEnemyFinal.hp > 0) {
          updatedEnemyFinal.hp = Math.min(updatedEnemyFinal.maxHp, updatedEnemyFinal.hp + _myLsDmg);
          addLog(`🌱 Semente Sanguessuga drenou ${_myLsDmg} HP de ${myPoke.name}!`, 'system');
          addFloat(`-${_myLsDmg}`, '#ef4444', 'player');
        }
      }

      // ── Dano Passivo de Clima ─────────────────────────────────────────────
      const passiveWeatherDmg = WEATHER_PASSIVE_DAMAGE[weather] || 0;
      if (passiveWeatherDmg > 0 && updatedTeamFinal[activeMemberIndex].hp > 0) {
        const immuneTypes = WEATHER_IMMUNE_TYPES[weather] || [];
        const pokeTypes = updatedTeamFinal[activeMemberIndex].types || [updatedTeamFinal[activeMemberIndex].type];
        const isWeatherImmune = pokeTypes.some(t => immuneTypes.includes(t));
        if (!isWeatherImmune) {
          const weatherDot = Math.max(1, Math.floor(updatedTeamFinal[activeMemberIndex].maxHp * passiveWeatherDmg));
          updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - weatherDot);
          const weatherEmoji = weather === 'sandstorm' ? '🌪️' : '🌨️';
          addLog(`${weatherEmoji} ${updatedTeamFinal[activeMemberIndex].name} sofreu dano do clima!`, 'system');
        }
      }
      // ─────────────────────────────────────────────────────────────────────

      if (weatherTurns > 0 && !weatherChangedThisTick) {
        setWeatherTurns(prevTurns => {
          const nextTurns = Math.max(0, prevTurns - 1);
          if (nextTurns === 0) {
            const routeWeather = generateWeatherForRoute(processedRoutes[prev.currentRoute]);
            setWeather(routeWeather);
            addLog(routeWeather === 'none' ? 'O clima voltou ao normal.' : 'O clima natural da rota voltou.', 'system');
          }
          return nextTurns;
        });
      }

      // Leftovers: recupera 5% HP por turno
      if (focusPoke?.heldItem === 'leftovers' && focusPoke.hp > 0) {
        const regen = Math.max(1, Math.floor((focusPoke.maxHp || 30) * 0.05));
        const newHp = Math.min(focusPoke.maxHp, (updatedTeamFinal[activeMemberIndex].hp || 0) + regen);
        if (newHp > (updatedTeamFinal[activeMemberIndex].hp || 0)) {
          updatedTeamFinal[activeMemberIndex].hp = newHp;
          addFloat(`+${regen} HP`, '#22c55e', 'player');
        }
      }

      // SISTEMA DE EXAUSTAO
      const STAMINA_DRAIN  = 0.4;   // % perdida por tick
      const EXHAUSTION_DMG = 0.02;  // % do maxHp perdida por tick quando exausto
      const autoStamEnabled = prev.autoCaptureConfig?.autoStamina;
      // PROTECTED: Sistema de Exaustao - NAO EDITAR SEM AUTORIZACAO EXPLICITA
      const FEED_THRESHOLD = prev.autoCaptureConfig?.staminaThreshold || prev.autoCaptureConfig?.autoStaminaThreshold || 30;

      const currentStamina = prev.stamina?.[myPoke.instanceId]?.value ?? 100;
      let newStamina = Math.max(0, currentStamina - STAMINA_DRAIN);

      // Exausto: perde HP
      if (currentStamina <= 0) {
        const hpDrain = Math.max(1, Math.ceil(
          (updatedTeamFinal[activeMemberIndex].maxHp || 30) * EXHAUSTION_DMG
        ));
        updatedTeamFinal[activeMemberIndex] = {
          ...updatedTeamFinal[activeMemberIndex],
          hp: Math.max(0, (updatedTeamFinal[activeMemberIndex].hp || 0) - hpDrain),
        };
        if (Math.random() < 0.25) {
          addLog(`${myPoke.name} esta exausto! Perdendo vida por falta de comida!`, 'system');
        }
      }

      let finalInventory = { ...prev.inventory };
      let staminaEntry = { value: newStamina, lastFed: prev.stamina?.[myPoke.instanceId]?.lastFed || Date.now() };

      // Auto-alimentar quando abaixo do limiar (apenas se autoStamina estiver ON)
      if (autoStamEnabled && newStamina < FEED_THRESHOLD) {
        // Prioridade: moomoo_milk -> lemonade -> soda_pop -> berry_juice -> poke_food_premium -> fresh_water -> poke_food -> berries
        const feedPriority = [
          { key: 'moomoo_milk',       src: 'items'     },
          { key: 'lemonade',          src: 'items'     },
          { key: 'soda_pop',          src: 'items'     },
          { key: 'berry_juice',       src: 'items'     },
          { key: 'poke_food_premium', src: 'items'     },
          { key: 'fresh_water',       src: 'items'     },
          { key: 'poke_food',         src: 'items'     },
          { key: 'sitrus_berry',      src: 'materials' },
          { key: 'oran_berry',        src: 'materials' },
          { key: 'lum_berry',         src: 'materials' },
          { key: 'cheri_berry',       src: 'materials' },
          { key: 'chesto_berry',      src: 'materials' },
          { key: 'pecha_berry',       src: 'materials' },
          { key: 'rawst_berry',       src: 'materials' },
          { key: 'aspear_berry',      src: 'materials' },
          { key: 'leppa_berry',       src: 'materials' },
        ];

        const food = feedPriority.find(f => {
          const bag = f.src === 'items' ? finalInventory?.items : finalInventory?.materials;
          return (bag?.[f.key] || 0) > 0;
        });

        if (food) {
          const restoreData = STAMINA_RESTORE_TABLE[food.key];
          newStamina = Math.min(100, newStamina + (restoreData?.restore || 25));

          const newBagContent = food.src === 'items'
            ? { ...finalInventory.items,     [food.key]: Math.max(0, (finalInventory.items?.[food.key]     || 0) - 1) }
            : { ...finalInventory.materials, [food.key]: Math.max(0, (finalInventory.materials?.[food.key] || 0) - 1) };

          finalInventory = food.src === 'items'
            ? { ...finalInventory, items: newBagContent }
            : { ...finalInventory, materials: newBagContent };

          staminaEntry = { value: newStamina, lastFed: Date.now() };
          const itemName = ITEM_LABELS[food.key]?.name || food.key;
          addLog(`${myPoke.name} comeu ${itemName} e recuperou energia!`, 'system');

          // Se curar status
          if (Array.isArray(restoreData?.cureStatus)) {
             const newStatus = updatedTeamFinal[activeMemberIndex].status.filter(s => !restoreData.cureStatus.includes(s));
             if (newStatus.length < updatedTeamFinal[activeMemberIndex].status.length) {
               updatedTeamFinal[activeMemberIndex].status = newStatus;
                addLog(`${myPoke.name} recuperou-se!`, 'system');
             }
          } else if (restoreData?.cureStatus) {
            updatedTeamFinal[activeMemberIndex].status = [];
            addLog(`${myPoke.name} foi curado de problemas de status!`, 'system');
          }
        } else {
          if (newStamina <= 0) {
            // Sem comida e chegou a 0 - forcar troca no proximo tick
            // O bloco no início do tick vai cuidar da troca/derrota
            if (Math.random() < 0.3) {
              addLog(
                `${myPoke.name} colapsou de fome! Sem itens para alimenta-lo!`,
                'system'
              );
            }
          } else if (newStamina < 20 && Math.random() < 0.25) {
            addLog(
              `${myPoke.name} esta faminto! Compre bebidas no Poke Mart ou cultive Berries!`,
              'system'
            );
          }
        }
      }

      setCurrentEnemy(updatedEnemyFinal);

      // Atualiza HP da raid com o dano acumulado
      let newActiveRaid = prev.activeRaid;
      if (raidDmgToApply > 0 && prev.activeRaid && prev.activeRaid.phase === 'fighting') {
        const raidNewHp = Math.max(0, prev.activeRaid.currentHp - raidDmgToApply);
        const raidHpPct = raidNewHp / prev.activeRaid.maxHp;
        
        let nextPhase = 'fighting';
        if (raidNewHp === 0) {
          nextPhase = 'rewards';
          addLog(`🏆 ${prev.activeRaid.name} foi TOTALMENTE DERROTADO! Recompensas liberadas.`, 'system');
          showRaidRouteNotice(prev.activeRaid, 'rewards');
        } else if (raidHpPct <= 0.3 && !prev.activeRaid.continuingFromCapture) {
          // Só entra em captura na primeira vez — se o jogador optou por continuar lutando,
          // não volta para captura; a luta segue até HP=0 ou o tempo esgotar.
          nextPhase = 'capture';
          addLog(`🎯 ${prev.activeRaid.name} está enfraquecido! Iniciando fase de captura!`, 'system');
          showRaidRouteNotice(prev.activeRaid, 'capture');
        }

        newActiveRaid = {
          ...prev.activeRaid,
          currentHp: raidNewHp,
          totalDamageDealt: prev.activeRaid.totalDamageDealt + raidDmgToApply,
          phase: nextPhase,
        };
      }

      return {
        ...prev,
        team: updatedTeamFinal,
        inventory: finalInventory,
        stamina: {
          ...prev.stamina,
          [myPoke.instanceId]: staminaEntry
        },
        activeRaid: newActiveRaid,
      };
    });

    setMoveIndex(m => m + 1);
    return nextDelay;
  }, [currentEnemy, activeMemberIndex, moveIndex, calcDamage, addFloat, setCurrentEnemy, gameState.team, gameState.stamina, gameState.settings, isStoryVsEnemy, openStoryBattleResult, processDrops, spawnEnemy, handleGoToCity, showRaidRouteNotice, weather, weatherTurns, processedRoutes, activateWeatherFromMove]);

  useAutoFarm(gameState.team[activeMemberIndex], gameState.currentRoute, handleBattleTick, battleReady);

  const handleUseItem = useCallback((itemId, source = 'items') => {
    if (currentViewRef.current !== 'battles' || !currentEnemy) return;
    
    setGameState(prev => {
      const bag = source === 'items' ? (prev.inventory?.items || {}) : (prev.inventory?.materials || {});
      if (!bag[itemId] || bag[itemId] <= 0) return prev;
      
      let newInventory = { 
        ...prev.inventory,
        [source]: { ...bag, [itemId]: bag[itemId] - 1 }
      };
      
      if (itemId === 'pokeballs' || itemId === 'great_ball' || itemId === 'ultra_ball') {
        if (currentEnemy.isTrainer || currentEnemy.isWildBoss) {
          const reason = currentEnemy.isWildBoss ? "Pokémons Chefões não podem ser capturados!" : "Você não pode capturar Pokémons de outros treinadores!";
          addLog(`🚫 ${reason}`, 'enemy');
          return prev;
        }
        if ((currentEnemy.types || [currentEnemy.type]).includes('Ghost') && !canCaptureGhostPokemon(prev)) {
          addLog('A energia fantasma ainda esta instavel. Avance por Lavender antes de capturar Pokemon Fantasma.', 'enemy');
          return prev;
        }

        let multiplier = 1.0;
        if (itemId === 'great_ball') multiplier = 1.5;
        if (itemId === 'ultra_ball') multiplier = 2.0;

        const catchRate = getCaptureRate(currentEnemy, multiplier, POKEDEX);
        if (Math.random() < catchRate) {
          addLog(`✨ Capturado! ${currentEnemy.name} agora é seu!`, 'system');
          if (currentEnemy.isShiny) {
            notify({ type: 'capture', title: '✨ SHINY capturado!', message: `${currentEnemy.name} brilhante foi capturado!`, duration: 6000 });
          }
          sfxCapture();
          sessionRef.current.captures.push({ name: currentEnemy.name, id: currentEnemy.id, isShiny: currentEnemy.isShiny });

          const newCaughtData = { ...(prev.caughtData || {}), [currentEnemy.id]: true };
          const newPoke = assignRandomAbility({ 
            ...currentEnemy, 
            id: Number(currentEnemy.id), 
            hp: currentEnemy.maxHp, 
            xp: 0, 
            instanceId: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            capturedRegion: prev.activeRegion || 'kanto',
            stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 }
          }, POKEDEX[Number(currentEnemy.id)]);
          const newMastery = processCaptureMastery({ ...currentEnemy, id: Number(currentEnemy.id) }, prev);
          
          const { questUpdate, log: questLog } = updateQuestProgress(prev, 'capture');
          if (questLog) addLog(questLog, 'drop');
          if (questUpdate.inventory) newInventory.items = questUpdate.inventory.items;


          // Unificação por Espécie: Se já tem na caughtData (antes dessa captura), apenas aumenta maestria
          const alreadyCaught = ownsSpecies(prev, currentEnemy.id);
          if (alreadyCaught) {
            addLog(`?? ${currentEnemy.name} j? capturado! Maestria aumentada.`, 'system');
            const findAndReplace = (list) => {
              let updated = false;
              const newList = list.map(p => {
                if (Number(p.id) === Number(currentEnemy.id)) {
                  updated = true;
                  if (currentEnemy.isShiny) {
                    const upgraded = applyShinyUpgrade(p, POKEDEX[Number(p.id)]);
                    const newCount = upgraded.shinyCount;
                    if (!p.isShiny) {
                      addLog(`✨ Upgrade Shiny! ${p.name} agora é Brilhante! (+20% stats)`, 'system');
                    } else {
                      addLog(`✨ Shiny Stack x${newCount}! ${p.name} ficou ainda mais forte! (+${Math.round((1.2 + (newCount-1)*0.05 - 1)*100)}% total)`, 'system');
                    }
                    return upgraded;
                  }
                }
                return p;
              });
              return { newList, updated };
            };
            let { newList: teamUpdate } = findAndReplace(prev.team);
            let { newList: pcUpdate } = findAndReplace(prev.pc || []);
            setTimeout(() => spawnEnemy(), 1000);
            return {
              ...prev,
              inventory: newInventory,
              speciesMastery: newMastery,
              caughtData: newCaughtData,
              team: teamUpdate,
              pc: pcUpdate,
              shinyCapturedCount: (prev.shinyCapturedCount || 0) + (currentEnemy.isShiny ? 1 : 0),
              playerStats: bumpPlayerStats(prev.playerStats, {
                pokemonCaptured: 1,
                shinyCaptured: currentEnemy.isShiny ? 1 : 0,
              }),
              ...questUpdate
            };
          }

          // Primeira Captura
          const newTeam = [...prev.team];
          const newPC = [...(prev.pc || [])];
          
          if (newTeam.length < 6) {
            newTeam.push(newPoke);
          } else {
            newPC.push(newPoke);
            addLog(`${newPoke.name} foi enviado para o PC!`, 'system');
          }

          setTimeout(() => spawnEnemy(), 1000);
          return {
            ...prev,
            inventory: newInventory,
            team: newTeam,
            pc: newPC,
            caughtData: newCaughtData,
            speciesMastery: newMastery,
            shinyCapturedCount: (prev.shinyCapturedCount || 0) + (currentEnemy.isShiny ? 1 : 0),
            playerStats: bumpPlayerStats(prev.playerStats, {
              pokemonCaptured: 1,
              shinyCaptured: currentEnemy.isShiny ? 1 : 0,
            }),
            ...questUpdate
          };
        } else {
          const enemyName = currentEnemy.name || 'Desconhecido';
          addLog(`💨 O ${enemyName} escapou da Pokébola!`, 'enemy');
        }
      } else if (itemId === 'potions') {
        const activePoke = prev.team[activeMemberIndex];
        if (activePoke) {
          const newTeam = prev.team.map((p, i) => i === activeMemberIndex ? { ...p, hp: Math.min(p.maxHp, p.hp + 20) } : p);
          addLog(`🥤 Usou Poção em ${activePoke.name}!`, 'system');
          return { ...prev, inventory: newInventory, team: newTeam };
        }
      } else if (STAMINA_RESTORE_TABLE[itemId]) {
        const activePoke = prev.team[activeMemberIndex];
        if (activePoke) {
          const restoreData = STAMINA_RESTORE_TABLE[itemId];
          const currentStam = prev.stamina?.[activePoke.instanceId]?.value ?? 100;
          const newStamVal = Math.min(100, currentStam + restoreData.restore);
          
          let updatedPoke = { ...activePoke };
          if (Array.isArray(restoreData.cureStatus)) {
            updatedPoke.status = activePoke.status.filter(s => !restoreData.cureStatus.includes(s));
          } else if (restoreData.cureStatus) {
            updatedPoke.status = [];
          }

          const newTeam = prev.team.map((p, i) => i === activeMemberIndex ? updatedPoke : p);
          const itemName = ITEM_LABELS[itemId]?.name || itemId;
          addLog(`<t ${activePoke.name} consumiu ${itemName}! Energia restaurada.`, 'system');

          return { 
            ...prev, 
            inventory: newInventory, 
            team: newTeam,
            stamina: {
              ...prev.stamina,
              [activePoke.instanceId]: {
                ...(prev.stamina?.[activePoke.instanceId] || {}),
                value: newStamVal,
                lastFed: Date.now()
              }
            }
          };
        }
      }
      
      // ── 3. ITENS DE BUFF DE BATALHA ─────────────────────────────────────
      if (['x_attack', 'x_defense', 'x_speed', 'dire_hit'].includes(itemId)) {
        const activePoke = prev.team[activeMemberIndex];
        if (!activePoke) return prev;
        const BUFF_STAGE_MAP = { x_attack: 'attack', x_defense: 'defense', x_speed: 'speed' };
        const BUFF_LABELS    = { x_attack: ['⚔️','X-Atk'], x_defense: ['🛡️','X-Def'], x_speed: ['⚡','X-Speed'], dire_hit: ['🎯','Dire Hit'] };
        const [icon, label] = BUFF_LABELS[itemId];
        const stat = BUFF_STAGE_MAP[itemId];
        if (stat) {
          const cur = activePoke.stages?.[stat] || 0;
          if (cur >= 6) { addLog(`${icon} ${activePoke.name} já está no máximo de ${label}!`, 'system'); return prev; }
          const newTeam = prev.team.map((p, i) => i === activeMemberIndex
            ? { ...p, stages: { ...(p.stages || {}), [stat]: cur + 1 } } : p);
          addLog(`${icon} ${label}! ${activePoke.name} ficou mais forte! (+${cur + 1})`, 'system');
          return { ...prev, inventory: newInventory, team: newTeam };
        } else {
          // Dire Hit → activeEffect de crit boost (5 minutos)
          const newEffects = {
            ...(prev.activeEffects || {}),
            activeDireHit: {
              key: 'activeDireHit', endsAt: Date.now() + 300_000,
              name: 'Dire Hit', durationLabel: '5min',
              icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dire-hit.png',
              critBoost: true,
            }
          };
          addLog(`🎯 Dire Hit! Probabilidade de crítico de ${activePoke.name} aumentou!`, 'system');
          return { ...prev, inventory: newInventory, activeEffects: newEffects };
        }
      }

      // ── 4. EFEITOS TEMPORÁRIOS (TIMED EFFECTS) ──────────────────────────
      const allRecipes = Object.values(CRAFTING_RECIPES).flat();
      const recipe = allRecipes.find(r => r.id === itemId);
      
      if (recipe?.effect?.type === 'timed') {
        const newItems = { ...prev.inventory.items };
        if (!newItems[itemId] || newItems[itemId] <= 0) return prev;
        newItems[itemId] -= 1;

        const newEffects = {
          ...(prev.activeEffects || {}),
          [recipe.effect.key]: {
            ...recipe.effect,
            endsAt: Date.now() + recipe.effect.duration,
            name: recipe.name,
            icon: recipe.img,
            durationLabel: recipe.durationLabel,
          },
        };

        addLog(`( ${recipe.name} ativado por ${recipe.durationLabel}!`, 'system');

        return {
          ...prev,
          inventory: { ...prev.inventory, items: newItems },
          activeEffects: newEffects,
        };
      }
      
      return { ...prev, inventory: newInventory };
    });
  }, [currentEnemy, activeMemberIndex, addLog, spawnEnemy]);

  const startKeyBattle = useCallback((battleData) => {
    const teamMember = (battleData.team && battleData.team.length > 0) ? battleData.team[0] : null;
    if (!teamMember) return;
    const base = POKEDEX[teamMember.id];
    if (!base) return;

    const lvl = teamMember.level || 5;
    const baseMult = 1.15; // Bosses are stronger but balanced
    const maxHp = Math.ceil((((2 * (base.maxHp || base.hp || 50) * lvl) / 100) + lvl + 10) * baseMult);
    const getStat = (b) => Math.ceil((((2 * (b || 10) * lvl) / 100) + 5) * baseMult);
    
    const boss = {
      ...base,
      instanceId: `boss-${Date.now()}`,
      level: lvl,
      hp: maxHp,
      maxHp: maxHp,
      attack: getStat(base.attack),
      defense: getStat(base.defense),
      spAtk: getStat(base.spAtk),
      spDef: getStat(base.spDef),
      speed: getStat(base.speed),
      status: [],
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
      learnset: base.learnset || []
    };

    // Golpes baseados no learnset
    const learnset = base.learnset || [];
    const availableMoves = learnset
      .filter(m => m.level <= lvl)
      .map(m => {
        const mk = (m.move || '').toLowerCase();
        const md = MOVES[mk] || { name: m.move, power: 40, type: 'Normal', category: 'Physical' };
        return { ...md, name: MOVE_TRANSLATIONS[mk] || md.name || m.move };
      });
    const finalMoves = availableMoves.length > 0 ? availableMoves.slice(-4) : [{ name: 'Investida', power: 40, type: 'Normal', category: 'Physical' }];

    setCurrentEnemy({
      ...boss,
      pokemonName: base.name, // Nome da espécie fixo
      moves: finalMoves,
      isTrainer: true,
      trainerName: battleData.name,
      trainerSprite: battleData.sprite,
      trainerReward: battleData.reward || 500,
      isBoss: true,
      isRocket: battleData.category === 'rocket',
      isLegendary: battleData.category === 'legendary',
      challengeCategory: battleData.category,
      unlockFlag: battleData.unlockFlag,
      badgeToGive: battleData.badgeToGive || (battleData.unlockFlag?.endsWith('_badge') ? battleData.unlockFlag : null),
      spawnTime: Date.now(),
      opponentTeam: battleData.team,
      opponentTeamIndex: 0,
      background: battleData.background || null,
      locationName: battleData.location || battleData.name,
      gymId: battleData.id,
    });
    setCurrentView('battles');
    // BGM agora gerenciado pelas configurações
    addLog(`🚀 DESAFIO: ${battleData.name} iniciou a batalha!`, 'system');
    isProcessingVictory.current = false;
  }, [setCurrentEnemy, setCurrentView, addLog, POKEDEX, MOVES, MOVE_TRANSLATIONS]);

  const handleChallenge = useCallback((battleData, type) => {
    if (type === 'boss') {
      setBossDamage(0);
      const teamMember = battleData.mainPokemon || (battleData.team && battleData.team.length > 0 ? battleData.team[0] : null);
      if (!teamMember) return;

      const base = POKEDEX[teamMember.id];
      if (!base) return;

      const lvl = 100; 
      const hpMult = 250000; // HP virtualmente inesgotavel: o desafio termina pelo timer de 120s
      const statMult = 2.0; // +100% em ATK/DEF para tornar o boss realmente intimidador

      const baseHp = Math.ceil((((2 * (base.maxHp || base.hp || 50) * lvl) / 100) + lvl + 10));
      const maxHp = Math.max(99999999, baseHp * hpMult);
      const getStat = (b) => Math.ceil((((2 * (b || 10) * lvl) / 100) + 5) * statMult);

      const boss = {
        ...base,
        instanceId: `worldboss-${Date.now()}`,
        level: '???',
        hp: maxHp,
        maxHp: maxHp,
        attack: getStat(base.attack),
        defense: getStat(base.defense),
        spAtk: getStat(base.spAtk),
        spDef: getStat(base.spDef),
        speed: getStat(base.speed),
        status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
        learnset: base.learnset || []
      };

      const finalMoves = (base.learnset || []).slice(-4).map(m => {
        const mk = (m.move || '').toLowerCase();
        const md = MOVES[mk] || { name: m.move, power: 40, type: 'Normal', category: 'Physical' };
        return { ...md, name: MOVE_TRANSLATIONS[mk] || md.name || m.move };
      });

      setCurrentEnemy({
        ...boss,
        pokemonName: base.name,
        moves: finalMoves,
        isTrainer: true,
        trainerName: battleData.name,
        trainerSprite: battleData.sprite,
        isBoss: true,
        isWorldBoss: true,
        bossType: battleData.bossType,
        background: battleData.background,
        locationName: "Fenda Dimensional",
        spawnTime: Date.now(),
        opponentTeam: [boss],
        opponentTeamIndex: 0
      });
      setCurrentView('battles');
      addLog(`⚠️ ALERTA: ${battleData.name} emergiu da fenda! HP SEGMENTADO DETECTADO!`, 'system');
      setBossTimer(WORLD_BOSS_FIGHT_SECONDS);
      return;
    }
    
    // Fallback para lutas de rivais de rota
    startKeyBattle(battleData);
  }, [POKEDEX, MOVES, MOVE_TRANSLATIONS, setCurrentEnemy, setCurrentView, addLog, startKeyBattle]);

  const handleChallengeGym = useCallback((gymData) => {
    const defeatCount = gameState.gymDefeatCounts?.[gymData.id] || 0;
    const isEliteFour = ['lorelei', 'bruno', 'agatha', 'lance', 'blue'].includes(gymData.id);
    
    // Equipe Evoluída se já foi derrotado
    const teamList = (defeatCount > 0 && gymData.rematchTeam) ? gymData.rematchTeam : (gymData.team || []);
    const leaderPoke = teamList[0];
    if (!leaderPoke) return;
    const base = POKEDEX[leaderPoke.id];
    if (!base) return;

    // Nível escala com derrotas (+5 por vitória, cap 100)
    const originalLvl = leaderPoke.level || 20;
    const lvl = Math.min(100, originalLvl + (defeatCount * 5));

    // Dificuldade base: Elite Four (1.25) > Ginasio (1.1)
    // Multiplicador escala 10% por vitória
    const baseDifficulty = isEliteFour ? 1.25 : 1.1;
    const scalingMult = 1 + (defeatCount * 0.1);
    const finalMult = baseDifficulty * scalingMult;

    const maxHp = Math.ceil((((2 * (base.maxHp || base.hp || 50) * lvl) / 100) + lvl + 10) * finalMult);
    const getStat = (b) => Math.ceil((((2 * (b || 10) * lvl) / 100) + 5) * finalMult);
          
    const leaderPokeFinal = {
      ...base,
      instanceId: `gym-${gymData.id}-${0}-${Date.now()}`,
      level: lvl,
      hp: maxHp,
      maxHp: maxHp,
      attack: getStat(base.attack),
      defense: getStat(base.defense),
      spAtk: getStat(base.spAtk),
      spDef: getStat(base.spDef),
      speed: getStat(base.speed),
      status: [],
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
      learnset: base.learnset || []
    };

    // Golpes baseados no learnset do Pokémon até o nível do líder
    const learnset = base.learnset || [];
    const availableMoves = learnset
      .filter(m => m.level <= lvl)
      .map(m => {
        const mk = (m.move || '').toLowerCase();
        const md = MOVES[mk] || { name: m.move, power: 40, type: 'Normal', category: 'Physical' };
        return { ...md, name: MOVE_TRANSLATIONS[mk] || md.name || m.move };
      });
    const finalMoves = availableMoves.length > 0 ? availableMoves.slice(-4) : [{ name: 'Investida', power: 40, type: 'Normal', category: 'Physical' }];

    setCurrentEnemy({
      ...leaderPokeFinal,
      pokemonName: base.name, // Nome da espécie fixo
      moves: finalMoves,
      isTrainer: true,
      trainerName: gymData.title || gymData.name,
      trainerSprite: gymData.sprite,
      trainerReward: gymData.reward || 1000,
      isGymLeader: true,
      gymId: gymData.id,
      badgeToGive: gymData.badge || null,
      background: gymData.background || null,
      locationName: gymData.location || gymData.city,
      spawnTime: Date.now(),
      opponentTeam: teamList,
      opponentTeamIndex: 0
    });
    setCurrentView('battles');
    // BGM agora gerenciado pelas configurações
    addLog(`⬠ GINÁSIO: Líder ${gymData.name} enviou ${base.name}! Nv.${lvl}`, 'system');
    isProcessingVictory.current = false;
  }, [setCurrentEnemy, setCurrentView, addLog, POKEDEX, MOVES, MOVE_TRANSLATIONS, gameState]);

  const handleCraft = (recipe, quantity = 1) => {
    const qty = Math.max(1, Math.floor(Number(quantity) || 1));
    const currencyCost = (recipe.cost?.currency || 0) * qty;
    const materialCost = Object.fromEntries(
      Object.entries(recipe.cost || {})
        .filter(([material]) => material !== 'currency')
        .map(([material, amount]) => [material, amount * qty])
    );

    showConfirm({
      type: 'confirm',
      title: 'Confirmar Forja',
      message: `Deseja forjar ${qty}x ${recipe.name}?`,
      confirmLabel: 'Forjar',
      cancelLabel: 'Cancelar',
      onConfirm: () => {
        closeConfirm();

        let crafted = false;

        setGameState(prev => {
          const materials = prev.inventory?.materials || {};
          const items     = prev.inventory?.items     || {};

          if (prev.currency < currencyCost) return prev;

          // Verifica disponibilidade em materials + items (igual ao getAvail da CraftingStation)
          const hasMaterials = Object.entries(materialCost).every(
            ([material, amount]) => (materials[material] || 0) + (items[material] || 0) >= amount
          );
          if (!hasMaterials) return prev;

          // Deduz de materials primeiro, depois de items se necessário
          const newMaterials = { ...materials };
          const newItems = { ...items };
          Object.entries(materialCost).forEach(([material, amount]) => {
            let remaining = amount;
            const fromMat = Math.min(remaining, newMaterials[material] || 0);
            newMaterials[material] = (newMaterials[material] || 0) - fromMat;
            remaining -= fromMat;
            if (remaining > 0) {
              newItems[material] = (newItems[material] || 0) - remaining;
            }
          });

          newItems[recipe.id] = (newItems[recipe.id] || 0) + qty;
          crafted = true;

          return {
            ...prev,
            currency: prev.currency - currencyCost,
            forgedItemsCount: (prev.forgedItemsCount || 0) + qty,
            inventory: {
              ...prev.inventory,
              materials: newMaterials,
              items: newItems,
            },
          };
        });

        if (crafted) {
          addLog(`✨ Você fabricou: ${qty}x ${recipe.name}!`, 'drop');
        } else {
          addLog('Recursos insuficientes para a forja!', 'system');
        }
      },
      onCancel: () => {
        setIsForgeConfirmOpen(false);
        closeConfirm();
      },
    });
  };

  const handleGoToRecipeSource = useCallback((recipeId) => {
    const guide = FORGE_RECIPE_DROP_GUIDE[recipeId];
    if (!guide?.routeId) return;
    setActiveBuildingModal(null);
    setActiveMaterialModal(null);
    setGameState(prev => ({
      ...prev,
      currentRoute: processedRoutes[guide.routeId] ? guide.routeId : (prev.currentRoute || 'route_1'),
    }));
    setCurrentEnemy(null);
    setCurrentView('battles');
    addLog(`Rastreando receita: ${guide.label}`, 'system');
  }, [processedRoutes, addLog]);

  const handleGoToMaterialSource = useCallback((materialId) => {
    const guide = FORGE_MATERIAL_DROP_GUIDE[materialId];
    if (!guide?.routeId) return;
    setActiveBuildingModal(null);
    setActiveMaterialModal(null);
    setGameState(prev => ({
      ...prev,
      currentRoute: processedRoutes[guide.routeId] ? guide.routeId : (prev.currentRoute || 'route_1'),
    }));
    setCurrentEnemy(null);
    setCurrentView('battles');
    addLog(`Rastreando material: ${guide.label}`, 'system');
  }, [processedRoutes, addLog]);

    // CANDY DROP
  const handleUseCandy = useCallback((pokemonInstanceId, candyId, useId) => {
    const use = CANDY_USES[useId];
    if (!use) return;

    setGameState(prev => {
      const inventory = prev.inventory || {};
      const candies = inventory.candies || {};
      const currentCount = candies[candyId] || 0;
      
      if (currentCount < use.cost) {
        addLog(`Candies insuficientes (${currentCount}/${use.cost})`, 'system');
        return prev;
      }

      const location = prev.team.find(p => p.instanceId === pokemonInstanceId) ? 'team' : 'pc';
      const pokemonList = prev[location];
      const pokemonIndex = pokemonList.findIndex(p => p.instanceId === pokemonInstanceId);
      if (pokemonIndex === -1) return prev;

      const p = { ...pokemonList[pokemonIndex] };
      const newInventory = { 
        ...inventory, 
        candies: { ...candies, [candyId]: currentCount - use.cost } 
      };

      if (use.effect === 'xp_boost') {
        const n = p.level || 1; const xpNeeded = Math.pow(n + 1, 3) - Math.pow(n, 3);
        p.xp = xpNeeded; 
        addLog(`✨ ${p.name} consumiu candies e ganhou experiência!`, 'system');
      } else if (use.effect === 'stat_atk') {
        p.attack = (p.attack || 10) + 2;
        addLog(` ${p.name} aumentou o Ataque permanentemente!`, 'system');
      } else if (use.effect === 'stat_def') {
        p.defense = (p.defense || 10) + 2;
        addLog(` ${p.name} aumentou a Defesa permanentemente!`, 'system');
      } else if (use.effect === 'stat_hp') {
        p.maxHp = (p.maxHp || 40) + 5;
        p.hp = Math.min(p.maxHp, p.hp + 5);
        addLog(` ${p.name} aumentou o HP permanentemente!`, 'system');
      } else if (use.effect === 'stat_speed') {
        p.speed = (p.speed || 10) + 2;
        addLog(` ${p.name} aumentou a Velocidade permanentemente!`, 'system');
      } else if (use.effect === 'stat_spatk') {
        p.spAtk = (p.spAtk || 10) + 2;
        addLog(` ${p.name} aumentou o Ataque Especial!`, 'system');
      } else if (use.effect === 'force_evolve') {
        const pokeData = POKEDEX[p.id];
        const allEvolutions = Array.isArray(pokeData?.evolution)
          ? pokeData.evolution
          : (pokeData?.evolution ? [pokeData.evolution] : []);

        const validEvolutions = allEvolutions.filter(e =>
          isEvolutionAllowedForRegion(p, e.id, prev.activeRegion || 'kanto')
        );

        if (validEvolutions.length === 0) {
          addLog(`✨ ${p.name} não pode evoluir mais.`, 'system');
          return prev;
        }

        const pendingBase = {
          ...p,
          teamIndex: location === 'team' ? pokemonIndex : null,
          pcIndex:   location === 'pc'   ? pokemonIndex : null,
        };

        if (allEvolutions.length > 1) {
          // Múltiplos caminhos ou existência de forma regional → tela de escolha
          setEvolutionPending({ ...pendingBase, choices: allEvolutions });
        } else {
          setEvolutionPending({ ...pendingBase, targetEvolution: validEvolutions[0] });
        }
        return { ...prev, inventory: newInventory };
      }

      const newList = [...pokemonList];
      newList[pokemonIndex] = p;

      return { ...prev, inventory: newInventory, [location]: newList };
    });
  }, [addLog, setEvolutionPending]);

  // ── EXP Candy — usa da mochila em um Pokémon específico ─────────────────────
  const handleUseExpCandy = useCallback((candyId, pokemonInstanceId) => {
    const candyDef = EXP_CANDIES[candyId];
    if (!candyDef) return;
    setGameState(prev => {
      const items = prev.inventory?.items || {};
      if ((items[candyId] || 0) <= 0) {
        addLog(`❌ Nenhum ${candyDef.name} na mochila.`, 'system');
        return prev;
      }
      // Encontra Pokémon na equipe ou PC
      const inTeam = (prev.team || []).findIndex(p => p.instanceId === pokemonInstanceId);
      const location = inTeam >= 0 ? 'team' : 'pc';
      const list = [...(prev[location] || [])];
      const idx = inTeam >= 0 ? inTeam : list.findIndex(p => p.instanceId === pokemonInstanceId);
      if (idx === -1) {
        addLog(`❌ Pokémon não encontrado.`, 'system');
        return prev;
      }
      const p = { ...list[idx] };
      // Aplica XP: acumula e faz level-up se necessário
      let xp = (p.xp || 0) + candyDef.xp;
      let level = p.level || 1;
      let leveled = false;
      while (level < 100) {
        const xpNeeded = Math.pow(level + 1, 3) - Math.pow(level, 3);
        if (xp >= xpNeeded) { xp -= xpNeeded; level++; leveled = true; }
        else break;
      }
      if (xp < 0) xp = 0;
      list[idx] = { ...p, xp, level,
        maxHp: leveled ? Math.ceil(((2 * (POKEDEX[p.id]?.hp || 60) * level) / 100) + level + 10) : p.maxHp,
        hp:    leveled ? Math.ceil(((2 * (POKEDEX[p.id]?.hp || 60) * level) / 100) + level + 10) : Math.min(p.hp || p.maxHp, p.maxHp),
      };
      const msg = leveled
        ? `🍬 ${p.name} usou ${candyDef.name} e subiu para Nível ${level}!`
        : `🍬 ${p.name} ganhou ${candyDef.xp.toLocaleString()} XP com ${candyDef.name}!`;
      addLog(msg, 'system');
      return {
        ...prev,
        [location]: list,
        inventory: { ...prev.inventory, items: { ...items, [candyId]: items[candyId] - 1 } },
      };
    });
  }, [addLog]);

  // PROTECTED: handleStartExpedition - NAO EDITAR SEM AUTORIZACAO EXPLICITA
  const handleStartExpedition = useCallback((biomeId, team, autoRepeat = false, durationMultiplier = 1) => {
    const biome = EXPEDITION_BIOMES[biomeId];
    if (!biome || !team.length) return;
    
    // Bloqueio de Pokémons do Time Ativo
    const teamInstanceIds = new Set((gameState.team || []).map(p => p.instanceId));
    const hasTeamPokemon = team.some(p => teamInstanceIds.has(p.instanceId));
    
    if (hasTeamPokemon) {
      addLog("❌ Erro: Não é possível enviar Pokémons que estão no seu time principal para expedições!", "error");
      return;
    }
    const masteryLevel = Math.floor(((gameState.expeditionProgress || {})[biomeId]?.completed || 0) / 3);
    const tunedBiome = { ...biome, masteryLevel };
    const duration = calcExpeditionDuration(team, tunedBiome, durationMultiplier);
    const now = Date.now();
    setGameState(prev => {
      const teamIds = new Set(team.map(p => p.instanceId));
      const newPC = (prev.pc || []).map(p => teamIds.has(p.instanceId) ? { ...p, onExpedition: biomeId } : p);
      return {
        ...prev,
        pc: newPC,
        expeditions: {
          ...(prev.expeditions || {}),
        [biomeId]: {
          biomeId,
          masteryLevel,
          team,
            startedAt: now,
            endsAt: now + duration,
            duration,
            durationMultiplier,
            autoRepeat,
          },
        },
      };
    });
    addLog(`🚢 Expedição para ${biome.name} iniciada! Duração: ~${Math.floor(duration / 60000)}min ${autoRepeat ? '(Auto-Repeat ON)' : ''}`, 'system');
  }, [addLog, gameState.expeditionProgress, gameState.team]);

  const handleClaimExpedition = useCallback((biomeId) => {
    const exp = gameState.expeditions?.[biomeId];
    if (!exp || Date.now() < exp.endsAt) return null;

    const biome = { ...EXPEDITION_BIOMES[biomeId], masteryLevel: exp.masteryLevel || 0 };
    const duration = Date.now() - exp.startedAt;
    const rawDrops = calcExpeditionDrops(exp.team, biome, duration);
    const drops = Object.fromEntries(
      Object.entries(rawDrops).filter(([key]) => !key.includes('_candy'))
    );
    const teamWithXP = calcExpeditionXP(exp.team, biome, duration);
    const processedResults = teamWithXP.map(p => processExpeditionPokemon(p, p.xpGained || 0));
    const returnedTeam = processedResults.map(r => r.pokemon);

    const report = {
      biomeName: biome.name,
      biomeIcon: biome.icon || '🗺️',
      drops,
      pokemonResults: processedResults.map(r => ({
        name: r.pokemon.name,
        id: r.pokemon.id,
        isShiny: r.pokemon.isShiny,
        initialLevel: r.initialLevel,
        finalLevel: r.finalLevel,
        levelsGained: r.levelsGained,
        xpGained: r.xpGained,
        moveEvents: r.moveEvents,
      })),
    };

    setGameState(prev => {
      // Re-verify exp in case of race condition (though unlikely in single-threaded JS)
      const currentExp = prev.expeditions?.[biomeId];
      if (!currentExp) return prev;

      const newMaterials = { ...prev.inventory.materials };
      const newItems = { ...prev.inventory.items };
      const materialList = [
        'iron_ore', 'apricorn', 'electric_chip', 'moon_stone_shard', 'pink_dust', 'gold_nugget', 'silk', 'feather',
        'fire_stone_shard', 'water_stone_shard', 'leaf_stone_shard', 'thunder_stone_shard', 'link_cable_part',
        'sun_stone_shard', 'shiny_stone_shard', 'dusk_stone_shard', 'dawn_stone_shard', 'ice_stone_shard',
        'trainer_card_thread', 'yellow_shard', 'mystic_dust', 'armor_fragment', 'fury_essence', 'stardust',
        'dragon_scale', 'rock_essence', 'ground_essence', 'dark_essence', 'steel_essence', 'fairy_essence'
      ];

      for (const [item, qty] of Object.entries(drops)) {
        if (materialList.includes(item) || item.includes('_essence') || item.includes('_shard')) {
          newMaterials[item] = (newMaterials[item] || 0) + qty;
        } else {
          newItems[item] = (newItems[item] || 0) + qty;
        }
      }

      const progress = { ...(prev.expeditionProgress || {}) };
      const currentProgress = progress[biomeId] || { completed: 0, bestTeamPower: 0 };
      const teamPower = (currentExp.team || []).reduce((sum, p) => sum + (p.level || 1), 0);
      const nextCompleted = (currentProgress.completed || 0) + 1;
      progress[biomeId] = {
        ...currentProgress,
        completed: nextCompleted,
        bestTeamPower: Math.max(currentProgress.bestTeamPower || 0, teamPower),
        lastCompletedAt: Date.now(),
      };

      const newExpeditions = { ...(prev.expeditions || {}) };
      if (currentExp.autoRepeat) {
        const now = Date.now();
        // Recalcular duração com o time atualizado (níveis ganhos) e o mesmo multiplicador
        const updatedMastery = Math.floor(nextCompleted / 3);
        const updatedTunedBiome = { ...biome, masteryLevel: updatedMastery };
        const newDuration = calcExpeditionDuration(returnedTeam, updatedTunedBiome, currentExp.durationMultiplier || 1);
        
        newExpeditions[biomeId] = {
          ...currentExp,
          team: returnedTeam,
          masteryLevel: updatedMastery,
          startedAt: now,
          endsAt: now + newDuration,
          duration: newDuration,
        };
      } else {
        delete newExpeditions[biomeId];
      }

      return {
        ...prev,
        pc: (prev.pc || []).map(p => {
          const returnedPoke = returnedTeam.find(rp => rp.instanceId === p.instanceId);
          if (returnedPoke) {
            return {
              ...returnedPoke,
              onExpedition: currentExp.autoRepeat ? biomeId : null
            };
          }
          return p;
        }),
        inventory: { ...prev.inventory, materials: newMaterials, items: newItems },
        expeditions: newExpeditions,
        expeditionProgress: progress,
      };
    });

    expeditionReportRef.current = null;
    setExpeditionReport(report);
    return report;
  }, [gameState.expeditions]);

  // ——— HOUSE SYSTEM HANDLERS ———
  // ——— AUTO-CAPTURA HANDLERS ———
  // PROTECTED: AutoCapture - NAO EDITAR SEM AUTORIZACAO EXPLICITA
  const handleSaveAutoCaptureConfig = useCallback((config) => {
    const route = processedRoutes[gameState.currentRoute];
    setGameState(prev => ({
      ...prev,
      autoCapture: true,
      autoCaptureConfig: {
        ...prev.autoCaptureConfig,
        enabled: true,
        mode:         config.mode,
        ballPriority: config.ballPriority,
        hpThreshold:  config.hpThreshold,
        targetIds:    config.targetIds,
        routeConfigs: {
          ...(prev.autoCaptureConfig?.routeConfigs || {}),
          [gameState.currentRoute]: config,
        },
        shownRoutes: [
          ...(prev.autoCaptureConfig?.shownRoutes || []),
          gameState.currentRoute,
        ],
      },
    }));
    setShowAutoCaptureModal(false);
    addLog(`✅ Auto-captura configurada para ${route?.name}!`, 'system');
  }, [gameState.currentRoute, addLog, processedRoutes]);

  const handleDisableAutoCapture = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      autoCapture: false,
      autoCaptureConfig: {
        ...prev.autoCaptureConfig,
        enabled: false,
        shownRoutes: [
          ...(prev.autoCaptureConfig?.shownRoutes || []),
          gameState.currentRoute,
        ],
      },
    }));
    setShowAutoCaptureModal(false);
    addLog('🚀 Auto-captura desativada nesta rota.', 'system');
  }, [gameState.currentRoute, addLog]);

  const handleCloseAutoCaptureModal = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      autoCaptureConfig: {
        ...prev.autoCaptureConfig,
        shownRoutes: Array.from(new Set([
          ...(prev.autoCaptureConfig?.shownRoutes || []),
          gameState.currentRoute,
        ])),
      },
    }));
    setShowAutoCaptureModal(false);
  }, [gameState.currentRoute]);

  // Disparar modal ao entrar em uma rota de treino.
  useEffect(() => {
    const routeId = gameState.currentRoute;
    const route = processedRoutes[routeId];
    const config = gameState.autoCaptureConfig;
    const isTrainingBattle = currentView === 'battles' && currentEnemy && !currentEnemy.isTrainer && !currentEnemy.isWildBoss && !currentEnemy.isLegendary;

    if (
      isTrainingBattle &&
      config?.enabled &&
      route?.type === 'farm' &&
      route?.enemies?.length > 0 &&
      !config?.shownRoutes?.includes(routeId)
    ) {
      const timer = setTimeout(() => setShowAutoCaptureModal(true), 800);
      return () => clearTimeout(timer);
    }
  }, [currentView, currentEnemy?.instanceId, gameState.currentRoute, gameState.autoCaptureConfig, processedRoutes]);

  useEffect(() => {
    const isTrainingBattle = currentView === 'battles' && currentEnemy && !currentEnemy.isTrainer && !currentEnemy.isWildBoss && !currentEnemy.isLegendary;
    if (showAutoCaptureModal && !isTrainingBattle) {
      setShowAutoCaptureModal(false);
    }
  }, [currentView, currentEnemy?.instanceId, showAutoCaptureModal]);

  useEffect(() => {
    const flags = gameState.worldFlags || [];

    // Mega Evolution — mostrar intro se tem bug_badge mas nunca viu o modal
    if ((gameState.badges || []).includes('bug_badge') && !flags.includes('mega_evolution_unlocked') && !flags.includes('mega_intro_shown')) {
      setShowMegaIntroModal(true);
    }

    // Kanto → Johto
    if (flags.includes('kanto_champion_modal_pending')) setShowKantoChampionModal(true);

    // Johto → Hoenn
    if (flags.includes('johto_champion_modal_pending') ||
       (flags.includes('johto_champion') && !flags.includes('hoenn_started') && !flags.includes('johto_champion_modal_shown')))
      setShowJohtoChampionModal(true);

    // Hoenn → Sinnoh
    if (flags.includes('hoenn_champion_modal_pending') ||
       (flags.includes('hoenn_champion') && !flags.includes('sinnoh_started') && !flags.includes('hoenn_champion_modal_shown')))
      setShowSinnohIntroModal(true);

    // Sinnoh → Unova
    if (flags.includes('sinnoh_champion_modal_pending') ||
       (flags.includes('sinnoh_champion') && !flags.includes('unova_started') && !flags.includes('sinnoh_champion_modal_shown')))
      setShowSinnohChampionModal(true);

    // Unova → Kalos
    if (flags.includes('unova_champion_modal_pending') ||
       (flags.includes('unova_champion') && !flags.includes('kalos_started') && !flags.includes('unova_champion_modal_shown')))
      setShowUnovaChampionModal(true);

    // Kalos → Alola
    if (flags.includes('kalos_champion_modal_pending') ||
       (flags.includes('kalos_champion') && !flags.includes('alola_started') && !flags.includes('kalos_champion_modal_shown')))
      setShowKalosChampionModal(true);

    // Alola → Galar
    if (flags.includes('alola_champion_modal_pending') ||
       (flags.includes('alola_champion') && !flags.includes('galar_started') && !flags.includes('alola_champion_modal_shown')))
      setShowAlolaChampionModal(true);

    // Galar → Hisui
    if (flags.includes('galar_champion_modal_pending') ||
       (flags.includes('galar_champion') && !flags.includes('hisui_started') && !flags.includes('galar_champion_modal_shown')))
      setShowGalarChampionModal(true);

    // Hisui → Paldea
    if (flags.includes('hisui_champion_modal_pending') ||
       (flags.includes('hisui_champion') && !flags.includes('paldea_started') && !flags.includes('hisui_champion_modal_shown')))
      setShowHisuiChampionModal(true);

    // Paldea = Final
    if (flags.includes('paldea_champion_modal_pending') ||
       (flags.includes('paldea_champion') && !flags.includes('paldea_champion_modal_shown')))
      setShowPaldeaChampionModal(true);

    // Hisui (recovery: Galar já mostrado mas Hisui ainda não iniciado)
    if (flags.includes('galar_champion') && flags.includes('galar_champion_modal_shown') &&
        !flags.includes('hisui_started') && !flags.includes('hisui_invite_shown'))
      setShowHisuiInviteModal(true);

  }, [gameState.worldFlags]);
  // ————————————————————————————————————————————————————————————

  // Comprar a casa
  // PROTECTED: handleBuyHouse - NAO EDITAR SEM AUTORIZACAO EXPLICITA
  const handleBuyHouse = useCallback(() => {
    showConfirm({
      type: 'confirm',
      title: 'Confirmar Compra',
      message: `Deseja comprar a casa por ${HOUSE_PURCHASE_COST.toLocaleString()} coins?`,
      confirmLabel: 'Sim, Comprar',
      cancelLabel: 'Cancelar',
      onConfirm: () => {
        closeConfirm();
    setGameState(prev => {
      if ((prev.currency || 0) < HOUSE_PURCHASE_COST) {
        addLog(`💰 Coins insuficientes! A casa custa ${HOUSE_PURCHASE_COST} coins.`, 'system');
        return prev;
      }
      addLog(`🏠 Casa comprada! Prof. Carvalho ficou orgulhoso!`, 'system');
      return {
        ...prev,
        currency: prev.currency - HOUSE_PURCHASE_COST,
        house: { ...prev.house, owned: true, totalSlots: 4, slots: [], caretakers: [] },
        worldFlags: [...(prev.worldFlags || []), 'house_owned'],
      };
    });
    setShowOakHouseModal(false);
    setShowHouse(true);
      },
      onCancel: closeConfirm
    });
  }, [addLog]);

  const createRegionStarter = useCallback((pokemonId, level = 5, region = 'kanto') => {
    const base = POKEDEX[Number(pokemonId)];
    if (!base) return null;
    const moves = (base.learnset || [])
      .filter(m => m.level <= level)
      .map(m => {
        const moveKey = (m.move || '').toLowerCase();
        const moveData = MOVES[moveKey] || { name: m.move || 'Investida', power: 40, type: 'Normal', category: 'Physical' };
        return {
          ...moveData,
          name: MOVE_TRANSLATIONS[moveKey] || moveData.name || m.move,
          power: moveData.power || 0,
          type: moveData.type || 'Normal',
          category: moveData.category || 'Physical',
        };
      });
    const finalMoves = moves.length > 0 ? moves.slice(-4) : [{ name: 'Investida', power: 40, type: 'Normal', category: 'Physical' }];
    const maxHp = Math.ceil(((2 * (base.maxHp || base.hp || 30) * level) / 100) + level + 10);
    return {
      ...base,
      id: Number(base.id),
      level,
      maxHp,
      hp: maxHp,
      xp: 0,
      moves: finalMoves,
      learnedMoves: finalMoves,
      instanceId: Date.now() + Math.random(),
      status: [],
      capturedRegion: region,
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
    };
  }, [POKEDEX, MOVES]);

  const handleStartJohto = useCallback((starterId) => {
    const starter = createRegionStarter(starterId, 5, 'johto');
    if (!starter) return;
    setGameState(prev => {
      const oldRegion = prev.activeRegion || 'kanto';
      const updated_regional_teams = {
        ...(prev.regional_teams || {}),
        [oldRegion]: [...prev.team]
      };
      
      const flags = new Set([...(prev.worldFlags || []), 'johto_started']);
      return {
        ...prev,
        activeRegion: 'johto',
        regional_teams: updated_regional_teams,
        selectedStarters: { ...(prev.selectedStarters || {}), johto: starterId },
        team: [starter],
        currentRoute: 'new_bark_town',
        caughtData: { ...(prev.caughtData || {}), [starter.id]: true },
        worldFlags: Array.from(flags),
      };
    });
    setActiveMemberIndex(0);
    setCurrentEnemy(null);
    setCurrentView('city');
    addLog(`🌍 Nova jornada em Johto iniciada com ${starter.name}! Pokémon de Kanto guardados com sucesso.`, 'system');
  }, [createRegionStarter, addLog]);

  const handleStartHoenn = useCallback((starterId) => {
    const starter = createRegionStarter(starterId, 5, 'hoenn');
    if (!starter) return;
    setGameState(prev => {
      const oldRegion = prev.activeRegion || 'johto';
      const updated_regional_teams = {
        ...(prev.regional_teams || {}),
        [oldRegion]: [...prev.team]
      };
      
      const flags = new Set([...(prev.worldFlags || []), 'hoenn_started']);
      return {
        ...prev,
        activeRegion: 'hoenn',
        regional_teams: updated_regional_teams,
        selectedStarters: { ...(prev.selectedStarters || {}), hoenn: starterId },
        team: [starter],
        currentRoute: 'littleroot_town',
        caughtData: { ...(prev.caughtData || {}), [starter.id]: true },
        worldFlags: Array.from(flags),
      };
    });
    setActiveMemberIndex(0);
    setCurrentEnemy(null);
    setCurrentView('city');
    addLog(`🌍 Bem-vindo a HOENN! Sua nova jornada com ${starter.name} começa agora!`, 'system');
  }, [createRegionStarter, addLog]);

  const handleStartSinnoh = useCallback((starterId) => {
    const starter = createRegionStarter(starterId, 5, 'sinnoh');
    if (!starter) return;
    setGameState(prev => {
      const oldRegion = prev.activeRegion || 'hoenn';
      const updated_regional_teams = {
        ...(prev.regional_teams || {}),
        [oldRegion]: [...prev.team]
      };

      const flags = new Set([...(prev.worldFlags || []), 'sinnoh_started']);
      flags.delete('hoenn_champion_modal_pending');
      return {
        ...prev,
        activeRegion: 'sinnoh',
        regional_teams: updated_regional_teams,
        selectedStarters: { ...(prev.selectedStarters || {}), sinnoh: starterId },
        team: [starter],
        currentRoute: 'twinleaf_town',
        caughtData: { ...(prev.caughtData || {}), [starter.id]: true },
        worldFlags: Array.from(flags),
      };
    });
    setActiveMemberIndex(0);
    setCurrentEnemy(null);
    setShowSinnohIntroModal(false);
    setCurrentView('city');
    addLog(`🌍 Bem-vindo a SINNOH! Sua nova jornada com ${starter.name} começa agora!`, 'system');
  }, [createRegionStarter, addLog]);

  const handleStartUnova = useCallback((starterId) => {
    const starter = createRegionStarter(starterId, 5, 'unova');
    if (!starter) return;
    setGameState(prev => {
      const updated_regional_teams = { ...(prev.regional_teams || {}), [prev.activeRegion || 'sinnoh']: [...prev.team] };
      return {
        ...prev, 
        activeRegion: 'unova',
        regional_teams: updated_regional_teams,
        selectedStarters: { ...(prev.selectedStarters || {}), unova: starterId },
        team: [starter], 
        currentRoute: 'unova_home_town',
        caughtData: { ...(prev.caughtData || {}), [starter.id]: true },
        worldFlags: [...new Set([...(prev.worldFlags || []), 'unova_started'])],
      };
    });
    setActiveMemberIndex(0); 
    setCurrentEnemy(null); 
    setCurrentView('city');
    addLog(`🌍 Bem-vindo a Unova! Sua jornada com ${starter.name} começa agora!`, 'system');
  }, [createRegionStarter, addLog]);

  const handleStartKalos = useCallback((starterId) => {
    const starter = createRegionStarter(starterId, 5, 'kalos');
    if (!starter) return;
    setGameState(prev => {
      const updated_regional_teams = { ...(prev.regional_teams || {}), [prev.activeRegion || 'unova']: [...prev.team] };
      return {
        ...prev, activeRegion: 'kalos',
        regional_teams: updated_regional_teams,
        selectedStarters: { ...(prev.selectedStarters || {}), kalos: starterId },
        team: [starter], currentRoute: 'kalos_home_town',
        caughtData: { ...(prev.caughtData || {}), [starter.id]: true },
        worldFlags: [...new Set([...(prev.worldFlags || []), 'kalos_started'])],
      };
    });
    setActiveMemberIndex(0); setCurrentEnemy(null); setCurrentView('city');
    addLog(`🌍 Bem-vindo a Kalos! Sua jornada com ${starter.name} começa agora!`, 'system');
  }, [createRegionStarter, addLog]);

  const handleStartAlola = useCallback((starterId) => {
    const starter = createRegionStarter(starterId, 5, 'alola');
    if (!starter) return;
    setGameState(prev => {
      const updated_regional_teams = { ...(prev.regional_teams || {}), [prev.activeRegion || 'kalos']: [...prev.team] };
      return {
        ...prev, activeRegion: 'alola',
        regional_teams: updated_regional_teams,
        selectedStarters: { ...(prev.selectedStarters || {}), alola: starterId },
        team: [starter], currentRoute: 'alola_home_town',
        caughtData: { ...(prev.caughtData || {}), [starter.id]: true },
        worldFlags: [...new Set([...(prev.worldFlags || []), 'alola_started'])],
      };
    });
    setActiveMemberIndex(0); setCurrentEnemy(null); setCurrentView('city');
    addLog(`🌍 Bem-vindo a Alola! Sua jornada com ${starter.name} começa agora!`, 'system');
  }, [createRegionStarter, addLog]);

  const handleStartGalar = useCallback((starterId) => {
    const starter = createRegionStarter(starterId, 5, 'galar');
    if (!starter) return;
    setGameState(prev => {
      const updated_regional_teams = { ...(prev.regional_teams || {}), [prev.activeRegion || 'alola']: [...prev.team] };
      return {
        ...prev, activeRegion: 'galar',
        regional_teams: updated_regional_teams,
        selectedStarters: { ...(prev.selectedStarters || {}), galar: starterId },
        team: [starter], currentRoute: 'galar_home_town',
        caughtData: { ...(prev.caughtData || {}), [starter.id]: true },
        worldFlags: [...new Set([...(prev.worldFlags || []), 'galar_started'])],
      };
    });
    setActiveMemberIndex(0); setCurrentEnemy(null); setCurrentView('city');
    addLog(`🌍 Bem-vindo a Galar! Sua jornada com ${starter.name} começa agora!`, 'system');
  }, [createRegionStarter, addLog]);

  const handleStartPaldea = useCallback((starterId) => {
    const starter = createRegionStarter(starterId, 5, 'paldea');
    if (!starter) return;
    setGameState(prev => {
      const updated_regional_teams = { ...(prev.regional_teams || {}), [prev.activeRegion || 'hisui']: [...prev.team] };
      return {
        ...prev, activeRegion: 'paldea',
        regional_teams: updated_regional_teams,
        selectedStarters: { ...(prev.selectedStarters || {}), paldea: starterId },
        team: [starter], currentRoute: 'paldea_home_town',
        caughtData: { ...(prev.caughtData || {}), [starter.id]: true },
        worldFlags: [...new Set([...(prev.worldFlags || []), 'paldea_started'])],
      };
    });
    setActiveMemberIndex(0); setCurrentEnemy(null); setCurrentView('city');
    addLog(`🌍 Bem-vindo a Paldea! Sua jornada com ${starter.name} começa agora!`, 'system');
  }, [createRegionStarter, addLog]);

  const handleStartHisui = useCallback((starterId) => {
    const starter = createRegionStarter(starterId, 5, 'hisui');
    if (!starter) return;
    setGameState(prev => {
      const updated_regional_teams = { ...(prev.regional_teams || {}), [prev.activeRegion || 'galar']: [...prev.team] };
      return {
        ...prev, activeRegion: 'hisui',
        regional_teams: updated_regional_teams,
        selectedStarters: { ...(prev.selectedStarters || {}), hisui: starterId },
        team: [starter], currentRoute: 'hisui_jubilife',
        caughtData: { ...(prev.caughtData || {}), [starter.id]: true },
        worldFlags: [...new Set([...(prev.worldFlags || []), 'hisui_started'])],
      };
    });
    setActiveMemberIndex(0); setCurrentEnemy(null); setCurrentView('city');
    addLog(`🌍 Bem-vindo a Hisui! Sua jornada com ${starter.name} na terra antiga começa agora!`, 'system');
  }, [createRegionStarter, addLog]);

  // Plantar
  const handleBuySeed = useCallback((seedId, cost) => {
    setGameState(prev => {
      if (prev.currency < cost) return prev;
      const newInventory = { ...prev.inventory };
      // Sementes são estocadas como materiais
      newInventory.materials[seedId] = (newInventory.materials[seedId] || 0) + 1;
      addLog(`🌰 Comprou 1x ${PLANTABLE_ITEMS[seedId]?.name || seedId}!`, 'system');
      return {
        ...prev,
        currency: prev.currency - cost,
        inventory: newInventory
      };
    });
  }, [addLog]);

  const handleHireAlly = useCallback((allyId, cost) => {
    setGameState(prev => {
      if (prev.currency < cost) return prev;
      const allyConfig = ALLIES[allyId];
      if (!allyConfig) return prev;

      addLog(`🤝 Você contratou ${allyConfig.name}!`, 'system');
      return {
        ...prev,
        currency: prev.currency - cost,
        ally: {
          activeId: allyId,
          expiresAt: Date.now() + allyConfig.durationMs
        }
      };
    });
  }, [addLog]);

  const handlePokecenterDonation = useCallback((donationId, cost) => {
    setGameState(prev => {
      if (prev.currency < cost) return prev;
      const donation = POKECENTER_DONATIONS[donationId];
      if (!donation) return prev;

      addLog(`🏥 Você doou ao PokéCenter e recebeu ${donation.bonusHeals} curas gratuitas!`, 'system');
      return {
        ...prev,
        currency: prev.currency - cost,
        pokecenter: {
          ...prev.pokecenter,
          freeHeals: (prev.pokecenter?.freeHeals || 0) + donation.bonusHeals
        }
      };
    });
  }, [addLog]);

  const handlePlant = useCallback((slotIndex, plantId) => {
    setGameState(prev => {
      const plant        = PLANTABLE_ITEMS[plantId];
      if (!plant) return prev;
      const totalSlots   = prev.house?.totalSlots || 4;
      const slotNumber   = Number(slotIndex);
      if (!Number.isInteger(slotNumber) || slotNumber < 0 || slotNumber >= totalSlots) {
        addLog('Slot de plantio inválido.', 'system');
        return prev;
      }

      const newSlots = Array.from({ length: totalSlots }, (_, index) => prev.house?.slots?.[index] || null);
      if (newSlots[slotNumber]) {
        addLog('Este canteiro já está ocupado.', 'system');
        return prev;
      }

      const caretakers   = prev.house?.caretakers || [];
      const bonus        = calcCombinedCaretakerBonus(caretakers);
      const growthTime   = calcGrowthTime(plant, bonus);


      // Consumir a semente
      const newItems = { ...(prev.inventory?.items || {}) };
      const newMaterials = { ...(prev.inventory?.materials || {}) };
      if ((newItems[plantId] || 0) > 0) {
        newItems[plantId]--;
      } else if ((newMaterials[plantId] || 0) > 0) {
        newMaterials[plantId]--;
      } else {
        addLog(`Você não possui sementes de ${plant.name} para plantar.`, 'system');
        return prev;
      }

      newSlots[slotNumber] = { plantId, plantedAt: Date.now(), growthTime };

      addLog(`🌱 ${plant.name} plantado! Pronto em ${Math.floor(growthTime / 60000)} min.`, 'system');
      return {
        ...prev,
        house: { ...prev.house, totalSlots, slots: newSlots },
        inventory: { ...prev.inventory, items: newItems, materials: newMaterials }
      };
    });
  }, [addLog]);

  // Colher
  const handleHarvest = useCallback((slotIndex) => {
    setGameState(prev => {
      const slot = prev.house?.slots?.[slotIndex];
      if (!slot) return prev;

      const plant      = PLANTABLE_ITEMS[slot.plantId];
      const caretakers = prev.house?.caretakers || [];
      const bonus      = calcCombinedCaretakerBonus(caretakers);
      const drops      = calcHarvestDrops(plant, bonus);

      const newSlots = [...(prev.house.slots)];
      newSlots[slotIndex] = null;

      const newMaterials = { ...prev.inventory.materials };
      const newItems = { ...prev.inventory.items };
      const materialList = [
        'iron_ore', 'apricorn', 'electric_chip', 'moon_stone_shard', 'pink_dust', 'gold_nugget', 'silk', 'feather',
        'fire_stone_shard', 'water_stone_shard', 'leaf_stone_shard', 'thunder_stone_shard', 'link_cable_part',
        'sun_stone_shard', 'shiny_stone_shard', 'dusk_stone_shard', 'dawn_stone_shard', 'ice_stone_shard',
        'trainer_card_thread', 'yellow_shard', 'mystic_dust', 'armor_fragment', 'fury_essence', 'stardust',
        'dragon_scale', 'rock_essence', 'ground_essence', 'dark_essence', 'steel_essence', 'fairy_essence'
      ];

      for (const [item, qty] of Object.entries(drops)) {
        if (materialList.includes(item) || item.includes('_essence') || item.includes('_shard')) {
          newMaterials[item] = (newMaterials[item] || 0) + qty;
        } else {
          newItems[item] = (newItems[item] || 0) + qty;
        }
      }

      const dropSummary = Object.entries(drops).map(([k, v]) => `${v}x ${k}`).join(', ');
      addLog(`🧺 Colheu ${plant.name}: ${dropSummary}`, 'drop');

      return {
        ...prev,
        house: { ...prev.house, slots: newSlots },
        inventory: { ...prev.inventory, materials: newMaterials, items: newItems },
      };
    });
  }, [addLog]);

  // Comprar expansão de slots
  const handleBuySlot = useCallback((expansion) => {
    showConfirm({
      type: 'confirm',
      title: 'Confirmar Compra',
      message: `Deseja expandir o jardim para ${expansion.totalSlots} canteiros por ${expansion.cost.toLocaleString()} coins?`,
      confirmLabel: 'Sim, Comprar',
      cancelLabel: 'Cancelar',
      onConfirm: () => {
        closeConfirm();
    setGameState(prev => {
      if ((prev.currency || 0) < expansion.cost) return prev;
      addLog(`🛠️ Jardim expandido para ${expansion.totalSlots} canteiros!`, 'system');
      return {
        ...prev,
        currency: prev.currency - expansion.cost,
        house: { ...prev.house, totalSlots: expansion.totalSlots },
      };
    });
      },
      onCancel: closeConfirm
    });
  }, [addLog]);

  // Designar cuidador (retira do PC)
  const handleAssignCaretaker = useCallback((pokemon) => {
    setGameState(prev => {
      const newPC         = (prev.pc || []).filter(p => p.instanceId !== pokemon.instanceId);
      const newCaretakers = [...(prev.house?.caretakers || []), pokemon];
      addLog(`🌻 ${pokemon.name} agora cuida do jardim!`, 'system');
      return {
        ...prev,
        pc: newPC,
        house: { ...prev.house, caretakers: newCaretakers },
      };
    });
  }, [addLog]);

  // Remover cuidador (devolve ao PC)
  const handleRemoveCaretaker = useCallback((instanceId) => {
    setGameState(prev => {
      const pokemon       = (prev.house?.caretakers || []).find(p => p.instanceId === instanceId);
      const newCaretakers = (prev.house?.caretakers || []).filter(p => p.instanceId !== instanceId);
      const newPC         = [...(prev.pc || []), pokemon].filter(Boolean);
      if (pokemon) addLog(`🏠 ${pokemon.name} voltou ao PC.`, 'system');
      return {
        ...prev,
        pc: newPC,
        house: { ...prev.house, caretakers: newCaretakers },
      };
    });
  }, [addLog]);

  const startBattleAgainstRival = useCallback((battleData) => {
    // Se for um objeto de evento (clique direto sem argumentos do intro), battleData.team será undefined
    if (battleData && battleData.team) {
      const bossPoke = battleData.team[0];
      const maxHp = (bossPoke.maxHp || 50) * 1.5;
      
      setCurrentEnemy({
        ...bossPoke,
        hp: maxHp, maxHp,
        isShiny: false, status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
        isTrainer: true,
        trainerName: battleData.name,
        trainerSprite: battleData.sprite,
        trainerReward: battleData.reward || 1000,
        isBoss: true,
        unlockFlag: battleData.unlockFlag,
        badgeToGive: null,
        gymId: battleData.id,
        instanceId: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        spawnTime: Date.now(),
        opponentTeam: battleData.team,
        opponentTeamIndex: 0
      });
      setCurrentView('battles');
      addLog(`⚔️ RIVAL: ${battleData.name} desafiou você!`, 'system');
      isProcessingVictory.current = false;
      return;
    }

    // Lógica padrão do Rival Inicial (Azul)
    const myPoke = gameState.team[0];
    if (!myPoke) return;

    const rivalMap = { 1: 4, 4: 7, 7: 1 }; // Bulbasaur -> Charmander, etc.
    const rivalPokeId = rivalMap[myPoke.id] || 4;
    const rivalPokeBase = INITIAL_POKEMONS.find(ip => ip.id === rivalPokeId);

    const rivalEnemy = {
      ...rivalPokeBase,
      hp: 100,
      maxHp: 100,
      attack: Math.ceil((rivalPokeBase.attack || 10) * 1.2),
      defense: Math.ceil((rivalPokeBase.defense || 10) * 1.2),
      level: 5,
      moves: rivalPokeBase.moves || [],
      status: [],
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
      trainerName: 'Azul',
      trainerSprite: getRivalSprite(gameState.trainer?.avatarImg),
      isTrainer: true,
      badgeToGive: null,
      isBoss: true,
      background: fixPath('/bg_lab_1776866008842.webp'),
      unlockFlag: 'rival_lab_defeated',
      isInitialRival: true,
      instanceId: Date.now() + '-' + Math.random().toString(36).substr(2, 9)
    };

    isProcessingVictory.current = false;
    setCurrentEnemy(rivalEnemy);
    setCurrentView('battles');
    // BGM agora gerenciado pelas configurações
  }, [gameState.team, gameState.trainer, playBGM, setCurrentEnemy, setCurrentView, addLog]);


  useEffect(() => {
    if (!currentEnemy || currentEnemy.hp > 0) return;
    if (isProcessingVictory.current) return;

    // Lógica de Próximo Pokémon do Treinador (Time Multi-Pokemon)
    if (currentEnemy.opponentTeam && currentEnemy.opponentTeamIndex < currentEnemy.opponentTeam.length - 1) {
      const nextIdx = currentEnemy.opponentTeamIndex + 1;
      const nextMember = currentEnemy.opponentTeam[nextIdx];
      const base = POKEDEX[nextMember.id];
      if (base) {
        const lvl = nextMember.level || 5;
        // Multiplicadores baseados no tipo de batalha (Ajustado para balanceamento)
        const baseMult = currentEnemy.isGymLeader ? 1.1 : currentEnemy.isBoss ? 1.15 : 1.05;
        
        const calcHP = (b, l) => Math.ceil((((2 * (b || 50) * l) / 100) + l + 10) * baseMult);
        const calcStat = (b, l) => Math.ceil((((2 * (b || 10) * l) / 100) + 5) * baseMult);

        const maxHp = calcHP(base.maxHp || base.hp, lvl);

        const learnset = base.learnset || [];
        const availableMoves = learnset
          .filter(m => m.level <= lvl)
          .map(m => {
            const mk = (m.move || '').toLowerCase();
            const md = MOVES[mk] || { name: m.move, power: 40, type: 'Normal', category: 'Physical' };
            return { ...md, name: MOVE_TRANSLATIONS[mk] || md.name || m.move };
          });
        const finalMoves = availableMoves.length > 0 ? availableMoves.slice(-4) : [{ name: 'Investida', power: 40, type: 'Normal', category: 'Physical' }];

        addLog(`🚀 ${currentEnemy.trainerName} enviou ${base.name}!`, 'enemy');
        
        setCurrentEnemy(prev => ({
          ...prev,
          ...base,
          pokemonName: base.name, // Nome da espécie fixo
          id: nextMember.id,
          level: lvl,
          hp: maxHp, maxHp,
          attack: calcStat(base.attack, lvl),
          defense: calcStat(base.defense, lvl),
          spAtk: calcStat(base.spAtk, lvl),
          spDef: calcStat(base.spDef, lvl),
          speed: calcStat(base.speed, lvl),
          moves: finalMoves,
          status: [],
          stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
          opponentTeamIndex: nextIdx,
          instanceId: Date.now(),
          spawnTime: Date.now()
        }));
        return;
      }
    }

    isProcessingVictory.current = true;

    // Vitória! O som de GYM tocará apenas se ganhar insígnia

    const { drops, messages, foundRecipes, rareDrops } = processDrops(currentEnemy);
    // ⛏️” PROTECTED: Fórmula XP — NíO ALTERAR DIVISOR SEM AUTORIZAÇíO
    const baseXpGain = Math.floor(((currentEnemy.level || 1) * 1.5 * (POKEDEX[Number(currentEnemy.id)]?.baseXp || 50)) / 7);

    setGameState(prev => {
      const newInventory = { ...prev.inventory };
      const newFlags = [...(prev.worldFlags || [])];
      const newBadges = [...(prev.badges || [])];
      const tempWorldFlags = [...(prev.worldFlags || [])];

      Object.entries(drops.materials || {}).forEach(([mat, qty]) => {
        newInventory.materials[mat] = (newInventory.materials[mat] || 0) + qty;
      });
      Object.entries(drops.items || {}).forEach(([item, qty]) => {
        newInventory.items[item] = (newInventory.items[item] || 0) + qty;
      });
      Object.entries(drops.candies || {}).forEach(([candId, qty]) => {
        if (!newInventory.candies) newInventory.candies = {};
        newInventory.candies[candId] = (newInventory.candies[candId] || 0) + qty;
      });

      const currentRouteData = ROUTES[prev.currentRoute];
      if (currentRouteData) {
        if (currentRouteData.unlocks) {
          const unlocks = Array.isArray(currentRouteData.unlocks) ? currentRouteData.unlocks : [currentRouteData.unlocks];
          unlocks.forEach(u => {
            if (!newFlags.includes(u)) {
               newFlags.push(u);
               addLog(`🚀 Desbloqueado: ${u.replace('_', ' ')}!`, 'system');
            }
          });
        }
      }

      if (currentEnemy.badgeToGive && !newBadges.includes(currentEnemy.badgeToGive)) {
        newBadges.push(currentEnemy.badgeToGive);
        addLog(`Recebeu a Insignia: ${currentEnemy.badgeToGive.replace(/_/g, ' ')}!`, 'system');
        sfxGym();
        
        const activeRegion = prev.activeRegion || 'kanto';
        const newShare = Math.round(getRegionExpShareRate(newBadges, activeRegion) * 100);
        addLog(`✨ Exp Share aumentado! Sua equipe agora recebe ${newShare}% da experiência compartilhada!`, 'system');

        // Disparar Modal de Vitória de Ginásio
        setTimeout(() => {
          setShowGymVictoryModal({
            leaderName: currentEnemy.trainerName || "Líder de Ginásio",
            leaderSprite: currentEnemy.trainerSprite,
            badge: currentEnemy.badgeToGive,
            reward: getTrainerCurrencyReward(currentEnemy.trainerReward || 1000),
            expShare: newShare
          });
        }, 800);
        
        // Show Oak House modal after 1st badge
        if (newBadges.length === 1 && !prev.worldFlags?.includes('house_owned') && !prev.worldFlags?.includes('oak_house_shown')) {
          setTimeout(() => setShowOakHouseModal(true), 2000);
          tempWorldFlags.push('oak_house_shown');
        }

        // Mega Evolution intro after first Kalos gym (bug_badge)
        if (currentEnemy.badgeToGive === 'bug_badge' && !tempWorldFlags.includes('mega_evolution_unlocked') && !prev.worldFlags?.includes('mega_evolution_unlocked')) {
          tempWorldFlags.push('mega_evolution_unlocked');
          setTimeout(() => setShowMegaIntroModal(true), 2500);
        }
      }

      // Salvar flag de vitória específica do inimigo (Rival, Boss, etc)
      if (currentEnemy.unlockFlag && !newFlags.includes(currentEnemy.unlockFlag)) {
        newFlags.push(currentEnemy.unlockFlag);
        addLog(`? Progresso: ${currentEnemy.unlockFlag.replace(/_/g, ' ')}!`, 'system');
      }

      // Salvar flag de vitória de Elite 4 / Líder de Ginásio (Fallback)
      const newGymCounts = { ...(prev.gymDefeatCounts || {}) };
      if (currentEnemy.gymId) {
        if (!newFlags.includes(`defeated_elite_${currentEnemy.gymId}`)) {
          newFlags.push(`defeated_elite_${currentEnemy.gymId}`);
        }
        newGymCounts[currentEnemy.gymId] = (newGymCounts[currentEnemy.gymId] || 0) + 1;
      }
      if (currentEnemy.gymId === 'blue' && !newFlags.includes('champion')) {
        newFlags.push('champion');
        if (!newFlags.includes('region_champion_kanto')) newFlags.push('region_champion_kanto');
        newFlags.push('kanto_champion_modal_pending');
        setTimeout(() => setShowKantoChampionModal(true), 1200);
      }
      // ── CHAMPION MODALS — todos os 10 pares de região ─────────────────────────
      const CHAMPION_MODAL_MAP = {
        hoenn_champion:  { pendingFlag: 'hoenn_champion_modal_pending',  regionFlag: 'region_champion_hoenn',  setter: () => setTimeout(() => setShowSinnohIntroModal(true),    1200) },
        johto_champion:  { pendingFlag: 'johto_champion_modal_pending',  regionFlag: 'region_champion_johto',  setter: () => setTimeout(() => setShowJohtoChampionModal(true),   1200) },
        sinnoh_champion: { pendingFlag: 'sinnoh_champion_modal_pending', regionFlag: 'region_champion_sinnoh', setter: () => setTimeout(() => setShowSinnohChampionModal(true),  1200) },
        unova_champion:  { pendingFlag: 'unova_champion_modal_pending',  regionFlag: 'region_champion_unova',  setter: () => setTimeout(() => setShowUnovaChampionModal(true),   1200) },
        kalos_champion:  { pendingFlag: 'kalos_champion_modal_pending',  regionFlag: 'region_champion_kalos',  setter: () => setTimeout(() => setShowKalosChampionModal(true),   1200) },
        alola_champion:  { pendingFlag: 'alola_champion_modal_pending',  regionFlag: 'region_champion_alola',  setter: () => setTimeout(() => setShowAlolaChampionModal(true),   1200) },
        galar_champion:  { pendingFlag: 'galar_champion_modal_pending',  regionFlag: 'region_champion_galar',  setter: () => setTimeout(() => setShowGalarChampionModal(true),   1200) },
        hisui_champion:  { pendingFlag: 'hisui_champion_modal_pending',  regionFlag: 'region_champion_hisui',  setter: () => setTimeout(() => setShowHisuiChampionModal(true),   1200) },
        paldea_champion: { pendingFlag: 'paldea_champion_modal_pending', regionFlag: 'region_champion_paldea', setter: () => setTimeout(() => setShowPaldeaChampionModal(true),  1200) },
      };

      const unlockFlag = currentEnemy.unlockFlag;
      if (unlockFlag && CHAMPION_MODAL_MAP[unlockFlag]) {
        const { pendingFlag, regionFlag, setter } = CHAMPION_MODAL_MAP[unlockFlag];
        
        // REFEITA: Apenas concede o status de campeão regional (troféu) se for um BOSS real
        // Isso evita que o Alder "Wild" na League Route dê o troféu por sorte.
        if (currentEnemy.isBoss) {
          if (!newFlags.includes(regionFlag))  newFlags.push(regionFlag);
          if (!newFlags.includes(pendingFlag) && !newFlags.includes(pendingFlag.replace('_pending', '_shown'))) {
            newFlags.push(pendingFlag);
            setter();
          }
        }
      }

      const activeRegion = prev.activeRegion || 'kanto';
      const badgesCount = getRegionBadgeCount(prev.badges || [], activeRegion);
      const finalBadges = newBadges; // Para facilitar uso abaixo

      const now = Date.now();
      const effects = prev.activeEffects || {};
      
      const xpMult = (effects.activeLuckyEgg?.endsAt > now ? (effects.activeLuckyEgg.xpMult || 1.5) : 1.0) * 
                    (effects.activeSootheBell?.endsAt > now ? (effects.activeSootheBell.xpMult || 1.2) : 1.0);

      // Bônus de Aliado e Tema no XP
      const allyBonusXP = (() => {
        const ally = prev.ally;
        if (!ally?.activeId || !ally?.expiresAt || now > ally.expiresAt) return 1;
        return ALLIES[ally.activeId]?.bonus?.xpMult || 1;
      })();

      const themeXP = UI_THEMES[prev.prestige?.uiTheme || 'default']?.bonus?.xpMult || 1;
      const finalXPMult = xpMult * allyBonusXP * themeXP;

      const newTeam = prev.team.map((p, i) => {
        const isLead = (i === activeMemberIndex);
        let xpToAdd = 0;

        const levelScalingMult = getLevelGapXpMultiplier(p.level || 1, currentEnemy.level || 1);

        if (isLead && p.hp > 0) {
          xpToAdd = Math.floor(baseXpGain * finalXPMult * levelScalingMult);
        } else if (p.hp > 0 && effects.activeExpShare?.endsAt > now) {
          xpToAdd = Math.floor(baseXpGain * (effects.activeExpShare.xpShare || 0.5) * finalXPMult * levelScalingMult);
        } else if (p.hp > 0 && badgesCount > 0) {
          xpToAdd = Math.floor(baseXpGain * getRegionExpShareRate(finalBadges, activeRegion) * finalXPMult * levelScalingMult);
        }

        // Lucky Egg (Antiga Lógica Hold - Mantida para compatibilidade se necessário)
        if (p.heldItem === 'lucky_egg' && !(effects.activeLuckyEgg?.endsAt > now)) {
          xpToAdd = Math.floor(xpToAdd * 1.5);
        }

        if (xpToAdd <= 0) {
           // Se não ganhou XP, apenas reseta estágios e remove status voláteis (confusão)
           if (p.hp > 0) return { 
             ...p, 
             status: (p.status || []).filter(s => s !== 'confuse'),
             stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 } 
           };
           return p;
        }

        const newXp = (p.xp || 0) + xpToAdd;
        const n = p.level || 1; const xpNeeded = Math.pow(n + 1, 3) - Math.pow(n, 3);
        const maxLevel = getRegionLevelCap(finalBadges, activeRegion);
        const isLevelCapped = gameState.settings?.levelCap !== false && (p.level || 5) >= maxLevel;

        if (newXp >= xpNeeded) {
          if (isLevelCapped) {
            return { ...p, level: maxLevel, xp: xpNeeded - 1, stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 } };
          }

          const newLevel = (p.level || 5) + 1;
          addLog(`🎉 ${p.name} subiu para Nv. ${newLevel}!`, 'system');
          notify({ type: 'level_up', title: `${p.name} subiu para Nv.${newLevel}!`, message: 'Continue treinando!', pokemonId: p.id, isShiny: p.isShiny });
          sfxLevelUp();

          let newMoves = [...(p.moves || [])];
          let newLearnedMoves = p.learnedMoves ? [...p.learnedMoves] : [...newMoves];
          const pokeData = POKEDEX[Number(p.id)];

          if (pokeData?.learnset) {
            const movesToLearn = pokeData.learnset.filter(l => l.level === newLevel);
            movesToLearn.forEach(learn => {
              const moveKey = (learn.move || '').toLowerCase();
              const moveData = MOVES[moveKey];
              if (moveData && !newLearnedMoves.some(m => m.name === (MOVE_TRANSLATIONS[moveKey] || moveData.name))) {
                const moveObj = { 
                  ...moveData, 
                  name: MOVE_TRANSLATIONS[moveKey] || moveData.name || learn.move 
                };
                newLearnedMoves.push(moveObj);
                if (newMoves.length < 4 && !newMoves.some(m => m.name === moveObj.name)) {
                  newMoves.push(moveObj);
                  addLog(`( ${p.name} aprendeu ${moveObj.name}!`, 'system');
                } else {
                  addLog(`✨ ${p.name} aprendeu ${moveObj.name}! (Salvo na Memória)`, 'system');
                }
              }
            });
          }

          const evos = Array.isArray(pokeData?.evolution) ? pokeData.evolution : (pokeData?.evolution ? [pokeData.evolution] : []);
          const levelEvos = evos.filter(e =>
            e.level && !e.item &&
            newLevel >= e.level &&
            (!e.time || e.time.includes(getTimeOfDay())) &&
            isEvolutionAllowedForRegion(p, e.id, prev.activeRegion || 'kanto')
          );
          if (levelEvos.length === 1 && evos.length === 1) {
            setEvolutionPending({ ...p, level: newLevel, targetEvolution: levelEvos[0], teamIndex: i });
          } else if (evos.length > 1 && levelEvos.length >= 1) {
            // Múltiplos caminhos (por nível ou regional) → tela de escolha
            setEvolutionPending({ ...p, level: newLevel, choices: evos, teamIndex: i });
          }

          const shinyMult = getShinyMult(p);
          const calcStat = (b, lv) => Math.max(1, Math.ceil(Math.ceil(((2 * b * lv) / 100) + 5) * shinyMult));
          const calcHp   = (b, lv) => Math.max(1, Math.ceil(Math.ceil(((2 * b * lv) / 100) + lv + 10) * shinyMult));

          const baseStats = pokeData || {};
          const newMaxHp = calcHp(baseStats.hp || 45, newLevel);

          return { ...p, level: newLevel, xp: newXp - xpNeeded, moves: newMoves, learnedMoves: newLearnedMoves,
            maxHp: newMaxHp,
            hp: newMaxHp,
            attack:  calcStat(baseStats.attack  || 45, newLevel),
            defense: calcStat(baseStats.defense || 45, newLevel),
            spAtk:   calcStat(baseStats.spAtk   || 45, newLevel),
            spDef:   calcStat(baseStats.spDef   || 45, newLevel),
            speed:   calcStat(baseStats.speed   || 45, newLevel),
            stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 }
          };
        }
        return { ...p, xp: newXp, hp: Math.min(p.maxHp, p.hp + Math.ceil(p.maxHp * 0.50)), 
          status: (p.status || []).filter(s => s !== 'confuse'),
          stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } 
        };
      });

      // ── Raid: contagem de batalhas e spawn por batalhas ──────────────────────
      const newBattlesSinceRaid = (prev.battlesSinceLastRaid || 0) + 1;
      let raidSpawnUpdate = {};
      const isRaidBusy = prev.activeRaid && prev.activeRaid.phase !== 'ended';
      if (!isRaidBusy && newBattlesSinceRaid >= RAID_BATTLE_TRIGGER) {
        const region = prev.activeRegion || 'kanto';
        const badgeCount = getRegionBadgeCount(prev.badges || [], region);
        const raid = createRaid(region, POKEDEX, badgeCount);
        if (raid) {
          raidSpawnUpdate = { activeRaid: raid, battlesSinceLastRaid: 0 };
          localStorage.setItem(RAID_SPAWN_STORAGE_KEY, String(Date.now() + RAID_SPAWN_INTERVAL_MS));
          setTimeout(() => addLog(`⚔️ RAID APARECEU! ${raid.name} (${raid.stars}⭐) está na área!`, 'system'), 0);
        }
      }

      return {
        ...prev,
        currency: (prev.currency || 0) + (drops.currency || 0) + getTrainerCurrencyReward(currentEnemy.trainerReward || 0),
        inventory: newInventory,
        team: newTeam,
        worldFlags: [...newFlags, ...tempWorldFlags].filter((v, i, a) => a.indexOf(v) === i),
        badges: newBadges,
        gymDefeatCounts: newGymCounts,
        trainerBattleWins: (prev.trainerBattleWins || 0) + (currentEnemy.isTrainer ? 1 : 0),
        playerStats: bumpPlayerStats(prev.playerStats, {
          pokemonDefeated: 1,
          shinyDefeated: currentEnemy.isShiny ? 1 : 0,
          trainersDefeated: currentEnemy.isTrainer ? 1 : 0,
          villainEncounters: (currentEnemy.isRocket || currentEnemy.isVillainAmbush || ['rocket', 'villain', 'team'].includes(currentEnemy.challengeCategory)) ? 1 : 0,
          villainDefeated: (currentEnemy.isRocket || currentEnemy.isVillainAmbush || ['rocket', 'villain', 'team'].includes(currentEnemy.challengeCategory)) ? 1 : 0,
          wildBossDefeated: currentEnemy.isWildBoss ? 1 : 0,
          raidEncounters: raidSpawnUpdate.activeRaid ? 1 : 0,
        }),
        battlesSinceLastRaid: raidSpawnUpdate.activeRaid ? 0 : newBattlesSinceRaid,
        ...raidSpawnUpdate,
      };
    });

    messages.forEach(m => addLog(m, 'drop'));
    // Modal de receita encontrada — só aparece se for nova e não houver um modal aberto
    const newRecipes = foundRecipes?.filter(r => r.isNew);
    if (newRecipes?.length > 0 && !recipeFoundModal) {
      setTimeout(() => setRecipeFoundModal(newRecipes[0]), 400);
    } else if (rareDrops?.length > 0 && !rareDropModal && !recipeFoundModal) {
      setTimeout(() => setRareDropModal(rareDrops[0]), 400);
    }
    if (currentEnemy.isTrainer && currentEnemy.trainerReward) {
      const actualReward = getTrainerCurrencyReward(currentEnemy.trainerReward || 0);
      addLog(` 🏆 ${currentEnemy.trainerName} derrotado! +${actualReward} coins`, 'system');
    }
    if (currentEnemy.isRocket) addLog('🚀 Grunt da Equipe Rocket derrotado!', 'system');
    if (currentEnemy.isShiny) addLog('✨ Pokémon shiny derrotado!', 'system');

    const actualTrainerReward = getTrainerCurrencyReward(currentEnemy.trainerReward || 0);
    sessionRef.current.kills += 1;
    sessionRef.current.coins += (drops.currency || 0) + actualTrainerReward;
    if (currentEnemy.isTrainer) sessionRef.current.trainers += 1;
    if (currentEnemy.isShiny) sessionRef.current.shinyKills += 1;

    Object.entries(drops.materials || {}).forEach(([k, v]) => {
      sessionRef.current.drops[k] = (sessionRef.current.drops[k] || 0) + v;
    });

    setTimeout(() => {
      setGameState(prev => {
        const acConfig   = prev.autoCaptureConfig || {};
        const routeConfig = acConfig.routeConfigs?.[prev.currentRoute] || acConfig;
        const captureMode = routeConfig.mode || 'shiny_only';
        const ballPref    = routeConfig.ballPriority || 'auto';
        const hpThresh    = routeConfig.hpThreshold || 30;

        // Verificar se deve tentar capturar este Pokémon
        const hpPctEnemy  = ((currentEnemy.hp / currentEnemy.maxHp) * 100);
        const shouldTry   = prev.autoCapture && prev.autoCaptureConfig?.enabled &&
          !currentEnemy.isTrainer &&
          !currentEnemy.isWildBoss &&
          (!(currentEnemy.types || [currentEnemy.type]).includes('Ghost') || canCaptureGhostPokemon(prev)) &&
          hpPctEnemy <= hpThresh;

        if (shouldTry) {
          // Verificar modo
          const alreadyHave = ownsSpecies(prev, currentEnemy.id);

          const targetIds = (routeConfig.targetIds || []).map(Number);
          const shouldCapture =
            captureMode === 'all'                    ? true :
            captureMode === 'shiny_only'             ? currentEnemy.isShiny :
            captureMode === 'not_caught'             ? !alreadyHave :
            captureMode === 'not_caught_plus_shiny'  ? (!alreadyHave || currentEnemy.isShiny) :
            captureMode === 'specific'               ? targetIds.includes(Number(currentEnemy.id)) :
            captureMode === 'specific_plus_shiny'    ? (targetIds.includes(Number(currentEnemy.id)) || currentEnemy.isShiny) :
            false;

          if (shouldCapture) {
            // Selecionar a melhor bola disponível
            const ballOrder = ballPref === 'auto'
              ? ['ultra_ball', 'great_ball', 'pokeballs']
              : [ballPref, 'ultra_ball', 'great_ball', 'pokeballs'];

            const ballMultipliers = {
              ultra_ball: 2.0, great_ball: 1.5, pokeballs: 1.0,
              lure_ball: 3.0, moon_ball: 4.0,
            };

            const selectedBall = ballOrder.find(b => (prev.inventory.items?.[b] || 0) > 0);

            if (selectedBall) {
              const mult      = ballMultipliers[selectedBall] || 1.0;
              const catchRate = getCaptureRate(currentEnemy, mult, POKEDEX);

              if (Math.random() < catchRate) {
                // CAPTURADO!
                sessionRef.current.captures.push({ name: currentEnemy.name, id: currentEnemy.id, isShiny: currentEnemy.isShiny });
                
                let newInventoryItems = { 
                  ...prev.inventory.items, 
                  [selectedBall]: (prev.inventory.items[selectedBall] || 0) - 1 
                };
                
                const alreadyCaught = ownsSpecies(prev, currentEnemy.id);
                const newCaughtData = { ...(prev.caughtData || {}), [currentEnemy.id]: true };
                const newMastery = processCaptureMastery({ ...currentEnemy, id: Number(currentEnemy.id) }, prev);
                
                const { questUpdate, log: questLog } = updateQuestProgress(prev, 'capture');
                if (questLog) addLog(questLog, 'drop');
                if (questUpdate.inventory) newInventoryItems = questUpdate.inventory.items;


                addLog(
                  `${currentEnemy.isShiny ? '✨ SHINY ' : ''}${currentEnemy.name} capturado automaticamente com ${ITEM_LABELS[selectedBall]?.name || selectedBall}!`,
                  'system'
                );
                if (currentEnemy.isShiny) {
                  notify({ type: 'capture', title: '✨ SHINY capturado!', message: `${currentEnemy.name} brilhante foi capturado!`, duration: 6000 });
                }
                sfxCapture();

                if (alreadyCaught) {
                  const findAndReplace = (list) => list.map(p => {
                    if (Number(p.id) === Number(currentEnemy.id)) {
                      if (currentEnemy.isShiny) {
                        const upgraded = applyShinyUpgrade(p, POKEDEX[Number(p.id)]);
                        const newCount = upgraded.shinyCount;
                        if (!p.isShiny) {
                          addLog(`✨ Upgrade Shiny! ${p.name} agora é Brilhante! (+20% stats)`, 'system');
                        } else {
                          addLog(`✨ Shiny Stack x${newCount}! ${p.name} ficou ainda mais forte!`, 'system');
                        }
                        return upgraded;
                      }
                    }
                    return p;
                  });
                  return { 
                    ...prev, 
                    team: findAndReplace(prev.team), 
                    pc: findAndReplace(prev.pc || []), 
                    inventory: { ...prev.inventory, items: newInventoryItems }, 
                    speciesMastery: newMastery, 
                    caughtData: newCaughtData, 
                    shinyCapturedCount: (prev.shinyCapturedCount || 0) + (currentEnemy.isShiny ? 1 : 0),
                    playerStats: bumpPlayerStats(prev.playerStats, {
                      pokemonCaptured: 1,
                      shinyCaptured: currentEnemy.isShiny ? 1 : 0,
                    }),
                    ...questUpdate 
                  };
                } else {
                  // Primeira Captura
                  const newPoke = assignRandomAbility({ ...currentEnemy, id: Number(currentEnemy.id), hp: currentEnemy.maxHp, xp: 0, instanceId: Date.now() + '-' + Math.random().toString(36).substr(2, 9), capturedRegion: prev.activeRegion || 'kanto' }, POKEDEX[Number(currentEnemy.id)]);
                  const newTeam = [...prev.team];
                  const newPC = [...(prev.pc || [])];
                  if (newTeam.length < 6) newTeam.push(newPoke); else newPC.push(newPoke);

                  return { 
                    ...prev, 
                    team: newTeam, 
                    pc: newPC, 
                    inventory: { ...prev.inventory, items: newInventoryItems }, 
                    speciesMastery: newMastery, 
                    caughtData: newCaughtData, 
                    shinyCapturedCount: (prev.shinyCapturedCount || 0) + (currentEnemy.isShiny ? 1 : 0),
                    playerStats: bumpPlayerStats(prev.playerStats, {
                      pokemonCaptured: 1,
                      shinyCaptured: currentEnemy.isShiny ? 1 : 0,
                    }),
                    ...questUpdate 
                  };
                }
              } else {
                // ESCAPOU
                addLog(`${currentEnemy.name} escapou da ${ITEM_LABELS[selectedBall]?.name || selectedBall}!`, 'enemy');
                return {
                  ...prev,
                  inventory: {
                    ...prev.inventory,
                    items: { ...prev.inventory.items, [selectedBall]: (prev.inventory.items[selectedBall] || 0) - 1 }
                  }
                };
              }
            }
          }
        }
        return prev;
      });
      isProcessingVictory.current = false;
      if (currentEnemy.unlockFlag === 'rival_1_defeated') {
        setCurrentView('prof_oak_starters_announcement');
      } else if (currentEnemy.unlockFlag === 'unova_rival_1_defeated') {
        setCurrentView('prof_juniper_announcement');
      } else if (currentEnemy.isInitialRival) {
        setCurrentView('rival_post_battle');
      } else if (isStoryVsEnemy(currentEnemy)) {
        // Rival / Equipe vilã — modal de vitória completo
        setShowGymVictoryModal({
          leaderName: currentEnemy.trainerName || 'Rival',
          leaderSprite: currentEnemy.trainerSprite,
          badge: null,
          category: currentEnemy.challengeCategory || 'rival',
          reward: getTrainerCurrencyReward(currentEnemy.trainerReward || 500),
          expShare: null,
          nextView: 'battles',
        });
      } else if (currentEnemy.isGymLeader || currentEnemy.isBoss) {
        // Elite Four / Boss sem insígnia — modal de vitória sem badge
        if (!currentEnemy.badgeToGive) {
          setShowGymVictoryModal({
            leaderName: currentEnemy.trainerName || 'Elite Four',
            leaderSprite: currentEnemy.trainerSprite,
            badge: null,
            category: currentEnemy.challengeCategory || 'elite',
            reward: getTrainerCurrencyReward(currentEnemy.trainerReward || 2000),
            expShare: null,
            nextView: 'city',
          });
        }
        handleGoToCity();
      } else {
        spawnEnemy();
      }
    }, 600);
  }, [currentEnemy?.hp, isStoryVsEnemy, openStoryBattleResult]);

  const renderView = (props = {}) => {
    if (loading) return (
      <div className="h-full flex items-center justify-center bg-[#0F2D3A] text-white font-black italic text-2xl uppercase tracking-tighter animate-pulse">
        <span>Carregando Dados...</span>
      </div>
    );
    
    if (!user) return <AuthScreen onAuthSuccess={() => {}} installPrompt={installPrompt} handleInstallPWA={handleInstallPWA} isIOS={isIOS} isStandalone={isStandalone} />;

    switch(currentView) {
      case 'landing': {
        const hasSave = Boolean(
          (gameState.team && gameState.team.length > 0) ||
          (gameState.pc && gameState.pc.length > 0) ||
          Object.values(gameState.regional_teams || gameState.regionalTeams || {}).some(team => (team || []).length > 0) ||
          Object.keys(gameState.caughtData || {}).length > 0 ||
          (gameState.worldFlags || []).length > 0 ||
          (gameState.badges || []).length > 0
        );
        const startNewJourney = async () => {
          const freshState = removeUndefinedFields({ ...DEFAULT_GAME_STATE, version: APP_VERSION, lastUpdate: APP_VERSION_DATE });
          setGameState(freshState);
          resetSession();
          setIntroStep(0);
          setCurrentView('intro');
          
          // Force immediate cloud reset
          const u = auth.currentUser;
          if (u) {
            try {
              lastSyncRef.current = Date.now();
              const compressedFresh = LZString.compress(JSON.stringify(freshState));
              await setDoc(doc(db, "saves", u.uid), {
                compressedState: compressedFresh,
                updatedAt: serverTimestamp(),
                resetAt: serverTimestamp()
              }, { merge: false }); // merge: false ensures we overwrite EVERYTHING
            } catch (e) {
              console.error("Cloud reset fail:", e);
            }
          }
        };

        return (
          <div className="h-full flex flex-col items-center justify-center bg-[#0F2D3A] p-6 relative overflow-hidden text-center">

             <div className="relative z-10 animate-fadeIn flex flex-col items-center">
                <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                  <div className="text-center select-none">
                    <h1
                      className="font-black uppercase leading-none"
                      style={{
                        fontSize: '3.5rem',
                        fontFamily: "'Arial Black', 'Impact', sans-serif",
                        color: '#FFD700',
                        textShadow: `
                          3px 3px 0px #CC0000,
                          -1px -1px 0px #CC0000,
                          1px -1px 0px #CC0000,
                          -1px 1px 0px #CC0000,
                          4px 4px 6px rgba(0,0,0,0.8)
                        `,
                        letterSpacing: '-1px',
                      }}
                    >
                      POKÉCRAFT
                    </h1>
                    <h2
                      className="font-black uppercase leading-none -mt-2"
                      style={{
                        fontSize: '2rem',
                        fontFamily: "'Arial Black', 'Impact', sans-serif",
                        color: '#CC0000',
                        textShadow: `
                          2px 2px 0px #FFD700,
                          -1px -1px 0px #FFD700,
                          1px -1px 0px #FFD700,
                          -1px 1px 0px #FFD700,
                          3px 3px 5px rgba(0,0,0,0.8)
                        `,
                        letterSpacing: '4px',
                      }}
                    >
                      IDLE
                    </h2>
                  </div>
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" className="w-24 h-24 mt-2 animate-float-slow drop-shadow-xl" alt="Snorlax" />
                </div>
                
                {/* ⛔ PROTECTED: Botões Landing — NÃO ALTERAR TAMANHO, PADDING OU ESTILO SEM AUTORIZAÇÃO */}
                <div style={{width:'100%', display:'flex', flexDirection:'column', gap:'16px', padding:'0'}}>
                  {/* ⛔ PROTECTED: Botão CONTINUAR JORNADA */}
                  <button 
                    onClick={() => setCurrentView(hasSave ? 'city' : 'intro')}
                    style={{width:'100%', padding:'20px', borderRadius:'24px', fontWeight:'900', fontSize:'18px', textTransform:'uppercase', letterSpacing:'2px', background:'white', color:'#1d4ed8', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.3)', cursor:'pointer'}}
                  >
                    {hasSave ? 'CONTINUAR JORNADA' : 'INICIAR NOVA JORNADA'}
                  </button>
                   {/* ⛔ END PROTECTED: Botões Landing */}
                   {/* Botão de Instalação PWA na Landing (Sempre visível se não for standalone) */}
                   {!isStandalone && (
                     <button
                       onClick={handleInstallPWA}
                       style={{
                         width: '100%',
                         marginTop: '8px',
                         padding: '16px',
                         borderRadius: '24px',
                         fontWeight: '900',
                         fontSize: '14px',
                         textTransform: 'uppercase',
                         letterSpacing: '1px',
                         background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                         color: 'white',
                         border: 'none',
                         boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
                         cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: '10px',
                       }}
                       className="animate-bounce"
                     >
                       <img src={POKEAPI_ITEM_URL + 'up-grade.png'} className="h-6 w-6 object-contain" alt="" />
                       {isIOS ? 'Como Instalar (iOS)' : (installPrompt ? 'Instalar Aplicativo (PWA)' : 'Preparando instala??o...')}
                     </button>
                   )}

                   {showRanking && (
                     <RankingModal onClose={() => setShowRanking(false)} />
                   )}

                   {/* Botão de Ranking Global na Landing */}
                   <button
                     onClick={() => setShowRanking(true)}
                     style={{
                       width: '100%',
                       marginTop: '8px',
                       padding: '16px',
                       borderRadius: '24px',
                       fontWeight: '900',
                       fontSize: '14px',
                       textTransform: 'uppercase',
                       letterSpacing: '1px',
                       background: 'rgba(255,255,255,0.1)',
                       color: 'white',
                       border: '2px solid rgba(255,255,255,0.2)',
                       boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: '10px',
                     }}
                   >
                     <img src={POKEAPI_ITEM_URL + 'kings-rock.png'} className="h-6 w-6 object-contain" alt="" />
                     Ranking Global
                   </button>



                   {/* ⛔ PROTECTED: Botão REINICIAR JORNADA */}
                   <button
                     onClick={() => { showConfirm({ type:'danger', title:'Reiniciar Jornada', message:'Isso apagará todo seu progresso. Tem certeza?', confirmLabel:'Sim, reiniciar', cancelLabel:'Cancelar', onConfirm:() => { closeConfirm(); startNewJourney(); }, onCancel:closeConfirm }); }}
                     style={{width:'100%', padding:'20px', borderRadius:'24px', fontWeight:'900', fontSize:'18px', textTransform:'uppercase', letterSpacing:'2px', background:'rgba(59,130,246,0.2)', color:'white', border:'2px solid rgba(255,255,255,0.3)', boxShadow:'0 4px 12px rgba(0,0,0,0.3)', cursor:'pointer'}}
                   >
                     REINICIAR JORNADA
                   </button>
                   {user && (
                     <button
                       onClick={() => {
                         firebaseSignOut(auth).then(() => {
                           setUser(null);
                           setCurrentView('landing');
                         }).catch(e => {
                           console.error("Logout fail:", e);
                           notify('Erro ao sair. Verifique sua conexão.', 'error');
                         });
                       }}
                       style={{
                         width: '100%',
                         padding: '14px',
                         borderRadius: '24px',
                         fontWeight: '900',
                         fontSize: '13px',
                         textTransform: 'uppercase',
                         letterSpacing: '1.5px',
                         background: 'rgba(239,68,68,0.15)',
                         color: 'rgba(252,165,165,0.9)',
                         border: '1.5px solid rgba(239,68,68,0.35)',
                         cursor: 'pointer',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         gap: '8px',
                       }}
                     >
                       <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                         <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                       </svg>
                       Sair da Conta
                     </button>
                   )}
                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest text-center mt-4">
                     POKÉCRAFT IDLE {APP_VERSION} • {APP_VERSION_DATE}
                   </p>
                 </div>
              </div>


             {/* FOREGROUND DECOR - FRONT LAYER */}
             <div className="absolute inset-0 z-20 pointer-events-none opacity-40">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" className="absolute bottom-10 right-10 w-32 h-32 md:w-64 md:h-64 -rotate-12 animate-float-delayed" alt="" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png" className="absolute top-20 right-[20%] w-12 h-12 md:w-24 md:h-24 rotate-45 animate-float-slow" alt="" />
             </div>
          </div>
        );
      }
            case 'intro': {
        const introTexts = [
          "Olá! Bem-vindo ao mundo POKÉMON!",
          "Meu nome é CARVALHO. As pessoas me chamam de PROFESSOR POKÉMON.",
          "Este mundo é habitado por criaturas chamadas POKÉMON!",
          "Para alguns, POKÉMON são animais de estimação. Outros os usam para lutar.",
          "Eu... Eu estudo POKÉMON como profissão.",
          "Mas primeiro, diga-me... Qual é o seu nome?"
        ];
        
        const isLastStep = introStep === introTexts.length - 1;
        const labBg = fixPath('/bg_lab_1776866008842.webp');

        return (
          <div className="h-full flex flex-col items-center justify-end p-4 text-center animate-fadeIn relative overflow-hidden"
            style={{ backgroundImage: `url(${labBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Professor */}
            <div className="flex-1 flex items-center justify-center relative z-10">
              <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                className="h-52 md:h-72 drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-float"
                alt="Oak" />
            </div>

            {/* ⛔ PROTECTED: Balão de Diálogo Intro — Padrão Oficial 1.10.0 */}
            <div style={{
              position: 'absolute',
              bottom: '60px',        // ← acima do nav (60px de altura)
              left: 0,
              right: 0,
              width: '100%',         // ← não ultrapassa o container
              maxWidth: '100%',      // ← garante que não estoura
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '16px 20px 20px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 10,
              boxSizing: 'border-box', // ← padding não estoura a largura
            }} className="animate-slideUp">
              <p style={{
                fontSize: '11px', fontWeight: 900,
                color: '#16a34a',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
              }}>Prof. Carvalho:</p>
              <p style={{
                fontSize: '14px', fontWeight: 700,
                color: '#1e293b', lineHeight: '1.5', marginBottom: '16px',
              }}>{introTexts[introStep]}</p>
              
              {isLastStep && (
                <div style={{marginBottom: '16px'}} className="animate-bounceIn">
                  <input 
                    type="text" 
                    name="trainerName"
                    placeholder="SEU NOME..." 
                    value={gameState.trainer?.name || ''} 
                    onChange={(e) => setGameState(prev => ({ ...prev, trainer: { ...prev.trainer, name: e.target.value.toUpperCase() } }))}
                    style={{
                      width: '100%', padding: '16px', borderRadius: '16px',
                      border: '2px solid #e2e8f0', background: '#f8fafc',
                      textAlign: 'center', fontWeight: 900, fontSize: '16px',
                      textTransform: 'uppercase', outline: 'none'
                    }}
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="words"
                    spellCheck="false"
                  />
                </div>
              )}

              <button onClick={async () => {
                if (isLastStep) {
                  if (!gameState.trainer?.name || gameState.trainer.name.length < 2) {
                    showConfirm({ title: 'Nome Inválido', message: 'Diga-me seu nome para continuarmos!', onConfirm: closeConfirm });
                    return;
                  }
                  // Verificar unicidade do nome
                  setCheckingName(true);
                  try {
                    const nameLower = gameState.trainer.name.toLowerCase().trim();
                    const q = query(collection(db, 'users'), where('nameLower', '==', nameLower));
                    const snap = await getDocs(q);
                    const takenByOther = snap.docs.some(d => d.id !== auth.currentUser?.uid);
                    if (takenByOther) {
                      showConfirm({ title: 'Nome Indisponível', message: 'Este nome já está em uso por outro treinador. Escolha outro!', onConfirm: closeConfirm });
                      setCheckingName(false);
                      return;
                    }
                  } catch (e) {
                    console.error('name uniqueness check failed:', e);
                  }
                  setCheckingName(false);
                  setCurrentView('trainer_creation');
                } else {
                  setIntroStep(s => s + 1);
                }
              }} disabled={checkingName} style={{
                width: '100%', padding: '18px',
                borderRadius: '16px',
                background: '#16a34a',
                color: 'white', fontWeight: 900,
                fontSize: '16px', textTransform: 'uppercase',
                letterSpacing: '2px', border: 'none', cursor: 'pointer',
                minHeight: '64px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>{checkingName ? '⏳ Verificando...' : (isLastStep ? 'Tudo Pronto!' : 'PRÓXIMO ▶')}</button>
            </div>
          </div>
        );
      }
      case 'trainer_creation': {
        const maleAvatars = trainerAvatars.filter(a => 
          ['red', 'ethan', 'brendan', 'lucas', 'hilbert', 'calem'].includes(a.id)
        );

        const femaleAvatars = trainerAvatars.filter(a => 
          ['leaf', 'lyra', 'may', 'dawn', 'hilda', 'serena'].includes(a.id)
        );

        return (
          <>
            {/* ⛔ PROTECTED: Tela de Avatar — NíO ALTERAR SEM AUTORIZAÇíO */}
            <div className="h-full bg-slate-50 flex flex-col items-center justify-start p-6 animate-fadeIn relative overflow-y-auto">
               <div style={{paddingTop: '24px', textAlign: 'center', marginBottom: '16px'}}>
                 <h2 className="text-4xl font-black text-slate-800 uppercase italic mb-1 tracking-tighter">Muito bem, {gameState.trainer?.name}!</h2>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Escolha seu Avatar</p>
               </div>
               
               <div style={{display:'flex', flexDirection:'column', width:'100%', maxWidth:'360px', margin:'0 auto', padding:'24px', background:'white', borderRadius:'3rem', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)', borderBottom:'8px solid #e2e8f0'}}>
                  <div style={{display:'flex', gap:'8px', marginBottom:'16px', padding:'0 4px'}}>
                    <button onClick={() => setAvatarTab('male')} style={{flex: 1, padding: '12px', borderRadius: '16px', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: avatarTab === 'male' ? '#2563eb' : '#e2e8f0', color: avatarTab === 'male' ? 'white' : '#64748b'}}>♂ Masculino</button>
                    <button onClick={() => setAvatarTab('female')} style={{flex: 1, padding: '12px', borderRadius: '16px', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: avatarTab === 'female' ? '#db2777' : '#e2e8f0', color: avatarTab === 'female' ? 'white' : '#64748b'}}>♀ Feminino</button>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'8px'}}>
                    {(avatarTab === 'male' ? maleAvatars : femaleAvatars).map(avatar => (
                      <button key={avatar.id} onClick={() => handleSelectAvatar(avatar)} style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 8px', borderRadius:'16px', border:'2px solid', borderColor: selectedAvatar?.id === avatar.id ? (avatarTab === 'male' ? '#2563eb' : '#db2777') : '#e2e8f0', background: selectedAvatar?.id === avatar.id ? (avatarTab === 'male' ? '#eff6ff' : '#fdf2f8') : 'white', cursor:'pointer', transition:'all 0.2s', opacity: (selectedAvatar && selectedAvatar.id !== avatar.id) ? 0.5 : 1, transform: selectedAvatar?.id === avatar.id ? 'scale(0.95)' : 'none'}}>
                        <img src={avatar.img} style={{width:'80px', height:'80px', objectFit:'contain'}} alt={avatar.name} onError={e => { e.target.closest('button').style.display='none'; }} />
                        <span style={{fontSize:'10px', fontWeight:900, color:'#475569', textTransform:'uppercase', marginTop:'8px'}}>{avatar.name}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </>
        );
      }
            case 'starter_selection': return (
        <div style={{position:'relative', height:'100%', width:'100%', overflow:'hidden'}}>
          <div style={{paddingTop:'16px', display:'flex', flexDirection:'column', alignItems:'center', height:'100%', background:'#f8fafc', overflowY:'auto'}}>

            {/* Professor Oak */}
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'8px', padding:'0 16px'}}>
              <img
                src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                onError={e => { e.currentTarget.style.display = 'none'; }}
                style={{height:'110px', objectFit:'contain', filter:'drop-shadow(0 6px 16px rgba(0,0,0,0.18))'}}
                alt="Prof. Carvalho"
              />
              <div style={{
                background:'white', borderRadius:'16px', padding:'10px 20px',
                boxShadow:'0 4px 16px rgba(0,0,0,0.08)', marginTop:'-8px',
                border:'2px solid #e2e8f0', textAlign:'center', maxWidth:'320px'
              }}>
                <p style={{fontSize:'9px', fontWeight:900, color:'#16a34a', textTransform:'uppercase', letterSpacing:'2px', margin:0}}>
                  Prof. Carvalho
                </p>
                <p style={{fontSize:'12px', fontWeight:700, color:'#475569', margin:'4px 0 0', lineHeight:1.4}}>
                  "Sua jornada começa agora — escolha seu Pokémon inicial com sabedoria!"
                </p>
              </div>
            </div>

            {/* Título com espaço do header */}
            <div style={{textAlign:'center', marginBottom:'12px', padding:'0 16px'}}>
              <h2 style={{fontSize:'22px', fontWeight:900, textTransform:'uppercase', fontStyle:'italic', color:'#1e293b', lineHeight:1.1, margin:0}}>
                ESCOLHA SEU PARCEIRO
              </h2>
              <p style={{fontSize:'11px', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'2px', marginTop:'4px', margin:0}}>
                Cada jornada começa com um único passo
              </p>
            </div>

            {/* Cards dos starters */}
            <div style={{display:'flex', flexDirection:'column', gap:'10px', width:'100%', maxWidth:'400px', padding:'0 16px 24px 16px'}}>
              {INITIAL_POKEMONS.map(starter => (
                <button
                  key={starter.id}
                  onClick={() => setPreviewStarter(starter)}
                  style={{
                    display:'flex', alignItems:'center', gap:'16px',
                    padding:'16px 20px', borderRadius:'20px',
                    border: '2px solid',
                    borderColor: previewStarter?.id === starter.id ? '#2563eb' : '#e2e8f0',
                    background: previewStarter?.id === starter.id ? '#eff6ff' : 'white',
                    cursor:'pointer', transition:'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    width:'100%', textAlign:'left',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + starter.id + '.png'}
                    style={{width:'64px', height:'64px', objectFit:'contain', flexShrink:0}}
                    alt={starter.name}
                  />
                  <div style={{flex:1}}>
                    <p style={{fontWeight:900, fontSize:'16px', textTransform:'uppercase', fontStyle:'italic', color:'#1e293b', margin:0}}>
                      {starter.name}
                    </p>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginTop:'4px'}}>
                      <span style={{
                        fontSize:'10px', fontWeight:900, textTransform:'uppercase',
                        padding:'2px 8px', borderRadius:'8px', color:'white',
                        background: starter.type === 'Grass' ? '#16a34a' : starter.type === 'Fire' ? '#dc2626' : starter.type === 'Water' ? '#2563eb' : starter.type === 'Electric' ? '#ca8a04' : '#64748b'
                      }}>
                        {starter.type}
                      </span>
                      <span className="text-[11px] text-[#94a3b8] font-bold">
                        VER DETALHES
                      </span>
                    </div>
                  </div>
                  <span style={{fontSize:'14px', fontWeight:900, color:'#cbd5e1'}}>
                    #{String(starter.id).padStart(3,'0')}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* MODAL DE PREVIEW */}
           {(() => {
             if (!previewStarter) return null;
             
             const TYPE_BG_COLORS = {
               Fire:     'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
               Water:    'linear-gradient(135deg, #4FC3F7 0%, #0277BD 100%)',
               Grass:    'linear-gradient(135deg, #66BB6A 0%, #2E7D32 100%)',
               Electric: 'linear-gradient(135deg, #FFE034 0%, #F9A825 100%)',
               Psychic:  'linear-gradient(135deg, #F48FB1 0%, #C2185B 100%)',
               Ice:      'linear-gradient(135deg, #B3E5FC 0%, #0288D1 100%)',
               Dragon:   'linear-gradient(135deg, #7E57C2 0%, #311B92 100%)',
               Dark:     'linear-gradient(135deg, #546E7A 0%, #263238 100%)',
               Fighting: 'linear-gradient(135deg, #EF9A9A 0%, #B71C1C 100%)',
               Poison:   'linear-gradient(135deg, #CE93D8 0%, #6A1B9A 100%)',
               Ground:   'linear-gradient(135deg, #FFCC80 0%, #E65100 100%)',
               Rock:     'linear-gradient(135deg, #BCAAA4 0%, #4E342E 100%)',
               Bug:      'linear-gradient(135deg, #C5E1A5 0%, #558B2F 100%)',
               Ghost:    'linear-gradient(135deg, #9575CD 0%, #4527A0 100%)',
               Steel:    'linear-gradient(135deg, #B0BEC5 0%, #455A64 100%)',
               Normal:   'linear-gradient(135deg, #EEEEEE 0%, #9E9E9E 100%)',
               Flying:   'linear-gradient(135deg, #B3E5FC 0%, #7986CB 100%)',
             };

             const starterType = previewStarter.type || 'Normal';
             const starterBg   = TYPE_BG_COLORS[starterType] || TYPE_BG_COLORS.Normal;

             return (
               <div className="absolute inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
                   <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl border-b-[16px] border-slate-200 overflow-hidden relative animate-bounceIn">
                      <button
                        onClick={() => setPreviewStarter(null)}
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.35)',
                          border: '2px solid rgba(255,255,255,0.5)',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1,
                          backdropFilter: 'blur(4px)',
                          zIndex: 30,
                        }}
                      >
                        ✕
                      </button>

                      <div 
                        className="h-40 w-full relative flex items-end justify-center"
                        style={{ background: starterBg }}
                      >
                         <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                           <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-64 h-64 absolute -top-10 -left-10 rotate-12" alt="" />
                         </div>
                         <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${previewStarter.id}.png`} className="w-64 h-64 object-contain drop-shadow-2xl translate-y-20 relative z-10" alt={previewStarter.name} />
                      </div>

                      <div style={{
  padding: '20px 24px 28px 24px',
  background: 'white',
  borderRadius: '0 0 24px 24px',
}}>
                         <div className="text-center mb-8">
                            <h2 style={{
  fontSize: '24px',
  fontWeight: 900,
  fontStyle: 'italic',
  textTransform: 'uppercase',
  textAlign: 'center',
  padding: '0 40px',
  wordBreak: 'break-word',
}}>
  {previewStarter.name}
</h2>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2 block">Status Nível 5</span>
                         </div>

                         <div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  padding: '0 4px',
  marginTop: '12px',
}}>
                            {/* Atributos */}
                            <div className="flex flex-col gap-3">
                               <h4 className="font-black uppercase text-[10px] text-slate-400 tracking-widest border-b-2 border-slate-100 pb-1">Atributos Base</h4>
                               {[
                                 { label: 'HP', val: previewStarter.maxHp, color: 'bg-red-400' },
                                 { label: 'ATK', val: previewStarter.attack, color: 'bg-orange-400' },
                                 { label: 'DEF', val: previewStarter.defense, color: 'bg-blue-400' },
                                 { label: 'S.ATK', val: previewStarter.spAtk, color: 'bg-purple-400' },
                                 { label: 'S.DEF', val: previewStarter.spDef, color: 'bg-green-400' },
                                 { label: 'SPD', val: previewStarter.speed, color: 'bg-pink-400' }
                               ].map(s => (
                                 <div key={s.label} className="flex items-center gap-3">
                                   <span style={{
  fontSize: '11px',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '40px'
}}>{s.label}</span>
                                   <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                      <div className={`${s.color} h-full`} style={{ width: `${(s.val/25)*100}%` }}></div>
                                   </div>
                                   <span className="text-[10px] font-black text-slate-800">{s.val}</span>
                                 </div>
                               ))}
                            </div>

                            {/* Ataques */}
                            <div className="flex flex-col gap-3">
                               <h4 className="font-black uppercase text-[10px] text-slate-400 tracking-widest border-b-2 border-slate-100 pb-1">Ataques Aprendidos</h4>
                               {(previewStarter.moves || []).map((m, i) => (
                                 <div key={i} className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 flex justify-between items-center group">
                                    <div className="flex flex-col">
                                       <span style={{
  fontSize: '11px',
  fontWeight: 700,
  color: '#1e293b',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}}>{m.name}</span>
                                       <span className="text-[8px] font-bold text-slate-400 uppercase">{m.type}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 italic">PWR {m.power || '--'}</span>
                                 </div>
                               ))}
                            </div>
                         </div>

                          <button 
                            onClick={() => {
                              const p = previewStarter;
                               const myPoke = { 
                                 ...p, 
                                 hp: p.maxHp, 
                                 xp: 0, 
                                 instanceId: Date.now() + '-' + Math.random().toString(36).substr(2, 9), 
                                 status: [],
                                 capturedRegion: 'kanto',
                                 stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 }
                               };

                              setGameState(prev => ({ 
                                ...prev, 
                                team: [myPoke],
                                caughtData: { ...prev.caughtData, [p.id]: true },
                                worldFlags: [...(prev.worldFlags || []), 'has_starter'],
                                 inventory: {
                                   ...prev.inventory,
                                   items: {
                                     ...prev.inventory.items,
                                     fresh_water: (prev.inventory.items?.fresh_water || 0) + 10,
                                   },
                                 },
                                 oakTutorialShown: true
                              })); 
                              
                              setTimeout(() => setShowOakStaminaModal(true), 600);
                              setPreviewStarter(null);
                              setCurrentView('rival_intro'); 
                            }}
                            style={{
                              width: '100%',
                              padding: '18px',
                              marginTop: '16px',
                              borderRadius: '16px',
                              background: '#1d4ed8',
                              color: 'white',
                              fontWeight: 900,
                              fontSize: '16px',
                              textTransform: 'uppercase',
                              letterSpacing: '2px',
                              border: 'none',
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(29,78,216,0.4)',
                            }}
                          >
                            EU ESCOLHO VOCE!
                          </button>
                      </div>
                   </div>
                </div>
             );
           })()}
        </div>
      );
      case 'rival_intro': {
        const labBg = fixPath('/bg_lab_1776866008842.webp');
        return (
          <div className="h-full flex flex-col items-center animate-fadeIn relative overflow-hidden"
            style={{ backgroundImage: `url(${labBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
             <div className="absolute inset-0 bg-black/30"></div>
             {/* Sprite centrado */}
           <div className="flex-1 flex items-center justify-center relative z-10">
             <img src="https://play.pokemonshowdown.com/sprites/trainers/blue.png" className="h-72 drop-shadow-2xl animate-slideInRight" alt="Rival" />
           </div>
           {/* Balão na parte inferior */}
           <div style={{
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'white',
  borderRadius: '24px 24px 0 0',
  padding: '16px 20px 80px 20px',
  boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
  zIndex: 10,
}}>
  {/* Label do rival */}
  <p style={{
    fontSize: '11px',
    fontWeight: 900,
    color: '#dc2626',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  }}>
    RIVAL — AZUL:
  </p>

  {/* Texto do diálogo */}
  <p style={{
    fontSize: '14px',
    fontWeight: 700,
    color: '#1e293b',
    lineHeight: '1.5',
    marginBottom: '14px',
  }}>
    "Ei, espere aí! Eu também quero um POKÉMON! E eu vou escolher este aqui! Vejamos quem é o melhor treinador!"
  </p>

  {/* Botão BATALHAR */}
  <button
    onClick={startBattleAgainstRival}
    style={{
      width: '100%',
      padding: '16px',
      borderRadius: '16px',
      background: '#dc2626',
      color: 'white',
      fontWeight: 900,
      fontSize: '16px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(220,38,38,0.4)',
    }}
  >
    BATALHAR!
  </button>
</div>
        </div>
      );
    }
      case 'rival_post_battle': {
        const route = processedRoutes[gameState.currentRoute] || ROUTES[gameState.currentRoute];
        return (
          <div
            className="relative h-full flex flex-col items-center justify-center overflow-hidden"
            style={{
              backgroundImage: `url('${fixPath('/bg_lab_1776866008842.webp')}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40" />

            {/* Sprite centrado */}
            <div className="relative z-10 mb-20">
              <img
                src={getRivalSprite(gameState.trainer?.avatarImg)}
                alt="Rival"
                className="w-40 h-40 object-contain drop-shadow-2xl animate-float"
                onError={e => { e.target.style.display='none'; }}
              />
            </div>

            {/* Balão na parte inferior — Padrão Oficial 1.10.0 */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 36px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 10,
            }} className="animate-slideUp">
               <div className="absolute top-2 left-2 z-30 flex items-center gap-2 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg animate-fadeIn pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        <span className="text-[9px] font-black uppercase tracking-widest text-white/70">Localização:</span>
        <span className="text-[10px] font-black uppercase tracking-tighter text-white">{route.name}</span>
      </div><p style={{
                fontSize: '11px', fontWeight: 900,
                color: '#dc2626',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
              }}>Rival — Azul:</p>
              <p style={{
                fontSize: '14px', fontWeight: 700,
                color: '#1e293b', lineHeight: '1.5', marginBottom: '16px',
              }}>"Beleza... Vou fazer meu Pokémon lutar para deixá-lo mais forte. Da próxima vez não vou perder!"</p>
              <button onClick={() => { setCurrentEnemy(null); setCurrentView('city'); }} style={{
                width: '100%', padding: '18px',
                borderRadius: '16px',
                background: '#dc2626',
                color: 'white', fontWeight: 900,
                fontSize: '16px', textTransform: 'uppercase',
                letterSpacing: '2px', border: 'none', cursor: 'pointer',
                minHeight: '64px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>CONTINUAR →</button>
            </div>
          </div>
        );
      }
      case 'quest_oak': {
        const labBg = fixPath('/bg_lab_1776866008842.webp');
        return (
          <div className="h-full flex flex-col items-center animate-fadeIn relative overflow-hidden"
            style={{ backgroundImage: `url(${labBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            {/* Sprite centrado */}
          <div className="flex-1 flex items-center justify-center relative z-10">
            <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="h-64 drop-shadow-2xl animate-float" alt="Oak" />
          </div>
          {/* Balão na parte inferior */}
          <div className="w-full relative z-10 p-4">
            <div className="bg-white p-5 rounded-[2rem] shadow-2xl border-b-[10px] border-slate-800 w-full">
              <h3 className="text-lg font-black text-slate-800 italic uppercase mb-2 tracking-tighter">Prof. Carvalho:</h3>
              <p className="text-sm font-bold text-slate-600 mb-2 italic">"Que batalha incrível! Vocês dois têm muito talento."</p>
              <p className="text-sm font-black text-pokeBlue mb-4 uppercase tracking-tighter leading-tight">
                "Agora, preciso que você aprenda a capturar POKÉMONS. Vá até a ROTA 1 e capture seu primeiro parceiro!"
              </p>
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 mb-4">
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Nova Missão:</p>
                 <p className="text-xs font-bold text-slate-800 uppercase mt-1 italic">Capture 1 Pokémon na Rota 1</p>
                 <p className="text-[9px] font-black text-slate-400 mt-1 uppercase">Recompensa: 10 Pokébolas</p>
              </div>
              <button
                onClick={() => {
                  setGameState(prev => ({ ...prev, inventory: { ...prev.inventory, items: { ...prev.inventory.items, pokeballs: (prev.inventory.items.pokeballs || 0) + 10 } }, worldFlags: [...(prev.worldFlags || []), "quest_capture_active"] })); setCurrentView("navigation_hub");
                }}
                className="w-full bg-pokeBlue text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
              >Entendido!</button>
            </div>
          </div>
        </div>
      );
    }
      case 'quest_oak_starters': {
        const labBg = fixPath('/bg_lab_1776866008842.webp');
        return (
          <div className="h-full flex flex-col items-center animate-fadeIn relative overflow-hidden"
            style={{ backgroundImage: `url(${labBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/35" />
            <div className="flex-1 flex items-center justify-center relative z-10">
              <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                className="h-64 drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-float"
                alt="Oak" />
            </div>
            <div className="w-full relative z-10 p-4">
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-[2rem] shadow-2xl border-b-[10px] border-slate-800 w-full">
                <div className="flex items-center gap-2 mb-3">
                  <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-8 h-8 rounded-full object-contain bg-slate-100 p-0.5" alt="" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prof. Carvalho</span>
                </div>
                <p className="text-sm font-bold text-slate-600 mb-2 italic">"Veja só! Azul me contou que capturou Pokémon incríveis nestas rotas!"</p>
                <p className="text-sm font-black text-pokeBlue mb-4 uppercase tracking-tighter leading-tight">
                  "Parece que Bulbasaur, Charmander e outros iniciais estão aparecendo raramente por aqui. Fique atento!"
                </p>
                <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 mb-4">
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Desbloqueio Especial  </p>
                   <p className="text-xs font-bold text-slate-800 uppercase mt-1 italic">Iniciais Raríssimos agora aparecem nas Rotas 1, 22 e Floresta!</p>
                </div>
                <button
                  onClick={() => {
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: [...(prev.worldFlags || []), "rival_1_defeated"]
                    }));
                    handleGoToCity();
                  }}
                  className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg"
                >Vou Procurá-los!</button>
              </div>
            </div>
          </div>
        );
      }
      case 'johto_intro': {
        const elmSprite = 'https://play.pokemonshowdown.com/sprites/trainers/elm.png';
        const johtoStarters = [152, 155, 158].map(id => POKEDEX[id]).filter(Boolean);
        return (
          <div className="h-full flex flex-col items-center animate-fadeIn relative overflow-hidden"
            style={{ backgroundImage: `url('${LAB_BG_URL}')`, backgroundSize: 'cover', backgroundPosition: 'center top' }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #059669bb 0%, #05966666 35%, rgba(2,6,23,0.80) 70%, rgba(2,6,23,0.97) 100%)' }} />

            <div className="flex-1 flex items-center justify-center relative z-10 px-6 pt-8">
              <img src={elmSprite} onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="h-64 object-contain drop-shadow-2xl animate-float" alt="Prof. Vidoeiro" />
            </div>

            <div className="relative z-10 w-full p-4 pb-6">
              <div className="bg-white rounded-[2rem] border-b-[10px] border-emerald-700 shadow-2xl p-5 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center overflow-hidden border-2 border-emerald-200">
                    <img src={elmSprite} onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-9 h-9 object-contain" alt="" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600">Prof. Vidoeiro</p>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-800 leading-none">Bem-vindo a Johto</h2>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-600 leading-relaxed mb-3 italic">
                  "Campeao de Kanto, sua equipe e lendaria. Mas Johto precisa conhecer voce desde o primeiro passo."
                </p>
                <p className="text-sm font-black text-slate-800 leading-relaxed mb-4 uppercase">
                  "Ao iniciar esta regiao, seus Pokemon atuais ficarao guardados no PC regional. Eles so poderao voltar ao time depois que voce vencer a Liga de Johto pela primeira vez."
                </p>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Regra regional</p>
                  <p className="text-xs font-bold text-amber-900 mt-1">O time de Kanto fica protegido no PC. A jornada de Johto comeca com um novo inicial.</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {johtoStarters.map(starter => (
                    <button
                      key={starter.id}
                      onClick={() => setStarterPreview({ pokemon: starter, accentColor: '#059669', onConfirm: () => { handleStartJohto(starter.id); setStarterPreview(null); } })}
                      className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-emerald-400 hover:bg-emerald-50 active:scale-95 transition-all"
                    >
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${starter.id}.png`} className="w-16 h-16 object-contain" alt={starter.name} />
                      <span className="text-[10px] font-black uppercase text-slate-800 leading-none">{starter.name}</span>
                      <span className="text-[8px] font-black uppercase text-slate-400">{starter.type}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentView('city')}
                  className="w-full min-h-[48px] rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                >
                  Voltar para Kanto
                </button>
              </div>
            </div>
          </div>
        );
      }
      case 'hoenn_intro': {
        const birchSprite = 'https://play.pokemonshowdown.com/sprites/trainers/birch.png';
        const hoennStarters = [252, 255, 258].map(id => POKEDEX[id]).filter(Boolean);
        return (
          <div className="h-full flex flex-col items-center animate-fadeIn relative overflow-hidden"
            style={{ backgroundImage: `url('${LAB_BG_URL}')`, backgroundSize: 'cover', backgroundPosition: 'center top' }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #ea580cbb 0%, #ea580c66 35%, rgba(2,6,23,0.80) 70%, rgba(2,6,23,0.97) 100%)' }} />

            <div className="flex-1 flex items-center justify-center relative z-10 px-6 pt-8">
              <img src={birchSprite} onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="h-64 object-contain drop-shadow-2xl animate-float" alt="Prof. Bétula" />
            </div>

            <div className="relative z-10 w-full p-4 pb-6">
              <div className="bg-white rounded-[2rem] border-b-[10px] border-orange-600 shadow-2xl p-5 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-orange-200">
                    <img src={birchSprite} onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-9 h-9 object-contain" alt="" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600">Prof. Bétula</p>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-800 leading-none">Bem-vindo a Hoenn</h2>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-600 leading-relaxed mb-3 italic">
                  "Campeao de Johto, Hoenn tem biomas selvagens, equipes vilas e uma Liga preparada para voce."
                </p>
                <p className="text-sm font-black text-slate-800 leading-relaxed mb-4 uppercase">
                  "Ao iniciar esta regiao, seu time atual ficara guardado no PC regional. Escolha Treecko, Torchic ou Mudkip para comecar do zero."
                </p>

                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-3 mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-700">Regra regional</p>
                  <p className="text-xs font-bold text-orange-900 mt-1">A jornada de Hoenn usa Pokemon da terceira geracao ate voce vencer a Liga local.</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {hoennStarters.map(starter => (
                    <button
                      key={starter.id}
                      onClick={() => setStarterPreview({ pokemon: starter, accentColor: '#ea580c', onConfirm: () => { handleStartHoenn(starter.id); setStarterPreview(null); } })}
                      className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-orange-400 hover:bg-orange-50 active:scale-95 transition-all"
                    >
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${starter.id}.png`} className="w-16 h-16 object-contain" alt={starter.name} />
                      <span className="text-[10px] font-black uppercase text-slate-800 leading-none">{starter.name}</span>
                      <span className="text-[8px] font-black uppercase text-slate-400">{starter.type}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentView('city')}
                  className="w-full min-h-[48px] rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                >
                  Voltar para Johto
                </button>
              </div>
            </div>
          </div>
        );
      }
      case 'sinnoh_intro': {
        const sprite = 'https://play.pokemonshowdown.com/sprites/trainers/rowan.png';
        const starters = [387, 390, 393].map(id => POKEDEX[id]).filter(Boolean);
        return <RegionIntroScreen
          professorSprite={sprite} professorName="Prof. Sorbus"
          regionName="Sinnoh" accentColor="#0ea5e9" bgColor="bg-sky-950"
          starters={starters} onSelectStarter={handleStartSinnoh}
          onBack={() => setCurrentView('city')}
          ruleText="A jornada de Sinnoh começa isolada, com progressão própria de capturas e treino."
          inviteText="Campeão de Hoenn, sua jornada chamou minha atenção. Sinnoh tem espécies e desafios que exigem um novo começo."
        />;
      }
      case 'unova_intro': {
        const sprite = 'https://play.pokemonshowdown.com/sprites/trainers/juniper.png';
        const starters = [495, 498, 501].map(id => POKEDEX[id]).filter(Boolean);
        return <RegionIntroScreen
          professorSprite={sprite} professorName="Prof. Juniper"
          regionName="Unova" accentColor="#22c55e" bgColor="bg-green-950"
          starters={starters} onSelectStarter={handleStartUnova}
          onBack={() => setCurrentView('city')}
          ruleText="Ao iniciar Unova, seu time atual fica no PC regional. Escolha Snivy, Tepig ou Oshawott."
          inviteText="Juniper aqui! Unova aguarda um novo herói. Venha descobrir os Pokémon desta região!"
        />;
      }
      case 'kalos_intro': {
        const sprite = 'https://play.pokemonshowdown.com/sprites/trainers/sycamore.png';
        const starters = [650, 653, 656].map(id => POKEDEX[id]).filter(Boolean);
        return <RegionIntroScreen
          professorSprite={sprite} professorName="Prof. Plátano"
          regionName="Kalos" accentColor="#3b82f6" bgColor="bg-blue-950"
          starters={starters} onSelectStarter={handleStartKalos}
          onBack={() => setCurrentView('city')}
          ruleText="A jornada de Kalos começa do zero. Escolha Chespin, Fennekin ou Froakie."
          inviteText="Bonjour! Sou o Prof. Sycamore. Kalos é uma região de beleza e mistério — venha explorar!"
        />;
      }
      case 'alola_intro': {
        const sprite = 'https://play.pokemonshowdown.com/sprites/trainers/kukui.png';
        const starters = [722, 725, 728].map(id => POKEDEX[id]).filter(Boolean);
        return <RegionIntroScreen
          professorSprite={sprite} professorName="Prof. Kukui"
          regionName="Alola" accentColor="#f97316" bgColor="bg-orange-950"
          starters={starters} onSelectStarter={handleStartAlola}
          onBack={() => setCurrentView('city')}
          ruleText="Em Alola não há ginásios — há os Trials! Escolha Rowlet, Litten ou Popplio."
          inviteText="Yeah! Sou o Prof. Kukui. Alola é diferente de tudo que você já viu — sejam bem-vindos!"
        />;
      }
      case 'galar_intro': {
        const sprite = 'https://play.pokemonshowdown.com/sprites/trainers/magnolia.png';
        const starters = [810, 813, 816].map(id => POKEDEX[id]).filter(Boolean);
        return <RegionIntroScreen
          professorSprite={sprite} professorName="Profa. Magnólia"
          regionName="Galar" accentColor="#a855f7" bgColor="bg-purple-950"
          starters={starters} onSelectStarter={handleStartGalar}
          onBack={() => setCurrentView('city')}
          ruleText="Galar tem o Wild Area e a Liga mais famosa do mundo. Escolha Grookey, Scorbunny ou Sobble."
          inviteText="Bem-vinda a Galar! Sou a Profa. Magnólia. Esta região vai testar tudo o que você aprendeu!"
        />;
      }
      case 'paldea_intro': {
        const sprite = 'https://play.pokemonshowdown.com/sprites/trainers/sada.png';
        const starters = [906, 909, 912].map(id => POKEDEX[id]).filter(Boolean);
        return <RegionIntroScreen
          professorSprite={sprite} professorName="Profa. Sada"
          regionName="Paldea" accentColor="#ef4444" bgColor="bg-red-950"
          starters={starters} onSelectStarter={handleStartPaldea}
          onBack={() => setCurrentView('city')}
          ruleText="Paldea é a região final da Liga. Escolha Sprigatito, Fuecoco ou Quaxly para a jornada."
          inviteText="Sou a Profa. Sada. Paldea guarda mistérios que vão além do tempo — venha descobrir!"
        />;
      }
      case 'hisui_intro': {
        const sprite = 'https://play.pokemonshowdown.com/sprites/trainers/laventon.png';
        const starters = [722, 155, 501].map(id => POKEDEX[id]).filter(Boolean);
        return <RegionIntroScreen
          professorSprite={sprite} professorName="Prof. Laventon"
          regionName="Hisui" accentColor="#d97706" bgColor="bg-amber-950"
          starters={starters} onSelectStarter={handleStartHisui}
          onBack={() => setCurrentView('city')}
          ruleText="Hisui é a versão ancestral de Sinnoh. Escolha Rowlet, Cyndaquil ou Oshawott para explorar essa terra selvagem."
          inviteText="Sou o Prof. Laventon da Equipe Galaxy. Hisui guarda Pokémon nunca antes catalogados — precisamos de você!"
        />;
      }
      case 'navigation_hub': return (
        <div className="h-full flex flex-col items-center justify-start pt-16 bg-gradient-to-b from-blue-50 to-white p-6 relative overflow-y-auto custom-scrollbar">
           <div className="absolute top-0 left-0 w-full h-1 bg-pokeBlue"></div>
           <div className="max-w-2xl w-full animate-fadeInUp text-center">
              <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-2">Para onde vamos agora?</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-10">Escolha seu destino inicial</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <button 
                   onClick={() => {
                     setGameState(prev => ({ ...prev, currentRoute: 'pallet_town' }));
                     setCurrentView('city');
                   }}
                   className="group bg-white p-8 rounded-[3rem] border-4 border-slate-200 hover:border-red-400 transition-all shadow-xl hover:shadow-red-100 flex flex-col items-center gap-4 active:scale-95"
                 >
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🚀</div>
                    <div>
                       <h3 className="font-black text-xl text-slate-800 uppercase italic">Cidade de Pallet</h3>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Descansar e Preparar</p>
                    </div>
                 </button>

                 <button 
                   onClick={() => {
                     setGameState(prev => ({ ...prev, currentRoute: 'route_1' }));
                     setCurrentEnemy(null);
                     setCurrentView('battles');
                   }}
                   className="group bg-white p-8 rounded-[3rem] border-4 border-slate-200 hover:border-green-400 transition-all shadow-xl hover:shadow-green-100 flex flex-col items-center gap-4 active:scale-95"
                 >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🌿</div>
                    <div>
                       <h3 className="font-black text-xl text-slate-800 uppercase italic">Rota 1</h3>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Iniciar Capturas</p>
                    </div>
                 </button>
              </div>
              
              <div className="mt-12 flex justify-center">
                 <div className="bg-slate-100 px-6 py-3 rounded-full flex items-center gap-3">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-6 h-6" alt="Pokeball" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Você recebeu 10 Pokébolas!</span>
                 </div>
              </div>
           </div>
        </div>
      );
      case 'city': return (
        <>
          <CityScreen 
            {...props}
            gameState={gameState} 
            powerScore={powerScore}
            ROUTES={processedRoutes} 
            fixPath={fixPath} 
            setActiveBuildingModal={setActiveBuildingModal} 
            setActiveQuestModal={setActiveQuestModal} 
            activeQuestModal={activeQuestModal}
            setGameState={setGameState}
            setCurrentView={setCurrentView}
            setCurrentEnemy={setCurrentEnemy}
            onChallengeRival={startBattleAgainstRival}
            onSelectTitle={(id) => handleSelectTitleInApp(id, setGameState)}
            onBackToBattle={() => {
              if (gameState.lastFarmingRoute) {
                setGameState(prev => ({ ...prev, currentRoute: prev.lastFarmingRoute }));
                setCurrentEnemy(null);
                setCurrentView('battles');
              } else {
                setCurrentView('routes');
              }
            }}
            onOpenExpeditions={() => setShowExpeditions(true)}
            onOpenHouse={() => setShowHouse(true)}
            onBuyHouse={handleBuyHouse}
            isAnyModalOpen={isAnyModalOpen}
            setIsAnyModalOpen={setIsAnyModalOpen}
            isTitleModalOpen={isTitleModalOpen}
            setIsTitleModalOpen={setIsTitleModalOpen}
            isPowerRankModalOpen={isPowerRankModalOpen}
            setIsPowerRankModalOpen={setIsPowerRankModalOpen}
            onOpenRegionBuilder={() => setShowRegionBuilder(true)}
            onOpenUnovaChampionModal={() => setShowUnovaChampionModal(true)}
          />

          {/* Modal do Prof. Carvalho sobre a Casa */}
          {showOakHouseModal && (
            <div 
              className="absolute inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn cursor-default"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowOakHouseModal(false); }}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div 
                className="w-full max-w-[440px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col animate-bounceIn"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                
                {/* Header Superior - Padrão Premium */}
                <div className="bg-emerald-600 px-6 py-5 flex items-center justify-between shadow-xl shrink-0 z-20 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                      <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-10 h-10 object-contain drop-shadow-md" alt="Oak" />
                    </div>
                    <div className="text-left">
                      <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Oferta Especial</p>
                      <h3 className="text-white text-xl font-black uppercase italic leading-none tracking-tighter">Oportunidade Única</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowOakHouseModal(false)}
                    className="w-9 h-9 rounded-full bg-white/10 text-white font-black flex items-center justify-center hover:bg-white/20 transition-colors"
                  >x</button>
                </div>

                <div className="overflow-y-auto custom-scrollbar p-8 flex flex-col gap-6">
                  {/* Avatar & Citação */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-white shadow-xl mb-4 overflow-hidden flex items-center justify-center">
                      <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-20 h-20 object-contain mt-2" alt="Oak" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-tight">
                      "Sua jornada merece uma base!"
                    </h2>
                  </div>

                  {/* Mensagem Principal */}
                  <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-100 italic text-slate-600 font-bold text-sm leading-relaxed text-center relative">
                    <div className="absolute -top-3 -left-2 text-4xl text-slate-200 opacity-50">"</div>
                    <p>
                      Parabéns por vencer o Ginásio de Pewter! Você está crescendo como treinador.
                      Que tal ter sua própria casa? Lá você pode cultivar Berries e Apricorns para
                      fabricar Pokébolas especiais e itens raros. Com Pokémon de Grama e Água como
                      cuidadores, suas plantações crescerão muito mais rápido!
                    </p>
                  </div>

                  {/* Info Box - Custo */}
                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <span>🏡</span> Detalhes da Propriedade
                      </h4>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Pewter City</span>
                    </div>
                    
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Preço de Venda</p>
                        <p className="text-2xl font-black text-slate-800 italic leading-none">
                           💰 {HOUSE_PURCHASE_COST.toLocaleString()} coins
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Benefício</p>
                        <p className="text-xs font-black text-emerald-600 uppercase">4 Canteiros Iniciais</p>
                      </div>
                    </div>

                    <div className={`p-3 rounded-2xl font-black text-[10px] uppercase text-center transition-colors border shadow-sm ${
                      (gameState.currency || 0) >= HOUSE_PURCHASE_COST 
                      ? "bg-white text-green-600 border-green-100" 
                      : "bg-red-50 text-red-500 border-red-100"
                    }`}>
                      {(gameState.currency || 0) >= HOUSE_PURCHASE_COST
                        ? "✓ Saldo disponível para compra!"
                        : `✗ Faltam ${(HOUSE_PURCHASE_COST - (gameState.currency || 0)).toLocaleString()} coins para comprar`}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowOakHouseModal(false)}
                      className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-xs hover:bg-slate-200 transition-all active:scale-95 border-b-4 border-slate-200"
                    >
                      Agora não
                    </button>
                    <button
                      onClick={handleBuyHouse}
                      disabled={(gameState.currency || 0) < HOUSE_PURCHASE_COST}
                      className={`flex-[2] py-4 rounded-2xl font-black uppercase text-xs shadow-lg transition-all active:scale-95 border-b-4 ${
                        (gameState.currency || 0) >= HOUSE_PURCHASE_COST
                          ? "bg-amber-500 text-white hover:bg-amber-400 border-amber-700"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300 shadow-none"
                      }`}
                    >
                      🏡 Adquirir Minha Casa!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showHouse && (
            <Suspense fallback={null}>
              <HouseScreen
                gameState={gameState}
                onClose={() => setShowHouse(false)}
                onPlant={handlePlant}
                onHarvest={handleHarvest}
                onBuySlot={handleBuySlot}
                onAssignCaretaker={handleAssignCaretaker}
                onRemoveCaretaker={handleRemoveCaretaker}
                onBuySeed={handleBuySeed}
              />
            </Suspense>
          )}

          {showExpeditions && (
            <Suspense fallback={null}>
              <ExpeditionsScreen
                gameState={gameState}
                expeditionReport={expeditionReport}
                onCloseReport={() => setExpeditionReport(null)}
                onClose={() => setShowExpeditions(false)}
                onStartExpedition={(biomeId, team, autoRepeat, durationMultiplier) => {
                  handleStartExpedition(biomeId, team, autoRepeat, durationMultiplier);
                }}
                onClaimExpedition={(biomeId) => handleClaimExpedition(biomeId)}
              />
            </Suspense>
          )}

          {showOakStaminaModal && (
            <div className="absolute inset-0 z-[120] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
              <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col animate-bounceIn overflow-hidden" 
                style={{ maxHeight: '90vh' }}>
                
                {/* Header Novo */}
                <div className="bg-emerald-600 px-8 py-6 flex items-center gap-4 shrink-0 border-b-4 border-emerald-700/30">
                  <div className="bg-white/20 p-2.5 rounded-2xl shrink-0 backdrop-blur-md border border-white/20 shadow-inner">
                    <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-12 h-12 object-contain" alt="Prof. Carvalho" />
                  </div>
                  <div>
                    <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-90">Informativo do Professor</p>
                    <h3 className="text-white font-black text-lg italic leading-tight uppercase tracking-tight">Guia de Sobrevivência</h3>
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 px-8 pt-8 pb-6 custom-scrollbar">

                  <p className="text-slate-800 font-black text-2xl italic leading-tight mb-6 tracking-tighter">
                    "Antes de partir — muito importante!"
                  </p>

                  <p className="text-slate-500 text-base font-semibold leading-relaxed mb-10 px-1">
                    Seus Pokémon precisam se <strong className="text-emerald-600 font-black">alimentar</strong> durante as batalhas. Quanto mais lutam, mais energia gastam!
                  </p>

                  <div className="bg-slate-50 rounded-[2.5rem] p-7 border-2 border-slate-100 mb-8 shadow-inner">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-5 border-b border-slate-200/60 pb-3">O que eles comem:</p>
                    <div className="flex flex-col gap-6">
                      {[
                        { img: 'oran-berry', text: '<strong>Berries</strong> — cultive na sua casa. Oran e Sitrus Berry são essenciais' },
                        { img: 'fresh-water', text: '<strong>Água, Soda, Limonada</strong> — compre no Poké Mart' },
                        { img: 'moomoo-milk', text: '<strong>Leite MooMoo</strong> — nutritivo, pós 4º ginásio' },
                        { img: 'poke-toy', text: '<strong>Ração Pokémon</strong> — fabrique na Forja com materiais' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0 group-hover:scale-110 transition-transform">
                            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.img}.png`} className="w-8 h-8 object-contain" alt="" />
                          </div>
                          <p className="text-slate-600 text-[14px] leading-snug px-1" dangerouslySetInnerHTML={{ __html: item.text }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-[1.5rem] px-6 py-5 border-2 border-red-100 mb-8 flex gap-4 items-start shadow-sm">
                    <div className="bg-red-100 p-2 rounded-xl text-xl shrink-0">⚠️</div>
                    <div>
                      <p className="text-red-700 text-[10px] font-black mb-1.5 uppercase tracking-widest">Atenção Crítica</p>
                      <p className="text-red-600 text-[13px] font-bold leading-relaxed">Sem energia, seu Pokémon fica exausto e perde HP rapidamente a cada turno!</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-[1.5rem] px-6 py-5 border-2 border-amber-100 mb-4 shadow-sm">
                    <p className="text-amber-800 text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Presente do Professor:</p>
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border-2 border-amber-200 shrink-0">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-12 h-12 object-contain" alt="" />
                      </div>
                      <div>
                        <p className="text-amber-700 font-black text-2xl uppercase tracking-tighter leading-none mb-1.5">10x Água Fresca</p>
                        <p className="text-amber-600 text-[10px] uppercase font-bold tracking-widest">Para começar bem sua jornada!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t-2 border-slate-100 shrink-0">
                  <button
                    onClick={() => { setShowOakStaminaModal(false); setGameState(prev => ({ ...prev, oakTutorialShown: true })); }}
                    style={{
                      width: '100%', padding: '20px', borderRadius: '24px',
                      background: '#059669', color: 'white', fontWeight: 900,
                      fontSize: '18px', textTransform: 'uppercase', letterSpacing: '2px',
                      border: 'none', cursor: 'pointer', minHeight: '72px',
                      boxShadow: '0 8px 24px rgba(5,150,105,0.3)',
                    }}
                    className="hover:bg-emerald-500 hover:shadow-emerald-200 active:scale-95 transition-all"
                  >
                    ENTENDI, PROFESSOR!
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      );

      case 'vs': return (
        <Suspense fallback={<div className="h-full flex items-center justify-center bg-slate-900 text-white font-black uppercase tracking-[0.3em] animate-pulse">Carregando Desafios...</div>}>
          <VsScreen
            gameState={gameState}
            powerScore={powerScore}
            onChallengeGym={(gymData) => {
              handleChallengeGym(gymData);
            }}
            onChallenge={(challenge) => {
              startKeyBattle(challenge);
            }}
            onClose={() => setCurrentView('city')}
            setCurrentView={setCurrentView}
            initialTab={vsInitialTab}
            setVsInitialTab={setVsInitialTab}
            initialCategory={vsInitialCategory}
            setVsInitialCategory={setVsInitialCategory}
            initialRegion={vsInitialRegion}
            setVsInitialRegion={setVsInitialRegion}
          />
        </Suspense>
      );

      case 'prof_oak_starters_announcement': return (
        <div className="absolute inset-0 z-[9999] flex flex-col bg-[#0F2D3A] overflow-hidden animate-fadeIn">
          {/* Header Superior - Padrão Premium */}
          <div className="bg-emerald-600 px-6 py-5 flex items-center justify-between shadow-xl shrink-0 z-20 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-10 h-10 object-contain drop-shadow-md" alt="Oak" />
              </div>
              <div className="text-left">
                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Guia de Jornada</p>
                <h3 className="text-white text-xl font-black uppercase italic leading-none tracking-tighter">Mensagem do Prof. Carvalho</h3>
              </div>
            </div>
          </div>

          {/* Área de Conteúdo */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-y-auto">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            <div className="relative z-10 max-w-sm">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
                <div className="w-32 h-32 mx-auto rounded-full bg-white/5 border-2 border-emerald-500/30 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                  <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-24 h-24 object-contain drop-shadow-2xl" alt="Oak" />
                </div>
              </div>

              <h2 className="text-white font-black text-2xl uppercase italic tracking-tighter leading-tight mb-6">
                "Notícias Fantásticas!"
              </h2>

              <div className="space-y-4 text-white/90 text-sm font-bold leading-relaxed italic">
                <p>
                  "Incrível! Meus parabéns por derrotar o Azul na Rota 1! Acabo de receber relatos fantásticos da Pokédex..."
                </p>
                <p className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
                  "Os Pokémon iniciais <span className="text-emerald-400">Bulbasaur</span>, <span className="text-orange-400">Charmander</span>, <span className="text-blue-400">Squirtle</span>, <span className="text-yellow-400">Pikachu</span> e <span className="text-amber-200">Eevee</span> foram avistados selvagens na Rota 1 e na Floresta!"
                </p>
                <p>
                  "Parece que eles decidiram se aventurar além do laboratório. Agora você pode encontrá-los e capturá-los! Boa sorte!"
                </p>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4 opacity-40 grayscale animate-pulse">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" className="w-12 h-12 object-contain" alt="1" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" className="w-12 h-12 object-contain" alt="4" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" className="w-12 h-12 object-contain" alt="7" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" className="w-12 h-12 object-contain" alt="25" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" className="w-12 h-12 object-contain" alt="133" />
              </div>
            </div>
          </div>

          {/* Rodapé Fixo */}
          <div className="p-8 pt-4 bg-black/20 shrink-0 border-t border-white/5">
            <button 
              onClick={() => {
                setGameState(prev => ({ 
                  ...prev, 
                  worldFlags: [...(prev.worldFlags || []), 'starters_spotted'] 
                }));
                setCurrentView('city');
              }}
              className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black uppercase text-base tracking-widest hover:bg-slate-100 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] active:scale-95"
            >
              ENTENDIDO!
            </button>
          </div>
        </div>
      );

      case 'prof_juniper_announcement': return (
        <div className="absolute inset-0 z-[9999] flex flex-col bg-[#0F2D3A] overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-green-700 px-6 py-5 flex items-center justify-between shadow-xl shrink-0 z-20 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <img src="https://play.pokemonshowdown.com/sprites/trainers/juniper.png" className="w-10 h-10 object-contain drop-shadow-md" alt="Juniper" onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} />
              </div>
              <div className="text-left">
                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Mensagem da Professora</p>
                <h3 className="text-white text-xl font-black uppercase italic leading-none tracking-tighter">Profa. Juniper — Unova</h3>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-y-auto">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="relative z-10 max-w-sm">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
                <div className="w-32 h-32 mx-auto rounded-full bg-white/5 border-2 border-green-500/40 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(34,197,94,0.15)]">
                  <img src="https://play.pokemonshowdown.com/sprites/trainers/juniper.png" className="w-24 h-24 object-contain drop-shadow-2xl" alt="Juniper" onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} />
                </div>
              </div>

              <h2 className="text-white font-black text-2xl uppercase italic tracking-tighter leading-tight mb-6">
                "Que batalha incrível!"
              </h2>

              <div className="space-y-4 text-white/90 text-sm font-bold leading-relaxed italic">
                <p>
                  "Parabéns por derrotar o Cheren na Nuvema Town! Você mostrou que está pronto para explorar Unova..."
                </p>
                <p className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
                  "Os Pokémon iniciais <span className="text-green-400">Snivy</span> e <span className="text-red-400">Tepig</span> foram avistados na Rota 1 de Unova, e o <span className="text-blue-400">Oshawott</span> está aparecendo na Rota 2!"
                </p>
                <p>
                  "Eles estão prontos para acompanhar a sua jornada. Capture-os e forme o time perfeito de Unova!"
                </p>
              </div>

              <div className="mt-10 flex justify-center gap-6 opacity-60 animate-pulse">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/495.png" className="w-14 h-14 object-contain" alt="Snivy" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/498.png" className="w-14 h-14 object-contain" alt="Tepig" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/501.png" className="w-14 h-14 object-contain" alt="Oshawott" />
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="p-8 pt-4 bg-black/20 shrink-0 border-t border-white/5">
            <button
              onClick={() => {
                setGameState(prev => ({
                  ...prev,
                  worldFlags: [...new Set([...(prev.worldFlags || []), 'unova_starters_spotted'])],
                }));
                setCurrentView('city');
              }}
              className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black uppercase text-base tracking-widest hover:bg-slate-100 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] active:scale-95"
            >
              ENTENDIDO — CAPTURAR OS INICIAIS!
            </button>
          </div>
        </div>
      );

      case 'safari': return (
        <div className="pt-14 pb-20 h-full overflow-hidden flex flex-col">
          <Suspense fallback={<div className="h-full flex items-center justify-center text-white font-black">Carregando...</div>}>
            <SafariZoneScreen
              gameState={gameState}
              setGameState={setGameState}
              safariSession={safariSession}
              setSafariSession={setSafariSession}
              addLog={addLog}
              POKEDEX={POKEDEX}
              onExit={() => {
                setSafariSession(null);
                setCurrentView('routes');
              }}
            />
          </Suspense>
        </div>
      );

      case 'battles': return (
        <div className="pt-14 pb-20 h-full overflow-y-auto">
          <BattleScreen 
            timeOfDay={timeOfDay}
            currentEnemy={currentEnemy} 
            gameState={gameState} 
            activeMemberIndex={activeMemberIndex} 
            moveIndex={moveIndex} 
            weather={weather} 
            setActiveMemberIndex={setActiveMemberIndex} 
            addLog={addLog} 
            battleLog={battleLog} 
            floatingTexts={floatingTexts} 
            onUseItem={handleUseItem} 
            setGameState={setGameState} 
            setShowAutoCaptureModal={setShowAutoCaptureModal}
            showAutoConfigExternal={showBattleAutoPanel}
            setShowAutoConfigExternal={setShowBattleAutoPanel}
            ROUTES={processedRoutes}
            fixPath={fixPath}
            TYPE_COLORS={TYPE_COLORS}
            onGoToCity={handleGoToCity}
                bossTimer={bossTimer}
                currentLevelCap={getRegionLevelCap(gameState.badges, gameState.activeRegion || 'kanto')}
                onChallengeBoss={(battle) => {
                  if (battle.type === 'rival') {
                    startBattleAgainstRival(battle);
                  } else if (battle.type === 'gym_leader' || battle.type === 'elite' || battle.type === 'boss' || battle.type === 'rocket' || battle.type === 'legendary') {
                    startKeyBattle(battle);
                  }
                }}
          />
        </div>
      );
      case 'routes': return (
        <TravelScreen 
          gameState={gameState} 
          setGameState={setGameState} 
          travelTab={travelTab} 
          setTravelTab={setTravelTab} 
          ROUTES={processedRoutes} 
          setCurrentEnemy={setCurrentEnemy} 
          setCurrentView={setCurrentView}
          setVsInitialTab={setVsInitialTab}
          setVsInitialCategory={setVsInitialCategory}
          setVsInitialRegion={setVsInitialRegion}
          switchRegion={switchRegion}
          fixPath={fixPath}
          POKEDEX={POKEDEX}
        />
      );

      case 'pokemon_management': return (
        <PokemonManagement
          {...props}
          gameState={gameState}
          setGameState={setGameState}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activePokemonDetails={activePokemonDetails}
          setActivePokemonDetails={setActivePokemonDetails}
          POKEDEX={POKEDEX}
          MOVES={MOVES}
          NATURES={NATURES}
          NATURE_LIST={NATURE_LIST}
          getMasteryPath={getMasteryPath}
          addLog={addLog}
          setEvolutionPending={setEvolutionPending}
          setMegaEvolutionPending={setMegaEvolutionPending}
          handleUseCandy={handleUseCandy}
          setCurrentView={setCurrentView}
          setVsInitialTab={setVsInitialTab}
          validateTeamAccess={validateTeamAccess}
          activeRegion={gameState.activeRegion}
          isEvolutionAllowedForRegion={isEvolutionAllowedForRegion}
          getEvolutionRegionLockMessage={getEvolutionRegionLockMessage}
          CRAFTING_RECIPES={CRAFTING_RECIPES}
          currentEnemy={currentEnemy}
        />
      );

      case 'forge_screen': return (
        <div className="h-full bg-[#0a0f1e] flex flex-col items-center p-6 animate-fadeIn relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png" className="absolute top-10 right-10 w-64 h-64 -rotate-12 invert opacity-20" alt="" />
           </div>

           <div className="relative z-10 w-full max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <button onClick={() => setCurrentView('city')} className="bg-slate-800/50 backdrop-blur border border-white/10 p-4 rounded-3xl shadow-xl hover:bg-slate-700 transition-all">
                     <span className="text-xl text-white">←</span>
                 </button>
                 <div>
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none shadow-sm">Forja Pokémon</h2>
                    <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] mt-2">Mestria em Metalurgia e Essências</p>
                 </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl mb-6">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Inventário de Forja</h4>
                    <span className="text-[10px] font-black text-amber-400 uppercase bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.1)]">💰 {gameState.currency.toLocaleString()} P$</span>
                 </div>
                 <div className="flex flex-wrap justify-center gap-3">
                    {Object.entries(gameState.inventory.materials)
                      .filter(([_, qty]) => qty > 0)
                      .map(([id, qty]) => (
                        <div key={id} className="bg-slate-800/80 px-4 py-2 rounded-2xl shadow-sm border border-white/5 flex items-center gap-2 hover:border-white/20 transition-all">
                           <span className="text-xs font-black text-white">{qty}x</span>
                           <span className="text-[9px] font-black text-white/50 uppercase">{ITEM_LABELS[id]?.name || id.replace('_essence', '').replace(/_/g, ' ')}</span>
                        </div>
                      ))}
                 </div>
              </div>

              {!(gameState.worldFlags || []).includes('mega_evolution_unlocked') && (
                <div className="mb-3 rounded-2xl bg-blue-50 border border-blue-200 px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">💎</span>
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest leading-tight">
                    Mega Pedras desbloqueadas após o 1º Ginásio de Kalos.<br/>
                    <span className="font-normal normal-case text-blue-500">Derrote Viola para desbloquear Mega Evolução!</span>
                  </p>
                </div>
              )}
              <Suspense fallback={<div className="p-10 text-center font-black text-slate-400">Carregando Forja...</div>}>
                <CraftingStation
                  recipes={
                    (gameState.worldFlags || []).includes('mega_evolution_unlocked')
                      ? CRAFTING_RECIPES
                      : Object.fromEntries(Object.entries(CRAFTING_RECIPES).filter(([cat]) => cat !== 'mega_stones'))
                  }
                  inventory={gameState.inventory}
                  currency={gameState.currency}
                  onCraft={handleCraft}
                  hasRecipe={(id) => hasForgeRecipe(gameState, id)}
                  recipeGuides={FORGE_RECIPE_DROP_GUIDE}
                  initialItem={forgeTargetItem}
                />
              </Suspense>

              <button 
                onClick={() => {
                  setForgeTargetItem(null);
                  setCurrentView('city');
                }}
                className="w-full mt-6 bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg border-b-8 border-slate-900"
              >Voltar para a Cidade</button>
           </div>
        </div>
      );
      case 'menu': return (
        <MenuScreen
          {...props}
          gameState={gameState}
          setCurrentView={setCurrentView}
          setGameState={setGameState}
          user={user}
          onSave={triggerSave}
          MUSIC_LIST={MUSIC_LIST}
          onBack={() => setCurrentView(lastNonMenuView.current)}
          onUseExpCandy={handleUseExpCandy}
          onOpenFriends={() => setActiveBuildingModal('friends')}
          pendingFriendRequestsCount={pendingFriendRequests.length}
        />
      );

      case 'battle_result': {
        const isVictory = battleResult?.outcome === 'victory';
        return (
          <div className={`absolute inset-0 z-[9999] flex items-center justify-center p-5 text-center animate-fadeIn ${isVictory ? 'bg-emerald-950/95' : 'bg-red-950/95'}`}>
            <div className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl border-b-[10px] border-slate-900 animate-bounceIn">
              <div className={`${isVictory ? 'bg-emerald-600' : 'bg-red-600'} px-6 py-5 text-left text-white`}>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">
                  {battleResult?.category === 'rocket' ? 'Equipe Vila' : 'Rival'}
                </p>
                <h2 className="text-2xl font-black uppercase italic leading-tight">{battleResult?.title}</h2>
              </div>
              <div className="p-6">
                <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl ${isVictory ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <img
                    src={isVictory ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/star-piece.png' : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png'}
                    className="h-14 w-14 object-contain"
                    alt=""
                  />
                </div>
                <h3 className="mb-2 text-xl font-black uppercase italic text-slate-800">{battleResult?.enemyName}</h3>
                <p className="mb-6 text-sm font-bold leading-relaxed text-slate-500">{battleResult?.message}</p>
                <button
                  onClick={() => {
                    if (isVictory) {
                      setGameState(prev => ({ ...prev, currentRoute: battleResult?.nextRoute || prev.currentRoute || 'route_1' }));
                      setBattleResult(null);
                      setCurrentEnemy(null);
                      setCurrentView('battles');
                    } else {
                      setBattleResult(null);
                      setCurrentView('heal_after_defeat');
                    }
                  }}
                  className={`min-h-[56px] w-full rounded-2xl ${isVictory ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'} px-4 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95`}
                >
                  {battleResult?.nextLabel}
                </button>
                {isVictory && (
                  <button
                    onClick={() => {
                      setBattleResult(null);
                      setCurrentEnemy(null);
                      setCurrentView('city');
                    }}
                    className="mt-3 min-h-[48px] w-full rounded-2xl bg-slate-100 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-200"
                  >
                    Ficar na cidade
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }
      case 'defeat_screen': {
        const GHOST_POOL = [
          { name: 'gastly',    size: 'w-20 h-20' },
          { name: 'haunter',   size: 'w-24 h-24' },
          { name: 'gengar',    size: 'w-22 h-22' },
          { name: 'misdreavus',size: 'w-20 h-20' },
          { name: 'shuppet',   size: 'w-18 h-18' },
          { name: 'banette',   size: 'w-22 h-22' },
          { name: 'duskull',   size: 'w-20 h-20' },
          { name: 'sableye',   size: 'w-20 h-20' },
          { name: 'litwick',   size: 'w-18 h-18' },
          { name: 'chandelure', size: 'w-24 h-24' },
        ];
        const ghostCount = Math.min(dailyDefeats + 1, GHOST_POOL.length);
        const visibleGhosts = GHOST_POOL.slice(0, Math.max(2, ghostCount));
        return (
          <div className="h-full flex flex-col items-center justify-center bg-slate-900 p-8 relative overflow-hidden animate-fadeIn">
             <div className="absolute inset-0 opacity-30 pointer-events-none bg-gradient-to-t from-purple-900 to-transparent"></div>
             {dailyDefeats > 1 && (
               <div className="absolute top-4 right-4 bg-purple-900/60 border border-purple-500/40 rounded-full px-3 py-1 text-purple-300 text-[10px] font-black uppercase tracking-widest">
                 {dailyDefeats}ª derrota hoje
               </div>
             )}
             <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
                <div className="flex flex-wrap justify-center gap-4 mb-10 animate-float">
                  {visibleGhosts.map((g, i) => (
                    <img
                      key={g.name}
                      src={`https://play.pokemonshowdown.com/sprites/ani/${g.name}.gif`}
                      className={`${g.size} drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] object-contain`}
                      style={{ animationDelay: `${i * 80}ms` }}
                      alt={g.name}
                    />
                  ))}
                </div>
                <div className="bg-slate-800/80 backdrop-blur-md p-10 rounded-[3rem] border-2 border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                  <h2 className="text-4xl font-black text-purple-400 uppercase italic mb-6 tracking-tighter">Hehehe...</h2>
                  <p className="text-white font-bold text-lg mb-10 italic leading-tight">
                    "Vimos você cair... Não se preocupe, treinador. Nós o levamos para um lugar seguro."
                  </p>
                  <button
                    onClick={() => { setTimeout(() => setCurrentView('heal_after_defeat'), 800); }}
                    className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-purple-500 transition-all active:scale-95 border-b-8 border-purple-800"
                  >OK...</button>
                </div>
             </div>
          </div>
        );
      }
      case 'pokedex': return (
        <Suspense fallback={<div className="h-full bg-slate-900 flex items-center justify-center text-pokeGold font-black uppercase tracking-[0.5em] animate-pulse">Sincronizando Pokédex...</div>}>
          <PokedexScreen
            POKEDEX={Object.fromEntries(Object.entries(POKEDEX).filter(([id]) => Number(id) <= getUnlockedDexLimit(gameState)))}
            caughtData={gameState.caughtData}
            team={gameState.team}
            box={gameState.pc}
            dexLimit={getUnlockedDexLimit(gameState)}
            routes={processedRoutes}
            gameState={gameState}
            onGoToRoute={(routeId) => {
              setGameState(prev => ({
                ...prev,
                currentRoute: routeId,
                lastFarmingRoute: processedRoutes[routeId]?.type === 'farm' ? routeId : prev.lastFarmingRoute,
              }));
              setCurrentView('battles');
            }}
            onBack={() => setCurrentView(lastNonMenuView.current)}
          />
        </Suspense>
      );
      case 'heal_after_defeat': return (
        <div className="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-100 p-6 text-center animate-fadeIn overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src={fixPath('/bg_pokecenter_1776868686753.webp')} className="w-full h-full object-cover" alt="Pokecenter" />
             <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
            <div className="mb-4 transform hover:scale-110 transition-transform duration-500">
              <img src="https://play.pokemonshowdown.com/sprites/ani/chansey.gif" className="h-32 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" alt="Chansey" />
            </div>

            <div className="bg-white/90 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-b-[12px] border-red-500/10 w-full animate-bounceIn">
               <h3 className="text-2xl font-black text-slate-800 italic uppercase mb-2 tracking-tighter">Enfermeira Chansey:</h3>
               <p className="text-lg font-bold text-slate-600 mb-8 italic leading-tight">
                 "Oh céus! Você e seus POKÉMONS parecem exaustos. Deixe-me cuidar de tudo rapidamente!"
               </p>
               
               <button 
                 onClick={() => { 
                   if (isHealing) return;
                   stopSFX();
                   sfxHeal();
                   setIsHealing(true);
                   setGameState(prev => ({ 
                     ...prev, 
                     team: prev.team.map(p => ({ 
                       ...p, 
                       hp: p.maxHp, 
                       status: [],
                       stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 } 
                     })) 
                   })); 
                   
                   setTimeout(() => {
                     setIsHealing(false);
                     goToCity(true); 
                   }, 2000);
                 }}
                 className={`w-full ${isHealing ? 'bg-slate-400 animate-pulse' : 'bg-red-500 hover:bg-red-600 active:scale-95'} text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_10px_25px_rgba(239,68,68,0.3)] flex items-center justify-center gap-4 border-b-8 border-red-700`}
               >
                 <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png" className="w-8 h-8" alt="Heal" />
                 {isHealing ? 'Curando...' : 'Restaurar Equipe'}
               </button>
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  const isInGame = !['landing'].includes(currentView);
  const isInRoute = ['battles'].includes(currentView);
  const isInShop = ['city', 'crafting'].includes(currentView);

  const showStatusStrip = isInRoute || isInShop;
  const periodMeta = {
    morning: { label: 'Manhã', hours: '05:00 - 09:59', icon: '🌅' },
    day: { label: 'Dia', hours: '10:00 - 16:59', icon: '☀️' },
    evening: { label: 'Tarde', hours: '17:00 - 19:59', icon: '🌆' },
    night: { label: 'Noite', hours: '20:00 - 04:59', icon: '🌙' },
  };
  const currentPeriodMeta = periodMeta[timeOfDay] || periodMeta.day;
  const periodIcon = {
    morning: 'AM',
    day: 'DAY',
    evening: 'PM',
    night: 'NIGHT',
  }[timeOfDay] || 'DAY';
  const autoEnabled = !!(gameState.autoFarm || gameState.autoCapture || gameState.autoCaptureConfig?.autoPotion || gameState.autoCaptureConfig?.autoStamina || gameState.autoCaptureConfig?.autoBuff);
  const autoCaptureRoute = processedRoutes[gameState.currentRoute];
  const canShowAutoCaptureModal =
    showAutoCaptureModal &&
    currentView === 'battles' &&
    currentEnemy &&
    !currentEnemy.isTrainer &&
    !currentEnemy.isWildBoss &&
    !currentEnemy.isLegendary &&
    autoCaptureRoute?.type === 'farm' &&
    autoCaptureRoute?.enemies?.length > 0;
  
  const updateAutoConfig = (patch) => {
    setGameState(prev => ({
      ...prev,
      autoCaptureConfig: { ...(prev.autoCaptureConfig || {}), ...patch },
    }));
  };

  // Auto-buff: aplica itens de buff automaticamente no início de cada novo inimigo
  useEffect(() => {
    const cfg = gameState.autoCaptureConfig;
    if (!currentEnemy || !cfg?.autoBuff) return;
    const buffItems = cfg.autoBuffItems || {};
    const inv = gameState.inventory?.items || {};
    const activePoke = gameState.team?.[activeMemberIndex];
    if (!activePoke) return;
    const STAGE_MAP = { x_attack: 'attack', x_defense: 'defense', x_speed: 'speed' };
    ['x_attack', 'x_defense', 'x_speed', 'dire_hit'].forEach(itemId => {
      if (!buffItems[itemId]) return;
      if (!inv[itemId] || inv[itemId] <= 0) return;
      const stat = STAGE_MAP[itemId];
      // Só aplica stage se ainda estiver em 0 (evita acúmulo indefinido via auto)
      if (stat && (activePoke.stages?.[stat] || 0) >= 1) return;
      // Dire Hit: não reaplicar se já ativo
      if (itemId === 'dire_hit' && gameState.activeEffects?.activeDireHit?.endsAt > Date.now()) return;
      handleUseItem(itemId, 'items');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEnemy?.instanceId]);

  if (!isPreloaded) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-600/5 blur-[60px] rounded-full animate-bounce"></div>
        
        <div className="relative z-10 w-full max-w-xs flex flex-col items-center">
           {/* PokeBall Icon Animated */}
           <div className="w-24 h-24 mb-12 relative">
              <div className="absolute inset-0 border-8 border-white/10 rounded-full"></div>
              <div className="absolute inset-0 border-t-8 border-blue-500 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]"></div>
           </div>

           <div className="w-full space-y-4">
              <div className="flex items-end justify-between px-2">
                 <h2 className="text-white font-black italic tracking-tighter text-2xl uppercase leading-none">PokéCraft</h2>
                 <span className="text-blue-500 font-black text-sm tabular-nums">{preloadProgress}%</span>
              </div>
              
              <div className="w-full h-3 bg-white/5 rounded-full p-1 border border-white/10 overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                   style={{ width: `${preloadProgress}%` }}
                 ></div>
              </div>
              
              <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[9px] text-center animate-pulse pt-2">Sincronizando Banco de Dados...</p>
           </div>

           <div className="mt-24 text-white/20 font-black text-[10px] tracking-widest uppercase italic">
              v{APP_VERSION}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-shell ${showStatusStrip ? 'info-strip-open' : ''} ${gameState.settings?.displayMode === 'pc' ? 'pc-mode' : ''}`}>
      {(!loading && user) ? (
        <>
          {/* ⛔ PROTECTED: Header principal — NíO ALTERAR ESTRUTURA, CORES OU POSICIONAMENTO SEM AUTORIZAÇíO */}
          <header style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            minHeight: '56px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {/* Esquerda — Logo */}
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                style={{width:'28px', height:'28px', objectFit:'contain'}}
                alt=""
              />
              <div style={{lineHeight:1}}>
                <div style={{color:'white', fontWeight:900, fontSize:'14px', textTransform:'uppercase', letterSpacing:'1px'}}>
                  POKÉCRAFT
                </div>
                <div style={{color:'#fde047', fontWeight:900, fontSize:'10px', textTransform:'uppercase', letterSpacing:'2px'}}>
                  IDLE
                </div>
              </div>
            </div>

            {/* Direita — botões SOMENTE in-game */}
            {isInGame && (
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <button
                  onClick={() => toggleMute()}
                  style={{background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'12px', padding:'6px', cursor:'pointer', color:'white', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center'}}
                  aria-label={muted ? 'Ativar som' : 'Desativar som'}
                >
                  {muted ? (
                    <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => showConfirm({
                    type:'confirm',
                    title:'Voltar ao início?',
                    message:'Seu progresso foi salvo.',
                    confirmLabel:'Voltar',
                    cancelLabel:'Continuar',
                    onConfirm:() => { closeConfirm(); setCurrentView('landing'); },
                    onCancel: closeConfirm,
                  })}
                  style={{background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'12px', padding:'6px', cursor:'pointer', color:'white', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center'}}
                  aria-label="Voltar ao inicio"
                >
                  <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                </button>
              </div>
            )}
          </header>

          {showStatusStrip && (
            <div className="game-status-strip">
              {isInRoute && (() => {
                const cfg = gameState.autoCaptureConfig || {};
                const activeAutoCount = [gameState.autoCapture, cfg.autoPotion, cfg.autoStamina, cfg.autoBuff].filter(Boolean).length;
                return (
                  <button
                    type="button"
                    className={`status-auto-button ${autoEnabled ? 'is-on' : ''}`}
                    onClick={() => setShowBattleAutoPanel(true)}
                    style={autoEnabled ? { position: 'relative' } : {}}
                  >
                    <span>AUTO {autoEnabled ? 'ON' : 'OFF'}</span>
                    {activeAutoCount > 0 && (
                      <span style={{
                        position: 'absolute', top: '-5px', right: '-6px',
                        background: '#10b981', color: '#fff',
                        fontSize: '8px', fontWeight: 900,
                        borderRadius: '99px', minWidth: '14px', height: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 3px', lineHeight: 1,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                      }}>{activeAutoCount}</span>
                    )}
                  </button>
                );
              })()}

              <button
                type="button"
                className="status-pill status-period"
                onClick={() => setShowTimeInfoModal(true)}
                style={{ border: 'none', cursor: 'pointer' }}
                title="Ver horários dos períodos"
              >
                <span style={{fontSize: '14px'}}>{currentPeriodMeta.icon}</span>
                {currentPeriodMeta.label}
              </button>

              <span className="status-pill">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" alt="" />
                {(gameState.currency || 0).toLocaleString()}
              </span>
            </div>
          )}

          {showTimeInfoModal && (
            <div
              className="absolute inset-0 z-[9999] flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            >
              <div className="bg-white w-[90vw] max-w-[400px] max-h-[85dvh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-slate-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                      <span style={{fontSize: '24px'}}>{currentPeriodMeta.icon}</span>
                    </div>
                    <div>
                      <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] m-0">Ciclo do dia</p>
                      <h3 className="text-white text-lg font-black uppercase italic m-0">Períodos</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTimeInfoModal(false)}
                    className="w-9 h-9 rounded-full bg-white/15 text-white font-black flex items-center justify-center"
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    x
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-3 overflow-y-auto">
                  {Object.entries(periodMeta).map(([period, data]) => (
                    <div
                      key={period}
                      className={`flex items-center gap-3 rounded-3xl border-2 p-3 ${period === timeOfDay ? 'border-emerald-300 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm flex-shrink-0">
                        <span style={{fontSize: '24px'}}>{data.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 uppercase italic leading-none">{data.label}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{data.hours}</p>
                      </div>
                      {period === timeOfDay && (
                        <span className="text-[9px] font-black uppercase text-emerald-600 bg-white px-2 py-1 rounded-full border border-emerald-100">
                          agora
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-5 pt-0">
                  <button
                    onClick={() => setShowTimeInfoModal(false)}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
                  >
                    Entendi
                  </button>
                </div>
              </div>
            </div>
          )}

          <main className="game-content px-4 pt-4 custom-scrollbar">
            {renderView({ 
          showConfirm, 
          closeConfirm,
          setActiveQuestModal,
          activeQuestModal
        })}
          </main>
        </>
      ) : (
        renderView()
      )}

      {/* Preview de inicial para Johto/Hoenn (intros hardcoded sem estado próprio) */}
      {starterPreview && (
        <StarterPreviewModal
          pokemon={starterPreview.pokemon}
          accentColor={starterPreview.accentColor}
          onConfirm={starterPreview.onConfirm}
          onCancel={() => setStarterPreview(null)}
        />
      )}

      {showKantoChampionModal && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[430px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-b-[10px] border-amber-500 animate-bounceIn">
            <div className="px-6 py-5 flex items-center gap-4" style={{ background: `linear-gradient(135deg, #f59e0bf2, #d97706dd), url('${LAB_BG_URL}') center/cover` }}>
              <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center overflow-hidden border border-white/30">
                <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-12 h-12 object-contain" alt="Prof. Carvalho" />
              </div>
              <div>
                <p className="text-amber-100 text-[10px] font-black uppercase tracking-[0.25em]">Prof. Carvalho</p>
                <h2 className="text-white text-xl font-black uppercase italic tracking-tighter leading-none">Campeao de Kanto</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm font-bold text-slate-600 leading-relaxed italic mb-3">
                "Parabens! Voce venceu a Liga de Kanto e provou que sua jornada virou historia."
              </p>
              <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-4 mb-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Nova regiao</p>
                <p className="text-xs font-bold text-emerald-900">
                  "Tambem recebi uma chamada do Prof. Elm, em Johto. Quando estiver pronto, fale com ele para iniciar uma nova regiao com regras proprias."
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setShowKantoChampionModal(false);
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: (prev.worldFlags || []).filter(f => f !== 'kanto_champion_modal_pending').concat(['kanto_champion_modal_shown']).filter((v, i, a) => a.indexOf(v) === i),
                    }));
                    setCurrentView('johto_intro');
                  }}
                  className="w-full min-h-[54px] rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-lg"
                >
                  Falar com o Prof. Elm
                </button>
                <button
                  onClick={() => {
                    setShowKantoChampionModal(false);
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: (prev.worldFlags || []).filter(f => f !== 'kanto_champion_modal_pending').concat(['kanto_champion_modal_shown']).filter((v, i, a) => a.indexOf(v) === i),
                    }));
                  }}
                  className="w-full min-h-[48px] rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                >
                  Continuar em Kanto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSinnohIntroModal && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[430px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-b-[10px] border-sky-500 animate-bounceIn">
            <div className="px-6 py-5 flex items-center gap-4" style={{ background: `linear-gradient(135deg, #0284c7f2, #0369a1dd), url('${LAB_BG_URL}') center/cover` }}>
              <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center overflow-hidden border border-white/30">
                <img src="https://play.pokemonshowdown.com/sprites/trainers/rowan.png" onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-12 h-12 object-contain" alt="Prof. Rowan" />
              </div>
              <div>
                <p className="text-sky-100 text-[10px] font-black uppercase tracking-[0.25em]">Prof. Rowan</p>
                <h2 className="text-white text-xl font-black uppercase italic tracking-tighter leading-none">Campeao de Hoenn</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm font-bold text-slate-600 leading-relaxed italic mb-3">
                "Excelente. Steven confirmou sua vitoria na Liga de Hoenn. Sinnoh esta pronta para receber voce."
              </p>
              <div className="bg-sky-50 border-2 border-sky-100 rounded-3xl p-4 mb-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-1">Nova regiao</p>
                <p className="text-xs font-bold text-sky-900">
                  "Fale comigo quando quiser escolher Turtwig, Chimchar ou Piplup e iniciar uma progressao nova ate as rotas de treino de nivel 100."
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setShowSinnohIntroModal(false);
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: (prev.worldFlags || []).filter(f => f !== 'hoenn_champion_modal_pending').concat(['hoenn_champion_modal_shown']).filter((v, i, a) => a.indexOf(v) === i),
                    }));
                    setCurrentView('sinnoh_intro');
                  }}
                  className="w-full min-h-[54px] rounded-2xl bg-sky-600 text-white font-black uppercase tracking-widest text-xs hover:bg-sky-700 transition-all shadow-lg"
                >
                  Falar com o Prof. Rowan
                </button>
                <button
                  onClick={() => {
                    setShowSinnohIntroModal(false);
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: (prev.worldFlags || []).filter(f => f !== 'hoenn_champion_modal_pending').concat(['hoenn_champion_modal_shown']).filter((v, i, a) => a.indexOf(v) === i),
                    }));
                  }}
                  className="w-full min-h-[48px] rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                >
                  Continuar em Hoenn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHAMPION TRANSITION MODALS ─────────────────────────── */}
      {[
        {
          show: showJohtoChampionModal, setShow: setShowJohtoChampionModal,
          pendingFlag: 'johto_champion_modal_pending', shownFlag: 'johto_champion_modal_shown',
          nextView: 'hoenn_intro', professorSprite: 'birch',
          professorName: 'Prof. Birch', regionWon: 'Johto', nextRegion: 'Hoenn',
          accentColor: '#f97316', buttonColor: 'bg-orange-500 hover:bg-orange-600',
          message: '"Você derrotou Lance e se tornou Campeão de Johto! Hoenn está esperando por você."',
          inviteText: '"Quando estiver pronto, venha conhecer Hoenn — escolha Treecko, Torchic ou Mudkip e comece uma nova jornada."',
          buttonLabel: 'Conhecer Hoenn com o Prof. Birch',
          stayLabel: 'Continuar em Johto por ora',
        },
        {
          show: showSinnohChampionModal, setShow: setShowSinnohChampionModal,
          pendingFlag: 'sinnoh_champion_modal_pending', shownFlag: 'sinnoh_champion_modal_shown',
          nextView: 'unova_intro', professorSprite: 'juniper',
          professorName: 'Prof. Juniper', regionWon: 'Sinnoh', nextRegion: 'Unova',
          accentColor: '#22c55e', buttonColor: 'bg-green-600 hover:bg-green-700',
          message: '"Cynthia foi derrotada! Você conquistou Sinnoh. A Prof. Juniper de Unova quer te conhecer."',
          inviteText: '"Unova tem Pokémon completamente novos esperando por você — venha começar do zero!"',
          buttonLabel: 'Conhecer Unova com a Prof. Juniper',
          stayLabel: 'Continuar em Sinnoh por ora',
        },
        {
          show: showUnovaChampionModal, setShow: setShowUnovaChampionModal,
          pendingFlag: 'unova_champion_modal_pending', shownFlag: 'unova_champion_modal_shown',
          nextView: 'kalos_intro', professorSprite: 'sycamore',
          professorName: 'Prof. Sycamore', regionWon: 'Unova', nextRegion: 'Kalos',
          accentColor: '#3b82f6', buttonColor: 'bg-blue-600 hover:bg-blue-700',
          message: '"Incrível! Você venceu a Liga de Unova. O Prof. Sycamore de Kalos ouviu sobre você."',
          inviteText: '"Kalos é repleta de beleza e segredos. Venha escolher Chespin, Fennekin ou Froakie!"',
          buttonLabel: 'Conhecer Kalos com o Prof. Sycamore',
          stayLabel: 'Continuar em Unova por ora',
        },
        {
          show: showKalosChampionModal, setShow: setShowKalosChampionModal,
          pendingFlag: 'kalos_champion_modal_pending', shownFlag: 'kalos_champion_modal_shown',
          nextView: 'alola_intro', professorSprite: 'kukui',
          professorName: 'Prof. Kukui', regionWon: 'Kalos', nextRegion: 'Alola',
          accentColor: '#f97316', buttonColor: 'bg-orange-500 hover:bg-orange-600',
          message: '"Yeah! Você derrotou Diantha e conquistou Kalos! O Prof. Kukui de Alola te convida."',
          inviteText: '"Alola não tem ginásios — tem Trials! Venha escolher Rowlet, Litten ou Popplio!"',
          buttonLabel: 'Conhecer Alola com o Prof. Kukui',
          stayLabel: 'Continuar em Kalos por ora',
        },
        {
          show: showAlolaChampionModal, setShow: setShowAlolaChampionModal,
          pendingFlag: 'alola_champion_modal_pending', shownFlag: 'alola_champion_modal_shown',
          nextView: 'galar_intro', professorSprite: 'magnolia',
          professorName: 'Prof. Magnolia', regionWon: 'Alola', nextRegion: 'Galar',
          accentColor: '#a855f7', buttonColor: 'bg-purple-600 hover:bg-purple-700',
          message: '"Você venceu os Trials de Alola! A Prof. Magnolia de Galar quer te desafiar."',
          inviteText: '"Galar tem a Liga mais famosa do mundo. Venha escolher Grookey, Scorbunny ou Sobble!"',
          buttonLabel: 'Conhecer Galar com a Prof. Magnolia',
          stayLabel: 'Continuar em Alola por ora',
        },
        {
          show: showGalarChampionModal, setShow: setShowGalarChampionModal,
          pendingFlag: 'galar_champion_modal_pending', shownFlag: 'galar_champion_modal_shown',
          nextView: '__arceus_call__', professorSprite: 'laventon',
          professorName: 'Prof. Laventon', regionWon: 'Galar', nextRegion: 'Hisui',
          accentColor: '#d97706', buttonColor: 'bg-amber-600 hover:bg-amber-700',
          message: '"Leon foi derrotado! Você é o novo Campeão de Galar. Uma força misteriosa parece te chamar para longe…"',
          inviteText: '"Há relatos de um ser divino que convoca treinadores especiais para uma terra esquecida no passado."',
          buttonLabel: 'Seguir o chamado misterioso',
          stayLabel: 'Continuar em Galar por ora',
        },
        {
          show: showHisuiChampionModal, setShow: setShowHisuiChampionModal,
          pendingFlag: 'hisui_champion_modal_pending', shownFlag: 'hisui_champion_modal_shown',
          nextView: 'paldea_intro', professorSprite: 'sada',
          professorName: 'Profa. Sada', regionWon: 'Hisui', nextRegion: 'Paldea',
          accentColor: '#ef4444', buttonColor: 'bg-red-600 hover:bg-red-700',
          message: '"Você derrotou Kamado e trouxe paz a Hisui! A Profa. Sada de Paldea ouviu sobre suas façanhas."',
          inviteText: '"Paldea é a última grande fronteira. Venha escolher Sprigatito, Fuecoco ou Quaxly para encerrar sua lenda!"',
          buttonLabel: 'Conhecer Paldea com a Profa. Sada',
          stayLabel: 'Continuar em Hisui por ora',
        },
      ].map(({ show, setShow, pendingFlag, shownFlag, nextView, professorSprite, professorName, regionWon, nextRegion, accentColor, buttonColor, message, inviteText, buttonLabel, stayLabel }) =>
        show ? (
          <div key={pendingFlag} className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-[430px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-bounceIn" style={{ borderBottom: `10px solid ${accentColor}` }}>
              <div className="px-6 py-5 flex items-center gap-4" style={{ background: `linear-gradient(135deg, ${accentColor}f2, ${accentColor}cc), url('${LAB_BG_URL}') center/cover` }}>
                <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center overflow-hidden border border-white/30">
                  <img
                    src={`https://play.pokemonshowdown.com/sprites/trainers/${professorSprite}.png`}
                    onError={e => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }}
                    className="w-12 h-12 object-contain" alt={professorName}
                  />
                </div>
                <div>
                  <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.25em]">{professorName}</p>
                  <h2 className="text-white text-xl font-black uppercase italic tracking-tighter leading-none">Campeão de {regionWon}!</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm font-bold text-slate-600 leading-relaxed italic mb-3">{message}</p>
                <div className="rounded-3xl p-4 mb-5 border-2" style={{ backgroundColor: accentColor + '11', borderColor: accentColor + '33' }}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: accentColor }}>
                    Nova Região Desbloqueada — {nextRegion}
                  </p>
                  <p className="text-xs font-bold text-slate-800">{inviteText}</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => {
                      setShow(false);
                      setGameState(prev => ({
                        ...prev,
                        worldFlags: (prev.worldFlags || []).filter(f => f !== pendingFlag).concat([shownFlag]).filter((v,i,a) => a.indexOf(v)===i),
                      }));
                      if (nextView === '__arceus_call__') setShowArceusCallModal(true);
                      else setCurrentView(nextView);
                    }}
                    className={`w-full min-h-[54px] rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg ${buttonColor}`}
                  >
                    {buttonLabel}
                  </button>
                  <button
                    onClick={() => {
                      setShow(false);
                      setGameState(prev => ({
                        ...prev,
                        worldFlags: (prev.worldFlags || []).filter(f => f !== pendingFlag).concat([shownFlag]).filter((v,i,a) => a.indexOf(v)===i),
                      }));
                    }}
                    className="w-full min-h-[48px] rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                  >
                    {stayLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* MEGA EVOLUTION INTRO — Prof. Sycamore após 1º ginásio de Kalos */}
      {showMegaIntroModal && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[430px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-bounceIn" style={{ borderBottom: '10px solid #3b82f6' }}>
            <div className="px-6 py-5 flex items-center gap-4" style={{ background: `linear-gradient(135deg, #3b82f6f2, #2563ebcc), url('${LAB_BG_URL}') center/cover` }}>
              <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center overflow-hidden border border-white/30">
                <img
                  src="https://play.pokemonshowdown.com/sprites/trainers/sycamore.png"
                  onError={e => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }}
                  className="w-12 h-12 object-contain" alt="Prof. Sycamore"
                />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.25em]">Prof. Sycamore</p>
                <h2 className="text-white text-xl font-black uppercase italic tracking-tighter leading-none">Mega Evolução!</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm font-bold text-slate-600 leading-relaxed italic mb-3">
                "Felicidades por derrotar Viola! Em Kalos descobrimos algo extraordinário: a Mega Evolução — uma transformação temporária que leva os Pokémon além dos seus limites!"
              </p>
              <div className="rounded-3xl p-4 mb-3 border-2" style={{ backgroundColor: '#dbeafe', borderColor: '#93c5fd' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#2563eb' }}>
                  💎 Sistema Desbloqueado — Mega Pedras
                </p>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  Ao batalhar em Kalos, Pokémon capazes de Mega Evoluir podem dropar <strong>Fragmentos de Mega Pedra</strong>. Combine-os na Forja para criar as Mega Pedras e transformar seus parceiros em batalha!
                </p>
              </div>
              <div className="rounded-2xl p-3 mb-5 bg-amber-50 border border-amber-200">
                <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest">
                  💡 As receitas de Mega Pedras agora estão disponíveis na Forja!
                </p>
              </div>
              <button
                onClick={() => {
                  setShowMegaIntroModal(false);
                  setGameState(prev => ({
                    ...prev,
                    worldFlags: [...new Set([...(prev.worldFlags || []), 'mega_evolution_unlocked', 'mega_intro_shown'])],
                  }));
                }}
                className="w-full min-h-[54px] rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg bg-blue-600 hover:bg-blue-700 active:scale-95"
              >
                Entendido! Vamos explorar Kalos!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Arceus — Chamado para Hisui */}
      {showArceusCallModal && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn"
          style={{ background: 'radial-gradient(ellipse at center, #1a0a3a 0%, #0a0020 60%, #000010 100%)' }}>
          {/* Estrelas */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="absolute rounded-full bg-white animate-pulse"
                style={{ width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, opacity: 0.4 + (i % 4) * 0.15,
                  top: `${5 + (i * 31 + i * 17) % 88}%`, left: `${3 + (i * 47 + i * 13) % 90}%`,
                  animationDuration: `${1.5 + (i % 4) * 0.5}s`, animationDelay: `${(i % 6) * 0.3}s` }} />
            ))}
          </div>
          {/* Aura dourada central */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full animate-pulse"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.05) 50%, transparent 70%)',
                animationDuration: '2s' }} />
          </div>
          <div className="w-full max-w-[390px] relative z-10 flex flex-col items-center text-center gap-5 animate-bounceIn">
            {/* Sprite de Arceus */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl animate-pulse"
                style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)', animationDuration: '1.8s' }} />
              <img
                src="https://play.pokemonshowdown.com/sprites/ani/arceus.gif"
                onError={e => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/gen5ani/arceus.gif'; }}
                className="relative w-28 h-28 object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 16px rgba(251,191,36,0.8))' }}
                alt="Arceus"
              />
            </div>
            {/* Texto */}
            <div>
              <p className="text-amber-300 text-[10px] font-black uppercase tracking-[0.4em] mb-1">— O Deus Pokémon —</p>
              <h2 className="text-white text-2xl font-black uppercase italic tracking-tighter leading-none mb-1">Arceus</h2>
            </div>
            <div className="bg-white/8 border border-amber-400/30 rounded-3xl px-6 py-4 backdrop-blur-sm">
              <p className="text-amber-100 text-sm font-bold leading-relaxed italic">
                "Treinador… eu ouvi sobre suas façanhas. Uma terra antiga precisa de alguém com sua força."
              </p>
              <p className="text-amber-200/80 text-xs font-bold leading-relaxed mt-2">
                "Hisui — a versão primordial de Sinnoh — está sendo perturbada. Aceite meu chamado e viaje ao passado. O Prof. Laventon irá te guiar."
              </p>
            </div>
            <div className="w-full grid grid-cols-1 gap-3">
              <button
                onClick={() => {
                  setShowArceusCallModal(false);
                  setCurrentView('hisui_intro');
                }}
                className="w-full min-h-[54px] rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg text-slate-900"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)' }}
              >
                ✨ Aceitar o Chamado de Arceus
              </button>
              <button
                onClick={() => setShowArceusCallModal(false)}
                className="w-full min-h-[44px] rounded-2xl bg-white/10 text-white/60 font-black uppercase tracking-widest text-xs hover:bg-white/15 transition-all border border-white/10"
              >
                Voltar por agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paldea = região final */}
      {showPaldeaChampionModal && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[430px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-b-[10px] border-violet-600 animate-bounceIn">
            <div className="px-6 py-5 flex items-center gap-4" style={{ background: `linear-gradient(135deg, #7c3aedee, #4f46e5dd), url('${LAB_BG_URL}') center/cover` }}>
              <div className="text-4xl">🏆</div>
              <div>
                <p className="text-violet-100 text-[10px] font-black uppercase tracking-[0.25em]">Conquista Suprema</p>
                <h2 className="text-white text-xl font-black uppercase italic tracking-tighter leading-none">Mestre Pokémon!</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm font-bold text-slate-600 leading-relaxed italic mb-3">
                "Você conquistou as 10 regiões: Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar, Hisui e Paldea. Sua lenda está gravada na história."
              </p>
              <div className="bg-violet-50 border-2 border-violet-100 rounded-3xl p-4 mb-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-600 mb-1">🌟 Jornada Completa</p>
                <p className="text-xs font-bold text-violet-900">
                  Continue explorando rotas pós-Liga, coletando Pokémon lendários e completando a Pokédex Nacional. Novos conteúdos são adicionados regularmente!
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPaldeaChampionModal(false);
                  setGameState(prev => ({
                    ...prev,
                    worldFlags: (prev.worldFlags || [])
                      .filter(f => f !== 'paldea_champion_modal_pending')
                      .concat(['paldea_champion_modal_shown'])
                      .filter((v,i,a) => a.indexOf(v)===i),
                  }));
                }}
                className="w-full min-h-[54px] rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg"
              >
                ✨ Explorar o Pós-Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hisui invite recovery modal (para campeões de Galar que ainda não foram para Hisui) */}
      {showHisuiInviteModal && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[430px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-b-[10px] border-amber-600 animate-bounceIn">
            <div className="px-6 py-5 flex items-center gap-4" style={{ background: `linear-gradient(135deg, #d97706f2, #b45309dd), url('${LAB_BG_URL}') center/cover` }}>
              <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center overflow-hidden border border-white/30">
                <img
                  src="https://play.pokemonshowdown.com/sprites/trainers/laventon.png"
                  onError={e => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }}
                  className="w-12 h-12 object-contain" alt="Prof. Laventon"
                />
              </div>
              <div>
                <p className="text-amber-100 text-[10px] font-black uppercase tracking-[0.25em]">Prof. Laventon</p>
                <h2 className="text-white text-xl font-black uppercase italic tracking-tighter leading-none">Hisui te espera!</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm font-bold text-slate-600 leading-relaxed italic mb-4">
                "Você é o Campeão de Galar! A terra ancestral de Hisui precisa de um pesquisador corajoso. Escolha seu parceiro e venha conosco!"
              </p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setShowHisuiInviteModal(false);
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: [...new Set([...(prev.worldFlags || []), 'hisui_invite_shown'])],
                    }));
                    setShowArceusCallModal(true);
                  }}
                  className="w-full min-h-[54px] rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg"
                >
                  ✨ Responder ao Chamado
                </button>
                <button
                  onClick={() => {
                    setShowHisuiInviteModal(false);
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: [...new Set([...(prev.worldFlags || []), 'hisui_invite_shown'])],
                    }));
                  }}
                  className="w-full min-h-[48px] rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                >
                  Continuar explorando por ora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGymVictoryModal && (() => {
        const cat = showGymVictoryModal.category || 'gym';
        const isGym     = !!showGymVictoryModal.badge;
        const isElite   = cat === 'elite' || cat === 'champion';
        const isRival   = cat === 'rival';
        const isVillain = cat === 'rocket' || cat === 'villain' || cat === 'team';

        const headerGradient = isGym     ? 'from-emerald-600 to-teal-700'
                             : isElite   ? 'from-purple-700 to-violet-900'
                             : isRival   ? 'from-blue-600 to-indigo-800'
                             : isVillain ? 'from-slate-700 to-slate-900'
                             :             'from-emerald-600 to-teal-700';

        const borderColor = isGym     ? 'border-amber-400'
                          : isElite   ? 'border-purple-500'
                          : isRival   ? 'border-blue-500'
                          : isVillain ? 'border-slate-500'
                          :             'border-emerald-500';

        const categoryLabel = isGym     ? 'Vitória no Ginásio'
                            : isElite   ? 'Elite Four Derrotada'
                            : isRival   ? 'Rival Derrotado'
                            : isVillain ? 'Equipe Vilã Derrotada'
                            :             'Vitória';

        const titlePrefix = isGym ? 'Líder ' : isElite ? '' : isRival ? 'Rival ' : '';

        const centralIcon = isElite   ? '👑'
                          : isRival   ? '🏅'
                          : isVillain ? '⚡'
                          :             '🏆';

        const quote = isGym     ? '"Incrível! Sua estratégia foi impecável. Como prova de sua vitória, receba esta insígnia!"'
                    : isElite   ? '"Extraordinário! Poucos chegam até aqui e saem vitoriosos!"'
                    : isRival   ? '"Você superou o rival! Continue crescendo, a jornada não terminou."'
                    : isVillain ? '"Equipe derrotada! Você protegeu a região mais uma vez!"'
                    :             '"Vitória confirmada! Continue sua jornada."';

        const handleClose = () => {
          const nextView = showGymVictoryModal.nextView;
          const isStoryBattle = cat === 'rival' || cat === 'rocket' || cat === 'villain' || cat === 'team';

          setShowGymVictoryModal(null);
          setCurrentEnemy(null);

          if (isStoryBattle) {
            // Batalha de história: perguntar destino ao jogador
            showConfirm({
              type: 'confirm',
              title: 'Onde deseja ir?',
              message: 'Seus Pokémon podem precisar de recuperação.',
              confirmLabel: '🗺️ Rotas',
              cancelLabel: '🏥 Cidade',
              onConfirm: () => { closeConfirm(); setCurrentView('battles'); },
              onCancel:  () => { closeConfirm(); handleGoToCity(); },
            });
          } else if (nextView && nextView !== 'city') {
            setCurrentView(nextView);
          }
        };

        return (
          <div className="absolute inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/20 blur-[120px] rounded-full animate-pulse" style={{animationDelay:'1s'}} />
            </div>

            <div className={`w-full max-w-[420px] bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden border-b-[12px] ${borderColor} animate-bounceIn relative`}>

              {/* Header */}
              <div className={`bg-gradient-to-br ${headerGradient} px-8 py-10 flex flex-col items-center text-center relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="w-24 h-24 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-inner mb-6">
                  {showGymVictoryModal.leaderSprite
                    ? <img src={showGymVictoryModal.leaderSprite} className="w-20 h-20 object-contain drop-shadow-lg" alt="" onError={(e) => { e.currentTarget.style.display='none'; }} />
                    : <span className="text-5xl">{centralIcon}</span>
                  }
                </div>
                <p className="text-white/70 text-[11px] font-black uppercase tracking-[0.4em] mb-2 drop-shadow-md">{categoryLabel}</p>
                <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none drop-shadow-xl">
                  {titlePrefix}{showGymVictoryModal.leaderName}
                </h2>
              </div>

              <div className="p-8 flex flex-col items-center">

                {/* Elemento central: insígnia (ginásio) ou ícone (outros) */}
                {isGym ? (
                  <div className="flex flex-col items-center gap-3 mb-8">
                    {/* Nome da insígnia ACIMA do ícone */}
                    <div className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                      {showGymVictoryModal.badge.replace(/_/g, ' ')}
                    </div>
                    {/* Ícone da insígnia */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-400/30 blur-3xl rounded-full animate-pulse" />
                      <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-200 shadow-xl relative z-10">
                        <BadgeSVG badgeId={showGymVictoryModal.badge} earned={true} size={88} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center mb-8 text-5xl shadow-inner">
                    {centralIcon}
                  </div>
                )}

                <p className="text-slate-500 text-sm font-bold text-center leading-relaxed italic mb-8 max-w-[280px]">
                  {quote}
                </p>

                {/* Recompensas */}
                <div className={`grid ${showGymVictoryModal.expShare != null ? 'grid-cols-2' : 'grid-cols-1'} gap-4 w-full mb-8`}>
                  <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-4 flex flex-col items-center text-center hover:border-amber-200 hover:bg-amber-50 transition-all">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-8 h-8 mb-2 drop-shadow-sm" alt="" />
                    <span className="text-xl font-black text-slate-800 leading-none">+{Number(showGymVictoryModal.reward || 0).toLocaleString()}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Coins</span>
                  </div>
                  {showGymVictoryModal.expShare != null && (
                    <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-4 flex flex-col items-center text-center hover:border-blue-200 hover:bg-blue-50 transition-all">
                      <div className="text-2xl mb-1">✨</div>
                      <span className="text-xl font-black text-slate-800 leading-none">{showGymVictoryModal.expShare}%</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 text-blue-500">Exp Share</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleClose}
                  className="w-full bg-slate-900 text-white h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-[0_12px_24px_-8px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Continuar Jornada
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {sessionStats && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white w-[90vw] max-w-[400px] max-h-[85dvh] rounded-3xl shadow-2xl border-b-8 border-slate-200 overflow-hidden animate-bounceIn flex flex-col">
            <div className="bg-pokeRed px-5 py-4 flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-9 h-9 object-contain" alt="Pokebola" />
              </div>
              <div>
                <h2 className="text-white font-black uppercase italic tracking-tighter text-lg leading-none">Resumo da Jornada</h2>
                <p className="text-red-200 text-[10px] font-bold uppercase tracking-widest">Sessão de batalha</p>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-band.png', label: 'Nocautes', value: sessionStats.kills },
                  { icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/star-piece.png', label: 'Shinies', value: sessionStats.shinyKills + sessionStats.captures.filter(c => c.isShiny).length },
                  { icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png', label: 'Trainers', value: sessionStats.trainers },
                  { icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png', label: 'Coins', value: sessionStats.coins },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 flex items-center justify-center mb-1">
                      <img src={s.icon} className="w-8 h-8 object-contain drop-shadow-md" alt="" />
                    </div>
                    <div className="font-black text-slate-800 text-lg leading-tight">{s.value}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
              
              {/* DROPS */}
              {Object.keys(sessionStats.drops).length > 0 && (
                <div className="bg-amber-50/50 p-4 rounded-3xl border border-amber-100">
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dowsing-machine.png" className="w-5 h-5 object-contain" alt="" /> Itens Coletados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sessionStats.drops).map(([mat, qty]) => {
                      const item = ITEM_LABELS[mat] || { icon: null, name: mat.split('_').pop() };
                      return (
                        <div key={mat} className="flex items-center gap-1.5 bg-white border border-amber-200 rounded-xl px-2.5 py-1 shadow-sm">
                          {item.icon ? (
                            <span className="text-xs">{item.icon}</span>
                          ) : (
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" />
                          )}
                          <span className="text-[10px] font-black text-amber-800 whitespace-nowrap">{item.name}</span>
                          <span className="text-[10px] font-bold text-amber-500">x{qty}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* CAPTURAS */}
              {sessionStats.captures.length > 0 && (
                <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100">
                   <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-5 h-5 object-contain" alt="" /> Capturados ({sessionStats.captures.length})
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.values(sessionStats.captures.reduce((acc, cap) => {
                      const key = String(cap.id || cap.name);
                      if (!acc[key]) {
                        acc[key] = { ...cap, count: 0, shinyCount: 0 };
                      }
                      acc[key].count += 1;
                      if (cap.isShiny) acc[key].shinyCount += 1;
                      return acc;
                    }, {})).map(cap => (
                      <div key={cap.id || cap.name} className="flex items-center gap-3 bg-white border border-blue-100 rounded-2xl px-3 py-2 shadow-sm">
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${cap.id}.png`} className="w-9 h-9 object-contain" alt={cap.name} />
                        <span className="font-black text-slate-800 text-[12px] uppercase tracking-tighter flex-1">
                          {cap.name} x{cap.count}
                        </span>
                        {cap.shinyCount > 0 && (
                          <span className="text-[8px] bg-yellow-100 text-yellow-700 font-extrabold px-2 py-1 rounded-full border border-yellow-200 flex items-center gap-1 whitespace-nowrap">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/star-piece.png" className="w-3 h-3 object-contain" alt="" />
                            x{cap.shinyCount}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {sessionStats.kills === 0 && sessionStats.captures.length === 0 && (
                <p className="text-center text-slate-400 font-bold italic text-sm py-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">Nenhum progresso nesta sessão.</p>
              )}
            </div>
            <div className="px-5 pt-3 pb-6 border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => { 
                  const targetR = sessionStats.targetRoute || gameState.currentRoute;
                  setGameState(prev => ({ 
                    ...prev, 
                    lastFarmingRoute: (ROUTES[prev.currentRoute]?.type === 'farm') ? prev.currentRoute : prev.lastFarmingRoute,
                    currentRoute: targetR 
                  }));
                  setSessionStats(null); 
                  resetSession(); 
                  setCurrentView('city'); 
                }}
                className="w-full min-h-[52px] bg-pokeRed text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-all active:scale-95 border-b-8 border-red-700 flex items-center justify-center gap-3"
              >
                Continuar para Cidade
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="w-5 h-5 object-contain brightness-0 invert" alt="" />
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView !== 'landing' && (!loading && user) && (() => {
        const isRivalBattle = currentEnemy?.isInitialRival === true;
        const menuUnlocked = (gameState.oakTutorialShown || (gameState.worldFlags && gameState.worldFlags.includes('has_starter'))) && !isRivalBattle;
        return (
          <nav className="absolute bottom-0 left-0 right-0 w-full bg-white border-t border-slate-200 flex items-center justify-around px-2 py-2 z-[500] shadow-xl">

            <button onClick={() => menuUnlocked && handleSafeNavigation('routes')}
              disabled={!menuUnlocked}
              className={`flex flex-col items-center py-1 px-3 transition-all ${!menuUnlocked ? 'opacity-30 cursor-not-allowed' : ''} ${['routes','battles'].includes(currentView) ? 'text-blue-600' : 'text-slate-400'}`}>
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png"
                className="w-7 h-7 object-contain" alt=""
                onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML += '<span style="font-size:24px">🗺️</span>'; }} />
              <span className="text-[9px] font-black uppercase mt-0.5">Rotas</span>
            </button>

            <button onClick={() => menuUnlocked && handleSafeNavigation('pokemon_management')}
              disabled={!menuUnlocked}
              className={`flex flex-col items-center py-1 px-3 transition-all ${!menuUnlocked ? 'opacity-30 cursor-not-allowed' : ''} ${currentView === 'pokemon_management' ? 'text-red-600' : 'text-slate-400'}`}>
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                className="w-7 h-7 object-contain" alt=""
                onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML += '<span style="font-size:24px">🎒</span>'; }} />
              <span className="text-[9px] font-black uppercase mt-0.5">Equipe</span>
            </button>

            <button onClick={() => menuUnlocked && handleSafeNavigation('vs')}
              disabled={!menuUnlocked}
              className={`flex flex-col items-center py-1 px-3 transition-all ${!menuUnlocked ? 'opacity-30 cursor-not-allowed' : ''} ${['vs','gyms','challenges'].includes(currentView) ? 'text-yellow-600' : 'text-slate-400'}`}>
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hard-stone.png"
                className="w-7 h-7 object-contain" alt=""
                onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML += '<span style="font-size:24px">⚔️ </span>'; }}
              />
              <span className="text-[9px] font-black uppercase mt-0.5">Modo VS</span>
            </button>

            <button onClick={() => menuUnlocked && handleSafeNavigation('city', handleGoToCity)}
              disabled={!menuUnlocked}
              className={`flex flex-col items-center py-1 px-3 transition-all ${!menuUnlocked ? 'opacity-30 cursor-not-allowed' : ''} ${currentView === 'city' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3 21h18" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 7l9-4 9 4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
                <rect x="4" y="7" width="4" height="14" fill="#818cf8" rx="0.5"/>
                <rect x="16" y="7" width="4" height="14" fill="#818cf8" rx="0.5"/>
                <rect x="9" y="12" width="6" height="9" fill="#4f46e5" rx="0.5"/>
                <rect x="10.5" y="8.5" width="1.5" height="1.5" fill="#fbbf24" rx="0.2"/>
                <rect x="13" y="8.5" width="1.5" height="1.5" fill="#fbbf24" rx="0.2"/>
                <rect x="6" y="9" width="1.5" height="1.5" fill="#fbbf24" rx="0.2"/>
                <rect x="6" y="12" width="1.5" height="1.5" fill="#fbbf24" rx="0.2"/>
                <rect x="17" y="9" width="1.5" height="1.5" fill="#fbbf24" rx="0.2"/>
                <rect x="17" y="12" width="1.5" height="1.5" fill="#fbbf24" rx="0.2"/>
              </svg>
              <span className="text-[9px] font-black uppercase mt-0.5">Cidade</span>
            </button>

            <button onClick={() => menuUnlocked && handleSafeNavigation('menu')}
              disabled={!menuUnlocked}
              className={`flex flex-col items-center py-1 px-3 transition-all ${!menuUnlocked ? 'opacity-30 cursor-not-allowed' : ''} ${currentView === 'menu' ? 'text-slate-800' : 'text-slate-400'}`}>
              <img src={fixPath('/assets/menu/pokedex.webp')}
                className="w-7 h-7 object-contain" alt=""
                onError={e => {
                  e.target.style.display='none';
                  const em = document.createElement('span');
                  em.style.fontSize = '22px';
                  em.textContent = '📱';
                  e.target.parentElement.insertBefore(em, e.target.nextSibling);
                }} />
              <span className="text-[9px] font-black uppercase mt-0.5">Menu</span>
            </button>

          </nav>
        );
      })()}

      {/* MODAL DE CONSTRUÇÕES */}
      {activeBuildingModal === 'pokecenter' && (
        <div className="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-100 animate-fadeIn overflow-hidden">
           {/* Background Imersivo */}
           <div className="absolute inset-0 z-0">
              <img src={fixPath('/bg_pokecenter_1776868686753.webp')} className="w-full h-full object-cover" alt="Pokecenter" />
              <div className="absolute inset-0 bg-white/20"></div>
           </div>

           {/* Botão de Fechar Superior */}
           <button 
             onClick={() => setActiveBuildingModal(null)}
             className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-black/40 text-white font-black flex items-center justify-center hover:bg-black/60 transition-all active:scale-90"
             aria-label="Sair"
           >
             <span className="text-2xl leading-none">×</span>
           </button>

           <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center w-full max-w-xl">
              <div className="mb-6 transform hover:scale-110 transition-transform duration-500">
                <img src="https://play.pokemonshowdown.com/sprites/ani/chansey.gif" className="h-32 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" alt="Chansey" />
              </div>

              <div className="bg-white/95 backdrop-blur-md p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-b-[12px] border-red-500/10 w-full animate-bounceIn">
                 <h3 className="text-2xl font-black text-slate-800 italic uppercase mb-2 tracking-tighter">Enfermeira Chansey:</h3>
                 <p className="text-lg font-bold text-slate-600 mb-8 italic leading-tight">
                   "Bem-vindo ao Centro Pokémon! Deseja que cuidemos da sua equipe agora?"
                 </p>
                 
                 <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => {
                        if (isHealing) return;
                        stopSFX();
                        sfxHeal();
                        setIsHealing(true);
                        setGameState(prev => {
                          const newStamina = { ...prev.stamina };
                          prev.team.forEach(p => {
                            if (p?.instanceId) {
                              newStamina[p.instanceId] = { value: 100, lastFed: Date.now() };
                            }
                          });
                          
                          const hasFreeHeals = (prev.pokecenter?.freeHeals || 0) > 0;
                          
                          return {
                            ...prev,
                            team: prev.team.map(p => ({
                              ...p, 
                              hp: p.maxHp, 
                              status: [],
                              stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 } 
                            })),
                            stamina: newStamina,
                            pokecenter: {
                              ...prev.pokecenter,
                              freeHeals: Math.max(0, (prev.pokecenter?.freeHeals || 0) - 1)
                            }
                          };
                        });
                        
                        setTimeout(() => {
                          setActiveBuildingModal(null);
                          setIsHealing(false);
                        }, 2000);
                      }}
                      className={`w-full ${isHealing ? 'bg-slate-400 animate-pulse' : 'bg-red-500 hover:bg-red-600 active:scale-95'} text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_10px_25px_rgba(239,68,68,0.3)] flex items-center justify-center gap-4 border-b-8 border-red-700`}
                    >
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png" className="w-8 h-8" alt="Heal" />
                      {isHealing ? 'Cuidando...' : 'Cuidar da Equipe'}
                    </button>

                    {/* Seção de Doação */}
                    <div className="mt-4 pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-4 px-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">💝 Apoie o Centro Pokémon</p>
                        <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-lg">
                          {gameState.pokecenter?.freeHeals || 0} CURAS SALVAS
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {POKECENTER_DONATIONS.map((don, idx) => {
                          const canDonate = (gameState.currency || 0) >= don.cost;
                          return (
                            <button
                              key={idx}
                              disabled={!canDonate || isHealing}
                              onClick={() => handlePokecenterDonation(idx, don.cost)}
                              className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                                canDonate ? 'border-red-100 bg-red-50/50 hover:bg-red-100' : 'border-slate-100 bg-slate-50 opacity-50'
                              }`}
                            >
                              <span className="text-xs font-black text-red-600 mb-1">{don.heals}x</span>
                              <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-2">{don.label}</span>
                              <span className="text-[9px] font-black text-slate-800">
                                {don.cost.toLocaleString()} <span className="text-[7px] opacity-50">C</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeBuildingModal === 'prestige_shop' && (
        <Suspense fallback={<div className="h-full bg-[#0f172a] flex items-center justify-center text-amber-400 font-black uppercase tracking-[0.5em] animate-pulse">Carregando Loja de Prestígio...</div>}>
          <PrestigeShop
            gameState={gameState}
            setGameState={setGameState}
            addLog={addLog}
            getBadgeCount={(gs) => (gs.badges || []).length}
            onHireAlly={handleHireAlly}
            onBack={() => setActiveBuildingModal(null)}
            onOpenRegionBuilder={() => { setActiveBuildingModal(null); setShowRegionBuilder(true); }}
          />
        </Suspense>
      )}

      {activeBuildingModal === 'friends' && (
        <Suspense fallback={<div className="absolute inset-0 z-[100000] bg-slate-50 flex items-center justify-center text-blue-600 font-black text-sm animate-pulse" style={{ top: '56px' }}>Carregando...</div>}>
          <FriendsScreen
            currentUserUid={auth.currentUser?.uid}
            currentUserProfile={{
              name:               gameState.trainer?.name || 'Treinador',
              level:              gameState.trainer?.level || 1,
              powerScore:         powerScore,
              badges:             (gameState.badges || []).length,
              caughtCount:        Object.keys(gameState.caughtData || {}).length,
              shinyCapturedCount: gameState.shinyCapturedCount || 0,
              worldFlags:         gameState.worldFlags || [],
              appearance:         gameState.appearance || {},
              selectedTitle:      gameState.selectedTitle || null,
              prestige:           gameState.prestige || {},
            }}
            pendingRequests={pendingFriendRequests}
            onClose={() => setActiveBuildingModal(null)}
            onChallengeRegion={({ region, ownerProfile }) => {
              setActiveBuildingModal(null);
              setChallengeRegion({ region, ownerProfile });
            }}
            onRequestsChanged={() => {
              // O listener onSnapshot já atualiza pendingFriendRequests automaticamente
            }}
          />
        </Suspense>
      )}

      {showRegionBuilder && (
        <Suspense fallback={<div className="absolute inset-0 z-[100000] bg-slate-900 flex items-center justify-center text-yellow-400 font-black animate-pulse" style={{ top: '56px' }}>Carregando Construtor de Região...</div>}>
          <RegionBuilderScreen
            gameState={gameState}
            setGameState={setGameState}
            POKEDEX={POKEDEX}
            onClose={() => setShowRegionBuilder(false)}
          />
        </Suspense>
      )}

      {challengeRegion && (
        <Suspense fallback={<div className="absolute inset-0 z-[110000] bg-slate-900 flex items-center justify-center text-yellow-400 font-black animate-pulse">Carregando Desafio de Região...</div>}>
          <RegionChallengeScreen
            region={challengeRegion.region}
            ownerProfile={challengeRegion.ownerProfile}
            gameState={gameState}
            setGameState={setGameState}
            POKEDEX={POKEDEX}
            onClose={() => setChallengeRegion(null)}
          />
        </Suspense>
      )}

      {activeBuildingModal && activeBuildingModal !== 'pokecenter' && activeBuildingModal !== 'prestige_shop' && activeBuildingModal !== 'friends' && (
        <div 
          className="absolute inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-default"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveBuildingModal(null); }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
           <div 
             className="modal-panel-mobile shadow-2xl flex flex-col relative border-b-[8px] border-slate-800 overflow-hidden" 
             style={{ backgroundColor: '#ffffff', opacity: 1 }}
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
             onPointerDown={(e) => e.stopPropagation()}
             onMouseDown={(e) => e.stopPropagation()}
             onTouchStart={(e) => e.stopPropagation()}
           >
              <div
                className="px-5 py-4 flex items-center justify-between gap-3 shrink-0"
                style={{
                  background:
                    activeBuildingModal === 'mart' ? '#2563eb' :
                    '#475569'
                }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <img
                      src={
                        activeBuildingModal === 'mart'
                          ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                          : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png'
                      }
                      className="w-9 h-9 object-contain"
                      alt=""
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">
                      {activeBuildingModal === 'mart' ? 'Suprimentos' : 'Crafting'}
                    </p>
                    <h3 className="text-white text-lg font-black uppercase italic leading-tight">
                      {activeBuildingModal === 'mart' ? 'Poke Mart' : 'Forja Pokemon'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveBuildingModal(null)}
                  className="w-9 h-9 rounded-full bg-white/20 text-white font-black flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
                  aria-label="Fechar"
                >
                  x
                </button>
              </div>

              {activeBuildingModal === 'mart' && (
                <div className="p-5 flex-1 flex flex-col overflow-hidden">
                   <div className="flex items-center justify-end mb-4">
                      <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm flex items-center gap-1 shrink-0">
                         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {gameState.currency}
                      </div>
                   </div>

                   <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-4">
                      {[
                        { id: 'pokeballs', name: 'Poke Bola', price: 1200, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', desc: 'Captura Pokemon selvagens. Mais rara no Mart: prefira fabricar na Forja.', availableFrom: null },
                        { id: 'potions', name: 'Pocao', price: 300, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png', desc: 'Restaura 20 HP', availableFrom: null },
                        { id: 'great_ball', name: 'Great Ball', price: 4200, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', desc: 'Melhor chance de captura. Produzir na Forja e mais eficiente.', availableFrom: 'boulder_badge' },
                        { id: 'revive', name: 'Revive', price: 1500, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png', desc: 'Revive Pokemon desmaiado', availableFrom: 'cascade_badge' },
                        { id: 'ultra_ball', name: 'Ultra Ball', price: 9500, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', desc: 'Alta chance de captura. Item caro para incentivar a Forja.', availableFrom: 'thunder_badge' },
                        ...POKE_MART_DRINKS.map(d => ({ ...d, desc: d.description }))
                      ].filter(item => isMartItemUnlocked(gameState, item.id)).map(item => {
                        const maxQty = Math.floor(gameState.currency / item.price);
                        const ownedQty = gameState.inventory?.items?.[item.id] || 0;
                        const buyFn = (qty) => {
                          if (qty < 1) return;
                          const totalCost = item.price * qty;
                          if (gameState.currency < totalCost) {
                            notify('Saldo Insuficiente!', 'error');
                            return;
                          }

                          const performPurchase = () => {
                            setGameState(prev => ({
                              ...prev,
                              currency: prev.currency - totalCost,
                              inventory: {
                                ...prev.inventory,
                                items: { ...prev.inventory.items, [item.id]: (prev.inventory.items[item.id] || 0) + qty }
                              }
                            }));
                            addLog(`Comprado: ${qty}x ${item.name}`, 'system');
                            notify(`Sucesso: +${qty} ${item.name}`, 'success');
                          };

                          showConfirm({
                              type: 'confirm',
                              title: 'Confirmação de Compra',
                              message: `Deseja gastar ${totalCost.toLocaleString()} Pokédollars em ${qty}x ${item.name}?`,
                              confirmLabel: 'Sim, Comprar',
                              cancelLabel: 'Cancelar',
                              onConfirm: () => {
                                closeConfirm();
                                performPurchase();
                              },
                              onCancel: closeConfirm
                            });
                        };
                        return (
                          <div key={item.id} className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
                             <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                                   <img src={item.img} className="w-9 h-9 object-contain" alt={item.name} />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <h4 className="font-black text-slate-800 uppercase italic text-sm leading-tight">{item.name}</h4>
                                   <p className="text-[10px] text-slate-400 font-bold">{item.desc}</p>
                                   <p className="mt-1 inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase text-slate-600">
                                      Na mochila: {ownedQty.toLocaleString()}
                                   </p>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] font-black text-slate-400 uppercase">Preco</p>
                                   <p className="font-black text-amber-600 text-sm flex items-center justify-end gap-1"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {item.price}</p>
                                </div>
                             </div>
                             <div className="grid grid-cols-3 gap-2">
                                {[{label:'x1',qty:1},{label:'x10',qty:10},{label:'Max',qty:maxQty}].map(opt => (
                                  <button key={opt.label}
                                    disabled={gameState.currency < (item.price * opt.qty) || (opt.qty < 1)}
                                    onClick={() => buyFn(opt.qty)}
                                    className="py-2 rounded-xl font-black text-xs uppercase transition-all bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                                  >
                                    {opt.label}{opt.label==='Max'&&maxQty>0?` (${maxQty})`:''}
                                  </button>
                                ))}
                             </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
              )}

              {activeBuildingModal === 'forge' && (
                <div className="p-4 flex-1 flex flex-col overflow-hidden min-h-0">
                  <div className="flex items-center justify-between mb-3 gap-2 shrink-0">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Poder Global</span>
                      <span className="text-xs font-black text-slate-800">{powerScore.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-center px-3 py-1 bg-slate-900 rounded-xl border border-white/10">
                      <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest leading-none mb-0.5">Rank</span>
                      <span className="text-[9px] font-black text-white italic leading-none">{currentRank}</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-xl font-black text-amber-700 text-xs flex items-center gap-1 shrink-0">
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {gameState.currency.toLocaleString()}
                    </div>
                  </div>
                  {!(gameState.worldFlags || []).includes('mega_evolution_unlocked') && (
                    <div className="mb-3 rounded-2xl bg-blue-50 border border-blue-200 px-3 py-2.5 flex items-center gap-2.5 shrink-0">
                      <span className="text-base">💎</span>
                      <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest leading-tight">
                        Mega Pedras desbloqueadas após o 1º Ginásio de Kalos (Viola).
                      </p>
                    </div>
                  )}
                  <Suspense fallback={<div className="p-6 text-center font-black text-slate-400 text-xs animate-pulse">Carregando Forja...</div>}>
                    <CraftingStation
                      recipes={
                        (gameState.worldFlags || []).includes('mega_evolution_unlocked')
                          ? CRAFTING_RECIPES
                          : Object.fromEntries(Object.entries(CRAFTING_RECIPES).filter(([cat]) => cat !== 'mega_stones'))
                      }
                      inventory={gameState.inventory}
                      currency={gameState.currency}
                      onCraft={handleCraft}
                      hasRecipe={(id) => hasForgeRecipe(gameState, id)}
                      recipeGuides={FORGE_RECIPE_DROP_GUIDE}
                      isAnyModalOpen={isAnyModalOpen}
                      isForgeConfirmOpen={isForgeConfirmOpen}
                    />
                  </Suspense>
                </div>
             )}
          </div>
       </div>
      )}
      {activeMaterialModal && (
        <div 
          className="absolute inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md animate-fadeIn cursor-default"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMaterialModal(null); }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
           <div 
             className="modal-panel-mobile bg-white shadow-2xl border-b-[8px] border-slate-800 animate-bounceIn overflow-hidden flex flex-col relative z-[60001]"
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
             onPointerDown={(e) => e.stopPropagation()}
             onMouseDown={(e) => e.stopPropagation()}
             onTouchStart={(e) => e.stopPropagation()}
           >
              <div className="bg-slate-700 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
                 <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                       <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dowsing-machine.png" className="w-9 h-9 object-contain" alt="" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Guia de material</p>
                       <h3 className="text-white text-lg font-black uppercase italic leading-tight">Onde encontrar?</h3>
                    </div>
                 </div>
                 <button onClick={() => setActiveMaterialModal(null)} className="w-9 h-9 rounded-full bg-white/20 text-white font-black flex items-center justify-center hover:bg-white/30 transition-colors shrink-0" aria-label="Fechar">x</button>
              </div>

              <div className="modal-scroll-content p-5 flex flex-col gap-5">
                 <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 shadow-inner">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                       <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-9 h-9 object-contain" alt="" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Recurso</p>
                       <h4 className="text-lg font-black text-slate-800 uppercase italic mt-1 leading-tight">{activeMaterialModal.replace(/_/g, ' ')}</h4>
                    </div>
                 </div>

                  <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white rounded-2xl border border-slate-100 p-4">
                     {(() => {
                       const guide = FORGE_MATERIAL_DROP_GUIDE[activeMaterialModal];
                       if (guide) return guide.label;
                        switch(activeMaterialModal) {
                          case 'currency': return 'Obtido derrotando Pokemon em qualquer rota ou vendendo itens raros.';
                          case 'normal_essence': return 'Dropado por Pokemon tipo NORMAL, como Pidgey e Rattata, em rotas iniciais.';
                          case 'fire_essence': return 'Dropado por Pokemon tipo FOGO. Procure em areas vulcanicas ou rotas com Charmander.';
                          case 'water_essence': return 'Dropado por Pokemon tipo AGUA em rios, lagos, mares e rotas aquaticas.';
                          case 'grass_essence': return 'Dropado por Pokemon tipo PLANTA na Rota 1 e na Floresta de Viridian.';
                          case 'electric_essence': return 'Dropado por Pokemon tipo ELETRICO. Tente a Usina de Energia.';
                          case 'ice_essence': return 'Dropado por Pokemon tipo GELO em cavernas geladas ou nas Ilhas Seafoam.';
                          case 'fighting_essence': return 'Dropado por Pokemon tipo LUTADOR na Rota 22 ou Victory Road.';
                          case 'poison_essence': return 'Dropado por Pokemon tipo VENENO na Floresta de Viridian e pantanos.';
                          case 'ground_essence': return 'Dropado por Pokemon tipo TERRA em cavernas, como a Caverna Diglett.';
                          case 'flying_essence': return 'Dropado por Pokemon tipo VOADOR em rotas abertas e ceus.';
                          case 'psychic_essence': return 'Dropado por Pokemon tipo PSIQUICO em locais misteriosos ou mansoes.';
                          case 'bug_essence': return 'Dropado por Pokemon tipo INSETO na Floresta de Viridian.';
                          case 'rock_essence': return 'Dropado por Pokemon tipo PEDRA em tuneis de rocha e cavernas.';
                          case 'ghost_essence': return 'Dropado por Pokemon tipo FANTASMA na Torre Pokemon de Lavender.';
                          case 'dragon_essence': return 'Dropado por Pokemon tipo DRAGAO em locais sagrados ou Victory Road.';
                          case 'steel_essence': return 'Dropado por Pokemon tipo ACO em areas industriais ou usinas.';
                          case 'fairy_essence': return 'Dropado por Pokemon tipo FADA no Monte Lua.';
                          case 'dark_essence': return 'Dropado por Pokemon tipo SOMBRIO em locais escuros ou mansoes.';
                          default: return 'Explore diferentes rotas e derrote Pokemon de tipos variados para coletar este material.';
                       }
                    })()}
                  </p>
                  {FORGE_MATERIAL_DROP_GUIDE[activeMaterialModal] && (
                    <button
                      onClick={() => handleGoToMaterialSource(activeMaterialModal)}
                      className="w-full min-h-[54px] rounded-2xl bg-blue-600 px-4 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95"
                    >
                      Ir para o drop
                    </button>
                  )}
               </div>

              <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-100 shrink-0">
                 <button onClick={() => setActiveMaterialModal(null)} className="w-full min-h-[52px] bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg">Entendido</button>
              </div>
           </div>
        </div>
      )}
      <Suspense fallback={null}>
        <EvolutionScreen
          evolutionPending={evolutionPending}
          POKEDEX={POKEDEX}
          setGameState={setGameState}
          addLog={addLog}
          setEvolutionPending={setEvolutionPending}
          activeRegion={gameState.activeRegion}
          isEvolutionAllowedForRegion={isEvolutionAllowedForRegion}
          getEvolutionRegionLockMessage={getEvolutionRegionLockMessage}
          gameState={gameState}
        />
      </Suspense>
      {megaEvolutionPending && (
        <Suspense fallback={null}>
          <MegaEvolutionScreen
            megaEvolutionPending={megaEvolutionPending}
            setMegaEvolutionPending={setMegaEvolutionPending}
            gameState={gameState}
            setGameState={setGameState}
            addLog={addLog}
            POKEDEX={POKEDEX}
          />
        </Suspense>
      )}

      {/* PROGRESSO OFFLINE */}
      {offlineProgress && (
        <OfflineProgressModal
          progress={offlineProgress}
          onClose={() => setOfflineProgress(null)}
        />
      )}

      {/* TUTORIAL DE BOAS-VINDAS */}
      {showTutorial && (
        <Suspense fallback={null}>
          <TutorialModal
            onClose={() => {
              setShowTutorial(false);
              setGameState(prev => ({ ...prev, gameTutorialShown: true }));
            }}
          />
        </Suspense>
      )}

      {/* NOTIFICAÇíO DE MESTRIA */}
      {masteryNotification && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm animate-slideInDown p-4">
           <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 shadow-2xl border-4 border-pokeGold flex items-center gap-6 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                 <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${masteryNotification.pokemon.isShiny ? 'shiny/' : ''}${masteryNotification.pokemon.id}.png`} className="w-24 h-24" alt="" />
              </div>
              <div className="w-20 h-20 bg-pokeGold/10 rounded-full flex items-center justify-center shrink-0 border-2 border-pokeGold/20">
                 <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${masteryNotification.pokemon.isShiny ? 'shiny/' : ''}${masteryNotification.pokemon.id}.png`} className="w-16 h-16 object-contain" alt="Mastery" />
              </div>
              <div className="flex-1">
                 <h4 className="text-xs font-black text-pokeGold uppercase tracking-[0.2em] mb-1">Mestria Alcançada!</h4>
                 <p className="text-sm font-bold text-slate-800 leading-tight">
                    Novas recompensas para <span className="uppercase">{masteryNotification.pokemon.name}</span>:
                 </p>
                 <div className="mt-2 bg-slate-800 text-white text-[9px] px-3 py-1.5 rounded-full font-black uppercase inline-block">
                    {masteryNotification.reward.val}
                 </div>
              </div>
              <button onClick={() => setMasteryNotification(null)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-800 transition-colors text-xs font-black">✖</button>
           </div>
        </div>
      )}
      {canShowAutoCaptureModal && (
        <AutoCaptureModal
          route={autoCaptureRoute}
          gameState={gameState}
          onSave={handleSaveAutoCaptureConfig}
          onClose={handleCloseAutoCaptureModal}
          onDisable={handleDisableAutoCapture}
        />
      )}

      {/* 🛡️ Boss Loot Modal */}
      {bossLoot && (
        <div className="absolute inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-[400px] bg-slate-900 border-2 border-amber-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden animate-bounceIn">
            <div className="bg-gradient-to-b from-amber-500/20 to-transparent p-8 text-center border-b border-white/5">
              <div className="w-20 h-20 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <span className="text-4xl">💰</span>
              </div>
              <h2 className="text-amber-500 font-black text-2xl uppercase italic tracking-tighter leading-tight">Saques Obtidos</h2>
              <p className="text-amber-500/50 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Tier de Recompensa: {bossDamage >= 40000 ? 'S' : bossDamage >= 25000 ? 'A' : bossDamage >= 10000 ? 'B' : 'C'}</p>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-3">
                     <span className="text-xl">🪙</span>
                     <span className="text-white/60 text-xs font-bold uppercase">Moedas</span>
                   </div>
                   <span className="text-amber-400 font-black text-lg">+{bossLoot.coins.toLocaleString()}</span>
                </div>

                {Object.entries(bossLoot.materials).map(([id, qty]) => (
                  <div key={id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-3">
                       <span className="text-xl">{ITEM_LABELS[id]?.icon || '📦'}</span>
                       <span className="text-white/60 text-xs font-bold uppercase">{ITEM_LABELS[id]?.name || id}</span>
                     </div>
                     <span className="text-emerald-400 font-black text-lg">+{qty}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setBossLoot(null);
                  setBossDamage(0);
                  setCurrentEnemy(null);
                  setCurrentView('vs');
                  setVsInitialTab('boss');
                  setBossTimer(null);
                }}
                className="w-full bg-amber-500 text-slate-900 py-5 rounded-2xl font-black uppercase text-base tracking-widest hover:bg-amber-400 transition-all shadow-lg active:scale-95"
              >
                COLETAR E VOLTAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação global */}
      {confirmModal && (
        <ConfirmModal
          type={confirmModal.type}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          cancelLabel={confirmModal.cancelLabel}
          onConfirm={confirmModal.onConfirm}
          onCancel={confirmModal.onCancel || closeConfirm}
        />
      )}
      <NotificationSystem />

      {showBattleAutoPanel && (() => {
        const autoConfig = gameState.autoCaptureConfig || {};
        const inv = gameState.inventory?.items || {};
        const mats = gameState.inventory?.materials || {};
        const hpPct = autoConfig.hpThreshold ?? autoConfig.autoPotionHpPct ?? 30;
        const stamPct = autoConfig.staminaThreshold ?? autoConfig.autoStaminaThreshold ?? 30;
        const buffItems = autoConfig.autoBuffItems || {};

        // Contagens de itens de cura
        const potionItems = [
          { id: 'potions',      label: 'Poção',       color: '#16a34a', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',       qty: inv.potions || 0 },
          { id: 'super_potion', label: 'Super',       color: '#0284c7', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png', qty: inv.super_potion || 0 },
        ];

        // Contagens de comida (prioridade: maior nutrição primeiro)
        const foodItems = [
          { id: 'moomoo_milk',  label: 'MooMoo',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png',  qty: inv.moomoo_milk  || 0 },
          { id: 'lemonade',     label: 'Limonada',img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',      qty: inv.lemonade     || 0 },
          { id: 'soda_pop',     label: 'Soda',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',      qty: inv.soda_pop     || 0 },
          { id: 'fresh_water',  label: 'Água',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',   qty: inv.fresh_water  || 0 },
          { id: 'oran_berry',   label: 'Oran',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',    qty: mats.oran_berry  || 0 },
          { id: 'sitrus_berry', label: 'Sitrus',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png',  qty: mats.sitrus_berry|| 0 },
        ].filter(f => f.qty > 0);

        // Buff items
        const BUFF_LIST = [
          { id: 'x_attack',  label: 'X-Ataque',  color: '#ef4444', stat: 'ATK', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png',  desc: '+1 Ataque por batalha' },
          { id: 'x_defense', label: 'X-Defesa',  color: '#3b82f6', stat: 'DEF', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-defense.png', desc: '+1 Defesa por batalha' },
          { id: 'x_speed',   label: 'X-Speed',   color: '#f59e0b', stat: 'VEL', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-speed.png',   desc: '+1 Velocidade por batalha' },
          { id: 'dire_hit',  label: 'Dire Hit',  color: '#8b5cf6', stat: 'CRIT',img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dire-hit.png',  desc: '+Crítico por 5 minutos' },
        ];

        // Contagem de autos ativos (para badge)
        const activeCount = [
          gameState.autoCapture, autoConfig.autoPotion, autoConfig.autoStamina, autoConfig.autoBuff
        ].filter(Boolean).length;

        const ToggleBtn = ({ active, onClick, colorOn, colorShadow }) => (
          <button type="button" onClick={onClick}
            className={`shrink-0 min-h-[38px] w-[62px] rounded-full px-2 text-[10px] font-black uppercase transition-all ${active ? `text-white shadow-md` : 'bg-slate-200 text-slate-500'}`}
            style={active ? { background: colorOn, boxShadow: `0 4px 12px ${colorShadow}` } : {}}>
            {active ? 'ON' : 'OFF'}
          </button>
        );

        return (
          <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md" onClick={() => setShowBattleAutoPanel(false)}>
            <div className="modal-panel-mobile bg-white shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100dvh - 100px)', borderBottom: '6px solid #0f172a' }} onClick={e => e.stopPropagation()}>

              {/* ── HEADER ── */}
              <div className="flex-shrink-0 flex items-center justify-between gap-2 px-4 py-3.5" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)' }}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 relative" style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400" fill="none">
                      <path d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l2-1.35-2-3.46-2.36.98a8 8 0 0 0-2.6-1.5L14.1 2.6h-4l-.35 2.57a8 8 0 0 0-2.6 1.5l-2.36-.98-2 3.46 2 1.35a7.8 7.8 0 0 0 0 3l-2 1.35 2 3.46 2.36-.98a8 8 0 0 0 2.6 1.5l.35 2.57h4l.35-2.57a8 8 0 0 0 2.6-1.5l2.36.98 2-3.46-2-1.35Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    </svg>
                    {activeCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] text-[9px] font-black text-white rounded-full flex items-center justify-center" style={{ background: '#10b981' }}>{activeCount}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.2em]">Automação de Batalha</p>
                    <h3 className="font-black text-white uppercase italic text-[15px] leading-tight tracking-tight">Painel Automático</h3>
                  </div>
                </div>
                <button onClick={() => setShowBattleAutoPanel(false)} className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm transition-colors hover:bg-white/20" style={{ background: 'rgba(255,255,255,0.1)' }} aria-label="Fechar">✕</button>
              </div>

              {/* ── BODY ── */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 flex flex-col gap-3 bg-slate-50">

                {/* ── AUTO-CAPTURA ── */}
                <div className="rounded-2xl border-2 bg-white shadow-sm overflow-hidden" style={{ borderColor: gameState.autoCapture ? '#bfdbfe' : '#f1f5f9' }}>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe' }}>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-7 h-7 object-contain" alt="" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-800 text-[13px] font-black uppercase leading-none">Auto-Captura</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-1">Captura automaticamente na rota</p>
                      </div>
                    </div>
                    <ToggleBtn active={!!gameState.autoCapture} onClick={() => setGameState(prev => ({ ...prev, autoCapture: !prev.autoCapture, autoCaptureConfig: { ...(prev.autoCaptureConfig || {}), enabled: !prev.autoCapture } }))} colorOn="#2563eb" colorShadow="rgba(37,99,235,0.3)" />
                  </div>
                  <button type="button" onClick={() => { setShowBattleAutoPanel(false); setShowAutoCaptureModal(true); }} className="w-full py-2.5 text-[11px] font-black uppercase tracking-wider text-blue-600 border-t border-blue-50 hover:bg-blue-50 transition-colors">
                    ⚙️ Configurar Rota de Captura
                  </button>
                </div>

                {/* ── AUTO-POÇÃO ── */}
                <div className="rounded-2xl border-2 bg-white shadow-sm overflow-hidden" style={{ borderColor: autoConfig.autoPotion ? '#bbf7d0' : '#f1f5f9' }}>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png" className="w-7 h-7 object-contain" alt="" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-800 text-[13px] font-black uppercase leading-none">Auto-Poção</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-1">Cura HP automaticamente em batalha</p>
                      </div>
                    </div>
                    <ToggleBtn active={!!autoConfig.autoPotion} onClick={() => updateAutoConfig({ autoPotion: !autoConfig.autoPotion })} colorOn="#16a34a" colorShadow="rgba(22,163,74,0.3)" />
                  </div>
                  {/* Slider HP */}
                  <div className="px-4 pb-3">
                    <div className="rounded-xl p-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-600">HP Mínimo</span>
                        <span className="text-[12px] font-black text-green-700">{hpPct}%</span>
                      </div>
                      <input type="range" min="10" max="80" step="5" value={hpPct} onChange={e => updateAutoConfig({ hpThreshold: Number(e.target.value), autoPotionHpPct: Number(e.target.value) })} className="w-full accent-green-600" />
                    </div>
                    {/* Poções disponíveis */}
                    <div className="mt-2 flex gap-2">
                      {potionItems.map(p => (
                        <div key={p.id} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                          <img src={p.img} className="w-5 h-5 object-contain" alt={p.label} />
                          <span className="text-[10px] font-black text-slate-600">{p.label}</span>
                          <span className="text-[10px] font-black" style={{ color: p.qty > 0 ? '#16a34a' : '#94a3b8' }}>{p.qty > 0 ? `x${p.qty}` : 'vazio'}</span>
                        </div>
                      ))}
                      {potionItems.every(p => p.qty === 0) && (
                        <p className="text-[10px] font-bold text-slate-400 italic">Sem poções — compre no Mart</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── AUTO-STAMINA ── */}
                <div className="rounded-2xl border-2 bg-white shadow-sm overflow-hidden" style={{ borderColor: autoConfig.autoStamina ? '#fde68a' : '#f1f5f9' }}>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fffbeb', border: '1.5px solid #fde68a' }}>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png" className="w-7 h-7 object-contain" alt="" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-800 text-[13px] font-black uppercase leading-none">Auto-Stamina</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-1">Alimenta Pokémon quando a energia cair</p>
                      </div>
                    </div>
                    <ToggleBtn active={!!autoConfig.autoStamina} onClick={() => updateAutoConfig({ autoStamina: !autoConfig.autoStamina })} colorOn="#d97706" colorShadow="rgba(217,119,6,0.3)" />
                  </div>
                  <div className="px-4 pb-3">
                    <div className="rounded-xl p-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-600">Energia Mínima</span>
                        <span className="text-[12px] font-black text-amber-700">{stamPct}%</span>
                      </div>
                      <input type="range" min="10" max="80" step="5" value={stamPct} onChange={e => updateAutoConfig({ staminaThreshold: Number(e.target.value), autoStaminaThreshold: Number(e.target.value) })} className="w-full accent-amber-600" />
                    </div>
                    {/* Estoque de alimentos */}
                    <div className="mt-2">
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Estoque disponível (prioridade auto):</p>
                      {foodItems.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {foodItems.map((f, idx) => (
                            <div key={f.id} className="flex items-center gap-1 rounded-lg px-2 py-1" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                              {idx === 0 && <span className="text-[8px] font-black text-amber-600">①</span>}
                              <img src={f.img} className="w-4 h-4 object-contain" alt={f.label} />
                              <span className="text-[9px] font-black text-slate-600">{f.label}</span>
                              <span className="text-[9px] font-black text-green-600">x{f.qty}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] font-bold text-slate-400 italic">Sem alimentos — compre no Mart ou use Berries</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── AUTO-BUFF ── */}
                <div className="rounded-2xl border-2 bg-white shadow-sm overflow-hidden" style={{ borderColor: autoConfig.autoBuff ? '#e9d5ff' : '#f1f5f9' }}>
                  <div className="flex items-center justify-between gap-3 p-4 pb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#faf5ff', border: '1.5px solid #e9d5ff' }}>
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png" className="w-7 h-7 object-contain" alt="" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-800 text-[13px] font-black uppercase leading-none">Auto-Buff</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-1">Aplica itens de buff no início de cada batalha</p>
                      </div>
                    </div>
                    <ToggleBtn active={!!autoConfig.autoBuff} onClick={() => updateAutoConfig({ autoBuff: !autoConfig.autoBuff })} colorOn="#7c3aed" colorShadow="rgba(124,58,237,0.3)" />
                  </div>
                  {/* Grid de buff items */}
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {BUFF_LIST.map(b => {
                        const qty = inv[b.id] || 0;
                        const active = !!buffItems[b.id];
                        return (
                          <button key={b.id} type="button"
                            onClick={() => updateAutoConfig({ autoBuffItems: { ...buffItems, [b.id]: !buffItems[b.id] } })}
                            className="relative flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition-all text-left"
                            style={{
                              borderColor: active ? b.color : '#e2e8f0',
                              background: active ? b.color + '12' : '#f8fafc',
                              opacity: qty === 0 ? 0.55 : 1,
                            }}
                          >
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: active ? b.color + '22' : '#f1f5f9' }}>
                              <img src={b.img} className="w-7 h-7 object-contain" alt={b.label} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-black text-slate-800 leading-none">{b.label}</p>
                              <p className="text-[9px] font-bold text-slate-400 mt-0.5">{b.desc}</p>
                              <p className="text-[9px] font-black mt-0.5" style={{ color: qty > 0 ? b.color : '#94a3b8' }}>
                                {qty > 0 ? `x${qty} disponível` : 'sem estoque'}
                              </p>
                            </div>
                            {active && (
                              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-black" style={{ background: b.color }}>✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {autoConfig.autoBuff && (
                      <p className="text-[9px] font-bold text-slate-400 mt-2.5 text-center">
                        💡 Aplica no início de cada novo inimigo · Stage máximo +1 por batalha
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── FOOTER ── */}
              <div className="flex-shrink-0 px-4 pt-3 pb-5 border-t border-slate-100 bg-white">
                {/* Resumo dos autos ativos */}
                {activeCount > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {gameState.autoCapture && <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full text-white" style={{ background: '#2563eb' }}>● Captura</span>}
                    {autoConfig.autoPotion  && <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full text-white" style={{ background: '#16a34a' }}>● Poção</span>}
                    {autoConfig.autoStamina && <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full text-white" style={{ background: '#d97706' }}>● Stamina</span>}
                    {autoConfig.autoBuff    && <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full text-white" style={{ background: '#7c3aed' }}>● Buff</span>}
                  </div>
                )}
                <button onClick={() => setShowBattleAutoPanel(false)} className="w-full min-h-[50px] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg transition-all hover:opacity-90 active:scale-95" style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)' }}>
                  Salvar e Fechar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── RAID: Botão flutuante ─────────────────────────────────────────── */}
      {raidRouteNotice && ['routes', 'battles'].includes(currentView) && (
        <div
          className="absolute left-1/2 z-[8100] w-[min(calc(100%-24px),430px)] -translate-x-1/2 animate-bounceIn px-3"
          style={{ bottom: gameState.activeRaid && gameState.activeRaid.phase !== 'ended' && !showRaidScreen ? 146 : 88 }}
        >
          <div
            className="mx-auto w-full rounded-3xl border-2 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl"
            style={{ borderColor: `${raidRouteNotice.tone}88`, boxShadow: `0 18px 40px ${raidRouteNotice.tone}33` }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${raidRouteNotice.pokemonId}.png`}
                    alt={raidRouteNotice.raidName}
                    className="h-12 w-12 object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 text-white text-sm font-black uppercase italic tracking-wide leading-tight">{raidRouteNotice.title}</p>
                    <span className="rounded-full bg-amber-400/15 px-2 py-1 text-[10px] font-black text-amber-300 whitespace-nowrap">RAID {raidRouteNotice.stars || 1}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] font-bold leading-snug mt-1">{raidRouteNotice.message}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRaidRouteNotice(null);
                  if (gameState.activeRaid?.phase === 'ended') {
                    setGameState(prev => ({ ...prev, activeRaid: null }));
                  }
                }}
                className="min-h-[44px] w-full rounded-2xl bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-900 shadow-lg transition-all active:scale-95"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState.activeRaid && gameState.activeRaid.phase !== 'ended' && !showRaidScreen && (
        <button
          type="button"
          onClick={() => setShowRaidScreen(true)}
          style={{
            position: 'absolute',
            bottom: '88px',
            right: '16px',
            zIndex: 8000,
            background: RAID_STAR_COLOR[gameState.activeRaid.stars] || '#f59e0b',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 16px',
            color: 'white',
            fontWeight: 900,
            fontSize: '13px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            animation: 'pulse 2s infinite',
          }}
        >
          <span style={{ fontSize: '18px' }}>⚔️</span>
          RAID {gameState.activeRaid.stars}⭐
        </button>
      )}

      {/* ── RAID: Tela de Raid ────────────────────────────────────────────── */}
      {showRaidScreen && gameState.activeRaid && (
        <div
          className="absolute inset-0 z-[8500] flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={() => {
            if (['idle', 'ended'].includes(gameState.activeRaid?.phase)) setShowRaidScreen(false);
          }}
        >
          <div
            style={{ width: '100%', maxWidth: '480px', maxHeight: '92dvh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <RaidScreen
              raid={gameState.activeRaid}
              gameState={gameState}
              onStart={handleStartRaid}
              onDismiss={() => setShowRaidScreen(false)}
              onContinueFight={handleContinueRaidFight}
              onForfeitCapture={handleForfeitRaidCapture}
              onCatchAttempt={handleRaidCatchAttempt}
              onCatchRoll={handleCatchRoll}
              onClaimRewards={handleClaimRaidRewards}
              POKEDEX={POKEDEX}
            />
          </div>
        </div>
      )}

      {/* ── MODAL: Alpha capturado — substituir shiny? ─────────────────────── */}
      {pendingAlphaCapture && (
        <div
          className="absolute inset-0 z-[110000] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(160deg,#1a0a0a 0%,#2d1010 100%)', border: '2px solid #ef444488' }}
          >
            {/* Barra vermelha topo */}
            <div style={{ height: 4, background: 'linear-gradient(90deg,transparent,#ef4444,#dc2626,#ef4444,transparent)' }} />
            <div style={{ padding: '28px 24px 24px' }}>
              {/* Ícone alfa */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'radial-gradient(circle, #ef444444 0%, transparent 70%)',
                  border: '2px solid #ef444466', marginBottom: 8,
                }}>
                  <span style={{ fontSize: 32 }}>🔴</span>
                </div>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: 0 }}>
                  {pendingAlphaCapture.raid.name} ALFA capturado!
                </h2>
                <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>
                  Você já possui uma versão <span style={{ color: '#fbbf24', fontWeight: 700 }}>✨ Shiny</span> deste Pokémon.
                  O que deseja fazer?
                </p>
              </div>

              {/* Sprite comparação */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: 16, overflow: 'hidden',
                    border: '2px solid #ef444466', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(239,68,68,0.1)', position: 'relative',
                  }}>
                    <img
                      src={pendingAlphaCapture.raid.isShiny
                        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pendingAlphaCapture.raid.pokemonId}.png`
                        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pendingAlphaCapture.raid.pokemonId}.png`}
                      alt="alfa"
                      style={{ width: 70, height: 70, objectFit: 'contain', imageRendering: 'pixelated',
                        transform: 'scale(1.3)', filter: 'drop-shadow(0 0 6px #ef4444)' }}
                    />
                  </div>
                  <p style={{ color: '#ef4444', fontSize: 11, fontWeight: 800, marginTop: 4 }}>🔴 ALFA (novo)</p>
                  <p style={{ color: '#64748b', fontSize: 10 }}>+30% stats</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: 16, overflow: 'hidden',
                    border: '2px solid #fbbf2466', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(251,191,36,0.1)',
                  }}>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pendingAlphaCapture.raid.pokemonId}.png`}
                      alt="shiny"
                      style={{ width: 70, height: 70, objectFit: 'contain', imageRendering: 'pixelated',
                        filter: 'drop-shadow(0 0 6px #fbbf24)' }}
                    />
                  </div>
                  <p style={{ color: '#fbbf24', fontSize: 11, fontWeight: 800, marginTop: 4 }}>✨ SHINY (seu)</p>
                  <p style={{ color: '#64748b', fontSize: 10 }}>versão atual</p>
                </div>
              </div>

              {/* Botões */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => {
                    // Substitui o shiny pelo alfa
                    const { newPoke, existingShinyInstanceId, raid, newItems } = pendingAlphaCapture;
                    setGameState(s => {
                      const replaceInList = (list) => list.map(p => p.instanceId === existingShinyInstanceId ? newPoke : p);
                      return {
                        ...s,
                        team: replaceInList(s.team),
                        pc:   replaceInList(s.pc),
                        inventory: { ...s.inventory, items: newItems },
                        activeRaid: { ...raid, phase: 'rewards', captured: true, catchAttemptsLeft: 0 },
                        raidStats:   { ...(s.raidStats || {}), captured: (s.raidStats?.captured || 0) + 1 },
                        playerStats: bumpPlayerStats(s.playerStats, { pokemonCaptured: 1, raidsCaptured: 1 }),
                      };
                    });
                    addLog(`🔴 ${raid.name} ALFA substituiu o Shiny no PC!`, 'system');
                    showRaidRouteNotice(raid, 'captured');
                    setPendingAlphaCapture(null);
                  }}
                  style={{
                    padding: '14px', borderRadius: 14, border: '2px solid #ef4444',
                    background: 'linear-gradient(135deg,#7f1d1d,#991b1b)',
                    color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
                  }}
                >
                  🔴 Substituir Shiny pelo Alfa
                </button>
                <button
                  onClick={() => {
                    // Mantém os dois — adiciona alfa ao PC
                    const { newPoke, raid, newItems } = pendingAlphaCapture;
                    setGameState(s => ({
                      ...s,
                      pc: [...(s.pc || []), newPoke],
                      inventory: { ...s.inventory, items: newItems },
                      activeRaid: { ...raid, phase: 'rewards', captured: true, catchAttemptsLeft: 0 },
                      raidStats:   { ...(s.raidStats || {}), captured: (s.raidStats?.captured || 0) + 1 },
                      playerStats: bumpPlayerStats(s.playerStats, { pokemonCaptured: 1, raidsCaptured: 1 }),
                    }));
                    addLog(`🔴 ${raid.name} ALFA foi ao PC! Você manteve os dois.`, 'system');
                    showRaidRouteNotice(raid, 'captured');
                    setPendingAlphaCapture(null);
                  }}
                  style={{
                    padding: '14px', borderRadius: 14, border: '2px solid #334155',
                    background: 'rgba(30,41,59,0.8)',
                    color: '#94a3b8', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  }}
                >
                  📦 Manter os dois no PC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Receita Encontrada ──────────────────────────────────────── */}
      {rareDropModal && (
        <RareDropModal
          drop={rareDropModal}
          onClose={() => setRareDropModal(null)}
        />
      )}

      {recipeFoundModal && (
        <div
          className="absolute inset-0 z-[100000] flex items-center justify-center p-4 cursor-default"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRecipeFoundModal(null); }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(160deg,#1c1410 0%,#2d1f0a 100%)', border: '2px solid #f59e0b55' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Brilho dourado topo */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg,transparent,#f59e0b,#fbbf24,#f59e0b,transparent)',
            }} />

            {/* Header */}
            <div className="pt-6 pb-3 px-6 text-center">
              <div className="text-5xl mb-2" style={{ filter: 'drop-shadow(0 0 16px #f59e0b)' }}>📜</div>
              <p style={{ color: '#f59e0b', fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 4 }}>
                {recipeFoundModal.isNew ? '✨ Nova Receita Encontrada!' : '📜 Receita Obtida'}
              </p>
              <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 20, textTransform: 'uppercase', fontStyle: 'italic', margin: 0 }}>
                {recipeFoundModal.name}
              </h3>
            </div>

            {/* Item preview */}
            <div className="mx-6 mb-4 rounded-2xl flex items-center gap-4 p-4"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <div className="shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.15)' }}>
                <img src={recipeFoundModal.img} alt={recipeFoundModal.name}
                  className="w-12 h-12 object-contain"
                  style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 0 6px #f59e0b66)' }}
                  onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: '#fbbf24', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', marginBottom: 3 }}>
                  {recipeFoundModal.name}
                </p>
                {recipeFoundModal.effect && typeof recipeFoundModal.effect === 'string' && (
                  <p style={{ color: '#94a3b8', fontSize: 11, fontStyle: 'italic', margin: 0 }}>
                    {recipeFoundModal.effect}
                  </p>
                )}
                {recipeFoundModal.description && (
                  <p style={{ color: '#64748b', fontSize: 10, marginTop: 3 }}>
                    {recipeFoundModal.description}
                  </p>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="mx-6 mb-4 text-center">
              <p style={{ color: '#475569', fontSize: 11, fontWeight: 700 }}>
                🔨 Agora você pode forjar este item na <span style={{ color: '#f59e0b' }}>Forja</span>!
              </p>
            </div>

            {/* Botão */}
            <div className="px-6 pb-6">
              <button
                onClick={() => {
                  setForgeTargetItem(recipeFoundModal.id);
                  setCurrentView('forge_screen');
                  setRecipeFoundModal(null);
                }}
                className="w-full py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                  color: '#1c1410',
                  boxShadow: '0 6px 20px rgba(245,158,11,0.4)',
                  border: 'none', cursor: 'pointer',
                }}
              >
                🔨 Ótimo! Ir Forjar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { useAutoFarm } from './hooks/useAutoFarm';
import { useSound } from './hooks/useSound';
import { ROUTES, getRivalSprite } from './data/routes';
import { INITIAL_POKEMONS } from './data/initialPokemons';
import { CRAFTING_RECIPES } from './data/recipes';
import { MOVES } from './data/moves';
import { POKEDEX } from './data/pokedex';
import { VILLAIN_TEAMS } from './data/villains';
import { getMoveData, getMoveLabel } from './utils/moveUtils';
import AuthScreen from './components/AuthScreen';

// Lazy loaded components for better performance
const MenuScreen = lazy(() => import('./components/MenuScreen'));
const TravelScreen = lazy(() => import('./components/TravelScreen'));
const PokemonManagement = lazy(() => import('./components/PokemonManagement'));
const BattleScreen = lazy(() => import('./components/BattleScreen'));
const CityScreen = lazy(() => import('./components/CityScreen'));
const CraftingStation = lazy(() => import('./components/CraftingStation'));
const EvolutionScreen = lazy(() => import('./components/EvolutionScreen'));
const PokedexScreen = lazy(() => import('./components/PokedexScreen'));
const VsScreen = lazy(() => import('./components/VsScreen'));
const GymScreen = lazy(() => import('./components/GymScreen'));
const ChallengesScreen = lazy(() => import('./components/ChallengesScreen'));
const HouseScreen = lazy(() => import('./components/HouseScreen'));
const ExpeditionsScreen = lazy(() => import('./components/ExpeditionsScreen'));
import { MoveCategoryIcon, StatusBadges, QuickInventory, TrainerCard } from './components/CommonUI';
import { GYMS, ELITE_FOUR } from './data/gyms';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { monitorAuthState } from './auth';
import { 
  APP_VERSION, APP_VERSION_DATE, DEFAULT_GAME_STATE, 
  NATURE_LIST, NATURES, TYPE_COLORS, trainerAvatars, ITEM_LABELS,
  STAMINA_RESTORE_TABLE, POKE_MART_DRINKS,
  BADGE_IDS, JOHTO_BADGE_IDS, HOENN_BADGE_IDS, getCurrentLevelCap, getRegionBadgeCount
} from './data/constants';
import { getMasteryPath, getEffectiveStat } from './utils/gameHelpers';
import { getTypeEffectiveness } from './data/typeChart';
import { POKEMON_TO_CANDY, CANDY_FAMILIES, CANDY_USES } from './data/candies';
import { calcExpeditionDuration, calcExpeditionDrops, calcExpeditionXP, EXPEDITION_BIOMES } from './data/expeditions';
import { calcHarvestDrops, calcGrowthTime, calcCombinedCaretakerBonus, PLANTABLE_ITEMS, HOUSE_PURCHASE_COST } from './data/house';
import { getTimeOfDay, TIME_CONFIG, getTimeAdjustedEnemyPool } from './utils/timeSystem';
// import HouseScreen from './components/HouseScreen';
// import ExpeditionsScreen from './components/ExpeditionsScreen';
import AutoCaptureModal from './components/AutoCaptureModal';
import ConfirmModal from './components/ConfirmModal';
import RankingModal from './components/RankingModal';

import { QUESTS, getActiveQuest, updateQuestProgress, getAvailableQuest } from './data/quests';
import NotificationSystem, { notify } from './components/NotificationSystem';
import { getCaptureRate, pickWeightedEncounter } from './utils/pokemonDifficulty';
import { preloadAssets } from './utils/preloader';
import { getBadgeCount } from './utils/progress';

const fixPath = (path) => {
  if (typeof path !== 'string') return path;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '') || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

const cleanBattleText = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/\uFFFD/g, '')
    .replace(/[\u0000-\u001f]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const BOSS_EVENT_DURATION_MS = 24 * 60 * 60 * 1000;
const BOSS_ATTEMPT_DURATION_SECONDS = 120;
const BOSS_DAMAGE_SAVE_DEBOUNCE_MS = 15000;

const normalizeInventory = (inventory = {}) => {
  const inv = inventory || {};
  const materials = { 
    ...DEFAULT_GAME_STATE.inventory.materials, 
    ...(typeof inv.materials === 'object' && inv.materials !== null ? inv.materials : {}) 
  };
  const candies = { 
    ...(typeof inv.candies === 'object' && inv.candies !== null ? inv.candies : {}) 
  };

  Object.keys(materials).forEach((key) => {
    if (!key.includes('_candy')) return;
    candies[key] = (candies[key] || 0) + (materials[key] || 0);
    delete materials[key];
  });

  return {
    ...DEFAULT_GAME_STATE.inventory,
    ...inv,
    materials,
    items: { 
      ...DEFAULT_GAME_STATE.inventory.items, 
      ...(typeof inv.items === 'object' && inv.items !== null ? inv.items : {}) 
    },
    candies,
  };
};

const getBattleLevel = (entity, fallback = 5) => {
  const direct = Number(entity?.level);
  if (Number.isFinite(direct)) return direct;
  const battleLevel = Number(entity?.battleLevel);
  return Number.isFinite(battleLevel) ? battleLevel : fallback;
};

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
    || (gameState.pc || []).some(p => Number(p.id) === id);
};

const canCaptureGhostPokemon = (gameState = {}) => {
  const flags = gameState.worldFlags || [];
  return flags.includes('rock_tunnel_cleared')
    || flags.includes('rival_pokemon_tower_defeated')
    || flags.includes('pokemon_tower_cleared');
};

const RECIPE_GATED_FORGE_IDS = new Set([
  'amulet_coin',
  'magnet',
  'charcoal',
  'mystic_water',
  'black_belt',
  'quick_claw',
  'lucky_egg',
  'cleanse_tag',
]);

const checkEvolutionEligibility = (evolutionData, gameState) => {
  if (!evolutionData || !evolutionData.id) return false;
  const targetId = Number(evolutionData.id);
  const worldFlags = gameState.worldFlags || [];
  if (targetId >= 387 && targetId <= 493) return worldFlags.includes('hoenn_champion');
  if (targetId >= 252 && targetId <= 386) return worldFlags.includes('johto_champion');
  if (targetId >= 152 && targetId <= 251) return worldFlags.includes('champion');
  return true;
};

const hasForgeRecipe = (gameState = {}, recipeId) => {
  if (!RECIPE_GATED_FORGE_IDS.has(recipeId)) return true;
  return !!gameState.inventory?.materials?.[`recipe_${recipeId}`];
};



const getJohtoBadgeCount = (gameState = {}) => {
  const badges = new Set(gameState.badges || []);
  return JOHTO_BADGE_IDS.filter(id => badges.has(id)).length;
};

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
};

const getForgeCategoryLabel = (category) => FORGE_CATEGORY_LABELS[category] || category.replace(/_/g, ' ');

const TRAINER_REWARD_MULTIPLIER = 0.4;

const ScreenLoader = ({ label = 'Carregando...' }) => (
  <div className="h-full flex items-center justify-center bg-slate-950 text-white font-black uppercase tracking-[0.25em] animate-pulse">
    {label}
  </div>
);

const MUSIC_LIST = [
  { id: 'all', name: 'Tocar Todas (Shuffle)' },
  { id: 'league_night', name: 'League Night', url: './sounds/51383504-feora-lucas-cooper-pokemon-league-night-pokemon-diamond-410587.mp3' },
  { id: 'littleroot', name: 'Littleroot Town', url: './sounds/51383504-feora-vgm-yume-littleroot-town-pokemon-ruby-amp-sapphire-lofi-410588.mp3' },
  { id: 'new_bark', name: 'New Bark Town', url: './sounds/51383504-feora-vgm-yume-new-bark-town-pokemon-gold-amp-silver-lofi-410593.mp3' },
  { id: 'route_101', name: 'Route 101', url: './sounds/51383504-feora-vgm-yume-route-101-pokeon-ruby-amp-sapphire-lofi-410589.mp3' },
  { id: 'surf', name: 'Surf Theme', url: './sounds/51383504-feora-vgm-yume-surf-theme-pokemon-ruby-amp-sapphire-lofi-410586.mp3' },
  { id: 'pallet', name: 'Pallet Town', url: './sounds/51383504-pallet-town-pokemon-red-amp-blue-lofi-410591.mp3' }
];

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

  const loadGameState = async (uid) => {
    try {
      const docRef = doc(db, "saves", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().gameState;
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
        const savedData = await loadGameState(u.uid);
        if (savedData) {
          // Migração de dados para evitar crashes com saves antigos
          // Sanitização de regional_teams
          let regional_teams = savedData.regional_teams || savedData.regionalTeams;
          if (!regional_teams || typeof regional_teams !== 'object' || Array.isArray(regional_teams)) {
            regional_teams = DEFAULT_GAME_STATE.regional_teams;
          }

          const migratedData = {
            ...DEFAULT_GAME_STATE,
            ...savedData,
            inventory: {
              ...normalizeInventory(savedData.inventory || {})
            },
            regional_teams,
            worldFlags: savedData.worldFlags || [],
            badges: savedData.badges || [],
            pc: savedData.pc || [],
            speciesMastery: savedData.speciesMastery || {}
          };
          setGameState(migratedData);
        } else {
          setGameState(DEFAULT_GAME_STATE);
        }
      } else {
        setUser(null);
        setGameState(DEFAULT_GAME_STATE);
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
        '/battle_bg_grass_1776863779024.png',
        '/battle_bg_forest_1776863795763.png',
        '/battle_bg_cave_1776863810604.png',
        'https://play.pokemonshowdown.com/sprites/trainers/red.png',
        'https://play.pokemonshowdown.com/sprites/trainers/leaf-gen3.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png'
      ],
      sounds: [
        './sounds/derrota.mp3',
        './sounds/nivel.mp3',
        './sounds/poke-center.mp3',
        './sounds/gym.mp3'
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

  const [activeMaterialModal, setActiveMaterialModal] = useState(null);
  const [evolutionPending, setEvolutionPending] = useState(null);
  const [masteryNotification, setMasteryNotification] = useState(null);
  const [activePokemonDetails, setActivePokemonDetails] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [travelTab, setTravelTab] = useState('routes');
  const [showAutoCaptureModal, setShowAutoCaptureModal] = useState(false);
  const [showBattleAutoPanel, setShowBattleAutoPanel] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const showConfirm = (config) => setConfirmModal(config);
  const closeConfirm = () => setConfirmModal(null);
  const [introStep, setIntroStep] = useState(0);
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);
  const [moveIndex, setMoveIndex] = useState(0);
  const [battleLog, setBattleLog] = useState([]);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [weather, setWeather] = useState('clear');
  const [isHealing, setIsHealing] = useState(false);
  const [activeTab, setActiveTab] = useState('team');
  const [showExpeditions, setShowExpeditions] = useState(false);
  const [showHouse, setShowHouse] = useState(false);
  const [showOakHouseModal, setShowOakHouseModal] = useState(false);
  const [showOakStaminaModal, setShowOakStaminaModal] = useState(false);
  const [showBallForgeTutorial, setShowBallForgeTutorial] = useState(false);
  const [showKantoChampionModal, setShowKantoChampionModal] = useState(false);
  const [showHoennUnlockModal, setShowHoennUnlockModal] = useState(false);
  const [previewStarter, setPreviewStarter] = useState(null);
  const [activeQuestModal, setActiveQuestModal] = useState(null);
  const [pendingQuest, setPendingQuest] = useState(null);
  const [battleReady, setBattleReady] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [showTimeInfoModal, setShowTimeInfoModal] = useState(false);
  const [vsInitialTab, setVsInitialTab] = useState('challenges'); // 'challenges', 'gyms', 'legendary'
  const [vsInitialCategory, setVsInitialCategory] = useState(null); // 'rival', 'boss', 'rocket', 'legendary'
  const [vsInitialRegion, setVsInitialRegion] = useState('kanto'); // 'kanto', 'johto', 'hoenn'

  const [sessionStats, setSessionStats] = useState(null);
  const sessionRef = useRef({ kills: 0, coins: 0, trainers: 0, shinyKills: 0, drops: {}, captures: [] });



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
  const cloudSaveTimeoutRef = useRef(null);
  const bossSaveTimeoutRef = useRef(null);
  const [showRanking, setShowRanking] = useState(false);
  const [bossDamage, setBossDamage] = useState(0);
  const [bossTimer, setBossTimer] = useState(null);
  const [bossLoot, setBossLoot] = useState(null);
  const [pendingBossBattle, setPendingBossBattle] = useState(null);
  const [bossTeamSelection, setBossTeamSelection] = useState([]);
  const currentBossEventRef = useRef(null);

  const [installPrompt, setInstallPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);


  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // 1. Verifica se o index.html já capturou o prompt
    if (window.deferredPrompt) {
      console.log('PWA: deferredPrompt recuperado do global');
      setInstallPrompt(window.deferredPrompt);
    }

    // 2. Ouve o evento customizado caso o prompt chegue depois do carregamento do React
    const handlePwaReady = (e) => {
      console.log('PWA: Evento customizado pwa-prompt-ready recebido');
      setInstallPrompt(e.detail);
    };

    // 3. Mantém o listener padrão por redundância
    const handler = (e) => {
      console.log('PWA: beforeinstallprompt capturado no React');
      e.preventDefault();
      setInstallPrompt(e);
    };

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
      console.log(`PWA: Resposta do usuário: ${outcome}`);
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


  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem('poke_idle_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.gameState) {
          const loaded = parsed.gameState;
          const merged = {
            ...DEFAULT_GAME_STATE,           // novos campos com valores padrão
            ...loaded,                  // progresso real do jogador
            version: APP_VERSION,
            team: loaded.team || DEFAULT_GAME_STATE.team,
            pc: loaded.pc || DEFAULT_GAME_STATE.pc,
            badges: loaded.badges || DEFAULT_GAME_STATE.badges,
            worldFlags: loaded.worldFlags || DEFAULT_GAME_STATE.worldFlags,
            inventory: {
                ...normalizeInventory(loaded.inventory || {})
            },
            stages: loaded.stages || DEFAULT_GAME_STATE.stages,
            caughtData: loaded.caughtData || DEFAULT_GAME_STATE.caughtData,
            speciesMastery: loaded.speciesMastery || DEFAULT_GAME_STATE.speciesMastery,
            settings: { ...DEFAULT_GAME_STATE.settings, ...(loaded.settings || {}) },
            autoConfig: { ...DEFAULT_GAME_STATE.autoConfig, ...(loaded.autoConfig || {}) },
          };
          return merged;
        }
      }
    } catch (e) {
      console.error('Error parsing save', e);
    }
    return DEFAULT_GAME_STATE;
  });

  const powerScore = useMemo(() => {
    // PS = Soma dos Níveis de TODOS os Pokémon + Bônus de Insígnias
    const teamPokes = gameState.team || [];
    const pcPokes = gameState.pc || [];
    const caretakerPokes = gameState.house?.caretakers || [];
    const expeditionPokes = Object.values(gameState.expeditions || {}).flatMap(e => e.team || []);
    const regional_teams_pokes = Object.values(gameState.regional_teams || {}).flat();

    const allPokes = [
      ...teamPokes, 
      ...pcPokes, 
      ...caretakerPokes, 
      ...expeditionPokes,
      ...regional_teams_pokes
    ];

    // Remove duplicatas por instanceId
    const seenIds = new Set();
    const levelsSum = allPokes.reduce((acc, p) => {
      if (!p) return acc;
      if (p.instanceId) {
        if (!seenIds.has(p.instanceId)) {
          seenIds.add(p.instanceId);
          return acc + (p.level || 0);
        }
      } else {
        // Pokémon sem instanceId também contam
        return acc + (p.level || 0);
      }
      return acc;
    }, 0);

    const worldFlags = gameState.worldFlags || [];
    const badgeBonus = (gameState.badges || []).length * 1000;
    
    // Bônus de 5000 PS por cada revanche vencida (Elite Difficulty)
    const rematchBonus = worldFlags.filter(f => f.includes('rematch_') && f.endsWith('_defeated')).length * 5000;

  const [showHoennUnlockModal, setShowHoennUnlockModal] = useState(false);
  const [previewStarter, setPreviewStarter] = useState(null);
  const [activeQuestModal, setActiveQuestModal] = useState(null);
  const [pendingQuest, setPendingQuest] = useState(null);
  const [battleReady, setBattleReady] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [showTimeInfoModal, setShowTimeInfoModal] = useState(false);
  const [vsInitialTab, setVsInitialTab] = useState('challenges'); // 'challenges', 'gyms', 'legendary'
  const [vsInitialCategory, setVsInitialCategory] = useState(null); // 'rival', 'boss', 'rocket', 'legendary'
  const [vsInitialRegion, setVsInitialRegion] = useState('kanto'); // 'kanto', 'johto', 'hoenn'

  const [sessionStats, setSessionStats] = useState(null);
  const sessionRef = useRef({ kills: 0, coins: 0, trainers: 0, shinyKills: 0, drops: {}, captures: [] });



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
  const cloudSaveTimeoutRef = useRef(null);
  const bossSaveTimeoutRef = useRef(null);
  const [showRanking, setShowRanking] = useState(false);
  const [bossDamage, setBossDamage] = useState(0);
  const [bossTimer, setBossTimer] = useState(null);
  const [bossLoot, setBossLoot] = useState(null);
  const [pendingBossBattle, setPendingBossBattle] = useState(null);
  const [bossTeamSelection, setBossTeamSelection] = useState([]);
  const currentBossEventRef = useRef(null);

  const [installPrompt, setInstallPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);


  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // 1. Verifica se o index.html já capturou o prompt
    if (window.deferredPrompt) {
      console.log('PWA: deferredPrompt recuperado do global');
      setInstallPrompt(window.deferredPrompt);
    }

    // 2. Ouve o evento customizado caso o prompt chegue depois do carregamento do React
    const handlePwaReady = (e) => {
      console.log('PWA: Evento customizado pwa-prompt-ready recebido');
      setInstallPrompt(e.detail);
    };

    // 3. Mantém o listener padrão por redundância
    const handler = (e) => {
      console.log('PWA: beforeinstallprompt capturado no React');
      e.preventDefault();
      setInstallPrompt(e);
    };

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
      console.log(`PWA: Resposta do usuário: ${outcome}`);
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


  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem('poke_idle_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.gameState) {
          const loaded = parsed.gameState;
          const merged = {
            ...DEFAULT_GAME_STATE,           // novos campos com valores padrão
            ...loaded,                  // progresso real do jogador
            version: APP_VERSION,
            team: loaded.team || DEFAULT_GAME_STATE.team,
            pc: loaded.pc || DEFAULT_GAME_STATE.pc,
            badges: loaded.badges || DEFAULT_GAME_STATE.badges,
            worldFlags: loaded.worldFlags || DEFAULT_GAME_STATE.worldFlags,
            inventory: {
                ...normalizeInventory(loaded.inventory || {})
            },
            stages: loaded.stages || DEFAULT_GAME_STATE.stages,
            caughtData: loaded.caughtData || DEFAULT_GAME_STATE.caughtData,
            speciesMastery: loaded.speciesMastery || DEFAULT_GAME_STATE.speciesMastery,
            settings: { ...DEFAULT_GAME_STATE.settings, ...(loaded.settings || {}) },
            autoConfig: { ...DEFAULT_GAME_STATE.autoConfig, ...(loaded.autoConfig || {}) },
          };
          return merged;
        }
      }
    } catch (e) {
      console.error('Error parsing save', e);
    }
    return DEFAULT_GAME_STATE;
  });

  const powerScore = useMemo(() => {
    // PS = Soma dos Níveis de TODOS os Pokémon + Bônus de Insígnias
    const teamPokes = gameState.team || [];
    const pcPokes = gameState.pc || [];
    const caretakerPokes = gameState.house?.caretakers || [];
    const expeditionPokes = Object.values(gameState.expeditions || {}).flatMap(e => e.team || []);
    const regional_teams_pokes = Object.values(gameState.regional_teams || {}).flat();

    const allPokes = [
      ...teamPokes, 
      ...pcPokes, 
      ...caretakerPokes, 
      ...expeditionPokes,
      ...regional_teams_pokes
    ];

    // Remove duplicatas por instanceId
    const seenIds = new Set();
    const levelsSum = allPokes.reduce((acc, p) => {
      if (!p) return acc;
      if (p.instanceId) {
        if (!seenIds.has(p.instanceId)) {
          seenIds.add(p.instanceId);
          return acc + (p.level || 0);
        }
      } else {
        // Pokémon sem instanceId também contam
        return acc + (p.level || 0);
      }
      return acc;
    }, 0);

    const worldFlags = gameState.worldFlags || [];
    const badgeBonus = (gameState.badges || []).length * 1000;
    
    // Bônus de 5000 PS por cada revanche vencida (Elite Difficulty)
    const rematchBonus = worldFlags.filter(f => f.includes('rematch_') && f.endsWith('_defeated')).length * 5000;

    return levelsSum + badgeBonus + rematchBonus;
  }, [gameState.team, gameState.pc, gameState.house, gameState.expeditions, gameState.regional_teams, gameState.worldFlags, gameState.badges]);

  const createRegionStarter = useCallback((pokemonId, level = 5, region = 'kanto') => {
    const base = POKEDEX[Number(pokemonId)];
    if (!base) return null;
    const moves = (base.learnset || [])
      .filter(m => m.level <= level)
      .map(m => getMoveData(m.move));
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

  const createRivalStarter = (id, level) => {
    const base = POKEDEX[id];
    if (!base) return { id, level, hp: 100, maxHp: 100, attack: 10, defense: 10, spAtk: 10, spDef: 10, speed: 10, moves: [], stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 }, status: [] };
    
    const calcStat = (b, lv) => Math.max(1, Math.ceil(((2 * b * lv) / 100) + 5));
    const calcHp   = (b, lv) => Math.max(1, Math.ceil(((2 * b * lv) / 100) + lv + 10));

    return { 
      ...base, 
      id, 
      level,
      maxHp: calcHp(base.hp || base.maxHp || 45, level),
      hp: calcHp(base.hp || base.maxHp || 45, level),
      attack:  calcStat(base.attack  || 45, level),
      defense: calcStat(base.defense || 45, level),
      spAtk:   calcStat(base.spAtk   || 45, level),
      spDef:   calcStat(base.spDef   || 45, level),
      speed:   calcStat(base.speed   || 45, level),
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 },
      status: []
    };
  };

  const addLog = useCallback((msg, type = 'default') => {
    setBattleLog(prev => [{ msg: cleanBattleText(msg), type, id: Date.now() + Math.random() }, ...prev].slice(0, 8));
  }, []);

  const addFloat = useCallback((text, color = '#ef4444') => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text: cleanBattleText(text), color }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(f => f.id !== id)), 1200);
  }, []);

  const teamSpriteSignature = useMemo(() => (
    (gameState.team || [])
      .map(p => `${p.id}:${p.isShiny ? 's' : 'n'}`)
      .join('|')
  ), [gameState.team]);

  const validateTeamAccess = useCallback((pokemon, targetRegion) => {
    if (!pokemon) return false;
    
    const worldFlags = gameState.worldFlags || [];
    const targetKey = (targetRegion || '').toLowerCase();
    
    const isChampion = worldFlags.includes(`region_champion_${targetKey}`) || 
                      (targetKey === 'kanto' && worldFlags.includes('champion')) ||
                      (targetKey === 'johto' && worldFlags.includes('johto_champion')) ||
                      (targetKey === 'hoenn' && worldFlags.includes('hoenn_champion')) ||
                      (targetKey === 'sinnoh' && worldFlags.includes('sinnoh_champion'));
    
    if (isChampion) return true;

    const REGION_ORDER = { kanto: 1, johto: 2, hoenn: 3, sinnoh: 4 };
    const id = Number(pokemon.id);
    const pokemonGen = id <= 151 ? 1 : id <= 251 ? 2 : id <= 386 ? 3 : 4;
    
    const pRegion = (pokemon.capturedRegion || '').toLowerCase();
    const originRegion = pRegion || (pokemonGen === 1 ? 'kanto' : pokemonGen === 2 ? 'johto' : pokemonGen === 3 ? 'hoenn' : 'sinnoh');
    
    // Regra: Pokémon da MESMA região ou de regiões MAIS RECENTES podem ser usados.
    // Bloqueia APENAS se o Pokémon for de uma região ANTERIOR à atual.
    if (originRegion !== targetKey) {
      const originLevel = REGION_ORDER[originRegion] || 1;
      const targetLevel = REGION_ORDER[targetKey] || 1;
      if (originLevel < targetLevel) return false;
    }

    return true;
  }, [gameState.worldFlags]);

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
      
      // Se o time estiver vazio, tenta inicializar com o starter salvo
      if (newTeam.length === 0) {
        const savedStarterId = (prev.selectedStarters || {})[newRegion];
        if (savedStarterId) {
          const starter = createRegionStarter(savedStarterId, 5, newRegion);
          if (starter) newTeam = [starter];
        }
      }

      addLog(`🌍 Viajando para ${newRegion.toUpperCase()}... Equipe trocada!`, 'system');

      return {
        ...prev,
        activeRegion: newRegion,
        regional_teams: updated_regional_teams,
        team: newTeam
      };
    });
  }, [addLog, createRegionStarter]);

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
    if (!gameState.worldFlags?.includes('starters_spotted') && !gameState.worldFlags?.includes('rival_1_defeated')) return ROUTES;
    
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

    // Rota 1: Squirtle e Charmander
    addSafe('route_1', 7, 4, 'water_stone_shard', 0.08);
    addSafe('route_1', 4, 4, 'fire_stone_shard', 0.08);

    // Rota 22: Eevee
    addSafe('route_22', 133, 6);

    // Floresta de Viridian: Pikachu e Bulbasaur
    addSafe('viridian_forest', 25, 9, 'thunder_stone_shard', 0.08);
    addSafe('viridian_forest', 1, 8, 'leaf_stone_shard', 0.08);
    
    // Johto Starters
    if (gameState.worldFlags?.includes('johto_rival_1_defeated')) {
      addSafe('johto_route_29', 152, 4); // Chikorita
      addSafe('johto_route_29', 155, 4); // Cyndaquil
      addSafe('johto_route_29', 158, 4); // Totodile
      addSafe('johto_route_30', 152, 5);
      addSafe('johto_route_30', 155, 5);
      addSafe('johto_route_30', 158, 5);
    }

    // Hoenn Starters
    if (gameState.worldFlags?.includes('hoenn_rival_1_defeated')) {
      addSafe('route_101', 252, 4); // Treecko
      addSafe('route_101', 255, 4); // Torchic
      addSafe('route_101', 258, 4); // Mudkip
      addSafe('route_102', 252, 5);
      addSafe('route_102', 255, 5);
      addSafe('route_102', 258, 5);
    }

    // Sinnoh Starters
    if (gameState.worldFlags?.includes('sinnoh_rival_1_defeated')) {
      addSafe('route_201', 387, 4); // Turtwig
      addSafe('route_201', 390, 4); // Chimchar
      addSafe('route_201', 393, 4); // Piplup
      addSafe('route_202', 387, 5);
      addSafe('route_202', 390, 5);
      addSafe('route_202', 393, 5);
    }

    return newRoutes;
  }, [gameState.worldFlags]);

  // IMAGE PRELOADER PARA OTIMIZACAO
  useEffect(() => {
    if (!gameState || !processedRoutes) return;
    const teamSprites = teamSpriteSignature
      ? teamSpriteSignature.split('|').map(entry => {
        const [id, shiny] = entry.split(':');
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shiny === 's' ? 'shiny/' : ''}${id}.png`;
      })
      : [];
    const criticalImages = [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
      'https://play.pokemonshowdown.com/sprites/trainers/oak.png',
      'https://play.pokemonshowdown.com/sprites/trainers/nurse.png',
      ...teamSprites,
      fixPath(processedRoutes[gameState.currentRoute]?.background || '')
    ].flat().filter(src => src && src.length > 5);

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [gameState.currentRoute, teamSpriteSignature, processedRoutes]);


  // 🛡️ PROTECTED: handleSafeNavigation — Gerenciamento centralizado de transições de tela
  const handleSafeNavigation = useCallback((targetView, extraAction = null) => {
    const isTraining = !currentEnemy?.isTrainer && !currentEnemy?.isWildBoss && !currentEnemy?.isLegendary;
    const isKeyBattle = currentEnemy && !isTraining;

    if (isKeyBattle) {
      showConfirm({
        type: 'confirm',
        title: 'Abandonar Batalha?',
        message: 'Se você sair agora, perderá o progresso desta batalha importante. Deseja continuar?',
        confirmLabel: 'Sair e ver resumo',
        cancelLabel: 'Continuar lutando',
        onConfirm: () => {
          closeConfirm();
          // Registra o progresso atual e encerra a sessão
          setSessionStats({ ...sessionRef.current, targetRoute: gameState.currentRoute });
          setCurrentEnemy(null);
          if (extraAction) extraAction();
          setCurrentView(targetView);
        },
        onCancel: closeConfirm
      });
      return;
    }

    // Navegação direta para rotas de treino ou menus
    if (extraAction) extraAction();
    setCurrentView(targetView);
  }, [currentEnemy, gameState.currentRoute, showConfirm, closeConfirm, setCurrentView]);

  // PROTECTED: handleGoToCity - NAO EDITAR SEM AUTORIZACAO EXPLICITA
  const handleGoToCity = useCallback(() => {
    const currentR = ROUTES[gameState.currentRoute];
    const isTraining = !currentEnemy?.isTrainer && !currentEnemy?.isWildBoss && !currentEnemy?.isLegendary;
    const isKeyBattle = currentEnemy && !isTraining;
    let targetCityId = null;

    if (currentR && currentR.group) {
      targetCityId = Object.keys(ROUTES).find(key => 
        ROUTES[key].group === currentR.group && 
        (ROUTES[key].type === 'city' || ROUTES[key].type === 'gym')
      );
    }

    const performExit = () => {
      if (currentView === 'battles' && (sessionRef.current.kills > 0 || sessionRef.current.captures.length > 0)) {
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
      setCurrentView('travel'); // Retorna ao menu de escolha de rota
    };

    if (isKeyBattle) {
      showConfirm({
        type: 'confirm',
        title: 'Abandonar Batalha?',
        message: 'Se você sair agora, perderá o progresso desta batalha importante. Deseja ver o resumo do que obteve até aqui?',
        confirmLabel: 'Sim, sair',
        cancelLabel: 'Continuar lutando',
        onConfirm: () => {
          closeConfirm();
          performExit();
        },
        onCancel: closeConfirm
      });
      return;
    }

    performExit();
  }, [currentEnemy, gameState.currentRoute, currentView, ROUTES, showConfirm, closeConfirm, setGameState, setCurrentView, resetSession]);



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

  const getNearestCityRouteId = useCallback((routeId) => {
    const currentR = ROUTES[routeId];
    if (!currentR?.group) return routeId || 'pallet_town';
    return Object.keys(ROUTES).find(key =>
      ROUTES[key].group === currentR.group &&
      (ROUTES[key].type === 'city' || ROUTES[key].type === 'gym')
    ) || routeId || 'pallet_town';
  }, [ROUTES]);

  const healTeamAtPokemonCenter = useCallback((afterHeal) => {
    if (isHealing) return;
    stopSFX();
    sfxHeal();
    setIsHealing(true);
    setCurrentEnemy(null);
    setBattleReady(false);
    setActiveMemberIndex(0);
    setMoveIndex(0);

    setGameState(prev => {
      const healedTeam = (prev.team || []).map(p => ({
        ...p,
        hp: p.maxHp,
        status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 }
      }));
      const newStamina = { ...(prev.stamina || {}) };
      healedTeam.forEach(p => {
        if (p?.instanceId) {
          newStamina[p.instanceId] = { value: 100, lastFed: Date.now() };
        }
      });
      return {
        ...prev,
        team: healedTeam,
        stamina: newStamina,
      };
    });

    setTimeout(() => {
      setIsHealing(false);
      resetSession();
      if (afterHeal) afterHeal();
    }, 1200);
  }, [isHealing, stopSFX, sfxHeal, resetSession]);

  // UNIFICACAO DE COLECAO (Protegida)
  const unifyDuplicates = useCallback((prev) => {
    const fixPoke = (p) => {
      if (!p) return p;
      const id = Number(p.id);
      const needsMoves = !p.moves || p.moves.length === 0;
      const needsStats = !p.spAtk || !p.spDef;
      
      if (!needsMoves && !needsStats) return p;

      const base = POKEDEX[id] || {};
      let finalMoves = p.moves;
      if (needsMoves) {
        const learnset = base.learnset || [];
        let availableMoves = learnset
          .filter(m => m.level <= (p.level || 5))
          .map(m => getMoveData(m.move));
        if (availableMoves.length === 0) availableMoves = [{ name: 'Investida', power: 40, type: 'Normal' }];
        finalMoves = availableMoves.slice(-4);
      }

      return { 
        ...p, 
        moves: finalMoves,
        spAtk: Math.ceil(p.spAtk || base.spAtk || 10),
        spDef: Math.ceil(p.spDef || base.spDef || 10),
        attack: Math.ceil(p.attack || base.attack || 10),
        defense: Math.ceil(p.defense || base.defense || 10),
        speed: Math.ceil(p.speed || base.speed || 10),
        maxHp: Math.ceil(p.maxHp || base.maxHp || base.hp || 30),
        hp: Math.ceil(p.hp || p.maxHp || base.maxHp || base.hp || 30)
      };
    };

    const nextTeam = (prev.team || []).map(fixPoke);
    const nextPC = (prev.pc || []).map(fixPoke);

    // Mantem a unificacao apenas no PC para evitar inflacao de dados, 
    // mas nunca retira ou insere nada no TIME sagrado do jogador.
    const uniquePC = {};
    nextPC.forEach(p => {
      const id = p.id;
      if (!uniquePC[id] || p.level > uniquePC[id].level) {
        uniquePC[id] = p;
      } else if (p.isShiny && !uniquePC[id].isShiny) {
        uniquePC[id] = { ...uniquePC[id], isShiny: true, hp: uniquePC[id].maxHp };
      }
    });

    return { 
      ...prev, 
      team: nextTeam, 
      pc: Object.values(uniquePC).sort((a, b) => b.level - a.level) 
    };
  }, []);

  useEffect(() => {
    setGameState(prev => {
      const all = [...(prev.team || []), ...(prev.pc || [])];
      const needsMoves = all.some(p => !p.moves || p.moves.length === 0);
      const uniqueIds = new Set(all.map(p => Number(p.id)));
      
      // Sincroniza Pokedex (caughtData) com Pokémons que o jogador possui
      let caughtChanged = false;
      const newCaughtData = { ...(prev.caughtData || {}) };
      all.forEach(p => {
        if (!newCaughtData[p.id]) {
          newCaughtData[p.id] = true;
          caughtChanged = true;
        }
      });

      if (uniqueIds.size < all.length || needsMoves || caughtChanged) {
        // Se houver duplicatas ou precisar de golpes, unifica. Caso contrário, usa o estado atual.
        const nextState = (uniqueIds.size < all.length || needsMoves) ? unifyDuplicates(prev) : prev;
        
        // Aplica a mudança de caughtData se necessário
        if (caughtChanged) {
          return { ...nextState, caughtData: newCaughtData };
        }
        return nextState;
      }
      return prev;
    });
  }, [gameState.team?.length, gameState.pc?.length, unifyDuplicates]);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        addLog(`👤 Logado como ${user.email}`, 'system');
        try {
          const docRef = doc(db, "saves", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data?.gameState) {
              setGameState(prev => ({ ...prev, ...data.gameState }));
              addLog("☁️   Progresso sincronizado com a nuvem!", "system");
            }
          }
        } catch (err) {
          console.error("Erro ao carregar nuvem:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [addLog]);

  // 1. Sincronização LocalStorage (debounced para reduzir JSON.stringify durante batalhas)
  useEffect(() => {
    const persist = () => {
      try {
        localStorage.setItem('poke_idle_save', JSON.stringify({ gameState }));
      } catch (err) {
        console.warn('Falha ao salvar progresso local:', err);
      }
    };

    const timeout = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(persist, { timeout: 1200 });
      } else {
        persist();
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [gameState]);

  // 2. Gatilhos de Salvamento na Nuvem (Debounced 5s)
  // Baseado em: Fechamento de Modais ou Troca de Rota
  const saveToCloud = useCallback(async (dataToSave) => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      // Cálculo do Power Score Global para Ranking (Soma de todos os Pokémons do jogador)
      const teamPokes = dataToSave.team || [];
      const pcPokes = dataToSave.pc || [];
      const caretakerPokes = dataToSave.house?.caretakers || [];
      const expeditionPokes = Object.values(dataToSave.expeditions || {}).flatMap(e => e.team || []);
      const regional_teams_pokes = Object.values(dataToSave.regional_teams || {}).flat();

      const allPokes = [...teamPokes, ...pcPokes, ...caretakerPokes, ...expeditionPokes, ...regional_teams_pokes];
      const seenIds = new Set();
      const levelsSum = allPokes.reduce((acc, p) => {
        if (p && p.instanceId && !seenIds.has(p.instanceId)) {
          seenIds.add(p.instanceId);
          return acc + (p.level || 0);
        }
        return acc;
      }, 0);

      const badgeCount = getBadgeCount(dataToSave);
      const powerScore = levelsSum + (badgeCount * 1000);

      lastSyncRef.current = Date.now();
      
      // 1. Salva o estado completo do jogo
      await setDoc(doc(db, "saves", user.uid), { 
        gameState: removeUndefinedFields({ ...dataToSave, version: dataToSave.version || APP_VERSION }), 
        updatedAt: serverTimestamp() 
      }, { merge: true });

      // 2. Sincroniza dados públicos para o Ranking Global
      await setDoc(doc(db, "users", user.uid), {
        name: dataToSave.trainer?.name || "Treinador",
        avatar: dataToSave.trainer?.avatar || 1,
        level: dataToSave.trainer?.level || 1,
        badges: badgeCount,
        powerScore: powerScore,
        caughtCount: Object.keys(dataToSave.caughtData || {}).length,
        worldFlags: dataToSave.worldFlags || [],
        badgesList: dataToSave.badges || [],
        forgedItemsCount: dataToSave.forgedItemsCount || 0,
        bossTotalDamage: dataToSave.bossTotalDamage || 0,
        updatedAt: serverTimestamp()
      }, { merge: true });

      console.log("☁️ Progress and Ranking synced to cloud");
    } catch (e) {
      console.error("Cloud Save Fail:", e);
    }
  }, []);

  const saveBossDamage = useCallback(async (damage) => {
    const user = auth.currentUser;
    if (!user || damage <= 0) return;
    
    try {
      const eventMeta = currentBossEventRef.current;

      // 1. Atualizar recorde global do jogador
      const userRef = doc(db, "bossRankings", user.uid);
      const userSnap = await getDoc(userRef);
      const currentBest = userSnap.exists() ? (userSnap.data().totalDamage || 0) : 0;
      
      if (damage > currentBest) {
        await setDoc(userRef, {
          name: gameState.trainer?.name || "Treinador",
          totalDamage: damage,
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Atualiza Localmente no gameState para exibição no Card
        setGameState(prev => ({
          ...prev,
          bossTotalDamage: Math.max(prev.bossTotalDamage || 0, damage)
        }));
        
        // 2. Registrar histórico na sub-coleção bossEvents
        const historyRef = doc(db, "users", user.uid, "bossEvents", Date.now().toString());
        await setDoc(historyRef, {
          damage: damage,
          timestamp: serverTimestamp()
        });
        
        console.log("🔥 Recorde de Dano no Boss sincronizado!");
      }

      // 2. Registrar maior dano do jogador neste evento de 24h
      if (eventMeta?.eventId) {
        const eventRankRef = doc(db, "worldBossEvents", eventMeta.eventId, "rankings", user.uid);
        const eventRankSnap = await getDoc(eventRankRef);
        const currentEventBest = eventRankSnap.exists() ? (eventRankSnap.data().maxDamage || 0) : 0;

        if (damage > currentEventBest) {
          await setDoc(eventRankRef, {
            uid: user.uid,
            name: gameState.trainer?.name || "Treinador",
            maxDamage: damage,
            bossName: eventMeta.bossName || null,
            bossType: eventMeta.bossType || null,
            eventId: eventMeta.eventId,
            updatedAt: serverTimestamp()
          }, { merge: true });
        }

        await setDoc(doc(db, "worldBossEvents", eventMeta.eventId), {
          eventId: eventMeta.eventId,
          bossName: eventMeta.bossName || null,
          bossType: eventMeta.bossType || null,
          startedAt: eventMeta.startedAt || null,
          activeUntil: eventMeta.activeUntil || null,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (e) {
      console.error("Boss damage save fail:", e);
    }
  }, [gameState.trainer?.name]);

  const debouncedSaveBossDamage = useCallback((damage) => {
    if (bossSaveTimeoutRef.current) clearTimeout(bossSaveTimeoutRef.current);
    bossSaveTimeoutRef.current = setTimeout(() => {
      saveBossDamage(damage);
    }, BOSS_DAMAGE_SAVE_DEBOUNCE_MS);
  }, [saveBossDamage]);

  const debouncedSave = useCallback((data) => {
    if (cloudSaveTimeoutRef.current) clearTimeout(cloudSaveTimeoutRef.current);
    cloudSaveTimeoutRef.current = setTimeout(() => {
      saveToCloud(data);
    }, 5000);
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
      await setDoc(doc(db, "saves", user.uid), { 
        gameState: removeUndefinedFields({ ...gameState, version: gameState.version || APP_VERSION }), 
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
      statusEffect: null, // 'burn'|'poison'|'sleep'|'paralyze'|'confuse'|'freeze'
      statusTarget: 'enemy',
      heal: false,       // se cura o próprio pokémon
      fixedDamage: null, // dano fixo (seismic-toss, dragon-rage, etc)
      ohko: false,       // one-hit KO
      accuracy_change: null, // { target, change }
      evasion_change: null,
      noEffect: false,   // teleport, roar, etc - sem efeito em batalha idle
    };

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
    const moveKey = (moveName || '').toLowerCase().trim();
    // Resolve full move data from dataset for accuracy/power reliability
    const moveData = MOVES[moveKey.replace(/ /g, '-')] || move || {};
    
    const power = move.power || moveData.power || 0;
    if (!power) return 0;

    const level = getBattleLevel(attacker, 100);
    const getStatMult = (stage = 0) => (2 + Math.max(0, stage)) / (2 - Math.min(0, stage));

    const isPhysical = (moveData.category || 'Physical') === 'Physical';
    
    const atkBase = isPhysical ? getEffectiveStat(attacker, 'attack') : getEffectiveStat(attacker, 'spAtk');
    const defBase = isPhysical ? getEffectiveStat(defender, 'defense') : getEffectiveStat(defender, 'spDef');
    
    const atkMult = isPhysical ? getStatMult(attacker.stages?.attack) : getStatMult(attacker.stages?.spAtk);
    const defMult = isPhysical ? getStatMult(defender.stages?.defense) : getStatMult(defender.stages?.spDef);

    const atk = atkBase * atkMult;
    const def = Math.max(1, defBase * defMult);

    const stab = move.type === attacker.type ? 1.5 : 1.0;
    const effectiveness = getTypeEffectiveness(move.type, defender.type);
    
    if (effectiveness === 0) return 0;

    let base = ((((2 * level) / 5 + 2) * power * (atk / def)) / 50 + 2) * stab * effectiveness;
    if (isNaN(base)) base = 1;
    const roll = 0.85 + Math.random() * 0.15;
    
    // Efeitos Passivos de Itens de Boss
    if (attacker.isWorldBoss || defender.isWorldBoss) {
      const playerPokemon = attacker.isWorldBoss ? defender : attacker;
      const playerIsAttacker = !attacker.isWorldBoss;
      const holdItem = playerPokemon.holdItem || playerPokemon.item;
      
      // Busca dados extras da receita se disponível para verificar isBossItem
      const itemData = Object.values(CRAFTING_RECIPES).flat().find(r => r.id === holdItem);
      const isBossItem = itemData?.isBossItem || false;

      // Só ativa bônus se for item de boss OU se não tiver restrição isBossItem explicitly set
      // (os itens antigos não tinham essa flag, mantemos compatibilidade se necessário, mas o plano pede proteção)
      if (isBossItem) {
        if (playerIsAttacker) {
          if (holdItem === 'adrenaline_potion') base *= 1.25;
          if (holdItem === 'penetration_pendant') base *= 1.30;
        } else {
          if (holdItem === 'titan_shield') base *= 0.80;
        }
      }
    }
    
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
  }, []);

  // PROCESSAMENTO DE DROPS
  const processDrops = useCallback((enemy) => {
    const drops = { materials: {}, items: {}, currency: 0 };
    const messages = [];

    // Moedas base
    let coinAmount = Math.max(1, Math.floor(getBattleLevel(enemy, 5) * 0.5 * (enemy.isShiny ? 1.5 : 1)));
    
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

    const recipeFragmentByPokemon = {
      52: 'recipe_amulet_coin',
      53: 'recipe_amulet_coin',
      81: 'recipe_magnet',
      82: 'recipe_magnet',
      58: 'recipe_charcoal',
      59: 'recipe_charcoal',
      60: 'recipe_mystic_water',
      61: 'recipe_mystic_water',
      62: 'recipe_mystic_water',
      66: 'recipe_black_belt',
      67: 'recipe_black_belt',
      123: 'recipe_quick_claw',
      113: 'recipe_lucky_egg',
      92: 'recipe_cleanse_tag',
      93: 'recipe_cleanse_tag',
    };
    const recipeDrop = recipeFragmentByPokemon[Number(enemy.id)];
    if (recipeDrop && Math.random() < (enemy.isShiny ? 0.20 : 0.08)) {
      drops.materials[recipeDrop] = (drops.materials[recipeDrop] || 0) + 1;
      messages.push(`* 1x Fragmento de Receita`);
    }

    if (enemy.drop && enemy.dropChance && Math.random() < (enemy.isShiny ? enemy.dropChance * 3 : enemy.dropChance)) {
      // Aqui determinamos se o drop antigo é material ou item (maioria é material)
      const materialList = [
        'iron_ore', 'apricorn', 'electric_chip', 'moon_stone_shard', 'pink_dust', 'gold_nugget', 'silk', 'feather',
        'mystic_dust', 'normal_essence', 'fire_essence', 'water_essence', 'grass_essence', 'electric_essence',
        'ice_essence', 'fighting_essence', 'poison_essence', 'ground_essence', 'flying_essence', 'psychic_essence',
        'bug_essence', 'rock_essence', 'ghost_essence', 'dragon_essence', 'steel_essence', 'dark_essence',
        'fairy_essence', 'fire_stone_shard', 'water_stone_shard', 'leaf_stone_shard', 'thunder_stone_shard',
        'link_cable_part'
      ];
      const dropData = ITEM_LABELS[enemy.drop] || { icon: '📦', name: enemy.drop.toUpperCase() };
      if (materialList.includes(enemy.drop)) {
        drops.materials[enemy.drop] = (drops.materials[enemy.drop] || 0) + 1;
      } else {
        drops.items[enemy.drop] = (drops.items[enemy.drop] || 0) + 1;
      }
      messages.push(`${dropData.icon} 1x ${dropData.name}`);
    }

    return { drops, messages };
  }, [activeMemberIndex, gameState.activeEffects, gameState.speciesMastery, gameState.team]);

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
      if (p.evolution && p.evolution.id) evolvedIds.add(Number(p.evolution.id));
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
        instanceId: Date.now()
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
        instanceId: Date.now()
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
    
    // ── 2. FILTRO DE LENDÁRIOS ──
    const legendaryIds = [144, 145, 146, 150, 243, 244, 245, 249, 250, 251];
    const todayStr = new Date().toISOString().split('T')[0];

    enemyPool = enemyPool.filter(e => {
      const id = Number(e.id);
      if (legendaryIds.includes(id)) {
        // Verifica se já derrotou o boss correspondente nas flags globais
        const flagMap = {
          144: 'articuno_defeated', 145: 'zapdos_defeated', 146: 'moltres_defeated', 150: 'mewtwo_defeated',
          243: 'raikou_defeated', 244: 'entei_defeated', 245: 'suicune_defeated',
          249: 'lugia_defeated', 250: 'ho_oh_defeated', 251: 'celebi_defeated'
        };
        const flag = flagMap[id];
        
        if (flag && !gameState.worldFlags?.includes(flag)) return false;

        // Raridade reforçada (5% de chance de aparecer se elegível)
        if (Math.random() > 0.05) return false;

        // Verifica limite diário (1 vez por dia por espécie)
        if (gameState.lastLegendarySpawns?.[id] === todayStr) return false;
      }
      return true;
    });

    // ── 2.5 FILTRO DE EVOLUÍDOS (Rotas Iniciais) ──
    const avgLevel = route.enemies?.[0]?.level || 5;
    if (avgLevel <= 15 && enemyPool.length > 1) {
      const filteredPool = enemyPool.filter(e => !evolvedIds.has(Number(e.id)));
      if (filteredPool.length > 0) enemyPool = filteredPool;
    }

    // ── 2.6 BIAS REGIONAL (Johto 70% Gen 2) ──
    const routeRegion = (route.group || '').toLowerCase();
    if (routeRegion.includes('johto') && enemyPool.length > 1) {
      const gen2Pool = enemyPool.filter(e => Number(e.id) >= 152 && Number(e.id) <= 251);
      const otherPool = enemyPool.filter(e => Number(e.id) < 152 || Number(e.id) > 251);
      
      if (gen2Pool.length > 0 && otherPool.length > 0) {
        if (Math.random() < 0.70) {
          enemyPool = gen2Pool;
        } else {
          enemyPool = otherPool;
        }
      }
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
    if (legendaryIds.includes(Number(baseRef.id))) {
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
    
    // Sistema de Maestria: Chance de Shiny
    const pokeId = Number(base.id);
    const masteryCount = (gameState.speciesMastery || {})[pokeId] || (gameState.speciesMastery || {})[base.id] || 0;
    
    // ⛏️” PROTECTED: Spawn Rates
    const shinyRateDivisor = masteryCount >= 200 ? 410 : masteryCount >= 100 ? 1024 : 2048;
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
      .map(m => getMoveData(m.move));

    // Se não tiver golpes, dá pelo menos Investida (Tackle)
    const finalMoves = availableMoves.length > 0 ? availableMoves.slice(-4) : [{ name: 'Investida', power: 40, type: 'Normal', category: 'Physical' }];

    // Atk Mult do Repel
    const atkRepelMult = (effects.activeRepel?.endsAt > now) ? (effects.activeRepel.atkMult || 0.8) : 1.0;

    // Backgrounds para Lendários
    const legendaryBgs = {
      144: '/battle_bg_seafoam.png',
      145: '/battle_bg_power_plant.png',
      146: '/battle_bg_gym_1776863824590.png',
      150: '/battle_bg_cave_1776863810604.png',
      243: '/bg_burned_tower.png',
      244: '/bg_burned_tower.png',
      245: '/bg_lake_of_rage.png',
      249: '/bg_whirl_islands.png',
      250: '/bg_tin_tower.png',
      251: '/bg_ilex_forest.png'
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
      instanceId: Date.now(),
      moves: finalMoves,
      background: specialBg,
      locationName: isBossSpawn ? `Chefe: ${route.name}` : null
    });
    setBattleLog([]);
    isProcessingVictory.current = false;
    // BGM agora gerenciado pelas configuraçííµes
  }, [gameState.currentRoute, gameState.speciesMastery, playBGM, addLog, processedRoutes]);

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
    return () => clearTimeout(timer);
  }, [bossTimer, currentView, currentEnemy?.isWorldBoss]);

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

    debouncedSaveBossDamage(bossDamage);
    
    // O modal de loot segurará a saída da batalha
  }, [bossDamage, debouncedSaveBossDamage, calculateBossLoot]);

  // TICK DE BATALHA
  // ⛏️” PROTECTED: handleBattleTick — NíO EDITAR SEM AUTORIZAÇíO EXPLí CITA
  const handleBattleTick = useCallback(() => {
    const speedMultiplier = [1, 0.6, 0.3][(gameState.settings?.battleSpeed || 1) - 1] || 1;
    
    // REGRA DE EXAUSTAO - INICIO DO TICK
    const myPoke = gameState.team?.[activeMemberIndex];
    const myPokeStamina = gameState.stamina?.[myPoke?.instanceId]?.value ?? 100;

    if (myPokeStamina <= 0 && myPoke?.hp > 0) {
      // Buscar próximo Pokémon com HP > 0 E stamina > 0
      const nextViable = gameState.team.findIndex((p, idx) =>
        idx !== activeMemberIndex &&
        (p?.hp ?? 0) > 0 &&
        (gameState.stamina?.[p?.instanceId]?.value ?? 100) > 0
      );

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
          setCurrentView('defeat_screen');
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
          if (currentEnemy.isInitialRival || currentEnemy.unlocks === 'rival_1_defeated' || currentEnemy.unlockFlag === 'rival_1_defeated' || currentEnemy.unlockFlag === 'rival_lab_defeated') {
            setCurrentView('rival_post_battle');
          } else {
            stopBGM(300);
            sfxDefeat();
            setCurrentView('defeat_screen');
          }
        }
        return prev;
      }

      // AUTO-POCAO
      const autoConfig = prev.autoConfig || { autoPotion: false, hpThreshold: 30, focusPokemonIndex: 0 };
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

      // Turno do Jogador
      const moves = myPoke.moves || [];
      const move = (moves.length > 0 && moves[moveIndex % moves.length]) || { name: 'Investida', power: 40, type: 'Normal', category: 'Physical' };
      
      let updatedTeamFinal = [...updatedTeam];
      let updatedEnemyFinal = { ...updatedEnemy };

      if (move.category === 'Status' || move.power === 0) {
        nextDelay = 600;
        const fx = interpretMoveEffect(move);

        if (fx.noEffect) {
          addLog(`${myPoke.name} usou ${move.name}... sem efeito aqui.`, 'system');

        } else if (fx.ohko) {
          updatedEnemyFinal.hp = 0;
          addLog(`💥 ${myPoke.name} usou ${move.name}! Golpe decisivo!`, 'system');
          addFloat('OHKO!', '#ef4444');

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
          const healed = Math.floor((myPoke.maxHp || 30) * 0.5);
          updatedTeamFinal[activeMemberIndex] = {
            ...updatedTeamFinal[activeMemberIndex],
            hp: Math.min(myPoke.maxHp, myPoke.hp + healed)
          };
          addLog(`💚 ${myPoke.name} usou ${move.name}! Recuperou ${healed} HP!`, 'system');
          addFloat(`+${healed} HP`, '#22c55e');

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
                addFloat(`${arrow} ${statNames[c.stat]||c.stat}`, c.change > 0 ? '#3b82f6' : '#64748b');
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
            addFloat('↑ EVA', '#3b82f6');
          }

          // Status condition
          if (fx.statusEffect) {
                  const statusNames = { burn:'🔥 Queimadura', poison:'☠️ Veneno', sleep:'💤 Sono', paralyze:'⚡ Paralisia', confuse:'💫 Confusão' };
            if (!(updatedEnemyFinal.status || []).includes(fx.statusEffect)) {
              updatedEnemyFinal.status = [...(updatedEnemyFinal.status || []), fx.statusEffect];
              addLog(`${statusNames[fx.statusEffect]||fx.statusEffect}: ${updatedEnemyFinal.name} foi afetado!`, 'enemy');
            } else {
              addLog(`${myPoke.name} usou ${move.name}... mas não surtiu efeito!`, 'system');
            }
          }

          if (fx.statChanges.length === 0 && !fx.accuracy_change && !fx.statusEffect && !fx.evasion_change) {
            addLog(`${myPoke.name} usou ${move.name}!`, 'system');
          }
        }

        setCurrentEnemy(updatedEnemyFinal);
      } else {
        const playerDmg = calcDamage(myPoke, move, updatedEnemyFinal);
        const eff = getTypeEffectiveness(move.type, updatedEnemyFinal.type);
        
        if (playerDmg === 0 && eff > 0) {
          addLog(`${myPoke.name} usou ${move.name}... mas errou!`, 'system');
          addFloat('Errou!', '#94a3b8');
        } else {
          updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - playerDmg);
          
          if (updatedEnemyFinal.isWorldBoss) {
            setBossDamage(prev => {
              const newVal = prev + playerDmg;
              debouncedSaveBossDamage(newVal);
              return newVal;
            });
          }

          addFloat(`-${playerDmg}`, eff > 1 ? '#fbbf24' : eff < 1 ? '#94a3b8' : '#ef4444');
          if (eff > 1) addLog("💥 É super efetivo!", 'system');
          if (eff > 0 && eff < 1) addLog("💢 Não é muito efetivo!", 'system');
          if (eff === 0) addLog("🚫 Não afetou o inimigo!", 'system');
        }
      }

      // Dano de Status (Inimigo)
      if (enemyStatus.includes('poison') || enemyStatus.includes('burn')) {
        const dot = Math.max(1, Math.floor(updatedEnemyFinal.maxHp / 16));
        updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - dot);
        
        if (updatedEnemyFinal.isWorldBoss) {
          setBossDamage(prev => {
            const newVal = prev + dot;
            debouncedSaveBossDamage(newVal);
            return newVal;
          });
        }

        addLog(`☠️ ${updatedEnemyFinal.name} sofreu dano por status!`, 'enemy');
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
              const fxE = interpretMoveEffect(enemyMove);

              if (fxE.noEffect || fxE.heal) {
                if (fxE.heal) {
                  const healed = Math.floor((updatedEnemyFinal.maxHp || 30) * 0.5);
                  updatedEnemyFinal.hp = Math.min(updatedEnemyFinal.maxHp, updatedEnemyFinal.hp + healed);
                  addLog(`💚 ${updatedEnemyFinal.name} usou ${enemyMove.name}! Recuperou ${healed} HP!`, 'enemy');
                }
              } else if (fxE.ohko) {
                updatedTeamFinal[activeMemberIndex].hp = 0;
                addLog(`💥 ${updatedEnemyFinal.name} usou ${enemyMove.name}! Golpe decisivo!`, 'enemy');
              } else if (fxE.fixedDamage !== null) {
                let dmgE = 0;
                if (fxE.fixedDamage === 'level') dmgE = getBattleLevel(updatedEnemyFinal, 5);
                else if (fxE.fixedDamage === 'psywave') dmgE = Math.floor(getBattleLevel(updatedEnemyFinal, 5) * (0.5 + Math.random()));
                else if (fxE.fixedDamage === 'half_hp') dmgE = Math.max(1, Math.floor(updatedTeamFinal[activeMemberIndex].hp / 2));
                else dmgE = fxE.fixedDamage;

                updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - dmgE);
                addLog(`${updatedEnemyFinal.name} usou ${enemyMove.name}! ${dmgE} de dano!`, 'enemy');
                addFloat(`-${dmgE}`, '#ef4444');
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
                  const statusNames = { burn:'🔥 Queimadura', poison:'☠️ Veneno', sleep:'💤 Sono', paralyze:'⚡ Paralisia', confuse:'💫 Confusão' };
                  const myStatusList = updatedTeamFinal[activeMemberIndex].status || [];
                  if (!myStatusList.includes(fxE.statusEffect)) {
                    updatedTeamFinal[activeMemberIndex].status = [...myStatusList, fxE.statusEffect];
                    addLog(`${statusNames[fxE.statusEffect]||fxE.statusEffect}: ${updatedTeamFinal[activeMemberIndex].name} foi afetado!`, 'system');
                  }
                }
              }
            } else {
              const enemyDmgRaw = calcDamage(updatedEnemyFinal, enemyMove, updatedTeamFinal[activeMemberIndex]);
              const effE = getTypeEffectiveness(enemyMove.type, updatedTeamFinal[activeMemberIndex].type);
              
              if (enemyDmgRaw === 0 && effE > 0) {
                 addLog(`${updatedEnemyFinal.name} usou ${enemyMove.name}... mas errou!`, 'enemy');
              } else {
                const enemyDmg = Math.max(1, Math.floor(enemyDmgRaw * 0.75));
                updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - enemyDmg);
                addFloat(`-${enemyDmg}`, '#ef4444');
                if (effE > 1) addLog("💥 É super efetivo!", 'enemy');
                if (effE > 0 && effE < 1) addLog("💢 Não é muito efetivo!", 'enemy');
                if (effE === 0) addLog("🚫 Não afetou seu Pokemon!", 'enemy');
              }
            }
          }
        }
        }
      }

      // Dano de Status (Jogador)
      if (myStatus.includes('poison') || myStatus.includes('burn')) {
        const dot = Math.max(1, Math.floor(updatedTeamFinal[activeMemberIndex].maxHp / 16));
        updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - dot);
        addLog(`☠️ ${myPoke.name} sofreu dano por status!`, 'system');
      }

      // SISTEMA DE EXAUSTAO
      const STAMINA_DRAIN  = 0.4;   // % perdida por tick
      const EXHAUSTION_DMG = 0.02;  // % do maxHp perdida por tick quando exausto
      const autoStamEnabled = prev.autoConfig?.autoStamina;
      // PROTECTED: Sistema de Exaustao - NAO EDITAR SEM AUTORIZACAO EXPLICITA
      const FEED_THRESHOLD = prev.autoConfig?.autoStaminaThreshold || 30;

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
          if (restoreData?.cureStatus) {
            updatedTeamFinal[activeMemberIndex].status = [];
            addLog(`${myPoke.name} foi curado de problemas de status!`, 'system');
          } else if (restoreData?.cureStatus && Array.isArray(restoreData.cureStatus)) {
             const newStatus = updatedTeamFinal[activeMemberIndex].status.filter(s => !restoreData.cureStatus.includes(s));
             if (newStatus.length < updatedTeamFinal[activeMemberIndex].status.length) {
               updatedTeamFinal[activeMemberIndex].status = newStatus;
                addLog(`${myPoke.name} recuperou-se!`, 'system');
             }
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
      return { 
        ...prev, 
        team: updatedTeamFinal,
        inventory: finalInventory,
        stamina: {
          ...prev.stamina,
          [myPoke.instanceId]: staminaEntry
        }
      };
    });

    setMoveIndex(m => m + 1);
    return nextDelay;
  }, [currentEnemy, activeMemberIndex, moveIndex, calcDamage, addFloat, setCurrentEnemy]);

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
          const newPoke = { 
            ...currentEnemy, 
            id: Number(currentEnemy.id), 
            hp: currentEnemy.maxHp, 
            xp: 0, 
            instanceId: Date.now(),
            capturedRegion: prev.activeRegion || 'kanto',
            stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 }
          };
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
                  if (currentEnemy.isShiny && !p.isShiny) {
                    addLog(`✨ Upgrade Shiny: Seu ${p.name} agora é Brilhante!`, 'system');
                    return { ...p, isShiny: true, hp: p.maxHp };
                  }
                }
                return p;
              });
              return { newList, updated };
            };
            let { newList: teamUpdate } = findAndReplace(prev.team);
            let { newList: pcUpdate } = findAndReplace(prev.pc || []);
            setTimeout(() => spawnEnemy(), 1000);
            return { ...prev, inventory: newInventory, speciesMastery: newMastery, caughtData: newCaughtData, team: teamUpdate, pc: pcUpdate, ...questUpdate };
          }

          // Primeira Captura: SEMPRE envia para o PC (Blindagem da Equipe)
          const newPC = [...(prev.pc || []), newPoke];
          addLog(`${newPoke.name} foi enviado para o PC! Retire-o manualmente no menu de equipe se desejar.`, 'system');

          setTimeout(() => spawnEnemy(), 1000);
          return { ...prev, inventory: newInventory, pc: newPC, caughtData: newCaughtData, speciesMastery: newMastery, ...questUpdate };
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
          if (restoreData.cureStatus) {
            updatedPoke.status = [];
          } else if (restoreData.cureStatus && Array.isArray(restoreData.cureStatus)) {
            updatedPoke.status = activePoke.status.filter(s => !restoreData.cureStatus.includes(s));
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
      
      // ── 3. EFEITOS TEMPORÁRIOS (TIMED EFFECTS) ──────────────────────────
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
      .map(m => getMoveData(m.move));
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
      unlockFlag: battleData.unlockFlag,
      spawnTime: Date.now(),
      opponentTeam: battleData.team,
      opponentTeamIndex: 0,
      background: battleData.background || null,
      locationName: battleData.location || battleData.name,
    });
    setCurrentView('battles');
    // BGM agora gerenciado pelas configurações
    addLog(`🚀 DESAFIO: ${battleData.name} iniciou a batalha!`, 'system');
    isProcessingVictory.current = false;
  }, [setCurrentEnemy, setCurrentView, addLog, POKEDEX, MOVES]);

  const handleChallenge = useCallback((battleData, type) => {
    if (type === 'boss' || type === 'boss-direct') {
      const now = Date.now();
      const activeUntil = Number(battleData.activeUntil || 0);
      if (activeUntil && activeUntil <= now) {
        addLog('O ciclo de 24h deste World Boss terminou. Abra a aba Boss novamente para receber o novo desafio.', 'system');
        setVsInitialTab('boss');
        setCurrentView('vs');
        return;
      }

      if (type === 'boss') {
        const currentTeamIds = (gameState.team || []).slice(0, 6).map(p => p.instanceId || `${p.id}-${p.name}`);
        setBossTeamSelection(currentTeamIds);
        setPendingBossBattle(battleData);
        return;
      }

      setBossDamage(0);
      const teamMember = battleData.mainPokemon || (battleData.team && battleData.team.length > 0 ? battleData.team[0] : null);
      if (!teamMember) return;

      const base = POKEDEX[teamMember.id];
      if (!base) return;

      const lvl = 100; 
      const hpMult = 500; // HP massivo para boss: 500x o HP base
      const statMult = 2.0; // +100% em ATK/DEF para tornar o boss realmente intimidador

      const baseHp = Math.ceil((((2 * (base.maxHp || base.hp || 50) * lvl) / 100) + lvl + 10));
      const maxHp = baseHp * hpMult;
      const getStat = (b) => Math.ceil((((2 * (b || 10) * lvl) / 100) + 5) * statMult);

      const boss = {
        ...base,
        instanceId: `worldboss-${Date.now()}`,
        level: '???',
        displayLevel: '???',
        battleLevel: lvl,
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

      const finalMoves = (base.learnset || []).slice(-4).map(m => getMoveData(m.move));

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
        bossEventId: battleData.eventId,
        bossStartedAt: battleData.startedAt,
        bossActiveUntil: battleData.activeUntil,
        background: battleData.background,
        locationName: "Fenda Dimensional",
        spawnTime: Date.now(),
        opponentTeam: [boss],
        opponentTeamIndex: 0
      });
      currentBossEventRef.current = {
        eventId: battleData.eventId || `local-${Date.now()}`,
        bossName: battleData.name || base.name,
        bossType: battleData.bossType,
        startedAt: battleData.startedAt || now,
        activeUntil: battleData.activeUntil || (now + BOSS_EVENT_DURATION_MS),
      };
      setCurrentView('battles');
      addLog(`⚠️ ALERTA: ${battleData.name} emergiu da fenda! Evento ativo por 24h.`, 'system');
      setBossTimer(Math.min(BOSS_ATTEMPT_DURATION_SECONDS, Math.max(1, Math.floor(((battleData.activeUntil || (now + BOSS_EVENT_DURATION_MS)) - now) / 1000))));
      return;
    }
    
    // Fallback para lutas de rivais de rota
    startKeyBattle(battleData);
  }, [POKEDEX, MOVES, setCurrentEnemy, setCurrentView, addLog, startKeyBattle, gameState.team]);

  const getBossTeamKey = useCallback((pokemon) => pokemon?.instanceId || `${pokemon?.id}-${pokemon?.name}`, []);

  const confirmBossTeamSelection = useCallback(() => {
    if (!pendingBossBattle || bossTeamSelection.length !== 6) return;
    setGameState(prev => {
      const allPokemon = [...(prev.team || []), ...(prev.pc || [])];
      const selectedKeys = new Set(bossTeamSelection);
      const selectedTeam = bossTeamSelection
        .map(key => allPokemon.find(p => getBossTeamKey(p) === key))
        .filter(Boolean);
      const rest = allPokemon.filter(p => !selectedKeys.has(getBossTeamKey(p)));
      return {
        ...prev,
        team: selectedTeam,
        pc: rest,
      };
    });
    const battle = pendingBossBattle;
    setPendingBossBattle(null);
    setBossTeamSelection([]);
    handleChallenge(battle, 'boss-direct');
  }, [pendingBossBattle, bossTeamSelection, getBossTeamKey, handleChallenge]);

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
      .map(m => getMoveData(m.move));
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
  }, [setCurrentEnemy, setCurrentView, addLog, POKEDEX, MOVES, gameState]);

  const handleCraft = (recipe) => {
    setGameState(prev => {
      // 1. Verificar se tem todos os materiais e dinheiro
      const hasMaterials = Object.entries(recipe.cost).every(([material, amount]) => {
        if (material === 'currency') return prev.currency >= amount;
        return (prev.inventory.materials[material] || 0) >= amount;
      });

      if (!hasMaterials) {
        addLog("💰 Materiais ou Moedas insuficientes!", 'system');
        return prev;
      }

      // 2. Deduzir os custos
      const newMaterials = { ...prev.inventory.materials };
      let newCurrency = prev.currency;

      Object.entries(recipe.cost).forEach(([material, amount]) => {
        if (material === 'currency') {
          newCurrency -= amount;
        } else {
          newMaterials[material] -= amount;
        }
      });

      // 3. Adicionar o item ao inventário e atualizar contador de forja
      const newItems = { ...prev.inventory.items };
      newItems[recipe.id] = (newItems[recipe.id] || 0) + 1;

      addLog(`✨ Você fabricou: ${recipe.name}!`, 'drop');

      return {
        ...prev,
        currency: newCurrency,
        forgedItemsCount: (prev.forgedItemsCount || 0) + 1,
        inventory: {
          ...prev.inventory,
          materials: newMaterials,
          items: newItems
        }
      };
    });
  };

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
        if (pokeData?.evolution && checkEvolutionEligibility(pokeData.evolution, prev)) {
          setEvolutionPending({ ...p, teamIndex: location === 'team' ? pokemonIndex : null, pcIndex: location === 'pc' ? pokemonIndex : null });
          return { ...prev, inventory: newInventory };
        } else {
           addLog(`✨ ${p.name} não pode evoluir mais.`, 'system');
           return prev;
        }
      }

      const newList = [...pokemonList];
      newList[pokemonIndex] = p;

      return { ...prev, inventory: newInventory, [location]: newList };
    });
  }, [addLog, setEvolutionPending]);

  // PROTECTED: handleStartExpedition - NAO EDITAR SEM AUTORIZACAO EXPLICITA
  const handleStartExpedition = useCallback((biomeId, team) => {
    const biome = EXPEDITION_BIOMES[biomeId];
    if (!biome || !team.length) return;
    const duration = calcExpeditionDuration(team, biome);
    const now = Date.now();
    setGameState(prev => {
      const teamIds = new Set(team.map(p => p.instanceId));
      const newPC = (prev.pc || []).filter(p => !teamIds.has(p.instanceId));
      return {
        ...prev,
        pc: newPC,
        expeditions: {
          ...(prev.expeditions || {}),
          [biomeId]: {
            biomeId,
            team,
            startedAt: now,
            endsAt: now + duration,
            duration,
          },
        },
      };
    });
    addLog(`🚢 Expedição para ${biome.name} iniciada! Duração: ~${Math.floor(duration / 60000)}min`, 'system');
  }, [addLog]);

  const handleClaimExpedition = useCallback((biomeId) => {
    setGameState(prev => {
      const exp = prev.expeditions?.[biomeId];
      if (!exp || Date.now() < exp.endsAt) return prev;
      const biome = EXPEDITION_BIOMES[biomeId];
      notify({ type: 'expedition', title: 'Expedição concluída!', message: `${biome.name} retornou com itens!` });
      const duration = Date.now() - exp.startedAt;
      const rawDrops = calcExpeditionDrops(exp.team, biome, duration);
      // Candies são exclusivos do farm nas rotas — remover das expedições
      const drops = Object.fromEntries(
        Object.entries(rawDrops).filter(([key]) => !key.includes('_candy'))
      );
      const teamWithXP = calcExpeditionXP(exp.team, biome, duration);
      const returnedTeam = teamWithXP.map(p => ({
        ...p,
        xp: (p.xp || 0) + (p.xpGained || 0),
      }));
      const newMaterials = { ...prev.inventory.materials };
      for (const [item, qty] of Object.entries(drops)) {
        newMaterials[item] = (newMaterials[item] || 0) + qty;
      }
      const newExpeditions = { ...(prev.expeditions || {}) };
      delete newExpeditions[biomeId];
      const dropSummary = Object.entries(drops)
        .map(([k, v]) => `${v}x ${k}`)
        .join(', ');
      addLog(
        `📦 Expedição em ${biome.name} concluída! Coletou: ${dropSummary || 'nada desta vez'}`,
        'drop'
      );
      teamWithXP.forEach(p => {
        if (p.xpGained > 0)
          addLog(`✨ ${p.name} ganhou ${p.xpGained} XP na expedição!`, 'system');
      });
      return {
        ...prev,
        pc: [...(prev.pc || []), ...returnedTeam],
        inventory: { ...prev.inventory, materials: newMaterials },
        expeditions: newExpeditions,
      };
    });
  }, [addLog]);

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

  // Disparar modal ao entrar em nova rota
  useEffect(() => {
    const routeId = gameState.currentRoute;
    const route = processedRoutes[routeId];
    const config = gameState.autoCaptureConfig;

    if (
      config?.enabled &&
      route?.type === 'farm' &&
      route?.enemies?.length > 0 &&
      !config?.shownRoutes?.includes(routeId)
    ) {
      const timer = setTimeout(() => setShowAutoCaptureModal(true), 800);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentRoute, gameState.autoCaptureConfig, processedRoutes]);

  useEffect(() => {
    const flags = gameState.worldFlags || [];
    if (flags.includes('kanto_champion_modal_pending')) {
      setShowKantoChampionModal(true);
    } else if (
      (flags.includes('champion') || flags.includes('johto_champion')) &&
      !flags.includes('hoenn_started') &&
      !flags.includes('hoenn_unlock_modal_shown') &&
      currentView !== 'johto_intro' &&
      currentView !== 'hoenn_intro'
    ) {
      setShowHoennUnlockModal(true);
    }
  }, [gameState.worldFlags, currentView]);

  useEffect(() => {
    const flags = gameState.worldFlags || [];
    if (gameState.currentRoute === 'viridian_forest' && !flags.includes('ball_forge_tutorial_shown')) {
      setShowBallForgeTutorial(true);
    }
  }, [gameState.currentRoute, gameState.worldFlags]);

  const closeBallForgeTutorial = useCallback(() => {
    setShowBallForgeTutorial(false);
    setGameState(prev => ({
      ...prev,
      worldFlags: [...(prev.worldFlags || []), 'ball_forge_tutorial_shown'].filter((v, i, a) => a.indexOf(v) === i),
    }));
  }, []);
  // ————————————————————————————————————————————————————————————

  // Comprar a casa
  // PROTECTED: handleBuyHouse - NAO EDITAR SEM AUTORIZACAO EXPLICITA
  const handleBuyHouse = useCallback(() => {
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
  }, [addLog]);



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
      const oldRegion = prev.activeRegion || 'kanto';
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

  // Plantar
  const handlePlant = useCallback((slotIndex, plantId) => {
    setGameState(prev => {
      const plant        = PLANTABLE_ITEMS[plantId];
      const caretakers   = prev.house?.caretakers || [];
      const bonus        = calcCombinedCaretakerBonus(caretakers);
      const growthTime   = calcGrowthTime(plant, bonus);

      // Descontar coins do custo da semente
      if ((prev.currency || 0) < plant.cost) {
        addLog(`💰 Coins insuficientes para plantar ${plant.name}!`, 'system');
        return prev;
      }
      if ((prev.inventory?.items?.[plant.seed] || 0) <= 0) {
        addLog(`Sem semente de ${plant.name} para plantar!`, 'system');
        return prev;
      }

      const newSlots = [...(prev.house?.slots || [])];
      newSlots[slotIndex] = { plantId, plantedAt: Date.now(), growthTime };
      const newItems = { ...(prev.inventory?.items || {}) };
      newItems[plant.seed] = Math.max(0, (newItems[plant.seed] || 0) - 1);

      addLog(`🌱 ${plant.name} plantado! Pronto em ${Math.floor(growthTime / 60000)} min.`, 'system');
      return {
        ...prev,
        currency: prev.currency - plant.cost,
        inventory: { ...prev.inventory, items: newItems },
        house: { ...prev.house, slots: newSlots },
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
      for (const [item, qty] of Object.entries(drops)) {
        newMaterials[item] = (newMaterials[item] || 0) + qty;
      }

      const dropSummary = Object.entries(drops).map(([k, v]) => `${v}x ${k}`).join(', ');
      addLog(`🧺 Colheu ${plant.name}: ${dropSummary}`, 'drop');

      return {
        ...prev,
        house: { ...prev.house, slots: newSlots },
        inventory: { ...prev.inventory, materials: newMaterials },
      };
    });
  }, [addLog]);

  // Comprar expansão de slots
  const handleBuySlot = useCallback((expansion) => {
    setGameState(prev => {
      if ((prev.currency || 0) < expansion.cost) return prev;
      addLog(`🛠️ Jardim expandido para ${expansion.totalSlots} canteiros!`, 'system');
      return {
        ...prev,
        currency: prev.currency - expansion.cost,
        house: { ...prev.house, totalSlots: expansion.totalSlots },
      };
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
    if (battleData && battleData.team) {
      // Logica de Rival Regional (Johto/Hoenn)
      let enemyTeam = [...battleData.team];
      if (battleData.id?.startsWith('johto_rival')) {
        const myJohtoStarter = gameState.selectedStarters?.johto;
        if (myJohtoStarter) {
          const johtoRivalMap = { 152: 155, 155: 158, 158: 152 }; // Chikorita -> Cyndaquil, etc.
          const advantagedStarterId = johtoRivalMap[myJohtoStarter];
          if (advantagedStarterId) {
             const startersIds = [152, 153, 154, 155, 156, 157, 158, 159, 160];
             enemyTeam = enemyTeam.filter(p => !startersIds.includes(Number(p.id)));
             const baseLevel = battleData.team[0]?.level || 5;
             
             // Determina a evolução correta baseada no nível
             let finalId = advantagedStarterId;
             if (baseLevel >= 32) finalId += 2; // Meganium/Typhlosion/Feraligatr
             else if (baseLevel >= 16) finalId += 1; // Bayleef/Quilava/Croconaw

             const rivalStarter = createRivalStarter(finalId, baseLevel);
             enemyTeam.push(rivalStarter);
          }
        }
      } else if (battleData.id?.startsWith('hoenn_rival')) {
        const myHoennStarter = gameState.selectedStarters?.hoenn;
        if (myHoennStarter) {
          const hoennRivalMap = { 252: 255, 255: 258, 258: 252 }; // Treecko -> Torchic, etc.
          const advantagedStarterId = hoennRivalMap[myHoennStarter];
          if (advantagedStarterId) {
             const startersIds = [252, 253, 254, 255, 256, 257, 258, 259, 260];
             enemyTeam = enemyTeam.filter(p => !startersIds.includes(Number(p.id)));
             const baseLevel = battleData.team[0]?.level || 5;

             // Determina a evolução correta baseada no nível
             let finalId = advantagedStarterId;
             if (baseLevel >= 36) finalId += 2; // Sceptile/Blaziken/Swampert
             else if (baseLevel >= 16) finalId += 1; // Grovyle/Combusken/Marshtomp

             const rivalStarter = createRivalStarter(finalId, baseLevel);
             enemyTeam.push(rivalStarter);
          }
        }
      } else if (battleData.id?.startsWith('sinnoh_rival')) {
        const mySinnohStarter = gameState.selectedStarters?.sinnoh;
        if (mySinnohStarter) {
          const sinnohRivalMap = { 387: 390, 390: 393, 393: 387 }; // Turtwig -> Chimchar, etc.
          const advantagedStarterId = sinnohRivalMap[mySinnohStarter];
          if (advantagedStarterId) {
             const startersIds = [387, 388, 389, 390, 391, 392, 393, 394, 395];
             enemyTeam = enemyTeam.filter(p => !startersIds.includes(Number(p.id)));
             const baseLevel = battleData.team[0]?.level || 5;

             let finalId = advantagedStarterId;
             if (baseLevel >= 34) finalId += 2; // Torterra/Infernape/Empoleon
             else if (baseLevel >= 16) finalId += 1; // Grotle/Monferno/Prinplup

             const rivalStarter = createRivalStarter(finalId, baseLevel);
             enemyTeam.push(rivalStarter);
          }
        }
      }

      const bossPoke = enemyTeam[0];
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
        instanceId: Date.now(),
        spawnTime: Date.now(),
        opponentTeam: enemyTeam,
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
      background: fixPath('/battle_bg_lab_1776866008842.png'),
      unlockFlag: 'rival_lab_defeated',
      isInitialRival: true,
      instanceId: Date.now()
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
          .map(m => getMoveData(m.move));
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

    const { drops, messages } = processDrops(currentEnemy);
    const trainerReward = currentEnemy.trainerReward || 0;
    const adjustedTrainerReward = currentEnemy.isTrainer && trainerReward > 0
      ? Math.max(1, Math.floor(trainerReward * TRAINER_REWARD_MULTIPLIER))
      : 0;
    // ⛏️” PROTECTED: Fórmula XP — NíO ALTERAR DIVISOR SEM AUTORIZAÇíO
    const enemyBattleLevel = getBattleLevel(currentEnemy, 1);
    const baseXpGain = Math.floor((enemyBattleLevel * 1.5 * (POKEDEX[Number(currentEnemy.id)]?.baseXp || 50)) / 7);

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
        const regionalBadgesForLog = newBadges.filter(b => 
          activeRegion === 'kanto' ? BADGE_IDS.includes(b) :
          activeRegion === 'johto' ? JOHTO_BADGE_IDS.includes(b) :
          activeRegion === 'hoenn' ? HOENN_BADGE_IDS.includes(b) :
          false
        );
        const newShare = regionalBadgesForLog.length * 10;
        addLog(`✨ Exp Share aumentado! Sua equipe agora recebe ${newShare}% da experiência compartilhada!`, 'system');
        
        // Show Oak House modal after 1st badge
        if (newBadges.length === 1 && !prev.worldFlags?.includes('house_owned') && !prev.worldFlags?.includes('oak_house_shown')) {
          setTimeout(() => setShowOakHouseModal(true), 2000);
          tempWorldFlags.push('oak_house_shown');
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
        newFlags.push('kanto_champion_modal_pending');
        setTimeout(() => setShowKantoChampionModal(true), 1200);
      }

      // Gatilho para Hoenn após vencer a Liga de Johto
      if (currentEnemy.unlockFlag === 'johto_champion' && !prev.worldFlags?.includes('johto_champion')) {
        newFlags.push('johto_champion');
        setTimeout(() => setShowHoennUnlockModal(true), 1500);
      }

      const finalBadges = newBadges; // Para facilitar uso abaixo
      const activeRegionForExp = prev.activeRegion || 'kanto';
      const badgesCount = getRegionBadgeCount({ badges: finalBadges, worldFlags: newFlags }, activeRegionForExp);

      const now = Date.now();
      const effects = prev.activeEffects || {};
      
      const xpMult = (effects.activeLuckyEgg?.endsAt > now ? (effects.activeLuckyEgg.xpMult || 1.5) : 1.0) * 
                    (effects.activeSootheBell?.endsAt > now ? (effects.activeSootheBell.xpMult || 1.2) : 1.0);

      const newTeam = prev.team.map((p, i) => {
        const isLead = (i === activeMemberIndex);
        let xpToAdd = 0;

        const levelDiff = (p.level || 1) - enemyBattleLevel;
        let levelScalingMult = 1.0;

        // Regras de Anti-Overlevel (Mesmo padrão de Kanto aplicado a Johto)
        const totalBadges = finalBadges.length;
        const johtoStarted = newFlags.includes('johto_started');
        // Fase de Ginásios: < 8 em Kanto OU < 16 em Johto
        const isGymPhase = (!johtoStarted && totalBadges < 8) || (johtoStarted && totalBadges < 16);

        if (!isGymPhase) {
          // Fase Pós-Liga (Kanto ou Johto): Limite Suave
          if (levelDiff >= 40) levelScalingMult = 0.15;
          else if (levelDiff >= 30) levelScalingMult = 0.30;
          else if (levelDiff >= 20) levelScalingMult = 0.50;
        } else if (levelDiff >= 20) {
          // Fase de Ginásios: Limite Estrito
          levelScalingMult = 0.001;
        }

        if (isLead && p.hp > 0) {
          xpToAdd = Math.floor(baseXpGain * xpMult * levelScalingMult);
        } else if (p.hp > 0 && effects.activeExpShare?.endsAt > now) {
          xpToAdd = Math.floor(baseXpGain * (effects.activeExpShare.xpShare || 0.5) * xpMult * levelScalingMult);
        } else if (p.hp > 0 && badgesCount > 0) {
          // Exp Share Passivo: 0% a 50% (6.25% por insignias de 1 a 8)
          const shareMult = Math.min(0.5, badgesCount * 0.0625);
          xpToAdd = Math.floor(baseXpGain * shareMult * xpMult * levelScalingMult);
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

        const maxLevel = getCurrentLevelCap(prev);
        const isLevelCapped = gameState.settings?.levelCap !== false && (p.level || 5) >= maxLevel;

          if (pokeData?.learnset) {
            const movesToLearn = pokeData.learnset.filter(l => l.level === newLevel);
            movesToLearn.forEach(learn => {
              const moveObj = getMoveData(learn.move);
              const moveLabel = getMoveLabel(learn.move);
              if (moveObj && !newLearnedMoves.some(m => m.name === moveLabel)) {
                const finalMoveObj = { ...moveObj, name: moveLabel };
                newLearnedMoves.push(finalMoveObj);
                if (newMoves.length < 4 && !newMoves.some(m => m.name === finalMoveObj.name)) {
                  newMoves.push(finalMoveObj);
                  addLog(`( ${p.name} aprendeu ${finalMoveObj.name}!`, 'system');
                } else {
                  addLog(`✨ ${p.name} aprendeu ${finalMoveObj.name}! (Salvo na Memória)`, 'system');
                }
              }
            });
          }

           if (pokeData?.evolution?.level && !pokeData.evolution.item && newLevel >= pokeData.evolution.level && (checkEvolutionEligibility(pokeData.evolution, prev))) {
             setEvolutionPending({ ...p, level: newLevel, teamIndex: i });
          }

          const shinyMult = p.isShiny ? 1.2 : 1.0;
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

      return {
        ...prev,
        currency: (prev.currency || 0) + (drops.currency || 0) + adjustedTrainerReward,
        inventory: newInventory,
        team: newTeam,
        worldFlags: [...newFlags, ...tempWorldFlags].filter((v, i, a) => a.indexOf(v) === i),
        badges: newBadges,
        gymDefeatCounts: newGymCounts
      };
    });

    messages.forEach(m => addLog(m, 'drop'));
    if (currentEnemy.isTrainer && adjustedTrainerReward) {
      addLog(` 🏆 ${currentEnemy.trainerName} derrotado! +${adjustedTrainerReward} coins`, 'system');
    }
    if (currentEnemy.isRocket) addLog('🚀 Grunt da Equipe Rocket derrotado!', 'system');
    if (currentEnemy.isShiny) addLog('✨ Pokémon shiny derrotado!', 'system');

    sessionRef.current.kills += 1;
    sessionRef.current.coins += (drops.currency || 0) + adjustedTrainerReward;
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
                      if (currentEnemy.isShiny && !p.isShiny) {
                        addLog(`✨ Upgrade Shiny: Seu ${p.name} agora é Brilhante!`, 'system');
                        return { ...p, isShiny: true, hp: p.maxHp };
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
                    ...questUpdate 
                  };
                } else {
                  // Primeira Captura
                  const newPoke = { ...currentEnemy, id: Number(currentEnemy.id), hp: currentEnemy.maxHp, xp: 0, instanceId: Date.now(), capturedRegion: prev.activeRegion || 'kanto' };
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
      } else if (currentEnemy.unlockFlag === 'johto_rival_1_defeated') {
        setCurrentView('prof_elm_starters_announcement');
      } else if (currentEnemy.unlockFlag === 'hoenn_rival_1_defeated') {
        setCurrentView('prof_birch_announcement');
      } else if (currentEnemy.unlockFlag === 'sinnoh_rival_1_defeated') {
        setCurrentView('prof_rowan_announcement');
      } else if (currentEnemy.isInitialRival) {
        setCurrentView('rival_post_battle');
      } else if (currentEnemy.isGymLeader || currentEnemy.isBoss) {
        handleGoToCity();
      } else {
        spawnEnemy();
      }
    }, 600);
  }, [currentEnemy?.hp]);

  const renderView = (props = {}) => {
    if (loading) return (
      <div className="h-full flex items-center justify-center bg-[#0F2D3A] text-white font-black italic text-2xl uppercase tracking-tighter animate-pulse">
        <span>Carregando Dados...</span>
      </div>
    );
    
    if (!user) return <AuthScreen onAuthSuccess={() => {}} installPrompt={installPrompt} handleInstallPWA={handleInstallPWA} isIOS={isIOS} isStandalone={isStandalone} />;

    switch(currentView) {
      case 'landing': {
        const hasSave = (gameState.team && gameState.team.length > 0);
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
              await setDoc(doc(db, "saves", u.uid), { 
                gameState: freshState, 
                updatedAt: serverTimestamp(),
                resetAt: serverTimestamp()
              }, { merge: false }); // merge: false ensures we overwrite EVERYTHING
              console.log("Cloud reset successful");
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
                
                {/* ⛔ PROTECTED: Botões Landing — NíO ALTERAR TAMANHO, PADDING OU ESTILO SEM AUTORIZAÇíO */}
                <div style={{width:'100%', display:'flex', flexDirection:'column', gap:'16px', padding:'0'}}>
                  {hasSave && (
                    <>
                      {/* ⛔ PROTECTED: Botão CONTINUAR JORNADA */}
                      <button 
                        onClick={() => setCurrentView('city')}
                        style={{width:'100%', padding:'20px', borderRadius:'24px', fontWeight:'900', fontSize:'18px', textTransform:'uppercase', letterSpacing:'2px', background:'white', color:'#1d4ed8', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.3)', cursor:'pointer'}}
                      >
                        CONTINUAR JORNADA
                      </button>
                    </>
                  )}
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
                       }}
                       className="animate-bounce"
                     >
                       📥 {isIOS ? 'Como Instalar (iOS)' : (installPrompt ? 'Instalar Aplicativo (PWA)' : 'Preparando instalação...')}
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
                     }}
                   >
                     🏆 Ranking Global
                   </button>

                   {showRanking && <RankingModal onClose={() => setShowRanking(false)} />}

                   {/* ⛔ PROTECTED: Botão REINICIAR JORNADA */}
                   <button
                     onClick={() => { showConfirm({ type:'danger', title:'Reiniciar Jornada', message:'Isso apagará todo seu progresso. Tem certeza?', confirmLabel:'Sim, reiniciar', cancelLabel:'Cancelar', onConfirm:() => { closeConfirm(); startNewJourney(); }, onCancel:closeConfirm }); }}
                     style={{width:'100%', padding:'20px', borderRadius:'24px', fontWeight:'900', fontSize:'18px', textTransform:'uppercase', letterSpacing:'2px', background:'rgba(59,130,246,0.2)', color:'white', border:'2px solid rgba(255,255,255,0.3)', boxShadow:'0 4px 12px rgba(0,0,0,0.3)', cursor:'pointer'}}
                   >
                     REINICIAR JORNADA
                   </button>
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
        const labBg = fixPath('/battle_bg_lab_1776866008842.png');

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

              <button onClick={() => {
                if (isLastStep) {
                  if (!gameState.trainer?.name || gameState.trainer.name.length < 2) {
                    showConfirm({ title: 'Nome Inválido', message: 'Diga-me seu nome para continuarmos!', onConfirm: closeConfirm });
                    return;
                  }
                  setCurrentView('trainer_creation');
                } else {
                  setIntroStep(s => s + 1);
                }
              }} style={{
                width: '100%', padding: '18px',
                borderRadius: '16px',
                background: '#16a34a',
                color: 'white', fontWeight: 900,
                fontSize: '16px', textTransform: 'uppercase',
                letterSpacing: '2px', border: 'none', cursor: 'pointer',
                minHeight: '64px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>{isLastStep ? 'Tudo Pronto!' : 'PRÓXIMO ▶'}</button>
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
          <div style={{paddingTop:'24px', display:'flex', flexDirection:'column', alignItems:'center', height:'100%', background:'#f8fafc', overflowY:'auto'}}>

            {/* Título com espaço do header */}
            <div style={{textAlign:'center', marginBottom:'20px', padding:'0 16px'}}>
              <h2 style={{fontSize:'22px', fontWeight:900, textTransform:'uppercase', fontStyle:'italic', color:'#1e293b', lineHeight:1.1, margin:0}}>
                ESCOLHA SEU PARCEIRO
              </h2>
              <p style={{fontSize:'11px', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'2px', marginTop:'6px', margin:0}}>
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
                      <span style={{fontSize:'11px', color:'#94a3b8', fontWeight:700}}>
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
               <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
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
                                 instanceId: Date.now(), 
                                 status: [],
                                 stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 }
                               };

                              setGameState(prev => ({ 
                                ...prev, 
                                team: [myPoke],
                                caughtData: { ...prev.caughtData, [p.id]: true },
                                selectedStarters: { ...(prev.selectedStarters || {}), kanto: p.id },
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
        const labBg = fixPath('/battle_bg_lab_1776866008842.png');
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
        const route = processedRoutes[gameState.currentRoute] || ROUTES[gameState.currentRoute] || { name: 'Local Desconhecido' };
        return (
          <div
            className="relative h-full flex flex-col items-center justify-center overflow-hidden"
            style={{
              backgroundImage: "url('/battle_bg_lab_1776866008842.png')",
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
        <span className="text-[10px] font-black uppercase tracking-tighter text-white">{route?.name || 'Local Desconhecido'}</span>
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
        const labBg = fixPath('/battle_bg_lab_1776866008842.png');
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
        const labBg = fixPath('/battle_bg_lab_1776866008842.png');
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
        const elmSprite = 'https://play.pokemonshowdown.com/sprites/trainers/professorelm.png';
        const johtoStarters = [152, 155, 158].map(id => POKEDEX[id]).filter(Boolean);
        return (
          <div className="h-full flex flex-col items-center animate-fadeIn relative overflow-hidden bg-emerald-950">
            <div className="absolute inset-0 bg-[url('/battle_bg_grass_1776863779024.png')] bg-cover bg-center opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-emerald-900/30 to-slate-950/80" />

            <div className="flex-1 flex items-center justify-center relative z-10 px-6 pt-8">
              <img src={elmSprite} onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="h-64 object-contain drop-shadow-2xl animate-float" alt="Prof. Elm" />
            </div>

            <div className="relative z-10 w-full p-4 pb-6">
              <div className="bg-white rounded-[2rem] border-b-[10px] border-emerald-700 shadow-2xl p-5 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center overflow-hidden border-2 border-emerald-200">
                    <img src={elmSprite} onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-9 h-9 object-contain" alt="" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600">Prof. Elm</p>
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
                      onClick={() => handleStartJohto(starter.id)}
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
        const birchSprite = 'https://play.pokemonshowdown.com/sprites/trainers/professorbirch.png';
        const hoennStarters = [252, 255, 258].map(id => POKEDEX[id]).filter(Boolean);
        return (
          <div className="h-full flex flex-col items-center animate-fadeIn relative overflow-hidden bg-cyan-950">
            <div className="absolute inset-0 bg-[url('/bg_littleroot.png')] bg-cover bg-center opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-teal-900/30 to-slate-950/80" />

            <div className="flex-1 flex items-center justify-center relative z-10 px-6 pt-8">
              <img src={birchSprite} onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="h-64 object-contain drop-shadow-2xl animate-float" alt="Prof. Birch" />
            </div>

            <div className="relative z-10 w-full p-4 pb-6">
              <div className="bg-white rounded-[2rem] border-b-[10px] border-cyan-700 shadow-2xl p-5 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-100 flex items-center justify-center overflow-hidden border-2 border-cyan-200">
                    <img src={birchSprite} onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-9 h-9 object-contain" alt="" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-600">Prof. Birch</p>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-800 leading-none">Bem-vindo a Hoenn</h2>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-600 leading-relaxed mb-3 italic">
                  "Campeao, Hoenn tem uma pesquisa de campo perfeita para voce. Comece em Littleroot e avance pelos ginasios da regiao."
                </p>
                <p className="text-sm font-black text-slate-800 leading-relaxed mb-4 uppercase">
                  "Ao iniciar Hoenn, seu time atual fica guardado no PC regional e a nova jornada comeca com um inicial de nivel 5."
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {hoennStarters.map(starter => (
                    <button
                      key={starter.id}
                      onClick={() => handleStartHoenn(starter.id)}
                      className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-cyan-400 hover:bg-cyan-50 active:scale-95 transition-all"
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
                  Voltar
                </button>
              </div>
            </div>
          </div>
        );
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
          <Suspense fallback={<ScreenLoader label="Carregando cidade..." />}>
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
            />
          </Suspense>

          {/* Modal do Prof. Carvalho sobre a Casa */}
          {showOakHouseModal && (
            <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
              <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col animate-bounceIn">
                
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
              />
            </Suspense>
          )}

          {showExpeditions && (
            <Suspense fallback={null}>
              <ExpeditionsScreen
                gameState={gameState}
                onClose={() => setShowExpeditions(false)}
                onStartExpedition={(biomeId, team) => {
                  handleStartExpedition(biomeId, team);
                  setShowExpeditions(false);
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

          {showExpeditions && (
            <Suspense fallback={null}>
              <ExpeditionsScreen
                gameState={gameState}
                onClose={() => setShowExpeditions(false)}
                onStartExpedition={(biomeId, team) => {
                  handleStartExpedition(biomeId, team);
                  setShowExpeditions(false);
                }}
                onClaimExpedition={(biomeId) => handleClaimExpedition(biomeId)}
              />
            </Suspense>
          )}
        </>
      );

      case 'vs': return (
        <Suspense fallback={<div className="h-full flex items-center justify-center bg-slate-900 text-white font-black uppercase tracking-[0.3em] animate-pulse">Carregando Desafios...</div>}>
          <VsScreen
            gameState={gameState}
            onChallengeGym={(gymData) => {
              handleChallengeGym(gymData);
            }}
            onChallenge={(challenge) => {
              if (challenge.category === 'rival') {
                startBattleAgainstRival(challenge);
              } else {
                startKeyBattle(challenge);
              }
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

      case 'prof_elm_starters_announcement': return (
        <div className="absolute inset-0 z-[9999] flex flex-col bg-[#0a1e0f] overflow-hidden animate-fadeIn">
          {/* Header Superior - Padrão Premium */}
          <div className="bg-emerald-700 px-6 py-5 flex items-center justify-between shadow-xl shrink-0 z-20 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <img src="https://play.pokemonshowdown.com/sprites/trainers/professorelm.png" onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-10 h-10 object-contain drop-shadow-md" alt="Elm" />
              </div>
              <div className="text-left">
                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Guia de Johto</p>
                <h3 className="text-white text-xl font-black uppercase italic leading-none tracking-tighter">Mensagem do Prof. Elm</h3>
              </div>
            </div>
          </div>

          {/* Área de Conteúdo */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-y-auto">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            <div className="relative z-10 max-w-sm">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
                <div className="w-32 h-32 mx-auto rounded-full bg-white/5 border-2 border-emerald-500/30 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                  <img src="https://play.pokemonshowdown.com/sprites/trainers/professorelm.png" onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-24 h-24 object-contain drop-shadow-2xl" alt="Elm" />
                </div>
              </div>

              <h2 className="text-white font-black text-2xl uppercase italic tracking-tighter leading-tight mb-6">
                "Notícias de New Bark!"
              </h2>

              <div className="space-y-4 text-white/90 text-sm font-bold leading-relaxed italic">
                <p>
                  "Incrível! Meus parabéns por derrotar o rival! A pesquisa em Johto está avançando rápido..."
                </p>
                <p className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
                  "Os Pokémon iniciais de Johto: <span className="text-emerald-400">Chikorita</span>, <span className="text-orange-400">Cyndaquil</span> e <span className="text-blue-400">Totodile</span> foram avistados selvagens na Rota 29 e na Rota 30!"
                </p>
                <p>
                  "Parece que eles estão se adaptando bem ao ambiente natural. Agora você pode encontrá-los e capturá-los para sua equipe! Boa sorte!"
                </p>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4 opacity-40 grayscale animate-pulse">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png" className="w-12 h-12 object-contain" alt="152" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/155.png" className="w-12 h-12 object-contain" alt="155" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/158.png" className="w-12 h-12 object-contain" alt="158" />
              </div>
            </div>
          </div>

          {/* Rodapé Fixo */}
          <div className="p-8 pt-4 bg-black/20 shrink-0 border-t border-white/5">
            <button 
              onClick={() => {
                setGameState(prev => ({ 
                  ...prev, 
                  worldFlags: [...(prev.worldFlags || []), 'johto_rival_1_defeated'].filter((v, i, a) => a.indexOf(v) === i)
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

      case 'prof_birch_announcement': return (
        <div className="absolute inset-0 z-[9999] flex flex-col bg-[#0f1a2a] overflow-hidden animate-fadeIn">
          <div className="bg-cyan-700 px-6 py-5 flex items-center justify-between shadow-xl shrink-0 z-20 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <img src="https://play.pokemonshowdown.com/sprites/trainers/professorbirch.png" onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-10 h-10 object-contain drop-shadow-md" alt="Birch" />
              </div>
              <div className="text-left">
                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Guia de Hoenn</p>
                <h3 className="text-white text-xl font-black uppercase italic leading-none tracking-tighter">Mensagem do Prof. Birch</h3>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-y-auto">
            <div className="relative z-10 max-w-sm">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
                <div className="w-32 h-32 mx-auto rounded-full bg-white/5 border-2 border-cyan-500/30 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                  <img src="https://play.pokemonshowdown.com/sprites/trainers/professorbirch.png" onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-24 h-24 object-contain drop-shadow-2xl" alt="Birch" />
                </div>
              </div>

              <h2 className="text-white font-black text-2xl uppercase italic tracking-tighter leading-tight mb-6">"Selvagens em Littleroot!"</h2>

              <div className="space-y-4 text-white/90 text-sm font-bold leading-relaxed italic">
                <p>"Espetacular! Apos sua vitoria contra o rival, percebemos uma mudanca no ecossistema local."</p>
                <p className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
                  "Os iniciais de Hoenn: <span className="text-emerald-400">Treecko</span>, <span className="text-orange-400">Torchic</span> e <span className="text-blue-400">Mudkip</span> estao agora nas Rotas 101 e 102!"
                </p>
                <p>"Parece que o habitat de Hoenn esta reagindo a sua presenca. Va e capture-os!"</p>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4 opacity-40 grayscale animate-pulse">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/252.png" className="w-12 h-12 object-contain" alt="252" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png" className="w-12 h-12 object-contain" alt="255" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/258.png" className="w-12 h-12 object-contain" alt="258" />
              </div>
            </div>
          </div>

          <div className="p-8 pt-4 bg-black/20 shrink-0 border-t border-white/5">
            <button 
              onClick={() => {
                setGameState(prev => ({ 
                  ...prev, 
                  worldFlags: [...(prev.worldFlags || []), 'hoenn_rival_1_defeated'].filter((v, i, a) => a.indexOf(v) === i)
                }));
                setCurrentView('city');
              }}
              className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black uppercase text-base tracking-widest hover:bg-slate-100 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] active:scale-95"
            >
              VAMOS NESSA!
            </button>
          </div>
        </div>
      );

      case 'prof_rowan_announcement': return (
        <div className="absolute inset-0 z-[9999] flex flex-col bg-[#1a0f0a] overflow-hidden animate-fadeIn">
          <div className="bg-amber-800 px-6 py-5 flex items-center justify-between shadow-xl shrink-0 z-20 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                <img src="https://play.pokemonshowdown.com/sprites/trainers/professorrowan.png" onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-10 h-10 object-contain drop-shadow-md" alt="Rowan" />
              </div>
              <div className="text-left">
                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Guia de Sinnoh</p>
                <h3 className="text-white text-xl font-black uppercase italic leading-none tracking-tighter">Mensagem do Prof. Rowan</h3>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-y-auto">
            <div className="relative z-10 max-w-sm">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
                <div className="w-32 h-32 mx-auto rounded-full bg-white/5 border-2 border-amber-500/30 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(180,83,9,0.15)]">
                  <img src="https://play.pokemonshowdown.com/sprites/trainers/professorrowan.png" onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-24 h-24 object-contain drop-shadow-2xl" alt="Rowan" />
                </div>
              </div>

              <h2 className="text-white font-black text-2xl uppercase italic tracking-tighter leading-tight mb-6">"Evolucao na Natureza!"</h2>

              <div className="space-y-4 text-white/90 text-sm font-bold leading-relaxed italic">
                <p>"Muito bem. Derrotar Barry requer disciplina. Agora, observe os frutos do seu esforco."</p>
                <p className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
                  "Os iniciais de Sinnoh: <span className="text-emerald-400">Turtwig</span>, <span className="text-orange-400">Chimchar</span> e <span className="text-blue-400">Piplup</span> foram vistos nas Rotas 201 e 202!"
                </p>
                <p>"A biodiversidade de Sinnoh e vasta. Nao perca a chance de completa-la."</p>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4 opacity-40 grayscale animate-pulse">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/387.png" className="w-12 h-12 object-contain" alt="387" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/390.png" className="w-12 h-12 object-contain" alt="390" />
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png" className="w-12 h-12 object-contain" alt="393" />
              </div>
            </div>
          </div>

          <div className="p-8 pt-4 bg-black/20 shrink-0 border-t border-white/5">
            <button 
              onClick={() => {
                setGameState(prev => ({ 
                  ...prev, 
                  worldFlags: [...(prev.worldFlags || []), 'sinnoh_rival_1_defeated'].filter((v, i, a) => a.indexOf(v) === i)
                }));
                setCurrentView('city');
              }}
              className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black uppercase text-base tracking-widest hover:bg-slate-100 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] active:scale-95"
            >
              PROSSEGUIR!
            </button>
          </div>
        </div>
      );

      case 'battles': return (
        <div className="pt-14 pb-20 h-full overflow-y-auto">
          <Suspense fallback={<ScreenLoader label="Carregando batalha..." />}>
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
                bossDamage={bossDamage}
                onChallengeBoss={(battle) => {
                  if (battle.type === 'rival') {
                    startBattleAgainstRival(battle);
                  } else if (battle.type === 'gym_leader' || battle.type === 'elite' || battle.type === 'boss' || battle.type === 'rocket' || battle.type === 'legendary') {
                    startKeyBattle(battle);
                  }
                }}
            />
          </Suspense>
        </div>
      );
      case 'routes': return (
        <Suspense fallback={<ScreenLoader label="Carregando rotas..." />}>
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
        </Suspense>
      );

      case 'pokemon_management': return (
        <Suspense fallback={<ScreenLoader label="Carregando equipe..." />}>
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
          handleUseCandy={handleUseCandy}
          setCurrentView={setCurrentView}
          setVsInitialTab={setVsInitialTab}
          validateTeamAccess={validateTeamAccess}
          activeRegion={gameState.activeRegion}
          />
        </Suspense>
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

              <Suspense fallback={<div className="p-10 text-center font-black text-slate-400">Carregando Forja...</div>}>
                <CraftingStation 
                  recipes={CRAFTING_RECIPES}
                  inventory={gameState.inventory}
                  currency={gameState.currency}
                  onCraft={handleCraft}
                />
              </Suspense>

              <button 
                onClick={() => setCurrentView('city')}
                className="w-full mt-6 bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg border-b-8 border-slate-900"
              >Voltar para a Cidade</button>
           </div>
        </div>
      );
      case 'menu': return (
        <Suspense fallback={<ScreenLoader label="Carregando menu..." />}>
          <MenuScreen 
          {...props}
          gameState={gameState} 
          setCurrentView={setCurrentView} 
          setGameState={setGameState}
          user={user}
          onSave={triggerSave}
          MUSIC_LIST={MUSIC_LIST}
          onBack={() => setCurrentView(lastNonMenuView.current)}
          />
        </Suspense>
      );

      case 'defeat_screen': return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-900 p-8 relative overflow-hidden animate-fadeIn">
           {/* Efeito de Nevoeiro Fantasmagórico */}
           <div className="absolute inset-0 opacity-30 pointer-events-none bg-gradient-to-t from-purple-900 to-transparent"></div>
           
           <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
              <div className="flex gap-8 mb-12 animate-float">
                 <img src="https://play.pokemonshowdown.com/sprites/ani/gastly.gif" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" alt="Gastly" />
                 <img src="https://play.pokemonshowdown.com/sprites/ani/haunter.gif" className="w-28 h-28 drop-shadow-[0_0_20px_rgba(168,85,247,0.7)] delay-75" alt="Haunter" />
              </div>

              <div className="bg-slate-800/80 backdrop-blur-md p-10 rounded-[3rem] border-2 border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                <h2 className="text-4xl font-black text-purple-400 uppercase italic mb-6 tracking-tighter">Hehehe...</h2>
                <p className="text-white font-bold text-lg mb-10 italic leading-tight">
                  "Vimos você cair... Não se preocupe, treinador. Nós o levamos para um lugar seguro."
                </p>
                <button 
                  onClick={() => {
                    setTimeout(() => setCurrentView('heal_after_defeat'), 800);
                  }} 
                  className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-purple-500 transition-all active:scale-95 border-b-8 border-purple-800"
                >OK...</button>
              </div>
           </div>
        </div>
      );
      case 'pokedex': return (
        <Suspense fallback={<div className="h-full bg-slate-900 flex items-center justify-center text-pokeGold font-black uppercase tracking-[0.5em] animate-pulse">Sincronizando Pokédex...</div>}>
          <PokedexScreen 
            POKEDEX={Object.fromEntries(Object.entries(POKEDEX).filter(([id]) => Number(id) <= 493))}
            caughtData={gameState.caughtData} 
            team={gameState.team}
            box={gameState.pc}
            onBack={() => setCurrentView(lastNonMenuView.current)} 
          />
        </Suspense>
      );
      case 'heal_after_defeat': return (
        <div className="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-100 p-6 text-center animate-fadeIn overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src={fixPath('/battle_bg_pokecenter_1776868686753.png')} className="w-full h-full object-cover" alt="Pokecenter" />
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
                   const targetCity = getNearestCityRouteId(gameState.currentRoute);
                   healTeamAtPokemonCenter(() => {
                     setGameState(prev => ({
                       ...prev,
                       lastFarmingRoute: (ROUTES[prev.currentRoute]?.type === 'farm') ? prev.currentRoute : prev.lastFarmingRoute,
                       currentRoute: targetCity,
                     }));
                     setCurrentView('city');
                   });
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
  const autoEnabled = !!(gameState.autoFarm || gameState.autoCapture || gameState.autoConfig?.autoPotion || gameState.autoConfig?.autoStamina);
  
  const updateAutoConfig = (patch) => {
    setGameState(prev => ({
      ...prev,
      autoConfig: { ...(prev.autoConfig || {}), ...patch },
    }));
  };

  const GearIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" aria-hidden="true">
      <path d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 13.5a7.8 7.8 0 0 0 0-3l2-1.35-2-3.46-2.36.98a8.04 8.04 0 0 0-2.6-1.5L14.1 2.6h-4l-.35 2.57a8.04 8.04 0 0 0-2.6 1.5l-2.36-.98-2 3.46 2 1.35a7.8 7.8 0 0 0 0 3l-2 1.35 2 3.46 2.36-.98a8.04 8.04 0 0 0 2.6 1.5l.35 2.57h4l.35-2.57a8.04 8.04 0 0 0 2.6-1.5l2.36.98 2-3.46-2-1.35Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );

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
                  style={{background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'12px', padding:'6px', cursor:'pointer', color:'white', fontSize:'16px'}}
                >
                  {muted ? '🔇' : '🎵'}
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
                  style={{background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'12px', padding:'6px', cursor:'pointer', color:'white', fontSize:'16px'}}
                >
                  🏠
                </button>
              </div>
            )}
          </header>

          {showStatusStrip && (
            <div className="game-status-strip">
              {isInRoute && (
                <button
                  type="button"
                  className={`status-auto-button ${autoEnabled ? 'is-on' : ''}`}
                  onClick={() => setShowBattleAutoPanel(true)}
                >
                  ⚙️ AUTO {autoEnabled ? 'ON' : 'OFF'}
                </button>
              )}

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

      {showKantoChampionModal && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[430px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-b-[10px] border-amber-500 animate-bounceIn">
            <div className="bg-amber-500 px-6 py-5 flex items-center gap-4">
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
                  "Tambem recebi chamadas do Prof. Elm, em Johto, e do Prof. Birch, em Hoenn. Quando estiver pronto, escolha uma nova regiao com regras proprias."
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
                    setCurrentView('hoenn_intro');
                  }}
                  className="w-full min-h-[54px] rounded-2xl bg-cyan-600 text-white font-black uppercase tracking-widest text-xs hover:bg-cyan-700 transition-all shadow-lg"
                >
                  Falar com o Prof. Birch
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

      {showHoennUnlockModal && (
        <div className="absolute inset-0 z-[9998] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[430px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-b-[10px] border-cyan-500 animate-bounceIn">
            <div className="bg-cyan-600 px-6 py-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center overflow-hidden border border-white/30">
                <img src="https://play.pokemonshowdown.com/sprites/trainers/professorbirch.png" onError={(e) => { e.currentTarget.src = 'https://play.pokemonshowdown.com/sprites/trainers/oak.png'; }} className="w-12 h-12 object-contain" alt="Prof. Birch" />
              </div>
              <div>
                <p className="text-cyan-100 text-[10px] font-black uppercase tracking-[0.25em]">Prof. Birch</p>
                <h2 className="text-white text-xl font-black uppercase italic tracking-tighter leading-none">Convite de Hoenn</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm font-bold text-slate-600 leading-relaxed italic mb-3">
                "Campeao, Hoenn esta pronta para receber voce. Comece uma jornada nova em Littleroot com Treecko, Torchic ou Mudkip."
              </p>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setShowHoennUnlockModal(false);
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: (prev.worldFlags || []).concat(['hoenn_unlock_modal_shown']).filter((v, i, a) => a.indexOf(v) === i),
                    }));
                    setCurrentView('hoenn_intro');
                  }}
                  className="w-full min-h-[54px] rounded-2xl bg-cyan-600 text-white font-black uppercase tracking-widest text-xs hover:bg-cyan-700 transition-all shadow-lg"
                >
                  Ir para Hoenn
                </button>
                <button
                  onClick={() => {
                    setShowHoennUnlockModal(false);
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: (prev.worldFlags || []).concat(['hoenn_unlock_modal_shown']).filter((v, i, a) => a.indexOf(v) === i),
                    }));
                  }}
                  className="w-full min-h-[48px] rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                >
                  Mais tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <nav className="absolute bottom-0 left-0 right-0 w-full bg-white border-t border-slate-200 flex items-center justify-around px-2 py-2 z-50 shadow-xl">

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
              <img src="/assets/menu/pokedex.png"
                className="w-7 h-7 object-contain" alt=""
                onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML += '<span style="font-size:22px">📱</span>'; }} />
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
              <img src={fixPath('/battle_bg_pokecenter_1776868686753.png')} className="w-full h-full object-cover" alt="Pokecenter" />
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
                 
                 <button 
                 onClick={() => {
                     healTeamAtPokemonCenter(() => {
                       setActiveBuildingModal(null);
                     });
                   }}
                   className={`w-full ${isHealing ? 'bg-slate-400 animate-pulse' : 'bg-red-500 hover:bg-red-600 active:scale-95'} text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_10px_25px_rgba(239,68,68,0.3)] flex items-center justify-center gap-4 border-b-8 border-red-700`}
                 >
                   <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png" className="w-8 h-8" alt="Heal" />
                   {isHealing ? 'Cuidando...' : 'Sim, por favor!'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {(activeBuildingModal && activeBuildingModal !== 'pokecenter') && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
           <div className="modal-panel-mobile shadow-2xl flex flex-col relative border-b-[8px] border-slate-800 overflow-hidden" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
              <div
                className="px-5 py-4 flex items-center justify-between gap-3 shrink-0"
                style={{
                  background:
                    activeBuildingModal === 'mart' ? '#2563eb' :
                    '#475569'
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
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
                    <h3 className="text-white text-lg font-black uppercase italic leading-tight truncate">
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
                        { id: 'pokeballs', name: 'Poke Bola', price: 600, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', desc: 'Captura Pokemon selvagens', availableFrom: null },
                        { id: 'potions', name: 'Pocao', price: 300, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png', desc: 'Restaura 20 HP', availableFrom: null },
                        { id: 'great_ball', name: 'Great Ball', price: 2500, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', desc: 'Melhor chance de captura', availableFrom: 'cascade_badge' },
                        { id: 'revive', name: 'Revive', price: 1500, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png', desc: 'Revive Pokemon desmaiado', availableFrom: 'cascade_badge' },
                        { id: 'ultra_ball', name: 'Ultra Ball', price: 6500, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', desc: 'Alta chance de captura', availableFrom: 'soul_badge' },
                        ...POKE_MART_DRINKS.map(d => ({ ...d, desc: d.description }))
                      ].filter(item => isMartItemUnlocked(gameState, item.id)).map(item => {
                        const maxQty = Math.floor(gameState.currency / item.price);
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

                          if (totalCost >= 5000) {
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
                          } else {
                            performPurchase();
                          }
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
                <div className="p-5 flex-1 flex flex-col overflow-hidden">
                   <div className="flex items-center justify-between mb-4 gap-3">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Poder Global (PS)</span>
                        <span className="text-sm font-black text-slate-800 tracking-tighter">{powerScore.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col items-center px-4 py-1.5 bg-slate-900 rounded-xl border border-white/10 shadow-lg">
                        <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest leading-none mb-0.5">Material Rank</span>
                        <span className="text-[10px] font-black text-white italic leading-none">{currentRank}</span>
                      </div>
                      <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm flex items-center gap-1 shrink-0">
                         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {gameState.currency}
                      </div>
                   </div>

                   <div className="grid grid-cols-5 gap-1.5 pb-3 mb-3">
                      {Object.keys(CRAFTING_RECIPES).map(category => (
                        <button
                          key={category}
                          onClick={() => setForgeCategory(category)}
                          className={`min-h-[46px] px-1.5 py-2 rounded-xl text-[8px] leading-tight font-black uppercase transition-all ${forgeCategory === category ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}
                        >
                          {getForgeCategoryLabel(category)}
                        </button>
                      ))}
                   </div>

                   <div className="space-y-6 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-6">
                      {Object.entries(CRAFTING_RECIPES).filter(([category]) => category === forgeCategory).map(([category, items]) => (
                        <div key={category} className="space-y-3">
                           <div className={`flex items-center gap-2 border-b-2 pb-2 ${category === 'elite_relics' ? 'border-amber-500/30' : 'border-slate-100'}`}>
                              <div className={`w-2 h-2 rounded-full ${category === 'elite_relics' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-orange-500'}`}></div>
                              <h3 className={`text-sm font-black uppercase tracking-[0.18em] ${category === 'elite_relics' ? 'text-amber-600 italic' : 'text-slate-400'}`}>
                                {getForgeCategoryLabel(category)}
                              </h3>
                           </div>
                           <div className="flex flex-col gap-3">
                              {items
                                .filter(item => isForgeItemUnlocked(gameState, item.id, powerScore))
                                .filter(item => Object.keys(item.cost || {}).some(mat => mat === 'currency' || (gameState.inventory.materials?.[mat] || 0) > 0))
                                .map(item => {
                                const canCraftOne = Object.entries(item.cost).every(([mat, amount]) => {
                                 if (mat === 'currency') return gameState.currency >= amount;
                                 return (gameState.inventory.materials?.[mat] || 0) >= amount;
                               });
                               const getMaxCraft = () => {
                                 let maxN = Infinity;
                                 Object.entries(item.cost).forEach(([mat, amount]) => {
                                   const have = mat === 'currency' ? gameState.currency : (gameState.inventory.materials?.[mat] || 0);
                                   maxN = Math.min(maxN, Math.floor(have / amount));
                                 });
                                 return maxN === Infinity ? 0 : maxN;
                               };
                               const craftFn = (qty) => {
                                 if (qty < 1) return;
                                 const totalCurrency = (item.cost.currency || 0) * qty;
                                 
                                 const performCraft = () => {
                                   setGameState(prev => {
                                     const newInv = { ...prev.inventory, materials: { ...prev.inventory.materials } };
                                     Object.entries(item.cost).forEach(([mat, amount]) => {
                                       if (mat !== 'currency') newInv.materials[mat] = (newInv.materials[mat] || 0) - amount * qty;
                                     });
                                     return {
                                       ...prev,
                                       currency: prev.currency - totalCurrency,
                                       inventory: { ...newInv, items: { ...newInv.items, [item.id]: (newInv.items[item.id] || 0) + qty } }
                                     };
                                   });
                                   addLog(`Forjado: ${qty}x ${item.name}`, 'system');
                                   notify(`Forjado: ${item.name}`, 'success');
                                 };

                                 if (totalCurrency >= 5000) {
                                   showConfirm({
                                     type: 'confirm',
                                     title: 'Confirmar Forja de Alto Valor',
                                     message: `Esta operação custará ${totalCurrency.toLocaleString()} Pokédollars. Prosseguir?`,
                                     confirmLabel: 'Forjar',
                                     cancelLabel: 'Cancelar',
                                     onConfirm: () => {
                                       closeConfirm();
                                       performCraft();
                                     },
                                     onCancel: closeConfirm
                                   });
                                 } else {
                                   performCraft();
                                 }
                               };
                               const maxCraft = getMaxCraft();
                               return (
                                 <div key={item.id} className={`rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${category === 'elite_relics' ? 'bg-slate-900 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-white border-slate-100'}`}>
                                    <div className="flex items-start gap-3 p-3 pb-2">
                                       <div className={`${category === 'elite_relics' ? 'bg-amber-500/20 border-amber-500/40' : 'bg-orange-50 border-orange-100'} w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border`}>
                                          <img src={item.img} className="w-9 h-9 object-contain" alt={item.name} />
                                       </div>
                                       <div className="flex-1 min-w-0">
                                          <h4 className={`font-black uppercase italic text-base leading-tight ${category === 'elite_relics' ? 'text-amber-500' : 'text-slate-800'}`}>{item.name}</h4>
                                          <p className={`text-[11px] font-bold leading-snug mt-1 ${category === 'elite_relics' ? 'text-white/40' : 'text-slate-500'}`} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {typeof item.effect === 'string' ? item.effect : (item.description || 'Item de Crafting')}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                                       {Object.entries(item.cost).map(([mat, amount]) => {
                                         const have = mat === 'currency' ? gameState.currency : (gameState.inventory.materials?.[mat] || 0);
                                         const ok = have >= amount;
                                         return (
                                           <button key={mat} onClick={() => setActiveMaterialModal(mat)}
                                             className={`min-h-[36px] px-2 py-1.5 rounded-lg border text-[9px] leading-tight font-black uppercase text-left ${ok ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-600'}`}
                                           >
                                             {mat.replace(/_/g,' ')}: {have}/{amount}
                                           </button>
                                         );
                                       })}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 bg-orange-50/70 p-2">
                                       {[{label:'x1',qty:1},{label:'x10',qty:10},{label:'Max',qty:maxCraft}].map(opt => {
                                         const canAffordQty = Object.entries(item.cost).every(([mat, amount]) => {
                                           const have = mat === 'currency' ? gameState.currency : (gameState.inventory.materials?.[mat] || 0);
                                           return have >= amount * opt.qty;
                                         });
                                         return (
                                           <button key={opt.label}
                                             disabled={!canAffordQty || opt.qty < 1}
                                             onClick={() => craftFn(opt.qty)}
                                             className="min-h-[44px] rounded-xl font-black text-sm uppercase transition-all bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                                           >
                                             {opt.label}{opt.label==='Max'&&maxCraft>0?` (${maxCraft})`:''}
                                           </button>
                                         );
                                       })}
                                    </div>
                                 </div>
                               );
                             })}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             )}
          </div>
       </div>
      )}
      {activeMaterialModal && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
           <div className="modal-panel-mobile bg-white shadow-2xl border-b-[8px] border-slate-800 animate-bounceIn overflow-hidden flex flex-col">
              <div className="bg-slate-700 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
                 <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                       <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dowsing-machine.png" className="w-9 h-9 object-contain" alt="" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Guia de material</p>
                       <h3 className="text-white text-lg font-black uppercase italic leading-tight truncate">Onde encontrar?</h3>
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
                       <h4 className="text-lg font-black text-slate-800 uppercase italic mt-1 truncate">{activeMaterialModal.replace(/_/g, ' ')}</h4>
                    </div>
                 </div>

                 <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white rounded-2xl border border-slate-100 p-4">
                    {(() => {
                       switch(activeMaterialModal) {
                          case 'currency': return 'Obtido derrotando Pokemon em qualquer rota ou vendendo itens raros.';
                          case 'apricorn': return 'Dropado nas primeiras rotas de Kanto, principalmente Rota 1, Rota 22 e Floresta de Viridian.';
                          case 'blue_apricorn': return 'Colhido ao plantar sementes de Apricorn Azul. As sementes aparecem melhor no meio do jogo.';
                          case 'black_apricorn': return 'Colhido ao plantar sementes de Apricorn Preto. As sementes aparecem em rotas finais e Victory Road.';
                          case 'green_apricorn': return 'Colhido ao plantar sementes de Apricorn Verde. Procure sementes na Floresta de Viridian e rotas naturais.';
                          case 'red_apricorn': return 'Colhido ao plantar sementes de Apricorn Vermelho. Procure sementes em rotas abertas do inicio e meio do jogo.';
                          case 'white_apricorn': return 'Colhido ao plantar sementes de Apricorn Branco. Procure sementes em rotas rapidas e eletricas no meio do jogo.';
                          case 'yellow_apricorn': return 'Colhido ao plantar sementes de Apricorn Amarelo. Procure sementes em cavernas e areas especiais mais avancadas.';
                          case 'pink_apricorn': return 'Colhido ao plantar sementes de Apricorn Rosa. Procure sementes raras em rotas floridas e de fada.';
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
              </div>

              <div className="px-5 pt-3 pb-6 border-t border-slate-100 shrink-0">
                 <button onClick={() => setActiveMaterialModal(null)} className="w-full min-h-[52px] bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg">Entendido</button>
              </div>
           </div>
        </div>
      )}
      {showBallForgeTutorial && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[520px] max-h-[90dvh] bg-white rounded-3xl shadow-2xl border-b-[8px] border-orange-600 overflow-hidden flex flex-col">
            <div className="bg-orange-500 px-6 py-5 flex items-center gap-4 shrink-0">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-12 h-12 bg-white/20 rounded-2xl p-2" alt="" />
              <div className="min-w-0">
                <p className="text-white/75 text-[10px] font-black uppercase tracking-widest">Floresta de Viridian</p>
                <h3 className="text-white text-xl font-black uppercase italic leading-tight">Forja de Poke Bolas</h3>
              </div>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              <p className="text-sm font-bold text-slate-600 leading-relaxed">
                Poke Bolas agora dependem de Apricorns, essencias e materiais de rota. As primeiras rotas sustentam a Poke Ball comum; materiais melhores aparecem conforme a jornada avanca.
              </p>

              <div className="overflow-hidden rounded-2xl border-2 border-slate-100">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-500 uppercase font-black">
                    <tr>
                      <th className="p-3">Bola</th>
                      <th className="p-3">Materiais</th>
                      <th className="p-3">Onde buscar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                    <tr>
                      <td className="p-3">Poke Ball</td>
                      <td className="p-3">Apricorn comum + Essencia Normal</td>
                      <td className="p-3">Rota 1, Rota 22 e Floresta</td>
                    </tr>
                    <tr>
                      <td className="p-3">Great Ball</td>
                      <td className="p-3">Apricorn Azul + Ferro + Essencia Normal</td>
                      <td className="p-3">meio de Kanto, tuneis e rotas abertas</td>
                    </tr>
                    <tr>
                      <td className="p-3">Ultra Ball</td>
                      <td className="p-3">Apricorn Preto + Ferro + Po Mistico</td>
                      <td className="p-3">fim de Kanto e Victory Road</td>
                    </tr>
                    <tr>
                      <td className="p-3">Especiais</td>
                      <td className="p-3">Apricorns coloridos plantados na Casa</td>
                      <td className="p-3">sementes raras em rotas especificas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-5 pb-6 pt-2 shrink-0">
              <button
                onClick={closeBallForgeTutorial}
                className="w-full min-h-[54px] bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
              >
                Entendi, vou forjar
              </button>
            </div>
          </div>
        </div>
      )}
      <EvolutionScreen 
        evolutionPending={evolutionPending} 
        POKEDEX={POKEDEX} 
        setGameState={setGameState} 
        addLog={addLog} 
        setEvolutionPending={setEvolutionPending} 
      />

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
      {showAutoCaptureModal && (
        <AutoCaptureModal
          route={processedRoutes[gameState.currentRoute]}
          gameState={gameState}
          onSave={handleSaveAutoCaptureConfig}
          onClose={() => setShowAutoCaptureModal(false)}
          onDisable={handleDisableAutoCapture}
        />
      )}

      {/* 🛡️ Boss Loot Modal */}
      {pendingBossBattle && (
        <div className="absolute inset-0 z-[155] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-[430px] max-h-[88dvh] bg-slate-950 border-2 border-amber-500/30 rounded-[2rem] shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-white/10 bg-gradient-to-r from-amber-500/20 to-red-500/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-amber-400/70 text-[10px] font-black uppercase tracking-[0.2em]">World Boss</p>
                  <h2 className="text-white text-xl font-black uppercase italic leading-tight">Escolha sua equipe</h2>
                  <p className="text-white/45 text-[11px] font-bold mt-1">Selecione exatamente 6 Pokemon para esta tentativa de 120 segundos.</p>
                </div>
                <button
                  onClick={() => { setPendingBossBattle(null); setBossTeamSelection([]); }}
                  className="w-9 h-9 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 font-black"
                >
                  x
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-300">{bossTeamSelection.length}/6 selecionados</span>
                <span className="text-[10px] font-black uppercase text-white/35">Recorde do evento sera mantido</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 grid grid-cols-2 gap-3">
              {[...(gameState.team || []), ...(gameState.pc || [])].map((pokemon, index) => {
                const key = getBossTeamKey(pokemon);
                const selected = bossTeamSelection.includes(key);
                const region = Number(pokemon.id) <= 151 ? 'Kanto' : Number(pokemon.id) <= 251 ? 'Johto' : 'Hoenn';
                return (
                  <button
                    key={`${key}-${index}`}
                    onClick={() => {
                      setBossTeamSelection(prev => {
                        if (prev.includes(key)) return prev.filter(id => id !== key);
                        if (prev.length >= 6) return prev;
                        return [...prev, key];
                      });
                    }}
                    className={`relative min-h-[104px] rounded-2xl border-2 p-3 flex flex-col items-center justify-center gap-1 transition-all ${
                      selected ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-lg' : 'bg-white/5 text-white border-white/10 hover:border-amber-400/40'
                    }`}
                  >
                    <span className="absolute top-2 left-2 text-[8px] font-black uppercase opacity-70">{region}</span>
                    {pokemon.isShiny && <span className="absolute top-2 right-2 text-[10px]">STAR</span>}
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.isShiny ? 'shiny/' : ''}${pokemon.id}.png`}
                      className="w-12 h-12 object-contain"
                      alt={pokemon.name}
                      loading="lazy"
                    />
                    <span className="text-[10px] font-black uppercase italic leading-tight text-center">{pokemon.name}</span>
                    <span className="text-[8px] font-black uppercase opacity-70">Nv. {pokemon.level}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-5 bg-slate-900 border-t border-white/10 flex gap-3">
              <button
                onClick={() => { setPendingBossBattle(null); setBossTeamSelection([]); }}
                className="flex-1 bg-white/5 text-white/50 py-4 rounded-2xl font-black uppercase text-xs hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBossTeamSelection}
                disabled={bossTeamSelection.length !== 6}
                className={`flex-[2] py-4 rounded-2xl font-black uppercase text-xs transition-all ${
                  bossTeamSelection.length === 6 ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg' : 'bg-slate-800 text-white/25 cursor-not-allowed'
                }`}
              >
                Iniciar Luta
              </button>
            </div>
          </div>
        </div>
      )}

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

      {showBattleAutoPanel && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md" onClick={() => setShowBattleAutoPanel(false)}>
          <div
            className="modal-panel-mobile bg-white shadow-2xl overflow-hidden flex flex-col border-b-[8px] border-slate-800"
            style={{ height: 'min(76dvh, 680px)', maxHeight: 'calc(100dvh - 132px)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-shrink-0 px-4 py-4 flex items-center justify-between gap-2 bg-slate-900">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/25 border border-white/10 flex items-center justify-center shrink-0">
                  <GearIcon />
                </div>
                <div className="min-w-0">
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.18em]">Rotas e batalha</p>
                  <h3 className="font-black text-white uppercase italic text-base leading-tight">Painel Automatico</h3>
                </div>
              </div>
              <button onClick={() => setShowBattleAutoPanel(false)} className="w-9 h-9 rounded-full bg-white/15 text-white font-black flex items-center justify-center hover:bg-white/25 transition-colors shrink-0" aria-label="Fechar">x</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 flex flex-col gap-4 bg-slate-50">
              <div className="rounded-2xl border-2 border-blue-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-8 h-8 object-contain" alt="" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-800 text-sm font-black uppercase leading-none">Auto-Captura</p>
                      <p className="text-slate-500 text-[11px] font-bold leading-snug mt-2">Tenta capturar quando as regras da rota permitirem.</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setGameState(prev => ({ ...prev, autoCapture: !prev.autoCapture, autoCaptureConfig: { ...(prev.autoCaptureConfig || {}), enabled: !prev.autoCapture } }))} className={`shrink-0 min-h-[36px] w-16 rounded-full px-2 text-[10px] font-black uppercase ${gameState.autoCapture ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-200 text-slate-500'}`}>{gameState.autoCapture ? 'ON' : 'OFF'}</button>
                </div>
                <button type="button" onClick={() => { setShowBattleAutoPanel(false); setShowAutoCaptureModal(true); }} className="mt-4 w-full min-h-[46px] rounded-2xl bg-blue-50 border-2 border-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider">Configurar rota</button>
              </div>

              <div className="rounded-2xl border-2 border-green-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png" className="w-8 h-8 object-contain" alt="" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-800 text-sm font-black uppercase leading-none">Auto-Pocao</p>
                      <p className="text-slate-500 text-[11px] font-bold leading-snug mt-2">Usa pocao quando o HP ficar abaixo do limite.</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => updateAutoConfig({ autoPotion: !(gameState.autoConfig?.autoPotion) })} className={`shrink-0 min-h-[36px] w-16 rounded-full px-2 text-[10px] font-black uppercase ${gameState.autoConfig?.autoPotion ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'bg-slate-200 text-slate-500'}`}>{gameState.autoConfig?.autoPotion ? 'ON' : 'OFF'}</button>
                </div>
                <div className="mt-4 rounded-2xl bg-green-50 border border-green-100 p-3">
                  <label className="flex items-center justify-between gap-3 text-slate-800 text-xs font-black uppercase">
                    <span>HP minimo</span>
                    <span className="text-green-700">{gameState.autoConfig?.hpThreshold ?? gameState.autoConfig?.autoPotionHpPct ?? 30}%</span>
                  </label>
                  <input type="range" min="10" max="80" step="5" value={gameState.autoConfig?.hpThreshold ?? gameState.autoConfig?.autoPotionHpPct ?? 30} onChange={e => updateAutoConfig({ hpThreshold: Number(e.target.value), autoPotionHpPct: Number(e.target.value) })} className="mt-3 w-full accent-green-600" />
                </div>
              </div>

              <div className="rounded-2xl border-2 border-amber-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png" className="w-8 h-8 object-contain" alt="" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-800 text-sm font-black uppercase leading-none">Auto-Stamina</p>
                      <p className="text-slate-500 text-[11px] font-bold leading-snug mt-2">Alimenta Pokemon quando a energia ficar baixa.</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => updateAutoConfig({ autoStamina: !(gameState.autoConfig?.autoStamina) })} className={`shrink-0 min-h-[36px] w-16 rounded-full px-2 text-[10px] font-black uppercase ${gameState.autoConfig?.autoStamina ? 'bg-amber-600 text-white shadow-md shadow-amber-200' : 'bg-slate-200 text-slate-500'}`}>{gameState.autoConfig?.autoStamina ? 'ON' : 'OFF'}</button>
                </div>
                <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-100 p-3">
                  <label className="flex items-center justify-between gap-3 text-slate-800 text-xs font-black uppercase">
                    <span>Energia minima</span>
                    <span className="text-amber-700">{gameState.autoConfig?.staminaThreshold ?? gameState.autoConfig?.autoStaminaThreshold ?? 30}%</span>
                  </label>
                  <input type="range" min="10" max="80" step="5" value={gameState.autoConfig?.staminaThreshold ?? gameState.autoConfig?.autoStaminaThreshold ?? 30} onChange={e => updateAutoConfig({ staminaThreshold: Number(e.target.value), autoStaminaThreshold: Number(e.target.value) })} className="mt-3 w-full accent-amber-600" />
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 px-5 pt-3 pb-6 border-t border-slate-100 bg-white">
              <button onClick={() => setShowBattleAutoPanel(false)} className="w-full min-h-[52px] bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.12em] shadow-xl hover:bg-slate-700 transition-all">Salvar Ajustes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}











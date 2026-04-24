import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useAutoFarm } from './hooks/useAutoFarm';
import { useSound } from './hooks/useSound';
import { ROUTES, getRivalSprite } from './data/routes';
import { INITIAL_POKEMONS } from './data/initialPokemons';
import { CRAFTING_RECIPES } from './data/recipes';
import { MOVES } from './data/moves';
import { MOVE_TRANSLATIONS } from './data/translations';
import { POKEDEX } from './data/pokedex';
import { VILLAIN_TEAMS } from './data/villains';
import AuthScreen from './components/AuthScreen';
import MenuScreen from './components/MenuScreen';
import TravelScreen from './components/TravelScreen';
import PokemonManagement from './components/PokemonManagement';
import BattleScreen from './components/BattleScreen';
import CityScreen from './components/CityScreen';
import CraftingStation from './components/CraftingStation';
import EvolutionScreen from './components/EvolutionScreen';
import PokedexScreen from './components/PokedexScreen';
import VsScreen from './components/VsScreen';
import GymScreen from './components/GymScreen';
import ChallengesScreen from './components/ChallengesScreen';
import { MoveCategoryIcon, StatusBadges, QuickInventory, TrainerCard } from './components/CommonUI';
import { GYMS, ELITE_FOUR } from './data/gyms';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { monitorAuthState } from './auth';
import { 
  APP_VERSION, APP_VERSION_DATE, DEFAULT_GAME_STATE, GYM_LEVEL_CAPS, 
  NATURE_LIST, NATURES, TYPE_COLORS, trainerAvatars, ITEM_LABELS,
  STAMINA_RESTORE_TABLE, POKE_MART_DRINKS
} from './data/constants';
import { getMasteryPath, getEffectiveStat } from './utils/gameHelpers';
import { getTypeEffectiveness } from './data/typeChart';
import { POKEMON_TO_CANDY, CANDY_FAMILIES, CANDY_USES } from './data/candies';
import { calcExpeditionDuration, calcExpeditionDrops, calcExpeditionXP, EXPEDITION_BIOMES } from './data/expeditions';
import { calcHarvestDrops, calcGrowthTime, calcCombinedCaretakerBonus, PLANTABLE_ITEMS, HOUSE_PURCHASE_COST } from './data/house';
import HouseScreen from './components/HouseScreen';
import ExpeditionsScreen from './components/ExpeditionsScreen';
import AutoCaptureModal from './components/AutoCaptureModal';
import ConfirmModal from './components/ConfirmModal';

import QuestModal from './components/QuestModal';
import { QUESTS, getActiveQuest, updateQuestProgress } from './data/quests';

const fixPath = (path) => {
  if (typeof path !== 'string') return path;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '') || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

const MUSIC_LIST = [
  { id: 'all', name: 'Tocar Todas (Shuffle)' },
  { id: 'league_night', name: 'League Night', url: '/sounds/51383504-feora-lucas-cooper-pokemon-league-night-pokemon-diamond-410587.mp3' },
  { id: 'littleroot', name: 'Littleroot Town', url: '/sounds/51383504-feora-vgm-yume-littleroot-town-pokemon-ruby-amp-sapphire-lofi-410588.mp3' },
  { id: 'new_bark', name: 'New Bark Town', url: '/sounds/51383504-feora-vgm-yume-new-bark-town-pokemon-gold-amp-silver-lofi-410593.mp3' },
  { id: 'route_101', name: 'Route 101', url: '/sounds/51383504-feora-vgm-yume-route-101-pokeon-ruby-amp-sapphire-lofi-410589.mp3' },
  { id: 'surf', name: 'Surf Theme', url: '/sounds/51383504-feora-vgm-yume-surf-theme-pokemon-ruby-amp-sapphire-lofi-410586.mp3' },
  { id: 'pallet', name: 'Pallet Town', url: '/sounds/51383504-pallet-town-pokemon-red-amp-blue-lofi-410591.mp3' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
          // MigraÃ§Ã£o de dados para evitar crashes com saves antigos
          const migratedData = {
            ...DEFAULT_GAME_STATE,
            ...savedData,
            inventory: {
              ...DEFAULT_GAME_STATE.inventory,
              ...(savedData.inventory || {}),
              materials: { ...DEFAULT_GAME_STATE.inventory.materials, ...(savedData.inventory?.materials || {}) }
            },
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

    // Fallback de seguranÃ§a: Se carregar demorar mais de 8s, libera a tela
    const loadTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    return () => {
      unsubscribe();
      clearTimeout(loadTimeout);
    };
  }, []);

  // ===== LISTENER DE FORCE-UPDATE (Firestore config/app) =====
  // Todos os dispositivos logados serÃ£o recarregados quando forceReloadAt mudar
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

  const [activeMaterialModal, setActiveMaterialModal] = useState(null);
  const [evolutionPending, setEvolutionPending] = useState(null);
  const [masteryNotification, setMasteryNotification] = useState(null);
  const [activePokemonDetails, setActivePokemonDetails] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [travelTab, setTravelTab] = useState('routes');
  const [showAutoCaptureModal, setShowAutoCaptureModal] = useState(false);
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
  const [previewStarter, setPreviewStarter] = useState(null);
  const [activeQuestModal, setActiveQuestModal] = useState(null);
  const [vsInitialTab, setVsInitialTab] = useState('challenges'); // 'challenges', 'gyms', 'legendary'
  const [vsInitialCategory, setVsInitialCategory] = useState(null); // 'rival', 'boss', 'rocket', 'legendary'

  const [sessionStats, setSessionStats] = useState(null);
  const sessionRef = useRef({ kills: 0, coins: 0, trainers: 0, shinyKills: 0, drops: {}, captures: [] });

  // Auto-dismiss de notificaÃ§Ã£o de maestria
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
            ...DEFAULT_GAME_STATE,           // novos campos com valores padrÃ£o
            ...loaded,                  // progresso real do jogador
            version: DEFAULT_GAME_STATE.version, // forÃ§a versÃ£o atual
            team: loaded.team || DEFAULT_GAME_STATE.team,
            pc: loaded.pc || DEFAULT_GAME_STATE.pc,
            badges: loaded.badges || DEFAULT_GAME_STATE.badges,
            worldFlags: loaded.worldFlags || DEFAULT_GAME_STATE.worldFlags,
            inventory: {
                ...DEFAULT_GAME_STATE.inventory,
                ...(loaded.inventory || {}),
                materials: { ...DEFAULT_GAME_STATE.inventory.materials, ...(loaded.inventory?.materials || {}) },
                items: { ...DEFAULT_GAME_STATE.inventory.items, ...(loaded.inventory?.items || {}) }
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
    addSafe('route_1', 7, 4, 'water_stone', 0.02);
    addSafe('route_1', 4, 4, 'fire_stone', 0.02);

    // Rota 22: Eevee
    addSafe('route_22', 133, 6);

    // Floresta de Viridian: Pikachu e Bulbasaur
    addSafe('viridian_forest', 25, 9, 'thunder_stone', 0.02);
    addSafe('viridian_forest', 1, 8, 'leaf_stone', 0.02);

    return newRoutes;
  }, [gameState.worldFlags]);

  const handleGoToCity = useCallback(() => {
    const currentR = ROUTES[gameState.currentRoute];
    const isFarm = currentR && currentR.type === 'farm';
    let targetCityId = null;

    if (currentR && currentR.group) {
      targetCityId = Object.keys(ROUTES).find(key => 
        ROUTES[key].group === currentR.group && 
        (ROUTES[key].type === 'city' || ROUTES[key].type === 'gym')
      );
    }

    if (currentView === 'battles' && (sessionRef.current.kills > 0 || sessionRef.current.captures.length > 0)) {
      setSessionStats({ ...sessionRef.current, targetRoute: targetCityId || gameState.currentRoute });
      return;
    }

    setGameState(prev => ({ 
      ...prev, 
      currentRoute: targetCityId || prev.currentRoute,
      lastFarmingRoute: isFarm ? prev.currentRoute : prev.lastFarmingRoute 
    }));
    setCurrentView('city');
  }, [gameState.currentRoute, currentView, setGameState, setCurrentView, stopSFX]);



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

  const addLog = useCallback((msg, type = 'default') => {
    setBattleLog(prev => [{ msg, type, id: Date.now() + Math.random() }, ...prev].slice(0, 8));
  }, []);

  const addFloat = useCallback((text, color = '#ef4444') => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, color }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(f => f.id !== id)), 1200);
  }, []);

  // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ UNIFICAÃ­Â‡Ã­O DE COLEÃ­Â‡Ã­O Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
  const unifyDuplicates = useCallback((prev) => {
    const all = [...(prev.team || []), ...(prev.pc || [])];
    const uniqueMap = {};
    all.forEach(p => {
      const id = Number(p.id);
      
      // Garante que o pokÃ©mon processado tenha ataques e todos os 6 status
      let processed = p;
      const needsMoves = !processed.moves || processed.moves.length === 0;
      const needsStats = !processed.spAtk || !processed.spDef;
      
      if (needsMoves || needsStats) {
        const base = POKEDEX[id] || {};
        
        let finalMoves = processed.moves;
        if (needsMoves) {
          const learnset = base.learnset || [];
          let availableMoves = learnset
            .filter(m => m.level <= (p.level || 5))
            .map(m => {
              const moveData = MOVES[m.move] || { name: m.move, power: 40, type: 'Normal' };
              const moveKey = (m.move || '').toLowerCase();
              return {
                name: MOVE_TRANSLATIONS[moveKey] || moveData.name || m.move,
                power: moveData.power || 0,
                type: moveData.type || 'Normal'
              };
            });
          if (availableMoves.length === 0) availableMoves = [{ name: 'Investida', power: 40, type: 'Normal' }];
          finalMoves = availableMoves.slice(-4);
        }

        processed = { 
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
      }

      if (!uniqueMap[id] || (processed.level > uniqueMap[id].level)) {
        uniqueMap[id] = processed;
      } else if (processed.isShiny && !uniqueMap[id].isShiny) {
        uniqueMap[id] = { ...uniqueMap[id], isShiny: true, hp: uniqueMap[id].maxHp };
      }
    });
    const unified = Object.values(uniqueMap).sort((a, b) => b.level - a.level);
    const newTeam = unified.slice(0, 6);
    const newPC = unified.slice(6);
    return { ...prev, team: newTeam, pc: newPC };
  }, []);

  useEffect(() => {
    setGameState(prev => {
      const all = [...(prev.team || []), ...(prev.pc || [])];
      const needsMoves = all.some(p => !p.moves || p.moves.length === 0);
      const uniqueIds = new Set(all.map(p => Number(p.id)));
      
      // Sincroniza Pokedex (caughtData) com PokÃ©mons que o jogador possui
      let caughtChanged = false;
      const newCaughtData = { ...(prev.caughtData || {}) };
      all.forEach(p => {
        if (!newCaughtData[p.id]) {
          newCaughtData[p.id] = true;
          caughtChanged = true;
        }
      });

      if (uniqueIds.size < all.length || needsMoves || caughtChanged) {
        // Se houver duplicatas ou precisar de golpes, unifica. Caso contrÃ¡rio, usa o estado atual.
        const nextState = (uniqueIds.size < all.length || needsMoves) ? unifyDuplicates(prev) : prev;
        
        // Aplica a mudanÃ§a de caughtData se necessÃ¡rio
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

    if (newCount === 100) { addLog(`âœ¨ DomÃ­nio de ${pokemon.name}: Chance Shiny 2x!`, 'system'); reward = { type: 'BÃ­Â´nus Passivo', val: 'Chance Shiny 2x' }; }
    if (newCount === 200) { addLog(`âœ¨ DomÃ­nio de ${pokemon.name}: Chance Shiny 5x!`, 'system'); reward = { type: 'BÃ­Â´nus Passivo', val: 'Chance Shiny 5x' }; }

    if (reward) {
      addLog(`ðŸŒŸ DomÃ­nio de ${pokemon.name}: ${reward.val} liberado!`, 'system');
      setTimeout(() => setMasteryNotification({ pokemon, reward }), 0);
    }

    return { ...prevGameState.speciesMastery, [pokemon.id]: newCount };
  }, [addLog]);


  // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ FIREBASE CLOUD SYNC Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        addLog(`Ã…Â¸Ã¢Â€Â˜Ã‚Â¤ Logado como ${user.email}`, 'system');
        try {
          const docRef = doc(db, "saves", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data?.gameState) {
              setGameState(prev => ({ ...prev, ...data.gameState }));
              addLog("Ã¢Ã‹ÂœÃ‚ÂÂ Progresso sincronizado com a nuvem!", "system");
            }
          }
        } catch (err) {
          console.error("Erro ao carregar nuvem:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [addLog]);

  // SincronizaÃ§Ã£o de Estado (VÃ¡rios destinos)
  useEffect(() => {
    // 1. LocalStorage (InstantÃ­Â¢neo)
    localStorage.setItem('poke_idle_save', JSON.stringify({ gameState }));
    
    // 2. Firestore (Throttled - 30s)
    const user = auth.currentUser;
    const now = Date.now();
    if (user && now - lastSyncRef.current > 30000) {
      lastSyncRef.current = now;
      setDoc(doc(db, "saves", user.uid), { 
        gameState, 
        updatedAt: serverTimestamp() 
      }, { merge: true }).catch(e => console.error("Cloud Save Fail:", e));
    }
  }, [gameState]);
  
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
        gameState, 
        updatedAt: serverTimestamp() 
      }, { merge: true });
      showConfirm({ type: 'success', title: 'Salvo!', message: 'Jogo salvo na nuvem com sucesso!', onConfirm: closeConfirm });
    } catch (e) {
      console.error("Manual Save Fail:", e);
      showConfirm({ type: 'error', title: 'Erro ao salvar', message: 'Não foi possível salvar na nuvem: ' + e.message, onConfirm: closeConfirm });
    }
  }, [gameState]);

  // Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬ INTERPRETADOR DE EFEITOS DE GOLPE Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬Ã¢Ã¢Â€Â Ã¢Â‚Â¬
  // LÃª o campo "effect" do moves.js e retorna o que o golpe deve fazer
  const interpretMoveEffect = (move) => {
    const e = (move.effect || '').toLowerCase();
    const name = (move.name || '').toLowerCase();
    const result = {
      statChanges: [],   // [{ stat, change, target: 'enemy'|'self' }]
      statusEffect: null, // 'burn'|'poison'|'sleep'|'paralyze'|'confuse'|'freeze'
      statusTarget: 'enemy',
      heal: false,       // se cura o prÃ³prio pokÃ©mon
      fixedDamage: null, // dano fixo (seismic-toss, dragon-rage, etc)
      ohko: false,       // one-hit KO
      accuracy_change: null, // { target, change }
      evasion_change: null,
      noEffect: false,   // teleport, roar, etc  sem efeito em batalha idle
    };

    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ Efeitos Especiais de Dano Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
    if (e.includes('one-hit ko') || e.includes('causes a one-hit ko')) {
      result.ohko = true; return result;
    }
    if (e.includes('inflicts damage equal to the user') && e.includes('level')) {
      result.fixedDamage = 'level'; return result;
    }
    if (e.includes('inflicts 40 points')) {
      result.fixedDamage = 40; return result;
    }
    if (e.includes('inflicts 20 points')) {
      result.fixedDamage = 20; return result;
    }

    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ Heal Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
    if (e.includes('restores') || (e.includes('heals') && e.includes('user')) ||
        ['recover','soft-boiled','milk drink','morning sun','synthesis','moonlight',
         'rest','slack off','roost','shore up','heal order'].some(n => name.includes(n))) {
      result.heal = true; return result;
    }

    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ Accuracy / Evasion Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
    if ((e.includes('accuracy') && e.includes('lower')) || e.includes("lowers the target's accuracy")) {
      result.accuracy_change = { target: 'enemy', change: -1 };
    }
    if (e.includes('evasion') && (e.includes('raise') || e.includes('increas'))) {
      result.evasion_change = { target: 'self', change: +1 };
    }

    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ Debuffs no inimigo Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
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

    // ÃƒÂ¢ÃƒÂ¢Ã‚Â€Ã‚ÂÃƒÂ¢Ã‚Â‚Ã‚Â¬ÃƒÂ¢ÃƒÂ¢Ã‚Â€Ã‚ÂÃƒÂ¢Ã‚Â‚Ã‚Â¬ Buffs no usuÃ¡rio ÃƒÂ¢ÃƒÂ¢Ã‚Â€Ã‚ÂÃƒÂ¢Ã‚Â‚Ã‚Â¬ÃƒÂ¢ÃƒÂ¢Ã‚Â€Ã‚ÂÃƒÂ¢Ã‚Â‚Ã‚Â¬
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

    // ÃƒÂ¢ÃƒÂ¢Ã‚Â€Ã‚ÂÃƒÂ¢Ã‚Â‚Ã‚Â¬ÃƒÂ¢ÃƒÂ¢Ã‚Â€Ã‚ÂÃƒÂ¢Ã‚Â‚Ã‚Â¬ CondiÃ§Ã­ÃƒÂ‚Ã‚Âµes de Status no inimigo ÃƒÂ¢ÃƒÂ¢Ã‚Â€Ã‚ÂÃƒÂ¢Ã‚Â‚Ã‚Â¬ÃƒÂ¢ÃƒÂ¢Ã‚Â€Ã‚ÂÃƒÂ¢Ã‚Â‚Ã‚Â¬
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

    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ Sem efeito em idle (teleport, roar, baton pass, etc) Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
    if (['teleport','roar','whirlwind','splash'].includes(name)) {
      result.noEffect = true;
    }

    return result;
  };

  // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ FÃ“RMULA DE DANO (inspirada na Gen 1) Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
  const calcDamage = useCallback((attacker, move, defender) => {
    if (!attacker || !defender || !move || !move.power) return 0;
    const level = attacker.level || 5;
    const power = move.power || 40;

    const getStatMult = (stage = 0) => (2 + Math.max(0, stage)) / (2 - Math.min(0, stage));

    // ProteÃ§Ã£o contra move ou name undefined
    const moveName = move?.name || 'Investida';
    const moveKey = (moveName || '').toLowerCase();
    const moveData = MOVES[moveKey.replace(/ /g, '-')] || move || {};
    const isPhysical = (moveData.category || 'Physical') === 'Physical';
    
    const atkBase = isPhysical ? getEffectiveStat(attacker, 'attack') : getEffectiveStat(attacker, 'spAtk');
    const defBase = isPhysical ? getEffectiveStat(defender, 'defense') : getEffectiveStat(defender, 'spDef');
    
    const atkMult = isPhysical ? getStatMult(attacker.stages?.attack) : getStatMult(attacker.stages?.spAtk);
    const defMult = isPhysical ? getStatMult(defender.stages?.defense) : getStatMult(defender.stages?.spDef);

    const atk = atkBase * atkMult;
    const def = defBase * defMult;

    const stab = move.type === attacker.type ? 1.5 : 1.0;
    const effectiveness = getTypeEffectiveness(move.type, defender.type);
    
    const base = ((((2 * level) / 5 + 2) * power * (atk / def)) / 50 + 2) * stab * effectiveness;
    const roll = 0.85 + Math.random() * 0.15; // Roll mais justo (85-100%)
    
    // Verificar accuracy  se o atacante tem accuracy reduzida, o golpe pode errar
    const accStage = attacker.stages?.accuracy || 0;
    const evaStage = defender.stages?.evasion || 0;
    const finalAccStage = accStage - evaStage;
    const accMult = finalAccStage >= 0
      ? (3 + finalAccStage) / 3
      : 3 / (3 - finalAccStage);
    
    if (Math.random() > accMult) return 0; // errou

    return Math.max(1, Math.ceil(base * roll));
  }, []);

  // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ PROCESSAMENTO DE DROPS Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
  const processDrops = useCallback((enemy) => {
    const drops = { materials: {}, items: {}, currency: 0 };
    const messages = [];

    // Moedas base
    let coinAmount = (enemy.level || 5) * 3 * (enemy.isShiny ? 2 : 1);
    
    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ EFEITOS ATIVOS (TIMED) Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
    const now = Date.now();
    const effects = gameState.activeEffects || {};

    // Multiplicador de coins (Amulet Coin + Incenso da Sorte empilham)
    let coinMult = 1.0;
    if (effects.activeAmuletCoin?.endsAt > now) coinMult *= (effects.activeAmuletCoin.coinMult || 2.0);
    if (effects.activeIncenseLuck?.endsAt > now) coinMult *= (effects.activeIncenseLuck.coinMult || 2.0);
    
    // Moeda Amuleto (Antiga LÃ³gica Hold - Mantida para compatibilidade se necessÃ¡rio, mas priorizando timed)
    const activePoke = gameState.team[activeMemberIndex];
    if (activePoke?.heldItem === 'amulet_coin' && !(effects.activeAmuletCoin?.endsAt > now)) {
      coinMult *= 2;
    }

    drops.currency = Math.floor(coinAmount * coinMult);
    messages.push(`ðŸ’° +${drops.currency} coins`);

    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ CANDY DROP Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
    const candyId = POKEMON_TO_CANDY[Number(enemy.id)];
    if (candyId) {
       const mastery = (gameState.speciesMastery || {})[Number(enemy.id)] || 0;
       const bonusChance = mastery > 50 ? 0.3 : 0.15;
       if (Math.random() < bonusChance) {
         const qty = 1;
         drops.candies = { [candyId]: qty }; 
         messages.push(`ÂÃ‚Â¬ 1x ${CANDY_FAMILIES[candyId].name}`);
       }
    }

    // NOVA LÃ“GICA DE DROPS DO USUÃRIO
    // 1. EssÃªncia por Tipo (60% de chance)
    if (Math.random() < 0.6) {
      const essenceType = `${(enemy.type || 'normal').toLowerCase()}_essence`;
      const essenceData = ITEM_LABELS[essenceType] || { icon: 'ÃƒÂ¢Ã‚ÂœÃ‚Â¨', name: `EssÃªncia ${enemy.type}` };
      drops.materials[essenceType] = (drops.materials[essenceType] || 0) + 1;
      messages.push(`${essenceData.icon} 1x ${essenceData.name}`);
    }

    // 2. Mystic Dust para Shinies (100% se for shiny)
    if (enemy.isShiny) {
      drops.materials.mystic_dust = (drops.materials.mystic_dust || 0) + 5;
      messages.push(`ÃƒÂ¢ÃƒÂ‚Ã‚Â­ÃƒÂ‚Ã‚Â 5x PÃ³ MÃ­stico`);
    }

    // Drops antigos (suporte para itens especÃ­ficos de rota/pokemon)
    if (enemy.drop && enemy.dropChance && Math.random() < (enemy.isShiny ? enemy.dropChance * 3 : enemy.dropChance)) {
      // Aqui determinamos se o drop antigo Ã© material ou item (maioria Ã© material)
      const materialList = [
        'iron_ore', 'apricorn', 'electric_chip', 'moon_stone_shard', 'pink_dust', 'gold_nugget', 'silk', 'feather',
        'fire_stone', 'water_stone', 'leaf_stone', 'thunder_stone', 'moon_stone'
      ];
      const dropData = ITEM_LABELS[enemy.drop] || { icon: 'ðŸ“¦', name: enemy.drop.toUpperCase() };
      if (materialList.includes(enemy.drop)) {
        drops.materials[enemy.drop] = (drops.materials[enemy.drop] || 0) + 1;
      } else {
        drops.items[enemy.drop] = (drops.items[enemy.drop] || 0) + 1;
      }
      messages.push(`${dropData.icon} 1x ${dropData.name}`);
    }

    // 4. PokÃ© Ball Drop Chance (20% chance)
    if (Math.random() < 0.20) {
      drops.items.pokeballs = (drops.items.pokeballs || 0) + 1;
      messages.push(`ÃƒÂ°Ã‚ÂŸÃ‚Â”Ã‚Â´ +1 PokÃ© Bola`);
    }

    return { drops, messages };
  }, []);

  // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ SPAWN Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
  const spawnEnemy = useCallback(() => {
    isProcessingVictory.current = false; // Reset de seguranÃ§a
    const route = processedRoutes[gameState.currentRoute] || processedRoutes.pallet_town;

    // Chance de encontrar um treinador NPC (~3% por padrÃ£o, configurÃ¡vel por rota)
    const trainerChance = route.trainerChance || 0.03;
    const hasTrainers = route.trainers && route.trainers.length > 0;

    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ 1. EMBOSCADA VILÃ­Â (Chance Global reduzida para ~1% para focar em selvagens) Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
    if (Math.random() < 0.01 && route.type === 'farm') {
      const teamKeys = Object.keys(VILLAIN_TEAMS);
      // Filtra por bioma se aplicÃ¡vel
      const possibleTeams = teamKeys.filter(k => !VILLAIN_TEAMS[k].biome || VILLAIN_TEAMS[k].biome === route.biome);
      const chosenKey = possibleTeams[Math.floor(Math.random() * possibleTeams.length)] || 'rocket';
      const teamData = VILLAIN_TEAMS[chosenKey];
      
      const pokeId = teamData.pokemonPool[Math.floor(Math.random() * teamData.pokemonPool.length)];
      const base = POKEDEX[pokeId] || POKEDEX[19];
      const level = Math.max(1, (route.enemies?.[0]?.level || 5) + 2);
      const reason = teamData.reasons[Math.floor(Math.random() * teamData.reasons.length)];

      setCurrentEnemy({
        ...base, id: Number(base.id),
        level, 
        maxHp: Math.ceil((((2 * (base.maxHp || base.hp || 40) * level) / 100) + level + 10) * 1.2), 
        hp: Math.ceil((((2 * (base.maxHp || base.hp || 40) * level) / 100) + level + 10) * 1.2),
        isShiny: false, status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
        isTrainer: true,
        trainerName: teamData.gruntName,
        trainerSprite: teamData.sprite,
        trainerReward: Math.floor(150 * teamData.rewardMult),
        isVillainAmbush: true,
        villainColor: teamData.color,
        instanceId: Date.now()
      });
      addLog(`âš ï¸Â EMBOSCADA! ${teamData.name} ${reason}`, 'enemy');
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
      
      const enemyName = trainerPoke.name || `PokÃ©mon de ${trainer.name}`;
      const maxHp = Math.ceil((((2 * (trainerPoke.maxHp || trainerPoke.hp || 30) * trainerPoke.level) / 100) + trainerPoke.level + 10) * 1.3);
      
      setCurrentEnemy({
        ...trainerPoke,
        name: enemyName,
        hp: maxHp, maxHp,
        isShiny: false, status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
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
      addLog(`âš”ï¸Ã¯Â¸ÂÂ ${trainer.name} quer batalhar!`, 'system');
      return;
    }

    if (!route.enemies || route.enemies.length === 0) {
      // NÃ£o seta null â€” apenas sai sem fazer nada para evitar loop infinito em cidades
      isProcessingVictory.current = false;
      return;
    }
    
    let enemyPool = [...route.enemies];
    
    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ 3. VARAS DE PESCA (Fishing Rods) Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
    // Se a rota tem bioma de Ã¡gua e o jogador possui uma vara, aumenta chance de Ã¡gua
    if (route.biome === 'water' || route.name.toLowerCase().includes('oceano') || route.name.toLowerCase().includes('praia')) {
      const rods = ['super_rod', 'good_rod', 'old_rod'];
      const ownedRod = rods.find(r => (gameState.inventory?.items?.[r] || 0) > 0);
      if (ownedRod) {
        const rodData = CRAFTING_RECIPES.fishing_rods.find(r => r.id === ownedRod);
        const waterBonus = rodData?.effect?.waterBonus || 0;
        // Filtra pokÃ©mons de Ã¡gua e duplica sua presenÃ§a no pool proporcionalmente ao bÃ­ÃƒÂ‚Ã‚Â´nus
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
    
    const baseRef = enemyPool[Math.floor(Math.random() * enemyPool.length)] || { id: 16, level: 3 };
    // Resolve dados completos do PokÃ©dex
    const base = baseRef.learnset
      ? baseRef
      : { 
          ...(POKEDEX[Number(baseRef.id)] || POKEDEX[String(baseRef.id)] || {}), 
          id: Number(baseRef.id || 16),
          level: baseRef.level || 5,
          name: (POKEDEX[Number(baseRef.id)] || POKEDEX[String(baseRef.id)])?.name || baseRef.name || 'PokÃ©mon Selvagem'
        };
    
    // Sistema de Maestria: Chance de Shiny aumenta com as capturas
    const pokeId = Number(base.id);
    const masteryCount = (gameState.speciesMastery || {})[pokeId] || (gameState.speciesMastery || {})[base.id] || 0;
    const shinyChanceBase = 0.01; // 1% base
    const shinyBonus = Math.min(0.04, (masteryCount / 100) * 0.05); // AtÃ© +4% de bÃ­ÃƒÂ‚Ã‚Â´nus
    const isShiny = Math.floor(Math.random() * 4096) === 0;

    const levelVariance = Math.floor(Math.random() * 3) - 1;
    const level = Math.max(1, (base.level || 5) + levelVariance);
    
    // BÃ­Â´nus Shiny: 20% mais forte
    const shinyMult = isShiny ? 1.2 : 1.0;

    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ 4. REPEL (Enfraquecer Inimigos) Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
    const effects = gameState.activeEffects || {};
    const now = Date.now();
    let repelMult = 1.0;
    if (effects.activeRepel?.endsAt > now) {
      repelMult = effects.activeRepel.hpMult || 0.8;
    }

    const maxHp = Math.ceil((((2 * (base.maxHp || base.hp || 30) * level) / 100) + level + 10) * shinyMult * repelMult);
    
    // SeleÃ§Ã£o de Golpes baseada no Learnset
    const learnset = base.learnset || [];
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

    // Se nÃ£o tiver golpes, dÃ¡ pelo menos Investida (Tackle)
    const finalMoves = availableMoves.length > 0 ? availableMoves.slice(-4) : [{ name: 'Investida', power: 40, type: 'Normal', category: 'Physical' }];

    // Atk Mult do Repel
    const atkRepelMult = (effects.activeRepel?.endsAt > now) ? (effects.activeRepel.atkMult || 0.8) : 1.0;

    setCurrentEnemy({ 
      ...base, 
      id: Number(base.id),
      level, 
      maxHp, 
      hp: maxHp, 
      isShiny, 
      spawnTime: Date.now(),
      status: [],
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
      attack: Math.ceil((((2 * (base.attack || 10) * level) / 100) + 5) * shinyMult * atkRepelMult),
      defense: Math.ceil((((2 * (base.defense || 10) * level) / 100) + 5) * shinyMult),
      spAtk: Math.ceil((((2 * (base.spAtk || 10) * level) / 100) + 5) * shinyMult * atkRepelMult),
      spDef: Math.ceil((((2 * (base.spDef || 10) * level) / 100) + 5) * shinyMult),
      speed: Math.ceil((((2 * (base.speed || 10) * level) / 100) + 5) * shinyMult),
      instanceId: Date.now(),
      moves: finalMoves
    });
    setBattleLog([]);
    isProcessingVictory.current = false;
    // BGM agora gerenciado pelas configuraÃ§Ã­ÃƒÂ‚Ã‚Âµes
  }, [gameState.currentRoute, gameState.speciesMastery, playBGM, addLog, processedRoutes]);

  useEffect(() => {
    const route = processedRoutes[gameState.currentRoute];
    const hasEnemies = route?.enemies?.length > 0 || route?.trainers?.length > 0;
    
    // As batalhas agora continuam mesmo se estiver em outras telas (management),
    // mas param se estiver na Cidade (City) ou em algum modal de construÃ§Ã£o.
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

  // Ref para currentView  permite que handleBattleTick leia o valor atual
  // sem precisar estar nas deps do useCallback (o que recriaria o timer a cada mudanÃ§a de view)
  useEffect(() => { 
    currentViewRef.current = currentView;
    if (currentView !== 'menu') lastNonMenuView.current = currentView;
  }, [currentView]);

  // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ TICK DE BATALHA Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
  const handleBattleTick = useCallback(() => {
    const speedMultiplier = [1, 0.6, 0.3][(gameState.settings?.battleSpeed || 1) - 1] || 1;
    
    // â”€â”€ REGRA DE EXAUSTÃƒO â€” INÃCIO DO TICK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const myPoke = gameState.team?.[activeMemberIndex];
    const myPokeStamina = gameState.stamina?.[myPoke?.instanceId]?.value ?? 100;

    if (myPokeStamina <= 0 && myPoke?.hp > 0) {
      // Buscar prÃ³ximo PokÃ©mon com HP > 0 E stamina > 0
      const nextViable = gameState.team.findIndex((p, idx) =>
        idx !== activeMemberIndex &&
        (p?.hp ?? 0) > 0 &&
        (gameState.stamina?.[p?.instanceId]?.value ?? 100) > 0
      );

      if (nextViable !== -1) {
        // Trocar automaticamente para o prÃ³ximo viÃ¡vel
        setActiveMemberIndex(nextViable);
        addLog(
          `ðŸ˜µ ${myPoke.name} estÃ¡ exausto demais para combater! ` +
          `${gameState.team[nextViable].name} entrou em campo!`,
          'system'
        );
      } else {
        // Todos exaustos ou desmaiados â€” derrota por exaustÃ£o
        isProcessingVictory.current = true;
        setCurrentEnemy(null);
        stopBGM(300);
        sfxDefeat();
        addLog(
          'ðŸ’€ Todo o time estÃ¡ exausto! Volte ao Centro PokÃ©mon para recuperar seus PokÃ©mon!',
          'system'
        );
        setTimeout(() => {
          isProcessingVictory.current = false;
          setCurrentView('defeat_screen');
        }, 300);
      }
      return 1200 * speedMultiplier;
    }
    // â”€â”€ FIM DA REGRA DE EXAUSTÃƒO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    
    const viewsAllowingBattle = ['battles', 'pokemon_management', 'pokedex', 'menu', 'vs'];
    const isPaused = activeBuildingModal !== null;
    
    if (!currentEnemy || !viewsAllowingBattle.includes(currentViewRef.current) || isPaused || currentEnemy.hp <= 0) {
      return 1200 * speedMultiplier;
    }
    
    // Atraso CinematogrÃ¡fico para InÃ­cio de Batalha (Intro)
    const introTime = currentEnemy.isTrainer ? 2500 : 1200;
    if (currentEnemy.spawnTime && Date.now() - currentEnemy.spawnTime < introTime) {
       return 400 * speedMultiplier;
    }

    let nextDelay = Math.floor(1200 * speedMultiplier);
    
    // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ 5. ISCA / LURE (Acelerar Spawn) Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
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
        const nextAlive = prev.team.findIndex(p => p.hp > 0);
        if (nextAlive !== -1) {
          setActiveMemberIndex(nextAlive);
          // Reseta stages do PokÃ©mon que entra em campo
          const newTeam = prev.team.map((p, i) =>
            i === nextAlive
              ? { ...p, stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } }
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

      // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ AUTO-POÃ­Â‡Ã­O Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
      const autoConfig = prev.autoConfig || { autoPotion: false, autoPotionHpPct: 30, focusPokemonIndex: 0 };
      if (autoConfig.autoPotion && (prev.inventory?.items?.potions || 0) > 0) {
        const focusIdx = autoConfig.focusPokemonIndex ?? activeMemberIndex;
        const focusPoke = prev.team[focusIdx];
        if (focusPoke && focusPoke.hp > 0) {
          const hpPct = (focusPoke.hp / focusPoke.maxHp) * 100;
          if (hpPct <= autoConfig.autoPotionHpPct) {
            const healed = Math.min(focusPoke.maxHp, focusPoke.hp + 20);
            const newTeam = [...prev.team];
            newTeam[focusIdx] = { ...focusPoke, hp: healed };
            addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚ÂŠ Auto-PoÃ§Ã£o usada em ${focusPoke.name}! (${focusPoke.hp}ÃƒÂ¢ÃƒÂ¢Ã‚Â€ ÃƒÂ¢Ã‚Â€Ã‚Â™${healed} HP)`, 'system');
            return {
              ...prev,
              team: newTeam,
              inventory: { ...prev.inventory, items: { ...prev.inventory.items, potions: prev.inventory.items.potions - 1 } }
            };
          }
        }
      }

      // Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬ PROCESSAMENTO DE STATUS (DANO/SKIP) Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬Ã¢Ã¢Â€ÂÃ¢Â‚Â¬
      const myStatus = myPoke.status || [];
      const enemyStatus = updatedEnemy.status || [];

      // Confuse Skip (Jogador)
      if (myStatus.includes('confuse')) {
        addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â« ${myPoke.name} estÃ¡ confuso...`, 'system');
        if (Math.random() < 0.3) {
           updatedTeam[activeMemberIndex].status = myStatus.filter(s => s !== 'confuse');
           addLog(`ÃƒÂ¢Ã‚ÂœÃ‚Â¨ ${myPoke.name} nÃ£o estÃ¡ mais confuso!`, 'system');
        } else if (Math.random() < 0.5) {
           const selfDmg = Math.max(1, Math.floor(myPoke.maxHp / 10));
           updatedTeam[activeMemberIndex].hp = Math.max(0, myPoke.hp - selfDmg);
           addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â¥ ${myPoke.name} feriu-se em sua confusÃ£o!`, 'system');
           return { ...prev, team: updatedTeam };
        }
      }

      // Paralyze/Sleep Skip (Jogador)
      if (myStatus.includes('paralyze') && Math.random() < 0.25) {
        addLog(`ÃƒÂ¢Ã‚ÂšÃ‚Â¡ ${myPoke.name} estÃ¡ paralisado e nÃ£o conseguiu atacar!`, 'system');
        return prev; 
      }
      if (myStatus.includes('sleep')) {
        addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â¤ ${myPoke.name} estÃ¡ dormindo profundamente...`, 'system');
        if (Math.random() < 0.3) {
          updatedTeam[activeMemberIndex].status = myStatus.filter(s => s !== 'sleep');
          addLog(`Ã¢Ã‹ÂœÃ¢Â‚Â¬Â ${myPoke.name} acordou!`, 'system');
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
          addLog(`ðŸ’€ ${myPoke.name} usou ${move.name}! Golpe decisivo!`, 'system');
          addFloat('OHKO!', '#ef4444');

        } else if (fx.fixedDamage !== null) {
          const dmg = fx.fixedDamage === 'level' ? (myPoke.level || 5) : fx.fixedDamage;
          updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - dmg);
          addLog(`${myPoke.name} usou ${move.name}! ${dmg} de dano!`, 'system');
          addFloat(`-${dmg}`, '#ef4444');

        } else if (fx.heal) {
          const healed = Math.floor((myPoke.maxHp || 30) * 0.5);
          updatedTeamFinal[activeMemberIndex] = {
            ...updatedTeamFinal[activeMemberIndex],
            hp: Math.min(myPoke.maxHp, myPoke.hp + healed)
          };
          addLog(`ðŸ’š ${myPoke.name} usou ${move.name}! Recuperou ${healed} HP!`, 'system');
          addFloat(`+${healed} HP`, '#22c55e');

        } else {
          // Stat changes
          fx.statChanges.forEach(c => {
            if (c.target === 'enemy') {
              const cur = updatedEnemyFinal.stages?.[c.stat] || 0;
              const newVal = Math.max(-6, Math.min(6, cur + c.change));
              updatedEnemyFinal.stages = { ...updatedEnemyFinal.stages, [c.stat]: newVal };
              const arrow = c.change < 0 ? 'â–¼' : 'â–²';
              const statNames = { attack:'ATK', defense:'DEF', spAtk:'SATK', spDef:'SDEF', speed:'SPD' };
              addLog(`${myPoke.name} usou ${move.name}! ${statNames[c.stat]||c.stat} de ${updatedEnemyFinal.name} ${c.change < 0 ? 'caiu' : 'subiu'}!`, 'system');
              addFloat(`${arrow} ${statNames[c.stat]||c.stat}`, c.change < 0 ? '#64748b' : '#3b82f6');
            } else {
              const cur = updatedTeamFinal[activeMemberIndex].stages?.[c.stat] || 0;
              const newVal = Math.max(-6, Math.min(6, cur + c.change));
              updatedTeamFinal[activeMemberIndex] = { ...updatedTeamFinal[activeMemberIndex], stages: { ...updatedTeamFinal[activeMemberIndex].stages, [c.stat]: newVal } };
              const arrow = c.change > 0 ? 'â–²' : 'â–¼';
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
            addLog(`${myPoke.name} usou ${move.name}! PrecisÃ£o de ${updatedEnemyFinal.name} caiu!`, 'system');
            addFloat(`â–¼ ACC`, '#64748b');
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
            addLog(`${myPoke.name} usou ${move.name}! EvasÃ£o subiu!`, 'system');
            addFloat(`â–² EVA`, '#3b82f6');
          }

          // Status condition
          if (fx.statusEffect) {
            const statusNames = { burn:'ÃƒÂ°Ã‚ÂŸÃ‚Â”Ã‚Â¥ Queimadura', poison:'ÃƒÂ¢ÃƒÂ‹Ã‚ÂœÃƒÂ‚ Ã­Â¯ÃƒÂ‚Ã‚Â¸ÃƒÂ‚Ã‚Â Veneno', toxic:'ÃƒÂ¢ÃƒÂ‹Ã‚ÂœÃƒÂ‚ Ã­Â¯ÃƒÂ‚Ã‚Â¸ÃƒÂ‚Ã‚Â Veneno Grave', sleep:'ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â¤ Sono', paralyze:'ÃƒÂ¢Ã‚ÂšÃ‚Â¡ Paralisia', confuse:'ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â« ConfusÃ£o', freeze:'ÃƒÂ¢ÃƒÂ‚Ã‚ÂÃƒÂ¢Ã‚Â€Ã‚ÂžÃ­Â¯ÃƒÂ‚Ã‚Â¸ÃƒÂ‚Ã‚Â Congelado' };
            if (!(updatedEnemyFinal.status || []).includes(fx.statusEffect)) {
              updatedEnemyFinal.status = [...(updatedEnemyFinal.status || []), fx.statusEffect];
              addLog(`${statusNames[fx.statusEffect]||fx.statusEffect}: ${updatedEnemyFinal.name} foi afetado!`, 'enemy');
            } else {
              addLog(`${myPoke.name} usou ${move.name}... mas nÃ£o surtiu efeito!`, 'system');
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
        updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - playerDmg);
        addFloat(`-${playerDmg}`, eff > 1 ? '#fbbf24' : eff < 1 ? '#94a3b8' : '#ef4444');
        if (eff > 1) addLog("ðŸ’¥ Ã‰ super efetivo!", 'system');
        if (eff > 0 && eff < 1) addLog("ÃƒÂ…Ã‚Â¸ÃƒÂ¢Ã‚Â€Ã‚ÂºÃƒÂ‚Ã‚Â¡Ã­Â¯ÃƒÂ‚Ã‚Â¸ÃƒÂ‚Ã‚Â NÃ£o Ã© muito efetivo!", 'system');
        if (eff === 0) addLog("ÃƒÂ°Ã‚ÂŸÃ‚ÂšÃ‚Â« NÃ£o afetou o inimigo!", 'system');
      }

      // Dano de Status (Inimigo)
      if (enemyStatus.includes('poison') || enemyStatus.includes('burn')) {
        const dot = Math.max(1, Math.floor(updatedEnemyFinal.maxHp / 16));
        updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - dot);
        addLog(`ðŸ’¢ ${updatedEnemyFinal.name} sofreu dano por status!`, 'enemy');
      }

      // Turno do Inimigo (apenas se ainda estiver vivo)
      if (updatedEnemyFinal.hp > 0) {
        // Skip Inimigo
        if (enemyStatus.includes('confuse')) {
          addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â« ${updatedEnemyFinal.name} estÃ¡ confuso...`, 'enemy');
          if (Math.random() < 0.3) {
            updatedEnemyFinal.status = enemyStatus.filter(s => s !== 'confuse');
            addLog(`ÃƒÂ¢Ã‚ÂœÃ‚Â¨ ${updatedEnemyFinal.name} nÃ£o estÃ¡ mais confuso!`, 'enemy');
          } else if (Math.random() < 0.5) {
            const selfDmg = Math.max(1, Math.floor(updatedEnemyFinal.maxHp / 10));
            updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - selfDmg);
            addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â¥ ${updatedEnemyFinal.name} feriu-se em sua confusÃ£o!`, 'enemy');
            setCurrentEnemy(updatedEnemyFinal);
            return prev;
          }
        }

        if (enemyStatus.includes('paralyze') && Math.random() < 0.25) {
          addLog(`ÃƒÂ¢Ã‚ÂšÃ‚Â¡ ${updatedEnemyFinal.name} estÃ¡ paralisado!`, 'enemy');
        } else if (enemyStatus.includes('sleep')) {
          addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â¤ ${updatedEnemyFinal.name} estÃ¡ dormindo...`, 'enemy');
          if (Math.random() < 0.35) {
            updatedEnemyFinal.status = enemyStatus.filter(s => s !== 'sleep');
            addLog(`Ã¢Ã‹ÂœÃ¢Â‚Â¬Â ${updatedEnemyFinal.name} acordou!`, 'enemy');
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
                  addLog(`ðŸ’š ${updatedEnemyFinal.name} usou ${enemyMove.name}! Recuperou ${healed} HP!`, 'enemy');
                }
              } else if (fxE.ohko) {
                updatedTeamFinal[activeMemberIndex].hp = 0;
                addLog(`ðŸ’€ ${updatedEnemyFinal.name} usou ${enemyMove.name}! Golpe decisivo!`, 'enemy');
              } else if (fxE.fixedDamage !== null) {
                const dmg = fxE.fixedDamage === 'level' ? (updatedEnemyFinal.level || 5) : fxE.fixedDamage;
                updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - dmg);
                addLog(`${updatedEnemyFinal.name} usou ${enemyMove.name}! ${dmg} de dano!`, 'enemy');
              } else {
                fxE.statChanges.forEach(c => {
                  const statNames = { attack:'ATK', defense:'DEF', spAtk:'SATK', spDef:'SDEF', speed:'SPD' };
                  if (c.target === 'self') {
                    const cur = updatedEnemyFinal.stages?.[c.stat] || 0;
                    updatedEnemyFinal.stages = { ...updatedEnemyFinal.stages, [c.stat]: Math.max(-6, Math.min(6, cur + c.change)) };
                    addLog(`âš ï¸ ${updatedEnemyFinal.name} usou ${enemyMove.name}! ${statNames[c.stat]||c.stat} ${c.change > 0 ? 'subiu' : 'caiu'}!`, 'enemy');
                  } else {
                    const cur = updatedTeamFinal[activeMemberIndex].stages?.[c.stat] || 0;
                    updatedTeamFinal[activeMemberIndex] = { ...updatedTeamFinal[activeMemberIndex], stages: { ...updatedTeamFinal[activeMemberIndex].stages, [c.stat]: Math.max(-6, Math.min(6, cur + c.change)) } };
                    addLog(`âš ï¸ ${updatedEnemyFinal.name} usou ${enemyMove.name}! ${statNames[c.stat]||c.stat} de ${updatedTeamFinal[activeMemberIndex].name} ${c.change < 0 ? 'caiu' : 'subiu'}!`, 'enemy');
                  }
                });

                if (fxE.accuracy_change) {
                  const cur = updatedTeamFinal[activeMemberIndex].stages?.accuracy || 0;
                  updatedTeamFinal[activeMemberIndex] = { ...updatedTeamFinal[activeMemberIndex], stages: { ...updatedTeamFinal[activeMemberIndex].stages, accuracy: Math.max(-6, Math.min(6, cur + fxE.accuracy_change.change)) } };
                  addLog(`âš ï¸ ${updatedEnemyFinal.name} usou ${enemyMove.name}! PrecisÃ£o de ${updatedTeamFinal[activeMemberIndex].name} caiu!`, 'enemy');
                }

                if (fxE.statusEffect) {
                  const statusNames = { burn:'ÃƒÂ°Ã‚ÂŸÃ‚Â”Ã‚Â¥ Queimadura', poison:'ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â€ Veneno', sleep:'ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â¤ Sono', paralyze:'ÃƒÂ¢Ã‚ÂšÃ‚Â¡ Paralisia', confuse:'ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â« ConfusÃ£o' };
                  const myStatusList = updatedTeamFinal[activeMemberIndex].status || [];
                  if (!myStatusList.includes(fxE.statusEffect)) {
                    updatedTeamFinal[activeMemberIndex].status = [...myStatusList, fxE.statusEffect];
                    addLog(`${statusNames[fxE.statusEffect]||fxE.statusEffect}: ${updatedTeamFinal[activeMemberIndex].name} foi afetado!`, 'system');
                  }
                }
              }
            } else {
              const enemyDmgRaw = calcDamage(updatedEnemyFinal, enemyMove, updatedTeamFinal[activeMemberIndex]);
              const enemyDmg = Math.max(1, Math.floor(enemyDmgRaw * 0.75));
              const eff = getTypeEffectiveness(enemyMove.type, updatedTeamFinal[activeMemberIndex].type);
              updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - enemyDmg);
              if (eff > 1) addLog(`ðŸ’¥ Golpe de ${updatedEnemyFinal.name} foi super efetivo!`, 'enemy');
              if (eff > 0 && eff < 1) addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â›Ã‚Â¡ÃƒÂ¯Ã‚Â¸Ã‚Â Golpe de ${updatedEnemyFinal.name} nÃ£o foi muito efetivo...`, 'enemy');
              if (eff === 0) addLog(`ÃƒÂ°Ã‚ÂŸÃ‚ÂšÃ‚Â« ${updatedTeamFinal[activeMemberIndex].name} Ã© imune!`, 'enemy');
            }
          }
        }
      }

      // Dano de Status (Jogador)
      if (myStatus.includes('poison') || myStatus.includes('burn')) {
        const dot = Math.max(1, Math.floor(updatedTeamFinal[activeMemberIndex].maxHp / 16));
        updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - dot);
        addLog(`ðŸ’¢ ${myPoke.name} sofreu dano por status!`, 'system');
      }

      // Ã¢Â”Â€Ã¢Â”Â€ SISTEMA DE EXAUSTÃƒO Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
      const STAMINA_DRAIN  = 0.4;   // % perdida por tick
      const EXHAUSTION_DMG = 0.02;  // % do maxHp perdida por tick quando exausto
      const autoStamEnabled = prev.autoConfig?.autoStamina;
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
          addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â˜Ã‚Âµ ${myPoke.name} estÃ¡ exausto! Perdendo vida por falta de comida!`, 'system');
        }
      }

      let finalInventory = { ...prev.inventory };
      let staminaEntry = { value: newStamina, lastFed: prev.stamina?.[myPoke.instanceId]?.lastFed || Date.now() };

      // Auto-alimentar quando abaixo do limiar (apenas se autoStamina estiver ON)
      if (autoStamEnabled && newStamina < FEED_THRESHOLD) {
        // Prioridade: moomoo_milk â†’ lemonade â†’ soda_pop â†’ berry_juice â†’ poke_food_premium â†’ fresh_water â†’ poke_food â†’ berries
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
          addLog(`<t ${myPoke.name} comeu ${itemName} e recuperou energia!`, 'system');

          // Se curar status
          if (restoreData?.cureStatus) {
            updatedTeamFinal[activeMemberIndex].status = [];
            addLog(`( ${myPoke.name} foi curado de problemas de status!`, 'system');
          } else if (restoreData?.cureStatus && Array.isArray(restoreData.cureStatus)) {
             const newStatus = updatedTeamFinal[activeMemberIndex].status.filter(s => !restoreData.cureStatus.includes(s));
             if (newStatus.length < updatedTeamFinal[activeMemberIndex].status.length) {
               updatedTeamFinal[activeMemberIndex].status = newStatus;
               addLog(`( ${myPoke.name} recuperou-se!`, 'system');
             }
          }
        } else {
          if (newStamina <= 0) {
            // Sem comida e chegou a 0 â€” forÃ§ar troca no prÃ³ximo tick
            // O bloco no inÃ­cio do tick vai cuidar da troca/derrota
            if (Math.random() < 0.3) {
              addLog(
                `ðŸ˜µ ${myPoke.name} colapsou de fome! Sem itens para alimentÃ¡-lo!`,
                'system'
              );
            }
          } else if (newStamina < 20 && Math.random() < 0.25) {
            addLog(
              `âš ï¸ ${myPoke.name} estÃ¡ faminto! Compre bebidas no PokÃ© Mart ou cultive Berries!`,
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

  useAutoFarm(gameState.team[activeMemberIndex], gameState.currentRoute, handleBattleTick);

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
        if (currentEnemy.isTrainer) {
          addLog("ÃƒÂ°Ã‚ÂŸÃ‚ÂšÃ‚Â« VocÃª nÃ£o pode capturar PokÃ©mons de outros treinadores!", 'enemy');
          return prev;
        }
        
        let multiplier = 1.0;
        if (itemId === 'great_ball') multiplier = 1.5;
        if (itemId === 'ultra_ball') multiplier = 2.0;

        const catchRate = ((1 - (currentEnemy.hp / currentEnemy.maxHp)) + 0.1) * multiplier;
        if (Math.random() < catchRate) {
          addLog(`ÃƒÂ¢Ã‚ÂœÃ‚Â¨ Capturado! ${currentEnemy.name} agora Ã© seu!`, 'system');
          sfxCapture();
          sessionRef.current.captures.push({ name: currentEnemy.name, id: currentEnemy.id, isShiny: currentEnemy.isShiny });

          const newCaughtData = { ...(prev.caughtData || {}), [currentEnemy.id]: true };
          const newPoke = { 
            ...currentEnemy, 
            id: Number(currentEnemy.id), 
            hp: currentEnemy.maxHp, 
            xp: 0, 
            instanceId: Date.now(),
            stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 }
          };
          const newMastery = processCaptureMastery({ ...currentEnemy, id: Number(currentEnemy.id) }, prev);
          
          const { questUpdate, log: questLog } = updateQuestProgress(prev, 'capture');
          if (questLog) addLog(questLog, 'drop');
          if (questUpdate.inventory) newInventory.items = questUpdate.inventory.items;


          // UnificaÃ§Ã£o por EspÃ©cie: Se jÃ¡ tem na caughtData (antes dessa captura), apenas aumenta maestria
          const alreadyCaught = !!(prev.caughtData || {})[currentEnemy.id];
          if (alreadyCaught) {
            addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â“Ã‚ÂŠ ${currentEnemy.name} jÃ¡ capturado! Maestria aumentada.`, 'system');
            const findAndReplace = (list) => {
              let updated = false;
              const newList = list.map(p => {
                if (Number(p.id) === Number(currentEnemy.id)) {
                  updated = true;
                  if (currentEnemy.isShiny && !p.isShiny) {
                    addLog(`ÃƒÂ¢Ã‚ÂœÃ‚Â¨ Upgrade Shiny: Seu ${p.name} agora Ã© Brilhante!`, 'system');
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
          return { ...prev, inventory: newInventory, team: newTeam, pc: newPC, caughtData: newCaughtData, speciesMastery: newMastery, ...questUpdate };
        } else {
          const enemyName = currentEnemy.name || 'Desconhecido';
          addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â’Ã‚Â¨ O ${enemyName} escapou da PokÃ©bola!`, 'enemy');
        }
      } else if (itemId === 'potions') {
        const activePoke = prev.team[activeMemberIndex];
        if (activePoke) {
          const newTeam = prev.team.map((p, i) => i === activeMemberIndex ? { ...p, hp: Math.min(p.maxHp, p.hp + 20) } : p);
          addLog(`ÃƒÂ°Ã‚ÂŸÃ‚Â§ðŸª Usou PoÃ§Ã£o em ${activePoke.name}!`, 'system');
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
      
      // Ã¢Â”Â€Ã¢Â”Â€ 3. EFEITOS TEMPORÃRIOS (TIMED EFFECTS) Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€Ã¢Â”Â€
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
    const maxHp = Math.ceil((base.maxHp || base.hp || 50) * 1.8 * (lvl / 20)); 
    const statScale = (lvl / 10) * 0.95;

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
      ...base,
      level: lvl,
      hp: maxHp, maxHp,
      attack: Math.ceil((base.attack || 10) * statScale),
      defense: Math.ceil((base.defense || 10) * statScale),
      spAtk: Math.ceil((base.spAtk || 10) * statScale),
      spDef: Math.ceil((base.spDef || 10) * statScale),
      speed: Math.ceil((base.speed || 10) * statScale),
      isShiny: false, status: [],
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
      moves: finalMoves,
      isTrainer: true,
      trainerName: battleData.name,
      trainerSprite: battleData.sprite,
      trainerReward: battleData.reward || 500,
      isBoss: true,
      isRocket: battleData.category === 'rocket',
      isLegendary: battleData.category === 'legendary',
      unlockFlag: battleData.unlockFlag,
      instanceId: Date.now(),
      spawnTime: Date.now(),
      opponentTeam: battleData.team,
      opponentTeamIndex: 0
    });
    setCurrentView('battles');
    // BGM agora gerenciado pelas configuraÃ§Ã­ÃƒÂ‚Ã‚Âµes
    addLog(`ðŸ”¥ DESAFIO: ${battleData.name} iniciou a batalha!`, 'system');
    isProcessingVictory.current = false;
  }, [setCurrentEnemy, setCurrentView, addLog, POKEDEX, MOVES, MOVE_TRANSLATIONS]);

  const handleChallengeGym = useCallback((gymData) => {
    // ComeÃ§a sempre pelo primeiro PokÃ©mon do time
    const teamList = gymData.team || [];
    const leaderPoke = teamList[0];
    if (!leaderPoke) return;
    const base = POKEDEX[leaderPoke.id];
    if (!base) return;
    const lvl = leaderPoke.level || 20;
    const maxHp = Math.ceil((base.maxHp || base.hp || 50) * 1.6 * (lvl / 20)); 
    const statScale = (lvl / 10) * 0.85; 

    // Golpes baseados no learnset do PokÃ©mon atÃ© o nÃ­vel do lÃ­der
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
      ...base,
      level: lvl,
      hp: maxHp, maxHp,
      attack: Math.ceil((base.attack || 10) * statScale),
      defense: Math.ceil((base.defense || 10) * statScale),
      spAtk: Math.ceil((base.spAtk || 10) * statScale),
      spDef: Math.ceil((base.spDef || 10) * statScale),
      speed: Math.ceil((base.speed || 10) * statScale),
      isShiny: false, status: [],
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
      moves: finalMoves,
      isTrainer: true,
      trainerName: gymData.title || gymData.name,
      trainerSprite: gymData.sprite,
      trainerReward: gymData.reward || 1000,
      isGymLeader: true,
      gymId: gymData.id,
      badgeToGive: gymData.badge || null,
      background: gymData.background || null,
      instanceId: Date.now(),
      spawnTime: Date.now(),
      opponentTeam: teamList,
      opponentTeamIndex: 0
    });
    setCurrentView('battles');
    // BGM agora gerenciado pelas configuraÃ§Ã­ÃƒÂ‚Ã‚Âµes
    addLog(`ÂÃ¢Â€Â  GINÃSIO: LÃ­der ${gymData.name} enviou ${base.name}! Nv.${lvl}`, 'system');
    isProcessingVictory.current = false;
  }, [setCurrentEnemy, setCurrentView, addLog, playBGM, POKEDEX, MOVES, MOVE_TRANSLATIONS]);

  const handleCraft = (recipe) => {
    setGameState(prev => {
      // 1. Verificar se tem todos os materiais e dinheiro
      const hasMaterials = Object.entries(recipe.cost).every(([material, amount]) => {
        if (material === 'currency') return prev.currency >= amount;
        return (prev.inventory.materials[material] || 0) >= amount;
      });

      if (!hasMaterials) {
        addLog("Ã¢Ã‚ÂÃ…Â’ Materiais ou Moedas insuficientes!", 'system');
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

      // 3. Adicionar o item ao inventÃ¡rio
      const newItems = { ...prev.inventory.items };
      newItems[recipe.id] = (newItems[recipe.id] || 0) + 1;

      addLog(`ÃƒÂ…Ã‚Â¸ÃƒÂ¢Ã‚Â€Ã‚ÂºÃƒÂ‚ Ã­Â¯ÃƒÂ‚Ã‚Â¸ÃƒÂ‚Ã‚Â VocÃª fabricou: ${recipe.name}!`, 'drop');

      return {
        ...prev,
        currency: newCurrency,
        inventory: {
          ...prev.inventory,
          materials: newMaterials,
          items: newItems
        }
      };
    });
  };

  const handleUseCandy = useCallback((pokemonInstanceId, candyId, useId) => {
    const use = CANDY_USES[useId];
    if (!use) return;

    setGameState(prev => {
      const inventory = prev.inventory || {};
      const candies = inventory.candies || {};
      const currentCount = candies[candyId] || 0;
      
      if (currentCount < use.cost) {
        addLog(`Ã¢Ã‚ÂÃ…Â’ Candies insuficientes (${currentCount}/${use.cost})`, 'system');
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
        addLog(`ÃƒÂ…Ã‚Â¸ÃƒÂ‚Ã‚ÂÃƒÂ‚Ã‚Â¬ ${p.name} consumiu candies e ganhou experiÃªncia!`, 'system');
      } else if (use.effect === 'stat_atk') {
        p.attack = (p.attack || 10) + 2;
        addLog(`ÂÃ‚Â¬ ${p.name} aumentou o Ataque permanentemente!`, 'system');
      } else if (use.effect === 'stat_def') {
        p.defense = (p.defense || 10) + 2;
        addLog(`ÂÃ‚Â¬ ${p.name} aumentou a Defesa permanentemente!`, 'system');
      } else if (use.effect === 'stat_hp') {
        p.maxHp = (p.maxHp || 40) + 5;
        p.hp = Math.min(p.maxHp, p.hp + 5);
        addLog(`ÂÃ‚Â¬ ${p.name} aumentou o HP permanentemente!`, 'system');
      } else if (use.effect === 'stat_speed') {
        p.speed = (p.speed || 10) + 2;
        addLog(`ÂÃ‚Â¬ ${p.name} aumentou a Velocidade permanentemente!`, 'system');
      } else if (use.effect === 'stat_spatk') {
        p.spAtk = (p.spAtk || 10) + 2;
        addLog(`ÂÃ‚Â¬ ${p.name} aumentou o Ataque Especial!`, 'system');
      } else if (use.effect === 'force_evolve') {
        const pokeData = POKEDEX[p.id];
        if (pokeData?.evolution && pokeData.evolution.id <= 151) {
          setEvolutionPending({ ...p, teamIndex: location === 'team' ? pokemonIndex : null, pcIndex: location === 'pc' ? pokemonIndex : null });
          return { ...prev, inventory: newInventory };
        } else {
           addLog(`ÃƒÂ¢ÃƒÂ‚Ã‚ÂÃƒÂ…Ã‚Â’ ${p.name} nÃ£o pode evoluir mais.`, 'system');
           return prev;
        }
      }

      const newList = [...pokemonList];
      newList[pokemonIndex] = p;

      return { ...prev, inventory: newInventory, [location]: newList };
    });
  }, [addLog, setEvolutionPending]);

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
    addLog(`ÃƒÂ°Ã‚ÂŸÃ‚ÂšÃ‚Â€ ExpediÃ§Ã£o para ${biome.name} iniciada! DuraÃ§Ã£o: ~${Math.floor(duration / 60000)}min`, 'system');
  }, [addLog]);

  const handleClaimExpedition = useCallback((biomeId) => {
    setGameState(prev => {
      const exp = prev.expeditions?.[biomeId];
      if (!exp || Date.now() < exp.endsAt) return prev;
      const biome = EXPEDITION_BIOMES[biomeId];
      const duration = Date.now() - exp.startedAt;
      const rawDrops = calcExpeditionDrops(exp.team, biome, duration);
      // Candies sÃ£o exclusivos do farm nas rotas â€” remover das expediÃ§Ã­ÃƒÂ‚Ã‚Âµes
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
        `ÃƒÂ¢ÃƒÂ…Ã‚Â“ÃƒÂ¢Ã‚Â€Ã‚Â¦ ExpediÃ§Ã£o em ${biome.name} concluÃ­da! Coletou: ${dropSummary || 'nada desta vez'}`,
        'drop'
      );
      teamWithXP.forEach(p => {
        if (p.xpGained > 0)
          addLog(`ÃƒÂ¢ÃƒÂ‚Ã‚Â­ÃƒÂ‚Ã‚Â ${p.name} ganhou ${p.xpGained} XP na expediÃ§Ã£o!`, 'system');
      });
      return {
        ...prev,
        pc: [...(prev.pc || []), ...returnedTeam],
        inventory: { ...prev.inventory, materials: newMaterials },
        expeditions: newExpeditions,
      };
    });
  }, [addLog]);

  // Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬ HOUSE SYSTEM HANDLERS Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬Ã¢Ã¢â‚¬ Ã¢â€šÂ¬
  // â”€â”€ AUTO-CAPTURA HANDLERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    addLog(`âœ… Auto-captura configurada para ${route?.name}!`, 'system');
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
    addLog('ðŸ”´ Auto-captura desativada nesta rota.', 'system');
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
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // Comprar a casa
  const handleBuyHouse = useCallback(() => {
    setGameState(prev => {
      if ((prev.currency || 0) < HOUSE_PURCHASE_COST) {
        addLog(`âŒ Coins insuficientes! A casa custa ${HOUSE_PURCHASE_COST} coins.`, 'system');
        return prev;
      }
      addLog(`Â  Casa comprada! Prof. Carvalho ficou orgulhoso!`, 'system');
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

  // Plantar
  const handlePlant = useCallback((slotIndex, plantId) => {
    setGameState(prev => {
      const plant        = PLANTABLE_ITEMS[plantId];
      const caretakers   = prev.house?.caretakers || [];
      const bonus        = calcCombinedCaretakerBonus(caretakers);
      const growthTime   = calcGrowthTime(plant, bonus);

      // Descontar coins do custo da semente
      if ((prev.currency || 0) < plant.cost) {
        addLog(`Ã¢Ã‚ÂÃ…Â’ Coins insuficientes para plantar ${plant.name}!`, 'system');
        return prev;
      }

      const newSlots = [...(prev.house?.slots || [])];
      newSlots[slotIndex] = { plantId, plantedAt: Date.now(), growthTime };

      addLog(`ðŸŒ± ${plant.name} plantado! Pronto em ${Math.floor(growthTime / 60000)} min.`, 'system');
      return {
        ...prev,
        currency: prev.currency - plant.cost,
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
      addLog(`<> Colheu ${plant.name}: ${dropSummary}`, 'drop');

      return {
        ...prev,
        house: { ...prev.house, slots: newSlots },
        inventory: { ...prev.inventory, materials: newMaterials },
      };
    });
  }, [addLog]);

  // Comprar expansÃ£o de slots
  const handleBuySlot = useCallback((expansion) => {
    setGameState(prev => {
      if ((prev.currency || 0) < expansion.cost) return prev;
      addLog(`Ââ€”Â Jardim expandido para ${expansion.totalSlots} canteiros!`, 'system');
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
      addLog(`ÂÃ‚Â¾ ${pokemon.name} agora cuida do jardim!`, 'system');
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
      if (pokemon) addLog(`ÂÃ‚Â¾ ${pokemon.name} voltou ao PC.`, 'system');
      return {
        ...prev,
        pc: newPC,
        house: { ...prev.house, caretakers: newCaretakers },
      };
    });
  }, [addLog]);

  const startBattleAgainstRival = useCallback((battleData) => {
    // Se for um objeto de evento (clique direto sem argumentos do intro), battleData.team serÃ¡ undefined
    if (battleData && battleData.team) {
      const bossPoke = battleData.team[0];
      const maxHp = (bossPoke.maxHp || 50) * 1.5;
      
      setCurrentEnemy({
        ...bossPoke,
        hp: maxHp, maxHp,
        isShiny: false, status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
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
        opponentTeam: battleData.team,
        opponentTeamIndex: 0
      });
      setCurrentView('battles');
      addLog(`ÃƒÂ¢Ã‚ÂšÃ‚Â”ÃƒÂ¯Ã‚Â¸Ã‚ÂÃ­Â¯ÃƒÂ‚Ã‚Â¸ÃƒÂ‚Ã‚Â RIVAL: ${battleData.name} desafiou vocÃª!`, 'system');
      isProcessingVictory.current = false;
      return;
    }

    // LÃ³gica padrÃ£o do Rival Inicial (Azul)
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
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
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
    // BGM agora gerenciado pelas configuraÃ§Ã­ÃƒÂ‚Ã‚Âµes
  }, [gameState.team, gameState.trainer, playBGM, setCurrentEnemy, setCurrentView, addLog]);


  useEffect(() => {
    if (!currentEnemy || currentEnemy.hp > 0) return;
    if (isProcessingVictory.current) return;

    // LÃ³gica de PrÃ³ximo PokÃ©mon do Treinador (Time Multi-Pokemon)
    if (currentEnemy.opponentTeam && currentEnemy.opponentTeamIndex < currentEnemy.opponentTeam.length - 1) {
      const nextIdx = currentEnemy.opponentTeamIndex + 1;
      const nextMember = currentEnemy.opponentTeam[nextIdx];
      const base = POKEDEX[nextMember.id];
      if (base) {
        const lvl = nextMember.level || 5;
        // Multiplicadores baseados no tipo de batalha
        const hpMult = currentEnemy.isGymLeader ? 1.6 : currentEnemy.isBoss ? 1.8 : 1.5;
        const statMult = currentEnemy.isGymLeader ? 0.85 : currentEnemy.isBoss ? 0.95 : 1.2;
        
        const maxHp = Math.ceil((base.maxHp || base.hp || 50) * hpMult * (lvl / 20));
        const statScale = (lvl / 10) * statMult;

        const learnset = base.learnset || [];
        const availableMoves = learnset
          .filter(m => m.level <= lvl)
          .map(m => {
            const mk = (m.move || '').toLowerCase();
            const md = MOVES[mk] || { name: m.move, power: 40, type: 'Normal', category: 'Physical' };
            return { ...md, name: MOVE_TRANSLATIONS[mk] || md.name || m.move };
          });
        const finalMoves = availableMoves.length > 0 ? availableMoves.slice(-4) : [{ name: 'Investida', power: 40, type: 'Normal', category: 'Physical' }];

        addLog(`ðŸ“¢ ${currentEnemy.trainerName} enviou ${base.name}!`, 'enemy');
        
        setCurrentEnemy(prev => ({
          ...prev,
          ...base,
          id: nextMember.id,
          level: lvl,
          hp: maxHp, maxHp,
          attack: Math.ceil((base.attack || 10) * statScale),
          defense: Math.ceil((base.defense || 10) * statScale),
          spAtk: Math.ceil((base.spAtk || 10) * statScale),
          spDef: Math.ceil((base.spDef || 10) * statScale),
          speed: Math.ceil((base.speed || 10) * statScale),
          moves: finalMoves,
          status: [],
          stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
          opponentTeamIndex: nextIdx,
          instanceId: Date.now(),
          spawnTime: Date.now()
        }));
        return;
      }
    }

    isProcessingVictory.current = true;

    // VitÃ³ria! O som de GYM tocarÃ¡ apenas se ganhar insÃ­gnia

    const { drops, messages } = processDrops(currentEnemy);
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
               addLog(`( Desbloqueado: ${u.replace('_', ' ')}!`, 'system');
            }
          });
        }
      }

      if (currentEnemy.badgeToGive && !newBadges.includes(currentEnemy.badgeToGive)) {
        newBadges.push(currentEnemy.badgeToGive);
        addLog(`ÂÃ¢Â€Â¦ Recebeu a InsÃ­gnia: ${currentEnemy.badgeToGive.replace(/_/g, ' ')}!`, 'system');
        sfxGym();
        
        const newShare = newBadges.length * 10;
        addLog(`ÃƒÂ¢Ã‚ÂœÃ‚Â¨ Exp Share aumentado! Sua equipe agora recebe ${newShare}% da experiÃªncia compartilhada!`, 'system');
        
        // Show Oak House modal after 1st badge
        if (newBadges.length === 1 && !prev.worldFlags?.includes('house_owned') && !prev.worldFlags?.includes('oak_house_shown')) {
          setTimeout(() => setShowOakHouseModal(true), 2000);
          tempWorldFlags.push('oak_house_shown');
        }
      }

      // Salvar flag de vitÃ³ria especÃ­fica do inimigo (Rival, Boss, etc)
      if (currentEnemy.unlockFlag && !newFlags.includes(currentEnemy.unlockFlag)) {
        newFlags.push(currentEnemy.unlockFlag);
        addLog(`ðŸš© Progresso: ${currentEnemy.unlockFlag.replace(/_/g, ' ')}!`, 'system');
      }

      // Salvar flag de vitÃ³ria de Elite 4 / LÃ­der de GinÃ¡sio (Fallback)
      if (currentEnemy.gymId && !newFlags.includes(`defeated_elite_${currentEnemy.gymId}`)) {
        newFlags.push(`defeated_elite_${currentEnemy.gymId}`);
      }

      const badgesCount = prev.badges?.length || 0;
      
      // â”€â”€ EFEITOS ATIVOS (TIMED) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const now = Date.now();
      const effects = prev.activeEffects || {};
      
      const xpMult = (effects.activeLuckyEgg?.endsAt > now ? (effects.activeLuckyEgg.xpMult || 1.5) : 1.0) * 
                    (effects.activeSootheBell?.endsAt > now ? (effects.activeSootheBell.xpMult || 1.2) : 1.0);

      const newTeam = prev.team.map((p, i) => {
        const isLead = (i === activeMemberIndex);
        let xpToAdd = 0;

        if (isLead && p.hp > 0) {
          xpToAdd = Math.floor(baseXpGain * xpMult);
        } else if (p.hp > 0 && effects.activeExpShare?.endsAt > now) {
          xpToAdd = Math.floor(baseXpGain * (effects.activeExpShare.xpShare || 0.5) * xpMult);
        } else if (p.hp > 0 && badgesCount > 0) {
          xpToAdd = Math.floor(baseXpGain * (badgesCount * 0.10) * xpMult);
        }

        // Lucky Egg (Antiga LÃ³gica Hold - Mantida para compatibilidade se necessÃ¡rio)
        if (p.heldItem === 'lucky_egg' && !(effects.activeLuckyEgg?.endsAt > now)) {
          xpToAdd = Math.floor(xpToAdd * 1.5);
        }

        if (xpToAdd <= 0) {
           // Se nÃ£o ganhou XP, apenas reseta estÃ¡gios e remove status volÃ¡teis (confusÃ£o)
           if (p.hp > 0) return { 
             ...p, 
             status: (p.status || []).filter(s => s !== 'confuse'),
             stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } 
           };
           return p;
        }

        const newXp = (p.xp || 0) + xpToAdd;
        const n = p.level || 1; const xpNeeded = Math.pow(n + 1, 3) - Math.pow(n, 3);
        const maxLevel = GYM_LEVEL_CAPS[badgesCount] || 100;
        const isLevelCapped = gameState.settings?.levelCap !== false && (p.level || 5) >= maxLevel;

        if (newXp >= xpNeeded) {
          if (isLevelCapped) {
            return { ...p, level: maxLevel, xp: xpNeeded - 1, stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } };
          }

          const newLevel = (p.level || 5) + 1;
          addLog(`ðŸŽ‰ ${p.name} subiu para Nv. ${newLevel}!`, 'system');
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
                  addLog(`ÃƒÂ¢Ã‚Å“Ã‚Â¨ ${p.name} aprendeu ${moveObj.name}! (Salvo na MemÃ³ria)`, 'system');
                }
              }
            });
          }

           if (pokeData?.evolution?.level && !pokeData.evolution.item && newLevel >= pokeData.evolution.level && (pokeData.evolution.id <= 151)) {
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
            stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 }
          };
        }
        return { ...p, xp: newXp, hp: Math.min(p.maxHp, p.hp + Math.ceil(p.maxHp * 0.50)), 
          status: (p.status || []).filter(s => s !== 'confuse'),
          stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } 
        };
      });

      return {
        ...prev,
        currency: (prev.currency || 0) + (drops.currency || 0) + (currentEnemy.trainerReward || 0),
        inventory: newInventory,
        team: newTeam,
        worldFlags: [...newFlags, ...tempWorldFlags].filter((v, i, a) => a.indexOf(v) === i),
        badges: newBadges
      };
    });

    messages.forEach(m => addLog(m, 'drop'));
    if (currentEnemy.isTrainer && currentEnemy.trainerReward) {
      addLog(` Ã¢â‚¬Â  ${currentEnemy.trainerName} derrotado! +${currentEnemy.trainerReward} coins`, 'system');
    }
    if (currentEnemy.isRocket) addLog('ðŸš€ Grunt da Equipe Rocket derrotado!', 'system');
    if (currentEnemy.isShiny) addLog('ÃƒÂ¢Ã‚Å“Ã‚Â¨ PokÃ©mon shiny derrotado!', 'system');

    sessionRef.current.kills += 1;
    sessionRef.current.coins += (drops.currency || 0) + (currentEnemy.trainerReward || 0);
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

        // Verificar se deve tentar capturar este PokÃ©mon
        const hpPctEnemy  = ((currentEnemy.hp / currentEnemy.maxHp) * 100);
        const shouldTry   = prev.autoCapture && prev.autoCaptureConfig?.enabled &&
          !currentEnemy.isTrainer &&
          hpPctEnemy <= hpThresh;

        if (shouldTry) {
          // Verificar modo
          const alreadyHave = prev.team?.some(p => p.id === currentEnemy.id) ||
                              prev.pc?.some(p => p.id === currentEnemy.id);

          const shouldCapture =
            captureMode === 'all'        ? true :
            captureMode === 'shiny_only' ? currentEnemy.isShiny :
            captureMode === 'not_caught' ? !alreadyHave :
            captureMode === 'specific'   ? (routeConfig.targetIds || []).includes(Number(currentEnemy.id)) :
            false;

          if (shouldCapture) {
            // Selecionar a melhor bola disponÃ­vel
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
              const catchRate = ((1 - (currentEnemy.hp / currentEnemy.maxHp)) + 0.1) * mult;

              if (Math.random() < catchRate) {
                // CAPTURADO!
                sessionRef.current.captures.push({ name: currentEnemy.name, id: currentEnemy.id, isShiny: currentEnemy.isShiny });
                
                let newInventoryItems = { 
                  ...prev.inventory.items, 
                  [selectedBall]: (prev.inventory.items[selectedBall] || 0) - 1 
                };
                
                const alreadyCaught = !!(prev.caughtData || {})[currentEnemy.id];
                const newCaughtData = { ...(prev.caughtData || {}), [currentEnemy.id]: true };
                const newMastery = processCaptureMastery({ ...currentEnemy, id: Number(currentEnemy.id) }, prev);
                
                const { questUpdate, log: questLog } = updateQuestProgress(prev, 'capture');
                if (questLog) addLog(questLog, 'drop');
                if (questUpdate.inventory) newInventoryItems = questUpdate.inventory.items;


                addLog(
                  `${currentEnemy.isShiny ? 'âœ¨ SHINY ' : ''}${currentEnemy.name} capturado automaticamente com ${ITEM_LABELS[selectedBall]?.name || selectedBall}!`,
                  'system'
                );
                sfxCapture();

                if (alreadyCaught) {
                  const findAndReplace = (list) => list.map(p => {
                    if (Number(p.id) === Number(currentEnemy.id)) {
                      if (currentEnemy.isShiny && !p.isShiny) {
                        addLog(`âœ¨ Upgrade Shiny: Seu ${p.name} agora Ã© Brilhante!`, 'system');
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
                  const newPoke = { ...currentEnemy, id: Number(currentEnemy.id), hp: currentEnemy.maxHp, xp: 0, instanceId: Date.now() };
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
      if (currentEnemy.isInitialRival) {
        setCurrentView('rival_post_battle');
      } else if (currentEnemy.unlockFlag === 'rival_1_defeated') {
        setCurrentView('prof_oak_starters_announcement');
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
    
    if (!user) return <AuthScreen onAuthSuccess={() => {}} />;

    switch(currentView) {
      case 'landing': {
        const hasSave = (gameState.team && gameState.team.length > 0);
        return (
          <div className="h-full flex flex-col items-center justify-center bg-[#0F2D3A] p-6 relative overflow-hidden text-center">

             <div className="relative z-10 animate-fadeIn flex flex-col items-center">
                <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                  <h1 
                    className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter drop-shadow-md text-[#FFCB05]"
                    style={{ WebkitTextStroke: '2px #CC0000' }}
                  >
                    POKÃ‰CRAFT <span className="text-slate-800" style={{ WebkitTextStroke: '0px' }}>IDLE</span>
                  </h1>
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" className="w-24 h-24 mt-2 animate-float-slow drop-shadow-xl" alt="Snorlax" />
                </div>
                
                {hasSave && (
                  <button 
                    onClick={() => setCurrentView('city')} 
                    className="w-full max-w-xs md:max-w-md bg-white text-pokeBlue px-8 py-4 md:py-6 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl hover:translate-y-1 transition-all text-lg md:text-xl border-b-8 border-slate-200 mb-4"
                  >
                    Continuar Jornada
                  </button>
                )}

                <button 
                  onClick={async () => {
                    const startNewJourney = async () => {
                      const freshState = JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));
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

                    if (hasSave) {
                      showConfirm({
                        type: 'danger',
                        title: 'Nova Jornada',
                        message: 'Isso apagará permanentemente todo seu progresso atual na nuvem. Tem certeza?',
                        confirmLabel: 'Sim, recomeçar',
                        cancelLabel: 'Não, voltar',
                        onConfirm: () => { closeConfirm(); startNewJourney(); },
                        onCancel: closeConfirm,
                      });
                    } else {
                      startNewJourney();
                    }
                  }} 
                  className={`w-full max-w-xs md:max-w-md ${hasSave ? 'bg-blue-400/20 border-2 border-white/30 text-white' : 'bg-white text-pokeBlue'} px-8 py-4 md:py-5 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl hover:translate-y-1 transition-all text-sm md:text-lg`}
                >
                  {hasSave ? 'Reiniciar Jornada' : 'Nova Jornada'}
                </button>

                 <p className="mt-8 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                   PokÃ©Craft Idle v{APP_VERSION} â€¢ {APP_VERSION_DATE}
                 </p>
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
        const dialogues = [
          "OlÃ¡! Bem-vindo ao mundo POKÃ‰MON!",
          "Meu nome Ã© CARVALHO. As pessoas me chamam de PROFESSOR POKÃ‰MON.",
          "Este mundo Ã© habitado por criaturas chamadas POKÃ‰MON!",
          "Para alguns, POKÃ‰MON sÃ£o animais de estimaÃ§Ã£o. Outros os usam para lutar.",
          "Eu... Eu estudo POKÃ‰MON como profissÃ£o.",
          "Mas primeiro, diga-me... Qual Ã© o seu nome?"
        ];
        
        const isLastStep = introStep === dialogues.length - 1;
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

            {/* DiÃ¡logo box â€” estilo Game Boy */}
            <div className="relative z-10 w-full max-w-xl mb-4">
              <div className="bg-white/95 backdrop-blur-sm p-5 md:p-8 rounded-[2rem] shadow-2xl border-b-[8px] border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-8 h-8 rounded-full object-contain bg-slate-100 p-0.5" alt="" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prof. Carvalho</span>
                </div>
                <div className="min-h-[60px] md:min-h-[80px] flex items-center">
                  <p className="text-base md:text-xl font-black text-slate-800 italic leading-tight uppercase tracking-tight">
                    "{dialogues[introStep]}"
                  </p>
                </div>

                {isLastStep && (
                  <div className="mt-5 animate-bounceIn">
                    <input 
                      type="text" 
                      placeholder="SEU NOME..." 
                      value={gameState.trainer?.name || ''} 
                      onChange={(e) => setGameState(prev => ({ ...prev, trainer: { ...prev.trainer, name: e.target.value.toUpperCase() } }))}
                      className="w-full bg-slate-100 border-4 border-slate-200 p-4 rounded-2xl text-center font-black text-lg uppercase tracking-widest focus:border-pokeBlue outline-none transition-all"
                      autoFocus
                    />
                  </div>
                )}

                <button 
                  onClick={() => {
                    if (isLastStep) {
                      if (!gameState.trainer?.name || gameState.trainer.name.length < 2) {
                        showConfirm({
                          title: 'Nome Inválido',
                          message: 'Diga-me seu nome para continuarmos!',
                          onConfirm: closeConfirm
                        });
                        return;
                      }
                      setCurrentView('trainer_creation');
                    } else {
                      setIntroStep(s => s + 1);
                    }
                  }}
                  className="w-full mt-5 bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg active:scale-95"
                >
                  {isLastStep ? 'Tudo Pronto!' : 'PrÃ³ximo â–¶'}
                </button>
              </div>
            </div>
          </div>
        );
      }
      case 'trainer_creation': return (
        <div className="h-full bg-slate-50 flex flex-col items-center justify-start pt-24 p-6 animate-fadeIn relative">
           <h2 className="text-5xl font-black text-slate-800 uppercase italic mb-2 tracking-tighter text-center">Muito bem, {gameState.trainer?.name}!</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest mb-12">Escolha seu Avatar</p>
           
           <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-5xl p-8 bg-white rounded-[3rem] shadow-2xl border-b-8 border-slate-200">
              {trainerAvatars.map(a => (
                <button 
                  key={a.id} 
                  onClick={() => { 
                    setGameState(prev => ({ 
                      ...prev, 
                      trainer: { ...prev.trainer, level: 1, xp: 0, avatarImg: a.img } 
                    })); 
                    setCurrentView('starter_selection'); 
                  }}
                  className="bg-slate-50 p-4 rounded-[2rem] border-4 border-transparent hover:border-pokeBlue hover:bg-blue-50 transition-all group flex flex-col items-center gap-2"
                >
                   <div className="w-20 h-20 flex items-center justify-center">
                     <img 
                       src={a.img} 
                       onError={e => { e.target.closest('button')?.style.setProperty('display', 'none'); }}
                       className="w-full h-full object-contain group-hover:scale-125 transition-transform" 
                       alt={a.name} 
                     />
                   </div>
                   <span className="text-[8px] font-black uppercase text-slate-400 group-hover:text-pokeBlue">{a.name}</span>
                </button>
              ))}
           </div>
        </div>
      );
      case 'starter_selection': return (
        <div className="h-full bg-slate-100 flex flex-col items-center animate-fadeIn relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-200 opacity-50 pointer-events-none"></div>
           
           <div className="relative z-10 text-center pt-6 pb-3 px-6 flex-shrink-0">
             <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-1">Escolha seu Parceiro</h2>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Cada jornada comeÃ§a com um Ãºnico passo</p>
           </div>

           <div className="flex flex-col gap-3 w-full max-w-2xl relative z-10 overflow-y-auto custom-scrollbar px-6 pb-6 flex-1" style={{ minHeight: 0 }}>
              {INITIAL_POKEMONS.map(p => {
                const typeColors = {
                  Grass: 'bg-green-500', Fire: 'bg-orange-500',
                  Water: 'bg-blue-500', Electric: 'bg-yellow-400',
                  Normal: 'bg-slate-400'
                };
                return (
                  <button 
                    key={p.id} 
                    onClick={() => setPreviewStarter(p)}
                    className="group bg-white p-4 rounded-[2rem] shadow-lg border-4 border-transparent hover:border-pokeBlue transition-all flex items-center gap-3 text-left relative flex-shrink-0"
                  >
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10 border-2 border-slate-100 flex-shrink-0">
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} className="w-full h-full object-contain drop-shadow-lg scale-125" alt={p.name} />
                     </div>
                     <div className="flex-1 relative z-10 min-w-0">
                        <h3 className="text-lg font-black text-slate-800 uppercase italic leading-none mb-1.5 truncate">{p.name}</h3>
                        <div className="flex items-center gap-2">
                           <span className={`${typeColors[p.type] || 'bg-slate-400'} text-white text-[9px] px-3 py-0.5 rounded-full font-black uppercase tracking-widest flex-shrink-0`}>
                             {p.type}
                           </span>
                           <span className="text-slate-300 font-bold text-[9px] uppercase">Ver detalhes</span>
                        </div>
                     </div>
                     <div className="text-slate-200 font-black text-2xl italic select-none flex-shrink-0">
                        #{String(p.id).padStart(3,'0')}
                     </div>
                  </button>
                );
              })}
           </div>

           {/* MODAL DE PREVIEW */}
           {previewStarter && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
                <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl border-b-[16px] border-slate-200 overflow-hidden relative animate-bounceIn">
                   <button onClick={() => setPreviewStarter(null)} className="absolute top-8 right-8 bg-slate-100 p-4 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-20">
                      <span className="font-black">âœ–</span>
                   </button>

                   <div className={`h-40 w-full relative flex items-end justify-center ${previewStarter.type === 'Grass' ? 'bg-green-500' : previewStarter.type === 'Fire' ? 'bg-orange-500' : previewStarter.type === 'Water' ? 'bg-blue-500' : 'bg-slate-400'}`}>
                      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-64 h-64 absolute -top-10 -left-10 rotate-12" alt="" />
                      </div>
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${previewStarter.id}.png`} className="w-64 h-64 object-contain drop-shadow-2xl translate-y-20 relative z-10" alt={previewStarter.name} />
                   </div>

                   <div className="p-10 pt-20">
                      <div className="text-center mb-8">
                         <h3 className="text-5xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">{previewStarter.name}</h3>
                         <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2 block">Status NÃ­vel 5</span>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
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
                                <span className="text-[10px] font-black text-slate-400 w-10">{s.label}</span>
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
                                    <span className="text-[10px] font-black uppercase text-slate-700">{m.name}</span>
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
                             stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 }
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
                        className="w-full mt-10 bg-pokeBlue text-white py-6 rounded-3xl font-black uppercase tracking-widest text-lg shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"
                      >
                        EU ESCOLHO VOCÃŠ!
                      </button>
                   </div>
                </div>
             </div>
           )}
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
           {/* BalÃ£o na parte inferior */}
           <div className="w-full relative z-10 p-4">
             <div className="bg-white p-6 rounded-[2rem] shadow-2xl border-b-[10px] border-blue-600 w-full">
               <h3 className="text-lg font-black text-slate-800 italic uppercase mb-3 tracking-tighter">Rival Azul:</h3>
               <p className="text-sm font-bold text-slate-600 mb-4 italic">"Ei, espere aÃ­! Eu tambÃ©m quero um POKÃ‰MON! E eu vou escolher este aqui!"</p>
               <p className="text-sm font-black text-blue-500 mb-4 uppercase tracking-widest animate-pulse">"Vejamos quem Ã© o melhor treinador!"</p>
               <button
                 onClick={startBattleAgainstRival}
                 className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
               >Batalhar!</button>
             </div>
           </div>
        </div>
      );
    }
      case 'rival_post_battle': {
        const labBg = fixPath('/battle_bg_lab_1776866008842.png');
        return (
          <div className="h-full flex flex-col items-center animate-fadeIn relative overflow-hidden"
            style={{ backgroundImage: `url(${labBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
             <div className="absolute inset-0 bg-black/30"></div>
             {/* Sprite centrado */}
           <div className="flex-1 flex items-center justify-center relative z-10">
             <img src="https://play.pokemonshowdown.com/sprites/trainers/blue.png" className="h-72 drop-shadow-2xl animate-fadeOutRight" alt="Rival" />
           </div>
           {/* BalÃ£o na parte inferior */}
           <div className="w-full relative z-10 p-4">
             <div className="bg-white p-6 rounded-[2rem] shadow-2xl border-b-[10px] border-blue-600 w-full">
               <h3 className="text-lg font-black text-slate-800 italic uppercase mb-3 tracking-tighter">Rival Azul:</h3>
               <p className="text-sm font-bold text-slate-600 mb-3 italic">"Beleza! Vou fazer meu POKÃ‰MON lutar para deixÃ¡-lo mais forte!"</p>
               <p className="text-sm font-black text-blue-500 mb-4 uppercase tracking-widest">"VovÃ´! Fui!"</p>
               <button
                 onClick={() => setCurrentView('quest_oak')}
                 className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg"
               >Continuar</button>
             </div>
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
          {/* BalÃ£o na parte inferior */}
          <div className="w-full relative z-10 p-4">
            <div className="bg-white p-5 rounded-[2rem] shadow-2xl border-b-[10px] border-slate-800 w-full">
              <h3 className="text-lg font-black text-slate-800 italic uppercase mb-2 tracking-tighter">Prof. Carvalho:</h3>
              <p className="text-sm font-bold text-slate-600 mb-2 italic">"Que batalha incrÃ­vel! VocÃªs dois tÃªm muito talento."</p>
              <p className="text-sm font-black text-pokeBlue mb-4 uppercase tracking-tighter leading-tight">
                "Agora, preciso que vocÃª aprenda a capturar POKÃ‰MONS. VÃ¡ atÃ© a ROTA 1 e capture seu primeiro parceiro!"
              </p>
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 mb-4">
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Nova MissÃ£o:</p>
                 <p className="text-xs font-bold text-slate-800 uppercase mt-1 italic">Capture 1 PokÃ©mon na Rota 1</p>
                 <p className="text-[9px] font-black text-slate-400 mt-1 uppercase">Recompensa: 10 PokÃ©bolas</p>
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
                <p className="text-sm font-bold text-slate-600 mb-2 italic">"Veja sÃ³! Azul me contou que capturou PokÃ©mon incrÃ­veis nestas rotas!"</p>
                <p className="text-sm font-black text-pokeBlue mb-4 uppercase tracking-tighter leading-tight">
                  "Parece que Bulbasaur, Charmander e outros iniciais estÃ£o aparecendo raramente por aqui. Fique atento!"
                </p>
                <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 mb-4">
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Desbloqueio Especial </p>
                   <p className="text-xs font-bold text-slate-800 uppercase mt-1 italic">Iniciais RarÃ­ssimos agora aparecem nas Rotas 1, 22 e Floresta!</p>
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
                >Vou ProcurÃ¡-los!</button>
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
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">ðŸ˜ï¸</div>
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
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">ðŸŒ¿</div>
                    <div>
                       <h3 className="font-black text-xl text-slate-800 uppercase italic">Rota 1</h3>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Iniciar Capturas</p>
                    </div>
                 </button>
              </div>
              
              <div className="mt-12 flex justify-center">
                 <div className="bg-slate-100 px-6 py-3 rounded-full flex items-center gap-3">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-6 h-6" alt="Pokeball" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VocÃª recebeu 10 PokÃ©bolas!</span>
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
          />

          {/* Modal do Prof. Carvalho sobre a Casa */}
          {showOakHouseModal && (
            <div className="absolute inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
              <div className="w-full max-w-xl bg-white rounded-[4rem] overflow-hidden shadow-2xl animate-bounceIn border-b-[12px] border-slate-200">
                <div className="bg-amber-50 p-10">
                  <div className="flex items-center gap-6 mb-6">
                    <img
                      src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                      className="w-24 h-24 object-contain"
                      alt="Prof. Carvalho"
                    />
                    <div>
                      <p className="text-amber-900 text-[10px] font-black uppercase tracking-widest">Professor Carvalho</p>
                      <p className="text-amber-800 font-black text-2xl italic leading-tight">
                        "Sua jornada merece uma base!"
                      </p>
                    </div>
                  </div>
                  <p className="text-amber-900 text-sm leading-relaxed mb-6 font-medium">
                    ParabÃ©ns por vencer o GinÃ¡sio de Pewter! VocÃª estÃ¡ crescendo como treinador.
                    Que tal ter sua prÃ³pria casa? LÃ¡ vocÃª pode cultivar Berries e Apricorns para
                    fabricar PokÃ©bolas especiais e itens raros. Com PokÃ©mon de Grama e Ã­Â gua como
                    cuidadores, suas plantaÃ§Ã­ÃƒÂ‚Ã‚Âµes crescerÃ£o muito mais rÃ¡pido!
                  </p>
                  <div className="bg-white/60 rounded-3xl p-5 mb-6 border-2 border-amber-200 shadow-inner">
                    <p className="text-amber-800 font-black text-lg flex items-center gap-2">ðŸ  Custo da Casa</p>
                    <div className="flex justify-between items-center mt-2">
                       <p className="text-amber-900 text-sm font-bold">
                          ðŸ’° {HOUSE_PURCHASE_COST.toLocaleString()} coins
                       </p>
                       <p className="text-amber-700 text-xs font-black uppercase tracking-widest">4 canteiros iniciais</p>
                    </div>
                    <div className={`mt-3 p-3 rounded-xl font-black text-xs uppercase text-center ${(gameState.currency || 0) >= HOUSE_PURCHASE_COST ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {(gameState.currency || 0) >= HOUSE_PURCHASE_COST
                        ? "ÃƒÂ¢Ã‚ÂœÃ‚Â… VocÃª tem coins suficientes!"
                        : `L Falta ${(HOUSE_PURCHASE_COST - (gameState.currency || 0)).toLocaleString()} coins`}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowOakHouseModal(false)}
                      className="flex-1 bg-slate-200 text-slate-700 py-5 rounded-2xl font-black uppercase text-sm hover:bg-slate-300 transition-all"
                    >
                      Depois
                    </button>
                    <button
                      onClick={handleBuyHouse}
                      disabled={(gameState.currency || 0) < HOUSE_PURCHASE_COST}
                      className={`flex-[2] py-5 rounded-2xl font-black uppercase text-sm shadow-xl transition-all active:scale-95 ${
                        (gameState.currency || 0) >= HOUSE_PURCHASE_COST
                          ? "bg-amber-500 text-white hover:bg-amber-400"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      ðŸ  Comprar Casa!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showHouse && (
            <HouseScreen
              gameState={gameState}
              onClose={() => setShowHouse(false)}
              onPlant={handlePlant}
              onHarvest={handleHarvest}
              onBuySlot={handleBuySlot}
              onAssignCaretaker={handleAssignCaretaker}
              onRemoveCaretaker={handleRemoveCaretaker}
            />
          )}

          {showExpeditions && (
            <ExpeditionsScreen
              gameState={gameState}
              onClose={() => setShowExpeditions(false)}
              onStartExpedition={(biomeId, team) => {
                handleStartExpedition(biomeId, team);
                setShowExpeditions(false);
              }}
              onClaimExpedition={(biomeId) => handleClaimExpedition(biomeId)}
            />
          )}

          {showOakStaminaModal && (
            <div className="absolute inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
              <div className="w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-bounceIn border-b-[12px] border-slate-200">
                <div className="bg-green-50 p-10">
                  <div className="flex items-center gap-6 mb-8">
                    <img
                      src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                      className="w-24 h-24 object-contain"
                      alt="Prof. Carvalho"
                    />
                    <div>
                      <p className="text-green-900 text-[10px] font-black uppercase tracking-widest leading-none">Professor Carvalho</p>
                      <p className="text-green-800 font-black text-3xl italic leading-tight mt-1">
                        "Antes de partir!"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-green-900 text-base font-medium leading-relaxed italic">
                      Seus PokÃ©mon precisam se <strong>alimentar</strong> durante as batalhas. Quanto mais lutam, mais energia gastam!
                    </p>

                    <div className="bg-white/80 rounded-[2.5rem] p-6 border-2 border-green-200 shadow-inner">
                      <p className="text-green-800 text-xs font-black uppercase tracking-[0.2em] mb-4">ðŸ´ O que alimenta seus PokÃ©mon:</p>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-green-100">
                          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png" className="w-8 h-8 object-contain" alt="berry" />
                          <p className="text-green-700 text-[11px] leading-tight font-bold"><strong>Berries</strong> â€” cultive na sua casa. Oran e Sitrus Berry sÃ£o essenciais.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-green-100">
                          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-8 h-8 object-contain" alt="agua" />
                          <p className="text-green-700 text-[11px] leading-tight font-bold"><strong>Ãguas e Soda</strong> â€” compre no PokÃ© Mart para restaurar energia rÃ¡pido.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-green-100">
                          <span className="text-2xl w-8 text-center">ðŸ”‹</span>
                          <p className="text-green-700 text-[11px] leading-tight font-bold"><strong>RaÃ§Ã£o PokÃ©mon</strong> â€” pode ser fabricada na Forja com materiais simples.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                       <div className="flex-1 bg-red-50 rounded-3xl p-4 border-2 border-red-100">
                         <p className="text-red-700 text-[10px] font-black uppercase tracking-widest mb-1">âš ï¸ Perigo!</p>
                         <p className="text-red-600 text-[10px] font-bold leading-tight">
                           Energia zerada causa exaustÃ£o e perda constante de vida.
                         </p>
                       </div>
                       <div className="flex-1 bg-blue-50 rounded-3xl p-4 border-2 border-blue-100">
                         <p className="text-blue-700 text-[10px] font-black uppercase tracking-widest mb-1">ðŸ’¡ Dica!</p>
                         <p className="text-blue-600 text-[10px] font-bold leading-tight">
                           O sistema alimenta automaticamente com o melhor item disponÃ­vel.
                         </p>
                       </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[2.5rem] p-6 border-2 border-amber-200 mb-8 shadow-xl">
                    <p className="text-amber-800 text-[10px] font-black uppercase tracking-widest">ðŸŽÂ Presente do Professor:</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-amber-100 rotate-3">
                        <img
                          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png"
                          className="w-10 h-10 object-contain"
                          alt="Ãgua Fresca"
                        />
                      </div>
                      <div>
                        <p className="text-amber-800 font-black text-xl italic leading-none">10x Ãgua Fresca</p>
                        <p className="text-amber-700 text-[10px] font-bold mt-1 uppercase">Para comeÃ§ar sua jornada!</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowOakStaminaModal(false)}
                    className="w-full bg-green-600 text-white py-6 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-green-500 transition-all shadow-xl shadow-green-200 active:scale-95"
                  >
                    Obrigado, Professor! ÂÂ
                  </button>
                </div>
              </div>
            </div>
          )}
          {showExpeditions && (
            <ExpeditionsScreen
              gameState={gameState}
              onClose={() => setShowExpeditions(false)}
              onStartExpedition={(biomeId, team) => {
                handleStartExpedition(biomeId, team);
                setShowExpeditions(false);
              }}
              onClaimExpedition={(biomeId) => handleClaimExpedition(biomeId)}
            />
          )}
        </>
      );

      case 'vs': return (
        <VsScreen
          gameState={gameState}
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
        />
      );

      case 'prof_oak_starters_announcement': return (
        <div className="h-full flex flex-col items-center justify-center bg-[#0F2D3A] p-6 text-center animate-fadeIn">
          <div className="bg-slate-900 border-2 border-white/10 rounded-[3rem] p-8 max-w-sm shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-400/20 blur-3xl rounded-full"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mb-6 border-4 border-white/10 overflow-hidden shadow-inner">
                <img 
                  src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" 
                  className="w-24 h-24 object-contain mt-4" 
                  alt="Professor Carvalho" 
                />
              </div>

              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">
                MENSAGEM DO PROF. CARVALHO
              </h2>

              <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                <p className="text-white/80 text-sm font-bold leading-relaxed italic">
                  "IncrÃ­vel! Meus parabÃ©ns por derrotar o Azul na Rota 1! Acabo de receber relatos fantÃ¡sticos... os PokÃ©mon iniciais <span className="text-green-400">Bulbasaur</span>, <span className="text-orange-400">Charmander</span> e <span className="text-blue-400">Squirtle</span> foram avistados selvagens na Rota 1 e na Floresta!"
                </p>
                <p className="text-white/80 text-sm font-bold leading-relaxed italic mt-4">
                  "Parece que eles decidiram se aventurar alÃ©m do meu laboratÃ³rio. Agora vocÃª pode encontrÃ¡-los e capturÃ¡-los! Boa sorte na sua jornada!"
                </p>
              </div>

              <button 
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    worldFlags: [...(prev.worldFlags || []), 'starters_spotted']
                  }));
                  setCurrentView('vs');
                }}
                className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-yellow-400 transition-all shadow-xl active:scale-95"
              >
                ENTENDIDO!
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-4 opacity-50 grayscale animate-pulse">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" className="w-12 h-12" alt="Bulba" />
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" className="w-12 h-12" alt="Char" />
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" className="w-12 h-12" alt="Squirtle" />
          </div>
        </div>
      );

      case 'battles': return (
        <BattleScreen 
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
          ROUTES={processedRoutes}
          fixPath={fixPath}
          TYPE_COLORS={TYPE_COLORS}
          onGoToCity={handleGoToCity}
          onChallengeBoss={(battle) => {
            if (battle.type === 'rival') {
              startBattleAgainstRival(battle);
            } else if (battle.type === 'gym_leader' || battle.type === 'elite' || battle.type === 'boss' || battle.type === 'rocket' || battle.type === 'legendary') {
              startKeyBattle(battle);
            }
          }}
        />
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
          handleUseCandy={handleUseCandy}
          setCurrentView={setCurrentView}
          setVsInitialTab={setVsInitialTab}
        />
      );

      case 'forge_screen': return (
        <div className="h-full bg-slate-100 flex flex-col items-center p-6 animate-fadeIn relative overflow-hidden">
           <div className="absolute inset-0 opacity-5 pointer-events-none">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hammer.png" className="absolute top-10 right-10 w-64 h-64 -rotate-12" alt="" />
           </div>

           <div className="relative z-10 w-full max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                 <button onClick={() => setCurrentView('city')} className="bg-slate-800 p-4 rounded-3xl shadow-xl hover:bg-slate-700 transition-all">
                    <span className="text-xl text-white">Ã¢Ã¢Â€Â Ã‚Â</span>
                 </button>
                 <div>
                    <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Forja PokÃ©mon</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Transforme essÃªncias em poder</p>
                 </div>
              </div>

              <div className="bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border-2 border-white shadow-inner mb-6">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Seus Materiais</h4>
                    <span className="text-[10px] font-black text-pokeBlue uppercase bg-blue-50 px-3 py-1 rounded-full">ðŸ’° {gameState.currency} Coins</span>
                 </div>
                 <div className="flex flex-wrap justify-center gap-3">
                    {Object.entries(gameState.inventory.materials)
                      .filter(([_, qty]) => qty > 0)
                      .map(([id, qty]) => (
                        <div key={id} className="bg-white px-4 py-2 rounded-2xl shadow-sm border-2 border-slate-50 flex items-center gap-2">
                           <span className="text-xs font-black text-slate-800">{qty}x</span>
                           <span className="text-[9px] font-bold text-slate-500 uppercase">{id.replace('_essence', '').replace('_', ' ')}</span>
                        </div>
                      ))}
                 </div>
              </div>

              <CraftingStation 
                recipes={CRAFTING_RECIPES}
                inventory={gameState.inventory}
                currency={gameState.currency}
                onCraft={handleCraft}
              />

              <button 
                onClick={() => setCurrentView('city')}
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
        />
      );

      case 'defeat_screen': return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-900 p-8 relative overflow-hidden animate-fadeIn">
           {/* Efeito de Nevoeiro FantasmagÃ³rico */}
           <div className="absolute inset-0 opacity-30 pointer-events-none bg-gradient-to-t from-purple-900 to-transparent"></div>
           
           <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
              <div className="flex gap-8 mb-12 animate-float">
                 <img src="https://play.pokemonshowdown.com/sprites/ani/gastly.gif" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" alt="Gastly" />
                 <img src="https://play.pokemonshowdown.com/sprites/ani/haunter.gif" className="w-28 h-28 drop-shadow-[0_0_20px_rgba(168,85,247,0.7)] delay-75" alt="Haunter" />
              </div>

              <div className="bg-slate-800/80 backdrop-blur-md p-10 rounded-[3rem] border-2 border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                <h2 className="text-4xl font-black text-purple-400 uppercase italic mb-6 tracking-tighter">Hehehe...</h2>
                <p className="text-white font-bold text-lg mb-10 italic leading-tight">
                  "Vimos vocÃª cair... NÃ£o se preocupe, treinador. NÃ³s o levamos para um lugar seguro."
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
        <PokedexScreen 
          POKEDEX={Object.fromEntries(Object.entries(POKEDEX).filter(([id]) => Number(id) <= 151))} 
          caughtData={gameState.caughtData} 
          team={gameState.team}
          box={gameState.pc}
          onBack={() => setCurrentView(lastNonMenuView.current)} 
        />
      );
      case 'heal_after_defeat': return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-100 p-6 text-center animate-fadeIn relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src={fixPath('/battle_bg_pokecenter_1776868686753.png')} className="w-full h-full object-cover" alt="Pokecenter" />
             <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png" className="w-48 h-48 mb-6 animate-bounce drop-shadow-xl" alt="Chansey" />
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-b-[12px] border-red-100 w-full">
               <h3 className="text-2xl font-black text-slate-800 italic uppercase mb-4 tracking-tighter">Enfermeira Chansey:</h3>
               <p className="text-lg font-bold text-slate-600 mb-8 italic leading-tight">
                 "Oh cÃ©us! VocÃª e seus POKÃ‰MONS parecem exaustos. Deixe-me cuidar de tudo rapidamente!"
               </p>
               <button 
                 onClick={() => { 
                   stopSFX();
                   sfxHeal();
                   setGameState(prev => ({ ...prev, team: prev.team.map(p => ({ ...p, hp: p.maxHp, stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } })) })); 
                   goToCity(true); 
                 }}
                 className="w-full bg-red-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-400 transition-all shadow-lg flex items-center justify-center gap-4 border-b-8 border-red-700"
               >
                 <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png" className="w-8 h-8" alt="Heal" />
                 Restaurar Equipe
               </button>
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className={`app-shell ${gameState.settings?.displayMode === 'pc' ? 'pc-mode' : ''}`}>
      {(!loading && user) ? (
        <>
          <header className="bg-pokeRed p-3 text-white flex justify-between items-center shadow-md border-b-2 border-red-700 flex-shrink-0 relative z-50">
            <div className="flex items-center gap-2">
               <button onClick={() => setCurrentView('landing')} className="p-1.5 hover:bg-white/10 rounded-lg transition-all">
                 <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/escape-rope.png" className="w-5 h-5" alt="back" />
               </button>
               <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-6 h-6 animate-spin-slow" alt="ball" />
               <span className="font-black uppercase italic tracking-tighter">PokÃ©Craft Idle</span>
            </div>
            <div className="flex gap-4 items-center">
                <button
                 onClick={() => toggleMute()}
                 className="flex items-center gap-1 bg-black/20 px-2 py-1.5 rounded-full hover:bg-black/30 transition-all border border-white/10"
               >
                  <span className="text-sm">{muted ? 'ðŸ”‡' : 'ðŸ”Š'}</span>
               </button>
               <button onClick={() => { showConfirm({
                    title: 'Voltar ao Início',
                    message: 'Deseja realmente sair? Seu progresso foi salvo automaticamente.',
                    onConfirm: () => {
                      setCurrentView('landing');
                      closeConfirm();
                    }
                  }) }} className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full hover:bg-black/30 transition-all border border-white/10">
                 <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-doll.png" className="w-4 h-4" alt="Home" />
                 <span className="text-[10px] font-black uppercase">Home</span>
               </button>
               <div className="flex items-center gap-1">
                 <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4" alt="currency" />
                 <span className="text-xs font-black">{gameState.currency}</span>
               </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto overscroll-contain pt-4 px-4 pb-0 w-full relative z-10 custom-scrollbar" style={{ minHeight: 0 }}>
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

      {sessionStats && (
        <div className="absolute inset-0 z-[100] flex items-end justify-center pb-20 px-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-b-8 border-slate-200 overflow-hidden animate-bounceIn">
            <div className="bg-pokeRed px-5 py-4 flex items-center gap-3">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-8 h-8" alt="" />
              <div>
                <h2 className="text-white font-black uppercase italic tracking-tighter text-lg leading-none">Resumo da Jornada</h2>
                <p className="text-red-200 text-[10px] font-bold uppercase tracking-widest">SessÃ£o de batalha</p>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: 'âš”ï¸Ã¯Â¸ÂÂ', label: 'Nocautes', value: sessionStats.kills },
                  { icon: '(', label: 'Shinies', value: sessionStats.shinyKills + sessionStats.captures.filter(c => c.isShiny).length },
                  { icon: 'ÂÃ¢Â€Â ', label: 'Trainers', value: sessionStats.trainers },
                  { icon: 'ðŸ’°', label: 'Coins',    value: sessionStats.coins  },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className="font-black text-slate-800 text-sm leading-none">{s.value}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              
              {/* DROPS */}
              {Object.keys(sessionStats.drops).length > 0 && (
                <div className="bg-amber-50/50 p-4 rounded-3xl border border-amber-100">
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="text-sm">ðŸ“¦</span> Itens Coletados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sessionStats.drops).map(([mat, qty]) => {
                      const item = ITEM_LABELS[mat] || { icon: 'ðŸ’Ž', name: mat.split('_').pop() };
                      return (
                        <div key={mat} className="flex items-center gap-1.5 bg-white border border-amber-200 rounded-xl px-2.5 py-1 shadow-sm">
                          <span className="text-xs">{item.icon}</span>
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
                    <span className="text-sm">ðŸŽ¾</span> Capturados ({sessionStats.captures.length})
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {sessionStats.captures.map((cap, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white border border-blue-100 rounded-2xl px-3 py-1.5 shadow-sm">
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${cap.isShiny ? 'shiny/' : ''}${cap.id}.png`} className="w-8 h-8 object-contain" alt={cap.name} />
                        <span className="font-black text-slate-800 text-[11px] uppercase tracking-tighter">{cap.name}</span>
                        {cap.isShiny && <span className="ml-auto text-[8px] bg-yellow-100 text-yellow-700 font-extrabold px-2 py-0.5 rounded-full border border-yellow-200">( SHINY</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {sessionStats.kills === 0 && sessionStats.captures.length === 0 && (
                <p className="text-center text-slate-400 font-bold italic text-sm py-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">Nenhum progresso nesta sessÃ£o.</p>
              )}
            </div>
            <div className="px-5 pb-5">
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
                className="w-full bg-pokeRed text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-all active:scale-95 border-b-8 border-red-700 flex items-center justify-center gap-3"
              >
                Continuar para Cidade
                <span>âž”</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {(!loading && user && gameState.worldFlags?.includes('has_starter')) && (
        <nav className="bg-white border-t-4 border-slate-200 grid grid-cols-5 z-50 shadow-lg relative"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: '4.5rem', flexShrink: 0 }}
        >
          <button onClick={() => {
            const currentR = processedRoutes[gameState.currentRoute];
            const isFarming = currentR && currentR.type === 'farm';
            
             if (currentView === 'battles') {
              // Se já está na batalha, abrir o mapa requer confirmação
              showConfirm({
                title: 'Interromper Treino?',
                message: 'Deseja abrir o mapa das Rotas? Isso interromperá seu treino atual.',
                onConfirm: () => {
                  setCurrentView('routes');
                  closeConfirm();
                }
              });
            } else if (isFarming) {
              // Se estÃ¡ em qualquer outra tela (Menu, Pokemon, etc) e estava treinando, volta para a batalha
              setCurrentView('battles');
            } else {
              // Comportamento padrÃ£o (ir para o mapa)
              setCurrentView('routes');
            }
          }} className={`flex flex-col items-center justify-center py-2 transition-all ${['routes', 'battles'].includes(currentView) ? 'text-pokeBlue scale-110' : 'text-slate-400 opacity-60'}`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="w-7 h-7 object-contain" alt="Routes" />
            <span className="text-[9px] font-black uppercase mt-0.5">Rotas</span>
          </button>
          <button onClick={() => setCurrentView('pokemon_management')} className={`flex flex-col items-center justify-center py-2 transition-all ${currentView === 'pokemon_management' ? 'text-pokeRed scale-110' : 'text-slate-400 opacity-60'}`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-7 h-7 object-contain" alt="Pokemons" />
            <span className="text-[9px] font-black uppercase mt-0.5">PokÃ©mons</span>
          </button>
          <button onClick={() => setCurrentView('vs')} className={`flex flex-col items-center justify-center py-2 transition-all ${['vs', 'gyms', 'challenges'].includes(currentView) ? 'text-pokeGold scale-110' : 'text-slate-400 opacity-60'}`}>
            <span className="text-2xl h-7 flex items-center">âš”ï¸</span>
            <span className="text-[9px] font-black uppercase mt-0.5">Modo VS</span>
          </button>
          <button onClick={() => {
            if (currentView === 'battles') {
              showConfirm({
                title: 'Voltar para a Cidade?',
                message: 'Deseja interromper o treino e ir para a cidade?',
                onConfirm: () => {
                  handleGoToCity();
                  closeConfirm();
                }
              });
              return;
            }
            handleGoToCity();
          }} className={`flex flex-col items-center justify-center py-2 transition-all ${currentView === 'city' ? 'text-indigo-500 scale-110' : 'text-slate-400 opacity-60'}`}>
            <span className="text-2xl h-7 flex items-center">ðŸ¢</span>
            <span className="text-[9px] font-black uppercase mt-0.5">Cidade</span>
          </button>
          <button onClick={() => setCurrentView('menu')} className={`flex flex-col items-center justify-center py-2 transition-all ${currentView === 'menu' ? 'text-slate-800 scale-110' : 'text-slate-400 opacity-60'}`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-doll.png" className="w-7 h-7 object-contain" alt="Menu" />
            <span className="text-[9px] font-black uppercase mt-0.5">Menu</span>
          </button>
        </nav>
      )}

      {/* MODAIS DE CONSTRUÃ­Â‡Ã­Â•ES */}
      {/* MODAL DE MISSÃO ATIVA */}
      <QuestModal 
        activeQuest={activeQuestModal} 
        onClose={() => setActiveQuestModal(null)} 
      />

      {activeBuildingModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] relative border-b-[12px] border-slate-800 animate-slideInUp overflow-hidden">

              
              <button 
                onClick={() => setActiveBuildingModal(null)}
                className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-all border-2 border-slate-100"
              >âœ–</button>

              {activeBuildingModal === 'pokecenter' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                   <div className="h-48 relative overflow-hidden shrink-0">
                      <img src={fixPath('battle_bg_pokecenter_1776868686753.png')} className="w-full h-full object-cover" alt="Pokecenter" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                      <img src="https://play.pokemonshowdown.com/sprites/ani/chansey.gif" className="absolute bottom-4 left-1/2 -translate-x-1/2 h-24 drop-shadow-lg" alt="Chansey" />
                   </div>
                   <div className="p-10 text-center overflow-y-auto custom-scrollbar">
                      <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-4">Centro PokÃ©mon</h2>
                      <p className="text-slate-500 font-bold mb-8 italic">"Bem-vindo! Podemos curar seus PokÃ©mon?"</p>
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
                            return {
                              ...prev,
                              team: prev.team.map(p => ({
                                ...p,
                                hp: p.maxHp,
                                status: [],
                                stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0, accuracy: 0, evasion: 0 }
                              })),
                              stamina: newStamina,
                            };
                          });
                          addLog("ÃƒÂ…Ã‚Â¸ÃƒÂ‚Ã‚ÂÃƒÂ‚Ã‚Â¥ Todos os PokÃ©mon da equipe foram curados!", "system");
                          
                          setTimeout(() => {
                            setActiveBuildingModal(null);
                            setIsHealing(false);
                          }, 2000);
                        }}
                        className={`w-full ${isHealing ? 'bg-slate-400 animate-pulse cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 active:scale-95'} text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-200`}
                      >
                        {isHealing ? 'Cuidando...' : 'Sim, por favor!'}
                      </button>
                   </div>
                </div>
              )}

              {activeBuildingModal === 'mart' && (
                <div className="p-6 flex-1 flex flex-col overflow-hidden">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">ÂÃ‚Âª</div>
                      <div className="flex-1">
                         <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">PokÃ© Mart</h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Suprimentos de Viagem</p>
                      </div>
                      <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm">
                         ðŸ’° {gameState.currency}
                      </div>
                   </div>

                   <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-4">
                      {[
                        { id: 'pokeballs', name: 'PokÃ© Bola', price: 200, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', desc: 'Captura PokÃ©mon selvagens' },
                        { id: 'potions', name: 'PoÃ§Ã£o', price: 300, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png', desc: 'Restaura 20 HP' },
                        { id: 'revive', name: 'Revive', price: 1500, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png', desc: 'Revive PokÃ©mon desmaiado' },
                        ...POKE_MART_DRINKS.filter(drink => {
                           if (!drink.availableFrom) return true;
                           const badgeMap = { boulder_badge: 1, cascade_badge: 2, thunder_badge: 3, rainbow_badge: 4 };
                           const badgeId = badgeMap[drink.availableFrom];
                           return badgeId ? (gameState.badges || []).includes(badgeId) : (gameState.worldFlags || []).includes(drink.availableFrom);
                        }).map(d => ({ ...d, desc: d.description }))
                      ].map(item => {
                        const maxQty = Math.floor(gameState.currency / item.price);
                        const buyFn = (qty) => {
                          if (qty < 1) return;
                          setGameState(prev => ({
                            ...prev,
                            currency: prev.currency - item.price * qty,
                            inventory: {
                              ...prev.inventory,
                              items: { ...prev.inventory.items, [item.id]: (prev.inventory.items[item.id] || 0) + qty }
                            }
                          }));
                          addLog(`ÂðŸª Comprado: ${qty}x ${item.name}`, 'system');
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
                                   <p className="text-[10px] font-black text-slate-400 uppercase">PreÃ§o</p>
                                   <p className="font-black text-amber-600 text-sm">ðŸ’° {item.price}</p>
                                </div>
                             </div>
                             <div className="grid grid-cols-3 gap-2">
                                {[{label:'x1',qty:1},{label:'x10',qty:10},{label:'MÃ¡x',qty:maxQty}].map(opt => (
                                  <button key={opt.label}
                                    disabled={gameState.currency < item.price || (opt.qty < 1)}
                                    onClick={() => buyFn(opt.qty)}
                                    className="py-2 rounded-xl font-black text-xs uppercase transition-all bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                  >
                                    {opt.label}{opt.label==='MÃ¡x'&&maxQty>0?` (${maxQty})`:''}
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
                <div className="p-6 flex-1 flex flex-col overflow-hidden">
                   <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">ðŸ”¥Ã‚Â¨</div>
                      <div className="flex-1">
                         <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">Forja PokÃ©mon</h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Materiais e Equipamentos</p>
                      </div>
                      <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm">
                         ðŸ’° {gameState.currency}
                      </div>
                   </div>

                   <div className="space-y-6 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-4">
                      {Object.entries(CRAFTING_RECIPES).map(([category, items]) => (
                        <div key={category} className="space-y-3">
                           <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">{category.replace(/_/g, ' ')}</h3>
                           </div>
                           <div className="flex flex-col gap-3">
                              {items.map(item => {
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
                                  setGameState(prev => {
                                    const newInv = { ...prev.inventory, materials: { ...prev.inventory.materials } };
                                    Object.entries(item.cost).forEach(([mat, amount]) => {
                                      if (mat !== 'currency') newInv.materials[mat] = (newInv.materials[mat] || 0) - amount * qty;
                                    });
                                    return {
                                      ...prev,
                                      currency: prev.currency - (item.cost.currency || 0) * qty,
                                      inventory: { ...newInv, items: { ...newInv.items, [item.id]: (newInv.items[item.id] || 0) + qty } }
                                    };
                                  });
                                  addLog(`ðŸ”¥Ã‚Â¨ Forjado: ${qty}x ${item.name}`, 'system');
                                };
                                const maxCraft = getMaxCraft();
                                return (
                                  <div key={item.id} className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
                                     <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                                           <img src={item.img} className="w-9 h-9 object-contain" alt={item.name} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                           <h4 className="font-black text-slate-800 uppercase italic text-sm leading-tight">{item.name}</h4>
                                           <p className="text-[10px] font-bold text-slate-400 truncate">{item.effect || 'Item de Crafting'}</p>
                                        </div>
                                     </div>
                                     <div className="flex flex-wrap gap-1.5 mb-3">
                                        {Object.entries(item.cost).map(([mat, amount]) => {
                                          const have = mat === 'currency' ? gameState.currency : (gameState.inventory.materials?.[mat] || 0);
                                          const ok = have >= amount;
                                          return (
                                            <button key={mat} onClick={() => setActiveMaterialModal(mat)}
                                              className={`px-2 py-1 rounded-lg border text-[9px] font-black uppercase ${ok ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-600'}`}
                                            >
                                              {mat.replace(/_/g,' ')}: {have}/{amount}
                                            </button>
                                          );
                                        })}
                                     </div>
                                     <div className="grid grid-cols-3 gap-2">
                                        {[{label:'x1',qty:1},{label:'x10',qty:10},{label:'MÃ¡x',qty:maxCraft}].map(opt => (
                                          <button key={opt.label}
                                            disabled={!canCraftOne || opt.qty < 1}
                                            onClick={() => craftFn(opt.qty)}
                                            className="py-2 rounded-xl font-black text-xs uppercase transition-all bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                          >
                                            {opt.label}{opt.label==='MÃ¡x'&&maxCraft>0?` (${maxCraft})`:''}
                                          </button>
                                        ))}
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
      {/* MODAL DE DICA DE MATERIAL */}
      {activeMaterialModal && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
           <div className="max-w-lg w-full bg-white rounded-[3.5rem] shadow-2xl p-10 border-b-[12px] border-slate-800 animate-bounceIn overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20"></div>
              
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Onde encontrar?</h3>
                 <button onClick={() => setActiveMaterialModal(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors">âœ–</button>
              </div>
              
              <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 mb-8 shadow-inner">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-3xl">ðŸ’Ž</div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Recurso:</p>
                    <h4 className="text-xl font-black text-slate-800 uppercase italic mt-1">{activeMaterialModal.replace(/_/g, ' ')}</h4>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {(() => {
                       switch(activeMaterialModal) {
                          case 'currency': return 'Obtido derrotando PokÃ©mons em qualquer rota ou vendendo itens raros.';
                          case 'normal_essence': return 'Dropado por PokÃ©mons tipo NORMAL (ex: Pidgey, Rattata) na Rota 1 e Pallet.';
                          case 'fire_essence': return 'Dropado por PokÃ©mons tipo FOGO. Procure em Ã¡reas vulcÃ­ÃƒÂ‚Ã‚Â¢nicas ou raramente na Rota 1.';
                          case 'water_essence': return 'Dropado por PokÃ©mons tipo Ã­ÃƒÂ‚Ã‚ÂGUA em rios, lagos e oceanos.';
                          case 'grass_essence': return 'Dropado por PokÃ©mons tipo PLANTA na Rota 1 e Floresta de Viridian.';
                          case 'electric_essence': return 'Dropado por PokÃ©mons tipo ELÃ‰TRICO. Tente a Usina de Energia.';
                          case 'ice_essence': return 'Dropado por PokÃ©mons tipo GELO em cavernas geladas ou Ilhas Seafoam.';
                          case 'fighting_essence': return 'Dropado por PokÃ©mons tipo LUTADOR na Rota 22 ou Victory Road.';
                          case 'poison_essence': return 'Dropado por PokÃ©mons tipo VENENO na Floresta de Viridian e pÃ­ÃƒÂ‚Ã‚Â¢ntanos.';
                          case 'ground_essence': return 'Dropado por PokÃ©mons tipo TERRA em cavernas, como a Caverna Diglett.';
                          case 'flying_essence': return 'Dropado por PokÃ©mons tipo VOADOR em rotas abertas e cÃ©us.';
                          case 'psychic_essence': return 'Dropado por PokÃ©mons tipo PSÃ­ÃƒÂ‚Ã‚ÂQUICO em locais misteriosos ou MansÃ­ÃƒÂ‚Ã‚Âµes.';
                          case 'bug_essence': return 'Dropado por PokÃ©mons tipo INSETO na Floresta de Viridian.';
                          case 'rock_essence': return 'Dropado por PokÃ©mons tipo PEDRA em tÃºneis de rocha e cavernas.';
                          case 'ghost_essence': return 'Dropado por PokÃ©mons tipo FANTASMA na Torre PokÃ©mon de Lavender.';
                          case 'dragon_essence': return 'Dropado por PokÃ©mons tipo DRAGÃƒO em locais sagrados ou Victory Road.';
                          case 'steel_essence': return 'Dropado por PokÃ©mons tipo AÃ­Â‡O em Ã¡reas industriais ou usinas.';
                          case 'fairy_essence': return 'Dropado por PokÃ©mons tipo FADA no Monte Lua.';
                          case 'dark_essence': return 'Dropado por PokÃ©mons tipo SOMBRIO em locais escuros ou mansÃ­ÃƒÂ‚Ã‚Âµes.';
                          default: return 'Explore diferentes rotas e derrote PokÃ©mons de tipos variados para coletar este material.';
                       }
                    })()}
                 </p>
                 <button 
                   onClick={() => setActiveMaterialModal(null)}
                   className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg"
                 >Entendido!</button>
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

      {/* NOTIFICAÃ­Â‡Ã­O DE MESTRIA */}
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
                 <h4 className="text-xs font-black text-pokeGold uppercase tracking-[0.2em] mb-1">Mestria AlcanÃ§ada!</h4>
                 <p className="text-sm font-bold text-slate-800 leading-tight">
                    Novas recompensas para <span className="uppercase">{masteryNotification.pokemon.name}</span>:
                 </p>
                 <div className="mt-2 bg-slate-800 text-white text-[9px] px-3 py-1.5 rounded-full font-black uppercase inline-block">
                    {masteryNotification.reward.val}
                 </div>
              </div>
              <button onClick={() => setMasteryNotification(null)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-800 transition-colors text-xs font-black">âœ–</button>
           </div>
        </div>
      )}
    </div>
  );
}


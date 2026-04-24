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
          // Migração de dados para evitar crashes com saves antigos
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

    // Fallback de segurança: Se carregar demorar mais de 8s, libera a tela
    const loadTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    return () => {
      unsubscribe();
      clearTimeout(loadTimeout);
    };
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

  const [activeMaterialModal, setActiveMaterialModal] = useState(null);
  const [evolutionPending, setEvolutionPending] = useState(null);
  const [masteryNotification, setMasteryNotification] = useState(null);
  const [activePokemonDetails, setActivePokemonDetails] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [travelTab, setTravelTab] = useState('routes');
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
            version: DEFAULT_GAME_STATE.version, // força versão atual
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

  // âââ¬âââ¬âââ¬ UNIFICAííO DE COLEííO âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
  const unifyDuplicates = useCallback((prev) => {
    const all = [...(prev.team || []), ...(prev.pc || [])];
    const uniqueMap = {};
    all.forEach(p => {
      const id = Number(p.id);
      
      // Garante que o pokémon processado tenha ataques e todos os 6 status
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

    if (newCount === 100) { addLog(`✨ Domínio de ${pokemon.name}: Chance Shiny 2x!`, 'system'); reward = { type: 'Bí´nus Passivo', val: 'Chance Shiny 2x' }; }
    if (newCount === 200) { addLog(`✨ Domínio de ${pokemon.name}: Chance Shiny 5x!`, 'system'); reward = { type: 'Bí´nus Passivo', val: 'Chance Shiny 5x' }; }

    if (reward) {
      addLog(`🌟 Domínio de ${pokemon.name}: ${reward.val} liberado!`, 'system');
      setTimeout(() => setMasteryNotification({ pokemon, reward }), 0);
    }

    return { ...prevGameState.speciesMastery, [pokemon.id]: newCount };
  }, [addLog]);


  // âââ¬âââ¬âââ¬ FIREBASE CLOUD SYNC âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        addLog(`Å¸âÂ¤ Logado como ${user.email}`, 'system');
        try {
          const docRef = doc(db, "saves", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data?.gameState) {
              setGameState(prev => ({ ...prev, ...data.gameState }));
              addLog("âËÂ Progresso sincronizado com a nuvem!", "system");
            }
          }
        } catch (err) {
          console.error("Erro ao carregar nuvem:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [addLog]);

  // Sincronização de Estado (Vários destinos)
  useEffect(() => {
    // 1. LocalStorage (Instantí¢neo)
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
      alert("Ã¢ÃÂ¡Ã í¯ÃÂ¸ÃÂ Você precisa estar logado para salvar na nuvem!");
      return;
    }
    try {
      lastSyncRef.current = Date.now();
      await setDoc(doc(db, "saves", user.uid), { 
        gameState, 
        updatedAt: serverTimestamp() 
      }, { merge: true });
      alert("âÅâ¦ Jogo salvo na nuvem com sucesso!");
    } catch (e) {
      console.error("Manual Save Fail:", e);
      alert("âÂÅ Erro ao salvar: " + e.message);
    }
  }, [gameState]);

  // âââ¬âââ¬âââ¬ INTERPRETADOR DE EFEITOS DE GOLPE âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
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
      noEffect: false,   // teleport, roar, etc  sem efeito em batalha idle
    };

    // âââ¬âââ¬ Efeitos Especiais de Dano âââ¬âââ¬
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

    // âââ¬âââ¬ Heal âââ¬âââ¬
    if (e.includes('restores') || (e.includes('heals') && e.includes('user')) ||
        ['recover','soft-boiled','milk drink','morning sun','synthesis','moonlight',
         'rest','slack off','roost','shore up','heal order'].some(n => name.includes(n))) {
      result.heal = true; return result;
    }

    // âââ¬âââ¬ Accuracy / Evasion âââ¬âââ¬
    if ((e.includes('accuracy') && e.includes('lower')) || e.includes("lowers the target's accuracy")) {
      result.accuracy_change = { target: 'enemy', change: -1 };
    }
    if (e.includes('evasion') && (e.includes('raise') || e.includes('increas'))) {
      result.evasion_change = { target: 'self', change: +1 };
    }

    // âââ¬âââ¬ Debuffs no inimigo âââ¬âââ¬
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

    // Ã¢Ã¢ÂÂÃ¢ÂÂ¬Ã¢Ã¢ÂÂÃ¢ÂÂ¬ Buffs no usuário Ã¢Ã¢ÂÂÃ¢ÂÂ¬Ã¢Ã¢ÂÂÃ¢ÂÂ¬
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

    // Ã¢Ã¢ÂÂÃ¢ÂÂ¬Ã¢Ã¢ÂÂÃ¢ÂÂ¬ CondiçíÃÂµes de Status no inimigo Ã¢Ã¢ÂÂÃ¢ÂÂ¬Ã¢Ã¢ÂÂÃ¢ÂÂ¬
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

    // âââ¬âââ¬ Sem efeito em idle (teleport, roar, baton pass, etc) âââ¬âââ¬
    if (['teleport','roar','whirlwind','splash'].includes(name)) {
      result.noEffect = true;
    }

    return result;
  };

  // âââ¬âââ¬âââ¬ FÓRMULA DE DANO (inspirada na Gen 1) âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
  const calcDamage = useCallback((attacker, move, defender) => {
    if (!attacker || !defender || !move || !move.power) return 0;
    const level = attacker.level || 5;
    const power = move.power || 40;

    const getStatMult = (stage = 0) => (2 + Math.max(0, stage)) / (2 - Math.min(0, stage));

    // Proteção contra move ou name undefined
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

  // âââ¬âââ¬âââ¬ PROCESSAMENTO DE DROPS âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
  const processDrops = useCallback((enemy) => {
    const drops = { materials: {}, items: {}, currency: 0 };
    const messages = [];

    // Moedas base
    let coinAmount = (enemy.level || 5) * 3 * (enemy.isShiny ? 2 : 1);
    
    // âââ¬âââ¬ EFEITOS ATIVOS (TIMED) âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
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

    // âââ¬âââ¬ CANDY DROP âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
    const candyId = POKEMON_TO_CANDY[Number(enemy.id)];
    if (candyId) {
       const mastery = (gameState.speciesMastery || {})[Number(enemy.id)] || 0;
       const bonusChance = mastery > 50 ? 0.3 : 0.15;
       if (Math.random() < bonusChance) {
         const qty = 1;
         drops.candies = { [candyId]: qty }; 
         messages.push(`Â¬ 1x ${CANDY_FAMILIES[candyId].name}`);
       }
    }

    // NOVA LÓGICA DE DROPS DO USUÁRIO
    // 1. Essência por Tipo (60% de chance)
    if (Math.random() < 0.6) {
      const essenceType = `${(enemy.type || 'normal').toLowerCase()}_essence`;
      const essenceData = ITEM_LABELS[essenceType] || { icon: 'Ã¢ÂÂ¨', name: `Essência ${enemy.type}` };
      drops.materials[essenceType] = (drops.materials[essenceType] || 0) + 1;
      messages.push(`${essenceData.icon} 1x ${essenceData.name}`);
    }

    // 2. Mystic Dust para Shinies (100% se for shiny)
    if (enemy.isShiny) {
      drops.materials.mystic_dust = (drops.materials.mystic_dust || 0) + 5;
      messages.push(`Ã¢ÃÂ­ÃÂ 5x Pó Místico`);
    }

    // Drops antigos (suporte para itens específicos de rota/pokemon)
    if (enemy.drop && enemy.dropChance && Math.random() < (enemy.isShiny ? enemy.dropChance * 3 : enemy.dropChance)) {
      // Aqui determinamos se o drop antigo é material ou item (maioria é material)
      const materialList = [
        'iron_ore', 'apricorn', 'electric_chip', 'moon_stone_shard', 'pink_dust', 'gold_nugget', 'silk', 'feather',
        'fire_stone', 'water_stone', 'leaf_stone', 'thunder_stone', 'moon_stone'
      ];
      const dropData = ITEM_LABELS[enemy.drop] || { icon: '📦', name: enemy.drop.toUpperCase() };
      if (materialList.includes(enemy.drop)) {
        drops.materials[enemy.drop] = (drops.materials[enemy.drop] || 0) + 1;
      } else {
        drops.items[enemy.drop] = (drops.items[enemy.drop] || 0) + 1;
      }
      messages.push(`${dropData.icon} 1x ${dropData.name}`);
    }

    // 4. Poké Ball Drop Chance (20% chance)
    if (Math.random() < 0.20) {
      drops.items.pokeballs = (drops.items.pokeballs || 0) + 1;
      messages.push(`Ã°ÂÂÂ´ +1 Poké Bola`);
    }

    return { drops, messages };
  }, []);

  // âââ¬âââ¬âââ¬ SPAWN âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
  const spawnEnemy = useCallback(() => {
    isProcessingVictory.current = false; // Reset de segurança
    const route = processedRoutes[gameState.currentRoute] || processedRoutes.pallet_town;

    // Chance de encontrar um treinador NPC (~3% por padrão, configurável por rota)
    const trainerChance = route.trainerChance || 0.03;
    const hasTrainers = route.trainers && route.trainers.length > 0;

    // âââ¬âââ¬ 1. EMBOSCADA VILí (Chance Global reduzida para ~1% para focar em selvagens) âââ¬âââ¬
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
      addLog(`⚠️ EMBOSCADA! ${teamData.name} ${reason}`, 'enemy');
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
      
      const enemyName = trainerPoke.name || `Pokémon de ${trainer.name}`;
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
      addLog(`⚔️ï¸ ${trainer.name} quer batalhar!`, 'system');
      return;
    }

    if (!route.enemies || route.enemies.length === 0) {
      // Não seta null — apenas sai sem fazer nada para evitar loop infinito em cidades
      isProcessingVictory.current = false;
      return;
    }
    
    let enemyPool = [...route.enemies];
    
    // âââ¬âââ¬ 3. VARAS DE PESCA (Fishing Rods) âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
    // Se a rota tem bioma de água e o jogador possui uma vara, aumenta chance de água
    if (route.biome === 'water' || route.name.toLowerCase().includes('oceano') || route.name.toLowerCase().includes('praia')) {
      const rods = ['super_rod', 'good_rod', 'old_rod'];
      const ownedRod = rods.find(r => (gameState.inventory?.items?.[r] || 0) > 0);
      if (ownedRod) {
        const rodData = CRAFTING_RECIPES.fishing_rods.find(r => r.id === ownedRod);
        const waterBonus = rodData?.effect?.waterBonus || 0;
        // Filtra pokémons de água e duplica sua presença no pool proporcionalmente ao bíÃÂ´nus
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
    // Resolve dados completos do Pokédex
    const base = baseRef.learnset
      ? baseRef
      : { 
          ...(POKEDEX[Number(baseRef.id)] || POKEDEX[String(baseRef.id)] || {}), 
          id: Number(baseRef.id || 16),
          level: baseRef.level || 5,
          name: (POKEDEX[Number(baseRef.id)] || POKEDEX[String(baseRef.id)])?.name || baseRef.name || 'Pokémon Selvagem'
        };
    
    // Sistema de Maestria: Chance de Shiny aumenta com as capturas
    const pokeId = Number(base.id);
    const masteryCount = (gameState.speciesMastery || {})[pokeId] || (gameState.speciesMastery || {})[base.id] || 0;
    const shinyChanceBase = 0.01; // 1% base
    const shinyBonus = Math.min(0.04, (masteryCount / 100) * 0.05); // Até +4% de bíÃÂ´nus
    const isShiny = Math.floor(Math.random() * 4096) === 0;

    const levelVariance = Math.floor(Math.random() * 3) - 1;
    const level = Math.max(1, (base.level || 5) + levelVariance);
    
    // Bí´nus Shiny: 20% mais forte
    const shinyMult = isShiny ? 1.2 : 1.0;

    // âââ¬âââ¬ 4. REPEL (Enfraquecer Inimigos) âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
    const effects = gameState.activeEffects || {};
    const now = Date.now();
    let repelMult = 1.0;
    if (effects.activeRepel?.endsAt > now) {
      repelMult = effects.activeRepel.hpMult || 0.8;
    }

    const maxHp = Math.ceil((((2 * (base.maxHp || base.hp || 30) * level) / 100) + level + 10) * shinyMult * repelMult);
    
    // Seleção de Golpes baseada no Learnset
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

    // Se não tiver golpes, dá pelo menos Investida (Tackle)
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
    // BGM agora gerenciado pelas configuraçíÃÂµes
  }, [gameState.currentRoute, gameState.speciesMastery, playBGM, addLog, processedRoutes]);

  useEffect(() => {
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

  // Ref para currentView  permite que handleBattleTick leia o valor atual
  // sem precisar estar nas deps do useCallback (o que recriaria o timer a cada mudança de view)
  useEffect(() => { 
    currentViewRef.current = currentView;
    if (currentView !== 'menu') lastNonMenuView.current = currentView;
  }, [currentView]);

  // âââ¬âââ¬âââ¬ TICK DE BATALHA âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
  const handleBattleTick = useCallback(() => {
    const speedMultiplier = [1, 0.6, 0.3][(gameState.settings?.battleSpeed || 1) - 1] || 1;
    
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
    
    // âââ¬âââ¬ 5. ISCA / LURE (Acelerar Spawn) âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
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
          // Reseta stages do Pokémon que entra em campo
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

      // âââ¬âââ¬âââ¬ AUTO-POííO âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
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
            addLog(`Ã°ÂÂÂ Auto-Poção usada em ${focusPoke.name}! (${focusPoke.hp}Ã¢Ã¢Â Ã¢ÂÂ${healed} HP)`, 'system');
            return {
              ...prev,
              team: newTeam,
              inventory: { ...prev.inventory, items: { ...prev.inventory.items, potions: prev.inventory.items.potions - 1 } }
            };
          }
        }
      }

      // âââ¬âââ¬âââ¬ PROCESSAMENTO DE STATUS (DANO/SKIP) âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
      const myStatus = myPoke.status || [];
      const enemyStatus = updatedEnemy.status || [];

      // Confuse Skip (Jogador)
      if (myStatus.includes('confuse')) {
        addLog(`Ã°ÂÂÂ« ${myPoke.name} está confuso...`, 'system');
        if (Math.random() < 0.3) {
           updatedTeam[activeMemberIndex].status = myStatus.filter(s => s !== 'confuse');
           addLog(`Ã¢ÂÂ¨ ${myPoke.name} não está mais confuso!`, 'system');
        } else if (Math.random() < 0.5) {
           const selfDmg = Math.max(1, Math.floor(myPoke.maxHp / 10));
           updatedTeam[activeMemberIndex].hp = Math.max(0, myPoke.hp - selfDmg);
           addLog(`Ã°ÂÂÂ¥ ${myPoke.name} feriu-se em sua confusão!`, 'system');
           return { ...prev, team: updatedTeam };
        }
      }

      // Paralyze/Sleep Skip (Jogador)
      if (myStatus.includes('paralyze') && Math.random() < 0.25) {
        addLog(`Ã¢ÂÂ¡ ${myPoke.name} está paralisado e não conseguiu atacar!`, 'system');
        return prev; 
      }
      if (myStatus.includes('sleep')) {
        addLog(`Ã°ÂÂÂ¤ ${myPoke.name} está dormindo profundamente...`, 'system');
        if (Math.random() < 0.3) {
          updatedTeam[activeMemberIndex].status = myStatus.filter(s => s !== 'sleep');
          addLog(`âËâ¬ ${myPoke.name} acordou!`, 'system');
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
          addLog(`💀 ${myPoke.name} usou ${move.name}! Golpe decisivo!`, 'system');
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
          addLog(`💚 ${myPoke.name} usou ${move.name}! Recuperou ${healed} HP!`, 'system');
          addFloat(`+${healed} HP`, '#22c55e');

        } else {
          // Stat changes
          fx.statChanges.forEach(c => {
            if (c.target === 'enemy') {
              const cur = updatedEnemyFinal.stages?.[c.stat] || 0;
              const newVal = Math.max(-6, Math.min(6, cur + c.change));
              updatedEnemyFinal.stages = { ...updatedEnemyFinal.stages, [c.stat]: newVal };
              const arrow = c.change < 0 ? '▼' : '▲';
              const statNames = { attack:'ATK', defense:'DEF', spAtk:'SATK', spDef:'SDEF', speed:'SPD' };
              addLog(`${myPoke.name} usou ${move.name}! ${statNames[c.stat]||c.stat} de ${updatedEnemyFinal.name} ${c.change < 0 ? 'caiu' : 'subiu'}!`, 'system');
              addFloat(`${arrow} ${statNames[c.stat]||c.stat}`, c.change < 0 ? '#64748b' : '#3b82f6');
            } else {
              const cur = updatedTeamFinal[activeMemberIndex].stages?.[c.stat] || 0;
              const newVal = Math.max(-6, Math.min(6, cur + c.change));
              updatedTeamFinal[activeMemberIndex] = { ...updatedTeamFinal[activeMemberIndex], stages: { ...updatedTeamFinal[activeMemberIndex].stages, [c.stat]: newVal } };
              const arrow = c.change > 0 ? '▲' : '▼';
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
            addFloat(`▼ ACC`, '#64748b');
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
            addFloat(`▲ EVA`, '#3b82f6');
          }

          // Status condition
          if (fx.statusEffect) {
            const statusNames = { burn:'Ã°ÂÂÂ¥ Queimadura', poison:'Ã¢ÃÂÃ í¯ÃÂ¸ÃÂ Veneno', toxic:'Ã¢ÃÂÃ í¯ÃÂ¸ÃÂ Veneno Grave', sleep:'Ã°ÂÂÂ¤ Sono', paralyze:'Ã¢ÂÂ¡ Paralisia', confuse:'Ã°ÂÂÂ« Confusão', freeze:'Ã¢ÃÂÃ¢ÂÂí¯ÃÂ¸ÃÂ Congelado' };
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
        updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - playerDmg);
        addFloat(`-${playerDmg}`, eff > 1 ? '#fbbf24' : eff < 1 ? '#94a3b8' : '#ef4444');
        if (eff > 1) addLog("💥 É super efetivo!", 'system');
        if (eff > 0 && eff < 1) addLog("ÃÂ¸Ã¢ÂÂºÃÂ¡í¯ÃÂ¸ÃÂ Não é muito efetivo!", 'system');
        if (eff === 0) addLog("Ã°ÂÂÂ« Não afetou o inimigo!", 'system');
      }

      // Dano de Status (Inimigo)
      if (enemyStatus.includes('poison') || enemyStatus.includes('burn')) {
        const dot = Math.max(1, Math.floor(updatedEnemyFinal.maxHp / 16));
        updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - dot);
        addLog(`💢 ${updatedEnemyFinal.name} sofreu dano por status!`, 'enemy');
      }

      // Turno do Inimigo (apenas se ainda estiver vivo)
      if (updatedEnemyFinal.hp > 0) {
        // Skip Inimigo
        if (enemyStatus.includes('confuse')) {
          addLog(`Ã°ÂÂÂ« ${updatedEnemyFinal.name} está confuso...`, 'enemy');
          if (Math.random() < 0.3) {
            updatedEnemyFinal.status = enemyStatus.filter(s => s !== 'confuse');
            addLog(`Ã¢ÂÂ¨ ${updatedEnemyFinal.name} não está mais confuso!`, 'enemy');
          } else if (Math.random() < 0.5) {
            const selfDmg = Math.max(1, Math.floor(updatedEnemyFinal.maxHp / 10));
            updatedEnemyFinal.hp = Math.max(0, updatedEnemyFinal.hp - selfDmg);
            addLog(`Ã°ÂÂÂ¥ ${updatedEnemyFinal.name} feriu-se em sua confusão!`, 'enemy');
            setCurrentEnemy(updatedEnemyFinal);
            return prev;
          }
        }

        if (enemyStatus.includes('paralyze') && Math.random() < 0.25) {
          addLog(`Ã¢ÂÂ¡ ${updatedEnemyFinal.name} está paralisado!`, 'enemy');
        } else if (enemyStatus.includes('sleep')) {
          addLog(`Ã°ÂÂÂ¤ ${updatedEnemyFinal.name} está dormindo...`, 'enemy');
          if (Math.random() < 0.35) {
            updatedEnemyFinal.status = enemyStatus.filter(s => s !== 'sleep');
            addLog(`âËâ¬ ${updatedEnemyFinal.name} acordou!`, 'enemy');
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
                addLog(`💀 ${updatedEnemyFinal.name} usou ${enemyMove.name}! Golpe decisivo!`, 'enemy');
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
                  const statusNames = { burn:'Ã°ÂÂÂ¥ Queimadura', poison:'Ã°ÂÂÂ Veneno', sleep:'Ã°ÂÂÂ¤ Sono', paralyze:'Ã¢ÂÂ¡ Paralisia', confuse:'Ã°ÂÂÂ« Confusão' };
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
              if (eff > 1) addLog(`💥 Golpe de ${updatedEnemyFinal.name} foi super efetivo!`, 'enemy');
              if (eff > 0 && eff < 1) addLog(`Ã°ÂÂÂ¡Ã¯Â¸Â Golpe de ${updatedEnemyFinal.name} não foi muito efetivo...`, 'enemy');
              if (eff === 0) addLog(`Ã°ÂÂÂ« ${updatedTeamFinal[activeMemberIndex].name} é imune!`, 'enemy');
            }
          }
        }
      }

      // Dano de Status (Jogador)
      if (myStatus.includes('poison') || myStatus.includes('burn')) {
        const dot = Math.max(1, Math.floor(updatedTeamFinal[activeMemberIndex].maxHp / 16));
        updatedTeamFinal[activeMemberIndex].hp = Math.max(0, updatedTeamFinal[activeMemberIndex].hp - dot);
        addLog(`💢 ${myPoke.name} sofreu dano por status!`, 'system');
      }

      // ââ SISTEMA DE EXAUSTÃO ââââââââââââââââââââââââââââââââââââââââââââââââââ
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
          addLog(`Ã°ÂÂÂµ ${myPoke.name} está exausto! Perdendo vida por falta de comida!`, 'system');
        }
      }

      let finalInventory = { ...prev.inventory };
      let staminaEntry = { value: newStamina, lastFed: prev.stamina?.[myPoke.instanceId]?.lastFed || Date.now() };

      // Auto-alimentar quando abaixo do limiar (apenas se autoStamina estiver ON)
      if (autoStamEnabled && newStamina < FEED_THRESHOLD) {
        // Prioridade: moomoo_milk → lemonade → soda_pop → berry_juice → poke_food_premium → fresh_water → poke_food → berries
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
        } else if (newStamina < 10 && Math.random() < 0.2) {
          addLog(`⚠️ ${myPoke.name} está faminto! Compre bebidas no Poké Mart ou cultive Berries!`, 'system');
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
      
      const newInventory = { 
        ...prev.inventory,
        [source]: { ...bag, [itemId]: bag[itemId] - 1 }
      };
      
      if (itemId === 'pokeballs' || itemId === 'great_ball' || itemId === 'ultra_ball') {
        if (currentEnemy.isTrainer) {
          addLog("Ã°ÂÂÂ« Você não pode capturar Pokémons de outros treinadores!", 'enemy');
          return prev;
        }
        
        let multiplier = 1.0;
        if (itemId === 'great_ball') multiplier = 1.5;
        if (itemId === 'ultra_ball') multiplier = 2.0;

        const catchRate = ((1 - (currentEnemy.hp / currentEnemy.maxHp)) + 0.1) * multiplier;
        if (Math.random() < catchRate) {
          addLog(`Ã¢ÂÂ¨ Capturado! ${currentEnemy.name} agora é seu!`, 'system');
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
          
          let questUpdate = {};
          if (prev.worldFlags.includes('quest_capture_active')) {
            newInventory.items = { ...newInventory.items, pokeballs: (newInventory.items.pokeballs || 0) + 10 };
            addLog('Ã°ÂÂÂ Carvalho: "Ótimo trabalho! Tome estas 10 Pokébolas!"', 'drop');
            questUpdate = { worldFlags: prev.worldFlags.filter(f => f !== 'quest_capture_active').concat(['quest_capture_done']) };
          }

          // Unificação por Espécie: Se já tem na caughtData (antes dessa captura), apenas aumenta maestria
          const alreadyCaught = !!(prev.caughtData || {})[currentEnemy.id];
          if (alreadyCaught) {
            addLog(`Ã°ÂÂÂ ${currentEnemy.name} já capturado! Maestria aumentada.`, 'system');
            const findAndReplace = (list) => {
              let updated = false;
              const newList = list.map(p => {
                if (Number(p.id) === Number(currentEnemy.id)) {
                  updated = true;
                  if (currentEnemy.isShiny && !p.isShiny) {
                    addLog(`Ã¢ÂÂ¨ Upgrade Shiny: Seu ${p.name} agora é Brilhante!`, 'system');
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
          addLog(`Ã°ÂÂÂ¨ O ${enemyName} escapou da Pokébola!`, 'enemy');
        }
      } else if (itemId === 'potions') {
        const activePoke = prev.team[activeMemberIndex];
        if (activePoke) {
          const newTeam = prev.team.map((p, i) => i === activeMemberIndex ? { ...p, hp: Math.min(p.maxHp, p.hp + 20) } : p);
          addLog(`Ã°ÂÂ§🏪 Usou Poção em ${activePoke.name}!`, 'system');
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
      
      // ââ 3. EFEITOS TEMPORÁRIOS (TIMED EFFECTS) ââââââââââââââââââââââââââ
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
    // BGM agora gerenciado pelas configuraçíÃÂµes
    addLog(`🔥 DESAFIO: ${battleData.name} iniciou a batalha!`, 'system');
    isProcessingVictory.current = false;
  }, [setCurrentEnemy, setCurrentView, addLog, POKEDEX, MOVES, MOVE_TRANSLATIONS]);

  const handleChallengeGym = useCallback((gymData) => {
    // Começa sempre pelo primeiro Pokémon do time
    const teamList = gymData.team || [];
    const leaderPoke = teamList[0];
    if (!leaderPoke) return;
    const base = POKEDEX[leaderPoke.id];
    if (!base) return;
    const lvl = leaderPoke.level || 20;
    const maxHp = Math.ceil((base.maxHp || base.hp || 50) * 1.6 * (lvl / 20)); 
    const statScale = (lvl / 10) * 0.85; 

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
    // BGM agora gerenciado pelas configuraçíÃÂµes
    addLog(`â  GINÁSIO: Líder ${gymData.name} enviou ${base.name}! Nv.${lvl}`, 'system');
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
        addLog("âÂÅ Materiais ou Moedas insuficientes!", 'system');
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

      // 3. Adicionar o item ao inventário
      const newItems = { ...prev.inventory.items };
      newItems[recipe.id] = (newItems[recipe.id] || 0) + 1;

      addLog(`ÃÂ¸Ã¢ÂÂºÃ í¯ÃÂ¸ÃÂ Você fabricou: ${recipe.name}!`, 'drop');

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
        addLog(`âÂÅ Candies insuficientes (${currentCount}/${use.cost})`, 'system');
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
        addLog(`ÃÂ¸ÃÂÃÂ¬ ${p.name} consumiu candies e ganhou experiência!`, 'system');
      } else if (use.effect === 'stat_atk') {
        p.attack = (p.attack || 10) + 2;
        addLog(`Â¬ ${p.name} aumentou o Ataque permanentemente!`, 'system');
      } else if (use.effect === 'stat_def') {
        p.defense = (p.defense || 10) + 2;
        addLog(`Â¬ ${p.name} aumentou a Defesa permanentemente!`, 'system');
      } else if (use.effect === 'stat_hp') {
        p.maxHp = (p.maxHp || 40) + 5;
        p.hp = Math.min(p.maxHp, p.hp + 5);
        addLog(`Â¬ ${p.name} aumentou o HP permanentemente!`, 'system');
      } else if (use.effect === 'stat_speed') {
        p.speed = (p.speed || 10) + 2;
        addLog(`Â¬ ${p.name} aumentou a Velocidade permanentemente!`, 'system');
      } else if (use.effect === 'stat_spatk') {
        p.spAtk = (p.spAtk || 10) + 2;
        addLog(`Â¬ ${p.name} aumentou o Ataque Especial!`, 'system');
      } else if (use.effect === 'force_evolve') {
        const pokeData = POKEDEX[p.id];
        if (pokeData?.evolution && pokeData.evolution.id <= 151) {
          setEvolutionPending({ ...p, teamIndex: location === 'team' ? pokemonIndex : null, pcIndex: location === 'pc' ? pokemonIndex : null });
          return { ...prev, inventory: newInventory };
        } else {
           addLog(`Ã¢ÃÂÃÂ ${p.name} não pode evoluir mais.`, 'system');
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
    addLog(`Ã°ÂÂÂ Expedição para ${biome.name} iniciada! Duração: ~${Math.floor(duration / 60000)}min`, 'system');
  }, [addLog]);

  const handleClaimExpedition = useCallback((biomeId) => {
    setGameState(prev => {
      const exp = prev.expeditions?.[biomeId];
      if (!exp || Date.now() < exp.endsAt) return prev;
      const biome = EXPEDITION_BIOMES[biomeId];
      const duration = Date.now() - exp.startedAt;
      const rawDrops = calcExpeditionDrops(exp.team, biome, duration);
      // Candies são exclusivos do farm nas rotas — remover das expediçíÃÂµes
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
        `Ã¢ÃÂÃ¢ÂÂ¦ Expedição em ${biome.name} concluída! Coletou: ${dropSummary || 'nada desta vez'}`,
        'drop'
      );
      teamWithXP.forEach(p => {
        if (p.xpGained > 0)
          addLog(`Ã¢ÃÂ­ÃÂ ${p.name} ganhou ${p.xpGained} XP na expedição!`, 'system');
      });
      return {
        ...prev,
        pc: [...(prev.pc || []), ...returnedTeam],
        inventory: { ...prev.inventory, materials: newMaterials },
        expeditions: newExpeditions,
      };
    });
  }, [addLog]);

  // âââ¬âââ¬ HOUSE SYSTEM HANDLERS âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
  // Comprar a casa
  const handleBuyHouse = useCallback(() => {
    setGameState(prev => {
      if ((prev.currency || 0) < HOUSE_PURCHASE_COST) {
        addLog(`âÂÅ Coins insuficientes! A casa custa ${HOUSE_PURCHASE_COST} coins.`, 'system');
        return prev;
      }
      addLog(`  Casa comprada! Prof. Carvalho ficou orgulhoso!`, 'system');
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
        addLog(`âÂÅ Coins insuficientes para plantar ${plant.name}!`, 'system');
        return prev;
      }

      const newSlots = [...(prev.house?.slots || [])];
      newSlots[slotIndex] = { plantId, plantedAt: Date.now(), growthTime };

      addLog(`🌱 ${plant.name} plantado! Pronto em ${Math.floor(growthTime / 60000)} min.`, 'system');
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

  // Comprar expansão de slots
  const handleBuySlot = useCallback((expansion) => {
    setGameState(prev => {
      if ((prev.currency || 0) < expansion.cost) return prev;
      addLog(`— Jardim expandido para ${expansion.totalSlots} canteiros!`, 'system');
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
      addLog(`Â¾ ${pokemon.name} agora cuida do jardim!`, 'system');
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
      if (pokemon) addLog(`Â¾ ${pokemon.name} voltou ao PC.`, 'system');
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
      addLog(`Ã¢ÂÂÃ¯Â¸Âí¯ÃÂ¸ÃÂ RIVAL: ${battleData.name} desafiou você!`, 'system');
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
    // BGM agora gerenciado pelas configuraçíÃÂµes
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

        addLog(`📢 ${currentEnemy.trainerName} enviou ${base.name}!`, 'enemy');
        
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

    // Vitória! O som de GYM tocará apenas se ganhar insígnia

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
        addLog(`â¦ Recebeu a Insígnia: ${currentEnemy.badgeToGive.replace(/_/g, ' ')}!`, 'system');
        sfxGym();
        
        const newShare = newBadges.length * 10;
        addLog(`Ã¢ÂÂ¨ Exp Share aumentado! Sua equipe agora recebe ${newShare}% da experiência compartilhada!`, 'system');
        
        // Show Oak House modal after 1st badge
        if (newBadges.length === 1 && !prev.worldFlags?.includes('house_owned') && !prev.worldFlags?.includes('oak_house_shown')) {
          setTimeout(() => setShowOakHouseModal(true), 2000);
          tempWorldFlags.push('oak_house_shown');
        }
      }

      // Salvar flag de vitória específica do inimigo (Rival, Boss, etc)
      if (currentEnemy.unlockFlag && !newFlags.includes(currentEnemy.unlockFlag)) {
        newFlags.push(currentEnemy.unlockFlag);
        addLog(`🚩 Progresso: ${currentEnemy.unlockFlag.replace(/_/g, ' ')}!`, 'system');
      }

      // Salvar flag de vitória de Elite 4 / Líder de Ginásio (Fallback)
      if (currentEnemy.gymId && !newFlags.includes(`defeated_elite_${currentEnemy.gymId}`)) {
        newFlags.push(`defeated_elite_${currentEnemy.gymId}`);
      }

      const badgesCount = prev.badges?.length || 0;
      
      // âââ¬âââ¬ EFEITOS ATIVOS (TIMED) âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬âââ¬
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

        // Lucky Egg (Antiga Lógica Hold - Mantida para compatibilidade se necessário)
        if (p.heldItem === 'lucky_egg' && !(effects.activeLuckyEgg?.endsAt > now)) {
          xpToAdd = Math.floor(xpToAdd * 1.5);
        }

        if (xpToAdd <= 0) {
           // Se não ganhou XP, apenas reseta estágios e remove status voláteis (confusão)
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
          addLog(`🎉 ${p.name} subiu para Nv. ${newLevel}!`, 'system');
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
                  addLog(`Ã¢ÂÂ¨ ${p.name} aprendeu ${moveObj.name}! (Salvo na Memória)`, 'system');
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
      addLog(`â  ${currentEnemy.trainerName} derrotado! +${currentEnemy.trainerReward} coins`, 'system');
    }
    if (currentEnemy.isRocket) addLog('🚀 Grunt da Equipe Rocket derrotado!', 'system');
    if (currentEnemy.isShiny) addLog('Ã¢ÂÂ¨ Pokémon shiny derrotado!', 'system');

    sessionRef.current.kills += 1;
    sessionRef.current.coins += (drops.currency || 0) + (currentEnemy.trainerReward || 0);
    if (currentEnemy.isTrainer) sessionRef.current.trainers += 1;
    if (currentEnemy.isShiny) sessionRef.current.shinyKills += 1;

    Object.entries(drops.materials || {}).forEach(([k, v]) => {
      sessionRef.current.drops[k] = (sessionRef.current.drops[k] || 0) + v;
    });

    setTimeout(() => {
      setGameState(prev => {
        if (prev.autoCapture && !currentEnemy.isTrainer && (prev.inventory.items.pokeballs || 0) > 0) {
          const catchRate = (1 - (currentEnemy.hp / currentEnemy.maxHp)) + 0.3;
          if (Math.random() < catchRate) {
            sessionRef.current.captures.push({ name: currentEnemy.name, id: currentEnemy.id, isShiny: currentEnemy.isShiny });
            // Reutiliza a lógica de captura
            const newInventory = { 
              ...prev.inventory,
              items: { ...prev.inventory.items, pokeballs: prev.inventory.items.pokeballs - 1 }
            };
            
            const alreadyCaught = !!(prev.caughtData || {})[currentEnemy.id];
            const newCaughtData = { ...(prev.caughtData || {}), [currentEnemy.id]: true };
            const newMastery = processCaptureMastery({ ...currentEnemy, id: Number(currentEnemy.id) }, prev);
            
            let questUpdate = {};
            if (prev.worldFlags.includes('quest_capture_active')) {
              newInventory.items = { ...newInventory.items, pokeballs: (newInventory.items.pokeballs || 0) + 10 };
              addLog('ÃÂ¸ÃÃÂ Carvalho: "Ótimo trabalho! Tome estas 10 Pokébolas!"', 'drop');
              questUpdate = { worldFlags: prev.worldFlags.filter(f => f !== 'quest_capture_active').concat(['quest_capture_done']) };
            }

            if (alreadyCaught) {
              addLog(`Ã°ÂÂÂ Auto-captura: ${currentEnemy.name} já capturado! Maestria aumentada.`, 'system');
              const findAndReplace = (list) => list.map(p => {
                if (Number(p.id) === Number(currentEnemy.id)) {
                  if (currentEnemy.isShiny && !p.isShiny) {
                    addLog(`Ã¢ÂÂ¨ Upgrade Shiny: Seu ${p.name} agora é Brilhante!`, 'system');
                    return { ...p, isShiny: true, hp: p.maxHp };
                  }
                }
                return p;
              });
              return { ...prev, team: findAndReplace(prev.team), pc: findAndReplace(prev.pc || []), inventory: { ...prev.inventory, items: newInventory.items }, speciesMastery: newMastery, caughtData: newCaughtData, ...questUpdate };
            }

            // Primeira Captura via Auto
            addLog(`Ã¢ÂÂ¨ Auto-capturado! ${currentEnemy.name} agora é seu!`, 'system');
            sfxCapture();
            const newPoke = { ...currentEnemy, id: Number(currentEnemy.id), hp: currentEnemy.maxHp, xp: 0, instanceId: Date.now() };
            const newTeam = [...prev.team];
            const newPC = [...(prev.pc || [])];
            if (newTeam.length < 6) newTeam.push(newPoke); else newPC.push(newPoke);

            return { ...prev, team: newTeam, pc: newPC, inventory: { ...prev.inventory, items: newInventory.items }, speciesMastery: newMastery, caughtData: newCaughtData, ...questUpdate };
          } else {
            addLog(`💨 Auto-captura falhou para ${currentEnemy.name}!`, 'enemy');
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

  const renderView = () => {
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
                    POKÉCRAFT <span className="text-slate-800" style={{ WebkitTextStroke: '0px' }}>IDLE</span>
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
                    if (hasSave && !confirm("Deseja iniciar uma NOVA jornada? Isso apagará permanentemente todo seu progresso atual na nuvem.")) return;
                    
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
                  }} 
                  className={`w-full max-w-xs md:max-w-md ${hasSave ? 'bg-blue-400/20 border-2 border-white/30 text-white' : 'bg-white text-pokeBlue'} px-8 py-4 md:py-5 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl hover:translate-y-1 transition-all text-sm md:text-lg`}
                >
                  {hasSave ? 'Reiniciar Jornada' : 'Nova Jornada'}
                </button>

                 <p className="mt-8 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                   PokéCraft Idle v{APP_VERSION} • {APP_VERSION_DATE}
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
          "Olá! Bem-vindo ao mundo POKÉMON!",
          "Meu nome é CARVALHO. As pessoas me chamam de PROFESSOR POKÉMON.",
          "Este mundo é habitado por criaturas chamadas POKÉMON!",
          "Para alguns, POKÉMON são animais de estimação. Outros os usam para lutar.",
          "Eu... Eu estudo POKÉMON como profissão.",
          "Mas primeiro, diga-me... Qual é o seu nome?"
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

            {/* Diálogo box — estilo Game Boy */}
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
                      if (!gameState.trainer?.name || gameState.trainer.name.length < 2) return alert("Diga-me seu nome!");
                      setCurrentView('trainer_creation');
                    } else {
                      setIntroStep(s => s + 1);
                    }
                  }}
                  className="w-full mt-5 bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg active:scale-95"
                >
                  {isLastStep ? 'Tudo Pronto!' : 'Próximo ▶'}
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
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Cada jornada começa com um único passo</p>
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
                      <span className="font-black">✖</span>
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
                         <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2 block">Status Nível 5</span>
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
                        EU ESCOLHO VOCÊ!
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
           {/* Balão na parte inferior */}
           <div className="w-full relative z-10 p-4">
             <div className="bg-white p-6 rounded-[2rem] shadow-2xl border-b-[10px] border-blue-600 w-full">
               <h3 className="text-lg font-black text-slate-800 italic uppercase mb-3 tracking-tighter">Rival Azul:</h3>
               <p className="text-sm font-bold text-slate-600 mb-4 italic">"Ei, espere aí! Eu também quero um POKÉMON! E eu vou escolher este aqui!"</p>
               <p className="text-sm font-black text-blue-500 mb-4 uppercase tracking-widest animate-pulse">"Vejamos quem é o melhor treinador!"</p>
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
           {/* Balão na parte inferior */}
           <div className="w-full relative z-10 p-4">
             <div className="bg-white p-6 rounded-[2rem] shadow-2xl border-b-[10px] border-blue-600 w-full">
               <h3 className="text-lg font-black text-slate-800 italic uppercase mb-3 tracking-tighter">Rival Azul:</h3>
               <p className="text-sm font-bold text-slate-600 mb-3 italic">"Beleza! Vou fazer meu POKÉMON lutar para deixá-lo mais forte!"</p>
               <p className="text-sm font-black text-blue-500 mb-4 uppercase tracking-widest">"Vovô! Fui!"</p>
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
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Desbloqueio Especial </p>
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
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🏘️</div>
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
                    Parabéns por vencer o Ginásio de Pewter! Você está crescendo como treinador.
                    Que tal ter sua própria casa? Lá você pode cultivar Berries e Apricorns para
                    fabricar Pokébolas especiais e itens raros. Com Pokémon de Grama e í gua como
                    cuidadores, suas plantaçíÃÂµes crescerão muito mais rápido!
                  </p>
                  <div className="bg-white/60 rounded-3xl p-5 mb-6 border-2 border-amber-200 shadow-inner">
                    <p className="text-amber-800 font-black text-lg flex items-center gap-2">🏠 Custo da Casa</p>
                    <div className="flex justify-between items-center mt-2">
                       <p className="text-amber-900 text-sm font-bold">
                          💰 {HOUSE_PURCHASE_COST.toLocaleString()} coins
                       </p>
                       <p className="text-amber-700 text-xs font-black uppercase tracking-widest">4 canteiros iniciais</p>
                    </div>
                    <div className={`mt-3 p-3 rounded-xl font-black text-xs uppercase text-center ${(gameState.currency || 0) >= HOUSE_PURCHASE_COST ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {(gameState.currency || 0) >= HOUSE_PURCHASE_COST
                        ? "Ã¢ÂÂ Você tem coins suficientes!"
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
                      🏠 Comprar Casa!
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
                      Seus Pokémon precisam se <strong>alimentar</strong> durante as batalhas. Quanto mais lutam, mais energia gastam!
                    </p>

                    <div className="bg-white/80 rounded-[2.5rem] p-6 border-2 border-green-200 shadow-inner">
                      <p className="text-green-800 text-xs font-black uppercase tracking-[0.2em] mb-4">🍴 O que alimenta seus Pokémon:</p>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-green-100">
                          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png" className="w-8 h-8 object-contain" alt="berry" />
                          <p className="text-green-700 text-[11px] leading-tight font-bold"><strong>Berries</strong> — cultive na sua casa. Oran e Sitrus Berry são essenciais.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-green-100">
                          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-8 h-8 object-contain" alt="agua" />
                          <p className="text-green-700 text-[11px] leading-tight font-bold"><strong>Águas e Soda</strong> — compre no Poké Mart para restaurar energia rápido.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-green-100">
                          <span className="text-2xl w-8 text-center">🔋</span>
                          <p className="text-green-700 text-[11px] leading-tight font-bold"><strong>Ração Pokémon</strong> — pode ser fabricada na Forja com materiais simples.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                       <div className="flex-1 bg-red-50 rounded-3xl p-4 border-2 border-red-100">
                         <p className="text-red-700 text-[10px] font-black uppercase tracking-widest mb-1">⚠️ Perigo!</p>
                         <p className="text-red-600 text-[10px] font-bold leading-tight">
                           Energia zerada causa exaustão e perda constante de vida.
                         </p>
                       </div>
                       <div className="flex-1 bg-blue-50 rounded-3xl p-4 border-2 border-blue-100">
                         <p className="text-blue-700 text-[10px] font-black uppercase tracking-widest mb-1">💡 Dica!</p>
                         <p className="text-blue-600 text-[10px] font-bold leading-tight">
                           O sistema alimenta automaticamente com o melhor item disponível.
                         </p>
                       </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[2.5rem] p-6 border-2 border-amber-200 mb-8 shadow-xl">
                    <p className="text-amber-800 text-[10px] font-black uppercase tracking-widest">🎁 Presente do Professor:</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-amber-100 rotate-3">
                        <img
                          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png"
                          className="w-10 h-10 object-contain"
                          alt="Água Fresca"
                        />
                      </div>
                      <div>
                        <p className="text-amber-800 font-black text-xl italic leading-none">10x Água Fresca</p>
                        <p className="text-amber-700 text-[10px] font-bold mt-1 uppercase">Para começar sua jornada!</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowOakStaminaModal(false)}
                    className="w-full bg-green-600 text-white py-6 rounded-3xl font-black uppercase text-sm tracking-widest hover:bg-green-500 transition-all shadow-xl shadow-green-200 active:scale-95"
                  >
                    Obrigado, Professor! 
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
                  "Incrível! Meus parabéns por derrotar o Azul na Rota 1! Acabo de receber relatos fantásticos... os Pokémon iniciais <span className="text-green-400">Bulbasaur</span>, <span className="text-orange-400">Charmander</span> e <span className="text-blue-400">Squirtle</span> foram avistados selvagens na Rota 1 e na Floresta!"
                </p>
                <p className="text-white/80 text-sm font-bold leading-relaxed italic mt-4">
                  "Parece que eles decidiram se aventurar além do meu laboratório. Agora você pode encontrá-los e capturá-los! Boa sorte na sua jornada!"
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
                    <span className="text-xl text-white">ââ Â</span>
                 </button>
                 <div>
                    <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Forja Pokémon</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Transforme essências em poder</p>
                 </div>
              </div>

              <div className="bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border-2 border-white shadow-inner mb-6">
                 <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Seus Materiais</h4>
                    <span className="text-[10px] font-black text-pokeBlue uppercase bg-blue-50 px-3 py-1 rounded-full">💰 {gameState.currency} Coins</span>
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
                 "Oh céus! Você e seus POKÉMONS parecem exaustos. Deixe-me cuidar de tudo rapidamente!"
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
               <span className="font-black uppercase italic tracking-tighter">PokéCraft Idle</span>
            </div>
            <div className="flex gap-4 items-center">
                <button
                 onClick={() => toggleMute()}
                 className="flex items-center gap-1 bg-black/20 px-2 py-1.5 rounded-full hover:bg-black/30 transition-all border border-white/10"
               >
                  <span className="text-sm">{muted ? '🔇' : '🔊'}</span>
               </button>
               <button onClick={() => { if(window.confirm('Deseja realmente sair? Seu progresso foi salvo.')) setCurrentView('landing'); }} className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full hover:bg-black/30 transition-all border border-white/10">
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
            {renderView()}
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
                <p className="text-red-200 text-[10px] font-bold uppercase tracking-widest">Sessão de batalha</p>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '⚔️ï¸', label: 'Nocautes', value: sessionStats.kills },
                  { icon: '(', label: 'Shinies', value: sessionStats.shinyKills + sessionStats.captures.filter(c => c.isShiny).length },
                  { icon: 'â ', label: 'Trainers', value: sessionStats.trainers },
                  { icon: '💰', label: 'Coins',    value: sessionStats.coins  },
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
                    <span className="text-sm">📦</span> Itens Coletados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sessionStats.drops).map(([mat, qty]) => {
                      const item = ITEM_LABELS[mat] || { icon: '💎', name: mat.split('_').pop() };
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
                    <span className="text-sm">🎾</span> Capturados ({sessionStats.captures.length})
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
                <p className="text-center text-slate-400 font-bold italic text-sm py-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">Nenhum progresso nesta sessão.</p>
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
                <span>➔</span>
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
              if (window.confirm("Deseja abrir o mapa das Rotas? Isso interromperá seu treino atual.")) {
                setCurrentView('routes');
              }
            } else if (isFarming) {
              // Se está em qualquer outra tela (Menu, Pokemon, etc) e estava treinando, volta para a batalha
              setCurrentView('battles');
            } else {
              // Comportamento padrão (ir para o mapa)
              setCurrentView('routes');
            }
          }} className={`flex flex-col items-center justify-center py-2 transition-all ${['routes', 'battles'].includes(currentView) ? 'text-pokeBlue scale-110' : 'text-slate-400 opacity-60'}`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="w-7 h-7 object-contain" alt="Routes" />
            <span className="text-[9px] font-black uppercase mt-0.5">Rotas</span>
          </button>
          <button onClick={() => setCurrentView('pokemon_management')} className={`flex flex-col items-center justify-center py-2 transition-all ${currentView === 'pokemon_management' ? 'text-pokeRed scale-110' : 'text-slate-400 opacity-60'}`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-7 h-7 object-contain" alt="Pokemons" />
            <span className="text-[9px] font-black uppercase mt-0.5">Pokémons</span>
          </button>
          <button onClick={() => setCurrentView('vs')} className={`flex flex-col items-center justify-center py-2 transition-all ${['vs', 'gyms', 'challenges'].includes(currentView) ? 'text-pokeGold scale-110' : 'text-slate-400 opacity-60'}`}>
            <span className="text-2xl h-7 flex items-center">⚔️</span>
            <span className="text-[9px] font-black uppercase mt-0.5">Modo VS</span>
          </button>
          <button onClick={() => {
            if (currentView === 'battles') {
              if (!window.confirm("Deseja interromper o treino e ir para a cidade?")) return;
            }
            handleGoToCity();
          }} className={`flex flex-col items-center justify-center py-2 transition-all ${currentView === 'city' ? 'text-indigo-500 scale-110' : 'text-slate-400 opacity-60'}`}>
            <span className="text-2xl h-7 flex items-center">🏢</span>
            <span className="text-[9px] font-black uppercase mt-0.5">Cidade</span>
          </button>
          <button onClick={() => setCurrentView('menu')} className={`flex flex-col items-center justify-center py-2 transition-all ${currentView === 'menu' ? 'text-slate-800 scale-110' : 'text-slate-400 opacity-60'}`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-doll.png" className="w-7 h-7 object-contain" alt="Menu" />
            <span className="text-[9px] font-black uppercase mt-0.5">Menu</span>
          </button>
        </nav>
      )}

      {/* MODAIS DE CONSTRUííES */}
      {/* MODAL DE MISSÃO ATIVA */}
      {activeQuestModal && (
        <div className="absolute inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="bg-white rounded-[3rem] p-8 max-w-lg w-full shadow-2xl border-b-[12px] border-pokeBlue animate-bounceIn overflow-hidden relative">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-4">
                    <img src={activeQuestModal.icon} className="w-16 h-16 drop-shadow-md" alt="Quest" />
                    <div>
                       <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">{activeQuestModal.title}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Missão Ativa</p>
                    </div>
                 </div>
                 <button onClick={() => setActiveQuestModal(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors">✖</button>
              </div>

              <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 mb-6 italic text-slate-600 font-bold text-sm">
                 <p>"{activeQuestModal.desc}"</p>
              </div>

              <div className="space-y-3 mb-8">
                 <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Recompensa:</span>
                    <span className="text-sm font-black text-pokeGold uppercase tracking-tighter">{activeQuestModal.reward}</span>
                 </div>
              </div>

              <button 
                onClick={() => setActiveQuestModal(null)}
                className="w-full bg-pokeBlue text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
              >Entendido!</button>
           </div>
        </div>
      )}

      {activeBuildingModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] relative border-b-[12px] border-slate-800 animate-slideInUp overflow-hidden">

              
              <button 
                onClick={() => setActiveBuildingModal(null)}
                className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-all border-2 border-slate-100"
              >✖</button>

              {activeBuildingModal === 'pokecenter' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                   <div className="h-48 relative overflow-hidden shrink-0">
                      <img src={fixPath('battle_bg_pokecenter_1776868686753.png')} className="w-full h-full object-cover" alt="Pokecenter" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                      <img src="https://play.pokemonshowdown.com/sprites/ani/chansey.gif" className="absolute bottom-4 left-1/2 -translate-x-1/2 h-24 drop-shadow-lg" alt="Chansey" />
                   </div>
                   <div className="p-10 text-center overflow-y-auto custom-scrollbar">
                      <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter mb-4">Centro Pokémon</h2>
                      <p className="text-slate-500 font-bold mb-8 italic">"Bem-vindo! Podemos curar seus Pokémon?"</p>
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
                          addLog("ÃÂ¸ÃÂÃÂ¥ Todos os Pokémon da equipe foram curados!", "system");
                          
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
                      <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">Âª</div>
                      <div className="flex-1">
                         <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">Poké Mart</h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Suprimentos de Viagem</p>
                      </div>
                      <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm">
                         💰 {gameState.currency}
                      </div>
                   </div>

                   <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-4">
                      {[
                        { id: 'pokeballs', name: 'Poké Bola', price: 200, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', desc: 'Captura Pokémon selvagens' },
                        { id: 'potions', name: 'Poção', price: 300, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png', desc: 'Restaura 20 HP' },
                        { id: 'revive', name: 'Revive', price: 1500, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png', desc: 'Revive Pokémon desmaiado' },
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
                          addLog(`🏪 Comprado: ${qty}x ${item.name}`, 'system');
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
                                   <p className="text-[10px] font-black text-slate-400 uppercase">Preço</p>
                                   <p className="font-black text-amber-600 text-sm">💰 {item.price}</p>
                                </div>
                             </div>
                             <div className="grid grid-cols-3 gap-2">
                                {[{label:'x1',qty:1},{label:'x10',qty:10},{label:'Máx',qty:maxQty}].map(opt => (
                                  <button key={opt.label}
                                    disabled={gameState.currency < item.price || (opt.qty < 1)}
                                    onClick={() => buyFn(opt.qty)}
                                    className="py-2 rounded-xl font-black text-xs uppercase transition-all bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                  >
                                    {opt.label}{opt.label==='Máx'&&maxQty>0?` (${maxQty})`:''}
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
                      <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">🔥Â¨</div>
                      <div className="flex-1">
                         <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">Forja Pokémon</h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Materiais e Equipamentos</p>
                      </div>
                      <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm">
                         💰 {gameState.currency}
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
                                  addLog(`🔥Â¨ Forjado: ${qty}x ${item.name}`, 'system');
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
                                        {[{label:'x1',qty:1},{label:'x10',qty:10},{label:'Máx',qty:maxCraft}].map(opt => (
                                          <button key={opt.label}
                                            disabled={!canCraftOne || opt.qty < 1}
                                            onClick={() => craftFn(opt.qty)}
                                            className="py-2 rounded-xl font-black text-xs uppercase transition-all bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                          >
                                            {opt.label}{opt.label==='Máx'&&maxCraft>0?` (${maxCraft})`:''}
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
                 <button onClick={() => setActiveMaterialModal(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors">✖</button>
              </div>
              
              <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 mb-8 shadow-inner">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-3xl">💎</div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Recurso:</p>
                    <h4 className="text-xl font-black text-slate-800 uppercase italic mt-1">{activeMaterialModal.replace(/_/g, ' ')}</h4>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {(() => {
                       switch(activeMaterialModal) {
                          case 'currency': return 'Obtido derrotando Pokémons em qualquer rota ou vendendo itens raros.';
                          case 'normal_essence': return 'Dropado por Pokémons tipo NORMAL (ex: Pidgey, Rattata) na Rota 1 e Pallet.';
                          case 'fire_essence': return 'Dropado por Pokémons tipo FOGO. Procure em áreas vulcíÃÂ¢nicas ou raramente na Rota 1.';
                          case 'water_essence': return 'Dropado por Pokémons tipo íÃÂGUA em rios, lagos e oceanos.';
                          case 'grass_essence': return 'Dropado por Pokémons tipo PLANTA na Rota 1 e Floresta de Viridian.';
                          case 'electric_essence': return 'Dropado por Pokémons tipo ELÉTRICO. Tente a Usina de Energia.';
                          case 'ice_essence': return 'Dropado por Pokémons tipo GELO em cavernas geladas ou Ilhas Seafoam.';
                          case 'fighting_essence': return 'Dropado por Pokémons tipo LUTADOR na Rota 22 ou Victory Road.';
                          case 'poison_essence': return 'Dropado por Pokémons tipo VENENO na Floresta de Viridian e píÃÂ¢ntanos.';
                          case 'ground_essence': return 'Dropado por Pokémons tipo TERRA em cavernas, como a Caverna Diglett.';
                          case 'flying_essence': return 'Dropado por Pokémons tipo VOADOR em rotas abertas e céus.';
                          case 'psychic_essence': return 'Dropado por Pokémons tipo PSíÃÂQUICO em locais misteriosos ou MansíÃÂµes.';
                          case 'bug_essence': return 'Dropado por Pokémons tipo INSETO na Floresta de Viridian.';
                          case 'rock_essence': return 'Dropado por Pokémons tipo PEDRA em túneis de rocha e cavernas.';
                          case 'ghost_essence': return 'Dropado por Pokémons tipo FANTASMA na Torre Pokémon de Lavender.';
                          case 'dragon_essence': return 'Dropado por Pokémons tipo DRAGÃO em locais sagrados ou Victory Road.';
                          case 'steel_essence': return 'Dropado por Pokémons tipo AíO em áreas industriais ou usinas.';
                          case 'fairy_essence': return 'Dropado por Pokémons tipo FADA no Monte Lua.';
                          case 'dark_essence': return 'Dropado por Pokémons tipo SOMBRIO em locais escuros ou mansíÃÂµes.';
                          default: return 'Explore diferentes rotas e derrote Pokémons de tipos variados para coletar este material.';
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

      {/* NOTIFICAííO DE MESTRIA */}
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
    </div>
  );
}


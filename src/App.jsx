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
import { MoveCategoryIcon, StatusBadges, QuickInventory, TrainerCard } from './components/CommonUI';
import { GYMS, ELITE_FOUR } from './data/gyms';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { monitorAuthState } from './auth';
import { 
  APP_VERSION, APP_VERSION_DATE, DEFAULT_GAME_STATE, GYM_LEVEL_CAPS, 
  NATURE_LIST, NATURES, TYPE_COLORS, trainerAvatars 
} from './data/constants';
import { getMasteryPath, getEffectiveStat } from './utils/gameHelpers';
import { getTypeEffectiveness } from './data/typeChart';

const fixPath = (path) => {
  if (typeof path !== 'string') return path;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '') || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playBGM, stopBGM, sfxVictory, sfxDefeat, sfxLevelUp, sfxCapture, sfxHeal, toggleMute, isMuted, muted } = useSound();

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
  const [activeTab, setActiveTab] = useState('team');
  const [previewStarter, setPreviewStarter] = useState(null);
  const [activeQuestModal, setActiveQuestModal] = useState(null);

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
    if (!gameState.worldFlags?.includes('starters_unlocked')) return ROUTES;
    
    const newRoutes = { ...ROUTES };
    // Rota 1
    if (newRoutes.route_1) {
      newRoutes.route_1 = {
        ...newRoutes.route_1,
        enemies: [...newRoutes.route_1.enemies, { ...POKEDEX["4"], level: 4 }, { ...POKEDEX["7"], level: 4 }]
      };
    }
    // Rota 22
    if (newRoutes.route_22) {
      newRoutes.route_22 = {
        ...newRoutes.route_22,
        enemies: [...newRoutes.route_22.enemies, { ...POKEDEX["133"], level: 5 }]
      };
    }
    // Viridian Forest
    if (newRoutes.viridian_forest) {
      newRoutes.viridian_forest = {
        ...newRoutes.viridian_forest,
        enemies: [...newRoutes.viridian_forest.enemies, { ...POKEDEX["1"], level: 7 }, { ...POKEDEX["25"], level: 8 }]
      };
    }
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
    stopBGM(400);
  }, [gameState.currentRoute, currentView, setGameState, setCurrentView]);

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

  // ─── UNIFICAÇÃO DE COLEÇÃO ──────────────────────────────────────────────────
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
              return {
                name: MOVE_TRANSLATIONS[m.move.toLowerCase()] || moveData.name || m.move,
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
          spAtk: p.spAtk || base.spAtk || 10,
          spDef: p.spDef || base.spDef || 10,
          attack: p.attack || base.attack || 10,
          defense: p.defense || base.defense || 10,
          speed: p.speed || base.speed || 10,
          maxHp: p.maxHp || base.maxHp || base.hp || 30,
          hp: p.hp || p.maxHp || base.maxHp || base.hp || 30
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
      if (uniqueIds.size < all.length || needsMoves) {
        return unifyDuplicates(prev);
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


  // ─── FIREBASE CLOUD SYNC ──────────────────────────────────────────────────

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
              addLog("☁️ Progresso sincronizado com a nuvem!", "system");
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
    // 1. LocalStorage (Instantâneo)
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

  // ─── FÓRMULA DE DANO (inspirada na Gen 1) ───────────────────────────────────
  const calcDamage = useCallback((attacker, move, defender) => {
    if (!attacker || !defender || !move || move.power === 0) return 0;
    const level = attacker.level || 5;
    const power = move.power || 40;

    const getStatMult = (stage = 0) => (2 + Math.max(0, stage)) / (2 - Math.min(0, stage));

    // Nova Categoria (Physical/Special) - Suporta moves da base global
    const moveData = MOVES[move.name.toLowerCase().replace(/ /g, '-')] || move;
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
    return Math.max(1, Math.floor(base * roll));
  }, []);

  // ─── PROCESSAMENTO DE DROPS ──────────────────────────────────────────────────
  const processDrops = useCallback((enemy) => {
    const drops = { materials: {}, items: {}, currency: 0 };
    const messages = [];

    // Moedas base
    const coinAmount = (enemy.level || 5) * 3 * (enemy.isShiny ? 2 : 1);
    drops.currency = coinAmount;
    messages.push(`💰 +${coinAmount} coins`);

    // NOVA LÓGICA DE DROPS DO USUÁRIO
    // 1. Essência por Tipo (60% de chance)
    if (Math.random() < 0.6) {
      const essenceType = `${enemy.type.toLowerCase()}_essence`;
      drops.materials[essenceType] = (drops.materials[essenceType] || 0) + 1;
      messages.push(`✨ 1x Essência ${enemy.type}`);
    }

    // 2. Mystic Dust para Shinies (100% se for shiny)
    if (enemy.isShiny) {
      drops.materials.mystic_dust = (drops.materials.mystic_dust || 0) + 5;
      messages.push(`⭐ 5x Pó Místico`);
    }

    // Drops antigos (suporte para itens específicos de rota/pokemon)
    if (enemy.drop && enemy.dropChance && Math.random() < (enemy.isShiny ? enemy.dropChance * 3 : enemy.dropChance)) {
      // Aqui determinamos se o drop antigo é material ou item (maioria é material)
      const materialList = ['iron_ore', 'apricorn', 'electric_chip', 'moon_stone_shard', 'pink_dust', 'gold_nugget', 'silk', 'feather'];
      if (materialList.includes(enemy.drop)) {
        drops.materials[enemy.drop] = (drops.materials[enemy.drop] || 0) + 1;
      } else {
        drops.items[enemy.drop] = (drops.items[enemy.drop] || 0) + 1;
      }
      messages.push(`📦 1x ${enemy.drop.toUpperCase()}`);
    }

    return { drops, messages };
  }, []);

  // ─── SPAWN ───────────────────────────────────────────────────────────────────
  const spawnEnemy = useCallback(() => {
    isProcessingVictory.current = false; // Reset de segurança
    const route = processedRoutes[gameState.currentRoute] || processedRoutes.pallet_town;

    // Chance de encontrar um treinador NPC (~8% por padrão, configurável por rota)
    const trainerChance = route.trainerChance || 0.08;
    const hasTrainers = route.trainers && route.trainers.length > 0;

    // ── 1. EMBOSCADA VILÃ (Chance Global de ~4%) ──
    if (Math.random() < 0.04 && route.type === 'farm') {
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
        level, maxHp: (base.maxHp || 40) * 1.2, hp: (base.maxHp || 40) * 1.2,
        isShiny: false, status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
        isTrainer: true,
        trainerName: teamData.gruntName,
        trainerSprite: teamData.sprite,
        trainerReward: Math.floor(150 * teamData.rewardMult),
        isVillainAmbush: true,
        villainColor: teamData.color
      });
      addLog(`⚠️ EMBOSCADA! ${teamData.name} ${reason}`, 'enemy');
      return;
    }

    if (hasTrainers && Math.random() < trainerChance) {
      const trainer = route.trainers[Math.floor(Math.random() * route.trainers.length)];
      const trainerPokeRef = trainer.team[0];
      const trainerPoke = trainerPokeRef.learnset
        ? trainerPokeRef
        : { ...(POKEDEX[Number(trainerPokeRef.id)] || trainerPokeRef), level: trainerPokeRef.level };
      const maxHp = Math.floor((trainerPoke.maxHp || trainerPoke.hp || 30) * 1.3);
      setCurrentEnemy({
        ...trainerPoke,
        hp: maxHp, maxHp,
        isShiny: false, status: [],
        stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
        isTrainer: true,
        trainerName: trainer.name,
        trainerSprite: trainer.sprite,
        trainerReward: trainer.reward || 100,
        isRocket: trainer.isRocket || false,
        spawnTime: Date.now(),
      });
      setBattleLog([]);
      isProcessingVictory.current = false;
      addLog(`⚔️ ${trainer.name} quer batalhar!`, 'system');
      return;
    }

    if (!route.enemies || route.enemies.length === 0) {
      // Não seta null — apenas sai sem fazer nada para evitar loop infinito em cidades
      isProcessingVictory.current = false;
      return;
    }
    
    let enemyPool = [...route.enemies];
    
    // Injeção de iniciais raros após o evento do Rival na Rota 1
    if (gameState.worldFlags?.includes('starters_unlocked')) {
      const rand = Math.random();
      if (route.id === 'route_1') {
        if (rand < 0.03) enemyPool = [{ ...POKEDEX[4], level: 4 }]; // Charmander 3%
        else if (rand < 0.06) enemyPool = [{ ...POKEDEX[7], level: 4 }]; // Squirtle 3%
      } else if (route.id === 'route_22') {
        if (rand < 0.04) enemyPool = [{ ...POKEDEX[133], level: 5 }]; // Eevee 4%
      } else if (route.id === 'viridian_forest') {
        if (rand < 0.03) enemyPool = [{ ...POKEDEX[1], level: 7 }]; // Bulbasaur 3%
        else if (rand < 0.08) enemyPool = [{ ...POKEDEX[25], level: 8 }]; // Pikachu raro 5%
      }
    }

    const baseRef = enemyPool[Math.floor(Math.random() * enemyPool.length)];
    // Resolve dados completos do Pokédex (base pode ser apenas {id, level} vindo das rotas)
    const base = baseRef.learnset
      ? baseRef
      : { ...(POKEDEX[Number(baseRef.id)] || POKEDEX[String(baseRef.id)] || baseRef), level: baseRef.level };
    
    // Sistema de Maestria: Chance de Shiny aumenta com as capturas
    const pokeId = Number(base.id);
    const masteryCount = (gameState.speciesMastery || {})[pokeId] || (gameState.speciesMastery || {})[base.id] || 0;
    const shinyChanceBase = 0.01; // 1% base
    const shinyBonus = Math.min(0.04, (masteryCount / 100) * 0.05); // Até +4% de bônus
    const isShiny = Math.random() < (shinyChanceBase + shinyBonus);

    const levelVariance = Math.floor(Math.random() * 3) - 1;
    const level = Math.max(1, (base.level || 5) + levelVariance);
    
    // Bônus Shiny: 20% mais forte
    const shinyMult = isShiny ? 1.2 : 1.0;

    const hpScale = 1 + (level - (base.level || 5)) * 0.05;
    const maxHp = Math.floor((base.maxHp || base.hp || 30) * hpScale * shinyMult);
    
    // Seleção de Golpes baseada no Learnset
    const learnset = base.learnset || [];
    const availableMoves = learnset
      .filter(m => m.level <= level)
      .map(m => {
        const moveKey = m.move.toLowerCase();
        const moveData = MOVES[moveKey] || { name: m.move, power: 40, type: 'Normal', category: 'Physical' };
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
      attack: Math.floor((base.attack || 10) * hpScale * shinyMult),
      defense: Math.floor((base.defense || 10) * hpScale * shinyMult),
      spAtk: Math.floor((base.spAtk || 10) * hpScale * shinyMult),
      spDef: Math.floor((base.spDef || 10) * hpScale * shinyMult),
      speed: Math.floor((base.speed || 10) * hpScale * shinyMult),
      moves: finalMoves
    });
    setBattleLog([]);
    isProcessingVictory.current = false;
    playBGM('battle');
  }, [gameState.currentRoute, gameState.speciesMastery, playBGM, addLog, processedRoutes]);

  useEffect(() => {
    const route = processedRoutes[gameState.currentRoute];
    const hasEnemies = route?.enemies?.length > 0 || route?.trainers?.length > 0;
    if (currentView === 'battles' && hasEnemies && (!currentEnemy || currentEnemy.hp <= 0)) {
      const delay = !currentEnemy ? 50 : 800;
      const timer = setTimeout(() => {
        const routeNow = processedRoutes[gameState.currentRoute];
        const hasEnemiesNow = routeNow?.enemies?.length > 0 || routeNow?.trainers?.length > 0;
        if (currentView === 'battles' && hasEnemiesNow && (!currentEnemy || currentEnemy.hp <= 0)) {
          spawnEnemy();
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentView, currentEnemy?.id, currentEnemy?.hp, spawnEnemy, gameState.currentRoute, processedRoutes]);

  // Ref para currentView — permite que handleBattleTick leia o valor atual
  // sem precisar estar nas deps do useCallback (o que recriaria o timer a cada mudança de view)
  useEffect(() => { currentViewRef.current = currentView; }, [currentView]);

  // ─── TICK DE BATALHA ─────────────────────────────────────────────────────────
  const handleBattleTick = useCallback(() => {
    const speedMultiplier = [1, 0.6, 0.3][(gameState.settings?.battleSpeed || 1) - 1] || 1;
    if (!currentEnemy || currentViewRef.current !== 'battles' || currentEnemy.hp <= 0) return 1200 * speedMultiplier;
    
    // Atraso Cinematográfico para Início de Batalha (Intro)
    const introTime = currentEnemy.isTrainer ? 2500 : 1200;
    if (currentEnemy.spawnTime && Date.now() - currentEnemy.spawnTime < introTime) {
       return 400 * speedMultiplier;
    }

    let nextDelay = Math.floor(1200 * speedMultiplier);

    setGameState(prev => {
      const myPoke = prev.team[activeMemberIndex];
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

      // ─── AUTO-POÇÃO ────────────────────────────────────────────────
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
            addLog(`💊 Auto-Poção usada em ${focusPoke.name}! (${focusPoke.hp}→${healed} HP)`, 'system');
            return {
              ...prev,
              team: newTeam,
              inventory: { ...prev.inventory, items: { ...prev.inventory.items, potions: prev.inventory.items.potions - 1 } }
            };
          }
        }
      }

      // Turno do Jogador
      const moves = myPoke.moves || [];
      const move = moves.length > 0 ? moves[moveIndex % moves.length] : { name: 'Investida', power: 40, type: 'Normal' };
      
      let updatedTeam = [...prev.team];
      let updatedEnemy = { ...currentEnemy };

      if (move.category === 'Status' || move.power === 0) {
        nextDelay = 600;
        const changes = move.statChanges || [];

        changes.forEach(c => {
          const stat = c.stat;
          const change = c.change;

          // Regra correta: change < 0 = debuff no INIMIGO (abaixar stats do oponente)
          //                change > 0 = buff no PRÓPRIO pokémon
          if (change < 0) {
            // Debuff aplicado no inimigo
            const current = updatedEnemy.stages?.[stat] || 0;
            updatedEnemy.stages = { ...updatedEnemy.stages, [stat]: Math.max(-6, Math.min(6, current + change)) };
            addLog(`💢 ${myPoke.name} usou ${move.name}! ${stat === 'defense' ? 'Defesa' : stat === 'attack' ? 'Ataque' : stat === 'speed' ? 'Velocidade' : stat === 'spAtk' ? 'Atq.Esp' : 'Def.Esp'} de ${updatedEnemy.name} caiu!`, 'system');
            addFloat(`▼ ${stat.toUpperCase()}`, '#64748b');
          } else {
            // Buff aplicado no próprio pokémon
            const current = updatedTeam[activeMemberIndex].stages?.[stat] || 0;
            updatedTeam[activeMemberIndex] = { ...updatedTeam[activeMemberIndex], stages: { ...updatedTeam[activeMemberIndex].stages, [stat]: Math.max(-6, Math.min(6, current + change)) } };
            addLog(`✨ ${myPoke.name} usou ${move.name}! ${stat === 'defense' ? 'Defesa' : stat === 'attack' ? 'Ataque' : stat.toUpperCase()} subiu!`, 'system');
            addFloat(`▲ ${stat.toUpperCase()}`, '#3b82f6');
          }
        });

        // Status conditions (burn, poison, sleep, paralysis, confuse)
        if (move.statusEffect) {
          const effect = move.statusEffect; // 'burn'|'poison'|'sleep'|'paralyze'|'confuse'
          const alreadyHas = (updatedEnemy.status || []).includes(effect);
          if (!alreadyHas) {
            updatedEnemy.status = [...(updatedEnemy.status || []), effect];
            const effectNames = { burn: '🔥 Queimadura', poison: '☠️ Veneno', sleep: '💤 Sono', paralyze: '⚡ Paralisia', confuse: '💫 Confusão' };
            addLog(`${effectNames[effect] || effect}: ${updatedEnemy.name} foi afetado!`, 'enemy');
          }
        }

        // Fallback por nome de golpe (sem statChanges definido)
        if (changes.length === 0) {
          if (move.name === 'Rosnado' || move.name === 'Growl') {
            const current = updatedEnemy.stages?.attack || 0;
            updatedEnemy.stages = { ...updatedEnemy.stages, attack: Math.max(-6, current - 1) };
            addLog(`💢 ${myPoke.name} usou ${move.name}! Ataque de ${updatedEnemy.name} caiu!`, 'system');
          } else if (move.name === 'Chicote de Cauda' || move.name === 'Tail Whip' || move.name === 'Encarar' || move.name === 'Leer') {
            const current = updatedEnemy.stages?.defense || 0;
            updatedEnemy.stages = { ...updatedEnemy.stages, defense: Math.max(-6, current - 1) };
            addLog(`💢 ${myPoke.name} usou ${move.name}! Defesa de ${updatedEnemy.name} caiu!`, 'system');
          } else if (move.name === 'Olhar Hipnótico' || move.name === 'Sand Attack') {
            const current = updatedEnemy.stages?.speed || 0;
            updatedEnemy.stages = { ...updatedEnemy.stages, speed: Math.max(-6, current - 1) };
            addLog(`💢 ${myPoke.name} usou ${move.name}! Velocidade de ${updatedEnemy.name} caiu!`, 'system');
          }
        }

        setCurrentEnemy(updatedEnemy);
      } else {
        const playerDmg = calcDamage(myPoke, move, updatedEnemy);
        updatedEnemy.hp = Math.max(0, updatedEnemy.hp - playerDmg);
        addFloat(`-${playerDmg}`, '#ef4444');
      }

      // Turno do Inimigo (apenas se ainda estiver vivo)
      if (updatedEnemy.hp > 0) {
        const enemyMoves = updatedEnemy.moves || [];
        const enemyMove = enemyMoves[Math.floor(Math.random() * (enemyMoves.length || 1))];
        
        if (enemyMove) {
          if (enemyMove.category === 'Status' || enemyMove.power === 0) {
             const changes = enemyMove.statChanges || [];
             
             if (changes.length > 0) {
               changes.forEach(c => {
                 const stat = c.stat;
                 const change = c.change;
                 // Inimigo: change < 0 = debuffa o jogador; change > 0 = buffa si mesmo
                 if (change > 0) {
                    const current = updatedEnemy.stages?.[stat] || 0;
                    updatedEnemy.stages = { ...updatedEnemy.stages, [stat]: Math.min(6, current + change) };
                    addLog(`⚠️ ${updatedEnemy.name} usou ${enemyMove.name}! ${stat === 'attack' ? 'Ataque' : stat === 'defense' ? 'Defesa' : stat.toUpperCase()} subiu!`, 'enemy');
                 } else {
                    // Debuff aplica no jogador
                    const current = updatedTeam[activeMemberIndex].stages?.[stat] || 0;
                    updatedTeam[activeMemberIndex] = { ...updatedTeam[activeMemberIndex], stages: { ...updatedTeam[activeMemberIndex].stages, [stat]: Math.max(-6, current + change) } };
                    addLog(`⚠️ ${updatedEnemy.name} usou ${enemyMove.name}! ${stat === 'defense' ? 'Defesa' : stat === 'attack' ? 'Ataque' : stat.toUpperCase()} de ${updatedTeam[activeMemberIndex].name} caiu!`, 'enemy');
                 }
               });
             } else {
               // Fallback por nome — inimigos com Tail Whip derrubam defesa do jogador
               if (enemyMove.name === 'Chicote de Cauda' || enemyMove.name === 'Tail Whip' || enemyMove.name === 'Encarar' || enemyMove.name === 'Leer') {
                  const myStages = updatedTeam[activeMemberIndex].stages || {};
                  updatedTeam[activeMemberIndex] = { ...updatedTeam[activeMemberIndex], stages: { ...myStages, defense: Math.max(-6, (myStages.defense || 0) - 1) } };
                  addLog(`⚠️ ${updatedEnemy.name} usou ${enemyMove.name}! Defesa de ${updatedTeam[activeMemberIndex].name} caiu!`, 'enemy');
               } else if (enemyMove.name === 'Rosnado' || enemyMove.name === 'Growl') {
                  const myStages = updatedTeam[activeMemberIndex].stages || {};
                  updatedTeam[activeMemberIndex] = { ...updatedTeam[activeMemberIndex], stages: { ...myStages, attack: Math.max(-6, (myStages.attack || 0) - 1) } };
                  addLog(`⚠️ ${updatedEnemy.name} usou ${enemyMove.name}! Ataque de ${updatedTeam[activeMemberIndex].name} caiu!`, 'enemy');
               }
             }
          } else {
            const enemyDmgRaw = calcDamage(updatedEnemy, enemyMove, updatedTeam[activeMemberIndex]);
            const enemyDmg = Math.max(1, Math.floor(enemyDmgRaw * 0.35));
            updatedTeam[activeMemberIndex].hp = Math.max(0, updatedTeam[activeMemberIndex].hp - enemyDmg);
          }
        }
      }

      setCurrentEnemy(updatedEnemy);
      return { ...prev, team: updatedTeam };
    });

    setMoveIndex(m => m + 1);
    return nextDelay;
  }, [currentEnemy, activeMemberIndex, moveIndex, calcDamage, addFloat, setCurrentEnemy]);

  useAutoFarm(gameState.team[activeMemberIndex], gameState.currentRoute, handleBattleTick);

  const handleUseItem = useCallback((itemId) => {
    if (currentViewRef.current !== 'battles' || !currentEnemy) return;
    
    setGameState(prev => {
      const safeItems = prev.inventory?.items || {};
      if (!safeItems[itemId] || safeItems[itemId] <= 0) return prev;
      
      const newInventory = { 
        ...prev.inventory,
        items: { ...safeItems, [itemId]: safeItems[itemId] - 1 }
      };
      
      if (itemId === 'pokeballs' || itemId === 'great_ball' || itemId === 'ultra_ball') {
        if (currentEnemy.isTrainer) {
          addLog("🚫 Você não pode capturar Pokémons de outros treinadores!", 'enemy');
          return prev;
        }
        
        let multiplier = 1.0;
        if (itemId === 'great_ball') multiplier = 1.5;
        if (itemId === 'ultra_ball') multiplier = 2.0;

        const catchRate = ((1 - (currentEnemy.hp / currentEnemy.maxHp)) + 0.1) * multiplier;
        if (Math.random() < catchRate) {
          addLog(`✨ Capturado! ${currentEnemy.name} agora é seu!`, 'system');
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
            addLog('🎁 Carvalho: "Ótimo trabalho! Tome estas 10 Pokébolas!"', 'drop');
            questUpdate = { worldFlags: prev.worldFlags.filter(f => f !== 'quest_capture_active').concat(['quest_capture_done']) };
          }

          // Unificação por Espécie: Se já tem na caughtData (antes dessa captura), apenas aumenta maestria
          const alreadyCaught = !!(prev.caughtData || {})[currentEnemy.id];
          if (alreadyCaught) {
            addLog(`📊 ${currentEnemy.name} já capturado! Maestria aumentada.`, 'system');
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
          addLog(`💨 O ${currentEnemy.name} escapou da Pokébola!`, 'enemy');
        }
      } else if (itemId === 'potions') {
        const activePoke = prev.team[activeMemberIndex];
        if (activePoke) {
          const newTeam = prev.team.map((p, i) => i === activeMemberIndex ? { ...p, hp: Math.min(p.maxHp, p.hp + 20) } : p);
          addLog(`🧪 Usou Poção em ${activePoke.name}!`, 'system');
          return { ...prev, inventory: newInventory, team: newTeam };
        }
      }
      
      return { ...prev, inventory: newInventory };
    });
  }, [currentEnemy, activeMemberIndex, addLog, spawnEnemy]);

  const startKeyBattle = useCallback((battleData) => {
    const bossPoke = battleData.team[0];
    const maxHp = Math.floor((bossPoke.maxHp || 50) * 2.2); // Aumentado de 1.5x para 2.2x
    const statBuff = 1.15; // +15% em todos os status
    
    setCurrentEnemy({
      ...bossPoke,
      hp: maxHp, maxHp,
      attack: Math.floor((bossPoke.attack || 10) * statBuff),
      defense: Math.floor((bossPoke.defense || 10) * statBuff),
      spAtk: Math.floor((bossPoke.spAtk || 10) * statBuff),
      spDef: Math.floor((bossPoke.spDef || 10) * statBuff),
      speed: Math.floor((bossPoke.speed || 10) * statBuff),
      isShiny: false, status: [],
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
      isTrainer: true,
      trainerName: battleData.name,
      trainerSprite: battleData.sprite,
      trainerReward: battleData.reward || 500,
      isBoss: true,
      isRocket: battleData.isRocket || false,
      badgeToGive: battleData.badgeToGive,
      unlockFlag: battleData.unlockFlag,
    });
    setCurrentView('battles');
    addLog(`🔥 DESAFIO: ${battleData.name} iniciou a batalha!`, 'system');
    isProcessingVictory.current = false;
  }, [setCurrentEnemy, setCurrentView, addLog]);

  const handleChallengeGym = useCallback((gymData) => {
    // Usa o Pokémon mais forte (last) do time do líder
    const teamList = gymData.team || [];
    const leaderPoke = teamList[teamList.length - 1] || teamList[0];
    if (!leaderPoke) return;
    const base = POKEDEX[leaderPoke.id];
    if (!base) return;
    const lvl = leaderPoke.level || 20;
    const maxHp = Math.floor((base.maxHp || base.hp || 50) * 3.5 * (lvl / 20)); // Aumentado de 2.5x para 3.5x
    const statScale = (lvl / 10) * 1.25; // Aumentado de 1.0x para 1.25x

    // Golpes baseados no learnset do Pokémon até o nível do líder
    const learnset = base.learnset || [];
    const availableMoves = learnset
      .filter(m => m.level <= lvl)
      .map(m => {
        const mk = m.move.toLowerCase();
        const md = MOVES[mk] || { name: m.move, power: 40, type: 'Normal', category: 'Physical' };
        return { ...md, name: MOVE_TRANSLATIONS[mk] || md.name || m.move };
      });
    const finalMoves = availableMoves.length > 0 ? availableMoves.slice(-4) : [{ name: 'Investida', power: 40, type: 'Normal', category: 'Physical' }];

    setCurrentEnemy({
      ...base,
      level: lvl,
      hp: maxHp, maxHp,
      attack: Math.floor((base.attack || 10) * statScale),
      defense: Math.floor((base.defense || 10) * statScale),
      spAtk: Math.floor((base.spAtk || 10) * statScale),
      spDef: Math.floor((base.spDef || 10) * statScale),
      speed: Math.floor((base.speed || 10) * statScale),
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
      instanceId: Date.now()
    });
    setCurrentView('battles');
    playBGM('rival');
    addLog(`🏆 GINÁSIO: Líder ${gymData.name} enviou ${base.name}! Nv.${lvl}`, 'system');
    isProcessingVictory.current = false;
  }, [setCurrentEnemy, setCurrentView, addLog, playBGM]);

  const handleCraft = (recipe) => {
    setGameState(prev => {
      // 1. Verificar se tem todos os materiais e dinheiro
      const hasMaterials = Object.entries(recipe.cost).every(([material, amount]) => {
        if (material === 'currency') return prev.currency >= amount;
        return (prev.inventory.materials[material] || 0) >= amount;
      });

      if (!hasMaterials) {
        addLog("❌ Materiais ou Moedas insuficientes!", 'system');
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

      addLog(`🛠️ Você fabricou: ${recipe.name}!`, 'drop');

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
        gymId: battleData.id,
        instanceId: Date.now()
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
      attack: Math.floor((rivalPokeBase.attack || 10) * 1.2),
      defense: Math.floor((rivalPokeBase.defense || 10) * 1.2),
      level: 5,
      moves: rivalPokeBase.moves || [],
      status: [],
      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
      trainerName: 'Azul',
      trainerSprite: getRivalSprite(gameState.trainer?.avatarImg),
      isTrainer: true,
      isBoss: true,
      background: fixPath('/battle_bg_lab_1776866008842.png'),
      unlockFlag: 'rival_lab_defeated',
      isInitialRival: true,
      instanceId: Date.now()
    };

    isProcessingVictory.current = false;
    setCurrentEnemy(rivalEnemy);
    setCurrentView('battles');
    playBGM('rival');
  }, [gameState.team, gameState.trainer, playBGM, setCurrentEnemy, setCurrentView, addLog]);


  useEffect(() => {
    if (!currentEnemy || currentEnemy.hp > 0) return;
    if (isProcessingVictory.current) return;
    isProcessingVictory.current = true;

    stopBGM(400);
    sfxVictory();
    setTimeout(() => playBGM('victory', 0.20), 500);

    const { drops, messages } = processDrops(currentEnemy);
    const baseXpGain = currentEnemy.baseExp || (currentEnemy.level || 5) * 5;
    const aliveCount = gameState.team.filter(p => p.hp > 0).length || 1;
    const xpPerPoke = Math.max(1, Math.floor(baseXpGain / aliveCount));

    setGameState(prev => {
      const newInventory = { ...prev.inventory };
      const newFlags = [...(prev.worldFlags || [])];
      const newBadges = [...(prev.badges || [])];

      Object.entries(drops.materials || {}).forEach(([mat, qty]) => {
        newInventory.materials[mat] = (newInventory.materials[mat] || 0) + qty;
      });
      Object.entries(drops.items || {}).forEach(([item, qty]) => {
        newInventory.items[item] = (newInventory.items[item] || 0) + qty;
      });

      const currentRouteData = ROUTES[prev.currentRoute];
      if (currentRouteData) {
        if (currentRouteData.unlocks) {
          const unlocks = Array.isArray(currentRouteData.unlocks) ? currentRouteData.unlocks : [currentRouteData.unlocks];
          unlocks.forEach(u => {
            if (!newFlags.includes(u)) {
               newFlags.push(u);
               addLog(`✨ Desbloqueado: ${u.replace('_', ' ')}!`, 'system');
            }
          });
        }
      }

      if (currentEnemy.badgeToGive && !newBadges.includes(currentEnemy.badgeToGive)) {
        newBadges.push(currentEnemy.badgeToGive);
        addLog(`🏅 Recebeu a Insígnia: ${currentEnemy.badgeToGive.replace(/_/g, ' ')}!`, 'system');
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

      const newTeam = prev.team.map((p, i) => {
        if (i !== activeMemberIndex || p.hp <= 0) return p;
        const newXp = (p.xp || 0) + xpPerPoke;
        const xpNeeded = (p.level || 5) * 25;
        const badgesCount = prev.badges?.length || 0;
        const maxLevel = GYM_LEVEL_CAPS[badgesCount] || 100;
        const isLevelCapped = gameState.settings?.levelCap !== false && (p.level || 5) >= maxLevel;

        if (newXp >= xpNeeded) {
          if (isLevelCapped) {
            // Se estiver no cap, apenas mantém o nível e zera o excesso de XP (ou mantém no limite)
            return { ...p, level: maxLevel, xp: xpNeeded - 1 };
          }

          const newLevel = (p.level || 5) + 1;
          const scale = newLevel / (p.level || 5);
          addLog(`🎉 ${p.name} subiu para Nv. ${newLevel}!`, 'system');
          sfxLevelUp();

          let newMoves = [...(p.moves || [])];
          let newLearnedMoves = p.learnedMoves ? [...p.learnedMoves] : [...newMoves];
          const pokeData = POKEDEX[Number(p.id)];

          if (pokeData?.learnset) {
            const movesToLearn = pokeData.learnset.filter(l => l.level === newLevel);
            movesToLearn.forEach(learn => {
              const moveKey = learn.move.toLowerCase();
              const moveData = MOVES[moveKey];
              if (moveData && !newLearnedMoves.some(m => m.name === (MOVE_TRANSLATIONS[moveKey] || moveData.name))) {
                const moveObj = { 
                  ...moveData, 
                  name: MOVE_TRANSLATIONS[moveKey] || moveData.name || learn.move 
                };
                newLearnedMoves.push(moveObj);
                if (newMoves.length < 4 && !newMoves.some(m => m.name === moveObj.name)) {
                  newMoves.push(moveObj);
                  addLog(`✨ ${p.name} aprendeu ${moveObj.name}!`, 'system');
                } else {
                  addLog(`✨ ${p.name} aprendeu ${moveObj.name}! (Salvo na Memória)`, 'system');
                }
              }
            });
          }

           // Checagem de Evolução
           if (pokeData?.evolution?.level && newLevel >= pokeData.evolution.level) {
             setEvolutionPending({ ...p, level: newLevel, teamIndex: i });
          }

          return { ...p, level: newLevel, xp: newXp - xpNeeded, moves: newMoves, learnedMoves: newLearnedMoves,
            maxHp: Math.floor((p.maxHp || p.hp) * scale), 
            hp: Math.floor((p.maxHp || p.hp) * scale),
            attack: Math.floor((p.attack || 10) * scale),
            defense: Math.floor((p.defense || 10) * scale),
            spAtk: Math.floor((p.spAtk || 10) * scale),
            spDef: Math.floor((p.spDef || 10) * scale),
            speed: Math.floor((p.speed || 10) * scale),
            stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 }
          };
        }
        return { ...p, xp: newXp, hp: Math.min(p.maxHp, p.hp + Math.ceil(p.maxHp * 0.50)), stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } };
      });

      return {
        ...prev,
        currency: (prev.currency || 0) + (drops.currency || 0) + (currentEnemy.trainerReward || 0),
        inventory: newInventory,
        team: newTeam,
        worldFlags: newFlags,
        badges: newBadges
      };
    });

    messages.forEach(m => addLog(m, 'drop'));
    if (currentEnemy.isTrainer && currentEnemy.trainerReward) {
      addLog(`🏆 ${currentEnemy.trainerName} derrotado! +${currentEnemy.trainerReward} coins`, 'system');
    }
    if (currentEnemy.isRocket) addLog('🚀 Grunt da Equipe Rocket derrotado!', 'system');
    if (currentEnemy.isShiny) addLog('✨ Pokémon shiny derrotado!', 'system');

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
              addLog('🎁 Carvalho: "Ótimo trabalho! Tome estas 10 Pokébolas!"', 'drop');
              questUpdate = { worldFlags: prev.worldFlags.filter(f => f !== 'quest_capture_active').concat(['quest_capture_done']) };
            }

            if (alreadyCaught) {
              addLog(`📊 Auto-captura: ${currentEnemy.name} já capturado! Maestria aumentada.`, 'system');
              const findAndReplace = (list) => list.map(p => {
                if (Number(p.id) === Number(currentEnemy.id)) {
                  if (currentEnemy.isShiny && !p.isShiny) {
                    addLog(`✨ Upgrade Shiny: Seu ${p.name} agora é Brilhante!`, 'system');
                    return { ...p, isShiny: true, hp: p.maxHp };
                  }
                }
                return p;
              });
              return { ...prev, team: findAndReplace(prev.team), pc: findAndReplace(prev.pc || []), inventory: { ...prev.inventory, items: newInventory.items }, speciesMastery: newMastery, caughtData: newCaughtData, ...questUpdate };
            }

            // Primeira Captura via Auto
            addLog(`✨ Auto-capturado! ${currentEnemy.name} agora é seu!`, 'system');
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
                  onClick={() => {
                    if (hasSave && !confirm("Deseja iniciar uma NOVA jornada? Isso apagará seu progresso atual.")) return;
                    setGameState({
                      currency: 0,
                      inventory: {
                        materials: {
                          normal_essence: 0, fire_essence: 0, water_essence: 0, grass_essence: 0,
                          electric_essence: 0, ice_essence: 0, fighting_essence: 0, poison_essence: 0,
                          ground_essence: 0, flying_essence: 0, psychic_essence: 0, bug_essence: 0,
                          rock_essence: 0, ghost_essence: 0, dragon_essence: 0, steel_essence: 0,
                          fairy_essence: 0, dark_essence: 0, mystic_dust: 0, iron_ore: 0
                        },
                        items: { pokeballs: 5, potions: 2, charcoal: 0 }
                      },
                      team: [],
                      pc: [],
                      currentRoute: 'pallet_town',
                      worldFlags: [],
                      badges: [],
                      caughtData: {},
                      speciesMastery: {},
                      autoCapture: false,
                      stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
                      trainer: { name: '', avatarImg: '', level: 1, xp: 0 }
                    });
                    setIntroStep(0);
                    setCurrentView('intro');
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
        <div className="h-full bg-slate-50 flex flex-col items-center justify-center p-6 animate-fadeIn">
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
                     <img src={a.img} onError={(e) => e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/red.png'} className="w-full h-full object-contain group-hover:scale-125 transition-transform" alt={a.name} />
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
             <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
                <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl border-b-[16px] border-slate-200 overflow-hidden relative animate-bounceIn">
                   <button onClick={() => setPreviewStarter(null)} className="absolute top-8 right-8 bg-slate-100 p-4 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-20">
                      <span className="font-black">✕</span>
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
                            worldFlags: [...(prev.worldFlags || []), 'has_starter']
                          })); 
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
      case 'rival_intro': return (
        <div className="h-full flex flex-col items-center bg-slate-800 animate-fadeIn relative overflow-hidden">
           <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
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
      case 'rival_post_battle': return (
        <div className="h-full flex flex-col items-center bg-slate-800 animate-fadeIn relative overflow-hidden">
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
      case 'quest_oak': return (
        <div className="h-full flex flex-col items-center bg-slate-100 animate-fadeIn relative overflow-hidden">
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
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Desbloqueio Especial ★</p>
                   <p className="text-xs font-bold text-slate-800 uppercase mt-1 italic">Iniciais Raríssimos agora aparecem nas Rotas 1, 22 e Floresta!</p>
                </div>
                <button
                  onClick={() => {
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: [...(prev.worldFlags || []), "starters_unlocked"]
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
        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6 relative overflow-hidden">
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
          onChallengeGym={handleChallengeGym}
          onBackToBattle={() => {
            if (gameState.lastFarmingRoute) {
              setGameState(prev => ({ ...prev, currentRoute: prev.lastFarmingRoute }));
              setCurrentEnemy(null);
              setCurrentView('battles');
            } else {
              setCurrentView('routes');
            }
          }}
        />
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
                    <span className="text-xl text-white">←</span>
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
                  onClick={() => setCurrentView('heal_after_defeat')} 
                  className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-purple-500 transition-all active:scale-95 border-b-8 border-purple-800"
                >OK...</button>
              </div>
           </div>
        </div>
      );
      case 'pokedex': return (
        <PokedexScreen 
          POKEDEX={POKEDEX} 
          caughtData={gameState.caughtData} 
          onBack={() => setCurrentView('menu')} 
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

          <main className="flex-1 overflow-y-auto overscroll-contain p-4 w-full relative z-10 custom-scrollbar" style={{ minHeight: 0 }}>
            {renderView()}
          </main>
        </>
      ) : (
        renderView()
      )}

      {sessionStats && (
        <div className="absolute inset-0 z-[100] flex items-end justify-center pb-24 px-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
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
                  { icon: '⚔️', label: 'Nocautes', value: sessionStats.kills },
                  { icon: '✨', label: 'Shinies', value: sessionStats.shinyKills + sessionStats.captures.filter(c => c.isShiny).length },
                  { icon: '🏆', label: 'Trainers', value: sessionStats.trainers },
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
                      const itemLabels = {
                        silk: { icon: '🧵', name: 'Silk' }, feather: { icon: '🪶', name: 'Feather' },
                        apricorn: { icon: '🌰', name: 'Apricorn' }, electric_chip: { icon: '⚡', name: 'Elec. Chip' },
                        moon_stone_shard: { icon: '🌙', name: 'Moon Shard' }, pink_dust: { icon: '🩷', name: 'Pink Dust' },
                        gold_nugget: { icon: '🪙', name: 'Gold Nugget' }, iron_ore: { icon: '⛏️', name: 'Iron Ore' },
                        pokeballs: { icon: '🎾', name: 'Pokébolas' }, great_ball: { icon: '🔵', name: 'Great Ball' },
                        ultra_ball: { icon: '🟡', name: 'Ultra Ball' },
                        normal_essence: { icon: '🟢', name: 'Ess. Normal' }, fire_essence: { icon: '🔥', name: 'Ess. Fogo' },
                        grass_essence: { icon: '🌿', name: 'Ess. Planta' }, water_essence: { icon: '💧', name: 'Ess. Água' },
                        bug_essence: { icon: '🪲', name: 'Ess. Inseto' }, electric_essence: { icon: '⚡', name: 'Ess. Elet.' },
                      };
                      const item = itemLabels[mat] || { icon: '💎', name: mat.split('_').pop() };
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
                        {cap.isShiny && <span className="ml-auto text-[8px] bg-yellow-100 text-yellow-700 font-extrabold px-2 py-0.5 rounded-full border border-yellow-200">✨ SHINY</span>}
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
                <span>➜</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {(!loading && user) && (
        <nav className="bg-white border-t-4 border-slate-200 grid grid-cols-4 z-50 shadow-lg"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: '4.5rem', flexShrink: 0, position: 'sticky', bottom: 0 }}
        >
          <button onClick={() => setCurrentView('routes')} className={`flex flex-col items-center justify-center py-2 transition-all ${currentView === 'routes' ? 'text-pokeBlue scale-110' : 'text-slate-400 opacity-60'}`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="w-7 h-7 object-contain" alt="Routes" />
            <span className="text-[9px] font-black uppercase mt-0.5">Rotas</span>
          </button>
          <button onClick={() => setCurrentView('pokemon_management')} className={`flex flex-col items-center justify-center py-2 transition-all ${currentView === 'pokemon_management' ? 'text-pokeRed scale-110' : 'text-slate-400 opacity-60'}`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-7 h-7 object-contain" alt="Pokemons" />
            <span className="text-[9px] font-black uppercase mt-0.5">Pokémons</span>
          </button>
          <button onClick={handleGoToCity} className={`flex flex-col items-center justify-center py-2 transition-all ${currentView === 'city' ? 'text-pokeGold scale-110' : 'text-slate-400 opacity-60'}`}>
            <span className="text-2xl h-7 flex items-center">🏢</span>
            <span className="text-[9px] font-black uppercase mt-0.5">Cidade</span>
          </button>
          <button onClick={() => setCurrentView('menu')} className={`flex flex-col items-center justify-center py-2 transition-all ${currentView === 'menu' ? 'text-slate-800 scale-110' : 'text-slate-400 opacity-60'}`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-doll.png" className="w-7 h-7 object-contain" alt="Menu" />
            <span className="text-[9px] font-black uppercase mt-0.5">Menu</span>
          </button>
        </nav>
      )}

      {/* MODAIS DE CONSTRUÇÕES */}
      {activeBuildingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] relative border-b-[12px] border-slate-800 animate-slideInUp overflow-hidden">

              
              <button 
                onClick={() => setActiveBuildingModal(null)}
                className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-all border-2 border-slate-100"
              >✕</button>

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
                          sfxHeal();
                          setGameState(prev => ({ ...prev, team: prev.team.map(p => ({ ...p, hp: p.maxHp, stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 } })) }));
                          addLog("🏥 Todos os Pokémon da equipe foram curados!", "system");
                          setActiveBuildingModal(null);
                        }}
                        className="w-full bg-red-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-200"
                      >Sim, por favor!</button>
                   </div>
                </div>
              )}

              {activeBuildingModal === 'mart' && (
                <div className="p-6 flex-1 flex flex-col overflow-hidden">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">🏪</div>
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
                        { id: 'revive', name: 'Revive', price: 1500, img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png', desc: 'Revive Pokémon desmaiado' }
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
                          addLog(`🏪 Comprado: ${qty}x ${item.name}`, 'system');
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
                      <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">🔨</div>
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
                                  addLog(`🔨 Forjado: ${qty}x ${item.name}`, 'system');
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
           <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border-b-8 border-slate-800 animate-slideInUp">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Onde encontrar?</h3>
                 <button onClick={() => setActiveMaterialModal(null)} className="text-slate-300 hover:text-slate-800 transition-colors">✕</button>
              </div>
              
              <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 mb-6">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">💎</div>
                 <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Material:</p>
                    <h4 className="text-lg font-black text-slate-800 uppercase italic mt-1">{activeMaterialModal.replace('_', ' ')}</h4>
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {(() => {
                       switch(activeMaterialModal) {
                          case 'currency': return 'Obtido derrotando Pokémons em qualquer rota ou vendendo itens raros.';
                          case 'normal_essence': return 'Dropado por Pokémons tipo NORMAL (ex: Pidgey, Rattata) na Rota 1 e Pallet.';
                          case 'fire_essence': return 'Dropado por Pokémons tipo FOGO. Procure em áreas vulcânicas ou raramente na Rota 1.';
                          case 'water_essence': return 'Dropado por Pokémons tipo ÁGUA em rios, lagos e oceanos.';
                          case 'grass_essence': return 'Dropado por Pokémons tipo PLANTA na Rota 1 e Floresta de Viridian.';
                          case 'electric_essence': return 'Dropado por Pokémons tipo ELÉTRICO. Tente a Usina de Energia.';
                          case 'ice_essence': return 'Dropado por Pokémons tipo GELO em cavernas geladas ou Ilhas Seafoam.';
                          case 'fighting_essence': return 'Dropado por Pokémons tipo LUTADOR na Rota 22 ou Victory Road.';
                          case 'poison_essence': return 'Dropado por Pokémons tipo VENENO na Floresta de Viridian e pântanos.';
                          case 'ground_essence': return 'Dropado por Pokémons tipo TERRA em cavernas, como a Caverna Diglett.';
                          case 'flying_essence': return 'Dropado por Pokémons tipo VOADOR em rotas abertas e céus.';
                          case 'psychic_essence': return 'Dropado por Pokémons tipo PSÍQUICO em locais misteriosos ou Mansões.';
                          case 'bug_essence': return 'Dropado por Pokémons tipo INSETO na Floresta de Viridian.';
                          case 'rock_essence': return 'Dropado por Pokémons tipo PEDRA em túneis de rocha e cavernas.';
                          case 'ghost_essence': return 'Dropado por Pokémons tipo FANTASMA na Torre Pokémon de Lavender.';
                          case 'dragon_essence': return 'Dropado por Pokémons tipo DRAGÃO em locais sagrados ou Victory Road.';
                          case 'steel_essence': return 'Dropado por Pokémons tipo AÇO em áreas industriais ou usinas.';
                          case 'fairy_essence': return 'Dropado por Pokémons tipo FADA no Monte Lua.';
                          case 'dark_essence': return 'Dropado por Pokémons tipo SOMBRIO em locais escuros ou mansões.';
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

      {/* NOTIFICAÇÃO DE MESTRIA */}
      {masteryNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm animate-slideInDown p-4">
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
              <button onClick={() => setMasteryNotification(null)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-800 transition-colors text-xs font-black">✕</button>
           </div>
        </div>
      )}
    </div>
  );
}


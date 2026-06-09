import { POKEDEX } from '../data/pokedex';
import { GYM_LEVEL_CAPS } from '../data/constants';
import { getCaptureRate, getPokemonRarity } from './pokemonDifficulty';

const TICK_MS = 2500;
const MAX_OFFLINE_MS = 12 * 60 * 60 * 1000; // cap 12h
const MIN_OFFLINE_MS = 60 * 1000; // mínimo 1 minuto para mostrar o modal
const BATTLES_PER_MS = 1 / TICK_MS;

// XP que um membro de bancada recebe (Exp Share simplificado)
const BENCH_XP_RATE = 0.5;

// Espelha TYPE_MATERIAL_MAP de AppRoot
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

// Espelha EVOLUTION_FRAGMENT_DROPS de AppRoot
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

function calcBattleXP(enemy) {
  const baseXp = POKEDEX[Number(enemy.id)]?.baseXp || 50;
  return Math.floor((enemy.level * 1.5 * baseXp) / 7);
}

function calcBattleCoins(enemy) {
  return Math.max(1, Math.floor(enemy.level * 0.15));
}

/** Calcula o cap de nível com base nas insígnias da região ativa.
 *  Espelha getRegionLevelCap + getRegionBadgeCount de AppRoot. */
function getOfflineLevelCap(gameState) {
  if (gameState.settings?.levelCap === false) return 100;
  const region = gameState.activeRegion || 'kanto';
  const caps = GYM_LEVEL_CAPS[region] || {};
  const badgeIds = new Set(Object.keys(caps));
  const playerBadges = new Set(gameState.badges || []);
  const badgeCount = [...badgeIds].filter(id => playerBadges.has(id)).length;
  return Object.values(caps)[badgeCount] || 100;
}

/**
 * Simula level-ups a partir do XP acumulado offline, respeitando o level cap.
 * Espelha o loop em AppRoot.jsx ~linha 4808.
 */
function simulateLevelGain(currentLevel, currentXp, xpGained, levelCap = 100) {
  let level = currentLevel || 1;
  let xp = (currentXp || 0) + xpGained;
  const startLevel = level;
  const cap = Math.min(levelCap, 100);

  while (level < cap) {
    const xpNeeded = Math.pow(level + 1, 3) - Math.pow(level, 3);
    if (xp >= xpNeeded) { xp -= xpNeeded; level++; }
    else break;
  }

  // Se atingiu o cap, descarta XP excedente (igual ao comportamento online)
  if (level >= cap) xp = 0;

  return { newLevel: level, newXp: xp, levelsGained: level - startLevel };
}

/**
 * Calcula drops de materiais para um inimigo ao longo de N batalhas.
 * Usa valores esperados (determinísticos) — mesma filosofia do cálculo de coins.
 * Espelha processDrops() em AppRoot.jsx.
 */
function calcEnemyDrops(enemy, battles) {
  const mats = {};
  const items = {};

  const add = (map, key, qty) => {
    if (!key || qty <= 0) return;
    map[key] = (map[key] || 0) + qty;
  };

  // 1. Essência por tipo (60% por batalha)
  const essenceKey = `${(enemy.type || 'normal').toLowerCase()}_essence`;
  add(mats, essenceKey, Math.floor(battles * 0.6));

  // 2. Material físico por tipo (20% por batalha)
  const physMat = TYPE_MATERIAL_MAP[enemy.type];
  if (physMat) add(mats, physMat, Math.floor(battles * 0.20));

  // 3. enemy.drop probabilístico — corrigido (era acumulação errada)
  if (enemy.drop && enemy.dropChance > 0) {
    add(mats, enemy.drop, Math.floor(battles * enemy.dropChance));
  }

  // 4. Fragmentos de evolução (12% por batalha se o Pokémon os dropa)
  const evFrag = EVOLUTION_FRAGMENT_DROPS[Number(enemy.id)];
  if (evFrag) add(mats, evFrag, Math.floor(battles * 0.12));

  // 5. Pokébolas de chefes selvagens (100% drop, 1 por batalha)
  if (enemy.isWildBoss) add(items, 'pokeballs', battles);

  return { mats, items };
}

/**
 * Simula capturas offline para cada batalha, usando taxa de captura real.
 * Só tenta capturar se autoCapture + autoCaptureConfig.enabled estiver ativo.
 */
function simulateCaptures(gameState, route, battles) {
  const cfg = gameState.autoCaptureConfig;
  if (!gameState.autoCapture || !cfg?.enabled) return [];

  const mode = cfg.mode || 'shiny_only';
  const caughtData = gameState.caughtData || {};
  const captured = {};

  const ballMult = 1.0;

  for (let i = 0; i < battles; i++) {
    const enemy = route.enemies[i % route.enemies.length];
    if (!enemy || enemy.isTrainer || enemy.isWildBoss) continue;

    const alreadyCaught = !!caughtData[String(enemy.id)];
    if (mode === 'shiny_only' && alreadyCaught) continue;
    if (mode === 'not_caught' && alreadyCaught) continue;
    if (mode === 'specific' && !cfg.targetIds?.includes(Number(enemy.id))) continue;

    const enemyAtZeroHp = { ...enemy, hp: 0, maxHp: enemy.maxHp || 50 };
    const rate = getCaptureRate(enemyAtZeroHp, ballMult, POKEDEX);

    if (Math.random() < rate) {
      const key = String(enemy.id);
      if (!captured[key]) {
        captured[key] = {
          id: enemy.id,
          name: POKEDEX[Number(enemy.id)]?.name || enemy.name || `#${enemy.id}`,
          level: enemy.level,
          type: POKEDEX[Number(enemy.id)]?.type || enemy.type || 'Normal',
          types: POKEDEX[Number(enemy.id)]?.types || [POKEDEX[Number(enemy.id)]?.type || enemy.type || 'Normal'],
          rarity: getPokemonRarity(enemy, POKEDEX),
          count: 0,
        };
      }
      captured[key].count++;
    }
  }

  return Object.values(captured);
}

/**
 * Encontra a melhor rota de farm disponível para o jogador.
 * Prioridade: lastFarmingRoute > currentRoute (se farm) > melhor rota desbloqueada
 */
function findBestFarmRoute(gameState, routes) {
  const last = gameState.lastFarmingRoute;
  if (last && routes[last]?.type === 'farm' && routes[last]?.enemies?.length > 0) {
    return last;
  }

  const cur = gameState.currentRoute;
  if (cur && routes[cur]?.type === 'farm' && routes[cur]?.enemies?.length > 0) {
    return cur;
  }

  const worldFlags = new Set(gameState.worldFlags || []);
  let bestRouteId = null;
  let bestLevel = -1;

  for (const [id, route] of Object.entries(routes)) {
    if (route.type !== 'farm' || !Array.isArray(route.enemies) || route.enemies.length === 0) continue;
    const reqs = route.requirements || [];
    const isUnlocked = reqs.length === 0 || reqs.every(req => worldFlags.has(req));
    if (!isUnlocked) continue;
    const avgLevel = route.enemies.reduce((sum, e) => sum + (e.level || 1), 0) / route.enemies.length;
    if (avgLevel > bestLevel) {
      bestLevel = avgLevel;
      bestRouteId = id;
    }
  }

  if (bestRouteId) return bestRouteId;

  for (const [id, route] of Object.entries(routes)) {
    if (route.type === 'farm' && Array.isArray(route.enemies) && route.enemies.length > 0) {
      return id;
    }
  }

  return null;
}

/**
 * Calcula o progresso acumulado offline.
 */
export function calculateOfflineProgress(gameState, routes, elapsedMs) {
  if (!gameState?.playerStats?.lastSeenAt) {
    console.warn('[Offline] Sem lastSeenAt — modal não será exibido.');
    return null;
  }

  if (elapsedMs < MIN_OFFLINE_MS) {
    console.log(`[Offline] Tempo muito curto (${Math.round(elapsedMs / 1000)}s) — ignorando.`);
    return null;
  }

  const cappedMs = Math.min(elapsedMs, MAX_OFFLINE_MS);
  const battles = Math.floor(cappedMs * BATTLES_PER_MS);
  if (battles <= 0) return null;

  const routeId = findBestFarmRoute(gameState, routes);

  if (!routeId) {
    console.warn('[Offline] Nenhuma rota de farm encontrada — modal não será exibido.');
    return null;
  }

  const route = routes[routeId];
  if (!route || route.type !== 'farm' || !Array.isArray(route.enemies) || route.enemies.length === 0) {
    console.warn(`[Offline] Rota "${routeId}" inválida ou sem inimigos.`);
    return null;
  }

  console.log(`[Offline] Calculando ${battles} batalhas em "${routeId}" (${Math.round(cappedMs / 60000)}min offline)`);

  let totalXP = 0;
  let totalCoins = 0;
  const materials = {};
  const items = {};

  // Agrupa batalhas por inimigo (round-robin na lista de enemies)
  const enemyCount = route.enemies.length;
  const battlesPerEnemy = {};
  for (let i = 0; i < battles; i++) {
    const idx = i % enemyCount;
    battlesPerEnemy[idx] = (battlesPerEnemy[idx] || 0) + 1;
  }

  for (const [idxStr, count] of Object.entries(battlesPerEnemy)) {
    const enemy = route.enemies[Number(idxStr)];
    if (!enemy) continue;

    totalXP += calcBattleXP(enemy) * count;
    totalCoins += calcBattleCoins(enemy) * count;

    const { mats, items: itms } = calcEnemyDrops(enemy, count);
    for (const [k, v] of Object.entries(mats)) materials[k] = (materials[k] || 0) + v;
    for (const [k, v] of Object.entries(itms)) items[k] = (items[k] || 0) + v;
  }

  // Remove entradas zero
  for (const key of Object.keys(materials)) {
    if (materials[key] <= 0) delete materials[key];
  }
  for (const key of Object.keys(items)) {
    if (items[key] <= 0) delete items[key];
  }

  // Calcula XP e level-ups por membro do time, respeitando o level cap da região
  const levelCap = getOfflineLevelCap(gameState);
  const teamProgress = (gameState.team || []).map((pokemon, idx) => {
    const xpGained = idx === 0 ? totalXP : Math.floor(totalXP * BENCH_XP_RATE);
    const { newLevel, newXp, levelsGained } = simulateLevelGain(pokemon.level, pokemon.xp, xpGained, levelCap);
    return {
      instanceId: pokemon.instanceId,
      name: pokemon.name,
      id: pokemon.id,
      isShiny: pokemon.isShiny,
      startLevel: pokemon.level || 1,
      newLevel,
      newXp,
      levelsGained,
      xpGained,
    };
  });

  const captures = simulateCaptures(gameState, route, battles);

  return { xp: totalXP, coins: totalCoins, materials, items, battles, cappedMs, routeId, teamProgress, captures };
}

/**
 * Recalcula o moveset de um Pokémon para um determinado nível,
 * espelhando a lógica de level-up do AppRoot.
 * MOVES e MOVE_TRANSLATIONS são passados pelo AppRoot para evitar
 * importar os chunks pesados neste utilitário.
 */
function recalcMoves(pokemon, newLevel, MOVES, MOVE_TRANSLATIONS) {
  if (!MOVES || !MOVE_TRANSLATIONS) return pokemon.moves;
  const base = POKEDEX[Number(pokemon.id)];
  if (!base?.learnset) return pokemon.moves;

  const learnset = base.learnset;
  const available = learnset
    .filter(m => m.level <= newLevel)
    .map(m => {
      const key = (m.move || '').toLowerCase();
      const mData = MOVES[key];
      if (!mData) return null;
      return {
        name: MOVE_TRANSLATIONS[key] || mData.name || m.move,
        power: mData.power || 0,
        type: mData.type || 'Normal',
      };
    })
    .filter(Boolean);

  if (available.length === 0) return [{ name: 'Investida', power: 40, type: 'Normal' }];
  // Mantém até 4 golpes mais recentes (igual ao online)
  return available.slice(-4);
}

/**
 * Aplica o progresso offline ao gameState.
 * MOVES e MOVE_TRANSLATIONS são opcionais — passados pelo AppRoot.
 */
export function applyOfflineProgress(gameState, progress, MOVES, MOVE_TRANSLATIONS) {
  if (!progress) return gameState;

  let newState = { ...gameState };
  newState.currency = (newState.currency || 0) + progress.coins;

  // Aplica XP, level-ups e moves a cada membro
  if (progress.teamProgress?.length > 0) {
    newState.team = newState.team.map((pokemon, idx) => {
      const tp = progress.teamProgress[idx];
      if (!tp) return pokemon;
      const updatedMoves = tp.levelsGained > 0
        ? recalcMoves(pokemon, tp.newLevel, MOVES, MOVE_TRANSLATIONS)
        : pokemon.moves;
      return { ...pokemon, level: tp.newLevel, xp: tp.newXp, moves: updatedMoves };
    });
  }

  // Aplica materiais
  if (Object.keys(progress.materials).length > 0) {
    const mats = { ...(newState.inventory?.materials || {}) };
    for (const [key, amount] of Object.entries(progress.materials)) {
      mats[key] = (mats[key] || 0) + amount;
    }
    newState.inventory = { ...newState.inventory, materials: mats };
  }

  // Aplica itens (pokébolas, etc.)
  if (progress.items && Object.keys(progress.items).length > 0) {
    const itms = { ...(newState.inventory?.items || {}) };
    for (const [key, amount] of Object.entries(progress.items)) {
      itms[key] = (itms[key] || 0) + amount;
    }
    newState.inventory = { ...newState.inventory, items: itms };
  }

  // Registra capturas no caughtData
  if (progress.captures?.length > 0) {
    const newCaught = { ...(newState.caughtData || {}) };
    for (const cap of progress.captures) {
      const key = String(cap.id);
      if (!newCaught[key]) newCaught[key] = { caught: true, count: 0 };
      newCaught[key].count = (newCaught[key].count || 0) + cap.count;
    }
    newState.caughtData = newCaught;
  }

  return newState;
}

export function formatOfflineTime(ms) {
  const totalMin = Math.floor(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours > 0) return `${hours}h ${mins}min`;
  return `${mins} min`;
}

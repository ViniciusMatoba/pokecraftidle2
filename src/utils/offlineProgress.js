import { POKEDEX } from '../data/pokedex';
import { getCaptureRate, getPokemonRarity } from './pokemonDifficulty';

const TICK_MS = 2500;
const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000; // cap 8h
const MIN_OFFLINE_MS = 60 * 1000; // mínimo 1 minuto para mostrar o modal
const BATTLES_PER_MS = 1 / TICK_MS;

// XP que um membro de bancada recebe (Exp Share simplificado)
const BENCH_XP_RATE = 0.5;

function calcBattleXP(enemy) {
  const baseXp = POKEDEX[Number(enemy.id)]?.baseXp || 50;
  return Math.floor((enemy.level * 1.5 * baseXp) / 7);
}

function calcBattleCoins(enemy) {
  return Math.max(1, Math.floor(enemy.level * 0.15));
}

/**
 * Simula level-ups a partir do XP acumulado offline.
 * Espelha o loop em AppRoot.jsx ~linha 4808.
 */
function simulateLevelGain(currentLevel, currentXp, xpGained) {
  let level = currentLevel || 1;
  let xp = (currentXp || 0) + xpGained;
  const startLevel = level;

  while (level < 100) {
    const xpNeeded = Math.pow(level + 1, 3) - Math.pow(level, 3);
    if (xp >= xpNeeded) { xp -= xpNeeded; level++; }
    else break;
  }

  return { newLevel: level, newXp: xp, levelsGained: level - startLevel };
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

  // Multiplicador de bola (offline usa pokeball padrão = 1.0)
  const ballMult = 1.0;

  for (let i = 0; i < battles; i++) {
    const enemy = route.enemies[i % route.enemies.length];
    if (!enemy || enemy.isTrainer || enemy.isWildBoss) continue;

    // Filtra por modo de captura
    const alreadyCaught = !!caughtData[String(enemy.id)];
    if (mode === 'shiny_only') continue; // shinies não aparecem no farm offline
    if (mode === 'not_caught' && alreadyCaught) continue;
    if (mode === 'specific' && !cfg.targetIds?.includes(Number(enemy.id))) continue;

    // Usa enemy com HP=0 para máxima taxa de captura (como no jogo real)
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
  // 1. Tenta lastFarmingRoute
  const last = gameState.lastFarmingRoute;
  if (last && routes[last]?.type === 'farm' && routes[last]?.enemies?.length > 0) {
    return last;
  }

  // 2. Tenta currentRoute se for farm
  const cur = gameState.currentRoute;
  if (cur && routes[cur]?.type === 'farm' && routes[cur]?.enemies?.length > 0) {
    return cur;
  }

  // 3. Fallback: encontra a rota de farm desbloqueada de maior nível
  const worldFlags = new Set(gameState.worldFlags || []);
  let bestRouteId = null;
  let bestLevel = -1;

  for (const [id, route] of Object.entries(routes)) {
    if (route.type !== 'farm' || !Array.isArray(route.enemies) || route.enemies.length === 0) continue;

    // Verifica se a rota está desbloqueada (sem requirements, ou todos satisfeitos)
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

  // 4. Último fallback: primeira rota de farm disponível
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
  // Sem lastSeenAt não há como calcular
  if (!gameState?.playerStats?.lastSeenAt) {
    console.warn('[Offline] Sem lastSeenAt — modal não será exibido.');
    return null;
  }

  // Tempo mínimo para exibir o modal (evita flicker em recargas rápidas)
  if (elapsedMs < MIN_OFFLINE_MS) {
    console.log(`[Offline] Tempo muito curto (${Math.round(elapsedMs / 1000)}s) — ignorando.`);
    return null;
  }

  const cappedMs = Math.min(elapsedMs, MAX_OFFLINE_MS);
  const battles = Math.floor(cappedMs * BATTLES_PER_MS);
  if (battles <= 0) return null;

  // Encontra a melhor rota de farm disponível
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

  for (let i = 0; i < battles; i++) {
    const enemy = route.enemies[i % route.enemies.length];
    totalXP += calcBattleXP(enemy);
    totalCoins += calcBattleCoins(enemy);
    if (enemy.drop && enemy.dropChance) {
      materials[enemy.drop] = (materials[enemy.drop] || 0) + enemy.dropChance;
    }
  }

  for (const key of Object.keys(materials)) {
    materials[key] = Math.floor(materials[key]);
    if (materials[key] <= 0) delete materials[key];
  }

  // Calcula XP e level-ups por membro do time
  const teamProgress = (gameState.team || []).map((pokemon, idx) => {
    const xpGained = idx === 0 ? totalXP : Math.floor(totalXP * BENCH_XP_RATE);
    const { newLevel, newXp, levelsGained } = simulateLevelGain(pokemon.level, pokemon.xp, xpGained);
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

  // Simula capturas
  const captures = simulateCaptures(gameState, route, battles);

  return { xp: totalXP, coins: totalCoins, materials, battles, cappedMs, routeId, teamProgress, captures };
}

/**
 * Aplica o progresso offline ao gameState.
 */
export function applyOfflineProgress(gameState, progress) {
  if (!progress) return gameState;

  let newState = { ...gameState };
  newState.currency = (newState.currency || 0) + progress.coins;

  // Aplica XP e level-ups a cada membro
  if (progress.teamProgress?.length > 0) {
    newState.team = newState.team.map((pokemon, idx) => {
      const tp = progress.teamProgress[idx];
      if (!tp) return pokemon;
      return { ...pokemon, level: tp.newLevel, xp: tp.newXp };
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

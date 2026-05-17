import { POKEDEX } from '../data/pokedex';

const TICK_MS = 2500;        // 1 batalha a cada 2.5s
const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000; // cap: 8 horas
const BATTLES_PER_MS = 1 / TICK_MS;

/**
 * Estima o XP ganho por batalha contra um inimigo.
 * Fórmula espelha AppRoot.jsx linha ~5584.
 */
function calcBattleXP(enemy) {
  const baseXp = POKEDEX[Number(enemy.id)]?.baseXp || 50;
  return Math.floor((enemy.level * 1.5 * baseXp) / 7);
}

/**
 * Estima moedas ganhas por batalha.
 * Fórmula espelha AppRoot.jsx linha ~2113.
 */
function calcBattleCoins(enemy) {
  return Math.max(1, Math.floor(enemy.level * 0.15));
}

/**
 * Calcula progresso acumulado durante o tempo offline.
 *
 * @param {object} gameState - Estado atual do jogo
 * @param {object} routes    - Objeto ROUTES com todas as rotas
 * @param {number} elapsedMs - Milissegundos fora do jogo
 * @returns {{ xp, coins, materials, battles, cappedMs }}
 */
export function calculateOfflineProgress(gameState, routes, elapsedMs) {
  const cappedMs = Math.min(elapsedMs, MAX_OFFLINE_MS);
  const battles = Math.floor(cappedMs * BATTLES_PER_MS);

  if (battles <= 0) return null;

  const routeId = gameState.lastFarmingRoute || gameState.currentRoute;
  const route = routes[routeId];

  // Só calcula progresso se estava em uma rota de farm
  if (!route || route.type !== 'farm' || !Array.isArray(route.enemies) || route.enemies.length === 0) {
    return null;
  }

  let totalXP = 0;
  let totalCoins = 0;
  const materials = {};

  for (let i = 0; i < battles; i++) {
    const enemy = route.enemies[i % route.enemies.length];
    totalXP += calcBattleXP(enemy);
    totalCoins += calcBattleCoins(enemy);

    // Drops de material (simplificado — sem RNG para offline, usa chance média)
    if (enemy.drop && enemy.dropChance) {
      const expectedDrops = enemy.dropChance;
      materials[enemy.drop] = (materials[enemy.drop] || 0) + expectedDrops;
    }
  }

  // Arredonda materiais para inteiros
  for (const key of Object.keys(materials)) {
    materials[key] = Math.floor(materials[key]);
    if (materials[key] <= 0) delete materials[key];
  }

  return { xp: totalXP, coins: totalCoins, materials, battles, cappedMs, routeId };
}

/**
 * Aplica o progresso offline ao gameState e retorna o novo estado.
 */
export function applyOfflineProgress(gameState, progress) {
  if (!progress) return gameState;

  let newState = { ...gameState };

  // Moedas
  newState.currency = (newState.currency || 0) + progress.coins;

  // XP para o líder do time
  if (newState.team?.length > 0) {
    const leader = { ...newState.team[0] };
    leader.xp = (leader.xp || 0) + progress.xp;
    newState.team = [leader, ...newState.team.slice(1)];
  }

  // Materiais
  if (Object.keys(progress.materials).length > 0) {
    const mats = { ...(newState.inventory?.materials || {}) };
    for (const [key, amount] of Object.entries(progress.materials)) {
      mats[key] = (mats[key] || 0) + amount;
    }
    newState.inventory = { ...newState.inventory, materials: mats };
  }

  return newState;
}

/** Formata duração em horas/minutos para exibição. */
export function formatOfflineTime(ms) {
  const totalMin = Math.floor(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours > 0) return `${hours}h ${mins}min`;
  return `${mins} min`;
}

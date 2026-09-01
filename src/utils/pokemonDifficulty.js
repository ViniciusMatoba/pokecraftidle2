import {
  STARTER_IDS,
  PSEUDO_LEGENDARY_IDS,
  ULTRA_BEAST_IDS,
  PARADOX_IDS,
  LEGENDARY_IDS,
  baseSpeciesId,
} from '../data/rarityClassification';

export const RARITY_WEIGHTS = {
  common: 100,
  uncommon: 55,
  rare: 24,
  very_rare: 10,
  super_rare: 3,
  legendary: 1,
};

export const RARITY_CAPTURE_MULTIPLIER = {
  common: 1,
  uncommon: 0.85,
  rare: 0.65,
  very_rare: 0.45,
  super_rare: 0.28,
  legendary: 0.16,
};

// Ordem crescente de raridade (para comparações / UI).
export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'very_rare', 'super_rare', 'legendary'];

// ── Cache do mapa de estágios de evolução ──────────────────────────────
// Reconstruído apenas quando a referência do pokedex muda (singleton POKEDEX).
let _stageCache = { pokedex: null, stages: null };

const buildStageMap = (pokedex) => {
  const evolvesInto = new Set();
  for (const key in pokedex) {
    const evo = pokedex[key]?.evolution;
    if (evo && evo.id !== undefined && evo.id !== null) evolvesInto.add(Number(evo.id));
  }
  const stages = {};
  for (const key in pokedex) {
    const data = pokedex[key];
    if (!data || data.id === undefined) continue;
    const id = Number(data.id);
    const hasEvo = !!(data.evolution && data.evolution.id !== undefined && data.evolution.id !== null);
    const isTarget = evolvesInto.has(id);
    if (!isTarget && hasEvo) stages[id] = 'base';        // início de linha evolutiva
    else if (isTarget && hasEvo) stages[id] = 'mid';     // estágio intermediário
    else if (isTarget && !hasEvo) stages[id] = 'final';  // forma final
    else stages[id] = 'solo';                            // sem evolução (nem entra nem sai)
  }
  return stages;
};

const getStageMap = (pokedex = {}) => {
  if (_stageCache.pokedex !== pokedex || !_stageCache.stages) {
    _stageCache = { pokedex, stages: buildStageMap(pokedex) };
  }
  return _stageCache.stages;
};

// Estágio evolutivo de uma espécie: 'base' | 'mid' | 'final' | 'solo'.
// Formas (mega/regionais) usam a espécie base.
export const getEvolutionStage = (id, pokedex = {}) =>
  getStageMap(pokedex)[baseSpeciesId(id)] || 'solo';

const getBaseStatTotal = (data = {}) =>
  (data.hp || 0) + (data.attack || 0) + (data.defense || 0) +
  (data.spAtk || 0) + (data.spDef || 0) + (data.speed || 0);

// Heurística por estágio de evolução + BST para espécies "comuns".
const classifyByStageAndStats = (stage, bst) => {
  switch (stage) {
    case 'base':
      return 'common';
    case 'mid':
      return 'uncommon';
    case 'final':
      if (bst >= 600) return 'super_rare';
      if (bst >= 525) return 'very_rare';
      if (bst >= 470) return 'rare';
      return 'uncommon';
    case 'solo':
    default:
      if (bst >= 570) return 'super_rare';
      if (bst >= 500) return 'very_rare';
      if (bst >= 435) return 'rare';
      if (bst >= 320) return 'uncommon';
      return 'common';
  }
};

export const getPokemonRarity = (entry = {}, pokedex = {}) => {
  // 1) Override explícito no dado de rota/encontro.
  if (entry.rarity) return entry.rarity;

  // 2) Normaliza formas (mega/regionais) para a espécie base.
  const baseId = baseSpeciesId(entry.id);

  // 3) Listas especiais (todas as gerações).
  if (LEGENDARY_IDS.has(baseId)) return 'legendary';
  if (PSEUDO_LEGENDARY_IDS.has(baseId)) return 'super_rare';
  if (ULTRA_BEAST_IDS.has(baseId)) return 'super_rare';
  if (PARADOX_IDS.has(baseId)) return 'super_rare';
  if (STARTER_IDS.has(baseId)) return 'super_rare';

  // 4) Heurística por estágio de evolução + BST da espécie base.
  const data = pokedex[baseId] || pokedex[Number(entry.id)] || {};
  const stages = getStageMap(pokedex);
  const stage = stages[baseId] || 'solo';
  const bst = getBaseStatTotal(data);
  return classifyByStageAndStats(stage, bst);
};

export const pickWeightedEncounter = (pool = [], pokedex = {}) => {
  if (!pool.length) return null;
  const weighted = pool.map(entry => {
    const rarity = getPokemonRarity(entry, pokedex);
    return {
      entry,
      weight: Math.max(1, entry.spawnWeight || RARITY_WEIGHTS[rarity] || RARITY_WEIGHTS.common),
    };
  });
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.entry;
  }
  return weighted[weighted.length - 1].entry;
};

export const getCaptureRate = (pokemon = {}, ballMultiplier = 1, pokedex = {}) => {
  const maxHp = Math.max(1, pokemon.maxHp || 1);
  const hpRatio = Math.max(0, Math.min(1, (pokemon.hp || 0) / maxHp));
  const missingHpBonus = 1 - hpRatio;
  const rarity = getPokemonRarity(pokemon, pokedex);
  const rarityMult = RARITY_CAPTURE_MULTIPLIER[rarity] || 1;
  const data = pokedex[Number(pokemon.id)] || {};
  const level = pokemon.level || 1;
  const baseXp = data.baseXp || pokemon.baseXp || 50;
  const powerMult = Math.max(0.35, 1 - Math.min(0.45, (level - 5) / 160) - Math.min(0.25, (baseXp - 50) / 600));
  const rate = (missingHpBonus + 0.08) * ballMultiplier * rarityMult * powerMult;
  return Math.max(0.01, Math.min(0.95, rate));
};

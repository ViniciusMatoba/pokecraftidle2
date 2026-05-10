const STARTER_IDS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9,
  152, 153, 154, 155, 156, 157, 158, 159, 160,
  252, 253, 254, 255, 256, 257, 258, 259, 260,
  387, 388, 389, 390, 391, 392, 393, 394, 395,
  495, 496, 497, 498, 499, 500, 501, 502, 503,
  650, 651, 652, 653, 654, 655, 656, 657, 658,
  722, 723, 724, 725, 726, 727, 728, 729, 730,
  810, 811, 812, 813, 814, 815, 816, 817, 818,
  906, 907, 908, 909, 910, 911, 912, 913, 914,
]);
const LEGENDARY_IDS = new Set([144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386]);

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

export const getPokemonRarity = (entry = {}, pokedex = {}) => {
  if (entry.rarity) return entry.rarity;
  const id = Number(entry.id);
  if (STARTER_IDS.has(id)) return 'super_rare';
  if (LEGENDARY_IDS.has(id)) return 'legendary';

  const data = pokedex[id] || {};
  const baseXp = data.baseXp || 50;
  if (baseXp >= 190) return 'very_rare';
  if (baseXp >= 140) return 'rare';
  if (baseXp >= 90) return 'uncommon';
  return 'common';
};

export const pickWeightedEncounter = (pool = [], pokedex = {}) => {
  if (!pool.length) return null;
  const weighted = pool.map(entry => {
    const rarity = getPokemonRarity(entry, pokedex);
    const isStarterFamily = STARTER_IDS.has(Number(entry.id));
    return {
      entry,
      weight: Math.max(1, isStarterFamily
        ? Math.min(entry.spawnWeight || RARITY_WEIGHTS.super_rare, 2)
        : (entry.spawnWeight || RARITY_WEIGHTS[rarity] || RARITY_WEIGHTS.common)),
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

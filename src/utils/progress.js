export const BADGE_ORDER_BY_ID = {
  boulder_badge: 1,
  cascade_badge: 2,
  thunder_badge: 3,
  rainbow_badge: 4,
  soul_badge: 5,
  marsh_badge: 6,
  volcano_badge: 7,
  earth_badge: 8,
};

export const REGION_BADGES_BY_ID = {
  kanto: Object.keys(BADGE_ORDER_BY_ID),
  johto: ['zephyr_badge', 'hive_badge', 'plain_badge', 'fog_badge', 'storm_badge', 'mineral_badge', 'glacier_badge', 'rising_badge'],
  hoenn: ['stone_badge', 'knuckle_badge', 'dynamo_badge', 'heat_badge', 'balance_badge', 'feather_badge', 'mind_badge', 'rain_badge'],
  sinnoh: ['coal_badge', 'forest_badge', 'cobble_badge', 'fen_badge', 'relic_badge', 'mine_badge', 'icicle_badge', 'beacon_badge'],
  unova: ['trio_badge', 'basic_badge', 'insect_badge', 'bolt_badge', 'quake_badge', 'jet_badge', 'freeze_badge', 'legend_badge'],
  kalos: ['bug_badge', 'cliff_badge', 'rumble_badge', 'plant_badge', 'voltage_badge', 'fairy_badge', 'psychic_badge', 'iceberg_badge'],
  alola: ['melemele_stamp', 'akala_stamp', 'ulaula_stamp', 'poni_stamp', 'alola_elite_stamp', 'alola_champion_stamp', 'ultra_stamp', 'battle_tree_stamp'],
  galar: ['grass_badge_galar', 'water_badge_galar', 'fire_badge_galar', 'fighting_badge_galar', 'fairy_badge_galar', 'rock_badge_galar', 'dark_badge_galar', 'dragon_badge_galar'],
  paldea: ['bug_badge_paldea', 'grass_badge_paldea', 'electric_badge_paldea', 'water_badge_paldea', 'normal_badge_paldea', 'ghost_badge_paldea', 'psychic_badge_paldea', 'ice_badge_paldea'],
};

const KNOWN_BADGE_IDS = new Set(Object.values(REGION_BADGES_BY_ID).flat());
const NUMBERED_BADGE_IDS = Object.values(REGION_BADGES_BY_ID).flat();

export const getEarnedBadgeIds = (gameState = {}) => {
  const earned = new Set();
  const sources = [
    ...(gameState.badges || []),
    ...(gameState.worldFlags || []),
  ];

  sources.forEach(badge => {
    if (typeof badge === 'number') {
      const legacyId = badge <= 8 ? REGION_BADGES_BY_ID.kanto[badge - 1] : NUMBERED_BADGE_IDS[badge - 1];
      if (legacyId) earned.add(legacyId);
      return;
    }

    const badgeId = String(badge);
    if (BADGE_ORDER_BY_ID[badgeId]) earned.add(badgeId);
    if (KNOWN_BADGE_IDS.has(badgeId)) earned.add(badgeId);
  });

  return earned;
};

export const getBadgeCount = (gameState = {}) => {
  return getEarnedBadgeIds(gameState).size;
};

export const collectPowerPokemon = (gameState = {}, pokedex = {}) => {
  const lists = [
    ...(gameState.team || []),
    ...(gameState.pc || []),
    ...(gameState.house?.caretakers || []),
    ...Object.values(gameState.expeditions || {}).flatMap(expedition => expedition?.team || []),
    ...Object.values(gameState.regional_teams || gameState.regionalTeams || {}).flat(),
    ...Object.values(gameState.regional_pc || gameState.regionalPc || {}).flat(),
  ].filter(Boolean);

  const seenInstances = new Set();
  const seenSpecies = new Set();
  const ownedPokemon = [];

  lists.forEach(pokemon => {
    const speciesId = Number(pokemon?.id);
    if (!speciesId) return;

    const instanceKey = pokemon.instanceId
      ? `instance:${pokemon.instanceId}`
      : `species:${speciesId}:${pokemon.level || 1}:${pokemon.isShiny ? 'shiny' : 'normal'}`;

    if (seenInstances.has(instanceKey)) return;
    seenInstances.add(instanceKey);
    seenSpecies.add(speciesId);
    ownedPokemon.push(pokemon);
  });

  Object.keys(gameState.caughtData || {}).forEach(id => {
    const speciesId = Number(id);
    if (!speciesId || seenSpecies.has(speciesId)) return;
    const base = pokedex[speciesId] || pokedex[String(speciesId)];
    if (!base) return;
    seenSpecies.add(speciesId);
    ownedPokemon.push({ ...base, id: speciesId, level: 1, fromCaughtData: true });
  });

  return ownedPokemon;
};

export const calculatePokemonPower = (pokemon = {}) => {
  const baseStats =
    (Number(pokemon.maxHp || pokemon.hp || 0) * 2) +
    Number(pokemon.attack || 0) +
    Number(pokemon.defense || 0) +
    Number(pokemon.spAtk || 0) +
    Number(pokemon.spDef || 0) +
    Number(pokemon.speed || 0) +
    (Number(pokemon.level || 1) * 10);
  const shinyBonus = pokemon.isShiny ? Math.max(500, Math.floor(baseStats * 0.35)) : 0;
  return baseStats + shinyBonus;
};

// Conta quantos IVs perfeitos (31) o Pokémon tem (0–6). Compatível com o modelo
// de 6 IVs (pokemon.ivs) e com o legado de um único ivBonus.
export const IV_STAT_KEYS = ['hp', 'atk', 'def', 'spAtk', 'spDef', 'speed'];
export const getPerfectIvCount = (pokemon = {}) => {
  if (pokemon.ivs && typeof pokemon.ivs === 'object') {
    return IV_STAT_KEYS.reduce((n, k) => n + (Number(pokemon.ivs[k]) === 31 ? 1 : 0), 0);
  }
  return Number(pokemon.ivBonus) === 31 ? 1 : 0; // legado
};

// Pesos do "Poder de Coleção" — recompensam o tempo de jogo e a raridade.
export const COLLECTION_WEIGHTS = {
  species: 150,   // por espécie diferente capturada (amplitude da Pokédex)
  badge: 1000,    // por insígnia
  shiny: 800,     // por Pokémon shiny
  alpha: 1200,    // por Pokémon alpha
  perfectIv: 120, // por IV perfeito (31) somado na coleção inteira
};

// Detalha o bônus de coleção que entra no dano ao Boss Global.
export const calculateCollectionBonus = (gameState = {}, pokedex = {}) => {
  const owned = collectPowerPokemon(gameState, pokedex);
  let shiny = 0, alpha = 0, perfectIv = 0;
  for (const p of owned) {
    if (p.isShiny) shiny += 1;
    if (p.isAlpha) alpha += 1;
    perfectIv += getPerfectIvCount(p);
  }
  const species = Object.keys(gameState.caughtData || {}).length
    || new Set(owned.map((p) => Number(p.id)).filter(Boolean)).size;
  const badges = getBadgeCount(gameState);
  const w = COLLECTION_WEIGHTS;
  const counts = { species, badges, shiny, alpha, perfectIv };
  const parts = {
    species: species * w.species,
    badges: badges * w.badge,
    shiny: shiny * w.shiny,
    alpha: alpha * w.alpha,
    perfectIv: perfectIv * w.perfectIv,
  };
  const total = parts.species + parts.badges + parts.shiny + parts.alpha + parts.perfectIv;
  return { counts, parts, total };
};

export const calculatePowerScore = (gameState = {}, pokedex = {}) => {
  const pokemonPower = collectPowerPokemon(gameState, pokedex).reduce(
    (sum, pokemon) => sum + calculatePokemonPower(pokemon),
    0
  );

  // Poder dos Pokémon + Poder de Coleção (espécies, insígnias, shiny, alpha, IVs perfeitos).
  // O boss usa este powerScore (damage + powerScore*0.18), então tudo isso soma no dano.
  return pokemonPower + calculateCollectionBonus(gameState, pokedex).total;
};

export const hasBadge = (gameState = {}, badgeId, order) => {
  const earned = getEarnedBadgeIds(gameState);
  if (earned.has(badgeId)) return true;

  const numericOrder = BADGE_ORDER_BY_ID[badgeId] ? (order || BADGE_ORDER_BY_ID[badgeId]) : null;
  if (!numericOrder) return false;
  return (gameState.badges || []).includes(numericOrder);
};

export const hasProgressRequirement = (gameState = {}, requirement) => {
  if (!requirement) return true;
  if (requirement === 'has_starter') {
    return (gameState.team?.length || 0) > 0 || (gameState.worldFlags || []).includes('has_starter');
  }
  if (requirement === 'champion') {
    return (gameState.worldFlags || []).includes('champion');
  }
  if (requirement.includes('_badges')) {
    return getBadgeCount(gameState) >= Number.parseInt(requirement, 10);
  }
  if (BADGE_ORDER_BY_ID[requirement]) {
    return hasBadge(gameState, requirement);
  }
  return (gameState.worldFlags || []).includes(requirement) || (gameState.badges || []).includes(requirement);
};

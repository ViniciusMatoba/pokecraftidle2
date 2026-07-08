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

export const calculatePowerScore = (gameState = {}, pokedex = {}) => {
  const pokemonPower = collectPowerPokemon(gameState, pokedex).reduce(
    (sum, pokemon) => sum + calculatePokemonPower(pokemon),
    0
  );

  return pokemonPower + (getBadgeCount(gameState) * 1000);
};

export const hasPlayableProgress = (gameState = {}) => {
  const regionalTeams = Object.values(gameState.regional_teams || gameState.regionalTeams || {});
  const regionalPc = Object.values(gameState.regional_pc || gameState.regionalPc || {});

  return Boolean(
    (gameState.team || []).length > 0 ||
    (gameState.pc || []).length > 0 ||
    regionalTeams.some(team => (team || []).length > 0) ||
    regionalPc.some(pc => (pc || []).length > 0) ||
    Object.keys(gameState.caughtData || {}).length > 0 ||
    (gameState.worldFlags || []).length > 0 ||
    (gameState.badges || []).length > 0 ||
    gameState.activeRegion && gameState.activeRegion !== 'kanto' ||
    gameState.currentRoute && gameState.currentRoute !== 'pallet_town' ||
    gameState.oakTutorialShown === true ||
    Number(gameState.currency || 0) > 0 ||
    Number(gameState.tower?.highestFloor || 0) > 0 ||
    Number(gameState.tower?.bp || 0) > 0 ||
    Number(gameState.prestige?.trophies?.length || 0) > 0 ||
    Number(gameState.playerStats?.playTimeMs || 0) > 0
  );
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

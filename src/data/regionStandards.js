import {
  BADGE_IDS,
  JOHTO_BADGE_IDS,
  HOENN_BADGE_IDS,
  SINNOH_BADGE_IDS,
  UNOVA_BADGE_IDS,
  KALOS_BADGE_IDS,
  ALOLA_BADGE_IDS,
  GALAR_BADGE_IDS,
  PALDEA_BADGE_IDS,
  HISUI_BADGE_IDS,
} from './constants';

export const REGION_ORDER = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea', 'hisui'];

export const REGION_LABELS = {
  kanto: 'Kanto',
  johto: 'Johto',
  hoenn: 'Hoenn',
  sinnoh: 'Sinnoh',
  unova: 'Unova',
  kalos: 'Kalos',
  alola: 'Alola',
  galar: 'Galar',
  paldea: 'Paldea',
  hisui: 'Hisui',
};

export const REGION_START_FLAGS = {
  kanto: null,
  johto: 'johto_started',
  hoenn: 'hoenn_started',
  sinnoh: 'sinnoh_started',
  unova: 'unova_started',
  kalos: 'kalos_started',
  alola: 'alola_started',
  galar: 'galar_started',
  paldea: 'paldea_started',
  hisui: 'hisui_started',
};

export const REGION_CHAMPION_FLAGS = {
  kanto: 'champion',
  johto: 'johto_champion',
  hoenn: 'hoenn_champion',
  sinnoh: 'sinnoh_champion',
  unova: 'unova_champion',
  kalos: 'kalos_champion',
  alola: 'alola_champion',
  galar: 'galar_champion',
  paldea: 'paldea_champion',
  hisui: 'hisui_champion',
};

export const REGION_DEX_RANGES = {
  kanto: { min: 1, max: 151 },
  johto: { min: 152, max: 251 },
  hoenn: { min: 252, max: 386 },
  sinnoh: { min: 387, max: 493 },
  unova: { min: 494, max: 649 },
  kalos: { min: 650, max: 721 },
  alola: { min: 722, max: 809 },
  galar: { min: 810, max: 905 },
  paldea: { min: 906, max: 1025 },
  hisui: { min: 387, max: 501 }, // Pokémon de Hisui são formas do pool de Sinnoh
};

export const REGION_BADGE_IDS = {
  kanto: BADGE_IDS,
  johto: JOHTO_BADGE_IDS,
  hoenn: HOENN_BADGE_IDS,
  sinnoh: SINNOH_BADGE_IDS,
  unova: UNOVA_BADGE_IDS,
  kalos: KALOS_BADGE_IDS,
  alola: ALOLA_BADGE_IDS,
  galar: GALAR_BADGE_IDS,
  paldea: PALDEA_BADGE_IDS,
  hisui: HISUI_BADGE_IDS,
};

export const isRegionUnlocked = (gameState = {}, region = 'kanto') => {
  if (region === 'kanto') return true;
  const flags = gameState.worldFlags || [];
  return flags.includes(REGION_START_FLAGS[region]) || gameState.activeRegion === region || flags.includes(REGION_CHAMPION_FLAGS[region]);
};

export const getUnlockedRegions = (gameState = {}) =>
  REGION_ORDER.filter(region => isRegionUnlocked(gameState, region));

export const getPokemonRegion = (pokemonId) => {
  const id = Number(pokemonId);
  // Hisui compartilha range com Sinnoh — priorizar Sinnoh na busca
  const searchOrder = REGION_ORDER.filter(r => r !== 'hisui');
  return searchOrder.find(region => {
    const range = REGION_DEX_RANGES[region];
    return range && id >= range.min && id <= range.max;
  }) || 'future';
};

export const getUnlockedDexLimit = (gameState = {}) => {
  const unlocked = getUnlockedRegions(gameState);
  return unlocked.reduce((limit, region) => {
    const range = REGION_DEX_RANGES[region];
    return range ? Math.max(limit, range.max) : limit;
  }, 151);
};

export const isPokemonAllowedInRegion = (pokemonId, activeRegion = 'kanto') => {
  const pokemonRegion = getPokemonRegion(pokemonId);
  return REGION_ORDER.indexOf(pokemonRegion) <= REGION_ORDER.indexOf(activeRegion);
};

/**
 * Rule: A Pokemon is only legal if:
 * a) Its originRegion matches currentRegion.
 * b) OR the player has the champion flag for the currentRegion.
 */
export const isPokemonLegal = (pokemon, activeRegion = 'kanto', worldFlags = []) => {
  if (!pokemon) return false;

  // Normalize input: allow passing just ID for backward compatibility,
  // but prioritize the pokemon object's properties.
  const pokemonId = typeof pokemon === 'object' ? pokemon.id : pokemon;
  const capturedRegion = typeof pokemon === 'object' ? pokemon.capturedRegion : null;

  // Rule A: Matches current region (Priority: capturedRegion > National Dex Origin)
  const pokemonRegion = capturedRegion || getPokemonRegion(pokemonId);
  if (pokemonRegion === activeRegion) return true;

  // Rule B: Player is Champion of the current region
  const championFlag = REGION_CHAMPION_FLAGS[activeRegion];
  if (championFlag && worldFlags.includes(championFlag)) return true;

  return false;
};

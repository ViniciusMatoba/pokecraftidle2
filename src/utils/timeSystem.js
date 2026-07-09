// Sistema de Dia/Noite baseado no horario real do jogador.
// Afeta Pokemon que aparecem, cor do background e musica.

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return 'morning';   // 05h-09h - Manha
  if (hour >= 10 && hour < 17) return 'day';      // 10h-16h - Dia
  if (hour >= 17 && hour < 20) return 'evening';  // 17h-19h - Tarde
  if (hour >= 20 && hour < 24) return 'night';    // 20h-23h - Noite
  return 'night';                                  // 00h-04h - Madrugada
};

export const TIME_CONFIG = {
  morning: {
    label: 'Manhã',
    emoji: '🌅',
    skyFilter: 'brightness(1.1) saturate(1.2)',
    overlayColor: 'rgba(255,200,100,0.08)',
    rarityBonus: { Normal: 1.2, Flying: 1.3 },
    specialPokemon: [],
  },
  day: {
    label: 'Dia',
    emoji: '☀️',
    skyFilter: 'brightness(1.0) saturate(1.0)',
    overlayColor: 'transparent',
    rarityBonus: {},
    specialPokemon: [],
  },
  evening: {
    label: 'Tarde',
    emoji: '🌆',
    skyFilter: 'brightness(0.9) saturate(1.1) hue-rotate(10deg)',
    overlayColor: 'rgba(255,120,50,0.12)',
    rarityBonus: { Fire: 1.2 },
    specialPokemon: [],
  },
  night: {
    label: 'Noite',
    emoji: '🌙',
    skyFilter: 'brightness(0.65) saturate(0.8) hue-rotate(200deg)',
    overlayColor: 'rgba(0,0,80,0.25)',
    rarityBonus: { Ghost: 1.5, Poison: 1.3, Dark: 1.5, Psychic: 1.2 },
    specialPokemon: [92, 93, 94, 41, 42],
  },
};

export const NIGHT_ONLY_POKEMON = [92, 93, 94, 41, 42, 52, 88];
export const MORNING_BONUS_POKEMON = [16, 17, 18, 19, 20, 21, 22];

const TIME_EXTRA_POKEMON = {
  morning: [16, 17, 19, 21, 161, 165, 172, 179, 187, 191],
  day: [10, 13, 16, 19, 21, 46, 48, 161, 165, 179, 187, 191],
  evening: [23, 41, 77, 163, 167, 179, 198, 200, 228],
  night: [41, 42, 52, 88, 92, 93, 163, 164, 167, 168, 198, 200, 228],
};

const NOCTURNAL_IDS = new Set([41, 42, 52, 88, 92, 93, 94, 163, 164, 167, 168, 198, 200, 228, 229]);
const EARLY_IDS = new Set([16, 17, 18, 19, 20, 21, 22, 161, 162, 165, 166, 172, 179, 187, 188, 191, 192]);
const EARLY_WILD_ROUTE_IDS = new Set(['route_1', 'route_22', 'viridian_forest', 'route_3', 'mt_moon']);
const JOHTO_ROUTE_HINTS = ['johto', 'bark', 'cherrygrove', 'violet', 'azalea', 'goldenrod', 'ecruteak', 'olivine', 'cianwood', 'mahogany', 'blackthorn', 'mt_silver', 'silver', 'sprout', 'ilex', 'slowpoke', 'union_cave', 'national_park', 'burned_tower', 'lake_of_rage', 'ice_path', 'dragons_den', 'johto_victory'];
const HOENN_ROUTE_HINTS = ['hoenn', 'littleroot', 'route_101', 'route_102', 'oldale', 'petalburg', 'rustboro', 'dewford', 'granite_cave', 'slateport', 'mauville', 'route_110', 'route_111', 'route_113', 'fiery_path', 'fallarbor', 'meteor_falls', 'mt_chimney', 'lavaridge', 'fortree', 'lilycove', 'mt_pyre', 'ocean_routes', 'mossdeep', 'seafloor', 'sootopolis', 'cave_of_origin', 'sky_pillar', 'pacifidlog', 'ever_grande', 'victory_road_hoenn', 'route_116', 'rusturf', 'route_104', 'route_118', 'route_120'];

const _isKantoRoute = (route = {}) => {
  const routeText = `${route.id || ''} ${route.group || ''}`.toLowerCase();
  return !JOHTO_ROUTE_HINTS.some(hint => routeText.includes(hint)) &&
    !HOENN_ROUTE_HINTS.some(hint => routeText.includes(hint));
};

const _isJohtoPokemon = (id) => Number(id) >= 152 && Number(id) <= 251;

// ── Gate genérico de região para os bônus de horário ─────────────────────────
// Regra: Pokémon de gerações FUTURAS à região da rota nunca aparecem.
// (Kanto: só gen 1; Johto: gens 1-2; etc.)
const REGION_PROGRESS_ORDER = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea', 'hisui'];
const getPokemonGenRegion = (id) => {
  const n = Number(id);
  if (n >= 1 && n <= 151) return 'kanto';
  if (n <= 251) return 'johto';
  if (n <= 386) return 'hoenn';
  if (n <= 493) return 'sinnoh';
  if (n <= 649) return 'unova';
  if (n <= 721) return 'kalos';
  if (n <= 809) return 'alola';
  if (n <= 905) return 'galar';
  if (n <= 1025) return 'paldea';
  return 'unknown';
};

const inferRegionFromRouteText = (route = {}) => {
  const routeText = `${route.id || ''} ${route.group || ''}`.toLowerCase();
  if (routeText.includes('hisui')) return 'hisui';
  if (routeText.includes('paldea')) return 'paldea';
  if (routeText.includes('galar')) return 'galar';
  if (routeText.includes('alola')) return 'alola';
  if (routeText.includes('kalos')) return 'kalos';
  if (routeText.includes('unova')) return 'unova';
  if (routeText.includes('sinnoh')) return 'sinnoh';
  if (HOENN_ROUTE_HINTS.some(hint => routeText.includes(hint))) return 'hoenn';
  if (JOHTO_ROUTE_HINTS.some(hint => routeText.includes(hint))) return 'johto';
  return 'kanto';
};

const isAllowedForRouteRegion = (id, route = {}) => {
  const routeRegion = inferRegionFromRouteText(route);
  if (routeRegion === 'hisui') return true;
  const rIdx = REGION_PROGRESS_ORDER.indexOf(routeRegion);
  const pIdx = REGION_PROGRESS_ORDER.indexOf(getPokemonGenRegion(id));
  if (rIdx < 0 || pIdx < 0) return false;
  return pIdx <= rIdx;
};

const getTypes = (entry, pokedex = {}) => {
  const data = pokedex?.[Number(entry?.id)] || entry || {};
  return data.types || (data.type ? [data.type] : []);
};

const getEvolutionSource = (id, pokedex = {}) => {
  const targetId = Number(id);
  return Object.values(pokedex || {}).find(p => Number(p?.evolution?.id) === targetId) || null;
};

const getEvolutionUnlockLevel = (id, pokedex = {}) => {
  const source = getEvolutionSource(id, pokedex);
  const level = Number(source?.evolution?.level);
  return Number.isFinite(level) ? level : null;
};

const isEvolvedSpecies = (id, pokedex = {}) => !!getEvolutionSource(id, pokedex);

const isEarlyWildRoute = (route = {}) => {
  const unlockLevel = Number(route.unlockLevel || 0);
  return route.earlyWildOnly === true || EARLY_WILD_ROUTE_IDS.has(route.id) || unlockLevel <= 14;
};

const canAppearAsWildTimeBonus = (id, route = {}, pokedex = {}) => {
  if (!isEvolvedSpecies(id, pokedex)) return true;
  if (isEarlyWildRoute(route)) return false;

  const baseLevel = Number(route?.enemies?.[0]?.level || 1);
  const unlockLevel = getEvolutionUnlockLevel(id, pokedex);
  if (unlockLevel === null) return baseLevel >= 28;
  return baseLevel >= unlockLevel;
};

// Resolve o ID evoluído de um Pokémon para o nível dado (usa POKEDEX passado via parâmetro).
const evolveForLevel = (id, level, pokedex) => {
  let currentId = Number(id);
  for (let i = 0; i < 4; i++) {
    const entry = pokedex?.[currentId];
    const evo = entry?.evolution;
    if (!evo) break;
    const evoList = Array.isArray(evo) ? evo : [evo];
    const match = evoList.find(e => e?.level && e?.id && level >= Number(e.level));
    if (!match) break;
    currentId = Number(match.id);
  }
  return currentId;
};

const getTimeMultiplier = (entry, period, route, pokedex = {}) => {
  const id = Number(entry?.id);
  const types = getTypes(entry, pokedex);
  const biome = route?.biome || '';

  if (period === 'morning') {
    if (EARLY_IDS.has(id)) return 1.85;
    if (types.includes('Flying') || types.includes('Normal') || types.includes('Grass')) return 1.35;
    if (NOCTURNAL_IDS.has(id) || types.includes('Ghost') || types.includes('Dark')) return 0.22;
    return 0.9;
  }

  if (period === 'day') {
    if (NOCTURNAL_IDS.has(id) || types.includes('Ghost') || types.includes('Dark')) return 0.18;
    if (types.includes('Bug') || types.includes('Grass') || types.includes('Normal') || types.includes('Flying')) return 1.25;
    return 1;
  }

  if (period === 'evening') {
    if (NOCTURNAL_IDS.has(id)) return 1.7;
    if (types.includes('Fire') || types.includes('Electric') || types.includes('Poison')) return 1.35;
    if (EARLY_IDS.has(id)) return 0.65;
    return biome === 'cave' ? 1.15 : 0.85;
  }

  if (period === 'night') {
    if (NOCTURNAL_IDS.has(id) || types.includes('Ghost') || types.includes('Dark')) return 2.4;
    if (types.includes('Poison') || types.includes('Psychic')) return 1.35;
    if (EARLY_IDS.has(id) || types.includes('Bug') || types.includes('Grass')) return 0.28;
    return biome === 'cave' ? 1.35 : 0.55;
  }

  return 1;
};

export const getTimeAdjustedEnemyPool = (route, period = getTimeOfDay(), pokedex = {}, options = {}) => {
  const baseEnemies = route?.enemies || [];
  const unique = new Map();
  const blockEarlyEvolutions = isEarlyWildRoute(route);

  baseEnemies.forEach(entry => {
    if (!entry || entry.id === undefined) return;
    if (blockEarlyEvolutions && isEvolvedSpecies(entry.id, pokedex)) return;
    const multiplier = getTimeMultiplier(entry, period, route, pokedex);
    if (options.preview && multiplier < 0.45) return;
    const spawnWeight = Math.max(1, Math.round((entry.spawnWeight || 100) * multiplier));
    unique.set(Number(entry.id), { ...entry, spawnWeight, timeMultiplier: multiplier });
  });

  const baseLevel = baseEnemies[0]?.level || 5;
  const extraLimit = options.preview ? 3 : 2;
  const extras = (TIME_EXTRA_POKEMON[period] || [])
    .filter(id => pokedex?.[id])
    .filter(id => canAppearAsWildTimeBonus(id, route, pokedex))
    .filter(id => isAllowedForRouteRegion(id, route))
    .filter(id => {
      const types = getTypes({ id }, pokedex);
      const biome = route?.biome || '';
      if (period === 'night') return biome === 'cave' || NOCTURNAL_IDS.has(Number(id)) || types.includes('Ghost') || types.includes('Dark') || types.includes('Poison');
      if (period === 'morning') return biome !== 'cave';
      if (period === 'evening') return biome !== 'water' || types.includes('Electric') || types.includes('Poison');
      return biome !== 'cave';
    })
    .map(id => {
      // Aplica evolução baseada no nível da rota para não adicionar formas base em rotas avançadas
      const evolvedId = evolveForLevel(Number(id), baseLevel, pokedex);
      return { id: evolvedId, level: baseLevel, spawnWeight: options.preview ? 80 : 18, timeBonus: true };
    })
    .filter(entry => !unique.has(entry.id)) // deduplicar pelo ID já evoluído
    .slice(0, extraLimit);

  extras.forEach(entry => unique.set(Number(entry.id), entry));

  const result = Array.from(unique.values());
  if (result.length > 0) return result;
  return baseEnemies;
};

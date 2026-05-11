import { hasProgressRequirement } from '../utils/progress';

// ── UTILITIES ──────────────────────────────────────────────────
export const isRouteUnlocked = (route, gameState) => {
  if (!route.requirements || route.requirements.length === 0) return true;
  return route.requirements.every(req => hasProgressRequirement(gameState, req));
};

export const getRouteLevel = (route) => {
  let minLevel = 999;
  if (route.enemies && route.enemies.length > 0) {
    const levels = route.enemies.map(e => e.level).filter(l => typeof l === 'number');
    if (levels.length > 0) minLevel = Math.min(...levels);
  }
  if (route.trainers && route.trainers.length > 0) {
    route.trainers.forEach(t => {
      if (!t.team) return;
      const lvls = t.team.map(p => p.level).filter(l => typeof l === 'number');
      if (lvls.length > 0) {
        const tMin = Math.min(...lvls);
        if (tMin < minLevel) minLevel = tMin;
      }
    });
  }
  return minLevel === 999 ? null : minLevel;
};

export const inferRouteRegion = (routeId, routeGroup) => {
  const str = `${routeId} ${routeGroup || ''}`.toLowerCase();
  if (str.includes('paldea') || str.includes('cabo_poco') || str.includes('mesagoza') || str.includes('area_zero')) return { id: 'paldea', order: 9 };
  if (str.includes('galar') || str.includes('postwick') || str.includes('motostoke') || str.includes('wild_area')) return { id: 'galar', order: 8 };
  if (str.includes('alola') || str.includes('hauoli') || str.includes('akala') || str.includes('poni')) return { id: 'alola', order: 7 };
  if (str.includes('kalos') || str.includes('vaniville') || str.includes('lumiose') || str.includes('victory_road_kalos')) return { id: 'kalos', order: 6 };
  if (str.includes('unova') || str.includes('nuvema') || str.includes('striaton') || str.includes('victory_road_unova')) return { id: 'unova', order: 5 };
  if (str.includes('sinnoh') || str.includes('twinleaf') || str.includes('sandgem') || str.includes('jubilife') || str.includes('survival_area') || str.includes('stark_mountain')) return { id: 'sinnoh', order: 4 };
  if (str.includes('hoenn') || str.includes('littleroot') || str.includes('route_101') || str.includes('route_102') || str.includes('oldale') || str.includes('petalburg') || str.includes('rustboro') || str.includes('dewford') || str.includes('granite_cave') || str.includes('slateport') || str.includes('mauville') || str.includes('route_110') || str.includes('route_111') || str.includes('route_113') || str.includes('fiery_path') || str.includes('fallarbor') || str.includes('meteor_falls') || str.includes('mt_chimney') || str.includes('lavaridge') || str.includes('fortree') || str.includes('lilycove') || str.includes('mt_pyre') || str.includes('ocean_routes') || str.includes('mossdeep') || str.includes('seafloor') || str.includes('sootopolis') || str.includes('cave_of_origin') || str.includes('sky_pillar') || str.includes('pacifidlog') || str.includes('ever_grande') || str.includes('victory_road_hoenn') || str.includes('route_116') || str.includes('rusturf') || str.includes('route_104') || str.includes('route_118') || str.includes('route_120')) return { id: 'hoenn', order: 3 };
  if (str.includes('johto') || str.includes('bark') || str.includes('cherrygrove') || str.includes('violet') || str.includes('azalea') || str.includes('goldenrod') || str.includes('ecruteak') || str.includes('olivine') || str.includes('cianwood') || str.includes('mahogany') || str.includes('blackthorn') || str.includes('mt_silver') || str.includes('silver') || str.includes('sprout') || str.includes('ilex') || str.includes('slowpoke') || str.includes('union_cave') || str.includes('national_park') || str.includes('burned_tower') || str.includes('lake_of_rage') || str.includes('ice_path') || str.includes('dragons_den') || str.includes('johto_victory')) return { id: 'johto', order: 2 };
  return { id: 'kanto', order: 1 };
};

export const getSortedRoutes = (routesObj) => {
  const routesArray = Object.values(routesObj).map(route => ({
    ...route,
    _minLevel: null,
    _region: inferRouteRegion(route.id, route.group),
  }));

  const groupMinLevels = {};
  routesArray.forEach(r => {
    const lv = getRouteLevel(r);
    r._minLevel = lv;
    if (lv !== null) {
      if (!groupMinLevels[r.group] || lv < groupMinLevels[r.group]) {
        groupMinLevels[r.group] = lv;
      }
    }
  });

  routesArray.forEach(r => {
    if (r._minLevel === null) {
      r._minLevel = groupMinLevels[r.group] ?? (r.unlockLevel || 1);
    }
  });

  return routesArray.sort((a, b) => {
    if (a._minLevel !== b._minLevel) return a._minLevel - b._minLevel;
    return a._region.order - b._region.order;
  });
};

// POKEDEX resolvido em runtime pelo App   sem import circular
const pk = (ids, level) => ids.map(id => ({ id: Number(id), level }));

export const getRivalSprite = (playerAvatarImg) => {
  if (playerAvatarImg && playerAvatarImg.includes('blue.png')) {
    return 'https://play.pokemonshowdown.com/sprites/trainers/blue-gen3.png';
  }
  return 'https://play.pokemonshowdown.com/sprites/trainers/blue.png';
};

const S = {
  youngster:   'https://play.pokemonshowdown.com/sprites/trainers/youngster.png',
  lass:        'https://play.pokemonshowdown.com/sprites/trainers/lass.png',
  hiker:       'https://play.pokemonshowdown.com/sprites/trainers/hiker.png',
  bugcatcher:  'https://play.pokemonshowdown.com/sprites/trainers/bugcatcher.png',
  picnicker:   'https://play.pokemonshowdown.com/sprites/trainers/picnicker.png',
  gentleman:   'https://play.pokemonshowdown.com/sprites/trainers/gentleman.png',
  beauty:      'https://play.pokemonshowdown.com/sprites/trainers/beauty.png',
  sailor:      'https://play.pokemonshowdown.com/sprites/trainers/sailor.png',
  aceM:        'https://play.pokemonshowdown.com/sprites/trainers/acetrainer.png',
  aceF:        'https://play.pokemonshowdown.com/sprites/trainers/acetrainerf.png',
  rocket:      'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
  rocketF:     'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
  juggler:     'https://play.pokemonshowdown.com/sprites/trainers/juggler.png',
  gambler:     'https://play.pokemonshowdown.com/sprites/trainers/gambler.png',
  cooltrainer: 'https://play.pokemonshowdown.com/sprites/trainers/red.png',
  blue:        'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
  blue2:       'https://play.pokemonshowdown.com/sprites/trainers/blue-gen3.png',
  brock:       'https://play.pokemonshowdown.com/sprites/trainers/brock.png',
  misty:       'https://play.pokemonshowdown.com/sprites/trainers/misty.png',
  ltsurge:     'https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png',
  erika:       'https://play.pokemonshowdown.com/sprites/trainers/erika.png',
  koga:        'https://play.pokemonshowdown.com/sprites/trainers/koga.png',
  sabrina:     'https://play.pokemonshowdown.com/sprites/trainers/sabrina.png',
  blaine:      'https://play.pokemonshowdown.com/sprites/trainers/blaine.png',
  giovanni:    'https://play.pokemonshowdown.com/sprites/trainers/giovanni.png',
  lorelei:     'https://play.pokemonshowdown.com/sprites/trainers/lorelei-gen3.png',
  bruno:       'https://play.pokemonshowdown.com/sprites/trainers/bruno.png',
  agatha:      'https://play.pokemonshowdown.com/sprites/trainers/agatha-gen3.png',
  lance:       'https://play.pokemonshowdown.com/sprites/trainers/lance.png',
  plasma:      'https://play.pokemonshowdown.com/sprites/trainers/plasmagrunt.png',
  flare:       'https://play.pokemonshowdown.com/sprites/trainers/flaregrunt.png',
  skull:       'https://play.pokemonshowdown.com/sprites/trainers/skullgrunt.png',
  yell:        'https://play.pokemonshowdown.com/sprites/trainers/yellgrunt.png',
  star:        'https://play.pokemonshowdown.com/sprites/trainers/giacomo.png',
};

const buildRegionRoutes = ({ region, label, startFlag, previousChampion, groups, starters, early, mid, late, final, backgrounds }) => ({
  [`${region}_home_town`]: {
    id: `${region}_home_town`, name: groups.home, type: 'city', group: `${label} Inicio`,
    unlockLevel: 1, requirements: [startFlag],
    enemies: [], trainers: [], trainerChance: 0,
    background: backgrounds.city,
    description: `Ponto inicial preparado para a jornada de ${label}.`,
  },
  [`${region}_route_1`]: {
    id: `${region}_route_1`, name: 'Rota Inicial', type: 'farm', group: `${label} Inicio`,
    unlockLevel: 5, requirements: [startFlag], unlocks: `${region}_route_1_cleared`,
    biome: 'grass',
    enemies: pk(early, 8).map((p, i) => ({ ...p, drop: ['normal_essence', 'grass_essence', 'flying_essence'][i % 3] })),
    trainerChance: 0.06,
    trainers: [
      { name: `Treinador ${label} I`, sprite: S.youngster, team: pk([early[0], early[1]], 11), reward: 900 },
      { name: `Treinadora ${label} I`, sprite: S.lass, team: pk([early[2], starters[0]], 12), reward: 1000 },
    ],
    background: backgrounds.route,
    description: `Treino inicial de ${label}, com drops basicos para craft e capturas regionais.`,
  },
  [`${region}_route_2`]: {
    id: `${region}_route_2`, name: 'Rota Intermediaria', type: 'farm', group: `${label} Meio da Jornada`,
    unlockLevel: 28, requirements: [`${region}_route_1_cleared`], unlocks: `${region}_route_2_cleared`,
    biome: 'forest',
    enemies: pk(mid, 32).map((p, i) => ({ ...p, drop: ['bug_essence', 'poison_essence', 'psychic_essence', 'water_essence'][i % 4] })),
    trainerChance: 0.08,
    trainers: [
      { name: `Ace Trainer ${label}`, sprite: S.aceM, team: pk([mid[0], mid[1], starters[1]], 36), reward: 2600 },
      { name: `Ranger ${label}`, sprite: S.aceF, team: pk([mid[2], mid[3]], 37), reward: 2800 },
    ],
    background: backgrounds.route,
    description: `Rota com treinadores pelo menos 3 niveis acima dos selvagens e materiais melhores.`,
  },
  [`${region}_route_3`]: {
    id: `${region}_route_3`, name: 'Rota Avancada', type: 'farm', group: `${label} Fim da Jornada`,
    unlockLevel: 58, requirements: [`${region}_route_2_cleared`], unlocks: `${region}_route_3_cleared`,
    biome: 'mountain',
    enemies: pk(late, 62).map((p, i) => ({ ...p, drop: ['steel_essence', 'dark_essence', 'dragon_essence', 'mystic_dust'][i % 4] })),
    trainerChance: 0.1,
    trainers: [
      { name: `Veteran ${label}`, sprite: S.aceM, team: pk([late[0], late[1], starters[2]], 66), reward: 5200 },
      { name: `Elite Trainer ${label}`, sprite: S.aceF, team: pk([late[2], late[3]], 68), reward: 5600 },
    ],
    background: backgrounds.cave,
    description: `Rota avancada com Pokemon evoluidos, drops raros e treino pre-Liga.`,
  },
  [`${region}_victory_training`]: {
    id: `${region}_victory_training`, name: `Treino de Elite ${label}`, type: 'farm', group: `${label} Pos-Liga`,
    unlockLevel: 90, requirements: [previousChampion], unlocks: `${region}_victory_training_cleared`,
    biome: 'cave',
    enemies: pk(final, 94).map((p, i) => ({ ...p, drop: ['dragon_scale', 'stardust', 'armor_fragment', 'fury_essence'][i % 4] })),
    trainerChance: 0.12,
    trainers: [
      { name: `Campeao de Treino ${label}`, sprite: S.cooltrainer, team: pk([final[0], final[1], final[2]], 100), reward: 10000 },
    ],
    background: backgrounds.elite,
    description: `Estrutura final para treinar Pokemon ate o nivel 100 em ${label}.`,
  },
});

const FUTURE_REGION_ROUTES = {
  ...buildRegionRoutes({
    region: 'unova', label: 'Unova', startFlag: 'unova_started', previousChampion: 'unova_champion',
    groups: { home: 'Nuvema Town' }, starters: [497, 500, 503], early: [504, 506, 509, 519], mid: [507, 510, 520, 527], late: [530, 534, 553, 567], final: [612, 635, 637, 643],
    backgrounds: { city: '/bg_unova_city.png', route: '/bg_unova_route.png', cave: '/bg_unova_cave.png', elite: '/bg_unova_elite.png' },
  }),
  ...buildRegionRoutes({
    region: 'kalos', label: 'Kalos', startFlag: 'kalos_started', previousChampion: 'kalos_champion',
    groups: { home: 'Vaniville Town' }, starters: [652, 655, 658], early: [659, 661, 664, 669], mid: [660, 662, 666, 672], late: [675, 678, 681, 697], final: [700, 706, 715, 716],
    backgrounds: { city: '/bg_kalos_city.png', route: '/bg_kalos_route.png', cave: '/bg_kalos_cave.png', elite: '/bg_kalos_elite.png' },
  }),
  ...buildRegionRoutes({
    region: 'alola', label: 'Alola', startFlag: 'alola_started', previousChampion: 'alola_champion',
    groups: { home: 'Hauoli Outskirts' }, starters: [724, 727, 730], early: [731, 734, 736, 739], mid: [735, 738, 744, 752], late: [758, 760, 768, 776], final: [784, 791, 792, 800],
    backgrounds: { city: '/bg_alola_city.png', route: '/bg_alola_route.png', cave: '/bg_alola_cave.png', elite: '/bg_alola_elite.png' },
  }),
  ...buildRegionRoutes({
    region: 'galar', label: 'Galar', startFlag: 'galar_started', previousChampion: 'galar_champion',
    groups: { home: 'Postwick' }, starters: [812, 815, 818], early: [819, 821, 824, 827], mid: [820, 823, 828, 834], late: [839, 844, 849, 861], final: [887, 888, 889, 890],
    backgrounds: { city: '/bg_galar_city.png', route: '/bg_galar_route.png', cave: '/bg_galar_cave.png', elite: '/bg_galar_elite.png' },
  }),
  ...buildRegionRoutes({
    region: 'paldea', label: 'Paldea', startFlag: 'paldea_started', previousChampion: 'paldea_champion',
    groups: { home: 'Cabo Poco' }, starters: [908, 911, 914], early: [915, 917, 919, 921], mid: [916, 920, 922, 926], late: [936, 943, 952, 959], final: [967, 973, 998, 1008],
    backgrounds: { city: '/bg_paldea_city.png', route: '/bg_paldea_route.png', cave: '/bg_paldea_cave.png', elite: '/bg_paldea_elite.png' },
  }),
};

const rangeIds = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index);

const splitRegionalDex = (start, end) => {
  const ids = rangeIds(start, end);
  const chunkSize = Math.ceil(ids.length / 4);
  return [
    ids.slice(0, chunkSize),
    ids.slice(chunkSize, chunkSize * 2),
    ids.slice(chunkSize * 2, chunkSize * 3),
    ids.slice(chunkSize * 3),
  ];
};

const uniqueIds = (ids) => [...new Set(ids.map(Number).filter(Boolean))];

const withDrops = (ids, level, drops, spawnWeight = 60) =>
  pk(uniqueIds(ids), level).map((pokemon, index) => ({
    ...pokemon,
    spawnWeight,
    drop: drops[index % drops.length],
  }));

const STARTER_IDS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9,           // Kanto
  152, 153, 154, 155, 156, 157, 158, 159, 160, // Johto
  252, 253, 254, 255, 256, 257, 258, 259, 260, // Hoenn
  387, 388, 389, 390, 391, 392, 393, 394, 395, // Sinnoh
  495, 496, 497, 498, 499, 500, 501, 502, 503, // Unova
  650, 651, 652, 653, 654, 655, 656, 657, 658, // Kalos
  722, 723, 724, 725, 726, 727, 728, 729, 730, // Alola
  810, 811, 812, 813, 814, 815, 816, 817, 818, // Galar
  906, 907, 908, 909, 910, 911, 912, 913, 914  // Paldea
]);

const legacyEncounters = (regionIndex, phaseIndex) => {
  if (regionIndex <= 0) return [];
  const previousMax = [
    151, 251, 386, 493, 649, 721, 809, 905, 1025,
  ][regionIndex - 1] || 151;
  const previousMin = regionIndex === 1 ? 1 : [
    1, 152, 252, 387, 494, 650, 722, 810, 906,
  ][regionIndex - 1];
  const span = previousMax - previousMin + 1;
  const step = Math.max(1, Math.floor(span / 8));
  const start = previousMin + (phaseIndex * step);
  
  // Filtra iniciais para que não apareçam fora de sua região
  return rangeIds(start, Math.min(previousMax, start + 5)).filter(id => !STARTER_IDS.has(id));
};

const buildRegionalDexCoverageRoutes = ({
  region,
  label,
  regionIndex,
  startRequirement,
  championRequirement,
  range,
  backgrounds,
}) => {
  const [early, middle, advanced, elite] = splitRegionalDex(range[0], range[1]);
  const field1 = `${region}_dex_field_1_cleared`;
  const field2 = `${region}_dex_field_2_cleared`;
  const field3 = `${region}_dex_field_3_cleared`;
  const field4 = `${region}_dex_field_4_cleared`;
  const drops = ['normal_essence', 'grass_essence', 'water_essence', 'flying_essence', 'bug_essence'];
  const rareDrops = ['psychic_essence', 'ghost_essence', 'dark_essence', 'steel_essence', 'dragon_essence'];

  return {
    [`${region}_dex_field_1`]: {
      id: `${region}_dex_field_1`, name: `Habitat Regional ${label} I`, type: 'farm', group: `${label} Pokedex`,
      unlockLevel: 12, requirements: [startRequirement], unlocks: field1,
      biome: 'grass',
      enemies: withDrops([...early, ...legacyEncounters(regionIndex, 0)], 12, drops, 90),
      trainerChance: 0.07,
      trainers: [
        { name: `Pesquisador ${label} I`, sprite: S.youngster, team: pk(early.slice(0, 3), 15), reward: 1100 },
      ],
      background: backgrounds.route,
      description: `Cobertura inicial da Pokedex de ${label}, focada em capturas basicas e primeiras evolucoes.`,
    },
    [`${region}_dex_field_2`]: {
      id: `${region}_dex_field_2`, name: `Habitat Regional ${label} II`, type: 'farm', group: `${label} Pokedex`,
      unlockLevel: 34, requirements: [field1], unlocks: field2,
      biome: 'forest',
      enemies: withDrops([...middle, ...legacyEncounters(regionIndex, 1)], 36, drops, 70),
      trainerChance: 0.08,
      trainers: [
        { name: `Pesquisadora ${label} II`, sprite: S.lass, team: pk(middle.slice(0, 3), 40), reward: 2600 },
      ],
      background: backgrounds.forest || backgrounds.route,
      description: `Encontros intermediarios com maior presenca de Pokemon evoluidos e materiais melhores.`,
    },
    [`${region}_dex_field_3`]: {
      id: `${region}_dex_field_3`, name: `Habitat Regional ${label} III`, type: 'farm', group: `${label} Pokedex`,
      unlockLevel: 62, requirements: [field2], unlocks: field3,
      biome: 'mountain',
      enemies: withDrops([...advanced, ...legacyEncounters(regionIndex, 2)], 66, rareDrops, 48),
      trainerChance: 0.1,
      trainers: [
        { name: `Veteran ${label} III`, sprite: S.aceM, team: pk(advanced.slice(0, 3), 70), reward: 5200 },
      ],
      background: backgrounds.cave || backgrounds.route,
      description: `Faixa avancada para encontrar evolucoes fortes, raros regionais e drops de forja superior.`,
    },
    [`${region}_dex_field_4`]: {
      id: `${region}_dex_field_4`, name: `Reserva Pos-Liga ${label}`, type: 'farm', group: `${label} Pos-Liga`,
      unlockLevel: 86, requirements: [field3, championRequirement], unlocks: field4,
      biome: 'cave',
      enemies: withDrops([...elite, ...legacyEncounters(regionIndex, 3)], 90, rareDrops, 30),
      trainerChance: 0.12,
      trainers: [
        { name: `Elite Collector ${label}`, sprite: S.aceF, team: pk(elite.slice(0, 4), 94), reward: 8200 },
      ],
      background: backgrounds.elite || backgrounds.cave || backgrounds.route,
      description: `Reserva pos-Liga com os encontros mais raros da regiao e maior chance de Pokemon totalmente evoluidos.`,
    },
    [`${region}_dex_level_100`]: {
      id: `${region}_dex_level_100`, name: `Treino Nivel 100 ${label}`, type: 'farm', group: `${label} Pos-Liga`,
      unlockLevel: 100, requirements: [field4, championRequirement],
      biome: 'mountain',
      enemies: withDrops([...elite.slice(-Math.ceil(elite.length / 2)), ...advanced.slice(-12)], 100, rareDrops, 24),
      trainerChance: 0.14,
      trainers: [
        { name: `Campeao de Treino ${label}`, sprite: S.cooltrainer, team: pk(elite.slice(-4), 100), reward: 12000 },
      ],
      background: backgrounds.elite || backgrounds.cave || backgrounds.route,
      description: `Rota final para treinar qualquer Pokemon de ${label} ate o nivel 100.`,
    },
  };
};

const REGIONAL_DEX_COVERAGE_ROUTES = {
  ...buildRegionalDexCoverageRoutes({
    region: 'kanto', label: 'Kanto', regionIndex: 0, startRequirement: 'has_starter', championRequirement: 'champion',
    range: [1, 151],
    backgrounds: { route: '/battle_bg_route24_25_1776993592209.png', forest: '/battle_bg_forest_1776863795763.png', cave: '/battle_bg_cave_1776863810604.png', elite: '/battle_bg_elite_four.png' },
  }),
  ...buildRegionalDexCoverageRoutes({
    region: 'johto', label: 'Johto', regionIndex: 1, startRequirement: 'johto_started', championRequirement: 'johto_champion',
    range: [152, 251],
    backgrounds: { route: '/bg_route30_johto.png', forest: '/bg_ilex_forest.png', cave: '/bg_mt_silver.png', elite: '/bg_johto_league.png' },
  }),
  ...buildRegionalDexCoverageRoutes({
    region: 'hoenn', label: 'Hoenn', regionIndex: 2, startRequirement: 'hoenn_started', championRequirement: 'hoenn_champion',
    range: [252, 386],
    backgrounds: { route: '/bg_route119.png', forest: '/bg_petalburg_woods.png', cave: '/bg_meteor_falls.png', elite: '/bg_elite_four_hoenn.png' },
  }),
  ...buildRegionalDexCoverageRoutes({
    region: 'sinnoh', label: 'Sinnoh', regionIndex: 3, startRequirement: 'sinnoh_started', championRequirement: 'sinnoh_champion',
    range: [387, 493],
    backgrounds: { route: '/bg_route202.png', forest: '/bg_eterna_forest.png', cave: '/bg_mt_coronet.png', elite: '/bg_sinnoh_league.png' },
  }),
  ...buildRegionalDexCoverageRoutes({
    region: 'unova', label: 'Unova', regionIndex: 4, startRequirement: 'unova_started', championRequirement: 'unova_champion',
    range: [494, 649],
    backgrounds: { route: '/bg_unova_route.png', forest: '/bg_unova_route.png', cave: '/bg_unova_cave.png', elite: '/bg_unova_elite.png' },
  }),
  ...buildRegionalDexCoverageRoutes({
    region: 'kalos', label: 'Kalos', regionIndex: 5, startRequirement: 'kalos_started', championRequirement: 'kalos_champion',
    range: [650, 721],
    backgrounds: { route: '/bg_kalos_route.png', forest: '/bg_kalos_route.png', cave: '/bg_kalos_cave.png', elite: '/bg_kalos_elite.png' },
  }),
  ...buildRegionalDexCoverageRoutes({
    region: 'alola', label: 'Alola', regionIndex: 6, startRequirement: 'alola_started', championRequirement: 'alola_champion',
    range: [722, 809],
    backgrounds: { route: '/bg_alola_route.png', forest: '/bg_alola_route.png', cave: '/bg_alola_cave.png', elite: '/bg_alola_elite.png' },
  }),
  ...buildRegionalDexCoverageRoutes({
    region: 'galar', label: 'Galar', regionIndex: 7, startRequirement: 'galar_started', championRequirement: 'galar_champion',
    range: [810, 905],
    backgrounds: { route: '/bg_galar_route.png', forest: '/bg_galar_route.png', cave: '/bg_galar_cave.png', elite: '/bg_galar_elite.png' },
  }),
  ...buildRegionalDexCoverageRoutes({
    region: 'paldea', label: 'Paldea', regionIndex: 8, startRequirement: 'paldea_started', championRequirement: 'paldea_champion',
    range: [906, 1025],
    backgrounds: { route: '/bg_paldea_route.png', forest: '/bg_paldea_route.png', cave: '/bg_paldea_cave.png', elite: '/bg_paldea_elite.png' },
  }),
};

export const GYM_LEADERS = {
  brock:    { id: 'brock',    name: 'Brock',    sprite: S.brock,    badge: 1, badgeName: 'Insígnia da Rocha',      reward: 1200,  team: pk([74, 95], 14),              unlockFlag: 'boulder_badge', introText: 'Sou Brock! Minha especialidade são Pokémon do tipo Pedra!' },
  misty:    { id: 'misty',    name: 'Misty',    sprite: S.misty,    badge: 2, badgeName: 'Insígnia da Cascata',    reward: 2500,  team: pk([120, 121], 21),            unlockFlag: 'cascade_badge', introText: 'Sou Misty! Prepare-se para o poder da água!' },
  ltsurge:  { id: 'ltsurge',  name: 'Lt. Surge',sprite: S.ltsurge,  badge: 3, badgeName: 'Insígnia do Trovão',    reward: 4000,  team: pk([100, 25, 26], 24),         unlockFlag: 'thunder_badge', introText: 'Hah! Seu funeral, recruta!' },
  erika:    { id: 'erika',    name: 'Erika',    sprite: S.erika,    badge: 4, badgeName: 'Insígnia do Arco-Íris', reward: 5000,  team: pk([71, 70, 45], 32),          unlockFlag: 'rainbow_badge', introText: 'Voce me acordou. Vou lutar então.' },
  koga:     { id: 'koga',     name: 'Koga',     sprite: S.koga,     badge: 5, badgeName: 'Insígnia da Alma',      reward: 7000,  team: pk([109, 89, 110, 49], 43),   unlockFlag: 'soul_badge',    introText: 'Meu veneno ira paralisa-lo... inexoravelmente!' },
  sabrina:  { id: 'sabrina',  name: 'Sabrina',  sprite: S.sabrina,  badge: 6, badgeName: 'Insígnia do Pântano',   reward: 8000,  team: pk([64, 122, 65], 46),         unlockFlag: 'marsh_badge',   introText: 'Ja previ sua derrota. Ainda assim, entre.' },
  blaine:   { id: 'blaine',   name: 'Blaine',   sprite: S.blaine,   badge: 7, badgeName: 'Insígnia do Vulcão',    reward: 9500,  team: pk([58, 78, 126, 77], 50),     unlockFlag: 'volcano_badge', introText: 'Minha habilidade com Fire queimara voce ate as cinzas!' },
  giovanni: { id: 'giovanni', name: 'Giovanni', sprite: S.giovanni, badge: 8, badgeName: 'Insígnia da Terra',     reward: 15000, team: pk([111, 51, 112, 34], 55),    unlockFlag: 'earth_badge',   introText: 'Eu, Giovanni, vou destruí-lo!' },
};

export const ROUTES = {

  pallet_town: {
    id: 'pallet_town', name: 'Cidade de Pallet', type: 'city', group: 'Pallet Town',
    unlockLevel: 0, requirements: [], unlocks: 'starter_event',
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Sua jornada começa aqui.',
  },

  route_1: {
    id: 'route_1', name: 'Rota 1', type: 'farm', group: 'Pallet Town',
    unlockLevel: 1, requirements: ['has_starter'],
    biome: 'grass',
    enemies: [
      { id: 16, level: 3, drop: 'normal_essence' },
      { id: 19, level: 3, drop: 'normal_essence' },
    ],
    trainerChance: 0.05,
    trainers: [
      { name: 'Youngster Joey',  sprite: S.youngster, team: pk([19], 4),      reward: 80 },
      { name: 'Lass Haley',      sprite: S.lass,      team: pk([16, 16], 3),  reward: 60 },
      { name: 'Youngster Mikey', sprite: S.youngster, team: pk([16, 19], 3),  reward: 70 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Caminho gramado para Viridian. Seu rival te espera!',
  },

  viridian_city: {
    id: 'viridian_city', name: 'Cidade de Viridian', type: 'city', group: 'Viridian City',
    unlockLevel: 3, requirements: ['has_starter'], unlocks: 'parcel_pickup',
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Um centro urbano agitado.',
  },

  route_22: {
    id: 'route_22', name: 'Rota 22', type: 'farm', group: 'Viridian City',
    unlockLevel: 3, requirements: ['has_starter'],
    biome: 'grass',
    enemies: [
      { id: 56, level: 4, drop: 'fighting_essence' },
      { id: 21, level: 4, drop: 'flying_essence' },
      { id: 29, level: 4, drop: 'poison_essence' },
      { id: 32, level: 4, drop: 'poison_essence' },
    ],
    trainerChance: 0.05,
    trainers: [
      { name: 'Youngster Ben',    sprite: S.youngster, team: pk([56], 4),       reward: 80  },
      { name: 'Hiker Clark',      sprite: S.hiker,     team: pk([21, 56], 5),   reward: 120 },
      { name: 'Youngster Calvin', sprite: S.youngster, team: pk([29, 32], 4),   reward: 80  },
    ],
    background: '/battle_bg_route22_1776993565727.png',
    description: 'Caminho oeste de Viridian.',
  },

  viridian_forest: {
    id: 'viridian_forest', name: 'Floresta de Viridian', type: 'farm', group: 'Viridian City',
    unlockLevel: 5, requirements: ['has_starter', 'rival_1_defeated'],
    biome: 'forest',
    enemies: pk([10, 13, 11, 14], 6),
    trainerChance: 0.05,
    trainers: [
      { name: 'Bug Catcher Rick',    sprite: S.bugcatcher, team: pk([10, 13], 6),      reward: 90  },
      { name: 'Bug Catcher Doug',    sprite: S.bugcatcher, team: pk([13, 10, 10], 5),  reward: 75  },
      { name: 'Bug Catcher Anthony', sprite: S.bugcatcher, team: pk([11, 14], 7),      reward: 100 },
      { name: 'Bug Catcher Sammy',   sprite: S.bugcatcher, team: pk([10, 11, 14], 8),  reward: 120 },
      { name: 'Bug Catcher Charlie', sprite: S.bugcatcher, team: pk([13, 14, 14], 7),  reward: 110 },
    ],
    background: '/battle_bg_forest_1776863795763.png',
    description: 'Floresta de insetos. Um grunt da Rocket bloqueia a saída!',
  },

  pewter_city: {
    id: 'pewter_city', name: 'Cidade de Pewter', type: 'city', group: 'Pewter City',
    hasGym: true, gymLeader: GYM_LEADERS.brock,
    unlockLevel: 8, requirements: ['viridian_forest_cleared'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Cidade de pedra. Derrote Brock para continuar!',
  },

  route_3: {
    id: 'route_3', name: 'Rota 3', type: 'farm', group: 'Pewter City',
    unlockLevel: 12, requirements: ['boulder_badge'],
    biome: 'grass',
    enemies: pk([21, 39, 11, 14, 29, 32], 10),
    trainerChance: 0.05,
    trainers: [
      { name: 'Lass Janice',         sprite: S.lass,       team: pk([39, 16], 10),   reward: 180 },
      { name: 'Youngster Mike',      sprite: S.youngster,  team: pk([21, 21], 10),   reward: 160 },
      { name: 'Hiker Eric',          sprite: S.hiker,      team: pk([74, 95], 11),   reward: 220 },
      { name: 'Bug Catcher Sammy',   sprite: S.bugcatcher, team: pk([14, 11], 10),   reward: 160 },
      { name: 'Ace Trainer Marissa', sprite: S.aceF,       team: pk([39, 21], 12),   reward: 300 },
    ],
    background: '/battle_bg_route3_1776993578907.png',
    description: 'Terreno árido a caminho de Mt. Moon.',
  },

  mt_moon: {
    id: 'mt_moon', name: 'Mt. Moon', type: 'farm', group: 'Pewter City',
    unlockLevel: 14, requirements: ['boulder_badge'],
    unlocks: 'mt_moon_cleared',
    biome: 'mountain',
    enemies: [
      { id: 41, level: 12 }, // Zubat
      { id: 74, level: 12 }, // Geodude
      { id: 35, level: 13, drop: 'moon_stone_shard', dropChance: 0.12 }, // Clefairy dropa fragmentos da Pedra da Lua
      { id: 46, level: 12 }, // Paras
    ],
    trainerChance: 0.05,
    trainers: [
      { name: 'Hiker Marcos',        sprite: S.hiker,   team: pk([74, 41], 12),   reward: 240 },
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([41, 41], 13),   reward: 260, isRocket: true },
      { name: 'Team Rocket Grunt F', sprite: S.rocketF, team: pk([41, 23], 13),   reward: 260, isRocket: true },
      { name: 'Hiker Jim',           sprite: S.hiker,   team: pk([95, 74], 13),   reward: 260 },
      { name: 'Lass Iris',           sprite: S.lass,    team: pk([35, 39], 11),   reward: 200 },
    ],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'Caverna misteriosa. Clefairys raramente carregam Pedras da Lua!',
  },

  cerulean_city: {
    id: 'cerulean_city', name: 'Cidade de Cerulean', type: 'city', group: 'Cerulean City',
    hasGym: true, gymLeader: GYM_LEADERS.misty,
    requirements: ['mt_moon_cleared', 'mt_moon_rockets_defeated'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Cidade banhada pela água. Desafie Misty!',
  },

  route_24_25: {
    id: 'route_24_25', name: 'Rotas 24 e 25', type: 'farm', group: 'Cerulean City',
    unlockLevel: 17, requirements: ['cascade_badge'],
    biome: 'grass',
    enemies: pk([43, 60, 29, 32, 63], 15),
    trainerChance: 0.05,
    trainers: [
      { name: 'Bug Catcher Cale', sprite: S.bugcatcher, team: pk([48, 43], 15), reward: 260 },
      { name: 'Lass Dana',        sprite: S.lass,        team: pk([29, 32], 15), reward: 260 },
      { name: 'Youngster Timmy',  sprite: S.youngster,   team: pk([21, 16], 15), reward: 240 },
      { name: 'Hiker Lenny',      sprite: S.hiker,       team: pk([74, 74], 16), reward: 300 },
    ],
    background: '/battle_bg_route24_25_1776993592209.png',
    description: 'Rotas do Cabo Cerulean. Rival te espera!',
  },

  route_5_6: {
    id: 'route_5_6', name: 'Rotas 5 e 6', type: 'farm', group: 'Vermilion City',
    unlockLevel: 18, requirements: ['cascade_badge'],
    biome: 'grass',
    enemies: pk([16, 19, 52, 39, 96], 18),
    trainerChance: 0.05,
    trainers: [
      { name: 'Picnicker Irene',  sprite: S.picnicker, team: pk([19, 52], 19),     reward: 280 },
      { name: 'Youngster Timmy',  sprite: S.youngster, team: pk([19, 19, 16], 18), reward: 250 },
      { name: 'Ace Trainer Cole', sprite: S.aceM,      team: pk([52, 19], 20),     reward: 380 },
      { name: 'Lass Megan',       sprite: S.lass,      team: pk([39, 96], 19),     reward: 280 },
    ],
    background: '/battle_bg_route5_6_1776993605611.png',
    description: 'Caminho para Vermilion.',
  },

  ss_anne: {
    id: 'ss_anne', name: 'S.S. Anne', type: 'farm', group: 'Vermilion City',
    unlockLevel: 20, requirements: ['cascade_badge'],
    biome: 'water',
    enemies: pk([16, 19, 52, 96], 20),
    trainerChance: 0.05,
    trainers: [
      { name: 'Gentleman Thomas', sprite: S.gentleman, team: pk([52, 52], 22),       reward: 600 },
      { name: 'Beauty Connie',    sprite: S.beauty,    team: pk([19, 16, 52], 21),   reward: 500 },
      { name: 'Sailor Edmond',    sprite: S.sailor,    team: pk([52, 19], 22),       reward: 440 },
      { name: 'Gentleman Brooks', sprite: S.gentleman, team: pk([96, 96], 22),       reward: 600 },
    ],
    background: '/battle_bg_ship_1776863844924.png',
    description: 'Luxuoso navio de cruzeiro. Azul está a bordo!',
  },

  vermilion_city: {
    id: 'vermilion_city', name: 'Cidade de Vermilion', type: 'city', group: 'Vermilion City',
    hasGym: true, gymLeader: GYM_LEADERS.ltsurge,
    unlockLevel: 22, requirements: ['cascade_badge', 'rival_3_defeated'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_ship_1776863844924.png',
    description: 'Cidade portuaria. Derrote Lt. Surge!',
  },

  route_9_10: {
    id: 'route_9_10', name: 'Rotas 9 e 10', type: 'farm', group: 'Lavender Town',
    unlockLevel: 26, requirements: ['thunder_badge'],
    biome: 'grass',
    enemies: pk([21, 23, 56, 81, 100], 22),
    trainerChance: 0.05,
    trainers: [
      { name: 'Youngster Gomez', sprite: S.youngster, team: pk([21, 56], 22),   reward: 380 },
      { name: 'Picnicker Carol', sprite: S.picnicker, team: pk([39, 52], 22),   reward: 380 },
      { name: 'Hiker Liam',      sprite: S.hiker,     team: pk([74, 95], 23),   reward: 420 },
      { name: 'Juggler Nedrick', sprite: S.juggler,   team: pk([100, 81], 24),  reward: 480 },
    ],
    background: '/battle_bg_route9_10_1776993620394.png',
    description: 'Estradas rochosas a caminho de Lavender.',
  },

  rock_tunnel: {
    id: 'rock_tunnel', name: 'Rock Tunnel', type: 'farm', group: 'Lavender Town',
    unlockLevel: 28, requirements: ['thunder_badge'],
    unlocks: 'rock_tunnel_cleared',
    biome: 'mountain',
    enemies: pk([74, 41, 95, 66], 24),
    trainerChance: 0.05,
    trainers: [
      { name: 'Hiker Allen',       sprite: S.hiker,     team: pk([74, 95], 25),      reward: 500 },
      { name: 'Hiker Ricky',       sprite: S.hiker,     team: pk([66, 74], 25),      reward: 500 },
      { name: 'Picnicker Martha',  sprite: S.picnicker, team: pk([41, 41, 41], 24),  reward: 480 },
      { name: 'Ace Trainer Ryder', sprite: S.aceM,      team: pk([95, 66], 26),      reward: 620 },
    ],
    background: '/battle_bg_rock_tunnel_1776993634918.png',
    description: 'Tunel escuro. A Rocket está aqui!',
  },

  pokemon_tower: {
    id: 'pokemon_tower', name: 'Torre Pokemon', type: 'farm', group: 'Lavender Town',
    unlockLevel: 30, requirements: ['rival_pokemon_tower_defeated'],
    unlocks: 'pokemon_tower_cleared',
    biome: 'mountain',
    enemies: pk([92, 93, 104], 28),
    trainerChance: 0.05,
    trainers: [
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([41, 92], 28),   reward: 560, isRocket: true },
      { name: 'Team Rocket Grunt F', sprite: S.rocketF, team: pk([92, 93], 28),   reward: 560, isRocket: true },
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([104, 41], 29),  reward: 580, isRocket: true },
    ],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'Torre assombrada tomada pela Rocket.',
  },

  route_7_8: {
    id: 'route_7_8', name: 'Rotas 7 e 8', type: 'farm', group: 'Celadon City',
    unlockLevel: 32, requirements: ['thunder_badge', 'rival_pokemon_tower_defeated'],
    biome: 'grass',
    enemies: pk([58, 37, 43, 69, 96, 102, 52], 28),
    trainerChance: 0.05,
    trainers: [
      { name: 'Gambler Dru',        sprite: S.gambler, team: pk([52, 96], 28),   reward: 700 },
      { name: 'Lass Julia',         sprite: S.lass,    team: pk([43, 37], 28),   reward: 560 },
      { name: 'Juggler Brendan',    sprite: S.juggler, team: pk([100, 81], 29),  reward: 640 },
      { name: 'Ace Trainer Harvey', sprite: S.aceM,    team: pk([58, 96], 30),   reward: 800 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Rota de conexão para Celadon.',
  },

  rocket_hideout: {
    id: 'rocket_hideout', name: 'QG da Equipe Rocket', type: 'farm', group: 'Celadon City',
    unlockLevel: 33, requirements: ['thunder_badge', 'rival_pokemon_tower_defeated'],
    biome: 'mountain',
    enemies: pk([41, 23, 52, 88], 30),
    trainerChance: 0.05,
    trainers: [
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([41, 23], 30),     reward: 700, isRocket: true },
      { name: 'Team Rocket Grunt F', sprite: S.rocketF, team: pk([52, 88], 30),     reward: 700, isRocket: true },
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([23, 41, 41], 31), reward: 720, isRocket: true },
      { name: 'Team Rocket Grunt F', sprite: S.rocketF, team: pk([88, 52], 31),     reward: 720, isRocket: true },
    ],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'QG secreto da Rocket em Celadon. Giovanni te aguarda!',
  },

  celadon_city: {
    id: 'celadon_city', name: 'Celadon City', type: 'city', group: 'Celadon City',
    hasGym: true, gymLeader: GYM_LEADERS.erika,
    unlockLevel: 35, requirements: ['thunder_badge', 'rocket_hideout_cleared'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Cidade verde. Derrote Erika para avançar!',
  },

  route_12_15: {
    id: 'route_12_15', name: 'Rotas 12 a 15', type: 'farm', group: 'Fuchsia City',
    unlockLevel: 36, requirements: ['rainbow_badge'],
    biome: 'grass',
    enemies: pk([84, 48, 22, 108, 114, 128, 111], 33),
    trainerChance: 0.05,
    trainers: [
      { name: 'Bird Keeper Edwin',  sprite: S.aceM,      team: pk([84, 22], 34),     reward: 820 },
      { name: 'Picnicker Isabelle', sprite: S.picnicker, team: pk([48, 39], 33),     reward: 680 },
      { name: 'Ace Trainer Brian',  sprite: S.aceM,      team: pk([128, 111], 35),   reward: 960 },
      { name: 'Picnicker Valerie',  sprite: S.picnicker, team: pk([84, 22, 39], 34), reward: 760 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Rotas da costa sul.',
  },

  safari_zone: {
    id: 'safari_zone', name: 'Zona Safari', type: 'farm', group: 'Fuchsia City',
    unlockLevel: 38, requirements: ['rainbow_badge'],
    biome: 'grass',
    enemies: pk([102, 108, 113, 114, 115, 123, 127, 128], 35),
    trainerChance: 0, trainers: [],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Reserva com Pokemon raros.',
  },

  fuchsia_city: {
    id: 'fuchsia_city', name: 'Fuchsia City', type: 'city', group: 'Fuchsia City',
    hasGym: true, gymLeader: GYM_LEADERS.koga,
    unlockLevel: 38, requirements: ['rainbow_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Cidade venenosa. Derrote Koga!',
  },

  silph_co: {
    id: 'silph_co', name: 'Silph Co.', type: 'farm', group: 'Saffron City',
    unlockLevel: 40, requirements: ['soul_badge', 'rocket_hideout_cleared'],
    biome: 'mountain',
    enemies: pk([100, 81, 137, 63, 96], 35),
    trainerChance: 0.05,
    trainers: [
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([41, 23, 88], 35),  reward: 900,  isRocket: true },
      { name: 'Team Rocket Grunt F', sprite: S.rocketF, team: pk([100, 81], 35),     reward: 900,  isRocket: true },
      { name: 'Scientist Delman',    sprite: S.aceM,    team: pk([137, 100], 36),    reward: 1000 },
      { name: 'Scientist Jerry',     sprite: S.aceM,    team: pk([81, 63], 36),      reward: 1000 },
    ],
    background: '/battle_bg_lab_1776866008842.png',
    description: 'Torre dominada pela Rocket. Rival e Giovanni te esperam!',
  },

  saffron_city: {
    id: 'saffron_city', name: 'Saffron City', type: 'city', group: 'Saffron City',
    hasGym: true, gymLeader: GYM_LEADERS.sabrina,
    unlockLevel: 42, requirements: ['soul_badge', 'rival_silph_defeated'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Centro psíquico de Kanto. Derrote Sabrina!',
  },

  route_16_18: {
    id: 'route_16_18', name: 'Cycling Road', type: 'farm', group: 'Fuchsia City',
    unlockLevel: 40, requirements: ['soul_badge'],
    biome: 'grass',
    enemies: pk([84, 22, 128], 35),
    trainerChance: 0.05,
    trainers: [
      { name: 'Biker Ruben',       sprite: S.cooltrainer, team: pk([22, 84], 36),     reward: 900  },
      { name: 'Biker Virgil',      sprite: S.cooltrainer, team: pk([84, 22, 22], 35), reward: 860  },
      { name: 'Cooltrainer Mitch', sprite: S.cooltrainer, team: pk([128, 22], 37),    reward: 1000 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Cycling Road!',
  },

  pokemon_mansion: {
    id: 'pokemon_mansion', name: 'Mansão Pokémon', type: 'farm', group: 'Cinnabar Island',
    unlockLevel: 44, requirements: ['marsh_badge'],
    unlocks: 'mansion_cleared',
    biome: 'mountain',
    enemies: pk([88, 109, 126, 132, 89], 38),
    trainerChance: 0.05,
    trainers: [
      { name: 'Scientist Rodney', sprite: S.aceM,    team: pk([88, 109], 38),      reward: 1100 },
      { name: 'Scientist Grant',  sprite: S.aceM,    team: pk([132, 126], 39),     reward: 1200 },
      { name: 'Burglar Simon',    sprite: S.gambler, team: pk([109, 88, 89], 40),  reward: 1400 },
    ],
    background: '/battle_bg_lab_1776866008842.png',
    description: 'Mansao abandonada com segredos da Rocket.',
  },

  cinnabar_island: {
    id: 'cinnabar_island', name: 'Cinnabar Island', type: 'city', group: 'Cinnabar Island',
    hasGym: true, gymLeader: GYM_LEADERS.blaine,
    unlockLevel: 46, requirements: ['marsh_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Ilha vulcanica. Derrote Blaine!',
  },

  route_22_23: {
    id: 'route_22_23', name: 'Rota 23', type: 'farm', group: 'Victory Road',
    unlockLevel: 50, requirements: ['volcano_badge'],
    biome: 'grass',
    enemies: pk([22, 23, 67, 105, 148], 45),
    trainerChance: 0.05,
    trainers: [
      { name: 'Cooltrainer Kate',   sprite: S.cooltrainer, team: pk([22, 105], 46),  reward: 2000 },
      { name: 'Cooltrainer Male',   sprite: S.cooltrainer, team: pk([67, 23], 47),   reward: 2000 },
      { name: 'Ace Trainer Parker', sprite: S.aceM,        team: pk([148, 22], 48),  reward: 2500 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'O caminho para o último ginásio.',
  },

  viridian_gym: {
    id: 'viridian_gym', name: 'Ginásio de Viridian', type: 'city', group: 'Victory Road',
    hasGym: true, gymLeader: GYM_LEADERS.giovanni,
    unlockLevel: 50, requirements: ['volcano_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Ginásio misterioso e seu segredo sombrio.',
  },

  victory_road: {
    id: 'victory_road', name: 'Victory Road', type: 'farm', group: 'Victory Road',
    unlockLevel: 55, requirements: ['earth_badge'],
    biome: 'mountain',
    enemies: pk([95, 67, 105, 112, 148, 146], 52),
    trainerChance: 0.05,
    trainers: [
      { name: 'Cooltrainer Naomi',  sprite: S.cooltrainer, team: pk([105, 67], 52),  reward: 2400 },
      { name: 'Ace Trainer Samuel', sprite: S.aceM,        team: pk([112, 95], 53),  reward: 2600 },
      { name: 'Cooltrainer George', sprite: S.cooltrainer, team: pk([148, 105], 54), reward: 2800 },
    ],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'Caverna do desafio final. Seu rival te aguarda!',
  },

  indigo_plateau: {
    id: 'indigo_plateau', name: 'Plateau Indigo', type: 'city', group: 'Elite Four',
    unlockLevel: 58, requirements: ['earth_badge'],
    hasGym: false,
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Plateau Indigo  sede da Liga Pokemon de Kanto.',
  },

  cerulean_cave: {
    id: 'cerulean_cave', name: 'Caverna Cerulean', type: 'farm', group: 'Pos-Game',
    unlockLevel: 60, requirements: ['champion'],
    biome: 'mountain',
    enemies: pk([42, 47, 67, 75, 95, 106, 107, 108, 113, 131, 132, 136, 138, 140, 142, 143, 150], 60),
    trainerChance: 0, trainers: [],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'Caverna proibida   lar de uma lenda..',
  },

  // ── GRUPO: NEW BARK TOWN ─────────────────────────────────────────
  new_bark_town: {
    id: 'new_bark_town', name: 'New Bark Town', type: 'city', group: 'New Bark Town',
    unlockLevel: 60, requirements: ['johto_started'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_johto_city_1777340517574.png',
    description: 'O novo ponto de partida depois da conquista da Liga de Kanto.',
  },

  johto_route_29: {
    id: 'johto_route_29', name: 'Rota 29', type: 'farm', group: 'New Bark Town',
    unlockLevel: 60, requirements: ['johto_started'], unlocks: 'johto_route_29_cleared',
    biome: 'grass',
    enemies: pk([161, 162, 163, 164, 165, 167, 179, 187, 172], 3),
    trainerChance: 0.06,
    trainers: [
      { name: 'Youngster Mikey', sprite: S.youngster, team: pk([161, 165], 3), reward: 120 },
      { name: 'Lass Carrie', sprite: S.lass, team: pk([179, 187], 4), reward: 140 },
    ],
    background: '/bg_route29_johto.png',
    description: 'Primeira rota de Johto, aberta apenas para campeoes de Kanto.',
  },

  // ── GRUPO: CHERRYGROVE CITY ──────────────────────────────────────
  cherrygrove_city: {
    id: 'cherrygrove_city', name: 'Cherrygrove City', type: 'city', group: 'Cherrygrove City',
    unlockLevel: 61, requirements: ['johto_route_29_cleared'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_cherrygrove.png',
    description: 'Cidade costeira de Johto e descanso depois da Rota 29.',
  },

  johto_route_30: {
    id: 'johto_route_30', name: 'Rota 30', type: 'farm', group: 'Cherrygrove City',
    unlockLevel: 62, requirements: ['johto_rival_1_defeated'],
    biome: 'forest',
    enemies: pk([10, 11, 13, 14, 16, 163, 165, 167, 187, 175], 4),
    trainerChance: 0.07,
    trainers: [
      { name: 'Bug Catcher Don', sprite: S.bugcatcher, team: pk([10, 13, 165], 4), reward: 160 },
      { name: 'Youngster Joey Jr.', sprite: S.youngster, team: pk([19, 162], 5), reward: 180 },
    ],
    background: '/bg_route30_johto.png',
    description: 'Rotas iniciais de Johto com encontros classicos de floresta.',
  },

  // ── GRUPO: VIOLET CITY ───────────────────────────────────────────
  violet_city: {
    id: 'violet_city', name: 'Violet City', type: 'city', group: 'Violet City',
    unlockLevel: 63, requirements: ['johto_rival_1_defeated'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_violet_city.png',
    description: 'Cidade do primeiro ginasio de Johto.',
  },

  sprout_tower: {
    id: 'sprout_tower', name: 'Sprout Tower', type: 'farm', group: 'Violet City',
    unlockLevel: 63, requirements: ['johto_rival_1_defeated'],
    biome: 'forest',
    enemies: [
      { id: 69, level: 5, drop: 'leaf_stone_shard', dropChance: 0.08 },
      { id: 92, level: 6, drop: 'link_cable_part', dropChance: 0.08 },
      { id: 163, level: 5, drop: 'feather', dropChance: 0.12 },
      { id: 179, level: 6, drop: 'electric_essence', dropChance: 0.18 },
      { id: 187, level: 5, drop: 'apricorn', dropChance: 0.12 },
      { id: 177, level: 5, drop: 'psychic_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.07,
    trainers: [
      { name: 'Sage Nico', sprite: S.juggler, team: pk([69, 163], 6), reward: 200 },
      { name: 'Sage Chow', sprite: S.juggler, team: pk([92, 179], 7), reward: 220 },
    ],
    background: '/bg_sprout_tower.png',
    description: 'Torre antiga onde treinadores de Johto testam disciplina.',
  },

  johto_route_32: {
    id: 'johto_route_32', name: 'Rota 32', type: 'farm', group: 'Violet City',
    unlockLevel: 64, requirements: ['zephyr_badge'],
    biome: 'grass',
    enemies: [
      { id: 19, level: 6, drop: 'normal_essence', dropChance: 0.18 },
      { id: 23, level: 7, drop: 'poison_essence', dropChance: 0.18 },
      { id: 41, level: 7, drop: 'link_cable_part', dropChance: 0.06 },
      { id: 179, level: 7, drop: 'thunder_stone_shard', dropChance: 0.08 },
      { id: 194, level: 7, drop: 'water_stone_shard', dropChance: 0.08 },
      { id: 173, level: 7, drop: 'normal_essence', dropChance: 0.18 },
      { id: 174, level: 7, drop: 'normal_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.07,
    trainers: [
      { name: 'Picnicker Liz', sprite: S.picnicker, team: pk([179, 19], 7), reward: 240 },
      { name: 'Fisher Ralph', sprite: S.cooltrainer, team: pk([194, 60], 8), reward: 260 },
    ],
    background: '/battle_bg_johto_meadow_1777340536606.png',
    description: 'Estrada ao sul de Violet. Falkner libera este caminho.',
  },

  // ── GRUPO: AZALEA TOWN ───────────────────────────────────────────
  union_cave: {
    id: 'union_cave', name: 'Union Cave', type: 'farm', group: 'Azalea Town',
    unlockLevel: 65, requirements: ['zephyr_badge'],
    biome: 'cave',
    enemies: [
      { id: 41, level: 8, drop: 'link_cable_part', dropChance: 0.08 },
      { id: 74, level: 8, drop: 'link_cable_part', dropChance: 0.08 },
      { id: 95, level: 9, drop: 'iron_ore', dropChance: 0.12 },
      { id: 194, level: 8, drop: 'water_stone_shard', dropChance: 0.08 },
      { id: 220, level: 9, drop: 'ice_essence', dropChance: 0.18 },
      { id: 201, level: 8, drop: 'normal_essence', dropChance: 0.18 },
      { id: 206, level: 8, drop: 'normal_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.06,
    trainers: [
      { name: 'Hiker Daniel', sprite: S.hiker, team: pk([74, 95], 9), reward: 300 },
      { name: 'Firebreather Bill', sprite: S.gambler, team: pk([109, 41], 10), reward: 320 },
    ],
    background: '/battle_bg_johto_cave_1777340560945.png',
    description: 'Caverna que leva a Azalea e a novos problemas com a Rocket.',
  },

  azalea_town: {
    id: 'azalea_town', name: 'Azalea Town', type: 'city', group: 'Azalea Town',
    unlockLevel: 66, requirements: ['johto_slowpoke_well_cleared'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_johto_city_1777340517574.png',
    description: 'Cidade dos Slowpoke e do segundo desafio de Johto.',
  },

  slowpoke_well: {
    id: 'slowpoke_well', name: 'Poco Slowpoke', type: 'farm', group: 'Azalea Town',
    unlockLevel: 64, requirements: ['johto_slowpoke_well_cleared'],
    biome: 'cave',
    enemies: pk([41, 42, 79, 199, 194, 195], 10),
    trainerChance: 0.05,
    trainers: [
      { name: 'Rocket Lookout', sprite: S.rocket, team: pk([41, 109], 10), reward: 420 },
      { name: 'Hiker Kurt', sprite: S.hiker, team: pk([74, 79], 11), reward: 440 },
    ],
    background: '/battle_bg_johto_cave_1777340560945.png',
    description: 'Caverna de Azalea ligada ao novo conflito Rocket em Johto.',
  },

  ilex_forest: {
    id: 'ilex_forest', name: 'Ilex Forest', type: 'farm', group: 'Azalea Town',
    unlockLevel: 67, requirements: ['hive_badge'],
    biome: 'forest',
    enemies: [
      { id: 10, level: 12, drop: 'bug_essence', dropChance: 0.18 },
      { id: 13, level: 12, drop: 'poison_essence', dropChance: 0.18 },
      { id: 43, level: 13, drop: 'leaf_stone_shard', dropChance: 0.08 },
      { id: 46, level: 13, drop: 'mushroom', dropChance: 0.10 },
      { id: 163, level: 13, drop: 'feather', dropChance: 0.12 },
      { id: 204, level: 12, drop: 'bug_essence', dropChance: 0.18 },
      { id: 214, level: 12, drop: 'bug_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.06,
    trainers: [
      { name: 'Bug Catcher Doug', sprite: S.bugcatcher, team: pk([10, 13, 46], 13), reward: 360 },
      { name: 'Lass Dana', sprite: S.lass, team: pk([43, 163], 14), reward: 380 },
    ],
    background: '/battle_bg_johto_forest_1777340549427.png',
    description: 'Floresta densa entre Azalea e Goldenrod.',
  },

  // ── GRUPO: GOLDENROD CITY ────────────────────────────────────────
  goldenrod_city: {
    id: 'goldenrod_city', name: 'Goldenrod City', type: 'city', group: 'Goldenrod City',
    unlockLevel: 68, requirements: ['hive_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_johto_city_1777340517574.png',
    description: 'Grande metropole de Johto e palco da terceira insignia.',
  },

  national_park: {
    id: 'national_park', name: 'National Park', type: 'farm', group: 'Goldenrod City',
    unlockLevel: 69, requirements: ['plain_badge'],
    biome: 'grass',
    enemies: [
      { id: 46, level: 14, drop: 'mushroom', dropChance: 0.12 },
      { id: 48, level: 14, drop: 'bug_essence', dropChance: 0.18 },
      { id: 123, level: 15, drop: 'recipe_quick_claw', dropChance: 0.06 },
      { id: 191, level: 14, drop: 'leaf_stone_shard', dropChance: 0.08 },
      { id: 203, level: 15, drop: 'psychic_essence', dropChance: 0.18 },
      { id: 193, level: 14, drop: 'bug_essence', dropChance: 0.18 },
      { id: 235, level: 14, drop: 'bug_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.07,
    trainers: [
      { name: 'School Kid Jack', sprite: S.youngster, team: pk([48, 203], 15), reward: 400 },
      { name: 'Bug Catcher Arnie', sprite: S.bugcatcher, team: pk([46, 123], 16), reward: 420 },
    ],
    background: '/battle_bg_johto_meadow_1777340536606.png',
    description: 'Parque amplo com insetos raros e Pokemon de Johto.',
  },

  // ── GRUPO: ECRUTEAK CITY ─────────────────────────────────────────
  ecruteak_city: {
    id: 'ecruteak_city', name: 'Ecruteak City', type: 'city', group: 'Ecruteak City',
    unlockLevel: 70, requirements: ['plain_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_johto_city_1777340517574.png',
    description: 'Cidade historica das torres de Johto.',
  },

  burned_tower: {
    id: 'burned_tower', name: 'Burned Tower', type: 'farm', group: 'Ecruteak City',
    unlockLevel: 70, requirements: ['plain_badge'],
    biome: 'cave',
    enemies: [
      { id: 19, level: 16, drop: 'normal_essence', dropChance: 0.18 },
      { id: 20, level: 17, drop: 'normal_essence', dropChance: 0.18 },
      { id: 41, level: 16, drop: 'link_cable_part', dropChance: 0.08 },
      { id: 92, level: 17, drop: 'recipe_cleanse_tag', dropChance: 0.06 },
      { id: 109, level: 17, drop: 'poison_essence', dropChance: 0.18 },
      { id: 198, level: 17, drop: 'fire_essence', dropChance: 0.18 },
      { id: 200, level: 17, drop: 'fire_essence', dropChance: 0.18 },
      { id: 228, level: 17, drop: 'fire_essence', dropChance: 0.18 },
      { id: 240, level: 17, drop: 'fire_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.06,
    trainers: [
      { name: 'Mystic Eusine', sprite: S.gentleman, team: pk([96, 101], 18), reward: 520 },
      { name: 'Sage Jeffrey', sprite: S.juggler, team: pk([92, 41], 17), reward: 440 },
    ],
    background: '/battle_bg_johto_cave_1777340560945.png',
    description: 'Ruinas lendarias onde fantasmas e historias se cruzam.',
  },

  // ── GRUPO: OLIVINE CITY ──────────────────────────────────────────
  route_38_39: {
    id: 'route_38_39', name: 'Rotas 38 e 39', type: 'farm', group: 'Olivine City',
    unlockLevel: 72, requirements: ['fog_badge'],
    biome: 'grass',
    enemies: [
      { id: 52, level: 18, drop: 'recipe_amulet_coin', dropChance: 0.06 },
      { id: 77, level: 18, drop: 'fire_stone_shard', dropChance: 0.08 },
      { id: 81, level: 19, drop: 'recipe_magnet', dropChance: 0.06 },
      { id: 128, level: 19, drop: 'normal_essence', dropChance: 0.18 },
      { id: 241, level: 20, drop: 'moomoo_milk', dropChance: 0.10 },
      { id: 185, level: 19, drop: 'normal_essence', dropChance: 0.18 },
      { id: 190, level: 19, drop: 'normal_essence', dropChance: 0.18 },
      { id: 209, level: 19, drop: 'normal_essence', dropChance: 0.18 },
      { id: 227, level: 19, drop: 'normal_essence', dropChance: 0.18 },
      { id: 231, level: 19, drop: 'normal_essence', dropChance: 0.18 },
      { id: 234, level: 19, drop: 'normal_essence', dropChance: 0.18 },
      { id: 239, level: 19, drop: 'normal_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.07,
    trainers: [
      { name: 'Sailor Harry', sprite: S.sailor, team: pk([77, 81], 19), reward: 540 },
      { name: 'Lass Dana', sprite: S.lass, team: pk([52, 241], 20), reward: 560 },
    ],
    background: '/battle_bg_johto_meadow_1777340536606.png',
    description: 'Campos a caminho de Olivine, com Miltank e eletricos raros.',
  },

  olivine_city: {
    id: 'olivine_city', name: 'Olivine City', type: 'city', group: 'Olivine City',
    unlockLevel: 73, requirements: ['fog_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_johto_water_1777340582200.png',
    description: 'Porto de Johto e cidade da lider Jasmine.',
  },

  // ── GRUPO: CIANWOOD CITY ─────────────────────────────────────────
  route_40_41: {
    id: 'route_40_41', name: 'Rotas 40 e 41', type: 'farm', group: 'Cianwood City',
    unlockLevel: 74, requirements: ['fog_badge'],
    biome: 'water',
    enemies: [
      { id: 72, level: 20, drop: 'water_essence', dropChance: 0.18 },
      { id: 73, level: 22, drop: 'water_essence', dropChance: 0.18 },
      { id: 90, level: 21, drop: 'water_stone_shard', dropChance: 0.08 },
      { id: 98, level: 21, drop: 'water_essence', dropChance: 0.18 },
      { id: 170, level: 22, drop: 'thunder_stone_shard', dropChance: 0.08 },
      { id: 223, level: 22, drop: 'water_essence', dropChance: 0.18 },
      { id: 211, level: 21, drop: 'water_essence', dropChance: 0.18 },
      { id: 213, level: 21, drop: 'water_essence', dropChance: 0.18 },
      { id: 222, level: 21, drop: 'water_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.07,
    trainers: [
      { name: 'Swimmer Simon', sprite: S.cooltrainer, team: pk([72, 170], 22), reward: 600 },
      { name: 'Fisher Tully', sprite: S.cooltrainer, team: pk([98, 223], 23), reward: 620 },
    ],
    background: '/battle_bg_johto_water_1777340582200.png',
    description: 'Mar aberto de Johto rumo a Cianwood.',
  },

  cianwood_city: {
    id: 'cianwood_city', name: 'Cianwood City', type: 'city', group: 'Cianwood City',
    unlockLevel: 75, requirements: ['storm_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_johto_water_1777340582200.png',
    description: 'Ilha do desafio de Chuck e passagem para voltar a Olivine.',
  },

  // ── GRUPO: MAHOGANY TOWN ─────────────────────────────────────────
  route_42_mortar: {
    id: 'route_42_mortar', name: 'Rota 42 / Mt. Mortar', type: 'farm', group: 'Mahogany Town',
    unlockLevel: 76, requirements: ['mineral_badge'],
    biome: 'mountain',
    enemies: [
      { id: 41, level: 23, drop: 'link_cable_part', dropChance: 0.08 },
      { id: 66, level: 24, drop: 'recipe_black_belt', dropChance: 0.06 },
      { id: 74, level: 23, drop: 'link_cable_part', dropChance: 0.08 },
      { id: 95, level: 24, drop: 'iron_ore', dropChance: 0.12 },
      { id: 183, level: 23, drop: 'water_stone_shard', dropChance: 0.08 },
      { id: 216, level: 24, drop: 'normal_essence', dropChance: 0.18 },
      { id: 202, level: 23, drop: 'ground_essence', dropChance: 0.18 },
      { id: 207, level: 23, drop: 'ground_essence', dropChance: 0.18 },
      { id: 218, level: 23, drop: 'ground_essence', dropChance: 0.18 },
      { id: 236, level: 23, drop: 'ground_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.07,
    trainers: [
      { name: 'Hiker Benjamin', sprite: S.hiker, team: pk([95, 66], 24), reward: 700 },
      { name: 'Black Belt Kenji', sprite: S.cooltrainer, team: pk([66, 216], 25), reward: 720 },
    ],
    background: '/battle_bg_johto_cave_1777340560945.png',
    description: 'Montanhas de Johto entre Ecruteak e Mahogany.',
  },

  lake_of_rage: {
    id: 'lake_of_rage', name: 'Lake of Rage', type: 'farm', group: 'Mahogany Town',
    unlockLevel: 77, requirements: ['johto_rocket_radio_cleared'],
    biome: 'water',
    enemies: [
      { id: 129, level: 24, drop: 'water_essence', dropChance: 0.18 },
      { id: 130, level: 26, drop: 'water_stone_shard', dropChance: 0.10 },
      { id: 161, level: 24, drop: 'normal_essence', dropChance: 0.18 },
      { id: 162, level: 25, drop: 'normal_essence', dropChance: 0.18 },
      { id: 170, level: 25, drop: 'thunder_stone_shard', dropChance: 0.08 },
    ],
    trainerChance: 0.06,
    trainers: [
      { name: 'Fisher Marvin', sprite: S.cooltrainer, team: pk([129, 130], 26), reward: 800 },
      { name: 'Rocket Scout', sprite: S.rocket, team: pk([41, 109], 25), reward: 750, isRocket: true },
    ],
    background: '/battle_bg_johto_water_1777340582200.png',
    description: 'Lago agitado pelo sinal da Equipe Rocket.',
  },

  // ── GRUPO: BLACKTHORN CITY ───────────────────────────────────────
  ice_path: {
    id: 'ice_path', name: 'Ice Path', type: 'farm', group: 'Blackthorn City',
    unlockLevel: 79, requirements: ['glacier_badge'],
    biome: 'cave',
    enemies: [
      { id: 41, level: 26, drop: 'link_cable_part', dropChance: 0.08 },
      { id: 124, level: 27, drop: 'ice_essence', dropChance: 0.18 },
      { id: 220, level: 27, drop: 'ice_essence', dropChance: 0.18 },
      { id: 221, level: 28, drop: 'ice_essence', dropChance: 0.20 },
      { id: 225, level: 28, drop: 'ice_essence', dropChance: 0.18 },
      { id: 215, level: 27, drop: 'ice_essence', dropChance: 0.18 },
      { id: 238, level: 27, drop: 'ice_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.05,
    trainers: [
      { name: 'Skier Roxanne', sprite: S.aceF, team: pk([124, 220], 28), reward: 850 },
      { name: 'Cooltrainer Allen', sprite: S.cooltrainer, team: pk([221, 225], 29), reward: 900 },
    ],
    background: '/battle_bg_johto_ice_1777340596339.png',
    description: 'Caverna congelada que protege o caminho para Blackthorn.',
  },

  blackthorn_city: {
    id: 'blackthorn_city', name: 'Blackthorn City', type: 'city', group: 'Blackthorn City',
    unlockLevel: 80, requirements: ['glacier_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_johto_city_1777340517574.png',
    description: 'Cidade dos domadores de Dragao e da ultima insignia de Johto.',
  },

  dragons_den: {
    id: 'dragons_den', name: 'Dragon Den', type: 'farm', group: 'Blackthorn City',
    unlockLevel: 81, requirements: ['rising_badge'],
    biome: 'cave',
    enemies: [
      { id: 41, level: 28, drop: 'link_cable_part', dropChance: 0.08 },
      { id: 54, level: 28, drop: 'water_essence', dropChance: 0.18 },
      { id: 129, level: 28, drop: 'water_essence', dropChance: 0.18 },
      { id: 147, level: 29, drop: 'dragon_essence', dropChance: 0.20 },
      { id: 148, level: 31, drop: 'dragon_essence', dropChance: 0.22 },
    ],
    trainerChance: 0.06,
    trainers: [
      { name: 'Dragon Tamer Paul', sprite: S.aceM, team: pk([147, 148], 31), reward: 1200 },
      { name: 'Ace Trainer Gina', sprite: S.aceF, team: pk([54, 148], 31), reward: 1100 },
    ],
    background: '/battle_bg_johto_cave_1777340560945.png',
    description: 'Santuario draconico depois da ultima insignia.',
  },

  // ── GRUPO: JOHTO LIGA ────────────────────────────────────────────
  johto_victory_road: {
    id: 'johto_victory_road', name: 'Victory Road Johto', type: 'farm', group: 'Johto Liga',
    unlockLevel: 84, requirements: ['johto_rival_victory_defeated'],
    biome: 'mountain',
    enemies: [
      { id: 42, level: 30, drop: 'link_cable_part', dropChance: 0.08 },
      { id: 67, level: 31, drop: 'recipe_black_belt', dropChance: 0.06 },
      { id: 75, level: 31, drop: 'link_cable_part', dropChance: 0.08 },
      { id: 95, level: 32, drop: 'iron_ore', dropChance: 0.12 },
      { id: 112, level: 32, drop: 'ground_essence', dropChance: 0.18 },
      { id: 217, level: 32, drop: 'normal_essence', dropChance: 0.18 },
      { id: 246, level: 31, drop: 'rock_essence', dropChance: 0.18 }
    ],
    trainerChance: 0.08,
    trainers: [
      { name: 'Ace Trainer Irene', sprite: S.aceF, team: pk([67, 217], 32), reward: 1500 },
      { name: 'Dragon Tamer Lee', sprite: S.aceM, team: pk([148, 112], 33), reward: 1600 },
    ],
    background: '/battle_bg_johto_cave_1777340560945.png',
    description: 'Ultimo teste antes da Liga de Johto.',
  },

  route_4: {
    id: 'route_4', name: 'Rota 4', type: 'farm', group: 'Cerulean City',
    unlockLevel: 15, requirements: ['boulder_badge'],
    biome: 'grass',
    enemies: pk([16, 21, 27, 39, 50, 74, 56], 12),
    trainerChance: 0.05,
    trainers: [
      { name: 'Youngster Chad',   sprite: S.youngster, team: pk([21, 16], 12),  reward: 220 },
      { name: 'Hiker Bob',        sprite: S.hiker,     team: pk([74, 56], 12),  reward: 260 },
      { name: 'Lass Crissy',      sprite: S.lass,      team: pk([39, 39], 12),  reward: 220 },
    ],
    background: '/battle_bg_route4.png',
    description: 'Rota ao leste de Mt. Moon, com acesso a Cerulean.',
  },

  // ── GRUPO: LAVENDER TOWN ─────────────────────────────────────────
  lavender_town: {
    id: 'lavender_town', name: 'Lavender Town', type: 'city', group: 'Lavender Town',
    unlockLevel: 28, requirements: ['thunder_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_lavender.png',
    description: 'Cidade sombria lar da Torre Pokémon.',
  },

  route_8: {
    id: 'route_8', name: 'Rota 8', type: 'farm', group: 'Lavender Town',
    unlockLevel: 28, requirements: ['thunder_badge'],
    biome: 'grass',
    enemies: pk([19, 41, 96, 63, 52], 26),
    trainerChance: 0.05,
    trainers: [
      { name: 'Gambler Rich',       sprite: S.gambler,   team: pk([52, 96], 22),   reward: 500 },
      { name: 'Lass Paige',         sprite: S.lass,      team: pk([19, 39], 21),   reward: 380 },
      { name: 'Juggler Kirk',       sprite: S.juggler,   team: pk([100, 81], 23),  reward: 520 },
      { name: 'Ace Trainer Brian',  sprite: S.aceM,      team: pk([63, 96], 23),   reward: 620 },
    ],
    background: '/battle_bg_route8.png',
    description: 'Rota entre Saffron e Lavender.',
  },

  route_11: {
    id: 'route_11', name: 'Rota 11', type: 'farm', group: 'Lavender Town',
    unlockLevel: 22, requirements: ['cascade_badge'],
    biome: 'grass',
    enemies: pk([21, 23, 19, 50, 60, 83, 84], 22),
    trainerChance: 0.05,
    trainers: [
      { name: 'Youngster Albert',  sprite: S.youngster, team: pk([21, 21], 22),   reward: 340 },
      { name: 'Ace Trainer Gaven', sprite: S.aceM,      team: pk([84, 60], 23),   reward: 520 },
      { name: 'Picnicker Edna',    sprite: S.picnicker, team: pk([60, 19], 22),   reward: 360 },
      { name: 'Hiker Yoshi',       sprite: S.hiker,     team: pk([23, 95], 23),   reward: 460 },
    ],
    background: '/battle_bg_route11.png',
    description: 'Rota leste de Vermilion, caminho para Lavender.',
  },

  // ── GRUPO: FUCHSIA CITY ──────────────────────────────────────────
  route_16_17_18: {
    id: 'route_16_17_18', name: 'Rotas 16, 17 e 18', type: 'farm', group: 'Fuchsia City',
    unlockLevel: 36, requirements: ['rainbow_badge'],
    biome: 'grass',
    enemies: pk([84, 22, 128, 39, 101], 33),
    trainerChance: 0.05,
    trainers: [
      { name: 'Biker Jaren',        sprite: S.cooltrainer, team: pk([22, 84], 33),    reward: 800 },
      { name: 'Biker Virgil',       sprite: S.cooltrainer, team: pk([84, 22, 22], 32),reward: 760 },
      { name: 'Cooltrainer Mitch',  sprite: S.cooltrainer, team: pk([128, 101], 34),  reward: 920 },
      { name: 'Ace Trainer Parker', sprite: S.aceF,        team: pk([22, 128], 35),   reward: 1000 },
    ],
    background: '/battle_bg_route16_17_18.png',
    description: 'Cycling Road e rotas sul de Celadon até Fuchsia.',
  },

  route_19_20: {
    id: 'route_19_20', name: 'Rotas 19 e 20', type: 'farm', group: 'Fuchsia City',
    unlockLevel: 38, requirements: ['soul_badge'],
    biome: 'water',
    enemies: pk([54, 60, 61, 72, 73, 86, 90, 98, 116, 118], 40),
    trainerChance: 0.05,
    trainers: [
      { name: 'Swimmer David',   sprite: S.cooltrainer, team: pk([72, 60], 40),  reward: 720 },
      { name: 'Swimmer Sharon',  sprite: S.aceF,        team: pk([86, 72], 41),  reward: 760 },
      { name: 'Beauty Sheila',   sprite: S.beauty,      team: pk([90, 73], 42),  reward: 840 },
      { name: 'Swimmer Kevin',   sprite: S.cooltrainer, team: pk([61, 86], 41),  reward: 740 },
    ],
    background: '/battle_bg_route19_20.png',
    description: 'Rotas aquáticas entre Fuchsia e Cinnabar.',
  },

  seafoam_islands: {
    id: 'seafoam_islands', name: 'Ilhas Seafoam', type: 'farm', group: 'Fuchsia City',
    unlockLevel: 40, requirements: ['soul_badge'],
    biome: 'water',
    enemies: pk([79, 86, 87, 90, 91, 98, 124, 131, 144], 38),
    trainerChance: 0,
    trainers: [],
    background: '/battle_bg_seafoam.png',
    description: 'Cavernas geladas. Lenda diz que Articuno vive aqui.',
  },

  // ── GRUPO: CINNABAR ISLAND ───────────────────────────────────────
  route_21: {
    id: 'route_21', name: 'Rota 21', type: 'farm', group: 'Cinnabar Island',
    unlockLevel: 44, requirements: ['marsh_badge'],
    biome: 'water',
    enemies: pk([72, 73, 90, 91, 98, 116, 118, 129, 132], 42),
    trainerChance: 0.05,
    trainers: [
      { name: 'Swimmer Nash',   sprite: S.cooltrainer, team: pk([90, 72], 42),   reward: 940 },
      { name: 'Swimmer Elaine', sprite: S.aceF,        team: pk([73, 132], 42),  reward: 940 },
      { name: 'Fisher Gilbert', sprite: S.cooltrainer, team: pk([129, 90], 43),  reward: 1000 },
    ],
    background: '/battle_bg_route21.png',
    description: 'Rota aquática entre Pallet e Cinnabar.',
  },

  power_plant: {
    id: 'power_plant', name: 'Usina Elétrica', type: 'farm', group: 'Cerulean City',
    unlockLevel: 25, requirements: ['thunder_badge'],
    biome: 'mountain',
    enemies: pk([81, 82, 100, 101, 125, 135, 145], 35),
    trainerChance: 0,
    trainers: [],
    background: '/battle_bg_power_plant.png',
    description: 'Usina abandonada. Zapdos dizem que habita aqui.',
  },

  // ── GRUPO: VICTORY ROAD ─────────────────────────────────────────
  route_23: {
    id: 'route_23', name: 'Rota 23', type: 'farm', group: 'Victory Road',
    unlockLevel: 50, requirements: ['earth_badge'],
    biome: 'grass',
    enemies: pk([22, 23, 67, 105, 148, 147], 44),
    trainerChance: 0.05,
    trainers: [
      { name: 'Cooltrainer Kate',   sprite: S.cooltrainer, team: pk([22, 105], 45),  reward: 2000 },
      { name: 'Cooltrainer Warren', sprite: S.cooltrainer, team: pk([67, 23], 46),   reward: 2000 },
      { name: 'Ace Trainer Parker', sprite: S.aceM,        team: pk([148, 22], 47),  reward: 2500 },
      { name: 'Ace Trainer Cybil',  sprite: S.aceF,        team: pk([147, 67], 47),  reward: 2500 },
    ],
    background: '/battle_bg_route23.png',
    description: 'O caminho final para o Plateau Indigo.',
  },

  // ── HOENN REGION ────────────────────────────────────────────────
  littleroot_town: {
    id: 'littleroot_town', name: 'Littleroot Town', type: 'city', group: 'Hoenn Inicio',
    unlockLevel: 1, requirements: ['hoenn_started'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_littleroot.png',
    description: 'Sua jornada em Hoenn comeca aqui.',
  },

  route_101: {
    id: 'route_101', name: 'Rota 101', type: 'farm', group: 'Hoenn Inicio',
    unlockLevel: 1, requirements: ['hoenn_started'],
    biome: 'grass',
    enemies: pk([261, 263, 265, 16, 161], 3),
    trainerChance: 0,
    trainers: [],
    background: '/bg_route101.png',
    description: 'Rota inicial cheia de Pokemon pequenos.',
  },

  oldale_town: {
    id: 'oldale_town', name: 'Oldale Town', type: 'city', group: 'Hoenn Inicio',
    unlockLevel: 2, requirements: ['hoenn_started'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_oldale_town.png',
    description: 'Pequena cidade com um Pokemon Mart.',
  },

  route_102: {
    id: 'route_102', name: 'Rota 102', type: 'farm', group: 'Hoenn Inicio',
    unlockLevel: 3, requirements: ['hoenn_started'],
    biome: 'grass',
    enemies: pk([261, 265, 270, 273, 280], 4),
    trainerChance: 0.05,
    trainers: [
      { name: 'Youngster Calvin', sprite: S.youngster, team: pk([261, 263], 5), reward: 80 },
      { name: 'Lass Tiana',       sprite: S.lass,      team: pk([280], 5),      reward: 80 },
    ],
    background: '/bg_route102.png',
    description: 'Trilha que leva a Petalburg City.',
  },

  petalburg_city: {
    id: 'petalburg_city', name: 'Petalburg City', type: 'city', group: 'Hoenn Inicio',
    unlockLevel: 4, requirements: ['hoenn_started'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_petalburg_city.png',
    description: 'A cidade onde a natureza e as pessoas compartilham espaco.',
  },

  route_104: {
    id: 'route_104', name: 'Rota 104', type: 'farm', group: 'Hoenn Rustboro',
    unlockLevel: 5, requirements: ['hoenn_started'],
    biome: 'grass',
    enemies: pk([276, 278, 183, 263], 5),
    trainerChance: 0.05,
    trainers: [
      { name: 'Rich Boy Winston', sprite: S.aceM, team: pk([263], 7), reward: 200 },
      { name: 'Lady Cindy',       sprite: S.aceF, team: pk([278], 6), reward: 180 },
    ],
    background: '/bg_route104.png',
    description: 'Rota costeira antes da floresta de Petalburg.',
  },

  petalburg_woods: {
    id: 'petalburg_woods', name: 'Petalburg Woods', type: 'farm', group: 'Hoenn Rustboro',
    unlockLevel: 6, requirements: ['hoenn_started'],
    biome: 'grass',
    enemies: pk([265, 266, 267, 268, 285, 287], 6),
    trainerChance: 0.05,
    trainers: [
      { name: 'Bug Catcher Lyle', sprite: S.bugcatcher, team: pk([265, 266], 6), reward: 100 },
    ],
    background: '/bg_petalburg_woods.png',
    description: 'Floresta densa. Shroomish e Slakoth moram aqui.',
  },

  rustboro_city: {
    id: 'rustboro_city', name: 'Rustboro City', type: 'city', group: 'Hoenn Rustboro',
    unlockLevel: 8, requirements: ['hoenn_started'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_rustboro_city.png',
    description: 'Grande metropole industrial, lar da Devon Corp.',
  },

  route_116: {
    id: 'route_116', name: 'Rota 116', type: 'farm', group: 'Hoenn Rustboro',
    unlockLevel: 9, requirements: ['stone_badge'],
    biome: 'grass',
    enemies: pk([290, 293, 300, 263], 7),
    trainerChance: 0.05,
    trainers: [
      { name: 'Hiker Clark', sprite: S.hiker, team: pk([74, 293], 8), reward: 150 },
    ],
    background: '/bg_route116.png',
    description: 'Caminho rochoso levando ao Rusturf Tunnel.',
  },

  rusturf_tunnel: {
    id: 'rusturf_tunnel', name: 'Rusturf Tunnel', type: 'farm', group: 'Hoenn Rustboro',
    unlockLevel: 10, requirements: ['stone_badge'],
    biome: 'cave',
    enemies: pk([293, 294], 8),
    trainerChance: 0,
    trainers: [],
    background: '/bg_rusturf_tunnel.png',
    description: 'Tunel escavado pela forca dos Whismur.',
  },

  dewford_town: {
    id: 'dewford_town', name: 'Dewford Town', type: 'city', group: 'Hoenn Dewford',
    unlockLevel: 11, requirements: ['stone_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_dewford_town.png',
    description: 'Ilha ensolarada famosa pelo surf.',
  },

  granite_cave: {
    id: 'granite_cave', name: 'Granite Cave', type: 'farm', group: 'Hoenn Dewford',
    unlockLevel: 12, requirements: ['stone_badge'],
    biome: 'cave',
    enemies: pk([41, 293, 304, 299, 361], 10),
    trainerChance: 0,
    trainers: [],
    background: '/bg_granite_cave.png',
    description: 'Caverna de pedras cristalizadas com pinturas antigas.',
  },

  slateport_city: {
    id: 'slateport_city', name: 'Slateport City', type: 'city', group: 'Hoenn Slateport',
    unlockLevel: 15, requirements: ['knuckle_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_slateport_city.png',
    description: 'Cidade portuaria movimentada com museu oceanico.',
  },

  route_110: {
    id: 'route_110', name: 'Rota 110', type: 'farm', group: 'Hoenn Mauville',
    unlockLevel: 16, requirements: ['knuckle_badge'],
    biome: 'grass',
    enemies: pk([309, 311, 312, 183, 278], 14),
    trainerChance: 0.05,
    trainers: [
      { name: 'Cyclist Lein',   sprite: S.aceM, team: pk([309], 15), reward: 320 },
      { name: 'Cyclist Hailey', sprite: S.aceF, team: pk([311], 15), reward: 320 },
    ],
    background: '/bg_route110.png',
    description: 'A Cycling Road acima desta rota e iconica.',
  },

  mauville_city: {
    id: 'mauville_city', name: 'Mauville City', type: 'city', group: 'Hoenn Mauville',
    unlockLevel: 17, requirements: ['knuckle_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_mauville_city.png',
    description: 'Cidade hipertecnologica e indoor com casino.',
  },

  route_111_desert: {
    id: 'route_111_desert', name: 'Rota 111 (Deserto)', type: 'farm', group: 'Hoenn Lavaridge',
    unlockLevel: 20, requirements: ['dynamo_badge'],
    biome: 'grass',
    enemies: pk([27, 28, 328, 329, 322, 290], 18),
    trainerChance: 0.05,
    trainers: [
      { name: 'Ruin Maniac Dusty', sprite: S.hiker, team: pk([27, 328], 20), reward: 500 },
    ],
    background: '/bg_route111_desert.png',
    description: 'Deserto com tempestades de areia e ruinas enterradas.',
  },

  fiery_path: {
    id: 'fiery_path', name: 'Fiery Path', type: 'farm', group: 'Hoenn Lavaridge',
    unlockLevel: 21, requirements: ['dynamo_badge'],
    biome: 'cave',
    enemies: pk([322, 218, 219, 109, 77], 20),
    trainerChance: 0,
    trainers: [],
    background: '/bg_fiery_path.png',
    description: 'Caverna vulcanica com rios de lava.',
  },

  fallarbor_town: {
    id: 'fallarbor_town', name: 'Fallarbor Town', type: 'city', group: 'Hoenn Lavaridge',
    unlockLevel: 22, requirements: ['dynamo_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_fallarbor_town.png',
    description: 'Vilarejo rural coberto de cinzas vulcanicas.',
  },

  route_113: {
    id: 'route_113', name: 'Rota 113', type: 'farm', group: 'Hoenn Lavaridge',
    unlockLevel: 22, requirements: ['dynamo_badge'],
    biome: 'grass',
    enemies: pk([333, 335, 227, 291], 20),
    trainerChance: 0.05,
    trainers: [
      { name: 'Ninja Boy Lao', sprite: S.youngster, team: pk([291], 20), reward: 400 },
    ],
    background: '/bg_route113.png',
    description: 'Rota coberta de cinzas com Skarmory e Swablu.',
  },

  meteor_falls: {
    id: 'meteor_falls', name: 'Meteor Falls', type: 'farm', group: 'Hoenn Lavaridge',
    unlockLevel: 23, requirements: ['dynamo_badge'],
    biome: 'cave',
    enemies: pk([333, 41, 304, 347, 348], 21),
    trainerChance: 0.05,
    trainers: [
      { name: 'Team Magma Grunt', sprite: S.rocket, team: pk([322, 304], 22), reward: 600 },
    ],
    background: '/bg_meteor_falls.png',
    description: 'Caverna magica com cachoeiras azuis e meteoritos.',
  },

  mt_chimney: {
    id: 'mt_chimney', name: 'Mt. Chimney', type: 'farm', group: 'Hoenn Lavaridge',
    unlockLevel: 24, requirements: ['dynamo_badge'],
    biome: 'cave',
    enemies: pk([322, 323, 218, 219, 77, 78], 23),
    trainerChance: 0.07,
    trainers: [
      { name: 'Team Magma Admin Tabitha', sprite: S.rocket, team: pk([322, 322, 323], 25), reward: 1500 },
    ],
    background: '/bg_mt_chimney.png',
    description: 'O pico de um vulcao ativo. Combate final com o Team Magma.',
  },

  lavaridge_town: {
    id: 'lavaridge_town', name: 'Lavaridge Town', type: 'city', group: 'Hoenn Lavaridge',
    unlockLevel: 25, requirements: ['dynamo_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_lavaridge_town.png',
    description: 'Cidade termal com fontes quentes e spa.',
  },

  route_118_119: {
    id: 'route_118_119', name: 'Rotas 118 e 119', type: 'farm', group: 'Hoenn Fortree',
    unlockLevel: 32, requirements: ['heat_badge'],
    biome: 'grass',
    enemies: pk([333, 335, 283, 284, 278, 341, 342], 28),
    trainerChance: 0.05,
    trainers: [
      { name: 'Bird Keeper Phil',  sprite: S.aceM, team: pk([333, 278], 29), reward: 700 },
      { name: 'Fisherman Elliot',  sprite: S.cooltrainer, team: pk([341], 29), reward: 650 },
    ],
    background: '/bg_route119.png',
    description: 'Rotas de chuva torrencial com grama extremamente alta.',
  },

  fortree_city: {
    id: 'fortree_city', name: 'Fortree City', type: 'city', group: 'Hoenn Fortree',
    unlockLevel: 33, requirements: ['heat_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_fortree_city.png',
    description: 'Cidade nas copas das arvores, ligadas por pontes suspensas.',
  },

  route_120_121: {
    id: 'route_120_121', name: 'Rotas 120 e 121', type: 'farm', group: 'Hoenn Lilycove',
    unlockLevel: 36, requirements: ['feather_badge'],
    biome: 'grass',
    enemies: pk([352, 353, 354, 302, 303, 358], 34),
    trainerChance: 0.05,
    trainers: [
      { name: 'Ace Trainer Cybil',  sprite: S.aceF, team: pk([352, 358], 35), reward: 900 },
      { name: 'Ace Trainer Ruben',  sprite: S.aceM, team: pk([302, 354], 35), reward: 900 },
    ],
    background: '/bg_route119.png',
    description: 'Rotas de savana que levam a Lilycove.',
  },

  mt_pyre: {
    id: 'mt_pyre', name: 'Mt. Pyre', type: 'farm', group: 'Hoenn Lilycove',
    unlockLevel: 37, requirements: ['feather_badge'],
    biome: 'cave',
    enemies: pk([355, 356, 353, 354, 302, 202], 36),
    trainerChance: 0.05,
    trainers: [
      { name: 'Team Aqua Grunt', sprite: S.rocket, team: pk([316, 315], 36), reward: 800 },
    ],
    background: '/bg_mt_pyre.png',
    description: 'Cemiterio Pokemon envolvido em neblina permanente.',
  },

  lilycove_city: {
    id: 'lilycove_city', name: 'Lilycove City', type: 'city', group: 'Hoenn Lilycove',
    unlockLevel: 38, requirements: ['feather_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_lilycove_city.png',
    description: 'Cidade costeira majestosa com uma loja departamentos gigante.',
  },

  ocean_routes: {
    id: 'ocean_routes', name: 'Rotas Oceanicas', type: 'farm', group: 'Hoenn Mossdeep',
    unlockLevel: 42, requirements: ['mind_badge'],
    biome: 'water',
    enemies: pk([72, 73, 278, 279, 341, 342, 370, 369, 226], 40),
    trainerChance: 0.05,
    trainers: [
      { name: 'Swimmer Cody',   sprite: S.cooltrainer, team: pk([72, 278], 41), reward: 900 },
      { name: 'Swimmer Missy',  sprite: S.aceF,        team: pk([341, 370], 41), reward: 900 },
    ],
    background: '/bg_ocean_routes.png',
    description: 'Oceano tropical com recifes de coral coloridos.',
  },

  mossdeep_city: {
    id: 'mossdeep_city', name: 'Mossdeep City', type: 'city', group: 'Hoenn Mossdeep',
    unlockLevel: 43, requirements: ['mind_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_mossdeep_city.png',
    description: 'Ilha com o centro espacial da Hoenn.',
  },

  seafloor_cavern: {
    id: 'seafloor_cavern', name: 'Seafloor Cavern', type: 'farm', group: 'Hoenn Sootopolis',
    unlockLevel: 46, requirements: ['mind_badge'],
    biome: 'cave',
    enemies: pk([72, 73, 95, 75, 369, 370], 44),
    trainerChance: 0.05,
    trainers: [
      { name: 'Team Aqua Admin Matt', sprite: S.rocket, team: pk([315, 316, 370], 46), reward: 2000 },
    ],
    background: '/bg_seafloor_cavern.png',
    description: 'Caverna subaquatica onde o Team Aqua ativa Kyogre.',
  },

  sootopolis_city: {
    id: 'sootopolis_city', name: 'Sootopolis City', type: 'city', group: 'Hoenn Sootopolis',
    unlockLevel: 47, requirements: ['mind_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_sootopolis_city.png',
    description: 'Cidade dentro de uma cratera vulcanica cheia de agua.',
  },

  cave_of_origin: {
    id: 'cave_of_origin', name: 'Cave of Origin', type: 'farm', group: 'Hoenn Sootopolis',
    unlockLevel: 48, requirements: ['mind_badge'],
    biome: 'cave',
    enemies: pk([41, 42, 302, 303, 361, 362], 46),
    trainerChance: 0,
    trainers: [],
    background: '/bg_cave_of_origin.png',
    description: 'Caverna sagrada coberta de cristais ancestrais.',
  },

  sky_pillar: {
    id: 'sky_pillar', name: 'Sky Pillar', type: 'farm', group: 'Hoenn Ever Grande',
    unlockLevel: 55, requirements: ['rain_badge'],
    biome: 'cave',
    enemies: pk([329, 330, 333, 335, 291, 302], 50),
    trainerChance: 0,
    trainers: [],
    background: '/bg_sky_pillar.png',
    description: 'A torre ancestral que toca o ceu. Rayquaza habita aqui.',
  },

  pacifidlog_town: {
    id: 'pacifidlog_town', name: 'Pacifidlog Town', type: 'city', group: 'Hoenn Ever Grande',
    unlockLevel: 52, requirements: ['rain_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_pacifidlog.png',
    description: 'Vilarejo flutuante sobre um recife de coral vivo.',
  },

  ever_grande_city: {
    id: 'ever_grande_city', name: 'Ever Grande City', type: 'city', group: 'Hoenn Liga',
    unlockLevel: 56, requirements: ['rain_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_ever_grande.png',
    description: 'A cidade das flores que guarda a Liga Pokemon de Hoenn.',
  },

  victory_road_hoenn: {
    id: 'victory_road_hoenn', name: 'Victory Road Hoenn', type: 'farm', group: 'Hoenn Liga',
    unlockLevel: 57, requirements: ['rain_badge'],
    biome: 'cave',
    enemies: pk([304, 305, 306, 357, 330, 362, 374], 54),
    trainerChance: 0.07,
    trainers: [
      { name: 'Ace Trainer Hope',  sprite: S.aceF, team: pk([330, 357], 55), reward: 3000 },
      { name: 'Ace Trainer Edgar', sprite: S.aceM, team: pk([306, 362], 56), reward: 3000 },
    ],
    background: '/bg_victory_road_hoenn.png',
    description: 'O derradeiro desafio antes da Liga de Hoenn.',
  },

  hoenn_battle_frontier: {
    id: 'hoenn_battle_frontier', name: 'Battle Frontier', type: 'farm', group: 'Hoenn Pos-Liga',
    unlockLevel: 68, requirements: ['hoenn_champion'],
    biome: 'grass',
    enemies: pk([359, 330, 334, 350, 306, 376, 373], 68),
    trainerChance: 0.08,
    trainers: [
      { name: 'Frontier Ace Mara', sprite: S.aceF, team: pk([350, 373, 376], 72), reward: 4200 },
      { name: 'Frontier Ace Caio', sprite: S.aceM, team: pk([306, 330, 359], 74), reward: 4500 },
    ],
    background: '/bg_battle_frontier.png',
    description: 'Treino pos-Liga de Hoenn para preparar o time para desafios acima do nivel 70.',
  },

  sky_pillar_summit: {
    id: 'sky_pillar_summit', name: 'Topo do Sky Pillar', type: 'farm', group: 'Hoenn Pos-Liga',
    unlockLevel: 78, requirements: ['hoenn_champion'],
    biome: 'cave',
    enemies: pk([291, 302, 306, 330, 334, 373], 78),
    trainerChance: 0.04,
    trainers: [
      { name: 'Dragon Tamer Ivo', sprite: S.aceM, team: pk([330, 373], 82), reward: 5200 },
    ],
    background: '/bg_sky_pillar.png',
    description: 'Uma rota de elite para lapidar o time de Hoenn antes de partir para Sinnoh.',
  },

  twinleaf_town: {
    id: 'twinleaf_town', name: 'Twinleaf Town', type: 'city', group: 'Sinnoh Inicio',
    unlockLevel: 1, requirements: ['sinnoh_started'],
    background: '/bg_twinleaf.png',
    description: 'O primeiro lar da jornada de Sinnoh.',
  },

  sinnoh_route_201: {
    id: 'sinnoh_route_201', name: 'Rota 201', type: 'farm', group: 'Sinnoh Inicio',
    unlockLevel: 5, requirements: ['sinnoh_started'],
    unlocks: 'sinnoh_route_201_cleared',
    biome: 'grass',
    enemies: pk([396, 399, 401, 403, 406], 5),
    trainerChance: 0.04,
    trainers: [
      { name: 'Youngster Nolan', sprite: S.youngster, team: pk([396, 399], 7), reward: 400 },
    ],
    background: '/bg_route201.png',
    description: 'Primeira rota de Sinnoh, ideal para treinar o inicial ate os primeiros niveis.',
  },

  sandgem_town: {
    id: 'sandgem_town', name: 'Sandgem Town', type: 'city', group: 'Sinnoh Sandgem',
    unlockLevel: 6, requirements: ['sinnoh_route_201_cleared'],
    background: '/bg_sandgem.png',
    description: 'A cidade do laboratorio do Prof. Rowan.',
  },

  sinnoh_route_202: {
    id: 'sinnoh_route_202', name: 'Rota 202', type: 'farm', group: 'Sinnoh Sandgem',
    unlockLevel: 8, requirements: ['sinnoh_route_201_cleared'],
    unlocks: 'sinnoh_route_202_cleared',
    biome: 'grass',
    enemies: pk([396, 399, 401, 403, 406, 412], 8),
    trainerChance: 0.06,
    trainers: [
      { name: 'Lass Natalie', sprite: S.lass, team: pk([401, 406], 10), reward: 520 },
      { name: 'Youngster Logan', sprite: S.youngster, team: pk([399, 403], 11), reward: 560 },
    ],
    background: '/bg_route202.png',
    description: 'Capturas basicas para formar o primeiro time de Sinnoh.',
  },

  jubilife_city: {
    id: 'jubilife_city', name: 'Jubilife City', type: 'city', group: 'Sinnoh Jubilife',
    unlockLevel: 10, requirements: ['sinnoh_route_202_cleared'],
    background: '/bg_jubilife.png',
    description: 'Centro urbano de Sinnoh e ponto seguro para reorganizar o time.',
  },

  sinnoh_route_203: {
    id: 'sinnoh_route_203', name: 'Rota 203', type: 'farm', group: 'Sinnoh Jubilife',
    unlockLevel: 12, requirements: ['sinnoh_route_202_cleared'],
    unlocks: 'sinnoh_route_203_cleared',
    biome: 'grass',
    enemies: pk([396, 399, 401, 403, 406, 63], 12),
    trainerChance: 0.07,
    trainers: [
      { name: 'Youngster Dallas', sprite: S.youngster, team: pk([397, 64], 15), reward: 760 },
    ],
    background: '/bg_route202.png',
    description: 'Rota de transicao para evoluir capturas iniciais e preparar desafios maiores.',
  },

  sinnoh_route_204: {
    id: 'sinnoh_route_204', name: 'Rota 204', type: 'farm', group: 'Sinnoh Floaroma',
    unlockLevel: 18, requirements: ['sinnoh_route_203_cleared'],
    unlocks: 'sinnoh_route_204_cleared',
    biome: 'grass',
    enemies: pk([397, 400, 402, 406, 315, 418], 18),
    trainerChance: 0.07,
    trainers: [
      { name: 'Aroma Lady Sofia', sprite: S.lass, team: pk([406, 315], 20), reward: 950 },
    ],
    background: '/bg_eterna.png',
    description: 'Primeira subida de dificuldade, com evolucoes iniciais e capturas mais resistentes.',
  },

  eterna_forest_sinnoh: {
    id: 'eterna_forest_sinnoh', name: 'Eterna Forest', type: 'farm', group: 'Sinnoh Eterna',
    unlockLevel: 24, requirements: ['sinnoh_route_204_cleared'],
    unlocks: 'sinnoh_eterna_forest_cleared',
    biome: 'forest',
    enemies: pk([401, 402, 406, 315, 427, 433], 24),
    trainerChance: 0.08,
    trainers: [
      { name: 'Bug Catcher Anton', sprite: S.bugcatcher, team: pk([402, 412], 26), reward: 1200 },
    ],
    background: '/bg_eterna_forest.png',
    description: 'Floresta para consolidar o time antes dos desafios intermediarios.',
  },

  sinnoh_route_209: {
    id: 'sinnoh_route_209', name: 'Rota 209', type: 'farm', group: 'Sinnoh Hearthome',
    unlockLevel: 32, requirements: ['sinnoh_eterna_forest_cleared'],
    unlocks: 'sinnoh_route_209_cleared',
    biome: 'grass',
    enemies: pk([397, 400, 402, 427, 433, 434], 32),
    trainerChance: 0.08,
    trainers: [
      { name: 'Pokemon Breeder Abril', sprite: S.lass, team: pk([427, 433, 434], 34), reward: 1600 },
    ],
    background: '/bg_eterna.png',
    description: 'Rota de treino de nivel medio, boa para preparar evolucoes finais.',
  },

  valor_lakefront: {
    id: 'valor_lakefront', name: 'Valor Lakefront', type: 'farm', group: 'Sinnoh Veilstone',
    unlockLevel: 42, requirements: ['sinnoh_route_209_cleared'],
    unlocks: 'sinnoh_valor_lakefront_cleared',
    biome: 'water',
    enemies: pk([398, 400, 405, 419, 423, 435], 42),
    trainerChance: 0.08,
    trainers: [
      { name: 'Ace Trainer Breno', sprite: S.aceM, team: pk([405, 419], 44), reward: 2400 },
    ],
    background: '/bg_sinnoh_league.png',
    description: 'Margem do lago com combates em ritmo de pos-ginasios intermediarios.',
  },

  mt_coronet_sinnoh: {
    id: 'mt_coronet_sinnoh', name: 'Mt. Coronet', type: 'farm', group: 'Sinnoh Coronet',
    unlockLevel: 54, requirements: ['sinnoh_valor_lakefront_cleared'],
    unlocks: 'sinnoh_mt_coronet_cleared',
    biome: 'mountain',
    enemies: pk([398, 400, 405, 437, 444, 459], 54),
    trainerChance: 0.08,
    trainers: [
      { name: 'Hiker Davi', sprite: S.hiker, team: pk([437, 444], 56), reward: 3200 },
    ],
    background: '/bg_mt_coronet.png',
    description: 'Montanha central de Sinnoh, com encontros fortes para chegar ao fim da campanha.',
  },

  snowpoint_routes: {
    id: 'snowpoint_routes', name: 'Rotas de Snowpoint', type: 'farm', group: 'Sinnoh Snowpoint',
    unlockLevel: 66, requirements: ['sinnoh_mt_coronet_cleared'],
    unlocks: 'sinnoh_snowpoint_cleared',
    biome: 'ice',
    enemies: pk([459, 460, 461, 473, 478, 405], 66),
    trainerChance: 0.08,
    trainers: [
      { name: 'Skier Bianca', sprite: S.aceF, team: pk([460, 478], 68), reward: 4200 },
    ],
    background: '/bg_snowpoint.png',
    description: 'Rotas geladas para preparar o time para o fechamento da Liga.',
  },

  sunyshore_routes: {
    id: 'sunyshore_routes', name: 'Rotas de Sunyshore', type: 'farm', group: 'Sinnoh Sunyshore',
    unlockLevel: 76, requirements: ['sinnoh_snowpoint_cleared'],
    unlocks: 'sinnoh_sunyshore_cleared',
    biome: 'grass',
    enemies: pk([398, 405, 407, 419, 448, 445], 76),
    trainerChance: 0.09,
    trainers: [
      { name: 'Ace Trainer Lia', sprite: S.aceF, team: pk([407, 448, 445], 78), reward: 5200 },
    ],
    background: '/bg_sunyshore.png',
    description: 'Treino pre-Liga de Sinnoh, equilibrado para times na faixa dos 70.',
  },

  sinnoh_victory_training: {
    id: 'sinnoh_victory_training', name: 'Treino da Victory Road', type: 'farm', group: 'Sinnoh Treino Avancado',
    unlockLevel: 84, requirements: ['sinnoh_sunyshore_cleared'],
    unlocks: 'sinnoh_victory_training_cleared',
    biome: 'cave',
    enemies: pk([398, 400, 405, 407, 445, 448], 84),
    trainerChance: 0.08,
    trainers: [
      { name: 'Ace Trainer Mira', sprite: S.aceF, team: pk([407, 448, 445], 88), reward: 6200 },
    ],
    background: '/bg_victory_road_sinnoh.png',
    description: 'Treino intenso para times que ja passaram da fase inicial de Sinnoh.',
  },

  survival_area: {
    id: 'survival_area', name: 'Survival Area', type: 'farm', group: 'Sinnoh Treino Avancado',
    unlockLevel: 92, requirements: ['sinnoh_victory_training_cleared'],
    unlocks: 'sinnoh_survival_area_cleared',
    biome: 'mountain',
    enemies: pk([464, 466, 467, 475, 445, 448], 92),
    trainerChance: 0.1,
    trainers: [
      { name: 'Veteran Alma', sprite: S.aceF, team: pk([475, 464, 467], 95), reward: 7600 },
    ],
    background: '/bg_mt_coronet.png',
    description: 'Area dura para manter a progressao ate os niveis finais.',
  },

  stark_mountain: {
    id: 'stark_mountain', name: 'Stark Mountain', type: 'farm', group: 'Sinnoh Treino Avancado',
    unlockLevel: 100, requirements: ['sinnoh_survival_area_cleared'],
    biome: 'mountain',
    enemies: pk([445, 448, 464, 466, 467, 485], 100),
    trainerChance: 0.12,
    trainers: [
      { name: 'Veteran Buck', sprite: S.aceM, team: pk([448, 467, 485], 100), reward: 10000 },
    ],
    background: '/bg_mt_coronet.png',
    description: 'Rota final de treino: inimigos no nivel 100 para fechar o endgame.',
  },
  ...REGIONAL_DEX_COVERAGE_ROUTES,
  ...FUTURE_REGION_ROUTES,
};

/**
 * Battle Backgrounds — Temáticos por rota de Kanto
 * Cada rota tem: gradient (CSS), overlay, groundColor e decoração visual SVG
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const bg = (file) => `url('${BASE}/${file}')`;

export const BATTLE_BACKGROUNDS = {

  // PALLET TOWN
  pallet_town: {
    sky: bg('battle_bg_grass_1776863779024.webp'),
    label: 'Cidade Pallet',
    ground: '#7cb850',
    groundAccent: '#5a9e3a',
    timeOfDay: 'day',
    elements: ['tree', 'tree', 'fence', 'cloud', 'cloud'],
  },

  // ROTA 1
  route_1: {
    sky: bg('battle_bg_grass_1776863779024.webp'),
    label: 'Rota 1',
    ground: '#6ab040',
    groundAccent: '#52943a',
    timeOfDay: 'day',
    elements: ['tall_grass', 'tall_grass', 'tree', 'cloud', 'flower'],
  },

  // VIRIDIAN CITY
  viridian_city: {
    sky: bg('battle_bg_grass_1776863779024.webp'),
    label: 'Cidade Viridian',
    ground: '#82b844',
    groundAccent: '#6a9e36',
    timeOfDay: 'day',
    elements: ['building', 'tree', 'cloud', 'fence'],
  },

  // ROTA 22
  route_22: {
    sky: bg('battle_bg_route22_1776993565727.webp'),
    label: 'Rota 22 — Pôr do Sol',
    ground: '#8fbc8f',
    groundAccent: '#5a9e3a',
    timeOfDay: 'sunset',
    elements: ['tree', 'tall_grass', 'mountain_small', 'cloud_orange'],
  },

  // FLORESTA DE VIRIDIAN
  viridian_forest: {
    sky: bg('battle_bg_forest_1776863795763.webp'),
    label: 'Floresta de Viridian',
    ground: '#3a6e28',
    groundAccent: '#2a5020',
    timeOfDay: 'forest',
    elements: ['big_tree', 'big_tree', 'big_tree', 'mushroom', 'bush', 'cobweb'],
  },

  // PEWTER CITY
  pewter_city: {
    sky: bg('battle_bg_gym_1776863824590.webp'),
    label: 'Cidade Pewter',
    ground: '#a89880',
    groundAccent: '#8a7860',
    timeOfDay: 'cloudy',
    elements: ['rock', 'rock', 'mountain', 'building', 'cloud_grey'],
  },

  // ROTA 3
  route_3: {
    sky: bg('battle_bg_route3_1776993578907.webp'),
    label: 'Rota 3',
    ground: '#c0d880',
    groundAccent: '#8ab850',
    timeOfDay: 'day',
    elements: ['mountain_small', 'tree', 'tall_grass', 'cloud', 'rock'],
  },

  // MT. MOON
  mt_moon: {
    sky: bg('battle_bg_cave_1776863810604.webp'),
    label: 'Mt. Moon',
    ground: '#3a3050',
    groundAccent: '#252035',
    timeOfDay: 'cave',
    elements: ['stalactite', 'stalactite', 'stalactite', 'moon_rock', 'moon_rock', 'cave_glow'],
  },

  // CERULEAN CITY
  cerulean_city: {
    sky: bg('battle_bg_gym_water.webp'),
    label: 'Cerulean - Beira-Rio',
    ground: '#c0e4f0',
    groundAccent: '#a0d0e0',
    timeOfDay: 'day',
    elements: ['water', 'water', 'cloud', 'flower_blue', 'bridge_plank'],
  },

  // ROTA 24/25
  route_24_25: {
    sky: bg('battle_bg_route24_25_1776993592209.webp'),
    label: 'Rota do Cabo Cerulean',
    ground: '#98d488',
    groundAccent: '#5aaa40',
    timeOfDay: 'day',
    elements: ['water', 'lily_pad', 'tall_grass', 'flower', 'cloud'],
  },

  // ROTA 5/6
  route_5_6: {
    sky: bg('battle_bg_route5_6_1776993605611.webp'),
    label: 'Rota 5-6',
    ground: '#b8e090',
    groundAccent: '#78b848',
    timeOfDay: 'day',
    elements: ['tree', 'tall_grass', 'fence', 'flower', 'cloud'],
  },

  // S.S. ANNE
  ss_anne: {
    sky: bg('battle_bg_ship_1776863844924.webp'),
    label: 'S.S. Anne',
    ground: '#0a4878',
    groundAccent: '#053060',
    timeOfDay: 'ocean_night',
    elements: ['ocean_wave', 'ocean_wave', 'ship_hull', 'ship_window', 'ship_window', 'star_sea'],
  },

  // VERMILION CITY
  vermilion_city: {
    sky: bg('battle_bg_gym_electric.webp'),
    label: 'Vermilion - Porto',
    ground: '#b0d8e0',
    groundAccent: '#90c0d0',
    timeOfDay: 'day',
    elements: ['port_crane', 'ocean_small', 'cloud', 'building', 'lighthouse'],
  },

  // ROTA 9/10
  route_9_10: {
    sky: bg('battle_bg_route9_10_1776993620394.webp'),
    label: 'Rota 9-10',
    ground: '#80a860',
    groundAccent: '#507840',
    timeOfDay: 'overcast',
    elements: ['cliff', 'cliff', 'tree', 'tall_grass', 'cloud_grey'],
  },

  // ROCK TUNNEL
  rock_tunnel: {
    sky: bg('battle_bg_rock_tunnel_1776993634918.webp'),
    label: 'Rock Tunnel — Escuridão',
    ground: '#1e1810',
    groundAccent: '#120e0a',
    timeOfDay: 'dark_cave',
    elements: ['stalactite', 'stalactite', 'stalactite_big', 'rock', 'rock', 'torch_glow'],
  },

  // ─── TORRE POKÉMON ────────────────────────────────────────
  pokemon_tower: {
    sky: bg('battle_bg_cave_1776863810604.webp'),
    label: 'Torre Pokémon',
    ground: '#200a38',
    groundAccent: '#10041e',
    timeOfDay: 'haunted',
    elements: ['ghost_mist', 'ghost_mist', 'gravestone', 'gravestone', 'dead_tree', 'purple_glow'],
  },

  // ROTA 7/8
  route_7_8: {
    sky: bg('battle_bg_grass_1776863779024.webp'),
    label: 'Rota 7-8',
    ground: '#c8e890',
    groundAccent: '#88b850',
    timeOfDay: 'day',
    elements: ['tree', 'tall_grass', 'tall_grass', 'flower', 'cloud'],
  },

  // QG DA EQUIPE ROCKET
  rocket_hideout: {
    sky: bg('battle_bg_lab_1776866008842.webp'),
    label: 'QG Rocket',
    ground: '#282020',
    groundAccent: '#181010',
    timeOfDay: 'bunker',
    elements: ['metal_wall', 'metal_wall', 'red_light', 'rocket_crate', 'danger_stripe'],
  },

  // CELADON CITY
  celadon_city: {
    sky: bg('battle_bg_forest_1776863795763.webp'),
    label: 'Celadon - Jardins',
    ground: '#a8d890',
    groundAccent: '#68a860',
    timeOfDay: 'day',
    elements: ['flower', 'flower', 'flower', 'tree', 'cloud', 'butterfly'],
  },

  // ROTA 12-15
  route_12_15: {
    sky: bg('battle_bg_route11.webp'),
    label: 'Rota Leste',
    ground: '#90d890',
    groundAccent: '#50a050',
    timeOfDay: 'day',
    elements: ['water', 'lily_pad', 'tree', 'tall_grass', 'cloud'],
  },

  // SAFARI ZONE
  safari_zone: {
    sky: bg('battle_bg_forest_1776863795763.webp'),
    label: 'Zona Safari',
    ground: '#70b878',
    groundAccent: '#58a060',
    timeOfDay: 'savanna',
    elements: ['safari_rock', 'tall_grass', 'big_tree', 'water_hole', 'safari_sign'],
  },

  // FUCHSIA CITY
  fuchsia_city: {
    sky: bg('battle_bg_gym_1776863824590.webp'),
    label: 'Fuchsia — Ginásio do Veneno',
    ground: '#b870b0',
    groundAccent: '#903090',
    timeOfDay: 'purple_haze',
    elements: ['poison_cloud', 'poison_cloud', 'flower_purple', 'ninja_wall'],
  },

  // SILPH CO.
  silph_co: {
    sky: bg('battle_bg_lab_1776866008842.webp'),
    label: 'Silph Co. — Arranha-Céu',
    ground: '#243058',
    groundAccent: '#141e3a',
    timeOfDay: 'indoor_tech',
    elements: ['office_window', 'office_window', 'server_rack', 'neon_light', 'city_view'],
  },

  // SAFFRON CITY
  saffron_city: {
    sky: bg('battle_bg_gym_1776863824590.webp'),
    label: 'Saffron — Arena Psíquica',
    ground: '#d83090',
    groundAccent: '#a01870',
    timeOfDay: 'psychic',
    elements: ['psychic_orb', 'psychic_orb', 'mirror_panel', 'mirror_panel', 'psychic_wave'],
  },

  // CYCLING ROAD (ROTA 16-18)
  route_16_18: {
    sky: bg('battle_bg_route16_17_18.webp'),
    label: 'Cycling Road',
    ground: '#d0e8a8',
    groundAccent: '#90c060',
    timeOfDay: 'breezy',
    elements: ['windmill', 'tree', 'bike_path', 'cloud', 'cloud'],
  },

  // ─── MANSÃO POKÉMON ───────────────────────────────────────
  pokemon_mansion: {
    sky: bg('battle_bg_lab_1776866008842.webp'),
    label: 'Mansão Pokémon',
    ground: '#281010',
    groundAccent: '#180808',
    timeOfDay: 'mansion',
    elements: ['broken_wall', 'broken_wall', 'flame_torch', 'flame_torch', 'cracked_floor', 'dead_plant'],
  },

  // CINNABAR ISLAND
  cinnabar_island: {
    sky: bg('battle_bg_cave_1776863810604.webp'),
    label: 'Ilha Cinnabar — Vulcão',
    ground: '#d06030',
    groundAccent: '#a04018',
    timeOfDay: 'volcanic',
    elements: ['lava_pool', 'lava_pool', 'volcano_smoke', 'ash_cloud', 'magma_rock'],
  },

  // ROTA 23 (VICTORY ROAD EXTERIOR)
  route_22_23: {
    sky: bg('battle_bg_route23.webp'),
    label: 'Rota 23 — Caminho da Vitória',
    ground: '#707098',
    groundAccent: '#505078',
    timeOfDay: 'dramatic',
    elements: ['tall_cliff', 'tall_cliff', 'waterfall', 'rock', 'cloud_dark'],
  },

  // ─── GINÁSIO DE VIRIDIAN ──────────────────────────────────
  viridian_gym: {
    sky: bg('battle_bg_gym_1776863824590.webp'),
    label: 'Ginásio de Viridian — Terra',
    ground: '#4a3020',
    groundAccent: '#2a1a10',
    timeOfDay: 'ground_gym',
    elements: ['earth_crack', 'earth_crack', 'rock', 'rock', 'sand_swirl'],
  },

  // VICTORY ROAD
  victory_road: {
    sky: bg('battle_bg_cave_1776863810604.webp'),
    label: 'Victory Road',
    ground: '#0c1220',
    groundAccent: '#06080e',
    timeOfDay: 'epic_cave',
    elements: ['epic_stalactite', 'epic_stalactite', 'crystal_glow', 'crystal_glow', 'torch_glow', 'boulder'],
  },

  // PLATEAU INDIGO
  indigo_plateau: {
    sky: bg('battle_bg_gym_1776863824590.webp'),
    label: 'Plateau Indigo — Liga Pokémon',
    ground: '#140028',
    groundAccent: '#080010',
    timeOfDay: 'league',
    elements: ['league_pillar', 'league_pillar', 'golden_star', 'golden_star', 'trophy_glow', 'confetti'],
  },

  // CAVERNA CERULEAN
  cerulean_cave: {
    sky: bg('battle_bg_cave_1776863810604.webp'),
    label: 'Caverna Cerulean - Lair de Mewtwo',
    ground: '#0c0c28',
    groundAccent: '#060614',
    timeOfDay: 'legendary',
    elements: ['purple_crystal', 'purple_crystal', 'mewtwo_glow', 'dark_mist', 'ancient_rune'],
  },

  // UNOVA
  unova_route_1: {
    sky: bg('bg_unova_route.webp'),
    label: 'Unova — Rota 1',
    ground: '#789048',
    groundAccent: '#5a6e36',
    timeOfDay: 'day',
    elements: ['building_distant', 'street_lamp', 'park_bench', 'cloud'],
  },
  unova_home_town: {
    sky: bg('bg_unova_city.webp'),
    label: 'Cidade de Unova',
    ground: '#808080',
    groundAccent: '#606060',
    timeOfDay: 'day',
    elements: ['skyscraper', 'skyscraper', 'billboard', 'city_light'],
  },

  // KALOS
  kalos_route_1: {
    sky: bg('bg_kalos_route.webp'),
    label: 'Kalos — Rota 1',
    ground: '#98c060',
    groundAccent: '#709040',
    timeOfDay: 'day',
    elements: ['flower_lavender', 'flower_lavender', 'chateau_distant', 'cloud'],
  },
  kalos_home_town: {
    sky: bg('bg_kalos_city.webp'),
    label: 'Cidade de Kalos',
    ground: '#a8a8a8',
    groundAccent: '#808080',
    timeOfDay: 'day',
    elements: ['eiffel_tower', 'cafe_table', 'street_lamp_old', 'flower_pot'],
  },

  // ALOLA
  alola_route_1: {
    sky: bg('bg_alola_route.webp'),
    label: 'Alola — Rota 1',
    ground: '#e0d0a0',
    groundAccent: '#c0b080',
    timeOfDay: 'day',
    elements: ['palm_tree', 'palm_tree', 'ocean_view', 'surfboard', 'cloud_white'],
  },
  alola_home_town: {
    sky: bg('bg_alola_city.webp'),
    label: 'Cidade de Alola',
    ground: '#f0e0b0',
    groundAccent: '#d0c090',
    timeOfDay: 'day',
    elements: ['beach_umbrella', 'palm_tree', 'ocean_small', 'shop_stall'],
  },

  // GALAR
  galar_route_1: {
    sky: bg('bg_galar_route.webp'),
    label: 'Galar — Rota 1',
    ground: '#70a050',
    groundAccent: '#508040',
    timeOfDay: 'overcast',
    elements: ['windmill', 'castle_tower', 'stone_wall', 'cloud_grey'],
  },
  galar_home_town: {
    sky: bg('bg_galar_city.webp'),
    label: 'Cidade de Galar',
    ground: '#909090',
    groundAccent: '#707070',
    timeOfDay: 'day',
    elements: ['big_ben', 'red_phone_box', 'steam_pipe', 'brick_wall'],
  },

  // PALDEA
  paldea_route_1: {
    sky: bg('bg_paldea_route.webp'),
    label: 'Paldea — Rota 1',
    ground: '#c0b870',
    groundAccent: '#908850',
    timeOfDay: 'day',
    elements: ['olive_tree', 'crater_distant', 'mountain_range', 'cloud'],
  },
  paldea_home_town: {
    sky: bg('bg_paldea_city.webp'),
    label: 'Cidade de Paldea',
    ground: '#d0c0a0',
    groundAccent: '#b0a080',
    timeOfDay: 'day',
    elements: ['academy_tower', 'plaza_fountain', 'tiled_roof', 'flower_orange'],
  },
};

/**
 * Retorna o objeto de background para uma dada rota.
 * Fallback para route_1 (campo aberto).
 */
export function getRouteBg(routeId) {
  return BATTLE_BACKGROUNDS[routeId] || BATTLE_BACKGROUNDS.route_1;
}

/**
 * Gera os estilos CSS inline para o fundo da arena
 * Retorna { backgroundImage, backgroundColor }
 */
export function getRouteBgStyle(routeId) {
  const bg = getRouteBg(routeId);
  return {
    background: bg.sky,
  };
}

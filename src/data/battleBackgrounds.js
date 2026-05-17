/**
 * Battle Backgrounds — Temáticos por rota de Kanto
 * Cada rota tem: gradient (CSS), overlay, groundColor e decoração visual SVG
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const bg = (file) => `url('${BASE}/${file}')`;

const TYPE_DOMAIN_BACKGROUNDS = {
  normal:   { sky: bg('bg_type_normal_domain.webp'),   label: 'Dominio Normal',   ground: '#d6d3d1', groundAccent: '#a8a29e', timeOfDay: 'day', elements: ['cloud', 'tall_grass'] },
  fire:     { sky: bg('bg_type_fire_domain.webp'),     label: 'Dominio Fire',     ground: '#7f1d1d', groundAccent: '#450a0a', timeOfDay: 'sunset', elements: ['fire_pillar', 'lava_pool'] },
  water:    { sky: bg('bg_type_water_domain.webp'),    label: 'Dominio Water',    ground: '#155e75', groundAccent: '#083344', timeOfDay: 'day', elements: ['ocean_wave', 'waterfall'] },
  grass:    { sky: bg('bg_type_grass_domain.webp'),    label: 'Dominio Grass',    ground: '#3f6212', groundAccent: '#1a2e05', timeOfDay: 'day', elements: ['tall_grass', 'flower'] },
  electric: { sky: bg('bg_type_electric_domain.webp'), label: 'Dominio Electric', ground: '#854d0e', groundAccent: '#422006', timeOfDay: 'storm', elements: ['electric_spark', 'neon_light'] },
  flying:   { sky: bg('bg_type_flying_domain.webp'),   label: 'Dominio Flying',   ground: '#0e7490', groundAccent: '#164e63', timeOfDay: 'day', elements: ['cloud', 'windmill'] },
  poison:   { sky: bg('bg_type_poison_domain.webp'),   label: 'Dominio Poison',   ground: '#581c87', groundAccent: '#3b0764', timeOfDay: 'night', elements: ['forest_mist', 'poison_bubble'] },
  ground:   { sky: bg('bg_type_ground_domain.webp'),   label: 'Dominio Ground',   ground: '#92400e', groundAccent: '#451a03', timeOfDay: 'day', elements: ['sand_dune', 'sharp_rock'] },
  rock:     { sky: bg('bg_type_rock_domain.webp'),     label: 'Dominio Rock',     ground: '#57534e', groundAccent: '#292524', timeOfDay: 'day', elements: ['sharp_rock', 'crystal_shard'] },
  fighting: { sky: bg('bg_type_fighting_domain.webp'), label: 'Dominio Fighting', ground: '#991b1b', groundAccent: '#450a0a', timeOfDay: 'sunrise', elements: ['dojo_gate', 'training_post'] },
  psychic:  { sky: bg('bg_type_psychic_domain.webp'),  label: 'Dominio Psychic',  ground: '#7e22ce', groundAccent: '#3b0764', timeOfDay: 'legendary', elements: ['psychic_ring', 'floating_stone'] },
  bug:      { sky: bg('bg_type_bug_domain.webp'),      label: 'Dominio Bug',      ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'day', elements: ['flower', 'forest_mist'] },
  ice:      { sky: bg('bg_type_ice_domain.webp'),      label: 'Dominio Ice',      ground: '#f1f5f9', groundAccent: '#cbd5e1', timeOfDay: 'ice', elements: ['ice_crystal', 'snow_drift'] },
  ghost:    { sky: bg('bg_type_ghost_domain.webp'),    label: 'Dominio Ghost',    ground: '#1e1b4b', groundAccent: '#0f172a', timeOfDay: 'night', elements: ['spirit_orb', 'grave_stone'] },
  dragon:   { sky: bg('bg_type_dragon_domain.webp'),   label: 'Dominio Dragon',   ground: '#312e81', groundAccent: '#1e1b4b', timeOfDay: 'dramatic', elements: ['ancient_rune', 'crystal_glow'] },
  dark:     { sky: bg('bg_type_dark_domain.webp'),     label: 'Dominio Dark',     ground: '#111827', groundAccent: '#020617', timeOfDay: 'night', elements: ['moon', 'forest_mist'] },
  steel:    { sky: bg('bg_type_steel_domain.webp'),    label: 'Dominio Steel',    ground: '#475569', groundAccent: '#1e293b', timeOfDay: 'indoor_tech', elements: ['steel_beam', 'server_rack'] },
  fairy:    { sky: bg('bg_type_fairy_domain.webp'),    label: 'Dominio Fairy',    ground: '#be185d', groundAccent: '#831843', timeOfDay: 'evening', elements: ['flower', 'crystal_glow'] },
  prism:    { sky: bg('bg_type_prism_domain.webp'),    label: 'Dominio Prisma',   ground: '#334155', groundAccent: '#0f172a', timeOfDay: 'legendary', elements: ['crystal_glow', 'ancient_rune'] },
};

export const BATTLE_BACKGROUNDS = {
  ...Object.fromEntries(Object.entries(TYPE_DOMAIN_BACKGROUNDS).map(([type, value]) => [`paldea_type_domain_${type}`, value])),

  // PALLET TOWN
  pallet_town: {
    sky: bg('bg_kanto_grass.webp'),
    label: 'Cidade Pallet',
    ground: '#7cb850',
    groundAccent: '#5a9e3a',
    timeOfDay: 'day',
    elements: ['tree', 'tree', 'fence', 'cloud', 'cloud'],
  },

  // ROTA 1
  route_1: {
    sky: bg('bg_kanto_grass.webp'),
    label: 'Rota 1',
    ground: '#6ab040',
    groundAccent: '#52943a',
    timeOfDay: 'day',
    elements: ['tall_grass', 'tall_grass', 'tree', 'cloud', 'flower'],
  },

  // VIRIDIAN CITY
  viridian_city: {
    sky: bg('bg_kanto_grass.webp'),
    label: 'Cidade Viridian',
    ground: '#82b844',
    groundAccent: '#6a9e36',
    timeOfDay: 'day',
    elements: ['building', 'tree', 'cloud', 'fence'],
  },

  // ROTA 22
  route_22: {
    sky: bg('bg_kanto_route22.webp'),
    label: 'Rota 22 — Pôr do Sol',
    ground: '#8fbc8f',
    groundAccent: '#5a9e3a',
    timeOfDay: 'sunset',
    elements: ['tree', 'tall_grass', 'mountain_small', 'cloud_orange'],
  },

  // FLORESTA DE VIRIDIAN
  viridian_forest: {
    sky: bg('bg_kanto_forest.webp'),
    label: 'Floresta de Viridian',
    ground: '#3a6e28',
    groundAccent: '#2a5020',
    timeOfDay: 'forest',
    elements: ['big_tree', 'big_tree', 'big_tree', 'mushroom', 'bush', 'cobweb'],
  },

  // PEWTER CITY
  pewter_city: {
    sky: bg('bg_kanto_gym.webp'),
    label: 'Cidade Pewter',
    ground: '#a89880',
    groundAccent: '#8a7860',
    timeOfDay: 'cloudy',
    elements: ['rock', 'rock', 'mountain', 'building', 'cloud_grey'],
  },

  // ROTA 3
  route_3: {
    sky: bg('bg_kanto_route3.webp'),
    label: 'Rota 3',
    ground: '#c0d880',
    groundAccent: '#8ab850',
    timeOfDay: 'day',
    elements: ['mountain_small', 'tree', 'tall_grass', 'cloud', 'rock'],
  },

  // MT. MOON
  mt_moon: {
    sky: bg('bg_kanto_cave.webp'),
    label: 'Mt. Moon',
    ground: '#3a3050',
    groundAccent: '#252035',
    timeOfDay: 'cave',
    elements: ['stalactite', 'stalactite', 'stalactite', 'moon_rock', 'moon_rock', 'cave_glow'],
  },

  // CERULEAN CITY
  cerulean_city: {
    sky: bg('bg_gym_water.webp'),
    label: 'Cerulean - Beira-Rio',
    ground: '#c0e4f0',
    groundAccent: '#a0d0e0',
    timeOfDay: 'day',
    elements: ['water', 'water', 'cloud', 'flower_blue', 'bridge_plank'],
  },

  // ROTA 24/25
  route_24_25: {
    sky: bg('bg_kanto_route24_25.webp'),
    label: 'Rota do Cabo Cerulean',
    ground: '#98d488',
    groundAccent: '#5aaa40',
    timeOfDay: 'day',
    elements: ['water', 'lily_pad', 'tall_grass', 'flower', 'cloud'],
  },

  // ROTA 5/6
  route_5_6: {
    sky: bg('bg_kanto_route5_6.webp'),
    label: 'Rota 5-6',
    ground: '#b8e090',
    groundAccent: '#78b848',
    timeOfDay: 'day',
    elements: ['tree', 'tall_grass', 'fence', 'flower', 'cloud'],
  },

  // S.S. ANNE
  ss_anne: {
    sky: bg('bg_kanto_ship.webp'),
    label: 'S.S. Anne',
    ground: '#0a4878',
    groundAccent: '#053060',
    timeOfDay: 'ocean_night',
    elements: ['ocean_wave', 'ocean_wave', 'ship_hull', 'ship_window', 'ship_window', 'star_sea'],
  },

  // VERMILION CITY
  vermilion_city: {
    sky: bg('bg_gym_electric.webp'),
    label: 'Vermilion - Porto',
    ground: '#b0d8e0',
    groundAccent: '#90c0d0',
    timeOfDay: 'day',
    elements: ['port_crane', 'ocean_small', 'cloud', 'building', 'lighthouse'],
  },

  // ROTA 9/10
  route_9_10: {
    sky: bg('bg_kanto_route9_10.webp'),
    label: 'Rota 9-10',
    ground: '#80a860',
    groundAccent: '#507840',
    timeOfDay: 'overcast',
    elements: ['cliff', 'cliff', 'tree', 'tall_grass', 'cloud_grey'],
  },

  // ROCK TUNNEL
  rock_tunnel: {
    sky: bg('bg_kanto_rock_tunnel.webp'),
    label: 'Rock Tunnel — Escuridão',
    ground: '#1e1810',
    groundAccent: '#120e0a',
    timeOfDay: 'dark_cave',
    elements: ['stalactite', 'stalactite', 'stalactite_big', 'rock', 'rock', 'torch_glow'],
  },

  // ─── TORRE POKÉMON ────────────────────────────────────────
  pokemon_tower: {
    sky: bg('bg_kanto_pokemon_tower.webp'),
    label: 'Torre Pokémon',
    ground: '#200a38',
    groundAccent: '#10041e',
    timeOfDay: 'haunted',
    elements: ['ghost_mist', 'ghost_mist', 'gravestone', 'gravestone', 'dead_tree', 'purple_glow'],
  },

  // ROTA 7/8
  route_7_8: {
    sky: bg('bg_kanto_grass.webp'),
    label: 'Rota 7-8',
    ground: '#c8e890',
    groundAccent: '#88b850',
    timeOfDay: 'day',
    elements: ['tree', 'tall_grass', 'tall_grass', 'flower', 'cloud'],
  },

  // QG DA EQUIPE ROCKET
  rocket_hideout: {
    sky: bg('bg_kanto_rocket_hideout.webp'),
    label: 'QG Rocket',
    ground: '#282020',
    groundAccent: '#181010',
    timeOfDay: 'bunker',
    elements: ['metal_wall', 'metal_wall', 'red_light', 'rocket_crate', 'danger_stripe'],
  },

  // CELADON CITY
  celadon_city: {
    sky: bg('bg_kanto_forest.webp'),
    label: 'Celadon - Jardins',
    ground: '#a8d890',
    groundAccent: '#68a860',
    timeOfDay: 'day',
    elements: ['flower', 'flower', 'flower', 'tree', 'cloud', 'butterfly'],
  },

  // ROTA 12-15
  route_12_15: {
    sky: bg('bg_route11.webp'),
    label: 'Rota Leste',
    ground: '#90d890',
    groundAccent: '#50a050',
    timeOfDay: 'day',
    elements: ['water', 'lily_pad', 'tree', 'tall_grass', 'cloud'],
  },

  // SAFARI ZONE
  safari_zone: {
    sky: bg('bg_kanto_forest.webp'),
    label: 'Zona Safari',
    ground: '#70b878',
    groundAccent: '#58a060',
    timeOfDay: 'savanna',
    elements: ['safari_rock', 'tall_grass', 'big_tree', 'water_hole', 'safari_sign'],
  },

  // FUCHSIA CITY
  fuchsia_city: {
    sky: bg('bg_kanto_gym.webp'),
    label: 'Fuchsia — Ginásio do Veneno',
    ground: '#b870b0',
    groundAccent: '#903090',
    timeOfDay: 'purple_haze',
    elements: ['poison_cloud', 'poison_cloud', 'flower_purple', 'ninja_wall'],
  },

  // SILPH CO.
  silph_co: {
    sky: bg('bg_kanto_silph_co.webp'),
    label: 'Silph Co. — Arranha-Céu',
    ground: '#243058',
    groundAccent: '#141e3a',
    timeOfDay: 'indoor_tech',
    elements: ['office_window', 'office_window', 'server_rack', 'neon_light', 'city_view'],
  },

  // SAFFRON CITY
  saffron_city: {
    sky: bg('bg_kanto_gym.webp'),
    label: 'Saffron — Arena Psíquica',
    ground: '#d83090',
    groundAccent: '#a01870',
    timeOfDay: 'psychic',
    elements: ['psychic_orb', 'psychic_orb', 'mirror_panel', 'mirror_panel', 'psychic_wave'],
  },

  // CYCLING ROAD (ROTA 16-18)
  route_16_18: {
    sky: bg('bg_kanto_cycling_road.webp'),
    label: 'Cycling Road',
    ground: '#d0e8a8',
    groundAccent: '#90c060',
    timeOfDay: 'breezy',
    elements: ['windmill', 'tree', 'bike_path', 'cloud', 'cloud'],
  },

  // ─── MANSÃO POKÉMON ───────────────────────────────────────
  pokemon_mansion: {
    sky: bg('bg_kanto_pokemon_mansion.webp'),
    label: 'Mansão Pokémon',
    ground: '#281010',
    groundAccent: '#180808',
    timeOfDay: 'mansion',
    elements: ['broken_wall', 'broken_wall', 'flame_torch', 'flame_torch', 'cracked_floor', 'dead_plant'],
  },

  // CINNABAR ISLAND
  cinnabar_island: {
    sky: bg('bg_kanto_cave.webp'),
    label: 'Ilha Cinnabar — Vulcão',
    ground: '#d06030',
    groundAccent: '#a04018',
    timeOfDay: 'volcanic',
    elements: ['lava_pool', 'lava_pool', 'volcano_smoke', 'ash_cloud', 'magma_rock'],
  },

  // ROTA 23 (VICTORY ROAD EXTERIOR)
  route_22_23: {
    sky: bg('bg_route23.webp'),
    label: 'Rota 23 — Caminho da Vitória',
    ground: '#707098',
    groundAccent: '#505078',
    timeOfDay: 'dramatic',
    elements: ['tall_cliff', 'tall_cliff', 'waterfall', 'rock', 'cloud_dark'],
  },

  // ─── GINÁSIO DE VIRIDIAN ──────────────────────────────────
  viridian_gym: {
    sky: bg('bg_kanto_gym.webp'),
    label: 'Ginásio de Viridian — Terra',
    ground: '#4a3020',
    groundAccent: '#2a1a10',
    timeOfDay: 'ground_gym',
    elements: ['earth_crack', 'earth_crack', 'rock', 'rock', 'sand_swirl'],
  },

  // VICTORY ROAD
  victory_road: {
    sky: bg('bg_kanto_cave.webp'),
    label: 'Victory Road',
    ground: '#0c1220',
    groundAccent: '#06080e',
    timeOfDay: 'epic_cave',
    elements: ['epic_stalactite', 'epic_stalactite', 'crystal_glow', 'crystal_glow', 'torch_glow', 'boulder'],
  },

  // PLATEAU INDIGO
  indigo_plateau: {
    sky: bg('bg_kanto_gym.webp'),
    label: 'Plateau Indigo — Liga Pokémon',
    ground: '#140028',
    groundAccent: '#080010',
    timeOfDay: 'league',
    elements: ['league_pillar', 'league_pillar', 'golden_star', 'golden_star', 'trophy_glow', 'confetti'],
  },

  // CAVERNA CERULEAN
  cerulean_cave: {
    sky: bg('bg_kanto_cerulean_cave.webp'),
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
  kalos_route_2: {
    sky: bg('bg_kalos_forest.webp'),
    label: 'Kalos — Floresta Santalune',
    ground: '#4d7c0f', groundAccent: '#365314',
    timeOfDay: 'day',
    elements: ['tall_tree', 'mushroom_glow', 'forest_mist'],
  },
  kalos_route_4: {
    sky: bg('bg_kalos_route.webp'),
    label: 'Kalos — Rota 4',
    ground: '#98c060', groundAccent: '#709040',
    timeOfDay: 'day',
    elements: ['flower_lavender', 'statue_fountain', 'cloud'],
  },
  kalos_glittering_cave: {
    sky: bg('bg_kalos_glittering_cave.webp'),
    label: 'Glittering Cave',
    ground: '#1e293b', groundAccent: '#0f172a',
    timeOfDay: 'dark',
    elements: ['crystal_shard', 'cave_entrance', 'torch_glow'],
  },
  kalos_reflection_cave: {
    sky: bg('bg_kalos_cave.webp'),
    label: 'Reflection Cave',
    ground: '#334155', groundAccent: '#1e293b',
    timeOfDay: 'dramatic',
    elements: ['mirror_wall', 'crystal_pillar', 'blue_mist'],
  },
  kalos_azure_bay: {
    sky: bg('bg_kalos_azure_bay.webp'),
    label: 'Azure Bay',
    ground: '#0e7490', groundAccent: '#155e75',
    timeOfDay: 'day',
    elements: ['ocean_wave', 'rock_arch', 'sea_spray'],
  },
  kalos_frost_cavern: {
    sky: bg('bg_kalos_frost_cavern.webp'),
    label: 'Frost Cavern',
    ground: '#f1f5f9', groundAccent: '#cbd5e1',
    timeOfDay: 'ice',
    elements: ['ice_stalactite', 'snow_drift', 'cold_breath'],
  },
  kalos_route_17: {
    sky: bg('bg_kalos_snowbelle.webp'),
    label: 'Kalos — Rota 17',
    ground: '#f1f5f9', groundAccent: '#cbd5e1',
    timeOfDay: 'ice',
    elements: ['mamoswine_track', 'snow_storm', 'frozen_rock'],
  },
  kalos_victory_road: {
    sky: bg('bg_kalos_victory_road.webp'),
    label: 'Victory Road Kalos',
    ground: '#334155', groundAccent: '#1e293b',
    timeOfDay: 'epic_cave',
    elements: ['league_gate', 'ancient_pillar', 'torch_fire'],
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

  // --- REGIONAL GENERICS ---
  kanto_generic: { sky: bg('bg_kanto_grass.webp'), label: 'Kanto', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'day', elements: ['tall_grass', 'oak_tree'] },
  johto_generic: { sky: bg('bg_new_bark_town.webp'), label: 'Johto', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'day', elements: ['tall_grass', 'shrine'] },
  hoenn_generic: { sky: bg('bg_hoenn_route.webp'), label: 'Hoenn', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'day', elements: ['tall_grass', 'tropical_leaf'] },
  sinnoh_generic: { sky: bg('bg_sinnoh_route.webp'), label: 'Sinnoh', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'day', elements: ['tall_grass', 'pine_tree'] },
  unova_generic: { sky: bg('bg_unova_route.webp'), label: 'Unova', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'day', elements: ['tall_grass', 'city_distant'] },
  kalos_generic: { sky: bg('bg_kalos_route.webp'), label: 'Kalos', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'day', elements: ['tall_grass', 'flower_lavender'] },
  alola_generic: { sky: bg('bg_alola_route.webp'), label: 'Alola', ground: '#e0d0a0', groundAccent: '#c0b080', timeOfDay: 'day', elements: ['palm_tree', 'ocean_view'] },
  galar_generic: { sky: bg('bg_galar_route.webp'), label: 'Galar', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'overcast', elements: ['windmill', 'stone_wall'] },
  paldea_generic: { sky: bg('bg_paldea_route.webp'), label: 'Paldea', ground: '#c0b870', groundAccent: '#908850', timeOfDay: 'day', elements: ['olive_tree', 'mountain_range'] },
  hisui_generic: { sky: bg('bg_hisui_fieldlands.webp'), label: 'Hisui', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'day', elements: ['ancient_tree', 'tall_grass'] },

  // --- REGIONAL BIOMES (Fallbacks) ---
  unova_cave:   { sky: bg('bg_unova_cave.webp'), label: 'Caverna de Unova', ground: '#1e293b', groundAccent: '#0f172a', timeOfDay: 'dark', elements: ['stalactite', 'cave_entrance'] },
  unova_forest: { sky: bg('bg_unova_forest.webp'), label: 'Floresta de Unova', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'day', elements: ['tall_tree', 'forest_mist'] },
  unova_league: { sky: bg('bg_unova_elite.webp'), label: 'Liga Unova', ground: '#334155', groundAccent: '#1e293b', timeOfDay: 'league', elements: ['league_pillar', 'gold_star'] },
  unova_desert: { sky: bg('bg_unova_desert.webp'), label: 'Deserto de Unova', ground: '#d4a373', groundAccent: '#a98467', timeOfDay: 'day', elements: ['cactus', 'sand_dune'] },
  unova_chargestone: { sky: bg('bg_unova_chargestone.webp'), label: 'Chargestone Cave', ground: '#1e293b', groundAccent: '#0f172a', timeOfDay: 'dark', elements: ['crystal_shard', 'electric_spark'] },
  unova_ice: { sky: bg('bg_unova_ice.webp'), label: 'Montanha de Gelo', ground: '#f1f5f9', groundAccent: '#cbd5e1', timeOfDay: 'ice', elements: ['ice_stalactite', 'snow_drift'] },
  
  kalos_cave:   { sky: bg('bg_kalos_cave.webp'), label: 'Caverna de Kalos', ground: '#1e293b', groundAccent: '#0f172a', timeOfDay: 'dark', elements: ['crystal_shard', 'cave_entrance'] },
  kalos_forest: { sky: bg('bg_kalos_forest.webp'), label: 'Floresta de Kalos', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'day', elements: ['tall_tree', 'forest_mist'] },
  kalos_league: { sky: bg('bg_kalos_elite.webp'), label: 'Liga Kalos', ground: '#334155', groundAccent: '#1e293b', timeOfDay: 'league', elements: ['league_pillar', 'gold_star'] },

  alola_verdant_cavern: { sky: bg('bg_alola_verdant_cavern.webp'), label: 'Verdant Cavern', ground: '#1e293b', groundAccent: '#0f172a', timeOfDay: 'dark', elements: ['palm_tree', 'cave_entrance'] },
  alola_akala_island: { sky: bg('bg_alola_akala.webp'), label: 'Akala Island', ground: '#e0d0a0', groundAccent: '#c0b080', timeOfDay: 'day', elements: ['palm_tree', 'ocean_view'] },
  alola_ula_ula_island: { sky: bg('bg_alola_ula_ula.webp'), label: "Ula'ula Island", ground: '#1e1b4b', groundAccent: '#312e81', timeOfDay: 'night', elements: ['graffiti_wall', 'volcanic_smoke'] },
  alola_vast_poni_canyon: { sky: bg('bg_alola_poni_canyon.webp'), label: 'Vast Poni Canyon', ground: '#7c2d12', groundAccent: '#431407', timeOfDay: 'dramatic', elements: ['ancient_pillar', 'sharp_rock'] },
  alola_mount_lanakila: { sky: bg('bg_alola_lanakila.webp'), label: 'Mount Lanakila', ground: '#f1f5f9', groundAccent: '#cbd5e1', timeOfDay: 'ice', elements: ['ice_crystal', 'snow_drift'] },
  alola_cave:   { sky: bg('bg_alola_verdant_cavern.webp'), label: 'Caverna de Alola', ground: '#1e293b', groundAccent: '#0f172a', timeOfDay: 'dark', elements: ['palm_tree', 'cave_entrance'] },
  alola_volcano: { sky: bg('bg_alola_volcano.webp'), label: 'Vulcão de Alola', ground: '#450a0a', groundAccent: '#7f1d1d', timeOfDay: 'sunset', elements: ['fire_pillar', 'lava_pool'] },
  alola_aether: { sky: bg('bg_alola_aether.webp'), label: 'Aether Paradise', ground: '#f8fafc', groundAccent: '#f1f5f9', timeOfDay: 'indoor_tech', elements: ['glass_wall', 'server_rack'] },

  galar_wild_area_south: { sky: bg('bg_galar_wild_area.webp'), label: 'Wild Area', ground: '#4d7c0f', groundAccent: '#365314', timeOfDay: 'overcast', elements: ['windmill', 'stone_wall'] },
  galar_mine_1: { sky: bg('bg_galar_mine.webp'), label: 'Galar Mine', ground: '#1e293b', groundAccent: '#0f172a', timeOfDay: 'dark', elements: ['mine_cart', 'cave_entrance'] },
  galar_route_5: { sky: bg('bg_galar_hulbury.webp'), label: 'Hulbury Area', ground: '#0e7490', groundAccent: '#155e75', timeOfDay: 'overcast', elements: ['ocean_wave', 'lighthouse'] },
  galar_route_9: { sky: bg('bg_galar_circhester.webp'), label: 'Circhester Area', ground: '#f1f5f9', groundAccent: '#cbd5e1', timeOfDay: 'ice', elements: ['ice_crystal', 'snow_drift'] },
  galar_victory_road: { sky: bg('bg_galar_rose_tower.webp'), label: 'Rose Tower', ground: '#0f172a', groundAccent: '#020617', timeOfDay: 'night', elements: ['neon_light', 'city_view'] },
  galar_cave:   { sky: bg('bg_galar_mine.webp'), label: 'Caverna de Galar', ground: '#1e293b', groundAccent: '#0f172a', timeOfDay: 'dark', elements: ['windmill', 'cave_entrance'] },
  galar_tundra: { sky: bg('bg_galar_tundra.webp'), label: 'Crown Tundra', ground: '#f1f5f9', groundAccent: '#cbd5e1', timeOfDay: 'ice', elements: ['ice_crystal', 'snow_storm'] },

  poco_path: { sky: bg('bg_paldea_poco_path.webp'), label: 'Poco Path', ground: '#c0b870', groundAccent: '#908850', timeOfDay: 'day', elements: ['olive_tree', 'ocean_view'] },
  paldea_artazon: { sky: bg('bg_paldea_artazon.webp'), label: 'Artazon', ground: '#d9a441', groundAccent: '#a16207', timeOfDay: 'day', elements: ['flower', 'statue_fountain'] },
  paldea_medali: { sky: bg('bg_paldea_medali.webp'), label: 'Medali', ground: '#d0c0a0', groundAccent: '#b0a080', timeOfDay: 'day', elements: ['plaza_fountain', 'tiled_roof'] },
  paldea_glaseado_mountain: { sky: bg('bg_paldea_glaseado.webp'), label: 'Glaseado Mountain', ground: '#f1f5f9', groundAccent: '#cbd5e1', timeOfDay: 'ice', elements: ['ice_crystal', 'snow_storm'] },
  paldea_area_zero: { sky: bg('bg_paldea_area_zero.webp'), label: 'Area Zero', ground: '#1e1b4b', groundAccent: '#312e81', timeOfDay: 'legendary', elements: ['crystal_glow', 'ancient_rune'] },
  paldea_cave:  { sky: bg('bg_paldea_area_zero.webp'), label: 'Caverna de Paldea', ground: '#1e293b', groundAccent: '#0f172a', timeOfDay: 'dark', elements: ['olive_tree', 'cave_entrance'] },
  paldea_desert: { sky: bg('bg_paldea_desert.webp'), label: 'Deserto de Paldea', ground: '#d4a373', groundAccent: '#a98467', timeOfDay: 'day', elements: ['cactus', 'sand_dune'] },

  hisui_sacred_plaza: { sky: bg('bg_hisui_sacred_plaza.webp'), label: 'Praça Sagrada', ground: '#140028', groundAccent: '#080010', timeOfDay: 'legendary', elements: ['ancient_pillar', 'celestial_light'] },

  // --- VILLAIN TEAMS ---
  villain_galactic: {
    sky: bg('bg_sinnoh_league.webp'),
    label: 'Base Galáctica',
    ground: '#1e293b', groundAccent: '#0f172a',
    timeOfDay: 'dark',
    elements: ['space_portal', 'nebula_mist', 'tech_column'],
  },
  villain_plasma: {
    sky: bg('bg_unova_elite.webp'),
    label: 'Fragata Plasma',
    ground: '#334155', groundAccent: '#1e293b',
    timeOfDay: 'dark',
    elements: ['plasma_engine', 'ice_shard', 'tech_beam'],
  },
  villain_flare: {
    sky: bg('bg_kalos_cave.webp'),
    label: 'QG Flare',
    ground: '#450a0a', groundAccent: '#7f1d1d',
    timeOfDay: 'sunset',
    elements: ['fire_pillar', 'energy_core', 'red_glow'],
  },
  villain_skull: {
    sky: bg('bg_alola_route.webp'),
    label: 'Po Town',
    ground: '#1e1b4b', groundAccent: '#312e81',
    timeOfDay: 'night',
    elements: ['graffiti_wall', 'skull_flag', 'street_lamp'],
  },
  villain_yell: {
    sky: bg('bg_galar_city.webp'),
    label: 'Spikemuth',
    ground: '#500724', groundAccent: '#831843',
    timeOfDay: 'night',
    elements: ['neon_pink', 'punk_fence', 'concert_speaker'],
  },
  villain_star: {
    sky: bg('bg_paldea_city.webp'),
    label: 'Base Star',
    ground: '#0c4a6e', groundAccent: '#075985',
    timeOfDay: 'day',
    elements: ['star_flag', 'tent_base', 'colored_smoke'],
  },

  // --- LEAGUES ---
  league_sinnoh: {
    sky: bg('bg_sinnoh_league.webp'),
    label: 'Liga Sinnoh',
    ground: '#1e3a8a', groundAccent: '#1e40af',
    timeOfDay: 'league',
    elements: ['league_pillar', 'gold_star', 'championship_banner'],
  },
  sinnoh_gym: {
    sky: bg('bg_sinnoh_gym.webp'),
    label: 'Ginásio de Sinnoh',
    ground: '#334155', groundAccent: '#1e293b',
    timeOfDay: 'day',
    elements: ['gym_statue', 'arena_light', 'type_banner'],
  },

  // --- HISUI ---
  hisui_fieldlands: {
    sky: bg('bg_hisui_fieldlands.webp'),
    label: 'Hisui — Campos Obsidiana',
    ground: '#4d7c0f', groundAccent: '#365314',
    timeOfDay: 'day',
    elements: ['ancient_tree', 'tall_grass', 'mt_coronet_distant'],
  },
  hisui_mirelands: {
    sky: bg('bg_hisui_mirelands.webp'),
    label: 'Hisui — Pântanos Carmesim',
    ground: '#78350f', groundAccent: '#451a03',
    timeOfDay: 'overcast',
    elements: ['mud_puddle', 'crimson_leaf', 'mist'],
  },
  hisui_coastlands: {
    sky: bg('bg_hisui_coastlands.webp'),
    label: 'Hisui — Costa Cobalto',
    ground: '#0e7490', groundAccent: '#155e75',
    timeOfDay: 'day',
    elements: ['ocean_wave', 'sand_dune', 'sea_shell'],
  },
  hisui_highlands: {
    sky: bg('bg_hisui_highlands.webp'),
    label: 'Hisui — Terras Altas Coronet',
    ground: '#334155', groundAccent: '#1e293b',
    timeOfDay: 'dramatic',
    elements: ['sharp_rock', 'mountain_cliff', 'cloud_storm'],
  },
  hisui_icelands: {
    sky: bg('bg_hisui_icelands.webp'),
    label: 'Hisui — Gelos Alabastro',
    ground: '#f1f5f9', groundAccent: '#cbd5e1',
    timeOfDay: 'ice',
    elements: ['ice_crystal', 'snow_drift', 'frozen_lake'],
  },
};

/**
 * Retorna o objeto de background para uma dada rota.
 * Fallback para route_1 (campo aberto).
 */
export function getRouteBg(routeId) {
  if (!routeId) return BATTLE_BACKGROUNDS.route_1;
  if (BATTLE_BACKGROUNDS[routeId]) return BATTLE_BACKGROUNDS[routeId];
  
  // Mapeamento específico de cidades iniciais que não seguem o prefixo da região
  const SPECIAL_MAP = {
    // Kanto
    pallet_town: 'pallet_town',
    viridian_city: 'viridian_city',
    pewter_city: 'pewter_city',
    cerulean_city: 'cerulean_city',
    vermilion_city: 'vermilion_city',
    celadon_city: 'celadon_city',
    fuchsia_city: 'fuchsia_city',
    saffron_city: 'saffron_city',
    // Johto
    new_bark_town: 'johto_generic',
    cherrygrove_city: 'johto_generic',
    violet_city: 'johto_generic',
    // Hoenn
    littleroot_town: 'hoenn_generic',
    oldale_town: 'hoenn_generic',
    petalburg_city: 'hoenn_generic',
    // Sinnoh
    twinleaf_town: 'sinnoh_generic',
    sandgem_town: 'sinnoh_generic',
    jubilife_city: 'sinnoh_generic',
    // Unova
    nuvema_town: 'unova_home_town',
    striaton_city: 'unova_home_town',
    castelia_city: 'unova_home_town',
    // Kalos
    vaniville_town: 'kalos_home_town',
    santalune_city: 'kalos_home_town',
    lumiose_city: 'kalos_home_town',
    // Alola
    hauoli_city: 'alola_home_town',
    // Galar
    postwick: 'galar_home_town',
    wedgehurst: 'galar_home_town',
    // Paldea
    cabo_poco: 'paldea_home_town',
    mesagoza: 'paldea_home_town',
    // Hisui
    hisui_jubilife: 'hisui_generic',
    // Biomas Específicos
    unova_route_4: 'unova_desert',
    unova_chargestone_cave: 'unova_chargestone',
    unova_twist_mountain: 'unova_ice',
    alola_aether_paradise: 'alola_aether',
    alola_volcano_park: 'alola_volcano',
    galar_crown_tundra: 'galar_tundra',
    paldea_asado_desert: 'paldea_desert',
    hisui_sacred_plaza: 'hisui_sacred_plaza',
    // Sinnoh Especial
    valor_lakefront: 'league_sinnoh',
    sinnoh_victory_training: 'league_sinnoh',
    mt_coronet_sinnoh: 'sinnoh_generic',
    stark_mountain: 'sinnoh_generic',
    snowpoint_routes: 'hisui_icelands',
    sunyshore_routes: 'sinnoh_generic',
  };

  if (SPECIAL_MAP[routeId]) return BATTLE_BACKGROUNDS[SPECIAL_MAP[routeId]];

  const parts = routeId.split('_');
  const region = parts[0];
  
  // Fallbacks por tipo de local
  const isCity = routeId.includes('city') || routeId.includes('town');
  const isCave = routeId.includes('cave') || routeId.includes('tunnel') || routeId.includes('mountain') || routeId.includes('mine') || routeId.includes('chasm');
  const isElite = routeId.includes('league') || routeId.includes('victory_road') || routeId.includes('elite');
  const isForest = routeId.includes('forest') || routeId.includes('woods') || routeId.includes('grove');
  const isWater = routeId.includes('route_21') || routeId.includes('sea') || routeId.includes('ocean') || routeId.includes('bay') || routeId.includes('lake');

  // Busca regional temática
  if (isElite && BATTLE_BACKGROUNDS[`${region}_league`]) return BATTLE_BACKGROUNDS[`${region}_league`];
  if (isElite && BATTLE_BACKGROUNDS[`league_${region}`]) return BATTLE_BACKGROUNDS[`league_${region}`];
  if (isCity && BATTLE_BACKGROUNDS[`${region}_home_town`]) return BATTLE_BACKGROUNDS[`${region}_home_town`];
  if (isForest && BATTLE_BACKGROUNDS[`${region}_forest`]) return BATTLE_BACKGROUNDS[`${region}_forest`];
  if (isCave && BATTLE_BACKGROUNDS[`${region}_cave`]) return BATTLE_BACKGROUNDS[`${region}_cave`];

  // Fallbacks genéricos por região
  if (BATTLE_BACKGROUNDS[`${region}_generic`]) return BATTLE_BACKGROUNDS[`${region}_generic`];
  
  // Fallback final
  return BATTLE_BACKGROUNDS.route_1;
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

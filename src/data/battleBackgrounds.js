/**
 * Battle Backgrounds — Temáticos por rota de Kanto
 * Cada rota tem: gradient (CSS), overlay, groundColor e decoração visual SVG
 */

export const BATTLE_BACKGROUNDS = {

  // ─── PALLET TOWN ──────────────────────────────────────────
  pallet_town: {
    sky: 'linear-gradient(180deg, #87ceeb 0%, #b0e0ff 55%, #d4f0a0 55%, #7cb850 100%)',
    label: 'Cidade Pallet',
    ground: '#7cb850',
    groundAccent: '#5a9e3a',
    timeOfDay: 'day',
    elements: ['tree', 'tree', 'fence', 'cloud', 'cloud'],
  },

  // ─── ROTA 1 ───────────────────────────────────────────────
  route_1: {
    sky: 'linear-gradient(180deg, #74b8e8 0%, #a8d8f0 50%, #c8e88a 50%, #6ab040 100%)',
    label: 'Rota 1',
    ground: '#6ab040',
    groundAccent: '#52943a',
    timeOfDay: 'day',
    elements: ['tall_grass', 'tall_grass', 'tree', 'cloud', 'flower'],
  },

  // ─── VIRIDIAN CITY ────────────────────────────────────────
  viridian_city: {
    sky: 'linear-gradient(180deg, #7ab5e0 0%, #a0cce0 50%, #bbd87e 50%, #82b844 100%)',
    label: 'Cidade Viridian',
    ground: '#82b844',
    groundAccent: '#6a9e36',
    timeOfDay: 'day',
    elements: ['building', 'tree', 'cloud', 'fence'],
  },

  // ─── ROTA 22 ──────────────────────────────────────────────
  route_22: {
    sky: 'linear-gradient(180deg, #f4a460 0%, #e8916a 30%, #ffd700 60%, #8fbc8f 60%, #5a9e3a 100%)',
    label: 'Rota 22 — Pôr do Sol',
    ground: '#8fbc8f',
    groundAccent: '#5a9e3a',
    timeOfDay: 'sunset',
    elements: ['tree', 'tall_grass', 'mountain_small', 'cloud_orange'],
  },

  // ─── FLORESTA DE VIRIDIAN ────────────────────────────────
  viridian_forest: {
    sky: 'linear-gradient(180deg, #2d5a27 0%, #3d7a32 30%, #4a9a3d 55%, #3a6e28 55%, #2a5020 100%)',
    label: 'Floresta de Viridian',
    ground: '#3a6e28',
    groundAccent: '#2a5020',
    timeOfDay: 'forest',
    elements: ['big_tree', 'big_tree', 'big_tree', 'mushroom', 'bush', 'cobweb'],
  },

  // ─── PEWTER CITY ──────────────────────────────────────────
  pewter_city: {
    sky: 'linear-gradient(180deg, #9ba4a8 0%, #b8c0c4 45%, #a89880 45%, #8a7860 100%)',
    label: 'Cidade Pewter',
    ground: '#a89880',
    groundAccent: '#8a7860',
    timeOfDay: 'cloudy',
    elements: ['rock', 'rock', 'mountain', 'building', 'cloud_grey'],
  },

  // ─── ROTA 3 ───────────────────────────────────────────────
  route_3: {
    sky: 'linear-gradient(180deg, #87ceeb 0%, #a8d8ee 50%, #c0d880 50%, #8ab850 100%)',
    label: 'Rota 3',
    ground: '#c0d880',
    groundAccent: '#8ab850',
    timeOfDay: 'day',
    elements: ['mountain_small', 'tree', 'tall_grass', 'cloud', 'rock'],
  },

  // ─── MT. MOON ─────────────────────────────────────────────
  mt_moon: {
    sky: 'linear-gradient(180deg, #1a1a2e 0%, #162040 40%, #2a2a4a 70%, #3a3050 70%, #252035 100%)',
    label: 'Mt. Moon',
    ground: '#3a3050',
    groundAccent: '#252035',
    timeOfDay: 'cave',
    elements: ['stalactite', 'stalactite', 'stalactite', 'moon_rock', 'moon_rock', 'cave_glow'],
  },

  // ─── CERULEAN CITY ────────────────────────────────────────
  cerulean_city: {
    sky: 'linear-gradient(180deg, #5ba3d0 0%, #7ec8e8 45%, #c0e4f0 45%, #a0d0e0 100%)',
    label: 'Cerulean — Beira-Rio',
    ground: '#c0e4f0',
    groundAccent: '#a0d0e0',
    timeOfDay: 'day',
    elements: ['water', 'water', 'cloud', 'flower_blue', 'bridge_plank'],
  },

  // ─── ROTA 24/25 ──────────────────────────────────────────
  route_24_25: {
    sky: 'linear-gradient(180deg, #5ba8d8 0%, #8bc4e8 45%, #98d488 45%, #5aaa40 100%)',
    label: 'Rota do Cabo Cerulean',
    ground: '#98d488',
    groundAccent: '#5aaa40',
    timeOfDay: 'day',
    elements: ['water', 'lily_pad', 'tall_grass', 'flower', 'cloud'],
  },

  // ─── ROTA 5/6 ─────────────────────────────────────────────
  route_5_6: {
    sky: 'linear-gradient(180deg, #80c0e8 0%, #a8d8f0 50%, #b8e090 50%, #78b848 100%)',
    label: 'Rota 5-6',
    ground: '#b8e090',
    groundAccent: '#78b848',
    timeOfDay: 'day',
    elements: ['tree', 'tall_grass', 'fence', 'flower', 'cloud'],
  },

  // ─── S.S. ANNE ────────────────────────────────────────────
  ss_anne: {
    sky: 'linear-gradient(180deg, #1a3a5c 0%, #1e4a70 40%, #2060a0 70%, #0a4878 70%, #053060 100%)',
    label: 'S.S. Anne',
    ground: '#0a4878',
    groundAccent: '#053060',
    timeOfDay: 'ocean_night',
    elements: ['ocean_wave', 'ocean_wave', 'ship_hull', 'ship_window', 'ship_window', 'star_sea'],
  },

  // ─── VERMILION CITY ───────────────────────────────────────
  vermilion_city: {
    sky: 'linear-gradient(180deg, #4a90b8 0%, #6ab0d0 45%, #b0d8e0 45%, #90c0d0 100%)',
    label: 'Vermilion — Porto',
    ground: '#b0d8e0',
    groundAccent: '#90c0d0',
    timeOfDay: 'day',
    elements: ['port_crane', 'ocean_small', 'cloud', 'building', 'lighthouse'],
  },

  // ─── ROTA 9/10 ─────────────────────────────────────────────
  route_9_10: {
    sky: 'linear-gradient(180deg, #709880 0%, #90b898 40%, #a8c888 55%, #80a860 55%, #507840 100%)',
    label: 'Rota 9-10',
    ground: '#80a860',
    groundAccent: '#507840',
    timeOfDay: 'overcast',
    elements: ['cliff', 'cliff', 'tree', 'tall_grass', 'cloud_grey'],
  },

  // ─── ROCK TUNNEL ──────────────────────────────────────────
  rock_tunnel: {
    sky: 'linear-gradient(180deg, #0d0d0d 0%, #1a1210 40%, #2a2018 60%, #1e1810 60%, #120e0a 100%)',
    label: 'Rock Tunnel — Escuridão',
    ground: '#1e1810',
    groundAccent: '#120e0a',
    timeOfDay: 'dark_cave',
    elements: ['stalactite', 'stalactite', 'stalactite_big', 'rock', 'rock', 'torch_glow'],
  },

  // ─── TORRE POKÉMON ────────────────────────────────────────
  pokemon_tower: {
    sky: 'linear-gradient(180deg, #1a0a2a 0%, #2a1040 40%, #3a1a50 65%, #200a38 65%, #10041e 100%)',
    label: 'Torre Pokémon',
    ground: '#200a38',
    groundAccent: '#10041e',
    timeOfDay: 'haunted',
    elements: ['ghost_mist', 'ghost_mist', 'gravestone', 'gravestone', 'dead_tree', 'purple_glow'],
  },

  // ─── ROTA 7/8 ─────────────────────────────────────────────
  route_7_8: {
    sky: 'linear-gradient(180deg, #88b8e0 0%, #a8cce8 50%, #c8e890 50%, #88b850 100%)',
    label: 'Rota 7-8',
    ground: '#c8e890',
    groundAccent: '#88b850',
    timeOfDay: 'day',
    elements: ['tree', 'tall_grass', 'tall_grass', 'flower', 'cloud'],
  },

  // ─── QG DA EQUIPE ROCKET ──────────────────────────────────
  rocket_hideout: {
    sky: 'linear-gradient(180deg, #1a1a1a 0%, #2a2020 35%, #3a2828 60%, #282020 60%, #181010 100%)',
    label: 'QG Rocket',
    ground: '#282020',
    groundAccent: '#181010',
    timeOfDay: 'bunker',
    elements: ['metal_wall', 'metal_wall', 'red_light', 'rocket_crate', 'danger_stripe'],
  },

  // ─── CELADON CITY ─────────────────────────────────────────
  celadon_city: {
    sky: 'linear-gradient(180deg, #78b890 0%, #98c8a8 45%, #a8d890 45%, #68a860 100%)',
    label: 'Celadon — Jardins',
    ground: '#a8d890',
    groundAccent: '#68a860',
    timeOfDay: 'day',
    elements: ['flower', 'flower', 'flower', 'tree', 'cloud', 'butterfly'],
  },

  // ─── ROTA 12-15 ────────────────────────────────────────────
  route_12_15: {
    sky: 'linear-gradient(180deg, #5898c0 0%, #78b0d0 45%, #90d890 45%, #50a050 100%)',
    label: 'Rota Leste',
    ground: '#90d890',
    groundAccent: '#50a050',
    timeOfDay: 'day',
    elements: ['water', 'lily_pad', 'tree', 'tall_grass', 'cloud'],
  },

  // ─── SAFARI ZONE ──────────────────────────────────────────
  safari_zone: {
    sky: 'linear-gradient(180deg, #68b878 0%, #80d090 35%, #98e0a0 55%, #70b878 55%, #58a060 100%)',
    label: 'Zona Safari',
    ground: '#70b878',
    groundAccent: '#58a060',
    timeOfDay: 'savanna',
    elements: ['safari_rock', 'tall_grass', 'big_tree', 'water_hole', 'safari_sign'],
  },

  // ─── FUCHSIA CITY ─────────────────────────────────────────
  fuchsia_city: {
    sky: 'linear-gradient(180deg, #c880c8 0%, #d8a0d0 40%, #e0c0e0 60%, #b870b0 60%, #903090 100%)',
    label: 'Fuchsia — Ginásio do Veneno',
    ground: '#b870b0',
    groundAccent: '#903090',
    timeOfDay: 'purple_haze',
    elements: ['poison_cloud', 'poison_cloud', 'flower_purple', 'ninja_wall'],
  },

  // ─── SILPH CO. ─────────────────────────────────────────────
  silph_co: {
    sky: 'linear-gradient(180deg, #1e2840 0%, #2a3a58 40%, #384878 65%, #243058 65%, #141e3a 100%)',
    label: 'Silph Co. — Arranha-Céu',
    ground: '#243058',
    groundAccent: '#141e3a',
    timeOfDay: 'indoor_tech',
    elements: ['office_window', 'office_window', 'server_rack', 'neon_light', 'city_view'],
  },

  // ─── SAFFRON CITY ─────────────────────────────────────────
  saffron_city: {
    sky: 'linear-gradient(180deg, #e040a0 0%, #f070b8 35%, #ffa0d0 60%, #d83090 60%, #a01870 100%)',
    label: 'Saffron — Arena Psíquica',
    ground: '#d83090',
    groundAccent: '#a01870',
    timeOfDay: 'psychic',
    elements: ['psychic_orb', 'psychic_orb', 'mirror_panel', 'mirror_panel', 'psychic_wave'],
  },

  // ─── CYCLING ROAD (ROTA 16-18) ────────────────────────────
  route_16_18: {
    sky: 'linear-gradient(180deg, #90c8e8 0%, #b0d8f0 45%, #d0e8a8 45%, #90c060 100%)',
    label: 'Cycling Road',
    ground: '#d0e8a8',
    groundAccent: '#90c060',
    timeOfDay: 'breezy',
    elements: ['windmill', 'tree', 'bike_path', 'cloud', 'cloud'],
  },

  // ─── MANSÃO POKÉMON ───────────────────────────────────────
  pokemon_mansion: {
    sky: 'linear-gradient(180deg, #1a0808 0%, #2a1010 40%, #3a1818 65%, #281010 65%, #180808 100%)',
    label: 'Mansão Pokémon',
    ground: '#281010',
    groundAccent: '#180808',
    timeOfDay: 'mansion',
    elements: ['broken_wall', 'broken_wall', 'flame_torch', 'flame_torch', 'cracked_floor', 'dead_plant'],
  },

  // ─── CINNABAR ISLAND ──────────────────────────────────────
  cinnabar_island: {
    sky: 'linear-gradient(180deg, #c04000 0%, #e06820 35%, #ff9040 60%, #d06030 60%, #a04018 100%)',
    label: 'Ilha Cinnabar — Vulcão',
    ground: '#d06030',
    groundAccent: '#a04018',
    timeOfDay: 'volcanic',
    elements: ['lava_pool', 'lava_pool', 'volcano_smoke', 'ash_cloud', 'magma_rock'],
  },

  // ─── ROTA 23 (VICTORY ROAD EXTERIOR) ─────────────────────
  route_22_23: {
    sky: 'linear-gradient(180deg, #6070a0 0%, #808ab8 40%, #9898c0 65%, #707098 65%, #505078 100%)',
    label: 'Rota 23 — Caminho da Vitória',
    ground: '#707098',
    groundAccent: '#505078',
    timeOfDay: 'dramatic',
    elements: ['tall_cliff', 'tall_cliff', 'waterfall', 'rock', 'cloud_dark'],
  },

  // ─── GINÁSIO DE VIRIDIAN ──────────────────────────────────
  viridian_gym: {
    sky: 'linear-gradient(180deg, #3a2a1a 0%, #5a3a2a 40%, #7a4a30 65%, #4a3020 65%, #2a1a10 100%)',
    label: 'Ginásio de Viridian — Terra',
    ground: '#4a3020',
    groundAccent: '#2a1a10',
    timeOfDay: 'ground_gym',
    elements: ['earth_crack', 'earth_crack', 'rock', 'rock', 'sand_swirl'],
  },

  // ─── VICTORY ROAD ─────────────────────────────────────────
  victory_road: {
    sky: 'linear-gradient(180deg, #0a0a18 0%, #101828 35%, #181f38 60%, #0c1220 60%, #06080e 100%)',
    label: 'Victory Road',
    ground: '#0c1220',
    groundAccent: '#06080e',
    timeOfDay: 'epic_cave',
    elements: ['epic_stalactite', 'epic_stalactite', 'crystal_glow', 'crystal_glow', 'torch_glow', 'boulder'],
  },

  // ─── PLATEAU INDIGO ───────────────────────────────────────
  indigo_plateau: {
    sky: 'linear-gradient(180deg, #0a0018 0%, #180030 40%, #280050 65%, #140028 65%, #080010 100%)',
    label: 'Plateau Indigo — Liga Pokémon',
    ground: '#140028',
    groundAccent: '#080010',
    timeOfDay: 'league',
    elements: ['league_pillar', 'league_pillar', 'golden_star', 'golden_star', 'trophy_glow', 'confetti'],
  },

  // ─── CAVERNA CERULEAN ─────────────────────────────────────
  cerulean_cave: {
    sky: 'linear-gradient(180deg, #080820 0%, #101030 40%, #181848 60%, #0c0c28 60%, #060614 100%)',
    label: 'Caverna Cerulean — Lair de Mewtwo',
    ground: '#0c0c28',
    groundAccent: '#060614',
    timeOfDay: 'legendary',
    elements: ['purple_crystal', 'purple_crystal', 'mewtwo_glow', 'dark_mist', 'ancient_rune'],
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

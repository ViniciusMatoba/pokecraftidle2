// Sistema de Expediçíµes — desbloqueadas por badge de ginásio
// Badge 1 (Brock)    → Floresta de Viridian
// Badge 2 (Misty)    → Oceano Cerulean
// Badge 3 (Surge)    → Campo Lutador
// Badge 4 (Erika)    → Safari Zone
// Badge 5 (Koga)     → Torre Pokémon
// Badge 6 (Sabrina)  → Templo Psíquico
// Badge 7 (Blaine)   → Vulcão de Cinnabar
// Badge 8 (Giovanni) → Selva do Dragão
import { getBadgeCount } from '../utils/progress';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const expBg = (file, fallback = '#1a1a2e') =>
  `${fallback} url('${BASE}/${file}') center/cover no-repeat`;

const REGION_BADGES = {
  johto: ['zephyr_badge', 'hive_badge', 'plain_badge', 'fog_badge', 'storm_badge', 'mineral_badge', 'glacier_badge', 'rising_badge'],
  hoenn: ['stone_badge', 'knuckle_badge', 'dynamo_badge', 'heat_badge', 'balance_badge', 'feather_badge', 'mind_badge', 'rain_badge'],
  sinnoh: ['coal_badge', 'forest_badge', 'cobble_badge', 'fen_badge', 'relic_badge', 'mine_badge', 'icicle_badge', 'beacon_badge'],
};

export const EXPEDITION_REGIONS = [
  { id: 'kanto', label: 'Kanto', unlockFlag: null, maxGeneration: 1 },
  { id: 'johto', label: 'Johto', unlockFlag: 'johto_started', maxGeneration: 2 },
  { id: 'hoenn', label: 'Hoenn', unlockFlag: 'hoenn_started', maxGeneration: 3 },
  { id: 'sinnoh', label: 'Sinnoh', unlockFlag: 'sinnoh_started', maxGeneration: 4 },
  { id: 'unova', label: 'Unova', unlockFlag: 'unova_started', maxGeneration: 5 },
  { id: 'kalos', label: 'Kalos', unlockFlag: 'kalos_started', maxGeneration: 6 },
  { id: 'alola', label: 'Alola', unlockFlag: 'alola_started', maxGeneration: 7 },
  { id: 'galar', label: 'Galar', unlockFlag: 'galar_started', maxGeneration: 8 },
  { id: 'paldea', label: 'Paldea', unlockFlag: 'paldea_started', maxGeneration: 9 },
];

const regionStarted = (gameState, region) => {
  if (region === 'kanto') return true;
  const flags = gameState.worldFlags || [];
  return flags.includes(`${region}_started`) || gameState.activeRegion === region;
};

const getRegionBadgeCount = (gameState, region) => {
  if (region === 'kanto') return getBadgeCount(gameState);
  const badgeSet = new Set(gameState.badges || []);
  return (REGION_BADGES[region] || []).filter(id => badgeSet.has(id) || (gameState.worldFlags || []).includes(id)).length;
};

export const EXPEDITION_BIOMES = {

  floresta: {
    id: 'floresta',
    name: 'Floresta de Viridian',
    badge: 1,
    badgeName: 'Insígnia da Rocha',
    leaderName: 'Brock',
    icon: '🌲',
    imagePrompt: 'floresta_viridian',
    bg: expBg('expedition_floresta.png', '#1a3a1a'),
    description: 'Rica em Seda, Apricorns e Essências de Inseto.',
    enemyType: ['Bug', 'Grass', 'Poison'],
    favoredTypes: ['Fire', 'Flying', 'Bug', 'Poison'],
    neutralTypes: ['Normal', 'Electric', 'Psychic'],
    requires: 1,
    baseDuration: 30,
    drops: {
      common:   ['silk', 'apricorn', 'bug_essence', 'grass_essence'],
      uncommon: ['poison_essence', 'normal_essence'],
      rare:     ['moon_stone_shard', 'leaf_stone'],
    },
    xpPerMinute: 12,
  },

  oceano: {
    id: 'oceano',
    name: 'Oceano Cerulean',
    badge: 2,
    badgeName: 'Insígnia da Cascata',
    leaderName: 'Misty',
    icon: '🌊',
    imagePrompt: 'oceano_cerulean',
    bg: expBg('expedition_oceano.png', '#0a2a4a'),
    description: 'Essências de Água, Pérolas e itens marinhos.',
    enemyType: ['Water', 'Ice'],
    favoredTypes: ['Electric', 'Grass'],
    neutralTypes: ['Normal', 'Flying', 'Psychic'],
    requires: 2,
    baseDuration: 40,
    drops: {
      common:   ['water_essence', 'mystic_water', 'normal_essence'],
      uncommon: ['water_stone', 'pink_dust'],
      rare:     ['pearl', 'dragon_scale'],
    },
    xpPerMinute: 15,
  },

  campo_lutador: {
    id: 'campo_lutador',
    name: 'Dojo de Saffron',
    badge: 3,
    badgeName: 'Insígnia do Trovão',
    leaderName: 'Lt. Surge',
    icon: '👊',
    imagePrompt: 'dojo_lutador',
    bg: expBg('expedition_campo_lutador.png', '#3a2a1a'),
    description: 'Itens de Luta, Black Belt e Muscle Band.',
    enemyType: ['Fighting', 'Normal'],
    favoredTypes: ['Flying', 'Psychic', 'Fairy'],
    neutralTypes: ['Rock', 'Steel', 'Water'],
    requires: 3,
    baseDuration: 40,
    drops: {
      common:   ['fighting_essence', 'normal_essence'],
      uncommon: ['black_belt', 'iron_ore'],
      rare:     ['muscle_band', 'expert_belt_shard'],
    },
    xpPerMinute: 20,
  },

  pradaria: {
    id: 'pradaria',
    name: 'Safari Zone',
    badge: 4,
    badgeName: 'Insígnia do Arco-Íris',
    leaderName: 'Erika',
    icon: '🌿',
    imagePrompt: 'safari_zone',
    bg: expBg('expedition_pradaria.png', '#1a3a1a'),
    description: 'Penas, Pó Rosa e itens raros de safári.',
    enemyType: ['Normal', 'Flying', 'Ground'],
    favoredTypes: ['Electric', 'Poison', 'Bug', 'Fighting'],
    neutralTypes: ['Water', 'Grass', 'Ice'],
    requires: 4,
    baseDuration: 45,
    drops: {
      common:   ['normal_essence', 'feather', 'pink_dust'],
      uncommon: ['gold_nugget', 'apricorn'],
      rare:     ['lucky_egg', 'amulet_coin_shard'],
    },
    xpPerMinute: 22,
  },

  torre_fantasma: {
    id: 'torre_fantasma',
    name: 'Torre Pokémon',
    badge: 5,
    badgeName: 'Insígnia da Alma',
    leaderName: 'Koga',
    icon: '👻',
    imagePrompt: 'torre_pokemon_fantasma',
    bg: expBg('expedition_torre_fantasma.png', '#1a0a2a'),
    description: 'Fragmentos Espectrais e Itens Amaldiçoados.',
    enemyType: ['Ghost', 'Poison', 'Dark'],
    favoredTypes: ['Dark', 'Ghost', 'Normal', 'Psychic'],
    neutralTypes: ['Flying', 'Bug'],
    requires: 5,
    baseDuration: 50,
    drops: {
      common:   ['ghost_essence', 'poison_essence', 'ghost_shard'],
      uncommon: ['psychic_essence', 'mystic_dust'],
      rare:     ['spell_tag', 'dread_plate'],
    },
    xpPerMinute: 22,
  },

  templo_psiquico: {
    id: 'templo_psiquico',
    name: 'Templo Psíquico de Saffron',
    badge: 6,
    badgeName: 'Insígnia do Pântano',
    leaderName: 'Sabrina',
    icon: '🟡',
    imagePrompt: 'templo_psiquico_saffron',
    bg: expBg('expedition_templo_psiquico.png', '#2a1a3a'),
    description: 'Essências Psíquicas, TM Shards e Itens Mentais.',
    enemyType: ['Psychic', 'Fairy'],
    favoredTypes: ['Ghost', 'Dark', 'Bug', 'Steel'],
    neutralTypes: ['Normal', 'Ground'],
    requires: 6,
    baseDuration: 55,
    drops: {
      common:   ['psychic_essence', 'mystic_dust'],
      uncommon: ['twist_spoon', 'mind_shard'],
      rare:     ['tm_shard_psychic', 'link_cable_shard'],
    },
    xpPerMinute: 23,
  },

  vulcao: {
    id: 'vulcao',
    name: 'Vulcão de Cinnabar',
    badge: 7,
    badgeName: 'Insígnia do Vulcão',
    leaderName: 'Blaine',
    icon: '🔥',
    imagePrompt: 'vulcao_cinnabar',
    bg: expBg('expedition_vulcao.png', '#3a1a0a'),
    description: 'Essências de Fogo, Pedras Fogo e Carvão.',
    enemyType: ['Fire', 'Rock'],
    favoredTypes: ['Water', 'Ground', 'Rock'],
    neutralTypes: ['Normal', 'Fighting', 'Electric'],
    requires: 7,
    baseDuration: 60,
    drops: {
      common:   ['fire_essence', 'rock_essence', 'iron_ore'],
      uncommon: ['fire_stone', 'charcoal'],
      rare:     ['lava_cookie', 'sun_stone'],
    },
    xpPerMinute: 24,
  },

  selva_dragao: {
    id: 'selva_dragao',
    name: 'Victory Road — Selva do Dragão',
    badge: 8,
    badgeName: 'Insígnia da Terra',
    leaderName: 'Giovanni',
    icon: '🐉',
    imagePrompt: 'selva_dragao_victory_road',
    bg: expBg('expedition_selva_dragao.png', '#0a1a2a'),
    description: 'Escamas de Dragão e itens lendários.',
    enemyType: ['Dragon', 'Flying', 'Rock'],
    favoredTypes: ['Ice', 'Dragon', 'Fairy', 'Steel'],
    neutralTypes: ['Electric', 'Psychic'],
    requires: 8,
    baseDuration: 90,
    drops: {
      common:   ['dragon_essence', 'rock_essence', 'flying_essence'],
      uncommon: ['dragon_scale', 'dragon_fang'],
      rare:     ['draco_shard', 'tm_shard_dragon'],
    },
    xpPerMinute: 18,
  },

  johto_ilex: {
    id: 'johto_ilex', region: 'johto', name: 'Ilex Forest', badge: 2, leaderName: 'Bugsy', icon: 'IF',
    bg: expBg('bg_ilex_forest.png', '#1a3a1a'), description: 'Madeira sagrada, Apricorns e essencias de Johto.',
    enemyType: ['Bug', 'Grass', 'Poison'], favoredTypes: ['Fire', 'Flying', 'Bug'], neutralTypes: ['Normal', 'Psychic', 'Steel'],
    requires: 2, baseDuration: 45, drops: { common: ['apricorn', 'silk', 'bug_essence'], uncommon: ['grass_essence', 'pink_dust'], rare: ['leaf_stone', 'lucky_egg'] }, xpPerMinute: 15,
  },
  johto_whirl_islands: {
    id: 'johto_whirl_islands', region: 'johto', name: 'Whirl Islands', badge: 5, leaderName: 'Chuck', icon: 'WI',
    bg: expBg('bg_ocean_routes.png', '#0a2a4a'), description: 'Cavernas marinhas para coletar recursos aquaticos raros.',
    enemyType: ['Water', 'Flying'], favoredTypes: ['Electric', 'Grass'], neutralTypes: ['Dragon', 'Ice', 'Normal'],
    requires: 5, baseDuration: 70, drops: { common: ['water_essence', 'flying_essence'], uncommon: ['water_stone', 'mystic_water'], rare: ['dragon_scale', 'super_rod'] }, xpPerMinute: 17,
  },
  hoenn_meteor_falls: {
    id: 'hoenn_meteor_falls', region: 'hoenn', name: 'Meteor Falls', badge: 3, leaderName: 'Wattson', icon: 'MF',
    bg: expBg('bg_meteor_falls.png', '#1a1a2a'), description: 'Minerios, poeira mistica e fragmentos de meteorito.',
    enemyType: ['Rock', 'Dragon', 'Steel'], favoredTypes: ['Water', 'Fighting', 'Ground'], neutralTypes: ['Psychic', 'Ice', 'Fairy'],
    requires: 3, baseDuration: 70, drops: { common: ['rock_essence', 'iron_ore', 'mystic_dust'], uncommon: ['dragon_essence', 'moon_stone_shard'], rare: ['stardust', 'dragon_scale'] }, xpPerMinute: 15,
  },
  hoenn_sky_pillar: {
    id: 'hoenn_sky_pillar', region: 'hoenn', name: 'Sky Pillar', badge: 8, leaderName: 'Wallace', icon: 'SP',
    bg: expBg('bg_sky_pillar.png', '#0a1a2a'), description: 'Expedicao de elite para escamas, penas e materiais draconicos.',
    enemyType: ['Dragon', 'Flying'], favoredTypes: ['Ice', 'Dragon', 'Fairy'], neutralTypes: ['Steel', 'Electric', 'Rock'],
    requires: 8, baseDuration: 100, drops: { common: ['dragon_essence', 'flying_essence'], uncommon: ['dragon_scale', 'feather'], rare: ['stardust', 'draco_shard'] }, xpPerMinute: 18,
  },
  sinnoh_mt_coronet: {
    id: 'sinnoh_mt_coronet', region: 'sinnoh', name: 'Mt. Coronet', badge: 6, leaderName: 'Byron', icon: 'MC',
    bg: expBg('bg_mt_coronet.png', '#2a2a2a'), description: 'Nucleo mineral de Sinnoh com drops para forja avancada.',
    enemyType: ['Rock', 'Steel', 'Ice'], favoredTypes: ['Fighting', 'Ground', 'Fire'], neutralTypes: ['Water', 'Psychic', 'Dragon'],
    requires: 6, baseDuration: 95, drops: { common: ['iron_ore', 'rock_essence', 'steel_essence'], uncommon: ['mystic_dust', 'ice_essence'], rare: ['stardust', 'armor_fragment'] }, xpPerMinute: 21,
  },
  sinnoh_stark_mountain: {
    id: 'sinnoh_stark_mountain', region: 'sinnoh', name: 'Stark Mountain', badge: 8, leaderName: 'Volkner', icon: 'SM',
    bg: expBg('bg_mt_coronet.png', '#3a1a0a'), description: 'Area pos-Liga para materials de boss e treino de nivel 100.',
    enemyType: ['Fire', 'Rock', 'Steel'], favoredTypes: ['Water', 'Ground', 'Fighting'], neutralTypes: ['Dragon', 'Psychic', 'Dark'],
    requires: 8, baseDuration: 120, drops: { common: ['fire_essence', 'rock_essence', 'steel_essence'], uncommon: ['fury_essence', 'armor_fragment'], rare: ['stardust', 'penetration_pendant'] }, xpPerMinute: 20,
  },
  unova_pinwheel: {
    id: 'unova_pinwheel', region: 'unova', name: 'Pinwheel Forest', leaderName: 'Trio Badge', icon: 'U5',
    bg: "linear-gradient(135deg,#14532d,#0f172a)", description: 'Estrutura preparada para Unova e quinta geracao.',
    enemyType: ['Bug', 'Grass'], favoredTypes: ['Fire', 'Flying'], neutralTypes: ['Normal', 'Poison'], requiresFlag: 'unova_started', baseDuration: 80,
    drops: { common: ['bug_essence', 'grass_essence'], uncommon: ['apricorn', 'silk'], rare: ['leaf_stone', 'stardust'] }, xpPerMinute: 18,
  },
  kalos_reflection_cave: {
    id: 'kalos_reflection_cave', region: 'kalos', name: 'Reflection Cave', leaderName: 'Bug Badge', icon: 'K6',
    bg: "linear-gradient(135deg,#7c3aed,#0f172a)", description: 'Estrutura preparada para Kalos e sexta geracao.',
    enemyType: ['Psychic', 'Rock'], favoredTypes: ['Dark', 'Ghost', 'Steel'], neutralTypes: ['Fairy', 'Ground'], requiresFlag: 'kalos_started', baseDuration: 90,
    drops: { common: ['psychic_essence', 'rock_essence'], uncommon: ['mystic_dust', 'iron_ore'], rare: ['moon_stone_shard', 'stardust'] }, xpPerMinute: 18,
  },
  alola_akala: {
    id: 'alola_akala', region: 'alola', name: 'Akala Outskirts', leaderName: 'Ilima Trial', icon: 'A7',
    bg: "linear-gradient(135deg,#0ea5e9,#064e3b)", description: 'Estrutura preparada para Alola e setima geracao.',
    enemyType: ['Water', 'Fire', 'Grass'], favoredTypes: ['Electric', 'Water', 'Fire'], neutralTypes: ['Normal', 'Flying'], requiresFlag: 'alola_started', baseDuration: 95,
    drops: { common: ['water_essence', 'fire_essence', 'grass_essence'], uncommon: ['pink_dust', 'mystic_dust'], rare: ['sun_stone', 'stardust'] }, xpPerMinute: 18,
  },
  galar_wild_area: {
    id: 'galar_wild_area', region: 'galar', name: 'Wild Area', leaderName: 'Grass Badge', icon: 'G8',
    bg: "linear-gradient(135deg,#16a34a,#334155)", description: 'Estrutura preparada para Galar e oitava geracao.',
    enemyType: ['Steel', 'Dragon', 'Fairy'], favoredTypes: ['Fire', 'Ice', 'Poison'], neutralTypes: ['Normal', 'Fighting'], requiresFlag: 'galar_started', baseDuration: 110,
    drops: { common: ['steel_essence', 'fairy_essence', 'dragon_essence'], uncommon: ['armor_fragment', 'mystic_dust'], rare: ['fury_essence', 'stardust'] }, xpPerMinute: 18,
  },
  paldea_area_zero: {
    id: 'paldea_area_zero', region: 'paldea', name: 'Area Zero', leaderName: 'Victory Road Paldea', icon: 'P9',
    bg: "linear-gradient(135deg,#22d3ee,#111827)", description: 'Estrutura preparada para Paldea e nona geracao.',
    enemyType: ['Dragon', 'Steel', 'Psychic'], favoredTypes: ['Fairy', 'Fire', 'Dark'], neutralTypes: ['Electric', 'Ghost'], requiresFlag: 'paldea_started', baseDuration: 130,
    drops: { common: ['dragon_essence', 'steel_essence', 'psychic_essence'], uncommon: ['stardust', 'fury_essence'], rare: ['armor_fragment', 'penetration_pendant'] }, xpPerMinute: 18,
  },

};

// Verificar se expedição está desbloqueada
// requires é o número do badge (1-8)
export const isExpeditionUnlocked = (biome, gameState) => {
  const flags = gameState.worldFlags || [];
  if (biome.requiresFlag && !flags.includes(biome.requiresFlag)) return false;
  const region = biome.region || 'kanto';
  if (!regionStarted(gameState, region)) return false;
  if (!biome.requires) return true;
  return getRegionBadgeCount(gameState, region) >= biome.requires;
};

// Calcular eficiência do Pokémon para um bioma
export const calcExpeditionEfficiency = (pokemon, biome) => {
  const pokeTypes = pokemon.types || [pokemon.type || 'Normal'];
  let efficiency = 1.0;
  for (const t of pokeTypes) {
    if (biome.favoredTypes.includes(t))      efficiency = Math.max(efficiency, 1.5);
    else if (biome.neutralTypes.includes(t)) efficiency = Math.max(efficiency, 1.0);
    else if (biome.enemyType.includes(t))    efficiency = Math.min(efficiency, 0.5);
  }
  const levelBonus = 1 + (pokemon.level || 1) / 100;
  return efficiency * levelBonus;
};

// Calcular duração real da expedição em milissegundos
export const calcExpeditionDuration = (team, biome, durationMultiplier = 1) => {
  const baseMinutes = (biome.baseDuration || 30) * durationMultiplier;
  if (!team.length) return baseMinutes * 60 * 1000;
  
  const avgLevel = team.reduce((s, p) => s + (p.level || 1), 0) / team.length;
  const avgEff   = team.reduce((s, p) => s + calcExpeditionEfficiency(p, biome), 0) / team.length;
  
  const levelReduction = Math.min(0.6, avgLevel / 100);
  const effReduction   = (avgEff - 1) * 0.2;
  const finalMult      = Math.max(0.3, 1 - levelReduction - effReduction);
  const masteryReduction = Math.min(0.25, (biome.masteryLevel || 0) * 0.025);
  
  return Math.floor(baseMinutes * Math.max(0.2, finalMult - masteryReduction) * 60 * 1000);
};

// Calcular drops ao retornar da expedição
export const calcExpeditionDrops = (team, biome, durationMs) => {
  const drops = {};
  const durationMinutes = durationMs / 60000;
  const avgEff   = team.reduce((s, p) => s + calcExpeditionEfficiency(p, biome), 0) / team.length;
  const avgLevel = team.reduce((s, p) => s + (p.level || 1), 0) / team.length;
  
  // O dropRate base é por minuto. Escala com eficiência e level.
  const dropRate = avgEff * (1 + avgLevel / 50) * (1 + (biome.masteryLevel || 0) * 0.08);
  
  // totalRolls escala linearmente com a duração real
  const totalRolls = Math.floor(durationMinutes * dropRate * 0.8);
  
  for (let i = 0; i < totalRolls; i++) {
    const roll = Math.random();
    const rareBoost = Math.min(0.20, (biome.masteryLevel || 0) * 0.015);
    const pool = roll < 0.60 - rareBoost ? biome.drops.common
               : roll < 0.90 - rareBoost ? biome.drops.uncommon
               :                biome.drops.rare;
    if (!pool || pool.length === 0) continue;
    const item = pool[Math.floor(Math.random() * pool.length)];
    drops[item] = (drops[item] || 0) + 1;
  }
  return drops;
};

// Calcular XP ganho por cada Pokémon na expedição
export const calcExpeditionXP = (team, biome, durationMs) => {
  const durationMinutes = durationMs / 60000;
  return team.map(p => {
    const eff = calcExpeditionEfficiency(p, biome);
    const levelScale = Math.max(1, (p.level || 1)) / 5;
    const xpGained = Math.floor(biome.xpPerMinute * durationMinutes * eff * levelScale * (1 + (biome.masteryLevel || 0) * 0.05));
    return { ...p, xpGained };
  });
};

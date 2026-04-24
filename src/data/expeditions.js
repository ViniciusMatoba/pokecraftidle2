// Sistema de Expediçíµes — desbloqueadas por badge de ginásio
// Badge 1 (Brock)    → Floresta de Viridian
// Badge 2 (Misty)    → Oceano Cerulean
// Badge 3 (Surge)    → Campo Lutador
// Badge 4 (Erika)    → Safari Zone
// Badge 5 (Koga)     → Torre Pokémon
// Badge 6 (Sabrina)  → Templo Psíquico
// Badge 7 (Blaine)   → Vulcão de Cinnabar
// Badge 8 (Giovanni) → Selva do Dragão

export const EXPEDITION_BIOMES = {

  floresta: {
    id: 'floresta',
    name: 'Floresta de Viridian',
    badge: 1,
    badgeName: 'Insígnia da Rocha',
    leaderName: 'Brock',
    icon: '🌲',
    imagePrompt: 'floresta_viridian',
    bg: "url('/expedition_floresta.png') center/cover",
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
    xpPerMinute: 2,
  },

  oceano: {
    id: 'oceano',
    name: 'Oceano Cerulean',
    badge: 2,
    badgeName: 'Insígnia da Cascata',
    leaderName: 'Misty',
    icon: '🌊',
    imagePrompt: 'oceano_cerulean',
    bg: "url('/expedition_oceano.png') center/cover",
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
    xpPerMinute: 3,
  },

  campo_lutador: {
    id: 'campo_lutador',
    name: 'Dojo de Saffron',
    badge: 3,
    badgeName: 'Insígnia do Trovão',
    leaderName: 'Lt. Surge',
    icon: '👊',
    imagePrompt: 'dojo_lutador',
    bg: "url('/expedition_campo_lutador.png') center/cover",
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
    xpPerMinute: 3,
  },

  pradaria: {
    id: 'pradaria',
    name: 'Safari Zone',
    badge: 4,
    badgeName: 'Insígnia do Arco-Íris',
    leaderName: 'Erika',
    icon: '🌊',
    imagePrompt: 'safari_zone',
    bg: "url('/expedition_pradaria.png') center/cover",
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
    xpPerMinute: 4,
  },

  torre_fantasma: {
    id: 'torre_fantasma',
    name: 'Torre Pokémon',
    badge: 5,
    badgeName: 'Insígnia da Alma',
    leaderName: 'Koga',
    icon: '👻',
    imagePrompt: 'torre_pokemon_fantasma',
    bg: "url('/expedition_torre_fantasma.png') center/cover",
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
    xpPerMinute: 4,
  },

  templo_psiquico: {
    id: 'templo_psiquico',
    name: 'Templo Psíquico de Saffron',
    badge: 6,
    badgeName: 'Insígnia do Pântano',
    leaderName: 'Sabrina',
    icon: '🟡',
    imagePrompt: 'templo_psiquico_saffron',
    bg: "url('/expedition_templo_psiquico.png') center/cover",
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
    xpPerMinute: 5,
  },

  vulcao: {
    id: 'vulcao',
    name: 'Vulcão de Cinnabar',
    badge: 7,
    badgeName: 'Insígnia do Vulcão',
    leaderName: 'Blaine',
    icon: '🔥',
    imagePrompt: 'vulcao_cinnabar',
    bg: "url('/expedition_vulcao.png') center/cover",
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
    xpPerMinute: 5,
  },

  selva_dragao: {
    id: 'selva_dragao',
    name: 'Victory Road — Selva do Dragão',
    badge: 8,
    badgeName: 'Insígnia da Terra',
    leaderName: 'Giovanni',
    icon: '🐉',
    imagePrompt: 'selva_dragao_victory_road',
    bg: "url('/expedition_selva_dragao.png') center/cover",
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
    xpPerMinute: 8,
  },

};

// Verificar se expedição está desbloqueada
// requires é o número do badge (1-8)
export const isExpeditionUnlocked = (biome, gameState) => {
  if (!biome.requires) return true;
  return (gameState.badges || []).includes(biome.requires);
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
export const calcExpeditionDuration = (team, biome) => {
  if (!team.length) return biome.baseDuration * 60 * 1000;
  const avgLevel = team.reduce((s, p) => s + (p.level || 1), 0) / team.length;
  const avgEff   = team.reduce((s, p) => s + calcExpeditionEfficiency(p, biome), 0) / team.length;
  const levelReduction = Math.min(0.6, avgLevel / 100);
  const effReduction   = (avgEff - 1) * 0.2;
  const finalMult      = Math.max(0.3, 1 - levelReduction - effReduction);
  return Math.floor(biome.baseDuration * finalMult * 60 * 1000);
};

// Calcular drops ao retornar da expedição
export const calcExpeditionDrops = (team, biome, durationMs) => {
  const drops = {};
  const durationMinutes = durationMs / 60000;
  const avgEff   = team.reduce((s, p) => s + calcExpeditionEfficiency(p, biome), 0) / team.length;
  const avgLevel = team.reduce((s, p) => s + (p.level || 1), 0) / team.length;
  const dropRate = avgEff * (1 + avgLevel / 50);
  const totalRolls = Math.floor(durationMinutes * dropRate * 0.8);
  for (let i = 0; i < totalRolls; i++) {
    const roll = Math.random();
    const pool = roll < 0.60 ? biome.drops.common
               : roll < 0.90 ? biome.drops.uncommon
               :                biome.drops.rare;
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
    const xpGained = Math.floor(biome.xpPerMinute * durationMinutes * eff);
    return { ...p, xpGained };
  });
};

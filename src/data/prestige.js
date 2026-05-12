// ── TROFÉUS ─────────────────────────────────────────────────────────────────
export const TROPHIES = {
  bronze_trainer: {
    id: 'bronze_trainer',
    name: 'Treinador de Bronze',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/big-mushroom.png',
    description: 'Exibido na sua casa. Prova que você iniciou sua jornada.',
    cost: 5000,
    minBadges: 1,
  },
  silver_trainer: {
    id: 'silver_trainer',
    name: 'Treinador de Prata',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/star-piece.png',
    description: 'Conquista intermediária. Exibido com destaque na casa.',
    cost: 15000,
    minBadges: 4,
  },
  gold_trainer: {
    id: 'gold_trainer',
    name: 'Treinador de Ouro',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png',
    description: 'Raridade máxima. Só os melhores treinadores possuem.',
    cost: 50000,
    minBadges: 8,
  },
  shiny_hunter: {
    id: 'shiny_hunter',
    name: 'Caçador de Shinys',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/comet-shard.png',
    description: 'Para quem dedica sua vida a encontrar Pokémon raros.',
    cost: 30000,
    minBadges: 5,
  },
  pokemon_master: {
    id: 'pokemon_master',
    name: 'Mestre Pokémon',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
    description: 'O troféu mais cobiçado. Exige ser Campeão de uma região.',
    cost: 100000,
    minBadges: 8,
    requireChampion: true,
  },
};

// ── TÍTULOS DE TREINADOR ─────────────────────────────────────────────────────
export const TRAINER_TITLES = {
  youngster: {
    id: 'youngster',
    label: 'Youngster',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    cost: 500,
    minBadges: 0,
  },
  bug_catcher: {
    id: 'bug_catcher',
    label: 'Bug Catcher',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/net-ball.png',
    cost: 1000,
    minBadges: 1,
  },
  ace_trainer: {
    id: 'ace_trainer',
    label: 'Ace Trainer',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',
    cost: 8000,
    minBadges: 4,
  },
  pokemon_ranger: {
    id: 'pokemon_ranger',
    label: 'Pokémon Ranger',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/friend-ball.png',
    cost: 12000,
    minBadges: 5,
  },
  elite_four: {
    id: 'elite_four',
    label: 'Elite Four',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-ball.png',
    cost: 30000,
    minBadges: 8,
  },
  pokemon_master: {
    id: 'pokemon_master',
    label: 'Pokémon Master',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
    cost: 80000,
    minBadges: 8,
    requireChampion: true,
  },
};

// ── MOLDURAS DA POKÉDEX ──────────────────────────────────────────────────────
export const POKEDEX_FRAMES = {
  default: {
    id: 'default',
    name: 'Padrão',
    cost: 0,
    borderColor: '#e2e8f0',
    headerColor: '#ef4444',
    accentColor: '#1e293b',
  },
  gold: {
    id: 'gold',
    name: 'Dourado',
    cost: 10000,
    minBadges: 4,
    borderColor: '#fbbf24',
    headerColor: '#d97706',
    accentColor: '#92400e',
  },
  midnight: {
    id: 'midnight',
    name: 'Meia-noite',
    cost: 15000,
    minBadges: 5,
    borderColor: '#6366f1',
    headerColor: '#312e81',
    accentColor: '#c7d2fe',
  },
  dragon: {
    id: 'dragon',
    name: 'Dragão',
    cost: 25000,
    minBadges: 7,
    borderColor: '#3b82f6',
    headerColor: '#1e3a8a',
    accentColor: '#93c5fd',
  },
  champion: {
    id: 'champion',
    name: 'Campeão',
    cost: 60000,
    minBadges: 8,
    requireChampion: true,
    borderColor: '#f59e0b',
    headerColor: '#7c3aed',
    accentColor: '#fde68a',
  },
};

// ── TEMAS DE INTERFACE ───────────────────────────────────────────────────────
export const UI_THEMES = {
  default: {
    id: 'default',
    name: 'Clássico',
    cost: 0,
    preview: '#ef4444',
    bonus: { xpMult: 1.0 },
    css: {},
  },
  golden: {
    id: 'golden',
    name: 'Gold Version',
    cost: 20000,
    minBadges: 4,
    preview: '#fbbf24',
    // Sobrescreve as cores CSS custom properties
    css: {
      '--color-primary': '#d97706',
      '--color-accent': '#fbbf24',
      '--color-bg': '#1c1407',
    },
    bonus: { xpMult: 1.15 },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Blue',
    cost: 20000,
    minBadges: 5,
    preview: '#4f46e5',
    css: {
      '--color-primary': '#4f46e5',
      '--color-accent': '#818cf8',
      '--color-bg': '#0f0f1a',
    },
    bonus: { xpMult: 1.15 },
  },
  forest: {
    id: 'forest',
    name: 'Viridian Forest',
    cost: 15000,
    minBadges: 3,
    preview: '#16a34a',
    css: {
      '--color-primary': '#16a34a',
      '--color-accent': '#4ade80',
      '--color-bg': '#0a1a0d',
    },
    bonus: { xpMult: 1.10 },
  },
};

// ── ALIADOS NPC ──────────────────────────────────────────────────────────────
// O aliado aparece em batalha como suporte: reduz dano recebido ou
// ataca junto ao Pokémon do jogador (bônus de dano % por batalha)
export const ALLIES = {
  youngster_joey: {
    id: 'youngster_joey',
    name: 'Joey',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/youngster.png',
    description: 'Ajuda com ataques básicos. +8% de dano por batalha.',
    cost: 3000,
    duration: 30 * 60 * 1000,       // 30 minutos
    minBadges: 1,
    bonus: { damageMult: 1.08 },
  },
  misty: {
    id: 'misty',
    name: 'Misty',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/misty.png',
    description: 'Especialista em água. +15% dano e +10% captura.',
    cost: 15000,
    duration: 60 * 60 * 1000,       // 1 hora
    minBadges: 3,
    bonus: { damageMult: 1.15, captureMult: 1.10 },
  },
  brock: {
    id: 'brock',
    name: 'Brock',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brock.png',
    description: 'Rocha sólida. Reduz dano recebido em 20%.',
    cost: 12000,
    duration: 60 * 60 * 1000,
    minBadges: 2,
    bonus: { defenseMult: 0.80 },   // multiplicador de dano recebido
  },
  oak: {
    id: 'oak',
    name: 'Prof. Carvalho',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/professor-oak.png',
    description: 'Pesquisa de campo. +25% XP ganho em batalhas.',
    cost: 25000,
    duration: 2 * 60 * 60 * 1000,  // 2 horas
    minBadges: 5,
    bonus: { xpMult: 1.25 },
  },
};

// ── MINERAÇÃO ────────────────────────────────────────────────────────────────
// Ganha materiais de forja passivamente por hora
export const MINE_LEVELS = {
  1: {
    level: 1,
    label: 'Mina Inicial',
    unlockCost: 8000,
    upgradeCost: 20000,
    minBadges: 3,
    intervalMs: 60 * 60 * 1000,    // coleta a cada 1 hora
    drops: {
      iron_ore: { min: 2, max: 5 },
      rock_essence: { min: 1, max: 3 },
    },
  },
  2: {
    level: 2,
    label: 'Mina Ampliada',
    unlockCost: 20000,             // custo para upgrade de nível 1 → 2
    upgradeCost: 60000,
    minBadges: 5,
    intervalMs: 60 * 60 * 1000,
    drops: {
      iron_ore: { min: 4, max: 8 },
      rock_essence: { min: 2, max: 5 },
      steel_essence: { min: 1, max: 3 },
      stardust: { min: 0, max: 2 },
    },
  },
  3: {
    level: 3,
    label: 'Mina Profunda',
    unlockCost: 60000,
    upgradeCost: null,             // máximo
    minBadges: 8,
    intervalMs: 60 * 60 * 1000,
    drops: {
      iron_ore: { min: 6, max: 12 },
      rock_essence: { min: 3, max: 7 },
      steel_essence: { min: 2, max: 5 },
      stardust: { min: 1, max: 3 },
      dragon_scale: { min: 0, max: 1 },
    },
  },
};

// ── VARAS DE PESCA ────────────────────────────────────────────────────────────
export const FISHING_RODS = {
  old_rod: {
    id: 'old_rod',
    name: 'Vara Velha',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/old-rod.png',
    cost: 0,
    description: 'Você já tem. Pesca Pokémon aquáticos comuns.',
    bonus: {},
  },
  good_rod: {
    id: 'good_rod',
    name: 'Boa Vara',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/good-rod.png',
    cost: 8000,
    minBadges: 3,
    description: '+20% de aparição de Pokémon aquáticos. Desbloqueia Poliwag, Horsea, Krabby.',
    bonus: {
      waterSpawnMult: 1.20,
      extraPokemon: [60, 116, 98],  // Poliwag, Horsea, Krabby
    },
  },
  super_rod: {
    id: 'super_rod',
    name: 'Super Vara',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-rod.png',
    cost: 30000,
    minBadges: 6,
    description: '+40% Pokémon aquáticos. Desbloqueia Dratini, Lapras, Gyarados.',
    bonus: {
      waterSpawnMult: 1.40,
      extraPokemon: [147, 131, 130], // Dratini, Lapras, Gyarados
    },
  },
};

// ── POKÉMON CENTER — DOAÇÕES ──────────────────────────────────────────────────
export const POKECENTER_DONATIONS = [
  { cost: 500,   heals: 5,   label: 'Pequena Doação' },
  { cost: 2000,  heals: 25,  label: 'Doação Generosa' },
  { cost: 8000,  heals: 120, label: 'Grande Benefício' },
];

// ── GINÁSIO PRÓPRIO ───────────────────────────────────────────────────────────
export const GYM_BANNERS = {
  default:  { id: 'default',  name: 'Padrão',    cost: 0,     color: '#6b7280' },
  fire:     { id: 'fire',     name: 'Chamas',    cost: 5000,  color: '#ef4444' },
  water:    { id: 'water',    name: 'Oceano',    cost: 5000,  color: '#3b82f6' },
  grass:    { id: 'grass',    name: 'Floresta',  cost: 5000,  color: '#22c55e' },
  electric: { id: 'electric', name: 'Trovão',   cost: 5000,  color: '#eab308' },
  psychic:  { id: 'psychic',  name: 'Psíquico', cost: 8000,  color: '#a855f7' },
  dragon:   { id: 'dragon',   name: 'Dragão',   cost: 15000, color: '#6366f1' },
  dark:     { id: 'dark',     name: 'Sombra',   cost: 12000, color: '#1e293b' },
  champion: { id: 'champion', name: 'Campeão',  cost: 40000, color: '#f59e0b', requireChampion: true },
};

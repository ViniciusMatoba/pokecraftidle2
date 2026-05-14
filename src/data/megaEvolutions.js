// ── Sistema de Mega Evolução Permanente — PokéCraft Idle 2 ────────────────────
// A Mega Evolução é ETERNA. Uma vez realizada, o Pokémon não retorna à forma normal.
// Formato: { stoneId: { baseId, megaFormId (PokeAPI), name, types, statBonus } }

export const MEGA_STONE_ICONS = {
  charizardite_x:  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charizardite-x.png',
  charizardite_y:  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charizardite-y.png',
  blastoisinite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/blastoisinite.png',
  venusaurite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/venusaurite.png',
  alakazite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/alakazite.png',
  gengarite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gengarite.png',
  gyaradosite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gyaradosite.png',
  kangaskhanite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kangaskhanite.png',
  pinsirite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pinsirite.png',
  aerodactylite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/aerodactylite.png',
  ampharosite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ampharosite.png',
  scizorite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scizorite.png',
  heracronite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heracronite.png',
  houndoominite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/houndoominite.png',
  tyranitarite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tyranitarite.png',
  blazikenite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/blazikenite.png',
  gardevoirite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gardevoirite.png',
  mawilite:        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mawilite.png',
  aggronite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/aggronite.png',
  medichamite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/medichamite.png',
  manectite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/manectite.png',
  banettite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/banettite.png',
  absolite:        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/absolite.png',
  salamencite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/salamencite.png',
  metagrossite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metagrossite.png',
  lucarionite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucarionite.png',
  abomasnowite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/abomasnowite.png',
};

// Mapa completo de Mega Evoluções
// megaFormId: ID do sprite da PokeAPI (formas alternativas começam em 10033)
export const MEGA_EVOLUTION_MAP = {
  // ── KANTO ────────────────────────────────────────────────────────────────────
  charizardite_x: {
    baseId: 6, megaFormId: 10034,
    name: 'Mega Charizard X', types: ['Fire', 'Dragon'],
    statBonus: { attack: 0.40, spAtk: 0.20, defense: 0.15, speed: 0.05 },
    craftCost: { fire_essence: 15, dragon_scale: 5, currency: 2000 },
  },
  charizardite_y: {
    baseId: 6, megaFormId: 10035,
    name: 'Mega Charizard Y', types: ['Fire', 'Flying'],
    statBonus: { spAtk: 0.50, speed: 0.10, defense: 0.10 },
    craftCost: { fire_essence: 15, dragon_scale: 5, currency: 2000 },
  },
  blastoisinite: {
    baseId: 9, megaFormId: 10036,
    name: 'Mega Blastoise', types: ['Water'],
    statBonus: { spAtk: 0.30, defense: 0.25, spDef: 0.20 },
    craftCost: { water_essence: 15, pearl: 5, currency: 2000 },
  },
  venusaurite: {
    baseId: 3, megaFormId: 10033,
    name: 'Mega Venusaur', types: ['Grass', 'Poison'],
    statBonus: { spAtk: 0.25, spDef: 0.25, defense: 0.20 },
    craftCost: { grass_essence: 15, leaf_stone: 3, currency: 2000 },
  },
  alakazite: {
    baseId: 65, megaFormId: 10037,
    name: 'Mega Alakazam', types: ['Psychic'],
    statBonus: { spAtk: 0.45, speed: 0.15, spDef: 0.10 },
    craftCost: { psychic_essence: 10, link_cable: 2, currency: 1500 },
  },
  gengarite: {
    baseId: 94, megaFormId: 10038,
    name: 'Mega Gengar', types: ['Ghost', 'Poison'],
    statBonus: { spAtk: 0.40, speed: 0.20, attack: 0.10 },
    craftCost: { ghost_essence: 10, dusk_stone: 3, currency: 1500 },
  },
  gyaradosite: {
    baseId: 130, megaFormId: 10039,
    name: 'Mega Gyarados', types: ['Water', 'Dark'],
    statBonus: { attack: 0.40, defense: 0.20, spDef: 0.15 },
    craftCost: { water_essence: 15, magikarp_scale: 5, currency: 2000 },
  },
  kangaskhanite: {
    baseId: 115, megaFormId: 10040,
    name: 'Mega Kangaskhan', types: ['Normal'],
    statBonus: { attack: 0.30, speed: 0.20, defense: 0.15 },
    craftCost: { normal_essence: 15, currency: 1800 },
  },
  pinsirite: {
    baseId: 127, megaFormId: 10041,
    name: 'Mega Pinsir', types: ['Bug', 'Flying'],
    statBonus: { attack: 0.45, speed: 0.20, defense: 0.10 },
    craftCost: { bug_essence: 10, currency: 1500 },
  },
  aerodactylite: {
    baseId: 142, megaFormId: 10042,
    name: 'Mega Aerodactyl', types: ['Rock', 'Flying'],
    statBonus: { attack: 0.30, speed: 0.30, defense: 0.15 },
    craftCost: { rock_essence: 10, old_amber: 3, currency: 1800 },
  },
  // ── JOHTO ────────────────────────────────────────────────────────────────────
  ampharosite: {
    baseId: 181, megaFormId: 10043,
    name: 'Mega Ampharos', types: ['Electric', 'Dragon'],
    statBonus: { spAtk: 0.40, spDef: 0.20, defense: 0.15 },
    craftCost: { electric_essence: 12, dragon_scale: 3, currency: 1800 },
  },
  scizorite: {
    baseId: 212, megaFormId: 10044,
    name: 'Mega Scizor', types: ['Bug', 'Steel'],
    statBonus: { attack: 0.40, defense: 0.25, spDef: 0.10 },
    craftCost: { bug_essence: 10, steel_essence: 5, currency: 1800 },
  },
  heracronite: {
    baseId: 214, megaFormId: 10045,
    name: 'Mega Heracross', types: ['Bug', 'Fighting'],
    statBonus: { attack: 0.45, defense: 0.15, spDef: 0.15 },
    craftCost: { bug_essence: 10, fighting_essence: 5, currency: 1800 },
  },
  houndoominite: {
    baseId: 229, megaFormId: 10046,
    name: 'Mega Houndoom', types: ['Dark', 'Fire'],
    statBonus: { spAtk: 0.40, speed: 0.20, spDef: 0.10 },
    craftCost: { fire_essence: 10, dark_essence: 5, currency: 1800 },
  },
  tyranitarite: {
    baseId: 248, megaFormId: 10047,
    name: 'Mega Tyranitar', types: ['Rock', 'Dark'],
    statBonus: { attack: 0.35, defense: 0.30, spDef: 0.15 },
    craftCost: { rock_essence: 15, dark_essence: 8, currency: 2500 },
  },
  // ── HOENN ────────────────────────────────────────────────────────────────────
  blazikenite: {
    baseId: 257, megaFormId: 10048,
    name: 'Mega Blaziken', types: ['Fire', 'Fighting'],
    statBonus: { attack: 0.40, spAtk: 0.20, speed: 0.15 },
    craftCost: { fire_essence: 12, fighting_essence: 5, currency: 2000 },
  },
  gardevoirite: {
    baseId: 282, megaFormId: 10049,
    name: 'Mega Gardevoir', types: ['Psychic', 'Fairy'],
    statBonus: { spAtk: 0.40, spDef: 0.20, defense: 0.10 },
    craftCost: { psychic_essence: 12, fairy_essence: 5, currency: 2000 },
  },
  mawilite: {
    baseId: 303, megaFormId: 10050,
    name: 'Mega Mawile', types: ['Steel', 'Fairy'],
    statBonus: { attack: 0.35, defense: 0.30, spDef: 0.15 },
    craftCost: { steel_essence: 8, fairy_essence: 8, currency: 1500 },
  },
  aggronite: {
    baseId: 306, megaFormId: 10051,
    name: 'Mega Aggron', types: ['Steel'],
    statBonus: { defense: 0.50, attack: 0.20, spDef: 0.10 },
    craftCost: { steel_essence: 15, rock_essence: 8, currency: 2000 },
  },
  medichamite: {
    baseId: 308, megaFormId: 10052,
    name: 'Mega Medicham', types: ['Fighting', 'Psychic'],
    statBonus: { attack: 0.35, speed: 0.20, defense: 0.15 },
    craftCost: { fighting_essence: 10, psychic_essence: 5, currency: 1500 },
  },
  manectite: {
    baseId: 310, megaFormId: 10053,
    name: 'Mega Manectric', types: ['Electric'],
    statBonus: { spAtk: 0.40, speed: 0.25, defense: 0.10 },
    craftCost: { electric_essence: 12, currency: 1500 },
  },
  banettite: {
    baseId: 354, megaFormId: 10054,
    name: 'Mega Banette', types: ['Ghost'],
    statBonus: { attack: 0.45, speed: 0.15, defense: 0.10 },
    craftCost: { ghost_essence: 12, dusk_stone: 2, currency: 1500 },
  },
  absolite: {
    baseId: 359, megaFormId: 10055,
    name: 'Mega Absol', types: ['Dark'],
    statBonus: { attack: 0.40, speed: 0.20, spAtk: 0.10 },
    craftCost: { dark_essence: 12, currency: 1500 },
  },
  salamencite: {
    baseId: 373, megaFormId: 10056,
    name: 'Mega Salamence', types: ['Dragon', 'Flying'],
    statBonus: { attack: 0.35, spAtk: 0.20, speed: 0.20 },
    craftCost: { dragon_scale: 8, flying_essence: 5, currency: 2500 },
  },
  metagrossite: {
    baseId: 376, megaFormId: 10057,
    name: 'Mega Metagross', types: ['Steel', 'Psychic'],
    statBonus: { attack: 0.35, defense: 0.25, spDef: 0.15 },
    craftCost: { steel_essence: 15, psychic_essence: 8, currency: 2500 },
  },
  // ── SINNOH ────────────────────────────────────────────────────────────────────
  lucarionite: {
    baseId: 448, megaFormId: 10058,
    name: 'Mega Lucario', types: ['Fighting', 'Steel'],
    statBonus: { attack: 0.35, spAtk: 0.25, speed: 0.15 },
    craftCost: { fighting_essence: 12, steel_essence: 8, currency: 2000 },
  },
  abomasnowite: {
    baseId: 460, megaFormId: 10060,
    name: 'Mega Abomasnow', types: ['Grass', 'Ice'],
    statBonus: { attack: 0.25, spAtk: 0.25, defense: 0.20 },
    craftCost: { grass_essence: 10, ice_essence: 10, currency: 1800 },
  },
};

/**
 * Retorna os dados de Mega Evolução para um Pokémon baseado em seu ID e pedra.
 * @param {number} baseId - ID do Pokémon base
 * @param {string} stoneId - ID da Mega Pedra
 * @returns {object|null}
 */
export const getMegaEvolution = (baseId, stoneId) => {
  const data = MEGA_EVOLUTION_MAP[stoneId];
  if (!data || data.baseId !== baseId) return null;
  return data;
};

/**
 * Lista todas as Mega Pedras compatíveis com um Pokémon.
 * @param {number} baseId
 * @returns {Array<{stoneId, ...data}>}
 */
export const getCompatibleMegaStones = (baseId) => {
  return Object.entries(MEGA_EVOLUTION_MAP)
    .filter(([, data]) => data.baseId === baseId)
    .map(([stoneId, data]) => ({ stoneId, ...data }));
};

/**
 * URL do sprite da forma Mega (PokeAPI animated ou estático).
 */
export const getMegaSprite = (megaFormId) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${megaFormId}.png`;
};

/**
 * Calcula o multiplicador final de dano considerando megaStatBonus.
 * statBonus é ex.: { attack: 0.40 } → multiplicador de 1.40 no stat.
 */
export const applyMegaStatBonus = (pokemon, statName) => {
  if (!pokemon?.isMega || !pokemon?.megaStatBonus) return 1.0;
  return 1.0 + (pokemon.megaStatBonus[statName] || 0);
};

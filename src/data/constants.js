export const APP_VERSION = '1.8.0';
export const APP_VERSION_DATE = '24/04/2026';

export const NATURE_LIST = ['Adamant', 'Modest', 'Jolly', 'Timid', 'Bold', 'Calm', 'Impish', 'Careful', 'Brave', 'Quiet'];

export const TYPE_COLORS = {
  Normal:'bg-slate-400', Fire:'bg-orange-500', Water:'bg-blue-500',
  Electric:'bg-yellow-400', Grass:'bg-green-500', Poison:'bg-purple-500',
  Bug:'bg-lime-500', Flying:'bg-sky-400', Rock:'bg-amber-600',
  Ground:'bg-yellow-600', Fighting:'bg-red-600', Psychic:'bg-pink-500',
  Dark:'bg-slate-700', Steel:'bg-slate-500', Ghost:'bg-indigo-700',
  Dragon:'bg-indigo-500', Fairy:'bg-pink-400', Ice:'bg-cyan-400',
};

export const NATURES = {
  Adamant: { plus: 'attack', minus: 'spAtk' },
  Modest: { plus: 'spAtk', minus: 'attack' },
  Jolly: { plus: 'speed', minus: 'spAtk' },
  Timid: { plus: 'speed', minus: 'attack' },
  Bold: { plus: 'defense', minus: 'attack' },
  Calm: { plus: 'spDef', minus: 'attack' },
  Impish: { plus: 'defense', minus: 'spAtk' },
  Careful: { plus: 'spDef', minus: 'spAtk' },
  Brave: { plus: 'attack', minus: 'speed' },
  Quiet: { plus: 'spAtk', minus: 'speed' },
};

export const GYM_LEVEL_CAPS = {
  boulder_badge: 14,
  cascade_badge: 21,
  thunder_badge: 24,
  rainbow_badge: 32,
  soul_badge: 43,
  marsh_badge: 43,
  volcano_badge: 50,
  earth_badge: 55,
  champion: 65
};

export const trainerAvatars = [
  { id: 'red', name: 'Red', img: 'https://play.pokemonshowdown.com/sprites/trainers/red.png' },
  { id: 'blue', name: 'Blue', img: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png' },
  { id: 'leaf', name: 'Leaf', img: 'https://play.pokemonshowdown.com/sprites/trainers/leaf.png' },
  { id: 'ethan', name: 'Ethan', img: 'https://play.pokemonshowdown.com/sprites/trainers/ethan.png' },
  { id: 'lyra', name: 'Lyra', img: 'https://play.pokemonshowdown.com/sprites/trainers/lyra.png' },
  { id: 'kris', name: 'Kris', img: 'https://play.pokemonshowdown.com/sprites/trainers/kris.png' },
  { id: 'brendan', name: 'Brendan', img: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png' },
  { id: 'may', name: 'May', img: 'https://play.pokemonshowdown.com/sprites/trainers/may.png' },
  { id: 'lucas', name: 'Lucas', img: 'https://play.pokemonshowdown.com/sprites/trainers/lucas.png' },
  { id: 'dawn', name: 'Dawn', img: 'https://play.pokemonshowdown.com/sprites/trainers/dawn.png' },
  { id: 'hilbert', name: 'Hilbert', img: 'https://play.pokemonshowdown.com/sprites/trainers/hilbert.png' },
  { id: 'hilda', name: 'Hilda', img: 'https://play.pokemonshowdown.com/sprites/trainers/hilda.png' },
  { id: 'nate', name: 'Nate', img: 'https://play.pokemonshowdown.com/sprites/trainers/nate.png' },
  { id: 'rosa', name: 'Rosa', img: 'https://play.pokemonshowdown.com/sprites/trainers/rosa.png' },
  { id: 'calem', name: 'Calem', img: 'https://play.pokemonshowdown.com/sprites/trainers/calem.png' },
  { id: 'serena', name: 'Serena', img: 'https://play.pokemonshowdown.com/sprites/trainers/serena.png' },
  { id: 'sun', name: 'Sun', img: 'https://play.pokemonshowdown.com/sprites/trainers/sun.png' },
  { id: 'moon', name: 'Moon', img: 'https://play.pokemonshowdown.com/sprites/trainers/moon.png' }
];

export const DEFAULT_GAME_STATE = {
  currency: 0,
  inventory: {
    materials: {
      normal_essence: 0, fire_essence: 0, water_essence: 0, grass_essence: 0,
      electric_essence: 0, ice_essence: 0, fighting_essence: 0, poison_essence: 0,
      ground_essence: 0, flying_essence: 0, psychic_essence: 0, bug_essence: 0,
      rock_essence: 0, ghost_essence: 0, dragon_essence: 0, steel_essence: 0,
      fairy_essence: 0, dark_essence: 0, mystic_dust: 0, iron_ore: 0
    },
    items: { pokeballs: 5, potions: 2 },
    candies: {}
  },
  team: [],
  pc: [],
  currentRoute: 'pallet_town',
  worldFlags: [],
  badges: [],
  caughtData: {},
  speciesMastery: {},
  expeditions: {},
  settings: {
    battleSpeed: 1,
    displayMode: 'mobile'
  }
};

export const ITEM_LABELS = {
  // Materiais
  silk: { icon: '🧵', name: 'Seda' },
  feather: { icon: '🪶', name: 'Pena' },
  apricorn: { icon: '🌰', name: 'Apricorn' },
  electric_chip: { icon: '⚡', name: 'Chip Eletr.' },
  moon_stone_shard: { icon: '🌙', name: 'Fragmento Lua' },
  pink_dust: { icon: '🩷', name: 'Pó Rosa' },
  gold_nugget: { icon: '🪙', name: 'Pepita' },
  iron_ore: { icon: '⛏️', name: 'Minério Ferro' },
  mystic_dust: { icon: '✨', name: 'Pó Místico' },
  
  // Pedras de Evolução
  fire_stone: { icon: '🔥', name: 'Pedra Fogo' },
  water_stone: { icon: '💧', name: 'Pedra Água' },
  leaf_stone: { icon: '🌿', name: 'Pedra Folha' },
  thunder_stone: { icon: '⚡', name: 'Pedra Trovão' },
  moon_stone: { icon: '🌙', name: 'Pedra Lua' },
  
  // Essências
  normal_essence: { icon: '⚪', name: 'Ess. Normal' },
  fire_essence: { icon: '🔥', name: 'Ess. Fogo' },
  water_essence: { icon: '💧', name: 'Ess. Água' },
  grass_essence: { icon: '🌿', name: 'Ess. Planta' },
  electric_essence: { icon: '⚡', name: 'Ess. Elet.' },
  ice_essence: { icon: '❄️', name: 'Ess. Gelo' },
  fighting_essence: { icon: '🥊', name: 'Ess. Luta' },
  poison_essence: { icon: '☠️', name: 'Ess. Veneno' },
  ground_essence: { icon: '⛰️', name: 'Ess. Terra' },
  flying_essence: { icon: '🦅', name: 'Ess. Voador' },
  psychic_essence: { icon: '🔮', name: 'Ess. Psíqu.' },
  bug_essence: { icon: '🪲', name: 'Ess. Inseto' },
  rock_essence: { icon: '🪨', name: 'Ess. Pedra' },
  ghost_essence: { icon: '👻', name: 'Ess. Fantas.' },
  dragon_essence: { icon: '🐲', name: 'Ess. Dragão' },
  steel_essence: { icon: '⚙️', name: 'Ess. Aço' },
  dark_essence: { icon: '🌑', name: 'Ess. Sombrio' },
  fairy_essence: { icon: '✨', name: 'Ess. Fada' },
  
  // Itens de Consumo
  pokeballs: { icon: '🎾', name: 'Pokébolas' },
  great_ball: { icon: '🔵', name: 'Great Ball' },
  ultra_ball: { icon: '🟡', name: 'Ultra Ball' },
  potions: { icon: '🧪', name: 'Poção' }
};

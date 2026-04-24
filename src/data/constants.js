export const APP_VERSION = '1.9.2';
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
  { id: 'red',     name: 'Red',     img: 'https://play.pokemonshowdown.com/sprites/trainers/red.png'     },
  { id: 'leaf',    name: 'Leaf',    img: 'https://play.pokemonshowdown.com/sprites/trainers/leaf.png'    },
  { id: 'ethan',   name: 'Ethan',   img: 'https://play.pokemonshowdown.com/sprites/trainers/ethan.png'   },
  { id: 'lyra',    name: 'Lyra',    img: 'https://play.pokemonshowdown.com/sprites/trainers/lyra.png'    },
  { id: 'brendan', name: 'Brendan', img: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png' },
  { id: 'may',     name: 'May',     img: 'https://play.pokemonshowdown.com/sprites/trainers/may.png'     },
  { id: 'lucas',   name: 'Lucas',   img: 'https://play.pokemonshowdown.com/sprites/trainers/lucas.png'   },
  { id: 'dawn',    name: 'Dawn',    img: 'https://play.pokemonshowdown.com/sprites/trainers/dawn.png'    },
  { id: 'hilbert', name: 'Hilbert', img: 'https://play.pokemonshowdown.com/sprites/trainers/hilbert.png' },
  { id: 'hilda',   name: 'Hilda',   img: 'https://play.pokemonshowdown.com/sprites/trainers/hilda.png'   },
  { id: 'calem',   name: 'Calem',   img: 'https://play.pokemonshowdown.com/sprites/trainers/calem.png'   },
  { id: 'serena',  name: 'Serena',  img: 'https://play.pokemonshowdown.com/sprites/trainers/serena.png'  },
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
  activeEffects: {},
  house: {
    owned: false,
    totalSlots: 0,
    slots: [],
    caretakers: [],
  },
  stamina: {},
  oakTutorialShown: false,
  autoCapture: false,
  autoCaptureConfig: {
    enabled: false,
    mode: 'shiny_only',
    targetIds: [],
    ballPriority: 'auto',
    hpThreshold: 30,
    routeConfigs: {},
    shownRoutes: [],
  },
  settings: {
    battleSpeed: 1,
    displayMode: 'mobile'
  },
  activeQuest: null
};

export const ITEM_LABELS = {
  // Materiais
  silk: { icon: '🧵', name: 'Seda' },
  feather: { icon: '🪶', name: 'Pena' },
  apricorn: { icon: '🌰', name: 'Apricorn' },
  electric_chip: { icon: '⚡', name: 'Chip Elétrico' },
  moon_stone_shard: { icon: '🌙', name: 'Fragmento de Lua' },
  pink_dust: { icon: '🌸', name: 'Pó Rosa' },
  gold_nugget: { icon: '🪙', name: 'Pepita de Ouro' },
  iron_ore: { icon: '⛏️', name: 'Minério de Ferro' },
  mystic_dust: { icon: '✨', name: 'Pó Místico' },
  
  // Bebidas
  fresh_water:       { icon: '💧', name: 'Água Fresca' },
  soda_pop:          { icon: '🥤', name: 'Soda Pop' },
  lemonade:          { icon: '🍋', name: 'Limonada' },
  moomoo_milk:       { icon: '🥛', name: 'Leite MooMoo' },
  berry_juice:       { icon: '🧃', name: 'Suco de Baga' },
  // Berries
  oran_berry:        { icon: '🫐', name: 'Oran Berry' },
  sitrus_berry:      { icon: '🍊', name: 'Sitrus Berry' },
  lum_berry:         { icon: '🌟', name: 'Lum Berry' },
  cheri_berry:       { icon: '🍒', name: 'Cheri Berry' },
  chesto_berry:      { icon: '🫐', name: 'Chesto Berry' },
  pecha_berry:       { icon: '🍑', name: 'Pecha Berry' },
  rawst_berry:       { icon: '🧊', name: 'Rawst Berry' },
  aspear_berry:      { icon: '🍐', name: 'Aspear Berry' },
  leppa_berry:       { icon: '🍅', name: 'Leppa Berry' },
  // Ração
  poke_food:         { icon: '🍖', name: 'Ração Comum' },
  poke_food_premium: { icon: '🥩', name: 'Ração Premium' },

  // Pedras de Evolução
  fire_stone: { icon: '🔥', name: 'Pedra do Fogo' },
  water_stone: { icon: '💧', name: 'Pedra da Água' },
  leaf_stone: { icon: '🍃', name: 'Pedra da Folha' },
  thunder_stone: { icon: '⚡', name: 'Pedra do Trovão' },
  moon_stone: { icon: '🌙', name: 'Pedra da Lua' },
  
  // Essências
  normal_essence:    { icon: '⚪', name: 'Essência Normal' },
  fire_essence:      { icon: '🔥', name: 'Essência de Fogo' },
  water_essence:     { icon: '💧', name: 'Essência de Água' },
  grass_essence:     { icon: '🌿', name: 'Essência de Grama' },
  electric_essence:  { icon: '⚡', name: 'Essência Elétrica' },
  ice_essence:       { icon: '❄️', name: 'Essência de Gelo' },
  fighting_essence:  { icon: '👊', name: 'Essência de Luta' },
  poison_essence:    { icon: '💀', name: 'Essência Venenosa' },
  ground_essence:    { icon: '⛰️', name: 'Essência de Terra' },
  flying_essence:    { icon: '🦅', name: 'Essência Voadora' },
  psychic_essence:   { icon: '🔮', name: 'Essência Psíquica' },
  bug_essence:       { icon: '🪲', name: 'Essência Inseto' },
  rock_essence:      { icon: '🪨', name: 'Essência de Rocha' },
  ghost_essence:     { icon: '👻', name: 'Essência Fantasma' },
  dragon_essence:    { icon: '🐉', name: 'Essência de Dragão' },
  steel_essence:     { icon: '⚙️', name: 'Essência de Aço' },
  dark_essence:      { icon: '🌑', name: 'Essência Sombria' },
  fairy_essence:     { icon: '✨', name: 'Essência de Fada' },
  
  // Pokebolas
  pokeball:          { icon: '🎾', name: 'Pokébola' },
  greatball:         { icon: '🔵', name: 'Great Ball' },
  ultraball:         { icon: '🟡', name: 'Ultra Ball' },

  // Itens de Batalha
  potion:            { icon: '🧪', name: 'Poção' }
};


export const STAMINA_RESTORE_TABLE = {
  // Berries (source: materials)
  oran_berry:        { restore: 20, source: 'materials' },
  sitrus_berry:      { restore: 35, source: 'materials' },
  lum_berry:         { restore: 40, source: 'materials', cureStatus: true },
  cheri_berry:       { restore: 15, source: 'materials', cureStatus: ['paralyze'] },
  chesto_berry:      { restore: 15, source: 'materials', cureStatus: ['sleep'] },
  pecha_berry:       { restore: 15, source: 'materials', cureStatus: ['poison','toxic'] },
  rawst_berry:       { restore: 15, source: 'materials', cureStatus: ['burn'] },
  aspear_berry:      { restore: 15, source: 'materials', cureStatus: ['freeze'] },
  leppa_berry:       { restore: 10, source: 'materials' },
  // Bebidas (source: items)
  fresh_water:       { restore: 25, source: 'items' },
  berry_juice:       { restore: 35, source: 'items' },
  soda_pop:          { restore: 40, source: 'items' },
  lemonade:          { restore: 55, source: 'items' },
  moomoo_milk:       { restore: 70, source: 'items' },
  // Ração (source: items)
  poke_food:         { restore: 30, source: 'items' },
  poke_food_premium: { restore: 60, source: 'items', cureStatus: true },
};

export const POKE_MART_DRINKS = [
  {
    id: 'fresh_water',
    name: 'Água Fresca',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',
    description: 'Restaura 25% de Energia. Barata e sempre disponível.',
    effect: { type: 'stamina', restore: 25 },
    price: 200,
    availableFrom: null,
  },
  {
    id: 'berry_juice',
    name: 'Suco de Berry',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berry-juice.png',
    description: 'Restaura 35% de Energia. Feito de Berries frescas.',
    effect: { type: 'stamina', restore: 35 },
    price: 250,
    availableFrom: 'boulder_badge',
  },
  {
    id: 'soda_pop',
    name: 'Soda Pop',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',
    description: 'Restaura 40% de Energia. Refrescante e eficaz.',
    effect: { type: 'stamina', restore: 40 },
    price: 300,
    availableFrom: 'cascade_badge',
  },
  {
    id: 'lemonade',
    name: 'Limonada',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',
    description: 'Restaura 55% de Energia. A melhor bebida da máquina.',
    effect: { type: 'stamina', restore: 55 },
    price: 350,
    availableFrom: 'thunder_badge',
  },
  {
    id: 'moomoo_milk',
    name: 'Leite MooMoo',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png',
    description: 'Restaura 70% de Energia. O mais nutritivo de todos.',
    effect: { type: 'stamina', restore: 70 },
    price: 500,
    availableFrom: 'rainbow_badge',
  },
];

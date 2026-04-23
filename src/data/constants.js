export const APP_VERSION = '1.7.6';
export const APP_VERSION_DATE = '23/04/2026';

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
  'https://play.pokemonshowdown.com/sprites/trainers/red.png',
  'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
  'https://play.pokemonshowdown.com/sprites/trainers/leaf.png',
  'https://play.pokemonshowdown.com/sprites/trainers/ethan.png',
  'https://play.pokemonshowdown.com/sprites/trainers/lyra.png',
  'https://play.pokemonshowdown.com/sprites/trainers/kris.png'
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
    items: { pokeballs: 5, potions: 2 }
  },
  team: [],
  pc: [],
  currentRoute: 'pallet_town',
  worldFlags: [],
  badges: [],
  caughtData: {},
  speciesMastery: {},
  settings: {
    battleSpeed: 1,
    displayMode: 'mobile'
  }
};

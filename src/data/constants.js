export const APP_VERSION = '1.6.28';
export const APP_VERSION_DATE = '2026-04-23 14:18';

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

export const trainerAvatars = [
  { id: 1, name: 'Red', img: 'https://play.pokemonshowdown.com/sprites/trainers/red.png' },
  { id: 2, name: 'Leaf', img: 'https://play.pokemonshowdown.com/sprites/trainers/leaf.png' },
  { id: 3, name: 'Ethan', img: 'https://play.pokemonshowdown.com/sprites/trainers/ethan.png' },
  { id: 4, name: 'Lyra', img: 'https://play.pokemonshowdown.com/sprites/trainers/lyra.png' },
  { id: 5, name: 'Brendan', img: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png' },
  { id: 6, name: 'May', img: 'https://play.pokemonshowdown.com/sprites/trainers/may.png' },
];

export const DEFAULT_GAME_STATE = {
  version: 1.6,
  currency: 100,
  inventory: { 
    materials: { 
      normal_essence: 0, fire_essence: 0, water_essence: 0, grass_essence: 0, 
      electric_essence: 0, ice_essence: 0, fighting_essence: 0, poison_essence: 0, 
      ground_essence: 0, flying_essence: 0, psychic_essence: 0, bug_essence: 0, 
      rock_essence: 0, ghost_essence: 0, dragon_essence: 0, steel_essence: 0, 
      fairy_essence: 0, dark_essence: 0, mystic_dust: 0, iron_ore: 0 
    },
    items: { pokeballs: 5, potions: 0, charcoal: 0 }
  },
  team: [], pc: [], badges: [], stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
  currentRoute: 'pallet_town',
  trainer: null, worldFlags: [],
  caughtData: {},
  speciesMastery: {},
  autoCapture: false,
  settings: { battleSpeed: 1, displayMode: 'mobile', levelCap: true },
  autoConfig: { autoPokeball: true, autoPotion: false, autoPotionHpPct: 30, focusPokemonIndex: 0 }
};

export const GYM_LEVEL_CAPS = {
  0: 14, 1: 21, 2: 26, 3: 32, 4: 43, 5: 46, 6: 50, 7: 55, 8: 100
};

// ── Sistema de Mega Evolução Permanente — PokéCraft Idle 2 ────────────────────
// Sprites via Pokémon Showdown: play.pokemonshowdown.com/sprites/dex/{showdownId}.png
// Cobertura: 48 Megas canônicas (XY/ORAS) + TODAS as novas de Legends: Z-A
// (jogo base + DLC Mega Dimension, fonte: Serebii) + Megas fan-made do jogo.
// IDs das pedras são canônicos: iguais aos usados em recipes.js (forja) e nos
// itens de evolução do pokedex.js — nunca divergir entre os três arquivos.
import { POKEDEX } from './pokedex.js';

export const MEGA_STONE_ICONS = {
  // ── KANTO ─────────────────────────────────────────────────────────────────
  venusaurite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/venusaurite.png',
  charizardite_x:  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charizardite-x.png',
  charizardite_y:  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charizardite-y.png',
  blastoisinite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/blastoisinite.png',
  beedrillite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/beedrillite.png',
  pidgeotite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pidgeotite.png',
  clefablite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/clefablite.png',
  alakazite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/alakazite.png',
  victreebelite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/victreebelite.png',
  slowbronite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/slowbronite.png',
  gengarite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gengarite.png',
  kangaskhanite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kangaskhanite.png',
  starmiite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/starmiite.png',
  pinsirite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pinsirite.png',
  gyaradosite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gyaradosite.png',
  aerodactylite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/aerodactylite.png',
  dragonitite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragonitite.png',
  mewtwonite_x:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mewtwonite-x.png',
  mewtwonite_y:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mewtwonite-y.png',
  // ── JOHTO ─────────────────────────────────────────────────────────────────
  meganiumite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meganiumite.png',
  feraligatrite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/feraligatrite.png',
  ampharosite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ampharosite.png',
  steelixite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/steelixite.png',
  scizorite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scizorite.png',
  heracronite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heracronite.png',
  skarmorite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/skarmorite.png',
  houndoominite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/houndoominite.png',
  tyranitarite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tyranitarite.png',
  // ── HOENN ─────────────────────────────────────────────────────────────────
  sceptilite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sceptilite.png',
  blazikenite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/blazikenite.png',
  swampertite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/swampertite.png',
  gardevoirite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gardevoirite.png',
  sableyite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sableyite.png',
  mawilite:        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mawilite.png',
  aggronite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/aggronite.png',
  medichamite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/medichamite.png',
  manectite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/manectite.png',
  sharpedonite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sharpedonite.png',
  cameruptite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cameruptite.png',
  altarianite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/altarianite.png',
  banettite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/banettite.png',
  absolite:        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/absolite.png',
  glalitite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/glalitite.png',
  salamencite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/salamencite.png',
  metagrossite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metagrossite.png',
  latiasite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/latiasite.png',
  latiosite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/latiosite.png',
  rayquazaite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-ascent.png',
  // ── SINNOH ────────────────────────────────────────────────────────────────
  lopunnite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lopunnite.png',
  garchompite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/garchompite.png',
  lucarionite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucarionite.png',
  abomasnowite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/abomasnowite.png',
  galladite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/galladite.png',
  froslassite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/froslassite.png',
  // ── UNOVA ─────────────────────────────────────────────────────────────────
  emboarite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/emboarite.png',
  excadrite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/excadrite.png',
  audinite:        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/audinite.png',
  chandelurite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/chandelurite.png',
  golurkite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/golurkite.png',
  // ── KALOS ─────────────────────────────────────────────────────────────────
  chesnaughtite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/chesnaughtite.png',
  delphoxite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/delphoxite.png',
  greninjite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/greninjite.png',
  floettite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/floettite.png',
  meowsticite_m:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meowsticite.png',
  meowsticite_f:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meowsticite.png',
  hawluchanite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hawluchanite.png',
  diancite:        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/diancite.png',
  // ── ALOLA ─────────────────────────────────────────────────────────────────
  crabominite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/crabominite.png',
  // ── GALAR ─────────────────────────────────────────────────────────────────
  drampanite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/drampanite.png',
  // ── PALDEA ────────────────────────────────────────────────────────────────
  scovillainite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scovillainite.png',
  glimmoranite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/glimmoranite.png',
  // ── DLC ───────────────────────────────────────────────────────────────────
  chimechoite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/chimechoite.png',
  // ── LEGENDS: Z-A — Mega Pedras Oficiais (confirmadas via Serebii) ──────────
  raichuite_x:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png',
  raichuite_y:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png',
  absolite_z:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/absolite.png',
  staraptorite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sharp-beak.png',
  garchompite_z:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/garchompite.png',
  lucarionite_z:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucarionite.png',
  darkraiite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dread-plate.png',
  scolipidite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poison-barb.png',
  scraftite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dark-gem.png',
  eelektrossite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/zap-plate.png',
  pyroarite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/flame-plate.png',
  malamarite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mind-plate.png',
  barbaraclite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/stone-plate.png',
  dragalgite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/draco-plate.png',
  zygardite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/earth-plate.png',
  golisopodite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/insect-plate.png',
  magearnaite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png',
  magearnaite_oc:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png',
  zeraoraite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/zap-plate.png',
  falinksite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png',
  tatsugirite_c:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/draco-plate.png',
  tatsugirite_d:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/draco-plate.png',
  tatsugirite_s:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/draco-plate.png',
  baxcaliburite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/icicle-plate.png',
  // ── Megas adicionais (fan + Z-A) — gerados na reconciliação v2.12 ─────────
  butterfreeite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/insect-plate.png',
  machampite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png',
  typhlosionite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/flame-plate.png',
  kingdraite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/splash-plate.png',
  miltankite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/star-piece.png',
  blisseyite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/star-piece.png',
  shedinjite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/insect-plate.png',
  flygonite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/draco-plate.png',
  torterrite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png',
  infernapite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/flame-plate.png',
  empoleonite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/splash-plate.png',
  luxrayite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/zap-plate.png',
  heatranite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/flame-plate.png',
  serperiorite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png',
  samurottite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/splash-plate.png',
  haxorusite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/draco-plate.png',
  hydreigonite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/draco-plate.png',
  goodraite:       'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/draco-plate.png',
  decidueyite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png',
  incineroarite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/flame-plate.png',
  primarinite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/splash-plate.png',
  kommo_oite:      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/draco-plate.png',
  rillaboomite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png',
  cinderacite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/flame-plate.png',
  inteleonite:     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/splash-plate.png',
  dragapultite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/draco-plate.png',
  meowscaradite:   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png',
  skeledirgite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/flame-plate.png',
  quaquavalite:    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/splash-plate.png',
};

// Mapa completo de Mega Evoluções — Pokémon Legends: Z-A
// showdownId: slug do sprite em play.pokemonshowdown.com/sprites/dex/
export const MEGA_EVOLUTION_MAP = {

  // ══════════════════════════════════════════════════════════════════════════
  // KANTO
  // ══════════════════════════════════════════════════════════════════════════

  venusaurite: {
    baseId: 3, showdownId: 'venusaur-mega',
    name: 'Mega Venusaur', types: ['Grass', 'Poison'],
    statBonus: { spAtk: 0.25, spDef: 0.25, defense: 0.20 },
    craftCost: { grass_essence: 15, leaf_stone: 3, currency: 2000 },
  },
  charizardite_x: {
    baseId: 6, showdownId: 'charizard-megax',
    name: 'Mega Charizard X', types: ['Fire', 'Dragon'],
    statBonus: { attack: 0.40, spAtk: 0.20, defense: 0.15, speed: 0.05 },
    craftCost: { fire_essence: 15, dragon_scale: 5, currency: 2000 },
  },
  charizardite_y: {
    baseId: 6, showdownId: 'charizard-megay',
    name: 'Mega Charizard Y', types: ['Fire', 'Flying'],
    statBonus: { spAtk: 0.50, speed: 0.10, defense: 0.10 },
    craftCost: { fire_essence: 15, dragon_scale: 5, currency: 2000 },
  },
  blastoisinite: {
    baseId: 9, showdownId: 'blastoise-mega',
    name: 'Mega Blastoise', types: ['Water'],
    statBonus: { spAtk: 0.30, defense: 0.25, spDef: 0.20 },
    craftCost: { water_essence: 15, pearl: 5, currency: 2000 },
  },
  beedrillite: {
    baseId: 15, showdownId: 'beedrill-mega',
    name: 'Mega Beedrill', types: ['Bug', 'Poison'],
    statBonus: { attack: 0.50, speed: 0.25, defense: 0.05 },
    craftCost: { bug_essence: 10, currency: 1200 },
  },
  pidgeotite: {
    baseId: 18, showdownId: 'pidgeot-mega',
    name: 'Mega Pidgeot', types: ['Normal', 'Flying'],
    statBonus: { spAtk: 0.35, speed: 0.25, defense: 0.10 },
    craftCost: { normal_essence: 8, flying_essence: 5, currency: 1200 },
  },
  clefablite: {
    baseId: 36, showdownId: 'clefable-mega',
    name: 'Mega Clefable', types: ['Fairy', 'Psychic'],
    statBonus: { spAtk: 0.35, spDef: 0.25, defense: 0.15 },
    craftCost: { fairy_essence: 10, psychic_essence: 5, currency: 1500 },
  },
  alakazite: {
    baseId: 65, showdownId: 'alakazam-mega',
    name: 'Mega Alakazam', types: ['Psychic'],
    statBonus: { spAtk: 0.45, speed: 0.15, spDef: 0.10 },
    craftCost: { psychic_essence: 10, link_cable: 2, currency: 1500 },
  },
  victreebelite: {
    baseId: 71, showdownId: 'victreebel-mega',
    name: 'Mega Victreebel', types: ['Grass', 'Poison'],
    statBonus: { spAtk: 0.35, attack: 0.25, speed: 0.15 },
    craftCost: { grass_essence: 10, bug_essence: 5, currency: 1300 },
  },
  slowbronite: {
    baseId: 80, showdownId: 'slowbro-mega',
    name: 'Mega Slowbro', types: ['Water', 'Psychic'],
    statBonus: { spAtk: 0.30, defense: 0.35, spDef: 0.15 },
    craftCost: { water_essence: 10, psychic_essence: 5, currency: 1500 },
  },
  gengarite: {
    baseId: 94, showdownId: 'gengar-mega',
    name: 'Mega Gengar', types: ['Ghost', 'Poison'],
    statBonus: { spAtk: 0.40, speed: 0.20, attack: 0.10 },
    craftCost: { ghost_essence: 10, dusk_stone: 3, currency: 1500 },
  },
  kangaskhanite: {
    baseId: 115, showdownId: 'kangaskhan-mega',
    name: 'Mega Kangaskhan', types: ['Normal'],
    statBonus: { attack: 0.30, speed: 0.20, defense: 0.15 },
    craftCost: { normal_essence: 15, currency: 1800 },
  },
  starmiite: {
    baseId: 121, showdownId: 'starmie-mega',
    name: 'Mega Starmie', types: ['Water', 'Psychic'],
    statBonus: { spAtk: 0.40, speed: 0.30, spDef: 0.10 },
    craftCost: { water_essence: 10, psychic_essence: 5, currency: 1500 },
  },
  pinsirite: {
    baseId: 127, showdownId: 'pinsir-mega',
    name: 'Mega Pinsir', types: ['Bug', 'Flying'],
    statBonus: { attack: 0.45, speed: 0.20, defense: 0.10 },
    craftCost: { bug_essence: 10, currency: 1500 },
  },
  gyaradosite: {
    baseId: 130, showdownId: 'gyarados-mega',
    name: 'Mega Gyarados', types: ['Water', 'Dark'],
    statBonus: { attack: 0.40, defense: 0.20, spDef: 0.15 },
    craftCost: { water_essence: 15, magikarp_scale: 5, currency: 2000 },
  },
  aerodactylite: {
    baseId: 142, showdownId: 'aerodactyl-mega',
    name: 'Mega Aerodactyl', types: ['Rock', 'Flying'],
    statBonus: { attack: 0.30, speed: 0.30, defense: 0.15 },
    craftCost: { rock_essence: 10, old_amber: 3, currency: 1800 },
  },
  dragonitite: {
    baseId: 149, showdownId: 'dragonite-mega',
    name: 'Mega Dragonite', types: ['Dragon', 'Flying'],
    statBonus: { attack: 0.35, spAtk: 0.20, speed: 0.20 },
    craftCost: { dragon_scale: 8, flying_essence: 5, currency: 2500 },
  },
  mewtwonite_x: {
    baseId: 150, showdownId: 'mewtwo-megax',
    name: 'Mega Mewtwo X', types: ['Psychic', 'Fighting'],
    statBonus: { attack: 0.45, defense: 0.20, speed: 0.15 },
    craftCost: { psychic_essence: 20, fighting_essence: 10, currency: 5000 },
  },
  mewtwonite_y: {
    baseId: 150, showdownId: 'mewtwo-megay',
    name: 'Mega Mewtwo Y', types: ['Psychic'],
    statBonus: { spAtk: 0.50, speed: 0.20, defense: 0.10 },
    craftCost: { psychic_essence: 20, currency: 5000 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // JOHTO
  // ══════════════════════════════════════════════════════════════════════════

  meganiumite: {
    baseId: 154, showdownId: 'meganium-mega',
    name: 'Mega Meganium', types: ['Grass', 'Fairy'],
    statBonus: { spAtk: 0.25, spDef: 0.35, defense: 0.20 },
    craftCost: { grass_essence: 12, fairy_essence: 5, currency: 1800 },
  },
  feraligatrite: {
    baseId: 160, showdownId: 'feraligatr-mega',
    name: 'Mega Feraligatr', types: ['Water', 'Dark'],
    statBonus: { attack: 0.40, speed: 0.20, defense: 0.15 },
    craftCost: { water_essence: 12, dark_essence: 5, currency: 1800 },
  },
  ampharosite: {
    baseId: 181, showdownId: 'ampharos-mega',
    name: 'Mega Ampharos', types: ['Electric', 'Dragon'],
    statBonus: { spAtk: 0.40, spDef: 0.20, defense: 0.15 },
    craftCost: { electric_essence: 12, dragon_scale: 3, currency: 1800 },
  },
  steelixite: {
    baseId: 208, showdownId: 'steelix-mega',
    name: 'Mega Steelix', types: ['Steel', 'Ground'],
    statBonus: { defense: 0.50, attack: 0.15, spDef: 0.15 },
    craftCost: { steel_essence: 12, rock_essence: 5, currency: 1800 },
  },
  scizorite: {
    baseId: 212, showdownId: 'scizor-mega',
    name: 'Mega Scizor', types: ['Bug', 'Steel'],
    statBonus: { attack: 0.40, defense: 0.25, spDef: 0.10 },
    craftCost: { bug_essence: 10, steel_essence: 5, currency: 1800 },
  },
  heracronite: {
    baseId: 214, showdownId: 'heracross-mega',
    name: 'Mega Heracross', types: ['Bug', 'Fighting'],
    statBonus: { attack: 0.45, defense: 0.15, spDef: 0.15 },
    craftCost: { bug_essence: 10, fighting_essence: 5, currency: 1800 },
  },
  skarmorite: {
    baseId: 227, showdownId: 'skarmory-mega',
    name: 'Mega Skarmory', types: ['Steel', 'Flying'],
    statBonus: { defense: 0.45, attack: 0.15, speed: 0.15 },
    craftCost: { steel_essence: 10, flying_essence: 5, currency: 1800 },
  },
  houndoominite: {
    baseId: 229, showdownId: 'houndoom-mega',
    name: 'Mega Houndoom', types: ['Dark', 'Fire'],
    statBonus: { spAtk: 0.40, speed: 0.20, spDef: 0.10 },
    craftCost: { fire_essence: 10, dark_essence: 5, currency: 1800 },
  },
  tyranitarite: {
    baseId: 248, showdownId: 'tyranitar-mega',
    name: 'Mega Tyranitar', types: ['Rock', 'Dark'],
    statBonus: { attack: 0.35, defense: 0.30, spDef: 0.15 },
    craftCost: { rock_essence: 15, dark_essence: 8, currency: 2500 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // HOENN
  // ══════════════════════════════════════════════════════════════════════════

  sceptilite: {
    baseId: 254, showdownId: 'sceptile-mega',
    name: 'Mega Sceptile', types: ['Grass', 'Dragon'],
    statBonus: { spAtk: 0.30, speed: 0.30, attack: 0.15 },
    craftCost: { grass_essence: 12, dragon_scale: 3, currency: 2000 },
  },
  blazikenite: {
    baseId: 257, showdownId: 'blaziken-mega',
    name: 'Mega Blaziken', types: ['Fire', 'Fighting'],
    statBonus: { attack: 0.40, spAtk: 0.20, speed: 0.15 },
    craftCost: { fire_essence: 12, fighting_essence: 5, currency: 2000 },
  },
  swampertite: {
    baseId: 260, showdownId: 'swampert-mega',
    name: 'Mega Swampert', types: ['Water', 'Ground'],
    statBonus: { attack: 0.35, defense: 0.25, spDef: 0.15 },
    craftCost: { water_essence: 12, rock_essence: 5, currency: 2000 },
  },
  gardevoirite: {
    baseId: 282, showdownId: 'gardevoir-mega',
    name: 'Mega Gardevoir', types: ['Psychic', 'Fairy'],
    statBonus: { spAtk: 0.40, spDef: 0.20, defense: 0.10 },
    craftCost: { psychic_essence: 12, fairy_essence: 5, currency: 2000 },
  },
  sableyite: {
    baseId: 302, showdownId: 'sableye-mega',
    name: 'Mega Sableye', types: ['Dark', 'Ghost'],
    statBonus: { defense: 0.40, spDef: 0.30, attack: 0.10 },
    craftCost: { dark_essence: 10, ghost_essence: 5, currency: 1500 },
  },
  mawilite: {
    baseId: 303, showdownId: 'mawile-mega',
    name: 'Mega Mawile', types: ['Steel', 'Fairy'],
    statBonus: { attack: 0.35, defense: 0.30, spDef: 0.15 },
    craftCost: { steel_essence: 8, fairy_essence: 8, currency: 1500 },
  },
  aggronite: {
    baseId: 306, showdownId: 'aggron-mega',
    name: 'Mega Aggron', types: ['Steel'],
    statBonus: { defense: 0.50, attack: 0.20, spDef: 0.10 },
    craftCost: { steel_essence: 15, rock_essence: 8, currency: 2000 },
  },
  medichamite: {
    baseId: 308, showdownId: 'medicham-mega',
    name: 'Mega Medicham', types: ['Fighting', 'Psychic'],
    statBonus: { attack: 0.35, speed: 0.20, defense: 0.15 },
    craftCost: { fighting_essence: 10, psychic_essence: 5, currency: 1500 },
  },
  manectite: {
    baseId: 310, showdownId: 'manectric-mega',
    name: 'Mega Manectric', types: ['Electric'],
    statBonus: { spAtk: 0.40, speed: 0.25, defense: 0.10 },
    craftCost: { electric_essence: 12, currency: 1500 },
  },
  sharpedonite: {
    baseId: 319, showdownId: 'sharpedo-mega',
    name: 'Mega Sharpedo', types: ['Water', 'Dark'],
    statBonus: { attack: 0.45, speed: 0.25, defense: 0.10 },
    craftCost: { water_essence: 10, dark_essence: 5, currency: 1500 },
  },
  cameruptite: {
    baseId: 323, showdownId: 'camerupt-mega',
    name: 'Mega Camerupt', types: ['Fire', 'Ground'],
    statBonus: { spAtk: 0.40, defense: 0.25, spDef: 0.15 },
    craftCost: { fire_essence: 10, rock_essence: 5, currency: 1500 },
  },
  altarianite: {
    baseId: 334, showdownId: 'altaria-mega',
    name: 'Mega Altaria', types: ['Dragon', 'Fairy'],
    statBonus: { attack: 0.30, spAtk: 0.25, defense: 0.20 },
    craftCost: { dragon_scale: 6, fairy_essence: 6, currency: 1800 },
  },
  banettite: {
    baseId: 354, showdownId: 'banette-mega',
    name: 'Mega Banette', types: ['Ghost'],
    statBonus: { attack: 0.45, speed: 0.15, defense: 0.10 },
    craftCost: { ghost_essence: 12, dusk_stone: 2, currency: 1500 },
  },
  absolite: {
    baseId: 359, showdownId: 'absol-mega',
    name: 'Mega Absol', types: ['Dark'],
    statBonus: { attack: 0.40, speed: 0.20, spAtk: 0.10 },
    craftCost: { dark_essence: 12, currency: 1500 },
  },
  glalitite: {
    baseId: 362, showdownId: 'glalie-mega',
    name: 'Mega Glalie', types: ['Ice'],
    statBonus: { attack: 0.35, speed: 0.25, spAtk: 0.15 },
    craftCost: { ice_essence: 12, currency: 1500 },
  },
  salamencite: {
    baseId: 373, showdownId: 'salamence-mega',
    name: 'Mega Salamence', types: ['Dragon', 'Flying'],
    statBonus: { attack: 0.35, spAtk: 0.20, speed: 0.20 },
    craftCost: { dragon_scale: 8, flying_essence: 5, currency: 2500 },
  },
  metagrossite: {
    baseId: 376, showdownId: 'metagross-mega',
    name: 'Mega Metagross', types: ['Steel', 'Psychic'],
    statBonus: { attack: 0.35, defense: 0.25, spDef: 0.15 },
    craftCost: { steel_essence: 15, psychic_essence: 8, currency: 2500 },
  },
  latiasite: {
    baseId: 380, showdownId: 'latias-mega',
    name: 'Mega Latias', types: ['Dragon', 'Psychic'],
    statBonus: { spAtk: 0.35, spDef: 0.30, speed: 0.15 },
    craftCost: { dragon_scale: 8, psychic_essence: 8, currency: 3000 },
  },
  latiosite: {
    baseId: 381, showdownId: 'latios-mega',
    name: 'Mega Latios', types: ['Dragon', 'Psychic'],
    statBonus: { spAtk: 0.40, speed: 0.20, defense: 0.15 },
    craftCost: { dragon_scale: 8, psychic_essence: 8, currency: 3000 },
  },
  rayquazaite: {
    baseId: 384, showdownId: 'rayquaza-mega',
    name: 'Mega Rayquaza', types: ['Dragon', 'Flying'],
    statBonus: { attack: 0.40, spAtk: 0.30, speed: 0.15 },
    craftCost: { dragon_scale: 20, flying_essence: 10, currency: 8000 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SINNOH
  // ══════════════════════════════════════════════════════════════════════════

  lopunnite: {
    baseId: 428, showdownId: 'lopunny-mega',
    name: 'Mega Lopunny', types: ['Normal', 'Fighting'],
    statBonus: { attack: 0.35, speed: 0.30, defense: 0.15 },
    craftCost: { normal_essence: 10, fighting_essence: 5, currency: 1800 },
  },
  garchompite: {
    baseId: 445, showdownId: 'garchomp-mega',
    name: 'Mega Garchomp', types: ['Dragon', 'Ground'],
    statBonus: { attack: 0.40, defense: 0.20, spAtk: 0.15 },
    craftCost: { dragon_scale: 10, rock_essence: 5, currency: 2500 },
  },
  lucarionite: {
    baseId: 448, showdownId: 'lucario-mega',
    name: 'Mega Lucario', types: ['Fighting', 'Steel'],
    statBonus: { attack: 0.35, spAtk: 0.25, speed: 0.15 },
    craftCost: { fighting_essence: 12, steel_essence: 8, currency: 2000 },
  },
  abomasnowite: {
    baseId: 460, showdownId: 'abomasnow-mega',
    name: 'Mega Abomasnow', types: ['Grass', 'Ice'],
    statBonus: { attack: 0.25, spAtk: 0.25, defense: 0.20 },
    craftCost: { grass_essence: 10, ice_essence: 10, currency: 1800 },
  },
  galladite: {
    baseId: 475, showdownId: 'gallade-mega',
    name: 'Mega Gallade', types: ['Psychic', 'Fighting'],
    statBonus: { attack: 0.40, speed: 0.20, defense: 0.15 },
    craftCost: { fighting_essence: 12, psychic_essence: 5, currency: 2000 },
  },
  froslassite: {
    baseId: 478, showdownId: 'froslass-mega',
    name: 'Mega Froslass', types: ['Ice', 'Ghost'],
    statBonus: { spAtk: 0.35, speed: 0.30, defense: 0.10 },
    craftCost: { ice_essence: 10, ghost_essence: 5, currency: 1800 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // UNOVA
  // ══════════════════════════════════════════════════════════════════════════

  emboarite: {
    baseId: 500, showdownId: 'emboar-mega',
    name: 'Mega Emboar', types: ['Fire', 'Fighting'],
    statBonus: { attack: 0.40, spAtk: 0.15, defense: 0.15 },
    craftCost: { fire_essence: 12, fighting_essence: 5, currency: 2000 },
  },
  excadrite: {
    baseId: 530, showdownId: 'excadrill-mega',
    name: 'Mega Excadrill', types: ['Ground', 'Steel'],
    statBonus: { attack: 0.35, defense: 0.30, speed: 0.10 },
    craftCost: { steel_essence: 10, rock_essence: 5, currency: 1800 },
  },
  audinite: {
    baseId: 531, showdownId: 'audino-mega',
    name: 'Mega Audino', types: ['Normal', 'Fairy'],
    statBonus: { spDef: 0.35, defense: 0.30, spAtk: 0.15 },
    craftCost: { normal_essence: 8, fairy_essence: 8, currency: 1500 },
  },
  chandelurite: {
    baseId: 609, showdownId: 'chandelure-mega',
    name: 'Mega Chandelure', types: ['Ghost', 'Fire'],
    statBonus: { spAtk: 0.45, spDef: 0.15, defense: 0.10 },
    craftCost: { ghost_essence: 12, fire_essence: 5, currency: 2000 },
  },
  golurkite: {
    baseId: 623, showdownId: 'golurk-mega',
    name: 'Mega Golurk', types: ['Ground', 'Ghost'],
    statBonus: { attack: 0.40, defense: 0.20, spDef: 0.15 },
    craftCost: { ghost_essence: 10, rock_essence: 8, currency: 2000 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // KALOS
  // ══════════════════════════════════════════════════════════════════════════

  chesnaughtite: {
    baseId: 652, showdownId: 'chesnaught-mega',
    name: 'Mega Chesnaught', types: ['Grass', 'Fighting'],
    statBonus: { defense: 0.40, attack: 0.20, spDef: 0.15 },
    craftCost: { grass_essence: 12, fighting_essence: 5, currency: 2000 },
  },
  delphoxite: {
    baseId: 655, showdownId: 'delphox-mega',
    name: 'Mega Delphox', types: ['Fire', 'Psychic'],
    statBonus: { spAtk: 0.40, speed: 0.20, spDef: 0.15 },
    craftCost: { fire_essence: 12, psychic_essence: 5, currency: 2000 },
  },
  greninjite: {
    baseId: 658, showdownId: 'greninja-mega',
    name: 'Mega Greninja', types: ['Water', 'Dark'],
    statBonus: { attack: 0.30, speed: 0.30, spAtk: 0.20 },
    craftCost: { water_essence: 12, dark_essence: 5, currency: 2000 },
  },
  floettite: {
    baseId: 670, showdownId: 'floette-mega',
    name: 'Mega Floette', types: ['Fairy'],
    statBonus: { spAtk: 0.40, spDef: 0.30, defense: 0.10 },
    craftCost: { fairy_essence: 15, currency: 1500 },
  },
  meowsticite_m: {
    baseId: 678, showdownId: 'meowstic-mmega',
    name: 'Mega Meowstic', types: ['Psychic'],
    statBonus: { spAtk: 0.35, speed: 0.25, spDef: 0.15 },
    craftCost: { psychic_essence: 8, currency: 1500 },
  },
  meowsticite_f: {
    baseId: 678, showdownId: 'meowstic-fmega',
    name: 'Mega Meowstic-F', types: ['Psychic', 'Dark'],
    statBonus: { spAtk: 0.30, spDef: 0.30, speed: 0.15 },
    craftCost: { psychic_essence: 8, dark_essence: 3, currency: 1500 },
  },
  hawluchanite: {
    baseId: 701, showdownId: 'hawlucha-mega',
    name: 'Mega Hawlucha', types: ['Fighting', 'Flying'],
    statBonus: { attack: 0.35, speed: 0.30, defense: 0.15 },
    craftCost: { fighting_essence: 10, flying_essence: 5, currency: 1800 },
  },
  diancite: {
    baseId: 719, showdownId: 'diancie-mega',
    name: 'Mega Diancie', types: ['Rock', 'Fairy'],
    statBonus: { attack: 0.35, spAtk: 0.35, defense: 0.10 },
    craftCost: { rock_essence: 10, fairy_essence: 10, currency: 3000 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ALOLA
  // ══════════════════════════════════════════════════════════════════════════

  crabominite: {
    baseId: 740, showdownId: 'crabominable-mega',
    name: 'Mega Crabominable', types: ['Ice', 'Fighting'],
    statBonus: { attack: 0.45, defense: 0.20, spDef: 0.10 },
    craftCost: { ice_essence: 10, fighting_essence: 5, currency: 1800 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GALAR
  // ══════════════════════════════════════════════════════════════════════════

  drampanite: {
    baseId: 780, showdownId: 'drampa-mega',
    name: 'Mega Drampa', types: ['Normal', 'Dragon'],
    statBonus: { spAtk: 0.40, spDef: 0.20, defense: 0.15 },
    craftCost: { dragon_scale: 6, normal_essence: 6, currency: 2000 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PALDEA
  // ══════════════════════════════════════════════════════════════════════════

  scovillainite: {
    baseId: 952, showdownId: 'scovillain-mega',
    name: 'Mega Scovillain', types: ['Grass', 'Fire'],
    statBonus: { attack: 0.35, spAtk: 0.25, speed: 0.15 },
    craftCost: { grass_essence: 10, fire_essence: 10, currency: 2000 },
  },
  glimmoranite: {
    baseId: 970, showdownId: 'glimmora-mega',
    name: 'Mega Glimmora', types: ['Rock', 'Poison'],
    statBonus: { spAtk: 0.40, defense: 0.20, spDef: 0.20 },
    craftCost: { rock_essence: 10, bug_essence: 5, currency: 2000 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DLC — Mega Dimension
  // ══════════════════════════════════════════════════════════════════════════

  chimechoite: {
    baseId: 358, showdownId: 'chimecho-mega',
    name: 'Mega Chimecho', types: ['Psychic'],
    statBonus: { spAtk: 0.35, spDef: 0.30, speed: 0.15 },
    craftCost: { psychic_essence: 12, currency: 2000 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEGENDS: Z-A — Mega Evoluções Oficiais (confirmadas via Serebii)
  // ══════════════════════════════════════════════════════════════════════════

  // Raichu X (físico) e Y (especial) — variantes exclusivas de Z-A
  raichuite_x: {
    baseId: 26, showdownId: 'raichu-megax',
    name: 'Mega Raichu X', types: ['Electric', 'Psychic'],
    statBonus: { attack: 0.45, speed: 0.20, defense: 0.10 },
    craftCost: { electric_essence: 12, psychic_essence: 5, currency: 2500 },
  },
  raichuite_y: {
    baseId: 26, showdownId: 'raichu-megay',
    name: 'Mega Raichu Y', types: ['Electric'],
    statBonus: { spAtk: 0.50, speed: 0.20, defense: 0.10 },
    craftCost: { electric_essence: 12, currency: 2500 },
  },

  // Absol Z — variante Z com tipo Fantasma adicionado
  absolite_z: {
    baseId: 359, showdownId: 'absol-megaz',
    name: 'Mega Absol Z', types: ['Dark', 'Ghost'],
    statBonus: { attack: 0.45, speed: 0.20, spAtk: 0.10 },
    craftCost: { dark_essence: 15, ghost_essence: 5, currency: 3000 },
  },

  // Staraptor — Normal/Flying
  staraptorite: {
    baseId: 398, showdownId: 'staraptor-mega',
    name: 'Mega Staraptor', types: ['Normal', 'Flying'],
    statBonus: { attack: 0.40, speed: 0.25, defense: 0.10 },
    craftCost: { normal_essence: 10, flying_essence: 8, currency: 2000 },
  },

  // Garchomp Z — variante Z (Dragon/Ground)
  garchompite_z: {
    baseId: 445, showdownId: 'garchomp-megaz',
    name: 'Mega Garchomp Z', types: ['Dragon', 'Ground'],
    statBonus: { attack: 0.40, defense: 0.25, speed: 0.15 },
    craftCost: { dragon_scale: 12, rock_essence: 8, currency: 3500 },
  },

  // Lucario Z — variante Z (Fighting/Steel)
  lucarionite_z: {
    baseId: 448, showdownId: 'lucario-megaz',
    name: 'Mega Lucario Z', types: ['Fighting', 'Steel'],
    statBonus: { attack: 0.35, spAtk: 0.30, speed: 0.15 },
    craftCost: { fighting_essence: 15, steel_essence: 8, currency: 3500 },
  },

  // Darkrai — Dark
  darkraiite: {
    baseId: 491, showdownId: 'darkrai-mega',
    name: 'Mega Darkrai', types: ['Dark'],
    statBonus: { spAtk: 0.45, speed: 0.25, defense: 0.10 },
    craftCost: { dark_essence: 15, ghost_essence: 5, currency: 4000 },
  },

  // Scolipede — Bug/Poison
  scolipidite: {
    baseId: 545, showdownId: 'scolipede-mega',
    name: 'Mega Scolipede', types: ['Bug', 'Poison'],
    statBonus: { attack: 0.40, speed: 0.30, defense: 0.10 },
    craftCost: { bug_essence: 12, poison_essence: 8, currency: 2000 },
  },

  // Scrafty — Dark/Fighting
  scraftite: {
    baseId: 560, showdownId: 'scrafty-mega',
    name: 'Mega Scrafty', types: ['Dark', 'Fighting'],
    statBonus: { attack: 0.35, defense: 0.30, spDef: 0.15 },
    craftCost: { dark_essence: 10, fighting_essence: 8, currency: 2000 },
  },

  // Eelektross — Electric
  eelektrossite: {
    baseId: 587, showdownId: 'eelektross-mega',
    name: 'Mega Eelektross', types: ['Electric'],
    statBonus: { attack: 0.30, spAtk: 0.30, defense: 0.20 },
    craftCost: { electric_essence: 15, currency: 2000 },
  },

  // Pyroar — Fire/Normal
  pyroarite: {
    baseId: 668, showdownId: 'pyroar-mega',
    name: 'Mega Pyroar', types: ['Fire', 'Normal'],
    statBonus: { spAtk: 0.40, speed: 0.30, defense: 0.10 },
    craftCost: { fire_essence: 12, normal_essence: 5, currency: 2000 },
  },

  // Malamar — Psychic/Dark
  malamarite: {
    baseId: 687, showdownId: 'malamar-mega',
    name: 'Mega Malamar', types: ['Psychic', 'Dark'],
    statBonus: { attack: 0.35, spDef: 0.25, defense: 0.20 },
    craftCost: { psychic_essence: 10, dark_essence: 8, currency: 2000 },
  },

  // Barbaracle — Rock/Water
  barbaraclite: {
    baseId: 689, showdownId: 'barbaracle-mega',
    name: 'Mega Barbaracle', types: ['Rock', 'Water'],
    statBonus: { attack: 0.40, defense: 0.25, speed: 0.10 },
    craftCost: { rock_essence: 12, water_essence: 8, currency: 2000 },
  },

  // Dragalge — Poison/Dragon
  dragalgite: {
    baseId: 691, showdownId: 'dragalge-mega',
    name: 'Mega Dragalge', types: ['Poison', 'Dragon'],
    statBonus: { spAtk: 0.40, spDef: 0.25, defense: 0.10 },
    craftCost: { poison_essence: 12, dragon_scale: 5, currency: 2000 },
  },

  // Zygarde — Dragon/Ground (Forma Completa)
  zygardite: {
    baseId: 718, showdownId: 'zygarde-mega',
    name: 'Mega Zygarde', types: ['Dragon', 'Ground'],
    statBonus: { defense: 0.30, spDef: 0.25, attack: 0.20 },
    craftCost: { dragon_scale: 15, rock_essence: 10, currency: 5000 },
  },

  // Golisopod — Bug/Water
  golisopodite: {
    baseId: 768, showdownId: 'golisopod-mega',
    name: 'Mega Golisopod', types: ['Bug', 'Water'],
    statBonus: { attack: 0.40, defense: 0.30, spDef: 0.10 },
    craftCost: { bug_essence: 12, water_essence: 8, currency: 2500 },
  },

  // Magearna — Steel/Fairy
  magearnaite: {
    baseId: 801, showdownId: 'magearna-mega',
    name: 'Mega Magearna', types: ['Steel', 'Fairy'],
    statBonus: { spAtk: 0.35, spDef: 0.30, defense: 0.15 },
    craftCost: { steel_essence: 15, fairy_essence: 10, currency: 4000 },
  },

  // Magearna Original Color — Steel/Fairy (forma alternativa)
  magearnaite_oc: {
    baseId: 801, showdownId: 'magearna-original-mega',
    name: 'Mega Magearna (Cor Original)', types: ['Steel', 'Fairy'],
    statBonus: { spAtk: 0.35, spDef: 0.30, defense: 0.15 },
    craftCost: { steel_essence: 15, fairy_essence: 10, currency: 4000 },
  },

  // Zeraora — Electric
  zeraoraite: {
    baseId: 807, showdownId: 'zeraora-mega',
    name: 'Mega Zeraora', types: ['Electric'],
    statBonus: { speed: 0.40, attack: 0.30, defense: 0.10 },
    craftCost: { electric_essence: 15, fighting_essence: 5, currency: 4000 },
  },

  // Falinks — Fighting
  falinksite: {
    baseId: 878, showdownId: 'falinks-mega',
    name: 'Mega Falinks', types: ['Fighting'],
    statBonus: { attack: 0.40, defense: 0.30, speed: 0.10 },
    craftCost: { fighting_essence: 15, currency: 2000 },
  },

  // Tatsugiri — Dragon/Water (3 formas)
  tatsugirite_c: {
    baseId: 978, showdownId: 'tatsugiri-curly-mega',
    name: 'Mega Tatsugiri (Forma Enrolada)', types: ['Dragon', 'Water'],
    statBonus: { spAtk: 0.45, speed: 0.20, defense: 0.10 },
    craftCost: { dragon_scale: 10, water_essence: 8, currency: 2500 },
  },
  tatsugirite_d: {
    baseId: 978, showdownId: 'tatsugiri-droopy-mega',
    name: 'Mega Tatsugiri (Forma Caída)', types: ['Dragon', 'Water'],
    statBonus: { spAtk: 0.40, spDef: 0.25, speed: 0.10 },
    craftCost: { dragon_scale: 10, water_essence: 8, currency: 2500 },
  },
  tatsugirite_s: {
    baseId: 978, showdownId: 'tatsugiri-stretchy-mega',
    name: 'Mega Tatsugiri (Forma Esticada)', types: ['Dragon', 'Water'],
    statBonus: { spAtk: 0.35, speed: 0.35, defense: 0.10 },
    craftCost: { dragon_scale: 10, water_essence: 8, currency: 2500 },
  },

  // Baxcalibur — Dragon/Ice
  baxcaliburite: {
    baseId: 998, showdownId: 'baxcalibur-mega',
    name: 'Mega Baxcalibur', types: ['Dragon', 'Ice'],
    statBonus: { attack: 0.40, defense: 0.25, spDef: 0.10 },
    craftCost: { dragon_scale: 12, ice_crystal: 8, currency: 3000 },
  },


  // ══════════════════════════════════════════════════════════════════════════
  // RECONCILIAÇÃO v2.12 — pedras com receita/Pokédex que faltavam no mapa
  // (stats derivados das entradas 20xxx da Pokédex)
  // ══════════════════════════════════════════════════════════════════════════

  butterfreeite: {
    baseId: 12, megaId: 20012, showdownId: 'butterfree-mega',
    name: 'Mega Butterfree', types: ['Bug', 'Psychic'],
    statBonus: { attack: 0.44, defense: 0.4, spAtk: 0.33, spDef: 0.38 },
    craftCost: { mega_stone_shard: 15, bug_essence: 150, psychic_essence: 50, currency: 75000 },
  },
  machampite: {
    baseId: 68, megaId: 20068, showdownId: 'machamp-mega',
    name: 'Mega Machamp', types: ['Fighting'],
    statBonus: { attack: 0.23, defense: 0.25, spAtk: 0.31, spDef: 0.24, speed: 0.18 },
    craftCost: { mega_stone_shard: 15, fighting_essence: 150, currency: 75000 },
  },
  typhlosionite: {
    baseId: 157, megaId: 20157, showdownId: 'typhlosion-mega',
    name: 'Mega Typhlosion', types: ['Fire', 'Ghost'],
    statBonus: { attack: 0.24, defense: 0.26, spAtk: 0.37, spDef: 0.24 },
    craftCost: { mega_stone_shard: 15, fire_essence: 150, ghost_essence: 50, currency: 75000 },
  },
  kingdraite: {
    baseId: 230, megaId: 20230, showdownId: 'kingdra-mega',
    name: 'Mega Kingdra', types: ['Water', 'Dragon'],
    statBonus: { attack: 0.26, defense: 0.26, spAtk: 0.32, spDef: 0.26, speed: 0.18 },
    craftCost: { mega_stone_shard: 25, water_essence: 250, dragon_essence: 100, currency: 150000 },
  },
  miltankite: {
    baseId: 241, megaId: 20241, showdownId: 'miltank-mega',
    name: 'Mega Miltank', types: ['Normal', 'Fairy'],
    statBonus: { attack: 0.44, defense: 0.29, spAtk: 0.5, spDef: 0.43, speed: 0.15 },
    craftCost: { mega_stone_shard: 10, normal_essence: 100, fairy_essence: 50, currency: 50000 },
  },
  blisseyite: {
    baseId: 242, megaId: 20242, showdownId: 'blissey-mega',
    name: 'Mega Blissey', types: ['Normal', 'Fairy'],
    statBonus: { attack: 0.5, defense: 0.5, spAtk: 0.4, spDef: 0.22, speed: 0.18 },
    craftCost: { mega_stone_shard: 10, normal_essence: 100, fairy_essence: 50, currency: 50000 },
  },
  shedinjite: {
    baseId: 292, megaId: 20292, showdownId: 'shedinja-mega',
    name: 'Mega Shedinja', types: ['Bug', 'Ghost'],
    statBonus: { attack: 0.44, defense: 0.22, spAtk: 0.5, spDef: 0.5, speed: 0.5 },
    craftCost: { mega_stone_shard: 10, bug_essence: 100, ghost_essence: 50, currency: 50000 },
  },
  flygonite: {
    baseId: 330, megaId: 20330, showdownId: 'flygon-mega',
    name: 'Mega Flygon', types: ['Dragon', 'Bug'],
    statBonus: { attack: 0.3, defense: 0.25, spAtk: 0.38, spDef: 0.25 },
    craftCost: { mega_stone_shard: 15, dragon_essence: 150, bug_essence: 50, currency: 75000 },
  },
  torterrite: {
    baseId: 389, megaId: 20389, showdownId: 'torterra-mega',
    name: 'Mega Torterra', types: ['Grass', 'Ground'],
    statBonus: { attack: 0.28, defense: 0.29, spAtk: 0.13, spDef: 0.35 },
    craftCost: { mega_stone_shard: 15, grass_essence: 150, ground_essence: 50, currency: 75000 },
  },
  infernapite: {
    baseId: 392, megaId: 20392, showdownId: 'infernape-mega',
    name: 'Mega Infernape', types: ['Fire', 'Fighting'],
    statBonus: { attack: 0.29, defense: 0.28, spAtk: 0.29, spDef: 0.28 },
    craftCost: { mega_stone_shard: 15, fire_essence: 150, fighting_essence: 50, currency: 75000 },
  },
  empoleonite: {
    baseId: 395, megaId: 20395, showdownId: 'empoleon-mega',
    name: 'Mega Empoleon', types: ['Water', 'Steel'],
    statBonus: { attack: 0.29, defense: 0.15, spAtk: 0.18, spDef: 0.2, speed: 0.37 },
    craftCost: { mega_stone_shard: 15, water_essence: 150, steel_essence: 50, currency: 75000 },
  },
  luxrayite: {
    baseId: 405, megaId: 20405, showdownId: 'luxray-mega',
    name: 'Mega Luxray', types: ['Electric', 'Dark'],
    statBonus: { attack: 0.25, defense: 0.25, spAtk: 0.21, spDef: 0.25, speed: 0.14 },
    craftCost: { mega_stone_shard: 15, electric_essence: 150, dark_essence: 50, currency: 75000 },
  },
  heatranite: {
    baseId: 485, megaId: 20485, showdownId: 'heatran-mega',
    name: 'Mega Heatran', types: ['Fire', 'Steel'],
    statBonus: { attack: 0.22, defense: 0.19, spAtk: 0.15, spDef: 0.19, speed: 0.26 },
    craftCost: { mega_stone_shard: 25, fire_essence: 250, steel_essence: 100, currency: 150000 },
  },
  serperiorite: {
    baseId: 497, megaId: 20497, showdownId: 'serperior-mega',
    name: 'Mega Serperior', types: ['Grass', 'Dragon'],
    statBonus: { attack: 0.27, defense: 0.21, spAtk: 0.27, spDef: 0.21, speed: 0.18 },
    craftCost: { mega_stone_shard: 15, grass_essence: 150, dragon_essence: 50, currency: 75000 },
  },
  samurottite: {
    baseId: 503, megaId: 20503, showdownId: 'samurott-mega',
    name: 'Mega Samurott', types: ['Water', 'Steel'],
    statBonus: { attack: 0.3, defense: 0.24, spAtk: 0.19, spDef: 0.29, speed: 0.14 },
    craftCost: { mega_stone_shard: 15, water_essence: 150, steel_essence: 50, currency: 75000 },
  },
  haxorusite: {
    baseId: 612, megaId: 20612, showdownId: 'haxorus-mega',
    name: 'Mega Haxorus', types: ['Dragon', 'Steel'],
    statBonus: { attack: 0.27, defense: 0.22, spAtk: 0.33, spDef: 0.29 },
    craftCost: { mega_stone_shard: 15, dragon_essence: 150, steel_essence: 50, currency: 75000 },
  },
  hydreigonite: {
    baseId: 635, megaId: 20635, showdownId: 'hydreigon-mega',
    name: 'Mega Hydreigon', types: ['Dragon', 'Dark'],
    statBonus: { attack: 0.19, defense: 0.22, spAtk: 0.24, spDef: 0.22, speed: 0.1 },
    craftCost: { mega_stone_shard: 15, dragon_essence: 150, dark_essence: 50, currency: 75000 },
  },
  goodraite: {
    baseId: 706, megaId: 20706, showdownId: 'goodra-mega',
    name: 'Mega Goodra', types: ['Dragon', 'Water'],
    statBonus: { attack: 0.2, defense: 0.29, spAtk: 0.18, spDef: 0.13, speed: 0.25 },
    craftCost: { mega_stone_shard: 15, dragon_essence: 150, water_essence: 50, currency: 75000 },
  },
  decidueyite: {
    baseId: 724, megaId: 20724, showdownId: 'decidueye-mega',
    name: 'Mega Decidueye', types: ['Grass', 'Ghost'],
    statBonus: { attack: 0.28, defense: 0.27, spAtk: 0.2, spDef: 0.2, speed: 0.14 },
    craftCost: { mega_stone_shard: 15, grass_essence: 150, ghost_essence: 50, currency: 75000 },
  },
  incineroarite: {
    baseId: 727, megaId: 20727, showdownId: 'incineroar-mega',
    name: 'Mega Incineroar', types: ['Fire', 'Dark'],
    statBonus: { attack: 0.26, defense: 0.22, spAtk: 0.25, spDef: 0.22, speed: 0.17 },
    craftCost: { mega_stone_shard: 15, fire_essence: 150, dark_essence: 50, currency: 75000 },
  },
  primarinite: {
    baseId: 730, megaId: 20730, showdownId: 'primarina-mega',
    name: 'Mega Primarina', types: ['Water', 'Fairy'],
    statBonus: { attack: 0.27, defense: 0.27, spAtk: 0.24, spDef: 0.17, speed: 0.17 },
    craftCost: { mega_stone_shard: 15, water_essence: 150, fairy_essence: 50, currency: 75000 },
  },
  kommo_oite: {
    baseId: 784, megaId: 20784, showdownId: 'kommoo-mega',
    name: 'Mega Kommo-o', types: ['Dragon', 'Fighting'],
    statBonus: { attack: 0.18, defense: 0.16, spAtk: 0.2, spDef: 0.19, speed: 0.24 },
    craftCost: { mega_stone_shard: 15, dragon_essence: 150, fighting_essence: 50, currency: 75000 },
  },
  rillaboomite: {
    baseId: 812, megaId: 20812, showdownId: 'rillaboom-mega',
    name: 'Mega Rillaboom', types: ['Grass'],
    statBonus: { attack: 0.24, defense: 0.22, spAtk: 0.33, spDef: 0.29, speed: 0.12 },
    craftCost: { mega_stone_shard: 15, grass_essence: 150, currency: 75000 },
  },
  cinderacite: {
    baseId: 815, megaId: 20815, showdownId: 'cinderace-mega',
    name: 'Mega Cinderace', types: ['Fire'],
    statBonus: { attack: 0.26, defense: 0.27, spAtk: 0.31, spDef: 0.27, speed: 0.08 },
    craftCost: { mega_stone_shard: 15, fire_essence: 150, currency: 75000 },
  },
  inteleonite: {
    baseId: 818, megaId: 20818, showdownId: 'inteleon-mega',
    name: 'Mega Inteleon', types: ['Water'],
    statBonus: { attack: 0.24, defense: 0.31, spAtk: 0.24, spDef: 0.31, speed: 0.08 },
    craftCost: { mega_stone_shard: 15, water_essence: 150, currency: 75000 },
  },
  dragapultite: {
    baseId: 887, megaId: 20887, showdownId: 'dragapult-mega',
    name: 'Mega Dragapult', types: ['Dragon', 'Ghost'],
    statBonus: { attack: 0.17, defense: 0.27, spAtk: 0.2, spDef: 0.27, speed: 0.14 },
    craftCost: { mega_stone_shard: 15, dragon_essence: 150, ghost_essence: 50, currency: 75000 },
  },
  meowscaradite: {
    baseId: 908, megaId: 20908, showdownId: 'meowscarada-mega',
    name: 'Mega Meowscarada', types: ['Grass', 'Dark'],
    statBonus: { attack: 0.27, defense: 0.29, spAtk: 0.25, spDef: 0.29, speed: 0.08 },
    craftCost: { mega_stone_shard: 15, grass_essence: 150, dark_essence: 50, currency: 75000 },
  },
  skeledirgite: {
    baseId: 911, megaId: 20911, showdownId: 'skeledirge-mega',
    name: 'Mega Skeledirge', types: ['Fire', 'Ghost'],
    statBonus: { attack: 0.27, defense: 0.2, spAtk: 0.27, spDef: 0.33, speed: 0.08 },
    craftCost: { mega_stone_shard: 15, fire_essence: 150, ghost_essence: 50, currency: 75000 },
  },
  quaquavalite: {
    baseId: 914, megaId: 20914, showdownId: 'quaquaval-mega',
    name: 'Mega Quaquaval', types: ['Water', 'Fighting'],
    statBonus: { attack: 0.25, defense: 0.25, spAtk: 0.24, spDef: 0.27, speed: 0.12 },
    craftCost: { mega_stone_shard: 15, water_essence: 150, fighting_essence: 50, currency: 75000 },
  },
};

/**
 * Retorna os dados de Mega Evolução para um Pokémon baseado em seu ID e pedra.
 */
export const getMegaEvolution = (baseId, stoneId) => {
  const data = MEGA_EVOLUTION_MAP[stoneId];
  if (!data || data.baseId !== baseId) return null;
  return data;
};

/**
 * Lista todas as Mega Pedras compatíveis com um Pokémon.
 */
export const getCompatibleMegaStones = (baseId) => {
  return Object.entries(MEGA_EVOLUTION_MAP)
    .filter(([, data]) => data.baseId === baseId)
    .map(([stoneId, data]) => ({ stoneId, ...data }));
};

// Slug Showdown derivado do nome da Pokédex ("Mega Charizard X" → charizard-megax,
// "Typhlosion Hisui" → typhlosion-hisui). Usado para ids numéricos 10xxx/20xxx.
const slugFromDexName = (rawName) => {
  const name = String(rawName || '');
  const megaMatch = name.match(/^Mega (.+?)( X| Y| Z)?( \(.+\))?$/);
  if (megaMatch) {
    const base = megaMatch[1].toLowerCase().replace(/[^a-z0-9]/g, '');
    const suffix = (megaMatch[2] || '').trim().toLowerCase();
    return `${base}-mega${suffix}`;
  }
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

/**
 * URL do sprite da forma Mega via Pokémon Showdown.
 * Aceita o slug ('charizard-megax') OU o id numérico da entrada Mega da
 * Pokédex (10xxx/20xxx) — antes, ids numéricos geravam URLs quebradas e o
 * fallback do <img> podia carregar o sprite de uma forma regional errada.
 */
export const getMegaSprite = (showdownIdOrDexId) => {
  let slug = showdownIdOrDexId;
  if (typeof showdownIdOrDexId === 'number' || /^\d+$/.test(String(showdownIdOrDexId))) {
    const entry = POKEDEX[Number(showdownIdOrDexId)];
    slug = entry ? slugFromDexName(entry.name) : String(showdownIdOrDexId);
  }
  return `https://play.pokemonshowdown.com/sprites/dex/${slug}.png`;
};

/**
 * Calcula o multiplicador final de dano considerando megaStatBonus.
 */
export const applyMegaStatBonus = (pokemon, statName) => {
  if (!pokemon?.isMega || !pokemon?.megaStatBonus) return 1.0;
  return 1.0 + (pokemon.megaStatBonus[statName] || 0);
};

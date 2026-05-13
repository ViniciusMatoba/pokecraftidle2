import { APP_VERSION as V, APP_VERSION_DATE as D } from '../constants/version';

export const APP_VERSION = V;
export const APP_VERSION_DATE = D;

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

export const BADGE_IDS = ['boulder_badge', 'cascade_badge', 'thunder_badge', 'rainbow_badge', 'soul_badge', 'marsh_badge', 'volcano_badge', 'earth_badge'];
export const JOHTO_BADGE_IDS = ['zephyr_badge', 'hive_badge', 'plain_badge', 'fog_badge', 'storm_badge', 'mineral_badge', 'glacier_badge', 'rising_badge'];
export const HOENN_BADGE_IDS = ['stone_badge', 'knuckle_badge', 'dynamo_badge', 'heat_badge', 'balance_badge', 'feather_badge', 'mind_badge', 'rain_badge'];
export const SINNOH_BADGE_IDS = ['coal_badge', 'forest_badge', 'cobble_badge', 'fen_badge', 'relic_badge', 'mine_badge', 'icicle_badge', 'beacon_badge'];
export const UNOVA_BADGE_IDS = ['trio_badge', 'basic_badge', 'insect_badge', 'bolt_badge', 'quake_badge', 'jet_badge', 'freeze_badge', 'legend_badge'];
export const KALOS_BADGE_IDS = ['bug_badge', 'cliff_badge', 'rumble_badge', 'plant_badge', 'voltage_badge', 'fairy_badge', 'psychic_badge', 'iceberg_badge'];
export const ALOLA_BADGE_IDS = ['melemele_stamp', 'akala_stamp', 'ulaula_stamp', 'poni_stamp', 'alola_elite_stamp', 'alola_champion_stamp', 'ultra_stamp', 'battle_tree_stamp'];
export const GALAR_BADGE_IDS = ['grass_badge_galar', 'water_badge_galar', 'fire_badge_galar', 'fighting_badge_galar', 'fairy_badge_galar', 'rock_badge_galar', 'dark_badge_galar', 'dragon_badge_galar'];
export const PALDEA_BADGE_IDS = ['bug_badge_paldea', 'grass_badge_paldea', 'electric_badge_paldea', 'water_badge_paldea', 'normal_badge_paldea', 'ghost_badge_paldea', 'psychic_badge_paldea', 'ice_badge_paldea'];

export const GYM_LEVEL_CAPS = {
  kanto: {
    boulder_badge: 14, cascade_badge: 21, thunder_badge: 24, rainbow_badge: 32,
    soul_badge: 43, marsh_badge: 43, volcano_badge: 50, earth_badge: 55, champion: 65
  },
  johto: {
    zephyr_badge: 15, hive_badge: 20, plain_badge: 25, fog_badge: 30,
    storm_badge: 35, mineral_badge: 40, glacier_badge: 45, rising_badge: 50, johto_champion: 65
  },
  hoenn: {
    stone_badge: 15, knuckle_badge: 19, dynamo_badge: 24, heat_badge: 29,
    balance_badge: 31, feather_badge: 33, mind_badge: 42, rain_badge: 55, hoenn_champion: 70
  },
  sinnoh: {
    coal_badge: 16, forest_badge: 25, cobble_badge: 33, fen_badge: 39,
    relic_badge: 45, mine_badge: 53, icicle_badge: 66, beacon_badge: 76, sinnoh_champion: 100
  },
  unova: {
    trio_badge: 14, basic_badge: 20, insect_badge: 26, bolt_badge: 32,
    quake_badge: 39, jet_badge: 45, freeze_badge: 52, legend_badge: 60, unova_champion: 100
  },
  kalos: {
    bug_badge: 12, cliff_badge: 25, rumble_badge: 32, plant_badge: 34,
    voltage_badge: 40, fairy_badge: 48, psychic_badge: 59, iceberg_badge: 65, kalos_champion: 100
  },
  alola: {
    melemele_stamp: 16, akala_stamp: 28, ulaula_stamp: 44, poni_stamp: 55,
    alola_elite_stamp: 65, alola_champion_stamp: 75, ultra_stamp: 85, battle_tree_stamp: 100, alola_champion: 100
  },
  galar: {
    grass_badge_galar: 20, water_badge_galar: 24, fire_badge_galar: 27, fighting_badge_galar: 36,
    fairy_badge_galar: 38, rock_badge_galar: 42, dark_badge_galar: 46, dragon_badge_galar: 55, galar_champion: 100
  },
  paldea: {
    bug_badge_paldea: 15, grass_badge_paldea: 20, electric_badge_paldea: 28, water_badge_paldea: 35,
    normal_badge_paldea: 42, ghost_badge_paldea: 48, psychic_badge_paldea: 55, ice_badge_paldea: 60, paldea_champion: 100
  }
};

export const trainerAvatars = [
  { id: 'red',     name: 'Red',     img: 'https://play.pokemonshowdown.com/sprites/trainers/red.png'     },
  { id: 'leaf',    name: 'Leaf',    img: 'https://play.pokemonshowdown.com/sprites/trainers/leaf-gen3.png'    },
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
      fairy_essence: 0, dark_essence: 0, mystic_dust: 0, iron_ore: 0,
      armor_fragment: 0, fury_essence: 0, dragon_scale: 0, stardust: 0,
      sharp_claw: 0, scale_dust: 0, ember_shard: 0, thunder_fang: 0,
      ice_crystal: 0, poison_barb: 0, hard_shell: 0, spirit_dust: 0,
      dragon_fang: 0, aura_fragment: 0, leaf_debris: 0, wave_stone: 0
    },
    items: { pokeballs: 5, potions: 2 },
    candies: {}
  },
  team: [],
  pc: [],
  regional_teams: {
    kanto: [],
    johto: [],
    hoenn: [],
    sinnoh: [],
    unova: [],
    kalos: [],
    alola: [],
    galar: [],
    paldea: []
  },
  activeRegion: 'kanto',
  currentRoute: 'pallet_town',
  worldFlags: [],
  badges: [],
  gymDefeatCounts: {},
  caughtData: {},
  speciesMastery: {},
  expeditions: {},
  expeditionProgress: {},
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
    staminaThreshold: 30,
    autoPotion: false,
    autoStamina: false,
    routeConfigs: {},
    shownRoutes: [],
  },
  settings: {
    battleSpeed: 1,
    displayMode: 'mobile'
  },
  activeQuest: null,
  lastQuestTime: null,
  lastLegendarySpawns: {},
  forgedItemsCount: 0,
  bossTotalDamage: 0,
  shinyCapturedCount: 0,
  trainerBattleWins: 0,
  bossLastDamage: 0,
  playerStats: {
    startedAt: null,
    playTimeMs: 0,
    pokemonDefeated: 0,
    pokemonCaptured: 0,
    shinyDefeated: 0,
    shinyCaptured: 0,
    trainersDefeated: 0,
    villainEncounters: 0,
    villainDefeated: 0,
    wildBossEncounters: 0,
    wildBossDefeated: 0,
    raidEncounters: 0,
    raidsWon: 0,
    raidsCaptured: 0,
    raidsFled: 0,
    lastSeenAt: null,
  },

  // Prestígio e Reputação
  prestige: {
    trophies: [],           // IDs de troféus comprados
    activeTitle: null,      // ID do título ativo
    pokedexFrame: 'default', // ID da moldura ativa
    uiTheme: 'default',     // ID do tema visual ativo
    hallOfFameEntry: null,  // Nome na Placa de Fama
  },

  // Fazenda — loja de sementes
  seedShop: {
    unlocked: false,        // desbloqueada após 3 badges
  },

  // Mineração passiva
  mine: {
    unlocked: false,
    level: 1,               // 1-3, upgrades custam moedas
    lastCollected: null,    // timestamp da última coleta
  },

  // Pesca avançada
  fishing: {
    rod: 'old_rod',         // 'old_rod' | 'good_rod' | 'super_rod'
  },

  // NPC Aliado temporário
  ally: {
    activeId: null,         // ID do aliado contratado
    expiresAt: null,        // timestamp de expiração
  },

  // Pokémon Center — doações
  pokecenter: {
    freeHeals: 0,           // curas gratuitas restantes
  },

  // Ginásio próprio
  gymCustom: {
    unlocked: false,
    bannerId: 'default',
    colorId: null,          // cor do ginásio
  },

  // Raid
  activeRaid: null,
  raidStats: {
    total: 0,      // raids completadas
    captured: 0,   // Pokémon capturados em raids
    fled: 0,       // raids que expiraram sem participar
  },
  battlesSinceLastRaid: 0,  // contador de batalhas para trigger
  selectedStarters: {},
};

export const ITEM_LABELS = {
  // Materiais
  silk: { icon: '🧵', name: 'Seda' },
  feather: { icon: '🪶', name: 'Pena' },
  apricorn: { icon: '🌰', name: 'Apricorn' },
  electric_chip: { icon: '⚡', name: 'Chip Elétrico' },
  moon_stone_shard: { icon: '🌙', name: 'Fragmento de Lua' },
  fire_stone_shard: { icon: '*', name: 'Fragmento de Fogo' },
  water_stone_shard: { icon: '*', name: 'Fragmento de Agua' },
  leaf_stone_shard: { icon: '*', name: 'Fragmento de Folha' },
  thunder_stone_shard: { icon: '*', name: 'Fragmento de Trovao' },
  link_cable_part: { icon: '*', name: 'Peca de Cabo Link' },
  recipe_amulet_coin: { icon: 'RC', name: 'Receita: Amulet Coin' },
  recipe_magnet: { icon: 'RC', name: 'Receita: Magnet' },
  recipe_charcoal: { icon: 'RC', name: 'Receita: Charcoal' },
  recipe_mystic_water: { icon: 'RC', name: 'Receita: Mystic Water' },
  recipe_black_belt: { icon: 'RC', name: 'Receita: Black Belt' },
  recipe_quick_claw: { icon: 'RC', name: 'Receita: Quick Claw' },
  recipe_lucky_egg: { icon: 'RC', name: 'Receita: Lucky Egg' },
  recipe_cleanse_tag: { icon: 'RC', name: 'Receita: Cleanse Tag' },
  pink_dust: { icon: '🌸', name: 'Pó Rosa' },
  gold_nugget: { icon: '🪙', name: 'Pepita de Ouro' },
  iron_ore: { icon: '⛏️', name: 'Minério de Ferro' },
  mystic_dust: { icon: '✨', name: 'Pó Místico' },
  mega_stone_shard: { icon: '/items/mega_stone_shard.png', name: 'Fragmento de Mega Pedra' },
  
  // Materiais de Boss
  armor_fragment: { icon: '/items/armor_fragment.png', name: 'Fragmento de Armadura' },
  fury_essence: { icon: '💢', name: 'Essência de Fúria' },
  dragon_scale: { icon: '🦎', name: 'Escama de Dragão' },
  stardust: { icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/stardust.png', name: 'Poeira Estelar' },

  // Materiais Específicos de Pokémon
  sharp_claw: { icon: '💅', name: 'Garra Afiada' },
  scale_dust: { icon: '✨', name: 'Pó de Escama' },
  ember_shard: { icon: '🔥', name: 'Fragmento de Brasa' },
  thunder_fang: { icon: '⚡', name: 'Presa de Trovão' },
  ice_crystal: { icon: '❄️', name: 'Cristal de Gelo' },
  poison_barb: { icon: '🌵', name: 'Farpas Venenosas' },
  hard_shell: { icon: '🐚', name: 'Concha Dura' },
  spirit_dust: { icon: '👻', name: 'Pó Espiritual' },
  dragon_fang: { icon: '🐉', name: 'Presa de Dragão' },
  aura_fragment: { icon: '✨', name: 'Fragmento de Aura' },
  leaf_debris: { icon: '🍃', name: 'Restos de Folha' },
  wave_stone: { icon: '🌊', name: 'Pedra de Onda' },

  // Itens de Forja de Boss
  titan_shield: { icon: '🏰', name: 'Escudo de Titã' },
  adrenaline_potion: { icon: '💉', name: 'Poção de Adrenalina' },
  penetration_pendant: { icon: '📿', name: 'Pingente de Penetração' },
  
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
  
  // Mega Stones
  charizardite_x: { icon: '🔥', name: 'Charizardite X' },
  charizardite_y: { icon: '🔥', name: 'Charizardite Y' },
  lucarionite: { icon: '👊', name: 'Lucarionite' },
  mewtwonite_x: { icon: '🔮', name: 'Mewtwonite X' },
  mewtwonite_y: { icon: '🔮', name: 'Mewtwonite Y' },
  garchompite: { icon: '🐉', name: 'Garchompite' },
  gardevoirite: { icon: '🔮', name: 'Gardevoirite' },
  blazikenite: { icon: '🔥', name: 'Blazikenite' },
  blastoisinite: { icon: '💧', name: 'Blastoisinite' },
  venusaurite: { icon: '🍃', name: 'Venusaurite' },
  alakazite: { icon: '🔮', name: 'Alakazite' },
  gengarite: { icon: '👻', name: 'Gengarite' },
  gyaradosite: { icon: '💧', name: 'Gyaradosite' },
  salamencite: { icon: '🐉', name: 'Salamencite' },
  metagrossite: { icon: '⚙️', name: 'Metagrossite' },
  tyranitarite: { icon: '🪨', name: 'Tyranitarite' },
  beedrillite: { icon: '🪲', name: 'Beedrillite' },
  pidgeotite: { icon: '🦅', name: 'Pidgeotite' },
  slowbronite: { icon: '🐚', name: 'Slowbronite' },
  kangaskhanite: { icon: '👶', name: 'Kangaskhanite' },
  pinsirite: { icon: '🪲', name: 'Pinsirite' },
  aerodactylite: { icon: '🦴', name: 'Aerodactylite' },
  ampharosite: { icon: '⚡', name: 'Ampharosite' },
  steelixite: { icon: '⚙️', name: 'Steelixite' },
  scizorite: { icon: '⚙️', name: 'Scizorite' },
  heracronite: { icon: '🪲', name: 'Heracronite' },
  houndoominite: { icon: '🌑', name: 'Houndoominite' },
  sceptilite: { icon: '🌿', name: 'Sceptilite' },
  swampertite: { icon: '💧', name: 'Swampertite' },
  sableyite: { icon: '💎', name: 'Sableyite' },
  mawilite: { icon: '⚙️', name: 'Mawilite' },
  aggronite: { icon: '⚙️', name: 'Aggronite' },
  medichamite: { icon: '👊', name: 'Medichamite' },
  manectite: { icon: '⚡', name: 'Manectite' },
  sharpedonite: { icon: '🦈', name: 'Sharpedonite' },
  cameruptite: { icon: '🌋', name: 'Cameruptite' },
  altarianite: { icon: '☁️', name: 'Altarianite' },
  banettite: { icon: '👻', name: 'Banettite' },
  absolite: { icon: '🌑', name: 'Absolite' },
  glalitite: { icon: '❄️', name: 'Glalitite' },
  latiasite: { icon: '🔮', name: 'Latiasite' },
  latiosite: { icon: '🔮', name: 'Latiosite' },
  abomasnowite: { icon: '❄️', name: 'Abomasnowite' },
  galladite: { icon: '👊', name: 'Galladite' },
  audinite: { icon: '🎀', name: 'Audinite' },
  diancite: { icon: '💎', name: 'Diancite' },
  
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
  potion:            { icon: '🧪', name: 'Poção' },
  link_cable:        { icon: '🔌', name: 'Link Cable' },

  // Pedra de Evolução extra
  sun_stone:         { icon: '☀️', name: 'Pedra do Sol' },

  // Drops de Expedição — Kanto
  pearl:             { icon: '🔮', name: 'Pérola' },
  black_belt:        { icon: '🥋', name: 'Black Belt' },
  muscle_band:       { icon: '💪', name: 'Muscle Band' },
  expert_belt_shard: { icon: '🛡️', name: 'Fragmento de Expert Belt' },
  ghost_shard:       { icon: '👻', name: 'Fragmento Fantasma' },
  mystic_water:      { icon: '💧', name: 'Mystic Water' },
  twist_spoon:       { icon: '🥄', name: 'Twist Spoon' },
  mind_shard:        { icon: '🔮', name: 'Fragmento Mental' },
  tm_shard_psychic:  { icon: '💿', name: 'TM Shard Psíquico' },
  link_cable_shard:  { icon: '🔌', name: 'Fragmento de Link Cable' },
  charcoal:          { icon: '🪵', name: 'Carvão' },
  lava_cookie:       { icon: '🍪', name: 'Lava Cookie' },
  dragon_fang:       { icon: '🐉', name: 'Presa de Dragão' },
  draco_shard:       { icon: '🐉', name: 'Fragmento Draco' },
  tm_shard_dragon:   { icon: '💿', name: 'TM Shard Dragão' },
  spell_tag:         { icon: '📜', name: 'Spell Tag' },
  dread_plate:       { icon: '🖤', name: 'Dread Plate' },
  amulet_coin_shard: { icon: '🪙', name: 'Fragmento de Amulet Coin' },

  // Drops de Expedição — Johto / Hoenn / Sinnoh
  super_rod:         { icon: '🎣', name: 'Super Vara' },

  // Itens Adicionais e Apricorns
  lucky_egg:       { icon: '🥚', name: 'Lucky Egg' },
  black_apricorn:  { icon: '⚫', name: 'Apricorn Preto' },
  blue_apricorn:   { icon: '🔵', name: 'Apricorn Azul' },
  green_apricorn:  { icon: '🟢', name: 'Apricorn Verde' },
  pink_apricorn:   { icon: '🌸', name: 'Apricorn Rosa' },
  red_apricorn:    { icon: '🔴', name: 'Apricorn Vermelho' },
  white_apricorn:  { icon: '⚪', name: 'Apricorn Branco' },
  yellow_apricorn: { icon: '🟡', name: 'Apricorn Amarelo' },
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
  {
    id: 'link_cable',
    name: 'Link Cable',
    img: '/assets/items/link-cable-custom.png',
    description: 'Item misterioso que permite certas evoluções sem troca.',
    price: 5000,
    availableFrom: 'thunder_badge',
  },
];

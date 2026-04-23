import { POKEDEX } from './pokedex';

const pk = (ids, level) => ids.map(id => ({ ...POKEDEX[id], level }));

export const getRivalSprite = (playerAvatarImg) => {
  if (playerAvatarImg && playerAvatarImg.includes('blue.png')) {
    return 'https://play.pokemonshowdown.com/sprites/trainers/blue2.png';
  }
  return 'https://play.pokemonshowdown.com/sprites/trainers/blue.png';
};

const S = {
  youngster:   'https://play.pokemonshowdown.com/sprites/trainers/youngster.png',
  lass:        'https://play.pokemonshowdown.com/sprites/trainers/lass.png',
  hiker:       'https://play.pokemonshowdown.com/sprites/trainers/hiker.png',
  bugcatcher:  'https://play.pokemonshowdown.com/sprites/trainers/bugcatcher.png',
  picnicker:   'https://play.pokemonshowdown.com/sprites/trainers/picnicker.png',
  gentleman:   'https://play.pokemonshowdown.com/sprites/trainers/gentleman.png',
  beauty:      'https://play.pokemonshowdown.com/sprites/trainers/beauty.png',
  sailor:      'https://play.pokemonshowdown.com/sprites/trainers/sailor.png',
  aceM:        'https://play.pokemonshowdown.com/sprites/trainers/acetrainer.png',
  aceF:        'https://play.pokemonshowdown.com/sprites/trainers/acetrainerf.png',
  rocket:      'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
  rocketF:     'https://play.pokemonshowdown.com/sprites/trainers/teamrocketf.png',
  juggler:     'https://play.pokemonshowdown.com/sprites/trainers/juggler.png',
  gambler:     'https://play.pokemonshowdown.com/sprites/trainers/gambler.png',
  cooltrainer: 'https://play.pokemonshowdown.com/sprites/trainers/cooltrainer.png',
  blue:        'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
  blue2:       'https://play.pokemonshowdown.com/sprites/trainers/blue2.png',
  brock:       'https://play.pokemonshowdown.com/sprites/trainers/brock.png',
  misty:       'https://play.pokemonshowdown.com/sprites/trainers/misty.png',
  ltsurge:     'https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png',
  erika:       'https://play.pokemonshowdown.com/sprites/trainers/erika.png',
  koga:        'https://play.pokemonshowdown.com/sprites/trainers/koga.png',
  sabrina:     'https://play.pokemonshowdown.com/sprites/trainers/sabrina.png',
  blaine:      'https://play.pokemonshowdown.com/sprites/trainers/blaine.png',
  giovanni:    'https://play.pokemonshowdown.com/sprites/trainers/giovanni.png',
  lorelei:     'https://play.pokemonshowdown.com/sprites/trainers/lorelei.png',
  bruno:       'https://play.pokemonshowdown.com/sprites/trainers/bruno.png',
  agatha:      'https://play.pokemonshowdown.com/sprites/trainers/agatha.png',
  lance:       'https://play.pokemonshowdown.com/sprites/trainers/lance.png',
};

export const GYM_LEADERS = {
  brock:    { id: 'brock',    name: 'Brock',    sprite: S.brock,    badge: 1, badgeName: 'Insignia da Rocha',      reward: 1200,  team: pk([74, 95], 14),              unlockFlag: 'boulder_badge', introText: 'Sou Brock! Minha especialidade sao Pokemon do tipo Pedra!' },
  misty:    { id: 'misty',    name: 'Misty',    sprite: S.misty,    badge: 2, badgeName: 'Insignia da Cascata',    reward: 2500,  team: pk([120, 121], 21),            unlockFlag: 'cascade_badge', introText: 'Sou Misty! Prepare-se para o poder da agua!' },
  ltsurge:  { id: 'ltsurge',  name: 'Lt. Surge',sprite: S.ltsurge,  badge: 3, badgeName: 'Insignia do Trovao',    reward: 4000,  team: pk([100, 25, 26], 24),         unlockFlag: 'thunder_badge', introText: 'Hah! Seu funeral, recruta!' },
  erika:    { id: 'erika',    name: 'Erika',    sprite: S.erika,    badge: 4, badgeName: 'Insignia do Arco-Iris', reward: 5000,  team: pk([71, 70, 45], 32),          unlockFlag: 'rainbow_badge', introText: 'Voce me acordou. Vou lutar entao.' },
  koga:     { id: 'koga',     name: 'Koga',     sprite: S.koga,     badge: 5, badgeName: 'Insignia da Alma',      reward: 7000,  team: pk([109, 89, 110, 49], 43),   unlockFlag: 'soul_badge',    introText: 'Meu veneno ira paralisa-lo... inexoravelmente!' },
  sabrina:  { id: 'sabrina',  name: 'Sabrina',  sprite: S.sabrina,  badge: 6, badgeName: 'Insignia do Pantano',   reward: 8000,  team: pk([64, 122, 65], 46),         unlockFlag: 'marsh_badge',   introText: 'Ja previ sua derrota. Ainda assim, entre.' },
  blaine:   { id: 'blaine',   name: 'Blaine',   sprite: S.blaine,   badge: 7, badgeName: 'Insignia do Vulcao',    reward: 9500,  team: pk([58, 78, 126, 77], 50),     unlockFlag: 'volcano_badge', introText: 'Minha habilidade com Fire queimara voce ate as cinzas!' },
  giovanni: { id: 'giovanni', name: 'Giovanni', sprite: S.giovanni, badge: 8, badgeName: 'Insignia da Terra',     reward: 15000, team: pk([111, 51, 112, 34], 55),    unlockFlag: 'earth_badge',   introText: 'Eu, Giovanni, vou destrui-lo!' },
};

export const ROUTES = {

  pallet_town: {
    id: 'pallet_town', name: 'Cidade de Pallet', type: 'city', group: 'Pallet Town',
    unlockLevel: 0, requirements: [], unlocks: 'starter_event',
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Sua jornada comeca aqui.',
  },

  route_1: {
    id: 'route_1', name: 'Rota 1', type: 'farm', group: 'Pallet Town',
    unlockLevel: 1, requirements: ['has_starter'],
    biome: 'grass',
    enemies: pk([16, 19], 3),
    trainerChance: 0.12,
    trainers: [
      { name: 'Youngster Joey',  sprite: S.youngster, team: pk([19], 4),      reward: 80 },
      { name: 'Lass Haley',      sprite: S.lass,      team: pk([16, 16], 3),  reward: 60 },
      { name: 'Youngster Mikey', sprite: S.youngster, team: pk([16, 19], 3),  reward: 70 },
    ],
    keyBattles: [
      { id: 'rival_route1', name: 'Desafiar Rival — Rota 1', type: 'rival', sprite: S.blue,
        team: pk([19, 16], 5), reward: 200, unlockFlag: 'rival_1_defeated',
        description: 'Azul bloqueia o caminho! Derrote-o para continuar para Viridian.' },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Caminho gramado para Viridian. Seu rival te espera!',
  },

  viridian_city: {
    id: 'viridian_city', name: 'Cidade de Viridian', type: 'city', group: 'Viridian City',
    unlockLevel: 3, requirements: ['has_starter'], unlocks: 'parcel_pickup',
    enemies: [], trainers: [], trainerChance: 0,
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Um centro urbano agitado.',
  },

  route_22: {
    id: 'route_22', name: 'Rota 22', type: 'farm', group: 'Viridian City',
    unlockLevel: 3, requirements: ['has_starter'],
    biome: 'grass',
    enemies: pk([56, 21, 29, 32], 4),
    trainerChance: 0.10,
    trainers: [
      { name: 'Youngster Ben',    sprite: S.youngster, team: pk([56], 4),       reward: 80  },
      { name: 'Hiker Clark',      sprite: S.hiker,     team: pk([21, 56], 5),   reward: 120 },
      { name: 'Youngster Calvin', sprite: S.youngster, team: pk([29, 32], 4),   reward: 80  },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Caminho oeste de Viridian.',
  },

  viridian_forest: {
    id: 'viridian_forest', name: 'Floresta de Viridian', type: 'farm', group: 'Viridian City',
    unlockLevel: 5, requirements: ['has_starter', 'rival_1_defeated'],
    biome: 'forest',
    enemies: pk([10, 13, 25, 11, 14], 6),
    trainerChance: 0.12,
    trainers: [
      { name: 'Bug Catcher Rick',    sprite: S.bugcatcher, team: pk([10, 13], 6),      reward: 90  },
      { name: 'Bug Catcher Doug',    sprite: S.bugcatcher, team: pk([13, 10, 10], 5),  reward: 75  },
      { name: 'Bug Catcher Anthony', sprite: S.bugcatcher, team: pk([11, 14], 7),      reward: 100 },
      { name: 'Lass Crissy',         sprite: S.lass,       team: pk([25], 7),          reward: 140 },
    ],
    keyBattles: [
      { id: 'forest_rocket_boss', name: 'Grunt Rocket — Saida da Floresta', type: 'rocket', sprite: S.rocket,
        team: pk([41, 23], 8), reward: 300, isRocket: true, unlockFlag: 'viridian_forest_cleared',
        description: 'Um grunt da Rocket bloqueia a saida! Derrote-o para chegar a Pewter.' },
    ],
    background: '/battle_bg_forest_1776863795763.png',
    description: 'Floresta de insetos. Um grunt da Rocket bloqueia a saida!',
  },

  pewter_city: {
    id: 'pewter_city', name: 'Cidade de Pewter', type: 'city', group: 'Pewter City',
    hasGym: true, gymLeader: GYM_LEADERS.brock,
    unlockLevel: 8, requirements: ['viridian_forest_cleared'],
    enemies: [], trainers: [], trainerChance: 0,
    keyBattles: [
      { id: 'gym_brock', name: 'Lider Brock — Ginasio de Pewter', type: 'gym_leader', sprite: S.brock,
        team: pk([74, 95], 14), reward: 1200, badgeToGive: 1, unlockFlag: 'boulder_badge',
        description: 'Derrote Brock para ganhar a Insignia da Rocha e avançar para Mt. Moon!' },
    ],
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Cidade de pedra. Derrote Brock para continuar!',
  },

  route_3: {
    id: 'route_3', name: 'Rota 3', type: 'farm', group: 'Pewter City',
    unlockLevel: 12, requirements: ['boulder_badge'],
    biome: 'grass',
    enemies: pk([21, 39, 11, 14, 29, 32], 10),
    trainerChance: 0.12,
    trainers: [
      { name: 'Lass Janice',         sprite: S.lass,       team: pk([39, 16], 10),   reward: 180 },
      { name: 'Youngster Mike',      sprite: S.youngster,  team: pk([21, 21], 10),   reward: 160 },
      { name: 'Hiker Eric',          sprite: S.hiker,      team: pk([74, 95], 11),   reward: 220 },
      { name: 'Bug Catcher Sammy',   sprite: S.bugcatcher, team: pk([14, 11], 10),   reward: 160 },
      { name: 'Ace Trainer Marissa', sprite: S.aceF,       team: pk([39, 21], 12),   reward: 300 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Terreno arido a caminho de Mt. Moon.',
  },

  mt_moon: {
    id: 'mt_moon', name: 'Mt. Moon', type: 'farm', group: 'Pewter City',
    unlockLevel: 14, requirements: ['boulder_badge'],
    biome: 'mountain',
    enemies: pk([41, 74, 35, 46], 12),
    trainerChance: 0.12,
    trainers: [
      { name: 'Hiker Marcos',        sprite: S.hiker,   team: pk([74, 41], 12),   reward: 240 },
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([41, 41], 13),   reward: 260, isRocket: true },
      { name: 'Team Rocket Grunt F', sprite: S.rocketF, team: pk([41, 23], 13),   reward: 260, isRocket: true },
      { name: 'Hiker Jim',           sprite: S.hiker,   team: pk([95, 74], 13),   reward: 260 },
      { name: 'Lass Iris',           sprite: S.lass,    team: pk([35, 39], 11),   reward: 200 },
    ],
    keyBattles: [
      { id: 'mt_moon_rocket_boss', name: 'Chefe Rocket — Profundezas de Mt. Moon', type: 'rocket', sprite: S.rocket,
        team: pk([41, 23, 109], 16), reward: 600, isRocket: true, unlockFlag: 'mt_moon_cleared',
        description: 'O chefe Rocket domina Mt. Moon! Derrote-o para liberar o caminho a Cerulean.' },
    ],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'Caverna misteriosa. Chefe Rocket bloqueia a saida!',
  },

  cerulean_city: {
    id: 'cerulean_city', name: 'Cidade de Cerulean', type: 'city', group: 'Cerulean City',
    hasGym: true, gymLeader: GYM_LEADERS.misty,
    requirements: ['mt_moon_cleared'],
    enemies: [], trainers: [], trainerChance: 0,
    keyBattles: [
      { id: 'gym_misty', name: 'Lider Misty — Ginasio de Cerulean', type: 'gym_leader', sprite: S.misty,
        team: pk([120, 121], 21), reward: 2500, badgeToGive: 2, unlockFlag: 'cascade_badge',
        description: 'Derrote Misty para ganhar a Insignia da Cascata!' },
    ],
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Cidade banhada pela agua. Desafie Misty!',
  },

  route_24_25: {
    id: 'route_24_25', name: 'Rotas 24 e 25', type: 'farm', group: 'Cerulean City',
    unlockLevel: 17, requirements: ['cascade_badge'],
    biome: 'grass',
    enemies: pk([43, 60, 29, 32, 63], 15),
    trainerChance: 0.10,
    trainers: [
      { name: 'Bug Catcher Cale', sprite: S.bugcatcher, team: pk([48, 43], 15), reward: 260 },
      { name: 'Lass Dana',        sprite: S.lass,        team: pk([29, 32], 15), reward: 260 },
      { name: 'Youngster Timmy',  sprite: S.youngster,   team: pk([21, 16], 15), reward: 240 },
      { name: 'Hiker Lenny',      sprite: S.hiker,       team: pk([74, 74], 16), reward: 300 },
    ],
    keyBattles: [
      { id: 'rival_cerulean_cape', name: 'Desafiar Rival — Cabo Cerulean', type: 'rival', sprite: S.blue,
        team: pk([17, 56, 7], 20), reward: 800, unlockFlag: 'rival_2_defeated',
        description: 'Azul esta no Cabo! Derrote-o para provar seu valor.' },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Rotas do Cabo Cerulean. Rival te espera!',
  },

  route_5_6: {
    id: 'route_5_6', name: 'Rotas 5 e 6', type: 'farm', group: 'Vermilion City',
    unlockLevel: 18, requirements: ['cascade_badge'],
    biome: 'grass',
    enemies: pk([16, 19, 52, 39, 96], 15),
    trainerChance: 0.12,
    trainers: [
      { name: 'Picnicker Irene',  sprite: S.picnicker, team: pk([19, 52], 16),     reward: 280 },
      { name: 'Youngster Timmy',  sprite: S.youngster, team: pk([19, 19, 16], 15), reward: 250 },
      { name: 'Ace Trainer Cole', sprite: S.aceM,      team: pk([52, 19], 17),     reward: 380 },
      { name: 'Lass Megan',       sprite: S.lass,      team: pk([39, 96], 16),     reward: 280 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Caminho para Vermilion.',
  },

  ss_anne: {
    id: 'ss_anne', name: 'S.S. Anne', type: 'farm', group: 'Vermilion City',
    unlockLevel: 20, requirements: ['cascade_badge'],
    biome: 'water',
    enemies: pk([16, 19, 52, 96], 20),
    trainerChance: 0.15,
    trainers: [
      { name: 'Gentleman Thomas', sprite: S.gentleman, team: pk([52, 52], 22),       reward: 600 },
      { name: 'Beauty Connie',    sprite: S.beauty,    team: pk([19, 16, 52], 21),   reward: 500 },
      { name: 'Sailor Edmond',    sprite: S.sailor,    team: pk([52, 19], 22),       reward: 440 },
      { name: 'Gentleman Brooks', sprite: S.gentleman, team: pk([96, 96], 22),       reward: 600 },
    ],
    keyBattles: [
      { id: 'rival_ss_anne', name: 'Desafiar Rival — S.S. Anne', type: 'rival', sprite: S.blue,
        team: pk([18, 110, 53], 25), reward: 1000, unlockFlag: 'rival_3_defeated',
        description: 'Azul esta a bordo! Derrote-o para conseguir o HM Corte.' },
    ],
    background: '/battle_bg_ship_1776863844924.png',
    description: 'Luxuoso navio de cruzeiro. Azul esta a bordo!',
  },

  vermilion_city: {
    id: 'vermilion_city', name: 'Cidade de Vermilion', type: 'city', group: 'Vermilion City',
    hasGym: true, gymLeader: GYM_LEADERS.ltsurge,
    unlockLevel: 22, requirements: ['cascade_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    keyBattles: [
      { id: 'gym_ltsurge', name: 'Lider Lt. Surge — Ginasio de Vermilion', type: 'gym_leader', sprite: S.ltsurge,
        team: pk([100, 25, 26], 26), reward: 4000, badgeToGive: 3, unlockFlag: 'thunder_badge',
        description: 'Derrote Lt. Surge para ganhar a Insignia do Trovao!' },
    ],
    background: '/battle_bg_ship_1776863844924.png',
    description: 'Cidade portuaria. Derrote Lt. Surge!',
  },

  route_9_10: {
    id: 'route_9_10', name: 'Rotas 9 e 10', type: 'farm', group: 'Lavender Town',
    unlockLevel: 26, requirements: ['thunder_badge'],
    biome: 'grass',
    enemies: pk([21, 23, 56, 81, 100], 22),
    trainerChance: 0.12,
    trainers: [
      { name: 'Youngster Gomez', sprite: S.youngster, team: pk([21, 56], 22),   reward: 380 },
      { name: 'Picnicker Carol', sprite: S.picnicker, team: pk([39, 52], 22),   reward: 380 },
      { name: 'Hiker Liam',      sprite: S.hiker,     team: pk([74, 95], 23),   reward: 420 },
      { name: 'Juggler Nedrick', sprite: S.juggler,   team: pk([100, 81], 24),  reward: 480 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Estradas rochosas a caminho de Lavender.',
  },

  rock_tunnel: {
    id: 'rock_tunnel', name: 'Rock Tunnel', type: 'farm', group: 'Lavender Town',
    unlockLevel: 28, requirements: ['thunder_badge'],
    biome: 'mountain',
    enemies: pk([74, 41, 95, 66], 24),
    trainerChance: 0.12,
    trainers: [
      { name: 'Hiker Allen',       sprite: S.hiker,     team: pk([74, 95], 25),      reward: 500 },
      { name: 'Hiker Ricky',       sprite: S.hiker,     team: pk([66, 74], 25),      reward: 500 },
      { name: 'Picnicker Martha',  sprite: S.picnicker, team: pk([41, 41, 41], 24),  reward: 480 },
      { name: 'Ace Trainer Ryder', sprite: S.aceM,      team: pk([95, 66], 26),      reward: 620 },
    ],
    keyBattles: [
      { id: 'rock_tunnel_rocket', name: 'Chefe Rocket — Rock Tunnel', type: 'rocket', sprite: S.rocket,
        team: pk([41, 23, 23], 27), reward: 700, isRocket: true, unlockFlag: 'rock_tunnel_cleared',
        description: 'Chefe Rocket bloqueia a saida! Derrote-o para chegar a Lavender.' },
    ],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'Tunel escuro. A Rocket esta aqui!',
  },

  pokemon_tower: {
    id: 'pokemon_tower', name: 'Torre Pokemon', type: 'farm', group: 'Lavender Town',
    unlockLevel: 30, requirements: ['rock_tunnel_cleared'],
    biome: 'mountain',
    enemies: pk([92, 93, 104], 28),
    trainerChance: 0.12,
    trainers: [
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([41, 92], 28),   reward: 560, isRocket: true },
      { name: 'Team Rocket Grunt F', sprite: S.rocketF, team: pk([92, 93], 28),   reward: 560, isRocket: true },
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([104, 41], 29),  reward: 580, isRocket: true },
    ],
    keyBattles: [
      { id: 'tower_rocket_admin', name: 'Admin Rocket — Topo da Torre', type: 'rocket', sprite: S.rocket,
        team: pk([92, 93, 41], 32), reward: 1200, isRocket: true, unlockFlag: 'pokemon_tower_cleared',
        description: 'O Admin Rocket domina o topo! Derrote-o para libertar os espiritos.' },
    ],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'Torre assombrada tomada pela Rocket.',
  },

  route_7_8: {
    id: 'route_7_8', name: 'Rotas 7 e 8', type: 'farm', group: 'Celadon City',
    unlockLevel: 32, requirements: ['pokemon_tower_cleared'],
    biome: 'grass',
    enemies: pk([58, 37, 43, 96, 52], 28),
    trainerChance: 0.12,
    trainers: [
      { name: 'Gambler Dru',        sprite: S.gambler, team: pk([52, 96], 28),   reward: 700 },
      { name: 'Lass Julia',         sprite: S.lass,    team: pk([43, 37], 28),   reward: 560 },
      { name: 'Juggler Brendan',    sprite: S.juggler, team: pk([100, 81], 29),  reward: 640 },
      { name: 'Ace Trainer Harvey', sprite: S.aceM,    team: pk([58, 96], 30),   reward: 800 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Rota de conexao para Celadon.',
  },

  rocket_hideout: {
    id: 'rocket_hideout', name: 'QG da Equipe Rocket', type: 'farm', group: 'Celadon City',
    unlockLevel: 33, requirements: ['pokemon_tower_cleared'],
    biome: 'mountain',
    enemies: pk([41, 23, 52, 88], 30),
    trainerChance: 0.18,
    trainers: [
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([41, 23], 30),     reward: 700, isRocket: true },
      { name: 'Team Rocket Grunt F', sprite: S.rocketF, team: pk([52, 88], 30),     reward: 700, isRocket: true },
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([23, 41, 41], 31), reward: 720, isRocket: true },
      { name: 'Team Rocket Grunt F', sprite: S.rocketF, team: pk([88, 52], 31),     reward: 720, isRocket: true },
    ],
    keyBattles: [
      { id: 'giovanni_hideout', name: 'Giovanni — QG da Equipe Rocket', type: 'boss', sprite: S.giovanni,
        team: pk([52, 88, 95, 111], 35), reward: 3000, isRocket: true, unlockFlag: 'rocket_hideout_cleared',
        description: 'Giovanni comanda a Rocket! Derrote-o para destruir o QG.' },
    ],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'QG secreto da Rocket em Celadon. Giovanni te aguarda!',
  },

  celadon_city: {
    id: 'celadon_city', name: 'Celadon City', type: 'city', group: 'Celadon City',
    hasGym: true, gymLeader: GYM_LEADERS.erika,
    unlockLevel: 35, requirements: ['pokemon_tower_cleared'],
    enemies: [], trainers: [], trainerChance: 0,
    keyBattles: [
      { id: 'gym_erika', name: 'Lider Erika — Ginasio de Celadon', type: 'gym_leader', sprite: S.erika,
        team: pk([71, 70, 45], 32), reward: 5000, badgeToGive: 4, unlockFlag: 'rainbow_badge',
        description: 'Derrote Erika para ganhar a Insignia do Arco-Iris!' },
    ],
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Cidade verde. Derrote Erika para avancar!',
  },

  route_12_15: {
    id: 'route_12_15', name: 'Rotas 12 a 15', type: 'farm', group: 'Fuchsia City',
    unlockLevel: 36, requirements: ['rainbow_badge'],
    biome: 'grass',
    enemies: pk([84, 48, 22, 128, 111], 33),
    trainerChance: 0.12,
    trainers: [
      { name: 'Bird Keeper Edwin',  sprite: S.aceM,      team: pk([84, 22], 34),     reward: 820 },
      { name: 'Picnicker Isabelle', sprite: S.picnicker, team: pk([48, 39], 33),     reward: 680 },
      { name: 'Ace Trainer Brian',  sprite: S.aceM,      team: pk([128, 111], 35),   reward: 960 },
      { name: 'Picnicker Valerie',  sprite: S.picnicker, team: pk([84, 22, 39], 34), reward: 760 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Rotas da costa sul.',
  },

  safari_zone: {
    id: 'safari_zone', name: 'Zona Safari', type: 'farm', group: 'Fuchsia City',
    unlockLevel: 38, requirements: ['rainbow_badge'],
    biome: 'grass',
    enemies: pk([128, 115, 113, 111, 123, 127], 25),
    trainerChance: 0, trainers: [],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Reserva com Pokemon raros.',
  },

  fuchsia_city: {
    id: 'fuchsia_city', name: 'Fuchsia City', type: 'city', group: 'Fuchsia City',
    hasGym: true, gymLeader: GYM_LEADERS.koga,
    unlockLevel: 38, requirements: ['rainbow_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    keyBattles: [
      { id: 'gym_koga', name: 'Lider Koga — Ginasio de Fuchsia', type: 'gym_leader', sprite: S.koga,
        team: pk([109, 89, 110, 49], 43), reward: 7000, badgeToGive: 5, unlockFlag: 'soul_badge',
        description: 'Derrote Koga para ganhar a Insignia da Alma!' },
    ],
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Cidade venenosa. Derrote Koga!',
  },

  silph_co: {
    id: 'silph_co', name: 'Silph Co.', type: 'farm', group: 'Saffron City',
    unlockLevel: 40, requirements: ['soul_badge'],
    biome: 'mountain',
    enemies: pk([100, 81, 137, 63, 96], 35),
    trainerChance: 0.15,
    trainers: [
      { name: 'Team Rocket Grunt M', sprite: S.rocket,  team: pk([41, 23, 88], 35),  reward: 900,  isRocket: true },
      { name: 'Team Rocket Grunt F', sprite: S.rocketF, team: pk([100, 81], 35),     reward: 900,  isRocket: true },
      { name: 'Scientist Delman',    sprite: S.aceM,    team: pk([137, 100], 36),    reward: 1000 },
      { name: 'Scientist Jerry',     sprite: S.aceM,    team: pk([81, 63], 36),      reward: 1000 },
    ],
    keyBattles: [
      { id: 'rival_silph', name: 'Desafiar Rival — Silph Co.', type: 'rival', sprite: S.blue,
        team: pk([18, 65, 53], 40), reward: 2000, unlockFlag: 'rival_4_defeated',
        description: 'Azul esta na Silph Co.! Derrote-o antes de chegar a Giovanni.' },
      { id: 'giovanni_silph', name: 'Giovanni — Presidente da Silph Co.', type: 'boss', sprite: S.giovanni,
        team: pk([52, 88, 95, 111, 112], 42), reward: 6000, isRocket: true, unlockFlag: 'silph_co_cleared',
        description: 'Giovanni tomou a Silph Co.! Derrote-o para libertar Saffron.' },
    ],
    background: '/battle_bg_lab_1776866008842.png',
    description: 'Torre dominada pela Rocket. Rival e Giovanni te esperam!',
  },

  saffron_city: {
    id: 'saffron_city', name: 'Saffron City', type: 'city', group: 'Saffron City',
    hasGym: true, gymLeader: GYM_LEADERS.sabrina,
    unlockLevel: 42, requirements: ['soul_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    keyBattles: [
      { id: 'gym_sabrina', name: 'Lider Sabrina — Ginasio de Saffron', type: 'gym_leader', sprite: S.sabrina,
        team: pk([64, 122, 65], 46), reward: 8000, badgeToGive: 6, unlockFlag: 'marsh_badge',
        description: 'Derrote Sabrina para ganhar a Insignia do Pantano!' },
    ],
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Centro psiquico de Kanto. Derrote Sabrina!',
  },

  route_16_18: {
    id: 'route_16_18', name: 'Cycling Road', type: 'farm', group: 'Fuchsia City',
    unlockLevel: 40, requirements: ['soul_badge'],
    biome: 'grass',
    enemies: pk([84, 22, 128], 35),
    trainerChance: 0.10,
    trainers: [
      { name: 'Biker Ruben',       sprite: S.cooltrainer, team: pk([22, 84], 36),     reward: 900  },
      { name: 'Biker Virgil',      sprite: S.cooltrainer, team: pk([84, 22, 22], 35), reward: 860  },
      { name: 'Cooltrainer Mitch', sprite: S.cooltrainer, team: pk([128, 22], 37),    reward: 1000 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'Cycling Road!',
  },

  pokemon_mansion: {
    id: 'pokemon_mansion', name: 'Mansao Pokemon', type: 'farm', group: 'Cinnabar Island',
    unlockLevel: 44, requirements: ['marsh_badge'],
    biome: 'mountain',
    enemies: pk([88, 109, 126, 132, 89], 38),
    trainerChance: 0.12,
    trainers: [
      { name: 'Scientist Rodney', sprite: S.aceM,    team: pk([88, 109], 38),      reward: 1100 },
      { name: 'Scientist Grant',  sprite: S.aceM,    team: pk([132, 126], 39),     reward: 1200 },
      { name: 'Burglar Simon',    sprite: S.gambler, team: pk([109, 88, 89], 40),  reward: 1400 },
    ],
    keyBattles: [
      { id: 'mansion_rocket_boss', name: 'Admin Rocket — Mansao Pokemon', type: 'rocket', sprite: S.rocket,
        team: pk([88, 109, 110, 132], 43), reward: 2500, isRocket: true, unlockFlag: 'mansion_cleared',
        description: 'A Rocket esconde algo na Mansao! Derrote o Admin para a Chave Secreta.' },
    ],
    background: '/battle_bg_lab_1776866008842.png',
    description: 'Mansao abandonada com segredos da Rocket.',
  },

  cinnabar_island: {
    id: 'cinnabar_island', name: 'Cinnabar Island', type: 'city', group: 'Cinnabar Island',
    hasGym: true, gymLeader: GYM_LEADERS.blaine,
    unlockLevel: 46, requirements: ['marsh_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    keyBattles: [
      { id: 'gym_blaine', name: 'Lider Blaine — Ginasio de Cinnabar', type: 'gym_leader', sprite: S.blaine,
        team: pk([58, 78, 126, 77], 50), reward: 9500, badgeToGive: 7, unlockFlag: 'volcano_badge',
        description: 'Derrote Blaine para ganhar a Insignia do Vulcao!' },
    ],
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Ilha vulcanica. Derrote Blaine!',
  },

  route_22_23: {
    id: 'route_22_23', name: 'Rota 23', type: 'farm', group: 'Victory Road',
    unlockLevel: 50, requirements: ['volcano_badge'],
    biome: 'grass',
    enemies: pk([22, 23, 67, 105, 148], 45),
    trainerChance: 0.12,
    trainers: [
      { name: 'Cooltrainer Kate',   sprite: S.cooltrainer, team: pk([22, 105], 46),  reward: 2000 },
      { name: 'Cooltrainer Male',   sprite: S.cooltrainer, team: pk([67, 23], 47),   reward: 2000 },
      { name: 'Ace Trainer Parker', sprite: S.aceM,        team: pk([148, 22], 48),  reward: 2500 },
    ],
    background: '/battle_bg_grass_1776863779024.png',
    description: 'O caminho para o ultimo ginasio.',
  },

  viridian_gym: {
    id: 'viridian_gym', name: 'Ginasio de Viridian', type: 'city', group: 'Victory Road',
    hasGym: true, gymLeader: GYM_LEADERS.giovanni,
    unlockLevel: 50, requirements: ['volcano_badge'],
    enemies: [], trainers: [], trainerChance: 0,
    keyBattles: [
      { id: 'rival_viridian', name: 'Desafiar Rival — Ginasio de Viridian', type: 'rival', sprite: S.blue,
        team: pk([18, 65, 112, 28, 59], 50), reward: 3500, unlockFlag: 'rival_5_defeated',
        description: 'Azul esta no Ginasio! Derrote-o antes de Giovanni.' },
      { id: 'gym_giovanni', name: 'Lider Giovanni — Ginasio de Viridian', type: 'gym_leader', sprite: S.giovanni,
        team: pk([111, 51, 112, 34], 55), reward: 15000, badgeToGive: 8, unlockFlag: 'earth_badge',
        description: 'Giovanni e o Lider da Rocket! Conquiste a 8a Insignia!' },
    ],
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Ginasio misterioso e seu segredo sombrio.',
  },

  victory_road: {
    id: 'victory_road', name: 'Victory Road', type: 'farm', group: 'Victory Road',
    unlockLevel: 55, requirements: ['earth_badge'],
    biome: 'mountain',
    enemies: pk([95, 67, 105, 112, 148], 48),
    trainerChance: 0.12,
    trainers: [
      { name: 'Cooltrainer Naomi',  sprite: S.cooltrainer, team: pk([105, 67], 48),  reward: 2400 },
      { name: 'Ace Trainer Samuel', sprite: S.aceM,        team: pk([112, 95], 49),  reward: 2600 },
      { name: 'Cooltrainer George', sprite: S.cooltrainer, team: pk([148, 105], 50), reward: 2800 },
    ],
    keyBattles: [
      { id: 'rival_victory_road', name: 'Desafiar Rival — Victory Road', type: 'rival', sprite: S.blue,
        team: pk([18, 65, 112, 28, 59, 149], 53), reward: 5000, unlockFlag: 'rival_6_defeated',
        description: 'Azul esta no Victory Road! Uma ultima disputa antes da Liga.' },
    ],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'Caverna do desafio final. Seu rival te aguarda!',
  },

  indigo_plateau: {
    id: 'indigo_plateau', name: 'Plateau Indigo', type: 'city', group: 'Elite Four',
    unlockLevel: 58, requirements: ['rival_6_defeated', 'earth_badge'],
    hasGym: false,
    enemies: [], trainers: [], trainerChance: 0,
    keyBattles: [
      { id: 'elite_lorelei', name: 'Lorelei — Elite Four', type: 'elite', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lorelei.png',
        team: pk([87, 91, 80, 86, 124], 58), reward: 20000, unlockFlag: 'lorelei_defeated',
        description: 'Ninguem resiste ao frio dos meus Pokemon!' },
      { id: 'elite_bruno', name: 'Bruno — Elite Four', type: 'elite', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bruno.png',
        team: pk([95, 95, 107, 106, 68], 58), reward: 20000, unlockFlag: 'bruno_defeated',
        description: 'Treinei meu corpo e mente. Voce esta pronto?' },
      { id: 'elite_agatha', name: 'Agatha — Elite Four', type: 'elite', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/agatha.png',
        team: pk([93, 42, 93, 94, 42], 60), reward: 20000, unlockFlag: 'agatha_defeated',
        description: 'Hee hee! Os fantasmas irão engoli-lo!' },
      { id: 'elite_lance', name: 'Lance — Elite Four', type: 'elite', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lance.png',
        team: pk([148, 148, 130, 149, 142], 62), reward: 20000, unlockFlag: 'lance_defeated',
        description: 'Meus Dragoes sao invenciveis!' },
      { id: 'champion_blue', name: 'Campeao Azul — Liga Pokemon', type: 'rival', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue2.png',
        team: pk([18, 65, 112, 28, 59, 149], 65), reward: 50000, unlockFlag: 'champion',
        description: 'Azul e o Campeao! A batalha final comeca agora!' },
    ],
    background: '/battle_bg_gym_1776863824590.png',
    description: 'Plateau Indigo — sede da Liga Pokemon de Kanto.',
  },

  cerulean_cave: {
    id: 'cerulean_cave', name: 'Caverna Cerulean', type: 'farm', group: 'Pos-Game',
    unlockLevel: 60, requirements: ['champion'],
    biome: 'mountain',
    enemies: pk([42, 47, 67, 75, 95, 132, 113], 60),
    trainerChance: 0, trainers: [],
    keyBattles: [
      { id: 'mewtwo', name: 'Mewtwo — Lenda de Kanto', type: 'legendary', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
        team: pk([150], 70), reward: 100000, unlockFlag: 'mewtwo_defeated',
        description: 'O ser mais poderoso do mundo. A batalha definitiva de Kanto!' },
    ],
    background: '/battle_bg_cave_1776863810604.png',
    description: 'Caverna proibida — lar de uma lenda.',
  },
};

export const isRouteUnlocked = (route, gameState) => {
  if (!route.requirements || route.requirements.length === 0) return true;
  return route.requirements.every(req => {
    if (req === 'has_starter')   return (gameState.team?.length || 0) > 0;
    if (req === 'boulder_badge') return gameState.badges?.includes(1);
    if (req === 'cascade_badge') return gameState.badges?.includes(2);
    if (req === 'thunder_badge') return gameState.badges?.includes(3);
    if (req === 'rainbow_badge') return gameState.badges?.includes(4);
    if (req === 'soul_badge')    return gameState.badges?.includes(5);
    if (req === 'marsh_badge')   return gameState.badges?.includes(6);
    if (req === 'volcano_badge') return gameState.badges?.includes(7);
    if (req === 'earth_badge')   return gameState.badges?.includes(8);
    return (gameState.worldFlags || []).includes(req);
  });
};

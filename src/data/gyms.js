// Dados dos Ginásios de Kanto + Liga Pokémon

export const GYM_BG = {
  Rock:     "url('/battle_bg_gym_rock.webp') center/cover no-repeat",
  Water:    "url('/battle_bg_gym_water.webp') center/cover no-repeat",
  Electric: "url('/battle_bg_gym_electric.webp') center/cover no-repeat",
  Elite:    "url('/battle_bg_elite_four.webp') center/cover no-repeat",
  Grass:    "url('/battle_bg_forest_1776863795763.webp') center/cover no-repeat",
  Poison:   "url('/battle_bg_gym_1776863824590.webp') center/cover no-repeat",
  Psychic:  "url('/battle_bg_gym_1776863824590.webp') center/cover no-repeat",
  Fire:     "url('/battle_bg_cave_1776863810604.webp') center/cover no-repeat",
  Ground:   "url('/battle_bg_gym_1776863824590.webp') center/cover no-repeat",
};

export const GYMS = [
  {
    id: 'brock',
    badge: 'boulder_badge',
    badgeOrder: 1,
    badgeName: 'Insígnia Boulder',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hard-stone.png',
    name: 'Brock',
    city: 'Cidade Chumbo',
    type: 'Rock',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brock.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/rock.svg',
    unlockAfterBadges: 0, 
    reward: 1500,
    background: GYM_BG.Rock,
    location: 'Ginásio de Pewter',
    quote: '"Minha defesa de rocha vai te esmagar!"',
    team: [
      { id: 74, level: 12 }, 
      { id: 95, level: 14 }, 
    ],
    rematchTeam: [
      { id: 75, level: 45 }, 
      { id: 111, level: 46 }, 
      { id: 138, level: 48 }, 
      { id: 140, level: 48 }, 
      { id: 95, level: 52 }, 
      { id: 142, level: 55 }, 
    ]
  },
  {
    id: 'misty',
    badge: 'cascade_badge',
    badgeOrder: 2,
    badgeName: 'Insígnia Cascade',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mystic-water.png',
    name: 'Misty',
    city: 'Cidade Cerúlea',
    type: 'Water',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/misty.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/water.svg',
    unlockAfterBadges: 1,
    reward: 2000,
    background: GYM_BG.Water,
    location: 'Ginásio de Cerulean',
    quote: '"Minhas habilidades aquáticas vão te engolir!"',
    team: [
      { id: 120, level: 18 }, 
      { id: 121, level: 21 }, 
    ],
    rematchTeam: [
      { id: 54, level: 48 }, 
      { id: 86, level: 49 }, 
      { id: 116, level: 50 }, 
      { id: 131, level: 52 }, 
      { id: 121, level: 54 }, 
      { id: 130, level: 56 }, 
    ]
  },
  {
    id: 'surge',
    badge: 'thunder_badge',
    badgeOrder: 3,
    badgeName: 'Insígnia Thunder',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/magnet.png',
    name: 'Lt. Surge',
    city: 'Cidade Celadon',
    type: 'Electric',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/electric.svg',
    unlockAfterBadges: 2,
    reward: 2500,
    background: GYM_BG.Electric,
    location: 'Ginásio de Vermilion',
    quote: '"Eletricidade: o melhor tipo de batalha!"',
    team: [
      { id: 100, level: 21 }, 
      { id: 25,  level: 21 }, 
      { id: 26,  level: 24 }, 
    ],
    rematchTeam: [
      { id: 101, level: 50 }, 
      { id: 82, level: 51 }, 
      { id: 125, level: 53 }, 
      { id: 135, level: 54 }, 
      { id: 26, level: 56 }, 
    ]
  },
  {
    id: 'erika',
    badge: 'rainbow_badge',
    badgeOrder: 4,
    badgeName: 'Insígnia Rainbow',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/miracle-seed.png',
    name: 'Erika',
    city: 'Cidade Celadon',
    type: 'Grass',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/erika.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/grass.svg',
    unlockAfterBadges: 3,
    reward: 3000,
    background: GYM_BG.Grass,
    location: 'Ginásio de Celadon',
    quote: '"A natureza sempre vence. Bem-vindo ao meu jardim."',
    team: [
      { id: 71,  level: 29 }, 
      { id: 114, level: 31 }, 
      { id: 45,  level: 32 }, 
    ],
    rematchTeam: [
      { id: 45, level: 52 }, 
      { id: 114, level: 53 }, 
      { id: 71, level: 54 }, 
      { id: 103, level: 56 }, 
      { id: 3, level: 60 }, 
    ]
  },
  {
    id: 'koga',
    badge: 'soul_badge',
    badgeOrder: 5,
    badgeName: 'Insígnia Soul',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poison-barb.png',
    name: 'Koga',
    city: 'Cidade Fúcsia',
    type: 'Poison',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/koga.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/poison.svg',
    unlockAfterBadges: 4,
    reward: 3500,
    background: GYM_BG.Poison,
    location: 'Ginásio de Fuchsia',
    quote: '"O veneno age lentamente. Igual a minha vitória."',
    team: [
      { id: 109, level: 37 }, 
      { id: 109, level: 39 }, 
      { id: 110, level: 43 }, 
    ],
    rematchTeam: [
      { id: 110, level: 54 }, 
      { id: 89, level: 55 }, 
      { id: 73, level: 56 }, 
      { id: 49, level: 57 }, 
      { id: 169, level: 60 }, 
    ]
  },
  {
    id: 'sabrina',
    badge: 'marsh_badge',
    badgeOrder: 6,
    badgeName: 'Insígnia Marsh',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/twisted-spoon.png',
    name: 'Sabrina',
    city: 'Cidade Saffron',
    type: 'Psychic',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/sabrina.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/psychic.svg',
    unlockAfterBadges: 5,
    reward: 4000,
    background: GYM_BG.Psychic,
    location: 'Ginásio de Saffron',
    quote: '"Já vi seu futuro. Você perde."',
    team: [
      { id: 64,  level: 38 }, 
      { id: 122, level: 37 }, 
      { id: 49,  level: 38 }, 
      { id: 65,  level: 43 }, 
    ],
    rematchTeam: [
      { id: 122, level: 55 }, 
      { id: 97, level: 56 }, 
      { id: 124, level: 57 }, 
      { id: 65, level: 60 }, 
      { id: 196, level: 62 }, 
    ]
  },
  {
    id: 'blaine',
    badge: 'volcano_badge',
    badgeOrder: 7,
    badgeName: 'Insígnia Volcano',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charcoal.png',
    name: 'Blaine',
    city: 'Ilha Cinnabar',
    type: 'Fire',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blaine.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fire.svg',
    unlockAfterBadges: 6,
    reward: 4500,
    background: GYM_BG.Fire,
    location: 'Ginásio de Cinnabar',
    quote: '"Meu fogo nunca se apaga!"',
    team: [
      { id: 58,  level: 47 }, 
      { id: 77,  level: 48 }, 
      { id: 78,  level: 50 }, 
      { id: 59,  level: 50 }, 
    ],
    rematchTeam: [
      { id: 38, level: 58 }, 
      { id: 78, level: 59 }, 
      { id: 126, level: 60 }, 
      { id: 59, level: 62 }, 
      { id: 6, level: 65 }, 
    ]
  },
  {
    id: 'giovanni',
    badge: 'earth_badge',
    badgeOrder: 8,
    badgeName: 'Insígnia Earth',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soft-sand.png',
    name: 'Giovanni',
    city: 'Cidade Viridian',
    type: 'Ground',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/giovanni.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ground.svg',
    unlockAfterBadges: 7,
    reward: 5000,
    background: GYM_BG.Ground,
    location: 'Ginásio de Viridian',
    quote: '"Sou o chefe da Equipe Rocket. Você não pode me deter!"',
    team: [
      { id: 111, level: 50 }, 
      { id: 51,  level: 52 }, 
      { id: 112, level: 53 }, 
      { id: 34,  level: 54 }, 
      { id: 112, level: 55 }, 
    ],
    rematchTeam: [
      { id: 51, level: 65 }, 
      { id: 34, level: 68 }, 
      { id: 31, level: 68 }, 
      { id: 112, level: 72 }, 
      { id: 130, level: 75 }, 
    ]
  },
];

export const ELITE_FOUR = [
  {
    id: 'lorelei',
    name: 'Lorelei',
    title: 'Elite 4 - Lorelei',
    type: 'Ice',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lorelei-gen3.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ice.svg',
    background: GYM_BG.Elite,
    location: 'Liga Pokémon — Sala 1',
    reward: 6000,
    quote: '"Ninguém pode derrotar meu gelo!"',
    team: [{ id: 87, level: 54 }, { id: 91, level: 53 }, { id: 80, level: 54 }, { id: 124, level: 54 }, { id: 131, level: 56 }],
    rematchTeam: [
      { id: 87, level: 70 }, // Dewgong
      { id: 91, level: 72 }, // Cloyster
      { id: 124, level: 74 }, // Jynx
      { id: 131, level: 76 }, // Lapras
      { id: 134, level: 78 }, // Vaporeon
    ]
  },
  {
    id: 'bruno',
    name: 'Bruno',
    title: 'Elite 4 - Bruno',
    type: 'Fighting',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bruno.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fighting.svg',
    background: GYM_BG.Elite,
    location: 'Liga Pokémon — Sala 2',
    reward: 6000,
    quote: '"Meus punhos são mais duros que pedra!"',
    team: [{ id: 95, level: 53 }, { id: 107, level: 55 }, { id: 107, level: 55 }, { id: 95, level: 56 }, { id: 68, level: 58 }],
    rematchTeam: [
      { id: 95, level: 72 }, // Onix
      { id: 106, level: 74 }, // Hitmonlee
      { id: 107, level: 74 }, // Hitmonchan
      { id: 62, level: 76 }, // Poliwrath
      { id: 68, level: 80 }, // Machamp
    ]
  },
  {
    id: 'agatha',
    name: 'Agatha',
    title: 'Elite 4 - Agatha',
    type: 'Ghost',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/agatha-gen3.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ghost.svg',
    background: GYM_BG.Elite,
    location: 'Liga Pokémon — Sala 3',
    reward: 6000,
    quote: '"Meus espíritos te envolvem!"',
    team: [{ id: 94, level: 54 }, { id: 42, level: 54 }, { id: 94, level: 58 }, { id: 42, level: 56 }, { id: 94, level: 60 }],
    rematchTeam: [
      { id: 42, level: 74 }, // Golbat
      { id: 122, level: 75 }, // Mr. Mime
      { id: 94, level: 78 }, // Gengar
      { id: 94, level: 80 }, // Gengar
      { id: 197, level: 82 }, // Umbreon
    ]
  },
  {
    id: 'lance',
    name: 'Lance',
    title: 'Elite 4 - Lance',
    type: 'Dragon',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lance.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/dragon.svg',
    background: GYM_BG.Elite,
    location: 'Liga Pokémon — Sala 4',
    reward: 7000,
    quote: '"Dragões são a força máxima!"',
    team: [{ id: 148, level: 56 }, { id: 148, level: 56 }, { id: 130, level: 58 }, { id: 149, level: 60 }, { id: 149, level: 62 }],
    rematchTeam: [
      { id: 130, level: 78 }, // Gyarados
      { id: 142, level: 80 }, // Aerodactyl
      { id: 149, level: 82 }, // Dragonite
      { id: 149, level: 85 }, // Dragonite
      { id: 248, level: 88 }, // Tyranitar (Lance has one in rematches)
    ]
  },
  {
    id: 'blue',
    name: 'Azul',
    title: 'Campeão - Azul',
    type: 'Mixed',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    typeIcon: null,
    background: GYM_BG.Elite,
    location: 'Liga Pokémon — Salão do Campeão',
    reward: 10000,
    quote: '"Snorkel! Você está atrasado para a derrota!"',
    team: [{ id: 18, level: 59 }, { id: 103, level: 60 }, { id: 65, level: 63 }, { id: 112, level: 62 }, { id: 59, level: 61 }, { id: 6, level: 65 }],
    rematchTeam: [
      { id: 18, level: 85 }, // Pidgeot
      { id: 103, level: 86 }, // Exeggutor
      { id: 112, level: 86 }, // Rhydon
      { id: 65, level: 88 }, // Alakazam
      { id: 130, level: 88 }, // Gyarados
      { id: 6, level: 92 }, // Charizard
    ]
  },
];

export const TYPE_COLOR_HEX = {
  Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
  Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
  Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
  Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
  Steel: '#5a8ea2', Fairy: '#fb89eb', Mixed: '#2a2a4a',
};

// Dados dos Ginásios de Kanto + Liga Pokémon

export const GYM_BG = {
  Rock:     "url('/battle_bg_gym_rock.png') center/cover no-repeat",
  Water:    "url('/battle_bg_gym_water.png') center/cover no-repeat",
  Electric: "url('/battle_bg_gym_electric.png') center/cover no-repeat",
  Elite:    "url('/battle_bg_elite_four.png') center/cover no-repeat",
  Grass:    "url('/battle_bg_grass_1776863779024.png') center/cover no-repeat",
  Poison:   "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat",
  Psychic:  "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat",
  Fire:     "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat",
  Ground:   "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat",
};

export const GYMS = [
  {
    id: 'brock',
    badge: 'boulder_badge',
    badgeOrder: 1,
    badgeName: 'Insígnia Boulder',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/boulder-badge.png',
    name: 'Brock',
    city: 'Cidade Chumbo',
    type: 'Rock',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brock.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/rock.svg',
    unlockAfterBadges: 0, // primeiro ginásio, sempre disponível
    reward: 1500,
    background: GYM_BG.Rock,
    quote: '"Minha defesa de rocha vai te esmagar!"',
    team: [
      { id: 74, level: 12 }, // Geodude
      { id: 95, level: 14 }, // Onix
    ]
  },
  {
    id: 'misty',
    badge: 'cascade_badge',
    badgeOrder: 2,
    badgeName: 'Insígnia Cascade',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cascade-badge.png',
    name: 'Misty',
    city: 'Cidade Cerúlea',
    type: 'Water',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/misty.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/water.svg',
    unlockAfterBadges: 1,
    reward: 2000,
    background: GYM_BG.Water,
    quote: '"Minhas habilidades aquáticas vão te engolir!"',
    team: [
      { id: 120, level: 18 }, // Staryu
      { id: 121, level: 21 }, // Starmie
    ]
  },
  {
    id: 'surge',
    badge: 'thunder_badge',
    badgeOrder: 3,
    badgeName: 'Insígnia Thunder',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-badge.png',
    name: 'Lt. Surge',
    city: 'Cidade Celadon',
    type: 'Electric',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/electric.svg',
    unlockAfterBadges: 2,
    reward: 2500,
    background: GYM_BG.Electric,
    quote: '"Eletricidade: o melhor tipo de batalha!"',
    team: [
      { id: 100, level: 21 }, // Voltorb
      { id: 25,  level: 21 }, // Pikachu
      { id: 26,  level: 24 }, // Raichu
    ]
  },
  {
    id: 'erika',
    badge: 'rainbow_badge',
    badgeOrder: 4,
    badgeName: 'Insígnia Rainbow',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rainbow-badge.png',
    name: 'Erika',
    city: 'Cidade Celadon',
    type: 'Grass',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/erika.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/grass.svg',
    unlockAfterBadges: 3,
    reward: 3000,
    background: GYM_BG.Grass,
    quote: '"A natureza sempre vence. Bem-vindo ao meu jardim."',
    team: [
      { id: 71,  level: 29 }, // Victreebel
      { id: 114, level: 31 }, // Tangela
      { id: 45,  level: 32 }, // Vileplume
    ]
  },
  {
    id: 'koga',
    badge: 'soul_badge',
    badgeOrder: 5,
    badgeName: 'Insígnia Soul',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soul-badge.png',
    name: 'Koga',
    city: 'Cidade Fúcsia',
    type: 'Poison',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/koga.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/poison.svg',
    unlockAfterBadges: 4,
    reward: 3500,
    background: GYM_BG.Poison,
    quote: '"O veneno age lentamente. Igual a minha vitória."',
    team: [
      { id: 109, level: 37 }, // Koffing
      { id: 109, level: 39 }, // Koffing
      { id: 110, level: 43 }, // Weezing
    ]
  },
  {
    id: 'sabrina',
    badge: 'marsh_badge',
    badgeOrder: 6,
    badgeName: 'Insígnia Marsh',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/marsh-badge.png',
    name: 'Sabrina',
    city: 'Cidade Saffron',
    type: 'Psychic',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/sabrina.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/psychic.svg',
    unlockAfterBadges: 5,
    reward: 4000,
    background: GYM_BG.Psychic,
    quote: '"Já vi seu futuro. Você perde."',
    team: [
      { id: 64,  level: 38 }, // Kadabra
      { id: 122, level: 37 }, // Mr. Mime
      { id: 49,  level: 38 }, // Venomoth
      { id: 65,  level: 43 }, // Alakazam
    ]
  },
  {
    id: 'blaine',
    badge: 'volcano_badge',
    badgeOrder: 7,
    badgeName: 'Insígnia Volcano',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/volcano-badge.png',
    name: 'Blaine',
    city: 'Ilha Cinnabar',
    type: 'Fire',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blaine.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fire.svg',
    unlockAfterBadges: 6,
    reward: 4500,
    background: GYM_BG.Fire,
    quote: '"Meu fogo nunca se apaga!"',
    team: [
      { id: 58,  level: 47 }, // Growlithe
      { id: 77,  level: 48 }, // Ponyta
      { id: 78,  level: 50 }, // Rapidash
      { id: 59,  level: 50 }, // Arcanine
    ]
  },
  {
    id: 'giovanni',
    badge: 'earth_badge',
    badgeOrder: 8,
    badgeName: 'Insígnia Earth',
    badgeImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/earth-badge.png',
    name: 'Giovanni',
    city: 'Cidade Viridian',
    type: 'Ground',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/giovanni.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ground.svg',
    unlockAfterBadges: 7,
    reward: 5000,
    background: GYM_BG.Ground,
    quote: '"Sou o chefe da Equipe Rocket. Você não pode me deter!"',
    team: [
      { id: 111, level: 45 }, // Rhyhorn
      { id: 51,  level: 42 }, // Dugtrio
      { id: 112, level: 45 }, // Rhydon
      { id: 51,  level: 47 }, // Dugtrio
      { id: 112, level: 50 }, // Rhydon
    ]
  },
];

export const ELITE_FOUR = [
  {
    id: 'lorelei',
    name: 'Lorelei',
    title: 'Elite 4 - Lorelei',
    type: 'Ice',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lorelei.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ice.svg',
    background: GYM_BG.Elite,
    reward: 6000,
    quote: '"Ninguém pode derrotar meu gelo!"',
    team: [{ id: 87, level: 54 }, { id: 91, level: 53 }, { id: 80, level: 54 }, { id: 124, level: 54 }, { id: 131, level: 56 }]
  },
  {
    id: 'bruno',
    name: 'Bruno',
    title: 'Elite 4 - Bruno',
    type: 'Fighting',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bruno.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fighting.svg',
    background: GYM_BG.Elite,
    reward: 6000,
    quote: '"Meus punhos são mais duros que pedra!"',
    team: [{ id: 95, level: 53 }, { id: 107, level: 55 }, { id: 107, level: 55 }, { id: 95, level: 56 }, { id: 68, level: 58 }]
  },
  {
    id: 'agatha',
    name: 'Agatha',
    title: 'Elite 4 - Agatha',
    type: 'Ghost',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/agatha.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ghost.svg',
    background: GYM_BG.Elite,
    reward: 6000,
    quote: '"Meus espíritos te envolvem!"',
    team: [{ id: 94, level: 54 }, { id: 42, level: 54 }, { id: 94, level: 58 }, { id: 42, level: 56 }, { id: 94, level: 60 }]
  },
  {
    id: 'lance',
    name: 'Lance',
    title: 'Elite 4 - Lance',
    type: 'Dragon',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lance.png',
    typeIcon: 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/dragon.svg',
    background: GYM_BG.Elite,
    reward: 7000,
    quote: '"Dragíµes são a força máxima!"',
    team: [{ id: 148, level: 56 }, { id: 148, level: 56 }, { id: 130, level: 58 }, { id: 149, level: 60 }, { id: 149, level: 62 }]
  },
  {
    id: 'blue',
    name: 'Azul',
    title: 'Campeão - Azul',
    type: 'Mixed',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    typeIcon: null,
    background: GYM_BG.Elite,
    reward: 10000,
    quote: '"Snorkel! Você está atrasado para a derrota!"',
    team: [{ id: 18, level: 59 }, { id: 103, level: 60 }, { id: 65, level: 63 }, { id: 112, level: 62 }, { id: 59, level: 61 }, { id: 6, level: 65 }]
  },
];

export const TYPE_COLOR_HEX = {
  Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
  Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
  Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
  Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
  Steel: '#5a8ea2', Fairy: '#fb89eb', Mixed: '#2a2a4a',
};

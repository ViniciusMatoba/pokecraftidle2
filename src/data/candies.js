// Sistema de Candies — inspirado em Pokémon GO e Let's Go
// Cada família evolutiva tem seu Candy exclusivo
//
// VISUAL: Como o Pokémon GO não disponibiliza sprites de candy publicamente,
// o candy de cada família usa o sprite do Pokémon base (id) com fundo colorido
// por tipo — fiel ao estilo GO onde o candy tem a "cara" do Pokémon.
// O campo `spriteId` é o id do Pokémon que aparece no ícone do candy.
// O campo `rareCandySprite` é o Rare Candy clássico dos jogos principais.

const RARE_CANDY = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png';

export const CANDY_FAMILIES = {
  bulbasaur_candy:   { ids:[1,2,3],          name:'Candy Bulbasaur',  spriteId:1,   color:'#4ade80', rareCandySprite: RARE_CANDY },
  charmander_candy:  { ids:[4,5,6],           name:'Candy Charmander', spriteId:4,   color:'#f97316', rareCandySprite: RARE_CANDY },
  squirtle_candy:    { ids:[7,8,9],           name:'Candy Squirtle',   spriteId:7,   color:'#38bdf8', rareCandySprite: RARE_CANDY },
  caterpie_candy:    { ids:[10,11,12],         name:'Candy Caterpie',   spriteId:10,  color:'#bbf7d0', rareCandySprite: RARE_CANDY },
  weedle_candy:      { ids:[13,14,15],         name:'Candy Weedle',     spriteId:13,  color:'#fde68a', rareCandySprite: RARE_CANDY },
  pidgey_candy:      { ids:[16,17,18],         name:'Candy Pidgey',     spriteId:16,  color:'#d6d3d1', rareCandySprite: RARE_CANDY },
  rattata_candy:     { ids:[19,20],            name:'Candy Rattata',    spriteId:19,  color:'#e9d5ff', rareCandySprite: RARE_CANDY },
  spearow_candy:     { ids:[21,22],            name:'Candy Spearow',    spriteId:21,  color:'#fed7aa', rareCandySprite: RARE_CANDY },
  ekans_candy:       { ids:[23,24],            name:'Candy Ekans',      spriteId:23,  color:'#c4b5fd', rareCandySprite: RARE_CANDY },
  pikachu_candy:     { ids:[25,26],            name:'Candy Pikachu',    spriteId:25,  color:'#fef08a', rareCandySprite: RARE_CANDY },
  sandshrew_candy:   { ids:[27,28],            name:'Candy Sandshrew',  spriteId:27,  color:'#fef3c7', rareCandySprite: RARE_CANDY },
  nidoran_f_candy:   { ids:[29,30,31],         name:'Candy Nidoran@',   spriteId:29,  color:'#fbcfe8', rareCandySprite: RARE_CANDY },
  nidoran_m_candy:   { ids:[32,33,34],         name:'Candy NidoranB',   spriteId:32,  color:'#ddd6fe', rareCandySprite: RARE_CANDY },
  clefairy_candy:    { ids:[35,36],            name:'Candy Clefairy',   spriteId:35,  color:'#fce7f3', rareCandySprite: RARE_CANDY },
  vulpix_candy:      { ids:[37,38],            name:'Candy Vulpix',     spriteId:37,  color:'#fed7aa', rareCandySprite: RARE_CANDY },
  jigglypuff_candy:  { ids:[39,40],            name:'Candy Jigglypuff', spriteId:39,  color:'#fce7f3', rareCandySprite: RARE_CANDY },
  zubat_candy:       { ids:[41,42],            name:'Candy Zubat',      spriteId:41,  color:'#ede9fe', rareCandySprite: RARE_CANDY },
  oddish_candy:      { ids:[43,44,45],         name:'Candy Oddish',     spriteId:43,  color:'#d1fae5', rareCandySprite: RARE_CANDY },
  paras_candy:       { ids:[46,47],            name:'Candy Paras',      spriteId:46,  color:'#fef3c7', rareCandySprite: RARE_CANDY },
  venonat_candy:     { ids:[48,49],            name:'Candy Venonat',    spriteId:48,  color:'#ede9fe', rareCandySprite: RARE_CANDY },
  diglett_candy:     { ids:[50,51],            name:'Candy Diglett',    spriteId:50,  color:'#fef3c7', rareCandySprite: RARE_CANDY },
  meowth_candy:      { ids:[52,53],            name:'Candy Meowth',     spriteId:52,  color:'#fef9c3', rareCandySprite: RARE_CANDY },
  psyduck_candy:     { ids:[54,55],            name:'Candy Psyduck',    spriteId:54,  color:'#fef9c3', rareCandySprite: RARE_CANDY },
  mankey_candy:      { ids:[56,57],            name:'Candy Mankey',     spriteId:56,  color:'#fecaca', rareCandySprite: RARE_CANDY },
  growlithe_candy:   { ids:[58,59],            name:'Candy Growlithe',  spriteId:58,  color:'#fed7aa', rareCandySprite: RARE_CANDY },
  poliwag_candy:     { ids:[60,61,62],         name:'Candy Poliwag',    spriteId:60,  color:'#bfdbfe', rareCandySprite: RARE_CANDY },
  abra_candy:        { ids:[63,64,65],         name:'Candy Abra',       spriteId:63,  color:'#f3e8ff', rareCandySprite: RARE_CANDY },
  machop_candy:      { ids:[66,67,68],         name:'Candy Machop',     spriteId:66,  color:'#fecaca', rareCandySprite: RARE_CANDY },
  bellsprout_candy:  { ids:[69,70,71],         name:'Candy Bellsprout', spriteId:69,  color:'#d1fae5', rareCandySprite: RARE_CANDY },
  tentacool_candy:   { ids:[72,73],            name:'Candy Tentacool',  spriteId:72,  color:'#bae6fd', rareCandySprite: RARE_CANDY },
  geodude_candy:     { ids:[74,75,76],         name:'Candy Geodude',    spriteId:74,  color:'#e7e5e4', rareCandySprite: RARE_CANDY },
  ponyta_candy:      { ids:[77,78],            name:'Candy Ponyta',     spriteId:77,  color:'#fed7aa', rareCandySprite: RARE_CANDY },
  slowpoke_candy:    { ids:[79,80],            name:'Candy Slowpoke',   spriteId:79,  color:'#fce7f3', rareCandySprite: RARE_CANDY },
  magnemite_candy:   { ids:[81,82],            name:'Candy Magnemite',  spriteId:81,  color:'#fef9c3', rareCandySprite: RARE_CANDY },
  doduo_candy:       { ids:[84,85],            name:'Candy Doduo',      spriteId:84,  color:'#fef3c7', rareCandySprite: RARE_CANDY },
  seel_candy:        { ids:[86,87],            name:'Candy Seel',       spriteId:86,  color:'#e0f2fe', rareCandySprite: RARE_CANDY },
  grimer_candy:      { ids:[88,89],            name:'Candy Grimer',     spriteId:88,  color:'#ede9fe', rareCandySprite: RARE_CANDY },
  shellder_candy:    { ids:[90,91],            name:'Candy Shellder',   spriteId:90,  color:'#bfdbfe', rareCandySprite: RARE_CANDY },
  gastly_candy:      { ids:[92,93,94],         name:'Candy Gastly',     spriteId:92,  color:'#ede9fe', rareCandySprite: RARE_CANDY },
  onix_candy:        { ids:[95],               name:'Candy Onix',       spriteId:95,  color:'#e7e5e4', rareCandySprite: RARE_CANDY },
  drowzee_candy:     { ids:[96,97],            name:'Candy Drowzee',    spriteId:96,  color:'#fef9c3', rareCandySprite: RARE_CANDY },
  krabby_candy:      { ids:[98,99],            name:'Candy Krabby',     spriteId:98,  color:'#fecaca', rareCandySprite: RARE_CANDY },
  voltorb_candy:     { ids:[100,101],          name:'Candy Voltorb',    spriteId:100, color:'#fef9c3', rareCandySprite: RARE_CANDY },
  exeggcute_candy:   { ids:[102,103],          name:'Candy Exeggcute',  spriteId:102, color:'#d1fae5', rareCandySprite: RARE_CANDY },
  cubone_candy:      { ids:[104,105],          name:'Candy Cubone',     spriteId:104, color:'#fef3c7', rareCandySprite: RARE_CANDY },
  hitmons_candy:     { ids:[106,107],          name:'Candy Hitmonchan', spriteId:107, color:'#fecaca', rareCandySprite: RARE_CANDY },
  koffing_candy:     { ids:[109,110],          name:'Candy Koffing',    spriteId:109, color:'#ede9fe', rareCandySprite: RARE_CANDY },
  rhyhorn_candy:     { ids:[111,112],          name:'Candy Rhyhorn',    spriteId:111, color:'#e7e5e4', rareCandySprite: RARE_CANDY },
  horsea_candy:      { ids:[116,117],          name:'Candy Horsea',     spriteId:116, color:'#bae6fd', rareCandySprite: RARE_CANDY },
  goldeen_candy:     { ids:[118,119],          name:'Candy Goldeen',    spriteId:118, color:'#fef9c3', rareCandySprite: RARE_CANDY },
  staryu_candy:      { ids:[120,121],          name:'Candy Staryu',     spriteId:120, color:'#fef3c7', rareCandySprite: RARE_CANDY },
  magikarp_candy:    { ids:[129,130],          name:'Candy Magikarp',   spriteId:129, color:'#fecaca', rareCandySprite: RARE_CANDY },
  eevee_candy:       { ids:[133,134,135,136],  name:'Candy Eevee',      spriteId:133, color:'#fef9c3', rareCandySprite: RARE_CANDY },
  dratini_candy:     { ids:[147,148,149],      name:'Candy Dratini',    spriteId:147, color:'#c7d2fe', rareCandySprite: RARE_CANDY },
  legendary_candy:   { ids:[144,145,146,150,151], name:'Candy Lendário',spriteId:150, color:'#f0abfc', rareCandySprite: RARE_CANDY },
};

// Mapa reverso: pokemon_id → candy_id
export const POKEMON_TO_CANDY = {};
for (const [candyId, data] of Object.entries(CANDY_FAMILIES)) {
  for (const id of data.ids) {
    POKEMON_TO_CANDY[id] = candyId;
  }
}

// Componente visual do candy — usar onde quiser renderizar o ícone
// Usa o sprite do Pokémon base com fundo colorido, igual ao estilo Pokémon GO
// Exemplo de uso no JSX:
// <CandyIcon candyId="pikachu_candy" size={32} />
export const getCandyIconUrl = (candyData) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${candyData.spriteId}.png`;
};

// Usos dos Candies
export const CANDY_USES = {
  xp: {
    id: 'xp',
    name: 'Boost de XP',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png',
    description: 'XP equivalente a 1 level completo',
    cost: 3,
    useXL: false,
    effect: 'xp_boost',
  },
  stat_atk: {
    id: 'stat_atk',
    name: 'Boost de Ataque',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/protein.png',
    description: '+2 Ataque permanente',
    cost: 10,
    useXL: true,
    effect: 'stat_atk',
  },
  stat_def: {
    id: 'stat_def',
    name: 'Boost de Defesa',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron.png',
    description: '+2 Defesa permanente',
    cost: 10,
    useXL: true,
    effect: 'stat_def',
  },
  stat_hp: {
    id: 'stat_hp',
    name: 'Boost de HP',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hp-up.png',
    description: '+5 HP máximo permanente',
    cost: 10,
    useXL: true,
    effect: 'stat_hp',
  },
  stat_speed: {
    id: 'stat_speed',
    name: 'Boost de Velocidade',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/carbos.png',
    description: '+2 Velocidade permanente',
    cost: 10,
    useXL: true,
    effect: 'stat_speed',
  },
  stat_spatk: {
    id: 'stat_spatk',
    name: 'Boost Atq. Especial',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/calcium.png',
    description: '+2 Atq. Especial permanente',
    cost: 10,
    useXL: true,
    effect: 'stat_spatk',
  },
  force_evolve: {
    id: 'force_evolve',
    name: 'Evolução Forçada',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png',
    description: 'Força a evolução agora',
    cost: 50,
    useXL: true,
    effect: 'force_evolve',
  },
};

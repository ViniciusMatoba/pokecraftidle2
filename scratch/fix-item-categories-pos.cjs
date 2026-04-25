const fs = require('fs');
let lines = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8').split(/\r?\n/);

// Define itemCategories at the top of the component
const categoriesDef = [
    `  const itemCategories = [`,
    `    {`,
    `      id: 'capture',`,
    `      label: 'Captura',`,
    `      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',`,
    `      items: [`,
    `        { key:'pokeballs',  label:'Poké Bola', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',   src:'items' },`,
    `        { key:'great_ball', label:'Great Ball', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', src:'items' },`,
    `        { key:'ultra_ball', label:'Ultra Ball', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', src:'items' },`,
    `      ],`,
    `    },`,
    `    {`,
    `      id: 'heal',`,
    `      label: 'Cura',`,
    `      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',`,
    `      items: [`,
    `        { key:'potions',      label:'Poção',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',       src:'items' },`,
    `        { key:'super_potion', label:'Super',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png', src:'items' },`,
    `        { key:'revive',       label:'Reviver', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',       src:'items' },`,
    `      ],`,
    `    },`,
    `    {`,
    `      id: 'food',`,
    `      label: 'Alimentação',`,
    `      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',`,
    `      items: [`,
    `        { key:'moomoo_milk',  label:'Leite',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png',  src:'items' },`,
    `        { key:'lemonade',     label:'Limo.',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',     src:'items' },`,
    `        { key:'soda_pop',     label:'Soda',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',     src:'items' },`,
    `        { key:'fresh_water',  label:'Água',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',  src:'items' },`,
    `        { key:'oran_berry',   label:'Oran',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',   src:'materials' },`,
    `        { key:'sitrus_berry', label:'Sitrus', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png', src:'materials' },`,
    `        { key:'poke_food',    label:'Ração',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure.png',         src:'items' },`,
    `      ],`,
    `    },`,
    `    {`,
    `      id: 'buff',`,
    `      label: 'Buffs',`,
    `      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png',`,
    `      items: [`,
    `        { key:'x_attack',  label:'X Attack',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png',  src:'items' },`,
    `        { key:'x_defense', label:'X Defense', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-defense.png', src:'items' },`,
    `        { key:'x_speed',   label:'X Speed',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-speed.png',   src:'items' },`,
    `      ],`,
    `    },`,
    `  ];`
];

const stateIdx = lines.findIndex(l => l.includes('const [itemCategory'));
lines.splice(stateIdx + 1, 0, ...categoriesDef);

fs.writeFileSync('src/components/BattleScreen.jsx', lines.join('\n'));
console.log('Success');

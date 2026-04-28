const fs = require('fs');
let lines = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8').split(/\r?\n/);

// Mudança 1 — Abas de itens
const tabsStart = lines.findIndex(l => l.includes('          {['));
const tabsEnd = lines.findIndex((l, i) => i > tabsStart && l.includes('          ].map(cat => {'));

if (tabsStart !== -1 && tabsEnd !== -1) {
    const newTabs = [
        `          {[`,
        `            { key: 'capture', label: 'Captura', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', items: [`,
        `              { id: 'pokeballs',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',  label: 'Pokébola', src: 'items' },`,
        `              { id: 'great_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', label: 'Great',    src: 'items' },`,
        `              { id: 'ultra_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', label: 'Ultra',    src: 'items' },`,
        `            ]},`,
        `            { key: 'heal', label: 'Cura', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png', items: [`,
        `              { id: 'potions',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',       label: 'Poção',  src: 'items' },`,
        `              { id: 'super_potion', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png', label: 'Super',  src: 'items' },`,
        `              { id: 'revive',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',       label: 'Reviver',src: 'items' },`,
        `            ]},`,
        `            { key: 'food', label: 'Aliment.', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png', items: [`,
        `              { id: 'moomoo_milk',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png',  label: 'MooMoo', src: 'items' },`,
        `              { id: 'lemonade',         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',     label: 'Limo.',  src: 'items' },`,
        `              { id: 'soda_pop',         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',     label: 'Soda',   src: 'items' },`,
        `              { id: 'fresh_water',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',  label: 'Água',   src: 'items' },`,
        `              { id: 'oran_berry',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',   label: 'Oran',   src: 'materials' },`,
        `              { id: 'sitrus_berry',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png', label: 'Sitrus', src: 'materials' },`,
        `            ]},`,
        `            { key: 'buff', label: 'Buffs', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png', items: [`,
        `              { id: 'x_attack',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png', label: 'X-Atk', src: 'items' },`,
        `              { id: 'x_defense', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-defend.png', label: 'X-Def', src: 'items' },`,
        `              { id: 'x_speed',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-speed.png',  label: 'X-Spd', src: 'items' },`,
        `              { id: 'dire_hit',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dire-hit.png', label: 'Crítico',src: 'items' },`,
        `            ]},`
    ];
    lines.splice(tabsStart, tabsEnd - tabsStart, ...newTabs);
}

// Update the button render in tabs
const btnStart = lines.findIndex(l => l.includes('return ('));
const btnEnd = lines.findIndex((l, i) => i > btnStart && l.includes('            );'));

if (btnStart !== -1 && btnEnd !== -1) {
    const newBtn = [
        `            return (`,
        `              <button key={cat.key} onClick={() => setItemCategory(cat.key)}`,
        `                className={\`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all \${itemCategory === cat.key ? 'border-pokeBlue bg-blue-50' : 'border-slate-100 bg-slate-50'}\`}>`,
        `                <img src={cat.icon} className="w-7 h-7 object-contain" alt={cat.label} />`,
        `                <span className="text-[9px] font-black uppercase text-slate-600">{cat.label}</span>`,
        `              </button>`
    ];
    lines.splice(btnStart, btnEnd - btnStart + 1, ...newBtn);
}

// Mudança 2 — Ataques
const attacksGridIdx = lines.findIndex(l => l.includes('<div className="grid grid-cols-2 gap-2">'));
if (attacksGridIdx !== -1) {
    lines[attacksGridIdx] = lines[attacksGridIdx].replace('gap-2', 'gap-3');
}

const attacksBtnIdx = lines.findIndex(l => l.includes('className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all cursor-pointer'));
if (attacksBtnIdx !== -1) {
    lines[attacksBtnIdx] = lines[attacksBtnIdx].replace('py-2', 'py-4').replace('transition-all cursor-pointer', 'transition-all cursor-pointer min-h-[64px]');
}

fs.writeFileSync('src/components/BattleScreen.jsx', lines.join('\n'));
console.log('Success');

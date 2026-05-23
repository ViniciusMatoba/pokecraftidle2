const fs = require('fs');
let content = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8');

// PASSO 1: Ensure state is correct
// Find the shinyFlash line
const shinyFlashLine = "const [shinyFlash, setShinyFlash] = useState(false);";
const stateToAdd = "  const [itemCategory, setItemCategory] = useState('capture');";

if (content.includes(shinyFlashLine)) {
    // If it already has itemCategory, remove it first to avoid duplicates
    content = content.replace(/const \[itemCategory, setItemCategory\] = useState\([^)]*\);/g, '');
    // Add it after shinyFlash
    content = content.replace(shinyFlashLine, `${shinyFlashLine}\n${stateToAdd}`);
}

// PASSO 2: Replace the items block
// Find the start of the current items block (the first <div> with padding 8px 12px and flex column)
// and the end (before GOLPES)
const lines = content.split(/\r?\n/);
const sectionStart = lines.findIndex(l => l.includes("<div style={{padding:'8px 12px', display:'flex', flexDirection:'column', gap:'10px'}}>"));
const sectionEnd = lines.findIndex(l => l.includes('{/*    GOLPES    */}'));

if (sectionStart !== -1 && sectionEnd !== -1) {
    const newJSX = [
        `      {/* ── ITENS CATEGORIAS ── */}`,
        `      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-3 py-2.5 flex-shrink-0">`,
        `        <div className="flex gap-1.5 mb-2.5">`,
        `          {[`,
        `            { key: 'capture', label: '🎯 Captura', items: [`,
        `              { id: 'pokeballs',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',  label: 'Pokébola', src: 'items' },`,
        `              { id: 'great_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', label: 'Great',    src: 'items' },`,
        `              { id: 'ultra_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', label: 'Ultra',    src: 'items' },`,
        `            ]},`,
        `            { key: 'heal', label: '❤️ Cura', items: [`,
        `              { id: 'potions',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',       label: 'Poção',  src: 'items' },`,
        `              { id: 'super_potion', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png', label: 'Super',  src: 'items' },`,
        `              { id: 'revive',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',       label: 'Reviver',src: 'items' },`,
        `            ]},`,
        `            { key: 'food', label: '🍼 Aliment.', items: [`,
        `              { id: 'moomoo_milk',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png',  label: 'MooMoo', src: 'items' },`,
        `              { id: 'lemonade',         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',     label: 'Limo.',  src: 'items' },`,
        `              { id: 'soda_pop',         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',     label: 'Soda',   src: 'items' },`,
        `              { id: 'fresh_water',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',  label: 'Água',   src: 'items' },`,
        `              { id: 'oran_berry',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',   label: 'Oran',   src: 'materials' },`,
        `              { id: 'sitrus_berry',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png', label: 'Sitrus', src: 'materials' },`,
        `            ]},`,
        `            { key: 'buff', label: '⚡ Buffs', items: [`,
        `              { id: 'x_attack',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png', label: 'X-Atk', src: 'items' },`,
        `              { id: 'x_defense', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-defend.png', label: 'X-Def', src: 'items' },`,
        `              { id: 'x_speed',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-speed.png',  label: 'X-Spd', src: 'items' },`,
        `              { id: 'dire_hit',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dire-hit.png', label: 'Crítico',src: 'items' },`,
        `            ]},`,
        `          ].map(cat => {`,
        `            const total = cat.items.reduce((acc, item) => acc + ((gameState.inventory?.[item.src] || {})[item.id] || 0), 0);`,
        `            return (`,
        `              <button key={cat.key} onClick={() => setItemCategory(cat.key)}`,
        `                className={\`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border-2 transition-all \${itemCategory === cat.key ? 'border-pokeBlue bg-blue-50 text-pokeBlue' : 'border-slate-100 bg-slate-50 text-slate-400'}\`}>`,
        `                <span className="text-[9px] font-black uppercase">{cat.label}</span>`,
        `                {total > 0 && <span className="text-[8px] font-black bg-pokeBlue text-white rounded-full px-1.5">{total}</span>}`,
        `              </button>`,
        `            );`,
        `          })}`,
        `        </div>`,
        `        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">`,
        `          {[`,
        `            { key: 'capture', items: [`,
        `              { id: 'pokeballs',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',  label: 'Pokébola', src: 'items' },`,
        `              { id: 'great_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', label: 'Great',    src: 'items' },`,
        `              { id: 'ultra_ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', label: 'Ultra',    src: 'items' },`,
        `            ]},`,
        `            { key: 'heal', items: [`,
        `              { id: 'potions',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',       label: 'Poção',  src: 'items' },`,
        `              { id: 'super_potion', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png', label: 'Super',  src: 'items' },`,
        `              { id: 'revive',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',       label: 'Reviver',src: 'items' },`,
        `            ]},`,
        `            { key: 'food', items: [`,
        `              { id: 'moomoo_milk',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png',  label: 'MooMoo', src: 'items' },`,
        `              { id: 'lemonade',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',     label: 'Limo.',  src: 'items' },`,
        `              { id: 'soda_pop',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',     label: 'Soda',   src: 'items' },`,
        `              { id: 'fresh_water',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',  label: 'Água',   src: 'items' },`,
        `              { id: 'oran_berry',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',   label: 'Oran',   src: 'materials' },`,
        `              { id: 'sitrus_berry', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png', label: 'Sitrus', src: 'materials' },`,
        `            ]},`,
        `            { key: 'buff', items: [`,
        `              { id: 'x_attack',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png', label: 'X-Atk', src: 'items' },`,
        `              { id: 'x_defense', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-defend.png', label: 'X-Def', src: 'items' },`,
        `              { id: 'x_speed',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-speed.png',  label: 'X-Spd', src: 'items' },`,
        `              { id: 'dire_hit',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dire-hit.png', label: 'Crítico',src: 'items' },`,
        `            ]},`,
        `          ].find(c => c.key === itemCategory)?.items.map(item => {`,
        `            const qty = (gameState.inventory?.[item.src] || {})[item.id] || 0;`,
        `            return (`,
        `              <button key={item.id} disabled={qty <= 0} onClick={() => onUseItem && onUseItem(item.id, item.src)}`,
        `                className={\`flex flex-col items-center gap-1 flex-1 min-w-[64px] py-2 rounded-xl border-2 transition-all active:scale-95 \${qty <= 0 ? 'opacity-30 grayscale border-slate-100 bg-slate-50' : 'border-slate-200 bg-white hover:border-pokeBlue hover:bg-blue-50'}\`}>`,
        `                <img src={item.img} alt={item.label} className="w-9 h-9 object-contain drop-shadow-sm" />`,
        `                <span className="text-[11px] font-black text-slate-700">{qty}</span>`,
        `                <span className="text-[8px] font-bold text-slate-400 uppercase">{item.label}</span>`,
        `              </button>`,
        `            );`,
        `          })}`,
        `        </div>`,
        `      </div>`,
        ``
    ];
    lines.splice(sectionStart, sectionEnd - sectionStart, ...newJSX);
}

// PASSO 3: Remove redundant top-level array
const finalLines = lines.filter((l, i) => {
    // Check if within the itemCategories array (lines 21-71 approx)
    if (l.includes('const itemCategories = [')) {
        this.inArray = true;
        return false;
    }
    if (this.inArray && l.includes('];')) {
        this.inArray = false;
        return false;
    }
    return !this.inArray;
});

fs.writeFileSync('src/components/BattleScreen.jsx', finalLines.join('\n'));
console.log('Success');

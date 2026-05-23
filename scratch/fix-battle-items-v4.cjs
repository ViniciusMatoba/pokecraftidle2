const fs = require('fs');
let lines = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8').split(/\r?\n/);

// 1. Add state
const stateLine = lines.findIndex(l => l.includes('const [shinyFlash'));
lines.splice(stateLine + 1, 0, `  const [itemCategory, setItemCategory] = useState(null);`);

// 2. Define itemCategories before return
const returnIdx = lines.findIndex(l => l.trim() === 'return (');
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
lines.splice(returnIdx, 0, ...categoriesDef);

// 3. Remove renderItemBtn (it was at lines 50-78 but shifted down by inserting state)
// Let's find it by content
const helperStart = lines.findIndex(l => l.includes('const renderItemBtn ='));
if (helperStart !== -1) {
    const helperEnd = lines.findIndex((l, i) => i > helperStart && l.includes('};'));
    lines.splice(helperStart, (helperEnd - helperStart) + 1);
}

// 4. Replace items section
const sectionStart = lines.findIndex(l => l.includes("<div style={{padding: '8px 12px 4px 12px', display:'flex', flexDirection:'column', gap:'8px'}}>"));
const sectionEnd = lines.findIndex((l, i) => i > sectionStart && l.includes('</div>') && lines[i+1]?.includes('{/* Categoria 2'));
// Actually, let's find the closing div for the whole section.
// The categorised section ended with 3 levels of divs?
// Let's find the one before "GOLPES"
const golpesIdx = lines.findIndex(l => l.includes('{/*    GOLPES    */}'));
const itemsSectionEndIdx = golpesIdx - 1;

const newItemsJSX = [
    `      <div style={{padding:'8px 12px', display:'flex', gap:'8px'}}>`,
    `        {itemCategories.map(cat => {`,
    `          const totalQty = cat.items.reduce((s, item) => {`,
    `            const bag = item.src === 'materials' ? gameState.inventory?.materials : gameState.inventory?.items;`,
    `            return s + (bag?.[item.key] || 0);`,
    `          }, 0);`,
    `          return (`,
    `            <button`,
    `              key={cat.id}`,
    `              onClick={() => setItemCategory(itemCategory === cat.id ? null : cat.id)}`,
    `              style={{`,
    `                flex: 1, display:'flex', flexDirection:'column', alignItems:'center',`,
    `                padding:'8px 4px', borderRadius:'14px',`,
    `                background: itemCategory === cat.id ? '#eff6ff' : '#f8fafc',`,
    `                border: \`2px solid \${itemCategory === cat.id ? '#2563eb' : '#e2e8f0'}\`,`,
    `                cursor:'pointer', position:'relative',`,
    `              }}`,
    `            >`,
    `              <img src={cat.img} style={{width:'28px', height:'28px', objectFit:'contain'}}`,
    `                alt={cat.label} onError={e => { e.target.style.display='none'; }} />`,
    `              <span style={{fontSize:'8px', fontWeight:900, color:'#64748b', textTransform:'uppercase', marginTop:'3px'}}>`,
    `                {cat.label}`,
    `              </span>`,
    `              {totalQty > 0 && (`,
    `                <span style={{`,
    `                  position:'absolute', top:'-4px', right:'-4px',`,
    `                  background:'#2563eb', color:'white',`,
    `                  fontSize:'8px', fontWeight:900,`,
    `                  borderRadius:'999px', padding:'1px 5px',`,
    `                  minWidth:'16px', textAlign:'center',`,
    `                }}>`,
    `                  {totalQty}`,
    `                </span>`,
    `              )}`,
    `            </button>`,
    `          );`,
    `        })}`,
    `      </div>`,
    ``,
    `      {/* Modal de itens da categoria selecionada */}`,
    `      {itemCategory && (`,
    `        <div style={{`,
    `          margin:'0 12px 8px 12px', padding:'10px 12px',`,
    `          background:'#f8fafc', borderRadius:'16px',`,
    `          border:'1px solid #e2e8f0',`,
    `        }}>`,
    `          <div className="custom-scrollbar" style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px'}}>`,
    `            {itemCategories.find(c => c.id === itemCategory)?.items.map(item => {`,
    `              const bag = item.src === 'materials' ? gameState.inventory?.materials : gameState.inventory?.items;`,
    `              const qty = bag?.[item.key] || 0;`,
    `              return (`,
    `                <button`,
    `                  key={item.key}`,
    `                  onClick={() => qty > 0 && onUseItem && onUseItem(item.key, item.src)}`,
    `                  style={{`,
    `                    display:'flex', flexDirection:'column', alignItems:'center',`,
    `                    minWidth:'52px', padding:'6px 4px', borderRadius:'10px',`,
    `                    background: qty > 0 ? 'white' : '#f1f5f9',`,
    `                    border:\`1px solid \${qty > 0 ? '#e2e8f0' : '#f1f5f9'}\`,`,
    `                    opacity: qty > 0 ? 1 : 0.5,`,
    `                    cursor: qty > 0 ? 'pointer' : 'default',`,
    `                    flexShrink: 0,`,
    `                  }}`,
    `                >`,
    `                  <img src={item.img} style={{width:'28px', height:'28px', objectFit:'contain'}}`,
    `                    alt={item.label} onError={e => { e.target.style.display='none'; }} />`,
    `                  <span style={{fontSize:'8px', fontWeight:700, color:'#64748b', marginTop:'2px'}}>`,
    `                    {item.label}`,
    `                  </span>`,
    `                  <span style={{fontSize:'11px', fontWeight:900, color: qty > 0 ? '#1e293b' : '#cbd5e1'}}>`,
    `                    {qty}`,
    `                  </span>`,
    `                </button>`,
    `              );`,
    `            })}`,
    `          </div>`,
    `        </div>`,
    `      )}`
];

lines.splice(sectionStart, (itemsSectionEndIdx - sectionStart), ...newItemsJSX);

fs.writeFileSync('src/components/BattleScreen.jsx', lines.join('\n'));
console.log('Success');

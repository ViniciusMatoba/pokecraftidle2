const fs = require('fs');
let lines = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8').split(/\r?\n/);

// 1. Update itemCategory state
const stateIdx = lines.findIndex(l => l.includes('const [itemCategory'));
if (stateIdx !== -1) {
    lines[stateIdx] = `  const [itemCategory, setItemCategory] = useState('capture');`;
}

// 2. Update itemCategories array
const categoriesStart = lines.findIndex(l => l.includes('const itemCategories = ['));
if (categoriesStart !== -1) {
    const categoriesEnd = lines.findIndex((l, i) => i > categoriesStart && l.includes('];'));
    const newCategories = [
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
        `        { key:'hyper_potion', label:'Hyper',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png', src:'items' },`,
        `        { key:'revive',       label:'Reviver', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',       src:'items' },`,
        `      ],`,
        `    },`,
        `    {`,
        `      id: 'food',`,
        `      label: 'Alimentação',`,
        `      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',`,
        `      items: [`,
        `        { key:'moomoo_milk',  label:'Leite',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png',  src:'food' },`,
        `        { key:'lemonade',     label:'Limo.',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',     src:'food' },`,
        `        { key:'soda_pop',     label:'Soda',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',     src:'food' },`,
        `        { key:'berry_juice',  label:'Suco',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berry-juice.png',  src:'food' },`,
        `        { key:'fresh_water',  label:'Água',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',  src:'food' },`,
        `        { key:'poke_food_premium', label:'Ração+', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-revive.png', src:'food' },`,
        `        { key:'poke_food',    label:'Ração',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure.png',         src:'food' },`,
        `        { key:'oran_berry',   label:'Oran',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',   src:'berries' },`,
        `        { key:'sitrus_berry', label:'Sitrus', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png', src:'berries' },`,
        `        { key:'lum_berry',    label:'Lum',    img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lum-berry.png',    src:'berries' },`,
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
        `        { key:'dire_hit',  label:'Dire Hit',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dire-hit.png',   src:'items' },`,
        `      ],`,
        `    },`,
        `  ];`
    ];
    lines.splice(categoriesStart, (categoriesEnd - categoriesStart) + 1, ...newCategories);
}

// 3. Update renderItemBtn to handle new sources
const renderItemBtnStart = lines.findIndex(l => l.includes('const renderItemBtn ='));
if (renderItemBtnStart !== -1) {
    const renderItemBtnEnd = lines.findIndex((l, i) => i > renderItemBtnStart && l.includes('};'));
    const newRenderItemBtn = [
        `  const renderItemBtn = (item, src) => {`,
        `    const bagKey = (src === 'materials' || src === 'berries') ? 'materials' : 'items';`,
        `    const bag = gameState.inventory?.[bagKey];`,
        `    const qty = bag?.[item.key] || 0;`,
        `    return (`,
        `      <button`,
        `        key={item.key}`,
        `        onClick={() => qty > 0 && onUseItem && onUseItem(item.key, src)}`,
        `        style={{`,
        `          display:'flex', flexDirection:'column', alignItems:'center',`,
        `          minWidth:'52px', padding:'6px 4px', borderRadius:'10px',`,
        `          background: qty > 0 ? 'white' : '#f1f5f9',`,
        `          border:\`1px solid \${qty > 0 ? '#e2e8f0' : '#f1f5f9'}\`,`,
        `          opacity: qty > 0 ? 1 : 0.5,`,
        `          cursor: qty > 0 ? 'pointer' : 'default',`,
        `          flexShrink: 0,`,
        `        }}`,
        `      >`,
        `        <img src={item.img} style={{width:'28px', height:'28px', objectFit:'contain'}}`,
        `          alt={item.label} onError={e => { e.target.style.display='none'; }} />`,
        `        <span style={{fontSize:'8px', fontWeight:700, color:'#64748b', marginTop:'2px'}}>`,
        `          {item.label}`,
        `        </span>`,
        `        <span style={{fontSize:'11px', fontWeight:900, color: qty > 0 ? '#1e293b' : '#cbd5e1'}}>`,
        `          {qty}`,
        `        </span>`,
        `      </button>`,
        `    );`,
        `  };`
    ];
    lines.splice(renderItemBtnStart, (renderItemBtnEnd - renderItemBtnStart) + 1, ...newRenderItemBtn);
}

// 4. Replace the whole items block in JSX
const sectionStart = lines.findIndex(l => l.includes("<div style={{padding:'8px 12px', display:'flex', gap:'8px'}}>"));
const golpesIdx = lines.findIndex(l => l.includes('{/*    GOLPES    */}'));
const sectionEnd = golpesIdx;

const newItemsJSX = [
    `      <div style={{padding:'8px 12px', display:'flex', flexDirection:'column', gap:'10px'}}>`,
    `        {/* Abas de Categorias */}`,
    `        <div style={{display:'flex', gap:'8px'}}>`,
    `          {itemCategories.map(cat => {`,
    `            const totalQty = cat.items.reduce((s, item) => {`,
    `              const bagKey = (item.src === 'materials' || item.src === 'berries') ? 'materials' : 'items';`,
    `              return s + (gameState.inventory?.[bagKey]?.[item.key] || 0);`,
    `            }, 0);`,
    `            return (`,
    `              <button`,
    `                key={cat.id}`,
    `                onClick={() => setItemCategory(cat.id)}`,
    `                style={{`,
    `                  flex: 1, display:'flex', flexDirection:'column', alignItems:'center',`,
    `                  padding:'8px 4px', borderRadius:'14px',`,
    `                  background: itemCategory === cat.id ? '#eff6ff' : '#f8fafc',`,
    `                  border: \`2px solid \${itemCategory === cat.id ? '#2563eb' : '#e2e8f0'}\`,`,
    `                  cursor:'pointer', position:'relative',`,
    `                }}`,
    `              >`,
    `                <img src={cat.img} style={{width:'24px', height:'24px', objectFit:'contain'}}`,
    `                  alt={cat.label} onError={e => { e.target.style.display='none'; }} />`,
    `                <span style={{fontSize:'8px', fontWeight:900, color:'#64748b', textTransform:'uppercase', marginTop:'3px'}}>`,
    `                  {cat.label}`,
    `                </span>`,
    `                {totalQty > 0 && (`,
    `                  <span style={{`,
    `                    position:'absolute', top:'-4px', right:'-4px',`,
    `                    background:'#2563eb', color:'white',`,
    `                    fontSize:'8px', fontWeight:900,`,
    `                    borderRadius:'999px', padding:'1px 5px',`,
    `                    minWidth:'16px', textAlign:'center',`,
    `                  }}>`,
    `                    {totalQty}`,
    `                  </span>`,
    `                )}`,
    `              </button>`,
    `            );`,
    `          })}`,
    `        </div>`,
    ``,
    `        {/* Itens da Categoria Selecionada */}`,
    `        <div style={{`,
    `          padding:'10px 12px',`,
    `          background:'#f8fafc', borderRadius:'16px',`,
    `          border:'1px solid #e2e8f0',`,
    `        }}>`,
    `          <div className="custom-scrollbar" style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px'}}>`,
    `            {itemCategories.find(c => c.id === itemCategory)?.items.map(item => renderItemBtn(item, item.src))}`,
    `          </div>`,
    `        </div>`,
    `      </div>`
];

lines.splice(sectionStart, (sectionEnd - sectionStart), ...newItemsJSX);

fs.writeFileSync('src/components/BattleScreen.jsx', lines.join('\n'));
console.log('Success');

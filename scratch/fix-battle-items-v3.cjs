const fs = require('fs');
let lines = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8').split(/\r?\n/);

// 1. Insert renderItemBtn
const helperFunc = [
    `  const renderItemBtn = (item, src) => {`,
    `    const qty = src === 'materials'`,
    `      ? (gameState.inventory?.materials?.[item.key] || 0)`,
    `      : (gameState.inventory?.items?.[item.key] || 0);`,
    `    return (`,
    `      <button`,
    `        key={item.key}`,
    `        onClick={() => qty > 0 && onUseItem && onUseItem(item.key, src)}`,
    `        style={{`,
    `          display: 'flex', flexDirection: 'column', alignItems: 'center',`,
    `          minWidth: '48px', padding: '6px 4px', borderRadius: '10px',`,
    `          background: qty > 0 ? '#f8fafc' : '#f1f5f9',`,
    `          border: \`1px solid \${qty > 0 ? '#e2e8f0' : '#f1f5f9'}\`,`,
    `          opacity: qty > 0 ? 1 : 0.4,`,
    `          cursor: qty > 0 ? 'pointer' : 'default',`,
    `          flexShrink: 0,`,
    `        }}`,
    `      >`,
    `        <img src={item.img} style={{width:'26px', height:'26px', objectFit:'contain'}}`,
    `          alt={item.label} onError={e => { e.target.style.display='none'; }} />`,
    `        <span style={{fontSize:'8px', fontWeight:700, color:'#64748b', marginTop:'2px'}}>`,
    `          {item.label}`,
    `        </span>`,
    `        <span style={{fontSize:'10px', fontWeight:900, color: qty > 0 ? '#1e293b' : '#cbd5e1'}}>`,
    `          {qty}`,
    `        </span>`,
    `      </button>`,
    `    );`,
    `  };`
];

const returnIdx = lines.findIndex(l => l.includes('return ('));
lines.splice(returnIdx, 0, ...helperFunc);

// 2. Replace items section
// Since we inserted lines, we need to find the new indices
const startMarker = `      <div style={{padding: '8px 12px 4px 12px'}}>`;
const endMarker = `          })}`;
const startIdx = lines.findIndex(l => l.includes(startMarker));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes(endMarker));

const categorisedItems = [
    `      <div style={{padding: '8px 12px 4px 12px', display:'flex', flexDirection:'column', gap:'8px'}}>`,
    ``,
    `        {/* Categoria 1 — Captura */}`,
    `        <div>`,
    `          <p style={{fontSize:'8px', fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>`,
    `            Captura`,
    `          </p>`,
    `          <div className="custom-scrollbar" style={{display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'4px'}}>`,
    `            {[`,
    `              { key:'pokeballs',  label:'Poké Bola', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },`,
    `              { key:'great_ball', label:'Great',     img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' },`,
    `              { key:'ultra_ball', label:'Ultra',     img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' },`,
    `            ].map(item => renderItemBtn(item, 'items'))}`,
    `          </div>`,
    `        </div>`,
    ``,
    `        {/* Categoria 2 — Cura */}`,
    `        <div>`,
    `          <p style={{fontSize:'8px', fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>`,
    `            Cura`,
    `          </p>`,
    `          <div className="custom-scrollbar" style={{display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'4px'}}>`,
    `            {[`,
    `              { key:'potions',      label:'Poção',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png' },`,
    `              { key:'super_potion', label:'Super',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png' },`,
    `              { key:'revive',       label:'Reviver', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png' },`,
    `            ].map(item => renderItemBtn(item, 'items'))}`,
    `          </div>`,
    `        </div>`,
    ``,
    `        {/* Categoria 3 — Alimentação */}`,
    `        <div>`,
    `          <p style={{fontSize:'8px', fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>`,
    `            Alimentação`,
    `          </p>`,
    `          <div className="custom-scrollbar" style={{display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'4px'}}>`,
    `            {[`,
    `              { key:'moomoo_milk',  label:'Leite',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png' },`,
    `              { key:'lemonade',     label:'Limo.',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png' },`,
    `              { key:'soda_pop',     label:'Soda',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png' },`,
    `              { key:'fresh_water',  label:'Água',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png' },`,
    `              { key:'berry_juice',  label:'Suco',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berry-juice.png' },`,
    `              { key:'oran_berry',   label:'Oran',   img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png', src:'materials' },`,
    `              { key:'sitrus_berry', label:'Sitrus', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png', src:'materials' },`,
    `              { key:'poke_food',    label:'Ração',  img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure.png' },`,
    `            ].map(item => renderItemBtn(item, item.src || 'items'))}`,
    `          </div>`,
    `        </div>`,
    ``,
    `      </div>`
];

// endMarker is the line containing "})}"
// We need to remove the closing divs as well if they were part of the previous replacement.
// In the previous Turn, it ended with:
//         </div>
//       </div>

lines.splice(startIdx, (endIdx - startIdx) + 3, ...categorisedItems);

fs.writeFileSync('src/components/BattleScreen.jsx', lines.join('\n'));
console.log('Success');

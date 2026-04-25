const fs = require('fs');
let lines = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8').split(/\r?\n/);

// 1. Remove redundant item sections (lines 396-445 approx)
// Let's find it by the "Categoria 1 — Captura" comment
const redundantStart = lines.findIndex(l => l.includes('{/* Categoria 1 — Captura */}'));
if (redundantStart !== -1) {
    // The section starts at the div before it
    let realStart = redundantStart;
    while (realStart > 0 && !lines[realStart].includes('<div style={{padding: \'8px 12px 4px 12px\'')) {
        realStart--;
    }
    // The section ends before { /* GOLPES */ }
    const golpesIdx = lines.findIndex(l => l.includes('{/*    GOLPES    */}'));
    lines.splice(realStart, golpesIdx - realStart);
}

// 2. Define renderItemBtn at the top (before return)
const renderItemBtnDef = [
    `  const renderItemBtn = (item, src) => {`,
    `    const bag = src === 'materials' ? gameState.inventory?.materials : gameState.inventory?.items;`,
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

const returnIdx = lines.findIndex(l => l.trim() === 'return (');
lines.splice(returnIdx, 0, ...renderItemBtnDef);

// 3. Update the modal JSX to use renderItemBtn
const modalMappingStart = lines.findIndex(l => l.includes('itemCategories.find(c => c.id === itemCategory)?.items.map(item => {'));
if (modalMappingStart !== -1) {
    const modalMappingEnd = lines.findIndex((l, i) => i > modalMappingStart && l.includes('})}'));
    lines.splice(modalMappingStart, (modalMappingEnd - modalMappingStart) + 1, 
        `            {itemCategories.find(c => c.id === itemCategory)?.items.map(item => renderItemBtn(item, item.src || 'items'))}`
    );
}

fs.writeFileSync('src/components/BattleScreen.jsx', lines.join('\n'));
console.log('Success');

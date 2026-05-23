const fs = require('fs');
let c = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

// Unify ITENS and ALIMENTAÇÃO sections
const itemsSectionRegex = /\{(\/\*)*\s*ITENS\s*(\*\/)*\}[\s\S]*?\{(\/\*)*\s*\s*ALIMENTA.*?\s*(\*\/)*\}[\s\S]*?(\s*<\/div>\s*){2,3}/;

const unifiedReplacement = `<div style={{padding: '8px 12px 4px 12px'}}>
  <p style={{fontSize:'9px', fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px'}}>
    ITENS
  </p>
  <div className="custom-scrollbar" style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'8px'}}>
    {[
      { key:'pokeballs',    label:'Poké Bola', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',    src:'items' },
      { key:'great_ball',   label:'Great Ball', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png',  src:'items' },
      { key:'ultra_ball',   label:'Ultra Ball', img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png',  src:'items' },
      { key:'potions',      label:'Poção',      img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png',      src:'items' },
      { key:'revive',       label:'Reviver',    img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png',      src:'items' },
      { key:'fresh_water',  label:'Água',       img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png', src:'items' },
      { key:'soda_pop',     label:'Soda',       img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',    src:'items' },
      { key:'lemonade',     label:'Limo.',      img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',    src:'items' },
      { key:'moomoo_milk',  label:'Leite',      img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png', src:'items' },
      { key:'oran_berry',   label:'Oran',       img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',  src:'materials' },
      { key:'sitrus_berry', label:'Sitrus',     img:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png',src:'materials' },
    ].map(item => {
      const qty = item.src === 'items'
        ? (gameState.inventory?.items?.[item.key] || 0)
        : (gameState.inventory?.materials?.[item.key] || 0);
      return (
        <button
          key={item.key}
          onClick={() => onUseItem && onUseItem(item.key, item.src)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '52px',
            padding: '6px 4px',
            borderRadius: '12px',
            background: qty > 0 ? '#f8fafc' : '#f1f5f9',
            border: '1px solid',
            borderColor: qty > 0 ? '#e2e8f0' : '#f1f5f9',
            opacity: qty > 0 ? 1 : 0.4,
            cursor: qty > 0 ? 'pointer' : 'not-allowed',
            flexShrink: 0
          }}
        >
          <img src={item.img} style={{width:'28px', height:'28px', objectFit:'contain'}}
            alt={item.label} onError={e => { e.target.style.display='none'; }} />
          <span style={{fontSize:'8px', fontWeight:700, color:'#64748b', marginTop:'2px'}}>
            {item.label}
          </span>
          <span style={{fontSize:'10px', fontWeight:900, color: qty > 0 ? '#1e293b' : '#94a3b8'}}>
            {qty}
          </span>
        </button>
      );
    })}
  </div>
</div>`;

// Note: I replaced onPointerDown with onClick for now because the snippet's long-press logic was broken (it return a cleanup function to an event handler).
// The user asked to "unificar... em uma linha horizontal". I'll keep the standard onClick for immediate use.

if (itemsSectionRegex.test(c)) {
    c = c.replace(itemsSectionRegex, unifiedReplacement);
    fs.writeFileSync('src/components/BattleScreen.jsx', c);
    console.log('Success');
} else {
    console.log('Regex failed');
}

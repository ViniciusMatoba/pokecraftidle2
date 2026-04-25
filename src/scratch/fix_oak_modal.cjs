const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'AppRoot.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const startTag = '{/* Modal do Prof. Carvalho sobre a Casa */}';
const startIdx = content.indexOf(startTag);

if (startIdx === -1) {
  console.error('Start tag not found!');
  process.exit(1);
}

// Find the end of the block. It ends with ')}' after a few nested divs.
// We know from view_file it ends around 60 lines later.
// We'll look for the next ')}' that is followed by '      case \'navigation_hub\':'.
// Wait, the view_file shows line 3601 is '          )}'.
// And the next line is 3602 (empty) then 3603 might be the end of 'city' view.

// Let's find the specific block structure.
const oldBlockStart = '{showOakHouseModal && (';
const oldBlockStartIdx = content.indexOf(oldBlockStart, startIdx);

// We'll look for the unique button text 'Comprar Casa!' to find the end.
const uniqueText = 'Comprar Casa!';
const uniqueIdx = content.indexOf(uniqueText, oldBlockStartIdx);

// Then the next ')}'
const endIdx = content.indexOf(')}', uniqueIdx) + 2;

const newBlock = `          {showOakHouseModal && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 9999,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '400px',
                maxHeight: '85vh',
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              }}>
          
                {/* Header âmbar */}
                <div style={{background:'#92400e', padding:'20px 20px 16px 20px', flexShrink:0}}>
                  <p style={{color:'rgba(255,255,255,0.7)', fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'2px', margin:'0 0 2px 0'}}>
                    Professor Carvalho
                  </p>
                  <h3 style={{color:'white', fontSize:'16px', fontWeight:900, fontStyle:'italic', margin:0}}>
                    "Sua jornada merece uma base!"
                  </h3>
                </div>
          
                {/* Conteúdo com scroll */}
                <div style={{flex:1, overflowY:'auto', padding:'16px 20px'}}>
          
                  {/* Sprite + texto */}
                  <div style={{display:'flex', gap:'12px', alignItems:'flex-start', marginBottom:'16px'}}>
                    <img
                      src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                      style={{width:'64px', height:'64px', objectFit:'contain', flexShrink:0}}
                      alt="Prof. Carvalho"
                    />
                    <p style={{fontSize:'13px', color:'#78350f', fontWeight:600, lineHeight:1.6, margin:0}}>
                      Parabéns por vencer o Ginásio de Pewter! Você está crescendo como treinador.
                      Que tal ter sua própria casa? Lá você pode cultivar Berries e Apricorns para
                      fabricar Pokébolas especiais e itens raros. Com Pokémon de Grama e Água como
                      cuidadores, suas plantações crescerão muito mais rápido!
                    </p>
                  </div>
          
                  {/* Card de custo */}
                  <div style={{
                    background:'#fffbeb', borderRadius:'16px',
                    padding:'14px 16px', marginBottom:'16px',
                    border:'1px solid #fde68a',
                  }}>
                    <p style={{fontSize:'12px', fontWeight:900, color:'#92400e', margin:'0 0 8px 0'}}>
                      🏠 Custo da Casa
                    </p>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontSize:'14px', fontWeight:900, color:'#92400e'}}>
                        💰 {(HOUSE_PURCHASE_COST || 5000).toLocaleString()} coins
                      </span>
                      <span style={{fontSize:'10px', fontWeight:700, color:'#b45309'}}>
                        4 canteiros iniciais
                      </span>
                    </div>
                    <div style={{
                      marginTop:'10px', padding:'8px 12px',
                      borderRadius:'10px', textAlign:'center',
                      background: (gameState.currency || 0) >= HOUSE_PURCHASE_COST ? '#dcfce7' : '#fee2e2',
                      color: (gameState.currency || 0) >= HOUSE_PURCHASE_COST ? '#166534' : '#991b1b',
                      fontSize:'11px', fontWeight:900, textTransform:'uppercase',
                    }}>\n                      {(gameState.currency || 0) >= HOUSE_PURCHASE_COST\n                        ? '✅ Você tem coins suficientes!'\n                        : \`❌ Falta \${((HOUSE_PURCHASE_COST || 5000) - (gameState.currency || 0)).toLocaleString()} coins\`\n                      }\n                    </div>\n                  </div>\n                </div>\n          \n                {/* Footer — botões */}\n                <div style={{padding:'12px 20px 24px 20px', borderTop:'1px solid #f1f5f9', display:'flex', gap:'10px', flexShrink:0}}>\n                  <button\n                    onClick={() => setShowOakHouseModal(false)}\n                    style={{\n                      flex:1, padding:'16px', borderRadius:'16px',\n                      background:'#f1f5f9', color:'#475569',\n                      fontWeight:900, fontSize:'14px',\n                      textTransform:'uppercase', border:'none', cursor:'pointer',\n                    }}\n                  >\n                    Depois\n                  </button>\n                  <button\n                    onClick={handleBuyHouse}\n                    disabled={(gameState.currency || 0) < HOUSE_PURCHASE_COST}\n                    style={{\n                      flex:2, padding:'16px', borderRadius:'16px',\n                      background: (gameState.currency || 0) >= HOUSE_PURCHASE_COST ? '#d97706' : '#e2e8f0',\n                      color: (gameState.currency || 0) >= HOUSE_PURCHASE_COST ? 'white' : '#94a3b8',\n                      fontWeight:900, fontSize:'14px',\n                      textTransform:'uppercase', border:'none',\n                      cursor: (gameState.currency || 0) >= HOUSE_PURCHASE_COST ? 'pointer' : 'not-allowed',\n                      boxShadow: (gameState.currency || 0) >= HOUSE_PURCHASE_COST ? '0 4px 12px rgba(217,119,6,0.3)' : 'none',\n                    }}\n                  >\n                    🏠 Comprar Casa!\n                  </button>\n                </div>\n              </div>\n            </div>\n          )}`;

const newContent = content.substring(0, oldBlockStartIdx) + newBlock + content.substring(endIdx);

fs.writeFileSync(filePath, newContent);
console.log('Successfully updated AppRoot.jsx');

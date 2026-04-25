const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

// Regex for the header block
const headerRegex = /<header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-red-600 shadow-lg max-w-md mx-auto">[\s\S]*?<\/header>/;

const newHeader = `          <header style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            minHeight: '56px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {/* Esquerda — Logo */}
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                style={{width:'28px', height:'28px', objectFit:'contain'}}
                alt=""
              />
              <div style={{lineHeight:1}}>
                <div style={{color:'white', fontWeight:900, fontSize:'14px', textTransform:'uppercase', letterSpacing:'1px'}}>
                  POKÉCRAFT
                </div>
                <div style={{color:'#fde047', fontWeight:900, fontSize:'10px', textTransform:'uppercase', letterSpacing:'2px'}}>
                  IDLE
                </div>
              </div>
            </div>

            {/* Centro — moeda e período SOMENTE em batalhas/lojas */}
            {(isInRoute || isInShop) && (
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <span style={{color:'#fde047', fontWeight:900, fontSize:'12px'}}>
                  💰 {(gameState.currency || 0).toLocaleString()}
                </span>
                <span style={{color:'rgba(255,255,255,0.7)', fontSize:'10px', fontWeight:700}}>
                  {TIME_CONFIG[timeOfDay]?.emoji} {TIME_CONFIG[timeOfDay]?.label}
                </span>
              </div>
            )}

            {/* Direita — botões SOMENTE in-game */}
            {isInGame && (
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <button
                  onClick={() => toggleMute()}
                  style={{background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'12px', padding:'6px', cursor:'pointer', color:'white', fontSize:'16px'}}
                >
                  {muted ? '🔇' : '🎵'}
                </button>
                <button
                  onClick={() => showConfirm({
                    type:'confirm',
                    title:'Voltar ao início?',
                    message:'Seu progresso foi salvo.',
                    confirmLabel:'Voltar',
                    cancelLabel:'Continuar',
                    onConfirm:() => { closeConfirm(); setCurrentView('landing'); },
                    onCancel: closeConfirm,
                  })}
                  style={{background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'12px', padding:'6px', cursor:'pointer', color:'white', fontSize:'16px'}}
                >
                  🏠
                </button>
              </div>
            )}
          </header>`;

if (headerRegex.test(c)) {
  c = c.replace(headerRegex, newHeader.trim());
  fs.writeFileSync('src/AppRoot.jsx', c);
  console.log('Header atualizado com sucesso via Regex');
} else {
  console.log('Header não encontrado via Regex');
}

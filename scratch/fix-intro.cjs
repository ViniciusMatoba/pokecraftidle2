const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const startTag = '{/* Diálogo box'; // Unique enough start
const endTag = '</div>\n            </div>\n          </div>\n        );\n      }'; // End of the case block

// Find the block in case 'intro'
const introCaseStart = c.indexOf("case 'intro': {");
if (introCaseStart === -1) {
    console.log('Case intro not found');
    process.exit(1);
}

const dialogueBoxStart = c.indexOf('<div className="relative z-10 w-full max-w-xl mb-4">', introCaseStart);
const dialogueBoxEnd = c.indexOf('</div>\n            </div>\n          </div>', dialogueBoxStart) + '</div>\n            </div>'.length;

// Actually, I'll use a more precise regex to find the dialogue box div inside case 'intro'
const regex = /<div className="relative z-10 w-full max-w-xl mb-4">[\s\S]*?<\/div>\s*<\/div>/;

const newDialogueBox = `            {/* Balão de diálogo — Estilo refinado */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 12px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            }}>
              {/* NPC info */}
              <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
                <img
                  src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                  style={{width:'32px', height:'32px', objectFit:'contain'}}
                  alt="Prof. Carvalho"
                />
                <span style={{fontSize:'11px', fontWeight:900, color:'#64748b', textTransform:'uppercase', letterSpacing:'1px'}}>
                  Prof. Carvalho
                </span>
              </div>

              {/* Texto */}
              <p style={{fontSize:'15px', fontWeight:700, color:'#1e293b', lineHeight:'1.5', marginBottom:'16px'}}>
                {dialogues[introStep]}
              </p>

              {isLastStep && (
                <div style={{marginBottom: '16px'}}>
                  <input 
                    type="text" 
                    placeholder="SEU NOME..." 
                    value={gameState.trainer?.name || ''} 
                    onChange={(e) => setGameState(prev => ({ ...prev, trainer: { ...prev.trainer, name: e.target.value.toUpperCase() } }))}
                    style={{width:'100%', background:'#f1f5f9', border:'none', padding:'16px', borderRadius:'16px', textAlign:'center', fontWeight:900, fontSize:'16px', textTransform:'uppercase', letterSpacing:'2px', outline:'none'}}
                    autoFocus
                  />
                </div>
              )}

              {/* Botão PRÓXIMO */}
              <button
                onClick={() => {
                  if (isLastStep) {
                    if (!gameState.trainer?.name || gameState.trainer.name.length < 2) {
                      showConfirm({
                        title: 'Nome Inválido',
                        message: 'Diga-me seu nome para continuarmos!',
                        onConfirm: closeConfirm
                      });
                      return;
                    }
                    setCurrentView('trainer_creation');
                  } else {
                    setIntroStep(s => s + 1);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#1d4ed8',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(29,78,216,0.4)',
                }}
              >
                {isLastStep ? 'Tudo Pronto!' : 'PRÓXIMO ▶'}
              </button>
            </div>`;

if (regex.test(c)) {
    c = c.replace(regex, newDialogueBox);
    fs.writeFileSync('src/AppRoot.jsx', c);
    console.log('Intro dialogue box updated successfully');
} else {
    console.log('Regex match failed');
}

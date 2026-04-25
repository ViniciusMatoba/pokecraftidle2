const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

// 1. Intro (Prof. Carvalho)
const oldIntro = `            {/* ⛔ PROTECTED: Balão de Diálogo Intro — NÃO ALTERAR SEM AUTORIZAÇÃO */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '16px 20px 20px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 10,
            }}>
              {/* NPC */}
              <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px'}}>
                <img
                  src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                  style={{width:'28px', height:'28px', objectFit:'contain'}}
                  alt="Prof. Carvalho"
                />
                <span style={{fontSize:'10px', fontWeight:900, color:'#64748b', textTransform:'uppercase', letterSpacing:'1px'}}>
                  Prof. Carvalho
                </span>
              </div>

              {/* Texto do diálogo */}
              <p style={{
                fontSize:'15px', fontWeight:700, color:'#1e293b',
                lineHeight:'1.5', marginBottom:'14px', minHeight:'48px', textAlign: 'left'
              }}>
                {introTexts[introStep]}
              </p>

              {isLastStep && (
                <div style={{marginBottom: '16px'}} className="animate-bounceIn">
                  <input 
                    type="text" 
                    placeholder="SEU NOME..." 
                    value={gameState.trainer?.name || ''} 
                    onChange={(e) => setGameState(prev => ({ ...prev, trainer: { ...prev.trainer, name: e.target.value.toUpperCase() } }))}
                    style={{
                      width: '100%', padding: '16px', borderRadius: '16px',
                      border: '2px solid #e2e8f0', background: '#f8fafc',
                      textAlign: 'center', fontWeight: 900, fontSize: '16px',
                      textTransform: 'uppercase', outline: 'none'
                    }}
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
                  marginTop: '12px',
                  boxShadow: '0 4px 12px rgba(29,78,216,0.4)',
                }}
              >
                {isLastStep ? 'Tudo Pronto!' : 'PRÓXIMO ▶'}
              </button>
            </div>`;

const newIntro = `            {/* ⛔ PROTECTED: Balão de Diálogo Intro — Padrão Oficial 1.9.6 */}
            <div style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 36px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 50,
            }} className="animate-slideUp">
              <p style={{
                fontSize: '11px', fontWeight: 900,
                color: '#16a34a',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
              }}>Prof. Carvalho:</p>
              <p style={{
                fontSize: '14px', fontWeight: 700,
                color: '#1e293b', lineHeight: '1.5', marginBottom: '16px',
              }}>{introTexts[introStep]}</p>
              
              {isLastStep && (
                <div style={{marginBottom: '16px'}} className="animate-bounceIn">
                  <input 
                    type="text" 
                    placeholder="SEU NOME..." 
                    value={gameState.trainer?.name || ''} 
                    onChange={(e) => setGameState(prev => ({ ...prev, trainer: { ...prev.trainer, name: e.target.value.toUpperCase() } }))}
                    style={{
                      width: '100%', padding: '16px', borderRadius: '16px',
                      border: '2px solid #e2e8f0', background: '#f8fafc',
                      textAlign: 'center', fontWeight: 900, fontSize: '16px',
                      textTransform: 'uppercase', outline: 'none'
                    }}
                    autoFocus
                  />
                </div>
              )}

              <button onClick={() => {
                if (isLastStep) {
                  if (!gameState.trainer?.name || gameState.trainer.name.length < 2) {
                    showConfirm({ title: 'Nome Inválido', message: 'Diga-me seu nome para continuarmos!', onConfirm: closeConfirm });
                    return;
                  }
                  setCurrentView('trainer_creation');
                } else {
                  setIntroStep(s => s + 1);
                }
              }} style={{
                width: '100%', padding: '18px',
                borderRadius: '16px',
                background: '#16a34a',
                color: 'white', fontWeight: 900,
                fontSize: '16px', textTransform: 'uppercase',
                letterSpacing: '2px', border: 'none', cursor: 'pointer',
                minHeight: '64px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>{isLastStep ? 'Tudo Pronto!' : 'PRÓXIMO ▶'}</button>
            </div>`;

// 2. Rival Intro
const oldRivalIntro = `            {/* Balão na parte inferior */}
            <div style={{
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'white',
  borderRadius: '24px 24px 0 0',
  padding: '16px 20px 80px 20px',
  boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
  zIndex: 10,
}}>
  {/* Label do rival */}
  <p style={{
    fontSize: '11px',
    fontWeight: 900,
    color: '#dc2626',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  }}>
    RIVAL — AZUL:
  </p>

  {/* Texto do diálogo */}
  <p style={{
    fontSize: '14px',
    fontWeight: 700,
    color: '#1e293b',
    lineHeight: '1.5',
    marginBottom: '14px',
  }}>
    "Ei, espere aí! Eu também quero um POKÉMON! E eu vou escolher este aqui! Vejamos quem é o melhor treinador!"
  </p>

  {/* Botão BATALHAR */}
  <button
    onClick={startBattleAgainstRival}
    style={{
      width: '100%',
      padding: '16px',
      borderRadius: '16px',
      background: '#dc2626',
      color: 'white',
      fontWeight: 900,
      fontSize: '16px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(220,38,38,0.4)',
    }}
  >
    BATALHAR!
  </button>
</div>`;

const newRivalIntro = `            {/* Balão na parte inferior — Padrão Oficial 1.9.6 */}
            <div style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 36px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 50,
            }} className="animate-slideUp">
              <p style={{
                fontSize: '11px', fontWeight: 900,
                color: '#dc2626',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
              }}>RIVAL — AZUL:</p>
              <p style={{
                fontSize: '14px', fontWeight: 700,
                color: '#1e293b', lineHeight: '1.5', marginBottom: '16px',
              }}>"Ei, espere aí! Eu também quero um POKÉMON! E eu vou escolher este aqui! Vejamos quem é o melhor treinador!"</p>
              <button onClick={startBattleAgainstRival} style={{
                width: '100%', padding: '18px',
                borderRadius: '16px',
                background: '#dc2626',
                color: 'white', fontWeight: 900,
                fontSize: '16px', textTransform: 'uppercase',
                letterSpacing: '2px', border: 'none', cursor: 'pointer',
                minHeight: '64px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>BATALHAR!</button>
            </div>`;

// 3. Rival Post Battle (Already approved but updating to NEW template spacing/fixed)
const oldRivalPost = `            {/* Balão na parte inferior */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '16px 20px 80px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 10,
            }} className="animate-slideUp">
              <p style={{
                fontSize: '11px',
                fontWeight: 900,
                color: '#dc2626',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}>
                Rival — Azul:
              </p>
              <p style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#1e293b',
                lineHeight: '1.5',
                marginBottom: '14px',
              }}>
                "Beleza... Vou fazer meu Pokémon lutar para deixá-lo mais forte. Da próxima vez não vou perder!"
              </p>
              <button
                onClick={() => setCurrentView('city')}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#dc2626',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220,38,38,0.4)',
                }}
              >
                CONTINUAR →
              </button>
            </div>`;

const newRivalPost = `            {/* Balão na parte inferior — Padrão Oficial 1.9.6 */}
            <div style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 36px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 50,
            }} className="animate-slideUp">
              <p style={{
                fontSize: '11px', fontWeight: 900,
                color: '#dc2626',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
              }}>Rival — Azul:</p>
              <p style={{
                fontSize: '14px', fontWeight: 700,
                color: '#1e293b', lineHeight: '1.5', marginBottom: '16px',
              }}>"Beleza... Vou fazer meu Pokémon lutar para deixá-lo mais forte. Da próxima vez não vou perder!"</p>
              <button onClick={() => setCurrentView('city')} style={{
                width: '100%', padding: '18px',
                borderRadius: '16px',
                background: '#dc2626',
                color: 'white', fontWeight: 900,
                fontSize: '16px', textTransform: 'uppercase',
                letterSpacing: '2px', border: 'none', cursor: 'pointer',
                minHeight: '64px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>CONTINUAR →</button>
            </div>`;

// 4. Quest Oak
const oldQuestOak = `          {/* Balao na parte inferior */}
          <div className="w-full relative z-10 p-4">
            <div className="bg-white p-5 rounded-[2rem] shadow-2xl border-b-[10px] border-slate-800 w-full">
              <h3 className="text-lg font-black text-slate-800 italic uppercase mb-2 tracking-tighter">Prof. Carvalho:</h3>
              <p className="text-sm font-bold text-slate-600 mb-2 italic">"Que batalha incrível! Vocês dois têm muito talento."</p>
              <p className="text-sm font-black text-pokeBlue mb-4 uppercase tracking-tighter leading-tight">
                "Agora, preciso que você aprenda a capturar POKÉMONS. Vá até a ROTA 1 e capture seu primeiro parceiro!"
              </p>
              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 mb-4">
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Nova Missao:</p>
                 <p className="text-xs font-bold text-slate-800 uppercase mt-1 italic">Capture 1 Pokémon na Rota 1</p>
                 <p className="text-[9px] font-black text-slate-400 mt-1 uppercase">Recompensa: 10 Pokébolas</p>
              </div>
              <button
                onClick={() => {
                  setGameState(prev => ({ ...prev, inventory: { ...prev.inventory, items: { ...prev.inventory.items, pokeballs: (prev.inventory.items.pokeballs || 0) + 10 } }, worldFlags: [...(prev.worldFlags || []), "quest_capture_active"] })); setCurrentView("navigation_hub");
                }}
                className="w-full bg-pokeBlue text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
              >Entendido!</button>
            </div>
          </div>`;

const newQuestOak = `          {/* Balão na parte inferior — Padrão Oficial 1.9.6 */}
          <div style={{
            position: 'fixed',
            bottom: 0, left: 0, right: 0,
            background: 'white',
            borderRadius: '24px 24px 0 0',
            padding: '20px 20px 36px 20px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            zIndex: 50,
          }} className="animate-slideUp">
            <p style={{
              fontSize: '11px', fontWeight: 900,
              color: '#16a34a',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
            }}>Prof. Carvalho:</p>
            <p style={{
              fontSize: '14px', fontWeight: 700,
              color: '#1e293b', lineHeight: '1.5', marginBottom: '8px',
            }}>"Que batalha incrível! Vocês dois têm muito talento. Agora, preciso que você aprenda a capturar POKÉMONS."</p>
            
            <div className="bg-green-50 p-3 rounded-xl border-2 border-green-100 mb-4">
               <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Missão: Capture 1 Pokémon na Rota 1</p>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-tight">Recompensa: 10 Pokébolas</p>
            </div>

            <button onClick={() => {
              setGameState(prev => ({ ...prev, inventory: { ...prev.inventory, items: { ...prev.inventory.items, pokeballs: (prev.inventory.items.pokeballs || 0) + 10 } }, worldFlags: [...(prev.worldFlags || []), "quest_capture_active"] })); setCurrentView("navigation_hub");
            }} style={{
              width: '100%', padding: '18px',
              borderRadius: '16px',
              background: '#16a34a',
              color: 'white', fontWeight: 900,
              fontSize: '16px', textTransform: 'uppercase',
              letterSpacing: '2px', border: 'none', cursor: 'pointer',
              minHeight: '64px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}>Vou Capturá-los!</button>
          </div>`;

// 5. Quest Oak Starters
const oldQuestOakStarters = `            <div className="w-full relative z-10 p-4">
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-[2rem] shadow-2xl border-b-[10px] border-slate-800 w-full">
                <div className="flex items-center gap-2 mb-3">
                  <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-8 h-8 rounded-full object-contain bg-slate-100 p-0.5" alt="" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prof. Carvalho</span>
                </div>
                <p className="text-sm font-bold text-slate-600 mb-2 italic">"Veja só! Azul me contou que capturou Pokémon incríveis nestas rotas!"</p>
                <p className="text-sm font-black text-pokeBlue mb-4 uppercase tracking-tighter leading-tight">
                  "Parece que Bulbasaur, Charmander e outros iniciais estão aparecendo raramente por aqui. Fique atento!"
                </p>
                <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 mb-4">
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Desbloqueio Especial  </p>
                   <p className="text-xs font-bold text-slate-800 uppercase mt-1 italic">Iniciais Raríssimos agora aparecem nas Rotas 1, 22 e Floresta!</p>
                </div>
                <button
                  onClick={() => {
                    setGameState(prev => ({
                      ...prev,
                      worldFlags: [...(prev.worldFlags || []), "rival_1_defeated"]
                    }));
                    handleGoToCity();
                  }}
                  className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg"
                >Vou Procurá-los!</button>
              </div>
            </div>`;

const newQuestOakStarters = `            {/* Balão na parte inferior — Padrão Oficial 1.9.6 */}
            <div style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 36px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 50,
            }} className="animate-slideUp">
              <p style={{
                fontSize: '11px', fontWeight: 900,
                color: '#16a34a',
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
              }}>Prof. Carvalho:</p>
              <p style={{
                fontSize: '14px', fontWeight: 700,
                color: '#1e293b', lineHeight: '1.5', marginBottom: '8px',
              }}>"Veja só! Azul me contou que capturou Pokémon incríveis nestas rotas! Iniciais raros foram avistados!"</p>
              
              <div className="bg-amber-50 p-3 rounded-xl border-2 border-amber-100 mb-4">
                 <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest italic">Aviso: Iniciais agora aparecem na Rota 1!</p>
              </div>

              <button onClick={() => {
                setGameState(prev => ({ ...prev, worldFlags: [...(prev.worldFlags || []), "rival_1_defeated"] }));
                handleGoToCity();
              }} style={{
                width: '100%', padding: '18px',
                borderRadius: '16px',
                background: '#16a34a',
                color: 'white', fontWeight: 900,
                fontSize: '16px', textTransform: 'uppercase',
                letterSpacing: '2px', border: 'none', cursor: 'pointer',
                minHeight: '64px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>Vou Procurá-los!</button>
            </div>`;

content = content.replace(oldIntro, newIntro);
content = content.replace(oldRivalIntro, newRivalIntro);
content = content.replace(oldRivalPost, newRivalPost);
content = content.replace(oldQuestOak, newQuestOak);
content = content.replace(oldQuestOakStarters, newQuestOakStarters);

fs.writeFileSync('src/AppRoot.jsx', content);
console.log('Success');

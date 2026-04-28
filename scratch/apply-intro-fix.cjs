const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

const introRegex = /case 'intro': \{[\s\S]*?case 'trainer_creation': \{/;
const introReplacement = `      case 'intro': {
        const introTexts = [
          "Olá! Bem-vindo ao mundo POKÉMON!",
          "Meu nome é CARVALHO. As pessoas me chamam de PROFESSOR POKÉMON.",
          "Este mundo é habitado por criaturas chamadas POKÉMON!",
          "Para alguns, POKÉMON são animais de estimação. Outros os usam para lutar.",
          "Eu... Eu estudo POKÉMON como profissão.",
          "Mas primeiro, diga-me... Qual é o seu nome?"
        ];
        
        const isLastStep = introStep === introTexts.length - 1;
        const labBg = fixPath('/battle_bg_lab_1776866008842.png');

        return (
          <div className="h-full flex flex-col items-center justify-end p-4 text-center animate-fadeIn relative overflow-hidden"
            style={{ backgroundImage: \`url(\${labBg})\`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Professor */}
            <div className="flex-1 flex items-center justify-center relative z-10">
              <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                className="h-52 md:h-72 drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-float"
                alt="Oak" />
            </div>

            {/* ⛔ PROTECTED: Balão de Diálogo Intro — NÃO ALTERAR SEM AUTORIZAÇÃO */}
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
                {isLastStep ? 'Tudo Pronto!' : 'PRÓXIMO \u25B6'}
              </button>
            </div>
          </div>
        );
      }
      case 'trainer_creation': {`;

if (introRegex.test(c)) {
    c = c.replace(introRegex, introReplacement);
    fs.writeFileSync('src/AppRoot.jsx', c);
    console.log('Success');
} else {
    console.log('Regex failed');
}

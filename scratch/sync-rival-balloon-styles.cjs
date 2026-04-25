const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const oldBlock = `            {/* Balão na parte inferior */}
            <div className="fixed bottom-0 left-0 right-0 z-20 p-4 pb-6">
              <div className="bg-white rounded-3xl px-6 py-5 shadow-2xl border-b-[6px] border-slate-200 w-full animate-slideUp">
                <p className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-3">
                  Rival — Azul:
                </p>
                <p className="text-slate-800 text-base font-bold leading-relaxed mb-5 italic">
                  "Beleza... Vou fazer meu Pokémon lutar para deixá-lo mais forte. Da próxima vez não vou perder!"
                </p>
                <button
                  onClick={() => setCurrentView('city')}
                  className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase text-lg hover:bg-red-500 transition-all active:scale-95 shadow-lg tracking-widest"
                  style={{ minHeight: '64px' }}
                >
                  CONTINUAR →
                </button>
              </div>
            </div>`;

const newBlock = `            {/* Balão na parte inferior */}
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

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/AppRoot.jsx', content);
    console.log('Success');
} else {
    console.log('Old block not found');
}

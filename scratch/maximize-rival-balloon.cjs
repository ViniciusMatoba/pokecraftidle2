const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const oldBlock = `            {/* Balão na parte inferior */}
            <div className="fixed bottom-0 left-0 right-0 p-4 z-20">
              <div className="bg-white rounded-2xl px-5 py-4 shadow-2xl border-b-[6px] border-slate-200 w-full animate-slideUp">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">
                  Rival — Azul:
                </p>
                <p className="text-slate-700 text-sm font-bold leading-relaxed mb-4 italic">
                  "Beleza... Vou fazer meu Pokémon lutar para deixá-lo mais forte. Da próxima vez não vou perder!"
                </p>
                <button
                  onClick={() => setCurrentView('city')}
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-base hover:bg-red-500 transition-all active:scale-95 shadow-lg tracking-widest"
                >
                  CONTINUAR →
                </button>
              </div>
            </div>`;

const newBlock = `            {/* Balão na parte inferior */}
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

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/AppRoot.jsx', content);
    console.log('Success');
} else {
    console.log('Old block not found');
}

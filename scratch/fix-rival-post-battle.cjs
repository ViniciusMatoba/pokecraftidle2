const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const oldBlock = `      case 'rival_post_battle': {
        return (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-end pb-10"
            style={{
              backgroundImage: "url('/battle_bg_lab_1776866008842.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Conteúdo acima do overlay */}
            <div className="relative z-10 flex flex-col items-center w-full">
              <img
                src={getRivalSprite(gameState.trainer?.avatarImg)}
                alt="Rival"
                className="w-36 h-36 object-contain drop-shadow-2xl mb-6"
                onError={e => { e.target.style.display='none'; }}
              />
              <div className="bg-white rounded-[2rem] p-5 mx-4 max-w-sm w-full shadow-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Rival â€” Azul
                </p>
                <p className="text-slate-700 text-sm font-bold leading-relaxed mb-5">
                  "Beleza... Vou fazer meu Pokémon lutar para deixá-lo mais forte. Da próxima vez não vou perder!"
                </p>
                <button
                  onClick={() => setCurrentView('city')}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-sm hover:bg-blue-500 transition-all active:scale-95 shadow-lg"
                >
                  Continuar â†’
                </button>
              </div>
            </div>
          </div>
        );
      }`;

const newBlock = `      case 'rival_post_battle': {
        return (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{
              backgroundImage: "url('/battle_bg_lab_1776866008842.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40" />

            {/* Sprite centrado */}
            <div className="relative z-10 mb-20">
              <img
                src={getRivalSprite(gameState.trainer?.avatarImg)}
                alt="Rival"
                className="w-40 h-40 object-contain drop-shadow-2xl animate-float"
                onError={e => { e.target.style.display='none'; }}
              />
            </div>

            {/* Balão na parte inferior */}
            <div className="fixed bottom-0 left-0 right-0 p-4 z-20 flex justify-center">
              <div className="bg-white rounded-2xl px-5 py-4 shadow-2xl border-b-[6px] border-slate-200 max-w-[340px] w-full animate-slideUp">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">
                  Rival — Azul:
                </p>
                <p className="text-slate-700 text-sm font-bold leading-relaxed mb-4 italic">
                  "Beleza... Vou fazer meu Pokémon lutar para deixá-lo mais forte. Da próxima vez não vou perder!"
                </p>
                <button
                  onClick={() => setCurrentView('city')}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-sm hover:bg-blue-500 transition-all active:scale-95 shadow-lg"
                >
                  Continuar →
                </button>
              </div>
            </div>
          </div>
        );
      }`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/AppRoot.jsx', content);
    console.log('Success');
} else {
    console.log('Old block not found');
}

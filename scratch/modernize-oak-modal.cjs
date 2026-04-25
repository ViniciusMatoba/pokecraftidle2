const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const oldModal = `          {showOakStaminaModal && (
            <div className="absolute inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
              <div className="w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-bounceIn border-b-[12px] border-slate-200">
                <div className="bg-green-50 p-5 overflow-y-auto max-h-[80vh]">

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                      className="w-16 h-16 object-contain shrink-0"
                      alt="Prof. Carvalho"
                    />
                    <div>
                      <p className="text-green-900 text-[10px] font-black uppercase tracking-widest">Professor Carvalho</p>
                      <p className="text-green-800 font-black text-sm italic leading-tight">
                        "Antes de partir â€” muito importante!"
                      </p>
                    </div>
                  </div>

                  <p className="text-green-900 text-sm leading-relaxed mb-4">
                    Seus Pokemon precisam se <strong>alimentar</strong> durante as batalhas. Quanto mais lutam, mais energia gastam!
                  </p>

                  <div className="bg-white rounded-2xl p-3 border border-green-200 mb-3">
                    <p className="text-green-800 text-xs font-black mb-2">O que alimenta seus Pokemon:</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png" className="w-6 h-6 object-contain shrink-0" alt="" />
                        <p className="text-green-700 text-xs"><strong>Berries</strong> â€” cultive na sua casa. Oran e Sitrus Berry sao essenciais</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-6 h-6 object-contain shrink-0" alt="" />
                        <p className="text-green-700 text-xs"><strong>Agua Fresca, Soda Pop, Limonada</strong> â€” compre no Poke Mart</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png" className="w-6 h-6 object-contain shrink-0" alt="" />
                        <p className="text-green-700 text-xs"><strong>Leite MooMoo</strong> â€” o mais nutritivo, disponivel apos o 4o ginasio</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure.png" className="w-6 h-6 object-contain shrink-0" alt="" />
                        <p className="text-green-700 text-xs"><strong>Racao Pokemon</strong> â€” fabricavel na Forja com materiais</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-2xl p-3 border border-red-200 mb-3">
                    <p className="text-red-700 text-xs font-black mb-1">PERIGO!</p>
                    <p className="text-red-600 text-xs leading-relaxed">
                      Quando a energia zera, seu Pokemon fica exausto e perde HP. Se desmaiar assim â€” conta como derrota!
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-3 border border-blue-200 mb-4">
                    <p className="text-blue-700 text-xs font-black mb-1">DICA:</p>
                    <p className="text-blue-600 text-xs leading-relaxed">
                      O sistema alimenta automaticamente com o melhor item disponivel. Sempre tenha estoque!
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-4">
                    <p className="text-amber-800 text-xs font-black mb-2">Presente do Professor Carvalho:</p>
                    <div className="flex items-center gap-2">
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-8 h-8 object-contain" alt="" />
                      <div>
                        <p className="text-amber-700 font-black text-sm">10x Agua Fresca</p>
                        <p className="text-amber-600 text-[10px] uppercase font-bold">Para comecar sua jornada!</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowOakStaminaModal(false)}
                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase text-sm hover:bg-green-500 transition-all active:scale-95"
                  >
                    Entendi, Professor!
                  </button>
                </div>
              </div>
            </div>
          )}`;

const newModal = `          {showOakStaminaModal && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0">
              <div className="bg-white w-full rounded-t-3xl shadow-2xl flex flex-col animate-slideUp"
                style={{ maxHeight: '85vh' }}>
                <div className="overflow-y-auto flex-1 px-5 pt-5 pb-2 custom-scrollbar">

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                      className="w-16 h-16 object-contain shrink-0"
                      alt="Prof. Carvalho"
                    />
                    <div>
                      <p className="text-green-900 text-[10px] font-black uppercase tracking-widest">Professor Carvalho</p>
                      <p className="text-green-800 font-black text-sm italic leading-tight">
                        "Antes de partir — muito importante!"
                      </p>
                    </div>
                  </div>

                  <p className="text-green-900 text-sm leading-relaxed mb-4">
                    Seus Pokemon precisam se <strong>alimentar</strong> durante as batalhas. Quanto mais lutam, mais energia gastam!
                  </p>

                  <div className="bg-white rounded-2xl p-3 border border-green-200 mb-3">
                    <p className="text-green-800 text-xs font-black mb-2">O que alimenta seus Pokemon:</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png" className="w-6 h-6 object-contain shrink-0" alt="" />
                        <p className="text-green-700 text-xs"><strong>Berries</strong> — cultive na sua casa. Oran e Sitrus Berry sao essenciais</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-6 h-6 object-contain shrink-0" alt="" />
                        <p className="text-green-700 text-xs"><strong>Agua Fresca, Soda Pop, Limonada</strong> — compre no Poke Mart</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png" className="w-6 h-6 object-contain shrink-0" alt="" />
                        <p className="text-green-700 text-xs"><strong>Leite MooMoo</strong> — o mais nutritivo, disponivel apos o 4o ginasio</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure.png" className="w-6 h-6 object-contain shrink-0" alt="" />
                        <p className="text-green-700 text-xs"><strong>Racao Pokemon</strong> — fabricavel na Forja com materiais</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-2xl p-3 border border-red-200 mb-3">
                    <p className="text-red-700 text-xs font-black mb-1">PERIGO!</p>
                    <p className="text-red-600 text-xs leading-relaxed">
                      Quando a energia zera, seu Pokemon fica exausto e perde HP. Se desmaiar assim — conta como derrota!
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-3 border border-blue-200 mb-4">
                    <p className="text-blue-700 text-xs font-black mb-1">DICA:</p>
                    <p className="text-blue-600 text-xs leading-relaxed">
                      O sistema alimenta automaticamente com o melhor item disponivel. Sempre tenha estoque!
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-4">
                    <p className="text-amber-800 text-xs font-black mb-2">Presente do Professor Carvalho:</p>
                    <div className="flex items-center gap-2">
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-8 h-8 object-contain" alt="" />
                      <div>
                        <p className="text-amber-700 font-black text-sm">10x Agua Fresca</p>
                        <p className="text-amber-600 text-[10px] uppercase font-bold">Para comecar sua jornada!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-slate-100">
                  <button
                    onClick={() => setShowOakStaminaModal(false)}
                    style={{
                      width: '100%',
                      padding: '18px',
                      borderRadius: '16px',
                      background: '#16a34a',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      border: 'none',
                      cursor: 'pointer',
                      minHeight: '64px',
                      boxShadow: '0 4px 12px rgba(22,163,74,0.4)',
                    }}
                  >
                    ENTENDI, PROFESSOR!
                  </button>
                </div>
              </div>
            </div>
          )}`;

if (content.includes(oldModal)) {
    content = content.replace(oldModal, newModal);
    fs.writeFileSync('src/AppRoot.jsx', content);
    console.log('Success');
} else {
    console.log('Old block not found');
}

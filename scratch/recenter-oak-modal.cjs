const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const oldModal = `          {showOakStaminaModal && (
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

const newModal = `          {showOakStaminaModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-lg animate-fadeIn">
              <div className="w-full max-w-[440px] bg-white rounded-[3.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-bounceIn border-b-[12px] border-slate-200 flex flex-col"
                style={{ maxHeight: '90vh' }}>
                <div className="overflow-y-auto flex-1 px-8 pt-8 pb-4 custom-scrollbar">

                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-green-100 p-2 rounded-3xl shrink-0">
                      <img
                        src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                        className="w-16 h-16 object-contain"
                        alt="Prof. Carvalho"
                      />
                    </div>
                    <div>
                      <p className="text-green-900 text-[11px] font-black uppercase tracking-[0.15em] opacity-60">Professor Carvalho</p>
                      <p className="text-slate-800 font-black text-lg italic leading-tight">
                        "Antes de partir — muito importante!"
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-base font-medium leading-relaxed mb-6">
                    Seus Pokémon precisam se <strong className="text-green-600">alimentar</strong> durante as batalhas. Quanto mais lutam, mais energia gastam!
                  </p>

                  <div className="bg-slate-50 rounded-[2rem] p-5 border-2 border-slate-100 mb-4">
                    <p className="text-slate-800 text-sm font-black mb-3 uppercase tracking-tighter">O que alimenta seus Pokémon:</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { img: 'oran-berry', text: '<strong>Berries</strong> — cultive na sua casa. Oran e Sitrus Berry são essenciais' },
                        { img: 'fresh-water', text: '<strong>Água, Soda, Limonada</strong> — compre no Poké Mart' },
                        { img: 'moomoo-milk', text: '<strong>Leite MooMoo</strong> — nutritivo, pós 4º ginásio' },
                        { img: 'lure', text: '<strong>Ração Pokémon</strong> — fabrique na Forja' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <img src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/\${item.img}.png\`} className="w-8 h-8 object-contain shrink-0" alt="" />
                          <p className="text-slate-600 text-xs leading-tight" dangerouslySetInnerHTML={{ __html: item.text }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-100 mb-4">
                    <p className="text-red-700 text-xs font-black mb-1 uppercase">⚠️ PERIGO!</p>
                    <p className="text-red-600 text-[13px] leading-relaxed font-medium">
                      Sem energia, seu Pokémon fica exausto e perde HP rapidamente.
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-100 mb-6">
                    <p className="text-amber-800 text-xs font-black mb-2 uppercase">Presente do Professor:</p>
                    <div className="flex items-center gap-3">
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-10 h-10 object-contain" alt="" />
                      <div>
                        <p className="text-amber-700 font-black text-base uppercase">10x Água Fresca</p>
                        <p className="text-amber-600 text-[10px] uppercase font-bold tracking-widest">Inicie sua jornada agora!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100">
                  <button
                    onClick={() => setShowOakStaminaModal(false)}
                    style={{
                      width: '100%',
                      padding: '20px',
                      borderRadius: '20px',
                      background: '#16a34a',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '18px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      border: 'none',
                      cursor: 'pointer',
                      minHeight: '72px',
                      boxShadow: '0 8px 24px rgba(22,163,74,0.35)',
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

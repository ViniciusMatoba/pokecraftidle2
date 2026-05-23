const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const oldModal = `          {showOakStaminaModal && (
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

const newModal = `          {showOakStaminaModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
              <div className="w-full max-w-[460px] bg-white rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] animate-bounceIn border-b-[14px] border-slate-200 flex flex-col"
                style={{ maxHeight: '92vh', minHeight: '600px' }}>
                <div className="overflow-y-auto flex-1 px-10 pt-12 pb-6 custom-scrollbar">

                  <div className="flex items-center gap-5 mb-10">
                    <div className="bg-green-100 p-3 rounded-[2rem] shrink-0 shadow-inner">
                      <img
                        src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                        className="w-16 h-16 object-contain"
                        alt="Prof. Carvalho"
                      />
                    </div>
                    <div>
                      <p className="text-green-900 text-[11px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Informativo</p>
                      <p className="text-slate-800 font-black text-xl italic leading-tight">
                        "Antes de partir — muito importante!"
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-500 text-base font-semibold leading-relaxed mb-8 px-2">
                    Seus Pokémon precisam se <strong className="text-green-600">alimentar</strong> durante as batalhas. Quanto mais lutam, mais energia gastam!
                  </p>

                  <div className="bg-slate-50 rounded-[2.5rem] p-7 border-2 border-slate-100 mb-6 shadow-sm">
                    <p className="text-slate-900 text-sm font-black mb-5 uppercase tracking-widest border-b-2 border-slate-200 pb-2">O que eles comem:</p>
                    <div className="flex flex-col gap-5">
                      {[
                        { img: 'oran-berry', text: '<strong>Berries</strong> — cultive na sua casa. Oran e Sitrus Berry são essenciais' },
                        { img: 'fresh-water', text: '<strong>Água, Soda, Limonada</strong> — compre no Poké Mart' },
                        { img: 'moomoo-milk', text: '<strong>Leite MooMoo</strong> — nutritivo, pós 4º ginásio' },
                        { img: 'poke-toy', text: '<strong>Ração Pokémon</strong> — fabrique na Forja com materiais' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <img src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/\${item.img}.png\`} className="w-7 h-7 object-contain shrink-0" alt="" />
                          </div>
                          <p className="text-slate-600 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: item.text }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-[2rem] p-6 border-2 border-red-100 mb-6 flex gap-4 items-start shadow-sm">
                    <span className="text-2xl mt-0.5">⚠️</span>
                    <div>
                      <p className="text-red-700 text-xs font-black mb-1 uppercase tracking-widest">Atenção Crítica</p>
                      <p className="text-red-600 text-[13px] leading-relaxed font-bold">
                        Sem energia, seu Pokémon fica exausto e perde HP rapidamente a cada turno!
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-[2rem] p-6 border-2 border-amber-100 mb-10 shadow-sm">
                    <p className="text-amber-800 text-[10px] font-black mb-3 uppercase tracking-[0.2em] opacity-70">Presente do Professor:</p>
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-md border-2 border-amber-200 animate-pulse">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-10 h-10 object-contain" alt="" />
                      </div>
                      <div>
                        <p className="text-amber-700 font-black text-lg uppercase tracking-tighter">10x Água Fresca</p>
                        <p className="text-amber-600 text-[10px] uppercase font-bold tracking-widest">Para começar bem sua jornada!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-10 py-8 bg-slate-50 border-t-2 border-slate-100">
                  <button
                    onClick={() => setShowOakStaminaModal(false)}
                    style={{
                      width: '100%',
                      padding: '24px',
                      borderRadius: '24px',
                      background: '#16a34a',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '3px',
                      border: 'none',
                      cursor: 'pointer',
                      minHeight: '80px',
                      boxShadow: '0 12px 32px rgba(22,163,74,0.4)',
                    }}
                    className="hover:scale-[1.02] active:scale-95 transition-all"
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

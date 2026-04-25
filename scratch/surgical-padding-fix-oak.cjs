const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const oldModal = `          {showOakStaminaModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-slate-950/95 backdrop-blur-2xl animate-fadeIn">
              <div className="w-full max-w-[480px] bg-white rounded-[4.5rem] overflow-hidden shadow-[0_48px_96px_-20px_rgba(0,0,0,0.7)] animate-bounceIn border-b-[16px] border-slate-200 flex flex-col"
                style={{ maxHeight: '94vh', minHeight: '650px' }}>
                <div className="overflow-y-auto flex-1 px-12 pt-16 pb-8 custom-scrollbar">

                  <div className="flex items-center gap-6 mb-12">
                    <div className="bg-green-100 p-4 rounded-[2.5rem] shrink-0 shadow-inner">
                      <img
                        src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                        className="w-16 h-16 object-contain"
                        alt="Prof. Carvalho"
                      />
                    </div>
                    <div>
                      <p className="text-green-900 text-[12px] font-black uppercase tracking-[0.25em] opacity-40 mb-1.5">Informativo</p>
                      <p className="text-slate-800 font-black text-2xl italic leading-tight">
                        "Antes de partir — muito importante!"
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-500 text-lg font-semibold leading-relaxed mb-10 px-2">
                    Seus Pokémon precisam se <strong className="text-green-600">alimentar</strong> durante as batalhas. Quanto mais lutam, mais energia gastam!
                  </p>

                  <div className="bg-slate-50 rounded-[3rem] p-9 border-2 border-slate-100 mb-10 shadow-sm">
                    <p className="text-slate-900 text-sm font-black mb-7 uppercase tracking-widest border-b-2 border-slate-200 pb-3">O que eles comem:</p>
                    <div className="flex flex-col gap-6">
                      {[
                        { img: 'oran-berry', text: '<strong>Berries</strong> — cultive na sua casa. Oran e Sitrus Berry são essenciais' },
                        { img: 'fresh-water', text: '<strong>Água, Soda, Limonada</strong> — compre no Poké Mart' },
                        { img: 'moomoo-milk', text: '<strong>Leite MooMoo</strong> — nutritivo, pós 4º ginásio' },
                        { img: 'poke-toy', text: '<strong>Ração Pokémon</strong> — fabrique na Forja com materiais' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-5 group">
                          <div className="w-12 h-12 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <img src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/\${item.img}.png\`} className="w-8 h-8 object-contain shrink-0" alt="" />
                          </div>
                          <p className="text-slate-600 text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: item.text }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-[2.5rem] p-8 border-2 border-red-100 mb-10 flex gap-5 items-start shadow-sm">
                    <span className="text-3xl mt-0.5">⚠️</span>
                    <div>
                      <p className="text-red-700 text-[11px] font-black mb-1.5 uppercase tracking-widest">Atenção Crítica</p>
                      <p className="text-red-600 text-sm leading-relaxed font-bold">
                        Sem energia, seu Pokémon fica exausto e perde HP rapidamente a cada turno!
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-[2.5rem] p-8 border-2 border-amber-100 mb-12 shadow-sm">
                    <p className="text-amber-800 text-[11px] font-black mb-4 uppercase tracking-[0.25em] opacity-60">Presente do Professor:</p>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center shadow-md border-2 border-amber-200 animate-pulse">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-11 h-11 object-contain" alt="" />
                      </div>
                      <div>
                        <p className="text-amber-700 font-black text-xl uppercase tracking-tighter leading-none mb-1">10x Água Fresca</p>
                        <p className="text-amber-600 text-[11px] uppercase font-bold tracking-widest">Para começar bem sua jornada!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-12 py-10 bg-slate-50 border-t-2 border-slate-100">
                  <button
                    onClick={() => setShowOakStaminaModal(false)}
                    style={{
                      width: '100%',
                      padding: '28px',
                      borderRadius: '28px',
                      background: '#16a34a',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '22px',
                      textTransform: 'uppercase',
                      letterSpacing: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      minHeight: '90px',
                      boxShadow: '0 16px 40px rgba(22,163,74,0.4)',
                    }}
                    className="hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    ENTENDI, PROFESSOR!
                  </button>
                </div>
              </div>
            </div>
          )}`;

const newModal = `          {showOakStaminaModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-slate-950/95 backdrop-blur-2xl animate-fadeIn">
              <div className="w-full max-w-[480px] bg-white rounded-[4.5rem] overflow-hidden shadow-[0_48px_96px_-20px_rgba(0,0,0,0.7)] animate-bounceIn border-b-[16px] border-slate-200 flex flex-col"
                style={{ maxHeight: '94vh', minHeight: '650px' }}>
                <div className="overflow-y-auto flex-1 px-6 pt-16 pb-8 custom-scrollbar">

                  <div className="flex items-center gap-6 mb-12 pl-4">
                    <div className="bg-green-100 p-4 rounded-[2.5rem] shrink-0 shadow-inner">
                      <img
                        src="https://play.pokemonshowdown.com/sprites/trainers/oak.png"
                        className="w-16 h-16 object-contain"
                        alt="Prof. Carvalho"
                      />
                    </div>
                    <div>
                      <p className="text-green-900 text-[12px] font-black uppercase tracking-[0.25em] opacity-40 mb-1.5">Informativo</p>
                      <p className="text-slate-800 font-black text-2xl italic leading-tight">
                        "Antes de partir — muito importante!"
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-500 text-lg font-semibold leading-relaxed mb-10 px-2">
                    Seus Pokémon precisam se <strong className="text-green-600">alimentar</strong> durante as batalhas. Quanto mais lutam, mais energia gastam!
                  </p>

                  <div className="bg-slate-50 rounded-[3rem] p-9 border-2 border-slate-100 mb-10 shadow-sm">
                    <p className="text-slate-900 text-sm font-black mb-7 uppercase tracking-widest border-b-2 border-slate-200 pb-3">O que eles comem:</p>
                    <div className="flex flex-col gap-6">
                      {[
                        { img: 'oran-berry', text: '<strong>Berries</strong> — cultive na sua casa. Oran e Sitrus Berry são essenciais' },
                        { img: 'fresh-water', text: '<strong>Água, Soda, Limonada</strong> — compre no Poké Mart' },
                        { img: 'moomoo-milk', text: '<strong>Leite MooMoo</strong> — nutritivo, pós 4º ginásio' },
                        { img: 'poke-toy', text: '<strong>Ração Pokémon</strong> — fabrique na Forja com materiais' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-5 group">
                          <div className="w-12 h-12 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <img src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/\${item.img}.png\`} className="w-8 h-8 object-contain shrink-0" alt="" />
                          </div>
                          <p className="text-slate-600 text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: item.text }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-[2.5rem] px-4 py-3 border-2 border-red-100 mt-4 mb-2 flex gap-5 items-start shadow-sm">
                    <span className="text-3xl mt-0.5">⚠️</span>
                    <div>
                      <p className="text-red-700 text-[11px] font-black mb-1.5 uppercase tracking-widest">Atenção Crítica</p>
                      <p className="text-red-600 text-sm leading-relaxed font-bold">
                        Sem energia, seu Pokémon fica exausto e perde HP rapidamente a cada turno!
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-[2.5rem] px-4 py-3 border-2 border-amber-100 mt-4 mb-2 shadow-sm">
                    <p className="text-amber-800 text-[11px] font-black mb-4 uppercase tracking-[0.25em] opacity-60">Presente do Professor:</p>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center shadow-md border-2 border-amber-200 animate-pulse">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png" className="w-11 h-11 object-contain" alt="" />
                      </div>
                      <div>
                        <p className="text-amber-700 font-black text-xl uppercase tracking-tighter leading-none mb-1">10x Água Fresca</p>
                        <p className="text-amber-600 text-[11px] uppercase font-bold tracking-widest">Para começar bem sua jornada!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-12 py-10 mt-4 bg-slate-50 border-t-2 border-slate-100">
                  <button
                    onClick={() => setShowOakStaminaModal(false)}
                    style={{
                      width: '100%',
                      padding: '28px',
                      borderRadius: '28px',
                      background: '#16a34a',
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '22px',
                      textTransform: 'uppercase',
                      letterSpacing: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      minHeight: '90px',
                      boxShadow: '0 16px 40px rgba(22,163,74,0.4)',
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

import React, { useState, useMemo } from 'react';

const PokedexScreen = ({ POKEDEX, caughtData, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoke, setSelectedPoke] = useState(null);

  const pokedexList = useMemo(() => {
    return Object.values(POKEDEX).sort((a, b) => a.id - b.id);
  }, [POKEDEX]);

  const filteredList = useMemo(() => {
    if (!searchTerm) return pokedexList;
    return pokedexList.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.id.toString() === searchTerm
    );
  }, [pokedexList, searchTerm]);

  const caughtCount = Object.keys(caughtData || {}).length;

  return (
    <div className="h-full bg-slate-100 flex flex-col animate-fadeIn overflow-hidden">
      {/* Header */}
      <div className="bg-pokeRed p-6 shadow-xl relative z-10 flex-shrink-0">
         <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-all">
               <span className="text-xl">←</span>
            </button>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Pokédex</h2>
            <div className="ml-auto bg-black/20 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase">
               {caughtCount} / {pokedexList.length} Capturados
            </div>
         </div>
         <input 
           type="text" 
           placeholder="Buscar por nome ou ID..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full bg-white/90 p-4 rounded-2xl font-bold text-slate-800 outline-none focus:ring-4 ring-white/30 shadow-inner"
         />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50">
         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {filteredList.map(p => {
              const isCaught = !!caughtData?.[p.id];
              return (
                <button 
                  key={p.id}
                  onClick={() => setSelectedPoke(p)}
                  className={`relative aspect-square rounded-3xl border-2 transition-all flex flex-col items-center justify-center p-2 group ${isCaught ? 'bg-white border-slate-200 hover:border-pokeBlue' : 'bg-slate-200 border-transparent opacity-40 grayscale'}`}
                >
                   <span className="absolute top-2 left-3 text-[8px] font-black text-slate-300">#{p.id}</span>
                   <img 
                     src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} 
                     className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" 
                     alt={p.name} 
                   />
                   <span className="text-[9px] font-black uppercase text-slate-600 truncate w-full text-center">{isCaught ? p.name : '???'}</span>
                   {isCaught && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>}
                </button>
              );
            })}
         </div>
      </div>

      {/* Detail Modal */}
      {selectedPoke && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative animate-bounceIn border-b-[12px] border-slate-200">
              <button onClick={() => setSelectedPoke(null)} className="absolute top-6 right-6 bg-slate-100 p-3 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-20">
                 <span className="font-black">✕</span>
              </button>

              <div className="h-40 bg-slate-100 relative flex items-center justify-center">
                 <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-64 h-64 absolute -top-10 -left-10 rotate-12" alt="" />
                 </div>
                 <img 
                   src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPoke.id}.png`} 
                   className="w-48 h-48 object-contain drop-shadow-2xl relative z-10" 
                   alt={selectedPoke.name} 
                 />
              </div>

              <div className="p-8">
                 <div className="text-center mb-6">
                    <h3 className="text-4xl font-black text-slate-800 uppercase italic leading-none">{!!caughtData?.[selectedPoke.id] ? selectedPoke.name : '???'}</h3>
                    <div className="flex justify-center gap-2 mt-3">
                       {selectedPoke.types?.map(t => (
                         <span key={t} className="bg-slate-800 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{t}</span>
                       ))}
                    </div>
                 </div>

                 {!!caughtData?.[selectedPoke.id] ? (
                   <>
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Status Base</p>
                           <div className="space-y-1">
                              {Object.entries({ HP: selectedPoke.hp, ATK: selectedPoke.attack, DEF: selectedPoke.defense, SPD: selectedPoke.speed }).map(([label, val]) => (
                                <div key={label} className="flex items-center justify-between">
                                   <span className="text-[9px] font-bold text-slate-500">{label}</span>
                                   <span className="text-[10px] font-black text-slate-800">{val}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 overflow-y-auto max-h-32 custom-scrollbar">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Movimentos</p>
                           {selectedPoke.learnset?.slice(0, 10).map((m, i) => (
                             <div key={i} className="text-[9px] font-bold text-slate-700 uppercase mb-1 flex justify-between">
                                <span>{m.move.replace('-', ' ')}</span>
                                <span className="text-slate-300">Nv.{m.level}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                     <p className="text-[10px] text-slate-500 italic text-center">
                        "Explora o mundo e coleta mais informações sobre esta espécie."
                     </p>
                   </>
                 ) : (
                   <div className="py-12 text-center bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200">
                      <p className="text-slate-400 font-black uppercase italic">Dados Indisponíveis</p>
                      <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">Capture este Pokémon para ver detalhes</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PokedexScreen;

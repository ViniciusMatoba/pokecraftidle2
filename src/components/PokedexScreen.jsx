import React, { useState, useMemo } from 'react';
import { TYPE_COLOR_HEX } from '../data/gyms';

const PokedexScreen = ({ POKEDEX, caughtData, team = [], box = [], onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoke, setSelectedPoke] = useState(null);

  // Mapeia IDs que o jogador possui atualmente (time + box) para garantir que contem no Pokédex
  const possessedIds = useMemo(() => {
    const ids = new Set(Object.keys(caughtData || {}).map(Number));
    team.forEach(p => ids.add(Number(p.id)));
    box.forEach(p => ids.add(Number(p.id)));
    return ids;
  }, [caughtData, team, box]);

  const pokedexList = useMemo(() => {
    return Object.values(POKEDEX).sort((a, b) => a.id - b.id);
  }, [POKEDEX]);

  const filteredList = useMemo(() => {
    if (!searchTerm) return pokedexList;
    return pokedexList.filter(p => 
      (p.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
      String(p.id).includes(searchTerm)
    );
  }, [pokedexList, searchTerm]);

  const caughtCount = possessedIds.size;

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
              const isCaught = possessedIds.has(p.id);
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
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative animate-bounceIn border-b-[12px] border-slate-200">
               {(() => {
                 const poke = selectedPoke;
                 const types = poke.types || [poke.type || 'Normal'];
                 const t1 = types[0] || 'Normal';
                 const t2 = types[1] || null;

                 const TYPE_COLORS = {
                   Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
                   Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
                   Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
                   Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
                   Steel: '#5a8ea2', Fairy: '#fb89eb',
                 };

                 const c1 = TYPE_COLORS[t1] || '#9ea0aa';
                 const c2 = t2 ? (TYPE_COLORS[t2] || '#9ea0aa') : c1;

                 const bgStyle = t2
                   ? { background: `linear-gradient(160deg, ${c1} 0%, ${c1}bb 40%, ${c2}bb 60%, ${c2} 100%)` }
                   : { background: `linear-gradient(160deg, ${c1}88 0%, ${c1} 60%, ${c1}dd 100%)` };

                 const typeIconUrl = (t) => t ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.toLowerCase()}.svg` : '';

                 return (
                   <div className="h-48 w-full relative flex flex-col items-center justify-center overflow-hidden" style={bgStyle}>
                      {/* Padrão de pontos */}
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                      {/* Ícones de tipo grandes no fundo (decoração) */}
                      <img src={typeIconUrl(t1)} className="absolute -left-4 bottom-2 w-28 h-28 opacity-10 pointer-events-none select-none invert" alt="" />
                      {t2 && <img src={typeIconUrl(t2)} className="absolute -right-2 top-2 w-24 h-24 opacity-10 pointer-events-none select-none invert" alt="" />}

                      {/* Badges de tipo no topo */}
                      <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end z-20">
                        {types.map(t => (
                          <div key={t} className="bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-md">
                            <img src={typeIconUrl(t)} className="w-3 h-3 invert" alt={t} />
                            <span className="text-[9px] font-black text-white uppercase tracking-wider">{t}</span>
                          </div>
                        ))}
                      </div>

                      <button 
                         onClick={() => setSelectedPoke(null)}
                         className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center z-30 font-black hover:bg-white/40 transition-all border border-white/30 shadow-lg"
                      >✕</button>

                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`}
                        className={`h-40 object-contain relative z-10 transition-all duration-700 ${possessedIds.has(poke.id) ? 'scale-110 drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : 'brightness-0 opacity-20 grayscale blur-[2px]'}`}
                        alt={poke.name}
                      />
                   </div>
                 );
               })()}

              <div className="p-8">
                 <div className="text-center mb-6">
                    <h3 className="text-4xl font-black text-slate-800 uppercase italic leading-none">{possessedIds.has(selectedPoke.id) ? selectedPoke.name : '???'}</h3>
                    <div className="flex justify-center gap-2 mt-3">
                       {selectedPoke.types?.map(t => (
                         <span key={t} className="bg-slate-800 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{t}</span>
                       ))}
                    </div>
                 </div>

                 {possessedIds.has(selectedPoke.id) ? (
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

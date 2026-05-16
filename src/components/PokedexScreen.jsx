import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { TYPE_COLOR_HEX } from '../data/gyms';
import { isRouteUnlocked } from '../data/routes';
import { getMegaSprite } from '../data/megaEvolutions';

const REGION_LABEL = {
  kanto: 'Kanto', johto: 'Johto', hoenn: 'Hoenn', sinnoh: 'Sinnoh',
  unova: 'Unova', kalos: 'Kalos', alola: 'Alola', galar: 'Galar',
  hisui: 'Hisui', paldea: 'Paldea',
};

const PokedexScreen = ({ POKEDEX, caughtData, team = [], box = [], dexLimit = 151, routes = {}, gameState = {}, onGoToRoute, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoke, setSelectedPoke] = useState(null);

  // Mapeia IDs que o jogador possui atualmente (time + box).
  const possessedIds = useMemo(() => {
    const ids = new Set(Object.keys(caughtData || {}).map(Number).filter(id => id <= dexLimit));
    team.forEach(p => { if (Number(p.id) <= dexLimit) ids.add(Number(p.id)); });
    box.forEach(p => { if (Number(p.id) <= dexLimit) ids.add(Number(p.id)); });
    return ids;
  }, [caughtData, team, box, dexLimit]);

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

  // Mapa pokemonId → lista de rotas onde aquele pokémon aparece como inimigo selvagem
  const pokemonRouteMap = useMemo(() => {
    const map = {};
    Object.values(routes).forEach(route => {
      if (!Array.isArray(route.enemies) || route.enemies.length === 0) return;
      route.enemies.forEach(enemy => {
        const id = Number(enemy.id);
        if (!id) return;
        if (!map[id]) map[id] = [];
        if (!map[id].find(r => r.id === route.id)) {
          map[id].push({
            id: route.id,
            name: route.name || route.id,
            level: enemy.level,
            group: route.group || '',
            unlocked: isRouteUnlocked(route, gameState),
          });
        }
      });
    });
    return map;
  }, [routes, gameState]);

  return (
    <div className="h-full bg-slate-100 flex flex-col animate-fadeIn overflow-hidden">
      {/* Header */}
      <div className="bg-pokeRed p-6 shadow-xl relative z-10 flex-shrink-0">
         <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="bg-white/20 p-2 rounded-xl text-white hover:bg-white/30 transition-all">
               <span className="text-xl">&lt;</span>
            </button>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Pokedex</h2>
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
                      src={p.id >= 10000 ? getMegaSprite(p.id) : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} 
                      onError={e => {
                        if (!e.target.dataset.triedBase && p.id >= 10000) {
                          e.target.dataset.triedBase = '1';
                          // Fallback para o ID base se for um ID Mega/Alternativo
                          const baseId = p.id % 10000;
                          e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${baseId}.png`;
                        }
                      }}
                      className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" 
                      alt={p.name} 
                      loading="lazy"
                    />
                   <span className="text-[9px] font-black uppercase text-slate-600 truncate w-full text-center">{isCaught ? p.name : '???'}</span>
                   {isCaught && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>}
                </button>
              );
            })}
         </div>
      </div>

      {/* Detail Modal */}
      {selectedPoke && typeof document !== 'undefined' && createPortal((() => {
        const poke = selectedPoke;
        const isCaught = possessedIds.has(poke.id);
        const ownedPoke = [...team, ...box].find(p => Number(p.id) === Number(poke.id));
        const displayPoke = ownedPoke || poke;
        const types = displayPoke.types || [displayPoke.type || 'Normal'];
        const t1 = types[0] || 'Normal';
        const t2 = types[1] || null;
        const TYPE_COLORS = {
          Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
          Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
          Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
          Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
          Steel: '#5a8ea2', Fairy: '#fb89eb',
        };
        const typeIconUrl = (t) => t ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${String(t).toLowerCase()}.svg` : '';
        const c1 = TYPE_COLORS[t1] || '#9ea0aa';
        const c2 = t2 ? (TYPE_COLORS[t2] || '#9ea0aa') : c1;
        const bgStyle = t2
          ? { background: `linear-gradient(160deg, ${c1} 0%, ${c1}bb 40%, ${c2}bb 60%, ${c2} 100%)` }
          : { background: `linear-gradient(160deg, ${c1}88 0%, ${c1} 60%, ${c1}dd 100%)` };

        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
            <div className="bg-white w-[82vw] max-w-[360px] h-[82dvh] max-h-[720px] rounded-[2rem] shadow-2xl border-b-[8px] border-slate-200 overflow-hidden relative animate-slideInUp flex flex-col">
              <button onClick={() => setSelectedPoke(null)} className="absolute top-4 right-4 bg-white/20 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/30 backdrop-blur-md transition-all z-20 text-white font-black text-xs">
                x
              </button>

              <div className="h-48 w-full shrink-0 relative overflow-hidden shadow-inner" style={bgStyle}>
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <img src={typeIconUrl(t1)} className="absolute -left-4 bottom-2 w-28 h-28 opacity-10 pointer-events-none select-none invert" alt="" />
                {t2 && <img src={typeIconUrl(t2)} className="absolute -right-2 top-2 w-24 h-24 opacity-10 pointer-events-none select-none invert" alt="" />}

                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-10">
                  {types.map(t => (
                    <div key={t} className="px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md text-white" style={{ background: TYPE_COLORS[t] || '#64748b' }}>
                      <img src={typeIconUrl(t)} className="w-3.5 h-3.5 invert" alt="" onError={e => { e.target.style.display = 'none'; }} />
                      <span className="text-[9px] font-black uppercase tracking-wider">{t}</span>
                    </div>
                  ))}
                </div>

                <img
                  src={displayPoke.isMega && displayPoke.megaFormId 
                    ? getMegaSprite(displayPoke.megaFormId)
                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${displayPoke.isShiny ? 'shiny/' : ''}${displayPoke.id}.png`}
                  onError={e => {
                    if (!e.target.dataset.triedBase) {
                      e.target.dataset.triedBase = '1';
                      e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${displayPoke.isShiny ? 'shiny/' : ''}${displayPoke.id}.png`;
                    }
                  }}
                  className={`absolute left-1/2 top-12 z-10 w-28 h-28 -translate-x-1/2 object-contain drop-shadow-2xl ${isCaught ? '' : 'brightness-0 opacity-25 grayscale blur-[1px]'}`}
                  alt={displayPoke.name}
                  loading="lazy"
                />
              </div>

              <div className="flex-1 overflow-y-auto px-5 pt-6 pb-6 custom-scrollbar">
                <div className="text-center mb-5">
                  <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                    {isCaught ? displayPoke.name : '???'}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">#{String(displayPoke.id).padStart(3, '0')}</span>
                    {isCaught && displayPoke.level && (
                      <>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Nv. {displayPoke.level}</span>
                      </>
                    )}
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    {types.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white shadow-sm" style={{ background: TYPE_COLORS[t] || '#64748b' }}>
                        <img src={typeIconUrl(t)} className="w-3 h-3 invert" alt="" onError={e => { e.target.style.display = 'none'; }} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {isCaught ? (
                  <>
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-4">
                      <h4 className="font-black uppercase text-[8px] text-slate-400 mb-3 tracking-widest text-center">Informacoes do Pokemon</h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 px-2">
                        {Object.entries({
                          HP: displayPoke.hp || displayPoke.maxHp || poke.hp,
                          ATK: displayPoke.attack || poke.attack,
                          DEF: displayPoke.defense || poke.defense,
                          SPD: displayPoke.speed || poke.speed,
                          'S.ATK': displayPoke.spAtk || poke.spAtk || 10,
                          'S.DEF': displayPoke.spDef || poke.spDef || 10,
                        }).map(([label, val]) => (
                          <div key={label} className="flex justify-between items-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase">{label}</p>
                            <p className="text-xs font-black text-slate-700">{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-[2rem] border-2 border-slate-100 shadow-inner mb-4">
                      <h4 className="font-black uppercase text-[10px] text-slate-400 text-center tracking-widest mb-3">Ataques</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                        {(displayPoke.moves || poke.learnset?.slice(0, 8)?.map(m => ({ name: m.move.replace(/-/g, ' '), level: m.level })) || []).map((m, i) => (
                          <div key={i} className="flex items-center justify-between rounded-2xl bg-white border border-slate-100 px-3 py-2">
                            <span className="text-[10px] font-black uppercase text-slate-700 truncate">{m.name || m.move}</span>
                            <span className="text-[8px] font-bold uppercase text-slate-400">{m.level ? `Nv.${m.level}` : (m.type || '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200 mb-4">
                    <p className="text-slate-400 font-black uppercase italic">Dados Indisponiveis</p>
                    <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">Capture este Pokemon para ver detalhes</p>
                  </div>
                )}

                {/* ── Onde Encontrar ── */}
                {(() => {
                  const pokeRoutes = pokemonRouteMap[poke.id] || [];
                  if (pokeRoutes.length === 0) return null;
                  return (
                    <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden mb-2">
                      <div className="px-4 pt-4 pb-2">
                        <h4 className="font-black uppercase text-[9px] text-slate-400 tracking-widest text-center mb-3">
                          📍 Onde Encontrar
                        </h4>
                      </div>
                      <div className="flex flex-col divide-y divide-slate-100 max-h-52 overflow-y-auto custom-scrollbar">
                        {pokeRoutes.map(route => (
                          <div key={route.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] font-black text-slate-700 truncate leading-tight">{route.name}</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                Nv. {route.level} · {route.group}
                              </span>
                            </div>
                            {route.unlocked ? (
                              <button
                                onClick={() => { onGoToRoute && onGoToRoute(route.id); setSelectedPoke(null); }}
                                className="shrink-0 bg-pokeBlue text-white text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl hover:bg-blue-600 active:scale-95 transition-all shadow-sm"
                              >
                                Ir à rota
                              </button>
                            ) : (
                              <span className="shrink-0 text-[8px] font-black text-slate-300 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-xl">
                                🔒 Bloqueada
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        );
      })(), document.body)}    </div>
  );
};

export default PokedexScreen;

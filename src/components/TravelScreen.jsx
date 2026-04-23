import React from 'react';
import { isRouteUnlocked as checkRouteUnlocked } from '../data/routes';
import { CRAFTING_RECIPES } from '../data/recipes';

const TravelScreen = ({ 
  gameState, 
  setGameState, 
  travelTab, 
  setTravelTab, 
  ROUTES, 
  setCurrentEnemy, 
  setCurrentView,
  fixPath,
  POKEDEX
}) => {
  const [selectedRoute, setSelectedRoute] = React.useState(null);
  const [selectedPoke, setSelectedPoke] = React.useState(null);
  const [selectedDrop, setSelectedDrop] = React.useState(null);

  const isRouteUnlocked = (route) => checkRouteUnlocked(route, gameState);

  const getRouteDrops = (route) => {
    if (!route.enemies) return [];
    const drops = new Set();
    route.enemies.forEach(e => {
      if (e.drop) drops.add(e.drop);
    });
    return Array.from(drops);
  };

  const getRecipesUsingMaterial = (materialId) => {
    const results = [];
    Object.values(CRAFTING_RECIPES).forEach(category => {
      category.forEach(recipe => {
        if (recipe.cost && recipe.cost[materialId]) {
          results.push(recipe);
        }
      });
    });
    return results;
  };

  const formatRequirement = (req) => {
    const map = {
      'has_starter': 'Ter um Pokémon inicial',
      'boulder_badge': 'Insígnia da Rocha (Brock)',
      'cascade_badge': 'Insígnia da Cascata (Misty)',
      'thunder_badge': 'Insígnia do Trovão (Lt. Surge)',
      'rainbow_badge': 'Insígnia do Arco-Íris (Erika)',
      'soul_badge': 'Insígnia da Alma (Koga)',
      'marsh_badge': 'Insígnia do Pântano (Sabrina)',
      'volcano_badge': 'Insígnia do Vulcão (Blaine)',
      'earth_badge': 'Insígnia da Terra (Giovanni)',
      'rival_1_defeated': 'Derrotar o Rival na Rota 1',
      'viridian_forest_cleared': 'Limpar a Floresta de Viridian',
      'mt_moon_cleared': 'Atravessar o Mt. Moon',
      'rival_3_defeated': 'Derrotar o Rival no S.S. Anne',
      'rock_tunnel_cleared': 'Atravessar o Rock Tunnel',
      'pokemon_tower_cleared': 'Libertar a Torre Pokémon',
      'rocket_hideout_cleared': 'Destruir o QG da Equipe Rocket',
      'silph_co_cleared': 'Salvar a Silph Co.',
      'mansion_cleared': 'Explorar a Mansão Pokémon',
      'champion': 'Tornar-se o Campeão da Liga Pokémon'
    };
    return map[req] || req;
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10 h-full text-left">
      <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-slate-100 flex-shrink-0">
         <h2 className="text-xl font-black text-slate-800 uppercase italic">Mapa da Região</h2>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Clique para ver detalhes ou viajar</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex flex-col gap-8 pb-8">
            {Object.entries(
              Object.entries(ROUTES).reduce((acc, [id, r]) => {
                const group = r.group || "Outros Destinos";
                if (!acc[group]) acc[group] = [];
                acc[group].push({ id, ...r });
                return acc;
              }, {})
            ).map(([groupName, groupRoutes]) => (
              <div key={groupName} className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2">
                   <div className="h-[2px] flex-1 bg-slate-200"></div>
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">{groupName}</h4>
                   <div className="h-[2px] flex-1 bg-slate-200"></div>
                </div>

                <div className="grid grid-cols-1 gap-4 pr-1">
                  {groupRoutes.map((route) => {
                    const id = route.id;
                    const unlocked = isRouteUnlocked(route);
                    const isCurrent = gameState.currentRoute === id;
                    
                    if (route.type === 'city' || route.type === 'gym') return null;

                    return (
                      <button 
                        key={id} 
                        onClick={() => setSelectedRoute({ id, ...route })} 
                        className={`bg-white p-4 rounded-[2.5rem] border-4 transition-all flex items-center justify-between group overflow-hidden relative ${unlocked ? 'border-slate-50 hover:border-pokeBlue shadow-sm hover:shadow-md' : 'border-slate-50 opacity-60 grayscale'}`}
                      >
                         <div className="flex items-center gap-4">
                           <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-inner relative flex-shrink-0 bg-slate-200">
                             <img src={fixPath(route.background)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={route.name} />
                             {!unlocked && (
                               <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                                 <span className="text-lg">🔒</span>
                               </div>
                             )}
                           </div>
                           <div className="text-left">
                             <h3 className="text-lg font-black text-slate-800 uppercase italic leading-none">{route.name}</h3>
                             <div className="flex items-center gap-2 mt-1.5">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${unlocked ? 'bg-green-100 text-green-600 border-green-200' : 'bg-red-100 text-red-600 border-red-200'}`}>
                                  {unlocked ? 'Disponível' : 'Bloqueado'}
                                </span>
                             </div>
                           </div>
                         </div>
                         {isCurrent && (
                           <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-pokeBlue"></div>
                         )}
                         <div className="text-xl opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all">🔍</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
      </div>
           {/* Modal de Detalhes da Rota */}
      {selectedRoute && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-3 md:p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-slideInUp" style={{ maxHeight: '85dvh' }}>
            <div className="overflow-y-auto custom-scrollbar flex-1">
            <div className="h-40 relative flex-shrink-0">
              <img src={fixPath(selectedRoute.background)} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              <button 
                onClick={() => setSelectedRoute(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-30"
              >✕</button>
            </div>

            <div className="p-8 -mt-10 relative z-10">
              <div className="flex justify-between items-start mb-1">
                 <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">{selectedRoute.name}</h2>
                 <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${isRouteUnlocked(selectedRoute) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                   {isRouteUnlocked(selectedRoute) ? 'Liberada' : 'Bloqueada'}
                 </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 italic">{selectedRoute.description || 'Uma área de treinamento em Kanto.'}</p>

              {!isRouteUnlocked(selectedRoute) && (
                <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-5 mb-6">
                  <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span>🔒</span> Requisitos Necessários
                  </h4>
                  <ul className="flex flex-col gap-2">
                    {selectedRoute.requirements.map(req => (
                      <li key={req} className="text-xs font-bold text-red-600 flex items-center gap-2 italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                        {formatRequirement(req)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-6 mb-8">
                {/* ENCONTROS */}
                <div className="bg-slate-50 rounded-3xl p-5 border-2 border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Pokémons na Área</h4>
                    <span className="text-[9px] font-bold text-slate-400 italic">Toque para detalhes</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {selectedRoute.enemies?.slice(0, 8).map(p => {
                      const caught = gameState.caughtData?.[p.id];
                      return (
                        <button 
                          key={p.id} 
                          onClick={() => setSelectedPoke(p)}
                          className="relative group/poke flex flex-col items-center gap-1">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${caught ? 'bg-white shadow-sm border border-slate-100 group-hover/poke:border-pokeBlue' : 'bg-slate-100/50'}`}>
                            <img 
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} 
                              className={`w-12 h-12 object-contain transition-all ${caught ? 'group-hover/poke:scale-125' : 'brightness-0 opacity-10'}`} 
                              alt={caught ? p.name : '???'}
                            />
                            {!caught && <span className="absolute text-xs opacity-20 font-black">?</span>}
                          </div>
                          <span className={`text-[8px] font-black uppercase truncate w-full text-center ${caught ? 'text-slate-600' : 'text-slate-300'}`}>
                             {caught ? POKEDEX[p.id]?.name : '???'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DROPS */}
                <div className="bg-slate-50 rounded-3xl p-5 border-2 border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Materiais & Drops</h4>
                    <span className="text-[9px] font-bold text-slate-400 italic">Ver utilidade</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {getRouteDrops(selectedRoute).map(drop => (
                      <button 
                        key={drop} 
                        onClick={() => setSelectedDrop(drop)}
                        className="bg-white px-4 py-2.5 rounded-2xl shadow-sm border-2 border-slate-100 hover:border-pokeBlue hover:scale-105 transition-all flex items-center gap-2 group/drop">
                        <div className={`w-6 h-6 rounded-lg ${drop.includes('essence') ? 'animate-pulse' : ''} bg-slate-50 flex items-center justify-center group-hover/drop:rotate-12 transition-transform`}>
                           <span className="text-xs">💎</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase italic leading-none">{drop.replace('_essence', '').replace('_', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isRouteUnlocked(selectedRoute) ? (
                <button 
                  onClick={() => {
                    setGameState(prev => ({ ...prev, currentRoute: selectedRoute.id }));
                    setCurrentEnemy(null);
                    setCurrentView('battles');
                    setSelectedRoute(null);
                  }}
                  className="w-full bg-pokeBlue text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95 border-b-8 border-blue-800 flex items-center justify-center gap-3"
                >
                  <span className="text-xl">⚔️</span>
                  Começar Treino
                </button>
              ) : (
                <button 
                  disabled
                  className="w-full bg-slate-200 text-slate-400 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] cursor-not-allowed border-b-8 border-slate-300"
                >Caminho Bloqueado</button>
              )}
              
              {/* Espaço extra para garantir que o scroll chegue ao fim */}
              <div className="h-24"></div>
            </div>
          </div>{/* fecha scroll */}
          </div>{/* fecha card */}
        </div>
      )}

      {/* Modal Detalhado do Pokémon */}
      {selectedPoke && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-y-auto max-h-[85vh] animate-bounceIn relative custom-scrollbar">
              <button 
                onClick={() => setSelectedPoke(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center z-20 font-black hover:bg-red-50 hover:text-red-500 transition-all"
              >✕</button>
              
              <div className={`h-40 w-full flex items-center justify-center relative overflow-hidden bg-slate-50 shadow-inner`}>
                 <div className="absolute inset-0 opacity-5 flex flex-wrap gap-4 p-4 pointer-events-none">
                    {Array(24).fill(0).map((_, i) => <span key={i} className="text-2xl rotate-12">🎾</span>)}
                 </div>
                 <img 
                   src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPoke.id}.png`} 
                   className={`h-36 object-contain relative z-10 transition-all ${gameState.caughtData?.[selectedPoke.id] ? 'scale-110 drop-shadow-2xl' : 'brightness-0 opacity-30 grayscale blur-[2px]'}`} 
                   alt={selectedPoke.name} 
                 />
              </div>

              <div className="p-10 text-center">
                 <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                   {gameState.caughtData?.[selectedPoke.id] ? POKEDEX[selectedPoke.id]?.name : '??? Desconhecido'}
                 </h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                   {gameState.caughtData?.[selectedPoke.id] ? `No. Pokédex #${selectedPoke.id.toString().padStart(3, '0')}` : 'Identidade Oculta'}
                 </p>

                 {gameState.caughtData?.[selectedPoke.id] ? (
                   <div className="mt-8 space-y-6">
                      <div className="flex justify-center gap-2">
                         {POKEDEX[selectedPoke.id]?.types?.map(t => (
                           <span key={t} className="px-5 py-1.5 rounded-full bg-slate-800 text-[10px] font-black uppercase text-white tracking-widest">{t}</span>
                         ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 text-left">
                            <p className="text-[9px] font-black text-slate-400 uppercase">HP Máximo</p>
                            <p className="text-lg font-black text-slate-800 leading-none mt-1">{POKEDEX[selectedPoke.id]?.hp}</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 text-left">
                            <p className="text-[9px] font-black text-slate-400 uppercase">Ataque Base</p>
                            <p className="text-lg font-black text-slate-800 leading-none mt-1">{POKEDEX[selectedPoke.id]?.attack}</p>
                         </div>
                      </div>
                      <p className="text-sm font-bold text-slate-500 italic leading-relaxed">"O habitat deste Pokémon e suas habilidades detalhadas estão salvos em sua Pokédex."</p>
                   </div>
                 ) : (
                   <div className="mt-8 p-8 bg-slate-100/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold italic text-sm leading-snug">
                      Derrote e capture esta espécie para liberar informações completas de combate e biologia!
                   </div>
                 )}
                 <button 
                   onClick={() => setSelectedPoke(null)}
                   className="w-full mt-10 bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 active:scale-95 transition-all shadow-lg"
                 >Fechar Registro</button>
              </div>
           </div>
        </div>
      )}

      {/* Modal de Detalhes do Drop */}
      {selectedDrop && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-bounceIn relative max-h-[85vh] flex flex-col">
              <button 
                onClick={() => setSelectedDrop(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center z-20 font-black hover:bg-red-50 hover:text-red-500 transition-all"
              >✕</button>

              <div className="p-10 flex-1 overflow-y-auto custom-scrollbar pt-12">
                 <div className="flex items-center gap-5 bg-pokeBlue/5 p-6 rounded-[2.5rem] border-2 border-pokeBlue/10 mb-10">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-sm border border-slate-100 rotate-6">💎</div>
                    <div>
                       <p className="text-[10px] font-black text-pokeBlue uppercase tracking-[0.2em] leading-none">Material Raro:</p>
                       <h4 className="text-2xl font-black text-slate-800 uppercase italic mt-2 tracking-tighter">{selectedDrop.replace('_essence', '').replace('_', ' ')}</h4>
                    </div>
                 </div>

                 <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-pokeGold shadow-[0_0_10px_rgba(255,203,5,0.5)]"></span> 
                    Essencial para Forjar:
                 </h3>

                 <div className="space-y-4">
                    {getRecipesUsingMaterial(selectedDrop).length > 0 ? (
                      getRecipesUsingMaterial(selectedDrop).map(recipe => (
                        <div key={recipe.id} className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-100 flex items-center gap-4 group/recipe hover:border-pokeBlue transition-all">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner border border-slate-200 group-hover/recipe:rotate-6 transition-transform">
                              <img src={recipe.img} className="w-10 h-10 object-contain drop-shadow-md" alt={recipe.name} />
                           </div>
                           <div className="flex-1 text-left">
                              <p className="text-sm font-black text-slate-800 uppercase italic leading-none">{recipe.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1.5 italic line-clamp-1">{recipe.effect || 'Item de Equipamento'}</p>
                           </div>
                           <div className="text-right shrink-0">
                              <p className="text-sm font-black text-pokeBlue">x{recipe.cost[selectedDrop]}</p>
                              <p className="text-[8px] font-bold text-slate-300 uppercase">Qtd.</p>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold italic text-sm text-center">
                         Este material ainda não possui receitas conhecidas. Continue explorando Kanto!
                      </div>
                    )}
                 </div>

                 <button 
                   onClick={() => setSelectedDrop(null)}
                   className="w-full mt-10 bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 active:scale-95 transition-all shadow-lg"
                 >Voltar ao Mapa</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TravelScreen;

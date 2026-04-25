import React from 'react';
import { isRouteUnlocked as checkRouteUnlocked } from '../data/routes';
import { CRAFTING_RECIPES } from '../data/recipes';
import { TYPE_COLOR_HEX } from '../data/gyms';

const TravelScreen = ({ 
  gameState, 
  setGameState, 
  travelTab, 
  setTravelTab, 
  ROUTES, 
  setCurrentEnemy, 
  setCurrentView,
  setVsInitialTab,
  setVsInitialCategory,
  fixPath,
  POKEDEX
}) => {
  const [selectedRoute, setSelectedRoute] = React.useState(null);
  const [selectedPoke, setSelectedPoke] = React.useState(null);
  const [selectedDrop, setSelectedDrop] = React.useState(null);

  const isRouteUnlocked = (route) => checkRouteUnlocked(route, gameState);

  // Sincroniza a rota selecionada se os dados globais mudarem (ex: starters spotted)
  React.useEffect(() => {
    if (selectedRoute && ROUTES[selectedRoute.id]) {
      // Só atualiza se houver mudança real nos inimigos (ex: starters adicionados)
      const latest = ROUTES[selectedRoute.id];
      if (JSON.stringify(latest.enemies) !== JSON.stringify(selectedRoute.enemies)) {
        setSelectedRoute({ id: selectedRoute.id, ...latest });
      }
    }
  }, [ROUTES, selectedRoute]);

  const getDropIcon = (id) => {
    const map = {
      'pokeballs': 'poke-ball',
      'great_ball': 'great-ball',
      'ultra_ball': 'ultra-ball',
      'normal_essence': 'silk-scarf',
      'fire_essence': 'fire-stone',
      'water_essence': 'water-stone',
      'grass_essence': 'leaf-stone',
      'electric_essence': 'thunder-stone',
      'ice_essence': 'never-melt-ice',
      'fighting_essence': 'black-belt',
      'poison_essence': 'poison-barb',
      'ground_essence': 'soft-sand',
      'flying_essence': 'sharp-beak',
      'psychic_essence': 'twisted-spoon',
      'bug_essence': 'silver-powder',
      'rock_essence': 'hard-stone',
      'ghost_essence': 'spell-tag',
      'dragon_essence': 'dragon-fang',
      'steel_essence': 'metal-coat',
      'fairy_essence': 'pixie-plate',
      'dark_essence': 'black-glasses'
    };
    const itemName = map[id] || 'mystery-egg';
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`;
  };

  const getRouteDrops = (route) => {
    if (!route || !route.enemies) return [];
    const drops = new Set();
    
    // Pokéballs drop em todas as rotas de farm agora
    if (route.type === 'farm') {
      drops.add('pokeballs');
    }

    route.enemies.forEach(e => {
      if (e.drop) drops.add(e.drop);
      
      // Fallback: se o inimigo tem um tipo, ele dropa a essência correspondente
      if (POKEDEX) {
        const pData = POKEDEX[e.id];
        if (pData) {
          const types = pData.types || (pData.type ? [pData.type] : []);
          types.forEach(t => {
            if (t) drops.add(`${t.toLowerCase()}_essence`);
          });
        }
      }
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
      'viridian_forest_cleared': 'Vencer o Recruta Rocket na Floresta',
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

  const isRequirementMet = (req) => {
    if (req === 'has_starter') return (gameState.team?.length || 0) > 0;
    if (req.includes('_badge')) {
      const badgeId = {
        'boulder_badge': 1, 'cascade_badge': 2, 'thunder_badge': 3,
        'rainbow_badge': 4, 'soul_badge': 5, 'marsh_badge': 6,
        'volcano_badge': 7, 'earth_badge': 8
      }[req];
      return gameState.badges?.includes(badgeId);
    }
    return (gameState.worldFlags || []).includes(req);
  };

  const handleRequirementClick = (req) => {
    // Se já completou, não precisa ir mais
    if (isRequirementMet(req)) return;

    if (req.includes('_badge')) {
      if (setVsInitialTab) setVsInitialTab('gyms');
      setCurrentView('vs');
      setSelectedRoute(null);
    } else if (req.includes('rival_') || req.includes('rocket_hideout') || req.includes('silph_co') || req.includes('tower_cleared') || req === 'viridian_forest_cleared') {
      if (setVsInitialTab) setVsInitialTab('challenges');
      if (setVsInitialCategory) {
        if (req === 'viridian_forest_cleared' || req.includes('rocket_hideout') || req.includes('silph_co')) {
          setVsInitialCategory('rocket');
        } else if (req.includes('rival_')) {
          setVsInitialCategory('rival');
        }
      }
      setCurrentView('vs');
      setSelectedRoute(null);
    } else if (req === 'has_starter') {
      setCurrentView('city');
      setSelectedRoute(null);
    } else if (req.includes('_cleared')) {
      const routeMap = {
        'viridian_forest_cleared': 'viridian_forest',
        'mt_moon_cleared': 'mt_moon',
        'rock_tunnel_cleared': 'rock_tunnel',
        'mansion_cleared': 'pokemon_mansion'
      };
      const targetId = routeMap[req];
      if (targetId && ROUTES[targetId]) {
        if (checkRouteUnlocked(ROUTES[targetId], gameState)) {
          setSelectedRoute({ id: targetId, ...ROUTES[targetId] });
        }
      }
    }
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
                                 <span className="text-lg">=</span>
                               </div>
                             )}
                           </div>
                           <div className="text-left">
                             <h3 className="text-lg font-black text-slate-800 uppercase italic leading-none">{route.name}</h3>
                             {/* Preview de Encounters e Drops removido a pedido do usuário */}
                            </div>

                             <div className="flex items-center gap-2 mt-1.5">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${unlocked ? 'bg-green-100 text-green-600 border-green-200' : 'bg-red-100 text-red-600 border-red-200'}`}>
                                  {unlocked ? 'Disponível' : 'Bloqueado'}
                                </span>
                             </div>
                           </div>

                         {isCurrent && (
                           <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-pokeBlue"></div>
                         )}
                         <div className="text-xl opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all">=</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
      </div>
      {selectedRoute && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',        // ← centralizado verticalmente
          justifyContent: 'center',
          padding: '16px',
        }}>

          {/* Container interno — largura total */}
          <div style={{
            width: '100%',
            maxWidth: '430px',
            maxHeight: '85vh',
            background: 'white',
            borderRadius: '24px',      // ← bordas em todos os lados
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}>
            {/* Header */}
            <div style={{
              padding: '16px 20px 12px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{display:'flex', flexDirection:'column'}}>
                <h3 style={{fontSize:'16px', fontWeight:900, textTransform:'uppercase', fontStyle:'italic', color:'#1e293b', margin:0}}>
                  {selectedRoute.name}
                </h3>
                <span style={{
                  fontSize:'10px', 
                  fontWeight:900, 
                  textTransform:'uppercase', 
                  letterSpacing:'1px',
                  color: isRouteUnlocked(selectedRoute) ? '#22c55e' : '#ef4444'
                }}>
                  {isRouteUnlocked(selectedRoute) ? 'Liberada' : 'Bloqueada'}
                </span>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                style={{
                  width:'32px', height:'32px', borderRadius:'50%',
                  background:'#f1f5f9', border:'none',
                  fontSize:'14px', fontWeight:900,
                  cursor:'pointer', color:'#64748b',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Conteúdo com scroll */}
            <div style={{flex:1, overflowY:'auto', padding:'16px 20px'}} className="custom-scrollbar">
              <div style={{height:'160px', position:'relative', borderRadius:'20px', overflow:'hidden', marginBottom:'20px', flexShrink:0}}>
                <img src={fixPath(selectedRoute.background)} style={{width:'100%', height:'100%', objectCover:'cover'}} alt="" />
                <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(255,255,255,0.2), transparent)'}}></div>
              </div>

              <p style={{fontSize:'11px', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'20px', fontStyle:'italic'}}>
                {selectedRoute.description || 'Uma área de treinamento em Kanto.'}
              </p>

              {!isRouteUnlocked(selectedRoute) && (
                <div style={{background:'#fef2f2', border:'2px solid #fee2e2', borderRadius:'20px', padding:'16px', marginBottom:'20px'}}>
                  <h4 style={{fontSize:'10px', fontWeight:900, color:'#f87171', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px', display:'flex', alignItems:'center', gap:'8px'}}>
                    <span>🔒</span> Requisitos Necessários
                  </h4>
                  <ul style={{display:'flex', flexDirection:'column', gap:'8px', listStyle:'none', padding:0, margin:0}}>
                    {selectedRoute.requirements.map(req => {
                      const met = isRequirementMet(req);
                      return (
                        <li key={req} 
                          onClick={() => handleRequirementClick(req)}
                          style={{
                            fontSize:'12px', fontWeight:700, display:'flex', alignItems:'center', gap:'8px', fontStyle:'italic', 
                            padding:'8px', borderRadius:'12px', transition:'all 0.2s',
                            color: met ? '#166534' : '#b91c1c',
                            background: met ? 'rgba(240,253,244,0.5)' : 'transparent',
                            cursor: met ? 'default' : 'pointer'
                          }}
                        >
                          <div style={{
                            width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', shadow:'0 1px 2px rgba(0,0,0,0.05)',
                            background: met ? '#dcfce7' : '#fee2e2',
                            color: met ? '#16a34a' : '#ef4444'
                          }}>
                            {met ? '✓' : '×'}
                          </div>
                          <span style={{flex:1}}>{formatRequirement(req)}</span>
                          {met ? (
                            <span style={{fontSize:'8px', fontWeight:900, textTransform:'uppercase', background:'#bbf7d0', px:'8px', py:'2px', borderRadius:'8px'}}>OK</span>
                          ) : (
                            <span style={{fontSize:'8px', fontWeight:900, textTransform:'uppercase', opacity:0.4}}>Ir para →</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
                {/* ENCONTROS */}
                <div style={{background:'#f8fafc', borderRadius:'20px', padding:'16px', border:'2px solid #f1f5f9'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                    <h4 style={{fontSize:'10px', fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1.5px', fontStyle:'italic', margin:0}}>Pokémons na Área</h4>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'12px'}}>
                    {selectedRoute.enemies?.slice(0, 12).map(p => {
                      const caught = gameState.caughtData?.[p.id];
                      return (
                        <button 
                          key={p.id} 
                          onClick={() => setSelectedPoke(p)}
                          style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', background:'none', border:'none', padding:0}}>
                          <div style={{
                            width:'52px', height:'52px', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s',
                            background: caught ? 'white' : 'rgba(241,245,249,0.5)',
                            boxShadow: caught ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                            border: caught ? '1px solid #f1f5f9' : 'none'
                          }}>
                            <img 
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} 
                              style={{
                                width:'44px', height:'44px', objectFit:'contain', transition:'all 0.2s',
                                filter: caught ? 'none' : 'brightness(0) opacity(0.1)'
                              }} 
                              alt={caught ? p.name : '???'}
                            />
                            {!caught && <span style={{position:'absolute', fontSize:'12px', opacity:0.2, fontWeight:900}}>?</span>}
                          </div>
                          <span style={{
                            fontSize:'8px', fontWeight:900, textTransform:'uppercase', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:'100%', textAlign:'center',
                            color: caught ? '#475569' : '#cbd5e1'
                          }}>
                             {caught ? POKEDEX[p.id]?.name : '???'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DROPS */}
                <div style={{background:'#f8fafc', borderRadius:'20px', padding:'16px', border:'2px solid #f1f5f9'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                    <h4 style={{fontSize:'10px', fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'1.5px', fontStyle:'italic', margin:0}}>Materiais & Drops</h4>
                  </div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                     {getRouteDrops(selectedRoute).map(drop => (
                      <button 
                        key={drop} 
                        onClick={() => setSelectedDrop(drop)}
                        style={{
                          background:'white', padding:'8px 12px', borderRadius:'12px', shadow:'0 1px 2px rgba(0,0,0,0.05)', border:'1px solid #f1f5f9', cursor:'pointer',
                          display:'flex', alignItems:'center', gap:'8px', transition:'all 0.2s'
                        }}>
                        <img src={getDropIcon(drop)} style={{width:'20px', height:'20px', objectFit:'contain'}} alt={drop} />
                        <span style={{fontSize:'9px', fontWeight:900, color:'#475569', textTransform:'uppercase', fontStyle:'italic'}}>{drop.replace('_essence', '').replace('_', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer com botão */}
            <div style={{padding:'12px 20px 20px 20px', borderTop:'1px solid #f1f5f9', flexShrink:0}}>
              {isRouteUnlocked(selectedRoute) ? (
                <button 
                  onClick={() => {
                    setGameState(prev => ({ ...prev, currentRoute: selectedRoute.id }));
                    setCurrentEnemy(null);
                    setCurrentView('battles');
                    setSelectedRoute(null);
                  }}
                  style={{
                    width:'100%', padding:'16px',
                    borderRadius:'16px', background:'#2563eb',
                    color:'white', fontWeight:900, fontSize:'15px',
                    textTransform:'uppercase', letterSpacing:'1px',
                    border:'none', cursor:'pointer',
                    boxShadow:'0 4px 12px rgba(37,99,235,0.3)',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'12px'
                  }}
                >
                  <span style={{fontSize:'20px'}}>⚔️</span>
                  Começar Treino
                </button>
              ) : (
                <button 
                  disabled
                  style={{
                    width:'100%', padding:'16px',
                    borderRadius:'16px', background:'#94a3b8',
                    color:'white', fontWeight:900, fontSize:'15px',
                    textTransform:'uppercase', letterSpacing:'1px',
                    border:'none', cursor:'not-allowed', opacity:0.5
                  }}
                >Caminho Bloqueado</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhado do Pokémon */}
      {selectedPoke && (
        <div className="absolute inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-y-auto max-h-[85vh] animate-bounceIn relative custom-scrollbar">
              <div 
                className="h-48 w-full flex items-center justify-center relative overflow-hidden transition-all duration-500"
                style={{ 
                  background: selectedPoke && POKEDEX[selectedPoke.id]?.types 
                    ? `linear-gradient(135deg, ${TYPE_COLOR_HEX[POKEDEX[selectedPoke.id].types[0]]}aa 0%, ${TYPE_COLOR_HEX[POKEDEX[selectedPoke.id].types[1] || POKEDEX[selectedPoke.id].types[0]]}aa 100%)` 
                    : '#f8fafc' 
                }}
              >
                  {/* Grandes Ícones Decorativos */}
                  {POKEDEX[selectedPoke.id]?.types?.map((t, idx) => (
                    <img 
                      key={idx}
                      src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.toLowerCase()}.svg`}
                      className={`absolute w-44 h-44 opacity-10 pointer-events-none ${idx === 0 ? '-left-10 -top-10 rotate-12' : '-right-10 -bottom-10 -rotate-12'}`} 
                      alt="" 
                    />
                  ))}

                  {/* Badges de Tipo no Header */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-20">
                     {POKEDEX[selectedPoke.id]?.types?.map(t => (
                        <div key={t} className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 shadow-sm animate-fadeIn">
                           <img 
                             src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.toLowerCase()}.svg`} 
                             className="w-3.5 h-3.5 invert" 
                             alt="" 
                           />
                           <span className="text-[10px] font-black text-white uppercase tracking-tighter">{t}</span>
                        </div>
                     ))}
                  </div>

                  <button 
                    onClick={() => setSelectedPoke(null)}
                    className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center z-20 font-black hover:bg-white/40 transition-all border border-white/30"
                  ></button>

                  <img 
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPoke.id}.png`} 
                    className={`h-40 object-contain relative z-10 transition-all ${gameState.caughtData?.[selectedPoke.id] ? 'scale-110 drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]' : 'brightness-0 opacity-30 grayscale blur-[2px]'}`} 
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
        <div className="absolute inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-bounceIn relative max-h-[85vh] flex flex-col">
              <button 
                onClick={() => setSelectedDrop(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center z-20 font-black hover:bg-red-50 hover:text-red-500 transition-all"
              ></button>

              <div className="p-10 flex-1 overflow-y-auto custom-scrollbar pt-12">
                  <div className="flex items-center gap-5 bg-pokeBlue/5 p-6 rounded-[2.5rem] border-2 border-pokeBlue/10 mb-10">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 rotate-6">
                       <img src={getDropIcon(selectedDrop)} className="w-12 h-12 object-contain" alt={selectedDrop} />
                    </div>
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

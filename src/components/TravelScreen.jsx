import React from 'react';
import { createPortal } from 'react-dom';
import { isRouteUnlocked as checkRouteUnlocked, getSortedRoutes, inferRouteRegion } from '../data/routes';
import { CRAFTING_RECIPES } from '../data/recipes';

const EVOLUTION_FRAGMENT_DROPS = {
  4: 'fire_stone_shard', 5: 'fire_stone_shard', 6: 'fire_stone_shard', 37: 'fire_stone_shard', 58: 'fire_stone_shard', 77: 'fire_stone_shard', 126: 'fire_stone_shard',
  7: 'water_stone_shard', 8: 'water_stone_shard', 9: 'water_stone_shard', 60: 'water_stone_shard', 61: 'water_stone_shard', 90: 'water_stone_shard', 120: 'water_stone_shard',
  1: 'leaf_stone_shard', 2: 'leaf_stone_shard', 3: 'leaf_stone_shard', 43: 'leaf_stone_shard', 69: 'leaf_stone_shard', 70: 'leaf_stone_shard', 102: 'leaf_stone_shard',
  25: 'thunder_stone_shard', 26: 'thunder_stone_shard', 81: 'thunder_stone_shard', 82: 'thunder_stone_shard', 100: 'thunder_stone_shard', 101: 'thunder_stone_shard', 125: 'thunder_stone_shard',
  29: 'moon_stone_shard', 30: 'moon_stone_shard', 32: 'moon_stone_shard', 33: 'moon_stone_shard', 35: 'moon_stone_shard', 36: 'moon_stone_shard', 39: 'moon_stone_shard', 40: 'moon_stone_shard',
  63: 'link_cable_part', 64: 'link_cable_part', 66: 'link_cable_part', 67: 'link_cable_part', 74: 'link_cable_part', 75: 'link_cable_part', 92: 'link_cable_part', 93: 'link_cable_part',
  191: 'sun_stone_shard', 192: 'sun_stone_shard', 44: 'sun_stone_shard',
  176: 'shiny_stone_shard', 315: 'shiny_stone_shard', 406: 'shiny_stone_shard',
  198: 'dusk_stone_shard', 200: 'dusk_stone_shard', 429: 'dusk_stone_shard', 430: 'dusk_stone_shard',
  281: 'dawn_stone_shard', 475: 'dawn_stone_shard', 478: 'dawn_stone_shard',
  361: 'ice_stone_shard', 459: 'ice_stone_shard', 460: 'ice_stone_shard',
};

const RECIPE_FRAGMENT_DROPS = {
  52: 'recipe_amulet_coin',
  53: 'recipe_amulet_coin',
  81: 'recipe_magnet',
  82: 'recipe_magnet',
  58: 'recipe_charcoal',
  59: 'recipe_charcoal',
  60: 'recipe_mystic_water',
  61: 'recipe_mystic_water',
  62: 'recipe_mystic_water',
  66: 'recipe_black_belt',
  67: 'recipe_black_belt',
  123: 'recipe_quick_claw',
  113: 'recipe_lucky_egg',
  92: 'recipe_cleanse_tag',
  93: 'recipe_cleanse_tag',
};
import { TYPE_COLOR_HEX } from '../data/gyms';
import { TIME_CONFIG, getTimeOfDay, getTimeAdjustedEnemyPool } from '../utils/timeSystem';
import { hasProgressRequirement } from '../utils/progress';

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
  setVsInitialRegion,
  switchRegion,
  fixPath,
  POKEDEX
}) => {
  const [selectedRoute, setSelectedRoute] = React.useState(null);
  const [selectedPoke, setSelectedPoke] = React.useState(null);
  const [selectedDrop, setSelectedDrop] = React.useState(null);
  const routeRegionTab = gameState.activeRegion || 'kanto';
  const isJohtoRoute = (route) => inferRouteRegion(route?.id, route?.group).id === 'johto';
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [activePeriodTab, setActivePeriodTab] = React.useState(null);
  
  const setRouteRegionTab = (region) => {
    if (switchRegion) switchRegion(region);
  };

  // Define o período inicial baseado no tempo atual ao abrir o modal
  React.useEffect(() => {
    if (selectedRoute && !activePeriodTab) {
      setActivePeriodTab(getTimeOfDay());
    } else if (!selectedRoute) {
      setActivePeriodTab(null);
    }
  }, [selectedRoute]);

  const isRouteUnlocked = (route) => checkRouteUnlocked(route, gameState);
  const kantoChampion = (gameState.worldFlags || []).includes('champion');
  const johtoStarted = (gameState.worldFlags || []).includes('johto_started');
  const johtoChampion = (gameState.worldFlags || []).includes('johto_champion');
  const hoennChampion = (gameState.worldFlags || []).includes('hoenn_champion');
  const sinnohStarted = (gameState.worldFlags || []).includes('sinnoh_started');
  const sortedRoutes = React.useMemo(() => getSortedRoutes(ROUTES), [ROUTES]);

  const visibleRouteEntries = React.useMemo(() => {
    return sortedRoutes.filter(route => {
      // Filtrar apenas rotas da região ativa (Kanto, Johto, Hoenn)
      if (routeRegionTab === 'kanto' && route._region.id !== 'kanto') return false;
      if (routeRegionTab === 'johto' && route._region.id !== 'johto') return false;
      if (routeRegionTab === 'hoenn' && route._region.id !== 'hoenn') return false;
      if (routeRegionTab === 'sinnoh' && route._region.id !== 'sinnoh') return false;
      return true;
    });
  }, [sortedRoutes, routeRegionTab]);

  React.useEffect(() => {
    if (!kantoChampion && routeRegionTab === 'johto') setRouteRegionTab('kanto');
    if (!johtoChampion && routeRegionTab === 'hoenn') setRouteRegionTab(kantoChampion ? 'johto' : 'kanto');
    if (!hoennChampion && routeRegionTab === 'sinnoh') setRouteRegionTab(johtoChampion ? 'hoenn' : kantoChampion ? 'johto' : 'kanto');
  }, [kantoChampion, johtoChampion, hoennChampion, routeRegionTab]);

  React.useEffect(() => {
    if (johtoStarted && kantoChampion && gameState.currentRoute) {
      const current = sortedRoutes.find(r => r.id === gameState.currentRoute);
      if (current) {
        if (current._region.id === 'johto') setRouteRegionTab('johto');
        if (current._region.id === 'hoenn') setRouteRegionTab('hoenn');
        if (current._region.id === 'sinnoh') setRouteRegionTab('sinnoh');
      }
    }
  }, [kantoChampion, johtoStarted, gameState.currentRoute, sortedRoutes]);

  // ===== PRELOADER DE BACKGROUND DA ROTA =====
  React.useEffect(() => {
    if (selectedRoute?.background) {
      const img = new Image();
      img.src = fixPath(selectedRoute.background);
    }
  }, [selectedRoute, fixPath]);
  const periodOrder = ['morning', 'day', 'evening', 'night'];
  const periodHours = {
    morning: '05:00 - 09:59',
    day: '10:00 - 16:59',
    evening: '17:00 - 19:59',
    night: '20:00 - 04:59',
  };
  const periodIcons = {
    morning: '🌅',
    day: '☀️',
    evening: '🌆',
    night: '🌙',
  };

  const getRouteEncountersByPeriod = (route) => {
    return periodOrder.map(period => {
      return {
        id: period,
        label: TIME_CONFIG[period]?.label || period,
        hours: periodHours[period],
        icon: periodIcons[period],
        encounters: getTimeAdjustedEnemyPool(route, period, POKEDEX, { preview: true }),
      };
    });
  };

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
      'fire_stone_shard': 'fire-stone',
      'water_stone_shard': 'water-stone',
      'leaf_stone_shard': 'leaf-stone',
      'thunder_stone_shard': 'thunder-stone',
      'moon_stone_shard': 'moon-stone',
      'link_cable_part': 'up-grade',
      'recipe_amulet_coin': 'amulet-coin',
      'recipe_magnet': 'magnet',
      'recipe_charcoal': 'charcoal',
      'recipe_mystic_water': 'mystic-water',
      'recipe_black_belt': 'black-belt',
      'recipe_quick_claw': 'quick-claw',
      'recipe_lucky_egg': 'lucky-egg',
      'recipe_cleanse_tag': 'cleanse-tag',
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
      if (EVOLUTION_FRAGMENT_DROPS[Number(e.id)]) drops.add(EVOLUTION_FRAGMENT_DROPS[Number(e.id)]);
      if (RECIPE_FRAGMENT_DROPS[Number(e.id)]) drops.add(RECIPE_FRAGMENT_DROPS[Number(e.id)]);
      
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
      'rival_pokemon_tower_defeated': 'Derrotar o Rival na Torre Pokemon',
      'rival_silph_defeated': 'Derrotar o Rival na Silph Co.',
      'rival_3_defeated': 'Derrotar o Rival no S.S. Anne',
      'rock_tunnel_cleared': 'Atravessar o Rock Tunnel',
      'pokemon_tower_cleared': 'Libertar a Torre Pokémon',
      'rocket_hideout_cleared': 'Destruir o QG da Equipe Rocket',
      'silph_co_cleared': 'Salvar a Silph Co.',
      'mansion_cleared': 'Explorar a Mansão Pokémon',
      'champion': 'Tornar-se o Campeão da Liga Pokémon',
      'johto_started': 'Iniciar a jornada em Johto',
      'johto_route_29_cleared': 'Explorar a Rota 29',
      'johto_slowpoke_well_cleared': 'Salvar o Poco Slowpoke',
      'zephyr_badge': 'Insignia Zephyr (Falkner)',
      'hive_badge': 'Insignia Hive (Bugsy)',
      'plain_badge': 'Insignia Plain (Whitney)',
      'fog_badge': 'Insignia Fog (Morty)',
      'storm_badge': 'Insignia Storm (Chuck)',
      'mineral_badge': 'Insignia Mineral (Jasmine)',
      'johto_rocket_radio_cleared': 'Salvar a Radio Tower',
      'glacier_badge': 'Insignia Glacier (Pryce)',
      'rising_badge': 'Insignia Rising (Clair)',
      'johto_rival_victory_defeated': 'Derrotar o Rival na Victory Road',
      'johto_rival_1_defeated': 'Derrotar o Rival em Cherrygrove',
      'johto_rival_azalea_defeated': 'Vencer o Rival em Azalea',
      'johto_rival_ecruteak_defeated': 'Vencer o Rival na Torre Queimada',
      'johto_rocket_mahogany_cleared': 'Limpar a Base Rocket em Mahogany',
      'johto_rival_tunnel_defeated': 'Vencer o Rival no Tunel de Goldenrod',
      'johto_champion': 'Vencer a Liga de Johto',
      'hoenn_champion': 'Vencer a Liga de Hoenn',
      'sinnoh_started': 'Iniciar a jornada em Sinnoh',
      'sinnoh_route_201_cleared': 'Treinar na Rota 201',
      'sinnoh_route_202_cleared': 'Treinar na Rota 202',
      'sinnoh_route_203_cleared': 'Treinar na Rota 203',
      'sinnoh_route_204_cleared': 'Treinar na Rota 204',
      'sinnoh_eterna_forest_cleared': 'Explorar Eterna Forest',
      'sinnoh_route_209_cleared': 'Treinar na Rota 209',
      'sinnoh_valor_lakefront_cleared': 'Treinar em Valor Lakefront',
      'sinnoh_mt_coronet_cleared': 'Explorar Mt. Coronet',
      'sinnoh_snowpoint_cleared': 'Treinar em Snowpoint',
      'sinnoh_sunyshore_cleared': 'Treinar em Sunyshore',
      'sinnoh_victory_training_cleared': 'Treinar na Victory Road',
      'sinnoh_survival_area_cleared': 'Treinar na Survival Area'
    };
    return map[req] || req;
  };

  const isRequirementMet = (req) => {
    return hasProgressRequirement(gameState, req);
  };

  const handleRequirementClick = (req) => {
    // Se já completou, não precisa ir mais
    if (isRequirementMet(req)) return;

    const johtoBadges = ['zephyr_badge', 'hive_badge', 'plain_badge', 'fog_badge', 'storm_badge', 'mineral_badge', 'glacier_badge', 'rising_badge'];
    if (johtoBadges.includes(req)) {
      if (setVsInitialTab) setVsInitialTab('gyms');
      if (setVsInitialCategory) setVsInitialCategory('johto');
      if (setVsInitialRegion) setVsInitialRegion('johto');
      setCurrentView('vs');
      setSelectedRoute(null);
    } else if (req.includes('_badge')) {
      if (setVsInitialTab) setVsInitialTab('gyms');
      setCurrentView('vs');
      setSelectedRoute(null);
    } else if (req === 'sinnoh_started') {
      setCurrentView('city');
      setSelectedRoute(null);
    } else if (req === 'hoenn_champion') {
      if (setVsInitialTab) setVsInitialTab('gyms');
      if (setVsInitialCategory) setVsInitialCategory('hoenn');
      if (setVsInitialRegion) setVsInitialRegion('hoenn');
      setCurrentView('vs');
      setSelectedRoute(null);
    } else if (req.includes('johto_')) {
      if (req.includes('rival_') || req.includes('rocket_')) {
        if (setVsInitialTab) setVsInitialTab('challenges');
        if (setVsInitialCategory) setVsInitialCategory(req.includes('rival_') ? 'rival' : 'rocket');
        if (setVsInitialRegion) setVsInitialRegion('johto');
        setCurrentView('vs');
      } else if (req.includes('_badge') || req.includes('gym_') || req.includes('clear')) {
        if (setVsInitialTab) setVsInitialTab('gyms');
        if (setVsInitialCategory) setVsInitialCategory('johto');
        if (setVsInitialRegion) setVsInitialRegion('johto');
        setCurrentView('vs');
      } else if (req === 'johto_started') {
        setCurrentView('city');
      } else {
        if (setVsInitialTab) setVsInitialTab('gyms');
        if (setVsInitialRegion) setVsInitialRegion('johto');
        setCurrentView('vs');
      }
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
         <div className="grid grid-cols-4 gap-2 mt-4">
             {[
               { id: 'kanto', label: 'Kanto', available: true },
               { id: 'johto', label: 'Johto', available: kantoChampion },
               { id: 'hoenn', label: 'Hoenn', available: johtoChampion },
               { id: 'sinnoh', label: 'Sinnoh', available: hoennChampion && sinnohStarted },
               { id: 'unova', label: 'Unova', available: (gameState.worldFlags || []).includes('unova_started') || (gameState.worldFlags || []).includes('sinnoh_champion') },
               { id: 'kalos', label: 'Kalos', available: (gameState.worldFlags || []).includes('kalos_started') || (gameState.worldFlags || []).includes('unova_champion') },
               { id: 'alola', label: 'Alola', available: (gameState.worldFlags || []).includes('alola_started') || (gameState.worldFlags || []).includes('kalos_champion') },
               { id: 'galar', label: 'Galar', available: (gameState.worldFlags || []).includes('galar_started') || (gameState.worldFlags || []).includes('alola_champion') },
               { id: 'paldea', label: 'Paldea', available: (gameState.worldFlags || []).includes('paldea_started') || (gameState.worldFlags || []).includes('galar_champion') },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => {
                   if (!tab.available) return;
                   setRouteRegionTab(tab.id);
                   setSelectedRoute(null);
                 }}
                 disabled={!tab.available}
                 className={`min-h-[40px] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   routeRegionTab === tab.id
                     ? 'bg-pokeBlue text-white shadow-lg'
                     : tab.available
                       ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                       : 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-70'
                 }`}
               >
                 {tab.label}
               </button>
             ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex flex-col gap-8 pb-8">
            {(() => {
              const sequentialGroups = [];
              visibleRouteEntries
                .filter(r => r.type !== 'city' && r.type !== 'gym')
                .forEach(r => {
                  const groupName = r.group || 'Outras Rotas';
                  if (sequentialGroups.length > 0 && sequentialGroups[sequentialGroups.length - 1].name === groupName) {
                    sequentialGroups[sequentialGroups.length - 1].routes.push(r);
                  } else {
                    sequentialGroups.push({ name: groupName, routes: [r] });
                  }
                });

              return sequentialGroups.map(({ name, routes }, gIdx) => (
                <div key={`${name}-${gIdx}`} className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-2">
                     <div className="h-[2px] flex-1 bg-slate-200"></div>
                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full border-2 border-slate-200">{name}</h3>
                     <div className="h-[2px] flex-1 bg-slate-200"></div>
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {routes.map((route) => {
                    const id = route.id;
                    const unlocked = isRouteUnlocked(route);
                    const isCurrent = gameState.currentRoute === id;
                    
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
                             <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${unlocked ? 'bg-green-100 text-green-600 border-green-200' : 'bg-red-100 text-red-600 border-red-200'}`}>
                                  {unlocked ? 'Disponível' : 'Bloqueado'}
                                </span>
                                {route.enemies && route.enemies.length > 0 ? (
                                  <span className="text-[8px] font-black px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-500 border border-slate-200">
                                    Nível: {Math.min(...route.enemies.map(e => e.level || 0))} - {Math.max(...route.enemies.map(e => e.level || 0))}
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-black px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-400 border border-slate-200">
                                    Cidade / Ponto de Descanso
                                  </span>
                                )}
                             </div>
                           </div>
                         </div>

                         {isCurrent && (
                            <div className="absolute right-0 top-0 bottom-0 w-2 bg-pokeBlue flex items-center justify-center">
                              <span className="text-white text-[7px] font-black uppercase [writing-mode:vertical-lr] tracking-widest">Treinando Aqui</span>
                            </div>
                         )}
                         <div className="text-xl opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all">›</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          })()}
          </div>
      </div>
           {/* Modal de Detalhes da Rota */}
      {selectedRoute && typeof document !== 'undefined' && createPortal((
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-[400px] md:max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-bounceIn" style={{ maxHeight: '94dvh' }}>
            <div className="overflow-y-auto custom-scrollbar flex-1">
            <div className="h-36 sm:h-40 relative flex-shrink-0">
              <img src={fixPath(selectedRoute.background)} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              <button 
                onClick={() => setSelectedRoute(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-30"
              >x</button>
            </div>

            <div className="p-5 sm:p-8 -mt-8 sm:-mt-10 relative z-10">
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
                    {selectedRoute.requirements.map(req => {
                      const met = isRequirementMet(req);
                      return (
                        <li key={req} 
                          onClick={() => handleRequirementClick(req)}
                          className={`text-xs font-bold flex items-center gap-2 italic p-2 rounded-xl transition-all ${met ? 'text-green-600 bg-green-50/50' : 'text-red-600 hover:bg-red-100/50 cursor-pointer'}`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm ${met ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {met ? '✓' : '→'}
                          </div>
                          <span className="flex-1">{formatRequirement(req)}</span>
                          {met ? (
                            <span className="text-[8px] font-black uppercase bg-green-200 px-2 py-0.5 rounded-lg">OK</span>
                          ) : (
                            <span className="text-[8px] font-black uppercase opacity-40">Ir para →</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-5 mb-5">
                {/* ENCONTROS */}
                <div className="bg-slate-50 rounded-3xl p-5 border-2 border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Pokémons na Área</h4>
                    <span className="text-[9px] font-bold text-slate-400 italic">Toque para detalhes</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {/* Tabs de Período */}
                    <div className="flex p-1 bg-slate-200/50 rounded-2xl gap-1">
                      {getRouteEncountersByPeriod(selectedRoute).map(period => (
                        <button
                          key={period.id}
                          onClick={() => setActivePeriodTab(period.id)}
                          className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all ${
                            activePeriodTab === period.id 
                              ? 'bg-white shadow-md scale-[1.02] text-slate-800' 
                              : 'text-slate-400 hover:bg-white/30'
                          }`}
                        >
                          <span className="text-sm leading-none mb-1">{period.icon}</span>
                          <span className="text-[7px] font-black uppercase tracking-tighter">{period.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Conteúdo da Aba Ativa */}
                    {getRouteEncountersByPeriod(selectedRoute)
                      .filter(p => p.id === activePeriodTab)
                      .map(period => (
                        <div key={period.id} className="bg-white rounded-3xl border-2 border-slate-100 p-4 shadow-sm animate-fadeIn">
                          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner">
                                 <span className="text-xl leading-none">{period.icon}</span>
                              </div>
                              <div>
                                <p className="text-[11px] font-black text-slate-700 uppercase italic leading-none">{period.label}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{period.hours}</p>
                              </div>
                            </div>
                            {period.id === 'night' && (
                              <span className="text-[8px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100 animate-pulse">
                                extras noturnos
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {period.encounters.slice(0, 16).map(p => {
                              const caught = gameState.caughtData?.[p.id];
                              const name = POKEDEX[p.id]?.name || p.name || 'Pokemon';
                              return (
                                <button
                                  key={`${period.id}-${p.id}`}
                                  onClick={() => setSelectedPoke(p)}
                                  className="relative group/poke flex flex-col items-center gap-1.5 min-h-[82px]"
                                >
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${caught ? 'bg-slate-50 shadow-inner border border-slate-100 group-hover/poke:border-pokeBlue' : 'bg-slate-100/50'}`}>
                                    <img
                                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                                      className={`w-12 h-12 object-contain transition-all ${caught ? 'group-hover/poke:scale-125' : 'brightness-0 opacity-10'}`}
                                      alt={caught ? name : '???'}
                                      loading="lazy"
                                    />
                                    {!caught && <span className="absolute text-xs opacity-20 font-black">?</span>}
                                  </div>
                                  <span className={`text-[8px] font-black uppercase truncate w-full text-center ${caught ? 'text-slate-600' : 'text-slate-300'}`}>
                                    {caught ? name : '???'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="hidden">
                    {selectedRoute.enemies?.slice(0, 12).map(p => {
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
                              loading="lazy"
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
                        <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover/drop:rotate-12 transition-transform`}>
                           <img src={getDropIcon(drop)} className="w-6 h-6 object-contain" alt={drop} />
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase italic leading-none">{drop.replace('_essence', '').replace('_', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Espaço extra para garantir que o scroll chegue ao fim */}
              <div className="h-5"></div>
            </div>
          </div>{/* fecha scroll */}

          {/* Footer Fixo — Padrão Mobile Premium com Margem de Segurança */}
          <div className="px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-slate-50 border-t-2 border-slate-100 flex-shrink-0 z-20">
            {isRouteUnlocked(selectedRoute) ? (
              <button 
                onClick={() => {
                  if (isJohtoRoute(selectedRoute)) {
                    const hasLocked = gameState.team.some(p => p.lockedUntilFlag && !(gameState.worldFlags || []).includes(p.lockedUntilFlag));
                    if (hasLocked) {
                      setAlertMessage("Você não pode viajar para Johto com Pokémon guardados pelo Prof. Elm. Guarde-os no PC antes de prosseguir!");
                      return;
                    }
                  }
                  setGameState(prev => ({ ...prev, currentRoute: selectedRoute.id }));
                  setCurrentEnemy(null);
                  setCurrentView('battles');
                  setSelectedRoute(null);
                }}
                className="w-full min-h-[54px] bg-pokeBlue text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 border-b-[3px] border-blue-800 flex items-center justify-center gap-3"
              >
                <span className="text-xl">⚔️</span>
                Começar Treino
              </button>
            ) : (
              <button 
                disabled
                className="w-full min-h-[54px] bg-slate-200 text-slate-400 py-3 rounded-xl font-black uppercase tracking-widest cursor-not-allowed border-b-[3px] border-slate-300"
              >Caminho Bloqueado</button>
            )}
          </div>
        </div>{/* fecha card */}
        </div>
      ), document.body)}

      {/* Modal Detalhado do Pokémon */}
      {selectedPoke && typeof document !== 'undefined' && createPortal((
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
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
                  >x</button>

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
      ), document.body)}

      {/* Modal de Detalhes do Drop */}
      {selectedDrop && typeof document !== 'undefined' && createPortal((
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-bounceIn relative max-h-[85vh] flex flex-col">
              <button 
                onClick={() => setSelectedDrop(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center z-20 font-black hover:bg-red-50 hover:text-red-500 transition-all"
              >x</button>

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
      ), document.body)}

      {/* Modal de Alerta Local */}
      {alertMessage && typeof document !== 'undefined' && createPortal((
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-8 animate-bounceIn text-center border-4 border-red-500">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-xl font-black text-slate-800 uppercase italic mb-4">Acesso Bloqueado</h3>
              <p className="text-sm font-bold text-slate-500 mb-8">{alertMessage}</p>
              <button 
                onClick={() => setAlertMessage(null)}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 active:scale-95 transition-all shadow-lg"
              >
                Entendi
              </button>
           </div>
        </div>
      ), document.body)}
    </div>
  );
};

export default TravelScreen;

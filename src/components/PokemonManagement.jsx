import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MOVE_TRANSLATIONS } from '../data/translations';
import { getCandyIconUrl, CANDY_FAMILIES, CANDY_USES, POKEMON_TO_CANDY } from '../data/candies';
import { getTimeOfDay } from '../utils/timeSystem';

import { GYM_LEVEL_CAPS } from '../data/constants';
import { getPokemonRegion, getUnlockedRegions, REGION_LABELS, REGION_CHAMPION_FLAGS, REGION_ORDER } from '../data/regionStandards';

const PokemonManagement = ({
  gameState,
  setGameState,
  activeTab,
  setActiveTab,
  activePokemonDetails,
  setActivePokemonDetails,
  POKEDEX,
  MOVES,
  NATURES,
  NATURE_LIST,
  getMasteryPath,
  addLog,
  setEvolutionPending,
  handleUseCandy,
  showConfirm,
  closeConfirm,
  setCurrentView,
  validateTeamAccess,
  activeRegion,
  isEvolutionAllowedForRegion,
  getEvolutionRegionLockMessage
}) => {
  const [candyExpanded, setCandyExpanded] = useState(false);
  const [dragTeamIndex, setDragTeamIndex] = useState(null);
  const [dragMoved, setDragMoved] = useState(false);
  const [pcSearch, setPcSearch] = useState('');
  const [pcSort, setPcSort] = useState('number');
  const [pcRegion, setPcRegion] = useState('all');
  const [showTeamReorder, setShowTeamReorder] = useState(false);
  const [moveSwapMode, setMoveSwapMode] = useState(null); // { activeIdx, currentMove }
  const activePokemonKey = activePokemonDetails
    ? `${activePokemonDetails.pokemon?.instanceId ?? activePokemonDetails.pokemon?.id ?? 'x'}_${activePokemonDetails.location}_${activePokemonDetails.index}`
    : null;

  useEffect(() => {
    setCandyExpanded(false);
  }, [activePokemonKey]);

  const getDexRegion = (id) => {
    return getPokemonRegion(id);
  };

  const availablePcRegions = (() => {
    // Calcula as regiões pelo número da Pokédex dos Pokémons no PC
    const regionsInPC = new Set(
      (gameState.pc || []).map(p => getDexRegion(p.id))
    );
    return [
      { id: 'all', label: 'Todas' },
      ...REGION_ORDER
        .filter(r => regionsInPC.has(r))
        .map(r => ({ id: r, label: REGION_LABELS[r] || r })),
    ];
  })();

  const translateMove = (moveName) => {
    if (!moveName) return '---';
    const key = String(moveName).toLowerCase();
    return MOVE_TRANSLATIONS[key] || moveName.replace(/-/g, ' ');
  };

  const normalizeMoveText = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const moveTranslationLookup = Object.entries(MOVE_TRANSLATIONS).reduce((acc, [key, label]) => {
    acc[normalizeMoveText(label)] = key;
    return acc;
  }, {});

  const moveNameLookup = Object.entries(MOVES).reduce((acc, [key, move]) => {
    acc[normalizeMoveText(move.name)] = key;
    return acc;
  }, {});

  const getMoveKey = (move) => {
    const rawName = typeof move === 'string' ? move : move?.name;
    const directKey = normalizeMoveText(rawName);
    return MOVES[directKey] ? directKey : moveTranslationLookup[directKey] || moveNameLookup[directKey] || directKey;
  };

  const getMoveData = (move) => {
    const key = getMoveKey(move);
    const base = MOVES[key] || {};
    const fallback = typeof move === 'object' && move ? move : {};
    return { ...fallback, ...base, name: fallback.name || base.name || (typeof move === 'string' ? move : '') };
  };

  const getMoveLabel = (move) => {
    const key = getMoveKey(move);
    const data = getMoveData(move);
    return MOVE_TRANSLATIONS[key] || data.name || translateMove(typeof move === 'string' ? move : move?.name);
  };

  const moveToPC = (index) => {
    if (gameState.team.length <= 1) {
      showConfirm({
        title: 'Ação Bloqueada',
        message: 'Você precisa de pelo menos um Pokémon no seu time principal!',
        onConfirm: closeConfirm
      });
      return;
    }
    setGameState(prev => {
      const poke = prev.team[index];
      const newTeam = prev.team.filter((_, i) => i !== index);
      const newPC = [...(prev.pc || []), poke];
      return { ...prev, team: newTeam, pc: newPC };
    });
    setActivePokemonDetails(null);
  };

  const moveToTeam = (index, instanceId) => {
    if (gameState.team.length >= 6) {
      showConfirm({
        title: 'Time Cheio',
        message: 'Seu time já possui o limite máximo de 6 Pokémon. Envie alguém para o PC primeiro!',
        onConfirm: closeConfirm
      });
      return;
    }
    // Lê o Pokémon pelo instanceId (mais seguro) ou pelo índice
    const poke = instanceId
      ? (gameState.pc.find(p => p.instanceId === instanceId) || gameState.pc[index])
      : gameState.pc[index];

    if (!poke) return;
    
    // Validação de Acesso Regional
    if (validateTeamAccess && !validateTeamAccess(poke, activeRegion)) {
      const isChampion = (gameState.worldFlags || []).includes(`region_champion_${activeRegion}`) || 
                        (gameState.worldFlags || []).includes(REGION_CHAMPION_FLAGS[activeRegion]);

      let reason = "Este Pokémon não pode ser usado nesta região no momento.";
      if (poke.level > (GYM_LEVEL_CAPS[activeRegion]?.[Object.values(GYM_LEVEL_CAPS[activeRegion]).length - 1] || 100)) {
         reason = "Nível muito alto para o seu limite atual de insígnias.";
      } else if (!isChampion && getDexRegion(poke.id) !== activeRegion && activeRegion !== 'kanto') {
         // Kanto permite tudo se for campeão, mas outras regiões podem ter restrições.
         // Mantemos a lógica de validateTeamAccess para o grosso das regras.
         // Se validateTeamAccess retornou falso, já parou acima.
      }

      showConfirm({
        title: 'Acesso Negado',
        message: `Regra Regional: ${reason}`,
        onConfirm: closeConfirm
      });
      return;
    }

    setGameState(prev => {
      // Identifica o Pokémon de forma segura dentro do callback (evita closure stale)
      const targetPoke = instanceId
        ? (prev.pc.find(p => p.instanceId === instanceId) || prev.pc[index])
        : prev.pc[index];
      if (!targetPoke) return prev;
      const newPC = instanceId
        ? prev.pc.filter(p => p.instanceId !== instanceId)
        : prev.pc.filter((_, i) => i !== index);
      const newTeam = [...prev.team, targetPoke];
      return { ...prev, team: newTeam, pc: newPC };
    });
    setActivePokemonDetails(null);
  };

  const moveToTeamPosition = (targetIndex) => {
    if (!activePokemonDetails || activePokemonDetails.location !== 'team') return;
    const currentIndex = activePokemonDetails.index;
    if (targetIndex === currentIndex) return;
    setGameState(prev => {
       const newTeam = [...prev.team];
       [newTeam[currentIndex], newTeam[targetIndex]] = [newTeam[targetIndex], newTeam[currentIndex]];
       return { ...prev, team: newTeam };
    });
    setActivePokemonDetails(prev => ({ ...prev, index: targetIndex }));
  };

  const reorderTeam = (fromIndex, toIndex) => {
    if (fromIndex === null || toIndex === null || fromIndex === toIndex) return;
    setGameState(prev => {
       const newTeam = [...prev.team];
       [newTeam[fromIndex], newTeam[toIndex]] = [newTeam[toIndex], newTeam[fromIndex]];
       return { ...prev, team: newTeam };
    });
    setDragTeamIndex(toIndex);
    setDragMoved(true);
  };

  const endTeamDrag = () => {
    window.setTimeout(() => {
      setDragTeamIndex(null);
      setDragMoved(false);
    }, 0);
  };

  const equipNature = (natureName) => {
    if (!activePokemonDetails) return;
    setGameState(prev => {
       const newList = [...prev[activePokemonDetails.location]];
       newList[activePokemonDetails.index] = { ...newList[activePokemonDetails.index], equippedNature: natureName };
       return { ...prev, [activePokemonDetails.location]: newList };
    });
    setActivePokemonDetails(prev => ({ ...prev, pokemon: { ...prev.pokemon, equippedNature: natureName } }));
  };

  const equipRareMove = (moveObj) => {
    if (!activePokemonDetails) return;
    setGameState(prev => {
       const newList = [...prev[activePokemonDetails.location]];
       const poke = newList[activePokemonDetails.index];

       let newLearnedMoves = poke.learnedMoves ? [...poke.learnedMoves] : [...poke.moves];
       if (!newLearnedMoves.some(m => m.name === moveObj.name)) {
         newLearnedMoves.push(moveObj);
       }

       if (poke.moves.some(m => m.name === moveObj.name)) {
         newList[activePokemonDetails.index] = { ...poke, learnedMoves: newLearnedMoves };
         return { ...prev, [activePokemonDetails.location]: newList };
       }

       const newMoves = [...poke.moves];
       if (newMoves.length < 4) newMoves.push(moveObj);
       else newMoves[0] = moveObj;

       newList[activePokemonDetails.index] = { ...poke, moves: newMoves, learnedMoves: newLearnedMoves };
       return { ...prev, [activePokemonDetails.location]: newList };
    });

    setActivePokemonDetails(prev => {
       const poke = prev.pokemon;
       let newLearnedMoves = poke.learnedMoves ? [...poke.learnedMoves] : [...poke.moves];
       if (!newLearnedMoves.some(m => m.name === moveObj.name)) {
         newLearnedMoves.push(moveObj);
       }

       if (poke.moves.some(m => m.name === moveObj.name)) {
         return { ...prev, pokemon: { ...poke, learnedMoves: newLearnedMoves } };
       }

       const newMoves = [...poke.moves];
       if (newMoves.length < 4) newMoves.push(moveObj);
       else newMoves[0] = moveObj;

       return { ...prev, pokemon: { ...poke, moves: newMoves, learnedMoves: newLearnedMoves } };
    });
    addLog(`${activePokemonDetails.pokemon.name} aprendeu ${moveObj.name}!`, 'system');
  };

  const swapMove = (activeIdx, newMoveName) => {
    if (!activePokemonDetails || !newMoveName) return;
    const moveData = getMoveData(newMoveName);
    if (!moveData) return;

    setGameState(prev => {
      const newList = [...prev[activePokemonDetails.location]];
      const poke = { ...newList[activePokemonDetails.index] };
      const newMoves = [...poke.moves];

      // Se já tiver o golpe em outra posição, apenas troca de lugar (reordenar)
      const existingIdx = newMoves.findIndex(m => m.name === newMoveName);
      if (existingIdx !== -1) {
        [newMoves[activeIdx], newMoves[existingIdx]] = [newMoves[existingIdx], newMoves[activeIdx]];
      } else {
        newMoves[activeIdx] = moveData; // Fix: use full moveData instead of just { name }
      }

      poke.moves = newMoves;
      newList[activePokemonDetails.index] = poke;
      return { ...prev, [activePokemonDetails.location]: newList };
    });

    setActivePokemonDetails(prev => {
      const poke = { ...prev.pokemon };
      const newMoves = [...poke.moves];
      const existingIdx = newMoves.findIndex(m => m.name === newMoveName);
      if (existingIdx !== -1) {
        [newMoves[activeIdx], newMoves[existingIdx]] = [newMoves[existingIdx], newMoves[activeIdx]];
      } else {
        newMoves[activeIdx] = moveData; // Fix: use full moveData instead of just { name }
      }
      return { ...prev, pokemon: { ...poke, moves: newMoves } };
    });

    setMoveSwapMode(null);
  };

  const handleStoneEvolution = (stoneId, targetEvo) => {
    if (!activePokemonDetails) return;
    const itemCount = gameState.inventory?.items?.[stoneId] || 0;
    if (itemCount <= 0) return;

    const poke = activePokemonDetails.pokemon;
    const actualTarget = targetEvo || (Array.isArray(POKEDEX[poke.id]?.evolution) ? POKEDEX[poke.id]?.evolution.find(e => e.item === stoneId) : POKEDEX[poke.id]?.evolution);

    setGameState(prev => ({
      ...prev,
      inventory: { ...prev.inventory, items: { ...prev.inventory.items, [stoneId]: (prev.inventory.items[stoneId] || 1) - 1 } }
    }));
    setActivePokemonDetails(null);
    setEvolutionPending({
      ...poke,
      targetEvolution: actualTarget,
      teamIndex: activePokemonDetails.location === 'team' ? activePokemonDetails.index : null,
      pcIndex: activePokemonDetails.location === 'pc' ? activePokemonDetails.index : null
    });
  };

  const masteryCount = activePokemonDetails ? (gameState.speciesMastery[activePokemonDetails.pokemon.id] || 0) : 0;
  const path = activePokemonDetails ? getMasteryPath(activePokemonDetails.pokemon.id) : null;
  const typeColorMap = {
    Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
    Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
    Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
    Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
    Steel: '#5a8ea2', Fairy: '#fb89eb',
  };
  const typeIconUrl = (t) => t ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${String(t).toLowerCase()}.svg` : '';

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10 h-full text-left">
      <div className="flex bg-white rounded-2xl p-1 shadow-md border-2 border-slate-100">
         <button onClick={() => setActiveTab('team')} className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'team' ? 'bg-pokeBlue text-white shadow-lg' : 'text-slate-400'}`}>Meu Time ({gameState.team.length}/6)</button>
         <button onClick={() => setActiveTab('pc')} className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'pc' ? 'bg-pokeGold text-white shadow-lg' : 'text-slate-400'}`}>PC Storage ({gameState.pc?.length || 0})</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'team' ? (
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setCurrentView('battles')}
              className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-md border-b-4 border-slate-900 flex items-center justify-center gap-2 active:scale-95 mb-2"
            >
              <span>⚔️</span> Voltar ao Treino
            </button>

            <div className="grid grid-cols-1 gap-3">
            {gameState.team.map((p, i) => (
              <div
                key={p.instanceId || i}
                draggable
                onDragStart={(e) => {
                  setDragTeamIndex(i);
                  setDragMoved(false);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', String(i));
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = Number(e.dataTransfer.getData('text/plain'));
                  reorderTeam(Number.isNaN(fromIndex) ? dragTeamIndex : fromIndex, i);
                  endTeamDrag();
                }}
                onDragEnd={endTeamDrag}
                onPointerDown={() => {
                  setDragTeamIndex(i);
                  setDragMoved(false);
                }}
                onPointerEnter={() => {
                  if (dragTeamIndex !== null && dragTeamIndex !== i) reorderTeam(dragTeamIndex, i);
                }}
                onPointerUp={endTeamDrag}
                onClick={() => {
                  if (dragMoved) return;
                  setActivePokemonDetails({ pokemon: p, index: i, location: 'team' });
                }}
                className={`bg-white p-4 rounded-3xl border-2 flex items-center gap-4 group cursor-grab active:cursor-grabbing hover:border-pokeBlue transition-all touch-none ${
                  dragTeamIndex === i ? 'border-pokeBlue shadow-lg scale-[0.98]' : 'border-slate-100'
                }`}
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center relative">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`} className="w-14 h-14 object-contain" alt={p.name} loading="lazy" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start">
                    <div>
                      <h4 className="font-black uppercase text-slate-800 text-sm italic leading-none flex items-baseline gap-2">
                        <span>{p.name}</span>
                        {p.isShiny && <span className="text-yellow-500 text-xs animate-pulse">✨</span>}
                        <span className="text-[10px] font-black text-slate-400 not-italic">Nv. {p.level}</span>
                      </h4>
                      <div className="flex gap-2 mt-1">
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">ATK: {p.attack}</span>
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">S.ATK: {p.spAtk}</span>
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">SPD: {p.speed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                    <div className={`h-full ${(p.hp/p.maxHp) > 0.5 ? 'bg-green-500' : (p.hp/p.maxHp) > 0.2 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(p.hp/p.maxHp)*100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm">
               <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar por nome ou nº..."
                    value={pcSearch}
                    onChange={(e) => setPcSearch(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-pokeGold/50 transition-all placeholder:text-slate-300"
                  />
               </div>
               <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Regiao:</span>
                  <select
                    value={pcRegion}
                    onChange={(e) => setPcRegion(e.target.value)}
                    className="bg-slate-50 border-none rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-pokeGold/50 outline-none transition-all cursor-pointer"
                  >
                    {availablePcRegions.map(region => (
                      <option key={region.id} value={region.id}>{region.label}</option>
                    ))}
                  </select>
                  <span className="text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Ordenar:</span>
                  <select
                    value={pcSort}
                    onChange={(e) => setPcSort(e.target.value)}
                    className="bg-slate-50 border-none rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-pokeGold/50 outline-none transition-all cursor-pointer"
                  >
                    <option value="number">Nº Pokedex (1-251)</option>
                    <option value="number-desc">Nº Pokedex (251-1)</option>
                    <option value="alpha">Ordem Alfabética (A-Z)</option>
                    <option value="level">Maior Nível</option>
                    <option value="type">Por Tipo</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(() => {
                const filtered = (gameState.pc || [])
                  .map((p, idx) => ({ ...p, originalIndex: idx }))
                  .filter(p => {
                    const term = pcSearch.toLowerCase();
                    const matchesRegion = pcRegion === 'all' || getDexRegion(p.id) === pcRegion;
                    return matchesRegion && (p.name.toLowerCase().includes(term) || String(p.id).includes(term));
                  })
                  .sort((a, b) => {
                    if (pcSort === 'alpha') return a.name.localeCompare(b.name);
                    if (pcSort === 'level') return b.level - a.level;
                    if (pcSort === 'type') return (a.type || 'Normal').localeCompare(b.type || 'Normal');
                    if (pcSort === 'number-desc') return b.id - a.id;
                    return a.id - b.id;
                  });

                if (filtered.length === 0) {
                  return <p className="col-span-2 text-center py-10 text-slate-400 font-bold uppercase italic">{pcSearch ? 'Nenhum Pokémon encontrado...' : 'O PC está vazio...'}</p>;
                }

                return filtered.map((p) => (
                  <div key={p.instanceId || `pc-${p.id}-${p.originalIndex}`} onClick={() => setActivePokemonDetails({ pokemon: p, index: p.originalIndex, location: 'pc' })} className="bg-white p-3 rounded-2xl border-2 border-slate-100 flex flex-col items-center gap-2 group relative cursor-pointer hover:border-pokeGold transition-all">
                     <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`} className="w-12 h-12 object-contain" alt={p.name} loading="lazy" />
                     <div className="text-center">
                       <p className="font-black uppercase text-slate-800 text-[10px] italic leading-none flex items-center justify-center gap-1">
                         {p.name}
                         {p.isShiny && <span className="text-yellow-500 text-[8px]">✨</span>}
                       </p>
                       <p className="text-[8px] font-bold text-slate-400 mt-0.5">Nv. {p.level}</p>
                     </div>
                     <button onClick={(e) => { e.stopPropagation(); moveToTeam(p.originalIndex, p.instanceId); }} className="absolute top-1 right-1 bg-blue-50 text-blue-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75">
                       <span className="font-black text-[8px] uppercase">+ Team</span>
                     </button>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      {activePokemonDetails && typeof document !== 'undefined' && createPortal((
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-[82vw] max-w-[360px] max-h-[82dvh] rounded-[2rem] shadow-2xl border-b-[8px] border-slate-200 overflow-hidden relative animate-slideInUp flex flex-col">
               <button onClick={() => setActivePokemonDetails(null)} className="absolute top-4 right-4 bg-white/20 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/30 backdrop-blur-md transition-all z-20 text-white font-black text-xs">
                  x
               </button>
               {(() => {
                 const poke = activePokemonDetails.pokemon;
                 const types = (poke.types && poke.types.length > 0) ? poke.types : [poke.type || 'Normal'];
                 const t1 = types[0] || 'Normal';
                 const t2 = types[1] || null;

                 const TYPE_COLOR = {
                   Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
                   Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
                   Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
                   Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
                   Steel: '#5a8ea2', Fairy: '#fb89eb',
                 };

                 const TYPE_BADGE = {
                   Normal: 'bg-[#9ea0aa]', Fire: 'bg-[#ff9741]', Water: 'bg-[#3391d4]',
                   Grass: 'bg-[#38bf4f]', Electric: 'bg-[#fbd100]', Ice: 'bg-[#70cbd4]',
                   Fighting: 'bg-[#e0306a]', Poison: 'bg-[#b567ce]', Ground: 'bg-[#e87236]',
                   Flying: 'bg-[#89aae3]', Psychic: 'bg-[#ff6675]', Bug: 'bg-[#83c300]',
                   Rock: 'bg-[#c9bb8a]', Ghost: 'bg-[#4c6ab2]', Dragon: 'bg-[#006fc9]',
                   Dark: 'bg-[#5b5466]', Steel: 'bg-[#5a8ea2]', Fairy: 'bg-[#fb89eb]',
                 };

                 const typeIconUrl = (t) => t ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.toLowerCase()}.svg` : '';
                 const c1 = TYPE_COLOR[t1] || '#9ea0aa';
                 const c2 = t2 ? (TYPE_COLOR[t2] || '#9ea0aa') : c1;

                 const bgStyle = poke.isShiny
                   ? { background: 'linear-gradient(160deg, #fde68a 0%, #f59e0b 50%, #d97706 100%)' }
                   : t2
                     ? { background: `linear-gradient(160deg, ${c1} 0%, ${c1}bb 40%, ${c2}bb 60%, ${c2} 100%)` }
                     : { background: `linear-gradient(160deg, ${c1}88 0%, ${c1} 60%, ${c1}dd 100%)` };

                 return (
                   <div className="h-48 w-full shrink-0 relative overflow-hidden shadow-inner" style={bgStyle}>
                     <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                     <img src={typeIconUrl(t1)} className="absolute -left-4 bottom-2 w-28 h-28 opacity-10 pointer-events-none select-none invert" alt="" />
                     {t2 && <img src={typeIconUrl(t2)} className="absolute -right-2 top-2 w-24 h-24 opacity-10 pointer-events-none select-none invert" alt="" />}
                     <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-10">
                       {poke.isShiny && (
                         <div className="bg-yellow-500 px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                           <span className="text-[9px] font-black text-white uppercase tracking-widest">Shiny</span>
                         </div>
                       )}
                       {types.map(t => (
                         <div key={t} className={`${TYPE_BADGE[t] || 'bg-slate-500'} px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md`}>
                           <img src={typeIconUrl(t)} className="w-3.5 h-3.5 invert" alt={t} onError={e => { e.target.style.display = 'none'; }} />
                           <span className="text-[9px] font-black text-white uppercase tracking-wider">{t}</span>
                         </div>
                       ))}
                     </div>
                     <img
                       src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.isShiny ? 'shiny/' : ''}${poke.id}.png`}
                       className={`absolute left-1/2 top-12 z-10 w-28 h-28 -translate-x-1/2 object-contain drop-shadow-2xl ${poke.isShiny ? 'drop-shadow-[0_0_20px_rgba(234,179,8,0.9)]' : ''}`}
                       alt={poke.name}
                       loading="lazy"
                     />
                   </div>
                 );
               })()}

               <div className="flex-1 overflow-y-auto px-5 pt-6 pb-6 custom-scrollbar">
                  <div className="text-center mb-5">
                     <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-none flex items-center justify-center gap-2">
                       {activePokemonDetails.pokemon.name}
                       {activePokemonDetails.pokemon.isShiny && <span className="text-yellow-500 text-xl animate-pulse">⭐</span>}
                     </h3>
                     <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Nv. {activePokemonDetails.pokemon.level}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        {(activePokemonDetails.pokemon.types || [activePokemonDetails.pokemon.type || 'Normal']).map(t => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white shadow-sm"
                            style={{ background: typeColorMap[t] || '#64748b' }}
                          >
                            <img src={typeIconUrl(t)} className="w-3 h-3 invert" alt="" onError={e => { e.target.style.display = 'none'; }} />
                            {t}
                          </span>
                        ))}
                     </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-6 group hover:border-pokeBlue/30 transition-colors">
                     <h4 className="font-black uppercase text-[8px] text-slate-400 mb-3 tracking-widest text-center">Estatísticas Reais</h4>
                     <div className="grid grid-cols-2 gap-x-8 gap-y-3 px-2">
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">HP</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.hp}/{activePokemonDetails.pokemon.maxHp}</p></div>
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">ATK</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.attack}</p></div>
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">SPD</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.speed}</p></div>
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">DEF</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.defense}</p></div>
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">S.ATK</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.spAtk || 10}</p></div>
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">S.DEF</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.spDef || 10}</p></div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h4 className="font-black uppercase text-[9px] text-slate-400 text-center tracking-widest mb-1">Treinamento Avançado</h4>

                    {/* NATUREZAS */}
                    <div className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${masteryCount >= 5 ? 'border-pokeBlue bg-blue-50/70' : 'border-blue-100 bg-blue-50/40 opacity-80'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="text-[11px] font-black uppercase text-slate-800">Natureza</h3>
                          <p className="text-[8px] font-black uppercase tracking-widest text-pokeBlue">Toque para alterar</p>
                        </div>
                        {masteryCount < 5 && <span className="text-[8px] font-bold text-red-500 uppercase">Faltam {5 - masteryCount} capturas</span>}
                      </div>
                      <select
                        value={activePokemonDetails.pokemon.equippedNature || ''}
                        onChange={(e) => equipNature(e.target.value)}
                        className="min-h-[44px] w-full bg-white border-2 border-pokeBlue/40 rounded-xl px-3 text-[11px] font-black text-slate-700 outline-none focus:border-pokeBlue shadow-sm"
                        disabled={masteryCount < 5}
                      >
                        <option value="">Padrão (Neutro)</option>
                        {NATURE_LIST.slice(0, Math.floor(masteryCount / 5)).map((name) => {
                          const mods = NATURES[name];
                          return (
                            <option key={name} value={name}>{name} (+{mods.plus.toUpperCase()}, -{mods.minus.toUpperCase()})</option>
                          );
                        })}
                      </select>
                    </div>

                    {/* CANDIES */}
                    {(() => {
                      const poke = activePokemonDetails.pokemon;
                      const candyId = POKEMON_TO_CANDY[Number(poke.id)];
                      const candyData = candyId ? CANDY_FAMILIES[candyId] : null;
                      const inventoryCandies = gameState.inventory?.candies || {};
                      const currentCandyCount = candyData ? (inventoryCandies[candyId] || 0) : 0;
                      if (!candyData) return null;
                      return (
                        <div className="mt-2 rounded-3xl border-2 border-pokeBlue/20 bg-blue-50/30 overflow-hidden">
                          <button onClick={() => setCandyExpanded(!candyExpanded)} className="w-full min-h-[64px] flex items-center gap-3 p-4 text-left bg-white/70 active:scale-[0.99] transition-all">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 border-white" style={{ background: candyData.color }}>
                              <img src={getCandyIconUrl(candyData)} alt="" className="w-10 h-10 object-contain" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-black uppercase text-xs text-slate-800 leading-none">{candyData.name}</h4>
                              <p className="text-[10px] font-bold text-pokeBlue mt-1 uppercase tracking-wider">Disponível: {currentCandyCount}</p>
                            </div>
                            <span className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                              {candyExpanded ? '-' : '+'}
                            </span>
                          </button>
                          {candyExpanded && (
                            <div className="grid grid-cols-1 gap-2 p-4 pt-0">
                              {Object.values(CANDY_USES).map((use) => {
                                const canAfford = currentCandyCount >= use.cost;
                                return (
                                  <button key={use.id} onClick={() => handleUseCandy(poke.instanceId, candyId, use.id)} disabled={!canAfford} className={`min-h-[56px] flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${canAfford ? 'bg-white border-slate-100 hover:border-pokeBlue shadow-sm' : 'bg-slate-100 border-transparent opacity-60'}`}>
                                    <img src={use.icon} className="w-8 h-8 object-contain" alt="" />
                                    <div className="flex-1 text-left"><p className="text-[10px] font-black uppercase text-slate-700 leading-none">{use.name}</p></div>
                                    <p className={`text-[10px] font-black ${canAfford ? 'text-pokeBlue' : 'text-slate-400'}`}>{use.cost}</p>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* MOVESET MODERNIZADO */}
                  <div className="mt-7">
                    <h4 className="font-black uppercase text-[10px] text-slate-800 mb-3 flex items-center gap-2 leading-none">
                       <span className="bg-pokeBlue text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px] shrink-0">⚔</span>
                       <span className="leading-none">Golpes Atuais</span>
                    </h4>
                    <div className="space-y-2.5">
                      {activePokemonDetails.pokemon.moves.map((m, idx) => {
                        const moveData = getMoveData(m);
                        return (
                          <div
                            key={idx}
                            onClick={() => setMoveSwapMode({ activeIdx: idx, currentMove: m.name })}
                            className="min-h-[62px] bg-white border border-slate-100 rounded-2xl flex items-center gap-3 group transition-all hover:border-pokeBlue/30 hover:bg-blue-50/20 cursor-pointer shadow-sm relative overflow-hidden active:scale-95"
                            style={{ padding: '10px 12px 10px 14px' }}
                          >
                             <div className="w-1 bg-slate-200 absolute left-0 top-0 bottom-0 group-hover:bg-pokeBlue transition-colors"></div>
                             <div className="flex-1 min-w-0 text-left pl-1">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                   <span className="text-[11px] font-black text-slate-800 uppercase leading-tight break-words min-w-0">{getMoveLabel(m)}</span>
                                   <span className="px-1.5 py-0.5 rounded text-[7px] font-black text-white uppercase tracking-wider shrink-0" style={{ background: typeColorMap[moveData?.type] || '#64748b' }}>
                                      {moveData?.type || '???'}
                                   </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 opacity-70">
                                   {moveData?.power > 0 ? (
                                     <span className="text-[8px] font-black text-slate-500 uppercase whitespace-nowrap">Pwr: {moveData.power}</span>
                                   ) : (moveData?.category === 'Physical' || moveData?.category === 'Special' || moveData?.category === 'physical' || moveData?.category === 'special') ? (
                                     <span className="text-[8px] font-black text-red-500 uppercase whitespace-nowrap">Efeito: Dano</span>
                                   ) : (
                                     <span className="text-[8px] font-black text-purple-500 uppercase whitespace-nowrap">Efeito: Status</span>
                                   )}
                                   <span className="text-[8px] font-black text-slate-500 uppercase whitespace-nowrap">Acc: {moveData?.accuracy ? `${moveData.accuracy}%` : '-'}</span>
                                   <span className="text-[8px] font-black text-slate-500 uppercase whitespace-nowrap">PP: {moveData?.pp ?? '-'}</span>
                                </div>
                             </div>
                             <div className="flex flex-col items-center justify-center bg-slate-50 w-9 h-9 rounded-xl shrink-0 border border-slate-100">
                                <span className="text-[12px] leading-none">{moveData?.category === 'Physical' || moveData?.category === 'physical' ? '👊' : moveData?.category === 'Special' || moveData?.category === 'special' ? '✨' : '🛡'}</span>
                             </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MODAL DE TROCA DE GOLPES (OVERLAY LOCAL) */}
                  {moveSwapMode && createPortal((
                    <div className="fixed inset-0 z-[10000] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
                      <div className="w-full max-w-[360px] max-h-[min(82dvh,560px)] bg-slate-900 border border-white/10 shadow-2xl rounded-[1.5rem] overflow-hidden flex flex-col" style={{ backgroundColor: '#0f172a' }}>
                      <div className="flex justify-between items-start gap-3 border-b border-white/10 shrink-0" style={{ padding: '16px 16px 12px 24px' }}>
                        <div className="text-left min-w-0">
                          <h4 className="text-white font-black uppercase text-[13px] leading-none">Trocar Golpe</h4>
                          <p className="text-slate-400 text-[9px] font-bold uppercase mt-1 leading-tight">Novo golpe para o Slot {moveSwapMode.activeIdx + 1}</p>
                        </div>
                        <button onClick={() => setMoveSwapMode(null)} className="text-white bg-white/10 w-10 h-10 rounded-full font-black text-xs shrink-0 active:scale-95">x</button>
                      </div>

                      <div className="min-h-0 overflow-y-auto custom-scrollbar space-y-3" style={{ padding: '12px 12px 12px 20px', backgroundColor: '#0f172a' }}>
                        {(() => {
                          const learned = activePokemonDetails.pokemon.learnedMoves || activePokemonDetails.pokemon.moves || [];
                          const available = learned.filter(m => !activePokemonDetails.pokemon.moves.some(active => getMoveKey(active) === getMoveKey(m)));

                          // Adiciona opção de reordenar (golpes já ativos)
                          const currentActive = activePokemonDetails.pokemon.moves;
                          const rareMoves = (path?.rareMoves || []).map(rm => ({ ...rm, ...getMoveData(rm), name: rm.name }));

                          return (
                            <>
                              <div>
                                <p className="text-[9px] font-black text-pokeBlue uppercase mb-1.5 tracking-widest opacity-80">Reordenar Atuais</p>
                                <div className="grid grid-cols-1 gap-1.5">
                                  {currentActive.map((m, i) => {
                                    const mData = getMoveData(m);
                                    return (
                                      <button
                                        key={`active-${i}`}
                                        disabled={i === moveSwapMode.activeIdx}
                                        onClick={() => swapMove(moveSwapMode.activeIdx, m.name)}
                                        className={`min-h-11 px-3 py-2 rounded-xl border flex items-center justify-between gap-3 transition-all active:scale-[0.98] ${i === moveSwapMode.activeIdx ? 'border-pokeBlue bg-slate-800 opacity-60 grayscale' : 'border-white/10 bg-slate-800/95 hover:bg-slate-700'}`}
                                        style={{ padding: '8px 12px' }}
                                      >
                                        <div className="flex-1 min-w-0 text-left">
                                          <p className="text-white font-black uppercase text-[10px] leading-tight truncate">{getMoveLabel(m)}</p>
                                          <div className="flex gap-2 mt-1 opacity-70">
                                            {mData?.power > 0 ? (
                                              <span className="text-[7px] font-bold text-slate-300 uppercase">Pwr: {mData.power}</span>
                                            ) : (mData?.category === 'Physical' || mData?.category === 'Special' || mData?.category === 'physical' || mData?.category === 'special') ? (
                                              <span className="text-[7px] font-bold text-red-400 uppercase">Dano</span>
                                            ) : (
                                              <span className="text-[7px] font-bold text-purple-400 uppercase">Status</span>
                                            )}
                                            <span className="text-[7px] font-bold text-slate-300 uppercase">Acc: {mData?.accuracy || '-'}</span>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                          <span className="px-2 py-0.5 rounded bg-white/10 text-[7px] font-black text-white uppercase tracking-widest">{mData?.type || '???'}</span>
                                          <span className="text-slate-500 font-black text-[8px] uppercase">Slot {i + 1}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div>
                                <p className="text-[9px] font-black text-pokeGold uppercase mb-1.5 tracking-widest opacity-80">Golpes Aprendidos</p>
                                {available.length === 0 ? (
                                  <p className="text-slate-500 text-[10px] font-bold italic py-2">Nenhum golpe adicional disponível...</p>
                                ) : (
                                  <div className="grid grid-cols-1 gap-1.5">
                                    {available.map((m, i) => {
                                      const mData = getMoveData(m);
                                      return (
                                        <button
                                          key={`learned-${i}`}
                                          onClick={() => swapMove(moveSwapMode.activeIdx, m.name)}
                                          className="min-h-11 px-3 py-2 rounded-xl border border-white/10 bg-slate-800/95 hover:bg-slate-700 hover:border-pokeGold/30 transition-all active:scale-[0.98] flex items-center gap-3 text-left group"
                                          style={{ padding: '8px 12px' }}
                                        >
                                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: typeColorMap[mData?.type] || '#64748b' }}></div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-white font-black uppercase text-[10px] leading-tight">{getMoveLabel(m)}</p>
                                            <div className="flex gap-3 mt-1 opacity-60">
                                              {mData?.power > 0 ? (
                                                <span className="text-[7px] font-bold text-slate-300 uppercase">Pwr: {mData.power}</span>
                                              ) : (mData?.category === 'Physical' || mData?.category === 'Special' || mData?.category === 'physical' || mData?.category === 'special') ? (
                                                <span className="text-[7px] font-bold text-red-400 uppercase">Dano</span>
                                              ) : (
                                                <span className="text-[7px] font-bold text-purple-400 uppercase">Status</span>
                                              )}
                                              <span className="text-[7px] font-bold text-slate-300 uppercase">Acc: {mData?.accuracy || '-'}</span>
                                            </div>
                                          </div>
                                          <div className="px-2 py-0.5 rounded bg-white/10 text-[7px] font-black text-white uppercase tracking-widest shrink-0">{mData?.type || '???'}</div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="text-[9px] font-black text-amber-300 uppercase mb-1.5 tracking-widest opacity-90">Ataques Raros</p>
                                {rareMoves.length === 0 ? (
                                  <p className="text-slate-500 text-[10px] font-bold italic py-2">Nenhum ataque raro catalogado.</p>
                                ) : (
                                  <div className="grid grid-cols-1 gap-1.5">
                                    {rareMoves.map((rm, i) => {
                                      const isUnlocked = masteryCount >= rm.level;
                                      const isEquipped = activePokemonDetails.pokemon.moves.some(active => getMoveKey(active) === getMoveKey(rm));
                                      return (
                                        <button
                                          key={`rare-${i}`}
                                          disabled={!isUnlocked || isEquipped}
                                          onClick={() => equipRareMove(rm)}
                                          className={`min-h-11 rounded-xl border flex items-center gap-3 text-left transition-all active:scale-[0.98] ${isEquipped ? 'border-amber-300/60 bg-amber-400/15' : isUnlocked ? 'border-amber-300/30 bg-slate-800/95 hover:bg-slate-700' : 'border-white/10 bg-slate-800/50 opacity-60 grayscale'}`}
                                          style={{ padding: '8px 12px' }}
                                        >
                                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: typeColorMap[rm?.type] || '#facc15' }}></div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-white font-black uppercase text-[10px] leading-tight truncate">{getMoveLabel(rm)}</p>
                                            <div className="flex gap-3 mt-1 opacity-70">
                                              {rm?.power > 0 ? (
                                                <span className="text-[7px] font-bold text-slate-300 uppercase">Pwr: {rm.power}</span>
                                              ) : (rm?.category === 'Physical' || rm?.category === 'Special' || rm?.category === 'physical' || rm?.category === 'special') ? (
                                                <span className="text-[7px] font-bold text-red-400 uppercase">Dano</span>
                                              ) : (
                                                <span className="text-[7px] font-bold text-purple-400 uppercase">Status</span>
                                              )}
                                              <span className="text-[7px] font-bold text-slate-300 uppercase">Acc: {rm?.accuracy || '-'}</span>
                                            </div>
                                          </div>
                                          <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className="px-2 py-0.5 rounded bg-white/10 text-[7px] font-black text-white uppercase tracking-widest">{rm?.type || '???'}</span>
                                            <span className="text-[7px] font-black uppercase text-slate-400">
                                              {isEquipped ? 'Equipado' : isUnlocked ? 'Equipar' : `Faltam ${rm.level - masteryCount}`}
                                            </span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <div className="px-4 py-2.5 border-t border-white/10 bg-slate-950/30 shrink-0">
                        <p className="text-[8px] text-slate-500 font-bold uppercase italic text-center">Dica: toque nos golpes ativos para reordenar.</p>
                      </div>
                      </div>
                    </div>
                  ), document.body)}

                  {/* GUIA DE EVOLUCAO */}
                  {(() => {
                    const poke = activePokemonDetails.pokemon;
                    const pokeData = POKEDEX[poke.id];
                    if (!pokeData?.evolution) {
                      return (
                        <div className="mt-8 border-t-2 border-slate-100 pt-6">
                          <h4 className="font-black uppercase text-[10px] text-slate-800 mb-4 flex items-center gap-2">
                             <span className="bg-pokeBlue text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px]">?</span>
                             Guia de Evolução
                          </h4>
                          <p className="text-xs font-bold text-slate-400 italic text-left px-2">Este Pokémon atingiu sua forma final.</p>
                        </div>
                      );
                    }

                    const evolutions = Array.isArray(pokeData.evolution) ? pokeData.evolution : [pokeData.evolution];
                    const currentTime = getTimeOfDay();

                    const stoneNames = { 
                      thunder_stone: 'Thunder Stone', moon_stone: 'Moon Stone', link_cable: 'Link Cable', 
                      fire_stone: 'Fire Stone', water_stone: 'Water Stone', leaf_stone: 'Leaf Stone',
                      sun_stone: 'Sun Stone', shiny_stone: 'Shiny Stone', dusk_stone: 'Dusk Stone', 
                      dawn_stone: 'Dawn Stone', ice_stone: 'Ice Stone'
                    };
                    const stoneIcons = {
                      thunder_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png',
                      moon_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png',
                      link_cable: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/up-grade.png',
                      fire_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png',
                      water_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png',
                      leaf_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png',
                      sun_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png',
                      shiny_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-stone.png',
                      dusk_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-stone.png',
                      dawn_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dawn-stone.png',
                      ice_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ice-stone.png'
                    };

                    return (
                      <div className="mt-8 border-t-2 border-slate-100 pt-6">
                        <h4 className="font-black uppercase text-[10px] text-slate-800 mb-4 flex items-center gap-2">
                           <span className="bg-pokeBlue text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px]">?</span>
                           Guia de Evolução
                        </h4>
                        
                        <div className="flex flex-col gap-4">
                          {evolutions.map((evo, idx) => {
                            const targetData = POKEDEX[evo.id];
                            const isItemEvo = !!evo.item;
                            const hasItem = isItemEvo ? !!gameState.inventory?.items?.[evo.item] : false;
                            const levelMet = evo.level ? poke.level >= evo.level : true;
                            
                            // Time check
                            const timeMet = !evo.time || evo.time.includes(currentTime);
                            
                            const evolutionAllowed = !isEvolutionAllowedForRegion || isEvolutionAllowedForRegion(poke, evo.id, activeRegion || gameState.activeRegion || 'kanto');
                            
                            const evolutionLockText = !evolutionAllowed
                              ? (getEvolutionRegionLockMessage?.(poke.name, targetData?.name, activeRegion || gameState.activeRegion || 'kanto') || 'Evolucao bloqueada nesta regiao.')
                              : null;

                            const canEvolve = (isItemEvo ? hasItem : levelMet) && timeMet && evolutionAllowed;

                            return (
                              <div key={`${evo.id}-${idx}`} className={`p-4 rounded-2xl border-2 transition-all ${canEvolve ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
                                <div className="flex items-center gap-4">
                                  {/* Thumbnail */}
                                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`} className="w-10 h-10 object-contain" alt="Evo" />
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 text-left min-w-0">
                                    <p className="text-xs font-black text-slate-800 uppercase italic truncate">{targetData?.name || '???'}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {evo.level && (
                                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${levelMet ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                          Nível {evo.level}
                                        </span>
                                      )}
                                      {isItemEvo && (
                                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${hasItem ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                                          <img src={stoneIcons[evo.item]} className="w-3 h-3 object-contain" alt="" />
                                          {stoneNames[evo.item] || evo.item}
                                        </span>
                                      )}
                                      {evo.time && (
                                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${timeMet ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                                          {evo.time.join('/')}
                                        </span>
                                      )}
                                    </div>
                                    {evolutionLockText && (
                                      <p className="mt-1 text-[8px] font-black uppercase text-red-500">{evolutionLockText}</p>
                                    )}
                                  </div>

                                  {/* Action */}
                                  <div className="shrink-0">
                                    {isItemEvo ? (
                                      hasItem && evolutionAllowed && timeMet && (
                                        <button onClick={() => handleStoneEvolution(evo.item, evo)} className="bg-amber-500 text-white font-black text-[9px] px-3 py-2 rounded-lg shadow-lg uppercase active:scale-95 transition-all">Usar Item</button>
                                      )
                                    ) : (
                                      levelMet && evolutionAllowed && timeMet && (
                                        <button 
                                          onClick={() => { 
                                            setActivePokemonDetails(null); 
                                            setEvolutionPending({ 
                                              ...poke, 
                                              targetEvolution: evo,
                                              teamIndex: activePokemonDetails.location === 'team' ? activePokemonDetails.index : null, 
                                              pcIndex: activePokemonDetails.location === 'pc' ? activePokemonDetails.index : null 
                                            }); 
                                          }} 
                                          className="bg-pokeBlue text-white font-black text-[9px] px-3 py-2 rounded-lg shadow-lg uppercase animate-pulse"
                                        >
                                          Evoluir
                                        </button>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
               </div>

               {/* FOOTER - TEAM MOVER */}
               <div className="flex-shrink-0 px-5 pt-3 pb-6 bg-white border-t border-slate-100 flex flex-col gap-3">
                  {activePokemonDetails.location === 'team' ? (
                    <div className="flex flex-col gap-3">
                      {showTeamReorder && (
                        <div className="animate-slideInUp bg-slate-50 p-4 rounded-[2rem] border-2 border-slate-100 mb-2">
                           <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Mudar posição no time</p>
                           <div className="grid grid-cols-3 gap-2">
                             {gameState.team.map((teamPoke, slotIndex) => {
                               const isCurrent = slotIndex === activePokemonDetails.index;
                               return (
                                 <button
                                   key={teamPoke.instanceId || slotIndex}
                                   type="button"
                                   onClick={() => { moveToTeamPosition(slotIndex); setShowTeamReorder(false); }}
                                   className={`relative h-16 rounded-2xl border-2 transition-all flex items-center justify-center ${isCurrent ? 'border-pokeBlue bg-blue-50/50 shadow-inner' : 'border-white bg-white shadow-sm hover:border-pokeBlue/30 active:scale-95'}`}
                                 >
                                   <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${teamPoke.isShiny ? 'shiny/' : ''}${teamPoke.id}.png`} className={`w-10 h-10 object-contain ${isCurrent ? 'opacity-100' : 'opacity-40'}`} alt="" />
                                   <span className={`absolute bottom-1 right-2 text-[8px] font-black uppercase ${isCurrent ? 'text-pokeBlue' : 'text-slate-300'}`}>P{slotIndex + 1}</span>
                                 </button>
                               );
                             })}
                           </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button onClick={() => setShowTeamReorder(!showTeamReorder)} className={`flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${showTeamReorder ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-600 border-2 border-slate-100 hover:border-pokeBlue'}`}>
                           <span>{showTeamReorder ? '✕ Fechar' : '⇄ Mudar Posição'}</span>
                        </button>
                        <button onClick={() => { moveToPC(activePokemonDetails.index); setActivePokemonDetails(null); }} className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg">Enviar p/ PC</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { moveToTeam(activePokemonDetails.index, activePokemonDetails.pokemon?.instanceId); }} className="w-full h-14 bg-gradient-to-r from-pokeBlue to-blue-600 text-white rounded-2xl shadow-lg flex items-center justify-center gap-3 font-black uppercase text-xs hover:scale-[1.02] active:scale-95 transition-all">Adicionar ao Time</button>
                  )}
               </div>
            </div>
         </div>
      ), document.body)}
    </div>
  );
};

export default PokemonManagement;

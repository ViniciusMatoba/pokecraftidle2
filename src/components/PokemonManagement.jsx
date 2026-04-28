import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MOVE_TRANSLATIONS } from '../data/translations';
import { getCandyIconUrl, CANDY_FAMILIES, CANDY_USES, POKEMON_TO_CANDY } from '../data/candies';

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
  closeConfirm
}) => {
  const [dragTeamIndex, setDragTeamIndex] = useState(null);
  const [dragMoved, setDragMoved] = useState(false);
  const [pcSearch, setPcSearch] = useState('');
  const [pcSort, setPcSort] = useState('number');
  const activePokemonKey = activePokemonDetails?.pokemon?.instanceId || activePokemonDetails?.pokemon?.id || null;

  useEffect(() => {
    setCandyExpanded(false);
  }, [activePokemonKey]);

  const translateMove = (moveName) => {
    if (!moveName) return '---';
    const key = String(moveName).toLowerCase();
    return MOVE_TRANSLATIONS[key] || moveName.replace(/-/g, ' ');
  };

  const moveToPC = (index) => {
    if (gameState.team.length <= 1) {
      showConfirm({
        title: 'Acao Bloqueada',
        message: 'Voce precisa de pelo menos um Pokemon no seu time principal!',
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

  const moveToTeam = (index) => {
    if (gameState.team.length >= 6) {
      showConfirm({
        title: 'Time Cheio',
        message: 'Seu time ja possui o limite maximo de 6 Pokemon. Envie alguem para o PC primeiro!',
        onConfirm: closeConfirm
      });
      return;
    }
    const poke = gameState.pc[index];
    setGameState(prev => {
      const newPC = prev.pc.filter((_, i) => i !== index);
      const newTeam = [...prev.team, poke];
      return { ...prev, team: newTeam, pc: newPC };
    });
    setActivePokemonDetails(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setGameState(prev => {
       const newTeam = [...prev.team];
       [newTeam[index - 1], newTeam[index]] = [newTeam[index], newTeam[index - 1]];
       return { ...prev, team: newTeam };
    });
    setActivePokemonDetails(prev => ({ ...prev, index: index - 1 }));
  };

  const moveDown = (index) => {
    if (index === gameState.team.length - 1) return;
    setGameState(prev => {
       const newTeam = [...prev.team];
       [newTeam[index], newTeam[index + 1]] = [newTeam[index + 1], newTeam[index]];
       return { ...prev, team: newTeam };
    });
    setActivePokemonDetails(prev => ({ ...prev, index: index + 1 }));
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
       
       // Garante que o golpe esteja na learnedMoves
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

  const toggleEquipMove = (moveObj) => {
    if (!activePokemonDetails) return;
    const poke = activePokemonDetails.pokemon;
    const isEquipped = poke.moves.some(m => m.name === moveObj.name);
    let newMoves;
    if (isEquipped) {
      if (poke.moves.length <= 1) return;
      newMoves = poke.moves.filter(m => m.name !== moveObj.name);
    } else {
      if (poke.moves.length >= 4) return;
      newMoves = [...poke.moves, moveObj];
    }
    setGameState(prev => {
      const newList = [...prev[activePokemonDetails.location]];
      newList[activePokemonDetails.index] = { ...newList[activePokemonDetails.index], moves: newMoves };
      return { ...prev, [activePokemonDetails.location]: newList };
    });
    setActivePokemonDetails(prev => ({ ...prev, pokemon: { ...prev.pokemon, moves: newMoves } }));
  };

  const useStoneEvolution = (stoneId) => {
    if (!activePokemonDetails) return;
    const poke = activePokemonDetails.pokemon;
    const pokeData = POKEDEX[poke.id];
    if (!pokeData?.evolution?.item || pokeData.evolution.item !== stoneId) return;
    const itemCount = (gameState.inventory?.items?.[stoneId] || 0);
    if (itemCount <= 0) return;
    
    setGameState(prev => ({
      ...prev,
      inventory: { ...prev.inventory, items: { ...prev.inventory.items, [stoneId]: (prev.inventory.items[stoneId] || 1) - 1 } }
    }));
    setActivePokemonDetails(null);
    setEvolutionPending({ 
      ...poke, 
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
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`} className="w-14 h-14 object-contain" alt={p.name} />
                  {p.isShiny && <span className="absolute -top-1 -right-1 text-xs">(</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-start">
                    <div>
                      <h4 className="font-black uppercase text-slate-800 text-sm italic leading-none flex items-baseline gap-2">
                        <span>{p.name}</span>
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
        ) : (
          <div className="flex flex-col gap-4">
            {/* Barra de Busca e Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm">
               <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                  <input 
                    type="text"
                    placeholder="Buscar por nome ou n..."
                    value={pcSearch}
                    onChange={(e) => setPcSearch(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-pokeGold/50 transition-all placeholder:text-slate-300"
                  />
               </div>
               <div className="flex items-center gap-2">
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
                    return p.name.toLowerCase().includes(term) || String(p.id).includes(term);
                  })
                  .sort((a, b) => {
                    if (pcSort === 'alpha') return a.name.localeCompare(b.name);
                    if (pcSort === 'level') return b.level - a.level;
                    if (pcSort === 'type') return (a.type || 'Normal').localeCompare(b.type || 'Normal');
                    if (pcSort === 'number-desc') return b.id - a.id;
                    return a.id - b.id;
                  });

                if (filtered.length === 0) {
                  return <p className="col-span-2 text-center py-10 text-slate-400 font-bold uppercase italic">{pcSearch ? 'Nenhum Pokemon encontrado...' : 'O PC esta vazio...'}</p>;
                }

                return filtered.map((p) => (
                  <div key={p.instanceId || p.originalIndex} onClick={() => setActivePokemonDetails({ pokemon: p, index: p.originalIndex, location: 'pc' })} className="bg-white p-3 rounded-2xl border-2 border-slate-100 flex flex-col items-center gap-2 group relative cursor-pointer hover:border-pokeGold transition-all">
                     <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`} className="w-12 h-12 object-contain" alt={p.name} />
                     <div className="text-center">
                       <p className="font-black uppercase text-slate-800 text-[10px] italic leading-none">{p.name}</p>
                       <p className="text-[8px] font-bold text-slate-400 mt-0.5">Nv. {p.level}</p>
                     </div>
                     <button onClick={(e) => { e.stopPropagation(); moveToTeam(p.originalIndex); }} className="absolute top-1 right-1 bg-blue-50 text-blue-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75">
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
                 // poke.types vem do POKEDEX (array), fallback para poke.type string
                 const types = (poke.types && poke.types.length > 0) ? poke.types : [poke.type || 'Normal'];
                 const t1 = types[0] || 'Normal';
                 const t2 = types[1] || null;

                 // Cores por tipo (hex para usar inline no gradiente)
                 const TYPE_COLOR = {
                   Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
                   Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
                   Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
                   Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
                   Steel: '#5a8ea2', Fairy: '#fb89eb',
                 };

                 // Badge color per type (Tailwind bg)
                 const TYPE_BADGE = {
                   Normal: 'bg-[#9ea0aa]', Fire: 'bg-[#ff9741]', Water: 'bg-[#3391d4]',
                   Grass: 'bg-[#38bf4f]', Electric: 'bg-[#fbd100]', Ice: 'bg-[#70cbd4]',
                   Fighting: 'bg-[#e0306a]', Poison: 'bg-[#b567ce]', Ground: 'bg-[#e87236]',
                   Flying: 'bg-[#89aae3]', Psychic: 'bg-[#ff6675]', Bug: 'bg-[#83c300]',
                   Rock: 'bg-[#c9bb8a]', Ghost: 'bg-[#4c6ab2]', Dragon: 'bg-[#006fc9]',
                   Dark: 'bg-[#5b5466]', Steel: 'bg-[#5a8ea2]', Fairy: 'bg-[#fb89eb]',
                 };

                 // Icone de tipo SVG.
                 const typeIconUrl = (t) => t ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.toLowerCase()}.svg` : '';

                 const c1 = TYPE_COLOR[t1] || '#9ea0aa';
                 const c2 = t2 ? (TYPE_COLOR[t2] || '#9ea0aa') : c1;

                 // Gradiente inline suportando dual-type
                 const bgStyle = poke.isShiny
                   ? { background: 'linear-gradient(160deg, #fde68a 0%, #f59e0b 50%, #d97706 100%)' }
                   : t2
                     ? { background: `linear-gradient(160deg, ${c1} 0%, ${c1}bb 40%, ${c2}bb 60%, ${c2} 100%)` }
                     : { background: `linear-gradient(160deg, ${c1}88 0%, ${c1} 60%, ${c1}dd 100%)` };

                 return (
                   <div className="h-48 w-full shrink-0 relative overflow-hidden shadow-inner" style={bgStyle}>
                     {/* Padrao de pontos */}
                     <div className="absolute inset-0 pointer-events-none"
                       style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                     {/* Icones de tipo grandes no fundo */}
                     <img src={typeIconUrl(t1)} className="absolute -left-4 bottom-2 w-28 h-28 opacity-10 pointer-events-none select-none invert" alt="" />
                     {t2 && <img src={typeIconUrl(t2)} className="absolute -right-2 top-2 w-24 h-24 opacity-10 pointer-events-none select-none invert" alt="" />}

                     {/* Badges de tipo no topo */}
                     <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-10">
                       {poke.isShiny && (
                         <div className="bg-yellow-500 px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                           <span className="text-xs">*</span>
                           <span className="text-[9px] font-black text-white uppercase tracking-widest">Shiny</span>
                         </div>
                       )}
                       {types.map(t => (
                         <div key={t} className={`${TYPE_BADGE[t] || 'bg-slate-500'} px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md`}>
                           <img src={typeIconUrl(t)} className="w-3.5 h-3.5 invert" alt={t}
                             onError={e => { e.target.style.display = 'none'; }} />
                           <span className="text-[9px] font-black text-white uppercase tracking-wider">{t}</span>
                         </div>
                       ))}
                     </div>

                     {/* Sprite do Pokemon */}
                     <img
                       src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.isShiny ? 'shiny/' : ''}${poke.id}.png`}
                       className={`absolute left-1/2 top-12 z-10 w-28 h-28 -translate-x-1/2 object-contain drop-shadow-2xl ${poke.isShiny ? 'drop-shadow-[0_0_20px_rgba(234,179,8,0.9)]' : ''}`}
                       alt={poke.name}
                     />
                   </div>
                 );
               })()}
               <div className="flex-1 overflow-y-auto px-5 pt-6 pb-6 custom-scrollbar">
                  <div className="text-center mb-5">
                     <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                       {activePokemonDetails.pokemon.name}
                       {activePokemonDetails.pokemon.isShiny && <span className="ml-2 text-yellow-500">P</span>}
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
                     <h4 className="font-black uppercase text-[8px] text-slate-400 mb-3 tracking-widest text-center">Estatisticas Reais</h4>
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
                   <h4 className="font-black uppercase text-[9px] text-slate-400 text-center tracking-widest mb-1">Treinamento Avancado</h4>
                   
                   {/* NATUREZAS - SEQUENTIAL UNLOCK */}
                   <div className={`p-4 rounded-2xl border-2 transition-all shadow-sm ${masteryCount >= 5 ? 'border-pokeBlue bg-blue-50/70' : 'border-blue-100 bg-blue-50/40 opacity-80'}`}>
                     <div className="flex justify-between items-center mb-2">
                       <div>
                         <h3 className="text-[11px] font-black uppercase text-slate-800">Natureza</h3>
                         <p className="text-[8px] font-black uppercase tracking-widest text-pokeBlue">Toque para alterar</p>
                       </div>
                       {masteryCount < 5 && <span className="text-[8px] font-bold text-red-500 uppercase">Faltam {5 - masteryCount} capturas</span>}
                     </div>
                     <div className="flex flex-col gap-2">
                        <select 
                          value={activePokemonDetails.pokemon.equippedNature || ''} 
                          onChange={(e) => equipNature(e.target.value)}
                          className="min-h-[44px] w-full bg-white border-2 border-pokeBlue/40 rounded-xl px-3 text-[11px] font-black text-slate-700 outline-none focus:border-pokeBlue shadow-sm"
                          disabled={masteryCount < 5}
                        >
                          <option value="">Padrao (Neutro)</option>
                          {NATURE_LIST.slice(0, Math.floor(masteryCount / 5)).map((name) => {
                            const mods = NATURES[name];
                            return (
                              <option key={name} value={name}>{name} (+{mods.plus.toUpperCase()}, -{mods.minus.toUpperCase()})</option>
                            );
                          })}
                        </select>
                        {masteryCount < 5 && (
                          <div className="bg-white/70 border border-blue-100 rounded-xl p-2 text-[10px] font-bold text-slate-500 text-center italic">Bloqueado por maestria</div>
                        )}
                     </div>
                   </div>

                   <div className={`p-3 rounded-xl border-2 transition-all ${masteryCount >= (path.rareMoves[0]?.level || 999) ? 'border-pokeYellow bg-yellow-50/50' : 'border-slate-200 bg-slate-50 opacity-60 grayscale'}`}>
                     <h3 className="text-[10px] font-black uppercase text-slate-800 mb-2">Ataques Raros (Egg Moves)</h3>
                     <div className="flex flex-col gap-2 overflow-y-auto max-h-32 custom-scrollbar pr-1">
                       {path.rareMoves.length === 0 && <span className="text-[9px] text-slate-400 italic font-bold">Nenhum ataque catalogado.</span>}
                       {path.rareMoves.map((rm, idx) => {
                         const isUnlocked = masteryCount >= rm.level;
                         const isEquipped = activePokemonDetails.pokemon.moves.some(m => m.name === rm.name);
                         return (
                           <div key={idx} className={`flex justify-between items-center p-2 rounded-lg border border-slate-200 bg-white ${isEquipped ? 'ring-2 ring-pokeYellow' : ''}`}>
                             <div>
                               <p className="text-[10px] font-black uppercase text-slate-800 flex items-center gap-1">{rm.name} {isEquipped && <span className="text-pokeYellow">OK</span>}</p>
                               <p className="text-[8px] font-bold text-slate-400 uppercase">{rm.type} - PWR {rm.power || '-'}</p>
                             </div>
                             {isUnlocked ? (
                               <button onClick={() => equipRareMove(rm)} disabled={isEquipped} className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${isEquipped ? 'bg-slate-100 text-slate-400' : 'bg-pokeYellow text-white hover:bg-yellow-500 shadow-md'}`}>
                                 {isEquipped ? 'Equipado' : 'Equipar'}
                               </button>
                             ) : (
                               <span className="text-[8px] font-bold text-red-500 uppercase px-2 py-1 bg-red-50 rounded-lg">Faltam {rm.level - masteryCount}</span>
                             )}
                           </div>
                         );
                       })}
                     </div>
                   </div>

                  {/* SISTEMA DE CANDIES */}
                  {(() => {
                    const poke = activePokemonDetails.pokemon;
                    const candyId = POKEMON_TO_CANDY[Number(poke.id)];
                    const candyData = candyId ? CANDY_FAMILIES[candyId] : null;
                    const inventoryCandies = gameState.inventory?.candies || {};
                    const currentCandyCount = candyData ? (inventoryCandies[candyId] || 0) : 0;

                    if (!candyData) return null;

                    return (
                      <div className="mt-4 rounded-3xl border-2 border-pokeBlue/20 bg-blue-50/30 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setCandyExpanded(prev => !prev)}
                          className="w-full min-h-[64px] flex items-center gap-3 p-4 text-left bg-white/70 active:scale-[0.99] transition-all"
                        >
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                            style={{ background: candyData.color }}
                          >
                            <img
                              src={getCandyIconUrl(candyData)}
                              alt={candyData.name}
                              className="w-10 h-10 object-contain drop-shadow-sm"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black uppercase text-xs text-slate-800 leading-none">{candyData.name}</h4>
                            <p className="text-[10px] font-bold text-pokeBlue mt-1 uppercase tracking-wider">Disponivel: {currentCandyCount}</p>
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
                              <button
                                key={use.id}
                                onClick={() => handleUseCandy(poke.instanceId, candyId, use.id)}
                                disabled={!canAfford}
                                className={`min-h-[56px] flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${canAfford ? 'bg-white border-slate-100 hover:border-pokeBlue shadow-sm' : 'bg-slate-100 border-transparent opacity-60'}`}
                              >
                                <img src={use.icon} className="w-8 h-8 object-contain" alt="" />
                                <div className="flex-1 text-left">
                                  <p className="text-[10px] font-black uppercase text-slate-700 leading-none">{use.name}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{use.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className={`text-[10px] font-black ${canAfford ? 'text-pokeBlue' : 'text-slate-400'}`}>{use.cost}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                  
                  {(() => {
                    const poke = activePokemonDetails.pokemon;
                    const allLearned = poke.learnedMoves || poke.moves || [];
                    const equipped = poke.moves || [];
                    const availableMoves = allLearned.filter(mov => !equipped.some(eq => eq.name === mov.name));
                    const pokeData = POKEDEX[poke.id];
                    const stoneEvol = pokeData?.evolution?.item;
                    const stoneNames = { thunder_stone: 'Thunder Stone', moon_stone: 'Moon Stone', link_cable: 'Link Cable', fire_stone: 'Fire Stone', water_stone: 'Water Stone', leaf_stone: 'Leaf Stone' };
                    const stoneIcons = { 
                      thunder_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png', 
                      moon_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png', 
                      link_cable: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/up-grade.png',
                      fire_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png',
                      water_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png',
                      leaf_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png'
                    };
                    const hasStone = stoneEvol && (gameState.inventory?.items?.[stoneEvol] || 0) > 0;
                    const typeGrad = { Fire:'from-orange-400 to-red-500', Water:'from-sky-400 to-blue-500', Grass:'from-green-400 to-emerald-500', Electric:'from-yellow-300 to-amber-500', Poison:'from-purple-400 to-violet-600', Rock:'from-stone-400 to-stone-600', Fighting:'from-red-400 to-rose-600', Normal:'from-slate-400 to-slate-600', Flying:'from-sky-300 to-indigo-400', Fairy:'from-pink-400 to-rose-400', Bug:'from-lime-400 to-green-500' };
                    return (
                      <>
                        <div className="mt-8 bg-slate-50 p-4 rounded-[2rem] border-2 border-slate-100 shadow-inner">
                          <h4 className="font-black uppercase text-[10px] text-slate-400 text-center tracking-widest mb-4 flex items-center justify-center gap-2">
                             <span className="w-8 h-[1px] bg-slate-200"></span>
                             Ataques
                             <span className="w-8 h-[1px] bg-slate-200"></span>
                          </h4>
                          <div className="flex justify-between items-center mb-3 px-1">
                             <p className="text-[9px] text-slate-500 font-black uppercase italic">Em uso pelo Pokemon</p>
                             <span className={`text-[10px] font-black px-3 py-1 rounded-full ${equipped.length >= 4 ? 'bg-orange-100 text-orange-600' : 'bg-pokeBlue/10 text-pokeBlue'}`}>
                                {equipped.length}/4 ATIVOS
                             </span>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {equipped.length === 0 && <p className="text-[10px] text-slate-400 font-bold italic text-center py-4">Nenhum golpe equipado.</p>}
                            {equipped.map((mov, midx) => {
                              const typeColor = typeGrad[mov.type] || 'from-slate-400 to-slate-600';
                              return (
                                <button 
                                  key={midx} 
                                  onClick={() => toggleEquipMove(mov)} 
                                  className={`group flex items-center gap-3 w-full p-3 rounded-2xl border-2 text-left transition-all relative overflow-hidden border-transparent bg-gradient-to-r ${typeColor} text-white shadow-md`}
                                >
                                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm bg-white/30 text-white">
                                    {midx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs font-black uppercase text-white">{mov.name}</p>
                                    <div className="flex items-center gap-2">
                                       <p className="text-[8px] font-bold uppercase text-white/80">{mov.type}</p>
                                       <span className="w-1 h-1 rounded-full bg-white/40"></span>
                                       <p className="text-[8px] font-black text-white">PWR {mov.power || '-'}</p>
                                    </div>
                                  </div>
                                  <div className="bg-white/20 p-1.5 rounded-lg border border-white/30 text-[9px] font-black uppercase">
                                     Remover
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-4 mb-2 text-[9px] text-slate-500 font-black uppercase italic">Disponiveis para trocar</p>
                          <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                            {availableMoves.length === 0 && <p className="text-[10px] text-slate-400 font-bold italic text-center py-4">Nenhum golpe disponivel para troca.</p>}
                            {availableMoves.map((mov, midx) => (
                              <button
                                key={midx}
                                onClick={() => toggleEquipMove(mov)}
                                className="group flex items-center gap-3 w-full p-3 rounded-2xl border-2 border-white bg-white text-left shadow-sm transition-all hover:border-slate-200"
                              >
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm bg-slate-50 text-slate-400">+</div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-black uppercase text-slate-700 truncate">{mov.name}</p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[8px] font-bold uppercase text-slate-400">{mov.type}</p>
                                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                    <p className="text-[8px] font-black text-slate-500">PWR {mov.power || '-'}</p>
                                  </div>
                                </div>
                                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-[10px] font-black text-slate-400 uppercase">Equipar</div>
                              </button>
                            ))}
                          </div>
                          {equipped.length >= 4 && (
                            <p className="mt-3 text-[8px] text-orange-500 font-black uppercase text-center italic">Time cheio! Remova um golpe para adicionar outro.</p>
                          )}
                        </div>
                        {stoneEvol && (
                          <div className={`mt-4 mb-2 p-4 rounded-2xl border-2 transition-all ${hasStone ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-md' : 'border-slate-200 bg-slate-50 opacity-70'}`}>
                             <div className="flex items-center gap-3">
                               <img src={stoneIcons[stoneEvol] || ''} className="w-10 h-10 object-contain drop-shadow" alt={stoneEvol} />
                               <div className="flex-1">
                                 <p className="text-[11px] font-black text-slate-800 uppercase text-left">Evolucao por Pedra</p>
                                 <p className="text-[9px] font-bold text-slate-500 text-left">Requer: {stoneNames[stoneEvol] || stoneEvol}</p>
                               </div>
                               {hasStone && pokeData?.evolution?.id <= 251 && (
                                 <button onClick={() => useStoneEvolution(stoneEvol)} className="bg-gradient-to-br from-yellow-400 to-amber-500 text-white font-black text-[10px] px-4 py-2.5 rounded-xl shadow-lg uppercase hover:scale-105 transition-transform animate-pulse text-center">Evoluir!</button>
                               )}
                             </div>
                          </div>
                        )}
                        <div className="mt-6 border-t-2 border-slate-100 pt-6 overflow-y-auto max-h-64 custom-scrollbar">
                           <h4 className="font-black uppercase text-[10px] text-slate-800 mb-4 flex items-center gap-2">
                             <span className="bg-pokeBlue text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px]">?</span>
                             Guia de Treinamento e Evolucao
                           </h4>

                           {/* Evolucao */}
                           <div className="bg-slate-50 p-4 rounded-2xl mb-4 border-2 border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-1 text-left">Proxima Evolucao</p>
                             {pokeData?.evolution && pokeData.evolution.id <= 251 ? (
                               <div className="flex flex-col gap-3">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                                       <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeData.evolution.id}.png`} className="w-full h-full object-contain" alt="Evo" />
                                    </div>
                                    <div className="text-left flex-1">
                                       <p className="text-xs font-black text-slate-800 uppercase italic leading-none">{POKEDEX[pokeData.evolution.id]?.name || '???'}</p>
                                       <p className="text-[9px] font-bold text-pokeBlue mt-1 uppercase tracking-widest">
                                          {pokeData.evolution.level ? `Nivel ${pokeData.evolution.level}` : `Requer Item Especial`}
                                       </p>
                                    </div>
                                 </div>
                                 
                                 {pokeData.evolution.level && poke.level >= pokeData.evolution.level && (
                                   <button 
                                     onClick={() => {
                                       setActivePokemonDetails(null);
                                       setEvolutionPending({ 
                                         ...poke, 
                                         teamIndex: activePokemonDetails.location === 'team' ? activePokemonDetails.index : null, 
                                         pcIndex: activePokemonDetails.location === 'pc' ? activePokemonDetails.index : null 
                                       });
                                     }}
                                     className="w-full bg-gradient-to-r from-pokeBlue to-blue-600 text-white font-black text-[10px] py-2.5 rounded-xl shadow-lg uppercase animate-pulse hover:scale-[1.02] transition-transform"
                                   >
                                     Evolucao Disponivel! Clique aqui
                                   </button>
                                 )}
                               </div>
                             ) : (
                               <p className="text-xs font-bold text-slate-400 italic text-left">Este Pokemon atingiu sua forma final.</p>
                             )}
                           </div>

                           {/* Proximos Golpes */}
                           <div className="bg-slate-50 p-4 rounded-2xl mb-4 border-2 border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-2 text-left">Proximos Golpes por Level</p>
                             <div className="flex flex-col gap-2">
                               {pokeData?.learnset?.filter(m => m.level > poke.level).length === 0 && (
                                 <p className="text-[10px] font-bold text-slate-400 italic text-left">Nao ha mais golpes para aprender por nivel.</p>
                               )}
                               {pokeData?.learnset?.filter(m => m.level > poke.level).sort((a,b) => a.level - b.level).slice(0, 3).map((m, idx) => (
                                 <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-700 uppercase italic">Nv. {m.level} - {translateMove(m.move)}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase">Aprendera</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                        </div>
                      </>
                    );
                  })()}
               </div>
               
               {/* Acao no rodape */}
               <div className="flex-shrink-0 px-5 pt-3 pb-6 bg-white border-t border-slate-100 flex flex-col gap-3">
                  {activePokemonDetails.location === 'team' ? (
                    <>
                      <div>
                         <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">Mover na equipe</p>
                         <div className="grid grid-cols-3 gap-2">
                           {gameState.team.map((teamPoke, slotIndex) => {
                             const isCurrent = slotIndex === activePokemonDetails.index;
                             return (
                               <button
                                 key={teamPoke.instanceId || slotIndex}
                                 type="button"
                                 onClick={() => moveToTeamPosition(slotIndex)}
                                 disabled={isCurrent}
                                 className={`min-h-[64px] rounded-2xl border-2 px-2 py-2 text-left transition-all ${
                                   isCurrent
                                     ? 'border-pokeBlue bg-blue-50 text-pokeBlue'
                                     : 'border-slate-100 bg-slate-50 text-slate-600 active:scale-95'
                                 }`}
                               >
                                 <span className="flex items-center gap-1">
                                   <img
                                     src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${teamPoke.isShiny ? 'shiny/' : ''}${teamPoke.id}.png`}
                                     className="w-7 h-7 object-contain shrink-0"
                                     alt=""
                                   />
                                   <span className="min-w-0">
                                     <span className="block text-[9px] font-black uppercase">Pos. {slotIndex + 1}</span>
                                     <span className="block truncate text-[8px] font-bold uppercase opacity-80">
                                       {isCurrent ? 'Atual' : teamPoke.name}
                                     </span>
                                   </span>
                                 </span>
                               </button>
                             );
                           })}
                         </div>
                      </div>
                      <button 
                        onClick={() => { moveToPC(activePokemonDetails.index); setActivePokemonDetails(null); }}
                        className="w-full min-h-[54px] bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 font-black uppercase text-xs hover:scale-[1.02] active:scale-95 transition-all"
                      >
                         Enviar para o PC
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => { moveToTeam(activePokemonDetails.index); setActivePokemonDetails(null); }}
                      className="w-full min-h-[54px] bg-gradient-to-r from-pokeBlue to-blue-600 text-white rounded-2xl shadow-lg flex items-center justify-center gap-3 font-black uppercase text-xs hover:scale-[1.02] active:scale-95 transition-all"
                    >Adicionar ao Time
                    </button>
                  )}
               </div>
           </div>
        </div>
      ), document.body)}
    </div>
  );
};

export default PokemonManagement;


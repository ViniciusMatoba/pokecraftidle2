import React from 'react';
import { MOVE_TRANSLATIONS } from '../data/translations';

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
  setEvolutionPending
}) => {
  const translateMove = (moveName) => {
    return MOVE_TRANSLATIONS[moveName.toLowerCase()] || moveName.replace(/-/g, ' ');
  };

  const moveToPC = (index) => {
    if (gameState.team.length <= 1) return alert("Você precisa de pelo menos um Pokémon no time!");
    setGameState(prev => {
      const poke = prev.team[index];
      const newTeam = prev.team.filter((_, i) => i !== index);
      const newPC = [...(prev.pc || []), poke];
      return { ...prev, team: newTeam, pc: newPC };
    });
    setActivePokemonDetails(null);
  };

  const moveToTeam = (index) => {
    if (gameState.team.length >= 6) return alert("Seu time já está cheio!");
    setGameState(prev => {
      const poke = prev.pc[index];
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
    addLog(`⚔️ ${activePokemonDetails.pokemon.name} aprendeu ${moveObj.name}!`, 'system');
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

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-24 h-full text-left">
      <div className="flex bg-white rounded-2xl p-1 shadow-md border-2 border-slate-100">
         <button onClick={() => setActiveTab('team')} className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'team' ? 'bg-pokeBlue text-white shadow-lg' : 'text-slate-400'}`}>Meu Time ({gameState.team.length}/6)</button>
         <button onClick={() => setActiveTab('pc')} className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'pc' ? 'bg-pokeGold text-white shadow-lg' : 'text-slate-400'}`}>PC Storage ({gameState.pc?.length || 0})</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'team' ? (
          <div className="grid grid-cols-1 gap-3">
            {gameState.team.map((p, i) => (
              <div key={p.instanceId || i} onClick={() => setActivePokemonDetails({ pokemon: p, index: i, location: 'team' })} className="bg-white p-4 rounded-3xl border-2 border-slate-100 flex items-center gap-4 group cursor-pointer hover:border-pokeBlue transition-all">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center relative">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`} className="w-14 h-14 object-contain" alt={p.name} />
                  {p.isShiny && <span className="absolute -top-1 -right-1 text-xs">✨</span>}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black uppercase text-slate-800 text-sm italic leading-none">{p.name}</h4>
                      <div className="flex gap-2 mt-1">
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">ATK: {p.attack}</span>
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">S.ATK: {p.spAtk}</span>
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">SPD: {p.speed}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400">Nv. {p.level}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                    <div className={`h-full ${(p.hp/p.maxHp) > 0.5 ? 'bg-green-500' : (p.hp/p.maxHp) > 0.2 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(p.hp/p.maxHp)*100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {(gameState.pc || []).length === 0 && <p className="col-span-2 text-center py-10 text-slate-400 font-bold uppercase italic">O PC está vazio...</p>}
            {(gameState.pc || []).map((p, i) => (
              <div key={p.instanceId || i} onClick={() => setActivePokemonDetails({ pokemon: p, index: i, location: 'pc' })} className="bg-white p-3 rounded-2xl border-2 border-slate-100 flex flex-col items-center gap-2 group relative cursor-pointer hover:border-pokeGold transition-all">
                 <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`} className="w-12 h-12 object-contain" alt={p.name} />
                 <div className="text-center">
                   <p className="font-black uppercase text-slate-800 text-[10px] italic leading-none">{p.name}</p>
                   <p className="text-[8px] font-bold text-slate-400 mt-0.5">Nv. {p.level}</p>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); moveToTeam(i); }} className="absolute top-1 right-1 bg-blue-50 text-blue-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75">
                   <span className="font-black text-[8px] uppercase">+ Team</span>
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {activePokemonDetails && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
           <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border-b-[12px] border-slate-200 overflow-hidden relative animate-slideInUp h-[85vh] flex flex-col">
               <button onClick={() => setActivePokemonDetails(null)} className="absolute top-4 left-4 bg-white/20 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/30 backdrop-blur-md transition-all z-20 text-white font-black text-xs">
                  ✕
               </button>
               {(() => {
                 const poke = activePokemonDetails.pokemon;
                 const TYPE_THEME = {
                   Grass:    { grad: 'from-green-400 via-emerald-500 to-green-700',    icon: '🌿', badge: 'bg-green-600',   text: 'text-green-100', dots: 'bg-green-300/30' },
                   Fire:     { grad: 'from-orange-400 via-red-500 to-rose-700',        icon: '🔥', badge: 'bg-red-600',     text: 'text-orange-100', dots: 'bg-orange-300/30' },
                   Water:    { grad: 'from-sky-400 via-blue-500 to-blue-700',          icon: '💧', badge: 'bg-blue-600',    text: 'text-sky-100', dots: 'bg-blue-300/30' },
                   Electric: { grad: 'from-yellow-300 via-amber-400 to-yellow-600',    icon: '⚡', badge: 'bg-yellow-500',  text: 'text-yellow-900', dots: 'bg-yellow-200/40' },
                   Poison:   { grad: 'from-purple-400 via-violet-500 to-purple-800',   icon: '☠️', badge: 'bg-purple-700',  text: 'text-purple-100', dots: 'bg-purple-300/30' },
                   Psychic:  { grad: 'from-pink-400 via-fuchsia-500 to-pink-700',      icon: '🔮', badge: 'bg-pink-600',    text: 'text-pink-100', dots: 'bg-pink-300/30' },
                   Rock:     { grad: 'from-stone-400 via-stone-500 to-stone-700',      icon: '🪨', badge: 'bg-stone-600',   text: 'text-stone-100', dots: 'bg-stone-300/30' },
                   Ground:   { grad: 'from-amber-400 via-yellow-600 to-amber-800',     icon: '⛰️', badge: 'bg-amber-700',   text: 'text-amber-100', dots: 'bg-amber-300/30' },
                   Ice:      { grad: 'from-cyan-300 via-sky-400 to-cyan-600',          icon: '❄️', badge: 'bg-cyan-600',    text: 'text-cyan-100', dots: 'bg-cyan-200/30' },
                   Fighting: { grad: 'from-red-500 via-rose-600 to-red-800',           icon: '🥊', badge: 'bg-red-700',     text: 'text-red-100', dots: 'bg-red-300/30' },
                   Bug:      { grad: 'from-lime-400 via-green-500 to-lime-700',        icon: '🐛', badge: 'bg-lime-600',    text: 'text-lime-100', dots: 'bg-lime-300/30' },
                   Ghost:    { grad: 'from-indigo-500 via-violet-700 to-slate-900',    icon: '👻', badge: 'bg-indigo-700',  text: 'text-indigo-100', dots: 'bg-indigo-300/20' },
                   Dragon:   { grad: 'from-blue-600 via-indigo-700 to-violet-900',     icon: '🐉', badge: 'bg-indigo-800',  text: 'text-blue-100', dots: 'bg-blue-300/20' },
                   Dark:     { grad: 'from-slate-600 via-slate-800 to-slate-950',      icon: '🌑', badge: 'bg-slate-800',   text: 'text-slate-200', dots: 'bg-slate-400/20' },
                   Steel:    { grad: 'from-slate-400 via-zinc-500 to-slate-700',       icon: '⚙️', badge: 'bg-zinc-600',    text: 'text-zinc-100', dots: 'bg-zinc-300/30' },
                   Fairy:    { grad: 'from-pink-300 via-rose-400 to-pink-600',         icon: '✨', badge: 'bg-pink-500',    text: 'text-pink-100', dots: 'bg-pink-200/40' },
                   Flying:   { grad: 'from-sky-300 via-indigo-400 to-sky-600',         icon: '🪶', badge: 'bg-sky-600',     text: 'text-sky-100', dots: 'bg-sky-200/30' },
                   Normal:   { grad: 'from-slate-300 via-slate-400 to-slate-600',      icon: '⭐', badge: 'bg-slate-500',   text: 'text-slate-100', dots: 'bg-slate-200/30' },
                 };
                 const theme = TYPE_THEME[poke.type] || TYPE_THEME.Normal;
                 const shinyGrad = poke.isShiny ? 'from-yellow-300 via-amber-400 to-yellow-600' : theme.grad;
                 return (
                   <div className={`h-40 w-full relative flex flex-col items-center justify-end bg-gradient-to-b ${shinyGrad} shadow-inner overflow-hidden`}>
                     <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                     <span className="absolute top-2 right-3 text-4xl opacity-30 select-none pointer-events-none">{poke.isShiny ? '✨' : theme.icon}</span>
                     <span className="absolute top-2 left-12 text-5xl opacity-10 select-none pointer-events-none">{poke.isShiny ? '✨' : theme.icon}</span>
                     <div className={`absolute top-3 right-3 ${poke.isShiny ? 'bg-yellow-500' : theme.badge} px-3 py-1 rounded-full flex items-center gap-1 shadow`}>
                       <span className="text-xs">{poke.isShiny ? '⭐' : theme.icon}</span>
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">{poke.isShiny ? 'Shiny' : poke.type}</span>
                     </div>
                     <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.isShiny ? 'shiny/' : ''}${poke.id}.png`}
                       className={`w-32 h-32 object-contain translate-y-8 relative z-10 drop-shadow-2xl ${poke.isShiny ? 'drop-shadow-[0_0_20px_rgba(234,179,8,0.9)]' : ''}`}
                       alt={poke.name} />
                   </div>
                 );
               })()}
               <div className="flex-1 overflow-y-auto px-8 pt-12 pb-4 custom-scrollbar">
                  <div className="text-center mb-6">
                     <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">{activePokemonDetails.pokemon.name}{activePokemonDetails.pokemon.isShiny && <span className="ml-2 text-yellow-500">⭐</span>}</h3>
                     <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Nv. {activePokemonDetails.pokemon.level}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">{activePokemonDetails.pokemon.type}</span>
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
                   
                   {/* NATUREZAS - SEQUENTIAL UNLOCK */}
                   <div className={`p-3 rounded-xl border-2 transition-all ${masteryCount >= 5 ? 'border-pokeBlue bg-blue-50/50' : 'border-slate-200 bg-slate-50 opacity-60 grayscale'}`}>
                     <div className="flex justify-between items-center mb-2">
                       <h3 className="text-[10px] font-black uppercase text-slate-800">Natureza</h3>
                       {masteryCount < 5 && <span className="text-[8px] font-bold text-red-500 uppercase">Faltam {5 - masteryCount} capturas</span>}
                     </div>
                     <div className="flex flex-col gap-2">
                        <select 
                          value={activePokemonDetails.pokemon.equippedNature || ''} 
                          onChange={(e) => equipNature(e.target.value)}
                          className="w-full bg-white border-2 border-pokeBlue/20 rounded-lg p-2 text-[10px] font-bold text-slate-700 outline-none focus:border-pokeBlue"
                        >
                          <option value="">Padrão (Neutro)</option>
                          {NATURE_LIST.slice(0, Math.floor(masteryCount / 5)).map((name) => {
                            const mods = NATURES[name];
                            return (
                              <option key={name} value={name}>{name} (+{mods.plus.toUpperCase()}, -{mods.minus.toUpperCase()})</option>
                            );
                          })}
                        </select>
                        {masteryCount < 5 && (
                          <div className="bg-slate-200 rounded-lg p-2 text-[10px] font-bold text-slate-400 text-center italic">🔒 Bloqueado</div>
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
                               <p className="text-[10px] font-black uppercase text-slate-800 flex items-center gap-1">{rm.name} {isEquipped && <span className="text-pokeYellow">★</span>}</p>
                               <p className="text-[8px] font-bold text-slate-400 uppercase">{rm.type} • PWR {rm.power}</p>
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
                 </div>

                  {(() => {
                    const poke = activePokemonDetails.pokemon;
                    const allLearned = poke.learnedMoves || poke.moves || [];
                    const equipped = poke.moves || [];
                    const pokeData = POKEDEX[poke.id];
                    const stoneEvol = pokeData?.evolution?.item;
                    const stoneNames = { thunder_stone: 'Thunder Stone', moon_stone: 'Moon Stone', link_cable: 'Link Cable' };
                    const stoneIcons = { thunder_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png', moon_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png', link_cable: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/up-grade.png' };
                    const hasStone = stoneEvol && (gameState.inventory?.items?.[stoneEvol] || 0) > 0;
                    const typeGrad = { Fire:'from-orange-400 to-red-500', Water:'from-sky-400 to-blue-500', Grass:'from-green-400 to-emerald-500', Electric:'from-yellow-300 to-amber-500', Poison:'from-purple-400 to-violet-600', Rock:'from-stone-400 to-stone-600', Fighting:'from-red-400 to-rose-600', Normal:'from-slate-400 to-slate-600', Flying:'from-sky-300 to-indigo-400', Fairy:'from-pink-400 to-rose-400', Bug:'from-lime-400 to-green-500' };
                    return (
                      <>
                        <div className="mt-8 bg-slate-50 p-5 rounded-[2.5rem] border-2 border-slate-100 shadow-inner">
                          <h4 className="font-black uppercase text-[10px] text-slate-400 text-center tracking-widest mb-4 flex items-center justify-center gap-2">
                             <span className="w-8 h-[1px] bg-slate-200"></span>
                             Memória de Movimentos
                             <span className="w-8 h-[1px] bg-slate-200"></span>
                          </h4>
                          <div className="flex justify-between items-center mb-4 px-2">
                             <p className="text-[9px] text-slate-500 font-black uppercase italic">Clique para Equipar/Remover</p>
                             <span className={`text-[10px] font-black px-3 py-1 rounded-full ${equipped.length >= 4 ? 'bg-orange-100 text-orange-600' : 'bg-pokeBlue/10 text-pokeBlue'}`}>
                                {equipped.length}/4 ATIVOS
                             </span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                            {allLearned.length === 0 && <p className="text-[10px] text-slate-400 font-bold italic text-center py-4">Nenhum golpe aprendido ainda...</p>}
                            {allLearned.map((mov, midx) => {
                              const isEquipped = equipped.some(m => m.name === mov.name);
                              const slotIdx = equipped.findIndex(m => m.name === mov.name);
                              const typeColor = typeGrad[mov.type] || 'from-slate-400 to-slate-600';
                              
                              return (
                                <button 
                                  key={midx} 
                                  onClick={() => toggleEquipMove(mov)} 
                                  className={`group flex items-center gap-3 w-full p-3 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${isEquipped ? 'border-transparent bg-gradient-to-r ' + typeColor + ' text-white shadow-md' : 'border-white bg-white hover:border-slate-200 shadow-sm'}`}
                                >
                                  {isEquipped && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${isEquipped ? 'bg-white/30 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                    {isEquipped ? slotIdx + 1 : '—'}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-xs font-black uppercase ${isEquipped ? 'text-white' : 'text-slate-700'}`}>{mov.name}</p>
                                    <div className="flex items-center gap-2">
                                       <p className={`text-[8px] font-bold uppercase ${isEquipped ? 'text-white/80' : 'text-slate-400'}`}>{mov.type}</p>
                                       <span className={`w-1 h-1 rounded-full ${isEquipped ? 'bg-white/40' : 'bg-slate-200'}`}></span>
                                       <p className={`text-[8px] font-black ${isEquipped ? 'text-white' : 'text-slate-500'}`}>PWR {mov.power || '—'}</p>
                                    </div>
                                  </div>
                                  <div className={`transition-all ${isEquipped ? 'scale-110' : 'scale-90 opacity-0 group-hover:opacity-100'}`}>
                                     {isEquipped ? (
                                       <div className="bg-white/20 p-1.5 rounded-lg border border-white/30">
                                          <span className="text-[10px]">✅</span>
                                       </div>
                                     ) : (
                                       <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-[10px] font-black text-slate-400 uppercase">
                                          Equipar
                                       </div>
                                     )}
                                  </div>
                                </button>
                              );
                            })}
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
                                 <p className="text-[11px] font-black text-slate-800 uppercase text-left">Evolução por Pedra</p>
                                 <p className="text-[9px] font-bold text-slate-500 text-left">Requer: {stoneNames[stoneEvol] || stoneEvol}</p>
                               </div>
                               {hasStone && (
                                 <button onClick={() => useStoneEvolution(stoneEvol)} className="bg-gradient-to-br from-yellow-400 to-amber-500 text-white font-black text-[10px] px-4 py-2.5 rounded-xl shadow-lg uppercase hover:scale-105 transition-transform animate-pulse text-center">Evoluir!</button>
                               )}
                             </div>
                          </div>
                        )}
                        <div className="mt-6 border-t-2 border-slate-100 pt-6 overflow-y-auto max-h-64 custom-scrollbar">
                           <h4 className="font-black uppercase text-[10px] text-slate-800 mb-4 flex items-center gap-2">
                             <span className="bg-pokeBlue text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px]">?</span>
                             Guia de Treinamento e Evolução
                           </h4>

                           {/* Evolução */}
                           <div className="bg-slate-50 p-4 rounded-2xl mb-4 border-2 border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-1 text-left">Próxima Evolução</p>
                             {pokeData?.evolution ? (
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                                     <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeData.evolution.id}.png`} className="w-full h-full object-contain" alt="Evo" />
                                  </div>
                                  <div className="text-left">
                                     <p className="text-xs font-black text-slate-800 uppercase italic leading-none">{POKEDEX[pokeData.evolution.id]?.name || '???'}</p>
                                     <p className="text-[9px] font-bold text-pokeBlue mt-1 uppercase tracking-widest">
                                        {pokeData.evolution.level ? `Nível ${pokeData.evolution.level}` : `Requer Item Especial`}
                                     </p>
                                  </div>
                               </div>
                             ) : (
                               <p className="text-xs font-bold text-slate-400 italic text-left">Este Pokémon atingiu sua forma final.</p>
                             )}
                           </div>

                           {/* Próximos Golpes */}
                           <div className="bg-slate-50 p-4 rounded-2xl mb-4 border-2 border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-2 text-left">Próximos Golpes por Level</p>
                             <div className="flex flex-col gap-2">
                               {pokeData?.learnset?.filter(m => m.level > poke.level).length === 0 && (
                                 <p className="text-[10px] font-bold text-slate-400 italic text-left">Não há mais golpes para aprender por nível.</p>
                               )}
                               {pokeData?.learnset?.filter(m => m.level > poke.level).sort((a,b) => a.level - b.level).slice(0, 3).map((m, idx) => (
                                 <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-700 uppercase italic">Nv. {m.level} — {translateMove(m.move)}</span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase">Aprenderá</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                        </div>
                      </>
                    );
                  })()}
               </div>
               
               {/* BOTÃO DE AÇÃO NO RODAPÉ — dentro do flex column */}
               <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-slate-100 flex gap-3">
                  {activePokemonDetails.location === 'team' ? (
                    <>
                      <div className="flex flex-col gap-1 w-20">
                         <button onClick={() => moveUp(activePokemonDetails.index)} disabled={activePokemonDetails.index === 0} className="w-full bg-slate-100 text-slate-500 py-2 rounded-xl font-black text-xs hover:bg-slate-200 disabled:opacity-50 transition-all">⬆️</button>
                         <button onClick={() => moveDown(activePokemonDetails.index)} disabled={activePokemonDetails.index === gameState.team.length - 1} className="w-full bg-slate-100 text-slate-500 py-2 rounded-xl font-black text-xs hover:bg-slate-200 disabled:opacity-50 transition-all">⬇️</button>
                      </div>
                      <button 
                        onClick={() => { moveToPC(activePokemonDetails.index); setActivePokemonDetails(null); }}
                        className="flex-1 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-[2rem] shadow-lg flex items-center justify-center gap-2 font-black uppercase text-xs hover:scale-[1.02] active:scale-95 transition-all py-4"
                      >
                         <span className="text-lg">💻</span>
                         Enviar para o PC
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => { moveToTeam(activePokemonDetails.index); setActivePokemonDetails(null); }}
                      className="w-full bg-gradient-to-r from-pokeBlue to-blue-600 text-white py-4 rounded-[2rem] shadow-lg flex items-center justify-center gap-3 font-black uppercase text-xs hover:scale-[1.02] active:scale-95 transition-all"
                    >
                       ➕ Adicionar ao Time
                    </button>
                  )}
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PokemonManagement;

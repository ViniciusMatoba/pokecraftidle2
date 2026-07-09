import React, { useState, useEffect, useMemo } from 'react';
import {
  PLANTABLE_ITEMS,
  HOUSE_SLOT_EXPANSIONS,
  CARETAKER_TYPES,
  CARETAKER_BONUSES,
  
  calcCombinedCaretakerBonus,
} from '../data/house';
import { TROPHIES } from '../data/prestige';

const HouseScreen = ({ 
  gameState, 
  onClose, 
  onPlant, 
  onHarvest, 
  onBuySlot, 
  onAssignCaretaker, 
  onRemoveCaretaker,
  onBuySeed,
}) => {
  const [activeTab, setActiveTab] = useState('garden'); // 'garden', 'caretakers', 'shop'
  const [showPlantPicker, setShowPlantPicker] = useState(null);
  const [showCaretakerPicker, setShowCaretakerPicker] = useState(false);
  const [selectedPokemonForDetails, setSelectedPokemonForDetails] = useState(null);
  const [selectedPlantForConfirmation, setSelectedPlantForConfirmation] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const house = gameState.house || { slots: [], caretakers: [], totalSlots: 4 };
  const caretakers = house.caretakers || [];
  
  // Garantir que slots tenha o tamanho correto
  const totalSlots = house.totalSlots || 4;
  const slots = useMemo(() => {
    const arr = new Array(totalSlots).fill(null);
    (house.slots || []).forEach((s, i) => {
      if (i < totalSlots) arr[i] = s;
    });
    return arr;
  }, [house.slots, totalSlots]);

  const caretakerBonus = useMemo(() => calcCombinedCaretakerBonus(caretakers), [caretakers]);

  // Lista de Pokémons no PC que podem ser cuidadores
  const availablePokemons = useMemo(() => {
    return (gameState.pc || []).filter(p => 
      CARETAKER_TYPES.includes(p.type) || (p.types || []).some(t => CARETAKER_TYPES.includes(t))
    );
  }, [gameState.pc]);

  // Lista de sementes disponíveis no inventário
  const availablePlants = useMemo(() => {
    const inventoryItems = gameState.inventory?.items || {};
    const inventoryMaterials = gameState.inventory?.materials || {};
    return Object.entries(PLANTABLE_ITEMS).filter(([id, _plant]) => {
      // Verifica em ambas as abas do inventário (alguns itens são classificados como materiais)
      return (inventoryItems[id] || 0) > 0 || (inventoryMaterials[id] || 0) > 0;
    });
  }, [gameState.inventory?.items, gameState.inventory?.materials]);

  return (
    <div className="absolute inset-0 z-[2000] bg-[#1a1c2c] flex flex-col animate-fadeIn">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all active:scale-90"
          >
            <span className="text-xl text-white">←</span>
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Minha Casa</h2>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">Refúgio do Treinador</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-5 h-5" alt="" />
          <span className="text-sm font-black text-amber-400">{(gameState.currency || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 flex px-6 py-4 gap-2">
        {[
          { id: 'garden', label: 'Jardim', icon: '🌱' },
          { id: 'caretakers', label: 'Cuidadores', icon: '🧑‍🌾' },
          { id: 'trophies', label: 'Troféus', icon: '🏆' },
          { id: 'shop', label: 'Expandir', icon: '🏗️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 border-b-4 ${
              activeTab === tab.id 
              ? 'bg-white text-[#1a1c2c] border-white/20' 
              : 'bg-white/5 text-white/60 border-black/40 hover:bg-white/10'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-24 custom-scrollbar">
        {activeTab === 'garden' && (
          <div className="animate-slideUp">
            <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-6 backdrop-blur-sm mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Seu Cultivo</h3>
                <span className="text-[9px] font-bold text-white/40 uppercase bg-white/5 px-3 py-1 rounded-full">
                  {slots.filter(s => s).length} / {slots.length} Ocupados
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {slots.map((slot, idx) => {
                  const plant = slot ? PLANTABLE_ITEMS[slot.plantId] : null;
                  const isReady = slot && now >= slot.plantedAt + slot.growthTime;
                  const progress = slot ? Math.min(100, ((now - slot.plantedAt) / slot.growthTime) * 100) : 0;
                  
                  return (
                    <div 
                      key={idx}
                      className={`relative aspect-square rounded-[2rem] border-2 transition-all overflow-hidden shadow-2xl ${
                        slot 
                        ? (isReady ? 'border-amber-400/50 bg-amber-900/20' : 'border-white/10 bg-black/40') 
                        : 'border-[#5d4037]/50 bg-[#3d2b1f]/80 hover:bg-[#4e342e] cursor-pointer'
                      }`}
                      onClick={() => {
                        if (!slot) setShowPlantPicker(idx);
                        else if (isReady) onHarvest(idx);
                      }}
                    >
                      {!slot && (
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '4px 4px' }} />
                      )}

                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        {!slot ? (
                          <div className="flex flex-col items-center gap-1 opacity-40">
                            <span className="text-3xl grayscale">🕳️</span>
                            <span className="text-[8px] font-black text-white uppercase">Vazio</span>
                          </div>
                        ) : (
                          <>
                            <div className="relative">
                              <img 
                                src={plant?.img} 
                                className={`w-16 h-16 object-contain drop-shadow-2xl transition-all ${isReady ? 'scale-110' : 'opacity-40 grayscale scale-90'}`}
                                alt=""
                              />
                              {isReady && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                  <span className="text-lg">🧺</span>
                                </div>
                              )}
                              {!isReady && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                                  <span className="text-xl animate-pulse">🌱</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="absolute bottom-4 left-4 right-4 z-10">
                              {!isReady && (
                                <div className="bg-black/60 backdrop-blur-md rounded-full h-1.5 overflow-hidden border border-white/10 mb-2">
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              )}
                              <div className="flex justify-between items-center text-[7px] font-black text-white/50 uppercase px-1">
                                <span>{isReady ? 'Pronto!' : 'Crescendo...'}</span>
                                {!isReady && <span>{progress.toFixed(0)}%</span>}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#2a2d3e] to-[#1a1c2c] p-6 rounded-[2.5rem] border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚡</span>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Eficiência do Jardim</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-bold text-white/40 uppercase mb-1">Crescimento</p>
                  <p className="text-lg font-black text-emerald-400">+{((caretakerBonus.growthMult - 1) * 100).toFixed(0)}%</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-bold text-white/40 uppercase mb-1">Rendimento</p>
                  <p className="text-lg font-black text-blue-400">+{((caretakerBonus.yieldMult - 1) * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'caretakers' && (
          <div className="animate-slideUp flex flex-col gap-6">
            <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 text-center backdrop-blur-sm">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/20 shadow-inner">
                <span className="text-5xl">👷</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase mb-4">Cuidadores do Jardim</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                Pokémons dos tipos <span className="text-emerald-400 font-bold underline decoration-emerald-400/30">GRASS</span>, 
                <span className="text-blue-400 font-bold underline decoration-blue-400/30"> WATER</span> ou 
                <span className="text-amber-400 font-bold underline decoration-amber-400/30"> NORMAL</span> 
                ajudam suas plantas a crescerem mais rápido e renderem mais frutos.
              </p>
              
              <button 
                onClick={() => setShowCaretakerPicker(true)}
                className="w-full bg-white text-[#1a1c2c] py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-white/90 transition-all active:scale-95 border-b-4 border-slate-300"
              >
                Gerenciar Equipe
              </button>
            </div>

            {/* Lista de Cuidadores Ativos */}
            <div className="grid gap-3">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] px-2 mb-2">Cuidadores Ativos</h4>
              {caretakers.length === 0 ? (
                <div className="bg-white/5 p-6 rounded-3xl border border-dashed border-white/10 text-center">
                  <p className="text-[10px] font-black text-white/20 uppercase">Nenhum Pokémon cuidando no momento</p>
                </div>
              ) : (
                caretakers.map((p) => (
                  <div key={p.instanceId} className="bg-white/10 p-4 rounded-3xl border border-white/10 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10">
                        <img src={p.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} className="w-10 h-10 object-contain" alt="" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-tighter">{p.name}</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase">Nível {p.level} • {(p.types || [p.type]).join(' / ')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveCaretaker(p.instanceId)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="animate-slideUp">
             <div className="grid gap-4">
               {HOUSE_SLOT_EXPANSIONS.map((exp, i) => {
                 const isBought = totalSlots >= exp.totalSlots;
                 const canBuy = (gameState.currency || 0) >= exp.cost;
                 
                 return (
                   <div key={i} className={`p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all ${isBought ? 'bg-white/5 border-white/10 opacity-60' : 'bg-white/10 border-white/20 shadow-xl'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10">
                          <span className="text-xl">🏗️</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-tighter">{exp.label}</p>
                          <p className="text-[10px] font-bold text-white/40 uppercase">Total: {exp.totalSlots} canteiros</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isBought ? (
                          <span className="text-[10px] font-black text-emerald-400 uppercase">Adquirido</span>
                        ) : (
                          <button 
                            onClick={() => onBuySlot(exp)}
                            disabled={!canBuy}
                            className={`text-black text-[10px] font-black px-5 py-2 rounded-xl uppercase shadow-lg border-b-4 transition-all ${
                              canBuy 
                              ? 'bg-amber-400 border-amber-600 hover:bg-amber-300 active:border-b-0 active:translate-y-1' 
                              : 'bg-slate-400 border-slate-600 opacity-50 grayscale'
                            }`}
                          >
                             {exp.cost.toLocaleString()} <span className="text-[8px]">Coins</span>
                          </button>
                        )}
                      </div>
                   </div>
                 );
               })}
             </div>

             {/* Loja de sementes */}
             <div className="mt-8 mb-8">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 px-2">
                  🌰 Comprar Sementes
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(PLANTABLE_ITEMS).map(([id, plant]) => {
                    const canBuy = (gameState.currency || 0) >= plant.cost;
                    return (
                      <div key={id} className={`p-4 rounded-3xl border transition-all ${canBuy ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 opacity-60'}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <img src={plant.img} className="w-10 h-10 object-contain" alt="" />
                          <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{plant.name}</p>
                            <p className="text-[8px] text-white/40 mt-1">{plant.growthTime}min</p>
                          </div>
                        </div>
                        <button
                          disabled={!canBuy}
                          onClick={() => onBuySeed(id, plant.cost)}
                          className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${
                            canBuy
                            ? 'bg-amber-400 text-black border-b-2 border-amber-600 active:border-b-0 active:translate-y-0.5'
                            : 'bg-slate-700 text-slate-500'
                          }`}
                        >
                          {plant.cost.toLocaleString()} <span className="text-[7px]">Coins</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'trophies' && (
          <div className="animate-slideUp pb-10">
            <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-6 backdrop-blur-sm mb-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 px-2">Galeria de Troféus</h3>
              
              {(gameState.prestige?.trophies || []).length === 0 ? (
                <div className="py-12 text-center bg-black/20 rounded-3xl border border-dashed border-white/5">
                  <span className="text-4xl opacity-20 grayscale block mb-4">🏆</span>
                  <p className="text-[10px] font-black text-white/20 uppercase">Sua estante está vazia.</p>
                  <p className="text-[9px] text-white/10 uppercase mt-1">Conquiste troféus na Loja de Prestígio!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {gameState.prestige.trophies.map(trophyId => {
                    const trophy = TROPHIES[trophyId];
                    if (!trophy) return null;
                    return (
                      <div key={trophyId} className="bg-gradient-to-b from-white/10 to-transparent p-6 rounded-[2rem] border border-white/10 flex flex-col items-center text-center shadow-xl">
                        <span className="text-4xl mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{trophy.icon}</span>
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-tight mb-1">{trophy.name}</p>
                        <p className="text-[8px] text-white/40 uppercase leading-none">{trophyId.replace('_', ' ')}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-amber-400/5 p-6 rounded-[2rem] border border-amber-400/10">
              <p className="text-[10px] font-bold text-amber-400/60 uppercase tracking-widest text-center">
                Os troféus são exibidos para todos que visitarem sua casa!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Plant Picker Modal */}
      {showPlantPicker !== null && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowPlantPicker(null)} />
          <div className="relative w-full max-w-sm bg-[#1a1c2c] rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-bounceIn">
            <div className="bg-white/10 px-12 py-7 border-b border-white/10 flex items-center justify-between">
              <h4 className="text-xl font-black text-white uppercase tracking-tighter ml-10">O que plantar?</h4>
              <button 
                onClick={() => setShowPlantPicker(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar max-h-[60vh]">
              {availablePlants.length === 0 ? (
                <div className="py-10 px-6 text-center animate-fadeIn">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <span className="text-4xl">🎒</span>
                  </div>
                  <h5 className="text-white font-black uppercase tracking-tighter mb-4">Sem sementes no momento!</h5>
                  <div className="bg-white/5 p-5 rounded-3xl border border-white/10 text-left">
                    <p className="text-[10px] font-bold text-white/40 uppercase mb-3">Como conseguir:</p>
                    <ul className="flex flex-col gap-3">
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-400">🌿</span>
                        <p className="text-[11px] text-white/70 leading-tight font-medium">Explore as <span className="text-white font-bold">ROTAS</span> para encontrar Berries selvagens.</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-blue-400">🚢</span>
                        <p className="text-[11px] text-white/70 leading-tight font-medium">Envie Pokémons em <span className="text-white font-bold">EXPEDIÇÕES</span> para trazer recursos.</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-400">✨</span>
                        <p className="text-[11px] text-white/70 leading-tight font-medium">Sementes raras podem cair de <span className="text-white font-bold">BOSSES</span> e Treinadores.</p>
                      </li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setShowPlantPicker(null)}
                    className="mt-8 w-full bg-white/10 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all"
                  >
                    Entendi
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availablePlants.map(([id, plant]) => (
                    <button
                      key={id}
                      onClick={() => setSelectedPlantForConfirmation({ id, ...plant })}
                      className="bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center gap-2 group relative"
                    >
                      <div className="absolute top-1 right-1 bg-emerald-500 text-white text-[12px] font-black px-2.5 py-1 rounded-lg shadow-lg border border-white/20 z-10">
                        x{(gameState.inventory?.items?.[id] || 0) + (gameState.inventory?.materials?.[id] || 0)}
                      </div>
                      <img src={plant.img} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" alt="" />
                      <p className="text-[9px] font-black text-white uppercase tracking-tighter">{plant.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plant Confirmation Modal */}
      {selectedPlantForConfirmation && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedPlantForConfirmation(null)} />
          <div className="relative w-full max-w-xs bg-[#1a1c2c] rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden animate-bounceIn flex flex-col">
            <div className="p-8 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/10 shadow-inner relative">
                <img 
                  src={selectedPlantForConfirmation.img} 
                  className="w-16 h-16 object-contain" 
                  alt="" 
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[14px] font-black px-4 py-1.5 rounded-xl shadow-xl border-2 border-[#1a1c2c] z-10">
                  x{(gameState.inventory?.items?.[selectedPlantForConfirmation.id] || 0) + (gameState.inventory?.materials?.[selectedPlantForConfirmation.id] || 0)}
                </div>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{selectedPlantForConfirmation.name}</h3>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-6">Pronto para Plantar</p>
              
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 text-left mb-8 space-y-4">
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-wider mb-2">Efeito:</p>
                  <p className="text-sm text-white/80 leading-relaxed font-medium">
                    {selectedPlantForConfirmation.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-wider mb-1">Tempo de Crescimento:</p>
                    <p className="text-sm text-white font-black">{selectedPlantForConfirmation.growthTime} minutos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-wider mb-1">Rendimento:</p>
                    <p className="text-sm text-white font-black">{selectedPlantForConfirmation.yield.min}-{selectedPlantForConfirmation.yield.max} frutos</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    onPlant(showPlantPicker, selectedPlantForConfirmation.id);
                    setSelectedPlantForConfirmation(null);
                    setShowPlantPicker(null);
                  }}
                  className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-[0_8px_20px_rgba(16,185,129,0.3)] border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                  Confirmar Plantio
                </button>
                <button 
                  onClick={() => setSelectedPlantForConfirmation(null)}
                  className="w-full bg-white/5 text-white/60 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Caretaker Picker Modal */}
      {showCaretakerPicker && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowCaretakerPicker(false)} />
          <div className="relative w-full max-w-sm bg-[#1a1c2c] rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-bounceIn flex flex-col max-h-[85vh]">
            <div className="bg-white/10 px-12 py-7 border-b border-white/10 flex items-center justify-between">
              <h4 className="text-xl font-black text-white uppercase tracking-tighter ml-10">Escolher Cuidador</h4>
              <button 
                onClick={() => setShowCaretakerPicker(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 bg-amber-400/10 border-b border-amber-400/20">
              <div className="flex items-center gap-3">
                <span className="text-xl">💡</span>
                <p className="text-[10px] font-black text-amber-200 uppercase tracking-tighter leading-tight">
                  Pokémons de <span className="text-emerald-400">GRAMA</span>, <span className="text-blue-400">ÁGUA</span> e <span className="text-slate-300">NORMAL</span> são recomendados!
                </p>
              </div>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-2">
              {availablePokemons.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-white/40">Nenhum Pokémon compatível no seu PC.</p>
                </div>
              ) : (
                availablePokemons.map((p) => {
                  const isRecommended = CARETAKER_TYPES.includes(p.type) || (p.types || []).some(t => CARETAKER_TYPES.includes(t));
                  return (
                    <button
                      key={p.instanceId}
                      onClick={() => setSelectedPokemonForDetails(p)}
                      className="bg-white/5 p-4 rounded-3xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                          <img src={p.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} className="w-10 h-10 object-contain" alt="" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tighter">{p.name}</p>
                          <p className="text-[9px] font-bold text-white/40 uppercase">Nível {p.level} • {(p.types || [p.type]).join(' / ')}</p>
                        </div>
                      </div>
                      {isRecommended && (
                        <span className="bg-amber-400 text-black text-[7px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                          Recomendado
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Caretaker Details Modal */}
      {selectedPokemonForDetails && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedPokemonForDetails(null)} />
          <div className="relative w-full max-w-xs bg-[#1a1c2c] rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden animate-bounceIn flex flex-col">
            <div className="p-8 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/10 shadow-inner">
                <img 
                  src={selectedPokemonForDetails.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemonForDetails.id}.png`} 
                  className="w-16 h-16 object-contain" 
                  alt="" 
                />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{selectedPokemonForDetails.name}</h3>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">Tipo {(selectedPokemonForDetails.types || [selectedPokemonForDetails.type]).join(' / ')}</p>
              
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 text-left mb-8">
                <p className="text-[9px] font-black text-amber-400 uppercase tracking-wider mb-2">Função no Jardim:</p>
                <p className="text-sm text-white/80 leading-relaxed font-medium">
                  {selectedPokemonForDetails.type === 'Grass' && "🌿 Acelera o crescimento das plantas em 50%, permitindo colheitas muito mais frequentes."}
                  {selectedPokemonForDetails.type === 'Water' && "💧 Melhora a irrigação, aumentando o rendimento das colheitas em 50%."}
                  {selectedPokemonForDetails.type === 'Normal' && "⚖️ Ajuda em tudo! Aumenta tanto o crescimento quanto o rendimento em 20%."}
                  {selectedPokemonForDetails.type === 'Bug' && "🦟 Atua no controle de pragas, aumentando em 15% a chance de encontrar itens raros na colheita."}
                  {selectedPokemonForDetails.type === 'Fairy' && "✨ Impregna o solo com magia, dando 10% de chance de encontrar itens místicos especiais."}
                  {!['Grass','Water','Normal','Bug','Fairy'].includes(selectedPokemonForDetails.type) && "🌱 Ajuda na manutenção básica do jardim, mas não possui bônus especializados."}
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedPokemonForDetails(null)}
                  className="flex-1 bg-white/5 text-white/60 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                >
                  Voltar
                </button>
                <button 
                  onClick={() => {
                    onAssignCaretaker(selectedPokemonForDetails);
                    setSelectedPokemonForDetails(null);
                    setShowCaretakerPicker(false);
                  }}
                  className="flex-[2] bg-amber-400 text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all"
                >
                  Escalar Pokémon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default HouseScreen;

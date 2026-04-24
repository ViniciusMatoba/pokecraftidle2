import React, { useState, useEffect } from 'react';
import {
  PLANTABLE_ITEMS,
  HOUSE_SLOT_EXPANSIONS,
  CARETAKER_TYPES,
  CARETAKER_BONUSES,
  calcGrowthTime,
  calcCombinedCaretakerBonus,
} from '../data/house';

const formatTime = (ms) => {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
};

const PlantCard = ({ slot, slotIndex, caretakerBonus, onPlant, onHarvest, now }) => {
  if (!slot) {
    return (
      <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px] gap-2">
        <p className="text-3xl">🌱</p>
        <p className="text-amber-600 text-[10px] font-black uppercase">Canteiro vazio</p>
        <button
          onClick={() => onPlant(slotIndex)}
          className="bg-green-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase hover:bg-green-400 transition-all active:scale-95"
        >
          + Plantar
        </button>
      </div>
    );
  }

  const plant    = PLANTABLE_ITEMS[slot.plantId];
  const endsAt   = slot.plantedAt + slot.growthTime;
  const done     = now >= endsAt;
  const remaining = Math.max(0, endsAt - now);
  const pct      = done ? 100 : Math.floor(((now - slot.plantedAt) / slot.growthTime) * 100);
  const stage    = pct < 33 ? '🌱' : pct < 66 ? '🌿' : done ? '🌾' : '🌱';

  return (
    <div className={`rounded-2xl p-3 border-2 transition-all ${done ? 'border-green-400 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
      <div className="flex items-center gap-2 mb-2">
        <img
          src={plant?.img}
          alt={plant?.name}
          className="w-8 h-8 object-contain"
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div className="flex-1">
          <p className="text-[10px] font-black text-slate-700 uppercase leading-none">{plant?.name}</p>
          <p className="text-[9px] text-slate-400">{stage} {done ? 'Pronto!' : formatTime(remaining)}</p>
        </div>
      </div>

      <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all ${done ? 'bg-green-500' : 'bg-amber-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {done && (
        <button
          onClick={() => onHarvest(slotIndex)}
          className="w-full bg-green-500 text-white text-[10px] font-black py-2 rounded-xl uppercase hover:bg-green-400 transition-all active:scale-95"
        >
          🌾 Colher!
        </button>
      )}
    </div>
  );
};

const HouseScreen = ({ gameState, onClose, onPlant, onHarvest, onBuySlot, onAssignCaretaker, onRemoveCaretaker }) => {
  const [now, setNow]             = useState(Date.now());
  const [activeTab, setActiveTab] = useState('garden');
  const [showPlantPicker, setShowPlantPicker] = useState(null);
  const [showCaretakerPicker, setShowCaretakerPicker] = useState(false);
  const [plantFilter, setPlantFilter] = useState('all');

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const house       = gameState.house || {};
  const slots       = house.slots || [];
  const caretakers  = house.caretakers || [];
  const totalSlots  = house.totalSlots || 4;
  const caretakerBonus = calcCombinedCaretakerBonus(caretakers);

  // Próxima expansão disponível
  const nextExpansion = HOUSE_SLOT_EXPANSIONS.find(e => e.totalSlots > totalSlots);
  const canBuySlot = nextExpansion &&
    gameState.currency >= nextExpansion.cost &&
    caretakers.length >= nextExpansion.pokemonRequired;

  // Pokémon do PC elegíveis para cuidadores
  const eligiblePC = (gameState.pc || []).filter(p =>
    CARETAKER_TYPES.includes(p.type) &&
    !caretakers.find(c => c.instanceId === p.instanceId)
  );

  const readyCount = slots.filter(s => s && now >= s.plantedAt + s.growthTime).length;

  return (
    <div className="fixed inset-0 z-[110] flex flex-col bg-amber-950 animate-fadeIn">

      {/* Header */}
      <div
        className="shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #78350f 0%, #92400e 50%, #451a03 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(#fff 1px,transparent 1px)', backgroundSize: '20px 20px' }}
        />
        <div className="relative z-10 flex items-center gap-3 p-4">
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl transition-all active:scale-95"
          >
            ←
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
              🏠 Minha Casa
            </h2>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
              {totalSlots} canteiros • {caretakers.length} cuidadores
              {readyCount > 0 && <span className="text-green-400 ml-2">• {readyCount} prontos!</span>}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-[9px] uppercase">Saldo</p>
            <p className="text-yellow-400 font-black text-sm">💰 {(gameState.currency || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pb-3 gap-2">
          {[
            { id: 'garden',    label: '🌱 Jardim'     },
            { id: 'caretakers',label: '🐾 Cuidadores' },
            { id: 'expand',    label: '🏗️ Expandir'  },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-amber-900'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* ── JARDIM ─────────────────────────────────────────── */}
        {activeTab === 'garden' && (
          <div className="flex flex-col gap-4">

            {/* Bônus dos cuidadores */}
            {caretakers.length > 0 && (
              <div className="bg-green-900/30 border border-green-700/40 rounded-2xl p-3 flex flex-wrap gap-2">
                <p className="w-full text-[9px] font-black text-green-400 uppercase tracking-widest">Bônus Ativos</p>
                {caretakerBonus.growthMult > 1  && <span className="text-[9px] bg-green-500/20 text-green-300 px-2 py-1 rounded-full font-bold">🌿 Crescimento x{caretakerBonus.growthMult.toFixed(1)}</span>}
                {caretakerBonus.yieldMult > 1   && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full font-bold">💧 Rendimento x{caretakerBonus.yieldMult.toFixed(1)}</span>}
                {caretakerBonus.rarityBonus > 0 && <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full font-bold">🐛 Raro +{(caretakerBonus.rarityBonus*100).toFixed(0)}%</span>}
                {caretakerBonus.specialBonus > 0 && <span className="text-[9px] bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full font-bold">✨ Especial +{(caretakerBonus.specialBonus*100).toFixed(0)}%</span>}
              </div>
            )}

            {/* Grid de canteiros */}
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: totalSlots }).map((_, i) => (
                <PlantCard
                  key={i}
                  slot={slots[i] || null}
                  slotIndex={i}
                  caretakerBonus={caretakerBonus}
                  onPlant={() => setShowPlantPicker(i)}
                  onHarvest={onHarvest}
                  now={now}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── CUIDADORES ─────────────────────────────────────── */}
        {activeTab === 'caretakers' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-white font-black text-sm uppercase mb-1">Como funciona</p>
              <p className="text-white/60 text-xs leading-relaxed">
                Pokémon do tipo Grama, Água, Normal, Inseto ou Fada podem cuidar do jardim.
                Cada tipo dá um bônus diferente. Você precisa de cuidadores suficientes para expandir os canteiros.
              </p>
            </div>

            {/* Tipos de bônus */}
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(CARETAKER_BONUSES).map(([type, bonus]) => (
                <div key={type} className="bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                    {type === 'Grass' ? '🌿' : type === 'Water' ? '💧' : type === 'Normal' ? '⚖️' : type === 'Bug' ? '🐛' : '✨'}
                  </div>
                  <div>
                    <p className="text-white font-black text-xs uppercase">{type}</p>
                    <p className="text-white/50 text-[9px]">{bonus.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cuidadores ativos */}
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
              Cuidadores Ativos ({caretakers.length}/{nextExpansion?.pokemonRequired || caretakers.length})
            </p>

            {caretakers.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10">
                <p className="text-4xl mb-2">🐾</p>
                <p className="text-white/30 text-xs">Nenhum cuidador designado ainda</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {caretakers.map(p => (
                  <div key={p.instanceId} className="bg-white/10 rounded-2xl p-3 flex items-center gap-2 border border-white/10">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`}
                      className="w-10 h-10 object-contain"
                      alt={p.name}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-black text-xs truncate">{p.name}</p>
                      <p className="text-white/50 text-[9px]">Nv.{p.level} • {p.type}</p>
                    </div>
                    <button
                      onClick={() => onRemoveCaretaker(p.instanceId)}
                      className="text-white/30 hover:text-red-400 text-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {eligiblePC.length > 0 && (
              <button
                onClick={() => setShowCaretakerPicker(true)}
                className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase text-sm hover:bg-green-500 transition-all active:scale-95"
              >
                + Designar Cuidador do PC
              </button>
            )}
          </div>
        )}

        {/* ── EXPANDIR ───────────────────────────────────────── */}
        {activeTab === 'expand' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-white font-black text-sm uppercase mb-1">Canteiros atuais: {totalSlots}</p>
              <p className="text-white/60 text-xs">Mais canteiros = mais colheitas simultâneas. Cada expansão exige mais cuidadores.</p>
            </div>

            {HOUSE_SLOT_EXPANSIONS.filter(e => e.totalSlots > 4).map((exp, i) => {
              const owned    = exp.totalSlots <= totalSlots;
              const isNext   = exp.totalSlots === (nextExpansion?.totalSlots);
              const hasPokemons = caretakers.length >= exp.pokemonRequired;
              const hasMoney    = gameState.currency >= exp.cost;
              const canBuy   = isNext && hasPokemons && hasMoney;

              return (
                <div
                  key={i}
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    owned    ? 'border-green-500/50 bg-green-500/10 opacity-60' :
                    isNext   ? 'border-amber-400/50 bg-amber-500/10' :
                               'border-white/10 bg-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-black text-sm uppercase">
                      {owned ? '✅ ' : ''}{exp.label}
                    </p>
                    <p className="text-yellow-400 font-black text-sm">
                      {owned ? 'Comprado' : `💰 ${exp.cost.toLocaleString()}`}
                    </p>
                  </div>
                  {!owned && (
                    <>
                      <p className={`text-[10px] font-bold mb-3 ${hasPokemons ? 'text-green-400' : 'text-red-400'}`}>
                        🐾 Requer {exp.pokemonRequired} cuidadores ({caretakers.length} atuais)
                        {!hasPokemons && ' — Designe mais cuidadores!'}
                      </p>
                      {isNext && (
                        <button
                          disabled={!canBuy}
                          onClick={() => onBuySlot(exp)}
                          className={`w-full py-3 rounded-xl font-black uppercase text-sm transition-all ${
                            canBuy
                              ? 'bg-amber-500 text-white hover:bg-amber-400 active:scale-95'
                              : 'bg-white/10 text-white/30 cursor-not-allowed'
                          }`}
                        >
                          {!hasMoney ? '💰 Coins insuficientes' :
                           !hasPokemons ? '🐾 Pokémon insuficientes' :
                           'Expandir!'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Escolher planta */}
      {showPlantPicker !== null && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-amber-950 rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <p className="text-white font-black text-base uppercase">Escolha o que plantar</p>
              <button onClick={() => setShowPlantPicker(null)} className="text-white/40 hover:text-white text-2xl">✕</button>
            </div>

            <div className="flex gap-2 px-4 py-3 shrink-0">
              {['all','berry','apricorn'].map(f => (
                <button
                  key={f}
                  onClick={() => setPlantFilter(f)}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${plantFilter === f ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/50'}`}
                >
                  {f === 'all' ? 'Tudo' : f === 'berry' ? '🍒 Berries' : '🌰 Apricorns'}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto p-4 flex flex-col gap-2">
              {Object.values(PLANTABLE_ITEMS)
                .filter(p => plantFilter === 'all' || p.type === plantFilter)
                .map(plant => {
                  const growthMs   = calcGrowthTime(plant, caretakerBonus);
                  const hasSeed    = (gameState.inventory?.materials?.[plant.seed] || 0) > 0 ||
                                     (gameState.inventory?.items?.[plant.seed] || 0) > 0;
                  const canAfford  = gameState.currency >= plant.cost;
                  const canPlant   = hasSeed || canAfford;

                  return (
                    <button
                      key={plant.id}
                      disabled={!canPlant}
                      onClick={() => {
                        onPlant(showPlantPicker, plant.id);
                        setShowPlantPicker(null);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                        canPlant
                          ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 active:scale-95'
                          : 'border-white/5 bg-white/3 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <img src={plant.img} alt={plant.name} className="w-10 h-10 object-contain shrink-0" onError={e=>{e.target.style.display='none'}}/>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-black text-xs">{plant.name}</p>
                        <p className="text-white/50 text-[9px] leading-tight">{plant.description}</p>
                        <p className="text-amber-400 text-[9px] font-bold mt-0.5">
                          ⏱️ {formatTime(growthMs)} • 💰 {plant.cost} coins
                        </p>
                      </div>
                      {hasSeed && <span className="text-green-400 text-[9px] font-black shrink-0">Semente ✓</span>}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Escolher cuidador */}
      {showCaretakerPicker && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <p className="text-white font-black text-base uppercase">Escolher Cuidador</p>
              <button onClick={() => setShowCaretakerPicker(false)} className="text-white/40 hover:text-white text-2xl">✕</button>
            </div>
            <div className="overflow-y-auto p-4 grid grid-cols-2 gap-2">
              {eligiblePC.map(p => (
                <button
                  key={p.instanceId}
                  onClick={() => {
                    onAssignCaretaker(p);
                    setShowCaretakerPicker(false);
                  }}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-2xl p-3 border border-white/10 transition-all active:scale-95"
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`}
                    className="w-10 h-10 object-contain"
                    alt={p.name}
                  />
                  <div className="text-left">
                    <p className="text-white font-black text-xs">{p.name}</p>
                    <p className="text-white/50 text-[9px]">Nv.{p.level}</p>
                    <p className="text-green-400 text-[9px] font-bold">{p.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseScreen;

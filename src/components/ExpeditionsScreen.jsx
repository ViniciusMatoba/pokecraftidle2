import React, { useState, useEffect } from 'react';
import {
  EXPEDITION_BIOMES,
  calcExpeditionEfficiency,
  calcExpeditionDuration,
} from '../data/expeditions';

const MAX_EXPEDITION_TEAM = 3;

const EfficiencyBadge = ({ value }) => {
  const color = value >= 1.4 ? '#22c55e' : value >= 1.0 ? '#f59e0b' : '#ef4444';
  const label = value >= 1.4 ? 'Ótimo' : value >= 1.0 ? 'Neutro' : 'Fraco';
  return (
    <span
      className="text-[9px] font-black px-2 py-0.5 rounded-full"
      style={{ background: color + '22', color }}
    >
      {label} {(value * 100).toFixed(0)}%
    </span>
  );
};

const ExpeditionAlertModal = ({ req, onClose }) => (
  <div className="absolute inset-0 z-[400] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
    <div className="bg-slate-900 w-full max-w-xs rounded-[2.5rem] p-8 border border-white/10 shadow-2xl animate-bounceIn text-center">
      <div className="text-4xl mb-4">=</div>
      <h3 className="text-white font-black uppercase italic tracking-tighter text-xl mb-4">Caminho Bloqueado!</h3>
      <p className="text-white/60 text-sm font-bold mb-8 leading-relaxed">
        Para explorar esta área, você precisa primeiro:<br/>
        <span className="text-yellow-400 font-black">"Derrotar {req}"</span>
      </p>
      <div className="flex flex-col gap-3">
        <button 
          onClick={onClose}
          className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-yellow-400 transition-all shadow-xl active:scale-95"
        >
          Entendido!
        </button>
      </div>
    </div>
  </div>
);

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const ExpeditionsScreen = ({
  gameState,
  onClose,
  onStartExpedition,
  onClaimExpedition,
}) => {
  const [selectedBiome, setSelectedBiome] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [alertReq, setAlertReq] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeExpeditions = gameState.expeditions || {};
  const pcBox = gameState.pc || [];

  const isUnlocked = (biome) => {
    if (!biome.requires) return true;
    return (gameState.badges || []).includes(biome.requires);
  };

  const isActive   = (id) => !!activeExpeditions[id];
  const isComplete = (id) => {
    const exp = activeExpeditions[id];
    return exp && now >= exp.endsAt;
  };

  const availablePC = pcBox.filter(p =>
    !Object.values(activeExpeditions).some(e =>
      e.team?.find(t => t.instanceId === p.instanceId)
    )
  );

  const recommendTeam = (biome) => {
    const scored = availablePC
      .map(p => ({ p, score: calcExpeditionEfficiency(p, biome) * (p.level || 1) }))
      .sort((a, b) => b.score - a.score);
    setSelectedTeam(scored.slice(0, MAX_EXPEDITION_TEAM).map(s => s.p));
  };

  const togglePokemon = (poke) => {
    setSelectedTeam(prev => {
      const exists = prev.find(p => p.instanceId === poke.instanceId);
      if (exists) return prev.filter(p => p.instanceId !== poke.instanceId);
      if (prev.length >= MAX_EXPEDITION_TEAM) return prev;
      return [...prev, poke];
    });
  };

  return (
    <div className="absolute inset-0 z-[110] flex flex-col bg-slate-950 animate-fadeIn">
      {alertReq && (
        <ExpeditionAlertModal 
          req={alertReq} 
          onClose={() => setAlertReq(null)} 
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 shrink-0">
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl transition-all active:scale-95"
        >
          ←
        </button>
        <div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">
            ExpediçÃµes
          </h2>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Envie Pokémon do PC para coletar recursos
          </p>
        </div>
      </div>

      {/* ExpediçÃµes ativas */}
      {Object.keys(activeExpeditions).length > 0 && (
        <div className="px-4 py-3 border-b border-white/10 shrink-0">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">
            Em Andamento
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {Object.entries(activeExpeditions).map(([biomeId, exp]) => {
              const biome     = EXPEDITION_BIOMES[biomeId];
              const done      = now >= exp.endsAt;
              const remaining = Math.max(0, exp.endsAt - now);
              return (
                <div
                  key={biomeId}
                  className={`shrink-0 rounded-2xl p-3 min-w-[140px] border ${
                    done
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <p className="text-2xl">{biome?.icon}</p>
                  <p className="text-[10px] font-black text-white uppercase leading-tight mt-1">
                    {biome?.name}
                  </p>
                  <p className={`text-[10px] font-bold mt-1 ${done ? 'text-green-400' : 'text-white/50'}`}>
                    {done ? '✅ Pronto!' : `⏳ ${formatTime(remaining)}`}
                  </p>
                  <p className="text-[9px] text-white/30 mt-0.5">
                    {exp.team?.length || 0} Pokémon
                  </p>
                  {done && (
                    <button
                      onClick={() => onClaimExpedition(biomeId)}
                      className="mt-2 w-full bg-green-500 text-white text-[10px] font-black py-1.5 rounded-xl uppercase active:scale-95 transition-all"
                    >
                      Coletar!
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-y-auto">
        {!selectedBiome ? (

          /* Grid de biomas */
          <div className="p-4 grid grid-cols-2 gap-3">
            {Object.values(EXPEDITION_BIOMES).map(biome => {
              const unlocked = isUnlocked(biome);
              const active   = isActive(biome.id);
              const complete = isComplete(biome.id);
              return (
                <div
                  key={biome.id}
                  onClick={() => {
                    if (!unlocked) {
                      setAlertReq(biome.leaderName);
                    } else if (!active) {
                      setSelectedBiome(biome);
                    }
                  }}
                  className={`relative rounded-[1.5rem] overflow-hidden shadow-xl transition-all ${
                    unlocked && !active
                      ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.97]'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{ background: biome.bg, minHeight: 120 }}
                >
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />
                  <div className="relative z-10 p-4">
                    <p className="text-3xl">{biome.icon}</p>
                    <p className="text-white font-black text-sm uppercase italic leading-tight mt-1">
                      {biome.name}
                    </p>
                    <p className="text-white/60 text-[9px] mt-1 leading-tight">
                      {biome.description}
                    </p>
                    {active && (
                      <span
                        className={`mt-2 inline-block text-[9px] font-black px-2 py-0.5 rounded-full ${
                          complete ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                        }`}
                      >
                        {complete ? '✅ Pronto' : '⏳ Em andamento'}
                      </span>
                    )}
                    {!unlocked && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-[9px] text-white/50">
                          🏅 Derrote {biome.leaderName} para desbloquear
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        ) : (

          /* Detalhe do bioma + seleção de time */
          <div className="p-4 flex flex-col gap-4">

            {/* Card do bioma */}
            <div
              className="rounded-[2rem] overflow-hidden relative"
              style={{ background: selectedBiome.bg }}
            >
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <div className="relative z-10 p-5">
                <p className="text-4xl">{selectedBiome.icon}</p>
                <h3 className="text-white font-black text-lg uppercase italic mt-1">
                  {selectedBiome.name}
                </h3>
                <p className="text-white/70 text-xs mt-1">{selectedBiome.description}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="text-[9px] bg-black/30 text-white px-2 py-1 rounded-full font-bold">
                    ⏱️ Base: {selectedBiome.baseDuration}min
                  </span>
                  <span className="text-[9px] bg-black/30 text-white px-2 py-1 rounded-full font-bold">
                    P {selectedBiome.xpPerMinute} XP/min
                  </span>
                  <span className="text-[9px] bg-green-500/30 text-green-300 px-2 py-1 rounded-full font-bold">
                     {selectedBiome.favoredTypes.join(', ')}
                  </span>
                  <span className="text-[9px] bg-red-500/30 text-red-300 px-2 py-1 rounded-full font-bold">
                    L {selectedBiome.enemyType.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Time selecionado */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-black text-sm uppercase">
                  Time ({selectedTeam.length}/{MAX_EXPEDITION_TEAM})
                </p>
                <button
                  onClick={() => recommendTeam(selectedBiome)}
                  className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase hover:bg-blue-500 transition-all active:scale-95"
                >
                  ⚡ Recomendar
                </button>
              </div>

              {selectedTeam.length === 0 ? (
                <p className="text-white/30 text-xs text-center py-4">
                  Selecione Pokémon do PC abaixo ou clique em Recomendar
                </p>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {selectedTeam.map(p => (
                    <div
                      key={p.instanceId}
                      className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2"
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`}
                        className="w-8 h-8 object-contain"
                        alt={p.name}
                      />
                      <div>
                        <p className="text-white text-[10px] font-black">{p.name}</p>
                        <p className="text-white/40 text-[9px]">Nv. {p.level}</p>
                        <EfficiencyBadge value={calcExpeditionEfficiency(p, selectedBiome)} />
                      </div>
                      <button
                        onClick={() => togglePokemon(p)}
                        className="text-white/40 hover:text-red-400 ml-1 text-sm transition-colors"
                      >
                        
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedTeam.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-[10px]">
                      â±ï¸ Duração estimada:
                    </p>
                    <p className="text-white font-black text-sm">
                      {formatTime(calcExpeditionDuration(selectedTeam, selectedBiome))}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onStartExpedition(selectedBiome.id, selectedTeam);
                      setSelectedBiome(null);
                      setSelectedTeam([]);
                    }}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black text-sm px-6 py-3 rounded-2xl uppercase shadow-xl hover:scale-105 transition-all active:scale-95"
                  >
                    🚀 Iniciar!
                  </button>
                </div>
              )}
            </div>

            {/* PC Box */}
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">
                Pokémon no PC — {availablePC.length} disponíveis
              </p>

              {availablePC.length === 0 ? (
                <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10">
                  <p className="text-4xl mb-2">📦</p>
                  <p className="text-white/30 text-xs">
                    Nenhum Pokémon disponível no PC.{'\n'}Capture mais Pokémon nas rotas!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {availablePC.map(p => {
                    const selected  = !!selectedTeam.find(s => s.instanceId === p.instanceId);
                    const eff       = calcExpeditionEfficiency(p, selectedBiome);
                    const disabled  = !selected && selectedTeam.length >= MAX_EXPEDITION_TEAM;
                    return (
                      <div
                        key={p.instanceId}
                        onClick={() => !disabled && togglePokemon(p)}
                        className={`flex items-center gap-3 rounded-2xl p-3 border transition-all ${
                          selected
                            ? 'border-blue-500 bg-blue-500/20 cursor-pointer'
                            : disabled
                            ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/3'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer active:scale-95'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`}
                            className="w-10 h-10 object-contain"
                            alt={p.name}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                          {p.isShiny && (
                            <span className="absolute -top-1 -right-1 text-[8px]">(</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-black text-xs truncate">{p.name}</p>
                          <p className="text-white/50 text-[9px]">Nv. {p.level}  {p.type}</p>
                          <EfficiencyBadge value={eff} />
                        </div>
                        {selected && (
                          <span className="text-blue-400 text-lg shrink-0"></span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => { setSelectedBiome(null); setSelectedTeam([]); }}
              className="w-full bg-white/10 text-white py-4 rounded-2xl font-black uppercase text-sm hover:bg-white/20 transition-all"
            >
              ← Voltar para Biomas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpeditionsScreen;

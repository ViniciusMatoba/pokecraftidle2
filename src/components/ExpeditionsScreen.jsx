import React, { useState, useEffect } from 'react';
import {
  EXPEDITION_BIOMES,
  EXPEDITION_REGIONS,
  calcExpeditionEfficiency,
  calcExpeditionDuration,
  isExpeditionUnlocked,
} from '../data/expeditions';
import { ITEM_LABELS } from '../data/constants';

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
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
    <div className="modal-panel-mobile bg-slate-900 p-6 border border-white/10 shadow-2xl animate-bounceIn text-center">
      <div className="text-4xl mb-4">🔒</div>
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


const ExpeditionReportModal = ({ report, onClose }) => {
  if (!report) return null;
  const drops = report.drops || {};
  const hasDrops = Object.keys(drops).length > 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-[420px] bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl animate-bounceIn overflow-hidden flex flex-col max-h-[88vh]">

        {/* ── HEADER ── */}
        <div className="relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/40 via-indigo-700/20 to-slate-900" />
          <div className="relative z-10 px-6 py-5 text-center">
            <p className="text-5xl mb-2 drop-shadow-lg">{report.biomeIcon}</p>
            <h2 className="text-white font-black uppercase tracking-tighter text-2xl italic leading-none">
              {report.biomeName}
            </h2>
            <p className="text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">
              ✅ Expedição Concluída
            </p>
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4 custom-scrollbar">

          {/* ── ITENS OBTIDOS ── */}
          {hasDrops && (
            <div className="bg-black/40 rounded-2xl p-4 border border-white/10">
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-3 text-center">
                🎒 Itens Obtidos
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(drops).map(([item, qty]) => {
                  const label = ITEM_LABELS[item];
                  const icon  = label?.icon || '📦';
                  const name  = label?.name || item.replace(/_/g, ' ');
                  return (
                    <div
                      key={item}
                      className="bg-white/8 rounded-xl px-3 py-2.5 flex items-center gap-2.5 border border-white/10"
                    >
                      <span className="text-2xl leading-none shrink-0">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[11px] font-black leading-tight truncate capitalize">{name}</p>
                        <p className="text-yellow-400 text-[10px] font-black">×{qty}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── EQUIPE ── */}
          <div className="flex flex-col gap-3">
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest text-center">
              🧬 Equipe da Expedição
            </p>
            {(report.pokemonResults || []).map((r, idx) => {
              const leveledUp = r.levelsGained > 0;
              return (
                <div
                  key={r.id + '-' + idx}
                  className={`rounded-2xl border relative overflow-hidden ${
                    leveledUp
                      ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/40 border-indigo-500/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 p-3">
                    {/* Sprite */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${
                      leveledUp ? 'bg-indigo-500/20' : 'bg-white/5'
                    }`}>
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${r.isShiny ? 'shiny/' : ''}${r.id}.png`}
                        alt={r.name}
                        className="w-14 h-14 object-contain drop-shadow-lg"
                        style={r.isShiny ? { filter: 'drop-shadow(0 0 8px #fbbf24)' } : {}}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-black text-sm">{r.name}</p>
                        {r.isShiny && (
                          <span className="text-[9px] bg-yellow-500/25 text-yellow-300 px-1.5 py-0.5 rounded font-black">
                            ✨ SHINY
                          </span>
                        )}
                      </div>

                      {leveledUp ? (
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-white/40 text-xs font-bold line-through">Nv.{r.initialLevel}</span>
                          <span className="text-green-400 font-black text-sm">→ Nv.{r.finalLevel}</span>
                          <span className="ml-auto text-[9px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded-full font-black">
                            +{r.levelsGained} nível{r.levelsGained > 1 ? 's' : ''} ⬆️
                          </span>
                        </div>
                      ) : (
                        <p className="text-white/40 text-xs mt-1 font-bold">Nv. {r.initialLevel}</p>
                      )}

                      <p className="text-blue-300 text-[10px] font-black mt-1">
                        +{(r.xpGained || 0).toLocaleString('pt-BR')} XP
                      </p>
                    </div>
                  </div>

                  {/* Golpes aprendidos */}
                  {r.moveEvents?.length > 0 && (
                    <div className="mx-3 mb-3 pt-2 border-t border-white/10 flex flex-col gap-1">
                      <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">⚡ Golpes Aprendidos</p>
                      {r.moveEvents.map((evt, i) => (
                        <div key={i} className="text-[10px] text-yellow-300 font-bold flex items-center gap-1.5">
                          <span className="text-white/30 font-bold">Nv.{evt.level}</span>
                          <span>{evt.moves.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BOTÃO ── */}
        <div className="p-4 bg-black/30 border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm uppercase py-4 rounded-2xl hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all shadow-xl tracking-widest"
          >
            Continuar Aventura
          </button>
        </div>
      </div>
    </div>
  );
};

const ExpeditionsScreen = ({
  gameState,
  onClose,
  onStartExpedition,
  onClaimExpedition,
  expeditionReport,
  onCloseReport,
}) => {
  const [selectedBiome, setSelectedBiome] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [alertReq, setAlertReq] = useState(null);
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [durationMult, setDurationMult] = useState(1);
  const [now, setNow] = useState(Date.now());
  const [claimSummary, setClaimSummary] = useState(null);
  // claimSummary: { biomeName, drops, pokemonXP: [{name, xpGained, leveledUp}] }

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeExpeditions = gameState.expeditions || {};
  const expeditionProgress = gameState.expeditionProgress || {};
  const pcBox = gameState.pc || [];
  const visibleRegionIds = new Set(EXPEDITION_REGIONS
    .filter(region => !region.unlockFlag || (gameState.worldFlags || []).includes(region.unlockFlag) || gameState.activeRegion === region.id)
    .map(region => region.id));

  const isUnlocked = (biome) => {
    return isExpeditionUnlocked(biome, gameState);
  };

  const isActive   = (id) => !!activeExpeditions[id];
  const isComplete = (id) => {
    const exp = activeExpeditions[id];
    return exp && now >= exp.endsAt;
  };

  const teamIds = new Set((gameState.team || []).map(t => t.instanceId));
  const availablePC = pcBox.filter(p => 
    !teamIds.has(p.instanceId) && 
    !Object.values(activeExpeditions).some(e => 
      e.team?.some(t => t.instanceId === p.instanceId)
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

  const ClaimSummaryModal = ({ summary, onClose }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl p-6 border border-white/10 shadow-2xl w-full max-w-sm animate-bounceIn">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🎒</div>
          <h3 className="text-white font-black text-lg uppercase italic">Expedição Concluída!</h3>
          <p className="text-white/50 text-xs">{summary.biomeName}</p>
        </div>

        {/* Itens coletados */}
        <div className="mb-4">
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">Itens Coletados</p>
          {Object.keys(summary.drops).length === 0 ? (
            <p className="text-white/30 text-xs text-center py-2">Nada desta vez...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(summary.drops).map(([item, qty]) => (
                <span key={item} className="bg-white/10 text-white text-[10px] font-black px-2 py-1 rounded-xl">
                  {qty}× {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* XP dos Pokémon */}
        {summary.pokemonXP.length > 0 && (
          <div className="mb-4">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">XP Ganho</p>
            <div className="flex flex-col gap-1.5">
              {summary.pokemonXP.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-white text-xs font-bold">{p.name}</span>
                  <span className="text-yellow-400 text-[10px] font-black">+{p.xpGained} XP{p.leveledUp ? ' ⬆️' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-green-500 hover:bg-green-400 text-white font-black py-3 rounded-2xl uppercase text-sm transition-all active:scale-95"
        >
          Ótimo!
        </button>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 z-[110] flex flex-col bg-slate-950 animate-fadeIn">
      {expeditionReport && (
        <ExpeditionReportModal
          report={expeditionReport}
          onClose={onCloseReport}
        />
      )}

      {alertReq && (
        <ExpeditionAlertModal 
          req={alertReq} 
          onClose={() => setAlertReq(null)} 
        />
      )}

      {claimSummary && (
        <ClaimSummaryModal
          summary={claimSummary}
          onClose={() => setClaimSummary(null)}
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
            Expedições
          </h2>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Envie Pokémon do PC para coletar recursos
          </p>
        </div>
      </div>

      {/* Expedições ativas */}
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
                  
                  {/* Barra de progresso */}
                  {!done && (() => {
                    const total = exp.endsAt - exp.startedAt;
                    const elapsed = now - exp.startedAt;
                    const pct = Math.min(100, Math.floor((elapsed / total) * 100));
                    return (
                      <div className="mt-2 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    );
                  })()}

                  <p className="text-[9px] text-white/30 mt-0.5">
                    {exp.team?.length || 0} Pokémon
                  </p>
                  {done && (
                    <button
                      onClick={() => {
                        // Chama o claim e recebe o summary de volta
                        const result = onClaimExpedition(biomeId);
                        if (result) setClaimSummary(result);
                      }}
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
          <div className="p-4 grid grid-cols-1 gap-3">
            {Object.values(EXPEDITION_BIOMES).filter(biome => visibleRegionIds.has(biome.region || 'kanto')).map(biome => {
              const unlocked = isUnlocked(biome);
              const active   = isActive(biome.id);
              const complete = isComplete(biome.id);
              const progress = expeditionProgress[biome.id] || {};
              const masteryLevel = Math.floor((progress.completed || 0) / 3);
              return (
                <div
                  key={biome.id}
                  onClick={() => {
                    if (!unlocked) {
                      setAlertReq(biome.leaderName);
                    } else if (!active) {
                      setSelectedBiome({ ...biome, masteryLevel });
                    }
                  }}
                  className={`relative w-full rounded-[1.5rem] overflow-hidden shadow-xl transition-all ${
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
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="bg-black/30 text-white/70 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                        {(biome.region || 'kanto').toUpperCase()}
                      </span>
                      <span className="bg-black/30 text-white/70 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                        Mastery {masteryLevel}
                      </span>
                      <span className="bg-black/30 text-white/70 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                        {progress.completed || 0} concluidas
                      </span>
                    </div>
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
                  <span className="text-[9px] bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full font-bold">
                    Mastery {selectedBiome.masteryLevel || 0}: +drops, +XP, -tempo
                  </span>
                  <span className="text-[9px] bg-green-500/30 text-green-300 px-2 py-1 rounded-full font-bold">
                    ✓ {selectedBiome.favoredTypes.join(', ')}
                  </span>
                  <span className="text-[9px] bg-red-500/30 text-red-300 px-2 py-1 rounded-full font-bold">
                    ⚠️ {selectedBiome.enemyType.join(', ')}
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
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Seletor de Duração e Auto-Repeat */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Configuração</p>
                  <div 
                    onClick={() => setAutoRepeat(!autoRepeat)}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <span className="text-white text-[10px] font-bold uppercase">Auto-Repeat</span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${autoRepeat ? 'bg-green-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${autoRepeat ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 4, 8, 12, 24].map(m => (
                    <button
                      key={m}
                      onClick={() => setDurationMult(m)}
                      className={`py-2 rounded-xl text-[10px] font-black transition-all border ${
                        durationMult === m 
                          ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {m}h
                    </button>
                  ))}
                </div>
              </div>

              {selectedTeam.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-[10px]">
                      Duração estimada:
                    </p>
                    <p className="text-white font-black text-sm">
                      {formatTime(calcExpeditionDuration(selectedTeam, selectedBiome, durationMult))}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onStartExpedition(selectedBiome.id, selectedTeam, autoRepeat, durationMult);
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
                            <span className="absolute -top-1 -right-1 text-[8px]">✨</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-black text-xs truncate">{p.name}</p>
                          <p className="text-white/50 text-[9px]">Nv. {p.level} - {p.type}</p>
                          <EfficiencyBadge value={eff} />
                        </div>
                        {selected && (
                          <span className="text-blue-400 text-lg shrink-0">✓</span>
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

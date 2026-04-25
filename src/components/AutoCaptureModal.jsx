import React, { useState } from 'react';
import { POKEDEX } from '../data/pokedex';

const BALL_OPTIONS = [
  { id: 'auto',       name: 'Auto (melhor disponível)', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
  { id: 'pokeballs',  name: 'Poké Bola',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
  { id: 'great_ball', name: 'Great Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' },
  { id: 'ultra_ball', name: 'Ultra Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' },
  { id: 'lure_ball',  name: 'Lure Ball',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure-ball.png' },
  { id: 'moon_ball',  name: 'Moon Ball',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-ball.png' },
];

const MODE_OPTIONS = [
  { id: 'shiny_only', label: '✨ Apenas Shinies',          desc: 'Captura somente Pokémon brilhantes' },
  { id: 'not_caught', label: '📖 Não Capturados',          desc: 'Captura os que ainda não estão no PC ou time' },
  { id: 'all',        label: '🎯 Todos os Pokémon',        desc: 'Captura qualquer Pokémon da rota' },
  { id: 'specific',   label: '🔍 Específicos',             desc: 'Escolha quais Pokémon capturar' },
];

const AutoCaptureModal = ({ route, gameState, onSave, onClose, onDisable }) => {
  const existingConfig = gameState.autoCaptureConfig?.routeConfigs?.[route.id] || {};
  const globalConfig   = gameState.autoCaptureConfig || {};

  const [mode,         setMode]         = useState(existingConfig.mode         || globalConfig.mode         || 'shiny_only');
  const [ballPriority, setBallPriority] = useState(existingConfig.ballPriority || globalConfig.ballPriority || 'auto');
  const [hpThreshold,  setHpThreshold]  = useState(existingConfig.hpThreshold  || globalConfig.hpThreshold  || 30);
  const [targetIds,    setTargetIds]    = useState(existingConfig.targetIds     || []);

  const routePokemon = React.useMemo(() => {
    const uniqueIds = new Set();
    const list = [];
    route.enemies?.forEach(e => {
      if (!uniqueIds.has(e.id)) {
        uniqueIds.add(e.id);
        const data = POKEDEX[Number(e.id)];
        if (data) {
          list.push({ id: Number(e.id), name: data.name, type: data.type });
        }
      }
    });
    return list;
  }, [route.enemies]);

  const toggleTarget = (id) => {
    setTargetIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const alreadyCaught = (id) => {
    const inTeam = gameState.team?.some(p => p.id === id);
    const inPC   = gameState.pc?.some(p => p.id === id);
    return inTeam || inPC;
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-[9px] font-black uppercase tracking-widest">Auto-Captura</p>
              <h3 className="text-white font-black text-lg uppercase italic leading-tight">
                {route.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 text-white w-9 h-9 rounded-full flex items-center justify-center font-black hover:bg-white/30 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-5">

          {/* Modo de captura */}
          <div>
            <p className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3">
              🎯 Modo de Captura
            </p>
            <div className="flex flex-col gap-2">
              {MODE_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                    mode === opt.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                    mode === opt.id ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                  }`}>
                    {mode === opt.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="text-slate-800 font-black text-xs">{opt.label}</p>
                    <p className="text-slate-500 text-[9px] mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de Pokémon específicos */}
          {mode === 'specific' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-black text-slate-700 uppercase tracking-widest">
                  🔍 Pokémon da Rota
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTargetIds(routePokemon.map(p => p.id))}
                    className="text-[9px] font-black text-blue-600 uppercase hover:underline"
                  >
                    Marcar Todos
                  </button>
                  <span className="text-slate-300">|</span>
                  <button 
                    onClick={() => setTargetIds([])}
                    className="text-[9px] font-black text-slate-400 uppercase hover:underline"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {routePokemon.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {routePokemon.map(p => {
                    const caught   = alreadyCaught(p.id);
                    const selected = targetIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleTarget(p.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 transition-all active:scale-95 ${
                          selected
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                            className="w-10 h-10 object-contain"
                            alt={p.name}
                          />
                          {caught && (
                            <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm border border-white">
                              <span className="text-[8px] font-black">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="text-left overflow-hidden">
                          <p className="text-slate-800 font-black text-[10px] leading-none truncate uppercase tracking-tighter">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-slate-400 text-[8px] font-bold">#{p.id}</span>
                            {caught && <span className="text-green-600 text-[7px] font-black uppercase">PC</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold italic text-xs">Nenhum Pokémon disponível nesta rota.</p>
                </div>
              )}

              {mode === 'specific' && targetIds.length === 0 && routePokemon.length > 0 && (
                <p className="text-center text-red-500 text-[9px] font-black uppercase mt-3 animate-pulse">
                  ⚠️ Selecione pelo menos 1 Pokémon
                </p>
              )}
            </div>
          )}

          {/* Prioridade de Pokébola */}
          <div>
            <p className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3">
              Pokébola a Usar
            </p>
            <div className="grid grid-cols-2 gap-2">
              {BALL_OPTIONS.map(ball => {
                const qty = ball.id === 'auto'
                  ? null
                  : (gameState.inventory?.items?.[ball.id] || 0);
                const hasStock = ball.id === 'auto' || qty > 0;
                return (
                  <button
                    key={ball.id}
                    onClick={() => setBallPriority(ball.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 transition-all ${
                      ballPriority === ball.id
                        ? 'border-blue-500 bg-blue-50'
                        : !hasStock
                        ? 'border-slate-100 bg-slate-50 opacity-40'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <img src={ball.img} className="w-7 h-7 object-contain" alt={ball.name}
                      onError={e => { e.target.style.display='none'; }} />
                    <div className="text-left">
                      <p className="text-slate-800 font-black text-[9px] leading-tight">{ball.name}</p>
                      {qty !== null && (
                        <p className={`text-[8px] font-bold ${hasStock ? 'text-green-500' : 'text-red-400'}`}>
                          {qty} disponíveis
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* HP threshold */}
          <div>
            <p className="text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
              Tentar capturar quando HP do inimigo ≤ {hpThreshold}%
            </p>
            <p className="text-[9px] text-slate-400 mb-3">
              HP mais baixo = maior chance de captura
            </p>
            <input
              type="range"
              min={10} max={80} step={5}
              value={hpThreshold}
              onChange={e => setHpThreshold(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
              <span>10% (mais difícil)</span>
              <span className="text-blue-600 font-black">{hpThreshold}%</span>
              <span>80% (mais fácil)</span>
            </div>
          </div>
        </div>

        {/* Botões — com margem das bordas */}
        <div style={{
          padding: '0 20px 28px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flexShrink: 0
        }}>
          <button
            onClick={() => {
              if (mode === 'specific' && targetIds.length === 0) return;
              onSave({ mode, ballPriority, hpThreshold, targetIds });
            }}
            disabled={mode === 'specific' && targetIds.length === 0}
            style={{
              width: '100%',
              padding: '16px 8px',
              borderRadius: '16px',
              fontWeight: 900,
              fontSize: '14px',
              textTransform: 'uppercase',
              background: (mode === 'specific' && targetIds.length === 0) ? '#e2e8f0' : '#2563eb',
              color: (mode === 'specific' && targetIds.length === 0) ? '#94a3b8' : 'white',
              border: 'none',
              cursor: (mode === 'specific' && targetIds.length === 0) ? 'not-allowed' : 'pointer',
              boxShadow: (mode === 'specific' && targetIds.length === 0) ? 'none' : '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            ✅ Salvar e Ativar Auto-Captura
          </button>
          <button
            onClick={onDisable}
            style={{
              width: '100%',
              padding: '16px 8px',
              borderRadius: '16px',
              fontWeight: 900,
              fontSize: '14px',
              textTransform: 'uppercase',
              background: '#f1f5f9',
              color: '#475569',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Desativar Auto-Captura nesta rota
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoCaptureModal;

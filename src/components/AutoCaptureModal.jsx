import React, { useState } from 'react';
import { POKEDEX } from '../data/pokedex';

const BALL_OPTIONS = [
  { id: 'auto', name: 'Auto', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', hint: 'melhor disponivel' },
  { id: 'pokeballs', name: 'Poke Bola', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
  { id: 'great_ball', name: 'Great Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' },
  { id: 'ultra_ball', name: 'Ultra Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' },
  { id: 'lure_ball', name: 'Lure Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure-ball.png' },
  { id: 'moon_ball', name: 'Moon Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-ball.png' },
];

const MODE_OPTIONS = [
  { id: 'shiny_only', label: 'Apenas Shinies', desc: 'Captura somente Pokemon brilhantes', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/star-piece.png' },
  { id: 'not_caught', label: 'Nao Capturados', desc: 'Captura os que ainda nao estao no PC ou time', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
  { id: 'not_caught_plus_shiny', label: 'Nao Capturados + Shinies', desc: 'Prioriza novos, mas sempre tenta Shinies', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' },
  { id: 'all', label: 'Todos os Pokemon', desc: 'Captura qualquer Pokemon da rota', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' },
  { id: 'specific', label: 'Especificos', desc: 'Escolha quais Pokemon capturar', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png' },
  { id: 'specific_plus_shiny', label: 'Especificos + Shinies', desc: 'Captura os escolhidos e qualquer Shiny', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure-ball.png' },
];

const AutoCaptureModal = ({ route, gameState, onSave, onClose, onDisable }) => {
  const existingConfig = gameState.autoCaptureConfig?.routeConfigs?.[route.id] || {};
  const globalConfig = gameState.autoCaptureConfig || {};

  const [mode, setMode] = useState(existingConfig.mode || globalConfig.mode || 'shiny_only');
  const [ballPriority, setBallPriority] = useState(existingConfig.ballPriority || globalConfig.ballPriority || 'auto');
  const [hpThreshold, setHpThreshold] = useState(existingConfig.hpThreshold || globalConfig.hpThreshold || 30);
  const [targetIds, setTargetIds] = useState(existingConfig.targetIds || []);

  const routePokemon = route.enemies?.map(e => {
    const data = POKEDEX[Number(e.id)];
    return data ? { id: Number(e.id), name: data.name, type: data.type } : null;
  }).filter(Boolean) || [];

  const toggleTarget = (id) => {
    setTargetIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const alreadyCaught = (id) => {
    const inTeam = gameState.team?.some(p => p.id === id);
    const inPC = gameState.pc?.some(p => p.id === id);
    return inTeam || inPC;
  };

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="modal-panel-mobile bg-white overflow-hidden shadow-2xl flex flex-col border-b-[8px] border-slate-900">
        <div className="bg-slate-900 px-4 py-4 shrink-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-white/10 flex items-center justify-center shrink-0">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-8 h-8 object-contain" alt="" />
            </div>
            <div className="min-w-0">
              <p className="text-emerald-200 text-[10px] font-black uppercase tracking-[0.18em]">Auto-Captura</p>
              <h3 className="text-white font-black text-base uppercase italic leading-tight">{route.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-white/20 text-white font-black flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
            aria-label="Fechar"
          >
            x
          </button>
        </div>

        <div className="modal-scroll-content p-5 flex flex-col gap-5 bg-slate-50">
          <div>
            <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.16em] mb-3">Modo de Captura</p>
            <div className="flex flex-col gap-2">
              {MODE_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id)}
                  className={`min-h-[62px] flex items-start gap-3 p-3.5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] shadow-sm ${
                    mode === opt.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                    mode === opt.id ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                  }`}>
                    {mode === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-800 font-black text-xs flex items-center gap-2">
                      <img src={opt.icon} className="w-5 h-5 object-contain shrink-0" alt="" />
                      <span className="leading-tight">{opt.label}</span>
                    </p>
                    <p className="text-slate-500 text-[9px] mt-0.5 leading-snug">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {(mode === 'specific' || mode === 'specific_plus_shiny') && routePokemon.length > 0 && (
            <div>
              <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.16em] mb-3">Selecionar Pokemon da Rota</p>
              <div className="grid grid-cols-2 gap-2">
                {routePokemon.map(p => {
                  const caught = alreadyCaught(p.id);
                  const selected = targetIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleTarget(p.id)}
                      className={`min-h-[68px] flex items-center gap-2 p-3 rounded-2xl border-2 transition-all active:scale-95 shadow-sm ${
                        selected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} className="w-10 h-10 object-contain" alt={p.name} />
                        {caught && (
                          <span className="absolute -top-1 -right-1 text-[7px] bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-black">OK</span>
                        )}
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-slate-800 font-black text-[10px] leading-tight">{p.name}</p>
                        <p className="text-slate-400 text-[8px] mt-0.5">{p.type}</p>
                        {caught && <p className="text-green-500 text-[8px] font-bold">Ja capturado</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
              {targetIds.length === 0 && (
                <p className="text-center text-red-400 text-[10px] font-bold mt-2">Selecione pelo menos 1 Pokemon</p>
              )}
            </div>
          )}

          <div>
            <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.16em] mb-3">Pokebola a Usar</p>
            <div className="grid grid-cols-2 gap-2">
              {BALL_OPTIONS.map(ball => {
                const qty = ball.id === 'auto' ? null : (gameState.inventory?.items?.[ball.id] || 0);
                const hasStock = ball.id === 'auto' || qty > 0;
                return (
                  <button
                    key={ball.id}
                    onClick={() => setBallPriority(ball.id)}
                    className={`min-h-[62px] flex items-center gap-2 p-3 rounded-2xl border-2 transition-all shadow-sm ${
                      ballPriority === ball.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : !hasStock
                          ? 'border-slate-100 bg-white opacity-40'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <img src={ball.img} className="w-7 h-7 object-contain shrink-0" alt={ball.name} onError={e => { e.target.style.display = 'none'; }} />
                    <div className="text-left min-w-0">
                      <p className="text-slate-800 font-black text-[9px] leading-tight">{ball.name}</p>
                      {ball.hint && <p className="text-[8px] font-bold text-slate-400 leading-tight">{ball.hint}</p>}
                      {qty !== null && (
                        <p className={`text-[8px] font-bold ${hasStock ? 'text-green-500' : 'text-red-400'}`}>{qty} disponiveis</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.12em] mb-1">Tentar quando HP inimigo {'<='} {hpThreshold}%</p>
            <p className="text-[10px] font-bold text-slate-400 mb-3">HP mais baixo = maior chance de captura</p>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={hpThreshold}
              onChange={e => setHpThreshold(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1">
              <span>10%</span>
              <span className="text-emerald-600 font-black">{hpThreshold}%</span>
              <span>80%</span>
            </div>
          </div>
        </div>

        <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-100 bg-white flex flex-col gap-3 shrink-0">
          <button
            onClick={() => {
              if ((mode === 'specific' || mode === 'specific_plus_shiny') && targetIds.length === 0) return;
              onSave({ mode, ballPriority, hpThreshold, targetIds });
            }}
            disabled={(mode === 'specific' || mode === 'specific_plus_shiny') && targetIds.length === 0}
            className={`w-full min-h-[52px] rounded-2xl font-black text-sm uppercase ${
              (mode === 'specific' || mode === 'specific_plus_shiny') && targetIds.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white shadow-lg shadow-slate-200'
            }`}
          >
            Salvar e Ativar
          </button>
          <button
            onClick={onDisable}
            className="w-full min-h-[52px] rounded-2xl bg-slate-100 text-slate-600 font-black text-sm uppercase"
          >
            Desativar nesta rota
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoCaptureModal;

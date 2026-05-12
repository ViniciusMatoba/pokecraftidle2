import React, { useState, useEffect } from 'react';
import { 
  TROPHIES, TRAINER_TITLES, POKEDEX_FRAMES, UI_THEMES, 
  ALLIES, MINE_LEVELS, FISHING_RODS, GYM_BANNERS 
} from '../data/prestige';

const PrestigeShop = ({ 
  gameState, 
  setGameState, 
  addLog, 
  getBadgeCount,
  onHireAlly,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState('trophies');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const badges = getBadgeCount(gameState);
  const currency = gameState.currency || 0;
  const prestige = gameState.prestige || {};

  const handleBuy = (type, item) => {
    if (currency < item.cost) return;
    if (badges < (item.minBadges || 0)) return;

    setGameState(prev => {
      const newState = { ...prev, currency: prev.currency - item.cost };
      
      if (type === 'trophy') {
        newState.prestige = {
          ...prev.prestige,
          trophies: [...(prev.prestige?.trophies || []), item.id]
        };
        addLog(`🏆 Adquiriu o troféu: ${item.name}!`, 'system');
      } else if (type === 'title') {
        newState.prestige = {
          ...prev.prestige,
          activeTitle: item.id
        };
        addLog(`🎖️ Novo título ativado: ${item.label}!`, 'system');
      } else if (type === 'frame') {
        newState.prestige = {
          ...prev.prestige,
          pokedexFrame: item.id
        };
        addLog(`🖼️ Nova moldura da Pokédex: ${item.name}!`, 'system');
      } else if (type === 'theme') {
        newState.prestige = {
          ...prev.prestige,
          uiTheme: item.id
        };
        addLog(`🎨 Novo tema visual aplicado: ${item.name}!`, 'system');
      } else if (type === 'rod') {
        newState.fishing = {
          ...prev.fishing,
          rod: item.id
        };
        addLog(`🎣 Nova vara de pesca: ${item.name}!`, 'system');
      } else if (type === 'banner') {
        newState.gymCustom = {
          ...prev.gymCustom,
          bannerId: item.id
        };
        addLog(`🚩 Novo estandarte para seu ginásio: ${item.name}!`, 'system');
      }

      return newState;
    });
  };

  const handleMineUpgrade = () => {
    const currentLevel = gameState.mine?.level || 0;
    const nextLevel = currentLevel + 1;
    const config = MINE_LEVELS[nextLevel] || MINE_LEVELS[1];
    const cost = currentLevel === 0 ? config.unlockCost : MINE_LEVELS[currentLevel].upgradeCost;

    if (currency < cost) return;
    if (badges < (config.minBadges || 0)) return;

    setGameState(prev => ({
      ...prev,
      currency: prev.currency - cost,
      mine: {
        ...prev.mine,
        unlocked: true,
        level: nextLevel,
        lastCollected: prev.mine?.lastCollected || Date.now()
      }
    }));
    addLog(`⛏️ Mina ${currentLevel === 0 ? 'Desbloqueada' : 'Aprimorada'} para o Nível ${nextLevel}!`, 'system');
  };

  const tabs = [
    { id: 'trophies', label: 'Troféus', icon: '🏆', color: '#fbbf24' },
    { id: 'titles',   label: 'Títulos', icon: '🎖️', color: '#60a5fa' },
    { id: 'cosmetics', label: 'Visual',  icon: '🎨', color: '#f472b6' },
    { id: 'allies',   label: 'Aliados', icon: '🤝', color: '#4ade80' },
    { id: 'mine',     label: 'Mina',    icon: '⛏️', color: '#a78bfa' },
    { id: 'fishing',  label: 'Pesca',   icon: '🎣', color: '#2dd4bf' },
    { id: 'gym',      label: 'Ginásio', icon: '🚩', color: '#f87171' },
  ];

  const currentTabColor = tabs.find(t => t.id === activeTab)?.color || '#fbbf24';

  return (
    <div className={`absolute inset-0 z-[2000] bg-[#020617] flex flex-col transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} overflow-hidden text-white font-sans`}>
      {/* Background Decorativo */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      </div>

      {/* Header Premium */}
      <div className="relative z-10 bg-slate-900/60 backdrop-blur-2xl border-b border-white/10 px-6 py-8 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)] shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onBack()}
            className="group w-14 h-14 flex items-center justify-center rounded-[1.2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-90 shadow-lg"
          >
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
          </button>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none italic bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
              Loja de Prestígio
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Ambiente de Trocas Exclusivas</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="group flex items-center gap-4 bg-black/60 px-5 py-3 rounded-2xl border border-white/10 shadow-2xl hover:border-amber-400/50 transition-colors">
            <div className="flex flex-col items-end">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Saldo Disponível</p>
              <span className="text-xl font-black text-amber-400 tabular-nums leading-none">
                {currency.toLocaleString()}
              </span>
            </div>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-8 h-8 group-hover:scale-110 transition-transform" alt="" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{badges} Badges</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu Lateral/Superior */}
      <div className="relative z-10 flex px-4 py-4 gap-3 overflow-x-auto custom-scrollbar shrink-0 bg-slate-900/40 backdrop-blur-md border-b border-white/5">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 shrink-0 border-b-4 ${
                isActive 
                ? 'bg-white text-slate-900 border-amber-500 translate-y-[-2px] shadow-[0_10px_20px_rgba(0,0,0,0.3)]' 
                : 'bg-white/5 text-white/40 border-black/40 hover:bg-white/10 hover:text-white/60'
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
              )}
              <span className="text-xl transform group-hover:scale-125 transition-transform">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-40">
        
        {/* Título da Seção Dinâmico */}
        <div className="flex items-center gap-4 mb-8 animate-fadeIn">
          <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: currentTabColor }} />
          <h3 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
             {tabs.find(t => t.id === activeTab)?.label}
             <span className="text-[10px] not-italic font-bold text-white/20 tracking-[0.4em] translate-y-1">— EXCLUSIVOS</span>
          </h3>
        </div>

        {/* TAB: TROPHIES */}
        {activeTab === 'trophies' && (
          <div className="grid gap-6 animate-slideUp">
            {Object.values(TROPHIES).map((item, idx) => {
              const isOwned = prestige.trophies?.includes(item.id);
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);
              const isLocked = !hasBadges;

              return (
                <div 
                  key={item.id} 
                  className={`group relative p-6 rounded-[2.5rem] border-2 flex items-center justify-between transition-all duration-500 overflow-hidden ${
                    isOwned 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : isLocked ? 'bg-black/40 border-white/5 opacity-50' : 'bg-slate-800/40 border-white/10 hover:border-amber-400/30'
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {isOwned && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />}
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl transition-transform group-hover:scale-110 duration-500 ${
                      isOwned ? 'bg-emerald-500/20 border-2 border-emerald-400/50' : 'bg-black/60 border-2 border-white/10'
                    }`}>
                      <span className="drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black uppercase italic leading-none mb-2 text-white group-hover:text-amber-400 transition-colors">{item.name}</h4>
                      <p className="text-[11px] font-medium text-white/50 leading-relaxed max-w-[220px] italic">"{item.description}"</p>
                      <div className="flex gap-2 mt-4">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${hasBadges ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                          <span className="text-[10px] font-black uppercase tracking-tighter">{item.minBadges} Badges</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right relative z-10">
                    {isOwned ? (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-5 py-2.5 rounded-2xl border border-emerald-400/20">Adquirido</span>
                      </div>
                    ) : (
                      <button 
                        disabled={!canAfford || isLocked}
                        onClick={() => handleBuy('trophy', item)}
                        className={`group/btn relative px-8 py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all overflow-hidden ${
                          canAfford && !isLocked 
                          ? 'bg-amber-400 text-black shadow-[0_10px_25px_rgba(251,191,36,0.3)] hover:scale-105 active:scale-95' 
                          : 'bg-white/5 text-white/20 grayscale cursor-not-allowed'
                        }`}
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                        <span className="relative flex items-center gap-2 justify-center">
                          {item.cost.toLocaleString()} <span className="text-[9px] opacity-60">COINS</span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: TITLES */}
        {activeTab === 'titles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideUp">
            {Object.values(TRAINER_TITLES).map((item, idx) => {
              const isActive = prestige.activeTitle === item.id;
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);

              return (
                <button 
                  key={item.id}
                  disabled={!isActive && (!canAfford || !hasBadges)}
                  onClick={() => handleBuy('title', item)}
                  className={`group relative p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all duration-300 ${
                    isActive 
                    ? 'bg-blue-600 border-blue-400 shadow-[0_15px_35px_rgba(37,99,235,0.4)]' 
                    : 'bg-slate-800/40 border-white/10 hover:bg-slate-800/60'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner transition-transform group-hover:rotate-12 ${
                      isActive ? 'bg-white text-blue-600' : 'bg-white/5 text-white/40'
                    }`}>
                      {item.label[0]}
                    </div>
                    <div className="text-left">
                      <h4 className={`text-lg font-black uppercase italic tracking-tighter ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {item.label}
                      </h4>
                      <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-blue-100/60' : 'text-white/20'}`}>
                         Requisito: {item.minBadges} Badges
                      </p>
                    </div>
                  </div>
                  {isActive ? (
                    <div className="bg-white/20 px-3 py-1.5 rounded-xl">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest animate-pulse">Ativo</span>
                    </div>
                  ) : (
                    <span className="text-sm font-black text-amber-400 tabular-nums">
                      {item.cost.toLocaleString()} <span className="text-[9px] opacity-50">C</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* TAB: COSMETICS */}
        {activeTab === 'cosmetics' && (
          <div className="flex flex-col gap-12 animate-slideUp">
            {/* Frames Section */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Molduras da Pokédex</h4>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {Object.values(POKEDEX_FRAMES).map((item, idx) => {
                  const isActive = prestige.pokedexFrame === item.id;
                  return (
                    <button 
                      key={item.id}
                      onClick={() => handleBuy('frame', item)}
                      className={`group relative p-6 rounded-[2.5rem] border-4 flex flex-col items-center gap-4 transition-all duration-300 ${
                        isActive ? 'bg-white/10 scale-105 shadow-xl' : 'bg-slate-800/40 border-white/5 hover:border-white/20'
                      }`}
                      style={{ borderColor: item.borderColor, animationDelay: `${idx * 100}ms` }}
                    >
                      {isActive && <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 text-xs shadow-lg font-black">✓</div>}
                      <div className="w-20 h-20 rounded-[1.5rem] shadow-2xl flex items-center justify-center border-4 border-black/20" style={{ backgroundColor: item.headerColor }}>
                         <div className="w-12 h-12 bg-white/20 rounded-full blur-xl" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest mb-1">{item.name}</p>
                        <p className="text-[10px] font-black text-amber-400 italic">
                          {isActive ? 'EQUIPADO' : `${item.cost.toLocaleString()} COINS`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Themes Section */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Esquemas Cromáticos</h4>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.values(UI_THEMES).map(item => {
                  const isActive = prestige.uiTheme === item.id;
                  return (
                    <button 
                      key={item.id}
                      onClick={() => handleBuy('theme', item)}
                      className={`group p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all ${
                        isActive ? 'bg-white/10 border-white/40 shadow-2xl' : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative w-12 h-12 rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: item.preview }}>
                           <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black uppercase italic tracking-tighter leading-none mb-1">{item.name}</p>
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Interface Premium</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isActive ? (
                           <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] bg-blue-400/10 px-4 py-2 rounded-xl border border-blue-400/20">Ativo</span>
                        ) : (
                           <span className="text-xs font-black text-amber-400 tabular-nums">{item.cost.toLocaleString()} C</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* TAB: ALLIES */}
        {activeTab === 'allies' && (
          <div className="grid gap-6 animate-slideUp">
            {Object.values(ALLIES).map((item, idx) => {
              const isHired = gameState.ally?.activeId === item.id;
              const timeLeft = isHired ? Math.max(0, gameState.ally.expiresAt - Date.now()) : 0;
              const minutesLeft = Math.ceil(timeLeft / 60000);
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);

              return (
                <div 
                  key={item.id} 
                  className={`group relative p-8 rounded-[3rem] border-2 flex items-center justify-between transition-all duration-500 ${
                    isHired ? 'bg-blue-600/10 border-blue-400 shadow-2xl' : 'bg-slate-800/40 border-white/10 hover:border-blue-400/30'
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-8 relative z-10">
                    <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 overflow-hidden shadow-2xl border-2 ${
                      isHired ? 'bg-blue-600/20 border-blue-400' : 'bg-black/40 border-white/10 group-hover:rotate-3'
                    }`}>
                      <img src={item.sprite} className="h-24 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform scale-110" alt="" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-2xl font-black uppercase italic leading-none mb-2 text-white group-hover:text-blue-400 transition-colors">{item.name}</h4>
                      <p className="text-xs font-medium text-white/50 leading-relaxed max-w-[280px] italic mb-4">"{item.description}"</p>
                      {isHired && (
                        <div className="bg-blue-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg animate-bounceSlow">
                          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          🕒 {minutesLeft}m restantes
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <button 
                      disabled={isHired || !canAfford || !hasBadges}
                      onClick={() => onHireAlly(item.id, item.cost)}
                      className={`group/btn relative px-10 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] transition-all overflow-hidden ${
                        !isHired && canAfford && hasBadges
                        ? 'bg-blue-500 text-white shadow-[0_15px_35px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 border-b-8 border-blue-800' 
                        : isHired ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 cursor-default' : 'bg-white/5 text-white/20 grayscale cursor-not-allowed'
                      }`}
                    >
                      {isHired ? 'EM CAMPO' : (
                        <span className="flex flex-col items-center">
                          <span className="leading-none">{item.cost.toLocaleString()} C</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: MINE */}
        {activeTab === 'mine' && (
          <div className="animate-slideUp flex flex-col gap-10">
            <div className="relative bg-gradient-to-br from-slate-900 via-[#0f172a] to-slate-900 p-12 rounded-[4rem] border-2 border-white/10 text-center overflow-hidden shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 blur-[100px] rounded-full" />
               
               <div className="relative z-10">
                 <div className="w-32 h-32 bg-black/60 rounded-[3rem] flex items-center justify-center text-7xl mx-auto mb-8 shadow-2xl border-2 border-white/5 group hover:rotate-12 transition-transform duration-700">
                   <span className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">⛏️</span>
                 </div>
                 <h3 className="text-4xl font-black uppercase italic mb-3 tracking-tighter leading-none bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">Mineração Passiva</h3>
                 <p className="text-sm text-white/40 leading-relaxed mb-10 max-w-md mx-auto italic">
                   "A extração automatizada garante recursos para sua forja enquanto você treina seus Pokémon."
                 </p>

                 <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
                    <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Nível de Operação</p>
                      <p className="text-3xl font-black text-amber-400 italic tabular-nums">{gameState.mine?.level || 0}</p>
                    </div>
                    <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Produção / Hora</p>
                      <p className="text-3xl font-black text-blue-400 italic tabular-nums">
                        {gameState.mine?.level > 0 ? (gameState.mine.level * 5) : 0} <span className="text-sm font-bold opacity-30 italic">Pç</span>
                      </p>
                    </div>
                 </div>

                 {(!gameState.mine?.level || gameState.mine.level < 3) && (
                   <button 
                     onClick={handleMineUpgrade}
                     disabled={currency < (MINE_LEVELS[(gameState.mine?.level || 0) + 1]?.unlockCost || MINE_LEVELS[(gameState.mine?.level || 0) + 1]?.upgradeCost)}
                     className="group relative w-full max-w-sm bg-amber-400 text-slate-900 py-7 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(251,191,36,0.3)] border-b-8 border-amber-600 hover:scale-[1.02] active:translate-y-2 active:border-b-0 transition-all duration-300"
                   >
                     <span className="text-lg leading-none block mb-1">
                       {gameState.mine?.level === 0 ? 'DESBLOQUEAR MINA' : 'UPGRADE DE OPERAÇÃO'}
                     </span>
                     <span className="block text-[10px] font-bold opacity-70">
                       Investimento: {(gameState.mine?.level === 0 ? MINE_LEVELS[1].unlockCost : MINE_LEVELS[gameState.mine.level].upgradeCost)?.toLocaleString()} Coins
                     </span>
                   </button>
                 )}
               </div>
            </div>
          </div>
        )}

        {/* TAB: FISHING */}
        {activeTab === 'fishing' && (
          <div className="grid gap-6 animate-slideUp">
            {Object.values(FISHING_RODS).map((item, idx) => {
              const isOwned = gameState.fishing?.rod === item.id;
              const canAfford = currency >= item.cost;
              const hasBadges = badges >= (item.minBadges || 0);

              return (
                <div key={item.id} className={`group p-8 rounded-[3rem] border-2 flex items-center justify-between transition-all duration-500 ${isOwned ? 'bg-sky-500/10 border-sky-400' : 'bg-slate-800/40 border-white/10'}`}>
                   <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-black/60 rounded-[2rem] flex items-center justify-center text-6xl shadow-2xl border-2 border-white/5 transition-transform group-hover:-rotate-12">
                      🎣
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase italic leading-none mb-2 group-hover:text-sky-400 transition-colors">{item.name}</h4>
                      <p className="text-xs font-medium text-white/40 leading-relaxed max-w-[300px] italic">"{item.description}"</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isOwned ? (
                      <div className="bg-sky-400/10 text-sky-400 px-6 py-3 rounded-2xl border border-sky-400/30 font-black uppercase tracking-widest text-[10px]">Equipado</div>
                    ) : (
                      <button 
                        disabled={!canAfford || !hasBadges}
                        onClick={() => handleBuy('rod', item)}
                        className={`px-8 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest border-b-8 transition-all ${
                          canAfford && hasBadges 
                          ? 'bg-sky-500 text-white border-sky-700 shadow-xl hover:scale-105' 
                          : 'bg-white/5 text-white/20 grayscale'
                        }`}
                      >
                        {item.cost.toLocaleString()} <span className="text-[9px] opacity-60">COINS</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: GYM */}
        {activeTab === 'gym' && (
          <div className="animate-slideUp">
            <div className="bg-slate-800/40 p-8 rounded-[4rem] border-2 border-white/10">
              <div className="flex flex-col items-center text-center mb-10">
                 <span className="text-6xl mb-4">🚩</span>
                 <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Personalização de Ginásio</h4>
                 <p className="text-xs text-white/30 max-w-xs mt-2 uppercase font-bold tracking-widest">Defina sua identidade visual no cenário competitivo</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {Object.values(GYM_BANNERS).map((item, idx) => {
                  const isActive = gameState.gymCustom?.bannerId === item.id;
                  const canAfford = currency >= item.cost;
                  return (
                    <button 
                      key={item.id}
                      onClick={() => handleBuy('banner', item)}
                      className={`group relative p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-4 transition-all duration-300 ${
                        isActive ? 'bg-white/10 border-white/40 shadow-2xl' : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="w-full h-20 rounded-2xl border-4 border-black/30 shadow-inner relative overflow-hidden" style={{ backgroundColor: item.color }}>
                         <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" />
                         <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <span className="text-4xl">🔱</span>
                         </div>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1">{item.name}</p>
                        {isActive ? (
                           <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">ATIVO</span>
                        ) : (
                           <span className="text-[10px] font-black text-amber-400 tabular-nums">{item.cost.toLocaleString()} C</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer / Fade Out Layer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none z-20" />
      
      {/* Estilos Globais Customizados para a Loja */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounceSlow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
};

export default PrestigeShop;

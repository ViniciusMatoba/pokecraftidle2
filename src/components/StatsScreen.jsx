import React, { useState } from 'react';
import { ACHIEVEMENTS_LIST } from '../data/constants';

const StatsScreen = ({ gameState, setGameState, setCurrentView }) => {
  const [activeTab, setActiveTab] = useState('stats');

  const totalCaptured = Object.keys(gameState.caughtData || {}).length;
  const playTimeSeconds = gameState.playTimeSeconds || 0;
  const hours = Math.floor(playTimeSeconds / 3600);
  const minutes = Math.floor((playTimeSeconds % 3600) / 60);

  // Encontra o pokemon mais forte (maior nível) no time ou PC
  const allPokemon = [...(gameState.team || []), ...(gameState.pc || [])];
  const strongest = allPokemon.reduce((max, p) => (p.level > (max?.level || 0) ? p : max), null);

  const statsList = [
    { label: 'Batalhas Vencidas', value: gameState.totalBattlesWon || 0, icon: '⚔️' },
    { label: 'Pokémon Capturados', value: totalCaptured, icon: '📦' },
    { label: 'Shinies Encontrados', value: gameState.shinyCapturedCount || 0, icon: '✨' },
    { label: 'Insígnias Conquistadas', value: (gameState.badges || []).length, icon: '🏅' },
    { label: 'Dinheiro Acumulado', value: `$${(gameState.totalCurrencyEarned || 0).toLocaleString()}`, icon: '💰' },
    { label: 'Tempo Jogado', value: `${hours}h ${minutes}m`, icon: '⏱️' },
    { label: 'Mais Forte', value: strongest ? `${strongest.name} (Lv ${strongest.level})` : 'Nenhum', icon: '🔥' },
  ];

  const handleClaim = (achievement) => {
    if (gameState.claimedAchievements?.includes(achievement.id)) return;

    setGameState(prev => {
      let newState = { ...prev };
      
      // Entrega as recompensas
      if (achievement.rewards.currency) {
        newState.currency = (newState.currency || 0) + achievement.rewards.currency;
        newState.totalCurrencyEarned = (newState.totalCurrencyEarned || 0) + achievement.rewards.currency;
      }
      
      if (achievement.rewards.items) {
        newState.inventory = { ...newState.inventory, items: { ...newState.inventory.items } };
        Object.entries(achievement.rewards.items).forEach(([item, qty]) => {
          newState.inventory.items[item] = (newState.inventory.items[item] || 0) + qty;
        });
      }

      // Adiciona aos reclamados
      newState.claimedAchievements = [...(prev.claimedAchievements || []), achievement.id];

      return newState;
    });
  };

  const equipTitle = (titleId) => {
    setGameState(prev => ({
      ...prev,
      trainer: {
        ...(prev.trainer || {}),
        titleId: titleId
      }
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          📊 Estatísticas e Conquistas
        </h2>
        <button 
          onClick={() => setCurrentView('menu')}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
        >
          Voltar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-800 shrink-0">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-3 font-semibold text-sm transition-colors ${
            activeTab === 'stats' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          Estatísticas
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex-1 py-3 font-semibold text-sm transition-colors ${
            activeTab === 'achievements' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          Conquistas
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {statsList.map((stat, i) => (
              <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                <div className="text-3xl">{stat.icon}</div>
                <div>
                  <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-3">
            {ACHIEVEMENTS_LIST.map(ach => {
              const isCompleted = ach.condition(gameState);
              const isClaimed = (gameState.claimedAchievements || []).includes(ach.id);
              const isEquippedTitle = gameState.trainer?.titleId === ach.rewards.titleId;

              return (
                <div 
                  key={ach.id} 
                  className={`relative overflow-hidden rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isClaimed 
                      ? 'bg-slate-800 border-slate-700 opacity-75' 
                      : isCompleted 
                        ? 'bg-amber-900/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                        : 'bg-slate-800/50 border-slate-700/50 grayscale'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl bg-slate-900/50 p-2 rounded-lg">{ach.icon}</div>
                    <div>
                      <h3 className={`font-bold text-lg ${isCompleted ? 'text-amber-400' : 'text-slate-300'}`}>
                        {ach.name}
                      </h3>
                      <p className="text-slate-400 text-sm">{ach.description}</p>
                      <p className="text-emerald-400 text-xs font-semibold mt-1">
                        🎁 Recompensa: {ach.rewardText}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {!isCompleted && (
                      <div className="px-4 py-2 bg-slate-700/50 text-slate-400 rounded font-medium text-sm text-center">
                        Em progresso
                      </div>
                    )}
                    {isCompleted && !isClaimed && (
                      <button
                        onClick={() => handleClaim(ach)}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded shadow-lg transition-transform active:scale-95"
                      >
                        Resgatar
                      </button>
                    )}
                    {isClaimed && !ach.rewards.titleId && (
                      <div className="px-4 py-2 bg-slate-700 text-emerald-400 rounded font-medium text-sm flex items-center gap-1">
                        <span>✓</span> Concluído
                      </div>
                    )}
                    {isClaimed && ach.rewards.titleId && (
                      <button
                        onClick={() => equipTitle(ach.rewards.titleId)}
                        className={`px-4 py-2 rounded font-bold text-sm transition-colors ${
                          isEquippedTitle 
                            ? 'bg-indigo-600 text-white cursor-default' 
                            : 'bg-slate-600 hover:bg-indigo-500 text-white'
                        }`}
                        disabled={isEquippedTitle}
                      >
                        {isEquippedTitle ? 'Título Equipado' : 'Equipar Título'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsScreen;

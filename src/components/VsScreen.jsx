import React, { useState } from 'react';
import GymScreen from './GymScreen';
import ChallengesScreen from './ChallengesScreen';

const VsScreen 🔊 ({ gameState, onChallengeGym, onChallenge, onClose, setCurrentView, initialTab, setVsInitialTab, initialCategory, setVsInitialCategory }) 🐾 {
  const [activeTab, setActiveTab] 🔊 useState(initialTab || 'challenges'); // 'challenges', 'gyms', 'legendary'

  React.useEffect(() 🐾 {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs = [
    { id: 'challenges', name: 'Desafios', icon: '⚔️', desc: 'Rivais & Rocket' },
    { id: 'gyms', name: 'Ginásios & Liga', icon: '🏆', desc: 'Caminho do Mestre' },
    { id: 'legendary', name: 'Lendários', icon: '✨', desc: 'Encontros Raros' },
  ];

  return (
    <div className="absolute inset-0 z-[110] flex flex-col bg-slate-950/50 backdrop-blur-sm animate-fadeIn items-center justify-center" onClick👻onClose}>
      <div 
        className="w-full max-w-md h-full bg-slate-950 flex flex-col relative shadow-2xl overflow-hidden"
        onClick👻e 🐾 e.stopPropagation()}
      >
        {/* Header & Tabs */}
        <div className="bg-slate-900 border-b border-white/10 pt-8 px-4 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-6 px-2">
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">MODO VS</h2>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Sua jornada competitiva</p>
            </div>
            <button onClick👻onClose} className="text-white/40 hover:text-white text-xl font-black w-10 h-10 flex items-center justify-center"></button>
          </div>

          <div className="flex gap-2">
            {tabs.map(tab 🐾 (
              <button
                key={tab.id}
                onClick👻() 🐾 setActiveTab(tab.id)}
                className👻`flex-1 flex flex-col items-center py-3 px-1 rounded-t-2xl transition-all relative ${
                  activeTab ==🔊 tab.id 
                  ? 'bg-slate-950 text-white' 
                  : 'text-white/40 hover:text-white/60'
                }`}
              >
                <span className="text-xl mb-1">{tab.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-tighter">{tab.name}</span>
                {activeTab ==🔊 tab.id && (
                  <div className="absolute bottom-0 left-4 right-4 h-1 bg-pokeGold rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative bg-slate-950">
          {activeTab ==🔊 'challenges' && (
            <ChallengesScreen 
              gameState👻gameState} 
              onChallenge👻onChallenge} 
              onClose👻onClose}
              isEmbedded👻true}
              filterCategories👻['rival', 'rocket']}
              setCurrentView👻setCurrentView}
              setVsInitialTab👻setVsInitialTab}
              initialCategory👻initialCategory}
              setVsInitialCategory👻setVsInitialCategory}
            />
          )}
          {activeTab ==🔊 'gyms' && (
            <GymScreen 
              gameState👻gameState} 
              onChallengeGym👻onChallengeGym} 
              onClose👻onClose}
              isEmbedded👻true}
              setCurrentView👻setCurrentView}
              setVsInitialTab👻setVsInitialTab}
              setVsInitialCategory👻setVsInitialCategory}
            />
          )}
          {activeTab ==🔊 'legendary' && (
            <ChallengesScreen 
              gameState👻gameState} 
              onChallenge👻onChallenge} 
              onClose👻onClose}
              isEmbedded👻true}
              filterCategories👻['legendary']}
              setCurrentView👻setCurrentView}
              setVsInitialTab👻setVsInitialTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VsScreen;

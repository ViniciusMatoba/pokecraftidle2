import React, { useState } from 'react';
import GymScreen from './GymScreen';
import ChallengesScreen from './ChallengesScreen';
import BossScreen from './BossScreen';

const VsScreen = ({ gameState, onChallengeGym, onChallenge, onClose, setCurrentView, initialTab, setVsInitialTab, initialCategory, setVsInitialCategory, initialRegion, setVsInitialRegion }) => {
  const normalizeTab = (tab) => tab === 'johto' ? 'gyms' : (tab || 'challenges');
  const [activeTab, setActiveTab] = useState(normalizeTab(initialTab)); // 'challenges', 'gyms', 'legendary'
  const [region, setRegion] = useState(initialRegion || (['johto', 'hoenn'].includes(initialCategory) ? initialCategory : 'kanto'));

  const worldFlags = gameState.worldFlags || [];
  const kantoChampion = worldFlags.includes('champion');
  const hoennAvailable = kantoChampion || worldFlags.includes('hoenn_started') || worldFlags.includes('johto_champion');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  React.useEffect(() => {
    if (initialRegion) {
      setRegion(initialRegion);
    } else if (['johto', 'hoenn'].includes(initialCategory)) {
      setRegion(initialCategory);
    }
  }, [initialCategory, initialRegion]);

  const tabs = [
    { id: 'challenges', name: 'Desafios', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png', desc: 'Rivais & Rocket' },
    { id: 'gyms', name: 'Ginasios & Liga', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hard-stone.png', desc: 'Caminho do Mestre' },
    { id: 'legendary', name: 'Lendarios', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/star-piece.png', desc: 'Encontros Raros' },
    { id: 'boss', name: 'BOSS', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png', desc: 'Desafio Global' },
  ];

  return (
    <div className="absolute inset-0 z-[110] flex flex-col bg-slate-950/50 backdrop-blur-sm animate-fadeIn items-center justify-center" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-slate-950 flex flex-col relative shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header & Tabs */}
        <div className="bg-slate-900 border-b border-white/10 pt-8 px-4 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">MODO VS</h2>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Sua jornada competitiva</p>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white text-xl font-black w-10 h-10 flex items-center justify-center">x</button>
          </div>

          {/* Region Selector */}
          {kantoChampion && (
            <div className="grid grid-cols-3 gap-2 mb-4 px-2">
              <button
                onClick={() => setRegion('kanto')}
                className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${region === 'kanto' ? 'bg-pokeGold text-slate-950 shadow-lg' : 'bg-white/5 text-white/40'}`}
              >
                Kanto
              </button>
              <button
                onClick={() => setRegion('johto')}
                className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${region === 'johto' ? 'bg-pokeGold text-slate-950 shadow-lg' : 'bg-white/5 text-white/40'}`}
              >
                Johto
              </button>
              {hoennAvailable && (
                <button
                  onClick={() => setRegion('hoenn')}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${region === 'hoenn' ? 'bg-pokeGold text-slate-950 shadow-lg' : 'bg-white/5 text-white/40'}`}
                >
                  Hoenn
                </button>
              )}
            </div>
          )}

          <div className="flex gap-4 pb-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 px-1 rounded-t-2xl transition-all relative ${
                  activeTab === tab.id
                  ? 'bg-slate-950 text-white'
                  : 'text-white/40 hover:text-white/60'
                }`}
              >
                <img src={tab.icon} className="w-6 h-6 mb-1 object-contain" alt="" />
                <span className="text-[10px] font-black uppercase tracking-tighter">{tab.name}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-4 right-4 h-1 bg-pokeGold rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative bg-slate-950 pt-4">
          {activeTab === 'challenges' && (
            <ChallengesScreen
              gameState={gameState}
              onChallenge={onChallenge}
              onClose={onClose}
              isEmbedded={true}
              filterCategories={['rival', 'rocket']}
              forcedRegion={region}
              setCurrentView={setCurrentView}
              setVsInitialTab={setVsInitialTab}
              initialCategory={initialCategory}
              setVsInitialCategory={setVsInitialCategory}
            />
          )}
          {activeTab === 'gyms' && (
            <GymScreen
              gameState={gameState}
              onChallengeGym={onChallengeGym}
              onChallenge={onChallenge}
              onClose={onClose}
              initialSection={initialCategory}
              forcedRegion={region}
              isEmbedded={true}
              setCurrentView={setCurrentView}
              setVsInitialTab={setVsInitialTab}
              setVsInitialCategory={setVsInitialCategory}
            />
          )}
          {activeTab === 'legendary' && (
            <ChallengesScreen
              gameState={gameState}
              onChallenge={onChallenge}
              onClose={onClose}
              isEmbedded={true}
              filterCategories={['legendary']}
              forcedRegion={region}
              setCurrentView={setCurrentView}
              setVsInitialTab={setVsInitialTab}
            />
          )}
          {activeTab === 'boss' && (
            <BossScreen
              gameState={gameState}
              onChallengeBoss={(bossData) => onChallenge(bossData, 'boss')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VsScreen;

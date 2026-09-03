import React, { useState } from 'react';
import GymScreen from './GymScreen';
import ChallengesScreen from './ChallengesScreen';
import BossScreen from './BossScreen';
import { getUnlockedRegions, REGION_LABELS } from '../data/regionStandards';

const VsScreen = ({ gameState, setGameState, notify, powerScore = 0, onChallengeGym, onChallenge, onClose, setCurrentView, initialTab, setVsInitialTab, initialCategory, setVsInitialCategory, initialRegion, setVsInitialRegion }) => {
  const normalizeTab = (tab) => tab === 'johto' ? 'gyms' : (tab || 'challenges');
  const [activeTab, setActiveTab] = useState(normalizeTab(initialTab)); // 'challenges', 'gyms', 'legendary'
  const [region, setRegion] = useState(initialRegion || (initialCategory === 'johto' ? 'johto' : 'kanto'));

  const worldFlags = gameState.worldFlags || [];
  const kantoChampion = worldFlags.includes('champion');
  const availableRegions = getUnlockedRegions(gameState).map(id => ({ id, label: REGION_LABELS[id] || id }));

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  React.useEffect(() => {
    if (initialRegion) {
      setRegion(initialRegion);
    } else if (initialCategory === 'johto') {
      setRegion('johto');
    } else if (initialCategory === 'hoenn') {
      setRegion('hoenn');
    } else if (initialCategory === 'sinnoh') {
      setRegion('sinnoh');
    } else if (REGION_LABELS[initialCategory]) {
      setRegion(initialCategory);
    }
  }, [initialCategory, initialRegion]);

  const tabs = [
    { id: 'challenges', name: 'Desafios', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png', desc: 'Rivais & Rocket' },
    { id: 'gyms', name: 'Ginasios & Liga', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hard-stone.png', desc: 'Caminho do Mestre' },
    { id: 'rematch', name: 'Revanches', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-revive.png', desc: 'Elite Rematch' },
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
            <div className={`grid ${availableRegions.length >= 5 ? 'grid-cols-5' : availableRegions.length >= 4 ? 'grid-cols-4' : availableRegions.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 mb-4 px-2`}>
              {availableRegions.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setRegion(entry.id)}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${region === entry.id ? 'bg-pokeGold text-slate-950 shadow-lg' : 'bg-white/5 text-white/40'}`}
                >
                  {entry.label}
                </button>
              ))}
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
              setVsInitialRegion={setVsInitialRegion}
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
              setVsInitialRegion={setVsInitialRegion}
            />
          )}
          {activeTab === 'rematch' && (
            <ChallengesScreen
              gameState={gameState}
              onChallenge={onChallenge}
              onClose={onClose}
              isEmbedded={true}
              filterCategories={['rematch']}
              forcedRegion={region}
              setCurrentView={setCurrentView}
              setVsInitialTab={setVsInitialTab}
              setVsInitialRegion={setVsInitialRegion}
            />
          )}
          {activeTab === 'boss' && (
            <BossScreen
              gameState={gameState}
              setGameState={setGameState}
              notify={notify}
              powerScore={powerScore}
              onChallengeBoss={(bossData) => onChallenge(bossData, 'boss')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VsScreen;

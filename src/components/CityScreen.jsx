import React, { useState } from 'react';
import { TrainerCard } from './CommonUI';
import GymScreen from './GymScreen';

const CityScreen = ({ 
  gameState, 
  ROUTES, 
  fixPath, 
  setActiveBuildingModal, 
  setActiveQuestModal, 
  activeQuestModal,
  setGameState,
  setCurrentView,
  setCurrentEnemy,
  onChallengeRival,
  onChallengeGym,
  onBackToBattle
}) => {
  const [showGymScreen, setShowGymScreen] = useState(false);
  const route = ROUTES[gameState.currentRoute] || ROUTES.pallet_town;

  const cityBuildings = [
    { 
      id: 'pokecenter', 
      name: 'Centro Pokémon', 
      icon: fixPath('/icon_pokecenter_building_1776876572062.png'),
      emoji: '🏥',
      desc: 'Cure sua equipe gratuitamente.',
      action: () => setActiveBuildingModal('pokecenter'),
      color: 'border-red-500 bg-red-50'
    },
    { 
      id: 'mart', 
      name: 'Poké Mart', 
      icon: fixPath('/icon_pokemart_building_1776876590556.png'),
      emoji: '🏪',
      desc: 'Compre itens e suprimentos.',
      action: () => setActiveBuildingModal('mart'),
      color: 'border-blue-500 bg-blue-50'
    },
    { 
      id: 'forge', 
      name: 'Forja Pokémon', 
      icon: fixPath('/icon_forge_building_1776876610240.png'),
      emoji: '🔨',
      desc: 'Crie itens raros com materiais.',
      action: () => setActiveBuildingModal('forge'),
      color: 'border-slate-500 bg-slate-50'
    },
    {
      id: 'gyms',
      name: 'Ginásios & Liga',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/boulder-badge.png',
      emoji: '🏆',
      desc: `${(gameState.badges || []).length}/8 insígnias conquistadas. Desafie os Líderes!`,
      action: () => setShowGymScreen(true),
      color: 'border-pokeGold bg-yellow-50'
    },
  ];

  if (gameState.currentRoute === 'pallet_town') {
    const rivalDefeated = gameState.worldFlags.includes('rival_lab_defeated');
    cityBuildings.push({
      id: 'oak_lab',
      name: 'Laboratório do Carvalho',
      icon: 'https://play.pokemonshowdown.com/sprites/trainers/oak.png',
      emoji: '🧪',
      desc: rivalDefeated ? 'O Prof. Carvalho está estudando novas espécies.' : 'Desafie seu Rival e receba dicas.',
      action: () => {
        if (rivalDefeated) {
          alert('Prof. Carvalho: "Azul já saiu em sua própria jornada! Ele disse que vai ficar mais forte que você!"');
        } else {
          if (window.confirm('Deseja desafiar seu Rival Azul para uma batalha?')) {
            onChallengeRival && onChallengeRival();
          }
        }
      },
      color: 'border-pokeBlue bg-blue-50'
    });
  }

  return (
    <div className="h-full flex flex-col animate-fadeIn pb-24 relative overflow-y-auto custom-scrollbar">
      <div className="relative z-10 p-4 md:p-6 flex flex-col gap-4 md:gap-6">
        <TrainerCard trainer={gameState.trainer} badges={gameState.badges || []} caughtCount={Object.keys(gameState.caughtData || {}).length} />
        
        {(gameState.worldFlags || []).includes('quest_capture_active') && (
          <button 
            onClick={() => setActiveQuestModal({
              title: "Primeira Captura!",
              desc: "O Prof. Carvalho quer que você aprenda a capturar POKÉMONS. Vá até a ROTA 1 e capture seu primeiro parceiro!",
              targetRoute: 'route_1',
              reward: "10 Pokébolas",
              icon: "https://play.pokemonshowdown.com/sprites/trainers/oak.png"
            })}
            className="w-full bg-pokeBlue text-white p-4 rounded-2xl shadow-xl animate-bounce flex items-center gap-4 hover:scale-[1.02] transition-transform"
          >
             <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-12 h-12" alt="Oak" />
             <div className="text-left">
                <p className="text-[10px] font-black uppercase">Missão Ativa:</p>
                <p className="text-xs font-bold italic">"Capture seu primeiro Pokémon!"</p>
             </div>
          </button>
        )}

        {(gameState.worldFlags || []).includes('quest_capture_done') && !(gameState.worldFlags || []).includes('quest_capture_done_ack') && (
          <div className="w-full bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl shadow-xl border-b-4 border-green-700 animate-bounceIn flex items-center gap-4">
            <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-14 h-14 drop-shadow-lg shrink-0" alt="Oak" />
            <div className="flex-1 text-left">
              <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">✅ Missão Concluída!</p>
              <p className="text-xs font-bold text-white italic">"Parabéns! Você capturou seu primeiro Pokémon! Seu percurso começa agora!"</p>
              <p className="text-[9px] font-black text-white/70 mt-1 uppercase">+ 10 Pokébolas recebidas</p>
            </div>
            <button
              onClick={() => setGameState(prev => ({ ...prev, worldFlags: [...(prev.worldFlags || []), 'quest_capture_done_ack'] }))}
              className="bg-white/20 text-white font-black text-xs px-3 py-2 rounded-xl hover:bg-white/30 transition-all shrink-0"
            >OK!</button>
          </div>
        )}

        {activeQuestModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
             <div className="bg-white rounded-[3rem] p-8 max-w-md w-full shadow-2xl border-b-[12px] border-pokeBlue animate-bounceIn">
                <div className="flex items-center gap-6 mb-6">
                   <img src={activeQuestModal.icon} className="w-20 h-20 drop-shadow-lg" alt="QuestIcon" />
                   <div className="text-left">
                      <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-none">{activeQuestModal.title}</h3>
                      <span className="text-[10px] font-black text-pokeBlue uppercase tracking-widest">Objetivo Principal</span>
                   </div>
                </div>
                <p className="text-slate-600 font-bold italic mb-8 leading-relaxed text-left">"{activeQuestModal.desc}"</p>
                <div className="bg-blue-50 p-4 rounded-2xl mb-8 border-2 border-blue-100 text-left">
                   <p className="text-[9px] font-black text-blue-400 uppercase">Recompensa Estimada</p>
                   <p className="text-sm font-black text-slate-800 uppercase mt-1">🎁 {activeQuestModal.reward}</p>
                </div>
                <div className="flex flex-col gap-3">
                   <button 
                     onClick={() => {
                        setGameState(prev => ({ ...prev, currentRoute: activeQuestModal.targetRoute }));
                        setCurrentEnemy(null);
                        setCurrentView('battles');
                        setActiveQuestModal(null);
                     }}
                     className="w-full bg-pokeBlue text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 shadow-lg"
                   >Ir para a Missão!</button>
                   <button 
                     onClick={() => setActiveQuestModal(null)}
                     className="w-full text-slate-400 py-3 font-black uppercase text-xs hover:text-slate-600"
                   >Fechar</button>
                </div>
             </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {cityBuildings.map(b => (
            <button 
              key={b.id}
              onClick={b.action}
              className={`p-6 rounded-[2.5rem] border-4 ${b.color} shadow-xl hover:-translate-y-1 transition-all flex items-center gap-6 text-left group active:scale-95 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-inner border-2 border-white group-hover:rotate-6 transition-transform overflow-hidden">
                 <img 
                   src={b.icon} 
                   className="w-10 h-10 object-contain" 
                   alt={b.name} 
                   onError={(e) => {
                     e.target.style.display = 'none';
                     e.target.nextSibling.style.display = 'flex';
                   }}
                 />
                 <span className="hidden text-3xl items-center justify-center w-full h-full">{b.emoji}</span>
              </div>
              <div className="flex-1">
                 <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">{b.name}</h3>
                 <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">{b.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {gameState.lastFarmingRoute && (
          <button 
            onClick={() => onBackToBattle && onBackToBattle()}
            className="w-full mt-4 bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg border-b-8 border-slate-900 flex items-center justify-center gap-3 active:scale-95"
          >
            <span className="text-xl">⚔️</span>
            Voltar para Treino
          </button>
        )}
      </div>

      {showGymScreen && (
        <GymScreen
          gameState={gameState}
          onChallengeGym={(gymData) => {
            setShowGymScreen(false);
            onChallengeGym && onChallengeGym(gymData);
          }}
          onClose={() => setShowGymScreen(false)}
        />
      )}
    </div>
  );
};

export default CityScreen;

import React, { useState } from 'react';
import { TrainerCard } from './CommonUI';

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
  onBackToBattle,
  onOpenExpeditions,
  onOpenHouse
}) => {
  const [activeOakModal, setActiveOakModal] = useState(false);
  const [oakTipIndex, setOakTipIndex] = useState(0);

  const starterInfo = [
    { 
      id: 1, 
      name: "Bulbasaur", 
      desc: "Há uma semente de planta em suas costas desde o dia em que o Pokémon nasce. A semente cresce lentamente.",
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    },
    { 
      id: 4, 
      name: "Charmander", 
      desc: "Tem preferência por coisas quentes. Quando chove, diz-se que o vapor jorra da ponta de sua cauda.",
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
    },
    { 
      id: 7, 
      name: "Squirtle", 
      desc: "Após o nascimento, suas costas incham e endurecem formando uma concha. Ele espalha espuma poderosamente pela boca.",
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
    }
  ];

  const oakTips = [
    'O vínculo entre você e seu Pokémon é o que definirá sua força!',
    'Azul já partiu para a Rota 1. Ele parece muito determinado a vencer o primeiro Ginásio!',
    'Pokémons de tipos diferentes têm vantagens e desvantagens. Estude-os bem!',
    'Capturar muitos Pokémons da mesma espécie aumenta sua Mestria com eles!',
    'Não esqueça de curar sua equipe no Centro Pokémon após batalhas difíceis.'
  ];

  const cityBuildings = [
    { 
      id: 'pokecenter', 
      name: 'Centro Pokémon', 
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png',
      emoji: '🏥',
      desc: 'Cure sua equipe gratuitamente.',
      action: () => setActiveBuildingModal('pokecenter'),
      color: 'border-red-500 bg-red-50'
    },
    { 
      id: 'mart', 
      name: 'Poké Mart', 
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
      emoji: '🏪',
      desc: 'Compre itens e suprimentos.',
      action: () => setActiveBuildingModal('mart'),
      color: 'border-blue-500 bg-blue-50'
    },
    { 
      id: 'forge', 
      name: 'Forja Pokémon', 
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png',
      emoji: '🔨',
      desc: 'Crie itens raros com materiais.',
      action: () => setActiveBuildingModal('forge'),
      color: 'border-slate-500 bg-slate-50'
    },
    {
      id: 'expeditions',
      name: 'Expedições',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/explorer-kit.png',
      emoji: '🧭',
      desc: 'Envie Pokémon do PC para coletar recursos em biomas.',
      action: () => onOpenExpeditions && onOpenExpeditions(),
      color: 'border-purple-500 bg-purple-50',
    }
  ];

  if (gameState.house?.owned) {
    cityBuildings.push({
      id: 'house',
      name: 'Minha Casa',
      icon: null,
      emoji: '🏠',
      desc: 'Cultive Berries e Apricorns no seu jardim.',
      action: () => onOpenHouse && onOpenHouse(),
      color: 'border-amber-500 bg-amber-50',
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

        {activeOakModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn" onClick={() => setActiveOakModal(false)}>
             <div 
               className="bg-white rounded-[3rem] p-8 max-w-lg w-full shadow-2xl border-b-[12px] border-slate-800 animate-slideInUp overflow-y-auto custom-scrollbar flex flex-col max-h-[90vh]"
               onClick={e => e.stopPropagation()}
             >
                <div className="flex justify-between items-center mb-6">
                   <div className="flex flex-col items-center text-center gap-4 w-full">
                      <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-24 h-24 drop-shadow-md mx-auto" alt="Oak" />
                      <div>
                         <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-none">Laboratório</h3>
                         <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mt-1">Prof. Carvalho</p>
                      </div>
                   </div>
                   <button onClick={() => setActiveOakModal(false)} className="text-slate-300 hover:text-slate-800 transition-colors text-2xl"></button>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 mb-6 italic text-slate-600 font-bold text-sm relative">
                   <div className="absolute -top-3 -left-2 text-4xl text-slate-200 opacity-50">"</div>
                   <p className="">{oakTips[oakTipIndex]}</p>
                   <button 
                     onClick={() => setOakTipIndex((oakTipIndex + 1) % oakTips.length)}
                     className="mt-4 text-[9px] font-black uppercase text-pokeBlue flex items-center gap-2 hover:underline"
                   >
                     Ver outra dica ➜
                   </button>
                </div>

                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2 text-center">Registros dos Iniciais</p>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 mb-6">
                   {starterInfo.map(poke => (
                     <div key={poke.id} className="bg-white border-2 border-slate-100 rounded-[2rem] p-5 flex items-center gap-5 hover:border-slate-200 transition-all group">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                           <img src={poke.img} className="w-16 h-16 object-contain" alt={poke.name} />
                        </div>
                        <div className="text-left">
                           <h4 className="font-black text-slate-800 uppercase italic text-lg leading-none mb-2">{poke.name}</h4>
                           <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic line-clamp-3">"{poke.desc}"</p>
                        </div>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={() => setActiveOakModal(false)}
                  className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg active:scale-95"
                >Obrigado, Professor!</button>
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
                 {b.icon ? (
                   <img 
                     src={b.icon} 
                     className="w-10 h-10 object-contain" 
                     alt={b.name} 
                     onError={(e) => {
                       e.target.style.display = 'none';
                       e.target.nextSibling.style.display = 'flex';
                     }}
                   />
                 ) : null}
                 <span className={`${b.icon ? 'hidden' : 'flex'} text-3xl items-center justify-center w-full h-full`}>{b.emoji}</span>
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

    </div>
  );
};

export default CityScreen;

import React, { useState } from 'react';
import { TrainerCard } from './CommonUI';
import { HOUSE_PURCHASE_COST } from '../data/house';

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
  onOpenHouse,
  onBuyHouse
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
    },
    { 
      id: 25, 
      name: "Pikachu", 
      desc: "Sempre que o Pikachu encontra algo novo, ele o ataca com um choque elétrico. Se você vir uma fruta carbonizada, é sinal de que este Pokémon a testou.",
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
    },
    { 
      id: 133, 
      name: "Eevee", 
      desc: "Tem uma constituição genética irregular que sofre mutação repentina por qualquer causa. Radiação de várias pedras faz com que este Pokémon evolua.",
      img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png"
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

  const hasHouseUnlocked = (gameState.badges || []).includes('boulder_badge')
    || (gameState.worldFlags || []).includes('oak_house_shown');
  const canBuyHouse = (gameState.currency || 0) >= HOUSE_PURCHASE_COST;

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
  } else if (hasHouseUnlocked) {
    cityBuildings.push({
      id: 'house_purchase',
      name: 'Comprar Casa',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berry-pots.png',
      emoji: 'ðŸ¡',
      desc: canBuyHouse
        ? `${HOUSE_PURCHASE_COST.toLocaleString()} coins - liberar jardim e cuidadores.`
        : `Faltam ${(HOUSE_PURCHASE_COST - (gameState.currency || 0)).toLocaleString()} coins para comprar.`,
      action: () => canBuyHouse && onBuyHouse && onBuyHouse(),
      color: canBuyHouse ? 'border-amber-500 bg-amber-50' : 'border-slate-300 bg-slate-50',
      disabled: !canBuyHouse,
    });
  }

  if ((gameState.worldFlags || []).includes('champion') && !(gameState.worldFlags || []).includes('johto_started')) {
    cityBuildings.push({
      id: 'johto_start',
      name: 'Iniciar Johto',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gb-sounds.png',
      emoji: 'J',
      desc: 'Fale com o professor de Johto e comece uma nova jornada regional.',
      action: () => setCurrentView && setCurrentView('johto_intro'),
      color: 'border-emerald-500 bg-emerald-50',
    });
  }


  return (
    <div className="h-full flex flex-col animate-fadeIn pb-24 relative overflow-y-auto custom-scrollbar">
      <div className="relative z-10 p-4 md:p-6 flex flex-col gap-4 md:gap-6">
        <TrainerCard trainer={gameState.trainer} badges={gameState.badges || []} caughtCount={Object.keys(gameState.caughtData || {}).length} worldFlags={gameState.worldFlags || []} />
        
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
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn" onClick={() => setActiveOakModal(false)}>
             <div
               className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-2xl animate-bounceIn overflow-hidden flex flex-col"
               onClick={e => e.stopPropagation()}
             >
                {/* Header Novo - Estilo Esmeralda */}
                <div className="bg-emerald-600 px-6 py-5 flex items-center justify-between shadow-xl shrink-0 z-20 border-b border-white/10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner overflow-hidden">
                         <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-10 h-10 object-contain drop-shadow-md" alt="Oak" />
                      </div>
                      <div className="text-left">
                         <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Prof. Carvalho</p>
                         <h3 className="text-white text-xl font-black uppercase italic leading-none tracking-tighter">Laboratório</h3>
                      </div>
                   </div>
                   <button onClick={() => setActiveOakModal(false)} className="w-9 h-9 rounded-full bg-white/10 text-white font-black flex items-center justify-center hover:bg-white/20 transition-colors shrink-0" aria-label="Fechar">x</button>
                </div>

                <div className="overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6" style={{ maxHeight: '70vh' }}>
                   <div className="bg-emerald-50 p-5 rounded-3xl border-2 border-emerald-100 italic text-slate-700 font-bold text-sm relative">
                      <div className="absolute -top-3 -left-2 text-4xl text-emerald-200 opacity-50">"</div>
                      <p>{oakTips[oakTipIndex]}</p>
                      <button
                        onClick={() => setOakTipIndex((oakTipIndex + 1) % oakTips.length)}
                        className="mt-4 text-[9px] font-black uppercase text-emerald-600 flex items-center gap-2 hover:underline"
                      >
                        Ver outra dica do Professor
                      </button>
                   </div>

                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 text-center">Registros dos Iniciais</p>

                   <div className="space-y-4">
                      {starterInfo.map(poke => (
                        <div key={poke.id} className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-4 flex items-center gap-4 hover:border-emerald-200 hover:bg-white transition-all group shadow-sm">
                           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-slate-100 group-hover:scale-110 transition-transform">
                              <img src={poke.img} className="w-14 h-14 object-contain" alt={poke.name} />
                           </div>
                           <div className="text-left min-w-0 flex-1">
                              <h4 className="font-black text-slate-800 uppercase italic text-base leading-none mb-2 truncate">{poke.name}</h4>
                              <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic line-clamp-3">"{poke.desc}"</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="px-6 pt-2 pb-6 border-t border-slate-100 shrink-0 bg-slate-50">
                   <button
                     onClick={() => setActiveOakModal(false)}
                     className="w-full min-h-[56px] bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg active:scale-95 border-b-4 border-slate-950"
                   >Obrigado, Professor</button>
                </div>
             </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {cityBuildings.map(b => (
            <button 
              key={b.id}
              onClick={b.action}
              disabled={b.disabled}
              className={`p-6 rounded-[2.5rem] border-4 ${b.color} shadow-xl transition-all flex items-center gap-6 text-left group relative overflow-hidden ${
                b.disabled ? 'opacity-70 cursor-not-allowed grayscale' : 'hover:-translate-y-1 active:scale-95'
              }`}
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

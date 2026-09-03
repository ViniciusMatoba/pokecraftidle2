import React, { useState } from 'react';
import { TrainerCard } from './CommonUI';
import { HOUSE_PURCHASE_COST } from '../data/house';
import { getActiveSpotlight, msUntilNextRotation } from '../data/weeklySpotlight';

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
  onBuyHouse,
  onSelectTitle,
  isAnyModalOpen,
  setIsAnyModalOpen,
  isTitleModalOpen,
  setIsTitleModalOpen,
  isPowerRankModalOpen,
  setIsPowerRankModalOpen,
  powerScore = 0,
  onOpenRegionBuilder,
  onOpenUnovaChampionModal,
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
      desc: 'Cure sua equipe gratuitamente.',
      action: () => setActiveBuildingModal('pokecenter'),
      color: 'border-red-500 bg-red-50'
    },
    { 
      id: 'mart', 
      name: 'Poké Mart', 
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
      desc: 'Compre itens e suprimentos.',
      action: () => setActiveBuildingModal('mart'),
      color: 'border-blue-500 bg-blue-50'
    },
    { 
      id: 'forge', 
      name: 'Forja Pokémon', 
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png',
      desc: 'Crie itens raros com materiais.',
      action: () => setActiveBuildingModal('forge'),
      color: 'border-slate-500 bg-slate-50'
    },
    {
      id: 'expeditions',
      name: 'Expedições',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/explorer-kit.png',
      desc: 'Envie Pokémon do PC para coletar recursos em biomas.',
      action: () => onOpenExpeditions && onOpenExpeditions(),
      color: 'border-purple-500 bg-purple-50',
    },
    {
      id: 'prestige_shop',
      name: 'Loja de Prestígio',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png',
      desc: 'Troque conquistas por recompensas exclusivas.',
      action: () => setActiveBuildingModal('prestige_shop'),
      color: 'border-amber-500 bg-amber-50',
    },
    {
      id: 'region_builder',
      name: 'Minha Região',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png',
      desc: gameState.myRegion?.published
        ? '🌐 Região publicada! Amigos podem te desafiar.'
        : (gameState.myRegion?.gymSlots || 0) > 0
          ? 'Configure ginásios, Elite Four e Campeão.'
          : 'Monte sua própria região na Loja de Prestígio.',
      action: () => onOpenRegionBuilder && onOpenRegionBuilder(),
      color: 'border-yellow-500 bg-yellow-50',
    },
  ];

  if ((gameState.worldFlags || []).includes('champion')) {
    cityBuildings.push({
      id: 'battle_tower',
      name: 'Battle Tower',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/battle-pass.png',
      desc: 'Modo Roguelike! Sobreviva a andares infinitos com regras especiais.',
      action: () => setCurrentView && setCurrentView('battle_tower'),
      color: 'border-red-600 bg-red-50',
    });
  }

  const hasHouseUnlocked = (gameState.badges || []).includes('boulder_badge')
    || (gameState.worldFlags || []).includes('oak_house_shown');
  const canBuyHouse = (gameState.currency || 0) >= HOUSE_PURCHASE_COST;

  const houseSvg = (
    <svg viewBox="0 0 64 64" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      {/* telhado */}
      <polygon points="32,6 58,30 6,30" fill="#e74c3c" stroke="#c0392b" strokeWidth="2" strokeLinejoin="round"/>
      {/* chaminé */}
      <rect x="42" y="12" width="7" height="14" rx="1" fill="#95a5a6" stroke="#7f8c8d" strokeWidth="1.5"/>
      {/* fumaça */}
      <circle cx="44" cy="9" r="2.5" fill="rgba(200,200,200,0.7)"/>
      <circle cx="47" cy="7" r="2" fill="rgba(200,200,200,0.5)"/>
      {/* paredes */}
      <rect x="10" y="28" width="44" height="28" rx="2" fill="#f5e6c8" stroke="#d4a853" strokeWidth="2"/>
      {/* janela esquerda */}
      <rect x="14" y="35" width="12" height="10" rx="2" fill="#aed6f1" stroke="#5dade2" strokeWidth="1.5"/>
      <line x1="20" y1="35" x2="20" y2="45" stroke="#5dade2" strokeWidth="1"/>
      <line x1="14" y1="40" x2="26" y2="40" stroke="#5dade2" strokeWidth="1"/>
      {/* janela direita */}
      <rect x="38" y="35" width="12" height="10" rx="2" fill="#aed6f1" stroke="#5dade2" strokeWidth="1.5"/>
      <line x1="44" y1="35" x2="44" y2="45" stroke="#5dade2" strokeWidth="1"/>
      <line x1="38" y1="40" x2="50" y2="40" stroke="#5dade2" strokeWidth="1"/>
      {/* porta */}
      <rect x="25" y="42" width="14" height="14" rx="2" fill="#8b5e3c" stroke="#6b3f1e" strokeWidth="1.5"/>
      <circle cx="36" cy="49" r="1.5" fill="#f1c40f"/>
    </svg>
  );

  if (gameState.house?.owned) {
    cityBuildings.push({
      id: 'house',
      name: 'Minha Casa',
      svgIcon: houseSvg,
      desc: 'Cultive Berries e Apricorns no seu jardim.',
      action: () => onOpenHouse && onOpenHouse(),
      color: 'border-amber-500 bg-amber-50',
    });
  } else if (hasHouseUnlocked) {
    cityBuildings.push({
      id: 'house_purchase',
      name: 'Comprar Casa',
      svgIcon: houseSvg,
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
      desc: 'Fale com o professor de Johto e comece uma nova jornada regional.',
      action: () => setCurrentView && setCurrentView('johto_intro'),
      color: 'border-emerald-500 bg-emerald-50',
    });
  }

  if ((gameState.worldFlags || []).includes('johto_champion') && !(gameState.worldFlags || []).includes('hoenn_started')) {
    cityBuildings.push({
      id: 'hoenn_start',
      name: 'Iniciar Hoenn',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/eon-ticket.png',
      desc: 'Fale com o Prof. Birch e comece uma nova jornada regional.',
      action: () => setCurrentView && setCurrentView('hoenn_intro'),
      color: 'border-orange-500 bg-orange-50',
    });
  }

  if ((gameState.worldFlags || []).includes('hoenn_champion') && !(gameState.worldFlags || []).includes('sinnoh_started')) {
    cityBuildings.push({
      id: 'sinnoh_start',
      name: 'Iniciar Sinnoh',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/explorer-kit.png',
      desc: 'Fale com o Prof. Rowan e escolha seu inicial de Sinnoh.',
      action: () => setCurrentView && setCurrentView('sinnoh_intro'),
      color: 'border-sky-500 bg-sky-50',
    });
  }

  if (((gameState.worldFlags || []).includes('sinnoh_champion') || (gameState.worldFlags || []).includes('region_champion_sinnoh')) && !(gameState.worldFlags || []).includes('unova_started')) {
    cityBuildings.push({
      id: 'unova_start',
      name: 'Iniciar Unova',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/liberty-pass.png',
      desc: 'Fale com a Prof. Juniper e explore a região de Unova.',
      action: () => setCurrentView && setCurrentView('unova_intro'),
      color: 'border-indigo-500 bg-indigo-50',
    });
  }

  if (((gameState.worldFlags || []).includes('unova_champion') || (gameState.worldFlags || []).includes('region_champion_unova')) && !(gameState.worldFlags || []).includes('kalos_started')) {
    cityBuildings.push({
      id: 'kalos_start',
      name: 'Conhecer Nova Região',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pal-pad.png',
      desc: 'O Prof. Sycamore te convida para descobrir Kalos e a Mega Evolução!',
      action: () => onOpenUnovaChampionModal ? onOpenUnovaChampionModal() : setCurrentView && setCurrentView('kalos_intro'),
      color: 'border-pink-500 bg-pink-50',
    });
  }

  if (((gameState.worldFlags || []).includes('kalos_champion') || (gameState.worldFlags || []).includes('region_champion_kalos')) && !(gameState.worldFlags || []).includes('alola_started')) {
    cityBuildings.push({
      id: 'alola_start',
      name: 'Iniciar Alola',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/strange-amulet.png',
      desc: 'O Prof. Kukui te convida para o Desafio da Ilha em Alola.',
      action: () => setCurrentView && setCurrentView('alola_intro'),
      color: 'border-cyan-500 bg-cyan-50',
    });
  }

  if (((gameState.worldFlags || []).includes('alola_champion') || (gameState.worldFlags || []).includes('region_champion_alola')) && !(gameState.worldFlags || []).includes('galar_started')) {
    cityBuildings.push({
      id: 'galar_start',
      name: 'Iniciar Galar',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wishing-star.png',
      desc: 'A Prof. Magnolia te convida para o Desafio das Ginásios em Galar.',
      action: () => setCurrentView && setCurrentView('galar_intro'),
      color: 'border-violet-500 bg-violet-50',
    });
  }

  if (((gameState.worldFlags || []).includes('galar_champion') || (gameState.worldFlags || []).includes('region_champion_galar')) && !(gameState.worldFlags || []).includes('hisui_started')) {
    cityBuildings.push({
      id: 'hisui_start',
      name: 'Iniciar Hisui',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/azure-flute.png',
      desc: 'Um chamado misterioso te leva para o passado na região de Hisui.',
      action: () => setCurrentView && setCurrentView('hisui_intro'),
      color: 'border-stone-500 bg-stone-50',
    });
  }

  if (((gameState.worldFlags || []).includes('hisui_champion') || (gameState.worldFlags || []).includes('region_champion_hisui')) && !(gameState.worldFlags || []).includes('paldea_started')) {
    cityBuildings.push({
      id: 'paldea_start',
      name: 'Iniciar Paldea',
      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tera-orb.png',
      desc: 'A Caça ao Tesouro começou! Explore o mundo aberto de Paldea.',
      action: () => setCurrentView && setCurrentView('paldea_intro'),
      color: 'border-lime-500 bg-lime-50',
    });
  }

  const ownedPokemonForTitles = [
    ...(gameState.team || []),
    ...(gameState.pc || []),
    ...Object.values(gameState.regional_teams || {}).flat(),
    ...Object.values(gameState.regional_pc || {}).flat(),
  ];
  const shinyCountForTitles = Math.max(
    gameState.shinyCapturedCount || 0,
    ownedPokemonForTitles.filter(p => p?.isShiny).length
  );

  return (
    <div className="h-full flex flex-col animate-fadeIn pb-24 relative overflow-y-auto custom-scrollbar">
      <div className="relative p-4 md:p-6 flex flex-col gap-4 md:gap-6">
        {/* ── Destaque da Semana ── */}
        {(() => {
          const sp = getActiveSpotlight();
          const ms = msUntilNextRotation();
          const days = Math.floor(ms / 86400000);
          const hours = Math.floor((ms % 86400000) / 3600000);
          const countdown = days > 0 ? `${days}d ${hours}h` : `${hours}h`;
          const isRoute = sp.type === 'route';
          const routeName = isRoute ? (ROUTES?.[sp.routeId]?.name || sp.name) : null;
          const goRoute = () => {
            if (!isRoute) return;
            setGameState(prev => ({ ...prev, currentRoute: sp.routeId, lastFarmingRoute: sp.routeId }));
            setCurrentView('battles');
          };
          return (
            <div className="rounded-3xl p-4 shadow-xl border-b-4 border-fuchsia-800 relative overflow-hidden"
              style={{ background: 'linear-gradient(120deg,#7c3aed 0%,#db2777 60%,#f59e0b 130%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
                  {isRoute
                    ? <span className="text-3xl">🗺️</span>
                    : <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sp.id}.png`} alt={sp.name} className="w-12 h-12 object-contain" style={{ imageRendering: 'pixelated' }} />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/80">✨ Destaque da Semana</p>
                  <h3 className="text-white font-black text-lg uppercase italic leading-none truncate">{isRoute ? routeName : sp.name}</h3>
                  <p className="text-[10px] font-bold text-white/85 mt-1">✨ Shiny ×2 · 🍬 Candy ×2 · troca em {countdown}</p>
                </div>
                {isRoute && (
                  <button onClick={goRoute}
                    className="shrink-0 bg-white text-fuchsia-700 font-black uppercase text-[10px] tracking-widest px-3 py-2 rounded-xl active:scale-95 transition-transform shadow">
                    Ir
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        <TrainerCard
          trainer={gameState.trainer}
          badges={gameState.badges || []}
          caughtCount={Object.keys(gameState.caughtData || {}).length}
          caughtData={gameState.caughtData || {}}
          worldFlags={gameState.worldFlags || []}
          powerScore={powerScore}
          forgedItems={gameState.forgedItemsCount || 0}
          bossDamage={gameState.bossTotalDamage || 0}
          shinyCount={shinyCountForTitles}
          trainerBattleWins={gameState.trainerBattleWins || 0}
          playerStats={gameState.playerStats || {}}
          prestige={gameState.prestige || {}}
          inventoryItems={gameState.inventory?.items || {}}
          compactExpandable={true}
          appearance={gameState.appearance || {}}
          selectedTitle={gameState.selectedTitle}
          onSelectTitle={onSelectTitle}
          gymDefeatCounts={gameState.gymDefeatCounts || {}}
          setIsAnyModalOpen={setIsAnyModalOpen}
          isTitleModalOpen={isTitleModalOpen}
          setIsTitleModalOpen={setIsTitleModalOpen}
          isPowerRankModalOpen={isPowerRankModalOpen}
          setIsPowerRankModalOpen={setIsPowerRankModalOpen}
        />
        
        {/* Camada de Bloqueio Físico - Desativa interações com o fundo se um modal estiver aberto */}
        <div style={{ pointerEvents: isAnyModalOpen ? 'none' : 'auto' }}>
        
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
          <div 
            className="fixed inset-0 w-screen h-screen z-[100000] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn cursor-default" 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveOakModal(false); }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
             <div
               className="modal-panel-mobile bg-white shadow-2xl animate-bounceIn flex flex-col"
               onClick={e => { e.preventDefault(); e.stopPropagation(); }}
               onPointerDown={(e) => e.stopPropagation()}
               onMouseDown={(e) => e.stopPropagation()}
               onTouchStart={(e) => e.stopPropagation()}
             >
                {/* Header Novo - Estilo Esmeralda */}
                <div className="bg-emerald-600 px-6 py-5 flex items-center justify-between shadow-xl shrink-0 z-20 border-b border-white/10 rounded-t-[24px] overflow-hidden">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner overflow-hidden">
                         <img src="https://play.pokemonshowdown.com/sprites/trainers/oak.png" className="w-10 h-10 object-contain drop-shadow-md" alt="Oak" />
                      </div>
                      <div className="text-left">
                         <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Prof. Carvalho</p>
                         <h3 className="text-white text-xl font-black uppercase italic leading-none tracking-tighter">Laboratório</h3>
                      </div>
                   </div>
                   <button onClick={() => setActiveOakModal(false)} className="w-11 h-11 rounded-full bg-white/10 text-white font-black flex items-center justify-center hover:bg-white/20 transition-colors shrink-0" aria-label="Fechar">x</button>
                </div>

                <div className="modal-scroll-content p-6 flex flex-col gap-6">
                   <div className="bg-emerald-50 px-6 py-5 rounded-3xl border-2 border-emerald-100 italic text-slate-700 font-bold text-sm relative break-words">
                      <div className="absolute -top-3 -left-2 text-4xl text-emerald-200 opacity-50">"</div>
                      <p className="break-words">{oakTips[oakTipIndex]}</p>
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
                              <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic line-clamp-3 break-words">"{poke.desc}"</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="px-6 pt-2 pb-6 border-t border-slate-100 shrink-0 bg-slate-50 rounded-b-[24px]">
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
              onClick={() => {
                if (isAnyModalOpen) return;
                b.action();
              }}
              disabled={b.disabled}
              className={`p-6 rounded-[2.5rem] border-4 ${b.color} shadow-xl transition-all flex items-center gap-6 text-left group relative overflow-hidden ${
                b.disabled ? 'opacity-70 cursor-not-allowed grayscale' : 'hover:-translate-y-1 active:scale-95'
              }`}
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-inner border-2 border-white group-hover:rotate-6 transition-transform overflow-hidden">
                {b.svgIcon ? b.svgIcon : (
                  <img
                    src={b.icon || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'}
                    className="w-10 h-10 object-contain"
                    alt={b.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                    }}
                  />
                )}
              </div>
              <div className="flex-1">
                 <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">{b.name}</h3>
                 <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">{b.desc}</p>
              </div>
              {/* Badge de notificação (ex: solicitações de amizade) */}
              {b.badge > 0 && (
                <span className="shrink-0 bg-red-500 text-white text-xs font-black min-w-[26px] h-7 px-2 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {b.badge > 99 ? '99+' : b.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {gameState.lastFarmingRoute && (
          <button 
            onClick={() => onBackToBattle && onBackToBattle()}
            className="w-full mt-4 bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg border-b-8 border-slate-900 flex items-center justify-center gap-3 active:scale-95"
          >
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png"
              className="h-6 w-6 object-contain"
              alt=""
            />
            Voltar para Treino
          </button>
        )}
        </div>
      </div>

    </div>
  );
};

export default CityScreen;

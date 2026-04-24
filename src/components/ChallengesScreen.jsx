import React, { useState } from 'react';

const CHALLENGES = [
  // ── RIVAIS ──────────────────────────────────────────────────────────
  {
    id: 'rival_route1',
    category: 'rival',
    name: 'Azul — Rota 1',
    subtitle: 'Primeira Rivalidade',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    quote: '"Acho que vou usar este aqui! Prepare-se!"',
    reward: 500,
    unlockFlag: 'rival_1_defeated',
    requiresFlag: null,
    team: [{ id: 133, level: 5 }], // Eevee
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  },
  {
    id: 'rival_ss_anne',
    category: 'rival',
    name: 'Azul — S.S. Anne',
    subtitle: 'Encontro no Navio',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    quote: '"Bon voyage! Mas antes, uma lição de batalha!"',
    reward: 2000,
    unlockFlag: 'rival_3_defeated',
    requiresFlag: 'rival_2_defeated',
    team: [
      { id: 17, level: 19 }, // Pidgeotto
      { id: 20, level: 16 }, // Raticate
      { id: 64, level: 18 }, // Kadabra
      { id: 133, level: 20 }, // Eevee
    ],
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
  },
  {
    id: 'rival_silph_co',
    category: 'rival',
    name: 'Azul — Silph Co.',
    subtitle: 'Rivalidade Ápice',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    quote: '"Eu sou o treinador mais forte do mundo! Observe!"',
    reward: 5000,
    unlockFlag: 'rival_silph_defeated',
    requiresFlag: 'rocket_hideout_cleared',
    team: [
      { id: 18, level: 37 }, // Pidgeot
      { id: 59, level: 35 }, // Arcanine
      { id: 103, level: 35 }, // Exeggutor
      { id: 130, level: 35 }, // Gyarados
      { id: 65, level: 37 }, // Alakazam
      { id: 135, level: 40 }, // Jolteon
    ],
    bg: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
  },

  // ── EQUIPE ROCKET ───────────────────────────────────────────────────
  {
    id: 'rocket_grunt_forest',
    category: 'rocket',
    name: 'Recruta Rocket',
    subtitle: 'Problemas na Floresta',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgrunt.png',
    quote: '"Esta floresta agora pertence à Equipe Rocket! Caia fora!"',
    reward: 800,
    unlockFlag: 'viridian_forest_cleared',
    requiresFlag: 'rival_1_defeated',
    team: [
      { id: 19, level: 8 }, // Rattata
      { id: 23, level: 8 }, // Ekans
    ],
    bg: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
  },
  {
    id: 'mt_moon_rocket_1',
    category: 'rocket',
    name: 'Recruta Rocket — Mt. Moon I',
    subtitle: 'Bloqueio na Caverna',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgrunt.png',
    quote: '"Você não vai passar daqui! A Equipe Rocket está ocupada!"',
    reward: 1200,
    unlockFlag: 'mt_moon_rocket_1_defeated',
    requiresFlag: 'mt_moon_cleared',
    team: [
      { id: 41, level: 12 }, // Zubat
      { id: 19, level: 13 }, // Rattata
    ],
    bg: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  },
  {
    id: 'mt_moon_rocket_2',
    category: 'rocket',
    name: 'Recruta Rocket — Mt. Moon II',
    subtitle: 'Reforços Rocket',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgruntf.png',
    quote: '"Mais um intrometido? Vamos te dar uma lição!"',
    reward: 1500,
    unlockFlag: 'mt_moon_rocket_2_defeated',
    requiresFlag: 'mt_moon_rocket_1_defeated',
    team: [
      { id: 23, level: 14 }, // Ekans
      { id: 41, level: 14 }, // Zubat
    ],
    bg: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
  },
  {
    id: 'mt_moon_trio',
    category: 'rocket',
    name: 'Trio Rocket — Mt. Moon',
    subtitle: 'Jessie, James & Meowth',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"Prepare-se para a encrenca! Encrenca em dobro!"',
    reward: 3000,
    unlockFlag: 'mt_moon_rockets_defeated',
    requiresFlag: 'mt_moon_rocket_2_defeated',
    team: [
      { id: 109, level: 16 }, // Koffing
      { id: 23,  level: 16 }, // Ekans
      { id: 52,  level: 18 }, // Meowth
    ],
    bg: 'linear-gradient(135deg, #991b1b 0%, #450a0a 100%)',
  },
  {
    id: 'giovanni_hideout',
    category: 'rocket',
    name: 'Chefe Giovanni',
    subtitle: 'Líder da Equipe Rocket',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/giovanni.png',
    quote: '"Você ousou invadir meu esconderijo? Conheça o verdadeiro poder!"',
    reward: 8000,
    unlockFlag: 'rocket_hideout_cleared',
    requiresFlag: 'rock_tunnel_cleared',
    team: [
      { id: 111, level: 25 }, // Rhyhorn
      { id: 115, level: 24 }, // Kangaskhan
      { id: 112, level: 29 }, // Rhydon
    ],
    bg: 'linear-gradient(135deg, #000000 0%, #4b5563 100%)',
  },

  // ── LENDÁRIOS ───────────────────────────────────────────────────────
  {
    id: 'articuno',
    category: 'legendary',
    name: 'Articuno',
    subtitle: 'O Pássaro de Gelo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png',
    quote: '"Um frio intenso emana desta criatura majestosa..."',
    reward: 15000,
    unlockFlag: 'articuno_defeated',
    requiresFlag: 'soul_badge',
    team: [{ id: 144, level: 50 }],
    bg: 'linear-gradient(165deg, #00d2ff 0%, #3a7bd5 100%)',
  },
  {
    id: 'zapdos',
    category: 'legendary',
    name: 'Zapdos',
    subtitle: 'O Pássaro do Trovão',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png',
    quote: '"Relâmpagos estalam ao redor de suas asas pontiagudas!"',
    reward: 15000,
    unlockFlag: 'zapdos_defeated',
    requiresFlag: 'soul_badge',
    team: [{ id: 145, level: 50 }],
    bg: 'linear-gradient(165deg, #ffe259 0%, #ffa751 100%)',
  },
  {
    id: 'moltres',
    category: 'legendary',
    name: 'Moltres',
    subtitle: 'O Pássaro de Fogo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png',
    quote: '"As chamas que compõem suas asas brilham intensamente!"',
    reward: 15000,
    unlockFlag: 'moltres_defeated',
    requiresFlag: 'soul_badge',
    team: [{ id: 146, level: 50 }],
    bg: 'linear-gradient(165deg, #f12711 0%, #f5af19 50%, #20002c 100%)',
  },
  {
    id: 'mewtwo',
    category: 'legendary',
    name: 'Mewtwo',
    subtitle: 'Lenda de Kanto',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    quote: '"Eu fui criado para ser o mais forte. Prove que você é digno!"',
    reward: 100000,
    unlockFlag: 'mewtwo_defeated',
    requiresFlag: 'champion',
    team: [
      { id: 150, level: 70 },
    ],
    bg: 'linear-gradient(165deg, #2d0070 0%, #1a0050 50%, #060010 100%)',
  },
];

const CATEGORY_CONFIG = {
  rival:     { label: 'Rival',         color: '#1a56db', emoji: '⚔️'  },
  rocket:    { label: 'Equipe Rocket', color: '#cc0000', emoji: '🚀'  },
  legendary: { label: 'Lendários',     color: '#7c3aed', emoji: '✨'  },
};

const ChallengesScreen = ({ 
  gameState, onChallenge, onClose, isEmbedded = false, 
  filterCategories = null, setCurrentView, setVsInitialTab,
  initialCategory, setVsInitialCategory 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || (filterCategories ? filterCategories[0] : 'rival'));

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const flagNames = {
    'has_starter': 'Ter um Pokémon inicial',
    'rival_1_defeated': 'Vencer o Rival na Rota 1',
    'viridian_forest_cleared': 'Vencer o Recruta Rocket na Floresta',
    'mt_moon_cleared': 'Atravessar o Mt. Moon',
    'rock_tunnel_cleared': 'Atravessar o Rock Tunnel',
    'rocket_hideout_cleared': 'Destruir o QG da Equipe Rocket',
    'soul_badge': 'Insígnia da Alma (Koga)',
    'champion': 'Tornar-se o Campeão',
    'earth_badge': 'Insígnia da Terra (Giovanni)'
  };

  const handleRequirementClick = (flag) => {
    if (!flag) return;
    if (flag.includes('_badge')) {
      // Já está em VS, mas forçamos o redirecionamento correto se necessário
      if (setVsInitialTab) setVsInitialTab('gyms');
      setCurrentView('vs');
    } else if (flag.includes('_cleared') || flag === 'has_starter') {
      setCurrentView('routes');
    }
  };

  React.useEffect(() => {
    if (filterCategories && !filterCategories.includes(selectedCategory)) {
      setSelectedCategory(filterCategories[0]);
    }
  }, [filterCategories]);

  const isUnlocked = (challenge) => {
    if (!challenge.requiresFlag) return true;
    return (gameState.worldFlags || []).includes(challenge.requiresFlag);
  };

  const isDefeated = (challenge) => {
    return (gameState.worldFlags || []).includes(challenge.unlockFlag);
  };

  const filtered = CHALLENGES.filter(c => c.category === selectedCategory);

  return (
    <div className={isEmbedded ? "h-full flex flex-col bg-slate-950" : "absolute inset-0 z-[110] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"} onClick={!isEmbedded ? onClose : undefined}>
      <div 
        className={isEmbedded ? "flex-1 flex flex-col overflow-hidden" : "w-full max-w-md bg-slate-950 rounded-t-[2rem] shadow-2xl flex flex-col animate-slideUp overflow-hidden"}
        style={!isEmbedded ? { height: '90dvh' } : {}}
        onClick={e => e.stopPropagation()}
      >

        {!isEmbedded && (
          <div className="flex items-center gap-4 p-4 border-b border-white/10">
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl transition-all active:scale-95">
              ←
            </button>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Desafios</h2>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Encontre oponentes poderosos</p>
            </div>
          </div>
        )}

        {(!isEmbedded || (filterCategories && filterCategories.length > 1)) && (
          <div className="flex p-3 gap-2 bg-slate-900 border-b border-white/5 justify-center">
            <div className="flex w-full max-w-sm gap-2">
              {Object.entries(CATEGORY_CONFIG)
                .filter(([id]) => !filterCategories || filterCategories.includes(id))
                .map(([id, cfg]) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`flex-1 py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-2 border ${
                    selectedCategory === id 
                    ? 'bg-white text-slate-950 border-white font-black' 
                    : 'bg-white/5 text-white/40 border-white/5 font-bold hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">{cfg.emoji}</span>
                  <span className="text-[9px] uppercase tracking-tighter">{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3">
          {filtered.map((challenge) => {
            const unlocked = isUnlocked(challenge);
            const defeated = isDefeated(challenge);
            return (
              <div
                key={challenge.id}
                onClick={() => unlocked && !defeated && setSelectedChallenge(challenge)}
                className={`relative rounded-[2rem] overflow-hidden shadow-xl transition-all ${
                  unlocked && !defeated ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : 'grayscale cursor-not-allowed opacity-60'
                }`}
                style={{ background: challenge.bg, minHeight: '100px' }}
              >
                <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                {defeated && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/10 border border-white/20 px-6 py-2 rounded-full rotate-[-5deg] shadow-2xl backdrop-blur-md">
                      <span className="text-white font-black italic uppercase tracking-widest text-sm flex items-center gap-2">
                         <span className="text-yellow-400">✓</span> CONCLUÍDO
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex items-center gap-4 p-4">
                  <img src={challenge.sprite} alt={challenge.name} className="w-16 h-16 object-contain drop-shadow-xl" onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }} />
                  <div className="flex-1">
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-widest">{challenge.subtitle}</p>
                    <h3 className="text-white font-black text-base uppercase italic leading-tight">{challenge.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-yellow-400 uppercase">💰 {challenge.reward.toLocaleString()} coins</span>
                      <span className="text-white/30">•</span>
                      <span className="text-[9px] font-black text-white/50 uppercase">{challenge.team.length} Pokémon</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {defeated && <span className="bg-yellow-400 text-yellow-950 text-[9px] font-black px-2 py-1 rounded-full">✓ Vencido</span>}
                    {!unlocked && (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-white/40 text-xl">🔒</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRequirementClick(challenge.requiresFlag); }}
                          className="text-[7px] font-black text-red-400 uppercase bg-black/40 px-2 py-1 rounded-lg border border-red-900/50 hover:bg-black/60 transition-all"
                        >
                          REQ: {flagNames[challenge.requiresFlag] || challenge.requiresFlag}
                        </button>
                      </div>
                    )}
                    {unlocked && !defeated && <span className="text-white/60 text-xl">▶</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedChallenge && (
        <div className="absolute inset-0 z-[120] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedChallenge(null)}>
          <div className="w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl animate-bounceIn border-2 border-white/10" style={{ background: selectedChallenge.bg }} onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <img src={selectedChallenge.sprite} alt={selectedChallenge.name} className="w-24 h-24 object-contain drop-shadow-2xl" onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }} />
                <div>
                  <p className="text-white/50 text-[9px] font-black uppercase tracking-widest">{selectedChallenge.subtitle}</p>
                  <h3 className="text-white font-black text-lg uppercase italic leading-tight">{selectedChallenge.name}</h3>
                </div>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/10">
                <p className="text-white/80 text-xs font-bold italic">{selectedChallenge.quote}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {selectedChallenge.team.map((p, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-2 border border-white/5 flex flex-col items-center">
                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} className="w-12 h-12 object-contain" alt="pokemon" />
                    <span className="text-white/40 text-[8px] font-black uppercase mt-1">NV. {p.level}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelectedChallenge(null)} className="flex-1 bg-white/10 text-white py-4 rounded-2xl font-black uppercase text-sm hover:bg-white/20">Cancelar</button>
                <button onClick={() => { onChallenge(selectedChallenge); setSelectedChallenge(null); }} className="flex-2 flex-grow bg-white text-slate-900 py-4 rounded-2xl font-black uppercase text-sm hover:bg-slate-100 shadow-xl active:scale-95">⚔️ Desafiar!</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesScreen;

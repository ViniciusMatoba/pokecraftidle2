import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { GYMS, ELITE_FOUR } from '../data/gyms';

const _BASE = import.meta.env.BASE_URL.replace(/\/$/, '') || '';
const fixBgPath = (bg) => bg ? bg.replace(/url\(['"]?(\/[^'"]+)['"]?\)/g, (_, p) => `url('${_BASE}${p}')`) : bg;

// Importação dinâmica para evitar circularidade se possível, ou apenas usar os dados locais
const BOSS_TYPES = ['Gym Leader', 'Elite Four', 'Team Villain', 'Legendary'];
const BOSS_ROTATION_MS = 24 * 60 * 60 * 1000;
const BOSS_ROTATION_STORAGE_KEY = 'pokecraftidle_next_world_boss_at_v2';
const BOSS_DATA_STORAGE_KEY = 'pokecraftidle_current_world_boss_v2';
const BOSS_FIGHT_LIMIT_SECONDS = 120;

const formatCountdown = (ms) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const BossScreen = ({ gameState, powerScore = 0, onChallengeBoss }) => {
  const [boss, setBoss] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myBestDamage, setMyBestDamage] = useState(0);
  const [myLastDamage, setMyLastDamage] = useState(0);
  const [myBestScore, setMyBestScore] = useState(0);
  const [myLastScore, setMyLastScore] = useState(0);
  const [myRank, setMyRank] = useState(null);
  const [nextBossAt, setNextBossAt] = useState(() => {
    const saved = Number(localStorage.getItem(BOSS_ROTATION_STORAGE_KEY));
    const now = Date.now();
    if (Number.isFinite(saved) && saved > now) return saved;
    const initial = now + BOSS_ROTATION_MS;
    localStorage.setItem(BOSS_ROTATION_STORAGE_KEY, String(initial));
    return initial;
  });
  const [now, setNow] = useState(Date.now());

  // Carregar Boss atual ou gerar um se não existir no estado local (ou persistir no firestore)
  // Para simplificar, vamos gerar um boss aleatório que reseta ao recarregar, 
  // mas o ranking de dano é persistente no Firestore.
  
  const generateDynamicBoss = () => {
    const type = BOSS_TYPES[Math.floor(Math.random() * BOSS_TYPES.length)];
    let source;
    
    if (type === 'Gym Leader') {
      source = GYMS[Math.floor(Math.random() * GYMS.length)];
    } else if (type === 'Elite Four') {
      source = ELITE_FOUR[Math.floor(Math.random() * ELITE_FOUR.length)];
    } else {
      // Simulação de vilão ou lendário usando IDs conhecidos
      const randomId = [150, 144, 145, 146, 243, 244, 245, 249, 250][Math.floor(Math.random() * 9)];
      source = {
        id: 'boss_' + randomId,
        name: type === 'Legendary' ? 'Guardião Lendário' : 'Líder Vilão',
        sprite: type === 'Legendary' 
          ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomId}.png`
          : 'https://play.pokemonshowdown.com/sprites/trainers/giovanni.png',
        team: [{ id: randomId, level: 100 }],
        quote: type === 'Legendary' ? '"O rugido da natureza ecoa..."' : '"Você não imagina o poder que enfrentará!"',
        background: "url('/battle_bg_gym_1776863824590.webp') center/cover no-repeat"
      };
    }

    const getBossBg = (bType) => {
      switch (bType) {
        case 'Gym Leader':
        case 'Elite Four':
          return "url('/battle_bg_gym_1776863824590.webp') center/cover no-repeat";
        case 'Team Villain':
          return "url('/battle_bg_lab_1776866008842.webp') center/cover no-repeat";
        case 'Legendary':
          return "url('/battle_bg_cave_1776863810604.webp') center/cover no-repeat";
        default:
          return "url('/battle_bg_grass_1776863779024.webp') center/cover no-repeat";
      }
    };

    // Criar o objeto Boss escalonado
    const bossData = {
      ...source,
      isBoss: true,
      bossType: type,
      displayLevel: '???',
      hpMultiplier: 100,
      statMultiplier: 1.5,
      background: getBossBg(type),
      // Se for um time, pegamos o último (geralmente o mais forte) ou o único
      mainPokemon: source.team[source.team.length - 1]
    };

    setBoss(bossData);
    localStorage.setItem(BOSS_DATA_STORAGE_KEY, JSON.stringify(bossData));
    return bossData;
  };

  const rotateBoss = () => {
    generateDynamicBoss();
    const nextAt = Date.now() + BOSS_ROTATION_MS;
    localStorage.setItem(BOSS_ROTATION_STORAGE_KEY, String(nextAt));
    setNextBossAt(nextAt);
  };

  useEffect(() => {
    const savedBoss = localStorage.getItem(BOSS_DATA_STORAGE_KEY);
    if (savedBoss && nextBossAt > Date.now()) {
      try {
        setBoss(JSON.parse(savedBoss));
      } catch {
        generateDynamicBoss();
      }
    } else {
      rotateBoss();
    }
    
    // Listen to Global Boss Ranking
    const q = query(collection(db, "bossRankings"), orderBy("totalDamage", "desc"), limit(25));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setRanking(data);
      const currentUid = auth.currentUser?.uid;
      const currentIndex = currentUid ? data.findIndex(row => row.id === currentUid) : -1;
      setMyRank(currentIndex >= 0 ? currentIndex + 1 : null);
      setLoading(false);
    });

    // Fetch My Best Damage
    const fetchMyDamage = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "bossRankings", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMyBestDamage(data.totalDamage || data.bestDamage || 0);
          setMyLastDamage(data.lastDamage || 0);
          setMyBestScore(data.bestScore || 0);
          setMyLastScore(data.lastScore || 0);
        }
      }
    };
    fetchMyDamage();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= nextBossAt) {
        rotateBoss();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextBossAt]);

  const handleChallenge = () => {
    if (!boss) return;
    onChallengeBoss(boss);
  };

  const topDamageRanking = ranking.slice(0, 10);
  const displayedBestDamage = Math.max(myBestDamage || 0, gameState.bossTotalDamage || 0);
  const displayedLastDamage = Math.max(myLastDamage || 0, gameState.bossLastDamage || 0);
  const displayedBestScore = Math.max(myBestScore || 0, Math.floor(displayedBestDamage + Math.max(0, powerScore || 0) * 0.18));
  const displayedLastScore = Math.max(myLastScore || 0, Math.floor(displayedLastDamage + Math.max(0, powerScore || 0) * 0.18));
  const bossPowerBonus = Math.round(Math.min(250, Math.max(0, powerScore || 0) / 2000));

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white p-4 animate-fadeIn overflow-y-auto custom-scrollbar">
      {/* Boss Card */}
      {boss && (
        <div className="relative w-full aspect-video rounded-[2rem] border-4 border-amber-600 overflow-hidden shadow-[0_0_30px_rgba(217,119,6,0.3)] shrink-0 mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
          <div 
            className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-1000"
            style={{ background: fixBgPath(boss.background) }}
          ></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 animate-pulse">
                Desafio World Boss Ativo
              </span>
              <h3 className="text-3xl font-black uppercase italic leading-none">{boss.name}</h3>
              <p className="text-xs text-white/60 font-bold italic mt-1">{boss.quote}</p>
            </div>
            <div className="text-right">
              <div className="mb-3 inline-flex flex-col items-end rounded-2xl border border-amber-500/40 bg-black/50 px-4 py-2 backdrop-blur-md">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-300/70">Proximo Boss em</span>
                <span className="text-2xl font-black tabular-nums text-amber-400 leading-none">
                  {formatCountdown(nextBossAt - now)}
                </span>
              </div>
              <br />
              <span className="text-4xl font-black text-amber-500 italic drop-shadow-lg">LV {boss.displayLevel}</span>
            </div>
          </div>

          <img 
            src={boss.sprite} 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 object-contain z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
            alt="Boss"
          />
        </div>
      )}

      {/* Stats & Actions */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#1a1a1a] p-4 rounded-3xl border-2 border-white/5 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Seu Maior Dano no Evento</p>
          <p className="text-xl font-black text-blue-400 leading-none">{displayedBestDamage.toLocaleString()}</p>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-2">Ultimo dano: {displayedLastDamage.toLocaleString()}</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-3xl border-2 border-emerald-500/20 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Bonus de Poder</p>
          <p className="text-xl font-black text-emerald-400 leading-none">+{bossPowerBonus}%</p>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-2">Insignias, atributos e shinies</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-3xl border-2 border-blue-500/20 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Sua Posicao</p>
          <p className="text-xl font-black text-amber-400 leading-none">{myRank ? `#${myRank}` : 'Top 25+'}</p>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-2">Ranking global ao vivo</p>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-3xl border-2 border-purple-500/20 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Pontuacao</p>
          <p className="text-xl font-black text-purple-300 leading-none">{displayedBestScore.toLocaleString()}</p>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-2">Ultima: {displayedLastScore.toLocaleString()}</p>
        </div>
        <button 
          onClick={handleChallenge}
          className="col-span-2 bg-gradient-to-br from-red-600 to-amber-600 p-4 rounded-3xl border-b-4 border-amber-900 font-black uppercase italic tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-red-900/20"
        >
          <span className="block">DESAFIAR BOSS</span>
          <span className="block mt-1 text-[9px] not-italic tracking-widest text-white/70">
            Limite {Math.floor(BOSS_FIGHT_LIMIT_SECONDS / 60)}:00
          </span>
        </button>
      </div>

      {/* Passive Gear Indicators */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'titan_shield', icon: '🏰', label: 'Defesa+', active: gameState.team[0]?.holdItem === 'titan_shield' || gameState.team[0]?.item === 'titan_shield' },
          { id: 'adrenaline_potion', icon: '💉', label: 'Ataque+', active: gameState.team[0]?.holdItem === 'adrenaline_potion' || gameState.team[0]?.item === 'adrenaline_potion' },
          { id: 'penetration_pendant', icon: '📿', label: 'Penetração', active: gameState.team[0]?.holdItem === 'penetration_pendant' || gameState.team[0]?.item === 'penetration_pendant' }
        ].map(gear => (
          <div key={gear.id} className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all shrink-0 ${gear.active ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-white/5 border-white/5 text-white/20'}`}>
            <span className="text-sm">{gear.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">{gear.label}</span>
            {gear.active && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>}
          </div>
        ))}
      </div>

      {/* Mini Ranking */}
      <div className="bg-[#141414] rounded-[2rem] border-2 border-white/5 p-6 flex flex-col gap-4 shadow-inner">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h4 className="font-black uppercase italic text-amber-500 tracking-tighter">Ranking Global do Boss</h4>
          <span className="text-[8px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full font-bold uppercase">Ao Vivo</span>
        </div>

        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {topDamageRanking.map((row, index) => (
              <div key={row.id} className={`flex items-center justify-between gap-3 p-3 rounded-2xl border ${auth.currentUser?.uid === row.id ? 'bg-blue-500/10 border-blue-400/40' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-lg font-black text-xs ${index === 0 ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/40'}`}>
                    {index + 1}
                  </span>
                  <div>
                    <span className="block font-bold text-sm uppercase italic">{row.name || 'Treinador'}</span>
                    <span className="block text-[8px] font-black uppercase tracking-widest text-white/25">
                      Tentativas: {row.attempts || 1}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-right">
                  <div>
                    <p className="text-[8px] font-black uppercase text-white/30">Dano</p>
                    <p className="font-black text-emerald-400 text-sm">{(row.totalDamage || row.bestDamage || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-white/30">Score</p>
                    <p className="font-black text-purple-300 text-sm">{(row.bestScore || row.totalDamage || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
            {topDamageRanking.length === 0 && (
              <p className="text-center text-white/20 text-xs italic py-4">Nenhum registro ainda...</p>
            )}
          </div>
        )}
      </div>

      {/* Dev Tools */}
      <div className="mt-auto pt-8 flex justify-center opacity-30 hover:opacity-100 transition-opacity">
        <button 
          onClick={rotateBoss}
          className="text-[10px] font-black text-white/40 hover:text-red-500 border border-white/10 px-4 py-2 rounded-full uppercase tracking-widest transition-all"
        >
          [DEV] Reset Boss Randomizer
        </button>
      </div>
    </div>
  );
};

export default BossScreen;

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { GYMS, ELITE_FOUR } from '../data/gyms';

// Importação dinâmica para evitar circularidade se possível, ou apenas usar os dados locais
const BOSS_TYPES = ['Gym Leader', 'Elite Four', 'Team Villain', 'Legendary'];

const BossScreen = ({ gameState, onChallengeBoss }) => {
  const [boss, setBoss] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myBestDamage, setMyBestDamage] = useState(0);

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
        background: "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat"
      };
    }

    const getBossBg = (bType) => {
      switch (bType) {
        case 'Gym Leader':
        case 'Elite Four':
          return "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat";
        case 'Team Villain':
          return "url('/battle_bg_lab_1776866008842.png') center/cover no-repeat";
        case 'Legendary':
          return "url('/battle_bg_cave_1776863810604.png') center/cover no-repeat";
        default:
          return "url('/battle_bg_grass_1776863779024.png') center/cover no-repeat";
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
  };

  useEffect(() => {
    generateDynamicBoss();
    
    // Listen to Global Boss Ranking (Top 5)
    const q = query(collection(db, "bossRankings"), orderBy("totalDamage", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setRanking(data);
      setLoading(false);
    });

    // Fetch My Best Damage
    const fetchMyDamage = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "bossRankings", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMyBestDamage(docSnap.data().totalDamage || 0);
        }
      }
    };
    fetchMyDamage();

    return () => unsubscribe();
  }, []);

  const handleChallenge = () => {
    if (!boss) return;
    onChallengeBoss(boss);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white p-4 animate-fadeIn overflow-y-auto custom-scrollbar">
      {/* Boss Card */}
      {boss && (
        <div className="relative w-full aspect-video rounded-[2rem] border-4 border-amber-600 overflow-hidden shadow-[0_0_30px_rgba(217,119,6,0.3)] shrink-0 mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
          <div 
            className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-1000"
            style={{ background: boss.background }}
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
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Seu Melhor Dano</p>
          <p className="text-xl font-black text-blue-400 leading-none">{myBestDamage.toLocaleString()}</p>
        </div>
        <button 
          onClick={handleChallenge}
          className="bg-gradient-to-br from-red-600 to-amber-600 p-4 rounded-3xl border-b-4 border-amber-900 font-black uppercase italic tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-red-900/20"
        >
          DESAFIAR BOSS
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
          <h4 className="font-black uppercase italic text-amber-500 tracking-tighter">Maiores Danos do Evento</h4>
          <span className="text-[8px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full font-bold uppercase">Ao Vivo</span>
        </div>

        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {ranking.map((row, index) => (
              <div key={row.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-lg font-black text-xs ${index === 0 ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/40'}`}>
                    {index + 1}
                  </span>
                  <span className="font-bold text-sm uppercase italic">{row.name || 'Treinador'}</span>
                </div>
                <span className="font-black text-emerald-400 text-sm">{row.totalDamage?.toLocaleString()}</span>
              </div>
            ))}
            {ranking.length === 0 && (
              <p className="text-center text-white/20 text-xs italic py-4">Nenhum registro ainda...</p>
            )}
          </div>
        )}
      </div>

      {/* Dev Tools */}
      <div className="mt-auto pt-8 flex justify-center opacity-30 hover:opacity-100 transition-opacity">
        <button 
          onClick={generateDynamicBoss}
          className="text-[10px] font-black text-white/40 hover:text-red-500 border border-white/10 px-4 py-2 rounded-full uppercase tracking-widest transition-all"
        >
          [DEV] Reset Boss Randomizer
        </button>
      </div>
    </div>
  );
};

export default BossScreen;

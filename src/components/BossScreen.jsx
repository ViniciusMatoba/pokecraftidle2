import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { GYMS, ELITE_FOUR } from '../data/gyms';

const BOSS_EVENT_DURATION_MS = 24 * 60 * 60 * 1000;

const BOSS_POOL = [
  { type: 'Gym Leader', source: () => GYMS[0] },
  { type: 'Gym Leader', source: () => GYMS[2] },
  { type: 'Gym Leader', source: () => GYMS[5] },
  { type: 'Gym Leader', source: () => GYMS[7] },
  { type: 'Elite Four', source: () => ELITE_FOUR[0] },
  { type: 'Elite Four', source: () => ELITE_FOUR[2] },
  { type: 'Elite Four', source: () => ELITE_FOUR[3] },
  { type: 'Legendary', id: 144, name: 'Guardiao Lendario Articuno' },
  { type: 'Legendary', id: 145, name: 'Guardiao Lendario Zapdos' },
  { type: 'Legendary', id: 146, name: 'Guardiao Lendario Moltres' },
  { type: 'Legendary', id: 150, name: 'Guardiao Lendario Mewtwo' },
  { type: 'Legendary', id: 249, name: 'Guardiao Lendario Lugia' },
  { type: 'Legendary', id: 250, name: 'Guardiao Lendario Ho-Oh' },
  { type: 'Team Villain', id: 248, name: 'Lider Vilao Sombrio' },
  { type: 'Team Villain', id: 376, name: 'Comandante Vilao Metalico' },
  { type: 'Team Villain', id: 384, name: 'Chefe Vilao do Ceu' },
];

const getBossBg = (type) => {
  switch (type) {
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

const seededIndex = (seed, max) => {
  let value = 0;
  for (let i = 0; i < seed.length; i += 1) {
    value = ((value << 5) - value + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(value) % max;
};

const getActiveWorldBoss = (now = Date.now()) => {
  const bucket = Math.floor(now / BOSS_EVENT_DURATION_MS);
  const startedAt = bucket * BOSS_EVENT_DURATION_MS;
  const activeUntil = startedAt + BOSS_EVENT_DURATION_MS;
  const picked = BOSS_POOL[seededIndex(`pokecraft-world-boss-${bucket}`, BOSS_POOL.length)];
  const source = picked.source ? picked.source() : {
    id: `boss_${picked.id}`,
    name: picked.name,
    sprite: picked.type === 'Team Villain'
      ? 'https://play.pokemonshowdown.com/sprites/trainers/giovanni.png'
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${picked.id}.png`,
    team: [{ id: picked.id, level: 100 }],
    quote: picked.type === 'Legendary'
      ? '"O rugido da natureza ecoa..."'
      : '"Voce nao imagina o poder que enfrentara!"',
  };

  return {
    ...source,
    eventId: `wb-${bucket}`,
    startedAt,
    activeUntil,
    isBoss: true,
    bossType: picked.type,
    displayLevel: '???',
    hpMultiplier: 100,
    statMultiplier: 1.5,
    background: getBossBg(picked.type),
    mainPokemon: source.team[source.team.length - 1],
  };
};

const formatRemaining = (ms) => {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const BossScreen = ({ gameState, onChallengeBoss }) => {
  const [boss, setBoss] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myBestDamage, setMyBestDamage] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    const syncBoss = () => {
      const active = getActiveWorldBoss();
      setBoss(active);
      setRemainingMs(active.activeUntil - Date.now());
    };
    syncBoss();
    const timer = setInterval(syncBoss, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!boss?.eventId) return undefined;

    setLoading(true);
    const rankQuery = query(
      collection(db, 'worldBossEvents', boss.eventId, 'rankings'),
      orderBy('maxDamage', 'desc'),
      limit(5)
    );
    const unsubscribe = onSnapshot(rankQuery, (snapshot) => {
      const data = [];
      snapshot.forEach(row => data.push({ id: row.id, ...row.data() }));
      setRanking(data);
      setLoading(false);
    }, () => {
      setRanking([]);
      setLoading(false);
    });

    const fetchMyDamage = async () => {
      if (!auth.currentUser) {
        setMyBestDamage(0);
        return;
      }
      const docRef = doc(db, 'worldBossEvents', boss.eventId, 'rankings', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      setMyBestDamage(docSnap.exists() ? (docSnap.data().maxDamage || 0) : 0);
    };
    fetchMyDamage();

    return () => unsubscribe();
  }, [boss?.eventId]);

  const handleChallenge = () => {
    if (!boss) return;
    onChallengeBoss(boss);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white p-4 animate-fadeIn overflow-y-auto custom-scrollbar">
      {boss && (
        <div className="relative w-full aspect-video rounded-[2rem] border-4 border-amber-600 overflow-hidden shadow-[0_0_30px_rgba(217,119,6,0.3)] shrink-0 mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <div
            className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-1000"
            style={{ background: boss.background }}
          />

          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 animate-pulse">
                Desafio World Boss Ativo
              </span>
              <h3 className="text-3xl font-black uppercase italic leading-none">{boss.name}</h3>
              <p className="text-xs text-white/60 font-bold italic mt-1">{boss.quote}</p>
              <p className="text-[10px] text-amber-300 font-black uppercase tracking-widest mt-2">
                Ciclo 24h: {formatRemaining(remainingMs)}
              </p>
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#1a1a1a] p-4 rounded-3xl border-2 border-white/5 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Seu Maior Dano no Evento</p>
          <p className="text-xl font-black text-blue-400 leading-none">{myBestDamage.toLocaleString()}</p>
        </div>
        <button
          onClick={handleChallenge}
          className="bg-gradient-to-br from-red-600 to-amber-600 p-4 rounded-3xl border-b-4 border-amber-900 font-black uppercase italic tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-red-900/20"
        >
          DESAFIAR BOSS
        </button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'titan_shield', icon: 'DEF', label: 'Defesa+', active: gameState.team[0]?.holdItem === 'titan_shield' || gameState.team[0]?.item === 'titan_shield' },
          { id: 'adrenaline_potion', icon: 'ATK', label: 'Ataque+', active: gameState.team[0]?.holdItem === 'adrenaline_potion' || gameState.team[0]?.item === 'adrenaline_potion' },
          { id: 'penetration_pendant', icon: 'PEN', label: 'Penetracao', active: gameState.team[0]?.holdItem === 'penetration_pendant' || gameState.team[0]?.item === 'penetration_pendant' }
        ].map(gear => (
          <div key={gear.id} className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 transition-all shrink-0 ${gear.active ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-white/5 border-white/5 text-white/20'}`}>
            <span className="text-[9px] font-black">{gear.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">{gear.label}</span>
            {gear.active && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />}
          </div>
        ))}
      </div>

      <div className="bg-[#141414] rounded-[2rem] border-2 border-white/5 p-6 flex flex-col gap-4 shadow-inner">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h4 className="font-black uppercase italic text-amber-500 tracking-tighter">Maiores Danos do Evento</h4>
          <span className="text-[8px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full font-bold uppercase">Ao Vivo</span>
        </div>

        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
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
                <span className="font-black text-emerald-400 text-sm">{row.maxDamage?.toLocaleString()}</span>
              </div>
            ))}
            {ranking.length === 0 && (
              <p className="text-center text-white/20 text-xs italic py-4">Nenhum registro ainda...</p>
            )}
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
        O boss muda automaticamente a cada 24 horas.
      </p>
    </div>
  );
};

export default BossScreen;

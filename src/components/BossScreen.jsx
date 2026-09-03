import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore';
import {
  getActiveBossSeason, msUntilNextSeason, seasonIdOf,
  REWARD_TIERS, getSeasonBest, getClaimedTiers, getReachedTiers,
  claimSeasonTier, getSeasonChestForRank, isChestClaimed, claimSeasonChest,
} from '../data/worldBossSeasons';

const _BASE = import.meta.env.BASE_URL.replace(/\/$/, '') || '';
const fixBgPath = (bg) => {
  if (!bg) return '';
  if (!bg.includes('url(')) {
    const cleanPath = bg.startsWith('/') ? bg : `/${bg}`;
    return `url('${_BASE}${cleanPath}') center/cover no-repeat`;
  }
  return bg.replace(/url\(['"]?(\/[^'"]+)['"]?\)/g, (_, p) => `url('${_BASE}${p}')`);
};

const formatCountdown = (ms) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  const seconds = totalSeconds % 60;
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const fmt = (n) => (n || 0).toLocaleString('pt-BR');

const BossScreen = ({ gameState, setGameState, notify, powerScore = 0, onChallengeBoss }) => {
  const [season, setSeason] = useState(() => getActiveBossSeason());
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [chest, setChest] = useState(null); // { seasonId, rank, chestId } — baú pendente

  const seasonId = season.seasonId;
  const seasonBest = getSeasonBest(gameState, seasonId);
  const reachedTiers = getReachedTiers(seasonBest);
  const claimedTiers = getClaimedTiers(gameState, seasonId);

  // Ranking da temporada (reseta a cada semana).
  useEffect(() => {
    setLoading(true);
    const scoresRef = collection(db, 'bossSeasonRankings', seasonId, 'scores');
    const q = query(scoresRef, orderBy('bestScore', 'desc'), limit(25));
    const unsub = onSnapshot(q, (snap) => {
      const data = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() }));
      setRanking(data);
      const uid = auth.currentUser?.uid;
      const idx = uid ? data.findIndex(r => r.id === uid) : -1;
      setMyRank(idx >= 0 ? idx + 1 : null);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [seasonId]);

  // Relógio + virada de temporada.
  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
      const active = getActiveBossSeason();
      if (active.seasonId !== seasonId) setSeason(active);
    }, 1000);
    return () => clearInterval(t);
  }, [seasonId]);

  // Detecta baú de fim de temporada pendente: uma temporada ANTERIOR em que o
  // jogador pontuou e ainda não coletou o baú. Busca o rank final no Firestore.
  useEffect(() => {
    const currentNum = season.seasonNumber;
    const bestMap = gameState.bossSeasonBest || {};
    const pending = Object.keys(bestMap)
      .filter(sid => (bestMap[sid] || 0) > 0 && !isChestClaimed(gameState, sid) && sid !== seasonId)
      .map(sid => ({ sid, num: Number(String(sid).replace('season_', '')) }))
      .filter(x => Number.isFinite(x.num) && x.num < currentNum)
      .sort((a, b) => b.num - a.num);

    if (pending.length === 0) { setChest(null); return; }
    const target = pending[0].sid;

    let cancelled = false;
    (async () => {
      try {
        const scoresRef = collection(db, 'bossSeasonRankings', target, 'scores');
        const snap = await getDocs(query(scoresRef, orderBy('bestScore', 'desc'), limit(500)));
        const rows = [];
        snap.forEach(d => rows.push(d.id));
        const uid = auth.currentUser?.uid;
        const idx = uid ? rows.indexOf(uid) : -1;
        const rank = idx >= 0 ? idx + 1 : null;
        if (!cancelled) setChest({ seasonId: target, rank, chest: getSeasonChestForRank(rank) });
      } catch {
        // Sem conexão: oferece pelo menos o baú de participante.
        if (!cancelled) setChest({ seasonId: target, rank: null, chest: getSeasonChestForRank(null) });
      }
    })();
    return () => { cancelled = true; };
  }, [seasonId, season.seasonNumber, gameState.bossSeasonBest]);

  const handleChallenge = () => {
    onChallengeBoss({
      name: season.name,
      sprite: season.sprite,
      background: season.background,
      bossType: season.bossType,
      category: 'boss',
      statMult: season.statMult,
      team: [{ id: season.bossId, level: 100 }],
      mainPokemon: { id: season.bossId, level: 100 },
    });
  };

  const handleClaimTier = (tierId) => {
    if (!setGameState) return;
    let ok = false, rw = null;
    setGameState(prev => {
      const res = claimSeasonTier(prev, seasonId, tierId);
      ok = res.claimed; rw = res.reward;
      return res.state;
    });
    if (ok && notify) {
      const tier = REWARD_TIERS.find(t => t.id === tierId);
      notify(`${tier?.emoji || '🎁'} Recompensa ${tier?.label} coletada!`, 'success');
    }
  };

  const handleClaimChest = () => {
    if (!setGameState || !chest) return;
    const target = chest.seasonId;
    let ok = false, c = null;
    setGameState(prev => {
      const res = claimSeasonChest(prev, target, chest.rank);
      ok = res.claimed; c = res.chest;
      return res.state;
    });
    if (ok) {
      if (notify) notify(`${c?.emoji || '🎁'} Baú de fim de temporada: ${c?.label}!`, 'success');
      setChest(null);
    }
  };

  const allTimeBest = Math.max(gameState.bossAllTimeBest || 0, gameState.bossTotalDamage || 0);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white p-4 animate-fadeIn overflow-y-auto custom-scrollbar">
      {/* ── Card do Chefe da Temporada ── */}
      <div className="relative w-full aspect-video rounded-[2rem] border-4 border-amber-600 overflow-hidden shadow-[0_0_30px_rgba(217,119,6,0.3)] shrink-0 mb-4 group">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
        <div className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-1000" style={{ background: fixBgPath(season.background) }}></div>

        <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300 bg-black/50 border border-amber-500/40 rounded-full px-2 py-1 backdrop-blur-md">
            {season.displayName}
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/80 bg-white/10 border border-white/20 rounded-full px-2 py-1 backdrop-blur-md">
            {season.theme}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex justify-between items-end gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 animate-pulse">Chefe Mundial · Temporada</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase italic leading-none truncate">{season.name}</h3>
            <p className="text-[10px] text-emerald-300/80 font-bold italic mt-1">Fraco a: {season.weakness}</p>
            {season.modifier && <p className="text-[10px] text-white/55 font-medium italic">⚡ {season.modifier}</p>}
          </div>
          <div className="text-right shrink-0">
            <div className="inline-flex flex-col items-end rounded-2xl border border-amber-500/40 bg-black/50 px-3 py-2 backdrop-blur-md">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-300/70">Temporada termina em</span>
              <span className="text-xl font-black tabular-nums text-amber-400 leading-none">{formatCountdown(msUntilNextSeason(now))}</span>
            </div>
          </div>
        </div>

        <img src={season.sprite} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 object-contain z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" alt={season.name}
          onError={(e) => { e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${season.bossId}.png`; }} />
      </div>

      {/* ── Baú de fim de temporada (pendente) ── */}
      {chest && (
        <button onClick={handleClaimChest}
          className="w-full mb-4 rounded-3xl p-4 flex items-center justify-between gap-3 border-b-4 border-purple-900 bg-gradient-to-br from-purple-700 to-fuchsia-600 active:scale-95 transition-transform shadow-xl">
          <div className="flex items-center gap-3 text-left">
            <span className="text-3xl">{chest.chest?.emoji || '🎁'}</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/70">Baú de Fim de Temporada</p>
              <p className="font-black uppercase italic leading-none">{chest.chest?.label}{chest.rank ? ` · #${chest.rank}` : ''}</p>
            </div>
          </div>
          <span className="bg-white text-purple-700 font-black uppercase text-[10px] tracking-widest px-3 py-2 rounded-xl">Coletar</span>
        </button>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#1a1a1a] p-3 rounded-2xl border-2 border-blue-500/20 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Melhor Dano (Temporada)</p>
          <p className="text-xl font-black text-blue-400 leading-none">{fmt(seasonBest)}</p>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">All-time: {fmt(allTimeBest)}</p>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded-2xl border-2 border-amber-500/20 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Sua Posição</p>
          <p className="text-xl font-black text-amber-400 leading-none">{myRank ? `#${myRank}` : 'Top 25+'}</p>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Ranking da temporada</p>
        </div>
      </div>

      <button onClick={handleChallenge}
        className="w-full bg-gradient-to-br from-red-600 to-amber-600 p-4 rounded-3xl border-b-4 border-amber-900 font-black uppercase italic tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-red-900/20 mb-5">
        <span className="block">DESAFIAR CHEFE</span>
        <span className="block mt-1 text-[9px] not-italic tracking-widest text-white/70">Cause o máximo de dano antes do fim</span>
      </button>

      {/* ── Trilha de Recompensas (tiers) ── */}
      <div className="mb-6">
        <h4 className="font-black uppercase italic text-amber-500 tracking-tighter mb-3 px-1">Recompensas da Temporada</h4>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {REWARD_TIERS.map(tier => {
            const reached = seasonBest >= tier.threshold;
            const claimed = claimedTiers.includes(tier.id);
            return (
              <div key={tier.id} className={`shrink-0 w-32 rounded-2xl p-3 border-2 flex flex-col items-center text-center gap-1 transition-all ${claimed ? 'bg-emerald-500/10 border-emerald-500/40' : reached ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/10'}`}>
                <span className="text-2xl">{tier.emoji}</span>
                <p className="text-[11px] font-black uppercase tracking-wide">{tier.label}</p>
                <p className="text-[9px] font-bold text-white/40">≥ {fmt(tier.threshold)} dano</p>
                <div className="text-[9px] font-bold text-white/60 leading-tight mt-1">
                  <p>💰 {fmt(tier.reward.currency)}</p>
                  {tier.reward.materials?.stardust ? <p>✨ Pó×{tier.reward.materials.stardust}</p> : null}
                  {tier.reward.border ? <p className="text-fuchsia-300">🎨 Borda</p> : null}
                </div>
                {claimed
                  ? <span className="mt-1 text-[9px] font-black uppercase text-emerald-400">Coletado</span>
                  : reached
                    ? <button onClick={() => handleClaimTier(tier.id)} className="mt-1 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg active:scale-95">Coletar</button>
                    : <span className="mt-1 text-[9px] font-black uppercase text-white/30">Bloqueado</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Ranking da Temporada ── */}
      <div className="bg-[#141414] rounded-[2rem] border-2 border-white/5 p-5 flex flex-col gap-4 shadow-inner">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h4 className="font-black uppercase italic text-amber-500 tracking-tighter">Ranking da Temporada</h4>
          <span className="text-[8px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full font-bold uppercase">Reseta semanal</span>
        </div>

        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {ranking.slice(0, 10).map((row, index) => (
              <div key={row.id} className={`flex items-center justify-between gap-3 p-3 rounded-2xl border ${auth.currentUser?.uid === row.id ? 'bg-blue-500/10 border-blue-400/40' : 'bg-white/5 border-white/5'}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-lg font-black text-xs ${index === 0 ? 'bg-amber-500 text-black' : 'bg-white/10 text-white/40'}`}>{index + 1}</span>
                  <div>
                    <span className="block font-bold text-sm uppercase italic">{row.name || 'Treinador'}</span>
                    <span className="block text-[8px] font-black uppercase tracking-widest text-white/25">Tentativas: {row.attempts || 1}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-right">
                  <div>
                    <p className="text-[8px] font-black uppercase text-white/30">Dano</p>
                    <p className="font-black text-emerald-400 text-sm">{fmt(row.bestDamage || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase text-white/30">Score</p>
                    <p className="font-black text-purple-300 text-sm">{fmt(row.bestScore || 0)}</p>
                  </div>
                </div>
              </div>
            ))}
            {ranking.length === 0 && (
              <p className="text-center text-white/20 text-xs italic py-4">Ninguém pontuou nesta temporada ainda. Seja o primeiro!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BossScreen;

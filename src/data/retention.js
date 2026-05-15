const DAY_MS = 24 * 60 * 60 * 1000;

const pad2 = (value) => String(value).padStart(2, '0');

export const getLocalDateKey = (now = new Date()) => {
  const date = now instanceof Date ? now : new Date(now);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

export const getWeekKey = (now = new Date()) => {
  const date = now instanceof Date ? new Date(now) : new Date(now);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return `${date.getFullYear()}-W${pad2(getIsoWeek(date))}`;
};

const getIsoWeek = (date) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil((((target - yearStart) / DAY_MS) + 1) / 7);
};

const getYesterdayKey = (now = new Date()) => {
  const date = now instanceof Date ? new Date(now) : new Date(now);
  date.setDate(date.getDate() - 1);
  return getLocalDateKey(date);
};

export const RETENTION_DAILY_MISSIONS = [
  {
    id: 'daily_defeat_25',
    title: 'Treino de Rota',
    description: 'Derrote 25 Pokemon nas rotas.',
    stat: 'pokemonDefeated',
    target: 25,
    icon: 'muscle-band.webp',
    reward: { currency: 3000, items: { pokeballs: 5 } },
  },
  {
    id: 'daily_capture_5',
    title: 'Capturador Ativo',
    description: 'Capture 5 Pokemon durante a jornada.',
    stat: 'pokemonCaptured',
    target: 5,
    icon: 'poke-ball.webp',
    reward: { currency: 2500, items: { great_ball: 2 } },
  },
  {
    id: 'daily_trainers_3',
    title: 'Desafio VS',
    description: 'Venca 3 batalhas contra treinadores.',
    stat: 'trainersDefeated',
    target: 3,
    icon: 'vs-seeker.webp',
    reward: { currency: 3500, materials: { normal_essence: 20 } },
  },
  {
    id: 'daily_raid_1',
    title: 'Patrulha de Raid',
    description: 'Venca 1 raid ativa.',
    stat: 'raidsWon',
    target: 1,
    icon: 'star-piece.webp',
    reward: { currency: 8000, items: { exp_candy_m: 1 } },
  },
];

export const RETENTION_WEEKLY_MISSIONS = [
  {
    id: 'weekly_defeat_250',
    title: 'Semana de Treino',
    description: 'Derrote 250 Pokemon em qualquer rota.',
    stat: 'pokemonDefeated',
    target: 250,
    icon: 'muscle-band.webp',
    reward: { currency: 25000, items: { ultra_ball: 5 } },
  },
  {
    id: 'weekly_capture_40',
    title: 'Colecionador Regional',
    description: 'Capture 40 Pokemon na semana.',
    stat: 'pokemonCaptured',
    target: 40,
    icon: 'poke-ball.webp',
    reward: { currency: 30000, materials: { mystic_dust: 10 } },
  },
  {
    id: 'weekly_shiny_1',
    title: 'Brilho Raro',
    description: 'Capture 1 Pokemon shiny.',
    stat: 'shinyCaptured',
    target: 1,
    icon: 'shiny-charm.webp',
    reward: { currency: 40000, items: { exp_candy_l: 1 } },
  },
  {
    id: 'weekly_raids_5',
    title: 'Cacador de Raids',
    description: 'Venca 5 raids.',
    stat: 'raidsWon',
    target: 5,
    icon: 'star-piece.webp',
    reward: { currency: 50000, materials: { stardust: 5 } },
  },
];

export const getLoginReward = (streak = 0) => {
  const day = Math.max(1, Number(streak || 0) + 1);
  const cycleDay = ((day - 1) % 7) + 1;
  const rewards = {
    1: { currency: 1000, items: { pokeballs: 5 } },
    2: { currency: 1500, items: { great_ball: 3 } },
    3: { currency: 2000, materials: { normal_essence: 25 } },
    4: { currency: 3000, items: { ultra_ball: 2 } },
    5: { currency: 4500, items: { exp_candy_m: 1 } },
    6: { currency: 6000, materials: { mystic_dust: 3 } },
    7: { currency: 10000, items: { exp_candy_l: 1 }, materials: { stardust: 2 } },
  };
  return { day, cycleDay, reward: rewards[cycleDay] };
};

const statValue = (gameState = {}, stat) => {
  const stats = gameState.playerStats || {};
  const allPokemon = [...(gameState.team || []), ...(gameState.pc || [])];
  const masteryCaptures = Object.values(gameState.speciesMastery || {}).reduce((sum, value) => sum + Number(value || 0), 0);
  const shinyOwned = allPokemon.reduce((sum, p) => sum + (p?.isShiny ? 1 : 0) + Math.max(0, Number(p?.shinyCount || 0) - (p?.isShiny ? 1 : 0)), 0);
  const raidStats = gameState.raidStats || {};

  if (stat === 'pokemonCaptured') return Math.max(Number(stats.pokemonCaptured || 0), masteryCaptures, allPokemon.length);
  if (stat === 'shinyCaptured') return Math.max(Number(stats.shinyCaptured || 0), Number(gameState.shinyCapturedCount || 0), shinyOwned);
  if (stat === 'trainersDefeated') return Math.max(Number(stats.trainersDefeated || 0), Number(gameState.trainerBattleWins || 0));
  if (stat === 'raidsWon') return Math.max(Number(stats.raidsWon || 0), Number(raidStats.total || 0));
  return Number(stats[stat] || 0);
};

const snapshotStats = (gameState = {}) => {
  const missionStats = new Set([
    ...RETENTION_DAILY_MISSIONS.map(m => m.stat),
    ...RETENTION_WEEKLY_MISSIONS.map(m => m.stat),
  ]);
  return [...missionStats].reduce((acc, stat) => {
    acc[stat] = statValue(gameState, stat);
    return acc;
  }, {});
};

export const ensureRetentionState = (gameState = {}, now = new Date()) => {
  const dateKey = getLocalDateKey(now);
  const weekKey = getWeekKey(now);
  const current = gameState.retention || {};
  const next = {
    login: {
      streak: Number(current.login?.streak || 0),
      bestStreak: Number(current.login?.bestStreak || 0),
      lastClaimDate: current.login?.lastClaimDate || null,
    },
    daily: current.daily?.dateKey === dateKey
      ? { dateKey, baselines: { ...(current.daily.baselines || {}) }, claimed: [...(current.daily.claimed || [])] }
      : { dateKey, baselines: snapshotStats(gameState), claimed: [] },
    weekly: current.weekly?.weekKey === weekKey
      ? { weekKey, baselines: { ...(current.weekly.baselines || {}) }, claimed: [...(current.weekly.claimed || [])] }
      : { weekKey, baselines: snapshotStats(gameState), claimed: [] },
  };
  return next;
};

const addMapValues = (target = {}, additions = {}) => {
  const next = { ...target };
  Object.entries(additions).forEach(([key, value]) => {
    next[key] = Number(next[key] || 0) + Number(value || 0);
  });
  return next;
};

const applyReward = (gameState = {}, reward = {}) => ({
  ...gameState,
  currency: Number(gameState.currency || 0) + Number(reward.currency || 0),
  inventory: {
    ...(gameState.inventory || {}),
    items: addMapValues(gameState.inventory?.items, reward.items),
    materials: addMapValues(gameState.inventory?.materials, reward.materials),
    candies: addMapValues(gameState.inventory?.candies, reward.candies),
  },
});

const missionProgress = (gameState, retention, period, mission) => {
  const baseline = Number(retention?.[period]?.baselines?.[mission.stat] || 0);
  return Math.max(0, statValue(gameState, mission.stat) - baseline);
};

export const getRetentionViewModel = (gameState = {}, now = new Date()) => {
  const retention = ensureRetentionState(gameState, now);
  const today = getLocalDateKey(now);
  const loginReward = getLoginReward(retention.login.streak);
  const mapMission = (period, mission) => {
    const progress = missionProgress(gameState, retention, period, mission);
    const claimed = (retention[period]?.claimed || []).includes(mission.id);
    return {
      ...mission,
      progress,
      pct: Math.min(100, Math.round((progress / mission.target) * 100)),
      complete: progress >= mission.target,
      claimed,
    };
  };

  return {
    retention,
    canClaimLogin: retention.login.lastClaimDate !== today,
    loginReward,
    dailyMissions: RETENTION_DAILY_MISSIONS.map(m => mapMission('daily', m)),
    weeklyMissions: RETENTION_WEEKLY_MISSIONS.map(m => mapMission('weekly', m)),
  };
};

export const claimLoginReward = (gameState = {}, now = new Date()) => {
  const today = getLocalDateKey(now);
  const retention = ensureRetentionState(gameState, now);
  if (retention.login.lastClaimDate === today) {
    return { state: { ...gameState, retention }, claimed: false, reward: null };
  }

  const yesterday = getYesterdayKey(now);
  const streak = retention.login.lastClaimDate === yesterday ? retention.login.streak + 1 : 1;
  const { reward } = getLoginReward(streak - 1);
  const rewarded = applyReward(gameState, reward);
  return {
    state: {
      ...rewarded,
      retention: {
        ...retention,
        login: {
          streak,
          bestStreak: Math.max(streak, Number(retention.login.bestStreak || 0)),
          lastClaimDate: today,
        },
      },
    },
    claimed: true,
    reward,
  };
};

export const claimMissionReward = (gameState = {}, period = 'daily', missionId, now = new Date()) => {
  const retention = ensureRetentionState(gameState, now);
  const missions = period === 'weekly' ? RETENTION_WEEKLY_MISSIONS : RETENTION_DAILY_MISSIONS;
  const mission = missions.find(m => m.id === missionId);
  if (!mission) return { state: { ...gameState, retention }, claimed: false, reward: null };

  const alreadyClaimed = (retention[period]?.claimed || []).includes(missionId);
  const progress = missionProgress(gameState, retention, period, mission);
  if (alreadyClaimed || progress < mission.target) {
    return { state: { ...gameState, retention }, claimed: false, reward: null };
  }

  const rewarded = applyReward(gameState, mission.reward);
  return {
    state: {
      ...rewarded,
      retention: {
        ...retention,
        [period]: {
          ...retention[period],
          claimed: [...(retention[period]?.claimed || []), missionId],
        },
      },
    },
    claimed: true,
    reward: mission.reward,
  };
};

export const formatRewardSummary = (reward = {}) => {
  const parts = [];
  if (reward.currency) parts.push(`${Number(reward.currency).toLocaleString('pt-BR')} moedas`);
  Object.entries(reward.items || {}).forEach(([key, qty]) => parts.push(`${qty}x ${key}`));
  Object.entries(reward.materials || {}).forEach(([key, qty]) => parts.push(`${qty}x ${key}`));
  Object.entries(reward.candies || {}).forEach(([key, qty]) => parts.push(`${qty}x ${key}`));
  return parts.join(' + ') || 'Recompensa coletada';
};

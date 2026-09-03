// Trilha de recompensas da Pokédex (Etapa 1): marcos da Dex Nacional + conclusão por região.
// Progresso derivado de caughtData (permanente). Coleta marca em claimedDexRewards e pode
// desbloquear bordas globais (via gameState.unlockedBorders). Títulos são automáticos (trainerTitles).

import { REGION_DEX_RANGES, REGION_ORDER, REGION_LABELS } from './regionStandards';

const NATIONAL_MAX = 1025;

export const DEX_REWARDS = [
  // ── Dex Nacional ─────────────────────────────────────────────────────────
  { id: 'dex_nat_100',  kind: 'national', target: 100,          title: 'Colecionador Iniciante', reward: { currency: 30000,   items: { great_ball: 5, exp_candy_m: 3 } } },
  { id: 'dex_nat_251',  kind: 'national', target: 251,          title: 'Duas Regiões',            reward: { currency: 80000,   items: { ultra_ball: 5 }, materials: { stardust: 5 } }, border: 'dex_wanderer' },
  { id: 'dex_nat_500',  kind: 'national', target: 500,          title: 'Meio Caminho',            reward: { currency: 150000,  items: { exp_candy_l: 3 }, materials: { stardust: 10 } }, border: 'dex_collector' },
  { id: 'dex_nat_750',  kind: 'national', target: 750,          title: 'Quase Lá',                reward: { currency: 250000,  materials: { stardust: 15 } } },
  { id: 'dex_nat_1025', kind: 'national', target: NATIONAL_MAX, title: 'Lenda da Pokédex',        reward: { currency: 1000000, materials: { stardust: 50 } }, border: 'dex_master' },

  // ── Shiny Dex (espécies distintas capturadas em shiny) ─────────────────────
  { id: 'dex_shiny_10',  kind: 'shiny_dex', target: 10,  title: 'Caçador de Shiny',   reward: { currency: 50000,  items: { ultra_ball: 5 } } },
  { id: 'dex_shiny_25',  kind: 'shiny_dex', target: 25,  title: 'Colecionador Shiny',  reward: { currency: 120000, materials: { stardust: 10 } } },
  { id: 'dex_shiny_50',  kind: 'shiny_dex', target: 50,  title: 'Mestre Shiny',        reward: { currency: 250000, materials: { stardust: 20 } }, border: 'dex_shiny' },
  { id: 'dex_shiny_100', kind: 'shiny_dex', target: 100, title: 'Lenda Cintilante',    reward: { currency: 600000, materials: { stardust: 40 } } },

  // ── Conclusão por região (uma por região) ─────────────────────────────────
  ...REGION_ORDER.filter(r => r !== 'hisui').map(r => {
    const range = REGION_DEX_RANGES[r];
    const size = range ? (range.max - range.min + 1) : 0;
    return {
      id: `dex_region_${r}`,
      kind: 'region',
      region: r,
      target: size,
      title: `Mestre de ${REGION_LABELS[r] || r}`,
      reward: { currency: 60000, items: { ultra_ball: 5 }, materials: { stardust: 6 } },
    };
  }),
];

export const getDexCaughtIds = (gameState = {}) =>
  Object.keys(gameState.caughtData || {}).map(Number).filter(Boolean);

// Espécies distintas em shiny: persistido (shinyCaughtData) ∪ shinies no time/PC.
export const getShinyDexIds = (gameState = {}) => {
  const set = new Set(Object.keys(gameState.shinyCaughtData || {}).map(Number).filter(Boolean));
  const add = (list) => (list || []).forEach(p => {
    if (p && p.isShiny) {
      const bid = Number(p.id) >= 10000 ? Number(p.id) % 10000 : Number(p.id);
      if (bid) set.add(bid);
    }
  });
  add(gameState.team); add(gameState.pc);
  return set;
};

export const getDexRewardProgress = (gameState = {}, r = {}) => {
  if (r.kind === 'shiny_dex') return getShinyDexIds(gameState).size;
  const ids = getDexCaughtIds(gameState);
  if (r.kind === 'national') return ids.filter(id => id >= 1 && id <= NATIONAL_MAX).length;
  if (r.kind === 'region') {
    const range = REGION_DEX_RANGES[r.region];
    if (!range) return 0;
    return ids.filter(id => id >= range.min && id <= range.max).length;
  }
  return 0;
};

export const isDexRewardComplete = (gameState, r) => getDexRewardProgress(gameState, r) >= (r.target || 0);
export const isDexRewardClaimed = (gameState, id) => (gameState.claimedDexRewards || []).includes(id);

// Concede a recompensa e marca como coletada. Retorna { state, claimed, reward }.
export const claimDexReward = (gameState = {}, id) => {
  const r = DEX_REWARDS.find(x => x.id === id);
  if (!r || isDexRewardClaimed(gameState, id) || !isDexRewardComplete(gameState, r)) {
    return { state: gameState, claimed: false, reward: null };
  }
  const rw = r.reward || {};
  const inv = gameState.inventory || {};
  const newInv = { ...inv, items: { ...(inv.items || {}) }, materials: { ...(inv.materials || {}) } };
  Object.entries(rw.items || {}).forEach(([k, v]) => { newInv.items[k] = (newInv.items[k] || 0) + v; });
  Object.entries(rw.materials || {}).forEach(([k, v]) => { newInv.materials[k] = (newInv.materials[k] || 0) + v; });
  const unlockedBorders = r.border
    ? Array.from(new Set([...(gameState.unlockedBorders || []), r.border]))
    : (gameState.unlockedBorders || []);
  return {
    state: {
      ...gameState,
      currency: (gameState.currency || 0) + (rw.currency || 0),
      inventory: newInv,
      claimedDexRewards: [...(gameState.claimedDexRewards || []), id],
      unlockedBorders,
    },
    claimed: true,
    reward: rw,
  };
};

// View model para a aba de Progresso: por-região com % e nacional.
export const getDexProgressView = (gameState = {}) => {
  const ids = getDexCaughtIds(gameState);
  const national = ids.filter(id => id >= 1 && id <= NATIONAL_MAX).length;
  const regions = REGION_ORDER.filter(r => r !== 'hisui').map(r => {
    const range = REGION_DEX_RANGES[r];
    const size = range ? (range.max - range.min + 1) : 0;
    const have = range ? ids.filter(id => id >= range.min && id <= range.max).length : 0;
    return { region: r, label: REGION_LABELS[r] || r, have, size, pct: size ? Math.round((have / size) * 100) : 0 };
  });
  const shinyDex = getShinyDexIds(gameState).size;
  return { national, nationalMax: NATIONAL_MAX, nationalPct: Math.round((national / NATIONAL_MAX) * 100), regions, shinyDex };
};

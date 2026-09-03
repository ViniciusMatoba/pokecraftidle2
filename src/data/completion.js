// Sala de Troféus — agrega o progresso de todas as trilhas num resumo só-leitura.
// Não cria estado novo; deriva de gameState + as trilhas existentes.

import { ACHIEVEMENTS, isAchievementComplete } from './achievements';
import { DEX_REWARDS, isDexRewardComplete, getDexCaughtIds, getShinyDexIds } from './dexRewards';
import { GLOBAL_BORDERS, isGlobalBorderUnlocked } from './globalBorders';
import { TRAINER_TITLES, getUnlockedTrainerTitles } from './trainerTitles';
import { getSpeciesMasteryTier } from './masteryBorders';
import { REGION_BADGE_IDS, REGION_ORDER } from './regionStandards';

const NATIONAL_MAX = 1025;
const pct = (have, total) => (total > 0 ? Math.min(100, Math.round((have / total) * 100)) : 0);

export const getCompletionSummary = (gameState = {}) => {
  // Pokédex Nacional
  const caughtIds = getDexCaughtIds(gameState);
  const national = caughtIds.filter(id => id >= 1 && id <= NATIONAL_MAX).length;

  // Shiny Dex (info — sem total fixo; alvo suave de 100 para a barra)
  const shiny = getShinyDexIds(gameState).size;

  // Conquistas (completas)
  const achComplete = ACHIEVEMENTS.filter(a => isAchievementComplete(gameState, a)).length;

  // Marcos da Dex (completos)
  const dexRComplete = DEX_REWARDS.filter(r => isDexRewardComplete(gameState, r)).length;

  // Bordas desbloqueadas
  const bordersUnlocked = GLOBAL_BORDERS.filter(b => isGlobalBorderUnlocked(gameState, b)).length;

  // Títulos desbloqueados
  const titleCtx = {
    caughtData: gameState.caughtData || {},
    caughtCount: caughtIds.length,
    worldFlags: gameState.worldFlags || [],
    forgedItems: gameState.forgedItemsCount || 0,
    bossDamage: gameState.bossTotalDamage || 0,
    shinyCount: gameState.shinyCapturedCount || (gameState.playerStats?.shinyCaptured || 0),
    trainerBattleWins: gameState.trainerBattleWins || 0,
    playerStats: gameState.playerStats || {},
    badges: gameState.badges || [],
  };
  const titlesUnlocked = getUnlockedTrainerTitles(titleCtx).filter(t => !t.purchased).length;

  // Insígnias (todas as regiões)
  const allBadgeIds = REGION_ORDER.reduce((set, r) => {
    (REGION_BADGE_IDS[r] || []).forEach(id => set.add(id));
    return set;
  }, new Set());
  const badgesTotal = allBadgeIds.size;
  const badgesHave = (gameState.badges || []).filter(id => allBadgeIds.has(id)).length;

  // Maestrias
  const mastery = { bronze: 0, silver: 0, gold: 0 };
  Object.values(gameState.speciesMastery || {}).forEach(count => {
    const tier = getSpeciesMasteryTier(count);
    if (tier) mastery[tier] += 1;
  });

  const cards = [
    { key: 'dex',     icon: '📕', label: 'Pokédex Nacional', have: national,          total: NATIONAL_MAX,          pct: pct(national, NATIONAL_MAX) },
    { key: 'shiny',   icon: '✨', label: 'Shiny Dex',        have: shiny,             total: 100, suffix: 'espécies', pct: pct(shiny, 100) },
    { key: 'ach',     icon: '🏆', label: 'Conquistas',       have: achComplete,       total: ACHIEVEMENTS.length,   pct: pct(achComplete, ACHIEVEMENTS.length) },
    { key: 'dexr',    icon: '🏅', label: 'Marcos da Dex',    have: dexRComplete,      total: DEX_REWARDS.length,    pct: pct(dexRComplete, DEX_REWARDS.length) },
    { key: 'badges',  icon: '🎖️', label: 'Insígnias',        have: badgesHave,        total: badgesTotal,           pct: pct(badgesHave, badgesTotal) },
    { key: 'borders', icon: '🎨', label: 'Bordas',           have: bordersUnlocked,   total: GLOBAL_BORDERS.length, pct: pct(bordersUnlocked, GLOBAL_BORDERS.length) },
    { key: 'titles',  icon: '🏷️', label: 'Títulos',          have: titlesUnlocked,    total: TRAINER_TITLES.length, pct: pct(titlesUnlocked, TRAINER_TITLES.length) },
  ];

  // % Geral: média ponderada das trilhas com "total" bem definido.
  const weights = { dex: 0.30, ach: 0.18, dexr: 0.14, badges: 0.16, borders: 0.10, titles: 0.12 };
  let overall = 0, wsum = 0;
  cards.forEach(c => { if (weights[c.key] != null) { overall += c.pct * weights[c.key]; wsum += weights[c.key]; } });
  const overallPct = wsum > 0 ? Math.round(overall / wsum) : 0;

  return { overallPct, cards, mastery, shiny };
};

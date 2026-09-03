// Bordas Globais — cosméticas, desbloqueadas ao coletar conquistas e aplicadas
// livremente pelo jogador em qualquer Pokémon (guardadas em gameState.pokemonBorders[instanceId]).
// A borda global escolhida SUBSTITUI a borda automática de maestria no card.

export const GLOBAL_BORDERS = [
  { id: 'crown_kanto',    name: 'Coroa de Kanto',    achievement: 'ach_kanto_dex',    color: '#f59e0b', emoji: '👑',
    ring: '0 0 0 3px #f59e0b, 0 0 0 6px #7c2d12, 0 0 22px 4px rgba(245,158,11,0.85)' },
  { id: 'shiny_aura',     name: 'Aura Cintilante',   achievement: 'ach_shiny_50',     color: '#a78bfa', emoji: '✨',
    ring: '0 0 0 3px #a78bfa, 0 0 0 6px #f0abfc, 0 0 24px 5px rgba(167,139,250,0.85)' },
  { id: 'alpha_mark',     name: 'Marca Alfa',        achievement: 'ach_alpha_25',     color: '#dc2626', emoji: '🔴',
    ring: '0 0 0 3px #dc2626, 0 0 0 6px #7f1d1d, 0 0 22px 4px rgba(220,38,38,0.9)' },
  { id: 'ring_legend',    name: 'Lenda dos Ringues', achievement: 'ach_trainers_2000',color: '#0ea5e9', emoji: '🏆',
    ring: '0 0 0 3px #0ea5e9, 0 0 0 6px #0c4a6e, 0 0 22px 4px rgba(14,165,233,0.85)' },
  { id: 'collector',      name: 'Colecionador Supremo', achievement: 'ach_distinct_500', color: '#10b981', emoji: '📕',
    ring: '0 0 0 3px #10b981, 0 0 0 6px #064e3b, 0 0 22px 4px rgba(16,185,129,0.85)' },
  { id: 'raid_master',    name: 'Mestre de Raids',   achievement: 'ach_raid_150',     color: '#f43f5e', emoji: '🌀',
    ring: '0 0 0 3px #f43f5e, 0 0 0 6px #4c0519, 0 0 22px 4px rgba(244,63,94,0.85)' },
  { id: 'life_architect', name: 'Arquiteto da Vida', achievement: 'ach_evo_150',      color: '#84cc16', emoji: '🧬',
    ring: '0 0 0 3px #84cc16, 0 0 0 6px #365314, 0 0 22px 4px rgba(132,204,22,0.85)' },
  { id: 'besties',        name: 'Melhores Amigos',   achievement: 'ach_besties_10',   color: '#ec4899', emoji: '💞',
    ring: '0 0 0 3px #ec4899, 0 0 0 6px #831843, 0 0 22px 4px rgba(236,72,153,0.85)' },
  { id: 'hero_region',    name: 'Herói da Região',   achievement: 'ach_villains_50',  color: '#6366f1', emoji: '🛡️',
    ring: '0 0 0 3px #6366f1, 0 0 0 6px #1e1b4b, 0 0 22px 4px rgba(99,102,241,0.85)' },
  { id: 'boss_hunter',    name: 'Caçador de Chefes', achievement: 'ach_bosses_50',    color: '#f97316', emoji: '⚔️',
    ring: '0 0 0 3px #f97316, 0 0 0 6px #7c2d12, 0 0 22px 4px rgba(249,115,22,0.85)' },

  // ── Bordas da Trilha da Pokédex (desbloqueadas via gameState.unlockedBorders) ──
  { id: 'dex_wanderer',  name: 'Andarilho da Dex',  color: '#0891b2', emoji: '🧭',
    ring: '0 0 0 3px #0891b2, 0 0 0 6px #cffafe, 0 0 22px 4px rgba(8,145,178,0.85)' },
  { id: 'dex_collector', name: 'Colecionador Épico', color: '#7c3aed', emoji: '📗',
    ring: '0 0 0 3px #7c3aed, 0 0 0 6px #ede9fe, 0 0 22px 4px rgba(124,58,237,0.85)' },
  { id: 'dex_master',    name: 'Lenda da Pokédex',  color: '#e11d48', emoji: '📕',
    ring: '0 0 0 3px #e11d48, 0 0 0 6px #fecdd3, 0 0 26px 5px rgba(225,29,72,0.9)' },
  { id: 'dex_shiny',     name: 'Mestre Shiny',      color: '#eab308', emoji: '🌟',
    ring: '0 0 0 3px #eab308, 0 0 0 6px #fef9c3, 0 0 26px 5px rgba(234,179,8,0.9)' },

  // ── Bordas das Temporadas do Chefe Mundial (via gameState.unlockedBorders) ──
  { id: 'boss_vanquisher', name: 'Algoz do Chefe',    color: '#f97316', emoji: '💥',
    ring: '0 0 0 3px #f97316, 0 0 0 6px #431407, 0 0 24px 5px rgba(249,115,22,0.9)' },
  { id: 'boss_sovereign',  name: 'Soberano da Fenda', color: '#e11d48', emoji: '🔱',
    ring: '0 0 0 3px #e11d48, 0 0 0 6px #4c0519, 0 0 28px 6px rgba(225,29,72,0.95)' },
];

export const getGlobalBorderById = (id) => GLOBAL_BORDERS.find(b => b.id === id) || null;

// Uma borda é desbloqueada quando sua conquista foi COLETADA (claimedAchievements)
// ou quando foi concedida por outra trilha (gameState.unlockedBorders — ex.: Pokédex).
export const isGlobalBorderUnlocked = (gameState, border) => {
  if (!border) return false;
  if (border.achievement && (gameState?.claimedAchievements || []).includes(border.achievement)) return true;
  if ((gameState?.unlockedBorders || []).includes(border.id)) return true;
  return false;
};

export const getUnlockedGlobalBorders = (gameState = {}) =>
  GLOBAL_BORDERS.filter(b => isGlobalBorderUnlocked(gameState, b));

// Ring da borda global atribuída a uma instância — só retorna se ainda estiver desbloqueada.
export const getAssignedBorderRing = (gameState, instanceId) => {
  const id = gameState?.pokemonBorders?.[instanceId];
  if (!id) return null;
  const b = getGlobalBorderById(id);
  if (!b || !isGlobalBorderUnlocked(gameState, b)) return null;
  return b.ring;
};

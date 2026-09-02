// Sistema de Amizade — Etapa 1 (núcleo, ganho e visual).
// Amizade é por INSTÂNCIA (instanceId), guardada em gameState.friendship[instanceId] = pontos.
// 5 Corações; cada coração = FRIENDSHIP_PER_HEART pontos.

export const FRIENDSHIP_MAX_HEARTS = 5;
export const FRIENDSHIP_PER_HEART = 100;
export const FRIENDSHIP_MAX_POINTS = FRIENDSHIP_MAX_HEARTS * FRIENDSHIP_PER_HEART; // 500

// Quanto de amizade é ganho por evento.
export const FRIENDSHIP_GAIN = {
  activeBattle: 2, // Pokémon ativo (líder) venceu uma batalha
  sharedBattle: 1, // Pokémon no time recebendo EXP compartilhado
};

// Pontos atuais de amizade de uma instância.
export const getFriendshipPoints = (gameState, instanceId) =>
  Number(gameState?.friendship?.[instanceId] || 0);

// Nº de corações preenchidos (0–5) a partir dos pontos.
export const getHeartsFromPoints = (points = 0) =>
  Math.min(FRIENDSHIP_MAX_HEARTS, Math.floor(Number(points || 0) / FRIENDSHIP_PER_HEART));

// View model para UI: pontos clampados, corações, se está no máximo e % até o próximo coração.
export const getFriendshipView = (points = 0) => {
  const p = Math.min(FRIENDSHIP_MAX_POINTS, Math.max(0, Number(points || 0)));
  const hearts = getHeartsFromPoints(p);
  const atMax = hearts >= FRIENDSHIP_MAX_HEARTS;
  const intoHeart = p - hearts * FRIENDSHIP_PER_HEART;
  const pct = atMax ? 100 : Math.round((intoHeart / FRIENDSHIP_PER_HEART) * 100);
  return { points: p, hearts, atMax, pct };
};

// Aplica um mapa { instanceId: quantidade } sobre o estado de amizade (clampado ao máximo).
export const applyFriendshipGains = (friendship = {}, gains = {}) => {
  const entries = Object.entries(gains || {});
  if (entries.length === 0) return friendship || {};
  const next = { ...(friendship || {}) };
  entries.forEach(([id, amt]) => {
    if (!id || id === 'undefined') return;
    const inc = Number(amt) || 0;
    if (inc === 0) return;
    next[id] = Math.min(FRIENDSHIP_MAX_POINTS, (Number(next[id]) || 0) + inc);
  });
  return next;
};

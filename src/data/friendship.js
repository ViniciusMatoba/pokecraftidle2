// Sistema de Amizade — Etapa 1 (núcleo, ganho e visual).
// Amizade é por INSTÂNCIA (instanceId), guardada em gameState.friendship[instanceId] = pontos.
// 5 Corações com custo PROGRESSIVO: cada coração exige mais pontos que o anterior.

export const FRIENDSHIP_MAX_HEARTS = 5;

// Limiares CUMULATIVOS de pontos para atingir cada coração (1º ao 5º).
// Progressivo: 100 → +200 → +350 → +550 → +800.
export const FRIENDSHIP_THRESHOLDS = [100, 300, 650, 1200, 2000];
export const FRIENDSHIP_MAX_POINTS = FRIENDSHIP_THRESHOLDS[FRIENDSHIP_THRESHOLDS.length - 1]; // 2000

// Quanto de amizade é ganho por evento.
export const FRIENDSHIP_GAIN = {
  activeBattle: 2, // Pokémon ativo (líder) venceu uma batalha
  sharedBattle: 1, // Pokémon no time recebendo EXP compartilhado
};

// Pontos atuais de amizade de uma instância.
export const getFriendshipPoints = (gameState, instanceId) =>
  Number(gameState?.friendship?.[instanceId] || 0);

// Nº de corações preenchidos (0–5) a partir dos pontos (progressivo).
export const getHeartsFromPoints = (points = 0) => {
  const p = Number(points) || 0;
  let hearts = 0;
  for (const t of FRIENDSHIP_THRESHOLDS) {
    if (p >= t) hearts += 1;
    else break;
  }
  return hearts;
};

// View model para UI: pontos clampados, corações, se está no máximo e % até o próximo coração.
export const getFriendshipView = (points = 0) => {
  const p = Math.min(FRIENDSHIP_MAX_POINTS, Math.max(0, Number(points || 0)));
  const hearts = getHeartsFromPoints(p);
  const atMax = hearts >= FRIENDSHIP_MAX_HEARTS;
  const prevThreshold = hearts > 0 ? FRIENDSHIP_THRESHOLDS[hearts - 1] : 0;
  const nextThreshold = atMax ? FRIENDSHIP_MAX_POINTS : FRIENDSHIP_THRESHOLDS[hearts];
  const span = Math.max(1, nextThreshold - prevThreshold);
  const into = p - prevThreshold;
  const pct = atMax ? 100 : Math.round((into / span) * 100);
  return {
    points: p,
    hearts,
    atMax,
    pct,
    pointsIntoHeart: into,
    pointsForNext: atMax ? 0 : Math.max(0, nextThreshold - p),
    prevThreshold,
    nextThreshold,
  };
};

// Info por coração para a tela de explicação (pontos e nº aproximado de vitórias como ativo).
export const FRIENDSHIP_TIER_INFO = FRIENDSHIP_THRESHOLDS.map((points, i) => ({
  heart: i + 1,
  points,
  cost: points - (i > 0 ? FRIENDSHIP_THRESHOLDS[i - 1] : 0),
  battlesActive: Math.ceil(points / FRIENDSHIP_GAIN.activeBattle),
}));

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

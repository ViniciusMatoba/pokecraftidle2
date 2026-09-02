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

// ── Etapa 2 ────────────────────────────────────────────────────────────────

// A partir do 3º coração, espécies de "evolução por amizade" podem evoluir pelo vínculo.
export const FRIENDSHIP_EVO_HEART = 3;
export const FRIENDSHIP_EVO_THRESHOLD = FRIENDSHIP_THRESHOLDS[FRIENDSHIP_EVO_HEART - 1]; // 650

// Mapa de evoluções por amizade: id base → alvos (com horário opcional para o Eevee).
export const FRIENDSHIP_EVOLUTIONS = {
  42:  [{ id: 169 }],                                         // Golbat → Crobat
  113: [{ id: 242 }],                                         // Chansey → Blissey
  133: [{ id: 196, time: ['morning', 'day', 'evening'] },     // Eevee → Espeon (dia)
        { id: 197, time: ['night'] }],                        // Eevee → Umbreon (noite)
  447: [{ id: 448 }],                                         // Riolu → Lucario
  172: [{ id: 25 }],                                          // Pichu → Pikachu
  173: [{ id: 35 }],                                          // Cleffa → Clefairy
  174: [{ id: 39 }],                                          // Igglybuff → Jigglypuff
  175: [{ id: 176 }],                                         // Togepi → Togetic
  440: [{ id: 113 }],                                         // Happiny → Chansey
  446: [{ id: 143 }],                                         // Munchlax → Snorlax
  427: [{ id: 428 }],                                         // Buneary → Lopunny
  433: [{ id: 358 }],                                         // Chingling → Chimecho
  406: [{ id: 315 }],                                         // Budew → Roselia
};

// Meta de "liberação de candies" por amizade: a cada passo de pontos acumulados
// o Pokémon libera um lote de candies da sua espécie (drop automático em lote).
export const FRIENDSHIP_CANDY_STEP = 60; // ~30 vitórias como ativo
export const FRIENDSHIP_CANDY_MIN = 3;
export const FRIENDSHIP_CANDY_MAX = 6;

// Anel exibido nos cards quando o Pokémon atinge amizade máxima (5 corações).
export const FRIENDSHIP_MAX_RING = '0 0 0 3px #f43f5e, 0 0 0 5px #fecdd3, 0 0 18px 3px rgba(244,63,94,0.75)';

// Conta quantos Pokémon (instâncias no time + PC) estão com amizade máxima (5 corações).
export const getMaxFriendshipCount = (gameState = {}) => {
  const f = gameState.friendship || {};
  return Object.values(f).filter(v => (Number(v) || 0) >= FRIENDSHIP_MAX_POINTS).length;
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

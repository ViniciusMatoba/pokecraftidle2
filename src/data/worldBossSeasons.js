// ── Temporadas do Chefe Mundial ────────────────────────────────────────────
// Rotação DETERMINÍSTICA por tempo (mesmo padrão do Destaque Semanal): todos os
// jogadores enfrentam o MESMO chefe na mesma semana, sem backend. O número da
// temporada é monotônico (serve de seasonId no Firestore) e o conteúdo curado
// rotaciona por `seasonNumber % SEASONS.length`.
//
// Recompensas: TIERS por melhor dano na temporada (coletáveis no cliente) +
// BAÚ de fim de temporada por posição no ranking. Ranking reseta a cada
// temporada (subcoleção `bossSeasonRankings/{seasonId}/scores`).

export const SEASON_MS = 7 * 24 * 60 * 60 * 1000;         // 7 dias
const EPOCH = Date.UTC(2024, 0, 1);                        // Seg 00:00 UTC — alinha semanas

const spriteFor = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// Curadoria multi-geração. `statMult` (opcional) ajusta a força do chefe.
export const SEASONS = [
  { bossId: 150, name: 'A Fúria de Mewtwo',        theme: 'Psíquico',      bossType: 'Legendary',
    background: 'bg_cave_1776863810604.webp',  weakness: 'Inseto · Fantasma · Sombrio', statMult: 2.1,
    modifier: 'Barreira psíquica: reduz status negativos.' },
  { bossId: 384, name: 'Rayquaza Emerge',          theme: 'Dragão/Voador', bossType: 'Legendary',
    background: 'bg_expedition_sky_pillar.webp', weakness: 'Gelo · Dragão · Fada', statMult: 2.15,
    modifier: 'Pressão do céu: ataques voadores mais fortes.' },
  { bossId: 483, name: 'Dialga, Senhor do Tempo',  theme: 'Aço/Dragão',    bossType: 'Legendary',
    background: 'bg_cave_1776863810604.webp',  weakness: 'Luta · Solo', statMult: 2.2,
    modifier: 'Distorção temporal: enrage 10% mais cedo.' },
  { bossId: 249, name: 'O Guardião Lugia',         theme: 'Psíquico/Voador', bossType: 'Legendary',
    background: 'bg_cave_1776863810604.webp',  weakness: 'Elétrico · Gelo · Pedra · Fantasma · Sombrio', statMult: 2.0,
    modifier: 'Aeroblast: defesa especial elevada.' },
  { bossId: 445, name: 'Garchomp Campeão',         theme: 'Dragão/Solo',   bossType: 'Champion',
    background: 'bg_gym_1776863824590.webp',   weakness: 'Gelo · Dragão · Fada', statMult: 1.95,
    modifier: 'Velocidade de areia: ataca mais rápido.' },
  { bossId: 382, name: 'A Cheia de Kyogre',        theme: 'Água',          bossType: 'Legendary',
    background: 'bg_lab_1776866008842.webp',   weakness: 'Elétrico · Grama', statMult: 2.1,
    modifier: 'Dilúvio: ataques de água amplificados.' },
  { bossId: 383, name: 'A Seca de Groudon',        theme: 'Solo',          bossType: 'Legendary',
    background: 'bg_cave_of_origin.webp', weakness: 'Água · Grama · Gelo', statMult: 2.1,
    modifier: 'Sol escaldante: ataques de fogo amplificados.' },
  { bossId: 644, name: 'Zekrom Trovejante',        theme: 'Dragão/Elétrico', bossType: 'Legendary',
    background: 'bg_cave_1776863810604.webp',  weakness: 'Solo · Gelo · Dragão · Fada', statMult: 2.15,
    modifier: 'Turbina: golpe crítico mais frequente.' },
  { bossId: 487, name: 'Giratina da Fenda',        theme: 'Fantasma/Dragão', bossType: 'Legendary',
    background: 'bg_cave_1776863810604.webp',  weakness: 'Gelo · Dragão · Fada · Fantasma · Sombrio', statMult: 2.25,
    modifier: 'Mundo distorcido: cura leve a cada 20s.' },
  { bossId: 250, name: 'Ho-Oh Renascido',          theme: 'Fogo/Voador',   bossType: 'Legendary',
    background: 'bg_gym_1776863824590.webp',   weakness: 'Água · Elétrico · Pedra', statMult: 2.05,
    modifier: 'Chama sagrada: pode queimar seu Pokémon.' },
  { bossId: 149, name: 'Ira de Dragonite',         theme: 'Dragão/Voador', bossType: 'Pseudo',
    background: 'bg_gym_1776863824590.webp',   weakness: 'Gelo · Pedra · Dragão · Fada', statMult: 1.9,
    modifier: 'Pele multiescama: resiste ao primeiro golpe forte.' },
  { bossId: 384, name: 'Rayquaza Delta',           theme: 'Dragão/Voador', bossType: 'Legendary',
    background: 'bg_expedition_sky_pillar.webp', weakness: 'Gelo · Dragão · Fada', statMult: 2.3,
    modifier: 'Temporada especial: chefe reforçado.' },
];

// Número monotônico da temporada (0, 1, 2, …) desde o EPOCH.
export const getSeasonNumber = (now = Date.now()) =>
  Math.max(0, Math.floor((now - EPOCH) / SEASON_MS));

// ms até a próxima virada de temporada.
export const msUntilNextSeason = (now = Date.now()) => {
  const elapsed = ((now - EPOCH) % SEASON_MS + SEASON_MS) % SEASON_MS;
  return SEASON_MS - elapsed;
};

export const seasonIdOf = (seasonNumber) => `season_${seasonNumber}`;

// Temporada ativa (conteúdo curado + metadados de tempo).
export const getActiveBossSeason = (now = Date.now()) => {
  const seasonNumber = getSeasonNumber(now);
  const idx = seasonNumber % SEASONS.length;
  const s = SEASONS[idx];
  return {
    ...s,
    seasonNumber,
    seasonId: seasonIdOf(seasonNumber),
    sprite: s.sprite || spriteFor(s.bossId),
    displayName: `Temporada ${seasonNumber + 1}`,
  };
};

// ── Recompensas por TIER (melhor dano na temporada) ─────────────────────────
// Thresholds calibrados sobre a escala real de dano por luta (loot atual: S=40k).
export const REWARD_TIERS = [
  { id: 'bronze',   label: 'Bronze',   emoji: '🥉', threshold: 5000,
    reward: { currency: 20000,  items: { great_ball: 5 } } },
  { id: 'silver',   label: 'Prata',    emoji: '🥈', threshold: 15000,
    reward: { currency: 50000,  items: { ultra_ball: 5 }, materials: { stardust: 8 } } },
  { id: 'gold',     label: 'Ouro',     emoji: '🥇', threshold: 35000,
    reward: { currency: 120000, items: { ultra_ball: 8 }, materials: { stardust: 15, armor_fragment: 1 }, border: 'boss_vanquisher' } },
  { id: 'diamond',  label: 'Diamante', emoji: '💎', threshold: 80000,
    reward: { currency: 300000, items: { ultra_ball: 12, ability_capsule: 1 }, materials: { stardust: 30, mega_stone_shard: 1 } } },
  { id: 'master',   label: 'Mestre',   emoji: '👑', threshold: 200000,
    reward: { currency: 700000, materials: { stardust: 60, mega_stone_shard: 2 }, border: 'boss_sovereign' } },
];

// ── Baú de fim de temporada (por posição no ranking da temporada) ───────────
export const SEASON_CHESTS = [
  { id: 'rank_1',   label: 'Campeão da Temporada', maxRank: 1,   emoji: '🏆',
    reward: { currency: 500000, materials: { stardust: 50, mega_stone_shard: 2 }, border: 'boss_sovereign' } },
  { id: 'rank_3',   label: 'Pódio',                maxRank: 3,   emoji: '🥈',
    reward: { currency: 250000, materials: { stardust: 30, mega_stone_shard: 1 } } },
  { id: 'rank_10',  label: 'Top 10',               maxRank: 10,  emoji: '🎖️',
    reward: { currency: 120000, materials: { stardust: 20 }, items: { ultra_ball: 10 } } },
  { id: 'rank_50',  label: 'Top 50',               maxRank: 50,  emoji: '🏅',
    reward: { currency: 60000,  materials: { stardust: 10 }, items: { ultra_ball: 5 } } },
  { id: 'participant', label: 'Participante',      maxRank: Infinity, emoji: '🎁',
    reward: { currency: 20000, materials: { stardust: 3 } } },
];

export const getSeasonChestForRank = (rank) => {
  if (!rank || rank < 1) return SEASON_CHESTS[SEASON_CHESTS.length - 1]; // participante
  return SEASON_CHESTS.find(c => rank <= c.maxRank) || SEASON_CHESTS[SEASON_CHESTS.length - 1];
};

// ── Progresso e coleta (opera sobre o gameState) ────────────────────────────
export const getSeasonBest = (gameState = {}, seasonId) =>
  Number((gameState.bossSeasonBest || {})[seasonId] || 0);

export const getClaimedTiers = (gameState = {}, seasonId) =>
  (gameState.claimedBossTiers || {})[seasonId] || [];

// Tiers atingidos pelo melhor dano da temporada.
export const getReachedTiers = (bestDamage = 0) =>
  REWARD_TIERS.filter(t => bestDamage >= t.threshold);

// Tiers atingidos e ainda não coletados.
export const getClaimableTiers = (gameState, seasonId) => {
  const best = getSeasonBest(gameState, seasonId);
  const claimed = getClaimedTiers(gameState, seasonId);
  return getReachedTiers(best).filter(t => !claimed.includes(t.id));
};

const applyReward = (gameState, reward = {}) => {
  const inv = gameState.inventory || {};
  const newInv = { ...inv, items: { ...(inv.items || {}) }, materials: { ...(inv.materials || {}) } };
  Object.entries(reward.items || {}).forEach(([k, v]) => { newInv.items[k] = (newInv.items[k] || 0) + v; });
  Object.entries(reward.materials || {}).forEach(([k, v]) => { newInv.materials[k] = (newInv.materials[k] || 0) + v; });
  const unlockedBorders = reward.border
    ? Array.from(new Set([...(gameState.unlockedBorders || []), reward.border]))
    : (gameState.unlockedBorders || []);
  return {
    ...gameState,
    currency: (gameState.currency || 0) + (reward.currency || 0),
    inventory: newInv,
    unlockedBorders,
  };
};

// Coleta um tier. Retorna { state, claimed, reward }.
export const claimSeasonTier = (gameState = {}, seasonId, tierId) => {
  const tier = REWARD_TIERS.find(t => t.id === tierId);
  const best = getSeasonBest(gameState, seasonId);
  const claimed = getClaimedTiers(gameState, seasonId);
  if (!tier || claimed.includes(tierId) || best < tier.threshold) {
    return { state: gameState, claimed: false, reward: null };
  }
  const next = applyReward(gameState, tier.reward);
  return {
    state: {
      ...next,
      claimedBossTiers: {
        ...(gameState.claimedBossTiers || {}),
        [seasonId]: [...claimed, tierId],
      },
    },
    claimed: true,
    reward: tier.reward,
  };
};

export const isChestClaimed = (gameState = {}, seasonId) =>
  Boolean((gameState.claimedBossChests || {})[seasonId]);

// Coleta o baú de fim de temporada dado o rank final. Retorna { state, claimed, chest }.
export const claimSeasonChest = (gameState = {}, seasonId, rank) => {
  if (isChestClaimed(gameState, seasonId)) {
    return { state: gameState, claimed: false, chest: null };
  }
  const chest = getSeasonChestForRank(rank);
  const next = applyReward(gameState, chest.reward);
  return {
    state: {
      ...next,
      claimedBossChests: {
        ...(gameState.claimedBossChests || {}),
        [seasonId]: { rank: rank || null, chestId: chest.id, at: Date.now() },
      },
    },
    claimed: true,
    chest,
  };
};

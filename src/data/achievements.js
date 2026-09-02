// Conquistas (permanentes, não resetam) — Etapa 1: Combate e Coleção.
// Progresso derivado de playerStats + caughtData. Coleta marca em claimedAchievements.

import { POKEDEX } from './pokedex';

export const ACHIEVEMENTS = [
  // ── Combate ────────────────────────────────────────────────────────────
  { id: 'ach_trainers_100',  category: 'combat', title: 'Duelista',            description: 'Derrote 100 treinadores',                 stat: 'trainersDefeated', target: 100,  reward: { currency: 20000,  items: { great_ball: 5 } } },
  { id: 'ach_trainers_500',  category: 'combat', title: 'Veterano de Duelos',  description: 'Derrote 500 treinadores',                 stat: 'trainersDefeated', target: 500,  reward: { currency: 60000,  items: { ultra_ball: 5 } } },
  { id: 'ach_trainers_2000', category: 'combat', title: 'Lenda dos Ringues',   description: 'Derrote 2000 treinadores',                stat: 'trainersDefeated', target: 2000, reward: { currency: 200000, materials: { stardust: 10 } } },
  { id: 'ach_villains_50',   category: 'combat', title: 'Herói da Região',     description: 'Derrote 50 membros de equipes vilãs',     stat: 'villainDefeated',  target: 50,   reward: { currency: 40000,  items: { dusk_stone: 1 } } },
  { id: 'ach_bosses_50',     category: 'combat', title: 'Caçador de Chefes',   description: 'Derrote 50 chefes selvagens',             stat: 'wildBossDefeated', target: 50,   reward: { currency: 50000,  materials: { armor_fragment: 5 } } },

  // ── Coleção ────────────────────────────────────────────────────────────
  { id: 'ach_distinct_100',  category: 'collection', title: 'Colecionador Iniciante', description: 'Capture 100 espécies distintas',           stat: 'distinctCaught', target: 100, reward: { currency: 25000,  items: { great_ball: 5 } } },
  { id: 'ach_distinct_251',  category: 'collection', title: 'Colecionador Dedicado',  description: 'Capture 251 espécies distintas',           stat: 'distinctCaught', target: 251, reward: { currency: 75000,  items: { ultra_ball: 8 } } },
  { id: 'ach_distinct_500',  category: 'collection', title: 'Grande Colecionador',    description: 'Capture 500 espécies distintas',           stat: 'distinctCaught', target: 500, reward: { currency: 150000, materials: { stardust: 8 } } },
  { id: 'ach_types_18',      category: 'collection', title: 'Diversidade',            description: 'Capture ao menos 1 Pokémon de cada tipo',  stat: 'typesCaught',    target: 18,  reward: { currency: 40000,  items: { moon_stone: 1 } } },
  { id: 'ach_kanto_dex',     category: 'collection', title: 'Pokédex de Kanto',       description: 'Capture os 151 Pokémon de Kanto',          stat: 'kantoDex',       target: 151, reward: { currency: 100000, items: { exp_candy_l: 2 } } },

  // ── Especiais (Etapa 2): Shiny / Alpha / Raid / Evolução ─────────────────
  { id: 'ach_shiny_1',   category: 'special', title: 'Brilho Raro',        description: 'Capture seu 1º Pokémon Shiny',   stat: 'shinyCaptured',  target: 1,   icon: 'shiny-charm.png',     reward: { currency: 30000,  items: { ultra_ball: 5 } } },
  { id: 'ach_shiny_10',  category: 'special', title: 'Caçador de Shiny',   description: 'Capture 10 Pokémon Shiny',       stat: 'shinyCaptured',  target: 10,  icon: 'shiny-charm.png',     reward: { currency: 90000,  materials: { stardust: 5 } } },
  { id: 'ach_shiny_50',  category: 'special', title: 'Lenda Cintilante',   description: 'Capture 50 Pokémon Shiny',       stat: 'shinyCaptured',  target: 50,  icon: 'shiny-charm.png',     reward: { currency: 250000, materials: { stardust: 20 } } },
  { id: 'ach_alpha_1',   category: 'special', title: 'Primeiro Alfa',      description: 'Capture seu 1º Pokémon Alfa',    stat: 'alphaCaptured',  target: 1,   icon: 'ability-capsule.png', reward: { currency: 40000,  materials: { armor_fragment: 3 } } },
  { id: 'ach_alpha_10',  category: 'special', title: 'Dominador Alfa',     description: 'Capture 10 Pokémon Alfa',        stat: 'alphaCaptured',  target: 10,  icon: 'ability-capsule.png', reward: { currency: 120000, materials: { armor_fragment: 10 } } },
  { id: 'ach_alpha_25',  category: 'special', title: 'Rei dos Alfas',      description: 'Capture 25 Pokémon Alfa',        stat: 'alphaCaptured',  target: 25,  icon: 'ability-capsule.png', reward: { currency: 300000, materials: { stardust: 15 } } },
  { id: 'ach_raid_10',   category: 'special', title: 'Invasor de Raids',   description: 'Capture 10 Pokémon em Raids',    stat: 'raidsCaptured',  target: 10,  icon: 'wishing-piece.png',   reward: { currency: 35000,  items: { ultra_ball: 5 } } },
  { id: 'ach_raid_50',   category: 'special', title: 'Veterano de Raids',  description: 'Capture 50 Pokémon em Raids',    stat: 'raidsCaptured',  target: 50,  icon: 'wishing-piece.png',   reward: { currency: 100000, materials: { stardust: 8 } } },
  { id: 'ach_raid_150',  category: 'special', title: 'Mestre de Raids',    description: 'Capture 150 Pokémon em Raids',   stat: 'raidsCaptured',  target: 150, icon: 'wishing-piece.png',   reward: { currency: 300000, materials: { stardust: 25 } } },
  { id: 'ach_evo_10',    category: 'special', title: 'Evolucionista',      description: 'Evolua 10 Pokémon',              stat: 'evolutionsDone', target: 10,  icon: 'rare-candy.png',      reward: { currency: 25000,  items: { great_ball: 5 } } },
  { id: 'ach_evo_50',    category: 'special', title: 'Mestre da Evolução',  description: 'Evolua 50 Pokémon',             stat: 'evolutionsDone', target: 50,  icon: 'rare-candy.png',      reward: { currency: 80000,  items: { exp_candy_l: 2 } } },
  { id: 'ach_evo_150',   category: 'special', title: 'Arquiteto da Vida',  description: 'Evolua 150 Pokémon',             stat: 'evolutionsDone', target: 150, icon: 'rare-candy.png',      reward: { currency: 200000, materials: { stardust: 15 } } },
];

const ALL_TYPES = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

export const getAchievementProgress = (gameState = {}, ach = {}) => {
  const stats = gameState.playerStats || {};
  const caughtIds = Object.keys(gameState.caughtData || {}).map(Number).filter(Boolean);
  switch (ach.stat) {
    case 'distinctCaught': return caughtIds.length;
    case 'kantoDex':       return caughtIds.filter(id => id >= 1 && id <= 151).length;
    case 'typesCaught': {
      const types = new Set();
      caughtIds.forEach(id => {
        const e = POKEDEX[id];
        (e?.types || (e?.type ? [e.type] : [])).forEach(t => types.add(t));
      });
      return ALL_TYPES.filter(t => types.has(t)).length;
    }
    case 'trainersDefeated': return Math.max(Number(stats.trainersDefeated || 0), Number(gameState.trainerBattleWins || 0));
    default: return Number(stats[ach.stat] || 0);
  }
};

export const isAchievementComplete = (gameState, ach) => getAchievementProgress(gameState, ach) >= (ach.target || 0);
export const isAchievementClaimed = (gameState, id) => (gameState.claimedAchievements || []).includes(id);

// Concede a recompensa e marca como coletada. Retorna { state, claimed, reward }.
export const claimAchievement = (gameState = {}, id) => {
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach || isAchievementClaimed(gameState, id) || !isAchievementComplete(gameState, ach)) {
    return { state: gameState, claimed: false, reward: null };
  }
  const r = ach.reward || {};
  const inv = gameState.inventory || {};
  const newInv = { ...inv, items: { ...(inv.items || {}) }, materials: { ...(inv.materials || {}) } };
  Object.entries(r.items || {}).forEach(([k, v]) => { newInv.items[k] = (newInv.items[k] || 0) + v; });
  Object.entries(r.materials || {}).forEach(([k, v]) => { newInv.materials[k] = (newInv.materials[k] || 0) + v; });
  return {
    state: {
      ...gameState,
      currency: (gameState.currency || 0) + (r.currency || 0),
      inventory: newInv,
      claimedAchievements: [...(gameState.claimedAchievements || []), id],
    },
    claimed: true,
    reward: r,
  };
};

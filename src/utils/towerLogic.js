import { POKEDEX } from '../data/pokedex';

// ── Helpers internos ──────────────────────────────────────────────────────────

// HP pelo cálculo simplificado Gen V: floor(2*base*level/100) + level + 10
export const calcTowerHp = (baseHp, level) =>
  Math.max(1, Math.floor(2 * (baseHp || 45) * level / 100) + level + 10);

const getTowerLearnableMoves = (base, level) => {
  const allMoves = (base.learnset || [])
    .filter(m => m.level <= level)
    .map(m => m.move)
    .filter(Boolean)
    .filter((m, i, arr) => arr.lastIndexOf(m) === i);
  return allMoves.length > 0 ? allMoves : ['tackle'];
};

const getTowerXpNeeded = (level) => Math.pow(level + 1, 3) - Math.pow(level, 3);

// Constrói objeto de Pokémon para a run da Torre a partir de um Pokémon do PC/time
// Mantém o nível real do Pokémon e seus moves aprendidos até aquele nível.
const buildRunPoke = (playerPoke, overrideLevel) => {
  const base = POKEDEX[playerPoke.id];
  if (!base) return null;

  const level = overrideLevel || playerPoke.level || 5;
  const maxHp = calcTowerHp(base.hp, level);
  const allMoves = getTowerLearnableMoves(base, level);

  return {
    id: base.id,
    name: base.name,
    level,
    exp: 0,
    maxHp,
    currentHp: maxHp,
    hp: maxHp,
    types: base.types || [base.type || 'Normal'],
    // allMoves: todos os moves disponíveis (para seleção de 4)
    allMoves,
    // moves: começa com os 4 mais recentes — se allMoves > 4, a UI vai pedir seleção
    moves: allMoves.length > 4 ? allMoves.slice(-4) : allMoves,
    needsMoveSelection: allMoves.length > 4,
  };
};

export const calculateTowerXpReward = (encounter = {}, boons = []) => {
  const enemyTeam = Array.isArray(encounter.team) ? encounter.team : [];
  const enemyXp = enemyTeam.reduce((sum, enemy) => {
    const base = POKEDEX[enemy.id];
    const baseXp = Number(base?.baseXp || base?.base_experience || 64);
    const enemyLevel = Number(enemy.level || encounter.enemyLevel || 5);
    return sum + Math.max(8, Math.floor((enemyLevel * baseXp) / 12));
  }, 0);
  const floorBonus = Math.max(0, Number(encounter.enemyLevel || 5) - 5) * 4;
  const bossMult = encounter.isBoss ? 1.35 : 1;
  const boonMult = boons.some(b => b.id === 'exp_boost') ? 1.5 : 1;
  return Math.max(1, Math.floor((enemyXp + floorBonus) * bossMult * boonMult));
};

export const applyTowerExperience = (team = [], encounter = {}, boons = []) => {
  const xpReward = calculateTowerXpReward(encounter, boons);
  const summary = [];

  const updatedTeam = team.map((poke) => {
    const base = POKEDEX[poke.id];
    if (!base) return poke;

    const wasFainted = (poke.currentHp ?? poke.hp ?? 0) <= 0;
    const gainedXp = wasFainted ? Math.max(1, Math.floor(xpReward * 0.35)) : xpReward;
    const startLevel = Math.min(100, Math.max(1, Number(poke.level || 1)));
    let level = startLevel;
    let exp = Math.max(0, Number(poke.exp ?? poke.xp ?? 0)) + gainedXp;

    while (level < 100) {
      const needed = getTowerXpNeeded(level);
      if (exp < needed) break;
      exp -= needed;
      level += 1;
    }

    const previousMoves = poke.allMoves || getTowerLearnableMoves(base, startLevel);
    const allMoves = getTowerLearnableMoves(base, level);
    const learnedMoves = allMoves.filter(move => !previousMoves.includes(move));
    const currentMoves = (poke.moves || []).filter(Boolean);
    const movesWithAutoLearn = learnedMoves.reduce((moves, move) => {
      if (moves.includes(move) || moves.length >= 4) return moves;
      return [...moves, move];
    }, currentMoves);

    const oldMaxHp = poke.maxHp || calcTowerHp(base.hp, startLevel);
    const maxHp = calcTowerHp(base.hp, level);
    const hpGain = Math.max(0, maxHp - oldMaxHp);
    const currentHp = wasFainted
      ? 0
      : Math.min(maxHp, Math.max(1, Number(poke.currentHp ?? poke.hp ?? oldMaxHp)) + hpGain);
    const needsMoveSelection = allMoves.length > 4 && learnedMoves.some(move => !movesWithAutoLearn.includes(move));

    if (gainedXp > 0 || level > startLevel || learnedMoves.length > 0) {
      summary.push({
        id: poke.id,
        name: poke.name || base.name,
        xp: gainedXp,
        startLevel,
        level,
        levelsGained: level - startLevel,
        learnedMoves,
        needsMoveSelection,
      });
    }

    return {
      ...poke,
      level,
      exp,
      maxHp,
      currentHp,
      hp: currentHp,
      allMoves,
      moves: movesWithAutoLearn.length > 0 ? movesWithAutoLearn.slice(0, 4) : allMoves.slice(0, 4),
      needsMoveSelection,
    };
  });

  return { team: updatedTeam, xpReward, summary };
};

// Fallback quando o jogador não tem Pokémon no PC (início de jogo)
const fallbackStarters = () => {
  const basics = Object.values(POKEDEX).filter(p =>
    !p.evolutionOf && !p.isLegendary && !p.isMythical && !p.form && p.hp
  );
  const shuffled = [...basics].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map(p => buildRunPoke({ id: p.id, level: 5 })).filter(Boolean);
};

// ── Exports públicos ──────────────────────────────────────────────────────────

export const createInitialTowerState = () => ({
  activeRun: null,
  highestFloor: 0,
  bp: 0,
  upgrades: {},
  checkpoint: null,
});

/**
 * Retorna 3 opções de Pokémon para o draft inicial.
 * FONTE: Pokémon já capturados pelo jogador (team + pc).
 * Fallback para básicos do POKEDEX se o jogador não tiver nada capturado.
 */
export const getTowerStarters = (playerPool = []) => {
  // Agrupa por espécie (id), usa o exemplar de maior nível de cada espécie
  const bySpecies = new Map();
  for (const p of playerPool) {
    if (!p.id || !POKEDEX[p.id]) continue;
    const existing = bySpecies.get(p.id);
    if (!existing || (p.level || 1) > (existing.level || 1)) {
      bySpecies.set(p.id, p);
    }
  }

  const pool = [...bySpecies.values()];
  if (pool.length === 0) return fallbackStarters();

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const chosen = shuffled.slice(0, Math.min(3, shuffled.length));

  // Se tiver menos de 3 espécies únicas, completa com fallback
  const result = chosen.map(p => buildRunPoke(p)).filter(Boolean);
  if (result.length < 3) {
    const extras = fallbackStarters().slice(0, 3 - result.length);
    result.push(...extras);
  }
  return result;
};

export const getRandomBoons = (count = 3) => {
  const shuffled = [...TOWER_BOONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Gera o shop disponível após cada batalha.
 * recrutas vêm do pool de Pokémon do jogador que ainda não estão no time da Torre.
 */
export const generateFloorShop = (floor, playerPool = [], currentTowerTeam = []) => {
  const shop = [
    { type: 'item', id: 'potions', name: 'Tower Potion (Cura 50 HP)', cost: 20 },
    { type: 'item', id: 'revives', name: 'Tower Revive (Revive 50%)', cost: 100 },
    ...getRandomBoons(1).map(b => ({ type: 'boon', boon: b, name: b.name, desc: b.desc, cost: 150 })),
  ];

  // Tenta adicionar um recruta do pool do jogador (30% de chance)
  if (Math.random() < 0.3) {
    const towerIds = new Set(currentTowerTeam.map(p => p.id));
    const bySpecies = new Map();
    for (const p of playerPool) {
      if (!p.id || !POKEDEX[p.id] || towerIds.has(p.id)) continue;
      const existing = bySpecies.get(p.id);
      if (!existing || (p.level || 1) > (existing.level || 1)) bySpecies.set(p.id, p);
    }

    const candidates = [...bySpecies.values()];
    if (candidates.length > 0) {
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      const recruitLevel = Math.max(chosen.level || 5, 5 + Math.floor(floor * 1.5));
      const built = buildRunPoke(chosen, recruitLevel);
      if (built) {
        shop.push({
          type: 'recruit',
          pokemon: built,
          name: `Recrutar ${built.name}`,
          desc: `Adiciona ao time (Nv ${recruitLevel})${built.needsMoveSelection ? ' — escolher golpes' : ''}.`,
          cost: 50 + floor * 5,
        });
      }
    }
  }

  return shop;
};

export const startTowerRun = (starterPokemon) => ({
  floor: 1,
  team: [starterPokemon],
  inventory: { coins: 0, potions: 0, revives: 0 },
  boons: [],
  shop: generateFloorShop(1),
  shopPending: false,
});

export const resumeTowerRun = (checkpoint, playerPool = [], towerTeam = []) => {
  const run = JSON.parse(JSON.stringify(checkpoint));
  if (!run.shop) run.shop = generateFloorShop(run.floor, playerPool, towerTeam);
  return run;
};

export const getCheckpointFloor = (currentFloor) => {
  if (currentFloor <= 10) return 1;
  return Math.floor((currentFloor - 1) / 10) * 10 + 1;
};

export const generateTowerEncounter = (floor) => {
  const isBoss = floor % 10 === 0;
  const enemyLevel = 5 + Math.floor(floor * 2.2);

  // Inimigos: qualquer Pokémon do POKEDEX (desafio desconhecido é o ponto da Torre)
  const pool = Object.values(POKEDEX).filter(p => {
    if (floor < 20 && p.isLegendary) return false;
    return true;
  });

  const numEnemies = isBoss
    ? Math.min(6, 3 + Math.floor(floor / 10))
    : Math.min(6, 1 + Math.floor(floor / 5));

  const team = [];
  for (let i = 0; i < numEnemies; i++) {
    const p = pool[Math.floor(Math.random() * pool.length)];
    team.push({ id: p.id, level: isBoss ? enemyLevel + 2 : enemyLevel });
  }

  return {
    isBoss,
    enemyLevel,
    team,
    rewardCoins: isBoss ? floor * 50 : floor * 10,
  };
};

export const TOWER_BOONS = [
  { id: 'vampirism',  name: 'Vampirismo',    desc: 'Recupera 10% do HP máx de todos os vivos após vencer.',   type: 'heal' },
  { id: 'attack_up',  name: 'Fúria',         desc: '+15% de Dano de Ataque para a equipe toda.',              type: 'buff' },
  { id: 'defense_up', name: 'Muralha',        desc: '-15% de Dano Recebido pela equipe toda.',                 type: 'buff' },
  { id: 'exp_boost',  name: 'Mente Focada',  desc: '+50% XP ganha nas batalhas da torre.',                    type: 'utility' },
  { id: 'revive_one', name: 'Anjo da Guarda', desc: 'Revive instantaneamente 1 Pokémon caído com 50% HP.',     type: 'instant' },
];

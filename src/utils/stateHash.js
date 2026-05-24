const sumPokemonLevels = (list = []) =>
  list.reduce((sum, pokemon) => sum + (Number(pokemon?.level) || 0), 0);

const sumPokemonExp = (list = []) =>
  list.reduce((sum, pokemon) => sum + (Number(pokemon?.exp ?? pokemon?.xp) || 0), 0);

const compactTowerRun = (run) => {
  if (!run) return null;
  const team = run.team || [];
  return {
    floor: run.floor || 0,
    phase: run.phase || '',
    bpEarned: run.bpEarned || 0,
    team: team.map(pokemon => ({
      id: pokemon?.id || 0,
      level: pokemon?.level || 1,
      exp: pokemon?.exp || 0,
      hp: pokemon?.hp ?? pokemon?.currentHp ?? 0,
      maxHp: pokemon?.maxHp || 0,
      fainted: !!pokemon?.fainted,
      moves: (pokemon?.moves || []).join('|'),
    })),
    boons: (run.boons || []).map(boon => boon?.id || boon).join('|'),
    inventory: run.inventory || {},
    shop: run.shop || null,
  };
};

// Hash simples dos campos-chave do estado para dirty flag do cloud save.
// Inclui progresso interno da Battle Tower apenas para salvar; nao alimenta
// powerScore, ranking ou Trainer Card.
export const computeGameStateHash = (state = {}) => {
  try {
    const team = state.team || [];
    const pc = state.pc || [];
    const tower = state.tower || {};

    return JSON.stringify({
      c: state.currency || 0,
      t: team.length,
      tl: sumPokemonLevels(team),
      tx: sumPokemonExp(team),
      pc: pc.length,
      pcl: sumPokemonLevels(pc),
      cd: Object.keys(state.caughtData || {}).length,
      wf: (state.worldFlags || []).length,
      b: (state.badges || []).length,
      inv: state.inventory?.materials || {},
      trainer: {
        name: state.trainer?.name || '',
        level: state.trainer?.level || 1,
        avatar: state.trainer?.avatar || 1,
        titleId: state.trainer?.titleId || null,
      },
      prestige: {
        level: state.prestige?.level || 0,
        points: state.prestige?.points || 0,
        trophies: (state.prestige?.trophies || []).length,
        purchasedTitles: (state.prestige?.purchasedTitles || []).length,
      },
      tower: {
        highestFloor: tower.highestFloor || 0,
        bp: tower.bp || 0,
        upgrades: tower.upgrades || {},
        activeRun: compactTowerRun(tower.activeRun),
      },
    });
  } catch {
    return null;
  }
};

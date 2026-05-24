import { describe, expect, it } from 'vitest';
import { applyTowerExperience, calcTowerHp, calculateTowerXpReward } from './towerLogic';

describe('towerLogic - calcTowerHp', () => {
  it('retorna HP razoável para level 5 com base padrão (45)', () => {
    const hp = calcTowerHp(45, 5);
    const expected = Math.max(1, Math.floor(2 * 45 * 5 / 100) + 5 + 10);
    expect(hp).toBe(expected);
    expect(hp).toBeGreaterThan(0);
  });

  it('HP cresce com o nível (level 100 > level 5)', () => {
    expect(calcTowerHp(45, 100)).toBeGreaterThan(calcTowerHp(45, 5));
  });

  it('retorna mínimo 1 mesmo com base 0', () => {
    expect(calcTowerHp(0, 1)).toBeGreaterThanOrEqual(1);
  });

  it('level=1 não crasha e retorna valor positivo', () => {
    expect(() => calcTowerHp(45, 1)).not.toThrow();
    expect(calcTowerHp(45, 1)).toBeGreaterThanOrEqual(1);
  });
});

describe('towerLogic - calculateTowerXpReward', () => {
  const encounter = {
    isBoss: false,
    enemyLevel: 7,
    team: [{ id: 16, level: 7 }],
  };

  it('retorna valor positivo para encontro normal', () => {
    expect(calculateTowerXpReward(encounter, [])).toBeGreaterThan(0);
  });

  it('boss dá mais XP que encontro normal', () => {
    const normal = calculateTowerXpReward(encounter, []);
    const boss = calculateTowerXpReward({ ...encounter, isBoss: true }, []);
    expect(boss).toBeGreaterThan(normal);
  });

  it('boon inválido não crasha (id desconhecido ignorado)', () => {
    expect(() =>
      calculateTowerXpReward(encounter, [{ id: 'boon_invalido_xyz' }])
    ).not.toThrow();
  });

  it('team vazio retorna XP mínimo (≥ 1)', () => {
    const noTeam = { ...encounter, team: [] };
    expect(calculateTowerXpReward(noTeam, [])).toBeGreaterThanOrEqual(1);
  });
});

describe('towerLogic - Battle Tower XP', () => {
  const encounter = {
    isBoss: false,
    enemyLevel: 7,
    team: [{ id: 16, level: 7 }],
  };

  it('aplica bonus de XP do boon Mente Focada', () => {
    const baseXp = calculateTowerXpReward(encounter, []);
    const boostedXp = calculateTowerXpReward(encounter, [{ id: 'exp_boost' }]);

    expect(boostedXp).toBeGreaterThan(baseXp);
  });

  it('ganha XP, sobe nivel e recalcula HP dentro da run da torre', () => {
    const startMaxHp = calcTowerHp(45, 5);
    const team = [{
      id: 1,
      name: 'Bulbasaur',
      level: 5,
      exp: 90,
      maxHp: startMaxHp,
      currentHp: 10,
      hp: 10,
      moves: ['tackle'],
      allMoves: ['tackle'],
    }];

    const result = applyTowerExperience(team, encounter, []);

    expect(result.xpReward).toBeGreaterThan(0);
    expect(result.team[0].level).toBeGreaterThan(5);
    expect(result.team[0].exp).toBeGreaterThanOrEqual(0);
    expect(result.team[0].maxHp).toBeGreaterThan(startMaxHp);
    expect(result.team[0].currentHp).toBeGreaterThan(10);
    expect(result.summary[0].levelsGained).toBeGreaterThan(0);
  });

  it('Pokémon desmaiado (currentHp=0) recebe XP reduzido e não regenera HP', () => {
    const startMaxHp = calcTowerHp(45, 5);
    const faintedTeam = [{
      id: 1,
      name: 'Bulbasaur',
      level: 5,
      exp: 90,
      maxHp: startMaxHp,
      currentHp: 0,   // desmaiado
      hp: 0,
      moves: ['tackle'],
      allMoves: ['tackle'],
    }];

    const result = applyTowerExperience(faintedTeam, encounter, []);

    // Deve ganhar XP (reduzido)
    expect(result.xpReward).toBeGreaterThan(0);
    // Pokémon desmaiado não recupera HP
    expect(result.team[0].currentHp).toBe(0);
  });

  it('team vazio retorna resultado sem erros', () => {
    const result = applyTowerExperience([], encounter, []);
    expect(result.team).toEqual([]);
    expect(result.xpReward).toBeGreaterThan(0);
    expect(result.summary).toEqual([]);
  });

  it('level cap: Pokémon já no level 100 não ultrapassa 100', () => {
    const startMaxHp = calcTowerHp(45, 100);
    const maxLevelTeam = [{
      id: 1,
      name: 'Bulbasaur',
      level: 100,
      exp: 0,
      maxHp: startMaxHp,
      currentHp: startMaxHp,
      hp: startMaxHp,
      moves: ['tackle'],
      allMoves: ['tackle'],
    }];

    const result = applyTowerExperience(maxLevelTeam, { ...encounter, enemyLevel: 50 }, []);
    expect(result.team[0].level).toBe(100); // nunca ultrapassa 100
  });
});

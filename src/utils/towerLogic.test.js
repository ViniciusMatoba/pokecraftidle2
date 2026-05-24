import { describe, expect, it } from 'vitest';
import { applyTowerExperience, calcTowerHp, calculateTowerXpReward } from './towerLogic';

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
});

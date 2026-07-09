import { describe, expect, it } from 'vitest';
import {
  applyLearnedMovesForLevelRange,
  rebuildMovesForLevel,
  getMovesAvailableAtLevel,
  getMoveKey,
} from './pokemonMoves';

describe('pokemonMoves', () => {
  it('learns every move between multiple level gains', () => {
    const charmander = {
      id: 4,
      name: 'Charmander',
      level: 5,
      moves: [{ name: 'Scratch' }],
      learnedMoves: [{ name: 'Scratch' }],
    };

    const result = applyLearnedMovesForLevelRange(charmander, 5, 16);
    const learnedKeys = result.learnedNow.map(getMoveKey);

    expect(learnedKeys).toContain('dragon-breath');
    expect(learnedKeys).toContain('ember');
    expect(learnedKeys).toContain('metal-claw');
    expect(result.learnedMoves.map(getMoveKey)).toEqual(expect.arrayContaining(learnedKeys));
  });

  it('stores extra learned moves in memory when active moves are already full', () => {
    const bulbasaur = {
      id: 1,
      level: 1,
      moves: ['tackle', 'growl', 'vine-whip', 'growth'],
      learnedMoves: ['tackle', 'growl', 'vine-whip', 'growth'],
    };

    const result = applyLearnedMovesForLevelRange(bulbasaur, 1, 20);

    expect(result.moves).toHaveLength(4);
    expect(result.learnedMoves.length).toBeGreaterThan(4);
    expect(result.learnedMoves.map(getMoveKey)).toContain('leech-seed');
  });

  it('rebuilds moves and learned memory from learnset up to level', () => {
    const squirtle = { id: 7, level: 12, moves: [] };

    const rebuilt = rebuildMovesForLevel(squirtle, 12);
    const availableKeys = getMovesAvailableAtLevel(squirtle, 12).map(getMoveKey);

    expect(rebuilt.moves.length).toBeGreaterThan(0);
    expect(rebuilt.learnedMoves.map(getMoveKey)).toEqual(availableKeys);
  });
});

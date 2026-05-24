import { describe, expect, it } from 'vitest';
import { computeGameStateHash } from './stateHash';

describe('computeGameStateHash', () => {
  const baseState = {
    currency: 100,
    team: [{ id: 1, level: 5, exp: 10 }],
    pc: [],
    caughtData: { 1: { caught: true } },
    worldFlags: [],
    badges: [],
    inventory: { materials: { normal_essence: 2 } },
    trainer: { name: 'Red', level: 1, avatar: 1 },
    tower: {
      highestFloor: 1,
      bp: 0,
      upgrades: {},
      activeRun: null,
    },
  };

  it('detecta progresso de Battle Tower sem depender de moeda ou tamanho do time', () => {
    const before = computeGameStateHash(baseState);
    const after = computeGameStateHash({
      ...baseState,
      tower: { ...baseState.tower, bp: 25, highestFloor: 3 },
    });

    expect(after).not.toBe(before);
  });

  it('detecta level up do time mantendo o mesmo numero de Pokemon', () => {
    const before = computeGameStateHash(baseState);
    const after = computeGameStateHash({
      ...baseState,
      team: [{ id: 1, level: 6, exp: 0 }],
    });

    expect(after).not.toBe(before);
  });

  it('detecta mudancas internas na run da Tower para salvar o progresso isolado', () => {
    const before = computeGameStateHash({
      ...baseState,
      tower: {
        ...baseState.tower,
        activeRun: {
          floor: 2,
          phase: 'battle',
          team: [{ id: 4, level: 7, exp: 0, hp: 20, maxHp: 25, moves: ['scratch'] }],
        },
      },
    });

    const after = computeGameStateHash({
      ...baseState,
      tower: {
        ...baseState.tower,
        activeRun: {
          floor: 2,
          phase: 'battle',
          team: [{ id: 4, level: 7, exp: 12, hp: 18, maxHp: 25, moves: ['scratch'] }],
        },
      },
    });

    expect(after).not.toBe(before);
  });
});

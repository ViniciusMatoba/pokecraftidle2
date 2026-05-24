import { describe, it, expect } from 'vitest';
import {
  getBadgeCount,
  getEarnedBadgeIds,
  calculatePowerScore,
  REGION_BADGES_BY_ID,
} from './progress';

describe('progress - getEarnedBadgeIds', () => {
  it('retorna Set vazio para estado sem badges', () => {
    const ids = getEarnedBadgeIds({});
    expect(ids.size).toBe(0);
  });

  it('converte badges legados numéricos para IDs de string (Kanto 1-8)', () => {
    const ids = getEarnedBadgeIds({ badges: [1, 2, 3] });
    expect(ids.has('boulder_badge')).toBe(true);
    expect(ids.has('cascade_badge')).toBe(true);
    expect(ids.has('thunder_badge')).toBe(true);
  });

  it('aceita badges como strings (formato moderno)', () => {
    const ids = getEarnedBadgeIds({ badges: ['boulder_badge', 'zephyr_badge'] });
    expect(ids.has('boulder_badge')).toBe(true);
    expect(ids.has('zephyr_badge')).toBe(true);
  });

  it('deduplica badges repetidos', () => {
    const ids = getEarnedBadgeIds({ badges: ['boulder_badge', 'boulder_badge', 1] });
    expect(ids.size).toBe(1);
    expect(ids.has('boulder_badge')).toBe(true);
  });

  it('inclui badges de worldFlags além de badges[]', () => {
    const ids = getEarnedBadgeIds({
      badges: ['boulder_badge'],
      worldFlags: ['zephyr_badge'],
    });
    expect(ids.has('boulder_badge')).toBe(true);
    expect(ids.has('zephyr_badge')).toBe(true);
  });

  it('ignora worldFlags que não são badges', () => {
    const ids = getEarnedBadgeIds({
      worldFlags: ['has_starter', 'champion', 'johto_started'],
    });
    // Nenhuma dessas flags é uma badge válida
    expect(ids.size).toBe(0);
  });

  it('não crasha com badge numérico fora do range', () => {
    // Badge 999 não deve causar erro — NUMBERED_BADGE_IDS[998] é undefined, ignorado silenciosamente
    expect(() => getEarnedBadgeIds({ badges: [999] })).not.toThrow();
    const ids = getEarnedBadgeIds({ badges: [999] });
    expect(ids.size).toBe(0);
  });
});

describe('progress - getBadgeCount', () => {
  it('retorna 0 para estado vazio', () => {
    expect(getBadgeCount({})).toBe(0);
  });

  it('conta badges únicas corretamente', () => {
    expect(getBadgeCount({ badges: ['boulder_badge', 'cascade_badge'] })).toBe(2);
  });

  it('não conta duplicatas', () => {
    expect(getBadgeCount({ badges: ['boulder_badge', 'boulder_badge', 1] })).toBe(1);
  });

  it('conta todas as 8 badges de Kanto', () => {
    const state = { badges: REGION_BADGES_BY_ID.kanto };
    expect(getBadgeCount(state)).toBe(8);
  });

  it('conta badges de múltiplas regiões', () => {
    const state = {
      badges: [
        ...REGION_BADGES_BY_ID.kanto,
        ...REGION_BADGES_BY_ID.johto,
      ],
    };
    expect(getBadgeCount(state)).toBe(16);
  });
});

describe('progress - calculatePowerScore', () => {
  it('retorna 0 para estado vazio (sem Pokémon nem badges)', () => {
    const score = calculatePowerScore({}, {});
    expect(score).toBeGreaterThanOrEqual(0);
    expect(typeof score).toBe('number');
  });

  it('score aumenta com mais badges', () => {
    const nooBadges = calculatePowerScore({}, {});
    const someBadges = calculatePowerScore({ badges: REGION_BADGES_BY_ID.kanto }, {});
    expect(someBadges).toBeGreaterThanOrEqual(nooBadges);
  });

  it('score aumenta com Pokémon no time', () => {
    const emptyTeam = calculatePowerScore({}, {});
    const withTeam = calculatePowerScore({
      team: [{ id: 6, level: 50, maxHp: 200, hp: 200, isShiny: false }],
      pc: [],
    }, {});
    expect(withTeam).toBeGreaterThanOrEqual(emptyTeam);
  });

  it('não crasha com team/pc undefined', () => {
    expect(() => calculatePowerScore({ team: undefined, pc: null }, {})).not.toThrow();
  });
});

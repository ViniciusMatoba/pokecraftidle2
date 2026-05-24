import { describe, it, expect } from 'vitest';
import {
  getCaptureRate,
  getPokemonRarity,
  RARITY_WEIGHTS,
  RARITY_CAPTURE_MULTIPLIER,
} from './pokemonDifficulty';

// Pokédex mínima para testes
const mockPokedex = {
  25:  { id: 25,  baseXp: 112 },  // Pikachu  → uncommon
  6:   { id: 6,   baseXp: 240 },  // Charizard → very_rare
  150: { id: 150, baseXp: 340 },  // Mewtwo    → legendary (também em LEGENDARY_IDS)
};

describe('pokemonDifficulty - getPokemonRarity', () => {
  it('usa rarity explícita se já definida na entry', () => {
    expect(getPokemonRarity({ rarity: 'common' }, {})).toBe('common');
    expect(getPokemonRarity({ rarity: 'legendary' }, {})).toBe('legendary');
  });

  it('classifica starters como super_rare', () => {
    expect(getPokemonRarity({ id: 1 }, {})).toBe('super_rare');  // Bulbasaur
    expect(getPokemonRarity({ id: 4 }, {})).toBe('super_rare');  // Charmander
    expect(getPokemonRarity({ id: 7 }, {})).toBe('super_rare');  // Squirtle
  });

  it('classifica lendários conhecidos como legendary', () => {
    expect(getPokemonRarity({ id: 150 }, {})).toBe('legendary'); // Mewtwo
    expect(getPokemonRarity({ id: 249 }, {})).toBe('legendary'); // Lugia
  });

  it('usa baseXp da Pokédex para classificar', () => {
    expect(getPokemonRarity({ id: 25 }, mockPokedex)).toBe('uncommon'); // baseXp=112
    expect(getPokemonRarity({ id: 6  }, mockPokedex)).toBe('very_rare'); // baseXp=240
  });

  it('fallback para common quando sem dados', () => {
    expect(getPokemonRarity({ id: 999 }, {})).toBe('common');
  });
});

describe('pokemonDifficulty - getCaptureRate', () => {
  it('retorna valor entre 0.01 e 0.95 sempre', () => {
    const rate = getCaptureRate({ id: 25, level: 10, hp: 50, maxHp: 100 }, 1, mockPokedex);
    expect(rate).toBeGreaterThanOrEqual(0.01);
    expect(rate).toBeLessThanOrEqual(0.95);
  });

  it('Pokémon com HP baixo tem taxa de captura maior', () => {
    const fullHp  = getCaptureRate({ id: 25, level: 10, hp: 100, maxHp: 100 }, 1, mockPokedex);
    const lowHp   = getCaptureRate({ id: 25, level: 10, hp: 1,   maxHp: 100 }, 1, mockPokedex);
    expect(lowHp).toBeGreaterThan(fullHp);
  });

  it('Ultra Bola (mult=2) aumenta a taxa de captura', () => {
    const pokeball   = getCaptureRate({ id: 25, level: 10, hp: 50, maxHp: 100 }, 1, mockPokedex);
    const ultraball  = getCaptureRate({ id: 25, level: 10, hp: 50, maxHp: 100 }, 2, mockPokedex);
    expect(ultraball).toBeGreaterThan(pokeball);
  });

  it('Pokémon de alto nível é mais difícil de capturar', () => {
    const lowLevel  = getCaptureRate({ id: 25, level: 5,  hp: 50, maxHp: 100 }, 1, mockPokedex);
    const highLevel = getCaptureRate({ id: 25, level: 60, hp: 50, maxHp: 100 }, 1, mockPokedex);
    expect(highLevel).toBeLessThan(lowLevel);
  });

  it('lendário tem taxa menor que Pokémon comum no mesmo HP', () => {
    const common    = getCaptureRate({ id: 25,  level: 10, hp: 1, maxHp: 100 }, 1, mockPokedex);
    const legendary = getCaptureRate({ id: 150, level: 10, hp: 1, maxHp: 100 }, 1, mockPokedex);
    expect(legendary).toBeLessThan(common);
  });

  it('hp=0 não causa divisão por zero (edge case)', () => {
    expect(() =>
      getCaptureRate({ id: 25, level: 10, hp: 0, maxHp: 0 }, 1, mockPokedex)
    ).not.toThrow();
    const rate = getCaptureRate({ id: 25, level: 10, hp: 0, maxHp: 0 }, 1, mockPokedex);
    expect(rate).toBeGreaterThanOrEqual(0.01);
  });

  it('ballMultiplier=0 não produz taxa negativa', () => {
    const rate = getCaptureRate({ id: 25, level: 10, hp: 50, maxHp: 100 }, 0, mockPokedex);
    expect(rate).toBeGreaterThanOrEqual(0.01);
  });

  it('level=1 (mínimo) não crasha', () => {
    expect(() =>
      getCaptureRate({ id: 25, level: 1, hp: 5, maxHp: 10 }, 1, mockPokedex)
    ).not.toThrow();
  });
});

describe('pokemonDifficulty - constantes', () => {
  it('RARITY_WEIGHTS tem valores positivos para todas as raridades', () => {
    Object.values(RARITY_WEIGHTS).forEach(w => expect(w).toBeGreaterThan(0));
  });

  it('RARITY_CAPTURE_MULTIPLIER decresce da comum para a lendária', () => {
    expect(RARITY_CAPTURE_MULTIPLIER.common).toBeGreaterThan(RARITY_CAPTURE_MULTIPLIER.legendary);
    expect(RARITY_CAPTURE_MULTIPLIER.uncommon).toBeGreaterThan(RARITY_CAPTURE_MULTIPLIER.legendary);
  });
});

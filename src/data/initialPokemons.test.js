import { describe, expect, it } from 'vitest';
import { INITIAL_POKEMONS } from './initialPokemons';
import { POKEDEX } from './pokedex';
import { calcBattleStat, calcHpStat } from '../utils/gameHelpers';

describe('INITIAL_POKEMONS', () => {
  it('mantem os cinco starters classicos', () => {
    expect(INITIAL_POKEMONS.map((pokemon) => pokemon.id)).toEqual([1, 4, 7, 25, 133]);
  });

  it.each(INITIAL_POKEMONS.map((pokemon) => [pokemon.name, pokemon]))(
    '%s usa a mesma formula do level-up',
    (_, pokemon) => {
      const base = POKEDEX[pokemon.id];

      expect(pokemon.maxHp).toBe(calcHpStat(base.hp, pokemon.level));
      expect(pokemon.hp).toBe(pokemon.maxHp);
      expect(pokemon.attack).toBe(calcBattleStat(base.attack, pokemon.level));
      expect(pokemon.defense).toBe(calcBattleStat(base.defense, pokemon.level));
      expect(pokemon.spAtk).toBe(calcBattleStat(base.spAtk, pokemon.level));
      expect(pokemon.spDef).toBe(calcBattleStat(base.spDef, pokemon.level));
      expect(pokemon.speed).toBe(calcBattleStat(base.speed, pokemon.level));
    },
  );

  it('nao reduz HP maximo do nivel 5 para o nivel 6', () => {
    for (const pokemon of INITIAL_POKEMONS) {
      const base = POKEDEX[pokemon.id];
      expect(calcHpStat(base.hp, 6)).toBeGreaterThanOrEqual(pokemon.maxHp);
    }
  });

  it('mantem golpes iniciais aprendidos sincronizados', () => {
    for (const pokemon of INITIAL_POKEMONS) {
      expect(pokemon.moves.length).toBeGreaterThanOrEqual(1);
      expect(pokemon.learnedMoves).toEqual(pokemon.moves);
    }
  });
});

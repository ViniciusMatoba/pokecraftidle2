import { describe, it, expect } from 'vitest';
import {
  isPokemonLegal,
  isPokemonAllowedInRegion,
  getPokemonRegion,
  REGION_ORDER,
  REGION_CHAMPION_FLAGS,
} from '../data/regionStandards';

describe('regionStandards - isPokemonLegal', () => {
  // ── Regra A: Pokémon da própria região ──────────────────────────────────────

  it('permite Pokémon da região ativa (por capturedRegion explícita)', () => {
    const pikachu = { id: 25, capturedRegion: 'kanto' };
    expect(isPokemonLegal(pikachu, 'kanto', [])).toBe(true);
  });

  it('permite Pokémon da região ativa (por detecção via Pokédex)', () => {
    // Pikachu ID 25 está no range Kanto (1-151)
    const pikachu = { id: 25 }; // sem capturedRegion
    expect(isPokemonLegal(pikachu, 'kanto', [])).toBe(true);
  });

  it('permite Pokémon Johto em Johto (por capturedRegion)', () => {
    const chikorita = { id: 152, capturedRegion: 'johto' };
    expect(isPokemonLegal(chikorita, 'johto', [])).toBe(true);
  });

  it('aceita ID puro (sem objeto) como entrada', () => {
    // Pikachu (25) na Kanto deve ser legal
    expect(isPokemonLegal(25, 'kanto', [])).toBe(true);
  });

  it('retorna false para entrada nula', () => {
    expect(isPokemonLegal(null, 'kanto', [])).toBe(false);
    expect(isPokemonLegal(undefined, 'kanto', [])).toBe(false);
  });

  // ── Regra B: campeão da região atual desbloqueia regiões ANTERIORES ─────────

  it('bloqueia Pokémon Kanto em Johto sem ser campeão de Johto', () => {
    const pikachu = { id: 25, capturedRegion: 'kanto' };
    expect(isPokemonLegal(pikachu, 'johto', [])).toBe(false);
  });

  it('permite Pokémon Kanto em Johto SE for campeão de Johto', () => {
    const pikachu = { id: 25, capturedRegion: 'kanto' };
    const flags = [REGION_CHAMPION_FLAGS.johto];
    expect(isPokemonLegal(pikachu, 'johto', flags)).toBe(true);
  });

  it('NÃO permite Pokémon de região futura mesmo sendo campeão', () => {
    // Torchic (255) é Hoenn; jogador em Johto sendo campeão de Johto não deve desbloquear Hoenn
    const torchic = { id: 255, capturedRegion: 'hoenn' };
    const flags = [REGION_CHAMPION_FLAGS.johto];
    expect(isPokemonLegal(torchic, 'johto', flags)).toBe(false);
  });

  it('bloqueia Pokémon de regiões futuras sem flag de campeão', () => {
    const mudkip = { id: 258, capturedRegion: 'hoenn' };
    expect(isPokemonLegal(mudkip, 'kanto', [])).toBe(false);
    expect(isPokemonLegal(mudkip, 'johto', [])).toBe(false);
  });

  // ── Pokémon sem capturedRegion (saves antigos) ──────────────────────────────

  it('detecta região corretamente para Pokémon sem capturedRegion (Kanto)', () => {
    const rattata = { id: 19 }; // Kanto
    expect(isPokemonLegal(rattata, 'kanto', [])).toBe(true);
    expect(isPokemonLegal(rattata, 'johto', [])).toBe(false);
  });

  it('detecta região corretamente para Pokémon sem capturedRegion (Johto)', () => {
    const cyndaquil = { id: 155 }; // Johto
    expect(isPokemonLegal(cyndaquil, 'johto', [])).toBe(true);
    expect(isPokemonLegal(cyndaquil, 'kanto', [])).toBe(false);
  });
});

describe('regionStandards - isPokemonAllowedInRegion', () => {
  it('permite Pokémon da região ativa e de regiões anteriores', () => {
    expect(isPokemonAllowedInRegion(25, 'kanto')).toBe(true);  // Pikachu em Kanto
    expect(isPokemonAllowedInRegion(25, 'johto')).toBe(true);  // Pikachu (Kanto) em Johto
  });

  it('bloqueia Pokémon de regiões futuras', () => {
    expect(isPokemonAllowedInRegion(152, 'kanto')).toBe(false); // Chikorita (Johto) em Kanto
  });

  it('retorna false para IDs inválidos (> 1025) — fix 1.6', () => {
    // Antes do fix 1.6: indexOf('future') = -1 ≤ qualquer índice → sempre true
    expect(isPokemonAllowedInRegion(99999, 'kanto')).toBe(false);
    expect(isPokemonAllowedInRegion(0, 'kanto')).toBe(false);
    expect(isPokemonAllowedInRegion(-1, 'kanto')).toBe(false);
  });
});

describe('regionStandards - getPokemonRegion', () => {
  it('retorna a região correta para IDs conhecidos', () => {
    expect(getPokemonRegion(1)).toBe('kanto');    // Bulbasaur
    expect(getPokemonRegion(152)).toBe('johto');  // Chikorita
    expect(getPokemonRegion(252)).toBe('hoenn');  // Treecko
    expect(getPokemonRegion(387)).toBe('sinnoh'); // Turtwig
  });

  it('retorna "future" para IDs fora do range (> 1025)', () => {
    expect(getPokemonRegion(9999)).toBe('future');
    expect(getPokemonRegion(0)).toBe('future');
  });

  it('REGION_ORDER está na sequência correta', () => {
    expect(REGION_ORDER[0]).toBe('kanto');
    expect(REGION_ORDER[1]).toBe('johto');
    expect(REGION_ORDER).toContain('paldea');
    expect(REGION_ORDER.indexOf('johto')).toBe(1);
    expect(REGION_ORDER.indexOf('hoenn')).toBe(2);
  });
});

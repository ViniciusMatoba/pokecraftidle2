import { describe, expect, it } from 'vitest';
import {
  getPokemonFormSpriteId,
  getPokemonSpriteFallbackUrl,
  getPokemonSpriteId,
  getPokemonSpriteUrl,
} from './pokemonSprites';

describe('pokemonSprites', () => {
  it('keeps base Kanto Rattata on sprite 19 even with stale regional sprite metadata', () => {
    const rattata = {
      id: 19,
      name: 'Rattata',
      formKey: 'rattata-alola',
      formSpriteId: 10091,
      capturedRegion: 'kanto',
    };

    expect(getPokemonFormSpriteId(rattata)).toBeNull();
    expect(getPokemonSpriteId(rattata)).toBe(19);
    expect(getPokemonSpriteUrl(rattata)).toContain('/19.png');
    expect(getPokemonSpriteFallbackUrl(rattata)).toContain('/19.png');
  });

  it('uses Alola Rattata sprite when the regional form is valid', () => {
    const rattataAlola = {
      id: 19,
      name: 'Rattata Alola',
      formKey: 'rattata-alola',
      formSpriteId: 10091,
      formRegion: 'alola',
      capturedRegion: 'alola',
      isRegionalForm: true,
    };

    expect(getPokemonFormSpriteId(rattataAlola)).toBe(10091);
    expect(getPokemonSpriteId(rattataAlola)).toBe(10091);
    expect(getPokemonSpriteUrl(rattataAlola)).toContain('/10091.png');
    expect(getPokemonSpriteFallbackUrl(rattataAlola)).toContain('/10091.png');
  });

  it('uses a local placeholder when a Pokemon id cannot be resolved', () => {
    expect(getPokemonSpriteUrl({})).toContain('/assets/fallbacks/pokemon.svg');
    expect(getPokemonSpriteFallbackUrl({})).toContain('/assets/fallbacks/pokemon.svg');
  });
});

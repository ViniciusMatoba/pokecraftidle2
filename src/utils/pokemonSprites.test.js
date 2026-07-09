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

  it('rejects mismatched regional markers across regions', () => {
    const vulpixKanto = {
      id: 37,
      name: 'Vulpix',
      formKey: 'vulpix-alola',
      formRegion: 'kanto',
      capturedRegion: 'kanto',
      formSpriteId: 10103,
    };

    const ponytaWrongRegion = {
      id: 77,
      name: 'Ponyta',
      formKey: 'ponyta-galar',
      formRegion: 'galar',
      capturedRegion: 'kanto',
      formSpriteId: 10181,
    };

    expect(getPokemonSpriteId(vulpixKanto)).toBe(37);
    expect(getPokemonSpriteUrl(vulpixKanto)).toContain('/37.png');
    expect(getPokemonSpriteId(ponytaWrongRegion)).toBe(77);
    expect(getPokemonSpriteUrl(ponytaWrongRegion)).toContain('/77.png');
  });

  it('keeps valid Galar and Hisui regional sprite ids', () => {
    const ponytaGalar = {
      id: 77,
      name: 'Ponyta Galar',
      formKey: 'ponyta-galar',
      formRegion: 'galar',
      capturedRegion: 'galar',
      isRegionalForm: true,
    };

    const growlitheHisui = {
      id: 58,
      name: 'Growlithe Hisui',
      formKey: 'growlithe-hisui',
      formRegion: 'hisui',
      capturedRegion: 'hisui',
      isRegionalForm: true,
    };

    expect(getPokemonSpriteId(ponytaGalar)).toBe(10181);
    expect(getPokemonSpriteUrl(ponytaGalar)).toContain('/10181.png');
    expect(getPokemonSpriteId(growlitheHisui)).toBe(10229);
    expect(getPokemonSpriteUrl(growlitheHisui)).toContain('/10229.png');
  });

  it('preserves regional sprite ids for shiny and back sprite URLs', () => {
    const vulpixAlola = {
      id: 37,
      name: 'Vulpix Alola',
      formKey: 'vulpix-alola',
      formRegion: 'alola',
      capturedRegion: 'alola',
      isRegionalForm: true,
      isShiny: true,
    };

    expect(getPokemonSpriteUrl(vulpixAlola)).toContain('/shiny/10103.png');
    expect(getPokemonSpriteUrl(vulpixAlola, { back: true })).toContain('/back/shiny/10103.png');
  });

  it('uses a local placeholder when a Pokemon id cannot be resolved', () => {
    expect(getPokemonSpriteUrl({})).toContain('/assets/fallbacks/pokemon.svg');
    expect(getPokemonSpriteFallbackUrl({})).toContain('/assets/fallbacks/pokemon.svg');
  });
});

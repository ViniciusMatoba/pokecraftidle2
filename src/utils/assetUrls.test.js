import { describe, expect, it } from 'vitest';
import {
  getItemSpriteFallbackUrl,
  getItemSpriteUrl,
  getLocalAssetUrl,
  getTrainerSpriteFallbackUrl,
  getTrainerSpriteUrl,
  getTypeIconUrl,
  LOCAL_ASSET_FALLBACKS,
} from './assetUrls';

describe('assetUrls', () => {
  it('builds PokeAPI item sprite URLs without duplicating extensions', () => {
    expect(getItemSpriteUrl('thunder-stone')).toContain('/items/thunder-stone.png');
    expect(getItemSpriteUrl('leaf-stone.png')).toContain('/items/leaf-stone.png');
  });

  it('prefers local item sprites for the selective UI pack', () => {
    expect(getItemSpriteUrl('ultra-ball')).toContain('/assets/items/ultra-ball.svg');
    expect(getItemSpriteUrl('poke-ball.png')).toContain('/assets/items/poke-ball.svg');
    expect(getItemSpriteUrl('nugget')).toContain('/assets/items/nugget.svg');
  });

  it('builds Pokemon Showdown trainer URLs with a safe fallback', () => {
    expect(getTrainerSpriteUrl('oak')).toContain('/trainers/oak.png');
    expect(getTrainerSpriteUrl('')).toContain('/trainers/red.png');
  });

  it('builds lowercase type icon URLs and keeps empty types blank', () => {
    expect(getTypeIconUrl('Fire')).toContain('/icons/fire.svg');
    expect(getTypeIconUrl('')).toBe('');
  });

  it('exposes local fallback assets for failed external images', () => {
    expect(getLocalAssetUrl('/assets/fallbacks/item.svg')).toContain('/assets/fallbacks/item.svg');
    expect(LOCAL_ASSET_FALLBACKS.pokemon).toContain('/assets/fallbacks/pokemon.svg');
    expect(getItemSpriteFallbackUrl('poke-ball')).toContain('/assets/fallbacks/poke-ball.svg');
    expect(getItemSpriteFallbackUrl('rare-candy')).toContain('/assets/fallbacks/item.svg');
    expect(getTrainerSpriteFallbackUrl()).toContain('/assets/fallbacks/trainer.svg');
  });
});

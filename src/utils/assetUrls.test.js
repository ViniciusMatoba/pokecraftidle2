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
    expect(getItemSpriteUrl('ultra-ball')).toContain('/items/ultra-ball.png');
    expect(getItemSpriteUrl('poke-ball.png')).toContain('/items/poke-ball.png');
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

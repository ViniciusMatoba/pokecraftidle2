import { describe, expect, it } from 'vitest';
import { getItemSpriteUrl, getTrainerSpriteUrl, getTypeIconUrl } from './assetUrls';

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
});


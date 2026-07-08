import { describe, expect, it } from 'vitest';
import { getSlotDocId } from './avatarSlots';

describe('avatarSlots', () => {
  it('mantem o slot 1 no docId legado do usuario', () => {
    expect(getSlotDocId('uid123', 1)).toBe('uid123');
  });

  it('separa slots extras no mesmo login por sufixo previsivel', () => {
    expect(getSlotDocId('uid123', 2)).toBe('uid123_s2');
    expect(getSlotDocId('uid123', 3)).toBe('uid123_s3');
  });
});

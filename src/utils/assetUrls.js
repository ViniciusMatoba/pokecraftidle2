export const POKEAPI_ITEM_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';
export const SHOWDOWN_TRAINER_BASE = 'https://play.pokemonshowdown.com/sprites/trainers';
export const TYPE_ICON_BASE = 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons';

export const getLocalAssetUrl = (path) => {
  const base = (import.meta.env.BASE_URL || './').replace(/\/$/, '');
  const normalizedPath = String(path || '').startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const LOCAL_ASSET_FALLBACKS = {
  item: getLocalAssetUrl('/assets/fallbacks/item.svg'),
  pokeBall: getLocalAssetUrl('/assets/fallbacks/poke-ball.svg'),
  pokemon: getLocalAssetUrl('/assets/fallbacks/pokemon.svg'),
  trainer: getLocalAssetUrl('/assets/fallbacks/trainer.svg'),
};

const normalizeFileName = (value, fallback = '') => {
  const text = String(value || fallback).trim();
  if (!text) return fallback;
  return text.endsWith('.png') || text.endsWith('.svg') || text.endsWith('.gif')
    ? text
    : `${text}.png`;
};

export const getItemSpriteUrl = (itemName, fallback = 'poke-ball') =>
  `${POKEAPI_ITEM_BASE}/${normalizeFileName(itemName, fallback)}`;

export const getItemSpriteFallbackUrl = (itemName) =>
  String(itemName || '').includes('ball') ? LOCAL_ASSET_FALLBACKS.pokeBall : LOCAL_ASSET_FALLBACKS.item;

export const getTrainerSpriteUrl = (trainerName, fallback = 'red') =>
  `${SHOWDOWN_TRAINER_BASE}/${normalizeFileName(trainerName, fallback)}`;

export const getTrainerSpriteFallbackUrl = () => LOCAL_ASSET_FALLBACKS.trainer;

export const getTypeIconUrl = (typeName) => {
  const type = String(typeName || '').trim().toLowerCase();
  return type ? `${TYPE_ICON_BASE}/${type}.svg` : '';
};

export const POKEAPI_ITEM_BASE = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items';
export const SHOWDOWN_TRAINER_BASE = 'https://play.pokemonshowdown.com/sprites/trainers';
export const TYPE_ICON_BASE = 'https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@master/icons';

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

export const LOCAL_ITEM_SPRITES = {
  'poke-ball': getLocalAssetUrl('/assets/items/poke-ball.svg'),
  'great-ball': getLocalAssetUrl('/assets/items/great-ball.svg'),
  'ultra-ball': getLocalAssetUrl('/assets/items/ultra-ball.svg'),
  'master-ball': getLocalAssetUrl('/assets/items/master-ball.svg'),
  nugget: getLocalAssetUrl('/assets/items/nugget.svg'),
  'town-map': getLocalAssetUrl('/assets/items/town-map.svg'),
  'vs-seeker': getLocalAssetUrl('/assets/items/vs-seeker.svg'),
  'full-restore': getLocalAssetUrl('/assets/items/full-restore.svg'),
  'star-piece': getLocalAssetUrl('/assets/items/star-piece.svg'),
  'hard-stone': getLocalAssetUrl('/assets/items/hard-stone.svg'),
  'rare-candy': getLocalAssetUrl('/assets/items/rare-candy.svg'),
  potion: getLocalAssetUrl('/assets/items/potion.svg'),
};

const normalizeFileName = (value, fallback = '') => {
  const text = String(value || fallback).trim();
  if (!text) return fallback;
  return text.endsWith('.png') || text.endsWith('.svg') || text.endsWith('.gif')
    ? text
    : `${text}.png`;
};

const normalizeItemKey = (itemName, fallback = 'poke-ball') =>
  normalizeFileName(itemName, fallback).replace(/\.(png|svg|gif)$/i, '');

export const getItemSpriteUrl = (itemName, fallback = 'poke-ball') => {
  const itemKey = normalizeItemKey(itemName, fallback);
  return LOCAL_ITEM_SPRITES[itemKey] || `${POKEAPI_ITEM_BASE}/${itemKey}.png`;
};

export const getItemSpriteFallbackUrl = (itemName) =>
  String(itemName || '').includes('ball') ? LOCAL_ASSET_FALLBACKS.pokeBall : LOCAL_ASSET_FALLBACKS.item;

export const getTrainerSpriteUrl = (trainerName, fallback = 'red') =>
  `${SHOWDOWN_TRAINER_BASE}/${normalizeFileName(trainerName, fallback)}`;

export const getTrainerSpriteFallbackUrl = () => LOCAL_ASSET_FALLBACKS.trainer;

export const getTypeIconUrl = (typeName) => {
  const type = String(typeName || '').trim().toLowerCase();
  return type ? `${TYPE_ICON_BASE}/${type}.svg` : '';
};

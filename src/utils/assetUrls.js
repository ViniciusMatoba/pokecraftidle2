export const POKEAPI_ITEM_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';
export const SHOWDOWN_TRAINER_BASE = 'https://play.pokemonshowdown.com/sprites/trainers';
export const TYPE_ICON_BASE = 'https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons';

const normalizeFileName = (value, fallback = '') => {
  const text = String(value || fallback).trim();
  if (!text) return fallback;
  return text.endsWith('.png') || text.endsWith('.svg') || text.endsWith('.gif')
    ? text
    : `${text}.png`;
};

export const getItemSpriteUrl = (itemName, fallback = 'poke-ball') =>
  `${POKEAPI_ITEM_BASE}/${normalizeFileName(itemName, fallback)}`;

export const getTrainerSpriteUrl = (trainerName, fallback = 'red') =>
  `${SHOWDOWN_TRAINER_BASE}/${normalizeFileName(trainerName, fallback)}`;

export const getTypeIconUrl = (typeName) => {
  const type = String(typeName || '').trim().toLowerCase();
  return type ? `${TYPE_ICON_BASE}/${type}.svg` : '';
};


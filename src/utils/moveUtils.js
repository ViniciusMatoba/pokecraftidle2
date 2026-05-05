import { MOVE_TRANSLATIONS } from '../data/translations';
import { MOVES } from '../data/moves';

/**
 * Normalizes move text for key lookups.
 * Removes accents, converts to lowercase, and replaces non-alphanumeric chars with hyphens.
 */
export const normalizeMoveText = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

// Pre-calculate lookups for performance
const moveTranslationLookup = Object.entries(MOVE_TRANSLATIONS).reduce((acc, [key, label]) => {
  acc[normalizeMoveText(label)] = key;
  return acc;
}, {});

const moveNameLookup = Object.entries(MOVES).reduce((acc, [key, move]) => {
  acc[normalizeMoveText(move.name)] = key;
  return acc;
}, {});

/**
 * Gets the canonical key for a move from the MOVES data object.
 */
export const getMoveKey = (move) => {
  if (!move) return '';
  const rawName = typeof move === 'string' ? move : move.name;
  const directKey = normalizeMoveText(rawName);
  
  // 1. Direct match in MOVES (e.g. 'tackle')
  if (MOVES[directKey]) return directKey;
  
  // 2. Translated label match (e.g. 'investida' -> 'tackle')
  if (moveTranslationLookup[directKey]) return moveTranslationLookup[directKey];
  
  // 3. Normalized name match (e.g. 'water-pulse' -> 'water-pulse')
  if (moveNameLookup[directKey]) return moveNameLookup[directKey];
  
  return directKey;
};

/**
 * Gets full move data combining static data and instance data.
 */
export const getMoveData = (move) => {
  const key = getMoveKey(move);
  const base = MOVES[key] || {};
  const fallback = typeof move === 'object' && move ? move : {};
  
  return {
    ...fallback,
    ...base,
    name: fallback.name || base.name || (typeof move === 'string' ? move : '')
  };
};

/**
 * Translates a move name if a translation exists.
 */
export const translateMove = (moveName) => {
  if (!moveName) return '---';
  const key = getMoveKey(moveName);
  return MOVE_TRANSLATIONS[key] || String(moveName).replace(/-/g, ' ');
};

/**
 * Gets the display label for a move.
 */
export const getMoveLabel = (move) => {
  const key = getMoveKey(move);
  const data = getMoveData(move);
  
  return MOVE_TRANSLATIONS[key] || data.name || translateMove(typeof move === 'string' ? move : move?.name);
};

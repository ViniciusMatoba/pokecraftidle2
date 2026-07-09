import { MOVES } from '../data/moves';
import { MOVE_TRANSLATIONS } from '../data/translations';
import { POKEDEX } from '../data/pokedex';

export const normalizeMoveKey = (move) => {
  const rawName = typeof move === 'string' ? move : move?.moveKey || move?.key || move?.move || move?.name;
  const normalized = String(rawName || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (MOVES[normalized]) return normalized;

  const translated = Object.entries(MOVE_TRANSLATIONS || {}).find(([, label]) => (
    String(label || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') === normalized
  ));
  if (translated) return translated[0];

  const english = Object.entries(MOVES || {}).find(([, data]) => (
    String(data?.name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') === normalized
  ));

  return english?.[0] || normalized;
};

export const getMoveKey = normalizeMoveKey;

export const buildMoveObject = (move) => {
  const key = normalizeMoveKey(move);
  const data = MOVES[key];
  if (!data) return null;
  return {
    ...data,
    moveKey: key,
    name: MOVE_TRANSLATIONS[key] || data.name || key,
  };
};

export const deduplicateMoves = (moves = []) => {
  const seen = new Map();
  moves.forEach((move) => {
    const key = normalizeMoveKey(move);
    if (key) seen.set(key, move);
  });
  return [...seen.values()];
};

export const getPokemonLearnset = (pokemonOrId, pokedex = POKEDEX) => {
  const pokemon = typeof pokemonOrId === 'object' && pokemonOrId !== null ? pokemonOrId : { id: pokemonOrId };
  const exact = pokedex[Number(pokemon.id)];
  if (Array.isArray(exact?.learnset) && exact.learnset.length > 0) return exact.learnset;

  const fallbackId = Number(pokemon.pokemonId || pokemon.baseId || pokemon.speciesId);
  const fallback = pokedex[fallbackId];
  if (Array.isArray(fallback?.learnset) && fallback.learnset.length > 0) return fallback.learnset;

  return [];
};

export const getMovesLearnedBetweenLevels = (pokemonOrId, fromLevel, toLevel, pokedex = POKEDEX) => {
  const start = Math.max(0, Number(fromLevel || 0));
  const end = Math.max(start, Number(toLevel || start));
  return getPokemonLearnset(pokemonOrId, pokedex)
    .filter((entry) => Number(entry.level) > start && Number(entry.level) <= end)
    .map((entry) => buildMoveObject(entry.move))
    .filter(Boolean);
};

export const getMovesAvailableAtLevel = (pokemonOrId, level, pokedex = POKEDEX) => {
  const targetLevel = Math.max(1, Number(level || 1));
  return getPokemonLearnset(pokemonOrId, pokedex)
    .filter((entry) => Number(entry.level) <= targetLevel)
    .map((entry) => buildMoveObject(entry.move))
    .filter(Boolean);
};

export const applyLearnedMovesForLevelRange = (pokemon, fromLevel, toLevel, options = {}) => {
  const activeLimit = Number(options.activeLimit || 4);
  const currentMoves = deduplicateMoves(pokemon?.moves || []);
  const currentLearned = deduplicateMoves(pokemon?.learnedMoves || currentMoves);
  const learnedNow = [];

  const nextMoves = [...currentMoves];
  const nextLearned = [...currentLearned];

  getMovesLearnedBetweenLevels(pokemon, fromLevel, toLevel, options.pokedex || POKEDEX).forEach((move) => {
    const key = normalizeMoveKey(move);
    if (nextLearned.some((known) => normalizeMoveKey(known) === key)) return;

    nextLearned.push(move);
    learnedNow.push(move);

    if (
      nextMoves.length < activeLimit &&
      !nextMoves.some((known) => normalizeMoveKey(known) === key)
    ) {
      nextMoves.push(move);
    }
  });

  return {
    moves: deduplicateMoves(nextMoves).slice(0, activeLimit),
    learnedMoves: deduplicateMoves(nextLearned),
    learnedNow,
  };
};

export const rebuildMovesForLevel = (pokemon, level, options = {}) => {
  const activeLimit = Number(options.activeLimit || 4);
  const available = deduplicateMoves(getMovesAvailableAtLevel(pokemon, level, options.pokedex || POKEDEX));
  const fallback = buildMoveObject('tackle') || { name: 'Tackle', power: 40, type: 'Normal', category: 'Physical' };
  const learnedMoves = available.length > 0 ? available : [fallback];
  return {
    moves: learnedMoves.slice(-activeLimit),
    learnedMoves,
  };
};

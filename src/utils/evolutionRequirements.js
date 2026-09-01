// ── REQUISITO DE CANDY NA EVOLUÇÃO (estilo Pokémon GO) ─────────────────────
// Modelo ADITIVO: a candy é exigida POR CIMA dos requisitos padrões
// (nível / pedra / tempo / região). O custo escala por estágio de evolução
// multiplicado pela raridade da família (reaproveita o classificador de raridade).

import { getPokemonRarity, getEvolutionStage } from './pokemonDifficulty';
import { POKEMON_TO_CANDY, CANDY_FAMILIES } from '../data/candies';

// Custo base pelo destino da evolução.
export const EVO_STAGE_BASE_COST = {
  toMid: 25,        // evoluir para forma intermediária (linha de 3 estágios)
  toFinalFrom2: 50, // linha de 2 estágios: base → final direto
  toFinalFrom3: 100,// linha de 3 estágios: intermediária → final
  fallback: 40,     // casos atípicos (evolução para forma "solo", ramificações)
};

// Multiplicador pela raridade da forma de destino.
export const EVO_RARITY_COST_MULT = {
  common: 1,
  uncommon: 1,
  rare: 1.5,
  very_rare: 2,
  super_rare: 3,
  legendary: 5,
};

// Quantas candies custa uma evolução específica. 0 = sem custo (ex.: sem família).
export const getEvolutionCandyCost = (pokemon = {}, evo = {}, pokedex = {}) => {
  if (!evo || evo.id === undefined || evo.id === null) return 0;

  const srcStage = getEvolutionStage(pokemon.id, pokedex);
  const tgtStage = getEvolutionStage(evo.id, pokedex);

  let base;
  if (tgtStage === 'mid') base = EVO_STAGE_BASE_COST.toMid;
  else if (tgtStage === 'final') {
    base = srcStage === 'base' ? EVO_STAGE_BASE_COST.toFinalFrom2 : EVO_STAGE_BASE_COST.toFinalFrom3;
  } else base = EVO_STAGE_BASE_COST.fallback;

  const rarity = getPokemonRarity({ id: evo.id }, pokedex);
  const mult = EVO_RARITY_COST_MULT[rarity] || 1;

  const cost = Math.round((base * mult) / 5) * 5; // múltiplo de 5, mais legível
  return Math.max(5, cost);
};

// Resolve a família de candy da evolução (fonte ou destino compartilham a família).
export const getEvolutionCandyId = (pokemon = {}, evo = {}) =>
  POKEMON_TO_CANDY[Number(pokemon?.id)] ?? POKEMON_TO_CANDY[Number(evo?.id)] ?? null;

// Info completa pra UI + gating: { candyId, cost, have, met, family, name, spriteId }.
export const getEvolutionCandyInfo = (pokemon = {}, evo = {}, inventory = {}, pokedex = {}) => {
  const candyId = getEvolutionCandyId(pokemon, evo);
  const cost = getEvolutionCandyCost(pokemon, evo, pokedex);
  const have = candyId ? (inventory?.candies?.[candyId] || 0) : 0;
  const family = candyId ? CANDY_FAMILIES[candyId] : null;
  // Sem família mapeada → não bloqueia (met = true), evita travar evoluções sem candy.
  const met = !candyId || cost === 0 || have >= cost;
  return {
    candyId,
    cost,
    have,
    met,
    family,
    name: family?.name || null,
    spriteId: family?.spriteId ?? null,
  };
};

import { POKEDEX } from '../data/pokedex';

export const getMasteryPath = (pokemonId) => {
  const p = POKEDEX[pokemonId];
  if (!p) return { abilities: [], rareMoves: [], hiddenAbility: null };
  return {
    abilities: [
      { level: 5, name: p.abilities?.[0] || 'Adaptability' },
      { level: 15, name: p.abilities?.[1] || 'Inner Focus' }
    ],
    rareMoves: [
      { level: 10, name: 'Slash' },
      { level: 25, name: 'Aura Sphere' }
    ],
    hiddenAbility: { level: 50, name: 'Protean' }
  };
};

export const getEffectiveStat = (pokemon, stat) => {
  // Se o pokémon já tem o status calculado (ex: no time do jogador), usa ele.
  // Caso contrário, tenta calcular (fallback para NPCs/Enemies simples).
  if (pokemon[stat] !== undefined) return Math.ceil(pokemon[stat]);
  
  const base = (pokemon.baseStats ? pokemon.baseStats[stat] : pokemon[stat]) || 10;
  const level = pokemon.level || 5;
  return Math.ceil((base * level) / 50) + 5;
};

// Multiplicador de stats baseado no nível de shiny stacking
// shinyCount = 1 → 1.20x | cada +1 adiciona +0.05x | máximo: shinyCount 10 = 1.65x
export const getShinyMult = (pokemon) => {
  if (!pokemon?.isShiny) return 1.0;
  const count = Math.min(pokemon.shinyCount || 1, 10); // cap em 10
  return 1.2 + Math.max(0, count - 1) * 0.05;
};

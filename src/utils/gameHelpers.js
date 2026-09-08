import { POKEDEX } from '../data/pokedex';
import { POKEMON_TO_CANDY } from '../data/candies';

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

// IVs (0–31): força extra ganha ao capturar Pokémon da mesma família evolutiva.
// Multiplicador de stats aplicado no uso: +0,5% por ponto (cap +15,5% em 31).
export const IV_MAX = 31;
export const getIvMult = (pokemon) => 1 + Math.min(IV_MAX, Math.max(0, pokemon?.ivBonus || 0)) * 0.005;

export const getEffectiveStat = (pokemon, stat) => {
  const ivMult = getIvMult(pokemon);
  // Se o pokémon já tem o status calculado (ex: no time do jogador), usa ele.
  // Caso contrário, tenta calcular (fallback para NPCs/Enemies simples).
  if (pokemon[stat] !== undefined) return Math.ceil(pokemon[stat] * ivMult);

  const base = (pokemon.baseStats ? pokemon.baseStats[stat] : pokemon[stat]) || 10;
  const level = pokemon.level || 5;
  return Math.ceil(((base * level) / 50 + 5) * ivMult);
};

// Ganho de IV por família: ao capturar um Pokémon, há chance de reforçar UM
// Pokémon já possuído da MESMA família evolutiva (mesma família de candy),
// concentrando a força no que já tem mais IV. Retorna { list, gained }.
export const IV_GAIN_CHANCE = 0.35;
export const applyFamilyIvGain = (list = [], capturedId, chance = IV_GAIN_CHANCE) => {
  const fam = POKEMON_TO_CANDY[Number(capturedId)];
  if (!fam) return { list, gained: null };
  const members = list
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => POKEMON_TO_CANDY[Number(p.id)] === fam && (p.ivBonus || 0) < IV_MAX);
  if (members.length === 0 || Math.random() >= chance) return { list, gained: null };
  members.sort((a, b) => (b.p.ivBonus || 0) - (a.p.ivBonus || 0));
  const target = members[0];
  const amount = 1 + Math.floor(Math.random() * 3); // +1..3
  const total = Math.min(IV_MAX, (target.p.ivBonus || 0) + amount);
  const newList = list.map((p, i) => (i === target.i ? { ...p, ivBonus: total } : p));
  return { list: newList, gained: { name: target.p.name, amount: total - (target.p.ivBonus || 0), total } };
};

// Multiplicador de stats baseado no nível de shiny stacking
// shinyCount = 1 → 1.20x | cada +1 adiciona +0.05x | máximo: shinyCount 10 = 1.65x
export const getShinyMult = (pokemon) => {
  if (!pokemon?.isShiny) return 1.0;
  const count = Math.min(pokemon.shinyCount || 1, 10); // cap em 10
  return 1.2 + Math.max(0, count - 1) * 0.05;
};

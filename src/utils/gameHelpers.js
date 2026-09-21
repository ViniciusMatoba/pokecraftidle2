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

// ===== IVs (0–31 por stat) =====
// Modelo de 6 IVs (hp, attack, defense, spAtk, spDef, speed). Cada ponto dá
// +0,5% no stat correspondente (cap +15,5% em 31). Ter muitos IVs perfeitos (31)
// é RARO — como shiny/alpha — e vira raridade/valor de coleção.
// Compatível com o legado (um único `ivBonus`), sem migração destrutiva.
export const IV_MAX = 31;
export const IV_STATS = ['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed'];
// chance de cada IV nascer perfeito -> distribuição de "nº de perfeitos" cai
// forte a cada +1 (6 perfeitos ~ 1 em 1 milhão, no nível shiny).
export const PERFECT_IV_CHANCE = 0.10;

const rollOneIv = () => (Math.random() < PERFECT_IV_CHANCE ? 31 : Math.floor(Math.random() * 31));
export const rollIvs = () => {
  const ivs = {};
  for (const k of IV_STATS) ivs[k] = rollOneIv();
  return ivs;
};

// nº de IVs perfeitos (0..6) — suporta 6 IVs e o legado ivBonus.
export const getPerfectIvCount = (pokemon = {}) => {
  if (pokemon?.ivs) return IV_STATS.reduce((n, k) => n + (Number(pokemon.ivs[k]) === 31 ? 1 : 0), 0);
  return Number(pokemon?.ivBonus) === 31 ? 1 : 0;
};

// Ranking de IV para o card (por nº de perfeitos).
export const IV_RANKS = [
  { min: 6, label: 'Perfeito', stars: 6, color: '#f59e0b' },
  { min: 5, label: 'Excelente', stars: 5, color: '#a855f7' },
  { min: 4, label: 'Ótimo', stars: 4, color: '#3b82f6' },
  { min: 2, label: 'Bom', stars: 3, color: '#22c55e' },
  { min: 1, label: 'Razoável', stars: 2, color: '#94a3b8' },
  { min: 0, label: 'Comum', stars: 1, color: '#64748b' },
];
export const getIvRank = (pokemon = {}) => {
  const count = getPerfectIvCount(pokemon);
  const r = IV_RANKS.find((x) => count >= x.min) || IV_RANKS[IV_RANKS.length - 1];
  return { ...r, count };
};

// Multiplicador por stat: usa o IV daquele stat (novo modelo) ou o ivBonus (legado).
export const getStatIvMult = (pokemon, stat) => {
  const iv = pokemon?.ivs && pokemon.ivs[stat] !== undefined ? Number(pokemon.ivs[stat]) : (pokemon?.ivBonus || 0);
  return 1 + Math.min(IV_MAX, Math.max(0, iv)) * 0.005;
};
// Mantido por compatibilidade (média dos 6, ou o ivBonus legado).
export const getIvMult = (pokemon) => {
  if (pokemon?.ivs) {
    const avg = IV_STATS.reduce((s, k) => s + (Number(pokemon.ivs[k]) || 0), 0) / IV_STATS.length;
    return 1 + Math.min(IV_MAX, avg) * 0.005;
  }
  return 1 + Math.min(IV_MAX, Math.max(0, pokemon?.ivBonus || 0)) * 0.005;
};

export const getEffectiveStat = (pokemon, stat) => {
  const ivMult = getStatIvMult(pokemon, stat);
  // Se o pokémon já tem o status calculado (ex: no time do jogador), usa ele.
  // Caso contrário, tenta calcular (fallback para NPCs/Enemies simples).
  if (pokemon[stat] !== undefined) return Math.ceil(pokemon[stat] * ivMult);

  const base = (pokemon.baseStats ? pokemon.baseStats[stat] : pokemon[stat]) || 10;
  const level = pokemon.level || 5;
  return Math.ceil(((base * level) / 50 + 5) * ivMult);
};

// Ganho de IV por família: ao capturar, há chance de reforçar UM Pokémon já
// possuído da MESMA família (candy), subindo um IV imperfeito. Retorna { list, gained }.
export const IV_GAIN_CHANCE = 0.35;
export const applyFamilyIvGain = (list = [], capturedId, chance = IV_GAIN_CHANCE) => {
  const fam = POKEMON_TO_CANDY[Number(capturedId)];
  if (!fam) return { list, gained: null };
  const members = list
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => POKEMON_TO_CANDY[Number(p.id)] === fam && getPerfectIvCount(p) < 6);
  if (members.length === 0 || Math.random() >= chance) return { list, gained: null };
  // concentra no que já é mais forte (mais perfeitos)
  members.sort((a, b) => getPerfectIvCount(b.p) - getPerfectIvCount(a.p));
  const target = members[0];
  const p = target.p;
  const amount = 1 + Math.floor(Math.random() * 3); // +1..3 pontos

  if (p.ivs) {
    // sobe um stat imperfeito escolhido ao acaso
    const imperfect = IV_STATS.filter((k) => (Number(p.ivs[k]) || 0) < IV_MAX);
    if (imperfect.length === 0) return { list, gained: null };
    const stat = imperfect[Math.floor(Math.random() * imperfect.length)];
    const before = Number(p.ivs[stat]) || 0;
    const after = Math.min(IV_MAX, before + amount);
    const newIvs = { ...p.ivs, [stat]: after };
    const newList = list.map((q, i) => (i === target.i ? { ...q, ivs: newIvs } : q));
    return { list: newList, gained: { name: p.name, stat, amount: after - before, total: after } };
  }
  // legado: sobe o ivBonus único
  const before = p.ivBonus || 0;
  const after = Math.min(IV_MAX, before + amount);
  const newList = list.map((q, i) => (i === target.i ? { ...q, ivBonus: after } : q));
  return { list: newList, gained: { name: p.name, amount: after - before, total: after } };
};

// Multiplicador de stats baseado no nível de shiny stacking
// shinyCount = 1 → 1.20x | cada +1 adiciona +0.05x | máximo: shinyCount 10 = 1.65x
export const getShinyMult = (pokemon) => {
  if (!pokemon?.isShiny) return 1.0;
  const count = Math.min(pokemon.shinyCount || 1, 10); // cap em 10
  return 1.2 + Math.max(0, count - 1) * 0.05;
};

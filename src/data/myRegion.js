/**
 * myRegion.js — Sistema de Região Personalizada do Jogador
 *
 * Cada jogador pode construir sua própria região de desafio:
 *  - Até 8 ginásios
 *  - Até 4 membros da Elite Four
 *  - 1 Campeão
 *
 * Tudo é comprado na Loja de Prestígio e configurado no Construtor de Região.
 * Amigos podem desafiar a região publicada.
 */

// ── Custos de compra (progressivos e sequenciais) ────────────────────────────
/** Custo de cada slot de ginásio (índice 0 = 1º ginásio) */
export const GYM_SLOT_COSTS = [
  5_000,   // Ginásio 1
  12_000,  // Ginásio 2
  20_000,  // Ginásio 3
  35_000,  // Ginásio 4
  50_000,  // Ginásio 5
  75_000,  // Ginásio 6
  100_000, // Ginásio 7
  150_000, // Ginásio 8
];

/** Custo de cada slot da Elite Four (índice 0 = 1º membro) */
export const ELITE_SLOT_COSTS = [
  60_000,  // Elite 1
  80_000,  // Elite 2
  100_000, // Elite 3
  120_000, // Elite 4
];

/** Custo do slot de Campeão */
export const CHAMPION_SLOT_COST = 200_000;

// ── Progressão de níveis por slot ────────────────────────────────────────────
/** Nível fixo dos Pokémon em cada ginásio (índice 0 = ginásio 1) */
export const GYM_SLOT_LEVELS = [14, 24, 34, 44, 54, 64, 74, 84];

/** Nível dos membros da Elite Four (índice 0 = Elite 1) */
export const ELITE_SLOT_LEVELS = [88, 90, 92, 94];

/** Nível do Campeão */
export const CHAMPION_LEVEL = 98;

/** Retorna o nível de combate para um slot específico */
export const getSlotLevel = (slotType, slotIndex = 0, slotData = null) => {
  if (slotData?.customLevel) return slotData.customLevel;

  if (slotType === 'gym')      return GYM_SLOT_LEVELS[slotIndex] ?? 14;
  if (slotType === 'elite')    return ELITE_SLOT_LEVELS[slotIndex] ?? 88;
  if (slotType === 'champion') return CHAMPION_LEVEL;
  return 50;
};

// ── Tipos de ginásio (todos os 18 tipos Pokémon) ─────────────────────────────
export const TYPE_ICON_URL = (type) =>
  `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${String(type || 'normal').toLowerCase()}.svg`;

export const REGION_GYM_TYPES = {
  normal:   { id: 'normal',   name: 'Normal',   color: '#9ea0aa', icon: TYPE_ICON_URL('normal') },
  fire:     { id: 'fire',     name: 'Fogo',     color: '#ef4444', icon: TYPE_ICON_URL('fire') },
  water:    { id: 'water',    name: 'Água',     color: '#3391d4', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png' },
  grass:    { id: 'grass',    name: 'Planta',   color: '#38bf4f', icon: TYPE_ICON_URL('grass') },
  electric: { id: 'electric', name: 'Elétrico', color: '#fbd100', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png' },
  ice:      { id: 'ice',      name: 'Gelo',     color: '#70cbd4', icon: TYPE_ICON_URL('ice') },
  fighting: { id: 'fighting', name: 'Lutador',  color: '#e0306a', icon: TYPE_ICON_URL('fighting') },
  poison:   { id: 'poison',   name: 'Veneno',   color: '#b567ce', icon: TYPE_ICON_URL('poison') },
  ground:   { id: 'ground',   name: 'Terra',    color: '#e87236', icon: TYPE_ICON_URL('ground') },
  flying:   { id: 'flying',   name: 'Voador',   color: '#89aae3', icon: TYPE_ICON_URL('flying') },
  psychic:  { id: 'psychic',  name: 'Psíquico', color: '#ff6675', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/twisted-spoon.png' },
  bug:      { id: 'bug',      name: 'Inseto',   color: '#83c300', icon: TYPE_ICON_URL('bug') },
  rock:     { id: 'rock',     name: 'Pedra',    color: '#c9bb8a', icon: TYPE_ICON_URL('rock') },
  ghost:    { id: 'ghost',    name: 'Fantasma', color: '#4c6ab2', icon: TYPE_ICON_URL('ghost') },
  dragon:   { id: 'dragon',   name: 'Dragão',   color: '#006fc9', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-fang.png' },
  dark:     { id: 'dark',     name: 'Sombrio',  color: '#5b5466', icon: TYPE_ICON_URL('dark') },
  steel:    { id: 'steel',    name: 'Aço',      color: '#5a8ea2', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png' },
  fairy:    { id: 'fairy',    name: 'Fada',     color: '#fb89eb', icon: TYPE_ICON_URL('fairy') },
  mixed:    { id: 'mixed',    name: 'Misto',    color: '#f59e0b', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-charm.png' },
};

Object.values(REGION_GYM_TYPES).forEach((type) => {
  if (type.id !== 'mixed') type.icon = TYPE_ICON_URL(type.id);
});

export const REGION_CARD_STYLES = [
  { id: 'classic', name: 'Classico', color: '#2563eb', preview: 'linear-gradient(135deg,#1d4ed8,#0f172a)' },
  { id: 'league', name: 'Liga', color: '#f59e0b', preview: 'linear-gradient(135deg,#f59e0b,#7c2d12)' },
  { id: 'gym_dark', name: 'Arena Noturna', color: '#7c3aed', preview: 'linear-gradient(135deg,#312e81,#111827)' },
  { id: 'nature', name: 'Jardim', color: '#16a34a', preview: 'linear-gradient(135deg,#16a34a,#064e3b)' },
  { id: 'tech', name: 'Tecnologico', color: '#06b6d4', preview: 'linear-gradient(135deg,#0891b2,#0f172a)' },
];

export const REGION_BATTLE_BACKGROUNDS = [
  { id: '/bg_gym_1776863824590.webp', name: 'Ginasio Classico' },
  { id: '/bg_gym_water.webp', name: 'Arena Aquatica' },
  { id: '/bg_gym_electric.webp', name: 'Arena Eletrica' },
  { id: '/bg_sinnoh_gym.webp', name: 'Ginasio Sinnoh' },
  { id: '/bg_johto_league.webp', name: 'Liga Johto' },
  { id: '/bg_sinnoh_league.webp', name: 'Liga Sinnoh' },
  { id: '/bg_elite_four.webp', name: 'Elite Four' },
  { id: '/bg_mt_coronet.webp', name: 'Montanha' },
];

// ── Estado padrão de um slot de ginásio ─────────────────────────────────────
export const defaultGymSlot = (slot) => ({
  slot,
  bannerId:     'normal',   // tipo do ginásio
  leaderName:   '',
  leaderSprite: 'red',
  team:         [],         // array de IDs de Pokémon (max 6)
  configured:   false,
  customLevel:  GYM_SLOT_LEVELS[slot - 1] || 14,
  cardStyle: 'classic',
  battleBackground: '/bg_gym_1776863824590.webp',
});

export const defaultEliteSlot = (slot) => ({
  slot,
  leaderName:   '',
  leaderSprite: 'lorelei',
  team:         [],
  configured:   false,
  customLevel:  ELITE_SLOT_LEVELS[slot - 1] || 88,
});

export const defaultChampion = () => ({
  leaderName:   '',
  leaderSprite: 'red',
  team:         [],
  configured:   false,
  customLevel:  CHAMPION_LEVEL,
});

// ── Estado padrão de myRegion no gameState ────────────────────────────────────
export const DEFAULT_MY_REGION = {
  regionName:    '',         // nome personalizado da região
  gymSlots:      0,          // slots de ginásio comprados (0-8)
  eliteSlots:    0,          // slots da elite comprados (0-4)
  championSlot:  false,      // slot do campeão comprado
  gyms:          [],         // array de configs de ginásio (length <= gymSlots)
  eliteFour:     [],         // array de configs da elite (length <= eliteSlots)
  champion:      null,       // config do campeão (null se não comprado)
  published:     false,      // se outros jogadores podem desafiar
  lastPublishedAt: null,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Retorna os slots de ginásio configurados (preenche os faltantes com defaults) */
export const getGymSlots = (myRegion) => {
  const count = myRegion?.gymSlots || 0;
  return Array.from({ length: count }, (_, i) => {
    const existing = (myRegion?.gyms || []).find(g => g.slot === i + 1);
    return existing || defaultGymSlot(i + 1);
  });
};

/** Retorna os slots da elite (preenche os faltantes com defaults) */
export const getEliteSlots = (myRegion) => {
  const count = myRegion?.eliteSlots || 0;
  return Array.from({ length: count }, (_, i) => {
    const existing = (myRegion?.eliteFour || []).find(e => e.slot === i + 1);
    return existing || defaultEliteSlot(i + 1);
  });
};

/**
 * Verifica se a região está configurada o suficiente para publicar.
 * Mínimo: pelo menos 1 ginásio configurado.
 */
export const isRegionReadyToPublish = (myRegion) => {
  if (!myRegion || myRegion.gymSlots === 0) return false;
  const gyms = getGymSlots(myRegion);
  return gyms.some(g => g.configured && g.team.length > 0);
};

/** Conta quantos Pokémon TOTAIS estão na região */
export const countRegionPokemon = (myRegion) => {
  let count = 0;
  (myRegion?.gyms      || []).forEach(g => { count += g.team.length; });
  (myRegion?.eliteFour || []).forEach(e => { count += e.team.length; });
  if (myRegion?.champion) count += (myRegion.champion.team || []).length;
  return count;
};

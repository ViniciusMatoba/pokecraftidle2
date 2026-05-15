/**
 * regionBattle.js — Utilitários para o Sistema de Batalha de Região
 *
 * Constrói os Pokémon dos líderes de ginásio / Elite / Campeão
 * usando as equipes configuradas pelo dono da região no RegionBuilderScreen.
 *
 * Fórmula de HP: floor((base*2*level)/100) + level + 10
 * Demais stats: floor((base*2*level)/100) + 5
 */

import { GYM_SLOT_LEVELS, ELITE_SLOT_LEVELS, CHAMPION_LEVEL } from '../data/myRegion';

/**
 * Retorna o nível de batalha correto para um slot.
 */
export const getSlotLevel = (slotType, slotIndex = 0, slotData = null) => {
  if (slotData?.customLevel) return slotData.customLevel;
  if (slotType === 'gym')      return GYM_SLOT_LEVELS[slotIndex] ?? 14;
  if (slotType === 'elite')    return ELITE_SLOT_LEVELS[slotIndex] ?? 88;
  if (slotType === 'champion') return CHAMPION_LEVEL;
  return 50;
};

/**
 * Constrói um Pokémon de combate a partir de um ID e nível,
 * consultando o POKEDEX para pegar os stats base.
 */
export const buildLeaderPokemon = (pokemonId, level, POKEDEX) => {
  const base = POKEDEX[pokemonId];
  if (!base) return null;

  const calcStat = (baseStat) => Math.floor((baseStat * 2 * level) / 100) + 5;
  const calcHP   = (baseStat) => Math.floor((baseStat * 2 * level) / 100) + level + 10;

  const hp = calcHP(base.baseHP ?? base.hp ?? 45);

  return {
    id:          pokemonId,
    name:        base.name || `#${pokemonId}`,
    types:       base.types || ['normal'],
    level,
    currentHP:   hp,
    maxHP:       hp,
    attack:      calcStat(base.baseAttack  ?? base.attack  ?? 45),
    defense:     calcStat(base.baseDefense ?? base.defense ?? 45),
    spAttack:    calcStat(base.baseSpAtk   ?? base.spAttack ?? 45),
    spDefense:   calcStat(base.baseSpDef   ?? base.spDefense ?? 45),
    speed:       calcStat(base.baseSpeed   ?? base.speed   ?? 45),
    moves:       (base.moves || []).slice(0, 4),
    isShiny:     false,
    isEnemy:     true,
    // Campos de compatibilidade com BattleScreen
    pokemonName: base.name || `#${pokemonId}`,
    baseHP:      base.baseHP ?? base.hp ?? 45,
    baseAttack:  base.baseAttack  ?? base.attack  ?? 45,
    baseDefense: base.baseDefense ?? base.defense ?? 45,
    baseSpAtk:   base.baseSpAtk   ?? base.spAttack ?? 45,
    baseSpDef:   base.baseSpDef   ?? base.spDefense ?? 45,
    baseSpeed:   base.baseSpeed   ?? base.speed   ?? 45,
  };
};

/**
 * Constrói a equipe completa de um slot (ginásio / elite / campeão).
 * Filtra IDs inválidos e retorna array de Pokémon prontos para combate.
 */
export const buildLeaderTeam = (slot, slotType, slotIndex, POKEDEX) => {
  if (!slot || !slot.team || !Array.isArray(slot.team)) return [];
  const level = getSlotLevel(slotType, slotIndex, slot);
  return slot.team
    .filter(id => id && POKEDEX[id])
    .map(id => buildLeaderPokemon(id, level, POKEDEX))
    .filter(Boolean);
};

/**
 * Retorna todos os slots de batalha de uma região em ordem:
 * ginásios (0-7) → elite (0-3) → campeão
 * Inclui apenas slots desbloqueados e com time válido.
 */
export const buildRegionBattleOrder = (region, POKEDEX) => {
  const battles = [];

  // Ginásios
  const gymSlots = region.gymSlots || 0;
  for (let i = 0; i < gymSlots; i++) {
    const slot = region.gyms?.[i];
    if (!slot) continue;
    const team = buildLeaderTeam(slot, 'gym', i, POKEDEX);
    if (team.length === 0) continue;
    battles.push({
      type:       'gym',
      index:      i,
      slotIndex:  i,
      name:       slot.leaderName || `Líder ${i + 1}`,
      gymType:    slot.bannerId || slot.gymType || 'normal',
      cardStyle:  slot.cardStyle || 'classic',
      background: slot.battleBackground ? `url('${slot.battleBackground}') center/cover no-repeat` : undefined,
      team,
      level:      getSlotLevel('gym', i, slot),
    });
  }

  // Elite Four
  const eliteSlots = region.eliteSlots || 0;
  for (let i = 0; i < eliteSlots; i++) {
    const slot = region.elite?.[i];
    if (!slot) continue;
    const team = buildLeaderTeam(slot, 'elite', i, POKEDEX);
    if (team.length === 0) continue;
    battles.push({
      type:      'elite',
      index:     i,
      slotIndex: i,
      name:      slot.leaderName || `Elite ${i + 1}`,
      gymType:   slot.gymType || 'mixed',
      team,
      level:     getSlotLevel('elite', i, slot),
    });
  }

  // Campeão
  if (region.championSlot) {
    const slot = region.champion;
    if (slot) {
      const team = buildLeaderTeam(slot, 'champion', 0, POKEDEX);
      if (team.length > 0) {
        battles.push({
          type:      'champion',
          index:     0,
          slotIndex: 0,
          name:      slot.leaderName || 'Campeão',
          gymType:   slot.gymType || 'mixed',
          team,
          level:     getSlotLevel('champion', 0, slot),
        });
      }
    }
  }

  return battles;
};

import { DEFAULT_GAME_STATE } from '../data/constants';
import { REGION_BADGE_IDS, REGION_CHAMPION_FLAGS, REGION_ORDER, REGION_START_FLAGS, getPokemonRegion } from '../data/regionStandards';
import { getEarnedBadgeIds } from './progress';
import { POKEDEX } from '../data/pokedex';
import { REGIONAL_FORM_METADATA } from '../data/regionalForms';

// Garante que todo Pokémon salvo tenha o array `types` populado corretamente.
// Formas regionais usam os tipos da forma, não os do Pokédex base.
// Ex: Ninetales-Alola (id=38, formKey='ninetales-alola') → ['Ice','Fairy'], não ['Fire'].
const fixPokemonTypes = (poke) => {
  if (!poke || typeof poke !== 'object') return poke;

  // Formas regionais: tipos próprios têm prioridade sobre o Pokédex base
  if (poke.formKey) {
    const regionalMeta = REGIONAL_FORM_METADATA[poke.formKey];
    if (regionalMeta?.types?.length > 0) {
      const rTypes = regionalMeta.types;
      if (Array.isArray(poke.types) && poke.types.length === rTypes.length && poke.types.every((t, i) => t === rTypes[i])) return poke;
      return { ...poke, types: rTypes };
    }
  }

  const entry = POKEDEX[Number(poke.id)];
  if (!entry) return poke; // ID desconhecido, mantém o que tem
  const types = (Array.isArray(entry.types) && entry.types.length > 0)
    ? entry.types
    : (entry.type ? [entry.type] : (poke.type ? [poke.type] : ['Normal']));
  // Só patcha se realmente difere, para não criar objeto novo desnecessariamente
  if (Array.isArray(poke.types) && poke.types.length === types.length && poke.types.every((t, i) => t === types[i])) return poke;
  return { ...poke, types };
};

/**
 * SEC-02 — Clamp de stats: protege contra saves adulterados ou corrompidos.
 * - level: sempre entre 1 e 100
 * - hp: nunca negativo, nunca maior que maxHp
 * - atributos de combate: nunca negativos
 * Não altera Pokémon válidos (cálculo barato — só cria objeto novo se algo divergir).
 */
const clampPokemonStats = (poke) => {
  if (!poke || typeof poke !== 'object') return poke;
  const level   = Math.min(100, Math.max(1, Math.floor(Number(poke.level) || 1)));
  const maxHp   = Math.max(1, Math.floor(Number(poke.maxHp) || 1));
  const hp      = Math.min(maxHp, Math.max(0, Math.floor(Number(poke.hp) || 0)));
  const attack  = Math.max(0, Math.floor(Number(poke.attack)  || 0));
  const defense = Math.max(0, Math.floor(Number(poke.defense) || 0));
  const spAtk   = Math.max(0, Math.floor(Number(poke.spAtk)   || 0));
  const spDef   = Math.max(0, Math.floor(Number(poke.spDef)   || 0));
  const speed   = Math.max(0, Math.floor(Number(poke.speed)   || 0));
  const xp      = Math.max(0, Math.floor(Number(poke.xp)      || 0));

  // Retorna o mesmo objeto se nada mudou (evita re-renders desnecessários)
  if (
    poke.level === level && poke.maxHp === maxHp && poke.hp === hp &&
    poke.attack === attack && poke.defense === defense &&
    poke.spAtk === spAtk && poke.spDef === spDef &&
    poke.speed === speed && poke.xp === xp
  ) return poke;

  return { ...poke, level, maxHp, hp, attack, defense, spAtk, spDef, speed, xp };
};

// Pipeline de sanitização por Pokémon: tipos + stats + capturedRegion
// 1.3 — capturedRegion ausente em saves pré-v2.11.15; preenchido aqui para evitar
// exibição "undefined" na PokemonManagement e chamadas extras em isPokemonLegal.
const sanitizePokemon = (poke) => {
  const typed = clampPokemonStats(fixPokemonTypes(poke));
  if (!typed) return typed;
  if (typed.capturedRegion) return typed;
  return { ...typed, capturedRegion: getPokemonRegion(Number(typed.id)) || 'kanto' };
};

const asArray = (value) => Array.isArray(value) ? value : [];

const unique = (values) => Array.from(new Set(asArray(values).filter(Boolean)));

const mergeInventory = (inventory = {}) => ({
  ...DEFAULT_GAME_STATE.inventory,
  ...inventory,
  materials: {
    ...DEFAULT_GAME_STATE.inventory.materials,
    ...(inventory.materials || {}),
  },
  items: {
    ...DEFAULT_GAME_STATE.inventory.items,
    ...(inventory.items || {}),
  },
  candies: {
    ...DEFAULT_GAME_STATE.inventory.candies,
    ...(inventory.candies || {}),
  },
});

const mergeRegionalLists = (primary = {}, legacy = {}) => {
  const merged = {};
  REGION_ORDER.forEach(region => {
    merged[region] = [
      ...asArray(DEFAULT_GAME_STATE.regional_teams?.[region]),
      ...asArray(primary?.[region]),
      ...asArray(legacy?.[region]),
    ];
  });
  return merged;
};

const normalizeBadges = (gameState = {}) => {
  const knownBadgeIds = new Set(Object.values(REGION_BADGE_IDS).flat());
  const earnedIds = getEarnedBadgeIds(gameState);
  const unknownBadges = asArray(gameState.badges)
    .filter(badge => typeof badge === 'string' && !knownBadgeIds.has(badge));

  return unique([
    ...earnedIds,
    ...unknownBadges,
  ]);
};

const normalizeWorldFlags = (gameState = {}, normalizedBadges = []) => {
  const flags = new Set(asArray(gameState.worldFlags));
  const activeRegion = gameState.activeRegion || DEFAULT_GAME_STATE.activeRegion;
  const activeRegionIndex = Math.max(0, REGION_ORDER.indexOf(activeRegion));

  REGION_ORDER.slice(0, activeRegionIndex + 1).forEach(region => {
    const startFlag = REGION_START_FLAGS[region];
    if (startFlag) flags.add(startFlag);
  });

  REGION_ORDER.forEach(region => {
    const championFlag = REGION_CHAMPION_FLAGS[region];
    const normalizedChampionFlag = `region_champion_${region}`;
    const hasLegacyChampion = flags.has(championFlag) || flags.has(normalizedChampionFlag);

    if (hasLegacyChampion) {
      flags.add(championFlag);
      flags.add(normalizedChampionFlag);
    }

    const regionBadges = REGION_BADGE_IDS[region] || [];
    if (regionBadges.length && regionBadges.every(badgeId => normalizedBadges.includes(badgeId))) {
      const startFlag = REGION_START_FLAGS[region];
      if (startFlag) flags.add(startFlag);
    }
  });

  return Array.from(flags);
};

export const auditGameState = (gameState = {}) => {
  const issues = [];
  const regionalTeams = gameState.regional_teams || gameState.regionalTeams || {};

  if (gameState.regionalTeams && !gameState.regional_teams) {
    issues.push('regionalTeams legado convertido para regional_teams');
  }

  REGION_ORDER.forEach(region => {
    if (!Array.isArray(regionalTeams[region])) {
      issues.push(`time regional ausente reparado: ${region}`);
    }
  });

  if (!Array.isArray(gameState.badges)) issues.push('badges ausente ou invalido normalizado');
  if (!Array.isArray(gameState.worldFlags)) issues.push('worldFlags ausente ou invalido normalizado');
  if (!gameState.inventory?.materials) issues.push('materiais de inventario reparados');
  if (!gameState.inventory?.items) issues.push('itens de inventario reparados');
  if (!gameState.speciesMastery) issues.push('speciesMastery ausente reparado');
  if (!gameState.caughtData) issues.push('caughtData ausente reparado');

  return {
    ok: issues.length === 0,
    issues,
  };
};

export const migrateGameState = (savedState = {}, options = {}) => {
  const loaded = savedState || {};
  const badges = normalizeBadges(loaded);
  const worldFlags = normalizeWorldFlags(loaded, badges);
  const audit = auditGameState(loaded);

  const migrated = {
    ...DEFAULT_GAME_STATE,
    ...loaded,
    // SEC-02: clamp de moeda — nunca negativa, nunca NaN
    currency: Math.max(0, Math.floor(Number(loaded.currency) || 0)),
    version: options.version || loaded.version || DEFAULT_GAME_STATE.version,
    team: (asArray(loaded.team).length ? loaded.team : DEFAULT_GAME_STATE.team).map(sanitizePokemon),
    pc: asArray(loaded.pc).map(sanitizePokemon),
    badges,
    worldFlags,
    inventory: mergeInventory(loaded.inventory || {}),
    regional_teams: Object.fromEntries(Object.entries(mergeRegionalLists(loaded.regional_teams, loaded.regionalTeams)).map(([k, v]) => [k, asArray(v).map(sanitizePokemon)])),
    regional_pc: Object.fromEntries(Object.entries(mergeRegionalLists(loaded.regional_pc, loaded.regionalPc)).map(([k, v]) => [k, asArray(v).map(sanitizePokemon)])),
    stages: loaded.stages || DEFAULT_GAME_STATE.stages,
    caughtData: loaded.caughtData || DEFAULT_GAME_STATE.caughtData,
    speciesMastery: loaded.speciesMastery || DEFAULT_GAME_STATE.speciesMastery,
    expeditions: loaded.expeditions || DEFAULT_GAME_STATE.expeditions,
    expeditionProgress: loaded.expeditionProgress || DEFAULT_GAME_STATE.expeditionProgress,
    house: {
      ...DEFAULT_GAME_STATE.house,
      ...(loaded.house || {}),
      slots: asArray(loaded.house?.slots),
      caretakers: asArray(loaded.house?.caretakers),
    },
    prestige: {
      trophies: [],
      purchasedTitles: [],   // 1.1 — garante array mesmo em saves sem PrestigeShop
      activeTitle: null,
      pokedexFrame: 'default',
      uiTheme: 'default',
      hallOfFameEntry: null,
      ...(loaded.prestige || {}),
    },
    tower: {                 // 1.2 — deep merge evita perder bp/upgrades/highestFloor
      activeRun: null,
      highestFloor: 0,
      bp: 0,
      upgrades: {},
      ...(loaded.tower || {}),
    },
    mine: {
      unlocked: false,
      level: 1,
      lastCollected: null,
      ...(loaded.mine || {}),
    },
    fishing: {
      rod: 'old_rod',
      ...(loaded.fishing || {}),
    },
    ally: {
      activeId: null,
      expiresAt: null,
      ...(loaded.ally || {}),
    },
    pokecenter: {
      freeHeals: 0,
      ...(loaded.pokecenter || {}),
    },
    gymCustom: {
      unlocked: false,
      bannerId: 'default',
      colorId: null,
      ...(loaded.gymCustom || {}),
    },
    activeRaid: loaded.activeRaid || null,
    raidStats: {
      total: 0, captured: 0, fled: 0,
      ...(loaded.raidStats || {}),
    },
    battlesSinceLastRaid: loaded.battlesSinceLastRaid || 0,
    settings: {
      ...DEFAULT_GAME_STATE.settings,
      ...(loaded.settings || {}),
    },
    autoCapture: !!(loaded.autoCapture ?? DEFAULT_GAME_STATE.autoCapture),
    autoCaptureConfig: {
      ...DEFAULT_GAME_STATE.autoCaptureConfig,
      ...(loaded.autoCaptureConfig || loaded.autoConfig || {}),
      routeConfigs: {
        ...(DEFAULT_GAME_STATE.autoCaptureConfig?.routeConfigs || {}),
        ...(loaded.autoCaptureConfig?.routeConfigs || loaded.autoConfig?.routeConfigs || {}),
      },
      shownRoutes: asArray(loaded.autoCaptureConfig?.shownRoutes || loaded.autoConfig?.shownRoutes),
      targetIds: asArray(loaded.autoCaptureConfig?.targetIds || loaded.autoConfig?.targetIds),
    },
    migrationAudit: {
      ...audit,
      migratedAt: new Date().toISOString(),
    },
  };

  delete migrated.regionalTeams;
  delete migrated.regionalPc;

  return migrated;
};

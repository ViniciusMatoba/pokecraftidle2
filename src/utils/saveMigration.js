import { DEFAULT_GAME_STATE } from '../data/constants';
import { REGION_BADGE_IDS, REGION_CHAMPION_FLAGS, REGION_ORDER, REGION_START_FLAGS } from '../data/regionStandards';
import { getEarnedBadgeIds } from './progress';

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
  const defaultAutoConfig = DEFAULT_GAME_STATE.autoConfig || {};
  const defaultAutoCaptureConfig = DEFAULT_GAME_STATE.autoCaptureConfig || {};

  const migrated = {
    ...DEFAULT_GAME_STATE,
    ...loaded,
    version: options.version || loaded.version || DEFAULT_GAME_STATE.version,
    team: asArray(loaded.team).length ? loaded.team : DEFAULT_GAME_STATE.team,
    pc: asArray(loaded.pc),
    badges,
    worldFlags,
    inventory: mergeInventory(loaded.inventory || {}),
    regional_teams: mergeRegionalLists(loaded.regional_teams, loaded.regionalTeams),
    regional_pc: mergeRegionalLists(loaded.regional_pc, loaded.regionalPc),
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
    settings: {
      ...DEFAULT_GAME_STATE.settings,
      ...(loaded.settings || {}),
    },
    autoConfig: {
      ...defaultAutoConfig,
      ...(loaded.autoConfig || {}),
    },
    autoCaptureConfig: {
      ...defaultAutoCaptureConfig,
      ...(loaded.autoCaptureConfig || {}),
      routeConfigs: {
        ...(defaultAutoCaptureConfig.routeConfigs || {}),
        ...(loaded.autoCaptureConfig?.routeConfigs || {}),
      },
      shownRoutes: asArray(loaded.autoCaptureConfig?.shownRoutes),
      targetIds: asArray(loaded.autoCaptureConfig?.targetIds),
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

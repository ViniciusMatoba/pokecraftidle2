import { DEFAULT_GAME_STATE } from '../data/constants';
import { REGION_BADGE_IDS, REGION_CHAMPION_FLAGS, REGION_ORDER, REGION_START_FLAGS } from '../data/regionStandards';
import { getEarnedBadgeIds } from './progress';
import { POKEDEX } from '../data/pokedex';
import { RAID_POKEMON_POOL, RAID_EVENT_POOL } from '../data/raids';
import { SHOWDOWN_FORM_KEYS, POKEMON_FORM_SPRITE_IDS } from './pokemonSprites';

// Conjunto de formKeys que o jogo LEGITIMAMENTE gera hoje: pools de raid (todas
// as regiões), eventos, sprites Showdown (GMax/eventos) e todas as formas Hisui
// (capturas regionais de rota). Qualquer formKey fora disso é considerado lixo
// de saves antigos (ex.: 'rattata-alola', que não existe em nenhum spawn atual).
const VALID_FORM_KEYS = (() => {
  const set = new Set();
  Object.values(RAID_POKEMON_POOL || {}).forEach(list => {
    (list || []).forEach(e => { if (e && e.formKey) set.add(e.formKey); });
  });
  (RAID_EVENT_POOL || []).forEach(e => { if (e && e.formKey) set.add(e.formKey); });
  (SHOWDOWN_FORM_KEYS || []).forEach(k => set.add(k));
  Object.keys(POKEMON_FORM_SPRITE_IDS || {}).forEach(k => { if (k.endsWith('-hisui')) set.add(k); });
  return set;
})();

// Remove formKey/formSpriteId inválidos de um Pokémon salvo. Corrige dados
// antigos onde uma forma base recebeu indevidamente uma variante regional
// (ex.: Rattata de Kanto com sprite de Alola). Não apaga o Pokémon nem stats.
const sanitizePokemonForm = (poke) => {
  if (!poke || typeof poke !== 'object') return poke;
  if (!poke.formKey && !poke.formSpriteId) return poke; // sem forma → nada a fazer
  if (poke.formKey && VALID_FORM_KEYS.has(poke.formKey)) return poke; // forma legítima
  const { formKey, formSpriteId, ...rest } = poke;
  return rest;
};

// Garante que todo Pokémon salvo tenha o array `types` populado via Pokédex.
// Sempre sobrescreve a partir do Pokédex — corrige casos onde evolution copiou apenas o tipo primário.
const fixPokemonTypes = (poke) => {
  if (!poke || typeof poke !== 'object') return poke;
  const entry = POKEDEX[Number(poke.id)];
  if (!entry) return poke; // ID desconhecido, mantém o que tem
  const types = (Array.isArray(entry.types) && entry.types.length > 0)
    ? entry.types
    : (entry.type ? [entry.type] : (poke.type ? [poke.type] : ['Normal']));
  // Só patcha se realmente difere, para não criar objeto novo desnecessariamente
  if (Array.isArray(poke.types) && poke.types.length === types.length && poke.types.every((t, i) => t === types[i])) return poke;
  return { ...poke, types };
};

// Normaliza um Pokémon salvo: corrige tipos + remove forma regional inválida.
const cleanPoke = (poke) => sanitizePokemonForm(fixPokemonTypes(poke));

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
    version: options.version || loaded.version || DEFAULT_GAME_STATE.version,
    team: (asArray(loaded.team).length ? loaded.team : DEFAULT_GAME_STATE.team).map(cleanPoke),
    pc: asArray(loaded.pc).map(cleanPoke),
    badges,
    worldFlags,
    inventory: mergeInventory(loaded.inventory || {}),
    regional_teams: Object.fromEntries(Object.entries(mergeRegionalLists(loaded.regional_teams, loaded.regionalTeams)).map(([k, v]) => [k, asArray(v).map(cleanPoke)])),
    regional_pc: Object.fromEntries(Object.entries(mergeRegionalLists(loaded.regional_pc, loaded.regionalPc)).map(([k, v]) => [k, asArray(v).map(cleanPoke)])),
    stages: loaded.stages || DEFAULT_GAME_STATE.stages,
    caughtData: loaded.caughtData || DEFAULT_GAME_STATE.caughtData,
    speciesMastery: loaded.speciesMastery || DEFAULT_GAME_STATE.speciesMastery,
    expeditions: loaded.expeditions || DEFAULT_GAME_STATE.expeditions,
    expeditionProgress: loaded.expeditionProgress || DEFAULT_GAME_STATE.expeditionProgress,
    house: {
      ...DEFAULT_GAME_STATE.house,
      ...(loaded.house || {}),
      slots: asArray(loaded.house?.slots),
      caretakers: asArray(loaded.house?.caretakers).map(cleanPoke),
    },
    prestige: {
      trophies: [],
      activeTitle: null,
      pokedexFrame: 'default',
      uiTheme: 'default',
      hallOfFameEntry: null,
      ...(loaded.prestige || {}),
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

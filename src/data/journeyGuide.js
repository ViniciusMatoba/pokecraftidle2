import { ROUTES, inferRouteRegion, isRouteUnlocked } from './routes';
import { FORGE_MATERIAL_DROP_GUIDE, FORGE_RECIPE_DROP_GUIDE } from './recipes';
import { hasProgressRequirement } from '../utils/progress';

const REGION_LABELS = {
  kanto: 'Kanto',
  johto: 'Johto',
  hoenn: 'Hoenn',
  sinnoh: 'Sinnoh',
  unova: 'Unova',
  kalos: 'Kalos',
  alola: 'Alola',
  galar: 'Galar',
  paldea: 'Paldea',
};

const REGION_STORY_STEPS = {
  kanto: [
    { flag: 'rival_1_defeated', label: 'Vencer o rival inicial' },
    { flag: 'boulder_badge', label: 'Conquistar a Boulder Badge' },
    { flag: 'cascade_badge', label: 'Conquistar a Cascade Badge' },
    { flag: 'thunder_badge', label: 'Conquistar a Thunder Badge' },
    { flag: 'rocket_hideout_cleared', label: 'Derrotar a Equipe Rocket em Celadon' },
    { flag: 'earth_badge', label: 'Fechar os 8 ginasios de Kanto' },
    { flag: 'champion', label: 'Vencer a Liga de Kanto' },
  ],
  johto: [
    { flag: 'johto_started', label: 'Iniciar Johto' },
    { flag: 'johto_rival_1_defeated', label: 'Vencer o rival em Johto' },
    { flag: 'zephyr_badge', label: 'Conquistar a Zephyr Badge' },
    { flag: 'hive_badge', label: 'Conquistar a Hive Badge' },
    { flag: 'johto_rocket_radio_cleared', label: 'Resolver a crise da Torre de Radio' },
    { flag: 'rising_badge', label: 'Fechar os 8 ginasios de Johto' },
    { flag: 'johto_champion', label: 'Vencer a Liga de Johto' },
  ],
  hoenn: [
    { flag: 'hoenn_started', label: 'Iniciar Hoenn' },
    { flag: 'hoenn_rival_route_103_defeated', label: 'Vencer o rival em Hoenn' },
    { flag: 'stone_badge', label: 'Conquistar a Stone Badge' },
    { flag: 'heat_badge', label: 'Avancar ate Lavaridge' },
    { flag: 'rain_badge', label: 'Fechar os 8 ginasios de Hoenn' },
    { flag: 'hoenn_champion', label: 'Vencer a Liga de Hoenn' },
  ],
  sinnoh: [
    { flag: 'sinnoh_started', label: 'Iniciar Sinnoh' },
    { flag: 'sinnoh_rival_jubilife_defeated', label: 'Vencer Barry em Jubilife' },
    { flag: 'coal_badge', label: 'Conquistar a Coal Badge' },
    { flag: 'sinnoh_galactic_eterna_cleared', label: 'Derrotar a Equipe Galactica em Eterna' },
    { flag: 'beacon_badge', label: 'Fechar os 8 ginasios de Sinnoh' },
    { flag: 'sinnoh_champion', label: 'Vencer Cynthia na Liga de Sinnoh' },
  ],
};

const hasFlag = (gameState = {}, flag) => hasProgressRequirement(gameState, flag);

const routeRegion = (route) => inferRouteRegion(route.id, route.group).id;

const routeSort = (a, b) => {
  const levelA = Number(a.unlockLevel ?? 999);
  const levelB = Number(b.unlockLevel ?? 999);
  if (levelA !== levelB) return levelA - levelB;
  return String(a.name || a.id).localeCompare(String(b.name || b.id));
};

const getRouteUnlockFlag = (route) => {
  if (!route?.unlocks) return null;
  return Array.isArray(route.unlocks) ? route.unlocks[0] : route.unlocks;
};

const getMissingRequirements = (route, gameState) =>
  (route.requirements || []).filter(req => !hasFlag(gameState, req));

const isGuideAllowed = (guide = {}, gameState = {}) => {
  if (guide.requiredRegion && gameState.activeRegion !== guide.requiredRegion) return false;
  if (guide.requiredFlag && !hasFlag(gameState, guide.requiredFlag)) return false;
  return true;
};

const isRouteAvailable = (routeId, gameState) => {
  const route = ROUTES[routeId];
  return Boolean(route && isRouteUnlocked(route, gameState));
};

export const getJourneyGuide = (gameState = {}) => {
  const activeRegion = gameState.activeRegion || 'kanto';
  const flags = new Set([...(gameState.worldFlags || []), ...(gameState.badges || []).map(String)]);
  const regionRoutes = Object.values(ROUTES)
    .filter(route => routeRegion(route) === activeRegion)
    .sort(routeSort);

  const farmRoutes = regionRoutes.filter(route => route.type === 'farm');
  const availableRoutes = farmRoutes.filter(route => isRouteUnlocked(route, gameState));
  const nextRoute = availableRoutes.find(route => {
    const unlockFlag = getRouteUnlockFlag(route);
    return unlockFlag && !flags.has(unlockFlag);
  }) || availableRoutes.at(-1) || null;

  const nextLockedRoute = farmRoutes.find(route => !isRouteUnlocked(route, gameState)) || null;
  const storyStep = (REGION_STORY_STEPS[activeRegion] || [])
    .find(step => !hasFlag(gameState, step.flag)) || null;

  const recipeTargets = Object.entries(FORGE_RECIPE_DROP_GUIDE)
    .filter(([recipeId, guide]) => {
      if ((gameState.inventory?.materials || {})[guide.recipeItemId] > 0) return false;
      if (!isGuideAllowed(guide, gameState)) return false;
      return guide.routeId && isRouteAvailable(guide.routeId, gameState);
    })
    .slice(0, 6)
    .map(([recipeId, guide]) => ({
      id: `recipe_${recipeId}`,
      title: guide.recipeItemId?.replace(/^recipe_/, '').replace(/_/g, ' ') || recipeId,
      routeId: guide.routeId,
      routeName: ROUTES[guide.routeId]?.name || guide.routeId,
      label: guide.label,
      type: 'Receita',
    }));

  const materialTargets = Object.entries(FORGE_MATERIAL_DROP_GUIDE)
    .filter(([materialId, guide]) => {
      if (!isGuideAllowed(guide, gameState)) return false;
      if (!guide.routeId || !isRouteAvailable(guide.routeId, gameState)) return false;
      return Number(gameState.inventory?.materials?.[materialId] || 0) < 10;
    })
    .slice(0, 5)
    .map(([materialId, guide]) => ({
      id: materialId,
      title: materialId.replace(/_/g, ' '),
      routeId: guide.routeId,
      routeName: ROUTES[guide.routeId]?.name || guide.routeId,
      label: guide.label,
      type: 'Material',
    }));

  return {
    activeRegion,
    regionLabel: REGION_LABELS[activeRegion] || activeRegion,
    currentRoute: ROUTES[gameState.currentRoute] || null,
    nextRoute,
    nextLockedRoute: nextLockedRoute
      ? { ...nextLockedRoute, missingRequirements: getMissingRequirements(nextLockedRoute, gameState) }
      : null,
    storyStep,
    recipeTargets,
    materialTargets,
  };
};

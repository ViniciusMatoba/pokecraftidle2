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

// Mapeia cada flag de história para os parâmetros de navegação do VsScreen
const STORY_FLAG_TO_VS = {
  // Kanto
  rocket_hideout_cleared:         { tab: 'challenges', category: 'rocket', region: 'kanto', label: 'QG da Equipe Rocket (Celadon)' },
  rival_1_defeated:               { tab: 'challenges', category: 'rival',  region: 'kanto', label: 'Rival - Rota 1' },
  boulder_badge:                  { tab: 'gyms',       category: 'kanto',  region: 'kanto', label: 'Ginásio de Pewter (Brock)' },
  cascade_badge:                  { tab: 'gyms',       category: 'kanto',  region: 'kanto', label: 'Ginásio de Cerulean (Misty)' },
  thunder_badge:                  { tab: 'gyms',       category: 'kanto',  region: 'kanto', label: 'Ginásios de Kanto' },
  earth_badge:                    { tab: 'gyms',       category: 'kanto',  region: 'kanto', label: 'Ginásios de Kanto' },
  champion:                       { tab: 'gyms',       category: 'kanto',  region: 'kanto', label: 'Liga Pokémon de Kanto' },
  // Johto
  johto_rocket_radio_cleared:     { tab: 'challenges', category: 'rocket', region: 'johto', label: 'Torre de Rádio - Equipe Rocket' },
  johto_rival_1_defeated:         { tab: 'challenges', category: 'rival',  region: 'johto', label: 'Rival em Cherrygrove' },
  zephyr_badge:                   { tab: 'gyms',       category: 'johto',  region: 'johto', label: 'Ginásio de Violet (Falkner)' },
  hive_badge:                     { tab: 'gyms',       category: 'johto',  region: 'johto', label: 'Ginásio de Azalea (Bugsy)' },
  rising_badge:                   { tab: 'gyms',       category: 'johto',  region: 'johto', label: 'Ginásios de Johto' },
  johto_champion:                 { tab: 'gyms',       category: 'johto',  region: 'johto', label: 'Liga Pokémon de Johto' },
  // Hoenn
  hoenn_villain_1_cleared:        { tab: 'challenges', category: 'rocket', region: 'hoenn', label: 'Equipe Aqua / Magma em Hoenn' },
  hoenn_rival_route_103_defeated: { tab: 'challenges', category: 'rival',  region: 'hoenn', label: 'Rival - Rota 103' },
  stone_badge:                    { tab: 'gyms',       category: 'hoenn',  region: 'hoenn', label: 'Ginásio de Rustboro (Roxanne)' },
  heat_badge:                     { tab: 'gyms',       category: 'hoenn',  region: 'hoenn', label: 'Ginásios de Hoenn' },
  rain_badge:                     { tab: 'gyms',       category: 'hoenn',  region: 'hoenn', label: 'Ginásios de Hoenn' },
  hoenn_champion:                 { tab: 'gyms',       category: 'hoenn',  region: 'hoenn', label: 'Liga Pokémon de Hoenn' },
  // Sinnoh
  sinnoh_galactic_eterna_cleared: { tab: 'challenges', category: 'rocket', region: 'sinnoh', label: 'Galáctica em Eterna City' },
  sinnoh_rival_jubilife_defeated: { tab: 'challenges', category: 'rival',  region: 'sinnoh', label: 'Barry em Jubilife' },
  coal_badge:                     { tab: 'gyms',       category: 'sinnoh', region: 'sinnoh', label: 'Ginásio de Oreburgh (Roark)' },
  beacon_badge:                   { tab: 'gyms',       category: 'sinnoh', region: 'sinnoh', label: 'Ginásios de Sinnoh' },
  sinnoh_champion:                { tab: 'gyms',       category: 'sinnoh', region: 'sinnoh', label: 'Liga Pokémon de Sinnoh (Cynthia)' },
  // Unova
  unova_villain_1_cleared:        { tab: 'challenges', category: 'rocket', region: 'unova', label: 'Equipe Plasma em Unova' },
  unova_rival_1_defeated:         { tab: 'challenges', category: 'rival',  region: 'unova', label: 'Cheren - Nuvema' },
  trio_badge:                     { tab: 'gyms',       category: 'unova',  region: 'unova', label: 'Ginásio de Striaton (Cilan)' },
  unova_champion:                 { tab: 'gyms',       category: 'unova',  region: 'unova', label: 'Liga Pokémon de Unova' },
  // Kalos
  kalos_villain_1_cleared:        { tab: 'challenges', category: 'rocket', region: 'kalos', label: 'Equipe Flare em Kalos' },
  kalos_rival_1_defeated:         { tab: 'challenges', category: 'rival',  region: 'kalos', label: 'Calem - Vaniville' },
  bug_badge:                      { tab: 'gyms',       category: 'kalos',  region: 'kalos', label: 'Ginásio de Santalune (Viola)' },
  kalos_champion:                 { tab: 'gyms',       category: 'kalos',  region: 'kalos', label: 'Liga Pokémon de Kalos' },
  // Alola
  alola_villain_1_cleared:        { tab: 'challenges', category: 'rocket', region: 'alola', label: 'Equipe Skull em Alola' },
  alola_rival_1_defeated:         { tab: 'challenges', category: 'rival',  region: 'alola', label: 'Hau - Hau\'oli' },
  melemele_stamp:                 { tab: 'gyms',       category: 'alola',  region: 'alola', label: 'Trial de Melemele' },
  alola_champion_stamp:           { tab: 'gyms',       category: 'alola',  region: 'alola', label: 'Liga de Alola' },
  // Galar
  galar_villain_1_cleared:        { tab: 'challenges', category: 'rocket', region: 'galar', label: 'Equipe Yell em Galar' },
  galar_rival_1_defeated:         { tab: 'challenges', category: 'rival',  region: 'galar', label: 'Hop - Postwick' },
  grass_badge_galar:              { tab: 'gyms',       category: 'galar',  region: 'galar', label: 'Ginásio de Turffield' },
  galar_champion:                 { tab: 'gyms',       category: 'galar',  region: 'galar', label: 'Liga de Galar' },
  // Paldea
  paldea_villain_1_cleared:       { tab: 'challenges', category: 'rocket', region: 'paldea', label: 'Equipe Star em Paldea' },
  paldea_rival_1_defeated:        { tab: 'challenges', category: 'rival',  region: 'paldea', label: 'Nemona - Cabo Poco' },
  bug_badge_paldea:               { tab: 'gyms',       category: 'paldea', region: 'paldea', label: 'Ginásio de Cortondo' },
  paldea_champion:                { tab: 'gyms',       category: 'paldea', region: 'paldea', label: 'Liga de Paldea' },
};

const REGION_STORY_STEPS = {
  kanto: [
    { flag: 'rocket_hideout_cleared', label: '1º Derrotar a Equipe Rocket em Celadon' },
    { flag: 'rival_1_defeated', label: '2º Vencer o rival inicial' },
    { flag: 'boulder_badge', label: '3º Conquistar a Boulder Badge' },
    { flag: 'cascade_badge', label: 'Conquistar a Cascade Badge' },
    { flag: 'thunder_badge', label: 'Conquistar a Thunder Badge' },
    { flag: 'earth_badge', label: 'Fechar os 8 ginasios de Kanto' },
    { flag: 'champion', label: 'Vencer a Liga de Kanto' },
  ],
  johto: [
    { flag: 'johto_started', label: 'Iniciar Johto' },
    { flag: 'johto_rocket_radio_cleared', label: '1º Resolver a crise da Torre de Radio (Equipe Rocket)' },
    { flag: 'johto_rival_1_defeated', label: '2º Vencer o rival em Johto' },
    { flag: 'zephyr_badge', label: '3º Conquistar a Zephyr Badge' },
    { flag: 'hive_badge', label: 'Conquistar a Hive Badge' },
    { flag: 'rising_badge', label: 'Fechar os 8 ginasios de Johto' },
    { flag: 'johto_champion', label: 'Vencer a Liga de Johto' },
  ],
  hoenn: [
    { flag: 'hoenn_started', label: 'Iniciar Hoenn' },
    { flag: 'hoenn_villain_1_cleared', label: '1º Derrotar os recrutas da Equipe Aqua/Magma' },
    { flag: 'hoenn_rival_route_103_defeated', label: '2º Vencer o rival em Hoenn' },
    { flag: 'stone_badge', label: '3º Conquistar a Stone Badge' },
    { flag: 'heat_badge', label: 'Avancar ate Lavaridge' },
    { flag: 'rain_badge', label: 'Fechar os 8 ginasios de Hoenn' },
    { flag: 'hoenn_champion', label: 'Vencer a Liga de Hoenn' },
  ],
  sinnoh: [
    { flag: 'sinnoh_started', label: 'Iniciar Sinnoh' },
    { flag: 'sinnoh_galactic_eterna_cleared', label: '1º Derrotar a Equipe Galactica em Eterna' },
    { flag: 'sinnoh_rival_jubilife_defeated', label: '2º Vencer Barry em Jubilife' },
    { flag: 'coal_badge', label: '3º Conquistar a Coal Badge' },
    { flag: 'beacon_badge', label: 'Fechar os 8 ginasios de Sinnoh' },
    { flag: 'sinnoh_champion', label: 'Vencer Cynthia na Liga de Sinnoh' },
  ],
  unova: [
    { flag: 'unova_started', label: 'Iniciar Unova' },
    { flag: 'unova_villain_1_cleared', label: '1º Conter os planos da Equipe Plasma' },
    { flag: 'unova_rival_1_defeated', label: '2º Vencer Cheren em Nuvema' },
    { flag: 'trio_badge', label: '3º Conquistar a Trio Badge em Striaton' },
    { flag: 'unova_champion', label: 'Vencer a Liga de Unova' },
  ],
  kalos: [
    { flag: 'kalos_started', label: 'Iniciar Kalos' },
    { flag: 'kalos_villain_1_cleared', label: '1º Vencer a patrulha da Equipe Flare' },
    { flag: 'kalos_rival_1_defeated', label: '2º Vencer Calem em Vaniville' },
    { flag: 'bug_badge', label: '3º Conquistar a Bug Badge em Santalune' },
    { flag: 'kalos_champion', label: 'Vencer a Liga de Kalos' },
  ],
  alola: [
    { flag: 'alola_started', label: 'Iniciar Alola' },
    { flag: 'alola_villain_1_cleared', label: '1º Expulsar a Equipe Skull de Hau\'oli' },
    { flag: 'alola_rival_1_defeated', label: '2º Vencer Hau em Alola' },
    { flag: 'melemele_stamp', label: '3º Concluir o Trial de Melemele' },
    { flag: 'alola_champion_stamp', label: 'Vencer a Liga de Alola' },
  ],
  galar: [
    { flag: 'galar_started', label: 'Iniciar Galar' },
    { flag: 'galar_villain_1_cleared', label: '1º Dispersar os fas da Equipe Yell' },
    { flag: 'galar_rival_1_defeated', label: '2º Vencer Hop em Postwick' },
    { flag: 'grass_badge_galar', label: '3º Vencer o Ginasio de Turffield' },
    { flag: 'galar_champion', label: 'Vencer a Liga de Galar' },
  ],
  paldea: [
    { flag: 'paldea_started', label: 'Iniciar Paldea' },
    { flag: 'paldea_villain_1_cleared', label: '1º Vencer os recrutas da Equipe Star' },
    { flag: 'paldea_rival_1_defeated', label: '2º Batalhar com Nemona em Cabo Poco' },
    { flag: 'bug_badge_paldea', label: '3º Vencer o Ginasio de Cortondo' },
    { flag: 'paldea_champion', label: 'Vencer a Liga de Paldea' },
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

  const nextVsBattle = storyStep
    ? (STORY_FLAG_TO_VS[storyStep.flag] || { tab: 'challenges', category: null, region: activeRegion, label: null })
    : null;

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
    nextVsBattle,
    recipeTargets,
    materialTargets,
  };
};

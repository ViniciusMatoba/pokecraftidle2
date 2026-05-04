import { hasProgressRequirement } from '../utils/progress';

// ── UTILITIES ──────────────────────────────────────────────────
export const isRouteUnlocked = (route, gameState) => {
  if (!route.requirements || route.requirements.length === 0) return true;
  return route.requirements.every(req => hasProgressRequirement(gameState, req));
};

export const getRouteLevel = (route) => {
  let minLevel = 999;
  if (route.enemies && route.enemies.length > 0) {
    const levels = route.enemies.map(e => e.level).filter(l => typeof l === 'number');
    if (levels.length > 0) minLevel = Math.min(...levels);
  }
  if (route.trainers && route.trainers.length > 0) {
    route.trainers.forEach(t => {
      if (!t.team) return;
      const lvls = t.team.map(p => p.level).filter(l => typeof l === 'number');
      if (lvls.length > 0) {
        const tMin = Math.min(...lvls);
        if (tMin < minLevel) minLevel = tMin;
      }
    });
  }
  return minLevel === 999 ? null : minLevel;
};

export const inferRouteRegion = (routeId, routeGroup) => {
  const str = `${routeId} ${routeGroup || ''}`.toLowerCase();
  if (str.includes('hoenn') || str.includes('littleroot') || str.includes('route_101') || str.includes('petalburg') || str.includes('rustboro') || str.includes('dewford') || str.includes('mauville') || str.includes('lavaridge') || str.includes('fortree') || str.includes('lilycove') || str.includes('mossdeep') || str.includes('sootopolis') || str.includes('ever_grande')) return { id: 'hoenn', order: 3 };
  if (str.includes('johto') || str.includes('new_bark') || str.includes('cherrygrove') || str.includes('violet') || str.includes('azalea') || str.includes('goldenrod') || str.includes('ecruteak') || str.includes('olivine') || str.includes('cianwood') || str.includes('mahogany') || str.includes('blackthorn')) return { id: 'johto', order: 2 };
  if (str.includes('sinnoh') || str.includes('twinleaf') || str.includes('sandgem') || str.includes('jubilife') || str.includes('oreburgh') || str.includes('eterna') || str.includes('hearthome') || str.includes('veilstone') || str.includes('pastoria') || str.includes('canalave') || str.includes('snowpoint') || str.includes('sunyshore') || str.includes('route_201') || str.includes('route_202') || str.includes('route_203') || str.includes('route_204') || str.includes('route_205') || str.includes('route_206') || str.includes('route_207') || str.includes('route_208') || str.includes('route_209') || str.includes('route_210') || str.includes('route_211') || str.includes('route_212') || str.includes('route_213') || str.includes('route_214') || str.includes('route_215') || str.includes('route_216') || str.includes('route_217') || str.includes('route_218') || str.includes('route_219') || str.includes('route_220') || str.includes('route_221') || str.includes('route_222')) return { id: 'sinnoh', order: 4 };
  return { id: 'kanto', order: 1 };
};

const GROUP_ORDER = {
  kanto: [
    'Pallet Town', 'Viridian City', 'Pewter City', 'Cerulean City', 'Vermilion City',
    'Lavender Town', 'Celadon City', 'Fuchsia City', 'Saffron City', 'Cinnabar Island',
    'Victory Road', 'Elite Four', 'Pos-Game',
  ],
  johto: [
    'New Bark Town', 'Cherrygrove City', 'Violet City', 'Azalea Town', 'Goldenrod City',
    'Ecruteak City', 'Olivine City', 'Cianwood City', 'Mahogany Town', 'Blackthorn City',
    'Johto Liga', 'Mt. Silver',
  ],
  hoenn: [
    'Hoenn Inicio', 'Hoenn Rustboro', 'Hoenn Dewford', 'Hoenn Slateport', 'Hoenn Mauville',
    'Hoenn Lavaridge', 'Hoenn Fortree', 'Hoenn Lilycove', 'Hoenn Mossdeep', 'Hoenn Sootopolis',
    'Hoenn Ever Grande', 'Hoenn Liga', 'Hoenn Pos-Game',
  ],
  sinnoh: [
    'Sinnoh Inicio', 'Sinnoh Oreburgh', 'Sinnoh Eterna', 'Sinnoh Hearthome', 'Sinnoh Pastoria',
    'Sinnoh Canalave', 'Sinnoh Snowpoint', 'Sinnoh Sunyshore', 'Sinnoh Liga', 'Sinnoh Pos-Game'
  ]
};

const getGroupOrder = (route) => {
  const regionId = route._region?.id || inferRouteRegion(route.id, route.group).id;
  const order = GROUP_ORDER[regionId] || [];
  const idx = order.indexOf(route.group);
  return idx === -1 ? 999 : idx;
};

export const getSortedRoutes = (routesObj) => {
  const routesArray = Object.values(routesObj).map((route, index) => ({
    ...route,
    _routeOrder: index,
    _minLevel: null,
    _region: inferRouteRegion(route.id, route.group),
  }));

  const groupMinLevels = {};
  routesArray.forEach(r => {
    const lv = getRouteLevel(r);
    r._minLevel = lv;
    if (lv !== null) {
      if (!groupMinLevels[r.group] || lv < groupMinLevels[r.group]) {
        groupMinLevels[r.group] = lv;
      }
    }
  });

  routesArray.forEach(r => {
    if (r._minLevel === null) {
      r._minLevel = groupMinLevels[r.group] ?? (r.unlockLevel || 1);
    }
  });

  return routesArray.sort((a, b) => {
    if (a._region.order !== b._region.order) return a._region.order - b._region.order;
    
    // Ordena primariamente por nível
    const aLevel = a._minLevel ?? a.unlockLevel ?? 1;
    const bLevel = b._minLevel ?? b.unlockLevel ?? 1;
    if (aLevel !== bLevel) return aLevel - bLevel;

    // Se o nível for igual, ordena por grupo
    const groupDelta = getGroupOrder(a) - getGroupOrder(b);
    if (groupDelta !== 0) return groupDelta;

    const aCity = a.type === 'city' || a.type === 'gym';
    const bCity = b.type === 'city' || b.type === 'gym';
    if (aCity !== bCity) return aCity ? -1 : 1;

    return a._routeOrder - b._routeOrder;
  });
};

// POKEDEX resolvido em runtime pelo App   sem import circular
const pk = (ids, level) => ids.map(id => ({ id: Number(id), level }));
const pkRange = (ids, minLevel, maxLevel) => {
  const span = Math.max(0, maxLevel - minLevel);
  return ids.map((id, index) => ({
    id: Number(id),
    level: minLevel + (span ? (index % (span + 1)) : 0),
  }));
};

const encounterRange = (encounters, minLevel, maxLevel) => {
  const span = Math.max(0, maxLevel - minLevel);
  return encounters.map((encounter, index) => ({
    ...encounter,
    level: minLevel + (span ? (index % (span + 1)) : 0),
  }));
};

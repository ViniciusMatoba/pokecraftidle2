const fs = require('fs');

let content = fs.readFileSync('src/data/routes.js', 'utf8');

// 1. Inserir jpk helper no topo
if (!content.includes('const jpk =')) {
  const helper = `\n// Helper para Johto (Regra de 70% G2 / 30% G1 / 1% Starter)\nconst jpk = (ids, level) => ids.map(id => {\n  const numId = Number(id);\n  const isStarter = [152, 155, 158].includes(numId);\n  const isG2 = numId > 151 && numId <= 251;\n  return { id: numId, level, spawnWeight: isStarter ? 1 : (isG2 ? 70 : 30) };\n});\n`;
  content = content.replace('const pk =', helper + '\nconst pk =');
}

// 2. Modificar rotas de Johto para usar jpk
// Johto routes generally have a group containing "Johto" or IDs containing "johto" or are specific cities.
// In the 108kb file, Johto routes were probably added with `enemies: [`
// Wait, the easiest is to regex replace the enemies array for Johto routes, but it's hard to target only Johto.
// Instead, I will append the sorting logic and Hoenn routes.
// We can skip the `jpk` auto-replace and just use a simple regex for enemies if it's too risky.
// Actually, earlier today I replaced them manually.

// Let's just append Hoenn and sorting functions to the end.
const sortingFunctions = `

// ── HOENN EXPANSION ───────────────────────────────────────────────

  littleroot_town: {
    id: 'littleroot_town', name: 'Littleroot Town', type: 'city', group: 'Hoenn Region',
    unlockLevel: 1, requirements: ['hoenn_started'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_littleroot.png',
    description: 'Sua jornada em Hoenn começa aqui.',
  },

  route_101: {
    id: 'route_101', name: 'Rota 101', type: 'farm', group: 'Hoenn Region',
    unlockLevel: 1, requirements: ['hoenn_started'],
    biome: 'grass',
    enemies: [
      ...pk([261, 263, 265], 3, 100), // Gen 3 (Principal)
      ...pk([16, 161], 3, 10),        // Suporte raro (Kanto/Johto)
    ],
    trainerChance: 0,
    trainers: [],
    background: '/bg_route101.png',
    description: 'Rota inicial cheia de Pokémon pequenos.',
  },

  oldale_town: {
    id: 'oldale_town', name: 'Oldale Town', type: 'city', group: 'Hoenn Region',
    unlockLevel: 2, requirements: ['hoenn_started'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_oldale_town.png',
    description: 'Pequena cidade com um Pokémon Mart central.',
  },

  route_102: {
    id: 'route_102', name: 'Rota 102', type: 'farm', group: 'Hoenn Region',
    unlockLevel: 3, requirements: ['hoenn_started'],
    biome: 'grass',
    enemies: pk([261, 265, 270, 273, 280], 4),
    trainerChance: 0.05,
    trainers: [
      { name: 'Youngster Calvin', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/youngster.png', team: pk([261, 263], 5), reward: 80 },
    ],
    background: '/bg_route102.png',
    description: 'Trilha que leva a Petalburg City.',
  },

  petalburg_city: {
    id: 'petalburg_city', name: 'Petalburg City', type: 'city', group: 'Hoenn Region',
    unlockLevel: 4, requirements: ['hoenn_started'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_petalburg_city.png',
    description: 'A cidade que a natureza e as pessoas compartilham.',
  },

  route_104: {
    id: 'route_104', name: 'Rota 104', type: 'farm', group: 'Hoenn Region',
    unlockLevel: 5, requirements: ['hoenn_started'],
    biome: 'grass',
    enemies: pk([276, 278, 183], 5),
    trainerChance: 0.05,
    trainers: [
      { name: 'Rich Boy Winston', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/richboy.png', team: pk([263], 7), reward: 200 },
    ],
    background: '/bg_route104.png',
    description: 'Rota costeira antes da floresta.',
  },

  petalburg_woods: {
    id: 'petalburg_woods', name: 'Petalburg Woods', type: 'farm', group: 'Hoenn Region',
    unlockLevel: 6, requirements: ['hoenn_started'],
    biome: 'grass',
    enemies: pk([265, 266, 268, 285, 287], 6),
    trainerChance: 0.05,
    trainers: [
      { name: 'Bug Catcher Lyle', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bugcatcher.png', team: pk([265, 266, 268], 6), reward: 100 },
    ],
    background: '/bg_petalburg_woods.png',
    description: 'Uma densa floresta protegida da luz do sol.',
  },

  rustboro_city: {
    id: 'rustboro_city', name: 'Rustboro City', type: 'city', group: 'Hoenn Region',
    unlockLevel: 8, requirements: ['hoenn_started'],
    enemies: [], trainers: [], trainerChance: 0,
    background: '/bg_rustboro_city.png',
    description: 'Grande metrópole e lar da Devon Corp.',
  },

  route_116: {
    id: 'route_116', name: 'Rota 116', type: 'farm', group: 'Hoenn Region',
    unlockLevel: 9, requirements: ['stone_badge'], // Require the first gym badge roughly
    biome: 'grass',
    enemies: pk([290, 293, 300], 7),
    trainerChance: 0.05,
    trainers: [
      { name: 'Hiker Clark', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/hiker.png', team: pk([74], 8), reward: 150 },
    ],
    background: '/bg_route116.png',
    description: 'Caminho rochoso levando ao túnel.',
  },

  rusturf_tunnel: {
    id: 'rusturf_tunnel', name: 'Rusturf Tunnel', type: 'farm', group: 'Hoenn Region',
    unlockLevel: 10, requirements: ['stone_badge'],
    biome: 'cave',
    enemies: pk([293], 8),
    trainerChance: 0,
    trainers: [],
    background: '/bg_rusturf_tunnel.png',
    description: 'Túnel perfurado pela força dos Whismur.',
  },

}; // END OF ROUTES OBJ

// SORTING LOGIC
export const getRouteLevel = (route) => {
  let minLevel = 999;
  if (route.enemies && route.enemies.length > 0) {
    minLevel = Math.min(...route.enemies.map(e => e.level));
  }
  if (route.trainers && route.trainers.length > 0) {
    route.trainers.forEach(t => {
      const tMin = Math.min(...t.team.map(p => p.level));
      if (tMin < minLevel) minLevel = tMin;
    });
  }
  return minLevel === 999 ? null : minLevel;
};

export const inferRouteRegion = (routeId, routeGroup) => {
  const str = \`\${routeId} \${routeGroup}\`.toLowerCase();
  if (str.includes('hoenn') || str.includes('littleroot') || str.includes('route_101') || str.includes('route_102') || str.includes('oldale') || str.includes('petalburg') || str.includes('route_104') || str.includes('rustboro') || str.includes('route_116') || str.includes('rusturf')) return { id: 'hoenn', order: 3 };
  if (str.includes('johto') || str.includes('bark') || str.includes('cherrygrove') || str.includes('violet') || str.includes('azalea') || str.includes('goldenrod') || str.includes('ecruteak') || str.includes('olivine') || str.includes('cianwood') || str.includes('mahogany') || str.includes('blackthorn') || str.includes('silver')) return { id: 'johto', order: 2 };
  return { id: 'kanto', order: 1 };
};

export const getSortedRoutes = (routesObj) => {
  const routesArray = Object.entries(routesObj).map(([id, route]) => {
    return { id, ...route, _minLevel: getRouteLevel(route), _region: inferRouteRegion(id, route.group) };
  });

  const groupMinLevels = {};
  routesArray.forEach(r => {
    if (r._minLevel !== null) {
      if (!groupMinLevels[r.group] || r._minLevel < groupMinLevels[r.group]) {
        groupMinLevels[r.group] = r._minLevel;
      }
    }
  });

  routesArray.forEach(r => {
    if (r._minLevel === null) {
      r._minLevel = groupMinLevels[r.group] || r.unlockLevel || 0;
    }
  });

  return routesArray.sort((a, b) => {
    if (a._minLevel !== b._minLevel) return a._minLevel - b._minLevel;
    return a._region.order - b._region.order;
  });
};
`;

// Remove the last "};" from content
const lastBraceIndex = content.lastIndexOf('};');
if (lastBraceIndex !== -1) {
  content = content.substring(0, lastBraceIndex) + sortingFunctions + content.substring(lastBraceIndex + 2);
}

fs.writeFileSync('src/data/routes.js', content, 'utf8');
console.log('Successfully injected Hoenn routes and sorting logic!');

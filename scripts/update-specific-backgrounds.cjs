const fs = require('fs');
const path = require('path');

const routesFile = path.join(__dirname, '../src/data/routes.js');
let content = fs.readFileSync(routesFile, 'utf8');

// Map: routeId → new specific background (only if current bg is generic)
const updates = {
  // Kalos — specific backgrounds replacing generic cave/snow/water
  kalos_azure_bay:    { from: '/bg_kalos_water.webp',            to: '/bg_kalos_azure_bay.webp' },
  kalos_frost_cavern: { from: '/bg_kalos_snow.webp',             to: '/bg_kalos_frost_cavern.webp' },
  kalos_route_17:     { from: '/bg_kalos_snow.webp',             to: '/bg_kalos_snowbelle.webp' },
  kalos_victory_road: { from: '/bg_kalos_cave.webp',             to: '/bg_kalos_victory_road.webp' },

  // Alola — specific backgrounds replacing generic route/cave/elite
  alola_verdant_cavern:  { from: '/bg_alola_cave.webp',          to: '/bg_alola_verdant_cavern.webp' },
  alola_akala_island:    { from: '/bg_alola_route.webp',         to: '/bg_alola_akala.webp' },
  alola_ula_ula_island:  { from: '/bg_alola_route.webp',         to: '/bg_alola_ula_ula.webp' },
  alola_vast_poni_canyon:{ from: '/bg_alola_cave.webp',          to: '/bg_alola_poni_canyon.webp' },
  alola_mount_lanakila:  { from: '/bg_alola_elite.webp',         to: '/bg_alola_lanakila.webp' },

  // Galar — specific backgrounds replacing generic route/cave/city
  galar_wild_area_south: { from: '/bg_galar_route.webp',         to: '/bg_galar_wild_area.webp' },
  galar_mine_1:          { from: '/bg_galar_cave.webp',          to: '/bg_galar_mine.webp' },
  galar_route_5:         { from: '/bg_galar_route.webp',         to: '/bg_galar_hulbury.webp' },
  galar_route_9:         { from: '/bg_galar_cave.webp',          to: '/bg_galar_circhester.webp' },
  galar_victory_road:    { from: '/bg_galar_city.webp',          to: '/bg_galar_rose_tower.webp' },

  // Paldea — specific backgrounds replacing generic route/cave
  poco_path:               { from: '/bg_paldea_route.webp',      to: '/bg_paldea_poco_path.webp' },
  paldea_artazon:          { from: '/bg_paldea_route.webp',      to: '/bg_paldea_artazon.webp' },
  paldea_medali:           { from: '/bg_paldea_route.webp',      to: '/bg_paldea_medali.webp' },
  paldea_glaseado_mountain:{ from: '/bg_paldea_cave.webp',       to: '/bg_paldea_glaseado.webp' },
  paldea_area_zero:        { from: '/bg_paldea_cave.webp',       to: '/bg_paldea_area_zero.webp' },
};

let changed = 0;

for (const [routeId, { from, to }] of Object.entries(updates)) {
  // Match the route block and replace only the first occurrence of `from` bg within that route
  const routePattern = new RegExp(
    `(id:\\s*'${routeId}'[^}]*?background:\\s*')(${from.replace(/\//g, '\\/')})(')`,
    's'
  );
  const newContent = content.replace(routePattern, `$1${to}$3`);
  if (newContent !== content) {
    content = newContent;
    changed++;
    console.log(`OK: ${routeId}  ${from}  →  ${to}`);
  } else {
    // Try simpler approach — global replace for routes where bg is unique enough
    const simple = content.replace(
      `id: '${routeId}', name:`,
      `id: '${routeId}', name:`
    );
    // Check if this route has the old bg anywhere near its id
    const idIdx = content.indexOf(`id: '${routeId}'`);
    if (idIdx === -1) { console.log(`NOT FOUND: ${routeId}`); continue; }
    const slice = content.slice(idIdx, idIdx + 600);
    if (slice.includes(from)) {
      const replaced = slice.replace(from, to);
      content = content.slice(0, idIdx) + replaced + content.slice(idIdx + 600);
      changed++;
      console.log(`OK (slice): ${routeId}  ${from}  →  ${to}`);
    } else {
      console.log(`SKIP (bg not found or already updated): ${routeId} — looking for: ${from}`);
    }
  }
}

fs.writeFileSync(routesFile, content, 'utf8');
console.log(`\nDone. ${changed} routes updated.`);

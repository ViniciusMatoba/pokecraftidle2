// Content audit for PokeCraft Idle.
// Hard failures: broken dex range, invalid route/evolution references, missing backgrounds.
// Soft warnings: unobtainable species, generic/reused backgrounds, alternate-form coverage.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

const args = new Set(process.argv.slice(2));
const strictObtainability = args.has('--strict-obtainability');
const jsonOutput = args.has('--json');

const REGION_RANGES = {
  kanto: [1, 151],
  johto: [152, 251],
  hoenn: [252, 386],
  sinnoh: [387, 493],
  unova: [494, 649],
  kalos: [650, 721],
  alola: [722, 809],
  galar: [810, 905],
  paldea: [906, 1025],
};

const regionOf = (id) => {
  const numericId = Number(id);
  const found = Object.entries(REGION_RANGES)
    .find(([, [min, max]]) => numericId >= min && numericId <= max);
  return found ? found[0] : 'unknown';
};

const byRegion = (ids) => Object.fromEntries(
  Object.keys(REGION_RANGES).map((region) => [
    region,
    [...ids].filter((id) => regionOf(id) === region).length,
  ])
);

const toSorted = (set) => [...set].sort((a, b) => a - b);

const pokedexSource = read('src/data/pokedex.js');
const routeSource = read('src/data/routes.js');
const challengeSource = read('src/components/ChallengesScreen.jsx');
const gymSource = read('src/data/gyms.js');
const expeditionSource = read('src/data/expeditions.js');
const battleBgSource = read('src/data/battleBackgrounds.js');
const appRootSource = read('src/AppRoot.jsx');
const bossSource = read('src/components/BossScreen.jsx');

const dexIds = toSorted(new Set(
  [...pokedexSource.matchAll(/^\s*(\d+)\s*:\s*\{/gm)].map((match) => Number(match[1]))
));

const missingDexIds = [];
for (let id = 1; id <= 1025; id += 1) {
  if (!dexIds.includes(id)) missingDexIds.push(id);
}

const evolutionTargets = [];
const evolutionsBySource = new Map();
for (const match of pokedexSource.matchAll(/^\s*(\d+)\s*:\s*\{([^\n]*)/gm)) {
  const sourceId = Number(match[1]);
  const line = match[2];
  const targets = [...line.matchAll(/evolution:[^\n]*?"?id"?\s*:\s*(\d+)/g)]
    .map((targetMatch) => Number(targetMatch[1]));
  if (targets.length) evolutionsBySource.set(sourceId, targets);
  evolutionTargets.push(...targets);
}

const invalidEvolutionTargets = evolutionTargets.filter((id) => !dexIds.includes(id));

const evalRoutes = () => {
  const prepared = routeSource
    .replace(/^import[\s\S]*?;\s*/gm, '')
    .replace(/export const /g, 'const ')
    .replace(/export default /g, 'const __default = ');
  return vm.runInNewContext(
    `${prepared}\n;({ ROUTES, inferRouteRegion });`,
    { hasProgressRequirement: () => true, console },
    { filename: 'src/data/routes.js' }
  );
};

const { ROUTES, inferRouteRegion } = evalRoutes();

const routeSpecies = new Set();
const wildSpecies = new Set();
const wildByRouteRegion = Object.fromEntries(
  Object.keys(REGION_RANGES).map((region) => [region, new Set()])
);
const outOfRegionWildRoutes = [];

for (const [routeKey, route] of Object.entries(ROUTES)) {
  const routeRegion = inferRouteRegion(route.id, route.group).id;
  const wildIds = new Set((route.enemies || []).map((enemy) => Number(enemy.id)).filter(Boolean));
  const routeIds = new Set([
    ...wildIds,
    ...(route.trainers || []).flatMap((trainer) => (trainer.team || []).map((pokemon) => Number(pokemon.id))),
  ].filter(Boolean));

  routeIds.forEach((id) => routeSpecies.add(id));
  wildIds.forEach((id) => {
    wildSpecies.add(id);
    if (wildByRouteRegion[routeRegion]) wildByRouteRegion[routeRegion].add(id);
  });

  const outOfRegion = [...wildIds].filter((id) => regionOf(id) !== routeRegion);
  if (outOfRegion.length) {
    outOfRegionWildRoutes.push({
      route: routeKey,
      region: routeRegion,
      name: route.name,
      ids: toSorted(new Set(outOfRegion)),
    });
  }
}

const invalidRouteSpecies = [...routeSpecies].filter((id) => !dexIds.includes(id));

const obtainable = new Set(wildSpecies);
let changed = true;
while (changed) {
  changed = false;
  for (const [sourceId, targets] of evolutionsBySource.entries()) {
    if (!obtainable.has(sourceId)) continue;
    for (const targetId of targets) {
      if (!obtainable.has(targetId)) {
        obtainable.add(targetId);
        changed = true;
      }
    }
  }
}

const unobtainable = dexIds.filter((id) => !obtainable.has(id));

const backgroundSources = [
  routeSource,
  challengeSource,
  gymSource,
  expeditionSource,
  battleBgSource,
  appRootSource,
  bossSource,
];
const backgroundRefs = new Map();
const bgRefRegex = /['"](\/[^'"]*?(?:bg|background)[^'"]*?\.(?:png|jpg|jpeg|webp|svg))['"]/gi;
for (const source of backgroundSources) {
  for (const match of source.matchAll(bgRefRegex)) {
    backgroundRefs.set(match[1], (backgroundRefs.get(match[1]) || 0) + 1);
  }
}

const missingBackgrounds = [...backgroundRefs.keys()]
  .filter((ref) => !fs.existsSync(path.join(ROOT, 'public', ref.replace(/^\//, ''))));
const reusedBackgrounds = [...backgroundRefs.entries()]
  .filter(([, count]) => count >= 3)
  .sort((a, b) => b[1] - a[1]);

let formFamilyCount = 0;
let formVariantCount = 0;
try {
  const formsSource = read('src/data/pokemonForms.js');
  formFamilyCount = (formsSource.match(/speciesId:/g) || []).length;
  formVariantCount = (formsSource.match(/\bid:/g) || []).length;
} catch {
  formFamilyCount = 0;
  formVariantCount = 0;
}

const failures = [];
if (dexIds.length !== 1025 || missingDexIds.length) {
  failures.push(`Pokedex incompleta: ${dexIds.length}/1025 entradas.`);
}
if (invalidEvolutionTargets.length) {
  failures.push(`Evolucoes apontam para IDs invalidos: ${toSorted(new Set(invalidEvolutionTargets)).join(', ')}.`);
}
if (invalidRouteSpecies.length) {
  failures.push(`Rotas/treinadores apontam para IDs invalidos: ${toSorted(new Set(invalidRouteSpecies)).join(', ')}.`);
}
if (missingBackgrounds.length) {
  failures.push(`Backgrounds ausentes: ${missingBackgrounds.join(', ')}.`);
}
if (strictObtainability && unobtainable.length) {
  failures.push(`Modo estrito: ${unobtainable.length} Pokemon ainda nao sao obtiveis.`);
}

const report = {
  dex: {
    count: dexIds.length,
    min: dexIds[0],
    max: dexIds[dexIds.length - 1],
    missing: missingDexIds,
  },
  evolutions: {
    edges: evolutionTargets.length,
    invalidTargets: toSorted(new Set(invalidEvolutionTargets)),
  },
  routes: {
    total: Object.keys(ROUTES).length,
    referencedSpecies: routeSpecies.size,
    wildSpecies: wildSpecies.size,
    wildByRouteRegion: Object.fromEntries(
      Object.entries(wildByRouteRegion).map(([region, ids]) => [region, ids.size])
    ),
    outOfRegionWildRoutes: outOfRegionWildRoutes.length,
    outOfRegionSample: outOfRegionWildRoutes.slice(0, 12),
  },
  obtainability: {
    obtainable: obtainable.size,
    obtainableByRegion: byRegion(obtainable),
    unobtainable: unobtainable.length,
    unobtainableByRegion: byRegion(unobtainable),
    unobtainableSample: unobtainable.slice(0, 40),
  },
  forms: {
    catalogFamilies: formFamilyCount,
    catalogVariants: formVariantCount,
  },
  backgrounds: {
    uniqueRefs: backgroundRefs.size,
    missing: missingBackgrounds,
    reusedTop: reusedBackgrounds.slice(0, 15),
  },
  failures,
};

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('\nContent audit');
  console.log('-------------');
  console.log(`Pokedex: ${report.dex.count}/1025 (${report.dex.min}-${report.dex.max})`);
  console.log(`Obtiveis por rota + evolucao: ${report.obtainability.obtainable}/1025`);
  console.log(`Rotas: ${report.routes.total}; especies selvagens: ${report.routes.wildSpecies}`);
  console.log(`Backgrounds: ${report.backgrounds.uniqueRefs} refs, ${report.backgrounds.missing.length} ausentes`);
  console.log(`Formas catalogadas: ${report.forms.catalogFamilies} familias, ${report.forms.catalogVariants} variantes`);
  console.log(`Rotas com selvagens fora da regiao inferida: ${report.routes.outOfRegionWildRoutes}`);
  if (report.obtainability.unobtainable) {
    console.log(`Aviso: ${report.obtainability.unobtainable} Pokemon ainda nao sao obtiveis.`);
  }
  if (report.backgrounds.reusedTop.length) {
    console.log('Backgrounds mais reutilizados:');
    report.backgrounds.reusedTop.slice(0, 5).forEach(([ref, count]) => {
      console.log(`  ${ref}: ${count} usos`);
    });
  }
}

if (failures.length) {
  if (!jsonOutput) {
    console.log('\nFalhas:');
    failures.forEach((failure) => console.log(`  - ${failure}`));
  }
  process.exit(1);
}

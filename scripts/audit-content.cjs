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

const REGION_ORDER = Object.keys(REGION_RANGES);
const isAllowedInRouteRegion = (id, routeRegion, route = {}) => {
  const group = String(route.group || '').toLowerCase();
  if (group.includes('dominio') || String(route.id || '').includes('_dex_')) return true;
  if (routeRegion === 'hisui') return true;
  const pokemonRegion = regionOf(id);
  return REGION_ORDER.indexOf(pokemonRegion) <= REGION_ORDER.indexOf(routeRegion);
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
const raidSource = read('src/data/raids.js');

const dexIds = toSorted(new Set(
  [...pokedexSource.matchAll(/^\s*(\d+)\s*:\s*\{/gm)].map((match) => Number(match[1]))
));
const baseDexIds = dexIds.filter((id) => id >= 1 && id <= 1025);
const formDexIds = dexIds.filter((id) => id > 1025);

const missingDexIds = [];
for (let id = 1; id <= 1025; id += 1) {
  if (!dexIds.includes(id)) missingDexIds.push(id);
}

const evolutionTargets = [];
const evolutionsBySource = new Map();
const levelEvolutionsBySource = new Map();
for (const match of pokedexSource.matchAll(/^\s*(\d+)\s*:\s*\{([^\n]*)/gm)) {
  const sourceId = Number(match[1]);
  const line = match[2];
  const targets = [...line.matchAll(/evolution:[^\n]*?"?id"?\s*:\s*(\d+)/g)]
    .map((targetMatch) => Number(targetMatch[1]));
  if (targets.length) evolutionsBySource.set(sourceId, targets);
  evolutionTargets.push(...targets);

  if (!line.includes('evolution:') || sourceId > 1025) continue;
  const evolutionPart = line.slice(line.indexOf('evolution:'));
  for (const objectMatch of evolutionPart.matchAll(/\{[^{}]*\}/g)) {
    const objectText = objectMatch[0];
    const levelMatch = objectText.match(/"?level"?\s*:\s*(\d+)/);
    const idMatch = objectText.match(/"?id"?\s*:\s*(\d+)/);
    if (!levelMatch || !idMatch) continue;
    const evolvesAt = Number(levelMatch[1]);
    const evolvesInto = Number(idMatch[1]);
    if (evolvesAt > 0 && evolvesInto <= 1025 && evolvesInto !== sourceId) {
      levelEvolutionsBySource.set(sourceId, { evolvesAt, evolvesInto });
    }
  }
}

const invalidEvolutionTargets = evolutionTargets.filter((id) => !dexIds.includes(id) && id <= 1025);
const missingFormEvolutionTargets = evolutionTargets.filter((id) => !dexIds.includes(id) && id > 1025);

const evalRoutes = () => {
  const prepared = routeSource
    .replace(/^\uFEFF/, '')
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

const routeLevelRange = (route) => {
  const levels = [
    ...(route.enemies || []).map((enemy) => Number(enemy.level)),
    ...(route.trainers || []).flatMap((trainer) => (trainer.team || []).map((pokemon) => Number(pokemon.level))),
  ].filter(Number.isFinite);
  if (!levels.length) return null;
  return {
    min: Math.min(...levels),
    max: Math.max(...levels),
  };
};

const isProgressionFarmRoute = (route) => (
  route?.type === 'farm'
  && Array.isArray(route.enemies)
  && route.enemies.length > 0
  && !String(route.id || '').includes('_dex_')
  && !String(route.group || '').toLowerCase().includes('dominio')
);

const ROUTE_LEVEL_STEP_LIMIT = {
  default: 8,
  unova: 7,
  galar: 8,
  paldea: 8,
};

const routeProgressionIssues = [];
const trainerBalanceIssues = [];
const underEvolvedWildIssues = [];
const routesByRegion = {};

const expectedRouteEvolution = (enemy, routeRegion, route) => {
  let id = Number(enemy.id);
  const level = Number(enemy.level);
  if (!Number.isFinite(level)) return id;

  for (let step = 0; step < 4; step += 1) {
    const evolution = levelEvolutionsBySource.get(id);
    if (!evolution || level < evolution.evolvesAt || !isAllowedInRouteRegion(evolution.evolvesInto, routeRegion, route)) {
      break;
    }
    id = evolution.evolvesInto;
  }
  return id;
};

Object.entries(ROUTES)
  .map(([key, route]) => ({ key, route, region: inferRouteRegion(route.id || key, route.group).id, range: routeLevelRange(route) }))
  .filter(({ route, range }) => isProgressionFarmRoute(route) && range)
  .sort((a, b) => {
    if (a.region !== b.region) return a.region.localeCompare(b.region);
    if (a.range.min !== b.range.min) return a.range.min - b.range.min;
    return a.key.localeCompare(b.key);
  })
  .forEach((entry) => {
    routesByRegion[entry.region] ||= [];
    routesByRegion[entry.region].push(entry);

    const wildMax = Math.max(...(entry.route.enemies || []).map((enemy) => Number(enemy.level)).filter(Number.isFinite));
    (entry.route.trainers || []).forEach((trainer) => {
      const trainerMin = Math.min(...(trainer.team || []).map((pokemon) => Number(pokemon.level)).filter(Number.isFinite));
      if (Number.isFinite(trainerMin) && Number.isFinite(wildMax) && trainerMin < wildMax + 3) {
        trainerBalanceIssues.push({
          route: entry.key,
          region: entry.region,
          trainer: trainer.name || 'Treinador',
          trainerMin,
          expectedMin: wildMax + 3,
        });
      }
    });
  });

Object.entries(routesByRegion).forEach(([region, entries]) => {
  const limit = ROUTE_LEVEL_STEP_LIMIT[region] || ROUTE_LEVEL_STEP_LIMIT.default;
  for (let i = 1; i < entries.length; i += 1) {
    const previous = entries[i - 1];
    const current = entries[i];
    const gap = current.range.min - previous.range.min;
    if (gap > limit) {
      routeProgressionIssues.push({
        region,
        previous: previous.key,
        previousLevel: previous.range.min,
        route: current.key,
        level: current.range.min,
        gap,
        limit,
      });
    }
  }
});

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

  const outOfRegion = [...wildIds].filter((id) => !isAllowedInRouteRegion(id, routeRegion, route));
  if (outOfRegion.length) {
    outOfRegionWildRoutes.push({
      route: routeKey,
      region: routeRegion,
      name: route.name,
      ids: toSorted(new Set(outOfRegion)),
    });
  }

  if (route.type === 'farm' && !String(route.id || routeKey || '').includes('_dex_')) {
    (route.enemies || []).forEach((enemy) => {
      const expectedId = expectedRouteEvolution(enemy, routeRegion, route);
      if (expectedId !== Number(enemy.id)) {
        underEvolvedWildIssues.push({
          route: routeKey,
          region: routeRegion,
          name: route.name,
          id: Number(enemy.id),
          expectedId,
          level: Number(enemy.level),
        });
      }
    });
  }
}

const invalidRouteSpecies = [...routeSpecies].filter((id) => !dexIds.includes(id));

const evalRaids = () => {
  const prepared = raidSource
    .replace(/^\uFEFF/, '')
    .replace(/^import[\s\S]*?;\s*/gm, '')
    .replace(/export const /g, 'const ')
    .replace(/export default /g, 'const __default = ');
  return vm.runInNewContext(
    `${prepared}\n;({ RAID_POKEMON_POOL, LEGENDARY_RAID_UNLOCK_FLAGS, LEGENDARY_RAID_LOCKED_IDS });`,
    {
      REGION_DEX_RANGES: Object.fromEntries(Object.entries(REGION_RANGES)
        .map(([region, [min, max]]) => [region, { min, max }])),
      console,
    },
    { filename: 'src/data/raids.js' }
  );
};

const { RAID_POKEMON_POOL, LEGENDARY_RAID_UNLOCK_FLAGS, LEGENDARY_RAID_LOCKED_IDS } = evalRaids();
const raidPoolIds = new Set(Object.values(RAID_POKEMON_POOL).flat().map(entry => Number(entry.id)).filter(Boolean));
const raidLegendaryEntries = [...raidPoolIds].filter(id => LEGENDARY_RAID_UNLOCK_FLAGS[id]);
const raidLegendaryWithoutGate = raidLegendaryEntries.filter(id => !(LEGENDARY_RAID_UNLOCK_FLAGS[id] || []).length);

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

const unobtainableBase = baseDexIds.filter((id) => !obtainable.has(id));
const unobtainableForms = formDexIds.filter((id) => !obtainable.has(id));

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
if (baseDexIds.length !== 1025 || missingDexIds.length) {
  failures.push(`Pokedex base incompleta: ${baseDexIds.length}/1025 entradas principais.`);
}
if (invalidEvolutionTargets.length) {
  failures.push(`Evolucoes apontam para IDs invalidos: ${toSorted(new Set(invalidEvolutionTargets)).join(', ')}.`);
}
if (invalidRouteSpecies.length) {
  failures.push(`Rotas/treinadores apontam para IDs invalidos: ${toSorted(new Set(invalidRouteSpecies)).join(', ')}.`);
}
if (outOfRegionWildRoutes.length) {
  failures.push(`Rotas com Pokemon de geracao futura antes do permitido: ${outOfRegionWildRoutes.length} ocorrencias.`);
}
if (raidLegendaryWithoutGate.length) {
  failures.push(`Lendarios de raid sem trava de Modo VS: ${raidLegendaryWithoutGate.join(', ')}.`);
}
if (missingBackgrounds.length) {
  failures.push(`Backgrounds ausentes: ${missingBackgrounds.join(', ')}.`);
}
if (routeProgressionIssues.length) {
  failures.push(`Progressao de rotas com saltos grandes: ${routeProgressionIssues.length} ocorrencias.`);
}
if (trainerBalanceIssues.length) {
  failures.push(`Treinadores abaixo do minimo esperado (+3 niveis): ${trainerBalanceIssues.length} ocorrencias.`);
}
if (underEvolvedWildIssues.length) {
  failures.push(`Rotas com Pokemon abaixo da forma esperada pelo nivel: ${underEvolvedWildIssues.length} ocorrencias.`);
}
if (strictObtainability && unobtainableBase.length) {
  failures.push(`Modo estrito: ${unobtainableBase.length} Pokemon base ainda nao sao obtiveis.`);
}

const report = {
  dex: {
    count: baseDexIds.length,
    totalEntries: dexIds.length,
    formEntries: formDexIds.length,
    min: baseDexIds[0],
    max: baseDexIds[baseDexIds.length - 1],
    missing: missingDexIds,
  },
  evolutions: {
    edges: evolutionTargets.length,
    invalidTargets: toSorted(new Set(invalidEvolutionTargets)),
    missingFormTargets: toSorted(new Set(missingFormEvolutionTargets)),
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
    underEvolvedWildIssues: underEvolvedWildIssues.slice(0, 50),
    progressionIssues: routeProgressionIssues,
    trainerBalanceIssues: trainerBalanceIssues.slice(0, 50),
    progressionByRegion: Object.fromEntries(
      Object.entries(routesByRegion).map(([region, entries]) => [
        region,
        entries.map(({ key, route, range }) => ({
          route: key,
          name: route.name,
          min: range.min,
          max: range.max,
        })),
      ])
    ),
  },
  obtainability: {
    obtainable: baseDexIds.filter((id) => obtainable.has(id)).length,
    obtainableTotalEntries: obtainable.size,
    obtainableByRegion: byRegion(obtainable),
    unobtainable: unobtainableBase.length,
    unobtainableByRegion: byRegion(unobtainableBase),
    unobtainableSample: unobtainableBase.slice(0, 40),
    unobtainableForms: unobtainableForms.length,
    unobtainableFormsSample: unobtainableForms.slice(0, 40),
  },
  raids: {
    curatedSpecies: raidPoolIds.size,
    legendaryGatedSpecies: raidLegendaryEntries.length,
    legendaryLockedSpecies: LEGENDARY_RAID_LOCKED_IDS.size,
    legendaryWithoutGate: raidLegendaryWithoutGate,
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
  console.log(`Pokedex base: ${report.dex.count}/1025 (${report.dex.min}-${report.dex.max}); formas extras: ${report.dex.formEntries}`);
  console.log(`Pokemon base obtiveis por rota + evolucao: ${report.obtainability.obtainable}/1025`);
  console.log(`Rotas: ${report.routes.total}; especies selvagens: ${report.routes.wildSpecies}`);
  console.log(`Saltos grandes de nivel: ${report.routes.progressionIssues.length}`);
  console.log(`Treinadores abaixo do minimo +3: ${trainerBalanceIssues.length}`);
  console.log(`Backgrounds: ${report.backgrounds.uniqueRefs} refs, ${report.backgrounds.missing.length} ausentes`);
  console.log(`Formas catalogadas: ${report.forms.catalogFamilies} familias, ${report.forms.catalogVariants} variantes`);
  console.log(`Rotas com Pokemon de geracao futura antes do permitido: ${report.routes.outOfRegionWildRoutes}`);
  console.log(`Rotas com Pokemon abaixo da evolucao esperada: ${underEvolvedWildIssues.length}`);
  console.log(`Raids: ${report.raids.curatedSpecies} especies curadas; lendarios/misticos bloqueados: ${report.raids.legendaryLockedSpecies}; com trava VS no pool curado: ${report.raids.legendaryGatedSpecies}; sem trava: ${report.raids.legendaryWithoutGate.length}`);
  if (report.obtainability.unobtainable) {
    console.log(`Aviso: ${report.obtainability.unobtainable} Pokemon base ainda nao sao obtiveis.`);
  }
  if (report.evolutions.missingFormTargets.length) {
    console.log(`Aviso: ${report.evolutions.missingFormTargets.length} evolucoes apontam para formas extras ainda sem entrada direta na Pokedex.`);
  }
  if (report.backgrounds.reusedTop.length) {
    console.log('Backgrounds mais reutilizados:');
    report.backgrounds.reusedTop.slice(0, 5).forEach(([ref, count]) => {
      console.log(`  ${ref}: ${count} usos`);
    });
  }
  if (report.routes.progressionIssues.length) {
    console.log('Saltos de nivel encontrados:');
    report.routes.progressionIssues.slice(0, 10).forEach((issue) => {
      console.log(`  ${issue.region}: ${issue.previous} Nv.${issue.previousLevel} -> ${issue.route} Nv.${issue.level} (gap ${issue.gap}, max ${issue.limit})`);
    });
  }
  if (trainerBalanceIssues.length) {
    console.log('Treinadores abaixo do minimo esperado:');
    trainerBalanceIssues.slice(0, 10).forEach((issue) => {
      console.log(`  ${issue.route}: ${issue.trainer} Nv.${issue.trainerMin}, esperado ${issue.expectedMin}+`);
    });
  }
  if (underEvolvedWildIssues.length) {
    console.log('Pokemon selvagens abaixo da evolucao esperada:');
    underEvolvedWildIssues.slice(0, 10).forEach((issue) => {
      console.log(`  ${issue.route}: #${issue.id} Nv.${issue.level}, esperado #${issue.expectedId}`);
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

// Auditoria de coerência região×rotas e nível×evolução
// Uso: node scripts/audit-route-regions.mjs
import { ROUTES, inferRouteRegion } from '../src/data/routes.js';
import { NIGHT_ONLY_POKEMON, MORNING_BONUS_POKEMON } from '../src/utils/timeSystem.js';
import { POKEDEX } from '../src/data/pokedex.js';
import { VILLAIN_TEAMS } from '../src/data/villains.js';

const REGION_ORDER = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea', 'hisui'];

const genRegion = (id) => {
  const n = Number(id);
  if (n >= 1 && n <= 151) return 'kanto';
  if (n <= 251) return 'johto';
  if (n <= 386) return 'hoenn';
  if (n <= 493) return 'sinnoh';
  if (n <= 649) return 'unova';
  if (n <= 721) return 'kalos';
  if (n <= 809) return 'alola';
  if (n <= 905) return 'galar';
  if (n <= 1025) return 'paldea';
  return 'unknown';
};

// Mapa reverso de evolução: evoluído → { fromId, evolvesAt }
const PRE_EVO = {};
Object.values(POKEDEX).forEach(p => {
  const evos = Array.isArray(p.evolution) ? p.evolution : (p.evolution ? [p.evolution] : []);
  evos.forEach(e => {
    if (e?.id && e?.level) {
      const existing = PRE_EVO[Number(e.id)];
      if (!existing || e.level < existing.evolvesAt) {
        PRE_EVO[Number(e.id)] = { fromId: Number(p.id), evolvesAt: Number(e.level) };
      }
    }
  });
});

const isDexOrDomainRoute = (route) =>
  String(route.id || '').includes('_dex_') ||
  String(route.group || '').toLowerCase().includes('dominio') ||
  route.postGameDomain;

let regionViolations = [];
let trainerEvoViolations = [];
let wildEvoViolations = [];

Object.values(ROUTES).forEach(route => {
  if (isDexOrDomainRoute(route)) return;
  const routeRegion = inferRouteRegion(route.id, route.group).id;
  const rIdx = REGION_ORDER.indexOf(routeRegion);
  if (rIdx < 0) return;

  // 1. Pool base da rota — região
  (route.enemies || []).forEach(e => {
    if (!e?.id || e.formKey) return;
    const pRegion = genRegion(e.id);
    if (REGION_ORDER.indexOf(pRegion) > rIdx) {
      regionViolations.push(`${route.id} [${routeRegion}]: wild #${e.id} ${POKEDEX[e.id]?.name || '?'} (${pRegion}) nv.${e.level}`);
    }
    // 2. Evolução acima do nível (selvagem)
    const pre = PRE_EVO[Number(e.id)];
    if (pre && Number(e.level) < pre.evolvesAt) {
      wildEvoViolations.push(`${route.id}: wild ${POKEDEX[e.id]?.name || e.id} nv.${e.level} (evolui aos ${pre.evolvesAt})`);
    }
  });

  // 3. Treinadores — região e evolução×nível
  (route.trainers || []).forEach(t => {
    (t.team || []).forEach(m => {
      if (!m?.id) return;
      const pRegion = genRegion(m.id);
      if (REGION_ORDER.indexOf(pRegion) > rIdx) {
        regionViolations.push(`${route.id} [${routeRegion}]: trainer "${t.name}" #${m.id} ${POKEDEX[m.id]?.name || '?'} (${pRegion})`);
      }
      const pre = PRE_EVO[Number(m.id)];
      if (pre && Number(m.level) < pre.evolvesAt) {
        trainerEvoViolations.push(`${route.id}: trainer "${t.name}" tem ${POKEDEX[m.id]?.name || m.id} nv.${m.level} (evolui aos ${pre.evolvesAt})`);
      }
    });
  });
});

// 4. Extras de horário vs Kanto
const timeExtrasReport = Object.entries({ night_only: NIGHT_ONLY_POKEMON, morning_bonus: MORNING_BONUS_POKEMON }).map(([period, ids]) => {
  const nonKanto = ids.filter(id => genRegion(id) !== 'kanto');
  return `  ${period}: ${ids.length} ids, ${nonKanto.length} não-Kanto [${nonKanto.join(',')}]`;
}).join('\n');

// 5. Vilões vs região
const villainReport = Object.entries(VILLAIN_TEAMS).map(([key, team]) => {
  const regions = [...new Set(team.pokemonPool.map(genRegion))];
  return `  ${key}: gens {${regions.join(',')}}`;
}).join('\n');

console.log('══════════ AUDITORIA REGIÃO × ROTAS ══════════');
console.log(`\n1) VIOLAÇÕES DE REGIÃO (pool base + treinadores): ${regionViolations.length}`);
regionViolations.forEach(v => console.log('  ❌ ' + v));
console.log(`\n2) SELVAGENS EVOLUÍDOS ABAIXO DO NÍVEL: ${wildEvoViolations.length}`);
wildEvoViolations.slice(0, 40).forEach(v => console.log('  ⚠️ ' + v));
if (wildEvoViolations.length > 40) console.log(`  ... +${wildEvoViolations.length - 40}`);
console.log(`\n3) TREINADORES COM EVOLUÇÃO ABAIXO DO NÍVEL: ${trainerEvoViolations.length}`);
trainerEvoViolations.slice(0, 60).forEach(v => console.log('  ⚠️ ' + v));
if (trainerEvoViolations.length > 60) console.log(`  ... +${trainerEvoViolations.length - 60}`);
console.log('\n4) EXTRAS DE HORÁRIO (ids não-Kanto que podem vazar):');
console.log(timeExtrasReport);
console.log('\n5) POOLS DE VILÕES (gerações presentes):');
console.log(villainReport);

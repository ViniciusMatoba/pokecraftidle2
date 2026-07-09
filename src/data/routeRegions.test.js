// Testes de invariante: coerência região×rotas e nível×evolução
// Regras (definidas pelo dono do projeto):
// 1. Rotas de uma região NUNCA contêm Pokémon de gerações futuras
//    (Kanto: só gen 1; Johto: gens 1-2; ...).
// 2. Nenhum selvagem ou Pokémon de treinador aparece evoluído em nível
//    abaixo do seu nível de evolução — exceto quando a pré-evolução
//    pertence a uma geração futura (ex.: Pikachu em Kanto não vira Pichu).
import { describe, it, expect } from 'vitest';
import { ROUTES, inferRouteRegion, devolveForLevel } from './routes';
import { POKEDEX } from './pokedex';

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

const isDexOrDomainRoute = (route) =>
  String(route.id || '').includes('_dex_') ||
  String(route.group || '').toLowerCase().includes('dominio') ||
  route.postGameDomain;

const auditableRoutes = Object.values(ROUTES).filter(r => !isDexOrDomainRoute(r));

describe('Região × Rotas', () => {
  it('nenhuma rota contém Pokémon de geração futura (pool base e treinadores)', () => {
    const violations = [];
    auditableRoutes.forEach(route => {
      const routeRegion = inferRouteRegion(route.id, route.group).id;
      const rIdx = REGION_ORDER.indexOf(routeRegion);
      if (rIdx < 0 || routeRegion === 'hisui') return;

      (route.enemies || []).forEach(e => {
        if (!e?.id || e.formKey) return;
        if (REGION_ORDER.indexOf(genRegion(e.id)) > rIdx) {
          violations.push(`${route.id} [${routeRegion}]: wild #${e.id} ${POKEDEX[e.id]?.name || '?'}`);
        }
      });
      (route.trainers || []).forEach(t => {
        (t.team || []).forEach(m => {
          if (!m?.id || m.formKey) return;
          if (REGION_ORDER.indexOf(genRegion(m.id)) > rIdx) {
            violations.push(`${route.id} [${routeRegion}]: trainer "${t.name}" #${m.id} ${POKEDEX[m.id]?.name || '?'}`);
          }
        });
      });
    });
    expect(violations, violations.join('\n')).toEqual([]);
  });

  it('nenhum Pokémon (selvagem ou de treinador) está evoluído abaixo do nível de evolução', () => {
    const violations = [];
    auditableRoutes.forEach(route => {
      const routeRegion = inferRouteRegion(route.id, route.group).id;

      (route.enemies || []).forEach(e => {
        if (!e?.id || e.formKey || !e.level) return;
        // devolveForLevel respeita a região: se retornar id diferente,
        // a pipeline de normalização deveria ter aplicado a devolução.
        const expected = devolveForLevel(e.id, e.level, routeRegion, route);
        if (expected !== Number(e.id)) {
          violations.push(`${route.id}: wild ${POKEDEX[e.id]?.name || e.id} nv.${e.level} deveria ser #${expected} ${POKEDEX[expected]?.name || ''}`);
        }
      });
      (route.trainers || []).forEach(t => {
        (t.team || []).forEach(m => {
          if (!m?.id || m.formKey || !m.level) return;
          const expected = devolveForLevel(m.id, m.level, routeRegion, route);
          if (expected !== Number(m.id)) {
            violations.push(`${route.id}: trainer "${t.name}" ${POKEDEX[m.id]?.name || m.id} nv.${m.level} deveria ser #${expected} ${POKEDEX[expected]?.name || ''}`);
          }
        });
      });
    });
    expect(violations, violations.join('\n')).toEqual([]);
  });

  it('rotas de Kanto contêm exclusivamente Pokémon de Kanto (regra absoluta)', () => {
    const violations = [];
    auditableRoutes
      .filter(route => inferRouteRegion(route.id, route.group).id === 'kanto')
      .forEach(route => {
        const all = [
          ...(route.enemies || []).map(e => e?.id),
          ...(route.trainers || []).flatMap(t => (t.team || []).map(m => m?.id)),
        ].filter(Boolean);
        all.forEach(id => {
          if (genRegion(id) !== 'kanto') {
            violations.push(`${route.id}: #${id} ${POKEDEX[id]?.name || '?'} (${genRegion(id)})`);
          }
        });
      });
    expect(violations, violations.join('\n')).toEqual([]);
  });

  it('devolveForLevel: casos de referência', () => {
    // Raticate nv.10 → Rattata (20 é o nível de evolução)
    expect(devolveForLevel(20, 10, 'kanto')).toBe(19);
    // Raticate nv.25 → permanece Raticate
    expect(devolveForLevel(20, 25, 'kanto')).toBe(20);
    // Pikachu nv.6 em Kanto → NÃO vira Pichu (gen 2 bloqueada)
    expect(devolveForLevel(25, 6, 'kanto')).toBe(25);
    // Pikachu nv.6 em Johto → vira Pichu (gen 2 permitida)
    expect(devolveForLevel(25, 6, 'johto')).toBe(172);
  });
});

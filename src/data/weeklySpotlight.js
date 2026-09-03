// Destaque Semanal — rotação determinística por tempo (sem backend).
// Todos os jogadores veem o mesmo destaque na mesma semana (semana ISO por UTC).
// Um destaque é uma ESPÉCIE (bônus onde ela aparecer) ou uma ROTA (bônus em tudo nela).

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const EPOCH = Date.UTC(2024, 0, 1); // Segunda-feira 00:00 UTC — alinha as semanas.

// Lista curada (alterna espécie/rota). routeId deve existir em routes.js.
export const SPOTLIGHTS = [
  { type: 'species', id: 147, name: 'Dratini' },
  { type: 'route',   routeId: 'route_24_25', name: 'Rotas 24 e 25' },
  { type: 'species', id: 246, name: 'Larvitar' },
  { type: 'route',   routeId: 'route_9_10', name: 'Rotas 9 e 10' },
  { type: 'species', id: 133, name: 'Eevee' },
  { type: 'route',   routeId: 'route_12_15', name: 'Rotas 12 a 15' },
  { type: 'species', id: 443, name: 'Gible' },
  { type: 'route',   routeId: 'route_7_8', name: 'Rotas 7 e 8' },
  { type: 'species', id: 447, name: 'Riolu' },
  { type: 'route',   routeId: 'route_5_6', name: 'Rotas 5 e 6' },
  { type: 'species', id: 374, name: 'Beldum' },
  { type: 'route',   routeId: 'route_3', name: 'Rota 3' },
];

export const getActiveSpotlight = (now = Date.now()) => {
  const weekIndex = Math.floor((now - EPOCH) / WEEK_MS);
  const idx = ((weekIndex % SPOTLIGHTS.length) + SPOTLIGHTS.length) % SPOTLIGHTS.length;
  return { ...SPOTLIGHTS[idx], weekIndex };
};

// Tempo (ms) até a próxima troca de destaque.
export const msUntilNextRotation = (now = Date.now()) => {
  const elapsed = ((now - EPOCH) % WEEK_MS + WEEK_MS) % WEEK_MS;
  return WEEK_MS - elapsed;
};

const baseId = (id) => (Number(id) >= 10000 ? Number(id) % 10000 : Number(id));

export const isSpeciesFeatured = (id, now = Date.now()) => {
  const s = getActiveSpotlight(now);
  return s.type === 'species' && baseId(id) === Number(s.id);
};

export const isRouteFeatured = (routeId, now = Date.now()) => {
  const s = getActiveSpotlight(now);
  return s.type === 'route' && s.routeId === routeId;
};

// Um spawn/drop da espécie `pokemonId` na rota `routeId` recebe o bônus do destaque?
export const isSpotlightBoosted = (pokemonId, routeId, now = Date.now()) =>
  isSpeciesFeatured(pokemonId, now) || isRouteFeatured(routeId, now);

// Multiplicadores (definidos junto com o produto): Shiny ×2, Candy ×2.
export const SPOTLIGHT_SHINY_MULT = 2;
export const SPOTLIGHT_CANDY_MULT = 2;

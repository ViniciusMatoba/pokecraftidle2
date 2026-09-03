// Destaque Semanal — rotação determinística por tempo (sem backend).
// Todos os jogadores veem o mesmo destaque na mesma semana (semana ISO por UTC).
// Um destaque é uma ESPÉCIE (bônus onde ela aparecer) ou uma ROTA (bônus em tudo nela).

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const EPOCH = Date.UTC(2024, 0, 1); // Segunda-feira 00:00 UTC — alinha as semanas.

// Lista curada multi-região (alterna espécie/rota, cobre as 9 regiões).
// routeId deve existir em routes.js — as rotas `${region}_dex_field_N` são
// geradas para todas as regiões, então servem de destino garantido.
export const SPOTLIGHTS = [
  // ── Kanto ──
  { type: 'species', id: 147, name: 'Dratini' },
  { type: 'route',   routeId: 'route_24_25', name: 'Rotas 24 e 25' },
  // ── Johto ──
  { type: 'species', id: 246, name: 'Larvitar' },
  { type: 'route',   routeId: 'johto_dex_field_2', name: 'Habitat Regional Johto II' },
  // ── Hoenn ──
  { type: 'species', id: 371, name: 'Bagon' },
  { type: 'route',   routeId: 'hoenn_dex_field_2', name: 'Habitat Regional Hoenn II' },
  // ── Sinnoh ──
  { type: 'species', id: 443, name: 'Gible' },
  { type: 'route',   routeId: 'sinnoh_dex_field_2', name: 'Habitat Regional Sinnoh II' },
  // ── Unova ──
  { type: 'species', id: 633, name: 'Deino' },
  { type: 'route',   routeId: 'unova_dex_field_3', name: 'Reserva Regional Unova III' },
  // ── Kalos ──
  { type: 'species', id: 704, name: 'Goomy' },
  { type: 'route',   routeId: 'kalos_dex_field_2', name: 'Habitat Regional Kalos II' },
  // ── Alola ──
  { type: 'species', id: 782, name: 'Jangmo-o' },
  { type: 'route',   routeId: 'alola_dex_field_2', name: 'Habitat Regional Alola II' },
  // ── Galar ──
  { type: 'species', id: 885, name: 'Dreepy' },
  { type: 'route',   routeId: 'galar_dex_field_2', name: 'Habitat Regional Galar II' },
  // ── Paldea ──
  { type: 'species', id: 996, name: 'Frigibax' },
  { type: 'route',   routeId: 'paldea_dex_field_2', name: 'Habitat Regional Paldea II' },
  // ── Extras Kanto/Sinnoh (variedade) ──
  { type: 'species', id: 133, name: 'Eevee' },
  { type: 'species', id: 447, name: 'Riolu' },
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

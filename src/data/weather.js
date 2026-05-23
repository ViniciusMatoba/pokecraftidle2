// ── Sistema de Clima — PokéCraft Idle 2 ─────────────────────────────────────

export const WEATHER_TYPES = {
  none:      { label: 'Tempo Normal',        icon: '☀️',  color: '#f8fafc',  bg: 'transparent' },
  sun:       { label: 'Sol Intenso',         icon: '🌞',  color: '#fef08a',  bg: 'rgba(254,240,138,0.15)' },
  rain:      { label: 'Chuva',              icon: '🌧️',  color: '#93c5fd',  bg: 'rgba(147,197,253,0.15)' },
  sandstorm: { label: 'Tempestade de Areia', icon: '🌪️',  color: '#fbbf24',  bg: 'rgba(251,191,36,0.18)' },
  hail:      { label: 'Granizo',            icon: '🌨️',  color: '#bae6fd',  bg: 'rgba(186,230,253,0.15)' },
};

// Multiplicadores de dano por tipo de move e clima atual
export const WEATHER_TYPE_MULT = {
  sun:       { Fire: 1.5, Water: 0.5 },
  rain:      { Water: 1.5, Fire: 0.5 },
  sandstorm: { Rock: 1.2, Ground: 1.2, Steel: 1.2 },
  hail:      { Ice: 1.2 },
  none:      {},
};

// Dano passivo por turno (fração do maxHp) — 0 = sem dano
export const WEATHER_PASSIVE_DAMAGE = {
  sandstorm: 0.0625, // 1/16 HP — não afeta Rock, Ground, Steel
  hail:      0.0625, // 1/16 HP — não afeta Ice
  sun:       0,
  rain:      0,
  none:      0,
};

// Tipos imunes ao dano passivo por clima
export const WEATHER_IMMUNE_TYPES = {
  sandstorm: ['Rock', 'Ground', 'Steel'],
  hail:      ['Ice'],
};

// Biomas com clima fixo. Rotas comuns ficam neutras; clima de batalha vem de golpes.
export const BIOME_WEATHER = {
  desert: 'sandstorm',
  snow:   'hail',
  ice:    'hail',
};

export const WEATHER_MOVE_MAP = {
  'sunny-day': 'sun',
  'rain-dance': 'rain',
  sandstorm: 'sandstorm',
  hail: 'hail',
  'shadow-sky': 'hail',
};

export const getWeatherFromMove = (move) => {
  const moveKey = String(move?.moveId || move?.key || move?.name || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
  return WEATHER_MOVE_MAP[moveKey] || null;
};

/**
 * Determina o clima para uma rota.
 * @param {object} route - Objeto da rota (com .biome opcional)
 * @returns {string} — chave do clima: 'none' | 'sun' | 'rain' | 'sandstorm' | 'hail'
 */
export const generateWeatherForRoute = (route) => {
  if (!route) return 'none';
  if (route.biome && BIOME_WEATHER[route.biome]) {
    return BIOME_WEATHER[route.biome];
  }
  return 'none';
};

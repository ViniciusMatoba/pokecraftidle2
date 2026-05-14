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

// Biomas com clima fixo
export const BIOME_WEATHER = {
  desert: 'sandstorm',
  snow:   'hail',
  ice:    'hail',
  beach:  'rain',
  ocean:  'rain',
};

// Pool ponderado: none aparece mais (clima normal é mais frequente)
export const RANDOM_WEATHER_POOL = [
  'none', 'none', 'none', 'none',
  'sun', 'rain', 'sandstorm', 'hail',
];

// Chance de gerar clima aleatório em biomas sem clima fixo
export const RANDOM_WEATHER_CHANCE = 0.20;

/**
 * Determina o clima para uma rota.
 * @param {object} route - Objeto da rota (com .biome opcional)
 * @returns {string} — chave do clima: 'none' | 'sun' | 'rain' | 'sandstorm' | 'hail'
 */
export const generateWeatherForRoute = (route) => {
  if (!route) return 'none';
  // Clima fixo por bioma
  if (route.biome && BIOME_WEATHER[route.biome]) {
    return BIOME_WEATHER[route.biome];
  }
  // Sem clima em cidades/gyms/boss
  if (route.type === 'city' || route.type === 'gym') return 'none';
  // Clima aleatório com 20% de chance
  if (Math.random() < RANDOM_WEATHER_CHANCE) {
    const pool = RANDOM_WEATHER_POOL.filter(w => w !== 'none');
    return pool[Math.floor(Math.random() * pool.length)];
  }
  return 'none';
};

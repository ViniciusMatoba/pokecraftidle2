// src/data/moveAnimations.js
// Composable move effects inspired by the Pokemon Showdown battle client.
// Showdown builds attacks from reusable effect sprites, background flashes,
// screen motion and target reactions; this file follows the same direction.
export const FX_BASE = 'https://play.pokemonshowdown.com/fx/';

export const TYPE_COLORS = {
  Fire: '#ff5533',
  Water: '#3aa8ff',
  Grass: '#66c857',
  Electric: '#ffd43b',
  Ice: '#7ddcff',
  Fighting: '#c35a45',
  Poison: '#b45ac9',
  Ground: '#d8ad56',
  Flying: '#8aa7ff',
  Psychic: '#ff5faf',
  Bug: '#a8c83d',
  Rock: '#b8a05a',
  Ghost: '#7357c8',
  Dragon: '#7667ff',
  Dark: '#5b4a42',
  Steel: '#a8b4c0',
  Fairy: '#f29beb',
  Normal: '#b2b28a',
};

export const TYPE_FALLBACKS = {
  Fire: { type: 'stream', sprite: 'fireball', overlay: 'fire' },
  Water: { type: 'stream', sprite: 'waterwisp', overlay: 'water' },
  Grass: { type: 'leaf_swirl', sprite: 'leaf1', overlay: 'grass' },
  Electric: { type: 'lightning_strike', sprite: 'lightning', overlay: 'electric' },
  Ice: { type: 'ice_beam', sprite: 'icicle', overlay: 'ice' },
  Fighting: { type: 'impact_flash', sprite: 'fist' },
  Poison: { type: 'poison_cloud', sprite: 'poisonwisp', overlay: 'poison' },
  Ground: { type: 'quake', sprite: 'rock1' },
  Flying: { type: 'gust', sprite: 'wind' },
  Psychic: { type: 'psychic_wave', sprite: 'wisp', overlay: 'psychic' },
  Bug: { type: 'projectile_trail', sprite: 'energyball', overlay: 'bug' },
  Rock: { type: 'rock_rise', sprite: 'rock1' },
  Ghost: { type: 'shadow_orbs', sprite: 'shadowball', overlay: 'ghost' },
  Dragon: { type: 'dragon_pulse', sprite: 'lightball', overlay: 'dragon' },
  Dark: { type: 'shadow_orbs', sprite: 'shadowball', overlay: 'dark' },
  Steel: { type: 'metal_hit', sprite: 'impact' },
  Fairy: { type: 'sparkle_burst', sprite: 'shine', overlay: 'fairy' },
  Normal: { type: 'impact_flash', sprite: 'impact' },
};

const common = (type, patch = {}) => ({
  color: TYPE_COLORS[type] || TYPE_COLORS.Normal,
  typeLabel: type,
  count: 3,
  duration: 420,
  ...patch,
});

export const MOVE_ANIMATIONS = {
  // Fire
  ember: common('Fire', { type: 'projectile_trail', sprite: 'fireball', count: 4, duration: 420 }),
  flamethrower: common('Fire', { type: 'stream', sprite: 'fireball', count: 10, duration: 780, background: '#5f1208', shake: 'light' }),
  'fire-blast': common('Fire', { type: 'burst', sprite: 'fireball', count: 10, duration: 620, background: '#7f1d1d', shake: 'medium' }),
  'fire-punch': common('Fire', { type: 'impact_flash', sprite: 'fist', count: 4, overlay: 'fire', shake: 'light' }),
  'fire-fang': common('Fire', { type: 'dual_impact', sprite: 'topbite', overlay: 'fire', duration: 330 }),
  'flame-wheel': common('Fire', { type: 'charge_projectile', sprite: 'fireball', count: 6, duration: 520, overlay: 'fire' }),
  'flare-blitz': common('Fire', { type: 'charge_projectile', sprite: 'fireball', count: 8, duration: 650, background: '#450a0a', shake: 'medium', overlay: 'fire' }),
  'heat-wave': common('Fire', { type: 'screen_waves', sprite: 'fireball', count: 8, duration: 760, background: '#7c2d12' }),
  'lava-plume': common('Fire', { type: 'burst', sprite: 'fireball', count: 10, duration: 620, shake: 'medium' }),
  'sacred-fire': common('Fire', { type: 'projectile_trail', sprite: 'bluefireball', count: 8, duration: 620, background: '#7c2d12' }),

  // Water
  'water-gun': common('Water', { type: 'projectile_trail', sprite: 'waterwisp', count: 4, duration: 380 }),
  'bubble-beam': common('Water', { type: 'stream', sprite: 'bubble', count: 10, duration: 680 }),
  surf: common('Water', { type: 'wave', sprite: 'waterwisp', count: 7, duration: 760, background: '#083e8a', shake: 'light' }),
  'hydro-pump': common('Water', { type: 'stream', sprite: 'waterwisp', count: 14, duration: 780, background: '#075985', shake: 'medium' }),
  scald: common('Water', { type: 'stream', sprite: 'waterwisp', count: 9, duration: 620, color: '#ffb15f', overlay: 'fire' }),
  waterfall: common('Water', { type: 'charge_projectile', sprite: 'waterwisp', count: 6, duration: 560, shake: 'light' }),
  'aqua-jet': common('Water', { type: 'projectile', sprite: 'waterwisp', count: 3, duration: 280 }),
  'aqua-tail': common('Water', { type: 'slash', sprite: 'rightslash', count: 3, overlay: 'water' }),

  // Electric
  'thunder-shock': common('Electric', { type: 'lightning_strike', sprite: 'lightning', count: 2, duration: 320 }),
  thunderbolt: common('Electric', { type: 'lightning_strike', sprite: 'lightning', count: 4, duration: 520, background: '#111827', shake: 'light' }),
  thunder: common('Electric', { type: 'lightning_strike', sprite: 'lightning', count: 6, duration: 700, background: '#020617', shake: 'medium' }),
  discharge: common('Electric', { type: 'electric_field', sprite: 'lightning', count: 6, duration: 650, background: '#111827' }),
  spark: common('Electric', { type: 'charge_projectile', sprite: 'lightning', count: 4, duration: 420, overlay: 'electric' }),
  'volt-tackle': common('Electric', { type: 'charge_projectile', sprite: 'lightning', count: 8, duration: 620, background: '#111827', shake: 'medium' }),

  // Ice
  'ice-beam': common('Ice', { type: 'ice_beam', sprite: 'icicle', count: 5, duration: 660, background: '#082f49' }),
  blizzard: common('Ice', { type: 'snowstorm', sprite: 'icicle', count: 12, duration: 780, background: '#0f172a', shake: 'light' }),
  'ice-punch': common('Ice', { type: 'impact_flash', sprite: 'fist', overlay: 'ice', count: 4 }),
  'ice-fang': common('Ice', { type: 'dual_impact', sprite: 'topbite', overlay: 'ice', duration: 330 }),
  'icy-wind': common('Ice', { type: 'gust', sprite: 'icicle', count: 8, duration: 640, background: '#164e63' }),

  // Grass
  'vine-whip': common('Grass', { type: 'slash', sprite: 'rightslash', count: 3, overlay: 'grass' }),
  'razor-leaf': common('Grass', { type: 'leaf_swirl', sprite: 'leaf1', count: 8, duration: 520 }),
  'leaf-blade': common('Grass', { type: 'slash', sprite: 'leftslash', count: 4, overlay: 'grass', shake: 'light' }),
  'solar-beam': common('Grass', { type: 'charge_beam', sprite: 'shine', count: 8, duration: 900, background: '#365314', shake: 'medium' }),
  'energy-ball': common('Grass', { type: 'projectile', sprite: 'lightball', count: 4, duration: 520, overlay: 'grass' }),
  'giga-drain': common('Grass', { type: 'drain', sprite: 'wisp', count: 6, duration: 760, background: '#365314' }),
  'mega-drain': common('Grass', { type: 'drain', sprite: 'wisp', count: 5, duration: 650 }),
  absorb: common('Grass', { type: 'drain', sprite: 'wisp', count: 3, duration: 520 }),

  // Ground / Rock
  earthquake: common('Ground', { type: 'quake', sprite: 'rock1', count: 10, duration: 900, background: '#3f2b17', shake: 'heavy' }),
  bulldoze: common('Ground', { type: 'quake', sprite: 'rock1', count: 6, duration: 620, shake: 'medium' }),
  dig: common('Ground', { type: 'rock_rise', sprite: 'rock1', count: 5, duration: 560 }),
  'earth-power': common('Ground', { type: 'ground_burst', sprite: 'rock1', count: 8, duration: 650, background: '#422006' }),
  'rock-throw': common('Rock', { type: 'projectile_trail', sprite: 'rock1', count: 4, duration: 460 }),
  'rock-slide': common('Rock', { type: 'rock_rain', sprite: 'rock1', count: 9, duration: 720, shake: 'medium' }),
  'stone-edge': common('Rock', { type: 'rock_rise', sprite: 'rock1', count: 8, duration: 600, shake: 'medium' }),

  // Psychic / Ghost / Dark / Dragon / Fairy
  confusion: common('Psychic', { type: 'psychic_wave', sprite: 'wisp', count: 4, duration: 520 }),
  psybeam: common('Psychic', { type: 'beam', sprite: 'lightball', count: 6, duration: 620, background: '#581c87' }),
  psychic: common('Psychic', { type: 'psychic_wave', sprite: 'wisp', count: 7, duration: 680, background: '#831843', shake: 'light' }),
  'shadow-ball': common('Ghost', { type: 'shadow_orbs', sprite: 'poisonwisp', count: 8, duration: 720, background: '#020617' }),
  hex: common('Ghost', { type: 'shadow_orbs', sprite: 'poisonwisp', count: 5, duration: 540 }),
  'night-shade': common('Ghost', { type: 'shadow_orbs', sprite: 'shadowball', count: 6, duration: 620, background: '#020617' }),
  bite: common('Dark', { type: 'dual_impact', sprite: 'topbite', count: 2, duration: 280 }),
  crunch: common('Dark', { type: 'dual_impact', sprite: 'topbite', count: 2, duration: 320, shake: 'light' }),
  'dark-pulse': common('Dark', { type: 'pulse', sprite: 'shadowball', count: 5, duration: 560, background: '#1c1917' }),
  'dragon-breath': common('Dragon', { type: 'stream', sprite: 'lightball', count: 9, duration: 620, background: '#312e81' }),
  'dragon-pulse': common('Dragon', { type: 'dragon_pulse', sprite: 'lightball', count: 6, duration: 640, shake: 'light' }),
  'draco-meteor': common('Dragon', { type: 'meteor_rain', sprite: 'lightball', count: 10, duration: 920, background: '#1e1b4b', shake: 'heavy' }),
  'moonblast': common('Fairy', { type: 'sparkle_burst', sprite: 'shine', count: 10, duration: 680, background: '#701a75' }),
  'dazzling-gleam': common('Fairy', { type: 'sparkle_burst', sprite: 'shine', count: 8, duration: 560 }),
  'play-rough': common('Fairy', { type: 'impact_flash', sprite: 'impact', overlay: 'fairy', count: 5, shake: 'light' }),

  // Steel / Poison / Flying / Fighting / Normal
  'metal-claw': common('Steel', { type: 'slash', sprite: 'rightslash', overlay: 'steel', count: 3 }),
  'iron-tail': common('Steel', { type: 'slash', sprite: 'leftslash', overlay: 'steel', count: 4, shake: 'light' }),
  'flash-cannon': common('Steel', { type: 'beam', sprite: 'lightball', count: 6, duration: 620, background: '#334155' }),
  'poison-sting': common('Poison', { type: 'projectile_trail', sprite: 'poisonwisp', count: 4, duration: 420 }),
  'sludge-bomb': common('Poison', { type: 'poison_cloud', sprite: 'poisonwisp', count: 7, duration: 620, background: '#581c87' }),
  toxic: common('Poison', { type: 'status_cloud', sprite: 'poisonwisp', count: 7, duration: 680, background: '#3b0764' }),
  gust: common('Flying', { type: 'gust', sprite: 'wind', count: 6, duration: 520 }),
  'wing-attack': common('Flying', { type: 'slash', sprite: 'rightslash', overlay: 'flying', count: 3 }),
  hurricane: common('Flying', { type: 'gust', sprite: 'wind', count: 12, duration: 820, background: '#0f172a', shake: 'medium' }),
  'karate-chop': common('Fighting', { type: 'slash', sprite: 'rightslash', overlay: 'fighting' }),
  'double-kick': common('Fighting', { type: 'impact_multi', sprite: 'foot', count: 2, duration: 360, shake: 'light' }),
  'drain-punch': common('Fighting', { type: 'drain_hit', sprite: 'fist', count: 4, duration: 620 }),
  tackle: common('Normal', { type: 'contact_attack', sprite: 'impact', count: 1, duration: 280 }),
  scratch: common('Normal', { type: 'slash', sprite: 'rightslash', count: 2, duration: 280 }),
  'quick-attack': common('Normal', { type: 'contact_attack', sprite: 'impact', count: 2, duration: 220 }),
  'body-slam': common('Normal', { type: 'contact_attack', sprite: 'impact', count: 4, duration: 420, shake: 'light' }),
  'hyper-beam': common('Normal', { type: 'charge_beam', sprite: 'shine', count: 10, duration: 980, background: '#111827', shake: 'heavy' }),

  // Status and field moves
  'swords-dance': common('Normal', { type: 'status_swords', sprite: 'sword', count: 4, duration: 650, self: true }),
  growl: common('Normal', { type: 'status_rings', sprite: 'wisp', count: 3, duration: 460 }),
  leer: common('Normal', { type: 'status_rings', sprite: 'shine', count: 2, duration: 420 }),
  'tail-whip': common('Normal', { type: 'status_rings', sprite: 'shine', count: 2, duration: 420 }),
  recover: common('Normal', { type: 'heal', sprite: 'shine', count: 7, duration: 720, self: true }),
  roost: common('Flying', { type: 'heal', sprite: 'shine', count: 6, duration: 680, self: true }),
  'soft-boiled': common('Normal', { type: 'heal', sprite: 'shine', count: 6, duration: 680, self: true }),
  'rain-dance': common('Water', { type: 'weather_rain', sprite: 'waterwisp', count: 12, duration: 760, background: '#075985', self: true }),
  'sunny-day': common('Fire', { type: 'weather_sun', sprite: 'shine', count: 10, duration: 760, background: '#7c2d12', self: true }),
  sandstorm: common('Rock', { type: 'weather_sand', sprite: 'rock1', count: 12, duration: 760, background: '#713f12', self: true }),
  hail: common('Ice', { type: 'snowstorm', sprite: 'icicle', count: 12, duration: 760, background: '#164e63', self: true }),
  snowscape: common('Ice', { type: 'snowstorm', sprite: 'icicle', count: 12, duration: 760, background: '#164e63', self: true }),
};

const includesAny = (name, words) => words.some(word => name.includes(word));

export const resolveMoveAnimation = (moveName, moveData = {}) => {
  const moveKey = String(moveName || '')
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (MOVE_ANIMATIONS[moveKey]) return MOVE_ANIMATIONS[moveKey];

  const type = moveData?.type || 'Normal';
  const color = TYPE_COLORS[type] || TYPE_COLORS.Normal;
  const category = moveData?.category || 'Physical';
  const power = Number(moveData?.power || 0);
  const effect = String(moveData?.effect || '').toLowerCase();
  const base = TYPE_FALLBACKS[type] || TYPE_FALLBACKS.Normal;
  const highPower = power >= 90;
  const mediumPower = power >= 60;

  if (category === 'Status' || power === 0) {
    if (includesAny(moveKey, ['dance', 'calm-mind', 'nasty-plot', 'agility', 'growth', 'bulk-up', 'harden', 'withdraw', 'defense-curl'])) {
      return common(type, { type: 'status_aura', sprite: 'shine', color, count: 5, duration: 620, self: true });
    }
    if (includesAny(moveKey, ['rain', 'sunny', 'sandstorm', 'hail', 'snowscape', 'terrain', 'room'])) {
      return common(type, { type: 'field_effect', sprite: base.sprite || 'shine', color, count: 10, duration: 760, background: color, self: true });
    }
    if (includesAny(moveKey, ['recover', 'heal', 'roost', 'moonlight', 'synthesis', 'soft-boiled', 'life-dew'])) {
      return common(type, { type: 'heal', sprite: 'shine', color, count: 7, duration: 720, self: true });
    }
    if (includesAny(moveKey, ['toxic', 'powder', 'spore', 'poison', 'sleep', 'stun'])) {
      return common(type, { type: 'status_cloud', sprite: type === 'Poison' ? 'poisonwisp' : 'wisp', color, count: 7, duration: 620 });
    }
    return common(type, { type: 'status_rings', sprite: 'shine', color, count: 3, duration: 480, self: effect.includes('user') || effect.includes('raises') });
  }

  if (includesAny(moveKey, ['bite', 'crunch', 'fang'])) {
    return common(type, { type: 'dual_impact', sprite: 'topbite', color, count: 2, duration: 320, overlay: type.toLowerCase(), shake: mediumPower ? 'light' : null });
  }
  if (includesAny(moveKey, ['punch', 'jab', 'strike', 'hammer', 'slam'])) {
    return common(type, { type: 'impact_flash', sprite: 'fist', color, count: highPower ? 5 : 3, duration: 340, overlay: type.toLowerCase(), shake: mediumPower ? 'light' : null });
  }
  if (includesAny(moveKey, ['kick', 'stomp', 'jump'])) {
    return common(type, { type: 'impact_multi', sprite: 'foot', color, count: moveKey.includes('double') ? 2 : 3, duration: 360, overlay: type.toLowerCase(), shake: mediumPower ? 'light' : null });
  }
  if (includesAny(moveKey, ['slash', 'cut', 'blade', 'scissor', 'chop', 'tail', 'claw', 'cutter'])) {
    return common(type, { type: 'slash', sprite: moveKey.includes('left') ? 'leftslash' : 'rightslash', color, count: highPower ? 4 : 3, duration: 320, overlay: type.toLowerCase(), shake: highPower ? 'light' : null });
  }
  if (includesAny(moveKey, ['thrower', 'pump', 'spray', 'breath', 'stream', 'cannon'])) {
    return common(type, { type: 'stream', sprite: base.sprite || 'lightball', color, count: highPower ? 12 : 8, duration: highPower ? 760 : 620, background: highPower ? color : null, shake: highPower ? 'medium' : null });
  }
  if (includesAny(moveKey, ['beam', 'ray'])) {
    return common(type, { type: highPower ? 'charge_beam' : 'beam', sprite: base.sprite || 'lightball', color, count: highPower ? 9 : 6, duration: highPower ? 900 : 620, background: highPower ? color : null, shake: highPower ? 'medium' : null });
  }
  if (includesAny(moveKey, ['pulse', 'aura', 'sphere', 'ball'])) {
    return common(type, { type: type === 'Ghost' || type === 'Dark' ? 'shadow_orbs' : 'dragon_pulse', sprite: base.sprite || 'lightball', color, count: highPower ? 7 : 5, duration: 560, background: highPower ? color : null });
  }
  if (includesAny(moveKey, ['quake', 'earth', 'bulldoze', 'magnitude'])) {
    return common(type, { type: 'quake', sprite: 'rock1', color, count: highPower ? 10 : 6, duration: highPower ? 900 : 620, background: color, shake: highPower ? 'heavy' : 'medium' });
  }
  if (includesAny(moveKey, ['drain', 'absorb', 'leech', 'kiss', 'dream-eater'])) {
    return common(type, { type: 'drain', sprite: base.sprite || 'wisp', color, count: 5, duration: 700, background: color });
  }
  if (includesAny(moveKey, ['meteor', 'storm', 'eruption', 'blast'])) {
    return common(type, { type: moveKey.includes('meteor') ? 'meteor_rain' : 'burst', sprite: base.sprite || 'lightball', color, count: 10, duration: 820, background: color, shake: 'heavy' });
  }

  if (category === 'Physical') {
    return common(type, { type: base.type === 'projectile_trail' ? base.type : 'contact_attack', sprite: base.sprite || 'impact', color, count: highPower ? 4 : 2, duration: highPower ? 420 : 300, overlay: type.toLowerCase(), shake: highPower ? 'light' : null });
  }

  return common(type, { ...base, color, count: highPower ? 7 : 4, duration: highPower ? 680 : 480, background: highPower ? color : null, shake: highPower ? 'light' : null });
};

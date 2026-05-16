// src/data/moveAnimations.js
// Sprites de efeito do Pokémon Showdown - todos são PNG públicos
export const FX_BASE = 'https://play.pokemonshowdown.com/fx/';

// Mapeamento de cores por tipo (para fallbacks)
export const TYPE_COLORS = {
  'Fire':     '#ff4422', 'Water':    '#3399ff', 'Grass':    '#77cc55', 'Electric': '#ffcc33',
  'Ice':      '#66ccff', 'Fighting': '#bb5544', 'Poison':   '#aa5599', 'Ground':   '#ddbb55',
  'Flying':   '#8899ff', 'Psychic':  '#ff5599', 'Bug':      '#aabb22', 'Rock':     '#bbaa66',
  'Ghost':    '#6666bb', 'Dragon':   '#7766ee', 'Dark':     '#705848', 'Steel':    '#aaaabb',
  'Fairy':    '#ee99ee', 'Normal':   '#a8a878'
};

// type = como a animação se comporta
// projectile      → sprite vai do atacante ao defensor
// projectile_trail → vários sprites em sequência
// burst           → explodem a partir do alvo
// lightning_strike → cai do céu sobre o alvo
// impact_flash    → flash + impacto no alvo
// slash           → corte rápido no alvo
// drain           → vai ao alvo e volta (sugando)
// quake           → pedras sobem do chão no alvo
// charge_projectile → carrega no atacante depois dispara
// beam            → feixe contínuo do atacante ao alvo
// pulse           → pulso que expande a partir do alvo
// wave            → onda que se expande
// dual_impact     → mandíbulas fechando
// high_frequency_stream → fluxo contínuo (Flamethrower/Hydro Pump)

export const MOVE_ANIMATIONS = {
  // ── FOGO ────────────────────────────────────────
  'ember':           { type: 'projectile',        sprite: 'fireball',     color: '#ff8800', count: 3, duration: 380 },
  'flamethrower':    { type: 'high_frequency_stream', sprite: 'fireball',     color: '#ff6600', count: 5, duration: 800 },
  'fire-blast':      { type: 'burst',             sprite: 'fireball',     color: '#ff4400', count: 8, duration: 600 },
  'fire-punch':      { type: 'impact_flash',          sprite: 'fist',         color: '#ff6600', count: 3, duration: 350 },
  'flare-blitz':     { type: 'charge_projectile', sprite: 'fireball',     color: '#ff2200', count: 6, duration: 550 },
  'heat-wave':       { type: 'high_frequency_stream', sprite: 'fireball',     color: '#ff5500', count: 4, duration: 600 },
  'fire-fang':       { type: 'dual_impact',           sprite: 'fireball',     color: '#ff6600', count: 3, duration: 320 },
  'lava-plume':      { type: 'burst',             sprite: 'fireball',     color: '#ff3300', count: 7, duration: 550 },
  'sacred-fire':     { type: 'projectile_trail',  sprite: 'bluefireball', color: '#ffaa00', count: 5, duration: 520 },
  'torch-song':      { type: 'burst',             sprite: 'fireball',     color: '#ff6600', count: 5, duration: 480 },

  // ── ÁGUA ────────────────────────────────────────
  'water-gun':       { type: 'projectile',        sprite: 'waterwisp',    color: '#44aaff', count: 2, duration: 320 },
  'bubble-beam':     { type: 'high_frequency_stream', sprite: 'bubble',       color: '#88ddff', count: 5, duration: 600 },
  'surf':            { type: 'wave',              sprite: 'waterwisp',    color: '#0088ee', count: 5, duration: 600 },
  'hydro-pump':      { type: 'high_frequency_stream', sprite: 'waterwisp',    color: '#0099ff', count: 8, duration: 700 },
  'scald':           { type: 'high_frequency_stream', sprite: 'waterwisp',    color: '#ff9944', count: 4, duration: 500 },
  'waterfall':       { type: 'charge_projectile', sprite: 'waterwisp',    color: '#0099ff', count: 4, duration: 450 },
  'aqua-jet':        { type: 'projectile',        sprite: 'waterwisp',    color: '#44aaff', count: 3, duration: 280 },
  'aqua-tail':       { type: 'slash',             sprite: 'waterwisp',    color: '#0099ff', count: 3, duration: 320 },

  // ── ELÉTRICO ────────────────────────────────────
  'thunderbolt':     { type: 'lightning_strike',  sprite: 'lightning',    color: '#ffff44', count: 3, duration: 400 },
  'thunder':         { type: 'lightning_strike',  sprite: 'lightning',    color: '#ffffff', count: 5, duration: 550 },

  // ── DARK ────────────────────────────────────────
  'bite':            { type: 'dual_impact',       sprite: 'topbite',      color: '#443388', count: 2, duration: 280 },
  'crunch':          { type: 'dual_impact',       sprite: 'topbite',      color: '#332266', count: 2, duration: 300 },

  // ── NORMAL ──────────────────────────────────────
  'tackle':          { type: 'impact_flash',      sprite: 'impact',       color: '#aaaaaa', count: 1, duration: 280 },
  'quick-attack':    { type: 'impact_flash',      sprite: 'impact',       color: '#dddddd', count: 1, duration: 200 },
  'hyper-beam':      { type: 'beam',              sprite: 'shine',        color: '#ffffff', count: 1, duration: 800 },
};

/**
 * Resolve dinamicamente a animação de um golpe baseado no nome, tipo e categoria.
 */
export const resolveMoveAnimation = (moveName, moveData) => {
  const moveKey = moveName.toLowerCase().replace(/\s+/g, '-');
  
  // 1. Verificar se existe definição manual (Prioridade máxima)
  if (MOVE_ANIMATIONS[moveKey]) return MOVE_ANIMATIONS[moveKey];

  // 2. Inteligência por Palavras-Chave (Smart Resolver)
  const name = moveKey;
  const type = moveData?.type || 'Normal';
  const color = TYPE_COLORS[type] || '#ffffff';
  const isPhysical = moveData?.category === 'Physical';
  const isStatus = moveData?.category === 'Status';

  // Mordidas / Presas (COMPOSTAS)
  if (name.includes('bite') || name.includes('crunch') || name.includes('fang')) {
    return { 
      type: 'dual_impact', 
      sprite: 'topbite', 
      color, 
      count: 2, 
      duration: 300,
      isComposite: true,
      overlay: (name.includes('fire') || name.includes('ice') || name.includes('thunder') || name.includes('poison')) ? type.toLowerCase() : null
    };
  }

  // Socos (COMPOSTOS)
  if (name.includes('punch') || name.includes('jab') || name.includes('strike') || name.includes('hammer')) {
    return { 
      type: 'impact_flash', 
      sprite: 'fist', 
      color, 
      count: 3, 
      duration: 320,
      isComposite: true,
      overlay: (type === 'Fire' || type === 'Ice' || type === 'Electric') ? type.toLowerCase() : null
    };
  }

  // Chutes (COMPOSTOS)
  if (name.includes('kick') || name.includes('stomp') || name.includes('jump')) {
    return { 
      type: 'impact_flash', 
      sprite: 'foot', 
      color, 
      count: 3, 
      duration: 320,
      isComposite: true,
      overlay: (type === 'Fire' || type === 'Electric' || name.includes('blaze') || name.includes('thunder')) ? type.toLowerCase() : null
    };
  }

  // Cortes / Lâminas
  if (name.includes('slash') || name.includes('cut') || name.includes('blade') || name.includes('scissor') || name.includes('chop') || name.includes('tail') || name.includes('claw')) {
    return { type: 'slash', sprite: 'rightslash', color, count: 3, duration: 300, overlay: (type === 'Fire' || type === 'Ice' || type === 'Electric') ? type.toLowerCase() : null };
  }

  // Jatos / Ondas (Elemental)
  if (name.includes('thrower') || name.includes('pump') || name.includes('spray') || name.includes('wave') || name.includes('breath') || name.includes('stream')) {
    return { type: 'high_frequency_stream', sprite: type === 'Water' ? 'waterwisp' : 'fireball', color, count: 5, duration: 700, overlay: type.toLowerCase() };
  }

  // Raios / Feixes
  if (name.includes('beam') || name.includes('cannon') || name.includes('ray')) {
    return { type: 'beam', sprite: 'lightball', color, count: 4, duration: 600, overlay: (type === 'Electric' || type === 'Ice' || type === 'Fire') ? type.toLowerCase() : null };
  }

  // Pulsos / Auras
  if (name.includes('pulse') || name.includes('aura') || name.includes('sphere')) {
    return { type: 'pulse', sprite: 'lightball', color, count: 4, duration: 450, overlay: (type === 'Fire' || type === 'Water' || type === 'Electric') ? type.toLowerCase() : null };
  }

  // 3. Fallback por Categoria / Tipo
  if (isStatus) {
    return { type: 'pulse', sprite: 'shine', color, count: 2, duration: 400 };
  }

  if (isPhysical) {
    return { type: 'impact_flash', sprite: 'impact', color, count: 1, duration: 250, overlay: (type === 'Fire' || type === 'Ice' || type === 'Electric') ? type.toLowerCase() : null };
  }

  // Fallback Geral (Mágica elemental)
  return { 
    type: 'projectile', 
    sprite: type === 'Fire' ? 'fireball' : type === 'Water' ? 'waterwisp' : type === 'Electric' ? 'electroball' : 'lightball', 
    color, 
    count: 3, 
    duration: 400,
    overlay: (type === 'Fire' || type === 'Water' || type === 'Electric' || type === 'Ice') ? type.toLowerCase() : null
  };
};

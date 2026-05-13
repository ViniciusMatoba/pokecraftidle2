// src/data/moveAnimations.js
// Sprites de efeito do Pokémon Showdown - todos são PNG públicos
export const FX_BASE = 'https://play.pokemonshowdown.com/fx/';

// Fallback genérico por tipo de golpe
export const TYPE_FX = {
  Fire:     { sprite: 'fireball',     color: '#ff6600' },
  Water:    { sprite: 'waterwisp',    color: '#0099ff' },
  Electric: { sprite: 'electroball',  color: '#ffff00' },
  Grass:    { sprite: 'energyball',   color: '#44ff44' },
  Ice:      { sprite: 'iceball',      color: '#aaeeff' },
  Psychic:  { sprite: 'mistball',     color: '#ff44ff' },
  Ghost:    { sprite: 'shadowball',   color: '#8844ff' },
  Dark:     { sprite: 'shadowball',   color: '#443388' },
  Dragon:   { sprite: 'bluefireball', color: '#4488ff' },
  Fighting: { sprite: 'fist',         color: '#ff8844' },
  Rock:     { sprite: 'rock1',        color: '#aa8855' },
  Ground:   { sprite: 'rock2',        color: '#cc9944' },
  Bug:      { sprite: 'energyball',   color: '#88ff44' },
  Poison:   { sprite: 'energyball',   color: '#cc44cc' },
  Steel:    { sprite: 'electroball',  color: '#aaaacc' },
  Fairy:    { sprite: 'mistball',     color: '#ffaaee' },
  Flying:   { sprite: 'shine',        color: '#aaccff' },
  Normal:   { sprite: 'impact',       color: '#888888' },
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

export const MOVE_ANIMATIONS = {
  // ── FOGO ────────────────────────────────────────
  'ember':           { type: 'projectile',        sprite: 'fireball',     color: '#ff8800', count: 3, duration: 380 },
  'flamethrower':    { type: 'projectile_trail',  sprite: 'fireball',     color: '#ff6600', count: 5, duration: 500 },
  'fire-blast':      { type: 'burst',             sprite: 'fireball',     color: '#ff4400', count: 8, duration: 600 },
  'fire-punch':      { type: 'impact_flash',      sprite: 'fireball',     color: '#ff6600', count: 3, duration: 350 },
  'flare-blitz':     { type: 'charge_projectile', sprite: 'fireball',     color: '#ff2200', count: 6, duration: 550 },
  'heat-wave':       { type: 'burst',             sprite: 'fireball',     color: '#ff5500', count: 6, duration: 500 },
  'fire-fang':       { type: 'impact_flash',      sprite: 'fireball',     color: '#ff6600', count: 3, duration: 320 },
  'lava-plume':      { type: 'burst',             sprite: 'fireball',     color: '#ff3300', count: 7, duration: 550 },
  'sacred-fire':     { type: 'projectile_trail',  sprite: 'bluefireball', color: '#ffaa00', count: 5, duration: 520 },
  'torch-song':      { type: 'burst',             sprite: 'fireball',     color: '#ff6600', count: 5, duration: 480 },
  'flame-charge':    { type: 'charge_projectile', sprite: 'fireball',     color: '#ff8800', count: 4, duration: 450 },
  'pyro-ball':       { type: 'charge_projectile', sprite: 'fireball',     color: '#ff3300', count: 5, duration: 520 },
  'bitter-blade':    { type: 'drain',             sprite: 'fireball',     color: '#ffaa44', count: 4, duration: 500 },
  'scorching-sands': { type: 'burst',             sprite: 'rock2',        color: '#ff9944', count: 5, duration: 480 },

  // ── ÁGUA ────────────────────────────────────────
  'water-gun':       { type: 'projectile',        sprite: 'waterwisp',    color: '#44aaff', count: 2, duration: 320 },
  'bubble-beam':     { type: 'projectile_trail',  sprite: 'waterwisp',    color: '#88ddff', count: 4, duration: 420 },
  'surf':            { type: 'wave',              sprite: 'waterwisp',    color: '#0088ee', count: 5, duration: 600 },
  'hydro-pump':      { type: 'projectile_trail',  sprite: 'waterwisp',    color: '#0099ff', count: 6, duration: 520 },
  'scald':           { type: 'projectile_trail',  sprite: 'waterwisp',    color: '#ff9944', count: 4, duration: 450 },
  'waterfall':       { type: 'charge_projectile', sprite: 'waterwisp',    color: '#0099ff', count: 4, duration: 450 },
  'aqua-jet':        { type: 'projectile',        sprite: 'waterwisp',    color: '#44aaff', count: 3, duration: 280 },
  'aqua-tail':       { type: 'slash',             sprite: 'waterwisp',    color: '#0099ff', count: 3, duration: 320 },
  'aqua-step':       { type: 'charge_projectile', sprite: 'waterwisp',    color: '#44aaff', count: 4, duration: 430 },
  'water-pulse':     { type: 'pulse',             sprite: 'waterwisp',    color: '#44aaff', count: 3, duration: 450 },
  'liquidation':     { type: 'charge_projectile', sprite: 'waterwisp',    color: '#0077ff', count: 5, duration: 480 },
  'origin-pulse':    { type: 'burst',             sprite: 'waterwisp',    color: '#0099ff', count: 8, duration: 600 },

  // ── ELÉTRICO ────────────────────────────────────
  'thunder-shock':   { type: 'projectile',        sprite: 'electroball',  color: '#ffff00', count: 2, duration: 320 },
  'thunderbolt':     { type: 'lightning_strike',  sprite: 'lightning',    color: '#ffff00', count: 3, duration: 400 },
  'thunder':         { type: 'lightning_strike',  sprite: 'lightning',    color: '#ffffaa', count: 5, duration: 520 },
  'thunder-punch':   { type: 'impact_flash',      sprite: 'electroball',  color: '#ffff00', count: 3, duration: 350 },
  'discharge':       { type: 'burst',             sprite: 'electroball',  color: '#ffee00', count: 8, duration: 500 },
  'nuzzle':          { type: 'impact_flash',      sprite: 'electroball',  color: '#ffee44', count: 3, duration: 320 },
  'spark':           { type: 'projectile',        sprite: 'electroball',  color: '#ffff00', count: 3, duration: 350 },
  'volt-tackle':     { type: 'charge_projectile', sprite: 'electroball',  color: '#ffff00', count: 5, duration: 520 },
  'wild-charge':     { type: 'charge_projectile', sprite: 'electroball',  color: '#ffdd00', count: 4, duration: 480 },
  'electro-drift':   { type: 'projectile_trail',  sprite: 'electroball',  color: '#ffff44', count: 5, duration: 480 },
  'supercell-slam':  { type: 'charge_projectile', sprite: 'lightning',    color: '#ffff00', count: 5, duration: 520 },

  // ── GELO ────────────────────────────────────────
  'powder-snow':     { type: 'projectile_trail',  sprite: 'iceball',      color: '#ccffff', count: 4, duration: 380 },
  'ice-punch':       { type: 'impact_flash',      sprite: 'iceball',      color: '#aaeeff', count: 3, duration: 340 },
  'ice-beam':        { type: 'beam',              sprite: 'iceball',      color: '#aaeeff', count: 4, duration: 450 },
  'blizzard':        { type: 'burst',             sprite: 'iceball',      color: '#ccffff', count: 9, duration: 600 },
  'ice-fang':        { type: 'impact_flash',      sprite: 'icicle',       color: '#aaeeff', count: 3, duration: 320 },
  'icicle-crash':    { type: 'projectile_trail',  sprite: 'icicle',       color: '#aaddff', count: 4, duration: 420 },
  'freeze-dry':      { type: 'burst',             sprite: 'iceball',      color: '#bbeeee', count: 6, duration: 500 },
  'ice-spinner':     { type: 'charge_projectile', sprite: 'iceball',      color: '#aaeeff', count: 4, duration: 430 },
  'chilling-water':  { type: 'wave',              sprite: 'iceball',      color: '#aaddff', count: 4, duration: 480 },
  'triple-axel':     { type: 'impact_multi',      sprite: 'iceball',      color: '#aaeeff', count: 3, duration: 350 },

  // ── PLANTA ──────────────────────────────────────
  'vine-whip':       { type: 'slash',             sprite: 'leaf1',        color: '#44ff44', count: 2, duration: 300 },
  'razor-leaf':      { type: 'projectile_trail',  sprite: 'leaf1',        color: '#66ff44', count: 4, duration: 400 },
  'solar-beam':      { type: 'charge_projectile', sprite: 'energyball',   color: '#ffff44', count: 6, duration: 700 },
  'absorb':          { type: 'drain',             sprite: 'energyball',   color: '#22cc22', count: 3, duration: 450 },
  'mega-drain':      { type: 'drain',             sprite: 'energyball',   color: '#22cc22', count: 4, duration: 470 },
  'giga-drain':      { type: 'drain',             sprite: 'energyball',   color: '#22dd22', count: 5, duration: 520 },
  'energy-ball':     { type: 'projectile',        sprite: 'energyball',   color: '#44ff44', count: 3, duration: 430 },
  'leaf-storm':      { type: 'burst',             sprite: 'leaf1',        color: '#88ff44', count: 9, duration: 620 },
  'leaf-blade':      { type: 'slash',             sprite: 'leaf2',        color: '#66ff44', count: 3, duration: 320 },
  'power-whip':      { type: 'slash',             sprite: 'leaf1',        color: '#44ff44', count: 3, duration: 320 },
  'trailblaze':      { type: 'charge_projectile', sprite: 'leaf2',        color: '#88ff44', count: 4, duration: 420 },
  'matcha-gotcha':   { type: 'drain',             sprite: 'energyball',   color: '#44ff88', count: 5, duration: 520 },
  'horn-leech':      { type: 'drain',             sprite: 'leaf1',        color: '#44ff44', count: 4, duration: 480 },

  // ── PSÍQUICO ────────────────────────────────────
  'confusion':       { type: 'pulse',             sprite: 'mistball',     color: '#ff88ff', count: 3, duration: 420 },
  'psybeam':         { type: 'projectile',        sprite: 'mistball',     color: '#ee44ee', count: 4, duration: 430 },
  'psychic':         { type: 'pulse',             sprite: 'mistball',     color: '#ff44ff', count: 4, duration: 500 },
  'psycho-cut':      { type: 'slash',             sprite: 'mistball',     color: '#ff88ff', count: 3, duration: 320 },
  'zen-headbutt':    { type: 'impact_flash',      sprite: 'mistball',     color: '#ff88ff', count: 3, duration: 340 },
  'psychic-fangs':   { type: 'impact_flash',      sprite: 'mistball',     color: '#ff88ff', count: 3, duration: 340 },
  'luster-purge':    { type: 'beam',              sprite: 'mistball',     color: '#ffaaff', count: 4, duration: 480 },
  'psyblade':        { type: 'slash',             sprite: 'mistball',     color: '#ff44ff', count: 3, duration: 340 },
  'lumina-crash':    { type: 'burst',             sprite: 'shine',        color: '#ffaaff', count: 6, duration: 500 },

  // ── FANTASMA ────────────────────────────────────
  'lick':            { type: 'impact_flash',      sprite: 'shadowball',   color: '#8844ff', count: 2, duration: 280 },
  'shadow-sneak':    { type: 'projectile',        sprite: 'shadowball',   color: '#8844ff', count: 2, duration: 320 },
  'shadow-ball':     { type: 'projectile',        sprite: 'shadowball',   color: '#8844ff', count: 3, duration: 430 },
  'shadow-claw':     { type: 'slash',             sprite: 'shadowball',   color: '#6622ff', count: 3, duration: 320 },
  'phantom-force':   { type: 'charge_projectile', sprite: 'shadowball',   color: '#7733ff', count: 5, duration: 560 },
  'hex':             { type: 'burst',             sprite: 'shadowball',   color: '#6622ee', count: 5, duration: 460 },
  'spirit-shackle':  { type: 'projectile',        sprite: 'shadowball',   color: '#8844ff', count: 3, duration: 420 },
  'astral-barrage':  { type: 'burst',             sprite: 'shadowball',   color: '#aa66ff', count: 7, duration: 560 },

  // ── DARK ────────────────────────────────────────
  'bite':            { type: 'impact_flash',      sprite: 'topbite',      color: '#443388', count: 2, duration: 280 },
  'crunch':          { type: 'impact_multi',      sprite: 'topbite',      color: '#332266', count: 3, duration: 340 },
  'dark-pulse':      { type: 'pulse',             sprite: 'shadowball',   color: '#443388', count: 4, duration: 460 },
  'knock-off':       { type: 'slash',             sprite: 'rightchop',    color: '#554477', count: 2, duration: 300 },
  'sucker-punch':    { type: 'impact_flash',      sprite: 'fist',         color: '#443388', count: 3, duration: 300 },
  'nasty-plot':      { type: 'pulse',             sprite: 'shadowball',   color: '#663399', count: 3, duration: 400 },
  'wicked-torque':   { type: 'burst',             sprite: 'shadowball',   color: '#443388', count: 5, duration: 480 },
  'kowtow-cleave':   { type: 'slash',             sprite: 'leftslash',    color: '#554477', count: 3, duration: 320 },

  // ── LUTADOR ─────────────────────────────────────
  'karate-chop':     { type: 'slash',             sprite: 'rightchop',    color: '#ff8844', count: 2, duration: 300 },
  'low-kick':        { type: 'impact_flash',      sprite: 'foot',         color: '#ff8844', count: 2, duration: 300 },
  'seismic-toss':    { type: 'impact_flash',      sprite: 'fist',         color: '#ff8844', count: 3, duration: 380 },
  'close-combat':    { type: 'impact_multi',      sprite: 'fist',         color: '#ffaa44', count: 5, duration: 420 },
  'drain-punch':     { type: 'drain',             sprite: 'fist',         color: '#ff6644', count: 3, duration: 460 },
  'power-up-punch':  { type: 'impact_flash',      sprite: 'fist',         color: '#ff8800', count: 3, duration: 340 },
  'aura-sphere':     { type: 'projectile',        sprite: 'energyball',   color: '#4488ff', count: 3, duration: 420 },
  'focus-blast':     { type: 'charge_projectile', sprite: 'energyball',   color: '#4466ff', count: 4, duration: 560 },
  'mach-punch':      { type: 'impact_flash',      sprite: 'fist',         color: '#ffaa44', count: 2, duration: 260 },
  'high-jump-kick':  { type: 'impact_flash',      sprite: 'foot',         color: '#ffaa44', count: 3, duration: 340 },
  'brick-break':     { type: 'impact_flash',      sprite: 'rightchop',    color: '#ffaa44', count: 3, duration: 340 },
  'collision-course':{ type: 'charge_projectile', sprite: 'fist',         color: '#ff6600', count: 6, duration: 560 },
  'combat-torque':   { type: 'impact_multi',      sprite: 'fist',         color: '#ff8844', count: 4, duration: 400 },

  // ── DRAGÃO ──────────────────────────────────────
  'dragon-rage':     { type: 'projectile',        sprite: 'bluefireball', color: '#4488ff', count: 3, duration: 420 },
  'dragon-claw':     { type: 'slash',             sprite: 'leftclaw',     color: '#6644ff', count: 3, duration: 340 },
  'dragon-pulse':    { type: 'projectile',        sprite: 'bluefireball', color: '#4488ff', count: 4, duration: 450 },
  'outrage':         { type: 'burst',             sprite: 'bluefireball', color: '#3366ff', count: 7, duration: 540 },
  'dragon-rush':     { type: 'charge_projectile', sprite: 'bluefireball', color: '#4466ff', count: 5, duration: 520 },
  'draco-meteor':    { type: 'burst',             sprite: 'bluefireball', color: '#5599ff', count: 8, duration: 620 },
  'glaive-rush':     { type: 'charge_projectile', sprite: 'bluefireball', color: '#4488ff', count: 6, duration: 560 },
  'dragon-dance':    { type: 'pulse',             sprite: 'bluefireball', color: '#4488ff', count: 3, duration: 440 },

  // ── PEDRA ───────────────────────────────────────
  'rock-throw':      { type: 'projectile',        sprite: 'rock1',        color: '#aa8855', count: 2, duration: 360 },
  'rock-slide':      { type: 'projectile_trail',  sprite: 'rock2',        color: '#998877', count: 4, duration: 420 },
  'stone-edge':      { type: 'projectile_trail',  sprite: 'rock1',        color: '#aaaaaa', count: 5, duration: 460 },
  'rock-blast':      { type: 'burst',             sprite: 'rock3',        color: '#aa8855', count: 5, duration: 440 },
  'head-smash':      { type: 'impact_flash',      sprite: 'impact',       color: '#aa8855', count: 4, duration: 380 },
  'stealth-rock':    { type: 'burst',             sprite: 'caltrop',      color: '#887766', count: 4, duration: 420 },

  // ── TERRA ───────────────────────────────────────
  'earthquake':      { type: 'quake',             sprite: 'rock3',        color: '#aa8844', count: 7, duration: 620 },
  'magnitude':       { type: 'quake',             sprite: 'rock2',        color: '#bb9955', count: 5, duration: 560 },
  'earth-power':     { type: 'burst',             sprite: 'rock2',        color: '#cc9944', count: 6, duration: 520 },
  'bulldoze':        { type: 'quake',             sprite: 'rock3',        color: '#bb9944', count: 4, duration: 480 },
  'mud-shot':        { type: 'projectile',        sprite: 'rock3',        color: '#cc9944', count: 3, duration: 380 },
  'scorching-sands': { type: 'burst',             sprite: 'rock2',        color: '#ff9944', count: 5, duration: 480 },

  // ── INSETO ──────────────────────────────────────
  'twineedle':       { type: 'projectile_trail',  sprite: 'caltrop',      color: '#88ff44', count: 2, duration: 320 },
  'pin-missile':     { type: 'projectile_trail',  sprite: 'caltrop',      color: '#88ff44', count: 5, duration: 400 },
  'signal-beam':     { type: 'beam',              sprite: 'energyball',   color: '#88ff88', count: 4, duration: 450 },
  'bug-buzz':        { type: 'pulse',             sprite: 'energyball',   color: '#aaff44', count: 4, duration: 480 },
  'x-scissor':       { type: 'slash',             sprite: 'leftslash',    color: '#88ff44', count: 3, duration: 340 },
  'leech-life':      { type: 'drain',             sprite: 'web',          color: '#88dd44', count: 4, duration: 480 },
  'u-turn':          { type: 'slash',             sprite: 'rightclaw',    color: '#88ff44', count: 3, duration: 340 },
  'population-bomb': { type: 'burst',             sprite: 'caltrop',      color: '#aaff44', count: 7, duration: 520 },

  // ── VENENO ──────────────────────────────────────
  'poison-sting':    { type: 'projectile',        sprite: 'caltrop',      color: '#cc44cc', count: 2, duration: 320 },
  'sludge':          { type: 'projectile',        sprite: 'energyball',   color: '#aa44aa', count: 3, duration: 380 },
  'sludge-bomb':     { type: 'burst',             sprite: 'energyball',   color: '#aa44aa', count: 5, duration: 460 },
  'poison-jab':      { type: 'impact_flash',      sprite: 'energyball',   color: '#cc44cc', count: 3, duration: 340 },
  'cross-poison':    { type: 'slash',             sprite: 'leftclaw',     color: '#cc44cc', count: 3, duration: 320 },
  'gunk-shot':       { type: 'burst',             sprite: 'energyball',   color: '#aa44aa', count: 7, duration: 520 },
  'toxic-spikes':    { type: 'burst',             sprite: 'caltrop',      color: '#aa44aa', count: 4, duration: 420 },
  'malignant-chain': { type: 'projectile_trail',  sprite: 'energyball',   color: '#cc44cc', count: 5, duration: 500 },

  // ── AÇO ─────────────────────────────────────────
  'iron-tail':       { type: 'slash',             sprite: 'impact',       color: '#aaaacc', count: 3, duration: 340 },
  'iron-head':       { type: 'impact_flash',      sprite: 'impact',       color: '#aaaacc', count: 3, duration: 340 },
  'flash-cannon':    { type: 'beam',              sprite: 'electroball',  color: '#ccccff', count: 4, duration: 460 },
  'meteor-mash':     { type: 'impact_flash',      sprite: 'impact',       color: '#aaaacc', count: 4, duration: 380 },
  'bullet-punch':    { type: 'impact_flash',      sprite: 'fist',         color: '#aaaacc', count: 3, duration: 300 },
  'steel-beam':      { type: 'beam',              sprite: 'electroball',  color: '#ccccff', count: 5, duration: 500 },
  'tachyon-cutter':  { type: 'slash',             sprite: 'leftslash',    color: '#ccccff', count: 4, duration: 380 },
  'gigaton-hammer':  { type: 'impact_flash',      sprite: 'impact',       color: '#aaaacc', count: 5, duration: 420 },

  // ── FADA ────────────────────────────────────────
  'fairy-wind':      { type: 'projectile_trail',  sprite: 'mistball',     color: '#ffaaee', count: 3, duration: 380 },
  'moonblast':       { type: 'burst',             sprite: 'mistball',     color: '#ffaaee', count: 7, duration: 560 },
  'dazzling-gleam':  { type: 'burst',             sprite: 'shine',        color: '#ffffaa', count: 7, duration: 480 },
  'play-rough':      { type: 'impact_multi',      sprite: 'shine',        color: '#ffaadd', count: 4, duration: 400 },
  'draining-kiss':   { type: 'drain',             sprite: 'heart',        color: '#ffaaee', count: 4, duration: 480 },
  'strange-steam':   { type: 'projectile_trail',  sprite: 'mistball',     color: '#ffaaff', count: 4, duration: 460 },
  'misty-explosion': { type: 'burst',             sprite: 'mistball',     color: '#ffaabb', count: 8, duration: 580 },
  'alluring-voice':  { type: 'pulse',             sprite: 'mistball',     color: '#ffaaee', count: 4, duration: 460 },

  // ── VOADOR ──────────────────────────────────────
  'gust':            { type: 'projectile_trail',  sprite: 'shine',        color: '#aaccff', count: 3, duration: 360 },
  'wing-attack':     { type: 'slash',             sprite: 'rightslash',   color: '#aaccff', count: 2, duration: 300 },
  'air-slash':       { type: 'slash',             sprite: 'leftslash',    color: '#aaddff', count: 3, duration: 320 },
  'brave-bird':      { type: 'charge_projectile', sprite: 'shine',        color: '#aaccff', count: 5, duration: 480 },
  'hurricane':       { type: 'burst',             sprite: 'shine',        color: '#88bbff', count: 7, duration: 560 },
  'drill-peck':      { type: 'impact_flash',      sprite: 'rightchop',    color: '#aaccff', count: 3, duration: 340 },
  'oblivion-wing':   { type: 'drain',             sprite: 'shine',        color: '#aaccff', count: 4, duration: 500 },
  'sky-attack':      { type: 'charge_projectile', sprite: 'shine',        color: '#ffffaa', count: 6, duration: 580 },
  'jet-punch':       { type: 'impact_flash',      sprite: 'fist',         color: '#aaccff', count: 3, duration: 300 },

  // ── NORMAL / FÍSICO ─────────────────────────────
  'tackle':          { type: 'impact_flash',      sprite: 'impact',       color: '#888888', count: 2, duration: 280 },
  'scratch':         { type: 'slash',             sprite: 'leftslash',    color: '#888888', count: 2, duration: 280 },
  'slash':           { type: 'slash',             sprite: 'leftslash',    color: '#ffffff', count: 3, duration: 300 },
  'hyper-beam':      { type: 'beam',              sprite: 'shine',        color: '#ffffff', count: 7, duration: 700 },
  'body-slam':       { type: 'impact_flash',      sprite: 'impact',       color: '#888888', count: 3, duration: 340 },
  'double-edge':     { type: 'charge_projectile', sprite: 'impact',       color: '#888888', count: 4, duration: 440 },
  'take-down':       { type: 'charge_projectile', sprite: 'impact',       color: '#888888', count: 3, duration: 400 },
  'swift':           { type: 'projectile_trail',  sprite: 'shine',        color: '#ffffaa', count: 5, duration: 420 },
  'return':          { type: 'impact_flash',      sprite: 'heart',        color: '#ffaaaa', count: 3, duration: 360 },
  'quick-attack':    { type: 'impact_flash',      sprite: 'impact',       color: '#cccccc', count: 2, duration: 260 },
  'extreme-speed':   { type: 'charge_projectile', sprite: 'impact',       color: '#ffffff', count: 4, duration: 360 },
  'last-resort':     { type: 'burst',             sprite: 'shine',        color: '#ffcc44', count: 6, duration: 520 },
  'boomburst':       { type: 'burst',             sprite: 'impact',       color: '#ffffff', count: 8, duration: 600 },
  'hyper-voice':     { type: 'burst',             sprite: 'impact',       color: '#dddddd', count: 5, duration: 500 },
  'double-hit':      { type: 'impact_multi',      sprite: 'impact',       color: '#888888', count: 2, duration: 320 },
  'pay-day':         { type: 'projectile_trail',  sprite: 'shine',        color: '#ffcc00', count: 4, duration: 400 },
};

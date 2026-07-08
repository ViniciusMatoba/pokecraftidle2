import { MOVES } from './moves.js';

const TYPE_TO_TM_SPRITE = {
  Normal: 'tm-normal',
  Fire: 'tm-fire',
  Water: 'tm-water',
  Electric: 'tm-electric',
  Grass: 'tm-grass',
  Ice: 'tm-ice',
  Fighting: 'tm-fighting',
  Poison: 'tm-poison',
  Ground: 'tm-ground',
  Flying: 'tm-flying',
  Psychic: 'tm-psychic',
  Bug: 'tm-bug',
  Rock: 'tm-rock',
  Ghost: 'tm-ghost',
  Dragon: 'tm-dragon',
  Dark: 'tm-dark',
  Steel: 'tm-steel',
  Fairy: 'tm-fairy',
};

const TYPE_TO_ESSENCE = {
  Normal: 'normal_essence',
  Fire: 'fire_essence',
  Water: 'water_essence',
  Electric: 'electric_essence',
  Grass: 'grass_essence',
  Ice: 'ice_essence',
  Fighting: 'fighting_essence',
  Poison: 'poison_essence',
  Ground: 'ground_essence',
  Flying: 'flying_essence',
  Psychic: 'psychic_essence',
  Bug: 'bug_essence',
  Rock: 'rock_essence',
  Ghost: 'ghost_essence',
  Dragon: 'dragon_essence',
  Dark: 'dark_essence',
  Steel: 'steel_essence',
  Fairy: 'fairy_essence',
};

const TYPE_TO_TM_MATERIAL = {
  Normal: 'silk',
  Fire: 'ember_shard',
  Water: 'wave_stone',
  Electric: 'thunder_fang',
  Grass: 'leaf_debris',
  Ice: 'ice_crystal',
  Fighting: 'aura_fragment',
  Poison: 'poison_barb',
  Ground: 'hard_shell',
  Flying: 'feather',
  Psychic: 'spirit_dust',
  Bug: 'silk',
  Rock: 'hard_shell',
  Ghost: 'spirit_dust',
  Dragon: 'dragon_fang',
  Dark: 'sharp_claw',
  Steel: 'iron_ore',
  Fairy: 'pink_dust',
};

const OFFICIAL_TM_MOVE_IDS = [
  "acid-spray",
  "acrobatics",
  "aerial-ace",
  "agility",
  "air-cutter",
  "air-slash",
  "alluring-voice",
  "ally-switch",
  "amnesia",
  "assurance",
  "attract",
  "aura-sphere",
  "aurora-veil",
  "avalanche",
  "baton-pass",
  "beat-up",
  "bide",
  "blast-burn",
  "blizzard",
  "body-press",
  "body-slam",
  "bounce",
  "brave-bird",
  "breaking-swipe",
  "brick-break",
  "brine",
  "brutal-swing",
  "bubble-beam",
  "bug-bite",
  "bug-buzz",
  "bulk-up",
  "bulldoze",
  "bullet-seed",
  "burning-jealousy",
  "calm-mind",
  "captivate",
  "charge",
  "charge-beam",
  "charm",
  "chilling-water",
  "close-combat",
  "coaching",
  "confide",
  "confuse-ray",
  "counter",
  "cross-poison",
  "crunch",
  "curse",
  "dark-pulse",
  "dazzling-gleam",
  "defense-curl",
  "detect",
  "dig",
  "disarming-voice",
  "dive",
  "double-edge",
  "double-team",
  "draco-meteor",
  "dragon-breath",
  "dragon-cheer",
  "dragon-claw",
  "dragon-dance",
  "dragon-pulse",
  "dragon-rage",
  "dragon-tail",
  "drain-punch",
  "draining-kiss",
  "dream-eater",
  "drill-run",
  "dual-wingbeat",
  "dynamic-punch",
  "earth-power",
  "earthquake",
  "echoed-voice",
  "eerie-impulse",
  "egg-bomb",
  "electric-terrain",
  "electro-ball",
  "electroweb",
  "embargo",
  "encore",
  "endeavor",
  "endure",
  "energy-ball",
  "expanding-force",
  "explosion",
  "facade",
  "fake-tears",
  "false-swipe",
  "feather-dance",
  "fire-blast",
  "fire-fang",
  "fire-pledge",
  "fire-punch",
  "fire-spin",
  "fissure",
  "flame-charge",
  "flamethrower",
  "flare-blitz",
  "flash",
  "flash-cannon",
  "fling",
  "flip-turn",
  "fly",
  "focus-blast",
  "focus-punch",
  "foul-play",
  "frenzy-plant",
  "frost-breath",
  "frustration",
  "fury-cutter",
  "future-sight",
  "giga-drain",
  "giga-impact",
  "grass-knot",
  "grass-pledge",
  "grassy-glide",
  "grassy-terrain",
  "gravity",
  "guard-swap",
  "gunk-shot",
  "gyro-ball",
  "hail",
  "hard-press",
  "haze",
  "headbutt",
  "heat-crash",
  "heat-wave",
  "heavy-slam",
  "helping-hand",
  "hex",
  "hidden-power",
  "high-horsepower",
  "hone-claws",
  "horn-drill",
  "hurricane",
  "hydro-cannon",
  "hydro-pump",
  "hyper-beam",
  "hyper-voice",
  "ice-beam",
  "ice-fang",
  "ice-punch",
  "ice-spinner",
  "icicle-spear",
  "icy-wind",
  "imprison",
  "incinerate",
  "infestation",
  "iron-defense",
  "iron-head",
  "iron-tail",
  "knock-off",
  "lash-out",
  "leaf-storm",
  "leech-life",
  "light-screen",
  "liquidation",
  "low-kick",
  "low-sweep",
  "lunge",
  "magic-room",
  "magical-leaf",
  "mega-drain",
  "mega-kick",
  "mega-punch",
  "megahorn",
  "metal-claw",
  "metal-sound",
  "meteor-beam",
  "metronome",
  "mimic",
  "misty-explosion",
  "misty-terrain",
  "mud-shot",
  "mud-slap",
  "muddy-water",
  "mystical-fire",
  "nasty-plot",
  "natural-gift",
  "nature-power",
  "night-shade",
  "nightmare",
  "outrage",
  "overheat",
  "pain-split",
  "pay-day",
  "payback",
  "petal-blizzard",
  "phantom-force",
  "pin-missile",
  "play-rough",
  "pluck",
  "poison-jab",
  "poison-tail",
  "pollen-puff",
  "poltergeist",
  "pounce",
  "power-gem",
  "power-swap",
  "power-up-punch",
  "protect",
  "psybeam",
  "psych-up",
  "psychic",
  "psychic-fangs",
  "psychic-noise",
  "psychic-terrain",
  "psycho-cut",
  "psyshock",
  "psywave",
  "quash",
  "rage",
  "rain-dance",
  "razor-shell",
  "razor-wind",
  "recycle",
  "reflect",
  "rest",
  "retaliate",
  "return",
  "revenge",
  "reversal",
  "roar",
  "rock-blast",
  "rock-polish",
  "rock-slide",
  "rock-smash",
  "rock-tomb",
  "rollout",
  "roost",
  "round",
  "safeguard",
  "sand-tomb",
  "sandstorm",
  "scald",
  "scale-shot",
  "scary-face",
  "scorching-sands",
  "screech",
  "secret-power",
  "seed-bomb",
  "seismic-toss",
  "self-destruct",
  "shadow-ball",
  "shadow-claw",
  "shock-wave",
  "silver-wind",
  "skill-swap",
  "skitter-smack",
  "skull-bash",
  "sky-attack",
  "sky-drop",
  "sleep-talk",
  "sludge-bomb",
  "sludge-wave",
  "smack-down",
  "smart-strike",
  "snarl",
  "snatch",
  "snore",
  "snowscape",
  "soft-boiled",
  "solar-beam",
  "solar-blade",
  "speed-swap",
  "spikes",
  "spite",
  "stealth-rock",
  "steel-beam",
  "steel-wing",
  "stomping-tantrum",
  "stone-edge",
  "stored-power",
  "struggle-bug",
  "submission",
  "substitute",
  "sunny-day",
  "super-fang",
  "supercell-slam",
  "superpower",
  "surf",
  "swagger",
  "sweet-scent",
  "swift",
  "swords-dance",
  "tail-slap",
  "tailwind",
  "take-down",
  "taunt",
  "telekinesis",
  "teleport",
  "temper-flare",
  "tera-blast",
  "thief",
  "throat-chop",
  "thunder",
  "thunder-fang",
  "thunder-punch",
  "thunder-wave",
  "thunderbolt",
  "torment",
  "toxic",
  "toxic-spikes",
  "trailblaze",
  "tri-attack",
  "trick",
  "trick-room",
  "triple-axel",
  "u-turn",
  "upper-hand",
  "uproar",
  "vacuum-wave",
  "venoshock",
  "volt-switch",
  "water-gun",
  "water-pledge",
  "water-pulse",
  "waterfall",
  "weather-ball",
  "whirlpool",
  "whirlwind",
  "wild-charge",
  "will-o-wisp",
  "wonder-room",
  "work-up",
  "x-scissor",
  "zap-cannon",
  "zen-headbutt"
];

const toTitleCase = (value) => String(value)
  .split('-')
  .map(part => (part ? part[0].toUpperCase() + part.slice(1) : part))
  .join(' ');

const getTmRecipeTier = (move) => {
  if (!move || move.category === 'Status') return 1;
  const power = Number(move.power || 0);
  if (power >= 120) return 4;
  if (power >= 90) return 3;
  if (power >= 60) return 2;
  return 1;
};

const TM_TIER_COSTS = {
  1: { essence: 40, material: 5, currency: 5000 },
  2: { essence: 80, material: 10, currency: 18000 },
  3: { essence: 140, material: 20, currency: 52000 },
  4: { essence: 240, material: 35, currency: 120000 },
};

const buildOfficialTmRecipes = () => OFFICIAL_TM_MOVE_IDS.map(moveId => {
  const move = MOVES[moveId];
  const moveType = move?.type || 'Normal';
  const tier = getTmRecipeTier(move);
  const tierCost = TM_TIER_COSTS[tier];
  const essence = TYPE_TO_ESSENCE[moveType] || 'normal_essence';
  const material = TYPE_TO_TM_MATERIAL[moveType] || 'silk';
  return {
    id: 'tm_' + moveId.replace(/-/g, '_'),
    name: 'TM ' + (move?.name || toTitleCase(moveId)),
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/' + (TYPE_TO_TM_SPRITE[moveType] || 'tm-normal') + '.png',
    cost: { [essence]: tierCost.essence, [material]: tierCost.material, currency: tierCost.currency },
    type: 'tm',
    moveId,
    tier,
    effect: (move?.category || 'Move') + ' - ' + moveType + (move?.power ? ' / Poder ' + move.power : ''),
  };
});
export const CRAFTING_RECIPES = {
  consumables: [
    { id: 'pokeballs', name: 'Poké Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', cost: { normal_essence: 10, currency: 100 }, type: 'ball' },
    { id: 'great_ball', name: 'Great Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', cost: { iron_ore: 5, normal_essence: 20, currency: 400 }, type: 'ball' },
    { id: 'ultra_ball', name: 'Ultra Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', cost: { mystic_dust: 5, iron_ore: 10, currency: 1200 }, type: 'ball' },
    { id: 'safari_ball', name: 'Safari Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/safari-ball.png', cost: { apricorn: 5, normal_essence: 8, currency: 300 }, type: 'ball', description: 'Usada exclusivamente na Safari Zone.' },
    { id: 'pokemon_bait', name: 'Isca Pokémon', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/honey.png', cost: { oran_berry: 3, normal_essence: 5, currency: 150 }, type: 'safari', description: 'Reduz chance de fuga em 40% e facilita captura na Safari Zone.' },
    { id: 'mud_ball', name: 'Bola de Lama', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soft-sand.png', cost: { earth_essence: 5, currency: 100 }, type: 'safari', description: 'Aumenta chance de captura mas irrita o Pokémon, aumentando fuga.' },
    { id: 'revive', name: 'Revive', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png', cost: { grass_essence: 15, ghost_essence: 5, currency: 500 }, type: 'healing' },
    { id: 'max_repel', name: 'Max Repel', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-repel.png', cost: { poison_essence: 20, psychic_essence: 5, currency: 300 }, type: 'utility' },
    { id: 'ability_capsule', name: 'Ability Capsule', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ability-capsule.png', cost: { normal_essence: 40, psychic_essence: 20, mystic_dust: 8, currency: 8000 }, type: 'utility', description: 'Permite alterar a habilidade de um Pokemon para outra habilidade do proprio Pokemon.' },
    { id: 'fire_stone', name: 'Fire Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png', cost: { fire_stone_shard: 5, fire_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'water_stone', name: 'Water Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png', cost: { water_stone_shard: 5, water_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'leaf_stone', name: 'Leaf Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png', cost: { leaf_stone_shard: 5, grass_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'thunder_stone', name: 'Thunder Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png', cost: { thunder_stone_shard: 5, electric_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'moon_stone', name: 'Moon Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png', cost: { moon_stone_shard: 5, normal_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'sun_stone', name: 'Sun Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png', cost: { sun_stone_shard: 5, grass_essence: 10, fire_essence: 10, currency: 2500 }, type: 'evolution' },
    { id: 'shiny_stone', name: 'Shiny Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-stone.png', cost: { shiny_stone_shard: 5, psychic_essence: 10, fairy_essence: 10, currency: 3000 }, type: 'evolution' },
    { id: 'dusk_stone', name: 'Dusk Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-stone.png', cost: { dusk_stone_shard: 5, ghost_essence: 10, dark_essence: 10, currency: 3000 }, type: 'evolution' },
    { id: 'dawn_stone', name: 'Dawn Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dawn-stone.png', cost: { dawn_stone_shard: 5, psychic_essence: 10, fighting_essence: 10, currency: 3000 }, type: 'evolution' },
    { id: 'ice_stone',    name: 'Ice Stone',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ice-stone.png',    cost: { ice_stone_shard: 5, ice_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'link_cable',   name: 'Link Cable',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/up-grade.png',       cost: { link_cable_part: 5, electric_essence: 10, normal_essence: 10, currency: 5000 }, type: 'evolution' },
    { id: 'magmarizer',   name: 'Magmarizer',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/magmarizer.png',    cost: { magmarizer_shard: 5, fire_essence: 15, currency: 4000 }, type: 'evolution', description: 'Item de evolução: Magmar → Magmortar via Cabo Link.' },
    { id: 'electirizer',  name: 'Electirizer',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/electirizer.png',   cost: { electirizer_shard: 5, electric_essence: 15, currency: 4000 }, type: 'evolution', description: 'Item de evolução: Electabuzz → Electivire via Cabo Link.' },
    { id: 'kings_rock',   name: "King's Rock",  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kings-rock.png',    cost: { kings_rock_shard: 5, water_essence: 10, fighting_essence: 10, currency: 4000 }, type: 'evolution', description: 'Item de evolução: Poliwhirl → Politoed / Slowpoke → Slowking via Cabo Link.' },
    { id: 'reaper_cloth', name: 'Reaper Cloth', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/reaper-cloth.png',  cost: { reaper_cloth_shard: 5, ghost_essence: 15, dark_essence: 10, currency: 5000 }, type: 'evolution', description: 'Item de evolução: Dusclops → Dusknoir via Cabo Link.' },
    { id: 'prism_scale',  name: 'Prism Scale',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/prism-scale.png',   cost: { prism_scale_shard: 5, water_essence: 15, fairy_essence: 10, currency: 4000 }, type: 'evolution', description: 'Item de evolução: Feebas → Milotic via Cabo Link.' },
  ],
  hold_items: [
    // ── Tipo Normal ───────────────────────────────────────────────────────────
    { id: 'silk_scarf',    name: 'Silk Scarf',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/silk-scarf.png',    cost: { normal_essence: 50, silk: 20, currency: 5000 },           effect: '+20% Normal Dmg' },
    // ── Tipo Fogo ─────────────────────────────────────────────────────────────
    { id: 'charcoal',      name: 'Charcoal',        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charcoal.png',       cost: { fire_essence: 50, currency: 5000 },                        effect: '+20% Fire Dmg' },
    // ── Tipo Água ─────────────────────────────────────────────────────────────
    { id: 'mystic_water',  name: 'Mystic Water',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mystic-water.png',   cost: { water_essence: 50, currency: 5000 },                       effect: '+20% Water Dmg' },
    // ── Tipo Elétrico ─────────────────────────────────────────────────────────
    { id: 'magnet',        name: 'Magnet',           img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/magnet.png',         cost: { electric_essence: 50, currency: 5000 },                    effect: '+20% Electric Dmg' },
    // ── Tipo Planta ───────────────────────────────────────────────────────────
    { id: 'miracle_seed',  name: 'Miracle Seed',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/miracle-seed.png',   cost: { grass_essence: 50, currency: 5000 },                       effect: '+20% Grass Dmg' },
    // ── Tipo Gelo ─────────────────────────────────────────────────────────────
    { id: 'never_melt_ice',name: 'NeverMeltIce',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/never-melt-ice.png', cost: { ice_essence: 50, currency: 5000 },                         effect: '+20% Ice Dmg' },
    // ── Tipo Lutador ──────────────────────────────────────────────────────────
    { id: 'black_belt',    name: 'Black Belt',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/black-belt.png',     cost: { fighting_essence: 50, currency: 5000 },                    effect: '+20% Fighting Dmg' },
    // ── Tipo Veneno ───────────────────────────────────────────────────────────
    { id: 'poison_barb',   name: 'Poison Barb',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poison-barb.png',    cost: { poison_essence: 50, currency: 5000 },                      effect: '+20% Poison Dmg' },
    // ── Tipo Terra ────────────────────────────────────────────────────────────
    { id: 'soft_sand',     name: 'Soft Sand',        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soft-sand.png',      cost: { ground_essence: 50, currency: 5000 },                      effect: '+20% Ground Dmg' },
    // ── Tipo Voador ───────────────────────────────────────────────────────────
    { id: 'sharp_beak',    name: 'Sharp Beak',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sharp-beak.png',     cost: { flying_essence: 50, currency: 5000 },                      effect: '+20% Flying Dmg' },
    // ── Tipo Psíquico ─────────────────────────────────────────────────────────
    { id: 'twisted_spoon', name: 'Twisted Spoon',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/twisted-spoon.png',  cost: { psychic_essence: 50, currency: 5000 },                     effect: '+20% Psychic Dmg' },
    // ── Tipo Inseto ───────────────────────────────────────────────────────────
    { id: 'silver_powder', name: 'Silver Powder',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/silver-powder.png',  cost: { bug_essence: 50, silk: 10, currency: 5000 },               effect: '+20% Bug Dmg' },
    // ── Tipo Pedra ────────────────────────────────────────────────────────────
    { id: 'hard_stone',    name: 'Hard Stone',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hard-stone.png',     cost: { rock_essence: 50, iron_ore: 10, currency: 5000 },          effect: '+20% Rock Dmg' },
    // ── Tipo Fantasma ─────────────────────────────────────────────────────────
    { id: 'spell_tag',     name: 'Spell Tag',        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/spell-tag.png',      cost: { ghost_essence: 50, mystic_dust: 10, currency: 6000 },      effect: '+20% Ghost Dmg' },
    // ── Tipo Dragão ───────────────────────────────────────────────────────────
    { id: 'dragon_fang',   name: 'Dragon Fang',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-fang.png',    cost: { dragon_essence: 40, dragon_scale: 3, currency: 10000 },    effect: '+20% Dragon Dmg' },
    // ── Tipo Sombrio ──────────────────────────────────────────────────────────
    { id: 'black_glasses', name: 'Black Glasses',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/black-glasses.png',  cost: { dark_essence: 50, currency: 6000 },                        effect: '+20% Dark Dmg' },
    // ── Tipo Aço ──────────────────────────────────────────────────────────────
    { id: 'metal_coat',    name: 'Metal Coat',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png',     cost: { steel_essence: 50, iron_ore: 20, currency: 8000 },         effect: '+20% Steel Dmg' },
    // ── Tipo Fada ─────────────────────────────────────────────────────────────
    { id: 'fairy_feather', name: 'Fairy Feather',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pixie-plate.png',    cost: { fairy_essence: 50, pink_dust: 15, currency: 8000 },        effect: '+20% Fairy Dmg' },
    // ── Velocidade ────────────────────────────────────────────────────────────
    { id: 'quick_claw',    name: 'Quick Claw',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/quick-claw.png',     cost: { flying_essence: 30, steel_essence: 10, currency: 7000 },  effect: '+15% Velocidade/Dano' },
    // ── Itens Especiais ───────────────────────────────────────────────────────
    { id: 'leftovers',     name: 'Leftovers',        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leftovers.png',      cost: { normal_essence: 80, apricorn: 20, currency: 12000 },       effect: 'Recupera 5% HP/turno' },
    { id: 'life_orb',      name: 'Life Orb',         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/life-orb.png',       cost: { dragon_essence: 30, mystic_dust: 20, currency: 25000 },    effect: '+30% Dmg, -8% HP/turno' },
    { id: 'expert_belt',   name: 'Expert Belt',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/expert-belt.png',    cost: { fighting_essence: 60, steel_essence: 20, currency: 15000 },effect: '+20% Dmg Super-Efetivo' },
    { id: 'focus_sash',    name: 'Focus Sash',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-sash.png',     cost: { psychic_essence: 40, silk: 30, currency: 18000 },          effect: 'Sobrevive 1 golpe fatal' },
    // ── Competitivo & Gen 9 ───────────────────────────────────────────────────
    { id: 'choice_band',   name: 'Choice Band',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-band.png',    cost: { fighting_essence: 80, steel_essence: 40, currency: 20000 },effect: '+50% Ataque (Físico)' },
    { id: 'choice_specs',  name: 'Choice Specs',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-specs.png',   cost: { psychic_essence: 80, steel_essence: 40, currency: 20000 },effect: '+50% Sp.Atk' },
    { id: 'choice_scarf',  name: 'Choice Scarf',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-scarf.png',   cost: { flying_essence: 80, silk: 40, currency: 20000 },          effect: '+50% Velocidade' },
    { id: 'assault_vest',  name: 'Assault Vest',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/assault-vest.png',   cost: { fighting_essence: 60, normal_essence: 60, currency: 18000 },effect: '+50% Sp.Def' },
    { id: 'loaded_dice',   name: 'Loaded Dice',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/loaded-dice.png',    cost: { normal_essence: 50, rock_essence: 30, currency: 15000 },  effect: 'Garante 4-5 hits (golpes múltiplos)' },
    { id: 'clear_amulet',  name: 'Clear Amulet',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/clear-amulet.png',   cost: { psychic_essence: 50, mystic_dust: 30, currency: 15000 },  effect: 'Previne redução de stats' },
    { id: 'covert_cloak',  name: 'Covert Cloak',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/covert-cloak.png',   cost: { ghost_essence: 50, silk: 30, currency: 15000 },           effect: 'Imune a efeitos secundários do oponente' },
  ],
  elite_relics: [
    { 
      id: 'titan_shield', 
      name: 'Escudo de Titã', 
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png', 
      cost: { armor_fragment: 5, steel_essence: 30, iron_ore: 20, currency: 25000 }, 
      effect: '-20% Dano de Boss',
      description: 'Armadura reforçada que reduz o impacto dos ataques de Bosses Mundiais.',
      type: 'hold_item',
      isBossItem: true
    },
    { 
      id: 'adrenaline_potion', 
      name: 'Poção de Adrenalina', 
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/elixir.png', 
      cost: { fury_essence: 10, psychic_essence: 20, currency: 15000 }, 
      effect: '+25% Atk vs Boss',
      description: 'Estimulante químico que aumenta o poder ofensivo especificamente contra Bosses.',
      type: 'hold_item',
      isBossItem: true
    },
    { 
      id: 'penetration_pendant', 
      name: 'Pingente de Penetração', 
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sharp-beak.png', 
      cost: { stardust: 10, dragon_scale: 5, psychic_essence: 30, currency: 40000 }, 
      effect: 'Ignora 30% Def Boss',
      description: 'Pingente místico que permite encontrar brechas na armadura impenetrável de Bosses.',
      type: 'hold_item',
      isBossItem: true
    }
  ],
  tms: buildOfficialTmRecipes(),
  mega_stones: [
    { id: 'charizardite_x', name: 'Charizardite X', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charizardite-x.png', cost: { mega_stone_shard: 10, fire_essence: 100, dragon_essence: 50, currency: 50000 } },
    { id: 'charizardite_y', name: 'Charizardite Y', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charizardite-y.png', cost: { mega_stone_shard: 10, fire_essence: 100, flying_essence: 50, currency: 50000 } },
    { id: 'venusaurite', name: 'Venusaurite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/venusaurite.png', cost: { mega_stone_shard: 10, grass_essence: 100, poison_essence: 50, currency: 50000 } },
    { id: 'blastoisinite', name: 'Blastoisinite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/blastoisinite.png', cost: { mega_stone_shard: 10, water_essence: 100, steel_essence: 50, currency: 50000 } },
    { id: 'lucarionite', name: 'Lucarionite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucarionite.png', cost: { mega_stone_shard: 15, fighting_essence: 120, steel_essence: 80, currency: 75000 } },
    { id: 'garchompite', name: 'Garchompite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/garchompite.png', cost: { mega_stone_shard: 15, dragon_essence: 120, ground_essence: 80, currency: 75000 } },
    { id: 'gardevoirite', name: 'Gardevoirite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gardevoirite.png', cost: { mega_stone_shard: 10, psychic_essence: 100, fairy_essence: 50, currency: 50000 } },
    { id: 'blazikenite', name: 'Blazikenite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/blazikenite.png', cost: { mega_stone_shard: 10, fire_essence: 100, fighting_essence: 50, currency: 50000 } },
    { id: 'gengarite', name: 'Gengarite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gengarite.png', cost: { mega_stone_shard: 10, ghost_essence: 100, poison_essence: 50, currency: 55000 } },
    { id: 'metagrossite', name: 'Metagrossite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metagrossite.png', cost: { mega_stone_shard: 15, steel_essence: 120, psychic_essence: 80, currency: 80000 } },
    { id: 'mewtwonite_x', name: 'Mewtwonite X', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mewtwonite-x.png', cost: { mega_stone_shard: 25, psychic_essence: 200, fighting_essence: 100, currency: 150000 } },
    { id: 'mewtwonite_y', name: 'Mewtwonite Y', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mewtwonite-y.png', cost: { mega_stone_shard: 25, psychic_essence: 200, flying_essence: 100, currency: 150000 } },
    { id: 'alakazite', name: 'Alakazite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/alakazite.png', cost: { mega_stone_shard: 10, psychic_essence: 100, currency: 50000 } },
    { id: 'gyaradosite', name: 'Gyaradosite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gyaradosite.png', cost: { mega_stone_shard: 10, water_essence: 100, dark_essence: 50, currency: 50000 } },
    { id: 'salamencite', name: 'Salamencite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/salamencite.png', cost: { mega_stone_shard: 15, dragon_essence: 120, flying_essence: 80, currency: 80000 } },
    { id: 'tyranitarite', name: 'Tyranitarite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tyranitarite.png', cost: { mega_stone_shard: 15, rock_essence: 120, dark_essence: 80, currency: 80000 } },
    { id: 'beedrillite', name: 'Beedrillite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/beedrillite.png', cost: { mega_stone_shard: 10, bug_essence: 100, poison_essence: 50, currency: 40000 } },
    { id: 'pidgeotite', name: 'Pidgeotite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pidgeotite.png', cost: { mega_stone_shard: 10, flying_essence: 100, normal_essence: 50, currency: 40000 } },
    { id: 'slowbronite', name: 'Slowbronite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/slowbronite.png', cost: { mega_stone_shard: 10, water_essence: 100, psychic_essence: 50, currency: 45000 } },
    { id: 'kangaskhanite', name: 'Kangaskhanite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kangaskhanite.png', cost: { mega_stone_shard: 10, normal_essence: 150, currency: 50000 } },
    { id: 'pinsirite', name: 'Pinsirite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pinsirite.png', cost: { mega_stone_shard: 10, bug_essence: 100, flying_essence: 50, currency: 45000 } },
    { id: 'aerodactylite', name: 'Aerodactylite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/aerodactylite.png', cost: { mega_stone_shard: 10, rock_essence: 100, flying_essence: 50, currency: 50000 } },
    { id: 'ampharosite', name: 'Ampharosite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ampharosite.png', cost: { mega_stone_shard: 10, electric_essence: 100, dragon_essence: 50, currency: 50000 } },
    { id: 'steelixite', name: 'Steelixite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/steelixite.png', cost: { mega_stone_shard: 10, steel_essence: 100, ground_essence: 50, currency: 50000 } },
    { id: 'scizorite', name: 'Scizorite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scizorite.png', cost: { mega_stone_shard: 10, bug_essence: 100, steel_essence: 50, currency: 50000 } },
    { id: 'heracronite', name: 'Heracronite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heracronite.png', cost: { mega_stone_shard: 10, bug_essence: 100, fighting_essence: 50, currency: 50000 } },
    { id: 'houndoominite', name: 'Houndoominite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/houndoominite.png', cost: { mega_stone_shard: 10, fire_essence: 100, dark_essence: 50, currency: 50000 } },
    { id: 'sceptilite', name: 'Sceptilite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sceptilite.png', cost: { mega_stone_shard: 10, grass_essence: 100, dragon_essence: 50, currency: 50000 } },
    { id: 'swampertite', name: 'Swampertite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/swampertite.png', cost: { mega_stone_shard: 10, water_essence: 100, ground_essence: 50, currency: 50000 } },
    { id: 'sableyite', name: 'Sableyite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sableyite.png', cost: { mega_stone_shard: 10, dark_essence: 100, ghost_essence: 50, currency: 45000 } },
    { id: 'mawilite', name: 'Mawilite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mawilite.png', cost: { mega_stone_shard: 10, steel_essence: 100, fairy_essence: 50, currency: 45000 } },
    { id: 'aggronite', name: 'Aggronite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/aggronite.png', cost: { mega_stone_shard: 10, steel_essence: 150, currency: 55000 } },
    { id: 'medichamite', name: 'Medichamite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/medichamite.png', cost: { mega_stone_shard: 10, fighting_essence: 100, psychic_essence: 50, currency: 45000 } },
    { id: 'manectite', name: 'Manectite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/manectite.png', cost: { mega_stone_shard: 10, electric_essence: 100, currency: 45000 } },
    { id: 'sharpedonite', name: 'Sharpedonite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sharpedonite.png', cost: { mega_stone_shard: 10, water_essence: 100, dark_essence: 50, currency: 45000 } },
    { id: 'cameruptite', name: 'Cameruptite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cameruptite.png', cost: { mega_stone_shard: 10, fire_essence: 100, ground_essence: 50, currency: 45000 } },
    { id: 'altarianite', name: 'Altarianite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/altarianite.png', cost: { mega_stone_shard: 10, dragon_essence: 100, fairy_essence: 50, currency: 50000 } },
    { id: 'banettite', name: 'Banettite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/banettite.png', cost: { mega_stone_shard: 10, ghost_essence: 100, currency: 45000 } },
    { id: 'absolite', name: 'Absolite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/absolite.png', cost: { mega_stone_shard: 10, dark_essence: 100, currency: 50000 } },
    { id: 'glalitite', name: 'Glalitite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/glalitite.png', cost: { mega_stone_shard: 10, ice_essence: 100, currency: 45000 } },
    { id: 'latiasite', name: 'Latiasite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/latiasite.png', cost: { mega_stone_shard: 20, psychic_essence: 150, dragon_essence: 100, currency: 100000 } },
    { id: 'latiosite', name: 'Latiosite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/latiosite.png', cost: { mega_stone_shard: 20, psychic_essence: 150, dragon_essence: 100, currency: 100000 } },
    { id: 'abomasnowite', name: 'Abomasnowite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/abomasnowite.png', cost: { mega_stone_shard: 10, grass_essence: 100, ice_essence: 50, currency: 50000 } },
    { id: 'galladite', name: 'Galladite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/galladite.png', cost: { mega_stone_shard: 10, psychic_essence: 100, fighting_essence: 50, currency: 50000 } },
    { id: 'audinite', name: 'Audinite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/audinite.png', cost: { mega_stone_shard: 10, normal_essence: 100, fairy_essence: 50, currency: 40000 } },
    { id: 'diancite', name: 'Diancite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/diancite.png', cost: { mega_stone_shard: 30, rock_essence: 250, fairy_essence: 250, currency: 250000 } },
    { id: 'rayquazaite', name: 'Rayquazaite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meteorite.png', cost: { mega_stone_shard: 50, dragon_essence: 500, flying_essence: 500, currency: 500000 } },
    { id: 'raichuite_x', name: 'Raichuite X', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 15, electric_essence: 100, fighting_essence: 50, currency: 60000 } },
    { id: 'raichuite_y', name: 'Raichuite Y', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 15, electric_essence: 100, psychic_essence: 50, currency: 60000 } },
    { id: 'dragonitite', name: 'Dragonitite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 20, dragon_essence: 200, flying_essence: 100, currency: 100000 } },
    { id: 'meganiumite', name: 'Meganiumite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 15, grass_essence: 150, fairy_essence: 50, currency: 75000 } },
    { id: 'feraligatrite', name: 'Feraligatrite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 15, water_essence: 150, dark_essence: 50, currency: 75000 } },
    { id: 'skarmorite', name: 'Skarmorite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 15, steel_essence: 150, flying_essence: 50, currency: 75000 } },
    { id: 'emboarite', name: 'Emboarite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 15, fire_essence: 150, fighting_essence: 50, currency: 75000 } },
    { id: 'chesnaughtite', name: 'Chesnaughtite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 15, grass_essence: 150, fighting_essence: 50, currency: 75000 } },
    { id: 'delphoxite', name: 'Delphoxite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 15, fire_essence: 150, psychic_essence: 50, currency: 75000 } },
    { id: 'greninjite', name: 'Greninjite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 15, water_essence: 150, dark_essence: 50, currency: 75000 } },
    { id: 'baxcaliburite', name: 'Baxcaliburite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 20, dragon_essence: 200, ice_essence: 100, currency: 100000 } },
    { id: 'golisopodite', name: 'Golisopodite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 15, bug_essence: 150, water_essence: 50, currency: 80000 } },
    { id: 'heatranite', name: 'Heatranite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 25, fire_essence: 250, steel_essence: 100, currency: 150000 } },
    { id: 'darkraiite', name: 'Darkraiite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 25, dark_essence: 250, ghost_essence: 100, currency: 150000 } },
    { id: 'zeraoraite', name: 'Zeraoraite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 25, electric_essence: 250, fighting_essence: 100, currency: 150000 } },
    { id: 'chimechoite', name: 'Chimechoite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 10, psychic_essence: 100, ghost_essence: 50, currency: 50000 } },
    { id: 'victreebelite', name: 'Victreebelite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 10, grass_essence: 100, poison_essence: 50, currency: 50000 } },
    { id: 'starmiite', name: 'Starmiite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 10, water_essence: 100, psychic_essence: 50, currency: 50000 } },
    { id: 'barbaraclite', name: 'Barbaraclite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 10, rock_essence: 100, water_essence: 50, currency: 50000 } },
    { id: 'pyroarite', name: 'Pyroarite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 10, fire_essence: 100, normal_essence: 50, currency: 50000 } },
    { id: 'clefablite', name: 'Clefablite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 10, fairy_essence: 150, currency: 50000 } },
    { id: 'scolipidite', name: 'Scolipidite', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 10, bug_essence: 100, poison_essence: 50, currency: 50000 } },
    { id: 'lucarionite_z', name: 'Lucarionite Z', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 25, fighting_essence: 250, steel_essence: 150, currency: 150000 } },
    { id: 'absolite_z', name: 'Absolite Z', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 25, dark_essence: 250, fairy_essence: 150, currency: 150000 } },
    { id: 'garchompite_z', name: 'Garchompite Z', img: '/items/mega_stone_shard.webp', cost: { mega_stone_shard: 25, dragon_essence: 250, ground_essence: 150, currency: 150000 } },
    { id: 'lopunnite', name: 'Lopunnite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lopunnite.png', cost: { mega_stone_shard: 10, normal_essence: 100, fighting_essence: 50, currency: 50000 } },
  ],

  fishing_rods: [
    {
      id: 'old_rod',
      name: 'Vara Velha',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/old-rod.png',
      description: 'Pesca básica. Aumenta em 20% a chance de encontrar Pokémon de Água em rotas próximas a água.',
      effect: { type: 'fishing', tier: 1, waterBonus: 0.20 },
      cost: { normal_essence: 5, apricorn: 10, iron_ore: 3, currency: 500 },
      type: 'key_item',
      unique: true,
    },
    {
      id: 'good_rod',
      name: 'Vara Boa',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/good-rod.png',
      description: 'Vara de qualidade. Aumenta em 40% a chance de encontrar Pokémon de Água e pode atrair espécies de nível médio.',
      effect: { type: 'fishing', tier: 2, waterBonus: 0.40 },
      cost: { water_essence: 20, iron_ore: 15, silk: 10, currency: 3000 },
      type: 'key_item',
      unique: true,
      requires: 'old_rod',
    },
    {
      id: 'super_rod',
      name: 'Super Vara',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-rod.png',
      description: 'A melhor vara. Aumenta em 70% a chance de encontrar Pokémon de Água, incluindo espécies raras como Dratini e Gyarados.',
      effect: { type: 'fishing', tier: 3, waterBonus: 0.70 },
      cost: { water_essence: 50, dragon_scale: 3, iron_ore: 30, mystic_water: 20, currency: 15000 },
      type: 'key_item',
      unique: true,
      requires: 'good_rod',
    },
  ],

  repels: [
    {
      id: 'repel',
      name: 'Repel',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/repel.png',
      description: 'Enfraquece os Pokémon selvagens da rota por 3 minutos. Inimigos spawnados têm -20% de HP e Ataque.',
      effect: { type: 'timed', key: 'activeRepel', duration: 3 * 60 * 1000, hpMult: 0.80, atkMult: 0.80 },
      cost: { normal_essence: 15, apricorn: 5, currency: 400 },
      type: 'consumable',
      durationLabel: '3 min',
    },
    {
      id: 'super_repel',
      name: 'Super Repel',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-repel.png',
      description: 'Enfraquece os Pokémon selvagens por 8 minutos. Inimigos têm -35% de HP e Ataque.',
      effect: { type: 'timed', key: 'activeRepel', duration: 8 * 60 * 1000, hpMult: 0.65, atkMult: 0.65 },
      cost: { normal_essence: 30, poison_essence: 10, apricorn: 10, currency: 1200 },
      type: 'consumable',
      durationLabel: '8 min',
    },
    {
      id: 'max_repel',
      name: 'Max Repel',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-repel.png',
      description: 'Enfraquece os Pokémon selvagens por 15 minutos. Inimigos têm -50% de HP e Ataque.',
      effect: { type: 'timed', key: 'activeRepel', duration: 15 * 60 * 1000, hpMult: 0.50, atkMult: 0.50 },
      cost: { psychic_essence: 20, poison_essence: 20, mystic_dust: 10, currency: 3000 },
      type: 'consumable',
      durationLabel: '15 min',
    },
  ],

  incenses: [
    {
      id: 'lure',
      name: 'Isca',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/honey.png',
      description: 'Aumenta a taxa de spawn por 5 minutos. Spawn 40% mais rápido.',
      effect: { type: 'timed', key: 'activeLure', duration: 5 * 60 * 1000, spawnMult: 0.60 },
      cost: { grass_essence: 15, apricorn: 10, currency: 600 },
      type: 'consumable',
      durationLabel: '5 min',
    },
    {
      id: 'super_lure',
      name: 'Super Isca',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/honey.png',
      description: 'Aumenta a taxa de spawn por 10 minutos e +15% chance de Pokémon raro.',
      effect: { type: 'timed', key: 'activeLure', duration: 10 * 60 * 1000, spawnMult: 0.50, rarityBonus: 0.15 },
      cost: { grass_essence: 30, electric_essence: 10, apricorn: 20, currency: 2000 },
      type: 'consumable',
      durationLabel: '10 min',
    },
    {
      id: 'max_lure',
      name: 'Max Isca',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-toy.png',
      description: 'Spawn 60% mais rápido por 20 minutos e +30% chance de Pokémon raro.',
      effect: { type: 'timed', key: 'activeLure', duration: 20 * 60 * 1000, spawnMult: 0.40, rarityBonus: 0.30 },
      cost: { grass_essence: 60, psychic_essence: 20, mystic_dust: 15, currency: 6000 },
      type: 'consumable',
      durationLabel: '20 min',
    },
  ],

  badges_items: [
    {
      id: 'lucky_egg',
      name: 'Ovo Sortudo',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucky-egg.png',
      description: 'Todo o time ganha +50% XP por 30 minutos após ativar.',
      effect: { type: 'timed', key: 'activeLuckyEgg', duration: 30 * 60 * 1000, xpMult: 1.50 },
      cost: { normal_essence: 100, pink_dust: 30, gold_nugget: 3, currency: 25000 },
      type: 'consumable',
      durationLabel: '30 min',
    },
    {
      id: 'amulet_coin',
      name: 'Moeda Amuleto',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/amulet-coin.png',
      description: 'Dobra as moedas ganhas em batalha por 30 minutos.',
      effect: { type: 'timed', key: 'activeAmuletCoin', duration: 30 * 60 * 1000, coinMult: 2.0 },
      cost: { gold_nugget: 5, normal_essence: 50, currency: 10000 },
      type: 'consumable',
      durationLabel: '30 min',
    },
    {
      id: 'exp_share',
      name: 'Partilha Exp',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png',
      description: 'Distribui XP para todo o time por 60 minutos. 50% do XP vai para os que não lutaram.',
      effect: { type: 'timed', key: 'activeExpShare', duration: 60 * 60 * 1000, xpShare: 0.50 },
      cost: { normal_essence: 80, electric_essence: 30, mystic_dust: 20, currency: 20000 },
      type: 'consumable',
      durationLabel: '60 min',
    },
    {
      id: 'incense_luck',
      name: 'Incenso da Sorte',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/luck-incense.png',
      description: 'Duplica moedas ganhas em batalha por 45 minutos. Empilha com Moeda Amuleto.',
      effect: { type: 'timed', key: 'activeIncenseLuck', duration: 45 * 60 * 1000, coinMult: 2.0 },
      cost: { pink_dust: 20, normal_essence: 40, gold_nugget: 2, currency: 8000 },
      type: 'consumable',
      durationLabel: '45 min',
    },
    {
      id: 'cleanse_tag',
      name: 'Tag Pureza',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cleanse-tag.png',
      description: 'Reduz em 30% a chance de encontrar Pokémon selvagens por 20 minutos.',
      effect: { type: 'timed', key: 'activeCleanseTag', duration: 20 * 60 * 1000, encounterReduction: 0.30 },
      cost: { ghost_essence: 20, psychic_essence: 15, mystic_dust: 10, currency: 5000 },
      type: 'consumable',
      durationLabel: '20 min',
    },
    {
      id: 'soothe_bell',
      name: 'Sino da Calma',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soothe-bell.png',
      description: '+20% XP e +10% Defesa Especial para o time por 20 minutos.',
      effect: { type: 'timed', key: 'activeSootheBell', duration: 20 * 60 * 1000, xpMult: 1.20, spDefBonus: 0.10 },
      cost: { fairy_essence: 20, pink_dust: 15, normal_essence: 20, currency: 4000 },
      type: 'consumable',
      durationLabel: '20 min',
    },
    {
      id: 'scope_lens',
      name: 'Lente Escopo',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scope-lens.png',
      description: '+20% chance de crítico para o time por 15 minutos.',
      effect: { type: 'timed', key: 'activeScopeLens', duration: 15 * 60 * 1000, critBonus: 0.20 },
      cost: { electric_essence: 40, psychic_essence: 20, iron_ore: 15, currency: 8000 },
      type: 'consumable',
      durationLabel: '15 min',
    },
  ],

  apricorn_balls: [
    {
      id: 'lure_ball',
      name: 'Lure Ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure-ball.png',
      description: 'Taxa de captura 3x para Pokémon encontrados pescando com varas.',
      effect: { type: 'ball', catchMult: 3.0, condition: 'fishing' },
      cost: { apricorn: 3, water_essence: 5, currency: 800 },
      type: 'ball',
    },
    {
      id: 'moon_ball',
      name: 'Moon Ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-ball.png',
      description: 'Taxa de captura 4x para Pokémon que evoluem com Pedra da Lua (Clefairy, Jigglypuff, Nidoran).',
      effect: { type: 'ball', catchMult: 4.0, condition: 'moon_stone_evolver' },
      cost: { moon_stone_shard: 3, pink_dust: 5, currency: 1200 },
      type: 'ball',
    },
    {
      id: 'friend_ball',
      name: 'Friend Ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/friend-ball.png',
      description: 'O Pokémon capturado começa com alta amizade. XP bônus de +20%.',
      effect: { type: 'ball', catchMult: 1.0, xpBonus: 0.20 },
      cost: { grass_essence: 10, normal_essence: 10, apricorn: 5, currency: 1000 },
      type: 'ball',
    },
    {
      id: 'heavy_ball',
      name: 'Heavy Ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heavy-ball.png',
      description: 'Taxa de captura aumenta quanto mais pesado o Pokémon. Ótima para Snorlax, Onix e Golem.',
      effect: { type: 'ball', catchMult: 2.5, condition: 'heavy_pokemon' },
      cost: { rock_essence: 10, iron_ore: 15, currency: 1500 },
      type: 'ball',
    },
    {
      id: 'fast_ball',
      name: 'Fast Ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fast-ball.png',
      description: 'Taxa de captura 4x para Pokémon rápidos (Speed > 100). Ótima para Pidgeot, Alakazam e Jolteon.',
      effect: { type: 'ball', catchMult: 4.0, condition: 'fast_pokemon' },
      cost: { electric_essence: 8, flying_essence: 8, apricorn: 5, currency: 1200 },
      type: 'ball',
    },
    { id: 'level_ball', name: 'Level Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/level-ball.png', description: 'Taxa de captura até 8x quando seu nível é muito maior que o do inimigo.', effect: { type: 'ball', catchMult: 'level_diff' }, cost: { normal_essence: 15, apricorn: 8, currency: 1000 }, type: 'ball' }
  ],

  food: [
    {
      id: 'poke_food',
      name: 'Ração Pokémon',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',
      description: 'Ração básica. Restaura 30% de Energia. Pode ser fabricada com materiais simples.',
      effect: { type: 'stamina', restore: 30 },
      cost: { apricorn: 5, normal_essence: 10, currency: 200 },
      type: 'consumable',
    },
    {
      id: 'poke_food_premium',
      name: 'Ração Premium',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png',
      description: 'Ração de alta qualidade. Restaura 60% de Energia e cura status.',
      effect: { type: 'stamina', restore: 60, cureStatus: true },
      cost: { apricorn: 10, grass_essence: 15, normal_essence: 20, currency: 800 },
      type: 'consumable',
    },
  ],
  trainer_card: [
    {
      id: 'trainer_card_pikachu_badge',
      name: 'Botao Pikachu',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      description: 'Personalizacao do Trainer Card com energia eletrica.',
      cost: { electric_essence: 25, trainer_card_thread: 6, yellow_shard: 3 },
      type: 'trainer_card_custom',
    },
    {
      id: 'trainer_card_eevee_badge',
      name: 'Botao Eevee',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
      description: 'Personalizacao do Trainer Card com tema de evolucao.',
      cost: { normal_essence: 25, trainer_card_thread: 6, silk: 5 },
      type: 'trainer_card_custom',
    },
    {
      id: 'trainer_card_gengar_badge',
      name: 'Botao Gengar',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
      description: 'Personalizacao sombria para treinadores de rotas fantasma.',
      cost: { ghost_essence: 30, trainer_card_thread: 8, mystic_dust: 3 },
      type: 'trainer_card_custom',
    },
    {
      id: 'trainer_card_lucario_badge',
      name: 'Botao Lucario',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png',
      description: 'Personalizacao de aura para cards de alto poder.',
      cost: { fighting_essence: 35, steel_essence: 20, trainer_card_thread: 10 },
      type: 'trainer_card_custom',
    },
  ],
};

export const FORGE_MATERIAL_DROP_GUIDE = {
  oran_berry: { pokemonIds: [16, 19, 20, 25, 161, 263, 399], routeId: 'route_1', label: 'Bagas Oran aparecem nas rotas iniciais e no jardim da casa; derrote Pokemon comuns como Pidgey, Rattata e Zigzagoon.' },
  berry_oran: { pokemonIds: [16, 19, 20, 25, 161, 263, 399], routeId: 'route_1', label: 'Alias legado da Oran Berry; use rotas iniciais e o jardim da casa para coletar.' },
  // ── Pools de essência multi-região ─────────────────────────────────────────
  // Gerados a partir das rotas reais (scripts/analyze-pools.mjs): cada região tem
  // Pokémon do tipo presentes em suas rotas — TMs e receitas dropam em QUALQUER região.
  normal_essence: { pokemonIds: [
    16, 17, 18, 19, 52, 53, 133, 143,   // kanto: Pidgey, Rattata, Meowth, Eevee, Snorlax
    20, 22, 39, 40,                      // johto: Raticate, Fearow, Jigglypuff
    161, 164, 263, 264,                  // hoenn: Sentret, Noctowl, Zigzagoon, Linoone
    113, 289, 300, 399,                  // sinnoh: Chansey, Slaking, Skitty, Bidoof
    400, 428, 432, 504,                  // unova: Bibarel, Lopunny, Purugly, Patrat
    659, 660, 661, 667,                  // kalos: Bunnelby, Diggersby, Fletchling, Litleo
    137, 668, 731, 732,                  // alola: Porygon, Pyroar, Pikipek, Trumbeak
    733, 735, 760, 819,                  // galar: Toucannon, Gumshoos, Bewear, Skwovet
    915, 916, 924, 925,                  // paldea: Lechonk, Oinkologne, Tandemaus, Maushold
  ], routeId: 'route_1', label: 'Pokemon de tipo Normal em todas as regioes - Pidgey, Rattata, Zigzagoon, Lechonk.' },
  fire_essence: { pokemonIds: [
    4, 5, 6, 37, 126,                    // kanto: Charmander, Vulpix, Magmar
    38, 58, 59, 77,                      // johto: Ninetales, Growlithe, Arcanine, Ponyta
    78, 218, 219, 255,                   // hoenn: Rapidash, Slugma, Magcargo, Torchic
    390, 391, 392, 467,                  // sinnoh: Chimchar, Monferno, Infernape, Magmortar
    498, 499, 500, 513,                  // unova: Tepig, Pignite, Emboar, Pansear
    514, 555, 653, 654,                  // kalos: Simisear, Darmanitan, Fennekin, Braixen
    662, 663, 725,                       // alola: Fletchinder, Talonflame, Litten
    758, 813, 814, 815,                  // galar: Salazzle, Scorbunny, Raboot, Cinderace
    839, 851, 909, 910,                  // paldea: Coalossal, Centiskorch, Fuecoco, Crocalor
  ], routeId: 'pokemon_mansion', label: 'Pokemon de fogo em todas as regioes - Charmander, Torchic, Chimchar, Fuecoco.' },
  water_essence: { pokemonIds: [
    7, 8, 9, 55, 60, 120, 129,           // kanto: Squirtle, Golduck, Poliwag, Staryu, Magikarp
    61, 72, 73, 79,                      // johto: Poliwhirl, Tentacool, Slowpoke
    183, 184, 226, 258,                  // hoenn: Marill, Azumarill, Mantine, Mudkip
    271, 272, 393, 394,                  // sinnoh: Lombre, Ludicolo, Piplup, Prinplup
    400, 419, 501, 502,                  // unova: Bibarel, Floatzel, Oshawott, Dewott
    80, 131, 515, 516,                   // kalos: Slowbro, Lapras, Panpour, Simipour
    728, 729, 730, 746,                  // alola: Popplio, Brionne, Primarina, Wishiwashi
    748, 816, 817, 818,                  // galar: Toxapex, Sobble, Drizzile, Inteleon
    834, 847, 912, 913,                  // paldea: Drednaw, Barraskewda, Quaxly, Quaxwell
  ], routeId: 'route_19_20', label: 'Pokemon aquaticos em todas as regioes - Squirtle, Mudkip, Piplup, Quaxly.' },
  grass_essence: { pokemonIds: [
    1, 2, 3, 43, 44, 69, 70, 102,        // kanto: Bulbasaur, Oddish, Bellsprout, Exeggcute
    46, 152, 153,                        // johto: Paras, Chikorita, Bayleef
    189, 191, 192, 252,                  // hoenn: Jumpluff, Sunkern, Sunflora, Treecko
    274, 286, 387,                       // sinnoh: Nuzleaf, Breloom, Turtwig
    413, 495, 496, 497,                  // unova: Wormadam, Snivy, Servine, Serperior
    460, 556, 597, 650,                  // kalos: Abomasnow, Maractus, Ferroseed, Chespin
    103, 673, 722, 723,                  // alola: Exeggutor, Gogoat, Rowlet, Dartrix
    708, 756, 810, 811,                  // galar: Phantump, Shiinotic, Grookey, Thwackey
    906, 907, 908, 928,                  // paldea: Sprigatito, Floragato, Meowscarada, Smoliv
  ], routeId: 'viridian_forest', label: 'Pokemon planta em todas as regioes - Bulbasaur, Treecko, Rowlet, Sprigatito.' },
  electric_essence: { pokemonIds: [
    25, 26, 81, 82, 100, 101,            // kanto: Pikachu, Magnemite, Voltorb
    125, 170, 171, 172,                  // johto: Electabuzz, Chinchou, Lanturn, Pichu
    181, 309, 310, 311,                  // hoenn: Ampharos, Electrike, Manectric, Plusle
    403, 404, 405, 417,                  // sinnoh: Shinx, Luxio, Luxray, Pachirisu
    522, 523, 587, 595,                  // unova: Blitzle, Zebstrika, Emolga, Joltik
    694, 695, 702,                       // kalos: Helioptile, Heliolisk, Dedenne
    737, 738, 777,                       // alola: Charjabug, Vikavolt, Togedemaru
    835, 836, 848, 849,                  // galar: Yamper, Boltund, Toxel, Toxtricity
    921, 922, 923, 938,                  // paldea: Pawmi, Pawmo, Pawmot, Tadbulb
  ], routeId: 'power_plant', label: 'Pokemon eletricos em todas as regioes - Pikachu, Electrike, Shinx, Pawmi.' },
  ice_essence: { pokemonIds: [
    87, 91, 124, 131, 220, 221, 225, 238, // kanto/johto: Dewgong, Cloyster, Jynx, Lapras, Swinub, Delibird, Smoochum
    215,                                 // johto: Sneasel
    361, 362, 364, 365,                  // hoenn: Snorunt, Glalie, Sealeo, Walrein
    460, 461, 471, 473,                  // sinnoh: Abomasnow, Weavile, Glaceon, Mamoswine
    583, 584, 614, 615,                  // unova: Vanillish, Vanilluxe, Beartic, Cryogonal
    698, 699, 713,                       // kalos: Amaura, Aurorus, Avalugg
    740,                                 // alola: Crabominable
    866, 873, 875, 881,                  // galar: Mr. Rime, Frosmoth, Eiscue, Arctozolt
    974, 975, 997,                       // paldea: Cetoddle, Cetitan, Arctibax
  ], routeId: 'ice_path', label: 'Pokemon de gelo em todas as regioes - Jynx, Snorunt, Vanillish, Cetoddle.' },
  fighting_essence: { pokemonIds: [
    56, 57, 62, 66, 67, 68, 106, 107,    // kanto: Mankey, Poliwrath, Machop, Hitmonlee, Hitmonchan
    214, 237,                            // johto: Heracross, Hitmontop
    256, 257, 286, 296,                  // hoenn: Combusken, Blaziken, Breloom, Makuhita
    391, 392, 448, 454,                  // sinnoh: Monferno, Infernape, Lucario, Toxicroak
    499, 500, 532, 533, 534,             // unova: Pignite, Emboar, Timburr, Gurdurr, Conkeldurr
    652, 674, 675,                       // kalos: Chesnaught, Pancham, Pangoro
    739, 740, 759, 760,                  // alola: Crabrawler, Crabominable, Stufful, Bewear
    853, 865, 870,                       // galar: Grapploct, Sirfetch'd, Falinks
    914, 922, 923, 973,                  // paldea: Quaquaval, Pawmo, Pawmot, Flamigo
  ], routeId: 'route_22', label: 'Pokemon lutadores em todas as regioes - Machop, Makuhita, Timburr, Flamigo.' },
  poison_essence: { pokemonIds: [
    13, 14, 15, 23, 24, 29, 32, 41, 42, 88, 109, // kanto: Weedle, Ekans, Nidoran, Zubat, Grimer, Koffing
    168, 169,                            // johto: Ariados, Crobat
    269, 315,                            // hoenn: Dustox, Roselia
    406, 407, 434, 435,                  // sinnoh: Budew, Roserade, Stunky, Skuntank
    544, 545, 568, 569,                  // unova: Whirlipede, Scolipede, Trubbish, Garbodor
    690, 691,                            // kalos: Skrelp, Dragalge
    89, 747, 748,                        // alola: Muk, Mareanie, Toxapex
    758, 848, 849,                       // galar: Salazzle, Toxel, Toxtricity
    944, 945, 965, 966,                  // paldea: Shroodle, Grafaiai, Varoom, Revavroom
  ], routeId: 'pokemon_tower', label: 'Pokemon venenosos em todas as regioes - Ekans, Zubat, Trubbish, Shroodle.' },
  ground_essence: { pokemonIds: [
    27, 28, 31, 34, 50, 51, 111,         // kanto: Sandshrew, Nidoqueen, Nidoking, Diglett, Rhyhorn
    74, 75, 95, 112, 231,                // johto: Geodude, Onix, Rhydon, Phanpy
    259, 260, 290, 322, 328,             // hoenn: Marshtomp, Swampert, Nincada, Numel, Trapinch
    389, 423, 444, 445,                  // sinnoh: Torterra, Gastrodon, Gabite, Garchomp
    473, 529, 530, 537,                  // unova: Mamoswine, Drilbur, Excadrill, Seismitoad
    553, 660,                            // kalos: Krookodile, Diggersby
    105, 749, 750, 770,                  // alola: Marowak, Mudbray, Mudsdale, Palossand
    843, 844, 867,                       // galar: Silicobra, Sandaconda, Runerigus
    948, 949, 980,                       // paldea: Toedscool, Toedscruel, Clodsire
  ], routeId: 'rock_tunnel', label: 'Pokemon terrestres em todas as regioes - Sandshrew, Numel, Drilbur, Toedscool.' },
  earth_essence: { pokemonIds: [
    27, 28, 50, 51, 74, 75, 95, 111, 231, 328, // kanto/johto: Sandshrew, Diglett, Geodude, Onix, Phanpy, Trapinch
    259, 260, 290, 322,                  // hoenn: Marshtomp, Swampert, Nincada, Numel
    389, 423, 444, 445,                  // sinnoh: Torterra, Gastrodon, Gabite, Garchomp
    473, 529, 530, 537,                  // unova: Mamoswine, Drilbur, Excadrill, Seismitoad
    553, 660,                            // kalos: Krookodile, Diggersby
    105, 749, 750, 770,                  // alola: Marowak, Mudbray, Mudsdale, Palossand
    843, 844, 867,                       // galar: Silicobra, Sandaconda, Runerigus
    948, 949, 980,                       // paldea: Toedscool, Toedscruel, Clodsire
  ], routeId: 'rock_tunnel', label: 'Essencia de terra em todas as regioes - Sandshrew, Trapinch, Drilbur, Toedscool.' },
  flying_essence: { pokemonIds: [
    6, 12, 16, 17, 18, 21, 22, 123,      // kanto: Charizard, Butterfree, Pidgey, Spearow, Scyther
    41, 42, 164, 169, 176,               // johto: Zubat, Golbat, Noctowl, Crobat, Togetic
    166, 226, 284,                       // hoenn: Ledian, Mantine, Masquerain
    396, 397, 414, 416,                  // sinnoh: Starly, Staravia, Mothim, Vespiquen
    426, 430, 469,                       // unova: Drifblim, Honchkrow, Yanmega
    661, 662, 663, 666,                  // kalos: Fletchling, Fletchinder, Talonflame, Vivillon
    722, 723, 731, 733,                  // alola: Rowlet, Dartrix, Pikipek, Toucannon
    821, 822, 823,                       // galar: Rookidee, Corvisquire, Corviknight
    714, 931, 940, 941,                  // paldea: Noibat, Squawkabilly, Wattrel, Kilowattrel
  ], routeId: 'route_16_17_18', label: 'Pokemon voadores em todas as regioes - Pidgey, Starly, Fletchling, Wattrel.' },
  psychic_essence: { pokemonIds: [
    63, 64, 65, 80, 96, 97, 122, 196,    // kanto: Abra, Slowbro, Drowzee, Mr. Mime, Espeon
    79, 124, 177, 178,                   // johto: Slowpoke, Jynx, Natu, Xatu
    202, 280, 281, 282,                  // hoenn: Wobbuffet, Ralts, Kirlia, Gardevoir
    358, 437, 475,                       // sinnoh: Chimecho, Bronzong, Gallade
    376, 517, 518, 527,                  // unova: Metagross, Munna, Musharna, Woobat
    577, 655, 677, 678,                  // kalos: Solosis, Delphox, Espurr, Meowstic
    103, 765, 779,                       // alola: Exeggutor, Oranguru, Bruxish
    825, 826, 856, 857,                  // galar: Dottler, Orbeetle, Hatenna, Hattrem
    936, 954, 956, 976,                  // paldea: Armarouge, Rabsca, Espathra, Veluza
  ], routeId: 'saffron_city', label: 'Pokemon psiquicos em todas as regioes - Abra, Ralts, Munna, Espathra.' },
  bug_essence: { pokemonIds: [
    10, 11, 12, 13, 14, 15, 46, 123, 127, // kanto: Caterpie, Weedle, Paras, Scyther, Pinsir
    48, 166, 168, 193,                   // johto: Venonat, Ledian, Ariados, Yanma
    265, 266, 269, 284,                  // hoenn: Wurmple, Silcoon, Dustox, Masquerain
    401, 402, 413, 414, 416,             // sinnoh: Kricketot, Kricketune, Wormadam, Mothim, Vespiquen
    469, 542,                            // unova: Yanmega, Leavanny
    664, 666,                            // kalos: Scatterbug, Vivillon
    736, 737, 738, 742,                  // alola: Grubbin, Charjabug, Vikavolt, Cutiefly
    825, 826, 850, 851,                  // galar: Dottler, Orbeetle, Sizzlipede, Centiskorch
    917, 918, 919, 920,                  // paldea: Tarountula, Spidops, Nymble, Lokix
  ], routeId: 'viridian_forest', label: 'Pokemon insetos em todas as regioes - Caterpie, Wurmple, Grubbin, Nymble.' },
  rock_essence: { pokemonIds: [
    74, 75, 76, 95, 111, 138, 140, 142, 246, // kanto: Geodude, Onix, Rhyhorn, Omanyte, Kabuto, Aerodactyl, Larvitar
    112, 185, 213, 219,                  // johto: Rhydon, Sudowoodo, Shuckle, Magcargo
    299, 304, 305, 306,                  // hoenn: Nosepass, Aron, Lairon, Aggron
    408, 409, 410, 411,                  // sinnoh: Cranidos, Rampardos, Shieldon, Bastiodon
    524, 525, 526, 557,                  // unova: Roggenrola, Boldore, Gigalith, Dwebble
    688, 689, 696,                       // kalos: Binacle, Barbaracle, Tyrunt
    744, 745,                            // alola: Rockruff, Lycanroc
    834, 838, 839, 874,                  // galar: Drednaw, Carkol, Coalossal, Stonjourner
    932, 933, 934, 950,                  // paldea: Nacli, Naclstack, Garganacl, Klawf
  ], routeId: 'mt_moon', label: 'Pokemon de pedra em todas as regioes - Geodude, Aron, Roggenrola, Nacli.' },
  ghost_essence: { pokemonIds: [
    92, 93, 94,                          // kanto: Gastly, Haunter, Gengar
    200,                                 // johto: Misdreavus
    292, 302, 353, 354, 355, 356,        // hoenn: Shedinja, Sableye, Shuppet, Banette, Duskull, Dusclops
    426, 429, 442, 477,                  // sinnoh: Drifblim, Mismagius, Spiritomb, Dusknoir
    562, 563, 592, 593,                  // unova: Yamask, Cofagrigus, Frillish, Jellicent
    679, 680, 681, 708,                  // kalos: Honedge, Doublade, Aegislash, Phantump
    724, 770, 778, 781,                  // alola: Decidueye, Palossand, Mimikyu, Dhelmise
    855, 867, 885, 887,                  // galar: Polteageist, Runerigus, Dreepy, Dragapult
    911, 937, 947, 972,                  // paldea: Skeledirge, Ceruledge, Brambleghast, Houndstone
  ], routeId: 'pokemon_tower', label: 'Pokemon fantasmas em todas as regioes - Gastly, Shuppet, Yamask, Greavard.' },
  dragon_essence: { pokemonIds: [
    147, 148, 149,                       // kanto: Dratini, Dragonair, Dragonite
    230,                                 // johto: Kingdra
    329, 330, 334, 372, 373,             // hoenn: Vibrava, Flygon, Altaria, Shelgon, Salamence
    444, 445,                            // sinnoh: Gabite, Garchomp
    611, 612, 621, 633, 635,             // unova: Fraxure, Haxorus, Druddigon, Deino, Hydreigon
    691, 696, 697,                       // kalos: Dragalge, Tyrunt, Tyrantrum
    706, 776, 780, 782,                  // alola: Goodra, Turtonator, Drampa, Jangmo-o
    841, 842, 880, 882,                  // galar: Flapple, Appletun, Dracozolt, Dracovish
    714, 967, 978, 997,                  // paldea: Noibat, Cyclizar, Tatsugiri, Arctibax
  ], routeId: 'dragons_den', label: 'Pokemon dragoes em todas as regioes - Dratini, Bagon, Axew, Cyclizar.' },
  steel_essence: { pokemonIds: [
    81, 82,                              // kanto: Magnemite, Magneton
    205, 208, 212, 227,                  // johto: Forretress, Steelix, Scizor, Skarmory
    303, 304, 305, 306,                  // hoenn: Mawile, Aron, Lairon, Aggron
    395, 410, 411, 437, 448,             // sinnoh: Empoleon, Shieldon, Bastiodon, Bronzong, Lucario
    376, 530, 589, 597,                  // unova: Metagross, Excadrill, Escavalier, Ferroseed
    679, 680, 681, 707,                  // kalos: Honedge, Doublade, Aegislash, Klefki
    777,                                 // alola: Togedemaru
    823, 863, 878, 879,                  // galar: Corviknight, Perrserker, Cufant, Copperajah
    958, 959, 965, 966,                  // paldea: Tinkatuff, Tinkaton, Varoom, Revavroom
  ], routeId: 'power_plant', label: 'Pokemon de aco em todas as regioes - Magnemite, Aron, Ferroseed, Tinkatuff.' },
  fairy_essence: { pokemonIds: [
    35, 36, 39, 40, 700,                 // kanto: Clefairy, Jigglypuff, Sylveon
    173, 174, 175, 176,                  // johto: Cleffa, Igglybuff, Togepi, Togetic
    183, 184, 280, 281,                  // hoenn: Marill, Azumarill, Ralts, Kirlia
    122, 303, 468,                       // sinnoh: Mr. Mime, Mawile, Togekiss
    546, 547,                            // unova: Cottonee, Whimsicott
    669, 670, 671, 682,                  // kalos: Flabebe, Floette, Florges, Spritzee
    730, 742, 743, 755,                  // alola: Primarina, Cutiefly, Ribombee, Morelull
    756, 858, 860, 861,                  // galar: Shiinotic, Hatterene, Morgrem, Grimmsnarl
    926, 927, 958, 959,                  // paldea: Fidough, Dachsbun, Tinkatuff, Tinkaton
  ], routeId: 'mt_moon', label: 'Pokemon fadas em todas as regioes - Clefairy, Ralts, Flabebe, Fidough.' },
  dark_essence: { pokemonIds: [
    197,                                 // kanto: Umbreon
    198, 215, 228, 229,                  // johto: Murkrow, Sneasel, Houndour, Houndoom
    261, 262, 274, 275, 302, 359,        // hoenn: Poochyena, Mightyena, Nuzleaf, Shiftry, Sableye, Absol
    430, 434, 435, 461,                  // sinnoh: Honchkrow, Stunky, Skuntank, Weavile
    509, 510, 552, 553,                  // unova: Purrloin, Liepard, Krokorok, Krookodile
    633, 635, 658, 675,                  // kalos: Deino, Hydreigon, Greninja, Pangoro
    727,                                 // alola: Incineroar
    827, 828, 860, 861,                  // galar: Nickit, Thievul, Morgrem, Grimmsnarl
    908, 920, 942, 943,                  // paldea: Meowscarada, Lokix, Maschiff, Mabosstiff
  ], routeId: 'burned_tower', label: 'Pokemon sombrios em todas as regioes - Murkrow, Poochyena, Purrloin, Maschiff.' },
  iron_ore: { pokemonIds: [
    74, 75, 76, 81, 82, 95, 208,        // Gen 1-2: Geodude, Magnemite, Onix, Steelix
    304, 305, 306, 374, 375, 376,        // Gen 3: Aron, Beldum, Metagross
    299, 476, 436, 437, 408, 409,        // Gen 4: Nosepass, Probopass, Bronzor, Cranidos
    597, 598, 599, 600, 624, 625,        // Gen 5: Ferroseed, Klink, Pawniard
    679, 680, 681, 707,                  // Gen 6: Honedge, Klefki
    782, 783, 784, 809,                  // Gen 7: Jangmo-o, Melmetal
    878, 879, 884,                       // Gen 8: Cufant, Copperajah, Duraludon
    957, 958, 959, 968,                  // Gen 9: Tinkatink, Orthworm
  ], routeId: 'rock_tunnel', label: 'Cavernas e Pokemon minerais - Geodude, Onix, Steelix, Aron e Magnemite.' },
  apricorn: { pokemonIds: [
    43, 44, 46, 47, 102, 103,          // Gen 1: Oddish, Paras, Exeggcute
    187, 188, 189, 190, 191, 192, 204, // Gen 2: Hoppip, Aipom, Sunkern, Pineco
    285, 286, 315, 316, 357,           // Gen 3: Shroomish, Roselia, Tropius
    406, 420, 421, 455, 470,           // Gen 4: Budew, Cherubi, Carnivine, Leafeon
    546, 547, 548, 549, 590, 591,      // Gen 5: Cottonee, Petilil, Foongus
    669, 670, 671, 672, 673,           // Gen 6: Flabébé, Skiddo
    761, 762, 763, 753, 754,           // Gen 7: Bounsweet, Fomantis
    829, 830,                          // Gen 8: Gossifleur
    928, 929, 930, 940,                // Gen 9: Smoliv, Capsakid
  ], routeId: 'ilex_forest', label: 'Johto e florestas - Hoppip, Aipom, Sunkern e Pineco carregam Apricorns.' },
  mystic_dust: { pokemonIds: [
    92, 93, 94, 150, 151,              // Gen 1: Gastly, Mewtwo, Mew
    200, 201, 385,                     // Gen 2: Misdreavus, Unown, Jirachi
    302, 353, 354, 355, 356,           // Gen 3: Sableye, Shuppet, Duskull
    425, 426, 429, 479, 480, 481, 482, // Gen 4: Drifloon, Mismagius, Rotom, Trio
    607, 608, 609, 622, 623,           // Gen 5: Litwick, Golett
    708, 709, 710, 711,                // Gen 6: Phantump, Pumpkaboo
    778, 769, 770, 771,                // Gen 7: Mimikyu, Sandygast
    854, 855, 864, 885, 886, 887,      // Gen 8: Sinistea, Cursola, Dreepy
    971, 972, 946, 947, 987,           // Gen 9: Greavard, Bramblin
  ], routeId: 'pokemon_tower', label: 'Fantasma, lendarios, Unown e shinies dropam po mistico.' },
  fire_stone_shard: { pokemonIds: [37, 38, 58, 59, 77, 126, 136, 228, 322, 513, 554, 636, 757, 921, 667], routeId: 'pokemon_mansion', label: 'Pokemon de fogo e evolucoes por pedra dropam fragmentos de Fire Stone.' },
  water_stone_shard: { pokemonIds: [60, 61, 90, 91, 120, 121, 134, 183, 270, 318, 363, 456, 489, 564, 692, 771, 846], routeId: 'route_19_20', label: 'Pokemon aquaticos e evolucoes por pedra dropam fragmentos de Water Stone.' },
  leaf_stone_shard: { pokemonIds: [43, 44, 69, 70, 102, 103, 470, 187, 273, 285, 315, 420, 546, 548, 672, 755], routeId: 'ilex_forest', label: 'Pokemon planta e florestas dropam fragmentos de Leaf Stone.' },
  thunder_stone_shard: { pokemonIds: [25, 26, 81, 82, 100, 101, 135, 170, 179, 311, 312, 403, 417, 595, 694, 737, 848], routeId: 'power_plant', label: 'Pokemon eletricos dropam fragmentos de Thunder Stone.' },
  electirizer_shard: { pokemonIds: [125, 239, 466, 403, 404, 405, 522, 523, 587], routeId: 'power_plant', label: 'Electabuzz, Elekid, Electivire e eletricos fortes dropam fragmentos de Electirizer na Power Plant.' },
  moon_stone_shard: { pokemonIds: [35, 36, 39, 40, 173, 174, 300, 209, 517, 676, 742], routeId: 'mt_moon', label: 'Monte Lua e Pokemon lunares dropam fragmentos de Moon Stone.' },
  sun_stone_shard: { pokemonIds: [43, 44, 191, 192, 546, 548], routeId: 'national_park', label: 'Pokemon solares e flores dropam fragmentos de Sun Stone.' },
  shiny_stone_shard: { pokemonIds: [35, 176, 315, 407, 468, 670, 671], routeId: 'sinnoh_route_204', label: 'Pokemon belos, fadas e flores raras dropam fragmentos de Shiny Stone.' },
  dusk_stone_shard: { pokemonIds: [92, 93, 94, 198, 200, 353, 355, 607, 425, 710, 708, 854], routeId: 'pokemon_tower', label: 'Fantasmas e Pokemon noturnos dropam fragmentos de Dusk Stone.' },
  dawn_stone_shard: { pokemonIds: [280, 281, 361, 475, 478, 856, 308, 362, 858], routeId: 'snowpoint_routes', label: 'Pokemon psiquicos, gelo e evolucoes especiais dropam fragmentos de Dawn Stone.' },
  ice_stone_shard: { pokemonIds: [37, 38, 133, 471, 582, 613, 712], routeId: 'ice_path', label: 'Rotas geladas e Pokemon de gelo dropam fragmentos de Ice Stone.' },
  magmarizer_shard: { pokemonIds: [126, 240, 467, 218, 219, 322, 323, 554, 555], routeId: 'pokemon_mansion', label: 'Magmar, Magby, Magmortar e Pokemon vulcanicos dropam fragmentos de Magmarizer em rotas de fogo.' },
  kings_rock_shard: { pokemonIds: [61, 79, 80, 199, 186, 230, 306, 409], routeId: 'slowpoke_well', label: "Slowpoke, Slowbro, Politoed, Slowking e Pokemon reais dropam fragmentos de King's Rock." },
  reaper_cloth_shard: { pokemonIds: [92, 93, 94, 200, 355, 356, 477, 708, 854], routeId: 'pokemon_tower', label: 'Dusclops, Dusknoir e fantasmas sombrios dropam fragmentos de Reaper Cloth na Pokemon Tower.' },
  prism_scale_shard: { pokemonIds: [349, 350, 118, 119, 120, 121, 368, 370], routeId: 'route_19_20', label: 'Feebas, Milotic e Pokemon aquaticos raros dropam fragmentos de Prism Scale em rotas aquaticas.' },
  link_cable_part: { pokemonIds: [
    64, 67, 74, 75, 92, 93, 41, 42, 137, 79, 95, 123, 61,
    223, 280, 281, 315, 349, 356, 375,  // Gen 3
    404, 440, 436, 355,                 // Gen 4
    525, 533, 538, 539, 560, 562,       // Gen 5
    664, 690, 707,                      // Gen 6
    765, 796, 802,                      // Gen 7
    855, 864, 882,                      // Gen 8
    957, 959, 980,                      // Gen 9
  ], routeId: 'rock_tunnel', label: 'Pokemon de evolucao por troca dropam pecas de Link Cable.' },
  pink_dust: { pokemonIds: [
    35, 36, 39, 40, 113, 242,          // Gen 1-2: Clefairy, Jigglypuff, Chansey, Blissey
    175, 176, 209, 210, 241,           // Gen 2: Togepi, Snubbull, Miltank
    183, 184, 280, 281, 282, 303,      // Gen 3: Marill, Ralts, Mawile
    440, 439, 468,                     // Gen 4: Happiny, Mime Jr., Togekiss
    531, 574, 575, 576,                // Gen 5: Audino, Gothita
    669, 670, 671, 683, 684, 700,      // Gen 6: Flabébé, Aromatisse, Sylveon
    742, 743, 764,                     // Gen 7: Cutiefly, Comfey
    868, 869,                          // Gen 8: Milcery, Alcremie
    926, 927, 957,                     // Gen 9: Fidough, Tinkatink
  ], routeId: 'safari_zone', label: 'Pokemon rosados e curadores dropam po rosa.' },
  gold_nugget: { pokemonIds: [52, 53, 113, 242, 302, 530], routeId: 'route_24_25', label: 'Pokemon coletores e raros dropam pepitas de ouro.' },
  silk: { pokemonIds: [
    10, 11, 12, 13, 14, 15, 46, 47,    // Gen 1: Caterpie, Weedle, Paras
    165, 166, 167, 168, 204, 205,       // Gen 2: Ledyba, Spinarak, Pineco
    265, 266, 267, 268, 269, 283, 284,  // Gen 3: Wurmple, Surskit
    401, 402, 412, 413, 414, 415,       // Gen 4: Kricketot, Burmy, Combee
    540, 541, 542, 595, 596, 616, 617,  // Gen 5: Sewaddle, Joltik, Shelmet
    664, 665, 666, 751, 752,            // Gen 6: Scatterbug, Dewpider
    736, 737, 738,                      // Gen 7: Grubbin
    824, 825, 826, 872, 873,            // Gen 8: Blipbug, Snom
    832, 833, 840, 841,                 // Gen 9: Tarountula, Nymble
  ], routeId: 'viridian_forest', label: 'Insetos e casulos dropam seda.' },
  feather: { pokemonIds: [
    16, 17, 18, 21, 22, 41, 42, 123,   // Gen 1: Pidgey, Spearow, Zubat, Scyther
    163, 164, 169, 176, 198, 225,       // Gen 2: Hoothoot, Togetic, Murkrow, Delibird
    276, 277, 278, 279, 333, 334,       // Gen 3: Taillow, Wingull, Swablu
    396, 397, 398, 441, 468, 479,       // Gen 4: Starly, Chatot, Togekiss
    519, 520, 521, 527, 528, 627, 628,  // Gen 5: Pidove, Woobat, Rufflet
    661, 662, 663, 701,                 // Gen 6: Fletchling, Hawlucha
    731, 732, 733, 741,                 // Gen 7: Pikipek, Oricorio
    821, 822, 823, 845,                 // Gen 8: Rookidee, Cramorant
    931, 962, 973,                      // Gen 9: Squawkabilly, Bombirdier, Flamigo
  ], routeId: 'route_16_17_18', label: 'Pokemon voadores dropam penas.' },
  armor_fragment: { pokemonIds: [95, 208, 227, 306, 411, 476, 884], routeId: 'stark_mountain', label: 'Pokemon blindados, rochosos e metalicos dropam fragmentos de armadura.' },
  fury_essence: { pokemonIds: [57, 68, 128, 217, 289, 445, 534, 612], routeId: 'victory_road', label: 'Pokemon agressivos e pseudo-lendarios dropam essencia de furia.' },
  stardust: { pokemonIds: [120, 121, 173, 375, 376, 385, 605, 774], routeId: 'meteor_falls', label: 'Pokemon cosmicos, meteoricos e raros dropam poeira estelar.' },
  dragon_scale: { pokemonIds: [
    116, 117, 118, 147, 148, 149,      // Gen 1: Horsea, Goldeen, Dratini
    230, 246, 247, 248,                // Gen 2: Kingdra, Larvitar, Tyranitar
    329, 330, 371, 372, 373,           // Gen 3: Vibrava, Flygon, Bagon, Salamence
    443, 444, 445, 447, 448,           // Gen 4: Gible, Riolu, Lucario
    610, 611, 612, 633, 634, 635,      // Gen 5: Axew, Deino
    696, 697, 704, 705, 706,           // Gen 6: Tyrunt, Goomy
    782, 783, 784, 776,                // Gen 7: Jangmo-o, Turtonator
    884, 886, 887,                     // Gen 8: Duraludon, Dreepy (Dragon)
    996, 997, 998, 999,                // Gen 9: Frigibax e linha
  ], routeId: 'dragons_den', label: 'Pokemon dragoes e marinhos raros dropam escamas de dragao.' },
  trainer_card_thread: { pokemonIds: [10, 11, 12, 13, 14, 15, 133, 447, 448], routeId: 'viridian_forest', label: 'Insetos, Eevee e Lucario dropam fio para personalizacao do Trainer Card.' },
  yellow_shard: { pokemonIds: [25, 26, 81, 82, 100, 101, 125], routeId: 'power_plant', label: 'Pokemon eletricos dropam fragmentos amarelos.' },
  mystic_water: { pokemonIds: [60, 61, 62, 72, 73, 120, 121, 134], routeId: 'route_19_20', label: 'Pokemon aquaticos raros dropam Mystic Water como material avancado.' },

  // Novos Materiais Específicos
  sharp_claw:    { pokemonIds: [27, 28, 52, 53, 215, 461], routeId: 'route_22', label: 'Sandshrew, Meowth, Persian e Sneasel.' },
  scale_dust:    { pokemonIds: [147, 371, 610, 611, 612], routeId: 'dragons_den', label: 'Dratini, Bagon e Axew.' },
  ember_shard:   { pokemonIds: [126, 218, 219, 240], routeId: 'pokemon_mansion', label: 'Magmar, Slugma e Magby.' },
  thunder_fang:  { pokemonIds: [403, 404, 405, 135, 466], routeId: 'power_plant', label: 'Luxray, Jolteon e Electivire.' },
  ice_crystal:   { pokemonIds: [361, 220, 221, 712], routeId: 'ice_path', label: 'Snorunt, Swinub e Bergmite.' },
  poison_barb:   { pokemonIds: [15, 406, 407, 453, 454], routeId: 'viridian_forest', label: 'Beedrill, Roserade e Toxicroak.' },
  hard_shell:    { pokemonIds: [90, 91, 74, 75, 76, 304, 305, 306], routeId: 'mt_moon', label: 'Shellder, Golem e Aron.' },
  spirit_dust:   { pokemonIds: [200, 353, 355, 607, 608, 609], routeId: 'pokemon_tower', label: 'Misdreavus, Duskull e Litwick.' },
  dragon_fang:   { pokemonIds: [443, 444, 445, 148], routeId: 'dragons_den', label: 'Gible, Gabite e Dragonair.' },
  aura_fragment: { pokemonIds: [447, 448, 307, 308], routeId: 'sinnoh_route_201', label: 'Riolu, Lucario e Meditite.' },
  leaf_debris:   { pokemonIds: [406, 546, 420], routeId: 'ilex_forest', label: 'Budew, Cottonee e Cherubi.' },
  wave_stone:    { pokemonIds: [183, 194, 258], routeId: 'route_19_20', label: 'Marill, Wooper e Mudkip.' },
  mega_stone_shard: { 
    pokemonIds: [
      3, 6, 9, 15, 18, 65, 80, 94, 115, 127, 130, 142, 150, 181, 208, 212, 214, 229, 248, 
      254, 257, 260, 282, 302, 303, 306, 308, 310, 319, 323, 334, 354, 359, 362, 373, 376, 
      380, 381, 384, 428, 445, 448, 460, 475, 531, 719,
      26, 149, 154, 157, 160, 389, 392, 395, 497, 500, 503, 652, 655, 658, 724, 727, 730, 
      812, 815, 818, 908, 911, 914, 330, 405, 612, 635, 706, 784, 887, 998, 768, 485, 491, 
      807, 358, 71, 121, 689, 668, 36, 545, 12, 68
    ], 
    routeId: 'kalos_route_1',
    label: 'Pokemon capazes de Mega Evoluir em Kalos dropam fragmentos de Mega Pedra.',
    requiredRegion: 'kalos',
    requiredFlag: 'mega_evolution_unlocked',
  },

  // ── Pools por Era — controlam quais Pokémon dropam TMs de cada geração ────
  early_tm_pool: {
    pokemonIds: [
      // Kanto (Gen 1)
      16, 19, 21, 25, 27, 29, 32, 41, 43, 46, 50, 52, 54, 56, 58, 60,
      63, 66, 69, 74, 77, 79, 81, 84, 86, 88, 90, 92, 95, 96, 98, 100,
      102, 104, 109, 111, 114, 116, 118, 120, 123, 125, 126, 128, 129, 133,
      // Johto (Gen 2)
      152, 155, 158, 161, 163, 165, 167, 177, 187, 191, 194, 198, 204,
      209, 213, 215, 218, 220, 223, 225, 228,
    ],
    routeId: 'route_1',
    label: 'TMs clássicos (Gen 1-2) — derrote Pokémon de Kanto e Johto.',
  },
  mid_tm_pool: {
    pokemonIds: [
      // Hoenn (Gen 3)
      261, 263, 265, 270, 273, 278, 283, 285, 287, 296, 300, 316, 325,
      333, 335, 341, 343, 345, 347, 349, 351, 353, 355, 357, 359, 361, 363,
      // Sinnoh (Gen 4)
      396, 399, 401, 404, 406, 408, 412, 418, 420, 422, 425, 427, 431,
      434, 436, 438, 440, 442, 443, 446, 447,
    ],
    routeId: 'hoenn_route_101',
    label: 'TMs intermediários (Gen 3-4) — derrote Pokémon de Hoenn e Sinnoh.',
  },
  late_tm_pool: {
    pokemonIds: [
      // Unova (Gen 5)
      504, 506, 509, 511, 513, 515, 517, 519, 522, 524, 527, 529, 531,
      533, 535, 540, 543, 546, 548, 550, 551, 554, 557, 560, 562, 564,
      566, 568, 572, 574, 577, 580, 582, 585, 587, 588, 590, 592, 595,
      597, 599, 602, 605, 607, 610, 613, 616, 619, 621, 622, 624, 627,
      629, 631, 633, 636,
      // Kalos (Gen 6)
      661, 664, 669, 672, 674, 676, 677, 682, 684, 686, 688, 690, 692,
      694, 696, 698, 700, 701, 702, 704, 706,
    ],
    routeId: 'unova_route_1',
    label: 'TMs avançados (Gen 5-6) — derrote Pokémon de Unova e Kalos.',
  },
  endgame_tm_pool: {
    pokemonIds: [
      // Alola (Gen 7)
      731, 734, 736, 742, 744, 749, 751, 753, 755, 757, 761, 764,
      766, 767, 769, 771, 778, 780, 781,
      // Galar (Gen 8)
      821, 824, 829, 831, 835, 837, 840, 843, 846, 848, 850, 852,
      854, 856, 859, 862, 863, 864, 865, 868, 872,
      // Paldea (Gen 9)
      906, 909, 912, 915, 917, 919, 921, 923, 925, 928, 931, 935,
      938, 940, 944, 946, 950, 953, 955, 957, 962, 965, 968, 971,
    ],
    routeId: 'melemele_island',
    label: 'TMs end-game (Gen 7-9) — derrote Pokémon de Alola, Galar e Paldea.',
  },
};

const ALL_FORGE_RECIPES_WITH_CATEGORY = Object.entries(CRAFTING_RECIPES).flatMap(([category, recipes]) =>
  (recipes || []).map(recipe => ({ ...recipe, category }))
);
const ALL_FORGE_RECIPES = ALL_FORGE_RECIPES_WITH_CATEGORY;
export const FORGE_RECIPE_IDS = [...new Set(ALL_FORGE_RECIPES.map(recipe => recipe.id))];
export const RECIPE_GATED_FORGE_IDS = new Set(FORGE_RECIPE_IDS);

// ── Classificação de TMs por Era ──────────────────────────────────────────────
// Cada TM é classificado na geração em que foi introduzido como TM.
// Isso garante que TMs de Gen 9 não caiam de Pidgey e Rattata.
const EARLY_TM_IDS = new Set([
  // Gen 1
  'agility','amnesia','bide','blizzard','body-slam','bubble-beam','confuse-ray',
  'counter','dig','double-edge','double-team','dragon-rage','dream-eater','egg-bomb',
  'explosion','fire-blast','fire-punch','fire-spin','fissure','flash','flamethrower',
  'fly','haze','horn-drill','hydro-pump','hyper-beam','ice-beam','ice-punch',
  'light-screen','low-kick','mega-drain','mega-kick','mega-punch','metronome','mimic',
  'night-shade','pay-day','pin-missile','psybeam','psychic','psywave','rage',
  'razor-wind','reflect','rest','roar','rock-slide','screech','seismic-toss',
  'self-destruct','skull-bash','sky-attack','soft-boiled','solar-beam','submission',
  'substitute','super-fang','surf','swift','swords-dance','take-down','teleport',
  'thunder','thunder-punch','thunder-wave','thunderbolt','toxic','tri-attack',
  'water-gun','waterfall','whirlwind',
  // Gen 2
  'attract','baton-pass','beat-up','charm','crunch','curse','defense-curl','detect',
  'dragon-breath','dynamic-punch','encore','endure','false-swipe','frustration',
  'fury-cutter','future-sight','giga-drain','headbutt','hidden-power','icy-wind',
  'iron-tail','megahorn','metal-claw','mud-slap','nightmare','pain-split','protect',
  'psych-up','rain-dance','return','reversal','rock-smash','rollout','safeguard',
  'sandstorm','scary-face','shadow-ball','sleep-talk','sludge-bomb','snore','spikes',
  'spite','steel-wing','sunny-day','swagger','sweet-scent','thief','whirlpool',
  'zap-cannon',
]);

const MID_TM_IDS = new Set([
  // Gen 3
  'aerial-ace','air-cutter','blast-burn','bounce','brick-break','bulk-up',
  'bullet-seed','calm-mind','charge','dive','dragon-claw','dragon-dance','endeavor',
  'facade','fake-tears','feather-dance','focus-punch','frenzy-plant','hail',
  'heat-wave','helping-hand','hydro-cannon','hyper-voice','icicle-spear','imprison',
  'iron-defense','knock-off','magical-leaf','metal-sound','mud-shot','muddy-water',
  'nature-power','overheat','poison-tail','recycle','revenge','rock-blast','rock-tomb',
  'sand-tomb','secret-power','shock-wave','silver-wind','skill-swap','snatch',
  'superpower','taunt','torment','trick','uproar','water-pulse','weather-ball',
  'will-o-wisp',
  // Gen 4
  'air-slash','assurance','aura-sphere','avalanche','brave-bird','brine','bug-bite',
  'bug-buzz','captivate','charge-beam','close-combat','cross-poison','dark-pulse',
  'draco-meteor','drain-punch','earth-power','embargo','energy-ball','fire-fang',
  'flare-blitz','flash-cannon','fling','focus-blast','giga-impact','gravity',
  'guard-swap','gunk-shot','gyro-ball','ice-fang','iron-head','leaf-storm',
  'nasty-plot','natural-gift','outrage','payback','pluck','poison-jab','power-gem',
  'power-swap','psycho-cut','rock-polish','roost','seed-bomb','shadow-claw',
  'stealth-rock','stone-edge','tailwind','thunder-fang','toxic-spikes','trick-room',
  'u-turn','vacuum-wave','x-scissor','zen-headbutt',
]);

const LATE_TM_IDS = new Set([
  // Gen 5
  'acid-spray','acrobatics','ally-switch','bulldoze','dragon-tail','drill-run',
  'echoed-voice','electro-ball','electroweb','fire-pledge','flame-charge','foul-play',
  'frost-breath','grass-knot','grass-pledge','heat-crash','heavy-slam','hex',
  'hone-claws','hurricane','incinerate','low-sweep','magic-room','psyshock','quash',
  'razor-shell','retaliate','round','scald','sky-drop','sludge-wave','smack-down',
  'snarl','stored-power','struggle-bug','tail-slap','telekinesis','venoshock',
  'volt-switch','water-pledge','wild-charge','wonder-room','work-up',
  // Gen 6
  'confide','dazzling-gleam','disarming-voice','draining-kiss','eerie-impulse',
  'electric-terrain','grassy-terrain','infestation','misty-terrain','mystical-fire',
  'petal-blizzard','phantom-force','play-rough','power-up-punch',
]);

// TMs dropam apenas de Pokémon do mesmo tipo do golpe (usando o mesmo TYPE_TO_ESSENCE do custo de forja).
// Exemplo: tm_flamethrower (Fire) → fire_essence → dropa de Charmander, Growlithe, etc.
// TMs de tipo Normal (status, moves neutros) mantêm pool por era para evitar que Pidgey/Rattata
// concentrem centenas de TMs de status indiferenciados.
const _buildTmTypeOverrides = () => {
  const overrides = {};
  OFFICIAL_TM_MOVE_IDS.forEach(moveId => {
    const tmId = 'tm_' + moveId.replace(/-/g, '_');
    const move = MOVES[moveId];
    const moveType = move?.type || 'Normal';
    if (moveType === 'Normal') {
      // Normal TMs: era-gate para distribuir entre as gerações
      if (EARLY_TM_IDS.has(moveId))     overrides[tmId] = 'early_tm_pool';
      else if (MID_TM_IDS.has(moveId))  overrides[tmId] = 'mid_tm_pool';
      else if (LATE_TM_IDS.has(moveId)) overrides[tmId] = 'late_tm_pool';
      else                               overrides[tmId] = 'endgame_tm_pool';
    } else {
      overrides[tmId] = TYPE_TO_ESSENCE[moveType] || 'normal_essence';
    }
  });
  return overrides;
};
const TM_ERA_OVERRIDES = _buildTmTypeOverrides();

// ── Mapa de onde cada receita é dropada (Pokémon fonte → material fonte) ──────
// Receitas de itens iniciais devem dropar de Pokémon das rotas iniciais!
const RECIPE_SOURCE_OVERRIDES = {
  // TMs — geração-gated: cada TM só dropa de Pokémon da sua era
  ...TM_ERA_OVERRIDES,
  // Consumíveis básicos — rotas iniciais (Route 1/2/3)
  pokeballs:   'normal_essence',   // Pidgey, Rattata (Route 1) ← antes apricorn (Johto!)
  great_ball:  'iron_ore',         // Geodude, Onix (Mt. Moon)
  ultra_ball:  'mystic_dust',      // Gastly, Haunter (Pokémon Tower)
  revive:      'ghost_essence',    // Pokémon Tower — faz sentido temático
  max_repel:   'poison_essence',   // Ekans, Zubat (rotas iniciais e cavernas)

  // Pedras evolutivas — Pokémon que dropam os fragmentos
  fire_stone:    'fire_stone_shard',
  water_stone:   'water_stone_shard',
  leaf_stone:    'leaf_stone_shard',
  thunder_stone: 'thunder_stone_shard',
  moon_stone:    'moon_stone_shard',
  sun_stone:     'sun_stone_shard',
  shiny_stone:   'shiny_stone_shard',
  dusk_stone:    'dusk_stone_shard',
  dawn_stone:    'dawn_stone_shard',
  ice_stone:     'ice_stone_shard',
  link_cable:    'link_cable_part',

  // ── Hold Items — tipo básico (18 tipos) ──────────────────────────────────
  silk_scarf:    'normal_essence',
  charcoal:      'fire_essence',
  mystic_water:  'water_essence',
  magnet:        'electric_essence',
  miracle_seed:  'grass_essence',
  never_melt_ice:'ice_essence',
  black_belt:    'fighting_essence',
  poison_barb:   'poison_essence',
  soft_sand:     'ground_essence',
  sharp_beak:    'flying_essence',
  twisted_spoon: 'psychic_essence',
  silver_powder: 'bug_essence',
  hard_stone:    'rock_essence',
  spell_tag:     'ghost_essence',
  dragon_fang:   'dragon_essence',
  black_glasses: 'dark_essence',
  metal_coat:    'steel_essence',
  fairy_feather: 'fairy_essence',
  quick_claw:    'flying_essence',
  // ── Hold Items especiais ──────────────────────────────────────────────────
  leftovers:     'normal_essence',
  life_orb:      'dragon_essence',
  expert_belt:   'fighting_essence',
  focus_sash:    'psychic_essence',
  // ── Badges Items (consumíveis com efeito de hold) ─────────────────────────
  lucky_egg:     'pink_dust',
  amulet_coin:   'gold_nugget',

  // Mega Stones
  charizardite_x: 'mega_stone_shard',
  charizardite_y: 'mega_stone_shard',
  venusaurite:    'mega_stone_shard',
  blastoisinite:  'mega_stone_shard',
  lucarionite:    'mega_stone_shard',
  garchompite:    'mega_stone_shard',
  gardevoirite:   'mega_stone_shard',
  blazikenite:    'mega_stone_shard',
  gengarite:      'mega_stone_shard',
  metagrossite:   'mega_stone_shard',
  mewtwonite_x:   'mega_stone_shard',
  mewtwonite_y:   'mega_stone_shard',
  alakazite: 'mega_stone_shard',
  gyaradosite: 'mega_stone_shard',
  salamencite: 'mega_stone_shard',
  tyranitarite: 'mega_stone_shard',
  beedrillite: 'mega_stone_shard',
  pidgeotite: 'mega_stone_shard',
  slowbronite: 'mega_stone_shard',
  kangaskhanite: 'mega_stone_shard',
  pinsirite: 'mega_stone_shard',
  aerodactylite: 'mega_stone_shard',
  ampharosite: 'mega_stone_shard',
  steelixite: 'mega_stone_shard',
  scizorite: 'mega_stone_shard',
  heracronite: 'mega_stone_shard',
  houndoominite: 'mega_stone_shard',
  sceptilite: 'mega_stone_shard',
  swampertite: 'mega_stone_shard',
  sableyite: 'mega_stone_shard',
  mawilite: 'mega_stone_shard',
  aggronite: 'mega_stone_shard',
  medichamite: 'mega_stone_shard',
  manectite: 'mega_stone_shard',
  sharpedonite: 'mega_stone_shard',
  cameruptite: 'mega_stone_shard',
  altarianite: 'mega_stone_shard',
  banettite: 'mega_stone_shard',
  absolite: 'mega_stone_shard',
  glalitite: 'mega_stone_shard',
  latiasite: 'mega_stone_shard',
  latiosite: 'mega_stone_shard',
  abomasnowite: 'mega_stone_shard',
  galladite: 'mega_stone_shard',
  audinite: 'mega_stone_shard',
  diancite: 'mega_stone_shard',

  // Mega Stones — dropam de Mega Shards em Kalos
  mega_stone_shard: 'mega_stone_shard',
  charizardite_x: 'mega_stone_shard',
  charizardite_y: 'mega_stone_shard',
  venusaurite: 'mega_stone_shard',
  blastoisinite: 'mega_stone_shard',
  lucarionite: 'mega_stone_shard',
  garchompite: 'mega_stone_shard',
  gardevoirite: 'mega_stone_shard',
  blazikenite: 'mega_stone_shard',
  gengarite: 'mega_stone_shard',
  metagrossite: 'mega_stone_shard',
  mewtwonite_x: 'mega_stone_shard',
  mewtwonite_y: 'mega_stone_shard',
  alakazite: 'mega_stone_shard',
  gyaradosite: 'mega_stone_shard',
  salamencite: 'mega_stone_shard',
  tyranitarite: 'mega_stone_shard',
  beedrillite: 'mega_stone_shard',
  pidgeotite: 'mega_stone_shard',
  slowbronite: 'mega_stone_shard',
  kangaskhanite: 'mega_stone_shard',
  pinsirite: 'mega_stone_shard',
  aerodactylite: 'mega_stone_shard',
  ampharosite: 'mega_stone_shard',
  steelixite: 'mega_stone_shard',
  scizorite: 'mega_stone_shard',
  heracronite: 'mega_stone_shard',
  houndoominite: 'mega_stone_shard',
  sceptilite: 'mega_stone_shard',
  swampertite: 'mega_stone_shard',
  sableyite: 'mega_stone_shard',
  mawilite: 'mega_stone_shard',
  aggronite: 'mega_stone_shard',
  medichamite: 'mega_stone_shard',
  manectite: 'mega_stone_shard',
  sharpedonite: 'mega_stone_shard',
  cameruptite: 'mega_stone_shard',
  altarianite: 'mega_stone_shard',
  banettite: 'mega_stone_shard',
  absolite: 'mega_stone_shard',
  glalitite: 'mega_stone_shard',
  latiasite: 'mega_stone_shard',
  latiosite: 'mega_stone_shard',
  abomasnowite: 'mega_stone_shard',
  galladite: 'mega_stone_shard',
  audinite: 'mega_stone_shard',
  diancite: 'mega_stone_shard',
  rayquazaite: 'mega_stone_shard',
  raichuite_x: 'mega_stone_shard',
  raichuite_y: 'mega_stone_shard',
  dragonitite: 'mega_stone_shard',
  meganiumite: 'mega_stone_shard',
  feraligatrite: 'mega_stone_shard',
  skarmorite: 'mega_stone_shard',
  emboarite: 'mega_stone_shard',
  chesnaughtite: 'mega_stone_shard',
  delphoxite: 'mega_stone_shard',
  greninjite: 'mega_stone_shard',
  baxcaliburite: 'mega_stone_shard',
  golisopodite: 'mega_stone_shard',
  heatranite: 'mega_stone_shard',
  darkraiite: 'mega_stone_shard',
  zeraoraite: 'mega_stone_shard',
  chimechoite: 'mega_stone_shard',
  victreebelite: 'mega_stone_shard',
  starmiite: 'mega_stone_shard',
  barbaraclite: 'mega_stone_shard',
  pyroarite: 'mega_stone_shard',
  clefablite: 'mega_stone_shard',
  scolipidite: 'mega_stone_shard',
  lucarionite_z: 'mega_stone_shard',
  absolite_z: 'mega_stone_shard',
  garchompite_z: 'mega_stone_shard',
  lopunnite: 'mega_stone_shard',

  // Relíquias elite
  titan_shield:        'armor_fragment',
  adrenaline_potion:   'fury_essence',
  penetration_pendant: 'dragon_scale',

  // Varas de pesca — insetos e Pokémon de rotas ribeirinhas
  old_rod:   'normal_essence',  // Route 1 / rotas iniciais
  good_rod:  'water_essence',   // rotas aquáticas
  super_rod: 'dragon_essence',  // Dragon's Den / rotas avançadas
};

const getRecipeSourceMaterial = (recipe) => {
  if (RECIPE_SOURCE_OVERRIDES[recipe.id]) return RECIPE_SOURCE_OVERRIDES[recipe.id];
  return Object.keys(recipe.cost || {}).find(material => material !== 'currency' && FORGE_MATERIAL_DROP_GUIDE[material]) || 'normal_essence';
};

// Descrições amigáveis por tipo de fonte — aparecem na UI da Forja
const RECIPE_LABEL_OVERRIDES = {
  pokeballs:       'Derrote Pidgey e Rattata na Route 1 ou 2.',
  great_ball:      'Derrote Geodude e Onix no Mt. Moon.',
  ultra_ball:      'Derrote Gastly e Haunter na Pokémon Tower.',
  revive:          'Derrote fantasmas na Pokémon Tower.',
  max_repel:       'Derrote Ekans e Zubat nas cavernas iniciais.',
  tm_flamethrower: 'Derrote Charmander, Vulpix ou Growlithe nas rotas de fogo.',
  tm_thunderbolt:  'Derrote Pikachu, Magnemite ou Voltorb na Power Plant.',
  tm_ice_beam:     'Derrote Jynx ou Lapras no Ice Path / Seafoam Islands.',
  tm_thunder_wave: 'Derrote Pikachu, Magnemite ou Jolteon.',
  tm_toxic:        'Derrote Ekans, Koffing ou Weezing.',
  tm_dig:          'Derrote Diglett, Sandshrew ou Geodude.',
  tm_aerial_ace:   'Derrote Pidgeot, Farfetch\'d ou Scyther.',
  tm_shadow_ball:  'Derrote Gastly, Haunter ou Gengar.',
  tm_brick_break:  'Derrote Mankey, Machop ou Hitmonchan.',
  tm_rock_tomb:    'Derrote Geodude, Graveler ou Onix.',
  tm_thief:        'Derrote Meowth, Murkrow ou Sneasel.',
  tm_earthquake:   'Derrote Rhyhorn, Donphan ou Trapinch.',
  tm_surf:         'Derrote Lapras, Tentacruel ou Gyarados.',
  tm_rock_slide:   'Derrote Rhyhorn, Rhydon ou Larvitar.',
  tm_bulk_up:      'Derrote Machoke, Hariyama ou Breloom.',
  tm_calm_mind:    'Derrote Abra, Slowpoke ou Espeon.',
  tm_swords_dance: 'Derrote Farfetch\'d, Scyther ou Houndour.',
  tm_fire_punch:   'Derrote Magmar, Magby ou Hitmonchan.',
  tm_thunder_punch:'Derrote Electivire, Electabuzz ou Jolteon.',
  tm_ice_punch:    'Derrote Jynx, Swinub ou Snorunt.',
  tm_drain_punch:  'Derrote Croagunk, Toxicroak ou Medicham.',
  tm_aura_sphere:  'Derrote Lucario, Meditite ou Riolu.',
  tm_stone_edge:   'Derrote Rhydon, Rhyperior ou Golem.',
  tm_flash_cannon: 'Derrote Magnezone, Bronzong ou Steelix.',
  tm_dark_pulse:   'Derrote Absol, Weavile ou Umbreon.',
  tm_energy_ball:  'Derrote Roserade, Tangrowth ou Leafeon.',
  tm_close_combat: 'Derrote Lucario, Infernape ou Gallade.',
  tm_stealth_rock: 'Derrote Onix, Sudowoodo ou Golem.',
  tm_dragon_claw:  'Derrote Gible, Gabite ou Garchomp.',
  tm_wild_charge:  'Derrote Zebstrika, Luxray ou Lanturn.',
  tm_giga_drain:   'Derrote Vileplume, Victreebel ou Roserade.',
  tm_moonblast:    'Derrote Clefable, Sylveon ou Gardevoir.',
  tm_dazzling_gleam:'Derrote Togekiss, Ribombee ou Florges.',
  tm_dragon_dance: 'Derrote Gyarados, Dragonite ou Kingdra.',
  tm_nasty_plot:   'Derrote Gengar, Honchkrow ou Zoroark.',
  tm_hyper_voice:  'Derrote Exploud, Meloetta ou Sylveon.',
  tm_leaf_storm:   'Derrote Leafeon, Serperior ou Roserade.',
  tm_hurricane:    'Derrote Dragonite ou Togekiss.',
  tm_focus_blast:  'Derrote Alakazam, Lucario ou Conkeldurr.',
  tm_flare_blitz:  'Derrote Arcanine, Charizard ou Infernape.',
  tm_earthquake_ex:'Derrote Pseudo-lendários (Garchomp, Dragonite, Metagross).',
  old_rod:         'Derrote qualquer Pokémon nas rotas iniciais (Route 1/2/3).',
  good_rod:        'Derrote Pokémon aquáticos nas rotas costeiras.',
  super_rod:       'Derrote Dratini ou Dragonair na Dragon\'s Den.',
  // Held items — Tipos
  charcoal:        'Derrote Charmander, Vulpix ou Growlithe em rotas vulcânicas (Fire).',
  mystic_water:    'Derrote Squirtle, Psyduck ou Poliwag em rios e oceanos (Water).',
  black_belt:      'Derrote Mankey, Machop ou Tyrogue no Fighting Dojo (Fighting).',
  magnet:          'Derrote Pikachu, Magnemite ou Voltorb na Power Plant (Electric).',
  silk_scarf:      'Derrote Meowth, Rattata ou Eevee nas rotas iniciais (Normal).',
  miracle_seed:    'Derrote Oddish, Bellsprout ou Exeggcute em florestas (Grass).',
  never_melt_ice:  'Derrote Swinub, Snorunt ou Jynx no Ice Path (Ice).',
  twisted_spoon:   'Derrote Abra, Drowzee ou Mr. Mime em Saffron City (Psychic).',
  hard_stone:      'Derrote Geodude, Rhyhorn ou Larvitar no Rock Tunnel (Rock).',
  spell_tag:       'Derrote Gastly, Haunter ou Gengar na Pokémon Tower (Ghost).',
  dragon_fang:     'Derrote Dratini, Dragonair ou Bagon na Dragon\'s Den (Dragon).',
  black_glasses:   'Derrote Murkrow, Sneasel ou Absol na Burned Tower (Dark).',
  metal_coat:      'Derrote Magnemite, Aron ou Bronzor na Power Plant (Steel).',
  fairy_feather:   'Derrote Clefairy, Togepi ou Marill no Mt. Moon (Fairy).',
  poison_barb:     'Derrote Ekans, Grimer ou Koffing nas cavernas (Poison).',
  soft_sand:       'Derrote Diglett, Sandshrew ou Trapinch no Rock Tunnel (Ground).',
  sharp_beak:      'Derrote Pidgeot, Doduo ou Farfetch\'d nas rotas abertas (Flying).',
  silver_powder:   'Derrote Caterpie, Paras ou Scyther na Viridian Forest (Bug).',
  leftovers:       'Derrote Snorlax, Munchlax ou Lickitung nas rotas comuns.',
  life_orb:        'Derrote Dragonite, Garchomp ou Metagross em Victory Road.',
  expert_belt:     'Derrote Lucario, Machamp ou Conkeldurr no Fighting Dojo.',
  focus_sash:      'Derrote Alakazam, Gardevoir ou Espeon em Saffron City.',
};

// ── Escalonamento por insígnias ───────────────────────────────────────────────
// TMs fortes só dropam após progresso: tier 2 → 8 insígnias (campeão Kanto),
// tier 3 → 16 (campeão Johto), tier 4 → 24. Tier 1 e itens essenciais: sem trava.
const TM_TIER_MIN_BADGES = { 1: 0, 2: 8, 3: 16, 4: 24 };
// Hold items de poder e relíquias elite também escalonam
const RECIPE_MIN_BADGES_OVERRIDES = {
  leftovers: 8, life_orb: 16, expert_belt: 8, focus_sash: 8,
  titan_shield: 24, adrenaline_potion: 24, penetration_pendant: 24,
};

const getRecipeMinBadges = (recipe) => {
  if (RECIPE_MIN_BADGES_OVERRIDES[recipe.id] !== undefined) return RECIPE_MIN_BADGES_OVERRIDES[recipe.id];
  if (recipe.type === 'tm') return TM_TIER_MIN_BADGES[recipe.tier] || 0;
  return 0;
};

export const FORGE_RECIPE_DROP_GUIDE = Object.fromEntries(ALL_FORGE_RECIPES.map(recipe => {
  const sourceMaterial = getRecipeSourceMaterial(recipe);
  const guide = FORGE_MATERIAL_DROP_GUIDE[sourceMaterial] || FORGE_MATERIAL_DROP_GUIDE.normal_essence;
  const label = RECIPE_LABEL_OVERRIDES[recipe.id] || `Receita ${recipe.name}: ${guide.label}`;
  const isMegaStoneRecipe = recipe.category === 'mega_stones';
  const minBadges = getRecipeMinBadges(recipe);
  return [recipe.id, {
    recipeItemId: `recipe_${recipe.id}`,
    sourceMaterial,
    pokemonIds: guide.pokemonIds,
    routeId: guide.routeId,
    label,
    category: recipe.category,
    requiredRegion: isMegaStoneRecipe ? 'kalos' : undefined,
    requiredFlag: isMegaStoneRecipe ? 'mega_evolution_unlocked' : undefined,
    minBadges: minBadges > 0 ? minBadges : undefined,
  }];
}));

export const FORGE_RECIPE_DROP_BY_POKEMON = Object.entries(FORGE_RECIPE_DROP_GUIDE).reduce((acc, [recipeId, guide]) => {
  (guide.pokemonIds || []).forEach(id => {
    if (!acc[id]) acc[id] = [];
    acc[id].push(`recipe_${recipeId}`);
  });
  return acc;
}, {});

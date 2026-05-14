// ── Configurações de Raid ──────────────────────────────────────────────────
export const EXP_CANDIES = {
  exp_candy_xs: { name: 'EXP Candy XS', xp: 100,  img: '/items/exp_candy_xs.png',  color: '#818cf8', size: 'XS' },
  exp_candy_s:  { name: 'EXP Candy S',  xp: 800,  img: '/items/exp_candy_s.png',   color: '#60a5fa', size: 'S' },
  exp_candy_m:  { name: 'EXP Candy M',  xp: 3000, img: '/items/exp_candy_m.png',   color: '#34d399', size: 'M' },
  exp_candy_l:  { name: 'EXP Candy L',  xp: 10000,img: '/items/exp_candy_l.png',   color: '#fbbf24', size: 'L' },
  exp_candy_xl: { name: 'EXP Candy XL', xp: 30000,img: '/items/exp_candy_xl.png',  color: '#f87171', size: 'XL' },
};

export const REGION_ORDER = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea'];

// ── Configurações de Raid ──────────────────────────────────────────────────
export const RAID_HP_MULTIPLIER = {
  1: 3,
  2: 8,
  3: 20,
  4: 50,
  5: 150
};
export const RAID_CATCH_ATTEMPTS = {
  1: 5, 2: 5, 3: 5, 4: 5, 5: 5
};
export const RAID_DURATION_MS = 3600000; // 1 hora (conforme changelog V1.78.0)
export const RAID_FIGHT_SECONDS = 60;
export const RAID_BATTLE_TRIGGER = 100; // Conforme changelog V1.80.3/V1.78.0
export const RAID_SPAWN_INTERVAL_MS = 3600000; // 1 hora
export const RAID_CATCH_RATE_MULT = {
  1: 1.5,   // 1★ — fácil, alta chance por arremesso
  2: 1.0,   // 2★ — normal
  3: 0.65,  // 3★ — difícil
  4: 0.35,  // 4★ — muito difícil
  5: 0.15,  // 5★ — raridade máxima, chance muito baixa por bola
};
export const RAID_BALANCE_VERSION = '1.80.4';

// ── Tabelas de Recompensas por Estrela ──────────────────────────────────────
export const RAID_REWARDS_TABLE = {
  1: [
    { type: 'item',     id: 'exp_candy_xs',      quantity: 5,    chance: 1.0 },
    { type: 'item',     id: 'exp_candy_s',       quantity: 2,    chance: 0.5 },
    { type: 'currency', id: 'currency',           quantity: 500,  chance: 1.0 },
    { type: 'item',     id: 'pokeballs',          quantity: 5,    chance: 1.0 },
  ],
  2: [
    { type: 'item',     id: 'exp_candy_s',       quantity: 5,    chance: 1.0 },
    { type: 'item',     id: 'exp_candy_m',       quantity: 2,    chance: 0.5 },
    { type: 'currency', id: 'currency',           quantity: 1200, chance: 1.0 },
    { type: 'item',     id: 'great_ball',         quantity: 5,    chance: 1.0 },
    { type: 'item',     id: 'fire_stone',         quantity: 1,    chance: 0.2 },
    { type: 'item',     id: 'water_stone',        quantity: 1,    chance: 0.2 },
    { type: 'item',     id: 'thunder_stone',      quantity: 1,    chance: 0.2 },
  ],
  3: [
    { type: 'item',     id: 'exp_candy_m',       quantity: 6,    chance: 1.0 },
    { type: 'item',     id: 'exp_candy_l',       quantity: 2,    chance: 0.4 },
    { type: 'candy',    id: 'rare_candy',         quantity: 1,    chance: 0.3 },
    { type: 'currency', id: 'currency',           quantity: 3000, chance: 1.0 },
    { type: 'item',     id: 'ultra_ball',         quantity: 5,    chance: 1.0 },
    { type: 'item',     id: 'tm_flamethrower',    quantity: 1,    chance: 0.15 },
    { type: 'item',     id: 'tm_thunderbolt',     quantity: 1,    chance: 0.15 },
    { type: 'item',     id: 'tm_ice_beam',        quantity: 1,    chance: 0.15 },
    { type: 'material', id: 'stardust',           quantity: 15,   chance: 1.0 },
  ],
  4: [
    { type: 'item',     id: 'exp_candy_l',       quantity: 5,    chance: 1.0 },
    { type: 'item',     id: 'exp_candy_xl',      quantity: 2,    chance: 0.4 },
    { type: 'candy',    id: 'rare_candy',         quantity: 2,    chance: 0.6 },
    { type: 'currency', id: 'currency',           quantity: 6000, chance: 1.0 },
    { type: 'item',     id: 'ultra_ball',         quantity: 10,   chance: 1.0 },
    { type: 'item',     id: 'tm_flamethrower',    quantity: 1,    chance: 0.25 },
    { type: 'item',     id: 'tm_thunderbolt',     quantity: 1,    chance: 0.25 },
    { type: 'item',     id: 'tm_ice_beam',        quantity: 1,    chance: 0.25 },
    { type: 'material', id: 'stardust',           quantity: 25,   chance: 1.0 },
    { type: 'material', id: 'armor_fragment',     quantity: 1,    chance: 0.20 },
  ],
  5: [
    { type: 'item',     id: 'exp_candy_l',       quantity: 10,   chance: 1.0 },
    { type: 'item',     id: 'exp_candy_xl',      quantity: 1,    chance: 0.5 },
    { type: 'candy',    id: 'rare_candy',         quantity: 5,    chance: 1.0 },
    { type: 'currency', id: 'currency',           quantity: 10000,chance: 1.0 },
    { type: 'item',     id: 'ultra_ball',         quantity: 8,    chance: 1.0 },
    { type: 'item',     id: 'tm_flamethrower',    quantity: 1,    chance: 0.40 },
    { type: 'item',     id: 'tm_thunderbolt',     quantity: 1,    chance: 0.40 },
    { type: 'item',     id: 'tm_ice_beam',        quantity: 1,    chance: 0.40 },
    { type: 'item',     id: 'moon_stone',         quantity: 1,    chance: 0.30 },
    { type: 'item',     id: 'sun_stone',          quantity: 1,    chance: 0.30 },
    { type: 'item',     id: 'dawn_stone',         quantity: 1,    chance: 0.25 },
    { type: 'material', id: 'dragon_scale',       quantity: 2,    chance: 0.60 },
    { type: 'material', id: 'stardust',           quantity: 40,   chance: 1.0 },
    { type: 'material', id: 'armor_fragment',     quantity: 1,    chance: 0.30 },
    { type: 'material', id: 'mega_stone_shard',   quantity: 1,    chance: 0.50 },
  ],
};


// ── Pool de Pokémon de Raid por região ────────────────────────────────────────
export const RAID_POKEMON_POOL = {
  kanto: [
    { id: 16,  stars: 1, level: 18, name: 'Pidgeot'    },
    { id: 19,  stars: 1, level: 18, name: 'Raticate'   },
    { id: 37,  stars: 1, level: 20, name: 'Vulpix'     },
    { id: 56,  stars: 1, level: 20, name: 'Mankey'     },
    { id: 34,  stars: 2, level: 35, name: 'Nidoking'   },
    { id: 31,  stars: 2, level: 35, name: 'Nidoqueen'  },
    { id: 59,  stars: 2, level: 35, name: 'Arcanine'   },
    { id: 62,  stars: 2, level: 35, name: 'Poliwrath'  },
    { id: 65,  stars: 3, level: 42, name: 'Alakazam'   },
    { id: 68,  stars: 3, level: 40, name: 'Machamp'    },
    { id: 76,  stars: 3, level: 38, name: 'Golem'      },
    { id: 94,  stars: 3, level: 42, name: 'Gengar'     },
    { id: 103, stars: 3, level: 40, name: 'Exeggutor'  },
    { id: 112, stars: 3, level: 42, name: 'Rhydon'     },
    { id: 123, stars: 3, level: 40, name: 'Scyther'    },
    { id: 127, stars: 3, level: 40, name: 'Pinsir'     },
    { id: 143, stars: 3, level: 40, name: 'Snorlax'    },
    { id: 130, stars: 4, level: 45, name: 'Gyarados'   },
    { id: 131, stars: 4, level: 48, name: 'Lapras'     },
    { id: 142, stars: 4, level: 50, name: 'Aerodactyl' },
    { id: 6,   stars: 4, level: 50, name: 'Charizard',  isShinyLocked: false },
    { id: 9,   stars: 4, level: 50, name: 'Blastoise',  isShinyLocked: false },
    { id: 3,   stars: 4, level: 50, name: 'Venusaur',   isShinyLocked: false },
    { id: 149, stars: 5, level: 55, name: 'Dragonite'  },
  ],
  johto: [
    { id: 162, stars: 1, level: 20, name: 'Furret'     },
    { id: 166, stars: 1, level: 22, name: 'Ledian'     },
    { id: 180, stars: 2, level: 28, name: 'Flaaffy'    },
    { id: 185, stars: 2, level: 30, name: 'Sudowoodo'  },
    { id: 195, stars: 2, level: 30, name: 'Quagsire'   },
    { id: 157, stars: 3, level: 42, name: 'Typhlosion' },
    { id: 160, stars: 3, level: 42, name: 'Feraligatr' },
    { id: 154, stars: 3, level: 42, name: 'Meganium'   },
    { id: 181, stars: 3, level: 40, name: 'Ampharos'   },
    { id: 169, stars: 3, level: 44, name: 'Crobat'     },
    { id: 208, stars: 3, level: 44, name: 'Steelix'    },
    { id: 197, stars: 4, level: 45, name: 'Umbreon'    },
    { id: 196, stars: 4, level: 45, name: 'Espeon'     },
    { id: 212, stars: 4, level: 48, name: 'Scizor'     },
    { id: 214, stars: 4, level: 48, name: 'Heracross'  },
    { id: 229, stars: 4, level: 50, name: 'Houndoom'   },
    { id: 248, stars: 5, level: 60, name: 'Tyranitar'  },
  ],
  hoenn: [
    { id: 264, stars: 1, level: 22, name: 'Linoone'    },
    { id: 310, stars: 2, level: 32, name: 'Manectric'  },
    { id: 271, stars: 2, level: 28, name: 'Lombre'     },
    { id: 295, stars: 2, level: 30, name: 'Exploud'    },
    { id: 303, stars: 2, level: 30, name: 'Mawile'     },
    { id: 257, stars: 3, level: 45, name: 'Blaziken'   },
    { id: 260, stars: 3, level: 45, name: 'Swampert'   },
    { id: 254, stars: 3, level: 45, name: 'Sceptile'   },
    { id: 282, stars: 3, level: 45, name: 'Gardevoir'  },
    { id: 306, stars: 4, level: 50, name: 'Aggron'     },
    { id: 330, stars: 4, level: 52, name: 'Flygon'     },
    { id: 334, stars: 4, level: 52, name: 'Altaria'    },
    { id: 373, stars: 5, level: 60, name: 'Salamence'  },
    { id: 376, stars: 5, level: 62, name: 'Metagross'  },
  ],
  sinnoh: [
    { id: 400, stars: 1, level: 25, name: 'Bibarel'    },
    { id: 404, stars: 2, level: 30, name: 'Luxio'      },
    { id: 417, stars: 2, level: 28, name: 'Pachirisu'  },
    { id: 398, stars: 3, level: 50, name: 'Staraptor'  },
    { id: 430, stars: 3, level: 50, name: 'Honchkrow'  },
    { id: 448, stars: 4, level: 55, name: 'Lucario'    },
    { id: 461, stars: 4, level: 55, name: 'Weavile'    },
    { id: 462, stars: 4, level: 55, name: 'Magnezone'  },
    { id: 468, stars: 4, level: 55, name: 'Togekiss'   },
    { id: 445, stars: 5, level: 65, name: 'Garchomp'   },
  ],
  unova: [
    { id: 505, stars: 1, level: 25, name: 'Watchog'    },
    { id: 523, stars: 2, level: 30, name: 'Zebstrika'  },
    { id: 503, stars: 3, level: 50, name: 'Samurott'   },
    { id: 528, stars: 3, level: 50, name: 'Swoobat'    },
    { id: 534, stars: 4, level: 55, name: 'Conkeldurr' },
    { id: 612, stars: 5, level: 65, name: 'Haxorus'    },
    { id: 635, stars: 5, level: 68, name: 'Hydreigon'  },
  ],
  kalos: [
    { id: 651, stars: 1, level: 25, name: 'Quilladin'  },
    { id: 661, stars: 1, level: 25, name: 'Fletchling' },
    { id: 674, stars: 2, level: 30, name: 'Pangoro'    },
    { id: 663, stars: 3, level: 45, name: 'Talonflame' },
    { id: 658, stars: 3, level: 50, name: 'Greninja'   },
    { id: 700, stars: 3, level: 50, name: 'Sylveon'    },
    { id: 681, stars: 4, level: 55, name: 'Aegislash'  },
    { id: 697, stars: 4, level: 58, name: 'Tyrantrum'  },
    { id: 706, stars: 5, level: 65, name: 'Goodra'     },
    { id: 713, stars: 4, level: 55, name: 'Avalugg'    },
    { id: 717, stars: 5, level: 70, name: 'Yveltal'    },
    { id: 716, stars: 5, level: 70, name: 'Xerneas'    },
    { id: 718, stars: 5, level: 75, name: 'Zygarde'    },
  ],
  alola: [
    { id: 735, stars: 1, level: 28, name: 'Gumshoos'   },
    { id: 738, stars: 2, level: 32, name: 'Vikavolt'   },
    { id: 730, stars: 3, level: 55, name: 'Primarina'  },
    { id: 763, stars: 3, level: 55, name: 'Tsareena'   },
    { id: 784, stars: 4, level: 60, name: 'Kommo-o'    },
    { id: 786, stars: 5, level: 65, name: 'Tapu Lele'  },
  ],
  galar: [
    { id: 813, stars: 1, level: 28, name: 'Thwackey'   },
    { id: 836, stars: 2, level: 32, name: 'Boltund'    },
    { id: 812, stars: 3, level: 55, name: 'Rillaboom'  },
    { id: 841, stars: 4, level: 60, name: 'Flapple'    },
    { id: 887, stars: 5, level: 70, name: 'Dragapult'  },
  ],
  paldea: [
    { id: 909, stars: 1, level: 28, name: 'Crocalor'   },
    { id: 921, stars: 2, level: 32, name: 'Pawmo'      },
    { id: 908, stars: 3, level: 55, name: 'Meowscarada'},
    { id: 964, stars: 4, level: 62, name: 'Palafin'    },
    { id: 998, stars: 5, level: 72, name: 'Iron Valiant'},
  ],
};


// ── Funções utilitárias ───────────────────────────────────────────────────────

export const calculateRaidMaxHp = (base = {}, level = 1, stars = 1) => {
  const hpMult = RAID_HP_MULTIPLIER[stars] || RAID_HP_MULTIPLIER[1];
  const baseHp = base.hp || 60;
  return Math.ceil(((2 * baseHp * level) / 100 + level + 10) * hpMult);
};

export const rollRaidRewards = (stars) => {
  const table = RAID_REWARDS_TABLE[stars] || RAID_REWARDS_TABLE[1];
  return table.filter(reward => Math.random() < reward.chance);
};

// Máximo de estrelas desbloqueadas com base no número de insígnias
export const RAID_MAX_STARS_BY_BADGES = (badgeCount) => {
  if (badgeCount < 2) return 1;
  if (badgeCount < 4) return 2;
  if (badgeCount < 6) return 3;
  if (badgeCount < 8) return 4;
  return 5;
};

// Tabela de pesos por tier de estrelas (conforme maxStars desbloqueado)
export const getRaidStarWeights = (maxStars) => {
  const table = {
    1: [{ stars: 1, w: 1.0 }],
    2: [{ stars: 1, w: 0.6 }, { stars: 2, w: 0.4 }],
    3: [{ stars: 1, w: 0.2 }, { stars: 2, w: 0.5 }, { stars: 3, w: 0.3 }],
    4: [{ stars: 2, w: 0.2 }, { stars: 3, w: 0.5 }, { stars: 4, w: 0.3 }],
    5: [{ stars: 3, w: 0.1 }, { stars: 4, w: 0.4 }, { stars: 5, w: 0.5 }],
  };
  return table[maxStars] || table[5];
};


export const pickRaidPokemon = (region = 'kanto', maxStars = 5, previousRegions = []) => {
  // Decide a pool: 65% região atual, 35% regiões anteriores combinadas
  const hasPrevious = previousRegions.length > 0;
  const usePreviousPool = hasPrevious && Math.random() < 0.35;

  let pool;
  if (usePreviousPool) {
    pool = previousRegions.flatMap(r => RAID_POKEMON_POOL[r] || []);
  } else {
    pool = RAID_POKEMON_POOL[region] || RAID_POKEMON_POOL.kanto;
  }

  if (!pool.length) pool = RAID_POKEMON_POOL[region] || RAID_POKEMON_POOL.kanto;

  // Filtra pelo maxStars permitido pelas insígnias
  const eligible = pool.filter(p => p.stars <= maxStars);
  if (!eligible.length) return pool[0] || null;

  // Sorteia tier de estrelas por peso (raridade maior = menos chance)
  const weights = getRaidStarWeights(maxStars);
  const totalWeight = weights.reduce((sum, w) => sum + w.w, 0);
  let rand = Math.random() * totalWeight;

  let chosenStars = weights[weights.length - 1].stars;
  for (const entry of weights) {
    rand -= entry.w;
    if (rand <= 0) { chosenStars = entry.stars; break; }
  }

  // Filtra pool pelo tier sorteado
  let tierPool = eligible.filter(p => p.stars === chosenStars);
  if (!tierPool.length) tierPool = eligible;

  return tierPool[Math.floor(Math.random() * tierPool.length)];
};

export const createRaid = (region = 'kanto', pokedex = {}, badgeCount = 0) => {
  // Calcula quais regiões o jogador já percorreu (para pool 35%)
  const regionIndex = REGION_ORDER.indexOf(region);
  const previousRegions = regionIndex > 0 ? REGION_ORDER.slice(0, regionIndex) : [];

  const maxStars = RAID_MAX_STARS_BY_BADGES(badgeCount);
  const template = pickRaidPokemon(region, maxStars, previousRegions);
  if (!template) return null;

  const base = pokedex[template.id] || {};
  // Variância de nível: +/- 1 nível para maior aleatoriedade dentro da categoria
  const level = template.level + (Math.floor(Math.random() * 3) - 1);
  const maxHp  = calculateRaidMaxHp(base, level, template.stars);
  const isShiny = !template.isShinyLocked && Math.random() < 0.01;

  return {
    id: `raid_${Date.now()}`,
    pokemonId: template.id,
    name: base.name || template.name,
    level,
    stars: template.stars,
    maxHp,
    currentHp: maxHp,
    balanceVersion: RAID_BALANCE_VERSION,
    region,
    spawnedAt: Date.now(),
    expiresAt: Date.now() + RAID_DURATION_MS,
    phase: 'idle',
    totalDamageDealt: 0,
    catchAttemptsLeft: RAID_CATCH_ATTEMPTS[template.stars] || 2,
    rewards: rollRaidRewards(template.stars),
    captured: false,
    isShiny,
    fightStartedAt: null,
    fightEndsAt: null,
  };
};




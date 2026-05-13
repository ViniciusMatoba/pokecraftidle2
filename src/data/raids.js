// ─────────────────────────────────────────────────────────────────────────────
// SISTEMA DE RAIDS
// Eventos pontuais com Pokémon raros e fortes na região atual do jogador
// ─────────────────────────────────────────────────────────────────────────────

// Tempo entre spawns automáticos de raid
export const RAID_SPAWN_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 horas

// Raids também disparam a cada X batalhas ganhas
export const RAID_BATTLE_TRIGGER = 50;

// Duração máxima de uma raid ativa (janela para participar)
export const RAID_DURATION_MS = 30 * 60 * 1000; // 30 minutos

// Duração do combate de raid
export const RAID_FIGHT_SECONDS = 300; // 5 minutos

// ── Multiplicadores de HP por estrelas ───────────────────────────────────────
export const RAID_HP_MULTIPLIER = {
  1: 8,
  2: 15,
  3: 30,
  4: 60,
  5: 100,
};

// Tentativas de captura por estrelas
export const RAID_CATCH_ATTEMPTS = {
  1: 3,
  2: 3,
  3: 2,
  4: 2,
  5: 1,
};

// Taxa de captura base
export const RAID_CATCH_RATE_MULT = {
  1: 0.55,
  2: 0.45,
  3: 0.35,
  4: 0.22,
  5: 0.12,
};

// ── EXP Candies — definição centralizada ─────────────────────────────────────
// Armazenadas em inventory.items (mochila). XP ganho por nível do Pokémon.
export const EXP_CANDIES = {
  exp_candy_xs: { id: 'exp_candy_xs', name: 'EXP Candy XS', size: 'XS', xp: 100,   color: '#86efac', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-candy-xs.png'  },
  exp_candy_s:  { id: 'exp_candy_s',  name: 'EXP Candy S',  size: 'S',  xp: 800,   color: '#4ade80', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-candy-s.png'   },
  exp_candy_m:  { id: 'exp_candy_m',  name: 'EXP Candy M',  size: 'M',  xp: 3000,  color: '#f59e0b', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-candy-m.png'   },
  exp_candy_l:  { id: 'exp_candy_l',  name: 'EXP Candy L',  size: 'L',  xp: 10000, color: '#f97316', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-candy-l.png'   },
  exp_candy_xl: { id: 'exp_candy_xl', name: 'EXP Candy XL', size: 'XL', xp: 30000, color: '#ef4444', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-candy-xl.png'  },
};

// ── Tabela de recompensas por estrelas ───────────────────────────────────────
export const RAID_REWARDS_TABLE = {
  1: [
    { type: 'item',     id: 'exp_candy_xs',      quantity: 3,    chance: 1.0 },
    { type: 'candy',    id: 'rare_candy',         quantity: 2,    chance: 1.0 },
    { type: 'currency', id: 'currency',           quantity: 500,  chance: 1.0 },
    { type: 'item',     id: 'great_ball',         quantity: 3,    chance: 0.8 },
    { type: 'material', id: 'stardust',           quantity: 5,    chance: 0.6 },
  ],
  2: [
    { type: 'item',     id: 'exp_candy_xs',      quantity: 3,    chance: 1.0 },
    { type: 'item',     id: 'exp_candy_s',       quantity: 1,    chance: 0.8 },
    { type: 'candy',    id: 'rare_candy',         quantity: 5,    chance: 1.0 },
    { type: 'currency', id: 'currency',           quantity: 1200, chance: 1.0 },
    { type: 'item',     id: 'ultra_ball',         quantity: 3,    chance: 0.9 },
    { type: 'item',     id: 'fire_stone',         quantity: 1,    chance: 0.30 },
    { type: 'item',     id: 'water_stone',        quantity: 1,    chance: 0.30 },
    { type: 'item',     id: 'thunder_stone',      quantity: 1,    chance: 0.30 },
    { type: 'material', id: 'stardust',           quantity: 10,   chance: 0.8 },
  ],
  3: [
    { type: 'item',     id: 'exp_candy_s',       quantity: 2,    chance: 1.0 },
    { type: 'item',     id: 'exp_candy_m',       quantity: 1,    chance: 0.9 },
    { type: 'candy',    id: 'rare_candy',         quantity: 10,   chance: 1.0 },
    { type: 'currency', id: 'currency',           quantity: 3000, chance: 1.0 },
    { type: 'item',     id: 'ultra_ball',         quantity: 5,    chance: 1.0 },
    { type: 'item',     id: 'tm_flamethrower',    quantity: 1,    chance: 0.30 },
    { type: 'item',     id: 'tm_thunderbolt',     quantity: 1,    chance: 0.30 },
    { type: 'item',     id: 'tm_ice_beam',        quantity: 1,    chance: 0.30 },
    { type: 'material', id: 'dragon_scale',       quantity: 1,    chance: 0.50 },
    { type: 'material', id: 'stardust',           quantity: 20,   chance: 1.0 },
  ],
  4: [
    { type: 'item',     id: 'exp_candy_m',       quantity: 2,    chance: 1.0 },
    { type: 'item',     id: 'exp_candy_l',       quantity: 1,    chance: 0.9 },
    { type: 'candy',    id: 'rare_candy',         quantity: 20,   chance: 1.0 },
    { type: 'currency', id: 'currency',           quantity: 8000, chance: 1.0 },
    { type: 'item',     id: 'ultra_ball',         quantity: 8,    chance: 1.0 },
    { type: 'item',     id: 'tm_flamethrower',    quantity: 1,    chance: 0.50 },
    { type: 'item',     id: 'tm_thunderbolt',     quantity: 1,    chance: 0.50 },
    { type: 'item',     id: 'tm_ice_beam',        quantity: 1,    chance: 0.50 },
    { type: 'item',     id: 'moon_stone',         quantity: 1,    chance: 0.40 },
    { type: 'item',     id: 'sun_stone',          quantity: 1,    chance: 0.40 },
    { type: 'material', id: 'dragon_scale',       quantity: 2,    chance: 0.70 },
    { type: 'material', id: 'stardust',           quantity: 40,   chance: 1.0 },
  ],
  5: [
    { type: 'item',     id: 'exp_candy_l',       quantity: 2,    chance: 1.0 },
    { type: 'item',     id: 'exp_candy_xl',      quantity: 1,    chance: 0.9 },
    { type: 'candy',    id: 'rare_candy',         quantity: 40,   chance: 1.0 },
    { type: 'currency', id: 'currency',           quantity: 20000,chance: 1.0 },
    { type: 'item',     id: 'ultra_ball',         quantity: 10,   chance: 1.0 },
    { type: 'item',     id: 'tm_flamethrower',    quantity: 1,    chance: 0.70 },
    { type: 'item',     id: 'tm_thunderbolt',     quantity: 1,    chance: 0.70 },
    { type: 'item',     id: 'tm_ice_beam',        quantity: 1,    chance: 0.70 },
    { type: 'item',     id: 'moon_stone',         quantity: 1,    chance: 0.60 },
    { type: 'item',     id: 'sun_stone',          quantity: 1,    chance: 0.60 },
    { type: 'item',     id: 'dawn_stone',         quantity: 1,    chance: 0.40 },
    { type: 'material', id: 'dragon_scale',       quantity: 3,    chance: 1.0 },
    { type: 'material', id: 'stardust',           quantity: 80,   chance: 1.0 },
    { type: 'material', id: 'armor_fragment',     quantity: 2,    chance: 0.50 },
  ],
};

// ── Pool de Pokémon de Raid por região ────────────────────────────────────────
export const RAID_POKEMON_POOL = {
  kanto: [
    { id: 16,  stars: 1, level: 18, name: 'Pidgeot'    },
    { id: 19,  stars: 1, level: 18, name: 'Ratticate'  },
    { id: 37,  stars: 1, level: 20, name: 'Vulpix'     },
    { id: 56,  stars: 1, level: 20, name: 'Mankey'     },
    { id: 59,  stars: 2, level: 35, name: 'Arcanine'   },
    { id: 62,  stars: 2, level: 35, name: 'Poliwrath'  },
    { id: 68,  stars: 3, level: 40, name: 'Machamp'    },
    { id: 76,  stars: 3, level: 38, name: 'Golem'      },
    { id: 94,  stars: 3, level: 42, name: 'Gengar'     },
    { id: 103, stars: 3, level: 40, name: 'Exeggutor'  },
    { id: 130, stars: 4, level: 45, name: 'Gyarados'   },
    { id: 131, stars: 4, level: 48, name: 'Lapras'     },
    { id: 143, stars: 3, level: 40, name: 'Snorlax'    },
    { id: 149, stars: 5, level: 55, name: 'Dragonite'  },
    { id: 6,   stars: 4, level: 50, name: 'Charizard',  isShinyLocked: false },
    { id: 9,   stars: 4, level: 50, name: 'Blastoise',  isShinyLocked: false },
    { id: 3,   stars: 4, level: 50, name: 'Venusaur',   isShinyLocked: false },
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
    { id: 197, stars: 4, level: 45, name: 'Umbreon'    },
    { id: 196, stars: 4, level: 45, name: 'Espeon'     },
    { id: 212, stars: 4, level: 48, name: 'Scizor'     },
    { id: 214, stars: 4, level: 48, name: 'Heracross'  },
    { id: 229, stars: 4, level: 50, name: 'Houndoom'   },
    { id: 248, stars: 5, level: 60, name: 'Tyranitar'  },
  ],
  hoenn: [
    { id: 264, stars: 1, level: 22, name: 'Linoone'    },
    { id: 271, stars: 2, level: 28, name: 'Lombre'     },
    { id: 295, stars: 2, level: 30, name: 'Exploud'    },
    { id: 303, stars: 2, level: 30, name: 'Mawile'     },
    { id: 257, stars: 3, level: 45, name: 'Blaziken'   },
    { id: 260, stars: 3, level: 45, name: 'Swampert'   },
    { id: 254, stars: 3, level: 45, name: 'Sceptile'   },
    { id: 282, stars: 3, level: 45, name: 'Gardevoir'  },
    { id: 306, stars: 4, level: 50, name: 'Aggron'     },
    { id: 330, stars: 4, level: 50, name: 'Flygon'     },
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
    { id: 674, stars: 2, level: 30, name: 'Pangoro'    },
    { id: 658, stars: 3, level: 50, name: 'Greninja'   },
    { id: 700, stars: 3, level: 50, name: 'Sylveon'    },
    { id: 715, stars: 4, level: 58, name: 'Noivern'    },
    { id: 717, stars: 5, level: 65, name: 'Yveltal'    },
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

export const rollRaidRewards = (stars) => {
  const table = RAID_REWARDS_TABLE[stars] || RAID_REWARDS_TABLE[1];
  return table.filter(reward => Math.random() < reward.chance);
};

// Máximo de estrelas desbloqueadas com base no número de insígnias
export const RAID_MAX_STARS_BY_BADGES = (badgeCount) => {
  if (badgeCount <= 1) return 1;
  if (badgeCount <= 3) return 2;
  if (badgeCount <= 5) return 3;
  if (badgeCount <= 7) return 4;
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

export const pickRaidPokemon = (region = 'kanto', maxStars = 5) => {
  const pool = RAID_POKEMON_POOL[region] || RAID_POKEMON_POOL.kanto;
  if (!pool.length) return null;

  // Filtra Pokémon disponíveis até o maxStars permitido
  const eligible = pool.filter(p => p.stars <= maxStars);
  if (!eligible.length) return pool[0]; // fallback: menor estrela disponível

  // Seleciona tier por peso
  const weights = getRaidStarWeights(maxStars);
  const totalWeight = weights.reduce((sum, w) => sum + w.w, 0);
  let rand = Math.random() * totalWeight;
  let chosenStars = weights[weights.length - 1].stars;
  for (const entry of weights) {
    rand -= entry.w;
    if (rand <= 0) { chosenStars = entry.stars; break; }
  }

  // Filtra pool pelo tier sorteado; se vazio, usa o tier mais próximo disponível
  let tierPool = eligible.filter(p => p.stars === chosenStars);
  if (!tierPool.length) tierPool = eligible;

  return tierPool[Math.floor(Math.random() * tierPool.length)];
};

export const createRaid = (region = 'kanto', pokedex = {}, badgeCount = 0) => {
  const maxStars = RAID_MAX_STARS_BY_BADGES(badgeCount);
  const template = pickRaidPokemon(region, maxStars);
  if (!template) return null;

  const base = pokedex[template.id] || {};
  const hpMult = RAID_HP_MULTIPLIER[template.stars] || 8;
  const level  = template.level;
  const baseHp = base.hp || 60;
  const maxHp  = Math.ceil(((2 * baseHp * level) / 100 + level + 10) * hpMult);
  const isShiny = !template.isShinyLocked && Math.random() < 0.01;

  return {
    id: `raid_${Date.now()}`,
    pokemonId: template.id,
    name: base.name || template.name,
    level,
    stars: template.stars,
    maxHp,
    currentHp: maxHp,
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

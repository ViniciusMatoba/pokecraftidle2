import { REGION_DEX_RANGES } from './regionStandards.js';

// ── Configurações de Raid ──────────────────────────────────────────────────
export const EXP_CANDIES = {
  exp_candy_xs: { name: 'EXP Candy XS', xp: 100,  img: '/items/exp_candy_xs.webp',  color: '#818cf8', size: 'XS' },
  exp_candy_s:  { name: 'EXP Candy S',  xp: 800,  img: '/items/exp_candy_s.webp',   color: '#60a5fa', size: 'S' },
  exp_candy_m:  { name: 'EXP Candy M',  xp: 3000, img: '/items/exp_candy_m.webp',   color: '#34d399', size: 'M' },
  exp_candy_l:  { name: 'EXP Candy L',  xp: 10000,img: '/items/exp_candy_l.webp',   color: '#fbbf24', size: 'L' },
  exp_candy_xl: { name: 'EXP Candy XL', xp: 30000,img: '/items/exp_candy_xl.webp',  color: '#f87171', size: 'XL' },
};

export const REGION_ORDER = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea'];

// ── Configurações de Raid ──────────────────────────────────────────────────
export const RAID_HP_MULTIPLIER = {
  1: 2,   // 1★ — fácil, derrota rápida
  2: 4,   // 2★ — moderado
  3: 9,   // 3★ — desafiador
  4: 18,  // 4★ — difícil mas possível (era 50)
  5: 40,  // 5★ — muito difícil, requer time forte (era 150)
};
export const RAID_CATCH_ATTEMPTS = {
  1: 5, 2: 5, 3: 5, 4: 5, 5: 5
};
export const RAID_DURATION_MS = 3600000; // 1 hora (conforme changelog V1.78.0)
export const RAID_FIGHT_SECONDS = 60;
export const RAID_BATTLE_TRIGGER = 200; // Dobrado em V1.89.5 para reduzir frequência de raids
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
    // Fragmentos específicos injetados dinamicamente em createRaid() com base no tipo do Pokémon
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
    { type: 'item',     id: 'ability_capsule',    quantity: 1,    chance: 0.08 },
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
    { type: 'item',     id: 'ability_capsule',    quantity: 1,    chance: 0.15 },
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
    { type: 'material', id: 'stardust',           quantity: 40,   chance: 1.0 },
    { type: 'material', id: 'armor_fragment',     quantity: 1,    chance: 0.30 },
    { type: 'material', id: 'mega_stone_shard',   quantity: 1,    chance: 0.50 },
    { type: 'item',     id: 'ability_capsule',    quantity: 1,    chance: 0.20 },
    // Fragmentos específicos injetados dinamicamente em createRaid() com base no tipo do Pokémon
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
    { id: 735, stars: 1, level: 28, name: 'Gumshoos'          },
    { id: 738, stars: 2, level: 32, name: 'Vikavolt'          },
    { id: 730, stars: 3, level: 55, name: 'Primarina'         },
    { id: 763, stars: 3, level: 55, name: 'Tsareena'          },
    { id: 784, stars: 4, level: 60, name: 'Kommo-o'           },
    { id: 786, stars: 5, level: 65, name: 'Tapu Lele'         },
    // Formas de Alola
    { id:  26, stars: 2, level: 35, name: 'Raichu-Alola',     formKey: 'raichu-alola'    },
    { id:  37, stars: 2, level: 30, name: 'Vulpix-Alola',     formKey: 'vulpix-alola'    },
    { id:  38, stars: 3, level: 45, name: 'Ninetales-Alola',  formKey: 'ninetales-alola' },
    { id: 103, stars: 3, level: 48, name: 'Exeggutor-Alola',  formKey: 'exeggutor-alola' },
    { id: 105, stars: 3, level: 45, name: 'Marowak-Alola',    formKey: 'marowak-alola'   },
    { id:  28, stars: 2, level: 35, name: 'Sandslash-Alola',  formKey: 'sandslash-alola' },
  ],
  galar: [
    { id: 813, stars: 1, level: 28, name: 'Thwackey'          },
    { id: 836, stars: 2, level: 32, name: 'Boltund'           },
    { id: 812, stars: 3, level: 55, name: 'Rillaboom'         },
    { id: 841, stars: 4, level: 60, name: 'Flapple'           },
    { id: 887, stars: 5, level: 70, name: 'Dragapult'         },
    // Formas de Galar
    { id:  77, stars: 2, level: 30, name: 'Ponyta-Galar',     formKey: 'ponyta-galar'    },
    { id:  78, stars: 3, level: 42, name: 'Rapidash-Galar',   formKey: 'rapidash-galar'  },
    { id: 263, stars: 1, level: 25, name: 'Zigzagoon-Galar',  formKey: 'zigzagoon-galar' },
    { id: 264, stars: 2, level: 35, name: 'Linoone-Galar',    formKey: 'linoone-galar'   },
    { id: 110, stars: 3, level: 48, name: 'Weezing-Galar',    formKey: 'weezing-galar'   },
    { id: 618, stars: 3, level: 45, name: 'Stunfisk-Galar',   formKey: 'stunfisk-galar'  },
    { id: 555, stars: 4, level: 58, name: 'Darmanitan-Galar', formKey: 'darmanitan-galar'},
  ],
  paldea: [
    { id: 909, stars: 1, level: 28, name: 'Crocalor'   },
    { id: 921, stars: 2, level: 32, name: 'Pawmo'      },
    { id: 908, stars: 3, level: 55, name: 'Meowscarada'},
    { id: 964, stars: 4, level: 62, name: 'Palafin'    },
    { id: 998, stars: 5, level: 72, name: 'Iron Valiant'},
  ],
  hisui: [
    { id: 399, stars: 1, level: 20, name: 'Bidoof'        },
    { id: 396, stars: 1, level: 22, name: 'Starly'        },
    { id:  58, stars: 2, level: 35, name: 'Growlithe-H', formKey: 'growlithe-hisui' },
    { id: 211, stars: 2, level: 38, name: 'Qwilfish-H',  formKey: 'qwilfish-hisui'  },
    { id: 215, stars: 3, level: 45, name: 'Sneasel-H',   formKey: 'sneasel-hisui'   },
    { id: 100, stars: 3, level: 48, name: 'Voltorb-H',   formKey: 'voltorb-hisui'   },
    { id: 900, stars: 4, level: 55, name: 'Kleavor'       },
    { id: 713, stars: 4, level: 58, name: 'Avalugg-H',   formKey: 'avalugg-hisui'   },
    { id: 445, stars: 4, level: 62, name: 'Garchomp'      },
    { id: 487, stars: 5, level: 72, name: 'Giratina'      , isShinyLocked: true },
    { id: 493, stars: 5, level: 80, name: 'Arceus'        , isShinyLocked: true },
  ],
};


// ── Pool de Eventos Especiais ─────────────────────────────────────────────────
// Aparecem com 8% de chance substituindo uma raid normal. Todos usam spriteUrl do Showdown.
const PS = 'https://play.pokemonshowdown.com/sprites/ani/';
export const RAID_EVENT_POOL = [
  // ── Pikachu com Chapéus ──────────────────────────────────────────────────
  { id: 25, formKey: 'pikachu-original', stars: 3, level: 35,
    name: 'Pikachu — Chapéu Kanto',    spriteUrl: `${PS}pikachu-original.gif`,
    eventLabel: 'Chapéu Especial',     isShinyLocked: true  },
  { id: 25, formKey: 'pikachu-hoenn',   stars: 3, level: 35,
    name: 'Pikachu — Chapéu Hoenn',    spriteUrl: `${PS}pikachu-hoenn.gif`,
    eventLabel: 'Chapéu Especial',     isShinyLocked: true  },
  { id: 25, formKey: 'pikachu-sinnoh',  stars: 3, level: 35,
    name: 'Pikachu — Chapéu Sinnoh',   spriteUrl: `${PS}pikachu-sinnoh.gif`,
    eventLabel: 'Chapéu Especial',     isShinyLocked: true  },
  { id: 25, formKey: 'pikachu-unova',   stars: 3, level: 35,
    name: 'Pikachu — Chapéu Unova',    spriteUrl: `${PS}pikachu-unova.gif`,
    eventLabel: 'Chapéu Especial',     isShinyLocked: true  },
  { id: 25, formKey: 'pikachu-kalos',   stars: 3, level: 35,
    name: 'Pikachu — Chapéu Kalos',    spriteUrl: `${PS}pikachu-kalos.gif`,
    eventLabel: 'Chapéu Especial',     isShinyLocked: true  },
  { id: 25, formKey: 'pikachu-alola',   stars: 3, level: 35,
    name: 'Pikachu — Chapéu Alola',    spriteUrl: `${PS}pikachu-alola.gif`,
    eventLabel: 'Chapéu Especial',     isShinyLocked: true  },
  { id: 25, formKey: 'pikachu-world',   stars: 4, level: 40,
    name: 'Pikachu — Chapéu Mundial',  spriteUrl: `${PS}pikachu-world.gif`,
    eventLabel: 'Campeão Mundial',     isShinyLocked: true  },
  // ── Greninja-Ash ─────────────────────────────────────────────────────────
  { id: 658, formKey: 'greninja-ash',   stars: 5, level: 65,
    name: 'Greninja-Ash',              spriteUrl: `${PS}greninja-ash.gif`,
    eventLabel: 'Forma Especial',      isShinyLocked: true  },
  // ── Gigantamax ───────────────────────────────────────────────────────────
  { id: 6,   formKey: 'charizard-gmax', stars: 5, level: 70,
    name: 'Charizard-GMax',            spriteUrl: `${PS}charizard-gmax.gif`,
    eventLabel: 'Gigantamax',          isShinyLocked: false },
  { id: 3,   formKey: 'venusaur-gmax',  stars: 5, level: 70,
    name: 'Venusaur-GMax',             spriteUrl: `${PS}venusaur-gmax.gif`,
    eventLabel: 'Gigantamax',          isShinyLocked: false },
  { id: 9,   formKey: 'blastoise-gmax', stars: 5, level: 70,
    name: 'Blastoise-GMax',            spriteUrl: `${PS}blastoise-gmax.gif`,
    eventLabel: 'Gigantamax',          isShinyLocked: false },
  { id: 94,  formKey: 'gengar-gmax',    stars: 5, level: 70,
    name: 'Gengar-GMax',               spriteUrl: `${PS}gengar-gmax.gif`,
    eventLabel: 'Gigantamax',          isShinyLocked: false },
  { id: 143, formKey: 'snorlax-gmax',   stars: 5, level: 70,
    name: 'Snorlax-GMax',              spriteUrl: `${PS}snorlax-gmax.gif`,
    eventLabel: 'Gigantamax',          isShinyLocked: false },
  { id: 131, formKey: 'lapras-gmax',    stars: 5, level: 68,
    name: 'Lapras-GMax',               spriteUrl: `${PS}lapras-gmax.gif`,
    eventLabel: 'Gigantamax',          isShinyLocked: false },
  { id: 68,  formKey: 'machamp-gmax',   stars: 4, level: 62,
    name: 'Machamp-GMax',              spriteUrl: `${PS}machamp-gmax.gif`,
    eventLabel: 'Gigantamax',          isShinyLocked: false },
  { id: 25,  formKey: 'pikachu-gmax',   stars: 4, level: 55,
    name: 'Pikachu-GMax',              spriteUrl: `${PS}pikachu-gmax.gif`,
    eventLabel: 'Gigantamax',          isShinyLocked: false },
  { id: 133, formKey: 'eevee-gmax',     stars: 4, level: 55,
    name: 'Eevee-GMax',                spriteUrl: `${PS}eevee-gmax.gif`,
    eventLabel: 'Gigantamax',          isShinyLocked: false },
];

// ── Mapa de Fragmentos por Tipo ───────────────────────────────────────────────
// Cada tipo Pokémon tem fragmentos de evolução temáticos que podem dropar em raids.
// O fragmento correto é injetado dinamicamente em createRaid() com base nos tipos do Pokémon.
export const TYPE_SHARD_DROPS = {
  Normal:   ['moon_stone_shard', 'shiny_stone_shard'],
  Fire:     ['fire_stone_shard', 'magmarizer_shard'],
  Water:    ['water_stone_shard', 'kings_rock_shard', 'prism_scale_shard'],
  Electric: ['thunder_stone_shard', 'electirizer_shard'],
  Grass:    ['leaf_stone_shard', 'sun_stone_shard'],
  Ice:      ['ice_stone_shard'],
  Fighting: ['dawn_stone_shard', 'kings_rock_shard'],
  Poison:   ['moon_stone_shard'],
  Ground:   ['sun_stone_shard'],
  Flying:   ['shiny_stone_shard'],
  Psychic:  ['dawn_stone_shard'],
  Bug:      ['sun_stone_shard', 'shiny_stone_shard'],
  Rock:     ['sun_stone_shard'],
  Ghost:    ['dusk_stone_shard', 'reaper_cloth_shard'],
  Dragon:   ['dragon_scale'],
  Dark:     ['dusk_stone_shard', 'reaper_cloth_shard'],
  Steel:    ['metal_coat_shard', 'kings_rock_shard'],
  Fairy:    ['shiny_stone_shard', 'moon_stone_shard'],
};

// Converte Base Stat Total (BST) em tier de estrelas para raids
const bstToStars = (bst) => {
  if (bst < 295) return 1;
  if (bst < 400) return 2;
  if (bst < 490) return 3;
  if (bst < 575) return 4;
  return 5;
};

// Nível base por tier de estrelas (variância +/-2 é aplicada em createRaid)
const STAR_BASE_LEVEL = { 1: 20, 2: 32, 3: 46, 4: 56, 5: 66 };

// Constrói pool dinâmico com TODOS os Pokémon das regiões desbloqueadas
const buildDynamicRaidPool = (regions, pokedex, maxStars) => {
  const entries = [];
  for (const region of regions) {
    const range = REGION_DEX_RANGES[region];
    if (!range) continue;
    for (let id = range.min; id <= range.max; id++) {
      const base = pokedex[id];
      if (!base) continue;
      const bst = (base.hp || 45) + (base.attack || 45) + (base.defense || 45) +
                  (base.spAtk || 45) + (base.spDef || 45) + (base.speed || 45);
      const stars = bstToStars(bst);
      if (stars > maxStars) continue;
      entries.push({ id, stars, level: STAR_BASE_LEVEL[stars] || 20, name: base.name });
    }
  }
  return entries;
};

// Constrói drops de fragmento temático com base nos tipos do Pokémon da raid
const buildTypeShardRewards = (types = [], stars = 1) => {
  if (stars < 2 || !types.length) return [];
  const rewards = [];
  const seen = new Set();

  // Processa tipo primário (sempre) e tipo secundário (50% de chance)
  const typesToProcess = types.slice(0, 2).filter((_, i) => i === 0 || Math.random() < 0.5);

  for (const type of typesToProcess) {
    const shardOptions = TYPE_SHARD_DROPS[type];
    if (!shardOptions || !shardOptions.length) continue;
    const shardId = shardOptions[Math.floor(Math.random() * shardOptions.length)];
    if (seen.has(shardId)) continue;
    seen.add(shardId);

    // Chance e quantidade escalada pelo tier de estrelas
    const CHANCES   = [0, 0, 0.40, 0.55, 0.70, 0.85];
    const QTY_RANGE = [0, 0, [1,1], [1,2], [2,3], [3,5]];
    const chance  = CHANCES[Math.min(stars, 5)];
    if (Math.random() > chance) continue;

    const range = QTY_RANGE[Math.min(stars, 5)];
    const qty   = range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));
    const isMaterial = shardId === 'dragon_scale' || shardId.endsWith('_shard');

    rewards.push({ type: isMaterial ? 'material' : 'item', id: shardId, quantity: qty, chance: 1.0 });
  }
  return rewards;
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


export const pickRaidPokemon = (region = 'kanto', maxStars = 5, previousRegions = [], pokedex = {}) => {
  const allRegions = [...new Set([region, ...previousRegions])];

  // Pool dinâmico: TODOS os Pokémon das regiões desbloqueadas
  const dynamicPool = buildDynamicRaidPool(allRegions, pokedex, maxStars);

  // Pool curado: entradas especiais com formas, shiny locks e nível tuningado
  const hasPrevious = previousRegions.length > 0;
  const usePreviousCurated = hasPrevious && Math.random() < 0.35;
  const curatedRegion = usePreviousCurated
    ? previousRegions[Math.floor(Math.random() * previousRegions.length)]
    : region;
  const curatedPool = (RAID_POKEMON_POOL[curatedRegion] || RAID_POKEMON_POOL.kanto)
    .filter(p => p.stars <= maxStars);

  // 55% pool dinâmico (garante todos os Pokémon), 45% pool curado (formas especiais)
  const useDynamic = dynamicPool.length > 0 && (curatedPool.length === 0 || Math.random() < 0.55);
  let pool = useDynamic ? dynamicPool : curatedPool;
  if (!pool.length) pool = dynamicPool.length ? dynamicPool : (RAID_POKEMON_POOL[region] || RAID_POKEMON_POOL.kanto);

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

  // 8% de chance de raid de evento especial
  const isEvent = RAID_EVENT_POOL.length > 0 && Math.random() < 0.08;
  const template = isEvent
    ? RAID_EVENT_POOL[Math.floor(Math.random() * RAID_EVENT_POOL.length)]
    : pickRaidPokemon(region, maxStars, previousRegions, pokedex);

  if (!template) return null;

  const base = pokedex[template.id] || {};
  // Variância de nível: +/- 2 níveis para maior aleatoriedade dentro da categoria
  const level = template.level + (Math.floor(Math.random() * 5) - 2);
  const isShiny = !template.isShinyLocked && Math.random() < 0.01;
  // Eventos especiais não são Alfa
  const isAlpha = !isEvent && Math.random() < 0.05;
  const stars = template.stars;
  const baseMaxHp = calculateRaidMaxHp(base, level, stars);
  const maxHp = isAlpha ? Math.floor(baseMaxHp * 1.5) : baseMaxHp;

  // Recompensas base + fragmentos temáticos baseados nos tipos do Pokémon
  const baseRewards  = rollRaidRewards(stars);
  const shardRewards = !isEvent ? buildTypeShardRewards(base.types || [], stars) : [];
  const rewards = [...baseRewards, ...shardRewards];

  return {
    id: `raid_${Date.now()}`,
    pokemonId: template.id,
    formKey: template.formKey || null,
    // Override de sprite para eventos (GMax, chapéus, Greninja-Ash, etc.)
    spriteUrl: template.spriteUrl || null,
    // Nome de exibição: evento usa nome completo da forma; normal usa nome do pokédex
    name: isEvent ? template.name : (base.name || template.name),
    level,
    stars,
    maxHp,
    currentHp: maxHp,
    balanceVersion: RAID_BALANCE_VERSION,
    region,
    spawnedAt: Date.now(),
    expiresAt: Date.now() + RAID_DURATION_MS,
    phase: 'idle',
    totalDamageDealt: 0,
    catchAttemptsLeft: RAID_CATCH_ATTEMPTS[stars] || 2,
    rewards,
    captured: false,
    isShiny,
    isAlpha,
    isEvent,
    eventLabel: template.eventLabel || null,
    fightStartedAt: null,
    fightEndsAt: null,
  };
};




// ── CLASSIFICAÇÃO DE RARIDADE POR ESPÉCIE ──────────────────────────────
// Listas curadas de espécies "especiais" (todas as 9 gerações) usadas pelo
// classificador automático em utils/pokemonDifficulty.js.
//
// Tudo aqui é por ID de espécie base (National Dex). Formas alternativas
// (megas/regionais, ids >= 10000) herdam a raridade da base via `id % 10000`.

// Iniciais (formas base) de todas as gerações → super_rare no mundo selvagem.
export const STARTER_IDS = new Set([
  1, 4, 7,        // Kanto
  152, 155, 158,  // Johto
  252, 255, 258,  // Hoenn
  387, 390, 393,  // Sinnoh
  495, 498, 501,  // Unova
  650, 653, 656,  // Kalos
  722, 725, 728,  // Alola
  810, 813, 816,  // Galar
  906, 909, 912,  // Paldea
]);

// Pseudo-lendários (formas finais, BST 600) → super_rare.
export const PSEUDO_LEGENDARY_IDS = new Set([
  149, // Dragonite
  248, // Tyranitar
  373, // Salamence
  376, // Metagross
  445, // Garchomp
  635, // Hydreigon
  706, // Goodra
  784, // Kommo-o
  887, // Dragapult
  998, // Baxcalibur
]);

// Ultra Beasts (Gen 7) → super_rare.
export const ULTRA_BEAST_IDS = new Set([
  793, 794, 795, 796, 797, 798, 799, // Nihilego … Guzzlord
  803, 804, 805, 806,                // Poipole, Naganadel, Stakataka, Blacephalon
]);

// Pokémon Paradoxo (Gen 9, passado e futuro) → super_rare.
export const PARADOX_IDS = new Set([
  984, 985, 986, 987, 988, 989,      // Great Tusk … Sandy Shocks (antigos)
  990, 991, 992, 993, 994, 995,      // Iron Treads … Iron Thorns (futuros)
  1005, 1006,                        // Roaring Moon, Iron Valiant
  1009, 1010,                        // Walking Wake, Iron Leaves
  1020, 1021, 1022, 1023,            // Gouging Fire, Raging Bolt, Iron Boulder, Iron Crown
]);

// Lendários + Míticos de todas as gerações → legendary (o tier mais raro).
export const LEGENDARY_IDS = new Set([
  // Gen 1
  144, 145, 146, 150, 151,
  // Gen 2
  243, 244, 245, 249, 250, 251,
  // Gen 3
  377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
  // Gen 4
  480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
  // Gen 5
  494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
  // Gen 6
  716, 717, 718, 719, 720, 721,
  // Gen 7
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 801, 802, 807, 808, 809,
  // Gen 8
  888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905,
  // Gen 9
  1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024, 1025,
]);

// Normaliza uma forma alternativa (mega/regional) para a espécie base.
// Convenção do jogo: `id % 10000` (ex.: Mega Venusaur 10003 → 3).
export const baseSpeciesId = (id) => {
  const n = Number(id);
  if (!Number.isFinite(n)) return n;
  return n >= 10000 ? n % 10000 : n;
};

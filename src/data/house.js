// Sistema da Casa do Treinador
// Desbloqueada após vencer Brock (badge 1)
// Custo inicial: 5000 coins
// Começa com 4 slots de plantação
// Slots adicionais custam mais coins e exigem mais Pokémon cuidadores

export const HOUSE_PURCHASE_COST = 5000;

// Expansões de slot disponíveis para compra
export const HOUSE_SLOT_EXPANSIONS = [
  { slots: 4,  totalSlots: 4,  cost: 0,      pokemonRequired: 1, label: 'Inicial - 4 canteiros' },
  { slots: 2,  totalSlots: 6,  cost: 3000,   pokemonRequired: 2, label: '+2 canteiros' },
  { slots: 2,  totalSlots: 8,  cost: 8000,   pokemonRequired: 3, label: '+2 canteiros' },
  { slots: 4,  totalSlots: 12, cost: 20000,  pokemonRequired: 4, label: '+4 canteiros' },
  { slots: 4,  totalSlots: 16, cost: 50000,  pokemonRequired: 6, label: '+4 canteiros' },
  { slots: 8,  totalSlots: 24, cost: 120000, pokemonRequired: 8, label: '+8 canteiros' },
];

// Tipos de Pokémon que podem cuidar da plantação
// Grass: crescimento mais rápido
// Water: maior rendimento de berries
// Normal: efeito equilibrado
// Bug: reduz pragas (aumenta chance de drop raro)
// Fairy: chance de drop de item especial
export const CARETAKER_TYPES = ['Grass', 'Water', 'Normal', 'Bug', 'Fairy'];

// Efeitos por tipo de cuidador
export const CARETAKER_BONUSES = {
  Grass:  { growthMult: 1.5,  yieldMult: 1.0, rarityBonus: 0.00, specialBonus: 0.00, label: '🌿 Crescimento +50%' },
  Water:  { growthMult: 1.0,  yieldMult: 1.5, rarityBonus: 0.00, specialBonus: 0.00, label: '💧 Rendimento +50%' },
  Normal: { growthMult: 1.2,  yieldMult: 1.2, rarityBonus: 0.00, specialBonus: 0.00, label: '⚖️ Crescimento e Rendimento +20%' },
  Bug:    { growthMult: 1.0,  yieldMult: 1.0, rarityBonus: 0.15, specialBonus: 0.00, label: '🐞 Drop Raro +15%' },
  Fairy:  { growthMult: 1.0,  yieldMult: 1.0, rarityBonus: 0.00, specialBonus: 0.10, label: '✨ Item Especial +10%' },
};

// Plantas disponíveis para cultivo
// growthTime: tempo base em minutos
// yield: quantidade base colhida
// drops: o que dropa ao colher
// rare_drops: drops raros com chance baixa
export const PLANTABLE_ITEMS = {

  // BERRIES
  cheri_berry: {
    id: 'cheri_berry',
    name: 'Cheri Berry',
    icon: '🍒',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cheri-berry.png',
    description: 'Cura paralisia. Ingrediente para Antídotos e Repels.',
    growthTime: 15,
    yield: { min: 2, max: 5 },
    seed: 'cheri_seed',
    drops: ['cheri_berry'],
    rare_drops: [],
    cost: 50,
    shopCost: 50,
    shopUnlock: null,
    type: 'berry',
  },

  chesto_berry: {
    id: 'chesto_berry',
    name: 'Chesto Berry',
    icon: '🫐',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/chesto-berry.png',
    description: 'Cura sono. Ingrediente para Despertar e Poções.',
    growthTime: 15,
    yield: { min: 2, max: 5 },
    seed: 'chesto_seed',
    drops: ['chesto_berry'],
    rare_drops: [],
    cost: 50,
    shopCost: 50,
    shopUnlock: null,
    type: 'berry',
  },

  pecha_berry: {
    id: 'pecha_berry',
    name: 'Pecha Berry',
    icon: '🍑',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pecha-berry.png',
    description: 'Cura envenenamento. Ingrediente para Antídotos.',
    growthTime: 15,
    yield: { min: 2, max: 5 },
    seed: 'pecha_seed',
    drops: ['pecha_berry'],
    rare_drops: [],
    cost: 50,
    shopCost: 50,
    shopUnlock: null,
    type: 'berry',
  },

  rawst_berry: {
    id: 'rawst_berry',
    name: 'Rawst Berry',
    icon: '🧊',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rawst-berry.png',
    description: 'Cura queimadura. Ingrediente para Cura de Fogo.',
    growthTime: 15,
    yield: { min: 2, max: 5 },
    seed: 'rawst_seed',
    drops: ['rawst_berry'],
    rare_drops: [],
    cost: 50,
    shopCost: 50,
    shopUnlock: null,
    type: 'berry',
  },

  aspear_berry: {
    id: 'aspear_berry',
    name: 'Aspear Berry',
    icon: '🍐',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/aspear-berry.png',
    description: 'Cura congelamento. Ingrediente para Gelo Quente.',
    growthTime: 20,
    yield: { min: 2, max: 4 },
    seed: 'aspear_seed',
    drops: ['aspear_berry'],
    rare_drops: [],
    cost: 80,
    shopCost: 80,
    shopUnlock: 'boulder_badge',
    type: 'berry',
  },

  leppa_berry: {
    id: 'leppa_berry',
    name: 'Leppa Berry',
    icon: '🍅',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leppa-berry.png',
    description: 'Restaura 10 PP de um golpe. Rara e valiosa.',
    growthTime: 60,
    yield: { min: 1, max: 3 },
    seed: 'leppa_seed',
    drops: ['leppa_berry'],
    rare_drops: [],
    cost: 300,
    shopCost: 300,
    shopUnlock: 'cascade_badge',
    type: 'berry',
  },

  oran_berry: {
    id: 'oran_berry',
    name: 'Oran Berry',
    icon: '🫐',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',
    description: 'Restaura 10 HP. Ingrediente para Poções básicas.',
    growthTime: 20,
    yield: { min: 3, max: 6 },
    seed: 'oran_seed',
    drops: ['oran_berry'],
    rare_drops: [],
    cost: 60,
    shopCost: 60,
    shopUnlock: null,
    type: 'berry',
  },

  sitrus_berry: {
    id: 'sitrus_berry',
    name: 'Sitrus Berry',
    icon: '👊',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png',
    description: 'Restaura 25% do HP máximo. Excelente para batalhas.',
    growthTime: 45,
    yield: { min: 2, max: 4 },
    seed: 'sitrus_seed',
    drops: ['sitrus_berry'],
    rare_drops: [],
    cost: 200,
    shopCost: 200,
    shopUnlock: 'cascade_badge',
    type: 'berry',
  },

  lum_berry: {
    id: 'lum_berry',
    name: 'Lum Berry',
    icon: '🌿',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lum-berry.png',
    description: 'Cura qualquer condição de status. Muito rara.',
    growthTime: 120,
    yield: { min: 1, max: 2 },
    seed: 'lum_seed',
    drops: ['lum_berry'],
    rare_drops: [],
    cost: 1000,
    shopCost: 1000,
    shopUnlock: 'rainbow_badge',
    type: 'berry',
  },

  // APRICORNS
  black_apricorn: {
    id: 'black_apricorn',
    name: 'Apricorn Preto',
    icon: '⚫',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/black-apricorn.png',
    description: 'Para fabricar Heavy Ball. Cresce devagar, rende bem.',
    growthTime: 60,
    yield: { min: 2, max: 4 },
    seed: 'black_apricorn_seed',
    drops: ['black_apricorn'],
    rare_drops: ['apricorn'],
    cost: 200,
    type: 'apricorn',
  },

  blue_apricorn: {
    id: 'blue_apricorn',
    name: 'Blue Apricorn',
    icon: '💀',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/blue-apricorn.png',
    description: 'Para fabricar Lure Ball. Boa taxa de crescimento.',
    growthTime: 45,
    yield: { min: 2, max: 5 },
    seed: 'blue_apricorn_seed',
    drops: ['blue_apricorn'],
    rare_drops: ['apricorn'],
    cost: 150,
    type: 'apricorn',
  },

  green_apricorn: {
    id: 'green_apricorn',
    name: 'Green Apricorn',
    icon: '🟢',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/green-apricorn.png',
    description: 'Para fabricar Friend Ball.',
    growthTime: 45,
    yield: { min: 2, max: 5 },
    seed: 'green_apricorn_seed',
    drops: ['green_apricorn'],
    rare_drops: ['apricorn'],
    cost: 150,
    type: 'apricorn',
  },

  pink_apricorn: {
    id: 'pink_apricorn',
    name: 'Pink Apricorn',
    icon: '>w',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pink-apricorn.png',
    description: 'Para fabricar Love Ball.',
    growthTime: 50,
    yield: { min: 2, max: 4 },
    seed: 'pink_apricorn_seed',
    drops: ['pink_apricorn'],
    rare_drops: ['pink_dust'],
    cost: 180,
    type: 'apricorn',
  },

  red_apricorn: {
    id: 'red_apricorn',
    name: 'Red Apricorn',
    icon: '=4',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/red-apricorn.png',
    description: 'Para fabricar Level Ball.',
    growthTime: 40,
    yield: { min: 3, max: 5 },
    seed: 'red_apricorn_seed',
    drops: ['red_apricorn'],
    rare_drops: ['apricorn'],
    cost: 120,
    type: 'apricorn',
  },

  white_apricorn: {
    id: 'white_apricorn',
    name: 'White Apricorn',
    icon: '⚪',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/white-apricorn.png',
    description: 'Para fabricar Fast Ball.',
    growthTime: 35,
    yield: { min: 3, max: 6 },
    seed: 'white_apricorn_seed',
    drops: ['white_apricorn'],
    rare_drops: ['apricorn'],
    cost: 100,
    type: 'apricorn',
  },

  yellow_apricorn: {
    id: 'yellow_apricorn',
    name: 'Yellow Apricorn',
    icon: '🟡',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/yellow-apricorn.png',
    description: 'Para fabricar Moon Ball.',
    growthTime: 50,
    yield: { min: 2, max: 4 },
    seed: 'yellow_apricorn_seed',
    drops: ['yellow_apricorn', 'moon_stone_shard'],
    rare_drops: ['moon_stone_shard'],
    cost: 200,
    shopCost: 200,
    shopUnlock: 'thunder_badge',
    type: 'apricorn',
  },
};

// ───── PLANTAS DE ESSÊNCIA ─────
export const ESSENCE_PLANTS = {
  fire_herb: {
    id: 'fire_herb',
    name: 'Erva de Fogo',
    icon: '🔥',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png',
    description: 'Produz essências de fogo, usadas na Forja de Equipamentos.',
    growthTime: 90,
    yield: { min: 3, max: 8 },
    seed: 'fire_herb_seed',
    drops: ['fire_essence'],
    rare_drops: ['fire_stone_shard'],
    cost: 0,
    shopCost: 800,
    shopUnlock: 'volcano_badge',
    type: 'herb',
  },
  water_herb: {
    id: 'water_herb',
    name: 'Erva de Água',
    icon: '💧',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png',
    description: 'Produz essências de água, usadas na Forja de Equipamentos.',
    growthTime: 90,
    yield: { min: 3, max: 8 },
    seed: 'water_herb_seed',
    drops: ['water_essence'],
    rare_drops: ['water_stone_shard'],
    cost: 0,
    shopCost: 800,
    shopUnlock: 'cascade_badge',
    type: 'herb',
  },
  leaf_herb: {
    id: 'leaf_herb',
    name: 'Erva de Folha',
    icon: '🌿',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png',
    description: 'Produz essências de grama, usadas na Forja de Equipamentos.',
    growthTime: 90,
    yield: { min: 3, max: 8 },
    seed: 'leaf_herb_seed',
    drops: ['grass_essence'],
    rare_drops: ['leaf_stone_shard'],
    cost: 0,
    shopCost: 800,
    shopUnlock: 'boulder_badge',
    type: 'herb',
  },
  thunder_herb: {
    id: 'thunder_herb',
    name: 'Erva Elétrica',
    icon: '⚡',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png',
    description: 'Produz essências elétricas, usadas na Forja de Equipamentos.',
    growthTime: 90,
    yield: { min: 3, max: 8 },
    seed: 'thunder_herb_seed',
    drops: ['electric_essence'],
    rare_drops: ['thunder_stone_shard'],
    cost: 0,
    shopCost: 800,
    shopUnlock: 'thunder_badge',
    type: 'herb',
  },
  ice_herb: {
    id: 'ice_herb',
    name: 'Erva Gélida',
    icon: '❄️',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/never-melt-ice.png',
    description: 'Produz essências de gelo, usadas na Forja de Equipamentos.',
    growthTime: 120,
    yield: { min: 2, max: 6 },
    seed: 'ice_herb_seed',
    drops: ['ice_essence'],
    rare_drops: [],
    cost: 0,
    shopCost: 1200,
    shopUnlock: 'soul_badge',
    type: 'herb',
  },
};

// Combina Berries, Apricorns e Ervas de Essência
export const ALL_PLANTABLE_ITEMS = { ...PLANTABLE_ITEMS, ...ESSENCE_PLANTS };

// Fórmula para calcular drops ao colher
// Leva em conta os bônus dos cuidadores
export const calcHarvestDrops = (plant, caretakerBonuses) => {
  const growthMult = caretakerBonuses.growthMult || 1.0;
  const yieldMult  = caretakerBonuses.yieldMult  || 1.0;
  const rarityBonus   = caretakerBonuses.rarityBonus   || 0;
  const specialBonus  = caretakerBonuses.specialBonus  || 0;

  const baseYield = Math.floor(
    (plant.yield.min + Math.random() * (plant.yield.max - plant.yield.min)) * yieldMult
  );

  const drops = { [plant.drops[0]]: baseYield };

  // Drop raro
  if (plant.rare_drops.length > 0) {
    const rareChance = 0.10 + rarityBonus;
    if (Math.random() < rareChance) {
      const rareDrop = plant.rare_drops[Math.floor(Math.random() * plant.rare_drops.length)];
      drops[rareDrop] = (drops[rareDrop] || 0) + 1;
    }
  }

  // Drop especial (Fairy caretaker)
  if (specialBonus > 0 && Math.random() < specialBonus) {
    drops['mystic_dust'] = (drops['mystic_dust'] || 0) + 1;
  }

  return drops;
};

// Calcular tempo real de crescimento com bônus
export const calcGrowthTime = (plant, caretakerBonuses) => {
  const growthMult = caretakerBonuses.growthMult || 1.0;
  return Math.floor((plant.growthTime * 60 * 1000) / growthMult);
};

// Calcular bônus combinados dos cuidadores (acumulativo com cap para balancear)
export const calcCombinedCaretakerBonus = (caretakers) => {
  if (!caretakers || caretakers.length === 0) {
    return { growthMult: 1.0, yieldMult: 1.0, rarityBonus: 0, specialBonus: 0 };
  }
  const MAX_MULT = 3.0; // cap de 3x para não quebrar o balanço
  const combined = { growthMult: 1.0, yieldMult: 1.0, rarityBonus: 0, specialBonus: 0 };
  caretakers.forEach(p => {
    const type = p.type || 'Normal';
    const bonus = CARETAKER_BONUSES[type] || CARETAKER_BONUSES.Normal;
    combined.growthMult  = Math.min(MAX_MULT, combined.growthMult  + (bonus.growthMult  - 1));
    combined.yieldMult   = Math.min(MAX_MULT, combined.yieldMult   + (bonus.yieldMult   - 1));
    combined.rarityBonus  = Math.min(0.50,   combined.rarityBonus  + bonus.rarityBonus);
    combined.specialBonus = Math.min(0.30,   combined.specialBonus + bonus.specialBonus);
  });
  return combined;
};

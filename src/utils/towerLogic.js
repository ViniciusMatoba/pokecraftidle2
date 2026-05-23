import { POKEDEX } from '../data/pokedex';

// Helper: Pega Pokémon base (estágio inicial)
// BUG-FIX: stats são planos no POKEDEX (p.hp, p.attack…), NÃO aninhados em p.baseStats.
// Moves ficam em p.learnset (array {level, move}), NÃO em p.moves.levelUp.
export const getTowerStarters = () => {
  const basics = Object.values(POKEDEX).filter(p =>
    !p.evolutionOf && !p.isLegendary && !p.isMythical && !p.form && p.hp
  );
  const shuffled = basics.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map(p => {
    const maxHp = Math.max(1, Math.floor(2 * (p.hp || 45) * 5 / 100) + 5 + 10);
    const moves = (p.learnset || [])
      .filter(m => m.level <= 5)
      .map(m => m.move)
      .filter(Boolean);
    return {
      id: p.id,
      name: p.name,
      level: 5,
      exp: 0,
      hp: maxHp,
      currentHp: maxHp,
      maxHp,
      types: p.types || [p.type || 'Normal'],
      moves: moves.length > 0 ? moves : ['tackle'],
    };
  });
};

export const createInitialTowerState = () => ({
  activeRun: null, // null significa que não há run em andamento
  highestFloor: 0,
  bp: 0,
  upgrades: {}, // meta-upgrades se houver
  checkpoint: null // Guarda o estado do último checkpoint
});

export const generateFloorShop = (floor) => {
  const shop = [
    { type: 'item', id: 'potions', name: 'Tower Potion (Cura 50 HP)', cost: 20 },
    { type: 'item', id: 'revives', name: 'Tower Revive (Revive 50%)', cost: 100 },
    ...getRandomBoons(1).map(b => ({ type: 'boon', boon: b, name: b.name, desc: b.desc, cost: 150 }))
  ];
  
  if (Math.random() < 0.3) { // 30% chance de recrutamento
    const recruitLevel = 5 + Math.floor(floor * 2);
    const basics = Object.values(POKEDEX).filter(p =>
      !p.evolutionOf && !p.isLegendary && !p.isMythical && !p.form && p.hp
    );
    const p = basics[Math.floor(Math.random() * basics.length)];
    if (p) {
      const maxHp = Math.max(1, Math.floor(2 * (p.hp || 45) * recruitLevel / 100) + recruitLevel + 10);
      const moves = (p.learnset || [])
        .filter(m => m.level <= recruitLevel)
        .map(m => m.move)
        .filter(Boolean)
        .slice(-4);
      shop.push({
        type: 'recruit',
        pokemon: {
          id: p.id,
          name: p.name,
          level: recruitLevel,
          exp: 0,
          hp: maxHp,
          currentHp: maxHp,
          maxHp,
          types: p.types || [p.type || 'Normal'],
          moves: moves.length > 0 ? moves : ['tackle'],
        },
        name: `Recrutar ${p.name}`,
        desc: `Adiciona ao seu time (Nível ${recruitLevel}).`,
        cost: 50,
      });
    }
  }
  return shop;
};

export const startTowerRun = (starterPokemon) => {
  return {
    floor: 1,
    team: [starterPokemon],
    // BUG-FIX: inventário plano — a UI acessa inv.potions/inv.revives diretamente
    // (estrutura aninhada items:{} causava NaN no display e escrita incorreta na loja)
    inventory: {
      coins: 0,
      potions: 0,
      revives: 0,
    },
    boons: [],
    shop: generateFloorShop(1),
  };
};

export const resumeTowerRun = (checkpoint) => {
  const run = JSON.parse(JSON.stringify(checkpoint));
  if (!run.shop) run.shop = generateFloorShop(run.floor);
  return run;
};

export const getCheckpointFloor = (currentFloor) => {
  // Retorna o último andar terminado em 1 (11, 21, 31...)
  if (currentFloor <= 10) return 1;
  return Math.floor((currentFloor - 1) / 10) * 10 + 1;
};

export const generateTowerEncounter = (floor) => {
  // A cada 10 andares é um Boss
  const isBoss = floor % 10 === 0;
  
  const enemyLevel = 5 + Math.floor(floor * 2.2);

  const pool = Object.values(POKEDEX).filter(p => {
    if (floor < 20 && p.isLegendary) return false;
    return true;
  });

  const numEnemies = isBoss ? Math.min(6, 3 + Math.floor(floor / 10)) : Math.min(6, 1 + Math.floor(floor / 5));
  const team = [];

  for (let i = 0; i < numEnemies; i++) {
    const p = pool[Math.floor(Math.random() * pool.length)];
    team.push({
      id: p.id,
      level: isBoss ? enemyLevel + 2 : enemyLevel
    });
  }

  // Gera a Shop do Andar: 3 itens + 1 Benção
  const shopOfferings = [
    { type: 'item', id: 'potions', name: 'Tower Potion (Cura 50 HP)', cost: 20 },
    { type: 'item', id: 'revives', name: 'Tower Revive (Revive 50%)', cost: 100 },
    ...getRandomBoons(1).map(b => ({ type: 'boon', boon: b, name: b.name, desc: b.desc, cost: 150 }))
  ];

  return {
    isBoss,
    enemyLevel,
    team,
    rewardCoins: isBoss ? floor * 50 : floor * 10,
    shop: shopOfferings
  };
};

export const TOWER_BOONS = [
  { id: 'vampirism', name: 'Vampirismo', desc: 'Recupera 10% do HP máx de todos os vivos após vencer.', type: 'heal' },
  { id: 'attack_up', name: 'Fúria', desc: '+15% de Dano de Ataque para a equipe toda.', type: 'buff' },
  { id: 'defense_up', name: 'Muralha', desc: '-15% de Dano Recebido pela equipe toda.', type: 'buff' },
  { id: 'exp_boost', name: 'Mente Focada', desc: '+50% XP ganha nas batalhas da torre.', type: 'utility' },
  { id: 'revive_one', name: 'Anjo da Guarda', desc: 'Revive instantaneamente 1 Pokémon caído com 50% HP.', type: 'instant' }
];

export const getRandomBoons = (count = 3) => {
  const shuffled = [...TOWER_BOONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

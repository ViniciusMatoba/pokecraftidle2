import { POKEDEX } from './pokedex';
import { calcBattleStat, calcHpStat } from '../utils/gameHelpers';

const STARTER_LEVEL = 5;

const STARTER_MOVES = {
  1: [
    { name: 'Investida', power: 40, type: 'Normal', category: 'Physical' },
    { name: 'Chicote de Vinha', power: 45, type: 'Grass', category: 'Physical' },
  ],
  4: [
    { name: 'Arranhão', power: 40, type: 'Normal', category: 'Physical' },
    { name: 'Brasa', power: 40, type: 'Fire', category: 'Special' },
  ],
  7: [
    { name: 'Investida', power: 40, type: 'Normal', category: 'Physical' },
    { name: "Pistola d'Água", power: 40, type: 'Water', category: 'Special' },
  ],
  25: [
    { name: 'Choque do Trovão', power: 40, type: 'Electric', category: 'Special' },
    { name: 'Ataque Rápido', power: 40, type: 'Normal', category: 'Physical' },
  ],
  133: [
    { name: 'Investida', power: 40, type: 'Normal', category: 'Physical' },
    { name: 'Ataque Rápido', power: 40, type: 'Normal', category: 'Physical' },
  ],
};

const buildStarter = (id) => {
  const base = POKEDEX[id] || {};
  const maxHp = calcHpStat(base.hp ?? base.maxHp, STARTER_LEVEL);
  const moves = STARTER_MOVES[id] || [
    { name: 'Investida', power: 40, type: 'Normal', category: 'Physical' },
  ];

  return {
    id,
    name: base.name,
    type: base.type,
    types: base.types || [base.type],
    level: STARTER_LEVEL,
    hp: maxHp,
    maxHp,
    attack: calcBattleStat(base.attack, STARTER_LEVEL),
    defense: calcBattleStat(base.defense, STARTER_LEVEL),
    spAtk: calcBattleStat(base.spAtk, STARTER_LEVEL),
    spDef: calcBattleStat(base.spDef, STARTER_LEVEL),
    speed: calcBattleStat(base.speed, STARTER_LEVEL),
    xp: 0,
    moves,
    learnedMoves: [...moves],
  };
};

export const INITIAL_POKEMONS = [1, 4, 7, 25, 133].map(buildStarter);

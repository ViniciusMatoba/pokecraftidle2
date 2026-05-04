export const INITIAL_POKEMONS = [
  { 
    id: 1, name: 'Bulbasaur', type: 'Grass', types: ['Grass', 'Poison'], level: 5,
    hp: 75, maxHp: 75, attack: 14, defense: 18, spAtk: 18, spDef: 18, speed: 12, xp: 0,
    moves: [
      { name: 'Investida', power: 40, type: 'Normal', category: 'Physical' },
      { name: 'Chicote de Vinha', power: 45, type: 'Grass', category: 'Physical' }
    ],
    learnedMoves: [
      { name: 'Investida', power: 40, type: 'Normal', category: 'Physical' },
      { name: 'Chicote de Vinha', power: 45, type: 'Grass', category: 'Physical' }
    ]
  },
  { 
    id: 4, name: 'Charmander', type: 'Fire', types: ['Fire'], level: 5,
    hp: 70, maxHp: 70, attack: 16, defense: 16, spAtk: 15, spDef: 14, speed: 18, xp: 0,
    moves: [
      { name: 'Arranhão', power: 40, type: 'Normal', category: 'Physical' },
      { name: 'Brasa',    power: 40, type: 'Fire', category: 'Special' }
    ],
    learnedMoves: [
      { name: 'Arranhão', power: 40, type: 'Normal', category: 'Physical' },
      { name: 'Brasa',    power: 40, type: 'Fire', category: 'Special' }
    ]
  },
  { 
    id: 7, name: 'Squirtle', type: 'Water', types: ['Water'], level: 5,
    hp: 80, maxHp: 80, attack: 13, defense: 22, spAtk: 14, spDef: 18, speed: 11, xp: 0,
    moves: [
      { name: 'Investida',       power: 40, type: 'Normal', category: 'Physical' },
      { name: "Pistola d'Água",  power: 40, type: 'Water', category: 'Special' }
    ],
    learnedMoves: [
      { name: 'Investida',       power: 40, type: 'Normal', category: 'Physical' },
      { name: "Pistola d'Água",  power: 40, type: 'Water', category: 'Special' }
    ]
  },
  { 
    id: 25, name: 'Pikachu', type: 'Electric', types: ['Electric'], level: 5,
    hp: 65, maxHp: 65, attack: 18, defense: 14, spAtk: 14, spDef: 13, speed: 22, xp: 0,
    moves: [
      { name: 'Choque do Trovão', power: 40, type: 'Electric', category: 'Special' },
      { name: 'Ataque Rápido',    power: 40, type: 'Normal', category: 'Physical' }
    ],
    learnedMoves: [
      { name: 'Choque do Trovão', power: 40, type: 'Electric', category: 'Special' },
      { name: 'Ataque Rápido',    power: 40, type: 'Normal', category: 'Physical' }
    ]
  },
  { 
    id: 133, name: 'Eevee', type: 'Normal', types: ['Normal'], level: 5,
    hp: 75, maxHp: 75, attack: 15, defense: 18, spAtk: 13, spDef: 18, speed: 16, xp: 0,
    moves: [
      { name: 'Investida',        power: 40, type: 'Normal', category: 'Physical' },
      { name: 'Ataque Rápido',    power: 40, type: 'Normal', category: 'Physical' }
    ],
    learnedMoves: [
      { name: 'Investida',        power: 40, type: 'Normal', category: 'Physical' },
      { name: 'Ataque Rápido',    power: 40, type: 'Normal', category: 'Physical' }
    ]
  }
];

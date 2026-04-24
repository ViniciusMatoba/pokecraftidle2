export const SHOP_ITEMS = [
  { id: 'pokeball', name: 'Poké Ball', price: 200, description: 'Básico para capturar Pokémon.', icon: '🔴' },
  { id: 'greatball', name: 'Great Ball', price: 600, description: 'Melhor taxa de captura.', icon: '💀' },
  { id: 'potion', name: 'Poção', price: 300, description: 'Cura 20 HP do Pokémon ativo.', icon: '🧪' },
  { id: 'antidote', name: 'Antídoto', price: 100, description: 'Cura envenenamento.', icon: '💊' }
];

export const FORGE_RECIPES = [
  { 
    id: 'exp_share', 
    name: 'Exp. Share', 
    cost: { iron_ore: 10, currency: 1000 }, 
    description: 'Toda a equipe ganha XP nas batalhas.', 
    icon: '📡' 
  },
  { 
    id: 'silk_scarf', 
    name: 'Silk Scarf', 
    cost: { silk: 15, currency: 500 }, 
    description: 'Aumenta o dano de ataques Normal.', 
    icon: '🧣' 
  },
  { 
    id: 'sharp_beak', 
    name: 'Sharp Beak', 
    cost: { feather: 20, currency: 800 }, 
    description: 'Aumenta o dano de ataques Flying.', 
    icon: '🦅' 
  }
];

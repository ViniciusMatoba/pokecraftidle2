export const CRAFTING_RECIPES = {
  consumables: [
    { id: 'pokeballs', name: 'Poké Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', cost: { normal_essence: 10, currency: 100 }, type: 'ball' },
    { id: 'great_ball', name: 'Great Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', cost: { iron_ore: 5, normal_essence: 20, currency: 400 }, type: 'ball' },
    { id: 'ultra_ball', name: 'Ultra Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', cost: { mystic_dust: 5, iron_ore: 10, currency: 1200 }, type: 'ball' },
    { id: 'revive', name: 'Revive', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png', cost: { grass_essence: 15, ghost_essence: 5, currency: 500 }, type: 'healing' },
    { id: 'max_repel', name: 'Max Repel', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-repel.png', cost: { poison_essence: 20, psychic_essence: 5, currency: 300 }, type: 'utility' },
    { id: 'thunder_stone', name: 'Thunder Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png', cost: { electric_essence: 50, currency: 5000 }, type: 'evolution' },
    { id: 'moon_stone', name: 'Moon Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png', cost: { normal_essence: 50, currency: 5000 }, type: 'evolution' },
    { id: 'link_cable', name: 'Link Cable', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/up-grade.png', cost: { electric_essence: 20, normal_essence: 20, currency: 10000 }, type: 'evolution' }
  ],
  hold_items: [
    { id: 'charcoal', name: 'Charcoal', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charcoal.png', cost: { fire_essence: 50, currency: 5000 }, effect: '+20% Fire Dmg' },
    { id: 'mystic_water', name: 'Mysty Water', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mystic-water.png', cost: { water_essence: 50, currency: 5000 }, effect: '+20% Water Dmg' },
    { id: 'black_belt', name: 'Black Belt', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/black-belt.png', cost: { fighting_essence: 50, currency: 5000 }, effect: '+20% Fighting Dmg' },
    { id: 'magnet', name: 'Magnet', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/magnet.png', cost: { electric_essence: 50, currency: 5000 }, effect: '+20% Electric Dmg' },
    { id: 'quick_claw', name: 'Quick Claw', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/quick-claw.png', cost: { flying_essence: 30, steel_essence: 10, currency: 7000 }, effect: 'Speed Priority' }
  ],
  tms: [
    { id: 'tm_flamethrower', name: 'TM Flamethrower', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fire.png', cost: { fire_essence: 100, psychic_essence: 20, currency: 15000 } },
    { id: 'tm_thunderbolt', name: 'TM Thunderbolt', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-electric.png', cost: { electric_essence: 100, psychic_essence: 20, currency: 15000 } },
    { id: 'tm_ice_beam', name: 'TM Ice Beam', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-ice.png', cost: { ice_essence: 100, psychic_essence: 20, currency: 15000 } }
  ]
};

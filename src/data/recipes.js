export const CRAFTING_RECIPES = {
  consumables: [
    { id: 'pokeballs', name: 'Poké Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', cost: { normal_essence: 10, currency: 100 }, type: 'ball' },
    { id: 'great_ball', name: 'Great Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png', cost: { iron_ore: 5, normal_essence: 20, currency: 400 }, type: 'ball' },
    { id: 'ultra_ball', name: 'Ultra Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png', cost: { mystic_dust: 5, iron_ore: 10, currency: 1200 }, type: 'ball' },
    { id: 'revive', name: 'Revive', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png', cost: { grass_essence: 15, ghost_essence: 5, currency: 500 }, type: 'healing' },
    { id: 'max_repel', name: 'Max Repel', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-repel.png', cost: { poison_essence: 20, psychic_essence: 5, currency: 300 }, type: 'utility' },
    { id: 'fire_stone', name: 'Fire Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png', cost: { fire_stone_shard: 5, fire_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'water_stone', name: 'Water Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png', cost: { water_stone_shard: 5, water_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'leaf_stone', name: 'Leaf Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png', cost: { leaf_stone_shard: 5, grass_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'thunder_stone', name: 'Thunder Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png', cost: { thunder_stone_shard: 5, electric_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'moon_stone', name: 'Moon Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png', cost: { moon_stone_shard: 5, normal_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'sun_stone', name: 'Sun Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png', cost: { sun_stone_shard: 5, grass_essence: 10, fire_essence: 10, currency: 2500 }, type: 'evolution' },
    { id: 'shiny_stone', name: 'Shiny Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-stone.png', cost: { shiny_stone_shard: 5, psychic_essence: 10, fairy_essence: 10, currency: 3000 }, type: 'evolution' },
    { id: 'dusk_stone', name: 'Dusk Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-stone.png', cost: { dusk_stone_shard: 5, ghost_essence: 10, dark_essence: 10, currency: 3000 }, type: 'evolution' },
    { id: 'dawn_stone', name: 'Dawn Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dawn-stone.png', cost: { dawn_stone_shard: 5, psychic_essence: 10, fighting_essence: 10, currency: 3000 }, type: 'evolution' },
    { id: 'ice_stone', name: 'Ice Stone', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ice-stone.png', cost: { ice_stone_shard: 5, ice_essence: 20, currency: 2500 }, type: 'evolution' },
    { id: 'link_cable', name: 'Link Cable', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/link-cable.png', cost: { link_cable_part: 5, electric_essence: 10, normal_essence: 10, currency: 5000 }, type: 'evolution' }
  ],
  hold_items: [
    // ── Tipo Normal ───────────────────────────────────────────────────────────
    { id: 'silk_scarf',    name: 'Silk Scarf',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/silk-scarf.png',    cost: { normal_essence: 50, silk: 20, currency: 5000 },           effect: '+20% Normal Dmg' },
    // ── Tipo Fogo ─────────────────────────────────────────────────────────────
    { id: 'charcoal',      name: 'Charcoal',        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charcoal.png',       cost: { fire_essence: 50, currency: 5000 },                        effect: '+20% Fire Dmg' },
    // ── Tipo Água ─────────────────────────────────────────────────────────────
    { id: 'mystic_water',  name: 'Mystic Water',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mystic-water.png',   cost: { water_essence: 50, currency: 5000 },                       effect: '+20% Water Dmg' },
    // ── Tipo Elétrico ─────────────────────────────────────────────────────────
    { id: 'magnet',        name: 'Magnet',           img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/magnet.png',         cost: { electric_essence: 50, currency: 5000 },                    effect: '+20% Electric Dmg' },
    // ── Tipo Planta ───────────────────────────────────────────────────────────
    { id: 'miracle_seed',  name: 'Miracle Seed',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/miracle-seed.png',   cost: { grass_essence: 50, currency: 5000 },                       effect: '+20% Grass Dmg' },
    // ── Tipo Gelo ─────────────────────────────────────────────────────────────
    { id: 'never_melt_ice',name: 'NeverMeltIce',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/never-melt-ice.png', cost: { ice_essence: 50, currency: 5000 },                         effect: '+20% Ice Dmg' },
    // ── Tipo Lutador ──────────────────────────────────────────────────────────
    { id: 'black_belt',    name: 'Black Belt',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/black-belt.png',     cost: { fighting_essence: 50, currency: 5000 },                    effect: '+20% Fighting Dmg' },
    // ── Tipo Veneno ───────────────────────────────────────────────────────────
    { id: 'poison_barb',   name: 'Poison Barb',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poison-barb.png',    cost: { poison_essence: 50, currency: 5000 },                      effect: '+20% Poison Dmg' },
    // ── Tipo Terra ────────────────────────────────────────────────────────────
    { id: 'soft_sand',     name: 'Soft Sand',        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soft-sand.png',      cost: { ground_essence: 50, currency: 5000 },                      effect: '+20% Ground Dmg' },
    // ── Tipo Voador ───────────────────────────────────────────────────────────
    { id: 'sharp_beak',    name: 'Sharp Beak',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sharp-beak.png',     cost: { flying_essence: 50, currency: 5000 },                      effect: '+20% Flying Dmg' },
    // ── Tipo Psíquico ─────────────────────────────────────────────────────────
    { id: 'twisted_spoon', name: 'Twisted Spoon',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/twisted-spoon.png',  cost: { psychic_essence: 50, currency: 5000 },                     effect: '+20% Psychic Dmg' },
    // ── Tipo Inseto ───────────────────────────────────────────────────────────
    { id: 'silver_powder', name: 'Silver Powder',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/silver-powder.png',  cost: { bug_essence: 50, silk: 10, currency: 5000 },               effect: '+20% Bug Dmg' },
    // ── Tipo Pedra ────────────────────────────────────────────────────────────
    { id: 'hard_stone',    name: 'Hard Stone',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hard-stone.png',     cost: { rock_essence: 50, iron_ore: 10, currency: 5000 },          effect: '+20% Rock Dmg' },
    // ── Tipo Fantasma ─────────────────────────────────────────────────────────
    { id: 'spell_tag',     name: 'Spell Tag',        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/spell-tag.png',      cost: { ghost_essence: 50, mystic_dust: 10, currency: 6000 },      effect: '+20% Ghost Dmg' },
    // ── Tipo Dragão ───────────────────────────────────────────────────────────
    { id: 'dragon_fang',   name: 'Dragon Fang',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-fang.png',    cost: { dragon_essence: 40, dragon_scale: 3, currency: 10000 },    effect: '+20% Dragon Dmg' },
    // ── Tipo Sombrio ──────────────────────────────────────────────────────────
    { id: 'black_glasses', name: 'Black Glasses',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/black-glasses.png',  cost: { dark_essence: 50, currency: 6000 },                        effect: '+20% Dark Dmg' },
    // ── Tipo Aço ──────────────────────────────────────────────────────────────
    { id: 'metal_coat',    name: 'Metal Coat',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png',     cost: { steel_essence: 50, iron_ore: 20, currency: 8000 },         effect: '+20% Steel Dmg' },
    // ── Tipo Fada ─────────────────────────────────────────────────────────────
    { id: 'fairy_feather', name: 'Fairy Feather',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pixie-plate.png',    cost: { fairy_essence: 50, pink_dust: 15, currency: 8000 },        effect: '+20% Fairy Dmg' },
    // ── Velocidade ────────────────────────────────────────────────────────────
    { id: 'quick_claw',    name: 'Quick Claw',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/quick-claw.png',     cost: { flying_essence: 30, steel_essence: 10, currency: 7000 },  effect: '+15% Velocidade/Dano' },
    // ── Itens Especiais ───────────────────────────────────────────────────────
    { id: 'leftovers',     name: 'Leftovers',        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leftovers.png',      cost: { normal_essence: 80, apricorn: 20, currency: 12000 },       effect: 'Recupera 5% HP/turno' },
    { id: 'life_orb',      name: 'Life Orb',         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/life-orb.png',       cost: { dragon_essence: 30, mystic_dust: 20, currency: 25000 },    effect: '+30% Dmg, -8% HP/turno' },
    { id: 'expert_belt',   name: 'Expert Belt',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/expert-belt.png',    cost: { fighting_essence: 60, steel_essence: 20, currency: 15000 },effect: '+20% Dmg Super-Efetivo' },
    { id: 'focus_sash',    name: 'Focus Sash',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-sash.png',     cost: { psychic_essence: 40, silk: 30, currency: 18000 },          effect: 'Sobrevive 1 golpe fatal' },
  ],
  elite_relics: [
    { 
      id: 'titan_shield', 
      name: 'Escudo de Titã', 
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png', 
      cost: { armor_fragment: 5, steel_essence: 30, iron_ore: 20, currency: 25000 }, 
      effect: '-20% Dano de Boss',
      description: 'Armadura reforçada que reduz o impacto dos ataques de Bosses Mundiais.',
      type: 'hold_item',
      isBossItem: true
    },
    { 
      id: 'adrenaline_potion', 
      name: 'Poção de Adrenalina', 
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/elixir.png', 
      cost: { fury_essence: 10, psychic_essence: 20, currency: 15000 }, 
      effect: '+25% Atk vs Boss',
      description: 'Estimulante químico que aumenta o poder ofensivo especificamente contra Bosses.',
      type: 'hold_item',
      isBossItem: true
    },
    { 
      id: 'penetration_pendant', 
      name: 'Pingente de Penetração', 
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sharp-beak.png', 
      cost: { stardust: 10, dragon_scale: 5, psychic_essence: 30, currency: 40000 }, 
      effect: 'Ignora 30% Def Boss',
      description: 'Pingente místico que permite encontrar brechas na armadura impenetrável de Bosses.',
      type: 'hold_item',
      isBossItem: true
    }
  ],
  tms: [
    // Tier 1 — Kanto (5.000–15.000 coins)
    { id: 'tm_thunder_wave', name: 'TM Thunder Wave', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-electric.png', cost: { electric_essence: 40, thunder_fang: 5, currency: 5000 } },
    { id: 'tm_toxic', name: 'TM Toxic', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-poison.png', cost: { poison_essence: 40, poison_barb: 5, currency: 6000 } },
    { id: 'tm_dig', name: 'TM Dig', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-ground.png', cost: { ground_essence: 40, hard_shell: 5, currency: 7000 } },
    { id: 'tm_aerial_ace', name: 'TM Aerial Ace', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-flying.png', cost: { flying_essence: 40, feather: 5, currency: 8000 } },
    { id: 'tm_shadow_ball', name: 'TM Shadow Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-ghost.png', cost: { ghost_essence: 40, spirit_dust: 5, currency: 10000 } },
    { id: 'tm_brick_break', name: 'TM Brick Break', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fighting.png', cost: { fighting_essence: 40, aura_fragment: 5, currency: 12000 } },
    { id: 'tm_rock_tomb', name: 'TM Rock Tomb', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-rock.png', cost: { rock_essence: 40, hard_shell: 5, currency: 13000 } },
    { id: 'tm_thief', name: 'TM Thief', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-dark.png', cost: { dark_essence: 40, sharp_claw: 5, currency: 15000 } },

    // Tier 2 — Johto/Hoenn (20.000–40.000 coins)
    { id: 'tm_earthquake', name: 'TM Earthquake', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-ground.png', cost: { ground_essence: 100, hard_shell: 15, currency: 30000 } },
    { id: 'tm_surf', name: 'TM Surf', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-water.png', cost: { water_essence: 100, wave_stone: 15, currency: 25000 } },
    { id: 'tm_rock_slide', name: 'TM Rock Slide', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-rock.png', cost: { rock_essence: 100, hard_shell: 15, currency: 22000 } },
    { id: 'tm_bulk_up', name: 'TM Bulk Up', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fighting.png', cost: { fighting_essence: 100, aura_fragment: 15, currency: 20000 } },
    { id: 'tm_calm_mind', name: 'TM Calm Mind', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-psychic.png', cost: { psychic_essence: 100, spirit_dust: 15, currency: 28000 } },
    { id: 'tm_swords_dance', name: 'TM Swords Dance', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png', cost: { normal_essence: 100, sharp_claw: 15, currency: 35000 } },
    { id: 'tm_fire_punch', name: 'TM Fire Punch', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fire.png', cost: { fire_essence: 80, ember_shard: 10, currency: 24000 } },
    { id: 'tm_thunder_punch', name: 'TM Thunder Punch', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-electric.png', cost: { electric_essence: 80, thunder_fang: 10, currency: 24000 } },
    { id: 'tm_ice_punch', name: 'TM Ice Punch', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-ice.png', cost: { ice_essence: 80, ice_crystal: 10, currency: 24000 } },
    { id: 'tm_drain_punch', name: 'TM Drain Punch', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fighting.png', cost: { fighting_essence: 80, aura_fragment: 10, currency: 26000 } },

    // Tier 3 — Sinnoh/Unova (50.000–80.000 coins)
    { id: 'tm_aura_sphere', name: 'TM Aura Sphere', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fighting.png', cost: { fighting_essence: 150, aura_fragment: 25, currency: 60000 } },
    { id: 'tm_stone_edge', name: 'TM Stone Edge', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-rock.png', cost: { rock_essence: 150, hard_shell: 25, currency: 55000 } },
    { id: 'tm_flash_cannon', name: 'TM Flash Cannon', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-steel.png', cost: { steel_essence: 150, hard_shell: 25, currency: 58000 } },
    { id: 'tm_dark_pulse', name: 'TM Dark Pulse', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-dark.png', cost: { dark_essence: 150, spirit_dust: 25, currency: 65000 } },
    { id: 'tm_energy_ball', name: 'TM Energy Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-grass.png', cost: { grass_essence: 150, leaf_debris: 25, currency: 50000 } },
    { id: 'tm_close_combat', name: 'TM Close Combat', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fighting.png', cost: { fighting_essence: 200, aura_fragment: 30, currency: 80000 } },
    { id: 'tm_stealth_rock', name: 'TM Stealth Rock', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-rock.png', cost: { rock_essence: 120, hard_shell: 20, currency: 52000 } },
    { id: 'tm_dragon_claw', name: 'TM Dragon Claw', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-dragon.png', cost: { dragon_essence: 150, dragon_fang: 25, currency: 75000 } },
    { id: 'tm_wild_charge', name: 'TM Wild Charge', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-electric.png', cost: { electric_essence: 150, thunder_fang: 25, currency: 62000 } },
    { id: 'tm_giga_drain', name: 'TM Giga Drain', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-grass.png', cost: { grass_essence: 150, leaf_debris: 25, currency: 54000 } },

    // Tier 4 — Kalos+ / Elite (100.000+ coins)
    { id: 'tm_moonblast', name: 'TM Moonblast', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fairy.png', cost: { fairy_essence: 250, spirit_dust: 40, currency: 120000 } },
    { id: 'tm_dazzling_gleam', name: 'TM Dazzling Gleam', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fairy.png', cost: { fairy_essence: 200, scale_dust: 30, currency: 100000 } },
    { id: 'tm_dragon_dance', name: 'TM Dragon Dance', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-dragon.png', cost: { dragon_essence: 250, dragon_fang: 40, currency: 150000 } },
    { id: 'tm_nasty_plot', name: 'TM Nasty Plot', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-dark.png', cost: { dark_essence: 200, spirit_dust: 30, currency: 110000 } },
    { id: 'tm_hyper_voice', name: 'TM Hyper Voice', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png', cost: { normal_essence: 250, scale_dust: 30, currency: 105000 } },
    { id: 'tm_leaf_storm', name: 'TM Leaf Storm', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-grass.png', cost: { grass_essence: 250, leaf_debris: 40, currency: 130000 } },
    { id: 'tm_hurricane', name: 'TM Hurricane', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-flying.png', cost: { flying_essence: 250, feather: 40, currency: 115000 } },
    { id: 'tm_focus_blast', name: 'TM Focus Blast', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fighting.png', cost: { fighting_essence: 250, aura_fragment: 40, currency: 140000 } },
    { id: 'tm_flare_blitz', name: 'TM Flare Blitz', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fire.png', cost: { fire_essence: 250, ember_shard: 40, currency: 135000 } },
    { id: 'tm_earthquake_ex', name: 'TM Tera Blast', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png', cost: { dragon_essence: 300, stardust: 50, scale_dust: 50, currency: 250000 } },
    
    // Legacy / Others
    { id: 'tm_flamethrower', name: 'TM Flamethrower', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-fire.png', cost: { fire_essence: 100, psychic_essence: 20, currency: 15000 } },
    { id: 'tm_thunderbolt', name: 'TM Thunderbolt', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-electric.png', cost: { electric_essence: 100, psychic_essence: 20, currency: 15000 } },
    { id: 'tm_ice_beam', name: 'TM Ice Beam', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-ice.png', cost: { ice_essence: 100, psychic_essence: 20, currency: 15000 } }
  ],
  mega_stones: [
    { id: 'charizardite_x', name: 'Charizardite X', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charizardite-x.png', cost: { mega_stone_shard: 10, fire_essence: 100, dragon_essence: 50, currency: 50000 } },
    { id: 'charizardite_y', name: 'Charizardite Y', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charizardite-y.png', cost: { mega_stone_shard: 10, fire_essence: 100, flying_essence: 50, currency: 50000 } },
    { id: 'venusaurite', name: 'Venusaurite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/venusaurite.png', cost: { mega_stone_shard: 10, grass_essence: 100, poison_essence: 50, currency: 50000 } },
    { id: 'blastoisinite', name: 'Blastoisinite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/blastoisinite.png', cost: { mega_stone_shard: 10, water_essence: 100, steel_essence: 50, currency: 50000 } },
    { id: 'lucarionite', name: 'Lucarionite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucarionite.png', cost: { mega_stone_shard: 15, fighting_essence: 120, steel_essence: 80, currency: 75000 } },
    { id: 'garchompite', name: 'Garchompite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/garchompite.png', cost: { mega_stone_shard: 15, dragon_essence: 120, ground_essence: 80, currency: 75000 } },
    { id: 'gardevoirite', name: 'Gardevoirite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gardevoirite.png', cost: { mega_stone_shard: 10, psychic_essence: 100, fairy_essence: 50, currency: 50000 } },
    { id: 'blazikenite', name: 'Blazikenite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/blazikenite.png', cost: { mega_stone_shard: 10, fire_essence: 100, fighting_essence: 50, currency: 50000 } },
    { id: 'gengarite', name: 'Gengarite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gengarite.png', cost: { mega_stone_shard: 10, ghost_essence: 100, poison_essence: 50, currency: 55000 } },
    { id: 'metagrossite', name: 'Metagrossite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metagrossite.png', cost: { mega_stone_shard: 15, steel_essence: 120, psychic_essence: 80, currency: 80000 } },
    { id: 'mewtwonite_x', name: 'Mewtwonite X', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mewtwonite-x.png', cost: { mega_stone_shard: 25, psychic_essence: 200, fighting_essence: 100, currency: 150000 } },
    { id: 'mewtwonite_y', name: 'Mewtwonite Y', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mewtwonite-y.png', cost: { mega_stone_shard: 25, psychic_essence: 200, flying_essence: 100, currency: 150000 } },
    { id: 'alakazite', name: 'Alakazite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/alakazite.png', cost: { mega_stone_shard: 10, psychic_essence: 100, currency: 50000 } },
    { id: 'gyaradosite', name: 'Gyaradosite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/gyaradosite.png', cost: { mega_stone_shard: 10, water_essence: 100, dark_essence: 50, currency: 50000 } },
    { id: 'salamencite', name: 'Salamencite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/salamencite.png', cost: { mega_stone_shard: 15, dragon_essence: 120, flying_essence: 80, currency: 80000 } },
    { id: 'tyranitarite', name: 'Tyranitarite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tyranitarite.png', cost: { mega_stone_shard: 15, rock_essence: 120, dark_essence: 80, currency: 80000 } },
    { id: 'beedrillite', name: 'Beedrillite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/beedrillite.png', cost: { mega_stone_shard: 10, bug_essence: 100, poison_essence: 50, currency: 40000 } },
    { id: 'pidgeotite', name: 'Pidgeotite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pidgeotite.png', cost: { mega_stone_shard: 10, flying_essence: 100, normal_essence: 50, currency: 40000 } },
    { id: 'slowbronite', name: 'Slowbronite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/slowbronite.png', cost: { mega_stone_shard: 10, water_essence: 100, psychic_essence: 50, currency: 45000 } },
    { id: 'kangaskhanite', name: 'Kangaskhanite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kangaskhanite.png', cost: { mega_stone_shard: 10, normal_essence: 150, currency: 50000 } },
    { id: 'pinsirite', name: 'Pinsirite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pinsirite.png', cost: { mega_stone_shard: 10, bug_essence: 100, flying_essence: 50, currency: 45000 } },
    { id: 'aerodactylite', name: 'Aerodactylite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/aerodactylite.png', cost: { mega_stone_shard: 10, rock_essence: 100, flying_essence: 50, currency: 50000 } },
    { id: 'ampharosite', name: 'Ampharosite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ampharosite.png', cost: { mega_stone_shard: 10, electric_essence: 100, dragon_essence: 50, currency: 50000 } },
    { id: 'steelixite', name: 'Steelixite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/steelixite.png', cost: { mega_stone_shard: 10, steel_essence: 100, ground_essence: 50, currency: 50000 } },
    { id: 'scizorite', name: 'Scizorite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scizorite.png', cost: { mega_stone_shard: 10, bug_essence: 100, steel_essence: 50, currency: 50000 } },
    { id: 'heracronite', name: 'Heracronite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heracronite.png', cost: { mega_stone_shard: 10, bug_essence: 100, fighting_essence: 50, currency: 50000 } },
    { id: 'houndoominite', name: 'Houndoominite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/houndoominite.png', cost: { mega_stone_shard: 10, fire_essence: 100, dark_essence: 50, currency: 50000 } },
    { id: 'sceptilite', name: 'Sceptilite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sceptilite.png', cost: { mega_stone_shard: 10, grass_essence: 100, dragon_essence: 50, currency: 50000 } },
    { id: 'swampertite', name: 'Swampertite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/swampertite.png', cost: { mega_stone_shard: 10, water_essence: 100, ground_essence: 50, currency: 50000 } },
    { id: 'sableyite', name: 'Sableyite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sableyite.png', cost: { mega_stone_shard: 10, dark_essence: 100, ghost_essence: 50, currency: 45000 } },
    { id: 'mawilite', name: 'Mawilite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mawilite.png', cost: { mega_stone_shard: 10, steel_essence: 100, fairy_essence: 50, currency: 45000 } },
    { id: 'aggronite', name: 'Aggronite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/aggronite.png', cost: { mega_stone_shard: 10, steel_essence: 150, currency: 55000 } },
    { id: 'medichamite', name: 'Medichamite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/medichamite.png', cost: { mega_stone_shard: 10, fighting_essence: 100, psychic_essence: 50, currency: 45000 } },
    { id: 'manectite', name: 'Manectite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/manectite.png', cost: { mega_stone_shard: 10, electric_essence: 100, currency: 45000 } },
    { id: 'sharpedonite', name: 'Sharpedonite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sharpedonite.png', cost: { mega_stone_shard: 10, water_essence: 100, dark_essence: 50, currency: 45000 } },
    { id: 'cameruptite', name: 'Cameruptite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cameruptite.png', cost: { mega_stone_shard: 10, fire_essence: 100, ground_essence: 50, currency: 45000 } },
    { id: 'altarianite', name: 'Altarianite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/altarianite.png', cost: { mega_stone_shard: 10, dragon_essence: 100, fairy_essence: 50, currency: 50000 } },
    { id: 'banettite', name: 'Banettite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/banettite.png', cost: { mega_stone_shard: 10, ghost_essence: 100, currency: 45000 } },
    { id: 'absolite', name: 'Absolite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/absolite.png', cost: { mega_stone_shard: 10, dark_essence: 100, currency: 50000 } },
    { id: 'glalitite', name: 'Glalitite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/glalitite.png', cost: { mega_stone_shard: 10, ice_essence: 100, currency: 45000 } },
    { id: 'latiasite', name: 'Latiasite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/latiasite.png', cost: { mega_stone_shard: 20, psychic_essence: 150, dragon_essence: 100, currency: 100000 } },
    { id: 'latiosite', name: 'Latiosite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/latiosite.png', cost: { mega_stone_shard: 20, psychic_essence: 150, dragon_essence: 100, currency: 100000 } },
    { id: 'abomasnowite', name: 'Abomasnowite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/abomasnowite.png', cost: { mega_stone_shard: 10, grass_essence: 100, ice_essence: 50, currency: 50000 } },
    { id: 'galladite', name: 'Galladite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/galladite.png', cost: { mega_stone_shard: 10, psychic_essence: 100, fighting_essence: 50, currency: 50000 } },
    { id: 'audinite', name: 'Audinite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/audinite.png', cost: { mega_stone_shard: 10, normal_essence: 100, fairy_essence: 50, currency: 40000 } },
    { id: 'diancite', name: 'Diancite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/diancite.png', cost: { mega_stone_shard: 30, rock_essence: 250, fairy_essence: 250, currency: 250000 } },
    { id: 'rayquazaite', name: 'Rayquazaite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meteorite.png', cost: { mega_stone_shard: 50, dragon_essence: 500, flying_essence: 500, currency: 500000 } },
    { id: 'raichuite_x', name: 'Raichuite X', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, electric_essence: 100, fighting_essence: 50, currency: 60000 } },
    { id: 'raichuite_y', name: 'Raichuite Y', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, electric_essence: 100, psychic_essence: 50, currency: 60000 } },
    { id: 'dragonitite', name: 'Dragonitite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 20, dragon_essence: 200, flying_essence: 100, currency: 100000 } },
    { id: 'meganiumite', name: 'Meganiumite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, grass_essence: 150, fairy_essence: 50, currency: 75000 } },
    { id: 'typhlosionite', name: 'Typhlosionite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, fire_essence: 150, ghost_essence: 50, currency: 75000 } },
    { id: 'feraligatrite', name: 'Feraligatrite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, water_essence: 150, dark_essence: 50, currency: 75000 } },
    { id: 'torterrite', name: 'Torterrite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, grass_essence: 150, ground_essence: 50, currency: 75000 } },
    { id: 'infernapite', name: 'Infernapite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, fire_essence: 150, fighting_essence: 50, currency: 75000 } },
    { id: 'empoleonite', name: 'Empoleonite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, water_essence: 150, steel_essence: 50, currency: 75000 } },
    { id: 'serperiorite', name: 'Serperiorite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, grass_essence: 150, dragon_essence: 50, currency: 75000 } },
    { id: 'emboarite', name: 'Emboarite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, fire_essence: 150, fighting_essence: 50, currency: 75000 } },
    { id: 'samurottite', name: 'Samurottite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, water_essence: 150, steel_essence: 50, currency: 75000 } },
    { id: 'chesnaughtite', name: 'Chesnaughtite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, grass_essence: 150, fighting_essence: 50, currency: 75000 } },
    { id: 'delphoxite', name: 'Delphoxite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, fire_essence: 150, psychic_essence: 50, currency: 75000 } },
    { id: 'greninjite', name: 'Greninjite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, water_essence: 150, dark_essence: 50, currency: 75000 } },
    { id: 'decidueyite', name: 'Decidueyite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, grass_essence: 150, ghost_essence: 50, currency: 75000 } },
    { id: 'incineroarite', name: 'Incineroarite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, fire_essence: 150, dark_essence: 50, currency: 75000 } },
    { id: 'primarinite', name: 'Primarinite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, water_essence: 150, fairy_essence: 50, currency: 75000 } },
    { id: 'rillaboomite', name: 'Rillaboomite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, grass_essence: 150, currency: 75000 } },
    { id: 'cinderacite', name: 'Cinderacite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, fire_essence: 150, currency: 75000 } },
    { id: 'inteleonite', name: 'Inteleonite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, water_essence: 150, currency: 75000 } },
    { id: 'meowscaradite', name: 'Meowscaradite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, grass_essence: 150, dark_essence: 50, currency: 75000 } },
    { id: 'skeledirgite', name: 'Skeledirgite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, fire_essence: 150, ghost_essence: 50, currency: 75000 } },
    { id: 'quaquavalite', name: 'Quaquavalite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, water_essence: 150, fighting_essence: 50, currency: 75000 } },
    { id: 'flygonite', name: 'Flygonite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, dragon_essence: 150, bug_essence: 50, currency: 80000 } },
    { id: 'luxrayite', name: 'Luxrayite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, electric_essence: 150, dark_essence: 50, currency: 80000 } },
    { id: 'haxorusite', name: 'Haxorusite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, dragon_essence: 150, steel_essence: 50, currency: 80000 } },
    { id: 'hydreigonite', name: 'Hydreigonite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 20, dragon_essence: 200, dark_essence: 100, currency: 100000 } },
    { id: 'goodraite', name: 'Goodraite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 20, dragon_essence: 200, water_essence: 100, currency: 100000 } },
    { id: 'kommo_oite', name: 'Kommo-oite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 20, dragon_essence: 200, fighting_essence: 100, currency: 100000 } },
    { id: 'dragapultite', name: 'Dragapultite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 20, dragon_essence: 200, ghost_essence: 100, currency: 100000 } },
    { id: 'baxcaliburite', name: 'Baxcaliburite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 20, dragon_essence: 200, ice_essence: 100, currency: 100000 } },
    { id: 'golisopodite', name: 'Golisopodite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 15, bug_essence: 150, water_essence: 50, currency: 80000 } },
    { id: 'heatranite', name: 'Heatranite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 25, fire_essence: 250, steel_essence: 100, currency: 150000 } },
    { id: 'darkraiite', name: 'Darkraiite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 25, dark_essence: 250, ghost_essence: 100, currency: 150000 } },
    { id: 'zeraoraite', name: 'Zeraoraite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 25, electric_essence: 250, fighting_essence: 100, currency: 150000 } },
    { id: 'chimechoite', name: 'Chimechoite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 10, psychic_essence: 100, ghost_essence: 50, currency: 50000 } },
    { id: 'victreebelite', name: 'Victreebelite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 10, grass_essence: 100, poison_essence: 50, currency: 50000 } },
    { id: 'starmiite', name: 'Starmiite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 10, water_essence: 100, psychic_essence: 50, currency: 50000 } },
    { id: 'barbaraclite', name: 'Barbaraclite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 10, rock_essence: 100, water_essence: 50, currency: 50000 } },
    { id: 'pyroarite', name: 'Pyroarite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 10, fire_essence: 100, normal_essence: 50, currency: 50000 } },
    { id: 'clefablite', name: 'Clefablite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 10, fairy_essence: 150, currency: 50000 } },
    { id: 'scolipidite', name: 'Scolipidite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 10, bug_essence: 100, poison_essence: 50, currency: 50000 } },
    { id: 'butterfreeite', name: 'Butterfreeite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 10, bug_essence: 100, psychic_essence: 50, currency: 40000 } },
    { id: 'machampite', name: 'Machampite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 10, fighting_essence: 150, currency: 50000 } },
    { id: 'lucarionite_z', name: 'Lucarionite Z', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 25, fighting_essence: 250, steel_essence: 150, currency: 150000 } },
    { id: 'absolite_z', name: 'Absolite Z', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 25, dark_essence: 250, fairy_essence: 150, currency: 150000 } },
    { id: 'garchompite_z', name: 'Garchompite Z', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-stone.png', cost: { mega_stone_shard: 25, dragon_essence: 250, ground_essence: 150, currency: 150000 } },
    { id: 'lopunnite', name: 'Lopunnite', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lopunnite.png', cost: { mega_stone_shard: 10, normal_essence: 100, fighting_essence: 50, currency: 50000 } },
  ],

  fishing_rods: [
    {
      id: 'old_rod',
      name: 'Vara Velha',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/old-rod.png',
      description: 'Pesca básica. Aumenta em 20% a chance de encontrar Pokémon de Água em rotas próximas a água.',
      effect: { type: 'fishing', tier: 1, waterBonus: 0.20 },
      cost: { normal_essence: 5, apricorn: 10, iron_ore: 3, currency: 500 },
      type: 'key_item',
      unique: true,
    },
    {
      id: 'good_rod',
      name: 'Vara Boa',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/good-rod.png',
      description: 'Vara de qualidade. Aumenta em 40% a chance de encontrar Pokémon de Água e pode atrair espécies de nível médio.',
      effect: { type: 'fishing', tier: 2, waterBonus: 0.40 },
      cost: { water_essence: 20, iron_ore: 15, silk: 10, currency: 3000 },
      type: 'key_item',
      unique: true,
      requires: 'old_rod',
    },
    {
      id: 'super_rod',
      name: 'Super Vara',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-rod.png',
      description: 'A melhor vara. Aumenta em 70% a chance de encontrar Pokémon de Água, incluindo espécies raras como Dratini e Gyarados.',
      effect: { type: 'fishing', tier: 3, waterBonus: 0.70 },
      cost: { water_essence: 50, dragon_scale: 3, iron_ore: 30, mystic_water: 20, currency: 15000 },
      type: 'key_item',
      unique: true,
      requires: 'good_rod',
    },
  ],

  repels: [
    {
      id: 'repel',
      name: 'Repel',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/repel.png',
      description: 'Enfraquece os Pokémon selvagens da rota por 3 minutos. Inimigos spawnados têm -20% de HP e Ataque.',
      effect: { type: 'timed', key: 'activeRepel', duration: 3 * 60 * 1000, hpMult: 0.80, atkMult: 0.80 },
      cost: { normal_essence: 15, apricorn: 5, currency: 400 },
      type: 'consumable',
      durationLabel: '3 min',
    },
    {
      id: 'super_repel',
      name: 'Super Repel',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-repel.png',
      description: 'Enfraquece os Pokémon selvagens por 8 minutos. Inimigos têm -35% de HP e Ataque.',
      effect: { type: 'timed', key: 'activeRepel', duration: 8 * 60 * 1000, hpMult: 0.65, atkMult: 0.65 },
      cost: { normal_essence: 30, poison_essence: 10, apricorn: 10, currency: 1200 },
      type: 'consumable',
      durationLabel: '8 min',
    },
    {
      id: 'max_repel',
      name: 'Max Repel',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-repel.png',
      description: 'Enfraquece os Pokémon selvagens por 15 minutos. Inimigos têm -50% de HP e Ataque.',
      effect: { type: 'timed', key: 'activeRepel', duration: 15 * 60 * 1000, hpMult: 0.50, atkMult: 0.50 },
      cost: { psychic_essence: 20, poison_essence: 20, mystic_dust: 10, currency: 3000 },
      type: 'consumable',
      durationLabel: '15 min',
    },
  ],

  incenses: [
    {
      id: 'lure',
      name: 'Isca',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/honey.png',
      description: 'Aumenta a taxa de spawn por 5 minutos. Spawn 40% mais rápido.',
      effect: { type: 'timed', key: 'activeLure', duration: 5 * 60 * 1000, spawnMult: 0.60 },
      cost: { grass_essence: 15, apricorn: 10, currency: 600 },
      type: 'consumable',
      durationLabel: '5 min',
    },
    {
      id: 'super_lure',
      name: 'Super Isca',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/honey.png',
      description: 'Aumenta a taxa de spawn por 10 minutos e +15% chance de Pokémon raro.',
      effect: { type: 'timed', key: 'activeLure', duration: 10 * 60 * 1000, spawnMult: 0.50, rarityBonus: 0.15 },
      cost: { grass_essence: 30, electric_essence: 10, apricorn: 20, currency: 2000 },
      type: 'consumable',
      durationLabel: '10 min',
    },
    {
      id: 'max_lure',
      name: 'Max Isca',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-toy.png',
      description: 'Spawn 60% mais rápido por 20 minutos e +30% chance de Pokémon raro.',
      effect: { type: 'timed', key: 'activeLure', duration: 20 * 60 * 1000, spawnMult: 0.40, rarityBonus: 0.30 },
      cost: { grass_essence: 60, psychic_essence: 20, mystic_dust: 15, currency: 6000 },
      type: 'consumable',
      durationLabel: '20 min',
    },
  ],

  badges_items: [
    {
      id: 'lucky_egg',
      name: 'Ovo Sortudo',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucky-egg.png',
      description: 'Todo o time ganha +50% XP por 30 minutos após ativar.',
      effect: { type: 'timed', key: 'activeLuckyEgg', duration: 30 * 60 * 1000, xpMult: 1.50 },
      cost: { normal_essence: 100, pink_dust: 30, gold_nugget: 3, currency: 25000 },
      type: 'consumable',
      durationLabel: '30 min',
    },
    {
      id: 'amulet_coin',
      name: 'Moeda Amuleto',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/amulet-coin.png',
      description: 'Dobra as moedas ganhas em batalha por 30 minutos.',
      effect: { type: 'timed', key: 'activeAmuletCoin', duration: 30 * 60 * 1000, coinMult: 2.0 },
      cost: { gold_nugget: 5, normal_essence: 50, currency: 10000 },
      type: 'consumable',
      durationLabel: '30 min',
    },
    {
      id: 'exp_share',
      name: 'Partilha Exp',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png',
      description: 'Distribui XP para todo o time por 60 minutos. 50% do XP vai para os que não lutaram.',
      effect: { type: 'timed', key: 'activeExpShare', duration: 60 * 60 * 1000, xpShare: 0.50 },
      cost: { normal_essence: 80, electric_essence: 30, mystic_dust: 20, currency: 20000 },
      type: 'consumable',
      durationLabel: '60 min',
    },
    {
      id: 'incense_luck',
      name: 'Incenso da Sorte',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/luck-incense.png',
      description: 'Duplica moedas ganhas em batalha por 45 minutos. Empilha com Moeda Amuleto.',
      effect: { type: 'timed', key: 'activeIncenseLuck', duration: 45 * 60 * 1000, coinMult: 2.0 },
      cost: { pink_dust: 20, normal_essence: 40, gold_nugget: 2, currency: 8000 },
      type: 'consumable',
      durationLabel: '45 min',
    },
    {
      id: 'cleanse_tag',
      name: 'Tag Pureza',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cleanse-tag.png',
      description: 'Reduz em 30% a chance de encontrar Pokémon selvagens por 20 minutos.',
      effect: { type: 'timed', key: 'activeCleanseTag', duration: 20 * 60 * 1000, encounterReduction: 0.30 },
      cost: { ghost_essence: 20, psychic_essence: 15, mystic_dust: 10, currency: 5000 },
      type: 'consumable',
      durationLabel: '20 min',
    },
    {
      id: 'soothe_bell',
      name: 'Sino da Calma',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soothe-bell.png',
      description: '+20% XP e +10% Defesa Especial para o time por 20 minutos.',
      effect: { type: 'timed', key: 'activeSootheBell', duration: 20 * 60 * 1000, xpMult: 1.20, spDefBonus: 0.10 },
      cost: { fairy_essence: 20, pink_dust: 15, normal_essence: 20, currency: 4000 },
      type: 'consumable',
      durationLabel: '20 min',
    },
    {
      id: 'scope_lens',
      name: 'Lente Escopo',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scope-lens.png',
      description: '+20% chance de crítico para o time por 15 minutos.',
      effect: { type: 'timed', key: 'activeScopeLens', duration: 15 * 60 * 1000, critBonus: 0.20 },
      cost: { electric_essence: 40, psychic_essence: 20, iron_ore: 15, currency: 8000 },
      type: 'consumable',
      durationLabel: '15 min',
    },
  ],

  apricorn_balls: [
    {
      id: 'lure_ball',
      name: 'Lure Ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure-ball.png',
      description: 'Taxa de captura 3x para Pokémon encontrados pescando com varas.',
      effect: { type: 'ball', catchMult: 3.0, condition: 'fishing' },
      cost: { apricorn: 3, water_essence: 5, currency: 800 },
      type: 'ball',
    },
    {
      id: 'moon_ball',
      name: 'Moon Ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-ball.png',
      description: 'Taxa de captura 4x para Pokémon que evoluem com Pedra da Lua (Clefairy, Jigglypuff, Nidoran).',
      effect: { type: 'ball', catchMult: 4.0, condition: 'moon_stone_evolver' },
      cost: { moon_stone_shard: 3, pink_dust: 5, currency: 1200 },
      type: 'ball',
    },
    {
      id: 'friend_ball',
      name: 'Friend Ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/friend-ball.png',
      description: 'O Pokémon capturado começa com alta amizade. XP bônus de +20%.',
      effect: { type: 'ball', catchMult: 1.0, xpBonus: 0.20 },
      cost: { grass_essence: 10, normal_essence: 10, apricorn: 5, currency: 1000 },
      type: 'ball',
    },
    {
      id: 'heavy_ball',
      name: 'Heavy Ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heavy-ball.png',
      description: 'Taxa de captura aumenta quanto mais pesado o Pokémon. Ótima para Snorlax, Onix e Golem.',
      effect: { type: 'ball', catchMult: 2.5, condition: 'heavy_pokemon' },
      cost: { rock_essence: 10, iron_ore: 15, currency: 1500 },
      type: 'ball',
    },
    {
      id: 'fast_ball',
      name: 'Fast Ball',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fast-ball.png',
      description: 'Taxa de captura 4x para Pokémon rápidos (Speed > 100). Ótima para Pidgeot, Alakazam e Jolteon.',
      effect: { type: 'ball', catchMult: 4.0, condition: 'fast_pokemon' },
      cost: { electric_essence: 8, flying_essence: 8, apricorn: 5, currency: 1200 },
      type: 'ball',
    },
    { id: 'level_ball', name: 'Level Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/level-ball.png', description: 'Taxa de captura até 8x quando seu nível é muito maior que o do inimigo.', effect: { type: 'ball', catchMult: 'level_diff' }, cost: { normal_essence: 15, apricorn: 8, currency: 1000 }, type: 'ball' }
  ],

  food: [
    {
      id: 'poke_food',
      name: 'Ração Pokémon',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',
      description: 'Ração básica. Restaura 30% de Energia. Pode ser fabricada com materiais simples.',
      effect: { type: 'stamina', restore: 30 },
      cost: { apricorn: 5, normal_essence: 10, currency: 200 },
      type: 'consumable',
    },
    {
      id: 'poke_food_premium',
      name: 'Ração Premium',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png',
      description: 'Ração de alta qualidade. Restaura 60% de Energia e cura status.',
      effect: { type: 'stamina', restore: 60, cureStatus: true },
      cost: { apricorn: 10, grass_essence: 15, normal_essence: 20, currency: 800 },
      type: 'consumable',
    },
  ],
  trainer_card: [
    {
      id: 'trainer_card_pikachu_badge',
      name: 'Botao Pikachu',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      description: 'Personalizacao do Trainer Card com energia eletrica.',
      cost: { electric_essence: 25, trainer_card_thread: 6, yellow_shard: 3 },
      type: 'trainer_card_custom',
    },
    {
      id: 'trainer_card_eevee_badge',
      name: 'Botao Eevee',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
      description: 'Personalizacao do Trainer Card com tema de evolucao.',
      cost: { normal_essence: 25, trainer_card_thread: 6, silk: 5 },
      type: 'trainer_card_custom',
    },
    {
      id: 'trainer_card_gengar_badge',
      name: 'Botao Gengar',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
      description: 'Personalizacao sombria para treinadores de rotas fantasma.',
      cost: { ghost_essence: 30, trainer_card_thread: 8, mystic_dust: 3 },
      type: 'trainer_card_custom',
    },
    {
      id: 'trainer_card_lucario_badge',
      name: 'Botao Lucario',
      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png',
      description: 'Personalizacao de aura para cards de alto poder.',
      cost: { fighting_essence: 35, steel_essence: 20, trainer_card_thread: 10 },
      type: 'trainer_card_custom',
    },
  ],
};

export const FORGE_MATERIAL_DROP_GUIDE = {
  normal_essence: { pokemonIds: [16, 19, 20, 52, 53, 133, 143], routeId: 'route_1', label: 'Rotas iniciais - Pidgey, Rattata, Meowth, Eevee e Snorlax.' },
  fire_essence: { pokemonIds: [4, 5, 6, 37, 38, 58, 59, 126], routeId: 'pokemon_mansion', label: 'Rotas quentes e mansoes - Charmander, Vulpix, Growlithe e Magmar.' },
  water_essence: { pokemonIds: [7, 8, 9, 60, 61, 72, 73, 120, 129], routeId: 'route_19_20', label: 'Rotas aquaticas - Squirtle, Poliwag, Tentacool, Staryu e Magikarp.' },
  grass_essence: { pokemonIds: [1, 2, 3, 43, 44, 69, 70, 102], routeId: 'viridian_forest', label: 'Florestas e rotas verdes - Bulbasaur, Oddish, Bellsprout e Exeggcute.' },
  electric_essence: { pokemonIds: [25, 26, 81, 82, 100, 101, 125], routeId: 'power_plant', label: 'Usina de Energia - Pikachu, Magnemite, Voltorb e Electabuzz.' },
  ice_essence: { pokemonIds: [87, 124, 131, 144, 220, 221, 225, 238], routeId: 'ice_path', label: 'Cavernas geladas - Dewgong, Jynx, Lapras, Smoochum e Delibird.' },
  fighting_essence: { pokemonIds: [56, 57, 66, 67, 68, 106, 107], routeId: 'route_22', label: 'Rotas de combate - Mankey, Primeape, Machop, Hitmonlee e Hitmonchan.' },
  poison_essence: { pokemonIds: [23, 24, 29, 32, 41, 42, 88, 109], routeId: 'pokemon_tower', label: 'Florestas, cavernas e torres - Ekans, Nidoran, Zubat, Grimer e Koffing.' },
  ground_essence: { pokemonIds: [27, 28, 50, 51, 74, 75, 95, 111], routeId: 'rock_tunnel', label: 'Tuneis e desertos - Sandshrew, Diglett, Geodude, Onix e Rhyhorn.' },
  flying_essence: { pokemonIds: [16, 17, 18, 21, 22, 41, 42, 123], routeId: 'route_16_17_18', label: 'Rotas abertas - Pidgey, Spearow, Zubat e Scyther.' },
  psychic_essence: { pokemonIds: [63, 64, 65, 96, 97, 122, 150, 196], routeId: 'saffron_city', label: 'Locais psiquicos - Abra, Drowzee, Mr. Mime, Mewtwo e Espeon.' },
  bug_essence: { pokemonIds: [10, 11, 12, 13, 14, 15, 46, 123], routeId: 'viridian_forest', label: 'Florestas - Caterpie, Weedle, Paras e Scyther.' },
  rock_essence: { pokemonIds: [74, 75, 76, 95, 138, 140, 142, 246], routeId: 'mt_moon', label: 'Montanhas e fosseis - Geodude, Onix, Omanyte, Kabuto e Larvitar.' },
  ghost_essence: { pokemonIds: [92, 93, 94, 200, 353, 354, 355, 356], routeId: 'pokemon_tower', label: 'Torre Pokemon e locais sombrios - Gastly, Haunter, Gengar e fantasmas.' },
  dragon_essence: { pokemonIds: [147, 148, 149, 230, 330, 373, 445, 635], routeId: 'dragons_den', label: 'Locais sagrados e Victory Road - Dratini, Dragonair, Kingdra e dragoes.' },
  steel_essence: { pokemonIds: [81, 82, 208, 227, 303, 306, 376, 448], routeId: 'power_plant', label: 'Usinas e montanhas - Magnemite, Steelix, Skarmory, Aggron e Lucario.' },
  fairy_essence: { pokemonIds: [35, 36, 39, 40, 173, 174, 175, 176, 700], routeId: 'mt_moon', label: 'Monte Lua e rotas raras - Clefairy, Jigglypuff, Togepi e Sylveon.' },
  dark_essence: { pokemonIds: [197, 198, 215, 228, 229, 302, 359, 461], routeId: 'burned_tower', label: 'Torres e rotas noturnas - Umbreon, Murkrow, Sneasel, Houndour e Absol.' },
  iron_ore: { pokemonIds: [
    74, 75, 76, 81, 82, 95, 208,        // Gen 1-2: Geodude, Magnemite, Onix, Steelix
    304, 305, 306, 374, 375, 376,        // Gen 3: Aron, Beldum, Metagross
    299, 476, 436, 437, 408, 409,        // Gen 4: Nosepass, Probopass, Bronzor, Cranidos
    597, 598, 599, 600, 624, 625,        // Gen 5: Ferroseed, Klink, Pawniard
    679, 680, 681, 707,                  // Gen 6: Honedge, Klefki
    782, 783, 784, 809,                  // Gen 7: Jangmo-o, Melmetal
    878, 879, 884,                       // Gen 8: Cufant, Copperajah, Duraludon
    957, 958, 959, 968,                  // Gen 9: Tinkatink, Orthworm
  ], routeId: 'rock_tunnel', label: 'Cavernas e Pokemon minerais - Geodude, Onix, Steelix, Aron e Magnemite.' },
  apricorn: { pokemonIds: [
    43, 44, 46, 47, 102, 103,          // Gen 1: Oddish, Paras, Exeggcute
    187, 188, 189, 190, 191, 192, 204, // Gen 2: Hoppip, Aipom, Sunkern, Pineco
    285, 286, 315, 316, 357,           // Gen 3: Shroomish, Roselia, Tropius
    406, 420, 421, 455, 470,           // Gen 4: Budew, Cherubi, Carnivine, Leafeon
    546, 547, 548, 549, 590, 591,      // Gen 5: Cottonee, Petilil, Foongus
    669, 670, 671, 672, 673,           // Gen 6: Flabébé, Skiddo
    761, 762, 763, 753, 754,           // Gen 7: Bounsweet, Fomantis
    829, 830,                          // Gen 8: Gossifleur
    928, 929, 930, 940,                // Gen 9: Smoliv, Capsakid
  ], routeId: 'ilex_forest', label: 'Johto e florestas - Hoppip, Aipom, Sunkern e Pineco carregam Apricorns.' },
  mystic_dust: { pokemonIds: [
    92, 93, 94, 150, 151,              // Gen 1: Gastly, Mewtwo, Mew
    200, 201, 385,                     // Gen 2: Misdreavus, Unown, Jirachi
    302, 353, 354, 355, 356,           // Gen 3: Sableye, Shuppet, Duskull
    425, 426, 429, 479, 480, 481, 482, // Gen 4: Drifloon, Mismagius, Rotom, Trio
    607, 608, 609, 622, 623,           // Gen 5: Litwick, Golett
    708, 709, 710, 711,                // Gen 6: Phantump, Pumpkaboo
    778, 769, 770, 771,                // Gen 7: Mimikyu, Sandygast
    854, 855, 864, 885, 886, 887,      // Gen 8: Sinistea, Cursola, Dreepy
    971, 972, 946, 947, 987,           // Gen 9: Greavard, Bramblin
  ], routeId: 'pokemon_tower', label: 'Fantasma, lendarios, Unown e shinies dropam po mistico.' },
  fire_stone_shard: { pokemonIds: [37, 38, 58, 59, 77, 126, 136, 228, 322, 513, 554, 636, 757, 921, 667], routeId: 'pokemon_mansion', label: 'Pokemon de fogo e evolucoes por pedra dropam fragmentos de Fire Stone.' },
  water_stone_shard: { pokemonIds: [60, 61, 90, 91, 120, 121, 134, 183, 270, 318, 363, 456, 489, 564, 692, 771, 846], routeId: 'route_19_20', label: 'Pokemon aquaticos e evolucoes por pedra dropam fragmentos de Water Stone.' },
  leaf_stone_shard: { pokemonIds: [43, 44, 69, 70, 102, 103, 470, 187, 273, 285, 315, 420, 546, 548, 672, 755], routeId: 'ilex_forest', label: 'Pokemon planta e florestas dropam fragmentos de Leaf Stone.' },
  thunder_stone_shard: { pokemonIds: [25, 26, 81, 82, 100, 101, 135, 170, 179, 311, 312, 403, 417, 595, 694, 737, 848], routeId: 'power_plant', label: 'Pokemon eletricos dropam fragmentos de Thunder Stone.' },
  moon_stone_shard: { pokemonIds: [35, 36, 39, 40, 173, 174, 300, 209, 517, 676, 742], routeId: 'mt_moon', label: 'Monte Lua e Pokemon lunares dropam fragmentos de Moon Stone.' },
  sun_stone_shard: { pokemonIds: [43, 44, 191, 192, 546, 548], routeId: 'national_park', label: 'Pokemon solares e flores dropam fragmentos de Sun Stone.' },
  shiny_stone_shard: { pokemonIds: [35, 176, 315, 407, 468, 670, 671], routeId: 'sinnoh_route_204', label: 'Pokemon belos, fadas e flores raras dropam fragmentos de Shiny Stone.' },
  dusk_stone_shard: { pokemonIds: [92, 93, 94, 198, 200, 353, 355, 607, 425, 710, 708, 854], routeId: 'pokemon_tower', label: 'Fantasmas e Pokemon noturnos dropam fragmentos de Dusk Stone.' },
  dawn_stone_shard: { pokemonIds: [280, 281, 361, 475, 478, 856, 308, 362, 858], routeId: 'snowpoint_routes', label: 'Pokemon psiquicos, gelo e evolucoes especiais dropam fragmentos de Dawn Stone.' },
  ice_stone_shard: { pokemonIds: [37, 38, 133, 471, 582, 613, 712], routeId: 'ice_path', label: 'Rotas geladas e Pokemon de gelo dropam fragmentos de Ice Stone.' },
  link_cable_part: { pokemonIds: [
    64, 67, 74, 75, 92, 93, 41, 42, 137, 79, 95, 123, 61,
    223, 280, 281, 315, 349, 356, 375,  // Gen 3
    404, 440, 436, 355,                 // Gen 4
    525, 533, 538, 539, 560, 562,       // Gen 5
    664, 690, 707,                      // Gen 6
    765, 796, 802,                      // Gen 7
    855, 864, 882,                      // Gen 8
    957, 959, 980,                      // Gen 9
  ], routeId: 'rock_tunnel', label: 'Pokemon de evolucao por troca dropam pecas de Link Cable.' },
  pink_dust: { pokemonIds: [
    35, 36, 39, 40, 113, 242,          // Gen 1-2: Clefairy, Jigglypuff, Chansey, Blissey
    175, 176, 209, 210, 241,           // Gen 2: Togepi, Snubbull, Miltank
    183, 184, 280, 281, 282, 303,      // Gen 3: Marill, Ralts, Mawile
    440, 439, 468,                     // Gen 4: Happiny, Mime Jr., Togekiss
    531, 574, 575, 576,                // Gen 5: Audino, Gothita
    669, 670, 671, 683, 684, 700,      // Gen 6: Flabébé, Aromatisse, Sylveon
    742, 743, 764,                     // Gen 7: Cutiefly, Comfey
    868, 869,                          // Gen 8: Milcery, Alcremie
    926, 927, 957,                     // Gen 9: Fidough, Tinkatink
  ], routeId: 'safari_zone', label: 'Pokemon rosados e curadores dropam po rosa.' },
  gold_nugget: { pokemonIds: [52, 53, 113, 242, 302, 530], routeId: 'route_24_25', label: 'Pokemon coletores e raros dropam pepitas de ouro.' },
  silk: { pokemonIds: [
    10, 11, 12, 13, 14, 15, 46, 47,    // Gen 1: Caterpie, Weedle, Paras
    165, 166, 167, 168, 204, 205,       // Gen 2: Ledyba, Spinarak, Pineco
    265, 266, 267, 268, 269, 283, 284,  // Gen 3: Wurmple, Surskit
    401, 402, 412, 413, 414, 415,       // Gen 4: Kricketot, Burmy, Combee
    540, 541, 542, 595, 596, 616, 617,  // Gen 5: Sewaddle, Joltik, Shelmet
    664, 665, 666, 751, 752,            // Gen 6: Scatterbug, Dewpider
    736, 737, 738,                      // Gen 7: Grubbin
    824, 825, 826, 872, 873,            // Gen 8: Blipbug, Snom
    832, 833, 840, 841,                 // Gen 9: Tarountula, Nymble
  ], routeId: 'viridian_forest', label: 'Insetos e casulos dropam seda.' },
  feather: { pokemonIds: [
    16, 17, 18, 21, 22, 41, 42, 123,   // Gen 1: Pidgey, Spearow, Zubat, Scyther
    163, 164, 169, 176, 198, 225,       // Gen 2: Hoothoot, Togetic, Murkrow, Delibird
    276, 277, 278, 279, 333, 334,       // Gen 3: Taillow, Wingull, Swablu
    396, 397, 398, 441, 468, 479,       // Gen 4: Starly, Chatot, Togekiss
    519, 520, 521, 527, 528, 627, 628,  // Gen 5: Pidove, Woobat, Rufflet
    661, 662, 663, 701,                 // Gen 6: Fletchling, Hawlucha
    731, 732, 733, 741,                 // Gen 7: Pikipek, Oricorio
    821, 822, 823, 845,                 // Gen 8: Rookidee, Cramorant
    931, 962, 973,                      // Gen 9: Squawkabilly, Bombirdier, Flamigo
  ], routeId: 'route_16_17_18', label: 'Pokemon voadores dropam penas.' },
  armor_fragment: { pokemonIds: [95, 208, 227, 306, 411, 476, 884], routeId: 'stark_mountain', label: 'Pokemon blindados, rochosos e metalicos dropam fragmentos de armadura.' },
  fury_essence: { pokemonIds: [57, 68, 128, 217, 289, 445, 534, 612], routeId: 'victory_road', label: 'Pokemon agressivos e pseudo-lendarios dropam essencia de furia.' },
  stardust: { pokemonIds: [120, 121, 173, 375, 376, 385, 605, 774], routeId: 'meteor_falls', label: 'Pokemon cosmicos, meteoricos e raros dropam poeira estelar.' },
  dragon_scale: { pokemonIds: [
    116, 117, 118, 147, 148, 149,      // Gen 1: Horsea, Goldeen, Dratini
    230, 246, 247, 248,                // Gen 2: Kingdra, Larvitar, Tyranitar
    329, 330, 371, 372, 373,           // Gen 3: Vibrava, Flygon, Bagon, Salamence
    443, 444, 445, 447, 448,           // Gen 4: Gible, Riolu, Lucario
    610, 611, 612, 633, 634, 635,      // Gen 5: Axew, Deino
    696, 697, 704, 705, 706,           // Gen 6: Tyrunt, Goomy
    782, 783, 784, 776,                // Gen 7: Jangmo-o, Turtonator
    884, 886, 887,                     // Gen 8: Duraludon, Dreepy (Dragon)
    996, 997, 998, 999,                // Gen 9: Frigibax e linha
  ], routeId: 'dragons_den', label: 'Pokemon dragoes e marinhos raros dropam escamas de dragao.' },
  trainer_card_thread: { pokemonIds: [10, 11, 12, 13, 14, 15, 133, 447, 448], routeId: 'viridian_forest', label: 'Insetos, Eevee e Lucario dropam fio para personalizacao do Trainer Card.' },
  yellow_shard: { pokemonIds: [25, 26, 81, 82, 100, 101, 125], routeId: 'power_plant', label: 'Pokemon eletricos dropam fragmentos amarelos.' },
  mystic_water: { pokemonIds: [60, 61, 62, 72, 73, 120, 121, 134], routeId: 'route_19_20', label: 'Pokemon aquaticos raros dropam Mystic Water como material avancado.' },

  // Novos Materiais Específicos
  sharp_claw:    { pokemonIds: [27, 28, 52, 53, 215, 461], routeId: 'route_22', label: 'Sandshrew, Meowth, Persian e Sneasel.' },
  scale_dust:    { pokemonIds: [147, 371, 610, 611, 612], routeId: 'dragons_den', label: 'Dratini, Bagon e Axew.' },
  ember_shard:   { pokemonIds: [126, 218, 219, 240], routeId: 'pokemon_mansion', label: 'Magmar, Slugma e Magby.' },
  thunder_fang:  { pokemonIds: [403, 404, 405, 135, 466], routeId: 'power_plant', label: 'Luxray, Jolteon e Electivire.' },
  ice_crystal:   { pokemonIds: [361, 220, 221, 712], routeId: 'ice_path', label: 'Snorunt, Swinub e Bergmite.' },
  poison_barb:   { pokemonIds: [15, 406, 407, 453, 454], routeId: 'viridian_forest', label: 'Beedrill, Roserade e Toxicroak.' },
  hard_shell:    { pokemonIds: [90, 91, 74, 75, 76, 304, 305, 306], routeId: 'mt_moon', label: 'Shellder, Golem e Aron.' },
  spirit_dust:   { pokemonIds: [200, 353, 355, 607, 608, 609], routeId: 'pokemon_tower', label: 'Misdreavus, Duskull e Litwick.' },
  dragon_fang:   { pokemonIds: [443, 444, 445, 148], routeId: 'dragons_den', label: 'Gible, Gabite e Dragonair.' },
  aura_fragment: { pokemonIds: [447, 448, 307, 308], routeId: 'sinnoh_route_201', label: 'Riolu, Lucario e Meditite.' },
  leaf_debris:   { pokemonIds: [406, 546, 420], routeId: 'ilex_forest', label: 'Budew, Cottonee e Cherubi.' },
  wave_stone:    { pokemonIds: [183, 194, 258], routeId: 'route_19_20', label: 'Marill, Wooper e Mudkip.' },
  mega_stone_shard: { 
    pokemonIds: [
      3, 6, 9, 15, 18, 65, 80, 94, 115, 127, 130, 142, 150, 181, 208, 212, 214, 229, 248, 
      254, 257, 260, 282, 302, 303, 306, 308, 310, 319, 323, 334, 354, 359, 362, 373, 376, 
      380, 381, 384, 428, 445, 448, 460, 475, 531, 719,
      26, 149, 154, 157, 160, 389, 392, 395, 497, 500, 503, 652, 655, 658, 724, 727, 730, 
      812, 815, 818, 908, 911, 914, 330, 405, 612, 635, 706, 784, 887, 998, 768, 485, 491, 
      807, 358, 71, 121, 689, 668, 36, 545, 12, 68
    ], 
    routeId: 'kalos_route_1', 
    label: 'Pokemon capazes de Mega Evoluir em Kalos dropam fragmentos de Mega Pedra.' 
  },
};

const ALL_FORGE_RECIPES = Object.values(CRAFTING_RECIPES).flat();
export const FORGE_RECIPE_IDS = [...new Set(ALL_FORGE_RECIPES.map(recipe => recipe.id))];
export const RECIPE_GATED_FORGE_IDS = new Set(FORGE_RECIPE_IDS);

// ── Mapa de onde cada receita é dropada (Pokémon fonte → material fonte) ──────
// Receitas de itens iniciais devem dropar de Pokémon das rotas iniciais!
const RECIPE_SOURCE_OVERRIDES = {
  // Consumíveis básicos — rotas iniciais (Route 1/2/3)
  pokeballs:   'normal_essence',   // Pidgey, Rattata (Route 1) ← antes apricorn (Johto!)
  great_ball:  'iron_ore',         // Geodude, Onix (Mt. Moon)
  ultra_ball:  'mystic_dust',      // Gastly, Haunter (Pokémon Tower)
  revive:      'ghost_essence',    // Pokémon Tower — faz sentido temático
  max_repel:   'poison_essence',   // Ekans, Zubat (rotas iniciais e cavernas)

  // Pedras evolutivas — Pokémon que dropam os fragmentos
  fire_stone:    'fire_stone_shard',
  water_stone:   'water_stone_shard',
  leaf_stone:    'leaf_stone_shard',
  thunder_stone: 'thunder_stone_shard',
  moon_stone:    'moon_stone_shard',
  sun_stone:     'sun_stone_shard',
  shiny_stone:   'shiny_stone_shard',
  dusk_stone:    'dusk_stone_shard',
  dawn_stone:    'dawn_stone_shard',
  ice_stone:     'ice_stone_shard',
  link_cable:    'link_cable_part',

  // ── Hold Items — tipo básico (18 tipos) ──────────────────────────────────
  silk_scarf:    'normal_essence',
  charcoal:      'fire_essence',
  mystic_water:  'water_essence',
  magnet:        'electric_essence',
  miracle_seed:  'grass_essence',
  never_melt_ice:'ice_essence',
  black_belt:    'fighting_essence',
  poison_barb:   'poison_essence',
  soft_sand:     'ground_essence',
  sharp_beak:    'flying_essence',
  twisted_spoon: 'psychic_essence',
  silver_powder: 'bug_essence',
  hard_stone:    'rock_essence',
  spell_tag:     'ghost_essence',
  dragon_fang:   'dragon_essence',
  black_glasses: 'dark_essence',
  metal_coat:    'steel_essence',
  fairy_feather: 'fairy_essence',
  quick_claw:    'flying_essence',
  // ── Hold Items especiais ──────────────────────────────────────────────────
  leftovers:     'normal_essence',
  life_orb:      'dragon_essence',
  expert_belt:   'fighting_essence',
  focus_sash:    'psychic_essence',
  // ── Badges Items (consumíveis com efeito de hold) ─────────────────────────
  lucky_egg:     'pink_dust',
  amulet_coin:   'gold_nugget',

  // Mega Stones
  charizardite_x: 'mega_stone_shard',
  charizardite_y: 'mega_stone_shard',
  venusaurite:    'mega_stone_shard',
  blastoisinite:  'mega_stone_shard',
  lucarionite:    'mega_stone_shard',
  garchompite:    'mega_stone_shard',
  gardevoirite:   'mega_stone_shard',
  blazikenite:    'mega_stone_shard',
  gengarite:      'mega_stone_shard',
  metagrossite:   'mega_stone_shard',
  mewtwonite_x:   'mega_stone_shard',
  mewtwonite_y:   'mega_stone_shard',
  alakazite: 'mega_stone_shard',
  gyaradosite: 'mega_stone_shard',
  salamencite: 'mega_stone_shard',
  tyranitarite: 'mega_stone_shard',
  beedrillite: 'mega_stone_shard',
  pidgeotite: 'mega_stone_shard',
  slowbronite: 'mega_stone_shard',
  kangaskhanite: 'mega_stone_shard',
  pinsirite: 'mega_stone_shard',
  aerodactylite: 'mega_stone_shard',
  ampharosite: 'mega_stone_shard',
  steelixite: 'mega_stone_shard',
  scizorite: 'mega_stone_shard',
  heracronite: 'mega_stone_shard',
  houndoominite: 'mega_stone_shard',
  sceptilite: 'mega_stone_shard',
  swampertite: 'mega_stone_shard',
  sableyite: 'mega_stone_shard',
  mawilite: 'mega_stone_shard',
  aggronite: 'mega_stone_shard',
  medichamite: 'mega_stone_shard',
  manectite: 'mega_stone_shard',
  sharpedonite: 'mega_stone_shard',
  cameruptite: 'mega_stone_shard',
  altarianite: 'mega_stone_shard',
  banettite: 'mega_stone_shard',
  absolite: 'mega_stone_shard',
  glalitite: 'mega_stone_shard',
  latiasite: 'mega_stone_shard',
  latiosite: 'mega_stone_shard',
  abomasnowite: 'mega_stone_shard',
  galladite: 'mega_stone_shard',
  audinite: 'mega_stone_shard',
  diancite: 'mega_stone_shard',

  // TMs — mapeadas ao tipo de essência correspondente
  tm_flamethrower: 'fire_essence',    // Charmander, Vulpix, Growlithe (rotas iniciais Kanto)
  tm_thunderbolt:  'electric_essence',// Pikachu, Magnemite (Power Plant / rotas elétricas)
  tm_ice_beam:     'ice_essence',     // Jynx, Lapras (Ice Path / rotas geladas)

  // Novos TMs mapeados aos materiais específicos
  tm_thunder_wave: 'thunder_fang',
  tm_toxic:        'poison_barb',
  tm_dig:          'hard_shell',
  tm_aerial_ace:   'feather',
  tm_shadow_ball:  'spirit_dust',
  tm_brick_break:  'aura_fragment',
  tm_rock_tomb:    'hard_shell',
  tm_thief:        'sharp_claw',
  tm_earthquake:   'hard_shell',
  tm_surf:         'wave_stone',
  tm_rock_slide:   'hard_shell',
  tm_bulk_up:      'aura_fragment',
  tm_calm_mind:    'spirit_dust',
  tm_swords_dance: 'sharp_claw',
  tm_fire_punch:   'ember_shard',
  tm_thunder_punch:'thunder_fang',
  tm_ice_punch:    'ice_crystal',
  tm_drain_punch:  'aura_fragment',
  tm_aura_sphere:  'aura_fragment',
  tm_stone_edge:   'hard_shell',
  tm_flash_cannon: 'hard_shell',
  tm_dark_pulse:   'spirit_dust',
  tm_energy_ball:  'leaf_debris',
  tm_close_combat: 'aura_fragment',
  tm_stealth_rock: 'hard_shell',
  tm_dragon_claw:  'dragon_fang',
  tm_wild_charge:  'thunder_fang',
  tm_giga_drain:   'leaf_debris',
  tm_moonblast:    'spirit_dust',
  tm_dazzling_gleam:'scale_dust',
  tm_dragon_dance: 'dragon_fang',
  tm_nasty_plot:   'spirit_dust',
  tm_hyper_voice:  'scale_dust',
  tm_leaf_storm:   'leaf_debris',
  tm_hurricane:    'feather',
  tm_focus_blast:  'aura_fragment',
  tm_flare_blitz:  'ember_shard',
  tm_earthquake_ex:'stardust',

  // Mega Stones — dropam de Mega Shards em Kalos
  mega_stone_shard: 'mega_stone_shard',
  charizardite_x: 'mega_stone_shard',
  charizardite_y: 'mega_stone_shard',
  venusaurite: 'mega_stone_shard',
  blastoisinite: 'mega_stone_shard',
  lucarionite: 'mega_stone_shard',
  garchompite: 'mega_stone_shard',
  gardevoirite: 'mega_stone_shard',
  blazikenite: 'mega_stone_shard',
  gengarite: 'mega_stone_shard',
  metagrossite: 'mega_stone_shard',
  mewtwonite_x: 'mega_stone_shard',
  mewtwonite_y: 'mega_stone_shard',
  alakazite: 'mega_stone_shard',
  gyaradosite: 'mega_stone_shard',
  salamencite: 'mega_stone_shard',
  tyranitarite: 'mega_stone_shard',
  beedrillite: 'mega_stone_shard',
  pidgeotite: 'mega_stone_shard',
  slowbronite: 'mega_stone_shard',
  kangaskhanite: 'mega_stone_shard',
  pinsirite: 'mega_stone_shard',
  aerodactylite: 'mega_stone_shard',
  ampharosite: 'mega_stone_shard',
  steelixite: 'mega_stone_shard',
  scizorite: 'mega_stone_shard',
  heracronite: 'mega_stone_shard',
  houndoominite: 'mega_stone_shard',
  sceptilite: 'mega_stone_shard',
  swampertite: 'mega_stone_shard',
  sableyite: 'mega_stone_shard',
  mawilite: 'mega_stone_shard',
  aggronite: 'mega_stone_shard',
  medichamite: 'mega_stone_shard',
  manectite: 'mega_stone_shard',
  sharpedonite: 'mega_stone_shard',
  cameruptite: 'mega_stone_shard',
  altarianite: 'mega_stone_shard',
  banettite: 'mega_stone_shard',
  absolite: 'mega_stone_shard',
  glalitite: 'mega_stone_shard',
  latiasite: 'mega_stone_shard',
  latiosite: 'mega_stone_shard',
  abomasnowite: 'mega_stone_shard',
  galladite: 'mega_stone_shard',
  audinite: 'mega_stone_shard',
  diancite: 'mega_stone_shard',
  rayquazaite: 'mega_stone_shard',
  raichuite_x: 'mega_stone_shard',
  raichuite_y: 'mega_stone_shard',
  dragonitite: 'mega_stone_shard',
  meganiumite: 'mega_stone_shard',
  typhlosionite: 'mega_stone_shard',
  feraligatrite: 'mega_stone_shard',
  torterrite: 'mega_stone_shard',
  infernapite: 'mega_stone_shard',
  empoleonite: 'mega_stone_shard',
  serperiorite: 'mega_stone_shard',
  emboarite: 'mega_stone_shard',
  samurottite: 'mega_stone_shard',
  chesnaughtite: 'mega_stone_shard',
  delphoxite: 'mega_stone_shard',
  greninjite: 'mega_stone_shard',
  decidueyite: 'mega_stone_shard',
  incineroarite: 'mega_stone_shard',
  primarinite: 'mega_stone_shard',
  rillaboomite: 'mega_stone_shard',
  cinderacite: 'mega_stone_shard',
  inteleonite: 'mega_stone_shard',
  meowscaradite: 'mega_stone_shard',
  skeledirgite: 'mega_stone_shard',
  quaquavalite: 'mega_stone_shard',
  flygonite: 'mega_stone_shard',
  luxrayite: 'mega_stone_shard',
  haxorusite: 'mega_stone_shard',
  hydreigonite: 'mega_stone_shard',
  goodraite: 'mega_stone_shard',
  kommo_oite: 'mega_stone_shard',
  dragapultite: 'mega_stone_shard',
  baxcaliburite: 'mega_stone_shard',
  golisopodite: 'mega_stone_shard',
  heatranite: 'mega_stone_shard',
  darkraiite: 'mega_stone_shard',
  zeraoraite: 'mega_stone_shard',
  chimechoite: 'mega_stone_shard',
  victreebelite: 'mega_stone_shard',
  starmiite: 'mega_stone_shard',
  barbaraclite: 'mega_stone_shard',
  pyroarite: 'mega_stone_shard',
  clefablite: 'mega_stone_shard',
  scolipidite: 'mega_stone_shard',
  butterfreeite: 'mega_stone_shard',
  machampite: 'mega_stone_shard',
  lucarionite_z: 'mega_stone_shard',
  absolite_z: 'mega_stone_shard',
  garchompite_z: 'mega_stone_shard',
  lopunnite: 'mega_stone_shard',

  // Relíquias elite
  titan_shield:        'armor_fragment',
  adrenaline_potion:   'fury_essence',
  penetration_pendant: 'dragon_scale',

  // Varas de pesca — insetos e Pokémon de rotas ribeirinhas
  old_rod:   'normal_essence',  // Route 1 / rotas iniciais
  good_rod:  'water_essence',   // rotas aquáticas
  super_rod: 'dragon_essence',  // Dragon's Den / rotas avançadas
};

const getRecipeSourceMaterial = (recipe) => {
  if (RECIPE_SOURCE_OVERRIDES[recipe.id]) return RECIPE_SOURCE_OVERRIDES[recipe.id];
  return Object.keys(recipe.cost || {}).find(material => material !== 'currency' && FORGE_MATERIAL_DROP_GUIDE[material]) || 'normal_essence';
};

// Descrições amigáveis por tipo de fonte — aparecem na UI da Forja
const RECIPE_LABEL_OVERRIDES = {
  pokeballs:       'Derrote Pidgey e Rattata na Route 1 ou 2.',
  great_ball:      'Derrote Geodude e Onix no Mt. Moon.',
  ultra_ball:      'Derrote Gastly e Haunter na Pokémon Tower.',
  revive:          'Derrote fantasmas na Pokémon Tower.',
  max_repel:       'Derrote Ekans e Zubat nas cavernas iniciais.',
  tm_flamethrower: 'Derrote Charmander, Vulpix ou Growlithe nas rotas de fogo.',
  tm_thunderbolt:  'Derrote Pikachu, Magnemite ou Voltorb na Power Plant.',
  tm_ice_beam:     'Derrote Jynx ou Lapras no Ice Path / Seafoam Islands.',
  tm_thunder_wave: 'Derrote Pikachu, Magnemite ou Jolteon.',
  tm_toxic:        'Derrote Ekans, Koffing ou Weezing.',
  tm_dig:          'Derrote Diglett, Sandshrew ou Geodude.',
  tm_aerial_ace:   'Derrote Pidgeot, Farfetch\'d ou Scyther.',
  tm_shadow_ball:  'Derrote Gastly, Haunter ou Gengar.',
  tm_brick_break:  'Derrote Mankey, Machop ou Hitmonchan.',
  tm_rock_tomb:    'Derrote Geodude, Graveler ou Onix.',
  tm_thief:        'Derrote Meowth, Murkrow ou Sneasel.',
  tm_earthquake:   'Derrote Rhyhorn, Donphan ou Trapinch.',
  tm_surf:         'Derrote Lapras, Tentacruel ou Gyarados.',
  tm_rock_slide:   'Derrote Rhyhorn, Rhydon ou Larvitar.',
  tm_bulk_up:      'Derrote Machoke, Hariyama ou Breloom.',
  tm_calm_mind:    'Derrote Abra, Slowpoke ou Espeon.',
  tm_swords_dance: 'Derrote Farfetch\'d, Scyther ou Houndour.',
  tm_fire_punch:   'Derrote Magmar, Magby ou Hitmonchan.',
  tm_thunder_punch:'Derrote Electivire, Electabuzz ou Jolteon.',
  tm_ice_punch:    'Derrote Jynx, Swinub ou Snorunt.',
  tm_drain_punch:  'Derrote Croagunk, Toxicroak ou Medicham.',
  tm_aura_sphere:  'Derrote Lucario, Meditite ou Riolu.',
  tm_stone_edge:   'Derrote Rhydon, Rhyperior ou Golem.',
  tm_flash_cannon: 'Derrote Magnezone, Bronzong ou Steelix.',
  tm_dark_pulse:   'Derrote Absol, Weavile ou Umbreon.',
  tm_energy_ball:  'Derrote Roserade, Tangrowth ou Leafeon.',
  tm_close_combat: 'Derrote Lucario, Infernape ou Gallade.',
  tm_stealth_rock: 'Derrote Onix, Sudowoodo ou Golem.',
  tm_dragon_claw:  'Derrote Gible, Gabite ou Garchomp.',
  tm_wild_charge:  'Derrote Zebstrika, Luxray ou Lanturn.',
  tm_giga_drain:   'Derrote Vileplume, Victreebel ou Roserade.',
  tm_moonblast:    'Derrote Clefable, Sylveon ou Gardevoir.',
  tm_dazzling_gleam:'Derrote Togekiss, Ribombee ou Florges.',
  tm_dragon_dance: 'Derrote Gyarados, Dragonite ou Kingdra.',
  tm_nasty_plot:   'Derrote Gengar, Honchkrow ou Zoroark.',
  tm_hyper_voice:  'Derrote Exploud, Meloetta ou Sylveon.',
  tm_leaf_storm:   'Derrote Leafeon, Serperior ou Roserade.',
  tm_hurricane:    'Derrote Dragonite ou Togekiss.',
  tm_focus_blast:  'Derrote Alakazam, Lucario ou Conkeldurr.',
  tm_flare_blitz:  'Derrote Arcanine, Charizard ou Infernape.',
  tm_earthquake_ex:'Derrote Pseudo-lendários (Garchomp, Dragonite, Metagross).',
  old_rod:         'Derrote qualquer Pokémon nas rotas iniciais (Route 1/2/3).',
  good_rod:        'Derrote Pokémon aquáticos nas rotas costeiras.',
  super_rod:       'Derrote Dratini ou Dragonair na Dragon\'s Den.',
  // Held items — Tipos
  charcoal:        'Derrote Charmander, Vulpix ou Growlithe em rotas vulcânicas (Fire).',
  mystic_water:    'Derrote Squirtle, Psyduck ou Poliwag em rios e oceanos (Water).',
  black_belt:      'Derrote Mankey, Machop ou Tyrogue no Fighting Dojo (Fighting).',
  magnet:          'Derrote Pikachu, Magnemite ou Voltorb na Power Plant (Electric).',
  silk_scarf:      'Derrote Meowth, Rattata ou Eevee nas rotas iniciais (Normal).',
  miracle_seed:    'Derrote Oddish, Bellsprout ou Exeggcute em florestas (Grass).',
  never_melt_ice:  'Derrote Swinub, Snorunt ou Jynx no Ice Path (Ice).',
  twisted_spoon:   'Derrote Abra, Drowzee ou Mr. Mime em Saffron City (Psychic).',
  hard_stone:      'Derrote Geodude, Rhyhorn ou Larvitar no Rock Tunnel (Rock).',
  spell_tag:       'Derrote Gastly, Haunter ou Gengar na Pokémon Tower (Ghost).',
  dragon_fang:     'Derrote Dratini, Dragonair ou Bagon na Dragon\'s Den (Dragon).',
  black_glasses:   'Derrote Murkrow, Sneasel ou Absol na Burned Tower (Dark).',
  metal_coat:      'Derrote Magnemite, Aron ou Bronzor na Power Plant (Steel).',
  fairy_feather:   'Derrote Clefairy, Togepi ou Marill no Mt. Moon (Fairy).',
  poison_barb:     'Derrote Ekans, Grimer ou Koffing nas cavernas (Poison).',
  soft_sand:       'Derrote Diglett, Sandshrew ou Trapinch no Rock Tunnel (Ground).',
  sharp_beak:      'Derrote Pidgeot, Doduo ou Farfetch\'d nas rotas abertas (Flying).',
  silver_powder:   'Derrote Caterpie, Paras ou Scyther na Viridian Forest (Bug).',
  leftovers:       'Derrote Snorlax, Munchlax ou Lickitung nas rotas comuns.',
  life_orb:        'Derrote Dragonite, Garchomp ou Metagross em Victory Road.',
  expert_belt:     'Derrote Lucario, Machamp ou Conkeldurr no Fighting Dojo.',
  focus_sash:      'Derrote Alakazam, Gardevoir ou Espeon em Saffron City.',
};

export const FORGE_RECIPE_DROP_GUIDE = Object.fromEntries(ALL_FORGE_RECIPES.map(recipe => {
  const sourceMaterial = getRecipeSourceMaterial(recipe);
  const guide = FORGE_MATERIAL_DROP_GUIDE[sourceMaterial] || FORGE_MATERIAL_DROP_GUIDE.normal_essence;
  const label = RECIPE_LABEL_OVERRIDES[recipe.id] || `Receita ${recipe.name}: ${guide.label}`;
  return [recipe.id, {
    recipeItemId: `recipe_${recipe.id}`,
    sourceMaterial,
    pokemonIds: guide.pokemonIds,
    routeId: guide.routeId,
    label,
  }];
}));

export const FORGE_RECIPE_DROP_BY_POKEMON = Object.entries(FORGE_RECIPE_DROP_GUIDE).reduce((acc, [recipeId, guide]) => {
  (guide.pokemonIds || []).forEach(id => {
    if (!acc[id]) acc[id] = [];
    acc[id].push(`recipe_${recipeId}`);
  });
  return acc;
}, {});

const fs = require('fs');

async function fetchPokedex() {
  console.log('Iniciando coleta Completa (Gen 1)...');
  const pokedex = {};
  
  for (let i = 1; i <= 151; i++) {
    try {
      const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const data = await pokeRes.json();
      
      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();
      
      const chainRes = await fetch(speciesData.evolution_chain.url);
      const chainData = await chainRes.json();

      let evolution = null;
      let current = chainData.chain;
      while (current) {
        if (current.species.name === data.name) {
          if (current.evolves_to.length > 0) {
            const next = current.evolves_to[0];
            evolution = {
              to: next.species.name.charAt(0).toUpperCase() + next.species.name.slice(1),
              level: next.evolution_details[0]?.min_level || 20,
              id: parseInt(next.species.url.split('/').filter(Boolean).pop())
            };
          }
          break;
        }
        if (current.evolves_to[0]) {
            current = current.evolves_to[0];
        } else {
            break;
        }
      }

      const stats = {};
      data.stats.forEach(s => stats[s.stat.name] = s.base_stat);
      const type = data.types[0].type.name;
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      
      const dropMap = {
        normal: 'normal_essence', fire: 'fire_essence', water: 'water_essence', grass: 'grass_essence',
        electric: 'electric_essence', ice: 'ice_essence', fighting: 'fighting_essence', poison: 'poison_essence',
        ground: 'ground_essence', flying: 'flying_essence', psychic: 'psychic_essence', bug: 'bug_essence',
        rock: 'rock_essence', ghost: 'ghost_essence', dragon: 'dragon_essence', steel: 'steel_essence',
        fairy: 'fairy_essence', dark: 'dark_essence'
      };

      const learnset = data.moves
        .filter(m => m.version_group_details.some(v => v.version_group.name === 'red-blue' && v.move_learn_method.name === 'level-up'))
        .map(m => ({
          level: m.version_group_details.find(v => v.version_group.name === 'red-blue' && v.move_learn_method.name === 'level-up').level_learned_at,
          move: m.move.name
        }))
        .sort((a, b) => a.level - b.level);

      pokedex[i] = {
        id: i,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        type: capitalizedType,
        types: data.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
        hp: stats.hp,
        maxHp: stats.hp,
        attack: stats.attack,
        defense: stats.defense,
        spAtk: stats['special-attack'],
        spDef: stats['special-defense'],
        speed: stats.speed,
        baseExp: data.base_experience || 64,
        drop: dropMap[type] || 'normal_essence',
        dropChance: 0.3,
        evolution: evolution,
        learnset: learnset
      };
      
      process.stdout.write(`\rProgresso: ${i}/151`);
    } catch (error) {
      console.error(`\nErro ao buscar Pokémon ${i}:`, error.message);
    }
  }

  const content = `export const POKEDEX = ${JSON.stringify(pokedex, null, 2)};\n`;
  fs.writeFileSync('src/data/pokedex.js', content);
  console.log('\n\nPokédex fixa com sucesso!');
}

fetchPokedex();

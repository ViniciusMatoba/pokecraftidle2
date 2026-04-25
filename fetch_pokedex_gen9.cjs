const fs = require('fs');

async function fetchPokedex() {
  console.log('Iniciando coleta completa da Pokédex (Geração 1 a 9)...');
  const pokedex = {};

  // Total de Pokémon até Gen 9 é aprox 1025
  const TOTAL_POKEMON = 1025;

  for (let i = 1; i <= TOTAL_POKEMON; i++) {
    try {
      const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      const data = await pokeRes.json();

      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();

      let evolution = null;
      if (speciesData.evolution_chain) {
        try {
          const chainRes = await fetch(speciesData.evolution_chain.url);
          const chainData = await chainRes.json();

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
        } catch (e) {
          console.error(`\nErro na evolução de ${data.name}`);
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

      // Pega o learnset da versão mais recente disponível
      const learnset = data.moves
        .filter(m => m.version_group_details.some(v => v.move_learn_method.name === 'level-up'))
        .map(m => {
          const latest = m.version_group_details
            .filter(v => v.move_learn_method.name === 'level-up')
            .sort((a, b) => b.level_learned_at - a.level_learned_at)[0];
          return {
            level: latest.level_learned_at,
            move: m.move.name
          };
        })
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
        learnset: learnset,
        abilities: data.abilities.map(a => a.ability.name)
      };

      process.stdout.write(`\rProgresso Pokédex: ${i}/${TOTAL_POKEMON} (${data.name})`);
    } catch (error) {
      console.error(`\nErro ao buscar Pokémon ${i}:`, error.message);
    }

    // Pequena pausa para evitar ser bloqueado
    if (i % 50 === 0) await new Promise(r => setTimeout(r, 1000));
  }

  const content = `export const POKEDEX = ${JSON.stringify(pokedex, null, 2)};\n`;
  fs.writeFileSync('src/data/pokedex_new.js', content);
  console.log('\n\nPokédex Gen 1-9 atualizada com sucesso!');
}

fetchPokedex();

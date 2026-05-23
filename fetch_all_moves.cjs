const fs = require('fs');

async function fetchAllMoves() {
  console.log('Iniciando busca de movimentos (Gen 1-9)...');
  const moves = {};
  
  try {
    const res = await fetch('https://pokeapi.co/api/v2/move?limit=2000');
    const data = await res.json();
    const moveList = data.results;

    for (let i = 0; i < moveList.length; i++) {
      try {
        const moveRes = await fetch(moveList[i].url);
        const m = await moveRes.json();
        
        // Formata o nome para ser consistente (snake_case para as chaves)
        const moveKey = moveList[i].name;
        
        moves[moveKey] = {
          id: m.id,
          name: m.names.find(n => n.language.name === 'en')?.name || m.name,
          type: m.type.name.charAt(0).toUpperCase() + m.type.name.slice(1),
          category: m.damage_class.name.charAt(0).toUpperCase() + m.damage_class.name.slice(1),
          power: m.power || 0,
          accuracy: m.accuracy || 100,
          pp: m.pp || 35,
          priority: m.priority || 0,
          effect: m.effect_entries.find(e => e.language.name === 'en')?.short_effect || "No effect description."
        };

        // Adiciona metadados de status para facilitar a lógica genérica
        if (m.damage_class.name === 'status') {
           moves[moveKey].statChanges = m.stat_changes?.map(sc => ({
              stat: sc.stat.name.replace('special-attack', 'spAtk').replace('special-defense', 'spDef'),
              change: sc.change
           }));
           // Determina o alvo (enemy ou user) baseado na categoria do efeito
           const ailment = m.meta?.ailment?.name || 'none';
           const category = m.meta?.category?.name || 'damage+ailment';
           
           // Heurística básica para alvo
           if (category.includes('net-good-stats') || category.includes('heal') || category.includes('damage+raise')) {
             moves[moveKey].target = 'user';
           } else if (category.includes('damage+lower') || category.includes('damage+ailment') || ailment !== 'none') {
             moves[moveKey].target = 'enemy';
           } else if (m.stat_changes && m.stat_changes.length > 0) {
             // Se mudar status, e o valor for negativo, costuma ser inimigo
             moves[moveKey].target = m.stat_changes[0].change < 0 ? 'enemy' : 'user';
           }
        }

        process.stdout.write(`\rProgresso Movimentos: ${i + 1}/${moveList.length}`);
      } catch (err) {
        console.error(`\nErro no golpe ${moveList[i].name}:`, err.message);
      }
    }

    const content = `export const MOVES = ${JSON.stringify(moves, null, 2)};\n`;
    fs.writeFileSync('src/data/moves.js', content);
    console.log('\n\nMovimentos atualizados com sucesso!');

  } catch (error) {
    console.error('Erro fatal:', error.message);
  }
}

fetchAllMoves();

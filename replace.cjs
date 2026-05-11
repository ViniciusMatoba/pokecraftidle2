const fs = require('fs');
const path = 'c:/Users/Usuario/Desktop/pokecraftidle2-clean/src/AppRoot.jsx';
let content = fs.readFileSync(path, 'utf-8');

const part1 = `      const teamWithXP = calcExpeditionXP(exp.team, biome, duration);
      const returnedTeam = teamWithXP.map(p => ({
        ...p,
        xp: (p.xp || 0) + (p.xpGained || 0),
      }));`;

const repl1 = `      const teamWithXP = calcExpeditionXP(exp.team, biome, duration);
      const processedResults = teamWithXP.map(p => processExpeditionPokemon(p, p.xpGained || 0));
      const returnedTeam = processedResults.map(r => r.pokemon);`;

const part2 = `      teamWithXP.forEach(p => {
        if (p.xpGained > 0)
          addLog(\`✨ \${p.name} ganhou \${p.xpGained} XP na expedição!\`, 'system');
      });`;

const repl2 = `      processedResults.forEach(r => {
        if (r.levelsGained > 0)
          addLog(\`🎉 \${r.pokemon.name} subiu \${r.levelsGained} nível(is)! (Nv.\${r.initialLevel} → \${r.finalLevel})\`, 'system');
        else if (r.xpGained > 0)
          addLog(\`✨ \${r.pokemon.name} ganhou \${r.xpGained} XP na expedição.\`, 'system');
      });

      expeditionReportRef.current = {
        biomeName: biome.name,
        biomeIcon: biome.icon || '🗺️',
        drops,
        pokemonResults: processedResults.map(r => ({
          name: r.pokemon.name,
          id: r.pokemon.id,
          isShiny: r.pokemon.isShiny,
          initialLevel: r.initialLevel,
          finalLevel: r.finalLevel,
          levelsGained: r.levelsGained,
          xpGained: r.xpGained,
          moveEvents: r.moveEvents,
        })),
      };`;

const part3 = `    });
  }, [addLog]);`;

const repl3 = `    });

    setTimeout(() => {
      if (expeditionReportRef.current) {
        setExpeditionReport(expeditionReportRef.current);
        expeditionReportRef.current = null;
      }
    }, 50);
  }, [addLog]);`;

const cleanContent = (str) => str.replace(/\r\n/g, '\n');

content = cleanContent(content);

if (!content.includes(cleanContent(part1))) {
  console.log('part 1 not found');
} else {
  content = content.replace(cleanContent(part1), cleanContent(repl1));
  console.log('part 1 replaced');
}

if (!content.includes(cleanContent(part2))) {
  console.log('part 2 not found');
} else {
  content = content.replace(cleanContent(part2), cleanContent(repl2));
  console.log('part 2 replaced');
}

if (!content.includes(cleanContent(part3))) {
  console.log('part 3 not found');
} else {
  content = content.replace(cleanContent(part3), cleanContent(repl3));
  console.log('part 3 replaced');
}

fs.writeFileSync(path, content, 'utf-8');
console.log('done');

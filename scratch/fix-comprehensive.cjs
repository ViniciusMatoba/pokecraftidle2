const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const fixes = [
  // Textos corrompidos comuns
  ['POKÃ\x89CRAFT', 'POKÉCRAFT'],
  ['PokÃ©mon', 'Pokémon'],
  ['PokÃ©', 'Poké'],
  ['GinÃ¡sio', 'Ginásio'],
  ['CampeÃ£o', 'Campeão'],
  ['ExaustÃ£o', 'Exaustão'],
  ['AlimentaÃ§Ã£o', 'Alimentação'],
  ['configuraÃ§Ã£o', 'configuração'],
  ['ConfiguraÃ§Ã£o', 'Configuração'],
  ['evoluÃ§Ã£o', 'evolução'],
  ['EvoluÃ§Ã£o', 'Evolução'],
  ['posiÃ§Ã£o', 'posição'],
  ['seleÃ§Ã£o', 'seleção'],
  ['informaÃ§Ã£o', 'informação'],
  ['notificaÃ§Ã£o', 'notificação'],
  ['batalha', 'batalha'],
  ['PRÃ\x93XIMO', 'PRÓXIMO'],
  ['Ã\x89', 'É'],
  ['proteÃ§Ã£o', 'proteção'],
  ['nÃ\xadvel', 'nível'],
  ['NÃ\xadvel', 'Nível'],
  // Ícones corrompidos no nav e header
  ['ðŸ¢', '🏢'],
  ['ðŸŽ‰', '🎉'],
  ['â š"ï¸', '⚔️'],
  ['ðŸ—º', '🗺️'],
  ['ðŸ±', '📱'],
  ['ðŸŽ\'', '🎒'],
  ['â˜ ', '☠️'],
  ['ðŸ"¥', '🔥'],
  ['ðŸ\'¥', '💥'],
  ['ðŸ›¡', '🛡️'],
  ['âœ¨', '✨'],
  ['âœ…', '✅'],
  ['â ¡', '⚡'],
  ['ðŸ\'§', '💧'],
  ['ðŸŒ¿', '🌿'],
  ['ðŸ\'Š', '💊'],
  ['ðŸ†', '🏆'],
  ['ðŸ"', '📋'],
  ['ðŸš€', '🚀'],
  ['ðŸŒŸ', '🌟'],
  ['ðŸ\'°', '💰'],
  ['ðŸŽ¯', '🎯'],
  ['â›', '⛏️'],
  ['ðŸ¦´', '🦴'],
  ['ðŸ§ª', '🧪'],
];

let total = 0;
fixes.forEach(([bad, good]) => {
  const count = (c.split(bad).length - 1);
  if (count > 0) {
    c = c.split(bad).join(good);
    total += count;
    console.log('Fixed ' + count + 'x: ' + bad + ' -> ' + good);
  }
});

fs.writeFileSync('src/AppRoot.jsx', c);
console.log('Total: ' + total + ' substituicoes em AppRoot.jsx');

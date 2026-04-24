const fs = require('fs');
const filePath = 'src/AppRoot.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix heal log
content = content.replace('addLog("íƒÂ…í‚Â¸íƒÂ‚í‚Â íƒÂ‚í‚Â¥ Todos os Pokémon da equipe foram curados!", "system");', 'addLog("🏥 Todos os Pokémon da equipe foram curados!", "system");');

// Fix forge log
content = content.replace('addLog(`🔥í‚Â¨ Forjado: ${qty}x ${item.name}`, \'system\');', 'addLog(`⚒️ Forjado: ${qty}x ${item.name}`, \'system\');');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed log message corruption');

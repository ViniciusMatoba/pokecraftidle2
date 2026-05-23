const fs = require('fs');
const filePath = 'src/AppRoot.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Mart Icon
content = content.replace('<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">Â í‚Âª</div>', '<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">🛍️</div>');

// 2. Mart Currency and mr-20
content = content.replace('<div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm">\n                         ðŸ’° {gameState.currency}', '<div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm mr-20">\n                         💰 {gameState.currency}');

// 3. Mart addLog
content = content.replace('addLog(`Â ðŸ ª Comprado: ${qty}x ${item.name}`, \'system\');', 'addLog(`🛍️ Comprado: ${qty}x ${item.name}`, \'system\');');

// 4. Forge Icon
content = content.replace('<div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">ðŸ”¥í‚Â¨</div>', '<div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">⚒️</div>');

// 5. Forge Currency and mr-20
content = content.replace('<div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm">\n                         ðŸ’° {gameState.currency}', '<div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm mr-20">\n                         💰 {gameState.currency}');
// Wait, the search string might be the same for both. Let's use a more unique search or global replace if they are all the same.
// Actually, they are inside different blocks. I'll use a global replace for the currency div if I want mr-20 on all of them.

// 6. Global currency mr-20 fix
content = content.replace(/<div className="bg-amber-50 border-2 border-amber-200 px-3 py-1\.5 rounded-xl font-black text-amber-700 text-sm">/g, '<div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm mr-20">');
content = content.replace(/ðŸ’°/g, '💰');

// 7. Forge addLog
content = content.replace('addLog(`ðŸ”¥í‚Â¨ Forjado: ${qty}x ${item.name}`, \'system\');', 'addLog(`⚒️ Forjado: ${qty}x ${item.name}`, \'system\');');

// 8. Heal addLog
content = content.replace('addLog("íƒÂ…í‚Â¸íƒÂ‚í‚Â íƒÂ‚í‚Â¥ Todos os Pokémon da equipe foram curados!", "system");', 'addLog("🏥 Todos os Pokémon da equipe foram curados!", "system");');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Restored and Fixed AppRoot UI');

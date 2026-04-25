const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

// Corrigir ícones corrompidos no nav
c = c.replace(/ðŸ—º[^\s'\"<]*/g, '🗺️');
c = c.replace(/ðŸ¢[^\s'\"<]*/g, '🏢');
c = c.replace(/ðŸŽ'[^\s'\"<]*/g, '🎒');
c = c.replace(/âš"ï¸[^\s'\"<]*/g, '⚔️');
c = c.replace(/ðŸ±[^\s'\"<]*/g, '📱');

fs.writeFileSync('src/AppRoot.jsx', c);
console.log('Icones corrigidos');

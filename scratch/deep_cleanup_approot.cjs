const fs = require('fs');
const filePath = 'src/AppRoot.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Use regex to catch common corruption patterns
content = content.replace(/í­Â‡í­Â•/g, ''); // Fixes CONSTRUÇÕES (sometimes)
content = content.replace(/í­Â‡/g, '');
content = content.replace(/ðŸ’Ž/g, '💎');
content = content.replace(/ðŸ ¢/g, '🏙️');
content = content.replace(/âœ–/g, '✖');
content = content.replace(/í­íƒÂ‚í‚Â¢nicas/g, 'vulcânicas');
content = content.replace(/í­íƒÂ‚í‚Â GUA/g, 'ÁGUA');
content = content.replace(/pí­íƒÂ‚í‚Â¢ntanos/g, 'pântanos');
content = content.replace(/íƒÂ…í‚Â¸íƒÂ‚í‚Â íƒÂ‚í‚Â¥/g, '🏥');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Thoroughly cleaned AppRoot corruption');

const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'src', 'AppRoot.jsx');
let content = fs.readFileSync(target, 'utf8');

const mapping = [
    { from: /âÅ“•/g, to: '✖' },
    { from: /âœ•/g, to: '✖' },
    { from: /í gua/g, to: 'Água' },
    { from: /í GUA/g, to: 'ÁGUA' },
    { from: /íÃ‚Â GUA/g, to: 'ÁGUA' },
    { from: /⚔️ï¸  /g, to: '⚔️' },
    { from: / â€ /g, to: '👤' },
    { from: /í°Ã…Â¸Ã‚Â Ã‚Â¥/g, to: '🏥' },
    { from: /í‡O/g, to: 'ÇO' },
    { from: /VOCíÅ /g, to: 'VOCÊ' },
    { from: /Ã¢ÂšÂ”Ã¯Â¸Â/g, to: '⚔️' },
    { from: /í¯Â¸Â/g, to: '' },
    { from: /ï¸ /g, to: '' }
];

mapping.forEach(m => {
    content = content.replace(m.from, m.to);
});

fs.writeFileSync(target, content, 'utf8');
console.log('Sanitized AppRoot.jsx');

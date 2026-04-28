const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    { m: 'íÂ gua', c: 'Água' },
    { m: 'íÂ°Ã…Â¸Ã‚Â Ã‚Â¥', c: '🥩' },
    { m: 'í°Å¸Â Âª', c: '🧪' },
    { m: 'í°Å¸â€ Â¨', c: '🔥' },
    { m: 'íÃ‚Â GUA', c: 'ÁGUA' },
    { m: 'píÃ‚Â¢ntanos', c: 'pântanos' },
    { m: 'PSíÃ‚Â QUICO', c: 'PSÍQUICO' },
    { m: 'MansíÃ‚Âµes', c: 'Mansões' },
    { m: 'DRAGíO', c: 'DRAGÃO' },
    { m: 'AíÂ‡O', c: 'AÇO' },
    { m: 'í°Å¸Â Â½', c: '🍴' },
    { m: 'ââ€ Â', c: '➔' },
    { m: 'âÅ“•', c: '✖' },
    { m: 'í°Å¸Â', c: '' }, // Clean up leftovers
    { m: 'í°Å¸Å½Â', c: '🎁' },
    { m: 'íÂ°Ã…', c: '🍖' }
];

const filePath = path.join(__dirname, '..', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

for (const r of REPLACEMENTS) {
    content = content.split(r.m).join(r.c);
}

// Global cleanup for any remaining mangled accented letters
content = content.replace(/íÃ‚Â¡/g, 'á');
content = content.replace(/íÃ‚Â³/g, 'ó');
content = content.replace(/íÃ‚Â©/g, 'é');
content = content.replace(/íÃ‚Â§/g, 'ç');
content = content.replace(/íÃ‚Â£/g, 'ã');
content = content.replace(/íÃ‚Â¢/g, 'â');
content = content.replace(/íÃ‚Âª/g, 'ê');
content = content.replace(/íÃ‚Â/g, 'í'); // This might be risky but likely correct

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx Deep Sanitization Complete.');

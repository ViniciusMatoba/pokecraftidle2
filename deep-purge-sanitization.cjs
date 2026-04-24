const fs = require('fs');
const path = require('path');

const MAPPINGS = [
    // format: { m: Buffer.from([...]), c: 'string' }
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x96, 0xC2, 0xB6]), c: '▶' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x9C, 0xC2, 0xA6]), c: '✦' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x9C, 0xC2, 0xA7]), c: '✧' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x9C, 0xE2, 0x80, 0xA2]), c: '✖' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x9C, 0xC2, 0x95]), c: '✖' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x9E, 0xE2, 0x80, 0x9D]), c: '➔' },
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x9A, 0xC2, 0x94]), c: '⚔️' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x9A, 0xC2, 0xA0]), c: '⚠️' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x9C, 0xE2, 0x80, 0x93]), c: '✅' },
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x86, 0xE2, 0x80, 0x9D]), c: '→' },
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x86, 0xC2, 0x92]), c: '→' },
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x86, 0xC2, 0x90]), c: '←' },
    { m: Buffer.from([0xC3, 0xA2, 0xE2, 0x80, 0x93, 0xC2, 0xBC]), c: '▼' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x96, 0xC2, 0xBC]), c: '▼' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xE2, 0x80, 0x93, 0xC2, 0xB2]), c: '▲' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xC2, 0x96, 0xC2, 0xB2]), c: '▲' }, 
    { m: Buffer.from([0xC3, 0xA2, 0xE2, 0x80, 0xA0, 0xC2, 0xA0]), c: '↑' },
];

const STR_MAPPINGS = [
    { m: 'â†’', c: '→' },
    { m: 'â† ', c: '←' },
    { m: 'âœ…', c: '✅' },
    { m: 'âœ•', c: '✖' },
    { m: 'âœ¦', c: '✧' },
    { m: 'âš”', c: '⚔️' },
    { m: 'âÅ¡Â ', c: '⚠️' },
    { m: 'âÂ Å’', c: '❌' },
    { m: 'â ±', c: '⏱️' },
    { m: 'â€ ', c: '⚔️' },
    { m: 'â€¦', c: '...' },
    { m: 'í°Å¸â€˜Â¤', c: '👤' },
    { m: 'â–¶', c: '▶' },
    { m: 'í‡íO', c: 'ção' },
    { m: 'í‡íµ', c: 'ções' },
    { m: 'í‡í£', c: 'çã' },
    { m: 'íÂ¡', c: 'á' },
    { m: 'íÂ©', c: 'é' },
    { m: 'íÂ³', c: 'ó' },
    { m: 'íÂº', c: 'ú' },
    { m: 'íÂ£', c: 'ã' },
    { m: 'íÂµ', c: 'õ' },
    { m: 'íÂ§', c: 'ç' },
    { m: 'íÂª', c: 'ê' },
    { m: 'íÂ¢', c: 'â' },
    { m: 'íÂ ', c: 'à' },
    { m: 'íÂ´', c: 'ô' },
    { m: 'íÂ ', c: 'Á' },
    { m: 'íâ€°', c: 'É' },
    { m: 'íâ€œ', c: 'Ó' },
    { m: 'íÅ¡', c: 'Ú' },
    { m: 'í°Å¸Â Â½', c: '🍽️' },
    { m: 'í°Å¸Â Â¨', c: '🍖' },
];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            if (f !== 'node_modules' && f !== '.git' && f !== 'dist') walkDir(dirPath, callback);
        } else {
            if (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.css') || f.endsWith('.html')) callback(path.join(dir, f));
        }
    });
}

const targetDir = path.join(__dirname, 'src');

walkDir(targetDir, (filePath) => {
    let buffer = fs.readFileSync(filePath);
    let changed = false;

    MAPPINGS.forEach(p => {
        let index = buffer.indexOf(p.m);
        while (index !== -1) {
            changed = true;
            let replacement = Buffer.from(p.c);
            let newBuffer = Buffer.alloc(buffer.length - p.m.length + replacement.length);
            buffer.copy(newBuffer, 0, 0, index);
            replacement.copy(newBuffer, index);
            buffer.copy(newBuffer, index + replacement.length, index + p.m.length);
            buffer = newBuffer;
            index = buffer.indexOf(p.m, index + replacement.length);
        }
    });

    let content = buffer.toString('utf8');
    STR_MAPPINGS.forEach(p => {
        while (content.includes(p.m)) {
            content = content.replace(p.m, p.c);
            changed = true;
        }
    });
    
    // Final aggressive cleanup for bars and junk
    const original = content;
    content = content.replace(/ââ€ â‚¬/g, '─');
    content = content.replace(/â”€/g, '─');
    content = content.replace(/í¯Â¸Â/g, ''); // Variation selector junk
    content = content.replace(/ï¸ /g, '');    // Variation selector junk
    if (content !== original) changed = true;

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Sanitized: ${filePath}`);
    }
});

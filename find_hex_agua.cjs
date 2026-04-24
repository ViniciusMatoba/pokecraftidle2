const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'src', 'AppRoot.jsx');
const buffer = fs.readFileSync(target);
const content = buffer.toString('utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('alt="') && lines[i].includes('Fresca')) {
        console.log('Line', i + 1, 'Hex:', Buffer.from(lines[i]).toString('hex'));
    }
}

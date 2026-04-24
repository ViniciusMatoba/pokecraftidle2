const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'src', 'AppRoot.jsx');
const buffer = fs.readFileSync(target);

// Find the line with setPreviewStarter(null)
const content = buffer.toString('utf8');
const lines = content.split('\n');
let foundLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('setPreviewStarter(null)')) {
        foundLine = i;
        break;
    }
}

if (foundLine !== -1) {
    console.log('Found at line', foundLine + 1);
    console.log('Content:', lines[foundLine + 1]);
    const nextLine = lines[foundLine + 1];
    // Show hex of the next line (the one with the span)
    console.log('Hex:', Buffer.from(nextLine).toString('hex'));
}

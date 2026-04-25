const fs = require('fs');
const content = fs.readFileSync('src/AppRoot.jsx', 'utf8');
const line = content.split('\n')[1031]; // Line 1032
console.log('Line 1032:', line);
for (let i = 0; i < line.length; i++) {
    console.log(`Char at ${i}: ${line[i]} (code: ${line.charCodeAt(i)})`);
}

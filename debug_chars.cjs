const fs = require('fs');
const content = fs.readFileSync('src/components/CityScreen.jsx', 'utf8');
const line = content.split('\n')[130]; // Line 131 (0-indexed)
console.log('Line 131:', line);
for (let i = 0; i < line.length; i++) {
    console.log(`Char at ${i}: ${line[i]} (code: ${line.charCodeAt(i)})`);
}

const fs = require('fs');

const content = fs.readFileSync('src/AppRoot.jsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
let inString = false;
let stringChar = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    
    if (inString) {
      if (char === stringChar && line[j-1] !== '\\') {
        inString = false;
      }
      continue;
    }
    
    if (char === "'" || char === '"' || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }
    
    if (char === '(') balance++;
    if (char === ')') balance--;
  }
  if (balance < 0) {
    console.log(`Balance went negative at line ${i + 1}: ${line}`);
    balance = 0;
  }
}
console.log(`Final balance: ${balance}`);

const fs = require('fs');
const content = fs.readFileSync('src/components/PokemonManagement.jsx', 'utf8');
const lines = content.split('\n');
let indent = 0;
lines.forEach((line, i) => {
  const open = (line.match(/<div/g) || []).length;
  const close = (line.match(/<\/div/g) || []).length;
  if (open > 0 || close > 0) {
    indent += open - close;
    console.log(`${i+1}: ${indent} (${line.trim()})`);
  }
});

const fs = require('fs');
const prefix = fs.readFileSync('c:/Users/Usuario/Desktop/pokecraftidle2-clean/src/data/routes_prefix.js', 'utf8');
const broken = fs.readFileSync('c:/Users/Usuario/Desktop/pokecraftidle2-clean/src/data/routes.js', 'utf8');
const brokenLines = broken.split('\n');
const rest = brokenLines.slice(3).join('\n');
fs.writeFileSync('c:/Users/Usuario/Desktop/pokecraftidle2-clean/src/data/routes.js', prefix + '\n' + rest);

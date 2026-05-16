const fs = require('fs');
const path = 'c:/Users/Usuario/Desktop/pokecraftidle2-clean/src/data/routes.js';
let content = fs.readFileSync(path, 'utf8');

// Remover linhas de background que seguem o padrão /bg_...webp
const pattern = /^\s*background:\s*'\/bg_.*\.webp',\s*\n/gm;
content = content.replace(pattern, '');

fs.writeFileSync(path, content);
console.log('Cleanup complete.');

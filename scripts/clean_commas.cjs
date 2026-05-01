const fs = require('fs');
const path = 'src/data/routes.js';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/\},,/g, '},');
fs.writeFileSync(path, content, 'utf8');
console.log('Fixed double commas in routes.js');

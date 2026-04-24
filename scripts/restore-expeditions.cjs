const fs = require('fs');
const path = require('path');

const expeditionsPath = path.join(process.cwd(), 'src/data/expeditions.js');
let content = fs.readFileSync(expeditionsPath, 'utf8');

const FIXES = [
    { m: "icon: '>J',", c: "icon: '👊'," },
    { m: "icon: '={',", c: "icon: '👻'," },
    { m: "icon: '🌊' ',", c: "icon: '🔥'," },
    { m: "icon: '=	',", c: "icon: '🐉'," }
];

for (const fix of FIXES) {
    content = content.replace(fix.m, fix.c);
}

fs.writeFileSync(expeditionsPath, content, 'utf8');
console.log('Restored expeditions.js icons');

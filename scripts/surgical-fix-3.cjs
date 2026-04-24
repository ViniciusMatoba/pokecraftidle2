const fs = require('fs');
const path = require('path');

const SURGICAL_FIXES = [
    { file: 'src/data/expeditions.js', m: "icon: '🌊'>'", c: "icon: '🌊'" },
    { file: 'src/data/house.js', m: "icon: '🧊''", c: "icon: '🧊'" }
];

for (const fix of SURGICAL_FIXES) {
    const fullPath = path.join(process.cwd(), fix.file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(fix.m)) {
            content = content.replace(fix.m, fix.c);
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Surgical fix applied to ${fix.file}`);
        }
    }
}

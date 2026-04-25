const fs = require('fs');
const path = require('path');

const SURGICAL_FIXES = [
    { file: 'src/data/house.js', m: "icon: '🌊'Q'", c: "icon: '🍑'" },
    { file: 'src/data/expeditions.js', m: "icon: '🌊'\n',", c: "icon: '🌊'," },
    { file: 'src/components/BattleScreen.jsx', m: '<p className="font-black text-slate-800 text-sm uppercase tracking-tighter"><p className="font-black text-slate-800 text-sm uppercase tracking-tighter">', c: '<p className="font-black text-slate-800 text-sm uppercase tracking-tighter">' },
    { file: 'src/components/HouseScreen.jsx', m: '<p className="text-4xl mb-2">=></p>', c: '<p className="text-4xl mb-2">🐾</p>' }
];

for (const fix of SURGICAL_FIXES) {
    const fullPath = path.join(process.cwd(), fix.file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(fix.m)) {
            content = content.replace(fix.m, fix.c);
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Surgical fix applied to ${fix.file}`);
        } else {
             // Try a softer match for the multiline one
             if (fix.file === 'src/data/expeditions.js') {
                 content = content.replace(/icon: '🌊'\s+',/g, "icon: '🌊',");
                 fs.writeFileSync(fullPath, content, 'utf8');
             }
        }
    }
}

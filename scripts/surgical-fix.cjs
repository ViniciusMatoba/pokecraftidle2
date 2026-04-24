const fs = require('fs');
const path = require('path');

const SURGICAL_FIXES = [
    { file: 'src/data/house.js', m: "icon: '🌊'R'", c: "icon: '🍒'" },
    { file: 'src/data/expeditions.js', m: "icon: '🌊'2'", c: "icon: '🌲'" },
    { file: 'src/components/BattleScreen.jsx', m: '<t Auto-Estamina</p>', c: '<p className="font-black text-slate-800 text-sm uppercase tracking-tighter">Auto-Estamina</p>' },
    { file: 'src/components/HouseScreen.jsx', m: '<> Colher!\n        </button>', c: 'Colher!\n        </button>' },
    { file: 'src/components/HouseScreen.jsx', m: '<> Colher!', c: 'Colher!' }
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

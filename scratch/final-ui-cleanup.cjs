const fs = require('fs');
let lines = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8').split(/\r?\n/);

// Find the redundant section (lines 397-446)
const redundantStart = lines.findIndex(l => l.includes('{/* Categoria 1 — Captura */}'));
if (redundantStart !== -1) {
    let realStart = redundantStart;
    // Go up to the opening div
    while (realStart > 0 && !lines[realStart].includes('<div style={{padding: \'8px 12px 4px 12px\'')) {
        realStart--;
    }
    
    // Go down to the closing div of the section
    const golpesIdx = lines.findIndex(l => l.includes('{/*    GOLPES    */}'));
    // The section ends right before GOLPES
    lines.splice(realStart, golpesIdx - realStart);
}

fs.writeFileSync('src/components/BattleScreen.jsx', lines.join('\n'));
console.log('Success');

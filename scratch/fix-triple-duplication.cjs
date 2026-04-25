const fs = require('fs');
let lines = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8').split(/\r?\n/);

// We want to keep the block that starts around line 352
// and delete everything between line 403 and the start of GOLPES (line 506 approx)

const golpesIdx = lines.findIndex(l => l.includes('{/*    GOLPES    */}'));
const section1End = 403; // End of the first block we want to keep

if (golpesIdx !== -1 && golpesIdx > section1End) {
    // Delete from line 404 to golpesIdx - 1
    lines.splice(section1End, golpesIdx - section1End);
}

fs.writeFileSync('src/components/BattleScreen.jsx', lines.join('\n'));
console.log('Success');

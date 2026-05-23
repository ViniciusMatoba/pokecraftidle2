const fs = require('fs');
let lines = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8').split(/\r?\n/);

// Remove renderItemBtn from its current (incorrect) location
const startLine = 50;
const endLine = 78;
const renderItemBtnLines = lines.splice(startLine - 1, (endLine - startLine) + 1);

// Find the main return statement to insert it before
const returnIdx = lines.findIndex(l => l.trim() === 'return (');
lines.splice(returnIdx, 0, ...renderItemBtnLines);

fs.writeFileSync('src/components/BattleScreen.jsx', lines.join('\n'));
console.log('Success');

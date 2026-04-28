const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    { hex: 'c3b0c29fc286', correct: '🏆' }, // More generic
    { hex: 'c3b0c29fc28f86', correct: '🏆' }, // More specific
    { hex: 'c3b0c29fc28f', correct: '🏆' } // Even more generic
];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') walkDir(dirPath, callback);
    } else {
      if (f.endsWith('.js') || f.endsWith('.jsx')) callback(path.join(dir, f));
    }
  });
}

const targetDir = path.join(__dirname, '..', 'src');

walkDir(targetDir, (filePath) => {
  let content = fs.readFileSync(filePath);
  let changed = false;
  for (const rep of REPLACEMENTS) {
    const mangled = Buffer.from(rep.hex, 'hex');
    const correct = Buffer.from(rep.correct, 'utf8');
    let index = content.indexOf(mangled);
    while (index !== -1) {
        content = Buffer.concat([content.slice(0, index), correct, content.slice(index + mangled.length)]);
        changed = true;
        index = content.indexOf(mangled, index + correct.length);
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Hex Repaired: ${filePath}`);
  }
});

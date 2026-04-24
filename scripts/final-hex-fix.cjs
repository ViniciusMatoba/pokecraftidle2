const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    { hex: 'c3b0c29fc28dc2b4', correct: '🍴' },
    { hex: 'c3b0c29fc292c2a1', correct: '💡' },
    { hex: 'c3b0c29fc28c29f', correct: '🌿' },
    { hex: 'c3b0c29fc28d296', correct: '🍖' },
    { hex: 'c3adc2b0c385c2b8c382c28fc38bc29cc3adc2afc382c2b8c382c28f', correct: '🏘️' },
    { hex: 'c383c2a2c382c29ac382c2a0c383c2afc382c2b8c382c28f', correct: '⚠️' },
    { hex: 'c3a2cb9ce280a6', correct: '★' },
    { hex: 'c3a2e28093e28094', correct: '—' },
    { hex: 'c3a2e28093c2a2', correct: '•' },
    { hex: 'c3b0c29fc294c2b4', correct: '🔴' },
    { hex: 'c3b0c29fc2a7c2aa', correct: '🧪' },
    { hex: 'c3b0c29fc292c2b0', correct: '💰' },
    { hex: 'c3b0c29fc293c2a6', correct: '📦' },
    { hex: 'c3adc2b0c385c2b8c382c29fc385c2bdc2a0', correct: '🎁' },
    { hex: 'c3adc293', correct: 'Ó' },
    { hex: 'c3adc289', correct: 'É' },
    { hex: 'c3adc2a1', correct: 'á' },
    { hex: 'c3adc2b3', correct: 'ó' },
    { hex: 'c3adc2ad', correct: 'í' },
    { hex: 'c3adc2aa', correct: 'ê' },
    { hex: 'c3adc2a7', correct: 'ç' },
    { hex: 'c3adc2a3', correct: 'ã' },
    { hex: 'c3adc2ba', correct: 'ú' },
    { hex: 'c3b0c29fc294c287', correct: '🔇' },
    { hex: 'c3b0c29fc294c28a', correct: '🔊' },
    { hex: 'c3a2c5a1e2809dc3afc2b8c28fc3adc2afc382c2b8c382c28f', correct: '⚔️' },
    { hex: 'c3b0c29fc28cc29f', correct: '🌟' },
    { hex: 'c3b0c29fc292c2a5', correct: '💥' },
    { hex: 'c3b0c29fc28cc28a', correct: '🌊' },
    { hex: 'c3b0c29fc2a5c2a9', correct: '🥩' },
    { hex: 'c3b0c29fc292c28a', correct: '💊' },
    { hex: 'c3b0c29fc292c289', correct: '💉' },
    { hex: 'c3b0c29fc294c292', correct: '🔒' },
    { hex: 'c3b0c29fc28f20', correct: '🏆' }, // Simplified check
    { hex: 'c3b0c29fc290c2be', correct: '🐾' },
    { hex: 'c3b0c29fc2a9c2b7', correct: '🌸' },
    { hex: 'c3b0c29fc28eb2', correct: '🎾' },
    { hex: 'c3adc281', correct: 'Á' },
    { hex: 'c3adc2b4', correct: 'ô' },
    { hex: 'c3adc2a2', correct: 'â' }
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

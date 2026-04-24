const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    // Emojis (Mangled Hex)
    { hex: 'c3b0c29fc28dc2b4', correct: '🍴' }, // 🍴
    { hex: 'c3b0c29fc292c2a1', correct: '💡' }, // 💡
    { hex: 'c3b0c29fc294c2a0', correct: '⚠️' }, // ⚠️ variation
    { hex: 'c3a2c29ab2c3afc2b8c28f', correct: '⚠️' }, // ⚠️ variation
    { hex: 'c3adc2b0c385c2b8c382c28fc38bc29cc3adc2afc382c2b8c382c28f', correct: '🏘️' }, // 🏘️
    { hex: 'c3b0c29fc28c29f', correct: '🌿' }, // 🌿
    { hex: 'c3b0c29fc294c287', correct: '🔇' }, // 🔇
    { hex: 'c3b0c29fc294c28a', correct: '🔊' }, // 🔊
    { hex: 'c3b0c29fc28d296', correct: '🍖' }, // 🍖
    { hex: 'c3a2c280c2a2', correct: '•' }, // •
    { hex: 'c3a2c280c294', correct: '—' }, // —
    { hex: 'c3a2c296c2b6', correct: '▶' }, // ▶
    { hex: 'c3a2c29ab2', correct: '⚔️' }, // ⚔️
    { hex: 'c3b0c29fc292c2b0', correct: '💰' }, // 💰
    { hex: 'c3b0c29fc293c2a6', correct: '📦' }, // 📦
    { hex: 'c3adc2b0c385c2b8c382c29fc385c2bdc2a0', correct: '🎁' }, // 🎁
    
    // Accents (Mangled Hex)
    { hex: 'c3adc293', correct: 'Ó' },
    { hex: 'c3adc289', correct: 'É' },
    { hex: 'c3adc2a1', correct: 'á' },
    { hex: 'c3adc2b3', correct: 'ó' },
    { hex: 'c3adc2ad', correct: 'í' },
    { hex: 'c3adc2aa', correct: 'ê' },
    { hex: 'c3adc2a7', correct: 'ç' },
    { hex: 'c3adc2a3', correct: 'ã' },
    { hex: 'c3adc2ba', correct: 'ú' },
    { hex: 'c3adc281', correct: 'Á' },
    { hex: 'c3adc2b4', correct: 'ô' },
    { hex: 'c3adc2a2', correct: 'â' }
];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.js') || f.endsWith('.jsx')) {
        callback(path.join(dir, f));
      }
    }
  });
}

const targetDir = path.join(__dirname, '..', 'src');

walkDir(targetDir, (filePath) => {
  let content = fs.readFileSync(filePath);
  let changed = false;
  
  // Sort replacements by length descending to avoid partial matches
  const sortedReps = [...REPLACEMENTS].sort((a, b) => b.hex.length - a.hex.length);

  for (const rep of sortedReps) {
    const mangledBuffer = Buffer.from(rep.hex, 'hex');
    const correctBuffer = Buffer.from(rep.correct, 'utf8');
    
    let index = content.indexOf(mangledBuffer);
    while (index !== -1) {
        changed = true;
        content = Buffer.concat([
            content.slice(0, index),
            correctBuffer,
            content.slice(index + mangledBuffer.length)
        ]);
        index = content.indexOf(mangledBuffer, index + correctBuffer.length);
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Hex Repaired: ${filePath}`);
  }
});

console.log('Hex repair pass complete.');

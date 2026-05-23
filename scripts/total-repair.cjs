const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    { mangled: 'ðŸ’°', correct: '💰' },
    { mangled: 'ðŸ“¦', correct: '📦' },
    { mangled: 'ðŸŽ ', correct: '🎁' },
    { mangled: 'í°Å¸Å½Â ', correct: '🎁' },
    { mangled: 'í°Å¸â€ºÂ í¯Â¸Â ', correct: '🛠️' },
    { mangled: 'í¢Å“â€¦', correct: '✅' },
    { mangled: 'ðŸŒ¾', correct: '🌾' },
    { mangled: 'ðŸŒ¿', correct: '🌿' },
    { mangled: 'í°Å¸Â Ëœí¯Â¸Â ', correct: '🏘️' },
    { mangled: 'âš”ï¸ í¯Â¸Â ', correct: '⚔️' },
    { mangled: 'â–¶', correct: '▶' },
    { mangled: 'â–¶ï¸ ', correct: '▶' },
    { mangled: 'âš ï¸ ', correct: '⚠️' },
    { mangled: 'ðŸ’¡', correct: '💡' },
    { mangled: 'ðŸ ´', correct: '🍴' },
    { mangled: 'ðŸ –', correct: '🍖' },
    { mangled: 'â€¢', correct: '•' },
    { mangled: 'â˜…', correct: '★' },
    { mangled: 'â€”', correct: '—' },
    { mangled: 'ðŸ”‡', correct: '🔇' },
    { mangled: 'ðŸ”Š', correct: '🔊' },
    { mangled: '🥩', correct: '🥩' },
    { mangled: '🍖', correct: '🍖' },

    // Accents
    { mangled: 'í“timo', correct: 'Ótimo' },
    { mangled: 'í‰', correct: 'É' },
    { mangled: 'í“', correct: 'Ó' },
    { mangled: 'í­', correct: 'í' },
    { mangled: 'í¡', correct: 'á' },
    { mangled: 'í³', correct: 'ó' },
    { mangled: 'íº', correct: 'ú' },
    { mangled: 'íª', correct: 'ê' },
    { mangled: 'í§', correct: 'ç' },
    { mangled: 'í£', correct: 'ã' },
    { mangled: 'í‡', correct: 'Ç' },
    { mangled: 'í•', correct: 'Õ' },
    { mangled: 'íƒ', correct: 'Ã' },
    { mangled: 'í guas', correct: 'Águas' },
    { mangled: 'VovíÂ´', correct: 'Vovô' },
    { mangled: 'VocÃª', correct: 'Você' },
    { mangled: 'Ã©', correct: 'é' },
    { mangled: 'Ã³', correct: 'ó' },
    { mangled: 'Ã¡', correct: 'á' },
    { mangled: 'Ãª', correct: 'ê' },
    { mangled: 'Ã¬', correct: 'ì' },
    { mangled: 'Ã§', correct: 'ç' },
    { mangled: 'Ã£', correct: 'ã' },
    { mangled: 'Ã ', correct: 'à' },
    { mangled: 'Ãº', correct: 'ú' },
    { mangled: 'íO', correct: 'ÃO' }, // For ALIMENTAÇíO
    { mangled: 'í“', correct: 'Ó' }
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
  // Read as LATIN1 to capture exact mangled bytes
  let content = fs.readFileSync(filePath, 'latin1');
  let changed = false;
  
  for (const rep of REPLACEMENTS) {
    // Escape the mangled string for regex
    const escaped = rep.mangled.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    if (regex.test(content)) {
        content = content.replace(regex, rep.correct);
        changed = true;
    }
  }
  
  if (changed) {
    // Write back as UTF-8
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Latin1 Repaired: ${filePath}`);
  }
});

console.log('Final Latin1 repair pass complete.');

const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    // Emojis & Symbols
    { mangled: /ðŸ’°/g, correct: '💰' },
    { mangled: /ðŸ“¦/g, correct: '📦' },
    { mangled: /ðŸŽ /g, correct: '🎁' },
    { mangled: /í°Å¸Å½Â /g, correct: '🎁' },
    { mangled: /í°Å¸â€ºÂ í¯Â¸Â /g, correct: '🛠️' },
    { mangled: /í¢Å“â€¦/g, correct: '✅' },
    { mangled: /ðŸŒ¾/g, correct: '🌾' },
    { mangled: /ðŸŒ¿/g, correct: '🌿' },
    { mangled: /í°Å¸Â Ëœí¯Â¸Â /g, correct: '🏘️' },
    { mangled: /âš”ï¸ í¯Â¸Â /g, correct: '⚔️' },
    { mangled: /â–¶/g, correct: '▶' },
    { mangled: /â–¶ï¸ /g, correct: '▶' },
    { mangled: /âš ï¸ /g, correct: '⚠️' },
    { mangled: /ðŸ’¡/g, correct: '💡' },
    { mangled: /ðŸ ´/g, correct: '🍴' },
    { mangled: /ðŸ –/g, correct: '🍖' },
    { mangled: /â€¢/g, correct: '•' },
    { mangled: /â˜…/g, correct: '★' },
    { mangled: /â€”/g, correct: '—' },
    { mangled: /ðŸ”‡/g, correct: '🔇' },
    { mangled: /ðŸ”Š/g, correct: '🔊' },

    // Accents (Mangled UTF-8 interpreted as Latin1)
    { mangled: /í“timo/g, correct: 'Ótimo' },
    { mangled: /í‰/g, correct: 'É' },
    { mangled: /í“/g, correct: 'Ó' },
    { mangled: /í­/g, correct: 'í' },
    { mangled: /í¡/g, correct: 'á' },
    { mangled: /í³/g, correct: 'ó' },
    { mangled: /íº/g, correct: 'ú' },
    { mangled: /íª/g, correct: 'ê' },
    { mangled: /í§/g, correct: 'ç' },
    { mangled: /í£/g, correct: 'ã' },
    { mangled: /í‡/g, correct: 'Ç' },
    { mangled: /í•/g, correct: 'Õ' },
    { mangled: /íƒ/g, correct: 'Ã' },
    { mangled: /í guas/g, correct: 'Águas' },
    { mangled: /VovíÂ´/g, correct: 'Vovô' },
    { mangled: /VocÃª/g, correct: 'Você' },
    { mangled: /Ã©/g, correct: 'é' },
    { mangled: /Ã³/g, correct: 'ó' },
    { mangled: /Ã¡/g, correct: 'á' },
    { mangled: /Ãª/g, correct: 'ê' },
    { mangled: /Ã¬/g, correct: 'ì' },
    { mangled: /Ã§/g, correct: 'ç' },
    { mangled: /Ã£/g, correct: 'ã' },
    { mangled: /Ã /g, correct: 'à' },
    { mangled: /Ãº/g, correct: 'ú' }
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
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const rep of REPLACEMENTS) {
    content = content.replace(rep.mangled, rep.correct);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Repaired: ${filePath}`);
  }
});

console.log('Global repair complete.');

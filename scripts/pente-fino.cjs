const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
  { mangled: /POKí‰MON/g, correct: 'POKÉMON' },
  { mangled: /POKí‰CRAFT/g, correct: 'POKÉCRAFT' },
  { mangled: /Próximo â–¶/g, correct: 'Próximo \u25B6' },
  { mangled: /Próximo Â-¶/g, correct: 'Próximo \u25B6' },
  { mangled: /âš”ï¸ í¯Â¸Â /g, correct: '\u2694\uFE0F' },
  { mangled: /í°Å¸Â Â¢/g, correct: '\u{1F3E2}' },
  { mangled: /PokÃ©mons/g, correct: 'Pokémons' },
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
  { mangled: /Ã©/g, correct: 'é' },
  { mangled: /Ã³/g, correct: 'ó' },
  { mangled: /Ã¡/g, correct: 'á' },
  { mangled: /Ãª/g, correct: 'ê' },
  { mangled: /Ã¬/g, correct: 'ì' },
  { mangled: /Ã§/g, correct: 'ç' },
  { mangled: /Ã£/g, correct: 'ã' },
  { mangled: /Ã /g, correct: 'à' },
  { mangled: /Ãº/g, correct: 'ú' },
  { mangled: /Ã/g, correct: 'í' },
  { mangled: /ï¸ /g, correct: '' }
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
      if (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.css')) {
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
    console.log(`Fixed: ${filePath}`);
  }
});

console.log('Pente fino complete.');

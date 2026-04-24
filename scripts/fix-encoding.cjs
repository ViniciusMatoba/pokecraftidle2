const fs = require('fs');
const path = require('path');

const REPLACEMENTS = {
  // Triple/Double Mangled
  'âš”ï¸ Ã¯Â¸Â ': '⚔️',
  'Ã°Å¸Â Â¢': '🏢',
  'PokÃ©mons': 'Pokémons',
  'Pokí‰MON': 'POKÉMON',
  'POKí‰MON': 'POKÉMON',
  'âš”ï¸ ': '⚔️',
  '⚔️ï¸ ': '⚔️',
  'ðŸ ¢': '🏢',
  'Â-¶': '▶',
  'â–¶': '▶',
  'í‰': 'É',
  'í“': 'Ó',
  'í­': 'í',
  'í¡': 'á',
  'í³': 'ó',
  'íº': 'ú',
  'íª': 'ê',
  'í§': 'ç',
  'í£': 'ã',
  'Ã©': 'é',
  'Ã³': 'ó',
  'Ã¡': 'á',
  'Ãª': 'ê',
  'Ã¬': 'ì',
  'Ã§': 'ç',
  'Ã£': 'ã',
  'Ã ': 'à',
  'Ãº': 'ú',
  'Ã': 'í',
  'ï¸ ': ''
};

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
  
  let changed = true;
  while (changed) {
    let nextContent = content;
    for (const [mangled, correct] of Object.entries(REPLACEMENTS)) {
      nextContent = nextContent.split(mangled).join(correct);
    }
    if (nextContent === content) {
      changed = false;
    } else {
      content = nextContent;
    }
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
});

console.log('Advanced Encoding fix complete.');

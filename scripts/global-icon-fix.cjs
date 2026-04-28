const fs = require('fs');
const path = require('path');

const ICON_MAP = {
    'C': '🧊',
    'Q': '🍑',
    'R': '🍒',
    'K': '🍐',
    'N': '🍅',
    'V': '🔋',
    'J': '👊',
    '0': '🌰',
    ' ': '🌙',
    '?': '🌿',
    '1': '🌱',
    '2': '🌲',
    'd': '🥤',
    '[': '🥛'
};

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

const targetDir = path.join(process.cwd(), 'src');

walkDir(targetDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix '🌊'X patterns in strings
  for (const [key, val] of Object.entries(ICON_MAP)) {
      const search = `'🌊'${key}`;
      if (content.includes(search)) {
          content = content.split(search).join(`'${val}'`);
          changed = true;
      }
      
      // Also check without quotes if it's inside JSX text
      const jsxSearch = `🌊${key}`;
      if (content.includes(jsxSearch)) {
          content = content.split(jsxSearch).join(val);
          changed = true;
      }
  }
  
  // Fix specifically the => in HouseScreen
  if (filePath.includes('HouseScreen.jsx')) {
      if (content.includes('=> Requer')) {
          content = content.replace('=> Requer', '🐾 Requer');
          changed = true;
      }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Global icon fix applied to ${filePath}`);
  }
});

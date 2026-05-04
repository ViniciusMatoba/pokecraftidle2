const fs = require('fs');
const path = require('path');

const PATTERNS = [
    { m: 'Ã ', c: 'à' },
    { m: 'Ã¡', c: 'á' },
    { m: 'Ã©', c: 'é' },
    { m: 'Ã³', c: 'ó' },
    { m: 'Ãº', c: 'ú' },
    { m: 'Ã§', c: 'ç' },
    { m: 'Ã£', c: 'ã' },
    { m: 'Ãª', c: 'ê' },
    { m: 'Ã¬', c: 'ì' },
    { m: 'Ã\x81', c: 'Á' },
    { m: 'Ã\x93', c: 'Ó' },
    { m: 'Ã\x89', c: 'É' },
    { m: 'Ã\x8a', c: 'Ê' },
    { m: 'Ã\x87', c: 'Ç' },
    { m: 'Ã\x83', c: 'Ã' },
    { m: 'nÃ\xadvel', c: 'nível' },
    { m: 'NÃ\xadvel', c: 'Nível' },
    { m: 'Ã\x94tima', c: 'Ótima' },
    { m: 'bÃ´nus', c: 'bônus' },
    { m: 'Ã gua', c: 'Água' },
    { m: 'Ã\x93tima', c: 'Ótima' },
    { m: 'Ã\x81gua', c: 'Água' },
    { m: 'â\x80\x94', c: '—' },
    { m: 'â\x80\x93', c: '–' },
    { m: 'â\x80¢', c: '•' },
    { m: 'â\x9c\x94', c: '✔' },
    { m: 'â\x9a\xa0', c: '⚠️' }
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
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const p of PATTERNS) {
    if (content.includes(p.m)) {
      content = content.split(p.m).join(p.c);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Surgical Repaired: ${filePath}`);
  }
});

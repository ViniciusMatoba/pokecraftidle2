const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    { m: 'íÂ gua', c: 'Água' },
    { m: 'íÂ°Ã…Â¸Ã‚Â Ã‚Â¥', c: '🥩' },
    { m: 'í°Å¸Â Âª', c: '🧪' },
    { m: 'í°Å¸â€ Â¨', c: '🔥' },
    { m: 'íÃ‚Â GUA', c: 'ÁGUA' },
    { m: 'píÃ‚Â¢ntanos', c: 'pântanos' },
    { m: 'PSíÃ‚Â QUICO', c: 'PSÍQUICO' },
    { m: 'MansíÃ‚Âµes', c: 'Mansões' },
    { m: 'DRAGíO', c: 'DRAGÃO' },
    { m: 'AíÂ‡O', c: 'AÇO' },
    { m: 'ââ€ Â', c: '➔' },
    { m: 'âÅ“•', c: '✖' },
    { m: 'ââ€ â‚¬', c: '-' },
    { m: 'í°Å¸Å½Â', c: '🎁' },
    { m: 'íÂ°Ã…', c: '🍖' },
    { m: 'íÂ ', c: 'Á' }
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
  let content = fs.readFileSync(filePath, 'latin1');
  let changed = false;
  for (const r of REPLACEMENTS) {
    if (content.includes(r.m)) {
      content = content.split(r.m).join(r.c);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Latin1 Sanitized: ${filePath}`);
  }
});

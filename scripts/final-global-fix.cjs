const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    { m: '<R ', c: '🍒 ' },
    { m: '<0 ', c: '🌰 ' },
    { m: '<1 ', c: '🌱 ' },
    { m: '=> ', c: '🐾 ' },
    { m: '= ',  c: '🔊 ' },
    { m: '=.',  c: '🟡' },
    { m: '=0',  c: '🔴' },
    { m: '=5',  c: '💀' },
    { m: '=%',  c: '🔥' },
    { m: '={',  c: '👻' },
    { m: 'D ',  c: '❄️ ' },
    { m: 'Â½íÂ¸Â', c: '🙏' },
    { m: 'Âª ', c: '🏪 ' },
    { m: 'íÂ°Ã…Â¸Ã‚Â Ã‚Â¥', c: '🥩' },
    { m: 'í°Å¸Â Â½', c: '🍴' },
    { m: 'ââ€ Â', c: '➔' },
    { m: 'âÅ“•', c: '✖' },
    { m: 'âš”ï¸ íÂ¸Â', c: '⚔️' },
    { m: 'íÂ gua', c: 'Água' },
    { m: 'íÃ‚Â GUA', c: 'ÁGUA' }
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
  for (const r of REPLACEMENTS) {
    if (content.includes(r.m)) {
      content = content.split(r.m).join(r.c);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Final Global Fix: ${filePath}`);
  }
});

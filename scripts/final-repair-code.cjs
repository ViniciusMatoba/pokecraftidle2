const fs = require('fs');
const path = require('path');

const REPAIR_MAP = [
    { m: '🔊 ', c: '= ' },
    { m: '🐾 ', c: '=> ' },
    { m: '👻', c: '={' }
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
  for (const r of REPAIR_MAP) {
    if (content.includes(r.m)) {
      content = content.split(r.m).join(r.c);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Repaired Code Token: ${filePath}`);
  }
});

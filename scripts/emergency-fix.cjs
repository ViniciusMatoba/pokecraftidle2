const fs = require('fs');
const path = require('path');

const BROKEN_PATTERNS = [
    { m: 'placeholder=""""""""""', c: 'placeholder="Senha"' },
    { m: "icon: '<", c: "icon: '🌊'" }, // Ocean icon?
    { m: '<p className="text-3xl"><1</p>', c: '<p className="text-3xl">🌱</p>' },
    { m: "stamina > 60 ? '=", c: "stamina > 60 ? '🟢'" },
    { m: '{use.cost} <l</p>', c: '{use.cost} 🍬</p>' }
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
  for (const p of BROKEN_PATTERNS) {
    if (content.includes(p.m)) {
      content = content.split(p.m).join(p.c);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Emergency Fix: ${filePath}`);
  }
});

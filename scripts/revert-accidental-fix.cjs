const fs = require('fs');
const path = require('path');

const REVERT_PATTERNS = [
    { m: '🔊 [', c: '= [' },
    { m: 'style👻', c: 'style={' },
    { m: 'key👻', c: 'key={' },
    { m: 'src👻', c: 'src={' },
    { m: 'i) 🐾 (', c: 'i) => (' },
    { m: 'i) 🐾 {', c: 'i) => {' },
    { m: 'p 🐾 {', c: 'p => {' },
    { m: 'e 🐾 {', c: 'e => {' },
    { m: 'id 🐾 {', c: 'id => {' },
    { m: 'idx 🐾 {', c: 'idx => {' },
    { m: 'use 🐾 {', c: 'use => {' },
    { m: 'm 🐾 {', c: 'm => {' },
    { m: 's 🐾 (', c: 's => (' },
    { m: 'm 🐾 (', c: 'm => (' },
    { m: 'p 🐾 (', c: 'p => (' },
    { m: 'prev 🐾 ({', c: 'prev => ({' },
    { m: 'prev 🐾 {', c: 'prev => {' },
    { m: 'p) 🐾 {', c: 'p) => {' },
    { m: 'i) 🐾 p', c: 'i) => p' },
    { m: '(b, i) 🐾', c: '(b, i) =>' },
    { m: '(p, i) 🐾', c: '(p, i) =>' },
    { m: '(c, i) 🐾', c: '(c, i) =>' }
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
  for (const r of REVERT_PATTERNS) {
    if (content.includes(r.m)) {
      content = content.split(r.m).join(r.c);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Reverted Accidental Fix: ${filePath}`);
  }
});

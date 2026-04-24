const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    { mangled: Buffer.from('c3b0c29fc294c287', 'hex'), correct: Buffer.from('🔇', 'utf8') },
    { mangled: Buffer.from('c3b0c29fc294c28a', 'hex'), correct: Buffer.from('🔊', 'utf8') },
    { mangled: Buffer.from('c3a2c280c2a2', 'hex'), correct: Buffer.from('•', 'utf8') },
    { mangled: Buffer.from('c3a2c296c2b6', 'hex'), correct: Buffer.from('▶', 'utf8') },
    { mangled: Buffer.from('c3adc289', 'hex'), correct: Buffer.from('É', 'utf8') },
    { mangled: Buffer.from('c3adc2ad', 'hex'), correct: Buffer.from('í', 'utf8') },
    { mangled: Buffer.from('c3a2c5a1e2809d', 'hex'), correct: Buffer.from('⚔️', 'utf8') },
    { mangled: Buffer.from('c3a2c29ab2', 'hex'), correct: Buffer.from('⚔️', 'utf8') },
    { mangled: Buffer.from('c3b0c5b8c2a0c2a2', 'hex'), correct: Buffer.from('🏢', 'utf8') }
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
  let content = fs.readFileSync(filePath);
  let changed = false;
  
  for (const rep of REPLACEMENTS) {
    let index = content.indexOf(rep.mangled);
    while (index !== -1) {
        changed = true;
        content = Buffer.concat([
            content.slice(0, index),
            rep.correct,
            content.slice(index + rep.mangled.length)
        ]);
        index = content.indexOf(rep.mangled, index + rep.correct.length);
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed Bytes: ${filePath}`);
  }
});

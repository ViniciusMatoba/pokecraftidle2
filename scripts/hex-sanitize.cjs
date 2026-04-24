const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    { hex: 'c3adc38220677561', c: 'Água' },
    { hex: 'c3adc2b0c385c2b8c383c285c382c2b8c383c282c382c2a5', c: '🥩' },
    { hex: 'c3adc2b0c385c2b8c382c2a2', c: '🧪' },
    { hex: 'c3adc2b0c385c2b8c3a2c280c29d', c: '🔥' },
    { hex: 'c3adc382c2a26e69636173', c: 'ânicas' },
    { hex: 'c3adc382c2a26e74616e6f73', c: 'ântanos' },
    { hex: 'c383c3a2c382c280c2a2', c: '-' },
    { hex: 'c3adc2b0c385c2b8c383c282c382c2bdc3adc2afc382c2b8c382c28f', c: '🏘️' }
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
  let content = fs.readFileSync(filePath);
  let changed = false;
  for (const r of REPLACEMENTS) {
    const mangled = Buffer.from(r.hex, 'hex');
    const correct = Buffer.from(r.c, 'utf8');
    let index = content.indexOf(mangled);
    while (index !== -1) {
        content = Buffer.concat([content.slice(0, index), correct, content.slice(index + mangled.length)]);
        changed = true;
        index = content.indexOf(mangled, index + correct.length);
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Hex Sanitized: ${filePath}`);
  }
});

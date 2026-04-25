const fs = require('fs');
const path = require('path');

function recoverString(str) {
    let current = str;
    for (let i = 0; i < 3; i++) {
        if (!/[Ãâíìð]/.test(current)) break;
        try {
            let bytes = Buffer.from(current, 'latin1');
            let decoded = bytes.toString('utf8');
            if (decoded.includes('\uFFFD') || decoded === current) break;
            current = decoded;
        } catch (e) { break; }
    }
    return current;
}

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
  let lines = content.split('\n');
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    let fixed = recoverString(lines[i]);
    if (fixed !== lines[i]) {
      lines[i] = fixed;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`Line Repaired: ${filePath}`);
  }
});

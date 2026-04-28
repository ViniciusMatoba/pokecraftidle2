const fs = require('fs');
const path = require('path');

function isMangled(str) {
    // If it contains characters that are common in double/triple mangling
    // like â, €, °, ©, etc.
    return /[âÃíìðŸ]/.test(str);
}

function recoverString(str) {
    let current = str;
    let iterations = 0;
    while (isMangled(current) && iterations < 5) {
        try {
            // Convert current string to Latin1 bytes and interpret as UTF-8
            let bytes = Buffer.from(current, 'latin1');
            let decoded = bytes.toString('utf8');
            
            // If decoding produced replacement characters, stop
            if (decoded.includes('\uFFFD')) break;
            
            // If it didn't change, stop
            if (decoded === current) break;
            
            current = decoded;
            iterations++;
        } catch (e) {
            break;
        }
    }
    return current;
}

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
  // Read the file as UTF-8 (which is currently mangled)
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  let changed = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (isMangled(lines[i])) {
        let fixed = recoverString(lines[i]);
        if (fixed !== lines[i]) {
            lines[i] = fixed;
            changed = true;
        }
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`Recursively Repaired: ${filePath}`);
  }
});

console.log('Recursive recovery pass complete.');

const fs = require('fs');
const path = require('path');

function recoverBuffer(buffer) {
    let current = buffer;
    // Round 1: Fix Double Encoding
    try {
        let str = current.toString('utf8');
        // If it looks mangled
        if (/[Ãâíìð]/.test(str)) {
            let recovered = Buffer.from(str, 'latin1');
            let test = recovered.toString('utf8');
            // If test is valid and changed
            if (!test.includes('\uFFFD') && test !== str) {
                current = recovered;
            }
        }
    } catch (e) {}
    
    // Round 2: Fix Triple Encoding (if needed)
    try {
        let str = current.toString('utf8');
        if (/[Ãâíìð]/.test(str)) {
            let recovered = Buffer.from(str, 'latin1');
            let test = recovered.toString('utf8');
            if (!test.includes('\uFFFD') && test !== str) {
                current = recovered;
            }
        }
    } catch (e) {}

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
  let original = fs.readFileSync(filePath);
  let fixed = recoverBuffer(original);
  if (!original.equals(fixed)) {
    fs.writeFileSync(filePath, fixed);
    console.log(`Final Master Repaired: ${filePath}`);
  }
});

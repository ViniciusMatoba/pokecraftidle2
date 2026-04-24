const fs = require('fs');
const path = require('path');

function recoverBuffer(buffer) {
    let current = buffer;
    let changed = false;
    
    // Attempt up to 3 rounds of recovery
    for (let round = 0; round < 3; round++) {
        try {
            // Interpret current bytes as UTF-8 string
            const str = current.toString('utf8');
            
            // If the string contains common mangled patterns
            if (/[âÃíìðŸ]/.test(str)) {
                // Convert string back to bytes using Latin1 (ISO-8859-1)
                const recovered = Buffer.from(str, 'latin1');
                
                // If the recovered bytes can be validly decoded as UTF-8
                const testStr = recovered.toString('utf8');
                if (!testStr.includes('\uFFFD') && testStr !== str) {
                    current = recovered;
                    changed = true;
                    continue; 
                }
            }
        } catch (e) {}
        break;
    }
    return { buffer: current, changed };
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
  const original = fs.readFileSync(filePath);
  const result = recoverBuffer(original);
  
  if (result.changed) {
    fs.writeFileSync(filePath, result.buffer);
    console.log(`Buffer Recovered: ${filePath}`);
  }
});

console.log('Buffer recovery pass complete.');

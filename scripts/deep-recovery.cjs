const fs = require('fs');
const path = require('path');

function fixMangledBuffer(buffer) {
    try {
        // Step 1: Decode the current (mangled) buffer as UTF-8
        const str = buffer.toString('utf8');
        // Step 2: Convert that string into a buffer using Latin1 (ISO-8859-1)
        // This effectively recovers the original UTF-8 bytes
        const recoveredBytes = Buffer.from(str, 'latin1');
        // Step 3: Decode the recovered bytes as UTF-8
        const finalStr = recoveredBytes.toString('utf8');
        
        // Safety check: if the final string has many replacement characters, it might have failed
        if (finalStr.includes('\uFFFD') && !str.includes('\uFFFD')) {
            return buffer; // Return original if it seems worse
        }
        
        return Buffer.from(finalStr, 'utf8');
    } catch (e) {
        return buffer;
    }
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
      if (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.css')) {
        callback(path.join(dir, f));
      }
    }
  });
}

const targetDir = path.join(__dirname, '..', 'src');

walkDir(targetDir, (filePath) => {
  const originalBuffer = fs.readFileSync(filePath);
  const fixedBuffer = fixMangledBuffer(originalBuffer);
  
  if (!originalBuffer.equals(fixedBuffer)) {
    fs.writeFileSync(filePath, fixedBuffer);
    console.log(`Deep Repaired: ${filePath}`);
  }
});

console.log('Deep recovery pass complete.');

/**
 * scripts/remove-original-pngs.cjs
 * Remove PNGs originais após confirmar que o WebP correspondente existe.
 * Execute APENAS após testar que o jogo funciona com WebP.
 * Uso: node scripts/remove-original-pngs.cjs
 */

const fs   = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const KEEP = new Set(['icon-192.png', 'icon-512.png']); // ícones PWA mantidos

function removeDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let removed = 0;
  let freed   = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = removeDir(fullPath);
      removed += sub.removed;
      freed   += sub.freed;
      continue;
    }
    if (!entry.name.endsWith('.png')) continue;
    if (KEEP.has(entry.name)) continue;

    const webpPath = fullPath.replace(/\.png$/, '.webp');
    if (!fs.existsSync(webpPath)) {
      console.log(`⚠️  Sem WebP par — mantendo: ${entry.name}`);
      continue;
    }

    const size = fs.statSync(fullPath).size;
    fs.unlinkSync(fullPath);
    freed   += size;
    removed++;
    console.log(`🗑  Removido: ${entry.name} (${(size/1024/1024).toFixed(2)}MB)`);
  }

  return { removed, freed };
}

console.log('🗑  Removendo PNGs com WebP correspondente...\n');
const { removed, freed } = removeDir(PUBLIC_DIR);
console.log(`\n✅ ${removed} PNGs removidos — ${(freed/1024/1024).toFixed(1)} MB liberados`);

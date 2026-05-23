/**
 * scripts/convert-to-webp.cjs
 * Converte todas as PNGs de /public para WebP (qualidade 82)
 * Mantém as PNGs originais como fallback por segurança
 * Uso: node scripts/convert-to-webp.cjs
 */

const sharp   = require('sharp');
const fs      = require('fs');
const path    = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const QUALITY    = 82;

// Pastas/arquivos a ignorar (já são PNG otimizados de ícone ou não são backgrounds)
const IGNORE = new Set(['icon-192.png', 'icon-512.png']);

async function convertDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let converted = 0;
  let skipped   = 0;
  let totalSaved = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const sub = await convertDir(fullPath);
      converted  += sub.converted;
      skipped    += sub.skipped;
      totalSaved += sub.totalSaved;
      continue;
    }

    if (!entry.name.endsWith('.png')) continue;
    if (IGNORE.has(entry.name)) { skipped++; continue; }

    const webpPath = fullPath.replace(/\.png$/, '.webp');

    // Pula se o WebP já existe e é mais recente
    if (fs.existsSync(webpPath)) {
      const pngStat  = fs.statSync(fullPath);
      const webpStat = fs.statSync(webpPath);
      if (webpStat.mtimeMs >= pngStat.mtimeMs) { skipped++; continue; }
    }

    try {
      await sharp(fullPath)
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(webpPath);

      const pngSize  = fs.statSync(fullPath).size;
      const webpSize = fs.statSync(webpPath).size;
      const saved    = pngSize - webpSize;
      totalSaved    += saved;
      converted++;

      const ratio = ((1 - webpSize / pngSize) * 100).toFixed(1);
      console.log(`✅ ${entry.name.padEnd(55)} ${(pngSize/1024/1024).toFixed(2)}MB → ${(webpSize/1024/1024).toFixed(2)}MB  (-${ratio}%)`);
    } catch (err) {
      console.error(`❌ Erro em ${entry.name}: ${err.message}`);
      skipped++;
    }
  }

  return { converted, skipped, totalSaved };
}

(async () => {
  console.log('🔄 Iniciando conversão PNG → WebP...\n');
  const start = Date.now();
  const { converted, skipped, totalSaved } = await convertDir(PUBLIC_DIR);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log('\n─────────────────────────────────────────────────────');
  console.log(`✅ Convertidos : ${converted} imagens`);
  console.log(`⏭  Pulados     : ${skipped} imagens`);
  console.log(`💾 Espaço salvo: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);
  console.log(`⏱  Tempo       : ${elapsed}s`);
  console.log('─────────────────────────────────────────────────────');
  console.log('\n⚠️  As PNGs originais foram mantidas como fallback.');
  console.log('   Para remover (opcional): node scripts/remove-original-pngs.cjs');
})();

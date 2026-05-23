/**
 * scripts/update-png-refs.cjs
 * Substitui referências locais .png → .webp em src/
 * Preserva: URLs externas, ícones PWA, imagens PokeAPI
 */

const fs   = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

// Strings que NÃO devem ser alteradas (substrings de contexto)
const PRESERVE_PATTERNS = [
  'icon-192.png',
  'icon-512.png',
  'favicon.png',
  'http://',
  'https://',
  'pokeapi.co',
  'pokemonshowdown.com',
  'transparenttextures.com',
  'googleapis.com',
  'up-grade.png',
  'kings-rock.png',
];

function shouldPreserveLine(line) {
  return PRESERVE_PATTERNS.some(p => line.includes(p));
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let changed = 0;

  const newLines = lines.map(line => {
    if (shouldPreserveLine(line)) return line;
    // Substitui .png por .webp apenas quando seguido de ' " ) (encerra referência local)
    const newLine = line.replace(/\.png(?=['")\/\s])/g, '.webp');
    if (newLine !== line) changed++;
    return newLine;
  });

  if (changed > 0) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log(`✅ ${path.relative(process.cwd(), filePath).padEnd(60)} ${changed} substituição(ões)`);
  }
  return changed;
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let total = 0;
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += walkDir(full);
    } else if (/\.(js|jsx|ts|tsx|css)$/.test(entry.name)) {
      total += processFile(full);
    }
  }
  return total;
}

console.log('🔄 Atualizando referências .png → .webp em src/\n');
const total = walkDir(SRC_DIR);
console.log(`\n✅ ${total} linha(s) atualizadas em src/`);

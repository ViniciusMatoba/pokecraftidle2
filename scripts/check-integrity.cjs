// Execute: node scripts/check-integrity.cjs
// Verifica se blocos críticos foram alterados acidentalmente

const fs = require('fs');
const crypto = require('crypto');

const content = fs.readFileSync('./src/AppRoot.jsx', 'utf8');

// Extrair blocos críticos para verificação
const extractBlock = (start, length = 200, file = null) => {
  const src = file ? fs.readFileSync(file, 'utf8') : content;
  const idx = src.indexOf(start);
  if (idx === -1) return null;
  return src.slice(idx, idx + length);
};

const blocks = [
  { name: 'handleBattleTick',         marker: 'const handleBattleTick = useCallback' },
  { name: 'spawnEnemy',               marker: 'const spawnEnemy = useCallback' },
  { name: 'Shiny 1/4096',             marker: 'Math.floor(Math.random() * 4096) === 0' },
  { name: 'XP divisor',               marker: 'const baseXpGain = Math.floor' }, // Adjusted to Math.floor based on file content
  { name: 'FEED_THRESHOLD',           marker: 'const FEED_THRESHOLD' },
  { name: 'handleGoToCity',           marker: 'const handleGoToCity = useCallback' },
  { name: 'handleStartExpedition',    marker: 'const handleStartExpedition = useCallback' },
  { name: 'handleBuyHouse',           marker: 'const handleBuyHouse = useCallback' },
  { name: 'handleUseCandy',           marker: 'const handleUseCandy = useCallback' },
  { name: 'manualChunks',             file: './vite.config.js', marker: 'manualChunks(id)' },
  { name: 'currentView guard spawn',  marker: "currentView !== 'battles'" },
  { name: 'Intro Dialogue',           marker: '⛔ PROTECTED: Balão de Diálogo Intro' },
  { name: 'intro_dialog_bottom',  marker: "borderRadius: '24px 24px 0 0'" },
  { name: 'intro_proximo_button', marker: "letterSpacing: '2px'" },
  { name: 'starter_modal_close_btn',   marker: "backdropFilter: 'blur(4px)'" },
  { name: 'starter_modal_choose_btn',  marker: 'EU ESCOLHO VOCE!' },
  { name: 'starter_modal_padding',     marker: "'20px 24px 28px 24px'" },
];

const HASH_FILE = './scripts/.integrity-hashes.json';
let savedHashes = {};

try {
  savedHashes = JSON.parse(fs.readFileSync(HASH_FILE, 'utf8'));
} catch {
  // Primeira execução — salvar hashes
}

const currentHashes = {};
const issues = [];
const firstRun = Object.keys(savedHashes).length === 0;

blocks.forEach((b) => {
  const { name, marker } = b;
  const block = extractBlock(marker, 200, b.file || null);
  if (!block) {
    issues.push({ name, status: 'MISSING', msg: `❌ BLOCO NÃO ENCONTRADO: ${name} (${marker}) — pode ter sido deletado!` });
    return;
  }
  const hash = crypto.createHash('md5').update(block).digest('hex');
  currentHashes[name] = hash;

  if (!firstRun && savedHashes[name] && savedHashes[name] !== hash) {
    issues.push({ name, status: 'CHANGED', msg: `⚠️  ALTERADO: ${name}` });
  }
});

if (firstRun) {
  fs.writeFileSync(HASH_FILE, JSON.stringify(currentHashes, null, 2));
  console.log('✅ Hashes iniciais salvos. Execute novamente após cada alteração autorizada.');
  process.exit(0);
}

console.log('\n🔍 Verificando integridade dos blocos críticos...\n');

if (process.argv.includes('--update')) {
  fs.writeFileSync(HASH_FILE, JSON.stringify(currentHashes, null, 2));
  console.log('✅ Hashes atualizados.\n');
  process.exit(0);
}

if (issues.length === 0) {
  console.log('✅ Todos os blocos críticos estão intactos.\n');
} else {
  console.log(`🔴 PROBLEMAS ENCONTRADOS (${issues.length}):\n`);
  issues.forEach(i => console.log(`  ${i.msg}`));
  console.log('\nSe as alterações foram autorizadas, rode:');
  console.log('  node scripts/check-integrity.cjs --update\n');
  process.exit(1);
}

#!/usr/bin/env node
/**
 * release.cjs — Script de release completo do PokéCraft Idle
 *
 * Fluxo:
 *   1. Lê versão atual do package.json
 *   2. Sincroniza com origin/main (stash → pull → pop, resolvendo conflitos de versão)
 *   3. Faz commit de todas as alterações com mensagem versionada
 *   4. Push para origin/main
 *   5. Build + deploy para GitHub Pages (gh-pages)
 *
 * Uso:
 *   npm run release
 *   npm run release -- "Mensagem personalizada opcional"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { cwd: ROOT, stdio: opts.silent ? 'pipe' : 'inherit', encoding: 'utf8' });
  } catch (err) {
    if (opts.allowFail) return null;
    console.error(`\n❌ Falha ao executar: ${cmd}`);
    process.exit(1);
  }
}

function runCapture(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

// ─── Lê versão ───────────────────────────────────────────────────────────────
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const version = pkg.version;
const customMsg = process.argv[2] || '';

console.log(`\n🚀 release v${version}${customMsg ? ` — ${customMsg}` : ''}\n`);

// ─── Verifica se há conflitos ativos ─────────────────────────────────────────
const conflicts = runCapture('git diff --name-only --diff-filter=U');
if (conflicts) {
  console.error('❌ Há conflitos não resolvidos:\n' + conflicts);
  process.exit(1);
}

// ─── Verifica se há algo para commitar ───────────────────────────────────────
const status = runCapture('git status --porcelain');
const hasChanges = status.length > 0;

if (hasChanges) {
  // ─── Stash das alterações locais ───────────────────────────────────────────
  console.log('📦 Guardando alterações locais (stash)...');
  run('git stash push -u -m "release-auto-stash"');

  // ─── Pull do origin/main ──────────────────────────────────────────────────
  console.log('⬇️  Sincronizando com origin/main...');
  const pullResult = runCapture('git pull origin main');
  console.log(pullResult || '(já atualizado)');

  // ─── Pop do stash (pode gerar conflitos de versão) ───────────────────────
  console.log('📤 Restaurando alterações...');
  const popOut = runCapture('git stash pop 2>&1');

  // ─── Resolve automaticamente conflitos nos arquivos de versão ────────────
  const versionFiles = [
    'package.json',
    'package-lock.json',
    'public/sw.js',
    'public/version.json',
    'src/constants/version.js',
  ];

  let hadConflicts = false;
  for (const relPath of versionFiles) {
    const filePath = path.join(ROOT, relPath);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('<<<<<<<')) continue;

    hadConflicts = true;
    console.log(`🔧 Resolvendo conflito em ${relPath} (mantendo stash = v${version})...`);

    // Resolve mantendo o bloco "Stashed changes" (nossa versão mais recente)
    const lines = content.split('\n');
    const resolved = [];
    let skipUpstream = false;

    for (const line of lines) {
      if (line.startsWith('<<<<<<< Updated upstream')) { skipUpstream = true; continue; }
      if (line.startsWith('=======') && skipUpstream) { skipUpstream = false; continue; }
      if (line.startsWith('>>>>>>> Stashed changes')) { continue; }
      if (!skipUpstream) resolved.push(line);
    }

    fs.writeFileSync(filePath, resolved.join('\n'), 'utf8');
  }

  if (hadConflicts) {
    console.log('✅ Conflitos de versão resolvidos automaticamente.');
  }

  if (popOut && popOut.includes('CONFLICT') && !hadConflicts) {
    console.error('❌ Conflitos não esperados após stash pop — resolva manualmente e rode novamente.');
    console.error(popOut);
    process.exit(1);
  }
}

// ─── Stage de todos os arquivos modificados e novos ──────────────────────────
console.log('\n📋 Preparando arquivos para commit...');
run('git add -A');

// Verifica se há algo staged
const staged = runCapture('git diff --cached --name-only');
if (!staged) {
  console.log('ℹ️  Nada a commitar — repositório já está atualizado.');
} else {
  // ─── Commit ────────────────────────────────────────────────────────────────
  const commitTitle = customMsg
    ? `release: v${version} — ${customMsg}`
    : `release: v${version}`;

  const commitBody = [
    '',
    `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`,
  ].join('\n');

  console.log(`\n📝 Commitando: "${commitTitle}"`);

  // Escreve mensagem em arquivo temporário para evitar problemas de escaping
  const msgFile = path.join(ROOT, '.git', '_release_msg.txt');
  fs.writeFileSync(msgFile, commitTitle + commitBody, 'utf8');
  run(`git commit -F "${msgFile}"`);
  fs.unlinkSync(msgFile);

  // ─── Push para main ────────────────────────────────────────────────────────
  console.log('\n⬆️  Enviando para origin/main...');
  run('git push origin main');
}

// ─── Build + Deploy (gh-pages) ────────────────────────────────────────────────
console.log('\n🏗️  Build + Deploy para GitHub Pages...');
run('npm run build');
run(`node node_modules/gh-pages/bin/gh-pages.js -d dist`);

// ─── Deploy para Firebase (Firestore Rules + Hosting) ────────────────────────
console.log('\n🔒 Deploy para Firebase (Firestore Rules + Hosting)...');
run('firebase deploy --only firestore:rules,hosting --project pokemon-munchikin', { allowFail: true });

// Limpa stash residual se tudo deu certo
runCapture('git stash drop 2>/dev/null || true');

console.log(`\n✅ Release v${version} concluído com sucesso!\n`);

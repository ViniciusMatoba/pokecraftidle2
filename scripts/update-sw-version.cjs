/**
 * update-sw-version.cjs
 * Sincroniza o CACHE_NAME do sw.js com a versão atual de public/version.json.
 * Executado automaticamente no prebuild (antes de todo `npm run build`).
 *
 * Por que isso é necessário:
 * O browser só instala um novo Service Worker se o arquivo sw.js mudar
 * byte a byte. Se o CACHE_NAME ficar desatualizado, o SW antigo continua
 * rodando e serve o bundle JS em cache — o jogador vê a versão antiga
 * mesmo após um deploy.
 */

const fs = require('fs');
const path = require('path');

const versionFile = path.resolve(__dirname, '../public/version.json');
const swFile      = path.resolve(__dirname, '../public/sw.js');

const { version } = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
const newCacheName = `pokecraft-cache-v${version}`;

let swContent = fs.readFileSync(swFile, 'utf8');

const updated = swContent.replace(
  /let CACHE_NAME = 'pokecraft-cache-v[^']+';/,
  `let CACHE_NAME = '${newCacheName}';`
);

if (updated === swContent) {
  console.log(`[sw] CACHE_NAME já está em ${newCacheName} — sem alteração.`);
} else {
  fs.writeFileSync(swFile, updated, 'utf8');
  console.log(`[sw] CACHE_NAME atualizado para ${newCacheName}`);
}

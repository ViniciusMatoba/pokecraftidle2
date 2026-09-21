// === Importador de pacote de sprites (pessoal) ===
// Copia as TIRAS de animação do Pokémon Indigo pra public/sprites/local/ (base
// front/back por id) e public/sprites/local/mega/ (megas por megaShowdownId),
// mapeando nomes pela POKEDEX e as megas pelo PBS/pokemon_forms.txt do Indigo.
// Reescreve src/data/spritePack.js com os registros. Só copia arquivos — nenhuma
// arte é gerada aqui.
//
// Uso (no terminal, dentro da pasta pokecraftidle2):
//   node tools/import-indigo-sprites.mjs
//   node tools/import-indigo-sprites.mjs "C:\\caminho\\para\\Graphics\\Pokemon\\Front"

import { POKEDEX } from '../src/data/pokedex.js';
import { MEGA_EVOLUTION_MAP } from '../src/data/megaEvolutions.js';
import { execSync } from 'node:child_process';
import { readdirSync, mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import os from 'node:os';

// 1) Localiza a pasta Front do Indigo (arg, ou descompacta o zip do Desktop).
let frontDir = process.argv[2];
if (!frontDir) {
  const tmp = join(os.tmpdir(), 'pic-indigo');
  const extracted = join(tmp, 'Pokemon Indigo 4.0.2 EN-6');
  if (!existsSync(extracted)) {
    const zip = join(os.homedir(), 'Desktop', 'Pokemon Indigo 4.0.2.zip');
    if (!existsSync(zip)) { console.error('Nao achei o zip em ' + zip + '. Passe o caminho da pasta Front como argumento.'); process.exit(1); }
    console.log('Descompactando o Indigo (pode demorar um pouco)...');
    execSync(`powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zip}' -DestinationPath '${tmp}' -Force"`, { stdio: 'inherit' });
  }
  frontDir = join(extracted, 'Graphics', 'Pokemon', 'Front');
}
if (!existsSync(frontDir)) { console.error('Pasta Front nao encontrada: ' + frontDir); process.exit(1); }
const backDir = join(frontDir, '..', 'Back'); // .../Pokemon/Back

// Normaliza nomes pra casar apesar de hifens/apostrofos/simbolos:
//   "Nidoran-f" -> "NIDORANF", Indigo "NIDORAN_F" -> "NIDORANF"; "Ho-oh" -> "HOOH"
const norm = (s) => String(s).toUpperCase()
  .replace(/♀/g, 'F').replace(/♂/g, 'M')
  .replace(/[^A-Z0-9]/g, '');

// 2) Mapa NOME(normalizado) -> id, a partir da POKEDEX do jogo.
const nameToId = {};
for (const k in POKEDEX) {
  const p = POKEDEX[k];
  if (p && p.name) nameToId[norm(p.name)] = p.id;
}
// Fallback: forma-padrao cujo nome tem sufixo (Deoxys-normal, Giratina-altered...)
// mas o Indigo guarda como nome simples (DEOXYS). So mapeia se o nome-base for
// UNICO entre as especies base (evita ambiguidade tipo Nidoran-f / Nidoran-m).
const baseCount = {};
for (const p of Object.values(POKEDEX)) {
  if (p && p.id < 10000 && p.name && p.name.includes('-')) {
    const b = norm(p.name.split('-')[0]);
    baseCount[b] = (baseCount[b] || 0) + 1;
  }
}
for (const p of Object.values(POKEDEX)) {
  if (p && p.id < 10000 && p.name && p.name.includes('-')) {
    const b = norm(p.name.split('-')[0]);
    if (baseCount[b] === 1 && !(b in nameToId)) nameToId[b] = p.id;
  }
}

// 3) Processa uma pasta (Front ou Back): copia a TIRA INTEIRA (animacao) de cada
//    arquivo que casa com um Pokemon, como <id>.png em outDir. Retorna os ids.
//    Variantes/formas (PIKACHU_2, MEOWTH_ALOLA...) nao batem no mapa -> ignoradas.
function importFolder(srcDir, outDir) {
  if (!existsSync(srcDir)) return { ids: [], ignored: [] };
  mkdirSync(outDir, { recursive: true });
  const files = readdirSync(srcDir).filter((f) => f.toLowerCase().endsWith('.png'));
  const ids = [], ignored = [];
  for (const f of files) {
    const id = nameToId[norm(f.replace(/\.png$/i, ''))];
    if (!id) { ignored.push(f); continue; }
    try {
      copyFileSync(join(srcDir, f), join(outDir, id + '.png')); // tira inteira, sem recorte
      ids.push(id);
    } catch (e) { console.warn('Falhou em ' + f + ': ' + e.message); }
  }
  ids.sort((a, b) => a - b);
  return { ids, ignored };
}

const localDir = join(process.cwd(), 'public', 'sprites', 'local');
const front = importFolder(frontDir, localDir);
const back = importFolder(backDir, join(localDir, 'back'));

// 3b) Megas: casa cada mega (name = "Mega Charizard X") com o PBS/pokemon_forms.txt
//     do Indigo pra achar o numero da forma (_N) e copia a tira pela megaShowdownId.
function importMegas(outDir) {
  const pbs = join(frontDir, '..', '..', '..', 'PBS', 'pokemon_forms.txt');
  const frontSlugs = [], backSlugs = [];
  if (!existsSync(pbs)) { console.warn('PBS/pokemon_forms.txt nao encontrado — megas puladas.'); return { frontSlugs, backSlugs }; }
  const formByName = {}; // norm(FormName) -> { species, n }
  let curSpecies = null;
  for (const raw of readFileSync(pbs, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    const h = line.match(/^\[([^,\]]+),(\d+)\]$/);
    if (h) { curSpecies = { species: h[1], n: h[2] }; continue; }
    const fn = line.match(/^FormName\s*=\s*(.+)$/i);
    if (fn && curSpecies) formByName[norm(fn[1])] = { ...curSpecies };
  }
  const megaFrontDir = join(outDir, 'mega');
  const megaBackDir = join(outDir, 'mega', 'back');
  mkdirSync(megaFrontDir, { recursive: true });
  mkdirSync(megaBackDir, { recursive: true });
  for (const stone in MEGA_EVOLUTION_MAP) {
    const mega = MEGA_EVOLUTION_MAP[stone];
    if (!mega || !mega.showdownId || !mega.name) continue;
    // Match exato; fallback: mega "simples" -> variante X/Y do Indigo (ex.: o
    // Indigo guarda "Mega Venusaur X" em vez de "Mega Venusaur"). Correcao futura.
    const form = formByName[norm(mega.name)]
      || formByName[norm(mega.name + ' X')]
      || formByName[norm(mega.name + ' Y')];
    if (!form) continue; // Indigo nao tem essa mega (ex.: megas custom de Legends Z-A)
    const file = `${form.species}_${form.n}.png`;
    const fsrc = join(frontDir, file);
    if (existsSync(fsrc)) { copyFileSync(fsrc, join(megaFrontDir, mega.showdownId + '.png')); frontSlugs.push(mega.showdownId); }
    const bsrc = join(backDir, file);
    if (existsSync(bsrc)) { copyFileSync(bsrc, join(megaBackDir, mega.showdownId + '.png')); backSlugs.push(mega.showdownId); }
  }
  return { frontSlugs, backSlugs };
}
const megas = importMegas(localDir);

// 4) Reescreve o registro de ids/slugs locais.
const slugs = (arr) => arr.map((s) => `'${s}'`).join(', ');
writeFileSync(
  join(process.cwd(), 'src', 'data', 'spritePack.js'),
  `// Gerado por tools/import-indigo-sprites.mjs\n` +
  `// Só ids/slugs; as imagens ficam em public/sprites/local/ (fora do git).\n` +
  `export const LOCAL_SPRITE_IDS = new Set([${front.ids.join(', ')}]);\n` +
  `export const LOCAL_BACK_IDS = new Set([${back.ids.join(', ')}]);\n` +
  `export const LOCAL_MEGA_IDS = new Set([${slugs(megas.frontSlugs)}]);\n` +
  `export const LOCAL_MEGA_BACK_IDS = new Set([${slugs(megas.backSlugs)}]);\n`
);

// Relatorio dos ignorados (pra saber o que ficou de fora).
writeFileSync(join(process.cwd(), 'tools', 'ignored-sprites.txt'), front.ignored.join('\n'));

console.log(`\nPronto! Base — frente: ${front.ids.length}, costas: ${back.ids.length}.`);
console.log(`Megas — frente: ${megas.frontSlugs.length}, costas: ${megas.backSlugs.length}.`);
console.log(`Ignorados (frente base): ${front.ignored.length} — lista em tools/ignored-sprites.txt`);
console.log(`spritePack.js atualizado. Recarregue o jogo pra ver na batalha.`);

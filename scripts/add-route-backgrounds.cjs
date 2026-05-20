const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/data/routes.js');
let content = fs.readFileSync(file, 'utf8');

const backgrounds = {
  // Hisui
  hisui_jubilife:     '/bg_jubilife.webp',
  hisui_fieldlands_1: '/bg_hisui_fieldlands.webp',
  hisui_fieldlands_2: '/bg_hisui_fieldlands.webp',
  hisui_mirelands_1:  '/bg_hisui_mirelands.webp',
  hisui_coastlands_1: '/bg_hisui_coastlands.webp',
  hisui_highlands_1:  '/bg_hisui_highlands.webp',
  hisui_icelands_1:   '/bg_hisui_icelands.webp',
  hisui_sacred_plaza: '/bg_hisui_sacred_plaza.webp',
};

let changed = 0;
for (const [routeId, bg] of Object.entries(backgrounds)) {
  const hasBackground = new RegExp(`id:\\s*'${routeId}'[^}]*background:`).test(content);
  if (hasBackground) {
    console.log(`SKIP (already has bg): ${routeId}`);
    continue;
  }

  const idLine = new RegExp(`(id:\\s*'${routeId}'[^\\n]*,)`, 'g');
  const newContent = content.replace(idLine, `$1 background: '${bg}',`);
  if (newContent !== content) {
    content = newContent;
    changed++;
    console.log(`OK: ${routeId} -> ${bg}`);
  } else {
    console.log(`NOT FOUND: ${routeId}`);
  }
}

fs.writeFileSync(file, content, 'utf8');
console.log(`\nDone. ${changed} routes updated.`);

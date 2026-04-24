// Execute com: node scripts/fix-encoding.cjs
// Use APENAS quando textos estiverem corrompidos
const fs = require('fs');
const path = require('path');
const fixes = [
  ['Ã§Ã£o','ção'],['Ã§a','ça'],['Ã£o','ão'],['Ã£','ã'],
  ['Ã§','ç'],['Ã©','é'],['Ã¡','á'],['Ã','í'],
  ['Ã³','ó'],['Ãµ','õ'],['Ãº','ú'],['Ã\xaa','ê'],
  ['Ã\x80','À'],['Ã‰','É'],['Ã‡','Ç'],['Ã"','Ó'],
  ['ðŸ¢','🏢'],['ðŸŽ‰','🎉'],['ðŸ\'¥','💥'],
  ['ðŸ›¡','🛡️'],['âœ¨','✨'],['âœ…','✅'],
  ['â˜ ','☠️'],['âš¡','⚡'],['ðŸ"¥','🔥'],
  ['Å¸Â',''],['Â ',''],['íƒÂ‚í‚Â',''],['í‚Â',''],
  // Adições para cobrir resíduos detectados
  ['íƒ','Ã'], ['í­','í'], ['í‰','É'], ['í“','Ó'], ['íª','ê'], ['íº','ú'], ['í³','ó'],
  ['í±','ñ'], ['í¡','á'], ['í¨','è'], ['í´','ô'],
  ['â”€','─'], ['í¢í¢€','─'], ['í‚¬',''], ['í¯Â¸Â',''],
];
let total = 0;
function fix(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory() && f !== 'node_modules') fix(full);
    else if (f.endsWith('.jsx') || f.endsWith('.js')) {
      let c = fs.readFileSync(full,'utf8'); let changed = false;
      fixes.forEach(([b,g]) => { if(c.includes(b)){c=c.split(b).join(g);changed=true;total++;} });
      if(changed){fs.writeFileSync(full,c,'utf8');console.log('Fixed:',path.basename(full));}
    }
  });
}
fix('./src');
console.log('Total substituições:', total);

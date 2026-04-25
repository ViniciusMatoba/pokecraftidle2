const fs = require('fs');
let c = fs.readFileSync('src/components/ChallengesScreen.jsx', 'utf8');
const fixes = [
  ['Ã§Ã£o','ção'],['Ã£o','ão'],['Ã£','ã'],['Ã§','ç'],
  ['Ã©','é'],['Ã¡','á'],['Ã','í'],['Ã³','ó'],
  ['Ãµ','õ'],['Ãº','ú'],['Ã\xaa','ê'],['Ã‰','É'],
  ['ðŸ\'°','💰'],['âš\"ï¸','⚔️'],['ðŸš€','🚀'],
  ['ðŸ›¡ï¸','🛡️'],['âœ¨','✨'],['âœ…','✅'],
  ['ðŸ†','🏆'],['ðŸŽ¯','🎯'],['ðŸ\"¥','🔥'],
  ['â–¶','▶'],['âœ\"','✓'],
];
let total = 0;
fixes.forEach(([bad,good]) => {
  const count = c.split(bad).length - 1;
  if(count > 0){ c = c.split(bad).join(good); total += count; console.log('Fixed '+count+'x: '+bad+' -> '+good); }
});
fs.writeFileSync('src/components/ChallengesScreen.jsx', c);
console.log('Total: '+total);

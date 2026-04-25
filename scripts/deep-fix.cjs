const fs = require('fs');
const path = require('path');

const fixes = [
  // Emojis complexos e sequências de ícones
  ['Ã¢í‚œí‚¨', '✨'], ['Ã°í‚Ÿí‚’í‚«', '💫'], ['Ã¢í‚ší‚¡', '⚡'],
  ['Ã°í‚Ÿí‚”í‚¥', '🔥'], ['Ã°í‚Ÿí‚’í‚Š', '💊'], ['Ã°í‚Ÿí‚’í‚¥', '💥'],
  ['Ã°í‚Ÿí‚’í‚¤', '💤'], ['Ã°í‚Ÿí‚’í‚€', '🛡️'], ['Ã°í‚Ÿí‚›í‚¡Ã¯í‚¸í‚ ', '🛡️'],
  ['Ã°í‚Ÿí‚ší‚«', '🚫'], ['Ã°í‚Ÿí‚˜í‚µ', '😴'], ['Ã°í‚Ÿí‚“í‚Š', '🏆'],
  ['Ã°í‚Ÿí‚’í‚¨', '💨'], ['Ã°í‚Ÿí‚§🚀 ª', '🧪'], ['Ã°í‚Ÿí‚”í‚´', '🔴'],
  ['Ã…í‚¸Ã¢í‚€í‚ºÃ‚í‚¡í¯Ã‚í‚¸Ã‚í‚ ', '🛡️'], ['Ã¢Ã‹í‚œÃ‚ í¯Ã‚í‚¸Ã‚í‚ ', '💀'],
  ['Ã¢Ã‚í‚ Ã¢í‚€í‚ží¯Ã‚í‚¸Ã‚í‚ ', '❄️'], ['Ã¢Ã‚í‚­Ã‚í‚', '✨'],
  ['í¢í‹Âœí‚', '☁️'], ['í¢í‹œí‚', '☁️'], ['í¢í‹œí¢‚¬', '☁️'],
  ['âš”ï¸ í¯¸', '⚔️'], ['âš ï¸ ', '⚠️'],
  
  // Decoração e Lixo
  ['Ã¢Ã¢í‚€í‚ Ã¢í‚‚', '──'], ['í¢‚¬', ''], ['í¢”€', '─'], ['Â ', ' '],
  
  // Acentuação residual
  ['INí CIO', 'INÍCIO'], ['í ', 'Í'], ['VILí ', 'VILÃ'],
  ['í‰', 'É'], ['í“', 'Ó'], ['íª', 'ê'], ['íº', 'ú'], ['í³', 'ó'],
  ['í±', 'ñ'], ['í¡', 'á'], ['í¨', 'è'], ['í´', 'ô'],
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  fixes.forEach(([bad, good]) => {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  Fixed:', path.relative(process.cwd(), filePath));
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory() && f !== 'node_modules') walk(full);
    else if (f.endsWith('.jsx') || f.endsWith('.js')) fixFile(full);
  });
}

console.log('🚀 Iniciando varredura profunda de encoding...');
walk('./src');
console.log('✨ Varredura concluída.');

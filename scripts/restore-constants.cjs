const fs = require('fs');
const path = require('path');

const constantsPath = path.join(process.cwd(), 'src/data/constants.js');
let content = fs.readFileSync(constantsPath, 'utf8');

// I need to fix the names that were truncated. 
// I'll use common sense for these since they are standard items.
const FIXES = [
    { m: "icon: '🧵', name: ' },", c: "icon: '🧵', name: 'Seda' }," },
    { m: "icon: '🪶', name: ' },", c: "icon: '🪶', name: 'Pena' }," },
    { m: "icon: '🌰', name: ' },", c: "icon: '🌰', name: 'Apricorn' }," },
    { m: "icon: '⚡', name: ' },", c: "icon: '⚡', name: 'Chip Elétrico' }," },
    { m: "icon: '🌙', name: ' },", c: "icon: '🌙', name: 'Fragmento Lunar' }," },
    { m: "icon: '🌸', name: ' },", c: "icon: '🌸', name: 'Pó de Fada' }," },
    { m: "icon: '🪙', name: ' },", c: "icon: '🪙', name: 'Pepita' }," },
    { m: "icon: '⛏️', name: ' },", c: "icon: '⛏️', name: 'Minério' }," },
    { m: "icon: '✨', name: ' },", c: "icon: '✨', name: 'Pó Estelar' }," },
    { m: "icon: '💧', name: ' },", c: "icon: '💧', name: 'Água Fresca' }," },
    { m: "icon: '🥤', name: ' },", c: "icon: '🥤', name: 'Soda Pop' }," },
    { m: "icon: '🍋', name: ' },", c: "icon: '🍋', name: 'Limonada' }," },
    { m: "icon: '🥛', name: ' },", c: "icon: '🥛', name: 'Leite MooMoo' }," },
    { m: "icon: '🧃', name: ' },", c: "icon: '🧃', name: 'Suco de Baga' }," },
    { m: "icon: '🫐', name: ' },", c: "icon: '🫐', name: 'Oran Berry' }," },
    { m: "icon: '🍊', name: ' },", c: "icon: '🍊', name: 'Sitrus Berry' }," },
    { m: "icon: '🌟', name: ' },", c: "icon: '🌟', name: 'Lum Berry' }," },
    { m: "icon: '🍒', name: ' },", c: "icon: '🍒', name: 'Cheri Berry' }," },
    { m: "icon: '🫐', name: ' },", c: "icon: '🫐', name: 'Chesto Berry' }," },
    { m: "icon: '🍑', name: ' },", c: "icon: '🍑', name: 'Pecha Berry' }," },
    { m: "icon: '🧊', name: ' },", c: "icon: '🧊', name: 'Rawst Berry' }," },
    { m: "icon: '🍐', name: ' },", c: "icon: '🍐', name: 'Aspear Berry' }," },
    { m: "icon: '🍅', name: ' },", c: "icon: '🍅', name: 'Leppa Berry' }," },
    { m: "icon: '🍖', name: ' },", c: "icon: '🍖', name: 'Ração Comum' }," },
    { m: "icon: '🥩', name: ' },", c: "icon: '🥩', name: 'Ração Premium' }," },
    { m: "icon: '🔥', name: ' },", c: "icon: '🔥', name: 'Pedra do Fogo' }," },
    { m: "icon: '💧', name: ' },", c: "icon: '💧', name: 'Pedra da Água' }," },
    { m: "icon: '🍃', name: ' },", c: "icon: '🍃', name: 'Pedra da Folha' }," },
    { m: "icon: '⚡', name: ' },", c: "icon: '⚡', name: 'Pedra do Trovão' }," },
    { m: "icon: '🌙', name: ' },", c: "icon: '🌙', name: 'Pedra da Lua' }," },
    { m: "icon: '⚪', name: ' },", c: "icon: '⚪', name: 'Essência Normal' }," },
    { m: "icon: '🎾', name: ' },", c: "icon: '🎾', name: 'Pokébola' }," },
    { m: "icon: '🔵', name: ' },", c: "icon: '🔵', name: 'Great Ball' }," },
    { m: "icon: '🟡', name: ' },", c: "icon: '🟡', name: 'Ultra Ball' }," },
    { m: "icon: '🧪', name: ' },", c: "icon: '🧪', name: 'Poção' }," }
];

for (const fix of FIXES) {
    content = content.replace(fix.m, fix.c);
}

fs.writeFileSync(constantsPath, content, 'utf8');
console.log('Restored constants.js');


const fs = require('fs');
const path = 'c:/Users/Usuario/Desktop/pokecraftidle2-master/src/AppRoot.jsx';

let content = fs.readFileSync(path, 'utf8');

const fixes = [
    { target: 'icon: \'âš”ï¸ í¯¸  \'', replacement: 'icon: \'⚔️\'' },
    { target: 'icon: \' í¢€ \'', replacement: 'icon: \'👤\'' },
    { target: 'icon: \'âš”ï¸ \'', replacement: 'icon: \'⚔️\'' },
    { target: '<span>âž”</span>', replacement: '<span>▶</span>' },
    { target: 'Ã…í‚¸Ã‚í‚ Ã‚í‚¥', replacement: '💖' },
    { target: ' í‚ª', replacement: '🛒' },
    { target: ' 🚀 ª', replacement: '🛒' },
    { target: 'í‚ª', replacement: '🛒' },
    { target: 'í¯¸', replacement: '⚔️' },
    { target: 'âš”ï¸ ', replacement: '⚔️' },
    { target: '🎒¾', replacement: '🎒' },
    { target: '( SHINY', replacement: '✨ SHINY' },
    { target: 'âž”', replacement: '▶' },
    { target: 'í‚¸', replacement: '💖' },
    { target: 'Ã…', replacement: '💖' },
    { target: 'Ã­Â gua', replacement: 'Água' },
    { target: 'Ã­Â', replacement: 'í' },
    { target: 'Ã¢Å¡Â Ã¯Â¸Â ', replacement: '⚠️' },
    { target: 'ðŸš€â€™Â¡', replacement: '🚀' },
    { target: 'ðŸŽ’Â Â ', replacement: '🎁' },
    { target: 'comeÃ§ar', replacement: 'começar' },
    { target: 'exaustÃ£o', replacement: 'exaustão' },
    { target: 'disponÃ­vel', replacement: 'disponível' },
    { target: 'PokÃ©mons', replacement: 'Pokémon' },
    { target: 'missíµes', replacement: 'missões' },
    { target: 'MISSíO', replacement: 'MISSÃO' },
    { target: 'Mansíões', replacement: 'Mansões' },
    { target: 'mansíões', replacement: 'mansões' },
    { target: 'dragí£o', replacement: 'dragão' },
    { target: 'CONSTRUES', replacement: 'CONSTRUÇÕES' },
];

let fixedCount = 0;
fixes.forEach(f => {
    if (content.includes(f.target)) {
        content = content.split(f.target).join(f.replacement);
        fixedCount++;
    }
});

fs.writeFileSync(path, content, 'utf8');
console.log(`Success: Fixed ${fixedCount} patterns`);

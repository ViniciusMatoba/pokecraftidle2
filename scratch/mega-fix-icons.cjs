const fs = require('fs');
const path = require('path');

const filesToFix = [
    'src/AppRoot.jsx',
    'src/components/BattleScreen.jsx',
    'src/components/TravelScreen.jsx',
    'src/components/ExpeditionsScreen.jsx',
    'src/components/ChallengesScreen.jsx',
    'src/data/routes.js',
    'src/data/expeditions.js',
    'src/data/translations.js'
];

const replacements = [
    // Emojis e Icones
    { from: /âœ–/g, to: '✖' },
    { from: /âœ…/g, to: '✅' },
    { from: /âœ¨/g, to: '✨' },
    { from: /ðŸ’–/g, to: '💖' },
    { from: /ðŸ—º/g, to: '🗺️' },
    { from: /âš”ï¸/g, to: '⚔️' },
    { from: /âš’ï¸/g, to: '🔨' },
    { from: /ðŸ’°/g, to: '💰' },
    { from: /ðŸŽ'/g, to: '🎒' },
    { from: /ðŸ±/g, to: '📱' },
    { from: /ðŸ¢/g, to: '🏢' },
    { from: /🚀â€ Â´/g, to: '🚀' },
    { from: /🚀â€œÂ¢/g, to: '🚀' },
    { from: /🚀Å¡â‚¬/g, to: '🚀' },
    { from: /íÂ°íâ€šÅ¸íâ€šÅ¡íâ€šâ‚¬/g, to: '🚢' },
    { from: /íÂ¢íâ€šÅ¡íâ€šâ€ íÂ¯ðŸ’–íâ€šÂ íÂ¯íâ€šðŸ’–íâšíâ€šÂ/g, to: '⚔️' },
    { from: /íÂ¢íâ€ší…â€œíâ€šÂ¨/g, to: '✨' },
    { from: /â–▶/g, to: '▶' },
    { from: /â–¶/g, to: '▶' },
    { from: /â ±ï¸/g, to: '⏱️' },
    { from: /ðŸ’Ž/g, to: '💎' },
    { from: /âš ï¸/g, to: '⚠️' },

    // Textos em Português Corrompidos
    { from: /NíO EDITAR/g, to: 'NÃO EDITAR' },
    { from: /AUTORIZAí‡íO EXPLí CITA/g, to: 'AUTORIZAÇÃO EXPLÍCITA' },
    { from: /expediçííµes/g, to: 'expedições' },
    { from: /íÂ¢íâ€ší…â€œíâ€šÂ¨/g, to: '✨' },
    { from: /Insígnia/g, to: 'Insígnia' },
    { from: /tipo ííâ€šíâ€šÂ GUA/g, to: 'tipo ÁGUA' },
    { from: /tipo PSííâ€šíâ€šÂ QUICO/g, to: 'tipo PSÍQUICO' },
    { from: /Mansíµes/g, to: 'Mansões' },
    { from: /í¢â‚¬â€/g, to: '—' },
    { from: /íÂ¢íâ€šÅ“íâ€šâ€¦/g, to: '✅' },
    { from: /íÂ¢íâ€šÂ íâ€¦â€™/g, to: '❌' },
    { from: /Â íÂ¢â‚¬Â¦/g, to: '🏆' },
    { from: /íÂ¢ðŸ’–íâ€šâ€œíÂ¢íâ€šâ‚¬íâ€šÂ¦/g, to: '📦' },
    { from: /íÂ¢íâ€šíâ€šÂ ðŸ’–íâ€šâ€™/g, to: '⚠️' },
    { from: /ðŸ’–ðŸ’–íâ€šíâ€šÂ íâ€š/g, to: '🎉' },
    { from: /Â í¢â‚¬â€ Â/g, to: '—' },
    { from: /Â íâ€šÂ¾/g, to: '🏠' },
    { from: /â€¢/g, to: '•' },
    { from: /â€/g, to: '"' },
];

filesToFix.forEach(relPath => {
    const absPath = path.resolve(relPath);
    if (!fs.existsSync(absPath)) return;

    let content = fs.readFileSync(absPath, 'utf8');
    let original = content;

    replacements.forEach(rep => {
        content = content.replace(rep.from, rep.to);
    });

    if (content !== original) {
        fs.writeFileSync(absPath, content);
        console.log(`Fixed: ${relPath}`);
    } else {
        console.log(`No changes needed: ${relPath}`);
    }
});
console.log('Mega Fix Complete');

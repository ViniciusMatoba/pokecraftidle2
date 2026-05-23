const fs = require('fs');
const path = require('path');

const filesToFix = [
    'src/AppRoot.jsx',
    'src/components/BattleScreen.jsx',
    'src/components/TravelScreen.jsx',
    'src/components/ExpeditionsScreen.jsx',
];

const specificFixes = [
    // Logs de evolução e candies
    { from: /ðŸ’–ðŸ’–íâ€šíâ€šÂ íâ€š/g, to: '🍬' },
    { from: /íÂ¢íâ€šíâ€šÂ ðŸ’–íâ€šâ€™/g, to: '⚠️' },
    
    // Expedições
    { from: /íÂ°íâ€šÅ¸íâ€šÅ¡íâ€šâ‚¬/g, to: '🚢' },
    { from: /íÂ¢ðŸ’–íâ€šâ€œíÂ¢íâ€šâ‚¬íâ€šÂ¦/g, to: '📦' },
    
    // Auto Capture
    { from: /🚀â€ Â´/g, to: '🚀' },
    
    // Jardim
    { from: /íÂ¢íâ€šÂ íâ€¦â€™/g, to: '❌' },
    { from: /Â í¢â‚¬â€ Â/g, to: '—' },
    { from: /Â íâ€šÂ¾/g, to: '🏠' },
    
    // Rival
    { from: /íÂ¢íâ€šÅ¡íâ€šâ€ íÂ¯ðŸ’–íâ€šÂ íÂ¯íâ€šðŸ’–íâšíâ€šÂ/g, to: '⚔️' },
    { from: /🚀â€œÂ¢/g, to: '🚀' },
    
    // Insígnia e Evolução
    { from: /Â íÂ¢â‚¬Â¦/g, to: '🏆' },
    { from: /íÂ¢íâ€ší…â€œíâ€šÂ¨/g, to: '✨' },
    { from: /íÂ¢í¢â€šÂ¬Â /g, to: '🏆' },
    { from: /🚀Å¡â‚¬/g, to: '🚀' },
    
    // Footer e UI
    { from: /â€¢/g, to: '•' },
    { from: /â–▶/g, to: '▶' },
    { from: /â–¶/g, to: '▶' },
    { from: /âš”ï¸/g, to: '⚔️' },
    { from: /âœ–/g, to: '✖' },
    { from: /âš’ï¸/g, to: '🔨' },
    
    // Água e Psíquico
    { from: /ííâ€šíâ€šÂ GUA/g, to: 'ÁGUA' },
    { from: /PSííâ€šíâ€šÂ QUICO/g, to: 'PSÍQUICO' },
    { from: /Mansíµes/g, to: 'Mansões' },
    {from: /expediçííµes/g, to: 'expedições' },
    {from: /Expediçíµes/g, to: 'Expedições' },
    {from: /â ±ï¸/g, to: '⏱️' },
    {from: /â ±ï¸/g, to: '⏱️' },
    {from: /â ±/g, to: '⏱️' },
    {from: /âš ï¸/g, to: '⚠️' },
    {from: /âš”ï¸/g, to: '⚔️' },
    {from: /âœ–/g, to: '✖' },
    {from: /íÂ°íâ€šÅ¸íâ€šÅ¡íâ€šâ‚¬/g, to: '🚢' },
    {from: /ðŸ’Ž/g, to: '💎' },
    {from: /ðŸ’°/g, to: '💰' },
    {from: /ðŸ—º/g, to: '🗺️' },
    {from: /ðŸ±/g, to: '📱' },
    {from: /ðŸŽ'/g, to: '🎒' },
    {from: /ðŸ¢/g, to: '🏢' },
    {from: /ðŸ’–/g, to: '💖' },
    {from: /âœ…/g, to: '✅' },
    {from: /âœ¨/g, to: '✨' },
    
    // Protected comments
    { from: /íÂ /g, to: 'Á' },
    { from: /í‡íO/g, to: 'ÇÃO' },
    { from: /NíO EDITAR/g, to: 'NÃO EDITAR' },
    { from: /EXPLí CITA/g, to: 'EXPLÍCITA' },
    { from: /Fórmula XP â€” NíO ALTERAR/g, to: 'Fórmula XP — NÃO ALTERAR' },
    { from: /â€”/g, to: '—' },
];

filesToFix.forEach(relPath => {
    let content = fs.readFileSync(relPath, 'utf8');
    specificFixes.forEach(fix => {
        content = content.replace(fix.from, fix.to);
    });
    fs.writeFileSync(relPath, content);
    console.log(`Safe fix applied to ${relPath}`);
});

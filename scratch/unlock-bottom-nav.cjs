const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

// 1. Garantir que o clique no botão do modal de Stamina desbloqueie o menu
const oldModalBtn = "onClick={() => setShowOakStaminaModal(false)}";
const newModalBtn = "onClick={() => { setShowOakStaminaModal(false); setGameState(prev => ({ ...prev, oakTutorialShown: true })); }}";

if (content.includes(oldModalBtn)) {
    content = content.replace(oldModalBtn, newModalBtn);
    console.log('Modal button updated');
}

// 2. Tornar a lógica de desbloqueio do menu mais tolerante
const oldUnlockLogic = "const menuUnlocked = gameState.oakTutorialShown === true && !isRivalBattle;";
const newUnlockLogic = "const menuUnlocked = (gameState.oakTutorialShown || (gameState.worldFlags && gameState.worldFlags.includes('has_starter'))) && !isRivalBattle;";

if (content.includes(oldUnlockLogic)) {
    content = content.replace(oldUnlockLogic, newUnlockLogic);
    console.log('Unlock logic updated');
}

fs.writeFileSync('src/AppRoot.jsx', content);
console.log('Success');

const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

// 1. Garantir que ao sair da batalha do rival, o inimigo seja limpo (isso ajuda no estado isRivalBattle)
content = content.replace(
    /onClick=\{\(\) =\> setCurrentView\('city'\)\} style=\{\{/g,
    "onClick={() => { setCurrentEnemy(null); setCurrentView('city'); }} style={{"
);

// 2. Tornar a condição da BottomNav mais robusta. 
// Se estamos na cidade ou em batalhas, e não estamos no loading, a barra deve aparecer (mesmo que bloqueada)
// Adicionando um check para currentView ser city ou battles como bypass para o has_starter se necessário,
// mas o ideal é garantir que o user e o worldFlags funcionem.
// Vou apenas simplificar a condição para mostrar a nav sempre que não estiver na landing e tiver um user.
const oldNavCond = "{currentView !== 'landing' && (!loading && user && gameState.worldFlags?.includes('has_starter')) && (() => {";
const newNavCond = "{currentView !== 'landing' && (!loading && user) && (() => {";

if (content.includes(oldNavCond)) {
    content = content.replace(oldNavCond, newNavCond);
    console.log('Nav condition updated');
}

fs.writeFileSync('src/AppRoot.jsx', content);
console.log('Success');

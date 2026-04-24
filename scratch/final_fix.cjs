const fs = require('fs');
const filePath = 'src/AppRoot.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Encoding Fix
const encMap = {
  'âœ–': '✖',
  'ðŸ’Ž': '💎',
  'í ': 'í',
  'DRAGíƒO': 'DRAGÃO',
  'í GUA': 'ÁGUA',
  'í‰TRICO': 'ELÉTRICO',
  'í QUICO': 'PSÍQUICO',
  'Mansções': 'Mansões',
  'ví¢nicas': 'vulcânicas',
  'tíºneis': 'túneis',
  'AçO': 'AÇO',
  'pí¢ntanos': 'pântanos',
  'í¢â‚¬Â ': '†'
};
Object.entries(encMap).forEach(([k,v]) => {
  content = content.split(k).join(v);
});

// 2. Fix Stamina Modal Size
content = content.replace(
  /showOakStaminaModal && \(\s*<div className=\"absolute inset-0 z-\[120\] flex items-center justify-center p-4/,
  'showOakStaminaModal && (\n            <div className=\"absolute inset-0 z-[120] flex items-center justify-center p-8 md:p-12'
);
content = content.replace(
  /max-w-md bg-white rounded-\[3rem\] overflow-hidden shadow-2xl animate-bounceIn/,
  'max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-bounceIn max-h-[85vh] flex flex-col'
);
content = content.replace(
  /<div className=\"bg-green-50 p-10\">/,
  '<div className=\"bg-green-50 p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1\">'
);

// 3. Restore Missing Cases in renderView
const insertBefore = "case 'vs':";
if (!content.includes("case 'battles':")) {
    const missingCases = `
      case 'routes': return (
        <TravelScreen 
          ROUTES={processedRoutes} 
          currentRoute={gameState.currentRoute} 
          onSelectRoute={(routeId) => {
            setGameState(prev => ({ ...prev, currentRoute: routeId }));
            setCurrentEnemy(null);
            setCurrentView('battles');
          }}
        />
      );
      case 'battles': return (
        <BattleScreen 
          enemy={currentEnemy} 
          team={gameState.team}
          onVictory={handleVictory}
          onDefeat={() => setCurrentView('heal_after_defeat')}
          addLog={addLog}
          spawnEnemy={spawnEnemy}
          gameState={gameState}
          setGameState={setGameState}
          currentRoute={gameState.currentRoute}
          ROUTES={processedRoutes}
          onGoToCity={() => handleGoToCity(true)}
        />
      );
      case 'pokemon_management': return (
        <PokemonManagement 
          team={gameState.team} 
          pc={gameState.pc || []}
          setGameState={setGameState}
          onBack={() => setCurrentView(lastNonMenuView.current || 'city')}
          showConfirm={showConfirm}
        />
      );
      case 'menu': return (
        <MenuScreen 
          gameState={gameState}
          setGameState={setGameState}
          onClose={() => setCurrentView(lastNonMenuView.current || 'city')}
          setCurrentView={setCurrentView}
          showConfirm={showConfirm}
        />
      );
`;
    content = content.replace(insertBefore, missingCases + '\n      ' + insertBefore);
    console.log('Restored missing cases');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Final polish applied via scratch script.');

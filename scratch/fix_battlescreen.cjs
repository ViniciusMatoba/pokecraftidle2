const fs = require('fs');
const filePath = 'src/AppRoot.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const battleCaseRegex = /case 'battles': return \(\s*<BattleScreen[\s\S]*?\/>\s*\);/;
const correctBattleCase = `case 'battles': return (
        <BattleScreen 
          currentEnemy={currentEnemy} 
          gameState={gameState}
          activeMemberIndex={activeMemberIndex}
          moveIndex={moveIndex}
          weather={weather}
          setActiveMemberIndex={setActiveMemberIndex}
          addLog={addLog}
          battleLog={battleLog}
          floatingTexts={floatingTexts}
          onUseItem={handleUseItem}
          setGameState={setGameState}
          setShowAutoCaptureModal={setShowAutoCaptureModal}
          ROUTES={processedRoutes}
          fixPath={fixPath}
          TYPE_COLORS={TYPE_COLORS}
          onGoToCity={() => handleGoToCity(true)}
          onChallengeBoss={(boss) => startKeyBattle(boss)}
          timeOfDay={timeOfDay}
        />
      );`;

if (battleCaseRegex.test(content)) {
    content = content.replace(battleCaseRegex, correctBattleCase);
    console.log('BattleScreen props fixed via scratch script');
} else {
    console.log('BattleScreen case not found');
}

fs.writeFileSync(filePath, content, 'utf8');

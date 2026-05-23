const fs = require('fs');
const filePath = 'src/AppRoot.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix routes case
const routesCase = `      case 'routes': return (
        <TravelScreen 
          gameState={gameState}
          setGameState={setGameState}
          travelTab={travelTab}
          setTravelTab={setTravelTab}
          ROUTES={processedRoutes} 
          setCurrentEnemy={setCurrentEnemy}
          setCurrentView={setCurrentView}
          setVsInitialTab={setVsInitialTab}
          setVsInitialCategory={setVsInitialCategory}
          fixPath={fixPath}
          POKEDEX={POKEDEX}
        />
      );`;
content = content.replace(/case 'routes': return \(\s*<TravelScreen[\s\S]*?\/>\s*\);/, routesCase);

// 2. Fix pokemon_management case
const pMgtCase = `      case 'pokemon_management': return (
        <PokemonManagement 
          gameState={gameState}
          setGameState={setGameState}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activePokemonDetails={activePokemonDetails}
          setActivePokemonDetails={setActivePokemonDetails}
          POKEDEX={POKEDEX}
          MOVES={MOVES}
          NATURES={NATURES}
          NATURE_LIST={NATURE_LIST}
          getMasteryPath={getMasteryPath}
          addLog={addLog}
          setEvolutionPending={setEvolutionPending}
          handleUseCandy={handleUseCandy}
          showConfirm={showConfirm}
          closeConfirm={closeConfirm}
        />
      );`;
content = content.replace(/case 'pokemon_management': return \(\s*<PokemonManagement[\s\S]*?\/>\s*\);/, pMgtCase);

// 3. Fix menu case
const menuCase = `      case 'menu': return (
        <MenuScreen 
          gameState={gameState}
          setCurrentView={setCurrentView}
          setGameState={setGameState}
          user={user}
          onSave={() => notify('🏠 Jogo salvo com sucesso!', 'success')}
          MUSIC_LIST={MUSIC_LIST}
          onBack={() => setCurrentView(lastNonMenuView.current || 'city')}
          showConfirm={showConfirm}
          closeConfirm={closeConfirm}
        />
      );`;
content = content.replace(/case 'menu': return \(\s*<MenuScreen[\s\S]*?\/>\s*\);/, menuCase);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed all 3 missing prop cases in renderView');

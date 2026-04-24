
const fs = require('fs');
const path = 'c:/Users/Usuario/Desktop/pokecraftidle2-master/src/AppRoot.jsx';

let content = fs.readFileSync(path, 'utf8');

const target = `      {(!loading && user && gameState.worldFlags?.includes('has_starter')) && (
        <nav className="bg-white border-t-4 border-slate-200 grid grid-cols-5 z-50 shadow-lg relative"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: '4.5rem', flexShrink: 0 }}
        >
          <button onClick={() => {
            const currentR = processedRoutes[gameState.currentRoute];
            const isFarming = currentR && currentR.type === 'farm';
            
             if (currentView === 'battles') {
              // Se já está na batalha, abrir o mapa requer confirmação
              showConfirm({
                title: 'Interromper Treino?',
                message: 'Deseja abrir o mapa das Rotas? Isso interromperá seu treino atual.',
                onConfirm: () => {
                  setCurrentView('routes');
                  closeConfirm();
                }
              });
            } else if (isFarming) {
              // Se está em qualquer outra tela (Menu, Pokemon, etc) e estava treinando, volta para a batalha
              setCurrentView('battles');
            } else {
              // Comportamento padrão (ir para o mapa)
              setCurrentView('routes');
            }
          }} className={\`flex flex-col items-center justify-center py-2 transition-all \${['routes', 'battles'].includes(currentView) ? 'text-pokeBlue scale-110' : 'text-slate-400 opacity-60'}\`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="w-7 h-7 object-contain" alt="Routes" />
            <span className="text-[9px] font-black uppercase mt-0.5">Rotas</span>
          </button>
          <button onClick={() => setCurrentView('pokemon_management')} className={\`flex flex-col items-center justify-center py-2 transition-all \${currentView === 'pokemon_management' ? 'text-pokeRed scale-110' : 'text-slate-400 opacity-60'}\`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-7 h-7 object-contain" alt="Pokemons" />
            <span className="text-[9px] font-black uppercase mt-0.5">Pokémons</span>
          </button>
          <button onClick={() => setCurrentView('vs')} className={\`flex flex-col items-center justify-center py-2 transition-all \${['vs', 'gyms', 'challenges'].includes(currentView) ? 'text-pokeGold scale-110' : 'text-slate-400 opacity-60'}\`}>
            <span className="text-2xl h-7 flex items-center">âš”ï¸ </span>
            <span className="text-[9px] font-black uppercase mt-0.5">Modo VS</span>
          </button>
          <button onClick={() => {
            if (currentView === 'battles') {
              showConfirm({
                title: 'Voltar para a Cidade?',
                message: 'Deseja interromper o treino e ir para a cidade?',
                onConfirm: () => {
                  handleGoToCity();
                  closeConfirm();
                }
              });
              return;
            }
            handleGoToCity();
          }} className={\`flex flex-col items-center justify-center py-2 transition-all \${currentView === 'city' ? 'text-indigo-500 scale-110' : 'text-slate-400 opacity-60'}\`}>
            <span className="text-2xl h-7 flex items-center">🚀 ¢</span>
            <span className="text-[9px] font-black uppercase mt-0.5">Cidade</span>
          </button>
          <button onClick={() => setCurrentView('menu')} className={\`flex flex-col items-center justify-center py-2 transition-all \${currentView === 'menu' ? 'text-slate-800 scale-110' : 'text-slate-400 opacity-60'}\`}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-doll.png" className="w-7 h-7 object-contain" alt="Menu" />
            <span className="text-[9px] font-black uppercase mt-0.5">Menu</span>
          </button>
        </nav>
      )}\`;

const replacement = \`      {(!loading && user && gameState.worldFlags?.includes('has_starter')) && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 flex items-center justify-around px-2 py-2 z-50 shadow-xl pb-safe">
          {(() => {
            const menuUnlocked = gameState.oakTutorialShown === true;
            return (
              <>
                {/* ROTAS */}
                <button 
                  onClick={() => menuUnlocked && handleNavRoutes()} 
                  disabled={!menuUnlocked}
                  className={\`flex flex-col items-center justify-center py-1 px-3 transition-all \${!menuUnlocked ? 'opacity-30 grayscale' : (['routes','battles'].includes(currentView) ? 'text-pokeBlue scale-110' : 'text-slate-400')}\`}
                >
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="w-7 h-7 object-contain" alt="Rotas" />
                  <span className="text-[9px] font-black uppercase mt-0.5">Rotas</span>
                </button>

                {/* EQUIPE */}
                <button 
                  onClick={() => menuUnlocked && setCurrentView('pokemon_management')} 
                  disabled={!menuUnlocked}
                  className={\`flex flex-col items-center justify-center py-1 px-3 transition-all \${!menuUnlocked ? 'opacity-30 grayscale' : (currentView === 'pokemon_management' ? 'text-pokeBlue scale-110' : 'text-slate-400')}\`}
                >
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-7 h-7 object-contain" alt="Equipe" />
                  <span className="text-[9px] font-black uppercase mt-0.5">Equipe</span>
                </button>

                {/* VS */}
                <button 
                  onClick={() => menuUnlocked && setCurrentView('vs')} 
                  disabled={!menuUnlocked}
                  className={\`flex flex-col items-center justify-center py-1 px-3 transition-all \${!menuUnlocked ? 'opacity-30 grayscale' : (currentView === 'vs' ? 'text-pokeBlue scale-110' : 'text-slate-400')}\`}
                >
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/badge-1.png" className="w-7 h-7 object-contain" alt="VS" />
                  <span className="text-[9px] font-black uppercase mt-0.5">VS</span>
                </button>

                {/* CIDADE */}
                <button 
                  onClick={() => menuUnlocked && handleGoToCity()} 
                  disabled={!menuUnlocked}
                  className={\`flex flex-col items-center justify-center py-1 px-3 transition-all \${!menuUnlocked ? 'opacity-30 grayscale' : (['city'].includes(currentView) ? 'text-pokeBlue scale-110' : 'text-slate-400')}\`}
                >
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-doll.png" className="w-7 h-7 object-contain" alt="Cidade" />
                  <span className="text-[9px] font-black uppercase mt-0.5">Cidade</span>
                </button>

                {/* MENU */}
                <button 
                  onClick={() => menuUnlocked && setCurrentView('menu')} 
                  disabled={!menuUnlocked}
                  className={\`flex flex-col items-center justify-center py-1 px-3 transition-all \${!menuUnlocked ? 'opacity-30 grayscale' : (currentView === 'menu' ? 'text-pokeBlue scale-110' : 'text-slate-400')}\`}
                >
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/adventure-guide.png" className="w-7 h-7 object-contain" alt="Menu" />
                  <span className="text-[9px] font-black uppercase mt-0.5">Menu</span>
                </button>
              </>
            );
          })()}
        </nav>
      )}\`;

if (content.includes(target)) {
    const newContent = content.replace(target, replacement);
    fs.writeFileSync(path, newContent, 'utf8');
    console.log("Success");
} else {
    console.log("Target not found");
}

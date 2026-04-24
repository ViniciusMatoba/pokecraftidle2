
const fs = require('fs');
const appRootPath = 'c:/Users/Usuario/Desktop/pokecraftidle2-master/src/AppRoot.jsx';

let content = fs.readFileSync(appRootPath, 'utf8');

const navStartPattern = "{(!loading && user && gameState.worldFlags?.includes('has_starter')) && (";
const navEndPattern = "</nav>";

const startIndex = content.lastIndexOf(navStartPattern);
if (startIndex === -1) {
    console.log("Could not find nav start");
    process.exit(1);
}

const navEndIndex = content.indexOf(navEndPattern, startIndex);
if (navEndIndex === -1) {
    console.log("Could not find nav end tag");
    process.exit(1);
}

// Find the next closing brace after </nav>
const closingBraceIndex = content.indexOf(")}", navEndIndex);
if (closingBraceIndex === -1) {
    console.log("Could not find closing brace after nav");
    process.exit(1);
}

const fullTarget = content.substring(startIndex, closingBraceIndex + 2);

const replacement = `{(!loading && user && gameState.worldFlags?.includes('has_starter')) && (
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
      )}`;

const newContent = content.replace(fullTarget, replacement);
fs.writeFileSync(appRootPath, newContent, 'utf8');
console.log("Success");

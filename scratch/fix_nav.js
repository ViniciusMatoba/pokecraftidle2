const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const navStartMarker = "{(!loading && user && gameState.worldFlags?.includes('has_starter')) && (";
const navEndMarker = "      )}";

// Finding the nav block. There might be multiple but we want the one that looks like the bottom nav.
// The bottom nav usually has <nav className="bg-white border-t-4 ...
const bottomNavStart = content.indexOf('<nav className="bg-white border-t-4 border-slate-200 grid grid-cols-5');
if (bottomNavStart === -1) {
    console.error('Could not find bottom nav start');
    process.exit(1);
}

// Find the {(!loading... before it
const blockStart = content.lastIndexOf("{(!loading && user && gameState.worldFlags?.includes('has_starter')) && (", bottomNavStart);
// Find the next )} after it
const blockEnd = content.indexOf("      )}", bottomNavStart) + "      )}".length;

const newNav = `      {(!loading && user && gameState.worldFlags?.includes('has_starter')) && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 flex items-center justify-around px-2 py-2 z-50 shadow-xl">
          {(() => {
            const menuUnlocked = gameState.oakTutorialShown === true;
            return (
              <>
                {/* ROTAS */}
                <button 
                  onClick={() => menuUnlocked && handleNavRoutes()} 
                  disabled={!menuUnlocked}
                  className={\`flex flex-col items-center justify-center py-1 px-3 transition-all \${['routes','battles'].includes(currentView) ? 'text-pokeBlue scale-110' : 'text-slate-400'} \${!menuUnlocked ? 'opacity-30 cursor-not-allowed' : ''}\`}
                >
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="w-7 h-7 object-contain" alt="Rotas" />
                  <span className="text-[9px] font-black uppercase mt-0.5">Rotas</span>
                </button>

                {/* POKÉMONS */}
                <button 
                  onClick={() => menuUnlocked && setCurrentView('pokemon_management')} 
                  disabled={!menuUnlocked}
                  className={\`flex flex-col items-center justify-center py-1 px-3 transition-all \${currentView === 'pokemon_management' ? 'text-pokeRed scale-110' : 'text-slate-400'} \${!menuUnlocked ? 'opacity-30 cursor-not-allowed' : ''}\`}
                >
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-7 h-7 object-contain" alt="Pokémons" />
                  <span className="text-[9px] font-black uppercase mt-0.5">Pokémons</span>
                </button>

                {/* MODO VS */}
                <button 
                  onClick={() => menuUnlocked && setCurrentView('vs')} 
                  disabled={!menuUnlocked}
                  className={\`flex flex-col items-center justify-center py-1 px-3 transition-all \${['vs','gyms','challenges'].includes(currentView) ? 'text-pokeGold scale-110' : 'text-slate-400'} \${!menuUnlocked ? 'opacity-30 cursor-not-allowed' : ''}\`}
                >
                  <img 
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/badge-1.png" 
                    className="w-7 h-7 object-contain" 
                    alt="Modo VS"
                    onError={e => { e.target.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png'; }} 
                  />
                  <span className="text-[9px] font-black uppercase mt-0.5">Modo VS</span>
                </button>

                {/* CIDADE */}
                <button 
                  onClick={() => menuUnlocked && handleGoToCity()} 
                  disabled={!menuUnlocked}
                  className={\`flex flex-col items-center justify-center py-1 px-3 transition-all \${currentView === 'city' ? 'text-indigo-500 scale-110' : 'text-slate-400'} \${!menuUnlocked ? 'opacity-30 cursor-not-allowed' : ''}\`}
                >
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-doll.png" className="w-7 h-7 object-contain" alt="Cidade" />
                  <span className="text-[9px] font-black uppercase mt-0.5">Cidade</span>
                </button>

                {/* MENU */}
                <button 
                  onClick={() => menuUnlocked && setCurrentView('menu')} 
                  disabled={!menuUnlocked}
                  className={\`flex flex-col items-center justify-center py-1 px-3 transition-all \${currentView === 'menu' ? 'text-slate-800 scale-110' : 'text-slate-400'} \${!menuUnlocked ? 'opacity-30 cursor-not-allowed' : ''}\`}
                >
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-doll.png" className="w-7 h-7 object-contain" alt="Menu" />
                  <span className="text-[9px] font-black uppercase mt-0.5">Menu</span>
                </button>
              </>
            );
          })()}
        </nav>
      )\`;

content = content.substring(0, blockStart) + newNav + content.substring(blockEnd);
fs.writeFileSync('src/AppRoot.jsx', content);
console.log('Nav fixed');

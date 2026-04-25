const fs = require('fs');
const filePath = 'src/components/BattleScreen.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove big buttons at the top
const bigButtonsSearch = /<div className="flex gap-2 px-2 flex-shrink-0">[\s\S]*?<button[\s\S]*?Auto-Itens[\s\S]*?<\/button>[\s\S]*?<button[\s\S]*?Auto-Captura[\s\S]*?<\/button>[\s\S]*?<\/div>/;
content = content.replace(bigButtonsSearch, '');

// 2. Update Modal Title
content = content.replace('<h3 className="font-black text-slate-800 uppercase italic text-xl">⚙️ Auto-Itens</h3>', '<h3 className="font-black text-slate-800 uppercase italic text-xl">⚙️ Painel Automático</h3>');

// 3. Add Configure button for Auto-Capture inside the modal
const autoCaptureSection = `              {/* Auto Captura */}
              <div className="bg-blue-50 p-5 rounded-3xl border-2 border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-black text-slate-800 text-sm uppercase tracking-tighter">🎯 Auto-Captura</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-bold">Usa Pokébolas automaticamente</p>
                  </div>
                  <div className="relative cursor-pointer" onClick={() => setGameState(prev => ({ ...prev, autoCapture: !prev.autoCapture }))}>
                    <div className={'w-14 h-7 rounded-full transition-all duration-300 ' + (gameState.autoCapture ? 'bg-pokeBlue' : 'bg-slate-200')}>
                      <div className={'absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ' + (gameState.autoCapture ? 'translate-x-8' : 'translate-x-1')} />
                    </div>
                  </div>
                </div>
                {gameState.autoCapture && (
                  <button 
                    onClick={() => {
                      setShowAutoConfig(false);
                      setShowAutoCaptureModal(true);
                    }}
                    className="w-full bg-white border-2 border-blue-200 text-blue-600 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-blue-50 transition-all"
                  >
                    ⚙️ Configurar Critérios de Captura
                  </button>
                )}
              </div>`;

// Note: I used single quotes for the className strings to avoid template literal issues in the script.
// Wait, I should just use the exact text I want in the file.

const autoCaptureSearch = /{\/\* Auto Captura \*\/}[\s\S]*?<div className="flex items-center justify-between bg-blue-50 p-5 rounded-3xl border-2 border-blue-100 shadow-sm">[\s\S]*?<\/div>/;

// I'll rebuild the replacement string with actual backticks for the file.
const replacement = `              {/* Auto Captura */}
              <div className="bg-blue-50 p-5 rounded-3xl border-2 border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-black text-slate-800 text-sm uppercase tracking-tighter">🎯 Auto-Captura</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-bold">Usa Pokébolas automaticamente</p>
                  </div>
                  <div className="relative cursor-pointer" onClick={() => setGameState(prev => ({ ...prev, autoCapture: !prev.autoCapture }))}>
                    <div className={\`w-14 h-7 rounded-full transition-all duration-300 \${gameState.autoCapture ? 'bg-pokeBlue' : 'bg-slate-200'}\`}>
                      <div className={\`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 \${gameState.autoCapture ? 'translate-x-8' : 'translate-x-1'}\`} />
                    </div>
                  </div>
                </div>
                {gameState.autoCapture && (
                  <button 
                    onClick={() => {
                      setShowAutoConfig(false);
                      setShowAutoCaptureModal(true);
                    }}
                    className="w-full bg-white border-2 border-blue-200 text-blue-600 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-blue-50 transition-all"
                  >
                    ⚙️ Configurar Critérios de Captura
                  </button>
                )}
              </div>`;

content = content.replace(autoCaptureSearch, replacement);

// 4. Fix typo "HP d" to "HP <"
content = content.replace('Usar quando HP d {autoConfig.autoPotionHpPct}%', 'Usar quando HP < {autoConfig.autoPotionHpPct}%');
content = content.replace('Usar quando Energia d {autoConfig.autoStaminaThreshold || 30}%', 'Usar quando Energia < {autoConfig.autoStaminaThreshold || 30}%');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed BattleScreen UI');

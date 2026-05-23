const fs = require('fs');
const path = 'src/AppRoot.jsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// 1. Stable changes: Auto-capture + Pokecenter Blur
// shouldCapture logic (2696-2701)
const shouldCaptureTarget = `          const shouldCapture =
            captureMode === 'all'        ? true :
            captureMode === 'shiny_only' ? currentEnemy.isShiny :
            captureMode === 'not_caught' ? !alreadyHave :
            captureMode === 'specific'   ? (routeConfig.targetIds || []).includes(Number(currentEnemy.id)) :
            false;`;
const shouldCaptureReplacement = `          const shouldCapture =
            captureMode === 'all'                    ? true :
            captureMode === 'shiny_only'             ? currentEnemy.isShiny :
            captureMode === 'not_caught'             ? !alreadyHave :
            captureMode === 'not_caught_plus_shiny'  ? (!alreadyHave || currentEnemy.isShiny) :
            captureMode === 'specific'               ? (routeConfig.targetIds || []).includes(Number(currentEnemy.id)) :
            captureMode === 'specific_plus_shiny'    ? ((routeConfig.targetIds || []).includes(Number(currentEnemy.id)) || currentEnemy.isShiny) :
            false;`;

// Pokecenter Blur removals
const blurReplacements = [
  { target: "backdrop-blur-md", replacement: "" },
  { target: "bg-white/30", replacement: "bg-white/20" },
  { target: "bg-white/95", replacement: "bg-white/90" },
  { target: "bg-black/20 backdrop-blur-md", replacement: "bg-black/40" },
  { target: "hover:bg-black/40", replacement: "hover:bg-black/60" }
];

// Apply stable changes
content = content.replace(shouldCaptureTarget, shouldCaptureReplacement);

// Apply blur removals ONLY in Pokecenter/Heal blocks
// heal_after_defeat block (approx 4091-4138)
// pokecenter block (approx 4523-4589)
const healBlockStart = content.indexOf("case 'heal_after_defeat':");
const healBlockEnd = content.indexOf("default: return null;", healBlockStart);
let healBlock = content.substring(healBlockStart, healBlockEnd);

const centerBlockStart = content.indexOf("{activeBuildingModal === 'pokecenter' && (");
const centerBlockEnd = content.indexOf(")}", centerBlockStart) + 2;
let centerBlock = content.substring(centerBlockStart, centerBlockEnd);

blurReplacements.forEach(r => {
  healBlock = healBlock.split(r.target).join(r.replacement);
  centerBlock = centerBlock.split(r.target).join(r.replacement);
});

content = content.substring(0, healBlockStart) + healBlock + content.substring(healBlockEnd);
// Re-calculate centerBlockStart because content length changed
const newCenterBlockStart = content.indexOf("{activeBuildingModal === 'pokecenter' && (");
const newCenterBlockEnd = content.indexOf(")}", newCenterBlockStart) + 2;
content = content.substring(0, newCenterBlockStart) + centerBlock + content.substring(newCenterBlockEnd);

// 2. Mart/Forge cleanup
// Redundant Mart Card (4632-4643)
const martCardTarget = `                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" className="w-9 h-9 object-contain" alt="" />
                      </div>
                      <div className="flex-1">
                         <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">Poke Mart</h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Suprimentos de Viagem</p>
                      </div>
                      <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm flex items-center gap-1 shrink-0">
                         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {gameState.currency}
                      </div>
                   </div>`;

// Redundant Forge Card (4705-4716)
const forgeCardTarget = `                   <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png" className="w-9 h-9 object-contain" alt="" />
                      </div>
                      <div className="flex-1">
                         <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">Forja Pokemon</h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Materiais e Equipamentos</p>
                      </div>
                      <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm flex items-center gap-1 shrink-0">
                         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {gameState.currency}
                      </div>
                   </div>`;

content = content.replace(martCardTarget, "");
content = content.replace(forgeCardTarget, "");

// Header and Borders cleanup
const modalPanelTarget = `<div className="modal-panel-mobile bg-white shadow-2xl flex flex-col relative border-b-[8px] border-slate-800 animate-slideInUp overflow-hidden">`;
const modalPanelReplacement = `<div 
               className="modal-panel-mobile bg-white shadow-2xl flex flex-col relative animate-slideInUp overflow-hidden"
               style={{ 
                 borderBottom: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`,
                 borderLeft: \`2px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`,
                 borderRight: \`2px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`
               }}
            >`;

const headerTarget = `              <div
                className="px-5 py-4 flex items-center justify-between gap-3 shrink-0"
                style={{
                  background:
                    activeBuildingModal === 'mart' ? '#2563eb' :
                    '#475569'
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <img
                      src={
                        activeBuildingModal === 'mart'
                          ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                          : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png'
                      }
                      className="w-9 h-9 object-contain"
                      alt=""
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">
                      {activeBuildingModal === 'mart' ? 'Suprimentos' : 'Crafting'}
                    </p>
                    <h3 className="text-white text-lg font-black uppercase italic leading-tight truncate">
                      {activeBuildingModal === 'mart' ? 'Poke Mart' : 'Forja Pokemon'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveBuildingModal(null)}
                  className="w-9 h-9 rounded-full bg-white/20 text-white font-black flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
                  aria-label="Fechar"
                >
                  x
                </button>
              </div>`;

const headerReplacement = `              <div
                className="px-5 py-4 flex items-center justify-between gap-3 shrink-0"
                style={{
                  background:
                    activeBuildingModal === 'mart' ? '#2563eb' :
                    activeBuildingModal === 'forge' ? '#475569' :
                    '#1e293b'
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <img
                      src={
                        activeBuildingModal === 'mart'
                          ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                          : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png'
                      }
                      className="w-7 h-7 object-contain"
                      alt=""
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/70 text-[9px] font-black uppercase tracking-widest leading-none mb-0.5">
                      {activeBuildingModal === 'mart' ? 'Suprimentos' : 'Equipamentos'}
                    </p>
                    <h3 className="text-white text-base font-black uppercase italic leading-tight truncate">
                      {activeBuildingModal === 'mart' ? 'Poke Mart' : 'Forja Pokemon'}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="bg-black/20 px-3 py-1.5 rounded-xl font-black text-white text-[11px] flex items-center gap-1 shrink-0 border border-white/10 shadow-inner">
                      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> 
                      {gameState.currency}
                   </div>
                   <button
                     onClick={() => setActiveBuildingModal(null)}
                     className="w-8 h-8 rounded-full bg-white/20 text-white font-black flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
                     aria-label="Fechar"
                   >
                     x
                   </button>
                </div>
              </div>`;

content = content.replace(modalPanelTarget, modalPanelReplacement);
content = content.replace(headerTarget, headerReplacement);

fs.writeFileSync(path, content);
console.log('Successfully updated AppRoot.jsx');

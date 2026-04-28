const fs = require('fs');
const path = 'src/AppRoot.jsx';
let content = fs.readFileSync(path, 'utf8');

// --- 1. AUTO-CAPTURE HYBRID MODES ---
const scTarget = `          const shouldCapture =
            captureMode === 'all'        ? true :
            captureMode === 'shiny_only' ? currentEnemy.isShiny :
            captureMode === 'not_caught' ? !alreadyHave :
            captureMode === 'specific'   ? (routeConfig.targetIds || []).includes(Number(currentEnemy.id)) :
            false;`;
const scReplacement = `          const shouldCapture =
            captureMode === 'all'                    ? true :
            captureMode === 'shiny_only'             ? currentEnemy.isShiny :
            captureMode === 'not_caught'             ? !alreadyHave :
            captureMode === 'not_caught_plus_shiny'  ? (!alreadyHave || currentEnemy.isShiny) :
            captureMode === 'specific'               ? (routeConfig.targetIds || []).includes(Number(currentEnemy.id)) :
            captureMode === 'specific_plus_shiny'    ? ((routeConfig.targetIds || []).includes(Number(currentEnemy.id)) || currentEnemy.isShiny) :
            false;`;
content = content.replace(scTarget, scReplacement);

// --- 2. POKECENTER BLUR REMOVAL ---
// Surgical replacement for heal_after_defeat
const healSearch = "case 'heal_after_defeat':";
const healStart = content.indexOf(healSearch);
const healEnd = content.indexOf("default: return null;", healStart);
if (healStart !== -1) {
    let healBlock = content.substring(healStart, healEnd);
    healBlock = healBlock.replace('bg-white/30 backdrop-blur-md', 'bg-white/20');
    healBlock = healBlock.replace('bg-white/95 backdrop-blur-md', 'bg-white/90');
    content = content.substring(0, healStart) + healBlock + content.substring(healEnd);
}

// Surgical replacement for pokecenter modal
const centerSearch = "{activeBuildingModal === 'pokecenter' && (";
const centerStart = content.indexOf(centerSearch);
const centerEnd = content.indexOf(")}", centerStart) + 2;
if (centerStart !== -1) {
    let centerBlock = content.substring(centerStart, centerEnd);
    centerBlock = centerBlock.replace('bg-white/30 backdrop-blur-md', 'bg-white/20');
    centerBlock = centerBlock.replace('bg-black/20 backdrop-blur-md', 'bg-black/40');
    centerBlock = centerBlock.replace('hover:bg-black/40', 'hover:bg-black/60');
    centerBlock = centerBlock.replace('bg-white/95 backdrop-blur-md', 'bg-white/90');
    content = content.substring(0, centerStart) + centerBlock + content.substring(centerEnd);
}

// --- 3. MART / FORGE CLEANUP ---
const buildingSearch = "{(activeBuildingModal && activeBuildingModal !== 'pokecenter') && (";
const buildingStart = content.indexOf(buildingSearch);
// Find the end of the building modal block (it's big)
const buildingEnd = content.lastIndexOf(")}", content.indexOf("return (", buildingStart)) + 2;

if (buildingStart !== -1) {
    let bBlock = content.substring(buildingStart, buildingEnd);
    
    // Panel Wrapper
    const oldPanel = `<div className="modal-panel-mobile bg-white shadow-2xl flex flex-col relative border-b-[8px] border-slate-800 animate-slideInUp overflow-hidden">`;
    const newPanel = `<div 
               className="modal-panel-mobile bg-white shadow-2xl flex flex-col relative animate-slideInUp overflow-hidden"
               style={{ 
                 borderBottom: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`,
                 borderLeft: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`,
                 borderRight: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`
               }}
            >`;
    bBlock = bBlock.replace(oldPanel, newPanel);

    // Header
    const oldHeaderStart = bBlock.indexOf("<div");
    const oldHeaderEnd = bBlock.indexOf("</div>", bBlock.indexOf("</button>")) + 6;
    const newHeader = `              <div
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
    // We need to find the correct div index for the header. It's the first one inside the panel.
    const hStartIdx = bBlock.indexOf("<div", bBlock.indexOf("<div") + 1);
    const hEndIdx = bBlock.indexOf("</div>", bBlock.indexOf("</button>", hStartIdx)) + 6;
    bBlock = bBlock.substring(0, hStartIdx) + newHeader + bBlock.substring(hEndIdx);

    // Mart Card Removal
    const mCardSearch = "Suprimentos de Viagem";
    const mCardIdx = bBlock.indexOf(mCardSearch);
    if (mCardIdx !== -1) {
        const mP5Start = bBlock.indexOf('<div className="p-5 flex-1 flex flex-col overflow-hidden">', bBlock.indexOf("{activeBuildingModal === 'mart' && ("));
        const mListStart = bBlock.indexOf('<div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-4">', mCardIdx);
        const newMartLayout = `<div className="p-4 flex-1 flex flex-col overflow-hidden">
                   <div className="bg-amber-50/50 border border-amber-100 px-4 py-2 rounded-2xl flex items-center justify-end gap-2 mb-4 shrink-0">
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Saldo Atual:</span>
                      <div className="font-black text-amber-600 text-sm flex items-center gap-1.5">
                         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {gameState.currency}
                      </div>
                   </div>
                   <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-4">`;
        bBlock = bBlock.substring(0, mP5Start) + newMartLayout + bBlock.substring(mListStart + 86);
    }

    // Forge Card Removal
    const fCardSearch = "Materiais e Equipamentos";
    const fCardIdx = bBlock.indexOf(fCardSearch);
    if (fCardIdx !== -1) {
        const fP5Start = bBlock.indexOf('<div className="p-5 flex-1 flex flex-col overflow-hidden">', bBlock.indexOf("{activeBuildingModal === 'forge' && ("));
        const fListStart = bBlock.indexOf('<div className="flex gap-2 overflow-x-auto pb-3 mb-3">', fCardIdx);
        const newForgeLayout = `<div className="p-4 flex-1 flex flex-col overflow-hidden">
                   <div className="bg-amber-50/50 border border-amber-100 px-4 py-2 rounded-2xl flex items-center justify-end gap-2 mb-2 shrink-0">
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Saldo Atual:</span>
                      <div className="font-black text-amber-600 text-sm flex items-center gap-1.5">
                         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {gameState.currency}
                      </div>
                   </div>
                   <div className="flex gap-2 overflow-x-auto pb-3 mb-2 pt-1">`;
        bBlock = bBlock.substring(0, fP5Start) + newForgeLayout + bBlock.substring(fListStart + 53);
    }

    content = content.substring(0, buildingStart) + bBlock + content.substring(buildingEnd);
}

fs.writeFileSync(path, content);
console.log('Successfully finalized all UI changes in AppRoot.jsx');

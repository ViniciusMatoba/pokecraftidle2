const fs = require('fs');
const path = 'src/AppRoot.jsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// --- 1. AUTO-CAPTURE HYBRID MODES ---
// Lines 2696-2701 (approx)
const scStartLine = 2696 - 1; // 0-indexed
if (lines[scStartLine].includes('const shouldCapture =')) {
    lines.splice(scStartLine, 6, 
`          const shouldCapture =
            captureMode === 'all'                    ? true :
            captureMode === 'shiny_only'             ? currentEnemy.isShiny :
            captureMode === 'not_caught'             ? !alreadyHave :
            captureMode === 'not_caught_plus_shiny'  ? (!alreadyHave || currentEnemy.isShiny) :
            captureMode === 'specific'               ? (routeConfig.targetIds || []).includes(Number(currentEnemy.id)) :
            captureMode === 'specific_plus_shiny'    ? ((routeConfig.targetIds || []).includes(Number(currentEnemy.id)) || currentEnemy.isShiny) :
            false;`);
}

content = lines.join('\n');

// --- 2. POKECENTER / HEAL AFTER DEFEAT BLUR REMOVAL ---
// We'll use global replace for the specific unique strings in these blocks
const healStart = content.indexOf("case 'heal_after_defeat':");
const healEnd = content.indexOf("default: return null;", healStart);
let healBlock = content.substring(healStart, healEnd);

const centerStart = content.indexOf("{activeBuildingModal === 'pokecenter' && (");
const centerEnd = content.indexOf(")}", centerStart) + 2;
let centerBlock = content.substring(centerStart, centerEnd);

const blurReplacements = [
    { target: "backdrop-blur-md", replacement: "" },
    { target: "bg-white/30", replacement: "bg-white/20" },
    { target: "bg-white/95", replacement: "bg-white/90" },
    { target: "bg-black/20", replacement: "bg-black/40" },
    { target: "hover:bg-black/40", replacement: "hover:bg-black/60" }
];

blurReplacements.forEach(r => {
    healBlock = healBlock.split(r.target).join(r.replacement);
    centerBlock = centerBlock.split(r.target).join(r.replacement);
});

content = content.substring(0, healStart) + healBlock + content.substring(healEnd);
const newCenterStart = content.indexOf("{activeBuildingModal === 'pokecenter' && (");
const newCenterEnd = content.indexOf(")}", newCenterStart) + 2;
content = content.substring(0, newCenterStart) + centerBlock + content.substring(newCenterEnd);

// --- 3. MART / FORGE CLEANUP ---
const buildingBlockStart = content.indexOf("{(activeBuildingModal && activeBuildingModal !== 'pokecenter') && (");
const buildingBlockEnd = content.lastIndexOf(")}", content.indexOf("return (", buildingBlockStart)) + 2; // This is tricky, let's just find the whole block

// Better: find the specific parts within the building block
// A. Modal Panel and Header
const oldPanel = `<div className="modal-panel-mobile bg-white shadow-2xl flex flex-col relative border-b-[8px] border-slate-800 animate-slideInUp overflow-hidden">`;
const newPanel = `<div 
               className="modal-panel-mobile bg-white shadow-2xl flex flex-col relative animate-slideInUp overflow-hidden"
               style={{ 
                 borderBottom: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`,
                 borderLeft: \`2px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`,
                 borderRight: \`2px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`
               }}
            >`;
content = content.replace(oldPanel, newPanel);

const oldHeader = `              <div
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

// Use a more robust replace for the header because it might have minor whitespace diffs
const headerStartIdx = content.indexOf("activeBuildingModal === 'mart' ? '#2563eb' :");
if (headerStartIdx !== -1) {
    const headerBlockStart = content.lastIndexOf("<div", headerStartIdx);
    const headerBlockEnd = content.indexOf("</div>", headerStartIdx) + 6;
    const actualHeader = content.substring(headerBlockStart, headerBlockEnd);
    // Since there are two divs in the header block, we need to find the correct closing one
    const fullHeaderEnd = content.indexOf("</div>", content.indexOf("</button>", headerBlockStart)) + 6;
    content = content.substring(0, headerBlockStart) + newHeader + content.substring(fullHeaderEnd);
}

// B. Mart Redundant Card
const martCardStart = content.indexOf("activeBuildingModal === 'mart' && (");
const martTitleIdx = content.indexOf("Suprimentos de Viagem", martCardStart);
if (martTitleIdx !== -1) {
    const cardDivStart = content.lastIndexOf("<div", content.lastIndexOf("<div", martTitleIdx) - 1);
    const cardDivEnd = content.indexOf("</div>", martTitleIdx) + 6;
    // Actually, it's easier to find the div following the p-5 div
    const innerP5Start = content.indexOf('<div className="p-5 flex-1 flex flex-col overflow-hidden">', martCardStart);
    const innerCardStart = content.indexOf('<div className="flex items-center gap-4 mb-6">', innerP5Start);
    const innerCardEnd = content.indexOf('</div>', content.indexOf('{gameState.currency}', innerCardStart)) + 12; // Closing the card div
    // We want to remove lines 4639 to 4650 approx
    const replacement = `<div className="p-4 flex-1 flex flex-col overflow-hidden">
                   <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-4 pt-1">`;
    const targetRangeStart = innerP5Start;
    const targetRangeEnd = content.indexOf('<div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-4">', innerCardEnd) + 86;
    content = content.substring(0, targetRangeStart) + replacement + content.substring(targetRangeEnd);
}

// C. Forge Redundant Card
const forgeCardStart = content.indexOf("activeBuildingModal === 'forge' && (");
const forgeTitleIdx = content.indexOf("Materiais e Equipamentos", forgeCardStart);
if (forgeTitleIdx !== -1) {
    const innerP5Start = content.indexOf('<div className="p-5 flex-1 flex flex-col overflow-hidden">', forgeCardStart);
    const innerCardStart = content.indexOf('<div className="flex items-center gap-4 mb-5">', innerP5Start);
    const innerCardEnd = content.indexOf('</div>', content.indexOf('{gameState.currency}', innerCardStart)) + 12;
    const replacement = `<div className="p-4 flex-1 flex flex-col overflow-hidden">
                   <div className="flex gap-2 overflow-x-auto pb-3 mb-2 pt-1">`;
    const targetRangeStart = innerP5Start;
    const targetRangeEnd = content.indexOf('<div className="flex gap-2 overflow-x-auto pb-3 mb-3">', innerCardEnd) + 53;
    content = content.substring(0, targetRangeStart) + replacement + content.substring(targetRangeEnd);
}

fs.writeFileSync(path, content);
console.log('Successfully applied all fixes to AppRoot.jsx');

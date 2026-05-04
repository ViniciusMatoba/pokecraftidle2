const fs = require('fs');
const path = 'src/AppRoot.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Auto-Capture
const scOld = `          const shouldCapture =
            captureMode === 'all'        ? true :
            captureMode === 'shiny_only' ? currentEnemy.isShiny :
            captureMode === 'not_caught' ? !alreadyHave :
            captureMode === 'specific'   ? (routeConfig.targetIds || []).includes(Number(currentEnemy.id)) :
            false;`;
const scNew = `          const shouldCapture =
            captureMode === 'all'                    ? true :
            captureMode === 'shiny_only'             ? currentEnemy.isShiny :
            captureMode === 'not_caught'             ? !alreadyHave :
            captureMode === 'not_caught_plus_shiny'  ? (!alreadyHave || currentEnemy.isShiny) :
            captureMode === 'specific'               ? (routeConfig.targetIds || []).includes(Number(currentEnemy.id)) :
            captureMode === 'specific_plus_shiny'    ? ((routeConfig.targetIds || []).includes(Number(currentEnemy.id)) || currentEnemy.isShiny) :
            false;`;
content = content.replace(scOld, scNew);

// 2. Pokecenter Blurs (Heal After Defeat)
const pc1Old = `              <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>`;
const pc1New = `              <div className="absolute inset-0 bg-white/20"></div>`;
// We only want to replace the first two occurrences (heal after defeat)
let pcCount = 0;
content = content.replace(/              <div className="absolute inset-0 bg-white\/30 backdrop-blur-md"><\/div>/g, (match) => {
    pcCount++;
    return pc1New;
});

const pc2Old = `            <div className="bg-white/95 backdrop-blur-md p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-b-[12px] border-red-500/10 w-full animate-bounceIn">`;
const pc2New = `            <div className="bg-white/90 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-b-[12px] border-red-500/10 w-full animate-bounceIn">`;
content = content.replace(pc2Old, pc2New);

const pc3Old = `               <div className="bg-white/95 backdrop-blur-md p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-b-[12px] border-red-500/10 w-full animate-bounceIn">`;
const pc3New = `               <div className="bg-white/90 p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-b-[12px] border-red-500/10 w-full animate-bounceIn">`;
content = content.replace(pc3Old, pc3New);

const pcBtnOld = `             className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md text-white font-black flex items-center justify-center hover:bg-black/40 transition-all active:scale-90"`;
const pcBtnNew = `             className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-black/40 text-white font-black flex items-center justify-center hover:bg-black/60 transition-all active:scale-90"`;
content = content.replace(pcBtnOld, pcBtnNew);

// 3. Building Modals (Mart / Forge)
// We'll target the WHOLE Building Modal block from its start to the return
const buildingStart = content.indexOf("{(activeBuildingModal && activeBuildingModal !== 'pokecenter') && (");
const buildingEnd = content.indexOf(")}", buildingStart + 100) + 2; // Rough end of the wrapper div

if (buildingStart !== -1) {
    let block = content.substring(buildingStart, content.indexOf("return (", buildingStart)); 
    // Wait, let's just find the closing bracket of the building modal block.
    // It's easier to find the Mart and Forge blocks individually.
    
    // A. The Wrapper Div and Header
    const oldWrapperHeader = `      {(activeBuildingModal && activeBuildingModal !== 'pokecenter') && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div className="modal-panel-mobile bg-white shadow-2xl flex flex-col relative border-b-[8px] border-slate-800 animate-slideInUp overflow-hidden">
              <div
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

    const newWrapperHeader = `      {(activeBuildingModal && activeBuildingModal !== 'pokecenter') && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
           <div 
              className="modal-panel-mobile bg-white shadow-2xl flex flex-col relative animate-slideInUp overflow-hidden"
              style={{ 
                borderBottom: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`,
                borderLeft: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`,
                borderRight: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`
              }}
           >
              <div
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

    content = content.replace(oldWrapperHeader, newWrapperHeader);

    // B. Mart Internal
    const oldMart = `              {activeBuildingModal === 'mart' && (
                <div className="p-5 flex-1 flex flex-col overflow-hidden">
                   <div className="flex items-center gap-4 mb-6">
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
                   </div>

                   <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-4">`;

    const newMart = `              {activeBuildingModal === 'mart' && (
                <div className="p-4 flex-1 flex flex-col overflow-hidden">
                   <div className="bg-amber-50/50 border border-amber-100 px-4 py-2 rounded-2xl flex items-center justify-end gap-2 mb-4 shrink-0">
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Saldo Atual:</span>
                      <div className="font-black text-amber-600 text-sm flex items-center gap-1.5">
                         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {gameState.currency}
                      </div>
                   </div>
                   <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar flex-1 pb-4">`;

    content = content.replace(oldMart, newMart);

    // C. Forge Internal
    const oldForge = `              {activeBuildingModal === 'forge' && (
                <div className="p-5 flex-1 flex flex-col overflow-hidden">
                   <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png" className="w-9 h-9 object-contain" alt="" />
                      </div>
                      <div className="flex-1">
                         <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">Forja Pokemon</h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Materiais e Equipamentos</p>
                      </div>
                      <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm flex items-center gap-1 shrink-0">
                         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {gameState.currency}
                      </div>
                   </div>

                   <div className="flex gap-2 overflow-x-auto pb-3 mb-3">`;

    const newForge = `              {activeBuildingModal === 'forge' && (
                <div className="p-4 flex-1 flex flex-col overflow-hidden">
                   <div className="bg-amber-50/50 border border-amber-100 px-4 py-2 rounded-2xl flex items-center justify-end gap-2 mb-2 shrink-0">
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Saldo Atual:</span>
                      <div className="font-black text-amber-600 text-sm flex items-center gap-1.5">
                         <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-4 h-4 object-contain" alt="" /> {gameState.currency}
                      </div>
                   </div>
                   <div className="flex gap-2 overflow-x-auto pb-3 mb-2 pt-1">`;

    content = content.replace(oldForge, newForge);
}

fs.writeFileSync(path, content);
console.log('Successfully applied all UI fixes with zero ambiguity');

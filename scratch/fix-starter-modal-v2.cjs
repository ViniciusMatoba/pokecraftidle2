const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

// 1. Close button
const closeBtnOld = /<button onClick=\{\(\) => setPreviewStarter\(null\)\} className="absolute top-8 right-8 bg-slate-100 p-4 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-20">[\s\S]*?<\/button>/;
const closeBtnNew = `<button
                         onClick={() => setPreviewStarter(null)}
                         style={{
                           position:'absolute', top:'12px', right:'12px',
                           width:'36px', height:'36px', borderRadius:'50%',
                           background:'rgba(0,0,0,0.2)', border:'none',
                           color:'white', fontSize:'18px', fontWeight:900,
                           cursor:'pointer', display:'flex',
                           alignItems:'center', justifyContent:'center',
                           lineHeight:1,
                           zIndex: 20
                         }}
                       >
                         ✕
                       </button>`;

if (closeBtnOld.test(c)) {
    c = c.replace(closeBtnOld, closeBtnNew);
}

// 2. Padding
const paddingOld = /<div className="p-10 pt-20">/;
const paddingNew = `<div style={{
                         background:'white',
                         borderRadius:'0 0 24px 24px',
                         padding:'20px 20px 24px 20px',
                       }}>`;

if (paddingOld.test(c)) {
    c = c.replace(paddingOld, paddingNew);
}

// 3. Selection button
const selectBtnOld = /<button\s*onClick=\{\(\) => \{[\s\S]*?\}\}\s*className="w-full mt-10 bg-pokeBlue text-white py-6 rounded-3xl font-black uppercase tracking-widest text-lg shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"\s*>\s*EU ESCOLHO VOC.*?!\s*<\/button>/;
const selectBtnNew = `<button 
                            onClick={() => {
                              const p = previewStarter;
                               const myPoke = { 
                                 ...p, 
                                 hp: p.maxHp, 
                                 xp: 0, 
                                 instanceId: Date.now(), 
                                 status: [],
                                 stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 }
                               };

                              setGameState(prev => ({ 
                                ...prev, 
                                team: [myPoke],
                                caughtData: { ...prev.caughtData, [p.id]: true },
                                worldFlags: [...(prev.worldFlags || []), 'has_starter'],
                                 inventory: {
                                   ...prev.inventory,
                                   items: {
                                     ...prev.inventory.items,
                                     fresh_water: (prev.inventory.items?.fresh_water || 0) + 10,
                                   },
                                 },
                                 oakTutorialShown: true
                              })); 
                              
                              setTimeout(() => setShowOakStaminaModal(true), 600);
                              setPreviewStarter(null);
                              setCurrentView('rival_intro'); 
                            }}
                            style={{
                              width:'100%', padding:'18px',
                              borderRadius:'16px', border:'none',
                              background:'#1d4ed8', color:'white',
                              fontWeight:900, fontSize:'16px',
                              textTransform:'uppercase', letterSpacing:'2px',
                              cursor:'pointer', boxShadow:'0 4px 12px rgba(29,78,216,0.4)',
                              marginTop:'16px',
                            }}
                          >
                            EU ESCOLHO VOCE!
                          </button>`;

if (selectBtnOld.test(c)) {
    c = c.replace(selectBtnOld, selectBtnNew);
    fs.writeFileSync('src/AppRoot.jsx', c);
    console.log('Success');
} else {
    console.log('Regex 3 failed');
}

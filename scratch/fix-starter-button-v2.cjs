const fs = require('fs');
let lines = fs.readFileSync('src/AppRoot.jsx', 'utf8').split(/\r?\n/);

const startLine = 3037; // 1-indexed
const endLine = 3071;

const newButton = [
    `                          <button `,
    `                            onClick={() => {`,
    `                              const p = previewStarter;`,
    `                               const myPoke = { `,
    `                                 ...p, `,
    `                                 hp: p.maxHp, `,
    `                                 xp: 0, `,
    `                                 instanceId: Date.now(), `,
    `                                 status: [],`,
    `                                 stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 }`,
    `                               };`,
    ``,
    `                              setGameState(prev => ({ `,
    `                                ...prev, `,
    `                                team: [myPoke],`,
    `                                caughtData: { ...prev.caughtData, [p.id]: true },`,
    `                                worldFlags: [...(prev.worldFlags || []), 'has_starter'],`,
    `                                 inventory: {`,
    `                                   ...prev.inventory,`,
    `                                   items: {`,
    `                                     ...prev.inventory.items,`,
    `                                     fresh_water: (prev.inventory.items?.fresh_water || 0) + 10,`,
    `                                   },`,
    `                                 },`,
    `                                 oakTutorialShown: true`,
    `                              })); `,
    `                              `,
    `                              setTimeout(() => setShowOakStaminaModal(true), 600);`,
    `                              setPreviewStarter(null);`,
    `                              setCurrentView('rival_intro'); `,
    `                            }}`,
    `                            style={{`,
    `                              width: '100%',`,
    `                              padding: '18px',`,
    `                              marginTop: '16px',`,
    `                              borderRadius: '16px',`,
    `                              background: '#1d4ed8',`,
    `                              color: 'white',`,
    `                              fontWeight: 900,`,
    `                              fontSize: '16px',`,
    `                              textTransform: 'uppercase',`,
    `                              letterSpacing: '2px',`,
    `                              border: 'none',`,
    `                              cursor: 'pointer',`,
    `                              boxShadow: '0 4px 12px rgba(29,78,216,0.4)',`,
    `                            }}`,
    `                          >`,
    `                            EU ESCOLHO VOCE!`,
    `                          </button>`
];

lines.splice(startLine - 1, (endLine - startLine) + 1, ...newButton);

fs.writeFileSync('src/AppRoot.jsx', lines.join('\n'));
console.log('Success');

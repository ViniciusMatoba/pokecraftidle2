const fs = require('fs');
let lines = fs.readFileSync('src/AppRoot.jsx', 'utf8').split(/\r?\n/);

const startLine = 2970;
const endLine = 2972;

const newButton = [
    `                      <button`,
    `                        onClick={() => setPreviewStarter(null)}`,
    `                        style={{`,
    `                          position: 'absolute',`,
    `                          top: '12px',`,
    `                          right: '12px',`,
    `                          width: '32px',`,
    `                          height: '32px',`,
    `                          borderRadius: '50%',`,
    `                          background: 'rgba(0,0,0,0.35)',`,
    `                          border: '2px solid rgba(255,255,255,0.5)',`,
    `                          color: 'white',`,
    `                          fontSize: '14px',`,
    `                          fontWeight: 900,`,
    `                          cursor: 'pointer',`,
    `                          display: 'flex',`,
    `                          alignItems: 'center',`,
    `                          justifyContent: 'center',`,
    `                          lineHeight: 1,`,
    `                          backdropFilter: 'blur(4px)',`,
    `                          zIndex: 30,`,
    `                        }}`,
    `                      >`,
    `                        ✕`,
    `                      </button>`
];

lines.splice(startLine - 1, (endLine - startLine) + 1, ...newButton);

fs.writeFileSync('src/AppRoot.jsx', lines.join('\n'));
console.log('Success');

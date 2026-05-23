const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

const closeBtnRegex = /<button onClick=\{\(\) => setPreviewStarter\(null\)\} className="absolute top-8 right-8 bg-slate-100 p-4 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-20">[\s\S]*?<\/button>/;
const closeBtnReplacement = `<button
                        onClick={() => setPreviewStarter(null)}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.25)',
                          border: 'none',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 20,
                        }}
                      >
                        X
                      </button>`;

if (closeBtnRegex.test(c)) {
    c = c.replace(closeBtnRegex, closeBtnReplacement);
    fs.writeFileSync('src/AppRoot.jsx', c);
    console.log('Success');
} else {
    console.log('Regex failed');
}

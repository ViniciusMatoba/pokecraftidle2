const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

// Target the button with the specific class and text
const selectBtnRegex = /<button\s*onClick=\{\(\) => \{[\s\S]*?\}\}\s*className="w-full mt-10 bg-pokeBlue text-white py-6 rounded-3xl font-black uppercase tracking-widest text-lg shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95"\s*>\s*EU ESCOLHO VOC.*?!\s*<\/button>/;

// We need to extract the onClick logic from the existing button to preserve it
const match = c.match(selectBtnRegex);
if (match) {
    const originalCode = match[0];
    const onClickLogic = originalCode.match(/onClick=\{\(\) => \{([\s\S]*?)\}\}/)[1];
    
    const newButton = `<button
  onClick={() => {${onClickLogic}}}
  style={{
    width: '100%',
    padding: '18px',
    marginTop: '16px',
    borderRadius: '16px',
    background: '#1d4ed8',
    color: 'white',
    fontWeight: 900,
    fontSize: '16px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(29,78,216,0.4)',
  }}
>
  EU ESCOLHO VOCE!
</button>`;

    c = c.replace(selectBtnRegex, newButton);
    fs.writeFileSync('src/AppRoot.jsx', c);
    console.log('Success');
} else {
    console.log('Regex failed - Button not found');
}

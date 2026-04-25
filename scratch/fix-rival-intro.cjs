const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

// Specific regex for the rival dialogue container
const rivalDialogRegex = /<div className="w-full relative z-10 p-4">[\s\S]*?<\/div>\s*<\/div>/;
const rivalDialogReplacement = `<div style={{
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'white',
  borderRadius: '24px 24px 0 0',
  padding: '16px 20px 20px 20px',
  boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
  zIndex: 10,
}}>
  {/* Label do rival */}
  <p style={{
    fontSize: '11px',
    fontWeight: 900,
    color: '#dc2626',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  }}>
    RIVAL — AZUL:
  </p>

  {/* Texto do diálogo */}
  <p style={{
    fontSize: '14px',
    fontWeight: 700,
    color: '#1e293b',
    lineHeight: '1.5',
    marginBottom: '14px',
  }}>
    "Ei, espere aí! Eu também quero um POKÉMON! E eu vou escolher este aqui! Vejamos quem é o melhor treinador!"
  </p>

  {/* Botão BATALHAR */}
  <button
    onClick={startBattleAgainstRival}
    style={{
      width: '100%',
      padding: '16px',
      borderRadius: '16px',
      background: '#dc2626',
      color: 'white',
      fontWeight: 900,
      fontSize: '16px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(220,38,38,0.4)',
    }}
  >
    BATALHAR!
  </button>
</div>`;

if (rivalDialogRegex.test(c)) {
    c = c.replace(rivalDialogRegex, rivalDialogReplacement);
    fs.writeFileSync('src/AppRoot.jsx', c);
    console.log('Success');
} else {
    console.log('Regex failed');
}

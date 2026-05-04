const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

// Normalize line endings to \n
c = c.replace(/\r\n/g, '\n');

// 1. Protect trainer_creation
if (!c.includes('{/* ⛔ PROTECTED: Tela de Avatar')) {
    c = c.replace("case 'trainer_creation': {", "case 'trainer_creation': {\n        {/* ⛔ PROTECTED: Tela de Avatar — NÃO ALTERAR SEM AUTORIZAÇÃO */}");
}

// 2. Replace starter_selection with the NEW design
const starterSelectionRegex = /case 'starter_selection': return \([\s\S]*?\);/;

const replacement = `      case 'starter_selection': return (
        <div style={{paddingTop:'24px', display:'flex', flexDirection:'column', alignItems:'center', height:'100%', background:'#f8fafc', overflowY:'auto'}}>

          {/* Título com espaço do header */}
          <div style={{textAlign:'center', marginBottom:'20px', padding:'0 16px'}}>
            <h2 style={{fontSize:'22px', fontWeight:900, textTransform:'uppercase', fontStyle:'italic', color:'#1e293b', lineHeight:1.1, margin:0}}>
              ESCOLHA SEU PARCEIRO
            </h2>
            <p style={{fontSize:'11px', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'2px', marginTop:'6px', margin:0}}>
              Cada jornada começa com um único passo
            </p>
          </div>

          {/* Cards dos starters */}
          <div style={{display:'flex', flexDirection:'column', gap:'10px', width:'100%', maxWidth:'400px', padding:'0 16px 24px 16px'}}>
            {INITIAL_POKEMONS.map(starter => (
              <button
                key={starter.id}
                onClick={() => setPreviewStarter(starter)}
                style={{
                  display:'flex', alignItems:'center', gap:'16px',
                  padding:'16px 20px', borderRadius:'20px',
                  border: '2px solid',
                  borderColor: previewStarter?.id === starter.id ? '#2563eb' : '#e2e8f0',
                  background: previewStarter?.id === starter.id ? '#eff6ff' : 'white',
                  cursor:'pointer', transition:'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  width:'100%', textAlign:'left',
                  flexShrink: 0
                }}
              >
                <img
                  src={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + starter.id + '.png'}
                  style={{width:'64px', height:'64px', objectFit:'contain', flexShrink:0}}
                  alt={starter.name}
                />
                <div style={{flex:1}}>
                  <p style={{fontWeight:900, fontSize:'16px', textTransform:'uppercase', fontStyle:'italic', color:'#1e293b', margin:0}}>
                    {starter.name}
                  </p>
                  <div style={{display:'flex', alignItems:'center', gap:'8px', marginTop:'4px'}}>
                    <span style={{
                      fontSize:'10px', fontWeight:900, textTransform:'uppercase',
                      padding:'2px 8px', borderRadius:'8px', color:'white',
                      background: starter.type === 'Grass' ? '#16a34a' : starter.type === 'Fire' ? '#dc2626' : starter.type === 'Water' ? '#2563eb' : starter.type === 'Electric' ? '#ca8a04' : '#64748b'
                    }}>
                      {starter.type}
                    </span>
                    <span style={{fontSize:'11px', color:'#94a3b8', fontWeight:700}}>
                      VER DETALHES
                    </span>
                  </div>
                </div>
                <span style={{fontSize:'14px', fontWeight:900, color:'#cbd5e1'}}>
                  #{String(starter.id).padStart(3,'0')}
                </span>
              </button>
            ))}
          </div>
        </div>
      );`;

if (starterSelectionRegex.test(c)) {
    c = c.replace(starterSelectionRegex, replacement);
    fs.writeFileSync('src/AppRoot.jsx', c);
    console.log('Success');
} else {
    console.log('Fail - Regex did not match');
}

const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

// 1. Add states
if (!c.includes('const [selectedAvatar, setSelectedAvatar]')) {
    c = c.replace('const [loading, setLoading] = useState(true);', 'const [loading, setLoading] = useState(true);\n  const [selectedAvatar, setSelectedAvatar] = useState(null);\n  const [avatarTab, setAvatarTab] = useState(\'male\');');
}

// 2. Add handleSelectAvatar
const helper = `  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    setGameState(prev => ({ 
      ...prev, 
      trainer: { ...prev.trainer, level: 1, xp: 0, avatarImg: avatar.img } 
    })); 
    setTimeout(() => {
      setCurrentView('starter_selection');
      setSelectedAvatar(null);
    }, 400);
  };`;

if (!c.includes('const handleSelectAvatar =')) {
    const sessionRefPoint = c.indexOf('const sessionRef = useRef(');
    const insertPoint = c.indexOf(';', sessionRefPoint) + 1;
    c = c.slice(0, insertPoint) + '\n\n' + helper + c.slice(insertPoint);
}

// 3. Trainer Creation update
const trainerCreationRegex = /case 'trainer_creation': return \([\s\S]*?<\/div>\s*\);/;
const trainerReplacement = `      case 'trainer_creation': {
        const maleAvatars = trainerAvatars.filter(a => 
          ['red', 'ethan', 'brendan', 'lucas', 'hilbert', 'calem'].includes(a.id)
        );

        const femaleAvatars = trainerAvatars.filter(a => 
          ['leaf', 'lyra', 'may', 'dawn', 'hilda', 'serena'].includes(a.id)
        );

        return (
          <>
            {/* ⛔ PROTECTED: Tela de Avatar — NÃO ALTERAR SEM AUTORIZAÇÃO */}
            <div className="h-full bg-slate-50 flex flex-col items-center justify-start p-6 animate-fadeIn relative overflow-y-auto">
               <div style={{paddingTop: '24px', textAlign: 'center', marginBottom: '16px'}}>
                 <h2 className="text-4xl font-black text-slate-800 uppercase italic mb-1 tracking-tighter">Muito bem, {gameState.trainer?.name}!</h2>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Escolha seu Avatar</p>
               </div>
               
               <div style={{display:'flex', flexDirection:'column', width:'100%', maxWidth:'360px', margin:'0 auto', padding:'24px', background:'white', borderRadius:'3rem', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)', borderBottom:'8px solid #e2e8f0'}}>
                  <div style={{display:'flex', gap:'8px', marginBottom:'16px', padding:'0 4px'}}>
                    <button onClick={() => setAvatarTab('male')} style={{flex: 1, padding: '12px', borderRadius: '16px', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: avatarTab === 'male' ? '#2563eb' : '#e2e8f0', color: avatarTab === 'male' ? 'white' : '#64748b'}}>♂ Masculino</button>
                    <button onClick={() => setAvatarTab('female')} style={{flex: 1, padding: '12px', borderRadius: '16px', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: avatarTab === 'female' ? '#db2777' : '#e2e8f0', color: avatarTab === 'female' ? 'white' : '#64748b'}}>♀ Feminino</button>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'8px'}}>
                    {(avatarTab === 'male' ? maleAvatars : femaleAvatars).map(avatar => (
                      <button key={avatar.id} onClick={() => handleSelectAvatar(avatar)} style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 8px', borderRadius:'16px', border:'2px solid', borderColor: selectedAvatar?.id === avatar.id ? (avatarTab === 'male' ? '#2563eb' : '#db2777') : '#e2e8f0', background: selectedAvatar?.id === avatar.id ? (avatarTab === 'male' ? '#eff6ff' : '#fdf2f8') : 'white', cursor:'pointer', transition:'all 0.2s', opacity: (selectedAvatar && selectedAvatar.id !== avatar.id) ? 0.5 : 1, transform: selectedAvatar?.id === avatar.id ? 'scale(0.95)' : 'none'}}>
                        <img src={avatar.img} style={{width:'80px', height:'80px', objectFit:'contain'}} alt={avatar.name} onError={e => { e.target.closest('button').style.display='none'; }} />
                        <span style={{fontSize:'10px', fontWeight:900, color:'#475569', textTransform:'uppercase', marginTop:'8px'}}>{avatar.name}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </>
        );
      }`;

if (trainerCreationRegex.test(c)) {
    c = c.replace(trainerCreationRegex, trainerReplacement);
}

// 4. Starter Selection update - Using a simpler marker-based extraction
const starterCaseStartIdx = c.indexOf("case 'starter_selection': return (");
if (starterCaseStartIdx !== -1) {
    const modalMarker = "{/* MODAL DE PREVIEW */}";
    const modalMarkerIdx = c.indexOf(modalMarker);
    const starterCaseEndIdx = c.indexOf("case 'rival_intro':", starterCaseStartIdx);

    if (modalMarkerIdx !== -1 && starterCaseEndIdx !== -1) {
        // Extract from marker to the end of the return statement (which is just before case 'rival_intro')
        // The return block for starter_selection ends with ); 
        const returnEndIdx = c.lastIndexOf(");", starterCaseEndIdx);
        
        if (returnEndIdx !== -1 && returnEndIdx > modalMarkerIdx) {
            const modalContent = c.substring(modalMarkerIdx, returnEndIdx);
            console.log('Extracted modal length:', modalContent.length);

            const starterReplacement = `      case 'starter_selection': return (
        <div style={{position:'relative', height:'100%', width:'100%', overflow:'hidden'}}>
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
          
          ` + modalContent + `
        </div>
      );`;

            const finalCode = c.substring(0, starterCaseStartIdx) + starterReplacement + c.substring(returnEndIdx + 2);
            fs.writeFileSync('src/AppRoot.jsx', finalCode);
            console.log('Success');
        }
    }
}

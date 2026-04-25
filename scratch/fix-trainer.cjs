const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

// Normalize line endings to \n for consistent replacement
c = c.replace(/\r\n/g, '\n');

// 1. Add states
if (!c.includes('const [selectedAvatar, setSelectedAvatar]')) {
    c = c.replace('const [loading, setLoading] = useState(true);', 'const [loading, setLoading] = useState(true);\n  const [selectedAvatar, setSelectedAvatar] = useState(null);\n  const [avatarTab, setAvatarTab] = useState(\'male\');');
} else if (!c.includes('const [avatarTab, setAvatarTab]')) {
    c = c.replace('const [selectedAvatar, setSelectedAvatar] = useState(null);', 'const [selectedAvatar, setSelectedAvatar] = useState(null);\n  const [avatarTab, setAvatarTab] = useState(\'male\');');
}

// 2. Add helper
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

// 3. Replace trainer_creation with the TABBED layout
const trainerCreationRegex = /case 'trainer_creation': {[\s\S]*?return \(\s*<div className="h-full bg-slate-50[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}/;

const replacement = `      case 'trainer_creation': {
        const maleAvatars = trainerAvatars.filter(a => 
          ['red', 'ethan', 'brendan', 'lucas', 'hilbert', 'calem'].includes(a.id)
        );

        const femaleAvatars = trainerAvatars.filter(a => 
          ['leaf', 'lyra', 'may', 'dawn', 'hilda', 'serena'].includes(a.id)
        );

        return (
          <div className="h-full bg-slate-50 flex flex-col items-center justify-start p-6 animate-fadeIn relative overflow-y-auto">
             {/* Título com Padding corrigido */}
             <div style={{paddingTop: '24px', textAlign: 'center', marginBottom: '16px'}}>
               <h2 className="text-4xl font-black text-slate-800 uppercase italic mb-1 tracking-tighter">Muito bem, {gameState.trainer?.name}!</h2>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Escolha seu Avatar</p>
             </div>
             
             <div style={{display:'flex', flexDirection:'column', width:'100%', maxWidth:'360px', margin:'0 auto', padding:'24px', background:'white', borderRadius:'3rem', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)', borderBottom:'8px solid #e2e8f0'}}>
                
                {/* Abas seletoras */}
                <div style={{display:'flex', gap:'8px', marginBottom:'16px', padding:'0 4px'}}>
                  <button
                    onClick={() => setAvatarTab('male')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '16px', fontWeight: 900,
                      fontSize: '13px', textTransform: 'uppercase', border: 'none',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: avatarTab === 'male' ? '#2563eb' : '#e2e8f0',
                      color: avatarTab === 'male' ? 'white' : '#64748b',
                    }}
                  >
                    ♂ Masculino
                  </button>
                  <button
                    onClick={() => setAvatarTab('female')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '16px', fontWeight: 900,
                      fontSize: '13px', textTransform: 'uppercase', border: 'none',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: avatarTab === 'female' ? '#db2777' : '#e2e8f0',
                      color: avatarTab === 'female' ? 'white' : '#64748b',
                    }}
                  >
                    ♀ Feminino
                  </button>
                </div>

                {/* Grid condicional */}
                <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'8px'}}>
                  {(avatarTab === 'male' ? maleAvatars : femaleAvatars).map(avatar => (
                    <button
                      key={avatar.id}
                      onClick={() => handleSelectAvatar(avatar)}
                      style={{
                        display:'flex', flexDirection:'column', alignItems:'center',
                        padding:'16px 8px', borderRadius:'16px', border:'2px solid',
                        borderColor: selectedAvatar?.id === avatar.id 
                          ? (avatarTab === 'male' ? '#2563eb' : '#db2777')
                          : '#e2e8f0',
                        background: selectedAvatar?.id === avatar.id 
                          ? (avatarTab === 'male' ? '#eff6ff' : '#fdf2f8')
                          : 'white',
                        cursor:'pointer', transition:'all 0.2s',
                        opacity: (selectedAvatar && selectedAvatar.id !== avatar.id) ? 0.5 : 1,
                        transform: selectedAvatar?.id === avatar.id ? 'scale(0.95)' : 'none'
                      }}
                    >
                      <img src={avatar.img} style={{width:'80px', height:'80px', objectFit:'contain'}}
                        alt={avatar.name}
                        onError={e => { e.target.closest('button').style.display='none'; }} />
                      <span style={{fontSize:'10px', fontWeight:900, color:'#475569', textTransform:'uppercase', marginTop:'8px'}}>
                        {avatar.name}
                      </span>
                    </button>
                  ))}
                </div>
             </div>
          </div>
        );
      }`;

if (trainerCreationRegex.test(c)) {
    c = c.replace(trainerCreationRegex, replacement);
    fs.writeFileSync('src/AppRoot.jsx', c);
    console.log('Success');
} else {
    console.log('Fail - Regex did not match current content');
    // Debugging match
    const match = c.match(/case 'trainer_creation': {[\s\S]*?return \(\s*<div className="h-full bg-slate-50/);
    if (match) {
        console.log('Partial match found at start');
        // Find where it ends
    }
}

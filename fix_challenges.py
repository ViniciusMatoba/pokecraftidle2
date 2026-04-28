import re
with open('src/components/ChallengesScreen.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

pattern1 = re.compile(r'const ChallengesScreen = \(\{.*?\}\) => \{.*?const \[selectedCategory, setSelectedCategory\] = useState\(initialCategory \|\| \(filterCategories \? filterCategories\[0\] : \'rival\'\)\);', re.DOTALL)

replacement1 = '''const ChallengesScreen = ({ 
  gameState, onChallenge, onClose, isEmbedded = false, 
  filterCategories = null, setCurrentView, setVsInitialTab,
  initialCategory, setVsInitialCategory 
}) => {
  const kantoChampion = (gameState.worldFlags || []).includes('champion');
  const [challengeRegion, setChallengeRegion] = React.useState('kanto');
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory || (filterCategories ? filterCategories[0] : 'rival'));
  const [alertMessage, setAlertMessage] = React.useState(null);

  React.useEffect(() => {
    if (!kantoChampion && challengeRegion === 'johto') setChallengeRegion('kanto');
  }, [kantoChampion, challengeRegion]);'''

text = pattern1.sub(replacement1, text, count=1)

pattern2 = re.compile(r'const filtered = CHALLENGES.filter\(c => c.category === selectedCategory\);')
replacement2 = '''const filtered = CHALLENGES.filter(c => c.category === selectedCategory && (filterCategories ? true : c.region === challengeRegion));'''
text = pattern2.sub(replacement2, text, count=1)

pattern3 = re.compile(r'\{\(!isEmbedded \|\| \(filterCategories && filterCategories\.length > 1\)\) && \(\s*<div className=\"flex p-4 gap-3 bg-slate-900 border-b border-white/5 justify-center\">\s*<div className=\"flex w-full max-w-sm gap-2\">\s*\{Object\.entries\(CATEGORY_CONFIG\)\s*\.filter\(\(\[id\]\) => !filterCategories \|\| filterCategories\.includes\(id\)\)\s*\.map\(\(\[id, cfg\]\) => \(\s*<button\s*key=\{id\}\s*onClick=\{\(\) => setSelectedCategory\(id\)\}\s*className=\{`flex-1 py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-2 border \$\{\s*selectedCategory === id \s*\? \'bg-white text-slate-950 border-white font-black\' \s*: \'bg-white/5 text-white/40 border-white/5 font-bold hover:bg-white/10\'\s*\}\`\}\s*>\s*<span className=\"text-sm\">\{cfg\.emoji\}</span>\s*<span className=\"text-\[9px\] uppercase tracking-tighter\">\{cfg\.label\}</span>\s*</button>\s*\)\)\}\s*</div>\s*</div>\s*\)\}', re.DOTALL)

replacement3 = '''{(!isEmbedded || (filterCategories && filterCategories.length > 1)) && (
          <div className="flex flex-col p-4 pb-2 gap-3 bg-slate-900 border-b border-white/5 justify-center">
            {kantoChampion && !filterCategories && (
              <div className="grid grid-cols-2 gap-2 mb-2 w-full max-w-sm mx-auto">
                {[
                  { id: 'kanto', label: 'Kanto' },
                  { id: 'johto', label: 'Johto' },
                ].map(region => (
                  <button
                    key={region.id}
                    onClick={() => {
                      setChallengeRegion(region.id);
                      if (region.id === 'kanto' && selectedCategory === 'johto') setSelectedCategory('rival');
                      if (region.id === 'johto' && selectedCategory !== 'legendary' && selectedCategory !== 'rocket' && selectedCategory !== 'rival') setSelectedCategory('johto');
                    }}
                    className={`min-h-[38px] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      challengeRegion === region.id
                        ? 'bg-pokeGold text-slate-950 shadow-lg'
                        : 'bg-white/5 text-white/40 hover:text-white/70'
                    }`}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex w-full max-w-sm mx-auto gap-2">
              {Object.entries(CATEGORY_CONFIG)
                .filter(([id]) => !filterCategories || filterCategories.includes(id))
                .filter(([id]) => {
                  if (filterCategories) return true;
                  if (challengeRegion === 'kanto') return id !== 'johto';
                  if (challengeRegion === 'johto') return id === 'johto' || id === 'legendary' || id === 'rocket' || id === 'rival';
                  return true;
                })
                .map(([id, cfg]) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`flex-1 py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-2 border ${
                    selectedCategory === id 
                    ? 'bg-white text-slate-950 border-white font-black' 
                    : 'bg-white/5 text-white/40 border-white/5 font-bold hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">{cfg.emoji}</span>
                  <span className="text-[9px] uppercase tracking-tighter">{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}'''

text = pattern3.sub(replacement3, text, count=1)

pattern4 = re.compile(r'<button onClick=\{\(\) => \{ onChallenge\(selectedChallenge\); setSelectedChallenge\(null\); \}\} className=\"flex-2 flex-grow bg-white text-slate-900 py-4 rounded-2xl font-black uppercase text-sm hover:bg-slate-100 shadow-xl active:scale-95\">Desafiar</button>.*?</div>\s*</div>\s*</div>\s*\)\}\s*</div>', re.DOTALL)

replacement4 = '''<button 
                  onClick={() => { 
                    if (selectedChallenge.region === 'johto') {
                      const hasLocked = gameState.team.some(p => p.lockedUntilFlag && !(gameState.worldFlags || []).includes(p.lockedUntilFlag));
                      if (hasLocked) {
                        setAlertMessage("Você não pode enfrentar batalhas em Johto com Pokémon guardados pelo Prof. Elm. Guarde-os no PC primeiro!");
                        return;
                      }
                    }
                    onChallenge(selectedChallenge); 
                    setSelectedChallenge(null); 
                  }} 
                  className="flex-2 flex-grow bg-white text-slate-900 py-4 rounded-2xl font-black uppercase text-sm hover:bg-slate-100 shadow-xl active:scale-95"
                >
                  Desafiar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn" onClick={() => setAlertMessage(null)}>
           <div className="bg-slate-950 w-full max-w-sm rounded-[3rem] shadow-2xl p-8 animate-bounceIn text-center border-4 border-red-500" onClick={e => e.stopPropagation()}>
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-xl font-black text-white uppercase italic mb-4">Acesso Bloqueado</h3>
              <p className="text-sm font-bold text-white/60 mb-8">{alertMessage}</p>
              <button 
                onClick={() => setAlertMessage(null)}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 active:scale-95 transition-all shadow-lg"
              >
                Entendi
              </button>
           </div>
        </div>
      )}
    </div>'''
text = pattern4.sub(replacement4, text, count=1)

with open('src/components/ChallengesScreen.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

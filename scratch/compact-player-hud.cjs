const fs = require('fs');
let content = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8');

const oldHud = `        <div className="absolute bottom-2 left-2 z-10 flex items-end gap-2">
          {activePoke ? (
            <>
              <div className="relative">
                {playerShinyFlash && <ShinySparkles />}
                <img
                  src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/\${activePoke.isShiny ? 'shiny/' : ''}\${activePoke.id}.gif\`}
                  className={\`w-20 h-20 object-contain drop-shadow-xl \${activePoke.isShiny ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.9)]' : ''}\`}
                  alt="Player"
                />
              </div>
              <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border-r-4 border-pokeBlue min-w-[140px] mb-1">
                <div className="flex justify-between items-center">
                  <span className="font-black text-[10px] uppercase text-slate-800 truncate max-w-[90px]">
                    {activePoke.name}{activePoke.isShiny && ' ✨'}
                  </span>
                  <span className="text-[9px] font-bold text-pokeBlue ml-1">Nv.{activePoke.level || 5}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[8px] font-black text-slate-400 w-4">HP</span>
                  <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full transition-all duration-300" style={{ width: \`\${(activePoke.hp / activePoke.maxHp) * 100}%\` }} />
                  </div>
                  <span className="text-[8px] font-black text-slate-400">{activePoke.hp}/{activePoke.maxHp}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[8px] font-black text-slate-400 w-4">XP</span>
                  <div className="flex-1 bg-slate-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-pokeBlue h-full transition-all duration-300" style={{ width: \`\${Math.min(100, ((activePoke.xp || 0) / ((activePoke.level || 5) * 50)) * 100)}%\` }} />
                  </div>
                </div>
                {(() => {
                  const stamina = gameState.stamina?.[activePoke?.instanceId]?.value ?? 100;
                  const color  = stamina > 60 ? '#22c55e' : stamina > 30 ? '#f59e0b' : '#ef4444';
                  const emoji  = stamina > 60 ? '🟢' : stamina > 30 ? '🟡' : stamina > 0 ? '🔴' : '💀';
                  return (
                    <div className="mt-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Energia {emoji}</span>
                        <span className="text-[8px] font-bold" style={{ color }}>{Math.floor(stamina)}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: \`\${stamina}%\`, background: color }} />
                      </div>
                      {stamina <= 0 && (
                        <div className="mt-1 bg-red-500/20 border border-red-500/40 rounded-xl px-2 py-1.5">
                          <p className="text-red-400 text-[8px] font-black uppercase text-center animate-pulse">😵 Exausto — trocando...</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <StatusBadges status={activePoke.status || []} stages={activePoke.stages || {}} />
              </div>
            </>
          ) : <div className="text-white bg-black/50 px-3 py-2 rounded-xl italic text-[10px]">Aguardando...</div>}
        </div>`;

const newHud = `        <div className="absolute bottom-2 left-2 z-10 flex flex-col items-start gap-1 max-w-[160px]">
          {activePoke ? (
            <>
              <div className="relative ml-2">
                {playerShinyFlash && <ShinySparkles />}
                <img
                  src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/\${activePoke.isShiny ? 'shiny/' : ''}\${activePoke.id}.gif\`}
                  className={\`w-16 h-16 object-contain drop-shadow-xl \${activePoke.isShiny ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.9)]' : ''}\`}
                  alt="Player"
                />
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-xl shadow-md border-l-4 border-pokeBlue w-full">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-black text-[10px] uppercase text-slate-800 truncate">
                    {activePoke.name}{activePoke.isShiny && ' ✨'}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500">Nv.{activePoke.level || 5}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[7px] font-black text-slate-400 w-4">HP</span>
                  <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full transition-all duration-300" style={{ width: \`\${(activePoke.hp / activePoke.maxHp) * 100}%\` }} />
                  </div>
                  <span className="text-[7px] font-black text-slate-500 shrink-0">{activePoke.hp}/{activePoke.maxHp}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[7px] font-black text-slate-400 w-4">XP</span>
                  <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pokeBlue h-full transition-all duration-300" style={{ width: \`\${Math.min(100, ((activePoke.xp || 0) / ((activePoke.level || 5) * 50)) * 100)}%\` }} />
                  </div>
                </div>
                {(() => {
                  const stamina = gameState.stamina?.[activePoke?.instanceId]?.value ?? 100;
                  const color  = stamina > 60 ? '#22c55e' : stamina > 30 ? '#f59e0b' : '#ef4444';
                  const emoji  = stamina > 60 ? '🟢' : stamina > 30 ? '🟡' : stamina > 0 ? '🔴' : '💀';
                  return (
                    <div className="mt-0.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[7px] font-black text-slate-400 uppercase">ENERGIA {emoji}</span>
                        <span className="text-[7px] font-black" style={{ color }}>{Math.floor(stamina)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: \`\${stamina}%\`, background: color }} />
                      </div>
                      {stamina <= 0 && (
                        <div className="mt-1 bg-red-500/20 border border-red-500/40 rounded-xl px-1.5 py-1">
                          <p className="text-red-400 text-[7px] font-black uppercase text-center animate-pulse">😵 Exausto</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <StatusBadges status={activePoke.status || []} stages={activePoke.stages || {}} />
              </div>
            </>
          ) : <div className="text-white bg-black/50 px-3 py-2 rounded-xl italic text-[10px]">Aguardando...</div>}
        </div>`;

if (content.includes(oldHud)) {
    content = content.replace(oldHud, newHud);
    fs.writeFileSync('src/components/BattleScreen.jsx', content);
    console.log('Success');
} else {
    console.log('Old block not found');
}

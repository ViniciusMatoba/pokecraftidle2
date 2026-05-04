const fs = require('fs');
let content = fs.readFileSync('src/components/BattleScreen.jsx', 'utf8');

const oldArena = `      <div className="relative overflow-hidden rounded-2xl shadow-xl flex-shrink-0" style={{ height: 220 }}>
        <div
          className="absolute inset-0"
          style={{ 
            background: mainBackground,
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: TIME_CONFIG[timeOfDay]?.skyFilter || 'none',
            transition: 'filter 2s ease',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{ background: TIME_CONFIG[timeOfDay]?.overlayColor || 'transparent', transition: 'background 2s ease' }}
        />

        {shinyFlash && !showTrainer && <ShinySparkles />}

        <button
          onClick={() => setShowAutoConfig(true)}
          className={\`absolute top-2 left-2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest backdrop-blur-md transition-all \${gameState.autoCapture || autoConfig.autoPotion ? 'bg-pokeBlue/90 border-white text-white' : 'bg-white/60 border-slate-300 text-slate-600'}\`}
        >
          <div className={\`w-2 h-2 rounded-full \${gameState.autoCapture || autoConfig.autoPotion ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}\`} />
          Auto {gameState.autoCapture || autoConfig.autoPotion ? 'ON' : 'OFF'}
        </button>

        {/* HUD INIMIGO */}
        <div className={\`absolute top-2 right-2 min-w-[150px] transition-all duration-700 z-10 \${currentEnemy.hp > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}>
          <div className="bg-white/95 rounded-xl px-3 py-2 shadow-lg border-r-4 border-slate-200 relative overflow-hidden">
            {showTrainer && currentEnemy.isTrainer ? (
              <div className="animate-fadeIn">
                 <span className="text-[8px] font-black text-pokeGold uppercase tracking-widest block mb-0.5">Desafiante</span>
                 <h4 className="text-slate-800 font-black text-[11px] uppercase truncate italic">{currentEnemy.trainerName}</h4>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center gap-2 mb-1">
                   <span className="font-black text-[11px] uppercase text-slate-800 truncate max-w-[110px]">
                      {currentEnemy.isTrainer ? currentEnemy.trainerName : currentEnemy.name}
                      {currentEnemy.isShiny && ' ✨'}
                   </span>
                   <span className="text-[10px] font-bold text-slate-500 shrink-0">Nv.{currentEnemy.level || '??'}</span>
                </div>
                <div className="flex items-center gap-1">
                   <span className="text-[7px] font-black text-slate-400 w-4">HP</span>
                   <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                     <div className={\`h-full transition-all duration-500 \${hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-400' : 'bg-red-500'}\`} style={{ width: \`\${hpPercent}%\` }} />
                   </div>
                </div>
                <div className="mt-1 flex justify-end">
                   <StatusBadges status={currentEnemy.status || []} stages={currentEnemy.stages || {}} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* SPRITE INIMIGO */}
        <div className="absolute top-16 right-8 z-10 w-24 h-24 flex items-center justify-center">
          <div className="relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap">
              {(floatingTexts || []).map(f => <span key={f.id} className="block text-center font-black text-lg animate-floatUp" style={{ color: f.color, textShadow: '2px 2px 0 #000' }}>{f.text}</span>)}
            </div>
            {shinyFlash && !showTrainer && <ShinySparkles />}
            <img
              src={
                currentEnemy.isTrainer && showTrainer 
                  ? (currentEnemy.trainerSprite || 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png') 
                  : (currentEnemy.sprite || (currentEnemy.id ? \`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/\${currentEnemy.isShiny ? 'shiny/' : ''}\${currentEnemy.id}.png\` : 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'))
              }
              alt={currentEnemy.name || "Pokémon"}
              className={\`w-full h-full object-contain drop-shadow-xl transition-all duration-500 \${showTrainer && currentEnemy.isTrainer ? 'scale-110' : 'animate-float'} \${currentEnemy.isShiny && !showTrainer ? 'drop-shadow-[0_0_16px_rgba(234,179,8,1)]' : ''} \${currentEnemy.hp <= 0 ? 'opacity-0 scale-0' : 'opacity-100'}\`}
            />
          </div>
        </div>

        {/* HUD JOGADOR */}
        <div className="absolute bottom-2 left-2 z-10 min-w-[150px]">
          {activePoke ? (
            <div className="bg-white/95 rounded-xl px-3 py-2 shadow-lg border-l-4 border-pokeBlue w-full">
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-[11px] uppercase text-slate-800 truncate max-w-[100px]">
                  {activePoke.name}{activePoke.isShiny && ' ✨'}
                </span>
                <span className="text-[10px] font-bold text-slate-500">Nv.{activePoke.level || 5}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[7px] font-black text-slate-400 w-4">HP</span>
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full transition-all duration-300" style={{ width: \`\${(activePoke.hp / activePoke.maxHp) * 100}%\` }} />
                </div>
                <span className="text-[7px] font-black text-slate-500 shrink-0">{activePoke.hp}/{activePoke.maxHp}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[7px] font-black text-slate-400 w-4">XP</span>
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
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
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
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
          ) : <div className="text-white bg-black/50 px-3 py-2 rounded-xl italic text-[10px]">Aguardando...</div>}
        </div>

        {/* SPRITE JOGADOR */}
        <div className="absolute bottom-2 left-[170px] z-10 w-20 h-20 flex items-center justify-center">
          {activePoke && (
            <div className="relative">
              {playerShinyFlash && <ShinySparkles />}
              <img
                src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/\${activePoke.isShiny ? 'shiny/' : ''}\${activePoke.id}.gif\`}
                className={\`w-full h-full object-contain drop-shadow-xl \${activePoke.isShiny ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.9)]' : ''}\`}
                alt="Player"
              />
            </div>
          )}
        </div>
      </div>`;

const newArena = `      <div className="relative overflow-hidden rounded-2xl shadow-xl flex-shrink-0" style={{ height: 220 }}>
        <div
          className="absolute inset-0"
          style={{ 
            background: mainBackground,
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: TIME_CONFIG[timeOfDay]?.skyFilter || 'none',
            transition: 'filter 2s ease',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{ background: TIME_CONFIG[timeOfDay]?.overlayColor || 'transparent', transition: 'background 2s ease' }}
        />

        {shinyFlash && !showTrainer && <ShinySparkles />}

        <button
          onClick={() => setShowAutoConfig(true)}
          className={\`absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest backdrop-blur-md transition-all \${gameState.autoCapture || autoConfig.autoPotion ? 'bg-pokeBlue/90 border-white text-white' : 'bg-white/60 border-slate-300 text-slate-600'}\`}
        >
          <div className={\`w-2 h-2 rounded-full \${gameState.autoCapture || autoConfig.autoPotion ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}\`} />
          Auto {gameState.autoCapture || autoConfig.autoPotion ? 'ON' : 'OFF'}
        </button>

        {/* HUD INIMIGO - Canto Superior Esquerdo */}
        <div className={\`absolute top-2 left-2 min-w-[150px] transition-all duration-700 z-10 \${currentEnemy.hp > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}>
          <div className="bg-white/95 rounded-xl px-3 py-2 shadow-lg border-l-4 border-slate-200 relative overflow-hidden">
            {showTrainer && currentEnemy.isTrainer ? (
              <div className="animate-fadeIn">
                 <span className="text-[8px] font-black text-pokeGold uppercase tracking-widest block mb-0.5">Desafiante</span>
                 <h4 className="text-slate-800 font-black text-[11px] uppercase truncate italic">{currentEnemy.trainerName}</h4>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center gap-2 mb-1">
                   <span className="font-black text-[11px] uppercase text-slate-800 truncate max-w-[110px]">
                      {currentEnemy.isTrainer ? currentEnemy.trainerName : currentEnemy.name}
                      {currentEnemy.isShiny && ' ✨'}
                   </span>
                   <span className="text-[10px] font-bold text-slate-500 shrink-0">Nv.{currentEnemy.level || '??'}</span>
                </div>
                <div className="flex items-center gap-1">
                   <span className="text-[7px] font-black text-slate-400 w-4">HP</span>
                   <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                     <div className={\`h-full transition-all duration-500 \${hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-400' : 'bg-red-500'}\`} style={{ width: \`\${hpPercent}%\` }} />
                   </div>
                </div>
                <div className="mt-1">
                   <StatusBadges status={currentEnemy.status || []} stages={currentEnemy.stages || {}} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* SPRITE INIMIGO - Quadrante Superior Direito */}
        <div className="absolute top-12 right-10 z-10 w-24 h-24 flex items-center justify-center">
          <div className="relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-20 whitespace-nowrap">
              {(floatingTexts || []).map(f => <span key={f.id} className="block text-center font-black text-lg animate-floatUp" style={{ color: f.color, textShadow: '2px 2px 0 #000' }}>{f.text}</span>)}
            </div>
            {shinyFlash && !showTrainer && <ShinySparkles />}
            <img
              src={
                currentEnemy.isTrainer && showTrainer 
                  ? (currentEnemy.trainerSprite || 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png') 
                  : (currentEnemy.sprite || (currentEnemy.id ? \`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/\${currentEnemy.isShiny ? 'shiny/' : ''}\${currentEnemy.id}.png\` : 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'))
              }
              alt={currentEnemy.name || "Pokémon"}
              className={\`w-full h-full object-contain drop-shadow-xl transition-all duration-500 \${showTrainer && currentEnemy.isTrainer ? 'scale-110' : 'animate-float'} \${currentEnemy.isShiny && !showTrainer ? 'drop-shadow-[0_0_16px_rgba(234,179,8,1)]' : ''} \${currentEnemy.hp <= 0 ? 'opacity-0 scale-0' : 'opacity-100'}\`}
            />
          </div>
        </div>

        {/* HUD JOGADOR - Canto Inferior Direito */}
        <div className="absolute bottom-2 right-2 z-10 min-w-[150px]">
          {activePoke ? (
            <div className="bg-white/95 rounded-xl px-3 py-2 shadow-lg border-r-4 border-pokeBlue w-full text-right">
              <div className="flex justify-between items-center mb-1 flex-row-reverse">
                <span className="font-black text-[11px] uppercase text-slate-800 truncate max-w-[100px]">
                  {activePoke.name}{activePoke.isShiny && ' ✨'}
                </span>
                <span className="text-[10px] font-bold text-slate-500">Nv.{activePoke.level || 5}</span>
              </div>
              <div className="flex items-center gap-1 flex-row-reverse">
                <span className="text-[7px] font-black text-slate-400 w-4">HP</span>
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full transition-all duration-300" style={{ width: \`\${(activePoke.hp / activePoke.maxHp) * 100}%\` }} />
                </div>
                <span className="text-[7px] font-black text-slate-500 shrink-0">{activePoke.hp}/{activePoke.maxHp}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 flex-row-reverse">
                <span className="text-[7px] font-black text-slate-400 w-4">XP</span>
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-pokeBlue h-full transition-all duration-300" style={{ width: \`\${Math.min(100, ((activePoke.xp || 0) / ((activePoke.level || 5) * 50)) * 100)}%\` }} />
                </div>
              </div>
              {(() => {
                const stamina = gameState.stamina?.[activePoke?.instanceId]?.value ?? 100;
                const color  = stamina > 60 ? '#22c55e' : stamina > 30 ? '#f59e0b' : '#ef4444';
                const emoji  = stamina > 60 ? '🟢' : stamina > 30 ? '🟡' : stamina > 0 ? '🔴' : '💀';
                return (
                  <div className="mt-0.5">
                    <div className="flex items-center justify-between mb-0.5 flex-row-reverse text-right">
                      <span className="text-[7px] font-black text-slate-400 uppercase">ENERGIA {emoji}</span>
                      <span className="text-[7px] font-black" style={{ color }}>{Math.floor(stamina)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
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
              <div className="flex justify-end mt-1">
                <StatusBadges status={activePoke.status || []} stages={activePoke.stages || {}} />
              </div>
            </div>
          ) : <div className="text-white bg-black/50 px-3 py-2 rounded-xl italic text-[10px]">Aguardando...</div>}
        </div>

        {/* SPRITE JOGADOR - Quadrante Inferior Esquerdo */}
        <div className="absolute bottom-2 left-6 z-10 w-24 h-24 flex items-center justify-center">
          {activePoke && (
            <div className="relative">
              {playerShinyFlash && <ShinySparkles />}
              <img
                src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/\${activePoke.isShiny ? 'shiny/' : ''}\${activePoke.id}.gif\`}
                className={\`w-full h-full object-contain drop-shadow-xl \${activePoke.isShiny ? 'drop-shadow-[0_0_10px_rgba(234,179,8,0.9)]' : ''}\`}
                alt="Player"
              />
            </div>
          )}
        </div>
      </div>`;

if (content.includes(oldArena)) {
    content = content.replace(oldArena, newArena);
    fs.writeFileSync('src/components/BattleScreen.jsx', content);
    console.log('Success');
} else {
    console.log('Old block not found');
}

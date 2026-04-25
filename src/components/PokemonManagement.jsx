import React from 'react';

const PokemonManagement = ({ 
  gameState, 
  activeTab, 
  setActiveTab, 
  onShowPokemonModal,
  onClosePokemonModal,
  moveToTeam
}) => {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10 h-full text-left">
      <div className="flex bg-white rounded-2xl p-1 shadow-md border-2 border-slate-100">
         <button onClick={() => setActiveTab('team')} className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'team' ? 'bg-pokeBlue text-white shadow-lg' : 'text-slate-400'}`}>Meu Time ({gameState.team.length}/6)</button>
         <button onClick={() => setActiveTab('pc')} className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'pc' ? 'bg-pokeGold text-white shadow-lg' : 'text-slate-400'}`}>PC Storage ({gameState.pc?.length || 0})</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'team' ? (
          <div className="grid grid-cols-1 gap-3">
            {gameState.team.map((p, i) => (
              <div key={p.instanceId || i} onClick={() => onShowPokemonModal({ pokemon: p, index: i, location: 'team' })} className="bg-white p-4 rounded-3xl border-2 border-slate-100 flex items-center gap-4 group cursor-pointer hover:border-pokeBlue transition-all">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center relative">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`} className="w-14 h-14 object-contain" alt={p.name} />
                  {p.isShiny && <span className="absolute -top-1 -right-1 text-xs">✨</span>}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div style={{display:'flex', alignItems:'baseline', gap:'6px', flexWrap:'wrap'}}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 900,
                        color: '#1e293b',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontStyle: 'italic',
                      }}>
                        {p.name}
                      </p>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#64748b',
                        margin: 0,
                        flexShrink: 0,
                      }}>
                        Nv. {p.level}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">ATK: {p.attack}</span>
                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">S.ATK: {p.spAtk}</span>
                     <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">SPD: {p.speed}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                    <div className={`h-full ${(p.hp/p.maxHp) > 0.5 ? 'bg-green-500' : (p.hp/p.maxHp) > 0.2 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(p.hp/p.maxHp)*100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setActiveTab('pc')}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '12px',
                borderRadius: '16px',
                background: '#f8fafc',
                border: '2px dashed #cbd5e1',
                color: '#475569',
                fontWeight: 900,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                style={{width:'20px', height:'20px', objectFit:'contain'}}
                alt=""
              />
              Confira o PC
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {(gameState.pc || []).length === 0 && <p className="col-span-2 text-center py-10 text-slate-400 font-bold uppercase italic">O PC está vazio...</p>}
            {(gameState.pc || []).map((p, i) => (
              <div key={p.instanceId || i} onClick={() => onShowPokemonModal({ pokemon: p, index: i, location: 'pc' })} className="bg-white p-3 rounded-2xl border-2 border-slate-100 flex flex-col items-center gap-2 group relative cursor-pointer hover:border-pokeGold transition-all">
                 <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`} className="w-12 h-12 object-contain" alt={p.name} />
                 <div className="text-center">
                   <p className="font-black uppercase text-slate-800 text-[10px] italic leading-none">{p.name}</p>
                   <p className="text-[8px] font-bold text-slate-400 mt-0.5">Nv. {p.level}</p>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); moveToTeam(i); }} className="absolute top-1 right-1 bg-blue-50 text-blue-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75">
                   <span className="font-black text-[8px] uppercase">+ Team</span>
                 </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonManagement;

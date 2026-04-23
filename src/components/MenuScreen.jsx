import React from 'react';

const MenuScreen = ({ gameState, setCurrentView, setGameState }) => {
  return (
    <div className="h-full bg-slate-100 animate-fadeIn relative overflow-y-auto custom-scrollbar pt-12 pb-24">
       <div className="absolute inset-0 opacity-5 pointer-events-none fixed">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="absolute top-10 left-10 w-64 h-64 rotate-12" alt="" />
       </div>
       
       <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
             <div className="bg-pokeRed p-3 rounded-2xl shadow-lg">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-doll.png" className="w-8 h-8" alt="Menu" />
             </div>
             <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">Menu Principal</h2>
          </div>

          <div className="flex flex-col gap-4 text-left">
             {[
               { id: 'backpack', name: 'Mochila', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/back-pack.png', desc: 'Itens e Equipamentos', color: 'bg-orange-50 border-orange-200 text-orange-600' },
               { id: 'quests', name: 'Missões', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png', desc: 'Progresso da Jornada', color: 'bg-blue-50 border-blue-200 text-blue-600' },
               { id: 'save', name: 'Salvar Jogo', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/computer-drive.png', desc: 'Progresso em Nuvem', color: 'bg-green-50 border-green-200 text-green-600' },
               { id: 'exit', name: 'Sair do Jogo', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/escape-rope.png', desc: 'Voltar para o Início', color: 'bg-red-50 border-red-200 text-red-600' },
             ].map(item => (
               <button 
                 key={item.id} 
                 onClick={() => {
                   if (item.id === 'exit') { if(window.confirm('Deseja realmente sair?')) setCurrentView('landing'); }
                   else if (item.id === 'save') alert('Jogo salvo automaticamente!');
                   else alert(`${item.name} será implementado em breve!`);
                 }}
                 className={`w-full p-4 rounded-3xl border-4 ${item.color} shadow-lg hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all flex items-center gap-6 text-left group overflow-hidden relative theme-glass`}
               >
                 <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                 <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-inner border-2 border-white group-hover:rotate-6 transition-transform">
                    <img src={item.icon} className="w-14 h-14 object-contain drop-shadow-md" alt={item.name} />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-2xl font-black uppercase italic leading-none tracking-tight">{item.name}</h3>
                    <p className="text-[11px] font-bold opacity-80 uppercase mt-1.5 tracking-wide">{item.desc}</p>
                 </div>
                 <div className="text-2xl opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all">➜</div>
               </button>
             ))}
          </div>

          <div className="mt-8 pt-8 border-t-2 border-slate-200">
             <button 
               onClick={() => {
                 if(window.confirm('Isso vai transformar seu primeiro Pokémon de volta em Bulbasaur (Nv. 15) com XP quase cheio para testar a evolução. Continuar?')) {
                   setGameState(prev => {
                     const newTeam = [...prev.team];
                     if (newTeam[0]) {
                       newTeam[0] = { 
                         ...newTeam[0], 
                         id: 1, 
                         name: 'Bulbasaur', 
                         type: 'Grass',
                         hp: 45, maxHp: 45,
                         level: 15,
                         xp: 15 * 25 - 1 // Quase upando (XP needed = level * 25)
                       };
                     }
                     return { ...prev, team: newTeam };
                   });
                   alert('Bulbasaur restaurado! Vença uma batalha para evoluir para o nível 16.');
                 }
               }}
               className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 font-bold uppercase text-[10px] hover:bg-white hover:text-pokeBlue hover:border-pokeBlue transition-all active:scale-95"
             >
               🔧 DEBUG: Testar Evolução (Restaurar Bulbasaur Nv. 15)
             </button>
           </div>

           <button 
             onClick={() => setCurrentView('city')}
             className="w-full mt-12 bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg border-b-8 border-slate-900"
           >Voltar</button>
       </div>
    </div>
  );
};

export default MenuScreen;

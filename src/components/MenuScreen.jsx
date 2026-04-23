import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { APP_VERSION, APP_VERSION_DATE } from '../data/constants';

const CURRENT_VERSION = APP_VERSION || '1.4';
const VERSION_DATE = APP_VERSION_DATE || '2026-04-23';

const MenuScreen = ({ gameState, setCurrentView, setGameState, user }) => {
  const [updating, setUpdating] = useState(false);
  const [forcing, setForcing] = useState(false);
  const [updateDone, setUpdateDone] = useState(false);

  // Botão manual: hard reload limpando cache
  const handleUpdate = () => {
    setUpdating(true);
    // Salvar timestamp local para não re-triggerar o listener
    localStorage.setItem('pokecraft_last_reload', String(Date.now()));
    setTimeout(() => window.location.reload(true), 400);
  };

  // Forçar atualização em TODOS os dispositivos via Firestore
  const handleForceAll = async () => {
    if (!window.confirm('⚠️ Isso vai recarregar o jogo em TODOS os dispositivos logados agora. Continuar?')) return;
    setForcing(true);
    try {
      const now = Date.now();
      await setDoc(doc(db, 'config', 'app'), {
        forceReloadAt: serverTimestamp(),
        forceReloadAtMs: now,
        version: CURRENT_VERSION,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setUpdateDone(true);
      setTimeout(() => setUpdateDone(false), 4000);
    } catch (e) {
      console.error('Erro ao forçar atualização:', e);
      alert('Erro ao enviar comando. Tente novamente.');
    } finally {
      setForcing(false);
    }
  };

  const menuItems = [
    { id: 'pokedex',  name: 'Pokédex',      icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pokedex.png',         desc: 'Registro de Espécies',    color: 'bg-red-50 border-red-200 text-red-600' },
    { id: 'backpack', name: 'Mochila',       icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/back-pack.png',        desc: 'Itens e Equipamentos',    color: 'bg-orange-50 border-orange-200 text-orange-600' },
    { id: 'quests',   name: 'Missões',       icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png',          desc: 'Progresso da Jornada',    color: 'bg-blue-50 border-blue-200 text-blue-600' },
    { id: 'save',     name: 'Salvar Jogo',   icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/computer-drive.png',    desc: 'Progresso em Nuvem',      color: 'bg-green-50 border-green-200 text-green-600' },
    { id: 'exit',     name: 'Sair do Jogo',  icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/escape-rope.png',       desc: 'Voltar para o Início',    color: 'bg-slate-50 border-slate-200 text-slate-600' },
  ];

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
             {menuItems.map(item => (
               <button 
                 key={item.id} 
                 onClick={() => {
                   if (item.id === 'exit') { if(window.confirm('Deseja realmente sair?')) setCurrentView('landing'); }
                   else if (item.id === 'save') alert('Jogo salvo automaticamente!');
                   else if (item.id === 'pokedex') setCurrentView('pokedex');
                   else alert(`${item.name} será implementado em breve!`);
                 }}
                 className={`w-full p-4 rounded-3xl border-4 ${item.color} shadow-lg hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all flex items-center gap-6 text-left group overflow-hidden relative theme-glass`}
               >
                 <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                 <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-inner border-2 border-white group-hover:rotate-6 transition-transform">
                    <img src={item.icon} className="w-10 h-10 object-contain drop-shadow-md" alt={item.name} />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-xl font-black uppercase italic leading-none tracking-tight">{item.name}</h3>
                    <p className="text-[10px] font-bold opacity-80 uppercase mt-1 tracking-wide">{item.desc}</p>
                 </div>
                 <div className="text-xl opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all">➜</div>
               </button>
             ))}
          </div>

          {/* SEÇÃO DE VERSÃO E ATUALIZAÇÃO */}
          <div className="mt-6 rounded-[2.5rem] overflow-hidden shadow-xl border-b-8 border-indigo-300">
            {/* Header da seção */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-700 px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div className="flex-1">
                <p className="text-white font-black uppercase text-sm tracking-wider">Versão do Jogo</p>
                <p className="text-indigo-200 text-[9px] font-bold uppercase tracking-widest">PokéCraft Idle v{CURRENT_VERSION} · {VERSION_DATE}</p>
              </div>
              <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full">v{CURRENT_VERSION}</span>
            </div>

            <div className="bg-white p-5 flex flex-col gap-3">
              {/* Botão: Atualizar meu dispositivo */}
              <button
                id="btn-update-version"
                onClick={handleUpdate}
                disabled={updating}
                className={`w-full py-4 rounded-2xl font-black uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg ${
                  updating
                    ? 'bg-indigo-100 text-indigo-300'
                    : 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:scale-[1.02] active:scale-95 shadow-indigo-200'
                }`}
              >
                {updating ? (
                  <><span className="animate-spin">⏳</span> Recarregando...</>
                ) : (
                  <><span>🔄</span> Atualizar Meu Dispositivo</>
                )}
              </button>

              {/* Botão: Forçar atualização em todos */}
              {user && (
                <button
                  id="btn-force-all-update"
                  onClick={handleForceAll}
                  disabled={forcing || updateDone}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg ${
                    updateDone
                      ? 'bg-green-100 text-green-600 border-2 border-green-300'
                      : forcing
                        ? 'bg-orange-50 text-orange-300'
                        : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:scale-[1.02] active:scale-95 shadow-orange-200'
                  }`}
                >
                  {updateDone ? (
                    <><span>✅</span> Comando enviado a todos!</>
                  ) : forcing ? (
                    <><span className="animate-spin">⏳</span> Enviando...</>
                  ) : (
                    <><span>📡</span> Forçar Atualização em Todos</>
                  )}
                </button>
              )}

              <p className="text-[9px] text-slate-400 font-bold uppercase text-center tracking-widest leading-relaxed">
                "Atualizar Meu Dispositivo" recarrega apenas esta sessão.<br />
                "Forçar em Todos" envia um sinal via nuvem para todos os players online.
              </p>
            </div>
          </div>

          {/* CONFIGURAÇÕES DO SISTEMA */}
          <div className="mt-6 p-6 bg-white rounded-[2.5rem] shadow-xl border-b-8 border-slate-200">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <span className="text-lg">⚙️</span> Configurações do Sistema
             </h4>
             
             <div className="flex flex-col gap-8">
                {/* Velocidade */}
                <div className="flex flex-col gap-3">
                   <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Velocidade das Batalhas</p>
                   <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map(v => (
                        <button 
                          key={v}
                          onClick={() => setGameState(prev => ({ ...prev, settings: { ...prev.settings, battleSpeed: v } }))}
                          className={`py-3 rounded-xl font-black text-xs transition-all ${gameState.settings?.battleSpeed === v ? 'bg-pokeBlue text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                          {v === 1 ? '1x Normal' : v === 2 ? '1.5x Rápido' : '2x Turbo'}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Modo de Exibição */}
                <div className="flex flex-col gap-3">
                   <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Modo de Exibição (PC)</p>
                   <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'mobile', name: 'Mobile (Fixo)', icon: '📱' },
                        { id: 'pc', name: 'Expandido (Full)', icon: '💻' }
                      ].map(m => (
                        <button 
                          key={m.id}
                          onClick={() => setGameState(prev => ({ ...prev, settings: { ...prev.settings, displayMode: m.id } }))}
                          className={`py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${gameState.settings?.displayMode === m.id ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                          <span>{m.icon}</span>
                          {m.name}
                        </button>
                      ))}
                   </div>
                   <p className="text-[8px] text-slate-400 font-bold uppercase text-center mt-1">Recomendado para monitores grandes</p>
                </div>

                {/* Level Cap */}
                <div className="flex flex-col gap-3">
                   <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Trava de Nível (Level Cap)</p>
                   <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: true, name: 'Ativado', icon: '🔒' },
                        { id: false, name: 'Desativado', icon: '🔓' }
                      ].map(lc => (
                        <button 
                          key={String(lc.id)}
                          onClick={() => setGameState(prev => ({ ...prev, settings: { ...prev.settings, levelCap: lc.id } }))}
                          className={`py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${gameState.settings?.levelCap !== false && lc.id === true || gameState.settings?.levelCap === false && lc.id === false ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                          <span>{lc.icon}</span>
                          {lc.name}
                        </button>
                      ))}
                   </div>
                   <p className="text-[8px] text-slate-400 font-bold uppercase text-center mt-1">Limita seu nível ao próximo ginásio</p>
                </div>
             </div>
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

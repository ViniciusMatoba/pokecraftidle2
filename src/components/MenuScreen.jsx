import React, { useState } from 'react';
import { APP_VERSION, APP_VERSION_DATE } from '../data/constants';

const CURRENT_VERSION = APP_VERSION || '1.4';
const VERSION_DATE = APP_VERSION_DATE || '2026-04-23';

const MenuScreen = ({ gameState, setCurrentView, setGameState, user, onSave, MUSIC_LIST }) => {
  const [updating, setUpdating] = useState(false);
  const [subView, setSubView] = useState('main'); // 'main' ou 'settings'

  const handleUpdate = () => {
    setUpdating(true);
    localStorage.setItem('pokecraft_last_reload', String(Date.now()));
    setTimeout(() => window.location.reload(true), 400);
  };

  const menuItems = [
    { id: 'pokedex',  name: 'Pokédex',      icon: '/assets/menu/pokedex.png',         desc: 'Registro de Espécies',    color: 'bg-red-50 border-red-200 text-red-600' },
    { id: 'backpack', name: 'Mochila',       icon: '/assets/menu/backpack.png',        desc: 'Itens e Equipamentos',    color: 'bg-orange-50 border-orange-200 text-orange-600' },
    { id: 'settings', name: 'Configurações', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png', desc: 'Ajustes do Sistema', color: 'bg-indigo-50 border-indigo-200 text-indigo-600' },
    { id: 'save',     name: 'Salvar Jogo',   icon: '/assets/menu/save.png',            desc: 'Progresso em Nuvem',      color: 'bg-green-50 border-green-200 text-green-600' },
    { id: 'exit',     name: 'Sair do Jogo',  icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/escape-rope.png',       desc: 'Voltar para o Início',    color: 'bg-slate-50 border-slate-200 text-slate-600' },
  ];

  const renderMain = () => (
    <div className="flex flex-col gap-4 animate-fadeIn">
      {menuItems.map(item => (
        <button 
          key={item.id} 
          onClick={() => {
            if (item.id === 'exit') { if(window.confirm('Deseja realmente sair?')) setCurrentView('landing'); }
            else if (item.id === 'save') { if (onSave) onSave(); else alert('Jogo salvo automaticamente!'); }
            else if (item.id === 'pokedex') setCurrentView('pokedex');
            else if (item.id === 'settings') setSubView('settings');
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

      {/* SEÇíO DE VERSíO E ATUALIZAÇíO RÁPIDA */}
      <div className="mt-4 bg-white p-5 rounded-[2.5rem] border-b-8 border-slate-200 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-wider leading-none">Versão do Jogo</p>
            <p className="text-slate-800 font-bold text-xs mt-1">v{CURRENT_VERSION} · {VERSION_DATE}</p>
          </div>
          <button
            onClick={handleUpdate}
            disabled={updating}
            className={`px-4 py-2 rounded-xl font-black uppercase text-[10px] transition-all flex items-center gap-2 ${
              updating ? 'bg-slate-100 text-slate-300' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md active:scale-95'
            }`}
          >
            {updating ? '⏳' : '🔄'} {updating ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="animate-slideUp flex flex-col gap-6">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-b-8 border-indigo-200">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <span className="text-lg">⚙️</span> Ajustes de Jogo
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
                  className={`py-3 rounded-xl font-black text-xs transition-all ${gameState.settings?.battleSpeed === v ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                  {v === 1 ? '1x' : v === 2 ? '1.5x' : '2x'}
                </button>
              ))}
            </div>
          </div>

          {/* Modo de Exibição */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Modo de Exibição (PC)</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'mobile', name: 'Mobile', icon: '📱' },
                { id: 'pc', name: 'Expandido', icon: '💻' }
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setGameState(prev => ({ ...prev, settings: { ...prev.settings, displayMode: m.id } }))}
                  className={`py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${gameState.settings?.displayMode === m.id ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                  <span>{m.icon}</span> {m.name}
                </button>
              ))}
            </div>
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
                  <span>{lc.icon}</span> {lc.name}
                </button>
              ))}
            </div>
          </div>
          {/* Seleção de Música */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Música de Fundo</p>
            <div className="flex flex-col gap-2">
              <select 
                value={gameState.settings?.selectedMusic || 'all'}
                onChange={(e) => setGameState(prev => ({ ...prev, settings: { ...prev.settings, selectedMusic: e.target.value } }))}
                className="w-full bg-slate-100 p-4 rounded-xl font-bold text-slate-700 appearance-none border-2 border-slate-200 focus:border-indigo-500 outline-none transition-all"
              >
                {MUSIC_LIST?.map(track => (
                  <option key={track.id} value={track.id}>{track.name}</option>
                ))}
              </select>
              <p className="text-[9px] font-bold text-slate-400 italic px-2">Troque a música para entrar no clima!</p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setSubView('main')}
        className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg border-b-8 border-slate-900"
      >
        Voltar ao Menu
      </button>
    </div>
  );

  return (
    <div className="h-full bg-slate-100 animate-fadeIn relative overflow-y-auto custom-scrollbar pt-12 pb-24">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="absolute top-10 left-10 w-64 h-64 rotate-12" alt="" />
      </div>
      
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-pokeRed p-3 rounded-2xl shadow-lg">
            <img src={subView === 'settings' ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png' : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-doll.png'} className="w-8 h-8 object-contain" alt="Menu" />
          </div>
          <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">
            {subView === 'settings' ? 'Configurações' : 'Menu Principal'}
          </h2>
        </div>

        {subView === 'main' ? renderMain() : renderSettings()}

        {subView === 'main' && (
          <button 
            onClick={() => setCurrentView('city')}
            className="w-full mt-8 bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg border-b-8 border-slate-900"
          >
            Voltar ao Jogo
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuScreen;

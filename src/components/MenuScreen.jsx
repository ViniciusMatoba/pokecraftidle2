import React, { useState } from 'react';
import { APP_VERSION, APP_VERSION_DATE, ITEM_LABELS } from '../data/constants';

const CURRENT_VERSION = APP_VERSION || '1.4';
const VERSION_DATE = APP_VERSION_DATE || '2026-04-23';

const MenuScreen = ({ gameState, setCurrentView, setGameState, user, onSave, MUSIC_LIST, onBack, showConfirm, closeConfirm }) => {
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
    { id: 'settings', name: 'Configuraçíµes', icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png', desc: 'Ajustes do Sistema', color: 'bg-indigo-50 border-indigo-200 text-indigo-600' },
    { id: 'save',     name: 'Salvar Jogo',   icon: '/assets/menu/save.png',            desc: 'Progresso em Nuvem',      color: 'bg-green-50 border-green-200 text-green-600' },
    { id: 'exit',     name: 'Sair do Jogo',  icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/escape-rope.png',       desc: 'Voltar para o Início',    color: 'bg-slate-50 border-slate-200 text-slate-600' },
  ];

  const renderMain = () => (
    <div className="flex flex-col gap-4 animate-fadeIn">
      {menuItems.map(item => (
        <button 
          key={item.id} 
          onClick={() => {
            if (item.id === 'exit') {
              showConfirm({
                type: 'danger',
                title: 'Sair do Jogo',
                message: 'Deseja realmente sair? Seu progresso não salvo poderá ser perdido.',
                onConfirm: () => {
                  setCurrentView('landing');
                  closeConfirm();
                }
              });
            }
            else if (item.id === 'save') {
              if (onSave) {
                onSave();
              } else {
                showConfirm({
                  title: 'Jogo Salvo',
                  message: 'Seu jogo é salvo automaticamente na nuvem a cada ação importante!',
                  onConfirm: closeConfirm
                });
              }
            }
            else if (item.id === 'pokedex') setCurrentView('pokedex');
            else if (item.id === 'settings') setSubView('settings');
            else if (item.id === 'backpack') setSubView('backpack');
            else {
              showConfirm({
                title: 'Em Breve',
                message: `${item.name} será implementado em breve! Fique atento às atualizações.`,
                onConfirm: closeConfirm
              });
            }
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

  const renderBackpack = () => {
    const inv = gameState?.inventory || {};
    const items = inv?.items || {};
    const materials = inv?.materials || {};
    const candies = inv?.candies || {};

    // Categorias da mochila
    const categories = [
      {
        id: 'balls',
        label: 'Pokébolas',
        emoji: '⚪',
        entries: [
          { key: 'pokeballs',  label: 'Poké Bola',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
          { key: 'great_ball', label: 'Great Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png' },
          { key: 'ultra_ball', label: 'Ultra Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png' },
          { key: 'master_ball',label: 'Master Ball',img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png' },
          { key: 'lure_ball',  label: 'Lure Ball',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure-ball.png' },
          { key: 'moon_ball',  label: 'Moon Ball',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-ball.png' },
          { key: 'friend_ball',label: 'Friend Ball',img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/friend-ball.png' },
          { key: 'heavy_ball', label: 'Heavy Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heavy-ball.png' },
          { key: 'fast_ball',  label: 'Fast Ball',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fast-ball.png' },
          { key: 'level_ball', label: 'Level Ball', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/level-ball.png' },
        ].filter(e => (items[e.key] || 0) > 0),
      },
      {
        id: 'potions',
        label: 'Cura',
        emoji: '💊',
        entries: [
          { key: 'potions',      label: 'Poção',         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png' },
          { key: 'super_potion', label: 'Super Poção',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png' },
          { key: 'hyper_potion', label: 'Hiper Poção',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png' },
          { key: 'max_potion',   label: 'Poção Máxima',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-potion.png' },
          { key: 'full_restore', label: 'Full Restore',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png' },
          { key: 'revive',       label: 'Reviver',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png' },
          { key: 'max_revive',   label: 'Max Reviver',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-revive.png' },
          { key: 'antidote',     label: 'Antídoto',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/antidote.png' },
          { key: 'full_heal',    label: 'Full Heal',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-heal.png' },
        ].filter(e => (items[e.key] || 0) > 0),
      },
      {
        id: 'food',
        label: 'Comida',
        emoji: '🍽️',
        entries: [
          { key: 'fresh_water',       label: 'Água Fresca',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',   src: 'items' },
          { key: 'soda_pop',          label: 'Soda Pop',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',       src: 'items' },
          { key: 'lemonade',          label: 'Limonada',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',        src: 'items' },
          { key: 'moomoo_milk',       label: 'Leite MooMoo',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png',    src: 'items' },
          { key: 'berry_juice',       label: 'Suco de Baga',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berry-juice.png',    src: 'items' },
          { key: 'poke_food',         label: 'Ração Comum',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure.png',            src: 'items' },
          { key: 'poke_food_premium', label: 'Ração Premium',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png',   src: 'items' },
          { key: 'oran_berry',        label: 'Oran Berry',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png',      src: 'materials' },
          { key: 'sitrus_berry',      label: 'Sitrus Berry',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png',   src: 'materials' },
          { key: 'lum_berry',         label: 'Lum Berry',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lum-berry.png',       src: 'materials' },
          { key: 'cheri_berry',       label: 'Cheri Berry',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cheri-berry.png',    src: 'materials' },
          { key: 'chesto_berry',      label: 'Chesto Berry',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/chesto-berry.png',   src: 'materials' },
          { key: 'pecha_berry',       label: 'Pecha Berry',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pecha-berry.png',    src: 'materials' },
          { key: 'rawst_berry',       label: 'Rawst Berry',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rawst-berry.png',    src: 'materials' },
          { key: 'aspear_berry',      label: 'Aspear Berry',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/aspear-berry.png',   src: 'materials' },
          { key: 'leppa_berry',       label: 'Leppa Berry',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leppa-berry.png',    src: 'materials' },
        ].filter(e => {
          const bag = e.src === 'materials' ? materials : items;
          return (bag[e.key] || 0) > 0;
        }),
      },
      {
        id: 'materials',
        label: 'Materiais',
        emoji: '🧱',
        entries: Object.entries(materials)
          .filter(([k, v]) => v > 0 && !k.includes('berry') && !k.includes('apricorn'))
          .map(([k, v]) => ({
            key: k,
            label: ITEM_LABELS[k]?.name || k.replace(/_/g, ' '),
            icon: ITEM_LABELS[k]?.icon || '📦',
            qty: v,
          })),
      },
      {
        id: 'berries_apricorns',
        label: 'Berries',
        emoji: '🍒',
        entries: Object.entries(materials)
          .filter(([k, v]) => v > 0 && (k.includes('berry') || k.includes('apricorn')))
          .map(([k, v]) => ({
            key: k,
            label: ITEM_LABELS[k]?.name || k.replace(/_/g, ' '),
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${k.replace(/_/g, '-')}.png`,
            qty: v,
          })),
      },
      {
        id: 'candies',
        label: 'Candies',
        emoji: '🍬',
        entries: Object.entries({ ...candies, ...Object.fromEntries(Object.entries(materials).filter(([k]) => k.includes('_candy'))) })
          .filter(([k, v]) => v > 0)
          .map(([k, v]) => ({
            key: k,
            label: k.replace(/_candy_xl/, ' XL').replace(/_candy/, '').replace(/_/g, ' '),
            icon: '🍬',
            qty: v,
            isXL: k.includes('_xl'),
          })),
      },
      {
        id: 'key_items',
        label: 'Itens Chave',
        emoji: '🔑',
        entries: [
          { key: 'old_rod',    label: 'Vara Velha',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/old-rod.png' },
          { key: 'good_rod',   label: 'Vara Boa',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/good-rod.png' },
          { key: 'super_rod',  label: 'Super Vara',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-rod.png' },
          { key: 'exp_share',  label: 'Partilha Exp', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png' },
          { key: 'amulet_coin',label: 'Moeda Amuleto',img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/amulet-coin.png' },
          { key: 'lucky_egg',  label: 'Ovo Sortudo',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucky-egg.png' },
          { key: 'scope_lens', label: 'Lente Escopo', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scope-lens.png' },
          { key: 'repel',      label: 'Repel',        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/repel.png' },
          { key: 'super_repel',label: 'Super Repel',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-repel.png' },
          { key: 'max_repel',  label: 'Max Repel',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-repel.png' },
          { key: 'lure',       label: 'Isca',         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lure.png' },
          { key: 'super_lure', label: 'Super Isca',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-lure.png' },
          { key: 'max_lure',   label: 'Max Isca',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-lure.png' },
        ].filter(e => (items[e.key] || 0) > 0 || gameState.worldFlags?.includes(`has_${e.key}`)),
      },
    ];

    const [activeTab, setActiveTab] = useState('balls');
    const currentCat = categories.find(c => c.id === activeTab) || categories[0];
    const totalItems = categories.reduce((s, c) => s + c.entries.length, 0);

    return (
      <div className="flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 shrink-0">
          <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-xl">🎒</div>
          <div>
            <h3 className="font-black text-slate-800 uppercase italic text-base leading-none">Mochila</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{totalItems} tipos de item</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 px-3 py-2 overflow-x-auto shrink-0 border-b border-slate-100">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${
                activeTab === cat.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {cat.entries.length > 0 && (
                <span className={`text-[8px] px-1 rounded-full font-black ${activeTab === cat.id ? 'bg-white/30 text-white' : 'bg-slate-300 text-slate-600'}`}>
                  {cat.entries.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-3">
          {currentCat.entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <p className="text-4xl opacity-30">{currentCat.emoji}</p>
              <p className="text-slate-400 text-xs font-bold text-center">
                Nenhum item nesta categoria ainda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {currentCat.entries.map(entry => {
                const qty = entry.qty || (entry.src === 'materials' ? (materials[entry.key] || 0) : (items[entry.key] || 0));
                return (
                  <div
                    key={entry.key}
                    className="bg-slate-50 border border-slate-100 rounded-2xl p-2 flex flex-col items-center gap-1 text-center"
                  >
                    {entry.img ? (
                      <img
                        src={entry.img}
                        alt={entry.label}
                        className="w-10 h-10 object-contain"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span className="text-2xl">{entry.icon || '📦'}</span>
                    )}
                    <p className="text-slate-700 font-black text-[9px] uppercase leading-tight line-clamp-2">
                      {entry.label}{entry.isXL ? ' XL' : ''}
                    </p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      qty >= 10 ? 'bg-green-100 text-green-700' :
                      qty >= 5  ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                    }`}>
                      x{qty}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setSubView('main')}
          className="w-full mt-4 bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg border-b-8 border-slate-900"
        >
          Voltar ao Menu
        </button>
      </div>
    );
  };

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
                { id: true, name: 'Ativado', icon: '=' },
                { id: false, name: 'Desativado', icon: '=' }
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
            {subView === 'settings' ? 'Configurações' : subView === 'backpack' ? 'Mochila' : 'Menu Principal'}
          </h2>
        </div>

        {subView === 'main' ? renderMain() : subView === 'settings' ? renderSettings() : renderBackpack()}

        {subView === 'main' && (
          <button 
            onClick={() => onBack ? onBack() : setCurrentView('city')}
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

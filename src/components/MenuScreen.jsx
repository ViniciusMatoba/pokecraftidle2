import React, { useState } from 'react';
import { APP_VERSION, APP_VERSION_DATE, ITEM_LABELS } from '../data/constants';
import { CANDY_FAMILIES, getCandyIconUrl } from '../data/candies';
import { EXP_CANDIES } from '../data/raids';
import { claimLoginReward, claimMissionReward, formatRewardSummary, getRetentionViewModel } from '../data/retention';
import { getJourneyGuide } from '../data/journeyGuide';

const CURRENT_VERSION = APP_VERSION || '1.4';
const VERSION_DATE = APP_VERSION_DATE || '2026-04-23';
const POKEAPI_ITEM = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';
const assetPath = (path) => `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}${path}`;

const fmtNumber = (value) => Number(value || 0).toLocaleString('pt-BR');

const formatPlayTime = (ms = 0) => {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}min`;
  return `${hours}h ${String(minutes).padStart(2, '0')}min`;
};

// ── Helpers de XP ────────────────────────────────────────────────────────────
const xpForLevel = (lvl) => Math.pow(lvl, 3);
const xpToNext   = (lvl) => Math.pow(lvl + 1, 3) - Math.pow(lvl, 3);

/** Calcula o nível e XP resultantes após ganhar `gain` XP a partir de `currentXp` no `currentLevel` */
const simulateXpGain = (currentLevel, currentXp, gain) => {
  let lvl = currentLevel;
  let xp  = (currentXp || 0) + gain;
  while (xp >= xpToNext(lvl) && lvl < 100) {
    xp -= xpToNext(lvl);
    lvl++;
  }
  return { newLevel: lvl, newXp: xp, levelsGained: lvl - currentLevel };
};

// ── Modal: Confirmação de uso da EXP Candy ───────────────────────────────────
const ExpCandyConfirmModal = ({ candy, pokemon, onConfirm, onBack }) => {
  const lvl        = pokemon.level || 1;
  const currentXp  = pokemon.xp   || 0;
  const needed     = xpToNext(lvl);
  const beforePct  = Math.min(100, Math.round((currentXp / needed) * 100));

  const { newLevel, newXp, levelsGained } = simulateXpGain(lvl, currentXp, candy.xp);
  const neededAfter  = xpToNext(newLevel);
  const afterPct     = Math.min(100, Math.round((newXp / neededAfter) * 100));
  const willLevelUp  = levelsGained > 0;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onBack}>
      <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-fadeIn"
        style={{ background: '#fff', border: `3px solid ${candy.color}` }}
        onClick={e => e.stopPropagation()}>

        {/* Barra top colorida */}
        <div className="h-1.5 w-full" style={{ background: candy.color }} />

        {/* Header — candy + pokémon */}
        <div className="px-5 pt-5 pb-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            Confirmar uso do item
          </p>

          {/* Candy → Pokémon */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100">
            {/* Candy */}
            <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: candy.color + '20' }}>
              <img src={candy.sprite} alt={candy.name}
                className="w-9 h-9 object-contain"
                onError={e => { e.target.style.display = 'none'; }} />
            </div>
            {/* Seta */}
            <div className="text-slate-300 font-black text-xl">→</div>
            {/* Pokémon */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.isShiny ? 'shiny/' : ''}${pokemon.id}.png`}
                alt={pokemon.name}
                className="w-12 h-12 object-contain shrink-0"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className="min-w-0">
                <p className="font-black text-slate-800 uppercase text-sm leading-none truncate">
                  {pokemon.isShiny ? '✨ ' : ''}{pokemon.name}
                </p>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                  Nv.{lvl}
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-500 text-[8px] font-bold">
                    {pokemon._loc}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prévia de XP */}
        <div className="px-5 pb-4 flex flex-col gap-3">

          {/* Antes */}
          <div>
            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-1">
              <span>XP Atual</span>
              <span>{currentXp.toLocaleString()} / {needed.toLocaleString()}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-blue-400 transition-all"
                style={{ width: `${beforePct}%` }} />
            </div>
          </div>

          {/* Ganho */}
          <div className="flex items-center justify-center gap-2 py-1">
            <span className="text-lg" style={{ color: candy.color }}>+</span>
            <span className="font-black text-base" style={{ color: candy.color }}>
              {candy.xp.toLocaleString()} XP
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">{candy.name}</span>
          </div>

          {/* Depois */}
          <div>
            <div className="flex justify-between text-[9px] font-black mb-1" style={{ color: willLevelUp ? '#16a34a' : '#64748b' }}>
              <span>Após usar</span>
              <span>
                {willLevelUp
                  ? `Nv.${newLevel} (+${levelsGained} level${levelsGained > 1 ? 's' : ''}!)`
                  : `${newXp.toLocaleString()} / ${neededAfter.toLocaleString()}`}
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden"
              style={{ background: willLevelUp ? '#dcfce7' : '#f1f5f9' }}>
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${afterPct}%`,
                  background: willLevelUp
                    ? 'linear-gradient(90deg,#22c55e,#4ade80)'
                    : 'linear-gradient(90deg,#3b82f6,#60a5fa)',
                }} />
            </div>
          </div>

          {/* Badge level up */}
          {willLevelUp && (
            <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-2xl bg-green-50 border border-green-200">
              <span className="text-base">⬆️</span>
              <p className="text-[11px] font-black text-green-700 uppercase">
                Level Up! Nv.{lvl} → Nv.{newLevel}
              </p>
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onBack}
            className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase text-xs tracking-widest active:scale-95 transition-all">
            ← Voltar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest text-white active:scale-95 transition-all shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${candy.color}, ${candy.color}bb)`,
              boxShadow: `0 4px 14px ${candy.color}55`,
            }}>
            🍬 Usar!
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Modal: Selecionar Pokémon para receber EXP Candy ─────────────────────────
const ExpCandyModal = ({ candy, gameState, onUse, onClose }) => {
  const [confirmPokemon, setConfirmPokemon] = useState(null);

  const allPokemon = [
    ...(gameState.team || []).map(p => ({ ...p, _loc: 'Equipe' })),
    ...(gameState.pc   || []).map(p => ({ ...p, _loc: 'PC' })),
  ].filter(p => p && p.instanceId);

  const handleConfirm = () => {
    onUse(candy.id, confirmPokemon.instanceId);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}>
        <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl border-t-4 animate-slideUp overflow-hidden"
          style={{ borderColor: candy.color }}
          onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-3"
            style={{ background: candy.color + '22' }}>
            <img src={candy.sprite} alt={candy.name}
              className="w-10 h-10 object-contain"
              onError={e => { e.target.style.display='none'; }} />
            <div className="flex-1">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Usar item</p>
              <h3 className="font-black text-slate-800 text-base uppercase leading-tight">{candy.name}</h3>
              <p className="text-[10px] font-bold" style={{ color: candy.color }}>
                +{candy.xp.toLocaleString()} XP · Tamanho {candy.size}
              </p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-sm">✕</button>
          </div>

          {/* Lista de Pokémon */}
          <div className="p-3 max-h-72 overflow-y-auto flex flex-col gap-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Selecione o Pokémon que receberá a EXP:
            </p>
            {allPokemon.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-6">Nenhum Pokémon disponível.</p>
            )}
            {allPokemon.map(p => {
              const lvl = p.level || 1;
              const needed = xpToNext(lvl);
              const xpPct  = Math.min(100, Math.round(((p.xp || 0) / needed) * 100));
              return (
                <button key={p.instanceId}
                  onClick={() => setConfirmPokemon(p)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all text-left w-full">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`}
                    alt={p.name}
                    className="w-10 h-10 object-contain"
                    onError={e => { e.target.style.display='none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-slate-800 uppercase text-xs leading-none truncate">
                        {p.isShiny ? '✨ ' : ''}{p.name}
                      </p>
                      <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full shrink-0">
                        {p._loc}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold mt-0.5">Nv.{lvl}</p>
                    <div className="mt-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${xpPct}%` }} />
                    </div>
                    <p className="text-[8px] text-slate-400 mt-0.5">
                      {(p.xp || 0).toLocaleString()} / {needed.toLocaleString()} XP
                      <span className="font-bold ml-1" style={{ color: candy.color }}>
                        (+{candy.xp.toLocaleString()})
                      </span>
                    </p>
                  </div>
                  <span className="text-lg shrink-0">🍬</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 pt-0">
            <button onClick={onClose}
              className="w-full py-3 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase text-xs tracking-widest">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmação (layer acima) */}
      {confirmPokemon && (
        <ExpCandyConfirmModal
          candy={candy}
          pokemon={confirmPokemon}
          onConfirm={handleConfirm}
          onBack={() => setConfirmPokemon(null)}
        />
      )}
    </>
  );
};

const MenuScreen = ({ gameState, setCurrentView, setGameState, user, onSave, MUSIC_LIST, onBack, showConfirm, closeConfirm, onUseExpCandy, onOpenFriends, pendingFriendRequestsCount = 0 }) => {
  const [updating, setUpdating] = useState(false);
  const [subView, setSubView] = useState('main'); // 'main' ou 'settings'
  const [activeTab, setActiveTab] = useState('balls');
  const [expCandyModal, setExpCandyModal] = useState(null); // candy def ou null

  const handleUpdate = () => {
    setUpdating(true);
    localStorage.setItem('pokecraft_last_reload', String(Date.now()));
    setTimeout(() => window.location.reload(true), 400);
  };

  const menuItems = [
    { id: 'guide',    name: 'Guia da Jornada', icon: `${POKEAPI_ITEM}town-map.png`,       desc: 'Proximo passo e drops',    color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { id: 'pokedex',  name: 'Pokedex',       icon: '📕',                                   desc: 'Registro de especies',    color: 'bg-red-50 border-red-200 text-red-600' },
    { id: 'backpack', name: 'Mochila',        icon: '🎒',                                   desc: 'Itens e Equipamentos',    color: 'bg-orange-50 border-orange-200 text-orange-600' },
    { id: 'missions', name: 'Missoes',        icon: '/assets/icons/quests.png',             desc: 'Login diario e metas',    color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    { id: 'friends',  name: 'Rede de Amigos', icon: `${POKEAPI_ITEM}vs-seeker.png`,        desc: 'Amigos, batalhas e desafios', color: 'bg-blue-50 border-blue-200 text-blue-700', badge: pendingFriendRequestsCount },
    { id: 'stats',    name: 'Estatisticas',   icon: `${POKEAPI_ITEM}data-card-01.png`,      desc: 'Dados da Jornada',        color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
    { id: 'settings', name: 'Configuracoes',  icon: `${POKEAPI_ITEM}vs-seeker.png`,         desc: 'Ajustes do sistema',      color: 'bg-indigo-50 border-indigo-200 text-indigo-600' },
    { id: 'save',     name: 'Salvar Jogo',    icon: '💾',                                   desc: 'Progresso em Nuvem',      color: 'bg-green-50 border-green-200 text-green-600' },
    { id: 'exit',     name: 'Sair do Jogo',   icon: `${POKEAPI_ITEM}escape-rope.png`,       desc: 'Voltar ao inicio',        color: 'bg-slate-50 border-slate-200 text-slate-600' },
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
                message: 'Deseja realmente sair? Seu progresso nao salvo podera ser perdido.',
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
                  message: 'Seu jogo e salvo automaticamente na nuvem a cada acao importante!',
                  onConfirm: closeConfirm
                });
              }
            }
            else if (item.id === 'pokedex') setCurrentView('pokedex');
            else if (item.id === 'settings') setSubView('settings');
            else if (item.id === 'backpack') setSubView('backpack');
            else if (item.id === 'stats') setSubView('stats');
            else if (item.id === 'missions') setSubView('missions');
            else if (item.id === 'guide') setSubView('guide');
            else if (item.id === 'friends') { if (onOpenFriends) onOpenFriends(); }
            else {
              showConfirm({
                title: 'Em Breve',
                message: `${item.name} sera implementado em breve! Fique atento as atualizacoes.`,
                onConfirm: closeConfirm
              });
            }
          }}
          className={`w-full p-4 rounded-3xl border-4 ${item.color} shadow-lg hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all flex items-center gap-6 text-left group overflow-hidden relative theme-glass`}
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-inner border-2 border-white group-hover:rotate-6 transition-transform">
            {item.icon.startsWith('http') || item.icon.startsWith('/') ? (
              <img src={item.icon.startsWith('/') ? assetPath(item.icon) : item.icon} className="w-10 h-10 object-contain drop-shadow-md" alt={item.name}
                onError={e => { e.target.style.display = 'none'; }} />
            ) : (
              <span className="text-3xl leading-none select-none">{item.icon}</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black uppercase italic leading-none tracking-tight">{item.name}</h3>
            <p className="text-[10px] font-bold opacity-80 uppercase mt-1 tracking-wide">{item.desc}</p>
          </div>
          {item.badge > 0 && (
            <span className="shrink-0 bg-red-500 text-white text-xs font-black min-w-[26px] h-7 px-2 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
          <div className="text-xl opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all">&gt;</div>
        </button>
      ))}

      {/* Secao de versao e atualizacao rapida */}
      <div className="mt-4 bg-white p-5 rounded-[2.5rem] border-b-8 border-slate-200 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-wider leading-none">Versao do Jogo</p>
            <p className="text-slate-800 font-bold text-xs mt-1">v{CURRENT_VERSION} - {VERSION_DATE}</p>
          </div>
          <button
            onClick={handleUpdate}
            disabled={updating}
            className={`px-4 py-2 rounded-xl font-black uppercase text-[10px] transition-all flex items-center gap-2 ${
              updating ? 'bg-slate-100 text-slate-300' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md active:scale-95'
            }`}
          >
            {updating ? '...' : 'Atualizar'} {updating ? 'Atualizando...' : ''}
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
        label: 'Pokebolas',
        emoji: 'O',
        img: `${POKEAPI_ITEM}poke-ball.png`,
        caption: 'Captura',
        entries: [
          { key: 'pokeballs',  label: 'Poke Bola',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' },
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
        emoji: '+',
        img: `${POKEAPI_ITEM}potion.png`,
        caption: 'Restauracao',
        entries: [
          { key: 'potions',      label: 'Pocao',         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png' },
          { key: 'super_potion', label: 'Super Pocao',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png' },
          { key: 'hyper_potion', label: 'Hiper Pocao',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png' },
          { key: 'max_potion',   label: 'Pocao Maxima',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-potion.png' },
          { key: 'full_restore', label: 'Full Restore',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png' },
          { key: 'revive',       label: 'Reviver',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png' },
          { key: 'max_revive',   label: 'Max Reviver',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-revive.png' },
          { key: 'antidote',     label: 'Antidoto',      img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/antidote.png' },
          { key: 'full_heal',    label: 'Full Heal',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-heal.png' },
        ].filter(e => (items[e.key] || 0) > 0),
      },
      {
        id: 'food',
        label: 'Comida',
        emoji: '*',
        img: `${POKEAPI_ITEM}berry-juice.png`,
        caption: 'Energia',
        entries: [
          { key: 'fresh_water',       label: 'Agua Fresca',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fresh-water.png',   src: 'items' },
          { key: 'soda_pop',          label: 'Soda Pop',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soda-pop.png',       src: 'items' },
          { key: 'lemonade',          label: 'Limonada',       img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lemonade.png',        src: 'items' },
          { key: 'moomoo_milk',       label: 'Leite MooMoo',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moomoo-milk.png',    src: 'items' },
          { key: 'berry_juice',       label: 'Suco de Baga',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/berry-juice.png',    src: 'items' },
          { key: 'poke_food',         label: 'Racao Comum',    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/honey.png',            src: 'items' },
          { key: 'poke_food_premium', label: 'Racao Premium',  img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png',   src: 'items' },
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
        emoji: '#',
        img: `${POKEAPI_ITEM}hard-stone.png`,
        caption: 'Forja',
        entries: Object.entries(materials || {})
          .filter(([k, v]) => v > 0 && !k.includes('berry') && !k.includes('apricorn'))
          .map(([k, v]) => ({
            key: k,
            label: ITEM_LABELS[k]?.name || k.replace(/_/g, ' '),
            icon: ITEM_LABELS[k]?.icon || '[]',
            qty: v,
          })),
      },
      {
        id: 'berries_apricorns',
        label: 'Berries',
        emoji: '@',
        img: `${POKEAPI_ITEM}oran-berry.png`,
        caption: 'Plantio',
        entries: Object.entries(materials || {})
          .filter(([k, v]) => v > 0 && (k.includes('berry') || k.includes('apricorn')))
          .map(([k, v]) => ({
            key: k,
            label: ITEM_LABELS[k]?.name || k.replace(/_/g, ' '),
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${k.replace(/_/g, '-')}.png`,
            qty: v,
          })),
      },
      {
        id: 'exp_candies',
        label: 'EXP Candy',
        emoji: '🍬',
        img: `${POKEAPI_ITEM}rare-candy.png`,
        caption: 'Treino',
        entries: Object.values(EXP_CANDIES)
          .filter(c => (items[c.id] || 0) > 0)
          .map(c => ({
            key: c.id,
            label: c.name,
            img: c.img || c.sprite,
            color: c.color,
            qty: items[c.id] || 0,
            isExpCandy: true,
            candyDef: c,
          })),
      },
      {
        id: 'candies',
        label: 'Candies',
        emoji: 'C',
        img: `${POKEAPI_ITEM}rare-candy.png`,
        caption: 'Familias',
        entries: Object.entries({ ...(candies || {}), ...Object.fromEntries(Object.entries(materials || {}).filter(([k]) => k.includes('_candy'))) })
          .filter(([k, v]) => v > 0)
          .map(([k, v]) => {
            const baseCandyId = k.replace(/_xl$/, '');
            const candyData = CANDY_FAMILIES[baseCandyId];
            return {
              key: k,
              label: candyData?.name || k.replace(/_candy_xl/, ' XL').replace(/_candy/, '').replace(/_/g, ' '),
              img: candyData ? getCandyIconUrl(candyData) : undefined,
              icon: candyData ? null : 'C',
              color: candyData?.color,
              qty: v,
              isXL: k.includes('_xl'),
            };
          }),
      },
      {
        id: 'key_items',
        label: 'Itens Chave',
        emoji: 'K',
        img: `${POKEAPI_ITEM}works-key.png`,
        caption: 'Especiais',
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
          { key: 'lure',       label: 'Isca',         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/honey.png' },
          { key: 'super_lure', label: 'Super Isca',   img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/honey.png' },
          { key: 'max_lure',   label: 'Max Isca',     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-toy.png' },
        ].filter(e => (items[e.key] || 0) > 0 || gameState.worldFlags?.includes(`has_${e.key}`)),
      },
    ];

    const currentCat = categories.find(c => c.id === activeTab) || categories[0];
    const totalItems = categories.reduce((s, c) => s + c.entries.length, 0);

    return (
      <div className="flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 shrink-0">
          <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center border border-orange-200 text-xl">
            🎒
          </div>
          <div>
            <h3 className="font-black text-slate-800 uppercase italic text-base leading-none">Mochila</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{totalItems} tipos de item</p>
          </div>
        </div>

        {/* Bolsos da mochila */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-3 py-3 shrink-0 border-b border-slate-100 bg-white/70">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`min-h-[76px] rounded-2xl border-2 p-2.5 text-left transition-all active:scale-95 ${
                activeTab === cat.id
                  ? 'bg-orange-500 border-orange-600 text-white shadow-lg'
                  : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-orange-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeTab === cat.id ? 'bg-white/25' : 'bg-slate-100'}`}>
                  {cat.img ? (
                    <img src={cat.img.startsWith('/') ? assetPath(cat.img) : cat.img} alt={cat.label} className="w-8 h-8 object-contain" onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span className="text-xl">{cat.emoji}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase leading-tight truncate">{cat.label}</p>
                  <p className={`text-[8px] font-black uppercase tracking-wide ${activeTab === cat.id ? 'text-white/75' : 'text-slate-400'}`}>{cat.caption || 'Bolso'}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-black ${activeTab === cat.id ? 'bg-white text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                  {cat.entries.length}
                </span>
              </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentCat.entries.map(entry => {
                const qty = entry.qty || (entry.src === 'materials' ? (materials[entry.key] || 0) : (items[entry.key] || 0));
                const isExpCandy = entry.isExpCandy && onUseExpCandy;
                return (
                  <div
                    key={entry.key}
                    onClick={isExpCandy ? () => setExpCandyModal(entry.candyDef) : undefined}
                    className={`min-h-[122px] bg-white border rounded-2xl p-3 flex flex-col items-center justify-center gap-2 text-center transition-all shadow-sm ${
                      isExpCandy
                        ? 'border-2 cursor-pointer active:scale-95 hover:shadow-md'
                        : 'border-slate-100'
                    }`}
                    style={isExpCandy ? { borderColor: entry.color + '88' } : {}}
                  >
                    {entry.img && entry.color ? (
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm" style={{ background: entry.color + '33' }}>
                        <img src={entry.img} alt={entry.label} className="w-11 h-11 object-contain"
                          onError={e => { e.target.style.display = 'none'; }} />
                      </div>
                    ) : entry.img ? (
                      <img src={entry.img} alt={entry.label} className="w-12 h-12 object-contain"
                        onError={e => { e.target.style.display = 'none'; }} />
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
                    {isExpCandy && (
                      <span className="text-[8px] font-bold uppercase tracking-wide" style={{ color: entry.color }}>
                        Usar ▶
                      </span>
                    )}
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

        {/* Modal EXP Candy */}
        {expCandyModal && (
          <ExpCandyModal
            candy={expCandyModal}
            gameState={gameState}
            onUse={onUseExpCandy}
            onClose={() => setExpCandyModal(null)}
          />
        )}
      </div>
    );
  };

  const renderStats = () => {
    const stats = gameState?.playerStats || {};
    const allPokemon = [...(gameState?.team || []), ...(gameState?.pc || [])];
    const masteryCaptures = Object.values(gameState?.speciesMastery || {}).reduce((sum, value) => sum + Number(value || 0), 0);
    const caughtSpecies = Object.keys(gameState?.caughtData || {}).length;
    const shinyOwned = allPokemon.reduce((sum, p) => sum + (p?.isShiny ? 1 : 0) + Math.max(0, Number(p?.shinyCount || 0) - (p?.isShiny ? 1 : 0)), 0);
    const raidStats = gameState?.raidStats || {};
    const playTime = Number(stats.playTimeMs || 0);
    const startedAt = stats.startedAt ? new Date(stats.startedAt).toLocaleDateString('pt-BR') : 'Nova jornada';
    const pokemonCaptured = Math.max(Number(stats.pokemonCaptured || 0), masteryCaptures, allPokemon.length);
    const shinyCaptured = Math.max(Number(stats.shinyCaptured || 0), Number(gameState?.shinyCapturedCount || 0), shinyOwned);
    const trainersDefeated = Math.max(Number(stats.trainersDefeated || 0), Number(gameState?.trainerBattleWins || 0));
    const raidsWon = Math.max(Number(stats.raidsWon || 0), Number(raidStats.total || 0));
    const raidsCaptured = Math.max(Number(stats.raidsCaptured || 0), Number(raidStats.captured || 0));
    const raidsFled = Math.max(Number(stats.raidsFled || 0), Number(raidStats.fled || 0));

    const statCards = [
      { label: 'Tempo de jogo', value: formatPlayTime(playTime), sub: `Inicio: ${startedAt}`, img: `${POKEAPI_ITEM}town-map.png`, color: 'bg-slate-900 text-white border-slate-950' },
      { label: 'Pokedex', value: fmtNumber(caughtSpecies), sub: 'especies registradas', img: assetPath('/assets/menu/pokedex.png'), color: 'bg-red-50 text-red-700 border-red-200' },
      { label: 'Capturados', value: fmtNumber(pokemonCaptured), sub: 'capturas totais', img: `${POKEAPI_ITEM}poke-ball.png`, color: 'bg-orange-50 text-orange-700 border-orange-200' },
      { label: 'Derrotados', value: fmtNumber(stats.pokemonDefeated), sub: 'batalhas vencidas em rota', img: `${POKEAPI_ITEM}muscle-band.png`, color: 'bg-blue-50 text-blue-700 border-blue-200' },
      { label: 'Shiny capturados', value: fmtNumber(shinyCaptured), sub: 'raros no time e PC', img: `${POKEAPI_ITEM}shiny-charm.png`, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      { label: 'Shiny derrotados', value: fmtNumber(stats.shinyDefeated), sub: 'encontros brilhantes vencidos', img: `${POKEAPI_ITEM}shiny-stone.png`, color: 'bg-amber-50 text-amber-700 border-amber-200' },
      { label: 'Treinadores', value: fmtNumber(trainersDefeated), sub: 'vitorias contra treinadores', img: `${POKEAPI_ITEM}vs-seeker.png`, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { label: 'Equipe vila', value: fmtNumber(stats.villainDefeated), sub: `${fmtNumber(stats.villainEncounters)} encontros registrados`, img: `${POKEAPI_ITEM}black-glasses.png`, color: 'bg-zinc-100 text-zinc-800 border-zinc-300' },
      { label: 'Boss da area', value: fmtNumber(stats.wildBossDefeated), sub: `${fmtNumber(stats.wildBossEncounters)} encontrados`, img: `${POKEAPI_ITEM}scope-lens.png`, color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { label: 'Raids vencidas', value: fmtNumber(raidsWon), sub: `${fmtNumber(stats.raidEncounters)} raids encontradas`, img: `${POKEAPI_ITEM}star-piece.png`, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
      { label: 'Raids capturadas', value: fmtNumber(raidsCaptured), sub: `${fmtNumber(raidsFled)} raids fugiram`, img: `${POKEAPI_ITEM}premier-ball.png`, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { label: 'Dano em boss', value: fmtNumber(gameState?.bossTotalDamage), sub: `ultimo: ${fmtNumber(gameState?.bossLastDamage)}`, img: `${POKEAPI_ITEM}life-orb.png`, color: 'bg-rose-50 text-rose-700 border-rose-200' },
    ];

    return (
      <div className="animate-slideUp flex flex-col gap-4">
        <div className="bg-slate-900 text-white rounded-[2rem] p-5 shadow-xl border-b-8 border-slate-950 overflow-hidden relative">
          <img src={`${POKEAPI_ITEM}data-card-01.png`} alt="" className="absolute -right-4 -top-5 w-28 h-28 opacity-20 rotate-12" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">Registro da jornada</p>
          <h3 className="text-2xl font-black uppercase italic leading-none mt-1">{gameState?.trainer?.name || 'Treinador'}</h3>
          <p className="text-xs font-bold text-slate-300 mt-2">Tudo que o jogador fez fica reunido aqui para acompanhar progresso, captura, batalhas, boss e raids.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {statCards.map(card => (
            <div key={card.label} className={`rounded-2xl border-2 p-4 min-h-[120px] shadow-sm flex flex-col items-center text-center gap-1 ${card.color}`}>
              <div className="w-11 h-11 flex items-center justify-center">
                <img src={card.img} alt="" className="w-10 h-10 object-contain drop-shadow-sm" onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <p className="text-[8px] font-black uppercase opacity-60 leading-tight">{card.label}</p>
              <p className="text-xl font-black leading-none mt-0.5 break-words">{card.value}</p>
              <p className="text-[8px] font-bold uppercase opacity-60 leading-tight">{card.sub}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setSubView('main')}
          className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg border-b-8 border-slate-900"
        >
          Voltar ao Menu
        </button>
      </div>
    );
  };

  const renderGuide = () => {
    const guide = getJourneyGuide(gameState);
    const goToRoute = (routeId) => {
      if (!routeId) return;
      setGameState(prev => ({ ...prev, currentRoute: routeId }));
      setCurrentView('battles');
    };
    const goToVs = () => setCurrentView('vs');
    const DropCard = ({ target }) => (
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <img src={`${POKEAPI_ITEM}${target.type === 'Receita' ? 'tm-case.png' : 'hard-stone.png'}`} alt="" className="w-8 h-8 object-contain" onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">{target.type}</p>
            <h4 className="font-black uppercase italic text-slate-800 leading-tight text-sm">{target.title}</h4>
            <p className="text-[10px] font-bold text-slate-500 mt-1 leading-tight line-clamp-2">{target.label}</p>
          </div>
        </div>
        <button
          onClick={() => goToRoute(target.routeId)}
          className="w-full rounded-xl bg-slate-900 text-white py-3 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
        >
          Ir para {target.routeName}
        </button>
      </div>
    );

    return (
      <div className="animate-slideUp flex flex-col gap-4">
        <div className="rounded-[2rem] p-5 shadow-xl border-b-8 border-blue-900 bg-gradient-to-br from-blue-600 to-slate-900 text-white relative overflow-hidden">
          <img src={`${POKEAPI_ITEM}town-map.png`} alt="" className="absolute -right-4 -top-5 w-28 h-28 opacity-20 rotate-12" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-200">Central da Jornada</p>
          <h3 className="text-2xl font-black uppercase italic leading-none mt-1">{guide.regionLabel}</h3>
          <p className="text-xs font-bold text-white/80 mt-2">
            Proximo passo, rota de treino e drops importantes reunidos para voce nao perder ritmo.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="bg-white rounded-2xl border-2 border-blue-100 p-4 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Objetivo principal</p>
            <h4 className="font-black uppercase italic text-slate-800 text-lg leading-tight mt-1">
              {guide.storyStep?.label || 'Regiao atual completa'}
            </h4>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              {guide.storyStep ? 'Siga pelo MODO VS quando for batalha de historia, rival, equipe vila, ginasio ou liga.' : 'Use as rotas avancadas para treinar ate o nivel 100 e completar drops pendentes.'}
            </p>
            {guide.storyStep && (
              <button onClick={goToVs} className="mt-3 w-full rounded-xl bg-pokeRed text-white py-3 text-[10px] font-black uppercase tracking-widest active:scale-95">
                Abrir Modo VS
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border-2 border-emerald-100 p-4 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Treino recomendado</p>
            <h4 className="font-black uppercase italic text-slate-800 text-lg leading-tight mt-1">
              {guide.nextRoute?.name || 'Nenhuma rota liberada'}
            </h4>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              {guide.nextRoute ? `Level recomendado: ${guide.nextRoute.unlockLevel || 1}. Continue aqui para liberar a proxima etapa.` : 'Avance na historia para liberar rotas de treino.'}
            </p>
            {guide.nextRoute && (
              <button onClick={() => goToRoute(guide.nextRoute.id)} className="mt-3 w-full rounded-xl bg-emerald-600 text-white py-3 text-[10px] font-black uppercase tracking-widest active:scale-95">
                Treinar nesta rota
              </button>
            )}
          </div>

          {guide.nextLockedRoute && (
            <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Proxima rota bloqueada</p>
              <h4 className="font-black uppercase italic text-slate-700 leading-tight mt-1">{guide.nextLockedRoute.name}</h4>
              <p className="text-[10px] font-bold text-slate-500 mt-1">
                Falta: {(guide.nextLockedRoute.missingRequirements || []).join(', ') || 'progresso anterior'}.
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2 px-1">Drops e receitas uteis</p>
          <div className="grid gap-3">
            {[...guide.recipeTargets, ...guide.materialTargets].slice(0, 8).map(target => <DropCard key={target.id} target={target} />)}
            {[...guide.recipeTargets, ...guide.materialTargets].length === 0 && (
              <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 text-center">
                <p className="text-slate-400 text-xs font-bold">Nenhum drop prioritario disponivel nesta etapa. Continue avancando rotas e MODO VS.</p>
              </div>
            )}
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
  };

  const renderMissions = () => {
    const model = getRetentionViewModel(gameState);
    const itemIcon = (name) => `${POKEAPI_ITEM}${name}`;
    const claimLogin = () => {
      setGameState(prev => {
        const result = claimLoginReward(prev);
        if (result.claimed) {
          showConfirm?.({
            title: 'Recompensa Diaria',
            message: formatRewardSummary(result.reward),
            onConfirm: closeConfirm
          });
        }
        return result.state;
      });
    };
    const claimMission = (period, missionId) => {
      setGameState(prev => {
        const result = claimMissionReward(prev, period, missionId);
        if (result.claimed) {
          showConfirm?.({
            title: period === 'weekly' ? 'Missao Semanal' : 'Missao Diaria',
            message: formatRewardSummary(result.reward),
            onConfirm: closeConfirm
          });
        }
        return result.state;
      });
    };

    const MissionCard = ({ mission, period }) => (
      <div className={`rounded-2xl border-2 p-4 shadow-sm ${mission.claimed ? 'bg-emerald-50 border-emerald-200' : mission.complete ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-white shadow-inner flex items-center justify-center shrink-0">
            <img src={itemIcon(mission.icon)} alt="" className="w-9 h-9 object-contain" onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black uppercase italic text-slate-800 leading-none">{mission.title}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1 leading-tight">{mission.description}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-1">
            <span>Progresso</span>
            <span>{fmtNumber(Math.min(mission.progress, mission.target))}/{fmtNumber(mission.target)}</span>
          </div>
          <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${mission.claimed ? 'bg-emerald-500' : mission.complete ? 'bg-yellow-500' : 'bg-blue-500'}`}
              style={{ width: `${mission.pct}%` }}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <p className="flex-1 text-[9px] font-black uppercase text-slate-400 leading-tight">
            {formatRewardSummary(mission.reward)}
          </p>
          <button
            onClick={() => claimMission(period, mission.id)}
            disabled={!mission.complete || mission.claimed}
            className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
              mission.claimed
                ? 'bg-emerald-100 text-emerald-600'
                : mission.complete
                  ? 'bg-pokeRed text-white shadow-md active:scale-95'
                  : 'bg-slate-100 text-slate-400'
            }`}
          >
            {mission.claimed ? 'Coletado' : mission.complete ? 'Coletar' : 'Em progresso'}
          </button>
        </div>
      </div>
    );

    return (
      <div className="animate-slideUp flex flex-col gap-4">
        <div className="rounded-[2rem] p-5 shadow-xl border-b-8 border-yellow-600 bg-gradient-to-br from-yellow-400 to-orange-500 text-white relative overflow-hidden">
          <img src={assetPath('/assets/icons/quests.png')} alt="" className="absolute -right-4 -top-5 w-28 h-28 opacity-20 rotate-12" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-100">Jornada diaria</p>
          <h3 className="text-2xl font-black uppercase italic leading-none mt-1">Streak {model.retention.login.streak} dias</h3>
          <p className="text-xs font-bold text-white/85 mt-2">Melhor sequencia: {model.retention.login.bestStreak} dias. Entre todo dia para acumular recursos e manter o ritmo de progresso.</p>
          <button
            onClick={claimLogin}
            disabled={!model.canClaimLogin}
            className={`mt-4 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs border-b-4 transition-all ${
              model.canClaimLogin
                ? 'bg-white text-orange-600 border-yellow-100 active:scale-95 shadow-lg'
                : 'bg-white/25 text-white/70 border-white/10'
            }`}
          >
            {model.canClaimLogin ? `Coletar Dia ${model.loginReward.cycleDay}` : 'Recompensa ja coletada'}
          </button>
          <p className="mt-2 text-[10px] font-black uppercase text-white/80">{formatRewardSummary(model.loginReward.reward)}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2 px-1">Missoes Diarias</p>
            <div className="flex flex-col gap-3">
              {model.dailyMissions.map(mission => <MissionCard key={mission.id} mission={mission} period="daily" />)}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2 px-1">Missoes Semanais</p>
            <div className="flex flex-col gap-3">
              {model.weeklyMissions.map(mission => <MissionCard key={mission.id} mission={mission} period="weekly" />)}
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

          {/* Modo de exibicao */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Modo de Exibicao (PC)</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'mobile', name: 'Mobile', icon: 'M' },
                { id: 'pc', name: 'Expandido', icon: 'PC' }
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
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Trava de Nivel (Level Cap)</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: true, name: 'Ativado', icon: 'ON' },
                { id: false, name: 'Desativado', icon: 'OFF' }
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
          {/* Selecao de musica */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Musica de Fundo</p>
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

  const screenTitle = subView === 'settings'
    ? 'Configuracoes'
    : subView === 'backpack'
      ? 'Mochila'
      : subView === 'stats'
        ? 'Estatisticas'
        : subView === 'missions'
          ? 'Missoes'
          : subView === 'guide'
            ? 'Guia'
            : 'Menu Principal';
  const screenIcon = subView === 'settings'
    ? `${POKEAPI_ITEM}vs-seeker.png`
    : subView === 'stats'
      ? `${POKEAPI_ITEM}data-card-01.png`
      : subView === 'backpack'
        ? `${POKEAPI_ITEM}bag.png`
        : subView === 'missions'
          ? assetPath('/assets/icons/quests.png')
          : subView === 'guide'
            ? `${POKEAPI_ITEM}town-map.png`
            : `${POKEAPI_ITEM}poke-doll.png`;

  return (
    <div className="h-full bg-slate-100 animate-fadeIn relative overflow-y-auto custom-scrollbar pt-12 pb-24">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" className="absolute top-10 left-10 w-64 h-64 rotate-12" alt="" />
      </div>
      
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-pokeRed p-3 rounded-2xl shadow-lg">
            <img src={screenIcon} className="w-8 h-8 object-contain" alt="Menu" />
          </div>
          <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">
            {screenTitle}
          </h2>
        </div>

        {subView === 'main' ? renderMain() : subView === 'settings' ? renderSettings() : subView === 'stats' ? renderStats() : subView === 'missions' ? renderMissions() : subView === 'guide' ? renderGuide() : renderBackpack()}

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

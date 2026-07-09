import React, { useState, useEffect } from 'react';
import {
  getTowerStarters, startTowerRun, generateTowerEncounter,
  generateFloorShop, resumeTowerRun, 
} from '../utils/towerLogic';
import { TYPE_COLOR_HEX } from '../data/gyms';
import { POKEDEX } from '../data/pokedex';
import { MOVES } from '../data/moves';

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_PILL = 'text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20';
const ASSET_BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const towerAsset = (file) => `url('${ASSET_BASE}/${file}')`;
const TOWER_LOBBY_BG = towerAsset('bg_battle_frontier.webp');
const TOWER_RUN_BG = towerAsset('bg_galar_rose_tower.webp');
const TOWER_SHOP_BG = towerAsset('bg_battle_tower_shop.webp');
const GLASS_PANEL = 'bg-slate-950/[0.62] border border-white/[0.12] shadow-2xl shadow-black/35 backdrop-blur-md';

// Move colorido por tipo
const TYPE_MOVE_CLS = {
  Fire:'bg-red-600/20 border-red-500/40 text-red-400',
  Water:'bg-blue-600/20 border-blue-500/40 text-blue-400',
  Grass:'bg-green-600/20 border-green-500/40 text-green-400',
  Electric:'bg-yellow-500/20 border-yellow-400/40 text-yellow-300',
  Ice:'bg-cyan-500/20 border-cyan-400/40 text-cyan-400',
  Fighting:'bg-orange-600/20 border-orange-500/40 text-orange-400',
  Poison:'bg-purple-600/20 border-purple-500/40 text-purple-400',
  Ground:'bg-amber-700/20 border-amber-600/40 text-amber-500',
  Flying:'bg-indigo-500/20 border-indigo-400/40 text-indigo-400',
  Psychic:'bg-pink-600/20 border-pink-500/40 text-pink-400',
  Bug:'bg-lime-600/20 border-lime-500/40 text-lime-400',
  Rock:'bg-stone-600/20 border-stone-500/40 text-stone-400',
  Ghost:'bg-violet-800/20 border-violet-700/40 text-violet-400',
  Dragon:'bg-violet-600/20 border-violet-500/40 text-violet-400',
  Dark:'bg-slate-700/20 border-slate-600/40 text-slate-300',
  Steel:'bg-slate-400/20 border-slate-300/40 text-slate-200',
  Fairy:'bg-pink-400/20 border-pink-300/40 text-pink-300',
  Normal:'bg-slate-600/20 border-slate-500/40 text-slate-300',
};

const _moveTypeClass = (moveKey) => {
  const move = MOVES[moveKey];
  return TYPE_MOVE_CLS[move?.type] || TYPE_MOVE_CLS.Normal;
};

const _moveName = (moveKey) => MOVES[moveKey]?.name || moveKey;
const _moveCategory = (moveKey) => {
  const cat = MOVES[moveKey]?.category;
  if (cat === 'Physical') return 'Físico';
  if (cat === 'Special') return 'Especial';
  return 'Status';
};
const _movePower = (moveKey) => MOVES[moveKey]?.power || null;
const towerXpNeeded = (level) => Math.pow((level || 1) + 1, 3) - Math.pow(level || 1, 3);

// ── Componente ────────────────────────────────────────────────────────────────

const BattleTowerScreen = ({ gameState, setGameState, setCurrentView, onOpenTowerCombat }) => {
  const tower = gameState.tower || { activeRun: null, highestFloor: 0, bp: 0 };

  // Pool do jogador: time real + PC
  const playerPool = [
    ...(gameState.team || []),
    ...(gameState.pc || []),
  ];

  // Fase principal: lobby | draft | move_selection | run
  const [phase, setPhase] = useState(tower.activeRun ? 'run' : 'lobby');
  const [draftOptions, setDraftOptions] = useState([]);

  // Seleção de golpes: qual Pokémon está esperando seleção e os moves escolhidos
  const [pendingPoke, setPendingPoke] = useState(null);   // Pokémon aguardando seleção de golpes
  const [selectedMoves, setSelectedMoves] = useState([]); // Golpes escolhidos (até 4)
  const [pendingTeamIndex, setPendingTeamIndex] = useState(null);

  // Modal de Shop (pós-batalha)
  const [showShopModal, setShowShopModal] = useState(false);

  const run = tower.activeRun;

  // Detecta shopPending e abre o modal automaticamente
  useEffect(() => {
    if (!run?.shopPending) return;
    // Garante que o shop está gerado e marca como não-pending
    setGameState(prev => {
      if (!prev.tower?.activeRun?.shopPending) return prev;
      const newRun = {
        ...prev.tower.activeRun,
        shopPending: false,
        shop: generateFloorShop(
          prev.tower.activeRun.floor,
          playerPool,
          prev.tower.activeRun.team
        ),
      };
      return { ...prev, tower: { ...prev.tower, activeRun: newRun } };
    });
    setShowShopModal(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run?.shopPending]);

  // ── Handlers: Lobby ────────────────────────────────────────────────────────

  const handleStartDraft = () => {
    setDraftOptions(getTowerStarters(playerPool));
    setPhase('draft');
  };

  // ── Handlers: Draft / Seleção de moves ────────────────────────────────────

  const handleSelectDraft = (poke) => {
    if (poke.needsMoveSelection) {
      // Pokémon tem > 4 moves — precisa de seleção
      setPendingPoke(poke);
      setSelectedMoves(poke.moves.slice(0, 4)); // pré-seleciona os últimos 4
      setPendingTeamIndex(null);
      setPhase('move_selection');
    } else {
      // Pokémon já tem ≤ 4 moves — inicia direto
      confirmDraft(poke);
    }
  };

  const toggleMove = (moveKey) => {
    setSelectedMoves(prev => {
      if (prev.includes(moveKey)) return prev.filter(m => m !== moveKey);
      if (prev.length >= 4) return prev; // Limite de 4
      return [...prev, moveKey];
    });
  };

  const confirmMoveSelection = () => {
    if (selectedMoves.length === 0) return;
    const finalPoke = { ...pendingPoke, moves: selectedMoves, needsMoveSelection: false, _isTowerTeam: undefined };
    if (pendingTeamIndex !== null) {
      setGameState(prev => {
        const prevRun = prev.tower?.activeRun;
        if (!prevRun) return prev;
        const team = [...(prevRun.team || [])];
        if (!team[pendingTeamIndex]) return prev;
        team[pendingTeamIndex] = { ...team[pendingTeamIndex], ...finalPoke, _isTowerTeam: undefined };
        return { ...prev, tower: { ...prev.tower, activeRun: { ...prevRun, team } } };
      });
      setPendingPoke(null);
      setPendingTeamIndex(null);
      setSelectedMoves([]);
      setPhase('run');
      setShowShopModal(true);
      return;
    }
    confirmDraft(finalPoke);
    setPendingPoke(null);
    setSelectedMoves([]);
  };

  const confirmDraft = (poke) => {
    // ISOLAMENTO: NÃO toca gameState.team — só atualiza tower.activeRun
    const newRun = startTowerRun(poke);
    setGameState(prev => ({
      ...prev,
      currentRoute: 'tower',
      tower: {
        ...prev.tower,
        activeRun: newRun,
        // Guarda checkpoint vazio ao início (para o "continuar" no lobby)
      },
    }));
    setPhase('run');
  };

  // ── Handlers: Run ─────────────────────────────────────────────────────────

  const handleEndRun = () => {
    const gainedBp = run ? run.floor * 10 : 0;
    const highest = Math.max(tower.highestFloor || 0, run?.floor || 0);
    setGameState(prev => ({
      ...prev,
      currentRoute: 'pallet_town',
      tower: {
        ...prev.tower,
        bp: (prev.tower.bp || 0) + gainedBp,
        highestFloor: highest,
        activeRun: null,
        battleEncounter: null,
      },
    }));
    setShowShopModal(false);
    setPhase('lobby');
  };

  const handleBattle = () => {
    if (!tower.activeRun) return;
    setShowShopModal(false);
    const encounter = generateTowerEncounter(tower.activeRun.floor);
    onOpenTowerCombat(encounter);
  };

  // Handler para compra de recruta com seleção de moves
  const handleRecruitWithMoves = (pokemon) => {
    if (pokemon.needsMoveSelection) {
      setPendingPoke({ ...pokemon, _isRecruit: true });
      setSelectedMoves(pokemon.moves.slice(0, 4));
      setPendingTeamIndex(null);
      setPhase('move_selection');
      setShowShopModal(false);
    }
  };

  const handleEditTowerMoves = (teamIndex) => {
    const poke = run?.team?.[teamIndex];
    if (!poke) return;
    setPendingPoke({ ...poke, _isTowerTeam: true });
    setSelectedMoves((poke.moves || []).slice(0, 4));
    setPendingTeamIndex(teamIndex);
    setShowShopModal(false);
    setPhase('move_selection');
  };

  // Confirma seleção de moves para um recruta
  const confirmRecruitMoveSelection = () => {
    if (selectedMoves.length === 0 || !pendingPoke) return;
    const finalPoke = { ...pendingPoke, moves: selectedMoves, needsMoveSelection: false, _isRecruit: undefined };
    setGameState(prev => {
      const prevRun = prev.tower?.activeRun;
      if (!prevRun) return prev;
      return {
        ...prev,
        tower: {
          ...prev.tower,
          activeRun: { ...prevRun, team: [...prevRun.team, finalPoke] },
        },
      };
    });
    setPendingPoke(null);
    setPendingTeamIndex(null);
    setSelectedMoves([]);
    setPhase('run');
    setShowShopModal(true);
  };

  // ── Fase: Lobby ────────────────────────────────────────────────────────────
  if (phase === 'lobby') {
    return (
      <div
        className="h-full flex flex-col animate-fadeIn p-5 overflow-y-auto relative"
        style={{ backgroundImage: TOWER_LOBBY_BG, backgroundPosition: 'center', backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/78 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(250,204,21,0.18),transparent_34%)]" />
        <div className="relative z-10 flex justify-between items-center mb-5">
          <div>
            <h2 className="text-white font-black text-2xl uppercase italic tracking-tighter drop-shadow">🗼 Battle Tower</h2>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">Endgame Roguelike</p>
          </div>
          <button onClick={() => setCurrentView('city')} className="text-white/40 hover:text-white font-black text-lg w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        <div className="relative z-10 flex flex-col gap-4 flex-1">
          {/* Recorde */}
          <div className={`${GLASS_PANEL} rounded-3xl p-5 text-center overflow-hidden relative`}>
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-yellow-300 to-purple-500" />
            <h3 className="text-red-300 font-black uppercase tracking-widest text-[10px] mb-2">Recorde de Escalada</h3>
            <div className="text-5xl font-black text-white italic drop-shadow-md leading-none">Andar {tower.highestFloor || 0}</div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white/45">draft, shop e bosses a cada 10 andares</p>
          </div>

          {/* BP */}
          <div className={`${GLASS_PANEL} rounded-3xl p-5`}>
            <div className="flex justify-between items-center mb-4">
              <p className="text-white/70 font-bold text-sm uppercase tracking-widest">Battle Points (BP)</p>
              <p className="text-yellow-400 font-black text-xl">{(tower.bp || 0).toLocaleString()} BP</p>
            </div>
            <button className="w-full bg-white/[0.08] border border-white/[0.12] text-white/55 py-3 rounded-xl font-bold uppercase text-xs hover:bg-white/[0.12] transition-colors">
              Abrir Loja BP (Em Breve)
            </button>
          </div>

          {/* Pokémon disponíveis no pool */}
          {playerPool.length > 0 && (
            <div className={`${GLASS_PANEL} rounded-2xl px-4 py-3`}>
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Pokémon disponíveis para o draft</p>
              <p className="text-white/70 text-sm font-bold">{playerPool.length} Pokémon capturados</p>
            </div>
          )}

          {/* Botões */}
          {tower.checkpoint ? (
            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={() => {
                  const resumed = resumeTowerRun(tower.checkpoint, playerPool, tower.checkpoint.team);
                  setGameState(prev => ({
                    ...prev,
                    currentRoute: 'tower',
                    tower: { ...prev.tower, activeRun: resumed },
                  }));
                  setPhase('run');
                }}
                className="w-full bg-red-600 text-white py-6 rounded-3xl font-black uppercase text-xl italic tracking-tighter hover:bg-red-500 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-900/30 border-b-8 border-red-800"
              >
                Continuar do Andar {tower.checkpoint.floor}
              </button>
              <button
                onClick={handleStartDraft}
                className="w-full bg-slate-800 text-slate-400 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-slate-700 hover:text-white transition-all border-b-4 border-slate-900"
              >
                Zerar e Novo Draft
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartDraft}
              className="w-full mt-auto bg-red-600 text-white py-6 rounded-3xl font-black uppercase text-xl italic tracking-tighter hover:bg-red-500 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-900/30 border-b-8 border-red-800"
            >
              Começar Nova Run
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Fase: Draft ───────────────────────────────────────────────────────────
  if (phase === 'draft') {
    return (
      <div
        className="h-full flex flex-col p-5 animate-fadeIn overflow-y-auto relative"
        style={{ backgroundImage: TOWER_RUN_BG, backgroundPosition: 'center', backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/82 to-slate-950" />
        <div className="relative z-10">
        <button onClick={() => setPhase('lobby')} className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest mb-4 text-left">← Voltar</button>
        <h2 className="text-center text-white font-black uppercase italic tracking-tighter text-2xl mb-1 drop-shadow">Escolha seu Inicial</h2>
        <p className="text-center text-white/50 text-[10px] uppercase tracking-widest mb-6">
          {playerPool.length > 0 ? 'Seus Pokémon capturados' : 'Pokémon aleatórios (capture mais para ter mais opções!)'}
        </p>

        <div className="flex flex-col gap-4">
          {draftOptions.map((poke, i) => {
            const data = POKEDEX[poke.id];
            if (!data) return null;
            const col = TYPE_COLOR_HEX[data.types?.[0]] || '#555';
            return (
              <button
                key={i}
                onClick={() => handleSelectDraft(poke)}
                className={`${GLASS_PANEL} rounded-3xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform text-left group overflow-hidden relative`}
              >
                <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(90deg, ${col}, transparent)` }} />
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`}
                  className="w-16 h-16 drop-shadow-lg z-10"
                  alt={data.name}
                />
                <div className="flex-1 z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-black text-lg uppercase italic">{data.name}</h3>
                    <span className="text-white/40 text-[10px] font-bold">Nv {poke.level}</span>
                  </div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {(data.types || []).map(t => (
                      <span key={t} className={TYPE_PILL}>{t}</span>
                    ))}
                  </div>
                  <p className="text-white/40 text-[9px] mt-1.5">
                    {poke.allMoves?.length || poke.moves?.length || 0} golpes aprendidos
                    {poke.needsMoveSelection && <span className="text-yellow-400 ml-1">— escolher 4</span>}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        </div>
      </div>
    );
  }

  // ── Fase: Seleção de golpes ────────────────────────────────────────────────
  if (phase === 'move_selection') {
    const poke = pendingPoke;
    const data = poke ? POKEDEX[poke.id] : null;
    const allMoves = poke?.allMoves || [];
    const isRecruit = poke?._isRecruit;
    const requiredMoves = Math.min(4, Math.max(1, allMoves.length));

    return (
      <div
        className="h-full flex flex-col p-5 animate-fadeIn overflow-y-auto relative"
        style={{ backgroundImage: TOWER_SHOP_BG, backgroundPosition: 'center', backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/58 via-slate-950/86 to-slate-950" />
        <div className="relative z-10 flex flex-col min-h-full">
        {/* Header */}
        <div className={`${GLASS_PANEL} rounded-3xl p-3 flex items-center gap-3 mb-5`}>
          {data && (
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`}
              className="w-14 h-14 drop-shadow-lg"
              alt={data.name}
            />
          )}
          <div>
            <h2 className="text-white font-black text-xl uppercase italic tracking-tighter">
              {data?.name} — Golpes
            </h2>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
              Escolha {requiredMoves === 4 ? 'exatamente 4 golpes' : `${requiredMoves} golpe${requiredMoves !== 1 ? 's' : ''}`} para a batalha
            </p>
          </div>
        </div>

        {/* Contador */}
        <div className={`flex items-center justify-between mb-4 px-4 py-2.5 rounded-xl border backdrop-blur-md ${selectedMoves.length === requiredMoves ? 'bg-green-900/30 border-green-500/30' : 'bg-slate-950/60 border-white/10'}`}>
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Selecionados</span>
          <span className={`font-black text-lg ${selectedMoves.length === requiredMoves ? 'text-green-400' : 'text-white'}`}>
            {selectedMoves.length} / {requiredMoves}
          </span>
        </div>

        {/* Lista de todos os golpes */}
        <div className="flex flex-col gap-2 mb-5 flex-1">
          {allMoves.map((moveKey) => {
            const move = MOVES[moveKey];
            const isSelected = selectedMoves.includes(moveKey);
            const typeClass = TYPE_MOVE_CLS[move?.type] || TYPE_MOVE_CLS.Normal;
            const canSelect = isSelected || selectedMoves.length < 4;

            return (
              <button
                key={moveKey}
                onClick={() => toggleMove(moveKey)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  isSelected
                    ? `${typeClass} ring-2 ring-white/30 scale-[1.01]`
                    : canSelect
                    ? `${typeClass} opacity-70 hover:opacity-100`
                    : 'bg-slate-900 border-white/5 opacity-30 cursor-not-allowed'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${isSelected ? 'bg-white border-white' : 'border-white/30'}`}>
                  {isSelected && <span className="text-slate-900 text-xs font-black">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs uppercase truncate">{move?.name || moveKey}</p>
                  <p className="text-[8px] opacity-70 font-bold">
                    {move?.type} · {move?.category === 'Physical' ? 'Físico' : move?.category === 'Special' ? 'Especial' : 'Status'}
                    {move?.power ? ` · 💥 ${move.power}` : ''}
                    {move?.accuracy && move.accuracy < 100 ? ` · 🎯 ${move.accuracy}%` : ''}
                  </p>
                </div>
                <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-white/20'}`} />
              </button>
            );
          })}
        </div>

        {/* Confirmar */}
        <button
          onClick={isRecruit ? confirmRecruitMoveSelection : confirmMoveSelection}
          disabled={selectedMoves.length !== requiredMoves}
          className={`w-full py-4 rounded-2xl font-black uppercase text-base tracking-widest transition-all border-b-4 ${
            selectedMoves.length === requiredMoves
              ? 'bg-green-600 border-green-800 text-white hover:bg-green-500 hover:scale-[1.01] active:scale-95'
              : 'bg-slate-900 border-slate-900 text-white/30 cursor-not-allowed'
          }`}
        >
          {selectedMoves.length === requiredMoves ? '✅ Confirmar Golpes' : `Selecione ${requiredMoves - selectedMoves.length} golpe${requiredMoves - selectedMoves.length !== 1 ? 's' : ''} ainda`}
        </button>
        </div>
      </div>
    );
  }

  // ── Fase: Run ─────────────────────────────────────────────────────────────
  if (!run) return null;

  const isBossFloor = run.floor % 10 === 0;
  const inv = run.inventory || { coins: 0, potions: 0, revives: 0 };

  return (
    <div
      className="h-full flex flex-col bg-slate-950 animate-fadeIn overflow-hidden relative"
      style={{ backgroundImage: TOWER_RUN_BG, backgroundPosition: 'center', backgroundSize: 'cover' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/48 via-slate-950/78 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.18),transparent_34%)]" />

      {/* Modal de Shop (pós-batalha) */}
      {showShopModal && (
        <div
          className="absolute inset-0 z-50 flex flex-col"
          style={{ backgroundImage: TOWER_SHOP_BG, backgroundPosition: 'center', backgroundSize: 'cover' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/[0.62] to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(250,204,21,0.18),transparent_36%)]" />
          <div className="relative z-10 flex-1 overflow-y-auto p-5">
            {/* Título do modal */}
            <div className="text-center mb-4 pt-2">
              <p className="text-amber-200/80 text-[10px] font-black uppercase tracking-widest">Vitória conquistada</p>
              <h2 className="text-white font-black text-2xl uppercase italic tracking-tighter drop-shadow">
                🛒 Shop — Andar {run.floor}
              </h2>
              {isBossFloor && <p className="text-purple-400 text-xs font-bold mt-1">⭐ Andar Boss derrubado!</p>}
            </div>

            {/* Saldo */}
            <div className="flex gap-2 mb-4 justify-center flex-wrap">
              {[
                { label: '🪙 Moedas', val: inv.coins ?? 0, cls: 'text-yellow-400' },
                { label: '🧪 Poções', val: inv.potions ?? 0, cls: 'text-blue-400' },
                { label: '💊 Revives', val: inv.revives ?? 0, cls: 'text-red-400' },
              ].map(({ label, val, cls }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/55 rounded-xl border border-white/[0.12] backdrop-blur-md shadow-lg">
                  <span className="text-white/50 text-[9px] font-black uppercase">{label}:</span>
                  <span className={`font-black text-sm ${cls}`}>{val}</span>
                </div>
              ))}
            </div>

            {(run.lastXpSummary || []).length > 0 && (
              <div className="mb-4 rounded-2xl border border-cyan-300/20 bg-cyan-950/35 p-3 backdrop-blur-md">
                <p className="text-cyan-200 text-[9px] font-black uppercase tracking-widest mb-2">Progressão da equipe</p>
                <div className="flex flex-col gap-1.5">
                  {run.lastXpSummary.slice(0, 6).map((entry, idx) => (
                    <div key={`${entry.id}-${idx}`} className="flex items-center justify-between gap-2 text-[10px] font-bold">
                      <span className="text-white/75 truncate">
                        {entry.name}
                        {entry.levelsGained > 0 && (
                          <span className="ml-1 text-green-300">Nv {entry.startLevel} → {entry.level}</span>
                        )}
                      </span>
                      <span className="text-cyan-200 shrink-0">+{entry.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(run.team || []).some(p => p.needsMoveSelection) && (
              <div className="mb-4 rounded-2xl border border-amber-300/25 bg-amber-950/35 p-3 backdrop-blur-md">
                <p className="text-amber-200 text-[10px] font-black uppercase tracking-widest">Novos golpes disponíveis</p>
                <p className="text-white/50 text-[10px] mt-1">Ajuste os golpes antes de continuar a escalada.</p>
              </div>
            )}

            {/* Itens do shop */}
            <div className="flex flex-col gap-3">
              {(run.shop || []).map((offer, idx) => {
                const isRecruit = offer.type === 'recruit';
                const isTeamFull = isRecruit && (run.team || []).length >= 6;
                const isReviveBoon = offer.type === 'boon' && offer.boon?.id === 'revive_one';
                const hasFainted = (run.team || []).some(p => (p.currentHp ?? p.hp ?? 1) <= 0);
                const canAfford = (inv.coins ?? 0) >= offer.cost
                  && !isTeamFull
                  && !(isReviveBoon && !hasFainted);

                // Recruit com seleção de moves abre a tela de seleção
                const handleBuy = () => {
                  if (!canAfford) return;
                  if (isRecruit && offer.pokemon?.needsMoveSelection) {
                    // Debita moedas primeiro
                    setGameState(prev => {
                      const prevRun = prev.tower?.activeRun;
                      if (!prevRun) return prev;
                      const newInv = { ...prevRun.inventory, coins: (prevRun.inventory.coins ?? 0) - offer.cost };
                      const newShop = (prevRun.shop || []).filter((_, i) => i !== idx);
                      return { ...prev, tower: { ...prev.tower, activeRun: { ...prevRun, inventory: newInv, shop: newShop } } };
                    });
                    handleRecruitWithMoves(offer.pokemon);
                    return;
                  }

                  setGameState(prev => {
                    const prevRun = prev.tower?.activeRun;
                    if (!prevRun) return prev;
                    const newInv = { ...prevRun.inventory, coins: (prevRun.inventory.coins ?? 0) - offer.cost };
                    const newRun2 = { ...prevRun, inventory: newInv, team: [...prevRun.team] };

                    if (offer.type === 'item') {
                      newInv[offer.id] = (newInv[offer.id] || 0) + 1;
                    } else if (offer.type === 'boon') {
                      if (offer.boon?.id === 'revive_one') {
                        const fIdx = newRun2.team.findIndex(p => (p.currentHp ?? p.hp ?? 1) <= 0);
                        if (fIdx !== -1) {
                          const rev = { ...newRun2.team[fIdx] };
                          const half = Math.ceil(rev.maxHp * 0.5);
                          rev.currentHp = half; rev.hp = half;
                          newRun2.team[fIdx] = rev;
                        }
                      } else {
                        newRun2.boons = [...(newRun2.boons || []), offer.boon];
                      }
                    } else if (offer.type === 'recruit') {
                      newRun2.team.push(offer.pokemon);
                    }

                    newRun2.shop = (newRun2.shop || []).filter((_, i) => i !== idx);
                    return { ...prev, tower: { ...prev.tower, activeRun: newRun2 } };
                  });
                };

                return (
                  <button
                    key={idx}
                    onClick={handleBuy}
                    disabled={!canAfford}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all backdrop-blur-md shadow-xl shadow-black/20 ${
                      canAfford
                        ? 'bg-slate-950/[0.66] border-white/20 hover:bg-slate-900/[0.82] hover:scale-[1.01] active:scale-[0.98]'
                        : 'bg-slate-950/[0.56] border-white/5 opacity-45 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-black text-sm uppercase truncate ${
                        offer.type === 'boon' ? 'text-amber-400'
                        : offer.type === 'recruit' ? 'text-blue-400'
                        : 'text-white'
                      }`}>
                        {offer.type === 'recruit' && (
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${offer.pokemon?.id}.png`}
                            className="w-8 h-8 inline-block -mt-1 mr-1"
                            alt=""
                          />
                        )}
                        {offer.name}
                        {isTeamFull && <span className="text-red-400 text-[9px] ml-1">(time cheio)</span>}
                      </h5>
                      {offer.desc && <p className="text-white/40 text-[10px] font-medium mt-0.5">{offer.desc}</p>}
                    </div>
                    <div className="ml-3 shrink-0">
                      <span className={`font-black text-sm ${canAfford ? 'text-yellow-400' : 'text-white/30'}`}>
                        {offer.cost} 🪙
                      </span>
                    </div>
                  </button>
                );
              })}
              {(!run.shop || run.shop.length === 0) && (
                <p className="text-center text-white/30 text-[10px] font-black uppercase tracking-widest py-4">Loja esgotada</p>
              )}
            </div>
          </div>

          {/* Botão de fechar shop e lutar */}
          <div className="relative z-10 p-5 border-t border-white/10 bg-slate-950/82 backdrop-blur-md">
            <button
              onClick={() => setShowShopModal(false)}
              className={`w-full py-5 rounded-3xl font-black uppercase text-lg italic tracking-tighter shadow-xl border-b-4 hover:scale-[1.02] active:scale-95 transition-all ${
                isBossFloor
                  ? 'bg-purple-600 border-purple-900 text-white shadow-purple-900/40'
                  : 'bg-white text-slate-900 border-slate-300 shadow-slate-900/20'
              }`}
            >
              Voltar à Torre → Andar {run.floor}
            </button>
          </div>
        </div>
      )}

      {/* ── Tela de Run principal (por baixo do modal) ─────────────────────── */}
      <div className="relative z-10 h-full flex flex-col p-5 overflow-y-auto">
        {/* Header */}
        <div className={`${GLASS_PANEL} rounded-3xl p-4 mb-4 flex justify-between items-center`}>
          <div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Progresso da Torre</p>
            <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none">
              {isBossFloor
                ? <span className="text-purple-400">⭐ Boss — Andar {run.floor}</span>
                : `Andar ${run.floor}`}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-yellow-400 font-black text-sm">
              <span>{inv.coins ?? 0}</span><span>🪙</span>
            </div>
            <button
              onClick={handleEndRun}
              className="text-red-400 text-[9px] uppercase font-black px-3 py-1.5 border border-red-500/30 rounded-xl hover:bg-red-500/20"
            >
              Desistir
            </button>
          </div>
        </div>

        {/* Time da Torre */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {(run.team || []).map((poke, i) => {
            const data = POKEDEX[poke.id];
            if (!data) return null;
            const hpPct = Math.max(0, ((poke.currentHp ?? poke.hp ?? poke.maxHp) / poke.maxHp) * 100);
            const xpNeeded = towerXpNeeded(poke.level);
            const xpPct = Math.max(0, Math.min(100, ((poke.exp || 0) / xpNeeded) * 100));
            const isFainted = hpPct === 0;
            return (
              <div key={i} className={`${GLASS_PANEL} rounded-2xl p-3 flex flex-col ${isFainted ? 'opacity-40 grayscale' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`}
                    className="w-10 h-10 object-contain drop-shadow-md"
                    alt={data.name}
                  />
                  <span className="text-white/40 font-black text-[9px] uppercase">Nv {poke.level}</span>
                </div>
                <h4 className="text-white font-black text-xs uppercase truncate mb-1">{data.name}</h4>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${hpPct > 50 ? 'bg-green-500' : hpPct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${hpPct}%` }}
                  />
                </div>
                <p className="text-[8px] font-bold text-white/50 text-right mt-1">
                  {Math.ceil(poke.currentHp ?? poke.hp ?? poke.maxHp)}/{poke.maxHp} HP
                </p>
                <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${xpPct}%` }} />
                </div>
                <p className="text-[8px] font-bold text-cyan-200/70 text-right mt-1">
                  {poke.exp || 0}/{xpNeeded} XP
                </p>
                {poke.needsMoveSelection && (
                  <button
                    onClick={() => handleEditTowerMoves(i)}
                    className="mt-2 w-full rounded-lg border border-amber-300/30 bg-amber-400/15 py-1.5 text-[8px] font-black uppercase tracking-widest text-amber-100 hover:bg-amber-400/25"
                  >
                    Ajustar golpes
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Boons ativos */}
        {(run.boons || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {run.boons.map((b, i) => (
              <span key={i} className="text-[9px] font-black px-2 py-1 bg-amber-900/30 border border-amber-600/30 text-amber-400 rounded-lg uppercase">
                ✨ {b.name}
              </span>
            ))}
          </div>
        )}

        {/* Botão de shop (abrir novamente) */}
        {(run.shop || []).length > 0 && !showShopModal && (
          <button
            onClick={() => setShowShopModal(true)}
            className="w-full mb-4 py-3 rounded-2xl font-black uppercase text-sm tracking-widest bg-amber-400/[0.16] border border-amber-300/[0.24] text-amber-100 hover:bg-amber-400/[0.24] hover:text-white transition-all backdrop-blur-md"
          >
            🛒 Ver Shop ({run.shop.length} {run.shop.length === 1 ? 'item' : 'itens'})
          </button>
        )}

        {/* Botão de batalha */}
        <div className="mt-auto">
          <button
            onClick={handleBattle}
            className={`w-full py-5 rounded-3xl font-black uppercase text-lg italic tracking-tighter shadow-xl border-b-8 hover:scale-[1.02] active:scale-95 transition-all ${
              isBossFloor
                ? 'bg-purple-600 border-purple-900 text-white shadow-purple-900/40'
                : 'bg-white text-slate-900 border-slate-300 shadow-slate-900/20'
            }`}
          >
            {isBossFloor ? '⭐ Desafiar Boss' : '⚔️ Próximo Andar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleTowerScreen;

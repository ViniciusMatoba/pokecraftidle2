import React, { useState, useEffect } from 'react';
import { getTowerStarters, startTowerRun, generateTowerEncounter, generateFloorShop, getRandomBoons, resumeTowerRun } from '../utils/towerLogic';
import { TYPE_COLOR_HEX } from '../data/gyms';
import { POKEDEX } from '../data/pokedex';

const BattleTowerScreen = ({ gameState, setGameState, setCurrentView, setCurrentEnemy, onOpenTowerCombat }) => {
  const tower = gameState.tower || { activeRun: null, highestFloor: 0, bp: 0, upgrades: {} };

  const [phase, setPhase] = useState(tower.activeRun ? 'run' : 'lobby');
  const [draftOptions, setDraftOptions] = useState([]);

  // BUG-FIX: useEffect DEVE ficar antes de qualquer return condicional.
  // React exige que hooks sejam chamados na mesma ordem a cada render —
  // colocá-lo depois de um early return viola as Rules of Hooks e causa crash.
  const run = tower.activeRun;
  useEffect(() => {
    if (!run?.shopPending) return;
    setGameState(prev => {
      if (!prev.tower?.activeRun?.shopPending) return prev;
      const newRun = {
        ...prev.tower.activeRun,
        shopPending: false,
        shop: generateFloorShop(prev.tower.activeRun.floor),
      };
      return { ...prev, tower: { ...prev.tower, activeRun: newRun } };
    });
  }, [run?.shopPending, setGameState]);

  const handleStartDraft = () => {
    setDraftOptions(getTowerStarters());
    setPhase('draft');
  };

  const handleSelectDraft = (pokemonInfo) => {
    const newRun = startTowerRun(pokemonInfo);
    setGameState(prev => ({
      ...prev,
      team: newRun.team,
      currentRoute: 'tower',
      tower: {
        ...prev.tower,
        activeRun: newRun,
        realTeam: prev.team,
        realInventory: prev.inventory,
      },
    }));
    setPhase('run');
  };

  const handleEndRun = () => {
    const gainedBp = tower.activeRun ? tower.activeRun.floor * 10 : 0;
    const highest = Math.max(tower.highestFloor, tower.activeRun?.floor || 0);
    setGameState(prev => ({
      ...prev,
      team: prev.tower.realTeam || prev.team,
      inventory: prev.tower.realInventory || prev.inventory,
      currentRoute: 'pallet_town',
      tower: {
        ...prev.tower,
        bp: (prev.tower.bp || 0) + gainedBp,
        highestFloor: highest,
        activeRun: null,
        realTeam: null,
        realInventory: null,
      },
    }));
    setPhase('lobby');
  };

  const handleBattle = () => {
    const encounter = generateTowerEncounter(tower.activeRun.floor);
    setCurrentEnemy(encounter);
    onOpenTowerCombat(encounter);
  };

  // ── Lobby ──────────────────────────────────────────────────────────────
  if (phase === 'lobby') {
    return (
      <div className="h-full flex flex-col bg-slate-950 animate-fadeIn p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-white font-black text-2xl uppercase italic tracking-tighter">🗼 Battle Tower</h2>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">Endgame Roguelike</p>
          </div>
          <button onClick={() => setCurrentView('city')} className="text-white/40 hover:text-white font-black text-lg w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 border-2 border-red-500/30 rounded-3xl p-6 text-center">
            <h3 className="text-red-400 font-black uppercase tracking-widest text-[10px] mb-2">Recorde de Escalada</h3>
            <div className="text-5xl font-black text-white italic drop-shadow-md">Andar {tower.highestFloor}</div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-white/70 font-bold text-sm uppercase tracking-widest">Battle Points (BP)</p>
              <p className="text-yellow-400 font-black text-xl">{(tower.bp || 0).toLocaleString()} BP</p>
            </div>
            <button className="w-full bg-white/5 border border-white/10 text-white/50 py-3 rounded-xl font-bold uppercase text-xs hover:bg-white/10 transition-colors">
              Abrir Loja BP (Em Breve)
            </button>
          </div>

          {tower.checkpoint ? (
            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={() => {
                  const resumed = resumeTowerRun(tower.checkpoint);
                  setGameState(prev => ({
                    ...prev,
                    team: resumed.team,
                    currentRoute: 'tower',
                    tower: { ...prev.tower, activeRun: resumed, realTeam: prev.team, realInventory: prev.inventory },
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

  // ── Draft ──────────────────────────────────────────────────────────────
  if (phase === 'draft') {
    return (
      <div className="h-full flex flex-col bg-slate-950 p-6 animate-fadeIn">
        <h2 className="text-center text-white font-black uppercase italic tracking-tighter text-2xl mb-2 mt-4">Escolha seu Inicial</h2>
        <p className="text-center text-white/50 text-[10px] uppercase tracking-widest mb-8">Todos começam no Nível 5</p>

        <div className="flex flex-col gap-4">
          {draftOptions.map((poke, i) => {
            const data = POKEDEX[poke.id];
            if (!data) return null;
            const col = TYPE_COLOR_HEX[data.types?.[0]] || '#555';
            return (
              <button
                key={i}
                onClick={() => handleSelectDraft(poke)}
                className="bg-slate-900 border-2 border-white/10 rounded-3xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform text-left group overflow-hidden relative"
              >
                <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(90deg, ${col}, transparent)` }} />
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`}
                  className="w-16 h-16 drop-shadow-lg z-10"
                  alt={data.name}
                />
                <div className="flex-1 z-10">
                  <h3 className="text-white font-black text-lg uppercase italic">{data.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {(data.types || []).map(t => (
                      <span key={t} className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">{t}</span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Run ────────────────────────────────────────────────────────────────
  if (!run) return null;

  const isBossFloor = run.floor % 10 === 0;
  // BUG-FIX: inventário agora é plano {coins, potions, revives}.
  // startTowerRun retornava {coins, items:{potions,revives}} que incompatibilizava
  // com os acessos diretos run.inventory.potions e a escrita newInv[offer.id].
  const inv = run.inventory || { coins: 0, potions: 0, revives: 0 };

  return (
    <div className="h-full flex flex-col bg-slate-950 p-6 animate-fadeIn overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Progresso da Torre</p>
          <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter">
            {isBossFloor ? <span className="text-red-500">Boss Floor {run.floor}</span> : `Andar ${run.floor}`}
          </h2>
        </div>
        <button onClick={handleEndRun} className="text-red-400 text-[10px] uppercase font-black px-3 py-2 border border-red-500/30 rounded-xl hover:bg-red-500/20">
          Desistir
        </button>
      </div>

      {/* Time */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(run.team || []).map((poke, i) => {
          const data = POKEDEX[poke.id];
          if (!data) return null;
          const hpPct = Math.max(0, ((poke.currentHp ?? poke.hp ?? poke.maxHp) / poke.maxHp) * 100);
          const isFainted = hpPct === 0;
          return (
            <div key={i} className={`bg-slate-900 border border-white/10 rounded-2xl p-3 flex flex-col ${isFainted ? 'opacity-50 grayscale' : ''}`}>
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
                {Math.ceil(poke.currentHp ?? poke.hp ?? poke.maxHp)}/{poke.maxHp}
              </p>
            </div>
          );
        })}
      </div>

      {/* Shop */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-4 mb-4">
        <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-3">Shop da Torre</p>

        <div className="flex gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
            <span className="text-[10px] font-black uppercase text-white/50">Moedas:</span>
            <span className="text-yellow-400 font-black text-xs">{inv.coins ?? 0}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
            <span className="text-[10px] font-black uppercase text-white/50">Poções:</span>
            <span className="text-white font-black text-xs">{inv.potions ?? 0}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
            <span className="text-[10px] font-black uppercase text-white/50">Revives:</span>
            <span className="text-white font-black text-xs">{inv.revives ?? 0}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {(run.shop || []).map((offer, idx) => {
            const isRecruit = offer.type === 'recruit';
            const isTeamFull = isRecruit && (run.team || []).length >= 6;
            const isReviveBoon = offer.type === 'boon' && offer.boon?.id === 'revive_one';
            const hasFainted = (run.team || []).some(p => (p.hp <= 0 || (p.currentHp ?? p.hp) <= 0));
            const canAfford = (inv.coins ?? 0) >= offer.cost && !isTeamFull && !(isReviveBoon && !hasFainted);

            return (
              <button
                key={idx}
                onClick={() => {
                  if (!canAfford) return;
                  setGameState(prev => {
                    const prevRun = prev.tower?.activeRun;
                    if (!prevRun) return prev;
                    const newInv = { ...prevRun.inventory, coins: (prevRun.inventory.coins ?? 0) - offer.cost };
                    const newTowerRun = { ...prevRun, inventory: newInv, team: [...prevRun.team] };

                    if (offer.type === 'item') {
                      // BUG-FIX: escrita direta no inventário plano
                      newInv[offer.id] = (newInv[offer.id] || 0) + 1;
                    } else if (offer.type === 'boon') {
                      if (offer.boon?.id === 'revive_one') {
                        const faintedIdx = newTowerRun.team.findIndex(p => (p.hp ?? 0) <= 0 || (p.currentHp ?? 0) <= 0);
                        if (faintedIdx !== -1) {
                          const revived = { ...newTowerRun.team[faintedIdx] };
                          const halfHp = Math.ceil(revived.maxHp * 0.5);
                          revived.hp = halfHp;
                          revived.currentHp = halfHp;
                          newTowerRun.team[faintedIdx] = revived;
                        }
                      } else {
                        newTowerRun.boons = [...(newTowerRun.boons || []), offer.boon];
                      }
                    } else if (offer.type === 'recruit') {
                      newTowerRun.team.push(offer.pokemon);
                    }

                    newTowerRun.shop = (newTowerRun.shop || []).filter((_, i) => i !== idx);
                    return { ...prev, tower: { ...prev.tower, activeRun: newTowerRun }, team: newTowerRun.team };
                  });
                }}
                disabled={!canAfford}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  canAfford
                    ? 'bg-slate-800 border-white/20 hover:bg-slate-700 hover:scale-[1.01] active:scale-[0.98]'
                    : 'bg-slate-900 border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <h5 className={`font-black text-xs uppercase ${
                    offer.type === 'boon' ? 'text-amber-400' : offer.type === 'recruit' ? 'text-blue-400' : 'text-white'
                  }`}>
                    {offer.name} {isTeamFull && <span className="text-red-500">(Time Cheio)</span>}
                  </h5>
                  {offer.desc && <p className="text-[9px] font-bold text-white/50 mt-0.5">{offer.desc}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="text-[10px] font-black text-yellow-500">{offer.cost} 🪙</span>
                </div>
              </button>
            );
          })}
          {(!run.shop || run.shop.length === 0) && (
            <div className="text-center py-4 text-white/30 text-[10px] font-black uppercase tracking-widest">Loja Esgotada</div>
          )}
        </div>
      </div>

      <button
        onClick={handleBattle}
        className={`w-full py-5 rounded-3xl font-black uppercase text-lg italic tracking-tighter shadow-xl border-b-8 hover:scale-[1.02] active:scale-95 transition-all ${
          isBossFloor
            ? 'bg-purple-600 border-purple-800 text-white shadow-purple-900/40'
            : 'bg-white text-slate-900 border-slate-300 shadow-slate-900/20'
        }`}
      >
        {isBossFloor ? '⚔️ Desafiar Chefe' : '⚔️ Próximo Andar'}
      </button>
    </div>
  );
};

export default BattleTowerScreen;

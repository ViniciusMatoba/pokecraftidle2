/**
 * RegionChallengeScreen.jsx — Desafio de Região de Amigo
 *
 * Exibe a região do amigo e permite desafiar cada ginásio,
 * Elite Four e Campeão em sequência.
 *
 * Simulação de batalha: comparação de power score da equipe do jogador
 * vs. stats totais dos inimigos — com fator de aleatoriedade (±20%).
 */
import React, { useState, useMemo } from 'react';
import { buildRegionBattleOrder } from '../utils/regionBattle';
import { REGION_GYM_TYPES } from '../data/myRegion';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

/** Calcula power score da equipe do jogador */
const calcTeamPower = (team = []) => {
  return team.reduce((sum, p) => {
    if (!p) return sum;
    const atk  = p.attack      || p.baseAttack  || 45;
    const def  = p.defense     || p.baseDefense || 45;
    const spa  = p.spAttack    || p.baseSpAtk   || 45;
    const spd  = p.spDefense   || p.baseSpDef   || 45;
    const spe  = p.speed       || p.baseSpeed   || 45;
    const hp   = p.maxHP       || p.currentHP   || 100;
    const lvl  = p.level       || 1;
    return sum + (atk + def + spa + spd + spe + hp * 0.5) * (lvl / 50);
  }, 0);
};

/** Calcula power score dos inimigos */
const calcEnemyPower = (team = []) => {
  return team.reduce((sum, p) => {
    if (!p) return sum;
    return sum + (p.attack + p.defense + p.spAttack + p.spDefense + p.speed + p.maxHP * 0.5);
  }, 0);
};

/** Simula o resultado de uma batalha com fator aleatório */
const simulateBattle = (playerTeam, enemyTeam) => {
  const playerPow = calcTeamPower(playerTeam);
  const enemyPow  = calcEnemyPower(enemyTeam);
  // Fator aleatório: 80% a 120%
  const rng = 0.8 + Math.random() * 0.4;
  const effectivePlayerPow = playerPow * rng;
  return {
    won:         effectivePlayerPow >= enemyPow,
    playerPow:   Math.round(effectivePlayerPow),
    enemyPow:    Math.round(enemyPow),
    margin:      Math.round(((effectivePlayerPow / enemyPow) - 1) * 100),
  };
};

/** Calcula recompensas da batalha */
const calcRewards = (battle) => {
  const base = battle.type === 'champion' ? 500 :
               battle.type === 'elite'    ? 300 :
               100 + battle.index * 50;
  return { coins: base, xp: Math.floor(base * 0.5) };
};

/* ─── Type badge ──────────────────────────────────────────────────────────── */
const TypeBadge = ({ gymType }) => {
  const info = REGION_GYM_TYPES[gymType] || REGION_GYM_TYPES.normal;
  return (
    <span
      className="text-[9px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-wider"
      style={{ background: info.color }}
    >
      {info.name}
    </span>
  );
};

/* ─── Leader card ─────────────────────────────────────────────────────────── */
const LeaderCard = ({ battle, status, isCurrent, onChallenge, isSimulating }) => {
  const typeInfo = REGION_GYM_TYPES[battle.gymType] || REGION_GYM_TYPES.normal;
  const bgColor  = status === 'won'  ? '#dcfce7' :
                   status === 'lost' ? '#fee2e2' :
                   isCurrent         ? '#fefce8' : '#f8fafc';
  const bdColor  = status === 'won'  ? '#16a34a' :
                   status === 'lost' ? '#dc2626' :
                   isCurrent         ? '#ca8a04' : '#e2e8f0';

  const label = battle.type === 'gym'      ? `Ginásio ${battle.index + 1}` :
                battle.type === 'elite'    ? `Elite ${battle.index + 1}`   : 'Campeão';

  const icon = battle.type === 'champion' ? '👑' :
               battle.type === 'elite'    ? '🌟' : '🏟️';

  return (
    <div
      className="rounded-2xl border-2 p-3 transition-all"
      style={{ background: bgColor, borderColor: bdColor }}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
          style={{ background: typeInfo.color + '22', border: `2px solid ${typeInfo.color}` }}
        >
          {status === 'won'  ? '✅' :
           status === 'lost' ? '❌' :
           icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <p className="font-black text-slate-800 text-sm truncate">{battle.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <TypeBadge gymType={battle.gymType} />
            <span className="text-[9px] text-slate-500 font-bold">Nv. {battle.level}</span>
            <span className="text-[9px] text-slate-500">· {battle.team.length} Pokémon</span>
          </div>
        </div>

        {/* Action */}
        {isCurrent && (
          <button
            onClick={onChallenge}
            disabled={isSimulating}
            className={`shrink-0 font-black text-[11px] px-3 py-2 rounded-xl text-white transition-all active:scale-95
              ${isSimulating ? 'bg-amber-400 cursor-wait' : 'bg-amber-500 hover:bg-amber-600 shadow-md'}`}
          >
            {isSimulating ? '⚔️...' : '⚔️ Lutar'}
          </button>
        )}
        {status === 'won' && (
          <span className="shrink-0 text-green-600 font-black text-[11px]">Vencido!</span>
        )}
        {status === 'lost' && (
          <span className="shrink-0 text-red-600 font-black text-[11px]">Derrota</span>
        )}
      </div>

      {/* Pokémon sprites */}
      <div className="flex gap-1 mt-2 flex-wrap">
        {battle.team.map((poke, i) => (
          <img
            key={i}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`}
            alt={poke.name}
            title={`${poke.name} Nv.${poke.level}`}
            className="w-9 h-9 object-contain"
            style={{ imageRendering: 'pixelated', opacity: status === 'lost' ? 0.4 : 1 }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ))}
      </div>
    </div>
  );
};

/* ─── Battle Result popup ─────────────────────────────────────────────────── */
const BattleResultPopup = ({ result, battle, rewards, onContinue }) => (
  <div className="fixed inset-0 z-[120000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-xs text-center animate-bounceIn">
      <div className="text-5xl mb-3">{result.won ? '🎉' : '😵'}</div>
      <h3 className="text-2xl font-black uppercase italic text-slate-800 mb-1">
        {result.won ? 'Vitória!' : 'Derrota!'}
      </h3>
      <p className="text-slate-500 text-sm font-bold mb-4">
        {result.won
          ? `Você derrotou ${battle.name}!`
          : `${battle.name} foi forte demais...`}
      </p>

      {/* Power comparison */}
      <div className="bg-slate-50 rounded-2xl p-3 mb-4 text-left space-y-2">
        <div className="flex justify-between text-xs font-black">
          <span className="text-blue-600">Seu Poder</span>
          <span className="text-blue-700">{result.playerPow.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs font-black">
          <span className="text-red-600">Poder Inimigo</span>
          <span className="text-red-700">{result.enemyPow.toLocaleString()}</span>
        </div>
        {result.won && (
          <div className="flex justify-between text-xs font-black text-green-700 border-t border-slate-200 pt-2">
            <span>Margem</span>
            <span>+{result.margin}%</span>
          </div>
        )}
      </div>

      {/* Rewards */}
      {result.won && (
        <div className="flex justify-center gap-4 mb-4">
          <div className="text-center">
            <p className="text-yellow-500 font-black text-lg">+{rewards.coins}</p>
            <p className="text-[10px] text-slate-400 font-black uppercase">Pokécoins</p>
          </div>
          <div className="text-center">
            <p className="text-blue-500 font-black text-lg">+{rewards.xp}</p>
            <p className="text-[10px] text-slate-400 font-black uppercase">EXP</p>
          </div>
        </div>
      )}

      <button
        onClick={onContinue}
        className={`w-full py-3 rounded-2xl font-black text-white text-sm uppercase tracking-widest
          ${result.won ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
      >
        {result.won ? 'Continuar ▶' : 'Tentar Novamente'}
      </button>
    </div>
  </div>
);

/* ─── Tela de Conclusão ───────────────────────────────────────────────────── */
const CompletionScreen = ({ ownerProfile, _battles, totalRewards, onClose }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-6">
    <div className="text-6xl animate-bounce">🏆</div>
    <div>
      <h2 className="text-3xl font-black uppercase italic text-yellow-400 drop-shadow">Campeão!</h2>
      <p className="text-white/80 font-bold mt-2">
        Você conquistou a região de <span className="text-yellow-300 font-black">{ownerProfile?.name || 'Treinador'}</span>!
      </p>
    </div>

    {/* Resumo */}
    <div className="bg-white/10 rounded-2xl p-4 w-full max-w-xs">
      <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-3">Recompensas Totais</p>
      <div className="flex justify-center gap-8">
        <div>
          <p className="text-yellow-400 font-black text-2xl">+{totalRewards.coins}</p>
          <p className="text-[10px] text-white/60 font-black uppercase">PokéCoins</p>
        </div>
        <div>
          <p className="text-blue-300 font-black text-2xl">+{totalRewards.xp}</p>
          <p className="text-[10px] text-white/60 font-black uppercase">EXP</p>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-3 w-full max-w-xs">
      <button
        onClick={onClose}
        className="bg-yellow-400 text-slate-900 font-black py-4 rounded-2xl text-sm uppercase tracking-widest hover:bg-yellow-300 active:scale-95 transition-all shadow-lg"
      >
        🏠 Voltar ao Jogo
      </button>
    </div>
  </div>
);

/* ─── Componente principal ───────────────────────────────────────────────── */
const RegionChallengeScreen = ({
  region,
  ownerProfile,
  gameState,
  setGameState,
  POKEDEX,
  onClose,
}) => {
  const battles = useMemo(() => buildRegionBattleOrder(region, POKEDEX), [region, POKEDEX]);

  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [results,       setResults]       = useState([]); // array de 'won'|'lost' por índice
  const [popupResult,   setPopupResult]   = useState(null); // { result, battle, rewards }
  const [isSimulating,  setIsSimulating]  = useState(false);
  const [totalRewards,  setTotalRewards]  = useState({ coins: 0, xp: 0 });
  const [completed,     setCompleted]     = useState(false);

  // Se não houver batalhas, mostrar aviso
  const noBattles = battles.length === 0;

  const handleChallenge = () => {
    if (currentIndex >= battles.length) return;
    setIsSimulating(true);

    // Simula com delay para dar feedback visual
    setTimeout(() => {
      const battle  = battles[currentIndex];
      const result  = simulateBattle(gameState.team || [], battle.team);
      const rewards = calcRewards(battle);

      setIsSimulating(false);
      setPopupResult({ result, battle, rewards });
    }, 800);
  };

  const handleContinue = () => {
    const { result, _battle, rewards } = popupResult;
    const newResults = [...results];
    newResults[currentIndex] = result.won ? 'won' : 'lost';
    setResults(newResults);
    setPopupResult(null);

    if (result.won) {
      // Aplicar recompensas ao jogador
      setGameState(prev => ({
        ...prev,
        coins:        (prev.coins || 0) + rewards.coins,
        totalExp:     (prev.totalExp || 0) + rewards.xp,
      }));
      setTotalRewards(prev => ({
        coins: prev.coins + rewards.coins,
        xp:    prev.xp    + rewards.xp,
      }));

      const nextIndex = currentIndex + 1;
      if (nextIndex >= battles.length) {
        setCompleted(true);
      } else {
        setCurrentIndex(nextIndex);
      }
    }
    // Se perdeu: fica no mesmo índice, o jogador pode tentar novamente
  };

  const statusOf = (i) => results[i] ?? null;

  // Header gradient baseado no tipo do líder atual
  const currentBattle = battles[currentIndex];
  const currentTypeInfo = currentBattle
    ? (REGION_GYM_TYPES[currentBattle.gymType] || REGION_GYM_TYPES.normal)
    : { color: '#6366f1' };

  return (
    <div
      className="fixed inset-0 z-[110000] flex flex-col"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}
    >
      {/* Header */}
      <div
        className="shrink-0 px-4 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${currentTypeInfo.color}cc, #0f172a)` }}
      >
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-black hover:bg-white/20 active:scale-95 transition-all shrink-0"
        >
          ✕
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">
            Desafio de Região
          </p>
          <h2 className="text-white font-black text-lg italic uppercase truncate">
            {region?.regionName || 'Região'} de {ownerProfile?.name || 'Treinador'}
          </h2>
        </div>
        {/* Progresso */}
        <div className="shrink-0 text-right">
          <p className="text-white font-black text-lg">{results.filter(r => r === 'won').length}/{battles.length}</p>
          <p className="text-white/50 text-[9px] uppercase font-black">Vencidas</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/10">
        <div
          className="h-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${battles.length > 0 ? (results.filter(r => r === 'won').length / battles.length) * 100 : 0}%` }}
        />
      </div>

      {/* Body */}
      {completed ? (
        <CompletionScreen
          ownerProfile={ownerProfile}
          battles={battles}
          totalRewards={totalRewards}
          onClose={onClose}
        />
      ) : noBattles ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-4">
          <div className="text-5xl">🚧</div>
          <p className="text-white font-black text-lg">Região sem batalhas</p>
          <p className="text-white/60 text-sm">
            Este treinador ainda não configurou os líderes de sua região.
          </p>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 text-white font-black py-3 px-8 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all"
          >
            Voltar
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
          {/* Dica de equipe */}
          <div className="bg-blue-900/40 border border-blue-700/50 rounded-2xl px-4 py-3 text-blue-200 text-xs font-bold flex items-start gap-2">
            <span className="text-base shrink-0">💡</span>
            <span>A batalha é calculada com base no poder da sua equipe vs. a do adversário, com fator aleatório de ±20%.</span>
          </div>

          {/* Lista de batalhas */}
          {battles.map((battle, i) => (
            <LeaderCard
              key={i}
              battle={battle}
              status={statusOf(i)}
              isCurrent={i === currentIndex && !completed}
              onChallenge={handleChallenge}
              isSimulating={isSimulating}
            />
          ))}
        </div>
      )}

      {/* Popup de resultado */}
      {popupResult && (
        <BattleResultPopup
          result={popupResult.result}
          battle={popupResult.battle}
          rewards={popupResult.rewards}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default RegionChallengeScreen;

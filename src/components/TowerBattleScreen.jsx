import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { POKEDEX } from '../data/pokedex';
import { MOVES } from '../data/moves';
import { getTypeEffectiveness } from '../data/typeChart';
import { BATTLE_BACKGROUNDS } from '../data/battleBackgrounds';
import { applyTowerExperience, calculateTowerXpReward } from '../utils/towerLogic';
import { getPokemonSpriteFallbackUrl, getPokemonSpriteUrl } from '../utils/pokemonSprites';

// ── Helpers fora do componente ────────────────────────────────────────────────

const applyStage = (base, stage) => {
  if (!stage) return base;
  return stage >= 0
    ? Math.floor(base * (2 + stage) / 2)
    : Math.floor(base * 2 / (2 - stage));
};

// Fórmula Gen V
const calcDamage = (attacker, moveKey, defender) => {
  const move = MOVES[moveKey];
  if (!move || !move.power || move.category === 'Status') return 0;

  const level = attacker.level || 5;
  const isPhysical = move.category === 'Physical';

  let atkStat = isPhysical
    ? applyStage(attacker.attack || 50, attacker.stages?.attack || 0)
    : applyStage(attacker.spAtk || 50, attacker.stages?.spAtk || 0);

  let defStat = isPhysical
    ? applyStage(defender.defense || 50, defender.stages?.defense || 0)
    : applyStage(defender.spDef || 50, defender.stages?.spDef || 0);

  if (isPhysical && attacker.status === 'burn') atkStat = Math.floor(atkStat / 2);
  if (defStat < 1) defStat = 1;

  let dmg = Math.floor(
    Math.floor(Math.floor(2 * level / 5 + 2) * move.power * atkStat / defStat / 50) + 2
  );

  // STAB
  if ((attacker.types || []).includes(move.type)) dmg = Math.floor(dmg * 1.5);

  // Efetividade de tipo
  const eff = getTypeEffectiveness(move.type, defender.types || ['Normal']);
  dmg = Math.floor(dmg * eff);

  // Roll aleatório (85–100%)
  dmg = Math.floor(dmg * ((85 + Math.floor(Math.random() * 16)) / 100));

  return Math.max(0, dmg);
};

const enemyPickMove = (enemy, target) => {
  const moves = (enemy.moves || ['tackle']).filter(k => MOVES[k]);
  if (moves.length === 0) return 'tackle';
  let best = moves[0];
  let bestScore = -1;
  for (const m of moves) {
    const move = MOVES[m];
    if (!move || move.category === 'Status') continue;
    const score = calcDamage(enemy, m, target);
    if (score > bestScore) { bestScore = score; best = m; }
  }
  return best;
};

// Constrói Pokémon inimigo completo a partir do POKEDEX
const buildEnemyPoke = (entry, level) => {
  const base = POKEDEX[entry.id];
  if (!base) return null;
  const maxHp = Math.floor(2 * (base.hp || 45) * level / 100) + level + 10;
  const moves = (base.learnset || [])
    .filter(m => m.level <= level)
    .map(m => m.move)
    .filter(Boolean)
    .slice(-4);
  return {
    id: base.id,
    name: base.name,
    level,
    types: base.types || [base.type || 'Normal'],
    attack: base.attack || 50,
    defense: base.defense || 50,
    spAtk: base.spAtk || 50,
    spDef: base.spDef || 50,
    speed: base.speed || 50,
    currentHp: maxHp,
    maxHp,
    moves: moves.length > 0 ? moves : ['tackle'],
    status: null,
    statusTurns: 0,
    stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
  };
};

// Constrói Pokémon do jogador para batalha
const buildPlayerBattlePoke = (runPoke) => {
  const base = POKEDEX[runPoke.id];
  let moves = runPoke.moves || [];
  if (moves.length === 0 && base) {
    moves = (base.learnset || [])
      .filter(m => m.level <= (runPoke.level || 5))
      .map(m => m.move)
      .filter(Boolean)
      .slice(-4);
  }
  if (moves.length === 0) moves = ['tackle'];
  return {
    id: runPoke.id,
    name: runPoke.name || base?.name || 'Pokémon',
    level: runPoke.level || 5,
    types: runPoke.types || base?.types || ['Normal'],
    attack: base?.attack || 50,
    defense: base?.defense || 50,
    spAtk: base?.spAtk || 50,
    spDef: base?.spDef || 50,
    speed: base?.speed || 50,
    currentHp: Math.max(0, runPoke.currentHp ?? runPoke.hp ?? runPoke.maxHp ?? 1),
    maxHp: runPoke.maxHp || 10,
    moves,
    status: null,
    statusTurns: 0,
    stages: { attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 },
  };
};

// Executa um ataque, mutando as cópias locais
const doAttack = (atkTeam, atkIdx, defTeam, defIdx, moveKey, isPlayer, logs) => {
  const attacker = atkTeam[atkIdx];
  const defender = defTeam[defIdx];
  if (!attacker || attacker.currentHp <= 0) return;
  if (!defender || defender.currentHp <= 0) return;

  const aName = isPlayer ? attacker.name : `Oponente ${attacker.name}`;
  const dName = isPlayer ? `Oponente ${defender.name}` : defender.name;

  // Status que impedem ataque
  if (attacker.status === 'paralysis' && Math.random() < 0.25) {
    logs.push(`⚡ ${aName} está paralisado e não pode se mover!`);
    return;
  }
  if (attacker.status === 'sleep') {
    const rem = (attacker.statusTurns || 1) - 1;
    atkTeam[atkIdx] = { ...attacker, statusTurns: rem };
    if (rem <= 0) {
      atkTeam[atkIdx].status = null;
      logs.push(`😴 ${aName} acordou!`);
      // Continua atacando após acordar (como nos jogos oficiais)
    } else {
      logs.push(`💤 ${aName} está dormindo...`);
      return;
    }
  }
  if (attacker.status === 'freeze') {
    if (Math.random() < 0.2) {
      atkTeam[atkIdx] = { ...attacker, status: null, statusTurns: 0 };
      logs.push(`❄️ ${aName} descongelou!`);
    } else {
      logs.push(`❄️ ${aName} está congelado e não pode se mover!`);
      return;
    }
  }

  const move = MOVES[moveKey];
  if (!move) return;

  logs.push(`🎯 ${aName} usou **${move.name}**!`);

  // Move de Status
  if (move.category === 'Status') {
    const e = (move.effect || '').toLowerCase();
    const two = e.includes('two');

    // Reduz stats do alvo
    if (e.includes("lowers the target's attack")) {
      const amt = two ? -2 : -1;
      defTeam[defIdx] = { ...defender, stages: { ...defender.stages, attack: Math.max(-6, (defender.stages.attack || 0) + amt) } };
      logs.push(`📉 ${dName} perdeu Ataque!`);
    } else if (e.includes("lowers the target's defense")) {
      const amt = two ? -2 : -1;
      defTeam[defIdx] = { ...defender, stages: { ...defender.stages, defense: Math.max(-6, (defender.stages.defense || 0) + amt) } };
      logs.push(`📉 ${dName} perdeu Defesa!`);
    } else if (e.includes("lowers the target's special attack")) {
      const amt = two ? -2 : -1;
      defTeam[defIdx] = { ...defender, stages: { ...defender.stages, spAtk: Math.max(-6, (defender.stages.spAtk || 0) + amt) } };
      logs.push(`📉 ${dName} perdeu Ataque Esp.!`);
    } else if (e.includes("lowers the target's speed")) {
      const amt = two ? -2 : -1;
      defTeam[defIdx] = { ...defender, stages: { ...defender.stages, speed: Math.max(-6, (defender.stages.speed || 0) + amt) } };
      logs.push(`📉 ${dName} perdeu Velocidade!`);
    }
    // Aumenta stats do usuário
    if (e.includes("raises the user's attack")) {
      const amt = two ? 2 : 1;
      atkTeam[atkIdx] = { ...atkTeam[atkIdx], stages: { ...atkTeam[atkIdx].stages, attack: Math.min(6, (atkTeam[atkIdx].stages.attack || 0) + amt) } };
      logs.push(`📈 ${aName} ganhou Ataque!`);
    } else if (e.includes("raises the user's defense")) {
      const amt = two ? 2 : 1;
      atkTeam[atkIdx] = { ...atkTeam[atkIdx], stages: { ...atkTeam[atkIdx].stages, defense: Math.min(6, (atkTeam[atkIdx].stages.defense || 0) + amt) } };
      logs.push(`📈 ${aName} ganhou Defesa!`);
    } else if (e.includes("raises the user's special attack")) {
      const amt = two ? 2 : 1;
      atkTeam[atkIdx] = { ...atkTeam[atkIdx], stages: { ...atkTeam[atkIdx].stages, spAtk: Math.min(6, (atkTeam[atkIdx].stages.spAtk || 0) + amt) } };
      logs.push(`📈 ${aName} ganhou Ataque Esp.!`);
    } else if (e.includes("raises the user's speed")) {
      const amt = two ? 2 : 1;
      atkTeam[atkIdx] = { ...atkTeam[atkIdx], stages: { ...atkTeam[atkIdx].stages, speed: Math.min(6, (atkTeam[atkIdx].stages.speed || 0) + amt) } };
      logs.push(`📈 ${aName} ganhou Velocidade!`);
    }

    // Aplica condição de status ao alvo
    const cur = defTeam[defIdx];
    const acc = (move.accuracy || 100) / 100;
    if (!cur.status && Math.random() < acc) {
      if ((e.includes('puts the target to sleep') || (e.includes('sleep') && !e.includes('chance')))) {
        defTeam[defIdx] = { ...cur, status: 'sleep', statusTurns: 2 + Math.floor(Math.random() * 2) };
        logs.push(`💤 ${dName} caiu no sono!`);
      } else if (e.includes('burn') && !e.includes('chance')) {
        defTeam[defIdx] = { ...cur, status: 'burn', statusTurns: 0 };
        logs.push(`🔥 ${dName} foi queimado!`);
      } else if (e.includes('poison') && !e.includes('chance')) {
        defTeam[defIdx] = { ...cur, status: 'poison', statusTurns: 0 };
        logs.push(`☠️ ${dName} foi envenenado!`);
      } else if ((e.includes('paralyze') || e.includes('paralysis')) && !e.includes('chance')) {
        defTeam[defIdx] = { ...cur, status: 'paralysis', statusTurns: 0 };
        logs.push(`⚡ ${dName} foi paralisado!`);
      } else if (e.includes('freeze') && !e.includes('chance')) {
        defTeam[defIdx] = { ...cur, status: 'freeze', statusTurns: 0 };
        logs.push(`❄️ ${dName} foi congelado!`);
      }
    }
    return;
  }

  // Move de Dano — verifica acurácia
  if (move.accuracy && Math.random() * 100 > move.accuracy) {
    logs.push(`💨 ${aName} errou!`);
    return;
  }

  const damage = calcDamage(atkTeam[atkIdx], moveKey, defTeam[defIdx]);
  const eff = getTypeEffectiveness(move.type, defTeam[defIdx].types || ['Normal']);

  if (eff === 0) {
    logs.push(`🚫 Não teve efeito em ${dName}...`);
    return;
  }

  const newHp = Math.max(0, defTeam[defIdx].currentHp - damage);
  defTeam[defIdx] = { ...defTeam[defIdx], currentHp: newHp };

  let effMsg = '';
  if (eff >= 2) effMsg = ' 🔥 Super efetivo!';
  else if (eff < 1) effMsg = ' 😓 Pouco efetivo...';
  logs.push(`💥 Causou ${damage} dano!${effMsg}`);

  // Efeito secundário de status em moves de dano
  const e = (move.effect || '').toLowerCase();
  const cur = defTeam[defIdx];
  if (!cur.status && newHp > 0 && e.includes('chance')) {
    const r = Math.random();
    if (e.includes('burn') && r < 0.3) {
      defTeam[defIdx] = { ...cur, status: 'burn', statusTurns: 0 };
      logs.push(`🔥 ${dName} foi queimado!`);
    } else if (e.includes('poison') && r < 0.3) {
      defTeam[defIdx] = { ...cur, status: 'poison', statusTurns: 0 };
      logs.push(`☠️ ${dName} foi envenenado!`);
    } else if ((e.includes('paralyze') || e.includes('paralysis')) && r < 0.3) {
      defTeam[defIdx] = { ...cur, status: 'paralysis', statusTurns: 0 };
      logs.push(`⚡ ${dName} foi paralisado!`);
    } else if (e.includes('freeze') && r < 0.1) {
      defTeam[defIdx] = { ...cur, status: 'freeze', statusTurns: 0 };
      logs.push(`❄️ ${dName} foi congelado!`);
    }
  }

  if (newHp <= 0) logs.push(`💀 ${dName} desmaiou!`);
};

const applyEndOfTurnDoT = (team, idx, isPlayer, logs) => {
  const poke = team[idx];
  if (!poke || poke.currentHp <= 0) return;
  const name = isPlayer ? poke.name : `Oponente ${poke.name}`;
  if (poke.status === 'burn') {
    const dmg = Math.max(1, Math.floor(poke.maxHp / 16));
    team[idx] = { ...poke, currentHp: Math.max(0, poke.currentHp - dmg) };
    logs.push(`🔥 ${name} sofreu ${dmg} dano (queimadura)!`);
    if (team[idx].currentHp <= 0) logs.push(`💀 ${name} desmaiou!`);
  } else if (poke.status === 'poison') {
    const dmg = Math.max(1, Math.floor(poke.maxHp / 8));
    team[idx] = { ...poke, currentHp: Math.max(0, poke.currentHp - dmg) };
    logs.push(`☠️ ${name} sofreu ${dmg} dano (veneno)!`);
    if (team[idx].currentHp <= 0) logs.push(`💀 ${name} desmaiou!`);
  }
};

// ── Constantes de UI ──────────────────────────────────────────────────────────

const TYPE_BTN_CLASS = {
  Fire:     'bg-red-600/20 border-red-500/40 text-red-400 hover:bg-red-600/40',
  Water:    'bg-blue-600/20 border-blue-500/40 text-blue-400 hover:bg-blue-600/40',
  Grass:    'bg-green-600/20 border-green-500/40 text-green-400 hover:bg-green-600/40',
  Electric: 'bg-yellow-500/20 border-yellow-400/40 text-yellow-400 hover:bg-yellow-500/40',
  Ice:      'bg-cyan-500/20 border-cyan-400/40 text-cyan-400 hover:bg-cyan-500/40',
  Fighting: 'bg-orange-600/20 border-orange-500/40 text-orange-400 hover:bg-orange-600/40',
  Poison:   'bg-purple-600/20 border-purple-500/40 text-purple-400 hover:bg-purple-600/40',
  Ground:   'bg-amber-700/20 border-amber-600/40 text-amber-500 hover:bg-amber-700/40',
  Flying:   'bg-indigo-500/20 border-indigo-400/40 text-indigo-400 hover:bg-indigo-500/40',
  Psychic:  'bg-pink-600/20 border-pink-500/40 text-pink-400 hover:bg-pink-600/40',
  Bug:      'bg-lime-600/20 border-lime-500/40 text-lime-500 hover:bg-lime-600/40',
  Rock:     'bg-stone-600/20 border-stone-500/40 text-stone-400 hover:bg-stone-600/40',
  Ghost:    'bg-violet-800/20 border-violet-700/40 text-violet-400 hover:bg-violet-800/40',
  Dragon:   'bg-violet-600/20 border-violet-500/40 text-violet-400 hover:bg-violet-600/40',
  Dark:     'bg-slate-700/20 border-slate-600/40 text-slate-300 hover:bg-slate-700/40',
  Steel:    'bg-slate-400/20 border-slate-300/40 text-slate-300 hover:bg-slate-400/40',
  Fairy:    'bg-pink-400/20 border-pink-300/40 text-pink-300 hover:bg-pink-400/40',
  Normal:   'bg-slate-600/20 border-slate-500/40 text-slate-300 hover:bg-slate-600/40',
};

const STATUS_BADGE = {
  burn:      { icon: '🔥', label: 'BURN',  cls: 'bg-red-900/50 text-red-400' },
  poison:    { icon: '☠️', label: 'PSN',   cls: 'bg-purple-900/50 text-purple-400' },
  paralysis: { icon: '⚡', label: 'PAR',   cls: 'bg-yellow-900/50 text-yellow-400' },
  sleep:     { icon: '💤', label: 'SLP',   cls: 'bg-blue-900/50 text-blue-400' },
  freeze:    { icon: '❄️', label: 'FRZ',   cls: 'bg-cyan-900/50 text-cyan-400' },
};

// ── Componente principal ──────────────────────────────────────────────────────

const TOWER_SPECIAL_BACKGROUNDS = [
  'hoenn_battle_frontier',
  'galar_victory_road',
  'league_sinnoh',
  'indigo_plateau',
];

const getTowerBattleBackground = (encounter, activeEnemy, floor = 1) => {
  const type = String(activeEnemy?.types?.[0] || 'normal').toLowerCase();
  if (encounter?.isBoss) {
    const index = Math.max(0, Math.floor((floor - 1) / 10)) % TOWER_SPECIAL_BACKGROUNDS.length;
    return BATTLE_BACKGROUNDS[TOWER_SPECIAL_BACKGROUNDS[index]] || BATTLE_BACKGROUNDS.paldea_type_domain_prism;
  }
  if (floor > 1 && floor % 5 === 0) {
    return BATTLE_BACKGROUNDS.hoenn_battle_frontier || BATTLE_BACKGROUNDS.paldea_type_domain_prism;
  }
  return BATTLE_BACKGROUNDS[`paldea_type_domain_${type}`]
    || BATTLE_BACKGROUNDS.hoenn_battle_frontier
    || BATTLE_BACKGROUNDS.paldea_type_domain_normal;
};

const TowerBattleScreen = ({ gameState, setGameState, setCurrentView }) => {
  const run = gameState.tower?.activeRun;
  const encounter = gameState.tower?.battleEncounter;

  // Inicializa times uma única vez
  const initPlayerTeam = useMemo(() => {
    if (!run?.team) return [];
    return run.team.map(p => buildPlayerBattlePoke(p));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initEnemyTeam = useMemo(() => {
    if (!encounter?.team) return [];
    return encounter.team
      .map(e => buildEnemyPoke(e, e.level || encounter.enemyLevel || 10))
      .filter(Boolean);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [playerTeam, setPlayerTeam] = useState(initPlayerTeam);
  const [enemyTeam, setEnemyTeam] = useState(initEnemyTeam);
  const [playerActive, setPlayerActive] = useState(
    () => Math.max(0, initPlayerTeam.findIndex(p => p.currentHp > 0))
  );
  const [enemyActive, setEnemyActive] = useState(0);
  const [phase, setPhase] = useState('select_move'); // select_move | switch_required | ended
  const [log, setLog] = useState(() => {
    const first = initEnemyTeam[0]?.name || 'Pokémon';
    return [`⚔️ Batalha na Battle Tower começou!`, `Oponente enviou ${first}!`];
  });
  const [result, setResult] = useState(null); // null | 'victory' | 'defeat'
  const [localInv, setLocalInv] = useState({ ...((run?.inventory) || { coins: 0, potions: 0, revives: 0 }) });
  const [showItems, setShowItems] = useState(false);
  const [isResolvingTurn, setIsResolvingTurn] = useState(false);
  const logRef = useRef(null);
  const actionLockRef = useRef(false);

  const lockAction = useCallback(() => {
    if (actionLockRef.current) return false;
    actionLockRef.current = true;
    setIsResolvingTurn(true);
    return true;
  }, []);

  const releaseActionLock = useCallback(() => {
    window.setTimeout(() => {
      actionLockRef.current = false;
      setIsResolvingTurn(false);
    }, 120);
  }, []);

  // Auto-scroll do log
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  // ── Vitória / Derrota ──────────────────────────────────────────────────────

  const handleVictory = useCallback(() => {
    setGameState(prev => {
      const r = prev.tower?.activeRun;
      if (!r) return prev;
      const nextFloor = r.floor + 1;
      const isCheckpoint = (nextFloor - 1) % 10 === 0 && nextFloor > 1;

      // Sincroniza HP do time com o estado da batalha
      const syncedTeam = r.team.map((runPoke, i) => {
        const bp = playerTeam[i];
        if (!bp) return runPoke;
        return { ...runPoke, currentHp: bp.currentHp, hp: bp.currentHp };
      });

      // XP e level up da run da Torre
      const xpResult = applyTowerExperience(syncedTeam, encounter, r.boons || []);

      // Vampirismo
      let finalTeam = xpResult.team;
      if (r.boons?.some(b => b.id === 'vampirism')) {
        finalTeam = finalTeam.map(p => {
          if ((p.currentHp || 0) > 0) {
            const h = Math.min(p.maxHp, (p.currentHp || 0) + Math.ceil(p.maxHp * 0.1));
            return { ...p, currentHp: h, hp: h };
          }
          return p;
        });
      }

      const newInventory = { ...localInv, coins: (localInv.coins || 0) + (encounter?.rewardCoins || 0) };
      const newRun = {
        ...r,
        floor: nextFloor,
        shopPending: true,
        team: finalTeam,
        inventory: newInventory,
        battleEncounter: null,
        lastXpGained: xpResult.xpReward,
        lastXpSummary: xpResult.summary,
      };
      const updatedTower = {
        ...prev.tower,
        activeRun: newRun,
        highestFloor: Math.max(prev.tower?.highestFloor || 0, r.floor),
        battleEncounter: null,
      };
      if (isCheckpoint) updatedTower.checkpoint = newRun;

      // ISOLAMENTO: NÃO toca gameState.team — time da Torre vive em tower.activeRun.team
      return { ...prev, tower: updatedTower };
    });
    setCurrentView('battle_tower');
  }, [playerTeam, localInv, encounter, setGameState, setCurrentView]);

  const handleDefeat = useCallback(() => {
    setGameState(prev => {
      const r = prev.tower?.activeRun;
      const gainedBp = (r?.floor || 1) * 10;
      const highest = Math.max(prev.tower?.highestFloor || 0, r?.floor || 0);
      // ISOLAMENTO: gameState.team nunca foi alterado, então não precisa de restore
      return {
        ...prev,
        currentRoute: 'pallet_town',
        tower: {
          ...prev.tower,
          bp: (prev.tower?.bp || 0) + gainedBp,
          highestFloor: highest,
          activeRun: null,
          battleEncounter: null,
        },
      };
    });
    setCurrentView('battle_tower');
  }, [setGameState, setCurrentView]);

  // ── Execução de turno ──────────────────────────────────────────────────────

  const executeTurn = useCallback((playerMoveKey) => {
    if (phase !== 'select_move' || !lockAction()) return;
    setShowItems(false);

    // Cópia profunda dos times
    const pTeam = playerTeam.map(p => ({ ...p, stages: { ...(p.stages || {}) } }));
    const eTeam = enemyTeam.map(p => ({ ...p, stages: { ...(p.stages || {}) } }));
    const pIdx = playerActive;
    const eIdx = enemyActive;

    const logs = [];

    const enemyMoveKey = enemyPickMove(eTeam[eIdx], pTeam[pIdx]);
    const pMoveData = MOVES[playerMoveKey];
    const eMoveData = MOVES[enemyMoveKey];

    // Ordem de velocidade
    const pSpeed = applyStage(pTeam[pIdx].speed, pTeam[pIdx].stages?.speed || 0)
      * (pTeam[pIdx].status === 'paralysis' ? 0.5 : 1);
    const eSpeed = applyStage(eTeam[eIdx].speed, eTeam[eIdx].stages?.speed || 0)
      * (eTeam[eIdx].status === 'paralysis' ? 0.5 : 1);

    const pPriority = pMoveData?.priority || 0;
    const ePriority = eMoveData?.priority || 0;
    const playerFirst = pPriority > ePriority || (pPriority === ePriority && pSpeed >= eSpeed);

    if (playerFirst) {
      doAttack(pTeam, pIdx, eTeam, eIdx, playerMoveKey, true, logs);
      doAttack(eTeam, eIdx, pTeam, pIdx, enemyMoveKey, false, logs);
    } else {
      doAttack(eTeam, eIdx, pTeam, pIdx, enemyMoveKey, false, logs);
      doAttack(pTeam, pIdx, eTeam, eIdx, playerMoveKey, true, logs);
    }

    // Efeitos de fim de turno
    applyEndOfTurnDoT(pTeam, pIdx, true, logs);
    applyEndOfTurnDoT(eTeam, eIdx, false, logs);

    // Atualiza estado
    setPlayerTeam(pTeam);
    setEnemyTeam(eTeam);
    setLog(prev => [...prev, ...logs].slice(-40));

    // Verifica condições de término
    const allEnemyFainted = eTeam.every(p => p.currentHp <= 0);
    const allPlayerFainted = pTeam.every(p => p.currentHp <= 0);

    if (allEnemyFainted) { setResult('victory'); setPhase('ended'); releaseActionLock(); return; }
    if (allPlayerFainted) { setResult('defeat'); setPhase('ended'); releaseActionLock(); return; }

    // Troca automática de inimigo
    if (eTeam[eIdx].currentHp <= 0) {
      const next = eTeam.findIndex((p, i) => i !== eIdx && p.currentHp > 0);
      if (next >= 0) {
        setEnemyActive(next);
        setLog(prev => [...prev, `💫 Oponente enviou ${eTeam[next].name}!`]);
      }
    }

    // Verifica se Pokémon ativo do jogador desmaiou
    if (pTeam[pIdx].currentHp <= 0) {
      setPhase('switch_required');
    } else {
      setPhase('select_move');
    }
    releaseActionLock();
  }, [phase, playerTeam, enemyTeam, playerActive, enemyActive, lockAction, releaseActionLock]);

  const resolveEnemyTurnAfterSupport = useCallback((targetIdx, nextPlayerTeam) => {
    const eTeam = enemyTeam.map(p => ({ ...p, stages: { ...(p.stages || {}) } }));
    const pTeam = nextPlayerTeam.map(p => ({ ...p, stages: { ...(p.stages || {}) } }));
    const logs = [];

    if (eTeam[enemyActive]?.currentHp > 0 && pTeam[targetIdx]?.currentHp > 0) {
      const enemyMoveKey = enemyPickMove(eTeam[enemyActive], pTeam[targetIdx]);
      doAttack(eTeam, enemyActive, pTeam, targetIdx, enemyMoveKey, false, logs);
    }

    applyEndOfTurnDoT(pTeam, targetIdx, true, logs);
    applyEndOfTurnDoT(eTeam, enemyActive, false, logs);

    setPlayerTeam(pTeam);
    setEnemyTeam(eTeam);
    setLog(prev => [...prev, ...logs].slice(-40));

    if (pTeam.every(p => p.currentHp <= 0)) {
      setResult('defeat');
      setPhase('ended');
    } else if (pTeam[targetIdx]?.currentHp <= 0) {
      setPhase('switch_required');
    } else {
      setPhase('select_move');
    }
    releaseActionLock();
  }, [enemyTeam, enemyActive, releaseActionLock]);

  // ── Itens ──────────────────────────────────────────────────────────────────

  const handleUsePotion = useCallback((targetIdx) => {
    const poke = playerTeam[targetIdx];
    if (!poke || poke.currentHp <= 0 || localInv.potions <= 0 || phase !== 'select_move' || !lockAction()) return;
    const healed = Math.min(poke.maxHp, poke.currentHp + 50);
    const nextTeam = playerTeam.map((p, i) => i === targetIdx ? { ...p, currentHp: healed } : p);
    setPlayerTeam(nextTeam);
    setLocalInv(prev => ({ ...prev, potions: prev.potions - 1 }));
    setLog(prev => [...prev, `🧪 ${poke.name} recuperou 50 HP!`]);
    setShowItems(false);
    resolveEnemyTurnAfterSupport(playerActive, nextTeam);
  }, [playerTeam, localInv, phase, lockAction, resolveEnemyTurnAfterSupport, playerActive]);

  const handleUseRevive = useCallback((targetIdx) => {
    const poke = playerTeam[targetIdx];
    if (!poke || poke.currentHp > 0 || localInv.revives <= 0 || !lockAction()) return;
    const reviveHp = Math.ceil(poke.maxHp * 0.5);
    const nextTeam = playerTeam.map((p, i) => i === targetIdx ? { ...p, currentHp: reviveHp } : p);
    setPlayerTeam(nextTeam);
    setLocalInv(prev => ({ ...prev, revives: prev.revives - 1 }));
    setLog(prev => [...prev, `💊 ${poke.name} foi revivido com ${reviveHp} HP!`]);
    setShowItems(false);
    if (phase === 'select_move') {
      resolveEnemyTurnAfterSupport(playerActive, nextTeam);
    } else {
      setPhase('select_move');
      releaseActionLock();
    }
  }, [playerTeam, localInv, phase, lockAction, releaseActionLock, resolveEnemyTurnAfterSupport, playerActive]);

  // ── Troca de Pokémon ───────────────────────────────────────────────────────

  const handleSwitch = useCallback((newIdx) => {
    if (newIdx === playerActive || !lockAction()) return;
    const poke = playerTeam[newIdx];
    if (!poke || poke.currentHp <= 0) {
      releaseActionLock();
      return;
    }
    setPlayerActive(newIdx);
    setLog(prev => [...prev, `🔄 Vai ${poke.name}!`]);
    setShowItems(false);
    setPhase('select_move');

    // Se não foi troca forçada, inimigo ataca
    if (phase === 'select_move') {
      const eTeam = enemyTeam.map(p => ({ ...p, stages: { ...(p.stages || {}) } }));
      const pTeam = playerTeam.map(p => ({ ...p, stages: { ...(p.stages || {}) } }));
      const logs = [];
      const enemyMoveKey = enemyPickMove(eTeam[enemyActive], pTeam[newIdx]);
      doAttack(eTeam, enemyActive, pTeam, newIdx, enemyMoveKey, false, logs);
      applyEndOfTurnDoT(pTeam, newIdx, true, logs);
      applyEndOfTurnDoT(eTeam, enemyActive, false, logs);
      setPlayerTeam(pTeam);
      setLog(prev => [...prev, ...logs].slice(-40));
      if (pTeam.every(p => p.currentHp <= 0)) { setResult('defeat'); setPhase('ended'); }
      else if (pTeam[newIdx].currentHp <= 0) setPhase('switch_required');
      else setPhase('select_move');
    }
    releaseActionLock();
  }, [playerActive, playerTeam, enemyTeam, enemyActive, phase, lockAction, releaseActionLock]);

  // ── Dados derivados ────────────────────────────────────────────────────────

  const activePoke = playerTeam[playerActive];
  const activeEnemy = enemyTeam[enemyActive];
  const pHpPct = activePoke ? Math.max(0, (activePoke.currentHp / activePoke.maxHp) * 100) : 0;
  const eHpPct = activeEnemy ? Math.max(0, (activeEnemy.currentHp / activeEnemy.maxHp) * 100) : 0;
  const aliveTeammates = playerTeam.filter((p, i) => i !== playerActive && p.currentHp > 0);
  const hasSwitchable = aliveTeammates.length > 0;

  if (!encounter || !run || initEnemyTeam.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center p-6">
          <p className="text-white/50 text-sm mb-4">Batalha não encontrada.</p>
          <button onClick={() => setCurrentView('battle_tower')} className="px-6 py-3 bg-slate-800 rounded-xl text-white font-bold hover:bg-slate-700">Voltar</button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  // Cor de fundo baseada no tipo do inimigo ativo
  const enemyTypeColor = {
    Fire:'#7f1d1d', Water:'#1e3a5f', Grass:'#14532d', Electric:'#713f12',
    Ice:'#164e63', Fighting:'#7c2d12', Poison:'#4a1d96', Ground:'#78350f',
    Flying:'#1e1b4b', Psychic:'#831843', Bug:'#365314', Rock:'#292524',
    Ghost:'#2e1065', Dragon:'#312e81', Dark:'#1c1917', Steel:'#334155',
    Fairy:'#831843', Normal:'#1e293b',
  }[activeEnemy?.types?.[0]] || '#0f172a';
  const towerBackground = getTowerBattleBackground(encounter, activeEnemy, run.floor);
  const towerGround = towerBackground?.ground || '#0f172a';
  const towerGroundAccent = towerBackground?.groundAccent || enemyTypeColor;
  const towerSceneLabel = towerBackground?.label || 'Battle Tower';
  const towerXpPreview = calculateTowerXpReward(encounter, run.boons || []);

  return (
    <div className="h-full flex flex-col overflow-hidden relative">

      {/* ── Background de batalha ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          backgroundColor: towerGround,
          backgroundImage: towerBackground?.sky || `linear-gradient(180deg, ${enemyTypeColor}cc 0%, #0f172a 55%, #0f172a 100%)`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${enemyTypeColor}55 0%, rgba(2,6,23,0.12) 34%, rgba(2,6,23,0.78) 100%)` }} />
        <div className="absolute inset-x-0 bottom-0 h-[44%]" style={{ background: `linear-gradient(180deg, transparent 0%, ${towerGround}dd 38%, ${towerGroundAccent} 100%)` }} />
        <div className="absolute left-1/2 bottom-[24%] h-20 w-[86%] -translate-x-1/2 rounded-[50%] opacity-60 blur-md" style={{ background: `radial-gradient(circle, ${towerGroundAccent} 0%, transparent 68%)` }} />
        {/* Grade sutil estilo arena */}
        <div className="absolute inset-0 opacity-70" style={{
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 54px,rgba(255,255,255,0.022) 54px,rgba(255,255,255,0.022) 55px),repeating-linear-gradient(90deg,transparent,transparent 54px,rgba(255,255,255,0.022) 54px,rgba(255,255,255,0.022) 55px)',
        }} />
        {/* Vinheta */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
      </div>

      {/* ── Conteúdo (z-10) ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <div>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Battle Tower</p>
          <h2 className="text-white font-black text-base uppercase italic tracking-tight leading-none drop-shadow-lg">
            {encounter.isBoss ? <span className="text-purple-300">⭐ Boss — Andar {run.floor}</span> : `Andar ${run.floor}`}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden max-w-28 truncate rounded-full border border-white/15 bg-black/35 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-white/70 backdrop-blur-sm sm:inline-block">
            {towerSceneLabel}
          </span>
          <span className="text-yellow-400 font-black text-xs drop-shadow">🪙 {localInv.coins ?? 0}</span>
          <span className="text-blue-300 font-bold text-xs">🧪{localInv.potions ?? 0}</span>
          <span className="text-red-300 font-bold text-xs">💊{localInv.revives ?? 0}</span>
        </div>
      </div>

      {/* Arena */}
      <div className="flex-1 flex flex-col min-h-0 px-4 pb-2 gap-2 overflow-hidden">

        {/* Inimigo */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-3 shadow-xl">
          <div className="flex items-start justify-between mb-1.5">
            <div>
              <h3 className="text-white font-black text-sm uppercase italic flex items-center gap-1.5">
                {activeEnemy?.name}
                {activeEnemy?.status && (
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${STATUS_BADGE[activeEnemy.status]?.cls || ''}`}>
                    {STATUS_BADGE[activeEnemy.status]?.icon} {STATUS_BADGE[activeEnemy.status]?.label}
                  </span>
                )}
              </h3>
              <div className="flex gap-1 mt-0.5">
                {(activeEnemy?.types || []).map(t => (
                  <span key={t} className="text-[8px] font-black px-1.5 py-0 rounded-full bg-white/10 text-white/70">{t}</span>
                ))}
                <span className="text-white/30 text-[8px] font-bold ml-1">Nv {activeEnemy?.level}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-[8px] font-bold">{activeEnemy?.currentHp} / {activeEnemy?.maxHp}</p>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all ${eHpPct > 50 ? 'bg-green-500' : eHpPct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${eHpPct}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={getPokemonSpriteUrl(activeEnemy)}
              className="w-20 h-20 object-contain drop-shadow-lg"
              alt={activeEnemy?.name}
              onError={e => { e.target.src = getPokemonSpriteFallbackUrl(activeEnemy); }}
            />
          </div>
          {/* Time do inimigo (indicadores) */}
          <div className="flex justify-center gap-1 mt-1">
            {enemyTeam.map((p, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  p.currentHp <= 0 ? 'bg-slate-700' : i === enemyActive ? 'bg-red-500' : 'bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Log de batalha */}
        <div
          ref={logRef}
          className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 overflow-y-auto flex-1 min-h-0 shadow-inner"
          style={{ maxHeight: '110px' }}
        >
          {log.map((entry, i) => (
            <p key={i} className={`text-[10px] font-medium leading-relaxed ${i === log.length - 1 ? 'text-white' : 'text-white/50'}`}>
              {entry}
            </p>
          ))}
        </div>

        {/* Jogador */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-3 shadow-xl">
          <div className="flex items-center gap-3">
            <img
              src={getPokemonSpriteUrl(activePoke, { back: true })}
              className="w-14 h-14 object-contain drop-shadow-md"
              alt={activePoke?.name}
              onError={e => {
                e.target.src = getPokemonSpriteFallbackUrl(activePoke);
              }}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-black text-sm uppercase italic flex items-center gap-1.5">
                  {activePoke?.name}
                  {activePoke?.status && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${STATUS_BADGE[activePoke.status]?.cls || ''}`}>
                      {STATUS_BADGE[activePoke.status]?.icon} {STATUS_BADGE[activePoke.status]?.label}
                    </span>
                  )}
                </h3>
                <span className="text-white/30 text-[8px] font-bold">Nv {activePoke?.level}</span>
              </div>
              <p className="text-white/50 text-[8px] font-bold mt-0.5">{activePoke?.currentHp} / {activePoke?.maxHp}</p>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all ${pHpPct > 50 ? 'bg-green-500' : pHpPct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${pHpPct}%` }}
                />
              </div>
            </div>
          </div>
          {/* Indicadores do time do jogador */}
          <div className="flex gap-1 mt-2">
            {playerTeam.map((p, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  p.currentHp <= 0 ? 'bg-slate-700' : i === playerActive ? 'bg-blue-500' : 'bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Painel de Ação */}
        <div className="shrink-0">

          {/* Fase: Batalha Encerrada */}
          {phase === 'ended' && (
            <div className={`rounded-2xl p-4 border-2 text-center ${result === 'victory' ? 'bg-green-900/30 border-green-500/40' : 'bg-red-900/30 border-red-500/40'}`}>
              <p className="text-2xl font-black uppercase italic tracking-tighter text-white mb-1">
                {result === 'victory' ? '🏆 Vitória!' : '💀 Derrota...'}
              </p>
              {result === 'victory' && (
                <div className="mb-3">
                  <p className="text-yellow-400 font-bold text-sm">+{encounter.rewardCoins} 🪙  — Avançando para o Andar {run.floor + 1}!</p>
                  <p className="text-cyan-300 font-black text-[10px] uppercase tracking-widest mt-1">+{towerXpPreview} XP para a equipe</p>
                </div>
              )}
              {result === 'defeat' && (
                <p className="text-white/60 font-bold text-sm mb-3">Ganhou {run.floor * 10} BP</p>
              )}
              <button
                onClick={result === 'victory' ? handleVictory : handleDefeat}
                className={`w-full py-3 rounded-xl font-black uppercase text-sm tracking-widest ${
                  result === 'victory' ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-red-700 hover:bg-red-600 text-white'
                } transition-colors`}
              >
                {result === 'victory' ? 'Continuar →' : 'Voltar à Torre'}
              </button>
            </div>
          )}

          {/* Fase: Troca forçada */}
          {phase === 'switch_required' && (
            <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-3">
              <p className="text-red-400 font-black text-xs uppercase tracking-widest mb-2">⚠️ {activePoke?.name} desmaiou! Escolha um substituto:</p>
              <div className="flex flex-col gap-2">
                {playerTeam.map((p, i) => {
                  if (p.currentHp <= 0) return null;
                  const _base = POKEDEX[p.id];
                  const hpPct = (p.currentHp / p.maxHp) * 100;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSwitch(i)}
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl p-2 transition-colors text-left"
                    >
                      <img src={getPokemonSpriteUrl(p)} className="w-8 h-8 object-contain" alt={p.name} onError={e => { e.target.src = getPokemonSpriteFallbackUrl(p); }} />
                      <div className="flex-1">
                        <p className="text-white font-black text-xs uppercase">{p.name} <span className="text-white/40 font-normal">Nv {p.level}</span></p>
                        <div className="w-full h-1 bg-slate-700 rounded-full mt-0.5">
                          <div className={`h-full rounded-full ${hpPct > 50 ? 'bg-green-500' : hpPct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${hpPct}%` }} />
                        </div>
                      </div>
                      <span className="text-white/50 text-[9px]">{p.currentHp}/{p.maxHp}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fase: Seleção de Move */}
          {phase === 'select_move' && !showItems && (
            <div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {(activePoke?.moves || []).map((moveKey, i) => {
                  const move = MOVES[moveKey];
                  if (!move) return (
                    <button key={i} className="bg-slate-800 border border-white/10 text-white/30 rounded-xl py-3 px-2 text-[9px] font-black uppercase" disabled>---</button>
                  );
                  const typeClass = TYPE_BTN_CLASS[move.type] || TYPE_BTN_CLASS.Normal;
                  return (
                    <button
                      key={i}
                      onClick={() => executeTurn(moveKey)}
                      disabled={isResolvingTurn}
                      className={`border rounded-xl py-3 px-2 text-left transition-all active:scale-95 ${typeClass}`}
                    >
                      <p className="font-black text-xs uppercase truncate">{move.name}</p>
                      <p className="text-[8px] font-bold opacity-70 mt-0.5">
                        {move.type} · {move.category === 'Physical' ? 'Físico' : move.category === 'Special' ? 'Especial' : 'Status'}
                        {move.power ? ` · 💥${move.power}` : ''}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowItems(true)}
                  disabled={isResolvingTurn}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white/70 rounded-xl py-2 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  💊 Itens
                </button>
                {hasSwitchable && (
                  <button
                    onClick={() => setShowItems('switch')}
                    disabled={isResolvingTurn}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white/70 rounded-xl py-2 text-[10px] font-black uppercase tracking-widest transition-colors"
                  >
                    🔄 Trocar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Painel de Itens */}
          {phase === 'select_move' && showItems === true && (
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-black text-xs uppercase tracking-widest">Usar Item</p>
                <button onClick={() => setShowItems(false)} className="text-white/40 hover:text-white text-lg font-black w-6 h-6 flex items-center justify-center">✕</button>
              </div>

              {/* Poções */}
              {localInv.potions > 0 && (
                <div className="mb-2">
                  <p className="text-white/50 text-[8px] font-bold uppercase mb-1">Poção (+50 HP) — {localInv.potions}x</p>
                  <div className="flex flex-col gap-1">
                    {playerTeam.map((p, i) => {
                      if (p.currentHp <= 0 || p.currentHp >= p.maxHp) return null;
                      return (
                        <button key={i} onClick={() => handleUsePotion(i)} className="flex items-center gap-2 bg-slate-800 hover:bg-green-900/40 border border-white/10 rounded-lg p-2 text-left transition-colors">
                          <img src={getPokemonSpriteUrl(p)} className="w-6 h-6" alt={p.name} onError={e => { e.target.src = getPokemonSpriteFallbackUrl(p); }} />
                          <span className="text-white font-bold text-[10px]">{p.name}</span>
                          <span className="text-green-400 text-[9px] ml-auto">+50 HP</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Revives */}
              {localInv.revives > 0 && (
                <div>
                  <p className="text-white/50 text-[8px] font-bold uppercase mb-1">Revive (50% HP) — {localInv.revives}x</p>
                  <div className="flex flex-col gap-1">
                    {playerTeam.map((p, i) => {
                      if (p.currentHp > 0) return null;
                      return (
                        <button key={i} onClick={() => handleUseRevive(i)} className="flex items-center gap-2 bg-slate-800 hover:bg-yellow-900/40 border border-white/10 rounded-lg p-2 text-left transition-colors">
                          <img src={getPokemonSpriteUrl(p)} className="w-6 h-6 grayscale" alt={p.name} onError={e => { e.target.src = getPokemonSpriteFallbackUrl(p); }} />
                          <span className="text-white font-bold text-[10px]">{p.name}</span>
                          <span className="text-yellow-400 text-[9px] ml-auto">Reviver</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {localInv.potions <= 0 && localInv.revives <= 0 && (
                <p className="text-white/40 text-[10px] text-center py-2">Sem itens disponíveis</p>
              )}
            </div>
          )}

          {/* Painel de Troca voluntária */}
          {phase === 'select_move' && showItems === 'switch' && (
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-black text-xs uppercase tracking-widest">Trocar Pokémon</p>
                <button onClick={() => setShowItems(false)} className="text-white/40 hover:text-white text-lg font-black w-6 h-6 flex items-center justify-center">✕</button>
              </div>
              <div className="flex flex-col gap-1">
                {playerTeam.map((p, i) => {
                  if (i === playerActive || p.currentHp <= 0) return null;
                  const hpPct = (p.currentHp / p.maxHp) * 100;
                  return (
                    <button key={i} onClick={() => handleSwitch(i)} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg p-2 text-left transition-colors">
                      <img src={getPokemonSpriteUrl(p)} className="w-8 h-8" alt={p.name} onError={e => { e.target.src = getPokemonSpriteFallbackUrl(p); }} />
                      <div className="flex-1">
                        <p className="text-white font-bold text-[10px]">{p.name} <span className="text-white/40">Nv {p.level}</span></p>
                        <div className="w-full h-1 bg-slate-700 rounded-full mt-0.5">
                          <div className={`h-full rounded-full ${hpPct > 50 ? 'bg-green-500' : hpPct > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${hpPct}%` }} />
                        </div>
                      </div>
                      <span className="text-white/40 text-[8px]">{p.currentHp}/{p.maxHp}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
      </div>{/* fim z-10 wrapper */}
    </div>
  );
};

export default TowerBattleScreen;

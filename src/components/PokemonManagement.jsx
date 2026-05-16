import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MOVE_TRANSLATIONS } from '../data/translations';
import { getCandyIconUrl, CANDY_FAMILIES, CANDY_USES, POKEMON_TO_CANDY } from '../data/candies';
import { getTimeOfDay } from '../utils/timeSystem';
import { getCompatibleMegaStones, MEGA_STONE_ICONS, getMegaSprite } from '../data/megaEvolutions';
import { ABILITY_ITEM_ID, getPokemonAbilityPool, setPokemonAbility } from '../data/abilities';

import { GYM_LEVEL_CAPS } from '../data/constants';
import { getPokemonRegion, getUnlockedRegions, REGION_LABELS, REGION_CHAMPION_FLAGS, REGION_ORDER, isPokemonLegal } from '../data/regionStandards';

const STAT_LABELS = {
  attack: 'Ataque',
  spAtk: 'Atk. Esp.',
  defense: 'Defesa',
  spDef: 'Def. Esp.',
  speed: 'Velocidade',
};

const ABILITY_DESCRIPTIONS = {
  'Overgrow':        'Aumenta o poder dos golpes Planta em 50% quando o HP está abaixo de 1/3.',
  'Blaze':           'Aumenta o poder dos golpes Fogo em 50% quando o HP está abaixo de 1/3.',
  'Torrent':         'Aumenta o poder dos golpes Água em 50% quando o HP está abaixo de 1/3.',
  'Swarm':           'Aumenta o poder dos golpes Inseto em 50% quando o HP está abaixo de 1/3.',
  'Guts':            'Aumenta o Ataque em 50% quando o Pokémon está com alguma condição de status.',
  'Static':          'Tem 30% de chance de paralisar o inimigo que usar golpes físicos.',
  'Levitate':        'Imune a golpes do tipo Terra.',
  'Intimidate':      'Reduz o Ataque do inimigo em 1 estágio ao entrar em batalha.',
  'Synchronize':     'Passa condições de status (queimadura, paralisia, envenenamento) ao inimigo.',
  'Natural Cure':    'Cura qualquer condição de status ao sair de batalha.',
  'Serene Grace':    'Dobra a chance de efeitos secundários dos golpes.',
  'Swift Swim':      'Dobra a Velocidade durante chuva.',
  'Chlorophyll':     'Dobra a Velocidade durante sol forte.',
  'Flash Fire':      'Imune a golpes Fogo; absorve-os para aumentar o poder dos próprios golpes Fogo.',
  'Water Absorb':    'Imune a golpes Água; recupera 1/4 do HP máximo ao ser atingido por eles.',
  'Volt Absorb':     'Imune a golpes Elétrico; recupera 1/4 do HP máximo ao ser atingido por eles.',
  'Pressure':        'Faz o inimigo gastar PP extra em cada golpe usado.',
  'Thick Fat':       'Reduz o dano recebido de golpes Fogo e Gelo à metade.',
  'Hustle':          'Aumenta o Ataque em 50%, mas reduz a precisão dos golpes físicos em 20%.',
  'Compound Eyes':   'Aumenta a precisão dos golpes em 30%.',
  'Speed Boost':     'Aumenta a Velocidade em 1 estágio no final de cada turno.',
  'Sturdy':          'Sobrevive com 1 HP a qualquer golpe que causaria nocaute.',
  'Shed Skin':       'Tem 33% de chance de curar condições de status no final de cada turno.',
  'Adaptability':    'Aumenta o bônus STAB (tipo igual ao golpe) de 1.5× para 2.0×.',
  'Download':        'Analisa o inimigo e aumenta Atk. Esp. ou Ataque com base na defesa mais baixa do oponente.',
  'Trace':           'Copia a habilidade do inimigo ao entrar em batalha.',
  'Magnet Pull':     'Impede Pokémon do tipo Aço de fugirem.',
  'Drizzle':         'Invoca chuva automaticamente ao entrar em batalha (5 turnos).',
  'Drought':         'Invoca sol forte automaticamente ao entrar em batalha (5 turnos).',
  'Sand Stream':     'Invoca tempestade de areia automaticamente ao entrar em batalha (5 turnos).',
  'Snow Warning':    'Invoca granizo automaticamente ao entrar em batalha (5 turnos).',
  'Rock Head':       'Não recebe dano de recuo por golpes como Investida e Double-Edge.',
  'Rough Skin':      'Causa dano (1/8 do HP máximo do inimigo) a quem usar golpes físicos.',
  'Iron Barbs':      'Causa dano (1/8 do HP máximo do inimigo) a quem usar golpes físicos.',
  'Wonder Guard':    'Imune a golpes que não sejam super-efetivos.',
  'Marvel Scale':    'Aumenta a Defesa em 50% quando o Pokémon está com alguma condição de status.',
  'Lightning Rod':   'Atrai golpes Elétrico; imune a eles e eleva o Atk. Esp. em 1 estágio.',
  'Motor Drive':     'Imune a golpes Elétrico; ser atingido por eles aumenta a Velocidade.',
  'Rivalry':         'Golpes causam 25% mais dano contra Pokémon do mesmo sexo e 25% menos contra de sexo oposto.',
  'Defiant':         'Aumenta o Ataque em 2 estágios quando qualquer stat é reduzido pelo inimigo.',
  'Justified':       'Aumenta o Ataque em 1 estágio ao receber um golpe Sombrio.',
  'Multiscale':      'Recebe apenas metade do dano quando o HP está cheio.',
  'Regenerator':     'Recupera 1/3 do HP ao sair de batalha.',
  'Contrary':        'Inverte as mudanças de estatísticas — reduções viram aumentos e vice-versa.',
  'Gale Wings':      'Golpes do tipo Voador ganham prioridade +1 quando o HP estiver cheio.',
  'Strong Jaw':      'Aumenta o poder de golpes de mordida (Bite, Crunch, etc.) em 50%.',
  'Refrigerate':     'Golpes Normais tornam-se do tipo Gelo e ganham 20% de poder.',
  'Pixilate':        'Golpes Normais tornam-se do tipo Fada e ganham 20% de poder.',
  'Aerilate':        'Golpes Normais tornam-se do tipo Voador e ganham 20% de poder.',
  'Normalize':       'Todos os golpes tornam-se do tipo Normal.',
  'Huge Power':      'Dobra o Ataque do Pokémon.',
  'Pure Power':      'Dobra o Ataque do Pokémon.',
  'Unburden':        'Dobra a Velocidade quando o item segurado é consumido ou retirado.',
  'Dry Skin':        'Recupera HP na chuva e perde HP no sol; imune a Água, vulnerável a Fogo.',
  'Sand Force':      'Golpes Pedra, Aço e Terra ganham 30% de poder durante tempestade de areia.',
  'Heatproof':       'Reduz à metade o dano recebido de golpes Fogo e queimadura.',
  'Simple':          'Dobra o efeito de todas as mudanças de estatísticas (bônus e penalidades).',
  'Moxie':           'Aumenta o Ataque em 1 estágio ao nocautear um inimigo.',
  'Anger Point':     'Aumenta o Ataque ao máximo ao ser atingido por um acerto crítico.',
  'Sheer Force':     'Remove efeitos secundários dos golpes para ganhar 30% de poder.',
  'Technician':      'Aumenta o poder de golpes com força base ≤ 60 em 50%.',
  'Tinted Lens':     'Golpes não muito efetivos causam dano dobrado.',
  'Super Luck':      'Aumenta a taxa de acerto crítico do Pokémon.',
  'Keen Eye':        'A precisão não pode ser reduzida pelo inimigo.',
  'Tangled Feet':    'Aumenta a esquiva em 1 estágio quando confuso.',
  'Pickup':          'Pode coletar itens deixados pelo inimigo após a batalha.',
  'Poison Point':    'Tem 30% de chance de envenenar o inimigo que usar golpes físicos.',
  'Flame Body':      'Tem 30% de chance de queimar o inimigo que usar golpes físicos.',
  'Effect Spore':    'Tem 30% de chance de paralisar, envenenar ou adormecer o inimigo em golpes físicos.',
  'Water Veil':      'Imune a queimadura.',
  'Oblivious':       'Imune a atração (infatuação) e à habilidade Intimidate.',
  'Own Tempo':       'Imune a confusão.',
  'Inner Focus':     'Imune a tremor e não pode ser assustad durante concentração.',
  'Limber':          'Imune a paralisia.',
  'Immunity':        'Imune a envenenamento.',
  'Insomnia':        'Imune a sono.',
  'Vital Spirit':    'Imune a sono.',
  'Damp':            'Impede o uso de Selfdestruct e Explosion por qualquer Pokémon em campo.',
  'Cloud Nine':      'Anula todos os efeitos do clima enquanto estiver em batalha.',
  'Sand Veil':       'Aumenta a esquiva em 20% durante tempestade de areia.',
  'Snow Cloak':      'Aumenta a esquiva em 20% durante granizo.',
  'Magic Guard':     'Recebe dano apenas de golpes diretos; sem dano de clima, recuo, veneno, etc.',
  'Battle Armor':    'Imune a acertos críticos.',
  'Shell Armor':     'Imune a acertos críticos.',
  'Arena Trap':      'Impede Pokémon terrestres de fugirem.',
  'Shadow Tag':      'Impede todos os Pokémon de fugirem.',
  'Prankster':       'Golpes de status ganham prioridade +1.',
  'Infiltrator':     'Golpes ignoram barreiras como Reflect e Light Screen.',
  'Teravolt':        'Os golpes ignoram as habilidades do inimigo.',
  'Turboblaze':      'Os golpes ignoram as habilidades do inimigo.',
  'Mold Breaker':    'Os golpes ignoram as habilidades do inimigo.',
  'Magic Bounce':    'Reflete golpes de status de volta ao usuário.',
  'Fur Coat':        'Reduz o dano de golpes físicos à metade.',
  'Protean':         'Muda o tipo do Pokémon para o tipo do golpe que está prestes a usar.',
  'Stance Change':   'Alterna entre Blade Forme (Ataque) e Shield Forme (Defesa) conforme o golpe escolhido.',
  'Steelworker':     'Aumenta o poder dos golpes Aço em 50%.',
  'Power of Alchemy':'Copia a habilidade de um aliado ao ser nocauteado.',
  'Beast Boost':     'Aumenta em 1 estágio a estatística mais alta ao nocautear um inimigo.',
  'Soul-Heart':      'Aumenta o Atk. Esp. em 1 estágio sempre que um Pokémon é nocauteado em batalha.',
  'Intrepid Sword':  'Aumenta o Ataque em 1 estágio ao entrar em batalha.',
  'Dauntless Shield':'Aumenta a Defesa em 1 estágio ao entrar em batalha.',
};

const PokemonManagement = ({
  gameState,
  setGameState,
  activeTab,
  setActiveTab,
  activePokemonDetails,
  setActivePokemonDetails,
  POKEDEX,
  MOVES,
  NATURES,
  NATURE_LIST,
  getMasteryPath,
  addLog,
  setEvolutionPending,
  handleUseCandy,
  showConfirm,
  closeConfirm,
  setCurrentView,
  validateTeamAccess,
  activeRegion,
  isEvolutionAllowedForRegion,
  getEvolutionRegionLockMessage,
  CRAFTING_RECIPES,
  setMegaEvolutionPending,
  currentEnemy,
}) => {
  const [candyExpanded, setCandyExpanded] = useState(false);
  const [dragTeamIndex, setDragTeamIndex] = useState(null);
  const [dragMoved, setDragMoved] = useState(false);
  const [pcSearch, setPcSearch] = useState('');
  const [pcSort, setPcSort] = useState('number');
  const [pcRegion, setPcRegion] = useState(activeRegion || 'all');
  const [showTeamReorder, setShowTeamReorder] = useState(false);
  const [moveSwapMode, setMoveSwapMode] = useState(null); // { activeIdx, currentMove }
  const [showNatureModal, setShowNatureModal] = useState(false);
  const [showAbilityModal, setShowAbilityModal] = useState(false);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const activePokemonKey = activePokemonDetails
    ? `${activePokemonDetails.pokemon?.instanceId ?? activePokemonDetails.pokemon?.id ?? 'x'}_${activePokemonDetails.location}_${activePokemonDetails.index}`
    : null;

  useEffect(() => {
    setCandyExpanded(false);
    setShowItemPicker(false);
  }, [activePokemonKey]);

  const navigateTeam = (direction) => {
    if (!activePokemonDetails || activePokemonDetails.location !== 'team') return;
    const team = gameState.team || [];
    const newIdx = activePokemonDetails.index + direction;
    if (newIdx < 0 || newIdx >= team.length) return;
    setActivePokemonDetails({ pokemon: team[newIdx], index: newIdx, location: 'team' });
  };

  const getDexRegion = (id) => {
    return getPokemonRegion(id);
  };

  const availablePcRegions = (() => {
    // Calcula as regiões pelo número da Pokédex dos Pokémons no PC
    const regionsInPC = new Set(
      (gameState.pc || []).map(p => getDexRegion(p.id))
    );
    return [
      { id: 'all', label: 'Todas' },
      ...REGION_ORDER
        .filter(r => regionsInPC.has(r))
        .map(r => ({ id: r, label: REGION_LABELS[r] || r })),
    ];
  })();

  const translateMove = (moveName) => {
    if (!moveName) return '---';
    const key = String(moveName).toLowerCase();
    return MOVE_TRANSLATIONS[key] || moveName.replace(/-/g, ' ');
  };

  const normalizeMoveText = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const moveTranslationLookup = Object.entries(MOVE_TRANSLATIONS).reduce((acc, [key, label]) => {
    acc[normalizeMoveText(label)] = key;
    return acc;
  }, {});

  const moveNameLookup = Object.entries(MOVES).reduce((acc, [key, move]) => {
    acc[normalizeMoveText(move.name)] = key;
    return acc;
  }, {});

  const getMoveKey = (move) => {
    const rawName = typeof move === 'string' ? move : move?.name;
    const directKey = normalizeMoveText(rawName);
    return MOVES[directKey] ? directKey : moveTranslationLookup[directKey] || moveNameLookup[directKey] || directKey;
  };

  const getMoveData = (move) => {
    const key = getMoveKey(move);
    const base = MOVES[key] || {};
    const fallback = typeof move === 'object' && move ? move : {};
    return { ...fallback, ...base, name: fallback.name || base.name || (typeof move === 'string' ? move : '') };
  };

  const getMoveLabel = (move) => {
    const key = getMoveKey(move);
    const data = getMoveData(move);
    return MOVE_TRANSLATIONS[key] || data.name || translateMove(typeof move === 'string' ? move : move?.name);
  };

  const moveToPC = (instanceId) => {
    if (gameState.team.length <= 1) {
      showConfirm({
        title: 'Ação Bloqueada',
        message: 'Você precisa de pelo menos um Pokémon no seu time principal!',
        onConfirm: closeConfirm
      });
      return;
    }
    setGameState(prev => {
      const poke = prev.team.find(p => p.instanceId === instanceId);
      if (!poke) return prev;
      const newTeam = prev.team.filter(p => p.instanceId !== instanceId);
      const newPC = [...(prev.pc || []), poke];
      return { ...prev, team: newTeam, pc: newPC };
    });
    setActivePokemonDetails(null);
  };

  const moveToTeam = (index, instanceId) => {
    if (gameState.team.length >= 6) {
      showConfirm({
        title: 'Time Cheio',
        message: 'Seu time já possui o limite máximo de 6 Pokémon. Envie alguém para o PC primeiro!',
        onConfirm: closeConfirm
      });
      return;
    }
    // Lê o Pokémon pelo instanceId (mais seguro) ou pelo índice
    const poke = instanceId
      ? (gameState.pc.find(p => p.instanceId === instanceId) || gameState.pc[index])
      : gameState.pc[index];

    if (!poke) return;
    
    // Validação de Acesso Regional
    if (validateTeamAccess && !validateTeamAccess(poke, activeRegion)) {
      const isChampion = (gameState.worldFlags || []).includes(`region_champion_${activeRegion}`) || 
                        (gameState.worldFlags || []).includes(REGION_CHAMPION_FLAGS[activeRegion]);

      let reason = "Este Pokémon não pode ser usado nesta região no momento.";
      if (poke.level > (GYM_LEVEL_CAPS[activeRegion]?.[Object.values(GYM_LEVEL_CAPS[activeRegion]).length - 1] || 100)) {
         reason = "Nível muito alto para o seu limite atual de insígnias.";
      } else if (!isChampion && getDexRegion(poke.id) !== activeRegion && activeRegion !== 'kanto') {
         // Kanto permite tudo se for campeão, mas outras regiões podem ter restrições.
         // Mantemos a lógica de validateTeamAccess para o grosso das regras.
         // Se validateTeamAccess retornou falso, já parou acima.
      }

      showConfirm({
        title: 'Acesso Negado',
        message: `Regra Regional: ${reason}`,
        onConfirm: closeConfirm
      });
      return;
    }

    setGameState(prev => {
      // Identifica o Pokémon de forma segura dentro do callback (evita closure stale)
      const targetPoke = instanceId
        ? (prev.pc.find(p => p.instanceId === instanceId) || prev.pc[index])
        : prev.pc[index];
      if (!targetPoke) return prev;
      const newPC = instanceId
        ? prev.pc.filter(p => p.instanceId !== instanceId)
        : prev.pc.filter((_, i) => i !== index);
      const newTeam = [...prev.team, targetPoke];
      return { ...prev, team: newTeam, pc: newPC };
    });
    setActivePokemonDetails(null);
  };

  const moveToTeamPosition = (targetIndex) => {
    if (!activePokemonDetails || activePokemonDetails.location !== 'team') return;
    const currentIndex = activePokemonDetails.index;
    if (targetIndex === currentIndex) return;
    setGameState(prev => {
       const newTeam = [...prev.team];
       [newTeam[currentIndex], newTeam[targetIndex]] = [newTeam[targetIndex], newTeam[currentIndex]];
       return { ...prev, team: newTeam };
    });
    setActivePokemonDetails(prev => ({ ...prev, index: targetIndex }));
  };

  const reorderTeam = (fromIndex, toIndex) => {
    if (fromIndex === null || toIndex === null || fromIndex === toIndex) return;
    setGameState(prev => {
       const newTeam = [...prev.team];
       [newTeam[fromIndex], newTeam[toIndex]] = [newTeam[toIndex], newTeam[fromIndex]];
       return { ...prev, team: newTeam };
    });
    setDragTeamIndex(toIndex);
    setDragMoved(true);
  };

  const endTeamDrag = () => {
    window.setTimeout(() => {
      setDragTeamIndex(null);
      setDragMoved(false);
    }, 0);
  };

  const equipNature = (natureName) => {
    if (!activePokemonDetails) return;
    setGameState(prev => {
       const newList = [...prev[activePokemonDetails.location]];
       newList[activePokemonDetails.index] = { ...newList[activePokemonDetails.index], equippedNature: natureName };
       return { ...prev, [activePokemonDetails.location]: newList };
    });
    setActivePokemonDetails(prev => ({ ...prev, pokemon: { ...prev.pokemon, equippedNature: natureName } }));
  };

  const changeAbility = (abilityName) => {
    if (!activePokemonDetails || !abilityName) return;
    setGameState(prev => {
      const items = prev.inventory?.items || {};
      if ((items[ABILITY_ITEM_ID] || 0) <= 0) return prev;
      const newList = [...prev[activePokemonDetails.location]];
      const current = newList[activePokemonDetails.index];
      if (!current || current.ability === abilityName) return prev;
      newList[activePokemonDetails.index] = setPokemonAbility(current, abilityName);
      return {
        ...prev,
        [activePokemonDetails.location]: newList,
        inventory: {
          ...prev.inventory,
          items: { ...items, [ABILITY_ITEM_ID]: items[ABILITY_ITEM_ID] - 1 },
        },
      };
    });
    setActivePokemonDetails(prev => prev ? ({
      ...prev,
      pokemon: setPokemonAbility(prev.pokemon, abilityName),
    }) : prev);
    addLog(`${activePokemonDetails.pokemon.name} alterou a habilidade para ${abilityName}.`, 'system');
  };

  const equipRareMove = (moveObj) => {
    if (!activePokemonDetails) return;
    setGameState(prev => {
       const newList = [...prev[activePokemonDetails.location]];
       const poke = newList[activePokemonDetails.index];

       let newLearnedMoves = poke.learnedMoves ? [...poke.learnedMoves] : [...poke.moves];
       if (!newLearnedMoves.some(m => m.name === moveObj.name)) {
         newLearnedMoves.push(moveObj);
       }

       if (poke.moves.some(m => m.name === moveObj.name)) {
         newList[activePokemonDetails.index] = { ...poke, learnedMoves: newLearnedMoves };
         return { ...prev, [activePokemonDetails.location]: newList };
       }

       const newMoves = [...poke.moves];
       if (newMoves.length < 4) newMoves.push(moveObj);
       else newMoves[0] = moveObj;

       newList[activePokemonDetails.index] = { ...poke, moves: newMoves, learnedMoves: newLearnedMoves };
       return { ...prev, [activePokemonDetails.location]: newList };
    });

    setActivePokemonDetails(prev => {
       const poke = prev.pokemon;
       let newLearnedMoves = poke.learnedMoves ? [...poke.learnedMoves] : [...poke.moves];
       if (!newLearnedMoves.some(m => m.name === moveObj.name)) {
         newLearnedMoves.push(moveObj);
       }

       if (poke.moves.some(m => m.name === moveObj.name)) {
         return { ...prev, pokemon: { ...poke, learnedMoves: newLearnedMoves } };
       }

       const newMoves = [...poke.moves];
       if (newMoves.length < 4) newMoves.push(moveObj);
       else newMoves[0] = moveObj;

       return { ...prev, pokemon: { ...poke, moves: newMoves, learnedMoves: newLearnedMoves } };
    });
    addLog(`${activePokemonDetails.pokemon.name} aprendeu ${moveObj.name}!`, 'system');
  };
  
  const equipHeldItem = (itemId) => {
    if (!activePokemonDetails) return;
    setGameState(prev => {
      const list = [...prev[activePokemonDetails.location]];
      const poke = { ...list[activePokemonDetails.index] };
      // Devolve o item atual ao inventário antes de trocar
      const newItems = { ...prev.inventory.items };
      if (poke.heldItem) newItems[poke.heldItem] = (newItems[poke.heldItem] || 0) + 1;
      // Consome o novo item
      newItems[itemId] = Math.max(0, (newItems[itemId] || 0) - 1);
      poke.heldItem = itemId;
      list[activePokemonDetails.index] = poke;
      return { ...prev, [activePokemonDetails.location]: list, inventory: { ...prev.inventory, items: newItems } };
    });
    setActivePokemonDetails(prev => ({ ...prev, pokemon: { ...prev.pokemon, heldItem: itemId } }));
  };

  const unequipHeldItem = () => {
    if (!activePokemonDetails) return;
    setGameState(prev => {
      const list = [...prev[activePokemonDetails.location]];
      const poke = { ...list[activePokemonDetails.index] };
      const newItems = { ...prev.inventory.items };
      if (poke.heldItem) newItems[poke.heldItem] = (newItems[poke.heldItem] || 0) + 1;
      poke.heldItem = null;
      list[activePokemonDetails.index] = poke;
      return { ...prev, [activePokemonDetails.location]: list, inventory: { ...prev.inventory, items: newItems } };
    });
    setActivePokemonDetails(prev => ({ ...prev, pokemon: { ...prev.pokemon, heldItem: null } }));
  };

  const swapMove = (activeIdx, newMoveName) => {
    if (!activePokemonDetails || !newMoveName) return;
    const moveData = getMoveData(newMoveName);
    if (!moveData) return;

    setGameState(prev => {
      const newList = [...prev[activePokemonDetails.location]];
      const poke = { ...newList[activePokemonDetails.index] };
      const newMoves = [...poke.moves];

      // Se já tiver o golpe em outra posição, apenas troca de lugar (reordenar)
      const existingIdx = newMoves.findIndex(m => m.name === newMoveName);
      if (existingIdx !== -1) {
        [newMoves[activeIdx], newMoves[existingIdx]] = [newMoves[existingIdx], newMoves[activeIdx]];
      } else {
        newMoves[activeIdx] = moveData; // Fix: use full moveData instead of just { name }
      }

      poke.moves = newMoves;
      newList[activePokemonDetails.index] = poke;
      return { ...prev, [activePokemonDetails.location]: newList };
    });

    setActivePokemonDetails(prev => {
      const poke = { ...prev.pokemon };
      const newMoves = [...poke.moves];
      const existingIdx = newMoves.findIndex(m => m.name === newMoveName);
      if (existingIdx !== -1) {
        [newMoves[activeIdx], newMoves[existingIdx]] = [newMoves[existingIdx], newMoves[activeIdx]];
      } else {
        newMoves[activeIdx] = moveData; // Fix: use full moveData instead of just { name }
      }
      return { ...prev, pokemon: { ...poke, moves: newMoves } };
    });

    setMoveSwapMode(null);
  };

  const handleStoneEvolution = (stoneId, targetEvo) => {
    if (!activePokemonDetails) return;
    const itemCount = gameState.inventory?.items?.[stoneId] || 0;
    if (itemCount <= 0) return;

    const poke = activePokemonDetails.pokemon;
    const actualTarget = targetEvo || (Array.isArray(POKEDEX[poke.id]?.evolution) ? POKEDEX[poke.id]?.evolution.find(e => e.item === stoneId) : POKEDEX[poke.id]?.evolution);

    setGameState(prev => ({
      ...prev,
      inventory: { ...prev.inventory, items: { ...prev.inventory.items, [stoneId]: (prev.inventory.items[stoneId] || 1) - 1 } }
    }));
    setActivePokemonDetails(null);
    setEvolutionPending({
      ...poke,
      targetEvolution: actualTarget,
      teamIndex: activePokemonDetails.location === 'team' ? activePokemonDetails.index : null,
      pcIndex: activePokemonDetails.location === 'pc' ? activePokemonDetails.index : null
    });
  };

  const masteryCount = activePokemonDetails ? (gameState.speciesMastery[activePokemonDetails.pokemon.id] || 0) : 0;
  const path = activePokemonDetails ? getMasteryPath(activePokemonDetails.pokemon.id) : null;
  const typeColorMap = {
    Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
    Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
    Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
    Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
    Steel: '#5a8ea2', Fairy: '#fb89eb',
  };
  const typeIconUrl = (t) => t ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${String(t).toLowerCase()}.svg` : '';

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10 h-full text-left">
      <div className="flex bg-white rounded-2xl p-1 shadow-md border-2 border-slate-100">
         <button onClick={() => setActiveTab('team')} className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'team' ? 'bg-pokeBlue text-white shadow-lg' : 'text-slate-400'}`}>Meu Time ({gameState.team.length}/6)</button>
         <button onClick={() => setActiveTab('pc')} className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'pc' ? 'bg-pokeGold text-white shadow-lg' : 'text-slate-400'}`}>PC Storage ({gameState.pc?.length || 0})</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'team' ? (
          <div className="flex flex-col gap-4">
            {/* ── Botão de retorno contextual ─────────────────────────────── */}
            {currentEnemy?.isTrainer ? (
              /* Estava em luta de VS (ginásio, rival, elite…) */
              <div className="flex flex-col gap-2 mb-2">
                <button
                  onClick={() => setCurrentView('battles')}
                  className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-md border-b-4 active:scale-95 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    borderBottomColor: '#7f1d1d',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(220,38,38,0.35)',
                  }}
                >
                  <span>⚔️</span> Voltar para Batalha
                </button>
              </div>
            ) : (
              /* Estava em treino normal na rota */
              <button
                onClick={() => setCurrentView('battles')}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-md border-b-4 border-slate-900 flex items-center justify-center gap-2 active:scale-95 mb-2"
              >
                <span>🗺️</span> Voltar para Rota
              </button>
            )}

            <div className="grid grid-cols-1 gap-3">
            {gameState.team.map((p, i) => (
              <div
                key={p.instanceId || i}
                draggable
                onDragStart={(e) => {
                  setDragTeamIndex(i);
                  setDragMoved(false);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', String(i));
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = Number(e.dataTransfer.getData('text/plain'));
                  reorderTeam(Number.isNaN(fromIndex) ? dragTeamIndex : fromIndex, i);
                  endTeamDrag();
                }}
                onDragEnd={endTeamDrag}
                onPointerDown={() => {
                  setDragTeamIndex(i);
                  setDragMoved(false);
                }}
                onPointerEnter={() => {
                  if (dragTeamIndex !== null && dragTeamIndex !== i) reorderTeam(dragTeamIndex, i);
                }}
                onPointerUp={endTeamDrag}
                onClick={() => {
                  if (dragMoved) return;
                  setActivePokemonDetails({ pokemon: p, index: i, location: 'team' });
                }}
                className={`bg-white p-4 rounded-3xl border-2 flex items-center gap-4 group cursor-grab active:cursor-grabbing hover:border-pokeBlue transition-all touch-none ${
                  dragTeamIndex === i ? 'border-pokeBlue shadow-lg scale-[0.98]' : 'border-slate-100'
                }`}
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center relative">
                  <img
                    src={p.isMega && p.megaFormId ? getMegaSprite(p.megaFormId) : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`}
                    onError={e => {
                      if (p.isMega && p.megaFormId && !e.target.dataset.triedBase) {
                        e.target.dataset.triedBase = '1';
                        e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`;
                      }
                    }}
                    className="w-14 h-14 object-contain"
                    alt={p.name}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start">
                    <div>
                      <h4 className="font-black uppercase text-slate-800 text-sm italic leading-none flex items-baseline gap-2">
                        <span>{p.name}</span>
                        {p.isShiny && (
                          <span className="text-yellow-500 text-xs animate-pulse">
                            ✨{p.shinyCount > 1 ? ` x${p.shinyCount}` : ''}
                          </span>
                        )}
                        <span className="text-[10px] font-black text-slate-400 not-italic">Nv. {p.level}</span>
                      </h4>
                      <div className="flex gap-2 mt-1">
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">ATK: {p.attack}</span>
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">S.ATK: {p.spAtk}</span>
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">SPD: {p.speed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                    <div className={`h-full ${(p.hp/p.maxHp) > 0.5 ? 'bg-green-500' : (p.hp/p.maxHp) > 0.2 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(p.hp/p.maxHp)*100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm">
               <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar por nome ou nº..."
                    value={pcSearch}
                    onChange={(e) => setPcSearch(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-pokeGold/50 transition-all placeholder:text-slate-300"
                  />
               </div>
               <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Regiao:</span>
                  <select
                    value={pcRegion}
                    onChange={(e) => setPcRegion(e.target.value)}
                    className="bg-slate-50 border-none rounded-xl py-2.5 px-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-pokeGold/50 outline-none transition-all cursor-pointer"
                  >
                    {availablePcRegions.map(region => (
                      <option key={region.id} value={region.id}>{region.label}</option>
                    ))}
                  </select>
                  <span className="text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Ordenar:</span>
                  <select
                    value={pcSort}
                    onChange={(e) => setPcSort(e.target.value)}
                    className="bg-slate-50 border-none rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-pokeGold/50 outline-none transition-all cursor-pointer"
                  >
                    <option value="number">Nº Pokedex (1-251)</option>
                    <option value="number-desc">Nº Pokedex (251-1)</option>
                    <option value="alpha">Ordem Alfabética (A-Z)</option>
                    <option value="level">Maior Nível</option>
                    <option value="type">Por Tipo</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(() => {
                const filtered = (gameState.pc || [])
                  .map((p, idx) => ({ ...p, originalIndex: idx }))
                  .filter(p => {
                    const term = pcSearch.toLowerCase();
                    const matchesRegion = pcRegion === 'all' || getDexRegion(p.id) === pcRegion;
                    return matchesRegion && (p.name.toLowerCase().includes(term) || String(p.id).includes(term));
                  })
                  .sort((a, b) => {
                    if (pcSort === 'alpha') return a.name.localeCompare(b.name);
                    if (pcSort === 'level') return b.level - a.level;
                    if (pcSort === 'type') return (a.type || 'Normal').localeCompare(b.type || 'Normal');
                    if (pcSort === 'number-desc') return b.id - a.id;
                    return a.id - b.id;
                  });

                if (filtered.length === 0) {
                  return <p className="col-span-2 text-center py-10 text-slate-400 font-bold uppercase italic">{pcSearch ? 'Nenhum Pokémon encontrado...' : 'O PC está vazio...'}</p>;
                }

                return filtered.map((p) => {
                  const worldFlags = gameState.worldFlags || [];
                  const isLegal = isPokemonLegal(p, activeRegion, worldFlags);
                  const isAllowedByLevel = validateTeamAccess ? validateTeamAccess(p, activeRegion) : true;
                  const canSelect = isLegal && isAllowedByLevel && !p.onExpedition;

                  return (
                    <div 
                      key={p.instanceId || `pc-${p.id}-${p.originalIndex}`} 
                      onClick={() => setActivePokemonDetails({ pokemon: p, index: p.originalIndex, location: 'pc' })} 
                      className={`bg-white p-3 rounded-2xl border-2 flex flex-col items-center gap-2 group relative cursor-pointer hover:border-pokeGold transition-all ${
                        !isLegal ? 'opacity-50 grayscale border-red-100' : 'border-slate-100'
                      }`}
                    >
                       <img
                         src={p.isMega && p.megaFormId ? getMegaSprite(p.megaFormId) : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`}
                         onError={e => {
                           if (p.isMega && p.megaFormId && !e.target.dataset.triedBase) {
                             e.target.dataset.triedBase = '1';
                             e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.isShiny ? 'shiny/' : ''}${p.id}.png`;
                           }
                         }}
                         className="w-12 h-12 object-contain"
                         alt={p.name}
                         loading="lazy"
                       />
                       
                       {/* Ícone de Cadeado Regional */}
                       {!isLegal && (
                         <div className="absolute top-1 left-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-sm" title="Pokémon estrangeiros só podem ser usados após vencer a Liga desta região.">
                           <span className="text-[10px]">🔒</span>
                         </div>
                       )}

                       <div className="text-center">
                         <p className="font-black uppercase text-slate-800 text-[10px] italic leading-none flex items-center justify-center gap-1">
                           {p.name}
                           {p.isShiny && (
                             <span className="text-yellow-500 text-[8px]">
                               ✨{p.shinyCount > 1 ? ` x${p.shinyCount}` : ''}
                             </span>
                           )}
                         </p>
                         <p className="text-[8px] font-bold text-slate-400 mt-0.5">Nv. {p.level}</p>
                         {p.onExpedition && (
                           <p className="text-[7px] font-black text-blue-500 uppercase mt-0.5 animate-pulse">🚢 Expedição</p>
                         )}
                       </div>

                       {canSelect ? (
                         <button 
                           onClick={(e) => { e.stopPropagation(); moveToTeam(p.originalIndex, p.instanceId); }} 
                           className="absolute top-1 right-1 bg-blue-50 text-blue-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75"
                         >
                           <span className="font-black text-[8px] uppercase">+ Team</span>
                         </button>
                       ) : (
                         <div 
                           className="absolute top-1 right-1 bg-slate-100 text-slate-400 p-1.5 rounded-lg opacity-100 scale-75"
                           title={!isLegal ? 'Pokémon estrangeiros só podem ser usados após vencer a Liga desta região.' : p.onExpedition ? 'Em expedição' : 'Nível muito alto'}
                         >
                           <span className="font-black text-[8px] uppercase">🔒</span>
                         </div>
                       )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </div>

      {activePokemonDetails && typeof document !== 'undefined' && createPortal((
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-[82vw] max-w-[360px] max-h-[82dvh] rounded-[2rem] shadow-2xl border-b-[8px] border-slate-200 overflow-hidden relative animate-slideInUp flex flex-col">
               <button onClick={() => setActivePokemonDetails(null)} className="absolute top-4 right-4 bg-white/20 w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/30 backdrop-blur-md transition-all z-20 text-white font-black text-xs">
                  x
               </button>
               {(() => {
                 const poke = activePokemonDetails.pokemon;
                 const types = (poke.types && poke.types.length > 0) ? poke.types : [poke.type || 'Normal'];
                 const t1 = types[0] || 'Normal';
                 const t2 = types[1] || null;

                 const TYPE_COLOR = {
                   Normal: '#9ea0aa', Fire: '#ff9741', Water: '#3391d4', Grass: '#38bf4f',
                   Electric: '#fbd100', Ice: '#70cbd4', Fighting: '#e0306a', Poison: '#b567ce',
                   Ground: '#e87236', Flying: '#89aae3', Psychic: '#ff6675', Bug: '#83c300',
                   Rock: '#c9bb8a', Ghost: '#4c6ab2', Dragon: '#006fc9', Dark: '#5b5466',
                   Steel: '#5a8ea2', Fairy: '#fb89eb',
                 };

                 const TYPE_BADGE = {
                   Normal: 'bg-[#9ea0aa]', Fire: 'bg-[#ff9741]', Water: 'bg-[#3391d4]',
                   Grass: 'bg-[#38bf4f]', Electric: 'bg-[#fbd100]', Ice: 'bg-[#70cbd4]',
                   Fighting: 'bg-[#e0306a]', Poison: 'bg-[#b567ce]', Ground: 'bg-[#e87236]',
                   Flying: 'bg-[#89aae3]', Psychic: 'bg-[#ff6675]', Bug: 'bg-[#83c300]',
                   Rock: 'bg-[#c9bb8a]', Ghost: 'bg-[#4c6ab2]', Dragon: 'bg-[#006fc9]',
                   Dark: 'bg-[#5b5466]', Steel: 'bg-[#5a8ea2]', Fairy: 'bg-[#fb89eb]',
                 };

                 const typeIconUrl = (t) => t ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.toLowerCase()}.svg` : '';
                 const c1 = TYPE_COLOR[t1] || '#9ea0aa';
                 const c2 = t2 ? (TYPE_COLOR[t2] || '#9ea0aa') : c1;

                 const bgStyle = poke.isShiny
                   ? { background: 'linear-gradient(160deg, #fde68a 0%, #f59e0b 50%, #d97706 100%)' }
                   : t2
                     ? { background: `linear-gradient(160deg, ${c1} 0%, ${c1}bb 40%, ${c2}bb 60%, ${c2} 100%)` }
                     : { background: `linear-gradient(160deg, ${c1}88 0%, ${c1} 60%, ${c1}dd 100%)` };

                 return (
                   <div className="h-48 w-full shrink-0 relative overflow-hidden shadow-inner" style={bgStyle}>
                     <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                     <img src={typeIconUrl(t1)} className="absolute -left-4 bottom-2 w-28 h-28 opacity-10 pointer-events-none select-none invert" alt="" />
                     {t2 && <img src={typeIconUrl(t2)} className="absolute -right-2 top-2 w-24 h-24 opacity-10 pointer-events-none select-none invert" alt="" />}
                     <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-10">
                       {poke.isShiny && (
                         <div className="bg-yellow-500 px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                           <span className="text-[9px] font-black text-white uppercase tracking-widest">Shiny</span>
                         </div>
                       )}
                       {types.map(t => (
                         <div key={t} className={`${TYPE_BADGE[t] || 'bg-slate-500'} px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md`}>
                           <img src={typeIconUrl(t)} className="w-3.5 h-3.5 invert" alt={t} onError={e => { e.target.style.display = 'none'; }} />
                           <span className="text-[9px] font-black text-white uppercase tracking-wider">{t}</span>
                         </div>
                       ))}
                     </div>
                     <img
                       src={poke.isMega && poke.megaFormId
                         ? getMegaSprite(poke.megaFormId)
                         : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.isShiny ? 'shiny/' : ''}${poke.id}.png`}
                       className={`absolute left-1/2 top-12 z-10 w-28 h-28 -translate-x-1/2 object-contain drop-shadow-2xl ${poke.isShiny ? 'drop-shadow-[0_0_20px_rgba(234,179,8,0.9)]' : ''}`}
                        onError={e => {
                          if (poke.isMega && poke.megaFormId && !e.target.dataset.triedBase) {
                            e.target.dataset.triedBase = '1';
                            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.isShiny ? 'shiny/' : ''}${poke.id}.png`;
                          }
                        }}
                        alt={poke.name}
                       loading="lazy"
                     />

                     {/* Setas de navegação entre membros do time */}
                     {activePokemonDetails.location === 'team' && (() => {
                       const team = gameState.team || [];
                       const idx = activePokemonDetails.index;
                       return (
                         <>
                           {idx > 0 && (
                             <button
                               onClick={() => navigateTeam(-1)}
                               className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white font-black text-sm transition-all active:scale-90 shadow-lg"
                               title="Pokémon anterior"
                             >‹</button>
                           )}
                           {idx < team.length - 1 && (
                             <button
                               onClick={() => navigateTeam(1)}
                               className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white font-black text-sm transition-all active:scale-90 shadow-lg"
                               title="Próximo Pokémon"
                             >›</button>
                           )}
                           {team.length > 1 && (
                             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                               {team.map((_, i) => (
                                 <button key={i} onClick={() => setActivePokemonDetails({ pokemon: team[i], index: i, location: 'team' })}
                                   className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                                 />
                               ))}
                             </div>
                           )}
                         </>
                       );
                     })()}
                   </div>
                 );
               })()}

               <div className="flex-1 overflow-y-auto px-5 pt-6 pb-6 custom-scrollbar">
                  <div className="text-center mb-5">
                     <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-none flex items-center justify-center gap-2">
                       {activePokemonDetails.pokemon.name}
                       {activePokemonDetails.pokemon.isShiny && <span className="text-yellow-500 text-xl animate-pulse">⭐</span>}
                     </h3>
                     <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Nv. {activePokemonDetails.pokemon.level}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        {activePokemonDetails.pokemon.onExpedition && (
                          <>
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm animate-pulse">
                              🚢 Em Expedição
                            </span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                          </>
                        )}
                        {(activePokemonDetails.pokemon.types || [activePokemonDetails.pokemon.type || 'Normal']).map(t => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white shadow-sm"
                            style={{ background: typeColorMap[t] || '#64748b' }}
                          >
                            <img src={typeIconUrl(t)} className="w-3 h-3 invert" alt="" onError={e => { e.target.style.display = 'none'; }} />
                            {t}
                          </span>
                        ))}
                     </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-6 group hover:border-pokeBlue/30 transition-colors">
                     <h4 className="font-black uppercase text-[8px] text-slate-400 mb-3 tracking-widest text-center">Estatísticas Reais</h4>
                     <div className="grid grid-cols-2 gap-x-8 gap-y-3 px-2">
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">HP</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.hp}/{activePokemonDetails.pokemon.maxHp}</p></div>
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">ATK</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.attack}</p></div>
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">SPD</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.speed}</p></div>
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">DEF</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.defense}</p></div>
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">S.ATK</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.spAtk || 10}</p></div>
                        <div className="flex justify-between items-center"><p className="text-[8px] font-black text-slate-400 uppercase">S.DEF</p><p className="text-xs font-black text-slate-700">{activePokemonDetails.pokemon.spDef || 10}</p></div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h4 className="font-black uppercase text-[9px] text-slate-400 text-center tracking-widest mb-1">Treinamento Avançado</h4>

                    {/* NATUREZAS */}
                    <button
                      onClick={() => setShowNatureModal(true)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all shadow-sm text-left active:scale-[0.98]
                        ${masteryCount >= 5 ? 'border-pokeBlue bg-blue-50/70 hover:bg-blue-100/60' : 'border-blue-100 bg-blue-50/40 opacity-80'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="text-[11px] font-black uppercase text-slate-800">Natureza</h3>
                          <p className="text-[8px] font-black uppercase tracking-widest text-pokeBlue">Toque para ver detalhes</p>
                        </div>
                        <span className="text-lg">ℹ️</span>
                      </div>
                      {(() => {
                        const nat = activePokemonDetails.pokemon.equippedNature;
                        const mods = nat ? NATURES[nat] : null;
                        return (
                          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-blue-100 shadow-sm">
                            <span className="text-sm font-black text-slate-700 flex-1">{nat || 'Padrão (Neutro)'}</span>
                            {mods ? (
                              <div className="flex gap-2">
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+{STAT_LABELS[mods.plus]}</span>
                                <span className="text-[9px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded">-{STAT_LABELS[mods.minus]}</span>
                              </div>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400">Sem bônus</span>
                            )}
                          </div>
                        );
                      })()}
                      {masteryCount < 5 && (
                        <p className="text-[8px] font-bold text-red-500 uppercase mt-2">🔒 Faltam {5 - masteryCount} capturas para desbloquear</p>
                      )}
                    </button>

                    {/* HABILIDADES */}
                    <button
                      onClick={() => setShowAbilityModal(true)}
                      className="w-full p-4 rounded-2xl border-2 border-violet-100 bg-violet-50/40 shadow-sm text-left hover:bg-violet-100/50 active:scale-[0.98] transition-all"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="text-[11px] font-black uppercase text-slate-800">Habilidade</h3>
                          <p className="text-[8px] font-black uppercase tracking-widest text-violet-600">Toque para ver detalhes</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-violet-700 bg-white px-2 py-1 rounded-lg border border-violet-100">
                            {(gameState.inventory?.items?.[ABILITY_ITEM_ID] || 0)} cápsulas
                          </span>
                          <span className="text-lg">ℹ️</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl px-3 py-2 border border-violet-100 shadow-sm">
                        <p className="text-sm font-black text-slate-700">
                          {activePokemonDetails.pokemon.ability || getPokemonAbilityPool(POKEDEX[activePokemonDetails.pokemon.id] || activePokemonDetails.pokemon)[0] || '—'}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5 leading-relaxed">
                          {ABILITY_DESCRIPTIONS[activePokemonDetails.pokemon.ability] || 'Toque para ver todas as habilidades disponíveis.'}
                        </p>
                      </div>
                    </button>
                    
                    {/* HELD ITEMS */}
                    {(() => {
                      const poke = activePokemonDetails.pokemon;
                      const allHoldItems = [...(CRAFTING_RECIPES.hold_items || []), ...(CRAFTING_RECIPES.elite_relics || [])];
                      const equippedItemData = poke.heldItem ? allHoldItems.find(r => r.id === poke.heldItem) : null;
                      const availableItems = allHoldItems.filter(r => (gameState.inventory?.items?.[r.id] || 0) > 0 && r.id !== poke.heldItem);
                      return (
                        <div className="rounded-2xl border-2 border-amber-100 bg-amber-50/30 shadow-sm mt-2 overflow-hidden">
                          {/* Header row — always visible, tap to toggle picker */}
                          <button
                            onClick={() => !poke.onExpedition && setShowItemPicker(v => !v)}
                            disabled={poke.onExpedition}
                            className={`w-full flex items-center gap-3 p-4 text-left transition-all active:scale-[0.99] ${poke.onExpedition ? 'opacity-60 cursor-not-allowed' : 'hover:bg-amber-50/60'}`}
                          >
                            {equippedItemData ? (
                              <>
                                <img src={equippedItemData.img} className="w-10 h-10 object-contain drop-shadow shrink-0" alt="" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-black uppercase text-slate-800 leading-none truncate">{equippedItemData.name}</p>
                                  <p className="text-[8px] font-bold text-amber-600 mt-0.5 uppercase italic leading-tight line-clamp-2">{equippedItemData.effect || 'Sem efeito especial'}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className="text-[7px] font-black uppercase text-amber-500 tracking-wider">Item Segurado</span>
                                  <span className="text-[9px] font-black text-slate-400">{showItemPicker ? '▲' : '▼'}</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-10 h-10 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50 flex items-center justify-center shrink-0">
                                  <span className="text-lg text-amber-300">+</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-[10px] font-black uppercase text-slate-500">Sem item segurado</p>
                                  <p className="text-[8px] font-bold text-amber-400 uppercase italic">Toque para equipar</p>
                                </div>
                                <span className="text-[9px] font-black text-slate-400 shrink-0">{showItemPicker ? '▲' : '▼'}</span>
                              </>
                            )}
                          </button>

                          {/* Remove button — only when item equipped */}
                          {equippedItemData && !poke.onExpedition && (
                            <div className="px-4 pb-3 -mt-1">
                              <button
                                onClick={unequipHeldItem}
                                className="w-full bg-red-50 text-red-500 py-2 rounded-xl font-black text-[9px] uppercase hover:bg-red-100 transition-all active:scale-95 border border-red-100"
                              >Remover item</button>
                            </div>
                          )}

                          {/* Item picker — toggled */}
                          {showItemPicker && (
                            <div className="border-t border-amber-100 px-3 pb-3 pt-2 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                              {availableItems.length === 0 ? (
                                <p className="text-[8px] text-slate-400 font-bold text-center py-3 bg-white/50 rounded-xl">
                                  Nenhum item disponível — Forje na Estação de Forja
                                </p>
                              ) : (
                                availableItems.map(item => (
                                  <button
                                    key={item.id}
                                    onClick={() => { equipHeldItem(item.id); setShowItemPicker(false); }}
                                    className="w-full flex items-center gap-3 bg-white p-2.5 rounded-xl border border-amber-100 hover:border-amber-400 hover:bg-amber-50/40 transition-all text-left active:scale-[0.98] shadow-sm"
                                  >
                                    <img src={item.img} className="w-8 h-8 object-contain shrink-0" alt="" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[9px] font-black uppercase text-slate-700 leading-none truncate">{item.name}</p>
                                      <p className="text-[7px] font-bold text-slate-400 mt-0.5 uppercase leading-tight line-clamp-2">{item.effect || '---'}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                                      <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">Equipar</span>
                                      <span className="text-[7px] font-bold text-slate-400">x{gameState.inventory?.items?.[item.id] || 0}</span>
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* CANDIES */}
                    {(() => {
                      const poke = activePokemonDetails.pokemon;
                      const candyId = POKEMON_TO_CANDY[Number(poke.id)];
                      const candyData = candyId ? CANDY_FAMILIES[candyId] : null;
                      const inventoryCandies = gameState.inventory?.candies || {};
                      const currentCandyCount = candyData ? (inventoryCandies[candyId] || 0) : 0;
                      if (!candyData) return null;
                      return (
                        <div className="mt-2 rounded-3xl border-2 border-pokeBlue/20 bg-blue-50/30 overflow-hidden">
                          <button onClick={() => setCandyExpanded(!candyExpanded)} className="w-full min-h-[64px] flex items-center gap-3 p-4 text-left bg-white/70 active:scale-[0.99] transition-all">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 border-white" style={{ background: candyData.color }}>
                              <img src={getCandyIconUrl(candyData)} alt="" className="w-10 h-10 object-contain" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-black uppercase text-xs text-slate-800 leading-none">{candyData.name}</h4>
                              <p className="text-[10px] font-bold text-pokeBlue mt-1 uppercase tracking-wider">Disponível: {currentCandyCount}</p>
                            </div>
                            <span className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                              {candyExpanded ? '-' : '+'}
                            </span>
                          </button>
                          {candyExpanded && (
                            <div className="grid grid-cols-1 gap-2 p-4 pt-0">
                              {Object.values(CANDY_USES).map((use) => {
                                const canAfford = currentCandyCount >= use.cost;
                                return (
                                  <button key={use.id} onClick={() => handleUseCandy(poke.instanceId, candyId, use.id)} disabled={!canAfford} className={`min-h-[56px] flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${canAfford ? 'bg-white border-slate-100 hover:border-pokeBlue shadow-sm' : 'bg-slate-100 border-transparent opacity-60'}`}>
                                    <img src={use.icon} className="w-8 h-8 object-contain" alt="" />
                                    <div className="flex-1 text-left"><p className="text-[10px] font-black uppercase text-slate-700 leading-none">{use.name}</p></div>
                                    <p className={`text-[10px] font-black ${canAfford ? 'text-pokeBlue' : 'text-slate-400'}`}>{use.cost}</p>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* MOVESET MODERNIZADO */}
                  <div className="mt-7">
                    <h4 className="font-black uppercase text-[10px] text-slate-800 mb-3 flex items-center gap-2 leading-none">
                       <span className="bg-pokeBlue text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px] shrink-0">⚔</span>
                       <span className="leading-none">Golpes Atuais</span>
                    </h4>
                    <div className="space-y-2.5">
                      {activePokemonDetails.pokemon.moves.map((m, idx) => {
                        const moveData = getMoveData(m);
                        return (
                          <div
                            key={idx}
                            onClick={() => setMoveSwapMode({ activeIdx: idx, currentMove: m.name })}
                            className="min-h-[62px] bg-white border border-slate-100 rounded-2xl flex items-center gap-3 group transition-all hover:border-pokeBlue/30 hover:bg-blue-50/20 cursor-pointer shadow-sm relative overflow-hidden active:scale-95"
                            style={{ padding: '10px 12px 10px 14px' }}
                          >
                             <div className="w-1 bg-slate-200 absolute left-0 top-0 bottom-0 group-hover:bg-pokeBlue transition-colors"></div>
                             <div className="flex-1 min-w-0 text-left pl-1">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                   <span className="text-[11px] font-black text-slate-800 uppercase leading-tight break-words min-w-0">{getMoveLabel(m)}</span>
                                   <span className="px-1.5 py-0.5 rounded text-[7px] font-black text-white uppercase tracking-wider shrink-0" style={{ background: typeColorMap[moveData?.type] || '#64748b' }}>
                                      {moveData?.type || '???'}
                                   </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 opacity-70">
                                   {moveData?.power > 0 ? (
                                     <span className="text-[8px] font-black text-slate-500 uppercase whitespace-nowrap">Pwr: {moveData.power}</span>
                                   ) : (moveData?.category === 'Physical' || moveData?.category === 'Special' || moveData?.category === 'physical' || moveData?.category === 'special') ? (
                                     <span className="text-[8px] font-black text-red-500 uppercase whitespace-nowrap">Efeito: Dano</span>
                                   ) : (
                                     <span className="text-[8px] font-black text-purple-500 uppercase whitespace-nowrap">Efeito: Status</span>
                                   )}
                                   <span className="text-[8px] font-black text-slate-500 uppercase whitespace-nowrap">Acc: {moveData?.accuracy ? `${moveData.accuracy}%` : '-'}</span>
                                   <span className="text-[8px] font-black text-slate-500 uppercase whitespace-nowrap">PP: {moveData?.pp ?? '-'}</span>
                                </div>
                             </div>
                             <div className="flex flex-col items-center justify-center bg-slate-50 w-9 h-9 rounded-xl shrink-0 border border-slate-100">
                                <span className="text-[12px] leading-none">{moveData?.category === 'Physical' || moveData?.category === 'physical' ? '👊' : moveData?.category === 'Special' || moveData?.category === 'special' ? '✨' : '🛡'}</span>
                             </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MODAL DE TROCA DE GOLPES (OVERLAY LOCAL) */}
                  {moveSwapMode && createPortal((
                    <div className="fixed inset-0 z-[10000] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
                      <div className="w-full max-w-[360px] max-h-[min(82dvh,560px)] bg-slate-900 border border-white/10 shadow-2xl rounded-[1.5rem] overflow-hidden flex flex-col" style={{ backgroundColor: '#0f172a' }}>
                      <div className="flex justify-between items-start gap-3 border-b border-white/10 shrink-0" style={{ padding: '16px 16px 12px 24px' }}>
                        <div className="text-left min-w-0">
                          <h4 className="text-white font-black uppercase text-[13px] leading-none">Trocar Golpe</h4>
                          <p className="text-slate-400 text-[9px] font-bold uppercase mt-1 leading-tight">Novo golpe para o Slot {moveSwapMode.activeIdx + 1}</p>
                        </div>
                        <button onClick={() => setMoveSwapMode(null)} className="text-white bg-white/10 w-10 h-10 rounded-full font-black text-xs shrink-0 active:scale-95">x</button>
                      </div>

                      <div className="min-h-0 overflow-y-auto custom-scrollbar space-y-3" style={{ padding: '12px 12px 12px 20px', backgroundColor: '#0f172a' }}>
                        {(() => {
                          const learned = activePokemonDetails.pokemon.learnedMoves || activePokemonDetails.pokemon.moves || [];
                          const available = learned.filter(m => !activePokemonDetails.pokemon.moves.some(active => getMoveKey(active) === getMoveKey(m)));

                          // Adiciona opção de reordenar (golpes já ativos)
                          const currentActive = activePokemonDetails.pokemon.moves;
                          const rareMoves = (path?.rareMoves || []).map(rm => ({ ...rm, ...getMoveData(rm), name: rm.name }));

                          return (
                            <>
                              <div>
                                <p className="text-[9px] font-black text-pokeBlue uppercase mb-1.5 tracking-widest opacity-80">Reordenar Atuais</p>
                                <div className="grid grid-cols-1 gap-1.5">
                                  {currentActive.map((m, i) => {
                                    const mData = getMoveData(m);
                                    return (
                                      <button
                                        key={`active-${i}`}
                                        disabled={i === moveSwapMode.activeIdx}
                                        onClick={() => swapMove(moveSwapMode.activeIdx, m.name)}
                                        className={`min-h-11 px-3 py-2 rounded-xl border flex items-center justify-between gap-3 transition-all active:scale-[0.98] ${i === moveSwapMode.activeIdx ? 'border-pokeBlue bg-slate-800 opacity-60 grayscale' : 'border-white/10 bg-slate-800/95 hover:bg-slate-700'}`}
                                        style={{ padding: '8px 12px' }}
                                      >
                                        <div className="flex-1 min-w-0 text-left">
                                          <p className="text-white font-black uppercase text-[10px] leading-tight truncate">{getMoveLabel(m)}</p>
                                          <div className="flex gap-2 mt-1 opacity-70">
                                            {mData?.power > 0 ? (
                                              <span className="text-[7px] font-bold text-slate-300 uppercase">Pwr: {mData.power}</span>
                                            ) : (mData?.category === 'Physical' || mData?.category === 'Special' || mData?.category === 'physical' || mData?.category === 'special') ? (
                                              <span className="text-[7px] font-bold text-red-400 uppercase">Dano</span>
                                            ) : (
                                              <span className="text-[7px] font-bold text-purple-400 uppercase">Status</span>
                                            )}
                                            <span className="text-[7px] font-bold text-slate-300 uppercase">Acc: {mData?.accuracy || '-'}</span>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                          <span className="px-2 py-0.5 rounded bg-white/10 text-[7px] font-black text-white uppercase tracking-widest">{mData?.type || '???'}</span>
                                          <span className="text-slate-500 font-black text-[8px] uppercase">Slot {i + 1}</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div>
                                <p className="text-[9px] font-black text-pokeGold uppercase mb-1.5 tracking-widest opacity-80">Golpes Aprendidos</p>
                                {available.length === 0 ? (
                                  <p className="text-slate-500 text-[10px] font-bold italic py-2">Nenhum golpe adicional disponível...</p>
                                ) : (
                                  <div className="grid grid-cols-1 gap-1.5">
                                    {available.map((m, i) => {
                                      const mData = getMoveData(m);
                                      return (
                                        <button
                                          key={`learned-${i}`}
                                          onClick={() => swapMove(moveSwapMode.activeIdx, m.name)}
                                          className="min-h-11 px-3 py-2 rounded-xl border border-white/10 bg-slate-800/95 hover:bg-slate-700 hover:border-pokeGold/30 transition-all active:scale-[0.98] flex items-center gap-3 text-left group"
                                          style={{ padding: '8px 12px' }}
                                        >
                                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: typeColorMap[mData?.type] || '#64748b' }}></div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-white font-black uppercase text-[10px] leading-tight">{getMoveLabel(m)}</p>
                                            <div className="flex gap-3 mt-1 opacity-60">
                                              {mData?.power > 0 ? (
                                                <span className="text-[7px] font-bold text-slate-300 uppercase">Pwr: {mData.power}</span>
                                              ) : (mData?.category === 'Physical' || mData?.category === 'Special' || mData?.category === 'physical' || mData?.category === 'special') ? (
                                                <span className="text-[7px] font-bold text-red-400 uppercase">Dano</span>
                                              ) : (
                                                <span className="text-[7px] font-bold text-purple-400 uppercase">Status</span>
                                              )}
                                              <span className="text-[7px] font-bold text-slate-300 uppercase">Acc: {mData?.accuracy || '-'}</span>
                                            </div>
                                          </div>
                                          <div className="px-2 py-0.5 rounded bg-white/10 text-[7px] font-black text-white uppercase tracking-widest shrink-0">{mData?.type || '???'}</div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="text-[9px] font-black text-amber-300 uppercase mb-1.5 tracking-widest opacity-90">Ataques Raros</p>
                                {rareMoves.length === 0 ? (
                                  <p className="text-slate-500 text-[10px] font-bold italic py-2">Nenhum ataque raro catalogado.</p>
                                ) : (
                                  <div className="grid grid-cols-1 gap-1.5">
                                    {rareMoves.map((rm, i) => {
                                      const isUnlocked = masteryCount >= rm.level;
                                      const isEquipped = activePokemonDetails.pokemon.moves.some(active => getMoveKey(active) === getMoveKey(rm));
                                      return (
                                        <button
                                          key={`rare-${i}`}
                                          disabled={!isUnlocked || isEquipped}
                                          onClick={() => equipRareMove(rm)}
                                          className={`min-h-11 rounded-xl border flex items-center gap-3 text-left transition-all active:scale-[0.98] ${isEquipped ? 'border-amber-300/60 bg-amber-400/15' : isUnlocked ? 'border-amber-300/30 bg-slate-800/95 hover:bg-slate-700' : 'border-white/10 bg-slate-800/50 opacity-60 grayscale'}`}
                                          style={{ padding: '8px 12px' }}
                                        >
                                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: typeColorMap[rm?.type] || '#facc15' }}></div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-white font-black uppercase text-[10px] leading-tight truncate">{getMoveLabel(rm)}</p>
                                            <div className="flex gap-3 mt-1 opacity-70">
                                              {rm?.power > 0 ? (
                                                <span className="text-[7px] font-bold text-slate-300 uppercase">Pwr: {rm.power}</span>
                                              ) : (rm?.category === 'Physical' || rm?.category === 'Special' || rm?.category === 'physical' || rm?.category === 'special') ? (
                                                <span className="text-[7px] font-bold text-red-400 uppercase">Dano</span>
                                              ) : (
                                                <span className="text-[7px] font-bold text-purple-400 uppercase">Status</span>
                                              )}
                                              <span className="text-[7px] font-bold text-slate-300 uppercase">Acc: {rm?.accuracy || '-'}</span>
                                            </div>
                                          </div>
                                          <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className="px-2 py-0.5 rounded bg-white/10 text-[7px] font-black text-white uppercase tracking-widest">{rm?.type || '???'}</span>
                                            <span className="text-[7px] font-black uppercase text-slate-400">
                                              {isEquipped ? 'Equipado' : isUnlocked ? 'Equipar' : `Faltam ${rm.level - masteryCount}`}
                                            </span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <div className="px-4 py-2.5 border-t border-white/10 bg-slate-950/30 shrink-0">
                        <p className="text-[8px] text-slate-500 font-bold uppercase italic text-center">Dica: toque nos golpes ativos para reordenar.</p>
                      </div>
                      </div>
                    </div>
                  ), document.body)}

                  {/* GUIA DE EVOLUCAO */}
                  {(() => {
                    const poke = activePokemonDetails.pokemon;
                    const pokeData = POKEDEX[poke.id];
                    if (!pokeData?.evolution) {
                      return (
                        <div className="mt-8 border-t-2 border-slate-100 pt-6">
                          <h4 className="font-black uppercase text-[10px] text-slate-800 mb-4 flex items-center gap-2">
                             <span className="bg-pokeBlue text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px]">?</span>
                             Guia de Evolução
                          </h4>
                          <p className="text-xs font-bold text-slate-400 italic text-left px-2">Este Pokémon atingiu sua forma final.</p>
                        </div>
                      );
                    }

                    const evolutions = Array.isArray(pokeData.evolution) ? pokeData.evolution : [pokeData.evolution];
                    const currentTime = getTimeOfDay();

                    const stoneNames = { 
                      thunder_stone: 'Thunder Stone', moon_stone: 'Moon Stone', link_cable: 'Link Cable', 
                      fire_stone: 'Fire Stone', water_stone: 'Water Stone', leaf_stone: 'Leaf Stone',
                      sun_stone: 'Sun Stone', shiny_stone: 'Shiny Stone', dusk_stone: 'Dusk Stone', 
                      dawn_stone: 'Dawn Stone', ice_stone: 'Ice Stone'
                    };
                    const stoneIcons = {
                      thunder_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png',
                      moon_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png',
                      link_cable: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/up-grade.png',
                      fire_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png',
                      water_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png',
                      leaf_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png',
                      sun_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png',
                      shiny_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-stone.png',
                      dusk_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-stone.png',
                      dawn_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dawn-stone.png',
                      ice_stone: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ice-stone.png'
                    };

                    return (
                      <div className="mt-8 border-t-2 border-slate-100 pt-6">
                        <h4 className="font-black uppercase text-[10px] text-slate-800 mb-4 flex items-center gap-2">
                           <span className="bg-pokeBlue text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px]">?</span>
                           Guia de Evolução
                        </h4>
                        
                        <div className="flex flex-col gap-4">
                          {evolutions.map((evo, idx) => {
                            const targetData = POKEDEX[evo.id];
                            const isItemEvo = !!evo.item;
                            const hasItem = isItemEvo ? !!gameState.inventory?.items?.[evo.item] : false;
                            const levelMet = evo.level ? poke.level >= evo.level : true;
                            
                            // Time check
                            const timeMet = !evo.time || evo.time.includes(currentTime);
                            
                            const evolutionAllowed = !isEvolutionAllowedForRegion || isEvolutionAllowedForRegion(poke, evo.id, activeRegion || gameState.activeRegion || 'kanto');
                            
                            const evolutionLockText = !evolutionAllowed
                              ? (getEvolutionRegionLockMessage?.(poke.name, targetData?.name, activeRegion || gameState.activeRegion || 'kanto') || 'Evolucao bloqueada nesta regiao.')
                              : null;

                            const canEvolve = (isItemEvo ? hasItem : levelMet) && timeMet && evolutionAllowed;

                            return (
                              <div key={`${evo.id}-${idx}`} className={`p-4 rounded-2xl border-2 transition-all ${canEvolve ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
                                <div className="flex items-center gap-4">
                                  {/* Thumbnail */}
                                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`} className="w-10 h-10 object-contain" alt="Evo" />
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 text-left min-w-0">
                                    <p className="text-xs font-black text-slate-800 uppercase italic truncate">{targetData?.name || '???'}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {evo.level && (
                                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${levelMet ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                          Nível {evo.level}
                                        </span>
                                      )}
                                      {isItemEvo && (
                                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${hasItem ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                                          <img src={stoneIcons[evo.item]} className="w-3 h-3 object-contain" alt="" />
                                          {stoneNames[evo.item] || evo.item}
                                        </span>
                                      )}
                                      {evo.time && (
                                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${timeMet ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                                          {evo.time.join('/')}
                                        </span>
                                      )}
                                    </div>
                                    {evolutionLockText && (
                                      <p className="mt-1 text-[8px] font-black uppercase text-red-500">{evolutionLockText}</p>
                                    )}
                                  </div>

                                  {/* Action */}
                                  <div className="shrink-0">
                                    {isItemEvo ? (
                                      hasItem && evolutionAllowed && timeMet && (
                                        <button onClick={() => !activePokemonDetails.pokemon.onExpedition && handleStoneEvolution(evo.item, evo)} disabled={activePokemonDetails.pokemon.onExpedition} className="bg-amber-500 text-white font-black text-[9px] px-3 py-2 rounded-lg shadow-lg uppercase active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Usar Item</button>
                                      )
                                    ) : (
                                      levelMet && evolutionAllowed && timeMet && (
                                        <button 
                                          disabled={activePokemonDetails.pokemon.onExpedition}
                                          onClick={() => { 
                                            if (activePokemonDetails.pokemon.onExpedition) return;
                                            setActivePokemonDetails(null); 
                                            setEvolutionPending({ 
                                              ...poke, 
                                              targetEvolution: evo,
                                              teamIndex: activePokemonDetails.location === 'team' ? activePokemonDetails.index : null, 
                                              pcIndex: activePokemonDetails.location === 'pc' ? activePokemonDetails.index : null 
                                            }); 
                                          }} 
                                          className="bg-pokeBlue text-white font-black text-[9px] px-3 py-2 rounded-lg shadow-lg uppercase animate-pulse disabled:animate-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          Evoluir
                                        </button>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* ── MEGA EVOLUÇÃO ──────────────────────────────────────────── */}
                  {(() => {
                    const poke = activePokemonDetails.pokemon;
                    if (poke.isMega) {
                      return (
                        <div className="mt-6 border-t-2 border-slate-100 pt-6">
                          <h4 className="font-black uppercase text-[10px] text-slate-800 mb-3 flex items-center gap-2">
                            <span className="bg-purple-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px]">⚡</span>
                            Mega Evolução
                          </h4>
                          <div style={{ background: 'linear-gradient(135deg, #7c3aed15, #4f46e515)', borderRadius: 16, padding: 14, border: '1px solid #7c3aed30', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img
                              src={getMegaSprite(poke.megaFormId)}
                              onError={e => {
                                if (!e.target.dataset.triedBase) {
                                  e.target.dataset.triedBase = '1';
                                  e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.isShiny ? 'shiny/' : ''}${poke.id}.png`;
                                }
                              }}
                              style={{ width: 48, height: 48, objectFit: 'contain' }}
                              alt={poke.megaName}
                            />
                            <div>
                              <p style={{ fontWeight: 900, fontSize: 13, color: '#7c3aed', textTransform: 'uppercase', fontStyle: 'italic' }}>
                                {poke.megaName}
                              </p>
                              <p style={{ fontSize: 10, color: '#6d28d9', fontWeight: 700, marginTop: 2 }}>
                                ✅ Mega Evolução Permanente Ativa
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    const poke2 = activePokemonDetails.pokemon;
                    const compatibles = getCompatibleMegaStones(poke2.id);
                    if (compatibles.length === 0) return null;

                    const inventory = gameState?.inventory?.items || {};
                    const hasAnyStone = compatibles.some(m => (inventory[m.stoneId] || 0) > 0);

                    return (
                      <div className="mt-6 border-t-2 border-slate-100 pt-6">
                        <h4 className="font-black uppercase text-[10px] text-slate-800 mb-3 flex items-center gap-2">
                          <span className="bg-purple-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[8px]">⚡</span>
                          Mega Evolução Disponível!
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {compatibles.map(({ stoneId, name, megaFormId, types }) => {
                            const stoneCount = inventory[stoneId] || 0;
                            return (
                              <div key={stoneId} style={{
                                background: stoneCount > 0 ? 'linear-gradient(135deg, #7c3aed15, #4f46e510)' : '#f8fafc',
                                borderRadius: 14, padding: '10px 14px', border: stoneCount > 0 ? '1px solid #7c3aed30' : '1px solid #e2e8f0',
                                display: 'flex', alignItems: 'center', gap: 10,
                              }}>
                                <img
                                  src={getMegaSprite(megaFormId)}
                                  onError={e => {
                                    if (!e.target.dataset.triedBase) {
                                      e.target.dataset.triedBase = '1';
                                      e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke2.isShiny ? 'shiny/' : ''}${poke2.id}.png`;
                                    }
                                  }}
                                  style={{ width: 36, height: 36, objectFit: 'contain', opacity: stoneCount > 0 ? 1 : 0.3 }}
                                  alt={name}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontWeight: 900, fontSize: 11, color: stoneCount > 0 ? '#7c3aed' : '#94a3b8', textTransform: 'uppercase', fontStyle: 'italic' }}>{name}</p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                    {MEGA_STONE_ICONS[stoneId] && <img src={MEGA_STONE_ICONS[stoneId]} style={{ width: 12, height: 12 }} alt="" />}
                                    <span style={{ fontSize: 9, fontWeight: 700, color: stoneCount > 0 ? '#d97706' : '#94a3b8' }}>
                                      {stoneCount > 0 ? `Pedra disponível (${stoneCount}x)` : 'Pedra necessária'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <button
                            onClick={() => {
                              if (setMegaEvolutionPending) setMegaEvolutionPending(true);
                              setActivePokemonDetails(null);
                            }}
                            disabled={!hasAnyStone}
                            style={{
                              background: hasAnyStone ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : '#e2e8f0',
                              color: hasAnyStone ? '#fff' : '#94a3b8',
                              border: 'none', borderRadius: 12, padding: '12px 0',
                              fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                              cursor: hasAnyStone ? 'pointer' : 'not-allowed',
                              boxShadow: hasAnyStone ? '0 4px 16px rgba(124,58,237,0.35)' : 'none',
                            }}
                          >
                            ⚡ {hasAnyStone ? 'Abrir Tela de Mega Evolução' : 'Pedra Necessária'}
                          </button>
                        </div>
                      </div>
                    );
                  })()}
               </div>

               {/* FOOTER - TEAM MOVER */}
               <div className="flex-shrink-0 px-5 pt-3 pb-6 bg-white border-t border-slate-100 flex flex-col gap-3">
                  {activePokemonDetails.location === 'team' ? (
                    <div className="flex flex-col gap-3">
                      {showTeamReorder && (
                        <div className="animate-slideInUp bg-slate-50 p-4 rounded-[2rem] border-2 border-slate-100 mb-2">
                           <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Mudar posição no time</p>
                           <div className="grid grid-cols-3 gap-2">
                             {gameState.team.map((teamPoke, slotIndex) => {
                               const isCurrent = slotIndex === activePokemonDetails.index;
                               return (
                                 <button
                                   key={teamPoke.instanceId || slotIndex}
                                   type="button"
                                   onClick={() => { moveToTeamPosition(slotIndex); setShowTeamReorder(false); }}
                                   className={`relative h-16 rounded-2xl border-2 transition-all flex items-center justify-center ${isCurrent ? 'border-pokeBlue bg-blue-50/50 shadow-inner' : 'border-white bg-white shadow-sm hover:border-pokeBlue/30 active:scale-95'}`}
                                 >
                                   <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${teamPoke.isShiny ? 'shiny/' : ''}${teamPoke.id}.png`} className={`w-10 h-10 object-contain ${isCurrent ? 'opacity-100' : 'opacity-40'}`} alt="" />
                                   <span className={`absolute bottom-1 right-2 text-[8px] font-black uppercase ${isCurrent ? 'text-pokeBlue' : 'text-slate-300'}`}>P{slotIndex + 1}</span>
                                 </button>
                               );
                             })}
                           </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button onClick={() => setShowTeamReorder(!showTeamReorder)} className={`flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${showTeamReorder ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-600 border-2 border-slate-100 hover:border-pokeBlue'}`}>
                           <span>{showTeamReorder ? '✕ Fechar' : '⇄ Mudar Posição'}</span>
                        </button>
                        <button onClick={() => { if (!activePokemonDetails.pokemon.onExpedition) { moveToPC(activePokemonDetails.pokemon?.instanceId); setActivePokemonDetails(null); } }} disabled={activePokemonDetails.pokemon.onExpedition} className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Enviar p/ PC</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { if (!activePokemonDetails.pokemon.onExpedition) moveToTeam(activePokemonDetails.index, activePokemonDetails.pokemon?.instanceId); }} disabled={activePokemonDetails.pokemon.onExpedition} className="w-full h-14 bg-gradient-to-r from-pokeBlue to-blue-600 text-white rounded-2xl shadow-lg flex items-center justify-center gap-3 font-black uppercase text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Adicionar ao Time</button>
                  )}
               </div>
            </div>
         </div>
      ), document.body)}

      {/* ── Modal de Natureza ─────────────────────────────────── */}
      {showNatureModal && activePokemonDetails && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowNatureModal(false)}>
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[88dvh] flex flex-col"
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 shrink-0"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
              <div className="flex-1">
                <p className="text-white/70 text-[9px] font-black uppercase tracking-widest">Treinamento Avançado</p>
                <h2 className="text-white text-lg font-black uppercase">Natureza</h2>
              </div>
              <button onClick={() => setShowNatureModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 text-white font-black flex items-center justify-center">✕</button>
            </div>

            {/* Info box */}
            <div className="px-5 pt-4 pb-2 shrink-0 bg-blue-50 border-b border-blue-100">
              <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                A <strong>Natureza</strong> define bônus e penalidade de uma estatística. Cada natureza aumenta um stat em <strong className="text-emerald-600">+10%</strong> e reduz outro em <strong className="text-red-500">-10%</strong>. Novas naturezas são desbloqueadas a cada 5 capturas desta espécie.
              </p>
              {(() => {
                const nat = activePokemonDetails.pokemon.equippedNature;
                if (!nat) return null;
                const mods = NATURES[nat];
                if (!mods) return null;
                return (
                  <div className="mt-2 flex items-center gap-2 bg-white rounded-xl p-2 border border-blue-200">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Atual:</span>
                    <span className="font-black text-slate-800 text-sm">{nat}</span>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+{STAT_LABELS[mods.plus]}</span>
                    <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full">-{STAT_LABELS[mods.minus]}</span>
                  </div>
                );
              })()}
            </div>

            {/* Lista de naturezas */}
            <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-2">
              {/* Neutro */}
              <button
                onClick={() => { equipNature(''); setShowNatureModal(false); }}
                disabled={activePokemonDetails.pokemon.onExpedition}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all active:scale-[0.98] text-left
                  ${!activePokemonDetails.pokemon.equippedNature ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <div className="flex-1">
                  <p className="font-black text-slate-800 text-sm">Padrão (Neutro)</p>
                  <p className="text-[9px] font-bold text-slate-400">Sem bônus ou penalidades</p>
                </div>
                {!activePokemonDetails.pokemon.equippedNature && (
                  <span className="text-[9px] font-black text-blue-600 bg-blue-100 px-2 py-1 rounded-full">✓ Ativo</span>
                )}
              </button>

              {NATURE_LIST.map((name, i) => {
                const mods = NATURES[name];
                const unlocked = masteryCount >= (i + 1) * 5;
                const isActive = activePokemonDetails.pokemon.equippedNature === name;
                return (
                  <button
                    key={name}
                    onClick={() => { if (unlocked && !activePokemonDetails.pokemon.onExpedition) { equipNature(name); setShowNatureModal(false); } }}
                    disabled={!unlocked || activePokemonDetails.pokemon.onExpedition}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left
                      ${isActive ? 'border-blue-500 bg-blue-50' : unlocked ? 'border-slate-200 bg-white hover:border-blue-300 active:scale-[0.98]' : 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-black text-sm ${unlocked ? 'text-slate-800' : 'text-slate-400'}`}>{name}</p>
                        {unlocked ? (
                          <>
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">+{STAT_LABELS[mods.plus]}</span>
                            <span className="text-[9px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">-{STAT_LABELS[mods.minus]}</span>
                          </>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400">🔒 Desbloqueia com {(i + 1) * 5} capturas</span>
                        )}
                      </div>
                    </div>
                    {isActive && <span className="text-[9px] font-black text-blue-600 bg-blue-100 px-2 py-1 rounded-full shrink-0">✓ Ativo</span>}
                  </button>
                );
              })}
            </div>

            <div className="px-5 py-4 border-t border-slate-100 shrink-0">
              <p className="text-[10px] font-bold text-slate-400 text-center">
                {Math.floor(masteryCount / 5)} de {NATURE_LIST.length} naturezas desbloqueadas ({masteryCount} capturas)
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Modal de Habilidade ───────────────────────────────── */}
      {showAbilityModal && activePokemonDetails && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowAbilityModal(false)}>
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[88dvh] flex flex-col"
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 shrink-0"
              style={{ background: 'linear-gradient(135deg,#6d28d9,#8b5cf6)' }}>
              <div className="flex-1">
                <p className="text-white/70 text-[9px] font-black uppercase tracking-widest">Treinamento Avançado</p>
                <h2 className="text-white text-lg font-black uppercase">Habilidade</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-xl px-3 py-1.5">
                  <p className="text-white text-[10px] font-black">{(gameState.inventory?.items?.[ABILITY_ITEM_ID] || 0)} cápsulas</p>
                </div>
                <button onClick={() => setShowAbilityModal(false)}
                  className="w-8 h-8 rounded-full bg-white/20 text-white font-black flex items-center justify-center">✕</button>
              </div>
            </div>

            {/* Info box */}
            <div className="px-5 pt-4 pb-2 shrink-0 bg-violet-50 border-b border-violet-100">
              <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                A <strong>Habilidade</strong> define um efeito passivo único em batalha. Para trocar, você precisa de <strong>1 Cápsula de Habilidade</strong>. A habilidade é atribuída aleatoriamente na captura.
              </p>
            </div>

            {/* Lista de habilidades */}
            <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-2">
              {getPokemonAbilityPool(POKEDEX[activePokemonDetails.pokemon.id] || activePokemonDetails.pokemon).map((ability) => {
                const isActive = (activePokemonDetails.pokemon.ability || '') === ability;
                const canSwitch = !isActive && (gameState.inventory?.items?.[ABILITY_ITEM_ID] || 0) > 0 && !activePokemonDetails.pokemon.onExpedition;
                const desc = ABILITY_DESCRIPTIONS[ability];
                return (
                  <button
                    key={ability}
                    onClick={() => { if (canSwitch) { changeAbility(ability); setShowAbilityModal(false); } }}
                    disabled={isActive || (!canSwitch)}
                    className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left
                      ${isActive ? 'border-violet-500 bg-violet-50' : canSwitch ? 'border-slate-200 bg-white hover:border-violet-300 active:scale-[0.98]' : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-black text-slate-800 text-sm">{ability}</p>
                        {isActive && <span className="text-[9px] font-black text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">✓ Ativa</span>}
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                        {desc || 'Habilidade especial deste Pokémon.'}
                      </p>
                    </div>
                    {!isActive && canSwitch && (
                      <div className="shrink-0 bg-violet-600 text-white text-[9px] font-black px-2 py-1 rounded-lg mt-0.5">
                        1 💊
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {(gameState.inventory?.items?.[ABILITY_ITEM_ID] || 0) === 0 && (
              <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 shrink-0">
                <p className="text-[10px] font-bold text-amber-700 text-center">
                  ⚠️ Você não tem Cápsulas de Habilidade. Encontre-as em Raids!
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default PokemonManagement;

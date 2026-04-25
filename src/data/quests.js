export const QUESTS = {
  capture_starter: {
    id: 'capture_starter',
    flag: 'quest_capture_active',
    doneFlag: 'quest_capture_done',
    title: 'Primeira Captura',
    desc: 'Capture seu primeiro parceiro na Rota 1 para mostrar ao Prof. Carvalho que você está pronto!',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    reward: '10x Pokébolas',
    check: (gameState) => {
      // Esta checagem é feita manualmente no handleUseItem no momento
      return false; 
    }
  }
};

export const getActiveQuest = (worldFlags) => {
  if (worldFlags.includes('quest_capture_active')) return QUESTS.capture_starter;
  return null;
};

export const updateQuestProgress = (prev, type, payload) => {
  let questUpdate = {};
  const newFlags = [...(prev.worldFlags || [])];
  const newInventory = { ...prev.inventory, items: { ...prev.inventory.items } };
  let log = null;

  if (type === 'capture' && newFlags.includes('quest_capture_active')) {
    newInventory.items.pokeballs = (newInventory.items.pokeballs || 0) + 10;
    log = '🎁 Carvalho: "Ótimo trabalho! Tome estas 10 Pokébolas!"';
    questUpdate = { 
      worldFlags: newFlags.filter(f => f !== 'quest_capture_active').concat(['quest_capture_done']),
      inventory: newInventory
    };
  }

  return { questUpdate, log };
};

export const getAvailableQuest = (gameState, currentRoute, lastQuestTime) => {
  // Só libera novas quests após concluir o tutorial do Carvalho
  if (!(gameState.worldFlags || []).includes('quest_capture_done')) return null;
  
  const now = Date.now();
  const cooldown = 5 * 60 * 1000; // 5 minutos entre quests
  if (lastQuestTime && (now - lastQuestTime < cooldown)) return null;

  // Lógica simples: 20% de chance de spawnar uma quest ao entrar em rota de farm
  if (Math.random() > 0.2) return null;

  return {
    id: 'bounty_' + now,
    title: 'Missão de Exploração',
    desc: 'Um pesquisador local precisa de dados sobre os Pokémon desta rota. Capture ou vença 5 Pokémon para ajudar!',
    reward: '1000 Moedas',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png'
  };
};

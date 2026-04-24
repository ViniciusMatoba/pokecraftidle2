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

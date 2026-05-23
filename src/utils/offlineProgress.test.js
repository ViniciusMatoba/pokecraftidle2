import { describe, it, expect, vi } from 'vitest';
import { calculateOfflineProgress, applyOfflineProgress, formatOfflineTime } from './offlineProgress';
import { DEFAULT_GAME_STATE } from '../data/constants';

describe('offlineProgress - Sistema de Progresso Offline', () => {
  // Rota de farm mockada para os testes
  const mockRoutes = {
    pallet_town_farm: {
      id: 'pallet_town_farm',
      name: 'Rota de Farm Inicial',
      type: 'farm',
      enemies: [
        { id: 16, name: 'Pidgey', level: 5, maxHp: 50 }
      ],
      requirements: []
    }
  };

  it('deve retornar null se o tempo offline for menor que o mínimo (1 minuto)', () => {
    const gameState = {
      ...DEFAULT_GAME_STATE,
      playerStats: {
        ...DEFAULT_GAME_STATE.playerStats,
        lastSeenAt: Date.now() - 30 * 1000 // 30 segundos
      },
      currentRoute: 'pallet_town_farm'
    };

    const progress = calculateOfflineProgress(gameState, mockRoutes, 30 * 1000);
    expect(progress).toBeNull();
  });

  it('deve calcular corretamente o progresso offline de 1 hora', () => {
    const oneHourMs = 60 * 60 * 1000;
    const gameState = {
      ...DEFAULT_GAME_STATE,
      playerStats: {
        ...DEFAULT_GAME_STATE.playerStats,
        lastSeenAt: Date.now() - oneHourMs
      },
      team: [
        { instanceId: 'p1', id: 1, name: 'Bulbasaur', level: 5, xp: 0 }
      ],
      currentRoute: 'pallet_town_farm'
    };

    const progress = calculateOfflineProgress(gameState, mockRoutes, oneHourMs);
    
    expect(progress).toBeDefined();
    expect(progress).not.toBeNull();
    expect(progress.battles).toBeGreaterThan(0);
    expect(progress.xp).toBeGreaterThan(0);
    expect(progress.coins).toBeGreaterThan(0);
    expect(progress.routeId).toBe('pallet_town_farm');
    expect(progress.teamProgress[0].xpGained).toBeGreaterThan(0);
  });

  it('deve aplicar o teto (cap) de 12 horas para tempos offline muito longos', () => {
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    
    const gameState = {
      ...DEFAULT_GAME_STATE,
      playerStats: {
        ...DEFAULT_GAME_STATE.playerStats,
        lastSeenAt: Date.now() - twentyFourHoursMs
      },
      team: [
        { instanceId: 'p1', id: 1, name: 'Bulbasaur', level: 5, xp: 0 }
      ],
      currentRoute: 'pallet_town_farm'
    };

    const progressTwelve = calculateOfflineProgress(gameState, mockRoutes, twelveHoursMs);
    const progressTwentyFour = calculateOfflineProgress(gameState, mockRoutes, twentyFourHoursMs);

    expect(progressTwelve).toBeDefined();
    expect(progressTwentyFour).toBeDefined();
    
    // Devem ser idênticos devido ao cap de 12 horas!
    expect(progressTwentyFour.cappedMs).toBe(twelveHoursMs);
    expect(progressTwentyFour.battles).toBe(progressTwelve.battles);
    expect(progressTwentyFour.xp).toBe(progressTwelve.xp);
    expect(progressTwentyFour.coins).toBe(progressTwelve.coins);
  });

  it('deve aplicar as moedas, XP e materiais obtidos ao estado do jogo', () => {
    const gameState = {
      ...DEFAULT_GAME_STATE,
      currency: 100,
      team: [
        { instanceId: 'p1', id: 1, name: 'Bulbasaur', level: 5, xp: 0 }
      ],
      inventory: {
        materials: { normal_essence: 10 },
        items: {},
        candies: {}
      }
    };

    const mockProgress = {
      coins: 50,
      materials: { normal_essence: 5, fire_essence: 2 },
      teamProgress: [
        { instanceId: 'p1', startLevel: 5, newLevel: 6, newXp: 20 }
      ],
      captures: []
    };

    const updatedState = applyOfflineProgress(gameState, mockProgress);
    
    // Moedas aplicadas
    expect(updatedState.currency).toBe(150);
    // XP e Nível aplicados
    expect(updatedState.team[0].level).toBe(6);
    expect(updatedState.team[0].xp).toBe(20);
    // Materiais somados
    expect(updatedState.inventory.materials.normal_essence).toBe(15);
    expect(updatedState.inventory.materials.fire_essence).toBe(2);
  });

  it('deve formatar o tempo offline legivelmente', () => {
    expect(formatOfflineTime(15 * 60 * 1000)).toBe('15 min');
    expect(formatOfflineTime(2 * 60 * 60 * 1000 + 30 * 60 * 1000)).toBe('2h 30min');
  });
});

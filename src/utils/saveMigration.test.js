import { describe, it, expect } from 'vitest';
import { migrateGameState, auditGameState } from './saveMigration';
import { DEFAULT_GAME_STATE } from '../data/constants';

describe('saveMigration - Sistema de Migração de Save', () => {
  it('deve migrar estado nulo ou vazio para DEFAULT_GAME_STATE', () => {
    const migrated = migrateGameState(null);
    expect(migrated).toBeDefined();
    expect(migrated.currency).toBe(DEFAULT_GAME_STATE.currency);
    expect(migrated.activeRegion).toBe(DEFAULT_GAME_STATE.activeRegion);
    expect(migrated.settings).toEqual(DEFAULT_GAME_STATE.settings);
    expect(migrated.team).toEqual(DEFAULT_GAME_STATE.team);
  });

  it('deve migrar estados legados preservando valores originais e convertendo chaves camelCase antigas', () => {
    const legacy = {
      currency: 1250,
      activeRegion: 'johto',
      team: [
        { id: 152, name: 'Chikorita', level: 12, xp: 50, types: ['Normal'] } // types incorretos
      ],
      regionalTeams: {
        kanto: [{ id: 25, name: 'Pikachu', level: 5 }]
      },
      regionalPc: {
        kanto: [{ id: 4, name: 'Charmander', level: 5 }]
      }
    };
    
    const migrated = migrateGameState(legacy);
    
    // Verifica preservação e conversão
    expect(migrated.currency).toBe(1250);
    expect(migrated.activeRegion).toBe('johto');
    expect(migrated.team[0].name).toBe('Chikorita');
    
    // Deve normalizar types a partir da Pokedex
    expect(migrated.team[0].types).toEqual(['Grass']);
    
    // Deve mapear camelCase antigo regionalTeams -> regional_teams
    expect(migrated.regional_teams.kanto[0].name).toBe('Pikachu');
    expect(migrated.regional_pc.kanto[0].name).toBe('Charmander');
    
    // Chaves antigas deletadas
    expect(migrated.regionalTeams).toBeUndefined();
    expect(migrated.regionalPc).toBeUndefined();
  });

  it('deve ser idempotente (migrar duas vezes deve manter os dados de gameplay idênticos)', () => {
    const legacy = {
      currency: 500,
      team: [{ id: 4, name: 'Charmander', level: 10 }]
    };
    
    const firstMigration = migrateGameState(legacy);
    const secondMigration = migrateGameState(firstMigration);
    
    // Compara campos de gameplay
    expect(secondMigration.currency).toBe(firstMigration.currency);
    expect(secondMigration.team).toEqual(firstMigration.team);
    expect(secondMigration.pc).toEqual(firstMigration.pc);
    expect(secondMigration.regional_teams).toEqual(firstMigration.regional_teams);
    expect(secondMigration.inventory).toEqual(firstMigration.inventory);
    
    // E a auditoria do segundo deve ser 100% OK
    expect(secondMigration.migrationAudit.ok).toBe(true);
    expect(secondMigration.migrationAudit.issues).toEqual([]);
  });

  it('deve auditar um estado de jogo e identificar discrepâncias', () => {
    const invalidState = {
      currency: 100,
      // Faltando speciesMastery, caughtData, etc.
    };
    
    const audit = auditGameState(invalidState);
    expect(audit.ok).toBe(false);
    expect(audit.issues.length).toBeGreaterThan(0);
    expect(audit.issues).toContain('speciesMastery ausente reparado');
  });

  it('deve aprovar um estado de jogo válido na auditoria', () => {
    const validState = migrateGameState({ currency: 100 });
    const audit = auditGameState(validState);
    expect(audit.ok).toBe(true);
  });
});

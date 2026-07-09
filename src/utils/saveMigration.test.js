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

  // ── Fix 1.1 — prestige.purchasedTitles ─────────────────────────────────────
  it('garante prestige.purchasedTitles como array mesmo em saves antigos sem o campo', () => {
    const oldSave = { prestige: { trophies: ['trophy_kanto'] } }; // sem purchasedTitles
    const migrated = migrateGameState(oldSave);
    expect(Array.isArray(migrated.prestige.purchasedTitles)).toBe(true);
    expect(migrated.prestige.trophies).toContain('trophy_kanto'); // preserva o que tinha
  });

  it('preserva purchasedTitles existente em saves já migrados', () => {
    const modernSave = { prestige: { purchasedTitles: ['title_ace', 'title_hero'] } };
    const migrated = migrateGameState(modernSave);
    expect(migrated.prestige.purchasedTitles).toEqual(['title_ace', 'title_hero']);
  });

  // ── Fix 1.2 — tower deep merge ──────────────────────────────────────────────
  it('garante tower com todos os campos padrão mesmo para saves sem tower', () => {
    const noTower = { currency: 100 };
    const migrated = migrateGameState(noTower);
    expect(migrated.tower).toBeDefined();
    expect(migrated.tower.activeRun).toBe(null);
    expect(migrated.tower.highestFloor).toBe(0);
    expect(migrated.tower.bp).toBe(0);
    expect(typeof migrated.tower.upgrades).toBe('object');
  });

  it('faz deep merge de tower parcial — não perde highestFloor e bp ao ter activeRun', () => {
    const partialTower = {
      tower: { activeRun: { floor: 5, team: [] } } // sem highestFloor nem bp
    };
    const migrated = migrateGameState(partialTower);
    expect(migrated.tower.activeRun).toBeDefined();
    expect(migrated.tower.highestFloor).toBe(0);  // default preenchido
    expect(migrated.tower.bp).toBe(0);            // default preenchido
  });

  it('preserva highestFloor e bp de saves que já têm esses campos', () => {
    const completeTower = {
      tower: { activeRun: null, highestFloor: 42, bp: 500, upgrades: { xp: 1 } }
    };
    const migrated = migrateGameState(completeTower);
    expect(migrated.tower.highestFloor).toBe(42);
    expect(migrated.tower.bp).toBe(500);
    expect(migrated.tower.upgrades.xp).toBe(1);
  });

  // ── Fix 1.3 — capturedRegion normalization ──────────────────────────────────
  it('preenche capturedRegion de Pokémon antigos sem o campo via Pokédex', () => {
    const oldSave = {
      team: [
        { id: 25, name: 'Pikachu', level: 10 },    // Kanto, sem capturedRegion
        { id: 152, name: 'Chikorita', level: 5 },   // Johto, sem capturedRegion
      ],
    };
    const migrated = migrateGameState(oldSave);
    expect(migrated.team[0].capturedRegion).toBe('kanto');
    expect(migrated.team[1].capturedRegion).toBe('johto');
  });

  it('preserva capturedRegion existente em Pokémon já migrados', () => {
    const modernSave = {
      team: [{ id: 25, name: 'Pikachu', level: 10, capturedRegion: 'johto' }],
    };
    const migrated = migrateGameState(modernSave);
    // capturedRegion explícita deve ser preservada (pode ter sido capturado em rota de Johto)
    expect(migrated.team[0].capturedRegion).toBe('johto');
  });

  // ── clampPokemonStats — proteção contra saves adulterados ────────────────────
  it('clamp: normaliza level fora dos limites (1-100)', () => {
    const corrupted = { team: [{ id: 1, level: 999, hp: 50, maxHp: 100 }] };
    const migrated = migrateGameState(corrupted);
    expect(migrated.team[0].level).toBe(100);

    const negLevel = { team: [{ id: 1, level: -5, hp: 50, maxHp: 100 }] };
    const migrated2 = migrateGameState(negLevel);
    expect(migrated2.team[0].level).toBe(1);
  });

  it('clamp: hp nunca excede maxHp', () => {
    const corrupted = { team: [{ id: 1, level: 5, hp: 9999, maxHp: 100 }] };
    const migrated = migrateGameState(corrupted);
    expect(migrated.team[0].hp).toBeLessThanOrEqual(migrated.team[0].maxHp);
  });

  it('clamp: currency nunca fica negativa', () => {
    const corrupted = { currency: -50000 };
    const migrated = migrateGameState(corrupted);
    expect(migrated.currency).toBe(0);
  });

  it('formas regionais preservam tipos próprios ao migrar (não usa tipos do Pokédex base)', () => {
    // Ninetales-Alola (id=38) deve ter Ice/Fairy, não Fire como o Ninetales base
    const save = {
      team: [
        { id: 38, name: 'Ninetales Alola', level: 30, formKey: 'ninetales-alola', isRegionalForm: true, types: ['Ice', 'Fairy'] }
      ],
      pc: [
        { id: 37, name: 'Vulpix Alola', level: 15, formKey: 'vulpix-alola', isRegionalForm: true, types: ['Ice'] },
        // Simula save corrompido onde types foram sobrescritos pelo dex base
        { id: 20, name: 'Raticate Alola', level: 25, formKey: 'raticate-alola', isRegionalForm: true, types: ['Normal'] }
      ]
    };
    const migrated = migrateGameState(save);
    // Ninetales-Alola: Ice/Fairy (não Fire)
    expect(migrated.team[0].types).toEqual(['Ice', 'Fairy']);
    // Vulpix-Alola: Ice (não Fire)
    expect(migrated.pc[0].types).toEqual(['Ice']);
    // Raticate-Alola: deve ser restaurado para Dark/Normal (estava com Normal corrompido)
    expect(migrated.pc[1].types).toEqual(['Dark', 'Normal']);
  });

  it('formas regionais e formas base com mesmo id coexistem no PC', () => {
    // Ninetales (base) e Ninetales-Alola devem ser tratados como Pokémon distintos
    const save = {
      pc: [
        { id: 38, name: 'Ninetales', level: 40, types: ['Fire'], instanceId: 'base-001' },
        { id: 38, name: 'Ninetales Alola', level: 35, formKey: 'ninetales-alola', isRegionalForm: true, types: ['Ice', 'Fairy'], instanceId: 'alola-001' }
      ]
    };
    const migrated = migrateGameState(save);
    expect(migrated.pc).toHaveLength(2);
    // Base form mantém Fire
    const base = migrated.pc.find(p => !p.formKey);
    const regional = migrated.pc.find(p => p.formKey === 'ninetales-alola');
    expect(base.types).toEqual(['Fire']);
    expect(regional.types).toEqual(['Ice', 'Fairy']);
  });

  it('limpa metadados de formas regionais obsoletas ou corrompidas de capturas em Kanto', () => {
    const save = {
      team: [
        { id: 19, name: 'Rattata Alola', level: 5, formKey: 'rattata-alola', isRegionalForm: true, formSpriteId: 10091, capturedRegion: 'kanto' }
      ],
      pc: [
        // Rattata legítimo de Alola (capturado em Alola)
        { id: 19, name: 'Rattata Alola', level: 12, formKey: 'rattata-alola', isRegionalForm: true, formSpriteId: 10091, capturedRegion: 'alola' },
        // Rattata corrompido em Kanto no PC (deve ser limpo)
        { id: 19, name: 'Rattata Alola', level: 10, formKey: 'rattata-alola', isRegionalForm: true, formSpriteId: 10091, capturedRegion: 'kanto' },
        // Rattata sem capturedRegion (legado, deve ser mantido como Alola para compatibilidade)
        { id: 19, name: 'Rattata Alola', level: 8, formKey: 'rattata-alola', isRegionalForm: true, formSpriteId: 10091 }
      ]
    };

    const migrated = migrateGameState(save);
    
    // O primeiro Rattata (capturado em Kanto) deve ser limpo e virar Rattata comum de Kanto
    const kantoRattata = migrated.team[0];
    expect(kantoRattata.formKey).toBeUndefined();
    expect(kantoRattata.isRegionalForm).toBeUndefined();
    expect(kantoRattata.formSpriteId).toBeUndefined();
    expect(kantoRattata.name).toBe('Rattata');
    expect(kantoRattata.types).toEqual(['Normal']);

    // O segundo Rattata (capturado em Alola) deve continuar sendo de Alola
    const alolaRattata = migrated.pc[0];
    expect(alolaRattata.formKey).toBe('rattata-alola');
    expect(alolaRattata.isRegionalForm).toBe(true);
    expect(alolaRattata.formSpriteId).toBe(10091);
    expect(alolaRattata.name).toBe('Rattata Alola');

    // O terceiro Rattata (capturado em Kanto) deve ser limpo
    const kantoRattataPc = migrated.pc[1];
    expect(kantoRattataPc.formKey).toBeUndefined();
    expect(kantoRattataPc.name).toBe('Rattata');

    // O quarto Rattata (sem capturedRegion, resolve para Kanto no final, mas mantém Alola por retrocompatibilidade)
    const legacyRattata = migrated.pc[2];
    expect(legacyRattata.formKey).toBe('rattata-alola');
    expect(legacyRattata.isRegionalForm).toBe(true);
  });
});

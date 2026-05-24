import { describe, expect, it } from 'vitest';
import { POKEDEX } from '../data/pokedex';
import {
  getEvolutionMetadata,
  getPokemonEvolutionOptions,
  isEvolutionOptionAllowedInRegion,
} from '../data/regionalEvolutions';
import { isPokemonAllowedInRegion } from '../data/regionStandards';

describe('regionalEvolutions - Hisui starters', () => {
  it('adiciona Typhlosion Hisui como opcao regional de Quilava', () => {
    const options = getPokemonEvolutionOptions({ id: 156 });
    expect(options.map(option => option.id)).toContain(157);
    expect(options.map(option => option.id)).toContain(20157);
    expect(options.find(option => option.id === 20157)).toMatchObject({
      formRegion: 'hisui',
      formKey: 'typhlosion-hisui',
      isRegionalForm: true,
    });
  });

  it('adiciona Samurott Hisui e Decidueye Hisui como formas regionais', () => {
    expect(getPokemonEvolutionOptions({ id: 502 }).find(option => option.id === 10236)).toMatchObject({
      formRegion: 'hisui',
      formKey: 'samurott-hisui',
    });
    expect(getPokemonEvolutionOptions({ id: 723 }).find(option => option.id === 10244)).toMatchObject({
      formRegion: 'hisui',
      formKey: 'decidueye-hisui',
    });
  });

  it('permite forma Hisui apenas na regiao de Hisui', () => {
    const hisuiTyphlosion = getPokemonEvolutionOptions({ id: 156 }).find(option => option.id === 20157);
    expect(isEvolutionOptionAllowedInRegion(hisuiTyphlosion, 'hisui', isPokemonAllowedInRegion)).toBe(true);
    expect(isEvolutionOptionAllowedInRegion(hisuiTyphlosion, 'johto', isPokemonAllowedInRegion)).toBe(false);
  });

  it('mantem evolucao normal disponivel em Johto', () => {
    const normalTyphlosion = getPokemonEvolutionOptions({ id: 156 }).find(option => option.id === 157);
    expect(isEvolutionOptionAllowedInRegion(normalTyphlosion, 'johto', isPokemonAllowedInRegion)).toBe(true);
  });

  it('preserva metadados que a tela de evolucao deve aplicar no Pokemon final', () => {
    const samurottHisui = getPokemonEvolutionOptions({ id: 502 }).find(option => option.id === 10236);
    expect(POKEDEX[10236]).toMatchObject({
      name: 'Samurott Hisui',
      formRegion: 'hisui',
      formKey: 'samurott-hisui',
      isRegionalForm: true,
    });
    expect(getEvolutionMetadata(samurottHisui)).toMatchObject({
      formRegion: 'hisui',
      formKey: 'samurott-hisui',
      formSpriteId: 10236,
      isRegionalForm: true,
    });
  });
});

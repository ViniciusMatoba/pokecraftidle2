import fs from 'fs';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';
import { MEGA_EVOLUTION_MAP, MEGA_STONE_ICONS, getMegaSprite } from './megaEvolutions.js';
import { POKEDEX } from './pokedex.js';

const recipesSrc = fs.readFileSync(fileURLToPath(new URL('./recipes.js', import.meta.url)), 'utf8');
const recipeIds = new Set([...recipesSrc.matchAll(/\{ id: '([a-z_]+)'/g)].map((match) => match[1]));
const mapKeys = Object.keys(MEGA_EVOLUTION_MAP);

const getMegaEvolutionItemsFromPokedex = () => {
  const items = [];

  for (const pokemon of Object.values(POKEDEX)) {
    const evolutions = Array.isArray(pokemon.evolution)
      ? pokemon.evolution
      : (pokemon.evolution ? [pokemon.evolution] : []);

    for (const evolution of evolutions) {
      if (evolution?.item && /ite(_[a-z]+)?$/.test(evolution.item)) {
        items.push({ pokemon: pokemon.name, item: evolution.item });
      }
    }
  }

  return items;
};

describe('mega evolution data consistency', () => {
  it('todos os itens mega da Pokedex existem no mapa de Mega Evolution', () => {
    const missing = getMegaEvolutionItemsFromPokedex()
      .filter(({ item }) => !mapKeys.includes(item))
      .map(({ pokemon, item }) => `${pokemon}: ${item}`);

    expect(missing).toEqual([]);
  });

  it('todos os itens mega da Pokedex tem receita de forja', () => {
    const missing = getMegaEvolutionItemsFromPokedex()
      .filter(({ item }) => !recipeIds.has(item) && item !== 'rayquazaite')
      .map(({ pokemon, item }) => `${pokemon}: ${item}`);

    expect(missing).toEqual([]);
  });

  it('toda pedra do mapa tem icone', () => {
    const missing = mapKeys.filter((key) => !(key in MEGA_STONE_ICONS));

    expect(missing).toEqual([]);
  });

  it('todo baseId do mapa existe na Pokedex', () => {
    const invalid = mapKeys.filter((key) => !POKEDEX[MEGA_EVOLUTION_MAP[key].baseId]);

    expect(invalid).toEqual([]);
  });

  it('getMegaSprite resolve ids numericos para sprites Showdown nomeados', () => {
    expect(getMegaSprite(10229)).toBe('https://play.pokemonshowdown.com/sprites/dex/houndoom-mega.png');
    expect(getMegaSprite(20026)).toBe('https://play.pokemonshowdown.com/sprites/dex/raichu-megax.png');
    expect(getMegaSprite('charizard-megax')).toBe('https://play.pokemonshowdown.com/sprites/dex/charizard-megax.png');

    for (const pokemon of Object.values(POKEDEX)) {
      if (pokemon.id >= 10000 && /^Mega /.test(pokemon.name)) {
        expect(getMegaSprite(pokemon.id)).not.toMatch(/\/\d+\.png$/);
      }
    }
  });
});

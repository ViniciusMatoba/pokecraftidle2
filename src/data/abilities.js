export const ABILITY_ITEM_ID = 'ability_capsule';

const pickAbilityFromPokemon = (pokemon = {}, fallback = 'Overgrow') => {
  const abilities = (pokemon.abilities || []).filter(Boolean);
  if (!abilities.length) return fallback;
  return abilities[Math.floor(Math.random() * abilities.length)];
};

export const getPokemonAbilityPool = (pokemon = {}) => {
  const abilities = (pokemon.abilities || []).filter(Boolean);
  return abilities.length ? abilities : [pokemon.ability || 'Overgrow'];
};

export const assignRandomAbility = (pokemon = {}, pokedexEntry = null) => {
  const source = pokedexEntry || pokemon;
  const ability = pokemon.ability || pickAbilityFromPokemon(source);
  return {
    ...pokemon,
    ability,
    abilityPool: getPokemonAbilityPool(source),
  };
};

export const setPokemonAbility = (pokemon = {}, ability) => ({
  ...pokemon,
  ability,
  abilityPool: getPokemonAbilityPool(pokemon),
});

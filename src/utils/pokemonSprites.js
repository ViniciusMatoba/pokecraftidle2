const POKEAPI_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export const POKEMON_FORM_SPRITE_IDS = {
  'growlithe-hisui': 10229,
  'arcanine-hisui': 10230,
  'voltorb-hisui': 10231,
  'electrode-hisui': 10232,
  'typhlosion-hisui': 10233,
  'qwilfish-hisui': 10234,
  'sneasel-hisui': 10235,
  'samurott-hisui': 10236,
  'lilligant-hisui': 10237,
  'zorua-hisui': 10238,
  'zoroark-hisui': 10239,
  'braviary-hisui': 10240,
  'sliggoo-hisui': 10241,
  'goodra-hisui': 10242,
  'avalugg-hisui': 10243,
  'decidueye-hisui': 10244,
};

export const getPokemonSpriteId = (pokemonOrId) => {
  const pokemon = typeof pokemonOrId === 'object' && pokemonOrId !== null ? pokemonOrId : { id: pokemonOrId };
  const formId = pokemon.formSpriteId || POKEMON_FORM_SPRITE_IDS[pokemon.formKey];
  return Number(formId || pokemon.spriteId || pokemon.pokemonId || pokemon.id);
};

export const getPokemonSpriteUrl = (pokemonOrId, options = {}) => {
  const pokemon = typeof pokemonOrId === 'object' && pokemonOrId !== null ? pokemonOrId : { id: pokemonOrId };

  if (pokemon.isMega && pokemon.megaSprite) return pokemon.megaSprite;

  const spriteId = getPokemonSpriteId(pokemon);
  if (!spriteId) return `${POKEAPI_SPRITE_BASE}/0.png`;

  const isShiny = Boolean(options.shiny ?? pokemon.isShiny);
  if (options.officialArtwork) {
    return `${POKEAPI_SPRITE_BASE}/other/official-artwork/${spriteId}.png`;
  }

  if (options.back) {
    return `${POKEAPI_SPRITE_BASE}/back/${isShiny ? 'shiny/' : ''}${spriteId}.png`;
  }

  return `${POKEAPI_SPRITE_BASE}/${isShiny ? 'shiny/' : ''}${spriteId}.png`;
};

export const getPokemonSpriteFallbackUrl = (pokemonOrId) => {
  const pokemon = typeof pokemonOrId === 'object' && pokemonOrId !== null ? pokemonOrId : { id: pokemonOrId };
  const id = Number(pokemon.pokemonId || pokemon.id);
  return id ? `${POKEAPI_SPRITE_BASE}/${pokemon.isShiny ? 'shiny/' : ''}${id}.png` : `${POKEAPI_SPRITE_BASE}/0.png`;
};

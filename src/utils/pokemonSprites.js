const POKEAPI_SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const PS_ANI_BASE  = 'https://play.pokemonshowdown.com/sprites/ani/';
const PS_SHINY_BASE = 'https://play.pokemonshowdown.com/sprites/ani-shiny/';

export const POKEMON_FORM_SPRITE_IDS = {
  // ── Hisui ────────────────────────────────────────────────────────────────
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
  // ── Alola ─────────────────────────────────────────────────────────────────
  'rattata-alola':   10091,
  'raticate-alola':  10092,
  'raichu-alola':    10100,
  'sandshrew-alola': 10101,
  'sandslash-alola': 10102,
  'vulpix-alola':    10103,
  'ninetales-alola': 10104,
  'diglett-alola':   10105,
  'dugtrio-alola':   10106,
  'meowth-alola':    10107,
  'persian-alola':   10108,
  'geodude-alola':   10109,
  'graveler-alola':  10110,
  'golem-alola':     10111,
  'grimer-alola':    10112,
  'muk-alola':       10113,
  'exeggutor-alola': 10114,
  'marowak-alola':   10115,
  // ── Galar ─────────────────────────────────────────────────────────────────
  'zigzagoon-galar':  10177,
  'linoone-galar':    10178,
  'ponyta-galar':     10181,
  'rapidash-galar':   10182,
  'slowpoke-galar':   10183,
  'slowbro-galar':    10184,
  'farfetchd-galar':  10185,
  'weezing-galar':    10186,
  'mr-mime-galar':    10187,
  'meowth-galar':     10188,
  'corsola-galar':    10192,
  'stunfisk-galar':   10193,
  'darumaka-galar':   10194,
  'darmanitan-galar': 10195,
  'yamask-galar':     10196,
};

// Formkeys que usam sprites animados do Pokémon Showdown (eventos, GMax, etc.)
export const SHOWDOWN_FORM_KEYS = new Set([
  'pikachu-original','pikachu-hoenn','pikachu-sinnoh','pikachu-unova',
  'pikachu-kalos','pikachu-alola','pikachu-partner','pikachu-world','pikachu-gmax',
  'greninja-ash',
  'charizard-gmax','venusaur-gmax','blastoise-gmax',
  'gengar-gmax','snorlax-gmax','lapras-gmax','machamp-gmax',
  'meowth-gmax','eevee-gmax',
]);

/** Retorna URL do sprite animado do Showdown para formas de evento. */
export const getShowdownSpriteUrl = (formKey, shiny = false) =>
  `${shiny ? PS_SHINY_BASE : PS_ANI_BASE}${formKey}.gif`;

export const getPokemonSpriteId = (pokemonOrId) => {
  const pokemon = typeof pokemonOrId === 'object' && pokemonOrId !== null ? pokemonOrId : { id: pokemonOrId };
  const formId = pokemon.formSpriteId || POKEMON_FORM_SPRITE_IDS[pokemon.formKey];
  return Number(formId || pokemon.spriteId || pokemon.pokemonId || pokemon.id);
};

export const getPokemonSpriteUrl = (pokemonOrId, options = {}) => {
  const pokemon = typeof pokemonOrId === 'object' && pokemonOrId !== null ? pokemonOrId : { id: pokemonOrId };

  if (pokemon.isMega && pokemon.megaSprite) return pokemon.megaSprite;

  // Override direto (variantes de evento / GMax / chapéus)
  if (pokemon.spriteUrl) return pokemon.spriteUrl;

  // Formas de evento que usam sprites Showdown
  if (pokemon.formKey && SHOWDOWN_FORM_KEYS.has(pokemon.formKey)) {
    return getShowdownSpriteUrl(pokemon.formKey, Boolean(options.shiny ?? pokemon.isShiny));
  }

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

// Base dos sprites ANIMADOS (Gen 5 B/W) — mesmos usados nas batalhas. Só existem
// para Pokémon de Gen 1–5 (ids até ~649); para os demais, use o fallback estático.
const GEN5_ANI_BASE = `${POKEAPI_SPRITE_BASE}/versions/generation-v/black-white/animated/`;

/**
 * URL do sprite animado (GIF) para o modal de detalhes. Reaproveita os overrides
 * (mega/evento/Showdown) e cai no GIF Gen5; se não existir, o onError deve usar
 * getPokemonSpriteUrl como fallback estático.
 */
export const getAnimatedSpriteUrl = (pokemonOrId, options = {}) => {
  const pokemon = typeof pokemonOrId === 'object' && pokemonOrId !== null ? pokemonOrId : { id: pokemonOrId };

  if (pokemon.isMega && pokemon.megaSprite) return pokemon.megaSprite;
  if (pokemon.spriteUrl) return pokemon.spriteUrl;
  if (pokemon.formKey && SHOWDOWN_FORM_KEYS.has(pokemon.formKey)) {
    return getShowdownSpriteUrl(pokemon.formKey, Boolean(options.shiny ?? pokemon.isShiny));
  }

  const spriteId = getPokemonSpriteId(pokemon);
  if (!spriteId) return `${POKEAPI_SPRITE_BASE}/0.png`;
  const isShiny = Boolean(options.shiny ?? pokemon.isShiny);
  return `${GEN5_ANI_BASE}${isShiny ? 'shiny/' : ''}${spriteId}.gif`;
};

export const getPokemonSpriteFallbackUrl = (pokemonOrId) => {
  const pokemon = typeof pokemonOrId === 'object' && pokemonOrId !== null ? pokemonOrId : { id: pokemonOrId };
  const id = Number(pokemon.pokemonId || pokemon.id);
  return id ? `${POKEAPI_SPRITE_BASE}/${pokemon.isShiny ? 'shiny/' : ''}${id}.png` : `${POKEAPI_SPRITE_BASE}/0.png`;
};

export const ABILITY_ITEM_ID = 'ability_capsule';

export const normalizeAbilityId = (ability = '') => String(ability || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase()
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const getAbilityLabel = (ability = '') => {
  const id = normalizeAbilityId(ability);
  if (!id) return 'Sem habilidade';
  return id.split('-').map(part => part ? part[0].toUpperCase() + part.slice(1) : part).join(' ');
};

export const ABILITY_DESCRIPTIONS = {
  overgrow: 'Aumenta golpes de Planta em 50% quando o HP esta abaixo de 1/3.',
  blaze: 'Aumenta golpes de Fogo em 50% quando o HP esta abaixo de 1/3.',
  torrent: 'Aumenta golpes de Agua em 50% quando o HP esta abaixo de 1/3.',
  swarm: 'Aumenta golpes de Inseto em 50% quando o HP esta abaixo de 1/3.',
  adaptability: 'O bonus de STAB sobe de 1.5x para 2x.',
  guts: 'Com status negativo, aumenta o Ataque em 50% e ignora a reducao de queimadura.',
  levitate: 'Fica imune a golpes do tipo Terra.',
  flash_fire: 'Fica imune a golpes de Fogo e fortalece golpes de Fogo.',
  water_absorb: 'Fica imune a golpes de Agua.',
  volt_absorb: 'Fica imune a golpes Eletricos.',
  lightning_rod: 'Fica imune a golpes Eletricos.',
  motor_drive: 'Fica imune a golpes Eletricos.',
  sap_sipper: 'Fica imune a golpes de Planta.',
  storm_drain: 'Fica imune a golpes de Agua.',
  dry_skin: 'Fica imune a Agua, mas recebe mais dano de Fogo.',
  thick_fat: 'Recebe metade do dano de golpes de Fogo e Gelo.',
  heatproof: 'Recebe metade do dano de golpes de Fogo.',
  water_bubble: 'Dobra golpes de Agua e reduz dano de Fogo pela metade.',
  multiscale: 'Com HP cheio, recebe metade do dano.',
  shadow_shield: 'Com HP cheio, recebe metade do dano.',
  wonder_guard: 'So recebe dano de golpes super efetivos.',
  fur_coat: 'Recebe metade do dano de golpes fisicos.',
  fluffy: 'Recebe metade do dano fisico, mas dano de Fogo e dobrado.',
  marvel_scale: 'Com status negativo, aumenta a Defesa em 50%.',
  huge_power: 'Dobra o Ataque fisico.',
  pure_power: 'Dobra o Ataque fisico.',
  strong_jaw: 'Aumenta golpes de mordida em 50%.',
  tough_claws: 'Aumenta golpes de contato em 30%.',
  technician: 'Aumenta golpes de poder base 60 ou menor em 50%.',
  sheer_force: 'Aumenta golpes com efeito secundario em 30%.',
  tinted_lens: 'Golpes pouco efetivos causam dano dobrado.',
  neuroforce: 'Golpes super efetivos causam 25% mais dano.',
  sand_force: 'Em tempestade de areia, aumenta golpes Pedra, Terra e Aco em 30%.',
  steelworker: 'Aumenta golpes de Aco em 50%.',
  iron_fist: 'Aumenta golpes de soco em 20%.',
  mega_launcher: 'Aumenta golpes de pulso e aura em 50%.',
  sharpness: 'Aumenta golpes cortantes em 50%.',
  punk_rock: 'Aumenta golpes sonoros em 30% e reduz dano sonoro recebido.',
  soundproof: 'Fica imune a golpes sonoros.',
  bulletproof: 'Fica imune a golpes de bomba, esfera e projetil.',
  cloud_nine: 'Anula bonus e penalidades de clima enquanto estiver em batalha.',
  drizzle: 'Nos jogos, invoca chuva ao entrar em batalha.',
  drought: 'Nos jogos, invoca sol forte ao entrar em batalha.',
  sand_stream: 'Nos jogos, invoca tempestade de areia ao entrar em batalha.',
  snow_warning: 'Nos jogos, invoca neve/granizo ao entrar em batalha.',
  intimidate: 'Nos jogos, reduz o Ataque do inimigo ao entrar em batalha.',
  sturdy: 'Nos jogos, evita nocaute com HP cheio uma vez.',
  pressure: 'Nos jogos, aumenta o gasto de PP do inimigo.',
};

export const getAbilityDescription = (ability = '') => (
  ABILITY_DESCRIPTIONS[normalizeAbilityId(ability)]
  || ABILITY_DESCRIPTIONS[normalizeAbilityId(ability).replace(/-/g, '_')]
  || 'Habilidade especial deste Pokemon. Alguns efeitos passivos ja influenciam as batalhas.'
);

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

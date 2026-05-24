import { POKEDEX } from './pokedex';

export const REGIONAL_EVOLUTION_RULES = [
  {
    fromId: 156,
    id: 20157,
    to: 'Typhlosion Hisui',
    level: 36,
    region: 'hisui',
    formKey: 'typhlosion-hisui',
    formSpriteId: 10233,
  },
  {
    fromId: 502,
    id: 10236,
    to: 'Samurott Hisui',
    level: 36,
    region: 'hisui',
    formKey: 'samurott-hisui',
    formSpriteId: 10236,
  },
  {
    fromId: 723,
    id: 10244,
    to: 'Decidueye Hisui',
    level: 34,
    region: 'hisui',
    formKey: 'decidueye-hisui',
    formSpriteId: 10244,
  },
];

export const getBaseEvolutionList = (pokemonOrId) => {
  const id = Number(typeof pokemonOrId === 'object' ? pokemonOrId?.id : pokemonOrId);
  const evolution = POKEDEX[id]?.evolution;
  if (!evolution) return [];
  return Array.isArray(evolution) ? evolution : [evolution];
};

export const getRegionalEvolutionOptions = (pokemonOrId) => {
  const id = Number(typeof pokemonOrId === 'object' ? pokemonOrId?.id : pokemonOrId);
  return REGIONAL_EVOLUTION_RULES
    .filter(rule => Number(rule.fromId) === id)
    .map(rule => ({
      id: rule.id,
      to: rule.to,
      level: rule.level,
      formKey: rule.formKey,
      formSpriteId: rule.formSpriteId,
      formRegion: rule.region,
      isRegionalForm: true,
      regionalEvolution: true,
    }));
};

export const getPokemonEvolutionOptions = (pokemonOrId) => {
  const options = [...getBaseEvolutionList(pokemonOrId), ...getRegionalEvolutionOptions(pokemonOrId)];
  const seen = new Set();
  return options.filter(option => {
    const key = `${option.id}:${option.formKey || POKEDEX[option.id]?.formKey || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const getEvolutionFormRegion = (evolutionOption = {}) =>
  evolutionOption.formRegion || POKEDEX[evolutionOption.id]?.formRegion || null;

export const isEvolutionOptionAllowedInRegion = (evolutionOption = {}, activeRegion = 'kanto', defaultAllowedFn = null) => {
  const formRegion = getEvolutionFormRegion(evolutionOption);
  if (formRegion) return formRegion === activeRegion;
  return defaultAllowedFn ? defaultAllowedFn(evolutionOption.id, activeRegion) : true;
};

export const getEvolutionMetadata = (evolutionOption = {}) => {
  const target = POKEDEX[evolutionOption.id] || {};
  const formRegion = evolutionOption.formRegion || target.formRegion || null;
  const formKey = evolutionOption.formKey || target.formKey || null;
  return {
    formKey,
    formSpriteId: evolutionOption.formSpriteId || target.formSpriteId || null,
    formRegion,
    isRegionalForm: Boolean(evolutionOption.isRegionalForm || target.isRegionalForm || formRegion),
  };
};

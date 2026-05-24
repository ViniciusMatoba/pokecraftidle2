export const REGIONAL_FORM_METADATA = {
  'rattata-alola': { name: 'Rattata Alola', types: ['Dark', 'Normal'], formRegion: 'alola', formSpriteId: 10091 },
  'raticate-alola': { name: 'Raticate Alola', types: ['Dark', 'Normal'], formRegion: 'alola', formSpriteId: 10092 },
  'raichu-alola': { name: 'Raichu Alola', types: ['Electric', 'Psychic'], formRegion: 'alola', formSpriteId: 10100 },
  'sandshrew-alola': { name: 'Sandshrew Alola', types: ['Ice', 'Steel'], formRegion: 'alola', formSpriteId: 10101 },
  'sandslash-alola': { name: 'Sandslash Alola', types: ['Ice', 'Steel'], formRegion: 'alola', formSpriteId: 10102 },
  'vulpix-alola': { name: 'Vulpix Alola', types: ['Ice'], formRegion: 'alola', formSpriteId: 10103 },
  'ninetales-alola': { name: 'Ninetales Alola', types: ['Ice', 'Fairy'], formRegion: 'alola', formSpriteId: 10104 },
  'diglett-alola': { name: 'Diglett Alola', types: ['Ground', 'Steel'], formRegion: 'alola', formSpriteId: 10105 },
  'dugtrio-alola': { name: 'Dugtrio Alola', types: ['Ground', 'Steel'], formRegion: 'alola', formSpriteId: 10106 },
  'meowth-alola': { name: 'Meowth Alola', types: ['Dark'], formRegion: 'alola', formSpriteId: 10107 },
  'persian-alola': { name: 'Persian Alola', types: ['Dark'], formRegion: 'alola', formSpriteId: 10108 },
  'geodude-alola': { name: 'Geodude Alola', types: ['Rock', 'Electric'], formRegion: 'alola', formSpriteId: 10109 },
  'graveler-alola': { name: 'Graveler Alola', types: ['Rock', 'Electric'], formRegion: 'alola', formSpriteId: 10110 },
  'golem-alola': { name: 'Golem Alola', types: ['Rock', 'Electric'], formRegion: 'alola', formSpriteId: 10111 },
  'grimer-alola': { name: 'Grimer Alola', types: ['Poison', 'Dark'], formRegion: 'alola', formSpriteId: 10112 },
  'muk-alola': { name: 'Muk Alola', types: ['Poison', 'Dark'], formRegion: 'alola', formSpriteId: 10113 },
  'exeggutor-alola': { name: 'Exeggutor Alola', types: ['Grass', 'Dragon'], formRegion: 'alola', formSpriteId: 10114 },
  'marowak-alola': { name: 'Marowak Alola', types: ['Fire', 'Ghost'], formRegion: 'alola', formSpriteId: 10115 },

  'zigzagoon-galar': { name: 'Zigzagoon Galar', types: ['Dark', 'Normal'], formRegion: 'galar', formSpriteId: 10177 },
  'linoone-galar': { name: 'Linoone Galar', types: ['Dark', 'Normal'], formRegion: 'galar', formSpriteId: 10178 },
  'farfetchd-galar': { name: 'Farfetchd Galar', types: ['Fighting'], formRegion: 'galar', formSpriteId: 10185 },

  'growlithe-hisui': { name: 'Growlithe Hisui', types: ['Fire', 'Rock'], formRegion: 'hisui', formSpriteId: 10229 },
  'arcanine-hisui': { name: 'Arcanine Hisui', types: ['Fire', 'Rock'], formRegion: 'hisui', formSpriteId: 10230 },
  'voltorb-hisui': { name: 'Voltorb Hisui', types: ['Electric', 'Grass'], formRegion: 'hisui', formSpriteId: 10231 },
  'electrode-hisui': { name: 'Electrode Hisui', types: ['Electric', 'Grass'], formRegion: 'hisui', formSpriteId: 10232 },
  'qwilfish-hisui': { name: 'Qwilfish Hisui', types: ['Dark', 'Poison'], formRegion: 'hisui', formSpriteId: 10234 },
  'sneasel-hisui': { name: 'Sneasel Hisui', types: ['Fighting', 'Poison'], formRegion: 'hisui', formSpriteId: 10235 },
  'avalugg-hisui': { name: 'Avalugg Hisui', types: ['Ice', 'Rock'], formRegion: 'hisui', formSpriteId: 10243 },
};

export const applyRegionalFormMetadata = (pokemon, formKey) => {
  const metadata = REGIONAL_FORM_METADATA[formKey || pokemon?.formKey];
  if (!pokemon || !metadata) return pokemon;
  return {
    ...pokemon,
    ...metadata,
    type: metadata.types[0],
    formKey: formKey || pokemon.formKey,
    isRegionalForm: true,
  };
};

export const regionalEncounter = (id, level, formKey, extra = {}) =>
  applyRegionalFormMetadata({ id, level, ...extra }, formKey);

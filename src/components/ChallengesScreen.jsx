import React, { useState } from 'react';
import { hasProgressRequirement } from '../utils/progress';

const CHALLENGES = [
  // RIVAIS
  {
    id: 'rival_route1',
    category: 'rival',
    name: 'Azul - Rota 1',
    subtitle: 'Primeira Rivalidade',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    quote: '"Acho que vou usar este aqui! Prepare-se!"',
    reward: 500,
    unlockFlag: 'rival_1_defeated',
    requiresFlag: null,
    team: [{ id: 133, level: 5 }], // Eevee
    background: "url('/battle_bg_grass_1776863779024.png') center/cover no-repeat",
    location: 'Rota 1 (Encontro)',
  },
  {
    id: 'rival_ss_anne',
    category: 'rival',
    name: 'Azul - S.S. Anne',
    subtitle: 'Encontro no Navio',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    quote: '"Bon voyage! Mas antes, uma lição de batalha!"',
    reward: 2000,
    unlockFlag: 'rival_3_defeated',
    requiresFlag: 'cascade_badge',
    team: [
      { id: 17, level: 19 }, // Pidgeotto
      { id: 20, level: 16 }, // Raticate
      { id: 64, level: 18 }, // Kadabra
      { id: 133, level: 20 }, // Eevee
    ],
    background: "url('/battle_bg_gym_water.png') center/cover no-repeat", // Deck do navio/água
    location: 'Deck do S.S. Anne',
  },
  {
    id: 'rival_silph_co',
    category: 'rival',
    name: 'Azul - Silph Co.',
    subtitle: 'Rivalidade Ápice',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    quote: '"Eu sou o treinador mais forte do mundo! Observe!"',
    reward: 5000,
    unlockFlag: 'rival_silph_defeated',
    requiresFlag: 'rocket_hideout_cleared',
    team: [
      { id: 18, level: 37 }, // Pidgeot
      { id: 59, level: 35 }, // Arcanine
      { id: 103, level: 35 }, // Exeggutor
      { id: 130, level: 35 }, // Gyarados
      { id: 65, level: 37 }, // Alakazam
      { id: 135, level: 40 }, // Jolteon
    ],
    background: "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat", // Escritório
    location: 'Silph Co. - 11º Andar',
  },
  {
    id: 'rival_pokemon_tower',
    category: 'rival',
    name: 'Azul - Torre Pokemon',
    subtitle: 'Encontro em Lavender',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    quote: '"Voce chegou ate aqui? Entao prove que esta pronto para subir a torre!"',
    reward: 3500,
    unlockFlag: 'rival_pokemon_tower_defeated',
    requiresFlag: 'rock_tunnel_cleared',
    team: [
      { id: 18, level: 28 },
      { id: 64, level: 27 },
      { id: 102, level: 27 },
      { id: 130, level: 28 },
      { id: 133, level: 30 },
    ],
    background: "url('/battle_bg_cave_1776863810604.png') center/cover no-repeat", // Torre (escuro)
    location: 'Torre Pokémon - Lavender',
  },

  // EQUIPE ROCKET
  {
    id: 'rocket_grunt_forest',
    category: 'rocket',
    name: 'Recruta Rocket',
    subtitle: 'Problemas na Floresta',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgrunt.png',
    quote: '"Esta floresta agora pertence à Equipe Rocket! Caia fora!"',
    reward: 800,
    unlockFlag: 'viridian_forest_cleared',
    requiresFlag: 'rival_1_defeated',
    team: [
      { id: 19, level: 8 }, // Rattata
      { id: 23, level: 8 }, // Ekans
    ],
    background: "url('/battle_bg_grass_1776863779024.png') center/cover no-repeat",
    location: 'Floresta de Viridian',
  },
  {
    id: 'mt_moon_rocket_1',
    category: 'rocket',
    name: 'Recruta Rocket - Mt. Moon I',
    subtitle: 'Bloqueio na Caverna',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgrunt.png',
    quote: '"Você não vai passar daqui! A Equipe Rocket está ocupada!"',
    reward: 1200,
    unlockFlag: 'mt_moon_rocket_1_defeated',
    requiresFlag: 'mt_moon_cleared',
    team: [
      { id: 41, level: 12 }, // Zubat
      { id: 19, level: 13 }, // Rattata
    ],
    background: "url('/battle_bg_cave_1776863810604.png') center/cover no-repeat",
    location: 'Mt. Moon - Entrada',
  },
  {
    id: 'mt_moon_rocket_2',
    category: 'rocket',
    name: 'Recruta Rocket - Mt. Moon II',
    subtitle: 'Reforços Rocket',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgruntf.png',
    quote: '"Mais um intrometido? Vamos te dar uma lição!"',
    reward: 1500,
    unlockFlag: 'mt_moon_rocket_2_defeated',
    requiresFlag: 'mt_moon_rocket_1_defeated',
    team: [
      { id: 23, level: 14 }, // Ekans
      { id: 41, level: 14 }, // Zubat
    ],
    background: "url('/battle_bg_cave_1776863810604.png') center/cover no-repeat",
    location: 'Mt. Moon - Subsolo',
  },
  {
    id: 'mt_moon_trio',
    category: 'rocket',
    name: 'Trio Rocket - Mt. Moon',
    subtitle: 'Jessie, James & Meowth',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"Prepare-se para a encrenca! Encrenca em dobro!"',
    reward: 3000,
    unlockFlag: 'mt_moon_rockets_defeated',
    requiresFlag: 'mt_moon_rocket_2_defeated',
    team: [
      { id: 109, level: 16 }, // Koffing
      { id: 23,  level: 16 }, // Ekans
      { id: 52,  level: 18 }, // Meowth
    ],
    background: "url('/battle_bg_cave_1776863810604.png') center/cover no-repeat",
    location: 'Mt. Moon - Saída',
  },
  {
    id: 'giovanni_hideout',
    category: 'rocket',
    name: 'Chefe Giovanni',
    subtitle: 'Lider da Equipe Rocket',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/giovanni.png',
    quote: '"Você ousou invadir meu esconderijo? Conheça o verdadeiro poder!"',
    reward: 8000,
    unlockFlag: 'rocket_hideout_cleared',
    requiresFlag: 'rock_tunnel_cleared',
    team: [
      { id: 111, level: 25 }, // Rhyhorn
      { id: 115, level: 24 }, // Kangaskhan
      { id: 112, level: 29 }, // Rhydon
    ],
    background: "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat",
    location: 'QG Equipe Rocket - Celadon',
  },

  // ── LENDÁRIOS ───────────────────────────────────────────────────────
  {
    id: 'johto_rival_new_bark',
    category: 'rival',
    name: 'Rival - New Bark',
    subtitle: 'Primeiro Passo em Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Kanto ficou para tras. Mostre que ainda consegue acompanhar!"',
    reward: 12000,
    unlockFlag: 'johto_rival_1_defeated',
    requiresFlag: 'johto_started',
    team: [
      { id: 153, level: 42 },
      { id: 156, level: 42 },
      { id: 159, level: 42 },
    ],
    background: "url('/battle_bg_johto_meadow.svg') center/cover no-repeat",
    location: 'New Bark Town',
  },
  {
    id: 'johto_slowpoke_well',
    category: 'rocket',
    name: 'Rocket - Poco Slowpoke',
    subtitle: 'Sombra em Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgrunt.png',
    quote: '"A Equipe Rocket tambem tem negocios em Johto!"',
    reward: 14000,
    unlockFlag: 'johto_slowpoke_well_cleared',
    requiresFlag: 'johto_rival_1_defeated',
    team: [
      { id: 41, level: 38 },
      { id: 109, level: 40 },
      { id: 199, level: 42 },
    ],
    background: "url('/battle_bg_johto_cave.svg') center/cover no-repeat",
    location: 'Poco Slowpoke - Azalea',
  },
  {
    id: 'johto_falkner',
    category: 'johto',
    name: 'Falkner',
    subtitle: 'Insignia Zephyr',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/falkner.png',
    quote: '"Os Pokemon voadores de Johto nao caem facilmente!"',
    reward: 6000,
    unlockFlag: 'zephyr_badge',
    requiresFlag: 'johto_route_29_cleared',
    team: [{ id: 16, level: 18 }, { id: 17, level: 20 }, { id: 163, level: 19 }],
    background: "url('/battle_bg_johto_meadow.svg') center/cover no-repeat",
    location: 'Violet Gym',
  },
  {
    id: 'johto_bugsy',
    category: 'johto',
    name: 'Bugsy',
    subtitle: 'Insignia Hive',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bugsy.png',
    quote: '"Insetos evoluem rapido. Vamos ver se voce acompanha!"',
    reward: 7000,
    unlockFlag: 'hive_badge',
    requiresFlag: 'johto_slowpoke_well_cleared',
    team: [{ id: 123, level: 23 }, { id: 11, level: 21 }, { id: 14, level: 21 }],
    background: "url('/battle_bg_johto_forest.svg') center/cover no-repeat",
    location: 'Azalea Gym',
  },
  {
    id: 'johto_whitney',
    category: 'johto',
    name: 'Whitney',
    subtitle: 'Insignia Plain',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/whitney.png',
    quote: '"Meus Pokemon sao fofos, mas batem forte!"',
    reward: 8500,
    unlockFlag: 'plain_badge',
    requiresFlag: 'hive_badge',
    team: [{ id: 35, level: 27 }, { id: 241, level: 29 }, { id: 39, level: 28 }],
    background: "url('/battle_bg_johto_city.svg') center/cover no-repeat",
    location: 'Goldenrod Gym',
  },
  {
    id: 'johto_morty',
    category: 'johto',
    name: 'Morty',
    subtitle: 'Insignia Fog',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/morty.png',
    quote: '"Ecruteak guarda historias que atravessam o tempo."',
    reward: 9500,
    unlockFlag: 'fog_badge',
    requiresFlag: 'plain_badge',
    team: [{ id: 92, level: 30 }, { id: 93, level: 31 }, { id: 94, level: 33 }],
    background: "url('/battle_bg_johto_cave.svg') center/cover no-repeat",
    location: 'Ecruteak Gym',
  },
  {
    id: 'johto_chuck',
    category: 'johto',
    name: 'Chuck',
    subtitle: 'Insignia Storm',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/chuck.png',
    quote: '"Forca bruta tambem e disciplina!"',
    reward: 11000,
    unlockFlag: 'storm_badge',
    requiresFlag: 'fog_badge',
    team: [{ id: 57, level: 36 }, { id: 62, level: 38 }, { id: 107, level: 37 }],
    background: "url('/battle_bg_johto_water.svg') center/cover no-repeat",
    location: 'Cianwood Gym',
  },
  {
    id: 'johto_jasmine',
    category: 'johto',
    name: 'Jasmine',
    subtitle: 'Insignia Mineral',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/jasmine.png',
    quote: '"O tipo Aco exige paciencia e resistencia."',
    reward: 12000,
    unlockFlag: 'mineral_badge',
    requiresFlag: 'storm_badge',
    team: [{ id: 81, level: 38 }, { id: 82, level: 39 }, { id: 208, level: 41 }],
    background: "url('/battle_bg_johto_city.svg') center/cover no-repeat",
    location: 'Olivine Gym',
  },
  {
    id: 'johto_rocket_radio',
    category: 'johto',
    name: 'Rocket - Radio Tower',
    subtitle: 'Crise em Goldenrod',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketexecutive.png',
    quote: '"A transmissao da Equipe Rocket ecoara por toda Johto!"',
    reward: 15000,
    unlockFlag: 'johto_rocket_radio_cleared',
    requiresFlag: 'mineral_badge',
    team: [{ id: 41, level: 40 }, { id: 109, level: 41 }, { id: 229, level: 43 }],
    background: "url('/battle_bg_johto_city.svg') center/cover no-repeat",
    location: 'Goldenrod Radio Tower',
  },
  {
    id: 'johto_pryce',
    category: 'johto',
    name: 'Pryce',
    subtitle: 'Insignia Glacier',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/pryce.png',
    quote: '"O gelo ensina a resistir antes de atacar."',
    reward: 13500,
    unlockFlag: 'glacier_badge',
    requiresFlag: 'johto_rocket_radio_cleared',
    team: [{ id: 87, level: 42 }, { id: 221, level: 42 }, { id: 124, level: 43 }],
    background: "url('/battle_bg_johto_ice.svg') center/cover no-repeat",
    location: 'Mahogany Gym',
  },
  {
    id: 'johto_clair',
    category: 'johto',
    name: 'Clair',
    subtitle: 'Insignia Rising',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/clair.png',
    quote: '"Dragões obedecem apenas treinadores dignos."',
    reward: 16000,
    unlockFlag: 'rising_badge',
    requiresFlag: 'glacier_badge',
    team: [{ id: 148, level: 45 }, { id: 130, level: 46 }, { id: 230, level: 48 }],
    background: "url('/battle_bg_johto_cave.svg') center/cover no-repeat",
    location: 'Blackthorn Gym',
  },
  {
    id: 'johto_rival_victory',
    category: 'johto',
    name: 'Rival - Victory Road',
    subtitle: 'Ultima barreira',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Eu tambem cheguei ate aqui. Nao vou deixar voce passar sem lutar!"',
    reward: 18000,
    unlockFlag: 'johto_rival_victory_defeated',
    requiresFlag: 'rising_badge',
    team: [{ id: 169, level: 48 }, { id: 94, level: 48 }, { id: 65, level: 49 }, { id: 160, level: 50 }],
    background: "url('/battle_bg_johto_cave.svg') center/cover no-repeat",
    location: 'Victory Road Johto',
  },
  {
    id: 'johto_champion_lance',
    category: 'johto',
    name: 'Campeao Lance',
    subtitle: 'Liga de Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lance.png',
    quote: '"Mostre que sua nova jornada tambem merece entrar para a historia."',
    reward: 50000,
    unlockFlag: 'johto_champion',
    requiresFlag: 'johto_rival_victory_defeated',
    team: [{ id: 130, level: 52 }, { id: 142, level: 52 }, { id: 149, level: 54 }, { id: 149, level: 55 }, { id: 149, level: 56 }],
    background: "url('/battle_bg_elite_four.png') center/cover no-repeat",
    location: 'Liga Pokemon de Johto',
  },
  {
    id: 'articuno',
    category: 'legendary',
    name: 'Articuno',
    subtitle: 'O Pássaro de Gelo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png',
    quote: '"Um frio intenso emana desta criatura majestosa..."',
    reward: 15000,
    unlockFlag: 'articuno_defeated',
    requiresFlag: 'soul_badge',
    team: [{ id: 144, level: 50 }],
    background: "url('/battle_bg_cave_1776863810604.png') center/cover no-repeat",
    location: 'Ilhas Seafoam - Profundezas',
  },
  {
    id: 'zapdos',
    category: 'legendary',
    name: 'Zapdos',
    subtitle: 'O Pássaro do Trovão',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png',
    quote: '"Relâmpagos estalam ao redor de suas asas pontiagudas!"',
    reward: 15000,
    unlockFlag: 'zapdos_defeated',
    requiresFlag: 'soul_badge',
    team: [{ id: 145, level: 50 }],
    background: "url('/battle_bg_gym_electric.png') center/cover no-repeat",
    location: 'Power Plant',
  },
  {
    id: 'moltres',
    category: 'legendary',
    name: 'Moltres',
    subtitle: 'O Pássaro de Fogo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png',
    quote: '"As chamas que compõem suas asas brilham intensamente!"',
    reward: 15000,
    unlockFlag: 'moltres_defeated',
    requiresFlag: 'soul_badge',
    team: [{ id: 146, level: 50 }],
    background: "url('/battle_bg_cave_1776863810604.png') center/cover no-repeat",
    location: 'Victory Road',
  },
  {
    id: 'mewtwo',
    category: 'legendary',
    name: 'Mewtwo',
    subtitle: 'Lenda de Kanto',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    quote: '"Eu fui criado para ser o mais forte. Prove que você é digno!"',
    reward: 100000,
    unlockFlag: 'mewtwo_defeated',
    requiresFlag: 'champion',
    team: [
      { id: 150, level: 70 },
    ],
    background: "url('/battle_bg_cave_1776863810604.png') center/cover no-repeat",
    location: 'Caverna de Cerulean',
  },
  {
    id: 'raikou',
    category: 'legendary',
    name: 'Raikou',
    subtitle: 'Besta Eletrica',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/243.png',
    quote: '"Roar!"',
    reward: 20000,
    unlockFlag: 'raikou_defeated',
    requiresFlag: 'johto_champion_lance_defeated',
    team: [{ id: 243, level: 50 }],
    background: "url('/battle_bg_johto_meadow_1777340536606.png') center/cover no-repeat",
    location: 'Rotas de Johto',
  },
  {
    id: 'entei',
    category: 'legendary',
    name: 'Entei',
    subtitle: 'Besta de Fogo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png',
    quote: '"Roar!"',
    reward: 20000,
    unlockFlag: 'entei_defeated',
    requiresFlag: 'johto_champion_lance_defeated',
    team: [{ id: 244, level: 50 }],
    background: "url('/battle_bg_johto_forest_1777340549427.png') center/cover no-repeat",
    location: 'Rotas de Johto',
  },
  {
    id: 'suicune',
    category: 'legendary',
    name: 'Suicune',
    subtitle: 'Besta Aquatica',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/245.png',
    quote: '"Roar!"',
    reward: 20000,
    unlockFlag: 'suicune_defeated',
    requiresFlag: 'johto_champion_lance_defeated',
    team: [{ id: 245, level: 50 }],
    background: "url('/battle_bg_johto_water_1777340582200.png') center/cover no-repeat",
    location: 'Rotas de Johto',
  },
  {
    id: 'lugia',
    category: 'legendary',
    name: 'Lugia',
    subtitle: 'Guardiao dos Mares',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png',
    quote: '"Shaaaow!"',
    reward: 50000,
    unlockFlag: 'lugia_defeated',
    requiresFlag: 'johto_champion_lance_defeated',
    team: [{ id: 249, level: 60 }],
    background: "url('/battle_bg_johto_water_1777340582200.png') center/cover no-repeat",
    location: 'Whirl Islands',
  },
  {
    id: 'ho_oh',
    category: 'legendary',
    name: 'Ho-Oh',
    subtitle: 'Guardiao dos Ceus',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png',
    quote: '"Shaaaow!"',
    reward: 50000,
    unlockFlag: 'ho_oh_defeated',
    requiresFlag: 'johto_champion_lance_defeated',
    team: [{ id: 250, level: 60 }],
    background: "url('/bg_burned_tower.png') center/cover no-repeat",
    location: 'Bell Tower',
  },
  {
    id: 'celebi',
    category: 'legendary',
    name: 'Celebi',
    subtitle: 'Viajante do Tempo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/251.png',
    quote: '"Biii!"',
    reward: 100000,
    unlockFlag: 'celebi_defeated',
    requiresFlag: 'ho_oh_defeated',
    team: [{ id: 251, level: 70 }],
    background: "url('/bg_ilex_forest.png') center/cover no-repeat",
    location: 'Ilex Forest',
  }
];

const CATEGORY_CONFIG = {
  rival:     { label: 'Rival',         color: '#1a56db', emoji: '⚔️'  },
  rocket:    { label: 'Equipe Rocket', color: '#cc0000', emoji: '🚀'  },
  johto:     { label: 'Johto',         color: '#059669', emoji: 'J'  },
  legendary: { label: 'Lendários',     color: '#7c3aed', emoji: '✨'  },
};

const ChallengesScreen = ({ 
  gameState, onChallenge, onClose, isEmbedded = false, 
  filterCategories = null, setCurrentView, setVsInitialTab,
  initialCategory, setVsInitialCategory 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || (filterCategories ? filterCategories[0] : 'rival'));

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const flagNames = {
    'has_starter': 'Ter um Pokemon inicial',
    'rival_1_defeated': 'Vencer o Rival na Rota 1',
    'viridian_forest_cleared': 'Vencer o Recruta Rocket na Floresta',
    'mt_moon_cleared': 'Atravessar o Mt. Moon',
    'rock_tunnel_cleared': 'Atravessar o Rock Tunnel',
    'rocket_hideout_cleared': 'Destruir o QG da Equipe Rocket',
    'soul_badge': 'Insígnia da Alma (Koga)',
    'champion': 'Tornar-se o Campeão',
    'earth_badge': 'Insígnia da Terra (Giovanni)',
    'johto_started': 'Iniciar a jornada em Johto',
    'johto_route_29_cleared': 'Explorar a Rota 29',
    'johto_slowpoke_well_cleared': 'Salvar o Poco Slowpoke',
    'zephyr_badge': 'Insignia Zephyr (Falkner)',
    'hive_badge': 'Insignia Hive (Bugsy)',
    'plain_badge': 'Insignia Plain (Whitney)',
    'fog_badge': 'Insignia Fog (Morty)',
    'storm_badge': 'Insignia Storm (Chuck)',
    'mineral_badge': 'Insignia Mineral (Jasmine)',
    'johto_rocket_radio_cleared': 'Salvar a Radio Tower',
    'glacier_badge': 'Insignia Glacier (Pryce)',
    'rising_badge': 'Insignia Rising (Clair)',
    'johto_rival_victory_defeated': 'Derrotar o Rival na Victory Road'
  };

  const handleRequirementClick = (flag) => {
    if (!flag) return;
    const johtoRequirements = ['johto_started', 'johto_route_29_cleared', 'johto_slowpoke_well_cleared', 'zephyr_badge', 'hive_badge', 'plain_badge', 'fog_badge', 'storm_badge', 'mineral_badge', 'johto_rocket_radio_cleared', 'glacier_badge', 'rising_badge', 'johto_rival_victory_defeated'];
    if (johtoRequirements.includes(flag)) {
      if (setVsInitialTab) setVsInitialTab(flag === 'johto_started' ? 'challenges' : 'gyms');
      if (setVsInitialCategory) setVsInitialCategory('johto');
      setCurrentView(flag === 'johto_started' ? 'city' : 'vs');
    } else if (flag.includes('_badge')) {
      // Já está em VS, mas forçamos o redirecionamento correto se necessário
      if (setVsInitialTab) setVsInitialTab('gyms');
      setCurrentView('vs');
    } else if (flag.includes('_cleared') || flag === 'has_starter') {
      setCurrentView('routes');
    }
  };

  React.useEffect(() => {
    if (filterCategories && !filterCategories.includes(selectedCategory)) {
      setSelectedCategory(filterCategories[0]);
    }
  }, [filterCategories]);

  const isUnlocked = (challenge) => {
    if (!challenge.requiresFlag) return true;
    return hasProgressRequirement(gameState, challenge.requiresFlag);
  };

  const isDefeated = (challenge) => {
    return (gameState.worldFlags || []).includes(challenge.unlockFlag);
  };

  const filtered = CHALLENGES.filter(c => c.category === selectedCategory);

  return (
    <div className={isEmbedded ? "h-full flex flex-col bg-slate-950" : "absolute inset-0 z-[110] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"} onClick={!isEmbedded ? onClose : undefined}>
      <div 
        className={isEmbedded ? "flex-1 flex flex-col overflow-hidden" : "w-full max-w-md bg-slate-950 rounded-t-[2rem] shadow-2xl flex flex-col animate-slideUp overflow-hidden"}
        style={!isEmbedded ? { height: '90dvh' } : {}}
        onClick={e => e.stopPropagation()}
      >

        {!isEmbedded && (
          <div className="flex items-center gap-4 p-4 border-b border-white/10">
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl transition-all active:scale-95">
              ←
            </button>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Desafios</h2>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Encontre oponentes poderosos</p>
            </div>
          </div>
        )}

        {(!isEmbedded || (filterCategories && filterCategories.length > 1)) && (
          <div className="flex p-4 gap-3 bg-slate-900 border-b border-white/5 justify-center">
            <div className="flex w-full max-w-sm gap-2">
              {Object.entries(CATEGORY_CONFIG)
                .filter(([id]) => !filterCategories || filterCategories.includes(id))
                .map(([id, cfg]) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`flex-1 py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-2 border ${
                    selectedCategory === id 
                    ? 'bg-white text-slate-950 border-white font-black' 
                    : 'bg-white/5 text-white/40 border-white/5 font-bold hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">{cfg.emoji}</span>
                  <span className="text-[9px] uppercase tracking-tighter">{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-5">
          {filtered.map((challenge) => {
            const unlocked = isUnlocked(challenge);
            const defeated = isDefeated(challenge);
            return (
              <div
                key={challenge.id}
                onClick={() => unlocked && !defeated && setSelectedChallenge(challenge)}
                className={`relative rounded-[1.75rem] overflow-hidden shadow-xl transition-all border border-white/10 ${
                  unlocked && !defeated ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : 'grayscale cursor-not-allowed opacity-60'
                }`}
                style={{ background: challenge.background || challenge.bg, minHeight: '116px' }}
              >
                <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                {defeated && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/10 border border-white/20 px-6 py-2 rounded-full rotate-[-5deg] shadow-2xl backdrop-blur-md">
                      <span className="text-white font-black italic uppercase tracking-widest text-sm flex items-center gap-2">
                         <span className="text-yellow-400">OK</span> CONCLUIDO
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex items-center gap-4 p-5">
                  <img src={challenge.sprite} alt={challenge.name} className="w-[72px] h-[72px] object-contain drop-shadow-xl shrink-0" onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-widest">{challenge.subtitle}</p>
                    <h3 className="text-white font-black text-base uppercase italic leading-tight">{challenge.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-yellow-400 uppercase">{challenge.reward.toLocaleString()} coins</span>
                      <span className="text-white/30">|</span>
                      <span className="text-[9px] font-black text-white/50 uppercase">{challenge.team.length} Pokemon</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {defeated && <span className="bg-yellow-400 text-yellow-950 text-[9px] font-black px-2 py-1 rounded-full">Vencido</span>}
                    {!unlocked && (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-white/40 text-xl">LOCK</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRequirementClick(challenge.requiresFlag); }}
                          className="text-[7px] font-black text-red-400 uppercase bg-black/40 px-2 py-1 rounded-lg border border-red-900/50 hover:bg-black/60 transition-all"
                        >
                          REQ: {flagNames[challenge.requiresFlag] || challenge.requiresFlag}
                        </button>
                      </div>
                    )}
                    {unlocked && !defeated && <span className="text-white/60 text-xl">›</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedChallenge && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedChallenge(null)}>
          <div className="modal-panel-mobile rounded-[2rem] overflow-hidden shadow-2xl animate-bounceIn border-2 border-white/10 flex flex-col" style={{ background: selectedChallenge.background || selectedChallenge.bg }} onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10 px-5 py-4 flex items-center gap-4 shrink-0 border-b border-white/10 bg-black/20">
                <img src={selectedChallenge.sprite} alt={selectedChallenge.name} className="w-20 h-20 object-contain drop-shadow-2xl shrink-0" onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }} />
                <div className="flex-1 min-w-0 pr-10">
                  <p className="text-white/50 text-[9px] font-black uppercase tracking-widest">{selectedChallenge.subtitle}</p>
                  <h3 className="text-white font-black text-lg uppercase italic leading-tight">{selectedChallenge.name}</h3>
                </div>
                <button onClick={() => setSelectedChallenge(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 text-white font-black flex items-center justify-center hover:bg-white/30 transition-colors">x</button>
              </div>
            <div className="relative z-10 modal-scroll-content p-5">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/10">
                <p className="text-white/80 text-xs font-bold italic">{selectedChallenge.quote}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {selectedChallenge.team.map((p, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-2 border border-white/5 flex flex-col items-center">
                    <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} className="w-12 h-12 object-contain" alt="pokemon" />
                    <span className="text-white/40 text-[8px] font-black uppercase mt-1">NV. {p.level}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelectedChallenge(null)} className="flex-1 bg-white/10 text-white py-4 rounded-2xl font-black uppercase text-sm hover:bg-white/20">Cancelar</button>
                <button onClick={() => { onChallenge(selectedChallenge); setSelectedChallenge(null); }} className="flex-2 flex-grow bg-white text-slate-900 py-4 rounded-2xl font-black uppercase text-sm hover:bg-slate-100 shadow-xl active:scale-95">Desafiar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesScreen;

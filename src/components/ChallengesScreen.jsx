import React, { useState } from 'react';
import { hasProgressRequirement } from '../utils/progress';
import { TYPE_COLOR_HEX } from '../data/gyms';
import { BadgeSVG } from './CommonUI';

const CHALLENGES = [
  // RIVAIS
  {
    region: 'kanto',
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
    region: 'kanto',
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
    region: 'kanto',
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
  {
    region: 'kanto',
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

  // EQUIPE ROCKET
  {
    region: 'kanto',
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
    region: 'kanto',
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
    region: 'kanto',
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
    region: 'kanto',
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
    region: 'kanto',
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
    region: 'johto',
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
      { id: 153, level: 6 },
      { id: 156, level: 6 },
      { id: 159, level: 6 },
    ],
    background: "url('/bg_new_bark_town.png') center/cover no-repeat",
    location: 'New Bark Town',
  },
  {
    region: 'johto',
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
      { id: 41, level: 16 },
      { id: 109, level: 17 },
      { id: 199, level: 18 },
    ],
    background: "url('/bg_slowpoke_well.png') center/cover no-repeat",
    location: 'Poco Slowpoke - Azalea',
  },
  {
    region: 'johto',
    id: 'johto_rival_azalea',
    category: 'rival',
    name: 'Rival - Azalea Town',
    subtitle: 'Confronto em Azalea',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Voce demorou demais. Vamos ver se seus Pokemon sao lentos como voce!"',
    reward: 13000,
    unlockFlag: 'johto_rival_azalea_defeated',
    requiresFlag: 'hive_badge',
    team: [
      { id: 92, level: 14 },  // Gastly
      { id: 41, level: 16 },  // Zubat
      { id: 156, level: 18 }, // Quilava (exemplo)
    ],
    background: "url('/bg_violet_city.png') center/cover no-repeat",
    location: 'Azalea Town - Saida',
  },
  {
    region: 'johto',
    id: 'johto_rival_ecruteak',
    category: 'rival',
    name: 'Rival - Torre Queimada',
    subtitle: 'Encontro em Ecruteak',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Esta torre guarda lendas, mas voce nao e uma delas!"',
    reward: 15000,
    unlockFlag: 'johto_rival_ecruteak_defeated',
    requiresFlag: 'plain_badge',
    team: [
      { id: 93, level: 20 },  // Haunter
      { id: 81, level: 20 },  // Magnemite
      { id: 42, level: 22 },  // Golbat
      { id: 159, level: 24 }, // Croconaw
    ],
    background: "url('/bg_ecruteak_city.png') center/cover no-repeat",
    location: 'Burned Tower - Ecruteak',
  },
  {
    region: 'johto',
    id: 'johto_rocket_mahogany',
    category: 'rocket',
    name: 'Executivo Rocket - Mahogany',
    subtitle: 'Base Secreta',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"Ninguem interrompe os planos da Equipe Rocket!"',
    reward: 16000,
    unlockFlag: 'johto_rocket_mahogany_cleared',
    requiresFlag: 'storm_badge',
    team: [
      { id: 42, level: 24 },  // Golbat
      { id: 110, level: 24 }, // Weezing
      { id: 198, level: 26 }, // Murkrow
    ],
    background: "url('/bg_radio_tower_interior.png') center/cover no-repeat",
    location: 'Esconderijo Rocket - Mahogany',
  },
  {
    region: 'johto',
    id: 'johto_rival_goldenrod_tunnel',
    category: 'rival',
    name: 'Rival - Tunel de Goldenrod',
    subtitle: 'Invasao a Torre de Radio',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Eu tambem estou atras da Equipe Rocket, mas voce esta no meu caminho!"',
    reward: 18000,
    unlockFlag: 'johto_rival_tunnel_defeated',
    requiresFlag: 'mineral_badge',
    team: [
      { id: 169, level: 32 }, // Crobat
      { id: 82, level: 30 },  // Magneton
      { id: 93, level: 32 },  // Haunter
      { id: 130, level: 32 }, // Gyarados
      { id: 215, level: 34 }, // Sneasel
      { id: 160, level: 36 }, // Feraligatr
    ],
    background: "url('/bg_goldenrod_city.png') center/cover no-repeat",
    location: 'Tunel Subterraneo - Goldenrod',
  },
  {
    region: 'johto',
    id: 'johto_falkner',
    category: 'johto',
    type: 'Flying',
    name: 'Falkner',
    subtitle: 'Insignia Zephyr',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/falkner.png',
    quote: '"Os Pokemon voadores de Johto nao caem facilmente!"',
    reward: 6000,
    unlockFlag: 'zephyr_badge',
    requiresFlag: 'johto_route_29_cleared',
    team: [{ id: 16, level: 12 }, { id: 17, level: 14 }, { id: 163, level: 13 }],
    background: "url('/bg_violet_city.png') center/cover no-repeat",
    location: 'Violet Gym',
  },
  {
    region: 'johto',
    id: 'johto_bugsy',
    category: 'johto',
    type: 'Bug',
    name: 'Bugsy',
    subtitle: 'Insignia Hive',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bugsy.png',
    quote: '"Insetos evoluem rapido. Vamos ver se voce acompanha!"',
    reward: 7000,
    unlockFlag: 'hive_badge',
    requiresFlag: 'johto_slowpoke_well_cleared',
    team: [{ id: 123, level: 20 }, { id: 11, level: 18 }, { id: 14, level: 18 }],
    background: "url('/bg_ilex_forest.png') center/cover no-repeat",
    location: 'Azalea Gym',
  },
  {
    region: 'johto',
    id: 'johto_whitney',
    category: 'johto',
    type: 'Normal',
    name: 'Whitney',
    subtitle: 'Insignia Plain',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/whitney.png',
    quote: '"Meus Pokemon sao fofos, mas batem forte!"',
    reward: 8500,
    unlockFlag: 'plain_badge',
    requiresFlag: 'hive_badge',
    team: [{ id: 35, level: 25 }, { id: 241, level: 27 }, { id: 39, level: 26 }],
    background: "url('/bg_goldenrod_city.png') center/cover no-repeat",
    location: 'Goldenrod Gym',
  },
  {
    region: 'johto',
    id: 'johto_morty',
    category: 'johto',
    type: 'Ghost',
    name: 'Morty',
    subtitle: 'Insignia Fog',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/morty.png',
    quote: '"Ecruteak guarda historias que atravessam o tempo."',
    reward: 9500,
    unlockFlag: 'fog_badge',
    requiresFlag: 'plain_badge',
    team: [{ id: 92, level: 30 }, { id: 93, level: 31 }, { id: 94, level: 33 }],
    background: "url('/bg_ecruteak_city.png') center/cover no-repeat",
    location: 'Ecruteak Gym',
  },
  {
    region: 'johto',
    id: 'johto_chuck',
    category: 'johto',
    type: 'Fighting',
    name: 'Chuck',
    subtitle: 'Insignia Storm',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/chuck.png',
    quote: '"Forca bruta tambem e disciplina!"',
    reward: 11000,
    unlockFlag: 'storm_badge',
    requiresFlag: 'fog_badge',
    team: [{ id: 57, level: 36 }, { id: 62, level: 38 }, { id: 107, level: 37 }],
    background: "url('/bg_cianwood_city.png') center/cover no-repeat",
    location: 'Cianwood Gym',
  },
  {
    region: 'johto',
    id: 'johto_jasmine',
    category: 'johto',
    type: 'Steel',
    name: 'Jasmine',
    subtitle: 'Insignia Mineral',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/jasmine.png',
    quote: '"O tipo Aco exige paciencia e resistencia."',
    reward: 12000,
    unlockFlag: 'mineral_badge',
    requiresFlag: 'storm_badge',
    team: [{ id: 81, level: 38 }, { id: 82, level: 39 }, { id: 208, level: 41 }],
    background: "url('/bg_olivine_city.png') center/cover no-repeat",
    location: 'Olivine Gym',
  },
  {
    region: 'johto',
    id: 'johto_rocket_radio',
    category: 'rocket',
    name: 'Rocket - Radio Tower',
    subtitle: 'Crise em Goldenrod',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"A transmissao da Equipe Rocket ecoara por toda Johto!"',
    reward: 15000,
    unlockFlag: 'johto_rocket_radio_cleared',
    requiresFlag: 'mineral_badge',
    team: [{ id: 41, level: 42 }, { id: 109, level: 43 }, { id: 229, level: 45 }],
    background: "url('/bg_radio_tower_interior.png') center/cover no-repeat",
    location: 'Goldenrod Radio Tower',
  },
  {
    region: 'johto',
    id: 'johto_pryce',
    category: 'johto',
    type: 'Ice',
    name: 'Pryce',
    subtitle: 'Insignia Glacier',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/pryce.png',
    quote: '"O gelo ensina a resistir antes de atacar."',
    reward: 13500,
    unlockFlag: 'glacier_badge',
    requiresFlag: 'johto_rocket_radio_cleared',
    team: [{ id: 87, level: 46 }, { id: 221, level: 46 }, { id: 124, level: 48 }],
    background: "url('/bg_ice_path.png') center/cover no-repeat",
    location: 'Mahogany Gym',
  },
  {
    region: 'johto',
    id: 'johto_clair',
    category: 'johto',
    type: 'Dragon',
    name: 'Clair',
    subtitle: 'Insignia Rising',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/clair.png',
    quote: '"Dragões obedecem apenas treinadores dignos."',
    reward: 16000,
    unlockFlag: 'rising_badge',
    requiresFlag: 'glacier_badge',
    team: [{ id: 148, level: 50 }, { id: 130, level: 52 }, { id: 230, level: 54 }],
    background: "url('/bg_blackthorn_city.png') center/cover no-repeat",
    location: 'Blackthorn Gym',
  },
  {
    region: 'johto',
    id: 'johto_rival_victory',
    category: 'rival',
    name: 'Rival - Victory Road',
    subtitle: 'Ultima barreira',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Eu tambem cheguei ate aqui. Nao vou deixar voce passar sem lutar!"',
    reward: 18000,
    unlockFlag: 'johto_rival_victory_defeated',
    requiresFlag: 'rising_badge',
    team: [{ id: 169, level: 55 }, { id: 94, level: 55 }, { id: 65, level: 56 }, { id: 160, level: 58 }],
    background: "url('/bg_victory_road_johto.png') center/cover no-repeat",
    location: 'Victory Road Johto',
  },
  {
    region: 'johto',
    id: 'johto_will',
    category: 'johto',
    name: 'Will - Elite Four',
    subtitle: 'Mestre Psiquico',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/will.png',
    quote: '"Eu treinei ao redor do mundo para aperfeiçoar meus poderes psíquicos!"',
    reward: 20000,
    unlockFlag: 'johto_will_defeated',
    requiresFlag: 'rising_badge',
    team: [{ id: 178, level: 50 }, { id: 124, level: 50 }, { id: 103, level: 50 }, { id: 80, level: 52 }, { id: 178, level: 52 }],
    background: "url('/bg_johto_league.png') center/cover no-repeat",
    location: 'Liga de Johto',
  },
  {
    region: 'johto',
    id: 'johto_koga',
    category: 'johto',
    name: 'Koga - Elite Four',
    subtitle: 'Mestre Venenoso',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/koga.png',
    quote: '"Fwahahaha! Experimente o meu novo arsenal de venenos ninja!"',
    reward: 22000,
    unlockFlag: 'johto_koga_e4_defeated',
    requiresFlag: 'johto_will_defeated',
    team: [{ id: 168, level: 52 }, { id: 205, level: 52 }, { id: 89, level: 54 }, { id: 49, level: 54 }, { id: 169, level: 56 }],
    background: "url('/bg_johto_league.png') center/cover no-repeat",
    location: 'Liga de Johto',
  },
  {
    region: 'johto',
    id: 'johto_bruno',
    category: 'johto',
    name: 'Bruno - Elite Four',
    subtitle: 'Mestre de Luta',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bruno.png',
    quote: '"Eu continuo treinando meus músculos e meus Pokemon todos os dias!"',
    reward: 24000,
    unlockFlag: 'johto_bruno_e4_defeated',
    requiresFlag: 'johto_koga_e4_defeated',
    team: [{ id: 237, level: 54 }, { id: 106, level: 54 }, { id: 107, level: 54 }, { id: 95, level: 56 }, { id: 68, level: 58 }],
    background: "url('/bg_johto_league.png') center/cover no-repeat",
    location: 'Liga de Johto',
  },
  {
    region: 'johto',
    id: 'johto_karen',
    category: 'johto',
    name: 'Karen - Elite Four',
    subtitle: 'Mestra Sombria',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/karen.png',
    quote: '"Pokemon fortes, Pokemon fracos... isso e apenas a percepção egoísta das pessoas."',
    reward: 26000,
    unlockFlag: 'johto_karen_defeated',
    requiresFlag: 'johto_bruno_e4_defeated',
    team: [{ id: 197, level: 56 }, { id: 45, level: 56 }, { id: 198, level: 58 }, { id: 94, level: 58 }, { id: 229, level: 60 }],
    background: "url('/bg_johto_league.png') center/cover no-repeat",
    location: 'Liga de Johto',
  },
  {
    region: 'johto',
    id: 'johto_champion_lance',
    category: 'johto',
    name: 'Campeao Lance',
    subtitle: 'Liga de Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lance.png',
    quote: '"Mostre que sua nova jornada tambem merece entrar para a historia."',
    reward: 50000,
    unlockFlag: 'johto_champion',
    requiresFlag: 'johto_karen_defeated',
    team: [{ id: 130, level: 60 }, { id: 142, level: 60 }, { id: 149, level: 62 }, { id: 149, level: 63 }, { id: 149, level: 64 }],
    background: "url('/bg_johto_league.png') center/cover no-repeat",
    location: 'Liga Pokemon de Johto',
  },

  // --- HOENN GYMS ---
  {
    region: 'hoenn',
    id: 'hoenn_roxanne',
    category: 'hoenn',
    type: 'Rock',
    name: 'Roxanne',
    subtitle: 'Insignia Stone',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/roxanne.png',
    quote: '"Eu sou graduada na Academia de Treinadores! Vamos batalhar!"',
    reward: 12000,
    unlockFlag: 'stone_badge',
    requiresFlag: 'hoenn_started',
    team: [{ id: 304, level: 12 }, { id: 304, level: 14 }, { id: 299, level: 15 }],
    background: "url('/bg_rustboro_city.png') center/cover no-repeat",
    location: 'Rustboro Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_brawly',
    category: 'hoenn',
    type: 'Fighting',
    name: 'Brawly',
    subtitle: 'Insignia Knuckle',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brawly.png',
    quote: '"Eu surfo nas grandes ondas e luto contra grandes oponentes!"',
    reward: 14000,
    unlockFlag: 'knuckle_badge',
    requiresFlag: 'stone_badge',
    team: [{ id: 296, level: 17 }, { id: 296, level: 18 }, { id: 307, level: 19 }],
    background: "url('/bg_dewford_town.png') center/cover no-repeat",
    location: 'Dewford Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_wattson',
    category: 'hoenn',
    type: 'Electric',
    name: 'Wattson',
    subtitle: 'Insignia Dynamo',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/wattson.png',
    quote: '"Wahahaha! A eletricidade e a alma do meu ginasio!"',
    reward: 16000,
    unlockFlag: 'dynamo_badge',
    requiresFlag: 'knuckle_badge',
    team: [{ id: 100, level: 20 }, { id: 310, level: 22 }, { id: 82, level: 24 }],
    background: "url('/bg_mauville_city.png') center/cover no-repeat",
    location: 'Mauville Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_flannery',
    category: 'hoenn',
    type: 'Fire',
    name: 'Flannery',
    subtitle: 'Insignia Heat',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/flannery.png',
    quote: '"Eu sou a nova lider daqui, mas o meu fogo queima como ninguem!"',
    reward: 18000,
    unlockFlag: 'heat_badge',
    requiresFlag: 'dynamo_badge',
    team: [{ id: 218, level: 24 }, { id: 218, level: 26 }, { id: 323, level: 29 }],
    background: "url('/bg_lavaridge_town.png') center/cover no-repeat",
    location: 'Lavaridge Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_norman',
    category: 'hoenn',
    type: 'Normal',
    name: 'Norman',
    subtitle: 'Insignia Balance',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/norman.png',
    quote: '"Sera uma honra batalhar contra meu proprio filho(a)!"',
    reward: 20000,
    unlockFlag: 'balance_badge',
    requiresFlag: 'heat_badge',
    team: [{ id: 288, level: 27 }, { id: 288, level: 29 }, { id: 289, level: 31 }],
    background: "url('/bg_petalburg_city.png') center/cover no-repeat",
    location: 'Petalburg Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_winona',
    category: 'hoenn',
    type: 'Flying',
    name: 'Winona',
    subtitle: 'Insignia Feather',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/winona.png',
    quote: '"Eu sou uma com os ventos! Teste suas asas contra mim!"',
    reward: 22000,
    unlockFlag: 'feather_badge',
    requiresFlag: 'balance_badge',
    team: [{ id: 277, level: 29 }, { id: 279, level: 30 }, { id: 227, level: 31 }, { id: 334, level: 33 }],
    background: "url('/bg_fortree_city.png') center/cover no-repeat",
    location: 'Fortree Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_tate_liza',
    category: 'hoenn',
    type: 'Psychic',
    name: 'Tate & Liza',
    subtitle: 'Insignia Mind',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/tateandliza.png',
    quote: '"Duas mentes, um so objetivo: derrotar voce!"',
    reward: 25000,
    unlockFlag: 'mind_badge',
    requiresFlag: 'feather_badge',
    team: [{ id: 337, level: 42 }, { id: 338, level: 42 }],
    background: "url('/bg_mossdeep_city.png') center/cover no-repeat",
    location: 'Mossdeep Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_wallace',
    category: 'hoenn',
    type: 'Water',
    name: 'Wallace',
    subtitle: 'Insignia Rain',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/wallace.png',
    quote: '"A elegancia da agua e insuperavel. Aprecie este espetaculo!"',
    reward: 30000,
    unlockFlag: 'rain_badge',
    requiresFlag: 'mind_badge',
    team: [{ id: 370, level: 41 }, { id: 340, level: 43 }, { id: 339, level: 43 }, { id: 119, level: 46 }, { id: 350, level: 55 }],
    background: "url('/bg_sootopolis_city.png') center/cover no-repeat",
    location: 'Sootopolis Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_sidney',
    category: 'hoenn',
    type: 'Dark',
    name: 'Sidney - Elite Four',
    subtitle: 'Mestre Sombrio',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/sidney.png',
    quote: '"Batalhas devem ser estilosas. Vamos nessa!"',
    reward: 38000,
    unlockFlag: 'hoenn_sidney_defeated',
    requiresFlag: 'rain_badge',
    team: [{ id: 262, level: 88 }, { id: 332, level: 90 }, { id: 359, level: 92 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Liga de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_phoebe',
    category: 'hoenn',
    type: 'Ghost',
    name: 'Phoebe - Elite Four',
    subtitle: 'Mestra Fantasma',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/phoebe.png',
    quote: '"Meus Pokemon espirituais dancam com a montanha."',
    reward: 40000,
    unlockFlag: 'hoenn_phoebe_defeated',
    requiresFlag: 'hoenn_sidney_defeated',
    team: [{ id: 356, level: 90 }, { id: 354, level: 92 }, { id: 302, level: 94 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Liga de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_glacia',
    category: 'hoenn',
    type: 'Ice',
    name: 'Glacia - Elite Four',
    subtitle: 'Mestra do Gelo',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/glacia.png',
    quote: '"O frio revela a disciplina do treinador."',
    reward: 42000,
    unlockFlag: 'hoenn_glacia_defeated',
    requiresFlag: 'hoenn_phoebe_defeated',
    team: [{ id: 364, level: 92 }, { id: 362, level: 94 }, { id: 365, level: 96 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Liga de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_drake',
    category: 'hoenn',
    type: 'Dragon',
    name: 'Drake - Elite Four',
    subtitle: 'Mestre Dragao',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/drake.png',
    quote: '"Dragoes reconhecem apenas uma vontade firme."',
    reward: 45000,
    unlockFlag: 'hoenn_drake_defeated',
    requiresFlag: 'hoenn_glacia_defeated',
    team: [{ id: 330, level: 94 }, { id: 230, level: 96 }, { id: 373, level: 98 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Liga de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_champion_steven',
    category: 'hoenn',
    type: 'Steel',
    name: 'Campeao Steven',
    subtitle: 'Campeao de Hoenn',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/steven.png',
    quote: '"Pedras raras, aco e amizade. Mostre o brilho do seu time."',
    reward: 80000,
    unlockFlag: 'hoenn_champion',
    requiresFlag: 'hoenn_drake_defeated',
    team: [{ id: 227, level: 96 }, { id: 306, level: 97 }, { id: 344, level: 98 }, { id: 376, level: 100 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Liga Pokemon de Hoenn',
  },
  // REVANCHE - KANTO (Desbloqueado após ser Campeão de Kanto)
  {
    region: 'kanto',
    id: 'rematch_brock',
    category: 'rematch',
    name: 'Brock (Revanche)',
    subtitle: 'Elite Kanto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brock.png',
    quote: '"Meus Pokemon de rocha estao mais solidos do que nunca!"',
    reward: 25000,
    unlockFlag: 'rematch_brock_defeated',
    requiresFlag: 'champion',
    team: [{id: 74, level: 70}, {id: 75, level: 70}, {id: 95, level: 72}, {id: 141, level: 71}, {id: 139, level: 71}],
    background: "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat",
    location: 'Pewter Gym',
  },
  {
    region: 'kanto',
    id: 'rematch_misty',
    category: 'rematch',
    name: 'Misty (Revanche)',
    subtitle: 'Elite Kanto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/misty.png',
    quote: '"Prepare-se para enfrentar o meu novo time de sereias guerreiras!"',
    reward: 25000,
    unlockFlag: 'rematch_misty_defeated',
    requiresFlag: 'champion',
    team: [{id: 121, level: 70}, {id: 55, level: 71}, {id: 195, level: 72}, {id: 131, level: 73}, {id: 9, level: 75}],
    background: "url('/battle_bg_gym_water.png') center/cover no-repeat",
    location: 'Cerulean Gym',
  },
  {
    region: 'kanto',
    id: 'rematch_surge',
    category: 'rematch',
    name: 'Lt. Surge (Revanche)',
    subtitle: 'Elite Kanto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png',
    quote: '"Hah! Vou te dar um choque de realidade agora!"',
    reward: 25000,
    unlockFlag: 'rematch_surge_defeated',
    requiresFlag: 'champion',
    team: [{id: 26, level: 70}, {id: 101, level: 71}, {id: 82, level: 72}, {id: 125, level: 73}, {id: 135, level: 75}],
    background: "url('/battle_bg_gym_electric.png') center/cover no-repeat",
    location: 'Vermilion Gym',
  },
  {
    region: 'kanto',
    id: 'rematch_erika',
    category: 'rematch',
    name: 'Erika (Revanche)',
    subtitle: 'Elite Kanto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/erika.png',
    quote: '"A beleza da natureza e forte e resiliente."',
    reward: 25000,
    unlockFlag: 'rematch_erika_defeated',
    requiresFlag: 'champion',
    team: [{id: 71, level: 70}, {id: 45, level: 71}, {id: 182, level: 72}, {id: 189, level: 73}, {id: 103, level: 75}],
    background: "url('/battle_bg_forest_1776863795763.png') center/cover no-repeat",
    location: 'Celadon Gym',
  },
  {
    region: 'kanto',
    id: 'rematch_sabrina',
    category: 'rematch',
    name: 'Sabrina (Revanche)',
    subtitle: 'Elite Kanto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/sabrina.png',
    quote: '"Eu previ que voce voltaria. Mas eu tambem previ minha vitoria."',
    reward: 25000,
    unlockFlag: 'rematch_sabrina_defeated',
    requiresFlag: 'champion',
    team: [{id: 65, level: 75}, {id: 122, level: 73}, {id: 196, level: 74}, {id: 124, level: 74}, {id: 97, level: 75}],
    background: "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat",
    location: 'Saffron Gym',
  },
  {
    region: 'kanto',
    id: 'rematch_blaine',
    category: 'rematch',
    name: 'Blaine (Revanche)',
    subtitle: 'Elite Kanto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blaine.png',
    quote: '"Minhas charadas agora estao pegando fogo!"',
    reward: 25000,
    unlockFlag: 'rematch_blaine_defeated',
    requiresFlag: 'champion',
    team: [{id: 126, level: 75}, {id: 78, level: 75}, {id: 136, level: 76}, {id: 219, level: 76}, {id: 59, level: 78}],
    background: "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat",
    location: 'Cinnabar Gym',
  },
  {
    region: 'kanto',
    id: 'rematch_giovanni',
    category: 'rematch',
    name: 'Giovanni (Revanche)',
    subtitle: 'Elite Kanto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/giovanni.png',
    quote: '"A Equipe Rocket pode ter acabado, mas minha força e eterna."',
    reward: 35000,
    unlockFlag: 'rematch_giovanni_defeated',
    requiresFlag: 'champion',
    team: [{id: 112, level: 78}, {id: 34, level: 78}, {id: 31, level: 78}, {id: 51, level: 78}, {id: 76, level: 80}],
    background: "url('/battle_bg_gym_1776863824590.png') center/cover no-repeat",
    location: 'Viridian Gym',
  },
  // REVANCHE - JOHTO (Desbloqueado após ser Campeão de Johto)
  {
    region: 'johto',
    id: 'rematch_falkner',
    category: 'rematch',
    name: 'Falkner (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/falkner.png',
    quote: '"Meus Pokemon voadores alcançaram novos horizontes!"',
    reward: 30000,
    unlockFlag: 'rematch_falkner_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 164, level: 85}, {id: 18, level: 85}, {id: 198, level: 86}, {id: 227, level: 87}, {id: 169, level: 88}],
    background: "url('/bg_violet_city.png') center/cover no-repeat",
    location: 'Violet Gym',
  },
  {
    region: 'johto',
    id: 'rematch_bugsy',
    category: 'rematch',
    name: 'Bugsy (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bugsy.png',
    quote: '"Vou te mostrar o quanto meus Pokemon insetos evoluíram!"',
    reward: 30000,
    unlockFlag: 'rematch_bugsy_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 212, level: 85}, {id: 127, level: 86}, {id: 214, level: 87}, {id: 205, level: 88}, {id: 193, level: 88}],
    background: "url('/bg_ilex_forest.png') center/cover no-repeat",
    location: 'Azalea Gym',
  },
  {
    region: 'johto',
    id: 'rematch_whitney',
    category: 'rematch',
    name: 'Whitney (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/whitney.png',
    quote: '"Nao chore dessa vez! Porque eu nao vou facilitar!"',
    reward: 30000,
    unlockFlag: 'rematch_whitney_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 241, level: 87}, {id: 40, level: 87}, {id: 217, level: 88}, {id: 36, level: 89}, {id: 242, level: 90}],
    background: "url('/bg_goldenrod_city.png') center/cover no-repeat",
    location: 'Goldenrod Gym',
  },
  {
    region: 'johto',
    id: 'rematch_morty',
    category: 'rematch',
    name: 'Morty (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/morty.png',
    quote: '"As almas dos meus fantasmas se tornaram mais brilhantes!"',
    reward: 30000,
    unlockFlag: 'rematch_morty_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 94, level: 88}, {id: 200, level: 89}, {id: 93, level: 88}, {id: 197, level: 90}, {id: 94, level: 92}],
    background: "url('/bg_ecruteak_city.png') center/cover no-repeat",
    location: 'Ecruteak Gym',
  },
  {
    region: 'johto',
    id: 'rematch_chuck',
    category: 'rematch',
    name: 'Chuck (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/chuck.png',
    quote: '"Focamos em 24 horas de treino por dia!"',
    reward: 30000,
    unlockFlag: 'rematch_chuck_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 62, level: 89}, {id: 57, level: 89}, {id: 68, level: 90}, {id: 237, level: 91}, {id: 214, level: 92}],
    background: "url('/bg_cianwood_city.png') center/cover no-repeat",
    location: 'Cianwood Gym',
  },
  {
    region: 'johto',
    id: 'rematch_jasmine',
    category: 'rematch',
    name: 'Jasmine (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/jasmine.png',
    quote: '"O aço e frio, mas meu desejo de vencer e quente!"',
    reward: 30000,
    unlockFlag: 'rematch_jasmine_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 208, level: 90}, {id: 227, level: 90}, {id: 82, level: 91}, {id: 205, level: 92}, {id: 212, level: 94}],
    background: "url('/bg_olivine_city.png') center/cover no-repeat",
    location: 'Olivine Gym',
  },
  {
    region: 'johto',
    id: 'rematch_pryce',
    category: 'rematch',
    name: 'Pryce (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/pryce.png',
    quote: '"O gelo nao quebra, ele apenas se torna mais duro!"',
    reward: 30000,
    unlockFlag: 'rematch_pryce_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 87, level: 91}, {id: 221, level: 91}, {id: 91, level: 92}, {id: 131, level: 93}, {id: 221, level: 95}],
    background: "url('/bg_ice_path.png') center/cover no-repeat",
    location: 'Mahogany Gym',
  },
  {
    region: 'johto',
    id: 'rematch_clair',
    category: 'rematch',
    name: 'Clair (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/clair.png',
    quote: '"Como a maior domadora de dragões, eu nao permitirei sua vitoria!"',
    reward: 40000,
    unlockFlag: 'rematch_clair_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 230, level: 92}, {id: 148, level: 92}, {id: 149, level: 94}, {id: 130, level: 94}, {id: 6, level: 96}],
    background: "url('/bg_blackthorn_city.png') center/cover no-repeat",
    location: 'Blackthorn Gym',
  },
  {
    region: 'johto',
    id: 'rematch_lance',
    category: 'rematch',
    name: 'Lance (Revanche Suprema)',
    subtitle: 'Mestre da Liga',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lance.png',
    quote: '"Um verdadeiro mestre nunca para de evoluir. Vamos lutar pelo topo!"',
    reward: 100000,
    unlockFlag: 'rematch_lance_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 149, level: 98}, {id: 149, level: 98}, {id: 149, level: 100}, {id: 130, level: 97}, {id: 142, level: 97}, {id: 230, level: 99}],
    background: "url('/bg_johto_league.png') center/cover no-repeat",
    location: 'Liga Pokemon de Johto',
  },

  {
    region: 'kanto',
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
    region: 'kanto',
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
    region: 'kanto',
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
    region: 'kanto',
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
    region: 'johto',
    id: 'raikou',
    category: 'legendary',
    name: 'Raikou',
    subtitle: 'Besta Eletrica',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/243.png',
    quote: '"Roar!"',
    reward: 20000,
    unlockFlag: 'raikou_defeated',
    requiresFlag: 'johto_champion',
    team: [{ id: 243, level: 50 }],
    background: "url('/bg_route32_johto.png') center/cover no-repeat",
    location: 'Rotas de Johto',
  },
  {
    region: 'johto',
    id: 'entei',
    category: 'legendary',
    name: 'Entei',
    subtitle: 'Besta de Fogo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png',
    quote: '"Roar!"',
    reward: 20000,
    unlockFlag: 'entei_defeated',
    requiresFlag: 'johto_champion',
    team: [{ id: 244, level: 50 }],
    background: "url('/bg_ilex_forest.png') center/cover no-repeat",
    location: 'Rotas de Johto',
  },
  {
    region: 'johto',
    id: 'suicune',
    category: 'legendary',
    name: 'Suicune',
    subtitle: 'Besta Aquatica',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/245.png',
    quote: '"Roar!"',
    reward: 20000,
    unlockFlag: 'suicune_defeated',
    requiresFlag: 'johto_champion',
    team: [{ id: 245, level: 50 }],
    background: "url('/battle_bg_johto_water_1777340582200.png') center/cover no-repeat",
    location: 'Rotas de Johto',
  },
  {
    region: 'johto',
    id: 'lugia',
    category: 'legendary',
    name: 'Lugia',
    subtitle: 'Guardiao dos Mares',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png',
    quote: '"Shaaaow!"',
    reward: 50000,
    unlockFlag: 'lugia_defeated',
    requiresFlag: 'johto_champion',
    team: [{ id: 249, level: 60 }],
    background: "url('/bg_whirl_islands.png') center/cover no-repeat",
    location: 'Whirl Islands',
  },
  {
    region: 'johto',
    id: 'ho_oh',
    category: 'legendary',
    name: 'Ho-Oh',
    subtitle: 'Guardiao dos Ceus',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png',
    quote: '"Shaaaow!"',
    reward: 50000,
    unlockFlag: 'ho_oh_defeated',
    requiresFlag: 'johto_champion',
    team: [{ id: 250, level: 60 }],
    background: "url('/bg_tin_tower.png') center/cover no-repeat",
    location: 'Bell Tower',
  },
  {
    region: 'johto',
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
  },
  // HOENN CHALLENGES
  {
    region: 'hoenn',
    id: 'hoenn_rival_littleroot',
    category: 'rival',
    name: 'Brendan - Littleroot',
    subtitle: 'Nova Rivalidade',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"Hoenn e um lugar incrivel! Vamos ver se voce esta pronto!"',
    reward: 15000,
    unlockFlag: 'hoenn_rival_1_defeated',
    requiresFlag: 'hoenn_started',
    team: [{ id: 252, level: 6 }, { id: 255, level: 6 }, { id: 258, level: 6 }],
    background: "url('/bg_littleroot.png') center/cover no-repeat",
    location: 'Littleroot Town',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rival_granite',
    category: 'rival',
    name: 'Brendan - Granite Cave',
    subtitle: 'Teste em Dewford',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"Voce ja tem uma insignia. Agora mostre que sabe explorar Hoenn!"',
    reward: 16000,
    unlockFlag: 'hoenn_granite_rival_defeated',
    requiresFlag: 'hoenn_granite_cave_cleared',
    team: [{ id: 276, level: 20 }, { id: 304, level: 21 }, { id: 252, level: 22 }],
    background: "url('/bg_granite_cave.png') center/cover no-repeat",
    location: 'Granite Cave',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rival_mauville',
    category: 'rival',
    name: 'Brendan - Mauville',
    subtitle: 'Batalha na Cycling Road',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"A jornada acelera daqui para frente!"',
    reward: 18000,
    unlockFlag: 'hoenn_rival_mauville_defeated',
    requiresFlag: 'dynamo_badge',
    team: [{ id: 277, level: 30 }, { id: 271, level: 31 }, { id: 256, level: 33 }],
    background: "url('/bg_route110.png') center/cover no-repeat",
    location: 'Mauville City',
  },
  {
    region: 'hoenn',
    id: 'hoenn_magma_meteor',
    category: 'rocket',
    name: 'Team Magma - Meteor Falls',
    subtitle: 'Roubo do Meteorito',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"Este meteorito vai despertar o poder da terra!"',
    reward: 19000,
    unlockFlag: 'hoenn_magma_meteor_cleared',
    requiresFlag: 'dynamo_badge',
    team: [{ id: 322, level: 34 }, { id: 304, level: 35 }, { id: 262, level: 36 }],
    background: "url('/bg_meteor_falls.png') center/cover no-repeat",
    location: 'Meteor Falls',
  },
  {
    region: 'hoenn',
    id: 'hoenn_magma_chimney',
    category: 'rocket',
    name: 'Team Magma - Mt. Chimney',
    subtitle: 'Plano no Vulcao',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"O vulcao vai responder ao Team Magma!"',
    reward: 22000,
    unlockFlag: 'hoenn_magma_chimney_cleared',
    requiresFlag: 'hoenn_magma_meteor_cleared',
    team: [{ id: 323, level: 40 }, { id: 262, level: 40 }, { id: 229, level: 42 }],
    background: "url('/bg_mt_chimney.png') center/cover no-repeat",
    location: 'Mt. Chimney',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rival_lilycove',
    category: 'rival',
    name: 'Brendan - Lilycove',
    subtitle: 'Rivalidade Madura',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"Esta e a hora de ver quem realmente cresceu em Hoenn."',
    reward: 26000,
    unlockFlag: 'hoenn_rival_lilycove_defeated',
    requiresFlag: 'feather_badge',
    team: [{ id: 277, level: 54 }, { id: 272, level: 55 }, { id: 310, level: 56 }, { id: 257, level: 58 }],
    background: "url('/bg_lilycove_city.png') center/cover no-repeat",
    location: 'Lilycove City',
  },
  {
    region: 'hoenn',
    id: 'hoenn_aqua_pyre',
    category: 'rocket',
    name: 'Team Aqua - Mt. Pyre',
    subtitle: 'Orbe Azul',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"O mar vai cobrir tudo. Saia do caminho!"',
    reward: 27000,
    unlockFlag: 'hoenn_aqua_pyre_cleared',
    requiresFlag: 'hoenn_rival_lilycove_defeated',
    team: [{ id: 319, level: 60 }, { id: 342, level: 61 }, { id: 262, level: 62 }],
    background: "url('/bg_mt_pyre.png') center/cover no-repeat",
    location: 'Mt. Pyre',
  },
  {
    region: 'hoenn',
    id: 'hoenn_aqua_hideout',
    category: 'rocket',
    name: 'Team Aqua - Esconderijo',
    subtitle: 'Submarino Roubado',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"Voce chegou tarde demais!"',
    reward: 29000,
    unlockFlag: 'hoenn_aqua_hideout_cleared',
    requiresFlag: 'hoenn_aqua_pyre_cleared',
    team: [{ id: 319, level: 66 }, { id: 260, level: 68 }, { id: 310, level: 68 }],
    background: "url('/bg_lilycove_city.png') center/cover no-repeat",
    location: 'Lilycove Hideout',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rival_mossdeep',
    category: 'rival',
    name: 'Brendan - Mossdeep',
    subtitle: 'Antes do Abismo',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"O Team Aqua esta indo fundo demais. Precisamos estar prontos."',
    reward: 32000,
    unlockFlag: 'hoenn_rival_mossdeep_defeated',
    requiresFlag: 'mind_badge',
    team: [{ id: 279, level: 72 }, { id: 344, level: 74 }, { id: 310, level: 74 }, { id: 260, level: 76 }],
    background: "url('/bg_mossdeep_city.png') center/cover no-repeat",
    location: 'Mossdeep City',
  },
  {
    region: 'hoenn',
    id: 'hoenn_aqua_seafloor',
    category: 'rocket',
    name: 'Team Aqua - Seafloor Cavern',
    subtitle: 'Kyogre Desperta',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"Este e o nascimento de um novo oceano!"',
    reward: 36000,
    unlockFlag: 'hoenn_aqua_seafloor_cleared',
    requiresFlag: 'hoenn_rival_mossdeep_defeated',
    team: [{ id: 319, level: 78 }, { id: 260, level: 80 }, { id: 382, level: 82 }],
    background: "url('/bg_seafloor_cavern.png') center/cover no-repeat",
    location: 'Seafloor Cavern',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_roxanne',
    category: 'rematch',
    name: 'Roxanne (Revanche)',
    subtitle: 'Mestra de Pedra',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/roxanne.png',
    quote: '"Minhas pedras estao mais resistentes do que nunca!"',
    reward: 25000,
    unlockFlag: 'hoenn_rematch_roxanne_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 299, level: 80 }, { id: 348, level: 82 }],
    background: "url('/bg_gym_stone.png') center/cover no-repeat",
    location: 'Rustboro Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_brawly',
    category: 'rematch',
    type: 'Fighting',
    name: 'Brawly (Revanche)',
    subtitle: 'Mestre Marcial',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brawly.png',
    quote: '"A onda esta maior agora. Aguente firme!"',
    reward: 30000,
    unlockFlag: 'hoenn_rematch_brawly_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 297, level: 82 }, { id: 308, level: 84 }, { id: 286, level: 86 }],
    background: "url('/bg_dewford_town.png') center/cover no-repeat",
    location: 'Dewford Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_wattson',
    category: 'rematch',
    type: 'Electric',
    name: 'Wattson (Revanche)',
    subtitle: 'Circuito Maximo',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/wattson.png',
    quote: '"Wahahaha! Esta carga vai iluminar Mauville inteira!"',
    reward: 32000,
    unlockFlag: 'hoenn_rematch_wattson_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 310, level: 84 }, { id: 82, level: 85 }, { id: 101, level: 86 }, { id: 181, level: 88 }],
    background: "url('/bg_mauville_city.png') center/cover no-repeat",
    location: 'Mauville Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_flannery',
    category: 'rematch',
    type: 'Fire',
    name: 'Flannery (Revanche)',
    subtitle: 'Forno do Vulcao',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/flannery.png',
    quote: '"Meu fogo amadureceu. Vamos ver o seu time resistir!"',
    reward: 34000,
    unlockFlag: 'hoenn_rematch_flannery_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 323, level: 86 }, { id: 324, level: 87 }, { id: 229, level: 88 }, { id: 257, level: 90 }],
    background: "url('/bg_lavaridge_town.png') center/cover no-repeat",
    location: 'Lavaridge Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_norman',
    category: 'rematch',
    type: 'Normal',
    name: 'Norman (Revanche)',
    subtitle: 'Teste do Campeao',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/norman.png',
    quote: '"Agora eu batalho contra um campeao. De pai para treinador."',
    reward: 36000,
    unlockFlag: 'hoenn_rematch_norman_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 289, level: 88 }, { id: 295, level: 88 }, { id: 335, level: 90 }, { id: 143, level: 92 }],
    background: "url('/bg_petalburg_city.png') center/cover no-repeat",
    location: 'Petalburg Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_winona',
    category: 'rematch',
    type: 'Flying',
    name: 'Winona (Revanche)',
    subtitle: 'Ceu Superior',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/winona.png',
    quote: '"Os ventos de Fortree agora sopram no nivel da Liga!"',
    reward: 38000,
    unlockFlag: 'hoenn_rematch_winona_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 334, level: 90 }, { id: 227, level: 91 }, { id: 279, level: 92 }, { id: 373, level: 94 }],
    background: "url('/bg_fortree_city.png') center/cover no-repeat",
    location: 'Fortree Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_tate_liza',
    category: 'rematch',
    type: 'Psychic',
    name: 'Tate & Liza (Revanche)',
    subtitle: 'Dupla Astral',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/tateandliza.png',
    quote: '"Duas estrelas, uma estrategia perfeita!"',
    reward: 42000,
    unlockFlag: 'hoenn_rematch_tate_liza_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 337, level: 92 }, { id: 338, level: 92 }, { id: 344, level: 94 }, { id: 376, level: 96 }],
    background: "url('/bg_mossdeep_city.png') center/cover no-repeat",
    location: 'Mossdeep Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_wallace',
    category: 'rematch',
    type: 'Water',
    name: 'Wallace (Revanche)',
    subtitle: 'Ato Final',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/wallace.png',
    quote: '"A beleza da agua atinge seu auge contra um campeao."',
    reward: 46000,
    unlockFlag: 'hoenn_rematch_wallace_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 350, level: 94 }, { id: 272, level: 94 }, { id: 340, level: 95 }, { id: 130, level: 96 }, { id: 365, level: 98 }],
    background: "url('/bg_sootopolis_city.png') center/cover no-repeat",
    location: 'Sootopolis Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_steven',
    category: 'rematch',
    type: 'Steel',
    name: 'Steven (Revanche)',
    subtitle: 'Campeao Supremo',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/steven.png',
    quote: '"Vamos polir essa batalha ate ela brilhar."',
    reward: 80000,
    unlockFlag: 'hoenn_rematch_steven_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 227, level: 96 }, { id: 306, level: 97 }, { id: 344, level: 98 }, { id: 346, level: 98 }, { id: 376, level: 99 }, { id: 385, level: 100 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Liga Pokemon de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'rayquaza',
    category: 'legendary',
    name: 'Rayquaza',
    subtitle: 'Soberano dos Ceus',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/384.png',
    quote: '"...!"',
    reward: 150000,
    unlockFlag: 'rayquaza_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 384, level: 85 }],
    background: "url('/bg_sky_pillar.png') center/cover no-repeat",
    location: 'Sky Pillar',
  }
];

const CATEGORY_CONFIG = {
  rival:     { label: 'Rival',         color: '#2563eb', emoji: 'VS'  },
  rocket:    { label: 'Equipe Rocket', color: '#dc2626', emoji: 'R'   },
  johto:     { label: 'Lideres',       color: '#059669', emoji: 'GYM' },
  hoenn:     { label: 'Hoenn GYM',     color: '#10b981', emoji: 'H'   },
  rematch:   { label: 'Revanche',      color: '#f59e0b', emoji: 'EX'  },
  legendary: { label: 'Lendarios',     color: '#7c3aed', emoji: 'L'   },
};

const JOHTO_GYM_ORDER = {
  johto_falkner: 1,
  johto_bugsy: 2,
  johto_whitney: 3,
  johto_morty: 4,
  johto_chuck: 5,
  johto_jasmine: 6,
  johto_pryce: 7,
  johto_clair: 8,
};

const HOENN_GYM_ORDER = {
  hoenn_roxanne: 1,
  hoenn_brawly: 2,
  hoenn_wattson: 3,
  hoenn_flannery: 4,
  hoenn_norman: 5,
  hoenn_winona: 6,
  hoenn_tate_liza: 7,
  hoenn_wallace: 8,
};

const REMATCH_BADGES = {
  rematch_falkner: { badgeId: 'zephyr_badge', order: 1 },
  rematch_bugsy: { badgeId: 'hive_badge', order: 2 },
  rematch_whitney: { badgeId: 'plain_badge', order: 3 },
  rematch_morty: { badgeId: 'fog_badge', order: 4 },
  rematch_chuck: { badgeId: 'storm_badge', order: 5 },
  rematch_jasmine: { badgeId: 'mineral_badge', order: 6 },
  rematch_pryce: { badgeId: 'glacier_badge', order: 7 },
  rematch_clair: { badgeId: 'rising_badge', order: 8 },
  hoenn_rematch_roxanne: { badgeId: 'stone_badge', order: 1 },
  hoenn_rematch_brawly: { badgeId: 'knuckle_badge', order: 2 },
  hoenn_rematch_wattson: { badgeId: 'dynamo_badge', order: 3 },
  hoenn_rematch_flannery: { badgeId: 'heat_badge', order: 4 },
  hoenn_rematch_norman: { badgeId: 'balance_badge', order: 5 },
  hoenn_rematch_winona: { badgeId: 'feather_badge', order: 6 },
  hoenn_rematch_tate_liza: { badgeId: 'mind_badge', order: 7 },
  hoenn_rematch_wallace: { badgeId: 'rain_badge', order: 8 },
};

const REGIONAL_REMATCH_BY_GYM = {
  johto_falkner: 'rematch_falkner',
  johto_bugsy: 'rematch_bugsy',
  johto_whitney: 'rematch_whitney',
  johto_morty: 'rematch_morty',
  johto_chuck: 'rematch_chuck',
  johto_jasmine: 'rematch_jasmine',
  johto_pryce: 'rematch_pryce',
  johto_clair: 'rematch_clair',
  hoenn_roxanne: 'hoenn_rematch_roxanne',
  hoenn_brawly: 'hoenn_rematch_brawly',
  hoenn_wattson: 'hoenn_rematch_wattson',
  hoenn_flannery: 'hoenn_rematch_flannery',
  hoenn_norman: 'hoenn_rematch_norman',
  hoenn_winona: 'hoenn_rematch_winona',
  hoenn_tate_liza: 'hoenn_rematch_tate_liza',
  hoenn_wallace: 'hoenn_rematch_wallace',
};

const getBadgeMeta = (challenge) => {
  if (challenge.category === 'rematch') return REMATCH_BADGES[challenge.id] || { badgeId: challenge.unlockFlag, order: '' };
  if (challenge.region === 'johto') return { badgeId: challenge.unlockFlag, order: JOHTO_GYM_ORDER[challenge.id] || '' };
  if (challenge.region === 'hoenn') return { badgeId: challenge.unlockFlag, order: HOENN_GYM_ORDER[challenge.id] || '' };
  return { badgeId: challenge.unlockFlag, order: '' };
};

const getRegionalRematch = (challenge) => {
  const rematchId = REGIONAL_REMATCH_BY_GYM[challenge.id];
  return rematchId ? CHALLENGES.find(c => c.id === rematchId) : null;
};

const getTypeIconUrl = (type) =>
  type ? `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${type.toLowerCase()}.svg` : null;

const getChallengeColor = (challenge) => {
  if (challenge.type && TYPE_COLOR_HEX[challenge.type]) return TYPE_COLOR_HEX[challenge.type];
  return CATEGORY_CONFIG[challenge.category]?.color || '#334155';
};

const getChallengeCardBackground = (challenge) => {
  const color = getChallengeColor(challenge);
  return challenge.background || `linear-gradient(135deg, ${color} 0%, #0f172a 100%)`;
};

const JohtoLeaderCard = ({ challenge, unlocked, defeated, rematchAvailable = false, onSelect, onRequirementClick, requirementLabel }) => {
  const accentColor = getChallengeColor(challenge);
  const typeIcon = getTypeIconUrl(challenge.type);
  const badgeMeta = getBadgeMeta(challenge);
  const badgeOrder = badgeMeta.order;
  const cardTitle = challenge.category === 'rematch' ? 'REVANCHE' : challenge.category === 'hoenn' ? 'GINASIO' : 'GINASIO';
  const selectable = unlocked && (!defeated || rematchAvailable);

  return (
    <div
      onClick={() => selectable && onSelect(challenge)}
      className={`relative rounded-[2rem] overflow-hidden shadow-xl transition-all border-2 ${
        selectable
          ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] group border-white/15 hover:border-pokeGold/60'
          : 'grayscale cursor-not-allowed opacity-60 border-white/10'
      }`}
      style={{ minHeight: '188px', background: getChallengeCardBackground(challenge) }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/55 to-slate-950/18" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-white/10" />
      <div className="absolute top-0 right-0 w-48 h-48 -mr-16 -mt-16 rounded-full opacity-35 transition-all group-hover:scale-110 group-hover:opacity-50 blur-sm" style={{ backgroundColor: accentColor }} />

      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
        {typeIcon && <img src={typeIcon} className="w-24 h-24 invert" alt="" />}
      </div>

      <div className="absolute top-6 left-8 z-20 text-left max-w-[62%]">
        <h4 className="text-white/60 font-black text-[10px] uppercase tracking-widest leading-none">{cardTitle}{badgeOrder ? ` #${badgeOrder}` : ''}</h4>
        <p className="text-white font-black text-2xl uppercase italic leading-none tracking-tighter mt-1.5 drop-shadow-sm truncate">{challenge.name}</p>
        <div className="mt-4 flex items-center gap-2.5 bg-white/15 backdrop-blur-sm w-fit px-3 py-2 rounded-xl border border-white/20 shadow-sm">
          <div className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: accentColor }}>
            {typeIcon && <img src={typeIcon} className="w-3.5 h-3.5 invert" alt={challenge.type} />}
          </div>
          <span className="text-white text-[10px] font-black uppercase tracking-widest">{challenge.type}</span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          {defeated && <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-emerald-950/30">VENCIDO</span>}
          {rematchAvailable && <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-amber-950/20">REVANCHE</span>}
          {!unlocked && <span className="bg-white/10 text-white/60 text-[9px] font-black px-3 py-1 rounded-full border border-white/15">BLOQUEADO</span>}
        </div>
      </div>

      <div className="flex justify-end pr-4 pt-12 relative z-10 pointer-events-none">
        <img
          src={challenge.sprite}
          alt={challenge.name}
          className="w-36 h-36 object-contain drop-shadow-2xl translate-y-6 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-2"
          onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent">
        <div className="flex items-center gap-4">
          <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
            defeated ? 'border-yellow-400 bg-white shadow-xl shadow-yellow-200/50' : 'border-slate-300/30 bg-slate-100/10 opacity-70'
          }`}>
            <BadgeSVG badgeId={badgeMeta.badgeId} earned={defeated} size={24} />
            {!defeated && <span className="absolute text-[10px] font-black text-white/70">{badgeOrder}</span>}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-white/45 text-[10px] font-black uppercase tracking-widest leading-none mb-1.5 truncate">{challenge.location}</p>
            <p className="text-pokeGold text-[11px] font-black uppercase italic tracking-tight">Desafiar Lider</p>
          </div>
          {!unlocked && (
            <button
              onClick={(e) => { e.stopPropagation(); onRequirementClick(challenge.requiresFlag); }}
              className="max-w-[112px] text-[7px] font-black text-red-300 uppercase bg-black/40 px-2 py-1 rounded-lg border border-red-900/50 hover:bg-black/60 transition-all leading-tight"
            >
              REQ: {requirementLabel}
            </button>
          )}
          {selectable && (
            <div className="w-10 h-10 rounded-full bg-white/12 flex items-center justify-center border border-white/20 text-white group-hover:bg-pokeGold group-hover:text-slate-950 transition-colors shadow-sm">
              <span className="text-lg">VS</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChallengesScreen = ({ 
  gameState, onChallenge, onClose, isEmbedded = false, 
  filterCategories = null, forcedRegion = null, setCurrentView, setVsInitialTab,
  initialCategory, setVsInitialCategory, setVsInitialRegion
}) => {
  const kantoChampion = (gameState.worldFlags || []).includes('champion');
  const [challengeRegion, setChallengeRegion] = React.useState(forcedRegion || 'kanto');
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory || (filterCategories ? filterCategories[0] : 'rival'));
  const [alertMessage, setAlertMessage] = React.useState(null);

  React.useEffect(() => {
    if (forcedRegion) {
      setChallengeRegion(forcedRegion);
    }
  }, [forcedRegion]);

  React.useEffect(() => {
    if (!kantoChampion && challengeRegion === 'johto') setChallengeRegion('kanto');
  }, [kantoChampion, challengeRegion]);

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
    'johto_rival_1_defeated': 'Derrotar o Rival em Cherrygrove',
    'johto_rival_azalea_defeated': 'Vencer o Rival em Azalea',
    'johto_rival_ecruteak_defeated': 'Vencer o Rival na Torre Queimada',
    'johto_rocket_mahogany_cleared': 'Limpar a Base Rocket em Mahogany',
    'johto_rival_tunnel_defeated': 'Vencer o Rival no Tunel de Goldenrod',
    'johto_rival_victory_defeated': 'Derrotar o Rival na Victory Road'
  };

  const handleRequirementClick = (flag) => {
    if (!flag) return;
    const johtoRequirements = ['johto_started', 'johto_route_29_cleared', 'johto_slowpoke_well_cleared', 'zephyr_badge', 'hive_badge', 'plain_badge', 'fog_badge', 'storm_badge', 'mineral_badge', 'johto_rocket_radio_cleared', 'glacier_badge', 'rising_badge', 'johto_rival_victory_defeated', 'johto_rival_1_defeated', 'johto_rival_azalea_defeated', 'johto_rival_ecruteak_defeated', 'johto_rocket_mahogany_cleared', 'johto_rival_tunnel_defeated'];
    if (johtoRequirements.includes(flag)) {
      if (flag.includes('rival_') || flag.includes('rocket_') || flag.includes('_defeated') || flag.includes('_well_cleared') || flag.includes('_radio_cleared')) {
        if (setVsInitialTab) setVsInitialTab('challenges');
        let cat = 'rival';
        if (flag.includes('rocket_') || flag.includes('_well_') || flag.includes('_radio_') || flag.includes('_mahogany_')) cat = 'rocket';
        if (setVsInitialCategory) setVsInitialCategory(cat);
        if (setVsInitialRegion) setVsInitialRegion('johto');
      } else {
        if (setVsInitialTab) setVsInitialTab(flag === 'johto_started' ? 'challenges' : 'gyms');
        if (setVsInitialCategory) setVsInitialCategory(flag === 'johto_started' ? 'rival' : 'johto');
        if (setVsInitialRegion) setVsInitialRegion('johto');
      }
      setCurrentView(flag === 'johto_started' ? 'city' : 'vs');
    } else if (flag.includes('_badge')) {
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

  const filtered = CHALLENGES.filter(c => c.category === selectedCategory && c.region === challengeRegion);

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

        {(!isEmbedded || (filterCategories && filterCategories.length >= 1)) && (
          <div className="flex flex-col p-4 pb-2 gap-3 bg-slate-900 border-b border-white/5 justify-center">
            {kantoChampion && !forcedRegion && (
              <div className="grid grid-cols-2 gap-2 mb-2 w-full max-w-sm mx-auto">
                {[
                  { id: 'kanto', label: 'Kanto' },
                  { id: 'johto', label: 'Johto' },
                ].map(region => (
                  <button
                    key={region.id}
                    onClick={() => {
                      setChallengeRegion(region.id);
                      if (region.id === 'kanto' && selectedCategory === 'johto') setSelectedCategory('rival');
                      if (region.id === 'johto' && selectedCategory !== 'legendary' && selectedCategory !== 'rocket' && selectedCategory !== 'rival') setSelectedCategory('johto');
                    }}
                    className={`min-h-[38px] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      challengeRegion === region.id
                        ? 'bg-pokeGold text-slate-950 shadow-lg'
                        : 'bg-white/5 text-white/40 hover:text-white/70'
                    }`}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex w-full max-w-sm mx-auto gap-2">
              {Object.entries(CATEGORY_CONFIG)
                .filter(([id]) => {
                  if (filterCategories) return filterCategories.includes(id);
                  if (challengeRegion === 'kanto') return id !== 'johto';
                  if (challengeRegion === 'johto') return id === 'johto' || id === 'legendary' || id === 'rocket' || id === 'rival';
                  return true;
                })
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
            const accentColor = getChallengeColor(challenge);
            if (challenge.category === 'johto' || challenge.category === 'hoenn' || (challenge.category === 'rematch' && challengeRegion !== 'kanto')) {
              const rematch = getRegionalRematch(challenge);
              const rematchAvailable = defeated && rematch && isUnlocked(rematch);
              return (
                <JohtoLeaderCard
                  key={challenge.id}
                  challenge={challenge}
                  unlocked={unlocked}
                  defeated={defeated}
                  rematchAvailable={Boolean(rematchAvailable)}
                  onSelect={() => setSelectedChallenge(rematchAvailable ? rematch : challenge)}
                  onRequirementClick={handleRequirementClick}
                  requirementLabel={flagNames[(rematchAvailable ? rematch.requiresFlag : challenge.requiresFlag)] || (rematchAvailable ? rematch.requiresFlag : challenge.requiresFlag)}
                />
              );
            }
            return (
              <div
                key={challenge.id}
                className={`relative rounded-[2rem] overflow-hidden shadow-xl transition-all border-2 ${
                  unlocked && !defeated ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] border-white/15 hover:border-pokeGold/60' : 'grayscale cursor-not-allowed opacity-60 border-white/10'
                }`}
                style={{ minHeight: '132px', background: getChallengeCardBackground(challenge) }}
                onClick={() => unlocked && !defeated && setSelectedChallenge(challenge)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/54 to-slate-950/18" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-white/10" />
                <div className="absolute top-0 right-0 w-36 h-36 -mr-12 -mt-12 rounded-full opacity-35 blur-sm" style={{ backgroundColor: accentColor }} />

                <div className="absolute inset-0 pointer-events-none opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                {defeated && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 border border-white px-6 py-2 rounded-full rotate-[-5deg] shadow-2xl">
                      <span className="text-slate-800 font-black italic uppercase tracking-widest text-[10px] flex items-center gap-2">
                         <span className="text-emerald-500 font-black">✓</span> CONCLUÍDO
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex items-center gap-4 p-5 text-left min-h-[132px]">
                  <div className="w-[76px] h-[76px] rounded-3xl bg-white/16 border border-white/20 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-sm overflow-hidden">
                    <img src={challenge.sprite} alt={challenge.name} className="w-[76px] h-[76px] object-contain drop-shadow-2xl" onError={e => { e.target.src = 'https://play.pokemonshowdown.com/sprites/trainers/unknown.png'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/65 text-[9px] font-black uppercase tracking-widest leading-none mb-1">{challenge.subtitle}</p>
                    <h3 className="text-white font-black text-lg uppercase italic leading-tight tracking-tighter drop-shadow-sm">{challenge.name}</h3>
                    <p className="text-white/45 text-[9px] font-black uppercase tracking-widest mt-1 truncate">{challenge.location}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] font-black text-amber-300 uppercase flex items-center gap-1">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nugget.png" className="w-3 h-3 object-contain" alt="" />
                        {challenge.reward.toLocaleString()}
                      </span>
                      <span className="text-white/30">|</span>
                      <span className="text-[9px] font-black text-white/55 uppercase">{challenge.team.length} Pokemons</span>
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
                    {unlocked && !defeated && <span className="text-white/80 text-xl">›</span>}
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
                <button 
                  onClick={() => { 
                    if (selectedChallenge.region === 'johto') {
                      const hasLocked = gameState.team.some(p => p.lockedUntilFlag && !(gameState.worldFlags || []).includes(p.lockedUntilFlag));
                      if (hasLocked) {
                        setAlertMessage("Você não pode enfrentar batalhas em Johto com Pokémon guardados pelo Prof. Elm. Guarde-os no PC primeiro!");
                        return;
                      }
                    }
                    onChallenge(selectedChallenge); 
                    setSelectedChallenge(null); 
                  }} 
                  className="flex-2 flex-grow bg-white text-slate-900 py-4 rounded-2xl font-black uppercase text-sm hover:bg-slate-100 shadow-xl active:scale-95"
                >
                  Desafiar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md animate-fadeIn" onClick={() => setAlertMessage(null)}>
           <div className="bg-slate-950 w-full max-w-sm rounded-[3rem] shadow-2xl p-8 animate-bounceIn text-center border-4 border-red-500" onClick={e => e.stopPropagation()}>
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-xl font-black text-white uppercase italic mb-4">Acesso Bloqueado</h3>
              <p className="text-sm font-bold text-white/60 mb-8">{alertMessage}</p>
              <button 
                onClick={() => setAlertMessage(null)}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 active:scale-95 transition-all shadow-lg"
              >
                Entendi
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesScreen;

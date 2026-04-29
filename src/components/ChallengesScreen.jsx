import React, { useState } from 'react';
import { hasProgressRequirement } from '../utils/progress';
import { TYPE_COLOR_HEX } from '../data/gyms';

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
  }
];

const CATEGORY_CONFIG = {
  rival:     { label: 'Rival',         color: '#2563eb', emoji: '👤'  },
  rocket:    { label: 'Equipe Rocket', color: '#dc2626', emoji: '🚀'  },
  johto:     { label: 'Lideres',       color: '#059669', emoji: '🏆'  },
  rematch:   { label: 'Revanche',      color: '#f59e0b', emoji: '🔥'  },
  legendary: { label: 'Lendários',     color: '#7c3aed', emoji: '✨'  },
};

const getChallengeColor = (challenge) => {
  if (challenge.type && TYPE_COLOR_HEX[challenge.type]) return TYPE_COLOR_HEX[challenge.type];
  return CATEGORY_CONFIG[challenge.category]?.color || '#334155';
};

const getChallengeCardBackground = (challenge) => {
  const color = getChallengeColor(challenge);
  return challenge.background || `linear-gradient(135deg, ${color} 0%, #0f172a 100%)`;
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
            return (
              <div
                key={challenge.id}
                onClick={() => unlocked && !defeated && setSelectedChallenge(challenge)}
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

import React, { useState } from 'react';
import { hasProgressRequirement } from '../utils/progress';
import { TYPE_COLOR_HEX } from '../data/gyms';
import { BadgeSVG } from './CommonUI';
import { getUnlockedRegions, REGION_LABELS } from '../data/regionStandards';
import { getTrainerCurrencyReward } from '../utils/economy';

const psTrainer = (name) => `https://play.pokemonshowdown.com/sprites/trainers/${name}.png`;
const trainerSlug = (name) => ({
  'Olivia Elite': 'olivia',
  'Larry Elite': 'larry',
}[name] || String(name).toLowerCase().replace(/[^a-z0-9]+/g, ''));
const trainerSprite = (name) => psTrainer(trainerSlug(name));
const typeIconUrl = (t) => `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${String(t).toLowerCase()}.svg`;
const team = (ids, level) => ids.map(id => ({ id, level }));

const FUTURE_REGION_CHALLENGE_DATA = {
  unova: {
    label: 'Unova', start: 'unova_started', champion: 'unova_champion', villain: 'Team Plasma', villainSprite: psTrainer('plasmagrunt'), rivalSprite: psTrainer('cheren'), bg: "url('/battle_bg_forest_1776863795763.png') center/cover no-repeat",
    badges: ['trio_badge', 'basic_badge', 'insect_badge', 'bolt_badge', 'quake_badge', 'jet_badge', 'freeze_badge', 'legend_badge'],
    leaders: [['Cilan', 'Grass', 14, [511, 512]], ['Lenora', 'Normal', 20, [507, 505]], ['Burgh', 'Bug', 26, [541, 542, 544]], ['Elesa', 'Electric', 32, [587, 522, 523]], ['Clay', 'Ground', 39, [529, 536, 530]], ['Skyla', 'Flying', 45, [528, 521, 581]], ['Brycen', 'Ice', 52, [614, 615, 583]], ['Drayden', 'Dragon', 60, [611, 621, 612]]],
    league: [['Shauntal', 'Ghost', 72, [609, 623, 593]], ['Grimsley', 'Dark', 74, [560, 625, 635]], ['Caitlin', 'Psychic', 76, [518, 579, 576]], ['Marshal', 'Fighting', 78, [534, 538, 539]], ['Alder', 'Bug', 82, [617, 589, 637]]],
  },
  kalos: {
    label: 'Kalos', start: 'kalos_started', champion: 'kalos_champion', villain: 'Team Flare', villainSprite: psTrainer('flaregrunt'), rivalSprite: psTrainer('shauna'), bg: "url('/battle_bg_route24_25_1776993592209.png') center/cover no-repeat",
    badges: ['bug_badge', 'cliff_badge', 'rumble_badge', 'plant_badge', 'voltage_badge', 'fairy_badge', 'psychic_badge', 'iceberg_badge'],
    leaders: [['Viola', 'Bug', 12, [283, 666]], ['Grant', 'Rock', 25, [696, 698]], ['Korrina', 'Fighting', 32, [619, 701]], ['Ramos', 'Grass', 34, [189, 71, 673]], ['Clemont', 'Electric', 40, [587, 82, 695]], ['Valerie', 'Fairy', 48, [303, 439, 700]], ['Olympia', 'Psychic', 59, [678, 199, 561]], ['Wulfric', 'Ice', 65, [460, 713, 712]]],
    league: [['Malva', 'Fire', 74, [668, 663, 609]], ['Siebold', 'Water', 76, [689, 693, 130]], ['Wikstrom', 'Steel', 78, [681, 476, 212]], ['Drasna', 'Dragon', 80, [691, 621, 706]], ['Diantha', 'Fairy', 86, [701, 697, 700, 282]]],
  },
  alola: {
    label: 'Alola', start: 'alola_started', champion: 'alola_champion', villain: 'Team Skull', villainSprite: psTrainer('skullgrunt'), rivalSprite: psTrainer('hau'), bg: "url('/battle_bg_route19_20.png') center/cover no-repeat",
    badges: ['melemele_stamp', 'akala_stamp', 'ulaula_stamp', 'poni_stamp', 'alola_elite_stamp', 'alola_champion_stamp', 'ultra_stamp', 'battle_tree_stamp'],
    leaders: [['Ilima', 'Normal', 16, [735, 20]], ['Lana', 'Water', 22, [751, 746]], ['Kiawe', 'Fire', 26, [776, 757]], ['Mallow', 'Grass', 30, [761, 754]], ['Sophocles', 'Electric', 38, [737, 777]], ['Mina', 'Fairy', 52, [742, 700]], ['Hapu', 'Ground', 58, [51, 750]], ['Molayne', 'Steel', 64, [227, 801]]],
    league: [['Hala', 'Fighting', 82, [297, 739, 740]], ['Olivia', 'Rock', 84, [476, 703, 745]], ['Acerola', 'Ghost', 86, [478, 426, 778]], ['Kahili', 'Flying', 88, [628, 741, 733]], ['Kukui', 'Mixed', 92, [745, 727, 724, 730]]],
  },
  galar: {
    label: 'Galar', start: 'galar_started', champion: 'galar_champion', villain: 'Team Yell', villainSprite: psTrainer('yellgrunt'), rivalSprite: psTrainer('hop'), bg: "url('/battle_bg_route16_17_18.png') center/cover no-repeat",
    badges: ['grass_badge_galar', 'water_badge_galar', 'fire_badge_galar', 'fighting_badge_galar', 'fairy_badge_galar', 'rock_badge_galar', 'dark_badge_galar', 'dragon_badge_galar'],
    leaders: [['Milo', 'Grass', 20, [829, 830]], ['Nessa', 'Water', 24, [833, 834]], ['Kabu', 'Fire', 27, [851, 59]], ['Bea', 'Fighting', 36, [865, 68]], ['Opal', 'Fairy', 38, [110, 868, 869]], ['Gordie', 'Rock', 42, [839, 874]], ['Piers', 'Dark', 46, [560, 862, 861]], ['Raihan', 'Dragon', 55, [844, 884, 330]]],
    league: [['Marnie', 'Dark', 74, [861, 452, 877]], ['Bede', 'Fairy', 78, [858, 869, 282]], ['Raihan', 'Dragon', 82, [884, 330, 706]], ['Leon', 'Fire', 90, [6, 887, 812, 815, 818]]],
  },
  paldea: {
    label: 'Paldea', start: 'paldea_started', champion: 'paldea_champion', villain: 'Team Star', villainSprite: psTrainer('giacomo'), rivalSprite: psTrainer('schoolkidf'), bg: "url('/battle_bg_route3_1776993578907.png') center/cover no-repeat",
    badges: ['bug_badge_paldea', 'grass_badge_paldea', 'electric_badge_paldea', 'water_badge_paldea', 'normal_badge_paldea', 'ghost_badge_paldea', 'psychic_badge_paldea', 'ice_badge_paldea'],
    leaders: [['Katy', 'Bug', 15, [917, 919]], ['Brassius', 'Grass', 20, [949, 753]], ['Iono', 'Electric', 28, [940, 941]], ['Kofu', 'Water', 35, [961, 950]], ['Larry', 'Normal', 42, [931, 924, 925]], ['Ryme', 'Ghost', 48, [972, 937]], ['Tulip', 'Psychic', 55, [956, 981]], ['Grusha', 'Ice', 60, [974, 975]]],
    league: [['Rika', 'Ground', 72, [980, 982, 968]], ['Poppy', 'Steel', 75, [879, 959, 1000]], ['Larry Elite', 'Flying', 78, [931, 973, 701]], ['Hassel', 'Dragon', 82, [998, 887, 1008]], ['Geeta', 'Rock', 88, [970, 983, 1008]]],
  },
};

const buildFutureRegionChallenges = () => Object.entries(FUTURE_REGION_CHALLENGE_DATA).flatMap(([region, cfg]) => {
  const rivalBattles = [
    { suffix: 'rival_start', name: `Rival - ${cfg.label} I`, level: 12, req: cfg.start, unlock: `${region}_rival_1_defeated`, ids: [cfg.leaders[0][3][0], cfg.leaders[1][3][0]] },
    { suffix: 'rival_mid', name: `Rival - ${cfg.label} II`, level: 38, req: cfg.badges[2], unlock: `${region}_rival_2_defeated`, ids: [cfg.leaders[2][3][0], cfg.leaders[3][3][0], cfg.leaders[4][3][0]] },
    { suffix: 'rival_victory', name: `Rival - Victory Road ${cfg.label}`, level: 70, req: cfg.badges[7], unlock: `${region}_rival_victory_defeated`, ids: [cfg.leaders[5][3][0], cfg.leaders[6][3][0], cfg.leaders[7][3][0]] },
  ].map(entry => ({
    region, id: `${region}_${entry.suffix}`, category: 'rival', name: entry.name, subtitle: 'Rivalidade Regional',
    sprite: cfg.rivalSprite, quote: '"Vamos testar se voce esta pronto para o proximo passo."',
    reward: entry.level * 900, unlockFlag: entry.unlock, requiresFlag: entry.req, team: team(entry.ids, entry.level),
    background: cfg.bg, location: `${cfg.label} - Jornada`,
  }));

  const villainBattles = [
    { suffix: 'villain_1', level: 24, req: `${region}_rival_1_defeated`, unlock: `${region}_villain_1_cleared` },
    { suffix: 'villain_2', level: 50, req: cfg.badges[4], unlock: `${region}_villain_2_cleared` },
    { suffix: 'villain_final', level: 66, req: cfg.badges[6], unlock: `${region}_villain_final_cleared` },
  ].map((entry, i) => ({
    region, id: `${region}_${entry.suffix}`, category: 'rocket', name: `${cfg.villain} ${i === 2 ? 'Boss' : 'Grunt'}`, subtitle: 'Equipe Vila Regional',
    sprite: cfg.villainSprite, quote: '"Nosso plano nao sera interrompido por voce."',
    reward: entry.level * 1000, unlockFlag: entry.unlock, requiresFlag: entry.req,
    team: team([cfg.leaders[i + 1][3][0], cfg.leaders[i + 3][3][0], cfg.leaders[i + 5]?.[3]?.[0] || cfg.leaders[7][3][0]], entry.level),
    background: cfg.bg, location: `${cfg.label} - Operacao da Equipe Vila`,
  }));

  const gymBattles = cfg.leaders.map(([name, type, level, ids], index) => ({
    region, id: `${region}_gym_${index + 1}`, category: region, name, subtitle: `Ginasio #${index + 1}`,
    sprite: trainerSprite(name),
    quote: `"Meu tipo ${type} vai definir esta batalha."`,
    reward: level * 1200, unlockFlag: cfg.badges[index], badgeToGive: cfg.badges[index],
    requiresFlag: index === 0 ? `${region}_villain_1_cleared` : cfg.badges[index - 1],
    badge: cfg.badges[index], badgeOrder: index + 1, type, typeIcon: typeIconUrl(type),
    team: team(ids, level), background: cfg.bg, location: `${cfg.label} - Ginasio #${index + 1}`,
  }));

  const leagueBattles = cfg.league.map(([name, type, level, ids], index) => ({
    region, id: index === cfg.league.length - 1 ? `${region}_champion` : `${region}_elite_${index + 1}`,
    category: region, name, subtitle: index === cfg.league.length - 1 ? `Campeao de ${cfg.label}` : `Elite Four #${index + 1}`,
    sprite: trainerSprite(name),
    quote: '"A Liga reconhece apenas quem vence no limite."',
    reward: level * 1600, unlockFlag: index === cfg.league.length - 1 ? cfg.champion : `${region}_elite_${index + 1}_defeated`,
    requiresFlag: index === 0 ? `${region}_rival_victory_defeated` : (index === cfg.league.length - 1 ? `${region}_elite_${index}_defeated` : `${region}_elite_${index}_defeated`),
    type, typeIcon: typeIconUrl(type), team: team(ids, level), background: "url('/battle_bg_elite_four.png') center/cover no-repeat",
    location: `${cfg.label} Pokemon League`,
  }));

  const rematches = cfg.leaders.map(([name, type, , ids], index) => ({
    region, id: `${region}_rematch_${index + 1}`, category: 'rematch', name: `Revanche ${name}`, subtitle: `${cfg.label} Rematch`,
    sprite: trainerSprite(name),
    quote: '"Agora sem limite de campanha. Mostre seu time de elite."',
    reward: 90000 + index * 5000, unlockFlag: `${region}_rematch_${index + 1}_defeated`, requiresFlag: cfg.champion,
    type, typeIcon: typeIconUrl(type), team: team([...ids, cfg.league.at(-1)[3][0]].slice(0, 4), 100), background: cfg.bg,
    location: `${cfg.label} - Revanche`,
  }));

  return [...rivalBattles, ...villainBattles, ...gymBattles, ...leagueBattles, ...rematches];
});

const FUTURE_REGION_CHALLENGES = buildFutureRegionChallenges();

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
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/twins.png',
    quote: '"Duas mentes, um so objetivo: derrotar voce!"',
    reward: 25000,
    unlockFlag: 'mind_badge',
    requiresFlag: 'feather_badge',
    team: [{ id: 337, level: 35 }, { id: 338, level: 35 }],
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
    team: [{ id: 370, level: 41 }, { id: 340, level: 43 }, { id: 339, level: 43 }, { id: 119, level: 46 }, { id: 350, level: 48 }],
    background: "url('/bg_sootopolis_city.png') center/cover no-repeat",
    location: 'Sootopolis Gym',
  },
  // --- HOENN LEAGUE ---
  {
    region: 'hoenn',
    id: 'hoenn_sidney',
    category: 'hoenn',
    type: 'Dark',
    name: 'Sidney - Elite Four',
    subtitle: 'Mestre Sombrio',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/sidney.png',
    quote: '"Minha equipe sombria vai abrir seu caminho ate a derrota!"',
    reward: 35000,
    unlockFlag: 'hoenn_sidney_defeated',
    requiresFlag: 'rain_badge',
    team: [{ id: 262, level: 46 }, { id: 275, level: 48 }, { id: 342, level: 48 }, { id: 359, level: 49 }, { id: 332, level: 50 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Liga Pokemon de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_phoebe',
    category: 'hoenn',
    type: 'Ghost',
    name: 'Phoebe - Elite Four',
    subtitle: 'Mestra Fantasma',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/hexmaniac-gen6.png',
    quote: '"Meus Pokemon espirituais treinam comigo no Mt. Pyre!"',
    reward: 38000,
    unlockFlag: 'hoenn_phoebe_defeated',
    requiresFlag: 'hoenn_sidney_defeated',
    team: [{ id: 356, level: 48 }, { id: 354, level: 49 }, { id: 302, level: 50 }, { id: 354, level: 51 }, { id: 356, level: 51 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Liga Pokemon de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_glacia',
    category: 'hoenn',
    type: 'Ice',
    name: 'Glacia - Elite Four',
    subtitle: 'Mestra Gelida',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/glacia.png',
    quote: '"A disciplina do gelo congela qualquer impulso descuidado."',
    reward: 41000,
    unlockFlag: 'hoenn_glacia_defeated',
    requiresFlag: 'hoenn_phoebe_defeated',
    team: [{ id: 364, level: 50 }, { id: 362, level: 50 }, { id: 365, level: 52 }, { id: 362, level: 52 }, { id: 365, level: 53 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Liga Pokemon de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_drake',
    category: 'hoenn',
    type: 'Dragon',
    name: 'Drake - Elite Four',
    subtitle: 'Mestre Dragao',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/drasna.png',
    quote: '"Dragoes respeitam apenas quem enfrenta a tempestade."',
    reward: 44000,
    unlockFlag: 'hoenn_drake_defeated',
    requiresFlag: 'hoenn_glacia_defeated',
    team: [{ id: 372, level: 52 }, { id: 330, level: 53 }, { id: 230, level: 53 }, { id: 334, level: 54 }, { id: 373, level: 55 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Liga Pokemon de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_steven',
    category: 'hoenn',
    type: 'Steel',
    name: 'Campeao Steven',
    subtitle: 'Campeao de Hoenn',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/steven.png',
    quote: '"Mostre o brilho da sua jornada. Minha equipe de aco nao vai ceder."',
    reward: 65000,
    unlockFlag: 'hoenn_champion',
    requiresFlag: 'hoenn_drake_defeated',
    team: [{ id: 227, level: 59 }, { id: 344, level: 57 }, { id: 306, level: 58 }, { id: 348, level: 58 }, { id: 346, level: 58 }, { id: 376, level: 62 }],
    background: "url('/bg_elite_four_hoenn.png') center/cover no-repeat",
    location: 'Sala do Campeao - Hoenn',
  },
  // REVANCHE - KANTO (Desbloqueado após ser Campeão de Kanto)
  {
    region: 'sinnoh',
    id: 'sinnoh_roark',
    category: 'sinnoh',
    type: 'Rock',
    name: 'Roark',
    subtitle: 'Insignia Coal',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/roark.png',
    quote: '"As minas de Oreburgh fortalecem meus Pokemon de pedra!"',
    reward: 16000,
    unlockFlag: 'coal_badge',
    requiresFlag: 'sinnoh_rival_jubilife_defeated',
    team: [{ id: 74, level: 12 }, { id: 95, level: 13 }, { id: 408, level: 14 }],
    background: "url('/battle_bg_sinnoh_gym.png') center/cover no-repeat",
    location: 'Oreburgh Gym',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_gardenia',
    category: 'sinnoh',
    type: 'Grass',
    name: 'Gardenia',
    subtitle: 'Insignia Forest',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/gardenia.png',
    quote: '"A forca da floresta de Eterna esta do meu lado!"',
    reward: 19000,
    unlockFlag: 'forest_badge',
    requiresFlag: 'sinnoh_galactic_eterna_cleared',
    team: [{ id: 420, level: 19 }, { id: 387, level: 20 }, { id: 315, level: 22 }],
    background: "url('/bg_eterna_forest.png') center/cover no-repeat",
    location: 'Eterna Gym',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_maylene',
    category: 'sinnoh',
    type: 'Fighting',
    name: 'Maylene',
    subtitle: 'Insignia Cobble',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/maylene.png',
    quote: '"Eu ainda estou aprendendo, mas meus punhos nao hesitam!"',
    reward: 23000,
    unlockFlag: 'cobble_badge',
    requiresFlag: 'forest_badge',
    team: [{ id: 307, level: 25 }, { id: 67, level: 26 }, { id: 448, level: 28 }],
    background: "url('/battle_bg_sinnoh_gym.png') center/cover no-repeat",
    location: 'Veilstone Gym',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_crasher_wake',
    category: 'sinnoh',
    type: 'Water',
    name: 'Crasher Wake',
    subtitle: 'Insignia Fen',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/crasherwake.png',
    quote: '"A arena vai virar uma onda gigante!"',
    reward: 27000,
    unlockFlag: 'fen_badge',
    requiresFlag: 'sinnoh_galactic_valor_cleared',
    team: [{ id: 130, level: 30 }, { id: 195, level: 31 }, { id: 419, level: 33 }],
    background: "url('/bg_sinnoh_league.png') center/cover no-repeat",
    location: 'Pastoria Gym',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_fantina',
    category: 'sinnoh',
    type: 'Ghost',
    name: 'Fantina',
    subtitle: 'Insignia Relic',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/fantina.png',
    quote: '"Minha performance fantasmagorica vai encantar sua derrota!"',
    reward: 31000,
    unlockFlag: 'relic_badge',
    requiresFlag: 'fen_badge',
    team: [{ id: 426, level: 36 }, { id: 94, level: 37 }, { id: 429, level: 39 }],
    background: "url('/battle_bg_sinnoh_gym.png') center/cover no-repeat",
    location: 'Hearthome Gym',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_byron',
    category: 'sinnoh',
    type: 'Steel',
    name: 'Byron',
    subtitle: 'Insignia Mine',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/byron.png',
    quote: '"Aco verdadeiro se forja sob pressao!"',
    reward: 35000,
    unlockFlag: 'mine_badge',
    requiresFlag: 'relic_badge',
    team: [{ id: 437, level: 41 }, { id: 208, level: 43 }, { id: 411, level: 45 }],
    background: "url('/battle_bg_sinnoh_gym.png') center/cover no-repeat",
    location: 'Canalave Gym',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_candice',
    category: 'sinnoh',
    type: 'Ice',
    name: 'Candice',
    subtitle: 'Insignia Icicle',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/candice.png',
    quote: '"Foco frio, coracao quente. Vamos batalhar!"',
    reward: 40000,
    unlockFlag: 'icicle_badge',
    requiresFlag: 'sinnoh_galactic_spear_pillar_cleared',
    team: [{ id: 459, level: 47 }, { id: 215, level: 48 }, { id: 308, level: 49 }, { id: 478, level: 51 }],
    background: "url('/bg_snowpoint.png') center/cover no-repeat",
    location: 'Snowpoint Gym',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_volkner',
    category: 'sinnoh',
    type: 'Electric',
    name: 'Volkner',
    subtitle: 'Insignia Beacon',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/volkner.png',
    quote: '"Finalmente um desafiante que pode reacender minha energia."',
    reward: 46000,
    unlockFlag: 'beacon_badge',
    requiresFlag: 'icicle_badge',
    team: [{ id: 26, level: 54 }, { id: 424, level: 55 }, { id: 224, level: 56 }, { id: 405, level: 58 }],
    background: "url('/bg_sunyshore.png') center/cover no-repeat",
    location: 'Sunyshore Gym',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_aaron',
    category: 'sinnoh',
    type: 'Bug',
    name: 'Aaron - Elite Four',
    subtitle: 'Mestre Inseto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/aaron.png',
    quote: '"Insetos sobrevivem, evoluem e vencem."',
    reward: 52000,
    unlockFlag: 'sinnoh_aaron_defeated',
    requiresFlag: 'beacon_badge',
    team: [{ id: 269, level: 60 }, { id: 214, level: 61 }, { id: 416, level: 62 }, { id: 267, level: 62 }, { id: 452, level: 63 }],
    background: "url('/bg_sinnoh_league.png') center/cover no-repeat",
    location: 'Liga Pokemon de Sinnoh',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_bertha',
    category: 'sinnoh',
    type: 'Ground',
    name: 'Bertha - Elite Four',
    subtitle: 'Mestra Terrestre',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bertha.png',
    quote: '"A experiencia pesa mais do que qualquer montanha."',
    reward: 56000,
    unlockFlag: 'sinnoh_bertha_defeated',
    requiresFlag: 'sinnoh_aaron_defeated',
    team: [{ id: 195, level: 62 }, { id: 450, level: 63 }, { id: 464, level: 64 }, { id: 340, level: 64 }, { id: 473, level: 65 }],
    background: "url('/bg_sinnoh_league.png') center/cover no-repeat",
    location: 'Liga Pokemon de Sinnoh',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_flint',
    category: 'sinnoh',
    type: 'Fire',
    name: 'Flint - Elite Four',
    subtitle: 'Mestre Flamejante',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/flint.png',
    quote: '"Minha chama vai empurrar seu time ao limite!"',
    reward: 60000,
    unlockFlag: 'sinnoh_flint_defeated',
    requiresFlag: 'sinnoh_bertha_defeated',
    team: [{ id: 229, level: 64 }, { id: 467, level: 65 }, { id: 136, level: 65 }, { id: 78, level: 66 }, { id: 392, level: 67 }],
    background: "url('/bg_sinnoh_league.png') center/cover no-repeat",
    location: 'Liga Pokemon de Sinnoh',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_lucian',
    category: 'sinnoh',
    type: 'Psychic',
    name: 'Lucian - Elite Four',
    subtitle: 'Mestre Psiquico',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lucian.png',
    quote: '"Uma batalha tambem e leitura, calma e precisao."',
    reward: 64000,
    unlockFlag: 'sinnoh_lucian_defeated',
    requiresFlag: 'sinnoh_flint_defeated',
    team: [{ id: 122, level: 66 }, { id: 203, level: 67 }, { id: 475, level: 68 }, { id: 437, level: 68 }, { id: 65, level: 70 }],
    background: "url('/bg_sinnoh_league.png') center/cover no-repeat",
    location: 'Liga Pokemon de Sinnoh',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_cynthia',
    category: 'sinnoh',
    type: 'Mixed',
    name: 'Campea Cynthia',
    subtitle: 'Campea de Sinnoh',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/cynthia.png',
    quote: '"A historia de Sinnoh culmina nesta batalha. Mostre sua verdade."',
    reward: 90000,
    unlockFlag: 'sinnoh_champion',
    requiresFlag: 'sinnoh_lucian_defeated',
    team: [{ id: 442, level: 70 }, { id: 407, level: 71 }, { id: 468, level: 71 }, { id: 448, level: 72 }, { id: 350, level: 72 }, { id: 445, level: 74 }],
    background: "url('/bg_sinnoh_league.png') center/cover no-repeat",
    location: 'Sala da Campea - Sinnoh',
  },
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
    id: 'hoenn_rival_route110',
    category: 'rival',
    name: 'Brendan - Rota 110',
    subtitle: 'Teste em Mauville',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"Voce chegou longe, mas sera que aguenta uma batalha de verdade?"',
    reward: 18000,
    unlockFlag: 'hoenn_rival_route110_defeated',
    requiresFlag: 'knuckle_badge',
    team: [{ id: 277, level: 20 }, { id: 271, level: 20 }, { id: 256, level: 22 }],
    background: "url('/bg_route110.png') center/cover no-repeat",
    location: 'Rota 110',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rival_lilycove',
    category: 'rival',
    name: 'Brendan - Lilycove',
    subtitle: 'Rivalidade Final',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"Uma ultima batalha antes da Liga. Vamos ver quem amadureceu mais!"',
    reward: 26000,
    unlockFlag: 'hoenn_rival_lilycove_defeated',
    requiresFlag: 'feather_badge',
    team: [{ id: 277, level: 38 }, { id: 272, level: 39 }, { id: 323, level: 39 }, { id: 257, level: 41 }],
    background: "url('/bg_lilycove_city.png') center/cover no-repeat",
    location: 'Lilycove City',
  },
  {
    region: 'hoenn',
    id: 'hoenn_aqua_slateport',
    category: 'rocket',
    name: 'Equipe Aqua - Slateport',
    subtitle: 'Roubo no Museu',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/aquagrunt.png',
    quote: '"O mar pertence a Equipe Aqua! Saia do nosso caminho!"',
    reward: 17000,
    unlockFlag: 'hoenn_aqua_slateport_cleared',
    requiresFlag: 'hoenn_rival_1_defeated',
    team: [{ id: 261, level: 18 }, { id: 318, level: 19 }, { id: 320, level: 20 }],
    background: "url('/bg_slateport_city.png') center/cover no-repeat",
    location: 'Museu Oceanico - Slateport',
  },
  {
    region: 'hoenn',
    id: 'hoenn_magma_chimney',
    category: 'rocket',
    name: 'Equipe Magma - Mt. Chimney',
    subtitle: 'Plano no Vulcao',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/magmagrunt.png',
    quote: '"A terra vai se expandir, e voce nao vai impedir!"',
    reward: 22000,
    unlockFlag: 'hoenn_magma_chimney_cleared',
    requiresFlag: 'dynamo_badge',
    team: [{ id: 322, level: 24 }, { id: 262, level: 25 }, { id: 323, level: 27 }],
    background: "url('/bg_mt_chimney.png') center/cover no-repeat",
    location: 'Mt. Chimney',
  },
  {
    region: 'hoenn',
    id: 'hoenn_aqua_seafloor',
    category: 'rocket',
    name: 'Equipe Aqua - Caverna Submarina',
    subtitle: 'Crise do Oceano',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/archie-gen3.png',
    quote: '"Kyogre vai despertar, mesmo que tenhamos que te afundar!"',
    reward: 30000,
    unlockFlag: 'hoenn_aqua_seafloor_cleared',
    requiresFlag: 'mind_badge',
    team: [{ id: 262, level: 42 }, { id: 319, level: 43 }, { id: 332, level: 44 }, { id: 342, level: 45 }],
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
    team: [{ id: 299, level: 78 }, { id: 348, level: 80 }, { id: 476, level: 82 }],
    background: "url('/bg_rustboro_city.png') center/cover no-repeat",
    location: 'Rustboro Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_brawly',
    category: 'rematch',
    name: 'Brawly (Revanche)',
    subtitle: 'Onda de Luta',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brawly.png',
    quote: '"A maré subiu. Vamos ver se voce acompanha o ritmo!"',
    reward: 27000,
    unlockFlag: 'hoenn_rematch_brawly_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 297, level: 80 }, { id: 308, level: 82 }, { id: 286, level: 84 }],
    background: "url('/bg_dewford_town.png') center/cover no-repeat",
    location: 'Dewford Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_wattson',
    category: 'rematch',
    name: 'Wattson (Revanche)',
    subtitle: 'Alta Voltagem',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/wattson.png',
    quote: '"Wahahaha! Agora a cidade inteira vai sentir essa descarga!"',
    reward: 30000,
    unlockFlag: 'hoenn_rematch_wattson_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 310, level: 83 }, { id: 462, level: 85 }, { id: 466, level: 86 }],
    background: "url('/bg_mauville_city.png') center/cover no-repeat",
    location: 'Mauville Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_flannery',
    category: 'rematch',
    name: 'Flannery (Revanche)',
    subtitle: 'Calor Vulcanico',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/flannery.png',
    quote: '"Respira fundo... e aguenta a pressão do vulcão!"',
    reward: 33000,
    unlockFlag: 'hoenn_rematch_flannery_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 324, level: 86 }, { id: 323, level: 88 }, { id: 467, level: 89 }],
    background: "url('/bg_lavaridge_town.png') center/cover no-repeat",
    location: 'Lavaridge Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_norman',
    category: 'rematch',
    name: 'Norman (Revanche)',
    subtitle: 'Forca de Familia',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/norman.png',
    quote: '"Desta vez vou batalhar como pai e como lider."',
    reward: 36000,
    unlockFlag: 'hoenn_rematch_norman_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 289, level: 88 }, { id: 295, level: 90 }, { id: 217, level: 91 }],
    background: "url('/bg_petalburg_city.png') center/cover no-repeat",
    location: 'Petalburg Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_winona',
    category: 'rematch',
    name: 'Winona (Revanche)',
    subtitle: 'Ceu Livre',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/winona.png',
    quote: '"Suba mais alto. A batalha real começa acima das nuvens."',
    reward: 39000,
    unlockFlag: 'hoenn_rematch_winona_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 277, level: 90 }, { id: 334, level: 92 }, { id: 430, level: 93 }],
    background: "url('/bg_fortree_city.png') center/cover no-repeat",
    location: 'Fortree Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_tate_liza',
    category: 'rematch',
    name: 'Tate & Liza (Revanche)',
    subtitle: 'Dupla Cosmica',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/twins.png',
    quote: '"Duas mentes, uma estrategia. Prepare-se!"',
    reward: 43000,
    unlockFlag: 'hoenn_rematch_tate_liza_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 337, level: 92 }, { id: 338, level: 92 }, { id: 475, level: 95 }],
    background: "url('/bg_mossdeep_city.png') center/cover no-repeat",
    location: 'Mossdeep Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_wallace',
    category: 'rematch',
    name: 'Wallace (Revanche)',
    subtitle: 'Arte Aquatica',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/wallace.png',
    quote: '"A beleza de uma batalha perfeita nao tem igual."',
    reward: 47000,
    unlockFlag: 'hoenn_rematch_wallace_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 321, level: 94 }, { id: 272, level: 95 }, { id: 350, level: 96 }],
    background: "url('/bg_sootopolis_city.png') center/cover no-repeat",
    location: 'Sootopolis Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_steven',
    category: 'rematch',
    name: 'Steven (Revanche)',
    subtitle: 'Campeao de Aco',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/steven.png',
    quote: '"Mostre se seu time lapidou todo o seu potencial."',
    reward: 65000,
    unlockFlag: 'hoenn_rematch_steven_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 227, level: 96 }, { id: 344, level: 97 }, { id: 306, level: 98 }, { id: 376, level: 100 }],
    background: "url('/bg_ever_grande_city.png') center/cover no-repeat",
    location: 'Ever Grande',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_rival_jubilife',
    category: 'rival',
    name: 'Barry - Jubilife',
    subtitle: 'Rivalidade Acelerada',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/barry.png',
    quote: '"Voce atrasou dez mil coins! Agora batalha comigo!"',
    reward: 17000,
    unlockFlag: 'sinnoh_rival_jubilife_defeated',
    requiresFlag: 'sinnoh_started',
    team: [{ id: 396, level: 11 }, { id: 390, level: 13 }, { id: 393, level: 13 }],
    background: "url('/bg_jubilife.png') center/cover no-repeat",
    location: 'Jubilife City',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_rival_hearthome',
    category: 'rival',
    name: 'Barry - Hearthome',
    subtitle: 'Pressa no Caminho',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/barry.png',
    quote: '"Estou ficando mais forte rapido demais para voce acompanhar!"',
    reward: 28000,
    unlockFlag: 'sinnoh_rival_hearthome_defeated',
    requiresFlag: 'cobble_badge',
    team: [{ id: 398, level: 34 }, { id: 418, level: 34 }, { id: 315, level: 35 }, { id: 391, level: 37 }],
    background: "url('/bg_eterna.png') center/cover no-repeat",
    location: 'Hearthome City',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_rival_victory',
    category: 'rival',
    name: 'Barry - Victory Road',
    subtitle: 'Ultima Corrida',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/barry.png',
    quote: '"A Liga esta logo ali. Nao vou deixar voce passar de graca!"',
    reward: 52000,
    unlockFlag: 'sinnoh_rival_victory_defeated',
    requiresFlag: 'beacon_badge',
    team: [{ id: 398, level: 78 }, { id: 419, level: 79 }, { id: 407, level: 80 }, { id: 214, level: 80 }, { id: 392, level: 82 }],
    background: "url('/bg_victory_road_sinnoh.png') center/cover no-repeat",
    location: 'Victory Road Sinnoh',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_galactic_valley',
    category: 'rocket',
    name: 'Equipe Galactica - Valley Windworks',
    subtitle: 'Energia Roubada',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/galacticgrunt.png',
    quote: '"A energia daqui pertence a Equipe Galactica!"',
    reward: 18000,
    unlockFlag: 'sinnoh_galactic_valley_cleared',
    requiresFlag: 'coal_badge',
    team: [{ id: 41, level: 18 }, { id: 431, level: 19 }, { id: 434, level: 20 }],
    background: "url('/bg_eterna.png') center/cover no-repeat",
    location: 'Valley Windworks',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_galactic_eterna',
    category: 'rocket',
    name: 'Comandante Jupiter',
    subtitle: 'Predio Galactico',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/jupiter.png',
    quote: '"O novo mundo da Equipe Galactica nao tem espaco para voce."',
    reward: 22000,
    unlockFlag: 'sinnoh_galactic_eterna_cleared',
    requiresFlag: 'sinnoh_galactic_valley_cleared',
    team: [{ id: 41, level: 23 }, { id: 435, level: 25 }],
    background: "url('/bg_eterna.png') center/cover no-repeat",
    location: 'Eterna Galactic Building',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_galactic_valor',
    category: 'rocket',
    name: 'Comandante Saturn',
    subtitle: 'Crise no Lago Valor',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/saturn.png',
    quote: '"O lago foi drenado por um proposito maior."',
    reward: 32000,
    unlockFlag: 'sinnoh_galactic_valor_cleared',
    requiresFlag: 'cobble_badge',
    team: [{ id: 436, level: 36 }, { id: 64, level: 37 }, { id: 454, level: 39 }],
    background: "url('/bg_sinnoh_league.png') center/cover no-repeat",
    location: 'Lake Valor',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_galactic_spear_pillar',
    category: 'rocket',
    name: 'Cyrus - Spear Pillar',
    subtitle: 'Novo Mundo',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/cyrus.png',
    quote: '"Emocoes sao imperfeitas. Eu criarei um mundo sem elas."',
    reward: 52000,
    unlockFlag: 'sinnoh_galactic_spear_pillar_cleared',
    requiresFlag: 'mine_badge',
    team: [{ id: 430, level: 58 }, { id: 169, level: 59 }, { id: 461, level: 60 }, { id: 130, level: 61 }, { id: 229, level: 62 }],
    background: "url('/bg_mt_coronet.png') center/cover no-repeat",
    location: 'Spear Pillar',
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
  },
  ...FUTURE_REGION_CHALLENGES
];

const CATEGORY_CONFIG = {
  rival:     { label: 'Rival',         color: '#2563eb', emoji: 'VS'  },
  rocket:    { label: 'Viloes',        color: '#dc2626', emoji: 'R'   },
  johto:     { label: 'Lideres',       color: '#059669', emoji: 'GYM' },
  hoenn:     { label: 'Hoenn GYM',     color: '#10b981', emoji: 'H'   },
  sinnoh:    { label: 'Sinnoh GYM',    color: '#38bdf8', emoji: 'S'   },
  unova:     { label: 'Unova GYM',     color: '#22c55e', emoji: 'U'   },
  kalos:     { label: 'Kalos GYM',     color: '#0ea5e9', emoji: 'K'   },
  alola:     { label: 'Alola GYM',     color: '#f97316', emoji: 'A'   },
  galar:     { label: 'Galar GYM',     color: '#a855f7', emoji: 'G'   },
  paldea:    { label: 'Paldea GYM',    color: '#ef4444', emoji: 'P'   },
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

const SINNOH_GYM_ORDER = {
  sinnoh_roark: 1,
  sinnoh_gardenia: 2,
  sinnoh_maylene: 3,
  sinnoh_crasher_wake: 4,
  sinnoh_fantina: 5,
  sinnoh_byron: 6,
  sinnoh_candice: 7,
  sinnoh_volkner: 8,
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

const JohtoLeaderCard = ({ challenge, unlocked, defeated, onSelect, onRequirementClick, requirementLabel }) => {
  const accentColor = getChallengeColor(challenge);
  const typeIcon = getTypeIconUrl(challenge.type);
  const badgeOrder = JOHTO_GYM_ORDER[challenge.id] || SINNOH_GYM_ORDER[challenge.id] || '';

  return (
    <div
      onClick={() => unlocked && !defeated && onSelect(challenge)}
      className={`relative rounded-[2rem] overflow-hidden shadow-xl transition-all border-2 ${
        unlocked && !defeated
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
        <h4 className="text-white/60 font-black text-[10px] uppercase tracking-widest leading-none">GINASIO #{badgeOrder}</h4>
        <p className="text-white font-black text-2xl uppercase italic leading-none tracking-tighter mt-1.5 drop-shadow-sm truncate">{challenge.name}</p>
        <div className="mt-4 flex items-center gap-2.5 bg-white/15 backdrop-blur-sm w-fit px-3 py-2 rounded-xl border border-white/20 shadow-sm">
          <div className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: accentColor }}>
            {typeIcon && <img src={typeIcon} className="w-3.5 h-3.5 invert" alt={challenge.type} />}
          </div>
          <span className="text-white text-[10px] font-black uppercase tracking-widest">{challenge.type}</span>
        </div>
        <div className="flex items-center gap-2 mt-4">
          {defeated && <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-emerald-950/30">VENCIDO</span>}
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
            <BadgeSVG badgeId={challenge.unlockFlag} earned={defeated} size={24} />
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
          {unlocked && !defeated && (
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
  const worldFlags = gameState.worldFlags || [];
  const kantoChampion = worldFlags.includes('champion');
  const unlockedRegionIds = getUnlockedRegions(gameState);
  const availableRegions = unlockedRegionIds.map(id => ({ id, label: REGION_LABELS[id] || id }));
  const [challengeRegion, setChallengeRegion] = React.useState(forcedRegion || 'kanto');
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory || (filterCategories ? filterCategories[0] : 'rival'));
  const [alertMessage, setAlertMessage] = React.useState(null);

  React.useEffect(() => {
    if (forcedRegion) {
      setChallengeRegion(forcedRegion);
    }
  }, [forcedRegion]);

  React.useEffect(() => {
    if (!unlockedRegionIds.includes(challengeRegion)) setChallengeRegion('kanto');
  }, [kantoChampion, unlockedRegionIds.join('|'), challengeRegion]);

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
    'johto_rival_victory_defeated': 'Derrotar o Rival na Victory Road',
    'hoenn_started': 'Iniciar a jornada em Hoenn',
    'hoenn_rival_1_defeated': 'Vencer Brendan em Littleroot',
    'hoenn_rival_route110_defeated': 'Vencer Brendan na Rota 110',
    'hoenn_rival_lilycove_defeated': 'Vencer Brendan em Lilycove',
    'hoenn_aqua_slateport_cleared': 'Derrotar a Equipe Aqua em Slateport',
    'hoenn_magma_chimney_cleared': 'Derrotar a Equipe Magma no Mt. Chimney',
    'hoenn_aqua_seafloor_cleared': 'Derrotar a Equipe Aqua na Caverna Submarina',
    'stone_badge': 'Insignia Stone (Roxanne)',
    'knuckle_badge': 'Insignia Knuckle (Brawly)',
    'dynamo_badge': 'Insignia Dynamo (Wattson)',
    'heat_badge': 'Insignia Heat (Flannery)',
    'balance_badge': 'Insignia Balance (Norman)',
    'feather_badge': 'Insignia Feather (Winona)',
    'mind_badge': 'Insignia Mind (Tate & Liza)',
    'rain_badge': 'Insignia Rain (Wallace)',
    'hoenn_sidney_defeated': 'Vencer Sidney na Liga de Hoenn',
    'hoenn_phoebe_defeated': 'Vencer Phoebe na Liga de Hoenn',
    'hoenn_glacia_defeated': 'Vencer Glacia na Liga de Hoenn',
    'hoenn_drake_defeated': 'Vencer Drake na Liga de Hoenn',
    'hoenn_champion': 'Tornar-se Campeao de Hoenn',
    'sinnoh_started': 'Iniciar a jornada em Sinnoh',
    'sinnoh_rival_jubilife_defeated': 'Vencer Barry em Jubilife',
    'sinnoh_rival_hearthome_defeated': 'Vencer Barry em Hearthome',
    'sinnoh_rival_victory_defeated': 'Vencer Barry na Victory Road',
    'sinnoh_galactic_valley_cleared': 'Derrotar a Equipe Galactica em Valley Windworks',
    'sinnoh_galactic_eterna_cleared': 'Derrotar Jupiter em Eterna',
    'sinnoh_galactic_valor_cleared': 'Derrotar Saturn no Lake Valor',
    'sinnoh_galactic_spear_pillar_cleared': 'Derrotar Cyrus no Spear Pillar',
    'coal_badge': 'Insignia Coal (Roark)',
    'forest_badge': 'Insignia Forest (Gardenia)',
    'cobble_badge': 'Insignia Cobble (Maylene)',
    'fen_badge': 'Insignia Fen (Crasher Wake)',
    'relic_badge': 'Insignia Relic (Fantina)',
    'mine_badge': 'Insignia Mine (Byron)',
    'icicle_badge': 'Insignia Icicle (Candice)',
    'beacon_badge': 'Insignia Beacon (Volkner)',
    'sinnoh_aaron_defeated': 'Vencer Aaron na Liga de Sinnoh',
    'sinnoh_bertha_defeated': 'Vencer Bertha na Liga de Sinnoh',
    'sinnoh_flint_defeated': 'Vencer Flint na Liga de Sinnoh',
    'sinnoh_lucian_defeated': 'Vencer Lucian na Liga de Sinnoh',
    'sinnoh_champion': 'Tornar-se Campeao de Sinnoh'
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
    } else if (flag.startsWith('hoenn_') || ['stone_badge', 'knuckle_badge', 'dynamo_badge', 'heat_badge', 'balance_badge', 'feather_badge', 'mind_badge', 'rain_badge'].includes(flag)) {
      if (setVsInitialRegion) setVsInitialRegion('hoenn');
      if (flag === 'hoenn_started') {
        if (setVsInitialTab) setVsInitialTab('challenges');
        if (setVsInitialCategory) setVsInitialCategory('rival');
        setCurrentView('city');
      } else if (flag.includes('rival_') || flag.includes('aqua_') || flag.includes('magma_') || flag.includes('_cleared')) {
        if (setVsInitialTab) setVsInitialTab('challenges');
        if (setVsInitialCategory) setVsInitialCategory(flag.includes('aqua_') || flag.includes('magma_') ? 'rocket' : 'rival');
        setCurrentView('vs');
      } else {
        if (setVsInitialTab) setVsInitialTab('gyms');
        if (setVsInitialCategory) setVsInitialCategory('hoenn');
        setCurrentView('vs');
      }
    } else if (flag.startsWith('sinnoh_') || ['coal_badge', 'forest_badge', 'cobble_badge', 'fen_badge', 'relic_badge', 'mine_badge', 'icicle_badge', 'beacon_badge'].includes(flag)) {
      if (setVsInitialRegion) setVsInitialRegion('sinnoh');
      if (flag === 'sinnoh_started') {
        if (setVsInitialTab) setVsInitialTab('challenges');
        if (setVsInitialCategory) setVsInitialCategory('rival');
        setCurrentView('city');
      } else if (flag.includes('rival_') || flag.includes('galactic_') || flag.includes('_cleared')) {
        if (setVsInitialTab) setVsInitialTab('challenges');
        if (setVsInitialCategory) setVsInitialCategory(flag.includes('galactic_') ? 'rocket' : 'rival');
        setCurrentView('vs');
      } else {
        if (setVsInitialTab) setVsInitialTab('gyms');
        if (setVsInitialCategory) setVsInitialCategory('sinnoh');
        setCurrentView('vs');
      }
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

  const filtered = CHALLENGES
    .filter(c => c.category === selectedCategory && c.region === challengeRegion);

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
              <div className={`grid ${availableRegions.length >= 5 ? 'grid-cols-5' : availableRegions.length >= 4 ? 'grid-cols-4' : availableRegions.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 mb-2 w-full max-w-sm mx-auto`}>
                {availableRegions.map(region => (
                  <button
                    key={region.id}
                    onClick={() => {
                      setChallengeRegion(region.id);
                      if (region.id === 'kanto' && selectedCategory !== 'legendary' && selectedCategory !== 'rocket' && selectedCategory !== 'rival' && selectedCategory !== 'rematch') setSelectedCategory('rival');
                      if (region.id !== 'kanto' && selectedCategory !== 'legendary' && selectedCategory !== 'rocket' && selectedCategory !== 'rival' && selectedCategory !== 'rematch') setSelectedCategory(region.id);
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
                  if (challengeRegion === 'kanto') return !REGION_LABELS[id] || id === 'kanto';
                  if (REGION_LABELS[challengeRegion]) return id === challengeRegion || id === 'legendary' || id === 'rocket' || id === 'rival' || id === 'rematch';
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
            if (challenge.category === 'johto' || challenge.category === 'sinnoh') {
              return (
                <JohtoLeaderCard
                  key={challenge.id}
                  challenge={challenge}
                  unlocked={unlocked}
                  defeated={defeated}
                  onSelect={setSelectedChallenge}
                  onRequirementClick={handleRequirementClick}
                  requirementLabel={flagNames[challenge.requiresFlag] || challenge.requiresFlag}
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
                        {getTrainerCurrencyReward(challenge.reward).toLocaleString()}
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

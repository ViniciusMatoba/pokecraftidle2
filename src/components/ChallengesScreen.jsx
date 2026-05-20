import React, { useState } from 'react';
import { hasProgressRequirement } from '../utils/progress';
import { TYPE_COLOR_HEX } from '../data/gyms';
import { BadgeSVG } from './CommonUI';
import { getUnlockedRegions, REGION_LABELS } from '../data/regionStandards';
import { getTrainerCurrencyReward } from '../utils/economy';

const _BASE = import.meta.env.BASE_URL.replace(/\/$/, '') || '';
const fixBgPath = (bg) => bg ? bg.replace(/url\(['"]?(\/[^'"]+)['"]?\)/g, (_, p) => `url('${_BASE}${p}')`) : bg;

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
    label: 'Unova', start: 'unova_started', champion: 'unova_champion', villain: 'Team Plasma', villainSprite: psTrainer('plasmagrunt'), rivalSprite: psTrainer('cheren'), bg: "url('/bg_unova_route.webp') center/cover no-repeat",
    leagueBg: "url('/bg_unova_elite.webp') center/cover no-repeat",
    gymBgs: [
      "url('/bg_type_grass_domain.webp') center/cover no-repeat",    // Cilan (Striaton) - Grass
      "url('/bg_type_normal_domain.webp') center/cover no-repeat",   // Lenora (Nacrene) - Normal
      "url('/bg_type_bug_domain.webp') center/cover no-repeat",      // Burgh (Castelia) - Bug
      "url('/bg_type_electric_domain.webp') center/cover no-repeat", // Elesa (Nimbasa) - Electric
      "url('/bg_type_ground_domain.webp') center/cover no-repeat",   // Clay (Driftveil) - Ground
      "url('/bg_type_flying_domain.webp') center/cover no-repeat",   // Skyla (Mistralton) - Flying
      "url('/bg_type_ice_domain.webp') center/cover no-repeat",      // Brycen (Icirrus) - Ice
      "url('/bg_type_dragon_domain.webp') center/cover no-repeat"    // Drayden (Opelucid) - Dragon
    ],
    badges: ['trio_badge', 'basic_badge', 'insect_badge', 'bolt_badge', 'quake_badge', 'jet_badge', 'freeze_badge', 'legend_badge'],
    leaders: [['Cilan', 'Grass', 14, [511, 512]], ['Lenora', 'Normal', 20, [507, 505]], ['Burgh', 'Bug', 26, [541, 542, 544]], ['Elesa', 'Electric', 32, [587, 522, 523]], ['Clay', 'Ground', 39, [529, 536, 530]], ['Skyla', 'Flying', 45, [528, 521, 581]], ['Brycen', 'Ice', 52, [614, 615, 583]], ['Drayden', 'Dragon', 60, [611, 621, 612]]],
    league: [['Shauntal', 'Ghost', 72, [609, 623, 593]], ['Grimsley', 'Dark', 74, [560, 625, 635]], ['Caitlin', 'Psychic', 76, [518, 579, 576]], ['Marshal', 'Fighting', 78, [534, 538, 539]], ['Alder', 'Bug', 82, [617, 589, 637]]],
    rivals: [
      { suffix: 'rival_1', name: 'Cheren - Nuvema I', level: 12, req: 'unova_started', ids: [495, 498] },
      { suffix: 'rival_2', name: 'Cheren - Striaton', level: 20, req: 'trio_badge', ids: [497, 496, 501] },
      { suffix: 'rival_3', name: 'Cheren - Castelia', level: 28, req: 'insect_badge', ids: [500, 505, 523] },
      { suffix: 'rival_4', name: 'Cheren - Nimbasa', level: 35, req: 'bolt_badge', ids: [505, 523, 544] },
      { suffix: 'rival_5', name: 'Cheren - Mistralton', level: 42, req: 'quake_badge', ids: [508, 530, 581] },
      { suffix: 'rival_6', name: 'Cheren - Icirrus', level: 52, req: 'jet_badge', ids: [612, 581, 523, 530] },
      { suffix: 'rival_victory', name: 'Cheren - Victory Road Unova', level: 65, req: 'legend_badge', ids: [612, 545, 581, 530, 508] },
    ],
    villains: [
      { suffix: 'villain_1', name: 'Recruta Plasma', sprite: psTrainer('plasmagrunt'), level: 16, req: 'unova_started', ids: [504, 519], subtitle: 'Patrulha Plasma', quote: '"Nos libertamos Pokémon! Entregue o seu!"' },
      { suffix: 'villain_2', name: 'Recruta Plasma', sprite: psTrainer('plasmagrunt'), level: 24, req: 'insect_badge', ids: [519, 543, 527], subtitle: 'Bloco Plasma', quote: '"A Team Plasma nunca para!"' },
      { suffix: 'villain_3', name: 'Executivo Plasma', sprite: psTrainer('plasmagrunt'), level: 32, req: 'bolt_badge', ids: [542, 560, 529], subtitle: 'Caverna Plasma', quote: '"Em nome de Ghetsis, nos devemos vencer!"' },
      { suffix: 'villain_4', name: 'N - Primeiro Encontro', sprite: psTrainer('n'), level: 38, req: 'quake_badge', ids: [612, 571, 579], subtitle: 'Rival da Plasma', quote: '"Pokémon e pessoas devem se separar para serem livres."' },
      { suffix: 'villain_5', name: 'N - Castelo Plasma', sprite: psTrainer('n'), level: 52, req: 'freeze_badge', ids: [644, 612, 545, 571], subtitle: 'Confronto com N', quote: '"Reshiram/Zekrom escolheu você... Entao lutem!"' },
      { suffix: 'villain_boss', name: 'Ghetsis', sprite: psTrainer('ghetsis'), level: 62, req: 'legend_badge', ids: [625, 635, 579, 560, 571, 612], subtitle: 'Lider da Team Plasma', quote: '"Voce e um incomodo. Prepare-se para ser destruido!"' },
      { suffix: 'villain_final', name: 'N - Revanche Final', sprite: psTrainer('n'), level: 68, req: 'unova_champion', ids: [643, 612, 545, 571, 579, 625], subtitle: 'Epilogo de Unova', quote: '"Minha jornada ainda não acabou. Vamos batalhar de novo!"' },
    ],
  },
  kalos: {
    label: 'Kalos', start: 'kalos_started', champion: 'kalos_champion', villain: 'Team Flare', villainSprite: psTrainer('flaregrunt'), rivalSprite: psTrainer('shauna'), bg: "url('/bg_kalos_route.webp') center/cover no-repeat",
    leagueBg: "url('/bg_kalos_elite.webp') center/cover no-repeat",
    gymBgs: [
      "url('/bg_type_bug_domain.webp') center/cover no-repeat",      // Viola (Bug)
      "url('/bg_kalos_glittering_cave.webp') center/cover no-repeat", // Grant (Rock)
      "url('/bg_type_fighting_domain.webp') center/cover no-repeat", // Korrina (Fighting)
      "url('/bg_kalos_forest.webp') center/cover no-repeat",         // Ramos (Grass)
      "url('/bg_type_electric_domain.webp') center/cover no-repeat", // Clemont (Electric)
      "url('/bg_type_fairy_domain.webp') center/cover no-repeat",    // Valerie (Fairy)
      "url('/bg_type_psychic_domain.webp') center/cover no-repeat",  // Olympia (Psychic)
      "url('/bg_kalos_snow.webp') center/cover no-repeat"            // Wulfric (Ice)
    ],
    badges: ['bug_badge', 'cliff_badge', 'rumble_badge', 'plant_badge', 'voltage_badge', 'fairy_badge', 'psychic_badge', 'iceberg_badge'],
    leaders: [['Viola', 'Bug', 12, [283, 666]], ['Grant', 'Rock', 25, [696, 698]], ['Korrina', 'Fighting', 32, [619, 701]], ['Ramos', 'Grass', 34, [189, 71, 673]], ['Clemont', 'Electric', 40, [587, 82, 695]], ['Valerie', 'Fairy', 48, [303, 439, 700]], ['Olympia', 'Psychic', 59, [678, 199, 561]], ['Wulfric', 'Ice', 65, [460, 713, 712]]],
    league: [['Malva', 'Fire', 74, [668, 663, 609]], ['Siebold', 'Water', 76, [689, 693, 130]], ['Wikstrom', 'Steel', 78, [681, 476, 212]], ['Drasna', 'Dragon', 80, [691, 621, 706]], ['Diantha', 'Fairy', 86, [701, 697, 700, 282]]],
    rivals: [
      { suffix: 'rival_1', name: 'Calem - Vaniville', level: 12, req: 'kalos_started', ids: [650, 665] },
      { suffix: 'rival_2', name: 'Calem - Santalune', level: 20, req: 'bug_badge', ids: [652, 667, 296] },
      { suffix: 'rival_3', name: 'Calem - Camphrier', level: 28, req: 'rumble_badge', ids: [655, 667, 619] },
      { suffix: 'rival_4', name: 'Calem - Coumarine', level: 35, req: 'plant_badge', ids: [658, 671, 701] },
      { suffix: 'rival_5', name: 'Calem - Lumiose II', level: 42, req: 'voltage_badge', ids: [658, 695, 673, 701] },
      { suffix: 'rival_6', name: 'Calem - Anistar', level: 52, req: 'psychic_badge', ids: [658, 706, 695, 701, 673] },
      { suffix: 'rival_victory', name: 'Calem - Victory Road Kalos', level: 65, req: 'iceberg_badge', ids: [658, 706, 695, 701, 673, 671] },
    ],
    villains: [
      { suffix: 'villain_1', name: 'Recruta Flare', sprite: psTrainer('flaregrunt'), level: 16, req: 'kalos_started', ids: [667, 686], subtitle: 'Patrulha Flare', quote: '"Apenas os belos merecem viver neste mundo!"' },
      { suffix: 'villain_2', name: 'Recruta Flare', sprite: psTrainer('flaregrunt'), level: 28, req: 'rumble_badge', ids: [686, 667, 291], subtitle: 'Operacao Flare', quote: '"A Team Flare vai transformar o mundo!"' },
      { suffix: 'villain_3', name: 'Cientista Flare', sprite: psTrainer('flaregrunt'), level: 38, req: 'voltage_badge', ids: [668, 609, 695], subtitle: 'Lab Flare', quote: '"Nossa pesquisa para a arma definitiva progride!"' },
      { suffix: 'villain_4', name: 'Admin Flare', sprite: psTrainer('flaregrunt'), level: 46, req: 'fairy_badge', ids: [668, 706, 609], subtitle: 'Escalada Flare', quote: '"Voce não pode impedir Lysandre!"' },
      { suffix: 'villain_boss', name: 'Lysandre', sprite: psTrainer('lysandre'), level: 62, req: 'iceberg_badge', ids: [645, 668, 706, 695, 609], subtitle: 'Lider da Team Flare', quote: '"Este mundo e belo. Preciso preserva-lo eliminando a feiura!"' },
      { suffix: 'villain_6', name: 'Lysandre - Arma Suprema', sprite: psTrainer('lysandre'), level: 68, req: 'kalos_champion', ids: [645, 695, 706, 668, 609, 701], subtitle: 'Confronto Final Kalos', quote: '"Mesmo derrotado... a arma ainda pode ser ativada!"' },
      { suffix: 'villain_final', name: 'Admin Flare Revanche', sprite: psTrainer('flaregrunt'), level: 72, req: 'kalos_champion', ids: [706, 668, 609, 695, 667], subtitle: 'Pos-Kalos', quote: '"Nos continuamos acreditando em Lysandre!"' },
    ],
  },
  alola: {
    label: 'Alola', start: 'alola_started', champion: 'alola_champion', villain: 'Team Skull', villainSprite: psTrainer('skullgrunt'), rivalSprite: psTrainer('hau'), bg: "url('/bg_alola_route.webp') center/cover no-repeat",
    leagueBg: "url('/bg_alola_elite.webp') center/cover no-repeat",
    gymBgs: [
      "url('/bg_alola_verdant_cavern.webp') center/cover no-repeat", // Ilima (Normal)
      "url('/bg_type_fighting_domain.webp') center/cover no-repeat", // Hala (Fighting)
      "url('/bg_alola_akala.webp') center/cover no-repeat",          // Lana (Water)
      "url('/bg_alola_volcano.webp') center/cover no-repeat",        // Kiawe (Fire)
      "url('/bg_alola_route.webp') center/cover no-repeat",          // Mallow (Grass)
      "url('/bg_type_rock_domain.webp') center/cover no-repeat",     // Olivia (Rock)
      "url('/bg_type_electric_domain.webp') center/cover no-repeat", // Sophocles (Electric)
      "url('/bg_alola_ula_ula.webp') center/cover no-repeat",        // Nanu (Dark)
      "url('/bg_type_fairy_domain.webp') center/cover no-repeat",    // Mina (Fairy)
      "url('/bg_alola_poni_canyon.webp') center/cover no-repeat",    // Hapu (Ground)
    ],
    badges: ['melemele_stamp', 'akala_stamp', 'ulaula_stamp', 'poni_stamp', 'alola_elite_stamp', 'alola_champion_stamp', 'ultra_stamp', 'battle_tree_stamp'],
    leaders: [
      ['Ilima', 'Normal', 16, [676, 735], 'Capitao de Prova - Melemele'],
      ['Hala', 'Fighting', 18, [66, 297, 739], 'Grande Julgamento - Kahuna Melemele'],
      ['Lana', 'Water', 22, [746, 751, 690], 'Capitao de Prova - Akala'],
      ['Kiawe', 'Fire', 26, [757, 758, 609], 'Capitao de Prova - Akala'],
      ['Mallow', 'Grass', 30, [754, 761, 764], 'Capitao de Prova - Akala'],
      ['Olivia', 'Rock', 32, [703, 744, 745], 'Grande Julgamento - Kahuna Akala'],
      ['Sophocles', 'Electric', 38, [737, 777, 703], 'Capitao de Prova - Ulaula'],
      ['Nanu', 'Dark', 48, [302, 675, 730], 'Grande Julgamento - Kahuna Ulaula'],
      ['Mina', 'Fairy', 52, [742, 700, 303], 'Capitao de Prova - Poni'],
      ['Hapu', 'Ground', 58, [750, 330, 450], 'Grande Julgamento - Kahuna Poni'],
    ],
    leaderSubtitleOverride: true,
    league: [['Hala', 'Fighting', 82, [297, 739, 740]], ['Olivia Elite', 'Rock', 84, [476, 703, 745]], ['Acerola', 'Ghost', 86, [478, 426, 778]], ['Kahili', 'Flying', 88, [628, 741, 733]], ['Kukui', 'Mixed', 92, [745, 727, 724, 730]]],
    rivals: [
      { suffix: 'rival_1', name: 'Hau - Melemele I', level: 12, req: 'alola_started', ids: [722, 728] },
      { suffix: 'rival_2', name: 'Hau - Melemele II', level: 20, req: 'melemele_stamp', ids: [724, 728, 702] },
      { suffix: 'rival_3', name: 'Hau - Akala', level: 28, req: 'akala_stamp', ids: [726, 730, 702, 738] },
      { suffix: 'rival_4', name: 'Hau - Ulaula I', level: 35, req: 'ulaula_stamp', ids: [726, 730, 738, 745] },
      { suffix: 'rival_5', name: 'Hau - Ulaula II', level: 42, req: 'alola_elite_stamp', ids: [726, 730, 738, 741, 745] },
      { suffix: 'rival_6', name: 'Hau - Poni', level: 52, req: 'alola_champion_stamp', ids: [727, 730, 738, 741, 745] },
      { suffix: 'rival_victory', name: 'Hau - Mount Lanakila', level: 65, req: 'ultra_stamp', ids: [727, 730, 738, 741, 745, 702] },
    ],
    villains: [
      { suffix: 'villain_1', name: 'Recruta Skull', sprite: psTrainer('skullgrunt'), level: 18, req: 'alola_started', ids: [509, 728], subtitle: 'Patrulha Skull', quote: '"Nós somos a Team Skull! Yeahhh!"' },
      { suffix: 'villain_2', name: 'Recruta Skull', sprite: psTrainer('skullgrunt'), level: 28, req: 'melemele_stamp', ids: [571, 509, 728], subtitle: 'Bloqueio Skull', quote: '"Não vai passar sem enfrentar a Skull!"' },
      { suffix: 'villain_3', name: 'Admin Plumeria', sprite: psTrainer('skullgrunt'), level: 36, req: 'akala_stamp', ids: [571, 452, 435], subtitle: 'Admin da Team Skull', quote: '"Voce tocou nos meus garotos. Hora de pagar!"' },
      { suffix: 'villain_4', name: 'Recruta Skull II', sprite: psTrainer('skullgrunt'), level: 44, req: 'ulaula_stamp', ids: [452, 571, 758, 509], subtitle: 'Po Town Skull', quote: '"Esta cidade e nossa! Fora daqui!"' },
      { suffix: 'villain_boss', name: 'Guzma', sprite: psTrainer('guzma'), level: 52, req: 'alola_champion_stamp', ids: [754, 571, 452, 738, 697], subtitle: 'Lider da Team Skull', quote: '"Guzma vai te destruir! Thats what Guzma do!"' },
      { suffix: 'villain_6', name: 'Plumeria - Revanche', sprite: psTrainer('skullgrunt'), level: 62, req: 'ultra_stamp', ids: [571, 452, 435, 169, 454], subtitle: 'Epilogo Skull', quote: '"Juro que vou proteger meu bando!"' },
      { suffix: 'villain_final', name: 'Guzma - Aether', sprite: psTrainer('guzma'), level: 68, req: 'alola_champion', ids: [754, 571, 452, 738, 697, 130], subtitle: 'Confronto Final Alola', quote: '"Voce ainda me desafia? Guzma vai destruir tudo!"' },
    ],
  },
  galar: {
    label: 'Galar', start: 'galar_started', champion: 'galar_champion', villain: 'Team Yell', villainSprite: psTrainer('yellgrunt'), rivalSprite: psTrainer('hop'), bg: "url('/bg_galar_route.webp') center/cover no-repeat",
    leagueBg: "url('/bg_galar_elite.webp') center/cover no-repeat",
    gymBgs: [
      "url('/bg_galar_forest.webp') center/cover no-repeat",         // Milo (Grass)
      "url('/bg_galar_hulbury.webp') center/cover no-repeat",        // Nessa (Water)
      "url('/bg_type_fire_domain.webp') center/cover no-repeat",     // Kabu (Fire)
      "url('/bg_type_fighting_domain.webp') center/cover no-repeat", // Bea (Fighting)
      "url('/bg_type_fairy_domain.webp') center/cover no-repeat",    // Opal (Fairy)
      "url('/bg_galar_circhester.webp') center/cover no-repeat",     // Gordie (Rock)
      "url('/bg_type_dark_domain.webp') center/cover no-repeat",     // Piers (Dark)
      "url('/bg_type_dragon_domain.webp') center/cover no-repeat"    // Raihan (Dragon)
    ],
    badges: ['grass_badge_galar', 'water_badge_galar', 'fire_badge_galar', 'fighting_badge_galar', 'fairy_badge_galar', 'rock_badge_galar', 'dark_badge_galar', 'dragon_badge_galar'],
    leaders: [['Milo', 'Grass', 20, [829, 830]], ['Nessa', 'Water', 24, [833, 834]], ['Kabu', 'Fire', 27, [851, 59]], ['Bea', 'Fighting', 36, [865, 68]], ['Opal', 'Fairy', 38, [110, 868, 869]], ['Gordie', 'Rock', 42, [839, 874]], ['Piers', 'Dark', 46, [560, 862, 861]], ['Raihan', 'Dragon', 55, [844, 884, 330]]],
    league: [['Marnie', 'Dark', 74, [861, 452, 877]], ['Bede', 'Fairy', 78, [858, 869, 282]], ['Raihan', 'Dragon', 82, [884, 330, 706]], ['Leon', 'Fire', 90, [6, 887, 812, 815, 818]]],
    rivals: [
      { suffix: 'rival_1', name: 'Hop - Postwick', level: 12, req: 'galar_started', ids: [810, 816] },
      { suffix: 'rival_2', name: 'Hop - Wedgehurst', level: 20, req: 'grass_badge_galar', ids: [812, 816, 818] },
      { suffix: 'rival_3', name: 'Hop - Motostoke', level: 28, req: 'fire_badge_galar', ids: [812, 816, 818, 831] },
      { suffix: 'rival_4', name: 'Bede - Ballonlea', level: 35, req: 'fairy_badge_galar', ids: [858, 869, 282, 439] },
      { suffix: 'rival_5', name: 'Hop - Hammerlocke', level: 42, req: 'rock_badge_galar', ids: [815, 818, 831, 869] },
      { suffix: 'rival_6', name: 'Bede - Circhester', level: 52, req: 'dark_badge_galar', ids: [858, 869, 282, 701, 439] },
      { suffix: 'rival_victory', name: 'Hop - Victory Road Galar', level: 65, req: 'dragon_badge_galar', ids: [815, 818, 831, 869, 706] },
    ],
    villains: [
      { suffix: 'villain_1', name: 'Recruta Yell', sprite: psTrainer('yellgrunt'), level: 22, req: 'galar_started', ids: [877, 861], subtitle: 'Torcida Yell', quote: '"Ninguem para Marnie exceto a Team Yell!"' },
      { suffix: 'villain_2', name: 'Recruta Yell', sprite: psTrainer('yellgrunt'), level: 30, req: 'fire_badge_galar', ids: [877, 861, 452], subtitle: 'Bloqueio Yell', quote: '"A Team Yell não deixa você passar!"' },
      { suffix: 'villain_3', name: 'Executivo Macro Cosmos', sprite: psTrainer('yellgrunt'), level: 40, req: 'fairy_badge_galar', ids: [862, 861, 560, 877], subtitle: 'Macro Cosmos Inc.', quote: '"A Macro Cosmos controla Galar. Fique do lado certo!"' },
      { suffix: 'villain_4', name: 'Admin Oleana', sprite: psTrainer('yellgrunt'), level: 50, req: 'rock_badge_galar', ids: [334, 879, 861, 876], subtitle: 'Secretaria de Rose', quote: '"Sr. Rose não pode ser perturbado. Eu cuido de você!"' },
      { suffix: 'villain_boss', name: 'Rose', sprite: psTrainer('rose'), level: 60, req: 'dragon_badge_galar', ids: [879, 884, 873, 861, 876], subtitle: 'CEO da Macro Cosmos', quote: '"Estou tentando salvar Galar! Voce não entende!"' },
      { suffix: 'villain_6', name: 'Oleana - Revanche', sprite: psTrainer('yellgrunt'), level: 68, req: 'galar_champion', ids: [879, 861, 876, 334, 869], subtitle: 'Pos-Galar', quote: '"Estarei sempre ao lado de Rose-sama."' },
      { suffix: 'villain_final', name: 'Rose - Eternatus', sprite: psTrainer('rose'), level: 75, req: 'galar_champion', ids: [890, 884, 879, 861], subtitle: 'Confronto Final Galar', quote: '"Eternatus e a fonte de energia de Galar... e eu o libertei!"' },
    ],
  },
  hisui: {
    label: 'Hisui', start: 'hisui_started', champion: 'hisui_champion', villain: 'Galaxy Team', villainSprite: psTrainer('galacticgrunt'), rivalSprite: psTrainer('dawn'), bg: "url('/bg_hisui_fieldlands.webp') center/cover no-repeat",
    badges: ['fieldlands_stamp', 'mirelands_stamp', 'coastlands_stamp', 'highlands_stamp', 'icelands_stamp', 'lake_stamp', 'volo_stamp', 'arceus_stamp'],
    leaderSubtitleOverride: true,
    leaders: [
      ['Mai',    'Bug',     30, [900, 127],        'Nobre Frenético - Campos Obsidiana'],
      ['Lian',   'Grass',   40, [549, 193],        'Nobre Frenético - Pântanos Carmesim'],
      ['Iscan',  'Fire',    50, [59,  226],        'Nobre Frenético - Costa Cobalto'],
      ['Ingo',   'Electric',58, [101, 215, 443],   'Nobre Frenético - Terras Altas'],
      ['Gaeric', 'Ice',     65, [713, 220, 362],   'Nobre Frenético - Gelos Alabastro'],
      ['Irida',  'Water',   73, [484, 223, 457],   'Guardiã do Clã Perla'],
      ['Volo',   'Ghost',   82, [487, 437, 282, 571], 'O Traidor de Hisui'],
      ['Kamado', 'Normal',  92, [493, 487, 483, 484], 'Comandante Supremo - Arceus'],
    ],
    league: [
      ['Cogita',  'Psychic',  82, [426, 561, 442]],
      ['Cyllene', 'Ice',      84, [461, 459, 477]],
      ['Adaman',  'Fighting', 86, [392, 398, 395, 483]],
      ['Sabi',    'Grass',    88, [549, 470, 182, 465]],
      ['Kamado',  'Normal',   94, [493, 487, 483, 484, 445]],
    ],
    rivals: [
      { suffix: 'rival_1', name: 'Akari - Aldeia Jubilife', level: 15, req: 'hisui_started', ids: [722, 399] },
      { suffix: 'rival_2', name: 'Akari - Campos Obsidiana', level: 28, req: 'fieldlands_stamp', ids: [724, 403, 418] },
      { suffix: 'rival_3', name: 'Akari - Pântanos Carmesim', level: 40, req: 'mirelands_stamp', ids: [726, 403, 418, 123] },
      { suffix: 'rival_4', name: 'Akari - Costa Cobalto', level: 50, req: 'coastlands_stamp', ids: [727, 403, 418, 123, 100] },
      { suffix: 'rival_5', name: 'Akari - Terras Altas', level: 58, req: 'highlands_stamp', ids: [727, 418, 123, 100, 713] },
      { suffix: 'rival_6', name: 'Akari - Gelos Alabastro', level: 65, req: 'icelands_stamp', ids: [727, 418, 123, 100, 713, 487] },
      { suffix: 'rival_victory', name: 'Akari - Praça Sagrada', level: 78, req: 'volo_stamp', ids: [724, 418, 123, 100, 713, 487] },
    ],
    villains: [
      { suffix: 'villain_1',    name: 'Recruta Galática',   sprite: psTrainer('galacticgrunt'), level: 18, req: 'hisui_started',     ids: [396, 399],           subtitle: 'Patrulha Galática',       quote: '"Esta área é propriedade da Expedição Galática!"' },
      { suffix: 'villain_2',    name: 'Recruta Galática',   sprite: psTrainer('galacticgrunt'), level: 28, req: 'fieldlands_stamp',  ids: [403, 399, 418],      subtitle: 'Bloqueio Galática',       quote: '"Nenhum membro renegado passa por aqui!"' },
      { suffix: 'villain_3',    name: 'Capitão Zisu',        sprite: psTrainer('acetrainerf'),   level: 38, req: 'mirelands_stamp',   ids: [100, 127, 123],      subtitle: 'Guardião Obstrutivo',      quote: '"Prove que você merece avançar em nossa missão!"' },
      { suffix: 'villain_4',    name: 'Volo - Primeiros Sinais', sprite: psTrainer('looker'),   level: 48, req: 'coastlands_stamp',  ids: [437, 282, 571],      subtitle: 'Pesquisador Suspeito',     quote: '"Você é admirável... mas há coisas que não deve saber."' },
      { suffix: 'villain_5',    name: 'Volo - Revelação',    sprite: psTrainer('looker'),        level: 60, req: 'highlands_stamp',   ids: [437, 282, 571, 487], subtitle: 'A Traição de Volo',        quote: '"Eu nunca quis a paz. Quero o poder do Deus Pokémon!"' },
      { suffix: 'villain_boss', name: 'Volo + Giratina',     sprite: psTrainer('looker'),        level: 75, req: 'lake_stamp',        ids: [487, 437, 282, 571, 359], subtitle: 'Confronto com o Traidor', quote: '"Giratina! Destrua quem se opõe a mim!"' },
      { suffix: 'villain_final', name: 'Volo - Revanche',    sprite: psTrainer('looker'),        level: 85, req: 'hisui_champion',    ids: [487, 437, 282, 571, 384, 445], subtitle: 'Epílogo de Hisui', quote: '"Mesmo derrotado... o Pokémon Deus pertence a mim!"' },
    ],
  },
  paldea: {
    label: 'Paldea', start: 'paldea_started', champion: 'paldea_champion', villain: 'Team Star', villainSprite: psTrainer('giacomo'), rivalSprite: psTrainer('schoolkidf'), bg: "url('/bg_paldea_route.webp') center/cover no-repeat",
    leagueBg: "url('/bg_paldea_elite.webp') center/cover no-repeat",
    gymBgs: [
      "url('/bg_type_bug_domain.webp') center/cover no-repeat",      // Katy (Bug)
      "url('/bg_type_grass_domain.webp') center/cover no-repeat",    // Brassius (Grass)
      "url('/bg_type_electric_domain.webp') center/cover no-repeat", // Iono (Electric)
      "url('/bg_type_water_domain.webp') center/cover no-repeat",    // Kofu (Water)
      "url('/bg_type_normal_domain.webp') center/cover no-repeat",   // Larry (Normal)
      "url('/bg_type_ghost_domain.webp') center/cover no-repeat",    // Ryme (Ghost)
      "url('/bg_type_psychic_domain.webp') center/cover no-repeat",  // Tulip (Psychic)
      "url('/bg_type_ice_domain.webp') center/cover no-repeat"       // Grusha (Ice)
    ],
    badges: ['bug_badge_paldea', 'grass_badge_paldea', 'electric_badge_paldea', 'water_badge_paldea', 'normal_badge_paldea', 'ghost_badge_paldea', 'psychic_badge_paldea', 'ice_badge_paldea'],
    leaders: [['Katy', 'Bug', 15, [917, 919]], ['Brassius', 'Grass', 20, [949, 753]], ['Iono', 'Electric', 28, [940, 941]], ['Kofu', 'Water', 35, [961, 950]], ['Larry', 'Normal', 42, [931, 924, 925]], ['Ryme', 'Ghost', 48, [972, 937]], ['Tulip', 'Psychic', 55, [956, 981]], ['Grusha', 'Ice', 60, [974, 975]]],
    league: [['Rika', 'Ground', 72, [980, 982, 968]], ['Poppy', 'Steel', 75, [879, 959, 1000]], ['Larry Elite', 'Flying', 78, [931, 973, 701]], ['Hassel', 'Dragon', 82, [998, 887, 1008]], ['Geeta', 'Rock', 88, [970, 983, 1008]]],
    rivals: [
      { suffix: 'rival_1', name: 'Nemona - Mesagoza I', level: 12, req: 'paldea_started', ids: [906, 909] },
      { suffix: 'rival_2', name: 'Nemona - Sul de Paldea', level: 20, req: 'bug_badge_paldea', ids: [908, 909, 912] },
      { suffix: 'rival_3', name: 'Nemona - Porto Marinada', level: 28, req: 'electric_badge_paldea', ids: [908, 912, 936] },
      { suffix: 'rival_4', name: 'Nemona - Medali', level: 35, req: 'water_badge_paldea', ids: [911, 914, 936, 978] },
      { suffix: 'rival_5', name: 'Nemona - Levincia', level: 42, req: 'normal_badge_paldea', ids: [911, 914, 936, 940, 978] },
      { suffix: 'rival_6', name: 'Nemona - Glaseado', level: 52, req: 'ghost_badge_paldea', ids: [914, 936, 940, 975, 978] },
      { suffix: 'rival_victory', name: 'Nemona - Academia Uva/Naranja', level: 65, req: 'ice_badge_paldea', ids: [914, 936, 940, 975, 978, 1008] },
    ],
    villains: [
      { suffix: 'villain_1', name: 'Giacomo - Base Dark', sprite: psTrainer('giacomo'), level: 21, req: 'paldea_started', ids: [861, 877], subtitle: 'Base Star Sombria', quote: '"Intrusos na base? Hora de ensinar uma licao!"' },
      { suffix: 'villain_2', name: 'Mela - Base Fire', sprite: psTrainer('mela'), level: 27, req: 'grass_badge_paldea', ids: [963, 851, 59], subtitle: 'Base Star Ardente', quote: '"Meu fogo não vai se apagar!"' },
      { suffix: 'villain_3', name: 'Atticus - Base Poison', sprite: psTrainer('atticus'), level: 34, req: 'electric_badge_paldea', ids: [945, 952, 317], subtitle: 'Base Star Toxica', quote: '"Arte e veneno sao a mesma coisa!"' },
      { suffix: 'villain_4', name: 'Ortega - Base Fairy', sprite: psTrainer('ortega'), level: 45, req: 'normal_badge_paldea', ids: [868, 869, 282, 282], subtitle: 'Base Star Fantasiosa', quote: '"Voce e corajoso por desafiar a minha base!"' },
      { suffix: 'villain_boss', name: 'Eri - Base Fighting', sprite: psTrainer('eri'), level: 50, req: 'ghost_badge_paldea', ids: [973, 68, 534, 448, 297], subtitle: 'Base Star Combatente', quote: '"Esta é minha batalha mais séria!"' },
      { suffix: 'villain_6', name: 'Cassiopeia/Penny', sprite: psTrainer('penny'), level: 60, req: 'psychic_badge_paldea', ids: [1009, 1006, 861, 963, 945], subtitle: 'Lider da Team Star', quote: '"Sou eu, Penny... Cassiopeia. Preciso proteger meus amigos!"' },
      { suffix: 'villain_final', name: 'Penny - Confronto Final', sprite: psTrainer('penny'), level: 68, req: 'paldea_champion', ids: [1009, 1006, 861, 963, 973, 945], subtitle: 'Epilogo de Paldea', quote: '"A Team Star existiu para proteger quem precisava. Valeu a pena!"' },
    ],
    titans: [
      { suffix: 'titan_klawf', name: 'Klawf - Titã de Rocha', sprite: psTrainer('giacomo'), level: 16, req: 'paldea_started', ids: [950], subtitle: 'Titã de Rocha - Klawf', quote: '"Um Pokémon gigantesco bloqueia o caminho!"' },
      { suffix: 'titan_bombirdier', name: 'Bombirdier - Titã Voador', sprite: psTrainer('giacomo'), level: 20, req: 'bug_badge_paldea', ids: [962], subtitle: 'Titã Voador - Bombirdier', quote: '"Um Pokémon gigantesco bloqueia o caminho!"' },
      { suffix: 'titan_orthworm', name: 'Orthworm - Titã de Aço', sprite: psTrainer('giacomo'), level: 28, req: 'grass_badge_paldea', ids: [968], subtitle: 'Titã de Aço - Orthworm', quote: '"Um Pokémon gigantesco bloqueia o caminho!"' },
      { suffix: 'titan_greattusk', name: 'Presas Gigantes - Titã Terrestre', sprite: psTrainer('giacomo'), level: 35, req: 'electric_badge_paldea', ids: [984], subtitle: 'Titã Terrestre - Presas Gigantes', quote: '"Um Pokémon gigantesco bloqueia o caminho!"' },
      { suffix: 'titan_dondozo', name: 'Dondozo - Titã Aquático', sprite: psTrainer('giacomo'), level: 42, req: 'water_badge_paldea', ids: [977, 978], subtitle: 'Titã Aquático - Dondozo', quote: '"Um Pokémon gigantesco bloqueia o caminho!"' },
      { suffix: 'titan_falsedra', name: 'Falso Dragão - Titã Final', sprite: psTrainer('giacomo'), level: 55, req: 'ghost_badge_paldea', ids: [1006, 978], subtitle: 'Titã Falso Dragão', quote: '"Um Pokémon gigantesco bloqueia o caminho!"' },
    ],
  },
};

// Per-region villain team Pokémon (used by generic villain builder for regions without custom villain arrays)
const VILLAIN_POKEMON = {
  unova:  [[504, 519], [519, 543, 527], [542, 560, 529], [529, 571, 579], [612, 571, 545], [625, 635, 579, 612], [643, 625, 579]],
  kalos:  [[667, 686], [686, 667, 291], [668, 609, 695], [668, 706, 609], [645, 668, 706, 695, 609], [695, 706, 668, 609, 701], [706, 668, 609, 695, 667]],
  alola:  [[509, 728], [571, 509, 728], [571, 452, 435], [452, 571, 758, 509], [754, 571, 452, 738, 697], [571, 452, 435, 169, 454], [754, 571, 452, 738, 697, 130]],
  galar:  [[877, 861], [877, 861, 452], [862, 861, 560, 877], [334, 879, 861, 876], [879, 884, 873, 861, 876], [879, 861, 876, 334, 869], [890, 884, 879, 861]],
  paldea: [[861, 877], [963, 851, 59], [945, 952, 317], [868, 869, 282], [973, 68, 534, 448, 297], [1009, 1006, 861, 963, 945], [1009, 1006, 861, 963, 973, 945]],
};

const buildFutureRegionChallenges = () => Object.entries(FUTURE_REGION_CHALLENGE_DATA).flatMap(([region, cfg]) => {
  // -- Rivals (7 battles) ------------------------------------------------------
  const rivalEntries = cfg.rivals || [
    { suffix: 'rival_start', name: `Rival - ${cfg.label} I`, level: 12, req: cfg.start, ids: [cfg.leaders[0][3][0], cfg.leaders[1][3][0]] },
    { suffix: 'rival_mid', name: `Rival - ${cfg.label} II`, level: 38, req: cfg.badges[2], ids: [cfg.leaders[2][3][0], cfg.leaders[3][3][0], cfg.leaders[4][3][0]] },
    { suffix: 'rival_victory', name: `Rival - Victory Road ${cfg.label}`, level: 70, req: cfg.badges[7], ids: [cfg.leaders[5][3][0], cfg.leaders[6][3][0], cfg.leaders[7][3][0]] },
  ];
  const rivalBattles = rivalEntries.map((entry, i) => {
    const unlockFlag = entry.unlock || `${region}_${entry.suffix}_defeated`;
    const prevUnlock = i === 0 ? null : (rivalEntries[i - 1].unlock || `${region}_${rivalEntries[i - 1].suffix}_defeated`);
    return {
      region, id: `${region}_${entry.suffix}`, category: 'rival', name: entry.name || `Rival - ${cfg.label} ${i + 1}`,
      subtitle: 'Rivalidade Regional', sprite: cfg.rivalSprite,
      quote: '"Vamos testar se você esta pronto para o proximo passo."',
      reward: entry.level * 900, unlockFlag, requiresFlag: i === 0 ? entry.req : (entry.req || prevUnlock),
      team: team(entry.ids, entry.level), background: cfg.bg, location: `${cfg.label} - Jornada`,
    };
  });

  // -- Villains (7 battles) ----------------------------------------------------
  const villainEntries = cfg.villains || [];
  const villainBattles = villainEntries.length > 0 ? villainEntries.map((entry, i) => {
    const unlockFlag = entry.unlock || `${region}_${entry.suffix}_cleared`;
    const prevUnlock = i === 0 ? null : (villainEntries[i - 1].unlock || `${region}_${villainEntries[i - 1].suffix}_cleared`);
    return {
      region, id: `${region}_${entry.suffix}`, category: 'rocket',
      name: entry.name, subtitle: entry.subtitle || 'Equipe Vila Regional',
      sprite: entry.sprite || cfg.villainSprite, quote: entry.quote || '"Nosso plano não sera interrompido por você."',
      reward: entry.level * 1000, unlockFlag,
      requiresFlag: i === 0 ? entry.req : (entry.req || prevUnlock),
      team: team(entry.ids, entry.level), background: cfg.bg, location: `${cfg.label} - Operacao da Equipe Vila`,
    };
  }) : [
    { suffix: 'villain_1', level: 24, req: rivalEntries[0]?.unlock || `${region}_${rivalEntries[0]?.suffix}_defeated` },
    { suffix: 'villain_2', level: 50, req: cfg.badges[4] },
    { suffix: 'villain_final', level: 66, req: cfg.badges[6] },
  ].map((entry, i) => ({
    region, id: `${region}_${entry.suffix}`, category: 'rocket', name: `${cfg.villain} ${i === 2 ? 'Boss' : 'Grunt'}`, subtitle: 'Equipe Vila Regional',
    sprite: cfg.villainSprite, quote: '"Nosso plano não sera interrompido por você."',
    reward: entry.level * 1000, unlockFlag: `${region}_${entry.suffix}_cleared`, requiresFlag: entry.req,
    team: team([cfg.leaders[i + 1][3][0], cfg.leaders[i + 3][3][0], cfg.leaders[i + 5]?.[3]?.[0] || cfg.leaders[7][3][0]], entry.level),
    background: cfg.bg, location: `${cfg.label} - Operacao da Equipe Vila`,
  }));

  // -- Gym Leaders -------------------------------------------------------------
  // For Alola, leaders array has 10 entries (trials + kahunas mapped to 8 stamps via stamp index override)
  const alolaStampMap = region === 'alola' ? [0, 0, 1, 1, 1, 1, 2, 2, 3, 3] : null;
  const gymBattles = cfg.leaders.map((leaderData, index) => {
    const [name, type, level, ids, customSubtitle] = leaderData;
    const badgeIndex = alolaStampMap ? alolaStampMap[index] : Math.min(index, cfg.badges.length - 1);
    const badge = cfg.badges[badgeIndex];
    const subtitle = cfg.leaderSubtitleOverride && customSubtitle ? customSubtitle : `Ginasio #${index + 1}`;
    const prevBadge = index === 0 ? (villainBattles[0]?.unlockFlag || cfg.start) : cfg.badges[alolaStampMap ? alolaStampMap[index - 1] : Math.min(index - 1, cfg.badges.length - 1)];
    const normalizedLevel = level;
    return {
      region, id: `${region}_gym_${index + 1}`, category: region, name, subtitle,
      sprite: trainerSprite(name),
      quote: `"Meu tipo ${type} vai definir esta batalha."`,
      reward: normalizedLevel * 1200,
      unlockFlag: region === 'alola' ? `${region}_trial_${index + 1}_cleared` : badge,
      badgeToGive: badge,
      requiresFlag: index === 0 ? (villainBattles[0]?.unlockFlag || cfg.start) : prevBadge,
      badge, badgeOrder: badgeIndex + 1, type, typeIcon: typeIconUrl(type),
      team: team(ids, normalizedLevel), background: (cfg.gymBgs && cfg.gymBgs[index]) ? cfg.gymBgs[index] : cfg.bg, location: `${cfg.label} - ${subtitle}`,
    };
  });

  // -- League / Elite Four ------------------------------------------------------
  // For Alola the last gym leader unlocks rival_victory, which then unlocks league
  const lastGymUnlock = region === 'alola' ? `${region}_trial_${cfg.leaders.length}_cleared` : cfg.badges[cfg.badges.length - 1];
  const rivalVictoryUnlock = rivalEntries.at(-1)?.unlock || `${region}_${rivalEntries.at(-1)?.suffix}_defeated`;
  const leagueBattles = cfg.league.map(([name, type, level, ids], index) => ({
    region, id: index === cfg.league.length - 1 ? `${region}_champion` : `${region}_elite_${index + 1}`,
    category: region, name, subtitle: index === cfg.league.length - 1 ? `Campeao de ${cfg.label}` : `Elite Four #${index + 1}`,
    sprite: trainerSprite(name),
    quote: '"A Liga reconhece apenas quem vence no limite."',
    reward: level * 1600,
    unlockFlag: index === cfg.league.length - 1 ? cfg.champion : `${region}_elite_${index + 1}_defeated`,
    requiresFlag: index === 0 ? rivalVictoryUnlock : `${region}_elite_${index}_defeated`,
    type, typeIcon: typeIconUrl(type), team: team(ids, level), background: cfg.leagueBg || "url('/bg_elite_four.webp') center/cover no-repeat",
    location: `${cfg.label} Pokémon League`,
  }));

  // -- Rematches ----------------------------------------------------------------
  const rematches = cfg.leaders.map((leaderData, index) => {
    const [name, type, , ids] = leaderData;
    return {
      region, id: `${region}_rematch_${index + 1}`, category: 'rematch', name: `Revanche ${name}`, subtitle: `${cfg.label} Rematch`,
      sprite: trainerSprite(name),
      quote: '"Agora sem limite de campanha. Mostre seu time de elite."',
      reward: 90000 + index * 5000, unlockFlag: `${region}_rematch_${index + 1}_defeated`, requiresFlag: cfg.champion,
      type, typeIcon: typeIconUrl(type), team: team([...ids, cfg.league.at(-1)[3][0]].slice(0, 4), 100), background: cfg.bg,
      location: `${cfg.label} - Revanche`,
    };
  });

  // -- Titans (Paldea only) -----------------------------------------------------
  const titanBattles = (cfg.titans || []).map((entry, i) => {
    const unlockFlag = `${region}_${entry.suffix}_cleared`;
    const prevUnlock = i === 0 ? entry.req : (`${region}_${(cfg.titans[i - 1]).suffix}_cleared`);
    return {
      region, id: `${region}_${entry.suffix}`, category: 'titan',
      name: entry.name, subtitle: entry.subtitle,
      sprite: entry.sprite, quote: entry.quote,
      reward: entry.level * 1100, unlockFlag,
      requiresFlag: i === 0 ? entry.req : prevUnlock,
      team: team(entry.ids, entry.level), background: cfg.bg, location: `${cfg.label} - Caminho das Lendas`,
    };
  });

  return [...rivalBattles, ...villainBattles, ...gymBattles, ...leagueBattles, ...rematches, ...titanBattles];
});

const FUTURE_REGION_CHALLENGES = buildFutureRegionChallenges();

// ── Lendários das regiões futuras (Unova → Paldea) ─────────────────────────
const _sp = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
const FUTURE_REGION_LEGENDARIES = [
  // ─────────────── HOENN ───────────────────────────────────────────────────
  {
    region: 'hoenn', id: 'kyogre', category: 'legendary', name: 'Kyogre',
    subtitle: 'Soberana do Oceano', sprite: _sp(382),
    quote: '"As profundezas do oceano respondem ao meu chamado. Afogue-se em meu poder!"',
    reward: 5000, unlockFlag: 'kyogre_defeated', requiresFlag: 'hoenn_champion',
    team: [{ id: 382, level: 75 }], background: "url('/bg_elite_four_hoenn.webp') center/cover no-repeat",
    location: 'Cave of Origin - Sootopolis',
  },
  {
    region: 'hoenn', id: 'groudon', category: 'legendary', name: 'Groudon',
    subtitle: 'Soberano da Terra', sprite: _sp(383),
    quote: '"A terra inteira treme com minha presença. Você ousa ficar de pé?"',
    reward: 5000, unlockFlag: 'groudon_defeated', requiresFlag: 'kyogre_defeated',
    team: [{ id: 383, level: 75 }], background: "url('/bg_elite_four_hoenn.webp') center/cover no-repeat",
    location: 'Cave of Origin - Sootopolis',
  },
  {
    region: 'hoenn', id: 'regirock', category: 'legendary', name: 'Regirock',
    subtitle: 'O Golem da Rocha', sprite: _sp(377),
    quote: '"Corpo de rocha forjado pelo tempo. Minha resistência não tem fim."',
    reward: 2000, unlockFlag: 'regirock_defeated', requiresFlag: 'groudon_defeated',
    team: [{ id: 377, level: 72 }], background: "url('/bg_victory_road_hoenn.webp') center/cover no-repeat",
    location: 'Desert Ruins',
  },
  {
    region: 'hoenn', id: 'regice', category: 'legendary', name: 'Regice',
    subtitle: 'O Golem do Gelo', sprite: _sp(378),
    quote: '"Gelo que congela até o tempo. Sinta o frio absoluto."',
    reward: 2000, unlockFlag: 'regice_defeated', requiresFlag: 'regirock_defeated',
    team: [{ id: 378, level: 72 }], background: "url('/bg_victory_road_hoenn.webp') center/cover no-repeat",
    location: 'Island Cave',
  },
  {
    region: 'hoenn', id: 'registeel', category: 'legendary', name: 'Registeel',
    subtitle: 'O Golem de Aço', sprite: _sp(379),
    quote: '"Aço puro e eterno. Nem o tempo desgasta minha armadura."',
    reward: 2000, unlockFlag: 'registeel_defeated', requiresFlag: 'regice_defeated',
    team: [{ id: 379, level: 72 }], background: "url('/bg_victory_road_hoenn.webp') center/cover no-repeat",
    location: 'Ancient Tomb',
  },
  {
    region: 'hoenn', id: 'latias', category: 'legendary', name: 'Latias',
    subtitle: 'O Pokémon Eon', sprite: _sp(380),
    quote: '"Meus pensamentos alcançam além do vento. Você consegue me seguir?"',
    reward: 3000, unlockFlag: 'latias_defeated', requiresFlag: 'registeel_defeated',
    team: [{ id: 380, level: 78 }], background: "url('/bg_elite_four_hoenn.webp') center/cover no-repeat",
    location: 'Southern Island',
  },
  {
    region: 'hoenn', id: 'latios', category: 'legendary', name: 'Latios',
    subtitle: 'O Pokémon Eon', sprite: _sp(381),
    quote: '"Voo mais rápido que um raio. Pegue-me… se puder."',
    reward: 3000, unlockFlag: 'latios_defeated', requiresFlag: 'latias_defeated',
    team: [{ id: 381, level: 78 }], background: "url('/bg_elite_four_hoenn.webp') center/cover no-repeat",
    location: 'Southern Island',
  },
  {
    region: 'hoenn', id: 'jirachi', category: 'legendary', name: 'Jirachi',
    subtitle: 'O Pokémon Desejo', sprite: _sp(385),
    quote: '"Desperto a cada mil anos. Você é digno do meu desejo?"',
    reward: 8000, unlockFlag: 'jirachi_defeated', requiresFlag: 'rayquaza_defeated',
    team: [{ id: 385, level: 90 }], background: "url('/bg_sky_pillar.webp') center/cover no-repeat",
    location: 'Forina',
  },
  {
    region: 'hoenn', id: 'deoxys', category: 'legendary', name: 'Deoxys',
    subtitle: 'O Pokémon DNA', sprite: _sp(386),
    quote: '"Vim do espaço profundo. Sua força pode me alcançar?"',
    reward: 12000, unlockFlag: 'deoxys_defeated', requiresFlag: 'jirachi_defeated',
    team: [{ id: 386, level: 95 }], background: "url('/bg_sky_pillar.webp') center/cover no-repeat",
    location: 'Birth Island',
  },

  // ─────────────── SINNOH ──────────────────────────────────────────────────
  {
    region: 'sinnoh', id: 'uxie', category: 'legendary', name: 'Uxie',
    subtitle: 'O Ser do Conhecimento', sprite: _sp(480),
    quote: '"Tudo que você conhece, eu conheço também. E muito mais."',
    reward: 2000, unlockFlag: 'uxie_defeated', requiresFlag: 'sinnoh_champion',
    team: [{ id: 480, level: 80 }], background: "url('/bg_snowpoint.webp') center/cover no-repeat",
    location: 'Lago Acuidade',
  },
  {
    region: 'sinnoh', id: 'mesprit', category: 'legendary', name: 'Mesprit',
    subtitle: 'O Ser das Emoções', sprite: _sp(481),
    quote: '"Você sente o peso desta batalha? Isso é o que eu guardo em mim."',
    reward: 2000, unlockFlag: 'mesprit_defeated', requiresFlag: 'uxie_defeated',
    team: [{ id: 481, level: 80 }], background: "url('/bg_sinnoh_league.webp') center/cover no-repeat",
    location: 'Lago Verity',
  },
  {
    region: 'sinnoh', id: 'azelf', category: 'legendary', name: 'Azelf',
    subtitle: 'O Ser da Força de Vontade', sprite: _sp(482),
    quote: '"A vontade que te trouxe até aqui... será suficiente?"',
    reward: 2000, unlockFlag: 'azelf_defeated', requiresFlag: 'mesprit_defeated',
    team: [{ id: 482, level: 80 }], background: "url('/bg_villain_galactic.webp') center/cover no-repeat",
    location: 'Lago Valor',
  },
  {
    region: 'sinnoh', id: 'heatran', category: 'legendary', name: 'Heatran',
    subtitle: 'O Pokémon Chama', sprite: _sp(485),
    quote: '"As chamas do interior da terra nunca se apagam. Nem as minhas."',
    reward: 5000, unlockFlag: 'heatran_defeated', requiresFlag: 'azelf_defeated',
    team: [{ id: 485, level: 85 }], background: "url('/bg_expedition_sinnoh_stark_mountain.webp') center/cover no-repeat",
    location: 'Stark Mountain',
  },
  {
    region: 'sinnoh', id: 'cresselia', category: 'legendary', name: 'Cresselia',
    subtitle: 'O Pokémon Lua Crescente', sprite: _sp(488),
    quote: '"Sonhos bons ou pesadelos — eu decido qual te toca esta noite."',
    reward: 5000, unlockFlag: 'cresselia_defeated', requiresFlag: 'heatran_defeated',
    team: [{ id: 488, level: 85 }], background: "url('/bg_sinnoh_league.webp') center/cover no-repeat",
    location: 'Fullmoon Island',
  },
  {
    region: 'sinnoh', id: 'regigigas', category: 'legendary', name: 'Regigigas',
    subtitle: 'O Colosso', sprite: _sp(486),
    quote: '"Fui eu que arrastei os continentes. Sua resistência é apenas uma formiga."',
    reward: 5000, unlockFlag: 'regigigas_defeated', requiresFlag: 'cresselia_defeated',
    team: [{ id: 486, level: 88 }], background: "url('/bg_snowpoint.webp') center/cover no-repeat",
    location: 'Snowpoint Temple',
  },
  {
    region: 'sinnoh', id: 'dialga', category: 'legendary', name: 'Dialga',
    subtitle: 'O Deus do Tempo', sprite: _sp(483),
    quote: '"O tempo flui pela minha vontade. Tudo que foi e será depende de mim."',
    reward: 5000, unlockFlag: 'dialga_defeated', requiresFlag: 'regigigas_defeated',
    team: [{ id: 483, level: 92 }], background: "url('/bg_expedition_sinnoh_mt_coronet.webp') center/cover no-repeat",
    location: 'Spear Pillar',
  },
  {
    region: 'sinnoh', id: 'palkia', category: 'legendary', name: 'Palkia',
    subtitle: 'O Deus do Espaço', sprite: _sp(484),
    quote: '"O espaço dobra à minha vontade. Não há lugar onde você possa se esconder."',
    reward: 5000, unlockFlag: 'palkia_defeated', requiresFlag: 'dialga_defeated',
    team: [{ id: 484, level: 92 }], background: "url('/bg_expedition_sinnoh_mt_coronet.webp') center/cover no-repeat",
    location: 'Spear Pillar',
  },
  {
    region: 'sinnoh', id: 'giratina', category: 'legendary', name: 'Giratina',
    subtitle: 'O Senhor do Mundo Distorcido', sprite: _sp(487),
    quote: '"Este mundo paralelo é meu reino. Você não deveria ter vindo aqui."',
    reward: 12000, unlockFlag: 'giratina_defeated', requiresFlag: 'palkia_defeated',
    team: [{ id: 487, level: 100 }], background: "url('/bg_mt_coronet.webp') center/cover no-repeat",
    location: 'Distortion World',
  },

  // ─────────────── UNOVA ───────────────────────────────────────────────────
  {
    region: 'unova', id: 'cobalion', category: 'legendary', name: 'Cobalion',
    subtitle: 'O Guerreiro de Aço', sprite: _sp(638),
    quote: '"Meu aço não cede. Prove que seu coração é digno."',
    reward: 2000, unlockFlag: 'cobalion_defeated', requiresFlag: 'unova_champion',
    team: [{ id: 638, level: 72 }], background: "url('/bg_unova_route.webp') center/cover no-repeat",
    location: 'Mistralton Cave',
  },
  {
    region: 'unova', id: 'terrakion', category: 'legendary', name: 'Terrakion',
    subtitle: 'O Guerreiro da Rocha', sprite: _sp(639),
    quote: '"Aqueles que oprimem os fracos serão varridos pela minha força!"',
    reward: 2000, unlockFlag: 'terrakion_defeated', requiresFlag: 'cobalion_defeated',
    team: [{ id: 639, level: 74 }], background: "url('/bg_unova_route.webp') center/cover no-repeat",
    location: 'Victory Road - Unova',
  },
  {
    region: 'unova', id: 'virizion', category: 'legendary', name: 'Virizion',
    subtitle: 'O Guerreiro da Pradaria', sprite: _sp(640),
    quote: '"Com elegância e velocidade, corto qualquer oponente."',
    reward: 2000, unlockFlag: 'virizion_defeated', requiresFlag: 'terrakion_defeated',
    team: [{ id: 640, level: 74 }], background: "url('/bg_unova_route.webp') center/cover no-repeat",
    location: 'Pinwheel Forest',
  },
  {
    region: 'unova', id: 'tornadus', category: 'legendary', name: 'Tornadus',
    subtitle: 'O Pokémon Tempestade', sprite: _sp(641),
    quote: '"Os ventos que eu invoco derrubariam até montanhas."',
    reward: 2000, unlockFlag: 'tornadus_defeated', requiresFlag: 'virizion_defeated',
    team: [{ id: 641, level: 78 }], background: "url('/bg_unova_route.webp') center/cover no-repeat",
    location: 'Rotas de Unova',
  },
  {
    region: 'unova', id: 'thundurus', category: 'legendary', name: 'Thundurus',
    subtitle: 'O Pokémon Relâmpago', sprite: _sp(642),
    quote: '"Meus raios rasgam o céu. Você é corajoso demais... ou louco."',
    reward: 2000, unlockFlag: 'thundurus_defeated', requiresFlag: 'tornadus_defeated',
    team: [{ id: 642, level: 78 }], background: "url('/bg_unova_route.webp') center/cover no-repeat",
    location: 'Rotas de Unova',
  },
  {
    region: 'unova', id: 'reshiram', category: 'legendary', name: 'Reshiram',
    subtitle: 'O Dragão da Verdade', sprite: _sp(643),
    quote: '"A verdade queima mais forte que qualquer chama. Você pode suportá-la?"',
    reward: 5000, unlockFlag: 'reshiram_defeated', requiresFlag: 'thundurus_defeated',
    team: [{ id: 643, level: 88 }], background: "url('/bg_unova_elite.webp') center/cover no-repeat",
    location: 'Dragonspiral Tower',
  },
  {
    region: 'unova', id: 'zekrom', category: 'legendary', name: 'Zekrom',
    subtitle: 'O Dragão dos Ideais', sprite: _sp(644),
    quote: '"Os ideais criam o futuro. Deixa meu raio julgar o seu!"',
    reward: 5000, unlockFlag: 'zekrom_defeated', requiresFlag: 'reshiram_defeated',
    team: [{ id: 644, level: 88 }], background: "url('/bg_unova_elite.webp') center/cover no-repeat",
    location: 'Dragonspiral Tower',
  },
  {
    region: 'unova', id: 'landorus', category: 'legendary', name: 'Landorus',
    subtitle: 'O Pokémon Abundância', sprite: _sp(645),
    quote: '"Terra, vento e relâmpago: eu uno as forças da natureza."',
    reward: 5000, unlockFlag: 'landorus_defeated', requiresFlag: 'zekrom_defeated',
    team: [{ id: 645, level: 82 }], background: "url('/bg_unova_route.webp') center/cover no-repeat",
    location: 'Abundant Shrine',
  },
  {
    region: 'unova', id: 'kyurem', category: 'legendary', name: 'Kyurem',
    subtitle: 'O Dragão do Vazio', sprite: _sp(646),
    quote: '"…Frio. Vazio. Poder."',
    reward: 8000, unlockFlag: 'kyurem_defeated', requiresFlag: 'landorus_defeated',
    team: [{ id: 646, level: 95 }], background: "url('/bg_unova_ice.webp') center/cover no-repeat",
    location: 'Giant Chasm',
  },
  {
    region: 'unova', id: 'keldeo', category: 'legendary', name: 'Keldeo',
    subtitle: 'O Cavaleiro da Justiça', sprite: _sp(647),
    quote: '"Jurei proteger os inocentes com minha espada d\'água. Prove que você é digno!"',
    reward: 5000, unlockFlag: 'keldeo_defeated', requiresFlag: 'kyurem_defeated',
    team: [{ id: 647, level: 85 }], background: "url('/bg_unova_elite.webp') center/cover no-repeat",
    location: 'Moor of Icirrus',
  },
  {
    region: 'unova', id: 'meloetta', category: 'legendary', name: 'Meloetta',
    subtitle: 'O Pokémon Melodia', sprite: _sp(648),
    quote: '"Cada nota que canto carrega o peso de mil batalhas."',
    reward: 5000, unlockFlag: 'meloetta_defeated', requiresFlag: 'keldeo_defeated',
    team: [{ id: 648, level: 85 }], background: "url('/bg_unova_elite.webp') center/cover no-repeat",
    location: 'Castelia City - Teatro',
  },
  {
    region: 'unova', id: 'genesect', category: 'legendary', name: 'Genesect',
    subtitle: 'O Pokémon Paleolítico', sprite: _sp(649),
    quote: '"Sobrevivi 300 milhões de anos. Você não me detém."',
    reward: 8000, unlockFlag: 'genesect_defeated', requiresFlag: 'meloetta_defeated',
    team: [{ id: 649, level: 95 }], background: "url('/bg_unova_elite.webp') center/cover no-repeat",
    location: 'P2 Laboratory',
  },

  // ─────────────── KALOS ───────────────────────────────────────────────────
  {
    region: 'kalos', id: 'xerneas', category: 'legendary', name: 'Xerneas',
    subtitle: 'O Pokémon da Vida', sprite: _sp(716),
    quote: '"A vida que compartilho é eterna. Você é digno de recebê-la?"',
    reward: 5000, unlockFlag: 'xerneas_defeated', requiresFlag: 'kalos_champion',
    team: [{ id: 716, level: 85 }], background: "url('/bg_kalos_forest.webp') center/cover no-repeat",
    location: 'Team Flare Secret HQ',
  },
  {
    region: 'kalos', id: 'yveltal', category: 'legendary', name: 'Yveltal',
    subtitle: 'O Pokémon da Destruição', sprite: _sp(717),
    quote: '"Tudo que vive um dia irá se extinguir… inclusive você."',
    reward: 5000, unlockFlag: 'yveltal_defeated', requiresFlag: 'xerneas_defeated',
    team: [{ id: 717, level: 85 }], background: "url('/bg_kalos_cave.webp') center/cover no-repeat",
    location: 'Team Flare Secret HQ',
  },
  {
    region: 'kalos', id: 'zygarde', category: 'legendary', name: 'Zygarde',
    subtitle: 'O Pokémon da Ordem', sprite: _sp(718),
    quote: '"Sou o guardião do equilíbrio. Pertube-o e enfrentará as consequências."',
    reward: 8000, unlockFlag: 'zygarde_defeated', requiresFlag: 'yveltal_defeated',
    team: [{ id: 718, level: 92 }], background: "url('/bg_kalos_cave.webp') center/cover no-repeat",
    location: 'Terminus Cave',
  },

  // ─────────────── ALOLA ───────────────────────────────────────────────────
  {
    region: 'alola', id: 'tapu_koko', category: 'legendary', name: 'Tapu Koko',
    subtitle: 'Divindade de Melemele', sprite: _sp(785),
    quote: '"Sparksurfer! Vou testar minha força contra a sua!"',
    reward: 2000, unlockFlag: 'tapu_koko_defeated', requiresFlag: 'alola_champion',
    team: [{ id: 785, level: 85 }], background: "url('/bg_alola_route.webp') center/cover no-repeat",
    location: 'Ruins of Conflict',
  },
  {
    region: 'alola', id: 'tapu_lele', category: 'legendary', name: 'Tapu Lele',
    subtitle: 'Divindade de Akala', sprite: _sp(786),
    quote: '"Meus escamas de cura… também podem ferir."',
    reward: 2000, unlockFlag: 'tapu_lele_defeated', requiresFlag: 'tapu_koko_defeated',
    team: [{ id: 786, level: 85 }], background: "url('/bg_alola_route.webp') center/cover no-repeat",
    location: 'Ruins of Life',
  },
  {
    region: 'alola', id: 'tapu_bulu', category: 'legendary', name: 'Tapu Bulu',
    subtitle: 'Divindade de Ula\'ula', sprite: _sp(787),
    quote: '"A natureza não perdoa descuido."',
    reward: 2000, unlockFlag: 'tapu_bulu_defeated', requiresFlag: 'tapu_lele_defeated',
    team: [{ id: 787, level: 85 }], background: "url('/bg_alola_route.webp') center/cover no-repeat",
    location: 'Ruins of Abundance',
  },
  {
    region: 'alola', id: 'tapu_fini', category: 'legendary', name: 'Tapu Fini',
    subtitle: 'Divindade de Poni', sprite: _sp(788),
    quote: '"A névoa do oceano revela apenas os mais fortes."',
    reward: 2000, unlockFlag: 'tapu_fini_defeated', requiresFlag: 'tapu_bulu_defeated',
    team: [{ id: 788, level: 85 }], background: "url('/bg_alola_route.webp') center/cover no-repeat",
    location: 'Ruins of Hope',
  },
  {
    region: 'alola', id: 'solgaleo', category: 'legendary', name: 'Solgaleo',
    subtitle: 'O Filho do Sol', sprite: _sp(791),
    quote: '"Sou o que devora o sol. Seu espírito pode suportar minha luz?"',
    reward: 5000, unlockFlag: 'solgaleo_defeated', requiresFlag: 'tapu_fini_defeated',
    team: [{ id: 791, level: 92 }], background: "url('/bg_alola_elite.webp') center/cover no-repeat",
    location: 'Altar of the Sunne',
  },
  {
    region: 'alola', id: 'lunala', category: 'legendary', name: 'Lunala',
    subtitle: 'A Filha da Lua', sprite: _sp(792),
    quote: '"Sou a que chama a lua. Mergulhe nas sombras comigo."',
    reward: 5000, unlockFlag: 'lunala_defeated', requiresFlag: 'solgaleo_defeated',
    team: [{ id: 792, level: 92 }], background: "url('/bg_alola_elite.webp') center/cover no-repeat",
    location: 'Altar of the Moone',
  },
  {
    region: 'alola', id: 'necrozma', category: 'legendary', name: 'Necrozma',
    subtitle: 'O Devorador da Luz', sprite: _sp(800),
    quote: '"A luz pertence a mim. Toda ela."',
    reward: 12000, unlockFlag: 'necrozma_defeated', requiresFlag: 'lunala_defeated',
    team: [{ id: 800, level: 100 }], background: "url('/bg_alola_elite.webp') center/cover no-repeat",
    location: 'Ultra Megalopolis',
  },

  // ─────────────── GALAR ───────────────────────────────────────────────────
  {
    region: 'galar', id: 'zacian', category: 'legendary', name: 'Zacian',
    subtitle: 'O Herói Espada', sprite: _sp(888),
    quote: '"Minha lâmina corta tudo. Até lendas."',
    reward: 5000, unlockFlag: 'zacian_defeated', requiresFlag: 'galar_champion',
    team: [{ id: 888, level: 92 }], background: "url('/bg_galar_route.webp') center/cover no-repeat",
    location: 'Slumbering Weald',
  },
  {
    region: 'galar', id: 'zamazenta', category: 'legendary', name: 'Zamazenta',
    subtitle: 'O Herói Escudo', sprite: _sp(889),
    quote: '"Meu escudo protege tudo que existe. Mas não você, hoje."',
    reward: 5000, unlockFlag: 'zamazenta_defeated', requiresFlag: 'zacian_defeated',
    team: [{ id: 889, level: 92 }], background: "url('/bg_galar_route.webp') center/cover no-repeat",
    location: 'Slumbering Weald',
  },
  {
    region: 'galar', id: 'eternatus', category: 'legendary', name: 'Eternatus',
    subtitle: 'O Pokémon Eterno', sprite: _sp(890),
    quote: '"Existia antes de Galar. Existirei depois."',
    reward: 12000, unlockFlag: 'eternatus_defeated', requiresFlag: 'zamazenta_defeated',
    team: [{ id: 890, level: 100 }], background: "url('/bg_galar_elite.webp') center/cover no-repeat",
    location: 'Energy Plant - Topo',
  },
  {
    region: 'galar', id: 'regieleki', category: 'legendary', name: 'Regieleki',
    subtitle: 'O Golem Elétrico', sprite: _sp(894),
    quote: '"Minha descarga elétrica é a mais rápida do mundo. Tente acompanhar."',
    reward: 2000, unlockFlag: 'regieleki_defeated', requiresFlag: 'galar_champion',
    team: [{ id: 894, level: 85 }], background: "url('/bg_galar_route.webp') center/cover no-repeat",
    location: 'Crown Tundra - Split-Decision Ruins',
  },
  {
    region: 'galar', id: 'regidrago', category: 'legendary', name: 'Regidrago',
    subtitle: 'O Golem Dragão', sprite: _sp(895),
    quote: '"O cristal de dragão em meu corpo pulsa com poder ancestral."',
    reward: 2000, unlockFlag: 'regidrago_defeated', requiresFlag: 'regieleki_defeated',
    team: [{ id: 895, level: 85 }], background: "url('/bg_galar_route.webp') center/cover no-repeat",
    location: 'Crown Tundra - Split-Decision Ruins',
  },
  {
    region: 'galar', id: 'glastrier', category: 'legendary', name: 'Glastrier',
    subtitle: 'O Cavalo de Gelo', sprite: _sp(896),
    quote: '"Meus cascos de gelo esmagam qualquer coisa que ouse me enfrentar."',
    reward: 5000, unlockFlag: 'glastrier_defeated', requiresFlag: 'regidrago_defeated',
    team: [{ id: 896, level: 90 }], background: "url('/bg_galar_route.webp') center/cover no-repeat",
    location: 'Crown Tundra - Snowslide Slope',
  },
  {
    region: 'galar', id: 'calyrex', category: 'legendary', name: 'Calyrex',
    subtitle: 'O Rei de Ouro da Tundra', sprite: _sp(898),
    quote: '"Reinei sobre estas terras desde tempos imemoriais. Não me decepcione."',
    reward: 12000, unlockFlag: 'calyrex_defeated', requiresFlag: 'glastrier_defeated',
    team: [{ id: 898, level: 100 }], background: "url('/bg_galar_elite.webp') center/cover no-repeat",
    location: 'Crown Tundra - Freezington',
  },

  // ─────────────── HISUI ───────────────────────────────────────────────────
  {
    region: 'hisui', id: 'darkrai_hisui', category: 'legendary', name: 'Darkrai',
    subtitle: 'O Señor dos Pesadelos', sprite: _sp(491),
    quote: '"Os seus pesadelos pertencem a mim."',
    reward: 5000, unlockFlag: 'darkrai_hisui_defeated', requiresFlag: 'hisui_champion',
    team: [{ id: 491, level: 90 }], background: "url('/bg_hisui_mirelands.webp') center/cover no-repeat",
    location: 'Moonview Arena - Hisui',
  },
  {
    region: 'hisui', id: 'shaymin_hisui', category: 'legendary', name: 'Shaymin',
    subtitle: 'O Pokémon Gratidão', sprite: _sp(492),
    quote: '"A gratidão floresce até em Hisui. Mereça-a."',
    reward: 5000, unlockFlag: 'shaymin_hisui_defeated', requiresFlag: 'darkrai_hisui_defeated',
    team: [{ id: 492, level: 90 }], background: "url('/bg_hisui_fieldlands.webp') center/cover no-repeat",
    location: 'Flower Paradise - Hisui',
  },
  {
    region: 'hisui', id: 'arceus', category: 'legendary', name: 'Arceus',
    subtitle: 'O Pokémon Deus', sprite: _sp(493),
    quote: '"Eu moldei este mundo. Agora você ousa me desafiar?"',
    reward: 12000, unlockFlag: 'arceus_defeated', requiresFlag: 'shaymin_hisui_defeated',
    team: [{ id: 493, level: 100 }], background: "url('/bg_hisui_sacred_plaza.webp') center/cover no-repeat",
    location: 'Temple of Sinnoh - Spear Pillar Ancestral',
  },

  // ─────────────── PALDEA ──────────────────────────────────────────────────
  {
    region: 'paldea', id: 'koraidon', category: 'legendary', name: 'Koraidon',
    subtitle: 'O Pokémon do Passado', sprite: _sp(1007),
    quote: '"Do passado vem minha força. Você tem coragem de enfrentá-la?"',
    reward: 12000, unlockFlag: 'koraidon_defeated', requiresFlag: 'paldea_champion',
    team: [{ id: 1007, level: 100 }], background: "url('/bg_paldea_cave.webp') center/cover no-repeat",
    location: 'Area Zero - Fundo do Abismo',
  },
  {
    region: 'paldea', id: 'miraidon', category: 'legendary', name: 'Miraidon',
    subtitle: 'O Pokémon do Futuro', sprite: _sp(1008),
    quote: '"Do futuro venho. Nada pode me deter — nem mesmo você."',
    reward: 12000, unlockFlag: 'miraidon_defeated', requiresFlag: 'koraidon_defeated',
    team: [{ id: 1008, level: 100 }], background: "url('/bg_paldea_elite.webp') center/cover no-repeat",
    location: 'Area Zero - Laboratório do Futuro',
  },
  {
    region: 'paldea', id: 'ogerpon', category: 'legendary', name: 'Ogerpon',
    subtitle: 'A Pokémon da Máscara', sprite: _sp(1017),
    quote: '"Minha máscara esconde mais do que você imagina. Vamos batalhar!"',
    reward: 5000, unlockFlag: 'ogerpon_defeated', requiresFlag: 'paldea_champion',
    team: [{ id: 1017, level: 90 }], background: "url('/bg_paldea_cave.webp') center/cover no-repeat",
    location: 'Kitakami - Oni Mountain',
  },
  {
    region: 'paldea', id: 'terapagos', category: 'legendary', name: 'Terapagos',
    subtitle: 'O Pokémon Terastal', sprite: _sp(1024),
    quote: '"Sou a origem do fenômeno Terastal. Tudo que você conhece vem de mim."',
    reward: 12000, unlockFlag: 'terapagos_defeated', requiresFlag: 'ogerpon_defeated',
    team: [{ id: 1024, level: 100 }], background: "url('/bg_paldea_cave.webp') center/cover no-repeat",
    location: 'Uncharted Area Zero - Profundidades',
  },
];

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
    background: "url('/bg_grass_1776863779024.webp') center/cover no-repeat",
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
    background: "url('/bg_gym_water.webp') center/cover no-repeat", // Deck do navio/água
    location: 'Deck do S.S. Anne',
  },
  {
    region: 'kanto',
    id: 'rival_pokemon_tower',
    category: 'rival',
    name: 'Azul - Torre Pokémon',
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
    background: "url('/bg_cave_1776863810604.webp') center/cover no-repeat", // Torre (escuro)
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
    background: "url('/bg_kanto_silph_co.webp') center/cover no-repeat",
    location: 'Silph Co. - 11Âº Andar',
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
    background: "url('/bg_grass_1776863779024.webp') center/cover no-repeat",
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
    background: "url('/bg_cave_1776863810604.webp') center/cover no-repeat",
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
    background: "url('/bg_cave_1776863810604.webp') center/cover no-repeat",
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
    background: "url('/bg_cave_1776863810604.webp') center/cover no-repeat",
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
    background: "url('/bg_kanto_rocket_hideout.webp') center/cover no-repeat",
    location: 'QG Equipe Rocket - Celadon',
  },

  // --- KANTO NOVOS RIVAIS ---
  {
    region: 'kanto', id: 'rival_cerulean', category: 'rival',
    name: 'Azul - Cerulean City', subtitle: 'Orgulho de Pallet',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    quote: '"Você vai entrar na caverna? Primeiro passe por mim!"',
    reward: 1200, unlockFlag: 'rival_cerulean_defeated', requiresFlag: 'rival_1_defeated',
    team: [{ id: 17, level: 14 }, { id: 20, level: 14 }, { id: 64, level: 13 }, { id: 133, level: 15 }],
    background: "url('/bg_gym_water.webp') center/cover no-repeat",
    location: 'Cerulean City',
  },
  {
    region: 'kanto', id: 'rival_victory_road_kanto', category: 'rival',
    name: 'Azul - Victory Road', subtitle: 'A Última Barreira',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    quote: '"Você vai para a Liga? Então terá que me superar aqui primeiro!"',
    reward: 6000, unlockFlag: 'rival_victory_road_kanto_defeated', requiresFlag: 'soul_badge',
    team: [{ id: 18, level: 43 }, { id: 65, level: 42 }, { id: 130, level: 42 }, { id: 112, level: 42 }, { id: 103, level: 44 }, { id: 136, level: 46 }],
    background: "url('/bg_cave_1776863810604.webp') center/cover no-repeat",
    location: 'Victory Road - Kanto',
  },
  {
    region: 'kanto', id: 'rival_champion_kanto', category: 'rival',
    name: 'Azul - Campeão de Kanto', subtitle: 'O Rival se Torna Campeão',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    quote: '"Eu não preciso de um técnico habilidoso! Ganharei com força pura!"',
    reward: 20000, unlockFlag: 'rival_champion_kanto_defeated', requiresFlag: 'rival_victory_road_kanto_defeated',
    team: [{ id: 18, level: 59 }, { id: 65, level: 57 }, { id: 130, level: 58 }, { id: 112, level: 59 }, { id: 103, level: 57 }, { id: 9, level: 61 }],
    background: "url('/bg_kanto_gym.webp') center/cover no-repeat",
    location: 'Indigo Plateau - Sala do Campeão',
  },

  // --- KANTO NOVOS ROCKETS ---
  {
    region: 'kanto', id: 'rocket_lavender_tower', category: 'rocket',
    name: 'Recruta Rocket - Torre Pokémon', subtitle: 'Profanação em Lavender',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgrunt.png',
    quote: '"Esta torre é nossa agora! Os espíritos não vão te ajudar!"',
    reward: 2500, unlockFlag: 'rocket_lavender_cleared', requiresFlag: 'rock_tunnel_cleared',
    team: [{ id: 92, level: 22 }, { id: 41, level: 23 }, { id: 109, level: 24 }],
    background: "url('/bg_cave_1776863810604.webp') center/cover no-repeat",
    location: 'Torre Pokémon - Lavender Town',
  },
  {
    region: 'kanto', id: 'rocket_silph_executive', category: 'rocket',
    name: 'Executivo Rocket - Silph Co.', subtitle: 'Reforço na Corporação',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"Esta corporação é nossa! Saia de uma vez!"',
    reward: 5500, unlockFlag: 'rocket_silph_cleared', requiresFlag: 'rocket_hideout_cleared',
    team: [{ id: 110, level: 35 }, { id: 24, level: 36 }, { id: 41, level: 36 }, { id: 52, level: 38 }],
    background: "url('/bg_kanto_silph_co.webp') center/cover no-repeat",
    location: 'Silph Co. - Andar Intermediário',
  },

  // -- LENDÁRIOS -------------------------------------------------------
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
    background: "url('/bg_new_bark_town.webp') center/cover no-repeat",
    location: 'New Bark Town',
  },
  {
    region: 'johto', id: 'johto_rival_sprout_tower', category: 'rival',
    name: 'Rival - Sprout Tower', subtitle: 'Sombra em Violet City',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Você perdeu tempo aqui na torre. Eu já estou muito à frente!"',
    reward: 12500, unlockFlag: 'johto_rival_sprout_defeated', requiresFlag: 'johto_rival_1_defeated',
    team: [{ id: 92, level: 12 }, { id: 41, level: 12 }, { id: 156, level: 14 }],
    background: "url('/bg_violet_city.webp') center/cover no-repeat",
    location: 'Sprout Tower - Violet City',
  },
  {
    region: 'johto', id: 'johto_rocket_ruins', category: 'rocket',
    name: 'Recruta Rocket - Ruínas de Alph', subtitle: 'Contrabando nas Ruínas',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgrunt.png',
    quote: '"Estas ruínas escondem tesouros que a Equipe Rocket vai levar!"',
    reward: 13500, unlockFlag: 'johto_rocket_ruins_cleared', requiresFlag: 'johto_rival_1_defeated',
    team: [{ id: 19, level: 16 }, { id: 41, level: 17 }, { id: 23, level: 18 }],
    background: "url('/bg_route32_johto.webp') center/cover no-repeat",
    location: 'Ruínas de Alph - Rota 36',
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
    background: "url('/bg_slowpoke_well.webp') center/cover no-repeat",
    location: 'Poco Slowpoke - Azalea',
  },
  {
    region: 'johto', id: 'johto_rocket_proton', category: 'rocket',
    name: 'Executivo Proton', subtitle: 'Chefe do Poço Slowpoke',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgrunt.png',
    quote: '"Chorar não vai salvá-los. A Equipe Rocket se apodera deste lugar!"',
    reward: 14500, unlockFlag: 'johto_rocket_proton_defeated', requiresFlag: 'johto_slowpoke_well_cleared',
    team: [{ id: 41, level: 20 }, { id: 109, level: 20 }, { id: 42, level: 23 }],
    background: "url('/bg_slowpoke_well.webp') center/cover no-repeat",
    location: 'Poço Slowpoke - Subsolo',
  },
  {
    region: 'johto',
    id: 'johto_rival_azalea',
    category: 'rival',
    name: 'Rival - Azalea Town',
    subtitle: 'Confronto em Azalea',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Voce demorou demais. Vamos ver se seus Pokémon sao lentos como você!"',
    reward: 13000,
    unlockFlag: 'johto_rival_azalea_defeated',
    requiresFlag: 'hive_badge',
    team: [
      { id: 92, level: 14 },  // Gastly
      { id: 41, level: 16 },  // Zubat
      { id: 156, level: 18 }, // Quilava (exemplo)
    ],
    background: "url('/bg_violet_city.webp') center/cover no-repeat",
    location: 'Azalea Town - Saida',
  },
  {
    region: 'johto',
    id: 'johto_rival_ecruteak',
    category: 'rival',
    name: 'Rival - Torre Queimada',
    subtitle: 'Encontro em Ecruteak',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Esta torre guarda lendas, mas você não e uma delas!"',
    reward: 15000,
    unlockFlag: 'johto_rival_ecruteak_defeated',
    requiresFlag: 'plain_badge',
    team: [
      { id: 93, level: 20 },  // Haunter
      { id: 81, level: 20 },  // Magnemite
      { id: 42, level: 22 },  // Golbat
      { id: 159, level: 24 }, // Croconaw
    ],
    background: "url('/bg_ecruteak_city.webp') center/cover no-repeat",
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
    background: "url('/bg_radio_tower_interior.webp') center/cover no-repeat",
    location: 'Esconderijo Rocket - Mahogany',
  },
  {
    region: 'johto', id: 'johto_rival_mahogany', category: 'rival',
    name: 'Rival - Mahogany Town', subtitle: 'Perseguindo a Rocket',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Também estou atrás da Equipe Rocket. Fique fora do meu caminho!"',
    reward: 16000, unlockFlag: 'johto_rival_mahogany_defeated', requiresFlag: 'johto_rocket_mahogany_cleared',
    team: [{ id: 169, level: 36 }, { id: 94, level: 37 }, { id: 182, level: 37 }, { id: 215, level: 38 }],
    background: "url('/bg_ice_path.webp') center/cover no-repeat",
    location: 'Mahogany Town - Rota 44',
  },
  {
    region: 'johto',
    id: 'johto_rival_goldenrod_tunnel',
    category: 'rival',
    name: 'Rival - Tunel de Goldenrod',
    subtitle: 'Invasao a Torre de Radio',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Eu tambem estou atras da Equipe Rocket, mas você esta no meu caminho!"',
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
    background: "url('/bg_goldenrod_city.webp') center/cover no-repeat",
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
    quote: '"Os Pokémon voadores de Johto não caem facilmente!"',
    reward: 6000,
    unlockFlag: 'zephyr_badge',
    requiresFlag: 'johto_route_29_cleared',
    team: [{ id: 16, level: 12 }, { id: 17, level: 14 }, { id: 163, level: 13 }],
    background: "url('/bg_violet_city.webp') center/cover no-repeat",
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
    quote: '"Insetos evoluem rapido. Vamos ver se você acompanha!"',
    reward: 7000,
    unlockFlag: 'hive_badge',
    requiresFlag: 'johto_slowpoke_well_cleared',
    team: [{ id: 123, level: 20 }, { id: 11, level: 18 }, { id: 14, level: 18 }],
    background: "url('/bg_ilex_forest.webp') center/cover no-repeat",
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
    quote: '"Meus Pokémon sao fofos, mas batem forte!"',
    reward: 8500,
    unlockFlag: 'plain_badge',
    requiresFlag: 'hive_badge',
    team: [{ id: 35, level: 25 }, { id: 241, level: 27 }, { id: 39, level: 26 }],
    background: "url('/bg_goldenrod_city.webp') center/cover no-repeat",
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
    background: "url('/bg_ecruteak_city.webp') center/cover no-repeat",
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
    background: "url('/bg_cianwood_city.webp') center/cover no-repeat",
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
    quote: '"O tipo Aço exige paciencia e resistencia."',
    reward: 12000,
    unlockFlag: 'mineral_badge',
    requiresFlag: 'storm_badge',
    team: [{ id: 81, level: 38 }, { id: 82, level: 39 }, { id: 208, level: 41 }],
    background: "url('/bg_olivine_city.webp') center/cover no-repeat",
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
    background: "url('/bg_radio_tower_interior.webp') center/cover no-repeat",
    location: 'Goldenrod Radio Tower',
  },
  {
    region: 'johto', id: 'johto_rocket_petrel', category: 'rocket',
    name: 'Executivo Petrel', subtitle: 'O Disfarce na Rádio',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png',
    quote: '"Achei que meu disfarce de Diretor fosse perfeito. Bom para você..."',
    reward: 16500, unlockFlag: 'johto_rocket_petrel_defeated', requiresFlag: 'johto_rocket_radio_cleared',
    team: [{ id: 109, level: 44 }, { id: 110, level: 44 }, { id: 42, level: 46 }, { id: 229, level: 47 }],
    background: "url('/bg_radio_tower_interior.webp') center/cover no-repeat",
    location: 'Goldenrod Radio Tower - Topo',
  },
  {
    region: 'johto', id: 'johto_rocket_ariana', category: 'rocket',
    name: 'Executiva Ariana', subtitle: 'Última Ordem da Rocket',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/rocketgruntf.png',
    quote: '"Encontrar Giovanni é nosso único objetivo. Não nos interrompa!"',
    reward: 17500, unlockFlag: 'johto_rocket_ariana_defeated', requiresFlag: 'johto_rocket_petrel_defeated',
    team: [{ id: 24, level: 46 }, { id: 45, level: 47 }, { id: 198, level: 48 }, { id: 169, level: 50 }],
    background: "url('/bg_radio_tower_interior.webp') center/cover no-repeat",
    location: 'Goldenrod Radio Tower - QG',
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
    background: "url('/bg_ice_path.webp') center/cover no-repeat",
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
    background: "url('/bg_blackthorn_city.webp') center/cover no-repeat",
    location: 'Blackthorn Gym',
  },
  {
    region: 'johto',
    id: 'johto_rival_victory',
    category: 'rival',
    name: 'Rival - Victory Road',
    subtitle: 'Ultima barreira',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/silver.png',
    quote: '"Eu tambem cheguei ate aqui. Nao vou deixar você passar sem lutar!"',
    reward: 18000,
    unlockFlag: 'johto_rival_victory_defeated',
    requiresFlag: 'rising_badge',
    team: [{ id: 169, level: 55 }, { id: 94, level: 55 }, { id: 65, level: 56 }, { id: 160, level: 58 }],
    background: "url('/bg_victory_road_johto.webp') center/cover no-repeat",
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
    background: "url('/bg_johto_league.webp') center/cover no-repeat",
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
    background: "url('/bg_johto_league.webp') center/cover no-repeat",
    location: 'Liga de Johto',
  },
  {
    region: 'johto',
    id: 'johto_bruno',
    category: 'johto',
    name: 'Bruno - Elite Four',
    subtitle: 'Mestre de Luta',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bruno.png',
    quote: '"Eu continuo treinando meus músculos e meus Pokémon todos os dias!"',
    reward: 24000,
    unlockFlag: 'johto_bruno_e4_defeated',
    requiresFlag: 'johto_koga_e4_defeated',
    team: [{ id: 237, level: 54 }, { id: 106, level: 54 }, { id: 107, level: 54 }, { id: 95, level: 56 }, { id: 68, level: 58 }],
    background: "url('/bg_johto_league.webp') center/cover no-repeat",
    location: 'Liga de Johto',
  },
  {
    region: 'johto',
    id: 'johto_karen',
    category: 'johto',
    name: 'Karen - Elite Four',
    subtitle: 'Mestra Sombria',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/karen.png',
    quote: '"Pokémon fortes, Pokémon fracos... isso é apenas a percepção egoísta das pessoas."',
    reward: 26000,
    unlockFlag: 'johto_karen_defeated',
    requiresFlag: 'johto_bruno_e4_defeated',
    team: [{ id: 197, level: 56 }, { id: 45, level: 56 }, { id: 198, level: 58 }, { id: 94, level: 58 }, { id: 229, level: 60 }],
    background: "url('/bg_johto_league.webp') center/cover no-repeat",
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
    background: "url('/bg_johto_league.webp') center/cover no-repeat",
    location: 'Liga Pokémon de Johto',
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
    background: "url('/bg_rustboro_city.webp') center/cover no-repeat",
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
    background: "url('/bg_dewford_town.webp') center/cover no-repeat",
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
    background: "url('/bg_mauville_city.webp') center/cover no-repeat",
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
    background: "url('/bg_lavaridge_town.webp') center/cover no-repeat",
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
    background: "url('/bg_petalburg_city.webp') center/cover no-repeat",
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
    background: "url('/bg_fortree_city.webp') center/cover no-repeat",
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
    quote: '"Duas mentes, um so objetivo: derrotar você!"',
    reward: 25000,
    unlockFlag: 'mind_badge',
    requiresFlag: 'feather_badge',
    team: [{ id: 337, level: 35 }, { id: 338, level: 35 }],
    background: "url('/bg_mossdeep_city.webp') center/cover no-repeat",
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
    background: "url('/bg_sootopolis_city.webp') center/cover no-repeat",
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
    background: "url('/bg_elite_four_hoenn.webp') center/cover no-repeat",
    location: 'Liga Pokémon de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_phoebe',
    category: 'hoenn',
    type: 'Ghost',
    name: 'Phoebe - Elite Four',
    subtitle: 'Mestra Fantasma',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/hexmaniac-gen6.png',
    quote: '"Meus Pokémon espirituais treinam comigo no Mt. Pyre!"',
    reward: 38000,
    unlockFlag: 'hoenn_phoebe_defeated',
    requiresFlag: 'hoenn_sidney_defeated',
    team: [{ id: 356, level: 48 }, { id: 354, level: 49 }, { id: 302, level: 50 }, { id: 354, level: 51 }, { id: 356, level: 51 }],
    background: "url('/bg_elite_four_hoenn.webp') center/cover no-repeat",
    location: 'Liga Pokémon de Hoenn',
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
    background: "url('/bg_elite_four_hoenn.webp') center/cover no-repeat",
    location: 'Liga Pokémon de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_drake',
    category: 'hoenn',
    type: 'Dragon',
    name: 'Drake - Elite Four',
    subtitle: 'Mestre Dragão',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/drasna.png',
    quote: '"Dragoes respeitam apenas quem enfrenta a tempestade."',
    reward: 44000,
    unlockFlag: 'hoenn_drake_defeated',
    requiresFlag: 'hoenn_glacia_defeated',
    team: [{ id: 372, level: 52 }, { id: 330, level: 53 }, { id: 230, level: 53 }, { id: 334, level: 54 }, { id: 373, level: 55 }],
    background: "url('/bg_elite_four_hoenn.webp') center/cover no-repeat",
    location: 'Liga Pokémon de Hoenn',
  },
  {
    region: 'hoenn',
    id: 'hoenn_steven',
    category: 'hoenn',
    type: 'Steel',
    name: 'Campeao Steven',
    subtitle: 'Campeao de Hoenn',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/steven.png',
    quote: '"Mostre o brilho da sua jornada. Minha equipe de aco não vai ceder."',
    reward: 65000,
    unlockFlag: 'hoenn_champion',
    requiresFlag: 'hoenn_drake_defeated',
    team: [{ id: 227, level: 59 }, { id: 344, level: 57 }, { id: 306, level: 58 }, { id: 348, level: 58 }, { id: 346, level: 58 }, { id: 376, level: 62 }],
    background: "url('/bg_elite_four_hoenn.webp') center/cover no-repeat",
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
    quote: '"As minas de Oreburgh fortalecem meus Pokémon de pedra!"',
    reward: 16000,
    unlockFlag: 'coal_badge',
    requiresFlag: 'sinnoh_rival_jubilife_defeated',
    team: [{ id: 74, level: 12 }, { id: 95, level: 13 }, { id: 408, level: 14 }],
    background: "url('/bg_type_rock_domain.webp') center/cover no-repeat",
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
    background: "url('/bg_eterna_forest.webp') center/cover no-repeat",
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
    quote: '"Eu ainda estou aprendendo, mas meus punhos não hesitam!"',
    reward: 23000,
    unlockFlag: 'cobble_badge',
    requiresFlag: 'forest_badge',
    team: [{ id: 307, level: 25 }, { id: 67, level: 26 }, { id: 448, level: 28 }],
    background: "url('/bg_type_fighting_domain.webp') center/cover no-repeat",
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
    background: "url('/bg_type_water_domain.webp') center/cover no-repeat",
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
    background: "url('/bg_type_ghost_domain.webp') center/cover no-repeat",
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
    quote: '"Aço verdadeiro se forja sob pressao!"',
    reward: 35000,
    unlockFlag: 'mine_badge',
    requiresFlag: 'relic_badge',
    team: [{ id: 437, level: 41 }, { id: 208, level: 43 }, { id: 411, level: 45 }],
    background: "url('/bg_type_steel_domain.webp') center/cover no-repeat",
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
    background: "url('/bg_snowpoint.webp') center/cover no-repeat",
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
    background: "url('/bg_sunyshore.webp') center/cover no-repeat",
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
    background: "url('/bg_sinnoh_league.webp') center/cover no-repeat",
    location: 'Liga Pokémon de Sinnoh',
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
    background: "url('/bg_sinnoh_league.webp') center/cover no-repeat",
    location: 'Liga Pokémon de Sinnoh',
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
    background: "url('/bg_sinnoh_league.webp') center/cover no-repeat",
    location: 'Liga Pokémon de Sinnoh',
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
    background: "url('/bg_sinnoh_league.webp') center/cover no-repeat",
    location: 'Liga Pokémon de Sinnoh',
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
    background: "url('/bg_sinnoh_league.webp') center/cover no-repeat",
    location: 'Sala da Campea - Sinnoh',
  },
  {
    region: 'kanto',
    id: 'rematch_brock',
    category: 'rematch',
    name: 'Brock (Revanche)',
    subtitle: 'Elite Kanto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brock.png',
    quote: '"Meus Pokémon de rocha estao mais solidos do que nunca!"',
    reward: 25000,
    unlockFlag: 'rematch_brock_defeated',
    requiresFlag: 'champion',
    team: [{id: 74, level: 70}, {id: 75, level: 70}, {id: 95, level: 72}, {id: 141, level: 71}, {id: 139, level: 71}],
    background: "url('/bg_kanto_gym.webp') center/cover no-repeat",
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
    background: "url('/bg_gym_water.webp') center/cover no-repeat",
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
    background: "url('/bg_gym_electric.webp') center/cover no-repeat",
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
    background: "url('/bg_forest_1776863795763.webp') center/cover no-repeat",
    location: 'Celadon Gym',
  },
  {
    region: 'kanto',
    id: 'rematch_sabrina',
    category: 'rematch',
    name: 'Sabrina (Revanche)',
    subtitle: 'Elite Kanto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/sabrina.png',
    quote: '"Eu previ que você voltaria. Mas eu tambem previ minha vitória."',
    reward: 25000,
    unlockFlag: 'rematch_sabrina_defeated',
    requiresFlag: 'champion',
    team: [{id: 65, level: 75}, {id: 122, level: 73}, {id: 196, level: 74}, {id: 124, level: 74}, {id: 97, level: 75}],
    background: "url('/bg_kanto_gym.webp') center/cover no-repeat",
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
    background: "url('/bg_kanto_gym.webp') center/cover no-repeat",
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
    background: "url('/bg_kanto_gym.webp') center/cover no-repeat",
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
    quote: '"Meus Pokémon voadores alcançaram novos horizontes!"',
    reward: 30000,
    unlockFlag: 'rematch_falkner_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 164, level: 85}, {id: 18, level: 85}, {id: 198, level: 86}, {id: 227, level: 87}, {id: 169, level: 88}],
    background: "url('/bg_violet_city.webp') center/cover no-repeat",
    location: 'Violet Gym',
  },
  {
    region: 'johto',
    id: 'rematch_bugsy',
    category: 'rematch',
    name: 'Bugsy (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/bugsy.png',
    quote: '"Vou te mostrar o quanto meus Pokémon insetos evoluíram!"',
    reward: 30000,
    unlockFlag: 'rematch_bugsy_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 212, level: 85}, {id: 127, level: 86}, {id: 214, level: 87}, {id: 205, level: 88}, {id: 193, level: 88}],
    background: "url('/bg_ilex_forest.webp') center/cover no-repeat",
    location: 'Azalea Gym',
  },
  {
    region: 'johto',
    id: 'rematch_whitney',
    category: 'rematch',
    name: 'Whitney (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/whitney.png',
    quote: '"Nao chore dessa vez! Porque eu não vou facilitar!"',
    reward: 30000,
    unlockFlag: 'rematch_whitney_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 241, level: 87}, {id: 40, level: 87}, {id: 217, level: 88}, {id: 36, level: 89}, {id: 242, level: 90}],
    background: "url('/bg_goldenrod_city.webp') center/cover no-repeat",
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
    background: "url('/bg_ecruteak_city.webp') center/cover no-repeat",
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
    background: "url('/bg_cianwood_city.webp') center/cover no-repeat",
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
    background: "url('/bg_olivine_city.webp') center/cover no-repeat",
    location: 'Olivine Gym',
  },
  {
    region: 'johto',
    id: 'rematch_pryce',
    category: 'rematch',
    name: 'Pryce (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/pryce.png',
    quote: '"O gelo não quebra, ele apenas se torna mais duro!"',
    reward: 30000,
    unlockFlag: 'rematch_pryce_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 87, level: 91}, {id: 221, level: 91}, {id: 91, level: 92}, {id: 131, level: 93}, {id: 221, level: 95}],
    background: "url('/bg_ice_path.webp') center/cover no-repeat",
    location: 'Mahogany Gym',
  },
  {
    region: 'johto',
    id: 'rematch_clair',
    category: 'rematch',
    name: 'Clair (Revanche)',
    subtitle: 'Elite Johto',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/clair.png',
    quote: '"Como a maior domadora de dragões, eu não permitirei sua vitória!"',
    reward: 40000,
    unlockFlag: 'rematch_clair_defeated',
    requiresFlag: 'johto_champion',
    team: [{id: 230, level: 92}, {id: 148, level: 92}, {id: 149, level: 94}, {id: 130, level: 94}, {id: 6, level: 96}],
    background: "url('/bg_blackthorn_city.webp') center/cover no-repeat",
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
    background: "url('/bg_johto_league.webp') center/cover no-repeat",
    location: 'Liga Pokémon de Johto',
  },

  {
    region: 'kanto',
    id: 'articuno',
    category: 'legendary',
    name: 'Articuno',
    subtitle: 'O Pássaro de Gelo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png',
    quote: '"Um frio intenso emana desta criatura majestosa..."',
    reward: 2000,
    unlockFlag: 'articuno_defeated',
    requiresFlag: 'soul_badge',
    team: [{ id: 144, level: 50 }],
    background: "url('/bg_cave_1776863810604.webp') center/cover no-repeat",
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
    reward: 2000,
    unlockFlag: 'zapdos_defeated',
    requiresFlag: 'soul_badge',
    team: [{ id: 145, level: 50 }],
    background: "url('/bg_gym_electric.webp') center/cover no-repeat",
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
    reward: 2000,
    unlockFlag: 'moltres_defeated',
    requiresFlag: 'soul_badge',
    team: [{ id: 146, level: 50 }],
    background: "url('/bg_cave_1776863810604.webp') center/cover no-repeat",
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
    reward: 12000,
    unlockFlag: 'mewtwo_defeated',
    requiresFlag: 'champion',
    team: [
      { id: 150, level: 70 },
    ],
    background: "url('/bg_cave_1776863810604.webp') center/cover no-repeat",
    location: 'Caverna de Cerulean',
  },
  {
    region: 'kanto',
    id: 'mew',
    category: 'legendary',
    name: 'Mew',
    subtitle: 'O Pokémon Lendário',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png',
    quote: '"Dizem que o Mew carrega o DNA de todos os Pokémon... Será que você consegue capturá-lo?"',
    reward: 12000,
    unlockFlag: 'mew_defeated',
    requiresFlag: 'mewtwo_defeated',
    team: [{ id: 151, level: 70 }],
    background: "url('/bg_grass_1776863779024.webp') center/cover no-repeat",
    location: 'Pallet Town — Evento Especial',
  },
  {
    region: 'johto',
    id: 'raikou',
    category: 'legendary',
    name: 'Raikou',
    subtitle: 'Besta Eletrica',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/243.png',
    quote: '"Roar!"',
    reward: 2000,
    unlockFlag: 'raikou_defeated',
    requiresFlag: 'johto_champion',
    team: [{ id: 243, level: 50 }],
    background: "url('/bg_route32_johto.webp') center/cover no-repeat",
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
    reward: 2000,
    unlockFlag: 'entei_defeated',
    requiresFlag: 'johto_champion',
    team: [{ id: 244, level: 50 }],
    background: "url('/bg_ilex_forest.webp') center/cover no-repeat",
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
    reward: 2000,
    unlockFlag: 'suicune_defeated',
    requiresFlag: 'johto_champion',
    team: [{ id: 245, level: 50 }],
    background: "url('/bg_johto_water_1777340582200.webp') center/cover no-repeat",
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
    reward: 5000,
    unlockFlag: 'lugia_defeated',
    requiresFlag: 'johto_champion',
    team: [{ id: 249, level: 60 }],
    background: "url('/bg_whirl_islands.webp') center/cover no-repeat",
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
    reward: 5000,
    unlockFlag: 'ho_oh_defeated',
    requiresFlag: 'johto_champion',
    team: [{ id: 250, level: 60 }],
    background: "url('/bg_tin_tower.webp') center/cover no-repeat",
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
    reward: 8000,
    unlockFlag: 'celebi_defeated',
    requiresFlag: 'ho_oh_defeated',
    team: [{ id: 251, level: 70 }],
    background: "url('/bg_ilex_forest.webp') center/cover no-repeat",
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
    quote: '"Hoenn e um lugar incrivel! Vamos ver se você esta pronto!"',
    reward: 15000,
    unlockFlag: 'hoenn_rival_1_defeated',
    requiresFlag: 'hoenn_started',
    team: [{ id: 252, level: 6 }, { id: 255, level: 6 }, { id: 258, level: 6 }],
    background: "url('/bg_littleroot.webp') center/cover no-repeat",
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
    background: "url('/bg_route110.webp') center/cover no-repeat",
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
    background: "url('/bg_lilycove_city.webp') center/cover no-repeat",
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
    background: "url('/bg_slateport_city.webp') center/cover no-repeat",
    location: 'Museu Oceanico - Slateport',
  },
  {
    region: 'hoenn',
    id: 'hoenn_magma_chimney',
    category: 'rocket',
    name: 'Equipe Magma - Mt. Chimney',
    subtitle: 'Plano no Vulcao',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/magmagrunt.png',
    quote: '"A terra vai se expandir, e você não vai impedir!"',
    reward: 22000,
    unlockFlag: 'hoenn_magma_chimney_cleared',
    requiresFlag: 'dynamo_badge',
    team: [{ id: 322, level: 24 }, { id: 262, level: 25 }, { id: 323, level: 27 }],
    background: "url('/bg_mt_chimney.webp') center/cover no-repeat",
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
    background: "url('/bg_seafloor_cavern.webp') center/cover no-repeat",
    location: 'Seafloor Cavern',
  },

  // --- HOENN NOVOS RIVAIS ---
  {
    region: 'hoenn', id: 'hoenn_rival_rustboro', category: 'rival',
    name: 'Brendan - Rustboro', subtitle: 'Depois da Primeira Insígnia',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"Você derrotou Roxanne? Não sei se foi sorte ou talento!"',
    reward: 17000, unlockFlag: 'hoenn_rival_rustboro_defeated', requiresFlag: 'stone_badge',
    team: [{ id: 276, level: 15 }, { id: 270, level: 14 }, { id: 256, level: 16 }],
    background: "url('/bg_rustboro_city.webp') center/cover no-repeat",
    location: 'Rustboro City',
  },
  {
    region: 'hoenn', id: 'hoenn_rival_fallarbor', category: 'rival',
    name: 'Brendan - Fallarbor Town', subtitle: 'Perto do Vulcão',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"Meteor Falls é incrível! Mas antes de explorar, me enfrente!"',
    reward: 21000, unlockFlag: 'hoenn_rival_fallarbor_defeated', requiresFlag: 'heat_badge',
    team: [{ id: 277, level: 28 }, { id: 271, level: 27 }, { id: 256, level: 29 }, { id: 322, level: 28 }],
    background: "url('/bg_mt_chimney.webp') center/cover no-repeat",
    location: 'Meteor Falls - Fallarbor',
  },
  {
    region: 'hoenn', id: 'hoenn_rival_route120', category: 'rival',
    name: 'Brendan - Rota 120', subtitle: 'Rival na Densa Floresta',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"A Rota 120 é intensa. Mas vencer você é minha prioridade!"',
    reward: 27000, unlockFlag: 'hoenn_rival_route120_defeated', requiresFlag: 'mind_badge',
    team: [{ id: 277, level: 43 }, { id: 272, level: 43 }, { id: 256, level: 45 }, { id: 323, level: 43 }, { id: 350, level: 44 }],
    background: "url('/bg_fortree_city.webp') center/cover no-repeat",
    location: 'Rota 120 - Próximo a Fortree',
  },
  {
    region: 'hoenn', id: 'hoenn_rival_ever_grande', category: 'rival',
    name: 'Brendan - Ever Grande City', subtitle: 'O Último Duelo',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brendan.png',
    quote: '"Esta é nossa batalha definitiva antes da Liga. Nada de reservas!"',
    reward: 36000, unlockFlag: 'hoenn_rival_ever_grande_defeated', requiresFlag: 'rain_badge',
    team: [{ id: 277, level: 57 }, { id: 272, level: 57 }, { id: 257, level: 59 }, { id: 350, level: 58 }, { id: 323, level: 57 }, { id: 359, level: 59 }],
    background: "url('/bg_ever_grande_city.webp') center/cover no-repeat",
    location: 'Ever Grande City',
  },

  // --- HOENN NOVOS VILÕES (Aqua/Magma) ---
  {
    region: 'hoenn', id: 'hoenn_aqua_petalburg', category: 'rocket',
    name: 'Equipe Aqua - Floresta de Petalburg', subtitle: 'Primeiros Confrontos',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/aquagrunt.png',
    quote: '"O oceano precisa se expandir. Saia do caminho!"',
    reward: 16000, unlockFlag: 'hoenn_aqua_petalburg_cleared', requiresFlag: 'hoenn_started',
    team: [{ id: 261, level: 12 }, { id: 72, level: 13 }, { id: 86, level: 13 }],
    background: "url('/bg_petalburg_city.webp') center/cover no-repeat",
    location: 'Floresta de Petalburg',
  },
  {
    region: 'hoenn', id: 'hoenn_magma_meteor', category: 'rocket',
    name: 'Equipe Magma - Meteor Falls', subtitle: 'Conflito nas Cavernas',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/magmagrunt.png',
    quote: '"A Equipe Magma rastreia meteoritos aqui. Tire-se do caminho!"',
    reward: 24000, unlockFlag: 'hoenn_magma_meteor_cleared', requiresFlag: 'heat_badge',
    team: [{ id: 322, level: 28 }, { id: 294, level: 28 }, { id: 262, level: 30 }],
    background: "url('/bg_victory_road_hoenn.webp') center/cover no-repeat",
    location: 'Meteor Falls',
  },
  {
    region: 'hoenn', id: 'hoenn_archie_hq', category: 'rocket',
    name: 'Líder Archie - QG Aqua', subtitle: 'Confronto no Esconderijo',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/archie-gen3.png',
    quote: '"Kyogre vai despertar e o oceano vai cobrir tudo! Ninguém nos detém!"',
    reward: 32000, unlockFlag: 'hoenn_archie_hq_cleared', requiresFlag: 'hoenn_magma_chimney_cleared',
    team: [{ id: 262, level: 40 }, { id: 319, level: 41 }, { id: 342, level: 42 }, { id: 130, level: 44 }],
    background: "url('/bg_seafloor_cavern.webp') center/cover no-repeat",
    location: 'QG Equipe Aqua - Lilycove',
  },
  {
    region: 'hoenn', id: 'hoenn_maxie_hq', category: 'rocket',
    name: 'Líder Maxie - QG Magma', subtitle: 'Obsessão pela Terra',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/maxie-gen3.png',
    quote: '"Groudon vai expandir a terra e a humanidade prosperará! Você falhou!"',
    reward: 35000, unlockFlag: 'hoenn_maxie_hq_cleared', requiresFlag: 'hoenn_aqua_seafloor_cleared',
    team: [{ id: 262, level: 46 }, { id: 323, level: 47 }, { id: 110, level: 47 }, { id: 289, level: 49 }],
    background: "url('/bg_elite_four_hoenn.webp') center/cover no-repeat",
    location: 'QG Equipe Magma - Mt. Pyre',
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
    background: "url('/bg_rustboro_city.webp') center/cover no-repeat",
    location: 'Rustboro Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_brawly',
    category: 'rematch',
    name: 'Brawly (Revanche)',
    subtitle: 'Onda de Luta',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brawly.png',
    quote: '"A maré subiu. Vamos ver se você acompanha o ritmo!"',
    reward: 27000,
    unlockFlag: 'hoenn_rematch_brawly_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 297, level: 80 }, { id: 308, level: 82 }, { id: 286, level: 84 }],
    background: "url('/bg_dewford_town.webp') center/cover no-repeat",
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
    background: "url('/bg_mauville_city.webp') center/cover no-repeat",
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
    background: "url('/bg_lavaridge_town.webp') center/cover no-repeat",
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
    background: "url('/bg_petalburg_city.webp') center/cover no-repeat",
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
    background: "url('/bg_fortree_city.webp') center/cover no-repeat",
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
    background: "url('/bg_mossdeep_city.webp') center/cover no-repeat",
    location: 'Mossdeep Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_wallace',
    category: 'rematch',
    name: 'Wallace (Revanche)',
    subtitle: 'Arte Aquatica',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/wallace.png',
    quote: '"A beleza de uma batalha perfeita não tem igual."',
    reward: 47000,
    unlockFlag: 'hoenn_rematch_wallace_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 321, level: 94 }, { id: 272, level: 95 }, { id: 350, level: 96 }],
    background: "url('/bg_sootopolis_city.webp') center/cover no-repeat",
    location: 'Sootopolis Gym',
  },
  {
    region: 'hoenn',
    id: 'hoenn_rematch_steven',
    category: 'rematch',
    name: 'Steven (Revanche)',
    subtitle: 'Campeao de Aço',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/steven.png',
    quote: '"Mostre se seu time lapidou todo o seu potencial."',
    reward: 65000,
    unlockFlag: 'hoenn_rematch_steven_defeated',
    requiresFlag: 'hoenn_champion',
    team: [{ id: 227, level: 96 }, { id: 344, level: 97 }, { id: 306, level: 98 }, { id: 376, level: 100 }],
    background: "url('/bg_ever_grande_city.webp') center/cover no-repeat",
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
    background: "url('/bg_jubilife.webp') center/cover no-repeat",
    location: 'Jubilife City',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_rival_hearthome',
    category: 'rival',
    name: 'Barry - Hearthome',
    subtitle: 'Pressa no Caminho',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/barry.png',
    quote: '"Estou ficando mais forte rapido demais para você acompanhar!"',
    reward: 28000,
    unlockFlag: 'sinnoh_rival_hearthome_defeated',
    requiresFlag: 'cobble_badge',
    team: [{ id: 398, level: 34 }, { id: 418, level: 34 }, { id: 315, level: 35 }, { id: 391, level: 37 }],
    background: "url('/bg_eterna.webp') center/cover no-repeat",
    location: 'Hearthome City',
  },
  {
    region: 'sinnoh', id: 'sinnoh_rival_pastoria', category: 'rival',
    name: 'Barry - Pastoria City', subtitle: 'Aquele Croagunk!',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/barry.png',
    quote: '"Espera um segundo! Você viu o que aquele Croagunk fez comigo?"',
    reward: 26000, unlockFlag: 'sinnoh_rival_pastoria_defeated', requiresFlag: 'fen_badge',
    team: [{ id: 398, level: 38 }, { id: 418, level: 37 }, { id: 391, level: 38 }, { id: 407, level: 39 }],
    background: "url('/bg_sinnoh_gym.webp') center/cover no-repeat",
    location: 'Pastoria City',
  },
  {
    region: 'sinnoh', id: 'sinnoh_rival_canalave', category: 'rival',
    name: 'Barry - Canalave Bridge', subtitle: 'Encontro na Ponte',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/barry.png',
    quote: '"Eu estava esperando você! Quero saber o quanto ficou mais forte!"',
    reward: 35000, unlockFlag: 'sinnoh_rival_canalave_defeated', requiresFlag: 'relic_badge',
    team: [{ id: 398, level: 47 }, { id: 419, level: 47 }, { id: 407, level: 48 }, { id: 214, level: 48 }, { id: 392, level: 50 }],
    background: "url('/bg_sinnoh_gym.webp') center/cover no-repeat",
    location: 'Canalave Bridge',
  },
  {
    region: 'sinnoh', id: 'sinnoh_rival_acuidade', category: 'rival',
    name: 'Barry - Lago Acuidade', subtitle: 'Perseguindo a Galáctica',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/barry.png',
    quote: '"A Galáctica tomou o lago! São terríveis! Me ajude com uma batalha!"',
    reward: 44000, unlockFlag: 'sinnoh_rival_acuidade_defeated', requiresFlag: 'mine_badge',
    team: [{ id: 398, level: 55 }, { id: 419, level: 55 }, { id: 407, level: 56 }, { id: 214, level: 56 }, { id: 392, level: 58 }],
    background: "url('/bg_snowpoint.webp') center/cover no-repeat",
    location: 'Lago Acuidade - Snowpoint',
  },
  {
    region: 'sinnoh', id: 'sinnoh_rival_snowpoint', category: 'rival',
    name: 'Barry - Snowpoint City', subtitle: 'Antes da Grande Jornada',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/barry.png',
    quote: '"Depois do que aconteceu no Spear Pillar... precisamos ser mais fortes!"',
    reward: 48000, unlockFlag: 'sinnoh_rival_snowpoint_defeated', requiresFlag: 'icicle_badge',
    team: [{ id: 398, level: 65 }, { id: 419, level: 65 }, { id: 407, level: 66 }, { id: 214, level: 67 }, { id: 392, level: 68 }],
    background: "url('/bg_snowpoint.webp') center/cover no-repeat",
    location: 'Snowpoint City',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_rival_victory',
    category: 'rival',
    name: 'Barry - Victory Road',
    subtitle: 'Ultima Corrida',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/barry.png',
    quote: '"A Liga esta logo ali. Nao vou deixar você passar de graca!"',
    reward: 52000,
    unlockFlag: 'sinnoh_rival_victory_defeated',
    requiresFlag: 'beacon_badge',
    team: [{ id: 398, level: 78 }, { id: 419, level: 79 }, { id: 407, level: 80 }, { id: 214, level: 80 }, { id: 392, level: 82 }],
    background: "url('/bg_victory_road_sinnoh.webp') center/cover no-repeat",
    location: 'Victory Road Sinnoh',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_galactic_valley',
    category: 'rocket',
    name: 'Equipe Galática - Valley Windworks',
    subtitle: 'Energia Roubada',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/galacticgrunt.png',
    quote: '"A energia daqui pertence a Equipe Galática!"',
    reward: 18000,
    unlockFlag: 'sinnoh_galactic_valley_cleared',
    requiresFlag: 'coal_badge',
    team: [{ id: 41, level: 18 }, { id: 431, level: 19 }, { id: 434, level: 20 }],
    background: "url('/bg_villain_galactic.webp') center/cover no-repeat",
    location: 'Valley Windworks',
  },
  {
    region: 'sinnoh',
    id: 'sinnoh_galactic_eterna',
    category: 'rocket',
    name: 'Comandante Jupiter',
    subtitle: 'Predio Galactico',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/jupiter.png',
    quote: '"O novo mundo da Equipe Galática não tem espaco para você."',
    reward: 22000,
    unlockFlag: 'sinnoh_galactic_eterna_cleared',
    requiresFlag: 'sinnoh_galactic_valley_cleared',
    team: [{ id: 41, level: 23 }, { id: 435, level: 25 }],
    background: "url('/bg_villain_galactic.webp') center/cover no-repeat",
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
    background: "url('/bg_villain_galactic.webp') center/cover no-repeat",
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
    background: "url('/bg_mt_coronet.webp') center/cover no-repeat",
    location: 'Spear Pillar',
  },

  // --- SINNOH NOVOS GALÁCTICA ---
  {
    region: 'sinnoh', id: 'sinnoh_galactic_verity', category: 'rocket',
    name: 'Comandante Mars - Lago Verity', subtitle: 'Captura de Mesprit',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/mars.png',
    quote: '"O Lago Verity é nosso agora. Mesprit não pode escapar da Team Galactic!"',
    reward: 24000, unlockFlag: 'sinnoh_galactic_verity_cleared', requiresFlag: 'sinnoh_galactic_valley_cleared',
    team: [{ id: 41, level: 24 }, { id: 435, level: 25 }, { id: 432, level: 27 }],
    background: "url('/bg_villain_galactic.webp') center/cover no-repeat",
    location: 'Lago Verity - Twinleaf Town',
  },
  {
    region: 'sinnoh', id: 'sinnoh_galactic_veilstone', category: 'rocket',
    name: 'Executivo Charon - Veilstone HQ', subtitle: 'Armazém da Galáctica',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/charon.png',
    quote: '"Os dados coletados aqui são inestimáveis para o plano de Cyrus!"',
    reward: 38000, unlockFlag: 'sinnoh_galactic_veilstone_cleared', requiresFlag: 'sinnoh_galactic_eterna_cleared',
    team: [{ id: 436, level: 38 }, { id: 64, level: 39 }, { id: 229, level: 40 }, { id: 429, level: 42 }],
    background: "url('/bg_villain_galactic.webp') center/cover no-repeat",
    location: 'Armazém Galáctica - Veilstone',
  },
  {
    region: 'sinnoh', id: 'sinnoh_galactic_acuidade', category: 'rocket',
    name: 'Comandante Jupiter - Lago Acuidade', subtitle: 'Aprisionamento de Uxie',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/jupiter.png',
    quote: '"Uxie pertence à Team Galactic agora. Não interfira mais!"',
    reward: 46000, unlockFlag: 'sinnoh_galactic_acuidade_cleared', requiresFlag: 'sinnoh_galactic_valor_cleared',
    team: [{ id: 435, level: 52 }, { id: 441, level: 54 }, { id: 169, level: 53 }, { id: 452, level: 56 }],
    background: "url('/bg_villain_galactic.webp') center/cover no-repeat",
    location: 'Lago Acuidade - Próximo a Snowpoint',
  },

  {
    region: 'hoenn',
    id: 'rayquaza',
    category: 'legendary',
    name: 'Rayquaza',
    subtitle: 'Soberano dos Ceus',
    sprite: _sp(384),
    quote: '"Sou o guardião do céu. Aqueles que perturbam o equilíbrio enfrentarão minha ira!"',
    reward: 8000,
    unlockFlag: 'rayquaza_defeated',
    requiresFlag: 'latios_defeated',
    team: [{ id: 384, level: 88 }],
    background: "url('/bg_sky_pillar.webp') center/cover no-repeat",
    location: 'Sky Pillar',
  },
  ...FUTURE_REGION_CHALLENGES,
  ...FUTURE_REGION_LEGENDARIES,
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
  return fixBgPath(challenge.background) || `linear-gradient(135deg, ${color} 0%, #0f172a 100%)`;
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
    'has_starter': 'Ter um Pokémon inicial',
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
    'sinnoh_galactic_valley_cleared': 'Derrotar a Equipe Galática em Valley Windworks',
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
                      <span className="text-[9px] font-black text-white/55 uppercase">{challenge.team.length} Pokémons</span>
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
          <div className="modal-panel-mobile rounded-[2rem] overflow-hidden shadow-2xl animate-bounceIn border-2 border-white/10 flex flex-col" style={{ background: fixBgPath(selectedChallenge.background || selectedChallenge.bg) }} onClick={e => e.stopPropagation()}>
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
                  <div key={i} className="bg-black/60 backdrop-blur-sm rounded-2xl p-2 border border-white/20 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} className="w-11 h-11 object-contain" alt="pokemon" />
                    </div>
                    <span className="text-white text-[8px] font-black uppercase mt-1.5 bg-black/50 px-1.5 py-0.5 rounded-full">NV. {p.level}</span>
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


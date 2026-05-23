// ── Sistema de Nível de Treinador ─────────────────────────────────────────
// Baseado no número de espécies únicas capturadas (Object.keys(caughtData).length)

const ITEM = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';

export const TRAINER_LEVELS = [
  {
    level: 1,
    title: 'Novato',
    // Pokébola — a primeira ferramenta de todo treinador
    icon: `${ITEM}poke-ball.png`,
    species: 0,
    catchBonus:    0,
    xpBonus:       0,
    raidBonus:     0,
    forgeDiscount: 0,
    shinyBonus:    0,
    raidAttempts:  0,
    legendaryRaid: false,
    description: 'O início de toda grande jornada.',
  },
  {
    level: 2,
    title: 'Explorador',
    // Mapa da cidade — o explorador traça seu caminho
    icon: `${ITEM}town-map.png`,
    species: 25,
    catchBonus:    0.03,
    xpBonus:       0.01,
    raidBonus:     0,
    forgeDiscount: 0,
    shinyBonus:    0,
    raidAttempts:  0,
    legendaryRaid: false,
    description: 'Você começou a mapear o mundo Pokémon.',
  },
  {
    level: 3,
    title: 'Caçador',
    // Great Ball — captura com mais eficiência
    icon: `${ITEM}great-ball.png`,
    species: 60,
    catchBonus:    0.06,
    xpBonus:       0.02,
    raidBonus:     0.05,
    forgeDiscount: 0,
    shinyBonus:    0,
    raidAttempts:  0,
    legendaryRaid: false,
    description: 'Suas técnicas de captura estão afiadas.',
  },
  {
    level: 4,
    title: 'Veterano',
    // Ultra Ball — domínio avançado de captura
    icon: `${ITEM}ultra-ball.png`,
    species: 120,
    catchBonus:    0.09,
    xpBonus:       0.03,
    raidBonus:     0.08,
    forgeDiscount: 0.05,
    shinyBonus:    0,
    raidAttempts:  0,
    legendaryRaid: false,
    description: 'Experiência de campo forjou um treinador sólido.',
  },
  {
    level: 5,
    title: 'Elite',
    // Star Piece — raridade e valor acumulados
    icon: `${ITEM}star-piece.png`,
    species: 200,
    catchBonus:    0.12,
    xpBonus:       0.05,
    raidBonus:     0.12,
    forgeDiscount: 0.08,
    shinyBonus:    0.05,
    raidAttempts:  0,
    legendaryRaid: false,
    description: 'Você está entre os melhores treinadores da região.',
  },
  {
    level: 6,
    title: 'Campeão',
    // VS Seeker — o desafiador que nunca para
    icon: `${ITEM}vs-seeker.png`,
    species: 310,
    catchBonus:    0.15,
    xpBonus:       0.06,
    raidBonus:     0.15,
    forgeDiscount: 0.10,
    shinyBonus:    0.10,
    raidAttempts:  0,
    legendaryRaid: false,
    description: 'Reconhecido entre os campeões do mundo Pokémon.',
  },
  {
    level: 7,
    title: 'Mestre',
    // Master Ball — o ápice da captura
    icon: `${ITEM}master-ball.png`,
    species: 430,
    catchBonus:    0.18,
    xpBonus:       0.07,
    raidBonus:     0.18,
    forgeDiscount: 0.13,
    shinyBonus:    0.15,
    raidAttempts:  1,
    legendaryRaid: false,
    description: 'Sua maestria com Pokémon é lendária.',
  },
  {
    level: 8,
    title: 'Grande Mestre',
    // Shiny Charm — atraidor de raridades
    icon: `${ITEM}shiny-charm.png`,
    species: 580,
    catchBonus:    0.20,
    xpBonus:       0.08,
    raidBonus:     0.20,
    forgeDiscount: 0.15,
    shinyBonus:    0.18,
    raidAttempts:  1,
    legendaryRaid: false,
    description: 'Poucos treinadores chegaram a este nível.',
  },
  {
    level: 9,
    title: 'Lenda',
    // PP Max — poder elevado ao limite máximo
    icon: `${ITEM}pp-max.png`,
    species: 750,
    catchBonus:    0.23,
    xpBonus:       0.09,
    raidBonus:     0.23,
    forgeDiscount: 0.18,
    shinyBonus:    0.22,
    raidAttempts:  2,
    legendaryRaid: false,
    description: 'Seu nome é conhecido em todas as regiões.',
  },
  {
    level: 10,
    title: 'Mestre Pokémon',
    // Gold Bottle Cap — o troféu dourado supremo
    icon: `${ITEM}gold-bottle-cap.png`,
    species: 950,
    catchBonus:    0.25,
    xpBonus:       0.10,
    raidBonus:     0.25,
    forgeDiscount: 0.20,
    shinyBonus:    0.25,
    raidAttempts:  2,
    legendaryRaid: true,
    description: 'O patamar máximo. Você capturou o mundo.',
  },
];

/**
 * Retorna o objeto de nível atual com base no número de espécies únicas.
 * @param {number} speciesCount - Object.keys(caughtData).length
 * @returns {object} entrada de TRAINER_LEVELS correspondente
 */
export const getTrainerLevel = (speciesCount = 0) =>
  [...TRAINER_LEVELS].reverse().find(l => speciesCount >= l.species) || TRAINER_LEVELS[0];

/**
 * Retorna o próximo nível (ou null se já estiver no 10).
 */
export const getNextTrainerLevel = (currentLevel) =>
  TRAINER_LEVELS.find(l => l.level === currentLevel + 1) || null;

/**
 * Progresso percentual (0-100) dentro do nível atual.
 */
export const getTrainerLevelProgress = (speciesCount = 0) => {
  const current = getTrainerLevel(speciesCount);
  const next = getNextTrainerLevel(current.level);
  if (!next) return 100;
  const from = current.species;
  const to = next.species;
  return Math.min(100, Math.max(0, Math.round(((speciesCount - from) / (to - from)) * 100)));
};

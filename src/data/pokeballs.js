/**
 * pokeballs.js — Definições visuais e mecânicas de todas as Pokébolas do jogo.
 * Usadas para: efeito de entrada na batalha, troca de pokébola no modal de detalhes.
 */

export const POKEBALL_DEFS = {
  pokeballs: {
    id: 'pokeballs',
    name: 'Pokébola',
    emoji: '🔴',
    color: '#ee1515',
    glowColor: 'rgba(238,21,21,0.6)',
    topColor: '#ee1515',
    bottomColor: '#f5f5f5',
    bandColor: '#222222',
    description: 'A pokébola clássica. Simples e eficaz.',
    effect: 'flash',       // flash vermelho/branco rápido
    successRate: 0.85,     // 85% de chance na troca
  },
  great_ball: {
    id: 'great_ball',
    name: 'Superbola',
    emoji: '🔵',
    color: '#2563eb',
    glowColor: 'rgba(37,99,235,0.6)',
    topColor: '#2563eb',
    bottomColor: '#f5f5f5',
    bandColor: '#ee1515',
    description: 'Maior taxa de captura. Ideal para pokémon selvagens mais fortes.',
    effect: 'burst',       // explosão de luz azul
    successRate: 0.80,
  },
  ultra_ball: {
    id: 'ultra_ball',
    name: 'Ultrabola',
    emoji: '🟡',
    color: '#eab308',
    glowColor: 'rgba(234,179,8,0.7)',
    topColor: '#1a1a1a',
    bottomColor: '#1a1a1a',
    bandColor: '#eab308',
    description: 'Alta taxa de captura. Pokébola preta e amarela com eficiência superior.',
    effect: 'lightning',   // raios elétricos dourados
    successRate: 0.75,
  },
  safari_ball: {
    id: 'safari_ball',
    name: 'Safari Ball',
    emoji: '🟢',
    color: '#16a34a',
    glowColor: 'rgba(22,163,74,0.6)',
    topColor: '#16a34a',
    bottomColor: '#f5f5f5',
    bandColor: '#713f12',
    description: 'Usada exclusivamente na Safari Zone. Traz a essência selvagem da natureza.',
    effect: 'nature',      // folhas e partículas verdes
    successRate: 0.70,
  },
  lure_ball: {
    id: 'lure_ball',
    name: 'Lure Ball',
    emoji: '🎣',
    color: '#0ea5e9',
    glowColor: 'rgba(14,165,233,0.6)',
    topColor: '#0ea5e9',
    bottomColor: '#f5f5f5',
    bandColor: '#ee1515',
    description: 'Pokébola de maçã-anzol. Mais eficaz para pokémon obtidos com vara de pesca.',
    effect: 'splash',      // ondas e gotas de água azul
    successRate: 0.78,
  },
  moon_ball: {
    id: 'moon_ball',
    name: 'Moon Ball',
    emoji: '🌙',
    color: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.7)',
    topColor: '#8b5cf6',
    bottomColor: '#1e1b4b',
    bandColor: '#c4b5fd',
    description: 'Pokébola feita com maçã-lua. Eficaz contra pokémon que evoluem com Pedra Lua.',
    effect: 'moonbeam',    // feixe prateado/roxo + estrelas
    successRate: 0.82,
  },
  friend_ball: {
    id: 'friend_ball',
    name: 'Friend Ball',
    emoji: '💚',
    color: '#22c55e',
    glowColor: 'rgba(34,197,94,0.6)',
    topColor: '#22c55e',
    bottomColor: '#f5f5f5',
    bandColor: '#15803d',
    description: 'Pokébola feita com maçã-amizade. O pokémon capturado fica mais amigável.',
    effect: 'hearts',      // corações e brilhos verdes
    successRate: 0.88,
  },
  heavy_ball: {
    id: 'heavy_ball',
    name: 'Heavy Ball',
    emoji: '⚫',
    color: '#374151',
    glowColor: 'rgba(55,65,81,0.7)',
    topColor: '#1f2937',
    bottomColor: '#6b7280',
    bandColor: '#9ca3af',
    description: 'Pokébola muito pesada. Mais eficaz contra pokémon de grande peso.',
    effect: 'gravity',     // impacto com onda de choque cinza/preta
    successRate: 0.72,
  },
  fast_ball: {
    id: 'fast_ball',
    name: 'Fast Ball',
    emoji: '⚡',
    color: '#f97316',
    glowColor: 'rgba(249,115,22,0.7)',
    topColor: '#f97316',
    bottomColor: '#f5f5f5',
    bandColor: '#1d4ed8',
    description: 'Pokébola de maçã-veloz. Eficaz contra pokémon muito rápidos.',
    effect: 'speed',       // rastros de velocidade laranja
    successRate: 0.76,
  },
  level_ball: {
    id: 'level_ball',
    name: 'Level Ball',
    emoji: '⬆️',
    color: '#dc2626',
    glowColor: 'rgba(220,38,38,0.6)',
    topColor: '#dc2626',
    bottomColor: '#fef9c3',
    bandColor: '#854d0e',
    description: 'Pokébola de maçã-nível. Mais eficaz se seu pokémon for muito mais forte.',
    effect: 'levelup',     // raios dourados ascendentes
    successRate: 0.80,
  },
};

/**
 * Retorna a definição de uma pokébola pelo ID.
 * Se não encontrado, retorna a pokébola padrão.
 */
export const getPokeballDef = (ballId) =>
  POKEBALL_DEFS[ballId] || POKEBALL_DEFS['pokeballs'];

/**
 * Lista de IDs de todas as pokébolas disponíveis para troca.
 */
export const ALL_BALL_IDS = Object.keys(POKEBALL_DEFS);

/**
 * Mensagem de efeito visual de cada tipo de pokébola.
 */
export const BALL_EFFECT_LABELS = {
  flash:     'Flash Clássico',
  burst:     'Explosão Azul',
  lightning: 'Raios Dourados',
  nature:    'Espírito da Floresta',
  splash:    'Ondas Aquáticas',
  moonbeam:  'Feixe Lunar',
  hearts:    'Aura de Amizade',
  gravity:   'Onda de Choque',
  speed:     'Rastro de Velocidade',
  levelup:   'Ascensão Dourada',
};

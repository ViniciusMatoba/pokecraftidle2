// Frases temáticas para treinadores de rota e Super Chefes (líderes em revanche).
// Usadas nos modais de aparição (intro) e de vitória (defeat).

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)] || '';

// Frases por CLASSE de treinador (o nome de rota começa com a classe, ex.: "Youngster Joey").
export const TRAINER_CLASS_PHRASES = {
  Youngster:  { intro: ['Ei! Meus shorts são super confortáveis pra batalhar!', 'Vamos ver do que você é feito!'], defeat: ['Ah não, perdi de novo...', 'Você é forte mesmo!'] },
  Lass:       { intro: ['Meus Pokémon são fofos E fortes!', 'Não vou pegar leve com você!'], defeat: ['Que pena! Foi divertido mesmo assim.', 'Você venceu... por enquanto!'] },
  Hiker:      { intro: ['Subi montanhas pra ficar assim de forte!', 'Prepare-se para uma batalha rochosa!'], defeat: ['Rochas duras, derrota mole...', 'Você tem fibra, garoto!'] },
  Sailor:     { intro: ['Ahoy! As ondas me deixaram durão!', 'Vamos ver se você aguenta o mar!'], defeat: ['Naufraguei feio nessa...', 'Boa batalha, marujo!'] },
  'Bug':      { intro: ['Insetos são incríveis, você vai ver!', 'Peguei todos esses na floresta!'], defeat: ['Meus insetos... esmagados!', 'Você é bom nisso!'] },
  Picnicker:  { intro: ['Trouxe lanche e uma batalha!', 'Que dia lindo para vencer!'], defeat: ['Bom, ainda tenho o lanche...', 'Você merece a vitória!'] },
  Gentleman:  { intro: ['Uma batalha elegante, se me permite.', 'Que vença o mais refinado!'], defeat: ['Impecável da sua parte. Bravo!', 'Aceito a derrota com classe.'] },
  Veteran:    { intro: ['Já vi de tudo nessas rotas. Mostre-me algo novo!', 'Anos de experiência contra você!'], defeat: ['Você tem um futuro brilhante!', 'Fui superado, admito.'] },
  Ace:        { intro: ['Sou um Ás por um motivo!', 'Prepare-se para o alto nível!'], defeat: ['Impressionante! Você é talentoso.', 'Perdi para alguém especial.'] },
  Worker:     { intro: ['Trabalho duro e batalho duro!', 'Vamos ao que interessa!'], defeat: ['De volta ao batente...', 'Você trabalhou bem essa vitória!'] },
  Plasma:     { intro: ['Pela Equipe Plasma! Você não vai passar!', 'Vou libertar seus Pokémon de você!'], defeat: ['A Plasma vai se lembrar disso!', 'Impossível... você venceu!'] },
  Flare:      { intro: ['A Equipe Flare traz um novo mundo!', 'Você não tem estilo para me vencer!'], defeat: ['Que deselegante perder assim!', 'A Flare recuará... por ora.'] },
  Skull:      { intro: ['Yo! A Equipe Skull tá na área!', 'Cai fora ou apanha!'], defeat: ['Aff, que mancada...', 'Cê é osso duro de roer!'] },
  Yell:       { intro: ['Vamos torcer... contra você!', 'A Equipe Yell não vai deixar barato!'], defeat: ['Buááá, perdemos!', 'Você tem nosso respeito!'] },
  Star:       { intro: ['A Equipe Star brilha mais forte!', 'Bora ver esse show de batalha!'], defeat: ['Nossa estrela caiu hoje...', 'Você brilhou mais que a gente!'] },
};

// Frases genéricas (fallback) para treinadores comuns.
export const GENERIC_TRAINER_PHRASES = {
  intro: ['Ei, você aí! Que tal uma batalha?', 'Não vou perder fácil!', 'Mostre a força da sua equipe!'],
  defeat: ['Você é forte! Foi uma boa batalha.', 'Perdi, mas aprendi muito!', 'Da próxima eu te pego!'],
};

// Frases dos Super Chefes (líderes em revanche na rota).
export const SUPER_BOSS_PHRASES = {
  intro: [
    'Nos encontramos de novo! Desta vez não vou pegar leve.',
    'Uma revanche? Perfeito. Mostre se evoluiu!',
    'Você achou que uma insígnia bastava? Prove seu valor outra vez!',
  ],
  defeat: [
    'Extraordinário! Você realmente ficou mais forte.',
    'Que revanche! Você merece cada vitória.',
    'Fui derrotado de novo... você é um verdadeiro campeão!',
  ],
};

// Extrai a classe do treinador a partir do nome ("Youngster Joey" -> "Youngster").
const classFromName = (name = '') => {
  const first = String(name).trim().split(/\s+/)[0] || '';
  if (TRAINER_CLASS_PHRASES[first]) return first;
  // Casos com duas palavras de classe (ex.: "Bug Catcher", "Ace Trainer")
  const twoWord = String(name).trim().split(/\s+/).slice(0, 2).join(' ');
  if (twoWord.startsWith('Bug')) return 'Bug';
  if (twoWord.startsWith('Ace')) return 'Ace';
  if (first.includes('Plasma')) return 'Plasma';
  return null;
};

export const getTrainerIntroPhrase = (enemy = {}) => {
  if (enemy.isSuperBoss) return pick(SUPER_BOSS_PHRASES.intro);
  const cls = classFromName(enemy.trainerName || enemy.name || '');
  return pick((cls && TRAINER_CLASS_PHRASES[cls]?.intro) || GENERIC_TRAINER_PHRASES.intro);
};

export const getTrainerDefeatPhrase = (enemy = {}) => {
  if (enemy.isSuperBoss) return pick(SUPER_BOSS_PHRASES.defeat);
  const cls = classFromName(enemy.trainerName || enemy.name || '');
  return pick((cls && TRAINER_CLASS_PHRASES[cls]?.defeat) || GENERIC_TRAINER_PHRASES.defeat);
};

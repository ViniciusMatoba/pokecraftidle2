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

// Frases marcantes das EQUIPES VILÃS (anime/jogos), por nome de exibição.
export const VILLAIN_TEAM_PHRASES = {
  'Equipe Rocket': { intro: ['Preparem-se para encrenca! E façam ficar em dobro!', 'A Equipe Rocket decola à velocidade da luz!'], defeat: ['A Equipe Rocket foi nocauteada de novo!', 'Isso não vai ficar assim!'] },
  'Equipe Rainbow Rocket': { intro: ['Todos os vilões reunidos! Você não tem a menor chance!'], defeat: ['Impossível... derrotados mesmo unidos!'] },
  'Equipe Aqua': { intro: ['O mar deve cobrir toda a terra! Saia do caminho!'], defeat: ['As marés viraram contra nós...'] },
  'Equipe Magma': { intro: ['A terra deve se expandir para a humanidade prosperar!'], defeat: ['Nosso plano virou cinzas!'] },
  'Equipe Galáctica': { intro: ['Um novo mundo sem espírito nascerá! Não vou deixar você atrapalhar!'], defeat: ['O caos que buscávamos... falhou.'] },
  'Equipe Plasma': { intro: ['Vamos libertar os Pokémon de humanos como você!'], defeat: ['Nem a libertação nos salvou da derrota...'] },
  'Equipe Flare': { intro: ['Só os escolhidos merecem um mundo belo!'], defeat: ['Que deselegante... perder assim.'] },
  'Equipe Skull': { intro: ['Yo! A Equipe Skull manda nessa área, mano!'], defeat: ['Aff, levamos um esculacho...'] },
  'Equipe Yell': { intro: ['Vamos torcer... pela sua derrota!'], defeat: ['Buááá, perdemos a torcida!'] },
  'Equipe Star': { intro: ['Hora do show! A Equipe Star vai brilhar!'], defeat: ['Nossa estrela apagou hoje...'] },
};

// Frases marcantes de LÍDERES DE GINÁSIO (Kanto + adicione outras regiões depois).
export const LEADER_PHRASES = {
  'Brock':     { intro: ['Sou Brock! Minha vontade é firme como a pedra de Pewter!'], defeat: ['Reconheço seu poder. Sua determinação é sólida como rocha.'] },
  'Misty':     { intro: ['Sou a sereia aquática de Cerulean! Prepare-se para se molhar!'], defeat: ['Suas ondas foram mais fortes que as minhas...'] },
  'Lt. Surge': { intro: ['Vou te fritar como no exército, criança!'], defeat: ['Você tem faísca de verdade, soldado!'] },
  'Surge':     { intro: ['Vou te fritar como no exército, criança!'], defeat: ['Você tem faísca de verdade, soldado!'] },
  'Erika':     { intro: ['Bem-vindo. Detestaria machucá-lo... mas vou vencer.'], defeat: ['Que graça a sua vitória. Reconheço minha derrota.'] },
  'Koga':      { intro: ['Fu-ha-ha! Veneno e névoa serão a sua ruína!'], defeat: ['Impressionante... você enxergou através da névoa.'] },
  'Sabrina':   { intro: ['Eu já previ sua derrota com meus poderes psíquicos.'], defeat: ['Minha previsão... falhou. Que curioso.'] },
  'Blaine':    { intro: ['Hah! Resolva o enigma das minhas chamas... ou queime!'], defeat: ['Você apagou meu fogo. Muito bem jogado!'] },
  'Giovanni':  { intro: ['Sou o líder da Equipe Rocket! Ajoelhe-se diante do meu poder!'], defeat: ['Ha! Você venceu. A Equipe Rocket se dissolve... por ora.'] },
};

export const getTrainerIntroPhrase = (enemy = {}) => {
  const name = enemy.trainerName || enemy.name || '';
  const villain = enemy.villainTeamName || name;
  if (enemy.isSuperBoss) return pick(LEADER_PHRASES[name]?.intro || SUPER_BOSS_PHRASES.intro);
  if (VILLAIN_TEAM_PHRASES[villain]) return pick(VILLAIN_TEAM_PHRASES[villain].intro);
  const cls = classFromName(name);
  return pick((cls && TRAINER_CLASS_PHRASES[cls]?.intro) || GENERIC_TRAINER_PHRASES.intro);
};

export const getTrainerDefeatPhrase = (enemy = {}) => {
  const name = enemy.trainerName || enemy.name || '';
  const villain = enemy.villainTeamName || name;
  if (enemy.isSuperBoss) return pick(LEADER_PHRASES[name]?.defeat || SUPER_BOSS_PHRASES.defeat);
  if (VILLAIN_TEAM_PHRASES[villain]) return pick(VILLAIN_TEAM_PHRASES[villain].defeat);
  const cls = classFromName(name);
  return pick((cls && TRAINER_CLASS_PHRASES[cls]?.defeat) || GENERIC_TRAINER_PHRASES.defeat);
};

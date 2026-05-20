export const ABILITY_ITEM_ID = 'ability_capsule';

export const normalizeAbilityId = (ability = '') => String(ability || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase()
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const getAbilityLabel = (ability = '') => {
  const id = normalizeAbilityId(ability);
  if (!id) return 'Sem habilidade';
  return id.split('-').map(part => part ? part[0].toUpperCase() + part.slice(1) : part).join(' ');
};

export const ABILITY_DESCRIPTIONS = {
  overgrow: 'Aumenta golpes de Planta em 50% quando o HP esta abaixo de 1/3.',
  blaze: 'Aumenta golpes de Fogo em 50% quando o HP esta abaixo de 1/3.',
  torrent: 'Aumenta golpes de Agua em 50% quando o HP esta abaixo de 1/3.',
  swarm: 'Aumenta golpes de Inseto em 50% quando o HP esta abaixo de 1/3.',
  adaptability: 'O bonus de STAB sobe de 1.5x para 2x.',
  guts: 'Com status negativo, aumenta o Ataque em 50% e ignora a reducao de queimadura.',
  levitate: 'Fica imune a golpes do tipo Terra.',
  flash_fire: 'Fica imune a golpes de Fogo e fortalece golpes de Fogo.',
  water_absorb: 'Fica imune a golpes de Agua.',
  volt_absorb: 'Fica imune a golpes Eletricos.',
  lightning_rod: 'Fica imune a golpes Eletricos.',
  motor_drive: 'Fica imune a golpes Eletricos.',
  sap_sipper: 'Fica imune a golpes de Planta.',
  storm_drain: 'Fica imune a golpes de Agua.',
  dry_skin: 'Fica imune a Agua, mas recebe mais dano de Fogo.',
  thick_fat: 'Recebe metade do dano de golpes de Fogo e Gelo.',
  heatproof: 'Recebe metade do dano de golpes de Fogo.',
  water_bubble: 'Dobra golpes de Agua e reduz dano de Fogo pela metade.',
  multiscale: 'Com HP cheio, recebe metade do dano.',
  shadow_shield: 'Com HP cheio, recebe metade do dano.',
  wonder_guard: 'So recebe dano de golpes super efetivos.',
  fur_coat: 'Recebe metade do dano de golpes fisicos.',
  fluffy: 'Recebe metade do dano fisico, mas dano de Fogo e dobrado.',
  marvel_scale: 'Com status negativo, aumenta a Defesa em 50%.',
  huge_power: 'Dobra o Ataque fisico.',
  pure_power: 'Dobra o Ataque fisico.',
  strong_jaw: 'Aumenta golpes de mordida em 50%.',
  tough_claws: 'Aumenta golpes de contato em 30%.',
  technician: 'Aumenta golpes de poder base 60 ou menor em 50%.',
  sheer_force: 'Aumenta golpes com efeito secundario em 30%.',
  tinted_lens: 'Golpes pouco efetivos causam dano dobrado.',
  neuroforce: 'Golpes super efetivos causam 25% mais dano.',
  sand_force: 'Em tempestade de areia, aumenta golpes Pedra, Terra e Aco em 30%.',
  steelworker: 'Aumenta golpes de Aco em 50%.',
  iron_fist: 'Aumenta golpes de soco em 20%.',
  mega_launcher: 'Aumenta golpes de pulso e aura em 50%.',
  sharpness: 'Aumenta golpes cortantes em 50%.',
  punk_rock: 'Aumenta golpes sonoros em 30% e reduz dano sonoro recebido.',
  soundproof: 'Fica imune a golpes sonoros.',
  bulletproof: 'Fica imune a golpes de bomba, esfera e projetil.',
  cloud_nine: 'Anula bonus e penalidades de clima enquanto estiver em batalha.',
  drizzle: 'Nos jogos, invoca chuva ao entrar em batalha.',
  drought: 'Nos jogos, invoca sol forte ao entrar em batalha.',
  sand_stream: 'Nos jogos, invoca tempestade de areia ao entrar em batalha.',
  snow_warning: 'Nos jogos, invoca neve/granizo ao entrar em batalha.',
  intimidate: 'Nos jogos, reduz o Ataque do inimigo ao entrar em batalha.',
  sturdy: 'Nos jogos, evita nocaute com HP cheio uma vez.',
  pressure: 'Nos jogos, aumenta o gasto de PP do inimigo.',

  // ── Contato — aplicação de status ────────────────────────────────────────
  static: 'Ao receber golpe de contato, tem 30% de chance de paralisar o oponente.',
  flame_body: 'Ao receber golpe de contato, tem 30% de chance de queimar o oponente.',
  poison_point: 'Ao receber golpe de contato, tem 30% de chance de envenenar o oponente.',
  effect_spore: 'Ao receber golpe de contato, tem 30% de chance de causar sono, paralisia ou veneno.',

  // ── Contato — dano de recuo ao atacante ──────────────────────────────────
  rough_skin: 'O oponente perde 1/8 do HP maximo ao acertar um golpe de contato.',
  iron_barbs: 'O oponente perde 1/8 do HP maximo ao acertar um golpe de contato.',

  // ── Cura e recuperação ────────────────────────────────────────────────────
  natural_cure: 'Cura automaticamente todos os status negativos ao ser substituido.',
  shed_skin: 'Tem 30% de chance por turno de curar automaticamente o status negativo.',
  regenerator: 'Recupera 1/3 do HP ao ser substituido em batalha.',
  healer: 'Tem 30% de chance por turno de curar o status de um aliado.',
  rain_dish: 'Recupera HP gradualmente durante a chuva.',

  // ── Boost por condição ou nocaute ─────────────────────────────────────────
  speed_boost: 'A Velocidade sobe em um estagio a cada turno de batalha.',
  moxie: 'Ao nocautear um oponente, o Ataque sobe em um estagio.',
  beast_boost: 'Ao nocautear um oponente, aumenta a estatistica mais alta do usuario.',
  soul_heart: 'Sempre que qualquer Pokemon e nocauteado, o Ataque Especial sobe em um estagio.',
  intrepid_sword: 'Ao entrar em batalha, o Ataque sobe em um estagio automaticamente.',
  dauntless_shield: 'Ao entrar em batalha, a Defesa sobe em um estagio automaticamente.',

  // ── Estatísticas ignoradas / invertidas ───────────────────────────────────
  unaware: 'Ignora todas as mudancas de estagio do oponente ao calcular dano recebido e causado.',
  competitive: 'Quando qualquer estatistica e reduzida, o Ataque Especial sobe em 2 estagios.',
  defiant: 'Quando qualquer estatistica e reduzida, o Ataque sobe em 2 estagios.',
  contrary: 'Todas as mudancas de estagio sao invertidas — aumentos viram reducoes e vice-versa.',
  simple: 'Todas as mudancas de estagio de estatisticas sao dobradas.',

  // ── Troca de tipo ────────────────────────────────────────────────────────
  protean: 'O tipo do usuario muda para o tipo do golpe que vai usar, antes de atacar.',
  libero: 'O tipo do usuario muda para o tipo do golpe que vai usar, antes de atacar.',
  color_change: 'Muda o proprio tipo para o tipo do golpe recebido ao ser atingido.',

  // ── Velocidade no clima ───────────────────────────────────────────────────
  swift_swim: 'Dobra a Velocidade durante clima de chuva.',
  chlorophyll: 'Dobra a Velocidade durante clima de sol forte.',
  sand_rush: 'Dobra a Velocidade durante tempestade de areia.',
  slush_rush: 'Dobra a Velocidade durante neve ou granizo.',
  solar_power: 'Em sol forte, o Ataque Especial sobe 50%, mas perde HP a cada turno.',

  // ── Defesa contra super efetivos ──────────────────────────────────────────
  ice_scales: 'Recebe metade do dano de todos os golpes especiais.',
  filter: 'Golpes super efetivos causam 25% menos dano ao usuario.',
  solid_rock: 'Golpes super efetivos causam 25% menos dano ao usuario.',
  prism_armor: 'Golpes super efetivos causam 25% menos dano ao usuario.',

  // ── Imunidades a dano indireto ────────────────────────────────────────────
  magic_guard: 'Imune a todo dano indireto: veneno, queimadura, recuo, clima e armadilhas.',
  rock_head: 'Nao sofre dano de recuo causado pelos proprios golpes.',

  // ── Terrenos ─────────────────────────────────────────────────────────────
  grassy_surge: 'Invoca Terreno Gramado ao entrar em batalha, fortalecendo golpes de Planta.',
  misty_surge: 'Invoca Terreno Nevoeiro ao entrar em batalha, bloqueando status negativos.',
  electric_surge: 'Invoca Terreno Eletrico ao entrar em batalha, fortalecendo golpes Eletricos.',
  psychic_surge: 'Invoca Terreno Psiquico ao entrar em batalha, fortalecendo golpes Psiquicos.',
  hadron_engine: 'Invoca Terreno Eletrico e aumenta o Ataque Especial nesse terreno.',
  orichalcum_pulse: 'Invoca sol forte ao entrar em batalha e aumenta o Ataque nesse clima.',

  // ── Golpes especiais: imunidade e penetração ──────────────────────────────
  scrappy: 'Golpes Normais e Luta podem acertar e causar dano em Pokemon do tipo Fantasma.',
  inner_focus: 'Imune a recuo (flinch); nao e afetado pela reducao de Ataque de Intimidate.',
  magic_bounce: 'Nos jogos, reflete golpes de status de volta ao oponente.',
  infiltrator: 'Nos jogos, golpes ignoram Reflect, Light Screen e Aurora Veil.',
  no_guard: 'Garante que todos os golpes do usuario acertem, mas tambem sempre e acertado.',
  serene_grace: 'Dobra a chance de efeitos secundarios dos golpes (paralisia, queimadura, etc.).',

  // ── Passivas ofensivas ────────────────────────────────────────────────────
  hustle: 'Aumenta o Ataque fisico em 50%, mas reduz a precisao de golpes fisicos em 20%.',
  reckless: 'Aumenta em 20% o poder de golpes que causam dano de recuo ao usuario.',
  sniper: 'Aumenta o dano de golpes criticos para 2.25x em vez de 1.5x.',
  super_luck: 'Aumenta a taxa base de golpes criticos do usuario.',
  analytic: 'Aumenta o dano em 30% quando o usuario e o ultimo a atacar no turno.',
  gorilla_tactics: 'Aumenta o Ataque em 50%, mas o usuario fica preso usando apenas um golpe.',
  rocky_payload: 'Aumenta em 50% o poder de golpes do tipo Pedra.',
  triage: 'Golpes de recuperacao de HP recebem prioridade maxima.',
  sheer_force_keep: 'Aumenta golpes com efeito secundario em 30%, mas remove o efeito.',

  // ── Passivas defensivas / evasão ──────────────────────────────────────────
  battle_armor: 'Imune a golpes criticos.',
  shell_armor: 'Imune a golpes criticos.',
  wonder_skin: 'Golpes de status tem 50% de chance de falhar contra o usuario.',
  keen_eye: 'A precisao do usuario nao pode ser reduzida.',
  own_tempo: 'Imune a confusao e aos efeitos de Intimidate.',
  oblivious: 'Imune a encantamento, provocacao e reducao de Ataque de Intimidate.',
  tangled_feet: 'Enquanto confuso, a esquiva do usuario dobra.',

  // ── Passivas de campo / suporte ───────────────────────────────────────────
  pickup: 'Pode encontrar itens apos batalhas no campo.',
  frisk: 'Ao entrar em batalha, revela o item segurado pelo oponente.',
  download: 'Aumenta Ataque ou Ataque Especial ao entrar com base nas defesas do oponente.',
  trace: 'Copia a habilidade do oponente ao entrar em batalha.',
  moody: 'A cada turno, uma estatistica aleatoria sobe 2 estagios e outra cai 1.',
  unburden: 'Dobra a Velocidade apos consumir ou perder o item segurado.',
  stall: 'O usuario sempre ataca por ultimo no turno, independente da Velocidade.',
  truant: 'O usuario descansa sem poder agir a cada turno alternado.',
  receiver: 'Copia a habilidade de um aliado nocauteado.',
  power_of_alchemy: 'Copia a habilidade de um aliado nocauteado.',

  // ── Habilidades especiais de Pokemon únicos ───────────────────────────────
  disguise: 'Absorve o primeiro golpe sem tomar dano (rasga a fantasia de Mimikyu).',
  ice_face: 'Absorve o primeiro golpe fisico sem tomar dano (gelo derrete ao ser atingido).',
  neutralizing_gas: 'Desativa as habilidades de todos os Pokemon enquanto estiver em batalha.',
  good_as_gold: 'Imune a todos os golpes de status do oponente.',
  earth_eater: 'Fica imune a golpes de Terra e recupera HP em vez de tomar dano.',
  purifying_salt: 'Imune a status negativos e recebe metade do dano de golpes Fantasma.',
  armor_tail: 'Impede o oponente de usar golpes com prioridade positiva.',
  zero_to_hero: 'Ao ser substituido, transforma-se permanentemente na Forma Heroica.',
  commander: 'Ao entrar com Dondozo, assume o comando e impulsiona as estatisticas do aliado.',
  sword_of_ruin: 'Reduz a Defesa de todos os adversarios em 25% enquanto em batalha.',
  tablets_of_ruin: 'Reduz o Ataque de todos os adversarios em 25% enquanto em batalha.',
  vessel_of_ruin: 'Reduz o Ataque Especial de todos os adversarios em 25% enquanto em batalha.',
  beads_of_ruin: 'Reduz a Defesa Especial de todos os adversarios em 25% enquanto em batalha.',
  toxic_chain: 'Golpes tem chance de envenenar gravemente o oponente.',
  wind_rider: 'Imune a golpes de vento; o Ataque sobe ao ser alvo de Tailwind.',
  electromorphosis: 'Ao receber dano, carrega energia para fortalecer o proximo golpe Eletrico.',
};

export const getAbilityDescription = (ability = '') => (
  ABILITY_DESCRIPTIONS[normalizeAbilityId(ability)]
  || ABILITY_DESCRIPTIONS[normalizeAbilityId(ability).replace(/-/g, '_')]
  || 'Habilidade especial deste Pokemon. Alguns efeitos passivos ja influenciam as batalhas.'
);

const pickAbilityFromPokemon = (pokemon = {}, fallback = 'Overgrow') => {
  const abilities = (pokemon.abilities || []).filter(Boolean);
  if (!abilities.length) return fallback;
  return abilities[Math.floor(Math.random() * abilities.length)];
};

export const getPokemonAbilityPool = (pokemon = {}) => {
  const abilities = (pokemon.abilities || []).filter(Boolean);
  return abilities.length ? abilities : [pokemon.ability || 'Overgrow'];
};

export const assignRandomAbility = (pokemon = {}, pokedexEntry = null) => {
  const source = pokedexEntry || pokemon;
  const ability = pokemon.ability || pickAbilityFromPokemon(source);
  return {
    ...pokemon,
    ability,
    abilityPool: getPokemonAbilityPool(source),
  };
};

export const setPokemonAbility = (pokemon = {}, ability) => ({
  ...pokemon,
  ability,
  abilityPool: getPokemonAbilityPool(pokemon),
});

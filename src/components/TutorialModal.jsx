import React, { useState } from 'react';

const itemIcon = (name) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;
const pokemonSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
const trainerSprite = (name) => `https://play.pokemonshowdown.com/sprites/trainers/${name}.png`;

const STEPS = [
  {
    id: 'routes',
    color: '#16a34a',
    bg: 'linear-gradient(145deg, #052e16 0%, #166534 62%, #0f172a 100%)',
    icon: itemIcon('town-map'),
    hero: pokemonSprite(25),
    tag: 'Passo 1',
    title: 'Treine nas Rotas',
    subtitle: 'O caminho principal',
    bullets: [
      { icon: itemIcon('poke-ball'), title: 'Batalhas selvagens', text: 'Derrote Pokemon nas rotas para ganhar XP, moedas e materiais.' },
      { icon: itemIcon('rare-candy'), title: 'Evolucao constante', text: 'Quanto mais voce treina, mais rapido o time evolui e alcança novas areas.' },
      { icon: itemIcon('dowsing-machine'), title: 'Drops de forja', text: 'Os Pokemon derrotados deixam essencias, fragmentos e receitas.' },
      { icon: itemIcon('repeat-ball'), title: 'Auto farm', text: 'Use o modo automatico para continuar progredindo enquanto organiza outras areas.' },
    ],
    tip: 'Mais insignias liberam rotas, regioes, itens e desafios.',
  },
  {
    id: 'city',
    color: '#0891b2',
    bg: 'linear-gradient(145deg, #083344 0%, #0e7490 58%, #0f172a 100%)',
    icon: itemIcon('full-restore'),
    hero: trainerSprite('nursejoy'),
    tag: 'Passo 2',
    title: 'Use a Cidade',
    subtitle: 'Base de progresso',
    bullets: [
      { icon: itemIcon('full-restore'), title: 'Centro Pokemon', text: 'Cure seu time gratuitamente antes de lideres, rivais e raids.' },
      { icon: itemIcon('poke-ball'), title: 'Poke Mart', text: 'Compre pokebolas e suprimentos quando a rota estiver mais dificil.' },
      { icon: itemIcon('metal-coat'), title: 'Forja', text: 'Transforme materiais das rotas em equipamentos, receitas e itens raros.' },
      { icon: itemIcon('escape-rope'), title: 'Expedicoes', text: 'Envie Pokemon do PC para coletar recursos e ganhar XP passivamente.' },
    ],
    tip: 'A Forja e a Casa ficam mais importantes conforme novas regioes abrem.',
  },
  {
    id: 'rivals',
    color: '#2563eb',
    bg: 'linear-gradient(145deg, #172554 0%, #1d4ed8 60%, #0f172a 100%)',
    icon: itemIcon('vs-seeker'),
    hero: trainerSprite('blue'),
    tag: 'Passo 3',
    title: 'Modo VS',
    subtitle: 'Historia regional',
    bullets: [
      { icon: itemIcon('vs-seeker'), title: 'Rivais', text: 'Venca rivais para abrir novos momentos da campanha regional.' },
      { icon: itemIcon('red-card'), title: 'Equipe vila', text: 'Derrote grunts e chefes para desbloquear rotas e progresso.' },
      { icon: itemIcon('town-map'), title: 'Novos caminhos', text: 'Algumas rotas dependem dessas vitorias para aparecer.' },
      { icon: itemIcon('medal-box'), title: 'Recompensas', text: 'Essas lutas contam para progresso, titulos e estatisticas.' },
    ],
    tip: 'Acesse pelo botao Modo VS na barra inferior.',
  },
  {
    id: 'gyms',
    color: '#d97706',
    bg: 'linear-gradient(145deg, #451a03 0%, #b45309 60%, #111827 100%)',
    icon: itemIcon('hard-stone'),
    hero: trainerSprite('brock'),
    tag: 'Passo 4',
    title: 'Ginasios e Liga',
    subtitle: 'Insignias e campeao',
    bullets: [
      { icon: itemIcon('medal-box'), title: 'Insignias', text: 'Derrote os 8 lideres para liberar rotas, level cap e sistemas.' },
      { icon: itemIcon('rare-candy'), title: 'Level cap', text: 'O limite de nivel cresce conforme voce vence ginasios.' },
      { icon: itemIcon('kings-rock'), title: 'Liga', text: 'Depois das insignias, enfrente Elite Four e Campeao.' },
      { icon: itemIcon('town-map'), title: 'Proxima regiao', text: 'Ser campeao abre a jornada seguinte e novas capturas.' },
    ],
    tip: 'Se travar, volte para rotas e treine ate o level cap atual.',
  },
  {
    id: 'raids',
    color: '#7c3aed',
    bg: 'linear-gradient(145deg, #2e1065 0%, #6d28d9 58%, #0f172a 100%)',
    icon: itemIcon('star-piece'),
    hero: pokemonSprite(249),
    tag: 'Passo 5',
    title: 'Raids',
    subtitle: 'Boss das rotas',
    bullets: [
      { icon: itemIcon('star-piece'), title: 'Evento de rota', text: 'Depois de muitas batalhas, um raid boss pode aparecer.' },
      { icon: itemIcon('x-attack'), title: 'Dano no tempo', text: 'Cause o maximo de dano antes do cronometro acabar.' },
      { icon: itemIcon('ultra-ball'), title: 'Captura rara', text: 'Ao enfraquecer a raid, tente capturar o Pokemon especial.' },
      { icon: itemIcon('tm-normal'), title: 'Recompensas', text: 'Raids podem render TMs, candies e materiais de forja.' },
    ],
    tip: 'Use seu melhor time e itens antes de iniciar uma raid forte.',
  },
  {
    id: 'boss',
    color: '#dc2626',
    bg: 'linear-gradient(145deg, #450a0a 0%, #b91c1c 56%, #111827 100%)',
    icon: itemIcon('rare-candy'),
    hero: pokemonSprite(150),
    tag: 'Passo 6',
    title: 'Boss Mundial',
    subtitle: 'Ranking e poder real',
    bullets: [
      { icon: itemIcon('life-orb'), title: 'Boss global', text: 'O boss muda por periodo e serve como desafio de dano.' },
      { icon: itemIcon('muscle-band'), title: 'Poder PS', text: 'Seu poder de colecao ajuda no dano contra boss.' },
      { icon: itemIcon('amulet-coin'), title: 'Ranking', text: 'Compare maior dano e pontuacao com outros jogadores.' },
      { icon: itemIcon('master-ball'), title: 'Endgame', text: 'Quanto mais voce captura e evolui, maior seu desempenho.' },
    ],
    tip: 'Capturar, evoluir e buscar shinies aumenta seu potencial.',
  },
];

const TutorialModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-md animate-fadeIn">
      <section
        className="modal-readable-panel w-full max-w-[420px] overflow-hidden border border-white/15 shadow-2xl animate-slideUp"
        style={{ background: current.bg, borderRadius: 28 }}
        aria-modal="true"
        role="dialog"
      >
        <div className="px-4 pt-4 pb-3 shrink-0">
          <div className="mb-4 flex gap-1.5">
            {STEPS.map((item, i) => (
              <div
                key={item.id}
                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{ background: i <= step ? '#fff' : 'rgba(255,255,255,0.20)' }}
              />
            ))}
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/15">
              <img src={current.icon} alt="" className="h-10 w-10 object-contain" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/60">{current.tag}</p>
              <h2 className="mt-1 text-[clamp(1.55rem,7vw,2.35rem)] font-black uppercase italic leading-[0.95] text-white drop-shadow-md">
                {current.title}
              </h2>
              <p className="mt-2 text-xs font-black uppercase tracking-widest text-white/65">{current.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="modal-readable-scroll px-4 pb-4">
          <div className="mb-4 flex items-center justify-center rounded-[1.75rem] border border-white/10 bg-black/15 py-3">
            <img
              src={current.hero}
              alt=""
              className="h-24 w-24 object-contain"
              style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.45))' }}
              loading="lazy"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            {current.bullets.map((bullet) => (
              <div key={bullet.title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.12] p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/90">
                  <img src={bullet.icon} alt="" className="h-8 w-8 object-contain" loading="lazy" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-wider text-white">{bullet.title}</p>
                  <p className="mt-1 text-[13px] font-bold leading-snug text-white/78">{bullet.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-black/15 p-3">
            <p className="text-[12px] font-bold leading-snug text-white/72">{current.tip}</p>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-[auto_1fr] gap-2 border-t border-white/10 bg-black/15 px-4 py-4">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="min-h-[52px] rounded-2xl border border-white/15 bg-white/10 px-4 text-xs font-black uppercase tracking-widest text-white/75 active:scale-95"
            >
              Voltar
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={() => (isLast ? onClose() : setStep(s => s + 1))}
            className="min-h-[52px] rounded-2xl bg-white px-4 text-sm font-black uppercase tracking-widest text-slate-900 shadow-xl active:scale-95"
          >
            {isLast ? 'Comecar' : 'Proximo'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default TutorialModal;

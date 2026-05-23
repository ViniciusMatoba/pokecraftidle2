import React, { useState } from 'react';
import ModalOverlay from './ModalOverlay';

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
      { icon: itemIcon('poke-ball'), title: 'Treinamento Obrigatorio', text: 'Rotas sao o coracao do jogo! Farmar XP aqui e a unica forma de subir de nivel e ficar mais forte.' },
      { icon: itemIcon('rare-candy'), title: 'Evolucao constante', text: 'Quanto mais voce treina, mais rapido o time evolui e alcança novas areas.' },
      { icon: itemIcon('dowsing-machine'), title: 'Drops de Receitas', text: 'Inimigos deixam materiais e RECEITAS. Elas sao usadas na Forja (Cidade) para criar equipamentos unicos!' },
      { icon: itemIcon('repeat-ball'), title: 'Auto farm', text: 'Use o modo automatico para continuar progredindo enquanto organiza o PC ou Forja.' },
    ],
    tip: 'Lembre-se: sem farmar XP nas rotas, voce nao vencera os Rivais e Ginasios.',
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
      { icon: itemIcon('vs-seeker'), title: 'Requisito de Ginasio', text: 'Para desafiar o Lider de Ginasio, voce DEVE primeiro derrotar todos os Rivais e Vilões da area atual no Modo VS.' },
      { icon: itemIcon('red-card'), title: 'Level Cap (Trava)', text: 'Seus Pokemon param de ganhar XP ao atingir o Nivel Maximo. Vença Ginasios para destravar limites maiores.' },
      { icon: itemIcon('town-map'), title: 'Novos caminhos', text: 'Vencer o Modo VS e Ginasios desbloqueia as proximas rotas da jornada.' },
      { icon: itemIcon('medal-box'), title: 'Recompensas', text: 'Essas lutas garantem itens cruciais e avancam a historia.' },
    ],
    tip: 'Sua equipe travou no limite de nivel? Corra para o Modo VS e desafie o Ginasio!',
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
      { icon: itemIcon('medal-box'), title: 'Insignias', text: 'Derrotar o Ginasio destrava seu LEVEL CAP, permitindo que seus Pokemon fiquem ainda mais fortes.' },
      { icon: itemIcon('rare-candy'), title: 'Barreira VS', text: 'Os Ginasios ficam bloqueados ate voce resolver a historia daquela area no Modo VS.' },
      { icon: itemIcon('kings-rock'), title: 'Liga', text: 'Depois das insignias, enfrente Elite Four e Campeao.' },
      { icon: itemIcon('town-map'), title: 'Proxima regiao', text: 'Ser campeao abre a jornada seguinte e novas capturas.' },
    ],
    tip: 'Ciclo de jogo: Farmar na Rota -> Vencer Modo VS -> Vencer Ginasio.',
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
    <ModalOverlay
      onClose={onClose}
      labelId="tutorial-modal-title"
      backdropClass="bg-slate-950/90 backdrop-blur-md"
      zIndex="99990"
      closeOnBackdrop={false}
    >
      <section
        className="modal-readable-panel w-full max-w-[420px] overflow-hidden border border-white/15 shadow-2xl animate-slideUp"
        style={{ background: current.bg, borderRadius: 28 }}
      >
        <div className="px-6 pt-5 pb-3 shrink-0">
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
              <h2 id="tutorial-modal-title" className="mt-1 text-[clamp(1.55rem,7vw,2.35rem)] font-black uppercase italic leading-[0.95] text-white drop-shadow-md">
                {current.title}
              </h2>
              <p className="mt-2 text-xs font-black uppercase tracking-widest text-white/65">{current.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="modal-readable-scroll px-6 pb-5">
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

        <div className="grid shrink-0 grid-cols-[auto_1fr] gap-2 border-t border-white/10 bg-black/15 px-6 py-5">
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
    </ModalOverlay>
  );
};

export default TutorialModal;

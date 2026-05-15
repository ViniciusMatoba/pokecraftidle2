// ── Tutorial de Boas-Vindas — PokéCraft Idle 2 ───────────────────────────────
// Exibido na primeira visita à Cidade após capturar o starter.
// gameTutorialShown salvo no gameState para não exibir novamente.

import React, { useState } from 'react';

const STEPS = [
  {
    id: 'routes',
    color: '#16a34a',
    bg: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png',
    pokemon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    tag: 'Passo 1 — Rotas',
    title: 'Treine nas Rotas',
    subtitle: 'O coração do jogo',
    bullets: [
      { icon: '⚔️', text: 'Lute contra Pokémons selvagens para ganhar XP e evoluir seu time' },
      { icon: '🪙', text: 'Cada vitória rende moedas para comprar e forjar itens' },
      { icon: '🎒', text: 'Pokémons derrotados dropam materiais para a Forja' },
      { icon: '🔄', text: 'Ative o AUTO para farmar automaticamente enquanto explora o resto' },
    ],
    tip: 'Dica: quanto mais insígnias, mais rotas e regiões são liberadas!',
  },
  {
    id: 'city',
    color: '#0891b2',
    bg: 'linear-gradient(135deg, #164e63 0%, #0e7490 100%)',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/full-restore.png',
    pokemon: 'https://play.pokemonshowdown.com/sprites/trainers/nursejoy.png',
    tag: 'Passo 2 — Cidade',
    title: 'Sua Base na Cidade',
    subtitle: 'Cura, compras e crafting',
    bullets: [
      { icon: '🏥', text: 'Poke Center: cure seus Pokémons gratuitamente antes de cada desafio importante' },
      { icon: '🛒', text: 'Poke Mart: gaste suas moedas em itens, pokébolas e equipamentos da loja' },
      { icon: '⚒️', text: 'Forja: transforme os drops coletados nas rotas em equipamentos poderosos' },
      { icon: '🗺️', text: 'Explorações: envie Pokémons em expedições para coletar itens e ganhar XP passivamente' },
    ],
    tip: 'Dica: a Forja é essencial — equipamentos forjados aumentam muito o dano do seu time! Visite também a Casa para plantações.',
  },
  {
    id: 'rivals',
    color: '#2563eb',
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png',
    pokemon: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png',
    tag: 'Passo 3 — Modo VS',
    title: 'Rivais & Equipe Vilã',
    subtitle: 'Avance na história',
    bullets: [
      { icon: '🧑‍🤝‍🧑', text: 'Derrote o Rival para desbloquear novas rotas e mecânicas' },
      { icon: '☠️', text: 'Elimine os grunts e chefes da Equipe Vilã para salvar a região' },
      { icon: '🗺️', text: 'Cada vitória abre novos caminhos no mapa do jogo' },
      { icon: '🏆', text: 'Esses duelos fazem parte da narrativa — não os pule!' },
    ],
    tip: 'Acesse em: Nav inferior → Modo VS → aba Desafios',
  },
  {
    id: 'gyms',
    color: '#d97706',
    bg: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hard-stone.png',
    pokemon: 'https://play.pokemonshowdown.com/sprites/trainers/brock.png',
    tag: 'Passo 4 — Modo VS',
    title: 'Ginásios & Liga',
    subtitle: 'Conquiste as insígnias',
    bullets: [
      { icon: '🏅', text: 'Derrote os 8 Líderes de Ginásio para ganhar as Insígnias da região' },
      { icon: '🔓', text: 'Cada insígnia libera novas rotas, itens e desafios' },
      { icon: '👑', text: 'Após 8 insígnias, enfrente a Elite Four e o Campeão' },
      { icon: '🌎', text: 'Tornar-se Campeão desbloqueia a próxima região (Johto, Hoenn...)' },
    ],
    tip: 'Acesse em: Nav inferior → Modo VS → aba Ginásios & Liga',
  },
  {
    id: 'raids',
    color: '#7c3aed',
    bg: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 100%)',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/max-raid-battle.png',
    pokemon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png',
    tag: 'Passo 5 — Raids',
    title: 'Eventos de Raid',
    subtitle: 'Boss especial nas rotas',
    bullets: [
      { icon: '⚡', text: 'A cada 200 batalhas um Raid Boss aparece na sua rota atual' },
      { icon: '💪', text: 'Cause o máximo de dano possível no tempo limite' },
      { icon: '✨', text: 'Pokémon raro pode ser shiny — tente capturá-lo após a luta!' },
      { icon: '🎁', text: 'Recompensas: EXP Candy, TMs raras e materiais de forja' },
    ],
    tip: 'Dica: use seu Pokémon mais forte quando a Raid aparecer!',
  },
  {
    id: 'boss',
    color: '#dc2626',
    bg: 'linear-gradient(135deg, #450a0a 0%, #991b1b 100%)',
    icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png',
    pokemon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    tag: 'Passo 6 — Boss Global',
    title: 'Boss Mundial',
    subtitle: 'Teste seu poder real',
    bullets: [
      { icon: '🌐', text: 'Um Boss coletivo muda a cada 24 horas para todos os jogadores' },
      { icon: '📊', text: 'Lute e veja quanto dano seu time causa — sem eliminação, sem risco' },
      { icon: '🥇', text: 'Ranking global de dano — quem causa mais dano lidera o placar' },
      { icon: '⚔️', text: 'Ótimo para medir seu progresso comparando com outros treinadores' },
    ],
    tip: 'Acesse em: Nav inferior → Modo VS → aba BOSS',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const TutorialModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[99990] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fadeIn p-4"
    >
      <div
        className="w-full max-w-md flex flex-col overflow-hidden animate-slideUp"
        style={{ maxHeight: '90dvh', background: current.bg, borderRadius: '2rem' }}
      >
        {/* Barra de progresso */}
        <div className="flex gap-1.5 px-6 pt-5 pb-0 shrink-0">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-all duration-500"
              style={{ background: i <= step ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)' }}
            />
          ))}
        </div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {/* Tag + ícone */}
          <div className="flex items-center justify-between mb-5">
            <span
              className="text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
            >
              {current.tag}
            </span>
            <img
              src={current.icon}
              alt=""
              className="w-10 h-10 object-contain"
              style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>

          {/* Pokémon + título */}
          <div className="flex items-center gap-5 mb-6">
            <div
              className="w-24 h-24 rounded-[1.5rem] flex items-center justify-center shrink-0 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.2)' }}
            >
              <img
                src={current.pokemon}
                alt=""
                className="w-20 h-20 object-contain"
                style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
            <div>
              <p className="text-[13px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {current.subtitle}
              </p>
              <h2
                className="text-3xl font-black uppercase italic leading-none tracking-tighter"
                style={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
              >
                {current.title}
              </h2>
            </div>
          </div>

          {/* Divisor */}
          <div className="h-px mb-6" style={{ background: 'rgba(255,255,255,0.15)' }} />

          {/* Bullets */}
          <div className="flex flex-col gap-4 mb-6">
            {current.bullets.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <span className="text-2xl leading-none shrink-0 mt-0.5">{b.icon}</span>
                <p className="text-[15px] font-bold leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
                  {b.text}
                </p>
              </div>
            ))}
          </div>

          {/* Dica */}
          <div
            className="flex items-start gap-3 p-4 rounded-2xl mb-2"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <span className="text-lg shrink-0">💡</span>
            <p className="text-[13px] font-bold italic" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {current.tip}
            </p>
          </div>
        </div>

        {/* Rodapé com botões */}
        <div
          className="px-7 pb-8 pt-4 shrink-0 flex gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-4 rounded-2xl font-black uppercase text-[13px] tracking-widest transition-all active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              ← Voltar
            </button>
          )}
          <button
            onClick={() => isLast ? onClose() : setStep(s => s + 1)}
            className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-xl"
            style={{ background: 'white', color: '#0f172a', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
          >
            {isLast ? '🚀 Começar Aventura!' : 'Próximo →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;

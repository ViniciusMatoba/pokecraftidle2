export const APP_VERSION = '1.52.1';
export const VERSION = '1.52.1';
export const APP_VERSION_DATE = '04/05/2026 15:53';

export const PATCH_NOTES = [
  {
    version: '1.52.1',
    date: '04/05/2026 15:53',
    changes: [
      '[FIX] Exp Share Regional: O Exp Share agora é calculado separadamente por região, iniciando em 0% ao chegar em Hoenn ou Johto.',
      '[FIX] Consistência de XP: Ganho de XP passivo para a equipe agora escala exclusivamente com as insígnias da região ativa.',
    ],
  },
  {
    version: '1.52.0',
    date: '04/05/2026 15:35',
    changes: [
      '[REGIONAL] Sinnoh Early Access: Implementado o rival Barry e desbloqueio de iniciais selvagens nas rotas 201/202.',
      '[BALANCE] Padronização de Ginásios: Escalonamento progressivo de times (G1-3: 3-4 pokes, G4-7: 5 pokes, G8: 6 pokes) para Johto e Hoenn.',
      '[SYSTEM] Revanches Elite: Implementado sistema de revanche global com times competitivos (Lv 90-100) para todos os líderes de Johto e Hoenn.',
      '[SYSTEM] Power Score: Vitórias em revanches agora concedem +5000 PS Global, acelerando o acesso a Relíquias de Elite.',
      '[UI] Feedback Visual: Adicionado indicador "DIFICULDADE: ELITE" e card persistente de jornada para Hoenn no menu CIDADE.',
      '[PROGRESSION] Transição para Hoenn: Gatilho automático e manual (via menu) para iniciar a jornada em Hoenn após vencer a Liga de Johto.',
      '[FIX] Correção de consistência nos níveis dos líderes de ginásio e lógica de rivalidades regionais.',
    ],
  },
  {
    version: '1.51.5',
    date: '04/05/2026 12:51',
    changes: [
      '[FIX] Correção crítica de paths de áudio: sons do jogo (derrota, nível, pokécenter, ginásio e músicas) agora carregam corretamente no GitHub Pages.',
    ],
  },
  {
    version: '1.51.4',
    date: '04/05/2026 12:38',
    changes: [
      '[UI] Tela de batalha agora exibe o Level Cap atual (Nv. X) abaixo da localização, visível apenas quando o Level Cap está ativado nas configurações.',
    ],
  },
  {
    version: '1.51.3',
    date: '04/05/2026 12:20',
    changes: [
      '[BALANCE] Level Cap desacoplado do bloqueio de time: Pokémon acima do cap continuam disponíveis para batalha e permanecem no time.',
      '[BALANCE] Level Cap agora afeta APENAS o ganho de XP. Ao atingir o cap da região, o Pokémon recebe 0 de XP até você obter mais insígnias.',
      '[FIX] Cálculo do Level Cap corrigido para usar os caps regionais reais (Kanto/Johto/Hoenn) por número de insígnias.',
      '[FIX] Bloqueio de time regional mantido estritamente por capturedRegion/Geração. Pokémon de Hoenn podem usar time em Kanto, mas Kanto/Johto requer vitória na Liga.',
      '[FIX] Assets de áudio renomeados para minúsculas sem espaços (derrota.mp3, nivel.mp3, poke-center.mp3, gym.mp3) eliminando erro 404 no GitHub Pages.',
    ],
  },
];

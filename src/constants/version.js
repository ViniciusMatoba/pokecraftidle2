export const APP_VERSION = '1.51.5';
export const VERSION = '1.51.5';
export const APP_VERSION_DATE = '04/05/2026 12:51';

export const PATCH_NOTES = [
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

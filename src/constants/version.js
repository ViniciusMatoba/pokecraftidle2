export const APP_VERSION = '1.67.0';
export const VERSION = '1.67.0';
export const APP_VERSION_DATE = '12/05/2026 18:00';
export const CHANGELOG = [
  'Feature: Sistema de Avatar — sprites por região, tints de cor, molduras e fundos personalizáveis na Loja de Prestígio',
  'Feature: Desbloqueio Progressivo de Avatar — cosméticos gratuitos ao vencer campeões regionais, premium na loja',
  'Balance: Raids Progressivas — estrelas limitadas por insígnias (0-1→1★, 2-3→2★, 4-5→3★, 6-7→4★, 8+→5★)',
  'Fix: Sincronização de Save — redirecionamento automático para a cidade ao detectar progresso na nuvem',
  'Hotfix: Resolvido erro de monitorAuthState indefinido que causava tela azul no carregamento',
  'Feature: Modal de Vitória Unificado — novos visuais e fluxos para Ginásios, Elite Four, Rivais e Equipes Vilãs',
  'Fix: Acesso Regional — validateTeamAccess agora permite Pokémon capturados na região ativa, independente da geração',
  'Fix: Estabilidade de PC — refatoração de moveToPC para usar instanceId, eliminando bugs de dessincronização de índice',
  'Fix: Service Worker atualizado para v1.64.0 — cache antigo invalidado corretamente',
  'Fix: Import morto de onAuthStateChanged removido do AppRoot (redução de bundle)',
  'Fix: Bioma Pradaria (Safari Zone) com ícone correto 🌿 em vez de 🌊',
  'Fix: selectedStarters agora salvo corretamente em Johto, Hoenn e Sinnoh (consistência com Gen 5+)',
  'Fix: Auditoria v1.63.0 — estabilização de rotas iniciais (Unova) e carregamento de saves',
  'Fix: Race Condition — unificação dos listeners de autenticação e sincronização cloud',
  'Feature: Estabilização de Alola — refatoração dos Trial Captains e remoção de duplicatas na Liga',
  'Balance: Bônus de Prestígio — multiplicadores de XP em temas e bônus de cuidador acumulativo (3x cap)',
  'UI: Consistência de Itens — correção de ícones (Sitrus Berry/Apricorns) e rótulos faltantes',
];

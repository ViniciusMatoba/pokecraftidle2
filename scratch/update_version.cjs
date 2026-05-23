const fs = require('fs');
const now = new Date();
const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

const content = `export const APP_VERSION = '1.55.52';
export const VERSION = '1.55.52';
export const APP_VERSION_DATE = '${dateStr}';
export const CHANGELOG = [
  'Sistema de Shiny Stacking implementado (+5% por shiny repetido)',
  'Indicadores de acúmulo de shinies na UI (✨ x3)',
  'Bloqueio de evoluções de gerações futuras em rotas regionais (Bug do Ursaluna)',
  'Stats recalculados dinamicamente no level-up e evolução',
  'Sanitização de dados compatível com Shiny Stacking',
  'Melhorias de estabilidade em expedições'
];
`;

fs.writeFileSync('src/constants/version.js', content);
console.log('Version updated to 1.55.52');

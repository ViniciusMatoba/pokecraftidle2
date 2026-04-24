const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    { m: 'sao Pokemon', c: 'são Pokémon' },
    { m: 'agua', c: 'água' },
    { m: 'Trovao', c: 'Trovão' },
    { m: 'Arco-Iris', c: 'Arco-Íris' },
    { m: 'Pantano', c: 'Pântano' },
    { m: 'Vulcao', c: 'Vulcão' },
    { m: 'destrui-lo', c: 'destruí-lo' },
    { m: 'comeca', c: 'começa' },
    { m: 'arido', c: 'árido' },
    { m: 'esta a bordo', c: 'está a bordo' },
    { m: 'esta aqui', c: 'está aqui' },
    { m: 'conexao', c: 'conexão' },
    { m: 'avancar', c: 'avançar' },
    { m: 'psiquico', c: 'psíquico' },
    { m: 'ultimo ginasio', c: 'último ginásio' },
    { m: 'ginasio', c: 'ginásio' },
    { m: 'pos-game', c: 'pós-game' },
    { m: 'lar de uma lenda', c: 'lar de uma lenda.' },
    { m: 'Insignia', c: 'Insígnia' }
];

const filePath = path.join(__dirname, '..', 'src', 'data', 'routes.js');
let content = fs.readFileSync(filePath, 'utf8');
for (const r of REPLACEMENTS) {
    content = content.split(r.m).join(r.c);
}
fs.writeFileSync(filePath, content, 'utf8');
console.log('Routes.js Grammar Fixed.');

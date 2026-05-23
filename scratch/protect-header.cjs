const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

const target = '<header style={{';
const comment = '{/* ⛔ PROTECTED: Header principal — NÃO ALTERAR ESTRUTURA, CORES OU POSICIONAMENTO SEM AUTORIZAÇÃO */}\n          ';

if (c.includes(target) && !c.includes(comment.trim())) {
  c = c.replace(target, comment + target);
  fs.writeFileSync('src/AppRoot.jsx', c);
  console.log('Comentário de proteção adicionado ao header');
} else if (c.includes(comment.trim())) {
  console.log('Comentário já existe');
} else {
  console.log('Target não encontrado');
}

const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');

// 1. Corrigir o container do rival_post_battle
const oldContainer = `      case 'rival_post_battle': {
        return (
          <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"`;

const newContainer = `      case 'rival_post_battle': {
        return (
          <div
            className="relative h-full flex flex-col items-center justify-center overflow-hidden"`;

// 2. Corrigir o balão (zIndex e position)
const oldBalloon = `            {/* Balão na parte inferior — Padrão Oficial 1.9.6 */}
            <div style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 36px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 50,
            }} className="animate-slideUp">`;

const newBalloon = `            {/* Balão na parte inferior — Padrão Oficial 1.9.6 */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: 'white',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 36px 20px',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
              zIndex: 10,
            }} className="animate-slideUp">`;

content = content.replace(oldContainer, newContainer);
content = content.replace(oldBalloon, newBalloon);

fs.writeFileSync('src/AppRoot.jsx', content);
console.log('Success');

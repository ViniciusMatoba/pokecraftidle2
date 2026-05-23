const fs = require('fs');
const path = 'src/AppRoot.jsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const startLine = 5614; // 1-indexed
const endLine = 5631; // 1-indexed

const newContent = `                   {/* Botão de Instalação PWA na Landing (Sempre visível se não for standalone) */}
                   {!isStandalone && (
                     <button
                       onClick={handleInstallPWA}
                       style={{
                         width: '100%',
                         marginTop: '8px',
                         padding: '16px',
                         borderRadius: '24px',
                         fontWeight: '900',
                         fontSize: '14px',
                         textTransform: 'uppercase',
                         letterSpacing: '1px',
                         background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                         color: 'white',
                         border: 'none',
                         boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
                         cursor: 'pointer',
                       }}
                       className="animate-bounce"
                     >
                       📥 {isIOS ? 'Como Instalar (iOS)' : (installPrompt ? 'Instalar Aplicativo (PWA)' : 'Preparando instalação...')}
                     </button>
                   )}`;

lines.splice(startLine - 1, endLine - startLine + 1, newContent);
fs.writeFileSync(path, lines.join('\n'));
console.log('Fixed AppRoot.jsx lines 5614-5631');

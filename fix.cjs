const fs = require('fs');
let content = fs.readFileSync('src/AppRoot.jsx', 'utf8');
// Use a more robust regex that covers common variations and non-ascii chars
content = content.replace(/POK.CRAFT IDLE 1\.10\.0.*?27\/04\/2026/g, 'POKÉCRAFT IDLE {APP_VERSION} • {APP_VERSION_DATE}');
fs.writeFileSync('src/AppRoot.jsx', content);
console.log('Fixed AppRoot.jsx');

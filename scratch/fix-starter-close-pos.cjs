const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

// Specific replacement for the starter modal close button style
c = c.replace("top: '12px',", "top: '16px',");
c = c.replace("right: '12px',", "right: '16px',");

fs.writeFileSync('src/AppRoot.jsx', c);
console.log('Success');

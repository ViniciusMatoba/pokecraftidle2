const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'routes.js');
const sinnohDataPath = path.join(__dirname, 'sinnoh_routes_data.js');

let routesContent = fs.readFileSync(routesPath, 'utf8');
const sinnohData = fs.readFileSync(sinnohDataPath, 'utf8');

const marker = '// ❄️ SINNOH REGION ❄️';
const endMarker = '};';

const startIndex = routesContent.indexOf(marker);
if (startIndex === -1) {
  console.error('Marker not found!');
  process.exit(1);
}

const header = routesContent.substring(0, startIndex + marker.length);
// Find the closing brace of the ROUTES object, which should be the very last }; in the file before any other exports if any
// But in this file, ROUTES is the main export and it ends with };
const footer = '\n' + sinnohData + '\n};';

const finalContent = header + footer;

fs.writeFileSync(routesPath, finalContent);
console.log('Successfully merged Sinnoh routes!');

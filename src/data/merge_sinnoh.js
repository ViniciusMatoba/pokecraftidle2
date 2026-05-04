const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'routes.js');
const sinnohDataPath = path.join(__dirname, 'sinnoh_routes_data.js');

let routesContent = fs.readFileSync(routesPath, 'utf8');
const sinnohData = fs.readFileSync(sinnohDataPath, 'utf8');

const marker = '// ❄️ SINNOH REGION ❄️';
const endMarker = '};'; // End of the ROUTES object

const parts = routesContent.split(marker);
if (parts.length < 2) {
  console.error('Marker not found!');
  process.exit(1);
}

// Find the last closing brace and semicolon of the file
const lastBraceIndex = routesContent.lastIndexOf('};');
const header = routesContent.substring(0, routesContent.indexOf(marker) + marker.length);
const footer = '\n' + sinnohData + '\n};';

const finalContent = header + footer;

fs.writeFileSync(routesPath, finalContent);
console.log('Successfully merged Sinnoh routes!');

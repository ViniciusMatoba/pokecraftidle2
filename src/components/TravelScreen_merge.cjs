const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'TravelScreen.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Sinnoh unlock logic
content = content.replace(
  "const hoennUnlocked = kantoChampion || hoennStarted || worldFlags.includes('johto_champion');",
  "const hoennUnlocked = kantoChampion || hoennStarted || worldFlags.includes('johto_champion');\n  const sinnohStarted = worldFlags.includes('sinnoh_started');\n  const sinnohUnlocked = worldFlags.includes('hoenn_champion') || sinnohStarted;"
);

// 2. Update visibleRouteEntries filter
content = content.replace(
  "if (routeRegionTab === 'hoenn' && route._region.id !== 'hoenn') return false;",
  "if (routeRegionTab === 'hoenn' && route._region.id !== 'hoenn') return false;\n      if (routeRegionTab === 'sinnoh' && route._region.id !== 'sinnoh') return false;"
);

// 3. Update useEffect for redirection
content = content.replace(
  "if (!hoennUnlocked && routeRegionTab === 'hoenn') setRouteRegionTab('kanto');",
  "if (!hoennUnlocked && routeRegionTab === 'hoenn') setRouteRegionTab('kanto');\n    if (!sinnohUnlocked && routeRegionTab === 'sinnoh') setRouteRegionTab('kanto');"
);

// 4. Update formatRequirement
content = content.replace(
  "hoenn_champion: 'Vencer a Liga de Hoenn'",
  "hoenn_champion: 'Vencer a Liga de Hoenn',\n      'sinnoh_started': 'Chegar a Sinnoh',\n      'coal_badge': 'Vencer Ginasio de Oreburgh',\n      'forest_badge': 'Vencer Ginasio de Eterna',\n      'cobble_badge': 'Vencer Ginasio de Veilstone',\n      'fen_badge': 'Vencer Ginasio de Pastoria',\n      'relic_badge': 'Vencer Ginasio de Hearthome',\n      'mine_badge': 'Vencer Ginasio de Canalave',\n      'icicle_badge': 'Vencer Ginasio de Snowpoint',\n      'beacon_badge': 'Vencer Ginasio de Sunyshore',\n      'sinnoh_champion': 'Vencer a Liga de Sinnoh'"
);

// 5. Update region tabs UI
content = content.replace(
  "{ id: 'hoenn', label: 'Hoenn' },",
  "{ id: 'hoenn', label: 'Hoenn' },\n               { id: 'sinnoh', label: 'Sinnoh' },"
);

content = content.replace(
  "if (tab.id === 'hoenn') return hoennUnlocked;",
  "if (tab.id === 'hoenn') return hoennUnlocked;\n               if (tab.id === 'sinnoh') return sinnohUnlocked;"
);

// Fix grid columns for 4 tabs
content = content.replace('grid-cols-3', 'grid-cols-2 md:grid-cols-4');

fs.writeFileSync(filePath, content);
console.log('Successfully updated TravelScreen.jsx for Sinnoh!');

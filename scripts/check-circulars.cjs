const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function getFiles(dir, allFiles = []) {
  if (!fs.existsSync(dir)) return allFiles;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, allFiles);
    } else if (name.endsWith('.js') || name.endsWith('.jsx')) {
      allFiles.push(name);
    }
  }
  return allFiles;
}

const allFiles = getFiles(srcDir);
const graph = {};

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(srcDir, file).replace(/\\/g, '/');
  graph[relPath] = [];
  
  // Basic regex for imports
  const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let target = match[1];
    if (target.startsWith('.')) {
      const absoluteTarget = path.resolve(path.dirname(file), target);
      let targetRel = path.relative(srcDir, absoluteTarget).replace(/\\/g, '/');
      
      // Try adding extensions if not present
      if (!targetRel.endsWith('.js') && !targetRel.endsWith('.jsx')) {
        if (fs.existsSync(absoluteTarget + '.js')) targetRel += '.js';
        else if (fs.existsSync(absoluteTarget + '.jsx')) targetRel += '.jsx';
        else if (fs.existsSync(path.join(absoluteTarget, 'index.js'))) targetRel += '/index.js';
        else if (fs.existsSync(path.join(absoluteTarget, 'index.jsx'))) targetRel += '/index.jsx';
      }
      graph[relPath].push(targetRel);
    }
  }
});

function findCycle(node, visited = new Set(), stack = new Set()) {
  visited.add(node);
  stack.add(node);
  
  for (const neighbor of (graph[node] || [])) {
    if (!visited.has(neighbor)) {
      const cycle = findCycle(neighbor, visited, stack);
      if (cycle) return [node, ...cycle];
    } else if (stack.has(neighbor)) {
      return [node, neighbor];
    }
  }
  
  stack.delete(node);
  return null;
}

console.log('🔍 Checking for circular dependencies in /src...');
let hasCycles = false;
const visited = new Set();
for (const node in graph) {
  if (!visited.has(node)) {
    const cycle = findCycle(node, visited);
    if (cycle) {
      console.error('❌ Circular dependency found:', cycle.join(' -> '));
      hasCycles = true;
      break;
    }
  }
}

if (!hasCycles) {
  console.log('✅ No circular dependencies found!');
  process.exit(0);
} else {
  process.exit(1);
}

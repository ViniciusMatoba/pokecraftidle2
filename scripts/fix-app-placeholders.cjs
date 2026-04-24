const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
    { m: '<V', c: '🔋' },
    { m: '<J', c: '🍊' },
    { m: '<?', c: '🌿' },
    { m: '<0', c: '🌰' },
    { m: '<R', c: '🍒' },
    { m: '<Q', c: '🍑' },
    { m: '<C', c: '🧊' },
    { m: '<K', c: '🍐' },
    { m: '<N', c: '🍅' },
    { m: '< ', c: '🌙' },
    { m: '>d', c: '🥤' },
    { m: '>[', c: '🥛' },
    { m: '>J', c: '👊' },
    { m: '=5', c: '🔵' },
    { m: '=%', c: '🔥' },
    { m: '={', c: '👻' },
    { m: 'D ', c: '❄️' }
];

const filePath = path.join(__dirname, '..', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

for (const r of REPLACEMENTS) {
    // Only replace if it's NOT inside a tag
    // For simplicity, we just split and join, but we check for common patterns
    content = content.split(`>${r.m}</span>`).join(`>${r.c}</span>`);
    content = content.split(`>${r.m} </span>`).join(`>${r.c} </span>`);
    content = content.split(`'${r.m}'`).join(`'${r.c}'`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('App.jsx Icon Placeholders Fixed.');

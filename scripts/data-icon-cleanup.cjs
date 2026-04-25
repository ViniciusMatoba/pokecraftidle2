const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'src/data');

fs.readdirSync(dataDir).forEach(f => {
    if (f.endsWith('.js')) {
        const filePath = path.join(dataDir, f);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // Fix icon: 'X'' pattern (extra quote)
        const regex1 = /icon:\s*'(.+?)''/g;
        if (regex1.test(content)) {
            content = content.replace(regex1, "icon: '$1'");
            changed = true;
        }

        // Fix icon: 'X'Y pattern (mangled extra character after quote)
        const regex2 = /icon:\s*'(.+?)'([^,;\s}]+)/g;
        if (regex2.test(content)) {
            content = content.replace(regex2, (match, p1, p2) => {
                console.log(`Fixing mangled icon in ${f}: ${match} -> icon: '${p1}'`);
                return `icon: '${p1}'`;
            });
            changed = true;
        }
        
        // Specific fix for expeditions line break error
        if (content.includes("icon: '🌊'\n',")) {
            content = content.replace("icon: '🌊'\n',", "icon: '🌊',");
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Cleaned up icons in ${f}`);
        }
    }
});

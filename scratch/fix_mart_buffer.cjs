const fs = require('fs');
const buf = fs.readFileSync('src/AppRoot.jsx');
const search = Buffer.from('Â í‚Âª', 'utf8');
const replace = Buffer.from('🛍️', 'utf8');

let pos = buf.indexOf(search);
if (pos !== -1) {
    const newBuf = Buffer.concat([
        buf.slice(0, pos),
        replace,
        buf.slice(pos + search.length)
    ]);
    fs.writeFileSync('src/AppRoot.jsx', newBuf);
    console.log('Fixed Mart icon via Buffer');
} else {
    console.log('Search string not found in Buffer');
}

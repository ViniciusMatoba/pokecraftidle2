const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'src', 'AppRoot.jsx');
let buffer = fs.readFileSync(target);

const MAPPINGS = [
    { m: Buffer.from([0xc3, 0xa2, 0xc3, 0x85, 0xc2, 0x93, 0xe2, 0x80, 0xa2]), c: '✖' }, // âÅ“•
    { m: Buffer.from([0xc3, 0xad, 0xc2, 0x81]), c: 'Á' }, // í gua
    { m: Buffer.from([0xc3, 0xad, 0x20]), c: 'Á ' },     // fallback
    { m: Buffer.from([0x2020202020202020202020202020202020202020202020202020616c743d22c3adc2816775612046726573636122], 'hex'), c: '                          alt="Água Fresca"' },
    { m: Buffer.from([0xc3, 0x82, 0xc2, 0xa0]), c: ' ' }, // non breaking space junk
    { m: Buffer.from([0xe2, 0x80, 0xa0]), c: '👤' }, // trainer icon junk
];

MAPPINGS.forEach(p => {
    let index = buffer.indexOf(p.m);
    while (index !== -1) {
        let replacement = Buffer.from(p.c);
        let newBuffer = Buffer.alloc(buffer.length - p.m.length + replacement.length);
        buffer.copy(newBuffer, 0, 0, index);
        replacement.copy(newBuffer, index);
        buffer.copy(newBuffer, index + replacement.length, index + p.m.length);
        buffer = newBuffer;
        index = buffer.indexOf(p.m, index + replacement.length);
    }
});

fs.writeFileSync(target, buffer);
console.log('Final byte-level sanitization complete.');

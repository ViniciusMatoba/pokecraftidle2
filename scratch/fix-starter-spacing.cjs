const fs = require('fs');
let c = fs.readFileSync('src/AppRoot.jsx', 'utf8');

c = c.replace(/\r\n/g, '\n');

// 1. Container inferior
c = c.replace('<div className="p-10 pt-20">', `<div style={{
  padding: '20px 24px 28px 24px',
  background: 'white',
  borderRadius: '0 0 24px 24px',
}}>`);

// 2. Título (Regex broad to catch the whole h2)
const h2Regex = /<h2\s*className="font-black uppercase italic text-center w-full px-2"[\s\S]*?\{previewStarter\.name\}\s*<\/h2>/;
const h2Replacement = `<h2 style={{
  fontSize: '24px',
  fontWeight: 900,
  fontStyle: 'italic',
  textTransform: 'uppercase',
  textAlign: 'center',
  padding: '0 40px',
  wordBreak: 'break-word',
}}>
  {previewStarter.name}
</h2>`;
c = c.replace(h2Regex, h2Replacement);

// 3. Grid
c = c.replace('<div className="grid grid-cols-2 gap-8">', `<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  padding: '0 4px',
  marginTop: '12px',
}}>`);

// 4. Atributos Labels & Values
c = c.replace('<span className="text-[10px] font-black text-slate-400 w-10">{s.label}</span>', `<span style={{
  fontSize: '11px',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '40px'
}}>{s.label}</span>`);

// 5. Ataques Labels
c = c.replace('<span className="text-[10px] font-black uppercase text-slate-700">{m.name}</span>', `<span style={{
  fontSize: '11px',
  fontWeight: 700,
  color: '#1e293b',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}}>{m.name}</span>`);

fs.writeFileSync('src/AppRoot.jsx', c);
console.log('Success');

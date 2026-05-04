const fs = require('fs');
let content = fs.readFileSync('src/components/TravelScreen.jsx', 'utf8');

// Fix close button
const oldBtn = `<button 
                onClick={() => setSelectedRoute(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-30"
              > </button>`;

// Using a regex to be safe about spaces
content = content.replace(
    /<button\s+onClick=\{\(\) => setSelectedRoute\(null\)\}\s+className="absolute top-4 right-4 w-10 h-10 bg-white\/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-30"\s*>\s+<\/button>/,
    `<button 
                onClick={() => setSelectedRoute(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-30 text-slate-800 font-black text-xl"
              >✖</button>`
);

fs.writeFileSync('src/components/TravelScreen.jsx', content);
console.log('Success');

const fs = require('fs');
const filePath = 'src/AppRoot.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix Mart Icon and Overlap
// Search: <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">Â í‚Âª</div>
// Search: <div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm">
const martIconSearch = /<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">[\s\S]*?<\/div>/;
const martIconReplace = '<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">🛍️</div>';

content = content.replace(martIconSearch, martIconReplace);

// 2. Fix Forge Icon and Overlap
const forgeIconSearch = /<div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">[\s\S]*?<\/div>/;
const forgeIconReplace = '<div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">⚒️</div>';

content = content.replace(forgeIconSearch, forgeIconReplace);

// 3. Fix Overlap by adding mr-16 to currency containers inside activeBuildingModal
// There are multiple instances of this currency block.
const currencyBlockSearch = /<div className="bg-amber-50 border-2 border-amber-200 px-3 py-1\.5 rounded-xl font-black text-amber-700 text-sm">/g;
const currencyBlockReplace = '<div className="bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-xl font-black text-amber-700 text-sm mr-16">';

content = content.replace(currencyBlockSearch, currencyBlockReplace);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed icons and currency overlap in Mart/Forge modals');

const fs = require('fs');
const path = 'src/AppRoot.jsx';
let content = fs.readFileSync(path, 'utf8');

const target = `         <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
                         <div
                className="px-5 py-4 flex items-center justify-between gap-3 shrink-0"
                style={{
                  background:
                    activeBuildingModal === 'mart' ? '#2563eb' :
                    activeBuildingModal === 'forge' ? '#475569' :
                    '#1e293b'
                }}
              >`;

const replacement = `         <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
            <div 
               className="modal-panel-mobile bg-white shadow-2xl flex flex-col relative animate-slideInUp overflow-hidden"
               style={{ 
                 borderBottom: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`,
                 borderLeft: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`,
                 borderRight: \`8px solid \${activeBuildingModal === 'mart' ? '#2563eb' : '#475569'}\`
               }}
            >
               <div
                 className="px-5 py-4 flex items-center justify-between gap-3 shrink-0"
                 style={{
                   background:
                     activeBuildingModal === 'mart' ? '#2563eb' :
                     activeBuildingModal === 'forge' ? '#475569' :
                     '#1e293b'
                 }}
               >`;

// Since the target might have different whitespace, let's use a more flexible check
const startToken = "bg-slate-900/90 backdrop-blur-md animate-fadeIn\">";
const endToken = "'#1e293b'";

const startIdx = content.indexOf(startToken);
const endIdx = content.indexOf(endToken, startIdx) + endToken.length;

if (startIdx !== -1 && endIdx !== -1) {
    const fullStart = content.lastIndexOf("<div", startIdx);
    const fullEnd = content.indexOf(">", endIdx) + 1;
    content = content.substring(0, fullStart) + replacement + content.substring(fullEnd);
    fs.writeFileSync(path, content);
    console.log('Successfully fixed AppRoot.jsx modal structure');
} else {
    console.log('Failed to find target block');
}

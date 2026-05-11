const fs = require('fs');
const path = 'c:/Users/Usuario/Desktop/pokecraftidle2-clean/src/components/ExpeditionsScreen.jsx';
let content = fs.readFileSync(path, 'utf-8');

const reportModalCode = `
const ExpeditionReportModal = ({ report, onClose }) => {
  if (!report) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-[400px] bg-slate-900 rounded-[2rem] border border-white/20 shadow-2xl animate-bounceIn overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 pb-4 bg-gradient-to-b from-blue-900/50 to-slate-900 text-center border-b border-white/10 shrink-0">
          <p className="text-5xl mb-2">{report.biomeIcon}</p>
          <h2 className="text-white font-black uppercase tracking-tighter text-2xl italic leading-none">
            {report.biomeName}
          </h2>
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-2">
            Relatório da Expedição
          </p>
        </div>

        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4 custom-scrollbar">
          {/* Drops */}
          {Object.keys(report.drops || {}).length > 0 && (
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3 text-center">Itens Obtidos</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {Object.entries(report.drops).map(([item, qty]) => (
                  <div key={item} className="bg-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
                    <span className="text-white text-xs font-bold capitalize">{item.replace(/_/g, ' ')}</span>
                    <span className="text-yellow-400 font-black text-xs">x{qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pokémon */}
          <div className="flex flex-col gap-3">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest text-center mt-2">Equipe</p>
            {report.pokemonResults.map((r, idx) => {
              const leveledUp = r.levelsGained > 0;
              return (
                <div key={r.id + '-' + idx} className={\`rounded-2xl p-4 border relative overflow-hidden \${
                  leveledUp ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30' : 'bg-white/5 border-white/10'
                }\`}>
                  <div className="flex items-center gap-4">
                    <img
                      src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/\${r.isShiny ? 'shiny/' : ''}\${r.id}.png\`}
                      alt={r.name}
                      className="w-16 h-16 object-contain drop-shadow-lg"
                    />
                    <div className="flex-1">
                      <p className="text-white font-black text-sm">{r.name}</p>
                      
                      {leveledUp ? (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-white/50 text-xs font-bold line-through">Nv. {r.initialLevel}</span>
                          <span className="text-green-400 text-sm font-black">Nv. {r.finalLevel}</span>
                          <span className="text-[9px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded uppercase font-black ml-auto">
                            +{r.levelsGained} Níveis
                          </span>
                        </div>
                      ) : (
                        <p className="text-white/50 text-xs mt-1 font-bold">Nv. {r.initialLevel}</p>
                      )}
                      
                      <p className="text-blue-300 text-[10px] font-black mt-1">+{r.xpGained} XP</p>
                    </div>
                  </div>

                  {/* Moves aprendidos */}
                  {r.moveEvents?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5">
                      <p className="text-white/40 text-[9px] font-black uppercase">Golpes Aprendidos</p>
                      {r.moveEvents.map((evt, i) => (
                        <div key={i} className="text-[10px] text-yellow-300 font-bold">
                          <span className="text-white/50 mr-1">Nv.{evt.level}</span>
                          {evt.moves.join(', ')}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-black text-sm uppercase py-4 rounded-2xl hover:bg-blue-500 active:scale-95 transition-all shadow-xl"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
`;

const propsSearch = `const ExpeditionsScreen = ({
  gameState,
  onClose,
  onStartExpedition,
  onClaimExpedition,
}) => {`;

const propsReplace = `const ExpeditionsScreen = ({
  gameState,
  onClose,
  onStartExpedition,
  onClaimExpedition,
  expeditionReport,
  onCloseReport,
}) => {`;

const renderSearch = `    <div className="absolute inset-0 z-[110] flex flex-col bg-slate-950 animate-fadeIn">
      {alertReq && (
        <ExpeditionAlertModal 
          req={alertReq} 
          onClose={() => setAlertReq(null)} 
        />
      )}`;

const renderReplace = `    <div className="absolute inset-0 z-[110] flex flex-col bg-slate-950 animate-fadeIn">
      {expeditionReport && (
        <ExpeditionReportModal
          report={expeditionReport}
          onClose={onCloseReport}
        />
      )}

      {alertReq && (
        <ExpeditionAlertModal 
          req={alertReq} 
          onClose={() => setAlertReq(null)} 
        />
      )}`;

const cleanContent = (str) => str.replace(/\r\n/g, '\n');

content = cleanContent(content);

if (content.includes(cleanContent(propsSearch))) {
    content = content.replace(cleanContent(propsSearch), cleanContent(propsReplace));
    content = content.replace(cleanContent(renderSearch), cleanContent(renderReplace));
    content = content.replace('const ExpeditionsScreen = ({', reportModalCode + '\nconst ExpeditionsScreen = ({');
    fs.writeFileSync(path, content, 'utf-8');
    console.log('Replaced successfully');
} else {
    console.log('Not found');
}

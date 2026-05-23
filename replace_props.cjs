const fs = require('fs');
const path = 'c:/Users/Usuario/Desktop/pokecraftidle2-clean/src/AppRoot.jsx';
let content = fs.readFileSync(path, 'utf-8');

const search = `              <ExpeditionsScreen
                gameState={gameState}
                onClose={() => setShowExpeditions(false)}
                onStartExpedition={(biomeId, team) => {
                  handleStartExpedition(biomeId, team);
                  setShowExpeditions(false);
                }}
                onClaimExpedition={(biomeId) => handleClaimExpedition(biomeId)}
              />`;

const replace = `              <ExpeditionsScreen
                gameState={gameState}
                expeditionReport={expeditionReport}
                onCloseReport={() => setExpeditionReport(null)}
                onClose={() => setShowExpeditions(false)}
                onStartExpedition={(biomeId, team) => {
                  handleStartExpedition(biomeId, team);
                  setShowExpeditions(false);
                }}
                onClaimExpedition={(biomeId) => handleClaimExpedition(biomeId)}
              />`;

const cleanContent = (str) => str.replace(/\r\n/g, '\n');

content = cleanContent(content);
const searchClean = cleanContent(search);

if (content.includes(searchClean)) {
    content = content.replaceAll(searchClean, cleanContent(replace));
    fs.writeFileSync(path, content, 'utf-8');
    console.log('Replaced successfully');
} else {
    console.log('Not found');
}

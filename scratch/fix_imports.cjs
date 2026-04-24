const fs = require('fs');
const filePath = 'src/AppRoot.jsx';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes("import QuestModal from './components/QuestModal';")) {
    content = content.replace(
        "import { MoveCategoryIcon, StatusBadges, QuickInventory, TrainerCard } from './components/CommonUI';",
        "import QuestModal from './components/QuestModal';\nimport { MoveCategoryIcon, StatusBadges, QuickInventory, TrainerCard } from './components/CommonUI';"
    );
    console.log('QuestModal import added');
}

fs.writeFileSync(filePath, content, 'utf8');

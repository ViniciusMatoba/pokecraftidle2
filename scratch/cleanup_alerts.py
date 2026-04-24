import sys
import re

path = 'src/AppRoot.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace triggerSave alert
# Line 490
pattern1 = r'if \(!user\) \{\n\s+alert\(".*?"\);\n\s+return;\n\s+\}'
replacement1 = """if (!user) {
      showConfirm({
        title: 'Acesso Restrito',
        message: 'Você precisa estar logado para salvar seu progresso na nuvem!',
        onConfirm: closeConfirm
      });
      return;
    }"""
content = re.sub(pattern1, replacement1, content)

# Replace top nav confirm
# Line 3503
pattern2 = r'window\.confirm\(\'Deseja realmente sair\? Seu progresso foi salvo\.\'\)'
# Replacement for the whole button click handler
replacement2 = """showConfirm({
                    title: 'Voltar ao Início',
                    message: 'Deseja realmente sair? Seu progresso foi salvo automaticamente.',
                    onConfirm: () => {
                      setCurrentView('landing');
                      closeConfirm();
                    }
                  })"""

# This one is tricky because it's inside a complex line.
# Let's try a direct string replacement for the inner part.
content = content.replace("if(window.confirm('Deseja realmente sair? Seu progresso foi salvo.')) setCurrentView('landing');", replacement2)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done replacing alerts.")

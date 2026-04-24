path = 'dist/assets/index-TFCHR75F.js'
pos = 173021
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
    start = max(0, pos - 200)
    end = min(len(content), pos + 200)
    print(f'Contexto:\n{content[start:end]}')

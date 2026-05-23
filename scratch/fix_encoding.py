import os

path = 'src/AppRoot.jsx'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'const statusNames = { burn:' in line:
        lines[i] = "            const statusNames = { burn:'🔥 Queimadura', poison:'🧪 Veneno', toxic:'🧪 Veneno Grave', sleep:'💤 Sono', paralyze:'⚡ Paralisia', confuse:'💫 Confusão', freeze:'❄️ Congelado' };\n"
        print(f"Fixed line {i+1}")
        break

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

import os

file_path = r'c:\Users\t31229\Desktop\pokecraftidle2-master\pokecraftidle2-master\src\AppRoot.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if '  }, []);' in line and len(new_lines) < 700: # Target around line 695
        new_lines.append('\n')
        new_lines.append('  const teamSpriteSignature = useMemo(() => (\n')
        new_lines.append('    (gameState.team || [])\n')
        new_lines.append("      .map(p => `${p.id}:${p.isShiny ? 's' : 'n'}`)\n")
        new_lines.append("      .join('|')\n")
        new_lines.append('  ), [gameState.team]);\n')
        new_lines.append('\n')
        new_lines.append('  const validateTeamAccess = useCallback((pokemon, targetRegion) => {\n')
        new_lines.append('    if (!pokemon) return false;\n')
        new_lines.append('    \n')
        new_lines.append('    const worldFlags = gameState.worldFlags || [];\n')
        new_lines.append("    const targetKey = (targetRegion || '').toLowerCase();\n")
        new_lines.append('    \n')
        new_lines.append('    const isChampion = worldFlags.includes(`region_champion_${targetKey}`) || \n')
        new_lines.append("                      (targetKey === 'kanto' && worldFlags.includes('champion')) ||\n")
        new_lines.append("                      (targetKey === 'johto' && worldFlags.includes('johto_champion'));\n")
        new_lines.append('    \n')
        new_lines.append('    if (isChampion) return true;\n')
        new_lines.append('\n')
        new_lines.append('    const REGION_ORDER = { kanto: 1, johto: 2, hoenn: 3 };\n')
        new_lines.append('    const id = Number(pokemon.id);\n')
        new_lines.append('    const pokemonGen = id <= 151 ? 1 : id <= 251 ? 2 : 3;\n')
        new_lines.append('    \n')
        new_lines.append("    const pRegion = (pokemon.capturedRegion || '').toLowerCase();\n")
        new_lines.append("    const originRegion = pRegion || (pokemonGen === 1 ? 'kanto' : pokemonGen === 2 ? 'johto' : 'hoenn');\n")
        new_lines.append('    \n')
        new_lines.append('    if (originRegion !== targetKey) {\n')
        new_lines.append('      const originLevel = REGION_ORDER[originRegion] || 1;\n')
        new_lines.append('      const targetLevel = REGION_ORDER[targetKey] || 1;\n')
        new_lines.append('      if (originLevel < targetLevel) return false;\n')
        new_lines.append('    }\n')
        new_lines.append('\n')
        new_lines.append('    return true;\n')
        new_lines.append('  }, [gameState.worldFlags]);\n')
        new_lines.append('\n')

# Check if switchRegion is missing
if not any('const switchRegion = useCallback((newRegion) => {' in l for l in lines):
    # It was deleted by previous failed edit
    new_lines.append('  const switchRegion = useCallback((newRegion) => {\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Patch applied successfully")

import sys
import os

path = 'src/AppRoot.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the strings exactly as they appear in the file (including those weird chars)
t1 = """          if (false) {
            newInventory.items = { ...newInventory.items, pokeballs: (newInventory.items.pokeballs || 0) + 10 };
            addLog('ÃƒÂ°Ã‚ÂŸÃ‚ÂŽÃ‚Â  Carvalho: "Ã“timo trabalho! Tome estas 10 PokÃ©bolas!"', 'drop');
            questUpdate = { worldFlags: prev.worldFlags.filter(f => f !== 'quest_capture_active').concat(['quest_capture_done']) };
          }"""

t2 = """                if (false) {
                  newInventoryItems.pokeballs = (newInventoryItems.pokeballs || 0) + 10;
                  addLog('ðŸ”  Carvalho: "Ã“timo trabalho! Tome estas 10 PokÃ©bolas!"', 'drop');
                  questUpdate = { worldFlags: prev.worldFlags.filter(f => f !== 'quest_capture_active').concat(['quest_capture_done']) };
                }"""

# Try to find and replace
if t1 in content:
    print("Found t1, replacing...")
    content = content.replace(t1, '')
else:
    print("t1 not found exactly, trying partial match...")
    # fallback: match start and end
    import re
    content = re.sub(r' +if \(false\) \{.*?Carvalho: ".*?".*?\n +\}', '', content, flags=re.DOTALL)

if t2 in content:
    print("Found t2, replacing...")
    content = content.replace(t2, '')
else:
    print("t2 not found exactly, trying partial match...")
    # fallback: match start and end
    # (regex above should handle both if written correctly, but let's be safe)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done.")

import json, os

content = open('src/data/pokedex.js', encoding='utf-8').read()
json_str = content.replace('export const POKEDEX = ', '', 1).rstrip().rstrip(';')
data = json.loads(json_str)

lines = ['export const POKEDEX = {']

for i, (k, p) in enumerate(sorted(data.items(), key=lambda x: int(x[0]))):
    learnset = p.get('learnset', [])
    ls_str = '[' + ','.join(
        '{' + ','.join(f'{kk}:{json.dumps(vv)}' for kk, vv in e.items()) + '}'
        for e in learnset
    ) + ']'

    evo = p.get('evolution')
    evo_str = json.dumps(evo) if evo else 'null'

    types = p.get('types', [p.get('type', 'Normal')])
    abilities = p.get('abilities', [])

    comma = ',' if i < len(data) - 1 else ''

    line = (
        f'  {k}:{{id:{p["id"]},name:{json.dumps(p["name"])},type:{json.dumps(p.get("type","Normal"))},'
        f'types:{json.dumps(types)},'
        f'hp:{p["hp"]},maxHp:{p.get("maxHp",p["hp"])},'
        f'attack:{p["attack"]},defense:{p["defense"]},'
        f'spAtk:{p["spAtk"]},spDef:{p["spDef"]},speed:{p["speed"]},'
        f'baseExp:{p.get("baseExp",50)},'
        f'drop:{json.dumps(p.get("drop","apricorn"))},dropChance:{p.get("dropChance",0.3)},'
        f'abilities:{json.dumps(abilities)},'
        f'learnset:{ls_str},'
        f'evolution:{evo_str}}}{comma}'
    )
    lines.append(line)

lines.append('};')

output = '\n'.join(lines)
with open('src/data/pokedex.js', 'w', encoding='utf-8') as f:
    f.write(output)
print(f'Pronto: {len(data)} pokémon, {len(output)//1024}KB, {output.count(chr(10))+1} linhas')

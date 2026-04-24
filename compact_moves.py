import json, os

path = 'src/data/moves.js'
content = open(path, encoding='utf-8').read()
json_str = content.replace('export const MOVES = ', '', 1).rstrip().rstrip(';')
data = json.loads(json_str)

lines = ['export const MOVES = {']
items = list(data.items())
for i, (k, m) in enumerate(items):
    comma = ',' if i < len(items)-1 else ''
    line = (
        f'  "{k}":{{id:{m.get("id",0)},name:{json.dumps(m.get("name",""))},'
        f'type:{json.dumps(m.get("type","Normal"))},category:{json.dumps(m.get("category","Physical"))},'
        f'power:{m.get("power",0)},accuracy:{m.get("accuracy",100)},'
        f'pp:{m.get("pp",10)},priority:{m.get("priority",0)},'
        f'effect:{json.dumps(m.get("effect",""))}}}{comma}'
    )
    lines.append(line)
lines.append('};')
open(path, 'w', encoding='utf-8').write('\n'.join(lines))
print('Pronto:', len(data), 'golpes compactados.')

"""Parse the main table of 'List of Real Madrid CF players' (100+ appearances)."""
import json, re, sys
src = open('research/wiki/List_of_Real_Madrid_CF_players.wiki', encoding='utf-8').read()
start = src.index('{| class="wikitable plainrowheaders sortable"')
table = src[start:src.index('\n|}', start)]
rows = []
for chunk in table.split('\n|-')[1:]:
    lines = [l for l in chunk.strip().split('\n') if l.startswith('|') or l.startswith('!')]
    text = '\n'.join(lines)
    m = re.search(r'\{\{flagicon\|(\w+)\}\}\s*(?:\'\'\')?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]', text)
    if not m:
        continue
    cells = [c.strip() for c in re.split(r'\|\||\n\|', text)]
    nums = []
    for c in cells:
        c2 = re.sub(r"<[^>]+>|'''|\{\{ref label.*?\}\}|style=[^|]*\||bgcolor=\w+\|", '', c).strip(' |')
        if re.fullmatch(r'\d+', c2): nums.append(int(c2))
    years = re.findall(r'(\d{4})[–-](\d{4}|present|Present)?', text)
    pos = re.search(r'\|\s*(GK|DF|MF|FW)\s*\|', text)
    rows.append({'flag': m.group(1), 'article': m.group(2), 'name': m.group(3) or m.group(2),
                 'pos': pos.group(1) if pos else None, 'years': years[0] if years else None,
                 'apps': nums[0] if nums else None, 'goals': nums[1] if len(nums) > 1 else None,
                 'assists': nums[2] if len(nums) > 2 else None, 'current': "'''[[" in text})
json.dump(rows, open('research/players_100.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(rows))
for r in rows:
    if r['article'] in sys.argv[1:] or not sys.argv[1:] and r['years'] and int(r['years'][0]) >= 1990:
        print(r['name'], r['pos'], r['years'], r['apps'], r['goals'], r['assists'], 'CURRENT' if r['current'] else '')

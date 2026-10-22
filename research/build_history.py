"""Build js/history.js from the Wikipedia source text saved in research/wiki/.

    python3 research/build_history.py

Produces:
  RM_ARCHIVE         every player who played at least one official game for
                     Madrid from 2000-01 on: years, apps, goals, assists
  RM_PROFILES        per-player facts from their article infobox (birth, height,
                     club history, national team) and their Real Madrid honours
  RM_SEASONS         2000-01 to 2026-27: coach, league finish, cup runs, top scorers
  RM_CURRENT_STATS   2026-27 appearances and goals per player, by competition
"""
import json
import os
import re
import unicodedata

HERE = os.path.dirname(__file__)
WIKI = os.path.join(HERE, 'wiki')
OUT = os.path.join(HERE, '..', 'js', 'history.js')
IDS = json.load(open(os.path.join(HERE, 'article_ids.json'), encoding='utf-8'))


def slug(title):
    return re.sub(r'[^A-Za-z0-9]+', '_', title).strip('_')


def read(title):
    path = os.path.join(WIKI, slug(title) + '.wiki')
    return open(path, encoding='utf-8').read() if os.path.exists(path) else None


def make_id(name):
    s = unicodedata.normalize('NFD', name).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def strip_refs(s):
    s = re.sub(r'<ref[^>]*/>', '', s)
    s = re.sub(r'<ref[^>]*>.*?</ref>', '', s, flags=re.S)
    return re.sub(r'<!--.*?-->', '', s, flags=re.S)


def clean(s):
    """Wikitext fragment -> plain text."""
    s = strip_refs(s or '')
    s = re.sub(r'\{\{(?:nowrap|small|nobr)\|([^{}]*)\}\}', r'\1', s, flags=re.I)
    s = re.sub(r'\{\{(?:flagicon|flag icon)[^{}]*\}\}', '', s, flags=re.I)
    s = re.sub(r'\{\{[^{}]*\}\}', '', s)
    s = re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', s)
    s = re.sub(r"'''?|<br\s*/?>|<[^>]+>", ' ', s)
    s = s.replace('&nbsp;', ' ')
    return re.sub(r'\s+', ' ', s).strip(' ,')


def template_block(text, name):
    m = re.search(r'\{\{\s*' + name, text, flags=re.I)
    if not m:
        return None
    depth, i = 0, m.start()
    while i < len(text):
        if text.startswith('{{', i):
            depth += 1
            i += 2
        elif text.startswith('}}', i):
            depth -= 1
            i += 2
            if depth == 0:
                return text[m.start():i]
        else:
            i += 1
    return None


def fields(block):
    """Top-level |key = value pairs of a template."""
    out, depth, cur = {}, 0, ''
    body = block[2:-2]
    parts = []
    i = 0
    while i < len(body):
        two = body[i:i + 2]
        if two in ('{{', '[['):
            depth += 1
            cur += two
            i += 2
            continue
        if two in ('}}', ']]'):
            depth -= 1
            cur += two
            i += 2
            continue
        if body[i] == '|' and depth == 0:
            parts.append(cur)
            cur = ''
        else:
            cur += body[i]
        i += 1
    parts.append(cur)
    for p in parts[1:]:
        if '=' in p:
            k, v = p.split('=', 1)
            out[k.strip().lower()] = v.strip()
    return out


MONTHS = 'January February March April May June July August September October November December'.split()


def birth_date(raw):
    m = re.search(r'\{\{\s*birth[ _]date(?: and age)?\s*\|([^}]*)\}\}', raw or '', flags=re.I)
    if not m:
        return clean(raw) or None
    nums = [p for p in m.group(1).split('|') if re.fullmatch(r'\s*\d+\s*', p)]
    if len(nums) >= 3:
        y, mo, d = (int(n) for n in nums[:3])
        return f'{MONTHS[mo - 1]} {d}, {y}'
    return None


def height(raw):
    raw = raw or ''
    m = re.search(r'\{\{\s*height\s*\|\s*m\s*=\s*([\d.]+)', raw, flags=re.I) or re.search(r'([12][.,]\d{2})\s*m', raw)
    return f'{float(m.group(1).replace(",", ".")):.2f} m' if m else None


def club_history(f, prefix=''):
    clubs = []
    for n in range(1, 40):
        club = f.get(f'{prefix}clubs{n}')
        if club is None:
            continue
        name = clean(club)
        loan = '(loan)' in name or '→' in club
        name = re.sub(r'\s*\(loan\)|→\s*', '', name).strip()
        entry = {'years': clean(f.get(f'{prefix}years{n}', '')), 'club': name}
        if not prefix:
            caps, goals = clean(f.get(f'caps{n}', '')), clean(f.get(f'goals{n}', ''))
            if caps.isdigit():
                entry['apps'] = int(caps)
            if re.fullmatch(r'\(?\d+\)?', goals):
                entry['goals'] = int(goals.strip('()'))
        if loan:
            entry['loan'] = True
        if name:
            clubs.append(entry)
    return clubs


def senior_national(f):
    best = None
    for n in range(1, 20):
        team = f.get(f'nationalteam{n}')
        if not team:
            continue
        name = clean(team)
        if re.search(r'U-?\d{2}|under|youth|Olympic| B$|amateur', name, flags=re.I):
            continue
        caps = clean(f.get(f'nationalcaps{n}', ''))
        goals = clean(f.get(f'nationalgoals{n}', '')).strip('()')
        best = {'team': name, 'years': clean(f.get(f'nationalyears{n}', '')),
                'caps': int(caps) if caps.isdigit() else None,
                'goals': int(goals) if goals.isdigit() else None}
    return best


def madrid_honours(text):
    m = re.search(r'==\s*Honours\s*==(.*?)(?:\n==[^=]|\Z)', text, flags=re.S)
    if not m:
        return []
    sec = m.group(1)
    # A club heading is a bold line or a ===subheading=== naming Real Madrid
    blocks = re.split(r"\n(?=(?:'''|===\s*))", '\n' + sec)
    out = []
    for b in blocks:
        head = b.strip().split('\n', 1)[0]
        if not re.search(r'Real Madrid(?! (?:Castilla|B|C|Juvenil))', clean(head)):
            continue
        for line in b.split('\n')[1:]:
            if not line.startswith('*'):
                continue
            line = clean(line.lstrip('*'))
            if ':' not in line:
                continue
            comp, seasons = line.split(':', 1)
            comp = comp.strip()
            if re.search(r'runner|second|third|finalist', comp, flags=re.I):
                continue
            yrs = [y.strip() for y in re.split(r',', seasons) if re.search(r'\d{4}', y)]
            if yrs:
                out.append({'competition': comp, 'seasons': yrs})
    return out


# ---------- archive (List of Real Madrid CF players) ----------

def build_archive():
    src = read('List of Real Madrid CF players')
    start = src.index('{| class="wikitable plainrowheaders sortable"')
    table = src[start:src.index('\n|}', start)]
    players = []
    for chunk in table.split('\n|-')[1:]:
        m = re.search(r"\{\{flagicon\|([^|}]+)(?:\|[^}]*)?\}\}\s*('''|'')?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", chunk)
        if not m or '||' not in chunk:
            continue
        cells = chunk.split('||')
        pos = re.search(r'\b(GK|DF|MF|FW)\b', cells[0] + '|' + cells[0])
        pos = re.search(r'\|\s*(GK|DF|MF|FW)\s*$', cells[0].strip()) or re.search(r'\b(GK|DF|MF|FW)\b', chunk)
        spans = re.sub(r'.*\|', '', cells[1].replace('<br />', ', ').replace('<br/>', ', ').replace('<br>', ', ')).strip()
        years = [int(y) for y in re.findall(r'\d{4}', spans)]
        if not years or (max(years) < 2000 and not re.search(r'–\s*$', spans)):
            continue
        nums = []
        for c in cells[2:]:
            c = re.sub(r"\{\{ref label.*?\}\}|<[^>]+>|'''|bgcolor=\w+\||style=[^|]*\|", '', c).strip(' |\n')
            if re.fullmatch(r'\d+', c):
                nums.append(int(c))
            elif c in ('—', '-', '–', ''):
                nums.append(None)
        nums = [n for n in nums if n is not None] if len([n for n in nums if n is not None]) >= 2 else nums
        article = m.group(3)
        name = m.group(4) or re.sub(r'\s*\(.*\)$', '', article)
        players.append({
            'id': IDS.get(article) or make_id(name),
            'name': name, 'article': article, 'code': m.group(1), 'pos': pos.group(1) if pos else None,
            'spans': re.sub(r'\s*,\s*', ', ', spans).replace('–,', '–').strip(', '),
            'apps': nums[0] if len(nums) > 0 else None,
            'goals': nums[1] if len(nums) > 1 else None,
            'assists': nums[2] if len(nums) > 2 else None,
            'current': m.group(2) == "'''",
        })
    return players


# ---------- profiles (player articles) ----------

def build_profiles(archive):
    titles = [p['article'] for p in archive] + list(IDS.keys())
    profiles = {}
    for title in dict.fromkeys(titles):
        text = read(title)
        if not text:
            continue
        pid = IDS.get(title) or next((p['id'] for p in archive if p['article'] == title), None)
        if not pid or pid in profiles:
            continue
        box = template_block(text, 'Infobox football biography')
        f = fields(box) if box else {}
        prof = {
            'fullName': clean(f.get('full_name', '')) or None,
            'birthDate': birth_date(f.get('birth_date')),
            'birthPlace': clean(f.get('birth_place', '')) or None,
            'height': height(f.get('height')),
            'position': clean(f.get('position', '')) or None,
            'youth': club_history(f, 'youth'),
            'clubs': club_history(f),
            'national': senior_national(f),
            'honours': madrid_honours(text),
            'source': title,
        }
        profiles[pid] = {k: v for k, v in prof.items() if v not in (None, [], {})}
    return profiles


# ---------- seasons ----------

def link_text(v):
    return clean(v).strip("' ")


def build_seasons():
    seasons = []
    for y in range(2000, 2027):
        label = f'{y}–{str(y + 1)[-2:]}'
        text = read(f'{label} Real Madrid CF season')
        if not text:
            continue
        f = fields(template_block(text, 'Infobox football club season'))
        managers = [clean(x) for x in re.split(r'<br\s*/?>', f.get('manager', '')) if clean(x) and not re.match(r"^\(|^''", x.strip())]
        managers = [m for m in managers if not re.match(r'^\(', m)]
        cups = []
        for n in range(1, 8):
            name, result = f.get(f'cup{n}'), f.get(f'cup{n} result')
            if name and result:
                cups.append({'name': clean(name), 'result': link_text(result)})
        def scorer(v):
            # "Name (30)", "Name (22 goals)" or "A<br>B (24 each)" for a shared lead
            names = [clean(x) for x in re.split(r'<br\s*/?>', v or '') if clean(x)]
            m = re.search(r'\((\d+)(?: goals| each)?\)', clean(v or ''))
            if not names or not m:
                return None
            names = [re.sub(r'\s*\(.*\)$', '', n).strip() for n in names]
            return {'name': ' & '.join(names), 'goals': int(m.group(1))}
        seasons.append({
            'season': label,
            'managers': managers,
            'league': link_text(f.get('league result', '')),
            'cups': cups,
            'leagueTopScorer': scorer(f.get('league topscorer')),
            'topScorer': scorer(f.get('season topscorer')),
            'inProgress': y == 2026,
        })
    return seasons


# ---------- current season ----------

def build_current(archive):
    text = read('2026–27 Real Madrid CF season')
    start = re.search(r'\{\{Efs start\|(.*)\}\}', text)
    comps = []
    if start:
        # split on | outside [[links]]
        comps = [clean(c) for c in re.split(r'\|(?![^\[]*\]\])', start.group(1))]
    stats = {}
    for m in re.finditer(r'\{\{Efs player2\|no=\s*(\d+)\s*\|pos=(\w+)\|nat=(\w+)\|name=\[\[([^\]|]+)(?:\|[^\]]*)?\]\]\s*((?:\|\d+)+)\}\}', text):
        article = m.group(4)
        nums = [int(x) for x in m.group(5).strip('|').split('|')]
        pid = IDS.get(article) or next((p['id'] for p in archive if p['article'] == article), make_id(article))
        by = [{'comp': comps[i] if i < len(comps) else f'Comp {i}', 'apps': nums[2 * i], 'goals': nums[2 * i + 1]} for i in range(len(nums) // 2)]
        stats[pid] = {'apps': sum(b['apps'] for b in by), 'goals': sum(b['goals'] for b in by), 'byComp': by}
    updated = re.search(r'\{\{Fb cs footer\|u=([^|}]+)', text)
    return stats, (updated.group(1).strip() if updated else None)


def main():
    archive = build_archive()
    profiles = build_profiles(archive)
    seasons = build_seasons()
    current, current_updated = build_current(archive)
    revision = re.search(r'revision (\S+)', read('List of Real Madrid CF players')).group(1)[:10]
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write('// Generated by research/build_history.py from Wikipedia (CC BY-SA 4.0). Do not edit by hand.\n')
        fh.write(f'// Player list revision {revision}; current-season table updated {current_updated}.\n\n')
        for name, value in [('RM_ARCHIVE', archive), ('RM_PROFILES', profiles), ('RM_SEASONS', seasons), ('RM_CURRENT_STATS', current)]:
            fh.write(f'const {name} = {json.dumps(value, ensure_ascii=False, separators=(",", ":"))};\n\n')
        photo_dir = os.path.join(HERE, '..', 'images', 'players')
        photo_ids = sorted(f[:-4] for f in os.listdir(photo_dir) if f.endswith('.jpg')
                           and os.path.exists(os.path.join(photo_dir, 'headshots', f)))
        credits_path = os.path.join(photo_dir, 'credits.json')
        credits = json.load(open(credits_path, encoding='utf-8')) if os.path.exists(credits_path) else {}
        credits = {k: {'artist': v['artist'], 'license': v['license'], 'page': v['page']} for k, v in credits.items()}
        fh.write(f'const RM_PHOTO_IDS = {json.dumps(photo_ids)};\n')
        fh.write(f'const RM_PHOTO_CREDITS = {json.dumps(credits, ensure_ascii=False, separators=(",", ":"))};\n\n')
        fh.write(f'const RM_ARCHIVE_UPDATED = {json.dumps(revision)};\nconst RM_CURRENT_STATS_UPDATED = {json.dumps(current_updated)};\n\n')
        fh.write("if (typeof module !== 'undefined' && module.exports) {\n  module.exports = { RM_ARCHIVE, RM_PROFILES, RM_SEASONS, RM_CURRENT_STATS, RM_ARCHIVE_UPDATED, RM_CURRENT_STATS_UPDATED, RM_PHOTO_IDS, RM_PHOTO_CREDITS };\n}\n")
    print(f'archive {len(archive)}, profiles {len(profiles)}, seasons {len(seasons)}, current {len(current)}')


if __name__ == '__main__':
    main()

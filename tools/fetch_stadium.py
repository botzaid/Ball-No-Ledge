"""Hero photo of the Santiago Bernabéu from Wikimedia Commons.

With no file chosen in tools/stadium.json, lists large, freely licensed,
landscape photos of the stadium into research/stadium/candidates.json plus a
numbered contact sheet (research/stadium/contact.jpg) to pick from.
With a file chosen, downloads it at 3840 px and 1920 px wide into
images/stadium/ and records the author and licence in images/stadium/credit.json.

    pip install requests pillow
    python3 tools/fetch_stadium.py
"""
import html
import io
import json
import os
import re
import time

import requests
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(__file__), '..')
CONFIG = os.path.join(ROOT, 'tools', 'stadium.json')
OUT = os.path.join(ROOT, 'images', 'stadium')
RESEARCH = os.path.join(ROOT, 'research', 'stadium')
API = 'https://commons.wikimedia.org/w/api.php'

session = requests.Session()
session.headers['User-Agent'] = 'BallNoLedge/1.0 (https://github.com/botzaid/Ball-No-Ledge; fan site photo credits)'

CATEGORIES = [
    'Category:Interior of Santiago Bernabéu Stadium',
    'Category:Santiago Bernabéu Stadium at night',
    'Category:Santiago Bernabéu Stadium',
    'Category:Santiago Bernabéu Stadium in 2024',
    'Category:Santiago Bernabéu Stadium in 2025',
    'Category:Santiago Bernabéu Stadium in 2023',
    'Category:Football matches at Santiago Bernabéu Stadium',
]
SEARCHES = ['Santiago Bernabéu stadium interior', 'Estadio Santiago Bernabéu night', 'Bernabéu stadium panorama', 'Santiago Bernabeu 2024']
FREE = re.compile(r'^(CC0|CC BY|CC-BY|Public domain|PD)', re.I)


def get(**params):
    for attempt in range(5):
        r = session.get(API, params={'format': 'json', **params}, timeout=60)
        if r.status_code == 429 or r.status_code >= 500:
            time.sleep(2 ** attempt)
            continue
        r.raise_for_status()
        return r.json()
    r.raise_for_status()


def strip(text):
    return html.unescape(re.sub(r'<[^>]+>', '', text or '')).strip()


def info(titles, width=None):
    out = []
    for i in range(0, len(titles), 40):
        params = dict(action='query', prop='imageinfo', iiprop='url|size|extmetadata|mime', titles='|'.join(titles[i:i + 40]))
        if width:
            params['iiurlwidth'] = width
        data = get(**params)
        for page in data.get('query', {}).get('pages', {}).values():
            ii = (page.get('imageinfo') or [None])[0]
            if not ii:
                continue
            meta = ii.get('extmetadata', {})
            out.append({
                'file': page['title'], 'width': ii['width'], 'height': ii['height'], 'mime': ii.get('mime'),
                'url': ii['url'], 'thumb': ii.get('thumburl'), 'page': ii.get('descriptionurl'),
                'license': strip(meta.get('LicenseShortName', {}).get('value')),
                'artist': strip(meta.get('Artist', {}).get('value')),
                'description': strip(meta.get('ImageDescription', {}).get('value'))[:200],
            })
    return out


def candidates():
    titles = set()
    for cat in CATEGORIES:
        try:
            data = get(action='query', list='categorymembers', cmtitle=cat, cmtype='file', cmlimit=200)
            titles.update(m['title'] for m in data.get('query', {}).get('categorymembers', []))
        except requests.HTTPError:
            pass
    for q in SEARCHES:
        data = get(action='query', list='search', srsearch=q, srnamespace=6, srlimit=50)
        titles.update(m['title'] for m in data.get('query', {}).get('search', []))
    rows = [r for r in info(sorted(titles), width=480)
            if r['mime'] == 'image/jpeg' and r['width'] >= 2800 and 1.3 <= r['width'] / r['height'] <= 2.4 and FREE.match(r['license'])]
    rows.sort(key=lambda r: -r['width'])
    rows = rows[:48]
    os.makedirs(RESEARCH, exist_ok=True)
    with open(os.path.join(RESEARCH, 'candidates.json'), 'w', encoding='utf-8') as fh:
        json.dump(rows, fh, ensure_ascii=False, indent=1)
    # Numbered contact sheet, 6 across
    tw, th = 320, 190
    sheet = Image.new('RGB', (tw * 6, th * ((len(rows) + 5) // 6)), 'black')
    draw = ImageDraw.Draw(sheet)
    for i, r in enumerate(rows):
        try:
            im = Image.open(io.BytesIO(session.get(r['thumb'], timeout=60).content)).convert('RGB')
            im.thumbnail((tw, th))
            x, y = (i % 6) * tw, (i // 6) * th
            sheet.paste(im, (x, y))
            draw.rectangle((x, y, x + 60, y + 24), fill='black')
            draw.text((x + 4, y + 4), f'{i} {r["width"]}', fill='yellow')
        except Exception as e:  # keep going on a bad thumbnail
            print('thumb failed', r['file'], e)
        time.sleep(0.3)
    sheet.save(os.path.join(RESEARCH, 'contact.jpg'), quality=85)
    print(f'{len(rows)} candidates')


def download(name):
    title = name if name.startswith('File:') else f'File:{name}'
    os.makedirs(OUT, exist_ok=True)
    rows = info([title], width=3840)
    if not rows:
        raise SystemExit(f'{title} not found')
    r = rows[0]
    for width in (3840, 1920):
        src = r['url'] if r['width'] <= width else info([title], width=width)[0]['thumb']
        im = Image.open(io.BytesIO(session.get(src, timeout=120).content)).convert('RGB')
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        im.save(os.path.join(OUT, f'bernabeu-{width}.jpg'), quality=82, optimize=True, progressive=True)
    with open(os.path.join(OUT, 'credit.json'), 'w', encoding='utf-8') as fh:
        json.dump({k: r[k] for k in ('file', 'artist', 'license', 'page')}, fh, ensure_ascii=False, indent=1)
    print('saved', r['file'], r['width'], 'x', r['height'], r['license'], r['artist'])


if __name__ == '__main__':
    chosen = json.load(open(CONFIG, encoding='utf-8')).get('file')
    download(chosen) if chosen else candidates()

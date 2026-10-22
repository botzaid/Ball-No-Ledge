"""Site imagery from Wikimedia Commons, driven by tools/media.json.

Entries with a "file" are downloaded at each listed width into images/media/
(JPEG, or transparent WebP when "cutout" is set, using rembg to remove the
background), with author and licence recorded in images/media/credits.json.
Entries with only "search" list large, freely licensed candidates into
research/media/<name>/ with a numbered contact sheet to choose from.

    pip install requests pillow  (plus rembg onnxruntime for cutouts)
    python3 tools/fetch_media.py
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
CONFIG = os.path.join(ROOT, 'tools', 'media.json')
OUT = os.path.join(ROOT, 'images', 'media')
RESEARCH = os.path.join(ROOT, 'research', 'media')
API = 'https://commons.wikimedia.org/w/api.php'
FREE = re.compile(r'^(CC0|CC BY|CC-BY|Public domain|PD)', re.I)

session = requests.Session()
session.headers['User-Agent'] = 'BallNoLedge/1.0 (https://github.com/botzaid/Ball-No-Ledge; fan site photo credits)'


def get(**params):
    for attempt in range(5):
        r = session.get(API, params={'format': 'json', **params}, timeout=60)
        if r.status_code == 429 or r.status_code >= 500:
            time.sleep(2 ** attempt)
            continue
        r.raise_for_status()
        return r.json()
    r.raise_for_status()


def fetch(url):
    for attempt in range(5):
        r = session.get(url, timeout=120)
        if r.status_code == 429 or r.status_code >= 500:
            time.sleep(2 ** attempt)
            continue
        r.raise_for_status()
        return r.content
    r.raise_for_status()


def strip(text):
    return html.unescape(re.sub(r'<[^>]+>', '', text or '')).strip()


def info(titles, width=None):
    out = []
    for i in range(0, len(titles), 40):
        params = dict(action='query', prop='imageinfo', iiprop='url|size|extmetadata|mime', titles='|'.join(titles[i:i + 40]))
        if width:
            params['iiurlwidth'] = width
        for page in get(**params).get('query', {}).get('pages', {}).values():
            ii = (page.get('imageinfo') or [None])[0]
            if not ii:
                continue
            meta = ii.get('extmetadata', {})
            out.append({
                'file': page['title'], 'width': ii['width'], 'height': ii['height'], 'mime': ii.get('mime'),
                'url': ii['url'], 'thumb': ii.get('thumburl'), 'page': ii.get('descriptionurl'),
                'license': strip(meta.get('LicenseShortName', {}).get('value')),
                'artist': strip(meta.get('Artist', {}).get('value')),
            })
    return out


def candidates(name, entry):
    titles = set()
    for q in entry['search']:
        data = get(action='query', list='search', srsearch=q, srnamespace=6, srlimit=50)
        titles.update(m['title'] for m in data.get('query', {}).get('search', []))
    rows = [r for r in info(sorted(titles), width=400)
            if r['mime'] in ('image/jpeg', 'image/png') and min(r['width'], r['height']) >= 900 and FREE.match(r['license'])]
    rows.sort(key=lambda r: -r['width'] * r['height'])
    rows = rows[:48]
    folder = os.path.join(RESEARCH, name)
    os.makedirs(folder, exist_ok=True)
    with open(os.path.join(folder, 'candidates.json'), 'w', encoding='utf-8') as fh:
        json.dump(rows, fh, ensure_ascii=False, indent=1)
    tw, th = 260, 260
    sheet = Image.new('RGB', (tw * 6, th * max(1, (len(rows) + 5) // 6)), 'black')
    draw = ImageDraw.Draw(sheet)
    for i, r in enumerate(rows):
        try:
            im = Image.open(io.BytesIO(fetch(r['thumb']))).convert('RGB')
            im.thumbnail((tw, th))
            x, y = (i % 6) * tw, (i // 6) * th
            sheet.paste(im, (x, y))
            draw.rectangle((x, y, x + 34, y + 20), fill='black')
            draw.text((x + 4, y + 4), str(i), fill='yellow')
        except Exception as e:  # keep going on a bad thumbnail
            print('thumb failed', r['file'], e)
        time.sleep(0.3)
    sheet.save(os.path.join(folder, 'contact.jpg'), quality=85)
    print(name, len(rows), 'candidates')


def download(name, entry, credits):
    title = entry['file'] if entry['file'].startswith('File:') else f"File:{entry['file']}"
    meta = info([title])
    if not meta:
        raise SystemExit(f'{title} not found')
    r = meta[0]
    os.makedirs(OUT, exist_ok=True)
    src = Image.open(io.BytesIO(fetch(r['url'])))
    if entry.get('cutout'):
        from rembg import remove
        src = remove(src.convert('RGB'))
        src = src.crop(src.getbbox())
    for width in entry.get('widths', [1920]):
        im = src.copy()
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        if entry.get('cutout'):
            im.save(os.path.join(OUT, f'{name}-{width}.webp'), quality=88, method=6)
        else:
            im.convert('RGB').save(os.path.join(OUT, f'{name}-{width}.jpg'), quality=80, optimize=True, progressive=True)
    credits[name] = {k: r[k] for k in ('file', 'artist', 'license', 'page')}
    print('saved', name, r['file'], r['width'], 'x', r['height'], r['license'])


if __name__ == '__main__':
    config = json.load(open(CONFIG, encoding='utf-8'))
    path = os.path.join(OUT, 'credits.json')
    credits = json.load(open(path, encoding='utf-8')) if os.path.exists(path) else {}
    for name, entry in config.items():
        if name.startswith('_'):
            continue
        if entry.get('file'):
            done = credits.get(name, {}).get('file') == entry['file'] and all(
                os.path.exists(os.path.join(OUT, f"{name}-{w}.{'webp' if entry.get('cutout') else 'jpg'}")) for w in entry.get('widths', [1920]))
            if not done:
                download(name, entry, credits)
        elif entry.get('search') and not os.path.exists(os.path.join(RESEARCH, name, 'candidates.json')):
            candidates(name, entry)
    os.makedirs(OUT, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as fh:
        json.dump(credits, fh, ensure_ascii=False, indent=1)

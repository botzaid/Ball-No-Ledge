"""Download a freely licensed photo for every player in tools/photo_manifest.json
that doesn't have one yet, and record who took it.

For each player it looks up the Wikipedia article, takes the image set on the
article's Wikidata item (P18, the canonical free image of the person) and
downloads a 600px version from Wikimedia Commons. If the Wikidata item has no
image, it falls back to the article's lead image, but only if that file lives
on Commons (i.e. it is freely licensed, not a non-free local upload).

Writes images/players/<id>.jpg and updates images/players/credits.json.
Runs in GitHub Actions (.github/workflows/player-photos.yml); needs internet.

    pip install requests pillow
    python3 tools/fetch_photos.py
"""
import html
import io
import json
import os
import re
import sys
import time

import requests
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..')
PLAYERS = os.path.join(ROOT, 'images', 'players')
MANIFEST = os.path.join(ROOT, 'tools', 'photo_manifest.json')
CREDITS = os.path.join(PLAYERS, 'credits.json')

session = requests.Session()
session.headers['User-Agent'] = 'BallNoLedge/1.0 (https://github.com/botzaid/Ball-No-Ledge; fan site photo credits)'


def get(url, **params):
    for attempt in range(4):
        r = session.get(url, params=params, timeout=30)
        if r.status_code == 429 or r.status_code >= 500:
            time.sleep(2 ** attempt)
            continue
        r.raise_for_status()
        return r
    r.raise_for_status()


def strip_tags(text):
    return html.unescape(re.sub(r'<[^>]+>', '', text or '')).strip()


def wikidata_image(title):
    data = get('https://en.wikipedia.org/w/api.php', action='query', format='json', redirects=1,
               prop='pageprops|pageimages', piprop='name', titles=title).json()
    page = next(iter(data['query']['pages'].values()))
    if 'missing' in page:
        return None, None
    qid = page.get('pageprops', {}).get('wikibase_item')
    lead = page.get('pageimage')
    p18 = None
    if qid:
        claims = get('https://www.wikidata.org/w/api.php', action='wbgetclaims', format='json',
                     entity=qid, property='P18').json().get('claims', {}).get('P18', [])
        if claims:
            p18 = claims[0]['mainsnak']['datavalue']['value']
    return p18, lead


def commons_info(filename):
    data = get('https://commons.wikimedia.org/w/api.php', action='query', format='json',
               titles=f'File:{filename}', prop='imageinfo', iiprop='url|extmetadata', iiurlwidth=600).json()
    page = next(iter(data['query']['pages'].values()))
    if 'imageinfo' not in page:
        return None  # not on Commons, so not freely licensed
    info = page['imageinfo'][0]
    meta = info.get('extmetadata', {})
    return {
        'file': filename,
        'url': info.get('thumburl') or info['url'],
        'page': info.get('descriptionurl'),
        'artist': strip_tags(meta.get('Artist', {}).get('value', '')) or 'Unknown',
        'license': strip_tags(meta.get('LicenseShortName', {}).get('value', '')),
        'licenseUrl': meta.get('LicenseUrl', {}).get('value', ''),
    }


def main():
    manifest = {k: v for k, v in json.load(open(MANIFEST, encoding='utf-8')).items() if not k.startswith('_')}
    credits = json.load(open(CREDITS, encoding='utf-8')) if os.path.exists(CREDITS) else {}
    missing = []
    for pid, title in manifest.items():
        out = os.path.join(PLAYERS, f'{pid}.jpg')
        if os.path.exists(out):
            continue
        try:
            p18, lead = wikidata_image(title)
            info = None
            for candidate in (p18, lead):
                if candidate and not candidate.lower().endswith(('.svg', '.gif')):
                    info = commons_info(candidate)
                    if info:
                        break
            if not info:
                missing.append(pid)
                print(f'{pid}: no free image found ({title})')
                continue
            img = Image.open(io.BytesIO(get(info['url']).content)).convert('RGB')
            img.save(out, 'JPEG', quality=88)
            credits[pid] = {k: info[k] for k in ('file', 'page', 'artist', 'license', 'licenseUrl')}
            print(f'{pid}: {info["file"]} ({info["license"]}, {info["artist"]})')
            time.sleep(0.5)
        except Exception as e:  # keep going; report at the end
            missing.append(pid)
            print(f'{pid}: error {e}')
    json.dump(dict(sorted(credits.items())), open(CREDITS, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'done, {len(missing)} without photo: {", ".join(missing)}')


if __name__ == '__main__':
    sys.exit(main())

"""Save the raw wikitext of every Wikipedia article in tools/source_pages.txt to
research/wiki/, so the dataset can be checked against (and rebuilt from) the
same sources. Runs in GitHub Actions (.github/workflows/sources.yml).
"""
import os
import re
import time

import requests

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'research', 'wiki')

session = requests.Session()
session.headers['User-Agent'] = 'BallNoLedge/1.0 (https://github.com/botzaid/Ball-No-Ledge)'


def slug(title):
    return re.sub(r'[^A-Za-z0-9]+', '_', title).strip('_')


def main():
    os.makedirs(OUT, exist_ok=True)
    titles = [t.strip() for t in open(os.path.join(ROOT, 'tools', 'source_pages.txt'), encoding='utf-8') if t.strip()]
    for title in titles:
        r = session.get('https://en.wikipedia.org/w/api.php', timeout=30, params={
            'action': 'query', 'format': 'json', 'redirects': 1, 'prop': 'revisions',
            'rvprop': 'content|timestamp', 'rvslots': 'main', 'titles': title})
        page = next(iter(r.json()['query']['pages'].values()))
        if 'revisions' not in page:
            print(f'MISSING {title}')
            continue
        rev = page['revisions'][0]
        text = rev['slots']['main']['*']
        with open(os.path.join(OUT, slug(title) + '.wiki'), 'w', encoding='utf-8') as f:
            f.write(f"<!-- {page['title']} | revision {rev['timestamp']} -->\n{text}")
        print(f"ok {title} ({len(text)} chars, {rev['timestamp']})")
        time.sleep(0.3)


if __name__ == '__main__':
    main()

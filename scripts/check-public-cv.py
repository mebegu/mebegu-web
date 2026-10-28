"""Verify the built public CV against its generated source and private policy."""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.parts = []
        self.projects = 0

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'svg', 'head'):
            self.skip += 1
        if tag == 'details' and 'data-project' in dict(attrs):
            self.projects += 1

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'svg', 'head'):
            self.skip = max(0, self.skip - 1)

    def handle_data(self, text):
        if not self.skip and text.strip():
            self.parts.append(text)


def normal(value):
    return re.sub(r'\s+([,:;])', r'\1', re.sub(r'\s+', ' ', value)).strip()


def expected_leaves(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key != 'provenance':
                if key == 'stack':
                    yield from child.split(', ')
                else:
                    yield from expected_leaves(child)
    elif isinstance(value, list):
        for child in value:
            yield from expected_leaves(child)
    elif isinstance(value, str):
        text = value.replace('**', '').removeprefix('- ').removeprefix('Details: ')
        match = re.match(r'^\{\w+\} (.+?) :: (.+)', text)
        if match:
            yield match[1]
            yield match[2].replace('Client C', 'Landing Zone').replace('Client D', 'Device Platform')
        else:
            text = re.sub(r'^Client [A-F] – |^Government – ', '', text)
            for part in text.split(' | '):
                # Meta values may be laid out as labeled fields, not one line.
                for atom in part.split(' · '):
                    if atom:
                        yield atom


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--root', type=Path, default=Path('dist'))
parser.add_argument('--policy', required=True, type=Path)
args = parser.parse_args()
data = json.loads(Path('src/data/cv.public.generated.json').read_text(encoding='utf-8'))
policy = json.loads(args.policy.read_text(encoding='utf-8'))
source_json = json.dumps(data, ensure_ascii=False)
for route in ('professional/index.html', 'tr/professional/index.html'):
    html = (args.root / route).read_text(encoding='utf-8')
    for token in policy['forbidden']:
        pattern = r'\b' + re.escape(token) + r'\b'
        assert not re.search(pattern, html + source_json, re.I), f'Publication privacy failure in {route}'
    assert not re.search(r'\+49[\d\s()-]{7,}|href=["\x27]tel:', html + source_json), 'Phone was published'
    page = Page()
    page.feed(html)
    text = normal(' '.join(page.parts))
    missing = [leaf for leaf in expected_leaves(data) if normal(leaf) not in text]
    assert not missing, f'Missing source phrases in {route}: {missing}'
    assert page.projects == 12, f'Expected all 12 projects in {route}'
    assert '/cv/mehmet-berk-gurcay-cv.pdf' in html, 'Missing primary PDF action'
    assert 'lang="en"' in html, 'Missing English CV language'
    print(f'Verified public CV privacy, all source phrases and 12 projects: {route}')

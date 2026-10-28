"""Find visible-copy candidates for human review; never rewrite or classify authorship."""
import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path


class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in ('head', 'script', 'style', 'svg'):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in ('head', 'script', 'style', 'svg'):
            self.skip = max(0, self.skip - 1)

    def handle_data(self, data):
        if not self.skip and data.strip():
            self.parts.append(re.sub(r'\s+', ' ', data.strip()))


RULES = {
    'long-dash': r'[\u2014\u2015]',
    'stock-contrast': r'\bnot (?:just|only)\b.{0,100}\bbut\b',
    'stock-slogan': r'\bwhere\b.{0,50}\bmeets\b|\b(?:unlock your|in today.s (?:fast.paced|digital)|ever.evolving landscape)\b',
    'vague-vocabulary-review': r'\b(?:delve|leverage|foster|seamless|cutting.edge|game.changing|transformative|tapestry|robust)\b',
    'turkish-stock-copy': r'geleceği şekillendir|sınırları aş|tutkuyla harman|benzersiz bir yolculuk|yenilikçi çözümler sun',
}

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--root', type=Path, default=Path('dist'))
parser.add_argument('--out', type=Path, default=Path('.local/editorial-review.json'))
args = parser.parse_args()
if not args.root.is_dir():
    parser.error('Build the site first; --root must be a rendered HTML directory')
findings = []
files = sorted(args.root.rglob('*.html'))
for path in files:
    reader = Text()
    reader.feed(path.read_text(encoding='utf-8'))
    for part in reader.parts:
        for rule, pattern in RULES.items():
            if re.search(pattern, part, re.I):
                findings.append({'file': path.as_posix(), 'rule': rule, 'text': part, 'verdict': 'needs-editorial-review'})
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_text(json.dumps({'scope': str(args.root), 'htmlFiles': len(files), 'findings': findings, 'note': 'Candidates only. No authorship claim; source-owned CV text must be fixed upstream.'}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(files)} HTML files, {len(findings)} editorial candidates. Review: {args.out}')

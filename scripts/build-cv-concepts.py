"""Build isolated static concepts; never writes generated CV data or production pages.

python scripts/build-cv-concepts.py .local/cv-source/cv.md
Serve with scripts/serve-cv-concepts.py. The source is the released v2 CV,
pending the upstream-generated src/data/cv.json that is absent in this checkout.
"""
import argparse
import hashlib
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/cv-concepts'
REVISION = '85ddc0cb1580a2b1a837028cd3a097a50e1e5152'
CONCEPTS = {'a': 'Editorial', 'b': 'Connections', 'c': 'Reading room'}


def esc(value):
    return html.escape(value, quote=True)


def inline(value):
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', esc(value))


def read_source(path):
    text = path.read_text(encoding='utf-8')
    text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    data = {'sections': {}, 'name': '', 'role': '', 'contact': []}
    section = None
    job = None
    project = None
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith('# '):
            data['name'] = line[2:]
        elif line.startswith('> '):
            data['role'] = line[2:]
        elif line.startswith('@ '):
            data['contact'] = [p.strip() for p in line[2:].split('|') if not re.fullmatch(r'\+?[\d\s()-]+', p.strip())]
        elif line.startswith('## '):
            section = line[3:]
            data['sections'][section] = []
            job = project = None
        elif line.startswith('### '):
            role, company, city, period = [p.strip() for p in line[4:].split('|')]
            job = {'role': role, 'company': company, 'city': city, 'period': period, 'bullets': [], 'projects': []}
            data['sections'][section].append(job)
            project = None
        elif line.startswith('#### '):
            project = {'title': line[5:], 'bullets': []}
            job['projects'].append(project)
        elif project is not None:
            if line.startswith('- '):
                project['bullets'].append(line[2:])
            else:
                label, value = line.split(': ', 1)
                project[label.lower()] = value
        elif line.startswith('- ') and job is not None:
            job['bullets'].append(line[2:])
        else:
            data['sections'][section].append(line)
    return data


def section_id(title):
    return re.sub(r'[^a-z]+', '-', title.lower()).strip('-')


def bullets(items):
    return '<ul class="bullets">' + ''.join(f'<li>{inline(x)}</li>' for x in items) + '</ul>'


def render_section(title, entries):
    ident = section_id(title)
    body = ''
    if title == 'Skill Highlights':
        body = '<ul class="evidence-list">'
        for entry in entries:
            match = re.match(r'- \{\w+\} (.+?) :: (.+)', entry)
            if match:
                skill, evidence = match.groups()
                body += f'<li><strong>{esc(skill)}</strong><span>{esc(evidence)}</span></li>'
        body += '</ul>'
        for entry in entries:
            if entry.startswith('Core tech:'):
                body += f'<p class="core">{inline(entry)}</p>'
    elif title == 'Experience':
        for entry in entries:
            if isinstance(entry, str):
                body += f'<p class="pointer">{inline(entry.removeprefix("Details: "))}</p>'
                continue
            body += f'<article class="job"><header><h3>{esc(entry["role"])}</h3><p class="employer">{esc(entry["company"])} · {esc(entry["city"])}</p><p class="period">{esc(entry["period"])}</p></header>{bullets(entry["bullets"])}</article>'
    elif title == 'Project Details':
        number = 0
        for entry in entries:
            body += f'<div class="project-employer"><h3>{esc(entry["role"])}</h3><p>{esc(entry["company"])} · {esc(entry["city"])} · {esc(entry["period"])}</p></div>'
            for project in entry['projects']:
                number += 1
                stack = project.get('stack', '')
                body += f'<details class="project"><summary><span class="project-number" aria-hidden="true">{number:02d}</span><span class="project-label"><span class="project-title">{esc(project["title"])}</span><span class="project-company">{esc(entry["company"])}</span></span><span class="expand" aria-hidden="true">+</span></summary><div class="project-body"><p class="meta">{inline(project.get("meta", ""))}</p><h4>Context</h4><p>{inline(project.get("context", ""))}</p><h4>Contributions</h4>{bullets(project["bullets"])}<h4>Technologies</h4><p class="stack">{esc(stack)}</p></div></details>'
    elif title in ('Education', 'Certifications', 'Languages', 'Skills'):
        body = '<ul class="record-list">'
        for entry in entries:
            if entry.startswith('- '):
                cells = entry[2:].split(' | ')
                body += '<li>' + ''.join(f'<span>{inline(cell)}</span>' for cell in cells) + '</li>'
            else:
                body += f'<li class="note">{inline(entry)}</li>'
        body += '</ul>'
    else:
        body = ''.join(f'<p>{inline(entry)}</p>' for entry in entries)
    return f'<section id="{ident}" class="cv-section section-{ident}" aria-labelledby="heading-{ident}"><h2 id="heading-{ident}">{esc(title)}</h2><div class="section-content">{body}</div></section>'


def render(data, concept, lang, chrome):
    contact = '<ul class="contact" aria-label="Contact">'
    for item in data['contact']:
        url = 'mailto:' + item if '@' in item else 'https://' + item if '.' in item and ' ' not in item else None
        contact += f'<li><a href="{esc(url)}">{esc(item)}</a></li>' if url else f'<li>{esc(item)}</li>'
    contact += '</ul>'
    actions = '<div class="actions screen-only"><a class="download" href="/cv/mehmet-berk-gurcay-cv.pdf" download>Download PDF <span aria-hidden="true">↓</span></a><button type="button" data-print>Print</button></div>'
    header = f'<header class="identity"><p class="folio screen-only">Professional</p><h1>{esc(data["name"])}</h1><p class="role">{esc(data["role"])}</p>{contact}{actions}</header>'
    sections = data['sections']
    opening = '<div class="opening">' + ''.join(render_section(title, sections[title]) for title in ('Summary', 'Skill Highlights')) + '</div>'
    rest = ''.join(render_section(title, sections[title]) for title in ('Experience', 'Skills', 'Education', 'Certifications', 'Languages', 'Teaching & Community', 'Interests'))
    projects = render_section('Project Details', sections['Project Details'])
    index = '<nav class="chapter-index screen-only" aria-label="CV sections"><p>On this page</p>' + ''.join(f'<a href="#{section_id(title)}"><span aria-hidden="true">{i:02d}</span>{esc(title)}</a>' for i, title in enumerate(('Summary', 'Skill Highlights', 'Experience', 'Skills', 'Education', 'Project Details'), 1)) + '</nav>'
    switch = '<nav class="concept-switch screen-only" aria-label="Design concepts">' + ''.join(f'<a href="{key}{"-tr" if lang == "tr" else ""}.html" {"aria-current=page" if key == concept else ""}>{key.upper()}<span>{label}</span></a>' for key, label in CONCEPTS.items()) + '</nav>'
    pre, post = chrome
    if lang == 'tr':
        replacements = {'>Professional<': '>Profesyonel<', '>Workshop<': '>Atölye<', 'aria-label="Language"': 'aria-label="Dil"'}
        for old, new in replacements.items():
            pre = pre.replace(old, new)
    # Real site chrome, with only the language destinations pointed at the previews.
    pre = re.sub(r'href="/(?:tr/)?professional/"(?=\s+lang="en")', f'href="{concept}.html"', pre)
    pre = re.sub(r'href="/(?:tr/)?professional/"(?=\s+lang="tr")', f'href="{concept}-tr.html"', pre)
    pre = pre.replace('lang="en"', f'lang="{lang}"', 1)
    pre = re.sub(r'(<a\b[^>]*\blang="(?:en|tr)"[^>]*)\saria-current="true"', r'\1', pre)
    pre = re.sub(r'(<a\b[^>]*\blang="' + lang + r'"[^>]*)(>)', r'\1 aria-current="true"\2', pre)
    pre = re.sub(r'<title>.*?</title>', f'<title>Concept {concept.upper()} · {CONCEPTS[concept]}</title>', pre)
    pre = pre.replace('</head>', '<meta name="robots" content="noindex"><link rel="stylesheet" href="concepts.css"></head>')
    pre = re.sub(r'<body[^>]*>', f'<body class="concept-{concept}">', pre)
    return pre + f'<main id="main" class="concept-shell">{switch}<div class="composition">{index}<article id="cv" lang="en">{header}{opening}{rest}</article></div><div class="projects-shell" lang="en">{projects}</div></main>' + post + '<script>document.querySelector("[data-print]").addEventListener("click",()=>window.print());</script></body></html>'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', nargs='?', type=Path, help='Optional sanitized Markdown; defaults to the pinned preview snapshot')
    args = parser.parse_args()
    data = read_source(args.source) if args.source else json.loads((OUT / 'source.json').read_text(encoding='utf-8'))
    if len([p for job in data['sections']['Project Details'] for p in job['projects']]) != 12:
        raise ValueError('Expected all 12 projects from the v2 source')
    OUT.mkdir(parents=True, exist_ok=True)
    if args.source:
        data['provenance'] = {'repository': 'mebegu/career-docs', 'revision': REVISION, 'path': 'personal-cv/versions/v2_2026-10-28/cv.md', 'sha256WithoutPhone': hashlib.sha256(args.source.read_bytes()).hexdigest(), 'note': 'Preview snapshot only. Generated src/data/cv.json is absent. Phone omitted; CV wording is verbatim.'}
    (OUT / 'source.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    site = (ROOT / 'dist/professional/index.html').read_text(encoding='utf-8')
    pre = site.split('<main', 1)[0]
    pre = re.sub(r'<link\b[^>]*href="[^\"]*ProfessionalPage[^\"]*"[^>]*>', '', pre)
    pre = re.sub(r'href="(/_astro/[^\"]+)"', r'href="/dist\1"', pre)
    footer = re.search(r'<footer\b.*?</footer>', site, re.S)
    post = footer.group() if footer else ''
    for key in CONCEPTS:
        for lang in ('en', 'tr'):
            (OUT / f'{key}{"-tr" if lang == "tr" else ""}.html').write_text(render(data, key, lang, (pre, post)), encoding='utf-8')
    expected = [data['name'], data['role'], *data['contact']]
    def collect(value):
        if isinstance(value, dict):
            for child in value.values():
                collect(child)
        elif isinstance(value, list):
            for child in value:
                collect(child)
        elif isinstance(value, str):
            value = re.sub(r'^\{\w+\} ', '', value.removeprefix('- ').removeprefix('Details: '))
            value = value.replace('**', '')
            expected.extend(re.split(r' :: | \| ', value))
    collect(data['sections'])
    config = {
        'baseURL': 'http://127.0.0.1:4322',
        'intent': 'Three isolated complete-CV concepts; preserve source wording, site chrome, reading order, legibility, no horizontal clipping at 360/390/1280; production unchanged.',
        'sectionOrder': ['Summary', 'Skill Highlights', 'Experience', 'Skills', 'Education', 'Certifications', 'Languages', 'Teaching & Community', 'Interests', 'Project Details'],
        'expectedText': sorted(set(expected)),
        'requiredFonts': ['DM Sans', 'Space Grotesk'],
        'routes': [{'id': key + suffix, 'path': f'/docs/cv-concepts/{key}{suffix}.html', 'print': suffix == ''} for key in CONCEPTS for suffix in ('', '-tr')],
        'viewports': [{'width': 1280, 'height': 1150, 'captureFull': True}, {'width': 390, 'height': 1250, 'captureFull': True}, {'width': 360, 'height': 900}],
    }
    (OUT / 'oracle.json').write_text(json.dumps(config, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Built A/B/C EN/TR static concepts from the complete v2 CV; production pages and data untouched.')


if __name__ == '__main__':
    main()

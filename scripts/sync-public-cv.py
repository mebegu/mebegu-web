"""Generate the public CV snapshot from the pinned upstream release.

Private client-name substitutions are supplied through --policy; do not commit
the policy or raw CV. Existing cv.json, resume.ts and portfolio.ts are untouched.
"""
import argparse
import base64
import hashlib
import json
import re
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--policy', required=True, type=Path)
parser.add_argument('--revision', default='85ddc0cb1580a2b1a837028cd3a097a50e1e5152')
args = parser.parse_args()
policy = json.loads(args.policy.read_text(encoding='utf-8'))
endpoint = f'repos/mebegu/career-docs/contents/personal-cv/versions/v2_2026-10-28/cv.md?ref={args.revision}'
response = subprocess.run(['gh', 'api', endpoint], capture_output=True, check=True)
text = base64.b64decode(json.loads(response.stdout)['content']).decode('utf-8')
text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
for pattern, replacement in policy['rules']:
    text = re.sub(pattern, replacement, text, flags=re.I)
data = {'name': '', 'role': '', 'contact': [], 'sections': {}}
section = job = project = None
for line in text.splitlines():
    line = line.strip()
    if not line:
        continue
    if line.startswith('# '):
        data['name'] = line[2:]
    elif line.startswith('> '):
        data['role'] = line[2:]
    elif line.startswith('@ '):
        data['contact'] = [part.strip() for part in line[2:].split('|') if not re.fullmatch(r'\+?[\d\s()-]+', part.strip())]
    elif line.startswith('## '):
        section = line[3:]
        data['sections'][section] = []
        job = project = None
    elif line.startswith('### '):
        role, company, city, period = [part.strip() for part in line[4:].split('|')]
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
assert len([p for group in data['sections']['Project Details'] for p in group['projects']]) == 12
data['provenance'] = {'repository': 'mebegu/career-docs', 'revision': args.revision, 'path': 'personal-cv/versions/v2_2026-10-28/cv.md', 'publication': 'Client names replaced using the owner-requested private publication policy. Phone omitted. Other CV wording preserved.'}
payload = json.dumps(data, ensure_ascii=False, indent=2) + '\n'
for token in policy['forbidden']:
    if re.search(r'\b' + re.escape(token) + r'\b', payload, re.I):
        raise ValueError('A client name remains; public snapshot was not written')
if re.search(r'\+49[\d\s()-]{7,}', payload):
    raise ValueError('A phone number remains; public snapshot was not written')
out = Path('src/data/cv.public.generated.json')
out.write_text(payload, encoding='utf-8')
print('Generated the public, client-anonymized v2 snapshot:', out)
print('SHA-256:', hashlib.sha256(payload.encode('utf-8')).hexdigest())

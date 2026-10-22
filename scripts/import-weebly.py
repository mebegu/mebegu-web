"""Archive this site's Weebly blog and create review-only Astro Markdown drafts.

python -m pip install --target .local/weebly-tools -r scripts/requirements-weebly.txt
python scripts/import-weebly.py            # reuse cached responses; fetch missing ones
python scripts/import-weebly.py --offline  # rebuild from the saved archive, no network

Existing Markdown is never overwritten. Changed conversions go to proposed/ for review.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
import hashlib
import html
import json
from pathlib import Path
import re
import sys
import time
from urllib.parse import quote, unquote, urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.local/weebly-tools'))
from bs4 import BeautifulSoup, Comment
from markdownify import markdownify

BASE = 'https://mebegu.weebly.com'
ARCHIVE = ROOT / 'archives/weebly'
CONTENT = ROOT / 'src/content/writing'
MEDIA = ROOT / 'public/media/weebly'
ENCODED = '{http://purl.org/rss/1.0/modules/content/}encoded'
ENGLISH = {'drm-copyright-and-fair-use-regulations', 'computer-virus-hoaxes'}
TECHNOLOGY = ENGLISH | {'google-glass', 'yorumum-gzksn-diye-1-yldz'}


def normalized(url: str) -> str:
    parsed = urlparse(urljoin(BASE + '/', html.unescape(url)))
    if parsed.hostname == 'mebegu.weebly.com':
        parsed = parsed._replace(scheme='https', netloc='mebegu.weebly.com')
    return urlunparse(parsed._replace(path=quote(unquote(parsed.path), safe='/@:+'), fragment=''))


def owned(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme == 'https' and parsed.netloc == 'mebegu.weebly.com'


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def save_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')


def navigation(soup: BeautifulSoup) -> set[str]:
    return {normalized(a['href']) for a in soup.select('a[href]')
            if re.match(r'^/blog/(archives|category|previous|next)/', urlparse(normalized(a['href'])).path)
            and owned(normalized(a['href']))}


def post_links(soup: BeautifulSoup) -> set[str]:
    return {normalized(a['href']) for a in soup.select('a.blog-title-link[href]')}


def convert_body(raw: str, resolve_asset) -> tuple[str, dict]:
    """Only the RSS article body is passed here; navigation/comments never enter it."""
    soup = BeautifulSoup(raw, 'html.parser')
    details = {'images': [], 'embeds': [], 'external_links': []}
    for node in soup.find_all(string=lambda value: isinstance(value, Comment)):
        node.extract()
    for node in soup.select('script, style, noscript, form, input, button'):
        node.decompose()
    for node in list(soup.select('[style]')):
        if node.attrs and re.search(r'(display\s*:\s*none|visibility\s*:\s*hidden)', node.get('style', ''), re.I):
            node.decompose()
    for frame in soup.select('iframe, embed, object'):
        source = normalized(frame.get('src') or frame.get('data') or '')
        parsed = urlparse(source)
        if parsed.hostname in {'www.youtube.com', 'youtube.com'} and parsed.path.startswith('/embed/'):
            source = 'https://www.youtube.com/watch?v=' + parsed.path.rsplit('/', 1)[-1]
        details['embeds'].append(source)
        link = soup.new_tag('a', href=source)
        link.string = 'Video: ' + source
        paragraph = soup.new_tag('p')
        paragraph.append(link)
        frame.replace_with(paragraph)
    for image in list(soup.select('img')):
        source = normalized(image.get('src', ''))
        if '/weebly/images/file_icons/' in source:
            image.decompose()  # Weebly's decorative PDF icon, not article content.
            continue
        alt = image.get('alt', '')
        details['images'].append({'source_url': source, 'original_alt': alt,
                                  'needs_alt_review': not alt or alt.lower() in {'picture', 'resim'}})
        image['src'] = resolve_asset(source)
        # Preserve meaningful source descriptions; don't invent missing alt text.
        image['alt'] = '' if alt.lower() in {'picture', 'resim'} else alt
    for link in list(soup.select('a[href]')):
        source = normalized(link['href'])
        if urlparse(source).scheme not in {'http', 'https', 'mailto'}:
            link.unwrap()
            continue
        if owned(source) and urlparse(source).path.startswith('/uploads/'):
            link['href'] = resolve_asset(source)
        else:
            link['href'] = source
            details['external_links'].append(source)
    # Weebly's tables arrange columns/widgets; none of these nine bodies use data tables.
    # Flattening preserves reading order and keeps images inside those cells.
    for table in list(soup.select('table')):
        for node in list(table.select('tbody, thead, tfoot, tr, td, th')):
            node.unwrap()
        table.unwrap()
    for node in soup.select('div.paragraph'):
        node.name = 'p'
    # Separate source captions from their images instead of joining them inline.
    for caption in soup.select('.wsite-image > div'):
        if caption.get_text(strip=True):
            caption.name = 'p'
    for image in soup.select('img'):
        container = image.parent if image.parent.name == 'a' else image
        if container.parent.name != 'p':
            container.wrap(soup.new_tag('p'))
    for heading in soup.select('h1'):
        heading.name = 'h2'
    for node in soup.find_all(True):
        node.attrs = {key: value for key, value in node.attrs.items() if key in {'href', 'src', 'alt', 'title'}}
    details['clean_text'] = soup.get_text(' ', strip=True)
    markdown = markdownify(str(soup), heading_style='ATX', bullets='-', wrap=False, autolinks=False)
    markdown = re.sub(r'\n[ \t]+\n', '\n\n', markdown)
    markdown = re.sub(r'\n{3,}', '\n\n', markdown).strip() + '\n'
    return markdown, details


def write_draft(path: Path, text: str, proposed: Path) -> str:
    if not path.exists():
        path.write_text(text, encoding='utf-8', newline='\n')
        return 'created'
    if path.read_text(encoding='utf-8') == text:
        return 'unchanged'
    proposed.mkdir(parents=True, exist_ok=True)
    (proposed / path.name).write_text(text, encoding='utf-8', newline='\n')
    return 'preserved-existing; proposal-written'


class Importer:
    def __init__(self, offline=False):
        self.offline = offline
        self.cache_path = ARCHIVE / 'responses.json'
        self.responses = json.loads(self.cache_path.read_text(encoding='utf-8')) if self.cache_path.exists() else {}
        exclusions = ARCHIVE / 'exclusions.json'
        self.exclusions = json.loads(exclusions.read_text(encoding='utf-8')) if exclusions.exists() else {}
        self.assets = {}
        self.failures = []

    def fetch(self, url: str, path: Path, expected_types=()) -> tuple[bytes, dict]:
        url = normalized(url)
        if url in self.exclusions:
            raise ValueError('Full-page capture excluded; see archives/weebly/exclusions.json: ' + url)
        if not owned(url):
            raise ValueError('Downloads restricted to the source site: ' + url)
        if path.exists():
            if url not in self.responses:
                raise ValueError('Cache file has no response record: ' + str(path))
            data = path.read_bytes()
            record = self.responses[url]
            if expected_types and not record['content_type'].startswith(expected_types):
                raise ValueError('Unexpected cached content type: ' + record['content_type'])
            if digest(data) != record['sha256']:
                raise ValueError('Cached response checksum mismatch: ' + url)
            return data, record
        if self.offline:
            raise FileNotFoundError('Missing offline capture: ' + url)
        time.sleep(0.1)
        with urlopen(Request(url, headers={'User-Agent': 'mebegu-archive-import/1.0'}), timeout=30) as response:
            content_type = response.headers.get('Content-Type', '')
            if expected_types and not content_type.startswith(expected_types):
                raise ValueError('Unexpected content type: ' + content_type)
            data = response.read(20 * 1024 * 1024 + 1)
            if len(data) > 20 * 1024 * 1024:
                raise ValueError('Source exceeds the 20 MiB per-file limit: ' + url)
            record = {'url': url, 'final_url': response.url, 'status': response.status,
                      'content_type': content_type,
                      'captured_at': datetime.now(timezone.utc).isoformat(),
                      'path': path.relative_to(ROOT).as_posix(), 'bytes': len(data), 'sha256': digest(data)}
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        self.responses[url] = record
        save_json(self.cache_path, self.responses)
        return data, record

    def asset(self, url: str) -> str:
        url = normalized(url)
        if url in self.assets:
            return self.assets[url].get('local_url', url)
        if not owned(url):
            self.assets[url] = {'source_url': url, 'status': 'external; not downloaded'}
            return url
        name = re.sub(r'[^a-zA-Z0-9._-]', '-', Path(urlparse(url).path).name)
        stem, suffix = Path(name).stem, Path(name).suffix.lower()
        filename = f'{stem}-{digest(url.encode())[:10]}{suffix}'
        try:
            data, response = self.fetch(url, MEDIA / filename, ('image/', 'application/pdf'))
            self.assets[url] = {'source_url': url, 'status': 'downloaded', 'local_url': '/media/weebly/' + filename,
                                'bytes': len(data), 'sha256': digest(data), 'content_type': response['content_type']}
            return self.assets[url]['local_url']
        except Exception as error:
            self.assets[url] = {'source_url': url, 'status': 'failed', 'error': str(error)}
            self.failures.append({'url': url, 'error': str(error), 'kind': 'asset'})
            return url

    def run(self):
        ARCHIVE.mkdir(parents=True, exist_ok=True)
        CONTENT.mkdir(parents=True, exist_ok=True)
        seed = {}
        for key, source, filename in [('robots', '/robots.txt', 'robots.txt'), ('sitemap', '/sitemap.xml', 'sitemap.xml'),
                                      ('index', '/blog', 'blog.html'), ('feed', '/1/feed', 'rss.xml')]:
            seed[key], _ = self.fetch(BASE + source, ARCHIVE / 'raw' / filename)
        sitemap = ET.fromstring(seed['sitemap'])
        sitemap_posts = {normalized(n.text) for n in sitemap.findall('.//{*}loc')
                         if re.match(r'^/blog/[^/]+$', urlparse(n.text).path)}
        index = BeautifulSoup(seed['index'], 'html.parser')
        discovered = post_links(index) | sitemap_posts
        pending, visited = navigation(index), set()
        while pending:
            if len(visited) >= 100:
                raise ValueError('Navigation crawl limit reached; inspect before increasing')
            url = sorted(pending)[0]
            pending.remove(url)
            if url in visited:
                continue
            visited.add(url)
            try:
                data, _ = self.fetch(url, ARCHIVE / 'raw/navigation' / (digest(url.encode())[:16] + '.html'))
                page = BeautifulSoup(data, 'html.parser')
                discovered |= post_links(page)
                pending |= navigation(page) - visited
            except Exception as error:
                self.failures.append({'url': url, 'error': str(error), 'kind': 'navigation'})
        items = ET.fromstring(seed['feed']).findall('./channel/item')
        feed_urls = {normalized(item.findtext('link')) for item in items}
        missing = sorted(discovered - feed_urls)
        records = []
        for item in items:
            source = normalized(item.findtext('link'))
            slug = urlparse(source).path.rsplit('/', 1)[-1]
            if source in {entry['source_url'] for entry in records}:
                raise ValueError('Duplicate RSS permalink: ' + source)
            try:
                raw = item.findtext(ENCODED)
                if not raw:
                    raise ValueError('RSS has no full body; refusing to import a truncated summary')
                if source in self.exclusions:
                    page = index
                    response = self.responses[BASE + '/blog']
                    capture_method = 'RSS full body + cached blog index; full permalink HTML excluded'
                else:
                    page_data, response = self.fetch(source, ARCHIVE / 'raw/posts' / (slug + '.html'))
                    page = BeautifulSoup(page_data, 'html.parser')
                    capture_method = 'RSS full body + full permalink HTML'
                article = next((post for post in page.select('.blog-post')
                                if post_links(post) == {source}), None)
                if article is None or article.select_one('.blog-content') is None:
                    raise ValueError('Article body missing from permalink page')
                # Cross-check that the feed includes the whole visible post, not just the teaser.
                page_images = {normalized(img.get('src', '')) for img in article.select('.blog-content img')
                               if '/file_icons/' not in img.get('src', '')}
                body_path = ARCHIVE / 'raw/bodies' / (slug + '.html')
                body_path.parent.mkdir(parents=True, exist_ok=True)
                body_path.write_text(raw, encoding='utf-8', newline='\n')
                converted, details = convert_body(raw, self.asset)
                rss_images = {entry['source_url'] for entry in details['images']}
                complete_page = source not in self.exclusions
                if (complete_page and page_images != rss_images) or (not complete_page and not page_images.issubset(rss_images)):
                    raise ValueError('RSS/permalink image coverage differs')
                title = html.unescape(item.findtext('title')).strip()
                lang = 'en' if slug in ENGLISH else 'tr'
                published = parsedate_to_datetime(item.findtext('pubDate')).astimezone(timezone.utc).isoformat()
                categories = [html.unescape(node.text) for node in item.findall('category')]
                visible_date = article.select_one('.blog-date')
                metadata = {'title': title,
                            'description': details['clean_text'][:197].rsplit(' ', 1)[0] + '…',
                            'published': published, 'category': 'Software' if slug in TECHNOLOGY else 'Personal',
                            'draft': True, 'lang': lang, 'translationKey': 'weebly-' + slug,
                            'source': {'url': source, 'published': item.findtext('pubDate'),
                                       'visibleDate': visible_date.get_text(' ', strip=True) if visible_date else '',
                                       'categories': categories, 'imported': response['captured_at'][:10]}}
                frontmatter = '\n'.join(f'{key}: {json.dumps(value, ensure_ascii=False)}' for key, value in metadata.items())
                filename = 'weebly-' + slug + '.md'
                draft_path = CONTENT / filename
                status = write_draft(draft_path, '---\n' + frontmatter + '\n---\n\n' + converted, ARCHIVE / 'proposed')
                future_url = ('/tr' if lang == 'tr' else '') + '/writing/weebly-' + slug + '/'
                record = {'title': title, 'source_url': source, 'published': published, 'lang': lang,
                          'source_categories': categories, 'source_visible_date': metadata['source']['visibleDate'],
                          'markdown': draft_path.relative_to(ROOT).as_posix(), 'future_path': future_url,
                          'capture_method': capture_method,
                          'status': status, 'body_sha256': digest(raw.encode()),
                          'markdown_sha256': digest(draft_path.read_bytes()),
                          'images': details['images'], 'embeds': details['embeds'],
                          'external_links': sorted(set(details['external_links'])), 'review': 'pending'}
                records.append(record)
                print(f'{status}: {title}', flush=True)
            except Exception as error:
                self.failures.append({'url': source, 'error': str(error), 'kind': 'post'})
        manifest = {'source': BASE, 'draft_only': True, 'rss_posts': len(items),
                    'sitemap_posts': len(sitemap_posts), 'discovered_posts': len(discovered),
                    'navigation_pages': sorted(visited), 'missing_from_feed': missing,
                    'posts': records, 'assets': list(self.assets.values()), 'failures': self.failures,
                    'raw_capture_exclusions': self.exclusions}
        save_json(ARCHIVE / 'manifest.json', manifest)
        mapping = {entry['source_url']: {'future_path': entry['future_path'], 'published': False} for entry in records}
        save_json(ARCHIVE / 'url-map.json', mapping)
        downloaded = [asset for asset in self.assets.values() if asset['status'] == 'downloaded']
        print(f'{len(records)}/{len(items)} posts; {len(downloaded)} assets; {len(self.failures)} failures; {len(missing)} posts missing from RSS.')
        if self.failures or missing:
            raise SystemExit('Import has gaps; inspect archives/weebly/manifest.json')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--offline', action='store_true')
    Importer(parser.parse_args().offline).run()

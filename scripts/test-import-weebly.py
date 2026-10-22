"""Focused checks for the lossy parts of the Weebly migration; no network."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('weebly', Path(__file__).with_name('import-weebly.py'))
weebly = importlib.util.module_from_spec(spec)
spec.loader.exec_module(weebly)


class ConversionTests(unittest.TestCase):
    def test_layout_table_keeps_image_caption_and_paragraphs(self):
        raw = '''<table class="wsite-multicol-table"><tr><td>
          <img src="/uploads/example.png" alt="A useful caption">
          <div class="paragraph">First paragraph.</div></td><td>
          <h2>Second column</h2><div class="paragraph"><strong>Important</strong> text.</div>
          </td></tr></table>'''
        markdown, details = weebly.convert_body(raw, lambda url: '/media/weebly/example.png')
        self.assertIn('![A useful caption](/media/weebly/example.png)', markdown)
        self.assertIn('## Second column', markdown)
        self.assertIn('**Important** text.', markdown)
        self.assertLess(markdown.index('First paragraph.'), markdown.index('Second column'))
        self.assertEqual(len(details['images']), 1)
        self.assertNotIn('<table', markdown)

    def test_active_embeds_become_links_and_hidden_boilerplate_is_removed(self):
        raw = '''<script>unwantedScript()</script><style>.unwanted{}</style>
          <div style="display:none">hidden file metadata</div><!--tracking-->
          <p>Visible text.</p><iframe src="http://www.youtube.com/embed/abc?wmode=opaque"></iframe>
          <a href="javascript:alert(1)">Keep the words</a>'''
        markdown, details = weebly.convert_body(raw, lambda url: url)
        self.assertIn('Visible text.', markdown)
        self.assertIn('Keep the words', markdown)
        self.assertIn('https://www.youtube.com/watch?v=abc', markdown)
        for unwanted in ['unwantedScript', 'hidden file metadata', '<iframe', 'javascript:', 'tracking']:
            self.assertNotIn(unwanted, markdown)
        self.assertEqual(len(details['embeds']), 1)

    def test_existing_editorial_changes_are_never_overwritten(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            draft, proposed = root / 'post.md', root / 'proposed'
            self.assertEqual(weebly.write_draft(draft, 'original', proposed), 'created')
            self.assertEqual(weebly.write_draft(draft, 'original', proposed), 'unchanged')
            draft.write_text('edited by the owner', encoding='utf-8')
            result = weebly.write_draft(draft, 'reconverted', proposed)
            self.assertEqual(result, 'preserved-existing; proposal-written')
            self.assertEqual(draft.read_text(), 'edited by the owner')
            self.assertEqual((proposed / 'post.md').read_text(), 'reconverted')

    def test_excluded_full_pages_cannot_be_recaptured(self):
        importer = weebly.Importer(offline=True)
        url = 'https://mebegu.weebly.com/blog/excluded'
        importer.exclusions = {url: {'reason': 'quarantined'}}
        with self.assertRaisesRegex(ValueError, 'capture excluded'):
            importer.fetch(url, Path('unused.html'))

    def test_source_urls_and_turkish_characters_survive(self):
        self.assertEqual(weebly.normalized('//mebegu.weebly.com/blog/archives/11-2013#comments'),
                         'https://mebegu.weebly.com/blog/archives/11-2013')
        markdown, _ = weebly.convert_body('<p>İstanbul, Gürçay &amp; yazılar.</p>', lambda url: url)
        self.assertIn('İstanbul, Gürçay & yazılar.', markdown)

    def test_html_is_not_written_as_a_public_image(self):
        with tempfile.TemporaryDirectory(dir=weebly.ROOT / '.local') as directory:
            path = Path(directory) / 'unexpected.png'
            with patch.object(weebly, 'urlopen') as open_url:
                response = open_url.return_value.__enter__.return_value
                response.headers = {'Content-Type': 'text/html'}
                with self.assertRaisesRegex(ValueError, 'Unexpected content type'):
                    weebly.Importer().fetch(weebly.BASE + '/uploads/unexpected.png', path, ('image/', 'application/pdf'))
            self.assertFalse(path.exists())


if __name__ == '__main__':
    unittest.main()

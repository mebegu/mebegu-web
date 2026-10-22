import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { postCalendarDate } from '../src/lib/post-dates.ts';

const ledger = JSON.parse(
  await readFile('archives/weebly/publication.json', 'utf8'),
);
const banners = JSON.parse(
  await readFile('docs/assets/blog-banners.json', 'utf8'),
);
assert.equal(banners.length, 4);
const base =
  `/${(process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '')}`.replace(
    /\/$/,
    '',
  );
const hash = (value) => createHash('sha256').update(value).digest('hex');
async function source(id) {
  const raw = await readFile(`src/content/writing/${id}.md`, 'utf8');
  const end = raw.indexOf('\n---', 4);
  assert.ok(end > 0, `Missing frontmatter: ${id}`);
  const header = raw.slice(4, end);
  const body = raw.slice(end + 4);
  const fields = Object.fromEntries(
    header
      .trim()
      .split('\n')
      .map((line) => {
        const colon = line.indexOf(':');
        return [line.slice(0, colon), JSON.parse(line.slice(colon + 1))];
      }),
  );
  return { fields, body };
}
const images = (body) =>
  [...body.matchAll(/!\[[^\]]*\]\((\/media\/weebly\/[^)]+)\)/g)].map(
    (m) => m[1],
  );
const localFiles = (body) =>
  [...body.matchAll(/\]\((\/media\/weebly\/[^\s)]+)/g)].map((m) => m[1]);
async function page(route) {
  return readFile(path.join('dist', route, 'index.html'), 'utf8');
}
const htmlEscape = (text) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
let translations = 0;
for (const record of ledger.originals) {
  const original = await source(record.id);
  assert.equal(
    hash(original.body),
    record.bodySha256,
    `Original text changed: ${record.id}`,
  );
  assert.equal(original.fields.title, record.title);
  assert.equal(original.fields.published, record.published);
  assert.equal(original.fields.draft, false);
  assert.equal(
    postCalendarDate({
      published: new Date(record.published),
      source: original.fields.source,
    }),
    record.date,
  );
  const html = await page(record.path);
  assert.ok(
    html.includes(htmlEscape(record.title)),
    `Original title missing: ${record.id}`,
  );
  assert.ok(
    html.includes(`datetime="${record.date}"`),
    `Original display day changed: ${record.id}`,
  );
  assert.doesNotMatch(html, /name="robots" content="noindex"/);
  assert.equal(original.fields.catalog.cover.src, record.cover);
  await access('public' + record.cover);
  for (const file of localFiles(original.body)) await access('public' + file);
  if (record.translationId) {
    const translation = await source(record.translationId);
    assert.equal(translation.fields.lang, 'en');
    assert.equal(translation.fields.draft, false);
    assert.equal(translation.fields.translatedFrom, record.id);
    assert.equal(
      translation.fields.translationKey,
      original.fields.translationKey,
    );
    assert.equal(translation.fields.published, record.published);
    assert.deepEqual(
      images(translation.body),
      images(original.body),
      `Translation images changed: ${record.id}`,
    );
    assert.deepEqual(
      localFiles(translation.body).sort(),
      localFiles(original.body).sort(),
      `Translation attachments changed: ${record.id}`,
    );
    for (const match of original.body.matchAll(/https?:\/\/[^\s<>"()[\]]+/g))
      assert.ok(
        translation.body.includes(match[0]),
        `Translation reference missing: ${match[0]}`,
      );
    const translatedHtml = await page(`/writing/${record.translationId}/`);
    assert.ok(translatedHtml.includes(`datetime="${record.date}"`));
    assert.ok(translatedHtml.includes('English translation'));
    assert.ok(
      html.includes(
        `hreflang="en" href="${process.env.SITE_URL || 'https://mebegu.github.io'}${base}/writing/${record.translationId}/"`,
      ),
    );
    translations++;
  }
}
for (const record of ledger.excluded) {
  const original = await source(record.id);
  assert.equal(
    hash(original.body),
    record.bodySha256,
    `Excluded archive text changed: ${record.id}`,
  );
  assert.equal(original.fields.draft, true);
  for (const route of [
    `/writing/${record.id}/`,
    `/tr/writing/${record.id}/`,
    `/writing/${record.id}-en/`,
  ])
    await assert.rejects(() => page(route), { code: 'ENOENT' });
}
for (const lang of ['en', 'tr']) {
  const html = await page(lang === 'tr' ? '/tr/writing/' : '/writing/');
  assert.ok(
    [...html.matchAll(/data-post-key="/g)].length >= ledger.originals.length,
  );
  assert.equal([...html.matchAll(/data-story="/g)].length, 4);
  assert.equal(
    [...html.matchAll(/data-banner-picture/g)].length,
    banners.length,
  );
  assert.doesNotMatch(
    html,
    /writing\/sample\/|Layout preview|Yerleşim taslağı/,
  );
  for (const record of ledger.originals) {
    assert.equal(
      html.split(`data-post-key="${record.id}"`).length - 1,
      1,
      `Duplicate or missing story: ${record.id}`,
    );
    const route =
      lang === 'en' && record.translationId
        ? `/writing/${record.translationId}/`
        : record.path;
    assert.ok(
      html.includes(`href="${base}${route}"`),
      `Missing catalog target: ${route}`,
    );
    assert.ok(html.includes(`src="${base}${record.cover}"`));
    assert.ok(html.includes(`datetime="${record.date}"`));
  }
  for (const record of ledger.excluded) assert.ok(!html.includes(record.id));
  const featuredHtml = html.split('class="catalog-library"')[0];
  for (const record of banners) {
    const original = await source(record.storyId);
    const image = original.fields.catalog.banner;
    assert.ok(image.width >= 1600 && image.width / image.height >= 1.9);
    assert.ok(
      image.mobile.width >= 1000 && image.mobile.height > image.mobile.width,
    );
    assert.notEqual(image.src, original.fields.catalog.cover.src);
    assert.ok(featuredHtml.includes(`src="${base}${image.src}"`));
    assert.ok(
      featuredHtml.includes(
        `${base}${image.mobile.src} ${image.mobile.width}w`,
      ),
    );
    assert.ok(
      !featuredHtml.includes(
        `src="${base}${original.fields.catalog.cover.src}"`,
      ),
      'A small card image leaked back into the banner',
    );
    for (const variant of [...image.sources, ...image.mobile.sources]) {
      await access('public' + variant.src);
      assert.ok(
        featuredHtml.includes(`${base}${variant.src} ${variant.width}w`),
      );
    }
  }
}
assert.equal(translations, 6);
assert.equal(
  postCalendarDate({
    published: new Date('2014-08-11T06:10:36Z'),
    source: { visibleDate: '10/8/2014' },
  }),
  '2014-08-10',
);
console.log(
  `Verified ${ledger.originals.length} published originals, ${translations} translations, source text hashes, images, dates, excluded article and ${banners.length} responsive banner sets.`,
);

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  readFile,
  writeFile,
  mkdir,
  rm,
  symlink,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  prepareAlamori,
  importAlamori,
  checkStoredAlamori,
  validateAlamori,
  alamoriPosts,
} from './lib/alamori-bundle.mjs';

const baseline = JSON.parse(await readFile('src/data/alamori.json', 'utf8'));
async function fixture(fn) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'alamori-public-test-'));
  const source = path.join(root, 'public'),
    site = path.join(root, 'site');
  await mkdir(path.join(source, 'media'), { recursive: true });
  await mkdir(site);
  const record = structuredClone(baseline);
  record.revision = 1;
  for (const [lang, image] of Object.entries(record.book.covers)) {
    image.src = `media/cover-${lang}.png`;
    await writeFile(
      path.join(source, image.src),
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jS1sAAAAASUVORK5CYII=',
        'base64',
      ),
    );
  }
  for (const preview of record.book.previews) {
    preview.src = `media/preview-${preview.language}.pdf`;
    await writeFile(
      path.join(source, preview.src),
      '%PDF-1.7\npublic preview fixture',
    );
  }
  await writeFile(path.join(source, 'page.json'), JSON.stringify(record));
  await writeFile(
    path.join(source, 'private-manuscript.txt'),
    'PRIVATE SOURCE MUST NEVER BE COPIED',
  );
  try {
    return await fn({ root, source, site, record });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
test('explicit public package exports only referenced assets, plain posts and no private identifiers', () =>
  fixture(async ({ source, site }) => {
    const bundle = await prepareAlamori(source);
    assert.equal(bundle.assets.size, 2); // identical cover bytes and identical PDF bytes deduplicate
    assert.ok(!bundle.json.includes('PRIVATE SOURCE'));
    assert.equal(alamoriPosts(bundle.record).size, 4);
    assert.equal((await importAlamori(bundle, site)).changed, true);
    const stored = JSON.parse(
      await readFile(path.join(site, 'src/data/alamori.json'), 'utf8'),
    );
    await checkStoredAlamori(stored, site);
    assert.equal((await importAlamori(bundle, site)).reason, 'unchanged');
    const content = await readFile(
      path.join(site, 'src/content/writing/alamori-story-tr.md'),
      'utf8',
    );
    assert.ok(content.includes('translationKey: "alamori-story"'));
  }));
test('dry run, disabled publication, monotonic revisions and conflicting replay are enforced', () =>
  fixture(async ({ source, site, record }) => {
    let bundle = await prepareAlamori(source);
    assert.equal((await importAlamori(bundle, site, true)).reason, 'dry-run');
    await assert.rejects(readFile(path.join(site, 'src/data/alamori.json')), {
      code: 'ENOENT',
    });
    await importAlamori(bundle, site);
    record.book.tagline.tr = 'Yeni public metin';
    await writeFile(path.join(source, 'page.json'), JSON.stringify(record));
    await assert.rejects(
      importAlamori(await prepareAlamori(source), site),
      /increment revision/,
    );
    record.revision = 2;
    await writeFile(path.join(source, 'page.json'), JSON.stringify(record));
    await importAlamori(await prepareAlamori(source), site);
    assert.equal((await importAlamori(bundle, site)).reason, 'stale');
    record.publish = false;
    await writeFile(path.join(source, 'page.json'), JSON.stringify(record));
    assert.equal(
      (await importAlamori(await prepareAlamori(source), site)).reason,
      'disabled',
    );
  }));
test('unknown fields, private paths, executable URLs, wrong PDFs and duplicate locales fail', () =>
  fixture(async ({ source, record }) => {
    const unknown = structuredClone(record);
    unknown.sourceRepository = 'private';
    assert.throws(() => validateAlamori(unknown), /unknown field/);
    const duplicates = structuredClone(record);
    duplicates.book.previews.push(duplicates.book.previews[0]);
    assert.throws(() => validateAlamori(duplicates));
    const unsafe = structuredClone(record);
    unsafe.book.feedback.url.tr = 'javascript:alert(1)';
    assert.throws(() => validateAlamori(unsafe));
    record.book.covers.tr.src = '../private.png';
    await writeFile(path.join(source, 'page.json'), JSON.stringify(record));
    await assert.rejects(prepareAlamori(source), /explicit local/);
    record.book.covers.tr.src = 'media/cover-tr.png';
    await writeFile(path.join(source, 'page.json'), JSON.stringify(record));
    await writeFile(
      path.join(source, 'media/preview-tr.pdf'),
      '<html>not a PDF</html>',
    );
    await assert.rejects(prepareAlamori(source), /must be a PDF/);
  }));
test('symlinked sources and manually authored destination posts are protected', () =>
  fixture(async ({ source, site, record, root }) => {
    await mkdir(path.join(root, 'outside'));
    await writeFile(path.join(root, 'outside', 'cover.png'), 'PRIVATE');
    await symlink(
      path.join(root, 'outside'),
      path.join(source, 'media-link'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    record.book.covers.tr.src = 'media-link/cover.png';
    await writeFile(path.join(source, 'page.json'), JSON.stringify(record));
    await assert.rejects(prepareAlamori(source));
    record.book.covers.tr.src = 'media/cover-tr.png';
    await writeFile(path.join(source, 'page.json'), JSON.stringify(record));
    await mkdir(path.join(site, 'src/content/writing'), { recursive: true });
    await writeFile(
      path.join(site, 'src/content/writing/alamori-story-tr.md'),
      'A manually authored post',
    );
    await assert.rejects(
      importAlamori(await prepareAlamori(source), site),
      /manually authored/,
    );
    assert.equal(
      await readFile(
        path.join(site, 'src/content/writing/alamori-story-tr.md'),
        'utf8',
      ),
      'A manually authored post',
    );
  }));

import { createHash, randomUUID } from 'node:crypto';
import { mkdir, rename, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import schema from '../../schemas/alamori-publication.schema.json' with { type: 'json' };
import { publicLink, stableJson, validateShape } from './workshop-schema.mjs';
import { safeFile, MAX_MANIFEST_BYTES } from './workshop-bundle.mjs';

const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const assetLimit = 20 * 1024 * 1024;
export function validateAlamori(record) {
  validateShape(record, schema);
  const languages = record.book.previews.map((item) => item.language);
  if (new Set(languages).size !== languages.length)
    throw Error('Duplicate preview language');
  if (!record.book.synopsis.length)
    throw Error('A public synopsis is required');
  const ids = record.book.articles
    .filter((item) => item.post)
    .map((item) => item.post.id);
  if (new Set(ids).size !== ids.length) throw Error('Duplicate public post id');
  for (const article of record.book.articles.filter((item) => item.post)) {
    if (!article.post.paragraphs.length) throw Error('Empty public post');
    for (const lang of ['tr', 'en'])
      if (
        article.url[lang] !==
        `${lang === 'tr' ? 'tr/' : ''}writing/${article.post.id}-${lang}/`
      )
        throw Error('Public post URL does not match its id');
  }
  for (const item of [...record.book.articles, record.book.feedback])
    publicLink(item.url, 'public link');
  return record;
}
const postMarker = '<!-- Generated from the public Alamori publication. -->';
export function alamoriPosts(record) {
  const posts = new Map();
  for (const article of record.book.articles.filter((item) => item.post)) {
    for (const lang of ['tr', 'en']) {
      const { post } = article;
      const frontmatter = {
        title: article.title[lang],
        description: article.summary[lang],
        published: post.published,
        category: 'Atlantis',
        draft: false,
        lang,
        translationKey: post.id,
        ...(lang === 'en' ? { translatedFrom: `${post.id}-tr` } : {}),
        catalog: {
          shelf: 'culture',
          summary: article.summary,
          cover: {
            ...record.book.covers[lang],
            src: `/${record.book.covers[lang].src}`,
          },
          tone: 'green',
        },
      };
      // Generated posts are plain paragraphs, not a way to inject HTML or MDX.
      const escape = (text) =>
        text.replace(/[\\`*{}\[\]()#+.!_>|<>]/g, '\\$&').replace(/\r?\n/g, ' ');
      const body = post.paragraphs
        .map((paragraph) => escape(paragraph[lang]))
        .join('\n\n');
      const text = `---\n${Object.entries(frontmatter)
        .map(
          ([key, value]) =>
            `${key}: ${JSON.stringify(JSON.parse(stableJson(value)))}`,
        )
        .join('\n')}\n---\n\n${postMarker}\n\n${body}\n`;
      posts.set(`src/content/writing/${post.id}-${lang}.md`, text);
    }
  }
  return posts;
}
export function compareAlamori(record, previous) {
  if (!previous) return 'update';
  validateAlamori(previous);
  if (record.revision < previous.revision) return 'stale';
  if (record.revision === previous.revision) {
    if (stableJson(record) !== stableJson(previous))
      throw Error('Public content changed: increment revision');
    return 'unchanged';
  }
  return 'update';
}
export async function prepareAlamori(source) {
  const record = JSON.parse(
    (await safeFile(source, 'page.json', MAX_MANIFEST_BYTES)).toString('utf8'),
  );
  validateAlamori(record);
  if (!record.publish) return { skipped: true };
  const normalized = structuredClone(record);
  const assets = new Map();
  let total = 0;
  async function asset(value, pdf = false) {
    if (!/^media\/[a-z\d][a-z\d._-]*$/i.test(value))
      throw Error('Only explicit local media files are accepted');
    const ext = path.extname(value).toLowerCase();
    if (
      !(pdf ? ['.pdf'] : ['.png', '.jpg', '.jpeg', '.webp', '.avif']).includes(
        ext,
      )
    )
      throw Error('Unsupported public asset');
    const bytes = await safeFile(source, value, assetLimit);
    if (pdf && !bytes.subarray(0, 5).equals(Buffer.from('%PDF-')))
      throw Error('Preview must be a PDF');
    const destination = `media/alamori/${digest(bytes)}${ext}`;
    if (!assets.has(destination)) {
      total += bytes.length;
      assets.set(destination, bytes);
    }
    if (total > 50 * 1024 * 1024)
      throw Error('Alamori public bundle exceeds 50 MiB');
    return destination;
  }
  for (const image of Object.values(normalized.book.covers))
    image.src = await asset(image.src);
  for (const preview of normalized.book.previews)
    preview.src = await asset(preview.src, true);
  validateAlamori(normalized);
  return {
    skipped: false,
    record: normalized,
    assets,
    json: stableJson(normalized),
  };
}
export async function checkStoredAlamori(record, site) {
  validateAlamori(record);
  if (!record.publish) throw Error('Stored publication must be enabled');
  for (const item of [
    ...Object.values(record.book.covers),
    ...record.book.previews,
  ]) {
    if (
      !/^media\/alamori\/[a-f\d]{64}\.(png|jpe?g|webp|avif|pdf)$/.test(item.src)
    )
      throw Error('Stored Alamori media escapes its directory');
    const bytes = await safeFile(
      path.join(site, 'public'),
      item.src,
      assetLimit,
    );
    if (digest(bytes) !== path.basename(item.src).split('.')[0])
      throw Error('Alamori asset hash mismatch');
    if (
      Object.hasOwn(item, 'pages') &&
      (!item.src.endsWith('.pdf') ||
        !bytes.subarray(0, 5).equals(Buffer.from('%PDF-')))
    )
      throw Error('Invalid preview PDF');
  }
  for (const [name, content] of alamoriPosts(record)) {
    const stored = (await safeFile(site, name, MAX_MANIFEST_BYTES)).toString(
      'utf8',
    );
    if (stored !== content)
      throw Error('Generated Alamori post differs from public content');
  }
}
export async function importAlamori(bundle, site, dryRun = false) {
  if (bundle.skipped) return { changed: false, reason: 'disabled' };
  const destination = path.join(site, 'src/data/alamori.json');
  let previous;
  try {
    previous = JSON.parse(
      (
        await safeFile(site, 'src/data/alamori.json', MAX_MANIFEST_BYTES)
      ).toString('utf8'),
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const action = compareAlamori(bundle.record, previous);
  if (action !== 'update') return { changed: false, reason: action };
  if (dryRun)
    return { changed: true, reason: 'dry-run', assets: bundle.assets.size };
  const posts = alamoriPosts(bundle.record);
  const oldPosts = previous ? alamoriPosts(previous) : new Map();
  for (const name of new Set([...posts.keys(), ...oldPosts.keys()])) {
    try {
      const text = (await safeFile(site, name, MAX_MANIFEST_BYTES)).toString(
        'utf8',
      );
      if (!text.includes(postMarker))
        throw Error('Cannot overwrite a manually authored post');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  // Reject symlinked destinations even when an earlier public directory exists.
  for (const directory of [
    'public/media/alamori',
    'src/data',
    'src/content/writing',
  ]) {
    let current = path.resolve(site);
    const { lstat } = await import('node:fs/promises');
    for (const part of ['', ...directory.split('/')]) {
      if (part) current = path.join(current, part);
      try {
        const info = await lstat(current);
        if (info.isSymbolicLink() || !info.isDirectory())
          throw Error('Unsafe publication destination');
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        await mkdir(current);
      }
    }
  }
  for (const [name, bytes] of bundle.assets) {
    try {
      await writeFile(path.join(site, 'public', name), bytes, { flag: 'wx' });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const existing = await safeFile(
        path.join(site, 'public'),
        name,
        assetLimit,
      );
      if (digest(existing) !== digest(bytes))
        throw Error('Corrupt existing public asset');
    }
  }
  for (const [name, content] of posts)
    await writeFile(path.join(site, name), content);
  for (const name of oldPosts.keys())
    if (!posts.has(name)) await unlink(path.join(site, name));
  const temporary = `${destination}.${randomUUID()}.tmp`;
  await writeFile(temporary, bundle.json, { flag: 'wx' });
  await rename(temporary, destination);
  return { changed: true, reason: 'updated', revision: bundle.record.revision };
}

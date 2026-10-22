import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('dist');
const base =
  `/${(process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '')}`.replace(
    /\/$/,
    '',
  );
const origin = new URL(process.env.SITE_URL || 'https://mebegu.github.io')
  .origin;
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? files(path.join(directory, entry.name))
          : [path.join(directory, entry.name)],
      ),
    )
  ).flat();
}
async function localTarget(url) {
  const pathname = decodeURIComponent(url.pathname);
  assert.ok(
    !base || pathname === base || pathname.startsWith(`${base}/`),
    `Link escapes deployment base: ${url}`,
  );
  const local = pathname.slice(base.length).replace(/^\//, '');
  const target = path.join(
    output,
    local.endsWith('/') || !local ? `${local}index.html` : local,
  );
  assert.ok(await stat(target), `Missing local target: ${url}`);
  return target;
}
const allFiles = await files(output);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
for (const prefix of ['', 'tr/']) {
  for (const route of [
    'index.html',
    'about/index.html',
    'writing/index.html',
    'atlantis/index.html',
    'professional/index.html',
    'alamori/index.html',
    'projects/index.html',
  ]) {
    assert.ok(
      await stat(path.join(output, prefix, route)),
      `Missing route: ${prefix}${route}`,
    );
  }
}
assert.ok(await stat(path.join(output, '404.html')));
let checked = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(output, file).replaceAll(path.sep, '/');
  const lang = relative.startsWith('tr/') ? 'tr' : 'en';
  assert.ok(
    html.includes(`<html lang="${lang}"`),
    `Incorrect page language: ${relative}`,
  );
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `Expected one h1: ${relative}`,
  );
  assert.match(html, /name="description"/, `Missing description: ${relative}`);
  assert.doesNotMatch(
    html,
    /application\/rss\+xml|href="[^\"]*rss\.xml/,
    `RSS remains in ${relative}`,
  );
  assert.ok(!html.includes('\ufffd'), `Invalid encoding: ${relative}`);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/);
  const expected = `${origin}${base}/${relative.replace(/index\.html$/, '')}`;
  assert.equal(canonical?.[1], expected, `Incorrect canonical: ${relative}`);
  for (const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
    const raw = match[1].replaceAll('&amp;', '&');
    const url = new URL(raw, expected);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin)
      continue;
    const target = await localTarget(url);
    if (url.hash && target.endsWith('.html')) {
      const targetHtml = await readFile(target, 'utf8');
      assert.ok(
        targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `Missing anchor: ${url}`,
      );
    }
    checked += 1;
  }
  for (const tag of html.matchAll(/<link[^>]+hreflang="(en|tr)"[^>]*>/g)) {
    const destination = tag[0].match(/href="([^"]+)"/)[1];
    const target = await localTarget(new URL(destination));
    const translated = await readFile(target, 'utf8');
    assert.ok(
      translated.includes(`<html lang="${tag[1]}"`),
      `Incorrect alternate language: ${destination}`,
    );
    assert.ok(
      translated.includes(`hreflang="${lang}" href="${expected}"`),
      `Non-reciprocal translation: ${relative}`,
    );
  }
}
assert.ok(
  !allFiles.some((file) => file.endsWith('rss.xml')),
  'RSS files must not be generated',
);
console.log(
  `Verified ${htmlFiles.length} HTML pages, ${checked} local references, reciprocal translations and canonicals; no RSS (base: ${base || '/'}).`,
);

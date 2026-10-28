/** Produce the phone-free, client-anonymized public copy of the released CV.
 * Uses the upstream designed HTML, not the website's CV-only print layout.
 * node scripts/build-public-cv.mjs --playwright <installed module> --browser <exe>
 * Needs gh read access to the pinned upstream release and external browser tooling.
 */
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((items, value, index, all) => {
    if (value.startsWith('--')) items.push([value.slice(2), all[index + 1]]);
    return items;
  }, []),
);
if (!args.playwright || !args.browser || !args.policy)
  throw new Error(
    'Supply external --playwright <module>, --browser <executable> and private --policy <json>',
  );
const policy = JSON.parse(await readFile(resolve(args.policy), 'utf8'));
const snapshot = JSON.parse(
  await readFile('src/data/cv.public.generated.json', 'utf8'),
);
const revision = snapshot.provenance.revision;
const endpoint = `repos/mebegu/career-docs/contents/personal-cv/versions/v2_2026-10-28/cv.html?ref=${revision}`;
const response = JSON.parse(
  execFileSync('gh', ['api', endpoint], {
    encoding: 'utf8',
    maxBuffer: 2_000_000,
  }),
);
let html = Buffer.from(response.content, 'base64').toString('utf8');
html = html.replace(/<li>(?:(?!<\/li>).)*\+[\d\s()-]{7,}\s*<\/li>/gs, '');
for (const [pattern, replacement] of policy.rules)
  html = html.replace(new RegExp(pattern, 'gi'), replacement);
if (
  /\+49[\d\s()-]{7,}/i.test(html) ||
  policy.forbidden.some((token) =>
    new RegExp(
      `\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      'i',
    ).test(html),
  )
)
  throw new Error('Public publication scrub failed; no file saved');
await mkdir('.local/cv-public', { recursive: true });
await mkdir('public/cv', { recursive: true });
const safeSource = resolve('.local/cv-public/cv.html');
await writeFile(safeSource, html);
const { chromium } = await import(pathToFileURL(resolve(args.playwright)).href);
const browser = await chromium.launch({
  executablePath: args.browser,
  headless: true,
});
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(safeSource).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: 'public/cv/mehmet-berk-gurcay-cv.pdf',
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
  });
  const fonts = await page.evaluate(() =>
    [...document.fonts]
      .filter((font) => font.status === 'loaded')
      .map((font) => font.family),
  );
  const pdf = await readFile('public/cv/mehmet-berk-gurcay-cv.pdf');
  await writeFile(
    '.local/cv-public/build.json',
    JSON.stringify(
      {
        revision,
        generated: new Date().toISOString(),
        fonts,
        sha256: createHash('sha256').update(pdf).digest('hex'),
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    'Built the anonymized public designed PDF; source revision:',
    revision,
  );
} finally {
  await browser.close();
}

/** Lean browser oracle: measurements on scoped routes, two primary-route images by default. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { fingerprint } from './oracle-plan.mjs';
import { inspectScopes, requireScopes } from './oracle-scopes.mjs';

const { values } = parseArgs({
  options: {
    plan: { type: 'string', default: '.local/oracles/plan.json' },
    playwright: { type: 'string' },
    browser: { type: 'string' },
    url: { type: 'string' },
    out: { type: 'string', default: '.local/oracles/browser' },
    selector: { type: 'string' },
    print: { type: 'boolean', default: false },
  },
});
const plan = JSON.parse(await readFile(values.plan, 'utf8'));
if (!plan.routes.length) {
  console.log('No visible changes: browser review skipped.');
  process.exit(0);
}
if (!plan.intent.trim())
  throw new Error(
    'Record the intended visible result with oracle:plan --intent before capture.',
  );
if (plan.needsExactArticleRoute)
  throw new Error('Add the exact affected article with oracle:plan --route.');
if (fingerprint(plan.files) !== plan.fingerprint)
  throw new Error(
    'Files changed after planning. Refresh oracle:plan before capture.',
  );
const modulePath = values.playwright || process.env.ORACLE_PLAYWRIGHT;
if (!modulePath)
  throw new Error(
    'Use --playwright or ORACLE_PLAYWRIGHT with an existing installed module. Do not add a site dependency.',
  );
const baseURL = values.url || plan.baseURL;
if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(baseURL).hostname))
  throw new Error('Use a local preview server.');
const { chromium } = await import(pathToFileURL(resolve(modulePath)).href);
const out = resolve(values.out);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(values.browser || process.env.ORACLE_BROWSER
    ? { executablePath: values.browser || process.env.ORACLE_BROWSER }
    : {}),
});
const report = {
  capturedAt: new Date().toISOString(),
  head: plan.head,
  fingerprint: plan.fingerprint,
  intent: plan.intent,
  reference: plan.reference,
  browser: browser.version(),
  baseURL,
  automated: 'PASS',
  visualVerdict: 'NOT CHECKED',
  ownerApproval: 'NOT REQUESTED',
  results: [],
  limitations: [
    'Bounds are not an overlap, contrast, accessibility or aesthetic verdict.',
    'Only the first native disclosure is exercised automatically. Test the changed user journey explicitly.',
    'Editorial review and approval are separate from this report.',
  ],
};
try {
  for (const route of plan.routes) {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [],
      assets = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', (r) => {
      if (
        r.status() >= 400 &&
        new URL(r.url()).origin === new URL(baseURL).origin
      )
        assets.push({ url: r.url(), status: r.status() });
    });
    page.on('requestfailed', (r) => {
      if (new URL(r.url()).origin === new URL(baseURL).origin)
        assets.push({ url: r.url(), error: r.failure()?.errorText });
    });
    for (const width of plan.widths) {
      errors.length = 0;
      assets.length = 0;
      await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
      const response = await page.goto(new URL(route, baseURL).href, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
      requireScopes(
        await page.evaluate(inspectScopes, [
          'main',
          ...(route.endsWith('/professional/')
            ? [
                '#cv',
                '#project-details',
                '.cv-contact-links',
                '.profile-disclosure',
                '[data-featured-project]',
              ]
            : []),
          ...(values.selector && route === plan.screenshotRoute
            ? [values.selector]
            : []),
        ]),
      );
      await page.evaluate(async () => {
        document
          .querySelectorAll('img')
          .forEach((img) => (img.loading = 'eager'));
        await Promise.race([
          Promise.all([
            document.fonts.ready,
            ...[...document.images].map((img) => img.decode().catch(() => {})),
          ]),
          new Promise((r) => setTimeout(r, 5000)),
        ]);
      });
      const measure = () =>
        page.evaluate(() => ({
          documentWidth: document.documentElement.scrollWidth,
          overflow: [...document.querySelectorAll('main *, .site-toolbar *')]
            .filter((el) => {
              if (
                !el.getClientRects().length ||
                getComputedStyle(el).visibility === 'hidden'
              )
                return false;
              const r = el.getBoundingClientRect();
              return r.left < -1 || r.right > innerWidth + 1;
            })
            .slice(0, 12)
            .map((el) => ({
              tag: el.tagName,
              class: String(el.className),
              text: el.textContent.trim().slice(0, 80),
            })),
          brokenImages: [...document.images]
            .filter((img) => !img.complete || !img.naturalWidth)
            .map((img) => img.getAttribute('src')),
          h1Count: document.querySelectorAll('h1').length,
          mainCount: document.querySelectorAll('main').length,
          fontsReady: document.fonts.status === 'loaded',
        }));
      const result = {
        route,
        width,
        status: response?.status(),
        ...(await measure()),
        errors: [...errors],
        failedAssets: [...assets],
        screenshots: [],
      };
      const name = (route.replace(/^\/+|\/+$/g, '') || 'home').replace(
        /[^a-zA-Z0-9-]/g,
        '-',
      );
      const save = async (suffix) => {
        const file = `${name}-${width}${suffix}.png`;
        const target =
          values.selector && route === plan.screenshotRoute
            ? page.locator(values.selector)
            : page;
        await target.screenshot({
          path: join(out, file),
          animations: 'disabled',
        });
        result.screenshots.push(file);
      };
      if (route === plan.screenshotRoute && plan.screenshots.includes(width))
        await save('');
      const disclosure = page.locator('main details:visible').first();
      if (await disclosure.count()) {
        const wasOpen = await disclosure.evaluate((el) => el.open);
        await disclosure.locator(':scope > summary').click();
        result.disclosure = await measure();
        await disclosure.evaluate((el, open) => (el.open = open), wasOpen);
      }
      result.errors = [...errors];
      result.failedAssets = [...assets];
      result.pass =
        result.status === 200 &&
        result.documentWidth <= width &&
        result.overflow.length === 0 &&
        result.brokenImages.length === 0 &&
        result.h1Count === 1 &&
        result.mainCount === 1 &&
        result.fontsReady &&
        !errors.length &&
        !assets.length &&
        (!result.disclosure ||
          (result.disclosure.documentWidth <= width &&
            !result.disclosure.overflow.length &&
            !result.disclosure.brokenImages.length));
      if (!result.pass) {
        report.automated = 'FAIL';
        await save('-failure');
      }
      report.results.push(result);
      console.log(`${result.pass ? 'PASS' : 'FAIL'} ${route} ${width}px`);
    }
    if (values.print && route === plan.screenshotRoute) {
      await page.pdf({
        path: join(out, 'print.pdf'),
        format: 'A4',
        preferCSSPageSize: true,
        printBackground: false,
      });
      report.print = 'print.pdf; inspect every page separately';
    }
    await context.close();
  }
} catch (error) {
  report.automated = 'FAIL';
  report.error = error.message;
  throw error;
} finally {
  report.stale = fingerprint(plan.files) !== plan.fingerprint;
  if (report.stale) report.automated = 'FAIL';
  await writeFile(
    join(out, 'checks.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  await browser.close();
}
if (report.automated === 'FAIL') process.exitCode = 1;

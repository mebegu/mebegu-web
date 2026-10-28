/** Capture browser evidence. Requires existing external Playwright tooling, never a site dependency.
 * node scripts/visual-oracle.mjs --config <json> --playwright <module> --browser <exe> --out <dir>
 * Automated checks support a separate human visual verdict; they do not certify design quality.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { inspectScopes, requireScopes } from './oracle-scopes.mjs';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((items, value, i, all) => {
    if (value.startsWith('--')) items.push([value.slice(2), all[i + 1]]);
    return items;
  }, []),
);
if (!args.config || !args.playwright || !args.out) {
  throw new Error(
    'Required: --config <json> --playwright <installed Playwright module path> --out <evidence folder>; optional --browser <executable>',
  );
}
const config = JSON.parse(await readFile(resolve(args.config), 'utf8'));
const { chromium } = await import(pathToFileURL(resolve(args.playwright)).href);
const out = resolve(args.out);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(args.browser ? { executablePath: args.browser } : {}),
});
const report = {
  capturedAt: new Date().toISOString(),
  intent: config.intent,
  humanReview: 'pending',
  results: [],
};
let failures = 0;
try {
  for (const route of config.routes) {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    const failedAssets = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (
        response.status() >= 400 &&
        new URL(response.url()).origin === new URL(config.baseURL).origin
      )
        failedAssets.push({ url: response.url(), status: response.status() });
    });
    for (const viewport of config.viewports) {
      failedAssets.length = 0;
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      const response = await page.goto(
        new URL(route.path, config.baseURL).href,
        { waitUntil: 'networkidle' },
      );
      requireScopes(
        await page.evaluate(
          inspectScopes,
          [
            config.contentSelector || 'main',
            ...(config.highlightSelector ? [config.highlightSelector] : []),
            ...(config.englishSelectors || ['#cv', '#project-details']),
          ].filter((value, index, all) => all.indexOf(value) === index),
        ),
      );
      if (
        config.projectSelector &&
        !(await page.locator(config.projectSelector).count())
      )
        throw new Error(
          `Required project selector missing: ${config.projectSelector}`,
        );
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        document
          .querySelectorAll('img')
          .forEach((img) => (img.loading = 'eager'));
        await Promise.all(
          [...document.images].map((img) => img.decode().catch(() => {})),
        );
      });
      const result = await page.evaluate(
        ({
          sectionOrder,
          contentSelector,
          expectedText,
          requiredFonts,
          englishSelectors,
        }) => {
          const scope = document.querySelector(contentSelector);
          const normalize = (s) => s.replace(/\s+/g, ' ').trim();
          const content = normalize(scope?.textContent || '');
          const headings = [...document.querySelectorAll('main h2')].map((x) =>
            x.textContent.trim(),
          );
          const overflow = [
            ...document.querySelectorAll('main *, .site-toolbar *'),
          ]
            .filter((el) => {
              if (
                !el.getClientRects().length ||
                getComputedStyle(el).visibility === 'hidden'
              )
                return false;
              const rect = el.getBoundingClientRect();
              return rect.right > innerWidth + 1 || rect.left < -1;
            })
            .slice(0, 12)
            .map((el) => ({
              tag: el.tagName,
              class: el.className,
              text: el.textContent.trim().slice(0, 90),
              rect: el.getBoundingClientRect().toJSON(),
            }));
          const rgb = (color) => (color.match(/[\d.]+/g) || []).map(Number);
          const luminance = (color) =>
            rgb(color)
              .slice(0, 3)
              .map((v) => v / 255)
              .map((v) =>
                v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
              )
              .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
          const contrastFailures = [];
          let checkedTextNodes = 0;
          const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.textContent.trim()) continue;
            const el = node.parentElement;
            if (el.closest('script, style, svg')) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            if (
              ![...range.getClientRects()].some(
                (rect) => rect.width > 0 && rect.height > 0,
              )
            )
              continue;
            const style = getComputedStyle(el);
            if (style.visibility === 'hidden') continue;
            let backgroundEl = el;
            let background = getComputedStyle(backgroundEl).backgroundColor;
            while (
              (background === 'rgba(0, 0, 0, 0)' ||
                background === 'transparent') &&
              backgroundEl.parentElement
            ) {
              backgroundEl = backgroundEl.parentElement;
              background = getComputedStyle(backgroundEl).backgroundColor;
            }
            // Flat opaque colors only. Complex image/alpha backgrounds need separate visual checks.
            if (rgb(background).length > 3 && rgb(background)[3] < 1) continue;
            const values = [luminance(style.color), luminance(background)].sort(
              (a, b) => b - a,
            );
            const ratio = (values[0] + 0.05) / (values[1] + 0.05);
            const size = parseFloat(style.fontSize);
            const large =
              size >= 24 ||
              (size >= 18.66 && parseFloat(style.fontWeight) >= 700);
            checkedTextNodes++;
            if (ratio < (large ? 3 : 4.5))
              contrastFailures.push({
                text: node.textContent.trim().slice(0, 90),
                foreground: style.color,
                background,
                ratio,
              });
          }
          const loadedFonts = [...document.fonts]
            .filter((x) => x.status === 'loaded')
            .map((x) => x.family.replace(/["']/g, ''));
          return {
            width: innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            headings,
            sectionOrderOK:
              !sectionOrder ||
              JSON.stringify(headings) === JSON.stringify(sectionOrder),
            missingText: (expectedText || []).filter(
              (x) => !content.includes(normalize(x)),
            ),
            longDashes: (content.match(/[\u2014\u2015]/g) || []).length,
            phoneLinks: document.querySelectorAll('a[href^="tel:"]').length,
            bodyFont: getComputedStyle(document.body).fontFamily,
            fontFaces: [...document.fonts].map((x) => ({
              family: x.family,
              status: x.status,
            })),
            fontsOK: (requiredFonts || []).every((font) =>
              loadedFonts.includes(font),
            ),
            contrastFailures,
            checkedTextNodes,
            fontsReady: document.fonts.status,
            overflow,
            h1Count: document.querySelectorAll('h1').length,
            downloadPath: document
              .querySelector('a[download]')
              ?.getAttribute('href'),
            detailsCount: document.querySelectorAll('details').length,
            englishContent: englishSelectors.every(
              (selector) => document.querySelector(selector)?.lang === 'en',
            ),
          };
        },
        {
          sectionOrder: config.sectionOrder,
          contentSelector: config.contentSelector || 'main',
          expectedText: config.expectedText,
          requiredFonts: config.requiredFonts,
          englishSelectors: config.englishSelectors || [
            '#cv',
            '#project-details',
          ],
        },
      );
      result.route = route.id;
      result.viewport = viewport;
      result.status = response.status();
      result.consoleErrors = [...errors];
      result.failedAssets = [...failedAssets];
      if (result.downloadPath) {
        const download = await context.request.get(
          new URL(result.downloadPath, config.baseURL).href,
        );
        result.download = {
          status: download.status(),
          contentType: download.headers()['content-type'],
        };
      }
      const file = `${route.id}-${viewport.width}`;
      await page.screenshot({
        path: join(out, `${file}.png`),
        animations: 'disabled',
      });
      if (viewport.captureFull)
        await page.screenshot({
          path: join(out, `${file}-full.png`),
          fullPage: true,
          animations: 'disabled',
        });
      if (viewport.width === 390 || viewport.width === 1280) {
        const highlights = page.locator(
          config.highlightSelector || '.section-skill-highlights',
        );
        if (await highlights.count())
          await highlights.screenshot({
            path: join(out, `${file}-highlights.png`),
          });
        const first = page.locator(config.projectSelector || 'details').first();
        if (await first.count()) {
          await first.locator('summary').click();
          result.detailsOpens = (await first.getAttribute('open')) !== null;
          result.overflowWhenExpanded = await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          );
          await first.screenshot({
            path: join(out, `${file}-project-open.png`),
          });
          await first.locator('summary').click();
          await first.locator('summary').focus();
          await page.keyboard.press('Tab');
          await page.keyboard.press('Shift+Tab');
          result.summaryFocusStyle = await first
            .locator('summary')
            .evaluate((el) => {
              const css = getComputedStyle(el);
              return {
                outline: css.outlineStyle,
                width: css.outlineWidth,
                color: css.outlineColor,
              };
            });
        }
      }
      result.pass =
        result.status === 200 &&
        result.documentWidth <= result.width &&
        !result.overflow.length &&
        result.sectionOrderOK &&
        !result.missingText.length &&
        result.h1Count === 1 &&
        !result.consoleErrors.length &&
        !result.failedAssets.length &&
        !result.phoneLinks &&
        !result.overflowWhenExpanded &&
        result.fontsOK &&
        result.englishContent &&
        !result.contrastFailures.length &&
        (!result.download || result.download.status === 200);
      if (!result.pass) failures++;
      report.results.push(result);
      console.log(
        `${result.pass ? 'PASS' : 'FAIL'} ${route.id} ${viewport.width}px`,
      );
    }
    if (route.print) {
      await page.setViewportSize({ width: 1280, height: 1000 });
      await page.goto(new URL(route.path, config.baseURL).href);
      requireScopes(
        await page.evaluate(inspectScopes, [
          '#cv',
          '#project-details',
          '.site-toolbar',
          '.footer',
          '.cv-actions',
        ]),
      );
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMedia({ media: 'print' });
      await page.pdf({
        path: join(out, `${route.id}-print.pdf`),
        format: 'A4',
        printBackground: false,
        preferCSSPageSize: true,
      });
      const printResult = {
        route: route.id,
        print: await page.evaluate(() => ({
          hiddenChrome: [
            '.site-toolbar',
            '.footer',
            '#project-details',
            '.cv-actions',
          ].every(
            (s) =>
              getComputedStyle(document.querySelector(s)).display === 'none',
          ),
          background: getComputedStyle(document.body).backgroundColor,
          textColor: getComputedStyle(document.querySelector('#cv')).color,
        })),
      };
      printResult.pass = printResult.print.hiddenChrome;
      if (!printResult.print.hiddenChrome) failures++;
      report.results.push(printResult);
    }
    await context.close();
  }
} finally {
  await writeFile(
    join(out, 'checks.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  await browser.close();
}
if (failures) process.exitCode = 1;

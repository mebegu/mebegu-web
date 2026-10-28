/** Optional real-browser regression. Uses external Playwright and a running local build. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve, join } from 'node:path';
import { inspectScopes, requireScopes } from './oracle-scopes.mjs';

test(
  'Professional career stars, intro panels, native fallback, print and oracle scopes',
  {
    skip: !process.env.ORACLE_PLAYWRIGHT
      ? 'Set ORACLE_PLAYWRIGHT to existing external tooling'
      : false,
  },
  async () => {
    const base = process.env.ORACLE_URL || 'http://127.0.0.1:4321';
    assert.ok(
      ['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname),
    );
    const out = resolve(process.env.ORACLE_OUT || '.local/professional-panels');
    await mkdir(out, { recursive: true });
    const { chromium } = await import(
      pathToFileURL(resolve(process.env.ORACLE_PLAYWRIGHT)).href
    );
    const browser = await chromium.launch({
      headless: true,
      ...(process.env.ORACLE_BROWSER
        ? { executablePath: process.env.ORACLE_BROWSER }
        : {}),
    });
    const report = [];
    try {
      for (const route of ['/professional/', '/tr/professional/']) {
        for (const width of [1280, 768, 390, 360]) {
          const page = await browser.newPage({
            viewport: { width, height: width < 700 ? 844 : 900 },
            reducedMotion: 'reduce',
          });
          const errors = [];
          page.on('pageerror', (error) => errors.push(error.message));
          await page.goto(new URL(route, base).href, {
            waitUntil: 'networkidle',
          });
          await page.evaluate(() => document.fonts.ready);
          const stars = page.locator('[data-career-star]');
          assert.equal(await stars.count(), 15);
          assert.equal(
            await page.locator('[data-featured-project]').isVisible(),
            false,
          );
          assert.equal(await page.locator('.atlas-connections').count(), 0);
          assert.equal(await page.locator('[data-skill]').count(), 0);
          const toCheck =
            width === 1280 ? await stars.all() : [stars.first(), stars.last()];
          for (const star of toCheck) {
            await star.click();
            assert.equal(
              await page.locator('[data-featured-project]').isVisible(),
              true,
            );
            assert.equal(
              await page.locator('[data-feature-panel]:visible').count(),
              1,
            );
            assert.equal(
              await page
                .locator('[data-career-star][aria-expanded="true"]')
                .count(),
              1,
            );
            assert.equal(
              await page
                .locator('[data-feature-panel]:visible h3')
                .evaluate((el) => el === document.activeElement),
              true,
            );
            await page.keyboard.press('Escape');
            assert.equal(
              await page.locator('[data-featured-project]').isVisible(),
              false,
            );
            assert.equal(
              await star.evaluate((el) => el === document.activeElement),
              true,
            );
          }
          await stars.first().click();
          await page.locator('[data-close-career]').click();
          assert.equal(
            await page.locator('[data-featured-project]').isVisible(),
            false,
          );
          if (width === 1280) {
            await stars.last().click();
            await page
              .locator('[data-feature-panel]:visible .career-more')
              .click();
            assert.equal(
              await page.evaluate(() => location.hash),
              '#experience',
            );
            await page.waitForFunction(
              () => document.activeElement?.id === 'cv-experience-title',
            );
            await page.goto(new URL(route, base).href, {
              waitUntil: 'networkidle',
            });
            await page.locator('[data-career-star]').first().click();
            await page
              .locator('[data-feature-panel]:visible .career-more')
              .click();
            assert.equal(await page.locator('[data-project][open]').count(), 1);
            await page.goto(new URL(route, base).href, {
              waitUntil: 'networkidle',
            });
          }
          const contact = page.locator('.cv-contact-links');
          const profile = page.locator('.profile-disclosure');
          const open = (panel) => panel.evaluate((el) => el.open);
          await contact.locator('summary').click();
          await profile.locator('summary').click();
          assert.equal(await open(contact), false);
          assert.equal(await open(profile), true);
          await page.keyboard.press('Escape');
          assert.equal(await open(profile), false);
          assert.equal(
            await profile
              .locator('summary')
              .evaluate((el) => el === document.activeElement),
            true,
          );
          await profile.locator('summary').press('Enter');
          assert.equal(await open(profile), true);
          await contact.locator('summary').click();
          assert.equal(await open(profile), false);
          assert.equal(await open(contact), true);
          if (route === '/professional/' && [1280, 390].includes(width))
            await page.screenshot({ path: join(out, `contact-${width}.png`) });
          await page.locator('#cv-name').click();
          assert.equal(await open(contact), false);
          const bounds = await page.evaluate(() => ({
            width: innerWidth,
            scroll: document.documentElement.scrollWidth,
          }));
          assert.equal(bounds.width, bounds.scroll);
          requireScopes(
            await page.evaluate(inspectScopes, ['#cv', '#project-details']),
          );
          assert.throws(() =>
            requireScopes([{ selector: '#missing', count: 0 }]),
          );
          if (route === '/professional/' && width === 1280) {
            await profile.locator('summary').click();
            await page.pdf({
              path: join(out, 'print.pdf'),
              format: 'A4',
              preferCSSPageSize: true,
              printBackground: false,
            });
            assert.equal(await open(profile), true);
            assert.equal(await open(contact), false);
            assert.equal(
              await profile.getAttribute('name'),
              'professional-intro',
            );
            await contact.locator('summary').click();
            assert.equal(await open(profile), false);
          }
          assert.deepEqual(errors, []);
          report.push({ route, width, result: 'PASS' });
          await page.close();
        }
      }
      const off = await browser.newPage({
        javaScriptEnabled: false,
        viewport: { width: 390, height: 844 },
      });
      await off.goto(new URL('/professional/', base).href, {
        waitUntil: 'networkidle',
      });
      assert.equal(
        await off.locator('[data-career-star][href^="#project-"]').count(),
        12,
      );
      await off.locator('.cv-contact-links>summary').click();
      await off.locator('.profile-disclosure>summary').click();
      assert.equal(
        await off.locator('.cv-contact-links').evaluate((el) => el.open),
        false,
      );
      assert.equal(
        await off.locator('.profile-disclosure').evaluate((el) => el.open),
        true,
      );
      await off.pdf({
        path: join(out, 'print-no-js.pdf'),
        format: 'A4',
        preferCSSPageSize: true,
        printBackground: false,
      });
      await off.setContent('<main></main>');
      const missing = await off.evaluate(inspectScopes, [
        'main',
        '#project-details',
      ]);
      assert.throws(() => requireScopes(missing), /#project-details/);
      await off.setContent('<main></main><main></main>');
      const duplicate = await off.evaluate(inspectScopes, ['main']);
      assert.throws(() => requireScopes(duplicate), /main \(2\)/);
      report.push({
        javascript: false,
        exclusivePanels: 'PASS',
        missingScopes: 'FAIL as expected',
      });
    } finally {
      await writeFile(
        join(out, 'checks.json'),
        JSON.stringify(report, null, 2) + '\n',
      );
      await browser.close();
    }
  },
);

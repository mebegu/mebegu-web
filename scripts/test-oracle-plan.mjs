import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { planChanges, editorialCandidates } from './oracle-plan.mjs';
import { requireScopes } from './oracle-scopes.mjs';
const config = JSON.parse(
  readFileSync(new URL('../docs/oracles/site.json', import.meta.url)),
);
test('required scopes cannot pass with missing or ambiguous matches', () => {
  assert.throws(() => requireScopes([]), /No required/);
  assert.doesNotThrow(() => requireScopes([{ selector: 'main', count: 1 }]));
  assert.throws(
    () => requireScopes([{ selector: '#project-details', count: 0 }]),
    /#project-details \(0\)/,
  );
  assert.throws(
    () => requireScopes([{ selector: 'main', count: 2 }]),
    /main \(2\)/,
  );
});
test('Professional edits stay scoped to the two language routes', () => {
  const p = planChanges(['src/styles/professional.css'], config);
  assert.deepEqual(p.routes, ['/professional/', '/tr/professional/']);
  assert.equal(p.professional, true);
});
test('tooling and documentation do not request site screenshots', () => {
  assert.equal(
    planChanges(['AGENTS.md', 'scripts/oracle-browser.mjs'], config).routes
      .length,
    0,
  );
});
test('unknown shared consumers expand checks rather than silently skipping', () => {
  const p = planChanges(['src/layouts/BaseLayout.astro'], config);
  assert.equal(p.routes.length, config.sharedRoutes.length);
  assert.equal(p.unknownDependencies.length, 1);
});
test('dynamic content requires an exact route and rejects external destinations', () => {
  assert.equal(
    planChanges(['src/components/pages/ArticlePage.astro'], config)
      .needsExactArticleRoute,
    true,
  );
  const p = planChanges(['src/components/pages/ArticlePage.astro'], config, [
    '/writing/a-place-to-begin/',
  ]);
  assert.equal(p.needsExactArticleRoute, false);
  assert.equal(p.screenshotRoute, '/writing/a-place-to-begin/');
  assert.throws(() => planChanges([], config, ['//example.com']));
});
test('editorial candidates include only added visible source, with line references', () => {
  const diff =
    '+++ b/src/pages/index.astro\n@@ -2 +3,2 @@\n-Old seamless text\n+<p>Unlock your potential</p>\n+<p>Ordinary factual copy.</p>\n+++ b/docs/WRITING.md\n@@ -1 +1 @@\n+leverage';
  const findings = editorialCandidates(diff);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].line, 3);
  assert.equal(
    editorialCandidates(
      '+++ b/src/pages/tr/index.astro\n@@ -0,0 +1 @@\n+benzersiz bir yolculuk',
    )[0].rule,
    'turkish-stock-phrase',
  );
});

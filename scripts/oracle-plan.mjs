/** Small, offline change router. No LLM calls, network requests or site edits. */
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { createHash } from 'node:crypto';

const git = (...args) =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
export function fingerprint(files) {
  const hash = createHash('sha256');
  for (const file of [...files].sort()) {
    hash.update(file + '\0');
    try {
      hash.update(readFileSync(file));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      hash.update('<deleted>');
    }
  }
  return hash.digest('hex');
}
export function planChanges(files, config, explicitRoutes = []) {
  const visible = files.filter((f) => /^(src\/|public\/)/.test(f));
  const routes = new Set();
  const unresolved = [];
  for (const file of visible) {
    const rules = config.rules.filter((rule) =>
      new RegExp(rule.match).test(file),
    );
    if (rules.length)
      rules.forEach((rule) =>
        rule.routes.forEach((route) => routes.add(route)),
      );
    else {
      config.sharedRoutes.forEach((route) => routes.add(route));
      unresolved.push(file);
    }
  }
  // Dynamic article URLs need an exact route supplied by the agent, never a guessed slug.
  const dynamic = visible.filter((f) =>
    /(?:ArticlePage|\[id\]|\/blog|\/articles\/)/.test(f),
  );
  explicitRoutes.forEach((route) => {
    if (!route.startsWith('/') || route.startsWith('//') || /[?#]/.test(route))
      throw new Error('Use local route paths without query/fragment');
    routes.add(route);
  });
  const primary = explicitRoutes[0] || [...routes][0];
  return {
    files,
    visibleFiles: visible,
    routes: [...routes],
    screenshotRoute: primary || null,
    unknownDependencies: unresolved,
    needsExactArticleRoute: dynamic.length > 0 && explicitRoutes.length === 0,
    checks: visible.length
      ? [
          'pnpm validate',
          'scoped browser bounds/assets/headings/interactions',
          'changed-copy editorial review',
        ]
      : ['targeted tooling tests; no site screenshots'],
    professional: visible.some((f) =>
      /(?:ProfessionalPage|professional\.css|\/cv[./]|\/resume\.|\/portfolio\.)/.test(
        f,
      ),
    ),
    designDecision:
      'Agent must classify: approved-direction repair, or new direction requiring owner concept choice.',
    limits: [
      'Route rules are conservative hints, not a complete import graph. Add affected dynamic routes and unusual shared consumers explicitly.',
      'Lexical candidates need context; absence of matches does not establish natural writing.',
    ],
  };
}
export function editorialCandidates(diff) {
  const rules = {
    'long-dash': /[\u2014\u2015]/,
    'stock-phrase':
      /\b(?:delve|leverage|foster|seamless|cutting.edge|game.changing|transformative|tapestry|unlock your)\b/i,
    'stock-construction':
      /\bnot (?:just|only)\b.{0,100}\bbut\b|\bwhere\b.{0,50}\bmeets\b/i,
    'turkish-stock-phrase':
      /geleceği şekillendir|sınırları aş|tutkuyla harman|benzersiz bir yolculuk|yenilikçi çözümler sun/i,
  };
  let file = '',
    line = 0;
  const findings = [];
  for (const text of diff.split('\n')) {
    if (text.startsWith('+++ b/')) {
      file = text.slice(6);
      continue;
    }
    const hunk = text.match(/^@@.*\+(\d+)/);
    if (hunk) {
      line = Number(hunk[1]);
      continue;
    }
    if (text.startsWith('+') && !text.startsWith('+++')) {
      if (/^(src\/|public\/)/.test(file))
        for (const [rule, pattern] of Object.entries(rules))
          if (pattern.test(text.slice(1)))
            findings.push({
              file,
              line,
              rule,
              sourceLine: text.slice(1).trim().slice(0, 350),
              verdict: 'candidate, not an authorship claim',
            });
      line++;
    } else if (!text.startsWith('-') && !text.startsWith('\\')) line++;
  }
  return findings;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const { values } = parseArgs({
    options: {
      base: { type: 'string', default: 'HEAD' },
      out: { type: 'string', default: '.local/oracles/plan.json' },
      config: { type: 'string', default: 'docs/oracles/site.json' },
      route: { type: 'string', multiple: true },
      intent: { type: 'string', default: '' },
      reference: { type: 'string', default: '' },
    },
  });
  const config = JSON.parse(readFileSync(values.config, 'utf8'));
  const tracked = git('diff', '--name-only', '-z', values.base, '--')
    .split('\0')
    .filter(Boolean);
  const untracked = git(
    'ls-files',
    '--others',
    '--exclude-standard',
    '-z',
    '--',
    'src',
    'public',
  )
    .split('\0')
    .filter(Boolean);
  const files = [...new Set([...tracked, ...untracked])].sort();
  const plan = planChanges(files, config, values.route || []);
  const candidates = editorialCandidates(
    git(
      '-c',
      'core.quotePath=false',
      'diff',
      '--no-ext-diff',
      '--unified=0',
      values.base,
      '--',
      'src',
      'public',
    ),
  );
  // Include new visible files, which git diff does not include yet.
  for (const file of untracked)
    if (/\.(astro|md|mdx|ts|js|json|html)$/.test(file))
      candidates.push(
        ...editorialCandidates(
          `+++ b/${file}\n@@ -0,0 +1 @@\n` +
            readFileSync(file, 'utf8')
              .split('\n')
              .map((s) => '+' + s)
              .join('\n'),
        ),
      );
  const report = {
    ...plan,
    base: values.base,
    head: git('rev-parse', 'HEAD').trim(),
    fingerprint: fingerprint(files),
    intent: values.intent,
    reference: values.reference,
    baseURL: config.baseURL,
    widths: config.widths,
    screenshots: config.screenshots,
    editorialCandidates: candidates,
    visualVerdict: 'NOT CHECKED',
    ownerApproval: 'NOT REQUESTED',
  };
  mkdirSync(dirname(resolve(values.out)), { recursive: true });
  writeFileSync(values.out, JSON.stringify(report, null, 2) + '\n');
  console.log(
    `${files.length} changed files; ${plan.routes.length} routes; ${candidates.length} editorial candidates. Plan: ${values.out}`,
  );
  if (plan.needsExactArticleRoute)
    console.log('ACTION: add --route with the affected article URL.');
}

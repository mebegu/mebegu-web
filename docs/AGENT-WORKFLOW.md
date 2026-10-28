# Low-token agent development workflow

These instructions make the agreed controls the default for work in this repository. They do not start background agents, call a model API or install a framework. The development agent follows AGENTS.md; small scripts supply evidence.

## Default lifecycle

1. Understand the request. Read the relevant page guide and changed code, not all documentation. Record one or two sentences of intended behavior, affected routes and at most a few acceptance criteria in the task notes or local plan.
2. Decide whether an owner choice is needed. New composition, typography, palette, illustration or substantive voice direction needs a small wireframe/reference and the owner's choice before implementation. Routine repairs within an approved direction proceed. A clear current request can itself authorize a direction. Ask early and continue independent work; silence is not approval.
3. Implement a coherent batch. Run cheap checks after the batch, not after each CSS edit. Keep source-owned content and private publication policy boundaries.
4. Generate a scoped plan, run relevant scripts and render the affected routes. Inspect two actual images and only changed copy by default. Exercise the changed user journey once. A plan is routing guidance, not a substitute for judgment about shared dependencies.
5. Fix clear defects autonomously. Refresh evidence after affected code changes. After two unsuccessful visual correction rounds, ask the owner about the unresolved decision instead of spending tokens on more speculative redesigns. Keep independent work moving; unresolved failures remain open.
6. Report the result with evidence, checks and real limitations. Visible design work gets an owner review of the finished result. Record an accepted/rejected preference in a few lines, with scope and reference, so the next task does not repeat the discussion. Commit/push only within existing authorization.

## Oracle selection

| Change                              | Scripts / focused check                                           | Agent judgment / owner involvement                                                                      |
| ----------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Documentation or tooling only       | Relevant tooling tests and syntax checks                          | No site screenshots or full-site prose review                                                           |
| Visible copy                        | Added-line lexical candidates, affected route render              | Read changed sentences in context; owner chooses substantive tone changes                               |
| Page layout or CSS                  | Build/output checks; bounds, assets and disclosures on EN/TR      | Two screenshots against agreed intent; owner chooses new direction and reviews result                   |
| Interaction                         | Existing relevant tests plus real changed user journey            | Keyboard focus, expected state, no unexpected jump; capture extra state only if needed                  |
| Shared layout, tokens or navigation | Conservative static-route measurements and existing build checks  | Two representative images first; inspect additional affected templates only when their risk warrants it |
| CV or publication pipeline          | Source/privacy checker with private policy; PDF/print if affected | Source fidelity; all print pages if print changed; never hand-edit protected data                       |
| New assets or client JS             | Asset/output checks; compare changed asset sizes and delivered JS | Cropping, meaning, reduced motion, JS-off fallback where relevant; no blanket performance certification |

The browser script measures horizontal bounds, loaded images/fonts, local request failures, page errors, one h1/main and the first native disclosure. It does **not** prove good composition, absence of overlap, WCAG compliance, correct palette, natural prose or completed user journeys. Review the changed aspects explicitly. Existing `visual-oracle.mjs` is available for deliberately expanded CV/contrast/print evidence.

## Commands

For the current uncommitted change, compared with HEAD:

```powershell
pnpm oracle:plan --intent "Describe the requested visible result" --reference "Approved concept or rule"
```

For a committed change, specify the comparison base, for example `--base HEAD~1`. In a PR use the actual merge-base. New untracked src/public files are included. Dynamic article changes require `--route /writing/the-actual-slug/` and the corresponding translated route when affected. Repeat `--route` to add routes; the first explicit route is the screenshot target. Unknown shared consumers broaden measurements instead of being silently ignored. Check the resulting `.local/oracles/plan.json` and add unusual consumers explicitly.

Start the local development/preview server separately. Point the browser at its actual port:

```powershell
pnpm oracle:browser --url http://127.0.0.1:4321 --playwright <existing-playwright-module-path> --browser <existing-browser-executable>
```

`ORACLE_PLAYWRIGHT` and `ORACLE_BROWSER` environment variables can hold local paths. Use existing external tooling; do not add a runtime dependency. `--selector "#changed-section"` captures a lower section instead of an irrelevant first viewport. `--print` additionally renders A4 with backgrounds off; inspect every page separately. The old Professional config remains available for deeper checks, not the default for every task.

The browser measures four widths on affected routes. Only the primary route gets two images, at 1280 and 390px. Failures get an extra diagnostic image. Output stays ignored under `.local/oracles/`; promote only useful, sanitized review evidence to docs. Do not send private source, policy mappings or screenshots to external services.

`pnpm test:oracles` tests change routing and editorial filtering. `pnpm validate` retains the site's existing build/publication checks. Run full validation for production source changes, not on each edit or for unrelated documentation. The CV checker is `python scripts/check-public-cv.py --policy .local/cv-publication-policy.json` after build. Missing private policy is NOT CHECKED, not PASS; never invent or commit it.

## Budget and evidence rules

- One development agent, no separate model call per oracle. No automatic research or image generation for ordinary maintenance.
- Read changed files and only relevant guides. Lexical candidates scan added source lines, not every historical article. They may include code and must be checked against rendered text. Review changed copy even with zero lexical matches.
- Two images to inspect initially. Numeric checks at other widths do not consume model image tokens. Full-page images, extra states and full-site reviews require a concrete issue or an explicit broader task.
- Separate **automated**, **agent visual** and **owner approval** verdicts. Use PASS / FAIL / NOT CHECKED for checks; PENDING / APPROVED / REJECTED for owner decisions. Never infer approval from waiting, passing tests or your own taste.
- Evidence records intent, reference, comparison base, source fingerprint, routes and browser. The browser rejects a plan if its listed files changed and marks captures stale if they change during the run. Before final delivery check newly added files too by refreshing the plan; the fingerprint cannot discover files absent from its list.
- Keep one short review note using [the template](oracles/REVIEW-TEMPLATE.md). Existing task notes can hold it; creating a tracked report for every typo is unnecessary.
- A user rejection makes the relevant intent verdict FAIL. Save the specific lesson, not the whole conversation. Do not turn an unapproved output into a baseline.

## Current owner preferences

- Approved successor: concept 02, a natural star cluster. The owner requested additional stars that reveal career information. Keep the default entrance sparse; reveal source-owned project/role information on selection instead of adding an upfront summary or statistics. This approval is for the direction, not automatic acceptance of any rendered implementation.

- Latest Professional feedback supersedes the earlier recruiter-driven proposal: the opening must be minimalist, calm and sparse. Do not add stats, summary blocks or explanatory controls to it. Detailed evaluation can happen through the PDF. The constellation must look like an organic, irregular star cluster, not two aligned columns or a workflow diagram. Both initial information-heavy wireframes were rejected; they are not baselines. Preserve existing CV content until a scope change is explicitly chosen.

- Dark site identity, existing typography/accent, readable HTML and responsive layouts.
- No slogans, empty marketing prose, long dashes or invented career claims. Editorial flags are not AI-authorship detection.
- Historical Professional references (column 01 and the two information-heavy wireframes) are superseded by the approved minimal concept 02. Use [the natural-cluster review](professional-review/natural-cluster/REVIEW.md); the finished implementation still needs owner aesthetic review.
- Ask about meaningful design choices; proceed with approved-direction repairs. Avoid repeated permission questions and per-component prompting.

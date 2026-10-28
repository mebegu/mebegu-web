# Visual and intent oracle

Use after every site change that affects appearance, behavior or visible copy. A build passing is only the start. This procedure adds browser evidence and a recorded visual decision. It introduces no site runtime dependency.

## Before editing

Write the intended result in one or two measurable sentences. Record the affected routes, EN/TR variants, important interactions, unchanged behaviors and screenshots needed to judge the change. For a regression, capture the current bad state too. Do not replace the expected result with a description of the finished implementation.

## Capture

Use real Chromium/Edge browser rendering through existing development tooling. `scripts/visual-oracle.mjs` accepts an externally installed Playwright module. The local development environment already supplies one; do not add Playwright to the site's runtime dependencies.

```powershell
node scripts/visual-oracle.mjs `
  --config docs/professional-review/oracle.json `
  --playwright <absolute-path-to-installed-playwright/index.mjs> `
  --browser <absolute-path-to-msedge.exe-or-chrome.exe> `
  --out .local/visual-review
```

The example config is for the implemented Professional page. For another page, copy the config into that change's evidence folder and replace its route list, expected text, selectors and section order. Start a local server first and set `baseURL` to it. Never point an automated browser at an unrelated signed-in personal profile.

Capture at 1280px desktop, 390px mobile and 360px narrow mobile, with full-page evidence where useful. Include intermediate widths when the changed layout has its breakpoint there. Load the actual fonts. Capture the whole affected page as well as its first viewport, its important expanded states and keyboard focus. Review motion once with normal preferences and once with reduced motion.

The script saves viewport screenshots, full-page screenshots, open-project details, an A4 PDF with backgrounds disabled and `checks.json`. It measures document width, offscreen element bounds, headings, expected source text, language containers, font loading, flat-background text contrast, failed local assets, PDF response and selected interaction behavior. `highlightSelector` and `projectSelector` choose the relevant elements. The script has CV-specific print selectors; extend the configuration/checks deliberately for other page types. Use `scripts/check-public-cv.py` separately to verify every source phrase and the private name policy.

## Judge the screenshots

Open the screenshots. Do not infer visual quality from DOM measurements. For each item record PASS, FAIL or NOT CHECKED, with evidence and a specific correction for FAIL:

| Check         | What to inspect                                                                                                                                                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Intent        | Does the actual visible result fulfill the request? Compare with the agreed concept, not just the previous version.                                                                                                                                                                                     |
| Composition   | Clear first reading point, deliberate spacing, useful hierarchy, balanced text measure. No accidental dead space, unrelated ornament or repeated template cards.                                                                                                                                        |
| Legibility    | Body size, line length, line height, paragraph spacing, dense captions and wrapping of long names/links at the smallest width.                                                                                                                                                                          |
| Bounds        | No horizontal scroll, cut-off text, offscreen buttons, overlapping sticky UI or clipped focus outline. Open disclosures and test again.                                                                                                                                                                 |
| Palette       | Use DESIGN.md tokens and the agreed page accents. Measure foreground/background contrast: at least 4.5:1 for normal text, 3:1 for large text, and required non-text contrast for controls/focus. Petrol #1D5C63 is decoration on dark surfaces, not small body text; a lighter tint is needed for text. |
| Content       | Compare real HTML text with the source. Check section and screen-reader reading order, omitted fields, punctuation, duplicate text, EN/TR and unintended translation.                                                                                                                                   |
| Navigation    | Correct language destinations and active state, anchor offsets below the toolbar, obvious PDF primary action and working Print.                                                                                                                                                                         |
| Interaction   | Keyboard reachability, visible focus, Enter/Space on disclosures, clear open state, no unexpected jumps. No dependence on hover for important information.                                                                                                                                              |
| Accessibility | Semantic headings, one h1, appropriate labels and language, no information encoded only in color or CSS decoration. JS-off reading and reduced motion still work.                                                                                                                                       |
| Voice         | Apply WRITING.md to the rendered text. Report source-owned wording upstream; do not silently rewrite CV data during a layout task.                                                                                                                                                                      |

Screenshot review is a human/agent judgment against the user's intent. Automated image differences can help locate a regression; they cannot decide whether an intentional redesign is good.

For the Professional page, also capture an ordinary **390×844** first viewport. Record whether it exposes useful role/context and skill evidence, not only identity, contacts and actions. Test a concrete task: reach the source project for an AWS-related skill using touch and keyboard, then return to the skill list. Technical PASS and aesthetic approval are separate verdicts. If the owner rejects the result as boring or inappropriate, the intent verdict is FAIL even when contrast, source text and overflow checks pass. The rejected A/B/C concepts are an example; see `cv-concepts/WEB-RESEARCH.md`.

## Print review

For Professional, print A4 portrait with backgrounds disabled and browser headers/footers off. Only `#cv` should remain. Project details are the separate annex on screen and are omitted from browser printing in these concepts; the primary designed PDF supplies the full source CV and annex.

Inspect every rendered PDF page, not only page one. Confirm black text on white, no toolbar/actions/footer, sensible page breaks, no empty last page, no orphan heading or truncated line. Extract text from every page and confirm logical order and no missing text. A browser-generated PDF plus page PNGs is useful print-layout evidence; it is not proof that the native print-dialog settings were manually checked. State which was done.

## Record the verdict and repeat

Keep source revision, URL, viewport, browser, intended result, screenshot paths, automated checks, visual findings, fixes and remaining limits in one review note. After a correction, recapture the affected sizes and states. A previous screenshot cannot validate new CSS.

The change is complete only when required checks pass and the visual verdict is PASS. If a check could not run, say NOT CHECKED and why. Never replace that with “looks good”. The current implementation review lives in `professional-review/REVIEW.md`. Initial unredacted design experiments remain private local drafts.

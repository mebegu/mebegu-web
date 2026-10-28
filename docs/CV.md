# Professional page and public CV

Updated 28 October 2026. The shared page serves `/professional/` and `/tr/professional/`. CV text remains English inside `lang="en"`; the site's navigation stays bilingual.

## Selected design

The owner selected **02, the natural star cluster** from the minimal comparison board, then requested more stars that reveal career information. This supersedes the earlier linked, two-column constellation and both rejected information-heavy wireframes. The distant seated silhouette, anonymous clients, real technology/provider logos and source content remain.

The opening is one quiet, full-height night scene. Compact identity, role, Download PDF, Print and Contact sit beside an irregular star cluster; on mobile they sit above it. There is no initial project panel, introductory statistic block or connection diagram. A new muted backdrop keeps the seated observer small. The cluster has 96 deterministic decorative points, 12 project links, three experience links and a native Profile star for the complete source summary. Only three project-related skill labels are persistent; other link names appear on hover/focus and all links retain accessible HTML names. Background and tiny points are decorative, never the only source of a career fact.

Choosing a star opens one quiet readout containing its exact public source employer, title, metadata and context. Role stars show the exact first source contribution and link to Experience; complete entries remain below. Focus moves to the readout heading. Close/Escape returns focus to the originating star. Selecting another star replaces the readout; there is no independent filter state to contradict it. Contact/Profile and the readout close each other on pointer interaction. Without JavaScript the project/experience links navigate directly to their original records, while Profile remains a native disclosure. Modifier-click preserves the real link.

Clickable stars share a warm, sharper core and a restrained halo; decorative dust stays faint and cool. Hover/focus and the selected state strengthen that halo. Visible labels are underlined and clickable across their full text, including outside the 44px star area. Invisible labels do not intercept clicks. No continuous animation or introductory instruction is needed. Readouts and the Profile panel have a thin border on all four sides and inset content on desktop and mobile.

All nine highlight/evidence pairs, full CV sections, technology/provider marks and all 12 native project records remain below the entrance. Expand all / Collapse all remains available. The scene is omitted from print, which still contains only the full CV on A4.

## Source and generation

The expected `src/data/cv.json` was absent in this checkout. The current page imports **`src/data/cv.public.generated.json`**, generated from the released v2 Markdown in `mebegu/career-docs`, revision `85ddc0cb1580a2b1a837028cd3a097a50e1e5152`. It is a pinned publication snapshot, not a live network dependency or an automatic synchronization workflow.

Do not hand-edit this snapshot or the existing `src/data/cv.json`, `resume.ts` or `portfolio.ts`. The latter three files were left untouched. Normal prose, dates, roles, qualifications and project contributions come from the source. Markdown markers become HTML structure. The owner explicitly authorized removing customer names; that publication transformation is applied before writing the generated snapshot. Generic client prefixes are omitted from display titles, and evidence labels use the corresponding project descriptions. No new career claims were added.

The private publication policy lives in ignored `.local/cv-publication-policy.json`. Its `rules` array contains `[regex, replacement]` pairs and its `forbidden` array contains names to reject. Keep the actual mapping, raw exports and initial unredacted design previews out of Git. The public artifact contains anonymous labels, not a client-name lookup table. Main employers remain named; clients do not. No phone number or street address is added.

To refresh from the same approved release:

```powershell
python scripts/sync-public-cv.py --policy .local/cv-publication-policy.json
node scripts/build-public-cv.mjs --policy .local/cv-publication-policy.json `
  --playwright <absolute-path-to-existing-playwright/index.mjs> `
  --browser <absolute-path-to-edge-or-chrome>
```

`sync-public-cv.py` fetches the source through authenticated `gh`, parses the published Markdown, applies the private policy and removes the phone before writing the public JSON. It rejects remaining forbidden names. The PDF script fetches the matching release HTML, performs the same scrub in memory, then renders only the sanitized copy. Raw source is never copied into `public/`.

The primary download is **`/cv/mehmet-berk-gurcay-cv.pdf`**, a separate three-page, anonymized copy of the source's designed CV, including its project annex. It preserves the source's IBM Plex typography and layout. It is not the website's browser-print output. The checked-in PDF permits an offline site build; regenerating it needs the existing external browser tooling and authorized source access. No Playwright or other runtime dependency was added to the site.

Useful upstream fields for future simplification: stable public project IDs, explicit highlight-to-project IDs, public project/evidence labels and a web-specific replacement for the source sentence about subsequent PDF pages. The current page preserves that source sentence rather than inventing new CV prose. These fields should be added at the source; do not silently restructure a future generated `cv.json` to fit this component.

## Visual assets and logos

Three optimized WebP assets under `public/art/professional/` supply the seated-observer sky and two representative project illustrations. The latter use restrained charcoal, slate blue and ochre, paper grain and imperfect ink edges. They are labeled as concept illustrations and do not claim to show delivered client systems. Generation prompts and provenance are in [ART-PROFESSIONAL.md](ART-PROFESSIONAL.md).

Technology logos are pinned, locally hosted Devicon SVGs, kept alongside their license and source manifest. Logos accompany actual text; they carry no unique information. Certification rows use the provider's logo and the exact source qualification/date, not a fabricated certification badge or verification link. See [THIRD-PARTY.md](THIRD-PARTY.md). Existing Space Grotesk and DM Sans families are served locally for this page, with their OFL licenses, so the design does not depend on a successful font request at review time.

## Print

Contact and Profile are mutually exclusive native disclosures (`name="professional-intro"`). With JavaScript, Escape closes the active panel and focuses its summary; an outside pointer click closes it without moving focus. Print temporarily removes the group name so both contact and summary expand, then restores the prior open state and names. The optional `pnpm test:professional:browser` regression uses the same external browser environment variables as the lean oracle plus `ORACLE_URL`; no browser dependency is added to the site. Without external tooling this optional test reports SKIP, not PASS.

Browser Print produces **only `#cv`**, with A4 portrait, 14mm top/bottom and 16mm side margins. It omits shared navigation, footer, sky, logos, controls and the project annex. It uses black text on white and requires no background printing. All skill highlights and contact text expand for print. After printing, JavaScript restores their previous disclosure state; CSS also exposes the text without JS.

The CV flows across **two nonblank pages** in the reviewed Edge print renderer. Skill highlights use a compact two-column print layout; experience entries and source records avoid inappropriate breaks. No fixed sheet height or clipping is used. The downloaded designed CV remains the full three-page source layout.

Use A4, 100% scale and turn browser headers/footers off. The repository includes screenshots of both rendered print pages. They were produced by the real Edge print renderer with backgrounds disabled; a screenshot of the native Windows print-dialog controls was not captured.

## Verification

```powershell
pnpm validate
python scripts/check-public-cv.py --policy .local/cv-publication-policy.json
node scripts/visual-oracle.mjs --config docs/professional-review/oracle.json `
  --playwright <absolute-path-to-existing-playwright/index.mjs> `
  --browser <absolute-path-to-edge-or-chrome> `
  --out .local/professional-oracle
```

The publication checker compares both built routes with every source phrase, verifies all 12 projects and rejects private names/phone numbers using the local policy. Also extract the downloadable PDF text and apply the same forbidden-name check.

Review EN/TR at 1280, 768, 390 and 360px, including a normal 390×844 first viewport. Open contact links at both phone widths; a popover can overflow even when the closed page does not scroll. Check individual project navigation, keyboard focus, expand all, JS-off reading and print. Follow [VISUAL-ORACLE.md](VISUAL-ORACLE.md) and [WRITING.md](WRITING.md), then record the result in [professional-review/REVIEW.md](professional-review/REVIEW.md).

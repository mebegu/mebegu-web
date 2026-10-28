# Professional implementation review

Date: 28 October 2026. Branch: `cv-sync`. User selected the constellation concept, then requested a smaller seated silhouette, anonymous clients, technology/provider logos and representative project artwork. This is the implementation review, not a claim that the owner has already approved the final screenshots.

## Intended visible result

Keep the site's graphite/space identity while making skill evidence navigable and preserving the source CV. The distant plain silhouette must sit on the hillside with arms behind for support. Customer names and phone numbers must not appear in either language route or the downloadable PDF. Real technology/provider marks accompany text. Project illustrations are visibly labeled as concept art.

## Evidence

- [Desktop, 1280px](screenshots/professional-en-1280.png)
- [Mobile, 390×844](screenshots/professional-en-390.png)
- [Complete mobile page](screenshots/professional-en-390-full.png)
- [Skill map](screenshots/professional-en-1280-highlights.png)
- [Open project with illustration and technology marks](screenshots/professional-en-1280-project-open.png)
- [Print page 1](screenshots/print-page-1.png), [print page 2](screenshots/print-page-2.png), [browser print PDF](screenshots/professional-en-print.pdf)
- [Automated browser measurements](screenshots/checks.json)

## Results

| Area | Result | Evidence and limits |
| --- | --- | --- |
| Chosen visual direction | PASS for implementation review | Inspected the desktop/map/mobile images. The figure is a distant black seated silhouette. Skill and project text remain separate HTML, with warm connection lines over the sky. Source header/summary remains compact enough for skill evidence to begin in the ordinary mobile first viewport. Final owner aesthetic review remains open. |
| Narrow-screen bounds | PASS | EN/TR at 1280, 768, 390 and 360px: eight viewport checks pass, zero offscreen elements and no horizontal scroll. Also checked all 12 projects expanded. An earlier 390px contact popover could extend beyond the right edge; anchored it to the whole contact area and retested. |
| Skill navigation | PASS | Choosing the cloud skill marks three related projects. Its project link opens the matching details element, updates the fragment and focuses its summary. Connection endpoints are measured from the actual nodes. The mobile evidence links remain visible and usable without the wide graph. |
| Full record | PASS | All 12 project contexts are visible in their summaries. Each disclosure opens separately; Expand all opens 12, and Collapse all restores the overview. Context, role/team, contributions and technology information are present. |
| Source integrity | PASS | `check-public-cv.py` found every expected source phrase in both built routes after the explicitly authorized client-name substitutions and formatting of source fields. No hand-edit to the original `cv.json`, `resume.ts` or `portfolio.ts`; package manifest and lockfile unchanged. |
| Publication privacy | PASS for names/phone | The generated public snapshot, both built HTML routes and extracted downloadable PDF text contain none of the private policy's forbidden client names or phone numbers. The name mapping and raw initial drafts remain outside Git. This checks the requested name omission, not an assertion of irreversible de-identification of all career facts. |
| Language | PASS | Site navigation changes between EN/TR. The CV and annex are explicitly marked English and retain the same source content. |
| Text contrast / focus | PASS for measured text | Browser flat-color checks report zero text contrast failures. Image-backed labels use dark high-opacity backing; checked their appearance in the actual captures. Summary keyboard focus is a visible 2px warm outline. Decorative connections are not the only way to learn a relationship. This is not a full WCAG audit. |
| Fonts / assets | PASS | Local DM Sans and Space Grotesk faces loaded. No failed local assets, broken images or JS page errors in the final captures. Download URL returns 200, application/pdf. Provider logos have pinned provenance and licenses. |
| JS disabled / motion | PASS for reviewed paths | Native disclosures and source evidence links remain available without JS; all 12 projects are in HTML. No mandatory animations or scroll effects; reduced motion disables smooth scrolling. CSS and the print renderer expose the full CV even with JS disabled. |
| Browser print | PASS for rendered output | Real Edge print renderer, A4 portrait, backgrounds off, two nonblank pages. Inspected both pages: black text, no sky/logos/shared chrome/actions/annex, no clipped lines or orphan heading. Before/after-print logic preserves disclosure states. |
| Download PDF | PASS | Independently regenerated from the original designed v2 HTML using the private publication policy. Three nonblank pages including the annex; IBM Plex faces loaded. Extracted text checked for remaining names and phone. This PDF is separate from the web CV-only print output. |
| Native print dialog screenshot | NOT CAPTURED | Print evidence is the actual Edge print-rendered PDF and its page PNGs, not a screenshot of the Windows dialog controls. |
| Editorial review | PASS for changed page scan | No em dash, stock slogan or flagged lexical candidate in either built Professional page. The site-wide advisory scan retains four contextual candidates in historical articles; those articles were not rewritten during this change. |

## Validation

`pnpm validate` completed successfully: all 28 existing tests, Workshop/Alamori publication checks, Astro/TypeScript, production build, output references and blog publication boundaries. Astro reported zero errors/warnings and six pre-existing unused-code hints in `scripts/release-game.mjs`.

The environment's pnpm dependency preflight attempted to invoke a missing global `pnpm` shim for an automatic install. Ran the pinned pnpm 11.25.0 through its existing Node runtime with `pnpm_config_verify_deps_before_run=warn`; the actual validation script ran in full. Its pre-existing node_modules/lockfile metadata warning remains. No dependency version, package manifest or lockfile was changed.

Additional checks: public CV source/privacy verification on both built routes; Python helper compilation; Node helper syntax; eight browser viewport checks; individual and all-project expansion; no-JS rendering; two-page print text and three-page download text inspection; `git diff --check`.

## Source and refresh boundary

The public snapshot is pinned to career-docs revision `85ddc0cb1580a2b1a837028cd3a097a50e1e5152`. There is no runtime fetch or automatic cross-repository workflow. Refresh with the documented generation commands and the authorized private policy. Do not replace it with an unreviewed raw export. See [CV.md](../CV.md) for the source-field requests and update procedure.

# Professional constellation correction

Historical review, superseded by the owner's approved minimalist concept 02. Current implementation and evidence: [Natural career cluster](natural-cluster/REVIEW.md). Do not use this earlier composition as the current visual baseline.

28 October 2026, branch `cv-sync`.

## Rejected implementation

The owner rejected commit `50fceb3` because its large identity/summary followed by a separately boxed map did not resemble column 01, TAKIMYILDIZI, of the supplied concept board. Its technical checks passed, but its **visual intent failed**. The earlier screenshots under `screenshots/` are historical evidence, not acceptance evidence for this revision. The previous report's visual PASS was incorrect.

## Corrected composition

The opening is one full-width night scene beneath the existing site toolbar. Small identity and actions occupy the upper left. Three skills and three project stars form an irregular connected cluster with intermediate junctions. The plain seated silhouette remains distant on the lower-left hillside, with arms supporting the body behind it. A horizontal selected-project panel overlaps the scene's bottom edge. Choosing a star changes that panel; View project opens the complete record below.

Mobile retains the constellation, adjusts its positions and stacks the selected-project text and art. It does not substitute a plain skills list. Contact and the full source summary are native disclosures beside the actions; all nine skill/evidence pairs remain immediately below the preview and expand for print. The three preview projects use existing anonymous public labels.

## Actual browser evidence

- [Desktop 1280px](correction/1280.png)
- [Mobile 390px](correction/390.png)
- [A4 print page 1](correction/print-1.png), [page 2](correction/print-2.png), [Edge print PDF](correction/print.pdf)
- [Browser measurements and interaction checks](correction/checks.json)

Inspected the desktop and mobile captures against column 01 of the supplied reference. The primary spatial relationships are now present: shared sky behind identity and map, clustered warm connections, low seated figure and overlapping project preview. This is an implementation review; the owner has not yet approved its aesthetic result. The reference's client name is intentionally replaced by the anonymous source project label. Artwork remains the previously approved style of representative concept illustration.

## Verification

Both language routes were exercised at 1280, 768, 390 and 360px in real headless Edge. All eight checks show document width equal to viewport width and zero out-of-bounds elements, including open Contact/Profile disclosures and all 12 expanded project records. No JavaScript page errors occurred. Skill selection marks 3 cloud, 1 IoT and 1 graph project; project stars update exactly one preview and View project opens its full record. Expand all opens all 12 records. With JavaScript disabled all 12 records and three direct star anchors remain available.

The real Edge A4 print renderer produced two nonblank pages with backgrounds disabled. Both pages were visually inspected: only the CV, black on white, no toolbar, sky, preview, logos, controls or project annex. Profile/Contact disclosure controls are hidden and their contents print. The JavaScript-disabled print also has two pages. Evidence shows browser-rendered print output, not the native Windows print-dialog controls.

`pnpm validate` passed: 28 tests, publication checks, Astro check/build and output references. Astro reported zero errors/warnings and six existing hints in `scripts/release-game.mjs`. Used the existing pinned Node/pnpm runtime with `pnpm_config_verify_deps_before_run=warn` because the environment's dependency preflight expects a missing global shim; the pre-existing node_modules metadata warning remains. No dependency changes were made.

`check-public-cv.py` verified every expected source phrase, all 12 projects and the private publication policy against both built routes. Protected source data, the anonymous PDF and public generated snapshot are unchanged in this correction. The source remains pinned to career-docs revision `85ddc0cb1580a2b1a837028cd3a097a50e1e5152`; refresh instructions and source-field requests are in [CV.md](../CV.md).

# Natural career cluster

Owner approved concept 02 and asked for additional stars that reveal career information. This revision implements that direction; owner review of the finished result remains pending. No additional layout choice was inferred from the rejected information-heavy wireframes.

## Result and evidence

- [Desktop 1280px](1280.png), [mobile 390px](390.png)
- Selected information: [desktop](1280-selected.png), [mobile](390-selected.png)
- A4: [page 1](print-1.png), [page 2](print-2.png), [Edge print PDF](print.pdf)
- [Bounds](bounds.json), [browser regression](checks.json)

The initial entrance shows only identity, role, PDF/Print and Contact beside the cluster. There is no initial project card, statistics, summary block or connection diagram. The cluster has 96 faint decorative points plus 16 career controls: 12 project links, three experience links and a native Profile star. Most names appear on hover/focus; three skill-related labels persist. Text, labels and information remain HTML. The new muted, 40KB WebP backdrop has no interface text or baked interactive points.

Selecting a career link reveals exactly one readout with source-owned employer, title, metadata and context. Role readouts use the exact first source contribution; the complete entries remain in the CV below. Focus moves to its heading. Escape/Close returns focus to the star. The readout closes before entering a full project or Experience section. Projects open their native details element; Experience receives heading focus. There is no independent filter state to contradict selection.

## Review

Agent visual verdict: PASS for the requested sparse direction in the captured states. The two-column graph, large warm connection lines, leading metrics and always-visible project panel are gone. The backdrop is quieter; variable-size points form an uneven cluster with no connection lines. Inspected both initial screenshots, selected mobile/desktop states and both A4 pages. This judgment is separate from owner aesthetic approval.

`pnpm validate` passed: 34 tests, Astro check/build, publication and output checks. Astro has zero errors/warnings and six existing release-game hints. The environment's existing pnpm metadata warning remains; no dependency version or lockfile changed. After the final CSS refinements and accessible-name adjustment the build and source/privacy check were repeated.

Real Edge regression passed on EN/TR at 1280, 768, 390 and 360px. All 15 project/role readouts were exercised on desktop; representative stars and native Profile/Contact were exercised on narrower views. Exactly one readout opens; heading focus, Escape, close control, outside click, direct project navigation and Experience heading focus were checked. Native Profile/Contact exclusivity works without JavaScript, and real project anchors remain in HTML. No independent skill-filter controls remain. Initial and selected EN bounds have zero horizontal overflow at all four widths.

The Edge A4 output is two nonblank pages. Both were visually inspected: only the CV, black on white, no scene, controls, readout or project annex. JavaScript-disabled print also has two pages and includes contact/summary text. Printing restores the native disclosure states. Native Windows print-dialog controls were not captured.

The publication checker verified every expected source phrase and all 12 projects in both built routes against the private policy. Original resume/portfolio/generated CV data and the PDF download were not hand-edited. All full CV sections, nine highlight/evidence pairs and 12 detailed project records remain available below the minimal entrance. English CV and bilingual navigation are preserved.

## Limits / remaining work

- No native screen-reader, Firefox/Safari or production uptime/Core Web Vitals audit was performed. Programmatic heading focus and accessible names were checked, not a complete WCAG audit.
- Arrangement is reviewed for the current 12 projects and three roles. A different upstream record count needs a layout review; stable public IDs/schema work remains S01/S03.
- The source sentence referring to subsequent project pages is still upstream-owned and remains S02. CI integration remains Q02.
- The muted background is generated artwork, not a client photograph. Prompt/provenance is in [ART-PROFESSIONAL.md](../../ART-PROFESSIONAL.md).

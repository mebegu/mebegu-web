# Career-star affordance and panel edges

Intent: distinguish interactive stars organically, make the visible labels usable and restore all four panel edges without changing the sparse composition.

- Interactive projects, roles and Profile share a warm, slightly larger core with a restrained halo; decorative dust remains faint/cool. Hover/focus and selection strengthen the halo, with no continuous animation.
- Visible labels are underlined and clickable beyond the 44px star box. Hidden labels retain pointer-events:none so they cannot block other targets.
- Career and Profile readouts have four 1px borders with inset content. Desktop no longer has text flush against a borderless edge.

Evidence: [desktop](1280.png), [mobile](390.png), [selected mobile panel](390-selected.png), [bounds](bounds.json), [browser regression](checks.json).

Validation: pnpm validate passed (34 tests, Astro/build/output checks; six existing release-game hints). Real Edge regression passed EN/TR at 1280, 768, 390 and 360px, including clicking all three persistent labels outside their star boxes and checking all four computed panel borders. A separate emulated-touch/no-hover test opened all three labels by tap and closed their panels successfully. Initial/selected EN measurements show no horizontal overflow. Inspected the desktop/mobile initial states and selected mobile panel. This is an agent visual review, not owner aesthetic approval or a full accessibility audit.

Only screen CSS, browser regression and these design notes changed; CV source text, PDF and print CSS were not edited. Supporting tooling requires existing external Playwright and browser, with no new site dependency.

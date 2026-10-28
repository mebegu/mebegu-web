# Working on this site

For changes to layout, styling, interaction or visible copy:

1. Read `docs/DESIGN.md` and the relevant page guide. `docs/NIGHT-HOME.md` describes the current home and shared navigation; parts of DESIGN.md describe an older home concept.
2. Write down the intended visible result before editing. Preserve the user's chosen scope and approval stage; a concept request stops at concepts.
3. Follow `docs/VISUAL-ORACLE.md`: render the changed routes in a real browser, capture desktop and mobile evidence (including 390px and 360px), open and inspect the screenshots, check important states and record findings. Fix issues and recapture after the final CSS change. A build or DOM check alone does not establish that the design works.
4. Apply `docs/WRITING.md` to new or changed visible English and Turkish. Avoid slogans, stock marketing prose and long dashes. Treat lexical matches as editorial review candidates, never evidence of AI authorship. Preserve archival/source-owned text and report any required source correction explicitly.
5. Run checks appropriate to the change. For a completed Professional redesign run `pnpm validate`, verify EN/TR routes and inspect A4 print output. Report anything not checked accurately.

Professional content is generated upstream in `mebegu/career-docs`. Do not hand-edit `src/data/cv.json`, `src/data/resume.ts` or `src/data/portfolio.ts`, or silently rewrite their CV text. Never add a phone number or street address. If a required generated file is missing or the design needs a new field, document it and resolve it at the source. Keep CV content English with `lang="en"`, including on Turkish routes.

`src/data/cv.public.generated.json` is the publication snapshot for the current page. Regenerate it with `scripts/sync-public-cv.py` and an owner-authorized private policy, never by hand. Keep client-name mappings and raw upstream CV exports out of Git. The public page and downloadable PDF must both omit client names. Technology/provider logos may remain; they are not client endorsements or credential-verification badges. See `docs/CV.md` for the public-copy workflow.

Use existing site tokens and fonts, maintain accessible contrast and focus, respect reduced motion, and prevent horizontal clipping. Do not add a runtime dependency or client framework for a presentation change. Do not push without authorization.

# Working on this site

For changes to layout, styling, interaction or visible copy:

Start with `docs/AGENT-WORKFLOW.md`. Use one agent and change-scoped checks by default. Run `pnpm oracle:plan` to identify affected routes; verify its conservative route hints. Do not read the whole repo or run a separate LLM for each oracle. No visible change means no site screenshots.

1. Read `docs/DESIGN.md` and the relevant page guide. `docs/NIGHT-HOME.md` describes the current home and shared navigation; parts of DESIGN.md describe an older home concept.
2. Write down the intended visible result before editing. Preserve the user's chosen scope and approval stage; a concept request stops at concepts.
3. Follow `docs/VISUAL-ORACLE.md` using the lean default: measure affected routes at 1280, 390, 360 and 768px; capture and open only two images of the primary changed route/section (1280 and 390px). Add images only for a failure or a changed state those images cannot show. Fix issues and recapture affected evidence after the final CSS change. A build or DOM check alone does not establish that the design works.
4. Apply `docs/WRITING.md` to new or changed visible English and Turkish. Avoid slogans, stock marketing prose and long dashes. Treat lexical matches as editorial review candidates, never evidence of AI authorship. Preserve archival/source-owned text and report any required source correction explicitly.
5. Run checks appropriate to the change. For a completed Professional redesign run `pnpm validate`, verify EN/TR routes and inspect A4 print output. Report anything not checked accurately.

Consult the owner before implementing a new composition, palette, typography, illustration direction or substantive voice change: show a small wireframe or existing reference and obtain a choice. A previously approved direction, routine fix or explicit current authorization does not need approval again. Show actual final screenshots for design review. Never treat automated PASS as owner approval. After two unsuccessful visual correction rounds, explain the unresolved choice and ask for direction while continuing independent work. Do not mark unfinished work complete.

Professional content is generated upstream in `mebegu/career-docs`. Do not hand-edit `src/data/cv.json`, `src/data/resume.ts` or `src/data/portfolio.ts`, or silently rewrite their CV text. Never add a phone number or street address. If a required generated file is missing or the design needs a new field, document it and resolve it at the source. Keep CV content English with `lang="en"`, including on Turkish routes.

`src/data/cv.public.generated.json` is the publication snapshot for the current page. Regenerate it with `scripts/sync-public-cv.py` and an owner-authorized private policy, never by hand. Keep client-name mappings and raw upstream CV exports out of Git. The public page and downloadable PDF must both omit client names. Technology/provider logos may remain; they are not client endorsements or credential-verification badges. See `docs/CV.md` for the public-copy workflow.

Use existing site tokens and fonts, maintain accessible contrast and focus, respect reduced motion, and prevent horizontal clipping. Do not add a runtime dependency or client framework for a presentation change. Do not push without authorization.

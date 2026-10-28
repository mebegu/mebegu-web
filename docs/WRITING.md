# Site copy and editorial review

Updated 28 October 2026. Applies to new and changed site copy in English and Turkish. This is an editorial standard, not an authorship detector. Generated CV content stays verbatim; findings about it go to career-docs.

## What the research supports

- [Kobak et al., Science Advances, 2025](https://doi.org/10.1126/sciadv.adt3813), also [the authors' preprint](https://arxiv.org/abs/2406.07016): a study of more than 15 million biomedical abstracts found abrupt changes in stylistic vocabulary after widespread LLM adoption. Repeated fashionable wording can make unrelated texts sound alike. Its aggregate method does not establish who wrote one sentence, and biomedical abstracts are a different genre from a personal website. Use this as a reason to review generic vocabulary in context, not as a forbidden-word classifier.
- [Pew Research Center, 20 August 2026](https://www.pewresearch.org/data-labs/2026/08/20/how-much-of-the-internet-is-written-with-ai/) and [methodology](https://www.pewresearch.org/data-labs/2026/08/20/methodology-ai-content/): their English-web analysis tracks vocabulary, punctuation and repeated contrast constructions. Those patterns occur in human writing too. The methodology explicitly treats page classifications as uncertain and distinguishes aggregate findings from individual verdicts. This supports checking repetitive stylistic patterns, not assigning an AI percentage to this site.
- [Liang et al., Patterns, 2023](https://doi.org/10.1016/j.patter.2023.100779), [authors' paper](https://arxiv.org/abs/2304.02819): the detectors studied often mislabeled non-native English writing, and wording changes affected results. This is evidence about those systems and samples, not a measurement of every current detector. Preserve the author's natural English and Turkish. Do not add elaborate vocabulary or intentional errors to satisfy a detector.
- [GOV.UK, clear language](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/) and [tone](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/tone-of-voice/right-tone/): use familiar words, direct verbs and specific information; write for the reader's task. Specialist readers also benefit from plain language. These are useful editing practices rather than research into AI authorship.

The practical conclusion is an editorial choice: concrete facts, a personal voice and useful information matter more than a detector score. The checks below combine that evidence with Berk's explicit preferences. They are not universal signs of machine authorship.

## Repo rules

1. No em dash or horizontal bar in newly authored visible copy. Use a full stop, comma, colon or parentheses according to the sentence. Date ranges can retain their en dash. This is the owner's preference, not a scientific claim about punctuation.
2. No slogan headlines, motivational padding, generic invitation, empty praise or sales language. A heading names the subject. A button names its action.
3. Write what happened, who did it and, when known, how. Keep verified project names, technical terms, dates and qualifications exact. Do not invent impact, seniority, scale or emotional claims.
4. Review clusters of vague words: delve, unlock, elevate, seamless, cutting-edge, game-changing, tapestry, ever-evolving, leverage, foster, robust, transformative. A term with a precise technical meaning can remain; a sentence that says nothing specific cannot.
5. Review repeated rhetorical patterns: “not just X, but Y”, “where X meets Y”, three abstract nouns in every heading, a question answered immediately, identical paragraph openings and a summary that restates every previous line.
6. Turkish gets the same attention. Flag phrases such as “geleceği şekillendiriyorum”, “sınırları aşıyorum”, “tutkuyla harmanlıyorum”, “benzersiz bir yolculuk” and “yenilikçi çözümler sunuyorum”. Ask what the sentence actually tells the visitor. Preserve natural Turkish; do not turn it into translated corporate English.
7. Do not fix tone by sprinkling in slang, forced jokes, fragments, random synonyms or mistakes. Read aloud and remove any phrase the author would not plausibly say.
8. UI labels such as Download PDF, Print, Experience and Project Details are useful. Do not make them clever. Proper technical names and direct quotations are reviewed in their own context.

## Editing examples

These are invented examples for this guide, not replacements for CV text.

| Weak sentence | Better editorial action |
| --- | --- |
| “Unlocking seamless cloud experiences.” | State which system was built and what it does. If that fact is unavailable, delete the sentence. |
| “Where technology meets imagination.” | Name the actual section or project. |
| “I leverage cutting-edge tools to deliver transformative results.” | Name the tool, action and supported result. Never fill a missing result with an invented number. |
| “Teknolojinin sınırlarını aşan yenilikçi çözümler.” | Hangi proje, hangi sorun, hangi katkı? Kaynakta yoksa ekleme. |

## Review loop

1. Read only the changed visible copy and its surrounding paragraph/section. Include changed headings, navigation, buttons, captions, empty states, accessible labels and mobile-only text. Expand to the whole page only when context or repetition requires it.
2. Mark each issue with the exact sentence, reason, ownership and a proposed correction. For `cv.json`, `resume.ts` and `portfolio.ts`, record an upstream issue instead of editing generated text.
3. `pnpm oracle:plan` produces lexical candidates from added source lines, including new src/public files. Check whether each candidate is actually visible copy; source code can match too. Read changed copy even with zero candidates. For a deliberate whole-site audit, use `python scripts/check-editorial.py --root dist --out .local/editorial-review.json` after building. Neither tool rewrites text or certifies authorship.
4. Check EN and TR separately. A good English sentence does not prove that its Turkish counterpart works.
5. Read the revised page aloud. Accept only after both language and [visual review](VISUAL-ORACLE.md) pass. Quote exceptions explicitly; do not silently waive them.

Existing historical blog articles and generated CV text are not rewritten as part of a layout change. Record their findings with their owner and scope. Do not claim that all site copy passed because only the changed page was inspected.

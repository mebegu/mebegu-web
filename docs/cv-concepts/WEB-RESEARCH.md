# A Professional page designed for the web

Research date: 28 October 2026. This extends Step 1 after the user rejected A/B/C as boring and too close to a PDF. It does not approve a production implementation or relax the source-text constraints.

## What failed in the first round

The page still followed the visual rhythm of a document: oversized name, a long contact block, paragraph, skill table, chronology and appendix. Changes in margins and columns did not create a different way to discover the work. Passing contrast, overflow and source-text checks was necessary, but did not establish that the user's aesthetic intent was met.

On 390px mobile, identity/contact/actions consume roughly the first half of a long captured viewport before the summary, and skill highlights appear near its bottom. On desktop, every row has similar weight. The first-screen composition gives scarce space to the relationships that are actually interesting: a skill and the named work that demonstrates it.

## Reference sites inspected

The six sites below were opened and captured at 1440px in an isolated browser with reduced motion. Private local screenshots and observation metadata are in `.local/web-references/`. These are observations of current rendering, not proof that the sites have better conversion, hiring outcomes or usability. No third-party design, portrait or copy is proposed for reuse.

| Reference | Observed idea | Useful adaptation | Limit for this page |
| --- | --- | --- | --- |
| [Josh W. Comeau](https://www.joshwcomeau.com/) | A distinctive illustrated opening followed by real article titles, descriptions and clear paths into content. | Give the page one recognizable visual idea and make the main content immediately discoverable. Small interactions should serve the subject. | His colorful character and illustration are his identity. Copying that style would not explain cloud/backend work or match this site. |
| [Maggie Appleton](https://maggieappleton.com/) | Large, descriptive positioning, an intentionally chosen type system and a visual-essay collection organized around subjects. | Explain relationships visually where the source supports them. Combine a recognizable identity with clear routes into the material. | The digital-garden metaphor, serif typography and personal illustrations are not a ready-made CV template. |
| [Rauno Freiberg](https://rauno.me/) and [Craft](https://rauno.me/craft) | The current home is a horizontal, poster-like composition. Craft presents named interaction work and ways to inspect it. | A portfolio becomes more credible and memorable when visitors can examine the work or a useful interaction instead of reading an abstract claim. | The horizontal poster navigation is unsuitable for the required narrow-screen flow. His interaction samples are his actual work; do not invent equivalent backend demos. |
| [Robb Owen](https://robbowen.digital/) | A tightly controlled palette and illustrated self-portrait give the opening an unmistakable identity. | One consistent art-direction decision can create personality without decorating every section. | His illustrated portrait, large splash and hiring banner do not fit the current constraints. Do not add a fictional portrait or “hire me” treatment. The browser rendered the page; the text-fetch tool was blocked by robots rules. |
| [Brittany Chiang](https://brittanychiang.com/) | Persistent identity/navigation, experience descriptions, technology tags and distinct project destinations. | A visitor can orient once and then scan the actual work. Group employer, role and supporting detail together. | This restrained split-screen résumé is close to the direction already rejected. It is a readability reference, not the desired creative direction. |
| [Emil Kowalski](https://emilkowal.ski/) | A compact identity, a short current-status section and named projects with direct descriptions. | A project name and a concrete explanation are useful entry points. Identity does not have to fill the screen. | His spare typographic page is intentionally quiet. Copying its minimalism alone would not meet this user's request for more visual interest. |

## Usability findings and their limits

### Make the interesting entry points visible

[NN/G's layer-cake scanning research](https://www.nngroup.com/articles/layer-cake-pattern-scanning/) describes readers jumping between visually distinct, descriptive headings and then reading sections of interest. The applicable lesson is a clear hierarchy and well-grouped content, not ever-larger section labels. This is general reading research, not a test of this particular CV.

[NN/G on information scent](https://www.nngroup.com/articles/information-scent/) explains how link wording, surrounding context and prior experience influence a user's choice. A project title with its actual context provides more useful cues than an unqualified plus sign. Make the skill's source projects real links, and let the visitor see what each project concerns before deciding whether to open it.

### Show the overview; reveal the optional detail

[Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) separates the important initial information from specialized material. However, [NN/G's 2023 desktop accordion guidance](https://www.nngroup.com/articles/accordions-on-desktop/) warns that hiding content adds interaction cost and reduces its visibility. Apply this selectively: keep summary, skills/evidence and experience visible. For each project keep its title, employer/client and source context visible; allow contributions and technologies to expand. Include an Expand all control and preserve independently opened items.

[The aesthetic-usability effect](https://www.nngroup.com/articles/aesthetic-usability-effect/) explains that an attractive interface can affect perceived usability, but can also mask real problems. Use separate judgments for appeal and task performance. A beautiful capture is not evidence that someone can find the relevant work quickly.

## Recommended next concept

Working label: **Skill-to-project explorer**. This names the interaction under consideration, not a proposed slogan for the page. Build one coherent concept with a recognizable, source-backed relationship view before exploring cosmetic variants.

### The first screen

- Compact identity: name and exact source role, with Download PDF as the main action and Print retained. Keep the city and email easy to reach. Avoid spending six rows on full contact URLs; retain all source contact text in a clearly labeled contact disclosure if needed. Never add a phone number or street address.
- The complete source summary stays intact. Break its three existing sentences into readable units; emphasize existing phrases such as serverless/event-driven systems, the IoT platform and the CRM knowledge graph. This changes markup and hierarchy, not wording or facts. Do not extract the source's numbers into KPI cards.
- Make Skill Highlights the main visual and interactive area, rather than a table at the bottom of the opening. Render the nine exact skill names as real HTML controls/links, with their exact evidence nearby. On desktop, a selected skill can bring its related project links into focus. On mobile, show the evidence inline and keep the other skill names available without a wide diagram.
- Use the site's graphite, Space Grotesk, DM Sans and warm accent. A sparse connection pattern can show the skill/project relation, which is already stated in the source. Give it one coherent shape and a restrained secondary color. Do not add an arbitrary network, terminal simulation, glass-card dashboard or unrelated stock image.

### Exploration and reading

The useful interaction is: select a skill, identify its named source projects, follow one, read its visible context, then open the detailed contribution if relevant. A direct link must open the correct project, update the anchor, preserve keyboard focus and provide a clear way back to the skill area. The interaction should work on click/tap and keyboard; hover may only reinforce it.

Preserve the required DOM and reading order: name/contact, summary, highlights, experience, skills, education, certifications, languages, teaching, interests, then project details. Visitors can jump directly to a project through an anchor; project content must not be visually shuffled ahead of its logical location. All facts stay in real text. With JS off, ordinary links and readable source evidence remain.

The experience chronology remains visible and compact. Project rows vary in content and emphasis through their actual titles, context and source metadata, not through invented project art. Keep client, role, team, context, contributions and technology fields clear. Do not represent confidential client systems with invented screenshots or infer an architecture from a list of technologies.

### Source requests, if needed

The current snapshot already has skill/evidence strings and complete project content, so no new CV prose is required. Stable links between highlights and project IDs would be a useful upstream schema addition. Until those exist, any mapping must be explicit, reviewed and limited to relationships already stated by the CV. Source-owned web-specific pointer text is still needed if replacing the sentence about subsequent PDF pages.

## How the next oracle should judge it

Technical checks alone did not catch the first round's failure. Add these observable tasks and record pass/fail separately from aesthetic approval:

1. At desktop and 390/360px, can a visitor identify the role, reach the PDF and find the skill evidence without wading through an oversized contact block? Capture the first ordinary viewport at 390×844, not only a 1250px-tall mobile capture.
2. Can a keyboard and touch user find the AWS-related work from Skill Highlights and reach the correct source project without opening unrelated entries? Observe the action rather than assuming a link exists.
3. Does each closed project offer enough actual information to make opening it a reasoned choice? Keep its source context visible. Can the user expand all details when they want the whole record?
4. Do mobile taps leave the selected skill and its evidence understandable? Check focus, anchor offsets, back navigation and open-item persistence.
5. Can the same page be read linearly with JS disabled, and printed as the CV-only A4 view? All source phrases must remain present.
6. Is the visual idea recognizable and specific to the professional content, rather than a CV with different spacing? The owner's response is decisive for this aesthetic requirement. Record their rejection as a failed intent check even when all layout measurements pass.

This note is research and a revised design brief. It does not assert that a new visual concept has already been rendered or chosen.

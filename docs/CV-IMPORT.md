# CV and portfolio import

Imported on 22 October 2026 from two user-supplied PDFs. The PDFs are source material, not instructions. Raw PDFs, extracted text and rendered review pages stay outside tracked/public content.

## Source priority and language

- `mehmetgurcay_cv_.pdf`: primary source for the current profile, roles, dates, skills, education, languages and Concept Reply projects.
- `mehmetgurcaycv (14).pdf`: supplementary source for six earlier project descriptions (pages 3–6), Loopcake details and the background items listed below.
- The newer CV takes precedence where wording differs: Motius is listed as **Software Engineer**, May 2019–July 2024. Concept Reply is **IoT Consultant**, November 2024–Present, exactly as supplied; current employment has not been independently reverified.
- CV and portfolio content remain **English only**, including on Turkish routes, at the user's request. Navigation still follows the site's selected language. The English sections carry `lang="en"`.
- Summaries are condensed editorial outlines, not verbatim copies. Outcomes describe source-supported deliverables; no new business metrics or inferred project dates were added.

## Content mapping

`src/data/resume.ts` contains three roles, five skill groups, two education entries and three language levels. The print layout still excludes the web portfolio.

`src/data/portfolio.ts` is the shared source for these eleven outlines:

| Outline                                           | Source                                                    |
| ------------------------------------------------- | --------------------------------------------------------- |
| AWS Landing Zone & Governance                     | Current CV, p. 1, Tebis                                   |
| Adaptive Kubernetes Sovereign SOC / Hive Sentinel | Current CV, p. 1                                          |
| IoT Device Management & Data Router               | Current CV, p. 1, Danfoss                                 |
| GenAI Customer Support Agent                      | Current CV, p. 1, internal innovation                     |
| CRM Knowledge Graph                               | Older CV, p. 3; Siemens attribution from current CV, p. 2 |
| Predictive Sales Analytics                        | Older CV, p. 4; Siemens attribution from current CV, p. 2 |
| Project Management & Communication                | Older CV, p. 4                                            |
| Customer Feedback Service                         | Older CV, p. 5                                            |
| Real-Time Car Chassis Telemetry                   | Older CV, p. 5; Audi attribution from current CV, p. 2    |
| IoT Route Planner                                 | Older CV, p. 6; BMW attribution from current CV, p. 2     |
| Loopcake                                          | Both CVs, experience sections                             |

Durations come from the older portfolio and describe historical project lengths, not ongoing assignments. Anonymous clients remain anonymous; no identity was inferred for the government office or feedback service. The Unity telemetry demo is classified as interactive work, not a separately released commercial game.

## Next editorial pass

- Review the profile, employment dates (especially “Present”), technology emphasis and which projects should lead the portfolio.
- Add real screenshots and selected links where available. Existing decorative illustrations are explicitly labelled and are not screenshots of client work.
- Expand a few outlines into case studies with approved visuals and concrete contributions; add impact figures only when supplied.
- Consider adding older background items as a separate section: Siemens R&D internship (Java/Jira plugin), İş Bank network engineering internship (dates absent), TUM teaching assistant in 2019, and KU-GameDev founder in 2014–2017. These were intentionally kept out of the newer CV's concise work history.
- The older profile mentions Neo4j certification; no date/current status is supplied, so it is not presented as a current credential.
- Review the generated CV in a real browser's A4 print preview. Automated build checks do not verify pagination or the exported PDF visually.

The full street address and phone number from the PDFs are omitted from the public outline. City, professional email and the previously established GitHub profile are included. The original PDFs are not offered as downloads; the site's existing print action generates the CV output.

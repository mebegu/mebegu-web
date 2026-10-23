# Alamori: source-owned public content

The website is a static frontend. `src/data/alamori.json` is a generated public snapshot, not the editorial source. The book repository controls a separate, explicitly public page manifest and can update this website on demand. The website never fetches the private repository, holds its credentials or serves a proxy for it.

## Public boundary

The versioned allowlist is `schemas/alamori-publication.schema.json`: title/subtitle, author, bilingual synopsis, genres, current writing status, selected updates, public roadmap, blog references/bodies, reader contact, two covers and limited PDF previews. Unknown fields are rejected. There is no automatic copy of README, plans, reviews, release metadata, private URLs or source commit identifiers.

Only files explicitly referenced by `page.json` can be transferred. Images and PDFs receive content-hash filenames in `public/media/alamori/`. Each file is limited to 20 MiB; the complete package to 50 MiB and the manifest to 256 KiB. Local traversal and symlinks are rejected. Every file in this public package is deliberately public, including the preview's story pages.

The source builder uses the book's existing layout, produces a distinct public-preview footer, and clears source version/revision information. It creates a fresh PDF containing only the selected first pages. Document metadata, annotations, attachments, forms and outlines are not copied. The source repository checks this with a synthetic manuscript containing unpublished sentinels. Full-book temporary files and HTML are never staged or uploaded.

## On-demand source publication

In the source repository, edit `.alamori/public/page.json`. Increment `revision` and update the public date whenever selected content, cover or preview changes. **Publish Alamori page** runs only by manual dispatch on `main`. Its default is a validation run; enable its `publish` input to push. The default preview is **20 physical pages in each language**, including cover/front matter. Another page count (1–50) requires a new public revision.

Authentication uses a dedicated SSH deploy key with write access to this website repository, stored only as the source Actions secret `ALAMORI_SITE_DEPLOY_KEY`. The website has no credential for the book repository. This key cannot read any other private repository; as a repository write key, it can write the website repository and must remain confined to trusted source workflows. A GitHub deploy key cannot be restricted to individual paths; the publication job stages only the three owned output areas below.

The source job calls:

```sh
node public-site/scripts/import-alamori.mjs --source .alamori/build --site public-site
cd public-site && node scripts/check-alamori.mjs
```

It stages only `src/data/alamori.json`, `public/media/alamori/` and `src/content/writing/alamori-*.md`, then pushes one commit with a public revision number. A concurrent website update causes a retry from the latest `main`; no force push is used. Private source paths, repository URLs and commit identifiers are absent from the public commit message and snapshot. This ordinary SSH push triggers the site's existing Pages workflow.

## Blog content and frontend

An `articles` item can reference an existing public URL or contain a `post` with a stable `alamori-*` ID, public date and bilingual plain paragraphs. Embedded posts are generated into the normal Blog collection, with the relevant language cover, alternate language link and `Atlantis` category. HTML/MDX is not accepted through paragraph content. Generated files carry an ownership marker; manually authored files are not overwritten. Do not format or hand-edit these generated Markdown files; update their public source instead.

The page renders the snapshot through `AlamoriPage.astro`. Page URLs remain `/alamori/` and `/tr/alamori/`. Download links go to the selected public preview files, not private release assets. Reader feedback opens the configured external contact; the site does not store messages, collect money, accept pledges or imply a release date.

## Validation

```sh
pnpm test:alamori
pnpm check:alamori
pnpm validate
```

The checks validate the public shape, revisions, file hashes and generated blog posts. Identical content/revision is a no-op, older revisions are skipped, and changed content at the same revision is rejected. `publish: false` stops a new import; it does not withdraw earlier public files. Previously published assets remain public in Git history; later deletion does not make a published preview private again.

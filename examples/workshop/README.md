# Pocket Archive: complete publication example

`project.json` fills every supported project field using a working reading-list tool. The site displays its imported counterpart in `src/data/projects/pocket-archive.json`, with no fallback sample cards.

- `media/` contains two generated archive illustrations, an actual app screenshot, a recording of its reading filters as GIF/MP4, and Turkish/English VTT captions. Image prompts are recorded in `docs/assets/workshop-images.json`.
- Links open the working reading archive, its source code, a related bilingual making-of article or a relevant email composer. The app saves links, notes, tags and read status locally, with search and JSON export.
- All roadmap states and all four participation types are included. A project needs only the fields relevant to it; remove unused optional fields when adapting this example.

For another project, copy the manifest and referenced media into `.workshop/public/`, change the public ID and all project-specific text/links, and match `project-id` in the workflow. The template defaults to `publish: false`; enable it only when its public content is ready.

To reproduce this site's record locally, copy this folder to a temporary public source directory, set that copy's `publish` to `true`, then run:

```sh
node scripts/import-workshop.mjs --source /PATH/TO/TEMP-PUBLIC-DIRECTORY --id pocket-archive --site .
pnpm check:workshop
```

Changes require incrementing `revision` in the source manifest before reimporting. The importer transfers only the manifest and its referenced assets, producing content-hashed filenames. See [the integration guide](../../docs/WORKSHOP-INTEGRATION.md).

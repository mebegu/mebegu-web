# Imported public projects

The publication workflow creates one validated `<id>.json` file here. Each file follows `schemas/workshop-publication.schema.json` and contains only explicitly public metadata. Referenced local media is stored under `public/media/projects/<id>/` with content-hash filenames.

`pocket-archive.json` is the sole current record. It describes the working Pocket Archive reading tool at `/tools/pocket-archive/` and `/tr/tools/pocket-archive/`, with a related bilingual making-of post. It was generated through the actual local importer from `examples/workshop/project.json` and its seven referenced assets, explicitly enabling publication in a temporary source copy. It exercises every project field, three media types, both caption languages, all roadmap states and all four participation channels. There are no fallback sample projects or blank-page entries.

Edit the source manifest, increment `revision`, and import again; do not hand-edit the generated content hashes. The copy template keeps `publish: false` to prevent accidental publication from another project. Do not place private repository metadata, credentials or source files here.

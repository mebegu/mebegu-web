import { parseArgs } from 'node:util';
import path from 'node:path';
import { prepareAlamori, importAlamori } from './lib/alamori-bundle.mjs';
const { values } = parseArgs({
  options: {
    source: { type: 'string' },
    site: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
});
try {
  if (!values.source || (!values.site && !values['dry-run']))
    throw Error(
      'Use --source PUBLIC_DIRECTORY --site SITE_DIRECTORY [--dry-run]',
    );
  const bundle = await prepareAlamori(path.resolve(values.source));
  console.log(
    JSON.stringify(
      await importAlamori(
        bundle,
        path.resolve(values.site || '.'),
        values['dry-run'],
      ),
    ),
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

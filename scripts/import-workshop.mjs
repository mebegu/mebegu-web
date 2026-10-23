import path from 'node:path';
import { parseArgs } from 'node:util';
import {
  preparePublication,
  importPublication,
} from './lib/workshop-bundle.mjs';

const { values } = parseArgs({
  options: {
    source: { type: 'string' },
    id: { type: 'string' },
    site: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
});
try {
  if (!values.source || !values.id || (!values.site && !values['dry-run']))
    throw Error(
      'Use --source PUBLIC_DIRECTORY --id PUBLIC_ID --site SITE_DIRECTORY [--dry-run]',
    );
  const bundle = await preparePublication(
    path.resolve(values.source),
    values.id,
  );
  const result = await importPublication(
    bundle,
    path.resolve(values.site || '.'),
    values['dry-run'],
  );
  console.log(JSON.stringify(result));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

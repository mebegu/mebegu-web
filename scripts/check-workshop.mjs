import path from 'node:path';
import { readdir } from 'node:fs/promises';
import {
  checkStoredPublication,
  MAX_MANIFEST_BYTES,
  safeFile,
} from './lib/workshop-bundle.mjs';

const directory = path.resolve('src/data/projects');
let files;
try {
  files = await readdir(directory);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  files = [];
}
let checked = 0;
for (const file of files.filter((name) => name.endsWith('.json')).sort()) {
  const record = JSON.parse(
    (await safeFile(directory, file, MAX_MANIFEST_BYTES)).toString('utf8'),
  );
  await checkStoredPublication(record, process.cwd(), file.slice(0, -5));
  checked++;
}
console.log(
  `Verified ${checked} public workshop publications and their media.`,
);

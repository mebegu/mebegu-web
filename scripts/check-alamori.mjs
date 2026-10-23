import { readFile } from 'node:fs/promises';
import { checkStoredAlamori } from './lib/alamori-bundle.mjs';
const record = JSON.parse(await readFile('src/data/alamori.json', 'utf8'));
await checkStoredAlamori(record, process.cwd());
console.log(
  `Verified Alamori revision ${record.revision}, public covers and ${record.book.previews.length} PDF previews.`,
);

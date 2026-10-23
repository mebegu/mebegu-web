import record from './alamori.json';
import { validateAlamori } from '../../scripts/lib/alamori-bundle.mjs';

// This is a public build snapshot. Its source of truth is the book's publication package.
validateAlamori(record);
export const alamori = record.book;

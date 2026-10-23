import record from './alamori.json';
import { validateAlamori } from '../../scripts/lib/alamori-bundle.mjs';
import type { Lang } from '../lib/i18n';

type AlamoriArticle = {
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  url: Record<Lang, string>;
};

// This is a public build snapshot. Its source of truth is the book's publication package.
validateAlamori(record);
export const alamori: Omit<typeof record.book, 'articles'> & {
  articles: AlamoriArticle[];
} = record.book;

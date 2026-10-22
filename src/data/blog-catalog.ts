import { getCollection } from 'astro:content';
import { localPath, type Lang } from '../lib/i18n';
import { postCalendarDate } from '../lib/post-dates';

type Localized = Record<Lang, string>;
type Shelf = 'technology' | 'culture' | 'society';
export const catalogShelves: { id: Shelf; title: Localized }[] = [
  {
    id: 'technology',
    title: { tr: 'Teknoloji & dijital yaşam', en: 'Technology & digital life' },
  },
  { id: 'culture', title: { tr: 'Oyun & sinema', en: 'Games & cinema' } },
  { id: 'society', title: { tr: 'Toplum & şehir', en: 'Society & city' } },
];

// Curated story keys remain stable across original articles and translations.
export const featuredPostIds = [
  'weebly-google-glass',
  'weebly-computer-virus-hoaxes',
  'weebly-stanbul-traffic-for-dummies',
  'weebly-the-walking-dead-the-game-season-2',
];

export async function getBlogCatalog(lang: Lang) {
  const entries = await getCollection('writing', ({ data }) => !data.draft);
  return entries
    .filter((post) => post.data.catalog)
    .map((original) => {
      const post =
        entries.find(
          (entry) =>
            entry.data.translationKey === original.data.translationKey &&
            entry.data.lang === lang,
        ) ?? original;
      const metadata = original.data.catalog!;
      return {
        id: post.id,
        key: post.data.translationKey,
        shelf: metadata.shelf,
        title: post.data.title,
        description: metadata.summary[lang],
        cover: { ...metadata.cover, alt: metadata.cover.alt[lang] },
        tone: metadata.tone,
        lang: post.data.lang,
        date: postCalendarDate(original.data),
        path: localPath(`writing/${post.id}/`, post.data.lang),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

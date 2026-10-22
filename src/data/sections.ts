import type { Lang } from '../lib/i18n';

/** The landing and inner-page navigation share this registry. */
export const sections = [
  {
    id: 'professional',
    path: 'professional/',
    title: { tr: 'Profesyonel', en: 'Professional' },
    description: { tr: 'Özgeçmiş ve portföy', en: 'CV & selected work' },
    sky: '#274e70',
    paint: '#d9e4e5',
  },
  {
    id: 'blog',
    path: 'writing/',
    title: { tr: 'Blog', en: 'Blog' },
    description: {
      tr: 'Notlar, fikirler, keşifler',
      en: 'Notes, ideas, discoveries',
    },
    sky: '#69364f',
    paint: '#ebd1cc',
  },
  {
    id: 'alamori',
    path: 'alamori/',
    title: { tr: 'Alamori', en: 'Alamori' },
    description: { tr: 'Bir hikâyenin izinde', en: 'Following a story' },
    sky: '#245c4d',
    paint: '#dce3c3',
  },
  {
    id: 'projects',
    path: 'projects/',
    title: { tr: 'Atölye', en: 'Workshop' },
    description: {
      tr: 'Hobi projeleri ve deneyler',
      en: 'Side projects & experiments',
    },
    sky: '#785333',
    paint: '#eddbb9',
  },
] as const;

export function localizedSections(lang: Lang) {
  return sections.map((section) => ({
    ...section,
    title: section.title[lang],
    description: section.description[lang],
  }));
}

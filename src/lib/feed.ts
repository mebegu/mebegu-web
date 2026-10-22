import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { copy, localPath, type Lang } from './i18n';

export async function feed(context: APIContext, lang: Lang) {
  const posts = (
    await getCollection(
      'writing',
      ({ data }) => !data.draft && data.lang === lang,
    )
  ).sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
  return rss({
    title: `${site.name} — ${copy[lang].nav[1]}`,
    description: copy[lang].description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: localPath(`writing/${post.id}/`, lang),
    })),
    customData: `<language>${lang}</language>`,
  });
}

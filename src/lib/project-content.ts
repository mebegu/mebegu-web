import type { ProjectLink } from '../data/projects';
import type { Lang } from './i18n';
import { href } from './urls';

export function projectUrl(
  value: ProjectLink['url'],
  lang: Lang,
): string | null {
  const url = (typeof value === 'string' ? value : value?.[lang])?.trim();
  if (!url) return null;
  if (url.startsWith('//')) return `https:${url}`;
  if (/^[a-z][a-z\d+.-]*:/i.test(url))
    return /^(https?:\/\/|mailto:)/i.test(url) ? url : null;
  return href(url);
}

export const projectExternal = (url: string) => /^https?:\/\//i.test(url);

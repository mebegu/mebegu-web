import type { Lang } from '../lib/i18n';
import { validatePublication } from '../../scripts/lib/workshop-schema.mjs';

export type ProjectText = Record<Lang, string>;
export type ProjectKind =
  'apps' | 'tools' | 'libraries' | 'games' | 'experiments';
export type ProjectStatus =
  'idea' | 'in-progress' | 'released' | 'completed' | 'paused' | 'archived';

/** A store, repository, website, download or documentation, with no fixed provider. */
export interface ProjectLink {
  label: ProjectText;
  url: string | ProjectText | null;
  primary?: boolean;
}
interface MediaBase {
  src: string;
  alt: ProjectText;
  caption?: ProjectText;
}
export type ProjectMedia =
  | (MediaBase & { type: 'screenshot'; width: number; height: number })
  | (MediaBase & { type: 'gif'; poster: string; width: number; height: number })
  | (MediaBase & {
      type: 'video';
      poster?: string;
      captions?: { src: string; lang: Lang; label: string }[];
    });

export interface Project {
  id: string;
  kind: ProjectKind;
  status: ProjectStatus;
  title: ProjectText;
  hook: ProjectText;
  description: ProjectText;
  technologies: string[];
  platforms?: string[];
  version?: string;
  updatedAt?: string;
  visual: 'world' | 'gameplay' | 'app' | 'tool' | 'shader';
  media: ProjectMedia[];
  links: ProjectLink[];
  currentFocus?: ProjectText;
  notice?: ProjectText;
  limitations?: ProjectText[];
  updates?: {
    date: string;
    title: ProjectText;
    body: ProjectText;
    version?: string;
  }[];
  roadmap?: {
    state: 'done' | 'current' | 'next';
    title: ProjectText;
    body?: ProjectText;
  }[];
  articles?: {
    title: ProjectText;
    summary: ProjectText;
    url: string | ProjectText | null;
  }[];
  participation?: {
    type: 'feedback' | 'feature' | 'bug' | 'contribute';
    title: ProjectText;
    description: ProjectText;
    url: string | ProjectText | null;
  }[];
  placeholder: false;
}

export const projectKinds: { id: ProjectKind; label: ProjectText }[] = [
  { id: 'apps', label: { tr: 'Uygulamalar', en: 'Apps' } },
  { id: 'tools', label: { tr: 'Araçlar', en: 'Tools' } },
  { id: 'libraries', label: { tr: 'Kütüphaneler', en: 'Libraries' } },
  { id: 'games', label: { tr: 'Oyunlar', en: 'Games' } },
  { id: 'experiments', label: { tr: 'Deneyler', en: 'Experiments' } },
];
export const projectStatuses: { id: ProjectStatus; label: ProjectText }[] = [
  { id: 'idea', label: { tr: 'Fikir aşamasında', en: 'An idea' } },
  { id: 'in-progress', label: { tr: 'Geliştiriliyor', en: 'In progress' } },
  { id: 'released', label: { tr: 'Yayında', en: 'Released' } },
  { id: 'completed', label: { tr: 'Tamamlandı', en: 'Completed' } },
  { id: 'paused', label: { tr: 'Ara verildi', en: 'On hold' } },
  { id: 'archived', label: { tr: 'Arşiv', en: 'Archived' } },
];

const publications = import.meta.glob<{
  publish: boolean;
  project: Project;
}>('./projects/*.json', { eager: true, import: 'default' });
const importedProjects = Object.entries(publications)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([file, record]) => {
    validatePublication(record);
    if (!record.publish || file !== `./projects/${record.project.id}.json`)
      throw new Error('Invalid stored Workshop publication');
    return {
      ...record.project,
      technologies: record.project.technologies ?? [],
      media: record.project.media ?? [],
      links: record.project.links ?? [],
      visual: record.project.visual ?? 'app',
      placeholder: false,
    } as Project;
  });
export const projects: Project[] = importedProjects;

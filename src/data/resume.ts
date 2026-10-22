import type { Lang } from '../lib/i18n';
import { site } from './site';

type Localized = Record<Lang, string>;
export interface Experience {
  role: Localized;
  organization: string;
  period: Localized;
  location?: Localized;
  highlights: Localized[];
}
export interface Education {
  degree: Localized;
  institution: string;
  period: Localized;
  detail?: Localized;
}
export interface SkillGroup {
  label: Localized;
  skills: string[];
}
export interface WorkSample {
  title: Localized;
  context: Localized;
  contribution: Localized;
  outcome: Localized;
  technologies: string[];
  url?: string;
}
interface Resume {
  status: 'draft' | 'ready';
  name: string;
  role: Localized;
  summary: Localized | null;
  location: Localized | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  website: string | null;
  experience: Experience[];
  skills: SkillGroup[];
  education: Education[];
  languages: Localized[];
  work: WorkSample[];
}

/** Verified facts only. Keep newest experience/education first. See docs/CV.md. */
export const resume: Resume = {
  status: 'draft',
  name: site.name,
  role: { tr: 'Yazılım geliştirici', en: 'Software developer' },
  summary: null,
  location: null,
  email: null,
  phone: null,
  linkedin: null,
  github: null,
  website: null,
  experience: [],
  skills: [],
  education: [],
  languages: [],
  work: [],
};

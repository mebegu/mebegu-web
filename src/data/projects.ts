import type { Lang } from '../lib/i18n';

type Localized = Record<Lang, string>;
export type ProjectKind = 'games' | 'software' | 'experiments';
export interface Project {
  id: string;
  kind: ProjectKind;
  title: Localized;
  description: Localized;
  technologies: string[];
  visual: 'world' | 'gameplay' | 'app' | 'tool' | 'shader';
  image: string | null;
  demoUrl: string | null;
  codeUrl: string | null;
  placeholder: boolean;
}

/** Personal/hobby layout examples only. Professional work belongs in portfolio.ts. */
export const projects: Project[] = [
  {
    id: 'unity-game',
    kind: 'games',
    visual: 'world',
    title: { tr: 'Unity oyunu', en: 'A Unity game' },
    description: {
      tr: 'Oyunun dünyası, oynanışı ve geliştirme süreci için ayrılmış bir yer. Buraya gerçek oyundan bir görsel veya kısa bir video gelecek.',
      en: 'A place for a game’s world, gameplay, and development process. A real screenshot or short video will live here.',
    },
    technologies: ['Unity', 'C#'],
    image: null,
    demoUrl: null,
    codeUrl: null,
    placeholder: true,
  },
  {
    id: 'software-project',
    kind: 'software',
    visual: 'app',
    title: { tr: 'Bir yazılım projesi', en: 'A software project' },
    description: {
      tr: 'Çözülen problem, projenin nasıl çalıştığı ve geliştirdiğim parçalar için kısa bir tanıtım alanı.',
      en: 'A short introduction to the problem, how the project works, and the parts I built.',
    },
    technologies: ['Web', 'API'],
    image: null,
    demoUrl: null,
    codeUrl: null,
    placeholder: true,
  },
  {
    id: 'gameplay-experiment',
    kind: 'games',
    visual: 'gameplay',
    title: { tr: 'Oynanış denemesi', en: 'A gameplay experiment' },
    description: {
      tr: 'Tek bir mekanik veya küçük bir oyun prototipi. Kontroller, fikir ve denemeden öğrenilenler burada anlatılacak.',
      en: 'A single mechanic or a small game prototype. The idea, controls, and lessons from the experiment will go here.',
    },
    technologies: ['Unity', 'Prototype'],
    image: null,
    demoUrl: null,
    codeUrl: null,
    placeholder: true,
  },
  {
    id: 'small-tool',
    kind: 'software',
    visual: 'tool',
    title: { tr: 'Küçük bir araç', en: 'A small tool' },
    description: {
      tr: 'Günlük bir ihtiyaca cevap veren uygulama, otomasyon veya yardımcı araç için bir alan.',
      en: 'A space for an app, automation, or utility that answers an everyday need.',
    },
    technologies: ['Tool', 'Automation'],
    image: null,
    demoUrl: null,
    codeUrl: null,
    placeholder: true,
  },
  {
    id: 'visual-experiment',
    kind: 'experiments',
    visual: 'shader',
    title: { tr: 'Görsel bir deney', en: 'A visual experiment' },
    description: {
      tr: 'Grafik, etkileşim veya farklı bir teknik fikri kurcaladığım denemeler için açık bir yer.',
      en: 'An open space for experiments with graphics, interaction, or an unusual technical idea.',
    },
    technologies: ['Graphics', 'Experiment'],
    image: null,
    demoUrl: null,
    codeUrl: null,
    placeholder: true,
  },
];

export const projectKinds: { id: ProjectKind; label: Localized }[] = [
  { id: 'games', label: { tr: 'Oyunlar', en: 'Games' } },
  { id: 'software', label: { tr: 'Yazılımlar', en: 'Software' } },
  { id: 'experiments', label: { tr: 'Deneyler', en: 'Experiments' } },
];

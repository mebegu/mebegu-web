import { portfolio } from './portfolio';

/** Shared English outlines; real screenshots and public URLs can be added later. */
export const projects = portfolio.map((entry) => ({
  ...entry,
  description: entry.context,
  image: null as string | null,
  demoUrl: null as string | null,
  codeUrl: null as string | null,
}));

export const projectKinds = [
  { id: 'games', label: 'Games & interactive' },
  { id: 'software', label: 'Software' },
];

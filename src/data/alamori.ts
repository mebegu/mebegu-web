import type { Lang } from '../lib/i18n';

/** Fill these when the book content is ready. Paths are relative to public/. */
export const alamori: {
  synopsis: Record<Lang, string> | null;
  pdfPath: string | null;
  feedbackUrl: string | null;
} = {
  synopsis: null,
  pdfPath: null,
  feedbackUrl: null,
};

/** Weebly's visible calendar day is authoritative for display, not the import day. */
export function postCalendarDate(data: {
  published: Date;
  source?: { visibleDate: string };
}) {
  const match = data.source?.visibleDate.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
  );
  if (match) {
    const [, day, month, year] = match;
    const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    if (new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date)
      return date;
  }
  return data.published.toISOString().slice(0, 10);
}

export function formatPostDate(date: string, lang: 'en' | 'tr') {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(
    lang === 'tr' ? 'tr-TR' : 'en-GB',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    },
  );
}

const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

/** 24 October 2026 */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** October 2026 */
export function formatMonth(iso: string): string {
  return monthFormatter.format(new Date(iso));
}

/** 0:38 */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

const seasonLabels = { kharif: 'Kharif', rabi: 'Rabi', zaid: 'Zaid', perennial: 'Perennial' } as const;

export function formatSeason(season: keyof typeof seasonLabels, year?: number): string {
  return year ? `${seasonLabels[season]} ${year}` : seasonLabels[season];
}

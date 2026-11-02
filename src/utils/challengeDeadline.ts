/** Fecha de calendario local; no convertir a UTC para comparar días. */
function localDateString(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getMinChallengeDeadline(now = new Date()): string {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return localDateString(tomorrow);
}

/** Rechaza fechas inexistentes y exige un día estrictamente posterior a hoy. */
export function isFutureChallengeDeadline(value: string, now = new Date()): boolean {
  if (typeof value !== 'string' || value.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  if (year < 1 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
  return value > localDateString(now);
}

const LONG_WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function formatMonthYear(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatLongDate(date: Date): string {
  return `${LONG_WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** Returns 1-indexed weeks for a calendar grid (Mon–Sun order). */
export function getCalendarWeeks(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  // Monday = 0 … Sunday = 6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export { MONTHS };

/**
 * Converts a wall-clock slot time on a specific date (in IST) into the
 * display time for a given IANA timezone.
 */
export function convertSlotTime(
  date: Date,
  hour: number,
  minute: number,
  targetTZ: string
): string {
  // Build a date that represents the IST wall-clock time
  const istOffset = 5.5 * 60; // minutes
  const utcMs =
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute) -
    istOffset * 60 * 1000;

  const d = new Date(utcMs);
  return d.toLocaleTimeString("en-IN", {
    timeZone: targetTZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

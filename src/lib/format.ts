import { formatInTimeZone } from "date-fns-tz";
import { AVAILABILITY_CONFIG } from "../../shared/availability.config";

export function formatMonthYear(date: Date, timezone: string = AVAILABILITY_CONFIG.timezone): string {
  return formatInTimeZone(date, timezone, "MMMM yyyy");
}

export function formatLongDate(date: Date, timezone: string = AVAILABILITY_CONFIG.timezone): string {
  return formatInTimeZone(date, timezone, "eeee, MMMM d, yyyy");
}

export function formatDayHeader(date: Date, timezone: string = AVAILABILITY_CONFIG.timezone): string {
  return formatInTimeZone(date, timezone, "eeee, MMMM d");
}

export function formatIsoDate(date: Date, timezone: string = AVAILABILITY_CONFIG.timezone): string {
  return formatInTimeZone(date, timezone, "yyyy-MM-dd");
}

export function formatSlotTime(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "h:mmaaa");
}

export function formatSlotRange(
  startDate: Date,
  durationMinutes: number = AVAILABILITY_CONFIG.durationMinutes,
  timezone: string = AVAILABILITY_CONFIG.timezone
): string {
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
  const startStr = formatInTimeZone(startDate, timezone, "h:mmaaa");
  const endStr = formatInTimeZone(endDate, timezone, "h:mmaaa");
  return `${startStr} - ${endStr}`;
}

export function getCalendarWeeks(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

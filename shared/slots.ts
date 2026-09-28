import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { AVAILABILITY_CONFIG } from "./availability.config.js";

export function isBlockedDate(isoDate: string): boolean {
  return AVAILABILITY_CONFIG.blockedDates.includes(isoDate);
}

export function formatIsoDate(date: Date, timezone: string = AVAILABILITY_CONFIG.timezone): string {
  return formatInTimeZone(date, timezone, "yyyy-MM-dd");
}

export function getMonthlyBookingsCount(
  monthKey: string,
  bookedSlots: (string | Date)[] = []
): number {
  let count = 0;
  for (const b of bookedSlots) {
    const bDate = typeof b === "string" ? new Date(b) : b;
    if (isNaN(bDate.getTime())) continue;
    const key = formatInTimeZone(bDate, AVAILABILITY_CONFIG.timezone, "yyyy-MM");
    if (key === monthKey) {
      count++;
    }
  }
  return count;
}

export function isMonthCapped(
  monthKey: string,
  bookedSlots: (string | Date)[] = []
): boolean {
  return getMonthlyBookingsCount(monthKey, bookedSlots) >= AVAILABILITY_CONFIG.monthlyCap;
}

/**
 * Returns start instants (Date objects) in UTC for the given ISO date string (YYYY-MM-DD)
 * calculated in Asia/Kolkata timezone.
 * Enforces monthly cap of 15 bookings.
 * Filters out past slots earlier than now + minNoticeMinutes.
 * Filters out already booked slots.
 */
export function getSlotsForDate(
  isoDate: string,
  now: Date = new Date(),
  bookedSlots: (string | Date)[] = []
): Date[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return [];
  }

  if (isBlockedDate(isoDate)) {
    return [];
  }

  const monthKey = isoDate.slice(0, 7);
  if (isMonthCapped(monthKey, bookedSlots)) {
    return [];
  }

  const midnightIst = fromZonedTime(`${isoDate}T00:00:00`, AVAILABILITY_CONFIG.timezone);
  const dayOfWeek = parseInt(formatInTimeZone(midnightIst, AVAILABILITY_CONFIG.timezone, "i"), 10);

  let timeWindows: { start: string; end: string }[] = [];
  if (dayOfWeek === 4) {
    timeWindows = AVAILABILITY_CONFIG.weekly.thursday;
  } else if (dayOfWeek === 6) {
    timeWindows = AVAILABILITY_CONFIG.weekly.saturday;
  } else {
    return [];
  }

  const durationMs = AVAILABILITY_CONFIG.durationMinutes * 60 * 1000;
  const minNoticeMs = AVAILABILITY_CONFIG.minNoticeMinutes * 60 * 1000;
  const earliestAllowedTime = now.getTime() + minNoticeMs;

  const bookedTimestamps = new Set(
    bookedSlots.map((b) => (typeof b === "string" ? new Date(b).getTime() : b.getTime()))
  );

  const slots: Date[] = [];

  for (const window of timeWindows) {
    const windowStart = fromZonedTime(`${isoDate}T${window.start}:00`, AVAILABILITY_CONFIG.timezone);
    const windowEnd = fromZonedTime(`${isoDate}T${window.end}:00`, AVAILABILITY_CONFIG.timezone);

    let current = windowStart.getTime();
    while (current + durationMs <= windowEnd.getTime()) {
      const slotDate = new Date(current);
      const isPast = slotDate.getTime() < earliestAllowedTime;
      const isBooked = bookedTimestamps.has(slotDate.getTime());

      if (!isPast && !isBooked) {
        slots.push(slotDate);
      }
      current += durationMs;
    }
  }

  return slots;
}

export function isBookableDay(
  isoDate: string,
  now: Date = new Date(),
  bookedSlots: (string | Date)[] = []
): boolean {
  if (isBlockedDate(isoDate)) {
    return false;
  }

  const slots = getSlotsForDate(isoDate, now, bookedSlots);
  return slots.length > 0;
}

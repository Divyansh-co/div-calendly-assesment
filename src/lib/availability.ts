/**
 * Availability rules:
 *  - Bookable weekdays: Thursday (4) and Saturday (6)
 *  - Blocked specific dates: Sep 24 2026
 *  - Thursday slots: 14:00, 15:00  (window 2–4 PM, 1-hour duration)
 *  - Saturday slots: 11:00, 12:00  (window 11 AM–1 PM, 1-hour duration)
 */

import type { TimeSlot } from "../types/booking";

const BLOCKED_DATES: string[] = [
  "2026-09-24", // explicitly excluded
];

const THURSDAY = 4;
const SATURDAY = 6;

const THURSDAY_SLOTS: TimeSlot[] = [
  { label: "2:00 PM", hour: 14, minute: 0 },
  { label: "3:00 PM", hour: 15, minute: 0 },
];

const SATURDAY_SLOTS: TimeSlot[] = [
  { label: "11:00 AM", hour: 11, minute: 0 },
  { label: "12:00 PM", hour: 12, minute: 0 },
];

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isBookableDay(date: Date, today: Date): boolean {
  // Strip time for past-date comparison
  const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (dateMidnight < todayMidnight) return false;

  const dow = date.getDay();
  if (dow !== THURSDAY && dow !== SATURDAY) return false;

  if (BLOCKED_DATES.includes(toLocalDateString(date))) return false;

  return true;
}

export function getSlotsForDate(date: Date): TimeSlot[] {
  const dow = date.getDay();
  if (dow === THURSDAY) return THURSDAY_SLOTS;
  if (dow === SATURDAY) return SATURDAY_SLOTS;
  return [];
}

/** Returns all bookable dates (Date objects) within a given month. */
export function getBookableDatesInMonth(year: number, month: number, today: Date): Date[] {
  const result: Date[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    if (isBookableDay(d, today)) {
      result.push(d);
    }
  }
  return result;
}

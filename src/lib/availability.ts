import type { TimeSlot } from "../types/booking";

// September 24 of ANY year must be completely blocked
export function isBlockedDate(date: Date): boolean {
  return date.getMonth() === 8 && date.getDate() === 24;
}

const THURSDAY = 4;
const SATURDAY = 6;

// Thursdays 14:00 - 16:00 (two 60-min slots: 14:00, 15:00)
const THURSDAY_SLOTS: TimeSlot[] = [
  { label: "2:00 PM", hour: 14, minute: 0 },
  { label: "3:00 PM", hour: 15, minute: 0 },
];

// Saturdays 11:00 - 13:00 (two 60-min slots: 11:00, 12:00)
const SATURDAY_SLOTS: TimeSlot[] = [
  { label: "11:00 AM", hour: 11, minute: 0 },
  { label: "12:00 PM", hour: 12, minute: 0 },
];

export function isBookableDay(date: Date, today: Date): boolean {
  // Strip time for past-date comparison
  const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (dateMidnight < todayMidnight) return false;

  // September 24 of any year is never selectable
  if (isBlockedDate(date)) return false;

  const dow = date.getDay();
  if (dow !== THURSDAY && dow !== SATURDAY) return false;

  return true;
}

export function getSlotsForDate(date: Date): TimeSlot[] {
  if (isBlockedDate(date)) return [];
  const dow = date.getDay();
  if (dow === THURSDAY) return THURSDAY_SLOTS;
  if (dow === SATURDAY) return SATURDAY_SLOTS;
  return [];
}

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

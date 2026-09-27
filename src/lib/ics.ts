import type { TimeSlot } from "../types/booking";
import { MEETING_DURATION_MINUTES, HOST_NAME, EVENT_TITLE } from "../constants/config";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Formats a Date into an ICS datetime string in the given timezone offset. */
function toICSLocal(date: Date, hour: number, minute: number): string {
  // We create a local representation in IST (Asia/Kolkata, +05:30).
  // The ICS will use TZID=Asia/Kolkata, so we write local wall-clock time.
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}${mo}${d}T${pad(hour)}${pad(minute)}00`;
}

function generateUID(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}@divyansh.booking`;
}

export function generateICS(
  date: Date,
  slot: TimeSlot,
  attendeeEmail: string,
  attendeeName?: string
): string {
  const startStr = toICSLocal(date, slot.hour, slot.minute);
  const endHour = Math.floor((slot.hour * 60 + slot.minute + MEETING_DURATION_MINUTES) / 60);
  const endMinute = (slot.hour * 60 + slot.minute + MEETING_DURATION_MINUTES) % 60;
  const endStr = toICSLocal(date, endHour, endMinute);

  const now = new Date();
  const dtstamp =
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  const safeAttendeeName = attendeeName?.trim() || "Attendee";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Divyansh Mishra Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Kolkata",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${generateUID()}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=Asia/Kolkata:${startStr}`,
    `DTEND;TZID=Asia/Kolkata:${endStr}`,
    `SUMMARY:${EVENT_TITLE}`,
    `ORGANIZER;CN=${HOST_NAME}:mailto:noreply@divyansh.booking`,
    `ATTENDEE;CN=${safeAttendeeName}:mailto:${attendeeEmail}`,
    `DESCRIPTION:A personal consultation call with ${HOST_NAME}.\\nPlease join on time from a quiet place.`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(
  date: Date,
  slot: TimeSlot,
  email: string,
  attendeeName?: string
): void {
  const content = generateICS(date, slot, email, attendeeName);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "booking-divyansh-mishra.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

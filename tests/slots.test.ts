import { describe, it, expect } from "vitest";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import {
  getSlotsForDate,
  isBookableDay,
  isBlockedDate,
  getMonthlyBookingsCount,
  isMonthCapped,
} from "../shared/slots";
import { AVAILABILITY_CONFIG } from "../shared/availability.config";

describe("Availability and Slot Generation Logic", () => {
  const futureNow = new Date("2026-01-01T00:00:00Z");

  it("generates 2:00 PM and 3:00 PM IST slots for Thursdays", () => {
    // 2026-11-12 is Thursday
    const slots = getSlotsForDate("2026-11-12", futureNow);
    expect(slots).toHaveLength(2);

    const slot0Time = formatInTimeZone(slots[0], AVAILABILITY_CONFIG.timezone, "HH:mm");
    const slot1Time = formatInTimeZone(slots[1], AVAILABILITY_CONFIG.timezone, "HH:mm");

    expect(slot0Time).toBe("14:00");
    expect(slot1Time).toBe("15:00");
    expect(isBookableDay("2026-11-12", futureNow)).toBe(true);
  });

  it("generates 11:00 AM and 12:00 PM IST slots for Saturdays", () => {
    // 2026-11-14 is Saturday
    const slots = getSlotsForDate("2026-11-14", futureNow);
    expect(slots).toHaveLength(2);

    const slot0Time = formatInTimeZone(slots[0], AVAILABILITY_CONFIG.timezone, "HH:mm");
    const slot1Time = formatInTimeZone(slots[1], AVAILABILITY_CONFIG.timezone, "HH:mm");

    expect(slot0Time).toBe("11:00");
    expect(slot1Time).toBe("12:00");
    expect(isBookableDay("2026-11-14", futureNow)).toBe(true);
  });

  it("returns empty slots and is not bookable for other weekdays", () => {
    // 2026-11-09 is Monday, 2026-11-11 is Wednesday, 2026-11-13 is Friday, 2026-11-15 is Sunday
    expect(getSlotsForDate("2026-11-09", futureNow)).toHaveLength(0);
    expect(isBookableDay("2026-11-09", futureNow)).toBe(false);

    expect(getSlotsForDate("2026-11-11", futureNow)).toHaveLength(0);
    expect(isBookableDay("2026-11-11", futureNow)).toBe(false);

    expect(getSlotsForDate("2026-11-13", futureNow)).toHaveLength(0);
    expect(isBookableDay("2026-11-13", futureNow)).toBe(false);

    expect(getSlotsForDate("2026-11-15", futureNow)).toHaveLength(0);
    expect(isBookableDay("2026-11-15", futureNow)).toBe(false);
  });

  it("blocks 2026-09-24 only, while September 24 in another year follows normal rules", () => {
    expect(isBlockedDate("2026-09-24")).toBe(true);
    expect(isBookableDay("2026-09-24", futureNow)).toBe(false);
    expect(getSlotsForDate("2026-09-24", futureNow)).toHaveLength(0);

    // 2027-09-24 is not in blockedDates
    expect(isBlockedDate("2027-09-24")).toBe(false);
    // 2027-09-23 is Thursday in 2027
    expect(isBookableDay("2027-09-23", futureNow)).toBe(true);
    expect(getSlotsForDate("2027-09-23", futureNow)).toHaveLength(2);
  });

  it("hides past slots earlier than now + minNoticeMinutes (60 min)", () => {
    // 2026-11-12 slots are at 14:00 (08:30 UTC) and 15:00 (09:30 UTC)
    // If now is 13:30 IST (08:00 UTC), 14:00 IST is only 30 min away (< 60 min notice), so it must be hidden
    const nowAt1330 = fromZonedTime("2026-11-12T13:30:00", AVAILABILITY_CONFIG.timezone);
    const slots = getSlotsForDate("2026-11-12", nowAt1330);
    expect(slots).toHaveLength(1);
    expect(formatInTimeZone(slots[0], AVAILABILITY_CONFIG.timezone, "HH:mm")).toBe("15:00");
    expect(isBookableDay("2026-11-12", nowAt1330)).toBe(true);

    // If now is 14:30 IST, both 14:00 and 15:00 are within minNotice (or past), so 0 slots remain
    const nowAt1430 = fromZonedTime("2026-11-12T14:30:00", AVAILABILITY_CONFIG.timezone);
    const slotsRemaining = getSlotsForDate("2026-11-12", nowAt1430);
    expect(slotsRemaining).toHaveLength(0);
    expect(isBookableDay("2026-11-12", nowAt1430)).toBe(false);
  });

  it("enforces monthly cap of 15 bookings", () => {
    // Generate 15 fake booked slots in November 2026
    const booked15: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const day = String(i).padStart(2, "0");
      booked15.push(`2026-11-${day}T14:00:00+05:30`);
    }

    expect(getMonthlyBookingsCount("2026-11", booked15)).toBe(15);
    expect(isMonthCapped("2026-11", booked15)).toBe(true);

    // With 15 bookings, November days must not be selectable
    expect(getSlotsForDate("2026-11-12", futureNow, booked15)).toHaveLength(0);
    expect(isBookableDay("2026-11-12", futureNow, booked15)).toBe(false);

    // With 14 bookings, it should still be bookable
    const booked14 = booked15.slice(0, 14);
    expect(isMonthCapped("2026-11", booked14)).toBe(false);
    expect(isBookableDay("2026-11-12", futureNow, booked14)).toBe(true);
  });

  it("removes already-booked slot from the available slot list", () => {
    // Book 14:00 IST on 2026-11-12
    const bookedSlot = fromZonedTime("2026-11-12T14:00:00", AVAILABILITY_CONFIG.timezone);
    const slots = getSlotsForDate("2026-11-12", futureNow, [bookedSlot.toISOString()]);

    expect(slots).toHaveLength(1);
    expect(formatInTimeZone(slots[0], AVAILABILITY_CONFIG.timezone, "HH:mm")).toBe("15:00");
  });

  it("handles viewer timezone conversion crossing midnight correctly", () => {
    // Saturday 2026-11-14 at 11:00 AM IST
    const slotInstant = fromZonedTime("2026-11-14T11:00:00", AVAILABILITY_CONFIG.timezone);

    // In America/Los_Angeles (UTC-8), 11:00 AM IST is 9:30 PM previous day (Friday Nov 13)
    const laDate = formatInTimeZone(slotInstant, "America/Los_Angeles", "yyyy-MM-dd");
    const laTime = formatInTimeZone(slotInstant, "America/Los_Angeles", "h:mmaaa");
    const laDay = formatInTimeZone(slotInstant, "America/Los_Angeles", "eeee");

    expect(laDate).toBe("2026-11-13");
    expect(laDay).toBe("Friday");
    expect(laTime).toBe("9:30pm");
  });

  it("operates with DST-free IST (+05:30) all year round", () => {
    const summer = fromZonedTime("2026-06-15T12:00:00", AVAILABILITY_CONFIG.timezone);
    const winter = fromZonedTime("2026-12-15T12:00:00", AVAILABILITY_CONFIG.timezone);

    const summerOffset = formatInTimeZone(summer, AVAILABILITY_CONFIG.timezone, "xxx");
    const winterOffset = formatInTimeZone(winter, AVAILABILITY_CONFIG.timezone, "xxx");

    expect(summerOffset).toBe("+05:30");
    expect(winterOffset).toBe("+05:30");
  });
});

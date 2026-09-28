import { useMemo } from "react";
import { isBookableDay, formatIsoDate } from "../../shared/slots";

export function useAvailability(year: number, month: number, bookedSlots: string[] = []) {
  const today = useMemo(() => new Date(), []);

  const bookableDates = useMemo(() => {
    const result: Date[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const iso = formatIsoDate(d);
      if (isBookableDay(iso, today, bookedSlots)) {
        result.push(d);
      }
    }
    return result;
  }, [year, month, today, bookedSlots]);

  const hasBookableDates = bookableDates.length > 0;

  const checkDate = (date: Date) => {
    const iso = formatIsoDate(date);
    return isBookableDay(iso, today, bookedSlots);
  };

  return { bookableDates, hasBookableDates, checkDate, today };
}

import { useMemo } from "react";
import { isBookableDay, getBookableDatesInMonth } from "../lib/availability";

export function useAvailability(year: number, month: number) {
  const today = useMemo(() => new Date(), []);

  const bookableDates = useMemo(
    () => getBookableDatesInMonth(year, month, today),
    [year, month, today]
  );

  const hasBookableDates = bookableDates.length > 0;

  const checkDate = (date: Date) => isBookableDay(date, today);

  return { bookableDates, hasBookableDates, checkDate, today };
}

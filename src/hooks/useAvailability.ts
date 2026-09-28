import { useState, useEffect, useMemo } from "react";
import { isBookableDay, formatIsoDate } from "../../shared/slots";
import { fetchAvailability } from "../api/client";

export function useAvailability(year: number, month: number, initialBookedSlots: string[] = []) {
  const [bookedSlots, setBookedSlots] = useState<string[]>(initialBookedSlots);
  const today = useMemo(() => new Date(), []);

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  useEffect(() => {
    let cancelled = false;
    fetchAvailability(monthKey)
      .then((data) => {
        if (!cancelled && data.bookedStarts) {
          setBookedSlots(data.bookedStarts);
        }
      })
      .catch(() => {
        // Fallback gracefully if API is offline or unconfigured
      });
    return () => {
      cancelled = true;
    };
  }, [monthKey]);

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

  return { bookableDates, hasBookableDates, checkDate, today, bookedSlots };
}

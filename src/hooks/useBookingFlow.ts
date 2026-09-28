import { useState, useCallback } from "react";
import type { BookingState, TimeSlot, BookingFormData } from "../types/booking";
import { DEFAULT_TIMEZONE, HOST_NAME, EVENT_TITLE } from "../constants/config";

const INITIAL_FORM: BookingFormData = {
  firstName: "",
  lastName: "",
  email: "",
  guests: [],
  city: "",
  hometown: "",
  income: "",
  landSize: [],
  whatsapp: "",
};

const STORAGE_KEY = "calendly_replica_flow_state";
const BOOKINGS_STORAGE_KEY = "booked_meetings";

export function useBookingFlow() {
  const [state, setState] = useState<BookingState>(() => {
    const now = new Date();
    const fallback: BookingState = {
      step: 1,
      selectedDate: null,
      selectedSlot: null,
      currentMonth: new Date(now.getFullYear(), now.getMonth(), 1),
      timezone: DEFAULT_TIMEZONE,
      formData: INITIAL_FORM,
    };

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      return {
        step: typeof parsed.step === "number" ? parsed.step : 1,
        selectedDate: parsed.selectedDate ? new Date(parsed.selectedDate) : null,
        selectedSlot: parsed.selectedSlot || null,
        currentMonth: parsed.currentMonth
          ? new Date(parsed.currentMonth)
          : new Date(now.getFullYear(), now.getMonth(), 1),
        timezone: typeof parsed.timezone === "string" ? parsed.timezone : DEFAULT_TIMEZONE,
        formData: parsed.formData ? { ...INITIAL_FORM, ...parsed.formData } : INITIAL_FORM,
      };
    } catch {
      return fallback;
    }
  });

  const updateAndPersist = useCallback((updater: (prev: BookingState) => BookingState) => {
    setState((prev) => {
      const next = updater(prev);
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            step: next.step,
            selectedDate: next.selectedDate ? next.selectedDate.toISOString() : null,
            selectedSlot: next.selectedSlot,
            currentMonth: next.currentMonth.toISOString(),
            timezone: next.timezone,
            formData: next.formData,
          })
        );
      } catch {
        // Ignore session storage errors
      }
      return next;
    });
  }, []);

  const selectDate = useCallback((date: Date) => {
    updateAndPersist((s) => ({
      ...s,
      selectedDate: date,
      selectedSlot: null,
      currentMonth: new Date(date.getFullYear(), date.getMonth(), 1),
    }));
  }, [updateAndPersist]);

  const selectSlot = useCallback((slot: TimeSlot) => {
    updateAndPersist((s) => ({
      ...s,
      selectedSlot: slot,
    }));
  }, [updateAndPersist]);

  const proceedToForm = useCallback(() => {
    updateAndPersist((s) => ({ ...s, step: 2 }));
  }, [updateAndPersist]);

  const backToDateTime = useCallback(() => {
    updateAndPersist((s) => ({ ...s, step: 1 }));
  }, [updateAndPersist]);

  const setMonth = useCallback((month: Date) => {
    updateAndPersist((s) => ({ ...s, currentMonth: month }));
  }, [updateAndPersist]);

  const setTimezone = useCallback((tz: string) => {
    updateAndPersist((s) => ({ ...s, timezone: tz }));
  }, [updateAndPersist]);

  const updateFormData = useCallback((updates: Partial<BookingFormData>) => {
    updateAndPersist((s) => ({ ...s, formData: { ...s.formData, ...updates } }));
  }, [updateAndPersist]);

  const confirmBooking = useCallback(() => {
    setState((currentState) => {
      // Store booking locally in localStorage
      if (currentState.selectedDate && currentState.selectedSlot) {
        try {
          const newBooking = {
            id: `booking_${Date.now()}`,
            createdAt: new Date().toISOString(),
            host: HOST_NAME,
            eventTitle: EVENT_TITLE,
            date: currentState.selectedDate.toISOString(),
            slot: currentState.selectedSlot,
            timezone: currentState.timezone,
            attendee: {
              firstName: currentState.formData.firstName,
              lastName: currentState.formData.lastName,
              email: currentState.formData.email,
              guests: currentState.formData.guests,
              city: currentState.formData.city,
              hometown: currentState.formData.hometown,
              income: currentState.formData.income,
              landSize: currentState.formData.landSize,
              whatsapp: currentState.formData.whatsapp,
            },
          };
          const existing = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || "[]");
          localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([...existing, newBooking]));
        } catch (e) {
          console.error("Failed to save booking to localStorage", e);
        }
      }

      const nextState: BookingState = { ...currentState, step: 3 as any };
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            step: nextState.step,
            selectedDate: nextState.selectedDate ? nextState.selectedDate.toISOString() : null,
            selectedSlot: nextState.selectedSlot,
            currentMonth: nextState.currentMonth.toISOString(),
            timezone: nextState.timezone,
            formData: nextState.formData,
          })
        );
      } catch {}
      return nextState;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
    const n = new Date();
    setState({
      step: 1,
      selectedDate: null,
      selectedSlot: null,
      currentMonth: new Date(n.getFullYear(), n.getMonth(), 1),
      timezone: DEFAULT_TIMEZONE,
      formData: INITIAL_FORM,
    });
  }, []);

  return {
    state,
    selectDate,
    selectSlot,
    proceedToForm,
    backToDateTime,
    setMonth,
    setTimezone,
    updateFormData,
    confirmBooking,
    reset,
  };
}

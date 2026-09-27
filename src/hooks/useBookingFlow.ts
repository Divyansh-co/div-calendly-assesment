import { useState, useCallback } from "react";
import type { BookingState, BookingStep, TimeSlot, BookingFormData } from "../types/booking";
import { DEFAULT_TIMEZONE } from "../constants/config";

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

const STORAGE_KEY = "dm_booking_flow_state";

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

  // Sync state to sessionStorage for safe refresh resilience
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
        // Ignore storage write errors (e.g. incognito quota)
      }
      return next;
    });
  }, []);

  const goToStep = useCallback((step: BookingStep) => {
    updateAndPersist((s) => ({ ...s, step }));
  }, [updateAndPersist]);

  const selectDate = useCallback((date: Date) => {
    updateAndPersist((s) => ({
      ...s,
      selectedDate: date,
      selectedSlot: null,
      step: 2,
      currentMonth: new Date(date.getFullYear(), date.getMonth(), 1),
    }));
  }, [updateAndPersist]);

  const selectSlot = useCallback((slot: TimeSlot) => {
    updateAndPersist((s) => ({ ...s, selectedSlot: slot, step: 3 }));
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

  const backToStep1 = useCallback(() => {
    updateAndPersist((s) => ({
      ...s,
      step: 1,
      selectedSlot: null,
      // Preserve the previously selected date's month or current month
      currentMonth: s.selectedDate
        ? new Date(s.selectedDate.getFullYear(), s.selectedDate.getMonth(), 1)
        : s.currentMonth,
    }));
  }, [updateAndPersist]);

  const backToStep2 = useCallback(() => {
    updateAndPersist((s) => ({ ...s, step: 2 }));
  }, [updateAndPersist]);

  const confirmBooking = useCallback(() => {
    updateAndPersist((s) => ({ ...s, step: 4 }));
  }, [updateAndPersist]);

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
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
    goToStep,
    selectDate,
    selectSlot,
    setMonth,
    setTimezone,
    updateFormData,
    backToStep1,
    backToStep2,
    confirmBooking,
    reset,
  };
}

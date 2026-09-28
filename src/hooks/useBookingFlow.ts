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

const BOOKINGS_STORAGE_KEY = "booked_meetings";

export function useBookingFlow() {
  const [state, setState] = useState<BookingState>(() => {
    const now = new Date();
    return {
      step: 1,
      selectedDate: null,
      selectedSlot: null,
      currentMonth: new Date(now.getFullYear(), now.getMonth(), 1),
      timezone: DEFAULT_TIMEZONE,
      formData: INITIAL_FORM,
    };
  });

  const updateState = useCallback((updater: (prev: BookingState) => BookingState) => {
    setState((prev) => updater(prev));
  }, []);

  const selectDate = useCallback(
    (date: Date) => {
      updateState((s) => ({
        ...s,
        selectedDate: date,
        selectedSlot: null,
        currentMonth: new Date(date.getFullYear(), date.getMonth(), 1),
      }));
    },
    [updateState]
  );

  const selectSlot = useCallback(
    (slot: TimeSlot) => {
      updateState((s) => ({
        ...s,
        selectedSlot: slot,
      }));
    },
    [updateState]
  );

  const proceedToForm = useCallback(() => {
    updateState((s) => ({ ...s, step: 2 }));
  }, [updateState]);

  const backToDateTime = useCallback(() => {
    updateState((s) => ({ ...s, step: 1 }));
  }, [updateState]);

  const setMonth = useCallback(
    (month: Date) => {
      updateState((s) => ({ ...s, currentMonth: month }));
    },
    [updateState]
  );

  const setTimezone = useCallback(
    (tz: string) => {
      updateState((s) => ({ ...s, timezone: tz }));
    },
    [updateState]
  );

  const updateFormData = useCallback(
    (updates: Partial<BookingFormData>) => {
      updateState((s) => ({ ...s, formData: { ...s.formData, ...updates } }));
    },
    [updateState]
  );

  const confirmBooking = useCallback(() => {
    setState((currentState) => {
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

      return { ...currentState, step: 3 };
    });
  }, []);

  const reset = useCallback(() => {
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

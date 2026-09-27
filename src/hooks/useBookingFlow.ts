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

export function useBookingFlow() {
  const now = new Date();
  const [state, setState] = useState<BookingState>({
    step: 1,
    selectedDate: null,
    selectedSlot: null,
    currentMonth: new Date(now.getFullYear(), now.getMonth(), 1),
    timezone: DEFAULT_TIMEZONE,
    formData: INITIAL_FORM,
  });

  const goToStep = useCallback((step: BookingStep) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const selectDate = useCallback((date: Date) => {
    setState((s) => ({ ...s, selectedDate: date, selectedSlot: null, step: 2 }));
  }, []);

  const selectSlot = useCallback((slot: TimeSlot) => {
    setState((s) => ({ ...s, selectedSlot: slot, step: 3 }));
  }, []);

  const setMonth = useCallback((month: Date) => {
    setState((s) => ({ ...s, currentMonth: month }));
  }, []);

  const setTimezone = useCallback((tz: string) => {
    setState((s) => ({ ...s, timezone: tz }));
  }, []);

  const updateFormData = useCallback((updates: Partial<BookingFormData>) => {
    setState((s) => ({ ...s, formData: { ...s.formData, ...updates } }));
  }, []);

  const backToStep1 = useCallback(() => {
    setState((s) => ({ ...s, step: 1, selectedSlot: null }));
  }, []);

  const backToStep2 = useCallback(() => {
    setState((s) => ({ ...s, step: 2 }));
  }, []);

  const confirmBooking = useCallback(() => {
    setState((s) => ({ ...s, step: 4 }));
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

export type BookingStep = 1 | 2 | 3;

export interface TimeSlot {
  label: string;       // e.g. "2:00 PM"
  hour: number;        // 24-hour
  minute: number;
  iso?: string;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  guests: string[];
  city: string;
  hometown: string;
  income: string;
  landSize: string[];
  whatsapp: string;
}

export type FormErrors = Partial<Record<keyof BookingFormData | 'guestEmail', string>>;

export interface BookingState {
  step: BookingStep;
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  currentMonth: Date;            // first day of displayed month
  timezone: string;
  formData: BookingFormData;
}

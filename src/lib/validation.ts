import type { BookingFormData, FormErrors } from "../types/booking";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;
const HTML_PATTERN = /<[a-z][\s\S]*>/i;

export const FIELD_MAX_LENGTHS: Record<string, number> = {
  firstName: 50,
  lastName: 50,
  email: 254,
  city: 100,
  whatsapp: 10,
};

function containsHtml(value: string): boolean {
  return HTML_PATTERN.test(value);
}

export function validateField(
  field: keyof BookingFormData,
  value: string | string[]
): string | undefined {
  const str = String(value).trim();

  switch (field) {
    case "firstName":
      if (!str) return "First name is required";
      if (str.length > FIELD_MAX_LENGTHS.firstName) return `First name must be ${FIELD_MAX_LENGTHS.firstName} characters or fewer`;
      if (containsHtml(str)) return "Invalid characters in first name";
      return undefined;

    case "lastName":
      if (!str) return "Last name is required";
      if (str.length > FIELD_MAX_LENGTHS.lastName) return `Last name must be ${FIELD_MAX_LENGTHS.lastName} characters or fewer`;
      if (containsHtml(str)) return "Invalid characters in last name";
      return undefined;

    case "email":
      if (!str) return "Email is required";
      if (str.length > FIELD_MAX_LENGTHS.email || !EMAIL_RE.test(str)) return "Enter a valid email";
      return undefined;

    case "city":
      if (!str) return "City is required";
      if (str.length > FIELD_MAX_LENGTHS.city) return `City must be ${FIELD_MAX_LENGTHS.city} characters or fewer`;
      if (containsHtml(str)) return "Invalid characters in city";
      return undefined;

    case "hometown":
      return !str ? "Select your hometown" : undefined;

    case "income":
      return !str ? "Select your income range" : undefined;

    case "whatsapp": {
      const digits = str.replace(/\D/g, "");
      if (!str) return "WhatsApp number is required";
      if (str !== digits || !PHONE_RE.test(digits)) return "Enter a 10-digit WhatsApp number";
      return undefined;
    }

    default:
      return undefined;
  }
}

export function validateGuestEmail(email: string): string | undefined {
  const str = email.trim();
  if (!str) return "Guest email is required";
  if (str.length > FIELD_MAX_LENGTHS.email || !EMAIL_RE.test(str)) return "Enter a valid email";
  return undefined;
}

export function validateAll(data: BookingFormData): FormErrors {
  const required: (keyof BookingFormData)[] = [
    "firstName", "lastName", "email", "city", "hometown", "income", "whatsapp",
  ];
  const errors: FormErrors = {};
  for (const field of required) {
    const err = validateField(field, data[field]);
    if (err) errors[field] = err;
  }
  return errors;
}

/**
 * Validation logic lives here so it can be reused server-side without rewriting.
 * All rules must be mirrored in any backend that processes this form data.
 */

import type { BookingFormData, FormErrors } from "../types/booking";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;

// Reject anything that looks like an HTML tag or script injection attempt.
// This is an extra layer on top of React's default text-node escaping.
const HTML_PATTERN = /<[a-z][\s\S]*>/i;

export const FIELD_MAX_LENGTHS: Record<string, number> = {
  firstName:  50,
  lastName:   50,
  email:     254, // RFC 5321 max
  city:      100,
  whatsapp:   10,
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
      if (containsHtml(str)) return "First name contains invalid characters";
      return undefined;

    case "lastName":
      if (!str) return "Last name is required";
      if (str.length > FIELD_MAX_LENGTHS.lastName) return `Last name must be ${FIELD_MAX_LENGTHS.lastName} characters or fewer`;
      if (containsHtml(str)) return "Last name contains invalid characters";
      return undefined;

    case "email":
      if (!str) return "Email is required";
      if (str.length > FIELD_MAX_LENGTHS.email) return "Enter a valid email address";
      if (!EMAIL_RE.test(str)) return "Enter a valid email address";
      return undefined;

    case "city":
      if (!str) return "City is required";
      if (str.length > FIELD_MAX_LENGTHS.city) return `City must be ${FIELD_MAX_LENGTHS.city} characters or fewer`;
      if (containsHtml(str)) return "City contains invalid characters";
      return undefined;

    case "hometown":
      return !str ? "Please select your hometown" : undefined;

    case "income":
      return !str ? "Please select your income range" : undefined;

    case "whatsapp": {
      const digits = str.replace(/\D/g, "");
      if (!str) return "WhatsApp number is required";
      // Reject anything that isn't purely digits after stripping —
      // symbols/spaces pasted in should still fail this check if residual non-digits remain.
      if (str !== digits) return "Enter a valid 10-digit WhatsApp number";
      if (!PHONE_RE.test(digits)) return "Enter a valid 10-digit WhatsApp number";
      return undefined;
    }

    default:
      return undefined;
  }
}

export function validateGuestEmail(email: string): string | undefined {
  const str = email.trim();
  if (!str) return "Guest email is required";
  if (str.length > FIELD_MAX_LENGTHS.email) return "Enter a valid email address";
  if (!EMAIL_RE.test(str)) return "Enter a valid email address";
  return undefined;
}

/** Run all required-field validations at once (used on form submit). */
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

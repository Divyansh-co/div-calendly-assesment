import { z } from "zod";
import type { BookingFormData, FormErrors } from "../src/types/booking";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\d{10}$/;
export const HTML_PATTERN = /<[a-z][\s\S]*>/i;

export const FIELD_MAX_LENGTHS: Record<string, number> = {
  firstName: 50,
  lastName: 50,
  email: 254,
  city: 100,
  whatsapp: 10,
};

export function containsHtml(value: string): boolean {
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
      if (str.length > FIELD_MAX_LENGTHS.firstName) {
        return `First name must be ${FIELD_MAX_LENGTHS.firstName} characters or fewer`;
      }
      if (containsHtml(str)) return "Invalid characters in first name";
      return undefined;

    case "lastName":
      if (!str) return "Last name is required";
      if (str.length > FIELD_MAX_LENGTHS.lastName) {
        return `Last name must be ${FIELD_MAX_LENGTHS.lastName} characters or fewer`;
      }
      if (containsHtml(str)) return "Invalid characters in last name";
      return undefined;

    case "email":
      if (!str) return "Email is required";
      if (str.length > FIELD_MAX_LENGTHS.email || !EMAIL_RE.test(str)) {
        return "Enter a valid email";
      }
      return undefined;

    case "city":
      if (!str) return "City is required";
      if (str.length > FIELD_MAX_LENGTHS.city) {
        return `City must be ${FIELD_MAX_LENGTHS.city} characters or fewer`;
      }
      if (containsHtml(str)) return "Invalid characters in city";
      return undefined;

    case "hometown":
      return !str ? "Select your hometown" : undefined;

    case "income":
      return !str ? "Select your income range" : undefined;

    case "whatsapp": {
      const digits = str.replace(/\D/g, "");
      if (!str) return "WhatsApp number is required";
      if (str !== digits || !PHONE_RE.test(digits)) {
        return "Enter a 10-digit WhatsApp number";
      }
      return undefined;
    }

    default:
      return undefined;
  }
}

export function validateGuestEmail(email: string): string | undefined {
  const str = email.trim();
  if (!str) return "Guest email is required";
  if (str.length > FIELD_MAX_LENGTHS.email || !EMAIL_RE.test(str)) {
    return "Enter a valid email";
  }
  return undefined;
}

export function validateAll(data: BookingFormData): FormErrors {
  const required: (keyof BookingFormData)[] = [
    "firstName",
    "lastName",
    "email",
    "city",
    "hometown",
    "income",
    "whatsapp",
  ];
  const errors: FormErrors = {};
  for (const field of required) {
    const err = validateField(field, data[field]);
    if (err) errors[field] = err;
  }
  return errors;
}

export const bookingSubmissionSchema = z.object({
  slotIso: z.string().min(1, "Slot is required"),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(FIELD_MAX_LENGTHS.firstName, `First name must be ${FIELD_MAX_LENGTHS.firstName} characters or fewer`)
    .refine((v) => !HTML_PATTERN.test(v), "Invalid characters in first name"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(FIELD_MAX_LENGTHS.lastName, `Last name must be ${FIELD_MAX_LENGTHS.lastName} characters or fewer`)
    .refine((v) => !HTML_PATTERN.test(v), "Invalid characters in last name"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(FIELD_MAX_LENGTHS.email, "Email is too long")
    .regex(EMAIL_RE, "Enter a valid email"),
  guests: z
    .array(
      z
        .string()
        .trim()
        .max(FIELD_MAX_LENGTHS.email, "Guest email is too long")
        .regex(EMAIL_RE, "Enter a valid guest email")
    )
    .optional()
    .default([]),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(FIELD_MAX_LENGTHS.city, `City must be ${FIELD_MAX_LENGTHS.city} characters or fewer`)
    .refine((v) => !HTML_PATTERN.test(v), "Invalid characters in city"),
  hometown: z.string().trim().min(1, "Hometown is required"),
  income: z.string().trim().min(1, "Income range is required"),
  landSizes: z.array(z.string()).optional().default([]),
  whatsapp: z
    .string()
    .trim()
    .regex(PHONE_RE, "WhatsApp number must be 10 digits"),
  website: z.string().optional().default(""),
});

export type BookingSubmission = z.infer<typeof bookingSubmissionSchema>;

import { describe, it, expect } from "vitest";
import {
  validateField,
  validateGuestEmail,
  validateAll,
  bookingSubmissionSchema,
  FIELD_MAX_LENGTHS,
} from "../shared/validation";

describe("shared/validation", () => {
  it("validates required text fields", () => {
    expect(validateField("firstName", "")).toBe("First name is required");
    expect(validateField("lastName", "   ")).toBe("Last name is required");
    expect(validateField("city", "")).toBe("City is required");
    expect(validateField("hometown", "")).toBe("Select your hometown");
    expect(validateField("income", "")).toBe("Select your income range");
  });

  it("enforces max length constraints", () => {
    const longFirst = "a".repeat(FIELD_MAX_LENGTHS.firstName + 1);
    expect(validateField("firstName", longFirst)).toContain("50 characters or fewer");

    const longCity = "c".repeat(FIELD_MAX_LENGTHS.city + 1);
    expect(validateField("city", longCity)).toContain("100 characters or fewer");
  });

  it("rejects HTML tags in text fields", () => {
    expect(validateField("firstName", "<script>alert(1)</script>")).toBe("Invalid characters in first name");
    expect(validateField("lastName", "<img src=x onerror=alert(1)>")).toBe("Invalid characters in last name");
    expect(validateField("city", "<b>Delhi</b>")).toBe("Invalid characters in city");
  });

  it("validates email formats", () => {
    expect(validateField("email", "")).toBe("Email is required");
    expect(validateField("email", "invalid-email")).toBe("Enter a valid email");
    expect(validateField("email", "user@example.com")).toBeUndefined();
    expect(validateGuestEmail("not-an-email")).toBe("Enter a valid email");
    expect(validateGuestEmail("guest@test.com")).toBeUndefined();
  });

  it("validates 10-digit WhatsApp numbers", () => {
    expect(validateField("whatsapp", "")).toBe("WhatsApp number is required");
    expect(validateField("whatsapp", "12345")).toBe("Enter a 10-digit WhatsApp number");
    expect(validateField("whatsapp", "9876543210abc")).toBe("Enter a 10-digit WhatsApp number");
    expect(validateField("whatsapp", "9876543210")).toBeUndefined();
  });

  it("validates all required fields in form data", () => {
    const emptyErrors = validateAll({
      firstName: "",
      lastName: "",
      email: "",
      guests: [],
      city: "",
      hometown: "",
      income: "",
      landSize: [],
      whatsapp: "",
    });
    expect(Object.keys(emptyErrors)).toHaveLength(7);

    const validErrors = validateAll({
      firstName: "Aman",
      lastName: "Verma",
      email: "aman@example.com",
      guests: [],
      city: "Gurugram",
      hometown: "Delhi/NCR",
      income: "₹50L - ₹1Cr",
      landSize: ["1000 sqm"],
      whatsapp: "9876543210",
    });
    expect(Object.keys(validErrors)).toHaveLength(0);
  });

  it("parses valid submission with zod schema", () => {
    const payload = {
      slotIso: "2026-11-12T14:00:00+05:30",
      firstName: "Aman",
      lastName: "Verma",
      email: "aman@example.com",
      guests: ["colleague@example.com"],
      city: "Gurugram",
      hometown: "Delhi/NCR",
      income: "₹50L - ₹1Cr",
      landSizes: ["1000-2000 sqm"],
      whatsapp: "9876543210",
      website: "",
    };

    const parsed = bookingSubmissionSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid submission with zod schema", () => {
    const payload = {
      slotIso: "",
      firstName: "<script>",
      lastName: "",
      email: "bad",
      city: "",
      hometown: "",
      income: "",
      whatsapp: "123",
    };

    const parsed = bookingSubmissionSchema.safeParse(payload);
    expect(parsed.success).toBe(false);
  });
});

# System Architecture

## Overview

A Calendly-style booking application for high-intent consultations. Built with React 19, TypeScript, Vite, Tailwind CSS, Vercel Serverless Functions, and Neon PostgreSQL.

## Data Flow

1. **Availability Query**
   - The client requests `/api/availability?month=YYYY-MM`.
   - The server queries PostgreSQL for booked slots in that month.
   - The client calculates bookable days and available 60-minute slots using shared availability rules.
   - If a month has no bookable days, an empty-state popover offers navigation to the next month.

2. **Booking Submission**
   - User selects a date and slot; URL updates to keep state shareable (`/?month=...&date=...`).
   - On the details step (`/book/:slotIso`), form inputs are validated on blur and on submit.
   - Payload is submitted via `POST /api/bookings`.
   - The server verifies:
     - Honeypot field (`website`) is blank.
     - Per-IP rate limit has not been exceeded.
     - Payload conforms to the Zod schema (`shared/validation.ts`).
     - Slot time matches predefined recurrence windows in IST (`Asia/Kolkata`).
     - Minimum notice period (60 minutes) is satisfied.
     - Selected date is not in `blockedDates`.
     - Monthly booking cap (15 meetings) is not exceeded.
     - Database insert enforces `UNIQUE(start_at)` to prevent race-condition double bookings.
   - On conflict, the API returns HTTP 409 and the UI presents an inline alert prompting slot re-selection.
   - On success, the API returns the booking ID and redirects to `/confirmed/:id`.

## Slot Calculation Rules

- **Timezone**: All business rules execute against `Asia/Kolkata` (IST).
- **Weekly Schedule**:
  - Thursdays: 14:00 - 16:00 IST (Slots at 2:00 PM, 3:00 PM).
  - Saturdays: 11:00 - 13:00 IST (Slots at 11:00 AM, 12:00 PM).
- **Blocked Dates**: Exact date `2026-09-24` is blocked. Other September 24ths follow standard weekly rules.
- **Monthly Cap**: Maximum 15 bookings per calendar month in IST. When the cap is reached, all subsequent dates in that month become unavailable.
- **Notice Period**: Slots starting earlier than `now + 60 minutes` are excluded.

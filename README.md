# Booking — Divyansh Mishra

A personal appointment booking page for a 60-minute consultation on wealth multiplication through agricultural land investments. Built as a standalone client-side SPA — no backend, no database, no tracking.

The booking flow takes you through three steps: pick a date (Thursdays and Saturdays only), choose a time slot, and fill in a short form. On completion you get a confirmation screen with a downloadable `.ics` calendar file.

## Stack

- **React 19** with TypeScript
- **Vite** for bundling and dev server
- **Tailwind CSS v3** with `@tailwindcss/forms`
- **lucide-react** for icons
- **clsx** for conditional classes

No component library, no external state management, no analytics or tracking scripts.

## Running locally

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

## Folder layout

```
src/
├── components/
│   ├── booking/     # TimeSlotList, BookingForm, BookingSummary, ConfirmationScreen
│   ├── calendar/    # Calendar, CalendarHeader, CalendarGrid, TimezoneSelector
│   ├── event/       # EventDetails (left-panel description)
│   ├── layout/      # Footer
│   └── ui/          # Button, TextInput, RadioGroup, CheckboxGroup, Select, PhoneInput
├── constants/       # config.ts — host name, event title, timezone/form options
├── hooks/           # useBookingFlow (step state), useAvailability
├── lib/             # availability.ts, validation.ts, ics.ts, date-utils.ts
└── types/           # booking.ts
```

## Availability rules

Only Thursdays and Saturdays are bookable. Thursday slots: 2:00 PM and 3:00 PM IST. Saturday slots: 11:00 AM and 12:00 PM IST. September 24, 2026 is hard-blocked regardless of day of week. All slot logic is computed — nothing is a hardcoded string list.

## Security

See [SECURITY.md](./SECURITY.md) for notes on the current hardening applied and the additional server-side controls required before production use with real user data.

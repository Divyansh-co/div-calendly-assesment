# Divyansh Mishra - Wealth Multiplication via Agri Land Investments

A Calendly-style booking application for scheduling consultations with Divyansh Mishra on wealth multiplication via agricultural land investments.

## Overview

A responsive single-page application and serverless backend reproducing the booking flow, styling, and business rules of the original Calendly page.

<!-- Screenshot Placeholder: Add a representative screenshot of the booking interface here -->

## Stack

- **Client**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, clsx, date-fns, date-fns-tz, react-router-dom
- **Backend / API**: Vercel Serverless Functions (`/api`), Neon PostgreSQL (`@neondatabase/serverless`), Zod
- **Testing & Quality**: Vitest, ESLint, Prettier, TypeScript (`tsc`)
- **Deployment**: Vercel

## Setup and Local Development

### Prerequisites
- Node.js 22 or higher
- npm

### Installation

```bash
npm install
```

### Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Set `DATABASE_URL` in `.env.local` with your Neon PostgreSQL connection string.

### Database Migration

Apply the schema to create the `bookings` table and indexes:

```bash
npm run db:migrate
```

### Running Locally

To run the Vite dev server with mocked/client availability:

```bash
npm run dev
```

To run both Vite and the Vercel serverless API locally:

```bash
npx vercel dev
```

## Available Scripts

- `npm run dev`: Start the Vite development server.
- `npm run build`: Typecheck with `tsc` and build the client bundle for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint across the codebase.
- `npm run typecheck`: Run TypeScript compiler checks (`tsc --noEmit`).
- `npm run format`: Format code with Prettier.
- `npm test`: Run the test suite with Vitest.
- `npm run db:migrate`: Execute database migrations using `db/schema.sql`.

## Configuration Guides

### How to Change Availability

Edit `shared/availability.config.ts`:
- **`timezone`**: Business timezone (`Asia/Kolkata`).
- **`durationMinutes`**: Meeting duration in minutes (default `60`).
- **`weekly`**: Recurrence windows for days of the week (e.g. Thursday 14:00-16:00, Saturday 11:00-13:00).
- **`blockedDates`**: Specific ISO date strings (`YYYY-MM-DD`) that are unavailable (e.g. `["2026-09-24"]`).
- **`monthlyCap`**: Maximum meetings allowed per calendar month (default `15`).
- **`minNoticeMinutes`**: Minimum lead time before an appointment (default `60`).

### How to Change Questions

Edit `src/constants/questions.ts`:
- Modify the `QUESTIONS` array to add, reorder, or alter form fields.
- Each item specifies `id`, `type`, `label`, `required`, and optional `options`.
- Update `BookingFormData` in `src/types/booking.ts` and `shared/validation.ts` if adding new fields.

## Known Placeholders

- **Income Options**: The exact options from the original form are unverified. Realistic brackets are defined in `INCOME_OPTIONS` in `src/constants/questions.ts` marked with `// TODO(owner): replace with the exact options from the original form.`

## Deployment

### Vercel Deployment

1. Import the repository into Vercel.
2. In Project Settings > Environment Variables, configure:
   - `DATABASE_URL`: Connection string for your Neon PostgreSQL instance.
3. In Project Settings > Deployment Protection:
   - **Important**: Disable Vercel "Deployment Protection" for the production domain so that the booking page is publicly reachable without authentication.
4. Deploy the project. The build command `npm run build` generates production assets while `/api` functions handle availability and bookings.

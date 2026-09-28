# Security Policy

This document details the security controls implemented in the booking application.

## Implemented Security Controls

### Dual-Layer Input Validation
- Client-side validation validates user input on blur and form submission.
- Serverless API (`api/bookings.ts`) independently parses and validates all payloads using Zod schemas defined in `shared/validation.ts`.
- Text inputs enforce character limits (e.g., 50 characters for names, 100 characters for city) and reject HTML markup patterns to protect against injection attacks.
- Phone numbers enforce a 10-digit numeric format.
- Email fields enforce standard email format and length constraints.

### Database Protection and Concurrency Safety
- All PostgreSQL queries use parameterized tagged template literals (`neon`) to prevent SQL injection.
- The `start_at` column has a `UNIQUE` constraint, enforcing atomicity against concurrent race conditions. Duplicate booking attempts return HTTP 409 Conflict.
- Business availability constraints (weekly recurrence, blocked dates, minimum 60-minute notice, and 15-booking monthly caps) are validated server-side prior to insert.

### Anti-Bot Protection and Rate Limiting
- A hidden honeypot field (`website`) is present in the form and invisible to standard users. Submissions containing content in this field are rejected with HTTP 400.
- An in-memory sliding window rate limiter protects `/api/bookings`, restricting client IPs to 5 requests per minute. Exceeded requests receive HTTP 429 Too Many Requests with a `Retry-After` header. For distributed multi-region deployments, an external store such as Redis is recommended.

### HTTP Response Headers and CSP
HTTP security headers are configured via `vercel.json`:
- `Content-Security-Policy`: Restricts scripts, fonts (`fonts.gstatic.com`), styles (`fonts.googleapis.com`), images, and connect sources. Enforces `frame-ancestors 'none'` to mitigate clickjacking.
- `X-Frame-Options`: Set to `DENY`.
- `X-Content-Type-Options`: Set to `nosniff`.
- `Referrer-Policy`: Set to `strict-origin-when-cross-origin`.
- `Permissions-Policy`: Disables camera, microphone, and geolocation APIs.

### Data Privacy and State Hygiene
- No Personally Identifiable Information (PII) is written to server logs or client console outputs.
- No client-side storage (`localStorage` or `sessionStorage`) is used to persist sensitive user submissions.
- Application state is synchronized through URL parameters and component memory.

### Secrets Management
- All database credentials reside in environment variables (`DATABASE_URL`).
- `.env*` files are excluded from git history via `.gitignore`.
- `.env.example` provides the template without real credentials.

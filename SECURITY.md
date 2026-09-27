# Security Notes

This document outlines the security posture of the booking application and the additional controls that must be in place before this goes live with real user data.

## Current state

The application is a client-side React/TypeScript SPA. It performs no real network requests and stores no data outside of in-memory React state. All validation runs in the browser.

**Applied hardening (already in place):**

- All user inputs validated on blur and on submit with max-length enforcement and HTML-injection detection
- Shared `lib/validation.ts` exports rules in a format suitable for reuse server-side
- Honeypot anti-bot field on the booking form; submit button disabled during pending requests
- Content-Security-Policy meta tag restricting `script-src`, `style-src`, `font-src`, `connect-src`, and `frame-ancestors`
- No PII (name, email, phone, city) logged to the browser console anywhere in the codebase
- No analytics, tracking scripts, or third-party endpoints called
- No hardcoded API keys, credentials, or secrets
- `.env`, `.env.local`, and `.env.*.local` are gitignored; `.env.example` documents the expected variables without real values

---

## Before deploying with a real backend

### Server-side validation
Mirror every rule in `lib/validation.ts` on the server. Client-side validation is UX — it is not a security control. Never persist data that hasn't been validated independently on the server.

### Rate limiting
Apply per-IP and per-phone/email rate limits on the booking submission endpoint (e.g. max 3 bookings per phone per 24 h). A solution like Upstash Ratelimit or a Redis-backed middleware works well here.

### Database / storage
- Use parameterized queries or a type-safe ORM exclusively — no raw SQL string interpolation.
- Encrypt personal data at rest (name, email, phone number). Consider field-level encryption for phone numbers.
- Define and document a data retention policy (e.g. booking records deleted 90 days after the appointment date).

### CORS
Set `Access-Control-Allow-Origin` to the exact production domain only — not `*`.

### HTTPS
Enforce HTTPS-only in production. Redirect all HTTP traffic to HTTPS at the load balancer/CDN level. Use `Strict-Transport-Security: max-age=31536000; includeSubDomains`.

### Cookies / sessions
If authentication or session tokens are introduced: `Secure`, `HttpOnly`, `SameSite=Strict` on all cookies. Do not store session tokens in `localStorage`.

### HTTP security headers
Configure these at the server/CDN layer (they are documented in `index.html` comments but are more effective as HTTP headers):

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### CAPTCHA / bot protection
For high-traffic deployments, replace or supplement the honeypot field with a server-validated CAPTCHA (e.g. Cloudflare Turnstile, hCaptcha) on the booking submission endpoint.

### Vulnerability disclosure
If you discover a security issue, please report it privately before disclosing publicly.

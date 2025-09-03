# Next.js Custom Auth Starter

Features:
- Next.js App Router (14+) with API routes
- TypeScript, TailwindCSS UI
- Prisma + MySQL
- Zod + React Hook Form
- Resend for emails (verification & password reset)
- Session cookie auth (DB-backed) — no JWT
- Email verification
- TOTP 2FA (otplib)
- Password reset

## Quick Start

1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm i`
3. Setup DB schema: `npx prisma db push`
4. Run: `npm run dev`
5. Open http://localhost:3000

## Notes

- Session cookie: `AUTH_COOKIE_NAME` (httpOnly, SameSite=Lax).
- Protect pages using `getCurrentUser()` in server components (see `/dashboard`).
- In production, use HTTPS (`AUTH_COOKIE_SECURE=true`).

## 2FA
- Start setup in **/settings/security**. The server stores a secret; you should add an API to verify a first TOTP code and set `twoFactorEnabled=true`. To keep this example concise, we enable on first successful `/api/auth/2fa/verify` during login OR you can add a verify step after `/api/auth/2fa/setup`.

## Replace in-memory rate limiting with Redis/Upstash in production.

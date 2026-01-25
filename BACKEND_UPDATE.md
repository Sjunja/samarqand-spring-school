# Backend update (Cloudflare D1 + R2)

## What was implemented
- Cloudflare D1 schema for users, sessions, registrations, payments, and submissions (`code/samarqand-school/cloudflare_schema.sql`)
- Cloudflare Pages Functions for:
  - registration + account creation + payment record
  - login/logout/session
  - participant dashboard (payments, receipts, submissions)
  - admin dashboard (manual payment confirmation/rejection)
  - developer dashboard (create users, impersonate)
  - file download proxy from R2
- Auto-emails using MailChannels (copy to school email on every email)
- Printable invoice page (`/invoice/:id`) for participants
- New frontend pages and routes:
  - `/login`, `/dashboard`
  - `/admin/login`, `/admin`
  - `/developer` (Cloudflare Access only)

## How to register as a participant
1. Open `/registration`.
2. Fill the form and set a password.
3. After submission, a confirmation email is sent and you can log in at `/login`.

## How to log in
- Participant: `/login` (email + password created during registration)
- Admin: `/admin/login` (admin user must exist in D1)
- Developer: `/developer` (Cloudflare Access only)

## How to log in as a developer
Prerequisites:
- Cloudflare Access policy must allow your email to open `/developer` and `/api/dev/*`.
- `DEVELOPER_EMAILS` must include your email (comma-separated).

Steps:
1. Open `/developer` in the browser (Cloudflare Access will prompt you).
2. In the Developer dashboard, create admin/participant users.
3. Use "Login as" to impersonate admin or participant and verify flows.

## Required Cloudflare bindings and env vars
Bindings (Pages Functions):
- D1: `DB`
- R2: `REGISTRATION_FILES`

Environment variables:
- `MAIL_FROM` (required)
- `MAIL_FROM_NAME` (optional)
- `MAIL_REPLY_TO` (optional)
- `SCHOOL_EMAIL` (required, copy of all emails)
- `DEVELOPER_EMAILS` (required for `/developer`)
- `VITE_API_BASE_URL` (only if API is on a different domain)

## Payment workflow summary
- Participant uploads a payment receipt in the dashboard.
- Admin confirms or rejects in `/admin` (manual confirmation).
- Auto-email is sent on registration and on confirm/reject (copy to school).




Я сделал API token 
Create Account API Token
R2 Account Token was successfully created
Summary:
Permissions:
Allows the ability to create, list, and delete buckets, edit bucket configuration, read, write, and list objects, and read and write access to data catalog tables and associated metadata.

Buckets:
All R2 buckets on this account
Use this token for authenticating against the Cloudflare API:
Token value
8tyPsqknC5QXj6Nt5HQgdGLk6uAS5pMwCAcjrP9O
Click to copy

Use the following credentials for S3 clients:
Access Key ID
b8406a16be3fe2154333fa27510e4734
Click to copy

Secret Access Key
45c21fdc1b029299fccb115fe6041ab6736d82384a6645b0fadc0a7cc9bcd4eb
Click to copy

Use jurisdiction-specific endpoints for S3 clients:
DefaultEuropean Union (EU)
https://d41537e897da6c3c05d27e0fbeb6906d.r2.cloudflarestorage.com
Click to copy
For security reasons, these token values will not be shown again. Learn more about API token generation


а также

Create User API Token
My R2 User Token was successfully created
Summary:
Permissions:
Allows the ability to create, list, and delete buckets, edit bucket configuration, read, write, and list objects, and read and write access to data catalog tables and associated metadata.

Buckets:
All R2 buckets on this account
Use this token for authenticating against the Cloudflare API:
Token value
3wohz_jrWB-jrJ7s99M-OaThm2xhHpfSHcwDHk-H
Click to copy

Use the following credentials for S3 clients:
Access Key ID
498c9ddcc0248de887eda88387c8db39
Click to copy

Secret Access Key
b953aba66fcf3809d1bbcae7e0117c135d208e7286619f15dbf6045578fa6b19
Click to copy

Use jurisdiction-specific endpoints for S3 clients:
DefaultEuropean Union (EU)
https://d41537e897da6c3c05d27e0fbeb6906d.r2.cloudflarestorage.com
Click to copy



А для D1 скопировал
"d1_databases": [{
    "binding": "DB",
    "database_name": "samarqand_school_db",
    "database_id": "a5be016a-ba1a-459c-89bc-d2cb7d74f278"
 }]
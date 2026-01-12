# User Authentication Documentation

📌 **Purpose:** This document describes the backend authentication flows implemented in this project (Registration, Email Verification, Login, Refresh Token, Forgot/Reset Password, Logout), the related endpoints, validation rules, models, middleware, and examples.

---

## 1. Overview

- Authentication uses JWTs for access and refresh tokens.
- **Access Token:** short-lived token returned in JSON after successful login. Sent in `Authorization: Bearer <token>` header for protected routes.
- **Refresh Token:** long-lived token stored as an **httpOnly cookie** and persisted on the user record in DB. Used to obtain new access tokens.
- Email-based OTP is used for: user verification (during registration) and password reset.
- Environment variables control secrets and expirations (see `backend/.env`). Do NOT commit secrets.

---

## 2. Relevant files

- Controllers: `src/controllers/authController.js`
- Routes: `src/routes/authRoute.js`
- Validators: `src/validators/authValidators.js`
- Models: `src/models/commonAuthModel.js`
- Middleware: `src/middlewares/verifyToken.js`
- Email service helpers: `src/services/sendEmailService.js`

---

## 3. Models

### User (Mongoose)
- Fields:
  - `email` (String, required, unique, lowercased)
  - `password` (String, hashed)
  - `role` ("candidate" | "company")
  - `companyId` (ObjectId, optional)
  - `refreshToken` (String, stored when user logs in)
  - `isVerifedUser` (Boolean)

(See `src/models/commonAuthModel.js`)

---

## 4. Validation rules (server-side)
(See `src/validators/authValidators.js`)

- Register: `email` (valid email), `password` (min 5, max 32), `confirmPassword` (matches), `role` (candidate/company), `companyName` (required when role is company).
- Login: `email`, `password` (same constraints as above)
- Reset Password: `email`, `password`, `confirmPassword`, `otp` (6 digits)

---

## 5. Endpoints
Base URL used in server: `/api` (see `server.js` mounting `authRoute`).

1) POST /api/auth/register
- Description: Start registration. Stores a pending user with hashed password + OTP.
- Validation: `registerSchema` (server-side)
- Request body (example):

```json
{ "email": "user@example.com", "password": "123456", "confirmPassword": "123456", "role": "candidate" }
```
- Response: 200 — { success: true, message: "verification email sent" }
- Notes: An OTP email is sent. Pending user expires shortly (controlled via `OTP_EXPIRATION_MINUTES`).

2) POST /api/auth/verify-user
- Description: Finalize registration using OTP from email.
- Request body: `{ email, otp }`
- Responses:
  - 201 — Registration completed successfully
  - 400/409 — invalid/expired OTP or already verified

3) POST /api/auth/resend-verify-otp
- Description: Resend registration OTP (limited; resendCount enforced).

4) POST /api/auth/login
- Description: Authenticate a verified user.
- Validation: `loginSchema`.
- Request body: `{ email, password }`
- Successful response (200):
```json
{ "success": true, "message": "Login successfull", "accessToken": "<jwt>", "user": { "id": "...", "email": "...", "role": "..." } }
```
- Server actions:
  - Generate access token (signed with `ACCESS_TOKEN_SECRET`, expires per `ACCESS_TOKEN_EXPIRATION`).
  - Generate refresh token (signed with `REFRESH_TOKEN_SECRET`, expires per `REFRESH_TOKEN_EXPIRATION`).
  - Save `refreshToken` to user record.
  - Set cookie `refreshToken` (httpOnly, secure, sameSite: 'lax').

5) POST /api/auth/refresh-token
- Description: Exchange refresh cookie for a new access token.
- Inputs: httpOnly cookie `refreshToken` must be present.
- Server checks token exists in DB and verifies it. If valid, returns new access token.
- Responses:
  - 200 — { success: true, accessToken }
  - 401 — Refresh token missing/invalid/expired (clears cookie and unsets DB refreshToken)

6) POST /api/auth/forgot-password
- Description: Send OTP for password reset to user's email (if user exists).
- Body: `{ email }`
- Response: 200 — OTP sent successfully (server always returns a gentle message when user not found to avoid leaking info).
- Stores hashed OTP in `passwordResetModel` with expiration.

7) POST /api/auth/resend-reset-otp
- Description: Resend the password reset OTP (limited by resendCount)

8) POST /api/auth/reset-password
- Description: Complete password reset with `email`, `otp`, `password`, `confirmPassword`.
- Validation: `resetPasswordSchema`.
- Behavior: Validates OTP, expiry, hashes new password and deletes the reset doc.

9) POST /api/auth/logout
- Protect: `verifyToken` middleware (requires valid access token)
- Description: Clear server's stored refresh token and clear cookie
- Response: 200 — Logged out successfully

10) GET /api/user
- Protect: `verifyToken`
- Description: Return basic user info (`_id`, `role`, `email`)

---

## 6. Middleware — Access token verification
File: `src/middlewares/verifyToken.js`
- Checks `Authorization` header: must start with `Bearer `.
- Verifies token with `ACCESS_TOKEN_SECRET`.
- If expired, returns 401 with message "Token is expired".
- On success: sets `req.user` and `req.userId`.

---

## 7. Token & cookie details
- Access token: returned in JSON; client must store (e.g., memory/localStorage) and send in `Authorization` header.
- Refresh token: stored in DB (`user.refreshToken`) and set as httpOnly cookie with `secure: true` & `sameSite: 'lax'`.
- When refresh token expires or is invalidated, server clears DB refreshToken and clears cookie.
- Env variables (examples in `.env`):
  - `ACCESS_TOKEN_SECRET`
  - `REFRESH_TOKEN_SECRET`
  - `ACCESS_TOKEN_EXPIRATION` (e.g., `1d`)
  - `REFRESH_TOKEN_EXPIRATION` (e.g., `7d`)
  - `OTP_EXPIRATION_MINUTES`

---

## 8. Security & operational notes
- Secrets MUST be kept out of source control. Use environment variables.
- Refresh tokens are persisted to prevent re-use after logout.
- Cookies are `httpOnly` and `secure` — ensure production uses HTTPS.
- Rate-limit or lock excessive OTP resends (there are built-in resend counters in code).

---

## 9. Example client flows (curl)

Login:

```bash
curl -X POST https://<host>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

Refresh (browser automatically sends cookie):

```bash
curl -X POST https://<host>/api/auth/refresh-token \
  -b "refreshToken=<cookie-value>"
```

Protected request with access token:

```bash
curl -X GET https://<host>/api/user \
  -H "Authorization: Bearer <accessToken>"
```

---

## 10. Where I saved this doc
- `backend/docs/user-authentication.md`

---

## 11. Next steps (optional)
- Convert this Markdown to a PDF and add `backend/docs/user-authentication.pdf`.
- Add a small script in `package.json` to generate the PDF (e.g., using `markdown-pdf` or `pandoc`).
- Add a short README section linking to `docs` for developer onboarding.

---

If you'd like, I can convert this Markdown to a polished PDF now and save it under `backend/docs/` — do you want me to generate the PDF automatically or would you like to review/edit the Markdown first?
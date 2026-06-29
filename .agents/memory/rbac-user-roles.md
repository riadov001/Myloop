---
name: RBAC user roles
description: Users table RBAC extension — role enum, email verification, password reset columns and middleware.
---

## Rule
The `usersTable` was extended with RBAC columns. All new columns have safe defaults for backward compat.

New columns: `role` (enum: customer/merchant/moderator, default: customer), `emailVerified` (boolean, default: false), `emailVerifyToken`, `emailVerifyTokenExpires`, `resetToken`, `resetTokenExpires`, `lastLoginAt`.

The `userAuth` middleware lives at `artifacts/api-server/src/middleware/userAuth.ts` and exports:
- `userAuth` — mandatory JWT check, injects `req.user`
- `optionalUserAuth` — injects req.user if valid token, continues either way
- `requireRole(...roles)` — must be chained after `userAuth`

JWT payload includes: `{ id, name, email, role }`.

## Why
Added for merchant dashboard, future moderator roles, and subscription gating.

## How to apply
Always chain `userAuth` before `requireRole`. Never modify `adminAuth.ts` — it handles the separate admin token system.

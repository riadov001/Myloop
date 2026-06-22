---
name: Admin token system
description: How admin authentication tokens work across root and DB admin users
---

Root admin uses a fixed token: `localmarket-root-token-2026` (stored in `adminAuth.ts` as `ROOT_TOKEN`).

DB admin users get a composite token: `localmarket-admin-token-2026:<userId>:<role>` (e.g. `localmarket-admin-token-2026:3:admin`).

`isValidAdminToken()` accepts both formats. `getTokenRole()` returns `"root"` or `"admin"`.

`localStorage` keys: `adminToken` (the full token string), `adminRole` (`"root"` or `"admin"`).

**Why:** Simple token scheme without JWT overhead for admin, preserves role info client-side.

**How to apply:** Any new admin route must use `adminAuth` or `rootAuth` middleware from `src/middleware/adminAuth.ts`.

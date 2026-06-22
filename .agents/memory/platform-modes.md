---
name: Platform modes
description: How boolean platform toggles are stored and served
---

Platform modes (maintenance, registration_enabled, auto_approve_ads, etc.) are stored in the `platform_config` table with `group = 'modes'` and `configType = 'boolean'`.

They are seeded automatically on first call to `GET /admin/modes` via `ensureModeDefaults()` in `admin-modes.ts`.

They are served via `/admin/modes` (separate from `/admin/config` which excludes modes via `ne(group, 'modes')`).

**Why:** Separating modes from API keys/config makes the UI cleaner (toggle cards vs text inputs) and avoids mixing boolean and secret config in the same list.

**How to apply:** Add new modes to `DEFAULT_MODES` array in `admin-modes.ts`. They auto-seed on next API call.

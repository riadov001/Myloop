---
name: bcrypt replacement
description: Why bcryptjs is used instead of bcrypt in this environment
---

`bcrypt` (native C++ addon) is blocked by pnpm's `approve-builds` sandbox policy in this Replit environment and cannot be compiled.

Use `bcryptjs` (pure JS, same API, slightly slower) instead. Already installed in `@workspace/api-server`.

**Why:** pnpm requires interactive `pnpm approve-builds` to allow native build scripts — not possible in automated contexts.

**How to apply:** Always `import bcrypt from "bcryptjs"` in api-server routes. Never add `bcrypt` (without js) as a dependency.

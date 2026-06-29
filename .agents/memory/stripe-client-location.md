---
name: Stripe client location
description: Where the Stripe client lives in the api-server and what it exports.
---

## Rule
Stripe client is at `artifacts/api-server/src/stripeClient.ts`.
It exports: `getUncachableStripeClient(): Promise<Stripe>` and `getStripeSync(): Promise<StripeSync>`.

There is NO `src/stripe/` subdirectory.

Import from routes: `import { getUncachableStripeClient } from "../stripeClient.js"`

## Why
The file uses `stripe-replit-sync` and reads credentials from Replit Connectors API at runtime, so the client cannot be cached (hence "Uncachable").

## How to apply
Always use dynamic import (`await import(...)`) from route handlers to avoid top-level Stripe init errors when credentials are not yet available.

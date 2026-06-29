---
name: Ads schema notes
description: Key constraints on the ads table schema that have caused bugs.
---

## Rule
The ads status enum only contains: `"pending"`, `"published"`, `"rejected"`. There is no `"active"` value.

The `adsTable.userId` column was added later as a nullable integer (no foreign key constraint, for backward compat with existing anonymous ads).

## Why
Using `"active"` in a TypeScript comparison caused a type error. The correct active status is `"published"`.

## How to apply
When filtering for visible/live ads, use `eq(adsTable.status, "published")`.
When checking merchant-owned ads, use `eq(adsTable.userId, userId)` — userId may be null for old ads.

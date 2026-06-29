---
name: Workspace package linking
description: How to add @workspace/* packages as dependencies in this monorepo.
---

## Rule
`pnpm add @workspace/foo` fails with "not in npm registry" error.

To add a workspace package as a dependency:
1. Edit the target package's `package.json` directly, adding `"@workspace/foo": "workspace:*"` under `dependencies`.
2. Run `pnpm install` at the workspace root to link it.

## Why
pnpm's `add` command tries npm registry for unknown packages unless you use `--workspace` flag, but that also fails for non-published packages.

## How to apply
Any time you need to add `@workspace/email`, `@workspace/db`, etc. to a new package, edit package.json and run `pnpm install`.

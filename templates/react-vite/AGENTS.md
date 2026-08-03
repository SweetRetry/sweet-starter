# AGENTS.md

This repository is a React 19 + Vite monorepo using pnpm workspaces and Turborepo.

## Workspace Structure

```text
apps/web/                    # Vite SPA and TanStack Router routes
packages/ui/                 # Shared components, utilities, and global styles
packages/typescript-config/  # Shared TypeScript compiler settings
```

## Key Files

| File | Purpose |
|------|---------|
| `apps/web/src/main.tsx` | Creates the router and renders the app |
| `apps/web/src/routes/` | TanStack Router file-based routes |
| `apps/web/src/routeTree.gen.ts` | Generated route manifest; never edit manually |
| `apps/web/vite.config.ts` | Vite, Router, React Compiler, and Tailwind plugins |
| `packages/ui/src/components/` | Shared UI components |
| `packages/ui/src/styles/globals.css` | Tailwind imports, sources, and theme variables |
| `turbo.json` | Workspace task graph and cache outputs |

## Commands

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm knip
```

Use `pnpm --filter web <script>` to target the Vite app and
`pnpm --filter @workspace/ui <script>` to target the UI package.

## Conventions

- Keep app-specific features in `apps/web/src/`.
- Put reusable components and styling primitives in `packages/ui/src/`.
- Import UI modules through explicit subpaths such as
  `@workspace/ui/components/button`; avoid package barrel files.
- Use `@/` only for files local to `apps/web/src/`.
- Add shared compiler defaults in `packages/typescript-config/`, not in each package.
- Never edit `apps/web/src/routeTree.gen.ts`; the TanStack Router plugin owns it.
- Use `.lazy.tsx` for route components that should be code-split.
- React Compiler is enabled; do not add manual memoization without evidence.
- Run `pnpm lint:fix` and `pnpm build` after code changes.

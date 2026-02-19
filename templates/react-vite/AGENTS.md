# AGENTS.md

This file provides guidance for AI coding agents working on this project.

## Project Overview

This is a **React 19 + Vite SPA starter** with modern tooling. It provides:

- File-based routing (TanStack Router)
- Server state management (TanStack Query)
- Client state management (Zustand)
- Form handling (React Hook Form + Zod)
- Component library (shadcn/ui)
- React Compiler for auto-memoization

## Directory Structure

```
react-vite/
├── src/
│   ├── routes/          # File-based routes (TanStack Router)
│   │   ├── __root.tsx   # Root layout (Outlet + DevTools)
│   │   └── index.lazy.tsx
│   ├── lib/
│   │   └── utils.ts     # cn() helper
│   ├── main.tsx          # App entry point
│   ├── routeTree.gen.ts  # Auto-generated route tree (DO NOT EDIT)
│   └── index.css         # Global styles + Tailwind config
├── public/
├── vite.config.ts
├── biome.json
├── components.json       # shadcn/ui config
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.node.json
```

## Key Files

| File | Purpose |
|------|---------|
| `src/main.tsx` | App entry — creates router, renders `RouterProvider` |
| `src/routes/__root.tsx` | Root layout wrapping all pages |
| `src/routeTree.gen.ts` | Auto-generated route manifest (never edit manually) |
| `src/lib/utils.ts` | `cn()` classname merge utility |
| `src/index.css` | Tailwind directives + shadcn/ui theme variables |
| `vite.config.ts` | Vite plugins: TanStack Router, React + Compiler, Tailwind |
| `components.json` | shadcn/ui component generation config |
| `biome.json` | Linting & formatting rules |

## Development Commands

```bash
# Development
pnpm dev          # Vite dev server with HMR

# Portless — named .localhost URLs (no more port conflicts)
portless proxy start                    # Start proxy daemon (once)
portless myapp pnpm dev                 # → http://myapp.localhost:1355

# Build
pnpm build        # TypeScript check + production build
pnpm preview      # Preview production build

# Quality checks
pnpm lint         # Biome linting
pnpm lint:fix     # Auto-fix lint issues
pnpm format       # Format code with Biome
pnpm knip         # Find unused code and exports
npx -y react-doctor@latest . --verbose  # React project health check
```

## Code Style

This project uses **Biome** for linting and formatting:

- **Tab** indentation
- **Double quotes** for strings
- **Import sorting** enabled
- **Type imports** should use `import type`

Biome scope: `src/**/*.{ts,tsx}` and `*.config.{ts,js}`. The auto-generated `src/routeTree.gen.ts` is excluded.

Run `pnpm lint:fix` to auto-fix issues before committing.

## Routing Conventions

This project uses **TanStack Router file-based routing**. Routes live in `src/routes/`.

- `__root.tsx` — Root layout (always rendered, contains `<Outlet />`)
- `index.lazy.tsx` — Home page (`/`)
- `about.lazy.tsx` — `/about` (use `.lazy.tsx` suffix for code splitting)
- `admin/dashboard.lazy.tsx` — `/admin/dashboard` (nested directories for nested paths)

The `@tanstack/router-plugin` Vite plugin watches `src/routes/` and auto-generates `src/routeTree.gen.ts`. **Never edit this file manually.**

### Adding a New Route

Create a file in `src/routes/`:

```tsx
// src/routes/about.lazy.tsx
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/about")({
  component: About,
})

function About() {
  return <div>About page</div>
}
```

The route tree regenerates automatically on save.

## Adding Features

### Adding a shadcn Component

```bash
pnpm dlx shadcn@latest add card
```

Components are placed in `src/components/ui/`. Import with the `@/` alias:

```tsx
import { Card } from "@/components/ui/card"
```

### State Management

**Server state** — use TanStack Query:

```tsx
import { useQuery } from "@tanstack/react-query"

const { data, isLoading } = useQuery({
  queryKey: ["users"],
  queryFn: () => fetch("/api/users").then(r => r.json()),
})
```

**Client state** — use Zustand:

```tsx
import { create } from "zustand"

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

### Forms

Use React Hook Form with Zod validation:

```tsx
import { useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({ name: z.string().min(1) })

const { register, handleSubmit } = useForm({
  defaultValues: { name: "" },
})
```

## Path Aliases

| Alias | Resolves To |
|-------|-------------|
| `@/*` | `./src/*` |

## Notes for AI Agents

- Run `pnpm lint:fix` after making changes to auto-fix formatting
- Never edit `src/routeTree.gen.ts` — it is auto-generated
- Use `.lazy.tsx` suffix for route files to enable automatic code splitting
- The `@/` prefix is a path alias for `./src/`
- React Compiler is enabled — avoid manual `useMemo`/`useCallback` unless necessary
- Vite uses Rolldown backend (`rolldown-vite`) for faster builds
- shadcn/ui style preset is `new-york` with `neutral` base color

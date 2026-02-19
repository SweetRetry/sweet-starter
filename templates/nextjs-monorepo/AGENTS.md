# AGENTS.md

This file provides guidance for AI coding agents working on this project.

## Project Overview

This is a **Turborepo + Next.js 16 + shadcn/ui** monorepo starter. It provides:

- Monorepo orchestration (Turborepo + pnpm workspaces)
- Web application (Next.js 16 with App Router + Turbopack)
- Shared component library (shadcn/ui + Radix)
- Server state management (TanStack Query)
- Client state management (Zustand)
- Form handling (React Hook Form + Zod)
- Dark mode (next-themes)

## Architecture

```
┌────────────────────────────────────────────┐
│            apps/web (Next.js 16)           │
│  ┌──────────────────────────────────────┐  │
│  │          @workspace/ui               │  │
│  │  (shadcn/ui components + styles)     │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

## Workspace Packages

| Package | Alias | Description |
|---------|-------|-------------|
| `apps/web` | `web` | Next.js 16 application |
| `packages/ui` | `@workspace/ui` | Shared React components + global styles |
| `packages/typescript-config` | `@workspace/typescript-config` | Shared TypeScript configurations |

## Key Files

| File | Purpose |
|------|---------|
| `apps/web/app/layout.tsx` | Root layout — Geist fonts, global CSS, Providers |
| `apps/web/app/page.tsx` | Home page |
| `apps/web/components/providers.tsx` | Client providers (next-themes) |
| `apps/web/next.config.mjs` | Next.js config — transpilePackages for `@workspace/ui` |
| `packages/ui/src/components/` | Shared React components (shadcn/ui) |
| `packages/ui/src/lib/utils.ts` | `cn()` classname merge utility |
| `packages/ui/src/styles/globals.css` | Tailwind directives + OKLch theme variables |
| `turbo.json` | Turborepo task pipeline |
| `pnpm-workspace.yaml` | Workspace package definitions |
| `biome.json` | Linting & formatting rules |
| `knip.json` | Unused code detection config |

## Development Commands

```bash
# Development
pnpm dev          # Start all apps via Turborepo (Next.js with Turbopack)

# Portless — named .localhost URLs (no more port conflicts)
portless proxy start                    # Start proxy daemon (once)
portless web pnpm --filter web dev      # → http://web.localhost:1355

# Build
pnpm build        # Build all packages in dependency order

# Quality checks
pnpm lint         # Biome linting across all packages
pnpm lint:fix     # Auto-fix lint issues
pnpm format       # Format code with Biome
pnpm knip         # Find unused code and exports
npx -y react-doctor@latest . --verbose  # React project health check

# Per-app commands
pnpm --filter web typecheck   # TypeScript checking for web app
pnpm --filter web dev         # Start only the web app
```

## Code Style

This project uses **Biome** for linting and formatting:

- **2-space** indentation
- **Double quotes** for strings
- **No semicolons** (inserted only as needed)
- **Trailing commas** (ES5 style)
- **100-character** line width
- **Import sorting** enabled

Biome scope: `**/*.{ts,tsx,js,jsx,json}` (excludes `next-env.d.ts`).

Run `pnpm lint:fix` to auto-fix issues before committing.

## Adding Features

### Adding a New Page

Create a file in `apps/web/app/`:

```tsx
// apps/web/app/about/page.tsx
export default function AboutPage() {
  return <div>About page</div>
}
```

Next.js App Router uses folder-based routing. Each `page.tsx` becomes a route.

### Adding a shadcn Component

```bash
# Add to the UI package
pnpm dlx shadcn@latest add card -c packages/ui

# Import in apps/web
import { Card } from "@workspace/ui/components/card"
```

Components live in `packages/ui/src/components/`. The UI package exports them via the `exports` field in `package.json`.

### Server Actions

```tsx
// apps/web/app/actions.ts
"use server"

export async function createUser(formData: FormData) {
  const name = formData.get("name")
  // ...
}
```

### Adding a Client Provider

Wrap new providers in `apps/web/components/providers.tsx`:

```tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
```

## TypeScript Configurations

| Config | Used By | Key Settings |
|--------|---------|--------------|
| `base.json` | Root workspace | ES2022, NodeNext, strict |
| `nextjs.json` | `apps/web` | Extends base, Bundler resolution, JSX preserve |
| `react-library.json` | `packages/ui` | Extends base, react-jsx |

## Path Aliases

| Alias | Scope | Resolves To |
|-------|-------|-------------|
| `@/*` | `apps/web` | `./*` (relative to apps/web) |
| `@workspace/ui/*` | `apps/web` | `../../packages/ui/src/*` |

## Notes for AI Agents

- Run `pnpm lint:fix` after making changes to auto-fix formatting
- The `@workspace/` prefix is an alias for internal packages
- Global CSS is owned by `packages/ui` — import via `@workspace/ui/globals.css`
- PostCSS config is shared from `packages/ui` — `apps/web` re-exports it
- Next.js uses Turbopack in dev mode (`next dev --turbopack`)
- `transpilePackages: ["@workspace/ui"]` is required in `next.config.mjs`
- The UI package uses `exports` field — import paths must match declared exports
- Tailwind CSS v4 uses OKLch color space for theme variables
- When adding dependencies, add to the correct workspace (`pnpm --filter web add ...`)

# React + Vite Monorepo

A React 19 monorepo starter powered by Vite, pnpm workspaces, and Turborepo.

## Tech Stack

- **React 19** with React Compiler
- **TypeScript** with shared strict configs
- **Vite** for development and production builds
- **Turborepo** and **pnpm workspaces** for task orchestration
- **Tailwind CSS v4** and **shadcn/ui**
- **TanStack Router** and **TanStack Query**
- **Biome** and **Knip** for code quality

## Getting Started

```bash
pnpm install
pnpm dev
```

The root commands orchestrate workspace tasks through Turbo:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development tasks |
| `pnpm build` | Type-check and build all apps |
| `pnpm preview` | Preview the web production build |
| `pnpm typecheck` | Type-check all workspaces |
| `pnpm lint` | Check the repository with Biome |
| `pnpm lint:fix` | Fix safe Biome issues |
| `pnpm format` | Format supported files |
| `pnpm knip` | Find unused code and dependencies |

## Project Structure

```text
.
├── apps/
│   └── web/                    # React + Vite application
├── packages/
│   ├── ui/                     # Shared UI components and global styles
│   └── typescript-config/      # Shared TypeScript configs
├── biome.json
├── knip.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Adding shadcn/ui Components

Run shadcn from the shared UI package so generated components remain reusable:

```bash
cd packages/ui
pnpm dlx shadcn@latest add card
```

Import shared components through explicit package subpaths:

```tsx
import { Button } from "@workspace/ui/components/button"
```

The app-local `@/` alias resolves to `apps/web/src/`.

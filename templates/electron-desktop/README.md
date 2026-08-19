# Electron Desktop Monorepo

An Electron desktop app starter powered by electron-vite, React 19, pnpm workspaces, and Turborepo.

## Tech Stack

- **Electron** with **electron-vite** (ESM main process, HMR in development)
- **React 19** in the renderer process
- **TypeScript** with shared strict configs
- **Turborepo** and **pnpm workspaces** for task orchestration
- **Tailwind CSS v4** and **shadcn/ui**
- **electron-builder** for packaging
- **Biome** and **Knip** for code quality

## Getting Started

```bash
pnpm install
pnpm dev
```

The root commands orchestrate workspace tasks through Turbo:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start electron-vite dev mode with HMR |
| `pnpm build` | Type-check and build main, preload, and renderer |
| `pnpm start` | Preview the production build |
| `pnpm package` | Build and package installers with electron-builder |
| `pnpm typecheck` | Type-check all workspaces |
| `pnpm lint` | Check the repository with Biome |
| `pnpm lint:fix` | Fix safe Biome issues |
| `pnpm format` | Format supported files |
| `pnpm knip` | Find unused code and dependencies |

## Project Structure

```text
.
├── apps/
│   └── desktop/                # Electron application (electron-vite)
│       ├── src/main/           # Main process
│       ├── src/preload/        # Preload scripts (contextBridge API)
│       └── src/renderer/       # React renderer (Vite + Tailwind)
├── packages/
│   ├── ui/                     # Shared UI components and global styles
│   └── typescript-config/      # Shared TypeScript configs
├── biome.json
├── knip.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Process Model & IPC

The renderer never touches Node.js directly. It calls the typed `window.api`
surface that `src/preload/index.ts` exposes through `contextBridge`:

```tsx
const { electron, chrome, node } = window.api.versions
const pong = await window.api.ping()
```

To add a new IPC method:

1. Register a handler in `apps/desktop/src/main/index.ts` with `ipcMain.handle`
2. Wrap it in `apps/desktop/src/preload/index.ts`
3. Use it from the renderer via `window.api`

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

The app-local `@/` alias resolves to `apps/desktop/src/renderer/src/`.

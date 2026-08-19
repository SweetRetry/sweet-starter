# Tauri Starter

A modern monorepo starter template for building cross-platform desktop applications with Tauri 2 and Next.js 16.

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Desktop Shell | [Tauri](https://v2.tauri.app/) | 2.x |
| Frontend | [Next.js](https://nextjs.org/) | 16.x |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) | - |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| Build System | [Turborepo](https://turbo.build/repo) | 2.x |
| Linting | [Biome](https://biomejs.dev) | 2.x |
| Package Manager | [pnpm](https://pnpm.io/) | 11.x |

## Project Structure

```
tauri-starter/
├── apps/
│   ├── web/                  # Next.js frontend (also serves as Tauri frontend)
│   └── tauri/                # Tauri desktop shell
├── packages/
│   ├── ui/                   # Shared React components (shadcn/ui)
│   └── typescript-config/    # Shared TypeScript configurations
├── biome.json                # Biome configuration
├── knip.json                 # Knip configuration
├── turbo.json                # Turborepo configuration
└── pnpm-workspace.yaml       # pnpm workspace config
```

## Prerequisites

- **Node.js** LTS
- **pnpm** 11
- **Rust** (stable)

### Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Tauri System Dependencies

Follow the [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/) for your operating system.

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development

**Web only:**
```bash
pnpm dev:web
```

**Tauri desktop app (includes web):**
```bash
pnpm dev:tauri
```

**All tasks:**
```bash
pnpm dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all development tasks |
| `pnpm dev:web` | Start Next.js development server |
| `pnpm dev:tauri` | Start Tauri desktop app |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm lint` | Run Biome linter |
| `pnpm check` | Run Biome with auto-fix |
| `pnpm knip` | Find unused code |
| `pnpm tauri` | Access Tauri CLI |

## Building for Production

### Build Tauri Desktop App

```bash
pnpm tauri build
```

This will create platform-specific installers in `apps/tauri/src-tauri/target/release/bundle/`.

## Adding UI Components

To add shadcn/ui components, run at the project root:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components will be placed in `packages/ui/src/components`.

Import components from the `@workspace/ui` package:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## License

MIT
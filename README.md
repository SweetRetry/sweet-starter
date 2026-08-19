# Sweet Starter

> Modern, opinionated starter templates for web development.

[![npm version](https://img.shields.io/npm/v/create-sweet.svg)](https://www.npmjs.com/package/create-sweet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
npm create sweet
```

Or use your preferred package manager:

```bash
# npm
npm create sweet

# yarn
yarn create sweet

# pnpm
pnpm create sweet
```

## Templates

| Template | Description |
|----------|-------------|
| [**Next.js Monorepo**](./templates/nextjs-monorepo) | Turborepo + Next.js + shadcn/ui + Biome + Knip |
| [**React + Vite Monorepo**](./templates/react-vite) | Turborepo + React 19 + Vite + shadcn/ui |
| [**Tauri Desktop**](./templates/tauri-desktop) | Tauri 2 + Next.js + Turborepo |
| [**Electron Desktop**](./templates/electron-desktop) | Electron + electron-vite + React 19 + Turborepo |

## CLI Features

- **🎯 Interactive Selection** — Arrow-key navigation for template selection
- **🔍 Environment Check** — Validates Node.js, pnpm, Rust (Tauri)
- **⚡ Auto Install** — Runs `pnpm install` automatically after download
- **📦 Git Init** — Initializes Git repository with initial commit
- **🏷️ Project Naming** — Auto-updates package.json, index.html, and README
- **🚀 Auto Open** — Optionally opens project in VS Code

## Tech Stack

All templates share these modern tools:

| Category | Tools |
|----------|-------|
| **Framework** | Next.js 16 / React 19 / Tauri 2 / Electron |
| **Language** | TypeScript 5.7+ (Strict Mode) |
| **Styling** | Tailwind CSS v4 |
| **Components** | shadcn/ui |
| **Linting** | Biome |
| **Dead Code** | Knip |
| **Package Manager** | pnpm |

## Requirements

### Common

- Node.js LTS
- pnpm 11

### Tauri Desktop Only

- Rust (install: [rustup.rs](https://rustup.rs))

## Usage

```bash
# Create new project
npm create sweet

# Follow the interactive prompts:
# 1. Select template
# 2. Enter project name
# 3. Wait for download & install
# 4. Start coding!
```

## Project Structure

### Next.js Monorepo

```
my-app/
├── apps/
│   └── web/                 # Next.js application
├── packages/
│   ├── ui/                  # Shared UI components
│   └── typescript-config/   # Shared TS configs
├── biome.json
├── turbo.json
└── pnpm-workspace.yaml
```

### React + Vite Monorepo

```
my-app/
├── apps/
│   └── web/                 # React + Vite application
├── packages/
│   ├── ui/                  # Shared UI components
│   └── typescript-config/   # Shared TS configs
├── turbo.json
└── pnpm-workspace.yaml
```

### Tauri Desktop

```
my-app/
├── apps/
│   ├── web/                 # Next.js frontend (Tauri webview)
│   └── tauri/               # Tauri desktop shell
├── packages/
│   ├── ui/                  # Shared UI components
│   └── typescript-config/   # Shared TS configs
└── turbo.json
```

### Electron Desktop

```
my-app/
├── apps/
│   └── desktop/             # Electron app (electron-vite)
│       ├── src/main/        # Main process
│       ├── src/preload/     # Preload scripts (window.api)
│       └── src/renderer/    # React renderer
├── packages/
│   ├── ui/                  # Shared UI components
│   └── typescript-config/   # Shared TS configs
└── turbo.json
```

## CLI Architecture

```
sweet/starter/
├── create-sweet/           # CLI package (published to npm)
│   ├── src/index.ts
│   └── dist/
│
└── templates/              # Starter templates
    ├── nextjs-monorepo/
    ├── react-vite/
    ├── tauri-desktop/
    └── electron-desktop/
```

## Development

```bash
# Clone repository
git clone https://github.com/sweet/starter.git
cd starter

# Install CLI dependencies
cd create-sweet
pnpm install

# Build CLI
pnpm build

# Test CLI locally
node dist/index.js
```

## Roadmap

- [ ] Add more templates (Svelte, Vue, etc.)
- [ ] Template versioning
- [ ] Custom template sources
- [ ] Offline mode

## License

MIT © [sweet](https://github.com/sweet)

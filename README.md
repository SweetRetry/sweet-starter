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

| Template | Description | Size |
|----------|-------------|------|
| [**Next.js Monorepo**](./templates/nextjs-monorepo) | Turborepo + Next.js + shadcn/ui + Biome + Knip | ~300 KB |
| [**React + Vite**](./templates/react-vite) | React 19 + Vite + Tailwind CSS v4 + shadcn/ui | ~120 KB |
| [**Tauri Desktop**](./templates/tauri-desktop) | Tauri 2 + Next.js + Elysia + Turborepo | ~800 KB |

## CLI Features

- **🎯 Interactive Selection** — Arrow-key navigation for template selection
- **🔍 Environment Check** — Validates Node.js, pnpm, Rust (Tauri), Bun (Tauri)
- **⚡ Auto Install** — Runs `pnpm install` automatically after download
- **📦 Git Init** — Initializes Git repository with initial commit
- **🏷️ Project Naming** — Auto-updates package.json, index.html, and README
- **🚀 Auto Open** — Optionally opens project in VS Code

## Tech Stack

All templates share these modern tools:

| Category | Tools |
|----------|-------|
| **Framework** | Next.js 16 / React 19 / Tauri 2 |
| **Language** | TypeScript 5.7+ (Strict Mode) |
| **Styling** | Tailwind CSS v4 |
| **Components** | shadcn/ui |
| **Linting** | Biome |
| **Dead Code** | Knip |
| **Package Manager** | pnpm |

## Requirements

### Common

- Node.js >= 20
- pnpm >= 10

### Tauri Desktop Only

- Rust (install: [rustup.rs](https://rustup.rs))
- Bun (install: [bun.sh](https://bun.sh))

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

### React + Vite

```
my-app/
├── src/
│   ├── components/ui/       # shadcn/ui components
│   ├── lib/
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── vite.config.ts
```

### Tauri Desktop

```
my-app/
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── backend/             # Elysia API server
│   └── tauri/               # Tauri desktop shell
├── packages/
│   ├── ui/                  # Shared UI components
│   └── api-client/          # Eden Treaty client
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
    └── tauri-desktop/
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

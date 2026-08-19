# AGENTS.md

This file provides guidance for AI coding agents working on this project.

## Project Overview

This is a **Tauri 2 + Next.js 16** monorepo starter. It provides:

- Cross-platform desktop app (Tauri)
- Web frontend (Next.js with static export)
- Shared UI components (shadcn/ui)

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│              apps/tauri (Desktop Shell)                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │              apps/web (Next.js Frontend)           │  │
│  │  ┌────────────────────────────────────────────┐    │  │
│  │  │            @workspace/ui (shadcn/ui)       │    │  │
│  │  └────────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `apps/web/app/` | Next.js App Router pages |
| `apps/tauri/src-tauri/tauri.conf.json` | Tauri configuration |
| `apps/tauri/src-tauri/src/lib.rs` | Rust commands and plugins |
| `packages/ui/src/components/` | Shared React components |
| `turbo.json` | Turborepo task configuration |

## Development Commands

```bash
# Run all dev tasks
pnpm dev

# Individual services
pnpm dev:web      # Next.js dev server
pnpm dev:tauri    # Desktop app (starts web automatically)

# Quality checks
pnpm typecheck    # TypeScript checking
pnpm lint         # Biome linting
pnpm check        # Biome with auto-fix
pnpm knip         # Find unused code

# Build
pnpm build        # Build all (may fail without Rust)
```

## Code Style

This project uses **Biome** for linting and formatting:

- **No semicolons** in JavaScript/TypeScript
- **Double quotes** for strings
- **2-space** indentation
- **Import sorting** enabled
- **Type imports** should use `import type`

Run `pnpm check` to auto-fix issues before committing.

## Adding Features

### Adding a UI Component

```bash
# Add shadcn component
pnpm dlx shadcn@latest add card -c apps/web

# Import in your code
import { Card } from "@workspace/ui/components/card"
```

### Adding a Tauri Command

Edit `apps/tauri/src-tauri/src/lib.rs`:

```rust
#[tauri::command]
fn my_command(arg: String) -> String {
    format!("Received: {}", arg)
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, my_command])
        // ...
}
```

Call from frontend:

```typescript
import { invoke } from "@tauri-apps/api/core"

const result = await invoke("my_command", { arg: "hello" })
```

## Workspace Packages

| Package | Alias | Description |
|---------|-------|-------------|
| `packages/ui` | `@workspace/ui` | Shared React components |
| `packages/typescript-config` | `@workspace/typescript-config` | Shared TS configs |

## TypeScript Configurations

| Config | Used By |
|--------|---------|
| `base.json` | Root |
| `nextjs.json` | apps/web |
| `react-library.json` | packages/ui |

## Testing

Currently no test framework is configured. Recommended additions:

- **Vitest** for unit testing
- **Playwright** for E2E testing

## Troubleshooting

### Tauri build fails

Ensure Rust is installed:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Module resolution issues

Run `pnpm install` to ensure all workspace links are correct.

## Dependencies Update

When updating dependencies:

1. Update version in respective `package.json`
2. Run `pnpm install`
3. Run `pnpm typecheck` to verify compatibility
4. For Tauri, ensure `@tauri-apps/api` and `@tauri-apps/cli` versions match

## Notes for AI Agents

- Always run `pnpm typecheck` after making changes
- Use `pnpm check` to auto-fix linting issues
- The `@workspace/` prefix is an alias for internal packages
- Tauri requires Rust toolchain - some environments may not have it
- Next.js is configured for static export (`output: "export"`)
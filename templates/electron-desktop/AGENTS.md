# AGENTS.md

This repository is an Electron desktop monorepo using electron-vite, React 19, pnpm workspaces, and Turborepo.

## Workspace Structure

```text
apps/desktop/                # Electron app (main, preload, renderer)
packages/ui/                 # Shared components, utilities, and global styles
packages/typescript-config/  # Shared TypeScript compiler settings
```

## Key Files

| File | Purpose |
|------|---------|
| `apps/desktop/src/main/index.ts` | Main process: window lifecycle and `ipcMain` handlers |
| `apps/desktop/src/preload/index.ts` | `contextBridge` surface exposed as `window.api` |
| `apps/desktop/src/preload/index.d.ts` | Global `Window.api` typing for the renderer |
| `apps/desktop/src/renderer/src/main.tsx` | Renderer entry that mounts the React app |
| `apps/desktop/electron.vite.config.ts` | electron-vite main/preload/renderer build config |
| `apps/desktop/electron-builder.yml` | Packaging configuration |
| `packages/ui/src/components/` | Shared UI components |
| `packages/ui/src/styles/globals.css` | Tailwind imports, sources, and theme variables |
| `turbo.json` | Workspace task graph and cache outputs |

## Commands

```bash
pnpm dev
pnpm build
pnpm package
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm knip
```

Use `pnpm --filter desktop <script>` to target the Electron app and
`pnpm --filter @workspace/ui <script>` to target the UI package.

## Conventions

- The renderer is sandboxed: never import Node.js or Electron modules in
  `src/renderer/`; go through the typed `window.api` preload surface instead.
- Add new IPC handlers in `src/main/index.ts`, wrap them in
  `src/preload/index.ts`, and let `DesktopApi` flow to the renderer types.
- Keep app-specific renderer code in `apps/desktop/src/renderer/src/`.
- Put reusable components and styling primitives in `packages/ui/src/`.
- Import UI modules through explicit subpaths such as
  `@workspace/ui/components/button`; avoid package barrel files.
- Use `@/` only for files local to `apps/desktop/src/renderer/src/`.
- Add shared compiler defaults in `packages/typescript-config/`, not in each package.
- Main and preload build as ESM (`"type": "module"`); preload output is
  `out/preload/index.mjs` — keep the `.mjs` reference in `BrowserWindow`.
- Run `pnpm lint:fix` and `pnpm build` after code changes.

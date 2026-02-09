#!/usr/bin/env node

import { createRequire } from "node:module";
import { existsSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { downloadTemplate } from "giget";
import * as p from "@clack/prompts";
import pc from "picocolors";

const require = createRequire(import.meta.url);
const { version: packageVersion } = require("../package.json");

// Template definitions
const TEMPLATES = [
  {
    value: "nextjs-monorepo" as const,
    label: "Next.js Monorepo",
    hint: "Turborepo + Next.js + shadcn/ui + Biome + Knip",
  },
  {
    value: "react-vite" as const,
    label: "React + Vite",
    hint: "React 19 + Vite + Tailwind CSS v4 + shadcn/ui",
  },
  {
    value: "tauri-desktop" as const,
    label: "Tauri Desktop",
    hint: "Tauri 2 + Next.js + Elysia + Turborepo",
  },
];

type TemplateId = (typeof TEMPLATES)[number]["value"];

// Download and setup template
async function downloadAndSetup(templateId: TemplateId, projectName: string): Promise<boolean> {
  const targetDir = resolve(process.cwd(), projectName);

  const downloadSpinner = p.spinner();
  downloadSpinner.start("Downloading template...");

  try {
    // Use giget to download from GitHub
    // Template is in templates/ subdirectory
    const githubRepo = "sweet/starter";
    const templateDir = `templates/${templateId}#main`;

    await downloadTemplate(`github:${githubRepo}/${templateDir}`, {
      dir: targetDir,
      force: false,
      offline: false,
      preferOffline: false,
    });

    // giget creates a subdirectory matching the last path segment
    // e.g., templates/react-vite#main -> creates react-vite folder
    const gigetSubdir = join(targetDir, templateId);
    if (existsSync(gigetSubdir)) {
      const files = readdirSync(gigetSubdir);
      for (const file of files) {
        renameSync(join(gigetSubdir, file), join(targetDir, file));
      }
      rmSync(gigetSubdir, { recursive: true });
    }

    downloadSpinner.stop("Template downloaded successfully!");
    return true;
  } catch (err) {
    downloadSpinner.stop("Failed to download template");
    p.log.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

// Get install command based on template
function getInstallCommand(templateId: TemplateId): string {
  switch (templateId) {
    case "nextjs-monorepo":
    case "tauri-desktop":
      return "pnpm install";
    case "react-vite":
      return "pnpm install";
    default:
      return "pnpm install";
  }
}

// Get dev command based on template
function getDevCommand(templateId: TemplateId): string {
  switch (templateId) {
    case "nextjs-monorepo":
      return "pnpm dev";
    case "react-vite":
      return "pnpm dev";
    case "tauri-desktop":
      return "pnpm dev";
    default:
      return "pnpm dev";
  }
}

// Main function
async function main(): Promise<void> {
  p.intro(`🚀  ${pc.cyan(`Sweet Starter CLI v${packageVersion}`)}`);

  // Select template with arrow keys
  const template = await p.select({
    message: "Pick a starter template:",
    options: TEMPLATES,
  });

  if (p.isCancel(template)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  // Get project name
  const projectName = await p.text({
    message: "What is your project named?",
    placeholder: "my-app",
    validate(value) {
      if (!value) return "Project name is required";
      if (!/^[_a-zA-Z0-9-]+$/.test(value)) {
        return "Project name can only contain letters, numbers, hyphens, and underscores";
      }
      const targetDir = resolve(process.cwd(), value);
      if (existsSync(targetDir)) {
        return `Directory "${value}" already exists`;
      }
    },
  });

  if (p.isCancel(projectName)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  // Download template
  const success = await downloadAndSetup(template, projectName);

  if (success) {
    const installCmd = getInstallCommand(template);
    const devCmd = getDevCommand(template);

    p.note(
      [`${pc.cyan("cd")} ${projectName}`, `${pc.cyan(installCmd)}`, `${pc.cyan(devCmd)}`].join("\n"),
      "Next steps"
    );

    p.outro("Happy coding! 🎉");
  } else {
    process.exit(1);
  }
}

// Run main
main().catch((err) => {
  p.log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});

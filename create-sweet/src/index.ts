#!/usr/bin/env node

import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { downloadTemplate } from "giget";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { execa } from "execa";

const require = createRequire(import.meta.url);
const { version: packageVersion } = require("../package.json");

// Template definitions with estimated sizes
const TEMPLATES = [
  {
    value: "nextjs-monorepo" as const,
    label: "Next.js Monorepo",
    hint: "Turborepo + Next.js + shadcn/ui + Biome + Knip",
    size: "~2.5 MB",
    requirements: ["Node.js >= 20", "pnpm >= 10"],
  },
  {
    value: "react-vite" as const,
    label: "React + Vite",
    hint: "React 19 + Vite + Tailwind CSS v4 + shadcn/ui",
    size: "~1.2 MB",
    requirements: ["Node.js >= 20", "pnpm >= 10"],
  },
  {
    value: "tauri-desktop" as const,
    label: "Tauri Desktop",
    hint: "Tauri 2 + Next.js + Elysia + Turborepo",
    size: "~800 KB",
    requirements: ["Node.js >= 20", "pnpm >= 10", "Rust", "Bun"],
  },
];

type TemplateId = (typeof TEMPLATES)[number]["value"];

// Calculate directory size recursively
function getDirSize(dir: string): number {
  let size = 0;
  const files = readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const path = join(dir, file.name);
    if (file.isDirectory() && file.name !== "node_modules") {
      size += getDirSize(path);
    } else if (file.isFile()) {
      size += statSync(path).size;
    }
  }
  return size;
}

function formatSize(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  if (mb < 0.1) return "<0.1 MB";
  return `~${mb.toFixed(1)} MB`;
}

// Environment check
async function checkEnvironment(templateId: TemplateId): Promise<{ ok: boolean; missing: string[] }> {
  const missing: string[] = [];

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0], 10);
  if (majorVersion < 20) {
    missing.push(`Node.js >= 20 (current: ${nodeVersion})`);
  }

  // Check pnpm
  try {
    await execa("pnpm", ["--version"]);
  } catch {
    missing.push("pnpm >= 10 (not found)");
  }

  // Check Rust (for Tauri)
  if (templateId === "tauri-desktop") {
    try {
      await execa("rustc", ["--version"]);
    } catch {
      missing.push("Rust (not found, install: https://rustup.rs)");
    }

    // Check Bun
    try {
      await execa("bun", ["--version"]);
    } catch {
      missing.push("Bun (not found, install: curl -fsSL https://bun.sh/install | bash)");
    }
  }

  return { ok: missing.length === 0, missing };
}

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Update project name in template files
async function updateProjectName(targetDir: string, projectName: string): Promise<void> {
  // Update package.json name
  const packageJsonPath = join(targetDir, "package.json");
  if (existsSync(packageJsonPath)) {
    try {
      const content = readFileSync(packageJsonPath, "utf-8");
      const pkg = JSON.parse(content);
      pkg.name = projectName;
      writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
    } catch (err) {
      p.log.warn(`Failed to update package.json: ${getErrorMessage(err)}`);
    }
  }

  // Update index.html title for react-vite
  const indexHtmlPath = join(targetDir, "index.html");
  if (existsSync(indexHtmlPath)) {
    let content = readFileSync(indexHtmlPath, "utf-8");
    const safeTitle = escapeHtml(projectName);
    content = content.replace(/<title>.*?<\/title>/, `<title>${safeTitle}</title>`);
    writeFileSync(indexHtmlPath, content);
  }

  // Update README.md title
  const readmePath = join(targetDir, "README.md");
  if (existsSync(readmePath)) {
    let content = readFileSync(readmePath, "utf-8");
    // Replace first line title
    const lines = content.split("\n");
    if (lines[0].startsWith("# ")) {
      lines[0] = `# ${projectName}`;
      writeFileSync(readmePath, lines.join("\n"));
    }
  }
}

// Download and setup template
async function downloadAndSetup(templateId: TemplateId, projectName: string): Promise<boolean> {
  const targetDir = resolve(process.cwd(), projectName);
  const template = TEMPLATES.find((t) => t.value === templateId)!;

  const downloadSpinner = p.spinner();
  downloadSpinner.start(`Downloading ${template.label} (${template.size})...`);

  try {
    const githubRepo = "SweetRetry/sweet-starter";
    const templateDir = `templates/${templateId}#main`;

    await downloadTemplate(`github:${githubRepo}/${templateDir}`, {
      dir: targetDir,
      force: false,
      offline: false,
      preferOffline: false,
    });

    // Move files from subdirectory if created
    const gigetSubdir = join(targetDir, templateId);
    if (existsSync(gigetSubdir)) {
      const files = readdirSync(gigetSubdir);
      for (const file of files) {
        renameSync(join(gigetSubdir, file), join(targetDir, file));
      }
      rmSync(gigetSubdir, { recursive: true });
    }

    downloadSpinner.stop(`Downloaded ${formatSize(getDirSize(targetDir))}`);
    return true;
  } catch (err) {
    downloadSpinner.stop("Failed to download template");
    p.log.error(`Error: ${getErrorMessage(err)}`);
    return false;
  }
}

// Install dependencies
async function installDependencies(targetDir: string): Promise<boolean> {
  const installSpinner = p.spinner();
  installSpinner.start("Installing dependencies with pnpm...");

  try {
    await execa("pnpm", ["install"], {
      cwd: targetDir,
      stdio: "pipe",
    });
    installSpinner.stop("Dependencies installed");
    return true;
  } catch (err) {
    installSpinner.stop("Failed to install dependencies");
    p.log.error(`Error: ${getErrorMessage(err)}`);
    return false;
  }
}

// Initialize git
async function initGit(targetDir: string): Promise<boolean> {
  const gitSpinner = p.spinner();
  gitSpinner.start("Initializing Git repository...");

  try {
    await execa("git", ["init"], { cwd: targetDir, stdio: "pipe" });
    await execa("git", ["add", "."], { cwd: targetDir, stdio: "pipe" });
    await execa("git", ["commit", "-m", "feat: initial commit from create-sweet"], {
      cwd: targetDir,
      stdio: "pipe",
    });
    gitSpinner.stop("Git repository initialized");
    return true;
  } catch (err) {
    gitSpinner.stop("Failed to initialize Git");
    p.log.warn(`Git initialization skipped: ${getErrorMessage(err)}`);
    return false;
  }
}

// Open in VS Code
async function openEditor(targetDir: string): Promise<void> {
  try {
    await execa("code", [targetDir], { stdio: "ignore" });
  } catch {
    // VS Code not installed, ignore
  }
}

// Main function
async function main(): Promise<void> {
  p.intro(`🚀  ${pc.cyan(`Sweet Starter CLI v${packageVersion}`)}`);

  // Select template
  const template = await p.select({
    message: "Pick a starter template:",
    options: TEMPLATES.map((t) => ({
      value: t.value,
      label: t.label,
      hint: `${t.hint} · ${t.size}`,
    })),
  });

  if (p.isCancel(template)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  // Environment check
  const envCheck = await checkEnvironment(template);
  if (!envCheck.ok) {
    p.log.warn("Missing requirements:");
    envCheck.missing.forEach((req) => {
      p.log.warn(`  • ${req}`);
    });
    const continueAnyway = await p.confirm({
      message: "Continue anyway?",
      initialValue: false,
    });
    if (p.isCancel(continueAnyway) || !continueAnyway) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }
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

  const targetDir = resolve(process.cwd(), projectName);

  // Download template
  const downloadSuccess = await downloadAndSetup(template, projectName);
  if (!downloadSuccess) {
    process.exit(1);
  }

  // Update project name in files
  await updateProjectName(targetDir, projectName);

  // Install dependencies
  const installSuccess = await installDependencies(targetDir);
  if (!installSuccess) {
    p.log.warn("\nYou can manually install dependencies later:");
    p.log.warn(`  cd ${projectName} && pnpm install`);
  }

  // Initialize Git
  await initGit(targetDir);

  // Success message
  p.note(
    [
      `${pc.cyan("cd")} ${projectName}`,
      installSuccess ? `${pc.cyan("pnpm dev")}  ${pc.dim("# Start development")}` : `${pc.cyan("pnpm install")}  ${pc.dim("# Install dependencies")}`,
      "",
      `${pc.dim("Your project is ready!")}`,
    ].join("\n"),
    "Next steps"
  );

  // Ask to open in editor
  const shouldOpen = await p.confirm({
    message: "Open in VS Code?",
    initialValue: true,
  });

  if (!p.isCancel(shouldOpen) && shouldOpen) {
    await openEditor(targetDir);
  }

  p.outro("Happy coding! 🎉");
}

// Run main
main().catch((err) => {
  p.log.error(getErrorMessage(err));
  process.exit(1);
});

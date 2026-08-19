"use client"

import { Button } from "@workspace/ui/components/button"
import { useEffect, useState } from "react"

export default function Page() {
  const [isTauri, setIsTauri] = useState(false)

  useEffect(() => {
    // Check if running in Tauri
    setIsTauri("__TAURI__" in window)
  }, [])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Tauri Starter</h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Cross-platform desktop apps with Tauri 2 and Next.js 16.
          </p>
          {isTauri && (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              Running in Tauri
            </span>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <a href="https://v2.tauri.app/start/" target="_blank" rel="noopener noreferrer">
              Tauri Docs
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
              Next.js Docs
            </a>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Tauri 2"
            description="Build smaller, faster desktop apps with web technologies and Rust."
          />
          <FeatureCard
            title="Next.js 16"
            description="React framework with App Router and static export for Tauri."
          />
          <FeatureCard
            title="shadcn/ui"
            description="Beautifully designed components powered by Tailwind CSS v4."
          />
          <FeatureCard
            title="Turborepo"
            description="High-performance monorepo build system for all your apps."
          />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  )
}
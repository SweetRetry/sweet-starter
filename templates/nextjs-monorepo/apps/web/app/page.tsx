"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Loader2, Moon, Sun } from "lucide-react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCounter } from "@/hooks/use-counter"

dayjs.extend(relativeTime)

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

type FormData = z.infer<typeof formSchema>

export default function Page() {
  const { theme, setTheme } = useTheme()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Form submitted:", data)
    alert(`Welcome, ${data.name}! Submitted at ${dayjs().format("YYYY-MM-DD HH:mm")}`)
  }

  const { count, increment, decrement, reset } = useCounter()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Next.js Monorepo Starter
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
            Built at {dayjs().format("YYYY-MM-DD")} · {dayjs().fromNow()} setup
          </p>
        </div>

        <div className="flex gap-4">
          <Button asChild>
            <a href="https://turbo.build/repo/docs" target="_blank" rel="noopener noreferrer">
              Turborepo Docs
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
              shadcn/ui
            </a>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center gap-4"
        >
          <Button variant="outline" size="icon" onClick={decrement}>
            -
          </Button>
          <span className="text-2xl font-bold">{count}</span>
          <Button variant="outline" size="icon" onClick={increment}>
            +
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 text-left">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                {...register("name")}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2 text-left">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
            </Button>
          </form>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FeatureCard
            title="Turborepo"
            description="High-performance build system for JavaScript and TypeScript codebases."
          />
          <FeatureCard
            title="Biome"
            description="Fast formatter and linter, replacing ESLint and Prettier."
          />
          <FeatureCard
            title="Knip"
            description="Find unused files, dependencies and exports in your project."
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

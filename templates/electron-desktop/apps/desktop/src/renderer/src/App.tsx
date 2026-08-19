import { Counter } from "@/components/counter"
import { SystemInfo } from "@/components/system-info"

export default function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Electron Desktop</h1>
      <p className="text-muted-foreground">electron-vite + React 19 + Tailwind CSS v4</p>
      <Counter />
      <SystemInfo />
    </div>
  )
}

import { createLazyFileRoute } from "@tanstack/react-router"
import dayjs from "dayjs"
import { Todos } from "@/lib/api"
import { Counter } from "@/lib/counter"
import { ContactForm } from "@/lib/form"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">React Starter</h1>
      <p className="text-muted-foreground">{dayjs().format("YYYY-MM-DD HH:mm")}</p>
      <Counter />
      <Todos />
      <ContactForm />
    </div>
  )
}

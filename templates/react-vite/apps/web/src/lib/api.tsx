import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
})

type Todo = z.infer<typeof todoSchema>

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
  return todoSchema.array().parse(await res.json())
}

async function toggleTodo(id: number, completed: boolean): Promise<Todo> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
    headers: { "Content-type": "application/json" },
  })
  return todoSchema.parse(await res.json())
}

export function Todos() {
  const queryClient = useQueryClient()
  const { data: todos, isPending } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      toggleTodo(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
  })

  if (isPending) return <div>Loading...</div>

  return (
    <ul className="flex flex-col gap-2">
      {todos?.map((todo) => (
        <li key={todo.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleMutation.mutate({ id: todo.id, completed: !todo.completed })}
          />
          <span className={todo.completed ? "line-through" : ""}>{todo.title}</span>
        </li>
      ))}
    </ul>
  )
}

import { Minus, Plus } from "lucide-react"
import { useCountStore } from "./store"
import { Button } from "./ui/button"

export function Counter() {
  const { count, increment, decrement } = useCountStore()

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={decrement}>
        <Minus size={16} />
      </Button>
      <span className="text-2xl font-bold">{count}</span>
      <Button variant="outline" size="sm" onClick={increment}>
        <Plus size={16} />
      </Button>
    </div>
  )
}

import { Button } from "@workspace/ui/components/button"
import { useState } from "react"

export function SystemInfo() {
  const [pong, setPong] = useState<string | null>(null)
  const { electron, chrome, node } = window.api.versions

  return (
    <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
      <p>
        Electron {electron} · Chromium {chrome} · Node {node}
      </p>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={async () => setPong(await window.api.ping())}>
          Ping main process
        </Button>
        {pong && <span>{pong}</span>}
      </div>
    </div>
  )
}

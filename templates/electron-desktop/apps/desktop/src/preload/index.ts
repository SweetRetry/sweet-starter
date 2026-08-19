import { contextBridge, ipcRenderer } from "electron"

// APIs exposed to the renderer as `window.api`. Add new IPC surface here.
const api = {
  versions: {
    electron: process.versions.electron ?? "",
    chrome: process.versions.chrome ?? "",
    node: process.versions.node ?? "",
  },
  ping: (): Promise<string> => ipcRenderer.invoke("ping"),
}

export type DesktopApi = typeof api

contextBridge.exposeInMainWorld("api", api)
